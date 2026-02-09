---
title: "RB-007: Failure Modes of Outdoor BBQ Hoods"
date: 2025-11-21
lastmod: 2025-12-08
draft: false
type: "research"
series: "Outdoor Ventilation Standard"
research_id: "RB-007"
priority: "P2 — Applied"
status: "Complete"
version: "1.0"
charter_version: "2.6"
glossary_version: "1.1"
diagram_standard_version: "2.1"
dependencies: "RB-003, RB-004, RB-005, RB-006"
downstream_topics:
  - "RB-008: CFM Requirements for Outdoor Cooking Ventilation"
  - "RB-009: Side Panel and Wind Baffle Effectiveness"
  - "RB-010: Gaps in Existing Standards, Codes, and Consumer Guidance"
description: "Catalogs and classifies the primary failure modes observed in outdoor BBQ hood installations. For each mode, identifies the root physical mechanism, the conditions that trigger it, the visible symptoms, the diagnostic criteria based on smoke escape patterns, and whether the failure is correctable post-installation or design-locked. Delivers a failure mode taxonomy, a diagnostic decision tree, and a corrective action matrix."
summary: "This paper synthesizes the plume physics (RB-001/RB-003), indoor-versus-outdoor gap analysis (RB-004), hood geometry analysis (RB-005), and wind interaction analysis (RB-006) into a comprehensive failure mode taxonomy for outdoor barbecue ventilation hoods. Six primary failure modes are identified: momentum-limited capture, geometry-induced spillage, wind-deflected plume escape, insufficient exhaust rate, excessive mounting height, and inadequate overhang. Each mode is characterized by its root physical mechanism, triggering conditions, observable smoke escape pattern, Froude number regime, and corrective action classification (correctable post-installation versus design-locked). The paper delivers diagnostic criteria enabling field identification of failure modes from visible symptoms, and a corrective action matrix ranking interventions by effectiveness and feasibility."
tags: ["failure analysis", "hood design", "diagnostics"]
categories: ["P2 — Applied"]
---

**Research Program:** Outdoor Ventilation Standard
**Charter Version:** 2.6
**Glossary Version:** 1.1
**Priority Tier:** P2 — Applied
**Author Role:** Hood Performance & Design Agent
**Date:** 2026-02-08
**Depends On:** RB-003: Velocity Decay and Near-Field vs. Far-Field Capture; RB-004: Why Indoor Ventilation Assumptions Fail Outdoors; RB-005: Impact of Hood Geometry on Capture Performance; RB-006: Wind Interaction and Cross-Flow Effects

---

## 1. Topic Definition

This paper catalogs and classifies the primary failure modes observed in outdoor barbecue hood installations. A failure mode is defined as a specific physical mechanism by which the **Buoyant Cooking Plume** escapes the hood's **Capture Envelope** and enters the **Missed Plume Region**, resulting in uncontrolled release of smoke, grease aerosol, and combustion byproducts into the surrounding environment.

The scope encompasses:

1. **Failure mode taxonomy.** Six primary failure modes are identified, each with a distinct root physical mechanism, a distinct set of triggering conditions, and a distinct observable symptom pattern. The six modes are: momentum-limited capture, geometry-induced spillage, wind-deflected plume escape, insufficient exhaust rate, excessive mounting height, and inadequate overhang.

2. **Root cause analysis.** For each failure mode, the underlying physics is traced to the specific plume parameter, hood parameter, or environmental condition that is out of specification. The analysis draws directly on the quantitative results of RB-003 (velocity decay and CFM requirements), RB-004 (indoor-versus-outdoor assumption failures), RB-005 (hood geometry effects), and RB-006 (wind interaction).

3. **Triggering condition identification.** For each failure mode, the specific parameter thresholds at which the mode activates are quantified. These thresholds are expressed in terms of measurable or estimable quantities: mounting height, hood width, exhaust CFM, wind speed, source heat release rate, and overhang distance.

4. **Observable symptom characterization.** Each failure mode produces a characteristic smoke escape pattern that can be observed visually during hood operation. This paper describes these patterns in sufficient detail to enable field diagnosis of the active failure mode from observation alone.

