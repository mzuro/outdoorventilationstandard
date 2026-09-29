// explain-ui.test.mjs — the "Explain this configuration" state-readout rows
// (static/js/ovs/explain-ui.mjs STATE_READOUTS / stateReadoutText). The
// module imports cleanly under node (DOM is touched only inside wireExplain).
//
// Stage-B review HIGH: above the blower ladder the sheet has NO blowerCfm
// (src/lib/explain-state.mjs); the BLOWER row must then show the ladder top
// the way the instrument's own readout does — never the minimum.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STATE_READOUTS, stateReadoutText } from '../static/js/ovs/explain-ui.mjs';
import { computeState } from '../src/lib/explain-state.mjs';
import { ABOVE_LADDER_READOUT } from '../static/js/ovs/instruments/i02.mjs';

const rowsFor = (state) => Object.fromEntries(STATE_READOUTS[state.instrument].map((r) => [r.label, stateReadoutText(r, state)]));

test('i02 flagship rows: 892 / 1,200 / 3.68× · moderate / 242 (RB-008 §3.3)', () => {
  const rows = rowsFor(computeState('i02', { source: 'gasLarge', height: 30, mount: 'wall', exposure: 'moderate', panels: 'none' }));
  assert.equal(rows.MINIMUM, '892 CFM');                                      // rb-008:310
  assert.equal(rows.BLOWER, '1,200 CFM');                                     // rb-008:310, rb-008:870
  assert.equal(rows.K_CFM, '3.68× · moderate');                               // rb-008:143
  assert.equal(rows['PLUME FLOW'], '242 CFM');                                // rb-008:202
});

test('i02 above the ladder: BLOWER row shows the ladder top ("> 3,000 CFM"), identical to the instrument readout, not the 3,732 minimum', () => {
  const s = computeState('i02', { source: 'gasHigh', height: 48, mount: 'island', exposure: 'exposed', panels: 'none' });
  assert.equal('blowerCfm' in s.outputs, false, 'precondition');
  const rows = rowsFor(s);
  assert.equal(rows.MINIMUM, '3,732 CFM');
  assert.equal(rows.BLOWER, '> 3,000 CFM');                                   // rb-008:614 ladder, site-extended (cfm.mjs)
  assert.equal(rows.BLOWER, ABOVE_LADDER_READOUT);
  assert.equal(rows.K_CFM, '5.75× · exposed');                                // rb-008:145
});

test('i02 K_CFM row names the wind class with panels, matching the copy-spec line ("exposed + panels")', () => {
  const rows = rowsFor(computeState('i02', { source: 'gasLarge', height: 30, mount: 'island', exposure: 'exposed', panels: 'both' }));
  assert.equal(rows.K_CFM, '4.14× · exposed + panels');                       // rb-008:144
  assert.equal(rows.BLOWER, '1,500 CFM');                                     // 1.1 × 1,205 = 1,326 → 1,500 (rb-008:870, rb-008:614)
});

test('a row whose key is absent and has no fallback is omitted (null), not rendered as "undefined"', () => {
  const s = computeState('i02', { source: 'gasLarge', height: 30, mount: 'wall', exposure: 'moderate', panels: 'none' });
  delete s.outputs.plumeCfm;
  assert.equal(stateReadoutText(STATE_READOUTS.i02.find((r) => r.key === 'plumeCfm'), s), null);
});
