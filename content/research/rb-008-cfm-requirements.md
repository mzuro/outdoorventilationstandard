---
title: "RB-008: CFM Requirements for Outdoor Cooking Ventilation"
date: 2025-12-04
lastmod: 2025-12-22
draft: false
type: "research"
series: "Outdoor Ventilation Standard"
research_id: "RB-008"
priority: "P2 — Applied"
status: "Complete"
version: "1.0"
charter_version: "2.6"
glossary_version: "1.1"
diagram_standard_version: "2.1"
description: "Develops a physics-based methodology for determining minimum exhaust airflow rates (CFM) for outdoor cooking hood applications. Integrates plume mass flow, hood geometry correction, and wind exposure adjustment into unified CFM sizing tables for all source types and mounting heights. Quantifies the outdoor correction factor relative to indoor CFM recommendations."
summary: "This paper synthesizes the plume physics of RB-001, the velocity decay and capture analysis of RB-003, the hood geometry effects of RB-005, and the wind interaction analysis of RB-006 into a unified, physics-based CFM sizing methodology for outdoor barbecue ventilation hoods. It delivers comprehensive CFM lookup tables for all source types at all standard mounting heights across four wind exposure classes, defines the outdoor correction factor relative to indoor baselines, establishes scaling relationships between cooking surface area, heat release rate, and required CFM, and provides wind exposure safety margins. The primary engineering deliverable is a set of consolidated design tables that integrate exhaust rate, hood geometry, and wind exposure into a single reference for outdoor hood specification."
tags: ["CFM sizing", "hood design", "airflow requirements"]
categories: ["P2 — Applied"]
dependencies:
  - "RB-001: Buoyant Plume Behavior from Barbecue and High-Heat Cooking Sources"
  - "RB-003: Velocity Decay and Near-Field vs. Far-Field Capture"
  - "RB-005: Impact of Hood Geometry on Capture Performance"
  - "RB-006: Wind Interaction and Cross-Flow Effects"
downstream_topics:
  - "RB-009: Side Panel and Wind Baffle Effectiveness"
  - "RB-010: Blower and Duct Sizing for Outdoor Installations"
  - "RB-012: Thermal Radiation and Plume Interaction at Hood Surfaces"
---

**Research Program:** Outdoor Ventilation Standard
**Charter Version:** 2.6
**Glossary Version:** 1.1
**Priority Tier:** P2 — Applied
**Author Role:** Hood Performance & Design Agent
**Date:** 2026-02-08
**Depends On:** RB-001: Buoyant Plume Behavior from Barbecue and High-Heat Cooking Sources; RB-003: Velocity Decay and Near-Field vs. Far-Field Capture; RB-005: Impact of Hood Geometry on Capture Performance; RB-006: Wind Interaction and Cross-Flow Effects

---

## 1. Topic Definition

This paper develops a physics-based methodology for determining the minimum exhaust airflow rate, specified in cubic feet per minute (CFM), required for reliable capture of the **Buoyant Cooking Plume** by outdoor barbecue ventilation hoods. It unifies the plume characterization of RB-001, the velocity decay and mass flow analysis of RB-003, the geometric capture analysis of RB-005, and the wind interaction quantification of RB-006 into a single, integrated CFM sizing framework.

The scope encompasses:

1. **A complete CFM sizing methodology** built from first principles. The methodology proceeds in four sequential steps: (a) determine the plume mass flow rate at the **Plume Interception Plane** using the Heskestad correlation as a function of convective heat release rate and mounting height; (b) apply an infiltration factor accounting for ambient air drawn into the hood beyond the plume boundary; (c) apply a wind exposure correction factor calibrated against the deflection and entrainment analysis of RB-006; (d) apply an engineering safety factor for source variability and system degradation.

2. **Consolidated CFM lookup tables** for all eleven source types catalogued in RB-001 Table 3.1 at five standard mounting heights (18, 24, 30, 36, and 48 inches) across four wind exposure classes (Sheltered, Moderate, Exposed, Severe) as defined in RB-006 Section 3.8.

3. **Scaling relationships** between cooking surface area, total heat release rate, convective heat release rate, and required CFM. These relationships allow interpolation for source types not explicitly tabulated and provide the physics-based alternative to the empirical BTU-per-CFM rules used in indoor ventilation.

4. **Outdoor correction factors** relative to indoor CFM baselines. The ASHRAE BTU method (1 CFM per 100 BTU/hr) and the linear-foot method (200-400 CFM per linear foot of hood) are compared against the physics-derived outdoor requirements, producing correction multipliers for each wind exposure class.

5. **Wind exposure safety margins.** Building on the wind classification system of RB-006 and the wind-enhanced entrainment and deflection models, this paper quantifies the additional CFM required at each wind exposure class and integrates it into the lookup tables. The wind margin accounts for plume centerline deflection, enhanced entrainment widening, gust-factor excursions, and the reduced **Effective Capture Area** that results from asymmetric plume loading of the hood face.

6. **Answers to the three key research questions** specified in the research scope:
   - What is the minimum CFM required for reliable outdoor capture of a 60,000 BTU gas grill at 30-inch mounting height?
   - How should CFM recommendations scale with cooking surface area and heat release rate?
   - What safety margin should be applied for wind exposure?

### Relationship to Dependency Papers

**RB-001** established the heat release rates, convective fractions, virtual origins, centerline temperatures, centerline velocities, plume diameters, and mass flow rates for all source types. The Heskestad plume mass flow correlation (m_dot_p = 0.071 * Q_c^(1/3) * z^(5/3) + 0.0018 * Q_c) is the foundational equation from which all CFM values derive. RB-001's key finding was that all hood heights are in the self-similar far-field regime, allowing consistent application of the Heskestad correlations at all standard mounting heights.

**RB-003** extended the mass flow analysis into a complete capture framework by computing the total required CFM using a multiplier K_CFM that accounts for infiltration, wind margin, and safety factor. RB-003 delivered preliminary CFM tables (Tables 3.8a and 3.8b) for standard outdoor (K_CFM = 3.0) and sustained light wind (K_CFM = 3.68) conditions, established maximum mounting heights as a function of blower capacity, and derived the outdoor correction factor K_outdoor relative to indoor baselines (1.7 for sheltered, 2.0 for standard outdoor, 2.5 for exposed).

**RB-005** analyzed how hood geometry affects capture performance — overhang requirements, hood lip improvement factors, canopy shape effects, internal baffle configuration, and the geometry-CFM interaction. RB-005's key finding was that geometric coverage (hood width) is more important than suction power (CFM) for outdoor plume capture, and that a properly sized hood with moderate CFM outperforms an undersized hood with high CFM. RB-005 also quantified the island versus wall-mount CFM differential (1.15-1.25x increase for island installations).

**RB-006** provided the detailed wind interaction analysis: plume deflection tables for all source types at all wind speeds, Froude number regime classification, critical wind speeds for capture failure, wind-enhanced entrainment models, and the four-tier wind exposure classification system. RB-006 quantified the CFM increase needed at each wind exposure class without physical shielding (1.2x at 2 mph, 1.8x at 5 mph, 2.5x at 8 mph, 3.0x at 10 mph) and the CFM savings achievable through side panels and rear walls.

This paper integrates and synthesizes all four predecessors into the definitive CFM sizing reference for outdoor barbecue ventilation.

### Problem Framing

The central engineering question for outdoor hood specification is: given a cooking appliance of known heat release rate, a proposed mounting height, a hood of known geometry, and a site with characterized wind exposure, what exhaust flow rate (CFM) must the blower provide to achieve reliable plume capture?

The answer is not a single number. It is a function of at least five variables: convective heat release rate (Q_c), mounting height (z), hood geometry (effective capture area, overhang, lip height), wind exposure class, and installation configuration (island versus wall-mount). This paper reduces this multivariate problem to a set of lookup tables indexed by source type, mounting height, and wind exposure class, with correction factors for installation configuration and hood geometry variations.

---

## 2. Relevant Physical Principles

### 2.1 Plume Mass Flow as the Governing Constraint

RB-003 established that for outdoor canopy hoods, the governing constraint for CFM specification is volumetric: the hood must exhaust at least as much air as the total volume flowing upward through the **Plume Interception Plane**. This total volume includes the **Buoyant Cooking Plume** itself (combustion gases plus entrained ambient air) and the additional ambient air drawn into the hood from beyond the plume boundary.

The Heskestad plume mass flow correlation gives the bare plume mass flow rate at height z above the cooking surface:

> m_dot_p = 0.071 * Q_c^(1/3) * z^(5/3) + 0.0018 * Q_c [kg/s]

where Q_c is the convective heat release rate (kW) and z is the height above the cooking surface (m). This formula applies for z above the flame height L_f, which RB-001 confirmed is satisfied at all standard hood mounting heights for all outdoor cooking sources.

Converting to volumetric flow at the plume-average density (rho_plume approximately 1.10 kg/m^3, accounting for the modest temperature elevation of the mixed plume gas):

> CFM_plume = (m_dot_p / rho_plume) * 2119 [CFM]

where the factor 2119 converts m^3/s to CFM.

The z^(5/3) dependence of mass flow on height is the most consequential scaling relationship for CFM specification. This power law produces a rapidly accelerating exhaust requirement with increasing mounting height. Doubling the height from 24 to 48 inches approximately quadruples the plume mass flow.

### 2.2 The CFM Multiplier Framework

The total required exhaust CFM exceeds the bare plume mass flow because the hood must also ingest ambient air from beyond the plume boundary, resist wind-driven plume displacement, and provide margin for source variability. RB-003 formalized this as:

> CFM_required = CFM_plume * K_CFM

where K_CFM is the composite CFM multiplier. This multiplier is the product of three independent correction factors:

> K_CFM = F_inf * F_wind * F_safety

**Infiltration factor (F_inf).** When the hood is sized per the RB-002 recommended dimensions (K = 1.70 overhang margin), the hood face area exceeds the plume cross-sectional area by a factor of approximately (1.70)^2 = 2.89. The excess area draws in ambient air from beyond the plume boundary. RB-003 derived F_inf = 2.0 as the engineering value for outdoor canopy hoods, accounting for the partial occupation of hood area by the plume itself and the fraction of edge air that is actively drawn in (f_edge approximately 0.6).

**Wind correction factor (F_wind).** This factor accounts for the additional CFM needed to capture a wind-deflected, wind-widened plume. It varies with wind exposure class:

| Wind Exposure Class | Characteristic Wind Speed | F_wind | Basis |
|---|---|---|---|
| Sheltered (< 3 mph) | 0-1.3 m/s | 1.3 | Light variable breeze; plume deflection within overhang margin |
| Moderate (3-7 mph) | 1.3-3.1 m/s | 1.6 | Sustained directional wind; 25% plume escape threshold approached |
| Exposed (7-12 mph) | 3.1-5.4 m/s | 2.5 | Plume in wind-dominated regime; side panels required |
| Severe (> 12 mph) | > 5.4 m/s | N/A | Conventional capture impractical; enclosure required |

These values are derived from the RB-006 wind interaction analysis. The Sheltered value (1.3) corresponds to the light-breeze margin used in RB-003 Table 3.8a. The Moderate value (1.6) corresponds to the sustained light wind condition in RB-003 Table 3.8b. The Exposed value (2.5) is derived from RB-006 Section 3.9.3, which found that increasing CFM by a factor of 2.5 at 8 mph achieves approximately 60% capture without physical wind shielding. When combined with side panels (Section 3.9.1 of RB-006), the effective F_wind for the Exposed class with panels is reduced to approximately 1.8.

**Safety factor (F_safety).** A factor of 1.15 (15%) accounts for: (a) uncertainty in the Heskestad plume correlations (approximately 10-15% for mass flow rate); (b) variation in actual versus rated heat release rate of the cooking appliance; (c) transient excursions during peak cooking loads (fat drippings, flare-ups); and (d) system degradation over time (grease accumulation on filters, reduced blower performance).

The resulting K_CFM values for each wind exposure class are:

| Wind Exposure Class | F_inf | F_wind | F_safety | K_CFM |
|---|---|---|---|---|
| Sheltered | 2.0 | 1.3 | 1.15 | 2.99 (use 3.0) |
| Moderate | 2.0 | 1.6 | 1.15 | 3.68 |
| Exposed (no panels) | 2.0 | 2.5 | 1.15 | 5.75 |
| Exposed (with side panels) | 2.0 | 1.8 | 1.15 | 4.14 |

### 2.3 Indoor CFM Baselines for Correction Factor Derivation

Two standard indoor CFM sizing methods are used as baselines against which the outdoor correction factor is computed:

**ASHRAE BTU method.** CFM_indoor = Q_total (BTU/hr) / 100. This rule, applicable to commercial kitchen hoods per ASHRAE Standard 154, assigns 1 CFM for every 100 BTU/hr of rated appliance capacity. For a 60,000 BTU gas grill: CFM_indoor = 600 CFM.

**ASHRAE linear-foot method.** CFM_indoor = L_hood (ft) * R, where L_hood is the hood length in feet and R is the rate per foot (200 CFM/ft for light duty, 300 CFM/ft for medium duty, 400 CFM/ft for heavy duty). For a 5-foot hood over a medium-duty source: CFM_indoor = 5 * 300 = 1500 CFM for a full commercial installation, or scaled to residential duty at approximately 200 CFM/ft, giving 1000 CFM. For a more typical residential indoor range hood of 4 feet at 250 CFM/ft: CFM_indoor = 1000 CFM. However, actual residential practice typically uses the simpler BTU method, yielding 300-600 CFM for 30,000-60,000 BTU appliances.

The midpoint indoor CFM for a 40,000 BTU gas grill (the Gas Grill Medium reference configuration) is approximately 350 CFM (midpoint between the BTU method at 400 and lower residential practice at 300).

The outdoor correction factor K_outdoor is defined as:

> K_outdoor = CFM_outdoor / CFM_indoor_midpoint

### 2.4 Scaling Relationships: Q_c, Cooking Area, and CFM

The Heskestad mass flow formula reveals two scaling relationships that govern how CFM requirements change with source parameters:

**Scaling with heat release rate.** At a fixed mounting height, the plume mass flow rate scales as Q_c^(1/3) (for the dominant term). Since the total CFM is K_CFM times the plume mass flow:

> CFM_required proportional to Q_c^(1/3) * z^(5/3)

This weak one-third-power dependence on Q_c means that doubling the heat release rate increases the required CFM by only a factor of 2^(1/3) = 1.26 (26%). Quadrupling Q_c increases CFM by 4^(1/3) = 1.59 (59%). This sublinear scaling is a direct consequence of plume entrainment physics: a stronger plume entrains air faster, but it also rises faster, so the net mass flow at a given height does not increase proportionally with source strength.

**Scaling with mounting height.** The z^(5/3) term dominates the mass flow formula at heights above approximately 0.3 m (12 inches). The 5/3-power height dependence produces rapid nonlinear growth:

| Height Ratio | CFM Ratio (z^(5/3) scaling) |
|---|---|
| 18" to 24" (1.33x height) | 1.52x CFM |
| 18" to 30" (1.67x height) | 2.11x CFM |
| 18" to 36" (2.0x height) | 2.83x CFM |
| 18" to 48" (2.67x height) | 4.31x CFM |
| 24" to 48" (2.0x height) | 2.83x CFM |
| 30" to 48" (1.6x height) | 2.12x CFM |

Doubling the mounting height increases the required CFM by a factor of approximately 2.83 (183% increase). This is the fundamental physical basis for minimizing mounting height.

**Scaling with cooking surface area.** The cooking surface area enters the calculation through the effective source diameter D_eff = (4A_cook/pi)^(1/2), which affects the virtual origin z_0 and therefore the effective height (z - z_0) used in the plume correlations. However, the effect on CFM is indirect and modest compared to the Q_c and z dependences. For two sources with the same Q_c but different D_eff, the larger source diameter produces a more negative virtual origin, slightly increasing the effective height and modestly increasing the mass flow. The magnitude of this effect is typically 5-15% for the range of cooking surface areas in this program.

The practical conclusion is that CFM scales primarily with mounting height (strongly) and heat release rate (weakly). Cooking surface area affects hood geometry requirements (width, overhang) far more than it affects CFM requirements.

---

## 3. Observed or Expected Behavior

### 3.1 Bare Plume Mass Flow at Standard Mounting Heights

The bare plume mass flow rate, computed from the Heskestad correlation (m_dot_p = 0.071 * Q_c^(1/3) * z^(5/3) + 0.0018 * Q_c), is the starting point for all CFM calculations. The following table presents the plume mass flow in both kg/s and CFM (at rho_plume = 1.10 kg/m^3) for all source types at all standard mounting heights. Values are consistent with RB-003 Table 3.5.

#### Table 3.1: Bare Plume Mass Flow Rate (CFM) at Standard Mounting Heights

| Source Type | Q_c (kW) | 18" | 24" | 30" | 36" | 48" |
|---|---|---|---|---|---|---|
| Gas Grill — Small (25,000 BTU) | 5.1 | 82 | 121 | 167 | 219 | 346 |
| Gas Grill — Medium (40,000 BTU) | 8.2 | 104 | 149 | 203 | 264 | 413 |
| Gas Grill — Large (60,000 BTU) | 12.3 | 129 | 181 | 242 | 312 | 482 |
| Gas Grill — High-Output (80,000 BTU) | 16.4 | 152 | 209 | 277 | 354 | 541 |
| Charcoal Kettle (15,000 BTU) | 1.8 | 52 | 79 | 112 | 148 | 238 |
| Charcoal Kettle High (30,000 BTU) | 3.5 | 68 | 101 | 141 | 186 | 298 |
| Charcoal Kamado (25,000 BTU) | 3.3 | 66 | 98 | 137 | 181 | 290 |
| Wood-Fired (40,000 BTU) | 7.6 | 100 | 144 | 197 | 256 | 401 |
| Wood-Fired Large (70,000 BTU) | 13.3 | 134 | 188 | 252 | 326 | 504 |
| Pellet Smoker — Low (8,000 BTU) | 1.5 | 48 | 74 | 104 | 139 | 223 |
| Pellet Smoker — Medium (18,000 BTU) | 3.4 | 67 | 100 | 139 | 184 | 295 |
| Pellet Smoker — High (30,000 BTU) | 5.7 | 87 | 127 | 174 | 229 | 360 |

**Interpretation.** The bare plume mass flow at 30 inches ranges from 104 CFM (pellet smoker low) to 277 CFM (gas grill high-output). These values represent the absolute physical minimum volume of air flowing upward through the **Plume Interception Plane** at that height. A hood exhausting less than this amount cannot capture the full plume regardless of its geometry. In practice, the required exhaust rate is 3 to 6 times these values, depending on wind exposure class.

The z^(5/3) scaling is evident in every row: the 48-inch value is approximately 4.2 times the 18-inch value for all source types.

### 3.2 CFM Requirements by Wind Exposure Class

Applying the K_CFM multiplier framework from Section 2.2 to the bare plume mass flows in Table 3.1 yields the total required exhaust CFM for each wind exposure class. These are the primary engineering deliverables of this paper.

#### Table 3.2a: Required CFM — Sheltered Exposure (K_CFM = 3.0)

Conditions: Enclosed patio, courtyard, dense landscaping on all sides. Wind at cooking height below 3 mph.

| Source Type | Q_c (kW) | 18" | 24" | 30" | 36" | 48" |
|---|---|---|---|---|---|---|
| Gas Grill — Small | 5.1 | 247 | 363 | 500 | 657 | 1037 |
| Gas Grill — Medium | 8.2 | 312 | 448 | 609 | 792 | 1238 |
| Gas Grill — Large | 12.3 | 388 | 544 | 727 | 937 | 1447 |
| Gas Grill — High-Output | 16.4 | 456 | 628 | 830 | 1061 | 1623 |
| Charcoal Kettle | 1.8 | 156 | 238 | 335 | 445 | 714 |
| Charcoal Kettle High | 3.5 | 204 | 304 | 423 | 558 | 894 |
| Charcoal Kamado | 3.3 | 198 | 295 | 412 | 543 | 870 |
| Wood-Fired | 7.6 | 300 | 433 | 590 | 768 | 1203 |
| Wood-Fired Large | 13.3 | 401 | 565 | 755 | 978 | 1513 |
| Pellet Smoker — Low | 1.5 | 144 | 222 | 313 | 417 | 670 |
| Pellet Smoker — Medium | 3.4 | 201 | 299 | 418 | 551 | 884 |
| Pellet Smoker — High | 5.7 | 260 | 381 | 523 | 686 | 1080 |

