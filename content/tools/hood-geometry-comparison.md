---
title: "Hood Geometry Comparison"
description: "Side-by-side comparison of three hood overhang configurations — no overhang, minimum geometry, and the recommended outdoor margin — over the same cooking source."
date: 2025-12-01
lastmod: 2026-07-15
reviewed: true
tags: ["hood design", "capture envelope", "visualization"]
categories: ["Tools"]
ShowToc: false
weight: 4
instrument_id: "i05"
related_questions:
  - "/questions/island-vs-wall-hood/"
  - "/questions/what-size-hood-for-my-grill/"
related_papers:
  - "/research/rb-005-hood-geometry-capture/"
  - "/research/rb-002-entrainment-lateral-plume-spread/"
---

This diagram compares three hood configurations over the same cooking source, showing why overhang — the distance the hood extends beyond the cooking surface — is the single most important design parameter for outdoor capture performance.

<div style="max-width: 960px; margin: 0 auto;">

<!-- The figure below is auto-embedded by tools/single.html from this
     page's `instrument_id` front matter; no shortcode call is needed
     here. Left in prose form as a note for anyone reading the source. -->

</div>

---

## Reference readings

*Representative values below are computed directly from the same capture-fraction module (`physics/capture.mjs`) driving the width-versus-mount comparison above, at a fixed 30-inch rise and an 8 mph crosswind — the live instrument's default; live values update as you move the width and wind controls.*

| Hood width | Wall mount | Island mount |
|---|---|---|
| 42″ | 95% | 46% |
| 48″ | 96% | 46% |
| 54″ | 96% | 46% |
| 60″ | 96% | 46% |
| 72″ | 96% | 46% |

At an 8 mph crosswind, widening the hood from 42 to 72 inches moves wall-mount capture only from 95% to 96%, and moves island-mount capture not at all — in this model, capture holds flat at 46% across the entire lineup. That is because width only buys lateral coverage; a crosswind pushes the plume off the hood's front-to-back axis [RB-006 §3.1], and no amount of extra width recovers axial capture lost to wind [RB-005 §2.2]. The 50-point gap between wall (96%) and island (46%) at the same width and wind speed is the wall-mount advantage RB-005 describes — rear-boundary redirection and Coanda wall attachment [RB-005 §3.4.4].

## Key Findings

The no-JS fallback diagram for this instrument compares three hood widths over the papers' reference source — a medium gas grill (24-inch cooking surface) at a 30-inch mounting height, where the plume capture diameter has grown to 41 inches [RB-002 Table 3.9]:

**No overhang.** A hood the same width as the cooking surface (24 inches) sits 17 inches inside the 41-inch plume — escape on both sides is guaranteed by geometry alone. Inadequate overhang is failure mode FM-1, which RB-010 finds present from the day of installation in consumer hoods paired with medium or larger sources [RB-010 Gap S-5].

**Minimum geometry (9-inch overhang per side).** Hood width equal to the plume capture diameter (W_min = d_capture, about a 42-inch hood here) corresponds to 98% time-averaged flux capture in quiescent conditions — but provides no margin for turbulence, wind, or instantaneous plume fluctuation [RB-005 §3.1, Table 3.1a].

**Recommended outdoor (17-inch overhang per side).** The base width-sizing margin K ≈ 1.38 from RB-002 (turbulent intermittency × puffing oscillations) yields a 57-inch recommended hood width for this source and height; wind-exposed and open sites scale up toward the wind-inclusive margin K = 1.70 per RB-002 §3.5 [RB-002 Table 3.7; RB-005 Table 3.1b].

## Design Priority

RB-005 established the hierarchy: **geometry precedes airflow**. No amount of exhaust CFM can capture plume gas that is physically beyond the hood's boundary. Overhang must be sized first; CFM is determined after geometry is set.

## Source Papers

- [RB-005: Hood Geometry and Capture](/research/rb-005-hood-geometry-capture/) — Complete geometric analysis
- [RB-002: Entrainment and Lateral Plume Spread](/research/rb-002-entrainment-lateral-plume-spread/) — Plume width data and hood width/overhang margins (base K≈1.38, wind-inclusive K=1.70)
