# OVS v2.2 — Outdoor Range Hood Keyword Strategy

**Site:** https://outdoorventilationstandard.com · **Branch:** `v2.1-fun-physics-seo-ai` (read-only; no code changes in this deliverable)
**Date:** 2026-07-14 · **Directive:** "Focus on outdoor range hood keywords."
**Companion doc:** `.superpowers/sdd/v21-seo-expert-report.md` (2026-07-12) — this report deepens its §4 content-gap sketch into a full keyword→page map with SERP evidence. Technical/schema/internal-linking recommendations live there (R1–R12) and are not repeated here.

> **Data honesty note.** No paid keyword tool (Ahrefs/Semrush) and no GSC data were available for this analysis (GSC DNS TXT verification still pending with Mark — see §7). **No search volumes in this report are measured numbers.** Clusters are ranked by qualitative intent-fit, SERP-evidence of demand (People-Also-Ask presence, autocomplete-style expansions, forum/retailer coverage density), and site-authority fit. Items that could not be verified against a live SERP are marked **[unverified — network]**. Re-rank everything against real GSC query data once the property verifies.

> **Binding constraints applied throughout.** Neutral research body: no brand names, no "best X"/review/buying-guide pages, no product recommendations. Commercial-intent keywords are mapped in §3 for completeness but are **off-limits as page targets**; only their honest informational adjacents are actionable. Every proposed page must be answerable from RB-001–012 or flagged to the "needs Mark / needs research" list (§6).

---

## 1. Existing asset inventory (what can already rank)

Title tag pattern: `{{ .Title }} · Outdoor Ventilation Standard`. Meta description = front-matter `description`, else `summary` (question pages use their answer summary — good, though several run long; see §4).

### 1.1 Question pages (6 live, 3 draft) — `content/questions/`
| File | Title (= H1 = title tag) | Status |
|---|---|---|
| what-cfm-do-i-need.md | What CFM does my outdoor kitchen hood need? | live |
| does-wind-affect-my-hood.md | Does wind really affect an outdoor range hood? | live |
| island-vs-wall-hood.md | Island or wall-mounted outdoor hood — which works better? | live |
| hood-depth-and-overhang.md | How much overhang does an outdoor hood need? | live |
| do-side-panels-work.md | Do side panels actually help an outdoor hood? | live |
| mounting-height.md | How high should an outdoor hood be mounted? | live |
| is-it-safe-to-grill-under-a-covered-patio.md | Is it safe to grill under a covered patio? | **draft** (pending Mark) |
| hood-under-covered-patio.md | Can I use an outdoor range hood under a covered patio? | **draft** (pending Mark) |
| does-a-covered-outdoor-kitchen-need-a-hood.md | Does a covered outdoor kitchen need a range hood? | **draft** (pending Mark) |

### 1.2 Tool pages (11) — `content/tools/`
Capture Demonstrator · CFM Sizing Calculator · Plume Width by Height · Wind Deflection Trajectories · Hood Geometry Comparison · Velocity Decay Curves · Side Panel Effectiveness · Indoor vs. Outdoor Comparison · Heat Release Rate Comparison · Grease Aerosol Deposition Pattern · Failure Mode Taxonomy.

### 1.3 Research papers (12) — `content/research/` (RB-001–012)
Plume behavior · entrainment/spread · velocity decay/capture · indoor-vs-outdoor assumptions · hood geometry · wind/cross-flow · failure modes · CFM requirements · side panels/baffles · standards gaps · grease aerosol · thermal radiation.

**Evidence base ceiling (governs §5/§6):** the papers cover plume physics, geometry, wind, CFM, side panels, grease transport, thermal radiation, and standards gaps. They do **not** cover: duct/blower system design (named only as RB-008 downstream), makeup air, CO generation/accumulation dosimetry, electrical/GFCI, corrosion/materials durability testing, cost, or any product-level data.

---

## 2. Query-space research method & SERP findings