#### Table 3.2b: Required CFM — Moderate Exposure (K_CFM = 3.68)

Conditions: Open patio with partial wind screening (fence, hedge, partial walls), covered porch. Wind at cooking height 3-7 mph. Side panels recommended.

| Source Type | Q_c (kW) | 18" | 24" | 30" | 36" | 48" |
|---|---|---|---|---|---|---|
| Gas Grill — Small | 5.1 | 303 | 445 | 613 | 805 | 1272 |
| Gas Grill — Medium | 8.2 | 383 | 550 | 747 | 972 | 1518 |
| Gas Grill — Large | 12.3 | 475 | 667 | 892 | 1150 | 1775 |
| Gas Grill — High-Output | 16.4 | 560 | 770 | 1019 | 1302 | 1991 |
| Charcoal Kettle | 1.8 | 191 | 292 | 411 | 546 | 876 |
| Charcoal Kettle High | 3.5 | 250 | 373 | 519 | 685 | 1097 |
| Charcoal Kamado | 3.3 | 243 | 362 | 505 | 666 | 1067 |
| Wood-Fired | 7.6 | 368 | 531 | 724 | 942 | 1476 |
| Wood-Fired Large | 13.3 | 492 | 693 | 926 | 1200 | 1856 |
| Pellet Smoker — Low | 1.5 | 177 | 272 | 384 | 511 | 822 |
| Pellet Smoker — Medium | 3.4 | 246 | 367 | 513 | 676 | 1084 |
| Pellet Smoker — High | 5.7 | 319 | 467 | 641 | 842 | 1325 |

#### Table 3.2c: Required CFM — Exposed (No Panels) (K_CFM = 5.75)

Conditions: Open deck, rooftop terrace, open yard with no screening. Wind at cooking height 7-12 mph. Side panels and rear panel required but not yet installed. These values represent the CFM that would be needed to partially compensate without physical wind shielding; capture efficiency is limited to approximately 60% even at these elevated rates.

| Source Type | Q_c (kW) | 18" | 24" | 30" | 36" | 48" |
|---|---|---|---|---|---|---|
| Gas Grill — Small | 5.1 | 473 | 695 | 959 | 1259 | 1989 |
| Gas Grill — Medium | 8.2 | 598 | 859 | 1169 | 1520 | 2373 |
| Gas Grill — Large | 12.3 | 743 | 1042 | 1394 | 1797 | 2774 |
| Gas Grill — High-Output | 16.4 | 875 | 1203 | 1591 | 2035 | 3112 |
| Charcoal Kettle | 1.8 | 299 | 456 | 643 | 854 | 1369 |
| Wood-Fired | 7.6 | 576 | 830 | 1132 | 1472 | 2306 |
| Pellet Smoker — Low | 1.5 | 276 | 426 | 600 | 799 | 1284 |
| Pellet Smoker — High | 5.7 | 499 | 730 | 1003 | 1316 | 2070 |

#### Table 3.2d: Required CFM — Exposed (With Side Panels) (K_CFM = 4.14)

Conditions: Same as Exposed, but with full side panels on both sides extending at least 75% of mounting height. Side panels reduce effective wind at the plume by 40-60% per RB-006 Section 3.9.1, dropping the effective wind class from Exposed to upper Moderate.

| Source Type | Q_c (kW) | 18" | 24" | 30" | 36" | 48" |
|---|---|---|---|---|---|---|
| Gas Grill — Small | 5.1 | 340 | 501 | 691 | 907 | 1432 |
| Gas Grill — Medium | 8.2 | 431 | 618 | 841 | 1094 | 1708 |
| Gas Grill — Large | 12.3 | 535 | 750 | 1003 | 1294 | 1998 |
| Gas Grill — High-Output | 16.4 | 630 | 866 | 1146 | 1466 | 2240 |
| Charcoal Kettle | 1.8 | 215 | 328 | 463 | 615 | 986 |
| Wood-Fired | 7.6 | 414 | 597 | 815 | 1060 | 1660 |
| Pellet Smoker — Low | 1.5 | 199 | 306 | 432 | 575 | 924 |
| Pellet Smoker — High | 5.7 | 359 | 526 | 722 | 947 | 1490 |

### 3.3 Primary Answer: 60,000 BTU Gas Grill at 30-Inch Mounting Height

The first key research question asks: what is the minimum CFM required for reliable outdoor capture of a 60,000 BTU gas grill at 30-inch mounting height?

The 60,000 BTU gas grill corresponds to the Gas Grill — Large configuration in RB-001 Table 3.1: Q_total = 60,000 BTU/hr = 17.6 kW, chi_c = 0.70, Q_c = 12.3 kW, D_eff = 0.58 m.

**Step 1 — Bare plume mass flow at 30 inches:**

> m_dot_p = 0.071 * (12.3)^(1/3) * (0.76)^(5/3) + 0.0018 * 12.3

> = 0.071 * 2.307 * 0.650 + 0.022 = 0.106 + 0.022 = 0.128 kg/s

> CFM_plume = (0.128 / 1.10) * 2119 = 247 CFM

RB-003 Table 3.5 reports 242 CFM (the 2% difference is due to intermediate rounding).

**Step 2 — Apply K_CFM by wind exposure class:**

| Wind Exposure | K_CFM | Required CFM | Recommended Blower |
|---|---|---|---|
| Sheltered (< 3 mph) | 3.0 | 727 | 900 CFM |
| Moderate (3-7 mph) | 3.68 | 892 | 1200 CFM |
| Exposed with panels (7-12 mph) | 4.14 | 1003 | 1200 CFM |
| Exposed without panels (7-12 mph) | 5.75 | 1394 | 1500 CFM |

**Answer:** For a 60,000 BTU gas grill at 30-inch mounting height:

- **Sheltered installation:** 727 CFM minimum; specify a 900 CFM blower to provide 24% margin.
- **Moderate wind exposure:** 892 CFM minimum; specify a 1200 CFM blower to provide 35% margin.
- **Exposed installation with side panels:** 1003 CFM minimum; specify a 1200 CFM blower to provide 20% margin.
- **Exposed installation without panels:** 1394 CFM minimum; specify a 1500 CFM blower. Capture efficiency is limited to approximately 60% even at this rate; side panels are strongly recommended.

The recommended hood dimensions from RB-005 Table 3.8c for this configuration at 30 inches are: width 62 inches, depth 55 inches (island) or 42 inches (wall-mount), overhang 16 inches per side, lip height 3 inches, internal cavity height 8 inches.

### 3.4 Scaling Relationships: How CFM Varies with Source Parameters

#### 3.4.1 CFM as a Function of Convective Heat Release Rate

At a fixed mounting height of 30 inches, the required CFM for Sheltered exposure (K_CFM = 3.0) scales as:

> CFM_30 = 3.0 * [(0.071 * Q_c^(1/3) * (0.76)^(5/3) + 0.0018 * Q_c) / 1.10] * 2119

> CFM_30 = 3.0 * [0.0462 * Q_c^(1/3) * 0.650 + 0.0018 * Q_c] * 1926

> CFM_30 approximately equals 3.0 * [57.8 * Q_c^(1/3) + 3.47 * Q_c]

For Q_c in the range of 1.5 to 16.4 kW, the first term dominates (contributing 80-90% of the total). The scaling is therefore approximately Q_c^(1/3).

#### Table 3.4a: CFM Scaling with Q_c at 30" (Sheltered, K_CFM = 3.0)

| Q_c (kW) | Q_total (BTU/hr) | CFM_plume | CFM_required | Ratio to Q_c = 8.2 baseline |
|---|---|---|---|---|
| 1.5 | 8,000 (pellet low) | 104 | 313 | 0.51 |
| 1.8 | 15,000 (charcoal) | 112 | 335 | 0.55 |
| 3.5 | 30,000 (charcoal high) | 141 | 423 | 0.69 |
| 5.1 | 25,000 (gas small) | 167 | 500 | 0.82 |
| 5.7 | 30,000 (pellet high) | 174 | 523 | 0.86 |
| 7.6 | 40,000 (wood) | 197 | 590 | 0.97 |
| 8.2 | 40,000 (gas medium) | 203 | 609 | 1.00 (baseline) |
| 12.3 | 60,000 (gas large) | 242 | 727 | 1.19 |
| 13.3 | 70,000 (wood large) | 252 | 755 | 1.24 |
| 16.4 | 80,000 (gas high) | 277 | 830 | 1.36 |

**Key observation.** Doubling Q_c from 8.2 to 16.4 kW increases the required CFM by only 36% (from 609 to 830 CFM). The Q_c^(1/3) scaling produces a markedly sublinear relationship between source heat release and required exhaust. This has a practical consequence: upgrading from a medium gas grill to a high-output gas grill does not require doubling the blower capacity. A blower rated at 1.4x the medium-grill requirement is sufficient.

Conversely, reducing Q_c provides diminishing returns for CFM reduction. Halving Q_c from 8.2 to approximately 4.1 kW reduces CFM by only approximately 20%. This is why even low-output sources (charcoal kettles, pellet smokers in low mode) still require substantial CFM: the entrained ambient air mass at 30 inches is large regardless of source strength.

#### 3.4.2 CFM as a Function of Total BTU Rating

Because different source types have different convective fractions (chi_c), the relationship between total BTU rating and required CFM is not a simple power law. Two sources with identical total BTU but different chi_c will require different CFM values because their plumes differ in strength.

#### Table 3.4b: CFM per 10,000 BTU — Varying by Source Type at 30" (Sheltered)

| Source Type | Q_total (BTU/hr) | chi_c | Q_c (kW) | CFM_req | CFM per 10,000 BTU |
|---|---|---|---|---|---|
| Gas Grill — Small | 25,000 | 0.70 | 5.1 | 500 | 200 |
| Gas Grill — Medium | 40,000 | 0.70 | 8.2 | 609 | 152 |
| Gas Grill — Large | 60,000 | 0.70 | 12.3 | 727 | 121 |
| Gas Grill — High-Output | 80,000 | 0.70 | 16.4 | 830 | 104 |
| Charcoal Kettle | 15,000 | 0.40 | 1.8 | 335 | 223 |
| Charcoal Kettle High | 30,000 | 0.40 | 3.5 | 423 | 141 |
| Wood-Fired | 40,000 | 0.65 | 7.6 | 590 | 148 |
| Wood-Fired Large | 70,000 | 0.65 | 13.3 | 755 | 108 |
| Pellet Smoker — Low | 8,000 | 0.65 | 1.5 | 313 | 391 |
| Pellet Smoker — High | 30,000 | 0.65 | 5.7 | 523 | 174 |

