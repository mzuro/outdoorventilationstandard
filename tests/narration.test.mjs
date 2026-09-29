// narration.test.mjs — /api/explain narration post-validation (W3
// review MAJOR-1). The state sheets used here are real computeState()
// outputs (same shapes the worker validates against), so these tests
// pin the exact behavior the review demanded: a hallucinated number is
// NEVER displayed; correct-but-rounded and unit-suffixed variants pass.
//
// Physics literals are the RB-008 cells the sheet reproduces
// (tests/cfm.test.mjs); everything else is derived from the sheet itself
// so the tests cannot drift from the modules.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateNarration, extractNumerals, allowedNumbers, templateNarration } from '../src/lib/narration.mjs';
import { computeState } from '../src/lib/explain-state.mjs';

// Real state sheets, matching the site's canonical configs (plan §3).
const I02_STATE = computeState('i02', { source: 'gasLarge', height: 30, mount: 'island', exposure: 'moderate', panels: 'none' });
const I02_WALL = computeState('i02', { source: 'gasLarge', height: 30, mount: 'wall', exposure: 'moderate', panels: 'none' });
const I01_STATE = computeState('i01', { wind: 5, width: 48, mount: 'island', panels: 'none', dir: 'side' });
// A config whose sheet carries decimal values (effective wind 2.8 mph with
// both panels, a fractional deflection), for the rounding-variant tests.
const I01_DECIMAL_STATE = computeState('i01', { wind: 7, width: 48, mount: 'island', panels: 'both', dir: 'side' });
const fmt = (n) => n.toLocaleString('en-US');

test('sanity: canonical i02 sheets hold the RB-008 numbers (island 1,070 / 1,200; wall 892 / 1,200)', () => {
  assert.equal(I02_STATE.outputs.minimumCfm, 1070);                          // rb-008:567
  assert.equal(I02_STATE.outputs.blowerCfm, 1200);                           // rb-008:310, rb-008:870
  assert.equal(I02_WALL.outputs.minimumCfm, 892);                            // rb-008:310
  assert.equal(I02_WALL.outputs.blowerCfm, 1200);                            // rb-008:310
});

// --- the review's proven attack: hallucinated numbers must be rejected ---

test('hallucinated number is rejected (reviewer ATTACK3 payload)', () => {
  const r = validateNarration('This configuration captures 999% of the plume and needs 5 CFM only.', I02_STATE);
  assert.equal(r.ok, false);
  assert.ok(r.bad.includes('999'));
});

test('subtly wrong number is rejected (1,100 when the sheet says 1,070)', () => {
  const r = validateNarration('You need at least 1,100 CFM here.', I02_STATE);
  assert.equal(r.ok, false);
  assert.deepEqual(r.bad, ['1,100']);
});

test('invented precision is rejected (a one-decimal deflection shifted by 0.7 in)', () => {
  const d = I01_DECIMAL_STATE.outputs.deflectionIn;
  assert.notEqual(d, Math.round(d), 'precondition: the sheet deflection has a fractional part');
  const wrong = (d + 0.7).toFixed(1);
  const r = validateNarration(`The plume deflects ${wrong} inches sideways.`, I01_DECIMAL_STATE);
  assert.equal(r.ok, false, `expected ${wrong} to be rejected against ${d}`);
});

test('a number from outside the sheet (e.g. 100 fpm folklore) is rejected', () => {
  const r = validateNarration('Aim for the classic 100 fpm face velocity.', I02_STATE);
  assert.equal(r.ok, false);
});

// --- legitimate variants must be accepted ---

test('exact sheet numbers with unit suffixes are accepted', () => {
  const o = I02_STATE.outputs;
  const r = validateNarration(
    `A 60,000 BTU/hr grill at 30 inches on an island needs ${fmt(o.minimumCfm)} CFM minimum — specify a ${fmt(o.blowerCfm)} CFM blower (K_CFM ${o.kCfm} on a ${o.plumeCfm} CFM plume).`,
    I02_STATE
  );
  assert.equal(r.ok, true, JSON.stringify(r.bad));
});

test('correct-but-rounded number is accepted (whole inches / whole mph for one-decimal sheet values)', () => {
  const o = I01_DECIMAL_STATE.outputs;
  assert.notEqual(o.effectiveWindMph, Math.round(o.effectiveWindMph), 'precondition: effective wind has a fractional part');
  const r = validateNarration(
    `With both panels the effective wind drops to about ${Math.round(o.effectiveWindMph)} mph and the plume lands roughly ${Math.round(o.deflectionIn)} inches off-center on this 48-inch hood.`,
    I01_DECIMAL_STATE
  );
  assert.equal(r.ok, true, JSON.stringify(r.bad));
});

test('thousands-shorthand is accepted (60k for the sheet\'s 60000 BTU source)', () => {
  const r = validateNarration(`A 60k BTU appliance at 30 inches needs ${fmt(I02_STATE.outputs.minimumCfm)} CFM.`, I02_STATE);
  assert.equal(r.ok, true, JSON.stringify(r.bad));
});

test('numeral-free prose is accepted', () => {
  const r = validateNarration('Wind pushes the rising plume sideways, so a wider hood or side panels help capture it.', I02_STATE);
  assert.equal(r.ok, true);
});

