// smoke.mjs — living-smoke VISUALIZATION for OVS instruments (v2.1 F1,
// re-based on the RB papers in physics Stage A).
//
// The smoke is NOT a second physics model. Every particle rides the SAME
// trajectory the capture model uses: horizontal drift per unit rise is the
// analytic slope of the RB-006 §3.1 deflection curve (wind.mjs
// deflectionRate), buoyant rise slows with the Heskestad centerline-velocity
// decay (plume.mjs centerlineVelocity), lateral spread grows with the RB-002
// capture diameter (plume.mjs captureDiameter), and whether a particle is
// tinted ember-orange (escaping) is decided by the SAME aperture partition
// captureFraction uses (capture.mjs apertureAlongWind, σ = 1.5·b_T) — so the
// ensemble escape fraction agrees with the capture readout by construction
// (tests/smoke.test.mjs asserts ±0.15).
//
// This module must import cleanly under plain node (no document/window): the
// pure exports below carry all the physics and are unit-tested headless; the
// createSmokeField factory is a harmless no-op when there is no SVG group.
//
// STAGE-A note: instruments still pass a legacy `w0` state key (i01/i03/i05/
// i07/i08/i09) and `panels: 'one'`; both are ignored here (w0 had no paper
// basis; 'one' has no paper row, rb-009:369). Remove in Stage B.

import { SOURCES } from './physics/heat.mjs';
import { captureDiameter, centerlineVelocity, plumeHalfWidthBT } from './physics/plume.mjs';
import { deflection, deflectionRate } from './physics/wind.mjs';
import { effectiveWind } from './physics/sidepanels.mjs';
import { SIGMA_PER_BT, apertureAlongWind } from './physics/capture.mjs';

/** Hard live-particle cap (Global Constraint: ≤120 live particles). */
export const MAX_PARTICLES = 120;

/**
 * Inverse standard-normal CDF (probit). Acklam's rational approximation;
 * |abs error| < 1.15e-9. Pure. Used to place a particle's along-wind
 * offset on the same Gaussian the capture integral assumes, from a uniform
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

const panelsOpt = (panels) => (panels === 'both' || panels === 'three' ? panels : 'none');

/**
 * The wind the plume actually feels — the sheltered wind of sidepanels.mjs
 * (panels, rear wall) — identical to what captureFraction deflects with.
 * The RB-006 coupling C_D lives inside deflection()/deflectionRate(); it is
 * NOT pre-multiplied here. Pure.
 */
export function plumeWindOf(windMph, panels = 'none', { dir = 'side', mount = 'island' } = {}) {
  return effectiveWind(Math.max(0, windMph || 0), { panels: panelsOpt(panels), dir, mount });
}

/**
 * Horizontal drift per inch of rise at height z: the analytic dδ/dz of the
 * RB-006 §3.1 closed form, so a particle stepped by (driftRate·dz) traces
 * the deflected centerline exactly. Sign follows the wind. Pure.
 */
export function driftRate(zIn, plumeWind, src = SOURCES.gasMedium) {
  return deflectionRate(zIn, plumeWind, src);
}

/**
 * Buoyant vertical speed at height z, in inches per ms, scaled so a parcel
 * takes ~riseSeconds to climb from the source to the hood. Because it tracks
 * the Heskestad centerline velocity, the rise visibly SLOWS as the plume
 * decays — the physical signature, not decoration. Pure.
 */
export function riseSpeedInPerMs(zIn, src = SOURCES.gasMedium, k = 1) {
  return centerlineVelocity(zIn, src) * k;
}

/**
 * Advect a particle by dtMs. Rises per centerline velocity, drifts downwind
 * per the deflection slope, so its path is the same trajectory the capture
 * model bends. Mutates and returns the particle. Pure (no DOM).
 */
export function advect(p, dtMs, { plumeWind, src = SOURCES.gasMedium, k }) {
  const dz = riseSpeedInPerMs(p.z, src, k) * dtMs;
  const dx = driftRate(p.z, plumeWind, src) * dz; // dx = (dx/dz)·dz
  p.z += dz;
  p.driftIn += dx;
  return p;
}

/**
 * Is a parcel with along-wind Gaussian offset (inches, ~N(0, σ)) CAPTURED
 * by the aperture? This is the per-particle form of the partition
 * captureFraction() integrates: (xc + windOff) ∈ [−ohUp, +ohDown] about the
 * undeflected centreline (RB-006 §3.4); a wall-mount under rear wind has
 * ohUp = ∞ (the wall reflects the upwind tail). Pure. Escape (ember tint)
 * is the negation.
 */
export function particleCaptured({ windOff }, { xc, ohUp, ohDown }) {
  const x = xc + windOff;
  return x >= -ohUp && x <= ohDown;
}

/** Physics parameters the field derives once per update. Pure. */
export function deriveParams({ widthIn, depthIn, mount = 'island', riseIn = 30, windMph = 0, panels = 'none', windDir = 'side', src = SOURCES.gasMedium }) {
  const rise = Math.max(0, riseIn || 0);
  const plumeWind = plumeWindOf(windMph, panels, { dir: windDir, mount });
  const sigma = SIGMA_PER_BT * plumeHalfWidthBT(rise, src);   // capture.mjs σ
  const xc = deflection(rise, plumeWind, src);                 // capture.mjs centre shift
  const { ohUp, ohDown } = apertureAlongWind({ widthIn, depthIn, mount, windDir, src });
  const finalRadius = captureDiameter(rise, src) / 2;          // RB-002 d_capture / 2 (envelope)
  return { widthIn, depthIn, mount, riseIn: rise, windMph, panels, windDir, src, plumeWind, sigma, xc, ohUp, ohDown, finalRadius };
}

