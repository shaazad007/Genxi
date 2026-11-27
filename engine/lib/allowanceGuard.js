"use strict";

const DEFAULT_MAX_RUNTIME_MINUTES = 320;
const WORKFLOW_TIMEOUT_MINUTES = 350;

class SafePauseError extends Error {
  constructor(reason) {
    super(`Genxi safe pause: ${reason}`);
    this.name = "SafePauseError";
    this.code = "SAFE_PAUSE";
    this.reason = reason;
  }
}

function validateRuntimeBudget(minutes = DEFAULT_MAX_RUNTIME_MINUTES) {
  const value = Number(minutes);
  if (!Number.isInteger(value) || value < 1 || value > WORKFLOW_TIMEOUT_MINUTES) {
    throw new Error(`runtime budget must be an integer from 1 to ${WORKFLOW_TIMEOUT_MINUTES} minutes`);
  }
  return value;
}

function evaluateAllowance({ evidenceStatus, usage = {}, limits = {}, providerQuota = {}, quotaEvidenceFresh = true } = {}) {
  if (evidenceStatus !== "ok") return { allowed: false, reason: "allowance_evidence_missing_or_not_ok" };
  if (!quotaEvidenceFresh) return { allowed: false, reason: "allowance_evidence_stale" };
  if (providerQuota.allDailyQuotas === true) return { allowed: false, reason: "all_ai_provider_daily_quotas_exhausted" };
  const requests = Number(usage.requests || 0);
  const tokens = Number(usage.tokens || 0);
  if (limits.dailyRequests != null && requests >= Number(limits.dailyRequests)) return { allowed: false, reason: "daily_request_allowance_exhausted" };
  if (limits.dailyTokens != null && tokens >= Number(limits.dailyTokens)) return { allowed: false, reason: "daily_token_allowance_exhausted" };
  return {
    allowed: true,
    reason: null,
    remaining: {
      requests: limits.dailyRequests == null ? null : Math.max(0, Number(limits.dailyRequests) - requests),
      tokens: limits.dailyTokens == null ? null : Math.max(0, Number(limits.dailyTokens) - tokens),
    },
  };
}

function preflightFromEnv(env = process.env) {
  const result = evaluateAllowance({
    evidenceStatus: env.GENXI_ALLOWANCE_STATUS,
    usage: { requests: Number(env.GENXI_USAGE_REQUESTS || 0), tokens: Number(env.GENXI_USAGE_TOKENS || 0) },
    limits: {
      dailyRequests: env.GENXI_DAILY_ALLOWANCE_REQUESTS ? Number(env.GENXI_DAILY_ALLOWANCE_REQUESTS) : null,
      dailyTokens: env.GENXI_DAILY_ALLOWANCE_TOKENS ? Number(env.GENXI_DAILY_ALLOWANCE_TOKENS) : null,
    },
    providerQuota: { allDailyQuotas: env.GENXI_ALL_AI_DAILY_QUOTAS === "exhausted" },
    quotaEvidenceFresh: env.GENXI_ALLOWANCE_EVIDENCE_FRESH !== "false",
  });
  return { ...result, runtimeMinutes: validateRuntimeBudget(env.GENXI_JOB_TIME_BUDGET_MINUTES || DEFAULT_MAX_RUNTIME_MINUTES) };
}

if (require.main === module) {
  try {
    const result = preflightFromEnv();
    if (process.env.GITHUB_OUTPUT) {
      require("node:fs").appendFileSync(process.env.GITHUB_OUTPUT, `allowed=${result.allowed}\nreason=${result.reason || "ok"}\nruntime_minutes=${result.runtimeMinutes}\n`);
    }
    console.log(JSON.stringify({ allowed: result.allowed, reason: result.reason, runtimeMinutes: result.runtimeMinutes }));
  } catch (error) {
    if (process.env.GITHUB_OUTPUT) require("node:fs").appendFileSync(process.env.GITHUB_OUTPUT, `allowed=false\nreason=${error.code || "invalid_preflight"}\n`);
    console.log(JSON.stringify({ allowed: false, reason: error.code || "invalid_preflight" }));
  }
}

module.exports = { DEFAULT_MAX_RUNTIME_MINUTES, WORKFLOW_TIMEOUT_MINUTES, SafePauseError, validateRuntimeBudget, evaluateAllowance, preflightFromEnv };
