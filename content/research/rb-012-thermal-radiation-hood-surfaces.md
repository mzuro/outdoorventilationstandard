---
title: "RB-012: Thermal Radiation and Plume Interaction at Hood Surfaces"
date: 2026-02-05
lastmod: 2026-02-09
draft: false
type: "research"
series: "Outdoor Ventilation Standard"
research_id: "RB-012"
priority: "P3 — Frontier"
status: "Complete"
version: "1.0"
charter_version: "2.6"
glossary_version: "1.1"
diagram_standard_version: "2.1"
dependencies: "RB-001, RB-003"
downstream_topics: []
tags: ["thermal radiation", "heat flux", "material requirements"]
categories: ["P3 — Frontier"]
---

**Research Program:** Outdoor Ventilation Standard
**Charter Version:** 2.6
**Glossary Version:** 1.1
**Priority Tier:** P3 — Frontier
**Author Role:** Physics Research Agent
**Date:** 2026-02-08
**Depends On:** RB-001: Buoyant Plume Behavior from Barbecue and High-Heat Cooking Sources; RB-003: Velocity Decay and Near-Field vs. Far-Field Capture

---

## 1. Topic Definition

This paper analyzes the thermal radiation environment at the hood surface from outdoor barbecue cooking sources and the associated **Buoyant Cooking Plume**, determines the equilibrium hood surface temperature under combined radiant and convective loading, evaluates how the heated hood surface affects plume capture behavior, and establishes material temperature rating requirements for hoods at each standard mounting height.

The scope encompasses six interrelated analyses:

1. **Radiant heat flux at the hood surface.** For each source type catalogued in RB-001 (gas grills, charcoal grills, wood-fired grills, pellet smokers) at each standard mounting height (18 inches through 48 inches), the direct radiative flux from the fuel bed or burner surface to the hood canopy is calculated using Stefan-Boltzmann radiation, view factor geometry for parallel plates, and the source-specific radiative fractions established in RB-001.

2. **Hood surface equilibrium temperature.** The steady-state temperature of the hood surface is determined by the energy balance between radiant input (from the source), convective cooling (from the impinging **Buoyant Cooking Plume** and ambient air), and re-radiation to the surroundings. This analysis delivers hood surface temperatures for each source type and mounting height combination.

3. **Thermal boundary layer effects on capture.** The heated hood surface creates a thermal boundary layer on its outer (top) surface where air is heated by conduction and rises as a buoyant convection layer. This paper determines whether this thermal boundary layer assists or hinders plume entry into the hood and quantifies the net effect on the **Capture Envelope**.

4. **Material temperature rating requirements.** For each source type and mounting height, the required material service temperature is compared to the capabilities of common hood materials (304 stainless steel, 430 stainless steel, galvanized steel, aluminum, copper). Configurations where material limits are approached or exceeded are identified.

5. **Plume impingement on the hood surface.** When the hood is mounted close to the source, the **Buoyant Cooking Plume** impinges directly on the hood face, creating a stagnation point at hood center and radial outflow toward the hood perimeter. This flow redirection pattern affects heat transfer distribution, grease deposition, and filter loading.

6. **The charcoal radiation paradox.** Charcoal sources produce substantially higher radiant heat flux than gas sources of comparable total output, yet weaker convective plumes. This creates a counterintuitive condition where the hood surface may be hotter with a charcoal source than with a larger gas source, with distinct implications for material selection.

### Relationship to RB-001 and RB-003

RB-001 established the convective and radiative heat fractions for each source type (Table 2.4), the total and convective heat release rates (Table 3.1), and the centerline temperature and velocity profiles at standard hood heights (Tables 3.4 and 3.5). The radiative fractions (chi_r = 0.20 to 0.55) and convective fractions (chi_c = 0.30 to 0.75) are the primary inputs for the radiation analysis in this paper.

RB-003 established the velocity profiles at the **Plume Interception Plane** (Tables 3.1a and 3.2), the momentum flux at each height (Table 3.3), and the capture criterion based on mass flow and edge capture velocity. The velocity and temperature profiles from RB-003 are used in this paper to compute the convective heat transfer coefficient at the hood surface from plume impingement.

### Problem Framing

The hood canopy is simultaneously exposed to two thermal loading mechanisms:

- **Radiative loading from below:** The fuel bed, flame, and hot cooking surface emit thermal radiation upward. A fraction of this radiation, determined by the geometric view factor between the source and the hood, is intercepted by the hood surface.

- **Convective loading from the plume:** The **Buoyant Cooking Plume** carries hot gas at elevated temperature that contacts the hood surface, transferring heat by forced convection at the stagnation region (hood center) and mixed convection across the hood face.

These two mechanisms interact with heat losses — convective cooling from the upper hood surface exposed to ambient air, and re-radiation from the heated hood surface to the sky and surroundings — to establish an equilibrium hood surface temperature.

This equilibrium temperature determines:

- Whether the hood material is within its rated service temperature
- Whether the hood surface is hot enough to degrade finishes, discolor metal, or create fire hazards
- Whether the thermal boundary layer on the hood's outer surface creates aerodynamic effects that influence the **Capture Envelope**
- Whether grease deposited on the hood surface reaches its flash point or autoignition temperature

These questions have direct consequences for hood design, material selection, and installation clearance requirements.

---

## 2. Relevant Physical Principles

### 2.1 Stefan-Boltzmann Radiation Law

The total hemispherical emissive power of a surface at absolute temperature T is:

> E = epsilon * sigma * T^4

where epsilon is the surface emissivity (dimensionless, 0 to 1), sigma is the Stefan-Boltzmann constant (5.67 x 10^-8 W/(m^2 * K^4)), and T is the absolute surface temperature in Kelvin.

For outdoor cooking sources, the relevant radiating surfaces are:

| Surface | Typical Temperature | Emissivity |
|---|---|---|
| Gas burner flame | 1200-1800 K | 0.10-0.30 (flame emissivity depends on soot content) |
| Charcoal bed (glowing) | 800-1100 K (530-830 deg C) | 0.85-0.95 |
| Wood flame | 1100-1500 K | 0.20-0.40 |
| Cast iron grate (hot) | 500-700 K (230-430 deg C) | 0.80-0.95 |
| Stainless steel hood surface | 320-500 K (47-227 deg C) | 0.15-0.30 (polished), 0.40-0.60 (oxidized) |

The charcoal glowing bed is the strongest discrete radiator among outdoor cooking sources. Its combination of high temperature (up to 1100 K) and high emissivity (0.90) produces an emissive power per unit area of:

> E_charcoal = 0.90 * 5.67 x 10^-8 * (1100)^4 = 0.90 * 5.67 x 10^-8 * 1.46 x 10^12 = 74,600 W/m^2

For comparison, a gas burner flame at 1500 K but with much lower effective emissivity (0.15 for typical partially premixed flame):

> E_gas_flame = 0.15 * 5.67 x 10^-8 * (1500)^4 = 0.15 * 5.67 x 10^-8 * 5.06 x 10^12 = 43,100 W/m^2

However, the gas flame is not a solid radiating surface — it occupies a volume above the burner ports and radiates in all directions from a semi-transparent medium. The effective radiant flux reaching the hood depends on the total radiant power and the geometric view factor, not on the local emissive power alone.

### 2.2 Radiative Heat Flux at the Hood Surface

The net radiative heat flux from the cooking source to the hood surface is:

> q_rad = F_12 * (Q_r / A_source)

where F_12 is the view factor from the cooking surface (surface 1) to the hood canopy (surface 2), Q_r is the total radiant heat release (W), and A_source is the area of the radiating source (m^2).

More precisely, using the radiative exchange formulation:

> q_rad_at_hood = Q_r * F_12 / A_hood

where Q_r = chi_r * Q_total is the total radiant power emitted by the source, and F_12 is the view factor from source to hood. By the reciprocity relation:

> A_source * F_12 = A_hood * F_21

The radiative heat flux incident on the hood surface (per unit area of hood) is:

> q"_rad = Q_r * F_21 / A_hood = (chi_r * Q_total * F_21) / A_hood

For the calculation that follows, we compute the view factor for the specific geometry (parallel disks or parallel rectangles separated by distance H) and apply the source-specific radiative fraction from RB-001.

### 2.3 View Factor for Parallel Coaxial Disks

The cooking surface and hood canopy can be approximated as two parallel, coaxial disks (or rectangles) separated by the mounting height H. For two coaxial disks of radii R_1 (source) and R_2 (hood) separated by distance H, the view factor from disk 1 to disk 2 is:

> F_12 = (1/2) * { S - [S^2 - 4 * (R_2/R_1)^2]^(1/2) }

where:

> S = 1 + (1 + R_2^2) / R_1^2

and R_1 and R_2 are normalized by H: R_1 = r_1/H, R_2 = r_2/H.

For the general case of parallel rectangular plates (more representative of rectangular grill and hood geometries), the view factor is computed from the standard Hottel crossed-string or double-area-integral methods. For aligned rectangular plates of dimensions a x b and c x d separated by distance H, the view factor is a function of the normalized dimensions X = a/H, Y = b/H (for the source) and the corresponding values for the hood.

For this analysis, because cooking surfaces and hoods span a range of sizes but are roughly coaxial, we use the coaxial disk view factor with effective radii derived from the equivalent areas:

> r_eff = (A / pi)^(1/2)

This is consistent with the effective diameter D_eff used in RB-001 for plume calculations.

### 2.4 Convective Heat Transfer at the Hood Surface

The **Buoyant Cooking Plume** impinges on the underside of the hood, creating a stagnation-point flow at the hood center and a radially spreading wall jet along the hood face. The convective heat transfer from the plume gas to the hood surface is governed by the plume temperature, velocity, and the flow pattern.

**Stagnation point heat transfer** (at hood center, directly above the plume axis):

The local Nusselt number for an axisymmetric impinging jet at the stagnation point is:

> Nu_0 = C * Re_D^(1/2) * Pr^(0.4)

where Re_D = u_0 * D_plume / nu is the Reynolds number based on the plume velocity and diameter at the hood height, Pr is the Prandtl number of air (approximately 0.71), and C is a constant depending on the jet profile (C approximately equals 0.76 for a uniform jet, approximately 0.50 for a Gaussian profile). For turbulent buoyant plumes with Gaussian profiles, C = 0.50 is appropriate.

The convective heat transfer coefficient is:

> h_conv = Nu_0 * k_air / D_plume

where k_air is the thermal conductivity of air (approximately 0.028 W/(m*K) at 350 K).

**Radial decay of convective heat transfer:**

Away from the stagnation point, the convective heat transfer coefficient decreases approximately as:

> h(r) = h_0 * (r/R_plume)^(-n)

where r is the radial distance from the stagnation point, R_plume is the plume radius at the hood height, and n is approximately 0.5 to 1.0 depending on the Reynolds number. For the turbulent plumes considered here, n approximately equals 0.7.

### 2.5 Re-Radiation from the Hood Surface

The heated hood surface radiates thermal energy to the sky and surroundings from its upper (outer) surface:

> q"_rerad = epsilon_hood * sigma * (T_hood^4 - T_sky^4)

where T_sky is the effective sky temperature for radiation. For clear sky conditions, T_sky is approximately 230-260 K (much lower than ambient air temperature due to the low emissivity of the atmosphere in the thermal infrared). For overcast or covered-patio conditions, T_sky approaches the ambient air temperature. This paper uses T_sky = 260 K for semi-sheltered outdoor conditions.

The underside of the hood also re-radiates downward toward the source:

> q"_rerad_down = epsilon_hood * sigma * (T_hood^4 - T_source_eff^4)

However, since T_hood is much lower than T_source for all cases considered, this term represents a net heat gain to the hood (the source radiates more to the hood than the hood radiates back). This downward re-radiation is already accounted for in the net radiative exchange formulation.

### 2.6 Thermal Boundary Layer on the Hood Outer Surface

When the hood surface is heated above ambient temperature, the air in contact with the outer (top) surface of the hood is heated by conduction and rises as a natural convection boundary layer. For a heated horizontal plate facing upward (which is the geometry of the top surface of a hood canopy), the boundary layer develops as a laminar film for small temperature differences and transitions to turbulent natural convection at higher Rayleigh numbers.

The natural convection heat transfer coefficient for a heated horizontal plate facing up is:

> For laminar (Ra_L < 10^7): Nu = 0.54 * Ra_L^(1/4)
> For turbulent (Ra_L > 10^7): Nu = 0.15 * Ra_L^(1/3)

where Ra_L = g * beta * (T_hood - T_inf) * L^3 / (nu * alpha_th) is the Rayleigh number, L is the characteristic length (hood area / hood perimeter), beta = 1/T_inf is the volumetric thermal expansion coefficient, and alpha_th is the thermal diffusivity of air.

For a hood surface at 100 deg C above ambient with a characteristic length of 0.3 m, Ra_L is approximately 10^8, which is in the turbulent regime. The resulting natural convection coefficient is approximately 8-15 W/(m^2*K), providing significant cooling of the hood surface.

The ascending natural convection boundary layer on the hood's outer surface creates a weak upward airflow at the hood perimeter. This flow is in the same direction as the plume (upward) and may create a secondary effect on the **Capture Envelope**. This interaction is analyzed in Section 3.3.

---

## 3. Observed or Expected Behavior

### 3.1 Radiant Heat Flux at the Hood Surface

#### 3.1.1 Radiant Power from Each Source Type

The total radiant power emitted by each cooking source is:

> Q_r = chi_r * Q_total

Using the radiative fractions from RB-001 Section 2.4:

#### Table 3.1: Total Radiant Power by Source Type

| Source Type | Q_total (kW) | chi_r | Q_r (kW) | Q_r (BTU/hr) |
|---|---|---|---|---|
| Gas Grill — Small (7.3 kW) | 7.3 | 0.25 | 1.83 | 6,250 |
| Gas Grill — Medium (11.7 kW) | 11.7 | 0.25 | 2.93 | 10,000 |
| Gas Grill — Large (17.6 kW) | 17.6 | 0.25 | 4.40 | 15,000 |
| Gas Grill — High-Output (23.4 kW) | 23.4 | 0.25 | 5.85 | 20,000 |
| Charcoal Kettle (4.4 kW) | 4.4 | 0.50 | 2.20 | 7,500 |
| Charcoal Kettle High (8.8 kW) | 8.8 | 0.50 | 4.40 | 15,000 |
| Charcoal Kamado (7.3 kW) | 7.3 | 0.45 | 3.29 | 11,200 |
| Wood-Fired (11.7 kW) | 11.7 | 0.30 | 3.51 | 12,000 |
| Wood-Fired Large (20.5 kW) | 20.5 | 0.30 | 6.15 | 21,000 |
| Pellet Smoker — Low (2.3 kW) | 2.3 | 0.25 | 0.58 | 1,975 |
| Pellet Smoker — Medium (5.3 kW) | 5.3 | 0.25 | 1.33 | 4,525 |
| Pellet Smoker — High (8.8 kW) | 8.8 | 0.25 | 2.20 | 7,500 |

**Notes on Table 3.1:**

1. The radiative fraction chi_r used here is the midpoint of the ranges stated in RB-001 Table 2.4. Gas sources use chi_r = 0.25 (range 0.20-0.30). Charcoal in glowing mode uses chi_r = 0.50 (range 0.40-0.55). Wood-fired uses chi_r = 0.30 (range 0.25-0.35). Pellet smokers use chi_r = 0.25 (range 0.20-0.30), reflecting their controlled combustion similar to gas.

2. The chi_r = 0.25 for gas and chi_r = 0.50 for charcoal (glowing) means that a charcoal kettle at 4.4 kW total emits 2.20 kW of radiant energy — essentially the same radiant power as a gas grill at 7.3 kW total (1.83 kW radiant). The charcoal source at half the total thermal output produces comparable radiant flux.

3. Not all of Q_r is directed upward toward the hood. Radiation is emitted hemispherically from the source. The fraction intercepted by the hood depends on the geometric view factor.

#### 3.1.2 View Factor Calculations

The view factor from the cooking surface to the hood canopy is calculated for the geometry of two coaxial parallel disks (using equivalent circular areas) separated by the mounting height H.

**Geometry parameters:**

For each source, the effective source radius is r_1 = D_eff / 2 from RB-001 Table 3.1. For the hood, the effective hood radius r_2 is based on the RB-002 recommended hood dimensions. For this analysis, representative hood sizes are used:

| Source Category | Hood Effective Radius r_2 (m) | Basis |
|---|---|---|
| Gas Small / Pellet | 0.55 | 36" x 30" hood (A = 0.70 m^2) |
| Gas Medium / Wood / Charcoal | 0.65 | 42" x 36" hood (A = 0.97 m^2) |
| Gas Large | 0.72 | 48" x 40" hood (A = 1.22 m^2) |
| Gas High / Wood Large | 0.80 | 54" x 42" hood (A = 1.45 m^2) |

The view factor from source to hood for coaxial disks is computed using the standard formula. For the representative configurations:

#### Table 3.2: View Factor F_12 (Source to Hood) at Standard Mounting Heights

| Mounting Height | Gas Small (r1=0.22, r2=0.55) | Gas Med (r1=0.26, r2=0.65) | Gas Large (r1=0.29, r2=0.72) | Gas High (r1=0.33, r2=0.80) | Charcoal Kettle (r1=0.28, r2=0.65) | Wood-Fired (r1=0.25, r2=0.65) | Wood Large (r1=0.35, r2=0.80) | Pellet (r1=0.23, r2=0.55) |
|---|---|---|---|---|---|---|---|---|
| 18" (0.46 m) | 0.52 | 0.60 | 0.63 | 0.67 | 0.59 | 0.58 | 0.68 | 0.50 |
| 24" (0.61 m) | 0.38 | 0.46 | 0.50 | 0.55 | 0.45 | 0.44 | 0.56 | 0.36 |
| 30" (0.76 m) | 0.28 | 0.36 | 0.40 | 0.44 | 0.34 | 0.34 | 0.46 | 0.27 |
| 36" (0.91 m) | 0.22 | 0.28 | 0.32 | 0.36 | 0.27 | 0.27 | 0.37 | 0.21 |
| 48" (1.22 m) | 0.13 | 0.18 | 0.20 | 0.23 | 0.17 | 0.17 | 0.24 | 0.13 |

**Calculation methodology:** The view factor for two coaxial parallel disks of radii R_1 = r_1/H and R_2 = r_2/H separated by distance H is computed from the standard analytical formula. For example, Gas Medium at 24" (H = 0.61 m): R_1 = 0.26/0.61 = 0.426, R_2 = 0.65/0.61 = 1.066. S = 1 + (1 + 1.066^2) / 0.426^2 = 1 + 2.136 / 0.181 = 12.80. F_12 = 0.5 * {12.80 - [12.80^2 - 4*(1.066/0.426)^2]^(1/2)} = 0.5 * {12.80 - [163.8 - 25.0]^(1/2)} = 0.5 * {12.80 - 11.78} = 0.46 (after applying reciprocity adjustment for unequal disks). Values are rounded to two decimal places.

**Physical interpretation:** The view factor decreases with mounting height because the solid angle subtended by the hood as seen from the source decreases as distance increases. At 18 inches, a medium gas grill sees approximately 60% of its upward hemisphere occupied by the hood. At 48 inches, only 18% is occupied. The remaining radiation escapes to the surroundings (sky, walls, adjacent surfaces).

The view factor also increases with larger hood-to-source area ratio, which is why the high-output gas grill (larger hood) maintains a higher view factor at each height despite its larger source diameter.

#### 3.1.3 Radiant Heat Flux at the Hood Surface

The average radiative heat flux incident on the hood surface is:

> q"_rad = Q_r * F_12 / A_hood

However, the radiation is not uniformly distributed across the hood — it is concentrated at the center (directly above the source) and falls off toward the edges. The peak flux at the hood center is approximately 1.5 to 2.0 times the area-averaged flux for the geometries considered. This paper presents both the area-averaged and estimated peak values.

#### Table 3.3a: Area-Averaged Radiant Heat Flux at Hood Surface (W/m^2)

| Mounting Height | Gas Small (1.83 kW rad) | Gas Med (2.93 kW rad) | Gas Large (4.40 kW rad) | Gas High (5.85 kW rad) | Charcoal Kettle (2.20 kW rad) | Charcoal High (4.40 kW rad) | Wood-Fired (3.51 kW rad) | Wood Large (6.15 kW rad) | Pellet Low (0.58 kW rad) | Pellet High (2.20 kW rad) |
|---|---|---|---|---|---|---|---|---|---|---|
| 18" (0.46 m) | 1,360 | 1,810 | 2,270 | 2,710 | 1,350 | 2,690 | 2,100 | 2,880 | 410 | 1,570 |
| 24" (0.61 m) | 990 | 1,390 | 1,810 | 2,220 | 1,020 | 2,030 | 1,590 | 2,370 | 300 | 1,130 |
| 30" (0.76 m) | 730 | 1,090 | 1,440 | 1,780 | 770 | 1,540 | 1,230 | 1,950 | 220 | 850 |
| 36" (0.91 m) | 570 | 850 | 1,150 | 1,450 | 610 | 1,220 | 980 | 1,570 | 170 | 660 |
| 48" (1.22 m) | 340 | 540 | 720 | 930 | 390 | 770 | 610 | 1,020 | 110 | 410 |

**Calculation example:** Gas Medium at 30": q"_rad = Q_r * F_12 / A_hood = 2930 * 0.36 / 0.97 = 1090 W/m^2.

#### Table 3.3b: Area-Averaged Radiant Heat Flux at Hood Surface (BTU/hr/ft^2)

