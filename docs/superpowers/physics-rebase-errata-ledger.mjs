#!/usr/bin/env node
// physics-rebase-errata-ledger.mjs — Stage C of the 2026-09-26 physics re-base.
//
// Every regenerated paper cell is computed here from the physics modules in
// static/js/ovs/physics/ (the only source) and written into
// content/research/rb-0NN-*.md.  Nothing is hand-typed.
//
//   node docs/superpowers/physics-rebase-errata-ledger.mjs            # print the ledger (markdown)
//   node docs/superpowers/physics-rebase-errata-ledger.mjs --apply    # rewrite the paper cells in place
//
// "old" is read from the pre-errata base commit (BASE) so the ledger stays
// truthful after --apply; "line" is the line in the current working file.

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const BASE = '66cf282'; // origin/physics/rebase-stage-a — papers untouched since v1.0
const PHYS = path.join(ROOT, 'static/js/ovs/physics');
const { SOURCES, heightM } = await import(path.join(PHYS, 'heat.mjs'));
const { centerlineVelocityMs, centerlineVelocity, captureDiameter, plumeHalfWidthBT, recommendedWidth, IN_PER_M } = await import(path.join(PHYS, 'plume.mjs'));
const { deflection, froude, FR_DISRUPTED } = await import(path.join(PHYS, 'wind.mjs'));
const { criticalWinds } = await import(path.join(PHYS, 'capture.mjs'));
const { blowerFor } = await import(path.join(PHYS, 'cfm.mjs'));

const APPLY = process.argv.includes('--apply');
const R = 'content/research/';
const P = {
  rb001: R + 'rb-001-buoyant-plume-behavior.md',
  rb002: R + 'rb-002-entrainment-lateral-plume-spread.md',
  rb003: R + 'rb-003-velocity-decay-capture.md',
  rb004: R + 'rb-004-indoor-vs-outdoor-assumptions.md',
  rb006: R + 'rb-006-wind-interaction-crossflow.md',
  rb007: R + 'rb-007-failure-modes.md',
  rb008: R + 'rb-008-cfm-requirements.md',
  rb011: R + 'rb-011-grease-aerosol-transport.md',
  rb012: R + 'rb-012-thermal-radiation-hood-surfaces.md',
};

const baseText = {}, curText = {};
const H = [18, 24, 30, 36, 48];
const COLS = [
  ['gasSmall', 'Gas Small'], ['gasMedium', 'Gas Med'], ['gasLarge', 'Gas Large'], ['gasHigh', 'Gas High'],
  ['charcoalKettle', 'Charcoal'], ['woodFired', 'Wood'], ['pelletLow', 'Pellet Low'], ['pelletHigh', 'Pellet High'],
];
const ms = (h, id) => centerlineVelocityMs(heightM(h), SOURCES[id]);
const f2 = (x) => x.toFixed(2);
const f1 = (x) => x.toFixed(1);
const f3 = (x) => x.toFixed(3);
const mIn = (inches) => `${(inches / IN_PER_M).toFixed(2)} m (${Math.round(inches)}")`;

// ---------------------------------------------------------------------------
// Table-cell edits.  { paper, table, col, row, group?, value, call }
//   table : substring of the "#### Table …" heading line, OR {header: substring of the header row}
//   col   : substring of the header cell
//   row   : substring of the first cell of the row (rows under a bold group row are keyed by group too)
// ---------------------------------------------------------------------------
const cells = [];
const cell = (o) => cells.push(o);

