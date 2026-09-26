import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clampParams, paramsCacheKey, SCHEMAS } from '../src/lib/params.mjs';
import { SOURCE_IDS } from '../static/js/ovs/physics/heat.mjs';

// ---------------------------------------------------------------- i01

test('i01: valid params pass through; the optional wind direction defaults to "side"', () => {
  const r = clampParams('i01', { wind: 5, width: 48, mount: 'island', panels: 'none' });
  assert.equal(r.ok, true);
  assert.deepEqual(r.params, { wind: 5, width: 48, mount: 'island', panels: 'none', dir: 'side' });
});

test('i01: explicit wind direction "rear" is accepted; anything else is rejected', () => {
  assert.equal(clampParams('i01', { wind: 5, width: 48, mount: 'wall', panels: 'none', dir: 'rear' }).ok, true);
  assert.equal(clampParams('i01', { wind: 5, width: 48, mount: 'wall', panels: 'none', dir: 'up' }).ok, false);
});

test('i01: out-of-range numeric is rejected (400), not silently clamped', () => {
  const r = clampParams('i01', { wind: 25, width: 48, mount: 'island', panels: 'none' });
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => e.includes('wind')));
});

test('i01: negative wind is rejected', () => {
  assert.equal(clampParams('i01', { wind: -1, width: 48, mount: 'island', panels: 'none' }).ok, false);
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
  assert.equal(clampParams('i01', { wind: 5, width: 200, mount: 'island', panels: 'none' }).ok, false);
});

test('i01: unknown enum value is rejected (peninsula is not an i01 mount)', () => {
  assert.equal(clampParams('i01', { wind: 5, width: 48, mount: 'peninsula', panels: 'none' }).ok, false);
});

test('i01: the single-panel option is gone — "one" is rejected (RB-009 §3.5.1 has no row for it)', () => {
  const r = clampParams('i01', { wind: 5, width: 48, mount: 'island', panels: 'one' });
  assert.equal(r.ok, false);                                                  // rb-009:369
  assert.ok(r.errors.some((e) => e.includes('panels')));
  assert.equal(clampParams('i01', { wind: 5, width: 48, mount: 'island', panels: 'both' }).ok, true);
});

test('i01: wrong type is rejected', () => {
  assert.equal(clampParams('i01', { wind: 'five', width: 48, mount: 'island', panels: 'none' }).ok, false);
});

test('i01: missing REQUIRED key is rejected (optional keys may be absent)', () => {
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

// ---------------------------------------------------------------- i02

test('i02: the minimal new-shape request fills height/panels defaults; source is left to explain-state (Gas Large unless btu is sent)', () => {
  const r = clampParams('i02', { mount: 'wall', exposure: 'moderate' });
  assert.equal(r.ok, true);
  assert.deepEqual(r.params, { height: 30, mount: 'wall', exposure: 'moderate', panels: 'none' });
  assert.equal(clampParams('i02', { source: 'gasLarge', mount: 'wall', exposure: 'moderate' }).params.source, 'gasLarge');
});

test('i02: full new shape passes through; source enum is exactly the RB-001 SOURCES ids', () => {
  const r = clampParams('i02', { source: 'gasMedium', height: 36, mount: 'peninsula', exposure: 'exposed', panels: 'both', width: 54 });
  assert.equal(r.ok, true);
  assert.deepEqual(r.params, { source: 'gasMedium', height: 36, mount: 'peninsula', exposure: 'exposed', panels: 'both', width: 54 });
  assert.deepEqual(SCHEMAS.i02.fields.source.values, SOURCE_IDS);
  assert.equal(clampParams('i02', { source: 'gasHuge', mount: 'wall', exposure: 'moderate' }).ok, false);
});

test('i02: height snaps to the paper grid 18/24/30/36/48 and rejects outside it', () => {
  assert.equal(clampParams('i02', { height: 33, mount: 'wall', exposure: 'moderate' }).params.height, 30);
  assert.equal(clampParams('i02', { height: 40, mount: 'wall', exposure: 'moderate' }).params.height, 36);
  assert.deepEqual(SCHEMAS.i02.fields.height.values, [18, 24, 30, 36, 48]);  // rb-008:198 (Table 3.1 columns)
  assert.equal(clampParams('i02', { height: 60, mount: 'wall', exposure: 'moderate' }).ok, false);
});

test('i02: mount accepts wall/peninsula/island (RB-008 §3.9); panels none/both only', () => {
  for (const mount of ['wall', 'peninsula', 'island']) assert.equal(clampParams('i02', { mount, exposure: 'moderate' }).ok, true); // rb-008:560-562
  assert.equal(clampParams('i02', { mount: 'ceiling', exposure: 'moderate' }).ok, false);
  assert.equal(clampParams('i02', { mount: 'wall', exposure: 'moderate', panels: 'one' }).ok, false);
});

test('i02: legacy shape (STAGE-A SHIM) {width, mount, exposure, btu} still validates; btu snaps to the 10k grid; no source is invented', () => {
  const r = clampParams('i02', { width: 54, mount: 'wall', exposure: 'exposed', btu: 63000 });
  assert.equal(r.ok, true);
  assert.equal(r.params.btu, 60000);
  assert.equal(r.params.width, 54);
  assert.equal('source' in r.params, false, 'btu-only requests carry no source; explain-state resolves it via sourceForBtu');
  assert.equal(r.params.height, 30);
});

test('i02: btu outside range is rejected', () => {
  assert.equal(clampParams('i02', { width: 48, mount: 'wall', exposure: 'moderate', btu: 999999 }).ok, false);
});

test('i02: a PRESENT optional value is still validated strictly (optional ≠ lenient)', () => {
  assert.equal(clampParams('i02', { mount: 'wall', exposure: 'moderate', panels: 'lots' }).ok, false);
  assert.equal(clampParams('i02', { mount: 'wall', exposure: 'moderate', width: 'wide' }).ok, false);
});

// ---------------------------------------------------------------- keys

test('paramsCacheKey is order-independent and stable, with defaults included', () => {
  const a = paramsCacheKey('i01', clampParams('i01', { wind: 5, width: 48, mount: 'island', panels: 'none' }).params);
  const b = paramsCacheKey('i01', clampParams('i01', { panels: 'none', mount: 'island', width: 48, wind: 5, dir: 'side' }).params);
  assert.equal(a, b);
  assert.equal(a, 'i01:dir=side&mount=island&panels=none&width=48&wind=5');
});

test('paramsCacheKey differs across instruments/values', () => {
  const a = paramsCacheKey('i01', { wind: 5, width: 48, mount: 'island', panels: 'none' });
  const b = paramsCacheKey('i01', { wind: 6, width: 48, mount: 'island', panels: 'none' });
  assert.notEqual(a, b);
});
