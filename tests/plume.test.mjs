// plume.test.mjs — A1 of the physics re-base. Every numeric literal below
// is a printed cell of an RB paper (content/research/<file>.md:line); the
// module must REPRODUCE the paper, never the other way round.
//
// Tolerance policy (plan §4): formula-computed rows ±1 unit or ±0.5 %;
// hand-rounded rows (RB-003 admits 1–4 % rounding at the 18–48 in standard
// heights, rb-003:254) assert the REGENERATED value with a `paper_printed`
// comment; a cell that does not reproduce at all is asserted as computed
// and logged in docs/superpowers/physics-rebase-stage-a-notes.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SOURCES, convectiveKw, sourceForBtu, HEIGHT_M, heightM, BTU_PER_KW } from '../static/js/ovs/physics/heat.mjs';
import {
  centerlineVelocity, plumeHalfWidthBT, captureDiameter, recommendedWidth,
  K_BASE, K_INF, plumeRadius,
} from '../static/js/ovs/physics/plume.mjs';

const near = (got, want, tol, msg) => assert.ok(Math.abs(got - want) <= tol, `${msg}: got ${got}, want ${want} ±${tol}`);
const IN_PER_M = 39.3701;
// ±1 unit or ±0.5 %, whichever is larger (plan §4)
const tolOf = (want) => Math.max(1, Math.abs(want) * 0.005);

// ---------------------------------------------------------------- heat.mjs

test('SOURCES: RB-001 Table 3.1 / 3.2 and RB-002 A.4 rows are transcribed as printed', () => {
  const s = SOURCES;
  // Gas Grill — Small: 25,000 BTU, 7.3 kW, chi_c 0.70, Q_c 5.1, D_eff 0.43   // rb-001:241
  assert.deepEqual([s.gasSmall.btu, s.gasSmall.qTotalKw, s.gasSmall.chiC, s.gasSmall.qcKw, s.gasSmall.dEffM], [25000, 7.3, 0.70, 5.1, 0.43]);
  assert.equal(s.gasSmall.z0M, -0.30);                                        // rb-001:272
  assert.deepEqual([s.gasSmall.cookWIn, s.gasSmall.cookDIn], [18, 19]);       // rb-002:994
  // Gas Grill — Medium: 40,000 BTU, 11.7 kW, 0.70, 8.2, 0.51                  // rb-001:242
  assert.deepEqual([s.gasMedium.btu, s.gasMedium.qTotalKw, s.gasMedium.chiC, s.gasMedium.qcKw, s.gasMedium.dEffM], [40000, 11.7, 0.70, 8.2, 0.51]);
  assert.equal(s.gasMedium.z0M, -0.37);                                       // rb-001:273
  assert.deepEqual([s.gasMedium.cookWIn, s.gasMedium.cookDIn], [24, 21]);     // rb-002:995
  // Gas Grill — Large: 60,000 BTU, 17.6 kW, 0.70, 12.3, 0.58                  // rb-001:243
  assert.deepEqual([s.gasLarge.btu, s.gasLarge.qTotalKw, s.gasLarge.chiC, s.gasLarge.qcKw, s.gasLarge.dEffM], [60000, 17.6, 0.70, 12.3, 0.58]);
  assert.equal(s.gasLarge.z0M, -0.41);                                        // rb-001:274
  assert.deepEqual([s.gasLarge.cookWIn, s.gasLarge.cookDIn], [30, 22]);       // rb-002:996
  // Gas Grill — High-Output: 80,000 BTU, 23.4 kW, 0.70, 16.4, 0.65            // rb-001:244
  assert.deepEqual([s.gasHigh.btu, s.gasHigh.qTotalKw, s.gasHigh.chiC, s.gasHigh.qcKw, s.gasHigh.dEffM], [80000, 23.4, 0.70, 16.4, 0.65]);
  assert.equal(s.gasHigh.z0M, -0.44);                                         // rb-001:275
  assert.deepEqual([s.gasHigh.cookWIn, s.gasHigh.cookDIn], [36, 22]);         // rb-002:997
  // Charcoal Grill — Kettle: 15,000 BTU, 4.4 kW, 0.40, 1.8, 0.56              // rb-001:245
  assert.deepEqual([s.charcoalKettle.btu, s.charcoalKettle.qTotalKw, s.charcoalKettle.chiC, s.charcoalKettle.qcKw, s.charcoalKettle.dEffM], [15000, 4.4, 0.40, 1.8, 0.56]);
  assert.equal(s.charcoalKettle.z0M, -0.47);                                  // rb-001:276
  assert.deepEqual([s.charcoalKettle.cookWIn, s.charcoalKettle.cookDIn], [22, 22]); // rb-002:998 (22 diameter, circular)
  // Wood-Fired Grill: 40,000 BTU, 11.7 kW, 0.65, 7.6, 0.50                    // rb-001:248
  assert.deepEqual([s.woodFired.btu, s.woodFired.qTotalKw, s.woodFired.chiC, s.woodFired.qcKw, s.woodFired.dEffM], [40000, 11.7, 0.65, 7.6, 0.50]);
  assert.equal(s.woodFired.z0M, -0.36);                                       // rb-001:279
  assert.deepEqual([s.woodFired.cookWIn, s.woodFired.cookDIn], [24, 16]);     // rb-002:1000
  // Pellet Smoker — Low: 8,000 BTU, 2.3 kW, 0.65, 1.5, 0.45                   // rb-001:250
  assert.deepEqual([s.pelletLow.btu, s.pelletLow.qTotalKw, s.pelletLow.chiC, s.pelletLow.qcKw, s.pelletLow.dEffM], [8000, 2.3, 0.65, 1.5, 0.45]);
  assert.equal(s.pelletLow.z0M, -0.38);                                       // rb-001:281
  assert.deepEqual([s.pelletLow.cookWIn, s.pelletLow.cookDIn], [22, 14]);     // rb-002:1002
  // Pellet Smoker — High: 30,000 BTU, 8.8 kW, 0.65, 5.7, 0.45                 // rb-001:252
  assert.deepEqual([s.pelletHigh.btu, s.pelletHigh.qTotalKw, s.pelletHigh.chiC, s.pelletHigh.qcKw, s.pelletHigh.dEffM], [30000, 8.8, 0.65, 5.7, 0.45]);
  assert.equal(s.pelletHigh.z0M, -0.30);                                      // rb-001:283
  assert.deepEqual([s.pelletHigh.cookWIn, s.pelletHigh.cookDIn], [22, 14]);   // rb-002:1004
});

