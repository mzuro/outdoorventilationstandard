import { test } from 'node:test';
import assert from 'node:assert/strict';
import { verifyTurnstile, hostnameAllowed, SITEVERIFY_URL } from '../src/lib/turnstile.mjs';

const APEX = 'outdoorventilationstandard.com';

function stubFetch(reply, calls = []) {
  return async (url, init) => {
    calls.push({ url, init });
    if (reply instanceof Error) throw reply;
    return { async json() { return reply; } };
  };
}

test('hostnameAllowed: request host, apex, www only', () => {
  assert.equal(hostnameAllowed(APEX, APEX), true);
  assert.equal(hostnameAllowed(`www.${APEX}`, APEX), true);
  assert.equal(hostnameAllowed(APEX, 'ovs-v2-preview.markzuro.workers.dev'), true);
  // a preview host solving its OWN widget matches via the request-host rule
  assert.equal(hostnameAllowed('ovs-v2-preview.markzuro.workers.dev', 'ovs-v2-preview.markzuro.workers.dev'), true);
  assert.equal(hostnameAllowed('localhost', 'localhost:8787'), true);
  assert.equal(hostnameAllowed('OutdoorVentilationStandard.COM', APEX), true);
});

test('hostnameAllowed: foreign hosts rejected, including other workers.dev hosts (no wildcard)', () => {
  assert.equal(hostnameAllowed('evil.example.com', APEX), false);
  assert.equal(hostnameAllowed(`${APEX}.evil.example.com`, APEX), false);
  assert.equal(hostnameAllowed('evilworkers.dev', APEX), false);
  // token solved on a different workers.dev site must NOT be accepted here
  assert.equal(hostnameAllowed('fix-x-ovs.markzuro.workers.dev', APEX), false);
  assert.equal(hostnameAllowed('someone-else.workers.dev', 'ovs-v2-preview.markzuro.workers.dev'), false);
  assert.equal(hostnameAllowed('', APEX), false);
  assert.equal(hostnameAllowed(undefined, APEX), false);
  assert.equal(hostnameAllowed('localhost', APEX), false);
});

test('verifyTurnstile: missing secret fails CLOSED with 503 and never calls siteverify', async () => {
  const calls = [];
  const r = await verifyTurnstile({ secret: undefined, token: 'tok', ip: '1.2.3.4', requestHost: APEX, fetchImpl: stubFetch({ success: true, hostname: APEX }, calls) });
  assert.deepEqual(r, { ok: false, status: 503, error: 'turnstile_not_configured' });
  assert.equal(calls.length, 0);
  const r2 = await verifyTurnstile({ secret: '', token: 'tok', ip: '1.2.3.4', requestHost: APEX, fetchImpl: stubFetch({ success: true, hostname: APEX }, calls) });
  assert.equal(r2.status, 503);
  assert.equal(calls.length, 0);
});

test('verifyTurnstile: empty/absent token rejected without a round trip', async () => {
  const calls = [];
  const f = stubFetch({ success: true, hostname: APEX }, calls);
  for (const token of ['', undefined, null, 42]) {
    const r = await verifyTurnstile({ secret: 's', token, ip: '1.2.3.4', requestHost: APEX, fetchImpl: f });
    assert.deepEqual(r, { ok: false, status: 403, error: 'turnstile_failed' });
  }
  assert.equal(calls.length, 0);
});

test('verifyTurnstile: success with matching hostname -> ok, posts secret/response/remoteip', async () => {
  const calls = [];
  const r = await verifyTurnstile({ secret: 'sekret', token: 'tok-123', ip: '1.2.3.4', requestHost: APEX, fetchImpl: stubFetch({ success: true, hostname: APEX }, calls) });
  assert.deepEqual(r, { ok: true });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, SITEVERIFY_URL);
  assert.equal(calls[0].init.method, 'POST');
  const sent = new URLSearchParams(calls[0].init.body);
  assert.equal(sent.get('secret'), 'sekret');
  assert.equal(sent.get('response'), 'tok-123');
  assert.equal(sent.get('remoteip'), '1.2.3.4');
});

test('verifyTurnstile: preview host accepts its own token, rejects another workers.dev token', async () => {
  const preview = 'ovs-v2-preview.markzuro.workers.dev';
  const r = await verifyTurnstile({ secret: 's', token: 't', ip: '1.2.3.4', requestHost: preview, fetchImpl: stubFetch({ success: true, hostname: preview }) });
  assert.deepEqual(r, { ok: true });
  const r2 = await verifyTurnstile({ secret: 's', token: 't', ip: '1.2.3.4', requestHost: preview, fetchImpl: stubFetch({ success: true, hostname: 'other-branch.markzuro.workers.dev' }) });
  assert.deepEqual(r2, { ok: false, status: 403, error: 'turnstile_hostname_mismatch' });
});

test('verifyTurnstile: success with foreign hostname -> 403 hostname mismatch', async () => {
  const r = await verifyTurnstile({ secret: 's', token: 't', ip: '1.2.3.4', requestHost: APEX, fetchImpl: stubFetch({ success: true, hostname: 'attacker.example' }) });
  assert.deepEqual(r, { ok: false, status: 403, error: 'turnstile_hostname_mismatch' });
  const r2 = await verifyTurnstile({ secret: 's', token: 't', ip: '1.2.3.4', requestHost: APEX, fetchImpl: stubFetch({ success: true }) });
  assert.equal(r2.error, 'turnstile_hostname_mismatch');
});

test('verifyTurnstile: siteverify failure -> 403 turnstile_failed', async () => {
  const r = await verifyTurnstile({ secret: 's', token: 't', ip: '1.2.3.4', requestHost: APEX, fetchImpl: stubFetch({ success: false, 'error-codes': ['invalid-input-response'], hostname: APEX }) });
  assert.deepEqual(r, { ok: false, status: 403, error: 'turnstile_failed' });
  // success must be boolean true, not merely truthy
  const r2 = await verifyTurnstile({ secret: 's', token: 't', ip: '1.2.3.4', requestHost: APEX, fetchImpl: stubFetch({ success: 'true', hostname: APEX }) });
  assert.equal(r2.ok, false);
});

test('verifyTurnstile: siteverify unreachable / non-JSON -> 503 turnstile_unavailable (still closed)', async () => {
  const r = await verifyTurnstile({ secret: 's', token: 't', ip: '1.2.3.4', requestHost: APEX, fetchImpl: stubFetch(new Error('ECONNRESET')) });
  assert.deepEqual(r, { ok: false, status: 503, error: 'turnstile_unavailable' });
  const r2 = await verifyTurnstile({ secret: 's', token: 't', ip: '1.2.3.4', requestHost: APEX, fetchImpl: async () => ({ async json() { throw new SyntaxError('bad json'); } }) });
  assert.equal(r2.ok, false);
  assert.equal(r2.status, 503);
});

test('verifyTurnstile: unknown ip is not forwarded as remoteip', async () => {
  const calls = [];
  await verifyTurnstile({ secret: 's', token: 't', ip: 'unknown', requestHost: APEX, fetchImpl: stubFetch({ success: true, hostname: APEX }, calls) });
  assert.equal(new URLSearchParams(calls[0].init.body).has('remoteip'), false);
});
