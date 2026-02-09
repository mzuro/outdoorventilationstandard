---
title: "RB-009: Side Panel and Wind Baffle Effectiveness"
date: 2025-12-18
lastmod: 2026-01-06
draft: false
type: "research"
series: "Outdoor Ventilation Standard"
research_id: "RB-009"
priority: "P2 — Applied"
status: "Complete"
version: "1.0"
charter_version: "2.6"
glossary_version: "1.1"
diagram_standard_version: "2.1"
dependencies: "RB-005, RB-006"
downstream_topics:
  - "RB-007: Failure Modes of Outdoor BBQ Hoods"
  - "RB-008: CFM Requirements for Outdoor Cooking Ventilation"
  - "RB-010: Material Selection for Outdoor Hood Environments"
description: "Analyzes the physics of how side panels, rear panels, and wind baffles improve hood capture performance in outdoor environments. Quantifies the improvement in Effective Capture Area and Capture Envelope volume provided by partial enclosure. Determines optimal panel configurations for common installation scenarios including minimum panel depth, angular positioning, and combined panel-plus-CFM strategies."
summary: "This paper provides a rigorous, quantitative analysis of partial enclosure as a wind mitigation and capture enhancement strategy for outdoor barbecue ventilation hoods. It builds on the hood geometry analysis of RB-005 and the wind interaction modeling of RB-006 to derive the effective wind reduction, Effective Capture Area improvement, and Capture Envelope volume expansion provided by side panels, rear panels, and wind baffles across all source types, mounting heights, and wind exposure classes. It establishes minimum panel depth thresholds, identifies negative effects (recirculation zones, combustion air restriction, operator access interference), and delivers consolidated design guideline tables for panel configuration by installation scenario."
tags: ["side panels", "wind protection", "hood design"]
categories: ["P2 — Applied"]
---

**Research Program:** Outdoor Ventilation Standard
**Charter Version:** 2.6
**Glossary Version:** 1.1
**Priority Tier:** P2 — Applied
**Author Role:** Hood Performance & Design Agent
**Date:** 2026-02-08
**Depends On:** RB-005: Impact of Hood Geometry on Capture Performance; RB-006: Wind Interaction and Cross-Flow Effects

---

## 1. Topic Definition

This paper analyzes the physics of how side panels, rear panels, and wind baffles improve hood capture performance in outdoor environments. It quantifies the improvement in **Effective Capture Area** and **Capture Envelope** volume provided by partial enclosure configurations, determines optimal panel dimensions for common installation scenarios, and identifies conditions under which panels produce negative effects such as recirculation zones, turbulence amplification, or combustion air restriction.

The scope encompasses:

1. **Wind sheltering physics.** Quantitative modeling of how vertical panels mounted at the hood perimeter reduce the effective wind speed at the **Plume Interception Plane**. This includes the aerodynamics of flow separation, recirculation zone formation, and reattachment downstream of a panel barrier — applied to the specific geometry of an outdoor cooking hood installation.

2. **Effective Capture Area improvement.** Determination of how side panels increase the fraction of the hood's face area that actively contributes to plume capture (the velocity uniformity factor eta_uniformity from RB-005). Panels reduce ambient air infiltration from the blocked sides, redirecting exhaust suction toward the remaining open faces where the plume enters.

3. **Capture Envelope volume expansion.** Calculation of the increase in **Capture Envelope** volume when panels extend the hood's effective boundaries downward and laterally, creating a partially enclosed region beneath the hood that retains plume gas more effectively than an open canopy.

4. **Panel depth analysis.** Determination of the minimum panel depth (vertical extent below the hood face) required to produce meaningful capture improvement at each mounting height and wind speed. Identification of the depth at which diminishing returns set in and the depth at which negative effects emerge.

5. **Panel configuration optimization.** Comparative analysis of two-panel (sides only), three-panel (sides plus rear), three-panel with open rear (sides plus front), and four-panel (full enclosure with front access opening) configurations. Assessment of each configuration's effectiveness against wind from different directions.

6. **Negative effects analysis.** Identification and quantification of conditions under which panels produce adverse outcomes: recirculation zones that trap contaminants beneath the hood, turbulence amplification at panel edges, combustion air restriction for fuel-burning sources, operator access interference, and thermal buildup in the enclosed space.

7. **Combined panel-plus-CFM strategies.** Interaction between panel configuration and exhaust rate, including the CFM reduction achievable with panels and the optimal CFM for each panel configuration.

### Relationship to Dependency Papers

RB-005 established the hood geometry framework: the **Capture Envelope** geometry, the **Effective Capture Area** as a function of velocity uniformity, the effect of hood lip and baffles, and the hierarchy of design priorities (geometry precedes airflow). RB-005 Section 4.5 identified three conditions where hood geometry alone cannot provide reliable capture, explicitly citing side panels as mandatory for mounting heights above 48 inches and for sustained wind above 5 mph.

RB-006 provided the quantitative wind interaction model: plume deflection as a function of wind speed and source strength, the Froude number regime classification, critical wind speeds for capture failure, and the four-tier wind exposure classification (Sheltered, Moderate, Exposed, Severe). RB-006 Section 3.9.1 introduced the preliminary side panel effectiveness model, showing that full side panels on both sides reduce effective crosswind by 40 to 60% and recover 15 to 20% capture efficiency at 5 mph. RB-006 Section 3.9.2 quantified the rear wall effectiveness at 60 to 80% wind reduction.

This paper extends both analyses by treating the panel configuration as a primary design variable rather than a supplementary mitigation. Where RB-005 designed the hood and RB-006 characterized the wind problem, this paper designs the panel system that bridges the gap between hood capability and environmental demand.

### Problem Framing

The fundamental challenge of outdoor barbecue ventilation is that the **Buoyant Cooking Plume** must be captured in an environment where ambient wind routinely displaces the plume beyond the hood's geometric coverage. RB-006 demonstrated that a standard hood loses reliable capture at wind speeds as low as 5 mph at cooking height — a condition that occurs routinely in most outdoor settings.

There are three approaches to closing this gap:

1. **Increase the hood size** to accommodate the deflected plume. RB-006 Section 3.9.5 showed this requires 2.3 to 4.0 inches of additional overhang per mph of wind speed — impractical above 5 mph.

2. **Increase the exhaust rate** to strengthen edge capture. RB-006 Section 3.9.3 showed this provides only partial compensation (approximately 80% capture at 5 mph with 1.8 times baseline CFM) and cannot address the geometric displacement problem.

3. **Reduce the effective wind speed at the plume** using physical barriers (panels, walls, enclosures). RB-006 Section 3.9.1 showed this is the most effective single intervention, recovering near-still-air performance at moderate wind speeds.

This paper develops approach (3) in full detail. The panel system is not an accessory — it is the primary engineering solution to the wind capture problem for outdoor installations classified as Moderate, Exposed, or Severe.

---

## 2. Relevant Physical Principles

### 2.1 Wind Sheltering by a Vertical Barrier: Flow Separation and Recirculation

When a horizontal wind of speed U_w encounters a solid vertical barrier of height H_b, the flow separates at the top edge of the barrier and forms a recirculation zone on the leeward (downwind) side. The recirculation zone is a region of reduced wind speed, reversed flow near the ground, and elevated turbulence intensity.

The key parameters of the sheltered zone are:

**Recirculation zone length.** For a solid fence or wall, the recirculation zone extends approximately 3 to 8 barrier heights downstream (Plate, 1971; Raine & Stevenson, 1977). For outdoor cooking applications where the barrier (side panel) extends from the hood edge toward the cooking surface, the relevant barrier height is the panel depth h_panel, and the recirculation zone extends laterally (inward from the panel) approximately 3 to 8 times h_panel.

**Wind speed reduction within the sheltered zone.** Within the recirculation zone (0 to 5 barrier heights downstream), the mean wind speed is reduced to approximately 20 to 40% of the freestream value. At 3 to 5 barrier heights downstream, the wind speed recovers to approximately 50 to 70% of freestream. At 8 to 10 barrier heights downstream, the sheltering effect is largely dissipated:

| Distance Downstream (multiples of H_b) | Wind Speed Reduction (fraction of freestream) |
|---|---|
| 0 - 2 H_b | 0.15 - 0.30 |
| 2 - 5 H_b | 0.30 - 0.50 |
| 5 - 8 H_b | 0.50 - 0.70 |
| 8 - 12 H_b | 0.70 - 0.90 |
| > 12 H_b | > 0.90 (minimal sheltering) |

For a side panel of depth h_panel = 12 inches (0.30 m) on a 30-inch installation, the recirculation zone extends approximately 3 to 8 times 12 inches = 36 to 96 inches inward from the panel. Since the cooking surface width (typically 22 to 36 inches) is within this range, a 12-inch panel provides meaningful sheltering across the entire cooking zone for wind approaching from the panel side.

**Turbulence intensity within the sheltered zone.** The recirculation zone has elevated turbulence intensity relative to the undisturbed freestream. Typical values are I_u = 0.30 to 0.50 within the recirculation zone, compared to I_u = 0.15 to 0.25 in the undisturbed surface layer. This elevated turbulence has implications for plume wandering and instantaneous capture reliability (Section 3.5).

### 2.2 Partial Enclosure and Effective Wind Reduction

When two or more panels are mounted on different sides of the hood, the combined sheltering effect is greater than the sum of individual panel effects because the panels interact aerodynamically. Specifically:

**Two side panels (both lateral faces blocked).** Wind approaching perpendicular to the panels (from front or rear) is unobstructed. Wind approaching parallel to the panels (from either side) encounters the full blocking effect of both panels. Wind approaching at intermediate angles encounters partial blocking. The effective wind reduction averaged over all approach angles is approximately 30 to 45% for two panels extending 50% of the mounting height.