test('convectiveKw: Q_c = chi_c × Q_total with 1 kW = 3,412 BTU/hr (RB-008 App A step 1)', () => {
  assert.equal(BTU_PER_KW, 3412);                                             // rb-008:834
  near(convectiveKw(40000, 0.70), 8.2, 0.05, 'Gas Medium Q_c');              // rb-001:242 (11.7 kW × 0.70)
  near(convectiveKw(60000, 0.70), 12.3, 0.05, 'Gas Large Q_c');              // rb-001:243
  near(convectiveKw(15000, 0.40), 1.8, 0.05, 'Charcoal kettle Q_c');         // rb-001:245
});

test('sourceForBtu: nearest RB-001 gas row; ties resolve to the stronger plume (design condition, rb-001:258)', () => {
  assert.equal(sourceForBtu(60000), SOURCES.gasLarge);                        // rb-001:243
  assert.equal(sourceForBtu(40000), SOURCES.gasMedium);                       // rb-001:242
  assert.equal(sourceForBtu(25000), SOURCES.gasSmall);                        // rb-001:241
  assert.equal(sourceForBtu(80000), SOURCES.gasHigh);                         // rb-001:244
  assert.equal(sourceForBtu(150000), SOURCES.gasHigh);                        // above the table: clamps to the strongest gas row
  assert.equal(sourceForBtu(50000), SOURCES.gasLarge);                        // tie 40k/60k → stronger plume (rb-001:258 note 3)
  assert.equal(sourceForBtu(15000, 'charcoal'), SOURCES.charcoalKettle);      // rb-001:245
  assert.equal(sourceForBtu(8000, 'pellet'), SOURCES.pelletLow);              // rb-001:250
  assert.equal(sourceForBtu(30000, 'pellet'), SOURCES.pelletHigh);            // rb-001:252
  assert.equal(sourceForBtu(40000, 'wood'), SOURCES.woodFired);               // rb-001:248
});

