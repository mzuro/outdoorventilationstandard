#!/usr/bin/env node
// generate-reference-tables.mjs — the single source of every reference
// number published outside the instruments.
//
//   node scripts/generate-reference-tables.mjs          # write CSVs + tables
//   node scripts/generate-reference-tables.mjs --check  # exit 1 if anything would change
//
// Emits (a) the three Dataset CSVs in static/data/ and (b) the "Reference
// readings" tables on the content/tools/*.md pages, replacing whatever sits
// between `<!-- generated:start NAME -->` and `<!-- generated:end -->` so the
// script is idempotent. Every value is computed by static/js/ovs/physics/*.mjs
// at run time; nothing numeric is typed here except paper INPUTS that the
// modules do not carry (the four extra RB-008 source rows, cited inline).
// Physics re-base Stage B4 (plan 2026-09-26 §3, §5).

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { SOURCES, SOURCE_IDS } from '../static/js/ovs/physics/heat.mjs';
import { centerlineVelocity, centerlineVelocityMs, plumeHalfWidthBT, captureDiameter, recommendedWidth } from '../static/js/ovs/physics/plume.mjs';
import { deflection, froude, FR_DISRUPTED } from '../static/js/ovs/physics/wind.mjs';
import { F_DEFAULT } from '../static/js/ovs/physics/sidepanels.mjs';
import { captureFraction } from '../static/js/ovs/physics/capture.mjs';
import { requiredCfm, plumeCfm, K_CFM } from '../static/js/ovs/physics/cfm.mjs';
import { stokesSettling, groundContactDistance } from '../static/js/ovs/physics/grease.mjs';
import { heightM } from '../static/js/ovs/physics/heat.mjs';
import { MOUNT } from '../static/js/ovs/hood-presets.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');
const HEADER = 'generated from static/js/ovs/physics by scripts/generate-reference-tables.mjs — do not edit by hand';

// ---------------------------------------------------------------- helpers
const GM = SOURCES.gasMedium;
const GL = SOURCES.gasLarge;
const HOOD_DEPTH = { wall: MOUNT.wall.depthIn, island: MOUNT.island.depthIn }; // the depths the instruments draw
const STD_HEIGHTS = [18, 24, 30, 36, 48];
const pct = (x) => `${Math.round(x * 100)}%`;
const cfm = (n) => `${n.toLocaleString('en-US')} CFM`;
const inch = (x, d = 1) => `${x.toFixed(d)}″`;
const cap = (o) => captureFraction({ riseIn: 30, src: GM, ...o });
const row = (cells) => `| ${cells.join(' | ')} |`;
const table = (head, rows) => [row(head), row(head.map(() => '---')), ...rows.map(row)].join('\n');

// ---------------------------------------------------------------- CSVs
// RB-008 Table 3.1 lists twelve sources; heat.mjs carries the eight the
// instruments model. The other four enter here as paper INPUTS (Q_c, kW —
// rb-008:198-210, identical to RB-001 Table 3.1 rb-001:241-252); the CFM is
// still computed by cfm.mjs, which reads only src.qcKw.
const RB008_SOURCES = [
  ['Gas Grill - Small', SOURCES.gasSmall],
  ['Gas Grill - Medium', SOURCES.gasMedium],
  ['Gas Grill - Large', SOURCES.gasLarge],
  ['Gas Grill - High-Output', SOURCES.gasHigh],
  ['Charcoal Kettle', SOURCES.charcoalKettle],
  ['Charcoal Kettle High', { qcKw: 3.5 }],   // rb-008:203
  ['Charcoal Kamado', { qcKw: 3.3 }],        // rb-008:204
  ['Wood-Fired', SOURCES.woodFired],
  ['Wood-Fired Large', { qcKw: 13.3 }],      // rb-008:206
  ['Pellet Smoker - Low', SOURCES.pelletLow],
  ['Pellet Smoker - Medium', { qcKw: 3.4 }], // rb-008:208
  ['Pellet Smoker - High', SOURCES.pelletHigh],
];
// Tables 3.2c/3.2d (Exposed) print eight of the twelve sources (rb-008:262-286).
const RB008_EXPOSED_SUBSET = new Set(['Gas Grill - Small', 'Gas Grill - Medium', 'Gas Grill - Large', 'Gas Grill - High-Output', 'Charcoal Kettle', 'Wood-Fired', 'Pellet Smoker - Low', 'Pellet Smoker - High']);
const RB008_CLASSES = [
  ['Sheltered', 'sheltered'],
  ['Moderate', 'moderate'],
  ['Exposed (no panels)', 'exposed'],
  ['Exposed (with side panels)', 'exposedPanels'],
];

