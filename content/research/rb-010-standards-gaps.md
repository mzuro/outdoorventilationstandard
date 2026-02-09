---
title: "RB-010: Gaps in Existing Standards, Codes, and Consumer Guidance"
date: 2026-01-08
lastmod: 2026-01-26
draft: false
type: "research"
series: "Outdoor Ventilation Standard"
research_id: "RB-010"
priority: "P3 — Guidance"
status: "Complete"
version: "1.0"
charter_version: "2.6"
glossary_version: "1.1"
diagram_standard_version: "2.1"
dependencies: "RB-004, RB-007"
downstream_topics:
  - "RB-008: CFM Requirements for Outdoor Cooking Ventilation (cross-reference)"
description: "Systematic review of existing ventilation standards (ASHRAE 154, IMC, UL 710, local building codes) and consumer-facing guidance to identify where outdoor BBQ ventilation is unaddressed, under-addressed, or addressed with indoor-derived assumptions. Documents specific gaps in standards coverage, codes enforcement, test methods, and consumer information. Proposes areas where new guidance, revised standards language, and outdoor-specific test protocols are needed."
summary: "This paper conducts a systematic gap analysis across the principal ventilation standards (ASHRAE 154, IMC Chapter 5, UL 710, NFPA 96), representative local building codes, and consumer-facing guidance materials (manufacturer literature, retailer guidance, online references). Building on the indoor-versus-outdoor assumption audit of RB-004 and the failure mode taxonomy of RB-007, this paper identifies thirteen specific gaps organized into four categories: standards gaps (no outdoor-specific exhaust rates, no outdoor capture test, no wind correction provisions, no outdoor hood classification); code gaps (no indoor/outdoor distinction in prescriptive tables, no outdoor-specific inspection criteria, inconsistent local amendments); test method gaps (no open-air capture efficiency protocol, no wind-exposure test, no outdoor cooking load standard); and consumer guidance gaps (no physics-based sizing information, misleading indoor-derived CFM claims, absent mounting height guidance, absent wind exposure assessment). For each gap, the paper documents the current state, the specific deficiency, the consequence for outdoor installations, and the proposed resolution path."
tags: ["standards analysis", "code gaps", "ASHRAE"]
categories: ["P3 — Frontier"]
---

**Research Program:** Outdoor Ventilation Standard
**Charter Version:** 2.6
**Glossary Version:** 1.1
**Priority Tier:** P3 — Guidance
**Author Role:** Standards & Codes Analysis Agent
**Date:** 2026-02-08
**Depends On:** RB-004: Why Indoor Ventilation Assumptions Fail Outdoors; RB-007: Failure Modes of Outdoor BBQ Hoods

---

## 1. Topic Definition

This paper conducts a systematic review of existing ventilation standards, building codes, and consumer-facing guidance to identify where outdoor barbecue ventilation is unaddressed, under-addressed, or addressed with indoor-derived assumptions that do not transfer to open-boundary environments. The review encompasses the principal national standards (ASHRAE Standard 154, International Mechanical Code Chapter 5, UL 710, NFPA 96), representative local building code amendments, and the consumer information ecosystem (manufacturer product literature, retailer guidance, online reference sources, installation manuals).

RB-004 established that six indoor capture mechanisms are absent outdoors, producing a combined penalty of 1.7 to 2.5 times in required CFM and 1.3 to 1.7 times in required hood dimensions. RB-007 cataloged six primary failure modes of outdoor hoods and identified that the most common compound failure — an indoor-rated hood applied outdoors without correction (FM-1 + FM-3) — is a direct consequence of the standards gap documented in this paper. The present paper completes the causal chain: from the physics of indoor-to-outdoor performance loss (RB-004), through the operational failure modes that result (RB-007), to the specific gaps in standards, codes, and guidance that permit these failures to persist in the installed base.

The scope encompasses:

1. **Standards gap analysis.** Identification of specific provisions in ASHRAE 154, IMC Chapter 5, UL 710, and NFPA 96 where outdoor cooking ventilation is absent, explicitly excluded, or covered only by indoor-derived provisions that are physically inappropriate for open-boundary environments.

2. **Building code gap analysis.** Review of how national model codes and representative local amendments treat outdoor kitchen ventilation, with attention to whether code enforcement distinguishes between indoor and outdoor installations.

3. **Test method gap analysis.** Identification of the absence of outdoor-specific test protocols for hood capture efficiency, exhaust rate adequacy, and wind-exposure performance.

4. **Consumer guidance gap analysis.** Review of manufacturer product literature, retailer sizing guidance, and publicly accessible reference materials to identify where consumers receive information that omits the physics of outdoor plume behavior, wind effects, mounting height penalties, and the indoor-to-outdoor performance difference.

5. **Gap taxonomy and resolution proposals.** Organization of all identified gaps into a structured taxonomy and, for each gap, a proposed resolution path specifying the type of action needed (new standard provision, revised code language, new test method, consumer disclosure requirement).

### Relationship to Prior Research

RB-004 provided the assumption-by-assumption audit of ASHRAE 154, IMC Chapter 5, and UL 710, identifying every enclosure-dependent provision. This paper builds on that audit by extending the scope from "what assumptions fail" to "what is missing entirely" — identifying not only provisions that fail outdoors, but also provisions that should exist for outdoor installations and do not. RB-007 provided the failure mode taxonomy, establishing that the most common failures (FM-1: inadequate overhang; FM-2: excessive mounting height; FM-3: insufficient exhaust rate) are direct consequences of the absent outdoor guidance. This paper traces each failure mode to its originating gap in standards, codes, or consumer information.

### Problem Framing

The outdoor kitchen market has expanded substantially over the past two decades. Outdoor cooking appliances, countertops, cabinetry, and ventilation hoods are widely available consumer products. Yet the regulatory and standards framework that governs indoor kitchen ventilation has not been extended to address the fundamentally different physics of outdoor operation. The result is a gap between what the standards specify, what the codes enforce, what the manufacturers claim, and what the physics requires. This gap is the root cause of the systematic underperformance documented in RB-004 and the failure modes cataloged in RB-007.

This paper makes the gap explicit, documents its dimensions, and proposes pathways for closure.

---

## 2. Relevant Physical Principles

### 2.1 The Indoor-to-Outdoor Performance Differential: Quantitative Summary

RB-004 established the quantitative penalties imposed when indoor ventilation assumptions are applied to outdoor installations. These penalties are the physical basis for every standards gap identified in this paper.

**Summary of RB-004 penalty factors (reference case: 60,000 BTU gas grill, Q_c = 12.3 kW, 30-inch mounting height):**

| Parameter | Indoor Value | Outdoor Required | Ratio |
|---|---|---|---|
| Exhaust CFM | 300-400 (ASHRAE 154 island canopy) | 727 (standard outdoor) to 892 (light wind) | 1.8-3.0x |
| Hood width | 48-54 inches (industry practice) | 62 inches (RB-002 recommended) | 1.2-1.3x |
| Hood depth | 30-36 inches (industry practice) | 55 inches (RB-002 recommended) | 1.5-1.8x |
| Overhang per side | 6-9 inches (ASHRAE 154 minimum) | 16 inches (RB-002 recommended) | 1.8-2.7x |
| First-pass capture for 90% total | 70% (recirculation provides 20 points recovery) | 90% (no recirculation) | 1.29x |

These penalties exist because the standards were developed for enclosed environments where six capture-assisting mechanisms operate: wall-guided airflow, ceiling jet recovery, room pressurization, controlled makeup air, absence of crosswind, and enclosed dilution volume. None of these mechanisms exist outdoors. The standards do not account for their absence.

### 2.2 The Failure Mode Connection

RB-007 identified six primary failure modes of outdoor hoods (FM-1 through FM-6). The following table maps each failure mode to the standards or guidance gap that permits it.

| Failure Mode | Description | Permitting Gap |
|---|---|---|
| FM-1: Inadequate Overhang | Hood footprint smaller than plume cross-section | No outdoor overhang specification in ASHRAE 154 or IMC |
| FM-2: Excessive Mounting Height | All plume parameters degraded by height | No outdoor maximum mounting height in any standard |
| FM-3: Insufficient Exhaust Rate | CFM below outdoor requirement | No outdoor exhaust rate table in ASHRAE 154 or IMC |
| FM-4: Wind-Deflected Plume Escape | Wind displaces plume beyond hood | No wind correction factor in any standard |
| FM-5: Geometry-Induced Spillage | Poor internal velocity distribution | No **Effective Capture Area** specification for outdoor hoods |
| FM-6: **Momentum-Limited Capture** | Edge velocity insufficient for weak plumes | No source-type correction for low convective fraction sources |

Every failure mode is traceable to a gap in standards, codes, or guidance. The gaps are not abstract deficiencies — they produce real, observable failures in installed systems.

### 2.3 The Physics That Consumer Guidance Omits

