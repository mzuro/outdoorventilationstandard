---
title: "Heat Release Rate Comparison"
description: "Comprehensive comparison of total and convective heat release rates for all 12 outdoor cooking source types analyzed in the research program. Shows how convective fraction varies by fuel type."
date: 2025-10-20
lastmod: 2026-07-11
reviewed: true
tags: ["heat release rate", "plume physics", "visualization"]
categories: ["Tools"]
ShowToc: false
weight: 8
instrument_id: "i09"
related_questions:
  - "/questions/what-cfm-do-i-need/"
  - "/questions/mounting-height/"
related_papers:
  - "/research/rb-001-buoyant-plume-behavior/"
---

This chart compares the total and convective heat release rates for every source type analyzed in the research program. The convective fraction (Q<sub>c</sub>) — not the total heat output — is the parameter that drives plume buoyancy, velocity, and entrainment.

<div style="max-width: 880px; margin: 0 auto;">

<!-- The figure below is auto-embedded by tools/single.html from this
     page's `instrument_id` front matter; no shortcode call is needed
     here. Left in prose form as a note for anyone reading the source. -->

</div>

---

## Reference readings

*Representative values below are computed directly from the same heat-to-velocity calibration (`physics/heat.mjs`) driving the instrument above; live values update as you select an appliance.*

| Appliance | Burner rating | Plume rise velocity (w<sub>0</sub>) | Scale vs. 60K baseline |
|---|---|---|---|
| Portable | 15,000 BTU | 252 fpm | 0.63x |
| 3-Burner | 45,000 BTU | 363 fpm | 0.91x |
| 4-Burner | 60,000 BTU | 400 fpm | 1.00x (baseline) |
| Pro | 90,000 BTU | 458 fpm | 1.14x |
| Pro+Sear | 120,000 BTU | 504 fpm | 1.26x |

Tripling burner rating from a 15,000 BTU portable to a 45,000 BTU 3-burner unit raises plume rise velocity by only 44% (252 to 363 fpm) — heat release rate and plume strength are not proportional [RB-001 §2.4]. Doubling burner rating again from 60,000 to 120,000 BTU raises velocity by only 26% (400 to 504 fpm), the same cube-root relationship RB-001 establishes between convective heat release and plume velocity [RB-001 §2.2]. This sublinear scaling is why a "twice the BTU" grill does not need twice the hood or twice the CFM — the actual plume-strength increase is far smaller [RB-001 §2.4].

## Key Findings

**Convective fraction varies dramatically by fuel type.** Gas grills convert 70% of their heat to convective plume energy. Charcoal in glowing-ember mode converts only 40% — the rest is thermal radiation to the food and surroundings. This means a 30,000 BTU charcoal grill produces a weaker plume than a 25,000 BTU gas grill.

**Gas grills dominate the high end.** The 80,000 BTU high-output gas grill produces 16.4 kW convective, creating the strongest and tallest plume in the program. This is the most demanding source for hood sizing.

**Pellet smokers span a wide range.** From 1.5 kW (low smoke mode) to 5.7 kW (high-temperature grilling), pellet smokers can operate at very different heat release rates depending on the temperature setting and pellet feed rate.

**The charcoal anomaly.** Despite relatively high BTU ratings, charcoal grills produce the weakest plumes per BTU due to their low convective fraction. This is counterintuitive — charcoal produces copious visible smoke, but the plume has less buoyant force than a gas grill of equal BTU rating.

## Why Convective Fraction Matters

The Heskestad plume correlations use Q<sub>c</sub> (not Q<sub>total</sub>) as the input parameter. All plume properties — velocity, temperature, diameter, mass flow — scale with Q<sub>c</sub>. Two sources with the same total BTU but different convective fractions produce fundamentally different plumes.

## Source Paper

- [RB-001: Buoyant Plume Behavior](/research/rb-001-buoyant-plume-behavior/) — Complete heat release rate characterization (Table 3.1)
