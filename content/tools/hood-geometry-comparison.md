---
title: "Hood Geometry Comparison"
description: "Side-by-side comparison of three hood overhang configurations showing the capture performance difference between undersized, indoor-spec, and recommended outdoor hoods."
date: 2025-12-01
lastmod: 2026-07-11
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

**No overhang = ~50% capture.** A hood the same width as the grill misses the entire expanded plume perimeter. This is the most common failure mode (FM-1) in residential outdoor installations.

**Indoor-spec overhang (~8") = ~75% capture.** An indoor hood applied outdoors provides some improvement but still cannot contain the full plume, which has expanded to 41 inches at 30-inch height from a 36-inch grill. Without walls and ceiling to redirect spillage, the escaped plume is permanently lost.

**Recommended outdoor overhang (17") = ~95% capture.** The K=1.70 outdoor margin factor from RB-002 accounts for turbulent intermittency, puffing oscillations, and light wind deflection. This is the minimum recommended overhang for outdoor installations.

## Design Priority

RB-005 established the hierarchy: **geometry precedes airflow**. No amount of exhaust CFM can capture plume gas that is physically beyond the hood's boundary. Overhang must be sized first; CFM is determined after geometry is set.

## Source Papers

- [RB-005: Hood Geometry and Capture](/research/rb-005-hood-geometry-capture/) — Complete geometric analysis
- [RB-002: Entrainment and Lateral Plume Spread](/research/rb-002-entrainment-lateral-plume-spread/) — Plume width data and K=1.70 margin