The **Buoyant Cooking Plume** from an outdoor cooking source is governed by well-established physics (Heskestad plume correlations, Morton-Taylor-Turner entrainment theory) that determines the plume's diameter, velocity, temperature, and mass flow rate at every height above the cooking surface. This physics dictates the hood size and exhaust rate required for capture. Yet consumer-facing guidance — manufacturer literature, retailer sizing charts, and online references — routinely omits the following physical relationships:

1. **Plume diameter grows linearly with mounting height.** Each additional 6 inches of height adds approximately 3 inches to the plume capture diameter. Consumer guidance does not convey this relationship or its implications for hood sizing.

2. **Plume mass flow grows as z^(5/3).** Doubling the mounting height approximately triples the required exhaust rate. Consumer guidance treats CFM as a fixed property of the appliance, not as a function of mounting height.

3. **Wind deflects the plume laterally.** Even a 3 mph breeze deflects the plume approximately 7 inches at 30-inch mounting height (RB-004 Section 3.8). Consumer guidance does not address wind as a variable in hood specification.

4. **Convective fraction varies by fuel type.** A charcoal grill rated at the same BTU as a gas grill produces a weaker **Buoyant Cooking Plume** because its convective fraction is 0.40 versus 0.70 (RB-001 Section 2.4). Consumer guidance uniformly treats BTU as the sole measure of plume strength.

5. **Indoor CFM ratings do not transfer outdoors.** The correction factor is 1.7 to 2.5 times (RB-004 Section 3.10). Consumer guidance does not disclose whether CFM ratings are based on indoor or outdoor conditions, nor does it provide correction factors.

6. **First-pass capture is the only capture outdoors.** There is no ceiling jet recovery, no room recirculation, no second chance. **Open-Boundary Dilution** permanently removes any escaped plume gas. Consumer guidance does not explain this distinction or its implications.

---

## 3. Observed or Expected Behavior

This section is the core of the paper. It presents the systematic gap analysis organized into four categories: standards gaps, code gaps, test method gaps, and consumer guidance gaps. For each gap, the current state, the specific deficiency, the consequence, and the proposed resolution are documented.

### 3.1 Standards Gaps

#### Gap S-1: No Outdoor-Specific Exhaust Rate Specification in ASHRAE 154

**Current State:** ASHRAE Standard 154-2016 Section 4 provides exhaust rate tables for commercial cooking hoods. The tables specify CFM per linear foot of hood for four hood types (wall-mounted canopy, single island canopy, double island canopy, and proximity/backshelf) across four duty classifications (light, medium, heavy, extra-heavy). These rates were developed from research conducted in enclosed commercial kitchens (ASHRAE RP-1202, RP-1482) and are validated for indoor environments.

**Specific Deficiency:** ASHRAE 154 does not provide exhaust rate specifications for outdoor installations. The standard does not contain the word "outdoor" in its exhaust rate provisions. No correction factor, supplementary table, or informative note addresses the performance difference between indoor and outdoor operation. A designer applying ASHRAE 154 to an outdoor kitchen would use the indoor island canopy values, which are 1.7 to 2.5 times too low (RB-004 Section 3.9).

**Consequence:** Outdoor commercial and residential kitchen hoods specified using ASHRAE 154 exhaust rates are systematically underpowered. The resulting systems exhibit FM-3 (insufficient exhaust rate) as a baseline condition, worsening to compound FM-1 + FM-3 + FM-4 in exposed outdoor installations.

**Proposed Resolution:** ASHRAE 154 should be amended to include either: (a) a separate outdoor exhaust rate table derived from open-boundary plume calculations with wind correction factors; or (b) an outdoor correction factor applied to the existing indoor tables, with values of 1.7 (sheltered outdoor), 2.0 (standard outdoor), and 2.5 (exposed outdoor), consistent with the K_outdoor factors established in RB-003 Section 3.9. An informative appendix explaining the physical basis for the correction would be appropriate.

#### Gap S-2: No Outdoor Hood Classification in ASHRAE 154

**Current State:** ASHRAE 154 classifies hoods into four types based on their relationship to adjacent walls: wall-mounted canopy, single island canopy, double island canopy, and proximity/backshelf. The classification determines the exhaust rate multiplier. The island canopy — the closest analog to an outdoor hood — is defined as a hood not against a wall, accessible from multiple sides.

**Specific Deficiency:** There is no "outdoor canopy" classification. The island canopy classification accounts for the loss of one wall (the back wall) while retaining five other indoor capture mechanisms (ceiling jet, room pressurization, controlled makeup air, absence of wind, enclosed dilution volume). An outdoor hood loses all six mechanisms. The ASHRAE 154 classification system has no category that reflects this condition.

**Consequence:** Designers must select the island canopy classification for outdoor hoods, which underspecifies the exhaust rate (by 1.7 to 2.5 times) and the hood dimensions (by 1.3 to 1.7 times). The classification provides no signal to the designer that outdoor conditions impose additional penalties beyond the loss of the back wall.

**Proposed Resolution:** ASHRAE 154 should introduce an "outdoor canopy" classification (or equivalent designation) with distinct exhaust rate tables, overhang requirements, and performance criteria that account for the loss of all six indoor capture mechanisms. The outdoor classification should include sub-categories for wind exposure level (sheltered, standard, exposed) and should specify mandatory wind protection (side panels) for exposed installations.

#### Gap S-3: No Wind Correction Factor in Any National Standard

**Current State:** None of the four principal standards (ASHRAE 154, IMC Chapter 5, UL 710, NFPA 96) contains a wind correction factor, wind exposure classification, or any provision that accounts for the effect of ambient wind on hood capture performance. The word "wind" does not appear in the exhaust rate or hood sizing provisions of any of these standards.

**Specific Deficiency:** RB-006 established that even modest wind speeds (3 to 5 mph at cooking height) produce measurable capture degradation, and the correction factor for sustained light breeze is 1.3 to 1.6 times the still-air CFM requirement. No standard provides a mechanism for incorporating this correction into the design specification.

**Consequence:** Every outdoor installation is specified without wind correction. Installations in wind-exposed locations (open patios, elevated decks, coastal sites) are specified identically to sheltered installations. The failure mode FM-4 (wind-deflected plume escape) is the direct result.

**Proposed Resolution:** A wind correction factor should be incorporated into outdoor exhaust rate specifications in ASHRAE 154 (or a companion guideline). The correction should reference a site wind exposure classification system (analogous to ASCE 7 terrain categories or the four-tier classification proposed in RB-006: Sheltered, Moderate, Exposed, Severe). For Moderate and higher exposures, the standard should specify mandatory wind protection (side panels, rear panels, or equivalent shielding).

#### Gap S-4: No Outdoor Maximum Mounting Height Specification

**Current State:** ASHRAE 154, IMC Chapter 5, and manufacturer installation guides specify maximum mounting heights for indoor hoods, typically 48 to 54 inches for canopy hoods (with variation by manufacturer listing). These heights are based on indoor capture performance, where wall assistance, ceiling jet recovery, and room recirculation compensate for height-induced plume degradation.

**Specific Deficiency:** No standard specifies an outdoor maximum mounting height. The indoor maximum of 48 to 54 inches, if applied outdoors, permits mounting heights at which the **Buoyant Cooking Plume** has expanded to a diameter exceeding the width of all standard consumer hoods (RB-001 Table 3.6 shows the plume capture diameter at 48 inches is 53 to 61 inches for medium to large sources), the required CFM has grown to 2.5 to 4.0 times the 24-inch value, and wind vulnerability has approximately doubled (RB-003 Table 3.10).

**Consequence:** Outdoor hoods are routinely mounted at 36 to 48 inches to accommodate operator head clearance, tall grill bodies, and aesthetic preferences. At these heights, RB-007 failure mode FM-2 (excessive mounting height) is active for all medium and large cooking sources. The absence of an outdoor-specific maximum height permits installations that are physically incapable of adequate capture regardless of hood width or CFM.

**Proposed Resolution:** An outdoor maximum mounting height should be established based on the plume physics (mass flow rate scaling as z^(5/3), plume diameter growth, and wind vulnerability increase with height). Based on the analysis of RB-003, the recommended outdoor maximum is 30 inches for medium and large gas grills, 36 inches for small gas grills and pellet smokers, and 24 inches for charcoal grills and low-output sources. These heights should be specified in the outdoor classification of ASHRAE 154 or in an outdoor kitchen design guideline.

#### Gap S-5: No Outdoor Overhang Specification

**Current State:** ASHRAE 154 Section 6 specifies minimum hood overhang of 6 inches per side for island canopy hoods. This overhang is adequate indoors because wall-guided airflow, ceiling jet recovery, and room pressurization compensate for limited geometric margin.

**Specific Deficiency:** No standard specifies overhang for outdoor hoods. The 6-inch indoor minimum, if applied outdoors, provides approximately one-third of the required outdoor overhang (RB-002 established 15 to 26 inches per side for standard outdoor conditions). The outdoor overhang must account for the plume's full expanded diameter at the **Plume Interception Plane**, turbulent fluctuation margin, and wind deflection margin — none of which are addressed by the indoor specification.

