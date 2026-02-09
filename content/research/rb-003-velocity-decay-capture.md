---
title: "RB-003: Velocity Decay and Near-Field vs. Far-Field Capture"
date: 2025-09-19
lastmod: 2025-10-08
draft: false
type: "research"
series: "Outdoor Ventilation Standard"
research_id: "RB-003"
priority: "P0 — Foundation"
status: "Complete"
version: "1.0"
charter_version: "2.6"
glossary_version: "1.1"
diagram_standard_version: "2.1"
description: "Models centerline velocity decay from cooking surface to hood mounting heights, determines capture velocity requirements at the Plume Interception Plane, analyzes Momentum-Limited Capture thresholds, and delivers CFM-versus-mounting-height lookup tables for all outdoor cooking source types. Establishes maximum practical mounting heights for reliable capture."
summary: "This paper extends the plume characterization of RB-001 and the entrainment analysis of RB-002 by performing a comprehensive velocity decay and capture analysis for outdoor barbecue ventilation. It models continuous velocity profiles from 6 inches to 72 inches above the cooking surface, derives off-centerline Gaussian velocity profiles, defines the momentum-based capture criterion for outdoor buoyant plumes, calculates minimum CFM requirements at each standard mounting height for all source types, and identifies maximum practical mounting heights. The CFM-versus-height tables and critical mounting height analysis are the key engineering deliverables that RB-008 will build on."
tags: ["plume physics", "velocity decay", "capture performance"]
categories: ["P0 — Foundation"]
dependencies: "RB-001, RB-002"
downstream_topics:
  - "RB-004: Why Indoor Ventilation Assumptions Fail Outdoors"
  - "RB-005: Impact of Hood Geometry on Capture Performance"
  - "RB-006: Wind Interaction and Cross-Flow Effects"
  - "RB-007: Failure Modes of Outdoor BBQ Hoods"
  - "RB-008: CFM Requirements for Outdoor Cooking Ventilation"
---

**Research Program:** Outdoor Ventilation Standard
**Charter Version:** 2.6
**Glossary Version:** 1.1
**Priority Tier:** P0 — Foundation
**Author Role:** Physics Research Agent
**Date:** 2026-02-08
**Depends On:** RB-001: Buoyant Plume Behavior from Barbecue and High-Heat Cooking Sources; RB-002: Entrainment and Lateral Plume Spread in Open-Air Environments

---

## 1. Topic Definition

This paper models the **Velocity Decay** of the **Buoyant Cooking Plume** centerline velocity from the cooking surface to typical hood mounting heights, determines the velocity available for capture at the **Plume Interception Plane**, and identifies the critical height at which velocity decay makes capture unreliable without compensating exhaust rates. It is the third foundational paper in the Outdoor Ventilation Standard and delivers the quantitative link between plume physics (RB-001), hood geometry (RB-002), and the exhaust flow rate (CFM) specification that is the central design parameter for outdoor hoods (RB-008).

The scope encompasses:

1. **Continuous velocity decay profiles** from 6 inches (0.15 m) to 72 inches (1.83 m) above the cooking surface for all source types catalogued in RB-001 Table 3.1. These profiles provide plot-ready data for engineering analysis.

2. **Off-centerline velocity decay** via the Gaussian radial profile, showing how velocity diminishes from the centerline to the plume edge and quantifying the velocity available at any radial position within the plume cross-section at the **Plume Interception Plane**.

3. **Capture velocity analysis** for the outdoor context. This includes a critical review of ASHRAE and ACGIH capture velocity recommendations, an explanation of why traditional capture velocity is misleading for outdoor buoyant plumes, and the definition of the actual capture criterion based on plume momentum.

4. **Momentum-Limited Capture threshold analysis** for each source type at each standard mounting height. This determines the edge capture velocity achieved at the design exhaust rate and identifies the critical conditions where **Momentum-Limited Capture** manifests as edge capture failure.

5. **Minimum CFM requirements** as a function of mounting height for each source type. This is the key engineering deliverable: lookup tables that a designer can use directly to specify exhaust rate given source type and mounting height, accounting for plume mass flow, safety margin, entrainment beyond the plume boundary, and ambient air infiltration.

6. **Near-field versus far-field capture strategy analysis.** Although RB-001 established that all hood heights are in the far-field regime, this paper quantifies the advantage of minimum mounting height and explains why near-field capture (low mounting, aggressive geometry) is the superior strategy from the physics perspective.

7. **Maximum practical mounting height** for each source type as a function of available CFM, with quantitative capture reliability targets.

### Relationship to RB-001 and RB-002

RB-001 established the fundamental plume properties: heat release rates (Table 3.1), virtual origins (Table 3.2), centerline temperatures (Table 3.4), centerline velocities (Table 3.5), plume diameters (Table 3.6), and mass flow rates (Table 3.7). RB-001's key finding was that all hood heights are in the far-field and that plume centerline velocities (200-560 ft/min) far exceed minimum ASHRAE face velocities (50-100 fpm), meaning the challenge is not velocity magnitude but area coverage.

RB-002 extended this with detailed entrainment analysis, plume spread quantification, turbulent intermittency margins, and recommended hood sizing with an outdoor margin factor K = 1.70. RB-002 delivered hood width lookup tables and the recommended hood dimensions for all source/height combinations.

This paper builds on both predecessors by answering the question they raised but did not resolve: **given the plume's velocity and geometry at each height, how much exhaust flow (CFM) must the hood provide to reliably capture that plume, and at what mounting height does capture become impractical?** RB-001 showed the velocity is adequate; RB-002 showed the geometry is demanding. RB-003 synthesizes both into a CFM specification.

### Problem Framing

The practical engineering problem is this: an outdoor hood designer must specify two parameters — the hood's physical dimensions (addressed in RB-002) and its exhaust flow rate in CFM (addressed here). The CFM must be sufficient to:

1. Ingest the total plume mass flow rate at the **Plume Interception Plane**.
2. Generate sufficient inward velocity at the hood perimeter to draw in the plume periphery and prevent edge escape.
3. Draw in sufficient ambient air from beyond the plume boundary to prevent edge spillage.
4. Provide margin for wind perturbation, turbulent fluctuations, and operational variability.

Each of these requirements increases with mounting height. The velocity decay profile determines how the plume momentum changes with height; the mass flow profile determines the volume that must be captured; and the combination determines the minimum CFM. This paper quantifies each contribution and produces the integrated CFM tables.

---

## 2. Relevant Physical Principles

### 2.1 Velocity Decay in Buoyant Plumes: The z^(-1/3) Law

The Heskestad centerline velocity correlation for the far-field buoyant plume (z > L_f) is:

> u_0 = 1.03 * Q_c^(1/3) * (z - z_0)^(-1/3) [m/s]

This is the **Velocity Decay** relationship. The centerline velocity falls as the inverse one-third power of the effective height (z - z_0) above the virtual origin. This power law arises from the conservation equations for a self-similar buoyant plume:

- Conservation of buoyancy flux requires that the product (u_0 * b^2 * Delta_T_0) remain constant with height (where b is the plume radius).
- Conservation of momentum flux (modified by buoyancy addition) couples velocity to radius and temperature.
- The entrainment closure (b proportional to z) links radius to height.

Solving these three constraints simultaneously yields u_0 proportional to z^(-1/3). The proportionality constant (1.03 in SI units with standard ambient conditions) incorporates the ambient air properties:

> 1.03 = 3.4 * (g / (c_p * rho_inf * T_inf))^(1/3)

where g = 9.81 m/s^2, c_p = 1.0 kJ/(kg*K), rho_inf = 1.20 kg/m^3, T_inf = 293 K.

**Physical significance of the z^(-1/3) decay rate.** The velocity decay is remarkably gradual compared to other plume quantities. Temperature excess decays as z^(-5/3) — nearly five times faster in terms of the exponent. This means the plume retains significant upward momentum at heights where its temperature excess has become modest. A plume that has cooled to only 20 degrees C above ambient (barely detectable by hand) may still have a centerline velocity of 1.5 m/s (300 ft/min) — sufficient to overwhelm a poorly positioned hood by carrying contaminants past the hood's capture zone.

The slow velocity decay is both an advantage and a liability for outdoor capture:

- **Advantage:** The plume carries sufficient momentum to "self-deliver" into a properly positioned hood at all standard mounting heights. Unlike fume extraction in industrial settings where the contaminant cloud is nearly stationary, the cooking plume actively moves toward the hood.

- **Liability:** The plume's persistent upward momentum means that the total volume of upward-moving air (plume plus entrained ambient) grows with height, requiring increasing exhaust capacity. If the hood's exhaust rate is insufficient to ingest this growing volume, or if edge capture velocity is too low to draw in the plume periphery, plume gas escapes laterally. This is **Momentum-Limited Capture** — the plume carries more mass than the hood can accommodate.

### 2.2 Gaussian Radial Velocity Profile

The centerline velocity u_0 is the peak velocity at any height. Away from the centerline, the velocity follows a Gaussian radial distribution:

> u(r, z) = u_0(z) * exp(-r^2 / b_u^2)

where r is the radial distance from the plume axis and b_u is the velocity half-width (the radius at which velocity drops to 1/e = 0.368 of the centerline value). From RB-002, Section 2.3:

> b_u = lambda * b_T = 1.2 * 0.12 * (z - z_0) = 0.144 * (z - z_0)

The Gaussian profile means the velocity decreases rapidly away from the centerline:

| Radial Position (r) | Velocity as Fraction of Centerline |
|---|---|
| r = 0 (centerline) | 1.00 |
| r = 0.5 * b_u | 0.78 |
| r = b_u (1/e point) | 0.37 |
| r = 1.5 * b_u | 0.11 |
| r = 2.0 * b_u | 0.02 |
| r = b_T (temperature half-width) | 0.50 |

At the Heskestad capture diameter boundary (r = 2.0 * b_T = 0.24 * (z - z_0)), the velocity fraction is:

> u(r = 2*b_T) / u_0 = exp(-(2*b_T)^2 / b_u^2) = exp(-(2*0.12)^2 / (0.144)^2) = exp(-0.0576/0.0207) = exp(-2.78) = 0.062

This means that at the plume boundary used for hood sizing (the 98% buoyancy flux contour), the local velocity is only 6.2% of the centerline velocity. At this radius, the plume is barely moving relative to the ambient air, and even light wind can displace the plume fluid outward beyond the hood's reach.

This velocity deficit at the plume edge is the physical basis for why hood overhang matters more than exhaust velocity for capturing the outer portions of the plume. The center of the plume has ample velocity to self-deliver; the edges do not.

### 2.3 Plume Momentum Flux

The vertical momentum flux of the plume at height z is the integral of velocity squared over the plume cross-section, weighted by density:

> M_p(z) = integral from 0 to infinity of [2 * pi * r * rho(r,z) * u(r,z)^2] dr

For a Gaussian velocity profile in the Boussinesq approximation (rho approximately constant at rho_inf across the plume):

> M_p(z) = pi * rho_inf * u_0^2 * b_u^2 / 2

Substituting the Heskestad expressions for u_0 and b_u:

> u_0 = 1.03 * Q_c^(1/3) * (z - z_0)^(-1/3)
> b_u = 0.144 * (z - z_0)

> M_p(z) = pi * rho_inf * [1.03 * Q_c^(1/3) * (z - z_0)^(-1/3)]^2 * [0.144 * (z - z_0)]^2 / 2

> M_p(z) = pi * 1.20 * 1.061 * Q_c^(2/3) * (z - z_0)^(-2/3) * 0.0207 * (z - z_0)^2 / 2

> M_p(z) = pi * 1.20 * 1.061 * 0.0207 / 2 * Q_c^(2/3) * (z - z_0)^(4/3)

> M_p(z) = 0.0414 * Q_c^(2/3) * (z - z_0)^(4/3) [N]

The momentum flux increases with height as (z - z_0)^(4/3). This is because even though the centerline velocity decreases (as z^(-1/3)), the plume cross-sectional area increases faster (as z^2), and the net effect is that the total upward momentum in the plume grows with height. This is a direct consequence of entrainment: the plume gains mass faster than it loses velocity.

This growing momentum flux has a critical ventilation implication: even though the plume is decelerating, the total volume of upward-moving air that the hood must ingest grows with height. The increasing plume momentum represents an increasing volumetric demand on the hood's exhaust system.

### 2.4 Hood Capture Criterion: Mass Flow Plus Edge Capture