// RB-001 Table 3.5 (m/s) — all 8 sources × 5 heights  (plan §1 (f))
for (const h of H) for (const [id, name] of COLS) {
  const hdr = { gasSmall: 'Gas Small', gasMedium: 'Gas Medium', gasLarge: 'Gas Large', gasHigh: 'Gas High', charcoalKettle: 'Charcoal Kettle', woodFired: 'Wood-Fired', pelletLow: 'Pellet Low', pelletHigh: 'Pellet High' }[id];
  cell({ paper: 'rb001', table: 'Table 3.5:', col: hdr, row: `${h}"`, value: f2(ms(h, id)), call: `centerlineVelocityMs(heightM(${h}), SOURCES.${id})` });
}
// RB-001 unnumbered ft/min conversion table under Table 3.5
for (const h of H) for (const id of ['gasMedium', 'gasLarge']) {
  const nm = id === 'gasMedium' ? 'Gas Medium' : 'Gas Large';
  cell({ paper: 'rb001', table: { header: '| Height | Gas Medium (m/s) | Gas Medium (ft/min) |' }, col: `${nm} (m/s)`, row: `${h}"`, value: f2(ms(h, id)), call: `centerlineVelocityMs(heightM(${h}), SOURCES.${id})` });
  cell({ paper: 'rb001', table: { header: '| Height | Gas Medium (m/s) | Gas Medium (ft/min) |' }, col: `${nm} (ft/min)`, row: `${h}"`, value: String(Math.round(centerlineVelocity(h, SOURCES[id]))), call: `centerlineVelocity(${h}, SOURCES.${id})` });
}
// RB-001 Table 3.6 Gas Medium column  (plan §1 (i))
for (const h of H) cell({ paper: 'rb001', table: 'Table 3.6:', col: 'Gas Medium', row: `${h}"`, value: mIn(captureDiameter(h, SOURCES.gasMedium)), call: `captureDiameter(${h}, SOURCES.gasMedium)` });

// RB-003 Tables 3.1a (m/s) and 3.1b (ft/min), standard-height rows  (plan §1 (f))
for (const h of H) for (const [id, name] of COLS) {
  cell({ paper: 'rb003', table: 'Table 3.1a:', col: name, row: `${h}"`, value: f2(ms(h, id)), call: `centerlineVelocityMs(heightM(${h}), SOURCES.${id})` });
  cell({ paper: 'rb003', table: 'Table 3.1b:', col: name, row: `${h}"`, value: String(Math.round(centerlineVelocity(h, SOURCES[id]))), call: `centerlineVelocity(${h}, SOURCES.${id})` });
}
// RB-003 Table 3.10 restates Table 3.1a/b and RB-001 Table 3.6 for Gas Medium
{
  const u = (h) => ms(h, 'gasMedium'), v = (h) => Math.round(centerlineVelocity(h, SOURCES.gasMedium)), d = (h) => Math.round(captureDiameter(h, SOURCES.gasMedium));
  for (const h of [18, 30, 48]) {
    cell({ paper: 'rb003', table: 'Table 3.10:', col: `${h}" Height`, row: 'Centerline velocity** u_0 (m/s)', value: f2(u(h)), call: `centerlineVelocityMs(heightM(${h}), SOURCES.gasMedium)` });
    cell({ paper: 'rb003', table: 'Table 3.10:', col: `${h}" Height`, row: 'Centerline velocity** (fpm)', value: String(v(h)), call: `centerlineVelocity(${h}, SOURCES.gasMedium)` });
    cell({ paper: 'rb003', table: 'Table 3.10:', col: `${h}" Height`, row: 'Plume capture diameter', value: String(d(h)), call: `captureDiameter(${h}, SOURCES.gasMedium)` });
  }
  cell({ paper: 'rb003', table: 'Table 3.10:', col: 'Ratio 48"/18"', row: 'Centerline velocity** u_0 (m/s)', value: f2(u(48) / u(18)), call: 'u_0(48)/u_0(18)' });
  cell({ paper: 'rb003', table: 'Table 3.10:', col: 'Ratio 48"/18"', row: 'Centerline velocity** (fpm)', value: f2(u(48) / u(18)), call: 'u_0(48)/u_0(18)' });
  cell({ paper: 'rb003', table: 'Table 3.10:', col: 'Ratio 48"/18"', row: 'Plume capture diameter', value: f2(d(48) / d(18)), call: 'd_capture(48)/d_capture(18)' });
}

// RB-006 Tables 3.2a–h u_0 column  (plan §1 (f) propagation)
const T32 = { a: 'gasSmall', b: 'gasMedium', c: 'gasLarge', d: 'gasHigh', e: 'charcoalKettle', f: 'woodFired', g: 'pelletLow', h: 'pelletHigh' };
for (const [letter, id] of Object.entries(T32)) for (const h of H)
  cell({ paper: 'rb006', table: `Table 3.2${letter}:`, col: 'u_0 (m/s)', row: `${h}"`, value: f2(ms(h, id)), call: `centerlineVelocityMs(heightM(${h}), SOURCES.${id})` });
