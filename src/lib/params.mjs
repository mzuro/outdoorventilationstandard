// params.mjs — /api/explain param validation (AI #7).
//
// The instrument's own control schemas (static/js/ovs/instruments/i01.mjs,
// i02.mjs) are the source of truth for these ranges/enums; this module
// mirrors them server-side so a POST {instrument, params} body can never
// drive the physics recompute with an out-of-range or malformed value.
//
// Contract (matches the acceptance criterion in the AI expert report
// §2.3): out-of-range numbers, wrong types, unknown enum values, missing
// required keys, and extra/unexpected keys are all REJECTED (ok:false —
// the worker maps this to HTTP 400), not silently clamped. A legitimate
// client never sends an out-of-range value (the sliders enforce their own
// min/max/step), so one arriving server-side is itself a tamper signal.
// Values that ARE in range but off the discrete step grid (e.g. width:50
// between the 48/54 detents, or float jitter) are snapped to the nearest
// valid grid point — that's rounding, not correction of an abusive input.
//
// Optional fields (`optional: true`): controls the physics re-base added
// (i01 wind direction; i02 source / mounting height / panels / coverage
// width) that a client may not expose yet. ABSENT → the default is filled
// in (or the key is omitted when there is no default); PRESENT → validated
// exactly as strictly as a required field. The legacy i02 `btu` field is a
// STAGE-A SHIM (remove in Stage B): explain-state maps it to the nearest
// RB-001 source when no `source` is sent.

import { SOURCE_IDS } from '../../static/js/ovs/physics/heat.mjs';

const ENUM = (values, extra = {}) => ({ kind: 'enum', values, ...extra });
const RANGE = (min, max, step, extra = {}) => ({ kind: 'range', min, max, step, ...extra });
const DETENTS = (values, extra = {}) => ({ kind: 'detents', values, ...extra });

export const SCHEMAS = {
  i01: {
    fields: {
      wind: RANGE(0, 20, 1),
      width: DETENTS([42, 48, 54, 60, 72]),
      mount: ENUM(['wall', 'island']),
      panels: ENUM(['none', 'both']),                       // 'one' dropped: no paper row (rb-009:369)
      dir: ENUM(['side', 'rear'], { optional: true, default: 'side' }),
    },
    defaults: { wind: 4, width: 48, mount: 'island', panels: 'none', dir: 'side' },
  },
  i02: {
    fields: {
      // No default on purpose: explain-state resolves an absent source from
      // the legacy `btu` (STAGE-A SHIM) and otherwise to Gas Large.
      source: ENUM(SOURCE_IDS, { optional: true }),                        // RB-001 Table 3.1 rows
      height: DETENTS([18, 24, 30, 36, 48], { optional: true, default: 30 }), // RB-008 table columns
      mount: ENUM(['wall', 'peninsula', 'island']),        // rb-008:560-562
      exposure: ENUM(['sheltered', 'moderate', 'exposed']),
      panels: ENUM(['none', 'both'], { optional: true, default: 'none' }),
      width: DETENTS([42, 48, 54, 60, 72], { optional: true }), // coverage advisory only (RB-008 Table 3.10)
      btu: RANGE(30000, 150000, 10000, { optional: true }),    // STAGE-A SHIM (legacy i02 control)
    },
    defaults: { source: 'gasLarge', height: 30, mount: 'island', exposure: 'moderate', panels: 'none' },
  },
};

function nearest(value, allowed) {
  return allowed.reduce((best, v) => (Math.abs(v - value) < Math.abs(best - value) ? v : best), allowed[0]);
}

/**
 * Validate + snap a params object for one instrument. Pure — no I/O.
 * Returns { ok: true, params } on success, or { ok: false, errors } with
 * one message per problem field on failure. Never throws.
 */
export function clampParams(instrument, rawParams) {
  const schema = SCHEMAS[instrument];
  if (!schema) return { ok: false, errors: [`unknown instrument: ${instrument}`] };
  if (!rawParams || typeof rawParams !== 'object' || Array.isArray(rawParams)) {
    return { ok: false, errors: ['params must be an object'] };
  }

  const errors = [];
  const fieldNames = Object.keys(schema.fields);
  const extraKeys = Object.keys(rawParams).filter((k) => !fieldNames.includes(k));
  if (extraKeys.length > 0) errors.push(`unexpected params: ${extraKeys.join(', ')}`);

  const out = {};
  for (const name of fieldNames) {
    const spec = schema.fields[name];
    const has = Object.prototype.hasOwnProperty.call(rawParams, name);
    if (!has) {
      if (spec.optional) {
        if (spec.default !== undefined) out[name] = spec.default;
      } else {
        errors.push(`missing param: ${name}`);
      }
      continue;
    }
    const value = rawParams[name];

    if (spec.kind === 'enum') {
      if (typeof value !== 'string' || !spec.values.includes(value)) {
        errors.push(`invalid value for ${name}: ${JSON.stringify(value)}`);
        continue;
      }
      out[name] = value;
    } else if (spec.kind === 'detents') {
      const n = typeof value === 'number' ? value : NaN;
      if (!Number.isFinite(n)) {
        errors.push(`invalid value for ${name}: ${JSON.stringify(value)}`);
        continue;
      }
      if (n < spec.values[0] || n > spec.values[spec.values.length - 1]) {
        errors.push(`out of range for ${name}: ${n}`);
        continue;
      }
      out[name] = nearest(n, spec.values);
    } else if (spec.kind === 'range') {
      const n = typeof value === 'number' ? value : NaN;
      if (!Number.isFinite(n)) {
        errors.push(`invalid value for ${name}: ${JSON.stringify(value)}`);
        continue;
      }
      if (n < spec.min || n > spec.max) {
        errors.push(`out of range for ${name}: ${n}`);
        continue;
      }
      out[name] = spec.step ? Math.round(n / spec.step) * spec.step : n;
    }
  }

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, params: out };
}

/** Canonical, order-independent cache-key string for a validated params object. Pure. */
export function paramsCacheKey(instrument, params) {
  const keys = Object.keys(params).sort();
  const parts = keys.map((k) => `${k}=${params[k]}`);
  return `${instrument}:${parts.join('&')}`;
}