**The CFM-per-BTU ratio decreases with increasing source size.** This is the direct consequence of the Q_c^(1/3) scaling: larger sources are proportionally more efficient in terms of CFM per BTU because the entrainment-dominated mass flow does not scale linearly with source strength. A small gas grill requires 200 CFM per 10,000 BTU, while a high-output grill requires only 104 CFM per 10,000 BTU.

**The charcoal exception.** The charcoal kettle at 15,000 BTU requires 223 CFM per 10,000 BTU — the highest ratio of any source type except the pellet smoker in low mode. This is because the low convective fraction (chi_c = 0.40) produces a weak plume that must still be captured at a height where substantial ambient air has been entrained. The plume mass flow scales with Q_c^(1/3), and Q_c for charcoal is only 40% of Q_total. The result is a disproportionately high CFM-per-BTU requirement.

**The pellet smoker low anomaly.** At 391 CFM per 10,000 BTU, the pellet smoker in low mode has the highest ratio because it has the lowest absolute heat release rate. The entrained ambient air at 30 inches is largely independent of source strength (it depends on z^(5/3) which is the same for all sources), so low-output sources have a higher ratio of entrained air to source gas, inflating the CFM-per-BTU metric. This metric is misleading for low-output sources because the absolute CFM requirement (313 CFM) is actually the lowest of all configurations.

#### 3.4.3 CFM as a Function of Cooking Surface Area

The cooking surface area does not directly enter the Heskestad mass flow formula. Its effect on CFM is indirect, operating through the virtual origin z_0 (which depends on D_eff, which in turn depends on cooking surface area).

To isolate the area effect, consider two hypothetical sources with identical Q_c = 8.2 kW but different cooking surface areas:

| Cooking Surface | D_eff (m) | z_0 (m) | z_eff at 30" (m) | CFM_plume at 30" | CFM_req (K=3.0) |
|---|---|---|---|---|---|
| 350 sq in (small grill) | 0.43 | -0.30 | 1.06 | 193 | 579 |
| 500 sq in (medium grill) | 0.51 | -0.37 | 1.13 | 203 | 609 |
| 650 sq in (large grill) | 0.58 | -0.41 | 1.17 | 208 | 625 |

The CFM variation across this range of cooking surface areas (350 to 650 sq in) is only 8% (579 to 625 CFM) at the same Q_c. The cooking surface area effect on CFM is minor. The primary effect of cooking surface area is on hood geometry: larger cooking surfaces require wider hoods with more overhang to capture the wider plume base, but the exhaust rate is governed by Q_c and z, not by cooking surface area.

**Design rule.** For CFM sizing, use the convective heat release rate Q_c and mounting height z as the primary inputs. Cooking surface area determines the hood dimensions (width, depth, overhang), not the exhaust rate.

### 3.5 Outdoor Correction Factors Relative to Indoor Baselines

Using the indoor CFM midpoint of 350 CFM for a 40,000 BTU gas grill (Gas Grill Medium reference), the outdoor correction factor K_outdoor is:

#### Table 3.5: Outdoor Correction Factor K_outdoor (Gas Grill Medium at 30")

| Condition | Outdoor CFM | Indoor Baseline | K_outdoor |
|---|---|---|---|
| Sheltered (< 3 mph) | 609 | 350 | 1.7 |
| Moderate (3-7 mph) | 747 | 350 | 2.1 |
| Exposed with side panels (7-12 mph) | 841 | 350 | 2.4 |
| Exposed without panels (7-12 mph) | 1169 | 350 | 3.3 |

For generalized application across source types and mounting heights:

#### Table 3.5b: Recommended Outdoor Correction Factor K_outdoor by Wind Exposure Class

| Wind Exposure Class | K_outdoor | Application |
|---|---|---|
| Sheltered | 1.7 | Apply to indoor CFM computed by BTU method or linear-foot method |
| Moderate | 2.0 - 2.2 | Side panels recommended; CFM = K_outdoor * CFM_indoor |
| Exposed (with panels) | 2.4 - 2.8 | Side panels required; rear panel recommended |
| Exposed (no panels) | 3.0 - 3.5 | Not recommended; install panels instead |

**Important caveat.** These correction factors assume the indoor CFM baseline is correctly specified. Many residential indoor installations are underspecified relative to ASHRAE recommendations. Applying K_outdoor to an already-inadequate indoor value produces an inadequate outdoor value. The direct CFM lookup tables (Tables 3.2a through 3.2d) are the preferred sizing method. The correction factors are provided for situations where a designer has an established indoor CFM and wishes to adjust it for outdoor use.

### 3.6 Wind Exposure Safety Margins

The difference between adjacent wind exposure classes quantifies the safety margin provided by each CFM increment:

#### Table 3.6: CFM Increase Required Between Wind Exposure Classes (Gas Grill Medium at 30")

| Transition | K_CFM Change | CFM Change | Percentage Increase |
|---|---|---|---|
| Sheltered to Moderate | 3.0 to 3.68 | 609 to 747 | +23% |
| Moderate to Exposed (panels) | 3.68 to 4.14 | 747 to 841 | +13% |
| Moderate to Exposed (no panels) | 3.68 to 5.75 | 747 to 1169 | +56% |
| Sheltered to Exposed (panels) | 3.0 to 4.14 | 609 to 841 | +38% |
| Sheltered to Exposed (no panels) | 3.0 to 5.75 | 609 to 1169 | +92% |

**Key finding.** Moving from Sheltered to Moderate exposure adds 23% to the CFM requirement. If the installation includes side panels, the further step from Moderate to Exposed adds only 13%. Without panels, the penalty is 56%. This quantifies the value of side panels: they reduce the CFM penalty for Exposed conditions from +92% to +38% relative to Sheltered baseline.

### 3.7 Maximum Mounting Height as a Function of Available CFM

The maximum mounting height at which the required CFM does not exceed a given blower capacity is a critical practical constraint. The following tables extend RB-003 Tables 3.7a and 3.7b to all four wind exposure classes.

#### Table 3.7a: Maximum Mounting Height — Sheltered Exposure (K_CFM = 3.0)

| Source Type | 600 CFM | 900 CFM | 1200 CFM | 1500 CFM | 2000 CFM |
|---|---|---|---|---|---|
| Gas Small (5.1 kW) | 33" | 44" | 52" | 60" | 72" |
| Gas Medium (8.2 kW) | 30" | 39" | 47" | 54" | 65" |
| Gas Large (12.3 kW) | 26" | 35" | 42" | 49" | 59" |
| Gas High (16.4 kW) | 23" | 31" | 39" | 45" | 55" |
| Charcoal (1.8 kW) | 43" | 55" | 66" | 72+" | 72+" |
| Wood (7.6 kW) | 30" | 40" | 48" | 55" | 66" |
| Pellet Low (1.5 kW) | 45" | 57" | 69" | 72+" | 72+" |
| Pellet High (5.7 kW) | 33" | 43" | 51" | 59" | 70" |

#### Table 3.7b: Maximum Mounting Height — Moderate Exposure (K_CFM = 3.68)

| Source Type | 600 CFM | 900 CFM | 1200 CFM | 1500 CFM | 2000 CFM |
|---|---|---|---|---|---|
| Gas Small (5.1 kW) | 29" | 38" | 46" | 53" | 63" |
| Gas Medium (8.2 kW) | 26" | 34" | 41" | 48" | 57" |
| Gas Large (12.3 kW) | 22" | 30" | 37" | 43" | 52" |
| Gas High (16.4 kW) | 19" | 27" | 33" | 39" | 48" |
| Charcoal (1.8 kW) | 38" | 49" | 58" | 67" | 72+" |
| Wood (7.6 kW) | 26" | 35" | 42" | 48" | 58" |
| Pellet Low (1.5 kW) | 39" | 51" | 60" | 69" | 72+" |
| Pellet High (5.7 kW) | 28" | 37" | 45" | 52" | 62" |

#### Table 3.7c: Maximum Mounting Height — Exposed with Side Panels (K_CFM = 4.14)

| Source Type | 600 CFM | 900 CFM | 1200 CFM | 1500 CFM | 2000 CFM |
|---|---|---|---|---|---|
| Gas Small (5.1 kW) | 26" | 35" | 43" | 49" | 59" |
| Gas Medium (8.2 kW) | 23" | 31" | 38" | 44" | 53" |
| Gas Large (12.3 kW) | 19" | 27" | 34" | 40" | 48" |
| Gas High (16.4 kW) | 17" | 24" | 30" | 36" | 44" |
| Charcoal (1.8 kW) | 34" | 45" | 54" | 63" | 72+" |
| Wood (7.6 kW) | 23" | 32" | 39" | 45" | 54" |
| Pellet Low (1.5 kW) | 36" | 47" | 56" | 65" | 72+" |
| Pellet High (5.7 kW) | 25" | 34" | 42" | 48" | 58" |

**How to read these tables.** A homeowner with a Gas Grill Large (60,000 BTU) in a Moderate wind exposure location with a 900 CFM blower can mount the hood at a maximum of 30 inches. At 36 inches, the required CFM (1150) would exceed the blower capacity. If the site has Exposed conditions and the homeowner installs side panels, the maximum drops to 27 inches with the same blower. A 1200 CFM blower extends the limit to 34 inches in the Exposed-with-panels case.

### 3.8 Integrated Design Tables: CFM with Recommended Hood Dimensions

The following consolidated tables combine the CFM requirements from this paper with the recommended hood dimensions from RB-005, creating a single reference for complete hood specification. Values for hood width (W_rec), depth for island installations (D_rec), overhang (OH_rec), and recommended lip height are taken from RB-005 Tables 3.8a through 3.8h.

#### Table 3.8a: Integrated Design — Gas Grill Medium (40,000 BTU, Q_c = 8.2 kW)