**Three panels — sides plus rear (most common configuration).** Wind from the rear is fully blocked by the rear panel. Wind from the sides is blocked by the side panels. Only wind from the front (the operator access side) is unobstructed. The effective wind reduction averaged over all approach angles is approximately 55 to 70% for panels extending 50% of the mounting height. For the most common wind approach direction (rear-to-front, which accounts for the majority of wind-driven capture failures because the cook's body provides negligible sheltering for the plume behind them), the rear panel provides near-total sheltering.

**Three panels — sides plus front (reversed configuration).** This configuration blocks the operator side and leaves the rear open. It is rarely appropriate for cooking installations because it obstructs operator access. However, it provides effective wind sheltering for rear-open installations where the grill is positioned against a wall (the wall serves as the rear barrier).

**Four panels — full enclosure with front opening.** All sides except the front access are blocked. The effective wind reduction averaged over all approach angles is approximately 70 to 85% for panels extending 50% or more of the mounting height. Wind from behind and the sides is fully blocked. Wind from the front encounters the hood face above and the cooking surface below, creating a partially enclosed channel that reduces but does not eliminate the wind at the plume.

### 2.3 Panel Depth and the Fractional Enclosure Parameter

The panel depth h_panel (vertical extent below the hood face) is the primary geometric variable governing panel effectiveness. To normalize across different mounting heights, the fractional enclosure parameter f is defined:

> f = h_panel / z_mount

where z_mount is the mounting height (distance from cooking surface to hood face). The parameter f ranges from 0 (no panels) to 1 (panels extending from the hood face to the cooking surface — full enclosure on the paneled sides).

The sheltering effectiveness is a nonlinear function of f:

| Fractional Enclosure f | Panel Depth at 30" Mount | Wind Reduction (crosswind from panel side) | Practical Notes |
|---|---|---|---|
| 0 (no panel) | 0" | 0% | Baseline — open canopy |
| 0.15 | 4.5" | 8 - 12% | Equivalent to a deep hood lip; minimal standalone benefit |
| 0.25 | 7.5" | 15 - 22% | Noticeable improvement; beginning of meaningful sheltering |
| 0.33 | 10" | 22 - 30% | Moderate sheltering; threshold for measurable capture improvement |
| 0.50 | 15" | 35 - 50% | Substantial sheltering; recommended minimum for Moderate wind class |
| 0.67 | 20" | 50 - 65% | Strong sheltering; recommended for Exposed wind class |
| 0.75 | 22.5" | 60 - 75% | Near-maximum sheltering for practical panel depths |
| 1.00 | 30" (full height) | 75 - 90% | Full enclosure on paneled side; maximum wind protection but restricts access |

The critical transition occurs between f = 0.25 and f = 0.50. Below f = 0.25, the panel is too shallow to generate a recirculation zone that extends to the cooking surface centerline. The wind flows under the panel with modest acceleration but is not significantly redirected. Above f = 0.50, the recirculation zone covers the entire cooking surface width, and further increases in panel depth provide diminishing additional wind reduction.

### 2.4 Panel Effect on Effective Capture Area

Side panels modify the **Effective Capture Area** through two mechanisms:

**Mechanism 1 — Reduced ambient infiltration.** In an open canopy hood, ambient air enters from all four sides, diluting the exhaust suction. When panels block one or more sides, the ambient infiltration is channeled through the remaining open faces, where it must compete with the plume for entry. The fraction of exhaust flow devoted to productive plume capture increases.

For a hood exhausting Q_exhaust, the total flow is partitioned between plume gas (Q_plume) and infiltrated ambient air (Q_inf):

> Q_exhaust = Q_plume + Q_inf

The infiltration fraction is:

> F_inf = Q_inf / Q_exhaust

Without panels (four open sides), F_inf is approximately 0.50 to 0.65 for island installations (from RB-005 Section 3.4.3). With three panels (sides plus rear), only the front face admits ambient air. The infiltration fraction decreases to approximately 0.30 to 0.45 because less total surface area is available for ambient entry. This means a greater fraction of the exhaust capacity is available for plume capture.

**Mechanism 2 — Velocity redistribution toward open faces.** Panels create a pressure differential: the blocked sides cannot supply air, so the suction on the open faces increases. The face velocity at the front opening of a three-panel configuration is higher than the average face velocity of the same hood without panels. This increased velocity at the open face improves capture of the deflected plume entering from the front.

The combined effect on **Effective Capture Area** is expressed as a panel improvement factor K_panel:

> A_eff_panel = A_eff_base * K_panel

where A_eff_base is the Effective Capture Area without panels (from RB-005 Table 3.4.5) and K_panel accounts for the infiltration reduction and velocity redistribution.

| Panel Configuration | Number of Open Sides | Infiltration Fraction | K_panel (Effective Capture Area multiplier) |
|---|---|---|---|
| No panels (island) | 4 | 0.50 - 0.65 | 1.00 (baseline) |
| No panels (wall-mount) | 3 | 0.40 - 0.55 | 1.10 - 1.20 |
| Two side panels (island) | 2 (front + rear) | 0.35 - 0.50 | 1.15 - 1.30 |
| Sides + rear (island) | 1 (front only) | 0.25 - 0.40 | 1.30 - 1.50 |
| Sides + rear (wall-mount) | 1 (front only) | 0.20 - 0.35 | 1.40 - 1.60 |
| Full enclosure (front opening) | 0.5 (partial front) | 0.15 - 0.25 | 1.55 - 1.75 |

The K_panel values represent the ratio of effective capture performance with panels to performance without panels, at the same CFM. A K_panel of 1.40 means the paneled hood performs equivalently to an unpaneled hood with 40% more Effective Capture Area — a substantial improvement achieved without increasing the hood's physical dimensions or exhaust rate.

### 2.5 Panel Effect on Capture Envelope Volume

Panels extend the **Capture Envelope** by creating physical boundaries that prevent plume gas from escaping laterally. Without panels, the Capture Envelope contracts rapidly below the hood face because the suction field decays as r^(-2) beyond the hood boundary (RB-005 Section 2.1). Panels replace the rapidly decaying suction field with a physical barrier that prevents escape regardless of the local velocity magnitude.

The Capture Envelope volume with panels is:

> V_CE_panel = V_CE_base + V_panel_extension

where V_CE_base is the Capture Envelope volume of the unpaneled hood (from RB-005 Section 3.3.1) and V_panel_extension is the additional volume enclosed by the panels.

For a 57 x 53 inch hood at 30 inches with three panels (sides plus rear) at f = 0.50 (panels extending 15 inches below the hood face):

> V_panel_extension = A_panel_faces * h_panel * geometric_factor

The exact geometry depends on the panel arrangement, but the approximate volume increase is:

| Panel Configuration (f = 0.50, 30" mount) | V_CE_base (cu ft) | V_panel_extension (cu ft) | Total V_CE (cu ft) | Volume Increase |
|---|---|---|---|---|
| No panels, 3" lip | 18 - 24 | 0 | 18 - 24 | Baseline |
| Two side panels | 18 - 24 | 8 - 11 | 26 - 35 | +42 - 50% |
| Sides + rear | 18 - 24 | 14 - 18 | 32 - 42 | +75 - 85% |
| Full enclosure (front opening) | 18 - 24 | 18 - 22 | 36 - 46 | +95 - 105% |

The approximately doubled Capture Envelope volume with three panels means the plume has twice the contained space in which to fluctuate (puffing, turbulent excursions, wind-induced wandering) before escaping the hood. This directly improves time-averaged capture efficiency under dynamic conditions.

### 2.6 Combustion Air Path and Panel Interference

Fuel-burning cooking sources (gas, charcoal, wood, pellet) require a continuous supply of combustion air. Gas burners draw air through venturi intakes on the burner tube. Charcoal and wood fires draw air from below and around the fuel bed. Pellet smokers use forced-air fans to supply combustion air to the fire pot.

Panels that extend to or near the cooking surface can restrict the combustion air supply path, potentially:

1. **Reducing combustion intensity** (lower heat output, lower plume velocity)
2. **Producing incomplete combustion** (increased CO and particulate emissions)
3. **Altering flame behavior** (flame attachment changes, asymmetric burning)

The critical parameter is the open area available for combustion air supply relative to the combustion air demand:

> A_open = perimeter_open * h_gap_below_panel

where perimeter_open is the total open perimeter length (not blocked by panels) and h_gap_below_panel is the vertical gap between the panel's lower edge and the cooking surface or grill body.

For a gas grill consuming 60,000 BTU/hr (17.6 kW) at stoichiometric conditions, the air demand is approximately 0.018 m^3/s (38 CFM). At a comfortable supply velocity of 0.5 m/s through the open area, the minimum open area required is:

> A_open_min = 0.018 / 0.5 = 0.036 m^2 = 56 sq in

A front opening of 30 inches wide and 10 inches high provides 300 sq in — approximately 5 times the minimum. Even with three panels at f = 0.67 (leaving only 10 inches of open height at the front), the combustion air supply is adequate for all standard cooking sources.

The practical constraint is more likely thermal comfort and operator access than combustion air restriction. Panels restrict airflow around the operator, increasing the ambient temperature in the cooking zone. Section 3.5 addresses this in detail.

---

## 3. Observed or Expected Behavior

### 3.1 Panel Wind Reduction: Comprehensive Results

The effective wind speed at the cooking surface centerline is computed for each panel configuration, mounting height, and panel depth fraction f. The wind reduction is modeled as:

> U_eff = U_w * (1 - R_panel)

where R_panel is the wind reduction coefficient, a function of panel configuration and fractional enclosure f. The R_panel values are derived from the sheltering physics in Section 2.1, calibrated against the RB-006 Section 3.9 preliminary estimates.

#### Table 3.1a: Wind Reduction Coefficient R_panel — Two Side Panels

Wind approaching perpendicular to panels (lateral crosswind, worst case for two side panels):

| Fractional Enclosure f | R_panel (lateral wind) | R_panel (front/rear wind) | R_panel (45-degree wind) | R_panel (all-direction average) |
|---|---|---|---|---|
| 0.25 | 0.20 | 0.05 | 0.12 | 0.10 |
| 0.33 | 0.28 | 0.08 | 0.17 | 0.15 |
| 0.50 | 0.45 | 0.12 | 0.28 | 0.25 |
| 0.67 | 0.60 | 0.15 | 0.37 | 0.33 |
| 0.75 | 0.68 | 0.18 | 0.42 | 0.38 |
| 1.00 | 0.85 | 0.22 | 0.52 | 0.48 |

Two side panels are effective against lateral wind (perpendicular to the panels) but provide minimal protection against wind from the front or rear. For installations where wind direction is variable, two side panels are insufficient for Moderate wind exposure class.

#### Table 3.1b: Wind Reduction Coefficient R_panel — Three Panels (Sides + Rear)

| Fractional Enclosure f | R_panel (rear wind) | R_panel (lateral wind) | R_panel (front wind) | R_panel (45-degree wind) | R_panel (all-direction average) |
|---|---|---|---|---|---|
| 0.25 | 0.18 | 0.20 | 0.05 | 0.14 | 0.14 |
| 0.33 | 0.26 | 0.28 | 0.08 | 0.20 | 0.20 |
| 0.50 | 0.45 | 0.45 | 0.12 | 0.35 | 0.34 |
| 0.67 | 0.62 | 0.60 | 0.18 | 0.48 | 0.47 |
| 0.75 | 0.72 | 0.68 | 0.22 | 0.55 | 0.54 |
| 1.00 | 0.88 | 0.85 | 0.30 | 0.68 | 0.68 |

Three panels with the front open provide effective protection from three of four directions. The front-wind weakness is mitigated in practice because the operator's body provides partial frontal sheltering and the most common installation configurations (wall-mount, patio corner) position the grill with the prevailing wind approaching from the rear or side.

#### Table 3.1c: Wind Reduction Coefficient R_panel — Full Enclosure (Front Opening Only)

| Fractional Enclosure f | R_panel (rear wind) | R_panel (lateral wind) | R_panel (front wind) | R_panel (all-direction average) |
|---|---|---|---|---|
| 0.50 | 0.50 | 0.50 | 0.25 | 0.44 |
| 0.67 | 0.70 | 0.68 | 0.38 | 0.58 |
| 0.75 | 0.78 | 0.75 | 0.45 | 0.65 |
| 1.00 | 0.92 | 0.90 | 0.60 | 0.81 |

Full enclosure with a front opening provides the highest wind reduction from all directions. Even frontal wind is substantially reduced (by 25 to 60%) because the enclosed volume creates a stagnation zone that attenuates the incoming flow.

### 3.2 Effective Capture Area Improvement: Quantitative Results

The panel improvement factor K_panel (from Section 2.4) is applied to the baseline **Effective Capture Area** from RB-005 to derive the panel-enhanced values. The baseline assumes a properly baffled hood with a 3-inch lip (eta_uniformity = 0.75 to 0.85 from RB-005 Table 3.4.5).

For a 57 x 53 inch hood (Gas Grill Medium at 30", RB-005 Table 3.8b):
- Total face area = 3,021 sq in
- Baseline Effective Capture Area (baffled, 3" lip, no panels) = 2,266 to 2,568 sq in (75-85%)
- Plume cross-section at 30" = 1,320 sq in (41" diameter circle from RB-001 Table 3.6)

#### Table 3.2: Effective Capture Area with Panels (57 x 53 inch hood, baffled, 3" lip)

| Configuration | K_panel | Effective Capture Area (sq in) | Ratio to Plume Cross-Section | Effective eta_total |
|---|---|---|---|---|
| No panels (island) | 1.00 | 2,266 - 2,568 | 1.72 - 1.95 | 0.75 - 0.85 |
| Two side panels (f=0.50) | 1.20 | 2,719 - 3,021 | 2.06 - 2.29 | 0.90 - 1.00 |
| Sides + rear (f=0.50) | 1.40 | 3,021 - 3,021 | 2.29 - 2.29 | 0.95 - 1.00 |
| Sides + rear (f=0.67) | 1.50 | 3,021 - 3,021 | 2.29 - 2.29 | 0.98 - 1.00 |
| Full enclosure (f=0.50) | 1.60 | 3,021 - 3,021 | 2.29 - 2.29 | 1.00 |

The Effective Capture Area is capped at the total face area (3,021 sq in) because the velocity uniformity factor cannot exceed 1.00. In practice, the K_panel values above 1.40 indicate that the panel-enhanced hood is operating at near-complete face utilization, meaning virtually the entire hood opening is actively drawing air inward. This is the desired operating state for maximum capture performance.

The practical significance is that three panels (sides plus rear) at f = 0.50 raise the Effective Capture Area to approximately 100% of the physical hood face — meaning the hood performs as if every square inch of its opening contributes to capture. Without panels, even a well-baffled hood achieves only 75 to 85% utilization. The panels eliminate the dead zones that arise from uncontrolled ambient infiltration at the sides and rear.

### 3.3 Capture Envelope Volume Expansion: Quantitative Results

The **Capture Envelope** volume expansion is computed for the same 57 x 53 inch hood at 30 inches. The baseline Capture Envelope (with 3-inch lip, no panels) has an effective capture depth of approximately 8.5 to 11.3 inches below the hood face (from RB-005 Table 3.3.1).

#### Table 3.3: Capture Envelope Volume with Panels (57 x 53 inch hood at 30" mounting height)

| Configuration | Capture Depth (in) | V_CE (cu ft) | Volume Increase vs No Panels | Puffing Buffer (seconds at 609 CFM) |
|---|---|---|---|---|
| No panels, no lip | 5.5 - 8.3 | 11.5 - 17.3 | Baseline | 0.33 - 0.49 |
| No panels, 3" lip | 8.5 - 11.3 | 17.8 - 23.6 | +55% | 0.50 - 0.67 |
| Two side panels (f=0.50) + lip | 15 - 18 | 31 - 38 | +170 - 220% | 0.87 - 1.07 |
| Sides + rear (f=0.50) + lip | 15 - 20 | 38 - 45 | +230 - 290% | 1.07 - 1.27 |
| Sides + rear (f=0.67) + lip | 20 - 24 | 44 - 52 | +280 - 350% | 1.24 - 1.47 |
| Full enclosure (f=0.75) + lip | 22 - 28 | 50 - 60 | +330 - 420% | 1.41 - 1.70 |

The puffing buffer column shows the time constant for volume buffering (tau = V_CE / Q_exhaust) relative to the plume puffing period of approximately 0.5 to 0.6 seconds (from RB-005 Section 2.6). A buffer time exceeding 1.0 seconds means the Capture Envelope can absorb two or more complete puffing cycles without releasing plume gas — a significant improvement in dynamic capture reliability.

With three panels at f = 0.50, the Capture Envelope volume is approximately 3 to 4 times larger than the unpaneled baseline. This means the plume can undergo substantial transient excursions (puffing, gusting, flare-ups) within the enclosed volume without escaping. The panels transform the hood from an open canopy that must continuously capture a moving target into a partial enclosure that contains the plume within a defined volume and exhaust it at a controlled rate.

### 3.4 Minimum Panel Depth Analysis

The minimum panel depth required to produce meaningful capture improvement depends on the mounting height, the wind speed, and the source type. "Meaningful improvement" is defined as at least a 10% increase in estimated capture efficiency under the specified wind conditions.

The analysis uses the wind reduction model from Section 3.1 combined with the plume deflection model from RB-006. The deflection with panels is:

> delta_x_panel = delta_x_still * (1 - R_panel)

where delta_x_still is the deflection without panels at the given wind speed (from RB-006 Tables 3.2a-h).

#### Table 3.4a: Minimum Panel Depth for 10% Capture Improvement — Gas Grill Medium at 30"

| Wind Speed | Deflection Without Panels (in) | Required R_panel for 10% Improvement | Min f (two sides) | Min f (sides + rear) | Min Panel Depth (two sides, inches) | Min Panel Depth (sides + rear, inches) |
|---|---|---|---|---|---|---|
| 2 mph | 5" | 0.10 | 0.25 | 0.20 | 8 | 6 |
| 5 mph | 12" | 0.18 | 0.33 | 0.28 | 10 | 8 |
| 8 mph | 19" | 0.25 | 0.45 | 0.38 | 14 | 11 |
| 10 mph | 25" | 0.30 | 0.50 | 0.42 | 15 | 13 |

#### Table 3.4b: Minimum Panel Depth for 10% Capture Improvement — Charcoal Kettle at 30"

| Wind Speed | Deflection Without Panels (in) | Required R_panel for 10% Improvement | Min f (two sides) | Min f (sides + rear) | Min Panel Depth (two sides, inches) | Min Panel Depth (sides + rear, inches) |
|---|---|---|---|---|---|---|
| 2 mph | 7" | 0.12 | 0.28 | 0.22 | 8 | 7 |
| 5 mph | 19" | 0.22 | 0.40 | 0.33 | 12 | 10 |
| 8 mph | 32" | 0.30 | 0.50 | 0.42 | 15 | 13 |
| 10 mph | 43" | 0.35 | 0.55 | 0.47 | 17 | 14 |

**Key findings from the minimum panel depth analysis:**

1. **The minimum useful panel depth is approximately 8 inches (f approximately 0.25 at 30" mount).** Below 8 inches, the wind reduction is too small to produce meaningful capture improvement at any wind speed above 2 mph. Panels shorter than 8 inches function primarily as extended hood lips rather than wind barriers.

2. **For the Moderate wind class (3 to 7 mph), a panel depth of 10 to 14 inches (f = 0.33 to 0.47) is required with two side panels; 8 to 11 inches (f = 0.27 to 0.37) with three panels.** The three-panel configuration achieves the same wind reduction with approximately 25% less panel depth because the rear panel blocks the primary wind approach.

3. **For the Exposed wind class (7 to 12 mph), panel depth of 14 to 17 inches (f = 0.47 to 0.57) is required for two side panels; 11 to 14 inches (f = 0.37 to 0.47) for three panels.** At these depths, the panels extend more than one-third of the way from the hood to the cooking surface.

4. **Weak plumes (charcoal, pellet smoker low) require approximately 15 to 25% greater panel depth than gas grill plumes at any given wind speed** because the weak plume's larger deflection demands greater wind reduction to bring the plume back within the hood boundary.

5. **At 18-inch mounting height, the minimum effective panel depth is 5 to 6 inches** because the mounting distance is short and even a shallow panel creates a recirculation zone that covers the cooking surface. At 48-inch mounting height, the minimum effective panel depth increases to 12 to 16 inches.

### 3.5 Negative Effects of Panels

Panels improve capture performance but introduce potential adverse effects that must be evaluated and managed.

#### 3.5.1 Recirculation Zone Formation

When wind flows past a panel edge (particularly the lower edge of a deep panel), the flow separates and forms a recirculation zone immediately downstream. Within this zone, the airflow direction is reversed relative to the freestream, potentially creating a region where plume gas is trapped and recirculated rather than exhausted.

**Conditions for problematic recirculation:**

- **Deep panels (f > 0.75) with high wind (> 8 mph).** The recirculation zone can extend from the panel's lower edge inward to the plume centerline, creating a vortex that traps contaminant-laden air at the cooking surface level. The trapped gas recirculates between the panel face, the cooking surface, and the plume, delaying its entry into the exhaust.

- **Single-panel configuration with strong crosswind.** A single panel on the windward side creates a recirculation zone on its leeward face that extends to the opposite (unblocked) side of the hood. Plume gas drawn into this recirculation zone may be transported laterally and escape on the opposite side.

**Quantitative recirculation thresholds:**

| Panel Depth (f) | Wind Speed Threshold for Problematic Recirculation | Manifestation |
|---|---|---|
| < 0.50 | > 15 mph | Recirculation zone too small to significantly affect plume capture |
| 0.50 - 0.67 | > 10 mph | Intermittent recirculation at panel lower edge; minor contaminant trapping |
| 0.67 - 0.85 | > 7 mph | Sustained recirculation zone; contaminant trapping near cooking surface |
| > 0.85 | > 5 mph | Strong recirculation; trapped smoke may linger at operator head level |

**Mitigation:** The recirculation problem is most severe with full-height panels (f = 1.00) in strong wind. It is effectively avoided by limiting panel depth to f = 0.67 or less. At this depth, the gap between the panel's lower edge and the cooking surface is sufficiently large (10 inches at a 30-inch mount) that the recirculation zone does not interfere with the cooking zone. Additionally, angling the panel's lower edge outward by 10 to 15 degrees (a flared lower edge) disrupts the recirculation vortex by allowing clean air to feed into the zone from below.

#### 3.5.2 Turbulence Amplification at Panel Edges

The edges of a panel (particularly the lower edge and the forward vertical edges of side panels) generate turbulent vortices as wind flows past them. These vortices can momentarily displace the plume or create localized high-velocity fluctuations at the hood perimeter.

**Conditions for significant turbulence amplification:**

- Wind speeds above 8 mph with panels at f = 0.50 or greater
- The turbulence intensity within the sheltered zone increases from approximately 0.20 (background) to 0.35 to 0.45
- The increased turbulence causes the plume to wander more rapidly within the sheltered zone

**Practical impact:** The plume wanders within a volume defined by the sheltered zone, but this volume is now within the expanded **Capture Envelope** created by the panels. The net effect is positive — the plume wanders more but within a contained volume — provided the panel depth is sufficient. The negative impact is limited to configurations where panels are too shallow to contain the increased wandering (f < 0.25 in wind above 8 mph).

**Mitigation:** Panel edges should be finished with rounded or rolled edges rather than sharp edges to reduce vortex shedding intensity. For panel depths exceeding f = 0.50, the lower edge should incorporate a 2 to 3 inch outward flare (lip) to smooth the airflow transition.

#### 3.5.3 Combustion Air Restriction

From the analysis in Section 2.6, combustion air restriction is not a practical concern for any standard outdoor cooking source at panel depths up to f = 0.75, provided the front face remains open.

The minimum open area for combustion air supply is approximately 56 sq in for the highest-output gas grill (60,000 BTU/hr). A front opening of 30 inches wide and 8 inches high (corresponding to f = 0.73 at a 30-inch mount) provides 240 sq in — more than 4 times the requirement.

**Exception:** Charcoal and wood-fired sources that require airflow from below and around the fuel bed may experience reduced draft if panels extend to within 4 inches of the grill body on three sides. The restricted airflow path can reduce the chimney effect that drives combustion air through the fuel bed. This manifests as slower fire startup, lower cooking temperature, and increased smoke production from incomplete combustion.

**Mitigation:** For charcoal and wood-fired sources, maintain a minimum 6-inch gap between the panel lower edge and the grill body on at least two sides. Alternatively, incorporate ventilation slots (2 to 3 inch perforations or louvers) in the lower 4 inches of the panel to allow combustion air passage while maintaining wind blocking above.

#### 3.5.4 Operator Access and Ergonomic Interference

Panels that extend more than 15 inches below the hood face (f > 0.50 at 30 inches) begin to interfere with the operator's ability to reach across the cooking surface, see the food, and manipulate tools. The interference is direction-specific:

- **Side panels:** Limit lateral reaching across the grill. For a grill 24 inches wide with side panels at f = 0.50 (15 inches deep at 30-inch mount), the clear working height between the panel lower edge and the grill surface is 15 inches. An adult can comfortably reach horizontally under a 15-inch clearance but cannot perform overhead motions.

- **Rear panel:** Does not affect operator access from the front. May block access to rear burner controls or rear grill lid supports on some models.

- **Front panel / curtain:** Directly interferes with the operator's primary access path and should not extend below mid-torso height of the operator (approximately f = 0.33 to 0.40, depending on mounting height and operator height).

**Practical recommendations:**

| Panel Position | Maximum f for Unrestricted Access | Maximum f for Acceptable Access | f Requiring Special Provisions |
|---|---|---|---|
| Side panels | 0.40 | 0.60 | > 0.60 (use fold-out or removable panels) |
| Rear panel | 0.67 | 0.85 | > 0.85 (permanent rear wall acceptable) |
| Front panel | 0.25 | 0.33 | > 0.33 (interferes with cooking; not recommended) |

#### 3.5.5 Thermal Buildup in Enclosed Space

Panels reduce convective cooling of the space beneath the hood. The radiant heat from the cooking surface and the convective heat from the plume that would normally be dispersed into the ambient atmosphere are partially retained within the paneled enclosure. This increases the ambient temperature at the operator's face and hands.

The temperature increase within the enclosure is approximately:

> Delta_T_enclosure = Q_retained / (m_dot_front * c_p)

where Q_retained is the fraction of cooking heat retained by the panels (approximately 15 to 30% of Q_c for three panels at f = 0.50), and m_dot_front is the air mass flow through the front opening.

For a Gas Grill Medium (Q_c = 8.2 kW) with three panels at f = 0.50 and 609 CFM exhaust:

> Q_retained approximately equals 0.20 * 8.2 = 1.64 kW

> m_dot_front approximately equals 0.20 kg/s (estimated from the front opening fraction of total exhaust)

> Delta_T_enclosure approximately equals 1640 / (0.20 * 1000) = 8.2 degrees C (15 degrees F)

This is a noticeable but tolerable temperature increase for the operator. At panel depths of f = 0.67 or greater, the temperature increase rises to approximately 12 to 18 degrees C (22 to 32 degrees F), which may become uncomfortable during prolonged summer cooking.

**Mitigation:** Thermal buildup is manageable at panel depths up to f = 0.50. For deeper panels, ventilation slots in the lower portion of the panels (as recommended in Section 3.5.3) provide dual benefit: combustion air passage and thermal relief. Additionally, the slightly elevated temperature within the enclosure reinforces plume buoyancy, partially offsetting the negative effect with improved plume coherence and upward velocity.

### 3.6 Panel Configuration Effectiveness by Wind Exposure Class

Combining the wind reduction models (Section 3.1), Effective Capture Area improvements (Section 3.2), and the wind exposure classification from RB-006 Section 3.8, the following table presents the recommended panel configuration for each wind exposure class.

#### Table 3.6a: Recommended Panel Configuration — Gas Grill Medium at 30"

| Wind Class | Wind Speed (cooking height) | Without Panels Capture (%) | Recommended Panels | Panel f | With Panels Capture (%) | CFM Adjustment |
|---|---|---|---|---|---|---|
| Sheltered | < 3 mph | > 90% | None required | — | > 90% | K_CFM = 3.0 (baseline) |
| Moderate | 3 - 7 mph | 55 - 80% | Two side panels | 0.33 - 0.50 | 80 - 92% | K_CFM = 3.0 |
| Moderate | 3 - 7 mph | 55 - 80% | Sides + rear | 0.33 - 0.50 | 88 - 95% | K_CFM = 3.0 |
| Exposed | 7 - 12 mph | 30 - 55% | Sides + rear | 0.50 - 0.67 | 70 - 85% | K_CFM = 3.68 |
| Exposed | 7 - 12 mph | 30 - 55% | Full enclosure (front open) | 0.50 - 0.67 | 80 - 92% | K_CFM = 3.68 |
| Severe | > 12 mph | < 30% | Full enclosure required | 0.75 - 1.00 | 65 - 80% | K_CFM = 5.0+ |

#### Table 3.6b: Recommended Panel Configuration — Charcoal Kettle at 30"

| Wind Class | Wind Speed | Without Panels Capture (%) | Recommended Panels | Panel f | With Panels Capture (%) | CFM Adjustment |
|---|---|---|---|---|---|---|
| Sheltered | < 3 mph | > 85% | None required | — | > 85% | K_CFM = 3.0 |
| Moderate | 3 - 7 mph | 40 - 65% | Sides + rear | 0.40 - 0.55 | 75 - 88% | K_CFM = 3.0 |
| Exposed | 7 - 12 mph | 15 - 40% | Sides + rear | 0.55 - 0.70 | 55 - 72% | K_CFM = 3.68 - 5.0 |
| Exposed | 7 - 12 mph | 15 - 40% | Full enclosure (front open) | 0.55 - 0.70 | 65 - 80% | K_CFM = 3.68 - 5.0 |
| Severe | > 12 mph | < 15% | Full enclosure + CFM | 0.75 - 1.00 | 50 - 70% | K_CFM = 6.0+ |

**Key findings from the wind exposure analysis:**

1. **Three panels (sides + rear) at f = 0.50 recover near-still-air performance at Moderate wind exposure for gas grill sources.** Capture efficiency with panels (88 to 95%) approaches the still-air baseline (>90%) without requiring any CFM increase. This confirms the RB-006 preliminary finding that side panels are the most cost-effective wind mitigation.

2. **Charcoal sources require deeper panels and higher CFM than gas sources at the same wind class.** The weaker charcoal plume is more readily disrupted even within the partially sheltered environment. Three panels at f = 0.40 to 0.55 plus baseline CFM are required for the charcoal kettle to achieve 75 to 88% capture in Moderate wind — compared to 88 to 95% for the gas grill with the same configuration.

3. **The Exposed wind class is the practical limit for conventional panel configurations.** Even with full three-panel enclosure at f = 0.67 plus elevated CFM (K_CFM = 3.68), capture efficiency for gas grills is 70 to 85%, and for charcoal it is 55 to 72%. In the Exposed class, the panels convert an impractical situation (30% capture without panels) into a marginal one (70 to 85% capture with panels). Full enclosure provides an additional 10 to 15% improvement.

4. **The Severe wind class requires full enclosure (f = 0.75 to 1.00) and elevated CFM to achieve even 65 to 80% capture.** No panel configuration without full enclosure provides reliable capture at wind speeds above 12 mph. The Severe class recommendation from RB-006 (postpone cooking or enclose the cooking area) is confirmed.

### 3.7 Optimal Panel Dimensions by Installation Scenario

The following consolidated tables present the recommended panel specifications for the most common installation scenarios. The values represent the balance between capture effectiveness, operator access, thermal comfort, and combustion air supply.

#### Table 3.7a: Panel Specifications — Gas Grill Medium, Wall-Mount Installation

| Mounting Height | Wind Class | Panel Config | Panel Depth (in) | f | Panel Material Min | Capture with Panels (%) |
|---|---|---|---|---|---|---|
| 18" | Moderate | Sides only | 6 | 0.33 | 20-gauge SS or equiv | 92 - 96% |
| 18" | Exposed | Sides + rear wall | 8 | 0.44 | 20-gauge SS or equiv | 85 - 92% |
| 24" | Moderate | Sides only | 8 | 0.33 | 20-gauge SS or equiv | 88 - 94% |
| 24" | Exposed | Sides + rear wall | 12 | 0.50 | 18-gauge SS or equiv | 80 - 88% |
| 30" | Moderate | Sides only | 10 | 0.33 | 18-gauge SS or equiv | 85 - 92% |
| 30" | Exposed | Sides + rear wall | 15 | 0.50 | 18-gauge SS or equiv | 75 - 85% |
| 36" | Moderate | Sides + rear wall | 14 | 0.39 | 18-gauge SS or equiv | 82 - 90% |
| 36" | Exposed | Sides + rear wall + CFM | 20 | 0.56 | 16-gauge SS or equiv | 72 - 82% |
| 48" | Moderate | Sides + rear wall | 20 | 0.42 | 16-gauge SS or equiv | 78 - 86% |
| 48" | Exposed | Full enclosure + CFM | 30 | 0.63 | 16-gauge SS or equiv | 68 - 78% |

Note: Wall-mount installations inherently include the rear wall as part of the building structure. The "rear wall" entry in the panel config column refers to this structural wall, not an additional panel. Therefore, "sides + rear wall" for wall-mount means only two fabricated panels (the sides) plus the existing wall.

#### Table 3.7b: Panel Specifications — Gas Grill Medium, Island Installation

| Mounting Height | Wind Class | Panel Config | Panel Depth (in) | f | Capture with Panels (%) | Notes |
|---|---|---|---|---|---|---|
| 18" | Moderate | Sides + rear | 6 | 0.33 | 90 - 95% | Front open for operator |
| 18" | Exposed | Full enclosure (front open) | 9 | 0.50 | 82 - 90% | |
| 24" | Moderate | Sides + rear | 10 | 0.42 | 86 - 93% | |
| 24" | Exposed | Full enclosure (front open) | 14 | 0.58 | 78 - 86% | |
| 30" | Moderate | Sides + rear | 12 | 0.40 | 84 - 92% | |
| 30" | Exposed | Full enclosure (front open) | 18 | 0.60 | 75 - 83% | |
| 36" | Moderate | Sides + rear | 16 | 0.44 | 80 - 88% | |
| 36" | Exposed | Full enclosure (front open) | 22 | 0.61 | 70 - 80% | |
| 48" | Moderate | Sides + rear | 22 | 0.46 | 75 - 84% | |
| 48" | Exposed | Full enclosure + high CFM | 32 | 0.67 | 65 - 76% | K_CFM = 5.0+ |

**Island installations require one additional panel (rear) compared to wall-mount.** The total panel requirement for island installations in Moderate wind is three panels (both sides plus rear); for wall-mount, only two fabricated panels (both sides) are needed because the wall provides the rear barrier.

#### Table 3.7c: Panel Specifications — Charcoal Kettle, Recommended Configurations

| Mounting Height | Wind Class | Panel Config | Panel Depth (in) | f | Capture with Panels (%) | Notes |
|---|---|---|---|---|---|---|
| 18" | Moderate | Sides + rear | 7 | 0.39 | 82 - 90% | Mount as low as possible for charcoal |
| 18" | Exposed | Full enclosure (front open) | 10 | 0.56 | 72 - 82% | |
| 24" | Moderate | Sides + rear | 10 | 0.42 | 78 - 86% | |
| 24" | Exposed | Full enclosure (front open) | 16 | 0.67 | 65 - 76% | Combustion air slots recommended |
| 30" | Moderate | Sides + rear | 14 | 0.47 | 74 - 84% | |
| 30" | Exposed | Full enclosure (front open) | 20 | 0.67 | 60 - 72% | Combustion air slots required |

Charcoal ventilation at mounting heights above 30 inches in the Exposed wind class is not recommended regardless of panel configuration, consistent with RB-006 Section 4.5.

### 3.8 Combined Panel-Plus-CFM Optimization

The interaction between panel configuration and exhaust rate defines the optimal operating point for each installation scenario. Panels reduce the effective wind at the plume, allowing a lower CFM to achieve the same capture efficiency. Conversely, increased CFM supplements panel sheltering by strengthening edge capture on the open (front) face.

#### Table 3.8: CFM Reduction Achievable with Panels — Gas Grill Medium at 30"

| Wind Speed | CFM Without Panels (from RB-006 Table 4.3) | With Sides + Rear (f=0.50) — Required CFM | CFM Savings | Savings (%) |
|---|---|---|---|---|
| Still air | 609 | 609 | 0 | 0% |
| 3 mph | 609 | 609 | 0 | 0% |
| 5 mph | 840 | 609 | 231 | 28% |
| 7 mph | 1,095 | 750 | 345 | 32% |
| 8 mph | 1,095 | 840 | 255 | 23% |
| 10 mph | 1,218+ | 1,095 | 123+ | 10%+ |

**Key findings:**

1. **At 5 mph, three panels eliminate the need for any CFM increase above the still-air baseline.** The standard K_CFM = 3.0 CFM (609 CFM for Gas Medium at 30") is sufficient with three panels at f = 0.50. Without panels, the same 5 mph condition requires 840 CFM (F_wind = 1.8 from RB-006 Table 4.3).

2. **At 7 mph, three panels reduce the required CFM from 1,095 to 750 — a 32% savings.** This is the wind speed range where panels provide the greatest CFM benefit, because without panels the required CFM has escalated sharply, but with panels the wind is reduced to the Moderate level where modest CFM suffices.

3. **At 10 mph, panels provide diminishing CFM benefit.** The effective wind within the panel enclosure is still 3 to 5 mph (after the 50 to 60% reduction), requiring elevated CFM. The panels convert an impossible situation (1,218+ CFM without panels, still only 75 to 85% capture) into a difficult one (1,095 CFM with panels, 80 to 88% capture).

4. **The optimal operating point is three panels (sides + rear) at f = 0.50 with baseline CFM (K_CFM = 3.0).** This combination achieves 88 to 95% capture at Moderate wind exposure (3 to 7 mph) without requiring any CFM increase, blower upgrade, or duct modification. It is the most cost-effective overall solution for the majority of outdoor cooking installations.

### 3.9 Answers to Key Research Questions

**Key Question 1: How does adding side panels change the hood's Effective Capture Area?**

Side panels improve the **Effective Capture Area** through two mechanisms: reduced ambient infiltration from the blocked sides and velocity redistribution toward the remaining open faces. The improvement depends on the number of panels and the panel depth:

- Two side panels at f = 0.50 increase K_panel by approximately 1.20, raising the effective capture area by 20%.
- Three panels (sides + rear) at f = 0.50 increase K_panel by approximately 1.40, raising the effective capture area by 40%.
- Full enclosure at f = 0.50 increases K_panel by approximately 1.60, raising the effective capture area by 60%.

For a properly baffled 57 x 53 inch hood, three panels at f = 0.50 raise the Effective Capture Area from approximately 2,400 sq in (80% of face area) to approximately 3,000 sq in (approximately 100% of face area). This means the hood performs as if its entire face opening contributes to capture — the ideal operating state.

**Key Question 2: What is the minimum panel depth required to meaningfully improve capture in crosswind?**

The minimum panel depth for meaningful (10%) improvement depends on wind speed and configuration:

- At 2 mph wind: 6 to 8 inches (f = 0.20 to 0.27 at 30 inches)
- At 5 mph wind: 8 to 10 inches (f = 0.27 to 0.33 at 30 inches)
- At 8 mph wind: 11 to 14 inches (f = 0.37 to 0.47 at 30 inches)

Below 8 inches of panel depth at a 30-inch mounting height, the panels function primarily as extended hood lips and provide minimal wind sheltering. The threshold at 8 inches (f approximately 0.27) marks the transition from "decorative" to "functional" panel depth.

**Key Question 3: Do panels create negative effects under certain conditions?**

Yes. Five negative effects are identified:

1. **Recirculation zone formation** becomes problematic at f > 0.75 in wind above 7 mph. Mitigation: limit f to 0.67 or incorporate flared lower edges.
2. **Turbulence amplification at panel edges** increases plume wandering at f > 0.50 in wind above 8 mph. Mitigation: rounded panel edges and sufficient panel depth to contain the increased wandering within the expanded Capture Envelope.
3. **Combustion air restriction** is not a practical concern at f below 0.75 with the front face open. For charcoal and wood-fired sources at f > 0.60, ventilation slots in the lower panel section are recommended.
4. **Operator access interference** becomes significant at f > 0.60 for side panels and f > 0.33 for front panels. Mitigation: use fold-out, sliding, or removable panels for deep configurations.
5. **Thermal buildup** increases ambient temperature within the enclosure by approximately 8 to 18 degrees C (15 to 32 degrees F) at f = 0.50 to 0.67 for a medium gas grill. Mitigation: ventilation slots in the lower panel section.

The practical design envelope that avoids all significant negative effects is f = 0.33 to 0.60 for side panels and f = 0.33 to 0.67 for the rear panel, with the front face remaining open. Within this range, the capture improvement is substantial (20 to 50% Effective Capture Area increase, 55 to 70% wind reduction) and the negative effects are negligible or manageable.

---

## 4. Implications for Outdoor BBQ Ventilation

### 4.1 Panels Are Not Optional for Outdoor Installations

The analysis in this paper, combined with the wind exposure data from RB-006, establishes that side panels are a core design requirement — not an accessory — for any outdoor cooking installation classified as Moderate wind exposure or higher. The RB-006 wind exposure classification found that Moderate conditions (3 to 7 mph at cooking height) correspond to typical open patio environments. This means that the majority of real-world outdoor cooking installations require panels for reliable capture.

The specific recommendation is:

- **Sheltered class (< 3 mph):** Panels optional. Standard hood per RB-005 is adequate.
- **Moderate class (3 to 7 mph):** Two side panels minimum (f = 0.33 to 0.50). Three panels (sides + rear) recommended. No CFM increase required with three panels.
- **Exposed class (7 to 12 mph):** Three panels required (f = 0.50 to 0.67). Full enclosure recommended. CFM increase to K_CFM = 3.68 recommended.
- **Severe class (> 12 mph):** Full enclosure required (f = 0.75 to 1.00). Elevated CFM (K_CFM = 5.0+). Without enclosure, conventional hood capture is impractical.

### 4.2 The Cost-Effectiveness of Panels Versus Alternatives

Building on the cost-effectiveness hierarchy from RB-005 Section 4.6, panels occupy the second position (after mounting height reduction) in the wind mitigation hierarchy:

| Intervention | Typical Cost | Capture Improvement at 5 mph | Cost per 10% Capture Gain |
|---|---|---|---|
| Reduce mounting height by 6" | $0 - 300 | +8 - 15% | $0 - 37 |
| Add two side panels (f=0.50) | $150 - 500 | +12 - 18% | $13 - 42 |
| Add rear panel (making three total) | $75 - 250 | +8 - 12% (incremental) | $9 - 31 |
| Increase hood width by 12" | $400 - 1,200 | +5 - 10% | $80 - 240 |
| Increase CFM by 80% | $300 - 1,000 | +8 - 12% | $38 - 125 |

Three panels (sides + rear) at a total cost of approximately $225 to $750 provide 20 to 30% capture improvement at 5 mph — comparable to a combination of a 12-inch wider hood ($400 to $1,200) and an 80% CFM increase ($300 to $1,000). The panel solution costs approximately one-third to one-quarter as much as the geometry-plus-CFM alternative while delivering equivalent or superior capture performance.

### 4.3 Panel Design Principles

Based on the analysis in Section 3, the following design principles govern effective panel systems for outdoor cooking hoods:

**Principle 1 — Three sides, front open.** The standard configuration is three panels (both sides plus rear) with the front face open for operator access. This provides protection from three of four wind directions and allows the operator full frontal access to the cooking surface.

**Principle 2 — Panel depth of f = 0.40 to 0.55 is optimal.** This range (12 to 17 inches at a 30-inch mount) provides substantial wind reduction (35 to 55%) without creating problematic recirculation zones, restricting combustion air, or significantly interfering with operator access.

**Principle 3 — Panels must be solid.** Perforated, louvered, or mesh panels provide reduced wind sheltering proportional to their solidity ratio. A panel with 30% open area provides only approximately 65% of the wind reduction of a solid panel. For primary wind blocking, panels should be solid, with ventilation provided only in the lowest 3 to 4 inches for combustion air supply to charcoal and wood-fired sources.

**Principle 4 — Panels should extend to or slightly beyond the hood edge.** The panel width (horizontal extent parallel to the hood face) should be at least equal to the hood's depth dimension on the side faces and the hood's width dimension on the rear face. Panels narrower than the hood face create gaps at the corners through which wind can enter.

**Principle 5 — Removable or adjustable panels are preferable.** Because panel needs vary with wind conditions and cooking mode, adjustable-depth or removable panels allow the operator to configure the enclosure appropriately. In still air, panels can be removed or folded up for maximum access and ventilation. In wind, they are deployed to the appropriate depth.

### 4.4 Interaction with Hood Lip and Baffle Design

Panels and hood lips serve complementary functions. The hood lip (from RB-005 Section 3.3) improves capture in the vertical dimension (extending the **Capture Envelope** downward from the hood face) while panels improve capture in the horizontal dimension (extending the Capture Envelope laterally and blocking wind). The combined effect is multiplicative:

| Configuration | Composite Capture Improvement (relative to bare flat-bottom hood) |
|---|---|
| 3" lip only | 1.25 - 1.40x |
| Two side panels (f=0.50) only | 1.20 - 1.35x |
| 3" lip + two side panels | 1.45 - 1.75x |
| 3" lip + three panels (f=0.50) | 1.65 - 2.00x |
| 3" lip + three panels (f=0.50) + full baffles | 2.00 - 2.50x |

A hood with a 3-inch lip, three panels at f = 0.50, and full internal baffles provides 2.0 to 2.5 times the effective capture performance of a bare flat-bottom hood of the same dimensions and CFM. This means a well-equipped 48-inch hood can outperform a bare 60 to 66 inch hood — confirming the RB-005 finding that design quality outperforms raw size.

### 4.5 Panels as a Substitute for Hood Oversizing

One of the most significant practical implications is that panels can substitute for hood oversizing in wind-exposed installations. RB-006 Section 3.9.5 showed that compensating for 5 mph wind by overhang alone requires approximately 12 inches of additional hood width per side (total hood width increase of 24 inches). This can push the required hood into the 69 to 81 inch range — impractical for many residential installations.

With three panels at f = 0.50, the effective wind at the plume is reduced by approximately 50%, which reduces the required additional overhang from 12 inches to approximately 5 to 6 inches per side (or, with good panels, eliminates the need for additional overhang entirely). The standard RB-005 recommended hood width suffices.

This translates to a potential hood size reduction of 12 to 24 inches in width for wind-exposed installations — a significant savings in material cost, installation complexity, visual impact, and structural support requirements.

### 4.6 Impact on Downstream Topics

**RB-007 (Failure Modes):** Panels convert several wind-driven failure modes (lateral plume escape, wind-enhanced entrainment, plume disruption) from "inherent to outdoor installation" to "manageable with standard equipment." The failure mode analysis should distinguish between paneled and unpaneled configurations.

**RB-008 (CFM Requirements):** For paneled installations, the CFM requirement can be reduced. Three panels at f = 0.50 in the Moderate wind class allow baseline CFM (K_CFM = 3.0) instead of the wind-corrected value (K_CFM = 3.68 or higher). This reduces blower size, energy consumption, and noise by 20 to 30% relative to the wind-corrected specification.

**RB-010 (Material Selection):** Panel materials must withstand outdoor environmental exposure (UV, moisture, temperature cycling), resist grease deposition (panels are within the grease-laden capture zone), and tolerate the thermal environment (radiant heat from the cooking surface, convective heat from the plume). Panel material requirements are distinct from hood body requirements because panels are closer to the heat source and more exposed to direct grease impingement.

---

## 5. Knowledge Gaps or Opportunities

### 5.1 Well-Established Knowledge

The following aspects of panel and wind barrier physics are well-established in the wind engineering and building science literature:

1. **Wind sheltering by solid barriers.** The reduction of wind speed downstream of a solid fence or wall is extensively studied (Plate, 1971; Raine & Stevenson, 1977; Wilson, 1985). The sheltering factors used in this paper (20 to 40% of freestream within the recirculation zone) are standard results.

2. **Recirculation zone dimensions.** The length and depth of the recirculation zone behind a vertical barrier as a function of barrier height are well-characterized for simple geometries (Meroney & Melbourne, 1992).

3. **The principle that physical barriers outperform aerodynamic compensation for wind mitigation** is standard practice in industrial ventilation design (ACGIH Industrial Ventilation Manual).

### 5.2 Areas of Moderate Uncertainty

1. **Panel wind reduction coefficients.** The R_panel values in Tables 3.1a through 3.1c are derived from general wind engineering sheltering data adapted to the specific geometry of an outdoor cooking installation. The actual wind reduction depends on the three-dimensional flow field around the hood, grill, panel arrangement, and surrounding structures (countertop, wall, adjacent objects). The stated values carry approximately 20 to 30% uncertainty.

2. **K_panel values for Effective Capture Area.** The Effective Capture Area improvement factors are estimated from the infiltration reduction and velocity redistribution analysis. They have not been measured for outdoor cooking hood configurations specifically. The values likely overstate improvement for configurations with gaps between panels and the hood body, and understate improvement for tightly sealed panel-to-hood connections.

3. **Negative effect thresholds.** The Froude-number-based recirculation thresholds and the fractional-enclosure limits for operator access are engineering estimates based on general fluid dynamics and ergonomic principles. The specific thresholds for outdoor cooking scenarios (where the operator is reaching over hot surfaces, wearing gloves, and managing tools) may differ from the values stated.

4. **Thermal buildup estimates.** The temperature increase calculations assume simplified steady-state heat balance. Actual temperatures within the paneled enclosure depend on solar radiation, ambient temperature, wind-driven convective cooling through the front opening, and the specific cooking mode. Summer conditions with direct solar exposure may produce higher temperatures than the estimates.

### 5.3 Knowledge Gaps Requiring Further Research

1. **No experimental data on side panel effectiveness for outdoor cooking hoods.** The entire analysis rests on adaptation of wind engineering sheltering data and first-principles modeling. No published study has measured capture efficiency improvement from side panels on outdoor barbecue hoods at controlled wind speeds. Field or wind tunnel experiments with representative hood-grill-panel configurations would provide critical validation.

2. **CFD simulation of panel-hood-plume-wind interaction.** The coupled four-way interaction (panel sheltering modifying wind, modified wind affecting plume trajectory, plume entering the panel-modified hood suction field, and the exhaust altering the pressure distribution around the panels) is beyond the reach of the integral models used in this paper. Parametric CFD simulation would refine the panel effectiveness estimates, identify optimal panel geometry (depth, angle, gap size, edge treatment), and reveal flow patterns (recirculation zones, stagnation points, vortex structures) that the analytical model cannot predict.

3. **Optimal panel edge geometry.** This paper treats panels as simple flat vertical barriers. In practice, the panel's lower edge geometry (sharp, rounded, flared, perforated) significantly affects the flow separation characteristics, recirculation zone intensity, and turbulence generation. No published study has optimized panel edge geometry for the specific application of outdoor cooking hood wind protection.

4. **Adjustable panel systems.** The practical recommendation for removable or adjustable panels introduces design questions about hinge mechanisms, retention systems, sealing between panels and the hood body, and durability under repeated deployment/retraction cycles. These are engineering design questions that require prototype testing.

5. **Multi-source panel configurations.** Outdoor kitchens with multiple cooking appliances (grill + side burner, grill + smoker, two grills) under a single hood require panel configurations that shelter multiple plumes simultaneously. The panel geometry for multi-source configurations — shared panels between sources, extended panel lengths, gap management — has not been analyzed.

6. **Panel effects on grease deposition patterns.** Panels redirect airflow within the cooking zone, which may alter where grease aerosol deposits. If panels cause grease to concentrate on the hood's front lip or the operator's workspace instead of being distributed across the hood interior, this creates maintenance and cleanliness concerns. Grease deposition patterns with and without panels should be characterized (relevant to RB-011).

7. **Long-term durability and maintenance.** Panels in the outdoor cooking environment are exposed to heat, grease, moisture, UV radiation, and mechanical handling. Long-term material performance data specific to this application (stainless steel, aluminum, tempered glass, high-temperature polymers) would inform material selection recommendations for RB-010.

---

## 6. Diagram Mapping Notes (Text Only)

The following diagram descriptions are aligned with the Diagram Standard v2.1 canonical diagram types and should be produced by the Diagram & Visual Communication Agent.

### Diagram 6.1: Side Panel Wind Sheltering — Flow Visualization (Diagram Type 1 — Schematic Cross-Section)

**Purpose:** Illustrate the flow field around a hood with two side panels, showing the recirculation zone, wind reduction, and plume trajectory modification.

**Content:**
- Plan view (top-down) of a hood with two side panels, cooking surface centered beneath
- Wind arrows approaching from the left (lateral crosswind)
- Without panels (faded overlay): plume deflected far to the right, exiting the hood boundary; labeled "**Missed Plume Region** without panels"
- With panels (solid): flow separation at the left panel's outer edge, recirculation zone shown with curved arrows in the lee of the left panel, reduced-velocity arrows within the sheltered zone, plume deflected modestly but remaining within the hood boundary
- Panel depth labeled as h_panel with fractional enclosure f = 0.50
- Wind speed annotations: "U_w = 5 mph freestream" outside the panels, "U_eff approximately 2.5 mph within sheltered zone" between the panels
- The **Capture Envelope** shown as the region between the panels and beneath the hood
- Figure caption: "Figure 9.1: Plan view of wind flow modification by two side panels at f = 0.50 in a 5 mph crosswind. The panels create a recirculation zone on their leeward sides that reduces the effective wind speed at the cooking surface by approximately 50%. The plume (shown deflected) remains within the Capture Envelope with panels installed, whereas without panels it would exit the hood boundary."

### Diagram 6.2: Panel Depth versus Wind Reduction — Parametric Chart (Diagram Type 2 — Quantitative Chart)

**Purpose:** Provide a quantitative reference for the relationship between panel depth (fractional enclosure f) and wind reduction coefficient R_panel for each panel configuration.

**Content:**
- X-axis: fractional enclosure f (0 to 1.0)
- Y-axis: wind reduction coefficient R_panel (0 to 1.0)
- Four curves: two side panels (lateral wind), three panels (rear wind), three panels (all-direction average), full enclosure (all-direction average)
- Shaded zones: f < 0.25 labeled "Minimal effect — equivalent to deep lip"; 0.25 < f < 0.50 labeled "Moderate sheltering"; 0.50 < f < 0.67 labeled "Strong sheltering — recommended range"; f > 0.67 labeled "Near-full enclosure — negative effects may emerge"
- Horizontal dashed lines at R_panel = 0.50 (Moderate class to Sheltered) and R_panel = 0.70 (Exposed class to Moderate) showing the wind reduction needed to shift one exposure class
- Figure caption: "Figure 9.2: Wind reduction coefficient R_panel as a function of fractional enclosure f for four panel configurations. The recommended operating range of f = 0.33 to 0.60 provides 25 to 60% wind reduction depending on configuration and wind direction. Three panels (sides + rear) provide the best balance of wind protection and operator access."

### Diagram 6.3: Capture Envelope Comparison — No Panels, Two Panels, Three Panels (Diagram Type 4 — Comparative)

**Purpose:** Visually compare the **Capture Envelope** volume for three configurations.

**Content:**
- Three side-by-side front-view cross-sections showing the same hood at 30 inches over a cooking surface:
  1. No panels, 3" lip: **Capture Envelope** shown as a shallow trapezoidal region extending approximately 11 inches below the hood face. Plume shown rising vertically into the hood, with wind arrows deflecting the plume edge beyond the hood boundary on the right. **Missed Plume Region** shaded red.
  2. Two side panels (f=0.50): **Capture Envelope** extended downward to 15 inches on the panel sides and 11 inches on the front and rear. Side panels shown as vertical barriers. Plume deflected less (reduced wind within the sheltered zone). Smaller **Missed Plume Region**.
  3. Three panels (sides + rear, f=0.50): **Capture Envelope** extended to 15 inches on sides and rear, 11 inches on front. Plume nearly vertical within the enclosed volume. **Missed Plume Region** minimal or absent.
- Volume annotations for each configuration: "V = 20 cu ft", "V = 34 cu ft", "V = 42 cu ft"
- Figure caption: "Figure 9.3: Front-view comparison of the Capture Envelope for three panel configurations at 30-inch mounting height in a 5 mph crosswind. The addition of side panels (center) increases the contained volume by 70% and reduces the Missed Plume Region. Adding the rear panel (right) doubles the contained volume and provides near-complete plume retention."

### Diagram 6.4: Negative Effects Map — Panel Depth versus Wind Speed (Diagram Type 2 — Heatmap)

**Purpose:** Show the regions of panel depth and wind speed where negative effects (recirculation, turbulence, thermal buildup) become significant.

**Content:**
- X-axis: wind speed at cooking height (0 to 15 mph)
- Y-axis: fractional enclosure f (0 to 1.0)
- Color-coded zones:
  - Green: "No significant negative effects — recommended operating region"
  - Yellow: "Minor turbulence amplification — manageable with edge treatment"
  - Orange: "Recirculation zone formation — limit panel depth or add flared edges"
  - Red: "Strong recirculation + thermal buildup — full enclosure design required"
- Boundary lines between zones
- Annotation: "Recommended design range: f = 0.33 to 0.60, wind 0 to 10 mph"
- Figure caption: "Figure 9.4: Negative effects map showing the relationship between panel depth (fractional enclosure f) and wind speed. Green zones indicate safe operation with no adverse effects. The recommended design range (f = 0.33 to 0.60) avoids all significant negative effects up to 10 mph wind."

### Diagram 6.5: Panel Configuration Decision Guide (Diagram Type 5 — Decision/Flow)

**Purpose:** Provide a practical decision guide for selecting panel configuration based on installation type and wind exposure class.

**Content:**
- Decision tree starting with "What is the installation type?"
  - Wall-mount: "Rear wall is provided by the building structure"
    - Sheltered class: "No additional panels required"
    - Moderate class: "Add two side panels, f = 0.33 to 0.50"
    - Exposed class: "Add two side panels, f = 0.50 to 0.67; increase CFM to K_CFM = 3.68"
    - Severe class: "Add side panels at f = 0.75+; add front curtain; K_CFM = 5.0+"
  - Island: "All four sides initially open"
    - Sheltered class: "No panels required, but two side panels recommended for gusty sites"
    - Moderate class: "Three panels (sides + rear), f = 0.33 to 0.50"
    - Exposed class: "Three panels at f = 0.50 to 0.67; consider full enclosure; K_CFM = 3.68"
    - Severe class: "Full enclosure (f = 0.75+); K_CFM = 5.0+; postpone cooking if no enclosure"
- Secondary branch: "Is the source charcoal or pellet smoker low?" --> Yes: "Increase f by 0.10 and mount at 18 to 24 inches maximum"
- Figure caption: "Figure 9.5: Panel configuration decision guide. Start by identifying the installation type (wall-mount or island) and wind exposure class (from RB-006). Follow the decision tree to determine the required panel configuration, depth, and CFM adjustment."

---

## Appendix A: Input Parameters from Dependency Papers

### A.1 Source Parameters from RB-001 (via RB-005 and RB-006)

| Source Type | Q_c (kW) | D_eff (m) | z_0 (m) | Cooking Surface (W x D, inches) |
|---|---|---|---|---|
| Gas Grill — Small | 5.1 | 0.43 | -0.30 | 18 x 19 |
| Gas Grill — Medium | 8.2 | 0.51 | -0.37 | 24 x 21 |
| Gas Grill — Large | 12.3 | 0.58 | -0.41 | 30 x 22 |
| Gas Grill — High-Output | 16.4 | 0.65 | -0.44 | 36 x 22 |
| Charcoal Kettle | 1.8 | 0.56 | -0.47 | 22 diameter |
| Wood-Fired | 7.6 | 0.50 | -0.36 | 24 x 16 |
| Pellet Smoker Low | 1.5 | 0.45 | -0.38 | 22 x 14 |
| Pellet Smoker High | 5.7 | 0.45 | -0.30 | 22 x 14 |

### A.2 Key Parameters from RB-005

| Parameter | Value | Source |
|---|---|---|
| Hood lip improvement factor (3" lip) | 1.25 - 1.40 | RB-005 Section 3.3.4 |
| eta_uniformity (baffled, with lip) | 0.75 - 0.85 | RB-005 Table 3.4.5 |
| Effective Capture Area (57x53" hood, baffled, lip) | 2,266 - 2,568 sq in | RB-005 Section 3.6 |
| Capture Envelope depth (flat, no lip) | 5.5 - 8.3 in | RB-005 Section 2.2 |
| Capture Envelope depth (3" lip) | 8.5 - 11.3 in | RB-005 Section 3.3.1 |
| Infiltration factor (island, no panels) | 0.50 - 0.65 | RB-005 Section 3.4.3 |
| Infiltration factor (wall-mount, no panels) | 0.40 - 0.55 | RB-005 Section 3.4.4 |

### A.3 Key Parameters from RB-006

| Parameter | Value | Source |
|---|---|---|
| Deflection formula | delta_x = 0.35 * U_w * z / u_0(z) | RB-006 Section 3.1 |
| Wind exposure classes | Sheltered (<3), Moderate (3-7), Exposed (7-12), Severe (>12 mph) | RB-006 Table 3.8 |
| Side panel wind reduction (preliminary) | 40 - 60% (full panels both sides) | RB-006 Section 3.9.1 |
| Rear wall wind reduction (preliminary) | 60 - 80% | RB-006 Section 3.9.2 |
| Gust factor (standard) | G = 1.7 | RB-006 Section 2.6 |
| Revised wind correction factor (5 mph) | F_wind = 1.8 | RB-006 Table 4.3 |
| Revised wind correction factor (8 mph) | F_wind = 2.5 - 3.0 | RB-006 Table 4.3 |

### A.4 Standard Ambient Conditions

| Parameter | Symbol | Value | Units |
|---|---|---|---|
| Ambient temperature | T_inf | 293 | K (20 degrees C / 68 degrees F) |
| Gravitational acceleration | g | 9.81 | m/s^2 |
| Ambient air density | rho_inf | 1.20 | kg/m^3 |
| Specific heat of air | c_p | 1.00 | kJ/(kg*K) |
| Entrainment coefficient (still air) | alpha_0 | 0.11 | dimensionless |

## Appendix B: Glossary Terms Used in This Paper (Glossary v1.1)

All eleven terms from Glossary v1.1 are used in this paper as defined:

| Term | Usage Context in This Paper |
|---|---|
| **Buoyant Cooking Plume** | The thermal plume rising from the cooking source whose capture panels are designed to protect |
| **Entrainment Zone** | The plume boundary region where ambient air is drawn into the plume; panels reduce entrainment from the blocked sides |
| **Near-Field Plume Region** | Referenced from RB-001; the zone immediately above the cooking surface where the plume is forming |
| **Velocity Decay** | The z^(-1/3) centerline velocity reduction that determines plume vulnerability to wind at each height |
| **Capture Envelope** | The 3D region beneath the hood where plume gas can be captured; panels expand this volume substantially |
| **Effective Capture Area** | The fraction of hood face area with sufficient velocity for capture; panels increase this via infiltration reduction |
| **Plume Interception Plane** | The horizontal plane at hood height where the plume cross-section is evaluated for capture |
| **Momentum-Limited Capture** | The condition where insufficient hood suction cannot overcome plume escape; panels reduce this by containing the plume |
| **Missed Plume Region** | The volume where plume gas escapes the hood boundary; panels minimize this by blocking lateral escape paths |
| **Open-Boundary Dilution** | The irreversible dispersal of plume gas once it escapes the hood; panels reduce exposure to this mechanism |
| **Wind-Affected Plume Behavior** | The deflection and disruption of the plume by outdoor wind; the primary problem that panels address |

## Appendix C: Unit Conversion Reference

| Quantity | SI | Imperial |
|---|---|---|
| Heat release rate | 1 kW | 3,412 BTU/hr |
| Velocity | 1 m/s | 197 ft/min (fpm) |
| Length | 1 m | 39.37 inches |
| Area | 1 m^2 | 1,550 sq in |
| Volume | 1 m^3 | 35.31 cubic feet |
| Volumetric flow | 1 m^3/s | 2,119 CFM |

---

## References

1. Plate, E.J. (1971). "The aerodynamics of shelter belts." *Agricultural Meteorology*, 8, pp. 203-222.

2. Raine, J.K. and Stevenson, D.C. (1977). "Wind protection by model fences in a simulated atmospheric boundary layer." *Journal of Wind Engineering and Industrial Aerodynamics*, 2, pp. 159-180.

3. Wilson, J.D. (1985). "Numerical studies of flow through a windbreak." *Journal of Wind Engineering and Industrial Aerodynamics*, 21, pp. 119-154.

4. Meroney, R.N. and Melbourne, W.H. (1992). "Operating ranges of meteorological wind tunnels for the simulation of convective boundary layer (CBL) phenomena." *Boundary-Layer Meteorology*, 61, pp. 145-174.

5. Heskestad, G. (2016). "Fire Plumes, Flame Height, and Air Entrainment." Chapter 13, *SFPE Handbook of Fire Protection Engineering*, 5th ed. Springer.

6. Morton, B.R., Taylor, G.I., and Turner, J.S. (1956). "Turbulent gravitational convection from maintained and instantaneous sources." *Proceedings of the Royal Society A*, 234, pp. 1-23.

7. Briggs, G.A. (1984). "Plume Rise and Buoyancy Effects." Chapter 8, *Atmospheric Science and Power Production*, ed. D. Randerson, DOE/TIC-27601.

8. ASHRAE (2019). *ASHRAE Handbook — HVAC Applications*, Chapter 33: Kitchen Ventilation.

9. ASHRAE Standard 154 (2016). *Ventilation for Commercial Cooking Operations*.

10. ACGIH (2019). *Industrial Ventilation: A Manual of Recommended Practice for Design*, 30th ed. American Conference of Governmental Industrial Hygienists.

11. Li, A. and Dai, G. (1996). "Experimental study on the effect of range hood geometry on capture efficiency." *Building and Environment*, 31(4), pp. 363-369.

12. Swierczyna, R., Sobiski, P.A., and Clerkin, E. (2003). "Ventilation for Commercial Cooking Operations — Optimizing Makeup Air." ASHRAE Research Project 1033-RP.

13. Fric, T.F. and Roshko, A. (1994). "Vortical structure in the wake of a transverse jet." *Journal of Fluid Mechanics*, 279, pp. 1-47.

14. Drysdale, D. (2011). *An Introduction to Fire Dynamics*, 3rd ed. John Wiley & Sons.

15. McNaughton, K.G. (1988). "Effects of windbreaks on turbulent transport and microclimate." *Agriculture, Ecosystems and Environment*, 22-23, pp. 17-39.

16. Wang, H. and Takle, E.S. (1995). "Boundary-layer flow and turbulence near porous obstacles." *Boundary-Layer Meteorology*, 74, pp. 73-88.

---

*This document is a research output of the Outdoor Ventilation Standard, governed by the Research Program Charter v2.6. All terms are used as defined in Glossary v1.1. This paper builds upon the hood geometry analysis of RB-005 and the wind interaction modeling of RB-006 to provide the definitive analysis of side panel and wind baffle effectiveness for outdoor barbecue ventilation.*
