# OVS Improvement Backlog (v2.2+)

Living work queue for the automated improvement loop. Sources: `docs/superpowers/reports/v22-ux-expert-report.md` (UX audit, 2026-07-14) and `docs/superpowers/reports/v22-keyword-strategy.md` (keyword strategy, 2026-07-14). Earlier expert reports (v21 SEO/AI) are fully implemented as of v2.1.

## Standing rules (every cycle, non-negotiable)

1. Pipeline: implement → adversarial review → fix → re-review. Nothing merges unapproved.
2. Physics truthfulness: every published number traces to `static/js/ovs/physics/*.mjs` or an RB paper; citations grep-verified against paper text; model assumptions labeled as such.
3. Neutral research body: never name or hint at the commercial brand; no product recommendations; no "best/reviews" content.
4. Safety/YMYL content ships `draft: true` and publishes only after Mark's explicit review.
5. Production merges only after Mark's ship decision on a staging preview.
6. Don't regress the measured strengths: mobile time-to-answer 30–45s, answer-above-fold, keyboard/reduced-motion/dark parity, Lighthouse ≥95, CLS 0.

## P0 — current cycle

- [x] **UX P0-1 Mobile disclosure nav** — at 375px only "2.0 Questions" is visible; Research/Standard/About/Search off-screen with no hamburger. Disclosure menu below ~640px in clause-numbered standards voice. (M) — DONE 2026-07-15 (W5, commit 2aebfd8): "☰ 0.0 MENU" disclosure + "7.0 Search" permanent menu slot; no-JS keeps the scrollable strip; keyboard/Escape/CLS-0 verified at 375/1440 both themes. Report: `.superpowers/sdd/task-w5-report.md`. Review Approved (task-w5-review.md, incl. F1 stamp fix 757bc79).
- [x] **UX P0-2 Sticky mobile readout strip (W5-T2)** — instrument stacks ~2 viewports tall; control changes update readouts/verdicts off-screen. Pin a one-line readout+grade strip to viewport bottom while an instrument is in view. Same values, no new physics. (M) — DONE 2026-07-15 (W5, commit 24cd0f4): engine `spec.stickyReadout`, adopted by i01/i02/i03/i05/i07/i08; values copied verbatim from the live readouts (never recomputed), aria-hidden, IntersectionObserver-gated at ≤760px; mirror equality vs node physics verified through slider sweeps + preset taps.
- [x] **UX P1-1/2/3 Signifier pass (W5-T3)** — visible drag handles (touch gets none today), "Try:" label + larger type on preset chips, verdict threshold explanation on-surface instead of `title` tooltip, defuse "PASS reads as product certification". One coordinated pass. (M) — DONE 2026-07-15 (W5, commit 93f76f9): engine-drawn grip glyphs on all 7 drag affordances (+ once-per-session hint pulse, reduced-motion-skipped); TRY: label + 12.5px ink chips; stamp shows plain line + threshold line + "Grades apply to the model configuration, not to any product." footnote; CLS reserves re-calibrated to baseline parity. P1-7 (explain-button move) was NOT included — outside the W5 P0 batch scope.
- [x] **KW on-page fixes (8)** — title/meta/H1 rewrites so pages speak query language; mounting-height and cfm-calculator first; add purpose-built `description` front matter to question pages (currently 280–400-char fallback summaries). Standards voice, no stuffing. (S) — **Done 2026-07-15** on `w5-keyword-onpage`: 9 files (6 question pages + questions index + cfm-calculator + capture-demonstrator), titles + 140–160-char descriptions, all numbers verified against page bodies; body-H2 suggestions from report §4 deliberately not taken (front-matter-only scope). See `.superpowers/sdd/task-w5kw-report.md`. Review Approved, merged PR #6.
- [ ] **Body-H2 phrasing pass + stale anchors** (from KW review minors): keyword report §4 body-H2 suggestions ("BBQ island vent hood" etc.) applied judiciously to body prose; fix 3 stale "CFM Sizing Calculator" anchor texts; get "wind guard" phrasing into the side-panels body (currently meta-only). (S)
- [ ] **Stamp collision 641–745px band** (UX review O8): the widened stamps (long threshold clause) collide by ~38px in the 641–745px window on i05 — extend the compact-stamp block to ≤760px (matching the strip breakpoint) or cap `--small` stamp width. (S)