**Method.** Live web searches (2026-07-14) on seed terms and modifier expansions: "outdoor range hood", "outdoor kitchen ventilation requirements", "outdoor range hood CFM", "outdoor kitchen vent hood height above grill", "is it safe to grill under a covered patio", "BBQ island vent hood / do I need one", "what size outdoor range hood for 36 inch grill", "indoor range hood outside / outdoor rated difference", "outdoor kitchen hood ductless vs ducted", plus further passes below. Search-result composition (who ranks, what formats) is directly observed; PAA boxes and autocomplete could not be scraped verbatim, so "PAA-style" sub-questions are inferred from the answer-box content and article H2s of ranking pages and are labeled as such. **No volume numbers anywhere** (no tool access) — ranking is qualitative.

### 2.1 Who owns these SERPs today

| Query family | Observed SERP composition | Format that wins |
|---|---|---|
| "outdoor range hood" (head) | ~100% retailer category pages (The Range Hood Store, ZLINE, Proline, Broan-NuTone, BBQGuys, Victory, Grillio, regional appliance dealers) | Commerce grids. Transactional-dominant — **not winnable and off-charter as a page target**; site can only intercept its informational sub-intents. |
| "outdoor kitchen ventilation requirements" | Vendor content-marketing blogs: RTA Outdoor Living, BBQGuys buying guides, Urban Man Caves, Riviera Outdoor Decor, a Weber PDF | Listicle/guide prose, some FAQ. **Every ranking page is a seller.** No neutral/standards source ranks. |
| "outdoor range hood CFM" | Retailer blogs (Proline "CFM Calculator" post, Hauslane, FOTILE, World Coppersmith, Broan) — mostly **indoor**-oriented CFM articles adapted loosely | Rule-of-thumb prose ("1 CFM per 100 BTU") + crude calculators. Physics is thin; numbers conflict across sources (1,000 vs 1,200 CFM minimums asserted without derivation). |
| "vent hood height above grill" | Proline blog, BBQGuys FAQ, appliance-dealer blogs, outdoor-kitchen builders (Fuse, Cunningham) | Short prose ranges; sources visibly **contradict each other** (30–36", 36–42", "max 36"", "36 above countertop") with no physical justification. |
| "grill under covered patio" | Patio-cover builders (H3 Outdoor, D&C Fence), pergola sellers (Bon Pergola, F&J Outdoors), Proline "canopy" post, regional propane dealer | Safety-checklist prose. YMYL topic being answered by fence companies. Thin, unsourced, liability-hedged. |
| "what size outdoor hood for 36-inch grill" | Retailer collection pages (36-inch outdoor hood categories) + Proline sizing guide | Size-lookup prose ("42-inch hood for 36-inch grill, +6 in/side outdoors"). Simple rule quoted everywhere, never derived. |
| "ducted vs ductless range hood" | KitchenAid, Bob Vila, FOTILE, appliance dealers — **all indoor-framed**; no outdoor-specific ducted/ductless page ranks | Comparison prose. Outdoor angle (recirculating makes no sense outdoors; when is ducting even needed under a roof?) is unserved. |
| "indoor hood outdoors / outdoor rated difference" | Proline buyer's guide, Wayfair category, RTA "top 7 brands", Consumer Reports (indoor) | Buyer's-guide prose. The *physics* difference (open-boundary capture, no ceiling/walls — the site's RB-004 thesis) appears nowhere; ranking pages talk only 304-vs-430 steel and CFM assertions. |

### 2.2 The structural opening

Three consistent observations across every SERP examined:

1. **Zero neutral sources.** Every ranking page in the outdoor-hood query space is a retailer, a manufacturer, or an outdoor-kitchen builder. There is no NIST/ASHRAE/UL consumer-facing page, no university extension page, no independent research body. OVS is structurally alone in its class.
2. **Numbers without derivation, and they conflict.** Mounting height ranges disagree (30–36 vs 36–42 vs "max 36"), CFM minimums disagree (1,000 vs 1,200), the +6-inch overhang rule is quoted but never justified. A site that *derives* its numbers from published physics and shows the sensitivity (instruments) can honestly say what no competitor can: "here is why, and here is when the rule breaks."
3. **The site's core thesis is an unserved query answer.** "Why is outdoor ventilation different / can I use an indoor hood outside" is answered everywhere with materials talk (steel grades) and nowhere with capture physics. RB-004 + the indoor-vs-outdoor comparison tool are a differentiated answer with no direct competitor.

**AI-surface implication** (per v21 report §1.7): these conflicting-retailer SERPs are exactly where AI Overviews look for a citable, self-consistent, non-commercial source. Answer-first summaries + IEEE citations position OVS as the reconciling citation even where it doesn't win the blue link.

---

## 3. Keyword cluster → intent map

Fifteen clusters, ordered roughly by qualitative demand signal (SERP coverage density + PAA-style presence). Volumes intentionally absent (see data-honesty note). "Rep. queries" = representative phrasings observed in ranking titles/H2s and answer boxes.

| # | Cluster | Rep. queries | Intent | Site status |
|---|---|---|---|---|
| C1 | **Do I need one? (covered/roofed)** | do I need a vent hood for my outdoor kitchen · does a covered outdoor kitchen need ventilation · outdoor kitchen ventilation requirements | Informational, top-of-funnel, partially YMYL | **3 draft pages pending Mark** — biggest blocked asset |
| C2 | **Covered patio / pergola / screened porch safety** | is it safe to grill under a covered patio · can you grill under a pergola / screened porch / canopy | Informational, YMYL | Same draft trio; porch/pergola phrasings unserved as sections |
| C3 | **CFM sizing** | outdoor range hood CFM · how many CFM for outdoor kitchen hood · 1 CFM per 100 BTU · is 1200 CFM enough | Informational + spec-education | **Live + tool** (what-cfm + cfm-calculator) |
| C4 | **Mounting height** | how high should a vent hood be above a grill · outdoor range hood mounting height · hood distance from grill surface | Informational | **Live** (mounting-height) — title misses "grill"/"above" language |
| C5 | **Hood size / width for grill X** | what size vent hood for 36 inch grill · hood 6 inches wider than grill · 42 inch hood for 36 inch grill | Informational with commercial adjacency | **Gap** — overhang page is close but width-for-grill phrasing untargeted |
| C6 | **Overhang / coverage** | how far should hood extend past grill · hood overhang requirement | Informational | **Live** (hood-depth-and-overhang) |
| C7 | **Indoor vs outdoor hood** | can I use an indoor range hood outside · what makes a range hood outdoor rated · outdoor vs indoor range hood difference | Informational, high thesis-fit | **Gap as question page** (tool + RB-004 exist; no query-shaped page) |
| C8 | **Wind performance** | wind blowing smoke away from hood · outdoor hood doesn't work when windy · grilling in wind smoke everywhere | Informational, problem-solving | **Live + tool** (does-wind + wind-deflection) |
| C9 | **Island vs wall** | island vent hood vs wall mount outdoor · BBQ island vent hood | Informational | **Live** (island-vs-wall) |
| C10 | **Side panels / wind guards** | do side panels help outdoor hood · wind guard for outdoor kitchen hood · hood backstop sidewalls | Informational | **Live + tool** (do-side-panels) |
| C11 | **Clearance to combustibles / ceiling** | vent hood clearance to wood ceiling · grill clearance under pergola roof · 72 inch ceiling rule · IMC hood clearance | Informational, YMYL, code-flavored | **Gap** — strong fit to RB-012/RB-003 + citable codes (IMC 507.2.6 observed ranking) |
| C12 | **Ducting / venting path** | does an outdoor vent hood need to be ducted · outdoor kitchen hood venting options · duct through patio roof · ducted vs ductless outdoor | Informational | **Gap** — SERP is 100% indoor-framed; papers only partially support (see §6) |
| C13 | **Grease / maintenance** | outdoor range hood grease · where does grill grease go · clean outdoor hood baffle filters how often | Informational | **Partial gap** — RB-011 supports deposition physics, not cleaning schedules (§6) |
| C14 | **CO / air quality under cover** | carbon monoxide grill covered patio · CO buildup outdoor kitchen | Informational, hard YMYL | **Blocked** — needs evidence base (W4 CO items; §6) |
| C15 | **Commercial cluster — OFF-LIMITS as targets** | best outdoor range hood · outdoor range hood reviews · [brand] vs [brand] · outdoor range hood 42 inch [shopping] · cheap/discount outdoor vent hood | Transactional / commercial-investigation | **Never target.** Interception strategy below. |

### 3.1 C15 interception map (honest adjacents only)

The commercial SERP ("best outdoor range hood" = Consumer Reports (indoor), retailer listicles, brand collections) contains embedded informational sub-intents the site may legitimately answer *as physics/spec education, never as recommendations*:

| Embedded sub-intent inside commercial queries | Honest informational intercept |
|---|---|
| "which one is powerful enough for me" | C3 CFM page + calculator ("size it before you shop") |
| "what size do I buy" | C5 width-for-grill page |
| "what specs actually matter / what to look for" | Proposed spec-literacy page (§5, G5): which *specifications* determine capture performance — width, mount type, overhang, CFM at exposure class — with explicit "this site does not recommend products" framing |
| "is an expensive outdoor-rated one worth it / can I use indoor" | C7 indoor-vs-outdoor physics page |
| "reviews say 1200 CFM — true?" | C3's derivation shows *when* 1,200 CFM is and isn't sufficient |

Rule: intercept pages must never rank-bait with "best/top/review" in titles, must not name brands, and must answer the physics question a shopper *should* ask. This is both the charter and, per §2.2, the differentiation.

---

## 4. Existing-page keyword mapping + on-page fixes

General note: question pages have no `description` front matter, so the meta description falls back to `summary`, which runs 280–400 chars (truncates ~155–165). The summaries front-load numbers well, so truncation is survivable — but each fix below includes an optional purpose-built `description` ≤160 chars. H1 = `title` = title tag (pattern `{{title}} · Outdoor Ventilation Standard`), so one string change updates all three. All rewrites keep the standards voice: natural-language questions, no keyword stuffing, no superlatives.

### 4.1 Question pages

| Page | Current title | Verdict + proposed fix |
|---|---|---|
| `what-cfm-do-i-need.md` | What CFM does my outdoor kitchen hood need? | **Good — keep.** Matches "outdoor kitchen hood CFM" phrasing. Optional description: "A 48-inch wall hood over a 60,000 BTU grill needs 1,200 CFM minimum, 1,500 recommended; the same hood on an island needs about 20% more. Derived from RB-008." (~150 chars, front-loads the answer.) |
| `mounting-height.md` | How high should an outdoor hood be mounted? | **Highest-value rewrite.** Observed query language is "above the grill" + "range hood"; SERP numbers conflict (30–36 vs 36–42 vs "max 36"), so an exact-phrasing, derived answer can win. Proposed: **"How high should an outdoor range hood be above the grill?"** Description: lead with the velocity-decay-derived height band and the "why higher = worse capture" clause. |
| `island-vs-wall-hood.md` | Island or wall-mounted outdoor hood — which works better? | **Minor.** Add "range": **"Island or wall-mounted outdoor range hood — which works better?"** Body/H2s should carry "BBQ island vent hood" once naturally (C9's common phrasing) — e.g. an H2 "Why a BBQ-island vent hood needs more airflow". |
| `hood-depth-and-overhang.md` | How much overhang does an outdoor hood need? | **Minor.** Searchers phrase it "extend past/beyond the grill". Proposed: **"How far should an outdoor hood extend past the grill?"** (keeps one intent; "overhang" stays in body + description). This also intercepts the ubiquitous-but-underived "+6 inches per side" retail rule — the page can show where that rule comes from and when it fails. |
| `do-side-panels-work.md` | Do side panels actually help an outdoor hood? | **Minor.** Add wind language to description ("wind guard / crosswind" phrasings from C10): side panels are the site's answer to "hood useless when windy". Consider one H2 that says "wind guard" naturally. |
| `does-wind-affect-my-hood.md` | Does wind really affect an outdoor range hood? | **Good — keep.** Consider a body H2 matching the problem-phrasing "why smoke escapes on a breezy day" (C8 queries are symptom-first, not concept-first). |
| Covered-patio trio (3 drafts) | (titles already match C1/C2 query language well) | **No rewrite needed — ship them** (P0, pending Mark). Add pergola + screened-porch H2s/FAQ entries inside `is-it-safe-to-grill-under-a-covered-patio.md` rather than new pages (near-duplicate risk; v21 §7 anti-permutation rule). |
| `questions/_index.md` | Questions | **Minor:** "Outdoor Range Hood Questions" (or "Questions about outdoor range hoods") — the list page can carry the head-adjacent phrase the site never uses as a standalone target. |

### 4.2 Tool pages

Tool titles are instrument-named (correct for a research body), but two are query-adjacent enough to earn query-bearing titles without losing the voice:

| Page | Current | Proposed |
|---|---|---|
| `cfm-calculator.md` | CFM Sizing Calculator | **"Outdoor Range Hood CFM Calculator"** — the query "outdoor range hood cfm calculator" is served today only by a retailer blog post (Proline). Exact-match, honest, and it is literally what the tool is. Highest-value tool rename. |
| `capture-demonstrator.md` | Capture Demonstrator | Keep name, but description should contain "outdoor range hood" once (currently neither title nor description says what appliance this is about). |
| Others (velocity decay, plume width, etc.) | — | Keep instrument names; verify each description carries "outdoor" + hood/ventilation naturally (most already do). No further renames — stuffing "outdoor range hood" into 11 tool titles would read as manipulation. |

### 4.3 Research papers

No title changes — RB papers are the citation layer, not the query layer. Per v21 R9, their section-leading answer sentences are the AIO-consumable surface; the question pages do the query matching.

---

## 5. Gap pages — proposed new question pages

Six proposals, all in the proven question-page format (answer-first summary, `reviewed: true`, IEEE citations, embedded instrument). Each states what the papers can honestly support and its limits. Cadence cap per v21 (≤2/month, never batch-generated) applies.

### G1 — "Can I use an indoor range hood outside?" (C7)
- **Cluster:** can I use an indoor range hood outside · outdoor vs indoor range hood difference · what makes a hood outdoor rated.
- **Supportable answer:** the *performance* difference is physics, not just steel grade: outdoors there is no ceiling redirection, no wall confinement, no pressure-assisted capture — an indoor-spec hood loses its three free capture mechanisms (RB-004 quantifies each), which is why indoor CFM rules (1 CFM/100 BTU — quoted all over the C3 SERP) undersize outdoor installs by large factors (RB-008). Thermal loading at hood surfaces is also higher over grills (RB-012).
- **Instrument:** indoor-vs-outdoor comparison (existing tool, currently orphaned from questions).
- **Honest limits:** corrosion/weatherproofing (304 vs 430 steel, sealed motors, UL listing for wet locations) is *not* in the papers — the page must say "durability and electrical rating are manufacturer/listing matters outside this program's scope" and stick to capture physics. That sentence itself builds trust.
- **Why this first among gaps:** highest thesis-fit; every competitor answers it with materials talk; the physics answer is unserved (§2.2-3).

### G2 — "What size outdoor range hood do I need for my grill?" (C5)
- **Cluster:** what size vent hood for a 36-inch grill · hood wider than grill · what size outdoor range hood.
- **Supportable answer:** plume is already ~28 in wide at the surface and ~34.6 in at a 30-in mount (RB-002/RB-005 numbers already used on the overhang page) → derive the width table for common grill widths against the standard hood width steps (42/48/54/60/72), wall vs island. Explains — rather than asserts — the retail "+6 in per side" rule and shows when it's insufficient (island, wind).
- **Instrument:** plume-width-by-height (existing tool) with a width preset; or hood-geometry comparison.
- **Honest limits:** commercial adjacency is high — the page sizes a *specification*, never suggests where to buy. No brand, no price, no "we recommend model…". Width steps are stated as "commonly manufactured widths", not as any maker's lineup.
- **Overlap control:** one intent per page — this page owns *width selection*; the overhang page owns *front-to-back coverage*. Cross-link, don't merge.

### G3 — "How much clearance does an outdoor hood need?" (C11)
- **Cluster:** vent hood clearance to wood ceiling/pergola · grill clearance to combustibles · how close can a hood be to the roof.
- **Supportable answer:** two-sided clearance question: below (mounting height band, RB-003 velocity decay — already on the site) and above/around (hood surface equilibrium temperatures and radiant flux by fuel type, RB-012), plus what IMC 507 / NFPA 96-style clearances assume and why residential-outdoor sits in a standards gap (RB-010). The observed SERP mixes chimney-flue rules, commercial Type-I rules, and grill-manual folklore — a derived, source-separated answer wins.
- **Instrument:** heat-release-rate comparison or a RB-012 surface-temperature figure.
- **Honest limits:** YMYL — the page must present code numbers as *citations to the codes*, not OVS-issued clearances, state that local code + the appliance manual govern, and avoid any "safe distance" guarantee. Same evidentiary bar as the covered-patio trio.

### G4 — "Does an outdoor range hood need a duct?" (C12, scoped)
- **Cluster:** does an outdoor vent hood have to be ducted · outdoor kitchen hood venting options · ductless outdoor.
- **Supportable answer (narrow):** recirculating ("ductless") capture defeats the purpose outdoors — the pollutant sink is the open atmosphere, so the hood's job is to move the plume *outside the occupied/covered volume*; discharging under the same roof re-entrains (RB-002 entrainment + RB-004 boundary analysis). Open-eave installs may discharge directly; roofed installs need a path out.
- **Honest limits:** duct *sizing* (diameter, length, elbows, static pressure, blower curves) is **not** in the papers — RB-008 names it as downstream work. Page ships with an explicit scope box ("duct sizing is future RB work") and the sizing half goes to §6. Do not fake it; the C12 SERP is 100% indoor-framed, so even the scoped answer is differentiated.

### G5 — "Which specifications determine outdoor hood performance?" (C15 intercept)
- **Cluster:** what to look for in an outdoor range hood · outdoor range hood specs explained (the informational core of "best/buying guide" queries).
- **Supportable answer:** a spec-literacy page: the four load-bearing numbers (width vs plume, mount type, overhang, CFM at your exposure class) and the numbers that *don't* determine capture (depth alone, per RB-008 §3.4.3; sones; steel gauge) — everything already derived on-site, assembled for a reader arriving with shopping intent.
- **Honest limits:** the tightest neutrality wire on the list. Framing must be explicit: "This page explains how to read a specification sheet. This program does not test, rank, or recommend products." No brand, no "best", no price. If it can't be written to that bar, drop it — G1+G2+C3 already intercept most of this intent.
- **Risk note:** flagged for Mark's editorial call before drafting (per draft-only/editorial-team decisions in the OVS program).

### G6 — "Where does the grease from an outdoor grill hood go?" (C13, physics half)
- **Cluster:** outdoor range hood grease · grease on patio/ceiling around grill · do outdoor hoods stop grease.
- **Supportable answer:** RB-011 end-to-end — particle size distribution, what the hood captures vs what deposits in the missed-plume region, deposition zones and fire/health relevance. Instrument: grease-aerosol-deposition (existing, orphaned).
- **Honest limits:** cleaning frequency/methods (the highest-volume phrasing in this cluster) is not paper-supported → §6. Page targets the "where/why" intent only.
- **Priority note:** weakest demand signal of the six (SERP is indoor-cleaning-dominated); P2.

**Not proposed as pages** (near-duplicate/permutation risk per v21 §7): per-structure variants (pergola/screened-porch/lanai as standalone URLs — fold into the trio as H2s/FAQ), per-width pages ("42-inch outdoor hood" etc. — pure commercial), per-BTU pages, regional/code-by-state pages.

---

## 6. Needs-Mark / needs-research list

Clusters with real demand the current evidence base cannot honestly serve. Do not draft these until the listed dependency clears.

| Item | Blocked cluster | Dependency |
|---|---|---|
| **CO under covered structures** (C14) | carbon monoxide + grill/patio queries — the highest-authority YMYL opportunity on the map (v21 §4 agrees) | Needs CO generation/accumulation evidence base (the W4 CO items). Combustion dosimetry is outside RB-001–012. Candidate future RB paper; Mark decision. |
| **Duct/blower sizing** (C12 sizing half) | duct diameter/length/elbows for outdoor hoods, static pressure, roof vs wall termination | RB-008 downstream work — needs a new paper + probably a duct-sizing instrument. High demand signal; strong future tool. |
| **Makeup air** (semi-enclosed outdoor kitchens) | makeup air outdoor kitchen | Not covered by any RB paper; code-driven; needs research before any claim. |
| **Cleaning/maintenance schedules** (C13 how-often half) | how often to clean outdoor hood filters | No paper basis for frequency claims; would be unsourced lifestyle advice. Only pursue if a grease-loading model is ever derived from RB-011. |
| **Corrosion/materials durability** (part of C7) | 304 vs 430, sealed motors, wet-location listing | Manufacturer/UL-listing territory; G1 explicitly scopes it out. Only pursue as a standards-gap survey (RB-010 style), not as guidance. |
| **Noise (sones) outdoors** | how loud is a 1200 CFM hood | No paper basis; weak fit; likely never. |
| **3 draft pages ship decision** | C1/C2 (the whole covered-patio cluster) | **Mark's approval of the existing drafts** — not a research gap; the single highest-leverage pending action. |

---

## 7. Prioritized roadmap (P0/P1/P2)

Ranked by intent-fit × site-authority-fit ÷ effort, honoring the ≤2 new pages/month cadence. "Fix" = front-matter/title/description edit only.

### P0 — now (all low-effort or already written)
1. **Ship the covered-patio trio** (pending Mark). Three finished YMYL pages covering C1+C2 — the largest unserved demand on the map, SERP currently held by fence and pergola vendors. Nothing else on this list moves the needle as much per unit effort.
2. **Fix: mounting-height title** → "How high should an outdoor range hood be above the grill?" (C4 — conflicting-SERP opportunity).
3. **Fix: cfm-calculator title** → "Outdoor Range Hood CFM Calculator" (only non-retailer answer to an exact-match tool query).
4. **Fix batch: remaining §4 title/description edits** (island-vs-wall "+range", overhang rephrase, questions index, purpose-built descriptions). One PR, ~1 hour.
5. **Enabler: GSC verification** (DNS TXT with Mark — v21 R8). Every ranking claim in this report is currently unmeasurable.

### P1 — next (new pages, 1–2/month)
6. **G1 indoor-vs-outdoor question page** (C7) — thesis page, fully evidenced, tool exists.
7. **G2 hood-size-for-grill question page** (C5) — highest commercial-adjacent demand that can be served honestly.
8. **G3 clearance question page** (C11) — YMYL authority builder, pairs with the shipped trio.

### P2 — later / conditional
9. **G4 duct question page (scoped)** (C12) — ship narrow version; upgrade when duct-sizing RB work exists.
10. **G5 spec-literacy page** (C15 intercept) — pending Mark's editorial call on framing.
11. **G6 grease deposition page** (C13) — weakest demand signal; also rescues an orphaned tool.
12. **Duct-sizing paper + instrument** (from §6) — the biggest *future* tool opportunity; re-scope after GSC data.

### 7.1 What GSC unlocks (re-rank trigger)
GSC is not connected (DNS TXT pending with Mark). Once verified and ~4 weeks of data exist:
- **Replace this report's qualitative ranking** with impression-weighted cluster ranking; the C-numbers above are designed to be re-scored against real queries.
- **Validate/refute the title rewrites** (P0-2/3/4): compare pre/post CTR and query-match on the edited pages; revert any rewrite that loses impressions.
- **Discover the phrasings this report can't see** (autocomplete/PAA were not scrapable): actual query strings will arbitrate e.g. "vent hood" vs "range hood" vs "exhaust hood" weighting per page — the map above deliberately spreads variants across pages rather than guessing a winner.
- **Decide G5 and G6** on evidence: if commercial-adjacent impressions ("what size…", "specs…") show up on existing pages, G2/G5 rise; if grease queries never appear, G6 drops.
- **Detect AIO citation traffic** (Performance → position/CTR anomalies) to test the §2.2 AI-surface hypothesis.

### 7.2 Standing constraints (unchanged, binding)
No brand mentions or hints; no best/review/buying-guide targets; one intent per page; every number cites an RB paper or a named external standard; drafts remain drafts until Mark approves; ≤2 new pages/month; nothing in this report requires content the evidence base lacks — blocked items live in §6, not the roadmap.

---

*End of report. Prepared 2026-07-14 against branch `v2.1-fun-physics-seo-ai`; no code changes made.*