**Consequence:** Consumer outdoor hoods are manufactured with overhang comparable to indoor hoods (6 to 12 inches per side). Every installation with a medium or larger cooking source exhibits FM-1 (inadequate overhang) from the day of installation.

**Proposed Resolution:** An outdoor overhang specification should be developed, referenced to the plume capture diameter at the mounting height (d_capture = 0.48 * (z - z_0) + D_eff, from RB-001) multiplied by the outdoor margin factor K = 1.70 (from RB-002). The specification should be expressed as a table of minimum overhang per side, indexed by source type and mounting height.

#### Gap S-6: NFPA 96 Does Not Address Outdoor Fire Dynamics

**Current State:** NFPA 96-2021, "Standard for Ventilation Control and Fire Protection of Commercial Cooking Operations," governs fire protection for cooking ventilation systems. It specifies fire suppression systems, duct fire resistance, hood materials, and maintenance requirements. The standard was developed for indoor commercial kitchens where fire dynamics are constrained by room geometry.

**Specific Deficiency:** NFPA 96 does not address the distinct fire dynamics of outdoor cooking ventilation. Outdoor conditions differ from indoor in several fire-relevant respects: unlimited air supply to sustain combustion; wind that can spread a grease fire beyond the hood; absence of room confinement that in indoor settings limits fire growth; and the potential for grease deposition on outdoor surfaces that are not subject to the same cleaning and inspection regimes as indoor commercial kitchens.

**Consequence:** The fire suppression systems required by NFPA 96 may not be calibrated for outdoor fire scenarios. The cleaning and inspection schedules specified for indoor operations may be insufficient for outdoor installations where grease deposition patterns differ (RB-012 addresses thermal radiation and grease transport in outdoor environments).

**Proposed Resolution:** NFPA 96 should include an outdoor annex or chapter addressing outdoor-specific fire risks, suppression system requirements, duct routing in outdoor structures, and maintenance schedules appropriate for the outdoor grease deposition environment.

### 3.2 Code Gaps

#### Gap C-1: No Indoor/Outdoor Distinction in IMC Prescriptive Exhaust Rate Tables

**Current State:** The International Mechanical Code (IMC) Chapter 5, Section 507, specifies minimum exhaust rates for commercial kitchen hoods by reference to ASHRAE 154 or by prescriptive table (IMC Table 507.2.1 or equivalent by edition). The table specifies CFM per linear foot for wall-canopy and island-canopy configurations across four duty classifications.

**Specific Deficiency:** The IMC exhaust rate table makes no distinction between indoor and outdoor installations. The values are numerically identical to the ASHRAE 154 indoor values. A code official applying IMC prescriptive tables to an outdoor kitchen installation would approve an exhaust rate that is 1.7 to 2.5 times too low for the outdoor environment.

**Consequence:** Code-compliant outdoor kitchen installations are systematically underspecified. The homeowner who obtains a building permit, hires a licensed contractor, passes code inspection, and receives a certificate of occupancy has an outdoor hood that captures 50 to 70% of the plume under standard conditions (RB-004 Section 4.6). The code compliance provides false assurance that the system is adequate.

**Proposed Resolution:** The IMC should introduce an outdoor kitchen ventilation section (or amend Section 507) to either: (a) reference outdoor-specific exhaust rate tables when they are developed by ASHRAE; or (b) include outdoor correction factors in the existing prescriptive table with a note distinguishing indoor from outdoor application.

#### Gap C-2: No Outdoor-Specific Inspection Criteria

**Current State:** Building code inspections verify that kitchen ventilation installations comply with the prescriptive requirements of the applicable code (IMC, Uniform Mechanical Code, or local amendments). Inspectors verify hood type, exhaust rate (from the blower nameplate), duct materials, fire suppression system, and clearances.

**Specific Deficiency:** There are no outdoor-specific inspection criteria. An inspector approving an outdoor kitchen hood verifies the same parameters as for an indoor hood: blower nameplate CFM, duct material, fire suppression (if commercial), and clearances from the listing. The inspector has no basis in the code for requiring larger overhang, higher CFM, lower mounting height, or wind protection — because the code does not specify these parameters for outdoor installations.

**Consequence:** The inspection process does not differentiate between indoor and outdoor installations. An outdoor hood that is physically identical to an adequate indoor hood passes inspection despite being systematically undersized and underpowered for the outdoor environment.

**Proposed Resolution:** Inspection criteria for outdoor kitchen ventilation should be developed as a supplement to existing building code inspection checklists. These criteria should include: verification of outdoor-appropriate exhaust rate (with correction factor applied); verification of outdoor-appropriate overhang; verification of mounting height within the outdoor-specified maximum; assessment of wind exposure and verification of appropriate wind protection; and verification that the hood is listed or rated for outdoor use.

#### Gap C-3: Inconsistent Local Code Amendments for Outdoor Kitchens

**Current State:** Many jurisdictions that have adopted the IMC or UMC have enacted local amendments addressing outdoor kitchens. These amendments vary widely in scope and rigor. Some jurisdictions require fire suppression for all outdoor cooking hoods; others exempt residential outdoor kitchens entirely. Some require a mechanical permit for outdoor hood installation; others classify outdoor hoods as exempt appliances.

**Specific Deficiency:** There is no model outdoor kitchen code provision from which local jurisdictions can draw consistent requirements. Each jurisdiction that addresses outdoor kitchens does so independently, resulting in a patchwork of requirements that may or may not reflect the physics of outdoor ventilation. Some jurisdictions apply the full indoor code to outdoor kitchens (resulting in requirements that are partially inappropriate — for example, requiring tempered makeup air for an outdoor installation). Others exempt outdoor kitchens from all ventilation code requirements (resulting in no performance assurance).

**Consequence:** The consumer's experience depends on jurisdiction, not on physics. In one city, the homeowner may be required to install a fire suppression system but not to meet any exhaust rate specification. In the adjacent county, neither may be required. Neither jurisdiction addresses the outdoor-specific ventilation performance gap.

**Proposed Resolution:** A model code provision for outdoor kitchen ventilation should be developed (by ICC or an equivalent model code organization) that addresses: outdoor exhaust rate requirements (with wind correction); outdoor hood sizing (with overhang based on plume physics); maximum mounting height for outdoor installations; wind exposure assessment and mandatory protection for exposed sites; and fire protection appropriate for outdoor fire dynamics. This model provision would provide a consistent basis for local adoption.

### 3.3 Test Method Gaps

#### Gap T-1: No Open-Air Capture Efficiency Test Protocol

**Current State:** Two test methods exist for measuring range hood capture efficiency: UL 710 (for commercial hoods, as part of the listing test) and ASTM E3087 (for residential range hoods). Both tests are conducted in enclosed test rooms with controlled ventilation, specified cooking loads, and quiescent ambient conditions.

**Specific Deficiency:** No published test method evaluates capture efficiency under open-air conditions. The UL 710 and ASTM E3087 test rooms provide all six indoor capture mechanisms (walls, ceiling, pressurization, controlled air supply, absence of wind, finite dilution volume). The capture efficiency measured in these rooms includes the contribution of these mechanisms and is not representative of outdoor performance. RB-004 Section 3.3 estimated that the UL 710 capture rating overstates outdoor performance by 20 to 35 percentage points.

**Consequence:** Manufacturers can market outdoor hoods with capture efficiency claims based on indoor testing. A hood rated at 85% capture efficiency per UL 710 may achieve only 50 to 65% under outdoor conditions. The consumer has no way to evaluate the outdoor-specific capture capability of the product.

**Proposed Resolution:** An outdoor capture efficiency test protocol should be developed. The test should be conducted in an open-air test facility (or in a large, unenclosed space that replicates open-boundary conditions) and should include: (a) a still-air baseline test (all walls removed, no wind); (b) a controlled crosswind test at 3, 5, and 8 mph; (c) a standardized outdoor cooking load representative of gas grills, charcoal grills, and pellet smokers. The protocol should measure first-pass capture efficiency only, without recirculation credit. The test results should be reported as a capture efficiency curve versus wind speed, not as a single number.

#### Gap T-2: No Wind-Exposure Performance Test

**Current State:** Neither UL 710 nor ASTM E3087 includes a wind exposure condition in its test protocol. The test ambient is quiescent in all cases. No standard test method evaluates how a hood's capture performance degrades under crosswind conditions.

**Specific Deficiency:** Wind is the dominant environmental variable affecting outdoor hood performance (RB-006, RB-007 Section 4.6). A hood that achieves 90% capture in still air may achieve only 60% at 5 mph — a common outdoor condition. No test method quantifies this degradation, and no manufacturer is required to disclose it.

**Consequence:** Hoods sold for outdoor use have no wind-performance rating. The consumer cannot compare hoods on the basis of wind tolerance. Manufacturers have no incentive to design for wind resistance because there is no test that measures or rewards it.

