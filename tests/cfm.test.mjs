// cfm.test.mjs — A5 of the physics re-base. RB-008's plume-mass-flow CFM
// framework, reproduced table-by-table:
//   ṁ = 0.071·Q_c^(1/3)·z^(5/3) + 0.0018·Q_c (rb-008:99), CFM_plume = ṁ/1.10 × 2119
//   (rb-008:105-107), K_CFM by class (rb-008:142-145), mount multipliers
//   (rb-008:560-562), blower = smallest standard size ≥ 1.1 × minimum
//   (rb-008:870, rb-008:614).
// Tolerance: ±1 CFM (the papers print whole CFM from unrounded intermediates).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { plumeCfm, requiredCfm, coverageAdvisory, K_CFM, MOUNT_MULT, BLOWER_SIZES, BLOWER_MARGIN, RHO_PLUME, blowerFor } from '../static/js/ovs/physics/cfm.mjs';
import { SOURCES } from '../static/js/ovs/physics/heat.mjs';

const near = (got, want, tol, msg) => assert.ok(Math.abs(got - want) <= tol, `${msg}: got ${got}, want ${want} ±${tol}`);

test('constants: K_CFM by wind class, mount multipliers, plume density, blower rule', () => {
  assert.deepEqual(K_CFM, { sheltered: 3.0, moderate: 3.68, exposedPanels: 4.14, exposed: 5.75 }); // rb-008:142-145
  assert.deepEqual(MOUNT_MULT, { wall: 1.00, peninsula: 1.10, island: 1.20 }); // rb-008:560-562
  assert.equal(RHO_PLUME, 1.10);                                              // rb-008:105
  assert.equal(BLOWER_MARGIN, 1.1);                                           // rb-008:870 (at least 1.1×)
  assert.deepEqual(BLOWER_SIZES, [600, 900, 1200, 1500, 1800, 2100, 2400, 3000]); // rb-008:614 lists 600/900/1200/1500; owner decision 2 extends the ladder
});

test('RB-008 Table 3.1: bare plume CFM, Gas Medium and Gas Large and Pellet Low rows', () => {
  const gm = SOURCES.gasMedium, gl = SOURCES.gasLarge, pl = SOURCES.pelletLow;
  near(plumeCfm(18, gm), 104, 1, 'GM 18');  near(plumeCfm(24, gm), 149, 1, 'GM 24');  near(plumeCfm(30, gm), 203, 1, 'GM 30');
  near(plumeCfm(36, gm), 264, 1, 'GM 36');  near(plumeCfm(48, gm), 413, 1, 'GM 48');                           // rb-008:201
  near(plumeCfm(18, gl), 129, 1, 'GL 18');  near(plumeCfm(24, gl), 181, 1, 'GL 24');  near(plumeCfm(30, gl), 242, 1, 'GL 30');
  near(plumeCfm(36, gl), 312, 1, 'GL 36');  near(plumeCfm(48, gl), 482, 1, 'GL 48');                           // rb-008:202
  near(plumeCfm(18, pl), 48, 1, 'PL 18');   near(plumeCfm(24, pl), 74, 1, 'PL 24');   near(plumeCfm(30, pl), 104, 1, 'PL 30');
  near(plumeCfm(36, pl), 139, 1, 'PL 36');  near(plumeCfm(48, pl), 223, 1, 'PL 48');                           // rb-008:209
});

test('RB-008 Tables 3.2a–d: Gas Large at 30 in by wind class (the §3.3 primary answer)', () => {
  const r = requiredCfm({ src: SOURCES.gasLarge, riseIn: 30, mount: 'wall', exposure: 'moderate' });
  near(r.tables.sheltered, 727, 1, 'sheltered');                             // rb-008:229, rb-008:309
  near(r.tables.moderate, 892, 1, 'moderate');                               // rb-008:248, rb-008:310
  near(r.tables.exposed, 1394, 1, 'exposed, no panels');                     // rb-008:267, rb-008:312
  near(r.tables.exposedPanels, 1003, 1, 'exposed with panels');              // rb-008:282, rb-008:311
});

test('RB-008 Table 3.2b Pellet Low row (Moderate, K = 3.68)', () => {
  const t = (h) => requiredCfm({ src: SOURCES.pelletLow, riseIn: h, mount: 'wall', exposure: 'moderate' }).minimum;
  near(t(18), 177, 1, '18'); near(t(24), 272, 1, '24'); near(t(30), 384, 1, '30'); near(t(36), 511, 1, '36'); near(t(48), 822, 1, '48'); // rb-008:255
});

