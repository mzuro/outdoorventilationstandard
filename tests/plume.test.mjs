import { test } from 'node:test';
import assert from 'node:assert/strict';
import { plumeRadius, centerlineVelocity } from '../static/js/ovs/physics/plume.mjs';

test('radius grows linearly from source radius', () => {
  assert.equal(plumeRadius(0), 6);
  assert.ok(Math.abs(plumeRadius(100) - (6 + 0.11 * 100)) < 1e-9);
});
test('velocity constant in near field then decays as cbrt', () => {
  assert.equal(centerlineVelocity(6), 160);
  assert.equal(centerlineVelocity(12), 160);
  assert.ok(Math.abs(centerlineVelocity(96) - 160 * Math.cbrt(12 / 96)) < 1e-9);
});
test('velocity strictly decreasing beyond z0', () => {
  assert.ok(centerlineVelocity(24) > centerlineVelocity(48));
  assert.ok(centerlineVelocity(48) > centerlineVelocity(96));
});
