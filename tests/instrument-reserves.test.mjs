// instrument-reserves.test.mjs — the pre-mount CLS reserve of every
// instrument figure (assets/ovs/css/components.css `--i-reserve`, generated
// by scripts/measure-instrument-reserves.mjs) still matches what the
// instruments actually mount at, on every host page (tools, questions,
// homepage hero), at a subset of the calibration widths.
//
// Runs a fresh `hugo` build into a temp dir and the measure script's
// --check against it in headless Chromium. Skips LOUDLY (a named skip, not
// a silent pass) when hugo or puppeteer is missing. The full calibration
// run uses every width in DEFAULT_WIDTHS; this test keeps runtime
// reasonable with the band-edge widths only.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCRIPT = path.join(ROOT, 'scripts', 'measure-instrument-reserves.mjs');
const WIDTHS = [375, 391, 406, 431, 641, 768, 1280];
const PORT = 8829;

let puppeteer = null;
try { puppeteer = (await import('puppeteer')).default; } catch { /* reported below */ }
const hugo = spawnSync('hugo', ['version'], { encoding: 'utf8' });
const hasHugo = hugo.status === 0;

const skip = !puppeteer ? 'puppeteer not installed (npm ci) — instrument reserve check not run'
  : !hasHugo ? 'hugo not on PATH — instrument reserve check not run'
    : false;

test(`instrument reserves: --check passes at ${WIDTHS.join('/')} on every host page (fresh hugo build)`, { skip, timeout: 15 * 60 * 1000 }, () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ovs-reserves-'));
  try {
    const build = spawnSync('hugo', ['--gc', '--minify', '--cleanDestinationDir', '-d', tmp], { cwd: ROOT, encoding: 'utf8' });
    assert.equal(build.status, 0, `hugo build failed:\n${build.stdout}\n${build.stderr}`);
    assert.ok(fs.existsSync(path.join(tmp, 'index.html')), 'hugo build produced no index.html');

    const run = spawnSync(process.execPath, [
      SCRIPT, '--public', tmp, '--port', String(PORT), '--widths', WIDTHS.join(','),
      '--out', path.join(tmp, 'reserves.json'), '--check', '--concurrency', '6',
    ], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    const tail = (run.stdout || '').split('\n').slice(-60).join('\n');
    assert.equal(run.status, 0, `measure-instrument-reserves --check failed:\n${tail}\n${run.stderr}`);

    const { rows } = JSON.parse(fs.readFileSync(path.join(tmp, 'reserves.json'), 'utf8'));
    const pages = new Set(rows.map((r) => r.path));
    assert.ok(pages.has('/'), 'homepage hero measured');
    assert.ok(pages.has('/tools/failure-mode-taxonomy/') && pages.has('/tools/grease-aerosol-deposition/'), 'both i10 pages measured');
    assert.ok(pages.size >= 12, `expected every tool page + hero (+ questions), got ${pages.size}`);
    assert.equal(rows.length, pages.size * WIDTHS.length, 'one sample per page per width');
    for (const r of rows) {
      assert.ok(r.postHasOvsI && r.postMounted, `${r.iid} ${r.path} @${r.w} mounted`);
      assert.ok(r.numericReadouts > 0, `${r.iid} ${r.path} @${r.w} has numeric readouts`);
    }
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
