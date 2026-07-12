import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeI01State, computeI02State, computeState, PAPER_MAP } from '../src/lib/explain-state.mjs';

// These numbers are cross-checked against the published question pages
// (content/questions/*.md) — the "explain" state sheet must be the exact
// same physics that grounds the ask-box and renders the instrument, or a
// narration and the page around it could disagree.

test('i01: 48in island, 5 mph, no panels matches does-wind-affect-my-hood.md (79% capture, 13in deflection)', () => {
  const s = computeI01State({ wind: 5, width: 48, mount: 'island', panels: 'none' });
  assert.equal(s.outputs.capturePct, 79);
  assert.equal(s.outputs.deflectionIn, 13);
});

test('i02: 48in island, moderate, 60k btu matches what-cfm-do-i-need.md (1450/1800 CFM)', () => {
  const s = computeI02State({ width: 48, mount: 'island', exposure: 'moderate', btu: 60000 });
  assert.equal(s.outputs.minimumCfm, 1450);
  assert.equal(s.outputs.recommendedCfm, 1800);
});

test('i02: 48in wall, moderate, 60k btu matches what-cfm-do-i-need.md (1200/1500 CFM)', () => {
  const s = computeI02State({ width: 48, mount: 'wall', exposure: 'moderate', btu: 60000 });
  assert.equal(s.outputs.minimumCfm, 1200);
  assert.equal(s.outputs.recommendedCfm, 1500);
});

test('i01 state sheet carries only numbers, echoed inputs, and no free text', () => {
  const s = computeI01State({ wind: 0, width: 42, mount: 'wall', panels: 'both' });
  for (const v of Object.values(s.outputs)) assert.equal(typeof v, 'number');
  assert.equal(s.instrument, 'i01');
});

test('computeState dispatches by instrument id; unknown instrument returns null', () => {
  assert.equal(computeState('i01', { wind: 0, width: 42, mount: 'wall', panels: 'none' }).instrument, 'i01');
  assert.equal(computeState('i02', { width: 42, mount: 'wall', exposure: 'sheltered', btu: 30000 }).instrument, 'i02');
  assert.equal(computeState('i99', {}), null);
});

test('PAPER_MAP only lists papers actually cited for these instruments elsewhere on the site', () => {
  assert.deepEqual(PAPER_MAP.i01, ['RB-001', 'RB-002', 'RB-005', 'RB-006', 'RB-009']);
  assert.deepEqual(PAPER_MAP.i02, ['RB-001', 'RB-006', 'RB-008']);
});
