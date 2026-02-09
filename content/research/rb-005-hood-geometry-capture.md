---
title: "RB-005: Impact of Hood Geometry on Capture Performance"
date: 2025-10-22
lastmod: 2025-11-09
draft: false
type: "research"
series: "Outdoor Ventilation Standard"
research_id: "RB-005"
priority: "P1 — Core"
status: "Complete"
version: "1.0"
charter_version: "2.6"
glossary_version: "1.1"
diagram_standard_version: "2.1"
dependencies: "RB-001, RB-002, RB-003"
downstream_topics:
  - "RB-007: Failure Modes of Outdoor BBQ Hoods"
  - "RB-008: CFM Requirements for Outdoor Cooking Ventilation"
  - "RB-009: Side Panel and Wind Baffle Effectiveness"
description: "Comprehensive analysis of how hood geometric parameters — canopy width, depth, overhang, lip height, internal baffle configuration, and canopy shape — affect the Capture Envelope and Effective Capture Area for outdoor barbecue ventilation. Models the interaction between hood geometry and exhaust rate across all source types and mounting heights."
summary: "This paper systematically analyzes each geometric dimension of the outdoor barbecue ventilation hood and its effect on plume capture performance. It delivers minimum and recommended overhang requirements, width-versus-depth asymmetry analysis, hood lip improvement factors, canopy shape comparison, internal volume and baffle effects, geometry-CFM interaction models, and consolidated design guideline tables for every source type at every standard mounting height."
tags: ["hood design", "capture envelope", "hood geometry"]
categories: ["P1 — Core"]
---

**Research Program:** Outdoor Ventilation Standard
**Charter Version:** 2.6
**Glossary Version:** 1.1
**Priority Tier:** P1 — Core
**Author Role:** Hood Performance & Design Agent
**Date:** 2026-02-08
**Depends On:** RB-001: Buoyant Plume Behavior from Barbecue and High-Heat Cooking Sources; RB-002: Entrainment and Lateral Plume Spread in Open-Air Environments; RB-003: Velocity Decay and Near-Field vs. Far-Field Capture

---

## 1. Topic Definition

This paper analyzes how the geometric parameters of an outdoor barbecue ventilation hood — canopy width, canopy depth, overhang beyond the cooking surface, lip height, internal baffle configuration, canopy shape, and internal volume — individually and collectively affect the **Capture Envelope** and **Effective Capture Area** for outdoor plume capture. Where RB-001 characterized the **Buoyant Cooking Plume** itself, RB-002 derived the required hood footprint dimensions, and RB-003 established CFM requirements and maximum mounting heights, this paper focuses on the hood as a physical object and examines how each dimensional parameter modifies capture performance.

The scope encompasses:

