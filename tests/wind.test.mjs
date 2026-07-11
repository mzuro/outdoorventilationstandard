import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deflection } from '../static/js/ovs/physics/wind.mjs';
import { effectiveWind } from '../static/js/ovs/physics/sidepanels.mjs';

test('no wind, no deflection', () => assert.equal(deflection(30, 0), 0));
test('deflection monotonic in wind and height', () => {
  assert.ok(deflection(30, 5) > deflection(30, 2));
  assert.ok(deflection(36, 5) > deflection(24, 5));
});
test('5mph over 30in rise deflects on the order of the hood depth', () => {
  const x = deflection(30, 5);      // U/w ≈ 440/160 near field → tens of inches
  assert.ok(x > 20 && x < 120, `got ${x}`);
});
test('side panels attenuate wind', () => {
  assert.equal(effectiveWind(10, 'none'), 10);
  assert.equal(effectiveWind(10, 'one'), 6.5);
  assert.equal(effectiveWind(10, 'both'), 4);
});
