import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dailyCapKey, isOverDailyCap, checkDailyCap, DEFAULT_DAILY_CAP } from '../src/lib/costcap.mjs';

test('dailyCapKey is a stable UTC-day bucket', () => {
  const d = new Date('2026-07-12T23:59:59Z');
  assert.equal(dailyCapKey(d), 'dailycap:2026-07-12');
});

test('isOverDailyCap: pure threshold check', () => {
  assert.equal(isOverDailyCap(0, 10), false);
  assert.equal(isOverDailyCap(9, 10), false);
  assert.equal(isOverDailyCap(10, 10), true);
  assert.equal(isOverDailyCap(11, 10), true);
  assert.equal(isOverDailyCap(DEFAULT_DAILY_CAP - 1), false);
  assert.equal(isOverDailyCap(DEFAULT_DAILY_CAP), true);
});

test('checkDailyCap is ungated when the KV binding is absent (local dev)', async () => {
  const allowed = await checkDailyCap({});
  assert.equal(allowed, true);
});

test('checkDailyCap increments the counter and allows under the cap', async () => {
  const store = new Map();
  const env = {
    QUESTION_CLICKS: {
      async get(k) { return store.has(k) ? store.get(k) : null; },
      async put(k, v) { store.set(k, v); },
    },
  };
  const a = await checkDailyCap(env, 2);
  const b = await checkDailyCap(env, 2);
  assert.equal(a, true);
  assert.equal(b, true);
  const key = dailyCapKey();
  assert.equal(store.get(key), '2');
});

test('checkDailyCap denies once the cap is reached', async () => {
  const store = new Map();
  const env = {
    QUESTION_CLICKS: {
      async get(k) { return store.has(k) ? store.get(k) : null; },
      async put(k, v) { store.set(k, v); },
    },
  };
  const limit = 2;
  await checkDailyCap(env, limit);
  await checkDailyCap(env, limit);
  const third = await checkDailyCap(env, limit);
  assert.equal(third, false);
});