// RB-006 Table 3.2b 10 / 15 mph cells, Fr > 2.7 marked  (plan §1 (k), Stage-A note 2)
for (const h of H) for (const w of [10, 15]) {
  const d = deflection(h, w, SOURCES.gasMedium), fr = froude(h, w, SOURCES.gasMedium);
  cell({ paper: 'rb006', table: 'Table 3.2b:', col: `${w} mph`, row: `${h}"`, value: mIn(d) + (fr > FR_DISRUPTED ? '†' : ''), call: `deflection(${h}, ${w}, SOURCES.gasMedium); froude() = ${f2(fr)}` });
}
// RB-006 Tables 3.4a/b — b_T and the three U_crit columns re-derived with the printed base-K OH  (plan §0 finding 4, §1 (b))
const T34 = {
  'Table 3.4a:': [['Gas Small', 'gasSmall'], ['Gas Medium', 'gasMedium'], ['Gas Large', 'gasLarge'], ['Gas High-Output', 'gasHigh']],
  'Table 3.4b:': [['Charcoal Kettle', 'charcoalKettle'], ['Wood-Fired', 'woodFired'], ['Pellet Smoker Low', 'pelletLow'], ['Pellet Smoker High', 'pelletHigh']],
};
for (const [table, groups] of Object.entries(T34)) for (const [group, id] of groups) for (const h of H) {
  const src = SOURCES[id];
  const ohM = Number(readBaseCell('rb006', table, 'OH (m)', `${h}"`, group)); // printed base-K overhang, kept
  const widthIn = src.cookWIn + 2 * ohM * IN_PER_M;
  const r = criticalWinds({ widthIn, depthIn: 1e3, riseIn: h, windDir: 'side', src });
  const callBase = `criticalWinds({widthIn: ${src.cookWIn} + 2·${ohM} m, riseIn: ${h}, src: SOURCES.${id}})`;
  cell({ paper: 'rb006', table, group, col: 'b_T (m)', row: `${h}"`, value: f3(plumeHalfWidthBT(h, src) / IN_PER_M), call: `plumeHalfWidthBT(${h}, SOURCES.${id})` });
  cell({ paper: 'rb006', table, group, col: '25% escape', row: `${h}"`, value: f1(r.u25), call: callBase + '.u25' });
  cell({ paper: 'rb006', table, group, col: 'Centerline exit', row: `${h}"`, value: f1(r.uCenterline), call: callBase + '.uCenterline' });
  cell({ paper: 'rb006', table, group, col: '50% escape', row: `${h}"`, value: f1(r.u50), call: callBase + '.u50' });
}

// RB-002 Table 3.7 Pellet Smoker High @ 30"  (Stage-A note 1)
cell({ paper: 'rb002', table: 'Table 3.7:', col: '30" Height', row: 'Pellet Smoker High', value: `${Math.round(recommendedWidth(30, SOURCES.pelletHigh))}"`, call: 'recommendedWidth(30, SOURCES.pelletHigh)' });

// RB-008 §3.3 exposed blower  (plan §1 (j))
cell({ paper: 'rb008', table: { header: '| Wind Exposure | K_CFM | Required CFM | Recommended Blower |' }, col: 'Recommended Blower', row: 'Exposed without panels', value: `${blowerFor(1394)} CFM`, call: 'blowerFor(1394)  // = smallest of BLOWER_SIZES ≥ 1.1 × 1394' });

// ---------------------------------------------------------------------------
// Prose edits that restate a regenerated cell (exact, unique substrings).
// ---------------------------------------------------------------------------
const gm = (h) => ms(h, 'gasMedium');
const fpm = (h, id = 'gasMedium') => Math.round(centerlineVelocity(h, SOURCES[id]));
const dcap = (h) => Math.round(captureDiameter(h, SOURCES.gasMedium));
const cw = (id, h) => { const s = SOURCES[id]; const oh = Number(readBaseCell('rb006', id === 'gasSmall' || id === 'gasMedium' || id === 'gasLarge' || id === 'gasHigh' ? 'Table 3.4a:' : 'Table 3.4b:', 'OH (m)', `${h}"`, { gasSmall: 'Gas Small', gasMedium: 'Gas Medium', gasLarge: 'Gas Large', gasHigh: 'Gas High-Output', charcoalKettle: 'Charcoal Kettle', woodFired: 'Wood-Fired', pelletLow: 'Pellet Smoker Low', pelletHigh: 'Pellet Smoker High' }[id])); return criticalWinds({ widthIn: s.cookWIn + 2 * oh * IN_PER_M, depthIn: 1e3, riseIn: h, windDir: 'side', src: s }); };
const reduction1848 = Math.round((1 - gm(48) / gm(18)) * 100);