1. **Overhang analysis.** Quantitative determination of the minimum and recommended overhang for each of the eleven source types catalogued in RB-001 Table 3.1, at each of the five standard mounting heights (18", 24", 30", 36", 48"). Overhang is the distance the hood extends beyond the cooking surface edge on each side. This is the single most critical geometric parameter for outdoor capture because it directly determines whether the laterally expanded plume falls within or outside the **Capture Envelope**.

2. **Width versus depth analysis.** Examination of how the two horizontal dimensions of the hood — width (side-to-side, parallel to the grill's long axis) and depth (front-to-back, perpendicular to the grill's long axis) — affect capture differently. This includes asymmetric requirements arising from wall-mount versus island configurations and operator access constraints.

3. **Hood lip and flange effects.** Analysis of how a turned-down perimeter lip or flange at the hood's lower edge modifies the **Capture Envelope** volume, creates a localized air curtain effect at the hood perimeter, and improves resistance to crosswind plume deflection. Quantification of the improvement factor relative to a flat-bottom hood.

4. **Canopy shape analysis.** Comparison of flat-bottom, tapered (pyramidal), island (symmetrically accessible), and wall-mount (rear-bounded) canopy configurations. Assessment of how shape affects internal airflow distribution, **Effective Capture Area** as a fraction of total hood face area, and velocity uniformity across the hood face.

5. **Hood internal volume analysis.** How the vertical dimension of the hood cavity (from the lip to the filter/exhaust plane) affects capture and containment by providing a buffer volume for turbulent plume fluctuations and a pressure equalization zone.

6. **Baffle and filter configuration.** How internal baffles affect velocity distribution across the hood face and thus the fraction of total hood area that actively contributes to capture — the **Effective Capture Area**.

7. **Geometry-CFM interaction.** How hood geometry and exhaust rate interact: the tradeoff between a wider hood at lower CFM versus a narrower hood at higher CFM, the concept of face velocity distribution, and the optimal balance between geometric coverage and exhaust velocity.

8. **Design guideline tables.** The key engineering deliverable: for each source type, minimum hood dimensions (W x D) and minimum overhang at each mounting height, along with recommended dimensions incorporating the outdoor margin factor K = 1.70 from RB-002.

### Relationship to Foundation Papers

RB-001 established the plume physics: heat release rates, virtual origins, centerline temperature and velocity profiles, plume diameters, and mass flow rates for all source types. The key formula for plume capture diameter is:

> d_capture = 0.48 * (z - z_0) + D_eff

RB-002 extended this with entrainment analysis, turbulent intermittency margins, and the outdoor margin factor K = 1.70, delivering recommended hood width and depth tables. The recommended hood width is:

> W_rec = K * d_capture = 1.70 * [0.48 * (z - z_0) + D_eff]

RB-003 established CFM requirements at each mounting height using K_CFM = 3.0 (standard outdoor) and K_CFM = 3.68 (sustained light wind), along with maximum mounting heights as a function of available blower capacity.

This paper builds on all three predecessors by answering the question: **given the plume dimensions and the exhaust rate, how does the specific geometric design of the hood itself affect whether capture succeeds or fails?** RB-002 told us the hood must be 57 inches wide for a medium gas grill at 30 inches. This paper tells us what happens when the hood is 48 inches, 54 inches, or 60 inches; what happens when a 3-inch lip is added; what the difference is between a flat-bottom and tapered canopy; and how internal baffles change the **Effective Capture Area**.

### Problem Framing

The hood is the physical interface between the rising **Buoyant Cooking Plume** and the exhaust system. Its geometry defines three critical quantities:

1. **The Capture Envelope** — the three-dimensional region of space beneath the hood within which plume gas can be drawn into the exhaust. The Capture Envelope is bounded laterally by the hood perimeter (or, for a lipped hood, by a curtain of inward-flowing air at the lip), vertically by the hood face above and the cooking surface below, and dynamically by the exhaust-induced suction field.

2. **The Effective Capture Area** — the fraction of the hood's total face area that actively draws plume gas upward into the exhaust. Due to non-uniform velocity distribution across the hood face (higher velocity near the exhaust collar, lower velocity at the periphery), the Effective Capture Area is always less than the total geometric area. For a flat-bottom hood without baffles, the Effective Capture Area may be only 40-60% of the total face area. For a well-baffled hood, this fraction can reach 70-85%.

3. **The Missed Plume Region** — the volume of space where plume gas passes beyond the hood's physical boundary or beyond the reach of its suction field. This is the complement of the Capture Envelope. Any plume gas that enters the Missed Plume Region is permanently lost through **Open-Boundary Dilution** in the outdoor environment.

The central thesis of this paper is that hood geometry is not merely a matter of making the hood "large enough." The specific dimensional parameters — overhang, lip height, internal volume, baffle placement — each have quantifiable effects on capture performance that can mean the difference between reliable capture and systematic failure. A well-designed 54-inch hood can outperform a poorly designed 66-inch hood if the smaller hood has proper overhang, adequate lip height, effective baffling, and correct proportions.

---

## 2. Relevant Physical Principles

### 2.1 The Suction Field of a Canopy Hood

A canopy hood operating at exhaust rate Q_exhaust creates a three-dimensional suction field beneath it. The characteristics of this field are governed by potential flow theory modified by the geometric boundary conditions of the hood body.

For a flat-bottom rectangular canopy hood without lip, the inward velocity at distance r from the hood center decreases approximately as:

> v(r) proportional to Q_exhaust / (2 * pi * r^2) for r >> hood dimensions (far-field)

> v(r) approximately Q_exhaust / A_hood for r << hood dimensions (directly beneath hood)

In the near-field (directly beneath the hood), the velocity is approximately the face velocity v_face = Q_exhaust / A_hood, distributed reasonably uniformly across the hood area. Beyond the hood perimeter, the velocity drops off rapidly with distance — the hood's "reach" into the surrounding air is limited.

The critical characteristic is that the suction field decays as r^(-2) in the far-field. This means the hood's ability to draw in plume gas from beyond its physical boundary is extremely weak. At a distance of one hood-width beyond the perimeter, the induced inward velocity is only approximately 3-5% of the face velocity. This physical reality is why geometric coverage (making the hood wide enough to physically encompass the plume) is more effective than increasing suction velocity (increasing CFM to "reach" for plume gas beyond the hood boundary).

### 2.2 The Capture Envelope Geometry

The **Capture Envelope** is the three-dimensional region of space from which the hood can successfully draw in and exhaust gas. For a canopy hood, the Capture Envelope is approximately a truncated inverted pyramid extending downward from the hood face, with the pyramid's base at the hood face and its apex at some distance below.

The Capture Envelope is defined by the condition that the hood-induced inward velocity at any point on the envelope boundary exceeds the outward velocity of plume gas or ambient air attempting to escape. At the hood perimeter, this condition is:

> v_edge_induced > v_escape

where v_escape includes contributions from plume lateral velocity, ambient wind, and turbulent fluctuations.

For a flat-bottom hood without a lip, the Capture Envelope contracts rapidly below the hood face because the inward velocity drops steeply with distance below the hood. The effective capture depth (the vertical distance below the hood face at which capture is still reliable) is approximately:

> h_capture_flat approximately 0.1 to 0.15 * sqrt(A_hood)

For a typical 57" x 53" hood (A_hood = 1.95 m^2): h_capture_flat approximately 0.14 to 0.21 m (5.5 to 8.3 inches).

Adding a perimeter lip increases the capture depth substantially (see Section 3.3).

### 2.3 Overhang and the Plume Interception Plane

Overhang is the horizontal distance by which the hood extends beyond the cooking surface edge in any direction. At the **Plume Interception Plane** (the horizontal plane at the hood face height), the plume has expanded beyond the cooking surface dimensions due to entrainment-driven spread. The overhang must be sufficient to ensure that the expanded plume falls entirely within the hood's physical footprint.

The required overhang per side is:

> OH_required = (d_hood_required - W_cooking) / 2

where d_hood_required is the required hood width from RB-002 and W_cooking is the cooking surface width. For the recommended outdoor margin K = 1.70:

> OH_required = (1.70 * d_capture - W_cooking) / 2

> OH_required = (1.70 * [0.48 * (z - z_0) + D_eff] - W_cooking) / 2

This formula shows that overhang increases with mounting height z (because d_capture grows with z), increases with source effective diameter D_eff (larger cooking surfaces produce wider plumes), and decreases with cooking surface width W_cooking (a wider cooking surface requires less additional overhang because the plume expansion is measured from a larger base).

### 2.4 The Role of Hood Lip in Capture Enhancement

A hood lip (or turned-down perimeter flange) is a vertical extension descending from the lower edge of the hood body around part or all of the perimeter. The lip creates a vertical channel between the hood body and the ambient air through which inward air must flow to enter the hood.

The lip affects capture through three mechanisms:

**Mechanism 1 — Virtual face area reduction.** The lip creates an annular opening at the bottom of the hood rather than the full hood face area. Air entering the hood must flow upward through this narrower annular gap, which locally accelerates the flow and creates higher inward velocities at the hood perimeter. This is equivalent to reducing the effective face area while maintaining the same total exhaust flow, thereby increasing the velocity specifically where it is most needed — at the hood edges where plume escape occurs.

**Mechanism 2 — Capture Envelope extension.** The lip extends the Capture Envelope vertically downward. Without a lip, the effective capture depth below the hood face is limited (5-8 inches). With a lip of height h_lip, the effective capture depth increases to approximately h_capture_flat + h_lip, because the lip physically blocks lateral escape over the lip's height. A 3-inch lip adds approximately 3 inches to the effective capture depth.

**Mechanism 3 — Wind resistance.** The lip creates a partial physical barrier against crosswind that deflects wind around the hood perimeter rather than allowing it to sweep directly across the hood face. The wind must either go under the lip (losing energy as it turns the corner) or around the hood body. This reduces the effective wind velocity at the **Plume Interception Plane** within the hood.

### 2.5 Face Velocity Distribution and Effective Capture Area

The **Effective Capture Area** is the fraction of the total hood face area that actively contributes to plume capture. It is defined as:

> A_eff = A_hood * eta_uniformity

where eta_uniformity is the velocity uniformity factor, ranging from 0 to 1.

For a perfectly uniform velocity distribution (all points on the hood face have the same upward velocity), eta_uniformity = 1.0 and A_eff = A_hood. In practice, the velocity distribution is non-uniform:

- **Highest velocity** near the exhaust collar (duct connection) — this region draws the most air per unit area
- **Moderate velocity** at the hood center — adequate for capture
- **Lowest velocity** at the hood periphery, especially at corners — these regions may have insufficient upward velocity to draw in plume gas, particularly the slow-moving plume periphery

The velocity uniformity factor depends on the hood's internal geometry:

| Configuration | eta_uniformity | Effective Capture Area (% of total) |
|---|---|---|
| Flat bottom, no baffles, single center exhaust | 0.40 - 0.55 | 40 - 55% |
| Flat bottom, no baffles, dual off-center exhausts | 0.50 - 0.65 | 50 - 65% |
| Flat bottom, with perimeter baffles | 0.60 - 0.75 | 60 - 75% |
| Tapered canopy with baffles | 0.65 - 0.80 | 65 - 80% |
| Tapered canopy with full baffle set and perimeter lip | 0.75 - 0.85 | 75 - 85% |

The implication is that for a 57" x 53" hood (total area = 3,021 sq in), the **Effective Capture Area** ranges from approximately 1,208 sq in (40%) to approximately 2,568 sq in (85%) depending on internal configuration. The plume capture diameter at 30 inches for a medium gas grill is 41 inches (area = 1,320 sq in for a circular plume). A poorly baffled hood may have an Effective Capture Area smaller than the plume cross-section despite having a total area larger than it — a geometric adequacy that produces capture failure due to velocity distribution inadequacy.

### 2.6 Internal Volume as a Buffer

The internal volume of the hood cavity — the space between the hood face (open bottom) and the filter/exhaust plane — serves as a pressure equalization and turbulence buffering zone. When the plume enters the hood, its turbulent fluctuations (puffing, intermittent excursions) cause momentary variations in the entering flow rate. A larger internal volume absorbs these fluctuations by allowing the internal pressure to adjust smoothly rather than producing transient pressure spikes that could cause momentary flow reversal at the hood perimeter.

The buffering time constant is approximately:

> tau_buffer = V_hood / Q_exhaust

where V_hood is the internal volume and Q_exhaust is the exhaust volumetric flow rate. For effective buffering, tau_buffer should be at least comparable to the plume puffing period (0.5-0.6 seconds from RB-002 Section 2.6):

> V_hood_min = Q_exhaust * tau_puff = Q_exhaust * 0.5 seconds

For a medium gas grill at 30 inches with Q_exhaust = 609 CFM = 0.287 m^3/s:

> V_hood_min = 0.287 * 0.5 = 0.144 m^3 = 5.1 cubic feet

A 57" x 53" hood with 8 inches of internal depth has a volume of approximately 57 * 53 * 8 / 1728 = 14.0 cubic feet — well in excess of the minimum. This indicates that typical commercial hood internal volumes are adequate for buffering plume pulsations. However, very shallow hoods (less than 4 inches of internal depth) may have insufficient volume for adequate buffering.

### 2.7 Baffle Physics: Redistributing Flow

Internal baffles serve to redistribute exhaust flow from the natural concentration near the exhaust collar to a more uniform distribution across the entire hood face. Without baffles, the path of least resistance is the shortest, straightest path from the hood opening to the exhaust collar. This concentrates flow in the center of the hood directly beneath the collar, leaving the periphery with weak suction.

Baffles introduce flow resistance (pressure drop) in the high-velocity central region, forcing air to find alternative paths through the lower-resistance peripheral regions. The result is a more uniform velocity distribution across the hood face and a higher **Effective Capture Area**.

The optimal baffle design creates a graded pressure drop that is highest directly beneath the exhaust collar and lowest at the hood periphery, producing equal velocity at all points on the hood face. In practice, this is approximated by:

- **Mesh-type grease filters** spanning the full hood face area, which introduce approximately uniform pressure drop (1-3 Pa per filter layer) across the face
- **Perimeter slot baffles** that redirect some exhaust suction toward the hood edges
- **Internal divider plates** that create multiple parallel flow paths from hood face to exhaust collar
- **Tapered canopy geometry** that naturally accelerates peripheral flow by reducing the cross-section toward the exhaust

---

## 3. Observed or Expected Behavior

### 3.1 Overhang Analysis: Minimum and Recommended Values

The overhang per side is calculated using the formula from Section 2.3:

> OH = (W_hood - W_cooking) / 2

Two overhang values are reported for each source/height combination:

- **OH_min**: Using the minimum hood width W_min = d_capture (the Heskestad capture diameter, corresponding to 98% time-averaged flux capture in quiescent conditions). This provides no margin for turbulence, wind, or instantaneous plume fluctuation and is the absolute minimum for any capture.

- **OH_rec**: Using the recommended hood width W_rec = 1.70 * d_capture (the outdoor margin from RB-002). This provides margin for turbulent intermittency, puffing, and light wind, and is the recommended value for outdoor installations.

Cooking surface widths are taken from RB-002 Appendix A.4:

| Source Type | Cooking Surface Width (inches) |
|---|---|
| Gas Grill — Small | 18 |
| Gas Grill — Medium | 24 |
| Gas Grill — Large | 30 |
| Gas Grill — High-Output | 36 |
| Charcoal Kettle | 22 (diameter) |
| Wood-Fired | 24 |
| Wood-Fired Large | 36 |
| Pellet Smoker (all) | 22 |

#### Table 3.1a: Minimum Overhang Per Side — OH_min (inches)

Based on W_min = d_capture from RB-001 Table 3.6 and RB-002 Tables 3.3a-f.

| Height | Gas Small | Gas Med | Gas Large | Gas High | Charcoal | Wood | Wood Lg | Pellet |
|---|---|---|---|---|---|---|---|---|
| 18" | 7 | 7 | 5 | 3 | 9 | 6 | 5 | 6 |
| 24" | 8 | 8 | 6 | 5 | 10 | 7 | 6 | 7 |
| 30" | 10 | 9 | 8 | 6 | 12 | 8 | 8 | 9 |
| 36" | 11 | 10 | 9 | 8 | 13 | 10 | 9 | 10 |
| 48" | 14 | 13 | 12 | 11 | 16 | 13 | 12 | 13 |

#### Table 3.1b: Recommended Overhang Per Side — OH_rec (inches)

Based on W_rec = 1.70 * d_capture from RB-002 Tables 3.6a-k. Values match the RB-002 engineering deliverable.

| Height | Gas Small | Gas Med | Gas Large | Gas High | Charcoal | Wood | Wood Lg | Pellet |
|---|---|---|---|---|---|---|---|---|
| 18" | 13 | 13 | 12 | 11 | 16 | 13 | 13 | 12 |
| 24" | 14 | 15 | 14 | 13 | 18 | 15 | 15 | 14 |
| 30" | 16 | 17 | 16 | 15 | 20 | 17 | 17 | 16 |
| 36" | 18 | 19 | 18 | 17 | 22 | 18 | 19 | 18 |
| 48" | 22 | 23 | 22 | 21 | 26 | 22 | 23 | 22 |

**Key findings from the overhang analysis:**

1. **Minimum overhang ranges from 3 to 16 inches** depending on source type and height. The absolute lowest minimum overhang (3 inches per side) occurs for the gas grill high-output at 18-inch mounting height. This seems counterintuitive — the largest source requires the least overhang — but it is because the gas high-output has the widest cooking surface (36 inches), and at 18 inches the plume has not expanded far beyond this base. The plume capture diameter is 46 inches, and the cooking surface is already 36 inches, leaving only 5 inches of expansion per side.

2. **Recommended overhang ranges from 11 to 26 inches per side.** The outdoor margin factor K = 1.70 approximately doubles the minimum overhang. The largest recommended overhang (26 inches per side) is for the charcoal kettle at 48-inch mounting height, where the plume has expanded significantly from the 22-inch diameter cooking surface and the full outdoor turbulence and wind margin must be provided.

3. **Charcoal kettle consistently requires the most overhang** among all source types at every mounting height. This is because the charcoal kettle has a relatively small cooking surface (22-inch diameter) relative to its effective source diameter (D_eff = 0.56 m = 22 inches) and a strongly negative virtual origin (z_0 = -0.47 m), producing a wide plume relative to its cooking surface. The plume expands substantially, but the cooking surface is compact.

4. **Overhang increases approximately 2-3 inches per side for each 6 inches of additional mounting height.** This is the direct geometric consequence of the linear plume expansion rate (b_T = 0.12(z - z_0)).

5. **At 30 inches — the most common mounting height — recommended overhang is 15-20 inches per side for all source types.** This means the hood must extend 15-20 inches beyond the cooking surface on each side, adding 30-40 inches to the cooking surface width. A 24-inch cooking surface requires a 54-64 inch hood. A 36-inch cooking surface requires a 66-76 inch hood.

#### Table 3.1c: Overhang Rate of Change per 6 Inches of Additional Mounting Height

| Height Increment | Average OH_rec Increase (inches per side) |
|---|---|
| 18" to 24" | +2.1 |
| 24" to 30" | +2.0 |
| 30" to 36" | +1.9 |
| 36" to 48" (12" increment) | +3.9 (equivalent to 2.0 per 6") |

The overhang growth rate is approximately constant at 2 inches per side per 6 inches of mounting height, reflecting the linear plume expansion in the far-field.

### 3.2 Width Versus Depth Analysis

The hood's width and depth serve different functions and have different requirements. The plume is approximately axisymmetric (expanding equally in all directions), but the cooking surface is typically rectangular, and the installation context introduces asymmetry.

**Width (side-to-side):** Must contain the lateral plume spread. The cooking surface is typically wider than it is deep (gas grills have aspect ratios of 1.1:1 to 1.6:1), so the plume starts wider in this dimension. The overhang requirement per side is determined by the difference between the plume capture diameter and the cooking surface width, as calculated in Section 3.1.

**Depth (front-to-back):** Must contain the front-to-back plume spread plus accommodate operator access. The cooking surface depth is typically 14-24 inches (less than the width), so the plume must expand further relative to the cooking surface in this dimension. However, the depth dimension also has an asymmetric requirement:

- **Rear overhang:** If the hood is against a wall or backsplash, the wall provides a physical barrier that prevents plume escape to the rear. In wall-mount installations, the rear overhang can be reduced to 6-8 inches (sufficient to prevent thermal damage to the wall surface), because any plume gas that reaches the wall is redirected upward by the wall's blocking effect. The wall acts as a natural extension of the **Capture Envelope** on the rear side.

- **Front overhang:** The front of the hood is fully open and is the direction from which the operator approaches. The front overhang must be sufficient to capture the plume when it is deflected forward by rear-to-front breezes (a common outdoor pattern when a wall or structure is behind the grill, creating a downdraft or eddy). Additionally, the operator's body, hand movements, and breathing create local air currents that can displace the plume forward. The front overhang should be at least equal to the recommended symmetric overhang calculated in Section 3.1.

- **Side overhang:** The sides are fully open in island installations. In wall-adjacent installations, one side may be partially blocked. The side overhang follows the symmetric calculation of Section 3.1.

#### Table 3.2a: Width and Depth Requirements for Gas Grill Medium (Cooking Surface: 24" W x 21" D)

| Height | W_rec (in) | D_rec (in) | OH_width per side (in) | OH_depth_front (in) | OH_depth_rear_island (in) | OH_depth_rear_wall (in) |
|---|---|---|---|---|---|---|
| 18" | 49 | 45 | 13 | 15 | 15 | 6 |
| 24" | 53 | 49 | 15 | 17 | 17 | 7 |
| 30" | 57 | 53 | 17 | 19 | 19 | 8 |
| 36" | 61 | 57 | 19 | 21 | 21 | 8 |
| 48" | 69 | 65 | 23 | 25 | 25 | 8 |

#### Table 3.2b: Width and Depth Requirements for Gas Grill Large (Cooking Surface: 30" W x 22" D)

| Height | W_rec (in) | D_rec (in) | OH_width per side (in) | OH_depth_front (in) | OH_depth_rear_island (in) | OH_depth_rear_wall (in) |
|---|---|---|---|---|---|---|
| 18" | 54 | 47 | 12 | 16 | 16 | 6 |
| 24" | 58 | 51 | 14 | 18 | 18 | 7 |
| 30" | 62 | 55 | 16 | 20 | 20 | 8 |
| 36" | 66 | 59 | 18 | 22 | 22 | 8 |
| 48" | 74 | 67 | 22 | 26 | 26 | 8 |

#### Table 3.2c: Width and Depth Requirements for Charcoal Kettle (Cooking Surface: 22" diameter, circular)

| Height | W_rec (in) | D_rec (in) | OH per side (in) | OH_depth_front (in) | OH_depth_rear_island (in) | OH_depth_rear_wall (in) |
|---|---|---|---|---|---|---|
| 18" | 55 | 55 | 16 | 16 | 16 | 6 |
| 24" | 59 | 59 | 18 | 18 | 18 | 7 |
| 30" | 63 | 63 | 20 | 20 | 20 | 8 |
| 36" | 66 | 66 | 22 | 22 | 22 | 8 |
| 48" | 74 | 74 | 26 | 26 | 26 | 8 |

**Key findings from the width versus depth analysis:**

1. **Width exceeds depth for rectangular cooking surfaces.** For gas grills with aspect ratios of 1.1:1 to 1.6:1, the hood width exceeds the hood depth by 2-7 inches because the cooking surface is wider. The plume expansion adds the same overhang in both dimensions, so the absolute difference between width and depth is preserved from the cooking surface geometry.

2. **Circular cooking surfaces require square hoods.** The charcoal kettle produces an axisymmetric plume from a circular cooking surface, requiring equal width and depth.

3. **Wall-mount installations allow reduced rear overhang.** For wall-mount configurations, the rear overhang can be reduced from 15-26 inches (island) to 6-8 inches (wall-mount), reducing the required hood depth by 9-18 inches. This is a substantial material and space savings. The physical basis is that the wall prevents rearward plume escape and redirects the plume upward within the **Capture Envelope**.

4. **The depth dimension is more critical than width for capture reliability.** Although the hood is typically wider than deep, the depth dimension faces asymmetric challenges: the front is fully open to wind and operator interference, and the rear may be open (island) or bounded (wall-mount). In practice, front overhang failure is the most common geometry-related capture failure mode because: (a) operators lean over the front, creating turbulence; (b) forward wind approaches are common; and (c) aesthetically, designers tend to minimize front overhang for visual appeal. The analysis recommends that front overhang should never be less than the side overhang value.

5. **Depth requirement for wall-mount installations.** For a gas grill medium at 30 inches in a wall-mount configuration, the required depth is only 8 + 21 + 19 = 48 inches (rear wall overhang + cooking surface depth + front overhang), compared to 53 inches for an island installation. The wall-mount saves approximately 5 inches of depth. For an island installation, the full symmetric depth of 53 inches is required.

### 3.3 Hood Lip and Flange Effects

The hood lip is one of the most cost-effective geometric features for improving capture performance. A turned-down flange of 2-4 inches around the hood perimeter provides measurable improvement through the three mechanisms described in Section 2.4.

#### 3.3.1 Capture Envelope Volume Increase

The Capture Envelope for a flat-bottom hood extends approximately 0.1 to 0.15 * sqrt(A_hood) below the hood face (Section 2.2). Adding a lip of height h_lip extends this by approximately h_lip on all sides.

For a 57" x 53" hood (A_hood = 1.95 m^2):

| Configuration | Capture Depth Below Hood Face (inches) | Capture Envelope Volume (cubic feet) |
|---|---|---|
| Flat bottom, no lip | 5.5 - 8.3 | 11.5 - 17.3 |
| With 2" lip | 7.5 - 10.3 | 15.7 - 21.5 |
| With 3" lip | 8.5 - 11.3 | 17.8 - 23.6 |
| With 4" lip | 9.5 - 12.3 | 19.8 - 25.7 |

**Capture Envelope volume increase from a 3-inch lip: approximately 37-55%.**

This volume increase provides a larger buffer zone for turbulent plume excursions. When the plume momentarily extends beyond its time-averaged boundary (during a puff cycle or turbulent excursion), the expanded Capture Envelope can accommodate the excursion without losing plume gas.

#### 3.3.2 Edge Velocity Enhancement (Air Curtain Effect)

The lip creates a constriction at the hood perimeter that accelerates inward-flowing air. For a flat-bottom hood, ambient air can enter from any direction across the full face area. With a lip, air entering from outside the hood perimeter must flow upward through the annular gap between the lip's lower edge and the cooking surface/plume boundary.

The velocity at the lip gap is:

> v_lip = (Q_exhaust - Q_plume) / (P_hood * h_gap)

where h_gap is the effective gap height between the lip's lower edge and the plume boundary. If the lip descends below the hood face by h_lip, the effective gap through which ambient air enters is reduced, and the local velocity increases.

For a medium gas grill at 30 inches with Q_exhaust = 609 CFM, Q_plume = 203 CFM, P_hood = 2*(57+53) = 220 inches = 5.59 m:

| Lip Height | h_gap (effective, inches) | v_lip (fpm) | v_lip (m/s) | Improvement over no-lip |
|---|---|---|---|---|
| No lip (h_gap = full depth ~8") | 8.0 | 26 | 0.13 | 1.0x (baseline) |
| 2" lip (h_gap = 6.0") | 6.0 | 35 | 0.18 | 1.33x |
| 3" lip (h_gap = 5.0") | 5.0 | 42 | 0.21 | 1.60x |
| 4" lip (h_gap = 4.0") | 4.0 | 52 | 0.26 | 2.00x |