| Height | W_rec | D_rec (island) | D_rec (wall) | OH_rec | Lip | Sheltered CFM | Moderate CFM | Exposed+Panels CFM |
|---|---|---|---|---|---|---|---|---|
| 18" | 49" | 45" | 35" | 13" | 2" | 312 | 383 | 431 |
| 24" | 53" | 49" | 38" | 15" | 3" | 448 | 550 | 618 |
| 30" | 57" | 53" | 41" | 17" | 3" | 609 | 747 | 841 |
| 36" | 61" | 57" | 44" | 19" | 3" | 792 | 972 | 1094 |
| 48" | 69" | 65" | 50" | 23" | 4" | 1238 | 1518 | 1708 |

#### Table 3.8b: Integrated Design — Gas Grill Large (60,000 BTU, Q_c = 12.3 kW)

| Height | W_rec | D_rec (island) | D_rec (wall) | OH_rec | Lip | Sheltered CFM | Moderate CFM | Exposed+Panels CFM |
|---|---|---|---|---|---|---|---|---|
| 18" | 54" | 47" | 36" | 12" | 2" | 388 | 475 | 535 |
| 24" | 58" | 51" | 39" | 14" | 3" | 544 | 667 | 750 |
| 30" | 62" | 55" | 42" | 16" | 3" | 727 | 892 | 1003 |
| 36" | 66" | 59" | 45" | 18" | 3" | 937 | 1150 | 1294 |
| 48" | 74" | 67" | 51" | 22" | 4" | 1447 | 1775 | 1998 |

#### Table 3.8c: Integrated Design — Gas Grill High-Output (80,000 BTU, Q_c = 16.4 kW)

| Height | W_rec | D_rec (island) | D_rec (wall) | OH_rec | Lip | Sheltered CFM | Moderate CFM | Exposed+Panels CFM |
|---|---|---|---|---|---|---|---|---|
| 18" | 59" | 49" | 37" | 11" | 3" | 456 | 560 | 630 |
| 24" | 63" | 53" | 40" | 13" | 3" | 628 | 770 | 866 |
| 30" | 67" | 57" | 43" | 15" | 3" | 830 | 1019 | 1146 |
| 36" | 71" | 61" | 46" | 17" | 4" | 1061 | 1302 | 1466 |
| 48" | 79" | 69" | 52" | 21" | 4" | 1623 | 1991 | 2240 |

#### Table 3.8d: Integrated Design — Charcoal Kettle (15,000 BTU, Q_c = 1.8 kW)

| Height | W_rec | D_rec (island) | D_rec (wall) | OH_rec | Lip | Sheltered CFM | Moderate CFM | Exposed+Panels CFM |
|---|---|---|---|---|---|---|---|---|
| 18" | 55" | 55" | 41" | 16" | 3" | 156 | 191 | 215 |
| 24" | 59" | 59" | 44" | 18" | 3" | 238 | 292 | 328 |
| 30" | 63" | 63" | 47" | 20" | 3" | 335 | 411 | 463 |
| 36" | 66" | 66" | 50" | 22" | 3" | 445 | 546 | 615 |
| 48" | 74" | 74" | 56" | 26" | 4" | 714 | 876 | 986 |

#### Table 3.8e: Integrated Design — Wood-Fired Grill (40,000 BTU, Q_c = 7.6 kW)

| Height | W_rec | D_rec (island) | D_rec (wall) | OH_rec | Lip | Sheltered CFM | Moderate CFM | Exposed+Panels CFM |
|---|---|---|---|---|---|---|---|---|
| 18" | 49" | 45" | 33" | 13" | 2" | 300 | 368 | 414 |
| 24" | 53" | 48" | 36" | 15" | 3" | 433 | 531 | 597 |
| 30" | 57" | 52" | 39" | 17" | 3" | 590 | 724 | 815 |
| 36" | 60" | 56" | 42" | 18" | 3" | 768 | 942 | 1060 |
| 48" | 68" | 64" | 48" | 22" | 4" | 1203 | 1476 | 1660 |

#### Table 3.8f: Integrated Design — Pellet Smoker, All Modes (8,000-30,000 BTU, Q_c = 1.5-5.7 kW)

| Height | W_rec | D_rec (island) | D_rec (wall) | OH_rec | Lip | Sheltered CFM (Low/High) | Moderate CFM (Low/High) |
|---|---|---|---|---|---|---|---|
| 18" | 46" | 43" | 31" | 12" | 2" | 144 / 260 | 177 / 319 |
| 24" | 50" | 47" | 34" | 14" | 2" | 222 / 381 | 272 / 467 |
| 30" | 54" | 51" | 37" | 16" | 3" | 313 / 523 | 384 / 641 |
| 36" | 58" | 55" | 40" | 18" | 3" | 417 / 686 | 511 / 842 |
| 48" | 66" | 63" | 46" | 22" | 3" | 670 / 1080 | 822 / 1325 |

### 3.9 Island Versus Wall-Mount CFM Adjustment

RB-005 Section 3.4.3 established that island installations (accessible from all sides, no rear wall) require a CFM increase of 1.15 to 1.25 relative to wall-mount installations because:

1. All four sides are open to ambient air infiltration, increasing F_inf from approximately 2.0 (wall-mount) to approximately 2.3-2.5 (island).
2. Wind can deflect the plume in any direction, including rearward, where a wall-mount installation would be protected.
3. There is no Coanda-effect wall attachment to guide escaped plume gas back toward the hood.

The following correction factors should be applied to the CFM values in Tables 3.2a through 3.2d and Tables 3.8a through 3.8f:

| Configuration | CFM Multiplier | Basis |
|---|---|---|
| Wall-mount (rear wall present) | 1.00 (baseline) | Tables 3.2a-d values are computed for this configuration |
| Island (no rear wall, all sides open) | 1.20 | Mid-range of RB-005's 1.15-1.25 recommendation |
| Peninsula (two open sides, one wall, one access side) | 1.10 | Intermediate between wall-mount and island |

**Application example.** A Gas Grill Large at 30 inches in Moderate exposure:

- Wall-mount: 892 CFM
- Island: 892 * 1.20 = 1070 CFM
- Peninsula: 892 * 1.10 = 981 CFM

### 3.10 Hood Geometry Correction: Effect of Undersized Hoods on Effective CFM

RB-005 Section 3.7 demonstrated that a hood narrower than the recommended width creates a **Missed Plume Region** that no amount of CFM can compensate. However, within a modest range of hood sizes (80% to 120% of recommended width), the CFM requirement varies because the infiltration factor F_inf changes with the hood-area-to-plume-area ratio.

If the hood is wider than recommended, the excess area draws in more ambient air without improving plume capture. The effective infiltration increases:

> F_inf_adjusted = 1 + (A_hood_actual / A_plume - 1) * f_edge

If the hood is narrower than recommended, the **Effective Capture Area** may be smaller than the plume cross-section, and the hood cannot capture the full plume regardless of CFM. In this case, increasing CFM provides marginal improvement by increasing edge capture velocity, but the fundamental limitation is geometric.

#### Table 3.10: Effect of Hood Width on Required CFM (Gas Grill Medium, 30", Sheltered)

