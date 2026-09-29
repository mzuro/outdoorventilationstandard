import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeI01State, computeI02State, computeState, PAPER_MAP } from '../src/lib/explain-state.mjs';
import { captureFraction } from '../static/js/ovs/physics/capture.mjs';
import { requiredCfm } from '../static/js/ovs/physics/cfm.mjs';
import { SOURCES } from '../static/js/ovs/physics/heat.mjs';

// The state sheet must be the SAME physics the instrument draws with and
// the question pages quote, so its numbers are pinned to the paper cells
// the modules reproduce (tests/{capture,cfm,wind,plume}.test.mjs) — never to
// a copied instrument readout.

const near = (got, want, tol, msg) => assert.ok(Math.abs(got - want) <= tol, `${msg}: got ${got}, want ${want} ±${tol}`);

test('i01: the RB-002 hood (57 in island) at 5 mph side wind reproduces RB-006 Table 3.10 / 3.2b', () => {
  const s = computeI01State({ wind: 5, width: 57, mount: 'island', panels: 'none', dir: 'side' });
  assert.ok(s.outputs.capturePct >= 70 - 5 && s.outputs.capturePct <= 75 + 5, `capture ${s.outputs.capturePct}`); // rb-006:951 (70-75 %)
  near(s.outputs.deflectionIn, 12, 1.5, 'deflection');                       // rb-006:454
  assert.equal(s.outputs.effectiveWindMph, 5);
  near(s.outputs.plumeWidthAtHoodIn, 41, 1, 'd_capture at 30 in');           // rb-002:687
  near(s.outputs.recommendedWidthIn, 57, 1, 'W_rec at 30 in');               // rb-002:643
  near(s.outputs.froude, 1.13, 0.02, 'Fr');                                   // rb-006:542
});

test('i01: both side panels at 5 mph → effective wind 2 mph (R = 0.60) and RB-006 Table 3.10 88–92 %', () => {
  const s = computeI01State({ wind: 5, width: 57, mount: 'island', panels: 'both', dir: 'side' });
  near(s.outputs.effectiveWindMph, 2, 0.05, 'effective wind');               // rb-009:245 (5 × (1 − 0.60))
  assert.ok(s.outputs.capturePct >= 88 - 5 && s.outputs.capturePct <= 92 + 5, `capture ${s.outputs.capturePct}`); // rb-006:953
});

test('i01: rear wind on a wall-mount is sheltered by the wall (effective 30 % of ambient)', () => {
  const s = computeI01State({ wind: 5, width: 48, mount: 'wall', panels: 'none', dir: 'rear' });
  near(s.outputs.effectiveWindMph, 1.5, 0.05, 'effective wind');             // rb-006:859 (60–80 % reduction, midpoint 70 %)
  assert.equal(s.inputs.windDir, 'rear');
});

test('i01: the site preset (48 in island, 5 mph) is exactly captureFraction() — no second model', () => {
  const s = computeI01State({ wind: 5, width: 48, mount: 'island', panels: 'none' });
  const direct = captureFraction({ widthIn: 48, depthIn: 40, mount: 'island', riseIn: 30, windMph: 5, windDir: 'side', panels: 'none' });
  assert.equal(s.outputs.capturePct, Math.round(direct * 100));
  assert.equal(s.inputs.windDir, 'side');
  assert.equal(s.inputs.riseIn, 30);
});

test('i02: Gas Large, 30 in, wall, moderate → 892 minimum / 1,200 blower (RB-008 §3.3)', () => {
  const s = computeI02State({ source: 'gasLarge', height: 30, mount: 'wall', exposure: 'moderate', panels: 'none' });
  assert.equal(s.outputs.minimumCfm, 892);                                    // rb-008:310
  assert.equal(s.outputs.blowerCfm, 1200);                                    // rb-008:310
  assert.equal(s.outputs.kCfm, 3.68);                                         // rb-008:310
  near(s.outputs.plumeCfm, 242, 1, 'plume CFM');                              // rb-008:202
  assert.equal(s.inputs.sourceBtu, 60000);                                    // rb-001:243
  assert.equal(s.inputs.source, 'gasLarge');
});

test('i02: island → 1,070 minimum / 1,200 blower (RB-008 §3.9 application example)', () => {
  const s = computeI02State({ source: 'gasLarge', height: 30, mount: 'island', exposure: 'moderate', panels: 'none' });
  assert.equal(s.outputs.minimumCfm, 1070);                                   // rb-008:567
  assert.equal(s.outputs.blowerCfm, 1200);
  assert.equal(s.outputs.mountMultiplier, 1.2);                               // rb-008:561
});

test('i02: every RB-001 source id resolves (no btu mapping remains); an unknown id falls back to Gas Large', () => {
  for (const id of Object.keys(SOURCES)) assert.equal(computeI02State({ source: id, height: 30, mount: 'wall', exposure: 'moderate', panels: 'none' }).inputs.source, id);
  assert.equal(computeI02State({ height: 30, mount: 'wall', exposure: 'moderate', panels: 'none' }).inputs.source, 'gasLarge'); // rb-001:243
});