A 3-inch lip increases the edge velocity by 60% relative to a flat-bottom hood at the same CFM. A 4-inch lip doubles it. This increased edge velocity directly improves resistance to wind-induced plume escape at the hood perimeter.

#### 3.3.3 Wind Resistance Improvement

The lip provides a physical shield against crosswind at the hood perimeter. Wind approaching the hood must either pass beneath the lip (where the narrowed gap accelerates the opposing inflow from the exhaust suction) or flow around the hood body (missing the capture zone entirely).

The effective wind resistance of a lipped hood can be characterized by the maximum wind speed at which the edge capture velocity (v_lip) exceeds the wind component at the hood perimeter:

> U_wind_max_capture = v_lip (wind speed at which edge capture fails)

| Lip Height | v_lip (m/s) | Maximum Wind for Edge Capture (mph) | Improvement |
|---|---|---|---|
| No lip | 0.13 | ~0.3 mph | Baseline — fails in nearly any breeze |
| 2" lip | 0.18 | ~0.4 mph | Marginal improvement |
| 3" lip | 0.21 | ~0.5 mph | Moderate improvement |
| 4" lip | 0.26 | ~0.6 mph | Meaningful improvement |

These wind speeds represent the threshold for edge capture failure with CFM at the baseline K_CFM = 3.0 level. The improvement from a lip is real but modest in absolute terms — even a 4-inch lip only extends the wind tolerance from approximately 0.3 mph to 0.6 mph. The primary wind protection comes from the K_CFM multiplier and the overhang margin, not from the lip alone. However, the lip's contribution is additive — it provides an additional layer of wind resistance on top of the overhang and CFM margins.

**Note:** These edge velocities represent the excess exhaust flow distributed around the full perimeter. In practice, the upwind face of the hood draws the most ambient air (the wind assists inflow on the upwind side), while the downwind face is where edge capture failure occurs. The effective edge velocity on the downwind face is approximately 50-70% of the perimeter-averaged value, while the upwind face receives 130-150%. The lip's wind resistance is most valuable on the downwind face where the wind and exhaust flow oppose each other.

#### 3.3.4 Composite Lip Improvement Factor

The combined effect of Capture Envelope expansion, edge velocity enhancement, and wind resistance can be expressed as a composite capture improvement factor relative to a flat-bottom hood of the same dimensions and CFM:

| Lip Height | Capture Envelope Factor | Edge Velocity Factor | Wind Resistance Factor | Composite Improvement |
|---|---|---|---|---|
| No lip | 1.00 | 1.00 | 1.00 | 1.00 (baseline) |
| 2" lip | 1.25 | 1.33 | 1.10 | 1.15 - 1.25 |
| 3" lip | 1.37 | 1.60 | 1.20 | 1.25 - 1.40 |
| 4" lip | 1.49 | 2.00 | 1.30 | 1.35 - 1.55 |

The composite improvement factor of 1.25-1.40 for a 3-inch lip means that a hood with a 3-inch lip provides equivalent capture performance to a flat-bottom hood that is approximately 25-40% more effective. In practical terms, this means a lipped hood can achieve the same capture reliability as a flat-bottom hood that is one size category larger (approximately 6-10 inches wider) or that operates at 25-40% higher CFM.

**Design recommendation:** A 3-inch perimeter lip should be considered a minimum design feature for all outdoor barbecue hoods. The cost of adding a 3-inch flange is trivial compared to the cost of increasing hood size by 6-10 inches or increasing blower capacity by 25-40%. The lip is the most cost-effective capture improvement available.

### 3.4 Canopy Shape Analysis

