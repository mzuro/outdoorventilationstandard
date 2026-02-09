---
title: "Indoor vs. Outdoor Ventilation Comparison"
description: "Side-by-side diagram showing why indoor ventilation assumptions fail in outdoor environments — wall confinement, pressure-assisted capture, and ceiling redirection do not exist outdoors."
date: 2025-11-01
lastmod: 2026-02-05
tags: ["indoor vs outdoor", "open-boundary dilution", "visualization"]
categories: ["Tools"]
ShowToc: false
---

This diagram contrasts plume capture in enclosed indoor environments versus open-boundary outdoor environments. The physics are fundamentally different — indoor hoods benefit from four structural advantages that do not exist outdoors.

<div style="max-width: 960px; margin: 0 auto;">

![Indoor vs Outdoor Ventilation Comparison](/diagrams/indoor-vs-outdoor-comparison.svg)

</div>

---

## The Four Indoor Advantages

**1. Wall confinement.** Indoor walls physically prevent the plume from escaping laterally. Any spillage from the hood is redirected back toward the capture zone by room boundaries. Outdoors, escaped plume disperses freely in three dimensions.

**2. Ceiling redirection.** When indoor plume rises past the hood, the ceiling acts as a horizontal barrier that redirects the rising gases back toward the hood inlet. Outdoors, there is no overhead barrier — the plume rises indefinitely or is carried away by wind.

**3. Pressure-assisted capture.** The enclosed room creates a slight negative pressure when the exhaust fan operates, drawing replacement air through room openings. This pressure differential actively assists plume capture. Outdoors, the infinite open boundary eliminates any pressure assist — the hood must rely entirely on its own suction.

**4. No wind deflection.** Indoor environments have near-zero ambient air velocity at the cooking station. Outdoors, even light breezes (3-5 mph) can deflect the plume partially or fully outside the hood capture envelope.

## The Capture Efficiency Gap

The combined effect of these four differences reduces outdoor capture efficiency from near-100% (indoor, properly sized hood) to approximately 40-60% (outdoor, same hood design). This is the central finding of [RB-004](/research/rb-004-indoor-vs-outdoor-assumptions/) and the fundamental reason that indoor ventilation standards cannot be directly applied to outdoor cooking installations.

## Implications for Hood Sizing

To achieve reliable outdoor capture, hoods must compensate through:

- **Larger canopy dimensions** — wider overhang to accommodate plume expansion and wind deflection (see [RB-005](/research/rb-005-hood-geometry-capture/))
- **Higher exhaust rates** — 1.7× to 5.75× the indoor CFM baseline, depending on wind exposure (see [RB-008](/research/rb-008-cfm-requirements/))
- **Physical wind shielding** — side panels and rear walls that partially restore the confinement benefits of indoor environments (see [RB-009](/research/rb-009-side-panel-effectiveness/))

## Source Paper

- [RB-004: Why Indoor Ventilation Assumptions Fail Outdoors](/research/rb-004-indoor-vs-outdoor-assumptions/) — Complete analysis of all indoor assumptions and their outdoor failure modes