## P1 — next cycles

- [ ] **i02 rated-CFM comparison input** (UX P1-4; also the deferred F2 verdict item) — optional "your hood's rated CFM" input graded against computed requirement. Pure comparison; neutrality intact.
- [ ] **Contractor wayfinding** (UX P1-5) — sticky clause TOC on research pages (design spec §4 promised it; currently `position: static`), print stylesheet, copy-spec affordance.
- [x] **New question pages** from keyword gaps, physics-supported: G1 indoor-vs-outdoor difference, G2 hood size for grill size, G3 clearance to combustibles, G4 ducting (scoped), G6 grease deposition. Proven question-page format, instrument embeds per report §4. — **Done 2026-07-15** on `w5-question-pages`: 5 pages in content/questions/ (G1 i08, G2 i05 preset wall-48, G3 i09, G4 no instrument per report, G6 i10); **G3 and G6 are draft-gated** (`draft: true`, YMYL fire-safety — publish only after Mark's review, same gate as the W4 trio; G3 also links the draft W4 safety page, so ship the trio first or together; G6 gated in W5 review2 — see Gated-on-Mark checklist). Tool-page related_questions backlinks added (indoor-vs-outdoor, hood-geometry, plume-width, heat-release, grease-deposition). See `.superpowers/sdd/task-w5qp-report.md`.
- [ ] **G5 spec-literacy page** — NEEDS MARK's editorial call first.

## P2 — polish

- UX report P2 list (see report §5): homepage hero real estate, 404/search polish, footer affordances, misc.

## Gated on Mark (not agent-actionable)

- **W4 covered-patio trio publish** — keyword strategy's single biggest opportunity; pages written, `draft: true`, awaiting Mark's review (7 flagged CO/field items in `.superpowers/sdd/task-w4-report.md`).
- **G3 clearance page publish checklist** (from W5 fix pass, `.superpowers/sdd/task-w5qp-fix-report.md`): when Mark approves G3 (hood-clearance-to-combustibles), flip BOTH `draft: false` AND `reviewed: true` (reviewed is deliberately false until the review happens), ship the W4 trio first or together (G3 body-links is-it-safe), and add the deferred reciprocal body link from the published mounting-height page to G3 (cannot be added earlier — question-page body links are not draft-gated).
- **G6 grease page publish checklist** (from W5 review2 pass, `.superpowers/sdd/task-w5qp-fix2-report.md`): coordinator decision — **G6 (where-does-grill-grease-go) is now draft-gated** (`draft: true`, `reviewed: false`), joining the safety-review cluster with G3 and the W4 trio. YMYL trigger = the fire-prevention cleaning-cadence language (dedicated fire H2 + prescriptive deck/filter cleaning cadences). **Mark's decision:** (a) keep the fire language → publish as safety guidance after your review; or (b) strip it to pure deposition physics → publish as a normal non-YMYL page. When approving, flip BOTH `draft: false` AND `reviewed: true` together, and uncomment the grease-aerosol-deposition tool's `related_questions` backlink to this page (commented out while drafted; theme uses `.Site.GetPage` so nothing 404s meanwhile).
- GSC DNS TXT verification → then re-rank this backlog against real query data (keyword report §7.1).
- Dataset CSV license choice; TURNSTILE_SECRET confirmation for /api/explain.

## Blocked pending new research papers (do not write around the evidence gap)

- Makeup air, duct/blower sizing beyond RB-008, cleaning schedules, corrosion/materials, quantitative CO. Real demand (keyword report §6) the current papers cannot honestly serve.

## W5 question-pages review — disposition (2026-07-15, pass 3)
Three workflow review passes (8 major → 2 major → 2 major). Pass-3 "majors" were BOTH the same stale-`public/` build artifact of the draft grease page (source is correctly draft:true; a `--cleanDestinationDir` build excludes it — verified; Cloudflare git-integration builds fresh server-side so neither staging nor prod ships it). No source defect. Pass-3 minors were reviewer-acknowledged non-defects (faithful-to-paper, site convention, honestly-disclosed model labeling) except: (a) FIXED — what-size description called 41" the "plume" (it's the capture diameter; body was already correct); (b) DEFERRED to Mark's safety review — clearance description is 138 chars (band 140-160), page is draft-gated for him anyway.