Four canopy shapes are analyzed: flat-bottom, tapered (pyramidal), island, and wall-mount. Each shape produces a different internal airflow pattern that affects the **Effective Capture Area** and velocity uniformity across the hood face.

#### 3.4.1 Flat-Bottom Canopy

**Geometry:** A rectangular box with a flat lower face (the hood opening), vertical sides, and a flat top with one or two exhaust collars.

**Internal airflow:** Air entering the flat bottom face rises vertically and converges toward the exhaust collar(s). The path length from hood face to exhaust collar varies from minimum (directly beneath the collar) to maximum (at the hood corners). This path length variation creates a velocity gradient: highest velocity beneath the collar, lowest at the corners.

**Effective Capture Area:** eta_uniformity = 0.40 - 0.55 without baffles. The corners of the hood are essentially dead zones with weak suction. Adding a center exhaust collar produces a roughly circular effective capture region centered on the collar, with the rectangular corners contributing minimally.

**Strengths:** Simple and inexpensive to manufacture. Maximum internal volume for a given set of exterior dimensions.

**Weaknesses:** Poorest velocity uniformity. Large dead zones at corners. The **Effective Capture Area** can be less than the plume cross-section even when the hood's total area exceeds it.

#### 3.4.2 Tapered (Pyramidal) Canopy

**Geometry:** A truncated pyramid with a large rectangular base (the hood opening) tapering to a smaller rectangular top where the exhaust collar is located. The taper angle is typically 10-25 degrees from vertical.

**Internal airflow:** The tapered walls guide air inward and upward, creating a natural funneling effect. Air entering at the periphery is directed inward by the sloping walls, reducing the velocity deficit at the hood edges. The converging geometry maintains a more uniform velocity profile across the lower opening because peripheral flow is accelerated by the converging walls (continuity: as cross-sectional area decreases, velocity must increase for constant mass flow).

**Effective Capture Area:** eta_uniformity = 0.60 - 0.75 without additional baffles. The taper itself acts as a geometric baffle, redistributing flow toward the periphery relative to a flat-bottom hood.

**Strengths:** Better velocity uniformity than flat-bottom. Natural funneling reduces dead zones. Aesthetically preferred by many homeowners.

**Weaknesses:** Reduced internal volume (by 30-50% compared to flat-bottom at the same external dimensions). Higher manufacturing cost than flat-bottom.

The volume reduction is:

> V_tapered = (h_hood / 3) * (A_base + A_top + sqrt(A_base * A_top))

For a 57" x 53" base tapering to a 20" x 20" top over 10 inches of height: V_tapered approximately 11.3 cubic feet, compared to V_flat = 57 * 53 * 10 / 1728 = 17.5 cubic feet. The tapered canopy has 35% less volume.

Despite the reduced volume, the improved flow distribution makes the tapered canopy generally superior to the flat-bottom for capture performance per unit of CFM.

#### 3.4.3 Island Canopy

**Geometry:** A canopy designed for installation over a freestanding island or peninsula grill, accessible from all sides. May be flat-bottom or tapered. The defining characteristic is that all four sides are open to ambient air — there is no rear wall to provide a natural boundary.

**Effective Capture Area:** Same as the base shape (flat or tapered) multiplied by a correction factor of 0.85 - 0.95 relative to wall-mount. The open rear edge allows additional ambient air infiltration that dilutes the effective suction at the front and sides.

**Capture challenges unique to island configuration:**

1. **No rear wall assistance.** The plume can escape in all four directions. The recommended overhang applies symmetrically to all sides (front, back, left, right).

2. **Increased ambient air infiltration.** With four open sides, more ambient air enters the hood per unit of exhaust flow, reducing the fraction of exhaust capacity available for plume capture. The infiltration factor F_inf increases from approximately 2.0 (wall-mount) to approximately 2.3-2.5 (island).

3. **Greater wind vulnerability.** Wind from any direction can deflect the plume beyond the hood boundary. There is no protected (wall-side) face.

4. **Recommended CFM increase for island installations:** Multiply the wall-mount CFM from RB-003 Tables 3.8a/b by a factor of 1.15 to 1.25 to compensate for the increased infiltration and wind exposure.

#### 3.4.4 Wall-Mount Canopy

**Geometry:** A canopy designed for installation against a wall or backsplash, with the rear edge flush against or near the wall surface. The rear side is effectively sealed (or has minimal gap), reducing the number of open sides from four to three.

**Effective Capture Area:** Same as the base shape multiplied by a correction factor of 1.05 - 1.15 relative to island. The wall blocks rear escape and redirects escaped plume gas upward within the **Capture Envelope**.

**Capture advantages of wall-mount configuration:**

1. **Rear boundary.** The wall provides a physical barrier preventing rearward plume escape. Plume gas reaching the wall is redirected upward along the wall surface and back into the hood's suction field.

2. **Reduced ambient infiltration.** With only three open sides, less ambient air enters the hood, increasing the fraction of exhaust capacity available for plume capture.

3. **Wind shielding on rear face.** The wall blocks rear-approaching wind from entering the **Capture Envelope** directly. Only front and side wind exposure remains.

4. **Coanda effect exploitation.** The plume tends to attach to the wall surface (Coanda effect), which keeps the plume within the **Capture Envelope** even when the rear overhang is minimal.

#### 3.4.5 Shape Comparison Summary

| Parameter | Flat-Bottom | Tapered | Island | Wall-Mount |
|---|---|---|---|---|
| eta_uniformity (no baffles) | 0.40 - 0.55 | 0.60 - 0.75 | 0.38 - 0.53 | 0.45 - 0.60 |
| eta_uniformity (with baffles) | 0.60 - 0.75 | 0.75 - 0.85 | 0.55 - 0.70 | 0.65 - 0.80 |
| Internal volume (relative) | 1.00 | 0.55 - 0.70 | 1.00 | 1.00 |
| Effective for capture (rank) | 3rd | 1st | 4th | 2nd |
| Manufacturing cost (relative) | 1.0x | 1.3 - 1.6x | 1.0 - 1.2x | 1.0x |
| Wind resistance (rank) | 3rd | 2nd | 4th | 1st |

**Key finding:** The tapered canopy with baffles is the most effective shape for outdoor capture, achieving eta_uniformity of 0.75-0.85 (75-85% Effective Capture Area). The wall-mount configuration provides the best overall capture reliability due to the rear boundary effect, regardless of canopy shape. The island configuration is the most challenging and requires the largest overhang and highest CFM for equivalent capture reliability.

### 3.5 Hood Internal Volume Analysis

The vertical dimension of the hood cavity — from the lip's lower edge to the filter/exhaust plane — determines the internal volume available for pressure equalization and turbulence buffering.

#### 3.5.1 Minimum Internal Height

The minimum internal height must satisfy three requirements:

**Requirement 1 — Filter accommodation.** Standard baffle-type grease filters are 2-3 inches deep. They must be mounted within the hood cavity, leaving clearance above and below for air flow. Minimum height for filter installation: 4-5 inches.

**Requirement 2 — Volume buffering.** From Section 2.6, the minimum hood volume for adequate puffing buffering is V_min = Q_exhaust * 0.5 seconds. For the range of exhaust rates in this program (144-1623 CFM):

| CFM | V_min (cubic feet) | Required height for 57"x53" hood (inches) |
|---|---|---|
| 300 | 2.5 | 1.5 |
| 600 | 5.0 | 3.0 |
| 900 | 7.5 | 4.5 |
| 1200 | 10.0 | 6.0 |
| 1500 | 12.5 | 7.5 |

**Requirement 3 — Flow development.** Air entering the hood face must have sufficient vertical distance to develop a reasonably organized flow pattern before reaching the filters. If the internal height is too short, the entering flow strikes the filters directly with the non-uniform velocity profile of the entering plume, resulting in localized high-velocity regions that overload portions of the filter while leaving other portions underutilized. A minimum development distance of approximately 3-4 inches above the hood face is recommended.

**Combined minimum internal height:** The binding constraint is typically the filter accommodation requirement. For a hood with standard baffle grease filters:

| Hood CFM Range | Minimum Internal Height (inches) | Recommended Internal Height (inches) |
|---|---|---|
| < 600 CFM | 5 | 6 - 8 |
| 600 - 900 CFM | 5 | 8 - 10 |
| 900 - 1200 CFM | 6 | 10 - 12 |
| > 1200 CFM | 8 | 12 - 14 |

#### 3.5.2 Effect of Internal Height on Capture Performance

Increasing internal height beyond the minimum provides diminishing returns for capture performance but improves filter efficiency and noise reduction:

| Internal Height | Capture Benefit | Filter Benefit | Noise Benefit |
|---|---|---|---|
| 4 inches | Minimum acceptable — tight tolerances | Filter overloaded in center | Turbulent noise; resonance possible |
| 6 inches | Adequate buffering for most sources | Improved flow distribution to filter | Reduced turbulence noise |
| 8 inches | Good buffering for all sources up to 900 CFM | Good flow distribution | Moderate noise reduction |
| 10 inches | Excellent buffering for all sources up to 1200 CFM | Excellent distribution; full filter utilization | Significant noise reduction |
| 12+ inches | Marginal additional capture benefit | Marginal additional benefit | Best noise performance |

**Design recommendation:** Internal height of 8-10 inches is optimal for most outdoor barbecue hood installations in the 600-1200 CFM range. Heights below 6 inches should be avoided for any installation above 300 CFM. Heights above 12 inches provide minimal additional capture benefit and increase the hood's visual profile.

### 3.6 Baffle and Filter Configuration Effects

Internal baffles serve the critical function of redistributing exhaust flow from the natural concentration near the exhaust collar to a more uniform distribution across the hood face.

#### 3.6.1 No Baffles (Unbaffled Hood)

An unbaffled hood with a single center exhaust collar produces a strongly non-uniform velocity distribution:

| Region of Hood Face | Approximate Face Velocity (% of mean) | Contribution to Capture |
|---|---|---|
| Directly beneath exhaust collar (center 30% of area) | 160 - 200% | High — captures plume core effectively |
| Mid-region (next 40% of area) | 80 - 120% | Moderate — adequate for mid-plume |
| Peripheral region (outer 30% of area, including corners) | 20 - 50% | Low — poor capture of plume edge |

The corner regions of an unbaffled rectangular hood may have face velocities as low as 20% of the mean. At a mean face velocity of 30 fpm (typical for the recommended hood sizes), the corner velocity is only 6 fpm — negligible suction that cannot draw in even gently drifting plume gas.

**eta_uniformity for unbaffled hood: 0.40 - 0.55** (only 40-55% of the hood face area actively contributes to capture).

#### 3.6.2 Full-Face Mesh or Baffle Filter

Standard commercial grease filters (mesh type or baffle type) that span the entire hood face area introduce a uniform pressure drop across the face. This pressure drop (typically 1-5 Pa per filter layer, depending on filter type and air velocity) acts as a flow equalizer:

- In regions of high velocity (center, beneath collar), the filter introduces proportionally higher resistance, partially throttling the flow.
- In regions of low velocity (periphery, corners), the filter introduces proportionally lower resistance, allowing relatively more flow.

The net effect is improved velocity uniformity:

**eta_uniformity for hood with full-face grease filter: 0.55 - 0.70** (55-70% Effective Capture Area).

The improvement from a full-face filter is approximately 15 percentage points over unbaffled — a meaningful gain achieved simply by ensuring the grease filters span the full hood face rather than covering only the center.