function csvRb003() {
  const heights = [6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72];
  const cols = ['gas_grill_small', 'gas_grill_medium', 'gas_grill_large', 'gas_grill_high_output', 'charcoal_kettle', 'wood_fired', 'pellet_smoker_low', 'pellet_smoker_high'];
  const ids = ['gasSmall', 'gasMedium', 'gasLarge', 'gasHigh', 'charcoalKettle', 'woodFired', 'pelletLow', 'pelletHigh'];
  const lines = [`# ${HEADER}`, `height,${cols.join(',')}`, `in,${cols.map(() => 'fpm').join(',')}`];
  for (const z of heights) lines.push([z, ...ids.map((id) => Math.round(centerlineVelocity(z, SOURCES[id])))].join(','));
  return lines.join('\n') + '\n';
}

function csvRb006() {
  const winds = [2, 5, 8, 10, 15];
  const lines = [
    `# ${HEADER}`,
    `height,u0,${winds.map((u) => `fr_${u}mph`).join(',')},${winds.map((u) => `deflection_${u}mph`).join(',')}`,
    `in,m/s,${winds.map(() => 'dimensionless').join(',')},${winds.map(() => 'in').join(',')}`,
  ];
  for (const z of STD_HEIGHTS) {
    lines.push([
      z,
      centerlineVelocityMs(heightM(z), GM).toFixed(2),
      ...winds.map((u) => froude(z, u, GM).toFixed(2)),
      ...winds.map((u) => deflection(z, u, GM).toFixed(1)),
    ].join(','));
  }
  return lines.join('\n') + '\n';
}

function csvRb008() {
  const lines = [`# ${HEADER}`, 'source_type,q_c,wind_exposure_class,k_cfm,cfm_18in,cfm_24in,cfm_30in,cfm_36in,cfm_48in', ',kW,,dimensionless,CFM,CFM,CFM,CFM,CFM'];
  for (const [label, key] of RB008_CLASSES) {
    for (const [name, src] of RB008_SOURCES) {
      if (key.startsWith('exposed') && !RB008_EXPOSED_SUBSET.has(name)) continue;
      const cells = STD_HEIGHTS.map((z) => Math.round(plumeCfm(z, src) * K_CFM[key]));
      const k = Number.isInteger(K_CFM[key]) ? K_CFM[key].toFixed(1) : String(K_CFM[key]); // "3.0", as the paper prints it
      lines.push([name, src.qcKw, label, k, ...cells].join(','));
    }
  }
  return lines.join('\n') + '\n';
}

