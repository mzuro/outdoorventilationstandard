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
const { centerlineVelocityMs, centerlineVelocity, captureDiameter, plumeHalfWidthBT, recommendedWidth, IN_PER_M, FPM_PER_MS } = await import(path.join(PHYS, 'plume.mjs'));
const { deflection, froude, FR_DISRUPTED } = await import(path.join(PHYS, 'wind.mjs'));
const { criticalWinds } = await import(path.join(PHYS, 'capture.mjs'));
const { blowerFor, plumeCfm, plumeMassFlowKgS, K_CFM } = await import(path.join(PHYS, 'cfm.mjs'));
const { RHO_PARTICLE, RHO_AIR, MU_AIR } = await import(path.join(PHYS, 'grease.mjs'));

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
  rb009: R + 'rb-009-side-panel-effectiveness.md',
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
// RB-001 Table 3.6 Gas Large and Gas High columns — own z_0 (round 2, B2); identical to RB-002 Tables 3.6c/3.6d W_min
for (const h of H) for (const [id, col] of [['gasLarge', 'Gas Large'], ['gasHigh', 'Gas High']])
  cell({ paper: 'rb001', table: 'Table 3.6:', col, row: `${h}"`, value: mIn(captureDiameter(h, SOURCES[id])), call: `captureDiameter(${h}, SOURCES.${id})` });