#### 3.6.3 Dedicated Internal Baffles

Beyond the grease filters, dedicated internal baffles can further improve velocity uniformity:

**Perimeter slot baffles:** Narrow slots or openings positioned around the hood perimeter that bypass the main filter plane and provide direct suction at the hood edges. These create a "perimeter suction ring" that supplements the face suction with targeted edge suction.

**Effect:** Increases eta_uniformity by approximately 0.05-0.10 (5-10 percentage points). Creates a localized air curtain at the hood perimeter that improves edge capture.

**Internal divider plates:** Vertical plates within the hood cavity that partition the internal volume into zones, each with its own path to the exhaust collar. By adjusting the gap width of each zone's exit path, the flow can be balanced between zones.

**Effect:** Increases eta_uniformity by approximately 0.05-0.15 (5-15 percentage points). Most effective in large hoods (> 60 inches) where the path-length variation between center and corners is greatest.

#### 3.6.4 Baffle Configuration Summary

| Baffle Configuration | eta_uniformity | Effective Capture Area (57"x53" hood) |
|---|---|---|
| No baffles, no filter | 0.40 - 0.55 | 1,208 - 1,662 sq in |
| Full-face grease filter only | 0.55 - 0.70 | 1,662 - 2,115 sq in |
| Full-face filter + perimeter slots | 0.65 - 0.80 | 1,964 - 2,417 sq in |
| Full-face filter + perimeter slots + dividers | 0.75 - 0.85 | 2,266 - 2,568 sq in |

The plume capture cross-section for a medium gas grill at 30 inches is approximately 1,320 sq in (41-inch diameter circle). An unbaffled hood may have an Effective Capture Area of only 1,208 sq in — less than the plume cross-section, even though the total hood area is 3,021 sq in. This means the plume overflows the effective capture region in the center while the hood periphery is wasted. Adding full baffling raises the Effective Capture Area to 2,266-2,568 sq in — nearly double the plume cross-section, providing comfortable margin.

**Design recommendation:** At minimum, outdoor barbecue hoods should include full-face grease filters that span the entire hood opening. For hoods exceeding 54 inches in width, perimeter slot baffles or equivalent edge-suction features should be included. Dedicated internal dividers are beneficial for hoods exceeding 66 inches, where the center-to-corner path length variation becomes large.

### 3.7 Geometry-CFM Interaction Analysis

Hood geometry and exhaust rate are not independent parameters — they interact. A wider hood at lower CFM may outperform a narrower hood at higher CFM, or vice versa, depending on the specific configuration.

#### 3.7.1 The Width-CFM Tradeoff

Consider two hoods for a medium gas grill at 30 inches:

**Option A — Wide hood, moderate CFM:** Hood width 60 inches, CFM = 600. Face velocity = 600 / (60 * 53 / 144) = 27 fpm. The hood extends 18 inches beyond each side of the 24-inch cooking surface. The plume capture diameter (41 inches) falls within the hood footprint with 9.5 inches of margin per side.

**Option B — Narrow hood, high CFM:** Hood width 42 inches, CFM = 900. Face velocity = 900 / (42 * 53 / 144) = 58 fpm. The hood extends only 9 inches beyond each side. The plume capture diameter (41 inches) nearly matches the hood width, with only 0.5 inches of margin per side.

**Analysis:**

| Parameter | Option A (60", 600 CFM) | Option B (42", 900 CFM) | Advantage |
|---|---|---|---|
| Geometric coverage of plume | Full (9.5" margin/side) | Marginal (0.5" margin/side) | A |
| Face velocity | 27 fpm | 58 fpm | B |
| Edge capture velocity | 0.24 m/s | 0.19 m/s | A |
| Capture in still air | Excellent (full plume within hood) | Marginal (plume nearly overflows) | A |
| Capture in 2 mph wind | Good (plume shifted but still within margin) | Failure (plume shifted beyond hood edge) | A |
| CFM headroom above plume flow | 397 CFM excess | 697 CFM excess | B |
| Blower noise (approximate) | 55 dBA | 65 dBA | A |
| Energy consumption | Lower | Higher | A |

**Conclusion:** Option A (wider hood, lower CFM) decisively outperforms Option B (narrower hood, higher CFM) for outdoor capture. The geometric coverage advantage of the wider hood is more valuable than the velocity advantage of higher CFM. The narrower hood fails in even light wind because the plume extends beyond its physical boundary — the **Missed Plume Region** is large.

This confirms the principle established in RB-002 and RB-003: **for outdoor buoyant plume capture, geometric coverage (hood width) is more important than suction power (CFM).** Additional CFM cannot capture plume gas that is beyond the hood's physical boundary.

#### 3.7.2 The Diminishing Return of Excess CFM

Beyond the required CFM (K_CFM = 3.0 times the plume mass flow), additional CFM provides diminishing returns for capture improvement:

| CFM (fraction of K_CFM = 3.0 requirement) | Capture Improvement | Physical Basis |
|---|---|---|
| 1.0x required (K_CFM = 3.0) | Baseline — reliable capture in still air and light breeze | Sufficient for plume ingestion + infiltration + wind margin |
| 1.25x required | +3-5% capture reliability | Increased edge velocity; slightly improved wind tolerance |
| 1.5x required | +5-8% capture reliability | Moderate edge velocity increase; improved dynamic response |
| 2.0x required | +8-12% capture reliability | Significantly increased edge velocity; good wind tolerance |
| 3.0x required | +10-15% capture reliability | Diminishing returns; noise and energy cost dominant |

The diminishing return occurs because additional CFM increases the velocity everywhere beneath the hood, but the plume's velocity structure means the center is already self-delivering. The additional CFM benefits only the plume periphery, which is a small fraction of the total plume mass. Beyond approximately 1.5x the required CFM, the improvement per unit of additional CFM becomes small relative to the noise and energy cost.

**Design recommendation:** Size the blower to provide 1.0x to 1.3x the required CFM from RB-003 Tables 3.8a/b. Do not rely on excess CFM to compensate for inadequate hood width. A blower that provides 150% of the required CFM in a hood that is 80% of the required width will perform worse than a blower at 100% of the required CFM in a hood at 100% of the required width.

#### 3.7.3 Face Velocity Distribution Analysis

The face velocity at any point on the hood opening determines whether plume gas at that point is being drawn into the hood or escaping. The face velocity varies across the hood opening due to the non-uniform suction field (Section 3.6).

For a properly baffled 57" x 53" hood at 609 CFM:

| Region | Fraction of Hood Area | Face Velocity (fpm) | Capture Contribution |
|---|---|---|---|
| Center (beneath collar) | 20% | 40 - 50 | Strong — exceeds plume needs |
| Mid-zone | 50% | 25 - 40 | Adequate — matches plume periphery |
| Edges | 25% | 15 - 25 | Marginal — captures slow-moving plume edge |
| Corners | 5% | 8 - 15 | Weak — may not capture drifting plume gas |

For comparison, the plume velocity at the hood face for a medium gas grill at 30 inches:

| Plume Region | Velocity (fpm) | Hood Face Velocity Needed |
|---|---|---|
| Centerline | 392 | Self-delivering — any positive face velocity captures |
| r = b_T (1/e radius) | 196 | Self-delivering |
| r = 1.5 * b_T | 43 | ~30-50 fpm needed for wind resistance |
| r = 2 * b_T (capture boundary) | 24 | ~15-25 fpm needed for light-wind capture |
| Beyond capture boundary | < 10 | Must be within hood boundary for any capture |

The comparison shows that the face velocity requirements are well-matched to the plume velocity structure: the plume core (high velocity) self-delivers and requires minimal face velocity; the plume periphery (low velocity) requires modest face velocity that is achieved by a properly baffled hood in the mid-zone and edge regions. The critical limitation is the corners, where both the hood's face velocity and the plume's velocity are at their minimum.

### 3.8 Design Guideline Tables — Primary Engineering Deliverable

The following tables consolidate the geometric analysis of this paper into actionable design guidelines. For each source type at each standard mounting height, the tables specify:

- **W_min**: Minimum hood width (absolute minimum for any capture in still air)
- **W_rec**: Recommended hood width (outdoor margin K = 1.70)
- **D_rec_island**: Recommended hood depth for island (freestanding) installation
- **D_rec_wall**: Recommended hood depth for wall-mount installation
- **OH_rec**: Recommended overhang per side (symmetric)
- **h_lip_min**: Minimum recommended lip height
- **h_internal_min**: Minimum recommended internal cavity height
- **CFM_std**: Required CFM for standard outdoor conditions (K_CFM = 3.0, from RB-003)

#### Table 3.8a: Design Guidelines — Gas Grill Small (Q_c = 5.1 kW, Cooking Surface: 18" x 19")

| Height | W_min | W_rec | D_rec_island | D_rec_wall | OH_rec | h_lip | h_int | CFM_std |
|---|---|---|---|---|---|---|---|---|
| 18" | 31" | 43" | 41" | 32" | 13" | 2" | 6" | 247 |
| 24" | 34" | 47" | 45" | 35" | 14" | 3" | 6" | 363 |
| 30" | 37" | 51" | 49" | 38" | 16" | 3" | 8" | 500 |
| 36" | 40" | 55" | 53" | 41" | 18" | 3" | 8" | 657 |
| 48" | 46" | 63" | 61" | 47" | 22" | 4" | 10" | 1037 |

#### Table 3.8b: Design Guidelines — Gas Grill Medium (Q_c = 8.2 kW, Cooking Surface: 24" x 21")

| Height | W_min | W_rec | D_rec_island | D_rec_wall | OH_rec | h_lip | h_int | CFM_std |
|---|---|---|---|---|---|---|---|---|
| 18" | 36" | 49" | 45" | 35" | 13" | 2" | 6" | 312 |
| 24" | 39" | 53" | 49" | 38" | 15" | 3" | 6" | 448 |
| 30" | 41" | 57" | 53" | 41" | 17" | 3" | 8" | 609 |
| 36" | 44" | 61" | 57" | 44" | 19" | 3" | 8" | 792 |
| 48" | 50" | 69" | 65" | 50" | 23" | 4" | 10" | 1238 |

#### Table 3.8c: Design Guidelines — Gas Grill Large (Q_c = 12.3 kW, Cooking Surface: 30" x 22")

| Height | W_min | W_rec | D_rec_island | D_rec_wall | OH_rec | h_lip | h_int | CFM_std |
|---|---|---|---|---|---|---|---|---|
| 18" | 39" | 54" | 47" | 36" | 12" | 2" | 6" | 388 |
| 24" | 42" | 58" | 51" | 39" | 14" | 3" | 8" | 544 |
| 30" | 45" | 62" | 55" | 42" | 16" | 3" | 8" | 727 |
| 36" | 48" | 66" | 59" | 45" | 18" | 3" | 10" | 937 |
| 48" | 54" | 74" | 67" | 51" | 22" | 4" | 10" | 1447 |

#### Table 3.8d: Design Guidelines — Gas Grill High-Output (Q_c = 16.4 kW, Cooking Surface: 36" x 22")

| Height | W_min | W_rec | D_rec_island | D_rec_wall | OH_rec | h_lip | h_int | CFM_std |
|---|---|---|---|---|---|---|---|---|
| 18" | 43" | 59" | 49" | 37" | 11" | 3" | 6" | 456 |
| 24" | 45" | 63" | 53" | 40" | 13" | 3" | 8" | 628 |
| 30" | 48" | 67" | 57" | 43" | 15" | 3" | 8" | 830 |
| 36" | 51" | 71" | 61" | 46" | 17" | 4" | 10" | 1061 |
| 48" | 57" | 79" | 69" | 52" | 21" | 4" | 12" | 1623 |

