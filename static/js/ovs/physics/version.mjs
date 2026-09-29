// version.mjs — the physics model version. Bumped whenever the modules in
// this directory change what they compute for the same inputs, OR when the
// /api/explain state sheet built from them changes shape or meaning
// (src/lib/explain-state.mjs, src/lib/narration.mjs): a cached explain
// body carries the whole sheet plus a narration written from it. The
// worker prefixes every KV cache key with it (explain:<v>:…, ask:<v>:…)
// so a re-base can never serve a narration or answer computed by the
// previous physics (src/worker.js, src/lib/normalize.mjs).
//   v1 — original face-velocity / 400 fpm plateau model
//   v2 — 2026-09-26 re-base on the RB papers (heat/plume/wind/sidepanels/
//        capture/cfm/grease)
//   v3 — 2026-09-29 i02 state sheet: above the blower ladder the sheet
//        carries blowerMargin/blowerNeedCfm/blowerLadderTopCfm instead of
//        a blowerCfm equal to the minimum (Stage-B review HIGH finding)
export const PHYSICS_VERSION = 'v3';
