// Regression test for the MINOR finding: legacyCopy() could leak an
// orphaned <textarea> when execCommand('copy') THROWS (rather than returns
// false) — e.g. blocked by a Permissions-Policy or inside a sandboxed
// iframe. See static/js/ovs/viz.mjs's legacyCopy() for the full writeup;
// the fix moves `document.body.removeChild(ta)` into a `finally` so it
// always runs.
//
// viz.mjs computes `hasDom` ONCE at module-import time
// (`typeof document !== 'undefined' && typeof window !== 'undefined'`), so
// the minimal fake DOM below must be installed on `globalThis` BEFORE the
// module is first imported — hence the dynamic `import()` after the
// globals are set, rather than a static top-of-file import. `node --test`
// isolates each test file (its own module registry), so this does not leak
// into any other test file's import of viz.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';

function installFakeDom({ execCommandThrows = false, execCommandReturns = true } = {}) {
  const bodyChildren = [];
  const fakeBody = {
    appendChild(node) {
      bodyChildren.push(node);
      node.parentNode = fakeBody;
    },
    removeChild(node) {
      const i = bodyChildren.indexOf(node);
      if (i === -1) throw new Error('removeChild called on a node that is not a child');
      bodyChildren.splice(i, 1);
      node.parentNode = null;
    },
  };
  const makeTextarea = () => ({
    style: {},
    parentNode: null,
    setAttribute() {},
    focus() {},
    select() {},
    setSelectionRange() {},
  });
  globalThis.document = {
    createElement: (tag) => {
      assert.equal(tag, 'textarea');
      return makeTextarea();
    },
    body: fakeBody,
    execCommand: () => {
      if (execCommandThrows) throw new Error('execCommand blocked (simulated Permissions-Policy)');
      return execCommandReturns;
    },
  };
  globalThis.window = {}; // legacyCopy only needs `window` to exist for hasDom
  return bodyChildren;
}

function removeFakeDom() {
  delete globalThis.document;
  delete globalThis.window;
}

test('legacyCopy: execCommand throwing is swallowed AND the off-screen textarea is still removed (no leak)', async () => {
  const bodyChildren = installFakeDom({ execCommandThrows: true });
  try {
    const { legacyCopy } = await import('../static/js/ovs/viz.mjs');
    const ok = legacyCopy('spec line text');
    assert.equal(ok, false, 'a throwing execCommand must be reported as a failed copy, not propagate');
    assert.equal(
      bodyChildren.length,
      0,
      'the off-screen <textarea> must not remain attached to document.body after execCommand throws',
    );
  } finally {
    removeFakeDom();
  }
});

test('legacyCopy: a normal successful copy also cleans up the textarea (no regression on the happy path)', async () => {
  const bodyChildren = installFakeDom({ execCommandReturns: true });
  try {
    const { legacyCopy } = await import('../static/js/ovs/viz.mjs');
    const ok = legacyCopy('spec line text');
    assert.equal(ok, true);
    assert.equal(bodyChildren.length, 0, 'the textarea must be removed on the success path too');
  } finally {
    removeFakeDom();
  }
});

test('legacyCopy: execCommand returning false (not throwing) is still reported as failure, with cleanup', async () => {
  const bodyChildren = installFakeDom({ execCommandReturns: false });
  try {
    const { legacyCopy } = await import('../static/js/ovs/viz.mjs');
    const ok = legacyCopy('spec line text');
    assert.equal(ok, false);
    assert.equal(bodyChildren.length, 0);
  } finally {
    removeFakeDom();
  }
});
