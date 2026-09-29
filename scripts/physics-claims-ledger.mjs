#!/usr/bin/env node
// physics-claims-ledger.mjs — the reviewer's checklist for the Stage B content
// re-base. For every numeric claim written by hand on the 9 live question
// pages and 11 tool pages it (1) recomputes the number from
// static/js/ovs/physics/*.mjs, (2) formats it exactly as the page prints it,
// (3) checks that the resulting phrase is present in the page, and (4) writes
// docs/superpowers/physics-rebase-claims-ledger.md with one row per claim:
//   page | claim text | module call | value | citation | status
// A ✗ means the page text and the module disagree (or the phrase moved).
// Rows marked "paper" quote a printed paper cell that no module computes
// (input parameters, rules of thumb); they are listed so the reviewer can
// grep them against the paper, not asserted here.
//
//   node scripts/physics-claims-ledger.mjs          # write the ledger
//   node scripts/physics-claims-ledger.mjs --check  # read-only: exit 1 on any ✗ or if the
//                                                   # committed ledger is out of date
//
// The generated "Reference readings" tables are not re-listed: they are
// produced by scripts/generate-reference-tables.mjs, whose --check mode is
// their verification.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { SOURCES } from '../static/js/ovs/physics/heat.mjs';
import { centerlineVelocity, captureDiameter, recommendedWidth, K_BASE } from '../static/js/ovs/physics/plume.mjs';
import { deflection, froude, FR_DISRUPTED, C_D } from '../static/js/ovs/physics/wind.mjs';
import { panelReduction, effectiveWind, R_PANEL, R_WALL } from '../static/js/ovs/physics/sidepanels.mjs';
import { captureFraction, criticalWinds } from '../static/js/ovs/physics/capture.mjs';
import { requiredCfm, plumeCfm, coverageAdvisory, K_CFM, MOUNT_MULT, BLOWER_SIZES, BLOWER_MARGIN } from '../static/js/ovs/physics/cfm.mjs';
import { stokesSettling, groundContactDistance } from '../static/js/ovs/physics/grease.mjs';
import { MOUNT } from '../static/js/ovs/hood-presets.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');
const OUT = join(ROOT, 'docs/superpowers/physics-rebase-claims-ledger.md');

const GM = SOURCES.gasMedium, GL = SOURCES.gasLarge, GH = SOURCES.gasHigh, GS = SOURCES.gasSmall;
const CK = SOURCES.charcoalKettle, PL = SOURCES.pelletLow, PH = SOURCES.pelletHigh;
const WD = MOUNT.wall.depthIn, ID = MOUNT.island.depthIn;

// ---- formatters
const n = (x) => Math.round(x).toLocaleString('en-US');   // 1,204
const r = (x) => String(Math.round(x));                    // 87
const f1 = (x) => x.toFixed(1);
const f2 = (x) => x.toFixed(2);
const f3 = (x) => x.toFixed(3);
const f4 = (x) => x.toFixed(4);
const pct = (x) => String(Math.round(x * 100));           // capture fraction → "87"

// ---- module shorthands
const cap = (o) => captureFraction({ riseIn: 30, src: GM, ...o });
const isl = (w, u, extra = {}) => cap({ widthIn: w, depthIn: ID, mount: 'island', windMph: u, windDir: 'side', ...extra });
const islRear = (w, u) => cap({ widthIn: w, depthIn: ID, mount: 'island', windMph: u, windDir: 'rear' });
const wallRear = (w, u) => cap({ widthIn: w, depthIn: WD, mount: 'wall', windMph: u, windDir: 'rear' });
const cfmGL = (exposure, panels = 'none', mount = 'wall', riseIn = 30) => requiredCfm({ src: GL, riseIn, mount, exposure, panels });
const cfmMin = (src, riseIn, exposure = 'moderate', mount = 'wall') => requiredCfm({ src, riseIn, mount, exposure }).minimum;

// ---- claims: { page, text (with {0}, {1}…), values: [[fn, fmt, call], …], cite, paper? }
const Q = 'content/questions/', T = 'content/tools/';
const v = (fn, fmt, call) => [fn, fmt, call];
const claims = [];
const claim = (page, text, values, cite) => claims.push({ page, text, values, cite });
const paper = (page, text, cite, note) => claims.push({ page, text, values: [], cite, paper: note });