**Proposed Resolution:** The outdoor capture efficiency test (Gap T-1 resolution) should include mandatory wind-exposure test conditions. Alternatively, a stand-alone wind-performance test could be developed that measures the critical wind speed at which capture efficiency drops below specified thresholds (e.g., the wind speed at which capture falls below 80%, 70%, 60%). This "wind rating" would provide consumers with a directly useful metric for site-specific hood selection.

#### Gap T-3: No Outdoor Cooking Load Standard

**Current State:** UL 710 specifies a standardized cooking load consisting of defined quantities of hamburger patties, cooking oil, and water, cooked on standardized gas burners. ASTM E3087 uses a similar approach with a residential cooktop. These loads are designed to produce representative effluent levels for indoor cooking scenarios.

**Specific Deficiency:** No standardized outdoor cooking load exists. Outdoor cooking differs from indoor cooking in heat release rate (outdoor sources range from 2.3 to 23.4 kW convective, compared to 1 to 8 kW for residential indoor cooktops), fuel type (gas, charcoal, wood, pellets — each with different convective fractions and effluent characteristics), cooking duration (outdoor barbecue sessions often last 1 to 6 hours versus 10 to 30 minutes for indoor cooking tasks), and effluent composition (outdoor cooking generates heavy smoke loads from charcoal and wood that are not represented in the UL 710 or ASTM E3087 cooking loads).

**Consequence:** Even if an outdoor capture efficiency test (Gap T-1) were developed, there is no standardized cooking load to use in it. Test results would not be comparable across manufacturers without a common load standard.

**Proposed Resolution:** An outdoor cooking load standard should be developed, defining representative cooking loads for each of the four principal outdoor source types: gas grill, charcoal grill, wood-fired grill, and pellet smoker. The loads should produce representative effluent levels and heat release rates as characterized in RB-001 Tables 3.1 and 3.4. The standard should specify at least a medium-duty and a heavy-duty test load for each source type.

#### Gap T-4: No Field Test Method for Installed Outdoor Hood Performance

**Current State:** Laboratory test methods (UL 710, ASTM E3087) evaluate hoods in controlled test rooms. There is no published field test method for evaluating the capture performance of an installed outdoor hood in its actual operating environment.

**Specific Deficiency:** An installed outdoor hood operates in a unique environment defined by its specific mounting height, overhang, blower capacity, duct configuration, wind exposure, and cooking source. No test method enables a homeowner, installer, or inspector to verify that the installed system achieves a target level of capture performance. The diagnostic decision tree in RB-007 Section 3.10 provides a qualitative framework for identifying failure modes, but no quantitative field test exists.

**Consequence:** There is no post-installation performance verification for outdoor hoods. The only feedback mechanism is the homeowner's subjective assessment of smoke escape. Systems that capture 50 to 70% of the plume may be perceived as "adequate" by users accustomed to some smoke escape, or as "defective" by users who expect indoor-equivalent performance. There is no objective measure.

**Proposed Resolution:** A field test protocol for installed outdoor hood performance should be developed. Candidate approaches include: (a) a standardized smoke-bomb or theatrical fog test that provides visual documentation of capture coverage and escape patterns; (b) a tracer-gas method adapted from ASTM E3087 for field use; (c) a thermal imaging protocol that maps the hood's **Capture Envelope** by detecting the plume's thermal signature relative to the hood boundary. The test should yield a quantitative capture rating or a pass/fail determination against a minimum performance threshold.

### 3.4 Consumer Guidance Gaps

#### Gap G-1: No Physics-Based Hood Sizing Information Available to Consumers

**Current State:** Consumer guidance for outdoor hood sizing consists primarily of: manufacturer sizing charts that recommend hood width based on grill width (typically "hood should be 6 to 12 inches wider than the grill"); retailer guidance that matches hood size to appliance size by brand or BTU category; and online reference articles that repeat the 6-to-12-inch overhang recommendation without physical basis.

**Specific Deficiency:** None of this guidance is derived from plume physics. The recommendation of 6 to 12 inches of overhang per side corresponds to the indoor ASHRAE 154 minimum of 6 inches — a value that was developed for enclosed kitchens with wall assistance, ceiling jet recovery, and room recirculation. The outdoor plume physics (RB-001, RB-002) requires 15 to 26 inches of overhang per side at standard mounting heights. The consumer guidance underspecifies overhang by 50 to 75%.

Consumer guidance does not explain that the required hood width depends on mounting height. The plume capture diameter grows linearly with height (RB-001 Section 3.6), adding approximately 3 inches of required hood width per 6 inches of mounting height. A hood that is adequate at 24 inches is inadequate at 36 inches. No consumer guidance conveys this relationship.

**Consequence:** Consumers purchase hoods that are 30 to 50% too narrow for their cooking source and mounting height. The **Missed Plume Region** extends beyond the hood boundary on all sides, producing FM-1 (inadequate overhang) as the default condition.

**Proposed Resolution:** Physics-based sizing guidance should be developed for consumer use. The guidance should take the form of a sizing table indexed by cooking source type (gas grill small/medium/large, charcoal grill, wood-fired grill, pellet smoker), mounting height (18, 24, 30, 36, 48 inches), and wind exposure (sheltered, standard, exposed). The table should specify both minimum hood width and recommended hood width, with an explanation that the recommended values include margin for outdoor conditions that the minimum values do not. The guidance should explicitly state that indoor sizing rules do not apply outdoors.

#### Gap G-2: Misleading CFM Claims in Manufacturer Literature

**Current State:** Outdoor range hood manufacturers specify CFM ratings for their products. These ratings are typically the blower's rated capacity at zero or low static pressure. The CFM is presented as a single number (e.g., "900 CFM") without reference to the conditions under which it was determined to be adequate — specifically, without stating whether the rating is based on indoor testing, outdoor testing, or theoretical calculation.

**Specific Deficiency:** Consumer-facing CFM claims do not disclose the indoor-to-outdoor performance gap. A manufacturer who states that a 600 CFM hood is "suitable for grills up to 48 inches" may be basing this claim on ASHRAE 154 indoor island canopy specifications, which require 300 to 400 CFM for a medium gas grill. The 600 CFM rating sounds like it provides generous margin over the indoor requirement. In fact, the outdoor requirement for a medium gas grill at 30 inches is 609 to 747 CFM (RB-003 Tables 3.8a and 3.8b), making 600 CFM borderline to inadequate.

CFM claims also do not account for static pressure losses in the actual duct installation. A blower rated at 900 CFM at 0 inches WG may deliver only 500 to 600 CFM against a typical residential duct run (0.5 to 1.5 inches WG). The nameplate CFM is not the delivered CFM.

**Consequence:** Consumers select hoods based on CFM ratings that systematically overstate the product's outdoor performance capability. The consumer perceives a 900 CFM hood as "powerful enough for any grill" when in fact it may deliver only 500 to 600 CFM at the installation's operating static pressure, against an outdoor requirement of 727 to 892 CFM for a large gas grill at 30 inches.

**Proposed Resolution:** Manufacturer CFM claims for outdoor hoods should be required to state: (a) the CFM at a representative operating static pressure (e.g., 0.5 inches WG), not at zero static pressure; (b) whether the "suitable for" sizing recommendation is based on indoor or outdoor performance testing; (c) the outdoor correction factor that applies if the rating is indoor-derived. Ideally, outdoor hoods should be rated at an outdoor-specific CFM derived from an outdoor test (Gap T-1) or from published outdoor correction factors.

#### Gap G-3: Absent Mounting Height Guidance

**Current State:** Manufacturer installation manuals specify a minimum mounting height (typically 24 to 30 inches above the cooking surface) based on fire clearance and a maximum mounting height (typically 36 to 48 inches) based on the indoor UL 710 listing. Some manufacturers recommend a specific height (e.g., 30 to 36 inches) without explaining the performance implications of height variation.

**Specific Deficiency:** No consumer guidance explains that mounting height is the single most influential variable in outdoor capture performance (RB-001 Section 4.1, RB-007 Section 4.2). The z^(5/3) scaling of mass flow rate with height means that a hood at 48 inches must exhaust approximately three times more air than the same hood at 24 inches. Consumer guidance does not convey this relationship or recommend mounting as low as practical.

Consumer guidance also does not provide height-dependent CFM or sizing recommendations. A consumer installing a hood at 36 inches receives the same CFM and sizing recommendation as one installing at 24 inches, despite the physical requirement being 60 to 100% higher at 36 inches.

**Consequence:** Consumers and installers treat mounting height as an aesthetic or ergonomic choice, not as a critical performance variable. Hoods are routinely mounted at 36 to 48 inches for head clearance or visual preference, activating FM-2 (excessive mounting height) and compounding all other failure modes.

**Proposed Resolution:** Consumer guidance should explicitly identify mounting height as the most important variable for outdoor hood performance and recommend the lowest practical height. The guidance should provide a table or chart showing how required CFM and hood width increase with mounting height for each source type, making the performance cost of each additional inch of height visible to the consumer. Maximum recommended outdoor mounting heights should be stated: 30 inches for medium and large gas grills; 36 inches for small gas grills and pellet smokers; 24 inches for charcoal grills and weak-plume sources.