#### Table 3.8e: Design Guidelines — Charcoal Kettle (Q_c = 1.8 kW, Cooking Surface: 22" diameter)

| Height | W_min | W_rec | D_rec_island | D_rec_wall | OH_rec | h_lip | h_int | CFM_std |
|---|---|---|---|---|---|---|---|---|
| 18" | 40" | 55" | 55" | 41" | 16" | 3" | 6" | 156 |
| 24" | 43" | 59" | 59" | 44" | 18" | 3" | 6" | 238 |
| 30" | 45" | 63" | 63" | 47" | 20" | 3" | 8" | 335 |
| 36" | 48" | 66" | 66" | 50" | 22" | 3" | 8" | 445 |
| 48" | 54" | 74" | 74" | 56" | 26" | 4" | 8" | 714 |

#### Table 3.8f: Design Guidelines — Wood-Fired Grill (Q_c = 7.6 kW, Cooking Surface: 24" x 16")

| Height | W_min | W_rec | D_rec_island | D_rec_wall | OH_rec | h_lip | h_int | CFM_std |
|---|---|---|---|---|---|---|---|---|
| 18" | 36" | 49" | 45" | 33" | 13" | 2" | 6" | 300 |
| 24" | 38" | 53" | 48" | 36" | 15" | 3" | 6" | 433 |
| 30" | 41" | 57" | 52" | 39" | 17" | 3" | 8" | 590 |
| 36" | 44" | 60" | 56" | 42" | 18" | 3" | 8" | 768 |
| 48" | 50" | 68" | 64" | 48" | 22" | 4" | 10" | 1203 |

#### Table 3.8g: Design Guidelines — Wood-Fired Large (Q_c = 13.3 kW, Cooking Surface: 36" x 24")

| Height | W_min | W_rec | D_rec_island | D_rec_wall | OH_rec | h_lip | h_int | CFM_std |
|---|---|---|---|---|---|---|---|---|
| 18" | 45" | 63" | 51" | 38" | 13" | 3" | 6" | 368* |
| 24" | 48" | 67" | 55" | 41" | 15" | 3" | 8" | 531* |
| 30" | 51" | 71" | 59" | 44" | 17" | 3" | 8" | 724* |
| 36" | 54" | 74" | 63" | 47" | 19" | 4" | 10" | 942* |
| 48" | 60" | 82" | 71" | 53" | 23" | 4" | 12" | 1476* |

*CFM values for Wood-Fired Large estimated using K_CFM = 3.0 applied to mass flow interpolated from RB-003 methodology with Q_c = 13.3 kW.

#### Table 3.8h: Design Guidelines — Pellet Smoker (all modes, Q_c = 1.5-5.7 kW, Cooking Surface: 22" x 14")

| Height | W_min | W_rec | D_rec_island | D_rec_wall | OH_rec | h_lip | h_int | CFM_std (Low/High) |
|---|---|---|---|---|---|---|---|---|
| 18" | 33" | 46" | 43" | 31" | 12" | 2" | 6" | 144 / 260 |
| 24" | 37" | 50" | 47" | 34" | 14" | 2" | 6" | 222 / 381 |
| 30" | 39" | 54" | 51" | 37" | 16" | 3" | 6" | 313 / 523 |
| 36" | 42" | 58" | 55" | 40" | 18" | 3" | 8" | 417 / 686 |
| 48" | 48" | 66" | 63" | 46" | 22" | 3" | 8" | 670 / 1080 |

**Notes on Table 3.8h:** Pellet smokers at all output modes share the same D_eff and similar z_0 values, so geometric hood sizing is nearly identical. The CFM range spans from pellet smoker low (Q_c = 1.5 kW) to pellet smoker high (Q_c = 5.7 kW).

#### Table 3.8i: Consolidated Quick-Reference — Recommended Hood Width at 30" Mounting Height

This is the most commonly referenced configuration. For rapid reference:

| Source Type | Cooking Surface Width | Recommended Hood Width | Overhang per Side | CFM Required |
|---|---|---|---|---|
| Gas Grill — Small | 18" | 51" | 16" | 500 |
| Gas Grill — Medium | 24" | 57" | 17" | 609 |
| Gas Grill — Large | 30" | 62" | 16" | 727 |
| Gas Grill — High-Output | 36" | 67" | 15" | 830 |
| Charcoal Kettle | 22" | 63" | 20" | 335 |
| Wood-Fired | 24" | 57" | 17" | 590 |
| Wood-Fired Large | 36" | 71" | 17" | 724 |
| Pellet Smoker (all) | 22" | 54" | 16" | 313 - 523 |

**Key conclusions from the design guideline tables:**