// ======================================================= what-cfm-do-i-need
{
  const p = Q + 'what-cfm-do-i-need.md';
  claim(p, 'needs at least **{0} CFM**', [v(() => cfmGL('moderate').minimum, n, "requiredCfm({src:gasLarge,riseIn:30,mount:'wall',exposure:'moderate'}).minimum")], 'RB-008 §3.3');
  claim(p, 'and a **{0} CFM blower**', [v(() => cfmGL('moderate').blower, n, '… .blower')], 'RB-008 §3.3, App. A step 8');
  claim(p, 'minimums are {0} CFM sheltered, {1} CFM moderate, {2} CFM exposed with side panels, and {3} CFM exposed without', [
    v(() => cfmGL('sheltered').minimum, n, "requiredCfm(gasLarge, 30, wall, 'sheltered').minimum"),
    v(() => cfmGL('moderate').minimum, n, "… 'moderate'"),
    v(() => cfmGL('exposed', 'both').minimum, n, "… 'exposed', panels 'both' (RB-008 v1.0 printed 1,003; v1.1 prints 1,004)"),
    v(() => cfmGL('exposed').minimum, n, "… 'exposed', panels 'none'"),
  ], 'RB-008 §3.3');
  claim(p, 'with blowers of {0}, {1}, {2} and {3} CFM', [
    v(() => cfmGL('sheltered').blower, n, '.blower sheltered'), v(() => cfmGL('moderate').blower, n, '.blower moderate'),
    v(() => cfmGL('exposed', 'both').blower, n, '.blower exposed+panels'), v(() => cfmGL('exposed').blower, n, '.blower exposed (RB-008 v1.0 printed 1,500; v1.1 prints 1,800 under App. A step 8)'),
  ], 'RB-008 §3.3, App. A step 8');
  claim(p, 'only {0}% above the minimum', [v(() => (1500 / cfmGL('exposed').minimum - 1) * 100, r, '1500 / minimum(exposed) − 1')], 'RB-008 §3.3 (v1.0 erratum j; v1.1 prints 1,800)');
  claim(p, 'needs about **{0} CFM minimum**', [v(() => cfmGL('moderate', 'none', 'island').minimum, n, "requiredCfm(… mount:'island').minimum")], 'RB-008 §3.9');
  claim(p, 'times the {0} island multiplier', [v(() => MOUNT_MULT.island, f2, 'MOUNT_MULT.island')], 'RB-008 §3.9');
  claim(p, 'a peninsula takes {0}, or {1} CFM', [v(() => MOUNT_MULT.peninsula, f2, 'MOUNT_MULT.peninsula'), v(() => cfmGL('moderate', 'none', 'peninsula').minimum, n, "requiredCfm(… mount:'peninsula').minimum")], 'RB-008 §3.9');
  claim(p, 'about {0} CFM of bare plume', [v(() => plumeCfm(30, GL), r, 'plumeCfm(30, gasLarge)')], 'RB-008 Table 3.1');
  claim(p, 'K_CFM = {0}, {1}, {2} or {3}', [v(() => K_CFM.sheltered, f1, 'K_CFM.sheltered'), v(() => K_CFM.moderate, f2, 'K_CFM.moderate'), v(() => K_CFM.exposedPanels, f2, 'K_CFM.exposedPanels'), v(() => K_CFM.exposed, f2, 'K_CFM.exposed')], 'RB-008 §2.2');
  claim(p, 'needs {0} CFM at 24 inches and {1} CFM at 36 inches', [v(() => cfmMin(GL, 24), n, 'requiredCfm(gasLarge, 24, moderate).minimum'), v(() => cfmMin(GL, 36), n, '… 36')], 'RB-008 Table 3.2b');
  claim(p, 'only from {0} to {1} CFM, about {2}%', [v(() => cfmMin(GM, 30), n, 'requiredCfm(gasMedium, 30, moderate).minimum'), v(() => cfmMin(GL, 30), n, 'requiredCfm(gasLarge, 30, moderate).minimum'), v(() => (cfmMin(GL, 30) / cfmMin(GM, 30) - 1) * 100, r, 'ratio − 1')], 'RB-008 Table 3.2b, §2.4');
  claim(p, 'an 80,000 BTU grill needs {0} CFM', [v(() => cfmMin(GH, 30), n, 'requiredCfm(gasHigh, 30, moderate).minimum')], 'RB-008 Table 3.2b');
  claim(p, 'is {0} inches wide (RB-002 Table 3.7)', [v(() => recommendedWidth(30, GL), r, 'recommendedWidth(30, gasLarge)')], 'RB-002 Table 3.7');
  claim(p, 'is {0}% of that', [v(() => coverageAdvisory(48, 30, GL).pctOfRecommended, r, 'coverageAdvisory(48, 30, gasLarge).pctOfRecommended')], 'RB-008 Table 3.10');
  paper(p, 'RB-008 Table 3.10 rates capture at 65–75% at best', 'RB-008 Table 3.10 (42″ row, Gas Medium basis; coverageAdvisory applies the band to Gas Large)', 'printed band');
  paper(p, '1 CFM per 100 BTU gives 600 CFM for this grill', 'RB-008 §2.3', '60,000 / 100');
  paper(p, 'arriving at the hood at 200–535 fpm', 'RB-003 §4.1', 'printed range (v1.1: 200-535 fpm; RB-001 Table 3.5)');
  paper(p, 'can run a face velocity of 29 fpm', 'RB-003 §4.1', 'printed example');
  claim(p, 'multiplier rises to {0} — {1} CFM here', [v(() => K_CFM.exposed, f2, 'K_CFM.exposed'), v(() => cfmGL('exposed').minimum, n, 'minimum exposed')], 'RB-008 §2.2, §3.3');
  claim(p, 'cut the multiplier to {0}, a {1}% reduction, and bring the minimum to {2} CFM', [v(() => K_CFM.exposedPanels, f2, 'K_CFM.exposedPanels'), v(() => (1 - K_CFM.exposedPanels / K_CFM.exposed) * 100, r, '1 − 4.14/5.75'), v(() => cfmGL('exposed', 'both').minimum, n, 'minimum exposed+panels')], 'RB-008 §2.2');
  claim(p, 'description: "A 60,000 BTU grill at a 30-inch wall mount needs {0} CFM minimum in moderate wind and a {1} CFM blower; on an island, {2} CFM', [v(() => cfmGL('moderate').minimum, n, 'minimum'), v(() => cfmGL('moderate').blower, n, 'blower'), v(() => cfmGL('moderate', 'none', 'island').minimum, n, 'island minimum')], 'RB-008 §3.3, §3.9');
}
// ======================================================= mounting-height
{
  const p = Q + 'mounting-height.md';
  claim(p, 'is about **{0} fpm**; at 30 inches, about **{1} fpm**; at 36 inches, about **{2} fpm**', [v(() => centerlineVelocity(24, GM), r, 'centerlineVelocity(24, gasMedium)'), v(() => centerlineVelocity(30, GM), r, '… 30'), v(() => centerlineVelocity(36, GM), r, '… 36')], 'RB-003 Table 3.1a/b, regenerated (paper prints 417/392/370)');
  claim(p, 'keeps about {0} fpm at 72 inches (RB-003 Table 3.1b; v1.0 printed 179)', [v(() => centerlineVelocity(72, PL), r, 'centerlineVelocity(72, pelletLow)')], 'RB-003 §3.1');
  claim(p, 'needs {0} CFM at 24 inches, {1} at 30 and {2} at 36', [v(() => cfmMin(GM, 24), n, 'requiredCfm(gasMedium, 24, moderate).minimum'), v(() => cfmMin(GM, 30), n, '… 30'), v(() => cfmMin(GM, 36), n, '… 36')], 'RB-008 Table 3.2b');
  claim(p, 'from {0} to {1} CFM', [v(() => cfmMin(GM, 18), n, 'requiredCfm(gasMedium, 18, moderate).minimum'), v(() => cfmMin(GM, 48), n, '… 48')], 'RB-008 Table 3.2b, §2.4');
  claim(p, 'about {0} inches at 24 inches, {1} at 30 and {2} at 36', [v(() => captureDiameter(24, GM), f1, 'captureDiameter(24, gasMedium)'), v(() => captureDiameter(30, GM), f1, '… 30'), v(() => captureDiameter(36, GM), f1, '… 36')], 'RB-002 Table 3.3a');
  claim(p, 'grows from about {0} to {1} to {2} inches per side', [v(() => (recommendedWidth(24, GM) - GM.cookWIn) / 2, r, '(recommendedWidth(24) − 24)/2'), v(() => (recommendedWidth(30, GM) - GM.cookWIn) / 2, r, '… 30'), v(() => (recommendedWidth(36, GM) - GM.cookWIn) / 2, r, '… 36')], 'RB-005 §3.1, Table 3.1b');
  claim(p, 'about {0} inches by 24 inches of rise, {1} by 30 and {2} by 36', [v(() => deflection(24, 5, GM), f1, 'deflection(24, 5, gasMedium)'), v(() => deflection(30, 5, GM), f1, '… 30'), v(() => deflection(36, 5, GM), f1, '… 36')], 'RB-006 Table 3.2b (prints 9/12/15)');
  claim(p, 'reads {0}% at 18 inches, {1}% at 24, {2}% at 30 and {3}% at 36', [v(() => isl(48, 5, { riseIn: 18 }), pct, 'captureFraction(48×40 island, side, 5 mph, rise 18)'), v(() => isl(48, 5, { riseIn: 24 }), pct, '… rise 24'), v(() => isl(48, 5, { riseIn: 30 }), pct, '… rise 30'), v(() => isl(48, 5, { riseIn: 36 }), pct, '… rise 36')], 'RB-006 §3.4 model');
  paper(p, 'requirements escalate to 417–1,623 CFM across the source range', 'RB-003 §4.2', 'printed range');
  paper(p, 'RB-003 Table 3.1b v1.0 printed 417, 392 and 370', 'RB-003 Table 3.1b (v1.0 cells; v1.1 prints 412/393/377 = module values)', 'superseded printed cells');
  claim(p, 'description: "Plume velocity falls only from {0} fpm at 24 inches to {1} fpm at 36', [v(() => centerlineVelocity(24, GM), r, 'centerlineVelocity(24)'), v(() => centerlineVelocity(36, GM), r, 'centerlineVelocity(36)')], 'RB-003 Table 3.1b regenerated');
}
// ======================================================= does-wind-affect-my-hood
{
  const p = Q + 'does-wind-affect-my-hood.md';
  claim(p, 'about **{0}% of the plume in still air**, **{1}% at 5 mph**, and roughly **{2}% at 10 mph**', [v(() => isl(48, 0), pct, 'captureFraction(48×40 island, side, 0 mph)'), v(() => isl(48, 5), pct, '… 5 mph'), v(() => isl(48, 10), pct, '… 10 mph')], 'RB-006 §3.4');
  claim(p, 'at {0} times the bare plume flow', [v(() => K_CFM.exposed, f2, 'K_CFM.exposed')], 'RB-008 §3.3');
  claim(p, 'by δ = {0} · U_w · z / u_0(z)', [v(() => C_D, f2, 'C_D')], 'RB-006 §3.1');
  claim(p, 'deflects the centerline about {0} inches (RB-006 Table 3.2b prints 12)', [v(() => deflection(30, 5, GM), f1, 'deflection(30, 5, gasMedium)')], 'RB-006 Table 3.2b');
  claim(p, 'by exactly {0} inches per side', [v(() => (48 - GM.cookWIn) / 2, r, '(48 − cookWIn 24)/2')], 'RB-002 App. A.4');
  claim(p, 'By 10 mph the deflection is {0} inches (RB-006 Table 3.2b prints 23)', [v(() => deflection(30, 10, GM), f1, 'deflection(30, 10, gasMedium) (Table 3.2b v1.1 prints 0.60 m / 23 in; v1.0 printed 0.63 m / 25 in)')], 'RB-006 Table 3.2b');
  claim(p, 'reads {0}% at 18 inches against {1}% at 30', [v(() => isl(48, 5, { riseIn: 18 }), pct, 'captureFraction(… rise 18, 5 mph)'), v(() => isl(48, 5), pct, '… rise 30')], 'model');
  claim(p, 'cut the wind the plume feels by {0}% — it experiences {1}% of the ambient speed', [v(() => panelReduction({ panels: 'both', f: 0.67, dir: 'side' }) * 100, r, "panelReduction({panels:'both', f:0.67, dir:'side'})"), v(() => (1 - panelReduction({ panels: 'both', f: 0.67, dir: 'side' })) * 100, r, '1 − R')], 'RB-009 Table 3.1a');
  claim(p, 'from {0}% to {1}% and the 8 mph reading from {2}% to {3}%', [v(() => isl(48, 5), pct, 'capture 5 mph'), v(() => isl(48, 5, { panels: 'both' }), pct, '… panels both'), v(() => isl(48, 8), pct, 'capture 8 mph'), v(() => isl(48, 8, { panels: 'both' }), pct, '… panels both')], 'RB-009 Table 3.1a + RB-006 §3.4');
  claim(p, 'recommended {0}-inch width for this grill reads {1}% at 5 mph, and {2}% with panels', [v(() => recommendedWidth(30, GM), r, 'recommendedWidth(30, gasMedium)'), v(() => isl(57, 5), pct, 'captureFraction(57 island, side, 5)'), v(() => isl(57, 5, { panels: 'both' }), pct, '… panels both')], 'RB-006 Table 3.10 (prints 70–75 / 88–92)');
  paper(p, 'cuts that wind by 60–80%', 'RB-006 §3.9.2', 'printed range');
  claim(p, 'description: "Yes — modeled capture at a 48-inch island hood falls from {0}% in still air to {1}% at 5 mph and {2}% at 10 mph', [v(() => isl(48, 0), pct, 'capture 0'), v(() => isl(48, 5), pct, 'capture 5'), v(() => isl(48, 10), pct, 'capture 10')], 'RB-006 §3.4 model');
}
// ======================================================= island-vs-wall-hood
{
  const p = Q + 'island-vs-wall-hood.md';
  claim(p, 'gives a 48-inch wall hood about {0}% in calm air and a same-width island hood about {1}%', [v(() => wallRear(48, 0), pct, 'captureFraction(48×36 wall, rear, 0)'), v(() => islRear(48, 0), pct, 'captureFraction(48×40 island, rear, 0)')], 'RB-006 §3.4, §3.9.2 (rear-wind axis)');
  claim(p, 'still holds roughly **{0}%** while the island hood falls to roughly **{1}%**', [v(() => wallRear(48, 8), pct, 'wall rear 8 mph'), v(() => islRear(48, 8), pct, 'island rear 8 mph')], 'RB-006 §3.9.2; RB-005 §3.4.4');
  claim(p, 'both mounts read about {0}% in still air and {1}% at 8 mph', [v(() => isl(48, 0), pct, 'side wind 0'), v(() => isl(48, 8), pct, 'side wind 8')], 'model');
  claim(p, 'applies the {0}% midpoint', [v(() => R_WALL * 100, r, 'R_WALL')], 'RB-006 §3.9.2');
  claim(p, 'only {0} inches of front-to-back overhang', [v(() => (ID - GM.cookDIn) / 2, f1, '(40 − cookDIn 21)/2')], 'RB-002 App. A.4');
  paper(p, 'recommended depth for this grill at 30 inches is 53 inches', 'RB-002 Table 3.6b (D_min)', 'printed cell');
  claim(p, 'reads about {0}% in calm air and {1}% in a 5 mph rear wind in the model, against {2}% and {3}%', [v(() => cap({ widthIn: 57, depthIn: 53, mount: 'island', windMph: 0, windDir: 'rear' }), pct, 'captureFraction(57×53 island, rear, 0)'), v(() => cap({ widthIn: 57, depthIn: 53, mount: 'island', windMph: 5, windDir: 'rear' }), pct, '… 5 mph'), v(() => islRear(48, 0), pct, '48×40 island rear 0'), v(() => islRear(48, 5), pct, '… 5 mph')], 'model');
  claim(p, 'the same 57 × 53 hood reads about {0}% in still air along its side-wind axis', [v(() => isl(57, 0), pct, 'captureFraction(57×40 island, side, 0) — width-only aperture, depth irrelevant on this axis')], 'model (side-wind axis)');
  claim(p, '({0}% reduction at two-thirds depth) but do little against wind from the front or rear ({1}%', [v(() => panelReduction({ panels: 'both', f: 0.67, dir: 'side' }) * 100, r, 'panelReduction side f=0.67'), v(() => panelReduction({ panels: 'both', f: 0.67, dir: 'rear' }) * 100, r, 'panelReduction rear f=0.67')], 'RB-009 Table 3.1a');
  claim(p, 'needs {0} CFM on a wall needs {1} on an island', [v(() => cfmGL('moderate').minimum, n, 'minimum wall'), v(() => cfmGL('moderate', 'none', 'island').minimum, n, 'minimum island')], 'RB-008 §3.9');
  claim(p, 'description: "In an 8 mph wind from behind, a 48-inch wall hood holds {0}% modeled capture; the same hood on an island drops to {1}%', [v(() => wallRear(48, 8), pct, 'wall rear 8'), v(() => islRear(48, 8), pct, 'island rear 8')], 'model');
}
// ======================================================= hood-depth-and-overhang
{
  const p = Q + 'hood-depth-and-overhang.md';
  claim(p, 'is about **{0} inches** at the surface', [v(() => captureDiameter(0, GM), r, 'captureDiameter(0, gasMedium)')], 'RB-002 App. A.3');
  claim(p, 'grown to about **{0} inches**; by 48 inches, about **{1} inches**', [v(() => captureDiameter(30, GM), r, 'captureDiameter(30)'), v(() => captureDiameter(48, GM), r, 'captureDiameter(48)')], 'RB-002 Table 3.3a');
  claim(p, '{0} inches for this grill, which is how RB-002 arrives at its {1}-inch recommended width', [v(() => (recommendedWidth(30, GM) - GM.cookWIn) / 2, r, '(recommendedWidth(30) − 24)/2'), v(() => recommendedWidth(30, GM), r, 'recommendedWidth(30)')], 'RB-002 Table 3.7; RB-005 §3.1');
  claim(p, '{0} inches of overhang beyond the cooking surface at each end; in the capture model it reads about {1}% in still air and {2}% in a 5 mph side wind', [v(() => (54 - GM.cookWIn) / 2, r, '(54 − 24)/2'), v(() => isl(54, 0), pct, 'captureFraction(54×40 island, side, 0)'), v(() => isl(54, 5), pct, '… 5 mph')], 'model');
  claim(p, '{0} inches of centerline deflection at 30 inches', [v(() => deflection(30, 5, GM), f1, 'deflection(30, 5)')], 'RB-006 Table 3.2b');
  claim(p, 'about {0}% for a 42-inch island hood, {1}% at 48 inches, {2}% at 54, {3}% at 60 and {4}% at 72 inches', [v(() => isl(42, 5), pct, 'capture 42 @5'), v(() => isl(48, 5), pct, '48'), v(() => isl(54, 5), pct, '54'), v(() => isl(60, 5), pct, '60'), v(() => isl(72, 5), pct, '72')], 'model');
  claim(p, 'has only {0} inches of overhang each way and reads about {1}% in a 5 mph rear wind', [v(() => (ID - GM.cookDIn) / 2, f1, '(40 − 21)/2'), v(() => islRear(48, 5), pct, 'captureFraction(48×40 island, rear, 5)')], 'model');
  paper(p, '11 to 26 inches per side', 'RB-005 §3.1', 'printed range');
  claim(p, 'description: "The plume over a medium gas grill is {0} inches across at the grate and {1} by a 30-inch mount', [v(() => captureDiameter(0, GM), r, 'captureDiameter(0)'), v(() => captureDiameter(30, GM), r, 'captureDiameter(30)')], 'RB-002 Table 3.3a');
}
// ======================================================= do-side-panels-work
{
  const p = Q + 'do-side-panels-work.md';
  claim(p, 'about **{0}% with no side panels** to about **{1}% with panels on both sides**; at 5 mph, from {2}% to {3}%', [v(() => isl(48, 8), pct, 'capture 8 mph'), v(() => isl(48, 8, { panels: 'both' }), pct, '… panels both'), v(() => isl(48, 5), pct, 'capture 5 mph'), v(() => isl(48, 5, { panels: 'both' }), pct, '… panels both')], 'RB-009 Table 3.1a + RB-006 §3.4');
  claim(p, 'wind-reduction coefficient of {0} against a lateral wind', [v(() => panelReduction({ panels: 'both', f: 0.67, dir: 'side' }), f2, "panelReduction({panels:'both', f:0.67, dir:'side'})")], 'RB-009 Table 3.1a');
  claim(p, '**{0}% of the ambient speed** — {1} mph in an 8 mph breeze', [v(() => (1 - panelReduction({ panels: 'both', f: 0.67, dir: 'side' })) * 100, r, '1 − R'), v(() => effectiveWind(8, { panels: 'both', dir: 'side' }), f1, "effectiveWind(8, {panels:'both', dir:'side'})")], 'RB-009 §3.1');
  claim(p, "centerline's {0}-inch excursion at 8 mph shrinks to about {1} inches", [v(() => deflection(30, 8, GM), f1, 'deflection(30, 8)'), v(() => deflection(30, effectiveWind(8, { panels: 'both', dir: 'side' }), GM), f1, 'deflection(30, 3.2)')], 'RB-006 §3.1');
  claim(p, "hood's {0}-inch overhang", [v(() => (48 - GM.cookWIn) / 2, r, '(48 − 24)/2')], 'RB-002 App. A.4');
  claim(p, 'cut the wind by only about {0}%', [v(() => panelReduction({ panels: 'both', f: 0.67, dir: 'rear' }) * 100, r, 'panelReduction rear f=0.67')], 'RB-009 Table 3.1a');
  claim(p, 'drops from {0} without panels to {1} with them — a {2}% reduction', [v(() => K_CFM.exposed, f2, 'K_CFM.exposed'), v(() => K_CFM.exposedPanels, f2, 'K_CFM.exposedPanels'), v(() => (1 - K_CFM.exposedPanels / K_CFM.exposed) * 100, r, '1 − 4.14/5.75')], 'RB-008 §2.2');
  claim(p, 'means {0} CFM instead of {1}', [v(() => cfmGL('exposed', 'both').minimum, n, 'minimum exposed+panels'), v(() => cfmGL('exposed').minimum, n, 'minimum exposed')], 'RB-008 §3.3');
  claim(p, 'description: "Yes — on a 48-inch island hood in an 8 mph side wind, panels on both sides lift modeled capture from about {0}% to {1}%', [v(() => isl(48, 8), pct, 'capture 8'), v(() => isl(48, 8, { panels: 'both' }), pct, '… both')], 'model');
}
// ======================================================= what-size-hood-for-my-grill
{
  const p = Q + 'what-size-hood-for-my-grill.md';
  claim(p, 'is about **{0} inches** at the grate and widens as it rises: roughly **{1} inches** by a 30-inch mounting height and **{2} inches** by 48 inches', [v(() => captureDiameter(0, GM), r, 'captureDiameter(0)'), v(() => captureDiameter(30, GM), r, 'captureDiameter(30)'), v(() => captureDiameter(48, GM), r, 'captureDiameter(48)')], 'RB-002 Table 3.3a');
  claim(p, 'a base margin of {0} for turbulent intermittency', [v(() => K_BASE, f2, 'K_BASE')], 'RB-002 §3.5');
  claim(p, 'a **{0}-inch** hood at 30 inches over this grill', [v(() => recommendedWidth(30, GM), r, 'recommendedWidth(30, gasMedium)')], 'RB-002 Table 3.7');
  claim(p, '{0} inch of diameter per inch of rise', [v(() => (captureDiameter(48, GM) - captureDiameter(24, GM)) / 24, f2, '(captureDiameter(48) − captureDiameter(24))/24')], 'RB-002 App. A.3');
  claim(p, 'the capture diameter at a 30-inch mount is {0} inches', [v(() => captureDiameter(30, GH), r, 'captureDiameter(30, gasHigh)')], 'RB-002 §3.6 (W_min); RB-005 Table 3.1a');
  claim(p, 'about {0} inches at that height (RB-006 Table 3.2d prints 10)', [v(() => deflection(30, 5, GH), f1, 'deflection(30, 5, gasHigh)')], 'RB-006 Table 3.2d');
  claim(p, 'is {0} inches — about {1} inches of overhang per side', [v(() => recommendedWidth(30, GH), r, 'recommendedWidth(30, gasHigh)'), v(() => (recommendedWidth(30, GH) - GH.cookWIn) / 2, r, '(W_rec − 36)/2')], 'RB-002 Table 3.7');
  claim(p, 'give {0} inches over a small gas grill, {1} over a medium, {2} over a large and {3} over a high-output', [v(() => recommendedWidth(30, GS), r, 'recommendedWidth(30, gasSmall)'), v(() => recommendedWidth(30, GM), r, '… gasMedium'), v(() => recommendedWidth(30, GL), r, '… gasLarge'), v(() => recommendedWidth(30, GH), r, '… gasHigh')], 'RB-002 Table 3.7');
  claim(p, 'is {0}% of the {1}-inch recommendation', [v(() => coverageAdvisory(48, 30, GM).pctOfRecommended, r, 'coverageAdvisory(48, 30, gasMedium).pctOfRecommended'), v(() => recommendedWidth(30, GM), r, 'recommendedWidth(30)')], 'RB-008 Table 3.10');
  claim(p, 'reads about {0}%; in a 5 mph side wind it reads about {1}%, against {2}% for the 57-inch hood and {3}% for a 72-inch one', [v(() => isl(48, 0), pct, 'capture 48 @0'), v(() => isl(48, 5), pct, '48 @5'), v(() => isl(57, 5), pct, '57 @5'), v(() => isl(72, 5), pct, '72 @5')], 'model');
  paper(p, '15–20 inches per side at 30 inches for all source types', 'RB-005 §3.1', 'printed range');
  paper(p, '6 to 12 inches per side (RB-010 Gap S-5)', 'RB-010 Gap S-5', 'printed range');
  claim(p, 'description: "Size to the plume, not the grill: over a medium gas grill at a 30-inch mount the capture diameter is {0} inches and the recommended hood {1}', [v(() => captureDiameter(30, GM), r, 'captureDiameter(30)'), v(() => recommendedWidth(30, GM), r, 'recommendedWidth(30)')], 'RB-002 Table 3.3a, 3.7');
}
// ======================================================= can-i-use-an-indoor-range-hood-outside
{
  const p = Q + 'can-i-use-an-indoor-range-hood-outside.md';
  claim(p, 'reads about {0}% capture in still, indoor-like air, but about {1}% in an 8 mph crosswind', [v(() => isl(48, 0), pct, 'captureFraction(48×40 island, side, 0)'), v(() => isl(48, 8), pct, '… 8 mph')], 'model');
  claim(p, 'needs {0} CFM even sheltered and {1} CFM in moderate exposure', [v(() => cfmGL('sheltered').minimum, n, 'minimum sheltered'), v(() => cfmGL('moderate').minimum, n, 'minimum moderate')], 'RB-008 §3.3');
  paper(p, 'call for 11–26 inches per side', 'RB-005 §3.1', 'printed range');
}
// ======================================================= does-an-outdoor-hood-need-a-duct
{
  const p = Q + 'does-an-outdoor-hood-need-a-duct.md';
  claim(p, 'outdoor exhaust rates of {0}-{1} CFM', [v(() => cfmGL('sheltered').minimum, n, 'minimum sheltered'), v(() => cfmGL('moderate').minimum, n, 'minimum moderate')], 'RB-008 §3.3');
}
// ======================================================= tools
{
  const p = T + 'capture-demonstrator.md';
  claim(p, 'from about {0}% in still air to {1}% at 5 mph and {2}% at 8 mph', [v(() => isl(48, 0), pct, 'side 0'), v(() => isl(48, 5), pct, 'side 5'), v(() => isl(48, 8), pct, 'side 8')], 'RB-006 §3.4 model');
  claim(p, 'the {0} inches of overhang beyond each end', [v(() => (48 - GM.cookWIn) / 2, r, '(48 − 24)/2')], 'RB-002 App. A.4');
  claim(p, 'about {0}% end to end (the side-wind axis, {1} inches beyond each end of the cooking surface)', [v(() => isl(48, 0), pct, 'captureFraction(48×40 island, side, 0)'), v(() => (48 - GM.cookWIn) / 2, r, '(48 − 24)/2')], 'model (side-wind axis)');
  claim(p, 'about {0}% for the wall hood and {1}% for the island — not a two-dimensional capture', [v(() => wallRear(48, 0), pct, 'captureFraction(48×36 wall, rear, 0)'), v(() => islRear(48, 0), pct, 'captureFraction(48×40 island, rear, 0)')], 'model (rear-wind axis)');
  claim(p, 'still holds about {0}% at 8 mph while the island hood — with only {1} inches of front-to-back overhang on each side — has fallen to about {2}%', [v(() => wallRear(48, 8), pct, 'wall rear 8'), v(() => (ID - GM.cookDIn) / 2, f1, '(40 − 21)/2'), v(() => islRear(48, 8), pct, 'island rear 8')], 'RB-006 §3.9.2 model');
  claim(p, 'is {0} inches wide by 53 inches deep', [v(() => recommendedWidth(30, GM), r, 'recommendedWidth(30) (53 in depth = RB-002 Table 3.6b, paper)')], 'RB-002 Tables 3.6b, 3.7');
  claim(p, 'the 48-inch preset is {0}% of that width', [v(() => coverageAdvisory(48, 30, GM).pctOfRecommended, r, 'coverageAdvisory(48,30).pctOfRecommended')], 'RB-008 Table 3.10');
  claim(p, 'about {0}% in still air and {1}% at 5 mph', [v(() => isl(57, 0), pct, 'captureFraction(57 island, side, 0)'), v(() => isl(57, 5), pct, '… 5')], 'RB-006 Table 3.10 (>95 / 70–75)');
  claim(p, 'leaves {0} inches of overhang front and back, the same island hood reads about {1}% in still air', [v(() => (53 - GM.cookDIn) / 2, r, '(53 − 21)/2'), v(() => cap({ widthIn: 57, depthIn: 53, mount: 'island', windMph: 0, windDir: 'rear' }), pct, 'captureFraction(57×53 island, rear, 0)')], 'model (rear-wind axis)');
}
{
  const p = T + 'cfm-calculator.md';
  claim(p, 'needs a minimum of {0} CFM under moderate wind exposure and a {1} CFM blower', [v(() => cfmGL('moderate').minimum, n, 'minimum'), v(() => cfmGL('moderate').blower, n, 'blower')], 'RB-008 §3.3');
  claim(p, 'Sheltered sites need {0} CFM ({1} CFM blower); an exposed site with side panels needs {2} CFM', [v(() => cfmGL('sheltered').minimum, n, 'sheltered min'), v(() => cfmGL('sheltered').blower, n, 'sheltered blower'), v(() => cfmGL('exposed', 'both').minimum, n, 'exposed+panels min (paper 1,003)')], 'RB-008 §3.3');
  claim(p, 'without panels {0} CFM', [v(() => cfmGL('exposed').minimum, n, 'exposed min')], 'RB-008 §3.3');
  claim(p, 'only {0}% above the minimum', [v(() => (1500 / cfmGL('exposed').minimum - 1) * 100, r, '1500/1394 − 1')], 'RB-008 §3.3 (v1.0 erratum j; v1.1 prints 1,800)');
  claim(p, 'v1.1 corrects it to {0} CFM under', [v(() => cfmGL('exposed').blower, n, 'blower exposed')], 'RB-008 App. A step 8');
  claim(p, '{0} becomes {1} CFM, still served by a {2} CFM blower', [v(() => cfmGL('moderate').minimum, n, 'wall min'), v(() => cfmGL('moderate', 'none', 'island').minimum, n, 'island min'), v(() => cfmGL('moderate', 'none', 'island').blower, n, 'island blower')], 'RB-008 §3.9');
  claim(p, 'from {0} CFM at 18 inches to {1} CFM at 48', [v(() => cfmMin(GL, 18), n, 'requiredCfm(gasLarge, 18).minimum'), v(() => cfmMin(GL, 48), n, '… 48')], 'RB-008 Table 3.2b');
  claim(p, 'adds about {0}%', [v(() => (cfmMin(GL, 30) / cfmMin(GM, 30) - 1) * 100, r, '892/747 − 1')], 'RB-008 §2.4');
  claim(p, '{0} sheltered, {1} moderate, {2} exposed with side panels, {3} exposed without', [v(() => K_CFM.sheltered, f1, 'K_CFM'), v(() => K_CFM.moderate, f2, ''), v(() => K_CFM.exposedPanels, f2, ''), v(() => K_CFM.exposed, f2, '')], 'RB-008 §2.2');
  claim(p, 'Wall {0}, peninsula {1}, island {2}', [v(() => MOUNT_MULT.wall, f2, 'MOUNT_MULT'), v(() => MOUNT_MULT.peninsula, f2, ''), v(() => MOUNT_MULT.island, f2, '')], 'RB-008 §3.9');
  claim(p, 'honestly above {0} CFM', [v(() => BLOWER_SIZES[3] / BLOWER_MARGIN, n, 'BLOWER_SIZES[3] / BLOWER_MARGIN')], 'RB-008 §3.11 + App. A step 8');
  claim(p, 'W_rec = {0} × capture diameter', [v(() => K_BASE, f2, 'K_BASE')], 'RB-002 §3.6');
  paper(p, 'delivers itself at 200–535 fpm', 'RB-003 §4.1', 'printed range (v1.1: 200-535 fpm; RB-001 Table 3.5)');
  paper(p, 'face velocity of about 29 fpm', 'RB-003 §4.1', 'printed example');
}
{
  const p = T + 'wind-deflection-trajectory.md';
  claim(p, 'about {0} inches (RB-006 Table 3.2b prints 12)', [v(() => deflection(30, 5, GM), f1, 'deflection(30, 5)')], 'RB-006 Table 3.2b');
  paper(p, 'RB-002 Table 3.6b prints 17, footnoting the exact 16.5', 'RB-002 Table 3.6b v1.1 (30″ OH cell 0.42 / 17″ + footnote; RB-005 Table 3.1b prints 17)', 'printed cell; footnote = (W_rec − 24)/2');
  claim(p, 'about {0} inches (Table 3.2b: 19)', [v(() => deflection(30, 8, GM), f1, 'deflection(30, 8)')], 'RB-006 Table 3.2b');
  claim(p, 'roughly {0}× farther at a 48-inch mounting height than at 30 inches ({1} versus {2} inches at 5 mph)', [v(() => deflection(48, 5, GM) / deflection(30, 5, GM), f1, 'deflection(48,5)/deflection(30,5)'), v(() => deflection(48, 5, GM), f1, 'deflection(48, 5)'), v(() => deflection(30, 5, GM), f1, 'deflection(30, 5)')], 'RB-006 §3.1');
  claim(p, 'the 12 mph deflection ({0} inches) is four times the 3 mph deflection ({1} inches)', [v(() => deflection(30, 12, GM), f1, 'deflection(30, 12)'), v(() => deflection(30, 3, GM), f1, 'deflection(30, 3)')], 'RB-006 §3.1');
  claim(p, 'RB-006 Table 3.4a v1.1 prints {0}, {1} and {2} mph for this row', (() => { const c = () => criticalWinds({ widthIn: 57, depthIn: 53, mount: 'island', riseIn: 30, windDir: 'side', src: GM }); return [v(() => c().u25, f1, 'criticalWinds(57 island).u25'), v(() => c().uCenterline, f1, '… .uCenterline'), v(() => c().u50, f1, '… .u50')]; })(), 'RB-006 Table 3.4a (v1.1, Revision history)');
  claim(p, '({0}, {1} and {2} inches) are the RB-003 benchmark', [v(() => deflection(18, 3, GM), f1, 'deflection(18, 3)'), v(() => deflection(30, 3, GM), f1, 'deflection(30, 3)'), v(() => deflection(48, 3, GM), f1, 'deflection(48, 3)')], 'RB-006 §3.1 (benchmark 4/7/12)');
  claim(p, 'the 25%-escape wind at about {0} mph and centerline exit at about {1} mph', [v(() => criticalWinds({ widthIn: 57, depthIn: 53, mount: 'island', riseIn: 30, windDir: 'side', src: GM }).u25, f1, 'criticalWinds(57 island).u25'), v(() => criticalWinds({ widthIn: 57, depthIn: 53, mount: 'island', riseIn: 30, windDir: 'side', src: GM }).uCenterline, f1, '… .uCenterline')], 'RB-006 §3.4 identities (Table 3.4a v1.0 printed 6.7/9.7; v1.1 prints 4.8/7.0)');
  claim(p, 'Fr > {0} at every standard height by 15 mph', [v(() => FR_DISRUPTED, f1, 'FR_DISRUPTED; min froude(18..48, 15) = ' + froude(18, 15, GM).toFixed(2))], 'RB-006 §3.8, Table 3.8');
}
{
  const p = T + 'plume-width-by-height.md';
  claim(p, 'already about {0} inches at the cooking surface', [v(() => captureDiameter(0, GM), r, 'captureDiameter(0)')], 'RB-002 App. A.3');
  claim(p, 'grows to about {0} inches by a 30-inch mounting height (RB-002 Table 3.3a prints 1.05 m, 41 inches) and {1} inches by 48 inches', [v(() => captureDiameter(30, GM), f1, 'captureDiameter(30)'), v(() => captureDiameter(48, GM), f1, 'captureDiameter(48)')], 'RB-002 Table 3.3a');
  claim(p, 'linear at {0} inch of diameter per inch of rise', [v(() => (captureDiameter(48, GM) - captureDiameter(24, GM)) / 24, f2, '(captureDiameter(48) − captureDiameter(24))/24')], 'RB-002 App. A.3');
  claim(p, 'is {0} × the capture diameter — {1} inches at 30 inches over this grill', [v(() => K_BASE, f2, 'K_BASE'), v(() => recommendedWidth(30, GM), r, 'recommendedWidth(30)')], 'RB-002 §3.6, Table 3.7');
  claim(p, 'about {0} inches per side at that height', [v(() => (recommendedWidth(30, GM) - GM.cookWIn) / 2, r, '(W_rec − 24)/2')], 'RB-005 §3.1');
  claim(p, 'from about {0} inches (small gas grill) to {1} inches (high-output gas grill)', [v(() => captureDiameter(30, GS), r, 'captureDiameter(30, gasSmall)'), v(() => captureDiameter(30, GH), r, 'captureDiameter(30, gasHigh)')], 'RB-002 §3.6 W_min');
  claim(p, 'capture diameter at 30 inches is about {0} inches — wider than the {1} inches over the 24-inch medium gas grill', [v(() => captureDiameter(30, CK), r, 'captureDiameter(30, charcoalKettle)'), v(() => captureDiameter(30, GM), r, 'captureDiameter(30, gasMedium)')], 'RB-002 §4.3');
}
{
  const p = T + 'hood-geometry-comparison.md';
  claim(p, 'holds about {0}% and the island hood about {1}% across the entire lineup', [v(() => wallRear(48, 8), pct, 'wall rear 8 (width-independent)'), v(() => islRear(48, 8), pct, 'island rear 8')], 'RB-006 §3.4 model');
  claim(p, 'The {0}-point gap', [v(() => Math.round(wallRear(48, 8) * 100) - Math.round(islRear(48, 8) * 100), r, 'difference of the printed (rounded) percentages')], 'model');
  claim(p, 'from about {0}% at 42 inches to {1}% at 72 inches', [v(() => isl(42, 8), pct, 'side 8, 42'), v(() => isl(72, 8), pct, 'side 8, 72')], 'model');
  claim(p, 'has grown to {0} inches', [v(() => captureDiameter(30, GM), r, 'captureDiameter(30)')], 'RB-002 Table 3.3a, 3.9');
  claim(p, 'sits {0} inches inside the {1}-inch plume', [v(() => captureDiameter(30, GM) - GM.cookWIn, r, 'd_capture − 24'), v(() => captureDiameter(30, GM), r, 'd_capture')], 'RB-002 Table 3.3a');
  claim(p, 'Minimum geometry ({0}-inch overhang per side)', [v(() => (captureDiameter(30, GM) - GM.cookWIn) / 2, r, '(d_capture − 24)/2')], 'RB-005 Table 3.1a');
  claim(p, 'a 42-inch hood in still air reads about {0}%', [v(() => isl(42, 0), pct, 'captureFraction(42 island, 0)')], 'RB-008 Table 3.10 (65–75)');
  claim(p, 'Recommended outdoor ({0}-inch overhang per side)', [v(() => (recommendedWidth(30, GM) - GM.cookWIn) / 2, r, '(W_rec − 24)/2')], 'RB-005 Table 3.1b');
  claim(p, 'yields a {0}-inch recommended hood width for this source and height, which the model reads at about {1}% in still air', [v(() => recommendedWidth(30, GM), r, 'recommendedWidth(30)'), v(() => isl(57, 0), pct, 'captureFraction(57 island, 0)')], 'RB-002 Table 3.7; RB-008 Table 3.10 (>95)');
}
{
  const p = T + 'velocity-decay-curves.md';
  claim(p, 'from about {0} fpm at 6 inches to {1} fpm by a 30-inch mounting height and {2} fpm by 48 inches', [v(() => centerlineVelocity(6, GM), r, 'centerlineVelocity(6)'), v(() => centerlineVelocity(30, GM), r, '… 30'), v(() => centerlineVelocity(48, GM), r, '… 48')], 'RB-003 Table 3.1b');
  claim(p, 'inputs — {0}/{1}/{2}/{3}/{4} fpm', [v(() => centerlineVelocity(18, GM), r, 'centerlineVelocity(18)'), v(() => centerlineVelocity(24, GM), r, '24'), v(() => centerlineVelocity(30, GM), r, '30'), v(() => centerlineVelocity(36, GM), r, '36'), v(() => centerlineVelocity(48, GM), r, '48')], 'RB-003 Table 3.1b regenerated (prints 453/417/392/370/337)');
  claim(p, 'centerline velocity ({0} fpm) is three times the 100 fpm', [v(() => centerlineVelocity(72, GM), r, 'centerlineVelocity(72)')], 'RB-003 §3.1');
  claim(p, '({0} to {1} fpm, a {2}% drop)', [v(() => centerlineVelocity(24, GM), r, 'centerlineVelocity(24)'), v(() => centerlineVelocity(48, GM), r, 'centerlineVelocity(48)'), v(() => (1 - centerlineVelocity(48, GM) / centerlineVelocity(24, GM)) * 100, r, '1 − u(48)/u(24)')], 'RB-003 Table 3.1b');
  claim(p, 'from {0} to {1} CFM for this source under moderate exposure', [v(() => cfmMin(GM, 24), n, 'requiredCfm(gasMedium, 24).minimum'), v(() => cfmMin(GM, 48), n, '… 48')], 'RB-008 Table 3.2b');
  claim(p, 'holds about {0} fpm at 30 inches and still about {1} fpm at 72 inches (RB-003 Table 3.1b; v1.0 printed 179)', [v(() => centerlineVelocity(30, PL), r, 'centerlineVelocity(30, pelletLow)'), v(() => centerlineVelocity(72, PL), r, '… 72')], 'RB-003 Table 3.1b');
  claim(p, 'from about {0} fpm (pellet smoker, low) to {1} fpm (high-output gas grill)', [v(() => centerlineVelocity(30, PL), r, 'centerlineVelocity(30, pelletLow)'), v(() => centerlineVelocity(30, GH), r, 'centerlineVelocity(30, gasHigh)')], 'RB-003 §3.1');
  claim(p, "charcoal kettle's {0} fpm at 30 inches — below a 25,000 BTU gas grill's {1} fpm", [v(() => centerlineVelocity(30, CK), r, 'centerlineVelocity(30, charcoalKettle)'), v(() => centerlineVelocity(30, GS), r, 'centerlineVelocity(30, gasSmall)')], 'RB-001 §4.3');
}
{
  const p = T + 'side-panel-effectiveness.md';
  claim(p, 'from about {0}% with no side panels to about {1}% with panels on both sides', [v(() => isl(48, 8), pct, 'capture 8'), v(() => isl(48, 8, { panels: 'both' }), pct, '… both')], 'RB-009 Table 3.1a + RB-006 §3.4');
  claim(p, 'R_panel = {0} in RB-009 Table 3.1a, so the plume feels {1}% of the ambient speed — {2} mph instead of 8', [v(() => panelReduction({ panels: 'both', f: 0.67, dir: 'side' }), f2, 'panelReduction side f=0.67'), v(() => (1 - panelReduction({ panels: 'both', f: 0.67, dir: 'side' })) * 100, r, '1 − R'), v(() => effectiveWind(8, { panels: 'both', dir: 'side' }), f1, 'effectiveWind(8, both, side)')], 'RB-009 §3.1');
  claim(p, 'to {0} points at 8 mph', [v(() => Math.round(isl(48, 8, { panels: 'both' }) * 100) - Math.round(isl(48, 8) * 100), r, 'difference of the printed (rounded) percentages at 8 mph')], 'model');
  claim(p, 'still holds about {0}% capture while the unshielded hood has collapsed to about {1}%', [v(() => isl(48, 16, { panels: 'both' }), pct, 'capture 16 both'), v(() => isl(48, 16), pct, 'capture 16 none')], 'model');
  claim(p, 'R_panel = {0} at half the mounting height, {1} at two-thirds, and {2} for full-depth panels', [v(() => R_PANEL.two.lateral[2], f2, 'R_PANEL.two.lateral f=0.50'), v(() => R_PANEL.two.lateral[3], f2, 'f=0.67'), v(() => R_PANEL.two.lateral[5], f2, 'f=1.00')], 'RB-009 Table 3.1a');
  claim(p, '(R_panel = {0}–{1})', [v(() => R_PANEL.two.frontRear[2], f2, 'R_PANEL.two.frontRear f=0.50'), v(() => R_PANEL.two.frontRear[5], f2, 'f=1.00')], 'RB-009 Table 3.1a');
  claim(p, 'decreases from {0} (exposed, no panels) to {1} (exposed, with panels) — a {2}% reduction', [v(() => K_CFM.exposed, f2, 'K_CFM.exposed'), v(() => K_CFM.exposedPanels, f2, 'K_CFM.exposedPanels'), v(() => (1 - K_CFM.exposedPanels / K_CFM.exposed) * 100, r, '1 − 4.14/5.75')], 'RB-008 §2.2');
  claim(p, 'the model reads {0}% and {1}% for that hood, and {2}% versus {3}% for the 48-inch preset', [v(() => isl(57, 5), pct, '57 @5'), v(() => isl(57, 5, { panels: 'both' }), pct, '57 @5 both'), v(() => isl(48, 5), pct, '48 @5'), v(() => isl(48, 5, { panels: 'both' }), pct, '48 @5 both')], 'RB-006 Table 3.10 (70–75 / 88–92)');
}
{
  const p = T + 'indoor-vs-outdoor-comparison.md';
  claim(p, 'models at about {0}% capture', [v(() => isl(48, 0), pct, 'capture 0')], 'model');
  claim(p, '48 inches is {0}% of the {1}-inch width', [v(() => coverageAdvisory(48, 30, GM).pctOfRecommended, r, 'coverageAdvisory(48,30).pctOfRecommended'), v(() => recommendedWidth(30, GM), r, 'recommendedWidth(30)')], 'RB-008 Table 3.10');
  claim(p, 'drops modeled capture to about {0}%', [v(() => isl(48, 5), pct, 'capture 5')], 'model');
  claim(p, '8 mph takes it to about {0}%', [v(() => isl(48, 8), pct, 'capture 8')], 'model');
  claim(p, 'modeled capture is about {0}%; for that class RB-008 sets the CFM multiplier over bare plume mass flow at {1}× without panels, versus {2}× for a sheltered installation, a {3}% increase', [v(() => isl(48, 12), pct, 'capture 12'), v(() => K_CFM.exposed, f2, 'K_CFM.exposed'), v(() => K_CFM.sheltered, f1, 'K_CFM.sheltered'), v(() => (K_CFM.exposed / K_CFM.sheltered - 1) * 100, r, '5.75/3.0 − 1')], 'RB-008 §2.2, §3.6');
  claim(p, 'moves the centerline about {0} inches', [v(() => deflection(30, 5, GM), f1, 'deflection(30, 5)')], 'RB-006 §3.2');
}
{
  const p = T + 'heat-release-rate-comparison.md';
  claim(p, '{0}× the rated heat and {1}× the convective output', [v(() => GL.btu / GS.btu, f1, 'gasLarge.btu / gasSmall.btu'), v(() => GL.qcKw / GS.qcKw, f1, 'gasLarge.qcKw / gasSmall.qcKw')], 'RB-001 Table 3.1');
  claim(p, 'only from about {0} to {1} fpm, a {2}% gain', [v(() => centerlineVelocity(30, GS), r, 'centerlineVelocity(30, gasSmall)'), v(() => centerlineVelocity(30, GL), r, 'centerlineVelocity(30, gasLarge)'), v(() => (centerlineVelocity(30, GL) / centerlineVelocity(30, GS) - 1) * 100, r, 'ratio − 1')], 'RB-001 §2.2');
  claim(p, 'for doubling Q<sub>c</sub> at {0}%', [v(() => (Math.cbrt(2) - 1) * 100, r, '2^(1/3) − 1')], 'RB-008 §2.4');
  claim(p, "kettle's {0} kW convective output is about a third of the 25,000 BTU small gas grill's {1} kW", [v(() => CK.qcKw, f1, 'charcoalKettle.qcKw'), v(() => GS.qcKw, f1, 'gasSmall.qcKw')], 'RB-001 Table 3.1');
  claim(p, 'about {0} fpm at 30 inches against {1} fpm', [v(() => centerlineVelocity(30, CK), r, 'centerlineVelocity(30, charcoalKettle)'), v(() => centerlineVelocity(30, GS), r, 'centerlineVelocity(30, gasSmall)')], 'RB-001 §3.5');
  claim(p, 'produces {0} kW convective — about {1} fpm at 30 inches', [v(() => GH.qcKw, f1, 'gasHigh.qcKw'), v(() => centerlineVelocity(30, GH), r, 'centerlineVelocity(30, gasHigh)')], 'RB-001 Table 3.1, §3.5');
  claim(p, 'From {0} kW in low-smoke mode (about {1} fpm at 30 inches) to {2} kW in high-temperature grilling mode (about {3} fpm)', [v(() => PL.qcKw, f1, 'pelletLow.qcKw'), v(() => centerlineVelocity(30, PL), r, 'centerlineVelocity(30, pelletLow)'), v(() => PH.qcKw, f1, 'pelletHigh.qcKw'), v(() => centerlineVelocity(30, PH), r, 'centerlineVelocity(30, pelletHigh)')], 'RB-001 Table 3.1');
}
{
  const p = T + 'grease-aerosol-deposition.md';
  claim(p, 'settles at about {0} m/s and reaches the ground about {1} m downwind in a 5 mph wind', [v(() => stokesSettling(100), f3, 'stokesSettling(100)'), v(() => groundContactDistance(100, 5), f1, 'groundContactDistance(100, 5)')], 'RB-011 Table 3.3a');
  claim(p, 'a 10 µm droplet ({0} m/s) would travel about {1} km', [v(() => stokesSettling(10), f4, 'stokesSettling(10)'), v(() => groundContactDistance(10, 5) / 1000, f1, 'groundContactDistance(10, 5)/1000')], 'RB-011 Table 3.3a');
  paper(p, 'Stokes settling velocity roughly 0.07–0.27 m/s', 'RB-011 §3.3 (50–100 µm rows)', 'printed range = stokesSettling(50)/(100)');
}
{
  const p = T + 'failure-mode-taxonomy.md';
  paper(p, 'FM-1', 'RB-007 §3.1–3.9', 'categorical page — no physics numbers');
}

