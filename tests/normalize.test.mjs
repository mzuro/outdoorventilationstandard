import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeQuestion, askCacheKey } from '../src/lib/normalize.mjs';
import { PHYSICS_VERSION } from '../static/js/ovs/physics/version.mjs';

test('normalizeQuestion lowercases, trims, strips punctuation, collapses whitespace', () => {
  assert.equal(normalizeQuestion('  What CFM do I need?!  '), 'what cfm do i need');
});

test('normalizeQuestion treats near-duplicate phrasing as identical', () => {
  assert.equal(
    normalizeQuestion('What CFM do I need for a 48" hood?'),
    normalizeQuestion('what cfm do i need for a 48 hood')
  );
});

test('normalizeQuestion is stable for non-string input', () => {
  assert.equal(normalizeQuestion(null), '');
  assert.equal(normalizeQuestion(undefined), '');
});

test('askCacheKey is prefixed with the physics version and normalized (a physics re-base invalidates every cached answer)', () => {
  assert.equal(PHYSICS_VERSION, 'v3'); // v3: i02 above-ladder state-sheet shape (version.mjs)
  assert.equal(askCacheKey('What CFM?'), 'ask:v3:what cfm');
  assert.ok(askCacheKey('anything').startsWith(`ask:${PHYSICS_VERSION}:`));
});
