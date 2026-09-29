// i02.dom.test.mjs — DOM-level test of i02.mount() (Stage-B review LOW 5).
//
// No jsdom in this repo; puppeteer (a declared dependency) drives the REAL
// static/js/ovs/instruments/i02.mjs + viz.mjs modules, served straight from
// static/ by a throwaway node http server (no hugo build) into headless
// Chrome at a 375px phone viewport so the <=760px sticky strip is live.
// Also mounts explain-ui.mjs against a stubbed /api/explain that returns a
// sheet computed by src/lib/explain-state.mjs, so the state-readout rows
// are checked in the DOM too. Skips (loudly) only if puppeteer is missing.
//
// Every pinned number: rb-008:310 (892 / 1,200 flagship), rb-002:644 +
// rb-008:584 (48 in = 77 % of 62 in, overflow band), rb-008:144-145
// (panels only in the exposed class), rb-008:614/870 + cfm.mjs ladder
// (above 3,000 CFM). Non-paper numbers are compared against the module.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { requiredCfm } from '../static/js/ovs/physics/cfm.mjs';
import { SOURCES } from '../static/js/ovs/physics/heat.mjs';
import { computeState } from '../src/lib/explain-state.mjs';
import { templateNarration } from '../src/lib/narration.mjs';

const STATIC = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'static');
const ABOVE = { 'i02-source': 'gasHigh', 'i02-height': 48, 'i02-mount': 'island', 'i02-exposure': 'exposed', 'i02-panels': 'none' };
const aboveBands = requiredCfm({ src: SOURCES.gasHigh, riseIn: 48, mount: 'island', exposure: 'exposed', panels: 'none' });
const aboveSheet = computeState('i02', { source: 'gasHigh', height: 48, mount: 'island', exposure: 'exposed', panels: 'none', width: 72 });

const PAGE = `<!doctype html><html><head><meta charset="utf-8"><title>i02 mount</title></head><body>
<div style="height:1200px"></div>
<figure data-instrument="i02" data-preset="wall-48"><noscript>needs JS</noscript><figcaption>cap</figcaption></figure>
<div data-explain-for="i02"><button class="ovs-explain-btn" type="button">Explain</button><input class="ovs-explain-honey" value=""><div class="ovs-explain-turnstile"></div><div class="ovs-explain-result" hidden></div></div>
<script type="module">
  import { mount } from '/js/ovs/instruments/i02.mjs';
  import { wireExplain } from '/js/ovs/explain-ui.mjs';
  mount(document.querySelector('figure[data-instrument="i02"]'));
  wireExplain('i02');
  window.__mounted = true;
</script></body></html>`;

const MIME = { '.mjs': 'text/javascript', '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html' };
function serve() {
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://x');
    if (url.pathname === '/') { res.writeHead(200, { 'Content-Type': 'text/html' }); return res.end(PAGE); }
    try {
      const body = await readFile(path.join(STATIC, url.pathname));
      res.writeHead(200, { 'Content-Type': MIME[path.extname(url.pathname)] || 'application/octet-stream' });
      res.end(body);
    } catch { res.writeHead(404); res.end(); }
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve({ server, base: `http://127.0.0.1:${server.address().port}` })));
}

let puppeteer = null;
try { puppeteer = (await import('puppeteer')).default; } catch { /* reported below */ }

