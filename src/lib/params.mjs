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

const ENUM = (values) => ({ kind: 'enum', values });
const RANGE = (min, max, step) => ({ kind: 'range', min, max, step });

export const SCHEMAS = {
  i01: {
    fields: {
      wind: RANGE(0, 20, 1),
      width: { kind: 'detents', values: [42, 48, 54, 60, 72] },
      mount: ENUM(['wall', 'island']),
      panels: ENUM(['none', 'one', 'both']),
    },
    defaults: { wind: 4, width: 48, mount: 'island', panels: 'none' },
  },
  i02: {
    fields: {
      width: { kind: 'detents', values: [42, 48, 54, 60, 72] },
      mount: ENUM(['wall', 'island']),
      exposure: ENUM(['sheltered', 'moderate', 'exposed']),
      btu: RANGE(30000, 150000, 10000),
    },
    defaults: { width: 48, mount: 'island', exposure: 'moderate', btu: 60000 },
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
      errors.push(`missing param: ${name}`);
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
