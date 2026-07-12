// costcap.mjs — global daily cost ceiling (AI #4: "no global cost cap"
// finding). Uses the ONE KV namespace already configured in
// wrangler.jsonc (QUESTION_CLICKS) — no new binding invented. Approximate
// by design: KV read-modify-write races mean concurrent requests can
// overshoot the cap slightly, which is acceptable per the AI expert
// report ("don't over-engineer with Durable Objects yet") since Turnstile
// + per-IP limiting are the primary gates and this is a coarse ceiling.

export const DEFAULT_DAILY_CAP = 2000;

/** UTC-day bucket key, e.g. "dailycap:2026-07-12". Pure. */
export function dailyCapKey(now = new Date()) {
  return `dailycap:${now.toISOString().slice(0, 10)}`;
}

/** Pure decision: is `count` already at/over `limit`? */
export function isOverDailyCap(count, limit = DEFAULT_DAILY_CAP) {
  return count >= limit;
}

/**
 * Check-and-increment against the KV binding. Returns true if the request
 * is allowed (and increments the counter), false if the daily cap is
 * already reached. Mirrors checkRateLimit()'s existing per-IP shape in
 * worker.js so the two ceilings read the same way at the call site.
 */
export async function checkDailyCap(env, limit = DEFAULT_DAILY_CAP) {
  if (!env.QUESTION_CLICKS) return true; // ungated when KV isn't configured (e.g. local dev)
  const key = dailyCapKey();
  const current = parseInt((await env.QUESTION_CLICKS.get(key)) || '0', 10);
  if (isOverDailyCap(current, limit)) return false;
  // TTL 2 days: comfortably outlives the UTC day the key is scoped to,
  // so a slow clock skew can't leave a stale counter alive into tomorrow.
  await env.QUESTION_CLICKS.put(key, String(current + 1), { expirationTtl: 172800 });
  return true;
}