test('HEIGHT_M is the papers\' 0.01 m grid; other heights fall back to 0.0254 m/in', () => {
  assert.deepEqual([HEIGHT_M[18], HEIGHT_M[24], HEIGHT_M[30], HEIGHT_M[36], HEIGHT_M[48]], [0.46, 0.61, 0.76, 0.91, 1.22]); // rb-002:402-406
  assert.deepEqual([HEIGHT_M[6], HEIGHT_M[12], HEIGHT_M[42], HEIGHT_M[54], HEIGHT_M[60], HEIGHT_M[66], HEIGHT_M[72]],
    [0.15, 0.30, 1.07, 1.37, 1.52, 1.68, 1.83]);                              // rb-003:258-269 (Table 3.1a height column)
  assert.equal(heightM(30), 0.76);                                            // rb-002:404
  near(heightM(33), 33 * 0.0254, 1e-12, 'off-grid fallback');
});

// --------------------------------------------------------------- plume.mjs

test('u_0: RB-003 Table 3.1b Gas Medium non-standard rows reproduce (6/12/42/54/60/72 in)', () => {
  const s = SOURCES.gasMedium;
  near(centerlineVelocity(6, s), 508, tolOf(508), '6 in');                    // rb-003:277
  near(centerlineVelocity(12, s), 467, tolOf(467), '12 in');                  // rb-003:278
  near(centerlineVelocity(42, s), 363, tolOf(363), '42 in');                  // rb-003:283
  near(centerlineVelocity(54, s), 341, tolOf(341), '54 in');                  // rb-003:285
  near(centerlineVelocity(60, s), 331, tolOf(331), '60 in');                  // rb-003:286
  near(centerlineVelocity(72, s), 315, tolOf(315), '72 in');                  // rb-003:288
});

test('u_0: RB-003 Table 3.1b standard rows are hand-rounded (rb-003:254); assert the regenerated values', () => {
  const s = SOURCES.gasMedium;
  // plan §1 collision (f): regenerated Gas Medium 18/24/30/36/48 = 435/412/393/377/350
  near(centerlineVelocity(18, s), 435, 1, '18 in');                           // paper_printed: 453  rb-003:279
  near(centerlineVelocity(24, s), 412, 1, '24 in');                           // paper_printed: 417  rb-003:280
  near(centerlineVelocity(30, s), 393, 1, '30 in');                           // paper_printed: 392  rb-003:281
  near(centerlineVelocity(36, s), 377, 1, '36 in');                           // paper_printed: 370  rb-003:282
  near(centerlineVelocity(48, s), 350, 1, '48 in');                           // paper_printed: 337  rb-003:284
});

test('u_0: RB-003 Table 3.1b Charcoal column (Q_c 1.8 kW, z_0 −0.47)', () => {
  const s = SOURCES.charcoalKettle;
  near(centerlineVelocity(6, s), 290, tolOf(290), '6 in');                    // rb-003:277
  near(centerlineVelocity(12, s), 268, tolOf(268), '12 in');                  // rb-003:278
  near(centerlineVelocity(72, s), 187, tolOf(187), '72 in');                  // rb-003:288
  // standard rows regenerated (plan §1 (f): charcoal 253/240/230/222/207)
  near(centerlineVelocity(18, s), 253, 1, '18 in');                           // paper_printed: 286  rb-003:279
  near(centerlineVelocity(24, s), 240, 1, '24 in');                           // paper_printed: 262  rb-003:280
  near(centerlineVelocity(30, s), 230, 1, '30 in');                           // paper_printed: 246  rb-003:281
  near(centerlineVelocity(36, s), 222, 1, '36 in');                           // paper_printed: 233  rb-003:282
  near(centerlineVelocity(48, s), 207, 1, '48 in');                           // paper_printed: 211  rb-003:284
});

test('u_0 defaults to Gas Medium and decays monotonically with height (rb-001:135, inverse one-third power)', () => {
  assert.equal(centerlineVelocity(30), centerlineVelocity(30, SOURCES.gasMedium));
  assert.ok(centerlineVelocity(18) > centerlineVelocity(30));
  assert.ok(centerlineVelocity(30) > centerlineVelocity(48));
  assert.ok(centerlineVelocity(48) > centerlineVelocity(72));
});

