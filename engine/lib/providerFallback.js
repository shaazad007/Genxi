"use strict";

async function runProviderFallback(
  providers,
  { unavailableProviders = new Map(), onAttempt = () => {}, onLimited = () => {} } = {},
) {
  const limitedProviders = [];
  for (const provider of providers) {
    if (!provider.configured || unavailableProviders.has(provider.name)) continue;
    onAttempt(provider);
    try {
      return { result: await provider.generate(), providerName: provider.name };
    } catch (providerErr) {
      const retryableProviderFailure = providerErr && (
        providerErr.dailyQuotaExhausted ||
        providerErr.providerLimitReached ||
        providerErr.code === "INVALID_MODEL_OUTPUT" ||
        providerErr.status === 408 ||
        providerErr.status === 429 ||
        providerErr.status >= 500
      );
      if (!retryableProviderFailure) {
        throw providerErr;
      }
      unavailableProviders.set(provider.name, providerErr);
      limitedProviders.push(providerErr);
      const reason = providerErr.dailyQuotaExhausted
        ? "daily quota exhausted"
        : providerErr.providerLimitReached || providerErr.status === 429
          ? "rate limit reached"
          : providerErr.code === "INVALID_MODEL_OUTPUT"
            ? "returned invalid structured output"
            : "transient provider failure";
      onLimited(provider, providerErr, reason);
    }
  }

  const cascadeErr = new Error("All configured image providers failed or reached their limits.");
  cascadeErr.providerCascadeExhausted = true;
  const exhaustedProviders = Array.from(unavailableProviders.values());
  cascadeErr.allDailyQuotas = exhaustedProviders.length > 0 &&
    exhaustedProviders.every((item) => item.dailyQuotaExhausted);
  cascadeErr.cause = limitedProviders[limitedProviders.length - 1];
  throw cascadeErr;
}

module.exports = { runProviderFallback };