#### Gap G-4: Absent Wind Exposure Assessment Guidance

**Current State:** No consumer-facing guidance addresses wind as a variable in outdoor hood selection or installation. Manufacturer literature does not mention wind. Retailer sizing guides do not include wind exposure as a parameter. Installation manuals do not recommend wind protection measures (side panels, rear panels, site orientation).

**Specific Deficiency:** Wind is the dominant environmental variable that distinguishes outdoor from indoor ventilation (RB-004 Mechanism 5; RB-006). The correction factor for even light wind exposure is 1.3 to 1.6 times the still-air CFM requirement. The failure mode FM-4 (wind-deflected plume escape) is the fourth most common failure mode and the most common correctable failure in the installed base. Yet no consumer guidance acknowledges wind as a factor.

**Consequence:** Outdoor hoods are installed without any assessment of the site's wind exposure. Installations in wind-exposed locations (elevated decks, open patios, coastal sites) receive the same hood specification as sheltered installations (covered porches, courtyard kitchens, three-wall alcoves). The wind-exposed installations fail predictably when ambient wind exceeds 3 to 5 mph.

**Proposed Resolution:** Consumer guidance should include a simple wind exposure assessment tool. The tool should classify the installation site into one of three or four exposure categories (e.g., Sheltered, Standard, Exposed) based on observable site characteristics (covered or uncovered, number of adjacent walls, elevation, prevailing wind direction). For each category, the guidance should recommend: minimum additional overhang margin; CFM correction factor; and mandatory wind protection measures (side panels for Standard; side panels plus rear panel for Exposed). Side panels should be recommended as standard equipment for all uncovered outdoor installations, not as optional accessories.

#### Gap G-5: No Source-Type Correction in Consumer Sizing Guidance

**Current State:** Consumer sizing guidance universally uses BTU rating as the sole measure of cooking source output. Recommendations take the form of "for grills rated 40,000 to 60,000 BTU, use a hood rated at X CFM."

**Specific Deficiency:** BTU rating is a measure of total heat release rate, not convective heat release rate. The convective fraction — the parameter that governs **Buoyant Cooking Plume** strength — varies from 0.40 for charcoal grills in glowing-ember mode to 0.70 for gas grills (RB-001 Section 2.4). A charcoal grill rated at 30,000 BTU produces a plume equivalent to a gas grill of approximately 17,000 BTU in convective terms. Conversely, the charcoal grill's cooking surface (the entire coal bed) is typically wider than a comparably rated gas grill's burner array, meaning the plume starts wider. The net effect is a wider, weaker plume that requires greater overhang but lower CFM than the BTU rating alone would suggest.

Consumer guidance does not distinguish between source types. A 30,000 BTU charcoal grill and a 30,000 BTU gas grill receive the same hood and CFM recommendation, despite having fundamentally different plume characteristics and different failure mode profiles.

**Consequence:** Charcoal grill installations receive hoods sized for the gas grill plume equivalent of their BTU rating. The hood may be adequate in CFM (because the charcoal plume mass flow is lower) but inadequate in width (because the charcoal plume starts wider). This produces FM-1 (inadequate overhang) and FM-6 (**Momentum-Limited Capture**) — the specific failure modes associated with weak, diffuse plumes from low convective fraction sources (RB-007 Section 4.5).

**Proposed Resolution:** Consumer sizing guidance should index recommendations by source type (gas grill, charcoal grill, wood-fired grill, pellet smoker), not solely by BTU rating. For each source type, the guidance should specify the effective convective heat output (Q_c) used for sizing, the effective source diameter (D_eff) used for overhang calculation, and any source-specific notes (e.g., "charcoal grills require wider hoods but lower CFM than gas grills of the same BTU rating; mount as low as possible to capture the weaker plume before wind disperses it").

#### Gap G-6: No Disclosure of Indoor Versus Outdoor Test Basis for Performance Claims

**Current State:** Manufacturers of outdoor range hoods make performance claims that include CFM ratings, capture efficiency percentages (when stated), appliance compatibility ranges, and recommended mounting heights. These claims are presented without disclosing the test conditions under which they were established.

**Specific Deficiency:** The consumer has no way to determine whether a manufacturer's performance claim is based on: (a) indoor laboratory testing (UL 710 or ASTM E3087 in an enclosed test room); (b) outdoor testing (in an open-air facility with representative wind conditions); (c) theoretical calculation from plume models; or (d) marketing estimation without engineering basis. The distinction matters because indoor test results overstate outdoor performance by 20 to 35 percentage points (RB-004 Section 3.3).

**Consequence:** The consumer compares products on the basis of advertised specifications that may reflect fundamentally different test conditions. A manufacturer who tests in an enclosed room and reports 90% capture efficiency appears superior to a manufacturer who tests outdoors and reports 70% capture efficiency — even though the outdoor-tested product may actually perform better in the real outdoor environment.

**Proposed Resolution:** Outdoor hood performance claims should be required to disclose the test basis. A standardized disclosure format should specify: test standard used (UL 710, ASTM E3087, proprietary, or none); test environment (enclosed room, open-air, simulated outdoor); wind conditions during test (quiescent, specified crosswind, representative natural wind); and whether the claimed capture efficiency includes room recirculation credit. Ideally, an outdoor-specific performance label (analogous to the ENERGY STAR label for energy efficiency) would be developed, providing consumers with standardized outdoor performance data tested under uniform conditions.

### 3.5 Gap Taxonomy Summary

The following table consolidates all thirteen identified gaps with their category, affected standard or guidance type, and severity classification.

| Gap ID | Category | Gap Description | Affected Standard/Guidance | Severity |
|---|---|---|---|---|
| S-1 | Standards | No outdoor exhaust rate specification | ASHRAE 154 | Critical |
| S-2 | Standards | No outdoor hood classification | ASHRAE 154 | Critical |
| S-3 | Standards | No wind correction factor | ASHRAE 154, IMC, UL 710, NFPA 96 | Critical |
| S-4 | Standards | No outdoor maximum mounting height | ASHRAE 154, IMC | High |
| S-5 | Standards | No outdoor overhang specification | ASHRAE 154 | High |
| S-6 | Standards | Outdoor fire dynamics not addressed | NFPA 96 | Moderate |
| C-1 | Codes | No indoor/outdoor distinction in prescriptive tables | IMC Chapter 5 | Critical |
| C-2 | Codes | No outdoor-specific inspection criteria | All building codes | High |
| C-3 | Codes | Inconsistent local amendments for outdoor kitchens | Local jurisdictions | Moderate |
| T-1 | Test Methods | No open-air capture efficiency test | UL/ASTM | Critical |
| T-2 | Test Methods | No wind-exposure performance test | UL/ASTM | High |
| T-3 | Test Methods | No outdoor cooking load standard | UL/ASTM | Moderate |
| T-4 | Test Methods | No field test method for installed performance | UL/ASTM | Moderate |
| G-1 | Consumer Guidance | No physics-based sizing information | All manufacturers/retailers | Critical |
| G-2 | Consumer Guidance | Misleading CFM claims | Manufacturer literature | Critical |
| G-3 | Consumer Guidance | Absent mounting height guidance | Manufacturer literature | High |
| G-4 | Consumer Guidance | Absent wind exposure assessment | All consumer guidance | High |
| G-5 | Consumer Guidance | No source-type correction in sizing | All consumer guidance | Moderate |
| G-6 | Consumer Guidance | No disclosure of indoor vs. outdoor test basis | Manufacturer literature | High |

**Severity Classification:**
- **Critical:** The gap directly causes systematic underperformance in the majority of outdoor installations. Resolution requires new provisions or standards.
- **High:** The gap contributes substantially to underperformance and misleading information. Resolution requires amendment of existing provisions or development of new guidance.
- **Moderate:** The gap affects a subset of installations or a secondary aspect of performance. Resolution is important but not as urgent as critical gaps.

### 3.6 Cross-Reference: Gaps to Failure Modes

The following matrix maps each identified gap to the RB-007 failure modes it permits.

| Gap | FM-1 (Overhang) | FM-2 (Height) | FM-3 (CFM) | FM-4 (Wind) | FM-5 (Geometry) | FM-6 (Momentum) |
|---|---|---|---|---|---|---|
| S-1: No outdoor CFM spec | -- | -- | PRIMARY | -- | -- | CONTRIBUTING |
| S-2: No outdoor hood class | CONTRIBUTING | CONTRIBUTING | CONTRIBUTING | CONTRIBUTING | CONTRIBUTING | CONTRIBUTING |
| S-3: No wind correction | -- | -- | -- | PRIMARY | -- | CONTRIBUTING |
| S-4: No outdoor max height | -- | PRIMARY | CONTRIBUTING | CONTRIBUTING | -- | CONTRIBUTING |
| S-5: No outdoor overhang spec | PRIMARY | -- | -- | -- | CONTRIBUTING | -- |
| C-1: No indoor/outdoor code distinction | CONTRIBUTING | CONTRIBUTING | CONTRIBUTING | CONTRIBUTING | -- | -- |
| T-1: No open-air test | -- | -- | CONTRIBUTING | CONTRIBUTING | CONTRIBUTING | CONTRIBUTING |
| G-1: No physics-based sizing | PRIMARY | -- | -- | -- | -- | -- |
| G-2: Misleading CFM claims | -- | -- | PRIMARY | -- | -- | -- |
| G-3: Absent height guidance | -- | PRIMARY | -- | -- | -- | -- |
| G-4: Absent wind guidance | -- | -- | -- | PRIMARY | -- | -- |
| G-5: No source-type correction | CONTRIBUTING | -- | -- | -- | -- | PRIMARY |