test('RB-008 Table 3.2b Gas Medium row (Moderate) and Table 3.2c Gas Large row (Exposed)', () => {
  const gm = (h) => requiredCfm({ src: SOURCES.gasMedium, riseIn: h, mount: 'wall', exposure: 'moderate' }).minimum;
  near(gm(18), 383, 1, 'GM 18'); near(gm(24), 550, 1, 'GM 24'); near(gm(30), 747, 1, 'GM 30'); near(gm(36), 972, 1, 'GM 36'); near(gm(48), 1518, 1, 'GM 48'); // rb-008:247
  const gl = (h) => requiredCfm({ src: SOURCES.gasLarge, riseIn: h, mount: 'wall', exposure: 'exposed', panels: 'none' }).minimum;
  near(gl(18), 743, 1, 'GL 18'); near(gl(24), 1042, 1, 'GL 24'); near(gl(30), 1394, 1, 'GL 30'); near(gl(36), 1797, 1, 'GL 36'); near(gl(48), 2774, 1, 'GL 48'); // rb-008:267
});

test('flagship: Gas Large, 30 in, wall, moderate → minimum 892 / blower 1200 exactly (RB-008 §3.3)', () => {
  const r = requiredCfm({ src: SOURCES.gasLarge, riseIn: 30, mount: 'wall', exposure: 'moderate' });
  assert.equal(r.minimum, 892);                                               // rb-008:310
  assert.equal(r.blower, 1200);                                               // rb-008:310 (892 × 1.1 = 981 → 1200)
  assert.equal(r.kCfm, 3.68);                                                 // rb-008:310
  near(r.plumeCfm, 242, 1, 'plume CFM');                                      // rb-008:202
});

test('RB-008 §3.3 blowers by class: 900 / 1200 / 1200 / 1800 (paper prints 1500 for 1394 — erratum (j))', () => {
  const at = (exposure, panels = 'none') => requiredCfm({ src: SOURCES.gasLarge, riseIn: 30, mount: 'wall', exposure, panels });
  assert.equal(at('sheltered').blower, 900);                                  // rb-008:309 (727 → 900)
  assert.equal(at('moderate').blower, 1200);                                  // rb-008:310 (892 → 1200)
  assert.equal(at('exposed', 'both').blower, 1200);                           // rb-008:311 (1003 → 1200)
  // 1394 × 1.1 = 1533 > 1500, so the paper's own step-8 rule (rb-008:870)
  // selects 1800; the printed 1500 CFM violates it (plan §1 (j), owner decision 2).
  assert.equal(at('exposed', 'none').blower, 1800);                           // paper_printed: 1500  rb-008:312
});

test('RB-008 §3.9 mount multipliers applied to the table value: island 1070 → 1200, peninsula 981 → 1200', () => {
  const island = requiredCfm({ src: SOURCES.gasLarge, riseIn: 30, mount: 'island', exposure: 'moderate' });
  assert.equal(island.minimum, 1070);                                         // rb-008:567 (892 × 1.20 = 1070)
  assert.equal(island.blower, 1200);                                          // 1070 × 1.1 = 1177 → 1200 (rb-008:870)
  const pen = requiredCfm({ src: SOURCES.gasLarge, riseIn: 30, mount: 'peninsula', exposure: 'moderate' });
  assert.equal(pen.minimum, 981);                                             // rb-008:568 (892 × 1.10 = 981)
  assert.equal(pen.blower, 1200);
  assert.equal(requiredCfm({ src: SOURCES.gasLarge, riseIn: 30, mount: 'wall', exposure: 'moderate' }).minimum, 892); // rb-008:560 baseline
});

test('RB-008 App A worked example: custom wood-fired 50k BTU, 28×20 in, 36 in, island, moderate → 1241 / 1500', () => {
  // Steps 1–3 (rb-008:874-876): Q_c = 0.65 × 14.7 kW, D_eff from the cooking
  // area, z_0 from the App A formula; steps 4–8 (rb-008:877-881).
  const r = requiredCfm({ src: { qcKw: 0.65 * (50000 / 3412), z0M: -0.438, dEffM: 0.678 }, riseIn: 36, mount: 'island', exposure: 'moderate' });
  near(r.plumeCfm, 281, 1, 'CFM_plume');                                      // rb-008:877
  near(r.minimum, 1241, 1241 * 0.005, 'CFM_required');                        // rb-008:880 (paper rounds CFM_plume to 281 first)
  assert.equal(r.blower, 1500);                                               // rb-008:881
});

