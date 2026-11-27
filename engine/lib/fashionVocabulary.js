"use strict";

// Controlled Pakistani/South Asian apparel terms. These are prompt guidance,
// not labels to apply automatically; visual or textual evidence is required.
const PAKISTANI_FASHION_VOCABULARY = Object.freeze([
  "shalwar kameez", "kameez", "kurta", "kurti", "co-ord", "unstitched suit", "three-piece suit",
  "shalwar", "trouser", "gharara", "sharara", "lehenga", "saree", "dupatta", "chunni",
  "gala (neckline)", "daman/daaman (hem)", "chaak (side slit)", "kalidar", "angrakha",
  "lawn", "cambric", "khaddar", "karandi", "cotton", "silk", "chiffon", "organza", "georgette", "net",
  "zari", "zardozi", "dabka", "naqshi", "tilla", "resham", "gota", "mukesh", "sequin", "mirror work",
  "cutwork", "lace", "kinari", "tassel", "bootis", "jaal", "paisley", "floral", "block print", "ajrak",
]);

function buildPakistaniFashionVocabularyPrompt() {
  return `PAKISTANI/SOUTH ASIAN FASHION VOCABULARY (use only when visibly or textually verified): ${PAKISTANI_FASHION_VOCABULARY.join(", ")}. Treat gala as a neckline term and daman/daaman as a hem term. Preserve the product's spelling when supplied. Do not infer a fabric, construction technique, garment type, or regional style solely from a vague visual resemblance; use a broader factual term or omit it when uncertain.`;
}

module.exports = { PAKISTANI_FASHION_VOCABULARY, buildPakistaniFashionVocabularyPrompt };
