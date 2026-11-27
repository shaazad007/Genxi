"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const path = require("node:path");
function models(extra = {}) {
  const result = spawnSync(process.execPath, ["-e", "const c=require('./engine/lib/config');process.stdout.write(JSON.stringify([c.promptConfig.gemini_model_vision,c.promptConfig.gemini_model_text]));"], {
    cwd: path.resolve(__dirname, ".."), encoding: "utf8",
    env: { ...process.env, SHOPIFY_STORE: "example.myshopify.com", SHOPIFY_CLIENT_ID: "test", SHOPIFY_CLIENT_SECRET: "test", GEMINI_API_KEY: "test", GEMINI_MODEL_VISION: "", GEMINI_MODEL_TEXT: "", ...extra },
  });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}
test("Gemini model defaults match the upstream config", () => assert.deepEqual(models(), ["gemini-3.5-flash-lite", "gemini-3.5-flash-lite"]));
test("Gemini model names can be overridden via environment", () => assert.deepEqual(models({ GEMINI_MODEL_VISION: "vision-test", GEMINI_MODEL_TEXT: "text-test" }), ["vision-test", "text-test"]));
