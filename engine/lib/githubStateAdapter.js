"use strict";

const STATE_SCHEMA_VERSION = 1;
const SENSITIVE_KEY = /(api[_-]?token|access[_-]?token|refresh[_-]?token|client[_-]?secret|password|private[_-]?key|access[_-]?key)/i;

class CasConflictError extends Error {
  constructor(message = "GitHub state compare-and-swap conflict") {
    super(message);
    this.name = "CasConflictError";
    this.code = "STATE_CAS_CONFLICT";
  }
}

function shopPath(prefix, shopId) {
  if (typeof shopId !== "string" || !/^[a-z0-9][a-z0-9.-]*$/.test(shopId)) {
    throw new Error("valid normalized shopId is required");
  }
  return `${prefix.replace(/\/+$/, "")}/${encodeURIComponent(shopId)}.json`;
}

function emptyState(shopId, now) {
  return {
    schema_version: STATE_SCHEMA_VERSION,
    shop_id: shopId,
    revision: 0,
    updated_at: now,
    queue: { jobs: [], requests: [] },
    checkpoint: { cursor: null, job_id: null, updated_at: null },
    usage: { day: null, requests: 0, tokens: 0, minute: null, minute_requests: 0 },
    mode: { value: "active", epoch: 0 },
  };
}

function decodeContent(value) {
  if (!value) return null;
  const text = Buffer.from(String(value).replace(/\s/g, ""), "base64").toString("utf8");
  return JSON.parse(text);
}

function assertSafe(value, path = "state") {
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    if (SENSITIVE_KEY.test(key)) throw new Error(`secret-like field is not allowed in durable state: ${path}.${key}`);
    assertSafe(child, `${path}.${key}`);
  }
}

function clone(value) { return JSON.parse(JSON.stringify(value)); }

/**
 * GitHub Contents-backed state. The client is injected so production can use
 * Octokit while tests remain offline. Every mutation is a bounded SHA CAS.
 */
class GitHubDurableStateAdapter {
  constructor({ client, repository, branch = "main", pathPrefix = "docs/genxi-state", clock = () => new Date().toISOString(), maxCasRetries = 3 } = {}) {
    if (!client || typeof client.getFile !== "function" || typeof client.putFile !== "function") throw new Error("GitHub state client must provide getFile and putFile");
    if (!repository) throw new Error("GitHub repository is required");
    this.client = client;
    this.repository = repository;
    this.branch = branch;
    this.pathPrefix = pathPrefix;
    this.clock = clock;
    this.maxCasRetries = Math.max(1, maxCasRetries);
  }

  async _read(shopId) {
    const path = shopPath(this.pathPrefix, shopId);
    try {
      const file = await this.client.getFile({ repository: this.repository, path, ref: this.branch });
      const state = decodeContent(file.content);
      if (!state || state.schema_version !== STATE_SCHEMA_VERSION || state.shop_id !== shopId) throw new Error("invalid GitHub state document");
      assertSafe(state);
      return { state, sha: file.sha };
    } catch (error) {
      if (error && (error.status === 404 || error.code === "NOT_FOUND")) return { state: emptyState(shopId, this.clock()), sha: null };
      throw error;
    }
  }

  async load(shopId) { return clone((await this._read(shopId)).state); }

  async save(shopId, state, expectedRevision = state && state.revision) {
    if (!Number.isInteger(expectedRevision)) throw new Error("expected state revision is required");
    return (await this.compareAndSwap(shopId, expectedRevision, state)).state;
  }

  async compareAndSwap(shopId, expectedRevision, nextState) {
    const current = await this._read(shopId);
    if (current.state.revision !== expectedRevision) throw new CasConflictError();
    const state = clone(nextState);
    if (state.shop_id !== shopId || state.schema_version !== STATE_SCHEMA_VERSION) throw new Error("invalid state for CAS");
    state.revision = expectedRevision + 1;
    state.updated_at = this.clock();
    assertSafe(state);
    const result = await this.client.putFile({
      repository: this.repository,
      path: shopPath(this.pathPrefix, shopId),
      branch: this.branch,
      sha: current.sha,
      message: `genxi: update durable state for ${shopId}`,
      content: Buffer.from(`${JSON.stringify(state, null, 2)}\n`).toString("base64"),
    });
    return { state: clone(state), sha: result && result.sha ? result.sha : null };
  }

