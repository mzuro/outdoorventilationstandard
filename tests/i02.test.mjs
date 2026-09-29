import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gradeRatedCfm, coverageSentence, sourceFor, heightFor, mountFor, fmtSource, ABOVE_LADDER_READOUT, COVERAGE_NOTE } from '../static/js/ovs/instruments/i02.mjs';
import { requiredCfm, coverageAdvisory, BLOWER_MARGIN, BLOWER_SIZES } from '../static/js/ovs/physics/cfm.mjs';
import { SOURCES } from '../static/js/ovs/physics/heat.mjs';

// Bands are the RB-008 §3.3 worked case (Gas Grill Large, 30 in, wall,
// moderate): 892 minimum / 1,200 blower (rb-008:310). gradeRatedCfm does
// no physics of its own — it only compares a rated-CFM number against
// whatever requiredCfm() handed it — so the bands are taken from the
// module, not typed.
const bands = requiredCfm({ src: SOURCES.gasLarge, riseIn: 30, mount: 'wall', exposure: 'moderate', panels: 'none' });

test('sanity: the flagship bands are RB-008 §3.3 (892 / 1,200)', () => {
  assert.equal(bands.minimum, 892);                                           // rb-008:310
  assert.equal(bands.blower, 1200);                                           // rb-008:310, rb-008:870
});

test('gradeRatedCfm: well above the blower -> PASS', () => {
  assert.equal(gradeRatedCfm(1500, bands).grade, 'PASS');
});

test('gradeRatedCfm: exactly the blower -> PASS (boundary inclusive)', () => {
  assert.equal(gradeRatedCfm(1200, bands).grade, 'PASS');
});

test('gradeRatedCfm: just below the blower -> MARGINAL', () => {
  assert.equal(gradeRatedCfm(1199, bands).grade, 'MARGINAL');
});

test('gradeRatedCfm: mid-band -> MARGINAL', () => {
  assert.equal(gradeRatedCfm(1000, bands).grade, 'MARGINAL');
});

test('gradeRatedCfm: exactly the minimum -> MARGINAL (boundary inclusive)', () => {
  assert.equal(gradeRatedCfm(892, bands).grade, 'MARGINAL');
});

test('gradeRatedCfm: just below the minimum -> FAIL', () => {
  assert.equal(gradeRatedCfm(891, bands).grade, 'FAIL');
});

test('gradeRatedCfm: well below the minimum -> FAIL', () => {
  assert.equal(gradeRatedCfm(400, bands).grade, 'FAIL');
});

test('gradeRatedCfm: island bands (1,070 / 1,200, RB-008 §3.9) grade on the island minimum', () => {
  const island = requiredCfm({ src: SOURCES.gasLarge, riseIn: 30, mount: 'island', exposure: 'moderate', panels: 'none' });
  assert.equal(island.minimum, 1070);                                         // rb-008:567
  assert.equal(island.blower, 1200);
  assert.equal(gradeRatedCfm(1000, island).grade, 'FAIL');                    // under the island minimum
  assert.equal(gradeRatedCfm(1070, island).grade, 'MARGINAL');
  assert.equal(gradeRatedCfm(1200, island).grade, 'PASS');
});

test('gradeRatedCfm: above the blower ladder (blower null) PASS is the paper\'s own 1.1× rule (rb-008:870)', () => {
  const extreme = requiredCfm({ src: SOURCES.gasHigh, riseIn: 48, mount: 'island', exposure: 'exposed', panels: 'none' });
  assert.equal(extreme.blower, null, 'precondition: 1.1 × minimum exceeds the 3,000 CFM ladder top');
  assert.equal(gradeRatedCfm(extreme.minimum * BLOWER_MARGIN, extreme).grade, 'PASS');
  assert.equal(gradeRatedCfm(extreme.minimum * BLOWER_MARGIN - 1, extreme).grade, 'MARGINAL');
  assert.equal(gradeRatedCfm(extreme.minimum - 1, extreme).grade, 'FAIL');
});

// --- control-value resolvers (the same helpers update() and buildSpecLine() share) ---

test('sourceFor resolves RB-001 ids and defaults to Gas Large (the RB-008 flagship)', () => {
  assert.equal(sourceFor('gasMedium'), SOURCES.gasMedium);
  assert.equal(sourceFor('charcoalKettle'), SOURCES.charcoalKettle);
  assert.equal(sourceFor(undefined), SOURCES.gasLarge);
  assert.equal(sourceFor('gasHuge'), SOURCES.gasLarge);
});

