---
title: "Heat Release Rate Comparison"
description: "Comprehensive comparison of total and convective heat release rates for all 12 outdoor cooking source types analyzed in the research program. Shows how convective fraction varies by fuel type."
date: 2025-10-20
lastmod: 2026-02-09
tags: ["heat release rate", "plume physics", "visualization"]
categories: ["Tools"]
ShowToc: false
---

This chart compares the total and convective heat release rates for every source type analyzed in the research program. The convective fraction (Q<sub>c</sub>) — not the total heat output — is the parameter that drives plume buoyancy, velocity, and entrainment.

<div style="max-width: 880px; margin: 0 auto;">

![Heat Release Rate Comparison](/diagrams/heat-release-rate-comparison.svg)

</div>

---

## Key Findings

**Convective fraction varies dramatically by fuel type.** Gas grills convert 70% of their heat to convective plume energy. Charcoal in glowing-ember mode converts only 40% — the rest is thermal radiation to the food and surroundings. This means a 30,000 BTU charcoal grill produces a weaker plume than a 25,000 BTU gas grill.

**Gas grills dominate the high end.** The 80,000 BTU high-output gas grill produces 16.4 kW convective, creating the strongest and tallest plume in the program. This is the most demanding source for hood sizing.

**Pellet smokers span a wide range.** From 1.5 kW (low smoke mode) to 5.7 kW (high-temperature grilling), pellet smokers can operate at very different heat release rates depending on the temperature setting and pellet feed rate.

**The charcoal anomaly.** Despite relatively high BTU ratings, charcoal grills produce the weakest plumes per BTU due to their low convective fraction. This is counterintuitive — charcoal produces copious visible smoke, but the plume has less buoyant force than a gas grill of equal BTU rating.

## Why Convective Fraction Matters

The Heskestad plume correlations use Q<sub>c</sub> (not Q<sub>total</sub>) as the input parameter. All plume properties — velocity, temperature, diameter, mass flow — scale with Q<sub>c</sub>. Two sources with the same total BTU but different convective fractions produce fundamentally different plumes.

## Source Paper

- [RB-001: Buoyant Plume Behavior](/research/rb-001-buoyant-plume-behavior/) — Complete heat release rate characterization (Table 3.1)
