import { test } from 'node:test';
import assert from 'node:assert/strict';
import { requiredCfm } from '../static/js/ovs/physics/cfm.mjs';
import { plumeStrength } from '../static/js/ovs/physics/heat.mjs';
import { depositionProfile } from '../static/js/ovs/physics/grease.mjs';

test('48in wall baseline', () => {
  const r = requiredCfm({ widthIn: 48, mount: 'wall' });
  assert.equal(r.minimum, 1200);                    // 12 ft² × 100 fpm (48"×36" face)
  assert.equal(r.recommended, 1500);                // ×1.25
  assert.equal(r.highWind, 2100);                   // ×1.75
});
test('island is wall × 1.20 (RB-008 §3.9)', () => {
  const w = requiredCfm({ widthIn: 48, mount: 'wall' });
  const i = requiredCfm({ widthIn: 48, mount: 'island' });
  assert.equal(i.minimum, 1450);                    // RB-008 §3.9: 1200 × 1.20 = 1440 → round25 → 1450 (mid of RB-005's 1.15-1.25)
  assert.ok(Math.abs(i.minimum / w.minimum - 1.20) < 0.02, `ratio ${(i.minimum / w.minimum).toFixed(3)}`);
});
test('peninsula is wall × 1.10 (RB-008 §3.9)', () => {
  const p = requiredCfm({ widthIn: 48, mount: 'peninsula' });
  assert.equal(p.minimum, 1325);                    // 1200 × 1.10 = 1320 → round25
});
test('depth does not drive CFM (RB-008 §3.4.3)', () => {
  // Hood depth/area does not change required exhaust rate; only width+mount do.
  const a = requiredCfm({ widthIn: 48, mount: 'island', depthIn: 40 });
  const b = requiredCfm({ widthIn: 48, mount: 'island', depthIn: 60 });
  assert.equal(a.minimum, b.minimum);
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
