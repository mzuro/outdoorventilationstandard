#!/usr/bin/env node
// measure-instrument-reserves.mjs — calibrate + verify the pre-mount CLS
// reserve (`--i-reserve`, assets/ovs/css/components.css) of every
// instrument figure on every page that hosts one.
//
// Builds nothing itself: point it at a finished hugo build (--public) and
// it serves that directory on --port, then drives headless Chromium
// (puppeteer, a declared dependency) through every host page at every
// width in --widths, measuring
//
//   pre-mount  — page loaded with /js/ovs/instruments/*.mjs blocked, so the
//                figure holds only its reserve: figure height == computed
//                min-height (== --i-reserve for that instrument/page/width)
//   mounted    — normal load, wait for `.ovs-i .ovs-i-instrument` + 1.1 s
//                (prefers-reduced-motion: reduce, fonts ready)
//
// and reports delta = mounted - reserve per page per width (+ = downward
// settle / reserve too short, - = upward snap / reserve too tall).
//
// Host pages are derived from content front matter: every non-draft
// content/**/*.md with `instrument_id` (tools + questions), plus `/` (the
// homepage hero, i01). The instrument id is confirmed against the built
// HTML (`data-instrument`), so a page the build dropped is skipped loudly.
//
// Modes
//   (default)      measure at --widths, write JSON (--out), print the delta table
//   --check        as above, exit 1 if any delta > --max-down (40) or
//                  delta < -(--max-up) (20; the design margin is 15, see
//                  --emit-css) anywhere, or a figure failed to mount/release
//   --scan         mounted-only sweep at every --scan-step px from --scan-from
//                  to --scan-to by RESIZING one loaded page per host page
//                  (instrument layout is pure CSS reflow — no ResizeObserver
//                  in viz.mjs or any instrument — so a resize equals a fresh
//                  load; `--verify-scan` proves it against fresh loads)
//   --emit-css     from a --scan JSON: print the band rules. Bands are cut
//                  where the measured height moves (greedy: extend a band
//                  while its max-min <= --band-budget, 30 px), so edges land
//                  on the measured wrap steps rather than on their tall side;
//                  each band's reserve is (max mounted height in band - 15),
//                  floored to 5 px. Per instrument AND per page: the default
//                  is cut on the instrument's own /tools/ page; every other
//                  host page (home hero, grease page, question pages) gets
//                  page-scoped override bands, keyed by the figure's
//                  data-page attribute (set by partials/instrument-figure.html
//                  from the page path), over exactly the widths where the
//                  default would settle beyond tolerance on that page.
//
// Usage
//   node scripts/measure-instrument-reserves.mjs --public <dir> [--port <n>]   (default: a free port)
//        [--widths 320,375,...] [--pages /,/tools/cfm-calculator/]
//        [--out <json>] [--concurrency 6] [--check]
//   node scripts/measure-instrument-reserves.mjs --public <dir> --scan [--scan-step 1] --out scan.json
//   node scripts/measure-instrument-reserves.mjs --emit-css --from scan.json [--commit <sha>]
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// ---------------------------------------------------------------- args
const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf('--' + name);
  if (i === -1) return def;
  const v = args[i + 1];
  return v === undefined || v.startsWith('--') ? true : v;
};
const flag = (name) => args.includes('--' + name);

export const DEFAULT_WIDTHS = [320, 340, 360, 375, 390, 391, 405, 406, 430, 431, 480, 640, 641, 700, 760, 761, 768, 900, 980, 1100, 1101, 1280, 1440];
export const MARGIN = 15;       // reserve = band max - MARGIN
export const MAX_DOWN = 40;     // --check: largest tolerated downward settle
export const MAX_UP = 20;       // --check: largest tolerated upward snap
export const BAND_BUDGET = 30;  // --emit-css: max (max - min) inside one band