// RB-003 Tables 3.1a (m/s) and 3.1b (ft/min), all twelve height rows  (plan §1 (f); round 2 extends the standard-height
// regeneration to the 6–72" rows, whose v1.0 hand-rounding was ±1 fpm off the formula — Table 3.1b is the rb-003 dataset CSV)
for (const h of [6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72]) for (const [id, name] of COLS) {
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
// RB-003 Table 3.2 radial-velocity tables (three height blocks under one heading), Gas Medium (round 2, B3):
//   u(r) = u_0 · exp(−(r/b_u)²), b_u = 1.2 · b_T (rb-003 §2.2); r taken at the exact multiples the row labels state.
{
  const RAD = [['Centerline', 0], ['r = 0.5 * b_u', 0.6], ['r = b_T', 1], ['r = b_u', 1.2], ['r = 1.5 * b_u', 1.8], ['r = 2.0 * b_T', 2]]; // r as multiples of b_T
  for (const h of [24, 30, 48]) {
    const u = ms(h, 'gasMedium'), bT = plumeHalfWidthBT(h, SOURCES.gasMedium) / IN_PER_M, bu = 1.2 * bT;
    const t = { header: '| Radial Position | r (m) | r (in) | u(r) m/s | u(r) fpm | Fraction of u_0 |', after: `**At ${h}" (`, label: `Table 3.2 (${h}")` };
    for (const [row, k] of RAD) {
      const ur = u * Math.exp(-((k * bT / bu) ** 2));
      const call = `u_0(${h}) · exp(−(${k} b_T / 1.2 b_T)²); u_0 = centerlineVelocityMs(heightM(${h}), gasMedium), b_T = plumeHalfWidthBT(${h}, gasMedium)`;
      cell({ paper: 'rb003', table: t, col: 'u(r) m/s', row, value: f2(ur), call });
      cell({ paper: 'rb003', table: t, col: 'u(r) fpm', row, value: String(Math.round(ur * FPM_PER_MS)), call });
    }
  }
}
// RB-003 Tables 3.5, 3.6a/b, 3.8a/b restate the RB-008 mass-flow / required-CFM formulas for the eight modelled
// sources (round 2, A10 consistency): ṁ_p = 0.071 Q_c^(1/3) z^(5/3) + 0.0018 Q_c; CFM = ṁ_p / 1.10 · 2119; × K_CFM.
{
  const H8 = [18, 24, 30, 36, 42, 48, 60, 72];
  const C8 = [['gasSmall', 'Gas Small'], ['gasMedium', 'Gas Med'], ['gasLarge', 'Gas Large'], ['gasHigh', 'Gas High'], ['charcoalKettle', 'Charcoal'], ['woodFired', 'Wood'], ['pelletLow', 'Pellet Low'], ['pelletHigh', 'Pellet High']];
  for (const h of H8) for (const [id, name] of C8) {
    const s = SOURCES[id];
    cell({ paper: 'rb003', table: 'Table 3.5:', col: `${name} kg/s`, row: `${h}"`, value: `${f3(plumeMassFlowKgS(heightM(h), s))} (${Math.round(plumeCfm(h, s))})`, call: `plumeMassFlowKgS(heightM(${h}), SOURCES.${id}); plumeCfm(${h}, SOURCES.${id})` });
    const t36 = ['gasSmall', 'gasMedium', 'gasLarge', 'gasHigh'].includes(id) ? 'Table 3.6a:' : 'Table 3.6b:';
    cell({ paper: 'rb003', table: t36, col: name, row: `${h}"`, value: String(Math.round(plumeCfm(h, s) * K_CFM.sheltered)), call: `round(plumeCfm(${h}, SOURCES.${id}) × K_CFM.sheltered)` });
    if (h <= 48) {
      cell({ paper: 'rb003', table: 'Table 3.8a:', col: `${h}"`, row: name, value: String(Math.round(plumeCfm(h, s) * K_CFM.sheltered)), call: `round(plumeCfm(${h}, SOURCES.${id}) × K_CFM.sheltered)` });
      cell({ paper: 'rb003', table: 'Table 3.8b:', col: `${h}"`, row: name, value: String(Math.round(plumeCfm(h, s) * K_CFM.moderate)), call: `round(plumeCfm(${h}, SOURCES.${id}) × K_CFM.moderate)` });
    }
  }
}

// RB-006 Tables 3.2a–h u_0 column  (plan §1 (f) propagation)
const T32 = { a: 'gasSmall', b: 'gasMedium', c: 'gasLarge', d: 'gasHigh', e: 'charcoalKettle', f: 'woodFired', g: 'pelletLow', h: 'pelletHigh' };
for (const [letter, id] of Object.entries(T32)) for (const h of H)
  cell({ paper: 'rb006', table: `Table 3.2${letter}:`, col: 'u_0 (m/s)', row: `${h}"`, value: f2(ms(h, id)), call: `centerlineVelocityMs(heightM(${h}), SOURCES.${id})` });
// RB-006 Tables 3.2a–h, all five wind columns, on the v1.1 u_0 and the linear formula; Fr > 2.7 marked †
// (plan §1 (k), Stage-A note 2; round 2, A3 extends the 3.2b 10/15 mph regeneration to every table and column)
const WINDS = [2, 5, 8, 10, 15];
for (const [letter, id] of Object.entries(T32)) for (const h of H) for (const w of WINDS) {
  const d = deflection(h, w, SOURCES[id]), fr = froude(h, w, SOURCES[id]);
  cell({ paper: 'rb006', table: `Table 3.2${letter}:`, col: `${w} mph`, row: `${h}"`, value: mIn(d) + (fr > FR_DISRUPTED ? '†' : ''), call: `deflection(${h}, ${w}, SOURCES.${id}); froude() = ${f2(fr)}` });
}
// RB-006 Table 3.3 (four source blocks under one heading): u_0 and Fr = U_w / u_0 on the v1.1 u_0  (round 2, A7).
// The Gas Medium block is the rb-006 dataset CSV (static/data/rb-006-crosswind-froude-number.csv).
const T33 = [['gasMedium', '**Gas Grill Medium (u_0 values'], ['charcoalKettle', '**Charcoal Kettle (Q_c = 1.8 kW):**'], ['gasHigh', '**Gas Grill High-Output (Q_c = 16.4 kW):**'], ['pelletLow', '**Pellet Smoker Low (Q_c = 1.5 kW):**']];
for (const [id, after] of T33) for (const h of H) {
  const t = { header: '| Height | u_0 (m/s) | 2 mph | 5 mph | 8 mph | 10 mph | 15 mph |', after, label: `Table 3.3 (${id})` };
  cell({ paper: 'rb006', table: t, col: 'u_0 (m/s)', row: `${h}"`, value: f2(ms(h, id)), call: `centerlineVelocityMs(heightM(${h}), SOURCES.${id})` });
  for (const w of WINDS) cell({ paper: 'rb006', table: t, col: `${w} mph`, row: `${h}"`, value: f2(froude(h, w, SOURCES[id])), call: `froude(${h}, ${w}, SOURCES.${id})` });
}
// RB-006 §3.9.4 orientation tables, Gas Medium 30": centerline-exit wind for the printed downwind overhang  (round 2, A8)
//   U_cl = OH · u_0(z) / (0.35 · z)  (rb-006:618) — criticalWinds() with widthIn = cooking width + 2·OH.
{
  const ucl = (ohM) => criticalWinds({ widthIn: SOURCES.gasMedium.cookWIn + 2 * ohM * IN_PER_M, depthIn: 1e3, riseIn: 30, windDir: 'side', src: SOURCES.gasMedium }).uCenterline;
  const t1 = { header: '| Wind Direction | Available Downwind OH | Critical Wind Speed (centerline exit) | Improvement |', label: '§3.9.4 orientation (57" x 53")' };
  const t2 = { header: '| Wind Direction | Available Downwind OH | Critical Wind Speed | Improvement vs Worst |', label: '§3.9.4 orientation (66" x 55")' };
  const a = ucl(0.41), b = ucl(0.42), c = ucl(0.305), d = ucl(0.457);
  const pct = (x) => `${x >= 0 ? '+' : ''}${Math.round(x * 100)}%`;
  cell({ paper: 'rb006', table: t1, col: 'Critical Wind Speed', row: 'Along depth', value: `${f1(a)} mph`, call: 'criticalWinds(OH = 0.41 m, 30", gasMedium).uCenterline' });
  cell({ paper: 'rb006', table: t1, col: 'Critical Wind Speed', row: 'Along width', value: `${f1(b)} mph`, call: 'criticalWinds(OH = 0.42 m, 30", gasMedium).uCenterline' });
  cell({ paper: 'rb006', table: t1, col: 'Improvement', row: 'Along width', value: pct(b / a - 1), call: 'U_cl(0.42) / U_cl(0.41) − 1' });
  cell({ paper: 'rb006', table: t1, col: 'Critical Wind Speed', row: '45 degrees', value: `${f1(c)} mph`, call: 'criticalWinds(OH = 0.305 m (12"), 30", gasMedium).uCenterline' });
  cell({ paper: 'rb006', table: t1, col: 'Improvement', row: '45 degrees', value: `${pct(c / a - 1)} (worst)`, call: 'U_cl(0.305) / U_cl(0.41) − 1' });
  cell({ paper: 'rb006', table: t2, col: 'Critical Wind Speed', row: 'Along short dimension', value: `${f1(c)} mph`, call: 'criticalWinds(OH = 0.305 m (12"), 30", gasMedium).uCenterline' });
  cell({ paper: 'rb006', table: t2, col: 'Critical Wind Speed', row: 'Along long dimension', value: `${f1(d)} mph`, call: 'criticalWinds(OH = 0.457 m (18"), 30", gasMedium).uCenterline' });
  cell({ paper: 'rb006', table: t2, col: 'Improvement vs Worst', row: 'Along long dimension', value: pct(d / c - 1), call: 'U_cl(0.457) / U_cl(0.305) − 1' });
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

// RB-002 Table 3.7 Pellet Smoker High @ 30"  (Stage-A note 1; round 2, B1: REVERTED to the v1.0 cell so the row keeps
// the paper's single pellet envelope, evaluated with Pellet Low's z_0 = −0.38 m like the rest of Table 3.7's pellet rows)
{
  const pelletMedium = { qcKw: 3.4, dEffM: 0.45, z0M: -0.32 }; // RB-001 Tables 3.1/3.2 inputs for the per-variant note only
  const perVariant = (src) => [24, 30, 36].map((h) => Math.round(recommendedWidth(h, src))).join('/');
  cell({ paper: 'rb002', table: 'Table 3.7:', col: '30" Height', row: 'Pellet Smoker High', value: readBaseCell('rb002', 'Table 3.7:', '30" Height', 'Pellet Smoker High'), call: `v1.0 cell kept (single pellet envelope on Pellet Low z_0); per-variant W_rec would be ${perVariant(SOURCES.pelletHigh)}" (High), ${perVariant(pelletMedium)}" (Medium) at 24/30/36"` });
}

// RB-006 Table 3.7 (gust design deflection, Gas Medium 30") and §3.9.5 overhang-per-mph table restate Table 3.2 cells
// on the linear formula: regenerated on the v1.1 u_0 (round 2, A3 consequences). Peak = 1.7 × mean wind (G = 1.7).
{
  const GMs = SOURCES.gasMedium;
  for (const U of [2, 3, 5, 7, 10]) {
    const P = Math.round(1.7 * U * 10) / 10, frP = froude(30, P, GMs);
    cell({ paper: 'rb006', table: 'Table 3.7:', col: 'Mean Deflection', row: `${U} mph`, value: `${Math.round(deflection(30, U, GMs))}"`, call: `deflection(30, ${U}, SOURCES.gasMedium)` });
    cell({ paper: 'rb006', table: 'Table 3.7:', col: 'Peak Deflection', row: `${U} mph`, value: `${Math.round(deflection(30, P, GMs))}"` + (frP > FR_DISRUPTED ? '†' : ''), call: `deflection(30, ${P}, SOURCES.gasMedium); froude() = ${f2(frP)}` });
    cell({ paper: 'rb006', table: 'Table 3.7:', col: 'Mean Fr', row: `${U} mph`, value: f2(froude(30, U, GMs)), call: `froude(30, ${U}, SOURCES.gasMedium)` });
    cell({ paper: 'rb006', table: 'Table 3.7:', col: 'Peak Fr', row: `${U} mph`, value: f2(frP), call: `froude(30, ${P}, SOURCES.gasMedium)` });
  }
  const T395 = { header: '| Source / Height | delta_x per mph (inches/mph) | Additional OH needed for 5 mph (in) | Additional OH for 8 mph (in) |', label: '§3.9.5 overhang per mph' };
  for (const [row, id, h] of [['Gas Medium / 24"', 'gasMedium', 24], ['Gas Medium / 30"', 'gasMedium', 30], ['Gas Medium / 36"', 'gasMedium', 36], ['Gas Medium / 48"', 'gasMedium', 48], ['Charcoal / 30"', 'charcoalKettle', 30], ['Pellet Low / 30"', 'pelletLow', 30]]) {
    cell({ paper: 'rb006', table: T395, col: 'delta_x per mph', row, value: f1(deflection(h, 1, SOURCES[id])), call: `deflection(${h}, 1, SOURCES.${id})` });
    cell({ paper: 'rb006', table: T395, col: 'Additional OH needed for 5 mph', row, value: `${Math.round(deflection(h, 5, SOURCES[id]))}"`, call: `deflection(${h}, 5, SOURCES.${id})` });
    cell({ paper: 'rb006', table: T395, col: 'Additional OH for 8 mph', row, value: `${Math.round(deflection(h, 8, SOURCES[id]))}"`, call: `deflection(${h}, 8, SOURCES.${id})` });
  }
}

// RB-002 Table 3.6b 30" overhang: left at the printed whole-inch 17" (round 3); the exact 16.5" is recorded in a
// footnote under the table instead (see the prose list).

// RB-008 sizing tables regenerated in full from the paper's formulas with the same inputs the site's reference-table
// generator uses (round 2, A10 + B8 + B11): Tables 3.1, 3.2a–d, 3.4a/b, 3.5, 3.6, 3.8a–f, 3.11 and the §3.3 table.
//   CFM_plume = plumeCfm(z, src); table = round(CFM_plume × K_CFM); blower = blowerFor(minimum) (1.1× ladder rule).
// The four sources heat.mjs does not carry enter as paper INPUTS (Q_c from rb-008 Table 3.1 = RB-001 Table 3.1).
{
  const RB008 = [
    ['Gas Grill — Small', SOURCES.gasSmall, 'Gas Small', 'SOURCES.gasSmall'], ['Gas Grill — Medium', SOURCES.gasMedium, 'Gas Medium', 'SOURCES.gasMedium'],
    ['Gas Grill — Large', SOURCES.gasLarge, 'Gas Large', 'SOURCES.gasLarge'], ['Gas Grill — High-Output', SOURCES.gasHigh, 'Gas High', 'SOURCES.gasHigh'],
    ['Charcoal Kettle', SOURCES.charcoalKettle, 'Charcoal Kettle', 'SOURCES.charcoalKettle'], ['Charcoal Kettle High', { qcKw: 3.5, btu: 30000 }, 'Charcoal High', '{qcKw: 3.5}'],
    ['Charcoal Kamado', { qcKw: 3.3, btu: 25000 }, 'Charcoal Kamado', '{qcKw: 3.3}'], ['Wood-Fired', SOURCES.woodFired, 'Wood-Fired', 'SOURCES.woodFired'],
    ['Wood-Fired Large', { qcKw: 13.3, btu: 70000 }, 'Wood-Fired Large', '{qcKw: 13.3}'], ['Pellet Smoker — Low', SOURCES.pelletLow, 'Pellet Low', 'SOURCES.pelletLow'],
    ['Pellet Smoker — Medium', { qcKw: 3.4, btu: 18000 }, 'Pellet Medium', '{qcKw: 3.4}'], ['Pellet Smoker — High', SOURCES.pelletHigh, 'Pellet High', 'SOURCES.pelletHigh'],
  ];
  const EXPOSED = new Set(['Gas Grill — Small', 'Gas Grill — Medium', 'Gas Grill — Large', 'Gas Grill — High-Output', 'Charcoal Kettle', 'Wood-Fired', 'Pellet Smoker — Low', 'Pellet Smoker — High']);
  const T32K = { a: 'sheltered', b: 'moderate', c: 'exposed', d: 'exposedPanels' };
  const req = (h, s, k) => Math.round(plumeCfm(h, s) * K_CFM[k]);
  for (const [name, s, short, ref] of RB008) {
    for (const h of H) {
      cell({ paper: 'rb008', table: 'Table 3.1:', col: `${h}"`, row: name, value: String(Math.round(plumeCfm(h, s))), call: `round(plumeCfm(${h}, ${ref}))` });
      for (const [letter, k] of Object.entries(T32K)) {
        if (k.startsWith('exposed') && !EXPOSED.has(name)) continue;
        cell({ paper: 'rb008', table: `Table 3.2${letter}:`, col: `${h}"`, row: name, value: String(req(h, s, k)), call: `round(plumeCfm(${h}, ${ref}) × K_CFM.${k})` });
      }
    }
    // Table 3.4a (rows keyed by Q_c) and 3.4b (CFM per 10,000 BTU) restate the 30" Sheltered column for ten sources
    if (!['Charcoal Kamado', 'Pellet Smoker — Medium'].includes(name)) {
      const qc = new RegExp(`^${String(s.qcKw).replace('.', '\\.')}$`), rowLabel = `Q_c = ${s.qcKw}`; // exact row key — "3.5" must not match inside "13.3"
      if (s !== SOURCES.gasMedium) cell({ paper: 'rb008', table: 'Table 3.4a:', col: 'Ratio', row: qc, rowLabel, value: f2(plumeCfm(30, s) / plumeCfm(30, SOURCES.gasMedium)), call: `plumeCfm(30, ${ref}) / plumeCfm(30, SOURCES.gasMedium)` });
      cell({ paper: 'rb008', table: 'Table 3.4a:', col: 'CFM_plume', row: qc, rowLabel, value: String(Math.round(plumeCfm(30, s))), call: `round(plumeCfm(30, ${ref}))` });
      cell({ paper: 'rb008', table: 'Table 3.4a:', col: 'CFM_required', row: qc, rowLabel, value: String(req(30, s, 'sheltered')), call: `round(plumeCfm(30, ${ref}) × K_CFM.sheltered)` });
      cell({ paper: 'rb008', table: 'Table 3.4b:', col: 'CFM_req', row: name, value: String(req(30, s, 'sheltered')), call: `round(plumeCfm(30, ${ref}) × K_CFM.sheltered)` });
      cell({ paper: 'rb008', table: 'Table 3.4b:', col: 'CFM per 10,000 BTU', row: name, value: String(Math.round(req(30, s, 'sheltered') / (s.btu / 1e4))), call: `CFM_req ${req(30, s, 'sheltered')} / (${s.btu} / 10,000)` });
    }
    // Table 3.11 quick reference at 30": three classes + blower = smallest standard size ≥ 1.1 × Moderate (rb-008:614 rule)
    cell({ paper: 'rb008', table: 'Table 3.11:', col: 'Sheltered', row: short, value: String(req(30, s, 'sheltered')), call: `round(plumeCfm(30, ${ref}) × K_CFM.sheltered)` });
    cell({ paper: 'rb008', table: 'Table 3.11:', col: 'Moderate', row: short, value: String(req(30, s, 'moderate')), call: `round(plumeCfm(30, ${ref}) × K_CFM.moderate)` });
    cell({ paper: 'rb008', table: 'Table 3.11:', col: 'Exposed (panels)', row: short, value: String(req(30, s, 'exposedPanels')), call: `round(plumeCfm(30, ${ref}) × K_CFM.exposedPanels)` });
    cell({ paper: 'rb008', table: 'Table 3.11:', col: 'Blower Recommendation', row: short, value: `${blowerFor(req(30, s, 'moderate'))} CFM`, call: `blowerFor(${req(30, s, 'moderate')})  // smallest of BLOWER_SIZES ≥ 1.1 × Moderate` });
  }
  // Table 3.4a Q_c-keyed rows exist only for the ten sources the paper lists there
  // Tables 3.5 and 3.6 (Gas Medium at 30") restate Tables 3.2a–d
  const gm30 = Object.fromEntries(Object.entries(K_CFM).map(([k]) => [k, req(30, SOURCES.gasMedium, k)]));
  for (const [row, k] of [['Sheltered', 'sheltered'], ['Moderate', 'moderate'], ['Exposed with side panels', 'exposedPanels'], ['Exposed without panels', 'exposed']]) {
    cell({ paper: 'rb008', table: 'Table 3.5:', col: 'Outdoor CFM', row, value: String(gm30[k]), call: `round(plumeCfm(30, SOURCES.gasMedium) × K_CFM.${k})` });
    cell({ paper: 'rb008', table: 'Table 3.5:', col: 'K_outdoor', row, value: f1(gm30[k] / 350), call: `${gm30[k]} / 350` });
  }
  for (const [row, a, b] of [['Sheltered to Moderate', 'sheltered', 'moderate'], ['Moderate to Exposed (panels)', 'moderate', 'exposedPanels'], ['Moderate to Exposed (no panels)', 'moderate', 'exposed'], ['Sheltered to Exposed (panels)', 'sheltered', 'exposedPanels'], ['Sheltered to Exposed (no panels)', 'sheltered', 'exposed']]) {
    cell({ paper: 'rb008', table: 'Table 3.6:', col: 'CFM Change', row, value: `${gm30[a]} to ${gm30[b]}`, call: `Table 3.2 Gas Medium 30" ${a} → ${b}` });
    cell({ paper: 'rb008', table: 'Table 3.6:', col: 'Percentage Increase', row, value: `+${Math.round((gm30[b] / gm30[a] - 1) * 100)}%`, call: `${gm30[b]} / ${gm30[a]} − 1` });
  }
  // Tables 3.8a–f integrated design: the CFM columns
  const T38 = { a: 'gasMedium', b: 'gasLarge', c: 'gasHigh', d: 'charcoalKettle', e: 'woodFired' };
  for (const [letter, id] of Object.entries(T38)) for (const h of H) for (const [col, k] of [['Sheltered CFM', 'sheltered'], ['Moderate CFM', 'moderate'], ['Exposed+Panels CFM', 'exposedPanels']])
    cell({ paper: 'rb008', table: `Table 3.8${letter}:`, col, row: `${h}"`, value: String(req(h, SOURCES[id], k)), call: `round(plumeCfm(${h}, SOURCES.${id}) × K_CFM.${k})` });
  for (const h of H) for (const [col, k] of [['Sheltered CFM (Low/High)', 'sheltered'], ['Moderate CFM (Low/High)', 'moderate']])
    cell({ paper: 'rb008', table: 'Table 3.8f:', col, row: `${h}"`, value: `${req(h, SOURCES.pelletLow, k)} / ${req(h, SOURCES.pelletHigh, k)}`, call: `round(plumeCfm(${h}, SOURCES.pelletLow|pelletHigh) × K_CFM.${k})` });
  // §3.3 primary answer (Gas Large 30"): required CFM and blower per class  (plan §1 (j) extended)
  const T33H = { header: '| Wind Exposure | K_CFM | Required CFM | Recommended Blower |' };
  for (const [row, k] of [['Sheltered', 'sheltered'], ['Moderate', 'moderate'], ['Exposed with panels', 'exposedPanels'], ['Exposed without panels', 'exposed']]) {
    const v = req(30, SOURCES.gasLarge, k);
    cell({ paper: 'rb008', table: T33H, col: 'Required CFM', row, value: String(v), call: `round(plumeCfm(30, SOURCES.gasLarge) × K_CFM.${k})` });
    cell({ paper: 'rb008', table: T33H, col: 'Recommended Blower', row, value: `${blowerFor(v)} CFM`, call: `blowerFor(${v})  // = smallest of BLOWER_SIZES ≥ 1.1 × ${v}` });
  }
}

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
  ...roundTwoProse(),
];

// ---------------------------------------------------------------------------
// Round 2 (2026-09-29) prose: restatements of the cells regenerated above, plus the RB-011 worked calculation
// and the RB-006 §3.1 Froude-correction statement. Range sentences are asserted against the module values.
// ---------------------------------------------------------------------------
function roundTwoProse() {
  const GM = SOURCES.gasMedium;
  const dcapM = (h, id = 'gasMedium') => (captureDiameter(h, SOURCES[id]) / IN_PER_M).toFixed(2);
  const dcapIn = (h, id = 'gasMedium') => Math.round(captureDiameter(h, SOURCES[id]));
  const fpm30 = COLS.map(([id]) => fpm(30, id));
  const doubling = Math.round((1 - 2 ** (-1 / 3)) * 100);
  const assert = (ok, msg) => { if (!ok) throw new Error(`round-2 prose assertion failed: ${msg}`); };
  // RB-006 §3.9.4 (same calls as the cells)
  const ucl = (ohM) => criticalWinds({ widthIn: GM.cookWIn + 2 * ohM * IN_PER_M, depthIn: 1e3, riseIn: 30, windDir: 'side', src: GM }).uCenterline;
  const sq = Math.round((ucl(0.42) / ucl(0.41) - 1) * 100), rect = Math.round((ucl(0.457) / ucl(0.305) - 1) * 100);
  assert(rect === 50, `66x55 orientation gain ${rect}%`);
  // RB-006 §3.11 weaker sources vs Gas Medium at 30" (Tables 3.4a/b), gust factor G = 1.7
  const g = cw('gasMedium', 30), weak = [cw('charcoalKettle', 30), cw('pelletLow', 30)];
  const lower = weak.flatMap((w) => ['u25', 'uCenterline', 'u50'].map((k) => (1 - w[k] / g[k]) * 100));
  const lo5 = Math.round(Math.min(...lower) / 5) * 5, hi5 = Math.round(Math.max(...lower) / 5) * 5;
  const G = 1.7, band = (k) => weak.map((w) => w[k] / G);
  assert(lo5 === 25 && hi5 === 45, `weaker-source offsets ${lo5}-${hi5}%`);
  assert(Math.min(...band('u25')) >= 1.45 && Math.max(...band('u25')) < 2.25, `degradation band ${band('u25')}`);
  assert(Math.min(...band('uCenterline')) >= 2.2 && Math.max(...band('uCenterline')) <= 3.05, `marginal band ${band('uCenterline')}`);
  assert(Math.min(...band('u50')) >= 2.95 && Math.max(...band('u50')) < 4.0, `inadequate band ${band('u50')}`);
  // RB-008 §3.3 (Gas Large 30") and Table 3.6 key finding (Gas Medium 30")
  const req = (s, k) => Math.round(plumeCfm(30, s) * K_CFM[k]);
  const margin = (v) => Math.round((blowerFor(v) / v - 1) * 100);
  const gl = Object.fromEntries(Object.keys(K_CFM).map((k) => [k, req(SOURCES.gasLarge, k)]));
  const gmod = req(GM, 'moderate'), gpan = req(GM, 'exposedPanels');
  assert(blowerFor(gl.exposed) === 1800 && 1.1 * gl.exposed > 1500, 'exposed blower ladder');
  // RB-011 §2.3 critical diameter: v_s = k · d_p² (d_p in µm), k from the paper's Stokes constants
  const kStokes = (RHO_PARTICLE - RHO_AIR) * 9.81 * 1e-12 / (18 * MU_AIR);
  const dCrit = Math.sqrt(0.01 * 1.0 / kStokes);
  assert(Math.abs(kStokes - 2.71e-5) < 0.01e-5 && Math.round(dCrit) === 19, `d_p_crit ${dCrit} µm, k ${kStokes}`);
  const vsRatio = (dp) => kStokes * dp * dp / 1.0; // against the paragraph's own u_0 ≈ 1.0 m/s (weakest plume, 48")
  assert(Math.abs(vsRatio(50) - 0.07) < 0.005 && Math.abs(vsRatio(100) - 0.27) < 0.005, `v_s/u_0 ${vsRatio(50)} ${vsRatio(100)}`);
  const perSixAll = ['gasSmall', 'gasMedium', 'gasLarge', 'gasHigh', 'charcoalKettle', 'woodFired', 'pelletLow', 'pelletHigh'].map((id) => (cw(id, 18).uCenterline - cw(id, 48).uCenterline) / 5);
  const perSix = { min: f1(Math.min(...perSixAll)), max: f1(Math.max(...perSixAll)) };
  const dcapAll = ['gasSmall', 'gasMedium', 'gasLarge', 'gasHigh', 'charcoalKettle', 'woodFired', 'pelletLow'].flatMap((id) => H.map((h) => Math.round(captureDiameter(h, SOURCES[id]))));
  const perMphAll = [[24, 'gasMedium'], [30, 'gasMedium'], [36, 'gasMedium'], [48, 'gasMedium'], [30, 'charcoalKettle'], [30, 'pelletLow']].map(([h, id]) => deflection(h, 1, SOURCES[id]));
  const perMph = { min: f1(Math.min(...perMphAll)), max: f1(Math.max(...perMphAll)) };
  const rng = (h) => { const v = COLS.map(([id]) => ms(h, id)); return [Math.min(...v).toFixed(1), Math.max(...v).toFixed(1)]; };
  const fpmRange = () => `${Math.round(Math.min(...COLS.map(([id]) => fpm(48, id))) / 5) * 5}-${Math.round(Math.max(...COLS.map(([id]) => fpm(18, id))) / 5) * 5} ft/min`;
  const foot = "† Fr = U_w / u_0 > 2.7 at this condition (Section 3.3): disrupted regime (Table 3.8). The linear formula's deflection is shown for completeness only and is not a design value.";
  return [
    // RB-001
    { paper: 'rb001', old: '- **Centerline velocity** drops as (z - z_0)^(-1/3) — reducing by approximately 26% when height doubles', new: `- **Centerline velocity** drops as (z - z_0)^(-1/3) — reducing by approximately ${doubling}% when height doubles`, call: '1 − 2^(−1/3)' },
    { paper: 'rb001', old: 'expanding linearly from D_eff = 0.51 m at z = 0 to d_capture = 1.35 m at z = 1.22 m (48 inches)', new: `expanding linearly from D_eff = 0.51 m at z = 0 to d_capture = ${dcapM(48)} m at z = 1.22 m (48 inches)`, call: 'captureDiameter(48, gasMedium)' },
    { paper: 'rb001', old: '- At 24": plume diameter (42") fits within hood (48") with margin', new: `- At 24": plume diameter (${dcapIn(24)}") fits within hood (48") with margin`, call: 'captureDiameter(24, gasMedium)' },
    { paper: 'rb001', old: '- At 36": plume diameter (47") approaches hood width', new: `- At 36": plume diameter (${dcapIn(36)}") approaches hood width`, call: 'captureDiameter(36, gasMedium)' },
    { paper: 'rb001', old: 'For large gas grills and high-output sources, the plume at 36 inches already exceeds 50 inches in diameter.', new: `For large gas grills and high-output sources, the plume at 36 inches already approaches or exceeds 50 inches in diameter (${dcapIn(36, 'gasLarge')} and ${dcapIn(36, 'gasHigh')} inches).`, call: 'captureDiameter(36, gasLarge|gasHigh)' },
    // RB-002 Table 3.6b footnote (overhang rounding convention)
    { paper: 'rb002', old: '#### Table 3.6c:', new: 'Overhang is (W_rec − cooking-surface width)/2 rounded to the whole inch; the exact 30" Gas Medium value is 16.5" (0.42 m), which RB-006 Section 3.4 and the site\'s instruments use.\n\n#### Table 3.6c:', call: 'footnote (rounds 2-3)' },
    // RB-003
    { paper: 'rb003', old: '**At 24" (0.61 m) mounting height:** z - z_0 = 0.98 m; b_u = 0.141 m; u_0 = 2.12 m/s (417 fpm)', new: `**At 24" (0.61 m) mounting height:** z - z_0 = 0.98 m; b_u = 0.141 m; u_0 = ${f2(gm(24))} m/s (${fpm(24)} fpm)`, call: 'centerlineVelocity(24, gasMedium)' },
    { paper: 'rb003', old: '**At 30" (0.76 m) mounting height:** z - z_0 = 1.13 m; b_u = 0.163 m; u_0 = 1.99 m/s (392 fpm)', new: `**At 30" (0.76 m) mounting height:** z - z_0 = 1.13 m; b_u = 0.163 m; u_0 = ${f2(gm(30))} m/s (${fpm(30)} fpm)`, call: 'centerlineVelocity(30, gasMedium)' },
    { paper: 'rb003', old: '**At 48" (1.22 m) mounting height:** z - z_0 = 1.59 m; b_u = 0.229 m; u_0 = 1.71 m/s (337 fpm)', new: `**At 48" (1.22 m) mounting height:** z - z_0 = 1.59 m; b_u = 0.229 m; u_0 = ${f2(gm(48))} m/s (${fpm(48)} fpm)`, call: 'centerlineVelocity(48, gasMedium)' },
    { paper: 'rb003', old: '- **Centerline velocity decreases by only 26%.**', new: `- **Centerline velocity decreases by only ${reduction1848}%.**`, call: 'centerlineVelocityMs at 18/48 in, gasMedium' },
    { paper: 'rb003', old: '"At 30 inches, all sources maintain 234-481 fpm centerline velocity"', new: `"At 30 inches, all sources maintain ${Math.min(...fpm30)}-${Math.max(...fpm30)} fpm centerline velocity"`, call: 'min/max centerlineVelocity(30, all 8 sources)' },
    { paper: 'rb003', old: '**All sources maintain velocities above 179 ft/min (0.91 m/s) even at 72 inches.** The weakest source (pellet smoker low, Q_c = 1.5 kW) still produces 179 ft/min at 72 inches', new: `**All sources maintain velocities above ${fpm(72, 'pelletLow')} ft/min (${f2(ms(72, 'pelletLow'))} m/s) even at 72 inches.** The weakest source (pellet smoker low, Q_c = 1.5 kW) still produces ${fpm(72, 'pelletLow')} ft/min at 72 inches`, call: 'centerlineVelocity(72, pelletLow)' },
    { paper: 'rb003', old: 'even at 72 inches, no source drops below 179 fpm.', new: `even at 72 inches, no source drops below ${fpm(72, 'pelletLow')} fpm.`, call: 'centerlineVelocity(72, pelletLow)' },
    // RB-004
    { paper: 'rb004', old: 'Outdoor practice requires 15-26 inches per side (RB-002), resulting in hoods that are 30-52 inches wider than the cooking surface.', new: 'Outdoor practice requires 11-26 inches per side (RB-002), resulting in hoods that are 22-52 inches wider than the cooking surface.', call: 'RB-002 Section 4.2 / RB-005 Section 3.2 overhang range (v1.1)' },
    { paper: 'rb004', old: 'the plume self-delivers at 443 fpm centerline velocity', new: `the plume self-delivers at ${fpm(30, 'gasLarge')} fpm centerline velocity`, call: 'centerlineVelocity(30, gasLarge)' },
    // RB-006 §3.1: the Froude correction is an upper-bound estimate, not applied in the tables
    { paper: 'rb006', old: 'At higher Froude numbers (Fr > 1.5), the actual deflection exceeds this linear estimate because the plume velocity degrades further as wind disrupts the buoyant rise. A correction factor of (1 + 0.3 * Fr) is applied for Fr > 1:\n\n> **delta_x(z) = 0.35 * U_w * z / u_0(z) * [1 + 0.3 * max(0, Fr - 1)]**', new: 'At higher Froude numbers (Fr > 1.5), the actual deflection can exceed this linear estimate because the plume velocity degrades further as wind disrupts the buoyant rise. An upper-bound estimate for Fr > 1 is obtained by applying a correction factor of (1 + 0.3 * (Fr - 1)):\n\n> delta_x,upper(z) = 0.35 * U_w * z / u_0(z) * [1 + 0.3 * max(0, Fr - 1)]\n\nThis corrected form is an upper-bound estimate only. It is not applied in Tables 3.2a-h, which use the linear formula throughout; conditions with Fr > 2.7 (Table 3.3) are instead marked as the disrupted regime of Table 3.8, in which no deflection value is a design value.', call: 'editorial (round 2, A2)' },
    { paper: 'rb006', old: 'All values are computed using the calibrated deflection formula from Section 3.1.', new: 'All values are computed using the linear calibrated formula of Section 3.1, delta_x = 0.35 * U_w * z / u_0(z), without the Froude correction; cells marked † lie in the disrupted regime (Fr > 2.7) and are not design values.', call: 'editorial (round 2, A2/A3)' },
    // RB-006 Tables 3.2a–h: one † footnote per table
    { paper: 'rb006', old: '† Fr > 2.7 at this condition (Table 3.3): disrupted regime (Table 3.8). The linear formula\'s deflection is shown for completeness only and is not a design value.', new: foot, call: 'footnote wording unified across Tables 3.2a-h' },
    ...['b', 'd', 'e', 'f', 'g', 'h'].map((next) => ({ paper: 'rb006', old: `#### Table 3.2${next}:`, new: `${foot}\n\n#### Table 3.2${next}:`, call: `† footnote under Table 3.2${String.fromCharCode(next.charCodeAt(0) - 1)}` })),
    { paper: 'rb006', old: '**Key observations from the deflection tables:**', new: `${foot}\n\n**Key observations from the deflection tables:**`, call: '† footnote under Table 3.2h' },
    // RB-006 §3.9.4 prose
    { paper: 'rb006', old: 'For this nearly square hood, the orientation effect is small (4% difference between width-aligned and depth-aligned wind).', new: `For this nearly square hood, the orientation effect is small (${sq}% difference between width-aligned and depth-aligned wind).`, call: 'U_cl(0.42) / U_cl(0.41) − 1' },
    { paper: 'rb006', old: 'this orientation can improve the critical wind speed by 30 to 55%.', new: `this orientation can improve the critical wind speed by 30 to ${rect}%.`, call: 'U_cl(0.457) / U_cl(0.305) − 1 (66" x 55" case)' },
    // RB-006 key observations under Tables 3.2a-h, Table 3.7 footnote, §3.3 and §6 Froude quotes, §3.9.5 key finding
    { paper: 'rb006', old: 'At 30 inches in a 5 mph wind, the charcoal kettle deflects 19 inches (nearly half a hood width)', new: `At 30 inches in a 5 mph wind, the charcoal kettle deflects ${Math.round(deflection(30, 5, SOURCES.charcoalKettle))} inches (nearly half a hood width)`, call: 'deflection(30, 5, charcoalKettle)' },
    { paper: 'rb006', old: 'Even the strongest plume (gas high-output) deflects 20 inches at 30" in a 10 mph wind.', new: `Even the strongest plume (gas high-output) deflects ${Math.round(deflection(30, 10, SOURCES.gasHigh))} inches at 30" in a 10 mph wind.`, call: 'deflection(30, 10, gasHigh)' },
    { paper: 'rb006', old: 'All sources at all heights show deflections exceeding 18 inches. At 48 inches, deflections range from 72 inches (gas high-output) to 187 inches (pellet smoker low).', new: `All sources at all heights show deflections exceeding ${Math.floor(Math.min(...Object.keys(SOURCES).flatMap((id) => H.map((h) => deflection(h, 15, SOURCES[id])))))} inches. At 48 inches, deflections range from ${Math.round(deflection(48, 15, SOURCES.gasHigh))} inches (gas high-output) to ${Math.round(deflection(48, 15, SOURCES.pelletLow))} inches (pellet smoker low).`, call: 'min over Tables 3.2a-h at 15 mph (gasHigh 18"); deflection(48, 15, gasHigh|pelletLow)' },
    { paper: 'rb006', old: 'enters the disrupted regime at 15 mph (Fr = 2.75).', new: `enters the disrupted regime at 15 mph (Fr = ${f2(froude(30, 15, SOURCES.gasHigh))}).`, call: 'froude(30, 15, gasHigh)' },
    { paper: 'rb006', old: '"Fr = U_w / u_0 = 1.13 at 30" — wind-dominated regime"', new: `"Fr = U_w / u_0 = ${f2(froude(30, 5, SOURCES.gasMedium))} at 30" — wind-dominated regime"`, call: 'froude(30, 5, gasMedium)' },
    { paper: 'rb006', old: '**Critical finding:** A site with a mean wind of 5 mph experiences instantaneous peak deflections', new: `${foot}\n\n**Critical finding:** A site with a mean wind of 5 mph experiences instantaneous peak deflections`, call: '† footnote under Table 3.7' },
    { paper: 'rb006', old: 'requires approximately 2.3 to 4.0 inches of additional overhang per mph of wind speed, depending on source strength and mounting height. A 5 mph wind requires 11 to 20 inches of additional overhang', new: (() => { const rows = [[24, 'gasMedium'], [30, 'gasMedium'], [36, 'gasMedium'], [48, 'gasMedium'], [30, 'charcoalKettle'], [30, 'pelletLow']]; const per = rows.map(([h, id]) => deflection(h, 1, SOURCES[id])), five = rows.map(([h, id]) => Math.round(deflection(h, 5, SOURCES[id]))); return `requires approximately ${f1(Math.min(...per))} to ${f1(Math.max(...per))} inches of additional overhang per mph of wind speed, depending on source strength and mounting height. A 5 mph wind requires ${Math.min(...five)} to ${Math.max(...five)} inches of additional overhang`; })(), call: 'min/max of the §3.9.5 table columns' },
    // RB-008 Section 6 figure notes (Gas Medium 30" by exposure class)
    { paper: 'rb008', old: '  - Exposed with panels: 841 CFM (orange)\n  - Exposed without panels: 1169 CFM (red)', new: `  - Exposed with panels: ${gpan} CFM (orange)\n  - Exposed without panels: ${req(GM, 'exposed')} CFM (red)`, call: 'round(plumeCfm(30, gasMedium) × 4.14 | 5.75)' },
    { paper: 'rb008', old: 'CFM specification box showing: 609 (Sheltered), 747 (Moderate), 841 (Exposed + panels)', new: `CFM specification box showing: ${req(GM, 'sheltered')} (Sheltered), ${gmod} (Moderate), ${gpan} (Exposed + panels)`, call: 'round(plumeCfm(30, gasMedium) × K_CFM)' },
    // RB-006 §3.11 weaker sources
    { paper: 'rb006', old: 'For weaker sources (charcoal kettle, pellet smoker low), these thresholds are approximately 30-40% lower: noticeable degradation at 3 mph mean, marginal at 5 mph, inadequate at 7 mph.', new: `For weaker sources (charcoal kettle, pellet smoker low), these thresholds are approximately ${lo5}-${hi5}% lower: noticeable degradation at 1.5-2 mph mean, marginal at 2-3 mph, inadequate at 3-4 mph.`, call: `charcoal ${['u25', 'uCenterline', 'u50'].map((k) => f1(weak[0][k])).join('/')}, pelletLow ${['u25', 'uCenterline', 'u50'].map((k) => f1(weak[1][k])).join('/')} vs gasMedium ${['u25', 'uCenterline', 'u50'].map((k) => f1(g[k])).join('/')} mph → ${lower.map((x) => Math.round(x)).join('/')}% lower; ÷ G = 1.7` },
    // RB-008 §3.3 answer bullets and Table 3.6 key finding
    { paper: 'rb008', old: '- **Sheltered installation:** 727 CFM minimum; specify a 900 CFM blower to provide 24% margin.', new: `- **Sheltered installation:** ${gl.sheltered} CFM minimum; specify a ${blowerFor(gl.sheltered)} CFM blower to provide ${margin(gl.sheltered)}% margin.`, call: 'round(plumeCfm(30, gasLarge) × 3.0); blowerFor()' },
    { paper: 'rb008', old: '- **Moderate wind exposure:** 892 CFM minimum; specify a 1200 CFM blower to provide 35% margin.', new: `- **Moderate wind exposure:** ${gl.moderate} CFM minimum; specify a ${blowerFor(gl.moderate)} CFM blower to provide ${margin(gl.moderate)}% margin.`, call: 'round(plumeCfm(30, gasLarge) × 3.68); blowerFor()' },
    { paper: 'rb008', old: '- **Exposed installation with side panels:** 1003 CFM minimum; specify a 1200 CFM blower to provide 20% margin.', new: `- **Exposed installation with side panels:** ${gl.exposedPanels} CFM minimum; specify a ${blowerFor(gl.exposedPanels)} CFM blower to provide ${margin(gl.exposedPanels)}% margin.`, call: 'round(plumeCfm(30, gasLarge) × 4.14); blowerFor()' },
    { paper: 'rb008', old: '- **Exposed installation without panels:** 1394 CFM minimum; specify an 1800 CFM blower (29% margin; 1.1 x 1394 = 1533 CFM exceeds the 1500 CFM size).', new: `- **Exposed installation without panels:** ${gl.exposed} CFM minimum; specify an ${blowerFor(gl.exposed)} CFM blower (${margin(gl.exposed)}% margin; 1.1 x ${gl.exposed} = ${Math.round(1.1 * gl.exposed)} CFM exceeds the 1500 CFM size).`, call: 'round(plumeCfm(30, gasLarge) × 5.75); blowerFor()' },
    { paper: 'rb008', old: 'If the installation includes side panels, the further step from Moderate to Exposed adds only 13%.', new: `If the installation includes side panels, the further step from Moderate to Exposed adds only ${Math.round((gpan / gmod - 1) * 100)}%.`, call: `${gpan} / ${gmod} − 1 (Gas Medium 30")` },
    // RB-011 §2.3 worked calculation (round 2, A1 — changes a stated conclusion) and the Section 6 figure note
    { paper: 'rb011', old: '> d_p_crit (1% of u_0) = sqrt(0.01 * 1.0 / 0.0271) = sqrt(0.369) = 0.61 mm = 610 micrometers\n\nThis means that all grease aerosol particles below approximately 600 micrometers in diameter — which encompasses the entire aerosol distribution including the coarsest spray droplets — are carried upward by the plume with negligible gravitational separation over the 18- to 48-inch vertical distance to the hood. Gravitational settling does not meaningfully filter any particle size class from the plume during the vertical transport from cooking surface to hood.\n\nThe practical consequence is that the grease aerosol arriving at the **Plume Interception Plane** has essentially the same size distribution as the aerosol generated at the cooking surface. All particle sizes are available for capture by the hood grease filters, or for escape into the **Missed Plume Region** if capture fails.', new: `> d_p_crit (1% of u_0) = sqrt(0.01 * 1.0 / (2.71 x 10^(-5))) = sqrt(${Math.round(0.01 / 2.71e-5)}) = ${Math.round(dCrit)} micrometers\n\nThis means that grease aerosol particles below approximately 20 micrometers in diameter — the ultrafine and accumulation modes and most of the coarse mode, which together carry the large majority of the aerosol mass (Section 2.2) — are carried upward by the plume with negligible gravitational separation over the 18- to 48-inch vertical distance to the hood. The coarse tail behaves differently: for the weakest plume, v_s / u_0 is approximately ${vsRatio(50).toFixed(2)} at 50 micrometers and ${vsRatio(100).toFixed(2)} at 100 micrometers (Table 2.3, Table 3.3a), so the largest spray droplets rise measurably more slowly than the plume gas and are partially depleted — by settling within the plume and by fallout at the plume edge — before reaching hood height. Gravitational settling therefore does not filter the sub-20-micrometer aerosol from the plume during vertical transport, but it does begin to thin the coarsest droplets.\n\nThe practical consequence is that the grease aerosol arriving at the **Plume Interception Plane** has essentially the same size distribution as the aerosol generated at the cooking surface below approximately 20 micrometers, with a coarse tail that is somewhat depleted relative to the source. All particle sizes that reach the hood are available for capture by the hood grease filters, or for escape into the **Missed Plume Region** if capture fails.`, call: `d_p_crit = sqrt(0.01 · u_0 / k), k = (ρ_p − ρ_a) g / (18 μ) = ${kStokes.toExponential(3)} m/s per µm²; v_s/u_0 at 50/100 µm vs the paragraph's u_0 ≈ 1.0 m/s (u_0(48", charcoalKettle) = ${f2(ms(48, 'charcoalKettle'))} m/s)` },
    { paper: 'rb011', old: 'u_0 at 48 inches for charcoal kettle (1.07 m/s) — "Weakest plume at 48 inches".', new: `u_0 at 48 inches for charcoal kettle (${f2(ms(48, 'charcoalKettle'))} m/s) — "Weakest plume at 48 inches".`, call: 'centerlineVelocityMs(heightM(48), charcoalKettle)' },
    { paper: 'rb011', old: '- All settling velocities fall well below both plume velocity references, confirming that no particle size settles out of the plume.', new: '- The settling velocities of the three modal sizes fall two to seven orders of magnitude below both plume velocity references; only the coarse tail above approximately 50 micrometers reaches a few percent to a quarter of the weakest plume velocity (Section 2.3).', call: 'v_s(0.03|0.4|12 µm) / u_0(48", charcoalKettle); v_s/u_0 at 50/100 µm' },
    // Round 3: missed restatements
    { paper: 'rb011', old: 'at standard hood heights ranges from 1.0 to 2.8 m/s (RB-001 Table 3.5).', new: `at standard hood heights ranges from 1.0 to ${(Math.max(...COLS.map(([id]) => ms(18, id)))).toFixed(1)} m/s (RB-001 Table 3.5).`, call: 'max centerlineVelocityMs(heightM(18), all sources) = gasHigh 2.71' },
    { paper: 'rb011', old: 'As established in Section 2.3, gravitational settling does not separate any significant particle size fraction from the plume during this vertical transport, because the plume velocity (1.0 to 2.8 m/s) vastly exceeds the settling velocity of even the coarsest aerosol particles (0.27 m/s for 100-micrometer droplets).', new: `As established in Section 2.3, gravitational settling does not separate the sub-20-micrometer fraction from the plume during this vertical transport, because the plume velocity (1.0 to ${(Math.max(...COLS.map(([id]) => ms(18, id)))).toFixed(1)} m/s) vastly exceeds its settling velocity; the coarsest droplets (v_s / u_0 of approximately ${(kStokes * 1e4 / ms(48, 'charcoalKettle')).toFixed(2)} at 100 micrometers for the weakest plume) are partially depleted.`, call: 'v_s(100 µm) = k·10^4 / u_0(48", charcoalKettle)' },
    { paper: 'rb011', old: 'All settling velocities are orders of magnitude below the Buoyant Cooking Plume velocity at standard hood heights, confirming that all particle sizes are transported to the Plume Interception Plane without gravitational separation."', new: 'The settling velocities of the three modal sizes are orders of magnitude below the Buoyant Cooking Plume velocity at standard hood heights; only the coarse tail above approximately 50 micrometers reaches a few percent to a quarter of the weakest plume velocity."', call: 'v_s/u_0 at 50/100 µm (Section 2.3)' },
    { paper: 'rb006', old: 'peak gusts reach 11.9 mph (Fr = 2.68 at peak)', new: `peak gusts reach 11.9 mph (Fr = ${f2(froude(30, 11.9, SOURCES.gasMedium))} at peak)`, call: 'froude(30, 11.9, gasMedium)' },
    { paper: 'rb006', old: 'Every 6 inches lower improves critical wind speed by 0.5-0.8 mph', new: `Every 6 inches lower improves critical wind speed by ${perSix.min}-${perSix.max} mph`, call: '(u_cl(18) − u_cl(48))/5 per source, Tables 3.4a/b' },
    { paper: 'rb007', old: 'ranging from 31 to 61 inches at standard mounting heights for common cooking sources.', new: `ranging from ${Math.min(...dcapAll)} to ${Math.max(...dcapAll)} inches at standard mounting heights for common cooking sources.`, call: 'min/max captureDiameter over RB-001 Table 3.6 (7 columns × 5 heights)' },
    { paper: 'rb007', old: 'this can improve the critical wind speed by 30 to 55%.', new: `this can improve the critical wind speed by 30 to ${rect}%.`, call: 'RB-006 §3.9.4 66" x 55" case' },
    { paper: 'rb009', old: 'this requires 2.3 to 4.0 inches of additional overhang per mph of wind speed', new: `this requires ${perMph.min} to ${perMph.max} inches of additional overhang per mph of wind speed`, call: 'RB-006 §3.9.5 table min/max' },
    { paper: 'rb006', old: 'Using the plume velocities from RB-001 Table 3.5 (1.0 to 2.8 m/s at 18 inches; 1.0 to 2.1 m/s at 48 inches)', new: `Using the plume velocities from RB-001 Table 3.5 (${rng(18).join(' to ')} m/s at 18 inches; ${rng(48).join(' to ')} m/s at 48 inches)`, call: 'min/max centerlineVelocityMs over all sources at 18 and 48 in' },
    { paper: 'rb007', old: 'ranging from 1.0 to 2.8 m/s (200 to 560 ft/min) at standard mounting heights.', new: `ranging from ${rng(48)[0]} to ${rng(18)[1]} m/s (${Math.round(Math.min(...COLS.map(([id]) => fpm(48, id))) / 5) * 5} to ${Math.round(Math.max(...COLS.map(([id]) => fpm(18, id))) / 5) * 5} ft/min) at standard mounting heights.`, call: 'min/max centerlineVelocity over all sources, 18-48 in (rounded to 5 fpm)' },
    { paper: 'rb006', old: 'At 30 inches: U_w_CVP = 0.5 * 1.0 to 0.5 * 2.4 = 0.5 to 1.2 m/s (1.1 to 2.7 mph)', new: (() => { const v = COLS.map(([id]) => ms(30, id)); const lo = Math.min(...v), hi = Math.max(...v); return `At 30 inches: U_w_CVP = 0.5 * ${lo.toFixed(1)} to 0.5 * ${hi.toFixed(1)} = ${(0.5 * lo).toFixed(1)} to ${(0.5 * hi).toFixed(1)} m/s (${(0.5 * lo / 0.44704).toFixed(1)} to ${(0.5 * hi / 0.44704).toFixed(1)} mph)`; })(), call: '0.5 × min/max centerlineVelocityMs at 30 in (pelletLow 1.13, gasHigh 2.46)' },
    { paper: 'rb003', old: 'plume centerline velocities (200-560 ft/min) far exceed minimum ASHRAE face velocities', new: `plume centerline velocities (${fpmRange()}) far exceed minimum ASHRAE face velocities`, call: 'min/max centerlineVelocity over all sources, 18-48 in (rounded to 5 fpm)' },
    { paper: 'rb003', old: 'centerline velocities of 200-560 ft/min (1.0-2.8 m/s) at typical hood heights.', new: `centerline velocities of ${fpmRange()} (${rng(48)[0]}-${rng(18)[1]} m/s) at typical hood heights.`, call: 'min/max centerlineVelocity / centerlineVelocityMs over all sources, 18-48 in' },
    { paper: 'rb011', old: 'The vertical transport velocity of the plume (1.0 to 2.8 m/s at standard hood heights, per RB-001 Table 3.5)', new: `The vertical transport velocity of the plume (${rng(48)[0]} to ${rng(18)[1]} m/s at standard hood heights, per RB-001 Table 3.5)`, call: 'min/max centerlineVelocityMs over all sources, 18-48 in' },
    { paper: 'rb004', old: "the plume's self-delivered velocity (200-560 fpm centerline) overwhelms", new: `the plume's self-delivered velocity (${fpmRange().replace(' ft/min', '')} fpm centerline) overwhelms`, call: 'min/max centerlineVelocity over all sources, 18-48 in (rounded to 5 fpm)' },
    { paper: 'rb004', old: 'small compared to the plume centerline velocity (200-560 fpm)', new: `small compared to the plume centerline velocity (${fpmRange().replace(' ft/min', '')} fpm)`, call: 'min/max centerlineVelocity over all sources, 18-48 in (rounded to 5 fpm)' },
    { paper: 'rb004', old: 'the plume delivers itself at 200-560 fpm centerline velocity', new: `the plume delivers itself at ${fpmRange().replace(' ft/min', '')} fpm centerline velocity`, call: 'min/max centerlineVelocity over all sources, 18-48 in (rounded to 5 fpm)' },
    // RB-012
    { paper: 'rb012', old: '(392 fpm for the medium gas grill at 30 inches)', new: `(${fpm(30)} fpm for the medium gas grill at 30 inches)`, call: 'centerlineVelocity(30, gasMedium)' },
  ];
}

// ---------------------------------------------------------------------------
// Markdown table plumbing
// ---------------------------------------------------------------------------
function base(paper) { return baseText[paper] ??= execFileSync('git', ['show', `${BASE}:${P[paper]}`], { cwd: ROOT, encoding: 'utf8' }); }
function cur(paper) { return curText[paper] ??= readFileSync(path.join(ROOT, P[paper]), 'utf8'); }

// table: "#### …" heading substring, or {header, after?, label?} — `after` is a substring of a line the header
// row must follow (several blocks under one heading share a header row); row: substring of the first cell, or a
// RegExp tested against it.
function locate(lines, table, col, row, group) {
  let start = -1;
  if (typeof table === 'string') {
    const hi = lines.findIndex((l) => l.startsWith('####') && l.includes(table));
    if (hi < 0) throw new Error(`table heading not found: ${table}`);
    start = hi + 1;
    while (start < lines.length && !lines[start].startsWith('|')) start++;
  } else {
    let from = 0;
    if (table.after) { from = lines.findIndex((l) => l.includes(table.after)); if (from < 0) throw new Error(`anchor not found: ${table.after}`); }
    start = lines.findIndex((l, i) => i >= from && l.startsWith(table.header));
    if (start < 0) throw new Error(`table header not found: ${table.header}`);
  }
  const header = lines[start].split('|').slice(1, -1).map((s) => s.trim());
  let ci = header.findIndex((h) => h === col); // exact first: "CFM Change" must not resolve to "K_CFM Change"
  if (ci < 0) ci = header.findIndex((h) => h.includes(col));
  if (ci < 0) throw new Error(`column "${col}" not in ${JSON.stringify(header)}`);
  const rowMatch = (c) => (row instanceof RegExp ? row.test(c) : c.includes(row));
  let g = null;
  for (let i = start + 2; i < lines.length && lines[i].startsWith('|'); i++) {
    const cellsIn = lines[i].split('|').slice(1, -1).map((s) => s.trim());
    if (cellsIn[0].startsWith('**') && cellsIn.slice(1).every((c) => c === '')) { g = cellsIn[0].replace(/\*/g, ''); continue; }
    if (rowMatch(cellsIn[0]) && (!group || g === group)) return { line: i, ci, cells: cellsIn };
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
  const label = typeof c.table === 'string' ? c.table.replace(':', '') : c.table.label ?? 'table ' + c.table.header.split('|')[1].trim();
  (byPaper[c.paper] ??= []).push(`| ${P[c.paper].replace(R, '')}:${loc.line + 1} | ${label} | ${c.group ? c.group + ' ' : ''}${c.rowLabel ?? c.row} × ${c.col} | ${oldVal} | ${c.value} | \`${c.call}\` |${oldVal === c.value ? ' unchanged' : ''}`);
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
  // "new" present ⇒ already applied (it may contain "old", e.g. a footnote inserted before a heading), so a
  // second --apply is a no-op; otherwise "old" must be present and unique.
  let idx = text.indexOf(p.new), status = '';
  if (idx >= 0) status = ' (already applied)';
  else {
    idx = text.indexOf(p.old);
    if (idx < 0) throw new Error(`prose not found in ${p.paper}: ${p.old.slice(0, 60)}`);
    if (APPLY) { if (text.indexOf(p.old, idx + 1) >= 0) throw new Error(`prose not unique in ${p.paper}: ${p.old.slice(0, 60)}`); curText[p.paper] = text.replace(p.old, p.new); }
  }
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
