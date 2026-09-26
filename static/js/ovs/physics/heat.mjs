// heat.mjs — cooking-source parameters (RB-001 Tables 3.1/3.2, RB-002 A.4).
//
// Every number here is a printed paper cell; nothing is derived. In
// particular z_0 is the TABULATED virtual origin (rb-001:270-283), which
// every downstream paper table uses — the formula z_0 = 0.083·Q^0.4 − 1.02·D
// does not reproduce it (plan §1 (h)), so the tabulated value is normative.
//
// Units on the public surface: BTU/hr, kW, metres, inches. Pure module —
// no DOM, no I/O — shared by the instruments (client) and src/lib (worker).

/** 1 kW = 3,412 BTU/hr (RB-008 App A step 1, rb-008:834). */
export const BTU_PER_KW = 3412;

/**
 * The papers' mounting-height grid in metres (0.01 m resolution). Using
 * this grid instead of z·0.0254 is what makes the printed rows reproduce to
 * the CFM / fpm: rb-002:402-406 (18–48 in), rb-003:258-269 (6–72 in).
 */
export const HEIGHT_M = {
  6: 0.15, 12: 0.30, 18: 0.46, 24: 0.61, 30: 0.76, 36: 0.91,
  42: 1.07, 48: 1.22, 54: 1.37, 60: 1.52, 66: 1.68, 72: 1.83,
};

/** Height above the cooking surface in metres: paper grid, else 0.0254 m/in. */
export function heightM(zIn) {
  const z = Number(zIn);
  return Object.prototype.hasOwnProperty.call(HEIGHT_M, z) ? HEIGHT_M[z] : z * 0.0254;
}

/**
 * RB-001 Table 3.1 (Q_total, chi_c, Q_c, D_eff; rb-001:241-252), Table 3.2
 * (z_0; rb-001:272-283) and RB-002 A.4 cooking-surface W×D (rb-002:994-1004).
 * Keys are stable identifiers used by src/lib/params.mjs and the i02 SOURCE
 * control (Stage B).
 */
export const SOURCES = Object.freeze({
  gasSmall:       Object.freeze({ id: 'gasSmall',       label: 'Gas grill — small (25k BTU)',        fuel: 'gas',      btu: 25000, qTotalKw: 7.3,  chiC: 0.70, qcKw: 5.1,  dEffM: 0.43, z0M: -0.30, cookWIn: 18, cookDIn: 19 }),
  gasMedium:      Object.freeze({ id: 'gasMedium',      label: 'Gas grill — medium (40k BTU)',       fuel: 'gas',      btu: 40000, qTotalKw: 11.7, chiC: 0.70, qcKw: 8.2,  dEffM: 0.51, z0M: -0.37, cookWIn: 24, cookDIn: 21 }),
  gasLarge:       Object.freeze({ id: 'gasLarge',       label: 'Gas grill — large (60k BTU)',        fuel: 'gas',      btu: 60000, qTotalKw: 17.6, chiC: 0.70, qcKw: 12.3, dEffM: 0.58, z0M: -0.41, cookWIn: 30, cookDIn: 22 }),
  gasHigh:        Object.freeze({ id: 'gasHigh',        label: 'Gas grill — high-output (80k BTU)',  fuel: 'gas',      btu: 80000, qTotalKw: 23.4, chiC: 0.70, qcKw: 16.4, dEffM: 0.65, z0M: -0.44, cookWIn: 36, cookDIn: 22 }),
  charcoalKettle: Object.freeze({ id: 'charcoalKettle', label: 'Charcoal kettle (15k BTU)',          fuel: 'charcoal', btu: 15000, qTotalKw: 4.4,  chiC: 0.40, qcKw: 1.8,  dEffM: 0.56, z0M: -0.47, cookWIn: 22, cookDIn: 22 }),
  woodFired:      Object.freeze({ id: 'woodFired',      label: 'Wood-fired grill (40k BTU)',         fuel: 'wood',     btu: 40000, qTotalKw: 11.7, chiC: 0.65, qcKw: 7.6,  dEffM: 0.50, z0M: -0.36, cookWIn: 24, cookDIn: 16 }),
  pelletLow:      Object.freeze({ id: 'pelletLow',      label: 'Pellet smoker — low (8k BTU)',       fuel: 'pellet',   btu: 8000,  qTotalKw: 2.3,  chiC: 0.65, qcKw: 1.5,  dEffM: 0.45, z0M: -0.38, cookWIn: 22, cookDIn: 14 }),
  pelletHigh:     Object.freeze({ id: 'pelletHigh',     label: 'Pellet smoker — high (30k BTU)',     fuel: 'pellet',   btu: 30000, qTotalKw: 8.8,  chiC: 0.65, qcKw: 5.7,  dEffM: 0.45, z0M: -0.30, cookWIn: 22, cookDIn: 14 }),
});

/** Ordered list of source ids (menu order for the i02 SOURCE control). */
export const SOURCE_IDS = Object.freeze(Object.keys(SOURCES));

/** Convective heat release Q_c = chi_c × Q_total (kW). RB-008 App A step 1. */
export function convectiveKw(btu, chiC = 0.70) {
  return (btu / BTU_PER_KW) * chiC;
}

/**
 * Nearest RB-001 row for a rated BTU/hr and fuel ('gas' | 'charcoal' |
 * 'wood' | 'pellet'). Ties resolve to the STRONGER plume — RB-001 Table 3.1
 * note 3 (rb-001:258) makes full-capacity operation the design condition.
 */
export function sourceForBtu(btu, fuel = 'gas') {
  const rows = SOURCE_IDS.map((k) => SOURCES[k]).filter((s) => s.fuel === fuel);
  const pool = rows.length ? rows : SOURCE_IDS.map((k) => SOURCES[k]).filter((s) => s.fuel === 'gas');
  let best = pool[0];
  for (const s of pool) {
    const d = Math.abs(s.btu - btu), bd = Math.abs(best.btu - btu);
    if (d < bd || (d === bd && s.qcKw > best.qcKw)) best = s;
  }
  return best;
}
