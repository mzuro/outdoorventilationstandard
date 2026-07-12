---
title: "Indoor vs. Outdoor Ventilation Comparison"
description: "Side-by-side diagram showing why indoor ventilation assumptions fail in outdoor environments — wall confinement, pressure-assisted capture, and ceiling redirection do not exist outdoors."
date: 2025-11-01
lastmod: 2026-07-11
reviewed: true
tags: ["indoor vs outdoor", "open-boundary dilution", "visualization"]
categories: ["Tools"]
ShowToc: false
weight: 7
instrument_id: "i08"
related_questions:
  - "/questions/what-cfm-do-i-need/"
  - "/questions/do-side-panels-work/"
related_papers:
  - "/research/rb-004-indoor-vs-outdoor-assumptions/"
  - "/research/rb-005-hood-geometry-capture/"
  - "/research/rb-008-cfm-requirements/"
  - "/research/rb-009-side-panel-effectiveness/"
---

This diagram contrasts plume capture in enclosed indoor environments versus open-boundary outdoor environments. The physics are fundamentally different — indoor hoods benefit from four structural advantages that do not exist outdoors.

<div style="max-width: 960px; margin: 0 auto;">

<!-- The figure below is auto-embedded by tools/single.html from this
     page's `instrument_id` front matter; no shortcode call is needed
     here. Left in prose form as a note for anyone reading the source. -->

</div>

---

## Reference readings

*Representative values below are computed directly from the same capture-fraction module (`physics/capture.mjs`) driving the instrument above, at a fixed 48-inch island hood — this instrument's only control is wind speed, since it isolates the outdoor wind-exposure effect from hood geometry; live values update as you move the control.*

| Wind speed | Modeled outdoor capture |
|---|---|
| 0 mph (indoor-equivalent, still air) | 97% |
| 3 mph | 92% |
| 5 mph | 79% |
| 8 mph | 46% |
| 12 mph | 10% |

In still air, this 48-inch island hood models at 97% capture — close to the near-100% indoor baseline RB-004 describes, since none of the four indoor advantages are wind-related [RB-004 §2.1]. Introducing an 8 mph crosswind, with no other change to the hood, drops modeled capture to about 46%, squarely inside the 40-60% outdoor range RB-004 reports as the real-world consequence of losing wall confinement, ceiling redirection, and pressure assist [RB-004 §2.1]. By 12 mph, modeled capture falls to about 10%, the same order of magnitude RB-008 uses to justify a 5.75x wind-exposure multiplier over the sheltered CFM baseline [RB-008 §3.9].

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