/**
 * Deterministic (low-variance) estimate of the escaping smoke fraction from
 * the per-particle partition above, over n stratified Gaussian quantiles
 * along the wind axis. Independently derived from particleCaptured — NOT a
 * call to captureFraction — so tests can assert the two AGREE. Pure.
 */
export function escapeFraction(state, n = 256) {
  const p = deriveParams(state);
  let captured = 0;
  for (let i = 0; i < n; i++) {
    const windOff = probit((i + 0.5) / n) * p.sigma;
    if (particleCaptured({ windOff }, p)) captured++;
  }
  return 1 - captured / n;
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
 *   .update(state)   — state = { widthIn, depthIn, mount, riseIn, windMph, panels, windDir?, src? }
 *   .frame(nowMs)    — one animation step (driven by the engine's single rAF)
 *   .setReduced(bool).pause().resume().destroy()
 * No-op object when there is no DOM / no group (headless test import).
 *
 * Contract note (F1 review): geom deliberately carries NO hoodPlaneY. The
 * capture/recycle plane is authoritative in PHYSICS space — a particle
 * retires at z ≥ riseIn (state.riseIn, inches), and every pixel position is
 * sourceY − z·pxPerIn. A separate pixel-space hood plane would be a second
 * source of truth that could silently disagree with riseIn, so instruments
 * must not wire one up: pass source + scale and let riseIn define the plane.
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

  // static reduced-motion silhouette (one filled path from the capture-
  // diameter envelope, deflected centerline). Hidden until setReduced(true).
  const silhouette = document.createElementNS(NS, 'path');
  silhouette.setAttribute('class', 'ovs-i-smoke-silhouette');
  silhouette.setAttribute('opacity', '0');
  svgGroup.appendChild(silhouette);

  const halfWidthAt = (z) => captureDiameter(z, params.src) / 2;
  const sigmaAt = (z) => SIGMA_PER_BT * plumeHalfWidthBT(z, params.src);

  function riseK() {
    // scale rise so a parcel crosses the hood in ~2.8 s at base velocity
    const RISE_SECONDS = 2.8;
    if (!(params.riseIn > 0)) return 0;
    return params.riseIn / (centerlineVelocity(params.riseIn / 2, params.src) * RISE_SECONDS * 1000);
  }

  function spawn() {
    if (particles.length >= MAX_PARTICLES) return;
    const windOff = probit(rand()) * params.sigma; // inches, ~N(0, σ) at hood
    let node = pool.pop();
    if (!node) {
      node = document.createElementNS(NS, 'circle');
      node.setAttribute('class', 'ovs-i-smoke');
    }
    svgGroup.appendChild(node);
    const p = {
      z: rand() * 1.5,               // small stagger off the source
      driftIn: 0,
      windOff,
      r: 2.4 + rand() * 2.2,
      jitterPhase: rand() * Math.PI * 2,
      jitterAmp: 0.35 + rand() * 0.4,
      captured: particleCaptured({ windOff }, params),
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
    const grow = params.sigma > 0 ? sigmaAt(z) / params.sigma : 1;
    // physics baseline: deflected centerline + fanned Gaussian offset
    const baseX = sourceX + (deflection(z, params.plumeWind, params.src) + p.windOff * grow) * pxPerIn;
    // per-particle turbulence around the baseline, scaled by local radius
    const turb = Math.sin(now / 520 + p.jitterPhase + z * 0.12) * p.jitterAmp * halfWidthAt(z) * pxPerIn * 0.06;
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
      const cx = sourceX + deflection(z, params.plumeWind, params.src) * pxPerIn;
      const hw = halfWidthAt(z) * pxPerIn;
      const y = sourceY - z * pxPerIn;
      dl += `${i === 0 ? 'M' : 'L'}${(cx - hw).toFixed(1)} ${y.toFixed(1)}`;
    }
    for (let i = pts.length - 1; i >= 0; i--) {
      const z = pts[i];
      const cx = sourceX + deflection(z, params.plumeWind, params.src) * pxPerIn;
      const hw = halfWidthAt(z) * pxPerIn;
      const y = sourceY - z * pxPerIn;
      dr += `L${(cx + hw).toFixed(1)} ${y.toFixed(1)}`;
    }
    silhouette.setAttribute('d', `${dl}${dr}Z`);
  }

  function update(state) {
    params = deriveParams(state);
    // refresh capture flag on live particles so tint stays truthful as the
    // aperture/geometry changes without waiting for them to recycle
    for (const p of particles) p.captured = particleCaptured({ windOff: p.windOff }, params);
    if (reduced) renderSilhouette();
  }

  function frame(now) {
    if (reduced || paused) return;
    const dt = lastNow ? Math.min(64, now - lastNow) : 16;
    lastNow = now;
    const k = riseK();
    if (!(params.riseIn > 0)) { clearParticles(); return; } // i08 indoor collapse: nothing to draw
    // spawn at a steady rate up to the cap — dense enough to read as smoke
    // (~55 ms → ~55 live at a ~3 s lifetime), far under the 120 hard cap.
    spawnAccum += dt;
    const SPAWN_MS = 55;
    while (spawnAccum >= SPAWN_MS) { spawnAccum -= SPAWN_MS; spawn(); }
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      advect(p, dt, { plumeWind: params.plumeWind, src: params.src, k });
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
