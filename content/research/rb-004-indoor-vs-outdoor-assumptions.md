---
title: "RB-004: Why Indoor Ventilation Assumptions Fail Outdoors"
date: 2025-10-07
lastmod: 2025-10-25
draft: false
type: "research"
series: "Outdoor Ventilation Standard"
research_id: "RB-004"
priority: "P1 — Core"
status: "Complete"
version: "1.0"
charter_version: "2.6"
glossary_version: "1.1"
diagram_standard_version: "2.1"
description: "Systematic identification and quantitative analysis of every assumption embedded in indoor kitchen ventilation standards (ASHRAE 154, IMC Chapter 5, UL 710) that does not transfer to outdoor open-boundary environments. Covers wall-assisted capture, ceiling jet behavior, room pressurization, controlled makeup air, absence of crosswind, and enclosed dilution volume. Delivers penalty estimates and an indoor-versus-outdoor comparison table for a reference 60,000 BTU gas grill at 30-inch mounting height."
summary: "This paper audits the major indoor kitchen ventilation standards and identifies six categories of enclosure-dependent assumptions that fail in outdoor installations. For each lost mechanism, a quantitative performance penalty is estimated. The combined effect of removing walls, ceiling, pressurization, controlled makeup air, wind shielding, and enclosed dilution volume requires outdoor hoods to be 1.4-1.7x wider and to exhaust 1.7-2.5x the CFM of equivalent indoor installations. Indoor CFM ratings, hood sizes, and manufacturer claims based on indoor testing are systematically misleading for outdoor use."
tags: ["standards analysis", "indoor-outdoor comparison", "ASHRAE"]
categories: ["P1 — Core"]
dependencies: "RB-001, RB-002, RB-003"
downstream_topics:
  - "RB-007: Failure Modes of Outdoor BBQ Hoods"
  - "RB-010: Gaps in Existing Standards, Codes, and Consumer Guidance"
---

**Research Program:** Outdoor Ventilation Standard
**Charter Version:** 2.6
**Glossary Version:** 1.1
**Priority Tier:** P1 — Core
**Author Role:** Standards & Codes Analysis Agent
**Date:** 2026-02-08
**Depends On:** RB-001: Buoyant Plume Behavior from Barbecue and High-Heat Cooking Sources; RB-002: Entrainment and Lateral Plume Spread in Open-Air Environments; RB-003: Velocity Decay and Near-Field vs. Far-Field Capture

---

## 1. Topic Definition

This paper systematically identifies and explains every assumption embedded in the principal indoor kitchen ventilation standards — ASHRAE Standard 154, the International Mechanical Code (IMC) Chapter 5, and UL 710 — that does not transfer to outdoor open-boundary environments. These standards form the engineering and regulatory basis for all commercial and most residential kitchen ventilation design in the United States. They are routinely cited, directly or indirectly, by manufacturers of outdoor range hoods and by designers of outdoor kitchen installations. Yet every provision in these standards was developed for, tested in, and validated against enclosed indoor environments. No provision explicitly addresses the open-boundary conditions that define outdoor cooking ventilation.

The scope of this paper encompasses:

1. **Systematic assumption audit.** For each major standard (ASHRAE 154, IMC Chapter 5, UL 710), identification of every provision that assumes or requires an enclosed space, with specific clause references and explanation of the enclosure dependence.

2. **Physics of indoor capture advantages.** Explanation of six physical mechanisms that assist capture indoors but are absent outdoors: wall-guided airflow, ceiling jet recovery, room pressurization, controlled makeup air, absence of crosswind, and enclosed dilution volume. Each mechanism is described in terms of its physical operation and its contribution to indoor capture performance.

3. **Quantitative penalty analysis.** For each lost mechanism, estimation of the performance penalty when the mechanism is removed — expressed as a required increase in CFM, hood size, or both.

4. **Indoor versus outdoor comparison table.** A side-by-side quantitative comparison for a reference case: a 60,000 BTU gas grill (Q_c = 12.3 kW) at a 30-inch mounting height.

5. **Implications for outdoor hood specification.** A synthesis explaining why indoor CFM ratings, hood sizes, and manufacturer claims derived from indoor testing are misleading when applied to outdoor installations.

### Relationship to Prior Research

RB-001 established the heat release rates and plume parameters for all outdoor cooking source types, finding that all hood mounting heights are in the far-field and that plume mass is 95-97% entrained ambient air at 30 inches. RB-002 established the outdoor margin factor K = 1.70, delivered hood sizing tables showing recommended widths of 51 to 71 inches at 30-inch mounting height, and quantified that **Open-Boundary Dilution** eliminates all secondary capture mechanisms available indoors. RB-003 established CFM requirements with outdoor correction factors of 1.7 to 2.5 times indoor values, maximum mounting heights, and the finding that **Momentum-Limited Capture** at the plume edge is the dominant outdoor failure mode. The present paper synthesizes these findings into a standards-focused analysis explaining precisely why indoor ventilation codes do not apply outdoors.

### Problem Framing

The fundamental problem is one of implicit assumptions. ASHRAE 154, IMC Chapter 5, and UL 710 do not explicitly state "this standard applies only indoors." They do not enumerate the environmental conditions they assume. They simply specify performance requirements — exhaust rates, hood dimensions, face velocities, capture efficiency test procedures — that were developed and validated in enclosed test rooms. The enclosure is treated as a given, not as a variable. When a manufacturer or designer applies these specifications to an outdoor installation, every enclosure-dependent mechanism is silently lost, and the resulting system is systematically underspecified.

This paper makes the implicit explicit.

---

## 2. Relevant Physical Principles

### 2.1 The Six Indoor Capture Advantages

Indoor kitchen ventilation benefits from six physical mechanisms that are absent or degraded in outdoor environments. These mechanisms collectively enhance capture performance, reduce the required exhaust rate, and allow smaller hood dimensions than the plume physics alone would require. Their absence outdoors imposes quantifiable penalties.

**Mechanism 1 — Wall-Guided Airflow (Plume Funneling)**

In an enclosed kitchen, walls adjacent to or near the cooking surface restrict the directions from which ambient air can approach the plume. A back wall blocks entrainment from one direction. A corner installation blocks two directions. The restricted entrainment has two effects:

First, it reduces the total entrainment rate into the plume. With one or two sides blocked, the plume entrains less ambient air per unit of rise height, resulting in a narrower plume at the **Plume Interception Plane**. RB-002 Section 2.8 quantified that open-boundary entrainment proceeds through the full 360-degree perimeter, while wall-restricted entrainment proceeds through a reduced perimeter (180 to 270 degrees, depending on wall proximity). This reduces plume width by approximately 15-30% compared to open-air conditions.

Second, walls redirect room air currents toward the cooking surface and hood. In a kitchen with mechanical exhaust, air flows from the room interior toward the hood to replace the exhausted volume. Walls channel this replacement air flow, creating a gentle, predictable inward drift that assists plume capture. This is the "funnel effect" — the walls guide ambient air (and any escaped plume gas) back toward the exhaust opening.

**Mechanism 2 — Ceiling Jet Collection and Redirection**

When a **Buoyant Cooking Plume** reaches the ceiling of an enclosed kitchen (typically 8-10 feet above the floor, or approximately 4-6 feet above the cooking surface), it spreads radially as a ceiling jet — a thin, hot layer flowing horizontally along the ceiling surface. The ceiling jet contains plume gas that has risen past the hood or escaped the **Capture Envelope** during turbulent excursions.

In an enclosed room, the ceiling jet is confined by the ceiling and walls. It cannot escape vertically. It spreads along the ceiling until it encounters a wall, where it turns downward, creating a recirculating flow pattern. A fraction of this recirculating ceiling jet gas re-enters the hood's capture zone from above, providing a secondary capture mechanism. The ceiling jet also creates a warm stratified layer at the ceiling that inhibits further vertical penetration of escaped plume gas, concentrating the contaminant in a zone where the hood's exhaust has the greatest influence.

Alpert (1972) and Heskestad and Delichatsios (1978) established the ceiling jet correlations used in fire protection engineering. For a ceiling at height H above the source, the ceiling jet temperature excess at radial distance r from the plume impingement point is:

> Delta_T_cj = 16.9 * Q_total^(2/3) / H^(5/3) for r/H < 0.18
> Delta_T_cj = 5.38 * (Q_total / r)^(2/3) / H for r/H > 0.18

These correlations show that the ceiling jet retains significant thermal buoyancy for distances of several meters from the impingement point. In a kitchen with a ceiling 5 feet above the hood, the ceiling jet from a 60,000 BTU grill has a temperature excess of approximately 10-20 degrees C at radial distances of 3-5 feet — sufficient to create a meaningful density difference that drives recirculation toward the exhaust.

Outdoors, there is no ceiling. The **Buoyant Cooking Plume** that escapes the hood rises freely and disperses through **Open-Boundary Dilution**. There is no ceiling jet, no recirculation, no secondary capture. Every unit of plume mass that escapes the hood's first-pass **Capture Envelope** is permanently lost.

**Mechanism 3 — Room Pressurization (Negative Pressure Assist)**

When a kitchen exhaust hood operates, it removes air from the enclosed room volume, creating a slight negative pressure relative to the outdoor atmosphere. This negative pressure draws replacement (makeup) air into the room through doors, windows, transfer grilles, and building envelope leakage. The resulting inward air flow creates a gentle but persistent drift of room air toward the exhaust opening.

This negative-pressure drift assists capture in two ways. First, it creates a net inward flow field throughout the room that gently guides all suspended contaminants — including escaped plume gas — toward the hood. Second, it prevents the accumulation of contaminants in the room by continuously sweeping the room volume through the exhaust system.

