"use strict";

const MODES = new Set(["preview", "live", "collections", "enqueue", "queue-worker", "scheduled"]);

function normalizeRunnerInput({ mode = "preview", limit = 10, confirmLive = false, collectionHandle = "", enqueueRequestId = "" } = {}) {
  if (!MODES.has(mode)) throw new Error(`Unsupported runner mode: ${mode}`);
  const parsedLimit = Number(limit);
  if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 100000) throw new Error("runner limit must be an integer from 1 to 100000");
  if (mode === "live" && confirmLive !== true) throw new Error("live mode requires explicit confirmLive=true");
  if (collectionHandle && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(collectionHandle)) throw new Error("invalid collection handle");
  if (enqueueRequestId && !/^[A-Za-z0-9_.:-]{1,160}$/.test(enqueueRequestId)) throw new Error("invalid enqueue request ID");
  return { mode, limit: parsedLimit, collectionHandle, enqueueRequestId, liveConfirmed: mode === "live" };
}

function isRetryableRunnerFailure(error, mode) {
  if (mode === "live") return false;
  const status = Number(error?.status || 0);
  return Boolean(error?.retryable || status === 408 || status === 429 || status >= 500 || error?.code === "ETIMEDOUT");
}

async function runWithBoundedRetry(task, { mode = "preview", maxAttempts = 2, delayMs = 15000, sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)) } = {}) {
  let lastError;
  for (let attempt = 1; attempt <= Math.max(1, maxAttempts); attempt += 1) {
    try { return await task({ attempt }); } catch (error) {
      lastError = error;
      if (attempt >= maxAttempts || !isRetryableRunnerFailure(error, mode)) throw error;
      await sleep(delayMs * attempt);
    }
  }
  throw lastError;
}

module.exports = { MODES, normalizeRunnerInput, isRetryableRunnerFailure, runWithBoundedRetry };