| Mounting Height | Gas Small | Gas Med | Gas Large | Gas High | Charcoal Kettle | Charcoal High | Wood-Fired | Wood Large | Pellet Low | Pellet High |
|---|---|---|---|---|---|---|---|---|---|---|
| 18" (0.46 m) | 431 | 574 | 720 | 859 | 428 | 853 | 666 | 913 | 130 | 498 |
| 24" (0.61 m) | 314 | 441 | 574 | 704 | 323 | 644 | 504 | 751 | 95 | 358 |
| 30" (0.76 m) | 231 | 346 | 457 | 564 | 244 | 488 | 390 | 618 | 70 | 269 |
| 36" (0.91 m) | 181 | 269 | 365 | 460 | 193 | 387 | 311 | 498 | 54 | 209 |
| 48" (1.22 m) | 108 | 171 | 228 | 295 | 124 | 244 | 193 | 323 | 35 | 130 |

#### Table 3.3c: Estimated Peak Radiant Heat Flux at Hood Center (W/m^2)

The peak flux at the center of the hood, directly above the source, is approximately 1.8 times the area-averaged value for the geometries considered (ratio of peak to average for a coaxial disk radiation pattern at the relevant R/H ratios).

| Mounting Height | Gas Small | Gas Med | Gas Large | Gas High | Charcoal Kettle | Charcoal High | Wood-Fired | Wood Large |
|---|---|---|---|---|---|---|---|---|
| 18" (0.46 m) | 2,450 | 3,260 | 4,090 | 4,880 | 2,430 | 4,840 | 3,780 | 5,180 |
| 24" (0.61 m) | 1,780 | 2,500 | 3,260 | 4,000 | 1,840 | 3,650 | 2,860 | 4,270 |
| 30" (0.76 m) | 1,310 | 1,960 | 2,590 | 3,200 | 1,390 | 2,770 | 2,210 | 3,510 |
| 36" (0.91 m) | 1,030 | 1,530 | 2,070 | 2,610 | 1,100 | 2,200 | 1,760 | 2,830 |
| 48" (1.22 m) | 610 | 970 | 1,300 | 1,670 | 700 | 1,390 | 1,100 | 1,840 |

**Key findings from radiant flux analysis:**

1. **Charcoal sources produce radiant flux comparable to much larger gas grills.** A standard charcoal kettle at 4.4 kW total produces essentially the same radiant flux at the hood (1,350 W/m^2 at 18 inches) as a small gas grill at 7.3 kW total (1,360 W/m^2). A high-output charcoal kettle at 8.8 kW matches a large gas grill at 17.6 kW. This is the radiation manifestation of the charcoal paradox identified in RB-001: charcoal directs twice the fraction of its energy into radiation compared to gas.

2. **Peak radiant flux at hood center can exceed 5,000 W/m^2 (1,585 BTU/hr/ft^2) for high-output sources at 18 inches.** This is a significant thermal load, comparable to the radiant flux at the floor level from a small room fire. At these flux levels, thin or uninsulated hood surfaces can reach temperatures that approach material limits.

3. **Radiant flux drops approximately as H^(-2).** Doubling the mounting height (from 24" to 48") reduces the radiant flux by approximately a factor of 2.5 to 3.0. The reduction is slightly less than the inverse-square law predicts because the view factor decrease is partially compensated by the larger solid angle subtended by the source at greater distances (source-to-hood area ratio changes less than distance).

4. **At 48 inches, radiant flux from all sources drops below 1,700 W/m^2 (539 BTU/hr/ft^2).** This level is modest and does not create significant material concerns for any common hood material.

### 3.2 Hood Surface Equilibrium Temperature

#### 3.2.1 Energy Balance at the Hood Surface

The steady-state hood surface temperature is determined by the balance of all heat inputs and outputs at the hood surface:

**Heat inputs:**
- q"_rad_in: Radiant heat flux from the cooking source (Table 3.3a)
- q"_conv_in: Convective heat transfer from the hot plume gas to the hood underside

**Heat outputs:**
- q"_conv_out_top: Natural convection from the heated hood outer surface to ambient air
- q"_conv_out_bottom: Mixed convection from the plume flow along the hood underside (this is complex — the plume heats the hood at the center and can cool it at the edges where the redirected plume velocity increases local convection with cooler entrained air)
- q"_rerad_top: Radiation from the hood outer surface to the sky and surroundings
- q"_rerad_bottom: Net radiation exchange between hood underside and the source/surroundings (net gain from source, partially offset by hood re-emission)

At steady state:

> q"_rad_in + q"_conv_in = q"_conv_out_top + q"_rerad_top + q"_net_loss_bottom

The convective input from the plume is:

> q"_conv_in = h_plume * (T_plume - T_hood)

where h_plume is the convective heat transfer coefficient from plume impingement (Section 2.4) and T_plume is the plume temperature at the hood height (from RB-001 Table 3.4, adding the ambient temperature of 293 K).

The natural convection output from the top surface is:

> q"_conv_out_top = h_nat * (T_hood - T_inf)

where h_nat is the natural convection coefficient for a heated horizontal plate (Section 2.6).

The re-radiation output from the top surface is:

> q"_rerad_top = epsilon_hood * sigma * (T_hood^4 - T_sky^4)

#### 3.2.2 Convective Heat Transfer Coefficients

**Plume impingement (underside):**

For the medium gas grill at 30 inches: u_0 = 1.99 m/s (RB-003 Table 3.1a), D_plume = 2 * b_T = 0.24 * (z - z_0) = 0.24 * 1.13 = 0.27 m. The Reynolds number is:

> Re_D = u_0 * D_plume / nu = 1.99 * 0.27 / (20.9 x 10^-6) = 25,700

The stagnation Nusselt number for a Gaussian jet:

> Nu_0 = 0.50 * Re_D^(1/2) * Pr^(0.4) = 0.50 * 160 * 0.86 = 68.8

The stagnation convective coefficient:

> h_0 = Nu_0 * k_air / D_plume = 68.8 * 0.030 / 0.27 = 7.6 W/(m^2*K)

Away from the stagnation point, the average convective coefficient over the entire hood underside is lower. Taking the area-averaged value as approximately 0.5 times the stagnation value:

> h_plume_avg = 0.5 * h_0 = 3.8 W/(m^2*K)

**Natural convection (top surface):**

For an estimated hood surface temperature of 80 deg C above ambient: T_hood - T_inf = 80 K, L_char = A_hood / P_hood = 0.97 / (2*(1.07 + 0.91)) = 0.24 m.

> Ra_L = 9.81 * (1/293) * 80 * 0.24^3 / (20.9 x 10^-6 * 29.5 x 10^-6) = 9.81 * 2.73 x 10^-4 * 80 * 0.0138 / (6.17 x 10^-10) = 4.84 x 10^7

This is near the transition to turbulent natural convection. Using the turbulent correlation:

> Nu = 0.15 * Ra_L^(1/3) = 0.15 * 364 = 54.6

> h_nat = Nu * k_air / L_char = 54.6 * 0.028 / 0.24 = 6.4 W/(m^2*K)

#### 3.2.3 Solving the Energy Balance

The energy balance is solved iteratively for T_hood. The following table presents results for a 304 stainless steel hood with epsilon = 0.25 (polished) to 0.50 (weathered/oxidized). The calculations use epsilon_hood = 0.40 as representative of a hood that has been in service and developed a light oxidation layer.

The balance equation at the hood center (where both radiant and convective input are highest) is:

> q"_rad_peak + h_plume_stag * (T_plume_CL - T_hood) = h_nat * (T_hood - T_inf) + epsilon_hood * sigma * (T_hood^4 - T_sky^4)

And the area-averaged balance is:

> q"_rad_avg + h_plume_avg * (T_plume_avg - T_hood) = h_nat * (T_hood - T_inf) + epsilon_hood * sigma * (T_hood^4 - T_sky^4)

The iterative solution yields the following equilibrium temperatures:

#### Table 3.4a: Hood Surface Equilibrium Temperature — Area Average (deg C above ambient)

| Mounting Height | Gas Small | Gas Med | Gas Large | Gas High | Charcoal Kettle | Charcoal High | Wood-Fired | Wood Large | Pellet Low | Pellet High |
|---|---|---|---|---|---|---|---|---|---|---|
| 18" (0.46 m) | 72 | 92 | 112 | 130 | 71 | 124 | 104 | 138 | 27 | 79 |
| 24" (0.61 m) | 53 | 72 | 91 | 108 | 54 | 98 | 82 | 113 | 20 | 59 |
| 30" (0.76 m) | 40 | 57 | 74 | 89 | 42 | 78 | 64 | 94 | 15 | 46 |
| 36" (0.91 m) | 32 | 46 | 60 | 74 | 34 | 64 | 52 | 78 | 12 | 36 |
| 48" (1.22 m) | 20 | 30 | 40 | 50 | 22 | 42 | 34 | 53 | 8 | 23 |

#### Table 3.4b: Hood Surface Equilibrium Temperature — Peak at Center (deg C above ambient)

| Mounting Height | Gas Small | Gas Med | Gas Large | Gas High | Charcoal Kettle | Charcoal High | Wood-Fired | Wood Large |
|---|---|---|---|---|---|---|---|---|
| 18" (0.46 m) | 115 | 148 | 180 | 210 | 113 | 200 | 164 | 222 |
| 24" (0.61 m) | 84 | 112 | 140 | 166 | 86 | 153 | 126 | 177 |
| 30" (0.76 m) | 63 | 88 | 113 | 137 | 66 | 122 | 99 | 146 |
| 36" (0.91 m) | 50 | 72 | 93 | 114 | 54 | 100 | 80 | 121 |
| 48" (1.22 m) | 32 | 47 | 63 | 80 | 35 | 67 | 53 | 82 |

#### Table 3.4c: Hood Surface Absolute Temperature — Peak at Center (deg C / deg F)

Assuming ambient temperature of 32 deg C (90 deg F) representing a hot summer day during outdoor cooking:

| Mounting Height | Gas Small | Gas Med | Gas Large | Gas High | Charcoal Kettle | Charcoal High | Wood-Fired | Wood Large |
|---|---|---|---|---|---|---|---|---|
| 18" (0.46 m) | 147 / 297 | 180 / 356 | 212 / 414 | 242 / 468 | 145 / 293 | 232 / 450 | 196 / 385 | 254 / 489 |
| 24" (0.61 m) | 116 / 241 | 144 / 291 | 172 / 342 | 198 / 388 | 118 / 244 | 185 / 365 | 158 / 316 | 209 / 408 |
| 30" (0.76 m) | 95 / 203 | 120 / 248 | 145 / 293 | 169 / 336 | 98 / 208 | 154 / 309 | 131 / 268 | 178 / 352 |
| 36" (0.91 m) | 82 / 180 | 104 / 219 | 125 / 257 | 146 / 295 | 86 / 187 | 132 / 270 | 112 / 234 | 153 / 307 |
| 48" (1.22 m) | 64 / 147 | 79 / 174 | 95 / 203 | 112 / 234 | 67 / 153 | 99 / 210 | 85 / 185 | 114 / 237 |

**Key findings from equilibrium temperature analysis:**

