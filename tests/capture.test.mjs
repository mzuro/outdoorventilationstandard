// capture.test.mjs — A4 of the physics re-base. Capture model = RB-006 §3.4
// (aperture ±OH about the undeflected centreline, OH = overhang beyond the
// cooking surface, rb-006:606-614) with a Gaussian plume of σ = 1.5·b_T,
// centre shifted by the RB-006 §3.1 deflection of the sheltered wind.
// Verified against RB-008 Table 3.10's still-air capture column, RB-006
// §3.4's threshold identities and RB-006 Table 3.10's wind rows.
// Tolerances (plan §4): capture % ±5 pts at 0/5 mph, ±15 pts at 8–10 mph,
// measured to the nearest edge of the printed band.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { erf, captureFraction, criticalWinds, SIGMA_PER_BT, WIND_COUPLING } from '../static/js/ovs/physics/capture.mjs';
import { C_D } from '../static/js/ovs/physics/wind.mjs';
import { SOURCES } from '../static/js/ovs/physics/heat.mjs';

const pct = (x) => x * 100;
// distance from a printed band [lo, hi] (hi may be Infinity for ">95 %")
const bandDist = (v, lo, hi) => (v < lo ? lo - v : v > hi ? v - hi : 0);
const inBand = (v, lo, hi, tol, msg) => assert.ok(bandDist(v, lo, hi) <= tol, `${msg}: got ${v.toFixed(1)} %, band ${lo}–${hi} ±${tol}`);
const near = (got, want, tol, msg) => assert.ok(Math.abs(got - want) <= tol, `${msg}: got ${got}, want ${want} ±${tol}`);

test('erf reference values (Abramowitz–Stegun 7.1.26)', () => {
  assert.ok(Math.abs(erf(0)) < 1e-7);
  assert.ok(Math.abs(erf(1) - 0.8427008) < 1e-4);
  assert.ok(Math.abs(erf(-1) + 0.8427008) < 1e-4);
});

test('model constants: σ = 1.5·b_T (RB-002 d_mean = 2·1.5·b_T, 90 % flux contour); WIND_COUPLING shim is 1', () => {
  assert.equal(SIGMA_PER_BT, 1.5);                                            // rb-002:392 (d_mean = 2 × 1.5 × b_T)
  assert.equal(C_D, 0.35);                                                    // rb-006:428 — the real coupling lives in wind.mjs
  // STAGE-A SHIM: i01/i03/i07/i08 still pre-multiply the wind by this
  // before calling deflection(), which carries C_D itself; 1 keeps their
  // readouts equal to explain-state's for the same inputs (Stage B deletes both).
  assert.equal(WIND_COUPLING, 1);
});

// Gas Grill Medium at 30 in: cooking surface 24 in wide (rb-002:995), so
// OH = (width − 24)/2 along a side wind.
const GM30 = (widthIn, windMph, extra = {}) => pct(captureFraction({
  widthIn, depthIn: 53, mount: 'island', riseIn: 30, windMph, windDir: 'side', src: SOURCES.gasMedium, ...extra,
}));

test('RB-008 Table 3.10 still-air capture column (Gas Medium, 30 in) by hood width', () => {
  inBand(GM30(42, 0), 65, 75, 5, '42 in');                                    // rb-008:584 (65-75 % max)
  inBand(GM30(48, 0), 80, 85, 5, '48 in');                                    // rb-008:585 (80-85 % at best)
  inBand(GM30(54, 0), 90, 93, 5, '54 in');                                    // rb-008:586 (90-93 %)
  inBand(GM30(57, 0), 95, 100, 0, '57 in');                                   // rb-008:587 (>95 %)
  inBand(GM30(63, 0), 95, 100, 0, '63 in');                                   // rb-008:588 (>95 %)
  inBand(GM30(72, 0), 95, 100, 0, '72 in');                                   // rb-008:589 (>95 %)
  assert.ok(GM30(42, 0) < GM30(48, 0) && GM30(48, 0) < GM30(54, 0) && GM30(54, 0) < GM30(57, 0));
});

test('RB-006 §3.4 threshold identities for the RB-002 hood (57 in, OH = 0.42 m, b_T = 0.136 m at 30 in)', () => {
  const cw = criticalWinds({ widthIn: 57, riseIn: 30, src: SOURCES.gasMedium, windDir: 'side' });
  // Formula rb-006:618 U = δ·u_0/(0.35·z) with δ_25 = OH − b_T (rb-006:610) and
  // δ_100 = OH (rb-006:614), OH = 0.42 m (rb-006:633). The printed 6.7 / 9.7 mph
  // in Table 3.4a were computed with the K = 1.70 (~70 in) hood (plan §0
  // finding 4); with the 57 in hood the paper labels, the formula gives:
  near(cw.u25, 4.8, 0.1, 'U_25');                                             // paper_printed: 6.7  rb-006:633
  near(cw.uCenterline, 7.0, 0.1, 'U_centerline');                             // paper_printed: 9.7  rb-006:633
  near(cw.u50, 9.3, 0.1, 'U_50');                                             // paper_printed: 12.6 rb-006:633
  // and the capture model returns exactly the escape fractions the
  // thresholds are defined by:
  near(GM30(57, cw.u25), 75, 1, '25 % escape at U_25');                      // rb-006:602
  near(GM30(57, cw.uCenterline), 50, 1, '50 % outside at centreline exit');  // rb-006:600
  near(GM30(57, cw.u50), 25, 1, '>50 % escape at U_50 (75 % escape)');       // rb-006:604 (centreline OH + b_T beyond the edge)
});