test('RB paper codes are citations, not quantities — RB-008 does not trip validation', () => {
  const r = validateNarration(`See RB-008 and RB-001 for the sizing methodology; the minimum is ${fmt(I02_STATE.outputs.minimumCfm)} CFM.`, I02_STATE);
  assert.equal(r.ok, true, JSON.stringify(r.bad));
});

test('a hallucination hiding among correct numbers still fails', () => {
  const r = validateNarration(`The minimum is ${fmt(I02_STATE.outputs.minimumCfm)} CFM, though most sites quote 400 CFM per burner.`, I02_STATE);
  assert.equal(r.ok, false);
  assert.deepEqual(r.bad, ['400']);
});

// --- plumbing ---

test('extractNumerals: commas, decimals, and RB scrubbing', () => {
  const toks = extractNumerals('RB-008 says 1,450 CFM and 12.8 in.');
  assert.deepEqual(toks.map((t) => t.value), [1450, 12.8]);
  assert.deepEqual(toks.map((t) => t.decimals), [0, 1]);
});

test('allowedNumbers walks inputs and outputs', () => {
  const allowed = allowedNumbers(I02_STATE);
  assert.ok(allowed.has(60000)); // input (sourceBtu)
  assert.ok(allowed.has(1200));  // output (blowerCfm)
});

// --- honest degradation: template narration uses only sheet values ---

test('templateNarration(i02) is itself validation-clean and carries the sheet numbers', () => {
  const t = templateNarration(I02_STATE);
  assert.match(t, /1,070 CFM/);
  assert.match(t, /1,200 CFM/);
  assert.equal(validateNarration(t, I02_STATE).ok, true, JSON.stringify(validateNarration(t, I02_STATE).bad));
  const w = templateNarration(computeState('i02', { source: 'gasLarge', height: 30, mount: 'wall', exposure: 'moderate', panels: 'none', width: 48 }));
  assert.match(w, /892 CFM/);
  assert.equal(validateNarration(w, computeState('i02', { source: 'gasLarge', height: 30, mount: 'wall', exposure: 'moderate', panels: 'none', width: 48 })).ok, true);
});

test('templateNarration(i01) is itself validation-clean', () => {
  const t = templateNarration(I01_STATE);
  assert.match(t, new RegExp(`${I01_STATE.outputs.capturePct}%`));
  assert.equal(validateNarration(t, I01_STATE).ok, true, JSON.stringify(validateNarration(t, I01_STATE).bad));
  const rear = computeState('i01', { wind: 5, width: 48, mount: 'wall', panels: 'both', dir: 'rear' });
  assert.equal(validateNarration(templateNarration(rear), rear).ok, true);
});

test('templateNarration degrades safely on a malformed state', () => {
  assert.match(templateNarration(null), /unavailable/i);
});

// --- Stage-B review: above-ladder blower + side panels in the i02 template ---

test('templateNarration(i02) above the ladder says the requirement exceeds the largest standard size — never "specify a <minimum> CFM blower"', () => {
  const s = computeState('i02', { source: 'gasHigh', height: 48, mount: 'island', exposure: 'exposed', panels: 'none' });
  assert.equal('blowerCfm' in s.outputs, false, 'precondition');
  const t = templateNarration(s);
  assert.match(t, /no standard blower size in the RB-008 ladder meets 1\.1 × 3,732 = 4,105 CFM/);       // rb-008:870
  assert.match(t, /exceeds the largest standard size, 3,000 CFM/);                                      // rb-008:614 ladder, site-extended
  assert.doesNotMatch(t, /specify a/);
  assert.doesNotMatch(t, /3,732 CFM blower/);
  assert.equal(validateNarration(t, s).ok, true, JSON.stringify(validateNarration(t, s).bad));
  // A model narration that DID relabel the minimum as the blower still
  // passes the numeral check (3,732 is a sheet number) — which is exactly
  // why the sheet itself must not carry it as blowerCfm.
});

test('templateNarration(i02) names side panels in the exposed class only (matches the copy-spec line: "exposed + panels" / "exposed")', () => {
  const withPanels = computeState('i02', { source: 'gasLarge', height: 30, mount: 'island', exposure: 'exposed', panels: 'both' });
  const noPanels = computeState('i02', { source: 'gasLarge', height: 30, mount: 'island', exposure: 'exposed', panels: 'none' });
  const moderate = computeState('i02', { source: 'gasLarge', height: 30, mount: 'island', exposure: 'moderate', panels: 'both' });
  const tw = templateNarration(withPanels);
  const tn = templateNarration(noPanels);
  const tm = templateNarration(moderate);
  assert.match(tw, /exposed wind exposure with side panels on both sides needs at least 1,205 CFM/);   // 1,004 × 1.20 (rb-008:144, rb-008:561)
  assert.match(tw, /K_CFM 4\.14/);                                                                       // rb-008:144
  assert.match(tn, /exposed wind exposure with no side panels needs at least 1,673 CFM/);               // 1,394 × 1.20 (rb-008:145, rb-008:561)
  assert.match(tn, /K_CFM 5\.75/);                                                                       // rb-008:145
  assert.doesNotMatch(tm, /panels/, 'panels do not enter K_CFM outside the exposed class (rb-008:144-145)');
  for (const [t, s] of [[tw, withPanels], [tn, noPanels], [tm, moderate]]) assert.equal(validateNarration(t, s).ok, true, JSON.stringify(validateNarration(t, s).bad));
});