test('blowerFor: smallest standard size ≥ 1.1 × minimum; above the ladder returns null', () => {
  assert.equal(blowerFor(727), 900);                                          // rb-008:309
  assert.equal(blowerFor(892), 1200);                                         // rb-008:310
  assert.equal(blowerFor(545), 600);                                          // 545 × 1.1 = 599.5 ≤ 600
  assert.equal(blowerFor(546), 900);                                          // 546 × 1.1 = 600.6 > 600
  assert.equal(blowerFor(3000), null);
});

test('exposure "exposed" picks K by panels (4.14 with, 5.75 without); other classes ignore panels', () => {
  const e = (panels) => requiredCfm({ src: SOURCES.gasLarge, riseIn: 30, mount: 'wall', exposure: 'exposed', panels });
  assert.equal(e('both').kCfm, 4.14);                                         // rb-008:145
  assert.equal(e('none').kCfm, 5.75);                                         // rb-008:144
  assert.equal(requiredCfm({ src: SOURCES.gasLarge, riseIn: 30, mount: 'wall', exposure: 'moderate', panels: 'both' }).kCfm, 3.68); // rb-008:143
});

test('width is not a CFM input (RB-008 §3.4.3, Table 3.10: a 72 in hood needs LESS, not more)', () => {
  const a = requiredCfm({ src: SOURCES.gasLarge, riseIn: 30, mount: 'wall', exposure: 'moderate', widthIn: 42 });
  const b = requiredCfm({ src: SOURCES.gasLarge, riseIn: 30, mount: 'wall', exposure: 'moderate', widthIn: 72 });
  assert.equal(a.minimum, b.minimum);
});

test('coverageAdvisory: RB-008 Table 3.10 bands by % of the RB-002 recommended width (Gas Medium, 30 in)', () => {
  const c = (w) => coverageAdvisory(w, 30, SOURCES.gasMedium);
  near(c(48).pctOfRecommended, 84, 1, '48 in % of 57');                       // rb-008:585
  near(c(42).pctOfRecommended, 74, 1, '42 in % of 57');                       // rb-008:584
  near(c(54).pctOfRecommended, 95, 1, '54 in % of 57');                       // rb-008:586
  near(c(72).pctOfRecommended, 126, 1, '72 in % of 57');                      // rb-008:589
  assert.equal(c(42).band, 'overflow');                                       // rb-008:584 (plume overflows hood, not recommended)
  assert.equal(c(48).band, 'marginal');                                       // rb-008:585 (marginal; upgrade width instead)
  assert.equal(c(54).band, 'acceptable');                                     // rb-008:586 (near-adequate; ≥ 90 % design rule rb-008:591)
  assert.equal(c(57).band, 'full');                                           // rb-008:587 (full coverage)
  assert.equal(c(72).band, 'full');                                           // rb-008:589
  assert.deepEqual(c(48).captureBand, [80, 85]);                              // rb-008:585
  near(c(48).recommendedWidthIn, 57, 1, 'W_rec');                             // rb-002:643
});

// Stage B deleted the legacy {btu, widthIn} call shape and the
// .recommended/.highWind aliases: requiredCfm() takes an RB-001 SOURCES
// row and returns exactly { minimum, blower, kCfm, plumeCfm, mount,
// mountMult, tables }.
test('requiredCfm: no btu/width inputs, no recommended/highWind aliases (shim removed)', () => {
  const r = requiredCfm({ src: SOURCES.gasLarge, riseIn: 30, mount: 'wall', exposure: 'moderate' });
  assert.deepEqual(Object.keys(r).sort(), ['blower', 'kCfm', 'minimum', 'mount', 'mountMult', 'plumeCfm', 'tables']);
  assert.equal(r.minimum, 892);                                               // rb-008:310
  assert.equal(r.blower, 1200);                                               // rb-008:310
  // a stray btu is ignored, never mapped: the default source (Gas Large) applies
  const stray = requiredCfm({ btu: 25000, widthIn: 48, mount: 'wall', exposure: 'moderate' });
  assert.equal(stray.minimum, 892);
});