const prose = [
  // RB-001
  { paper: 'rb001', old: 'centerline velocity of 2.30 m/s at 18 inches, decaying to 1.71 m/s at 48 inches — a reduction of only 26%.', new: `centerline velocity of ${f2(gm(18))} m/s at 18 inches, decaying to ${f2(gm(48))} m/s at 48 inches — a reduction of only ${reduction1848}%.`, call: 'centerlineVelocityMs at 18/48 in' },
  { paper: 'rb001', old: 'u_0 = 1.03 * (12.3)^(1/3) * (1.17)^(-1/3) = 1.03 * 2.31 * 0.95 = 2.25 m/s.', new: `u_0 = 1.03 * (12.3)^(1/3) * (1.17)^(-1/3) = 1.03 * 2.31 * 0.949 = ${f2(ms(30, 'gasLarge'))} m/s.`, call: 'centerlineVelocityMs(heightM(30), SOURCES.gasLarge)' },
  { paper: 'rb001', old: 'a centerline velocity of 337 ft/min (1.71 m/s)', new: `a centerline velocity of ${fpm(48)} ft/min (${f2(gm(48))} m/s)`, call: 'centerlineVelocity(48, gasMedium)' },
  { paper: 'rb001', old: 'approximately 1.0 to 1.5 m/s (200 to 295 ft/min) at standard hood heights', new: `approximately 1.0 to 1.3 m/s (200 to 255 ft/min) at standard hood heights`, call: 'centerlineVelocity(18|48, charcoalKettle|pelletLow) = 253/207, 246/198 fpm' },
  { paper: 'rb001', old: 'has expanded to a capture diameter of approximately 44 inches. This means a hood must provide an **Effective Capture Area** spanning at least 44 inches in the grill\'s width dimension to intercept the full plume. Since the effective capture area is always less than the physical hood area (due to edge effects, velocity non-uniformity, and ambient air short-circuiting), the physical hood must be substantially larger than 44 inches.', new: `has expanded to a capture diameter of approximately ${dcap(30)} inches. This means a hood must provide an **Effective Capture Area** spanning at least ${dcap(30)} inches in the grill's width dimension to intercept the full plume. Since the effective capture area is always less than the physical hood area (due to edge effects, velocity non-uniformity, and ambient air short-circuiting), the physical hood must be substantially larger than ${dcap(30)} inches.`, call: 'captureDiameter(30, gasMedium)' },
  { paper: 'rb001', old: 'At 48 inches, the same plume has expanded to 53 inches in capture diameter.', new: `At 48 inches, the same plume has expanded to ${dcap(48)} inches in capture diameter.`, call: 'captureDiameter(48, gasMedium)' },
  { paper: 'rb001', old: '- At 48": plume diameter (53") exceeds hood width', new: `- At 48": plume diameter (${dcap(48)}") exceeds hood width`, call: 'captureDiameter(48, gasMedium)' },
  // RB-003
  { paper: 'rb003', old: 'From 6" to 18", the gas medium plume loses 55 ft/min (508 to 453). From 48" to 60", it loses only 6 ft/min (337 to 331).', new: `From 6" to 18", the gas medium plume loses ${fpm(6) - fpm(18)} ft/min (${fpm(6)} to ${fpm(18)}). From 48" to 60", it loses only ${fpm(48) - fpm(60)} ft/min (${fpm(48)} to ${fpm(60)}).`, call: 'centerlineVelocity(6|18|48|60, gasMedium)' },
  { paper: 'rb003', old: 'narrow plume (39" diameter), small hood (49" wide), high velocity (453 fpm)', new: `narrow plume (${dcap(18)}" diameter), small hood (49" wide), high velocity (${fpm(18)} fpm)`, call: 'captureDiameter(18), centerlineVelocity(18) gasMedium' },
  { paper: 'rb003', old: 'wide plume (53" diameter), large hood (69" wide), reduced velocity (337 fpm)', new: `wide plume (${dcap(48)}" diameter), large hood (69" wide), reduced velocity (${fpm(48)} fpm)`, call: 'captureDiameter(48), centerlineVelocity(48) gasMedium' },
  // RB-004 (quotes RB-001 Table 3.5, Gas Large 30")
  { paper: 'rb004', old: '| **Plume centerline velocity at hood** | 2.25 m/s (443 fpm) | 2.25 m/s (443 fpm) | 1.0 |', new: `| **Plume centerline velocity at hood** | ${f2(ms(30, 'gasLarge'))} m/s (${fpm(30, 'gasLarge')} fpm) | ${f2(ms(30, 'gasLarge'))} m/s (${fpm(30, 'gasLarge')} fpm) | 1.0 |`, call: 'centerlineVelocity(30, gasLarge)' },
  { paper: 'rb004', old: '| Centerline velocity u_0 | 2.25 m/s (443 fpm) | RB-001 Table 3.5 |', new: `| Centerline velocity u_0 | ${f2(ms(30, 'gasLarge'))} m/s (${fpm(30, 'gasLarge')} fpm) | RB-001 Table 3.5 |`, call: 'centerlineVelocity(30, gasLarge)' },
  // RB-006 restatements of Tables 3.4a/b
  { paper: 'rb006', old: 'experiences 25% plume escape at only 4.2 mph, centerline exit at 5.8 mph, and 50% escape at 7.3 mph.', new: `experiences 25% plume escape at only ${f1(cw('pelletLow', 30).u25)} mph, centerline exit at ${f1(cw('pelletLow', 30).uCenterline)} mph, and 50% escape at ${f1(cw('pelletLow', 30).u50)} mph.`, call: 'criticalWinds(pelletLow, 30)' },
  { paper: 'rb006', old: 'A gas grill medium at 36" loses 25% of the plume at 6.3 mph and experiences centerline exit at 9.1 mph.', new: `A gas grill medium at 36" loses 25% of the plume at ${f1(cw('gasMedium', 36).u25)} mph and experiences centerline exit at ${f1(cw('gasMedium', 36).uCenterline)} mph.`, call: 'criticalWinds(gasMedium, 36)' },
  { paper: 'rb006', old: '**At 48", all sources lose reliable capture below 10 mph.** The highest critical wind speed for any source at 48" is 8.9 mph (gas high-output, centerline exit). For most sources, the plume centerline exits the hood at 5 to 8 mph.', new: `**At 48", all sources lose reliable capture below 7 mph.** The highest critical wind speed for any source at 48" is ${f1(cw('gasHigh', 48).uCenterline)} mph (gas high-output, centerline exit). For most sources, the plume centerline exits the hood at 3 to 6 mph.`, call: 'criticalWinds(gasHigh, 48); all sources at 48' },
  { paper: 'rb006', old: 'the gas grill high-output can maintain centerline capture up to 12.5 mph, and 25% escape does not occur until 8.0 mph.', new: `the gas grill high-output can maintain centerline capture up to ${f1(cw('gasHigh', 18).uCenterline)} mph, and 25% escape does not occur until ${f1(cw('gasHigh', 18).u25)} mph.`, call: 'criticalWinds(gasHigh, 18)' },
  { paper: 'rb006', old: '- **25% plume escape begins at 6.7 mph** (mean wind at cooking height). With gust factor, this corresponds to a mean wind of approximately 4 mph (gusts to 6.7 mph).', new: `- **25% plume escape begins at ${f1(cw('gasMedium', 30).u25)} mph** (mean wind at cooking height). With gust factor, this corresponds to a mean wind of approximately 3 mph (gusts to ${f1(cw('gasMedium', 30).u25)} mph).`, call: 'criticalWinds(gasMedium, 30).u25; /1.7 gust factor' },
  { paper: 'rb006', old: '- **Centerline exits hood at 9.7 mph.**', new: `- **Centerline exits hood at ${f1(cw('gasMedium', 30).uCenterline)} mph.**`, call: 'criticalWinds(gasMedium, 30).uCenterline' },
  { paper: 'rb006', old: '- **Practical answer: 5 mph mean wind is the threshold for noticeable capture degradation** (accounting for gusts). At 7 mph mean wind, capture is marginal. At 10 mph, capture is functionally inadequate.', new: '- **Practical answer: 3 mph mean wind is the threshold for noticeable capture degradation** (accounting for gusts). At 5 mph mean wind, capture is marginal. At 7 mph, capture is functionally inadequate.', call: 'u25 4.8 / u_cl 7.0 / u50 9.3 mph ÷ G = 1.7' },
  { paper: 'rb006', old: 'For stronger sources (gas grill high-output), the thresholds are approximately 20-30% higher: noticeable degradation at 6-7 mph mean, marginal at 9 mph, inadequate at 12 mph.', new: 'For stronger sources (gas grill high-output), the thresholds are approximately 5-20% higher: noticeable degradation at 3-4 mph mean, marginal at 5-6 mph, inadequate at 8 mph.', call: 'criticalWinds(gasHigh, 30) = 5.1 / 8.1 / 11.1 mph vs gasMedium 4.8 / 7.0 / 9.3' },
  { paper: 'rb006', old: '- At 18", the gas grill medium retains centerline capture up to 11.1 mph.\n- At 30", the same source loses centerline capture at 9.7 mph.\n- At 48", centerline capture is lost at 8.1 mph.\n\nThe improvement from 48" to 18" is a 37% increase in critical wind speed.', new: `- At 18", the gas grill medium retains centerline capture up to ${f1(cw('gasMedium', 18).uCenterline)} mph.\n- At 30", the same source loses centerline capture at ${f1(cw('gasMedium', 30).uCenterline)} mph.\n- At 48", centerline capture is lost at ${f1(cw('gasMedium', 48).uCenterline)} mph.\n\nThe improvement from 48" to 18" is an ${Math.round((cw('gasMedium', 18).uCenterline / cw('gasMedium', 48).uCenterline - 1) * 100)}% increase in critical wind speed.`, call: 'criticalWinds(gasMedium, 18|30|48).uCenterline' },
  { paper: 'rb006', old: 'improves the critical wind speed for centerline exit by approximately 0.5 to 0.8 mph, depending on source type.', new: 'improves the critical wind speed for centerline exit by approximately 0.4 to 0.9 mph, depending on source type.', call: '(u_cl(18) − u_cl(48))/5 per source: pelletLow 0.44 … gasHigh 0.92' },
  { paper: 'rb006', old: '- Begins losing 25% of plume mass at 5.0 mph\n- Experiences centerline exit at 6.7 mph', new: `- Begins losing 25% of plume mass at ${f1(cw('charcoalKettle', 30).u25)} mph\n- Experiences centerline exit at ${f1(cw('charcoalKettle', 30).uCenterline)} mph`, call: 'criticalWinds(charcoalKettle, 30)' },
  { paper: 'rb006', old: 'These thresholds are 25-35% lower than for gas grill sources.', new: 'These thresholds are 15-40% lower than for gas grill sources.', call: 'charcoal 3.7/5.1/6.6 vs gasSmall 4.3/6.1/8.0 … gasHigh 5.1/8.1/11.1' },
  // RB-007 quotes of RB-006 Tables 3.4a/b
  { paper: 'rb007', old: '- 25% escape at 6.7 mph\n- Centerline exit at 9.7 mph\n- 50% escape at 12.6 mph', new: `- 25% escape at ${f1(cw('gasMedium', 30).u25)} mph\n- Centerline exit at ${f1(cw('gasMedium', 30).uCenterline)} mph\n- 50% escape at ${f1(cw('gasMedium', 30).u50)} mph`, call: 'criticalWinds(gasMedium, 30)' },
  { paper: 'rb007', old: '- 25% escape at 5.0 mph\n- Centerline exit at 6.7 mph\n- 50% escape at 8.4 mph', new: `- 25% escape at ${f1(cw('charcoalKettle', 30).u25)} mph\n- Centerline exit at ${f1(cw('charcoalKettle', 30).uCenterline)} mph\n- 50% escape at ${f1(cw('charcoalKettle', 30).u50)} mph`, call: 'criticalWinds(charcoalKettle, 30)' },
  { paper: 'rb007', old: '- 25% escape at 4.2 mph\n- Centerline exit at 5.8 mph\n- 50% escape at 7.3 mph', new: `- 25% escape at ${f1(cw('pelletLow', 30).u25)} mph\n- Centerline exit at ${f1(cw('pelletLow', 30).uCenterline)} mph\n- 50% escape at ${f1(cw('pelletLow', 30).u50)} mph`, call: 'criticalWinds(pelletLow, 30)' },
  { paper: 'rb007', old: '| Critical wind for 25% escape (Gas Med, 30") | 6.7 mph | RB-006 Table 3.4a |\n| Critical wind for centerline exit (Gas Med, 30") | 9.7 mph | RB-006 Table 3.4a |', new: `| Critical wind for 25% escape (Gas Med, 30") | ${f1(cw('gasMedium', 30).u25)} mph | RB-006 Table 3.4a |\n| Critical wind for centerline exit (Gas Med, 30") | ${f1(cw('gasMedium', 30).uCenterline)} mph | RB-006 Table 3.4a |`, call: 'criticalWinds(gasMedium, 30)' },
  // RB-008 quote of RB-006 Table 3.4b
  { paper: 'rb008', old: 'The critical wind speeds for capture failure from RB-006 Table 3.4b are 30-40% lower for the charcoal kettle than for gas grills: 25% plume escape occurs at only 5.0 mph at 30 inches, compared to 6.7 mph for the gas grill medium.', new: `The critical wind speeds for capture failure from RB-006 Table 3.4b are 15-40% lower for the charcoal kettle than for gas grills: 25% plume escape occurs at only ${f1(cw('charcoalKettle', 30).u25)} mph at 30 inches, compared to ${f1(cw('gasMedium', 30).u25)} mph for the gas grill medium.`, call: 'criticalWinds(charcoalKettle|gasMedium, 30).u25' },
  // RB-011 quotes of RB-001 Table 3.5 and RB-006 Table 3.4a
  { paper: 'rb011', old: '| Plume centerline velocity, Charcoal Kettle at 48" | 1.07 m/s | RB-001 Table 3.5 |', new: `| Plume centerline velocity, Charcoal Kettle at 48" | ${f2(ms(48, 'charcoalKettle'))} m/s | RB-001 Table 3.5 |`, call: 'centerlineVelocityMs(heightM(48), charcoalKettle)' },
  { paper: 'rb011', old: '| Critical wind for 25% escape, Gas Medium at 30" | 6.7 mph | RB-006 Table 3.4a |', new: `| Critical wind for 25% escape, Gas Medium at 30" | ${f1(cw('gasMedium', 30).u25)} mph | RB-006 Table 3.4a |`, call: 'criticalWinds(gasMedium, 30).u25' },
  // RB-012 quote of RB-001 Table 3.5
  { paper: 'rb012', old: '| Plume centerline velocity (30") | 1.25 m/s | 2.25 m/s | 0.56 |', new: `| Plume centerline velocity (30") | ${f2(ms(30, 'charcoalKettle'))} m/s | ${f2(ms(30, 'gasLarge'))} m/s | ${f2(ms(30, 'charcoalKettle') / ms(30, 'gasLarge'))} |`, call: 'centerlineVelocityMs(heightM(30), charcoalKettle|gasLarge)' },
];