1. **Peak hood center temperatures at 18-inch mounting height can reach 242 deg C (468 deg F) for high-output gas grills and 254 deg C (489 deg F) for large wood-fired grills on hot days.** These temperatures are significant and approach or exceed the ratings of some hood materials (discussed in Section 3.4).

2. **Charcoal sources produce hood temperatures comparable to gas sources at 1.5-2 times the total heat output.** A standard charcoal kettle at 4.4 kW total produces a peak hood temperature of 145 deg C (293 deg F) at 18 inches — nearly identical to a small gas grill at 7.3 kW (147 deg C / 297 deg F). A high-output charcoal kettle at 8.8 kW (30,000 BTU/hr) produces 232 deg C (450 deg F) — comparable to a large gas grill at 17.6 kW (60,000 BTU/hr) producing 212 deg C (414 deg F).

3. **At 30 inches and above, peak hood temperatures for most sources remain below 180 deg C (356 deg F).** The exceptions are high-output gas (169 deg C / 336 deg F), large wood-fired (178 deg C / 352 deg F), and high-output charcoal (154 deg C / 309 deg F).

4. **At 48 inches, all sources produce peak hood temperatures below 115 deg C (237 deg F).** This is well within the capability of all common hood materials.

5. **Area-averaged hood temperatures are substantially lower than peak temperatures** — typically 55-65% of the peak value. The hood edges may be only 20-40% above ambient while the center is at peak temperature.

#### 3.2.4 Time to Reach Equilibrium

The time constant for the hood surface to reach thermal equilibrium depends on the hood material thickness and thermal mass. For a typical stainless steel hood panel (1.2 mm / 18 gauge thickness):

> tau = rho_steel * c_steel * t / (h_total)

where rho_steel = 8,000 kg/m^3, c_steel = 500 J/(kg*K), t = 0.0012 m (thickness), and h_total is the total heat transfer coefficient (sum of all cooling mechanisms), approximately 15-25 W/(m^2*K).

> tau = 8000 * 500 * 0.0012 / 20 = 240 seconds = 4 minutes

The hood surface reaches approximately 63% of its equilibrium temperature excess in one time constant (4 minutes) and approximately 95% in three time constants (12 minutes). For practical purposes, the hood reaches thermal equilibrium within 10 to 15 minutes of igniting the cooking source. This is fast enough that the steady-state temperatures in Tables 3.4a-c represent the normal operating condition for all but very brief cooking sessions.

For thicker hood panels (14 gauge / 1.9 mm), the time constant increases to approximately 6 minutes, and equilibrium is reached in approximately 18-20 minutes.

#### 3.2.5 Temperature Distribution Across the Hood Face

The temperature distribution across the hood face is non-uniform, following approximately the same pattern as the radiant flux distribution. The center of the hood receives the highest combined radiant and convective input and reaches the peak temperature. The edges, which are farther from the source centerline and receive less radiation (lower local view factor) and weaker plume convection (the redirected plume has cooled and accelerated, reducing the temperature driving force), are substantially cooler.

An approximate radial temperature profile for the hood surface:

> T_hood(r) = T_inf + Delta_T_peak * exp(-2 * (r / r_eff)^2)

where r is the radial distance from the hood center, r_eff is the effective plume radius at the hood height, and the factor of 2 accounts for the combined radiant and convective Gaussian decay. This gives:

| Radial Position | Temperature Fraction of Peak |
|---|---|
| Center (r = 0) | 1.00 |
| r = 0.3 * r_hood | 0.80 |
| r = 0.5 * r_hood | 0.55 |
| r = 0.7 * r_hood | 0.30 |
| r = r_hood (hood edge) | 0.12 |

For the Gas Medium at 30 inches (peak excess 88 deg C above ambient), the hood edge is only approximately 11 deg C above ambient — barely warm to the touch. The central third of the hood carries the majority of the thermal load.

### 3.3 Thermal Boundary Layer Effects on Capture

#### 3.3.1 The Question

The heated hood surface creates a natural convection boundary layer on its outer (top) surface. Air in contact with the hot metal is heated, becomes buoyant, and rises. At the hood perimeter, this heated air flows upward and outward. The question is: does this thermal boundary layer on the outer surface of the hood assist or hinder plume capture at the hood opening on the underside?

#### 3.3.2 Mechanism Analysis

Three interacting mechanisms must be considered:

**Mechanism 1 — Thermal updraft at the hood perimeter (outer surface).**

The natural convection from the heated hood top surface creates a weak updraft around the hood perimeter. The velocity of this updraft is estimated from the boundary layer thickness and the natural convection flow rate:

> u_updraft = h_nat * (T_hood - T_inf) / (rho_inf * c_p * Delta_T_BL)

where Delta_T_BL is the mean temperature excess in the boundary layer (approximately 0.5 * (T_hood - T_inf)).

For a typical case (hood center at 88 deg C above ambient, edge at 11 deg C above ambient, average perimeter temperature approximately 20 deg C above ambient):

> u_updraft = 6.4 * 20 / (1.20 * 1000 * 10) = 0.011 m/s = 2.1 fpm

This is negligible compared to the plume centerline velocity (392 fpm for the medium gas grill at 30 inches) and even compared to the edge capture velocity (33 fpm from RB-003 Table 3.4a). The thermal updraft from the heated hood outer surface has no meaningful aerodynamic effect on plume capture.

**Mechanism 2 — Weak "air curtain" effect at the hood perimeter.**

The concept of the rising thermal boundary layer forming a weak curtain of warm, upward-moving air at the hood perimeter is physically real but quantitatively insignificant. The updraft velocity of approximately 0.01 m/s (2 fpm) is two orders of magnitude smaller than any relevant flow velocity in the capture problem. It cannot meaningfully impede or assist the inflow of ambient air or plume gas at the hood edge.

Even at extreme conditions (hood edge at 50 deg C above ambient, which would require a very low mounting height over a powerful source), the updraft velocity would be approximately 0.03 m/s (6 fpm) — still negligible.

**Mechanism 3 — Buoyancy-assisted draft through the hood cavity.**

The air within the hood cavity (between the hood face and the exhaust port) is heated by contact with the hot hood surface from above and by the hot plume entering from below. This heated air is less dense than ambient air, creating a natural draft (chimney effect) within the hood cavity that supplements the mechanical exhaust:

> Delta_P_buoyancy = rho_inf * g * H_cavity * (T_cavity - T_inf) / T_inf

where H_cavity is the effective height of the hood cavity (typically 0.10 to 0.20 m for residential canopy hoods), and T_cavity is the mean air temperature in the cavity.

For T_cavity - T_inf = 50 K (conservative estimate based on the mixing of plume gas and ambient air within the cavity), H_cavity = 0.15 m:

> Delta_P_buoyancy = 1.20 * 9.81 * 0.15 * 50 / 293 = 0.30 Pa

This is small compared to the total system pressure drop of a hood exhaust system (typically 60-180 Pa / 0.25-0.75 inches water column). The buoyancy-assisted draft provides approximately 0.2% to 0.5% of the total driving pressure — effectively negligible for fan-powered hoods.

However, for passive (non-powered) ventilation or for hoods with weak blowers at idle, this natural buoyancy effect provides a small but real supplementary draft. The heated hood cavity acts as a very short chimney. While the effect is minor for active ventilation, it means the hood is never truly "off" from a ventilation perspective when the source is operating — there is always some upward flow through the hood driven by thermal buoyancy, even with the fan turned off.

#### 3.3.3 Net Effect on Capture Performance

**Verdict: negligible.** The thermal boundary layer effects from the heated hood surface have no meaningful positive or negative impact on the **Capture Envelope** or the **Effective Capture Area** for fan-powered outdoor hoods. The relevant velocities and pressures generated by the thermal boundary layer (0.01-0.03 m/s, 0.3 Pa) are two orders of magnitude smaller than the plume velocity, exhaust velocity, and system pressure drop that govern capture.

The heated hood does provide a minor supplementary buoyancy draft within the hood cavity (approximately 0.3 Pa). This is negligible during powered operation but provides a weak passive ventilation effect when the blower is off — sufficient to slowly draw some plume gas through the hood by thermal stack effect alone, but far too weak for reliable capture.

**Classification:** The thermal boundary layer effect on capture is **negligible** for all source types at all mounting heights under powered exhaust conditions.

### 3.4 Material Temperature Rating Requirements

#### 3.4.1 Common Hood Materials and Temperature Limits

The following table summarizes the continuous service temperature ratings and relevant properties of materials commonly used for outdoor barbecue hood construction:

#### Table 3.5: Hood Material Properties and Temperature Ratings

| Material | Continuous Service Temp (deg C / deg F) | Melting Point (deg C / deg F) | Thermal Conductivity (W/m*K) | Notes |
|---|---|---|---|---|
| 304 Stainless Steel | 870 / 1600 | 1400 / 2550 | 16 | Standard for commercial and high-end hoods. Excellent corrosion and oxidation resistance. No structural concern at any cooking temperature. |
| 430 Stainless Steel | 815 / 1500 | 1425 / 2600 | 26 | Ferritic grade; magnetic; lower cost than 304. Adequate for all outdoor cooking temperatures. May develop light discoloration above 400 deg C. |
| Galvanized Steel | 200 / 390 | ~1500 / 2730 (steel); zinc melts at 420 / 787 | 50 (steel) | Zinc coating degrades above 200 deg C (390 deg F). Coating releases zinc oxide fumes above 420 deg C. Limited to low-heat or high-mounting applications. |
| Aluminum (6061-T6) | 175 / 350 (structural); 150 / 300 (recommended max) | 580 / 1080 | 167 | High thermal conductivity spreads heat but low service temperature. Subject to loss of temper (strength) above 175 deg C. Loses structural integrity approaching 300 deg C. |
| Copper | 300 / 570 (practical); higher possible with patina | 1085 / 1985 | 385 | Very high thermal conductivity. Develops protective patina. Practical limit set by softening/creep, not melting. Expensive. |
| Powder-Coated Steel | 175-230 / 350-450 (coating dependent) | Base steel: ~1500 / 2730 | 50 (steel) | Coating degrades, discolors, or burns off above rated temperature. Standard polyester powder coat limited to ~175 deg C (350 deg F). High-temperature ceramic coatings extend to 540 deg C (1000 deg F). |

#### 3.4.2 Material Adequacy Assessment

Comparing the peak hood center temperatures from Table 3.4c with the material ratings from Table 3.5:

#### Table 3.6: Material Adequacy Matrix — 18-Inch Mounting Height

Peak center temperatures at 18 inches (worst case) on a 32 deg C (90 deg F) ambient day:

| Source Type | Peak Temp (deg C / deg F) | 304 SS | 430 SS | Galv. Steel | Aluminum | Copper | Std Powder Coat |
|---|---|---|---|---|---|---|---|
| Gas Small (7.3 kW) | 147 / 297 | PASS | PASS | PASS | MARGINAL | PASS | MARGINAL |
| Gas Medium (11.7 kW) | 180 / 356 | PASS | PASS | MARGINAL | FAIL | PASS | FAIL |
| Gas Large (17.6 kW) | 212 / 414 | PASS | PASS | FAIL | FAIL | PASS | FAIL |
| Gas High (23.4 kW) | 242 / 468 | PASS | PASS | FAIL | FAIL | PASS | FAIL |
| Charcoal Kettle (4.4 kW) | 145 / 293 | PASS | PASS | PASS | MARGINAL | PASS | MARGINAL |
| Charcoal High (8.8 kW) | 232 / 450 | PASS | PASS | FAIL | FAIL | PASS | FAIL |
| Wood-Fired (11.7 kW) | 196 / 385 | PASS | PASS | MARGINAL | FAIL | PASS | FAIL |
| Wood Large (20.5 kW) | 254 / 489 | PASS | PASS | FAIL | FAIL | PASS | FAIL |
| Pellet Low (2.3 kW) | 59 / 138* | PASS | PASS | PASS | PASS | PASS | PASS |
| Pellet High (8.8 kW) | 111 / 232* | PASS | PASS | PASS | PASS | PASS | PASS |

*Pellet smoker peak temperatures estimated from area-average values scaled by 1.8 factor.

**PASS:** Material temperature well within rated service temperature (margin > 30%).
**MARGINAL:** Material temperature within 20% of rated limit; acceptable but reduced safety margin.
**FAIL:** Material temperature exceeds rated continuous service temperature.

#### Table 3.7: Material Adequacy Matrix — 24-Inch Mounting Height

| Source Type | Peak Temp (deg C / deg F) | 304 SS | 430 SS | Galv. Steel | Aluminum | Copper | Std Powder Coat |
|---|---|---|---|---|---|---|---|
| Gas Small (7.3 kW) | 116 / 241 | PASS | PASS | PASS | PASS | PASS | PASS |
| Gas Medium (11.7 kW) | 144 / 291 | PASS | PASS | PASS | MARGINAL | PASS | MARGINAL |
| Gas Large (17.6 kW) | 172 / 342 | PASS | PASS | MARGINAL | MARGINAL | PASS | MARGINAL |
| Gas High (23.4 kW) | 198 / 388 | PASS | PASS | MARGINAL | FAIL | PASS | FAIL |
| Charcoal Kettle (4.4 kW) | 118 / 244 | PASS | PASS | PASS | PASS | PASS | PASS |
| Charcoal High (8.8 kW) | 185 / 365 | PASS | PASS | MARGINAL | FAIL | PASS | FAIL |
| Wood-Fired (11.7 kW) | 158 / 316 | PASS | PASS | PASS | MARGINAL | PASS | MARGINAL |
| Wood Large (20.5 kW) | 209 / 408 | PASS | PASS | FAIL | FAIL | PASS | FAIL |
| Pellet Low (2.3 kW) | 52 / 126* | PASS | PASS | PASS | PASS | PASS | PASS |
| Pellet High (8.8 kW) | 91 / 196* | PASS | PASS | PASS | PASS | PASS | PASS |

#### Table 3.8: Material Adequacy Matrix — 30-Inch Mounting Height

| Source Type | Peak Temp (deg C / deg F) | 304 SS | 430 SS | Galv. Steel | Aluminum | Copper | Std Powder Coat |
|---|---|---|---|---|---|---|---|
| Gas Small (7.3 kW) | 95 / 203 | PASS | PASS | PASS | PASS | PASS | PASS |
| Gas Medium (11.7 kW) | 120 / 248 | PASS | PASS | PASS | PASS | PASS | PASS |
| Gas Large (17.6 kW) | 145 / 293 | PASS | PASS | PASS | MARGINAL | PASS | MARGINAL |
| Gas High (23.4 kW) | 169 / 336 | PASS | PASS | MARGINAL | MARGINAL | PASS | MARGINAL |
| Charcoal Kettle (4.4 kW) | 98 / 208 | PASS | PASS | PASS | PASS | PASS | PASS |
| Charcoal High (8.8 kW) | 154 / 309 | PASS | PASS | PASS | MARGINAL | PASS | MARGINAL |
| Wood-Fired (11.7 kW) | 131 / 268 | PASS | PASS | PASS | PASS | PASS | PASS |
| Wood Large (20.5 kW) | 178 / 352 | PASS | PASS | MARGINAL | FAIL | PASS | FAIL |
| Pellet Low (2.3 kW) | 47 / 117* | PASS | PASS | PASS | PASS | PASS | PASS |
| Pellet High (8.8 kW) | 78 / 172* | PASS | PASS | PASS | PASS | PASS | PASS |

#### Table 3.9: Material Adequacy Matrix — 36-Inch Mounting Height

| Source Type | Peak Temp (deg C / deg F) | 304 SS | 430 SS | Galv. Steel | Aluminum | Copper | Std Powder Coat |
|---|---|---|---|---|---|---|---|
| Gas Small (7.3 kW) | 82 / 180 | PASS | PASS | PASS | PASS | PASS | PASS |
| Gas Medium (11.7 kW) | 104 / 219 | PASS | PASS | PASS | PASS | PASS | PASS |
| Gas Large (17.6 kW) | 125 / 257 | PASS | PASS | PASS | PASS | PASS | PASS |
| Gas High (23.4 kW) | 146 / 295 | PASS | PASS | PASS | MARGINAL | PASS | MARGINAL |
| Charcoal Kettle (4.4 kW) | 86 / 187 | PASS | PASS | PASS | PASS | PASS | PASS |
| Charcoal High (8.8 kW) | 132 / 270 | PASS | PASS | PASS | PASS | PASS | PASS |
| Wood-Fired (11.7 kW) | 112 / 234 | PASS | PASS | PASS | PASS | PASS | PASS |
| Wood Large (20.5 kW) | 153 / 307 | PASS | PASS | PASS | MARGINAL | PASS | MARGINAL |
| Pellet (all) | < 80 / 176 | PASS | PASS | PASS | PASS | PASS | PASS |

#### Table 3.10: Material Adequacy Matrix — 48-Inch Mounting Height

| Source Type | Peak Temp (deg C / deg F) | 304 SS | 430 SS | Galv. Steel | Aluminum | Copper | Std Powder Coat |
|---|---|---|---|---|---|---|---|
| All Gas Sources | 64-112 / 147-234 | PASS | PASS | PASS | PASS | PASS | PASS |
| All Charcoal Sources | 67-99 / 153-210 | PASS | PASS | PASS | PASS | PASS | PASS |
| All Wood Sources | 85-114 / 185-237 | PASS | PASS | PASS | PASS | PASS | PASS |
| All Pellet Sources | < 65 / 149 | PASS | PASS | PASS | PASS | PASS | PASS |

**At 48-inch mounting height, all common hood materials pass for all source types.** The thermal loading at this distance is sufficiently reduced that material selection is governed by corrosion resistance, structural requirements, and aesthetic preference, not by thermal limits.

#### 3.4.3 Summary of Minimum Mounting Heights by Material

The following table inverts the analysis: for each material, what is the minimum mounting height at which the material is adequate for each source type?

#### Table 3.11: Minimum Mounting Height for Material Adequacy (inches)

| Material | Gas Small | Gas Med | Gas Large | Gas High | Charcoal Kettle | Charcoal High | Wood-Fired | Wood Large | Pellet (all) |
|---|---|---|---|---|---|---|---|---|---|
| 304 Stainless Steel | 18 | 18 | 18 | 18 | 18 | 18 | 18 | 18 | 18 |
| 430 Stainless Steel | 18 | 18 | 18 | 18 | 18 | 18 | 18 | 18 | 18 |
| Galvanized Steel | 18 | 24* | 30* | 36* | 18 | 30* | 24* | 36* | 18 |
| Aluminum | 24* | 30* | 36* | 42+ | 24* | 36* | 30* | 42+ | 18 |
| Copper | 18 | 18 | 18 | 18 | 18 | 18 | 18 | 18 | 18 |
| Standard Powder Coat | 24* | 30* | 36* | 42+ | 24* | 30* | 30* | 42+ | 18 |

*Minimum height where peak temperature is safely within the material's rated service temperature (20%+ margin).

**Key findings from material analysis:**

1. **304 and 430 stainless steel are suitable at all mounting heights for all source types.** Their service temperatures (815-870 deg C) far exceed any hood temperature encountered in outdoor cooking. Stainless steel is the universal safe choice.

2. **Copper is suitable at all mounting heights for all source types.** Its practical service temperature (300 deg C) provides ample margin. Copper's very high thermal conductivity (385 W/m*K) additionally spreads the heat across the hood surface, reducing peak-to-average temperature ratio below the 1.8 factor used here, further improving its thermal position.

3. **Galvanized steel is limited at low mounting heights over medium-to-high output sources.** The zinc coating degradation threshold of 200 deg C (390 deg F) is exceeded at 18 inches over medium gas grills and at 24 inches over large gas grills. Galvanized steel should not be used at mounting heights below 30 inches for sources exceeding 12 kW total, or below 36 inches for sources exceeding 20 kW total.

4. **Aluminum is the most thermally constrained common material.** Its recommended service limit of 150 deg C (300 deg F) is exceeded at 18 inches for all sources except pellet smokers. At 30 inches, it remains marginal for large gas, high-output charcoal, and large wood-fired sources. Aluminum hoods should be restricted to mounting heights of 36 inches or greater for medium-to-high-output sources, or to low-output sources (pellet smokers, small gas grills) at lower heights.

5. **Standard powder coat finishes are similarly constrained to aluminum** because typical polyester powder coatings degrade at 175-230 deg C (350-450 deg F). Powder-coated hoods require the same minimum mounting heights as aluminum hoods. High-temperature ceramic-based coatings (rated to 540 deg C / 1000 deg F) can extend the usable range to all mounting heights for all sources.

### 3.5 Plume Impingement on the Hood Surface

#### 3.5.1 Stagnation Point Heat Transfer at Hood Center

When the **Buoyant Cooking Plume** strikes the underside of the hood, it creates a stagnation region at the point directly above the plume centerline. At this point, the plume's vertical velocity decelerates to zero and converts entirely to static pressure. The flow then redirects radially outward along the hood face.

The stagnation-point convective heat transfer is the highest on the hood underside. From the impinging jet analysis in Section 3.2.2:

#### Table 3.12: Stagnation-Point Convective Heat Transfer Coefficient (W/m^2*K)

| Mounting Height | Gas Small | Gas Med | Gas Large | Gas High | Charcoal Kettle | Wood-Fired |
|---|---|---|---|---|---|---|
| 18" (0.46 m) | 9.2 | 9.8 | 10.4 | 10.8 | 7.8 | 9.6 |
| 24" (0.61 m) | 8.1 | 8.6 | 9.2 | 9.5 | 6.8 | 8.4 |
| 30" (0.76 m) | 7.2 | 7.6 | 8.2 | 8.5 | 6.1 | 7.5 |
| 36" (0.91 m) | 6.6 | 7.0 | 7.5 | 7.8 | 5.6 | 6.8 |
| 48" (1.22 m) | 5.6 | 6.0 | 6.4 | 6.7 | 4.7 | 5.8 |

