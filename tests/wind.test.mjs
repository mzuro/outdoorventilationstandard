// wind.test.mjs — A2 of the physics re-base. RB-006 §3.1 closed-form
// deflection δ(z) = 0.35 · U_w · z / u_0(z) (rb-006:428), reproduced against
// RB-006 Table 3.2b/3.2c, the RB-003 3 mph benchmark and the Froude table.
// Every literal cites a printed paper cell; tolerance per plan §4 is ±1 in.
// RB-006 built Table 3.2b/3.2c on RB-001's hand-rounded u_0 column (e.g.
// 1.99 m/s at 30 in where the formula gives 1.994) and rounded each cell to
// whole inches, so several printed cells sit 1–2 in off the formula; those
// assert the REGENERATED value ±1 with a `paper_printed:` comment, exactly
// as the plan prescribes for hand-rounded rows.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { deflection, deflectionRate, froude, C_D } from '../static/js/ovs/physics/wind.mjs';
import { SOURCES } from '../static/js/ovs/physics/heat.mjs';

const near = (got, want, tol, msg) => assert.ok(Math.abs(got - want) <= tol, `${msg}: got ${got.toFixed(2)}, want ${want} ±${tol}`);

test('C_D is RB-006 §3.1\'s calibrated 0.35 (0.348 rounded) and deflection() carries it itself', () => {
  assert.equal(C_D, 0.35);                                                    // rb-006:428 (C_d = 0.348 at rb-006:424)
  // δ(30 in, 5 mph) = 0.35 · 2.235 m/s · 0.76 m / u_0 — the coupling is
  // inside the closed form, so a caller must never pre-multiply the wind.
  const u0 = 1.03 * Math.cbrt(8.2) * Math.pow(0.76 + 0.37, -1 / 3);          // rb-001:135, rb-001:242, rb-001:273
  near(deflection(30, 5, SOURCES.gasMedium), 0.35 * 5 * 0.44704 * 0.76 / u0 * 39.3701, 1e-9, 'closed form'); // rb-006:428
});

test('no wind, no deflection; deflection is monotonic in wind and height', () => {
  assert.equal(deflection(30, 0), 0);
  assert.ok(deflection(30, 5) > deflection(30, 2));
  assert.ok(deflection(36, 5) > deflection(24, 5));
});

test('RB-006 Table 3.2b (Gas Grill Medium) at 30 in vs wind speed', () => {
  const s = SOURCES.gasMedium;
  near(deflection(30, 2, s), 5, 1, '2 mph');                                  // rb-006:454
  near(deflection(30, 5, s), 12, 1, '5 mph');                                 // rb-006:454
  near(deflection(30, 8, s), 19, 1, '8 mph');                                 // rb-006:454
  near(deflection(30, 10, s), 23.5, 1, '10 mph');                             // paper_printed: 25  rb-006:454 (0.35·4.47·0.76/1.99 = 0.597 m = 23.5 in)
  // 15 mph is Fr 3.4 — the paper's "disrupted" regime (rb-006:775, Fr > 2.7)
  // where its own Table 3.2b applies an undocumented Fr correction (plan
  // §1 (k)); the linear formula the paper prints (rb-006:428) gives 35 in.
  near(deflection(30, 15, s), 35, 1, '15 mph');                               // paper_printed: 46  rb-006:454
  assert.ok(froude(30, 15, s) > 2.7);                                         // rb-006:775 disrupted regime
});

test('RB-006 Table 3.2b at 5 mph vs height', () => {
  const s = SOURCES.gasMedium;
  near(deflection(18, 5, s), 6, 1, '18 in');                                  // rb-006:452
  near(deflection(24, 5, s), 9, 1, '24 in');                                  // rb-006:453
  near(deflection(30, 5, s), 12, 1, '30 in');                                 // rb-006:454
  near(deflection(36, 5, s), 15, 1, '36 in');                                 // rb-006:455
  near(deflection(48, 5, s), 22, 1, '48 in');                                 // rb-006:456
});

