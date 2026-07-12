---
title: "Plume Width by Height"
description: "Visualization of reference-plume capture diameter expansion from cooking surface to hood mounting height. Shows why hoods must be wider than the cooking surface."
date: 2025-11-10
lastmod: 2026-07-11
reviewed: true
tags: ["plume physics", "entrainment", "visualization"]
categories: ["Tools"]
ShowToc: false
weight: 2
instrument_id: "i04"
related_questions:
  - "/questions/hood-depth-and-overhang/"
related_papers:
  - "/research/rb-002-entrainment-lateral-plume-spread/"
  - "/research/rb-001-buoyant-plume-behavior/"
---

This chart shows how the buoyant cooking plume expands laterally as it rises from the cooking surface to the hood. The plume diameter at hood height — not the cooking surface width — determines the minimum hood size required for capture.

<div style="max-width: 880px; margin: 0 auto;">

<!-- The figure below is auto-embedded by tools/single.html from this
     page's `instrument_id` front matter; no shortcode call is needed
     here. Left in prose form as a note for anyone reading the source. -->

</div>

---

## Reference readings

*Representative values below are computed directly from the same entrainment model (`physics/plume.mjs`) driving the instrument above; live values update as you move the height control.*

| Height above grill | Capture diameter |
|---|---|
| 0″ (grill surface) | 28.0″ |
| 12″ | 30.6″ |
| 24″ | 33.3″ |
| 30″ | 34.6″ |
| 36″ | 35.9″ |
| 48″ | 38.6″ |

At the cooking surface this instrument's reference plume is already 28 inches across; by a 30-inch mounting height it has widened to about 34.6 inches, and by 48 inches to about 38.6 inches. The plume gains roughly 0.22 inch of diameter for every additional inch of mounting height in this model — linear growth of the same form as the MTT linear model in RB-002, which puts the diameter slope slightly higher, at 0.24 (Heskestad) to 0.264 (MTT) inch per inch of rise [RB-002 §2.7]. Because the plume is already wider than most single-grill cooking surfaces at the grill itself, a hood with zero overhang misses plume material even at the lowest standard mounting height [RB-002 §3.4].

## Key Findings

**The plume is always wider than the cooking surface at hood height.** Even at the lowest standard mounting height (18 inches), the plume capture diameter exceeds the cooking surface width for all source types. At 30 inches — the most common mounting height — plume diameters range from 39 to 51 inches, well beyond a typical 36-inch grill.

**The reference line tells the story.** The "Typical 36-inch grill width" line shows that every source type produces a plume wider than the grill at every mounting height. A hood sized to match the grill will always miss plume material at the edges.

**Charcoal and wood-fired sources produce the widest plumes** relative to their cooking surface, due to strongly negative virtual origins that effectively start the plume expansion below the cooking surface.

## Governing Equation

The live instrument above draws one reference plume's lateral spread, not a separate curve per source type. Capture diameter starts at 28 inches at the cooking surface (twice the 14-inch reference half-width) and widens linearly through entrainment:

> d<sub>capture</sub> = 28 + 0.22 &middot; z (inches)

where z is height above the cooking surface, in inches. As with the velocity-decay instrument above, this is a single representative plume — the source-type width differences described in Key Findings (charcoal/wood vs. gas) are RB-002's own modeled comparisons, not separate D<sub>eff</sub>/z<sub>0</sub> curves this instrument computes.

## Source Papers

- [RB-002: Entrainment and Lateral Plume Spread](/research/rb-002-entrainment-lateral-plume-spread/) — Complete plume width analysis
- [RB-001: Buoyant Plume Behavior](/research/rb-001-buoyant-plume-behavior/) — Source parameters (D<sub>eff</sub>, z<sub>0</sub>)
