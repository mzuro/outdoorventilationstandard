import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gradeRatedCfm } from '../static/js/ovs/instruments/i02.mjs';

// Bands mirror the 48in wall baseline from tests/cfm.test.mjs (requiredCfm
// output shape) — gradeRatedCfm does no physics of its own, it only
// compares a rated-CFM number against whatever bands it's handed.
const bands = { minimum: 1200, recommended: 1500, highWind: 2100 };

test('gradeRatedCfm: well above recommended -> PASS', () => {
  assert.equal(gradeRatedCfm(2000, bands).grade, 'PASS');
});

test('gradeRatedCfm: exactly recommended -> PASS (boundary inclusive)', () => {
  assert.equal(gradeRatedCfm(1500, bands).grade, 'PASS');
});

test('gradeRatedCfm: just below recommended -> MARGINAL', () => {
  assert.equal(gradeRatedCfm(1499, bands).grade, 'MARGINAL');
});

test('gradeRatedCfm: mid-band -> MARGINAL', () => {
  assert.equal(gradeRatedCfm(1350, bands).grade, 'MARGINAL');
});

test('gradeRatedCfm: exactly minimum -> MARGINAL (boundary inclusive)', () => {
  assert.equal(gradeRatedCfm(1200, bands).grade, 'MARGINAL');
});

test('gradeRatedCfm: just below minimum -> FAIL', () => {
  assert.equal(gradeRatedCfm(1199, bands).grade, 'FAIL');
});

test('gradeRatedCfm: well below minimum -> FAIL', () => {
  assert.equal(gradeRatedCfm(400, bands).grade, 'FAIL');
});