| Hood Width | % of Recommended (57") | Geometric Coverage | Estimated Capture Efficiency | CFM to Achieve This | Notes |
|---|---|---|---|---|---|
| 42" | 74% | Plume overflows hood | 65-75% max | 900 | **Missed Plume Region** too large; not recommended |
| 48" | 84% | Marginal | 80-85% at best | 750 | Marginal; upgrade hood width instead |
| 54" | 95% | Near-adequate | 90-93% | 650 | Acceptable; slight CFM increase compensates |
| 57" | 100% | Full coverage | >95% | 609 | Recommended baseline |
| 63" | 110% | Generous overhang | >95% | 580 | Slightly lower CFM acceptable due to overhang margin |
| 72" | 126% | Excessive overhang | >95% | 560 | Minimal additional benefit beyond 110% |

**Design rule.** The hood must be at least 90% of the recommended width from RB-005 for the CFM tables in this paper to produce reliable capture. Below 90%, the CFM multiplier increases steeply, and below 80%, increasing CFM cannot compensate for the geometric deficiency. Above 110%, the CFM can be modestly reduced (approximately 5-10%) because the extra overhang provides additional capture margin.

### 3.11 Quick-Reference CFM Table at 30-Inch Mounting Height

The 30-inch mounting height is the most commonly specified configuration. The following table provides a single-page reference for this height.

#### Table 3.11: Quick-Reference CFM — All Sources at 30" Mounting Height

| Source Type | BTU | Q_c (kW) | Hood Width | Sheltered | Moderate | Exposed (panels) | Blower Recommendation |
|---|---|---|---|---|---|---|---|
| Gas Small | 25,000 | 5.1 | 51" | 500 | 613 | 691 | 600-900 CFM |
| Gas Medium | 40,000 | 8.2 | 57" | 609 | 747 | 841 | 900 CFM |
| Gas Large | 60,000 | 12.3 | 62" | 727 | 892 | 1003 | 900-1200 CFM |
| Gas High | 80,000 | 16.4 | 67" | 830 | 1019 | 1146 | 1200 CFM |
| Charcoal Kettle | 15,000 | 1.8 | 63" | 335 | 411 | 463 | 600 CFM |
| Charcoal High | 30,000 | 3.5 | 63" | 423 | 519 | 584 | 600-900 CFM |
| Charcoal Kamado | 25,000 | 3.3 | 63" | 412 | 505 | 568 | 600-900 CFM |
| Wood-Fired | 40,000 | 7.6 | 57" | 590 | 724 | 815 | 900 CFM |
| Wood-Fired Large | 70,000 | 13.3 | 71" | 755 | 926 | 1042 | 1200 CFM |
| Pellet Low | 8,000 | 1.5 | 54" | 313 | 384 | 432 | 600 CFM |
| Pellet Medium | 18,000 | 3.4 | 54" | 418 | 513 | 577 | 600-900 CFM |
| Pellet High | 30,000 | 5.7 | 54" | 523 | 641 | 722 | 900 CFM |

**Blower selection guidance.** The recommended blower should provide at least the Moderate exposure CFM value, even for Sheltered installations, to allow for occasional breezes and operational margin. Common residential outdoor blower ratings are 600, 900, 1200, and 1500 CFM. Select the smallest standard size that exceeds the Moderate CFM value by at least 10%.

---

## 4. Implications for Outdoor BBQ Ventilation

### 4.1 The Three-Variable CFM Problem

The analysis in Section 3 demonstrates that outdoor CFM specification is fundamentally a three-variable problem: source heat release rate, mounting height, and wind exposure. Each variable affects the required CFM through a different physical mechanism:

- **Source heat release rate** determines the plume buoyancy, which governs plume velocity, entrainment rate, and mass flow through the **Plume Interception Plane**. The scaling is sublinear (Q_c^(1/3)), meaning the source is the weakest of the three drivers.

- **Mounting height** determines how much ambient air is entrained into the **Buoyant Cooking Plume** during its rise and therefore the total volume that must be captured. The scaling is strongly nonlinear (z^(5/3)), making height the most consequential variable.

- **Wind exposure** determines the additional CFM needed to compensate for plume deflection, enhanced entrainment, and structural disruption via **Wind-Affected Plume Behavior**. The correction factor ranges from 1.3 (Sheltered) to 5.75 (Exposed without panels), producing a wide range of possible CFM requirements for the same source and height.

The practical implication is that reducing mounting height from 48 to 24 inches has a greater effect on CFM than upgrading the blower from 600 to 1200 CFM, and installing side panels has a greater effect than adding 500 CFM of blower capacity. The hierarchy of interventions is: (1) minimize mounting height, (2) install wind shielding, (3) increase blower CFM.

### 4.2 The 30-Inch Threshold Confirmed

RB-003 identified 30 inches as a natural threshold for practical CFM feasibility. This paper confirms and extends that finding across all wind exposure classes:

**Below 30 inches (18-24").** CFM requirements are moderate. At 24 inches in Sheltered conditions, even the highest-output source (gas high at 16.4 kW) requires only 628 CFM — within the capacity of a standard 900 CFM residential blower with 43% margin. In Moderate conditions, the same source requires 770 CFM — the 900 CFM blower provides 17% margin. The **Capture Envelope** is well-defined, the plume is narrow and coherent, and wind vulnerability is manageable.

**At 30 inches.** The inflection point. In Sheltered conditions, most sources fall between 313 and 830 CFM — manageable with 600-1200 CFM blowers. In Moderate conditions, the range expands to 384-1019 CFM, pushing larger gas sources beyond the 900 CFM threshold. This is the recommended maximum mounting height for general-purpose residential installations.

**Above 30 inches (36-48").** CFM requirements escalate rapidly. At 36 inches in Moderate conditions, a gas grill medium requires 972 CFM, and a gas grill large requires 1150 CFM. At 48 inches, the gas grill medium requires 1518 CFM in Moderate conditions. These values demand commercial-grade blowers (1200-2000 CFM), larger ductwork (10-12 inch diameter), and substantial structural support for the enlarged hood. Noise levels at these exhaust rates typically exceed 65-70 dBA, which may be unacceptable in residential settings.

### 4.3 Why Indoor CFM Rules Fail Outdoors

The ASHRAE BTU method (1 CFM per 100 BTU/hr) assigns 600 CFM to a 60,000 BTU gas grill. The physics-based outdoor analysis shows that 727 CFM is required at 30 inches in Sheltered conditions and 892 CFM in Moderate conditions. The indoor rule underspecifies by 21% (Sheltered) to 49% (Moderate).

The discrepancy arises from three physical differences between indoor and outdoor environments that the indoor rule does not account for:

1. **No wall-guided recirculation.** In an indoor kitchen, walls and ceiling redirect escaped plume gas back toward the hood. This creates a secondary capture opportunity that effectively increases the hood's **Effective Capture Area** beyond its physical footprint. Outdoors, any plume gas that escapes the **Capture Envelope** is permanently lost through **Open-Boundary Dilution**.

2. **No pressure-assisted capture.** Indoor range hoods operate in a closed room where the exhaust creates a slight negative pressure that assists inflow from all openings and gaps. This negative pressure draws room air (carrying escaped contaminants) toward the hood. Outdoors, the exhaust creates no meaningful pressure differential in the open atmosphere.

3. **Wind-driven plume displacement.** Indoor kitchens have negligible lateral air currents. Outdoors, even light winds deflect the plume laterally, expanding the **Missed Plume Region** beyond what the indoor CFM specification anticipates.

The outdoor correction factors (K_outdoor = 1.7 for Sheltered, 2.0-2.2 for Moderate, 2.4-2.8 for Exposed with panels) quantify these differences. They should be applied whenever an indoor CFM specification is adapted for outdoor use.

### 4.4 The Charcoal Paradox in CFM Terms

RB-001 identified the charcoal paradox: charcoal grills produce more contaminants but weaker plumes than gas grills of comparable total BTU. In CFM terms, the paradox manifests as follows:

A charcoal kettle at 15,000 BTU requires 335 CFM at 30 inches (Sheltered). A gas grill small at 25,000 BTU requires 500 CFM. The charcoal grill needs 33% less CFM despite producing comparable or greater smoke, grease aerosol, and particulate emissions.

This does not mean the charcoal grill is easier to ventilate. The low CFM requirement reflects the weak plume (Q_c = 1.8 kW, only 40% of total BTU), which entrains less ambient air. But this same weakness makes the plume highly vulnerable to wind displacement. The critical wind speeds for capture failure from RB-006 Table 3.4b are 30-40% lower for the charcoal kettle than for gas grills: 25% plume escape occurs at only 5.0 mph at 30 inches, compared to 6.7 mph for the gas grill medium.

The charcoal ventilation priority is therefore not CFM but geometry and wind protection:

1. Maximum hood overhang (20 inches per side at 30 inches, the largest of any source type, per RB-005 Table 3.8e).
2. Minimum mounting height (18-24 inches preferred).
3. Side panels for any installation classified as Moderate or higher wind exposure.
4. The charcoal grill's lower CFM requirement allows the use of a smaller, quieter blower — but the hood itself must be larger than for a comparably rated gas grill.

### 4.5 **Momentum-Limited Capture** and the Geometry-CFM Boundary

RB-003 and RB-005 independently established that for outdoor canopy hoods, capture failure from **Momentum-Limited Capture** manifests as edge spillage rather than plume penetration through the hood. The plume's upward momentum assists capture (it pushes gas into the hood), but the plume's low-velocity periphery can escape laterally if the hood's edge capture velocity is insufficient.

The CFM tables in this paper are sized to prevent momentum-limited edge failure under the specified wind conditions. However, this protection is contingent on the hood being properly sized per the RB-005 dimensional recommendations. If the hood is undersized (less than 90% of recommended width), the plume extends into the **Missed Plume Region** beyond the hood boundary, and no amount of additional CFM can recover this lost plume gas. The r^(-2) decay of the hood's suction field beyond its physical boundary means that the hood's "reach" for escaped plume gas is negligible.

This is the geometry-CFM boundary: CFM can compensate for moderate wind exposure (by increasing edge capture velocity), but it cannot compensate for inadequate hood width (because gas beyond the hood boundary is unrecoverable). The design rule from RB-005 Section 3.7 applies: geometric coverage first, CFM second.

### 4.6 Noise and Energy Implications of CFM Requirements

The CFM values in the lookup tables have direct implications for blower selection, noise generation, and energy consumption:

| CFM Range | Typical Blower Type | Duct Diameter | Noise Level (at 3 ft) | Power Draw |
|---|---|---|---|---|
| 300-600 | Single inline or centrifugal | 6-8" round | 45-55 dBA | 100-250 W |
| 600-900 | High-performance inline | 8-10" round | 55-65 dBA | 250-400 W |
| 900-1200 | Commercial-grade centrifugal | 10-12" round | 60-70 dBA | 350-550 W |
| 1200-1500 | Large commercial centrifugal | 10-12" round | 65-75 dBA | 500-750 W |
| 1500-2000 | Industrial centrifugal | 12-14" round | 70-80 dBA | 700-1000 W |

At 30 inches for a gas grill medium in Moderate conditions (747 CFM), a 900 CFM blower operating at approximately 80% capacity produces 58-63 dBA — acceptable for residential use but audible during conversation. At 48 inches for the same source (1518 CFM), a 1500+ CFM blower at full capacity produces 68-75 dBA — comparable to a vacuum cleaner and potentially disruptive for outdoor dining.

This noise escalation with mounting height is another practical argument for minimizing mounting height. The CFM reduction from 48-inch to 24-inch mounting (1518 to 550 CFM, a factor of 2.8) corresponds to approximately 10-15 dBA noise reduction — a subjectively dramatic improvement.

---

## 5. Knowledge Gaps or Opportunities

### 5.1 Well-Established Foundations

The following elements of the CFM methodology rest on well-established physical principles with known accuracy:

1. **The Heskestad plume mass flow correlation** is validated against extensive fire test data. The mass flow values are reliable to within approximately 15% for sources in the heat release rate range addressed by this program (1.5 to 16.4 kW convective).

2. **The z^(5/3) height scaling** of plume mass flow is a direct mathematical consequence of the conservation equations and MTT entrainment theory. It is not subject to significant empirical uncertainty.

3. **The Q_c^(1/3) source-strength scaling** of mass flow at a fixed height is similarly robust.

4. **The superiority of geometric coverage over exhaust velocity** for outdoor canopy hood capture is supported by both the suction-field decay analysis (r^(-2) beyond the hood) and the Gaussian velocity structure of the plume (low velocity at the plume edge).

### 5.2 Moderate Uncertainty

1. **The composite K_CFM multiplier.** Each constituent factor (F_inf = 2.0, F_wind, F_safety = 1.15) carries approximately 20-30% individual uncertainty. The product K_CFM could reasonably range from 2.2 to 4.0 for the Sheltered class and from 2.8 to 5.0 for the Moderate class. The values of 3.0 and 3.68 used in this paper are central engineering estimates, not precision calculations.

2. **The wind exposure classification thresholds.** The boundaries between Sheltered (< 3 mph), Moderate (3-7 mph), Exposed (7-12 mph), and Severe (> 12 mph) are engineering judgments calibrated against the Froude number regime transitions and deflection analysis of RB-006. Sites near the boundaries may perform better or worse than the classification predicts, depending on local terrain, vegetation, and structural wind sheltering.

3. **The island correction factor (1.20x).** This value is derived from RB-005's analysis of infiltration and wind exposure for four-sided-open configurations. The actual correction depends on the specific installation geometry and wind patterns. For well-sheltered island installations, the correction may be as low as 1.10. For fully exposed island installations with no rear wall, it may reach 1.30.

### 5.3 Unresolved Knowledge Gaps

1. **No experimental validation of outdoor CFM sizing.** The entire CFM methodology in this paper is derived from plume correlations and engineering correction factors. No published experimental data validates the specific CFM values for actual outdoor cooking installations. Tracer gas capture efficiency tests on operating outdoor barbecues at various CFM settings, mounting heights, and wind exposures would provide critical validation. Such testing would verify or refine the K_CFM multiplier and the wind correction factors.

2. **Dynamic plume behavior under varying wind.** The methodology assumes quasi-steady-state conditions: constant heat release, constant wind, constant CFM. Real outdoor cooking involves fluctuating fire intensity (especially for charcoal and wood-fired sources), variable wind speed and direction, and transient cooking events (fat drippings producing flare-ups). The interaction between these dynamic effects and the time-averaged CFM capacity of the blower is not quantified. A time-resolved capture efficiency measurement (using high-frequency tracer gas sampling) during a realistic outdoor cooking session would characterize this dynamic behavior.

3. **Effect of operator proximity.** The cook standing at the grill creates a physical obstruction that modifies the plume trajectory, produces wake turbulence, and introduces body heat that can interfere with the **Buoyant Cooking Plume**. The operator's breathing zone is also the primary exposure point for escaped contaminants. None of these operator interaction effects are accounted for in the current methodology.

4. **Multi-source configurations.** Outdoor cooking areas frequently operate multiple appliances simultaneously (e.g., a gas grill and a pellet smoker side by side, or a grill with a side burner). The interaction between adjacent plumes — merging, mutual entrainment, combined deflection — is not addressed. A simple additive approach (summing the CFM requirements of each source) may overestimate the total requirement because merged plumes are narrower than the sum of individual plumes. Conversely, the wider combined heat source may produce a plume that overflows a hood sized for a single source.

5. **Altitude correction.** All calculations assume standard sea-level ambient conditions (rho_inf = 1.20 kg/m^3, T_inf = 293 K). At elevated sites (e.g., Denver at 1,600 m, where rho_inf is approximately 1.01 kg/m^3), the plume buoyancy is reduced, the mass flow rate changes, and the required CFM values shift. An altitude correction factor has not been developed.

6. **High ambient temperature correction.** Outdoor cooking often occurs at ambient temperatures of 30-40 degrees C (86-104 degrees F), significantly above the 20 degrees C (68 degrees F) standard condition. Higher ambient temperature reduces the plume temperature differential, weakens buoyancy, and modifies the entrainment rate. The magnitude of this effect on CFM requirements has not been quantified.

---

## 6. Diagram Mapping Notes (Text Only)

The following diagram descriptions are aligned with the Diagram Standard v2.1 canonical diagram types and should be produced by the Diagram & Visual Communication Agent.

### Diagram 6.1: CFM Requirements Versus Mounting Height — All Source Types (Diagram Type 2 — Quantitative Chart)

**Purpose:** Provide the primary engineering reference chart showing total required CFM as a function of mounting height for all source types under Sheltered conditions (K_CFM = 3.0).

**Content:**
- X-axis: mounting height (18" to 48") with 6-inch increments
- Y-axis: required CFM (0 to 2000 CFM)
- Twelve curves, one per source type from Table 3.2a, color-coded by source category: gas grills (shades of blue), charcoal (red/amber), wood-fired (brown), pellet smokers (green)
- Horizontal reference lines at common blower capacities: 600 CFM (standard residential), 900 CFM (high-performance residential), 1200 CFM (commercial-grade), 1500 CFM (high-performance commercial)
- For the Gas Grill Large curve (the key research question source), annotate the 30-inch point: "60,000 BTU gas grill at 30 inches: 727 CFM (Sheltered)"
- Vertical dashed line at 30 inches labeled "Recommended maximum for general residential"
- Shaded region below 24 inches labeled "Preferred range: all sources below 630 CFM"
- Shaded region above 36 inches labeled "Commercial-grade equipment required"
- Power-law annotation: "CFM proportional to z^(5/3) — nonlinear growth"
- Figure caption: "Figure 8.1: Total required exhaust CFM as a function of mounting height for all outdoor cooking source types (Sheltered conditions, K_CFM = 3.0). Horizontal lines indicate common blower capacities. The steep z^(5/3) growth means that a 60,000 BTU gas grill requires 388 CFM at 18 inches but 1447 CFM at 48 inches — a 3.7x increase for a 2.7x height increase."

### Diagram 6.2: CFM by Wind Exposure Class — Gas Grill Medium at 30" (Diagram Type 2 — Grouped Bar Chart)

**Purpose:** Visualize the effect of wind exposure class on CFM requirements for the reference configuration.

**Content:**
- Four grouped bars for Gas Grill Medium at 30 inches:
  - Sheltered: 609 CFM (green)
  - Moderate: 747 CFM (yellow)
  - Exposed with panels: 841 CFM (orange)
  - Exposed without panels: 1169 CFM (red)
- Horizontal reference line at 900 CFM (common residential blower)
- Annotation showing the K_outdoor correction factor for each bar relative to an indoor baseline of 350 CFM
- Annotation at the Exposed-no-panels bar: "Without side panels, CFM nearly doubles relative to Sheltered"
- Annotation between Exposed-panels and Exposed-no-panels: "Side panels save 328 CFM (28%) in Exposed conditions"
- Figure caption: "Figure 8.2: Effect of wind exposure class on required CFM for a Gas Grill Medium (40,000 BTU) at 30-inch mounting height. Side panels provide substantial CFM reduction in Exposed conditions by reducing effective wind at the plume."

### Diagram 6.3: Outdoor Correction Factor Visualization (Diagram Type 2 — Comparison Chart)

**Purpose:** Show the gap between indoor CFM baselines and outdoor requirements across wind exposure classes.

**Content:**
- X-axis: wind exposure class (Indoor, Sheltered, Moderate, Exposed with panels, Exposed no panels)
- Y-axis: CFM (0 to 1400)
- Bar for each class, with the indoor baseline (350 CFM) shown as a filled bar and the outdoor increment shown as a stacked extension
- K_outdoor factor annotated on each bar: 1.0 (indoor), 1.7, 2.1, 2.4, 3.3
- The incremental additions labeled: "infiltration," "wind margin," "safety margin"
- Reference: Gas Grill Medium at 30"
- Annotation: "Indoor CFM rules underspecify outdoor requirements by 70% (Sheltered) to 230% (Exposed without panels)"
- Figure caption: "Figure 8.3: Outdoor correction factors relative to the indoor ASHRAE BTU-method baseline (350 CFM) for a Gas Grill Medium at 30 inches. The correction factors range from 1.7 (Sheltered) to 3.3 (Exposed without panels), reflecting the cumulative effect of ambient air infiltration, wind exposure, and the absence of enclosure-assisted capture."

### Diagram 6.4: Maximum Mounting Height Map (Diagram Type 2 — Heatmap or Line Chart)

**Purpose:** Quick-reference visualization of maximum mounting height for each source type as a function of available blower CFM, for Moderate wind exposure.

**Content:**
- X-axis: available blower CFM (400 to 2000 CFM)
- Y-axis: mounting height (18" to 72")
- Eight curves from Table 3.7b showing the boundary between adequate CFM (below curve) and insufficient CFM (above curve)
- Color-coded by source type
- Shaded green region: CFM adequate for reliable capture
- Shaded red region: CFM insufficient
- Key data points annotated: "Gas Large + 900 CFM: max 30 inches," "Gas Medium + 900 CFM: max 34 inches"
- Figure caption: "Figure 8.4: Maximum practical mounting height as a function of blower CFM for Moderate wind exposure (K_CFM = 3.68). For each source type, mounting above the curve exceeds the available CFM and results in degraded capture."

### Diagram 6.5: CFM Scaling with Source Heat Release Rate (Diagram Type 2 — Scatter/Line Plot)

**Purpose:** Illustrate the sublinear Q_c^(1/3) scaling of CFM with source strength.

**Content:**
- X-axis: convective heat release rate Q_c (0 to 18 kW), with secondary axis showing total BTU/hr (0 to 80,000)
- Y-axis: required CFM at 30 inches, Sheltered (0 to 1000)
- Data points for all twelve source types from Table 3.4a
- Fitted Q_c^(1/3) curve through the gas grill points (which share chi_c = 0.70 and similar D_eff)
- Charcoal points plotting below the gas curve (due to their more negative z_0 and lower chi_c shifting their effective height)
- Annotation showing the sublinear scaling: "Doubling source output increases CFM by only 26%"
- Annotation at charcoal points: "Low chi_c reduces plume strength, shifting charcoal below the gas scaling line"
- Figure caption: "Figure 8.5: Required CFM at 30 inches (Sheltered) as a function of convective heat release rate. The Q_c^(1/3) scaling produces a sublinear relationship: doubling the source output increases the CFM requirement by only 26%. Different convective fractions cause charcoal and pellet sources to deviate from the gas grill scaling line."

### Diagram 6.6: Integrated Design Reference — Gas Grill Medium (Diagram Type 3 — Layout/Specification Drawing)

**Purpose:** A consolidated visual specification sheet for the Gas Grill Medium at 30 inches, combining geometry, CFM, and wind exposure.

**Content:**
- Plan view of hood over grill showing: 57" width, 53" depth (island) or 41" (wall), 17" overhang per side, 3" lip
- Side elevation showing: 30" mounting height, **Buoyant Cooking Plume** expanding from grill to hood, plume diameter (41") fitting within hood width (57")
- CFM specification box showing: 609 (Sheltered), 747 (Moderate), 841 (Exposed + panels)
- Blower recommendation: 900 CFM
- Side panel indication for Moderate and Exposed conditions
- Wind arrow showing deflection direction with annotation: "At 5 mph, plume deflects 12 inches — within 17-inch overhang margin"
- **Plume Interception Plane** shown as dashed horizontal line at hood face height
- Figure caption: "Figure 8.6: Integrated design specification for a Gas Grill Medium (40,000 BTU) at 30-inch mounting height. The hood width (57 inches) provides 17 inches of overhang per side, accommodating plume deflection up to approximately 5 mph. CFM requirements range from 609 (Sheltered) to 841 (Exposed with side panels)."

---

## Appendix A: CFM Calculation Procedure — Step-by-Step

For any outdoor cooking source not explicitly listed in the lookup tables, the following procedure produces the required CFM:

**Step 1: Determine Q_c.**
- Obtain the total heat release rate Q_total in BTU/hr or kW (1 kW = 3,412 BTU/hr).
- Apply the convective fraction: Q_c = chi_c * Q_total.
  - Gas: chi_c = 0.70
  - Charcoal (glowing): chi_c = 0.40
  - Charcoal (flaming): chi_c = 0.55
  - Wood-fired: chi_c = 0.65
  - Pellet smoker: chi_c = 0.65

**Step 2: Compute the effective source diameter.**
- D_eff = sqrt(4 * A_cook / pi), where A_cook is the cooking surface area in m^2.

**Step 3: Compute the virtual origin.**
- z_0 = 0.083 * Q_total_kW^(2/5) - 1.02 * D_eff [meters]

**Step 4: Compute bare plume mass flow at the proposed mounting height z (meters).**
- m_dot_p = 0.071 * Q_c^(1/3) * z^(5/3) + 0.0018 * Q_c [kg/s]
- CFM_plume = (m_dot_p / 1.10) * 2119 [CFM]

**Step 5: Determine K_CFM from the wind exposure class.**

| Wind Exposure | K_CFM |
|---|---|
| Sheltered (< 3 mph) | 3.0 |
| Moderate (3-7 mph) | 3.68 |
| Exposed with panels (7-12 mph) | 4.14 |
| Exposed without panels (7-12 mph) | 5.75 |

**Step 6: Apply installation correction.**
- Wall-mount: multiply by 1.00
- Island: multiply by 1.20
- Peninsula: multiply by 1.10

**Step 7: Compute required CFM.**
- CFM_required = CFM_plume * K_CFM * installation_factor

**Step 8: Select blower.**
- Choose a blower rated at least 1.1x the required CFM against the expected system static pressure (typically 0.5-1.5 inches of water column for residential outdoor hoods).

**Example:** A custom wood-fired grill rated at 50,000 BTU/hr with a 28" x 20" cooking surface, mounted at 36 inches on an island patio with Moderate wind exposure.

1. Q_total = 50,000 BTU/hr = 14.7 kW. chi_c = 0.65. Q_c = 9.6 kW.
2. A_cook = 28 * 20 = 560 sq in = 0.361 m^2. D_eff = sqrt(4 * 0.361 / pi) = 0.678 m.
3. z_0 = 0.083 * 14.7^(2/5) - 1.02 * 0.678 = 0.083 * 3.06 - 0.692 = 0.254 - 0.692 = -0.438 m.
4. z = 0.91 m. m_dot_p = 0.071 * 9.6^(1/3) * 0.91^(5/3) + 0.0018 * 9.6 = 0.071 * 2.12 * 0.855 + 0.017 = 0.129 + 0.017 = 0.146 kg/s. CFM_plume = (0.146 / 1.10) * 2119 = 281 CFM.
5. K_CFM = 3.68 (Moderate).
6. Island installation: factor = 1.20.
7. CFM_required = 281 * 3.68 * 1.20 = 1241 CFM.
8. Select 1500 CFM blower (provides 21% margin).

## Appendix B: Conversion Between K_CFM and K_outdoor

The relationship between the physics-based multiplier K_CFM and the indoor-referenced correction factor K_outdoor depends on the indoor baseline CFM:

> K_outdoor = (K_CFM * CFM_plume) / CFM_indoor

Since CFM_plume is approximately CFM_indoor / K_indoor_effective (where K_indoor_effective is approximately 1.0-1.5 for well-specified indoor hoods):

> K_outdoor approximately equals K_CFM / K_indoor_effective approximately equals K_CFM / 1.5 to K_CFM / 1.0

For the ASHRAE BTU method (which yields CFM approximately equal to 1.5 to 2.0 times the bare plume flow for indoor applications), K_indoor_effective is approximately 1.5 to 2.0:

| K_CFM | K_outdoor (vs BTU method) | K_outdoor (vs linear-foot method) |
|---|---|---|
| 3.0 (Sheltered) | 1.5 - 2.0 | 1.2 - 1.5 |
| 3.68 (Moderate) | 1.8 - 2.5 | 1.5 - 1.8 |
| 4.14 (Exposed + panels) | 2.1 - 2.8 | 1.7 - 2.1 |
| 5.75 (Exposed, no panels) | 2.9 - 3.8 | 2.3 - 2.9 |

The recommended simplified K_outdoor values from Section 3.5 (1.7 Sheltered, 2.0-2.2 Moderate, 2.4-2.8 Exposed with panels) are calibrated against the BTU method baseline and fall within the ranges above.

## Appendix C: Standard Conditions and Unit Conversions

| Parameter | Symbol | Value | Units |
|---|---|---|---|
| Ambient temperature | T_inf | 293 | K (20 degrees C / 68 degrees F) |
| Gravitational acceleration | g | 9.81 | m/s^2 |
| Ambient air density | rho_inf | 1.20 | kg/m^3 |
| Plume-average density | rho_plume | 1.10 | kg/m^3 (approximate, for CFM conversion) |
| Specific heat of air | c_p | 1.00 | kJ/(kg*K) |
| Entrainment coefficient (far-field) | alpha | 0.11 | dimensionless |

| Quantity | SI | Imperial |
|---|---|---|
| Heat release rate | 1 kW | 3,412 BTU/hr |
| Volumetric flow | 1 m^3/s | 2,119 CFM |
| Velocity | 1 m/s | 197 ft/min |
| Length | 1 m | 39.37 inches |
| Mass flow rate | 1 kg/s | 2.205 lb/s |
| Pressure | 1 Pa | 0.00402 in. w.c. |

## Appendix D: Summary of Key Formulas

| Quantity | Formula | Source |
|---|---|---|
| Convective heat release | Q_c = chi_c * Q_total | RB-001 Section 2.4 |
| Effective source diameter | D_eff = sqrt(4 * A_cook / pi) | RB-001 Section 3.1 |
| Virtual origin | z_0 = 0.083 * Q_total^(2/5) - 1.02 * D | RB-001 Section 2.2 (Heskestad) |
| Flame height | L_f = 0.235 * Q_total^(2/5) - 1.02 * D | RB-001 Section 2.2 (Heskestad) |
| Plume mass flow (z > L_f) | m_dot_p = 0.071 * Q_c^(1/3) * z^(5/3) + 0.0018 * Q_c | RB-001 Section 2.2 (Heskestad) |
| Centerline velocity | u_0 = 1.03 * Q_c^(1/3) * (z - z_0)^(-1/3) | RB-001 Section 2.2 (Heskestad) |
| Plume capture diameter | d_capture = 0.48 * (z - z_0) + D_eff | RB-001 Section 3.6 |
| Recommended hood width | W_rec = 1.70 * d_capture | RB-002 |
| Required CFM | CFM_req = K_CFM * CFM_plume | This paper, Section 2.2 |
| K_CFM (Sheltered) | F_inf * F_wind * F_safety = 2.0 * 1.3 * 1.15 = 3.0 | RB-003 Section 3.6 |
| K_CFM (Moderate) | 2.0 * 1.6 * 1.15 = 3.68 | RB-003 Section 3.7 |
| K_CFM (Exposed + panels) | 2.0 * 1.8 * 1.15 = 4.14 | This paper, Section 2.2 |
| K_CFM (Exposed, no panels) | 2.0 * 2.5 * 1.15 = 5.75 | This paper, Section 2.2 |
| Outdoor correction factor | K_outdoor = CFM_outdoor / CFM_indoor | This paper, Section 3.5 |
| Plume deflection | delta_x = 0.35 * U_w * z / u_0(z) | RB-006 Section 3.1 |
| Wind-enhanced plume diameter | d_wind = d_still * (1 + 0.35 * Fr) | RB-006 Section 3.5 |

---

## References

1. Morton, B.R., Taylor, G.I., and Turner, J.S. (1956). "Turbulent gravitational convection from maintained and instantaneous sources." *Proceedings of the Royal Society A*, 234, pp. 1-23.

2. Heskestad, G. (2016). "Fire Plumes, Flame Height, and Air Entrainment." Chapter 13, *SFPE Handbook of Fire Protection Engineering*, 5th ed. Springer.

3. McCaffrey, B.J. (1979). "Purely Buoyant Diffusion Flames: Some Experimental Results." NBSIR 79-1910, National Bureau of Standards.

4. ASHRAE (2019). *ASHRAE Handbook — HVAC Applications*, Chapter 33: Kitchen Ventilation.

5. ASHRAE Standard 154 (2016). *Ventilation for Commercial Cooking Operations*.

6. ACGIH (2019). *Industrial Ventilation: A Manual of Recommended Practice for Design*, 30th ed.

7. Briggs, G.A. (1984). "Plume Rise and Buoyancy Effects." Chapter 8, *Atmospheric Science and Power Production*, DOE/TIC-27601.

8. Cetegen, B.M., Zukoski, E.E., and Kubota, T. (1982). "Entrainment and Flame Geometry of Fire Plumes." PhD Thesis, California Institute of Technology.

9. Zukoski, E.E. (1995). "Properties of Fire Plumes." In *Combustion Fundamentals of Fire*, ed. G. Cox, Academic Press.

10. Fric, T.F. and Roshko, A. (1994). "Vortical structure in the wake of a transverse jet." *Journal of Fluid Mechanics*, 279, pp. 1-47.

11. Davidson, G.A. (1986). "A modified power law representation of the Pasquill-Gifford dispersion coefficients." *Journal of the Air Pollution Control Association*, 40(8), pp. 1146-1147.

12. Contini, D. and Robins, A.G. (2001). "Water tank measurements of buoyant plume rise and structure in neutral crossflows." *Atmospheric Environment*, 35(35), pp. 6105-6115.

13. Drysdale, D. (2011). *An Introduction to Fire Dynamics*, 3rd ed. John Wiley & Sons. Chapter 4: Diffusion Flames and Fire Plumes.

14. Thomas, P.H. et al. (1963). "Investigation into the Flow of Hot Gases in Roof Venting." Fire Research Technical Paper No. 7, HMSO, London.

---

*This document is a research output of the Outdoor Ventilation Standard, governed by the Research Program Charter v2.6. All terms are used as defined in Glossary v1.1. This paper synthesizes the plume physics of RB-001, the velocity decay analysis of RB-003, the hood geometry analysis of RB-005, and the wind interaction analysis of RB-006 into a unified CFM sizing methodology for outdoor barbecue ventilation.*