**Legend:** PRIMARY = the gap is the direct cause of this failure mode. CONTRIBUTING = the gap amplifies or fails to prevent this failure mode.

---

## 4. Implications for Outdoor BBQ Ventilation

### 4.1 The Standards Gap Is the Root Cause of Systematic Underperformance

The gap analysis establishes a direct causal chain from standards deficiency to product underperformance:

1. National standards (ASHRAE 154, UL 710) specify indoor performance requirements.
2. No national standard specifies outdoor performance requirements.
3. Building codes (IMC) reference the indoor-only standards without indoor/outdoor distinction.
4. Manufacturers design and test products to the indoor standards.
5. Consumers select products based on indoor-derived specifications.
6. The installed outdoor system underperforms by 1.7 to 2.5 times in CFM and 1.3 to 1.7 times in hood dimensions.
7. The underperformance manifests as the failure modes cataloged in RB-007.

Every link in this chain is a consequence of the standards gap. The gap is not the fault of any individual manufacturer, installer, or code official — it is a systemic deficiency in the regulatory and standards framework.

### 4.2 Critical Gaps Require Standards-Level Action

The six gaps classified as "Critical" (S-1, S-2, S-3, C-1, G-1, G-2, T-1) collectively account for the majority of outdoor hood underperformance. Resolution of these gaps requires action at the standards and code development level:

- ASHRAE must develop outdoor-specific provisions in Standard 154 (or a companion standard) addressing exhaust rates, hood classification, overhang, mounting height, and wind correction.
- UL or ASTM must develop an outdoor capture efficiency test protocol that measures first-pass capture under open-air conditions with representative wind exposure.
- ICC must amend the IMC (or issue a supplement) to distinguish between indoor and outdoor kitchen ventilation requirements.

These actions are prerequisites for the other gap resolutions. Without outdoor-specific standards, codes cannot reference them, manufacturers cannot test to them, and consumers cannot benefit from them.

### 4.3 Consumer Guidance Gaps Are Immediately Actionable

Unlike standards and code gaps, which require multi-year development and adoption processes, consumer guidance gaps (G-1 through G-6) can be addressed immediately through:

- Publication of physics-based sizing tables derived from the research in this program (RB-001, RB-002, RB-003)
- Development of consumer-facing educational materials explaining the key physical relationships (plume growth with height, wind effects, indoor-versus-outdoor difference)
- Advocacy for manufacturer disclosure of test conditions and performance basis

These actions do not require standards body approval or code adoption. They can be implemented through industry guidelines, consumer advocacy organizations, educational publications, and direct consumer outreach.

### 4.4 The Indoor-to-Outdoor Transition Creates a Liability Gap

A code-compliant outdoor kitchen installation that meets all prescriptive requirements of the IMC produces a system that captures only 50 to 70% of the cooking plume under standard outdoor conditions. The homeowner experiences chronic smoke and odor escape, grease deposition on adjacent surfaces, and degraded air quality in the cooking area. The homeowner may pursue warranty claims, installer liability claims, or code complaints — none of which have a clear resolution path because the system meets the code.

The liability gap exists because the code does not require the level of performance that the consumer expects. The consumer expects indoor-equivalent capture (90%+), based on the experience with indoor kitchen hoods. The code delivers 50 to 70% outdoor capture by specifying indoor requirements for an outdoor environment.

Resolution of this gap requires either: (a) updating the codes to specify outdoor-appropriate requirements (the preferred path); or (b) establishing clear disclosure requirements so that consumers understand, prior to purchase, that outdoor hoods perform differently from indoor hoods and that the code-compliant system may not achieve indoor-equivalent capture.

### 4.5 Mounting Height and Wind Are the Largest Unaddressed Variables

Of all the physical variables that affect outdoor hood performance, two are entirely unaddressed in current standards, codes, and consumer guidance:

**Mounting height** is the single most influential variable (RB-001 Section 4.1, RB-007 Section 4.2). The z^(5/3) scaling of mass flow rate means that the penalty for excessive height is nonlinear and severe. Yet no standard specifies an outdoor maximum height, no code inspection checks height against an outdoor criterion, and no consumer guidance explains the height penalty.

**Wind** is the dominant environmental variable (RB-006, RB-007 Section 4.6). The correction factor for moderate wind exposure is 1.6 times the still-air requirement. Yet no standard includes a wind correction, no code requires wind protection, and no consumer guidance addresses wind as a factor in hood selection or installation.

These two variables account for the majority of the performance gap between what indoor standards specify and what outdoor physics requires. Addressing these two variables alone — through outdoor maximum height specifications and mandatory wind correction factors — would resolve the majority of the systematic underperformance.

### 4.6 The Market Maturity Problem

The outdoor kitchen market has grown substantially without a corresponding maturation of the standards, codes, and guidance framework. Indoor kitchen ventilation is governed by a mature framework developed over decades: ASHRAE research projects characterized indoor plume behavior and capture performance (RP-1202, RP-1482); ASHRAE 154 codified the research into design specifications; UL 710 provided a product testing standard; the IMC made the specifications enforceable; and manufacturers designed products to meet the framework.

Outdoor kitchen ventilation has not undergone this development cycle. The research base is thin (no published plume characterization data specific to outdoor cooking sources, as noted in RB-001 Section 5.3). The standards are silent. The codes are undifferentiated. The test methods are indoor-only. The consumer guidance is indoor-derived. The products reflect this immaturity.

This research program provides the physics foundation (RB-001 through RB-012) upon which the standards, codes, test methods, and guidance framework can be built. The gap analysis in this paper identifies where that framework is needed. The resolution of these gaps is the pathway from the current immature state to a framework that serves the outdoor kitchen market with the same rigor that the existing framework serves indoor kitchens.

---

## 5. Knowledge Gaps or Opportunities

### 5.1 Well-Established Knowledge

The following aspects of the standards and guidance gap are well-established and not subject to significant uncertainty:

1. **The indoor standards are indoor-only.** ASHRAE 154, UL 710, and the IMC prescriptive tables were developed for, tested in, and validated against enclosed indoor environments. This is documented in the standards themselves and in the underlying ASHRAE research (RP-1202, RP-1482).

2. **The indoor-to-outdoor performance penalty is quantified.** RB-004 established the penalty at 1.7 to 2.5 times in CFM and 1.3 to 1.7 times in hood dimensions. These values are derived from well-established plume physics and are consistent with the broader ventilation engineering literature.

3. **The six failure modes are traceable to specific gaps.** The mapping in Section 3.6 is a direct consequence of the physics analysis in RB-004 and the failure mode analysis in RB-007. Each failure mode's root cause is a specific parameter deficiency that is not addressed by current standards or guidance.

4. **Consumer guidance is indoor-derived.** The 6 to 12-inch overhang recommendation, BTU-based sizing, and single-number CFM ratings are traceable to indoor ventilation practice. No consumer guidance is based on outdoor plume physics or outdoor capture testing.

5. **No outdoor test method exists.** This is a factual observation. UL 710 and ASTM E3087 are the only published capture efficiency test methods, and both are conducted in enclosed rooms.

### 5.2 Areas Requiring Professional Judgment

1. **Gap severity classification.** The classification of gaps as Critical, High, or Moderate is based on the assessed impact on the majority of outdoor installations. Reasonable professionals may disagree on whether a particular gap is Critical versus High, depending on the weight assigned to different aspects of performance.

2. **Resolution priority.** The proposed resolutions in Section 3 represent one pathway for addressing each gap. Alternative pathways exist — for example, ASHRAE could develop a separate outdoor kitchen ventilation standard rather than amending Standard 154, or UL could develop a new outdoor-specific listing standard rather than amending UL 710. The choice among pathways involves policy and organizational considerations beyond the physics analysis.

3. **The feasibility of outdoor correction factors.** The proposed K_outdoor values of 1.7, 2.0, and 2.5 (from RB-003) are engineering estimates derived from theoretical plume models. They are consistent with the physics but have not been validated by experimental comparison of indoor versus outdoor capture efficiency for the same hood and source. Standards committees may require experimental validation before incorporating these values into prescriptive tables.

### 5.3 Knowledge Gaps That Impede Gap Resolution

