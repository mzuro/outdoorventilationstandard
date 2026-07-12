// smoke.mjs — living-smoke VISUALIZATION for OVS instruments (v2.1 F1).
//
// The smoke is NOT a second physics model. Every particle rides the SAME
// trajectory the capture model integrates: horizontal drift per unit rise is
// exactly the deflection integrand (windward crossflow ÷ centerline velocity,
// wind.mjs), buoyant rise slows with the centerline-velocity decay
// (plume.mjs centerlineVelocity), lateral spread grows with plumeRadius
// (plume.mjs), and whether a particle is tinted ember-orange (escaping) is
// decided by the SAME reflected-Gaussian partition captureFraction uses
// (capture.mjs) — so the ensemble escape fraction agrees with the capture
// readout by construction (tests/smoke.test.mjs asserts ±0.15).
//
// This module must import cleanly under plain node (no document/window): the
// pure exports below carry all the physics and are unit-tested headless; the
// createSmokeField factory is a harmless no-op when there is no SVG group.

import { plumeRadius, centerlineVelocity } from './physics/plume.mjs';
import { deflection } from './physics/wind.mjs';
import { effectiveWind } from './physics/sidepanels.mjs';
import { WIND_COUPLING } from './physics/capture.mjs';

/** Hard live-particle cap (Global Constraint: ≤120 live particles). */
export const MAX_PARTICLES = 120;

/**
 * Inverse standard-normal CDF (probit). Acklam's rational approximation;
 * |abs error| < 1.15e-9. Pure. Used to place a particle's depth/width
 * offsets on the same Gaussian the capture integral assumes, from a uniform
 * quantile in (0, 1).
 */