// ---------------------------------------------------------------- host pages
export function hostPages(contentDir, publicDir) {
  const out = [];
  const walk = (dir) => {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) walk(p);
      else if (ent.name.endsWith('.md')) {
        const src = fs.readFileSync(p, 'utf8');
        const fm = src.split(/^---\s*$/m)[1] || '';
        const id = (fm.match(/^instrument_id:\s*["']?(i\d\d)["']?/m) || [])[1];
        if (!id) continue;
        if (/^draft:\s*true/m.test(fm)) continue;
        const rel = path.relative(contentDir, p).replace(/\.md$/, '');
        out.push({ path: '/' + rel + '/', iid: id });
      }
    }
  };
  walk(contentDir);
  out.push({ path: '/', iid: 'i01' });
  out.sort((a, b) => (a.iid + a.path).localeCompare(b.iid + b.path));
  const pages = [];
  for (const pg of out) {
    const html = path.join(publicDir, pg.path, 'index.html');
    if (!fs.existsSync(html)) { console.error(`skip ${pg.path}: not in the build (${html})`); continue; }
    const m = fs.readFileSync(html, 'utf8').match(/data-instrument=["']?(i\d\d)/);
    if (!m) { console.error(`skip ${pg.path}: no instrument figure in the built HTML`); continue; }
    if (m[1] !== pg.iid) console.error(`note ${pg.path}: front matter says ${pg.iid}, build renders ${m[1]}`);
    pages.push({ path: pg.path, iid: m[1], pageKey: pageKeyOf(pg.path) });
  }
  return pages;
}
// Mirrors the data-page attribute partials/instrument-figure.html derives
// from the page's RelPermalink: "/" -> "home", "/tools/x/" -> "tools/x".
export function pageKeyOf(p) {
  const t = p.replace(/^\/+|\/+$/g, '');
  return t === '' ? 'home' : t;
}

// ---------------------------------------------------------------- server
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.woff': 'font/woff', '.xml': 'application/xml', '.txt': 'text/plain', '.pdf': 'application/pdf', '.ico': 'image/x-icon' };
export function serve(publicDir, port) {
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file = path.join(publicDir, p);
    if (!file.startsWith(publicDir)) { res.writeHead(403); return res.end(); }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
    fs.createReadStream(file).pipe(res);
  });
  // port 0 (the default) lets the OS pick a free port; the bound port is read back from the socket.
  return new Promise((resolve) => server.listen(port, '127.0.0.1', () => resolve({ server, base: `http://127.0.0.1:${server.address().port}` })));
}

// ---------------------------------------------------------------- browser
const FIGURE_PROBE = `(() => {
  const fig = document.querySelector('figure.ovs-instrument');
  if (!fig) return null;
  const cs = getComputedStyle(fig);
  const r = fig.getBoundingClientRect();
  const outs = [...fig.querySelectorAll('output.ovs-i-readout-value')].map((o) => o.textContent.trim());
  return {
    h: Math.round(r.height * 10) / 10,
    minH: cs.minHeight,
    reserveVar: cs.getPropertyValue('--i-reserve').trim(),
    hasOvsI: fig.classList.contains('ovs-i'),
    mounted: !!fig.querySelector('.ovs-i-instrument'),
    id: fig.dataset.instrument,
    pageKey: fig.dataset.page || null,
    readouts: outs.length,
    numericReadouts: outs.filter((t) => /\\d/.test(t)).length,
    hscroll: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  };
})()`;

async function openPage(browser, base, width, { blockInstruments = false, errors = null } = {}) {
  const page = await browser.newPage();
  await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const u = req.url();
    if (!u.startsWith(base)) return req.abort();
    if (blockInstruments && /\/js\/ovs\/instruments\//.test(u)) return req.abort();
    return req.continue();
  });
  if (errors) {
    page.on('console', (m) => {
      if (m.type() !== 'error') return;
      const loc = m.location() || {};
      const txt = m.text();
      if (!(loc.url || '').startsWith(base) && /Failed to load resource|net::ERR_FAILED/.test(txt)) return; // aborted third party
      if (blockInstruments && /instruments\//.test(loc.url || '')) return; // the deliberate block
      errors.push({ width, text: txt.slice(0, 200), url: loc.url });
    });
    page.on('pageerror', (e) => errors.push({ width, text: 'pageerror: ' + String(e).slice(0, 200) }));
  }
  return page;
}

async function measurePre(browser, base, pg, width, errors) {
  const page = await openPage(browser, base, width, { blockInstruments: true, errors });
  try {
    await page.goto(base + pg.path, { waitUntil: 'networkidle0', timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);
    return await page.evaluate(FIGURE_PROBE);
  } finally { await page.close(); }
}

async function loadMounted(browser, base, pg, width, errors) {
  const page = await openPage(browser, base, width, { errors });
  await page.goto(base + pg.path, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.waitForSelector('figure.ovs-instrument.ovs-i .ovs-i-instrument', { timeout: 20000 }).catch(() => {});
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 1100));
  return page;
}

async function measureMounted(browser, base, pg, width, errors) {
  const page = await loadMounted(browser, base, pg, width, errors);
  try { return await page.evaluate(FIGURE_PROBE); } finally { await page.close(); }
}

async function pool(items, n, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) { const k = i++; out[k] = await fn(items[k], k); }
  }));
  return out;
}

