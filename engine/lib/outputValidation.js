"use strict";

const MAX_MODEL_JSON_BYTES = 256 * 1024;

function validationError(message) {
  const error = new Error(message);
  error.code = "INVALID_MODEL_OUTPUT";
  return error;
}

function parseStructuredJson(text, label = "model") {
  if (typeof text !== "string" || !text.trim() || Buffer.byteLength(text, "utf8") > MAX_MODEL_JSON_BYTES) {
    throw validationError(`${label} returned empty or oversized JSON output`);
  }
  const trimmed = text.trim();
  if (trimmed.startsWith("```") || trimmed.endsWith("```")) throw validationError(`${label} returned markdown instead of JSON`);
  let value;
  try { value = JSON.parse(trimmed); } catch (error) {
    throw validationError(`${label} returned invalid JSON: ${error.message}`);
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) throw validationError(`${label} JSON root must be an object`);
  return value;
}

function requireString(value, field, { max = 4096, allowEmpty = true } = {}) {
  if (typeof value !== "string" || value.length > max || (!allowEmpty && value.trim() === "")) {
    throw validationError(`model field ${field} must be a ${allowEmpty ? "bounded " : "non-empty "}string`);
  }
}

function requireStringArray(value, field, { maxItems = 20, maxItemLength = 512 } = {}) {
  if (!Array.isArray(value) || value.length > maxItems || value.some((item) => typeof item !== "string" || item.length > maxItemLength)) {
    throw validationError(`model field ${field} must be a bounded string array`);
  }
}

function validateGenerationResult(result, { includeDesignProfile = false } = {}) {
  if (!result || typeof result !== "object" || Array.isArray(result)) throw validationError("generation result must be an object");
  const content = result.description_content;
  if (!content || typeof content !== "object" || Array.isArray(content)) throw validationError("description_content is required");
  for (const field of ["intro", "design_summary", "fabric_components", "visual_details", "styling_note"]) {
    requireString(content[field], `description_content.${field}`, { max: 8000 });
  }
  requireStringArray(content.feature_bullets, "description_content.feature_bullets");
  requireStringArray(content.component_bullets, "description_content.component_bullets");
  requireString(result.key_visual_detail, "key_visual_detail", { max: 128, allowEmpty: false });
  requireStringArray(result.tags, "tags", { maxItems: 20, maxItemLength: 128 });
  requireString(result.image_alt_text, "image_alt_text", { max: 512 });
  if (includeDesignProfile && result.design_profile != null && (typeof result.design_profile !== "object" || Array.isArray(result.design_profile))) {
    throw validationError("design_profile must be an object when present");
  }
  return result;
}

function validateVisionResult(result) {
  if (!result || typeof result !== "object" || Array.isArray(result)) throw validationError("vision result must be an object");
  requireString(result.product_type, "product_type", { max: 256 });
  requireString(result.style, "style", { max: 128 });
  requireStringArray(result.observed_details, "observed_details", { maxItems: 30, maxItemLength: 512 });
  requireStringArray(result.colors, "colors", { maxItems: 12, maxItemLength: 128 });
  requireString(result.confidence_notes, "confidence_notes", { max: 1024 });
  return result;
}

module.exports = { MAX_MODEL_JSON_BYTES, parseStructuredJson, validateGenerationResult, validateVisionResult };