// ---------------------------------------------------------------- tool-page tables
// Each entry: file (under content/tools) → { name → markdown }. Names are
// what the page's <!-- generated:start NAME --> markers carry.
const TABLES = {
  'capture-demonstrator.md': {
    'i01-capture': () => {
      const rows = [];
      for (const dir of ['side', 'rear']) {
        for (const u of [0, 5, 8, 10, 15]) {
          rows.push([
            dir === 'side' ? 'Side (across the hood)' : 'Rear (wall side)',
            `${u} mph`,
            pct(cap({ widthIn: 48, depthIn: HOOD_DEPTH.wall, mount: 'wall', windMph: u, windDir: dir })),
            pct(cap({ widthIn: 48, depthIn: HOOD_DEPTH.island, mount: 'island', windMph: u, windDir: dir })),
          ]);
        }
      }
      return table(['Wind direction', 'Wind speed', `Wall (48″ × ${HOOD_DEPTH.wall}″)`, `Island (48″ × ${HOOD_DEPTH.island}″)`], rows);
    },
  },
  'cfm-calculator.md': {
    'i02-cfm-flagship': () => {
      const rows = [];
      const classes = [
        ['Sheltered (< 3 mph)', 'sheltered', 'none'],
        ['Moderate (3–7 mph)', 'moderate', 'none'],
        ['Exposed (7–12 mph), side panels', 'exposed', 'both'],
        ['Exposed (7–12 mph), no panels', 'exposed', 'none'],
      ];
      for (const [label, exposure, panels] of classes) {
        const w = requiredCfm({ src: GL, riseIn: 30, mount: 'wall', exposure, panels });
        const i = requiredCfm({ src: GL, riseIn: 30, mount: 'island', exposure, panels });
        rows.push([label, w.kCfm.toFixed(2), cfm(w.minimum), cfm(w.blower), cfm(i.minimum), cfm(i.blower)]);
      }
      return table(['Wind exposure', 'K_CFM', 'Wall — minimum', 'Wall — blower', 'Island — minimum', 'Island — blower'], rows);
    },
    'i02-cfm-by-source': () => {
      const rows = SOURCE_IDS.map((id) => {
        const s = SOURCES[id];
        return [s.label, `${s.qcKw.toFixed(1)} kW`, ...STD_HEIGHTS.map((z) => requiredCfm({ src: s, riseIn: z, mount: 'wall', exposure: 'moderate' }).minimum.toLocaleString('en-US'))];
      });
      return table(['Source (RB-001 Table 3.1)', 'Q_c', ...STD_HEIGHTS.map((z) => `${z}″`)], rows);
    },
  },
  'wind-deflection-trajectory.md': {
    'i03-deflection': () => {
      const winds = [3, 5, 8, 12, 20];
      const rows = STD_HEIGHTS.map((z) => [
        `${z}″`,
        ...winds.map((u) => inch(deflection(z, u, GM)) + (froude(z, u, GM) > FR_DISRUPTED ? ' †' : '')),
      ]);
      return table(['Mounting rise', ...winds.map((u) => `${u} mph`)], rows);
    },
  },
  'plume-width-by-height.md': {
    'i04-width': () => {
      const rows = [0, 12, 18, 24, 30, 36, 48].map((z) => [
        z === 0 ? '0″ (cooking surface)' : `${z}″`,
        inch(plumeHalfWidthBT(z, GM)),
        inch(captureDiameter(z, GM)),
        `${Math.round(recommendedWidth(z, GM))}″`,
      ]);
      return table(['Height above cooking surface', 'Plume half-width b_T', 'Capture diameter d_capture', 'Recommended width W_rec'], rows);
    },
  },
  'hood-geometry-comparison.md': {
    'i05-geometry': () => {
      const rows = [42, 48, 54, 60, 72].map((w) => [
        `${w}″`,
        pct(cap({ widthIn: w, depthIn: HOOD_DEPTH.wall, mount: 'wall', windMph: 8, windDir: 'rear' })),
        pct(cap({ widthIn: w, depthIn: HOOD_DEPTH.island, mount: 'island', windMph: 8, windDir: 'rear' })),
        pct(cap({ widthIn: w, depthIn: HOOD_DEPTH.island, mount: 'island', windMph: 8, windDir: 'side' })),
      ]);
      return table(['Hood width', 'Rear wind — wall mount', 'Rear wind — island mount', 'Side wind — either mount'], rows);
    },
  },
  'velocity-decay-curves.md': {
    'i06-velocity': () => {
      const rows = [6, 12, 18, 24, 30, 36, 48, 60, 72].map((z) => [
        `${z}″`,
        `${Math.round(centerlineVelocity(z, GM))} fpm`,
        `${Math.round(centerlineVelocity(z, SOURCES.charcoalKettle))} fpm`,
      ]);
      return table(['Distance above cooking surface', 'Gas grill — medium (40k BTU)', 'Charcoal kettle (15k BTU)'], rows);
    },
  },
  'side-panel-effectiveness.md': {
    'i07-panels': () => {
      const rows = [0, 4, 8, 12, 16].map((u) => [
        `${u} mph`,
        pct(cap({ widthIn: 48, depthIn: HOOD_DEPTH.island, mount: 'island', windMph: u, windDir: 'side' })),
        pct(cap({ widthIn: 48, depthIn: HOOD_DEPTH.island, mount: 'island', windMph: u, windDir: 'side', panels: 'both' })),
      ]);
      return table(['Side wind', 'Without panels', `With panels (both sides, f = ${F_DEFAULT})`], rows);
    },
  },
  'indoor-vs-outdoor-comparison.md': {
    'i08-indoor-outdoor': () => {
      const rows = [0, 3, 5, 8, 12].map((u) => [
        u === 0 ? '0 mph (indoor-equivalent, still air)' : `${u} mph`,
        pct(cap({ widthIn: 48, depthIn: HOOD_DEPTH.island, mount: 'island', windMph: u, windDir: 'side' })),
      ]);
      return table(['Side wind', 'Modeled outdoor capture'], rows);
    },
  },
  'heat-release-rate-comparison.md': {
    'i09-sources': () => {
      const rows = SOURCE_IDS.map((id) => {
        const s = SOURCES[id];
        return [s.label, s.btu.toLocaleString('en-US'), s.chiC.toFixed(2), `${s.qcKw.toFixed(1)} kW`, `${Math.round(centerlineVelocity(30, s))} fpm`];
      });
      return table(['Source', 'Rated BTU/hr', 'χ_c', 'Q_c', 'u_0 at 30″'], rows);
    },
  },
  'grease-aerosol-deposition.md': {
    'i10-grease': () => {
      const winds = [2, 5, 8, 10];
      const dist = (m) => (m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${m.toFixed(1)} m`);
      const rows = [5, 10, 20, 50, 100].map((dp) => [
        `${dp} µm`,
        stokesSettling(dp) >= 0.01 ? `${stokesSettling(dp).toFixed(3)} m/s` : `${stokesSettling(dp).toExponential(2)} m/s`,
        ...winds.map((u) => dist(groundContactDistance(dp, u))),
      ]);
      return table(['Droplet diameter', 'Settling velocity v_s', ...winds.map((u) => `Ground contact at ${u} mph`)], rows);
    },
  },
};

// ---------------------------------------------------------------- apply
function replaceBlock(text, name, body, file) {
  const re = new RegExp(`(<!-- generated:start ${name} -->)\\n?[\\s\\S]*?\\n?(<!-- generated:end -->)`);
  if (!re.test(text)) throw new Error(`${file}: missing <!-- generated:start ${name} --> … <!-- generated:end --> markers`);
  return text.replace(re, `$1\n${body}\n$2`);
}

let changed = 0;
function emit(path, next) {
  let prev = null;
  try { prev = readFileSync(path, 'utf8'); } catch { /* new file */ }
  if (prev === next) return;
  changed++;
  if (CHECK) { console.error(`would change: ${path}`); return; }
  writeFileSync(path, next);
  console.log(`wrote ${path}`);
}

emit(join(ROOT, 'static/data/rb-003-centerline-velocity-decay.csv'), csvRb003());
emit(join(ROOT, 'static/data/rb-006-crosswind-froude-number.csv'), csvRb006());
emit(join(ROOT, 'static/data/rb-008-cfm-sizing-tables.csv'), csvRb008());

for (const [file, blocks] of Object.entries(TABLES)) {
  const path = join(ROOT, 'content/tools', file);
  let text = readFileSync(path, 'utf8');
  for (const [name, build] of Object.entries(blocks)) text = replaceBlock(text, name, build(), file);
  emit(path, text);
}

if (CHECK && changed) { console.error(`${changed} file(s) out of date — run node scripts/generate-reference-tables.mjs`); process.exit(1); }
if (!changed) console.log('reference tables up to date');
