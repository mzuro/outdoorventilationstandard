---
title: "Failure Mode Taxonomy"
description: "Visual reference card classifying the six primary failure modes of outdoor BBQ hood installations, with root causes, observable symptoms, and correctable vs. design-locked classification."
date: 2025-12-10
lastmod: 2026-07-11
reviewed: true
tags: ["failure modes", "diagnostics", "visualization"]
categories: ["Tools"]
ShowToc: false
weight: 10
instrument_id: "i10"
related_papers:
  - "/research/rb-007-failure-modes/"
---

This reference card catalogs the six primary failure modes observed in outdoor barbecue hood installations. Each mode has a distinct physical root cause, observable symptom pattern, and corrective classification.

<div style="max-width: 960px; margin: 0 auto;">

<!-- The figure below is auto-embedded by tools/single.html from this
     page's `instrument_id` front matter; no shortcode call is needed
     here. Left in prose form as a note for anyone reading the source. -->

</div>

---

## Reference readings

*This instrument's taxonomy view is categorical, not numeric — the table below is the exact data set driving the interactive tree above (`instruments/i10.mjs`'s `FAILURE_MODES` array), condensed from RB-007 §3.1-3.9 and classified per its Table 3.9.*

| ID | Failure mode | Classification | Root mechanism |
|---|---|---|---|
| FM-1 | Inadequate Overhang | Design-locked | Hood footprint at the plume interception plane is smaller than the plume's expanded cross-section |
| FM-2 | Excessive Mounting Height | Partially correctable | Every plume parameter degrades with height at once: wider plume, higher mass flow, lower velocity |
| FM-3 | Insufficient Exhaust Rate | Fully correctable | Installed CFM is below the plume's mass flow plus the required infiltration margin |
| FM-4 | Wind-Deflected Plume Escape | Fully correctable | Ambient wind displaces the plume centerline beyond the available overhang |
| FM-5 | Geometry-Induced Spillage | Partially correctable | Non-uniform internal velocity distribution leaves the hood perimeter under-suctioned |
| FM-6 | Momentum-Limited Capture | Fully correctable | Exhaust-induced edge velocity is too low to overcome the plume's outward expansion |

Only FM-1 (inadequate overhang) is fully design-locked among the six catalogued failure modes; FM-2 and FM-5 are partially correctable, and FM-3, FM-4, and FM-6 are fully correctable without replacing the hood [RB-007 §3.9]. FM-1 and FM-5 both produce still-air, non-directional escape patterns, but only a wider or deeper hood fixes FM-1, while FM-5 responds to filters, baffles, or a perimeter lip without any change to the hood's external dimensions [RB-007 §3.2, §3.6]. FM-4, the wind-deflected escape mode, is the one this program's side-panel and CFM-sizing tools both target directly, since it is fully correctable by either intervention [RB-007 §3.5].

## How to Use This Diagram

**Observe the smoke escape pattern** during cooking, then match it to one of the six failure modes:

- **Symmetric escape from all edges** (still air) → FM-1: Inadequate Overhang
- **Diffuse, general escape; plume looks wide and weak** → FM-2: Excessive Mounting Height
- **Edge spillage that improves when blower speed increases** → FM-3: Insufficient Exhaust Rate
- **Directional, intermittent escape correlated with wind gusts** → FM-4: Wind-Deflected Plume Escape
- **Uneven capture with dead zones under the hood face** → FM-5: Geometry-Induced Spillage
- **Plume rises past the hood face without being drawn in** → FM-6: Momentum-Limited Capture

## Correctable vs. Design-Locked

The most important distinction: FM-1 and FM-2 are **design-locked** — they cannot be fixed without replacing the hood or fundamentally changing the installation. FM-3, FM-4, and FM-6 are **correctable** through blower upgrades, filter maintenance, or adding side panels. Getting this diagnosis right avoids wasted effort on interventions that cannot address the root cause.

## Source Paper

- [RB-007: Failure Modes of Outdoor BBQ Hoods](/research/rb-007-failure-modes/) — Complete failure mode analysis with diagnostic decision tree
