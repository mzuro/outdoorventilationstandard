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

- [ ] **UX P0-1 Mobile disclosure nav** — at 375px only "2.0 Questions" is visible; Research/Standard/About/Search off-screen with no hamburger. Disclosure menu below ~640px in clause-numbered standards voice. (M)
- [ ] **UX P0-2 Sticky mobile readout strip (W5-T2)** — instrument stacks ~2 viewports tall; control changes update readouts/verdicts off-screen. Pin a one-line readout+grade strip to viewport bottom while an instrument is in view. Same values, no new physics. (M)
- [ ] **UX P1-1/2/3 Signifier pass (W5-T3)** — visible drag handles (touch gets none today), "Try:" label + larger type on preset chips, verdict threshold explanation on-surface instead of `title` tooltip, defuse "PASS reads as product certification". One coordinated pass. (M)
- [x] **KW on-page fixes (8)** — title/meta/H1 rewrites so pages speak query language; mounting-height and cfm-calculator first; add purpose-built `description` front matter to question pages (currently 280–400-char fallback summaries). Standards voice, no stuffing. (S) — **Done 2026-07-15** on `w5-keyword-onpage`: 9 files (6 question pages + questions index + cfm-calculator + capture-demonstrator), titles + 140–160-char descriptions, all numbers verified against page bodies; body-H2 suggestions from report §4 deliberately not taken (front-matter-only scope). See `.superpowers/sdd/task-w5kw-report.md`.

## P1 — next cycles

- [ ] **i02 rated-CFM comparison input** (UX P1-4; also the deferred F2 verdict item) — optional "your hood's rated CFM" input graded against computed requirement. Pure comparison; neutrality intact.
- [ ] **Contractor wayfinding** (UX P1-5) — sticky clause TOC on research pages (design spec §4 promised it; currently `position: static`), print stylesheet, copy-spec affordance.
- [x] **New question pages** from keyword gaps, physics-supported: G1 indoor-vs-outdoor difference, G2 hood size for grill size, G3 clearance to combustibles, G4 ducting (scoped), G6 grease deposition. Proven question-page format, instrument embeds per report §4. — **Done 2026-07-15** on `w5-question-pages`: 5 pages in content/questions/ (G1 i08, G2 i05 preset wall-48, G3 i09, G4 no instrument per report, G6 i10); **G3 is draft-gated** (`draft: true`, YMYL fire-safety — publishes only after Mark's review, same gate as the W4 trio; it also links the draft W4 safety page, so ship the trio first or together). Tool-page related_questions backlinks added (indoor-vs-outdoor, hood-geometry, plume-width, heat-release, grease-deposition). See `.superpowers/sdd/task-w5qp-report.md`.
- [ ] **G5 spec-literacy page** — NEEDS MARK's editorial call first.

## P2 — polish

- UX report P2 list (see report §5): homepage hero real estate, 404/search polish, footer affordances, misc.

## Gated on Mark (not agent-actionable)

- **W4 covered-patio trio publish** — keyword strategy's single biggest opportunity; pages written, `draft: true`, awaiting Mark's review (7 flagged CO/field items in `.superpowers/sdd/task-w4-report.md`).
- **G3 clearance page publish checklist** (from W5 fix pass, `.superpowers/sdd/task-w5qp-fix-report.md`): when Mark approves G3 (hood-clearance-to-combustibles), flip BOTH `draft: false` AND `reviewed: true` (reviewed is deliberately false until the review happens), ship the W4 trio first or together (G3 body-links is-it-safe), and add the deferred reciprocal body link from the published mounting-height page to G3 (cannot be added earlier — question-page body links are not draft-gated).
- **G6 grease page YMYL classification ratify** — W5 review flagged the fire section; fix pass kept G6 published with the fire section scoped to paper-attributed physics (BACKLOG rule 4 gates only G3 in the recorded W5 decision). Mark to ratify or draft-gate.
- GSC DNS TXT verification → then re-rank this backlog against real query data (keyword report §7.1).
- Dataset CSV license choice; TURNSTILE_SECRET confirmation for /api/explain.

## Blocked pending new research papers (do not write around the evidence gap)

- Makeup air, duct/blower sizing beyond RB-008, cleaning schedules, corrosion/materials, quantitative CO. Real demand (keyword report §6) the current papers cannot honestly serve.