ASHRAE Standard 154 (Section 5.2) addresses makeup air requirements and specifies that the supply air rate should be 80-90% of the exhaust rate to maintain a slight negative pressure (approximately 0.02 to 0.05 inches water gauge). This controlled negative pressure is a design feature that enhances capture, not merely a consequence of exhaust operation.

Outdoors, there is no enclosed volume to pressurize. There is no "room" that can develop negative pressure. The hood operates in an infinite atmosphere at constant pressure. The exhaust draws air from the immediate vicinity of the hood opening, but there is no far-field drift guiding distant contaminants back toward the hood. Any contaminant that escapes the immediate capture zone disperses freely through the atmosphere.

**Mechanism 4 — Controlled Makeup Air Velocity and Direction**

Indoor kitchens with properly engineered ventilation systems deliver makeup air through controlled supply diffusers positioned to complement the exhaust hood's capture function. ASHRAE Standard 154 Section 5 and the ASHRAE Kitchen Ventilation Design Guide specify that makeup air should be delivered:

- At low velocity (approximately 50-75 fpm) to avoid disturbing the plume
- From the front or sides of the hood, creating a gentle "air curtain" that assists capture
- At a temperature within 10 degrees F of the room temperature to minimize buoyancy effects

This controlled delivery creates a predictable, low-turbulence air environment in the vicinity of the cooking surface. The makeup air "pushes" room air toward the hood while avoiding the turbulent disruption that would occur if replacement air entered through random openings at uncontrolled velocities.

Outdoors, there is no controlled makeup air. The air approaching the cooking surface is ambient wind — variable in speed, direction, temperature, and turbulence intensity. The outdoor atmosphere supplies unlimited "makeup air," but it does so chaotically. Wind gusts can exceed 10 mph (4.5 m/s) and change direction within seconds. This uncontrolled air supply actively disrupts the plume rather than assisting capture.

**Mechanism 5 — Absence of Crosswind and Ambient Turbulence**

Indoor kitchens are shielded from outdoor wind. The air within the kitchen is essentially still in the absence of HVAC-induced drafts. HVAC systems are designed to deliver conditioned air at low velocity (typically 25-50 fpm at the occupied zone) through diffusers that minimize directional momentum. The result is an ambient environment where the only significant air movement is the gentle drift toward the exhaust hood created by the negative room pressure.

In this quiescent environment, the **Buoyant Cooking Plume** rises vertically, undisturbed, along a predictable path directly into the hood. The plume maintains its axisymmetric Gaussian profile (described in RB-002) without lateral deflection. The hood need only be centered over the cooking surface with modest overhang to achieve high capture efficiency.

Outdoors, even nominally "calm" conditions include ambient turbulence at velocities of 0.2-0.5 m/s (40-100 fpm). Light breezes of 1-3 mph (0.5-1.3 m/s) are present more often than not. RB-003 Section 3.10 showed that a 3 mph breeze deflects the plume centerline approximately 7 inches at a 30-inch mounting height. This deflection shifts the plume partially outside the hood's **Effective Capture Area**, requiring either larger hood overhang or higher exhaust rates to compensate.

The key distinction is that indoor standards specify performance under implicitly quiescent conditions. The ASHRAE 154 exhaust rate tables and the UL 710 test protocol assume still air surrounding the hood. When these specifications are applied outdoors, the wind environment degrades capture performance by an amount that the specifications do not account for.

**Mechanism 6 — Enclosed Dilution Volume**

In an enclosed kitchen, the room volume constrains the dispersal of contaminants. A kitchen measuring 12 x 15 x 9 feet (1,620 cubic feet) has a finite air volume that fills with contaminants at a predictable rate when the exhaust is operating. At a typical kitchen exhaust rate of 400 CFM, the room volume turns over approximately every 4 minutes. Contaminants that escape the hood are diluted within this finite volume and are progressively captured as the room air recirculates through the hood's capture zone.

This finite dilution volume provides a passive safety net: even with imperfect first-pass capture, the contaminant concentration in the room reaches a quasi-steady state determined by the ratio of contaminant release rate to exhaust rate. The room does not fill with smoke indefinitely; the exhaust hood eventually captures most contaminants through repeated air exchange.

Outdoors, the dilution volume is effectively infinite. **Open-Boundary Dilution** permits three-dimensional dispersion in all directions — upward, laterally, and downwind — with no boundary to confine the contaminants and no recirculation path to return them to the hood. The contaminant concentration at any point outside the immediate capture zone drops rapidly with distance, following atmospheric dispersion laws (Gaussian plume dispersion, Pasquill-Gifford stability classes). Escaped contaminants are diluted to imperceptible levels within a few meters of the cooking surface.

This sounds like a benefit — and it is, from an air quality perspective. Outdoor cooking poses less health risk from accumulated contaminants than indoor cooking in a poorly ventilated kitchen. However, from a hood performance perspective, the infinite dilution volume eliminates the safety-net effect. The hood must achieve its target capture efficiency on the first pass. There is no second chance.

### 2.2 The Compounding Nature of Lost Mechanisms

The six mechanisms described above do not operate independently indoors. They interact synergistically:

- Walls channel makeup air toward the hood (Mechanism 1 + Mechanism 4).
- Room pressurization creates the driving force for wall-guided airflow (Mechanism 3 + Mechanism 1).
- The ceiling jet recirculates escaped plume gas back to the hood because walls prevent horizontal escape (Mechanism 2 + Mechanism 1).
- The absence of crosswind allows all of the above mechanisms to operate without disruption (Mechanism 5 enables Mechanisms 1-4).
- The finite dilution volume ensures that even escaped contaminants remain in the room for eventual capture (Mechanism 6 backs up Mechanisms 1-5).

Removing one mechanism degrades performance. Removing all six — as occurs when moving from indoors to outdoors — eliminates the entire system of complementary capture assistance. The total penalty is greater than the sum of individual penalties because the synergistic interactions are lost along with the individual mechanisms.

### 2.3 Capture Efficiency: Indoor Versus Outdoor Definition

Indoor capture efficiency is typically defined as the fraction of cooking effluent captured by the hood during steady-state operation. ASTM E3087 defines a test method using a standardized cooking load in an enclosed test room. Under these conditions, a well-designed commercial kitchen hood achieves 85-98% capture efficiency depending on duty class, exhaust rate, and hood type.

Critically, this capture efficiency includes secondary capture from room recirculation. A hood that achieves 70% first-pass capture but operates in a room where escaped effluent recirculates back to the hood within 2-3 air changes may report an overall capture efficiency of 90% or higher. The test protocol measures the steady-state contaminant concentration in the room, not the first-pass capture fraction.

Outdoors, first-pass capture is the only capture. The "outdoor capture efficiency" equals the first-pass capture efficiency, with no recirculation credit. An outdoor hood that captures 70% of the plume on the first pass has a total capture efficiency of 70% — the remaining 30% is permanently lost to **Open-Boundary Dilution**. To achieve the same 90% total capture efficiency as the indoor hood, the outdoor hood must achieve 90% first-pass capture, requiring significantly larger dimensions and higher exhaust rates.

---

## 3. Observed or Expected Behavior

### 3.1 Assumption Audit: ASHRAE Standard 154

ASHRAE Standard 154-2016, "Ventilation for Commercial Cooking Operations," is the primary performance standard for commercial kitchen ventilation in the United States. It establishes minimum exhaust rates, makeup air requirements, and system design criteria. The following provisions assume or require an enclosed indoor environment.

#### 3.1.1 Section 4 — Exhaust Flow Rates

ASHRAE 154 Section 4 specifies minimum exhaust flow rates based on hood type (Type I or Type II), hood style (wall-mounted canopy, island canopy, back shelf, proximity), cooking appliance duty (light, medium, heavy, extra-heavy), and hood length. The exhaust rate tables are derived from research conducted in enclosed test kitchens.

**Enclosure-dependent assumptions:**

1. **The "island canopy" category assumes a room environment.** An island canopy hood — the closest analog to an outdoor hood — is defined as a hood not against a wall, accessible from all four sides. ASHRAE 154 assigns island canopy hoods the highest exhaust rate multiplier (approximately 1.5-2.0x a wall-mounted canopy) to account for the lack of wall assist. However, this multiplier was derived in an enclosed room where ceiling jet recovery, room pressurization, and absence of wind still apply. The multiplier accounts for losing one mechanism (the back wall) while retaining the other five. It does not account for the outdoor condition where all six mechanisms are lost.

2. **The exhaust rate specification assumes quiescent ambient conditions.** The ASHRAE 154 exhaust rates are specified as fixed values (e.g., 400 CFM per linear foot for a heavy-duty island canopy). There is no wind correction factor, no ambient turbulence allowance, and no variable-condition adjustment. The specification assumes the ambient air surrounding the hood is still — a condition that exists indoors but never outdoors.

3. **The duty classification assumes enclosed dilution.** The light/medium/heavy/extra-heavy duty classifications are based on the quantity and type of cooking effluent generated. These classifications implicitly assume that uncaptured effluent is contained within the kitchen volume and eventually exhausted. The effluent loading determines the required air change rate for acceptable indoor air quality. Outdoors, the duty classification is irrelevant to air quality (escaped effluent disperses freely) but critical to capture performance (the hood must capture the effluent, not rely on room dilution).

4. **The linear-foot method assumes wall-constrained plume geometry.** The exhaust rate per linear foot of hood (CFM/ft) implicitly assumes that the plume is constrained in the depth dimension by the back wall (for wall-mounted canopies) or by the kitchen geometry. For an island canopy, the per-linear-foot rate is higher, but it still assumes that the plume does not expand beyond the hood's capture zone in all horizontal directions simultaneously. Outdoors, the plume expands symmetrically in all directions with no wall constraint.