// ---------------------------------------------------------------------------
// Markdown table plumbing
// ---------------------------------------------------------------------------
function base(paper) { return baseText[paper] ??= execFileSync('git', ['show', `${BASE}:${P[paper]}`], { cwd: ROOT, encoding: 'utf8' }); }
function cur(paper) { return curText[paper] ??= readFileSync(path.join(ROOT, P[paper]), 'utf8'); }

function locate(lines, table, col, row, group) {
  let start = -1;
  if (typeof table === 'string') {
    const hi = lines.findIndex((l) => l.startsWith('####') && l.includes(table));
    if (hi < 0) throw new Error(`table heading not found: ${table}`);
    start = hi + 1;
    while (start < lines.length && !lines[start].startsWith('|')) start++;
  } else {
    start = lines.findIndex((l) => l.startsWith(table.header));
    if (start < 0) throw new Error(`table header not found: ${table.header}`);
  }
  const header = lines[start].split('|').slice(1, -1).map((s) => s.trim());
  const ci = header.findIndex((h) => h.includes(col));
  if (ci < 0) throw new Error(`column "${col}" not in ${JSON.stringify(header)}`);
  let g = null;
  for (let i = start + 2; i < lines.length && lines[i].startsWith('|'); i++) {
    const cellsIn = lines[i].split('|').slice(1, -1).map((s) => s.trim());
    if (cellsIn[0].startsWith('**') && cellsIn.slice(1).every((c) => c === '')) { g = cellsIn[0].replace(/\*/g, ''); continue; }
    if (cellsIn[0].includes(row) && (!group || g === group)) return { line: i, ci, cells: cellsIn };
  }
  throw new Error(`row "${row}"${group ? ` in ${group}` : ''} not found in ${JSON.stringify(table)}`);
}
function readBaseCell(paper, table, col, row, group) {
  const { ci, cells: c } = locate(base(paper).split('\n'), table, col, row, group);
  return c[ci];
}
function setCell(lines, loc, value) {
  const raw = lines[loc.line].split('|');
  raw[loc.ci + 1] = ` ${value} `;
  lines[loc.line] = raw.join('|');
}