test('RB-006 Table 3.10 wind rows (Gas Medium, 30 in, 57 in hood)', () => {
  inBand(GM30(57, 0), 95, 100, 0, 'still air');                              // rb-006:950 (>95 %)
  inBand(GM30(57, 5), 70, 75, 5, '5 mph, standard hood');                    // rb-006:951 (70-75 %)
  inBand(GM30(57, 5, { panels: 'both' }), 88, 92, 5, '5 mph, side panels');  // rb-006:953 (88-92 %)
  inBand(GM30(57, 8), 45, 55, 15, '8 mph, standard hood');                   // rb-006:956 (45-55 %)
  // 10 mph is Fr 2.25 (rb-006:542), where the paper says its linear
  // deflection under-predicts (rb-006:430); the printed 30-40 % does not
  // follow from the printed formula (19 %). Asserted as computed — see
  // docs/superpowers/physics-rebase-stage-a-notes.md.
  near(GM30(57, 10), 19.2, 1, '10 mph, standard hood');                      // paper_printed: 30-40 %  rb-006:959
  // 8 mph (Fr 1.8) computes 39 %, 6 pts under the printed band — inside the plan's ±15.
});

test('side panels recover ≈15–20 pts at 5 mph (RB-006 Table 3.10 key finding 1)', () => {
  const none = GM30(57, 5), both = GM30(57, 5, { panels: 'both' });
  const pts = both - none;
  assert.ok(pts >= 14 && pts <= 21, `recovery ${pts.toFixed(1)} pts`);       // rb-006:966 (approximately 15-20 %)
});

test('side panels + rear wall under a rear wind: near-still-air capture (>95 %)', () => {
  // RB-006 Table 3.10 row "5 mph, side panels + rear wall" (rb-006:955): a
  // rear wall only shelters a wind from the rear (rb-006:857-859), so the
  // row is read as wall-mount + rear wind. RB-002 Gas Medium hood depth at
  // 30 in is 53 in (rb-002:536 D_min), cooking depth 21 in (rb-002:995).
  const c = pct(captureFraction({ widthIn: 57, depthIn: 53, mount: 'wall', riseIn: 30, windMph: 5, windDir: 'rear', panels: 'both', src: SOURCES.gasMedium }));
  inBand(c, 95, 100, 0, 'wall + panels, rear wind 5 mph');                   // rb-006:955 (>95 %)
});

test('wind reduces capture monotonically; bounded 0..1', () => {
  const base = { widthIn: 48, depthIn: 40, mount: 'island', riseIn: 30 };
  const c0 = captureFraction({ ...base, windMph: 0 });
  const c5 = captureFraction({ ...base, windMph: 5 });
  const c10 = captureFraction({ ...base, windMph: 10 });
  assert.ok(c0 > c5 && c5 > c10);
  const c40 = captureFraction({ ...base, windMph: 40 });
  assert.ok(c40 >= 0 && c40 <= 1 && c40 < c10);
});

test('wider hood captures more under a side wind; depth is irrelevant to a side wind and width to a rear wind', () => {
  const base = { depthIn: 40, mount: 'island', riseIn: 30, windMph: 5, windDir: 'side' };
  assert.ok(captureFraction({ ...base, widthIn: 72 }) > captureFraction({ ...base, widthIn: 42 }));
  assert.equal(captureFraction({ ...base, widthIn: 48, depthIn: 40 }), captureFraction({ ...base, widthIn: 48, depthIn: 60 }));
  const rear = { widthIn: 48, mount: 'island', riseIn: 30, windMph: 5, windDir: 'rear' };
  assert.equal(captureFraction({ ...rear, depthIn: 40 }), captureFraction({ ...rear, widthIn: 72, depthIn: 40 }));
  assert.ok(captureFraction({ ...rear, depthIn: 53 }) > captureFraction({ ...rear, depthIn: 40 }));
});

test('rear wind: a wall-mount is sheltered by its wall (rb-006:859) and beats the island; side wind: identical', () => {
  const wallRear = captureFraction({ widthIn: 48, depthIn: 36, mount: 'wall', riseIn: 30, windMph: 8, windDir: 'rear' });
  const islandRear = captureFraction({ widthIn: 48, depthIn: 40, mount: 'island', riseIn: 30, windMph: 8, windDir: 'rear' });
  assert.ok(wallRear > islandRear, `wall ${wallRear.toFixed(2)} vs island ${islandRear.toFixed(2)}`);
  const wallSide = captureFraction({ widthIn: 48, depthIn: 36, mount: 'wall', riseIn: 30, windMph: 8, windDir: 'side' });
  const islandSide = captureFraction({ widthIn: 48, depthIn: 40, mount: 'island', riseIn: 30, windMph: 8, windDir: 'side' });
  near(wallSide, islandSide, 1e-12, 'side wind: mount does not matter');
  // wall under rear wind responds to wind monotonically
  const w = (mph) => captureFraction({ widthIn: 48, depthIn: 36, mount: 'wall', riseIn: 30, windMph: mph, windDir: 'rear' });
  assert.ok(w(0) > w(5) && w(5) > w(15));
});

test('legacy call shape (STAGE-A SHIM): no windDir/src → side wind, Gas Medium; panels "one" behaves as "none"', () => {
  const a = captureFraction({ widthIn: 48, depthIn: 40, mount: 'island', riseIn: 30, windMph: 5 });
  const b = captureFraction({ widthIn: 48, depthIn: 40, mount: 'island', riseIn: 30, windMph: 5, windDir: 'side', src: SOURCES.gasMedium });
  assert.equal(a, b);
  const one = captureFraction({ widthIn: 48, depthIn: 40, mount: 'island', riseIn: 30, windMph: 8, panels: 'one' });
  const none = captureFraction({ widthIn: 48, depthIn: 40, mount: 'island', riseIn: 30, windMph: 8, panels: 'none' });
  assert.equal(one, none);                                                    // rb-009:369 (single panel not modelled)
});
