"use strict";

const { loadQueueState, saveQueueState } = require("./githubQueue");
const { GitHubDurableStateAdapter } = require("./githubStateAdapter");
const { reserveUsage, UsageLimitError } = require("./usageLimiter");
const { normalizeRunnerInput, runWithBoundedRetry } = require("./githubRunner");
const { evaluateAllowance, preflightFromEnv, validateRuntimeBudget } = require("./allowanceGuard");

/** Provider-neutral execution boundary. Implementations own dispatch mechanics. */
class ExecutionAdapter {
  async enqueue(_request) { throw new Error("ExecutionAdapter.enqueue is not implemented"); }
  async dispatch(_request) { throw new Error("ExecutionAdapter.dispatch is not implemented"); }
  async status(_request) { throw new Error("ExecutionAdapter.status is not implemented"); }
  async stopAndDrain(_request) { throw new Error("ExecutionAdapter.stopAndDrain is not implemented"); }
}

/** Provider-neutral state boundary. Implementations must define their consistency guarantees. */
class StateAdapter {
  async load(_key) { throw new Error("StateAdapter.load is not implemented"); }
  async save(_key, _state) { throw new Error("StateAdapter.save is not implemented"); }
  async claim(_request) { throw new Error("StateAdapter.claim is not implemented"); }
  async heartbeat(_request) { throw new Error("StateAdapter.heartbeat is not implemented"); }
  async checkpoint(_request) { throw new Error("StateAdapter.checkpoint is not implemented"); }
  async recordUsage(_request) { throw new Error("StateAdapter.recordUsage is not implemented"); }
  async getMode(_request) { throw new Error("StateAdapter.getMode is not implemented"); }
}

/** Credentials are fetched by name at runtime and never belong in job payloads. */
class SecretProvider {
  async get(_name) { throw new Error("SecretProvider.get is not implemented"); }
}

/** Existing GitHub Actions snapshot storage. Strong atomic claims are deferred to T043. */
class GitHubStateAdapter extends StateAdapter {
  constructor(queueStatePath) {
    super();
    this.queueStatePath = queueStatePath;
  }

  async load(key) {
    if (key !== "queue") throw new Error(`Unsupported GitHub state key: ${key}`);
    return loadQueueState(this.queueStatePath);
  }

  async save(key, state) {
    if (key !== "queue") throw new Error(`Unsupported GitHub state key: ${key}`);
    saveQueueState(this.queueStatePath, state);
  }
}

/** GitHub workflow-dispatch implementation; auth stays in its environment. */
class GitHubExecutionAdapter extends ExecutionAdapter {
  constructor({ token, repository, apiBase = "https://api.github.com", fetchImpl = fetch }) {
    super();
    this.token = token;
    this.repository = repository;
    this.apiBase = apiBase;
    this.fetch = fetchImpl;
  }

  async dispatch({ workflow = "auto-process.yml", ref = "main", inputs = {} } = {}) {
    if (!this.token || !this.repository) return { dispatched: false, reason: "github_credentials_unavailable" };
    const response = await this.fetch(`${this.apiBase}/repos/${this.repository}/actions/workflows/${workflow}/dispatches`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ref, return_run_details: true, inputs }),
    });
    if (!response.ok && response.status !== 204) {
      const detail = await response.text().catch(() => "");
      throw new Error(`GitHub workflow dispatch failed (${response.status}): ${detail.slice(0, 400)}`);
    }
    return { dispatched: true };
  }
}

module.exports = { ExecutionAdapter, StateAdapter, SecretProvider, GitHubStateAdapter, GitHubDurableStateAdapter, GitHubExecutionAdapter, reserveUsage, UsageLimitError, normalizeRunnerInput, runWithBoundedRetry, evaluateAllowance, preflightFromEnv, validateRuntimeBudget };