1. **No standard consumer hood (36-48") is adequate for reliable outdoor capture at 30 inches for any source type larger than a small gas grill.** The minimum recommended widths at 30 inches range from 51 to 71 inches. A 48-inch hood provides the recommended width only for the smallest gas grill at the lowest mounting height (18 inches).

2. **Overhang of 15-20 inches per side is required at 30 inches** for all source types. This is the non-negotiable geometric parameter. Reducing overhang below the recommended value creates a **Missed Plume Region** that cannot be compensated by increased CFM.

3. **Wall-mount installations save 10-18 inches of depth** compared to island installations at the same mounting height. This is a significant practical advantage.

4. **A 3-inch lip is recommended for all installations at 24 inches or above.** At 18 inches, a 2-inch lip is adequate (the plume is narrow and well-contained).

5. **Internal height of 8 inches is the practical minimum for installations at 600+ CFM.** Higher-CFM installations (above 900 CFM) should have 10-12 inches of internal height for adequate buffering and noise reduction.

---

## 4. Implications for Outdoor BBQ Ventilation

### 4.1 Geometry Precedes Airflow — The Hierarchy of Design

The analysis in this paper establishes a clear hierarchy for outdoor hood design parameters:

**First priority — Overhang (hood width and depth).** No amount of exhaust velocity can capture plume gas that is beyond the hood's physical boundary. The overhang must be sufficient to encompass the plume's expanded cross-section at the **Plume Interception Plane** with margin for turbulent fluctuations and wind deflection. If the hood is too narrow, the **Missed Plume Region** is large and capture fails regardless of CFM.

**Second priority — Lip height.** A perimeter lip extends the **Capture Envelope** vertically, increases edge velocity, and improves wind resistance. These benefits are obtained at negligible cost and no additional energy consumption. A 3-inch lip improves capture performance by 25-40% relative to a flat-bottom hood.

**Third priority — Baffling and internal configuration.** Proper baffling raises the **Effective Capture Area** from 40-55% to 75-85% of the total hood face area. This means the hood's actual capture capability can be nearly doubled without changing the hood's physical size or exhaust rate.

**Fourth priority — CFM (exhaust rate).** Once the geometry is correct (adequate overhang, lip, and baffling), the CFM requirement follows from the plume mass flow rate at the given mounting height. Increasing CFM beyond the recommended K_CFM = 3.0 multiplier provides diminishing returns.

**Fifth priority — Mounting height reduction.** While not a hood geometry parameter per se, reducing mounting height reduces every other requirement (smaller hood, lower CFM, better capture reliability). If the installation allows lower mounting, this should be explored before increasing hood size or CFM.

This hierarchy inverts the common consumer assumption that "more powerful = better." In outdoor BBQ ventilation, a 600 CFM blower in a properly sized 60-inch lipped and baffled hood will dramatically outperform a 1200 CFM blower in an undersized 42-inch flat-bottom hood.

### 4.2 The "Effective Size" of a Hood

The analysis of **Effective Capture Area** reveals that two hoods of identical external dimensions can have dramatically different capture capabilities:

| Configuration | Total Face Area | Effective Capture Area | Effective Size Equivalent |
|---|---|---|---|
| 60" flat-bottom, no baffles, no lip | 3,180 sq in | 1,272 sq in (40%) | Equivalent to a 40" ideal hood |
| 60" tapered, full baffles, 3" lip | 3,180 sq in | 2,703 sq in (85%) | Equivalent to a 59" ideal hood |
| 48" tapered, full baffles, 3" lip | 2,544 sq in | 2,162 sq in (85%) | Equivalent to a 52" ideal hood |

The 48-inch baffled, lipped, tapered hood (Effective Capture Area = 2,162 sq in) has a larger effective size than the 60-inch unbaffled flat-bottom hood (Effective Capture Area = 1,272 sq in). This means a well-designed 48-inch hood outperforms a poorly designed 60-inch hood — a 20% size disadvantage is more than compensated by superior internal design.

This finding has direct implications for the consumer market: a manufacturer producing well-designed 48-54 inch hoods with proper baffling and lip geometry can deliver better capture performance than competitors selling larger but poorly designed 60-66 inch hoods.

### 4.3 Island Versus Wall-Mount: A Significant Performance Gap

The wall-mount configuration provides three compounding advantages over island installation:

1. **Reduced depth requirement** (10-18 inches less depth needed)
2. **Reduced ambient infiltration** (approximately 15-20% less excess ambient air entering the hood)
3. **Rear wind shielding** (eliminates one direction of wind vulnerability)

The combined effect is that a wall-mount hood of a given size provides approximately 15-25% better capture performance than an island hood of the same size. Alternatively, an island installation requires approximately 15-25% more CFM and 5-10 inches more hood depth to match the wall-mount performance.

**Practical recommendation:** Where installation flexibility exists, wall-mount or rear-wall-adjacent installation should be strongly preferred over island installation. If island installation is required (e.g., for a freestanding outdoor kitchen island), the hood should be sized to the island column of the design tables (Table 3.8a-h, D_rec_island) and the CFM should be increased by 15-25% over the wall-mount baseline.

### 4.4 The Lip as Standard Equipment

The analysis in Section 3.3 demonstrates that a 3-inch perimeter lip provides a 25-40% composite improvement in capture performance at essentially zero operating cost. The cost of manufacturing a turned-down flange is minimal relative to the hood body cost. Yet many consumer outdoor hoods are sold with flat bottoms and no lip.

**Recommendation:** A perimeter lip of at least 3 inches should be a standard feature of all outdoor barbecue ventilation hoods. For installations at mounting heights of 36 inches or above, a 4-inch lip is recommended. For installations at 18 inches, a 2-inch lip is sufficient.

The lip should extend around the full perimeter of the hood for island installations. For wall-mount installations, the lip should extend around the front and two sides (the rear is against the wall and does not need a lip).

### 4.5 When Geometry Cannot Compensate

There are conditions where no practical hood geometry can provide reliable capture:

1. **Mounting heights above 48 inches for high-output sources.** At 48 inches, a gas grill high-output requires a 79-inch hood and 1623 CFM. At 60 inches, the requirements would exceed 90 inches and 2000+ CFM. These are physically impractical for residential installations. For mounting heights above 48 inches, wind shielding (side panels, addressed in RB-009) becomes mandatory.

2. **Sustained wind above 5 mph without shielding.** Even a properly sized hood with full outdoor margins will experience capture failure when sustained crosswind exceeds approximately 5 mph (2.2 m/s). At this wind speed, the plume is deflected beyond the hood's overhang margin. Wind shielding or side panels are required (RB-009).

3. **Island installations in exposed locations.** An unshielded island grill in a location with frequent wind from multiple directions faces the worst-case scenario: the plume can be deflected in any direction, and the hood has no wall to provide a backstop. These installations require oversized hoods (use the 48-inch mounting height dimensions from Tables 3.8a-h even at lower mounting heights) and/or supplemental wind shielding.

4. **Multiple simultaneous cooking surfaces.** If two or more grills operate side-by-side under a single hood, the plumes may merge at hood height, creating a composite plume wider than either individual plume. The hood must be sized for the merged plume, not for the individual sources. The merged plume width is approximately the sum of the individual cooking surface widths plus the spacing between them, with overhang added to both ends.

### 4.6 The Cost-Effectiveness Hierarchy of Hood Improvements

For a homeowner or designer seeking to improve outdoor hood capture performance within a budget, the following hierarchy ranks improvements by their capture benefit per dollar spent:

| Rank | Improvement | Approximate Cost | Capture Improvement | Benefit/Cost |
|---|---|---|---|---|
| 1 | Add 3" perimeter lip (if absent) | $50-150 | +25-40% | Highest |
| 2 | Add full-face baffle grease filters | $80-200 | +15-25% | Very high |
| 3 | Reduce mounting height by 6" | $0-300 (structural) | +20-35% (via reduced requirements) | Very high |
| 4 | Increase hood width by 6" | $200-600 | +10-20% | High |
| 5 | Upgrade from flat to tapered canopy | $300-800 | +10-15% | Moderate |
| 6 | Add perimeter slot baffles | $100-300 | +5-10% | Moderate |
| 7 | Increase CFM by 50% (larger blower) | $300-1000 | +5-8% | Low |
| 8 | Increase hood width by 12" | $400-1200 | +15-25% | Moderate |

The most cost-effective improvements are the lip and baffles — inexpensive modifications that provide substantial capture gains. Reducing mounting height is free or very low cost but may be constrained by fire clearance or head clearance requirements. Increasing hood width is moderately expensive but always beneficial. Increasing CFM by upgrading the blower is the least cost-effective improvement, because additional CFM provides diminishing returns when the geometry is already inadequate.

---

## 5. Knowledge Gaps or Opportunities

### 5.1 Well-Established Knowledge

The following aspects of hood geometry and capture performance are well-established in the ventilation engineering literature:

1. **The r^(-2) decay of suction velocity** beyond the hood boundary is a fundamental result from potential flow theory and is confirmed by extensive measurement in commercial kitchen ventilation research (ASHRAE, 2019).

2. **The benefit of a perimeter lip** on canopy hood capture performance is well-documented in the commercial kitchen ventilation literature. Li & Dai (1996) measured 20-35% improvement in capture efficiency for commercial kitchen hoods with 2-4 inch lips. The mechanisms (volume extension, velocity enhancement, wind resistance) are well-understood.

3. **Face velocity non-uniformity** in canopy hoods is well-characterized. Swierczyna et al. (2003, ASHRAE RP-1033) measured face velocity distributions in commercial kitchen hoods and confirmed that unbaffled hoods have eta_uniformity in the range 0.40-0.60, while baffled hoods achieve 0.65-0.85.

4. **The superiority of geometric coverage over suction velocity** for capturing buoyant plumes is a standard principle in ventilation design (ACGIH Industrial Ventilation Manual, 30th ed.).

### 5.2 Areas of Moderate Uncertainty

1. **Lip improvement factors.** The composite improvement factor of 1.25-1.40 for a 3-inch lip is estimated from first-principles analysis and extrapolation from commercial kitchen research. The specific value for outdoor barbecue installations has not been experimentally validated. The improvement is likely to vary with wind conditions, mounting height, and hood size.

2. **Effective Capture Area values.** The eta_uniformity ranges stated in this paper are extrapolated from commercial kitchen hood measurements (primarily from ASHRAE RP-1033 and related studies). The specific values for outdoor barbecue hood configurations — which have different aspect ratios, exhaust collar locations, and baffle designs than commercial kitchen hoods — have not been measured.

3. **Wall-mount versus island performance gap.** The 15-25% performance advantage of wall-mount over island is estimated from the physical analysis of reduced infiltration and rear boundary effects. Experimental validation in outdoor conditions is not available.

4. **Internal volume buffering effect.** The buffering time constant analysis is a simplified first-order model. The actual dynamic behavior of a turbulent plume entering a hood cavity is complex and involves recirculation zones, thermal stratification within the hood, and transient pressure oscillations that are not captured by the simple tau = V/Q model.

### 5.3 Knowledge Gaps Requiring Further Research

1. **No published data on face velocity distribution in outdoor BBQ hoods.** The commercial kitchen ventilation literature (ASHRAE RP-1033, etc.) provides extensive face velocity distribution data for commercial kitchen hoods, but no equivalent data exists for residential outdoor barbecue hoods. These hoods differ from commercial kitchen hoods in size, shape, exhaust collar configuration, and baffle design. Direct measurement of face velocity distributions in representative outdoor hoods would validate the eta_uniformity estimates used in this paper.

2. **Coupled hood-plume-wind interaction.** This paper analyzes the hood geometry in isolation from the plume and wind. In reality, the hood, plume, and wind interact as a coupled system: the hood's suction modifies the plume trajectory; the plume's buoyancy modifies the suction field; wind displaces both. Computational fluid dynamics (CFD) simulation of representative outdoor hood-grill configurations with wind would provide insights into these coupled effects that cannot be obtained from the independent analysis used here.

3. **Lip geometry optimization.** This paper analyzes a simple straight vertical lip. Alternative lip geometries — inward-curved (bell-mouth), outward-flared, perforated, and graduated-height — may provide different performance characteristics. The optimal lip geometry for outdoor barbecue hoods has not been studied.

4. **Baffle design optimization.** The baffle configurations analyzed in this paper are generic (full-face filter, perimeter slots, internal dividers). The optimal baffle design for outdoor barbecue hoods — considering the specific plume characteristics, the range of operating CFM, and the grease-laden environment — has not been systematically studied.

5. **Multi-source configurations.** Many outdoor kitchens include multiple cooking appliances (grill + side burner, grill + smoker, etc.) under a single hood. The interaction between multiple plumes — merging, interference, combined wind effects — and the hood geometry required to capture merged plumes is not addressed in this paper and represents a significant design challenge.

6. **Dynamic capture behavior during cooking transients.** Outdoor cooking produces transient plume events (grease flare-ups, lid opening bursts, food placement surges) that produce momentary plume conditions exceeding the steady-state design basis. The hood's ability to handle these transients — which depends on internal volume, dynamic response of the exhaust system, and the baffle configuration — has not been studied for outdoor applications.

7. **Experimental validation of geometry-CFM tradeoff.** The analysis in Section 3.7 predicting that a wider hood at lower CFM outperforms a narrower hood at higher CFM has not been experimentally validated. This is a critical claim of this paper and should be tested with tracer gas capture efficiency measurements on hoods of varying width/CFM combinations.

---

## 6. Diagram Mapping Notes (Text Only)

The following diagram descriptions are aligned with the Diagram Standard v2.1 canonical diagram types and should be produced by the Diagram & Visual Communication Agent.

### Diagram 6.1: Overhang Requirement Versus Mounting Height — All Source Types (Diagram Type 2 — Quantitative Chart)

**Purpose:** Provide a primary quick-reference chart showing the recommended overhang per side as a function of mounting height for each source type.

**Content:**
- X-axis: mounting height (18" to 48")
- Y-axis: recommended overhang per side (inches), range 10" to 28"
- Curves for eight source types, derived from Table 3.1b
- All curves approximately parallel (linear plume growth), separated by the cooking surface width differences
- Annotation: "Every 6 inches of additional mounting height adds approximately 2 inches to the required overhang per side"
- Shaded region below 12" labeled "Insufficient overhang for outdoor capture — **Missed Plume Region** is significant"
- Shaded region above 20" labeled "Large overhang — consider reducing mounting height"
- Vertical dashed line at 30" labeled "Most common mounting height"
- Figure caption: "Figure 5.1: Recommended overhang per side (outdoor conditions, K = 1.70) as a function of mounting height for all source types. The charcoal kettle requires the most overhang at every height due to its wide effective source diameter relative to cooking surface width."

### Diagram 6.2: Width Versus Depth — Asymmetric Requirements (Diagram Type 1 — Plan View)

**Purpose:** Show the plan-view (top-down) hood geometry for wall-mount and island configurations, illustrating the asymmetric depth requirements.

**Content:**
- Two plan views side-by-side for a Gas Grill Medium at 30":
  - Left: Island configuration — Hood 57" x 53", centered over cooking surface 24" x 21", symmetric overhang on all four sides (17" front, 17" rear, 17" each side)
  - Right: Wall-mount configuration — Hood 57" x 41", rear edge against wall, front overhang 19", rear overhang 8", side overhang 17" each
- Cooking surface shown as dark rectangle at center
- Plume cross-section (41" diameter circle) shown as dashed circle
- Hood boundary shown as solid rectangle
- Overhang dimensions labeled on all sides
- For wall-mount, the wall shown as a shaded bar along the rear edge
- Hatched region between plume boundary and hood edge labeled "Outdoor margin (K=1.70)"
- **Missed Plume Region** labeled (if any portion of the plume extends beyond the hood)
- Annotation: "Wall-mount saves approximately 12 inches of depth by exploiting the wall's blocking effect"
- Figure caption: "Figure 5.2: Plan-view comparison of island (left) and wall-mount (right) hood configurations for a medium gas grill at 30 inches. The wall-mount configuration reduces the required depth by substituting the wall for rear overhang."

### Diagram 6.3: Hood Lip Effect on Capture Envelope (Diagram Type 1 — Cross-Section)

**Purpose:** Illustrate how a perimeter lip extends the **Capture Envelope** and creates the edge velocity enhancement effect.

**Content:**
- Side-view cross-section through the center of a canopy hood
- Left half: flat-bottom hood (no lip) — **Capture Envelope** shown as a trapezoidal region extending downward from the hood face, contracting rapidly to a narrow capture depth
- Right half: same hood with 3" lip — **Capture Envelope** extended downward by the lip height, with the lip shown as vertical flanges descending from the hood edges
- Airflow arrows showing:
  - Without lip: ambient air entering horizontally across the full face opening, weak edge velocity
  - With lip: ambient air channeled upward through the gap between lip and plume, accelerated by the constriction
- Velocity magnitude indicated by arrow density and length (denser/longer arrows in the lip gap)
- Annotations:
  - "Flat bottom: v_edge = 0.13 m/s"
  - "With 3-inch lip: v_edge = 0.21 m/s — 60% improvement"
  - "**Capture Envelope** depth increased by lip height"
- Figure caption: "Figure 5.3: Cross-sectional comparison of the **Capture Envelope** for a flat-bottom hood (left) and the same hood with a 3-inch perimeter lip (right). The lip extends the capture volume, accelerates edge airflow, and provides a physical barrier against crosswind."

### Diagram 6.4: Face Velocity Distribution — Unbaffled Versus Baffled Hood (Diagram Type 1 — Plan View with Contours)

**Purpose:** Show the face velocity contour map across the hood opening for an unbaffled hood versus a baffled hood, illustrating the **Effective Capture Area** difference.

**Content:**
- Two plan-view contour maps of a 57" x 53" hood face:
  - Left: Unbaffled — strong velocity peak at center (beneath exhaust collar), rapid decay to corners, large dead zones. Contour lines at 50%, 75%, 100%, 150%, 200% of mean face velocity. **Effective Capture Area** boundary (defined at 50% of mean) shown as a central oval covering approximately 45% of the face area.
  - Right: Baffled (full-face filter + perimeter slots) — more uniform velocity contours, reduced peak-to-minimum ratio, **Effective Capture Area** boundary covering approximately 80% of the face area.
- Color gradient: blue (low velocity) to red (high velocity)
- Exhaust collar location marked on each map
- **Effective Capture Area** boundary labeled with percentage
- Overlay of plume cross-section (41" diameter circle, dashed) showing whether it fits within the **Effective Capture Area**
  - Left: Plume circle extends beyond the **Effective Capture Area** boundary in corners — capture fails at edges
  - Right: Plume circle fits within the **Effective Capture Area** — capture reliable across full plume
- Annotation: "Same hood dimensions. Same CFM. But baffling nearly doubles the **Effective Capture Area** from 45% to 80% of the total face."
- Figure caption: "Figure 5.4: Face velocity contour maps for an unbaffled (left) and baffled (right) 57 x 53 inch hood at 609 CFM. The unbaffled hood concentrates suction at the center, leaving the edges with inadequate velocity. The baffled hood distributes suction more uniformly, increasing the **Effective Capture Area** from approximately 45% to 80% of the total face area."

### Diagram 6.5: Geometry-CFM Tradeoff — Wide/Low-CFM vs. Narrow/High-CFM (Diagram Type 4 — Comparative)

**Purpose:** Visually demonstrate why a wider hood at lower CFM outperforms a narrower hood at higher CFM for outdoor barbecue capture.

**Content:**
- Two side-by-side diagrams showing a Gas Grill Medium at 30 inches:
  - Left (Option A): 60" hood at 600 CFM. Plume (41" diameter) shown fitting within the hood with 9.5" margin per side. Edge arrows showing modest but adequate inward velocity. Label: "Full geometric coverage. Reliable capture."
  - Right (Option B): 42" hood at 900 CFM. Plume (41" diameter) shown extending beyond the hood boundary on both sides. Strong center suction arrows but plume edge escaping laterally. Label: "**Missed Plume Region** on both sides. Capture failure despite higher CFM."
- Wind arrows shown from the left, deflecting the plume rightward:
  - Option A: Plume shifted 7 inches rightward, still within the 9.5-inch margin. "Capture maintained in 2 mph wind."
  - Option B: Plume shifted 7 inches rightward, fully beyond the 0.5-inch margin. "Capture lost in any wind."
- Central comparison box: "Wide + moderate CFM > Narrow + high CFM. Geometry always wins."
- Figure caption: "Figure 5.5: Comparison of two hood configurations for a medium gas grill at 30 inches. Option A (60-inch hood, 600 CFM) provides full geometric coverage and maintains capture in wind. Option B (42-inch hood, 900 CFM) has insufficient width despite 50% more exhaust power, creating a **Missed Plume Region** that results in capture failure."

### Diagram 6.6: Canopy Shape Comparison — Internal Airflow Patterns (Diagram Type 1 — Cross-Sections)

**Purpose:** Compare the internal airflow patterns and velocity uniformity of flat-bottom, tapered, and wall-mount canopy configurations.

**Content:**
- Three side-view cross-sections showing internal airflow:
  - Left: Flat-bottom canopy — vertical arrows of varying length (tallest at center, shortest at edges) showing non-uniform suction. Dead zone marked in corners. eta_uniformity = 0.45.
  - Center: Tapered canopy — converging arrows following the sloped walls, more uniform arrow lengths across the base. eta_uniformity = 0.70.
  - Right: Wall-mount tapered with lip — wall on right side, lip on three open sides. Uniform arrows with slight enhancement at the open edges from the lip effect. eta_uniformity = 0.80.
- For each configuration, the **Effective Capture Area** is shown as a highlighted region on the hood face (base), with the percentage labeled
- Filter/baffle location shown within the cavity
- Exhaust collar at top
- Figure caption: "Figure 5.6: Internal airflow patterns for three canopy configurations. The flat-bottom hood (left) concentrates flow at the center, producing low **Effective Capture Area**. The tapered canopy (center) uses converging walls to distribute flow, improving uniformity. The wall-mount tapered canopy with lip (right) achieves the best uniformity by combining geometric convergence, wall boundary, and lip constriction."

---

## Appendix A: Input Parameters from RB-001 and RB-002

### A.1 Source Parameters

All source-specific parameters are taken from RB-001 Tables 3.1 and 3.2:

| Source Type | Q_c (kW) | D_eff (m) | z_0 (m) | Cooking Surface (W x D, inches) |
|---|---|---|---|---|
| Gas Grill — Small | 5.1 | 0.43 | -0.30 | 18 x 19 |
| Gas Grill — Medium | 8.2 | 0.51 | -0.37 | 24 x 21 |
| Gas Grill — Large | 12.3 | 0.58 | -0.41 | 30 x 22 |
| Gas Grill — High-Output | 16.4 | 0.65 | -0.44 | 36 x 22 |
| Charcoal Kettle | 1.8 | 0.56 | -0.47 | 22 diameter |
| Wood-Fired | 7.6 | 0.50 | -0.36 | 24 x 16 |
| Wood-Fired Large | 13.3 | 0.70 | -0.48 | 36 x 24 |
| Pellet Smoker (all) | 1.5 - 5.7 | 0.45 | -0.38 to -0.30 | 22 x 14 |

### A.2 Key RB-002 Parameters

| Parameter | Value | Source |
|---|---|---|
| Outdoor margin factor K | 1.70 | RB-002 Section 3.5 |
| Heskestad capture diameter | d_capture = 0.48*(z-z_0) + D_eff | RB-001 / RB-002 |
| Recommended hood width | W_rec = K * d_capture | RB-002 |
| Recommended overhang | OH = (W_rec - W_cooking) / 2 | RB-002 |

### A.3 Key RB-003 Parameters

| Parameter | Value | Source |
|---|---|---|
| CFM multiplier (standard outdoor) | K_CFM = 3.0 | RB-003 Section 3.6 |
| CFM multiplier (sustained wind) | K_CFM = 3.68 | RB-003 Section 3.7 |
| Edge capture depth | h_eff = 0.20 m | RB-003 Section 3.4 |
| Plume mass flow | m_dot_p = 0.071*Q_c^(1/3)*z^(5/3) + 0.0018*Q_c | Heskestad / RB-003 |

### A.4 Standard Ambient Conditions

| Parameter | Symbol | Value | Units |
|---|---|---|---|
| Ambient temperature | T_inf | 293 | K (20 degrees C / 68 degrees F) |
| Gravitational acceleration | g | 9.81 | m/s^2 |
| Ambient air density | rho_inf | 1.20 | kg/m^3 |
| Specific heat of air | c_p | 1.00 | kJ/(kg*K) |
| Entrainment coefficient (far-field, quiescent) | alpha | 0.11 | dimensionless |

## Appendix B: Glossary Terms Used in This Paper (Glossary v1.1)

All eleven terms from Glossary v1.1 are used in this paper as defined:

| Term | Usage Context in This Paper |
|---|---|
| **Buoyant Cooking Plume** | The thermal plume rising from the cooking source whose capture is the hood's function |
| **Plume Interception Plane** | The horizontal plane at hood face height where the plume cross-section is evaluated |
| **Near-Field Plume Region** | Referenced as confined to the first 0-10" above the cooking surface (from RB-001) |
| **Capture Envelope** | The 3D region beneath the hood where plume gas can be captured; geometry-dependent |
| **Effective Capture Area** | The fraction of total hood face area with sufficient velocity for capture |
| **Missed Plume Region** | The volume where plume gas escapes the hood boundary; minimized by adequate overhang |
| **Velocity Decay** | Referenced from RB-001/RB-003; the z^(-1/3) centerline velocity reduction with height |
| **Entrainment Zone** | The plume boundary region where ambient air is drawn into the plume |
| **Momentum-Limited Capture** | The condition where insufficient edge velocity or hood area prevents full plume capture |
| **Open-Boundary Dilution** | The permanent loss of escaped plume gas in the open outdoor atmosphere |
| **Wind-Affected Plume Behavior** | The deflection and disruption of the plume by outdoor wind |

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

1. Morton, B.R., Taylor, G.I., and Turner, J.S. (1956). "Turbulent gravitational convection from maintained and instantaneous sources." *Proceedings of the Royal Society A*, 234, pp. 1-23.

2. Heskestad, G. (2016). "Fire Plumes, Flame Height, and Air Entrainment." Chapter 13, *SFPE Handbook of Fire Protection Engineering*, 5th ed. Springer.

3. McCaffrey, B.J. (1979). "Purely Buoyant Diffusion Flames: Some Experimental Results." NBSIR 79-1910, National Bureau of Standards.

4. ASHRAE (2019). *ASHRAE Handbook — HVAC Applications*, Chapter 33: Kitchen Ventilation.

5. ASHRAE Standard 154 (2016). *Ventilation for Commercial Cooking Operations*.

6. ACGIH (2019). *Industrial Ventilation: A Manual of Recommended Practice for Design*, 30th ed. American Conference of Governmental Industrial Hygienists.

7. Li, A. and Dai, G. (1996). "Experimental study on the effect of range hood geometry on capture efficiency." *Building and Environment*, 31(4), pp. 363-369.

8. Swierczyna, R., Sobiski, P.A., and Clerkin, E. (2003). "Ventilation for Commercial Cooking Operations — Optimizing Makeup Air." ASHRAE Research Project 1033-RP, American Society of Heating, Refrigerating and Air-Conditioning Engineers.

9. Kuehn, T.H., Ramsey, J.W., and Olson, B.A. (2009). "Quantifying Kitchen Exhaust Hood Performance." ASHRAE Research Project 1202-RP.

10. Cetegen, B.M., Zukoski, E.E., and Kubota, T. (1984). "Entrainment in the near and far field of fire plumes." *Combustion Science and Technology*, 39, pp. 305-331.

11. Drysdale, D. (2011). *An Introduction to Fire Dynamics*, 3rd ed. John Wiley & Sons.

12. Papanicolaou, P.N. and List, E.J. (1988). "Investigations of round vertical turbulent buoyant jets." *Journal of Fluid Mechanics*, 195, pp. 341-391.

13. Briggs, G.A. (1984). "Plume rise and buoyancy effects." In *Atmospheric Science and Power Production*, ed. D. Randerson, DOE/TIC-27601.

14. Fischer, H.B., List, E.J., Koh, R.C.Y., Imberger, J., and Brooks, N.H. (1979). *Mixing in Inland and Coastal Waters*. Academic Press.

15. Hunt, G.R. (1994). "The Effect of External Turbulence on Plumes." PhD Thesis, University of Cambridge.

---

*This document is a research output of the Outdoor Ventilation Standard, governed by the Research Program Charter v2.6. All terms are used as defined in Glossary v1.1. This paper builds upon the foundational plume characterization of RB-001, the entrainment and hood sizing analysis of RB-002, and the CFM and velocity decay analysis of RB-003. It provides the geometric design guidelines that downstream topics RB-007 (failure modes), RB-008 (CFM requirements), and RB-009 (side panels and wind baffles) will reference.*