// ---------------------------------------------------------------- run
const cache = new Map();
const read = (p) => { if (!cache.has(p)) cache.set(p, readFileSync(join(ROOT, p), 'utf8')); return cache.get(p); };
const esc = (s) => s.replace(/\|/g, '\\|').replace(/\n/g, ' ');

let bad = 0;
const rows = [];
for (const c of claims) {
  const text = read(c.page);
  let phrase = c.text, vals = [];
  c.values.forEach(([fn, fmt], i) => { const x = fn(); vals.push(fmt(x)); phrase = phrase.split(`{${i}}`).join(fmt(x)); });
  const found = text.includes(phrase);
  if (!found) bad++;
  const call = c.paper ? `paper: ${c.paper}` : c.values.map(([, , call]) => call).filter(Boolean).join('; ');
  rows.push(`| ${c.page.replace('content/', '')} | ${esc(phrase)} | ${esc(call)} | ${vals.join(' / ') || '—'} | ${c.cite} | ${found ? '✓' : '✗ not found'} |`);
}

const md = `# Physics re-base — claims ledger (Stage B content)

Generated ${new Date().toISOString().slice(0, 10)} by \`node scripts/physics-claims-ledger.mjs\`. Every hand-written numeric
claim on the 9 live question pages and 11 tool pages, recomputed from
\`static/js/ovs/physics/*.mjs\` and checked for presence in the page text. The generated
"Reference readings" tables and the three CSVs are verified separately by
\`node scripts/generate-reference-tables.mjs --check\`. Rows whose module call reads
"paper: …" quote a printed paper cell that no module computes; verify them against the
paper line, not here.

Claims: ${claims.length}; verified ✓: ${claims.length - bad}; ✗: ${bad}.

| page | claim text | module call | value | citation | status |
|---|---|---|---|---|---|
${rows.join('\n')}
`;
if (CHECK) {
  // Read-only: never rewrite the ledger (or its date line) in check mode. Compare
  // the freshly computed table with the committed one, ignoring the "Generated"
  // date line, so a claim/module change without a regenerated ledger also fails.
  const strip = (s) => s.replace(/^Generated \d{4}-\d{2}-\d{2} /m, 'Generated ');
  let prev = null;
  try { prev = readFileSync(OUT, 'utf8'); } catch { /* missing */ }
  const stale = prev === null || strip(prev) !== strip(md);
  console.log(`${claims.length} claims, ${bad} not found; ledger ${stale ? 'OUT OF DATE' : 'up to date'} (${OUT})`);
  if (stale) console.error('ledger out of date — run node scripts/physics-claims-ledger.mjs');
  if (bad || stale) process.exit(1);
} else {
  writeFileSync(OUT, md);
  console.log(`${claims.length} claims, ${bad} not found → ${OUT}`);
}