1. **No experimental validation of the indoor-to-outdoor CFM correction factor.** The K_outdoor values of 1.7 to 2.5 are the basis for the proposed outdoor exhaust rate specification (Gap S-1 resolution). Experimental validation — testing the same hood, same source, same exhaust rate in both enclosed and open-air conditions — would provide the evidence base that standards committees require. This is the highest-priority experiment for enabling gap resolution.

2. **No published data on outdoor hood capture efficiency under wind.** The wind correction factors from RB-006 are based on plume deflection models, not on capture efficiency measurements in wind. Measured capture efficiency versus wind speed data would support the proposed wind correction factor (Gap S-3 resolution) and the wind-exposure performance test (Gap T-2 resolution).

3. **No survey of the installed outdoor hood base.** The statements in this paper about "typical" installation parameters (36 to 48-inch hoods, 30 to 48-inch mounting heights, 300 to 900 CFM blowers) are based on published product specifications and industry observation. A systematic survey of installed outdoor hoods — documenting hood dimensions, mounting heights, blower capacities, duct configurations, and observed capture performance — would quantify the prevalence of each failure mode and prioritize the gap resolutions accordingly.

4. **No economic analysis of gap resolution.** Implementing the proposed resolutions (larger hoods, higher CFM, wind protection, lower mounting) increases the cost of outdoor kitchen ventilation. The cost impact has not been quantified. Standards committees and code bodies will require economic impact analysis before adopting new requirements.

5. **No engagement with standards bodies.** The proposed resolutions in this paper are technical recommendations. Their adoption requires engagement with the relevant standards and code development organizations (ASHRAE SSPC 154, ICC IMC Committee, UL Standards Technical Panel for UL 710, NFPA Technical Committee on Ventilation). The pathway from technical recommendation to published standard is multi-year and requires sponsorship, balloting, and public review.

6. **The scope boundary between residential and commercial outdoor kitchens.** The analysis in this paper applies to both residential and commercial outdoor cooking installations. However, the regulatory frameworks differ: commercial kitchens are subject to ASHRAE 154, NFPA 96, and Type I hood requirements, while residential kitchens are subject to residential building codes (IRC) and are often exempt from ventilation code provisions entirely. The gap resolution pathways may need to be differentiated for residential versus commercial outdoor kitchens.

---

## 6. Diagram Mapping Notes (Text Only)

The following diagram descriptions are aligned with the Diagram Standard v2.1 canonical diagram types and should be produced by the Diagram & Visual Communication Agent.

### Diagram 6.1: Gap Taxonomy Matrix (Diagram Type 4 — Conceptual/Comparative)

**Purpose:** Provide a visual overview of all thirteen identified gaps organized by category and severity.

**Content:**
- Four-column layout representing the four gap categories: Standards | Codes | Test Methods | Consumer Guidance
- Within each column, gaps are listed vertically, color-coded by severity:
  - Red: Critical (S-1, S-2, S-3, C-1, G-1, G-2, T-1)
  - Orange: High (S-4, S-5, C-2, T-2, G-3, G-4, G-6)
  - Yellow: Moderate (S-6, C-3, T-3, T-4, G-5)
- Each gap box contains the gap ID, a one-line description, and the affected standard or guidance type
- Connecting lines from gaps to the failure modes they permit (FM-1 through FM-6, shown at the bottom)
- Figure caption: "Figure 10.1: Gap taxonomy for outdoor BBQ ventilation standards, codes, test methods, and consumer guidance. Thirteen gaps are identified across four categories. Red gaps (Critical) directly cause systematic underperformance in the majority of outdoor installations."

### Diagram 6.2: Causal Chain from Standards Gap to Failure Mode (Diagram Type 4 — Conceptual)

**Purpose:** Illustrate the causal chain described in Section 4.1 — from standards gap to product underperformance to observable failure mode.

**Content:**
- Horizontal flow diagram with six stages:
  1. "Standards specify indoor requirements only" (ASHRAE 154, UL 710 logos or references)
  2. "Codes reference indoor standards without outdoor distinction" (IMC reference)
  3. "Manufacturers design/test to indoor standards" (product illustration)
  4. "Consumers select based on indoor-derived specs" (sizing chart illustration)
  5. "Installed outdoor system underperforms by 1.7-2.5x" (performance gap)
  6. "Observable failure modes: FM-1 through FM-6" (smoke escape illustration)
- Downward arrows at each stage showing the gap that enables the next stage
- Feedback arrow from stage 6 back to stage 1: "Resolution requires closing gaps at the source"
- Color coding: stages 1-2 (standards/code gaps) in red; stage 3-4 (manufacturer/consumer gaps) in orange; stages 5-6 (performance/failure) in yellow
- Figure caption: "Figure 10.2: Causal chain from standards gap to operational failure. Each stage is enabled by a specific gap identified in this paper. Resolution requires closing gaps at stages 1 and 2 (standards and codes), which propagates forward through the chain."

### Diagram 6.3: Standards Applicability Map — Updated from RB-004 (Diagram Type — Standards Matrix)

**Purpose:** Update the RB-004 Diagram 6.6 (Standards Applicability Map) with the specific gap IDs identified in this paper.

**Content:**
- Three-column layout: ASHRAE 154 | IMC Chapter 5 | UL 710
- Rows for each major provision, color-coded as in RB-004 Diagram 6.6:
  - GREEN (applies to outdoor): Duct materials, hood construction materials, grease filter requirements
  - YELLOW (partially applicable): Fire suppression (applicable but not calibrated for outdoor fire dynamics — Gap S-6), hood clearance (applicable but incomplete)
  - RED (does not apply or is misleading): Exhaust rate tables (Gap S-1), makeup air (not applicable), capture efficiency test (Gap T-1), capture efficiency rating (misleading), face velocity minimum (not the relevant outdoor metric)
- Gap ID annotations on each red and yellow row, linking to the gap taxonomy
- Fourth column added: "Proposed Outdoor Provision" — showing what should replace each red item
- Figure caption: "Figure 10.3: Applicability of indoor kitchen ventilation standards to outdoor installations, with gap ID annotations. Red provisions do not apply outdoors and require replacement with outdoor-specific provisions (rightmost column)."

### Diagram 6.4: Consumer Information Flow — Current Versus Recommended (Diagram Type 4 — Comparative)

**Purpose:** Contrast the current consumer information flow (indoor-derived, physics-absent) with the recommended information flow (physics-based, outdoor-specific).

