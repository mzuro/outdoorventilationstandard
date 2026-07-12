import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeQuestion, askCacheKey } from '../src/lib/normalize.mjs';

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

test('askCacheKey is prefixed and normalized', () => {
  assert.equal(askCacheKey('What CFM?'), 'askcache:what cfm');
});
