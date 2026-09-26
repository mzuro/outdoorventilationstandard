// track.mjs — pure validation for POST /api/track (worker hardening,
// finding #2). The route used to accept any JSON, write an unbounded
// `custom:<ts>` value with no TTL, and bump a `clicks:<anything>` counter,
// all into the same KV namespace the rate limiter, daily cap and answer
// cache live in. Everything the route stores now passes through here.

// Explicit allowlist: the only two ids any shipped client sends —
// index.html sends 'custom', search.html sends 'ai_search'. Add here
// when a template starts sending a new id; anything else is a 400.
export const QUESTION_IDS = new Set(['custom', 'ai_search']);
export const TRACK_TEXT_MAX = 200;
export const CUSTOM_TTL = 60 * 60 * 24 * 30; // 30 days, matches ailog: entries

/**
 * Validate a parsed /api/track body.
 * Returns { ok: true, questionId, text } (text is '' unless questionId is
 * 'custom' and a string was supplied; always <= TRACK_TEXT_MAX code
 * points) or { ok: false, error }.
 */
export function validateTrackBody(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, error: 'invalid_body' };
  }
  const questionId = body.question_id;
  if (typeof questionId !== 'string' || !QUESTION_IDS.has(questionId)) {
    return { ok: false, error: 'invalid_question_id' };
  }
  let text = '';
  if (body.text !== undefined && body.text !== null) {
    if (typeof body.text !== 'string') {
      return { ok: false, error: 'invalid_text' };
    }
    if (questionId === 'custom') {
      // Strip C0 + DEL + C1 control characters, collapse whitespace, then
      // cap by code point (Array.from) so a surrogate pair is never split.
      const cleaned = body.text
        .replace(/[\u0000-\u001f\u007f-\u009f]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      text = Array.from(cleaned).slice(0, TRACK_TEXT_MAX).join('');
    }
  }
  return { ok: true, questionId, text };
}