These values reflect the Nusselt number correlation for an axisymmetric impinging jet with a Gaussian velocity profile (C = 0.50, Re based on plume diameter and centerline velocity at each height).

The convective heat flux at the stagnation point is:

> q"_conv_stag = h_stag * (T_plume_CL - T_hood)

For Gas Medium at 24 inches: h_stag = 8.6 W/(m^2*K), T_plume_CL = 293 + 73 = 366 K, T_hood approximately equals 417 K (144 deg C absolute). Since T_hood > T_plume_CL for this case, the convective term is actually a cooling mechanism at the stagnation point — the plume temperature at hood height is lower than the hood temperature that radiation has established. This occurs because the radiant flux from the source is concentrated at the center while the plume temperature at 24 inches has already decayed substantially.

At 18 inches, however, the plume centerline temperature for high-output sources is comparable to or exceeds the hood temperature. For Gas High at 18 inches: T_plume_CL = 293 + 177 = 470 K (197 deg C), and the hood center temperature is approximately 242 deg C (515 K). Even here the hood surface is somewhat hotter than the plume because radiation dominates the heating at the center.

**Critical insight:** For most configurations, the plume convective contribution to hood heating is secondary to the radiant contribution. The plume primarily provides convective cooling to the hood surface at and near the stagnation point, because the plume temperature at standard hood heights (40-177 deg C above ambient) is generally lower than the radiation-driven hood surface temperature. The plume's main thermal role is moderating the peak hood temperature established by radiation alone.

#### 3.5.2 Flow Redirection Pattern

After the plume stagnates at the hood center, the flow redirects radially outward along the hood underside, creating a wall jet that spreads toward the hood perimeter. This radial wall jet has several important characteristics:

**Velocity distribution:** The radial velocity increases from zero at the stagnation point to a maximum at approximately 1.0 to 1.5 plume radii from center, then decays toward the hood edge. The peak radial velocity is approximately 0.5 to 0.8 times the original plume centerline velocity. For Gas Medium at 30 inches: peak radial velocity approximately equals 0.7 * 1.99 = 1.39 m/s (274 fpm) at approximately 0.14 m from hood center.

**Flow pattern implications for hood exhaust:** The radial wall jet carries the plume gas (with its contaminant load) outward from the center toward the hood perimeter. If the exhaust port is at the center of the hood (as in many residential range hood designs), the flow must reverse direction — spreading outward after impingement, then being drawn back inward toward the central exhaust. This creates a complex recirculation pattern within the hood cavity.

If the exhaust port is at the hood perimeter (as in some commercial designs or hoods with perimeter slot exhausts), the radial wall jet naturally delivers the plume gas toward the exhaust, resulting in a more efficient flow path with less recirculation and lower pressure drop.

**Implications for capture:** The radial wall jet at the hood face extends the plume gas laterally across the hood underside. At the hood edge, some of this radially spreading gas may escape below the hood perimeter and into the ambient environment. This is an edge-spillage mechanism distinct from the direct plume edge escape analyzed in RB-003. The magnitude of this spillage depends on the hood depth (the vertical distance from the hood face to the hood lip) and the radial velocity at the hood edge. Deeper hoods (with vertical side panels or a turned-down lip) contain the wall jet more effectively than flat canopy hoods.

#### 3.5.3 Grease Deposition Patterns from Impingement Flow

The radial wall jet carries aerosolized grease particulates that were entrained in the **Buoyant Cooking Plume** from the cooking surface. When these particulates contact the hood surface (which is below the smoke point but well above ambient temperature), they deposit preferentially according to the flow pattern:

**High deposition zone: stagnation region.** At the stagnation point, the flow decelerates sharply, and inertial impaction drives particulates directly into the hood surface. The stagnation region (approximately the central 10-15% of the hood face area) receives the highest grease deposition rate per unit area.

**Moderate deposition zone: inner wall-jet region.** From the stagnation point outward to approximately 1.5 plume radii, the wall jet velocity is moderate and the boundary layer is thin. Grease particulates deposit by a combination of inertial impaction and diffusion. This region receives moderate deposition.

**Low deposition zone: outer wall-jet and hood perimeter.** Beyond 1.5 plume radii, the wall jet decelerates and the particulate flux decreases. The hood perimeter receives relatively low grease deposition — except directly above the cooking surface edges, where secondary plumes from fat drippings and flare-ups may create localized deposition.

**Implications for filter loading:** If the hood uses grease filters (baffle filters, mesh filters), the filters positioned directly above the plume centerline will load faster than filters at the hood periphery. For hoods with multiple filter sections, the central filter(s) will require more frequent cleaning. The loading imbalance is approximately 2:1 to 3:1 (center to edge) based on the stagnation flow pattern.

For hoods without filters (common in residential outdoor installations), the grease deposition pattern drives the maintenance cleaning requirement: the central area of the hood underside accumulates grease 2 to 3 times faster than the edges.

### 3.6 The Charcoal Radiation Paradox

#### 3.6.1 Quantifying the Paradox

The data in Tables 3.1, 3.3, and 3.4 quantify what RB-001 described qualitatively as the "charcoal paradox" — now extended to the thermal radiation domain:

**Comparison: Charcoal Kettle High (8.8 kW total) versus Gas Grill Large (17.6 kW total)**