#### 3.1.2 Section 5 — Replacement (Makeup) Air

ASHRAE 154 Section 5 specifies that makeup air must be provided to replace the exhausted air volume. It specifies that makeup air should be delivered at controlled velocity, controlled temperature, and through properly located supply points. The section further specifies that the balance between exhaust and supply should maintain a slight negative pressure in the kitchen.

**Enclosure-dependent assumptions:**

1. **The makeup air concept requires an enclosed volume.** The entire framework of makeup air — controlled delivery of replacement air to maintain room pressure balance — presupposes a bounded volume. Outdoors, the atmosphere provides unlimited replacement air at zero effort, but with uncontrolled velocity and direction. The ASHRAE 154 makeup air provisions are wholly inapplicable to outdoor installations.

2. **The pressure balance specification assumes building envelope resistance.** The recommended negative pressure of 0.02-0.05 inches WG requires a building envelope with finite resistance to airflow. Outdoors, there is no envelope, no resistance, and no pressure differential. The exhaust hood cannot create negative pressure in the outdoor atmosphere.

3. **The makeup air velocity limits assume indoor air quality requirements.** The 50-75 fpm delivery velocity specification is designed to minimize drafts in the occupied kitchen space while providing adequate air replacement. Outdoors, the "draft" is the ambient wind, which ranges from 0 to thousands of fpm. The indoor makeup air velocity specification has no outdoor analog.

#### 3.1.3 Section 6 — Hood Construction and Performance

ASHRAE 154 Section 6 specifies hood construction requirements, including minimum face velocity, overhang dimensions, filter placement, and grease containment. These provisions assume specific geometric relationships between the hood, the cooking appliance, and the surrounding room.

**Enclosure-dependent assumptions:**

1. **Minimum face velocity of 50-100 fpm assumes the hood's suction field is the dominant air movement.** RB-003 Section 4.1 demonstrated that for outdoor buoyant plumes, the plume's self-delivered velocity (200-560 fpm centerline) overwhelms the hood's face velocity. The ASHRAE face velocity specification is meaningful in an indoor quiescent environment where the hood's suction must actively draw in slowly drifting contaminants. Outdoors, the plume delivers itself, and the challenge is volumetric ingestion rather than suction-driven capture. Face velocity is not the relevant metric for outdoor hood performance.

2. **Overhang specifications assume wall-assisted containment.** ASHRAE 154 specifies minimum overhang of 6 inches per side for island canopy hoods. This overhang is adequate indoors because wall-guided airflow, ceiling jet recovery, and room pressurization compensate for the modest geometric margin. RB-002 established that outdoor overhang requirements are 15-26 inches per side — three to four times the ASHRAE 154 minimum — because all compensating mechanisms are absent.

3. **The distinction between wall-mounted and island canopy hoods assumes the wall as a known boundary.** ASHRAE 154 provides different specifications for wall-mounted and island canopy hoods, acknowledging the capture advantage provided by a back wall. However, it does not provide specifications for the condition where there are no walls at all — the outdoor condition. The island canopy specification (the closest match) still assumes four of the six indoor mechanisms (ceiling jet, room pressurization, controlled makeup air, and absence of wind).

### 3.2 Assumption Audit: International Mechanical Code (IMC) Chapter 5

The International Mechanical Code (IMC), Chapter 5 — Exhaust Systems, governs the design and installation of mechanical exhaust systems including kitchen ventilation. The 2021 IMC (and predecessors) establishes prescriptive requirements for exhaust rates, hood construction, duct materials, and fire protection.

#### 3.2.1 Section 507 — Commercial Kitchen Hoods

IMC Section 507 establishes minimum exhaust rates by reference to ASHRAE 154 or by prescriptive table. The IMC tables specify exhaust rates in CFM per linear foot of hood, with separate values for wall-canopy and island-canopy configurations.

**Enclosure-dependent assumptions:**

1. **The IMC exhaust rate table assumes indoor conditions.** IMC Table 507.2.1 (or equivalent by edition) specifies minimum exhaust rates that are numerically identical to or derived from ASHRAE 154 indoor values. The table makes no distinction between indoor and outdoor installations. A code official applying IMC Table 507.2.1 to an outdoor kitchen would specify an exhaust rate that is 1.7-2.5x too low (per RB-003 outdoor correction factors).

2. **The IMC hood construction requirements assume ceiling proximity.** IMC Section 507.2.5 (or equivalent) specifies that Type I hoods shall be provided with a listed exhaust hood and shall be installed with clearances per the listing. The clearance requirements reference ceiling proximity and wall adjacency — conditions that do not apply outdoors but that affect fire safety and capture performance.

3. **The fire suppression system requirements assume enclosed fire dynamics.** IMC requires fire suppression systems (typically wet chemical) for Type I hoods. These systems are designed for enclosed kitchen fire scenarios where the hood collects grease and fire propagation is constrained by the room geometry. Outdoor fire dynamics differ fundamentally: fire plumes have unlimited air supply, wind feeds the fire, and the suppression system may need to combat a fire in an open-air environment. The IMC fire suppression provisions are not calibrated for outdoor conditions.

#### 3.2.2 Section 508 — Makeup Air

IMC Section 508 requires that exhaust systems be provided with makeup air. The section references ASHRAE 62.1 (Ventilation for Acceptable Indoor Air Quality) and ASHRAE 154 for commercial kitchens. The makeup air must be tempered (heated or cooled) to within a specified range of the room temperature.

**Enclosure-dependent assumptions:**

1. **The requirement for tempered makeup air assumes a conditioned indoor space.** Tempering makeup air is necessary indoors to prevent condensation, thermal discomfort, and disruption of HVAC controls. Outdoors, the "makeup air" is the atmosphere, and tempering is neither possible nor meaningful.

2. **The makeup air volume calculation assumes building envelope leakage models.** The IMC calculation methodology for required makeup air volume considers building envelope tightness, other exhaust systems, and HVAC balance. None of these parameters exist for an outdoor installation.

### 3.3 Assumption Audit: UL 710

UL 710, "Exhaust Hoods for Commercial Cooking Equipment," is the product safety standard to which commercial kitchen exhaust hoods are listed. UL 710 specifies construction requirements, fire testing, and capture efficiency testing. It is the standard referenced by ASHRAE 154 and IMC when they require "listed" hoods.

#### 3.3.1 The UL 710 Capture Test

The UL 710 capture efficiency test is conducted in a controlled test room with specified dimensions, ventilation conditions, and cooking loads. The test measures the ability of the hood to contain cooking effluent under defined conditions.

**Enclosure-dependent assumptions:**

1. **The test room is enclosed.** The UL 710 test is conducted in a room, not in an open environment. The test room provides all six indoor capture advantages: walls, ceiling, pressurization, controlled air supply, absence of wind, and finite dilution volume. The capture efficiency measured under these conditions includes the contribution of all six mechanisms and is not separable into first-pass capture versus recirculation-assisted capture.

2. **The cooking load is a standardized indoor load.** The UL 710 test uses a standardized cooking load (typically involving a defined number of hamburgers, grease, and water) designed to simulate indoor commercial kitchen conditions. The effluent generation rate is calibrated to indoor cooking temperatures and durations. Outdoor cooking conditions — higher heat release rates from charcoal and wood sources, longer cooking durations, and different fuel types — are not represented in the UL 710 test matrix.

3. **The capture efficiency metric includes room recirculation.** As discussed in Section 2.3, the UL 710 test measures steady-state capture efficiency in an enclosed room. Any effluent that escapes the hood on the first pass but is recaptured through ceiling jet recirculation or room air exchange contributes to the reported capture efficiency. The test does not isolate first-pass capture. Outdoors, only first-pass capture matters.

4. **The ambient air is quiescent.** The UL 710 test room has controlled, low-velocity air supply. There is no wind, no directional drafts, and no ambient turbulence beyond the low-level background from the air handling system. The test does not evaluate capture performance under any level of crosswind or ambient turbulence.

#### 3.3.2 The UL 710 Rating and Its Outdoor Interpretation

A hood that passes UL 710 testing receives a listing that specifies, among other parameters, its exhaust rate, cooking capacity, and capture efficiency rating. These ratings are used by specifiers, designers, and building officials as evidence that the hood is "adequate" for a given cooking load.

**The critical misapplication:** When a manufacturer or specifier uses a UL 710 listing to justify an outdoor hood installation, they are implicitly asserting that the capture performance measured in the UL 710 test room will be replicated outdoors. This assertion is false. The UL 710 capture rating overstates outdoor performance because it includes contributions from indoor mechanisms that do not exist outdoors. A hood rated at 85% capture efficiency per UL 710 may achieve only 50-65% first-pass capture in an outdoor environment, depending on wind conditions and installation geometry.

### 3.4 Summary: Enclosure-Dependent Provisions by Standard

The following table summarizes the enclosure-dependent provisions identified across all three standards.