test('RB-006 Table 3.2b 24 in and 36 in rows at 2/8/10 mph', () => {
  const s = SOURCES.gasMedium;
  near(deflection(24, 2, s), 4, 1, '24 in / 2 mph');                          // rb-006:453
  near(deflection(24, 8, s), 14, 1, '24 in / 8 mph');                         // rb-006:453
  near(deflection(24, 10, s), 18, 1, '24 in / 10 mph');                       // paper_printed: 19  rb-006:453 (formula 0.457 m = 18.0 in)
  near(deflection(36, 2, s), 6, 1, '36 in / 2 mph');                          // rb-006:455
  near(deflection(36, 8, s), 24, 1, '36 in / 8 mph');                         // rb-006:455
  // 36 in / 10 mph: the printed 0.81 m (32 in) does not follow from the
  // paper's formula even with its own u_0 = 1.88 m/s (0.35·4.47·0.91/1.88 =
  // 0.757 m = 29.8 in). See docs/superpowers/physics-rebase-stage-a-notes.md.
  near(deflection(36, 10, s), 29, 1, '36 in / 10 mph');                       // paper_printed: 32  rb-006:455
});

test('RB-006 Table 3.2c (Gas Grill Large) 30 in row — non-default source', () => {
  const s = SOURCES.gasLarge;
  near(deflection(30, 2, s), 4, 1, '2 mph');                                  // rb-006:464
  near(deflection(30, 5, s), 10, 1, '5 mph');                                 // rb-006:464
  near(deflection(30, 8, s), 17, 1, '8 mph');                                 // rb-006:464
  near(deflection(30, 10, s), 21, 1, '10 mph');                               // paper_printed: 22  rb-006:464 (formula 0.527 m = 20.8 in)
});

test('RB-003 3 mph benchmark that calibrated C_d: 4 / 7 / 12 in at 18 / 30 / 48 in', () => {
  const s = SOURCES.gasMedium;
  near(deflection(18, 3, s), 4, 1, '18 in');                                  // rb-003:680
  near(deflection(30, 3, s), 7, 1, '30 in');                                  // rb-003:680 (the C_d calibration point, rb-006:418-424)
  near(deflection(48, 3, s), 12, 1, '48 in');                                 // rb-003:680
});

test('froude = U_w / u_0(z): RB-006 Table 3.3 Gas Medium 30 in row', () => {
  const s = SOURCES.gasMedium;
  near(froude(30, 2, s), 0.45, 0.02, '2 mph');                                // rb-006:542
  near(froude(30, 5, s), 1.13, 0.02, '5 mph');                                // rb-006:542
  near(froude(30, 8, s), 1.80, 0.02, '8 mph');                                // rb-006:542
  near(froude(30, 10, s), 2.25, 0.02, '10 mph');                              // rb-006:542
  near(froude(30, 15, s), 3.37, 0.02, '15 mph');                              // rb-006:542
  assert.equal(froude(30, 0, s), 0);
});

test('froude matches the published dataset static/data/rb-006-crosswind-froude-number.csv (30 in row)', () => {
  const csv = readFileSync(new URL('../static/data/rb-006-crosswind-froude-number.csv', import.meta.url), 'utf8');
  const row = csv.split('\n').find((l) => l.startsWith('30,'));
  assert.ok(row, 'csv has a 30 in row');
  const [, , f2, f5, f8, f10, f15] = row.split(',').map(Number);
  const s = SOURCES.gasMedium;
  for (const [mph, printed] of [[2, f2], [5, f5], [8, f8], [10, f10], [15, f15]]) {
    near(froude(30, mph, s), printed, 0.02, `${mph} mph csv`);               // static/data/rb-006-crosswind-froude-number.csv:5 (= rb-006:542)
  }
});

test('deflectionRate is the analytic dδ/dz of the closed form (smoke particles trace the same curve)', () => {
  const s = SOURCES.gasMedium;
  for (const z of [6, 15, 30, 45]) {
    const h = 0.01;
    const numeric = (deflection(z + h, 5, s) - deflection(z - h, 5, s)) / (2 * h);
    near(deflectionRate(z, 5, s), numeric, 1e-3, `dδ/dz at ${z} in`);
  }
  assert.equal(deflectionRate(30, 0, s), 0);
});