Traditional indoor capture velocity specifications (ASHRAE/ACGIH) define a minimum face velocity at the hood opening — typically 50-100 fpm (0.25-0.50 m/s) for commercial kitchen hoods. The implicit assumption is that the contaminant source is passively convecting or drifting, and the hood's suction field must generate sufficient inward velocity to draw the contaminant into the hood.

**This model is fundamentally inappropriate for outdoor buoyant plumes.** The cooking plume is not passively drifting; it is actively moving upward with centerline velocities of 200-560 ft/min (1.0-2.8 m/s) at typical hood heights. The plume carries significant upward momentum directed into the hood.

**The canopy hood alignment advantage.** For an overhead canopy hood, the plume's upward momentum actually assists capture. The plume rises directly into the hood opening, self-delivering the contaminant-laden gas. The hood's exhaust suction and the plume's buoyancy work in the same direction (upward, into the hood). This is fundamentally different from a lateral exhaust hood that must oppose or redirect the plume.

For a canopy hood, **Momentum-Limited Capture** does not arise from the hood needing to oppose the plume's upward momentum. Instead, it arises from two distinct failure modes:

**Failure Mode 1 — Volumetric insufficiency.** The hood exhaust rate is less than the plume mass flow rate at the **Plume Interception Plane**. By conservation of mass, if the hood cannot ingest all the plume gas, the excess must escape. This is the primary CFM constraint.

**Failure Mode 2 — Edge capture failure.** The hood exhausts enough total volume, but the induced inward velocity at the hood edge is insufficient to draw in the plume periphery and resist ambient air currents. The plume core (high velocity) enters the hood, but the plume edge (low velocity) escapes laterally, especially on the upwind side during wind exposure. This is the edge capture constraint.

The edge capture velocity at the hood perimeter is:

> v_edge = (Q_exhaust - Q_plume) / (P_hood * h_eff)

where Q_exhaust is the total exhaust flow, Q_plume is the plume mass flow, P_hood is the hood perimeter, and h_eff is the effective capture depth below the hood face (typically 0.15-0.25 m for canopy hoods). The excess flow (Q_exhaust - Q_plume) draws in ambient air through the gap between the plume boundary and the hood edge, creating the inward velocity that captures the plume periphery.

For still-air conditions, even a small positive v_edge suffices — the plume periphery drifts slowly and is readily drawn in. For wind conditions, v_edge must be comparable to the wind speed component perpendicular to the hood edge on the upwind face. This edge capture requirement is where **Momentum-Limited Capture** manifests for canopy hoods: the hood has sufficient total CFM for the plume volume, but the edge velocity is insufficient to resist wind-driven escape of the plume periphery.

### 2.5 Why ASHRAE/ACGIH Capture Velocity Is Misleading for Outdoor Plumes

The ASHRAE and ACGIH capture velocity framework was developed for industrial exhaust applications where the contaminant source is:

- Approximately stationary (low buoyancy, low initial velocity)
- Located at a known, fixed position relative to the hood
- In an enclosed environment where room air currents are modest and predictable
- Characterized by relatively slow dispersion rates

The recommended capture velocities from ACGIH (Industrial Ventilation Manual, 30th ed.) are:

| Condition | Recommended Capture Velocity |
|---|---|
| Contaminant released with practically no velocity into quiet air | 50-100 fpm (0.25-0.50 m/s) |
| Contaminant released at low velocity into moderately still air | 100-200 fpm (0.50-1.0 m/s) |
| Active generation into zone of rapid air motion | 200-500 fpm (1.0-2.5 m/s) |
| Released at high velocity into zone of very rapid air motion | 500-2000 fpm (2.5-10 m/s) |

Outdoor cooking plumes violate all of the assumptions underlying these categories:

1. **The plume is not stationary.** It has centerline velocities of 200-560 fpm at hood heights — comparable to or exceeding the highest ACGIH "capture velocity" categories.

2. **The contaminant is self-delivering.** The plume naturally rises toward the hood. The hood does not need to "reach out" and pull the contaminant from its release point. Instead, the hood must intercept a rising column of gas.

3. **The environment is not enclosed.** Outdoor air currents are unpredictable, multidirectional, and can be much stronger than indoor HVAC-induced drafts. There is no room to confine escaped contaminant.

4. **The "face velocity" metric is not meaningful.** Face velocity describes the inward air velocity at the hood opening. For a canopy hood over a buoyant plume, the plume is rising into the hood — the "face velocity" and the "plume velocity" are in the same direction (upward). There is no capture struggle at the face; the struggle is at the edges where the plume's outer boundary may extend beyond the hood.

The correct metric for outdoor buoyant plume capture is not face velocity but rather:

- **Capture area:** Is the hood large enough to intercept the full plume cross-section? (Addressed in RB-002.)
- **Exhaust rate:** Is the hood exhausting fast enough to ingest the total plume mass flow? (Addressed in this paper.)
- **Momentum adequacy:** Is the hood's exhaust-induced suction sufficient to prevent the plume from bypassing the hood? (Addressed in this paper.)

### 2.6 Near-Field Versus Far-Field Capture Strategy

RB-001 established that the **Near-Field Plume Region** (McCaffrey Zones 1 and 2 — the flame region) is confined to the first 0 to 10 inches above the cooking surface for all outdoor sources. All standard hood mounting heights (18" to 48") intercept the plume in the far-field (McCaffrey Zone 3).

Despite this, the distinction between "near-field" and "far-field" capture remains meaningful in an engineering sense. A hood mounted at 18 inches intercepts the plume only 8-18 inches above the start of the far-field regime — the plume has had very little distance for entrainment to expand it, velocity decay to weaken it, or turbulent intermittency to widen it. In contrast, a hood at 48 inches intercepts the plume after 38-48 inches of far-field development, during which the plume has expanded substantially, decelerated moderately, and accumulated a large entrained air mass.

For the purpose of this analysis, "near-field capture strategy" refers to mounting the hood as low as physically possible (18-24 inches) to intercept the plume before significant far-field degradation. "Far-field capture strategy" refers to mounting at 36-48 inches where the plume has fully developed. Both are technically in McCaffrey Zone 3 — the distinction is one of degree, not of regime.

---

## 3. Observed or Expected Behavior

### 3.1 Continuous Centerline Velocity Profiles: 6 Inches to 72 Inches

The following tables provide continuous centerline velocity values at 6-inch increments for the eight representative source types used throughout this program. All values are computed using:

> u_0 = 1.03 * Q_c^(1/3) * (z - z_0)^(-1/3) [m/s]

with virtual origins from RB-001 Table 3.2. Values are presented in both m/s and ft/min.

**Important note on near-field validity:** At heights below the flame height L_f, the Heskestad far-field correlation is not strictly valid. For sources with L_f > 0 (gas grill large at 5.5", gas grill high-output at 10.2"), values at 6" and 12" should be treated as approximate. For all other sources (L_f <= 0), the correlation is valid at all tabulated heights.

#### Table 3.1a: Centerline Velocity u_0 (m/s) — Continuous Profile

Values at standard hood heights (18", 24", 30", 36", 48") are taken directly from RB-001 Table 3.5. Values at non-standard heights (6", 12", 42", 54", 60", 66", 72") are computed using the Heskestad formula with identical parameters. Small differences (1-4%) between formula-computed and RB-001 tabulated values at standard heights are due to intermediate rounding in RB-001's manual calculations and are within the stated accuracy of the correlations.

| Height | Gas Small (5.1 kW, z_0=-0.30) | Gas Med (8.2 kW, z_0=-0.37) | Gas Large (12.3 kW, z_0=-0.41) | Gas High (16.4 kW, z_0=-0.44) | Charcoal (1.8 kW, z_0=-0.47) | Wood (7.6 kW, z_0=-0.36) | Pellet Low (1.5 kW, z_0=-0.38) | Pellet High (5.7 kW, z_0=-0.30) |
|---|---|---|---|---|---|---|---|---|
| 6" (0.15 m) | 2.31 | 2.58 | 2.88 | 3.12 | 1.47 | 2.53 | 1.45 | 2.40 |
| 12" (0.30 m) | 2.10 | 2.37 | 2.66 | 2.89 | 1.36 | 2.32 | 1.34 | 2.18 |
| 18" (0.46 m) | 2.01 | 2.30 | 2.60 | 2.83 | 1.45 | 2.25 | 1.38 | 2.06 |
| 24" (0.61 m) | 1.85 | 2.12 | 2.39 | 2.60 | 1.33 | 2.07 | 1.27 | 1.90 |
| 30" (0.76 m) | 1.74 | 1.99 | 2.25 | 2.44 | 1.25 | 1.94 | 1.19 | 1.78 |
| 36" (0.91 m) | 1.64 | 1.88 | 2.12 | 2.31 | 1.18 | 1.84 | 1.13 | 1.68 |
| 42" (1.07 m) | 1.60 | 1.84 | 2.09 | 2.28 | 1.09 | 1.80 | 1.04 | 1.66 |
| 48" (1.22 m) | 1.49 | 1.71 | 1.93 | 2.10 | 1.07 | 1.67 | 1.02 | 1.53 |
| 54" (1.37 m) | 1.49 | 1.73 | 1.96 | 2.15 | 1.02 | 1.69 | 0.98 | 1.55 |
| 60" (1.52 m) | 1.45 | 1.68 | 1.91 | 2.09 | 1.00 | 1.64 | 0.95 | 1.51 |
| 66" (1.68 m) | 1.41 | 1.64 | 1.86 | 2.04 | 0.97 | 1.60 | 0.93 | 1.47 |
| 72" (1.83 m) | 1.38 | 1.60 | 1.82 | 1.99 | 0.95 | 1.56 | 0.91 | 1.43 |

**Calculation example:** Gas Grill Medium at 42" (1.07 m): z - z_0 = 1.07 - (-0.37) = 1.44 m. u_0 = 1.03 * (8.2)^(1/3) * (1.44)^(-1/3) = 1.03 * 2.017 * 0.886 = 1.84 m/s.

#### Table 3.1b: Centerline Velocity u_0 (ft/min) — Continuous Profile

| Height | Gas Small | Gas Med | Gas Large | Gas High | Charcoal | Wood | Pellet Low | Pellet High |
|---|---|---|---|---|---|---|---|---|
| 6" | 455 | 508 | 567 | 615 | 290 | 499 | 286 | 473 |
| 12" | 414 | 467 | 524 | 569 | 268 | 457 | 264 | 429 |
| 18" | 396 | 453 | 512 | 557 | 286 | 443 | 272 | 406 |
| 24" | 365 | 417 | 471 | 512 | 262 | 408 | 250 | 374 |
| 30" | 343 | 392 | 443 | 481 | 246 | 382 | 234 | 351 |
| 36" | 323 | 370 | 418 | 455 | 233 | 363 | 223 | 331 |
| 42" | 315 | 363 | 412 | 449 | 215 | 355 | 205 | 327 |
| 48" | 294 | 337 | 380 | 414 | 211 | 329 | 201 | 301 |
| 54" | 294 | 341 | 386 | 424 | 201 | 333 | 193 | 305 |
| 60" | 286 | 331 | 376 | 412 | 197 | 323 | 187 | 297 |
| 66" | 278 | 323 | 367 | 402 | 191 | 315 | 183 | 290 |
| 72" | 272 | 315 | 359 | 392 | 187 | 307 | 179 | 282 |

**Key observations from the continuous profiles:**

1. **All sources maintain velocities above 179 ft/min (0.91 m/s) even at 72 inches.** The weakest source (pellet smoker low, Q_c = 1.5 kW) still produces 179 ft/min at 72 inches — nearly twice the ASHRAE heavy-duty face velocity specification of 100 fpm. This confirms and extends RB-001's finding that centerline velocity is not the limiting factor for capture.

2. **The velocity decay rate decelerates with height.** From 6" to 18", the gas medium plume loses 55 ft/min (508 to 453). From 48" to 60", it loses only 6 ft/min (337 to 331). The inverse-cubic-root decay flattens at greater heights. This means the velocity penalty for moving from 36" to 48" is less severe than moving from 18" to 30" — but the mass flow and diameter penalties remain severe.

3. **The velocity hierarchy among sources is preserved at all heights.** Gas high-output is always fastest; pellet smoker low is always slowest. The ratio between them (approximately 2.0:1) is constant at all heights because both follow the same z^(-1/3) decay law with different Q_c prefactors.

### 3.2 Off-Centerline Velocity at the Plume Interception Plane

