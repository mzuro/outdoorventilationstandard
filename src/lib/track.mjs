// track.mjs — pure validation for POST /api/track (worker hardening,
// finding #2). The route used to accept any JSON, write an unbounded
// `custom:<ts>` value with no TTL, and bump a `clicks:<anything>` counter,
// all into the same KV namespace the rate limiter, daily cap and answer
// cache live in. Everything the route stores now passes through here.

// Both shipped clients send an id from this set today: index.html sends
// 'custom', search.html sends 'ai_search' — hence '_' is allowed alongside
// the requested [a-z0-9-] so the search page's counter keeps working.
export const QUESTION_ID_RE = /^[a-z0-9_-]{1,64}$/;
export const TRACK_TEXT_MAX = 200;
export const CUSTOM_TTL = 60 * 60 * 24 * 30; // 30 days, matches ailog: entries

/**
 * Validate a parsed /api/track body.
 * Returns { ok: true, questionId, text } (text is '' unless questionId is
 * 'custom' and a string was supplied; always <= TRACK_TEXT_MAX chars) or
 * { ok: false, error }.
 */
export function validateTrackBody(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, error: 'invalid_body' };
  }
  const questionId = body.question_id;
  if (typeof questionId !== 'string' || !QUESTION_ID_RE.test(questionId)) {
    return { ok: false, error: 'invalid_question_id' };
  }
  let text = '';
  if (body.text !== undefined && body.text !== null) {
    if (typeof body.text !== 'string') {
      return { ok: false, error: 'invalid_text' };
    }
    if (questionId === 'custom') {
      // Strip control characters, collapse whitespace, then hard-cap.
      text = body.text.replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, TRACK_TEXT_MAX);
    }
  }
  return { ok: true, questionId, text };
}