// ---------------------------------------------------------------- measure mode
export async function measure({ publicDir, port, widths, pages, concurrency = 6, log = console.log }) {
  const puppeteer = (await import('puppeteer')).default;
  const { server, base } = await serve(publicDir, port);
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'], protocolTimeout: 180000 });
  const errors = [];
  const rows = [];
  try {
    const tasks = [];
    for (const pg of pages) for (const w of widths) tasks.push({ pg, w });
    await pool(tasks, concurrency, async ({ pg, w }) => {
      const pre = await measurePre(browser, base, pg, w, errors);
      const post = await measureMounted(browser, base, pg, w, errors);
      if (!pre || !post) { rows.push({ path: pg.path, iid: pg.iid, pageKey: pg.pageKey, w, error: 'no figure' }); return; }
      const reserve = parseFloat(pre.minH) || 0;
      const row = {
        path: pg.path, iid: pg.iid, pageKey: pg.pageKey, w,
        reserve, preH: pre.h, mountedH: post.h, delta: Math.round((post.h - reserve) * 10) / 10,
        preHasOvsI: pre.hasOvsI, preMounted: pre.mounted,
        postHasOvsI: post.hasOvsI, postMounted: post.mounted, postMinH: post.minH,
        readouts: post.readouts, numericReadouts: post.numericReadouts,
        hscrollPre: pre.hscroll, hscrollPost: post.hscroll,
      };
      rows.push(row);
      log(`${pg.iid} ${pg.path} @${w}: reserve=${reserve} mounted=${post.h} delta=${row.delta > 0 ? '+' : ''}${row.delta}`);
    });
  } finally {
    await browser.close();
    server.close();
  }
  rows.sort((a, b) => (a.iid + a.path).localeCompare(b.iid + b.path) || a.w - b.w);
  return { rows, errors };
}

export function deltaTable(rows) {
  const widths = [...new Set(rows.map((r) => r.w))].sort((a, b) => a - b);
  const pages = [...new Set(rows.map((r) => r.iid + ' ' + r.path))];
  const lines = ['delta = mounted - reserve (+ downward settle, - upward snap); * = outside tolerance'];
  lines.push('page'.padEnd(46) + widths.map((w) => String(w).padStart(6)).join(''));
  for (const p of pages) {
    lines.push(p.padEnd(46) + widths.map((w) => {
      const r = rows.find((x) => x.iid + ' ' + x.path === p && x.w === w);
      if (!r || r.error) return '   err'.padStart(6);
      const s = (r.delta > 0 ? '+' : '') + r.delta.toFixed(0);
      return (violates(r) ? s + '*' : s).padStart(6);
    }).join(''));
  }
  return lines.join('\n');
}

export function violates(r, { maxDown = MAX_DOWN, maxUp = MAX_UP } = {}) {
  if (r.error) return 'no figure';
  if (r.delta > maxDown) return `downward settle ${r.delta} > ${maxDown}`;
  if (r.delta < -maxUp) return `upward snap ${r.delta} < -${maxUp}`;
  if (r.preHasOvsI || r.preMounted) return 'pre-mount figure already mounted';
  if (!r.postHasOvsI || !r.postMounted) return 'instrument did not mount';
  if (!(r.postMinH === '0px' || r.postMinH === 'auto')) return `reserve not released (min-height ${r.postMinH})`;
  return null;
}