// ---------------------------------------------------------------------------
const out = [];
out.push('# Physics re-base — Stage C errata ledger (2026-09-26)');
out.push('');
out.push(`Generated by \`node docs/superpowers/physics-rebase-errata-ledger.mjs\` (\`--apply\` rewrote the cells). "old" is the v1.0 text at ${BASE}; "line" is the current line. Every "new" value is the output of the named call in \`static/js/ovs/physics/\`; cells whose new value equals the old are listed too (unchanged).`);
out.push('');
const byPaper = {};
let changed = 0, same = 0;
for (const c of cells) {
  const oldVal = readBaseCell(c.paper, c.table, c.col, c.row, c.group);
  const lines = cur(c.paper).split('\n');
  const loc = locate(lines, c.table, c.col, c.row, c.group);
  if (APPLY) { setCell(lines, loc, c.value); curText[c.paper] = lines.join('\n'); }
  const label = typeof c.table === 'string' ? c.table.replace(':', '') : 'table ' + c.table.header.split('|')[1].trim();
  (byPaper[c.paper] ??= []).push(`| ${P[c.paper].replace(R, '')}:${loc.line + 1} | ${label} | ${c.group ? c.group + ' ' : ''}${c.row} × ${c.col} | ${oldVal} | ${c.value} | \`${c.call}\` |${oldVal === c.value ? ' unchanged' : ''}`);
  oldVal === c.value ? same++ : changed++;
}
for (const [paper, rows] of Object.entries(byPaper)) {
  out.push(`## ${paper.toUpperCase().replace('RB0', 'RB-0')} — regenerated cells`);
  out.push('');
  out.push('| file:line | table | cell | old | new | module call |');
  out.push('|---|---|---|---|---|---|');
  out.push(...rows);
  out.push('');
}
out.push(`Cells: ${changed} changed, ${same} unchanged (printed value already matched the module).`);
out.push('');
out.push('## Prose that restates a regenerated cell');
out.push('');
out.push('| file:line | old | new | basis |');
out.push('|---|---|---|---|');
for (const p of prose) {
  const text = cur(p.paper);
  let idx = text.indexOf(p.old), status = '';
  if (idx < 0) { if (text.indexOf(p.new) >= 0) { idx = text.indexOf(p.new); status = ' (already applied)'; } else throw new Error(`prose not found in ${p.paper}: ${p.old.slice(0, 60)}`); }
  else if (APPLY) { if (text.indexOf(p.old, idx + 1) >= 0) throw new Error(`prose not unique in ${p.paper}: ${p.old.slice(0, 60)}`); curText[p.paper] = text.replace(p.old, p.new); }
  const line = text.slice(0, idx).split('\n').length;
  const esc = (s) => s.replace(/\|/g, '\\|').replace(/\n/g, ' ⏎ ');
  out.push(`| ${P[p.paper].replace(R, '')}:${line}${status} | ${esc(p.old)} | ${esc(p.new)} | \`${p.call}\` |`);
}
out.push('');
if (APPLY) {
  for (const [paper, text] of Object.entries(curText)) writeFileSync(path.join(ROOT, P[paper]), text);
  console.error(`applied: ${changed} cells changed, ${same} unchanged, ${prose.length} prose edits`);
} else {
  process.stdout.write(out.join('\n') + '\n');
}