**Content:**
- Two parallel flowcharts:
  - Left ("Current"): Consumer asks "What hood do I need?" -> Manufacturer sizing chart (BTU-based, single-number CFM, 6-12" overhang) -> Consumer selects 48" hood at 900 CFM -> Installation at 36" mounting height -> FM-1 + FM-3 compound failure -> Smoke escape, dissatisfaction
  - Right ("Recommended"): Consumer asks "What hood do I need?" -> Physics-based sizing tool (source type, mounting height, wind exposure) -> Tool recommends 62" hood at 900+ CFM at 24-30" maximum height, with side panels for exposed sites -> Installation per recommendations -> Adequate capture in most conditions
- Key differences highlighted:
  - Source type input (not just BTU)
  - Mounting height as critical variable
  - Wind exposure assessment
  - Outdoor-specific CFM (not indoor-derived)
  - Overhang based on plume physics (not indoor rule of thumb)
- Figure caption: "Figure 10.4: Consumer information flow for outdoor hood selection. The current flow (left) uses indoor-derived specifications and produces systematic underperformance. The recommended flow (right) incorporates outdoor plume physics and produces installations that match the outdoor environment."

### Diagram 6.5: Gap-to-Failure-Mode Cross-Reference Matrix (Diagram Type 2 — Quantitative Chart)

**Purpose:** Provide the Section 3.6 cross-reference matrix in visual form, showing which gaps enable which failure modes.

**Content:**
- Matrix with gaps (S-1 through G-6) on the Y-axis and failure modes (FM-1 through FM-6) on the X-axis
- Cells filled with color intensity:
  - Dark red: PRIMARY (the gap directly causes this failure mode)
  - Light orange: CONTRIBUTING (the gap amplifies or fails to prevent this failure mode)
  - White/empty: No significant connection
- Row and column totals:
  - Row totals show how many failure modes each gap enables (gaps with more connections are higher priority for resolution)
  - Column totals show how many gaps contribute to each failure mode (failure modes with more contributing gaps are more deeply entrenched in the standards framework)
- Figure caption: "Figure 10.5: Cross-reference matrix mapping standards/guidance gaps to failure modes. Dark cells indicate direct causation; light cells indicate contributing relationships. Gaps S-1, S-3, and G-1 enable the largest number of failure modes."

---

## Appendix A: Standards and Codes Referenced

| Standard/Code | Edition | Relevant Sections | Publisher | Scope Relative to This Paper |
|---|---|---|---|---|
| ASHRAE Standard 154 | 2016 | Sec. 4 (Exhaust), 5 (Makeup Air), 6 (Hood Construction) | ASHRAE | Primary performance standard; indoor-only provisions |
| International Mechanical Code (IMC) | 2021 | Chapter 5 (Exhaust Systems), Sec. 507 (Commercial Hoods), 508 (Makeup Air) | ICC | Model code; references ASHRAE 154; no outdoor distinction |
| UL 710 | 7th Edition | Capture Efficiency Test, Fire Test, Construction | UL LLC | Product listing standard; indoor test environment |
| ASTM E3087 | 2018 | Capture Efficiency Test for Residential Range Hoods | ASTM International | Residential test standard; indoor test environment |
| NFPA 96 | 2021 | Fire Protection for Commercial Cooking Operations | NFPA | Fire safety standard; indoor fire dynamics |
| ASHRAE Handbook — HVAC Applications | 2019 | Chapter 33: Kitchen Ventilation | ASHRAE | Design reference; indoor-focused |
| International Residential Code (IRC) | 2021 | Sections M1503 (Range Hoods), M1505 (Domestic Cooking) | ICC | Residential building code; limited ventilation provisions |

## Appendix B: Proposed Resolution Priority Ranking

The following ranking prioritizes gap resolutions by impact on outdoor hood performance, ordered from highest to lowest impact.

| Priority | Gap ID | Resolution Action | Estimated Impact | Timeline Dependency |
|---|---|---|---|---|
| 1 | T-1 | Develop open-air capture efficiency test protocol | Enables all other resolutions by providing the measurement basis | Prerequisite for S-1, S-2, T-2 |
| 2 | S-1 | Develop outdoor exhaust rate specification in ASHRAE 154 | Directly addresses FM-3 (insufficient CFM) for all outdoor installations | Requires T-1 for validation |
| 3 | S-3 | Develop wind correction factor for outdoor hoods | Directly addresses FM-4 (wind failure) for all exposed installations | Requires T-2 for validation |
| 4 | G-1 | Publish physics-based consumer sizing guidance | Directly addresses FM-1 (inadequate overhang) through informed consumer selection | Can proceed immediately from existing research |
| 5 | G-2 | Require outdoor-specific CFM disclosure | Addresses misleading claims that contribute to FM-3 | Can proceed immediately through industry guidelines |
| 6 | S-4 | Establish outdoor maximum mounting height | Directly addresses FM-2 (excessive height) | Can reference existing plume data |
| 7 | S-5 | Develop outdoor overhang specification | Directly addresses FM-1 (inadequate overhang) through code requirements | Requires S-2 |
| 8 | C-1 | Amend IMC to distinguish indoor/outdoor | Propagates S-1 through S-5 into enforceable code | Requires S-1 through S-5 |
| 9 | G-3 | Publish mounting height guidance for consumers | Addresses FM-2 through informed consumer/installer decisions | Can proceed immediately |
| 10 | G-4 | Develop consumer wind exposure assessment | Addresses FM-4 through informed site assessment | Can proceed immediately |
| 11 | T-2 | Develop wind-exposure performance test | Provides data for S-3 and consumer wind rating | Requires T-1 |
| 12 | S-2 | Develop outdoor hood classification in ASHRAE 154 | Framework for all outdoor provisions | Parallel with S-1 |
| 13 | G-5 | Develop source-type correction guidance | Addresses charcoal/pellet smoker specific failures | Can proceed immediately |
| 14 | G-6 | Require test basis disclosure for performance claims | Addresses consumer information asymmetry | Can proceed through industry guidelines |
| 15 | T-3 | Develop outdoor cooking load standard | Enables standardized testing across source types | Requires T-1 |
| 16 | C-2 | Develop outdoor-specific inspection criteria | Enables enforcement of outdoor requirements | Requires C-1 |
| 17 | S-6 | Address outdoor fire dynamics in NFPA 96 | Fire safety calibration for outdoor conditions | Separate NFPA committee action |
| 18 | T-4 | Develop field test for installed performance | Post-installation verification capability | Low urgency; research phase |
| 19 | C-3 | Develop model code provision for local consistency | Resolves jurisdictional patchwork | Requires C-1 |

## Appendix C: Glossary Terms Used in This Paper

The following Glossary v1.1 terms are used in this paper with the meanings defined in the glossary:

| Term | Context of Use |
|---|---|
| **Buoyant Cooking Plume** | The thermally driven plume from the cooking surface; its physics is the basis for the standards gap analysis |
| **Entrainment Zone** | The plume boundary region where ambient air is drawn in; entrainment rate scaling (z^(5/3)) is the unaddressed physical basis for outdoor CFM requirements |
| **Near-Field Plume Region** | The combustion zone near the source; referenced for completeness but not directly relevant to standards gaps (which concern hood-height behavior) |
| **Velocity Decay** | The z^(-1/3) centerline velocity reduction; unaddressed in consumer guidance that treats CFM as height-independent |
| **Capture Envelope** | The three-dimensional region from which the hood captures plume gas; its outdoor contraction is unaddressed by current standards |
| **Effective Capture Area** | The fraction of the hood opening that actively intercepts plume gas; no standard specifies a minimum outdoor value |
| **Plume Interception Plane** | The horizontal plane at hood height where capture must occur; plume diameter at this plane is the basis for the unaddressed outdoor overhang specification |
| **Momentum-Limited Capture** | Capture failure when edge velocity is insufficient; unaddressed for low convective fraction sources (charcoal, pellet smokers) |
| **Missed Plume Region** | The fraction of the plume that escapes capture; its outdoor enlargement relative to indoor is the physical consequence of the standards gaps |
| **Open-Boundary Dilution** | Atmospheric dispersion of escaped plume gas; the defining outdoor condition that makes first-pass capture essential and that current standards do not address |
| **Wind-Affected Plume Behavior** | Plume deflection and disruption due to crosswind; the physical phenomenon for which no standard provides a correction factor |

---

## References

1. ASHRAE (2016). *ASHRAE Standard 154-2016: Ventilation for Commercial Cooking Operations*. American Society of Heating, Refrigerating and Air-Conditioning Engineers.

2. International Code Council (2021). *2021 International Mechanical Code*. ICC.

3. UL LLC (2019). *UL 710: Exhaust Hoods for Commercial Cooking Equipment*, 7th Edition. Underwriters Laboratories.

4. ASTM International (2018). *ASTM E3087-18: Standard Test Method for Measuring Capture Efficiency of Residential Range Hoods*. ASTM.

5. NFPA (2021). *NFPA 96: Standard for Ventilation Control and Fire Protection of Commercial Cooking Operations*. National Fire Protection Association.

6. ASHRAE (2019). *ASHRAE Handbook — HVAC Applications*, Chapter 33: Kitchen Ventilation. ASHRAE.

7. International Code Council (2021). *2021 International Residential Code*. ICC.

8. Swierczyna, R.T., Sobiski, P.A., and Fisher, D.T. (2008). "Revised Heat Gain and Capture and Containment Exhaust Rates from Cooking Equipment." ASHRAE Research Project RP-1202. ASHRAE.

9. Fisher, D.T., Swierczyna, R.T., and Sobiski, P.A. (2012). "Optimizing the Design of Commercial Kitchen Ventilation Systems." ASHRAE Research Project RP-1482. ASHRAE.

10. Heskestad, G. (2016). "Fire Plumes, Flame Height, and Air Entrainment." Chapter 13, *SFPE Handbook of Fire Protection Engineering*, 5th ed. Springer.

11. Morton, B.R., Taylor, G.I., and Turner, J.S. (1956). "Turbulent gravitational convection from maintained and instantaneous sources." *Proceedings of the Royal Society A*, 234, pp. 1-23.

12. Briggs, G.A. (1984). "Plume Rise and Buoyancy Effects." In *Atmospheric Science and Power Production*, ed. D. Randerson, DOE/TIC-27601.

13. ACGIH (2019). *Industrial Ventilation: A Manual of Recommended Practice for Design*, 30th ed. American Conference of Governmental Industrial Hygienists.

14. Alpert, R.L. (1972). "Calculation of Response Time of Ceiling-Mounted Fire Detectors." *Fire Technology*, 8, pp. 181-195.

15. ASCE (2022). *ASCE/SEI 7-22: Minimum Design Loads and Associated Criteria for Buildings and Other Structures*. American Society of Civil Engineers.

16. Kuehn, T.H., Ramsey, J.W., and Olsen, R.L. (1989). "Effect of Supply Air Temperature, Exhaust Rate, and Cooking Process on Kitchen Hood Performance." ASHRAE Transactions, 95(1).

17. Drysdale, D. (2011). *An Introduction to Fire Dynamics*, 3rd ed. John Wiley & Sons.

---

*This document is a research output of the Outdoor Ventilation Standard, governed by the Research Program Charter v2.6. All terms are used as defined in Glossary v1.1. This paper synthesizes the findings of RB-004 (indoor-versus-outdoor assumption failures) and RB-007 (failure mode taxonomy) into a comprehensive gap analysis of existing standards, codes, test methods, and consumer guidance for outdoor barbecue ventilation.*
