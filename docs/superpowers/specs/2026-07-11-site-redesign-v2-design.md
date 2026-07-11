# Outdoor Ventilation Standard v2 — Site Redesign Design Spec

Date: 2026-07-11 · Status: approved pending Mark's spec review · Branch: `redesign/v2`

## 1. Goal

Replace the stock PaperMod look with a fully custom design ("Modern Standard" direction), rebuild the 10 tools as live interactive instruments, and restructure the site homeowner-first — while preserving the neutral research-body positioning, the Hugo + Cloudflare Workers pipeline, and the OVS content agent's draft workflow. Nothing deploys to the live site until Mark walks a complete staging preview and signs off.

## 2. Decisions log (do not re-litigate)

| Decision | Value |
|---|---|
| Stack | Keep Hugo; custom theme replaces PaperMod entirely |
| Visual direction | D3 "Modern Standard" (mockup: `scratchpad/ovs-mockups/modern-standard.html`, artifact 2f555a42) |
| Interactivity | Full explorable explanations; every figure is an instrument |
| Primary audience | Homeowners planning outdoor kitchens; physics backs plain answers |
| IA | Answer-first hub (Questions → Instruments → Research → Standard/About) |
| Hood defaults | Wall 36" deep / Island 40" deep; widths 42/48/54/60/72; controls snap 6" |
| Content voice | Brief, to the point, relevant. Answer first, evidence second, no fluff |
| E-E-A-T | First-class requirement (§6) |
| Launch gate | Staging preview walked and approved by Mark before merge to main |
| Citations | Numbered IEEE-style (site-wide, matches agent decision 2026-07-11) |
| Bylines | Site editorial team; Mark Zuro as technical reviewer |

## 3. Visual system

Token file `assets/css/tokens.css` (CSS custom properties, light + dark via `prefers-color-scheme`, both themes first-class):

- Ground `#fbfbf9` / dark `#101418`-family; ink near-black / off-white
- Single accent: authoritative blue `#1747c4` light / `#8fb0ff` dark; reserved for interaction and data emphasis
- Type: grotesque sans stack (Helvetica Neue/Inter-like system stack) for prose; monospace for clause numbers, readouts, chips. Tabular numerals wherever digits align
- Clause numbering as the governing motif: page sections numbered (1.2, 2.4); tools are Instruments I-01…I-10; papers stay RB-001…RB-012
- Diagrams as technical line art: 1px rules, dimension lines with arrowheads, hatching, annotation callouts — per the D3 mockup's "Figure 1 — Capture Demonstrator"
- Boxed NOTE blocks in standards-document voice (e.g., the no-marketing pledge)

## 4. Information architecture

Nav: **Questions · Instruments · Research · Standard · About**

- **Homepage**: hero (identity + Capture Demonstrator I-01 + AI question box) → question cards → instruments grid → research library table (tier-labeled) → trust strip → footer
- **Questions** (new content type `content/questions/`): one real homeowner question per page ("What CFM do I need for a 48-inch island hood?"). Structure: direct answer in the first 2–3 sentences → embedded instrument preset to the question's scenario → short explanation → numbered citations to RB papers. Launch set: 6 pages (CFM sizing, wind, island vs wall, hood depth/overhang, side panels, mounting height). This is the content shape the OVS agent drafts going forward
- **Instruments** (`content/tools/`, relabeled): one page per instrument, full-width interactive + method notes + related questions/papers
- **Research**: existing 12 RB papers, restyled; sticky clause-numbered TOC; inline instruments as live figures via shortcode
- **Standard** (rename of governance): methodology, governance docs, references, downloads — the citability layer
- **About**: entity page (§6)

URL compatibility: existing `/research/…` and `/tools/…` URLs unchanged. New sections additive. Any relabeled path gets a Hugo alias (redirect). No 404s from the redesign.

## 5. Hood presets (product-grounded defaults)

Shared module `assets/js/hood-presets.js`:

```js
export const MOUNT = { wall: { depth: 36 }, island: { depth: 40 } };
export const MODEL_WIDTHS = [42, 48, 54, 60, 72]; // marked detents + defaults
export const WIDTH_STEP = 6;                      // slider increment (66 valid but unmarked)
```

Every instrument with hood geometry gets a wall/island toggle (sets depth) and a width control snapping in 6" steps with model widths as marked detents; defaults always land on a model width. Presented as "typical outdoor-rated hood dimensions" — never a brand name (preserves neutrality; pledge stays intact).

## 6. E-E-A-T requirements

- **Experience**: reviewer credentials on every technical page ("Reviewed by Mark Zuro, [credential line — NEEDS MARK: one-sentence bio/credentials]"); field-observation callouts where real installation experience informs guidance (sourced from Mark, never invented — REAL data only)
- **Expertise**: numbered IEEE citations on every claim; methodology page linked from every paper/instrument footer; each instrument's method notes state model assumptions and limits plainly
- **Authoritativeness**: `schema.org` structured data — `Organization` (site), `Person` (reviewer), `TechArticle` (papers), `WebApplication` (instruments), `FAQPage` (question pages), `BreadcrumbList` site-wide; consistent entity name/logo; About page states who runs the site, funding independence, and editorial policy
- **Trust**: visible published/updated dates on all content; no-marketing pledge NOTE block; references page; contact route; correct HTTPS/canonical/OG metadata (already partly present)
- **Content voice** (serves both users and E-E-A-T): answer in the first two sentences, brief throughout, no filler phrases, no keyword stuffing; headings are questions or plain statements; every page targets one intent