test('i02: width is a coverage advisory, not a CFM input (RB-008 Table 3.10)', () => {
  const a = computeI02State({ source: 'gasLarge', height: 30, mount: 'wall', exposure: 'moderate', panels: 'none', width: 48 });
  const b = computeI02State({ source: 'gasLarge', height: 30, mount: 'wall', exposure: 'moderate', panels: 'none', width: 72 });
  assert.equal(a.outputs.minimumCfm, b.outputs.minimumCfm);
  near(a.outputs.recommendedWidthIn, 62, 1, 'W_rec Gas Large 30 in');        // rb-002:644
  near(a.outputs.coveragePct, 77, 1, '48 / 62');                              // 48 in vs rb-002:644
  assert.equal(typeof a.outputs.coveragePct, 'number');
  assert.equal('coveragePct' in computeI02State({ source: 'gasLarge', height: 30, mount: 'wall', exposure: 'moderate', panels: 'none' }).outputs, false);
});

test('i02 sheet equals requiredCfm() for the same inputs at every height (no second model)', () => {
  for (const height of [18, 24, 30, 36, 48]) {
    const s = computeI02State({ source: 'gasMedium', height, mount: 'peninsula', exposure: 'exposed', panels: 'both' });
    const r = requiredCfm({ src: SOURCES.gasMedium, riseIn: height, mount: 'peninsula', exposure: 'exposed', panels: 'both' });
    assert.equal(s.outputs.minimumCfm, r.minimum);
    assert.equal(s.outputs.blowerCfm, r.blower);
  }
});

test('state sheets carry only numbers in outputs, echoed inputs, and no free text', () => {
  for (const s of [
    computeI01State({ wind: 0, width: 42, mount: 'wall', panels: 'both', dir: 'side' }),
    computeI02State({ source: 'charcoalKettle', height: 24, mount: 'island', exposure: 'sheltered', panels: 'none', width: 42 }),
  ]) {
    for (const v of Object.values(s.outputs)) assert.equal(typeof v, 'number');
    for (const v of Object.values(s.outputs)) assert.ok(Number.isFinite(v));
  }
});

test('computeState dispatches by instrument id; unknown instrument returns null', () => {
  assert.equal(computeState('i01', { wind: 0, width: 42, mount: 'wall', panels: 'none' }).instrument, 'i01');
  assert.equal(computeState('i02', { source: 'gasSmall', height: 18, mount: 'wall', exposure: 'sheltered', panels: 'none' }).instrument, 'i02');
  assert.equal(computeState('i99', {}), null);
});

test('PAPER_MAP only lists papers actually cited for these instruments elsewhere on the site', () => {
  assert.deepEqual(PAPER_MAP.i01, ['RB-001', 'RB-002', 'RB-005', 'RB-006', 'RB-009']);
  assert.deepEqual(PAPER_MAP.i02, ['RB-001', 'RB-006', 'RB-008']);
});

// --- Stage-B review HIGH: above the blower ladder the sheet must never
//     relabel the minimum as the blower ---------------------------------
test('i02 above the ladder (Gas High-Output, 48 in, island, exposed): no blowerCfm; the sheet carries margin / need / ladder top instead', () => {
  const s = computeI02State({ source: 'gasHigh', height: 48, mount: 'island', exposure: 'exposed', panels: 'none' });
  const r = requiredCfm({ src: SOURCES.gasHigh, riseIn: 48, mount: 'island', exposure: 'exposed', panels: 'none' });
  assert.equal(r.blower, null, 'precondition: 1.1 × minimum exceeds the 3,000 CFM ladder top');
  assert.equal('blowerCfm' in s.outputs, false, 'the minimum must not be relabelled as the blower');
  assert.equal(s.outputs.minimumCfm, 3732);
  assert.equal(s.outputs.blowerMargin, 1.1);                                  // rb-008:870
  assert.equal(s.outputs.blowerNeedCfm, Math.round(3732 * 1.1));              // rb-008:870 → 4,105
  assert.equal(s.outputs.blowerNeedCfm, 4105);
  assert.equal(s.outputs.blowerLadderTopCfm, 3000);                           // rb-008:614 ladder, site-extended to 3,000 (cfm.mjs)
  assert.ok(s.outputs.blowerNeedCfm > s.outputs.blowerLadderTopCfm, 'the need exceeds the largest standard size');
  for (const v of Object.values(s.outputs)) assert.ok(typeof v === 'number' && Number.isFinite(v));
  // A configuration ON the ladder carries blowerCfm and none of the three.
  const on = computeI02State({ source: 'gasLarge', height: 30, mount: 'wall', exposure: 'moderate', panels: 'none' });
  assert.equal(on.outputs.blowerCfm, 1200);                                   // rb-008:310
  for (const k of ['blowerMargin', 'blowerNeedCfm', 'blowerLadderTopCfm']) assert.equal(k in on.outputs, false, k);
});

test('i02 sheet echoes panels so the narration can name them (rb-008:144-145)', () => {
  const s = computeI02State({ source: 'gasLarge', height: 30, mount: 'island', exposure: 'exposed', panels: 'both' });
  assert.equal(s.inputs.panels, 'both');
  assert.equal(s.outputs.kCfm, 4.14);                                         // rb-008:144 (exposed, with panels)
  assert.equal(computeI02State({ source: 'gasLarge', height: 30, mount: 'island', exposure: 'exposed', panels: 'none' }).outputs.kCfm, 5.75); // rb-008:145
});
