// narration.mjs — post-validation of the /api/explain model narration
// (W3 review MAJOR-1). The state sheet is computed server-side by the
// same physics modules the instrument draws with; the model is only
// supposed to put those numbers into words. This module makes that
// promise STRUCTURAL instead of prompt-enforced: every numeral in the
// model's prose must be traceable to the state sheet, or the prose is
// discarded and replaced by a deterministic template built from the
// state sheet itself. Unvalidated model prose is never displayed.
//
// Pure — no I/O, unit-testable without a live model.

/**
 * MATCHING RULES — deliberate, in order of application:
 *
 * 1. RB-paper codes ("RB-008") are stripped before numeral extraction.
 *    The paper list is part of the model's provided context and the
 *    digits inside a citation code are not physical quantities.
 * 2. Numerals are extracted with thousands separators intact
 *    ("1,450" -> 1450) and decimals intact ("12.8" -> 12.8). A leading
 *    sign is folded in ("-3" -> -3). Ordinal/word numbers ("two",
 *    "first") are not digits and are deliberately out of scope.
 * 3. The allowed set is every numeric leaf of the state sheet — inputs
 *    AND outputs — because both are in the text the model was given
 *    (e.g. "at 5 mph", "a 48-inch hood", "captures 79%"). Unit suffixes
 *    in prose ("79%", "13 in", "5 mph", "60,000 BTU/hr") don't affect
 *    matching: the unit is not part of the extracted numeral.
 * 4. A narration numeral N is accepted against an allowed value A when:
 *      a. N === A exactly; or
 *      b. N equals A rounded to N's own decimal precision — the model
 *         may round DOWN in precision ("13 in" for 12.8, "3 mph" for
 *         3.2) but never invent precision or shift the value ("13.5"
 *         for 12.8 fails, "1,500" for 1,450 fails); or
 *      c. N * 1000 === A — accepts the "60k BTU" shorthand for 60000.
 *         Only the k-scale is allowed; percent<->fraction and other
 *         unit conversions are NOT attempted, so a "converted" number
 *         the sheet doesn't literally contain still fails.
 * 5. Numeral-free prose passes: purely qualitative narration invents
 *    nothing.
 *
 * These rules are intentionally strict-by-default: a false REJECT only
 * costs us the model's phrasing (the user still gets correct numbers via
 * the template + the client's authoritative readout); a false ACCEPT
 * would put a wrong number on a site whose brand is "no ungrounded
 * claims". When in doubt, reject.
 */

const RB_CODE_RE = /\bRB[-‐-―]?\d{1,4}\b/gi;
const NUMERAL_RE = /-?\d{1,3}(?:,\d{3})+(?:\.\d+)?|-?\d+(?:\.\d+)?/g;

/** Recursively collect every numeric leaf of the state sheet. Pure. */
export function allowedNumbers(state) {
  const out = new Set();
  (function walk(v) {
    if (typeof v === 'number' && Number.isFinite(v)) out.add(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') Object.values(v).forEach(walk);
  })(state);
  return out;
}

/** Extract the numerals a reader would see in the narration. Pure. */
export function extractNumerals(text) {
  const scrubbed = String(text == null ? '' : text).replace(RB_CODE_RE, ' ');
  const matches = scrubbed.match(NUMERAL_RE) || [];
  return matches.map((m) => {
    const decimals = m.includes('.') ? m.split('.')[1].length : 0;
    return { raw: m, value: parseFloat(m.replace(/,/g, '')), decimals };
  });
}

function matchesAllowed(token, allowed) {
  for (const a of allowed) {
    if (token.value === a) return true; // rule 4a
    const factor = Math.pow(10, token.decimals);
    if (Math.round(a * factor) / factor === token.value) return true; // rule 4b
    if (token.decimals === 0 && token.value * 1000 === a) return true; // rule 4c
  }
  return false;
}

/**
 * Validate a model narration against the state sheet it was asked to
 * narrate. Returns { ok, bad } where bad lists the offending raw
 * numerals (empty when ok). Pure.
 */
export function validateNarration(text, state) {
  const allowed = allowedNumbers(state);
  const bad = extractNumerals(text)
    .filter((t) => !matchesAllowed(t, allowed))
    .map((t) => t.raw);
  return { ok: bad.length === 0, bad };
}

// ---------------------------------------------------------------------
// Honest degradation: deterministic template narration, built ONLY from
// state-sheet values, used whenever the model's prose fails validation
// (or is empty). Site voice, no model involvement, cannot be wrong.
// ---------------------------------------------------------------------

const EXPOSURE_LABEL = { sheltered: 'sheltered', moderate: 'moderate', exposed: 'exposed' };
const PANELS_LABEL = { none: 'no side panels', one: 'one side panel', both: 'side panels on both sides' };

export function templateNarration(state) {
  if (!state || !state.inputs || !state.outputs) return 'Narration unavailable. The computed values shown above are authoritative.';
  const i = state.inputs;
  const o = state.outputs;
  if (state.instrument === 'i01') {
    return `At ${i.windMph} mph wind, a ${i.widthIn}-inch ${i.mount} hood with ${PANELS_LABEL[i.panels] || i.panels} `
      + `captures ${o.capturePct}% of the cooking plume. Wind deflects the plume ${o.deflectionIn} inches sideways `
      + `by the time it reaches the hood (effective wind ${o.effectiveWindMph} mph after shielding), where the plume `
      + `is about ${o.plumeWidthAtHoodIn} inches wide.`;
  }
  if (state.instrument === 'i02') {
    return `A ${i.widthIn}-inch ${i.mount} hood over a ${i.btu.toLocaleString('en-US')} BTU/hr appliance in `
      + `${EXPOSURE_LABEL[i.exposure] || i.exposure} wind exposure needs at least ${o.minimumCfm.toLocaleString('en-US')} CFM; `
      + `${o.recommendedCfm.toLocaleString('en-US')} CFM is recommended, and high-wind conditions call for `
      + `${o.highWindCfm.toLocaleString('en-US')} CFM.`;
  }
  return 'Narration unavailable. The computed values shown above are authoritative.';
}
