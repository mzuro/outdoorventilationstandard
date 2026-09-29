// normalize.mjs — question normalization for the KV answer cache (AI #6).

import { PHYSICS_VERSION } from '../../static/js/ovs/physics/version.mjs';

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

/**
 * KV key for the normalized-question answer cache. Pure. Prefixed with the
 * physics version so a re-base of the modules the answers are grounded in
 * (static/js/ovs/physics/*) invalidates every cached answer at once.
 */
export function askCacheKey(question) {
  return `ask:${PHYSICS_VERSION}:${normalizeQuestion(question)}`;
}
