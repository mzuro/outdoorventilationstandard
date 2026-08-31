// W5-T6 (UX P1-6): copy-spec-line "carry-away" button on I-02.
//
// buildSpecLine() is pure and DOM-free (no `location` read inside it — see
// static/js/ovs/instruments/i02.mjs's spec.copyLine, which is the only
// place that touches `location`) so it is directly testable under plain
// node. Every CFM number asserted below comes from calling requiredCfm()
// ourselves, not from a hardcoded guess, so this test cannot silently
// drift from the physics module (../static/js/ovs/physics/cfm.mjs).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSpecLine } from '../static/js/ovs/instruments/i02.mjs';
import { requiredCfm } from '../static/js/ovs/physics/cfm.mjs';

const HREF = 'https://outdoorventilationstandard.com/questions/what-cfm-do-i-need/';

test('buildSpecLine: 48in/wall/60k BTU/moderate — the site baseline (min 1,200 / rec 1,500, tests/cfm.test.mjs)', () => {
  const bands = requiredCfm({ widthIn: 48, mount: 'wall', btu: 60000, exposure: 'moderate' });
  assert.equal(bands.minimum, 1200);
  assert.equal(bands.recommended, 1500);
  const state = { 'i02-width': 48, 'i02-mount': 'wall', 'i02-btu': 60000, 'i02-exposure': 'moderate' };
  const line = buildSpecLine(state, bands, HREF);
  assert.equal(
    line,
    '48 in wall · 60k BTU · moderate wind → min 1,200 / rec 1,500 CFM — outdoorventilationstandard.com/questions/what-cfm-do-i-need/ (RB-008)',
  );
});

test('buildSpecLine: 48in/island reflects whatever requiredCfm() actually returns, not a hardcoded guess', () => {
  const state = { 'i02-width': 48, 'i02-mount': 'island', 'i02-btu': 60000, 'i02-exposure': 'moderate' };
  const bands = requiredCfm({
    widthIn: state['i02-width'], mount: state['i02-mount'],
    btu: state['i02-btu'], exposure: state['i02-exposure'],
  });
  const line = buildSpecLine(state, bands, HREF);
  // Same formatting convention i02.mjs's own dimension-line code uses
  // (Math.round(cfm).toLocaleString('en-US')) — reused here, not reinvented.
  const minStr = Math.round(bands.minimum).toLocaleString('en-US');
  const recStr = Math.round(bands.recommended).toLocaleString('en-US');
  assert.ok(line.includes(`min ${minStr} / rec ${recStr} CFM`), line);
  assert.ok(line.startsWith('48 in island · 60k BTU · moderate wind'), line);
  // Island carries a real premium over wall at the same width/BTU/exposure
  // — asserting the relationship (not a copied literal) keeps this test
  // physics-honest even if requiredCfm()'s constants ever change.
  const wallBands = requiredCfm({ widthIn: 48, mount: 'wall', btu: 60000, exposure: 'moderate' });
  assert.ok(bands.minimum > wallBands.minimum, 'island minimum should exceed the wall baseline');
});

test('buildSpecLine: a third configuration (60in/wall/90k BTU/exposed) also matches requiredCfm() exactly', () => {
  const state = { 'i02-width': 60, 'i02-mount': 'wall', 'i02-btu': 90000, 'i02-exposure': 'exposed' };
  const bands = requiredCfm({
    widthIn: state['i02-width'], mount: state['i02-mount'],
    btu: state['i02-btu'], exposure: state['i02-exposure'],
  });
  const line = buildSpecLine(state, bands, HREF);
  assert.ok(line.includes('60 in wall'), line);
  assert.ok(line.includes('90k BTU'), line);
  assert.ok(line.includes('exposed wind'), line);
  assert.ok(line.includes(`min ${Math.round(bands.minimum).toLocaleString('en-US')}`), line);
  assert.ok(line.includes(`rec ${Math.round(bands.recommended).toLocaleString('en-US')}`), line);
});

test('buildSpecLine embeds the href it is given, stripped of scheme, and cites RB-008', () => {
  const bands = requiredCfm({ widthIn: 42, mount: 'wall', btu: 30000, exposure: 'sheltered' });
  const state = { 'i02-width': 42, 'i02-mount': 'wall', 'i02-btu': 30000, 'i02-exposure': 'sheltered' };
  const toolLine = buildSpecLine(state, bands, 'https://outdoorventilationstandard.com/tools/cfm-calculator/');
  assert.ok(toolLine.includes('outdoorventilationstandard.com/tools/cfm-calculator/'), toolLine);
  assert.ok(!toolLine.includes('https://'), 'scheme should be dropped from the displayed URL');
  assert.ok(toolLine.endsWith('(RB-008)'), toolLine);
  // A different page embedding the same instrument gets its OWN url — no
  // hardcoded page is baked into the formatter.
  const questionLine = buildSpecLine(state, bands, 'https://outdoorventilationstandard.com/questions/what-cfm-do-i-need/');
  assert.ok(questionLine.includes('/questions/what-cfm-do-i-need/'), questionLine);
  assert.notEqual(toolLine, questionLine);
});

test('buildSpecLine returns null without bands (never fabricates a line before the first update())', () => {
  const state = { 'i02-width': 48, 'i02-mount': 'wall', 'i02-btu': 60000, 'i02-exposure': 'moderate' };
  assert.equal(buildSpecLine(state, null, HREF), null);
  assert.equal(buildSpecLine(state, undefined, HREF), null);
});