## 7. Instruments (10)

Shared engine `assets/js/ovs-viz.js` (~vanilla JS + SVG): control binding (sliders/toggles with rAF-lerped transitions), readout formatting (tabular numerals, units), dimension-line renderer, particle layer, reduced-motion mode (static render, no particles), keyboard operability, ARIA live readouts. Each instrument = engine + small pure physics module (`assets/js/physics/*.js`) — independent, unit-testable, buildable by one agent in isolation.

| ID | Instrument | Source | Core interaction |
|---|---|---|---|
| I-01 | Capture Demonstrator | mockup hero | wind + width/mount → live capture % |
| I-02 | CFM Requirement | existing calculator | grill BTU/size, mount, wind exposure → CFM band |
| I-03 | Wind Deflection | rb-006 svg | wind slider bends plume trajectory |
| I-04 | Plume Width by Height | rb-002 svg | height slider, entrainment spread |
| I-05 | Hood Geometry Comparison | rb-005 svg | side-by-side geometries, capture overlay |
| I-06 | Velocity Decay | rb-003 svg | distance slider, decay curve tracer |
| I-07 | Side Panel Effectiveness | rb-009 svg | panels on/off, wind sweep |
| I-08 | Indoor vs Outdoor | rb-004 svg | toggle environment assumptions |
| I-09 | Heat Release Comparison | rb-011/appliance data | appliance picker → plume scale |
| I-10 | Failure Modes + Grease | rb-007/rb-011 svgs | interactive taxonomy tree + deposition map |

Embedding: Hugo shortcode `{{</* instrument id="I-03" preset="island-48" */>}}` works on instrument pages, question pages, and inside papers. Existing static SVGs remain as `<noscript>`/reduced-JS fallbacks. Physics simplified but honest: monotonic, plausible magnitudes, units correct, assumptions stated — each module sanity-checked against its RB paper.

## 8. Theme templates

`themes/ovs/` (new): `baseof.html`, homepage, question single/list, instrument single/list, research single/list (sticky TOC), standard/about singles, search page (keep Fuse.js + AI toggle), 404, header/footer/nav partials, SEO/schema partials, citation partial (numbered refs). AI Q&A worker (`src/worker.js`) kept; response UI restyled with RB citation chips. `hugo.toml` updated; PaperMod submodule/theme removed after parity.

## 9. Quality gates & staging protocol

1. Unit sanity tests per physics module (monotonicity, ranges, units) — run in CI-less repo via a simple `npm test` node script
2. Adversarial review panel (agents): physics-vs-paper, accessibility (keyboard, SR, contrast both themes), mobile 375px, SEO/schema validation, no-external-request check, Lighthouse ≥ 90 perf
3. Visual regression sweep: render every page type + all 123 pages build clean (`hugo --gc --minify` zero errors, no broken internal links)
4. **Staging gate**: `redesign/v2` deploys to a separate Cloudflare Workers preview (`ovs-v2-preview.markzuro.workers.dev`, non-indexed via `noindex` header + robots) — Mark walks every template, all 10 instruments, both themes, phone + desktop, and explicitly approves
5. Only then: merge to main → production deploy → post-deploy smoke check (GSC crawl, key URLs 200, schema valid)

## 10. Implementation phases (team plan)

- **P1 Foundation** (sequential): tokens + theme skeleton + `ovs-viz` engine + hood-presets + schema partials
- **P2 Fan-out** (parallel agents): ~6 template agents (homepage, question, instrument, research, standard/about, search) + 10 instrument agents (one per I-xx) + 6 question-page content agents (drafts follow §6 voice; Mark reviews as technical reviewer)
- **P3 Review panel** (parallel adversarial): gates from §9 item 2–3; findings fixed before staging
- **P4 Staging + Mark's walkthrough** → fixes → approval → production

## 11. Out of scope

- Rewriting the 12 RB papers (restyle only; content untouched)
- outdoorrangehoods.com changes
- New analytics wiring (GSC/GA4 connection is a separate task)
- OVS agent prompt updates to target the new question format (follow-up after launch)

## 12. Success criteria

- Site no longer recognizable as PaperMod; matches D3 mockup system in both themes
- All 10 instruments live, keyboard-operable, honest physics, product-grounded defaults
- All existing URLs resolve; 123 pages build clean; Lighthouse ≥ 90 perf / ≥ 95 SEO + a11y
- Valid structured data on every page type
- Mark has walked staging end-to-end and approved before any production change

## 13. Needs Mark (during build)

- One-sentence reviewer credential line for E-E-A-T bylines (§6)
- Any field-observation notes worth adding to question pages (optional, additive)
