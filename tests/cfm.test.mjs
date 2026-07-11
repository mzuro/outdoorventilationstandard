import { test } from 'node:test';
import assert from 'node:assert/strict';
import { requiredCfm } from '../static/js/ovs/physics/cfm.mjs';
import { plumeStrength } from '../static/js/ovs/physics/heat.mjs';
import { depositionProfile } from '../static/js/ovs/physics/grease.mjs';

test('48in wall baseline', () => {
  const r = requiredCfm({ widthIn: 48, depthIn: 36, mount: 'wall' });
  assert.equal(r.minimum, 1200);                    // 12 ft² × 100 fpm
  assert.equal(r.recommended, 1500);                // ×1.25
  assert.equal(r.highWind, 2100);                   // ×1.75
});
test('island needs more than wall', () => {
  const w = requiredCfm({ widthIn: 48, depthIn: 36, mount: 'wall' });
  const i = requiredCfm({ widthIn: 48, depthIn: 40, mount: 'island' });
  assert.ok(i.minimum > w.minimum);
});
test('btu above 60k adds to all bands', () => {
  const a = requiredCfm({ widthIn: 48, depthIn: 36, mount: 'wall', btu: 90000 });
  assert.equal(a.minimum, 1500);                    // +300
});
test('ordering always min <= rec <= high', () => {
  const r = requiredCfm({ widthIn: 72, depthIn: 40, mount: 'island', exposure: 'exposed' });
  assert.ok(r.minimum <= r.recommended && r.recommended <= r.highWind);
});
test('plume strength scales with cbrt of heat', () => {
  assert.equal(plumeStrength(60000), 400);
  assert.ok(Math.abs(plumeStrength(120000) - 400 * Math.cbrt(2)) < 1e-9);
});
test('deposition normalized and decreasing', () => {
  const p = depositionProfile(30);
  assert.equal(p[0].intensity, 1);
  for (let i = 1; i < p.length; i++) assert.ok(p[i].intensity <= p[i - 1].intensity);
});
