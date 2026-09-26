// version.mjs — the physics model version. Bumped whenever the modules in
// this directory change what they compute for the same inputs. The worker
// prefixes every KV cache key with it (explain:<v>:…, ask:<v>:…) so a
// re-base can never serve a narration or answer computed by the previous
// physics (src/worker.js, src/lib/normalize.mjs).
//   v1 — original face-velocity / 400 fpm plateau model
//   v2 — 2026-09-26 re-base on the RB papers (heat/plume/wind/sidepanels/
//        capture/cfm/grease)
export const PHYSICS_VERSION = 'v2';