test('b_T = 0.12(z − z_0): RB-002 Table 3.3a Gas Medium column', () => {
  const s = SOURCES.gasMedium;
  const bTm = (z) => plumeHalfWidthBT(z, s) / IN_PER_M;
  near(bTm(18), 0.100, 0.0006, '18 in');                                      // rb-002:402
  near(bTm(24), 0.118, 0.0006, '24 in');                                      // rb-002:403
  near(bTm(30), 0.136, 0.0006, '30 in');                                      // rb-002:404
  near(bTm(36), 0.154, 0.0006, '36 in');                                      // rb-002:405
  near(bTm(48), 0.191, 0.0006, '48 in');                                      // rb-002:406
});

test('d_capture = 0.48(z − z_0) + D_eff: RB-002 Table 3.6b W_min and Table 3.9 41 in', () => {
  const s = SOURCES.gasMedium;
  near(captureDiameter(30, s), 41, 0.5, '30 in (Table 3.9)');                 // rb-002:687
  near(captureDiameter(18, s), 36, 1, '18 in');                               // rb-002:534
  near(captureDiameter(24, s), 39, 1, '24 in');                               // rb-002:535
  near(captureDiameter(30, s), 41, 1, '30 in');                               // rb-002:536
  near(captureDiameter(36, s), 44, 1, '36 in');                               // rb-002:537
  near(captureDiameter(48, s), 50, 1, '48 in');                               // rb-002:538
  near(captureDiameter(30, s) / IN_PER_M, 1.05, 0.006, '30 in metres');       // rb-002:404
});

test('W_rec = 1.38 · d_capture: RB-002 Table 3.7 at 30 in', () => {
  assert.equal(K_BASE, 1.38);                                                 // rb-002:490
  near(recommendedWidth(30, SOURCES.gasSmall), 51, 1, 'Gas Small');           // rb-002:642
  near(recommendedWidth(30, SOURCES.gasMedium), 57, 1, 'Gas Medium');         // rb-002:643
  near(recommendedWidth(30, SOURCES.gasLarge), 62, 1, 'Gas Large');           // rb-002:644
  near(recommendedWidth(30, SOURCES.gasHigh), 67, 1, 'Gas High-Output');      // rb-002:645
  near(recommendedWidth(30, SOURCES.charcoalKettle), 63, 1, 'Charcoal');      // rb-002:646
  near(recommendedWidth(30, SOURCES.woodFired), 57, 1, 'Wood-Fired');         // rb-002:648
  near(recommendedWidth(30, SOURCES.pelletLow), 54, 1, 'Pellet Low');         // rb-002:650
  // Pellet High: formula with its tabulated z_0 = −0.30 (rb-001:283) gives 52,
  // not the printed 54 (the paper reused the Pellet Low geometry, rb-002:632).
  // See docs/superpowers/physics-rebase-stage-a-notes.md.
  near(recommendedWidth(30, SOURCES.pelletHigh), 52, 1, 'Pellet High');       // paper_printed: 54  rb-002:652
  near(recommendedWidth(24, SOURCES.gasMedium), 53, 1, 'Gas Medium 24 in');   // rb-002:643
  near(recommendedWidth(36, SOURCES.gasMedium), 61, 1, 'Gas Medium 36 in');   // rb-002:643
});

test('K_INF = 1.70 is the wind-inclusive infiltration lineage (RB-003 App D.1), distinct from K_BASE', () => {
  assert.equal(K_INF, 1.70);                                                  // rb-003:1056
  assert.ok(K_INF > K_BASE);
});

// STAGE-A SHIM: plumeRadius stays exported for i01/i04/i05/i07/i08/i09 until
// Stage B rewires them to captureDiameter(); it is d_capture / 2 so the
// drawn envelope is the paper's capture diameter, not the old 14 + 0.11 z.
test('plumeRadius (STAGE-A SHIM) is half the RB-002 capture diameter', () => {
  near(plumeRadius(30), captureDiameter(30, SOURCES.gasMedium) / 2, 1e-9, 'shim identity');
  assert.ok(plumeRadius(48) > plumeRadius(30));
});
