// reference-tables.test.mjs — drift guard for the generated content. The
// "Reference readings" tables, the three /data CSVs and the claims ledger are
// derived from static/js/ovs/physics/*.mjs; if a module or a page changes
// without regenerating them, each script's --check mode exits non-zero. Both
// modes are read-only. (`npm test` also runs them via `npm run check`; this
// test keeps `node --test` alone honest.)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readFileSync, statSync } from 'node:fs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LEDGER = join(ROOT, 'docs/superpowers/physics-rebase-claims-ledger.md');

function runCheck(script) {
  const r = spawnSync(process.execPath, [join(ROOT, script), '--check'], { cwd: ROOT, encoding: 'utf8' });
  return { status: r.status, out: (r.stdout || '') + (r.stderr || '') };
}

test('generate-reference-tables.mjs --check: tables and CSVs match the physics modules', () => {
  const { status, out } = runCheck('scripts/generate-reference-tables.mjs');
  assert.equal(status, 0, out);
});

test('physics-claims-ledger.mjs --check: every hand-written claim verifies and the ledger is current', () => {
  const before = readFileSync(LEDGER, 'utf8');
  const mtime = statSync(LEDGER).mtimeMs;
  const { status, out } = runCheck('scripts/physics-claims-ledger.mjs');
  assert.equal(status, 0, out);
  assert.match(out, /0 not found/);
  // read-only: the committed ledger (and its date line) is untouched
  assert.equal(readFileSync(LEDGER, 'utf8'), before);
  assert.equal(statSync(LEDGER).mtimeMs, mtime);
});