| Standard | Provision | Enclosure Assumption | Outdoor Consequence |
|---|---|---|---|
| ASHRAE 154 Sec. 4 | Exhaust rate tables | Quiescent indoor air; ceiling jet recovery | CFM is 1.7-2.5x too low for outdoor use |
| ASHRAE 154 Sec. 4 | Island canopy multiplier | Room recirculation compensates for no back wall | Multiplier accounts for one lost mechanism; five others remain lost outdoors |
| ASHRAE 154 Sec. 4 | Duty classification | Finite dilution volume; effluent contained in room | Classification is irrelevant to outdoor air quality; all capture must be first-pass |
| ASHRAE 154 Sec. 4 | CFM per linear foot method | Plume constrained by walls in depth dimension | Outdoor plume expands in all directions; linear foot method underestimates |
| ASHRAE 154 Sec. 5 | Makeup air requirement | Enclosed volume; building envelope | No enclosed volume; makeup air is ambient wind |
| ASHRAE 154 Sec. 5 | Pressure balance specification | Building envelope resistance; finite room | No envelope; no pressure differential possible |
| ASHRAE 154 Sec. 6 | Minimum face velocity | Hood suction is dominant air movement | Plume self-delivers; face velocity is not the relevant metric |
| ASHRAE 154 Sec. 6 | Overhang: 6" per side | Wall and ceiling assist compensate | Outdoor requires 15-26" per side (3-4x) |
| IMC 507 | Exhaust rate table | Same as ASHRAE 154 | Same: 1.7-2.5x underspecified |
| IMC 507 | Hood clearance requirements | Ceiling proximity assumed | No ceiling; clearance requirements inapplicable |
| IMC 508 | Tempered makeup air | Conditioned indoor space | Outdoor "makeup air" is uncontrolled atmosphere |
| UL 710 | Capture efficiency test | Enclosed test room; all six mechanisms present | Test overstates outdoor capture by 20-35 percentage points |
| UL 710 | Capture metric | Includes room recirculation | Outdoor capture = first-pass only |
| UL 710 | Test ambient conditions | Quiescent; no wind | No crosswind or turbulence in test |

### 3.5 Quantitative Penalty Analysis: Wall Removal

The absence of walls eliminates wall-guided airflow and plume funneling. The quantitative effect depends on the indoor configuration being replaced.

**Back-wall installation (wall-mounted canopy):**

In a typical indoor installation, the cooking surface is against a back wall. The wall blocks entrainment from the rear, reducing the plume's lateral expansion in the front-to-back dimension by approximately 30%. The wall also redirects room air flowing toward the hood around the sides and over the top of the cooking surface, creating a gentle front-to-back flow that assists capture.

ASHRAE 154 assigns an exhaust rate multiplier of approximately 1.5-2.0x for island canopy (no back wall) relative to wall-mounted canopy configurations. This multiplier quantifies the capture benefit of the back wall within the indoor environment. It represents the penalty for losing one wall while retaining all other indoor mechanisms.

When the installation moves outdoors, both walls are lost (there is no "room" to have walls), plus the other four indoor mechanisms. The penalty compounds:

> Indoor wall-mounted canopy: baseline CFM
> Indoor island canopy (no back wall): 1.5-2.0x baseline CFM
> Outdoor (no walls, no ceiling, no pressurization, no makeup air, no wind shielding, no finite dilution): 1.7-2.5x indoor island CFM, or equivalently 2.6-5.0x the indoor wall-mounted baseline

**Effect on Effective Capture Area:**

RB-002 Section 3.9 established that the effective outdoor capture diameter (with turbulence and wind margins) is 1.3-1.4x the indoor capture diameter. For a back-wall installation, the wall effectively halves the required capture dimension in the front-to-back direction. Removing the wall and all outdoor margins increases the required hood depth by approximately 40-60%.

For hood width (the side-to-side dimension), indoor side walls — when present — provide 10-20% width reduction. Even without side walls (island configuration), the room's finite volume constrains lateral plume dispersal. Outdoors, the absence of all confining surfaces requires the full outdoor margin factor K = 1.70 on the plume capture diameter (RB-002), compared to an indoor island canopy factor of approximately K = 1.0-1.2 (the plume width without outdoor margins).

**Net Effective Capture Area penalty for wall removal (indoor island to outdoor):**

> Hood width increase: approximately 1.3-1.4x (from adding outdoor turbulence and wind margins)
> Hood depth increase: approximately 1.3-1.4x (same factors)
> Total Effective Capture Area increase: approximately 1.7-2.0x (width x depth)
> Estimated Effective Capture Area reduction if hood is not resized: 30-50%

This quantifies the estimated 30-50% reduction in **Effective Capture Area** when an indoor-rated hood of fixed dimensions is moved to an outdoor installation.

### 3.6 Quantitative Penalty Analysis: Ceiling Jet Loss

The loss of the ceiling jet eliminates the secondary capture mechanism that recovers escaped plume gas.

**Indoor ceiling jet recovery fraction:**

The fraction of escaped plume gas that is recaptured via the ceiling jet depends on the room geometry, ceiling height, hood exhaust rate, and room ventilation pattern. Published studies on kitchen ventilation capture efficiency (Kuehn et al., 1989; Swierczyna et al., 2008; Fisher et al., 2012 — ASHRAE research projects RP-1202 and RP-1482) report total capture efficiencies of 85-95% for well-designed commercial hoods, while first-pass capture efficiencies inferred from computational and tracer-gas studies are approximately 65-80%. The difference — 15-30 percentage points — represents the recirculation-assisted capture that the ceiling jet provides.

**Quantitative estimate of ceiling jet contribution:**

If indoor first-pass capture efficiency is 70% and total indoor capture efficiency (including recirculation) is 90%, then the ceiling jet / recirculation recovery fraction is:

> Recovery = (90% - 70%) / (100% - 70%) = 20/30 = 67%

That is, the ceiling jet and room recirculation recover approximately 67% of the initially escaped effluent. This recovery mechanism is entirely absent outdoors.

**CFM implication:**

To achieve the same 90% total capture efficiency outdoors (first-pass only) as the indoor 90% (first-pass + recirculation), the outdoor hood must increase its first-pass capture from 70% to 90%. This requires the hood to intercept a larger fraction of the plume cross-section on the first pass, which in turn requires:

- Larger hood dimensions (to cover the wider outdoor plume including its turbulent excursions)
- Higher exhaust CFM (to ingest the larger plume volume at the wider capture boundary)

The CFM increase required to raise first-pass capture from 70% to 90% is not linear — the marginal plume volume at the outer edges of the Gaussian distribution is large relative to its contaminant content. Based on the Gaussian plume profile analysis in RB-003 Section 3.2, increasing capture from the 70% contour to the 90% contour requires capturing from r = 1.1 * b_T to r = 1.5 * b_T, which adds approximately 27% to the plume area and approximately 30% to the required CFM.

This 30% CFM increase represents the approximate penalty for losing the ceiling jet recovery mechanism. This is consistent with the infiltration factor F_inf = 2.0 derived in RB-003 Appendix D, which implicitly accounts for the need to achieve high first-pass capture without recirculation assistance.

### 3.7 Quantitative Penalty Analysis: Room Pressurization Loss

The loss of room pressurization eliminates the gentle, room-scale drift of air toward the exhaust opening.

**Indoor pressurization effect:**

At the ASHRAE 154-recommended negative pressure of 0.02-0.05 inches WG, the resulting air velocity through typical building envelope leakage paths and controlled openings is approximately 50-150 fpm. Within the kitchen space, this translates to a general drift velocity toward the hood of approximately 10-30 fpm (0.05-0.15 m/s). While this drift velocity is small compared to the plume centerline velocity (200-560 fpm), it is significant at the plume periphery where the local plume velocity is only 20-30 fpm (RB-003 Section 3.2 established that plume edge velocity is only 6% of centerline). The pressure-assisted drift is comparable to or greater than the plume edge velocity, effectively doubling the inward velocity at the plume periphery and preventing edge escape.

**Outdoor equivalent:**

Outdoors, there is no pressure-assisted drift. The plume edge gas (at approximately 20-30 fpm upward velocity) is surrounded by ambient air at rest (in still conditions) or by wind (in typical conditions). There is no background inward flow to assist the hood's edge capture.

**Quantitative penalty:**

The loss of the 10-30 fpm pressure-assisted drift at the plume edge requires the hood's own exhaust-induced edge velocity to compensate. RB-003 Table 3.4a showed that achieving v_edge = 0.15-0.30 m/s (30-60 fpm) at the hood perimeter requires an exhaust flow approximately 1.5-2.0x the bare plume mass flow rate. The infiltration factor F_inf = 2.0 (RB-003) accounts for this requirement.

The pressure-loss penalty is not an additional CFM multiplier on top of F_inf; rather, it is one of the physical reasons why F_inf = 2.0 is necessary outdoors (versus an effective F_inf of approximately 1.3 indoors, where pressure-assisted drift partially substitutes for exhaust-induced edge velocity). The incremental CFM penalty attributable specifically to pressure loss is approximately 10-20% of the total outdoor CFM requirement.

### 3.8 Quantitative Penalty Analysis: Wind Exposure

Wind exposure introduces the single largest variable penalty to outdoor hood performance. The effect is both direct (plume deflection and disruption) and indirect (enhanced entrainment and plume widening).

**RB-003 wind correction factors:**

RB-003 established:
- F_wind = 1.3 for light variable breeze (0-3 mph, typical outdoor residential)
- F_wind = 1.6 for sustained directional wind (3-7 mph, exposed installation)

These factors multiply the plume-based CFM requirement by 30-60% to compensate for wind effects. They translate to a total outdoor correction relative to indoor CFM of:

> K_outdoor_sheltered = 1.7 (sheltered outdoor installation, RB-003 Section 3.9)
> K_outdoor_standard = 2.0 (open patio, light variable breeze)
> K_outdoor_exposed = 2.5 (exposed installation, frequent steady breeze)

**Physical mechanisms of wind penalty:**

1. **Lateral plume deflection.** RB-003 Table 3.10 showed that a 3 mph wind deflects the plume centerline approximately 7 inches at 30-inch mounting height. This shifts the entire plume cross-section, moving the downwind plume edge beyond the hood boundary while creating a **Missed Plume Region** on the upwind side. The hood must be oversized to accommodate the maximum expected deflection from any direction.

