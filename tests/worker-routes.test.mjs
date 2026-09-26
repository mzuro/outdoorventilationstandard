// Route-level tests for the hardened API surface in src/worker.js, run
// through the default export with a Map-backed KV stub and a stubbed
// global fetch standing in for Turnstile's siteverify. Nothing here
// touches env.AI: the point is to pin the ORDER of the gates (parse ->
// honeypot -> Turnstile -> rate limit -> ...) and the fail-closed paths.
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/worker.js';

const HOST = 'outdoorventilationstandard.com';
const IP = '203.0.113.7';

function makeKv(seed = {}, opts = {}) {
  const store = new Map(Object.entries(seed));
  const puts = [];
  return {
    store,
    puts,
    async get(k) { return store.has(k) ? store.get(k) : null; },
    async put(k, v, o) {
      if (opts.failPut) throw new Error('kv down');
      puts.push({ key: k, value: v, opts: o });
      store.set(k, v);
    },
    async list({ prefix }) {
      const keys = [...store.keys()].filter((k) => k.startsWith(prefix)).sort().map((name) => ({ name }));
      return { keys, list_complete: true };
    },
  };
}

function post(path, body, { host = HOST, raw = false } = {}) {
  return new Request(`https://${host}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'cf-connecting-ip': IP },
    body: raw ? body : JSON.stringify(body),
  });
}

const realFetch = globalThis.fetch;
let siteverifyCalls;
function stubSiteverify(reply) {
  siteverifyCalls = [];
  globalThis.fetch = async (url, init) => {
    siteverifyCalls.push({ url: String(url), init });
    if (reply instanceof Error) throw reply;
    return new Response(JSON.stringify(reply), { headers: { 'Content-Type': 'application/json' } });
  };
}
beforeEach(() => stubSiteverify({ success: true, hostname: HOST }));
afterEach(() => { globalThis.fetch = realFetch; });

const OK_ASK = { question: 'how many cfm do I need', cf_token: 'tok' };
const OK_EXPLAIN = { instrument: 'i01', params: { wind: 5, width: 48, mount: 'island', panels: 'none' }, cf_token: 'tok' };

// ---------- /api/ask ----------

test('ask: malformed JSON -> 400 invalid_json (not 500), nothing touched', async () => {
  const kv = makeKv();
  const res = await worker.fetch(post('/api/ask', '{not json', { raw: true }), { QUESTION_CLICKS: kv, TURNSTILE_SECRET: 's' });
  assert.equal(res.status, 400);
  assert.deepEqual(await res.json(), { error: 'invalid_json' });
  assert.equal(kv.puts.length, 0);
  assert.equal(siteverifyCalls.length, 0);
});

test('ask: non-object JSON bodies -> 400', async () => {
  for (const raw of ['null', '"str"', '[1]', '42']) {
    const res = await worker.fetch(post('/api/ask', raw, { raw: true }), { QUESTION_CLICKS: makeKv(), TURNSTILE_SECRET: 's' });
    assert.equal(res.status, 400, raw);
  }
});

test('ask: TURNSTILE_SECRET unset -> 503 turnstile_not_configured, fail closed, KV untouched', async () => {
  const kv = makeKv();
  const res = await worker.fetch(post('/api/ask', OK_ASK), { QUESTION_CLICKS: kv, AI: { run: async () => { throw new Error('must not run'); } } });
  assert.equal(res.status, 503);
  assert.deepEqual(await res.json(), { error: 'turnstile_not_configured' });
  assert.equal(kv.puts.length, 0);
  assert.equal(siteverifyCalls.length, 0);
});

test('ask: honeypot rejects before Turnstile or KV', async () => {
  const kv = makeKv();
  const res = await worker.fetch(post('/api/ask', { ...OK_ASK, website: 'http://spam' }), { QUESTION_CLICKS: kv, TURNSTILE_SECRET: 's' });
  assert.equal(res.status, 403);
  assert.deepEqual(await res.json(), { error: 'bot_detected' });
  assert.equal(kv.puts.length, 0);
  assert.equal(siteverifyCalls.length, 0);
});

test('ask: invalid question rejects before Turnstile', async () => {
  const kv = makeKv();
  const res = await worker.fetch(post('/api/ask', { question: 'x'.repeat(501), cf_token: 'tok' }), { QUESTION_CLICKS: kv, TURNSTILE_SECRET: 's' });
  assert.equal(res.status, 400);
  assert.equal(siteverifyCalls.length, 0);
  assert.equal(kv.puts.length, 0);
});

test('ask: siteverify failure -> 403, no rate-limit budget spent', async () => {
  stubSiteverify({ success: false, 'error-codes': ['invalid-input-response'] });
  const kv = makeKv();
  const res = await worker.fetch(post('/api/ask', OK_ASK), { QUESTION_CLICKS: kv, TURNSTILE_SECRET: 's' });
  assert.equal(res.status, 403);
  assert.deepEqual(await res.json(), { error: 'turnstile_failed' });
  assert.equal(kv.puts.length, 0);
});

test('ask: token solved on a foreign hostname -> 403 turnstile_hostname_mismatch', async () => {
  stubSiteverify({ success: true, hostname: 'attacker.example' });
  const kv = makeKv();
  const res = await worker.fetch(post('/api/ask', OK_ASK), { QUESTION_CLICKS: kv, TURNSTILE_SECRET: 's' });
  assert.equal(res.status, 403);
  assert.deepEqual(await res.json(), { error: 'turnstile_hostname_mismatch' });
  assert.equal(kv.puts.length, 0);
});

test('ask: workers.dev preview host accepts its own hostname', async () => {
  const preview = 'ovs-v2-preview.markzuro.workers.dev';
  stubSiteverify({ success: true, hostname: preview });
  const res = await worker.fetch(post('/api/ask', OK_ASK, { host: preview }), { QUESTION_CLICKS: makeKv(), TURNSTILE_SECRET: 's' });
  // No AI binding -> 503 ai_not_configured, i.e. we got PAST Turnstile.
  assert.equal(res.status, 503);
  assert.deepEqual(await res.json(), { error: 'ai_not_configured' });
  assert.equal(res.headers.get('X-Robots-Tag'), 'noindex, nofollow');
});

test('ask: Turnstile posts the secret + token + remoteip to siteverify', async () => {
  await worker.fetch(post('/api/ask', OK_ASK), { QUESTION_CLICKS: makeKv(), TURNSTILE_SECRET: 'sekret' });
  assert.equal(siteverifyCalls.length, 1);
  assert.equal(siteverifyCalls[0].url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
  const sent = new URLSearchParams(siteverifyCalls[0].init.body);
  assert.equal(sent.get('secret'), 'sekret');
  assert.equal(sent.get('response'), 'tok');
  assert.equal(sent.get('remoteip'), IP);
});

test('ask: rate limit is charged only AFTER Turnstile passes, then cache/cap/AI', async () => {
  const kv = makeKv();
  const res = await worker.fetch(post('/api/ask', OK_ASK), { QUESTION_CLICKS: kv, TURNSTILE_SECRET: 's' });
  assert.equal(res.status, 503); // ai_not_configured: past Turnstile, past rate limit, past cache
  const rl = kv.puts.filter((p) => p.key.startsWith('ratelimit:'));
  assert.equal(rl.length, 1);
  assert.match(rl[0].key, new RegExp(`^ratelimit:${IP.replace(/\./g, '\\.')}:\\d+$`)); // legacy key shape preserved
  assert.equal(rl[0].opts.expirationTtl, 120);
});

test('ask: 429 once the per-minute bucket is full', async () => {
  const bucket = Math.floor(Date.now() / 60000);
  const kv = makeKv({ [`ratelimit:${IP}:${bucket}`]: '10' });
  const res = await worker.fetch(post('/api/ask', OK_ASK), { QUESTION_CLICKS: kv, TURNSTILE_SECRET: 's' });
  assert.equal(res.status, 429);
  assert.equal(res.headers.get('Retry-After'), '60');
  assert.equal(kv.puts.length, 0);
});

test('ask: filtered input logs an ailog entry with a hashed ip and an inverted-timestamp key', async () => {
  const kv = makeKv();
  const res = await worker.fetch(post('/api/ask', { question: 'where can I buy drugs', cf_token: 'tok' }), { QUESTION_CLICKS: kv, TURNSTILE_SECRET: 's' });
  assert.equal(res.status, 200);
  assert.equal((await res.json()).off_topic, true);
  const logs = kv.puts.filter((p) => p.key.startsWith('ailog:'));
  assert.equal(logs.length, 1);
  assert.match(logs[0].key, /^ailog:-\d{13}$/);
  // inverted: newer entries must sort BEFORE older ones
  const inv = Number(logs[0].key.slice(7));
  assert.ok(inv < 9999999999999 - Date.now() + 5000 && inv > 9999999999999 - Date.now() - 60000);
  assert.equal(logs[0].opts.expirationTtl, 2592000);
  const entry = JSON.parse(logs[0].value);
  assert.equal(entry.result, 'filtered');
  assert.match(entry.ip, /^[0-9a-f]{12}$/);
  assert.equal(entry.ip.includes('203'), false);
  assert.equal(entry.ip.includes('***'), false);
});

test('ask: filtered input with the rate limit exhausted -> 429 and NO ailog write', async () => {
  const bucket = Math.floor(Date.now() / 60000);
  const kv = makeKv({ [`ratelimit:${IP}:${bucket}`]: '10' });
  const res = await worker.fetch(post('/api/ask', { question: 'where can I buy drugs', cf_token: 'tok' }), { QUESTION_CLICKS: kv, TURNSTILE_SECRET: 's' });
  assert.equal(res.status, 429);
  assert.equal(kv.puts.filter((p) => p.key.startsWith('ailog:')).length, 0);
  assert.equal(kv.puts.length, 0);
});

test('ask: cached answer served after Turnstile + rate limit, without AI', async () => {
  const { askCacheKey } = await import('../src/lib/normalize.mjs');
  const cached = { answer: 'cached answer', citations: [], followups: [], links: [], source: 'ai' };
  const kv = makeKv({ [askCacheKey(OK_ASK.question)]: JSON.stringify(cached) });
  const res = await worker.fetch(post('/api/ask', OK_ASK), { QUESTION_CLICKS: kv, TURNSTILE_SECRET: 's' });
  assert.equal(res.status, 200);
  assert.equal((await res.json()).answer, 'cached answer');
});

// ---------- /api/explain ----------

test('explain: malformed JSON -> 400; invalid instrument/params -> 400 before Turnstile', async () => {
  const kv = makeKv();
  let res = await worker.fetch(post('/api/explain', '{', { raw: true }), { QUESTION_CLICKS: kv, TURNSTILE_SECRET: 's' });
  assert.equal(res.status, 400);
  assert.deepEqual(await res.json(), { error: 'invalid_json' });
  res = await worker.fetch(post('/api/explain', { instrument: 'i99', params: {}, cf_token: 'tok' }), { QUESTION_CLICKS: kv, TURNSTILE_SECRET: 's' });
  assert.equal(res.status, 400);
  assert.deepEqual(await res.json(), { error: 'invalid_instrument' });
  res = await worker.fetch(post('/api/explain', { instrument: 'i01', params: 'nope', cf_token: 'tok' }), { QUESTION_CLICKS: kv, TURNSTILE_SECRET: 's' });
  assert.equal(res.status, 400);
  assert.equal((await res.json()).error, 'invalid_params');
  assert.equal(siteverifyCalls.length, 0);
  assert.equal(kv.puts.length, 0);
});

test('explain: TURNSTILE_SECRET unset -> 503 fail closed', async () => {
  const kv = makeKv();
  const res = await worker.fetch(post('/api/explain', OK_EXPLAIN), { QUESTION_CLICKS: kv, AI: { run: async () => { throw new Error('must not run'); } } });
  assert.equal(res.status, 503);
  assert.deepEqual(await res.json(), { error: 'turnstile_not_configured' });
  assert.equal(kv.puts.length, 0);
});

test('explain: honeypot -> 403 before Turnstile', async () => {
  const res = await worker.fetch(post('/api/explain', { ...OK_EXPLAIN, website: 'x' }), { QUESTION_CLICKS: makeKv(), TURNSTILE_SECRET: 's' });
  assert.equal(res.status, 403);
  assert.equal(siteverifyCalls.length, 0);
});

test('explain: foreign hostname -> 403; good token -> proceeds to rate limit then ai_not_configured', async () => {
  stubSiteverify({ success: true, hostname: 'attacker.example' });
  let res = await worker.fetch(post('/api/explain', OK_EXPLAIN), { QUESTION_CLICKS: makeKv(), TURNSTILE_SECRET: 's' });
  assert.equal(res.status, 403);
  assert.deepEqual(await res.json(), { error: 'turnstile_hostname_mismatch' });

  stubSiteverify({ success: true, hostname: HOST });
  const kv = makeKv();
  res = await worker.fetch(post('/api/explain', OK_EXPLAIN), { QUESTION_CLICKS: kv, TURNSTILE_SECRET: 's' });
  assert.equal(res.status, 503);
  assert.deepEqual(await res.json(), { error: 'ai_not_configured' });
  assert.equal(kv.puts.filter((p) => p.key.startsWith('ratelimit:')).length, 1);
});

// ---------- physics-version cache keys (Stage A re-base) ----------
// Every cached narration/answer was computed by the pre-rebase physics, so
// the KV keys carry PHYSICS_VERSION: explain:v2:… and ask:v2:…. Old-prefix
// entries must never be served again.

test('explain: cached body is served under explain:<PHYSICS_VERSION>:<params key>, after Turnstile + rate limit, before AI', async () => {
  const { PHYSICS_VERSION } = await import('../static/js/ovs/physics/version.mjs');
  const { clampParams, paramsCacheKey } = await import('../src/lib/params.mjs');
  const clamped = clampParams('i01', OK_EXPLAIN.params).params;
  const key = `explain:${PHYSICS_VERSION}:${paramsCacheKey('i01', clamped)}`;
  assert.ok(key.startsWith('explain:v2:'), key);
  const kv = makeKv({ [key]: JSON.stringify({ explanation: 'cached narration', state: {} }) });
  const res = await worker.fetch(post('/api/explain', OK_EXPLAIN), { QUESTION_CLICKS: kv, TURNSTILE_SECRET: 's' });
  assert.equal(res.status, 200);
  assert.equal((await res.json()).explanation, 'cached narration');
  assert.equal(siteverifyCalls.length, 1, 'Turnstile still runs before the cache');
  assert.equal(kv.puts.filter((p) => p.key.startsWith('ratelimit:')).length, 1, 'rate limit charged before the cache');
});

test('explain: a pre-rebase cache entry (explain:i01:…, same params, no version prefix) is NOT served', async () => {
  const { clampParams, paramsCacheKey } = await import('../src/lib/params.mjs');
  // Seed the SAME clamped params (incl. the defaulted dir=side) so the only
  // difference from the live key is the missing PHYSICS_VERSION segment.
  const liveTail = paramsCacheKey('i01', clampParams('i01', OK_EXPLAIN.params).params);
  const stale = `explain:${liveTail}`;
  assert.equal(`explain:v2:${liveTail}`.replace(':v2:', ':'), stale);
  const kv = makeKv({ [stale]: JSON.stringify({ explanation: 'stale physics' }) });
  const res = await worker.fetch(post('/api/explain', OK_EXPLAIN), { QUESTION_CLICKS: kv, TURNSTILE_SECRET: 's' });
  assert.equal(res.status, 503);
  assert.deepEqual(await res.json(), { error: 'ai_not_configured' });
});

test('ask: a pre-rebase cache entry (askcache:…) is NOT served', async () => {
  const { normalizeQuestion } = await import('../src/lib/normalize.mjs');
  const kv = makeKv({ [`askcache:${normalizeQuestion(OK_ASK.question)}`]: JSON.stringify({ answer: 'stale physics' }) });
  const res = await worker.fetch(post('/api/ask', OK_ASK), { QUESTION_CLICKS: kv, TURNSTILE_SECRET: 's' });
  assert.notEqual(res.status, 200);
  assert.notEqual((await res.json()).answer, 'stale physics');
});

// ---------- /api/track ----------

test('track: malformed JSON / bad ids -> 400, nothing written', async () => {
  const kv = makeKv();
  let res = await worker.fetch(post('/api/track', 'nope', { raw: true }), { QUESTION_CLICKS: kv });
  assert.equal(res.status, 400);
  res = await worker.fetch(post('/api/track', { question_id: 'ratelimit:x' }), { QUESTION_CLICKS: kv });
  assert.equal(res.status, 400);
  assert.deepEqual(await res.json(), { error: 'invalid_question_id' });
  // well-formed but not on the allowlist
  res = await worker.fetch(post('/api/track', { question_id: 'preset-1' }), { QUESTION_CLICKS: kv });
  assert.equal(res.status, 400);
  assert.deepEqual(await res.json(), { error: 'invalid_question_id' });
  res = await worker.fetch(post('/api/track', { question_id: 'custom', text: 42 }), { QUESTION_CLICKS: kv });
  assert.equal(res.status, 400);
  res = await worker.fetch(post('/api/track', {}), { QUESTION_CLICKS: kv });
  assert.equal(res.status, 400);
  assert.equal(kv.puts.length, 0);
});

test('track: valid custom click increments counter and stores capped text with a 30-day TTL', async () => {
  const kv = makeKv();
  const res = await worker.fetch(post('/api/track', { question_id: 'custom', text: 'q'.repeat(5000) }), { QUESTION_CLICKS: kv });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(kv.store.get('clicks:custom'), '1');
  // counter put carries a TTL too: no permanent key from an unauthenticated caller
  const clicks = kv.puts.filter((p) => p.key.startsWith('clicks:'));
  assert.equal(clicks.length, 1);
  assert.equal(clicks[0].opts.expirationTtl, 2592000);
  const custom = kv.puts.filter((p) => p.key.startsWith('custom:'));
  assert.equal(custom.length, 1);
  assert.equal(custom[0].value.length, 200);
  assert.equal(custom[0].opts.expirationTtl, 2592000);
  // its own rate-limit bucket, separate from the AI routes'
  const rl = kv.puts.filter((p) => p.key.startsWith('ratelimit:'));
  assert.equal(rl.length, 1);
  assert.match(rl[0].key, new RegExp(`^ratelimit:track:${IP.replace(/\./g, '\\.')}:\\d+$`));
});

test('track: ai_search (search page) is accepted and does not store text', async () => {
  const kv = makeKv();
  const res = await worker.fetch(post('/api/track', { question_id: 'ai_search', text: 'hello' }), { QUESTION_CLICKS: kv });
  assert.equal(res.status, 200);
  assert.equal(kv.store.get('clicks:ai_search'), '1');
  assert.equal(kv.puts.filter((p) => p.key.startsWith('custom:')).length, 0);
});

test('track: rate limited -> 429 with nothing written', async () => {
  const bucket = Math.floor(Date.now() / 60000);
  const kv = makeKv({ [`ratelimit:track:${IP}:${bucket}`]: '10' });
  const res = await worker.fetch(post('/api/track', { question_id: 'custom', text: 'x' }), { QUESTION_CLICKS: kv });
  assert.equal(res.status, 429);
  assert.equal(kv.puts.length, 0);
});

test('track: KV failure is contained as 503, never a 500', async () => {
  const kv = makeKv({}, { failPut: true });
  const res = await worker.fetch(post('/api/track', { question_id: 'custom', text: 'x' }), { QUESTION_CLICKS: kv });
  assert.equal(res.status, 503);
  assert.deepEqual(await res.json(), { error: 'track_unavailable' });
});

test('track: no KV binding -> 200 no-op', async () => {
  const res = await worker.fetch(post('/api/track', { question_id: 'custom', text: 'x' }), {});
  assert.equal(res.status, 200);
});

// ---------- /api/stats ordering ----------

test('stats: new ailog keys list BEFORE a legacy plain-timestamp key still in KV', async () => {
  // Legacy shape written by the pre-hardening worker: ailog:<ms>, 13 digits
  const legacyKey = `ailog:${Date.now() - 1000}`;
  const kv = makeKv({ [legacyKey]: JSON.stringify({ question: 'legacy', result: 'ok', ip: '203.0.11***', time: 'x' }) });
  const env = { QUESTION_CLICKS: kv, TURNSTILE_SECRET: 's', ADMIN_TOKEN: 't' };
  await worker.fetch(post('/api/ask', { question: 'where can I buy drugs now', cf_token: 'tok' }), env);
  const newKey = kv.puts.find((p) => p.key.startsWith('ailog:')).key;
  assert.match(newKey, /^ailog:-\d{13}$/);
  assert.ok(newKey < legacyKey, `${newKey} should sort before ${legacyKey}`);
  const listed = (await kv.list({ prefix: 'ailog:' })).keys.map((k) => k.name);
  assert.deepEqual(listed, [newKey, legacyKey]);
  const res = await worker.fetch(new Request(`https://${HOST}/api/stats?token=t`), env);
  const data = await res.json();
  assert.equal(data.ai_logs[0].question, 'where can I buy drugs now');
  assert.equal(data.ai_logs[1].question, 'legacy');
});

test('stats: ailog listing returns newest entry first', async () => {
  const kv = makeKv();
  const env = { QUESTION_CLICKS: kv, TURNSTILE_SECRET: 's', ADMIN_TOKEN: 't' };
  await worker.fetch(post('/api/ask', { question: 'where can I buy drugs first', cf_token: 'tok' }), env);
  await new Promise((r) => setTimeout(r, 3));
  await worker.fetch(post('/api/ask', { question: 'where can I buy drugs second', cf_token: 'tok' }), env);
  const res = await worker.fetch(new Request(`https://${HOST}/api/stats?token=t`), env);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.ai_logs.length, 2);
  assert.equal(data.ai_logs[0].question, 'where can I buy drugs second');
  assert.equal(data.ai_logs[1].question, 'where can I buy drugs first');
});