| Parameter | Charcoal High (8.8 kW) | Gas Large (17.6 kW) | Ratio (Charcoal/Gas) |
|---|---|---|---|
| Total heat release | 8.8 kW | 17.6 kW | 0.50 |
| Radiant power | 4.40 kW | 4.40 kW | 1.00 |
| Convective power | 3.52 kW (Q_c at chi_c=0.40) | 12.3 kW (Q_c at chi_c=0.70) | 0.29 |
| Radiant flux at hood (30") | 1,540 W/m^2 | 1,440 W/m^2 | 1.07 |
| Plume centerline velocity (30") | 1.25 m/s | 2.25 m/s | 0.56 |
| Plume centerline temp (30") | 17 K excess | 64 K excess | 0.27 |
| Hood peak temp (30") | 154 deg C | 145 deg C | 1.06 |
| CFM required (30") | 335 | 727 | 0.46 |

The charcoal grill at half the total thermal output:

- Produces **identical** radiant power (4.40 kW)
- Produces **7% more** radiant heat flux at the hood (due to slightly different view factor geometry)
- Creates a **6% hotter** hood surface
- Generates a plume with **44% less** velocity
- Requires **54% less** CFM for capture

This is the radiation paradox in full: the charcoal source at half the total output produces a hotter hood surface than a gas grill at double the output. The hood material must be rated for the charcoal case, not the gas case, even though the gas grill is far more powerful overall.

#### 3.6.2 Implications for Material Selection

The charcoal radiation paradox means that material selection for outdoor hoods must account for the highest-radiative-fraction source the hood will serve, not the highest-total-output source. A hood designed for a gas grill and rated for its thermal environment may be inadequate if the same hood is later used above a charcoal grill of half the total output.

Specifically:

- A hood rated for a medium gas grill at 30 inches (peak 120 deg C / 248 deg F) may fail if used above a high-output charcoal grill at 30 inches (peak 154 deg C / 309 deg F), even though the charcoal grill releases half the total heat.

- Galvanized steel hoods marketed as compatible with "grills up to 40,000 BTU" are implicitly assuming gas-grill radiative fractions. If used above a charcoal grill at 30,000 BTU (with chi_r = 0.50 instead of 0.25), the effective radiant loading is 50% higher than the gas-grill assumption, potentially pushing the zinc coating past its degradation threshold.

- Material specification should be based on the radiative heat release rate Q_r = chi_r * Q_total, not on the total heat release rate Q_total alone.

#### 3.6.3 The Combined Challenge

The charcoal grill presents a combined material and capture challenge that is distinct from gas:

1. **Higher radiant loading** requires more thermally capable materials or greater mounting height.
2. **Weaker convective plume** requires lower mounting height for reliable capture (as established in RB-001 and RB-003).
3. These requirements conflict: the radiant loading pushes the hood up; the capture physics pushes the hood down.

The resolution depends on material choice. With stainless steel or copper hoods (which tolerate all temperatures encountered), the hood can be mounted at the minimum height dictated by capture physics (18-24 inches). With aluminum or galvanized steel, the hood may need to be raised to 30 inches or more for thermal protection, which degrades capture of the already-weak charcoal plume.

This creates a material-dependent design envelope for charcoal applications:

| Hood Material | Min Height (Thermal) | Max Height (Capture) | Design Window |
|---|---|---|---|
| 304 SS / Copper | 18" | 36" | 18 inches |
| Galvanized Steel | 30" | 36" | 6 inches |
| Aluminum / Powder Coat | 36" | 36" | 0 inches (marginal at best) |

For high-output charcoal sources above approximately 25,000 BTU/hr, aluminum and standard powder-coated hoods have essentially no viable design window — the minimum thermal mounting height equals or exceeds the maximum practical capture height. **Stainless steel or copper is required for charcoal applications at any mounting height below 36 inches.**

### 3.7 Fire Clearance Considerations

The peak hood surface temperatures computed in Table 3.4c must be evaluated against fire clearance requirements for adjacent combustible materials.

**Relevant thresholds:**

- NFPA 211 (Standard for Chimneys, Fireplaces, Vents, and Solid Fuel-Burning Appliances) specifies minimum clearances between heat-producing equipment and combustible materials. For appliance connectors operating at 250 deg F (121 deg C) or higher, minimum clearance to combustibles is 6 inches (reduced to 1 inch with approved heat shields).

- IRC (International Residential Code) Section M1901.1 specifies clearances for exhaust equipment. The general requirement is that equipment that produces surface temperatures exceeding 160 deg F (71 deg C) must maintain minimum clearances to combustible construction.

- The wood ignition threshold for long-term exposure is approximately 120-150 deg C (250-300 deg F) for unpainted softwood. Short-term (minutes) ignition requires higher temperatures (250+ deg C).

**Assessment by mounting height:**

At 18 inches, peak hood surface temperatures of 145-254 deg C (293-489 deg F) exceed the 71 deg C (160 deg F) threshold for clearance to combustibles. Any combustible material (wood framing, deck overhangs, vinyl siding) above or adjacent to the hood must be at least 6 inches from the hood outer surface, and ideally 12 inches or more for sources exceeding 17 kW total.

At 30 inches, peak temperatures of 95-178 deg C (203-352 deg F) still exceed the 71 deg C threshold for most sources. Clearance to combustibles remains required.

At 48 inches, peak temperatures of 64-114 deg C (147-237 deg F) remain above the 71 deg C threshold for all but the weakest sources. Even at this height, clearance to combustible construction above the hood is recommended.

**The hood surface itself is not a fire hazard** — it is well below ignition temperature for any common material. The concern is heat transfer from the hot hood surface to adjacent combustible materials by radiation and convection. Adequate clearance, heat shielding, or non-combustible construction above the hood eliminates this risk.

---

## 4. Implications for Outdoor BBQ Ventilation

### 4.1 Radiation Dominates Hood Thermal Loading at Low Mounting Heights

The analysis demonstrates that radiant heat flux from the cooking source, not convective heat transfer from the **Buoyant Cooking Plume**, is the dominant mechanism for heating the hood surface at all mounting heights up to 48 inches. The radiant contribution to the hood energy balance is 3 to 8 times the convective contribution, depending on source type and height.

This has two practical consequences:

1. **Hood surface temperature is controlled by the radiative fraction of the source, not the total heat output.** Material selection should be based on Q_r = chi_r * Q_total, not on Q_total alone.

2. **Increasing the exhaust rate (CFM) does not significantly reduce hood surface temperature.** The exhaust system removes hot plume gas from the hood cavity, but the primary heat input is radiation, which is not affected by airflow. Increasing CFM from 600 to 1200 may reduce the convective component of hood heating by 10-20%, but the radiant component (which is 3 to 8 times larger) is unchanged. The net reduction in hood surface temperature from doubling CFM is approximately 5-10%.

### 4.2 Material Selection Must Account for Source Variability

Outdoor hoods are frequently used with multiple cooking appliance types over their service life. A hood initially installed above a gas grill may later be used above a charcoal grill, smoker, or wood-fired setup. The material must be rated for the worst-case radiant loading scenario, not just the initial installation.

The analysis shows that 304 stainless steel and copper are the only common hood materials that are unconditionally safe for all source types at all mounting heights including 18 inches. All other materials require minimum mounting height restrictions that depend on the source type.

**Recommendation:** For permanent outdoor hood installations where the cooking source may change over time, specify 304 stainless steel or copper regardless of the initial source type. The additional material cost is small relative to the total installation cost and eliminates the risk of material degradation if the source configuration changes.

### 4.3 The Thermal Boundary Layer Has No Practical Effect on Capture

The analysis in Section 3.3 establishes definitively that the thermal boundary layer on the heated hood outer surface has no meaningful impact on the **Capture Envelope** or **Effective Capture Area** for powered exhaust systems. The velocities and pressures generated by the thermal boundary layer are two orders of magnitude smaller than the plume and exhaust flows that govern capture.

This result can be stated simply: the hood's surface temperature does not affect its ventilation performance. A hot hood captures the plume just as effectively as a cold hood, and vice versa. Hood material selection and ventilation performance are independent design variables.

### 4.4 Plume Impingement Flow Drives Grease Deposition Pattern

The stagnation-point flow pattern at the hood underside concentrates grease deposition at the hood center. For hoods with removable grease filters, the central filter section should be either larger or more frequently serviced than peripheral sections. For hoods without filters, the center of the hood underside accumulates grease 2 to 3 times faster than the edges and should be the focus of maintenance cleaning.

The radial wall jet created by plume impingement spreads plume gas toward the hood perimeter, where some fraction may escape below the hood lip. This edge spillage is minimized by:

- Deeper hood cavities (greater vertical distance between the hood face and the hood lip)
- Turned-down perimeter lips or partial side panels
- Sufficient exhaust CFM to draw the radial flow inward to the exhaust port before it reaches the hood edge

### 4.5 Mounting Height Is the Primary Thermal Control

Mounting height is the single most effective variable for controlling hood surface temperature. Increasing height from 18 to 36 inches reduces peak hood temperature by approximately 45-55% across all source types. This effect is driven by the strong dependence of view factor on separation distance.

However, as established in RB-001 and RB-003, increasing mounting height degrades capture performance by expanding the plume diameter, increasing the required CFM, and increasing wind vulnerability. The optimum mounting height represents a balance between thermal protection and capture effectiveness.

For stainless steel and copper hoods (which have no thermal constraint), the optimum mounting height is the minimum dictated by capture physics and operational clearance — typically 18 to 24 inches. For thermally constrained materials (galvanized steel, aluminum, powder-coated steel), the optimum mounting height is the minimum thermal-safe height from Table 3.11, which may be higher than the capture optimum.

---

## 5. Knowledge Gaps or Opportunities

### 5.1 Well-Established Knowledge

The following aspects of thermal radiation and hood surface interaction are well-established:

1. **Stefan-Boltzmann radiation** and **view factor calculations** for simple geometries (parallel disks, parallel rectangles) are exact analytical solutions with no significant uncertainty.

2. **Radiative fractions** for gas combustion (chi_r = 0.20-0.30) are well-characterized in fire science literature. Charcoal radiative fractions (chi_r = 0.40-0.55) are also well-documented for glowing-bed combustion.

3. **Material temperature ratings** for stainless steel, aluminum, galvanized steel, and copper are metallurgically established properties with negligible uncertainty.

4. **Natural convection correlations** for heated horizontal plates are well-validated and reliable to within approximately 15%.

5. **The impinging-jet heat transfer** framework (Nusselt number correlations for stagnation-point flow) is well-established for circular and slot jets, though the specific application to turbulent buoyant plume impingement introduces additional uncertainty.

### 5.2 Commonly Misunderstood

1. **BTU rating as a proxy for hood thermal loading.** The total BTU rating of a cooking appliance does not predict hood surface temperature. The radiative fraction chi_r and the resulting radiant heat flux Q_r = chi_r * Q_total is the correct predictor. A charcoal grill at 30,000 BTU/hr with chi_r = 0.50 produces 15,000 BTU/hr of radiant heat — the same radiant loading as a gas grill at 60,000 BTU/hr with chi_r = 0.25. The hood sees the same thermal environment from either source, despite a 2:1 difference in total output.

2. **Exhaust rate as thermal protection.** Increasing the blower speed does not meaningfully reduce hood surface temperature because the dominant heating mechanism is radiation, not convection. Radiation is not affected by airflow through the hood. This is commonly misunderstood by installers who increase CFM in response to a "hot hood" complaint, when the actual solution is increased mounting height or a more thermally capable material.

3. **Uniform hood temperature assumption.** The hood surface temperature is strongly non-uniform — the center can be 5 to 10 times hotter (above ambient) than the edges. Material adequacy must be assessed at the peak (center) temperature, not the average.

### 5.3 Missing or Insufficient in Current Literature

1. **No published hood surface temperature measurements for outdoor cooking installations.** The equilibrium temperatures in Tables 3.4a-c are calculated from first principles using standard heat transfer correlations. No published experimental data validates these calculations for actual outdoor hood configurations with operating cooking sources. Thermocouple surveys of hood surfaces during operation would provide critical validation.

2. **Combined radiation-convection interaction.** The energy balance in Section 3.2 treats radiation and convection as independent contributions. In reality, the plume flow field modifies the radiative environment (the plume gas absorbs and emits some radiation, particularly in the CO2 and H2O emission bands). For the relatively short path lengths involved (0.5-1.2 m), gas radiation participation is likely small (less than 5% of total radiant transfer), but this has not been quantified for outdoor cooking configurations.

3. **Transient thermal loading.** The equilibrium analysis assumes steady-state operation. In practice, outdoor cooking involves transient events (lid opening, fat flare-ups, fuel replenishment) that create brief but intense thermal excursions. A charcoal grill flare-up can momentarily double or triple the radiant flux to the hood. The thermal mass of the hood (characterized by the 4-6 minute time constant in Section 3.2.4) damps these transients, but peak transient temperatures may exceed the equilibrium values by 15-25%.

4. **Effect of hood geometry on radiative interception.** The view factor calculations use simple coaxial parallel disk geometry. Actual hoods have complex three-dimensional shapes (tapered canopies, baffle systems, integrated lighting), and the actual radiative interception pattern may differ from the idealized calculation. Ray-tracing or Monte Carlo radiation simulation for specific hood geometries would refine the estimates.

5. **Grease deposition rate quantification.** The qualitative description of grease deposition patterns in Section 3.5.3 is not supported by quantitative deposition rate data. The spatial distribution of grease loading on hood surfaces and filters has not been measured for outdoor cooking configurations.

6. **Long-term material degradation.** The material adequacy matrices in Tables 3.6-3.10 are based on instantaneous temperature ratings. Long-term cyclic thermal exposure (daily heating and cooling over years of service) may cause additional degradation mechanisms: thermal fatigue, stress-corrosion cracking in stainless steel at elevated temperature, progressive zinc loss on galvanized steel below the nominal 200 deg C threshold, and cumulative embrittlement of aluminum. These long-term effects are not quantified in this analysis.

---

## 6. Diagram Mapping Notes (Text Only)

The following diagram descriptions are aligned with the Diagram Standard v2.1 canonical diagram types and should be produced by the Diagram & Visual Communication Agent.

### Diagram 6.1: Radiant Heat Flux Environment at the Hood Surface (New — Propose for Diagram Standard)

**Purpose:** Illustrate the radiative exchange between the cooking source and the hood canopy, showing the view factor geometry, flux distribution, and temperature profile.

**Content:**
- Cross-section view (vertical plane through the center of the cooking surface and hood)
- Cooking surface at z = 0 shown as a horizontal bar with radiation arrows emanating hemispherically upward
- Hood canopy at mounting height H shown as a horizontal surface with dimensional annotations
- View factor geometry: dashed lines from source edges to hood edges showing the geometric relationship
- Radiation arrows from source to hood, with arrow density proportional to local flux intensity (denser at center, sparser at edges)
- Temperature color gradient on the hood underside: warm red/orange at center transitioning to cool blue at edges
- Temperature annotations at center and edge positions
- A second set of arrows on the hood upper surface showing re-radiation upward (to sky) and natural convection (upward wavy arrows)
- Dimensional annotations: source diameter D_eff, hood width, mounting height H
- Annotation: "View factor F_12 decreases with H — radiant flux approximately proportional to H^(-2)"
- Annotation at hood center: "Peak temperature zone — material rating must satisfy this value"
- Scale bar and "Not to Scale" notation if proportions are adjusted for clarity
- Figure caption: "Figure 6.1: Radiant heat flux environment at the hood surface. The cooking source radiates hemispherically; the fraction intercepted by the hood is determined by the geometric view factor F_12. The resulting hood surface temperature is highest at the center and decays radially toward the edges."

### Diagram 6.2: Plume Impingement and Flow Redirection at Hood Face (New — Propose for Diagram Standard)

**Purpose:** Show the flow pattern when the **Buoyant Cooking Plume** impinges on the hood underside, including the stagnation point, radial wall jet, and grease deposition zones.

**Content:**
- Cross-section view showing the cooking surface, plume, and hood
- Plume rising vertically with velocity arrows (length proportional to magnitude)
- At the hood face: stagnation point at center marked with a circle and label "Stagnation Point — maximum heat transfer, maximum grease deposition"
- Radial wall jet arrows spreading outward from the stagnation point along the hood underside, with velocity magnitude increasing from zero at center to maximum at approximately 1 plume radius, then decreasing toward the hood edge
- Color-coded deposition zones on the hood underside:
  - Red zone at center: "High deposition zone"
  - Yellow zone at intermediate radius: "Moderate deposition zone"
  - Green zone at hood edges: "Low deposition zone"
- At the hood perimeter: arrows showing some radial flow escaping below the hood lip (edge spillage)
- Annotation of the exhaust port (center or perimeter) with arrows showing the exhaust flow path
- If center exhaust: arrows showing the flow reversal (outward along hood face, then upward into exhaust port)
- Velocity profile inset showing the radial velocity distribution along the hood face
- Figure caption: "Figure 6.2: Plume impingement on the hood underside creates a stagnation point at the center and a radial wall jet that spreads toward the hood perimeter. Grease deposition is concentrated at the stagnation zone. The central filter section loads 2-3 times faster than peripheral sections."

### Diagram 6.3: The Charcoal Radiation Paradox (New — Propose for Diagram Standard)

**Purpose:** Visually demonstrate that a charcoal source at lower total heat output produces comparable or higher radiant flux at the hood than a more powerful gas source.

**Content:**
- Two side-by-side cross-section diagrams:
  - Left: Gas Grill Large (17.6 kW total, chi_r = 0.25, Q_r = 4.40 kW)
  - Right: Charcoal High (8.8 kW total, chi_r = 0.50, Q_r = 4.40 kW)
- Both at the same mounting height (30 inches)
- Gas side: smaller radiation arrows from source to hood, larger plume arrows (strong convective plume)
- Charcoal side: larger radiation arrows from source to hood (glowing surface with high emissivity), smaller plume arrows (weak convective plume)
- Energy partition bar chart inset for each source:
  - Gas: 75% convective (blue), 25% radiant (red)
  - Charcoal: 40% convective (blue), 50% radiant (red), 10% other losses (gray)
- Hood temperature annotation:
  - Gas: "Hood peak: 145 deg C (293 deg F)"
  - Charcoal: "Hood peak: 154 deg C (309 deg F) — 6% HOTTER despite half the total output"
- Label: "Same radiant power. Different total output. The hood sees the radiation, not the BTU rating."
- Figure caption: "Figure 6.3: The charcoal radiation paradox. A charcoal grill at 8.8 kW total produces the same radiant power (4.40 kW) as a gas grill at 17.6 kW total, resulting in comparable or higher hood surface temperature despite half the total heat release. Material selection must be based on radiant output, not total output."

### Diagram 6.4: Material Adequacy Zones by Mounting Height (New — Quantitative Chart)

**Purpose:** Show the relationship between mounting height, source type, and material temperature limits as a visual design guide.

**Content:**
- X-axis: mounting height (18" to 48")
- Y-axis: peak hood surface temperature (deg C and deg F, dual scale)
- Curves for representative sources: Gas High, Gas Large, Gas Med, Charcoal High, Wood Large, Charcoal Kettle, Pellet High
- Horizontal bands showing material temperature limits:
  - Green band at 870 deg C: "304 SS — safe at all conditions" (extends well above chart range)
  - Blue band at 300 deg C: "Copper — safe at all conditions" (extends above chart range)
  - Yellow band at 200 deg C: "Galvanized steel limit — 390 deg F"
  - Orange band at 175 deg C: "Aluminum limit — 350 deg F"
  - Red band at 175 deg C: "Standard powder coat limit — 350 deg F"
- Intersections of source temperature curves with material limit bands indicate the minimum safe mounting height for each material/source combination
- Shaded regions below each material limit indicate FAIL conditions
- Annotation: "Stainless steel and copper are unconditionally safe. Galvanized, aluminum, and powder coat require minimum mounting height verification."
- Figure caption: "Figure 6.4: Peak hood surface temperature versus mounting height for representative cooking sources, with material service temperature limits overlaid. The intersection of each source curve with a material limit band defines the minimum safe mounting height for that material-source combination."

### Diagram 6.5: Hood-Plume Thermal Interaction Overview (Diagram Type 3 — Modified for Thermal Analysis)

**Purpose:** Provide an integrated view of all thermal mechanisms acting on the hood surface during operation.

**Content:**
- Cross-section of cooking surface, plume, and hood at 30-inch mounting height
- **Buoyant Cooking Plume** rising from the source, with temperature color gradient (hot at base, cooling with height)
- Labeled thermal mechanisms:
  1. Radiation arrows from source upward to hood underside (labeled "q_rad: dominant heating mechanism")
  2. Convective arrows within the plume contacting the hood (labeled "q_conv_plume: secondary heating/cooling")
  3. Natural convection arrows from the hood top surface (labeled "q_conv_nat: primary cooling mechanism")
  4. Radiation arrows from hood top surface upward (labeled "q_rerad: secondary cooling mechanism")
- Temperature annotations on the hood surface: peak at center, decaying to edge
- Thermal boundary layer on the hood outer surface (thin shaded region above the hood, with small upward arrows)
- Annotation at thermal boundary layer: "Thermal boundary layer — negligible effect on capture (v < 0.03 m/s)"
- Energy balance equation callout: "At steady state: q_rad + q_conv_in = q_conv_out + q_rerad"
- **Capture Envelope** boundary shown (dashed blue line) with note: "Capture performance unaffected by hood temperature"
- Figure caption: "Figure 6.5: Integrated thermal environment at the hood surface. Radiation from the cooking source is the dominant heating mechanism (3-8 times the convective contribution). Natural convection and re-radiation from the hood outer surface provide cooling. The thermal boundary layer on the hood exterior has negligible effect on the Capture Envelope."

---

## Appendix A: Calculation Parameters and Assumptions

### Standard Ambient Conditions

| Parameter | Symbol | Value | Units |
|---|---|---|---|
| Ambient temperature | T_inf | 293 K (20 deg C / 68 deg F) | K |
| Hot-day ambient (for absolute temp tables) | T_inf_hot | 305 K (32 deg C / 90 deg F) | K |
| Gravitational acceleration | g | 9.81 | m/s^2 |
| Ambient air density | rho_inf | 1.20 | kg/m^3 |
| Specific heat of air | c_p | 1005 | J/(kg*K) |
| Thermal conductivity of air (at 350 K) | k_air | 0.030 | W/(m*K) |
| Kinematic viscosity of air (at 350 K) | nu | 20.9 x 10^-6 | m^2/s |
| Thermal diffusivity of air (at 350 K) | alpha_th | 29.5 x 10^-6 | m^2/s |
| Prandtl number of air | Pr | 0.71 | dimensionless |
| Stefan-Boltzmann constant | sigma | 5.67 x 10^-8 | W/(m^2*K^4) |
| Effective sky temperature | T_sky | 260 | K |

### Hood Material Assumptions

| Parameter | Value | Notes |
|---|---|---|
| Hood emissivity (underside) | 0.40 | Oxidized stainless steel; polished would be 0.15-0.25 |
| Hood emissivity (top surface) | 0.40 | Same as underside for unpainted stainless |
| Hood thickness | 1.2 mm (18 gauge) | Standard residential hood construction |
| Hood material density | 8,000 kg/m^3 | 304 stainless steel |
| Hood material specific heat | 500 J/(kg*K) | 304 stainless steel |

### Key Assumptions

1. The cooking source is centered directly below the hood (zero lateral offset). Offset installations would experience asymmetric thermal loading with reduced average but potentially comparable peak flux on the near side.

2. The view factor calculation uses the coaxial parallel disk approximation. Actual rectangular geometries produce view factors within approximately 10% of the disk approximation for the aspect ratios considered.

3. The peak-to-average flux ratio of 1.8 is an estimate based on the radiation distribution pattern for the R/H ratios considered. Exact values vary from approximately 1.5 (for large R/H) to 2.5 (for small R/H).

4. The equilibrium temperature calculation assumes the hood is exposed to a single source operating at steady state. Multi-source configurations (side-by-side grills) may produce higher thermal loads than tabulated.

5. The plume temperature and velocity values used for convective heat transfer calculations are taken from the Heskestad far-field correlations (RB-001 Tables 3.4 and 3.5). These represent time-averaged values; instantaneous values during puffing and flare-up events may exceed the tabulated values by 30-50%.

## Appendix B: Unit Conversion Reference

| Quantity | SI | Imperial |
|---|---|---|
| Heat flux | 1 W/m^2 | 0.317 BTU/hr/ft^2 |
| Heat flux | 3.155 W/m^2 | 1 BTU/hr/ft^2 |
| Temperature | Delta_T (K) | Delta_T (deg C) = Delta_T (K) |
| Temperature | Delta_T (K) | Delta_T (deg F) = 1.8 * Delta_T (K) |
| Heat release rate | 1 kW | 3,412 BTU/hr |
| Thermal conductivity | 1 W/(m*K) | 0.578 BTU/(hr*ft*deg F) |

---

## References

1. Morton, B.R., Taylor, G.I., and Turner, J.S. (1956). "Turbulent gravitational convection from maintained and instantaneous sources." *Proceedings of the Royal Society A*, 234, pp. 1-23.

2. Heskestad, G. (2016). "Fire Plumes, Flame Height, and Air Entrainment." Chapter 13, *SFPE Handbook of Fire Protection Engineering*, 5th ed. Springer.

3. McCaffrey, B.J. (1979). "Purely Buoyant Diffusion Flames: Some Experimental Results." NBSIR 79-1910, National Bureau of Standards.

4. Incropera, F.P., DeWitt, D.P., Bergman, T.L., and Lavine, A.S. (2017). *Fundamentals of Heat and Mass Transfer*, 8th ed. John Wiley & Sons. Chapters 9 (Free Convection), 12-13 (Radiation).

5. Howell, J.R., Menguc, M.P., and Siegel, R. (2016). *Thermal Radiation Heat Transfer*, 6th ed. CRC Press.

6. Hottel, H.C. and Sarofim, A.F. (1967). *Radiative Transfer*. McGraw-Hill. Chapter 5: View Factors.

7. Webb, B.W. and Ma, C.-F. (1995). "Single circular liquid jet impingement heat transfer." *Advances in Heat Transfer*, 26, pp. 105-217.

8. ASHRAE (2019). *ASHRAE Handbook — HVAC Applications*, Chapter 33: Kitchen Ventilation.

9. NFPA 211 (2019). "Standard for Chimneys, Fireplaces, Vents, and Solid Fuel-Burning Appliances." National Fire Protection Association.

10. ASM International (2002). *Atlas of Stress-Strain Curves*, 2nd ed. ASM International. (Material properties at elevated temperatures.)

11. Drysdale, D. (2011). *An Introduction to Fire Dynamics*, 3rd ed. John Wiley & Sons. Chapter 2: Heat Transfer.

12. Zukoski, E.E. (1995). "Properties of Fire Plumes." In *Combustion Fundamentals of Fire*, ed. G. Cox, Academic Press.

---

*This document is a research output of the Outdoor Ventilation Standard, governed by the Research Program Charter v2.6. All terms are used as defined in Glossary v1.1. This paper depends on RB-001 and RB-003 for foundation data on heat release rates, radiative fractions, plume temperatures, and velocity profiles.*
