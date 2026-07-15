# Paper defects found during W5 review — for Mark

Surfaced by the adversarial citation-refuter agents while reviewing the W5 question pages (2026-07-15). These are **internal contradictions in the RB research corpus itself**, not page errors. The new pages were softened on-page to avoid inheriting them, but the source papers should be corrected — the corpus is the site's authority base, the AI ask-box quotes it directly, and the citability tables (W2) point readers straight at these sections.

None is urgent or safety-critical. Priority is "next time the papers are edited."

---

## 1. RB-012 — "only 304 SS and copper" contradicts the same paper's 430 SS rating

- **§4.2 (line 829):** "304 stainless steel and copper are the **only** common hood materials that are unconditionally safe for all source types at all mounting heights including 18 inches."
- **Contradicted by §3.4.3 (line 662):** "304 and 430 stainless steel are suitable at all mounting heights for all source types. … Stainless steel is the universal safe choice."
- **And Table 3.11 (line 652):** the 430 Stainless Steel row lists 18 in for every source column.

**The problem:** §4.2's "only" excludes 430 SS, which §3.4.3 and Table 3.11 rate as equally safe. A reader (or the AI) citing §4.2 understates the safe-material options.

**Suggested corpus fix:** strike "only," or rephrase §4.2 to "304 stainless steel, 430 stainless steel, and copper are unconditionally safe…" to match §3.4.3 and Table 3.11.

---

## 2. RB-002 (and RB-005) — stated K = 1.70 does not match the tabulated widths (~1.38)

- **§3.6 (line 512):** "W_rec … Equal to K_margin_outdoor · d_capture, using **K = 1.70**." Table 3.7 header (line 638) also states **K = 1.70**.
- **Contradicted by the tables themselves — Table 3.6b (line 536):** medium grill at 30 in → d_capture = 41 in, W_rec = 57 in. That ratio is **57 / 41 = 1.38**, not 1.70. (41 × 1.70 = 69.7 in, which appears nowhere in the tables.)
- **RB-005 shares the same defect** (it reuses the K-margin framing and the same width tables).

**The problem:** the prose/headers claim a 1.70 margin factor, but the recommended widths are tabulated at ~1.38·d_capture. Anyone who applies the stated K=1.70 to a capture diameter gets a hood ~13 in wider than the paper's own recommended table value. This is the one most likely to cause a real sizing discrepancy if a reader trusts the formula over the table.

**Suggested corpus fix:** decide which is authoritative — if the tables are right, correct K to ~1.38 (or state the true per-row ratios); if 1.70 is the intended margin, regenerate the W_rec columns. Then make §3.6, the Table 3.7 header, and the RB-005 copy consistent. The instruments/physics modules currently follow the **tables** (the site's numbers are table-derived and internally consistent), so correcting the papers toward the tables would require no code change; correcting toward K=1.70 would require re-verifying every instrument and the W2 tables.

---

*Compiled by the review coordinator. Exact lines are from the branch `w5-question-pages` copies of the papers, which are unchanged from production. See `.superpowers/sdd/task-w5qp-fix2-report.md` for the reviewer's raw findings.*
