// normalize.mjs — question normalization for the KV answer cache (AI #6).

/** Lowercase, trim, strip punctuation, collapse whitespace. Pure. */
export function normalizeQuestion(text) {
  if (typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** KV key for the normalized-question answer cache. Pure. */
export function askCacheKey(question) {
  return `askcache:${normalizeQuestion(question)}`;
}