test('i02.mount(): panels control, coverage sentence, above-ladder readout + strip, explain state sheet (headless Chrome)', { skip: puppeteer ? false : 'puppeteer not installed (npm ci) — DOM-level i02 test not run' }, async () => {
  const { server, base } = await serve();
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 375, height: 700, deviceScaleFactor: 1 });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e.message)));
    await page.setRequestInterception(true);
    page.on('request', (req) => (req.url().startsWith(base) ? req.continue() : req.abort())); // offline: no Turnstile script
    // Stub /api/explain in-page: the sheet is computed by the real
    // explain-state.mjs here in node and handed to the client untouched.
    await page.evaluateOnNewDocument((sheet, explanation) => {
      window.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({ explanation, citations: [], state: sheet }) });
    }, aboveSheet, templateNarration(aboveSheet));
    await page.goto(base + '/', { waitUntil: 'networkidle0' });
    await page.waitForFunction(() => window.__mounted === true && !!document.querySelector('figure[data-instrument="i02"]').ovsInstrument);

    const fig = 'figure[data-instrument="i02"]';
    const readouts = () => page.$$eval(`${fig} output.ovs-i-readout-value`, (els) => Object.fromEntries(els.map((o) => [o.getAttribute('aria-labelledby').replace(/-label$/, ''), o.textContent.trim()])));
    const stripCells = () => page.$$eval('.ovs-i-strip .ovs-i-strip-cell', (cells) => Object.fromEntries(cells.map((c) => [c.querySelector('.ovs-i-strip-label').textContent.trim(), c.querySelector('.ovs-i-strip-value').textContent.trim()])));
    const panelsDisabled = () => page.$$eval(`${fig} input[name="i02-panels"]`, (els) => els.map((e) => e.disabled));
    const panelsCtl = () => page.$eval(`${fig} input[name="i02-panels"]`, (el) => { const c = el.closest('.ovs-i-control'); return { cls: c.classList.contains('ovs-i-control--disabled'), aria: c.getAttribute('aria-disabled') }; });

    // 1. Preset wall-48 seeds the flagship: 892 / 1,200 (rb-008:310); K_CFM shows two decimals.
    const r0 = await readouts();
    assert.equal(r0.minimum, '892 CFM');
    assert.equal(r0.blower, '1,200 CFM');
    assert.equal(r0.kCfm, '3.68×');                                            // rb-008:143
    // 2. Panels control disabled outside the exposed class (rb-008:144-145).
    assert.deepEqual(await panelsDisabled(), [true, true]);
    assert.deepEqual(await panelsCtl(), { cls: true, aria: 'true' });
    // 3. Coverage sentence is filled post-mount (the regroup created the <p> after the first update()).
    const cov0 = await page.$eval(`${fig} .ovs-i-coverage-readout`, (el) => el.textContent.trim());
    assert.equal(cov0, '48 in is 77% of the 62 in RB-002 width — plume overflows the hood (65–75% capture at best): upgrade width rather than CFM.'); // rb-002:644, rb-008:584
    const note = await page.$eval(`${fig} .ovs-i-coverage-note`, (el) => el.textContent.trim());
    assert.match(note, /RB-008 §3\.4\.3\); width is checked separately as coverage — RB-008 Table 3\.10 rates a narrower hood as needing more, not less/);
    // 4. Switch to exposed: panels enable; both radios live.
    await page.click(`${fig} input[name="i02-exposure"][value="exposed"]`);
    await page.waitForFunction((sel) => document.querySelector(`${sel} input[name="i02-panels"]`).disabled === false, {}, fig);
    assert.deepEqual(await panelsDisabled(), [false, false]);
    assert.deepEqual(await panelsCtl(), { cls: false, aria: 'false' });
    await page.click(`${fig} input[name="i02-panels"][value="both"]`);
    await page.waitForFunction((sel) => document.querySelector(`${sel} output[aria-labelledby="kCfm-label"]`).textContent === '4.14×', {}, fig);
    assert.equal((await readouts()).minimum, `${requiredCfm({ src: SOURCES.gasLarge, riseIn: 30, mount: 'wall', exposure: 'exposed', panels: 'both' }).minimum.toLocaleString('en-US')} CFM`); // 1,004 (rb-008:144)

    // 5. Above the ladder: readout AND sticky strip say "> 3,000 CFM", never "0 CFM" or the minimum.
    await page.evaluate((sel, st) => { const f = document.querySelector(sel); for (const [k, v] of Object.entries(st)) f.ovsInstrument.set(k, v); }, fig, ABOVE);
    await page.waitForFunction((sel) => document.querySelector(`${sel} output[aria-labelledby="blower-label"]`).textContent.startsWith('>'), {}, fig);
    const r1 = await readouts();
    assert.equal(aboveBands.blower, null, 'precondition');
    assert.equal(r1.minimum, `${aboveBands.minimum.toLocaleString('en-US')} CFM`); // 3,732 (module)
    assert.equal(r1.blower, '> 3,000 CFM');                                    // rb-008:614 ladder, site-extended (cfm.mjs)
    assert.equal(r1.kCfm, '5.75×');                                            // rb-008:145
    await page.evaluate((sel) => document.querySelector(`${sel} .ovs-i-readouts`).scrollIntoView(), fig);
    await page.waitForFunction(() => { const s = document.querySelector('.ovs-i-strip'); return s && !s.hidden; });
    const cells = await stripCells();
    assert.equal(cells.MIN, r1.minimum);
    assert.equal(cells.BLW, '> 3,000 CFM');
    assert.notEqual(cells.BLW, '0 CFM');
    assert.ok(!cells.BLW.includes(aboveBands.minimum.toLocaleString('en-US')), 'strip must not relabel the minimum as the blower');
    // The chart's blower row says why (no bar), the minimum bar is drawn.
    const svgTexts = await page.$$eval(`${fig} svg text`, (ts) => ts.map((t) => t.textContent.trim()));
    assert.ok(svgTexts.some((t) => t === `no standard size ≥ 1.1 × ${aboveBands.minimum.toLocaleString('en-US')} CFM`), svgTexts.join(' | ')); // rb-008:870

    // 5b. Verdict above the ladder: PASS is the paper's 1.1 × rule, and the stamp says so instead of naming a blower that does not exist.
    await page.evaluate((sel) => document.querySelector(sel).ovsInstrument.set('i02-rated', 4200), fig);
    await page.waitForFunction((sel) => { const s = document.querySelector(`${sel} .ovs-i-stamp`); return s && !s.hidden && s.dataset.grade === 'PASS'; }, {}, fig);
    const stampText = await page.$eval(`${fig} .ovs-i-stamp`, (el) => el.textContent);
    assert.match(stampText, /4,200 CFM meets 1\.1 × the 3,732 CFM RB-008 minimum; no standard blower size covers this configuration\./); // rb-008:870
    assert.doesNotMatch(stampText, /meets the RB-008 blower/);
    assert.match(stampText, /OVS model criterion/);

    // 6. Explain block: the server sheet renders BLOWER "> 3,000 CFM" and the narration says the requirement exceeds the ladder.
    await page.click('[data-explain-for="i02"] .ovs-explain-btn');
    await page.waitForFunction(() => document.querySelector('.ovs-explain-state') !== null);
    const explainRows = await page.$$eval('.ovs-explain-state .ovs-i-readout', (rows) => Object.fromEntries(rows.map((r) => [r.querySelector('.ovs-i-readout-label').textContent, r.querySelector('.ovs-i-readout-value').textContent])));
    assert.equal(explainRows.MINIMUM, '3,732 CFM');
    assert.equal(explainRows.BLOWER, '> 3,000 CFM');
    assert.equal(explainRows.K_CFM, '5.75× · exposed');
    const explainText = await page.$eval('.ovs-explain-text', (el) => el.textContent);
    assert.match(explainText, /no standard blower size in the RB-008 ladder meets 1\.1 × 3,732 = 4,105 CFM/); // rb-008:870
    assert.doesNotMatch(explainText, /specify a/);

    assert.deepEqual(errors, [], 'no page errors');
  } finally {
    await browser.close();
    server.close();
  }
});