export function probit(p) {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  const a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
  const b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
  const c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
  const d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];
  const plow = 0.02425, phigh = 1 - plow;
  let q, r;
  if (p < plow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
           ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (p <= phigh) {
    q = p - 0.5; r = q * q;
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
           (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  }
  q = Math.sqrt(-2 * Math.log(1 - p));
  return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
          ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
}

/**
 * The wind the plume actually feels — panel attenuation × the RB-006
 * coupling coefficient — identical to what captureFraction integrates with.
 * Pure.
 */
export function plumeWindOf(windMph, panels = 'none') {
  return WIND_COUPLING * effectiveWind(windMph, panels);
}

/**
 * Horizontal drift per inch of rise at height z: d(deflection)/dz =
 * u_wind(fpm) / u_centerline(z). This IS the integrand of wind.mjs
 * deflection(), so a particle stepped by (driftRate·dz) traces the deflected
 * centerline exactly. Sign follows the wind (downwind positive). Pure.
 */
export function driftRate(zIn, plumeWind, w0 = 400) {
  return (plumeWind * 88) / centerlineVelocity(zIn, w0);
}

/**
 * Buoyant vertical speed at height z, in inches per ms, scaled so a parcel
 * takes ~riseSeconds to climb from the source to the hood at the base
 * velocity. Because it tracks centerlineVelocity(z), the rise visibly SLOWS
 * as the plume decays — the physical signature, not decoration. Pure.
 */
export function riseSpeedInPerMs(zIn, w0 = 400, k = 1) {
  return centerlineVelocity(zIn, w0) * k;
}

/**
 * Advect a particle by dtMs. Rises per centerline velocity, drifts downwind
 * per the deflection integrand, so its path is the same trajectory the
 * capture model bends. Mutates and returns the particle. Pure (no DOM). The
 * returned dz/dx let the caller add per-particle turbulence around this
 * physics baseline.
 */
export function advect(p, dtMs, { plumeWind, w0 = 400, k }) {
  const dz = riseSpeedInPerMs(p.z, w0, k) * dtMs;
  const dx = driftRate(p.z, plumeWind, w0) * dz; // dx = (dx/dz)·dz
  p.z += dz;
  p.driftIn += dx;
  return p;
}

/**
 * Is a parcel with Gaussian depth/width offsets (inches, ~N(0, sigma))
 * CAPTURED by the aperture? This is the per-particle form of the exact
 * partition captureFraction() integrates:
 *   axial (island): (xc + depthOff) ∈ [−D/2, D/2]
 *   axial (wall):   |xc + depthOff| ≤ D    (reflected Gaussian at the wall)
 *   lateral:        |widthOff| ≤ widthIn/2
 * captured ⟺ axial ∧ lateral. Pure. Escape (ember tint) is the negation.
 */
export function particleCaptured({ depthOff, widthOff }, { xc, depthIn, widthIn, mount }) {
  let axial;
  if (mount === 'wall') {
    axial = Math.abs(xc + depthOff) <= depthIn;
  } else {
    axial = (xc + depthOff) >= -depthIn / 2 && (xc + depthOff) <= depthIn / 2;
  }
  const lateral = Math.abs(widthOff) <= widthIn / 2;
  return axial && lateral;
}

/** Physics parameters the field derives once per update. Pure. */
export function deriveParams({ widthIn, depthIn, mount, riseIn, windMph, panels = 'none', w0 = 400 }) {
  const plumeWind = plumeWindOf(windMph, panels);
  const sigma = plumeRadius(riseIn) / 2;          // capture.mjs sigma
  const xc = deflection(riseIn, plumeWind, { w0 }); // capture.mjs deflection
  const finalRadius = plumeRadius(riseIn);
  return { widthIn, depthIn, mount, riseIn, windMph, panels, w0, plumeWind, sigma, xc, finalRadius };
}

/**
 * Deterministic (low-variance) estimate of the escaping smoke fraction from
 * the per-particle partition above, over an n×n stratified grid of Gaussian
 * quantiles. Independently derived from particleCaptured — NOT a call to
 * captureFraction — so tests can assert the two AGREE (that the smoke can
 * never disagree with the readout). Pure.
 */
export function escapeFraction(state, n = 24) {
  const p = deriveParams(state);
  let captured = 0, total = 0;
  for (let i = 0; i < n; i++) {
    const du = (i + 0.5) / n;
    const depthOff = probit(du) * p.sigma;
    for (let j = 0; j < n; j++) {
      const dv = (j + 0.5) / n;
      const widthOff = probit(dv) * p.sigma;
      total++;
      if (particleCaptured({ depthOff, widthOff }, p)) captured++;
    }
  }
  return 1 - captured / total;
}

// --- deterministic per-field RNG (mulberry32) — stable, no Math.random in
//     the hot path so particle streams are reproducible per field instance --
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const hasDom = typeof document !== 'undefined';
const NS = 'http://www.w3.org/2000/svg';

/**
 * createSmokeField(svgGroup, geom) — the DOM layer. geom is the FIXED pixel
 * geometry: { sourceX, sourceY, pxPerIn }. Returns
 *   .update(state)   — state = { widthIn, depthIn, mount, riseIn, windMph, panels, w0 }
 *   .frame(nowMs)    — one animation step (driven by the engine's single rAF)
 *   .setReduced(bool).pause().resume().destroy()
 * No-op object when there is no DOM / no group (headless test import).
 *
 * Contract note (F1 review): geom deliberately carries NO hoodPlaneY. The
 * capture/recycle plane is authoritative in PHYSICS space — a particle
 * retires at z ≥ riseIn (state.riseIn, inches), and every pixel position is
 * sourceY − z·pxPerIn. A separate pixel-space hood plane would be a second
 * source of truth that could silently disagree with riseIn, so F2
 * instruments must not wire one up: pass source + scale and let riseIn
 * define the plane.
 */
export function createSmokeField(svgGroup, geom) {
  if (!hasDom || !svgGroup) {
    return { update() {}, frame() {}, setReduced() {}, pause() {}, resume() {}, destroy() {} };
  }

  const { sourceX, sourceY, pxPerIn } = geom;
  const rand = mulberry32(0x9e3779b9);
  let params = deriveParams({ widthIn: 48, depthIn: 40, mount: 'island', riseIn: 30, windMph: 0 });
  let reduced = false;
  let paused = false;
  let lastNow = 0;
  let spawnAccum = 0;

  const particles = [];
  const pool = []; // SVG <circle> reuse

  // static reduced-motion silhouette (one filled path from the plumeRadius
  // envelope, deflected centerline). Hidden until setReduced(true).
  const silhouette = document.createElementNS(NS, 'path');
  silhouette.setAttribute('class', 'ovs-i-smoke-silhouette');
  silhouette.setAttribute('opacity', '0');
  svgGroup.appendChild(silhouette);

  function riseK() {
    // scale rise so a parcel crosses the hood in ~2.8 s at base velocity
    const RISE_SECONDS = 2.8;
    return params.riseIn / (centerlineVelocity(params.riseIn / 2, params.w0) * RISE_SECONDS * 1000);
  }

  function spawn() {
    if (particles.length >= MAX_PARTICLES) return;
    const du = rand(), dv = rand();
    const depthOff = probit(du) * params.sigma; // inches, ~N(0, sigma) at hood
    const widthOff = probit(dv) * params.sigma;
    let node = pool.pop();
    if (!node) {
      node = document.createElementNS(NS, 'circle');
      node.setAttribute('class', 'ovs-i-smoke');
    }
    svgGroup.appendChild(node);
    const p = {
      z: rand() * 1.5,               // small stagger off the source
      driftIn: 0,
      depthOff, widthOff,
      r: 2.4 + rand() * 2.2,
      jitterPhase: rand() * Math.PI * 2,
      jitterAmp: 0.35 + rand() * 0.4,
      captured: particleCaptured({ depthOff, widthOff }, params),
      node,
    };
    particles.push(p);
  }

  function recycle(i) {
    const p = particles[i];
    if (p.node) { p.node.remove(); pool.push(p.node); }
    particles.splice(i, 1);
  }

  function draw(p, now) {
    const z = p.z;
    const grow = params.finalRadius > 0 ? plumeRadius(z) / params.finalRadius : 1;
    // physics baseline: deflected centerline + fanned Gaussian offset
    const baseX = sourceX + (deflection(z, params.plumeWind, { w0: params.w0 }) + p.depthOff * grow) * pxPerIn;
    // per-particle turbulence around the baseline, scaled by local radius
    const turb = Math.sin(now / 520 + p.jitterPhase + z * 0.12) * p.jitterAmp * plumeRadius(z) * pxPerIn * 0.06;
    const x = baseX + turb;
    const y = sourceY - z * pxPerIn;
    // opacity: fade in at birth, gentle falloff with rise. NOTE: this
    // multiplier keeps particles below the 3:1 non-text contrast guideline
    // by design — they are decorative redundancy (readouts + status-tinted
    // plume fill + wisps carry the same information at full contrast); see
    // the --smoke token comment in tokens.css for the a11y rationale.
    const frac = params.riseIn > 0 ? z / params.riseIn : 1;
    const fadeIn = Math.min(1, z / 3);
    const op = fadeIn * Math.max(0, 1 - frac * 0.85) * 0.5;
    p.node.setAttribute('cx', x.toFixed(1));
    p.node.setAttribute('cy', y.toFixed(1));
    p.node.setAttribute('r', p.r.toFixed(1));
    p.node.setAttribute('opacity', op.toFixed(3));
    p.node.classList.toggle('ovs-i-smoke--escape', !p.captured);
  }

  function clearParticles() {
    for (const p of particles) { if (p.node) { p.node.remove(); pool.push(p.node); } }
    particles.length = 0;
  }

  function renderSilhouette() {
    const step = 2;
    let dl = '', dr = '';
    const pts = [];
    for (let z = 0; z <= params.riseIn; z += step) pts.push(z);
    if (pts[pts.length - 1] !== params.riseIn) pts.push(params.riseIn);
    for (let i = 0; i < pts.length; i++) {
      const z = pts[i];
      const cx = sourceX + deflection(z, params.plumeWind, { w0: params.w0 }) * pxPerIn;
      const hw = plumeRadius(z) * pxPerIn;
      const y = sourceY - z * pxPerIn;
      dl += `${i === 0 ? 'M' : 'L'}${(cx - hw).toFixed(1)} ${y.toFixed(1)}`;
    }
    for (let i = pts.length - 1; i >= 0; i--) {
      const z = pts[i];
      const cx = sourceX + deflection(z, params.plumeWind, { w0: params.w0 }) * pxPerIn;
      const hw = plumeRadius(z) * pxPerIn;
      const y = sourceY - z * pxPerIn;
      dr += `L${(cx + hw).toFixed(1)} ${y.toFixed(1)}`;
    }
    silhouette.setAttribute('d', `${dl}${dr}Z`);
  }

  function update(state) {
    params = deriveParams(state);
    // refresh capture flag on live particles so tint stays truthful as the
    // aperture/geometry changes without waiting for them to recycle
    for (const p of particles) p.captured = particleCaptured({ depthOff: p.depthOff, widthOff: p.widthOff }, params);
    if (reduced) renderSilhouette();
  }

  function frame(now) {
    if (reduced || paused) return;
    const dt = lastNow ? Math.min(64, now - lastNow) : 16;
    lastNow = now;
    const k = riseK();
    // spawn at a steady rate up to the cap — dense enough to read as smoke
    // (~55 ms → ~55 live at a ~3 s lifetime), far under the 120 hard cap.
    spawnAccum += dt;
    const SPAWN_MS = 55;
    while (spawnAccum >= SPAWN_MS) { spawnAccum -= SPAWN_MS; spawn(); }
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      advect(p, dt, { plumeWind: params.plumeWind, w0: params.w0, k });
      if (p.z >= params.riseIn * 1.02) { recycle(i); continue; }
      draw(p, now);
    }
  }

  function setReduced(v) {
    reduced = !!v;
    if (reduced) {
      clearParticles();
      renderSilhouette();
      silhouette.setAttribute('opacity', '1');
    } else {
      silhouette.setAttribute('opacity', '0');
    }
  }

  function pause() { paused = true; lastNow = 0; }
  function resume() { paused = false; lastNow = 0; }

  function destroy() {
    clearParticles();
    pool.length = 0;
    if (silhouette.parentNode) silhouette.remove();
  }

  return { update, frame, setReduced, pause, resume, destroy, _particles: particles };
}
