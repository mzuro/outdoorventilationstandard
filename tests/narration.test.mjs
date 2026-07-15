// narration.test.mjs — /api/explain narration post-validation (W3
// review MAJOR-1). The state sheets used here are real computeState()
// outputs (same shapes the worker validates against), so these tests
// pin the exact behavior the review demanded: a hallucinated number is
// NEVER displayed; correct-but-rounded and unit-suffixed variants pass.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateNarration, extractNumerals, allowedNumbers, templateNarration } from '../src/lib/narration.mjs';
import { computeState } from '../src/lib/explain-state.mjs';

// Real state sheets, matching the site's published canonical configs.
const I02_STATE = computeState('i02', { width: 48, mount: 'island', exposure: 'moderate', btu: 60000 });
const I01_STATE = computeState('i01', { wind: 5, width: 48, mount: 'island', panels: 'none' });
// A config whose sheet carries decimal values (deflection 11.8 in,
// effective wind 4.6 mph), for the rounding-variant tests.
const I01_DECIMAL_STATE = computeState('i01', { wind: 7, width: 48, mount: 'island', panels: 'one' });

test('sanity: canonical i02 sheet holds the published 1450/1800 numbers', () => {
  assert.equal(I02_STATE.outputs.minimumCfm, 1450);
  assert.equal(I02_STATE.outputs.recommendedCfm, 1800);
});

// --- the review's proven attack: hallucinated numbers must be rejected ---

test('hallucinated number is rejected (reviewer ATTACK3 payload)', () => {
  const r = validateNarration('This configuration captures 999% of the plume and needs 5 CFM only.', I02_STATE);
  assert.equal(r.ok, false);
  assert.ok(r.bad.includes('999'));
});

test('subtly wrong number is rejected (1,500 when the sheet says 1,450)', () => {
  const r = validateNarration('You need at least 1,500 CFM here.', I02_STATE);
  assert.equal(r.ok, false);
  assert.deepEqual(r.bad, ['1,500']);
});

test('invented precision is rejected (12.5 in when the sheet says 11.8)', () => {
  assert.equal(I01_DECIMAL_STATE.outputs.deflectionIn, 11.8);
  const r = validateNarration('The plume deflects 12.5 inches sideways.', I01_DECIMAL_STATE);
  assert.equal(r.ok, false);
});

test('a number from outside the sheet (e.g. 100 fpm folklore) is rejected', () => {
  const r = validateNarration('Aim for the classic 100 fpm face velocity.', I02_STATE);
  assert.equal(r.ok, false);
});

// --- legitimate variants must be accepted ---

test('exact sheet numbers with unit suffixes are accepted', () => {
  const r = validateNarration(
    'A 48-inch island hood over a 60,000 BTU/hr burner needs 1,450 CFM minimum and 1,800 CFM recommended; high wind calls for 2,525 CFM.',
    I02_STATE
  );
  assert.equal(r.ok, true, JSON.stringify(r.bad));
});

test('correct-but-rounded number is accepted (12 in for sheet value 11.8, 5 mph for 4.6)', () => {
  assert.equal(I01_DECIMAL_STATE.outputs.deflectionIn, 11.8);
  assert.equal(I01_DECIMAL_STATE.outputs.effectiveWindMph, 4.6);
  const r = validateNarration(
    'With one panel the effective wind drops to about 5 mph and the plume lands roughly 12 inches off-center on this 48-inch hood.',
    I01_DECIMAL_STATE
  );
  assert.equal(r.ok, true, JSON.stringify(r.bad));
});

test('thousands-shorthand is accepted (60k for 60000)', () => {
  const r = validateNarration('A 60k BTU appliance at 48 inches needs 1,450 CFM.', I02_STATE);
  assert.equal(r.ok, true, JSON.stringify(r.bad));
});

test('numeral-free prose is accepted', () => {
  const r = validateNarration('Wind pushes the rising plume sideways, so a wider hood or side panels help capture it.', I02_STATE);
  assert.equal(r.ok, true);
});

test('RB paper codes are citations, not quantities — RB-008 does not trip validation', () => {
  const r = validateNarration('See RB-008 and RB-001 for the sizing methodology; the minimum is 1,450 CFM.', I02_STATE);
  assert.equal(r.ok, true, JSON.stringify(r.bad));
});

test('a hallucination hiding among correct numbers still fails', () => {
  const r = validateNarration('The minimum is 1,450 CFM, though most sites quote 400 CFM per burner.', I02_STATE);
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
  assert.ok(allowed.has(60000)); // input
  assert.ok(allowed.has(1800));  // output
});

// --- honest degradation: template narration uses only sheet values ---

test('templateNarration(i02) is itself validation-clean and carries the sheet numbers', () => {
  const t = templateNarration(I02_STATE);
  assert.match(t, /1,450 CFM/);
  assert.match(t, /1,800 CFM/);
  assert.equal(validateNarration(t, I02_STATE).ok, true);
});

test('templateNarration(i01) is itself validation-clean', () => {
  const t = templateNarration(I01_STATE);
  assert.match(t, /79%/);
  assert.equal(validateNarration(t, I01_STATE).ok, true);
});

test('templateNarration degrades safely on a malformed state', () => {
  assert.match(templateNarration(null), /unavailable/i);
});