test('heightFor accepts the paper grid as numbers or radio strings; anything else -> 30', () => {
  assert.equal(heightFor(18), 18);
  assert.equal(heightFor('36'), 36);                                          // segmented radios commit strings
  assert.equal(heightFor(42), 30);                                            // not an RB-008 table column (rb-008:198)
  assert.equal(heightFor(undefined), 30);
});

test('mountFor accepts the three RB-008 §3.9 mounts and defaults to island', () => {
  for (const m of ['wall', 'peninsula', 'island']) assert.equal(mountFor(m), m);   // rb-008:560-562
  assert.equal(mountFor('ceiling'), 'island');
});

test('fmtSource: "60k gas", "15k charcoal", "40k wood-fired", "30k pellet"', () => {
  assert.equal(fmtSource(SOURCES.gasLarge), '60k gas');                       // rb-001:243
  assert.equal(fmtSource(SOURCES.charcoalKettle), '15k charcoal');            // rb-001:245
  assert.equal(fmtSource(SOURCES.woodFired), '40k wood-fired');               // rb-001:246
  assert.equal(fmtSource(SOURCES.pelletHigh), '30k pellet');                  // rb-001:249
});

// --- COVERAGE CHECK sentence: formats coverageAdvisory(), never recomputes it ---

test('coverageSentence: 48 in vs Gas Large @30 in is 77% of 62 in -> overflow band (RB-008 Table 3.10)', () => {
  const s = coverageSentence(coverageAdvisory(48, 30, SOURCES.gasLarge));
  assert.equal(s, '48 in is 77% of the 62 in RB-002 width — plume overflows the hood (65–75% capture at best): upgrade width rather than CFM.'); // rb-002:644, rb-008:584
});

test('coverageSentence walks the four Table 3.10 bands for Gas Medium @30 in (57 in recommended)', () => {
  assert.match(coverageSentence(coverageAdvisory(48, 30, SOURCES.gasMedium)), /^48 in is 84% of the 57 in .* marginal coverage \(80–85% capture at best\)/); // rb-008:585
  assert.match(coverageSentence(coverageAdvisory(54, 30, SOURCES.gasMedium)), /^54 in is 95% of the 57 in .* near-adequate coverage \(90–93% capture\)/);      // rb-008:586
  assert.match(coverageSentence(coverageAdvisory(60, 30, SOURCES.gasMedium)), /^60 in is 105% of the 57 in .* full coverage \(95%\+ capture\)/);              // rb-008:587-589
  assert.match(coverageSentence(coverageAdvisory(42, 30, SOURCES.gasMedium)), /^42 in is 74% of the 57 in .* overflows/);                                      // rb-008:584
});

// --- Stage-B review: user-visible strings the instrument pins ---

test('ABOVE_LADDER_READOUT is the ladder top ("> 3,000 CFM"), derived from cfm.mjs BLOWER_SIZES, never a minimum', () => {
  assert.equal(ABOVE_LADDER_READOUT, '> 3,000 CFM');
  assert.equal(ABOVE_LADDER_READOUT, `> ${BLOWER_SIZES[BLOWER_SIZES.length - 1].toLocaleString('en-US')} CFM`); // rb-008:614 ladder, site-extended (cfm.mjs)
  const extreme = requiredCfm({ src: SOURCES.gasHigh, riseIn: 48, mount: 'island', exposure: 'exposed', panels: 'none' });
  assert.equal(extreme.blower, null);
  assert.ok(!ABOVE_LADDER_READOUT.includes(extreme.minimum.toLocaleString('en-US')));
});

test('COVERAGE_NOTE cites §3.4.3 for CFM-from-source-and-height and Table 3.10 for "narrower needs more" (never §3.4.3 for width)', () => {
  assert.equal(
    COVERAGE_NOTE,
    'CFM is set by the source and mounting height (RB-008 §3.4.3); width is checked separately as coverage — RB-008 Table 3.10 rates a narrower hood as needing more, not less. Compare the hood with the RB-002 recommended width here.',
  ); // rb-008:381-395 (§3.4.3), rb-008:580-591 (Table 3.10: 900 CFM @ 42 in vs 609 @ 57 in)
  assert.doesNotMatch(COVERAGE_NOTE, /§3\.4\.3\): a narrower/);
  // The Table 3.10 claim the note makes, checked against the module's bands:
  // a narrower hood lands in a worse band, never a better one.
  assert.equal(coverageAdvisory(42, 30, SOURCES.gasMedium).band, 'overflow');   // rb-008:584 (900 CFM)
  assert.equal(coverageAdvisory(57, 30, SOURCES.gasMedium).band, 'full');       // rb-008:587 (609 CFM)
});
