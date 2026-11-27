"use strict";

const { isValidShopDomain } = require("./oauthInstall");

function createGitHubJobController({ token, repository, branch = "main", pathPrefix = "docs/genxi-state", workflow = "genxi-runner.yml", apiBase = "https://api.github.com", fetchImpl = globalThis.fetch } = {}) {
  if (!token || !repository || typeof fetchImpl !== "function") return null;
  const pathFor = (shop) => `${pathPrefix.replace(/\/+$/, "")}/${encodeURIComponent(shop)}.json`;
  const headers = { Accept: "application/vnd.github+json", Authorization: `Bearer ${token}`, "X-GitHub-Api-Version": "2022-11-28", "Content-Type": "application/json" };
  async function read(shop) {
    const response = await fetchImpl(`${apiBase}/repos/${repository}/contents/${pathFor(shop)}?ref=${encodeURIComponent(branch)}`, { headers, redirect: "error", signal: AbortSignal.timeout(10000) });
    if (response.status === 404) return { state: { schema_version: 1, shop_id: shop, revision: 0, updated_at: null, queue: { jobs: [], requests: [] }, checkpoint: null, usage: null, mode: null }, sha: null };
    if (!response.ok) throw new Error("GitHub queue read failed");
    const payload = await response.json();
    const state = JSON.parse(Buffer.from(String(payload.content || "").replace(/\s/g, ""), "base64").toString("utf8"));
    if (!state || state.schema_version !== 1 || state.shop_id !== shop || !state.queue || !Array.isArray(state.queue.requests) || !Array.isArray(state.queue.jobs)) throw new Error("GitHub queue state invalid");
    return { state, sha: payload.sha || null };
  }
  return {
    async enqueue(request) {
      if (!isValidShopDomain(request.shop)) throw new Error("invalid shop");
      for (let attempt = 0; attempt < 3; attempt += 1) {
        const current = await read(request.shop);
        if (current.state.queue.requests.some((item) => (typeof item === "string" ? item : item.request_id) === request.request_id)) return { queued: false, duplicate: true };
        const next = JSON.parse(JSON.stringify(current.state));
        next.revision = Number.isInteger(next.revision) ? next.revision + 1 : 1;
        next.updated_at = new Date().toISOString();
        next.queue.requests.push({ request_id: request.request_id, logical_job_id: request.logical_job_id, product_ids: request.product_ids, mode: request.mode, created_at: next.updated_at });
        const items = request.product_ids.map((productId) => ({ product_id: productId, title: "", status: "pending", attempts: 0 }));
        next.queue.jobs.push({
          queue_job_id: request.logical_job_id,
          collection_handle: "__selected_products__",
          collection_title: "Selected products",
          criteria: {},
          mode: request.mode,
          submission_order: next.queue.jobs.length + 1,
          created_at: next.updated_at,
          updated_at: next.updated_at,
          status: "queued",
          total: items.length,
          completed: 0,
          skipped: 0,
          failed: 0,
          remaining: items.length,
          items,
          completed_product_ids: [],
          skipped_product_ids: [],
          failed_product_ids: [],
          current_run_id: null,
          last_run_id: null,
          run_history: [],
          wait_reason: null,
          continuation_attempts: 0,
          last_continuation_from_run_id: null,
        });
        const response = await fetchImpl(`${apiBase}/repos/${repository}/contents/${pathFor(request.shop)}`, { method: "PUT", headers, redirect: "error", signal: AbortSignal.timeout(10000), body: JSON.stringify({ message: `genxi: enqueue ${request.request_id}`, branch, sha: current.sha || undefined, content: Buffer.from(`${JSON.stringify(next, null, 2)}\n`).toString("base64") }) });
        if (response.ok) {
          const dispatch = await fetchImpl(`${apiBase}/repos/${repository}/actions/workflows/${workflow}/dispatches`, { method: "POST", headers, redirect: "error", signal: AbortSignal.timeout(10000), body: JSON.stringify({ ref: branch, inputs: { mode: request.mode, confirm_live: request.mode === "live" ? "true" : "false", limit: String(request.product_ids.length), enqueue_request_id: request.request_id, queue_mode: request.mode } }) });
          if (!dispatch.ok && dispatch.status !== 204) throw new Error("GitHub workflow dispatch failed");
          return { queued: true, dispatched: true, duplicate: false, revision: next.revision };
        }
        if (response.status !== 409) throw new Error("GitHub queue write failed");
      }
      throw new Error("GitHub queue CAS retries exhausted");
    },
  };
}

module.exports = { createGitHubJobController };