2. **Enhanced entrainment.** RB-002 Section 2.5 established that ambient wind increases the effective entrainment coefficient from alpha_0 = 0.11 to alpha_eff = 0.13-0.17, widening the plume by 20-40% relative to still-air conditions. This wider plume requires a proportionally larger hood.

3. **Plume breakup at moderate wind speeds.** At wind speeds above approximately 5 mph (2.2 m/s), the **Buoyant Cooking Plume** begins to deform and break up. The ratio of plume upward velocity to crosswind velocity (the Froude number of the interaction) drops below approximately 1.0, and the plume bends sharply. Wind-affected plumes show increased turbulence, wider spread, reduced centerline concentration, and intermittent separation of contaminant "puffs" from the main plume body. This represents **Wind-Affected Plume Behavior** in its most disruptive form.

4. **Direction variability.** Outdoor wind direction varies on timescales of seconds to minutes. The hood must accommodate deflection from any direction, not just one. This requires symmetric overhang (equal extension on all sides), even if the prevailing wind favors one direction. Asymmetric hood sizing based on prevailing wind direction is unreliable because transient wind shifts routinely occur.

**Quantitative penalty summary (wind exposure):**

| Wind Condition | CFM Multiplier vs. Indoor | Hood Width Multiplier vs. Indoor |
|---|---|---|
| Indoor (quiescent) | 1.0x (reference) | 1.0x (reference) |
| Sheltered outdoor (covered patio, 0-1 mph) | 1.7x | 1.3x |
| Standard outdoor (open patio, 1-3 mph) | 2.0x | 1.4x |
| Exposed outdoor (no cover, 3-7 mph) | 2.5x | 1.5-1.7x |
| High wind (>7 mph) | Impractical | Impractical — wind shielding required |

### 3.9 Indoor Versus Outdoor Comparison Table: Reference Case

The following table provides a side-by-side quantitative comparison for a reference case: a 60,000 BTU large gas grill (Q_c = 12.3 kW, D_eff = 0.58 m) at a 30-inch mounting height. The indoor baseline uses ASHRAE 154 commercial kitchen recommendations for an island canopy hood. The outdoor values use RB-002 and RB-003 recommendations for standard outdoor conditions (K = 1.70, K_CFM = 3.0).