  async _mutate(shopId, mutator) {
    let last;
    for (let attempt = 0; attempt < this.maxCasRetries; attempt += 1) {
      const current = await this._read(shopId);
      const next = clone(current.state);
      await mutator(next);
      try { return (await this.compareAndSwap(shopId, current.state.revision, next)).state; } catch (error) {
        if (!(error instanceof CasConflictError) && !(error.status === 409)) throw error;
        last = error;
      }
    }
    throw last || new CasConflictError("GitHub state CAS retries exhausted");
  }

  async claim({ shopId, jobId, owner, leaseMs = 120000 } = {}) {
    if (!jobId || !owner) throw new Error("jobId and owner are required");
    let claimed = false;
    const state = await this._mutate(shopId, (next) => {
      const job = next.queue.jobs.find((candidate) => candidate.job_id === jobId || candidate.queue_job_id === jobId);
      if (!job) throw new Error("queue job not found");
      const now = Date.now();
      if (job.lease_owner && Date.parse(job.lease_expires_at || 0) > now && job.lease_owner !== owner) return;
      job.lease_owner = owner;
      job.lease_expires_at = new Date(now + leaseMs).toISOString();
      claimed = true;
    });
    return { claimed, state };
  }

  async heartbeat({ shopId, jobId, owner, leaseMs = 120000 } = {}) {
    return this._mutate(shopId, (next) => {
      const job = next.queue.jobs.find((candidate) => candidate.job_id === jobId || candidate.queue_job_id === jobId);
      if (!job || job.lease_owner !== owner) throw new Error("job lease is not owned by caller");
      job.lease_expires_at = new Date(Date.now() + leaseMs).toISOString();
    });
  }

  async checkpoint({ shopId, jobId, cursor, result } = {}) {
    return this._mutate(shopId, (next) => {
      next.checkpoint = { job_id: jobId || null, cursor: cursor == null ? null : String(cursor), result: result || null, updated_at: this.clock() };
    });
  }

  async recordUsage({ shopId, day, requests = 0, tokens = 0 } = {}) {
    if (!day) throw new Error("usage day is required");
    return this._mutate(shopId, (next) => {
      if (next.usage.day !== day) next.usage = { day, requests: 0, tokens: 0, minute: null, minute_requests: 0 };
      next.usage.requests += Math.max(0, Number(requests) || 0);
      next.usage.tokens += Math.max(0, Number(tokens) || 0);
    });
  }

  async reserveUsage({ shopId, day, minute, requests = 1, tokens = 0, limits = {} } = {}) {
    if (!day || !minute) throw new Error("usage day and minute are required");
    const requestCount = Math.max(0, Number(requests) || 0);
    const tokenCount = Math.max(0, Number(tokens) || 0);
    const dailyRequests = limits.dailyRequests == null ? Infinity : Number(limits.dailyRequests);
    const dailyTokens = limits.dailyTokens == null ? Infinity : Number(limits.dailyTokens);
    const perMinuteRequests = limits.perMinuteRequests == null ? Infinity : Number(limits.perMinuteRequests);
    let reserved;
    const state = await this._mutate(shopId, (next) => {
      if (next.usage.day !== day) next.usage = { day, requests: 0, tokens: 0, minute, minute_requests: 0 };
      if (next.usage.minute !== minute) {
        next.usage.minute = minute;
        next.usage.minute_requests = 0;
      }
      if (next.usage.requests + requestCount > dailyRequests) {
        const error = new Error("daily usage limit exceeded");
        error.code = "DAILY_USAGE_LIMIT";
        error.limit = dailyRequests;
        throw error;
      }
      if (next.usage.tokens + tokenCount > dailyTokens) {
        const error = new Error("daily token limit exceeded");
        error.code = "DAILY_TOKEN_LIMIT";
        error.limit = dailyTokens;
        throw error;
      }
      if (next.usage.minute_requests + requestCount > perMinuteRequests) {
        const error = new Error("per-minute usage limit exceeded");
        error.code = "MINUTE_USAGE_LIMIT";
        error.limit = perMinuteRequests;
        throw error;
      }
      next.usage.requests += requestCount;
      next.usage.tokens += tokenCount;
      next.usage.minute_requests += requestCount;
      reserved = { day, minute, requests: next.usage.requests, tokens: next.usage.tokens, minute_requests: next.usage.minute_requests };
    });
    return { state, usage: reserved };
  }

  async getMode({ shopId } = {}) { return (await this._read(shopId)).state.mode; }
}

module.exports = { GitHubDurableStateAdapter, CasConflictError, emptyState, assertSafe };
