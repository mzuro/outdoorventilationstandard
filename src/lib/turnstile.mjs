// turnstile.mjs — server-side Turnstile verification shared by /api/ask
// and /api/explain (worker hardening, finding #1).
//
// FAIL CLOSED: if TURNSTILE_SECRET is not configured the AI routes refuse
// with 503 turnstile_not_configured instead of silently skipping the
// check (the old `if (env.TURNSTILE_SECRET) { ... }` shape let anyone
// drive Workers AI on the preview worker or on any fresh deploy where
// the secret hadn't been set yet).
//
// After siteverify succeeds the token's `hostname` (the page the widget
// was solved on) is checked against an allowlist derived from the
// request's own host, so a token solved elsewhere can't be replayed here.
// No `action` check: neither client widget (index.html, search.html,
// explain-ui.mjs) sets one.

export const APEX_HOST = 'outdoorventilationstandard.com';
export const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/**
 * Pure: is `verifiedHost` (from siteverify's `hostname`) acceptable for
 * a request that arrived on `requestHost`?
 *   - the request's own host (covers the custom domain and local dev)
 *   - the apex domain and its www. variant
 *   - any *.workers.dev host (git-integration branch previews)
 */
export function hostnameAllowed(verifiedHost, requestHost) {
  if (typeof verifiedHost !== 'string' || !verifiedHost) return false;
  const v = verifiedHost.toLowerCase();
  const r = String(requestHost || '').toLowerCase().split(':')[0];
  if (r && v === r) return true;
  if (v === APEX_HOST || v === `www.${APEX_HOST}`) return true;
  if (v.endsWith('.workers.dev')) return true;
  return false;
}

/**
 * Verify a Turnstile token. Never throws; always resolves to
 *   { ok: true }
 * or
 *   { ok: false, status, error }   // status 503 or 403, error is a stable code
 *
 * `fetchImpl` defaults to the global fetch at call time (so tests can stub
 * globalThis.fetch or inject one directly).
 */
export async function verifyTurnstile({ secret, token, ip, requestHost, fetchImpl } = {}) {
  if (!secret) {
    return { ok: false, status: 503, error: 'turnstile_not_configured' };
  }
  if (typeof token !== 'string' || token.length === 0 || token.length > 2048) {
    // No token at all: siteverify would just answer missing-input-response;
    // skip the round trip.
    return { ok: false, status: 403, error: 'turnstile_failed' };
  }
  const doFetch = fetchImpl || globalThis.fetch;
  let data;
  try {
    const params = new URLSearchParams();
    params.set('secret', secret);
    params.set('response', token);
    if (ip && ip !== 'unknown') params.set('remoteip', ip);
    const res = await doFetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });
    data = await res.json();
  } catch (e) {
    // siteverify unreachable / non-JSON: fail closed, but distinguish it
    // from a rejected token so an outage isn't logged as bot traffic.
    return { ok: false, status: 503, error: 'turnstile_unavailable' };
  }
  if (!data || data.success !== true) {
    return { ok: false, status: 403, error: 'turnstile_failed' };
  }
  if (!hostnameAllowed(data.hostname, requestHost)) {
    return { ok: false, status: 403, error: 'turnstile_hostname_mismatch' };
  }
  return { ok: true };
}
