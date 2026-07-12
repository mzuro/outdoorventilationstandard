import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clampParams, paramsCacheKey } from '../src/lib/params.mjs';

test('i01: valid params pass through unchanged', () => {
  const r = clampParams('i01', { wind: 5, width: 48, mount: 'island', panels: 'none' });
  assert.equal(r.ok, true);
  assert.deepEqual(r.params, { wind: 5, width: 48, mount: 'island', panels: 'none' });
});

test('i01: out-of-range numeric is rejected (400), not silently clamped', () => {
  const r = clampParams('i01', { wind: 25, width: 48, mount: 'island', panels: 'none' });
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => e.includes('wind')));
});

test('i01: negative wind is rejected', () => {
  const r = clampParams('i01', { wind: -1, width: 48, mount: 'island', panels: 'none' });
  assert.equal(r.ok, false);
});

test('i01: width off the detent grid snaps to nearest, in-range', () => {
  const r = clampParams('i01', { wind: 5, width: 50, mount: 'island', panels: 'none' });
  assert.equal(r.ok, true);
  assert.equal(r.params.width, 48);
});

test('i01: width 66 (excluded detent) snaps to nearest of 60/72', () => {
  const r = clampParams('i01', { wind: 5, width: 66, mount: 'island', panels: 'none' });
  assert.equal(r.ok, true);
  assert.ok(r.params.width === 60 || r.params.width === 72);
});

test('i01: width outside the model range is rejected', () => {
  const r = clampParams('i01', { wind: 5, width: 200, mount: 'island', panels: 'none' });
  assert.equal(r.ok, false);
});

test('i01: unknown enum value is rejected', () => {
  const r = clampParams('i01', { wind: 5, width: 48, mount: 'peninsula', panels: 'none' });
  assert.equal(r.ok, false);
});

test('i01: wrong type is rejected', () => {
  const r = clampParams('i01', { wind: 'five', width: 48, mount: 'island', panels: 'none' });
  assert.equal(r.ok, false);
});

test('i01: missing required key is rejected', () => {
  const r = clampParams('i01', { width: 48, mount: 'island', panels: 'none' });
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => e.includes('wind')));
});

test('i01: extra/unexpected key is rejected', () => {
  const r = clampParams('i01', { wind: 5, width: 48, mount: 'island', panels: 'none', evil: '<script>' });
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => e.includes('evil')));
});

test('params must be an object, not an array/null/string', () => {
  assert.equal(clampParams('i01', null).ok, false);
  assert.equal(clampParams('i01', []).ok, false);
  assert.equal(clampParams('i01', 'wind=5').ok, false);
});

test('unknown instrument is rejected', () => {
  assert.equal(clampParams('i03', { anything: 1 }).ok, false);
});

test('i02: valid params pass through, btu snaps to the 10k step grid', () => {
  const r = clampParams('i02', { width: 54, mount: 'wall', exposure: 'exposed', btu: 63000 });
  assert.equal(r.ok, true);
  assert.equal(r.params.btu, 60000);
});

test('i02: btu outside range is rejected', () => {
  const r = clampParams('i02', { width: 48, mount: 'wall', exposure: 'moderate', btu: 999999 });
  assert.equal(r.ok, false);
});

test('paramsCacheKey is order-independent and stable', () => {
  const a = paramsCacheKey('i01', { wind: 5, width: 48, mount: 'island', panels: 'none' });
  const b = paramsCacheKey('i01', { panels: 'none', mount: 'island', width: 48, wind: 5 });
  assert.equal(a, b);
  assert.equal(a, 'i01:mount=island&panels=none&width=48&wind=5');
});

test('paramsCacheKey differs across instruments/values', () => {
  const a = paramsCacheKey('i01', { wind: 5, width: 48, mount: 'island', panels: 'none' });
  const b = paramsCacheKey('i01', { wind: 6, width: 48, mount: 'island', panels: 'none' });
  assert.notEqual(a, b);
});