// ---------------------------------------------------------------- scan mode
export async function scan({ publicDir, port, pages, from = 320, to = 1440, step = 1, concurrency = 4, verifyWidths = null, log = console.log }) {
  const puppeteer = (await import('puppeteer')).default;
  const { server, base } = await serve(publicDir, port);
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'], protocolTimeout: 180000 });
  const curves = [];
  const verify = [];
  try {
    // reload every `chunk` widths: hundreds of consecutive resizes on one
    // page eventually stall the renderer (i01's smoke field), and a fresh
    // load is what the reserve has to match anyway
    const chunk = 100;
    const sweep = async (pg) => {
      let page = null;
      const heights = {};
      try {
        for (let w = from, n = 0; w <= to; w += step, n++) {
          if (!page || n % chunk === 0) {
            if (page) await page.close();
            page = await loadMounted(browser, base, pg, w, null);
          }
          await page.setViewport({ width: w, height: 900, deviceScaleFactor: 1 });
          // the emulated viewport lands asynchronously: wait until the page
          // sees the new width (interval polling, NOT rAF — background tabs
          // throttle rAF and a rAF-polled wait stalls under concurrency);
          // getBoundingClientRect then forces a synchronous layout
          await page.waitForFunction((want) => window.innerWidth === want, { polling: 25, timeout: 30000 }, w);
          const h = await page.evaluate(() => document.querySelector('figure.ovs-instrument').getBoundingClientRect().height);
          heights[w] = Math.round(h * 10) / 10;
        }
      } finally { if (page) await page.close(); }
      return heights;
    };
    await pool(pages, concurrency, async (pg) => {
      let heights;
      for (let attempt = 1; ; attempt++) {
        try { heights = await sweep(pg); break; } catch (e) {
          if (attempt >= 3) throw e;
          log(`${pg.iid} ${pg.path}: sweep attempt ${attempt} failed (${String(e).slice(0, 80)}), retrying`);
        }
      }
      curves.push({ path: pg.path, iid: pg.iid, pageKey: pg.pageKey, heights });
      log(`${pg.iid} ${pg.path}: scanned ${Object.keys(heights).length} widths, ${Math.min(...Object.values(heights))}..${Math.max(...Object.values(heights))}px`);
      if (verifyWidths) {
        for (const w of verifyWidths) {
          const post = await measureMounted(browser, base, pg, w, null);
          verify.push({ path: pg.path, iid: pg.iid, w, fresh: post.h, resized: heights[w], diff: Math.round((post.h - heights[w]) * 10) / 10 });
        }
      }
    });
  } finally {
    await browser.close();
    server.close();
  }
  curves.sort((a, b) => (a.iid + a.path).localeCompare(b.iid + b.path));
  return { from, to, step, curves, verify };
}

// ---------------------------------------------------------------- emit-css
export function segment(heights, budget) {
  const ws = Object.keys(heights).map(Number).sort((a, b) => a - b);
  const bands = [];
  let cur = null;
  for (const w of ws) {
    const h = heights[w];
    if (cur && Math.max(cur.max, h) - Math.min(cur.min, h) <= budget) {
      cur.to = w; cur.max = Math.max(cur.max, h); cur.min = Math.min(cur.min, h);
    } else {
      cur = { from: w, to: w, min: h, max: h };
      bands.push(cur);
    }
  }
  return bands;
}

const reserveOf = (band, margin) => Math.floor((band.max - margin) / 5) * 5;

// contiguous bands (each runs to the px before the next) with their
// reserve; adjacent bands that floor to the same reserve are merged
function bandsWithReserve(heights, budget, margin) {
  const raw = segment(heights, budget);
  const out = [];
  for (let i = 0; i < raw.length; i++) {
    const b = raw[i];
    const band = { from: b.from, to: i + 1 < raw.length ? raw[i + 1].from - 1 : b.to, min: b.min, max: b.max, reserve: reserveOf(b, margin) };
    const prev = out[out.length - 1];
    if (prev && prev.reserve === band.reserve && prev.to + 1 === band.from) {
      prev.to = band.to; prev.min = Math.min(prev.min, band.min); prev.max = Math.max(prev.max, band.max);
    } else out.push(band);
  }
  return out;
}

function slice(heights, from, to) {
  const o = {};
  for (let w = from; w <= to; w++) if (heights[w] !== undefined) o[w] = heights[w];
  return o;
}

function mediaQuery(b, scanFrom, scanTo) {
  if (b.from <= scanFrom && b.to >= scanTo) return '';
  if (b.from <= scanFrom) return `@media (max-width: ${b.to}px)`;
  if (b.to >= scanTo) return `@media (min-width: ${b.from}px)`;
  return `@media (min-width: ${b.from}px) and (max-width: ${b.to}px)`;
}

