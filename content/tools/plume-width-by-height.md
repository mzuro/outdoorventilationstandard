---
title: "Plume Width by Height"
description: "Visualization of plume capture diameter expansion from cooking surface to hood mounting heights for four representative source types. Shows why hoods must be wider than the cooking surface."
date: 2025-11-10
lastmod: 2026-02-09
tags: ["plume physics", "entrainment", "visualization"]
categories: ["Tools"]
ShowToc: false
---

This chart shows how the buoyant cooking plume expands laterally as it rises from the cooking surface to the hood. The plume diameter at hood height — not the cooking surface width — determines the minimum hood size required for capture.

<div style="max-width: 880px; margin: 0 auto;">

![Plume Width by Height](/diagrams/plume-width-by-height.svg)

</div>

---

## Key Findings

**The plume is always wider than the cooking surface at hood height.** Even at the lowest standard mounting height (18 inches), the plume capture diameter exceeds the cooking surface width for all source types. At 30 inches — the most common mounting height — plume diameters range from 39 to 51 inches, well beyond a typical 36-inch grill.

**The reference line tells the story.** The "Typical 36-inch grill width" line shows that every source type produces a plume wider than the grill at every mounting height. A hood sized to match the grill will always miss plume material at the edges.

**Charcoal and wood-fired sources produce the widest plumes** relative to their cooking surface, due to strongly negative virtual origins that effectively start the plume expansion below the cooking surface.

## Governing Equation

> d<sub>capture</sub> = 0.48(z - z<sub>0</sub>) + D<sub>eff</sub>

where z is the mounting height, z<sub>0</sub> is the virtual origin (negative for most sources), and D<sub>eff</sub> is the effective source diameter.

## Source Papers

- [RB-002: Entrainment and Lateral Plume Spread](/research/rb-002-entrainment-lateral-plume-spread/) — Complete plume width analysis
- [RB-001: Buoyant Plume Behavior](/research/rb-001-buoyant-plume-behavior/) — Source parameters (D<sub>eff</sub>, z<sub>0</sub>)
