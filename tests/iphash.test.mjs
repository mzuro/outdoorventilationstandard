import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashIp, IP_HASH_LEN } from '../src/lib/iphash.mjs';

const D1 = new Date('2026-09-25T10:00:00Z');
const D1_LATER = new Date('2026-09-25T23:59:59Z');
const D2 = new Date('2026-09-26T00:00:00Z');

test('hashIp: 12 lowercase hex chars, deterministic within a UTC day', async () => {
  const a = await hashIp('203.0.113.42', D1);
  const b = await hashIp('203.0.113.42', D1_LATER);
  assert.equal(a.length, IP_HASH_LEN);
  assert.equal(IP_HASH_LEN, 12);
  assert.match(a, /^[0-9a-f]{12}$/);
  assert.equal(a, b);
});

test('hashIp: changes across days, with the pepper, and between IPs', async () => {
  const a = await hashIp('203.0.113.42', D1);
  assert.notEqual(a, await hashIp('203.0.113.42', D2));
  assert.notEqual(a, await hashIp('203.0.113.42', D1, 'pepper'));
  assert.notEqual(a, await hashIp('203.0.113.43', D1));
});

test('hashIp: output never contains the address itself', async () => {
  const ip = '203.0.113.42';
  const h = await hashIp(ip, D1);
  assert.equal(h.includes('203'), false);
  assert.equal(h.includes(ip.slice(0, 8)), false);
  const v6 = await hashIp('2001:db8::1', D1);
  assert.match(v6, /^[0-9a-f]{12}$/);
});

test('hashIp: tolerates unknown / missing ip', async () => {
  assert.match(await hashIp('unknown', D1), /^[0-9a-f]{12}$/);
  assert.match(await hashIp(undefined, D1), /^[0-9a-f]{12}$/);
});