export function emitCss(scanData, { budget = BAND_BUDGET, margin = MARGIN, maxUp = MAX_UP, commit = '', date = new Date().toISOString().slice(0, 10) } = {}) {
  const { curves, from: scanFrom, to: scanTo } = scanData;
  const byIid = new Map();
  for (const c of curves) { if (!byIid.has(c.iid)) byIid.set(c.iid, []); byIid.get(c.iid).push(c); }
  const out = [];
  out.push(`/* ---------- CLS reserve (pre-mount) ----------`);
  out.push(`   generated by scripts/measure-instrument-reserves.mjs on ${date} against ${commit || '(uncommitted)'}.`);
  out.push(`   createInstrument() (viz.mjs) stamps .ovs-i on the figure when the`);
  out.push(`   instrument mounts; until then the figure holds only the JS-hidden`);
  out.push(`   noscript fallback, so without a reserve everything below jumps on`);
  out.push(`   mount. Each rule below reserves the measured mounted height: bands`);
  out.push(`   are cut where the mounted height moves (wrap steps and the width-`);
  out.push(`   proportional scene; ${scanData.step}px sweep ${scanFrom}-${scanTo}px, max-min <= ${budget}px per`);
  out.push(`   band), each band's reserve is its max mounted height - ${margin}px floored`);
  out.push(`   to 5px, so the residual shift is a settle of at most ~${margin}px either`);
  out.push(`   way. The default per instrument is measured on its /tools/ page; a page`);
  out.push(`   where the same instrument mounts at a different height (the homepage`);
  out.push(`   i01 hero, i10 on the grease page, a question page whose wrap steps sit`);
  out.push(`   a pixel off) gets page-scoped overrides via the figure's data-page`);
  out.push(`   attribute (partials/instrument-figure.html), only over the widths`);
  out.push(`   where the default would settle more than ${margin + 10}px down or ${maxUp}px up.`);
  out.push(`   Do not hand-edit: re-run the script (--scan, then --emit-css). */`);
  out.push(`.ovs-instrument:not(.ovs-i) {`);
  out.push(`  min-height: var(--i-reserve, 750px);`);
  out.push(`  /* Pin any authored <figcaption> to the BOTTOM of the reserved box`);
  out.push(`     pre-mount: post-mount it sits below the instrument, so without this`);
  out.push(`     it rides from the top of the reserve to the bottom when the mount`);
  out.push(`     fills in — the homepage hero's only CLS source (0.0768, F3 QA F-1).`);
  out.push(`     Figures without a figcaption are unaffected (empty flex column). */`);
  out.push(`  display: flex;`);
  out.push(`  flex-direction: column;`);
  out.push(`  justify-content: flex-end;`);
  out.push(`}`);
  const groups = [];
  const rule = (sel, b) => {
    const mq = mediaQuery(b, scanFrom, scanTo);
    const decl = `${sel} { --i-reserve: ${b.reserve}px; }`;
    return `${mq ? `${mq} { ${decl} }` : decl} /* mounted ${b.min}-${b.max}px */`;
  };
  for (const iid of [...byIid.keys()].sort()) {
    const list = byIid.get(iid);
    const ref = list.find((c) => c.path.startsWith('/tools/')) || list[0];
    const sel = `.ovs-instrument[data-instrument="${iid}"]`;
    const refBands = bandsWithReserve(ref.heights, budget, margin);
    out.push('');
    out.push(`/* ${iid}: ${ref.path} */`);
    for (const b of refBands) out.push(rule(sel, b));
    groups.push({ iid, pageKey: null, sel, pages: [ref.path], bands: refBands });
    for (const c of list) {
      if (c === ref) continue;
      // keep the default wherever it holds this page within a settle of
      // margin+10 down (the tool page's own worst case is margin+4, and a
      // question page's wrap steps sit a few px off) / maxUp up; override
      // the rest, re-cut on this page's curve
      const overrides = [];
      for (const b of refBands) {
        const sl = slice(c.heights, b.from, b.to);
        const hs = Object.values(sl);
        const pmax = Math.max(...hs); const pmin = Math.min(...hs);
        if (pmax - b.reserve <= margin + 10 && pmin - b.reserve >= -maxUp) continue;
        for (const ob of bandsWithReserve(sl, budget, margin)) overrides.push(ob);
      }
      // merge contiguous equal-reserve overrides
      const merged = [];
      for (const ob of overrides) {
        const prev = merged[merged.length - 1];
        if (prev && prev.reserve === ob.reserve && prev.to + 1 === ob.from) { prev.to = ob.to; prev.min = Math.min(prev.min, ob.min); prev.max = Math.max(prev.max, ob.max); }
        else merged.push({ ...ob });
      }
      const psel = `${sel}[data-page="${c.pageKey}"]`;
      const covered = merged.reduce((n, b) => n + (b.to - b.from + 1), 0);
      if (merged.length) {
        out.push('');
        out.push(`/* ${iid} on ${c.pageKey}: ${c.path} — overrides ${covered} of ${scanTo - scanFrom + 1} widths */`);
        for (const b of merged) out.push(rule(psel, b));
      }
      groups.push({ iid, pageKey: c.pageKey, sel: psel, pages: [c.path], bands: merged, covered });
    }
  }
  return { css: out.join('\n') + '\n', groups };
}