| Parameter | Indoor (ASHRAE 154 Island Canopy) | Outdoor (RB-002/RB-003 Recommended) | Ratio Outdoor/Indoor |
|---|---|---|---|
| **Plume centerline velocity at hood** | 2.25 m/s (443 fpm) | 2.25 m/s (443 fpm) | 1.0 |
| **Plume centerline temperature excess** | 64 K | 64 K | 1.0 |
| **Plume mass flow at hood** | 0.107 kg/s (197 CFM) | 0.107 kg/s (197 CFM) | 1.0 |
| **Effective entrainment coefficient** | 0.11 (quiescent) | 0.13-0.15 (outdoor turbulence) | 1.2-1.4 |
| **Plume capture diameter (time-averaged)** | 1.14 m (45") | 1.14 m (45") | 1.0 |
| **Effective capture diameter (with margins)** | 1.14-1.25 m (45-49") | 1.57 m (62") | 1.3-1.4 |
| **Recommended hood width** | 48-54" (industry practice) | 62" (RB-002 Table 3.6c at 30") | 1.2-1.3 |
| **Recommended hood depth** | 30-36" (industry practice) | 55" (RB-002 Table 3.6c at 30") | 1.5-1.8 |
| **Hood overhang per side** | 6-9" (ASHRAE 154 minimum) | 16" (RB-002 Table 3.6c at 30") | 1.8-2.7 |
| **Minimum exhaust CFM (plume-based)** | 197 CFM (bare plume) | 197 CFM (bare plume) | 1.0 |
| **Total required CFM** | 300-400 CFM (ASHRAE 154, indoor island canopy at 300 CFM/linear foot for 4 ft hood) | 727 CFM (RB-003 Table 3.6a, K_CFM = 3.0) | 1.8-2.4 |
| **Total required CFM (light wind)** | n/a (indoor — no wind) | 892 CFM (RB-003 Table 3.6b, K_CFM = 3.68) | 2.2-3.0 |
| **Face velocity at hood opening** | 50-80 fpm (ASHRAE 154 minimum) | 27 fpm (calculated: 727 CFM / 23.6 sq ft hood) | 0.34-0.54 |
| **Wall-assisted capture** | Yes (back wall at minimum; corner in some layouts) | No | 0 |
| **Ceiling jet recovery** | Yes (ceiling at 8-10 ft) | No | 0 |
| **Room pressurization** | Yes (0.02-0.05" WG negative) | No | 0 |
| **Controlled makeup air** | Yes (50-75 fpm, directed) | No (ambient wind, uncontrolled) | 0 |
| **Crosswind exposure** | None (indoor quiescent) | 0-7 mph typical | Infinite relative penalty |
| **Dilution volume** | 1,620 cu ft (example 12x15x9 kitchen) | Infinite (atmosphere) | Infinite |
| **First-pass capture required for 90% total** | ~70% (recirculation provides ~20 pts recovery) | 90% (no recirculation) | 1.29 |
| **Blower noise at required CFM** | 3-5 sone at 300-400 CFM | 6-12 sone at 727-892 CFM | 2-3x |
| **Duct size required** | 6-8" round (300-400 CFM) | 10-12" round (727-892 CFM) | 1.3-1.5x diameter |

**Key observations from the comparison table:**

1. **The plume itself is identical.** Indoor and outdoor plume parameters (velocity, temperature, mass flow, diameter) are governed by the same physics. The plume does not "know" whether it is indoors or outdoors. The differences arise entirely from the capture environment, not from the plume source.

2. **The CFM difference is 1.8-3.0x.** The outdoor hood requires approximately twice to three times the exhaust rate of the indoor hood for the same source and mounting height. This directly impacts blower size, energy consumption, noise, and duct sizing.

3. **The hood dimension difference is 1.2-1.8x.** The outdoor hood must be substantially wider and deeper than the indoor hood. The depth dimension shows the largest increase (1.5-1.8x) because the indoor back wall provides significant depth-dimension capture assistance that is entirely lost outdoors.

4. **The face velocity is lower outdoors — by design.** The outdoor hood's face velocity (27 fpm) would be "failing" by indoor ASHRAE standards (50 fpm minimum). But this low face velocity is correct for the outdoor physics: the plume self-delivers at 443 fpm centerline velocity, and the hood's purpose is volumetric ingestion, not suction capture (per RB-003 Section 4.1).

5. **The first-pass capture requirement increases by 29%.** The indoor hood achieves 90% total capture with only 70% first-pass capture because recirculation recovers most of the escaped 30%. The outdoor hood must achieve 90% first-pass capture with no recovery assistance. This 29% increase in required first-pass efficiency drives the larger hood dimensions and higher CFM.

### 3.10 Quantitative Penalty Summary: All Mechanisms

The following table consolidates the estimated performance penalty for each lost indoor mechanism, expressed as the additional CFM (or hood dimension increase) required to compensate.

| Lost Mechanism | CFM Penalty Factor | Hood Dimension Penalty Factor | Basis |
|---|---|---|---|
| **Wall-guided airflow (back wall)** | 1.5-2.0x (already in ASHRAE island canopy factor) | 1.1-1.2x (width); 1.3-1.5x (depth) | ASHRAE 154 wall-to-island multiplier; RB-002 wall effect analysis |
| **Ceiling jet recovery** | 1.2-1.3x (increase in first-pass capture requirement) | 1.0-1.1x (marginal effect on dimensions) | First-pass vs. total capture efficiency analysis (Section 3.6) |
| **Room pressurization** | 1.1-1.2x (loss of pressure-assisted edge capture) | 1.0x (no dimensional effect) | Pressure-drift velocity analysis (Section 3.7) |
| **Controlled makeup air** | Included in wind penalty below | 1.0x | Replaced by wind penalty analysis |
| **Crosswind exposure** | 1.3-1.6x (wind correction factor F_wind) | 1.2-1.4x (wind deflection overhang margin) | RB-003 Section 3.9; wind correction factors |
| **Enclosed dilution volume** | Included in first-pass capture requirement | 1.0-1.1x | Shifts capture target from ~70% to ~90% first-pass |
| **Combined (all mechanisms)** | **1.7-2.5x total outdoor/indoor** | **1.3-1.7x total outdoor/indoor** | RB-003 K_outdoor factors; multiplicative interaction |

**Why the combined penalty is less than the product of individual penalties:**

The individual mechanisms interact and overlap. For example, the ceiling jet recovery penalty is partially subsumed by the wind correction factor (because the wind correction also forces higher first-pass capture). The room pressurization penalty is partially subsumed by the infiltration factor. The combined outdoor correction factors (K_outdoor = 1.7 to 2.5) represent the net penalty after accounting for these overlaps, not the arithmetic product of all individual factors.

---

## 4. Implications for Outdoor BBQ Ventilation

### 4.1 Indoor CFM Ratings Are Systematically Misleading for Outdoor Use

When outdoor range hood manufacturers advertise CFM ratings derived from indoor testing or from ASHRAE 154 indoor specifications, they systematically understate the CFM required for outdoor capture. The magnitude of the understatement is 1.7-2.5x, depending on the installation conditions.

A manufacturer who advertises a "600 CFM outdoor hood" based on ASHRAE 154 indoor island canopy specifications is providing a product that:

- Is adequately sized for a medium gas grill (Q_c = 8.2 kW) indoors at 30 inches (ASHRAE 154 specifies approximately 300-400 CFM)
- Is marginally adequate for a small gas grill (Q_c = 5.1 kW) outdoors at 30 inches on a sheltered patio (RB-003 requires 500 CFM)
- Is inadequate for a medium gas grill outdoors at 30 inches (RB-003 requires 609 CFM standard, 747 CFM with light wind)
- Is grossly inadequate for a large gas grill outdoors at 30 inches (RB-003 requires 727 CFM standard, 892 CFM with light wind)

The consumer who selects a 600 CFM hood for a large gas grill at 30 inches — a common residential installation — will have a system that can capture only approximately 50-70% of the plume under standard outdoor conditions. The remaining 30-50% escapes as smoke and odor, which the consumer experiences as "the hood doesn't work."

### 4.2 Indoor Hood Sizes Are Systematically Undersized for Outdoor Use

The same analysis applies to hood dimensions. Indoor practice specifies hood overhang of 6-9 inches per side, resulting in hoods that are 12-18 inches wider than the cooking surface. Outdoor practice requires 15-26 inches per side (RB-002), resulting in hoods that are 30-52 inches wider than the cooking surface.

A 48-inch outdoor hood — a common consumer product — is adequate for:
- A small gas grill (18-inch cooking surface) at 18-24 inches mounting height
- A pellet smoker at most mounting heights

A 48-inch hood is inadequate for:
- A medium or large gas grill at any standard mounting height (30+ inches)
- A charcoal kettle at any standard mounting height
- A wood-fired grill at any mounting height

The mismatch between market-standard hood sizes (36-48 inches) and the physics-based requirement (54-74 inches for medium to large sources at 30 inches) is a direct consequence of applying indoor sizing assumptions to outdoor installations. The indoor assumptions allow smaller hoods because walls, ceilings, and room recirculation compensate for limited hood coverage. Without these compensating mechanisms, the hood must physically cover the entire expanded plume, and the resulting dimensions are substantially larger than indoor practice suggests.

### 4.3 UL 710 Capture Ratings Overstate Outdoor Performance

A UL 710 capture efficiency rating of 85-95% measured in an enclosed test room does not predict outdoor capture performance. The outdoor first-pass capture efficiency for the same hood, at the same CFM, over the same source, will be approximately 50-70% — a 20-35 percentage point reduction — because:

- The UL 710 test room provides ceiling jet recovery (worth approximately 15-25 percentage points of capture improvement)
- The UL 710 test room is quiescent (no wind to deflect the plume or strip the plume periphery)
- The UL 710 test room has controlled makeup air (no turbulent ambient air disrupting the capture flow field)
- The UL 710 test room has finite volume (escaped effluent is eventually recaptured)

Until a UL standard is developed that tests hoods under open-air conditions with representative wind exposure, UL 710 ratings should not be used as evidence of outdoor capture capability.

### 4.4 The Face Velocity Misconception

Indoor ventilation practice emphasizes face velocity (fpm at the hood opening) as a primary performance metric. ASHRAE 154 specifies minimum face velocities of 50-100 fpm depending on duty class. This metric is meaningful indoors where the hood's suction must actively pull slowly drifting contaminants from the surrounding quiescent air.

Outdoors, face velocity is not the relevant metric. RB-003 Section 4.1 demonstrated that the plume delivers itself at 200-560 fpm centerline velocity — far exceeding any reasonable face velocity specification. The outdoor hood's face velocity is typically 25-35 fpm (calculated as total CFM divided by hood area), which would be classified as "grossly inadequate" by indoor standards. Yet the physics analysis confirms these low face velocities are correct: the outdoor hood's function is volumetric ingestion of a self-delivering plume, not suction capture of a passively dispersing contaminant.

Consumers and designers who evaluate outdoor hoods by face velocity will systematically mis-specify the system. A high face velocity (achieved by using a small hood with a powerful blower) does not improve outdoor capture — it may actually degrade it, because the small hood cannot cover the plume's lateral extent regardless of how fast it pulls air through its undersized opening. This is the geometry-limited failure described in RB-002 Section 4.1: no amount of exhaust velocity compensates for insufficient hood area.

### 4.5 The Makeup Air Irrelevance

ASHRAE 154 Section 5 devotes substantial attention to makeup air system design: supply rates, delivery velocities, tempering requirements, and balance with exhaust. For outdoor installations, the entire makeup air framework is inapplicable. The atmosphere provides unlimited makeup air. There is no room to pressurize or depressurize. There is no building envelope to balance.

The practical consequence is that the ASHRAE 154 makeup air provisions should be neither applied nor referenced for outdoor installations. An outdoor hood specification consists of two parameters: the hood dimensions (from RB-002) and the exhaust CFM (from RB-003). There is no third parameter for makeup air design.

However, the absence of controlled makeup air is itself a performance penalty (Mechanism 4). The indoor makeup air system creates a gentle, predictable inward flow that assists capture. Outdoors, this beneficial flow is replaced by chaotic wind, which disrupts capture. The penalty is already embedded in the outdoor correction factors (K_outdoor = 1.7 to 2.5). Explicitly, the loss of controlled makeup air is one of the physical reasons why the outdoor CFM correction factor exceeds 1.0.

### 4.6 Code Compliance Does Not Equal Performance

A code-compliant outdoor kitchen installation that follows IMC Chapter 5 prescriptive exhaust rates (derived from ASHRAE 154 indoor tables) will have:

- An exhaust rate that is 1.7-2.5x too low for the outdoor environment
- A hood that is 30-50% too narrow for the outdoor plume
- A capture efficiency that is 20-35 percentage points below the UL 710 rating
- No makeup air system (correctly omitted) but also no accounting for the resulting performance penalty

The installation will pass code inspection because the code does not distinguish between indoor and outdoor environments for kitchen ventilation. The homeowner will experience chronic smoke and odor escape that they may attribute to a "defective hood" when in fact the hood is performing exactly as physics predicts for an indoor-rated system operating in an outdoor environment.

This represents a gap in the existing code framework, not a failure of any individual product. The codes were developed for indoor environments and have not been updated to address the rapidly growing outdoor kitchen market. The identification and proposed resolution of this gap is addressed in RB-010.

---

## 5. Knowledge Gaps or Opportunities

### 5.1 Well-Established Knowledge

The following aspects of the indoor-versus-outdoor performance difference are well-established and form a reliable basis for the analysis in this paper:

1. **The six indoor capture mechanisms** (walls, ceiling jet, pressurization, controlled makeup air, absence of wind, finite dilution) are well-understood in ventilation engineering. Their individual effects on capture performance are documented in ASHRAE research (RP-1202, RP-1482) and in the fire science literature (Alpert, Heskestad).

2. **The ASHRAE 154 island canopy multiplier** (1.5-2.0x relative to wall-mounted) quantifies the effect of losing one wall within an otherwise enclosed environment. This multiplier is validated by ASHRAE-sponsored research in test kitchens.

3. **The UL 710 test environment is enclosed.** This is not disputed; it is the explicit design of the test protocol. The enclosure dependence of the capture efficiency measurement is a direct observation.

4. **Outdoor buoyant plume physics** is well-characterized by the Heskestad correlations and MTT entrainment theory, as established in RB-001 and RB-002. The plume itself behaves identically indoors and outdoors in still-air conditions.

5. **Wind effects on plume behavior** are well-established in atmospheric dispersion science and fire plume research (Briggs, 1984; Beyler, 1986). The qualitative effects (deflection, enhanced entrainment, plume breakup) are not in dispute.

### 5.2 Areas of Moderate Uncertainty

1. **The indoor first-pass capture efficiency.** The partition between first-pass capture and recirculation-assisted capture in indoor hoods is not directly measured by UL 710 or by most ASHRAE capture efficiency tests. The estimates used in this paper (70% first-pass, 90% total) are based on computational studies and inferred from tracer-gas data. The uncertainty is approximately plus or minus 10 percentage points on each value.

2. **The ceiling jet recovery fraction.** The estimate that ceiling jet and room recirculation recover 50-67% of initially escaped effluent is based on computational and simplified analytical models. Direct measurement under controlled conditions would refine this value. The recovery fraction likely varies significantly with kitchen geometry, hood-to-ceiling distance, and exhaust rate.

3. **The wall-effect magnitude.** The ASHRAE 154 island-to-wall canopy multiplier of 1.5-2.0x is an empirical range, not a precise value. The actual multiplier depends on wall distance, wall height, and the relative position of the cooking surface. The 30-50% **Effective Capture Area** reduction estimated for wall removal is consistent with this range but carries approximately plus or minus 15% uncertainty.

4. **The outdoor correction factor K_outdoor.** The values of 1.7, 2.0, and 2.5 (from RB-003 Section 3.9) are derived from theoretical plume models with semi-empirical correction factors. They have not been validated by experimental measurement on actual outdoor cooking installations. They should be treated as engineering estimates until validation data are available.

### 5.3 Knowledge Gaps Requiring Further Research

1. **No published experimental comparison of indoor versus outdoor capture efficiency for the same hood, source, and exhaust rate.** The entire analysis in this paper is based on theoretical models and inferred data. A controlled experiment — testing the same hood over the same cooking source at the same CFM, first in an enclosed room and then in an open-air environment — would provide direct validation of the indoor-to-outdoor penalty factors. This is the single most valuable experiment that could be conducted for this research program.

2. **No outdoor-specific test standard for range hood capture efficiency.** UL 710 tests in an enclosed room. ASTM E3087 tests in an enclosed room. There is no published standard for testing capture efficiency under outdoor conditions (open-air, with representative wind exposure). The development of such a standard is identified as a priority gap in RB-010.

3. **No published data on ceiling jet recovery fraction for kitchen ventilation.** While ceiling jet physics is well-established for fire sprinkler and smoke detector activation, its contribution to kitchen ventilation capture efficiency has not been isolated experimentally. The 50-67% recovery fraction used in this paper is an estimate.

4. **The pressure-assisted capture effect has not been quantified independently.** The contribution of room negative pressure (0.02-0.05 inches WG) to hood capture efficiency has not been isolated from other room effects in published research. The 10-20% CFM penalty estimated in this paper is based on edge-velocity analysis, not on direct measurement.

5. **Interaction effects between multiple lost mechanisms are not quantified.** This paper treats the six indoor mechanisms as partially overlapping effects and estimates the combined penalty as less than the product of individual penalties. The actual interaction effects — how much ceiling jet recovery depends on wall presence, how much pressure-assisted capture depends on wind absence — have not been experimentally characterized. The combined penalty (K_outdoor = 1.7 to 2.5) is an engineering estimate of the net effect.

6. **No manufacturer publishes indoor-versus-outdoor performance data.** Outdoor range hood manufacturers do not disclose whether their CFM ratings, capture efficiency claims, or sizing recommendations are based on indoor testing, outdoor testing, or theoretical extrapolation. The consumer has no basis for evaluating whether a manufacturer's claims are appropriate for outdoor use. This disclosure gap is addressed in RB-010.

7. **Dynamic wind effects on capture.** The analysis in this paper treats wind as a quasi-steady correction factor. Real outdoor wind is gusty and directional, creating transient capture failures that may be more severe than the steady-state correction suggests. Time-resolved capture efficiency under realistic wind conditions is a knowledge gap.

---

## 6. Diagram Mapping Notes (Text Only)

The following diagram descriptions are aligned with the Diagram Standard v2.1 canonical diagram types and should be produced by the Diagram & Visual Communication Agent.

### Diagram 6.1: The Six Indoor Capture Mechanisms (Diagram Type 4 — Conceptual/Comparative)

**Purpose:** Illustrate the six physical mechanisms that assist capture indoors, showing their operation within an enclosed kitchen and their absence outdoors.

**Content:**
- Left panel: enclosed kitchen cross-section showing:
  - Back wall with arrows indicating redirected airflow toward hood
  - Ceiling with arrows showing ceiling jet spreading horizontally and recirculating down to hood
  - Room volume with pressure arrows (inward through door/window) indicating negative pressure assist
  - Controlled makeup air supply diffusers with gentle, directed arrows
  - Still-air label: "No crosswind — plume rises vertically"
  - Finite room volume notation: "1,620 cu ft — contaminants contained"
  - Hood at 30 inches above cooktop with high capture percentage annotation
- Right panel: outdoor open-air installation showing:
  - No walls — 360-degree open boundary with full entrainment arrows
  - No ceiling — plume rising freely with arrows indicating irreversible escape
  - "Atmospheric pressure" label — no negative pressure possible
  - Wind arrows from multiple directions disrupting the plume
  - Infinite atmosphere notation: "Escaped plume = permanently lost"
  - Wider hood at 30 inches with lower capture percentage annotation
- Center: six mechanism labels with checkmarks (indoor) and X marks (outdoor)
- Figure caption: "Figure 4.1: The six indoor capture mechanisms and their absence outdoors. Indoor hoods benefit from wall-guided airflow, ceiling jet recovery, room pressurization, controlled makeup air, quiescent conditions, and finite dilution volume. None of these mechanisms exist in an outdoor open-boundary environment."

### Diagram 6.2: Effective Capture Area — Indoor Versus Outdoor (Diagram Type 3 — Hood-Plume Geometry)

**Purpose:** Show how the same physical hood has a different **Effective Capture Area** indoors versus outdoors.

**Content:**
- Plan view (top-down) showing a 48-inch hood over a large gas grill cooking surface
- Left: indoor installation
  - Plume cross-section at 30 inches: 45-inch diameter (quiescent)
  - Hood easily encompasses plume with 1.5-inch margin per side
  - Back wall shown as solid boundary constraining rear plume expansion
  - Label: "48-inch hood: adequate indoors. **Effective Capture Area** exceeds plume."
- Right: outdoor installation
  - Plume cross-section at 30 inches: 62-inch effective diameter (with outdoor margins)
  - Hood fails to encompass full plume — **Missed Plume Region** shown in red on all four sides
  - No walls — plume expands freely in all directions
  - Wind arrow showing additional plume displacement
  - Label: "Same 48-inch hood: inadequate outdoors. **Missed Plume Region** = 30-50% of plume area."
- Dimension annotations showing the 45" indoor plume vs. 62" outdoor plume
- Figure caption: "Figure 4.2: The same 48-inch hood provides adequate **Effective Capture Area** indoors (left) but creates a substantial **Missed Plume Region** outdoors (right). The outdoor plume is wider due to unrestricted entrainment, ambient turbulence, and wind margins. A 62-inch hood is required outdoors for the same source at the same mounting height."

### Diagram 6.3: Indoor Versus Outdoor CFM Comparison Chart (Diagram Type 2 — Quantitative Chart)

**Purpose:** Provide a quantitative bar chart comparing indoor and outdoor CFM requirements for the reference case (60,000 BTU gas grill at 30-inch mounting height).

**Content:**
- X-axis: configuration categories (Indoor Wall-Mounted, Indoor Island, Outdoor Sheltered, Outdoor Standard, Outdoor Exposed)
- Y-axis: required CFM (0 to 1200)
- Bars:
  - Indoor wall-mounted: approximately 250 CFM (ASHRAE 154 wall canopy)
  - Indoor island: approximately 400 CFM (ASHRAE 154 island canopy)
  - Outdoor sheltered: approximately 600 CFM (K_outdoor = 1.7)
  - Outdoor standard: approximately 730 CFM (K_outdoor = 2.0)
  - Outdoor exposed: approximately 900 CFM (K_outdoor = 2.5)
- Annotation arrows showing the multiplier between each step:
  - Wall to island: "1.6x — losing back wall"
  - Island to outdoor sheltered: "1.5x — losing ceiling jet, pressurization, makeup air control"
  - Outdoor sheltered to standard: "1.2x — increasing wind exposure"
  - Outdoor standard to exposed: "1.25x — sustained wind"
- Total multiplier annotation: "Indoor wall-mounted to outdoor exposed: 3.6x total CFM increase"
- Figure caption: "Figure 4.3: Required exhaust CFM for a 60,000 BTU gas grill at 30-inch mounting height across five installation configurations. Moving from a wall-mounted indoor installation to an exposed outdoor installation requires a 3.6x increase in exhaust flow rate to maintain equivalent capture performance."

### Diagram 6.4: Ceiling Jet Recovery Mechanism (Diagram Type 1 — Plume/Flow Profile)

**Purpose:** Illustrate the ceiling jet recovery mechanism in detail, showing how escaped plume gas is recaptured indoors but lost outdoors.

**Content:**
- Left: indoor cross-section
  - **Buoyant Cooking Plume** rising from cooking surface
  - Hood at 30 inches capturing approximately 70% of plume (first pass)
  - 30% of plume escaping past hood edges (shown as thin plume streams)
  - Escaped plume reaching ceiling (shown as ceiling jet spreading radially)
  - Ceiling jet encountering walls and turning downward
  - Recirculating flow arrows showing escaped gas returning to hood vicinity
  - "67% of escaped gas recaptured" annotation
  - "Net capture: 70% + (67% x 30%) = 90%" annotation
- Right: outdoor cross-section
  - Same plume and hood
  - 30% of plume escaping past hood edges
  - Escaped plume rising freely — "No ceiling: permanent loss" annotation
  - Dispersion arrows showing **Open-Boundary Dilution**
  - "0% of escaped gas recaptured" annotation
  - "Net capture: 70% + 0% = 70%" annotation
- Figure caption: "Figure 4.4: The ceiling jet recovery mechanism. Indoors (left), escaped plume gas is collected by the ceiling jet and partially recirculated back to the hood, boosting total capture from 70% first-pass to approximately 90%. Outdoors (right), escaped gas disperses irreversibly through **Open-Boundary Dilution**, and total capture equals first-pass capture only."

### Diagram 6.5: Wind-Affected Plume Behavior Penalty (Diagram Type 3 — Hood-Plume Geometry)

**Purpose:** Show how wind deflects the plume and creates a **Missed Plume Region** that does not exist indoors.

**Content:**
- Front cross-section view showing hood at 30 inches above cooking surface
- Left: indoor (no wind)
  - Plume rises vertically, centered under hood
  - Symmetric capture — plume fully within **Capture Envelope**
  - Label: "No wind: plume centered, fully captured"
- Right: outdoor (3 mph wind from left)
  - Plume deflected approximately 7 inches to the right
  - Right edge of plume extends beyond hood boundary — **Missed Plume Region** shown in red
  - Left side of hood has increased gap between plume and hood edge — ambient air short-circuit
  - Wind arrows showing lateral flow
  - Plume edge stripping: "Plume edge velocity 24 fpm << wind 264 fpm"
  - Label: "3 mph wind: plume displaced 7 inches, 15-25% of plume escapes downwind"
- Dimension annotations showing the 7-inch deflection
- Figure caption: "Figure 4.5: **Wind-Affected Plume Behavior** at 3 mph crosswind. The plume centerline shifts approximately 7 inches at 30-inch mounting height, moving the downwind plume edge beyond the hood boundary. The plume periphery, where local velocity is only 24 fpm, is easily stripped by the 264 fpm wind. This wind-induced failure mode does not exist in the quiescent indoor environment."

### Diagram 6.6: Standards Applicability Map (Diagram Type — New: Standards Matrix)

**Purpose:** Provide a visual summary of which provisions of ASHRAE 154, IMC, and UL 710 apply, partially apply, or do not apply to outdoor installations.

**Content:**
- Three-column layout: ASHRAE 154 | IMC Chapter 5 | UL 710
- Rows for each major provision:
  - Exhaust rate tables: RED (do not apply — underspecified for outdoor)
  - Hood construction: YELLOW (partially applies — materials, grease containment OK; overhang, face velocity not applicable)
  - Makeup air: RED (does not apply — no enclosed volume)
  - Fire suppression: YELLOW (partially applies — system needed but fire dynamics differ)
  - Duct materials: GREEN (applies — same fire resistance needed)
  - Capture efficiency test: RED (does not apply — enclosed test room, quiescent conditions)
  - Capture efficiency rating: RED (misleading outdoors — overstates outdoor performance by 20-35 points)
- Legend: GREEN = applies directly to outdoor; YELLOW = partially applicable with modification; RED = does not apply or is misleading
- Figure caption: "Figure 4.6: Applicability of indoor kitchen ventilation standards to outdoor installations. Provisions shown in red assume enclosed environments and produce misleading results when applied outdoors. Only materials and construction provisions (green) transfer directly."

---

## Appendix A: Standards References

| Standard | Edition | Relevant Sections | Publisher |
|---|---|---|---|
| ASHRAE Standard 154 | 2016 | Sections 4 (Exhaust), 5 (Makeup Air), 6 (Hood Construction) | ASHRAE |
| International Mechanical Code (IMC) | 2021 | Chapter 5 (Exhaust Systems), Sections 507 (Commercial Hoods), 508 (Makeup Air) | ICC |
| UL 710 | 7th Edition | Capture Efficiency Test, Fire Test, Construction | UL LLC |
| ASTM E3087 | 2018 | Standard Test Method for Measuring Capture Efficiency of Residential Range Hoods | ASTM International |
| ASHRAE Handbook — HVAC Applications | 2019 | Chapter 33: Kitchen Ventilation | ASHRAE |
| NFPA 96 | 2021 | Standard for Ventilation Control and Fire Protection of Commercial Cooking Operations | NFPA |
| ASHRAE RP-1202 | 2008 | Effluent from Commercial Kitchen Hoods (Swierczyna et al.) | ASHRAE |
| ASHRAE RP-1482 | 2012 | Optimizing the Design of Commercial Kitchen Ventilation Systems (Fisher et al.) | ASHRAE |

## Appendix B: Quantitative Inputs from Prior Papers

All plume parameters for the reference case (60,000 BTU large gas grill, Q_c = 12.3 kW, D_eff = 0.58 m) at 30-inch (0.76 m) mounting height:

| Parameter | Value | Source |
|---|---|---|
| Convective heat release rate Q_c | 12.3 kW | RB-001 Table 3.1 |
| Effective source diameter D_eff | 0.58 m (23") | RB-001 Table 3.1 |
| Virtual origin z_0 | -0.41 m | RB-001 Table 3.2 |
| Flame height L_f | 0.14 m (5.5") | RB-001 Table 3.2 |
| Effective height (z - z_0) at 30" | 1.17 m | Calculated |
| Centerline velocity u_0 | 2.25 m/s (443 fpm) | RB-001 Table 3.5 |
| Centerline temperature excess Delta_T_0 | 64 K | RB-001 Table 3.4 |
| Plume capture diameter d_capture | 1.14 m (45") | RB-001 Table 3.6 |
| Plume mass flow m_dot_p | 0.107 kg/s | RB-001 Table 3.7 |
| Plume mass flow (CFM) | 197 CFM | RB-003 Table 3.5 |
| Recommended hood width (outdoor, K=1.70) | 1.57 m (62") | RB-002 Table 3.6c |
| Recommended hood depth (outdoor) | 1.40 m (55") | RB-002 Table 3.6c |
| Required overhang per side | 0.41 m (16") | RB-002 Table 3.6c |
| Required CFM (standard outdoor, K_CFM=3.0) | 727 CFM | RB-003 Table 3.6a |
| Required CFM (light wind, K_CFM=3.68) | 892 CFM | RB-003 Table 3.6b |
| Outdoor margin factor K | 1.70 | RB-002 Section 3.5 |
| Outdoor CFM correction (sheltered) | 1.7x indoor | RB-003 Section 3.9 |
| Outdoor CFM correction (standard) | 2.0x indoor | RB-003 Section 3.9 |
| Outdoor CFM correction (exposed) | 2.5x indoor | RB-003 Section 3.9 |

## Appendix C: Glossary Terms Used in This Paper

The following Glossary v1.1 terms are used in this paper with the meanings defined in the glossary:

| Term | Context of Use |
|---|---|
| **Buoyant Cooking Plume** | The thermally driven plume from the cooking surface — identical physics indoors and outdoors |
| **Entrainment Zone** | The plume boundary region where ambient air is drawn in — operates through 360 degrees outdoors versus restricted angle indoors |
| **Near-Field Plume Region** | The combustion zone near the source — not relevant at hood heights (RB-001 finding) but referenced for completeness |
| **Velocity Decay** | The z^(-1/3) centerline velocity reduction — identical indoors and outdoors |
| **Capture Envelope** | The three-dimensional region from which the hood can draw plume gas — smaller outdoors due to loss of wall assistance |
| **Effective Capture Area** | The portion of the hood opening that actively intercepts plume gas — reduced 30-50% when walls are removed |
| **Plume Interception Plane** | The horizontal plane at hood height where the plume is intercepted — same elevation indoors and outdoors |
| **Momentum-Limited Capture** | Capture failure due to insufficient hood suction relative to plume momentum — manifests as edge escape outdoors |
| **Missed Plume Region** | The portion of the plume cross-section beyond the hood boundary — larger outdoors due to wider plume and no wall containment |
| **Open-Boundary Dilution** | Three-dimensional atmospheric dispersion of escaped plume gas — the defining outdoor condition; does not exist indoors |
| **Wind-Affected Plume Behavior** | Plume deflection, widening, and breakup due to crosswind — absent indoors by definition |

---

## References

1. ASHRAE (2016). *ASHRAE Standard 154-2016: Ventilation for Commercial Cooking Operations*. American Society of Heating, Refrigerating and Air-Conditioning Engineers.

2. International Code Council (2021). *2021 International Mechanical Code*. ICC.

3. UL LLC (2019). *UL 710: Exhaust Hoods for Commercial Cooking Equipment*, 7th Edition. Underwriters Laboratories.

4. ASHRAE (2019). *ASHRAE Handbook — HVAC Applications*, Chapter 33: Kitchen Ventilation. ASHRAE.

5. ASTM International (2018). *ASTM E3087-18: Standard Test Method for Measuring Capture Efficiency of Residential Range Hoods*. ASTM.

6. NFPA (2021). *NFPA 96: Standard for Ventilation Control and Fire Protection of Commercial Cooking Operations*. National Fire Protection Association.

7. Alpert, R.L. (1972). "Calculation of Response Time of Ceiling-Mounted Fire Detectors." *Fire Technology*, 8, pp. 181-195.

8. Heskestad, G. and Delichatsios, M.A. (1978). "The Initial Convective Flow in Fire." *17th Symposium (International) on Combustion*, pp. 1113-1123. The Combustion Institute.

9. Heskestad, G. (2016). "Fire Plumes, Flame Height, and Air Entrainment." Chapter 13, *SFPE Handbook of Fire Protection Engineering*, 5th ed. Springer.

10. Morton, B.R., Taylor, G.I., and Turner, J.S. (1956). "Turbulent gravitational convection from maintained and instantaneous sources." *Proceedings of the Royal Society A*, 234, pp. 1-23.

11. Swierczyna, R.T., Sobiski, P.A., and Fisher, D.T. (2008). "Revised Heat Gain and Capture and Containment Exhaust Rates from Cooking Equipment." ASHRAE Research Project RP-1202. ASHRAE.

12. Fisher, D.T., Swierczyna, R.T., and Sobiski, P.A. (2012). "Optimizing the Design of Commercial Kitchen Ventilation Systems." ASHRAE Research Project RP-1482. ASHRAE.

13. Kuehn, T.H., Ramsey, J.W., and Olsen, R.L. (1989). "Effect of Supply Air Temperature, Exhaust Rate, and Cooking Process on Kitchen Hood Performance." ASHRAE Transactions, 95(1).

14. Briggs, G.A. (1984). "Plume rise and buoyancy effects." In *Atmospheric Science and Power Production*, ed. D. Randerson, DOE/TIC-27601.

15. ACGIH (2019). *Industrial Ventilation: A Manual of Recommended Practice for Design*, 30th ed. American Conference of Governmental Industrial Hygienists.

16. Drysdale, D. (2011). *An Introduction to Fire Dynamics*, 3rd ed. John Wiley & Sons.

17. Pasquill, F. and Smith, F.B. (1983). *Atmospheric Diffusion*, 3rd ed. Ellis Horwood.

---

*This document is a research output of the Outdoor Ventilation Standard, governed by the Research Program Charter v2.6. All terms are used as defined in Glossary v1.1. This paper synthesizes the foundational findings of RB-001, RB-002, and RB-003 into a standards-focused analysis and provides the basis for RB-007 (Failure Modes of Outdoor BBQ Hoods) and RB-010 (Gaps in Existing Standards, Codes, and Consumer Guidance).*