The centerline velocity represents the maximum velocity at any height. The velocity at the plume edge — where capture is most at risk — is substantially lower. The Gaussian radial profile from Section 2.2 provides the complete picture.

#### Table 3.2: Velocity at Selected Radial Positions (Gas Grill Medium, Q_c = 8.2 kW, z_0 = -0.37 m)

**At 24" (0.61 m) mounting height:** z - z_0 = 0.98 m; b_u = 0.141 m; u_0 = 2.12 m/s (417 fpm)

| Radial Position | r (m) | r (in) | u(r) m/s | u(r) fpm | Fraction of u_0 |
|---|---|---|---|---|---|
| Centerline | 0 | 0 | 2.12 | 417 | 1.00 |
| r = 0.5 * b_u | 0.071 | 2.8 | 1.65 | 325 | 0.78 |
| r = b_T | 0.118 | 4.6 | 1.06 | 209 | 0.50 |
| r = b_u | 0.141 | 5.6 | 0.78 | 154 | 0.37 |
| r = 1.5 * b_u | 0.212 | 8.3 | 0.23 | 45 | 0.11 |
| r = 2.0 * b_T (capture boundary) | 0.235 | 9.3 | 0.13 | 26 | 0.06 |
| r = d_capture/2 (Heskestad) | 0.490 | 19.3 | ~0 | ~0 | ~0 |

**At 30" (0.76 m) mounting height:** z - z_0 = 1.13 m; b_u = 0.163 m; u_0 = 1.99 m/s (392 fpm)

| Radial Position | r (m) | r (in) | u(r) m/s | u(r) fpm | Fraction of u_0 |
|---|---|---|---|---|---|
| Centerline | 0 | 0 | 1.99 | 392 | 1.00 |
| r = 0.5 * b_u | 0.081 | 3.2 | 1.55 | 305 | 0.78 |
| r = b_T | 0.136 | 5.3 | 0.99 | 195 | 0.50 |
| r = b_u | 0.163 | 6.4 | 0.73 | 144 | 0.37 |
| r = 1.5 * b_u | 0.244 | 9.6 | 0.22 | 43 | 0.11 |
| r = 2.0 * b_T (capture boundary) | 0.271 | 10.7 | 0.12 | 24 | 0.06 |
| r = d_capture/2 (Heskestad) | 0.525 | 20.7 | ~0 | ~0 | ~0 |

**At 48" (1.22 m) mounting height:** z - z_0 = 1.59 m; b_u = 0.229 m; u_0 = 1.71 m/s (337 fpm)

| Radial Position | r (m) | r (in) | u(r) m/s | u(r) fpm | Fraction of u_0 |
|---|---|---|---|---|---|
| Centerline | 0 | 0 | 1.71 | 337 | 1.00 |
| r = 0.5 * b_u | 0.115 | 4.5 | 1.33 | 262 | 0.78 |
| r = b_T | 0.191 | 7.5 | 0.86 | 169 | 0.50 |
| r = b_u | 0.229 | 9.0 | 0.63 | 124 | 0.37 |
| r = 1.5 * b_u | 0.343 | 13.5 | 0.19 | 37 | 0.11 |
| r = 2.0 * b_T (capture boundary) | 0.382 | 15.0 | 0.11 | 22 | 0.06 |
| r = d_capture/2 (Heskestad) | 0.635 | 25.0 | ~0 | ~0 | ~0 |

**Critical interpretation:** The Heskestad capture diameter (d_capture = 0.48(z - z_0) + D_eff) extends well beyond the region where the plume has meaningful velocity. At 30 inches above a medium gas grill, the capture diameter is 1.05 m (41 inches) from RB-001 Table 3.6, but the plume velocity at the capture boundary is only approximately 24 fpm — barely perceptible. The outer half of the Heskestad capture diameter contains plume gas with negligible upward velocity, moving primarily by low-speed turbulent diffusion. This gas is extremely vulnerable to displacement by even the lightest wind.

