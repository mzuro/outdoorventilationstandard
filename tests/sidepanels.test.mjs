// sidepanels.test.mjs — A3 of the physics re-base. Wind reduction by side
// panels comes from RB-009 Table 3.1a/b (R_panel by fractional enclosure f
// and wind direction, rb-009:240-260) applied as U_eff = U_w · (1 − R_panel)
// (rb-009:232); the rear-wall reduction from RB-006 §3.9.2 (rb-006:859).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { R_PANEL, R_WALL, F_DEFAULT, effectiveWind, panelReduction } from '../static/js/ovs/physics/sidepanels.mjs';

const near = (got, want, tol, msg) => assert.ok(Math.abs(got - want) <= tol, `${msg}: got ${got}, want ${want} ±${tol}`);

test('R_PANEL.two: RB-009 Table 3.1a rows (lateral / front-rear / 45° / all-direction average)', () => {
  const t = R_PANEL.two;
  assert.deepEqual(t.f, [0.25, 0.33, 0.50, 0.67, 0.75, 1.00]);               // rb-009:242-247 (f column)
  assert.deepEqual(t.lateral,   [0.20, 0.28, 0.45, 0.60, 0.68, 0.85]);       // rb-009:242-247
  assert.deepEqual(t.frontRear, [0.05, 0.08, 0.12, 0.15, 0.18, 0.22]);       // rb-009:242-247
  assert.deepEqual(t.diag,      [0.12, 0.17, 0.28, 0.37, 0.42, 0.52]);       // rb-009:242-247
  assert.deepEqual(t.avg,       [0.10, 0.15, 0.25, 0.33, 0.38, 0.48]);       // rb-009:242-247
});

test('R_PANEL.three: RB-009 Table 3.1b rows at f = 0.50 / 0.67 / 1.00', () => {
  const t = R_PANEL.three;
  const i50 = t.f.indexOf(0.50), i67 = t.f.indexOf(0.67), i100 = t.f.indexOf(1.00);
  assert.deepEqual([t.rear[i50], t.lateral[i50], t.front[i50], t.diag[i50], t.avg[i50]], [0.45, 0.45, 0.12, 0.35, 0.34]);   // rb-009:257
  assert.deepEqual([t.rear[i67], t.lateral[i67], t.front[i67], t.diag[i67], t.avg[i67]], [0.62, 0.60, 0.18, 0.48, 0.47]);   // rb-009:258
  assert.deepEqual([t.rear[i100], t.lateral[i100], t.front[i100], t.diag[i100], t.avg[i100]], [0.88, 0.85, 0.30, 0.68, 0.68]); // rb-009:260
});

test('R_WALL sits inside RB-006 §3.9.2\'s 60–80 % rear-wall reduction (midpoint 0.70)', () => {
  assert.equal(R_WALL, 0.70);                                                 // rb-006:859 (60 to 80 % → midpoint)
  assert.ok(R_WALL >= 0.60 && R_WALL <= 0.80);                                // rb-006:859
});

test('default enclosure fraction is f = 0.67 (lateral R = 0.60 → the published "40 % of ambient" survives)', () => {
  assert.equal(F_DEFAULT, 0.67);                                              // rb-009:245 (row used by the site copy)
  near(panelReduction({ panels: 'both', f: 0.67, dir: 'side' }), 0.60, 1e-9, 'lateral R at f=0.67'); // rb-009:245
  near(effectiveWind(10, { panels: 'both' }), 4.0, 1e-9, 'U_eff = 10 × (1 − 0.60)');                // rb-009:232, rb-009:245
  // RB-006 §3.9.1 frames the same thing as a 40–60 % reduction (rb-006:833)
  const reduction = 1 - effectiveWind(10, { panels: 'both' }) / 10;
  assert.ok(reduction >= 0.40 && reduction <= 0.60);                          // rb-006:833
});

test('two side panels barely help against rear wind (R = 0.15 at f = 0.67)', () => {
  near(effectiveWind(10, { panels: 'both', dir: 'rear' }), 8.5, 1e-9, 'rear wind');   // rb-009:245 front/rear column
  near(effectiveWind(10, { panels: 'both', dir: 'diag' }), 6.3, 1e-9, '45° wind');    // rb-009:245 45-degree column
});

test('no panels: wind is unchanged; a rear wall under rear wind applies R_WALL', () => {
  assert.equal(effectiveWind(10, { panels: 'none' }), 10);
  assert.equal(effectiveWind(10, {}), 10);
  near(effectiveWind(10, { panels: 'none', mount: 'wall', dir: 'rear' }), 3.0, 1e-9, 'wall + rear wind');  // rb-006:859 (1 − 0.70)
  assert.equal(effectiveWind(10, { panels: 'none', mount: 'wall', dir: 'side' }), 10); // a side wind is parallel to the wall
  assert.equal(effectiveWind(10, { panels: 'none', mount: 'island', dir: 'rear' }), 10);
});

test('panels + wall compose multiplicatively under rear wind', () => {
  near(effectiveWind(10, { panels: 'both', mount: 'wall', dir: 'rear' }), 10 * (1 - 0.15) * (1 - 0.70), 1e-9, 'compose'); // rb-009:245, rb-006:859
});

test('f between table rows interpolates linearly and is monotone', () => {
  const r50 = panelReduction({ panels: 'both', f: 0.50 });                     // rb-009:244 → 0.45
  const r67 = panelReduction({ panels: 'both', f: 0.67 });                     // rb-009:245 → 0.60
  const mid = panelReduction({ panels: 'both', f: 0.585 });
  assert.ok(mid > r50 && mid < r67);
  near(mid, (0.45 + 0.60) / 2, 1e-9, 'midpoint');
  assert.equal(panelReduction({ panels: 'both', f: 0 }), 0);
  assert.equal(panelReduction({ panels: 'both', f: 1.5 }), 0.85);            // rb-009:247 clamps at f = 1.00
});

test('three panels (sides + rear) use Table 3.1b', () => {
  near(panelReduction({ panels: 'three', f: 0.67, dir: 'rear' }), 0.62, 1e-9, 'rear');   // rb-009:258
  near(panelReduction({ panels: 'three', f: 0.67, dir: 'side' }), 0.60, 1e-9, 'lateral'); // rb-009:258
  near(panelReduction({ panels: 'three', f: 0.67, dir: 'front' }), 0.18, 1e-9, 'front');  // rb-009:258
});

// The legacy string form effectiveWind(mph, 'none'|'one'|'both') is gone
// (Stage B): the options object is the only API, and a single panel is
// not modelled (rb-009:369) — 'one' resolves to no reduction.
test('effectiveWind takes the options object only; "one" panel has no row and reduces nothing', () => {
  near(effectiveWind(10, { panels: 'both', dir: 'side' }), 4.0, 1e-9, 'both, lateral');   // rb-009:245
  assert.equal(effectiveWind(10, { panels: 'one', dir: 'side' }), 10);                     // rb-009:369
  assert.equal(effectiveWind(10, { panels: 'none', dir: 'side' }), 10);
});
