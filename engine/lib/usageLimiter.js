"use strict";

const DEFAULT_LIMITS = Object.freeze({ dailyRequests: 1000, dailyTokens: 1000000, perMinuteRequests: 30 });

class UsageLimitError extends Error {
  constructor(code, message, limit) {
    super(message);
    this.name = "UsageLimitError";
    this.code = code;
    this.limit = limit;
    this.retryable = code === "MINUTE_USAGE_LIMIT";
  }
}

function utcDay(date) { return date.toISOString().slice(0, 10); }
function utcMinute(date) { return date.toISOString().slice(0, 16); }

/** Tenant-scoped usage gate. The adapter performs the atomic reservation. */
async function reserveUsage(adapter, { shopId, requests = 1, tokens = 0, now = new Date(), limits = {} } = {}) {
  if (!adapter || typeof adapter.reserveUsage !== "function") throw new Error("state adapter does not support atomic usage reservations");
  const effective = { ...DEFAULT_LIMITS, ...limits };
  try {
    return await adapter.reserveUsage({ shopId, day: utcDay(now), minute: utcMinute(now), requests, tokens, limits: effective });
  } catch (error) {
    if (["DAILY_USAGE_LIMIT", "DAILY_TOKEN_LIMIT", "MINUTE_USAGE_LIMIT"].includes(error.code)) {
      throw new UsageLimitError(error.code, error.message, error.limit);
    }
    throw error;
  }
}

module.exports = { DEFAULT_LIMITS, UsageLimitError, reserveUsage, utcDay, utcMinute };