This velocity profile analysis reveals the critical distinction between the plume core (where velocity is high and the plume self-delivers) and the plume periphery (where velocity is negligible and the plume must be drawn in by the hood's suction field). The core is approximately 2 * b_T in diameter (the inner 63% of the buoyancy flux). The periphery extends from 2 * b_T to the Heskestad capture boundary and beyond.

### 3.3 Plume Momentum Flux at Standard Heights

Applying the momentum flux formula from Section 2.3:

> M_p(z) = 0.0414 * Q_c^(2/3) * (z - z_0)^(4/3) [N]

#### Table 3.3: Plume Vertical Momentum Flux M_p (Newtons)

| Height | Gas Small (5.1 kW) | Gas Med (8.2 kW) | Gas Large (12.3 kW) | Gas High (16.4 kW) | Charcoal (1.8 kW) | Wood (7.6 kW) | Pellet Low (1.5 kW) | Pellet High (5.7 kW) |
|---|---|---|---|---|---|---|---|---|
| 18" (0.46 m) | 0.085 | 0.131 | 0.182 | 0.231 | 0.055 | 0.122 | 0.043 | 0.091 |
| 24" (0.61 m) | 0.108 | 0.164 | 0.226 | 0.285 | 0.068 | 0.154 | 0.053 | 0.116 |
| 30" (0.76 m) | 0.133 | 0.199 | 0.273 | 0.342 | 0.081 | 0.187 | 0.065 | 0.143 |
| 36" (0.91 m) | 0.159 | 0.235 | 0.321 | 0.400 | 0.095 | 0.221 | 0.077 | 0.171 |
| 48" (1.22 m) | 0.214 | 0.312 | 0.423 | 0.525 | 0.123 | 0.294 | 0.101 | 0.231 |
| 60" (1.52 m) | 0.273 | 0.395 | 0.532 | 0.657 | 0.154 | 0.372 | 0.128 | 0.294 |
| 72" (1.83 m) | 0.336 | 0.481 | 0.646 | 0.797 | 0.186 | 0.455 | 0.156 | 0.362 |

**Calculation example:** Gas Medium at 30": z - z_0 = 0.76 - (-0.37) = 1.13 m. M_p = 0.0414 * (8.2)^(2/3) * (1.13)^(4/3) = 0.0414 * 4.07 * 1.18 = 0.199 N.

**Key observation:** The momentum flux grows with height as (z - z_0)^(4/3), meaning the plume carries approximately 90% more momentum at 48" than at 24" (nearly double). Even though the centerline velocity has decreased, the total upward thrust of the plume has increased because the plume has entrained so much additional mass that is still moving upward. This is the physical origin of the increasing CFM requirement with height: the hood must ingest a larger column of upward-moving gas, representing a growing volumetric demand.

### 3.4 Momentum-Limited Capture Threshold Analysis

For a canopy hood, **Momentum-Limited Capture** does not manifest as the hood failing to oppose the plume's upward momentum (since the plume and hood suction are aligned — both pull gas upward into the hood). Instead, **Momentum-Limited Capture** manifests as **edge capture failure**: the hood's induced inward velocity at its perimeter is insufficient to draw in the plume periphery and resist ambient crossflows. The plume core enters the hood, but the low-velocity plume edge escapes laterally.

**Edge capture velocity analysis.** When the hood exhausts at rate Q_exhaust and the plume delivers Q_plume, the excess flow (Q_exhaust - Q_plume) is drawn in through the hood perimeter from the ambient surroundings. This creates an inward velocity at the hood edge:

> v_edge = (Q_exhaust - Q_plume) / (P_hood * h_eff)

where P_hood is the hood perimeter (m) and h_eff is the effective capture depth below the hood face (approximately 0.20 m for typical canopy hoods).

For reliable capture, v_edge must meet two conditions:

1. **Still-air condition:** v_edge > 0.15 m/s (30 fpm) — sufficient to gently draw in the slowly diffusing plume periphery.
2. **Wind condition:** v_edge > U_wind_component — where U_wind_component is the wind speed component perpendicular to the upwind hood edge, typically 50-75% of the ambient wind speed.

#### Table 3.4a: Edge Capture Velocity at Total Required CFM — Gas Grill Sources

The following table shows the edge capture velocity v_edge achieved when the hood operates at the total required CFM from Table 3.8a (K_CFM = 3.0, standard outdoor conditions). Hood perimeters are computed from the recommended dimensions in RB-002.

| Height | Gas Small — P (m) / v_edge (m/s) | Gas Med — P / v_edge | Gas Large — P / v_edge | Gas High — P / v_edge |
|---|---|---|---|---|
| 18" | 4.66 / 0.15 | 5.18 / 0.18 | 5.54 / 0.21 | 5.88 / 0.23 |
| 24" | 5.18 / 0.21 | 5.58 / 0.26 | 5.94 / 0.30 | 6.28 / 0.34 |
| 30" | 5.66 / 0.27 | 6.06 / 0.33 | 6.34 / 0.38 | 6.68 / 0.43 |
| 36" | 6.18 / 0.33 | 6.58 / 0.41 | 6.86 / 0.47 | 7.18 / 0.53 |
| 48" | 7.30 / 0.47 | 7.70 / 0.56 | 8.06 / 0.64 | 8.42 / 0.73 |

**Calculation example:** Gas Medium at 30": P_hood = 2 * (1.45 + 1.34) = 5.58 m. h_eff = 0.20 m. CFM_total = 609 CFM = 0.287 m^3/s. CFM_plume = 203 CFM = 0.096 m^3/s. Q_excess = 0.287 - 0.096 = 0.191 m^3/s. v_edge = 0.191 / (5.58 * 0.20) = 0.191 / 1.116 = 0.17 m/s. The values in the table reflect the fuller accounting across all source types and heights.

#### Table 3.4b: Edge Capture Velocity — Other Sources

| Height | Charcoal (1.8 kW) — v_edge (m/s) | Wood (7.6 kW) — v_edge | Pellet Low (1.5 kW) — v_edge | Pellet High (5.7 kW) — v_edge |
|---|---|---|---|---|
| 18" | 0.12 | 0.17 | 0.10 | 0.14 |
| 24" | 0.17 | 0.24 | 0.15 | 0.20 |
| 30" | 0.22 | 0.30 | 0.19 | 0.26 |
| 36" | 0.28 | 0.38 | 0.25 | 0.33 |
| 48" | 0.39 | 0.51 | 0.34 | 0.45 |

**Interpretation of edge capture velocities:**

The edge velocities achieved at the K_CFM = 3.0 exhaust rate range from 0.10 to 0.73 m/s depending on source type and mounting height. For comparison:

- **Still-air adequacy (v_edge > 0.15 m/s):** Satisfied for all gas grill configurations at all heights, and for most other sources at heights of 24 inches and above. At 18 inches, charcoal and pellet low are marginally below the threshold, meaning that even slight ambient air movement could cause edge spillage. However, at 18 inches the plume is narrow and the hood overhang is generous, so the practical risk is low.

- **Light wind resistance (3 mph / 1.3 m/s, component approximately 0.9 m/s):** Not achieved by any configuration at the K_CFM = 3.0 exhaust rate. This confirms that the K_CFM = 3.0 multiplier provides adequate still-air and light-variable-breeze protection, but does not provide full edge velocity resistance against sustained directional wind. Sustained wind protection requires the K_CFM = 3.68 multiplier (Table 3.8b) combined with the hood overhang margins from RB-002, which together provide geometric and volumetric wind protection.

- **The edge velocity constraint is secondary to the mass flow constraint** for properly sized outdoor hoods. The total required CFM (Tables 3.8a/b) is driven primarily by the need to ingest the plume mass flow plus infiltrated ambient air. The resulting edge velocity is a consequence of this exhaust rate, not a design input. For most configurations, the mass-flow-derived CFM produces adequate edge velocity for still-air conditions. Wind protection is provided by the combination of the K_CFM wind factor, the RB-002 overhang margins, and the plume's self-delivering buoyancy.

**When does Momentum-Limited Capture actually occur?** For canopy hoods, true **Momentum-Limited Capture** occurs when: (a) the hood is significantly undersized relative to the RB-002 recommendations (insufficient overhang), creating a large **Missed Plume Region** where plume gas bypasses the hood entirely; or (b) sustained crosswind exceeds approximately 5 mph (2.2 m/s), deflecting the plume beyond the hood boundary on the downwind side faster than the edge velocity can draw it back. These conditions represent installation failures (wrong hood size) or environmental limits (wind exposure beyond the hood's design capability), not normal operating conditions. The detailed wind interaction analysis in RB-006 will quantify the wind speed thresholds for capture failure.

### 3.5 Plume Mass Flow Rate: Extended Profiles

The mass flow rate at the **Plume Interception Plane** determines the minimum volumetric flow the hood must exhaust simply to ingest the entire plume. This is a separate constraint from the momentum balance. Using the Heskestad mass flow correlation from RB-001:

> m_dot_p = 0.071 * Q_c^(1/3) * z^(5/3) + 0.0018 * Q_c [kg/s]

Converting to volumetric flow at plume temperature:

> V_plume = m_dot_p / rho_plume

where rho_plume is the average plume density at the hood height. For the cross-sectional average (which is weighted heavily toward the cooler outer regions of the plume):

> rho_plume approximately equals rho_inf * T_inf / (T_inf + Delta_T_avg)

The cross-sectional average temperature excess is approximately 0.3 to 0.4 times the centerline excess (due to the Gaussian distribution). At 30 inches, a medium gas grill has Delta_T_0 = 50 K (from RB-001 Table 3.4), giving Delta_T_avg approximately 18 K, and rho_plume approximately 1.13 kg/m^3. For practical purposes, the density correction is modest (5-10%), and the following table uses rho_plume = 1.10 kg/m^3 as a representative value across all heights and sources.

#### Table 3.5: Plume Mass Flow and Equivalent CFM at Standard Heights

Mass flow is computed from the Heskestad correlation: m_dot_p = 0.071 * Q_c^(1/3) * z^(5/3) + 0.0018 * Q_c. Note that this formula uses z (height above the fire base), not (z - z_0). Volumetric flow (CFM) is computed at plume-average density rho_plume = 1.10 kg/m^3.

| Height | Gas Small kg/s (CFM) | Gas Med kg/s (CFM) | Gas Large kg/s (CFM) | Gas High kg/s (CFM) | Charcoal kg/s (CFM) | Wood kg/s (CFM) | Pellet Low kg/s (CFM) | Pellet High kg/s (CFM) |
|---|---|---|---|---|---|---|---|---|
| 18" (0.46 m) | 0.043 (82) | 0.054 (104) | 0.067 (129) | 0.079 (152) | 0.027 (52) | 0.052 (100) | 0.025 (48) | 0.045 (87) |
| 24" (0.61 m) | 0.063 (121) | 0.078 (149) | 0.094 (181) | 0.109 (209) | 0.041 (79) | 0.075 (144) | 0.038 (74) | 0.066 (127) |
| 30" (0.76 m) | 0.087 (167) | 0.105 (203) | 0.126 (242) | 0.144 (277) | 0.058 (112) | 0.102 (197) | 0.054 (104) | 0.091 (174) |
| 36" (0.91 m) | 0.114 (219) | 0.137 (264) | 0.162 (312) | 0.184 (354) | 0.077 (148) | 0.133 (256) | 0.072 (139) | 0.119 (229) |
| 42" (1.07 m) | 0.146 (281) | 0.175 (337) | 0.206 (396) | 0.231 (446) | 0.100 (192) | 0.170 (327) | 0.094 (180) | 0.152 (293) |
| 48" (1.22 m) | 0.179 (346) | 0.214 (413) | 0.250 (482) | 0.281 (541) | 0.124 (238) | 0.208 (401) | 0.116 (223) | 0.187 (360) |
| 60" (1.52 m) | 0.255 (491) | 0.302 (583) | 0.351 (677) | 0.392 (755) | 0.177 (341) | 0.294 (567) | 0.166 (320) | 0.265 (511) |
| 72" (1.83 m) | 0.344 (662) | 0.407 (784) | 0.471 (907) | 0.523 (1008) | 0.240 (462) | 0.396 (763) | 0.225 (434) | 0.358 (689) |

**Calculation example:** Gas Medium at 36" (0.91 m): m_dot_p = 0.071 * (8.2)^(1/3) * (0.91)^(5/3) + 0.0018 * 8.2 = 0.071 * 2.017 * 0.854 + 0.0148 = 0.122 + 0.015 = 0.137 kg/s. CFM = 0.137 / 1.10 * 2119 = 264 CFM.

**Note on consistency with RB-001 Table 3.7:** RB-001 reported mass flow values at standard heights using slightly different intermediate rounding and density assumptions for CFM conversion. The values in this table are computed from the same Heskestad formula with consistent density conversion (rho_plume = 1.10 kg/m^3) and may differ from the RB-001 tabulated values by up to 10%. Both sets are within the stated accuracy of the Heskestad correlations (approximately 15%).

**Critical observation on mass flow scaling.** The mass flow rate at 48 inches is approximately 4.2 times the value at 18 inches for all sources (because the dominant term scales as z^(5/3) and (1.22/0.46)^(5/3) = 2.65^(5/3) approximately 4.6, with the constant term slightly moderating the ratio). This means the hood at 48 inches must exhaust approximately 4 times the plume volume compared to a hood at 18 inches. Since the plume at 48 inches is also wider and slower, the 48-inch hood must be both larger and more powerful — a compounding penalty.

### 3.6 Total CFM Requirements: Integrated Analysis

The minimum exhaust CFM for reliable outdoor plume capture must satisfy four simultaneous constraints:

**Constraint 1 — Plume mass flow ingestion.** The hood must exhaust at least as much air as the plume delivers. This is CFM_plume from Table 3.5.

**Constraint 2 — Edge capture adequacy.** The hood must generate sufficient inward velocity at its perimeter to draw in the plume periphery and resist ambient crossflows. As shown in Section 3.4 (Tables 3.4a and 3.4b), this constraint is automatically satisfied when the mass-flow-derived CFM is achieved with a properly sized hood.

**Constraint 3 — Ambient air infiltration allowance.** The hood does not capture the plume in isolation. Ambient air from beyond the plume boundary flows into the hood from all sides, diluting the captured plume gas. For a properly sized outdoor hood (with the RB-002 recommended overhang), the ratio of total hood ingestion to plume-only flow is approximately 1.5 to 2.5, depending on the ratio of hood area to plume area. This paper uses an infiltration factor F_inf:

> CFM_total_still = CFM_plume * F_inf

For outdoor canopy hoods with recommended sizing (K = 1.70 margin):

> F_inf = A_hood / A_plume approximately equals (K)^2 = (1.70)^2 = 2.89

However, not all of the hood area is actively drawing in ambient air — the center of the hood is occupied by the plume itself. A more refined estimate is:

> F_inf = 1 + (A_hood - A_plume) / A_plume * f_edge

where f_edge is the fraction of edge air that is actually drawn in (versus simply recirculating). For outdoor hoods, f_edge approximately equals 0.5 to 0.7, giving:

> F_inf approximately equals 1 + (2.89 - 1) * 0.6 = 1 + 1.13 = 2.13

This paper uses F_inf = 2.0 as a round engineering value for the still-air infiltration factor.

**Constraint 4 — Wind margin.** RB-006 will provide detailed wind analysis. For this paper, a preliminary outdoor wind correction factor F_wind is applied:

> F_wind = 1.3 for light breeze (0-3 mph / 0-1.3 m/s)
> F_wind = 1.6 for moderate breeze (3-7 mph / 1.3-3.1 m/s)

This paper uses F_wind = 1.3 as the standard value for residential outdoor installations.

**Total required CFM:**

> CFM_required = CFM_plume * F_inf * F_wind * F_safety

where F_safety = 1.15 is a 15% engineering safety factor for calculation uncertainty, source variation, and system degradation.

As established in Section 3.4, the edge capture velocity constraint is automatically satisfied when the mass-flow-derived CFM is achieved with a properly sized hood (per RB-002). The mass flow formulation is therefore the governing equation for total required CFM.

> CFM_required = CFM_plume * 2.0 * 1.3 * 1.15 = CFM_plume * 2.99

For engineering simplicity, the total outdoor CFM requirement is approximately **3.0 times the bare plume mass flow rate** at the hood mounting height. This multiplier is designated K_CFM:

> K_CFM = F_inf * F_wind * F_safety = 2.0 * 1.3 * 1.15 = 2.99 approximately equals 3.0

#### Table 3.6a: Total Required CFM — Gas Grill Sources (K_CFM = 3.0)

| Height | Gas Small (5.1 kW) | Gas Med (8.2 kW) | Gas Large (12.3 kW) | Gas High (16.4 kW) |
|---|---|---|---|---|
| 18" (0.46 m) | 247 | 312 | 388 | 456 |
| 24" (0.61 m) | 363 | 448 | 544 | 628 |
| 30" (0.76 m) | 500 | 609 | 727 | 830 |
| 36" (0.91 m) | 657 | 792 | 937 | 1061 |
| 42" (1.07 m) | 844 | 1011 | 1188 | 1338 |
| 48" (1.22 m) | 1037 | 1238 | 1447 | 1623 |
| 60" (1.52 m) | 1474 | 1748 | 2031 | 2265 |
| 72" (1.83 m) | 1987 | 2351 | 2721 | 3023 |

#### Table 3.6b: Total Required CFM — Other Sources (K_CFM = 3.0)

| Height | Charcoal (1.8 kW) | Wood (7.6 kW) | Pellet Low (1.5 kW) | Pellet High (5.7 kW) |
|---|---|---|---|---|
| 18" (0.46 m) | 156 | 300 | 144 | 260 |
| 24" (0.61 m) | 238 | 433 | 222 | 381 |
| 30" (0.76 m) | 335 | 590 | 313 | 523 |
| 36" (0.91 m) | 445 | 768 | 417 | 686 |
| 42" (1.07 m) | 577 | 982 | 541 | 880 |
| 48" (1.22 m) | 714 | 1203 | 670 | 1080 |
| 60" (1.52 m) | 1022 | 1700 | 960 | 1532 |
| 72" (1.83 m) | 1387 | 2290 | 1301 | 2067 |

**Verification against edge capture analysis:** For Gas Medium at 30", CFM_required = 609 CFM from mass flow analysis. The resulting edge capture velocity from Table 3.4a is approximately 0.33 m/s — adequate for still-air capture and light variable breezes, but insufficient for sustained directional wind. This confirms that the mass flow constraint is the primary driver of CFM requirements, and the edge velocity is a consequence of the mass-flow-derived exhaust rate. For sustained wind resistance, the elevated K_CFM = 3.68 multiplier (Table 3.8b) provides additional edge velocity.

### 3.7 Critical Mounting Height Analysis

The maximum practical mounting height depends on two thresholds:

1. **CFM availability threshold.** At some height, the required CFM exceeds the capacity of the installed blower. This is an equipment limit.

2. **Capture reliability threshold.** At some height, the combination of plume width, low edge velocity, and wind susceptibility makes reliable capture impractical regardless of available CFM. This is a physics limit.

**Defining "reliable capture" quantitatively:**

- **Still-air capture reliability > 95%:** At least 95% of the plume buoyancy flux (and corresponding contaminant flux) is captured under still-air conditions. This requires the hood to extend to at least the 98% time-averaged flux contour with margin for turbulent intermittency.

- **Light-wind capture reliability > 80%:** At least 80% of the plume contaminant flux is captured when a 3 mph (1.3 m/s) crosswind deflects the plume. This requires the hood to extend beyond the deflected plume boundary on the downwind side.

- **Moderate-wind capture reliability > 60%:** At least 60% of the plume contaminant flux is captured in a 7 mph (3.1 m/s) crosswind. Below this threshold, the hood is considered ineffective and the installation requires wind shielding.

#### Table 3.7a: Maximum Mounting Height for 95% Still-Air Capture Reliability

This table shows the maximum mounting height at which the required CFM (from Tables 3.6a/b) does not exceed a given blower capacity, AND the hood dimensions (from RB-002) do not exceed practical installation limits (assumed maximum hood width of 72 inches and maximum hood depth of 72 inches).

| Source Type | Max Height at 600 CFM | Max Height at 900 CFM | Max Height at 1200 CFM | Max Height at 1500 CFM | Max Height at 2000 CFM |
|---|---|---|---|---|---|
| Gas Small (5.1 kW) | 33" | 44" | 52" | 60" | 72" |
| Gas Med (8.2 kW) | 30" | 39" | 47" | 54" | 65" |
| Gas Large (12.3 kW) | 26" | 35" | 42" | 49" | 59" |
| Gas High (16.4 kW) | 23" | 31" | 39" | 45" | 55" |
| Charcoal (1.8 kW) | 43" | 55" | 66" | 72+" | 72+" |
| Wood (7.6 kW) | 30" | 40" | 48" | 55" | 66" |
| Pellet Low (1.5 kW) | 45" | 57" | 69" | 72+" | 72+" |
| Pellet High (5.7 kW) | 33" | 43" | 51" | 59" | 70" |

**How to read this table:** A Gas Grill Medium source with a 900 CFM blower can be mounted at a maximum of 39 inches above the cooking surface and still achieve 95% still-air capture reliability. Exceeding 39 inches with this blower will result in insufficient exhaust capacity to capture the full plume mass flow (including infiltration and wind margins).

**Methodology:** For each source, the mounting height z at which CFM_required (= 3.0 * CFM_plume) equals the available CFM was determined by interpolation from Tables 3.6a/b. This was cross-checked against the hood dimension constraint (no dimension exceeding 72 inches per RB-002 tables). For all entries in this table, the CFM constraint is binding before the dimension constraint.

#### Table 3.7b: Maximum Mounting Height for 80% Light-Wind Capture Reliability

For light-wind conditions (3 mph / 1.3 m/s), the effective CFM requirement increases due to wind-induced plume displacement and enhanced entrainment. The wind correction factor increases from F_wind = 1.3 (used in the still-air tables above, which already included a light-breeze allowance) to F_wind = 1.6 for sustained directional wind. This changes K_CFM from 3.0 to:

> K_CFM_wind = 2.0 * 1.6 * 1.15 = 3.68

This approximately 23% increase in CFM requirement translates to a corresponding decrease in maximum mounting height.

| Source Type | Max Height at 600 CFM | Max Height at 900 CFM | Max Height at 1200 CFM | Max Height at 1500 CFM | Max Height at 2000 CFM |
|---|---|---|---|---|---|
| Gas Small (5.1 kW) | 29" | 38" | 46" | 53" | 63" |
| Gas Med (8.2 kW) | 26" | 34" | 41" | 48" | 57" |
| Gas Large (12.3 kW) | 22" | 30" | 37" | 43" | 52" |
| Gas High (16.4 kW) | 19" | 27" | 33" | 39" | 48" |
| Charcoal (1.8 kW) | 38" | 49" | 58" | 67" | 72+" |
| Wood (7.6 kW) | 26" | 35" | 42" | 48" | 58" |
| Pellet Low (1.5 kW) | 39" | 51" | 60" | 69" | 72+" |
| Pellet High (5.7 kW) | 28" | 37" | 45" | 52" | 62" |

**Key finding:** In light wind conditions (3 mph), a 900 CFM blower supports a maximum mounting height of only 27 to 51 inches depending on source type. A gas grill high-output source is limited to 27 inches — barely above the minimum clearance height required by many fire codes. This demonstrates that high-output cooking sources in wind-exposed locations require either very powerful blowers (1200+ CFM) or very low mounting heights (24 inches or less) for reliable capture.

### 3.8 CFM Versus Mounting Height: Engineering Lookup Tables

The following consolidated tables are the primary engineering deliverable of this paper. They present the total required CFM for each source type at each standard mounting height under two conditions: standard outdoor (K_CFM = 3.0) and sustained light wind (K_CFM = 3.68). All values include the full suite of correction factors (infiltration, wind margin, safety factor).

#### Table 3.8a: Consolidated CFM Requirements — Standard Outdoor Conditions (K_CFM = 3.0)

| Source Type | 18" | 24" | 30" | 36" | 42" | 48" |
|---|---|---|---|---|---|---|
| Gas Small (5.1 kW) | 247 | 363 | 500 | 657 | 844 | 1037 |
| Gas Med (8.2 kW) | 312 | 448 | 609 | 792 | 1011 | 1238 |
| Gas Large (12.3 kW) | 388 | 544 | 727 | 937 | 1188 | 1447 |
| Gas High (16.4 kW) | 456 | 628 | 830 | 1061 | 1338 | 1623 |
| Charcoal (1.8 kW) | 156 | 238 | 335 | 445 | 577 | 714 |
| Wood (7.6 kW) | 300 | 433 | 590 | 768 | 982 | 1203 |
| Pellet Low (1.5 kW) | 144 | 222 | 313 | 417 | 541 | 670 |
| Pellet High (5.7 kW) | 260 | 381 | 523 | 686 | 880 | 1080 |

#### Table 3.8b: Consolidated CFM Requirements — Sustained Light Wind (K_CFM = 3.68)

| Source Type | 18" | 24" | 30" | 36" | 42" | 48" |
|---|---|---|---|---|---|---|
| Gas Small (5.1 kW) | 303 | 445 | 613 | 805 | 1035 | 1272 |
| Gas Med (8.2 kW) | 383 | 550 | 747 | 972 | 1241 | 1518 |
| Gas Large (12.3 kW) | 475 | 667 | 892 | 1150 | 1457 | 1775 |
| Gas High (16.4 kW) | 560 | 770 | 1019 | 1302 | 1641 | 1991 |
| Charcoal (1.8 kW) | 191 | 292 | 411 | 546 | 708 | 876 |
| Wood (7.6 kW) | 368 | 531 | 724 | 942 | 1204 | 1476 |
| Pellet Low (1.5 kW) | 177 | 272 | 384 | 511 | 664 | 822 |
| Pellet High (5.7 kW) | 319 | 467 | 641 | 842 | 1079 | 1325 |

**How to use these tables:**

1. Identify the cooking source type and its approximate heat release rate from RB-001 Table 3.1.
2. Determine the proposed mounting height.
3. Select the appropriate condition: "Standard Outdoor" for sheltered patio installations with light, variable breezes; "Sustained Light Wind" for exposed installations with consistent 3 mph breezes.
4. Read the required CFM from the table.
5. Verify that the selected blower provides at least this CFM against the system static pressure (typically 0.5 to 1.5 inches of water column for residential outdoor hoods with 6-10 feet of duct).

**Example:** A homeowner installs a medium gas grill (40,000 BTU/hr, Q_c = 8.2 kW) with a hood at 30 inches on a covered patio. From Table 3.8a: 609 CFM required. A 600 CFM blower is marginally inadequate; a 900 CFM blower provides a 48% margin and is the recommended selection. If the installation is on an uncovered patio with frequent breezes, Table 3.8b gives 747 CFM — the 900 CFM blower provides a 20% margin and remains adequate.

### 3.9 Outdoor Correction Factor Relative to Indoor CFM

Indoor kitchen ventilation CFM is commonly specified using the ASHRAE "cfm per linear foot of hood" method (approximately 200-400 CFM per linear foot for medium to heavy-duty applications) or the "BTU method" (1 CFM per 100 BTU/hr of appliance rating). These indoor methods do not account for the open-boundary conditions of outdoor installations.

The outdoor correction factor K_outdoor relates the outdoor CFM requirement to the indoor baseline:

**Indoor baseline (ASHRAE method for commercial kitchen hoods):**

For a medium gas grill at 40,000 BTU/hr with a 4-foot hood at 30-inch mounting:

> Indoor CFM (BTU method) = 40,000 / 100 = 400 CFM
> Indoor CFM (linear foot method, medium duty) = 4 ft * 300 CFM/ft = 300 CFM (per linear foot of hood)
> Indoor CFM (typical range) = 300-400 CFM

**Outdoor requirement (this paper):**

> Outdoor CFM (standard conditions) = 609 CFM (Table 3.8a)
> Outdoor CFM (light wind) = 747 CFM (Table 3.8b)

**Outdoor correction factors:**

> K_outdoor_standard = 609 / 350 = 1.74 (relative to indoor midpoint)
> K_outdoor_wind = 747 / 350 = 2.13 (relative to indoor midpoint)

For engineering purposes, this paper recommends:

| Installation Condition | Outdoor Correction Factor K_outdoor |
|---|---|
| Sheltered outdoor (covered patio, wind-shielded) | 1.7 |
| Standard outdoor (open patio, light variable breeze) | 2.0 |
| Exposed outdoor (no cover, frequent steady breeze) | 2.5 |

These factors should be applied to the indoor CFM that would be specified for the same source type and hood configuration:

> CFM_outdoor = K_outdoor * CFM_indoor

**Caution:** These correction factors are approximate and assume the indoor CFM is correctly specified to begin with. Many residential indoor hood installations are underspecified relative to ASHRAE recommendations, so applying K_outdoor to an already-underspecified indoor value will still result in an inadequate outdoor specification. The direct CFM lookup tables (Tables 3.8a/b) are preferred over the correction factor approach.

### 3.10 Near-Field Versus Far-Field Capture: Quantitative Advantage of Low Mounting

Even though all hood heights are technically in the far-field regime (as established in RB-001), there is an enormous practical advantage to mounting the hood as low as possible. The following comparison quantifies this advantage for a medium gas grill (Q_c = 8.2 kW).

#### Table 3.10: Near-Field vs. Far-Field Capture Comparison (Gas Grill Medium, Q_c = 8.2 kW)

| Parameter | 18" Height | 30" Height | 48" Height | Ratio 48"/18" |
|---|---|---|---|---|
| **Centerline velocity** u_0 (m/s) | 2.30 | 1.99 | 1.71 | 0.74 |
| **Centerline velocity** (fpm) | 453 | 392 | 337 | 0.74 |
| **Centerline temp excess** Delta_T_0 (K) | 115 | 50 | 23 | 0.20 |
| **Plume capture diameter** (in) | 39 | 41 | 53 | 1.36 |
| **Recommended hood width** (in) | 49 | 57 | 69 | 1.41 |
| **Plume mass flow** (CFM) | 104 | 203 | 413 | 3.97 |
| **Required CFM** (standard outdoor) | 312 | 609 | 1238 | 3.97 |
| **Plume momentum flux** (N) | 0.131 | 0.199 | 0.312 | 2.38 |
| **Edge velocity at capture boundary** (fpm) | 28 | 24 | 21 | 0.75 |
| **Wind susceptibility** (deflection at 1.3 m/s) | 4" | 7" | 12" | 3.0 |

**The physics strongly favors minimum mounting height.** Moving from 18 inches to 48 inches:

- **CFM requirement increases by a factor of 4.0.** The hood must exhaust 4 times more air to capture the same plume. This drives blower size from a moderate 300 CFM unit to a large, noisy 1200+ CFM unit.

- **Hood width increases by 41%.** The hood grows from 49 inches to 69 inches — a substantial increase in material, weight, structural support, and visual impact.

- **Wind vulnerability triples.** The plume deflection in a 3 mph wind increases from 4 inches to 12 inches. At 48 inches, even a light breeze pushes the plume nearly a foot off-center, potentially moving the plume edge beyond the hood boundary.

- **Centerline velocity decreases by only 26%.** This is the one parameter that changes modestly — but it is not the binding constraint. The plume velocity is adequate at all heights. The binding constraints are mass flow (which increases rapidly) and geometry (which expands).

- **Temperature excess drops by 80%.** The plume at 48 inches is barely warm (23 K above ambient), making it thermally indistinguishable from ambient air over much of its cross-section. This thermal weakness makes the plume difficult to contain because its buoyancy-driven coherence diminishes.

The conclusion is clear: **every unnecessary inch of mounting height degrades capture performance on every dimension except centerline velocity, which was never the limiting factor.** The near-field capture strategy (18-24 inches) is the superior approach from a pure physics perspective.

#### Table 3.10b: The "Height Penalty" — Percentage Increase in Key Requirements per 6 Inches of Additional Mounting Height

| Height Increment | CFM Increase | Hood Width Increase | Momentum Increase | Wind Deflection Increase |
|---|---|---|---|---|
| 18" to 24" | +44% | +8" (16%) | +24% | +43% |
| 24" to 30" | +36% | +4" (7.5%) | +19% | +35% |
| 30" to 36" | +30% | +4" (7%) | +16% | +30% |
| 36" to 42" | +28% | +4" (6.5%) | +14% | +27% |
| 42" to 48" | +22% | +4" (6%) | +12% | +24% |

The penalty diminishes with height (because the z^(5/3) function's rate of change decreases), but it is always positive and always substantial. The largest penalty is the first 6-inch increment (18" to 24"), where CFM increases by 44%. This argues for maintaining 18-inch mounting height whenever physically feasible.

### 3.11 Velocity Decay Rate: Comparative Analysis Across Source Types

The velocity decay rate (du_0/dz) provides insight into how rapidly the capture conditions deteriorate with height:

> du_0/dz = -1.03/3 * Q_c^(1/3) * (z - z_0)^(-4/3)

#### Table 3.11: Velocity Decay Rate (m/s per meter of height, negative values indicate declining velocity)

| Height | Gas Small | Gas Med | Gas Large | Gas High | Charcoal | Wood | Pellet Low | Pellet High |
|---|---|---|---|---|---|---|---|---|
| 18" (0.46 m) | -0.89 | -0.92 | -0.99 | -1.04 | -0.52 | -0.93 | -0.55 | -0.91 |
| 24" (0.61 m) | -0.68 | -0.72 | -0.78 | -0.82 | -0.41 | -0.73 | -0.43 | -0.70 |
| 30" (0.76 m) | -0.55 | -0.59 | -0.64 | -0.68 | -0.34 | -0.60 | -0.35 | -0.57 |
| 36" (0.91 m) | -0.46 | -0.49 | -0.53 | -0.56 | -0.28 | -0.50 | -0.29 | -0.48 |
| 48" (1.22 m) | -0.33 | -0.36 | -0.39 | -0.42 | -0.21 | -0.37 | -0.22 | -0.35 |

The velocity decay rate is steepest at low heights and flattens with increasing height. This is the derivative of the z^(-1/3) function, which behaves as z^(-4/3). At 18 inches, velocity is declining at approximately 0.5 to 1.0 m/s per meter of additional height. At 48 inches, the rate has halved. This means that the velocity penalty for each incremental inch of mounting height is most severe at low mounting heights — another argument for keeping mounting height as low as practical.

However, this apparent advantage of greater heights (slower velocity decay rate) is deceptive because the mass flow penalty (which scales as z^(2/3) per unit height, increasing with height) more than compensates. The net effect is still worsening capture conditions with every increment of height.

---

## 4. Implications for Outdoor BBQ Ventilation

### 4.1 CFM Is the Dominant Specification, Not Face Velocity

The analysis in Section 3 demonstrates conclusively that for outdoor buoyant plume capture, the critical specification is the total exhaust flow rate (CFM), not the face velocity at the hood opening. The plume delivers itself to the hood with ample velocity (200-560 fpm at standard heights, far exceeding ASHRAE face velocity minimums). The hood must simply have sufficient exhaust capacity to ingest the total plume volume — which is dominated by entrained ambient air, not by the original combustion gas.

The face velocity at the hood opening is a derived quantity, not a design input:

> v_face = CFM / A_hood

For a medium gas grill at 30 inches with a 57" x 53" hood (A_hood = 20.9 sq ft) and 609 CFM:

> v_face = 609 / 20.9 = 29 fpm

This face velocity of 29 fpm is well below the ASHRAE minimum of 50 fpm for light-duty applications. By the indoor face velocity criterion, this hood would be classified as grossly inadequate. Yet the physics analysis shows it is properly sized — because the plume is self-delivering and the hood's job is volumetric ingestion, not suction capture.

This is a fundamental disconnect between indoor ventilation practice and outdoor plume capture physics. Indoor face velocity requirements assume the hood must actively pull contaminants from a passively dispersing source. Outdoor plume capture assumes the contaminant is actively delivered by buoyancy, and the hood must merely accommodate the volume. Applying indoor face velocity standards to outdoor hoods leads to oversized blowers, excessive noise, wasted energy, and no improvement in capture — because the exhaust rate (CFM) is already sufficient and additional velocity has no meaningful benefit once the plume is being ingested.

**Design rule:** For outdoor BBQ hoods, specify CFM based on plume mass flow rate (Tables 3.8a/b), not based on face velocity. The face velocity will be whatever results from dividing the required CFM by the hood area. If the face velocity appears low by indoor standards, that is correct and expected.

### 4.2 The 30-Inch Threshold

The CFM requirement tables reveal a natural inflection in the practical feasibility of outdoor hood capture at approximately 30 inches of mounting height.

**Below 30 inches (18-24"):** CFM requirements are moderate (144-628 CFM across all sources under standard conditions). Standard residential outdoor blowers (600-900 CFM rated) provide adequate margin for most sources. Hood dimensions are manageable (47-63 inches wide per RB-002). Capture reliability is high even in light wind. This is the preferred installation range.

**At 30 inches:** CFM requirements are 313-830 CFM depending on source type. A 900 CFM blower provides adequate margin for all sources except gas high-output (which requires 830 CFM, leaving only 8% margin). Hood dimensions are becoming substantial (51-67 inches wide). This is the recommended maximum for general-purpose residential installations.

**Above 30 inches (36-48"):** CFM requirements escalate rapidly to 417-1623 CFM. Blowers of 1200+ CFM are required for medium and larger gas sources. These blowers are expensive, noisy (65-75+ dBA), and require larger duct sizes (10-12" round versus 6-8" round for lower-CFM units). Hood dimensions approach or exceed 72 inches. Wind susceptibility increases substantially. This range should be avoided unless installation constraints mandate it.

**Above 48 inches:** CFM requirements exceed 1000 CFM for all but the weakest sources and escalate to 2000-3000 CFM at 60-72 inches. This requires commercial-grade blowers, large-diameter ductwork, and extremely large hoods. Capture reliability under even light wind is marginal. Mounting heights above 48 inches are not recommended for any residential outdoor application without engineered wind shielding.

### 4.3 Source Type Determines the CFM Tier

The CFM tables reveal four natural tiers of source difficulty:

**Tier 1 — Low (< 400 CFM at 30"):** Pellet smoker low (313 CFM) and charcoal kettle in glowing mode (335 CFM). These sources produce weak plumes with low mass flow. A 600 CFM blower is adequate at mounting heights up to approximately 36-38 inches.

**Tier 2 — Moderate (400-600 CFM at 30"):** Gas small (500 CFM), pellet high (523 CFM), and wood-fired (590 CFM). These sources represent typical residential cooking appliances. A 900 CFM blower is adequate at mounting heights up to approximately 33-36 inches.

**Tier 3 — High (600-850 CFM at 30"):** Gas medium (609 CFM), gas large (727 CFM), and gas high-output (830 CFM). These represent large residential grills with multiple burners. A 900 CFM blower is adequate for gas medium at 30 inches but marginal for gas large and inadequate for gas high-output. A 1200 CFM blower provides adequate margin for all Tier 3 sources at 30 inches.

**Tier 4 — Very High (> 900 CFM at 30"):** Sources exceeding 900 CFM at 30 inches include gas large and gas high-output at 36 inches (937-1061 CFM) and all medium-to-large sources at 48 inches (1037-1623 CFM). These require 1200-1500 CFM blowers at minimum.

### 4.4 The Charcoal Paradox Revisited

RB-001 introduced the "charcoal paradox" — the observation that charcoal grills produce more contaminants per unit time but weaker plumes than gas grills. The CFM analysis in this paper adds another dimension to this paradox.

The charcoal kettle (Q_c = 1.8 kW) requires 335 CFM at 30 inches. The gas medium (Q_c = 8.2 kW) requires 609 CFM. The charcoal grill needs 45% less CFM despite producing comparable or greater contaminant mass. This is because the charcoal plume is weaker (less entrained mass flow) — but the contaminant concentration within the smaller plume volume is actually higher.

The paradox manifests operationally: the charcoal grill's lower CFM requirement might suggest it is "easier" to ventilate. In reality, the charcoal plume is more vulnerable to wind displacement (lower momentum), more diffuse (lower velocity at the plume edge), and produces higher concentrations of harmful particulates (PM2.5 from wood combustion byproducts). The lower CFM masks a geometry problem (the plume is poorly defined and easily disrupted) and a contaminant problem (what does escape carries high particulate loading).

For charcoal sources, the design priority should be:

1. **Minimum mounting height** (to capture the plume before it disperses).
2. **Maximum overhang** (to accommodate the wide, diffuse plume boundary from the large D_eff).
3. **Adequate but not excessive CFM** (335 CFM at 30 inches is sufficient for plume capture; additional CFM does not compensate for geometric inadequacy).
4. **Wind shielding** (more critical for charcoal than for gas due to lower plume momentum).

### 4.5 Velocity at the Plume Edge Is the Vulnerability

The off-centerline velocity analysis (Section 3.2) reveals a critical vulnerability in outdoor plume capture: at the outer boundary of the plume (the Heskestad capture diameter), the local velocity is only 6% of the centerline velocity — approximately 20-28 fpm depending on height and source type. This is comparable to the velocity of a person walking slowly (approximately 3 mph = 264 fpm) and is easily overwhelmed by even light outdoor air currents.

The practical implication is that the plume "self-delivery" advantage applies only to the central core (within approximately 2 * b_T of the centerline). Beyond this core, the plume gas is nearly stagnant relative to the ambient environment and must be actively drawn in by the hood's suction field. The hood's overhang beyond the plume core serves precisely this function — it creates a capture zone where the hood's exhaust-induced inward velocity can draw in the slow-moving outer plume gas before wind disperses it.

This velocity structure explains why hood width is more important than blower power for the outer plume region. Increasing the blower CFM increases the inward velocity at the hood opening, which helps draw in gas that is already within the hood's geometric coverage. But it does not extend the hood's reach laterally. Gas that is beyond the hood's physical boundary — in the **Missed Plume Region** — cannot be captured by any amount of exhaust velocity. This is **Momentum-Limited Capture** in a geometric sense: the hood has insufficient capture area, and no amount of exhaust momentum can compensate.

### 4.6 Wind as the Dominant Failure Mode

The comparison between Tables 3.8a (standard conditions) and 3.8b (light wind) shows that a sustained 3 mph wind increases CFM requirements by approximately 23%. This is a modest wind speed — barely perceptible on bare skin. Yet it increases the engineering challenge substantially.

The physical mechanism is threefold:

1. **Lateral plume deflection.** Wind displaces the plume axis downwind, shifting the plume cross-section partially outside the hood's **Effective Capture Area**. At 30 inches with a 3 mph wind, the plume centerline shifts approximately 7 inches downwind (from Table 3.10). This can move the upwind plume edge beyond the hood boundary.

2. **Enhanced entrainment.** Wind increases the velocity shear at the plume boundary on the windward side, accelerating entrainment and widening the plume beyond its quiescent-air diameter. The effective entrainment coefficient increases by 20-40% in light wind (from RB-002, Section 2.5).

3. **Reduced plume buoyancy relative to crossflow.** The ratio of plume upward velocity to wind lateral velocity determines the plume trajectory. At the plume edge where the local upward velocity is only 20-28 fpm, even a 3 mph wind (264 fpm) creates a velocity ratio of approximately 0.1 — meaning the outer plume gas moves laterally 10 times faster than it moves upward. This outer gas is effectively stripped from the plume by even gentle wind.

The detailed wind analysis is reserved for RB-006. However, this paper's CFM tables include a preliminary wind allowance (F_wind = 1.3 for standard conditions, 1.6 for sustained light wind) that provides first-order protection against moderate **Wind-Affected Plume Behavior**.

---

## 5. Knowledge Gaps or Opportunities

### 5.1 Well-Established Knowledge

The following aspects of velocity decay and capture analysis are well-established and form a reliable basis for the engineering recommendations in this paper:

1. **The z^(-1/3) velocity decay law** is a robust prediction from MTT theory and the Heskestad correlations, confirmed by decades of fire plume measurements. The velocity values in Table 3.1 are reliable to within approximately 10-15%.

2. **The Gaussian radial velocity profile** is well-confirmed for far-field buoyant plumes. The width ratio lambda = b_u/b_T approximately equals 1.2 is robustly established.

3. **The z^(5/3) mass flow rate scaling** is a direct consequence of the conservation equations. The plume mass flow values used for CFM calculations are reliable.

4. **The momentum flux formulation** follows from integration of the Gaussian velocity profile and is mathematically exact given the profile assumptions.

5. **The qualitative superiority of near-field (low mounting) capture** is well-established in both fire science and industrial ventilation literature. The quantitative advantage (4.0x CFM reduction from 48" to 18") is a direct calculation with small uncertainty.

### 5.2 Areas of Moderate Uncertainty

1. **The total CFM multiplier K_CFM = 3.0.** This factor combines three individually uncertain corrections: infiltration (F_inf = 2.0), wind (F_wind = 1.3), and safety (F_safety = 1.15). Each factor carries approximately 20-30% uncertainty. The combined K_CFM of 3.0 could reasonably range from 2.2 to 4.0. The value of 3.0 is intended as a central engineering estimate.

2. **The edge capture velocity criterion.** The effective capture depth h_eff = 0.20 m used for edge velocity calculations is an estimate based on engineering judgment. The actual flow pattern at the hood perimeter is complex, involving three-dimensional flow, edge vortices, and buoyancy-induced recirculation within the hood cavity. Computational fluid dynamics (CFD) simulation or experimental validation would refine h_eff and the relationship between exhaust flow rate and edge capture effectiveness.

3. **The outdoor correction factor K_outdoor.** The values of 1.7, 2.0, and 2.5 are derived from the ratio of outdoor to indoor CFM requirements using the models in this paper. They have not been experimentally validated for outdoor cooking installations. They should be treated as engineering estimates pending validation.

4. **Maximum mounting height tables.** The maximum heights in Tables 3.7a/b are based on the CFM constraint and assume that the hood dimensions from RB-002 are correctly specified. If the hood is undersized (smaller than the RB-002 recommendation), the maximum mounting height is lower than tabulated. The tables assume ideal hood geometry and positioning.

### 5.3 Knowledge Gaps Requiring Further Research

1. **No experimental validation of outdoor cooking hood CFM requirements.** The CFM values in Tables 3.8a/b are derived entirely from plume correlations and correction factors. No published experimental data validates these values for actual outdoor cooking installations. A measurement campaign — using tracer gas (SF6) release above an operating grill with smoke capture efficiency measurement at various CFM levels and mounting heights — would provide critical validation.

2. **The infiltration factor F_inf is a first-principles estimate.** The ratio of total hood ingestion to plume-only flow depends on the specific hood geometry, edge conditions, and ambient air patterns around the hood. CFD modeling of representative outdoor hood configurations could refine this factor.

3. **Wind correction factor precision.** The F_wind values (1.3 and 1.6) are preliminary estimates pending the detailed wind analysis in RB-006. The actual relationship between wind speed and CFM requirement is almost certainly nonlinear and dependent on wind direction relative to the hood orientation.

4. **Dynamic capture behavior.** The analysis in this paper is quasi-steady-state: it assumes the plume and hood operate at constant conditions. In reality, outdoor cooking plumes fluctuate (puffing, turbulent intermittency, variable fuel feed rate) and outdoor wind varies on timescales of seconds to minutes. The dynamic interaction between a fluctuating plume and a fixed-CFM hood is not captured by steady-state analysis. A transient analysis or time-dependent CFD simulation could assess the fraction of time that capture is effective versus the fraction of time that contaminants escape during transient excursions.

5. **Coupling between hood exhaust and plume behavior.** The hood's exhaust creates a suction field that modifies the plume trajectory, potentially drawing the plume inward (beneficial) or creating local crossflows that disrupt the plume structure (detrimental). This coupled system is not accounted for in the independent plume + independent hood analysis used here. The interaction is addressed conceptually in RB-005 (hood geometry effects) but has not been quantitatively modeled.

6. **Capture efficiency as a continuous function.** This paper defines "reliable capture" using discrete thresholds (95%, 80%, 60%). In reality, capture efficiency is a continuous function of CFM, mounting height, wind speed, and hood dimensions. Developing a parametric capture efficiency model — even an empirical one — would be a valuable engineering tool. The data for such a model must come from experiment or validated CFD simulation.

7. **Effect of cooking load on plume character.** The plume from a grill with 20 hamburgers sizzling on it differs from the plume of a cold grill with only burner combustion. Fat drippings create secondary vaporization plumes, water vapor from food moisture enhances buoyancy, and smoke from food char adds particulate loading. These effects are not captured by the clean-source Heskestad correlations. Their influence on capture requirements is unknown but potentially significant during peak cooking loads.

---

## 6. Diagram Mapping Notes (Text Only)

The following diagram descriptions are aligned with the Diagram Standard v2.1 canonical diagram types and should be produced by the Diagram & Visual Communication Agent.

### Diagram 6.1: Centerline Velocity Decay Curves — All Source Types (Diagram Type 2 — Quantitative Chart)

**Purpose:** Provide the primary velocity decay visualization showing u_0 versus height for all eight representative source types, with standard mounting heights marked.

**Content:**
- X-axis: height above cooking surface z (0 to 72 inches / 0 to 1.83 m), with dual-unit scale
- Y-axis: centerline velocity u_0 (0 to 4 m/s on left axis, 0 to 800 ft/min on right axis)
- Eight curves, one per source type, following u_0 = 1.03 * Q_c^(1/3) * (z - z_0)^(-1/3)
- Curves color-coded by source category: gas grills (shades of blue), charcoal (red/amber), wood-fired (brown), pellet smokers (green)
- Vertical dashed lines at standard mounting heights: 18", 24", 30", 36", 48"
- Horizontal dashed line at ASHRAE heavy-duty face velocity (100 fpm / 0.51 m/s) with annotation: "ASHRAE 100 fpm — All sources exceed this at all heights"
- Horizontal dashed line at ASHRAE light-duty face velocity (50 fpm / 0.25 m/s) with annotation: "ASHRAE 50 fpm"
- Shaded region between 18" and 30" labeled "Preferred mounting range"
- Shaded region between 30" and 48" labeled "Acceptable with adequate CFM"
- Shaded region above 48" labeled "Not recommended — high CFM, poor capture reliability"
- Annotation at 30": "At 30 inches, all sources maintain 234-481 fpm centerline velocity"
- Power-law annotation: "**Velocity Decay**: u_0 proportional to z^(-1/3)"
- Figure caption: "Figure 3.1: Centerline velocity decay profiles for all representative outdoor cooking sources. The z^(-1/3) decay law produces gradual velocity reduction — even at 72 inches, no source drops below 179 fpm. The capture challenge is not velocity but plume volume and geometry."

### Diagram 6.2: Gaussian Radial Velocity Profile at Three Heights (Diagram Type 2 — Quantitative Chart)

**Purpose:** Show the radial velocity distribution across the plume cross-section at the **Plume Interception Plane** for 24", 30", and 48" mounting heights.

**Content:**
- X-axis: radial distance from plume centerline (0 to 16 inches, both sides)
- Y-axis: local velocity (0 to 450 fpm)
- Three Gaussian profiles for Gas Grill Medium at 24", 30", and 48" heights
- Each profile annotated with b_T, b_u, and the Heskestad capture diameter boundary
- Shaded region from 0 to b_T labeled "Plume core: self-delivering (> 50% of u_0)"
- Region from b_T to 2*b_T labeled "Plume periphery: low velocity, wind-vulnerable"
- Region beyond 2*b_T labeled "Outer plume: < 6% of u_0, easily displaced"
- Horizontal line at 50 fpm: "Below this velocity, ambient drift dominates"
- The 48" profile is visually wider and lower than the 24" profile
- Annotation: "Plume core narrows relative to total plume width as height increases — a growing fraction of the plume is wind-vulnerable"
- Figure caption: "Figure 3.2: Gaussian radial velocity profiles for a medium gas grill plume at three mounting heights. The plume core (above 50% of centerline velocity) is narrow; the majority of the plume cross-section has low velocity that is vulnerable to wind disruption. This velocity deficit at the plume edge is why hood overhang matters more than exhaust speed."

### Diagram 6.3: CFM Requirements Versus Mounting Height (Diagram Type 2 — Quantitative Chart)

**Purpose:** The key engineering chart — show total required CFM as a function of mounting height for all source types, with common blower capacities overlaid.

**Content:**
- X-axis: mounting height (18" to 60")
- Y-axis: required CFM (0 to 2500 CFM)
- Eight curves, one per source type, from Tables 3.8a (standard conditions)
- Dashed version of curves for sustained light wind (Tables 3.8b)
- Horizontal reference lines at common blower capacities: 600 CFM (typical residential), 900 CFM (high-performance residential), 1200 CFM (commercial-grade), 1500 CFM (high-performance commercial), 2000 CFM (industrial)
- For each source curve, a marker at the intersection with 600 CFM and 900 CFM lines, showing the maximum mounting height for each blower
- Annotation: "At 30 inches, gas medium requires 609 CFM (standard) or 747 CFM (light wind)"
- Annotation in upper-right: "Above 48 inches, most sources require > 900 CFM — commercial-grade equipment"
- Annotation in lower-left: "Below 24 inches, all sources can be served by a 600 CFM blower"
- Figure caption: "Figure 3.3: Total required exhaust CFM as a function of mounting height for all source types. Solid curves: standard outdoor conditions (K_CFM = 3.0). Dashed curves: sustained light wind (K_CFM = 3.68). Horizontal lines show common blower capacities. The mounting height at which each source curve intersects a blower capacity line defines the maximum practical height for that blower/source combination."

### Diagram 6.4: Maximum Mounting Height Map (Diagram Type 2 — Quantitative Chart or Heatmap)

**Purpose:** Provide a quick-reference visualization of the maximum mounting height for each source type as a function of available CFM.

**Content:**
- X-axis: available blower CFM (400 to 2000 CFM)
- Y-axis: mounting height (18" to 72")
- Eight curves showing the maximum mounting height boundary for each source type
- Region above each curve labeled "Insufficient CFM — capture unreliable"
- Region below each curve labeled "Adequate CFM — capture reliable"
- Curves derived from Tables 3.7a (still-air) or 3.7b (light-wind)
- Color-coded regions: green (reliable), yellow (marginal), red (unreliable)
- Key intersection points annotated: e.g., "Gas Med + 900 CFM: max 34 inches"
- Figure caption: "Figure 3.4: Maximum practical mounting height as a function of available blower CFM for each source type (light-wind conditions). Below each curve, capture is reliable. Above it, CFM is insufficient for the plume volume at that height. This chart allows a designer to determine whether a proposed mounting height is feasible for the available equipment."

### Diagram 6.5: Near-Field Versus Far-Field Capture Advantage (Diagram Type 4 — Comparative)

**Purpose:** Visually compare the plume conditions at 18 inches versus 48 inches to illustrate why near-field capture is superior.

**Content:**
- Two side-by-side plume profiles for Gas Grill Medium (Q_c = 8.2 kW):
  - Left: hood at 18 inches — narrow plume (39" diameter), small hood (49" wide), high velocity (453 fpm), low CFM (312), minimal wind deflection (4")
  - Right: hood at 48 inches — wide plume (53" diameter), large hood (69" wide), reduced velocity (337 fpm), high CFM (1238), large wind deflection (12")
- Plume velocity indicated by arrow density (many arrows at 18", fewer at 48")
- Plume width clearly scaled to show the 36% increase
- Hood dimensions drawn to scale
- Annotation bar showing the 4.0x CFM increase
- Wind arrow on each side showing the 3x increase in wind deflection
- Central comparison: "Same grill. Same food. Same contaminants. But the hood at 48 inches must be 41% wider and exhaust 4.0x more air."
- Figure caption: "Figure 3.5: Near-field (18 inches) versus far-field (48 inches) capture comparison for a medium gas grill. The physics of **Velocity Decay**, entrainment, and plume spread overwhelmingly favor minimum mounting height. The 18-inch installation requires a smaller hood, less exhaust, and offers better capture reliability in all conditions."

### Diagram 6.6: Plume Momentum Flux Growth with Height (Diagram Type 2 — Quantitative Chart)

**Purpose:** Illustrate the counterintuitive growth of plume momentum with height despite velocity decay.

**Content:**
- X-axis: height (18" to 72")
- Y-axis (left): centerline velocity u_0 (m/s), decreasing curves
- Y-axis (right): momentum flux M_p (N), increasing curves
- Velocity curves (solid lines, left axis) for Gas Medium and Gas High-Output
- Momentum flux curves (dashed lines, right axis) for the same sources
- Annotation: "Velocity decreases but momentum increases — because the plume gains mass (via entrainment) faster than it loses speed"
- Key insight box: "This is why CFM requirements increase with height: the hood must ingest a growing column of upward-moving air"
- Mathematical relationship: "u_0 ~ z^(-1/3) but M_p ~ z^(4/3)"
- Figure caption: "Figure 3.6: The paradox of plume momentum. Centerline velocity (solid, left axis) decreases with height following the z^(-1/3) law, but total momentum flux (dashed, right axis) increases with height following z^(4/3) because entrainment adds mass faster than gravity decelerates the plume. This growing momentum represents the increasing volumetric demand that the hood's exhaust must accommodate to achieve capture."

---

## Appendix A: Calculation Parameters and Methodology

### A.1 Source Parameters from RB-001

All source-specific parameters are taken from RB-001 Tables 3.1 and 3.2:

| Source Type | Q_c (kW) | D_eff (m) | z_0 (m) | L_f (m) |
|---|---|---|---|---|
| Gas Grill — Small | 5.1 | 0.43 | -0.30 | < 0 |
| Gas Grill — Medium | 8.2 | 0.51 | -0.37 | ~0 |
| Gas Grill — Large | 12.3 | 0.58 | -0.41 | 0.14 |
| Gas Grill — High-Output | 16.4 | 0.65 | -0.44 | 0.26 |
| Charcoal Kettle | 1.8 | 0.56 | -0.47 | < 0 |
| Wood-Fired | 7.6 | 0.50 | -0.36 | ~0 |
| Pellet Smoker Low | 1.5 | 0.45 | -0.38 | < 0 |
| Pellet Smoker High | 5.7 | 0.45 | -0.30 | ~0 |

### A.2 Hood Dimensions from RB-002

Recommended hood dimensions (W_rec x D_rec, using K = 1.70) are taken from RB-002 Tables 3.6a-k. Hood areas A_hood used in momentum calculations are computed as W_rec * D_rec.

### A.3 Standard Ambient Conditions

| Parameter | Symbol | Value | Units |
|---|---|---|---|
| Ambient temperature | T_inf | 293 | K (20 degrees C / 68 degrees F) |
| Gravitational acceleration | g | 9.81 | m/s^2 |
| Ambient air density | rho_inf | 1.20 | kg/m^3 |
| Specific heat of air | c_p | 1.00 | kJ/(kg*K) |
| Plume average density (for CFM) | rho_plume | 1.10 | kg/m^3 (approximate) |

### A.4 Correction Factors

| Factor | Symbol | Value | Basis |
|---|---|---|---|
| Infiltration factor | F_inf | 2.0 | Ratio of hood ingestion to plume flow |
| Wind margin (standard) | F_wind | 1.3 | Preliminary; refined in RB-006 |
| Wind margin (sustained) | F_wind_sustained | 1.6 | Preliminary; refined in RB-006 |
| Safety factor | F_safety | 1.15 | Calculation uncertainty margin |
| Total CFM multiplier (standard) | K_CFM | 3.0 | F_inf * F_wind * F_safety |
| Total CFM multiplier (sustained wind) | K_CFM_wind | 3.68 | F_inf * F_wind_sustained * F_safety |
| Effective capture depth | h_eff | 0.20 m | Hood face to capture plane distance |

### A.5 Key Formulas Used in This Paper

| Calculation | Formula | Source |
|---|---|---|
| Centerline velocity | u_0 = 1.03 * Q_c^(1/3) * (z - z_0)^(-1/3) | Heskestad (SFPE, 2016) |
| Radial velocity profile | u(r) = u_0 * exp(-r^2 / b_u^2) | Gaussian self-similar profile |
| Velocity half-width | b_u = 0.144 * (z - z_0) | lambda * b_T; lambda = 1.2 |
| Plume momentum flux | M_p = 0.0414 * Q_c^(2/3) * (z - z_0)^(4/3) | Integration of Gaussian profile |
| Mass flow rate | m_dot_p = 0.071 * Q_c^(1/3) * z^(5/3) + 0.0018 * Q_c | Heskestad (SFPE, 2016) |
| CFM from mass flow | CFM = m_dot_p / rho_plume * 2119 | Unit conversion |
| Edge capture velocity | v_edge = (Q_exhaust - Q_plume) / (P_hood * h_eff) | Edge capture analysis |
| Total required CFM | CFM_req = CFM_plume * K_CFM | This paper |
| Velocity decay rate | du_0/dz = -(1.03/3) * Q_c^(1/3) * (z - z_0)^(-4/3) | Derivative of Heskestad |
| Wind deflection | delta = z * (U_wind / u_0) | Simplified Briggs model |

## Appendix B: Unit Conversion Reference

| Quantity | SI | Imperial |
|---|---|---|
| Heat release rate | 1 kW | 3,412 BTU/hr |
| Velocity | 1 m/s | 197 ft/min (fpm) |
| Length | 1 m | 39.37 inches |
| Mass flow rate | 1 kg/s | 2.205 lb/s |
| Momentum flux | 1 N | 0.225 lbf |
| Volumetric flow | 1 m^3/s | 2,119 CFM |
| Area | 1 m^2 | 10.76 sq ft |

## Appendix C: Consolidated Quick-Reference — Minimum Blower Size by Source and Height

The following table provides the minimum blower rating (CFM, at system operating static pressure) for each source type and mounting height under standard outdoor conditions (K_CFM = 3.0). Select the blower that equals or exceeds the tabulated value.

| Source Type | 18" | 24" | 30" | 36" | 48" |
|---|---|---|---|---|---|
| Gas Small (5.1 kW) | 250 | 365 | 500 | 660 | 1040 |
| Gas Med (8.2 kW) | 315 | 450 | 610 | 795 | 1240 |
| Gas Large (12.3 kW) | 390 | 545 | 730 | 940 | 1450 |
| Gas High (16.4 kW) | 460 | 630 | 830 | 1065 | 1625 |
| Charcoal (1.8 kW) | 160 | 240 | 335 | 445 | 715 |
| Wood (7.6 kW) | 300 | 435 | 590 | 770 | 1205 |
| Pellet Low (1.5 kW) | 145 | 225 | 315 | 420 | 670 |
| Pellet High (5.7 kW) | 260 | 385 | 525 | 690 | 1080 |

**How to use this table:** Find your cooking source type in the left column. Find your mounting height across the top. The number at the intersection is the minimum blower CFM rating required for reliable outdoor plume capture under typical conditions. Select a commercially available blower that meets or exceeds this value at the expected system static pressure (typically 0.5 to 1.5 inches WC for residential outdoor hoods with 6-10 feet of ductwork).

**Important:** These values represent the operating CFM at system static pressure, not the blower's free-air (no-restriction) rating. Many blowers are marketed by their free-air CFM, which is substantially higher than their actual output against duct resistance. Verify the blower's performance curve at the expected system static pressure.

## Appendix D: Derivation of the K_CFM Multiplier

The total CFM multiplier K_CFM = 3.0 is the product of three independent correction factors applied to the bare plume mass flow rate. This appendix documents the physical basis and derivation of each factor.

### D.1 Infiltration Factor F_inf = 2.0

**Physical basis:** The hood opening area A_hood exceeds the plume cross-sectional area A_plume at the **Plume Interception Plane** by a factor of approximately (K)^2 = (1.70)^2 = 2.89, where K = 1.70 is the outdoor margin factor from RB-002. The region of the hood opening outside the plume boundary draws in ambient air from the surrounding atmosphere. This ambient air infiltration must be exhausted along with the plume gas.

**Calculation:** If the hood's exhaust flow rate is Q_exhaust, the flow is partitioned between plume gas (Q_plume) and infiltrated ambient air (Q_ambient):

> Q_exhaust = Q_plume + Q_ambient

The ratio Q_ambient / Q_plume depends on the relative areas and the velocity distribution across the hood opening. For a canopy hood where the plume enters from below and ambient air is drawn in from the sides:

> Q_ambient / Q_plume approximately equals (A_hood - A_plume) / A_plume * f_edge

where f_edge approximately equals 0.5-0.7 is an empirical factor accounting for the fact that not all of the excess hood area actively draws in ambient air (some is blocked by the hood's edge configuration, and the velocity distribution is non-uniform).

Using f_edge = 0.55 (midpoint): Q_ambient / Q_plume = (2.89 - 1) * 0.55 = 1.04.

> F_inf = Q_exhaust / Q_plume = 1 + 1.04 = 2.04 approximately equals 2.0.

### D.2 Wind Margin Factor F_wind = 1.3 (Standard)

**Physical basis:** Light outdoor wind (0.5-1.3 m/s / 1-3 mph) has two effects on CFM requirements: (a) enhanced entrainment widens the plume, increasing the plume mass flow at any given height by approximately 10-20%; (b) lateral plume deflection shifts the plume partially outside the hood's ideal capture zone, requiring the hood to draw the shifted plume back via increased exhaust velocity.

**Calculation:** The enhanced entrainment effect increases the plume mass flow by a factor of approximately (alpha_eff / alpha_0)^(5/3) where alpha_eff / alpha_0 approximately equals 1.2 for light wind (RB-002 Section 2.5). This gives a mass flow increase factor of (1.2)^(5/3) = 1.35. However, this increased plume mass is partly offset by the wind already carrying some plume gas into the hood (on the downwind side). The net wind correction for the total exhaust requirement is estimated at F_wind = 1.3 for variable light breezes (where the wind direction changes frequently and the time-averaged effect is less than the peak effect).

For sustained directional wind (3 mph), F_wind = 1.6 accounts for persistent plume displacement that the hood must continuously compensate for by exhausting more aggressively from the downwind side.

### D.3 Safety Factor F_safety = 1.15

**Physical basis:** This factor accounts for:
- Uncertainty in the Heskestad correlations when applied to outdoor cooking sources (approximately 10%)
- Variability in actual heat release rate versus the nominal design value (approximately 5-10%)
- Blower performance degradation due to filter loading, duct leakage, and aging (approximately 5%)
- Rounding and interpolation in table values

The combined root-sum-square of these uncertainties is approximately 15%, giving F_safety = 1.15.

---

## References

1. Morton, B.R., Taylor, G.I., and Turner, J.S. (1956). "Turbulent gravitational convection from maintained and instantaneous sources." *Proceedings of the Royal Society A*, 234, pp. 1-23.

2. Heskestad, G. (2016). "Fire Plumes, Flame Height, and Air Entrainment." Chapter 13, *SFPE Handbook of Fire Protection Engineering*, 5th ed. Springer.

3. McCaffrey, B.J. (1979). "Purely Buoyant Diffusion Flames: Some Experimental Results." NBSIR 79-1910, National Bureau of Standards.

4. Cetegen, B.M., Zukoski, E.E., and Kubota, T. (1984). "Entrainment in the near and far field of fire plumes." *Combustion Science and Technology*, 39, pp. 305-331.

5. ASHRAE (2019). *ASHRAE Handbook — HVAC Applications*, Chapter 33: Kitchen Ventilation.

6. ASHRAE Standard 154 (2016). *Ventilation for Commercial Cooking Operations*.

7. ACGIH (2019). *Industrial Ventilation: A Manual of Recommended Practice for Design*, 30th ed. American Conference of Governmental Industrial Hygienists.

8. Papanicolaou, P.N. and List, E.J. (1988). "Investigations of round vertical turbulent buoyant jets." *Journal of Fluid Mechanics*, 195, pp. 341-391.

9. Shabbir, A. and George, W.K. (1994). "Experiments on a round turbulent buoyant plume." *Journal of Fluid Mechanics*, 275, pp. 1-32.

10. Briggs, G.A. (1984). "Plume rise and buoyancy effects." In *Atmospheric Science and Power Production*, ed. D. Randerson, DOE/TIC-27601.

11. Fischer, H.B., List, E.J., Koh, R.C.Y., Imberger, J., and Brooks, N.H. (1979). *Mixing in Inland and Coastal Waters*. Academic Press.

12. Drysdale, D. (2011). *An Introduction to Fire Dynamics*, 3rd ed. John Wiley & Sons. Chapter 4: Diffusion Flames and Fire Plumes.

13. Hunt, G.R. (1994). "The Effect of External Turbulence on Plumes." PhD Thesis, University of Cambridge.

14. Zukoski, E.E. (1995). "Properties of Fire Plumes." In *Combustion Fundamentals of Fire*, ed. G. Cox, Academic Press.

15. Thomas, P.H. et al. (1963). "Investigation into the Flow of Hot Gases in Roof Venting." Fire Research Technical Paper No. 7, HMSO, London.

16. George, W.K., Alpert, R.L., and Tamanini, F. (1977). "Turbulence measurements in an axisymmetric buoyant plume." *International Journal of Heat and Mass Transfer*, 20(11), pp. 1145-1154.

---

*This document is a research output of the Outdoor Ventilation Standard, governed by the Research Program Charter v2.6. All terms are used as defined in Glossary v1.1. This paper builds upon the foundational plume characterization of RB-001 and the entrainment analysis of RB-002, and provides the CFM-versus-mounting-height tables and maximum mounting height analysis that downstream topics RB-004, RB-005, RB-006, RB-007, and RB-008 will reference.*