// ---------------------------------------------------------------- main
async function main() {
  const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
  if (!isMain) return;
  const contentDir = path.resolve(opt('content', path.join(ROOT, 'content')));
  const port = Number(opt('port', 0));  // 0 = OS-assigned free port
  const scratch = process.env.CLAUDE_SCRATCHPAD || path.join(ROOT, '.scratch');
  const commit = opt('commit', (() => { try { return execSync('git rev-parse --short HEAD', { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch { return ''; } })());

  if (flag('emit-css')) {
    const from = opt('from');
    if (!from || from === true) { console.error('--emit-css needs --from <scan.json>'); process.exit(2); }
    const data = JSON.parse(fs.readFileSync(from, 'utf8'));
    const { css, groups } = emitCss(data, {
      budget: Number(opt('band-budget', BAND_BUDGET)), margin: Number(opt('margin', MARGIN)), commit,
    });
    process.stdout.write(css);
    console.error(groups.map((g) => `${g.sel}: ${g.bands.length} ${g.pageKey ? `override bands (${g.covered} widths)` : 'bands'}${g.bands.length ? ', edges ' + g.bands.map((b) => b.from).join('/') : ''}`).join('\n'));
    return;
  }

  const publicDir = path.resolve(String(opt('public', '')));
  if (!publicDir || !fs.existsSync(path.join(publicDir, 'index.html'))) { console.error('--public <dir> must point at a hugo build'); process.exit(2); }
  let pages = hostPages(contentDir, publicDir);
  const only = opt('pages');
  if (only && only !== true) { const set = new Set(only.split(',')); pages = pages.filter((p) => set.has(p.path)); }
  if (!pages.length) { console.error('no host pages'); process.exit(2); }
  const concurrency = Number(opt('concurrency', flag('scan') ? 4 : 6));

  if (flag('scan')) {
    const verifyWidths = flag('verify-scan') ? DEFAULT_WIDTHS : null;
    const data = await scan({ publicDir, port, pages, from: Number(opt('scan-from', 320)), to: Number(opt('scan-to', 1440)), step: Number(opt('scan-step', 1)), concurrency, verifyWidths });
    data.commit = commit; data.date = new Date().toISOString();
    const outFile = String(opt('out', path.join(scratch, 'instrument-reserves-scan.json')));
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, JSON.stringify(data, null, 1));
    console.log(`wrote ${outFile}`);
    if (verifyWidths) {
      const bad = data.verify.filter((v) => Math.abs(v.diff) > 1);
      console.log(`resize-vs-fresh verification: ${data.verify.length} samples, ${bad.length} differ by >1px`);
      for (const v of bad) console.log(`  ${v.iid} ${v.path} @${v.w}: fresh ${v.fresh} resized ${v.resized}`);
    }
    return;
  }

  const widths = String(opt('widths', DEFAULT_WIDTHS.join(','))).split(',').map(Number);
  const { rows, errors } = await measure({ publicDir, port, widths, pages, concurrency });
  const outFile = String(opt('out', path.join(scratch, 'instrument-reserves.json')));
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify({ commit, date: new Date().toISOString(), widths, rows, errors }, null, 1));
  console.log('\n' + deltaTable(rows));
  console.log(`\nwrote ${outFile}`);
  if (errors.length) console.log(`same-origin console errors: ${errors.length}\n` + errors.map((e) => `  @${e.width} ${e.text} ${e.url || ''}`).join('\n'));
  if (flag('check')) {
    const maxDown = Number(opt('max-down', MAX_DOWN));
    const maxUp = Number(opt('max-up', MAX_UP));
    const bad = rows.map((r) => ({ r, why: violates(r, { maxDown, maxUp }) })).filter((x) => x.why);
    if (bad.length) {
      console.log(`\nCHECK FAILED: ${bad.length} of ${rows.length} samples outside tolerance (down > ${maxDown}, up > ${maxUp})`);
      for (const { r, why } of bad) console.log(`  ${r.iid} ${r.path} @${r.w}: ${why} (reserve ${r.reserve}, mounted ${r.mountedH})`);
      process.exit(1);
    }
    console.log(`\nCHECK OK: ${rows.length} samples, every |delta| <= ${maxDown} and no upward snap > ${maxUp}`);
  }
}

await main();