5. **Correctable versus design-locked classification.** Each failure mode is classified as either correctable post-installation (the homeowner or technician can modify the system to eliminate the failure) or design-locked (the failure is inherent to the installed hood's physical dimensions and cannot be remedied without replacing the hood or fundamentally reconfiguring the installation).

6. **Diagnostic decision tree.** A structured diagnostic procedure is provided for identifying the active failure mode(s) from observed symptoms, enabling targeted corrective action rather than general troubleshooting.

7. **Corrective action matrix.** For each failure mode, a ranked list of corrective interventions is provided, ordered by effectiveness and feasibility.

### Relationship to Prior Research

RB-003 established the quantitative relationship between plume velocity, mass flow rate, and mounting height, defining the CFM requirements for capture and identifying **Momentum-Limited Capture** as the condition where the hood's exhaust capacity is insufficient to ingest the plume. RB-004 identified six indoor capture mechanisms that are absent outdoors, explaining why indoor-rated hoods systematically fail in outdoor environments. RB-005 analyzed how each geometric parameter of the hood (overhang, lip height, baffle configuration, canopy shape) affects the **Effective Capture Area** and **Capture Envelope**, and established that geometric coverage is more important than exhaust velocity. RB-006 quantified plume deflection as a function of wind speed and source strength, identifying critical wind speeds for capture failure and proposing the four-tier wind exposure classification.

This paper synthesizes these findings into an integrated failure mode framework. Where the predecessor papers each analyzed one dimension of the capture problem (velocity/CFM, geometry, wind), this paper identifies the specific combinations of parameter deficiencies that produce each distinct failure mode and provides the diagnostic and corrective framework for practitioners.

### Problem Framing

The central practical problem is this: a homeowner or installer observes smoke escaping from around the hood during cooking. The smoke escape may be continuous, intermittent, directional, or diffuse. The question is: why is the hood failing, and what can be done about it?

The answer depends on which failure mode is active. Different failure modes require different corrective actions. Increasing the blower speed (more CFM) will help if the failure is due to insufficient exhaust rate, but will not help if the failure is due to inadequate overhang (the plume is beyond the hood's physical reach). Adding side panels will help if the failure is due to wind-deflected plume escape, but will not help if the mounting height is excessive (the plume has expanded beyond the hood at any wind speed). Identifying the correct failure mode is essential for prescribing the correct remedy.

This paper provides the diagnostic framework for that identification.

---

## 2. Relevant Physical Principles

### 2.1 The Capture Condition: A Multi-Parameter Requirement

Successful capture of the **Buoyant Cooking Plume** by an outdoor hood requires the simultaneous satisfaction of four conditions, each established in the predecessor papers:

**Condition 1 — Geometric containment (RB-005).** The hood's physical footprint at the **Plume Interception Plane** must fully encompass the plume cross-section, including margin for turbulent fluctuations and wind deflection. The **Effective Capture Area** (the fraction of the hood face that actively contributes to capture) must exceed the plume cross-sectional area. Failure of this condition produces geometry-induced spillage.

**Condition 2 — Volumetric sufficiency (RB-003).** The hood's exhaust rate must equal or exceed the total plume mass flow rate at the mounting height, plus the ambient air infiltrated through the gap between the plume boundary and the hood perimeter. The K_CFM multiplier of 3.0 (standard outdoor) or 3.68 (sustained light wind) applied to the bare plume mass flow rate ensures volumetric sufficiency. Failure of this condition produces insufficient exhaust rate failure or **Momentum-Limited Capture**.

**Condition 3 — Edge capture adequacy (RB-003, RB-005).** The hood-induced inward velocity at the hood perimeter must be sufficient to draw in the slow-moving plume periphery and resist ambient crossflows. The plume edge velocity is only 6% of centerline velocity (RB-003 Section 3.2), making the plume periphery vulnerable to even light wind. The hood's lip, baffling, and excess exhaust flow determine the edge capture velocity. Failure produces **Momentum-Limited Capture** at the hood edges.

**Condition 4 — Wind tolerance (RB-006).** The hood's overhang, CFM margin, and physical shielding (panels, walls) must accommodate the lateral plume deflection caused by ambient wind. At a given wind speed, the plume centerline shifts downwind by a distance that depends on the wind speed, mounting height, and plume strength. If the deflection exceeds the available downwind overhang, the plume exits the **Capture Envelope**. Failure produces wind-deflected plume escape.

A failure mode is activated when one or more of these conditions is not met. In many real installations, multiple conditions fail simultaneously, producing compound failure modes. The diagnostic challenge is to identify the primary failure from its observable symptoms, because the corrective action differs for each.

### 2.2 The Plume at the Interception Plane: A Recapitulation

At the **Plume Interception Plane** (the horizontal plane at the hood's lower face), the **Buoyant Cooking Plume** has the following properties, as established in RB-001 and RB-003:

- **Centerline velocity** u_0 = 1.03 * Q_c^(1/3) * (z - z_0)^(-1/3), ranging from 1.0 to 2.8 m/s (200 to 560 ft/min) at standard mounting heights. This velocity decays as z^(-1/3) — slowly relative to other plume parameters.

- **Plume capture diameter** d_capture = 0.48 * (z - z_0) + D_eff, ranging from 31 to 61 inches at standard mounting heights for common cooking sources. This grows linearly with height.

- **Mass flow rate** m_dot_p = 0.071 * Q_c^(1/3) * z^(5/3) + 0.0018 * Q_c, growing as z^(5/3) — the most consequential scaling relationship for hood design.

- **Gaussian velocity profile.** Velocity falls from u_0 at the centerline to 37% of u_0 at the velocity half-width (b_u = 0.144 * (z - z_0)) and to only 6% at the capture boundary (2 * b_T). The plume edge is effectively stagnant.

- **Temperature excess** Delta_T_0 = 25.0 * Q_c^(2/3) * (z - z_0)^(-5/3), ranging from 8 to 177 degrees C above ambient. Decays as z^(-5/3) — very rapidly, meaning the plume becomes thermally indistinguishable from ambient air at greater heights.

These properties define the "target" that the hood must intercept. Each failure mode corresponds to a specific mismatch between one or more of these plume properties and the corresponding hood capability.

### 2.3 The Indoor-to-Outdoor Performance Cliff

RB-004 identified a systematic performance deficit when indoor-rated hoods are applied outdoors. Six indoor capture mechanisms (wall-guided airflow, ceiling jet recovery, room pressurization, controlled makeup air, absence of crosswind, and enclosed dilution volume) are absent in outdoor environments. Their removal imposes a combined penalty of 1.7 to 2.5 times in required CFM and 1.3 to 1.7 times in required hood dimensions.

This performance cliff is not a single failure mode. Rather, it is the underlying cause of most outdoor hood failures: the hood was specified using indoor assumptions (directly from ASHRAE 154, IMC Chapter 5, or UL 710 test results), and the resulting system is systematically undersized and underpowered for the outdoor environment. The specific failure mode that manifests (insufficient exhaust, inadequate overhang, or wind vulnerability) depends on which indoor assumption has the largest impact in the particular installation.

### 2.4 Wind as a Failure Mode Amplifier

RB-006 established that wind acts on the plume through three mechanisms: lateral deflection, enhanced entrainment (widening), and structural disruption. The crosswind Froude number Fr = U_w / u_0(z) governs the regime:

- Fr < 0.3: buoyancy-dominated; near-vertical rise; small deflection
- 0.3 < Fr < 1.0: transitional; significant bending; counter-rotating vortex pair developing
- 1.0 < Fr < 3.0: wind-dominated; strongly bent; plume intermittently coherent
- Fr > 3.0: disrupted; plume cannot maintain columnar structure

Wind does not create a separate failure mode in isolation. Rather, it amplifies existing marginal conditions. A hood that is marginally adequate in still air (narrow overhang, minimum CFM, borderline mounting height) will fail in even light wind. A hood that is robustly specified (generous overhang, adequate CFM, low mounting) tolerates moderate wind without failure. The wind exposure classification from RB-006 (Sheltered, Moderate, Exposed, Severe) determines the margin required.

---

## 3. Observed or Expected Behavior

This section is the quantitative core of the paper. It presents the failure mode taxonomy with diagnostic criteria, root cause analysis for each mode, and the correctable-versus-design-locked classification.

### 3.1 Failure Mode Taxonomy: Overview

Six primary failure modes are identified. They are listed in order of decreasing frequency in residential outdoor installations, based on the physical analysis of typical installation parameters.

#### Table 3.1: Failure Mode Summary

| ID | Failure Mode | Root Physical Mechanism | Primary Deficient Parameter | Frequency Rank |
|---|---|---|---|---|
| FM-1 | Inadequate Overhang | Hood footprint smaller than plume cross-section at the **Plume Interception Plane** | Hood width/depth relative to plume diameter | 1st (most common) |
| FM-2 | Excessive Mounting Height | All plume parameters degraded by height: wider plume, higher mass flow, lower velocity, greater wind vulnerability | Mounting height z | 2nd |
| FM-3 | Insufficient Exhaust Rate | Exhaust CFM below plume mass flow plus infiltration requirement | Hood CFM relative to required K_CFM * m_dot_p | 3rd |
| FM-4 | Wind-Deflected Plume Escape | Ambient wind displaces plume centerline beyond hood boundary | Wind speed relative to critical wind speed for the installation | 4th |
| FM-5 | Geometry-Induced Spillage | Poor internal hood design (low **Effective Capture Area**) causes capture failure despite adequate external dimensions | eta_uniformity; baffle configuration; lip height | 5th |
| FM-6 | **Momentum-Limited Capture** | Hood-induced edge velocity insufficient to draw in plume periphery or resist crossflow | Edge capture velocity v_edge relative to plume edge velocity and wind | 6th |

**Note on compound failures.** In many real installations, multiple failure modes are active simultaneously. The most common compound failure is FM-1 (inadequate overhang) combined with FM-3 (insufficient exhaust rate), which occurs when an indoor-rated hood is used outdoors without correction. FM-2 (excessive mounting height) compounds all other modes by degrading every plume parameter simultaneously. FM-4 (wind) amplifies any pre-existing marginal condition.

### 3.2 FM-1: Inadequate Overhang

#### 3.2.1 Root Physical Mechanism

The hood's physical footprint at the **Plume Interception Plane** is smaller than the plume's expanded cross-section at that height. The plume, which has grown from its source diameter D_eff to a capture diameter of d_capture = 0.48 * (z - z_0) + D_eff at the hood face, extends beyond the hood boundary on one or more sides. The plume gas in this protruding region is in the **Missed Plume Region** and cannot be captured regardless of the hood's exhaust rate.

This is the most fundamental and most common failure mode. It is a pure geometry failure: the hood is physically too small for the plume it must capture.

#### 3.2.2 Triggering Conditions

FM-1 is triggered when the hood overhang per side is less than the minimum required to contain the plume:

> OH_installed < OH_min = (d_capture - W_cooking) / 2

From RB-005 Table 3.1a, the minimum overhang per side ranges from 3 to 16 inches depending on source type and mounting height. The recommended overhang (with outdoor margin K = 1.70) ranges from 11 to 26 inches (RB-005 Table 3.1b).

**Typical triggering scenario:** A homeowner installs a 42-inch or 48-inch outdoor hood over a medium gas grill (24-inch cooking surface) at 30-inch mounting height. The plume capture diameter at 30 inches is 41 inches (RB-001 Table 3.6), requiring a minimum hood width of 41 inches (zero margin) or a recommended width of 57 inches (K = 1.70 margin per RB-005 Table 3.8b). The 48-inch hood provides only 12 inches of overhang per side versus the recommended 17 inches. The plume extends beyond the hood by approximately 5 inches per side under still-air conditions, and substantially more in any wind.

**Quantitative threshold from RB-005:** At 30-inch mounting height, no standard consumer hood (36 to 48 inches wide) provides the recommended overhang for any source type larger than a small gas grill.

#### 3.2.3 Observable Symptoms

- **Smoke escape pattern:** Continuous, symmetric escape from all four sides (or from the front and sides in wall-mount installations). Smoke rises around the hood perimeter in a roughly uniform curtain.
- **Wind sensitivity:** Smoke escape worsens in any wind, with the downwind side showing heavier escape. But escape is visible even in still air.
- **Response to blower speed increase:** Increasing the blower speed (if multi-speed) provides minimal improvement. The plume at the hood edges is beyond the hood's physical reach; additional suction cannot extend the hood's capture boundary.
- **Spatial pattern:** Escape is heaviest at the hood corners, where both the hood's suction field and the plume's velocity are at their minimum.

#### 3.2.4 Diagnostic Criterion

**If smoke escapes symmetrically from around the hood perimeter in still-air conditions, and increasing the blower speed does not substantially reduce the escape, FM-1 (inadequate overhang) is the primary active failure mode.**

#### 3.2.5 Correctable Versus Design-Locked

**Design-locked.** The hood's physical dimensions cannot be changed post-installation without replacing the hood. FM-1 is a design failure that must be corrected by installing a wider and/or deeper hood.

**Partial mitigation (correctable):** Adding a 3 to 4-inch perimeter lip to an existing flat-bottom hood extends the **Capture Envelope** vertically and increases edge velocity by 60 to 100% (RB-005 Section 3.3), partially compensating for 3 to 5 inches of insufficient overhang. Adding side panels blocks lateral plume escape on the panel sides, effectively extending the capture boundary in those directions. These mitigations are correctable post-installation but do not fully resolve the underlying geometric deficiency.

### 3.3 FM-2: Excessive Mounting Height

#### 3.3.1 Root Physical Mechanism

Mounting height is the single most influential variable in outdoor hood capture performance (RB-001 Section 4.1). Every increment of mounting height degrades all plume parameters simultaneously:

- Plume diameter grows linearly with height, requiring a proportionally larger hood
- Mass flow rate grows as z^(5/3), requiring exponentially more CFM
- Centerline temperature excess drops as z^(-5/3), reducing the plume's thermal coherence and buoyancy-driven self-delivery
- Wind vulnerability increases because the plume spends more time traversing the exposed height, accumulating more lateral deflection

From RB-003 Table 3.10, moving from 18 inches to 48 inches of mounting height increases CFM requirements by a factor of 4.0, increases hood width by 41%, and triples wind deflection — while reducing centerline velocity by only 26%.

#### 3.3.2 Triggering Conditions

FM-2 is triggered when the mounting height exceeds the maximum practical height for the installed hood and blower capacity. From RB-003 Table 3.7a:

| Source Type | Max Height at 600 CFM | Max Height at 900 CFM | Max Height at 1200 CFM |
|---|---|---|---|
| Gas Small (5.1 kW) | 33" | 44" | 52" |
| Gas Medium (8.2 kW) | 30" | 39" | 47" |
| Gas Large (12.3 kW) | 26" | 35" | 42" |
| Gas High-Output (16.4 kW) | 23" | 31" | 39" |
| Charcoal (1.8 kW) | 43" | 55" | 66" |

**Typical triggering scenario:** A hood is mounted at 36 inches to provide operator head clearance or to accommodate a tall grill body. The grill is a large gas model (Q_c = 12.3 kW). At 36 inches, the required CFM is 937 (RB-003 Table 3.8a) and the recommended hood width is 66 inches (RB-005 Table 3.8c). The installed 900 CFM blower is marginally inadequate, and the 54-inch hood is significantly undersized. The mounting height alone has pushed the installation beyond the capability of the hardware.

#### 3.3.3 Observable Symptoms

- **Smoke escape pattern:** Diffuse, general escape from around the entire hood perimeter. Smoke appears to "mushroom" outward at the hood level before drifting upward and away. The plume is visibly wide and slow-moving at hood height.
- **Plume appearance:** The plume is barely visible as a coherent thermal column at the hood face. In warm ambient conditions (above approximately 25 degrees C), the temperature excess at 48 inches is so low (8 to 36 degrees C above ambient per RB-001 Table 3.4) that the plume may not produce visible condensation or shimmer. Smoke particulates are present but dispersed over a wide area.
- **Response to blower speed increase:** Moderate improvement when blower speed is increased, because the plume mass flow is the binding constraint and more CFM addresses this directly. However, improvement plateaus quickly because the plume is geometrically wider than the hood.
- **Comparison across heights:** If the grill can be temporarily raised (using blocks or a temporary surface), moving it 6 inches closer to the hood produces a visible, immediate improvement in capture. This height sensitivity is the signature of FM-2.

#### 3.3.4 Diagnostic Criterion

**If smoke escape is diffuse and general (not directional), the plume appears wide and weak at hood height, and temporarily reducing the distance between the cooking surface and the hood produces noticeable improvement, FM-2 (excessive mounting height) is the primary active failure mode.**

#### 3.3.5 Correctable Versus Design-Locked

**Partially correctable.** Mounting height can sometimes be reduced post-installation by:

- Lowering the hood (if structural mounting allows adjustment)
- Raising the cooking surface (placing the grill on a platform or selecting a grill with a taller body)
- Replacing the grill stand with a shorter one

If the hood mounting position is fixed (e.g., permanently attached to a masonry structure), the mounting height is design-locked and the only remedies are increasing the CFM (if the blower can be upgraded) or adding wind shielding to compensate.

**Recommended corrective priority:** Reduce mounting height first. Each 6-inch reduction in mounting height reduces the required CFM by 22 to 44% (RB-003 Table 3.10b) and reduces the required hood width by approximately 4 inches.

### 3.4 FM-3: Insufficient Exhaust Rate

#### 3.4.1 Root Physical Mechanism

The hood's exhaust volumetric flow rate (CFM) is less than the total air volume that must be removed to capture the plume. The required exhaust rate is not merely the plume mass flow rate at the **Plume Interception Plane**; it is the plume mass flow multiplied by the factors for ambient air infiltration, wind margin, and safety:

> CFM_required = CFM_plume * K_CFM

where K_CFM = 3.0 for standard outdoor conditions or K_CFM = 3.68 for sustained light wind (RB-003 Section 3.6).

When CFM_installed < CFM_required, the hood cannot ingest all the air arriving at the **Plume Interception Plane**. The excess must escape. By conservation of mass, the fraction of the plume that escapes is approximately:

> f_escape approximately equals 1 - (CFM_installed / CFM_required)

#### 3.4.2 Triggering Conditions

FM-3 is triggered when the installed blower CFM (at operating static pressure) is less than the required CFM from RB-003 Tables 3.8a or 3.8b. Common triggers include:

- **Indoor-rated blower applied outdoors.** A 400 CFM blower (adequate for a medium gas grill indoors per ASHRAE 154) is installed outdoors where 609 CFM is required (RB-003 Table 3.8a at 30 inches, K_CFM = 3.0). The blower provides only 66% of the required capacity.

- **Blower operating against excessive static pressure.** A blower rated at 900 CFM at 0 inches of water column may deliver only 500 to 600 CFM against the static pressure of a long or restrictive duct run (0.5 to 1.5 inches WG). The effective CFM at operating conditions is below the requirement.

- **Dirty or grease-loaded filters.** Accumulated grease on the filters increases the flow resistance, reducing the delivered CFM below the clean-filter rating. Over time, a system that was adequate when new may drift into FM-3 territory as filters load.

**Quantitative threshold from RB-003:** For a medium gas grill at 30 inches, the minimum CFM is 609 (standard outdoor) or 747 (light wind). A blower delivering less than these values at operating static pressure will exhibit FM-3.

#### 3.4.3 Observable Symptoms

- **Smoke escape pattern:** Escape primarily from the front and sides of the hood (the hood perimeter regions farthest from the exhaust collar). The center of the hood appears to capture adequately, but the edges leak.
- **Edge-dominant escape:** Smoke curls outward from beneath the hood perimeter, not from above the hood. The plume enters the hood's footprint but is not fully ingested — the excess spills at the edges.
- **Response to blower speed increase:** Substantial improvement when blower speed is increased to a higher setting (if multi-speed). This is the distinguishing response: CFM-limited failure responds directly to increased exhaust rate.
- **Filter condition correlation:** Escape worsens when filters are dirty and improves immediately after filter cleaning or replacement. This correlation is a strong indicator of FM-3.

#### 3.4.4 Diagnostic Criterion

**If smoke escapes primarily from the hood edges (not from beyond the hood boundary), escape increases progressively during cooking sessions as filters load, and increasing blower speed produces immediate and proportional improvement, FM-3 (insufficient exhaust rate) is the primary active failure mode.**

#### 3.4.5 Correctable Versus Design-Locked

**Correctable.** FM-3 is the most readily correctable failure mode:

1. **Clean or replace filters.** The simplest intervention. Restores full CFM to the clean-filter rated value.
2. **Upgrade blower.** Replace the existing blower with a higher-CFM unit. Requires verification that the existing ductwork can accommodate the higher flow without excessive static pressure.
3. **Reduce duct restriction.** Shorten the duct run, increase duct diameter, remove unnecessary elbows, or eliminate transitions that create flow restriction. Each eliminated 90-degree elbow recovers approximately 25 to 50 CFM depending on duct size and flow rate.
4. **Operate blower on highest speed.** If a multi-speed blower is installed and is habitually operated on a lower setting, switching to the highest setting may resolve the deficiency.

**Caveat:** Increasing CFM provides diminishing returns when the hood is also undersized (FM-1). If FM-1 and FM-3 are both active, increasing CFM will not resolve the geometric deficiency.

### 3.5 FM-4: Wind-Deflected Plume Escape

#### 3.5.1 Root Physical Mechanism

Ambient wind imposes horizontal momentum on the rising **Buoyant Cooking Plume**, displacing the plume centerline downwind by a distance that increases with wind speed and mounting height and decreases with plume strength (RB-006 Section 3.1). When the deflection exceeds the available overhang on the downwind side, the plume core exits the hood boundary on that side, entering the **Missed Plume Region**.

Additionally, wind enhances entrainment (RB-006 Section 2.3), widening the plume beyond its still-air diameter, and at higher wind speeds, the plume develops counter-rotating vortex pair structure (RB-006 Section 2.4) or is fully disrupted (RB-006 Section 2.5). These phenomena compound the deflection effect, making the plume both wider and offset.

This failure mode represents **Wind-Affected Plume Behavior** in its most consequential form for hood capture.

#### 3.5.2 Triggering Conditions

FM-4 is triggered when the plume deflection exceeds the available downwind overhang:

> delta_x(z) = 0.35 * U_w * z / u_0(z) > OH_downwind

From RB-006 Tables 3.4a and 3.4b, the critical wind speeds for various thresholds (25% plume escape, centerline exit, 50% escape) are:

**Gas Grill Medium at 30 inches with recommended hood (OH = 0.42 m):**
- 25% escape at 6.7 mph
- Centerline exit at 9.7 mph
- 50% escape at 12.6 mph

**Charcoal Kettle at 30 inches with recommended hood (OH = 0.52 m):**
- 25% escape at 5.0 mph
- Centerline exit at 6.7 mph
- 50% escape at 8.4 mph

**Pellet Smoker Low at 30 inches with recommended hood (OH = 0.41 m):**
- 25% escape at 4.2 mph
- Centerline exit at 5.8 mph
- 50% escape at 7.3 mph

With the gust factor of G = 1.7, a site with a mean wind of 5 mph experiences peak deflections corresponding to 8.5 mph, which exceeds the 25% escape threshold for all source types at 30 inches.

**Typical triggering scenario:** The hood captures well on calm evenings but fails noticeably when an afternoon breeze of 5 to 8 mph develops. The failure correlates with wind speed and direction, not with cooking intensity.

#### 3.5.3 Observable Symptoms

- **Smoke escape pattern:** Strongly directional. Smoke escapes predominantly from one side of the hood — the downwind side. The upwind side may show clean capture while the downwind side releases a visible plume of escaping smoke.
- **Intermittency.** Escape is intermittent, correlating with wind gusts. During lulls, capture appears adequate. During gusts, a visible burst of smoke escapes the downwind edge. This gust-correlated intermittency is the hallmark of FM-4.
- **Direction tracking.** As wind direction shifts, the escape pattern rotates to follow. The escape always appears on the side facing away from the wind.
- **Severity scaling with wind speed.** Escape worsens progressively as wind increases. In light variable breeze (1 to 3 mph), escape may be minor. In sustained breeze (5 to 8 mph), escape becomes significant. Above 10 mph, capture failure may be nearly complete.
- **Response to blower speed increase:** Marginal improvement. Increasing CFM slightly increases edge velocity on the downwind side, but the plume has been displaced beyond the hood's geometric reach. The deflection is a geometric displacement, not a velocity insufficiency.

#### 3.5.4 Diagnostic Criterion

**If smoke escape is directional (one side of the hood), intermittent and correlated with wind gusts, and tracks with wind direction changes, FM-4 (wind-deflected plume escape) is the primary active failure mode.**

#### 3.5.5 Correctable Versus Design-Locked

**Correctable.** FM-4 is the failure mode most amenable to post-installation mitigation:

1. **Add side panels (most effective single intervention).** Full side panels on both sides of the hood reduce the effective wind speed at the plume by 40 to 60% (RB-006 Section 3.9.1), effectively moving the installation down one wind exposure class. Side panels recover approximately 15 to 20 percentage points of capture efficiency at 5 mph.

2. **Add rear panel or exploit existing wall.** A rear wall or panel reduces the effective wind speed by 60 to 80% for wind approaching from behind the grill (RB-006 Section 3.9.2). Combined with side panels, this provides three-sided protection that achieves near-still-air performance at 5 mph.

3. **Increase CFM.** Partial compensation is available by increasing CFM (from K_CFM = 3.0 to K_CFM = 5.4 at 5 mph per RB-006 Section 3.9.3), providing approximately 80 to 85% capture. However, CFM alone cannot fully compensate above approximately 5 mph.

4. **Reorient the grill.** Place the grill so that the hood's longest dimension is parallel to the prevailing wind direction, maximizing the available downwind overhang (RB-006 Section 3.9.4). For rectangular hoods where width exceeds depth by more than 20%, this can improve the critical wind speed by 30 to 55%.

5. **Reduce mounting height.** Each 6-inch reduction in mounting height reduces wind deflection by approximately 25% (RB-006 Tables 3.2a through 3.2h).

### 3.6 FM-5: Geometry-Induced Spillage

#### 3.6.1 Root Physical Mechanism

The hood has adequate external dimensions (its total face area exceeds the plume cross-section at the **Plume Interception Plane**), but its internal design produces a non-uniform velocity distribution that concentrates suction at the center while leaving the perimeter with inadequate capture velocity. The **Effective Capture Area** — the fraction of the total hood face where the local face velocity is sufficient to draw in plume gas — is significantly smaller than the total face area.

From RB-005 Section 2.5 and Table 3.6.4:

| Configuration | eta_uniformity | Effective Capture Area (% of total) |
|---|---|---|
| Flat bottom, no baffles, single center exhaust | 0.40 - 0.55 | 40 - 55% |
| Flat bottom, full-face grease filter | 0.55 - 0.70 | 55 - 70% |
| Tapered canopy with full baffle set and lip | 0.75 - 0.85 | 75 - 85% |

A 57-inch x 53-inch hood with eta_uniformity = 0.45 (flat bottom, no baffles) has an **Effective Capture Area** of only 1,360 square inches — barely equal to the 1,320 square-inch plume cross-section of a medium gas grill at 30 inches. Despite having a total face area of 3,021 square inches (more than double the plume), the hood captures only marginally because its suction is concentrated in the center.

#### 3.6.2 Triggering Conditions

FM-5 is triggered when:

> A_eff = A_hood * eta_uniformity < A_plume

This is most likely when:
- The hood uses a single center exhaust collar with no internal baffles
- No grease filters are installed (or filters cover only a portion of the hood face)
- The hood is flat-bottomed (no taper to redirect peripheral airflow)
- The hood is large (60+ inches), where the path-length variation from center to corners is greatest

#### 3.6.3 Observable Symptoms

- **Smoke escape pattern:** Escape from the hood corners and mid-edge regions, while the center of the hood captures cleanly. Smoke curls outward from the hood perimeter, particularly at the four corners where both hood suction and plume velocity are at their minimum.
- **Center-dominated capture.** Directly beneath the hood, directly above the grill center, capture appears strong. The failure is at the periphery only.
- **Still-air occurrence.** Unlike FM-4 (which requires wind), FM-5 occurs in still air. The escape pattern does not correlate with wind direction — it is symmetric and corner-dominated.
- **Response to blower speed increase:** Moderate improvement. Increasing CFM raises the velocity at all points on the hood face, including the underperforming periphery. The improvement is real but sub-linear: doubling CFM does not double the capture at the corners because the velocity distribution ratio (center-to-corner) is unchanged.

#### 3.6.4 Diagnostic Criterion

**If smoke escapes primarily from the hood corners and mid-edges in still air, the center of the hood captures adequately, and the escape pattern is symmetric (not directional), FM-5 (geometry-induced spillage) is the primary active failure mode.**

#### 3.6.5 Correctable Versus Design-Locked

**Partially correctable.**

1. **Install or upgrade grease filters to full-face coverage.** If the hood has partial or no grease filters, installing full-face baffle or mesh filters that span the entire hood opening improves eta_uniformity from 0.40-0.55 to 0.55-0.70, a meaningful gain.

2. **Add a perimeter lip.** A 3-inch perimeter lip increases edge velocity by 60% (RB-005 Section 3.3.2) and extends the **Capture Envelope** vertically. This is a cost-effective retrofit.

3. **Increase CFM.** Partial compensation for poor velocity distribution. Effective up to a point, but cannot fully substitute for proper baffling.

**Design-locked aspects:** The hood's canopy shape (flat versus tapered), exhaust collar location (center versus offset), and internal divider configuration cannot be changed without replacing the hood. A flat-bottom, single-collar, unbaffled hood is inherently limited to eta_uniformity of approximately 0.55 even with full-face filters.

### 3.7 FM-6: Momentum-Limited Capture

#### 3.7.1 Root Physical Mechanism

**Momentum-Limited Capture** occurs when the hood's exhaust-induced inward momentum at its perimeter is insufficient to overcome the combined outward momentum of the plume periphery and the ambient crosswind. This is the condition identified in RB-003 Section 2.4 and characterized quantitatively in RB-003 Tables 3.4a and 3.4b.

For a canopy hood over a buoyant plume, the plume's upward momentum assists capture (the plume rises into the hood). The critical momentum balance is at the hood edges, where the plume's radial velocity (which is outward due to plume expansion) plus any wind component must be overcome by the hood's inward suction.

The edge capture velocity is:

> v_edge = (Q_exhaust - Q_plume) / (P_hood * h_eff)

where P_hood is the hood perimeter, h_eff is the effective capture depth (approximately 0.20 m for typical canopy hoods), and (Q_exhaust - Q_plume) is the excess exhaust flow that draws in ambient air from beyond the plume boundary.

FM-6 is distinct from FM-3 (insufficient exhaust rate) in that the total CFM may be adequate for the plume mass flow, but the distribution of that CFM across the hood perimeter produces insufficient edge velocity to resist the plume's natural lateral expansion and any ambient crossflow.

#### 3.7.2 Triggering Conditions

FM-6 is triggered when v_edge < v_threshold, where:
- v_threshold = 0.15 m/s (30 fpm) for still-air edge capture
- v_threshold = U_wind_component for wind-exposed edge capture

From RB-003 Table 3.4b, at K_CFM = 3.0 exhaust rate:
- Charcoal kettle at 18 inches: v_edge = 0.12 m/s (below still-air threshold)
- Pellet smoker low at 18 inches: v_edge = 0.10 m/s (below still-air threshold)

These weak-plume sources at low mounting heights produce conditions where the hood's total CFM is adequate for the plume mass flow, but the resulting edge velocity is too low to draw in the diffuse plume periphery. The plume "leaks" at the edges even in still air.

**Typical triggering scenario:** A charcoal grill or pellet smoker operates under a hood that is adequately sized for a gas grill of equivalent BTU rating. The charcoal plume, with its low convective fraction (chi_c = 0.40 versus 0.70 for gas), produces a weaker, more diffuse plume that the hood's edge velocity cannot fully contain. This is a manifestation of the "charcoal paradox" identified in RB-001 Section 4.3.

#### 3.7.3 Observable Symptoms

- **Smoke escape pattern:** Gentle, diffuse leakage from the hood perimeter — not a sharp plume of escaping smoke, but a slow, steady seepage. The smoke appears to "ooze" outward from beneath the hood edges rather than escaping in a coherent stream.
- **Low-velocity escape.** The escaping smoke moves slowly and drifts rather than being propelled outward. This contrasts with FM-1 (where the plume's own velocity carries it past the hood) and FM-4 (where wind drives the escape).
- **Source-type correlation.** FM-6 is most common with charcoal grills and low-output pellet smokers. Gas grill installations at the same mounting height and hood size may not exhibit this failure mode.
- **Response to blower speed increase:** Moderate to good improvement. Increasing CFM directly increases v_edge, which is the deficient parameter. The relationship is approximately linear: 50% more CFM produces approximately 50% higher v_edge.

#### 3.7.4 Diagnostic Criterion

**If smoke escape is diffuse and slow (seeping, not streaming), occurs in still air primarily with charcoal or pellet smoker sources, and responds well to increased blower speed, FM-6 (Momentum-Limited Capture) is the primary active failure mode.**

#### 3.7.5 Correctable Versus Design-Locked

**Correctable.** FM-6 responds to several post-installation interventions:

1. **Increase CFM.** Directly increases v_edge. The most effective single intervention for FM-6.
2. **Add perimeter lip.** A 3-inch lip increases edge velocity by 60% at the same CFM (RB-005 Section 3.3.2), equivalent to a 60% increase in CFM for edge capture purposes.
3. **Reduce mounting height.** At lower heights, the plume is narrower and more coherent, requiring less edge velocity to contain.
4. **Add side panels.** For wind-exacerbated FM-6, side panels block the wind component and reduce the v_threshold requirement.

### 3.8 Failure Mode Interaction and Compound Failures

Real-world installations frequently exhibit multiple simultaneous failure modes. The following table identifies the most common compound failures and their diagnostic signatures.

#### Table 3.8: Common Compound Failure Modes

| Compound | Component Modes | Root Cause | Diagnostic Signature | Corrective Priority |
|---|---|---|---|---|
| Indoor hood applied outdoors | FM-1 + FM-3 | Indoor-rated hood used without outdoor correction (RB-004) | Symmetric perimeter escape in still air; moderate improvement with increased CFM but cannot eliminate escape | Replace hood (FM-1 is design-locked); upgrade blower (FM-3 is correctable) |
| High mount with undersized hood | FM-1 + FM-2 | Excessive height forces wide plume into undersized hood | Wide, diffuse escape from all sides; height reduction produces dramatic improvement | Reduce mounting height first (addresses both FM-1 and FM-2 simultaneously) |
| Marginal system in wind | FM-3 + FM-4 | System is borderline in still air and fails when wind amplifies the deficiency | Still-air capture is adequate (80-90%); wind produces directional, intermittent escape | Add side panels (FM-4); increase CFM (FM-3) |
| Charcoal on gas-rated system | FM-1 + FM-6 | Hood sized for gas grill plume dimensions; charcoal's wider source diameter and lower edge velocity cause escape | Symmetric, slow-seeping escape, worse than with gas grill on same hood | Replace hood with wider model (FM-1); increase CFM (FM-6); add lip (both) |
| All modes active | FM-1 + FM-2 + FM-3 + FM-4 | Severely undersized indoor hood at high mount in wind-exposed location | Heavy, continuous escape from all directions; no improvement with any single intervention | Full system replacement: larger hood, more powerful blower, lower mounting, wind protection |

### 3.9 Correctable Versus Design-Locked Classification Summary

#### Table 3.9: Failure Mode Classification

| Failure Mode | Classification | Correctable Interventions | Design-Locked Aspects |
|---|---|---|---|
| FM-1: Inadequate Overhang | Design-locked (primary); partially mitigable | Add lip (+3-5" effective overhang); add side panels; add rear panel | Hood physical dimensions |
| FM-2: Excessive Mounting Height | Partially correctable | Lower hood; raise grill surface; use platform | Fixed structural mounting |
| FM-3: Insufficient Exhaust Rate | Fully correctable | Clean filters; upgrade blower; reduce duct restriction; operate on highest speed | None (always correctable with equipment changes) |
| FM-4: Wind-Deflected Plume Escape | Fully correctable | Add side panels; add rear panel; reorient grill; increase CFM; reduce mounting height | None (always correctable with physical modifications) |
| FM-5: Geometry-Induced Spillage | Partially correctable | Install full-face filters; add lip; increase CFM | Canopy shape; exhaust collar position; internal geometry |
| FM-6: Momentum-Limited Capture | Fully correctable | Increase CFM; add lip; reduce mounting height; add side panels | None (always correctable with equipment or configuration changes) |

**Key finding:** Of the six failure modes, three are fully correctable post-installation (FM-3, FM-4, FM-6), one is design-locked but partially mitigable (FM-1), and two are partially correctable depending on structural constraints (FM-2, FM-5). The most consequential design-locked failure is FM-1 (inadequate overhang), which cannot be remedied without replacing the hood.

### 3.10 Diagnostic Decision Tree

The following structured procedure enables identification of the primary active failure mode from field observation during hood operation.

**Step 1 — Observe smoke escape pattern in still air (blower on maximum, no wind, cooking at normal intensity).**

- If escape is **absent or negligible**: No failure mode active in still air. Proceed to Step 5 (wind test).
- If escape is **present**: Proceed to Step 2.

**Step 2 — Characterize the escape pattern geometry.**

- If escape is **symmetric** (all sides, especially corners): Proceed to Step 3.
- If escape is **asymmetric** (one side dominant): Suspect residual wind. Verify still-air conditions and repeat. If truly still and asymmetric, suspect non-uniform internal baffling (FM-5 variant).

**Step 3 — Test response to blower speed change.**

- If increasing blower speed produces **substantial improvement** (escape visibly reduced by 50% or more): **FM-3 (insufficient exhaust rate) is the primary mode.** Proceed to corrective actions for FM-3.
- If increasing blower speed produces **minimal improvement**: **FM-1 (inadequate overhang) is the primary mode.** The plume is beyond the hood's geometric reach. Proceed to Step 4.

**Step 4 — Test response to height reduction.**

- If temporarily reducing the distance between the cooking surface and hood (by raising the grill or lowering the hood) produces **dramatic improvement**: **FM-2 (excessive mounting height) is compounding FM-1.** Both modes are active.
- If height reduction produces **moderate improvement** only: FM-1 is the dominant mode. The hood is undersized at any practical height.
- If the escape pattern shows **center captures well, corners leak**: **FM-5 (geometry-induced spillage) is the primary mode.** The hood may be large enough externally but has poor internal velocity distribution.

**Step 5 — Test in wind conditions.**

- If capture is adequate in still air but degrades when wind develops, with escape that is **directional** (downwind side) and **intermittent** (correlated with gusts): **FM-4 (wind-deflected plume escape) is the primary mode.**
- If wind produces diffuse, slow escape with a weak-plume source (charcoal or pellet smoker): **FM-6 (Momentum-Limited Capture) may be active.** Verify by testing with a gas grill — if the gas grill does not exhibit the same pattern, FM-6 is confirmed for the weaker source.

**Step 6 — For compound failures, rank by impact.**

Apply the corrective priority hierarchy: reduce mounting height first (addresses FM-2 and compounds of FM-1 and FM-2); add side panels and lip (addresses FM-4, FM-5, FM-6); increase CFM (addresses FM-3, FM-6); replace hood with larger model (addresses FM-1).

### 3.11 Corrective Action Matrix

The following matrix ranks corrective interventions for each failure mode by effectiveness (capture improvement) and feasibility (cost, difficulty, disruption to existing installation).

#### Table 3.11: Corrective Action Matrix

| Intervention | FM-1 | FM-2 | FM-3 | FM-4 | FM-5 | FM-6 | Cost | Difficulty |
|---|---|---|---|---|---|---|---|---|
| Clean/replace filters | -- | -- | HIGH | -- | LOW | LOW | $20-80 | Easy |
| Increase blower speed to maximum | -- | -- | HIGH | LOW | MED | MED | $0 | Trivial |
| Add 3" perimeter lip | MED | LOW | -- | MED | MED | HIGH | $50-150 | Moderate |
| Install full-face baffle filters | -- | -- | -- | -- | HIGH | LOW | $80-200 | Moderate |
| Add side panels (both sides) | MED | -- | -- | HIGH | -- | MED | $150-500 | Moderate |
| Add rear panel or wall backing | LOW | -- | -- | HIGH | -- | LOW | $200-800 | Moderate-High |
| Reduce mounting height by 6" | MED | HIGH | MED | MED | -- | MED | $0-300 | Variable |
| Upgrade blower motor | -- | -- | HIGH | MED | MED | HIGH | $300-1000 | Moderate |
| Reduce duct length/restrictions | -- | -- | HIGH | -- | -- | MED | $100-500 | Moderate |
| Replace hood with larger model | HIGH | MED | -- | MED | HIGH | -- | $1000-5000 | High |
| Reorient grill relative to wind | -- | -- | -- | MED | -- | -- | $0 | Easy |

**Legend:** HIGH = primary remedy (directly addresses root cause); MED = secondary remedy (provides meaningful but incomplete improvement); LOW = marginal benefit; -- = not applicable to this failure mode.

---

## 4. Implications for Outdoor BBQ Ventilation

### 4.1 The Dominance of Geometric Failure

The failure mode analysis confirms the principle established in RB-005: geometric coverage is the most important and most commonly deficient parameter in outdoor BBQ hood installations. FM-1 (inadequate overhang) is the most common failure mode because the majority of consumer outdoor hoods are sized using indoor assumptions that produce hoods 30 to 50% too narrow for outdoor plume capture (RB-004 Section 4.2).

The practical implication is that the hood width should be the first parameter verified in any outdoor hood specification. If the hood width does not meet the recommended values from RB-005 Tables 3.8a through 3.8h, the installation will exhibit FM-1 regardless of blower capacity, baffle quality, or wind protection. No corrective intervention short of hood replacement can fully address this deficiency.

### 4.2 Mounting Height as the Master Variable

FM-2 (excessive mounting height) is the failure mode that, when present, makes all other modes worse. Excessive height increases the plume diameter (worsening FM-1), increases the required CFM (worsening FM-3), increases wind deflection (worsening FM-4), and dilutes the plume edge velocity (worsening FM-6). Conversely, reducing the mounting height improves every capture parameter simultaneously.

The RB-003 finding that the CFM requirement quadruples when height doubles (from 18 to 48 inches) means that mounting height is the most leveraged variable in the system. A 6-inch reduction in mounting height provides more capture improvement than a 50% increase in CFM, a 6-inch increase in hood width, or the addition of a perimeter lip — combined.

For residential installations, the recommended mounting height of 24 to 30 inches should be treated as a maximum, not a target. Every feasible inch below 30 reduces cost, noise, energy consumption, and failure risk.

### 4.3 The Correctable Failure Advantage

Three of the six failure modes (FM-3, FM-4, FM-6) are fully correctable post-installation. This is a significant practical finding: a substantial fraction of outdoor hood failures can be remedied without replacing the hood.

The most impactful correctable intervention is the addition of side panels (for FM-4), which provides the equivalent of a 20 to 26% CFM reduction and shifts the installation down one wind exposure class (RB-006 Table 3.9a). For the large number of installations that perform adequately in still air but fail in wind, side panels are the single most cost-effective solution.

The second most impactful correctable intervention is cleaning or replacing grease filters (for FM-3). This is a zero-cost or low-cost maintenance action that restores the system to its designed performance. The finding that filter loading progressively degrades capture means that a regular filter maintenance schedule is essential for sustained performance — not merely for fire safety, but for capture adequacy.

### 4.4 The Indoor-to-Outdoor Specification Error

The compound failure FM-1 + FM-3 (indoor hood applied outdoors) is the root cause of the majority of consumer dissatisfaction with outdoor hood performance. RB-004 established that indoor CFM ratings are 1.7 to 2.5 times too low for outdoor use and indoor hood sizes are 1.3 to 1.7 times too small. When both deficiencies are present in the same installation — which is the standard case when an indoor-rated hood is specified for outdoor use — the resulting system captures 50 to 70% of the plume under standard outdoor conditions, with the remaining 30 to 50% escaping as visible smoke and odor.

The corrective path for this compound failure requires both a larger hood (design-locked; requires replacement) and more CFM (correctable; requires blower upgrade). Addressing only the CFM deficit without also addressing the geometric deficit produces modest improvement (approximately 10 to 15 percentage points of capture efficiency) because the fundamental mismatch between plume diameter and hood width remains.

### 4.5 Weak-Plume Sources Present Unique Failure Profiles

Charcoal grills and low-output pellet smokers produce plumes with low convective heat release rates (Q_c = 1.5 to 3.5 kW versus 5.1 to 16.4 kW for gas grills), resulting in weaker, more diffuse plumes that are more susceptible to FM-4 (wind deflection) and FM-6 (**Momentum-Limited Capture**). Paradoxically, these sources require lower CFM than gas grills but demand equal or greater geometric coverage (overhang) because the plume starts wide (large D_eff for charcoal) and the low plume velocity makes the periphery more vulnerable to wind and turbulence.

The diagnostic implication is that failure mode identification for charcoal and pellet smoker installations must consider FM-6 as a candidate even when the hood appears adequately sized and the blower capacity appears sufficient. The charcoal paradox (RB-001 Section 4.3) manifests operationally as a source that produces substantial smoke but a weak plume — the contaminants are present but the thermal driving force to deliver them into the hood is diminished.

### 4.6 Wind Exposure as the Dominant Environmental Variable

RB-006 established that even modest wind speeds (3 to 5 mph at cooking height) produce measurable capture degradation, and wind speeds of 5 to 8 mph produce significant failure for most source types at standard mounting heights. The failure mode analysis confirms that FM-4 (wind-deflected plume escape) is the failure mode most easily triggered by environmental conditions that the installer cannot control.

The correctable nature of FM-4 is its saving grace. Side panels, rear panels, grill reorientation, and reduced mounting height are all effective mitigations that can be applied after the installation is complete and the wind exposure is characterized through operational experience.

The wind exposure classification from RB-006 (Sheltered, Moderate, Exposed, Severe) should be assessed during the design phase and used to specify the appropriate level of wind protection. Installations classified as Moderate or higher should include side panels as standard equipment, not as optional accessories.

---

## 5. Knowledge Gaps or Opportunities

### 5.1 Well-Established Knowledge

The following aspects of outdoor hood failure modes are well-grounded in the physics established by the predecessor papers and in the broader ventilation engineering literature:

1. **The six primary failure modes identified in this paper** are direct consequences of the well-established plume physics (Heskestad correlations, MTT entrainment theory), hood aerodynamics (potential flow suction field, face velocity distribution), and atmospheric fluid mechanics (Briggs plume deflection, crosswind Froude number). The physical mechanisms are not speculative.

2. **The correctable versus design-locked classification** follows directly from the physical nature of each failure mode. Geometric failures (FM-1) are inherently design-locked because hood dimensions are fixed at manufacture. Aerodynamic failures (FM-3, FM-4, FM-6) are inherently correctable because the relevant parameters (CFM, wind shielding, edge velocity) can be modified post-installation.

3. **The dominance of geometric coverage over suction velocity** for buoyant plume capture is a standard principle in ventilation design (ACGIH Industrial Ventilation Manual) and is confirmed by the analysis of RB-005 Section 3.7 (the width-CFM tradeoff).

4. **The indoor-to-outdoor specification gap** (RB-004) is a direct consequence of the well-documented differences between enclosed and open-boundary environments and is not subject to significant uncertainty.

### 5.2 Areas of Moderate Uncertainty

1. **Failure mode frequency ranking.** The ranking of FM-1 as the most common failure mode is based on the observation that the majority of consumer hoods are 36 to 48 inches wide, which is below the recommended width for most source types at most mounting heights. The actual distribution of failure modes across the installed base has not been surveyed.

2. **Diagnostic symptom specificity.** The observable symptom descriptions are derived from physical reasoning about how each failure mode manifests. Field validation — systematic observation of smoke patterns in installations with known parameter deficiencies — has not been conducted. The diagnostic decision tree should be treated as a well-grounded hypothesis, not as a validated clinical protocol.

3. **Compound failure mode interaction.** When multiple failure modes are active simultaneously, their effects may interact in ways not fully captured by the additive model implied in Section 3.8. For example, FM-5 (geometry-induced spillage) may partially mask FM-1 (inadequate overhang) because the poor velocity distribution causes escape at the center-adjacent edges rather than at the geometric boundary, obscuring the true geometric deficiency.

4. **Corrective action effectiveness estimates.** The capture improvement estimates in the corrective action matrix (Table 3.11) are extrapolated from the quantitative analyses in RB-003, RB-005, and RB-006. They have not been validated by controlled intervention experiments on installed outdoor hoods.

### 5.3 Knowledge Gaps Requiring Further Research

1. **Field survey of failure mode prevalence.** No published survey documents the distribution of failure modes across residential outdoor hood installations. Such a survey — inspecting installations, measuring hood dimensions, blower CFM, mounting height, and wind exposure, and correlating these parameters with observed capture performance — would validate the failure mode taxonomy and refine the frequency ranking.

2. **Smoke visualization and pattern validation.** The diagnostic symptom descriptions in this paper should be validated through systematic smoke visualization experiments. A controlled study using tracer smoke or theatrical fog, with a range of known parameter deficiencies introduced deliberately, would confirm or refine the diagnostic criteria and the decision tree.

3. **Corrective intervention experiments.** The effectiveness estimates for corrective actions (Table 3.11) should be validated by implementing each intervention on instrumented outdoor hood installations and measuring the capture efficiency improvement. Priority experiments:
   - Side panel addition at 5 and 8 mph wind speeds (validating the 15-20% capture improvement estimate for FM-4)
   - Perimeter lip addition on flat-bottom hoods (validating the 25-40% composite improvement estimate for FM-5 and FM-6)
   - Filter cleaning effect on delivered CFM and capture efficiency (validating the FM-3 corrective pathway)

4. **Consumer diagnostic tool development.** The diagnostic decision tree in Section 3.10 could be developed into a consumer-facing diagnostic tool (checklist, flowchart, or application) that enables homeowners to identify their active failure mode and determine the appropriate corrective action without professional consultation.

5. **Compound failure mode interaction modeling.** CFD simulation of representative outdoor hood installations with multiple parameter deficiencies (undersized hood, insufficient CFM, wind exposure) would clarify how failure modes interact and whether the corrective action priorities identified in this paper are optimal for compound failures.

6. **Dynamic failure modes during cooking transients.** This paper addresses steady-state failure modes. Transient events — grease flare-ups (momentary high heat release), lid opening (thermal pulse and plume disruption), food placement (temporary plume deflection) — produce momentary failures that are not captured by the steady-state taxonomy. The frequency, duration, and capture impact of transient failures should be characterized.

---

## 6. Diagram Mapping Notes (Text Only)

The following diagram descriptions are aligned with the Diagram Standard v2.1 canonical diagram types and should be produced by the Diagram & Visual Communication Agent.

### Diagram 6.1: Failure Mode Taxonomy Overview (Diagram Type 4 — Conceptual/Comparative)

**Purpose:** Provide a visual summary of the six failure modes, their root causes, and their correctable/design-locked classification.

**Content:**
- Central graphic: cross-section of a canopy hood over a cooking surface with a rising **Buoyant Cooking Plume**
- Six labeled failure mechanisms shown as color-coded arrows or zones around the hood:
  - FM-1 (red): Plume extending beyond hood boundary on all sides — "Inadequate Overhang"
  - FM-2 (orange): Exaggerated vertical distance between source and hood — "Excessive Mounting Height"
  - FM-3 (yellow): Arrows showing plume gas overflowing at hood edges due to insufficient suction — "Insufficient Exhaust Rate"
  - FM-4 (blue): Wind arrow deflecting plume off-center, escaping downwind — "Wind-Deflected Plume Escape"
  - FM-5 (purple): Hood interior showing concentrated suction at center, dead zones at corners — "Geometry-Induced Spillage"
  - FM-6 (gray): Slow, diffuse escape at hood edges — "**Momentum-Limited Capture**"
- Classification tags: Design-Locked (FM-1), Partially Correctable (FM-2, FM-5), Fully Correctable (FM-3, FM-4, FM-6)
- Figure caption: "Figure 7.1: Taxonomy of the six primary failure modes in outdoor BBQ hood installations. Red and orange modes (FM-1, FM-2) are the most consequential and the most difficult to correct. Blue and yellow modes (FM-3, FM-4) are the most common correctable failures."

### Diagram 6.2: Smoke Escape Pattern Gallery — Six Failure Modes (Diagram Type 4 — Comparative)

**Purpose:** Illustrate the characteristic smoke escape pattern for each failure mode, enabling visual diagnosis.

**Content:**
- Six panels, each showing a front cross-section view of a hood with the distinctive smoke escape pattern:
  - FM-1: Smoke rising symmetrically around the entire hood perimeter in a curtain pattern; plume visibly extends beyond hood on both sides
  - FM-2: Smoke diffuse and spreading wide at hood height; plume appears broad and slow; hood appears small relative to the visible plume cloud
  - FM-3: Smoke curling outward from hood edges, particularly at the front and sides; center captures well; escape is continuous but concentrated at perimeter
  - FM-4: Smoke escaping from one side (downwind); upwind side clean; escape is gust-intermittent with visible correlation to wind
  - FM-5: Smoke escaping primarily at corners; center captures well; four distinct corner escape plumes visible; symmetric in still air
  - FM-6: Smoke seeping slowly outward from all edges in a diffuse, low-velocity pattern; visible primarily with charcoal or smoker sources; gentle drift rather than active escape
- Each panel labeled with failure mode ID, name, and key diagnostic feature
- Figure caption: "Figure 7.2: Characteristic smoke escape patterns for the six primary failure modes. Each mode produces a visually distinct pattern that enables field diagnosis. FM-1 produces symmetric perimeter escape; FM-4 produces directional, gust-correlated escape; FM-5 produces corner-dominant escape."

### Diagram 6.3: Diagnostic Decision Tree (Diagram Type — New: Decision Flowchart)

**Purpose:** Provide the diagnostic decision tree from Section 3.10 in graphical flowchart form.

**Content:**
- Start node: "Smoke escape observed during cooking?"
- Decision nodes at each diagnostic step:
  - Still air or wind? Branch to still-air path and wind path
  - Still-air path: Symmetric or asymmetric escape? -> Blower speed response? -> Height sensitivity?
  - Wind path: Directional and gust-correlated? -> Source type (gas vs. charcoal/pellet)?
- Terminal nodes: Each labeled with the diagnosed failure mode (FM-1 through FM-6) and a pointer to the corrective action table
- Color coding matching Diagram 6.1 (red for FM-1, orange for FM-2, etc.)
- Figure caption: "Figure 7.3: Diagnostic decision tree for identifying the primary active failure mode from observable smoke escape patterns. Start at the top and follow the decision branches based on observed symptoms."

### Diagram 6.4: Corrective Action Priority Pyramid (Diagram Type 4 — Conceptual)

**Purpose:** Illustrate the hierarchy of corrective actions ranked by effectiveness and applicability.

**Content:**
- Pyramid with five tiers, from most effective (base) to least effective (apex):
  - Base: "Reduce Mounting Height" — addresses FM-1, FM-2, FM-3, FM-4, FM-6; highest leverage
  - Second tier: "Increase Hood Width / Replace Hood" — addresses FM-1, FM-5; highest impact for design-locked failures
  - Third tier: "Add Side Panels + Lip" — addresses FM-4, FM-5, FM-6; most cost-effective correctable intervention
  - Fourth tier: "Increase CFM / Upgrade Blower" — addresses FM-3, FM-6; direct but diminishing returns
  - Apex: "Clean Filters / Reduce Duct Restriction" — addresses FM-3; maintenance action, lowest cost
- Each tier annotated with the failure modes it addresses and approximate cost range
- Arrow from base to apex labeled "Decreasing effectiveness per dollar; increasing ease of implementation"
- Figure caption: "Figure 7.4: Corrective action priority pyramid. The most effective interventions (reducing mounting height, increasing hood width) are at the base but are the most disruptive to implement. The least disruptive interventions (filter cleaning, blower speed adjustment) are at the apex but provide the smallest capture improvement."

### Diagram 6.5: FM-1 and FM-4 Interaction — Still Air Versus Wind (Diagram Type 3 — Hood-Plume Geometry)

**Purpose:** Show how a marginally adequate hood (minimal overhang) transitions from marginal capture in still air to significant failure in wind.

**Content:**
- Two side-by-side cross-sections of the same hood-grill configuration:
  - Left: Still air. Plume rises vertically, nearly filling the hood footprint. Small **Missed Plume Region** at edges (FM-1 is marginal). Annotation: "Still air: marginal capture. Minor escape at edges."
  - Right: 5 mph wind from left. Plume deflected to the right, with centerline approaching the right hood edge. Left side has excess overhang (wasted); right side has plume escaping beyond the hood. Large **Missed Plume Region** on the right. Annotation: "5 mph wind: FM-1 + FM-4 compound failure. 25-35% of plume escapes downwind."
- Deflection dimension labeled (from RB-006)
- Wind arrows on right panel
- **Capture Envelope** boundary shown for both conditions
- Figure caption: "Figure 7.5: Interaction between FM-1 (inadequate overhang) and FM-4 (wind-deflected plume escape). The left panel shows marginal capture in still air. The right panel shows the same installation in 5 mph wind, where the plume deflection compounds the geometric deficiency to produce substantial escape on the downwind side."

---

## Appendix A: Failure Mode Parameter Thresholds — Quick Reference

The following table consolidates the quantitative triggering thresholds for each failure mode at the most common configuration: 30-inch mounting height with a medium gas grill (Q_c = 8.2 kW, D_eff = 0.51 m).

| Parameter | Required Value (RB-002/RB-003/RB-005/RB-006) | Common Installed Value | Gap |
|---|---|---|---|
| Hood width | 57" (recommended, K = 1.70) | 36-48" (consumer hoods) | 9-21" deficit |
| Hood depth (island) | 53" (recommended) | 24-30" (consumer hoods) | 23-29" deficit |
| Overhang per side | 17" (recommended) | 6-12" (typical) | 5-11" deficit |
| Exhaust CFM (standard outdoor) | 609 (K_CFM = 3.0) | 300-600 (typical blowers) | 9-309 CFM deficit |
| Exhaust CFM (light wind) | 747 (K_CFM = 3.68) | 300-600 | 147-447 CFM deficit |
| Mounting height | 24-30" (recommended maximum) | 30-48" (typical) | 0-18" excess |
| Lip height | 3" (recommended minimum) | 0" (many consumer hoods) | 3" deficit |
| Wind protection | Side panels for Moderate+ exposure | None (typical) | Full deficit |

## Appendix B: Failure Mode Diagnostic Quick Card

For field use. Print and laminate.

**Step 1:** Still-air escape pattern?
- Symmetric (all sides) -> Step 2
- Directional (one side) -> Suspect FM-4. Confirm with gust correlation test.
- None -> Check in wind (Step 5 in main text).

**Step 2:** Blower speed response?
- Big improvement -> **FM-3.** Clean filters. Upgrade blower.
- Little improvement -> Step 3.

**Step 3:** Height sensitivity test (raise grill 6 inches)?
- Dramatic improvement -> **FM-2.** Lower the hood or raise the grill.
- Moderate improvement -> **FM-1.** Hood is undersized. Consider replacement.

**Step 4:** Corner-dominant pattern?
- Yes, center captures fine -> **FM-5.** Add lip. Install full-face filters.
- No, uniform perimeter escape -> **FM-1** confirmed.

**Step 5:** Slow, seeping escape with charcoal/pellet source?
- Yes -> **FM-6.** Add lip. Increase CFM.
- No -> Re-evaluate from Step 1.

## Appendix C: Key Quantitative Results from Dependency Papers

The following values are referenced throughout this paper and are drawn from the indicated dependency papers.

| Quantity | Value | Source |
|---|---|---|
| Plume capture diameter (Gas Med, 30") | 41" (1.05 m) | RB-001 Table 3.6 |
| Plume mass flow (Gas Med, 30") | 203 CFM | RB-003 Table 3.5 |
| Required CFM, standard outdoor (Gas Med, 30") | 609 CFM | RB-003 Table 3.8a |
| Required CFM, light wind (Gas Med, 30") | 747 CFM | RB-003 Table 3.8b |
| Recommended hood width (Gas Med, 30") | 57" | RB-005 Table 3.8b |
| Recommended overhang per side (Gas Med, 30") | 17" | RB-005 Table 3.1b |
| Indoor-to-outdoor CFM correction factor | 1.7 to 2.5 | RB-004 Section 3.10 |
| Indoor-to-outdoor hood width correction factor | 1.3 to 1.7 | RB-004 Section 3.10 |
| Wind deflection (Gas Med, 30", 5 mph) | 12" | RB-006 Table 3.2b |
| Critical wind for 25% escape (Gas Med, 30") | 6.7 mph | RB-006 Table 3.4a |
| Critical wind for centerline exit (Gas Med, 30") | 9.7 mph | RB-006 Table 3.4a |
| Lip improvement factor (3" lip) | 1.25 to 1.40 composite | RB-005 Section 3.3.4 |
| Unbaffled hood eta_uniformity | 0.40 to 0.55 | RB-005 Section 2.5 |
| Fully baffled hood eta_uniformity | 0.75 to 0.85 | RB-005 Section 2.5 |
| Side panel wind reduction | 40 to 60% of freestream | RB-006 Section 3.9.1 |
| Plume edge velocity (at capture boundary) | 6% of centerline | RB-003 Section 3.2 |
| Height penalty: CFM increase 18" to 48" | 4.0x | RB-003 Table 3.10 |
| Gust factor (standard) | 1.7 | RB-006 Section 2.6 |

---

## References

1. Morton, B.R., Taylor, G.I., and Turner, J.S. (1956). "Turbulent gravitational convection from maintained and instantaneous sources." *Proceedings of the Royal Society A*, 234, pp. 1-23.

2. Heskestad, G. (2016). "Fire Plumes, Flame Height, and Air Entrainment." Chapter 13, *SFPE Handbook of Fire Protection Engineering*, 5th ed. Springer.

3. McCaffrey, B.J. (1979). "Purely Buoyant Diffusion Flames: Some Experimental Results." NBSIR 79-1910, National Bureau of Standards.

4. Briggs, G.A. (1984). "Plume Rise and Buoyancy Effects." In *Atmospheric Science and Power Production*, ed. D. Randerson, DOE/TIC-27601.

5. ASHRAE (2019). *ASHRAE Handbook — HVAC Applications*, Chapter 33: Kitchen Ventilation.

6. ASHRAE Standard 154 (2016). *Ventilation for Commercial Cooking Operations*.

7. ACGIH (2019). *Industrial Ventilation: A Manual of Recommended Practice for Design*, 30th ed.

8. Swierczyna, R.T., Sobiski, P.A., and Gerstler, W.D. (2003). "Laboratory Method for Quantifying the Spillage of Effluent from a Range Hood." ASHRAE RP-1033, Final Report.

9. Li, Z. and Dai, T. (1996). "Effect of Lip Height on Kitchen Exhaust Hood Capture and Containment Performance." *ASHRAE Transactions*, 102(1).

10. Fric, T.F. and Roshko, A. (1994). "Vortical Structure in the Wake of a Transverse Jet." *Journal of Fluid Mechanics*, 279, pp. 1-47.

11. Davidson, G.A. (1986). "Gaussian Versus Top-Hat Profile Assumptions in Integral Plume Models." *Atmospheric Environment*, 20(3), pp. 471-478.

12. Contini, D. and Robins, A. (2001). "Water Tank Measurements of Buoyant Plume Rise and Structure in Neutral Crossflows." *Atmospheric Environment*, 35, pp. 6105-6115.

13. UL 710 (2019). *Exhaust Hoods for Commercial Cooking Equipment*. Underwriters Laboratories.

14. ASTM E3087 (2018). *Standard Test Method for Measuring Capture Efficiency of Domestic Range Hoods*.

---

*This document is a research output of the Outdoor Ventilation Standard, governed by the Research Program Charter v2.6. All terms are used as defined in Glossary v1.1. This paper synthesizes the findings of RB-003, RB-004, RB-005, and RB-006 into an integrated failure mode taxonomy for outdoor barbecue ventilation hoods.*
