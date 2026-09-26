import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateTrackBody, QUESTION_ID_RE, TRACK_TEXT_MAX, CUSTOM_TTL } from '../src/lib/track.mjs';

test('validateTrackBody: accepts the ids both shipped clients send', () => {
  assert.deepEqual(validateTrackBody({ question_id: 'custom', text: 'how many cfm' }), { ok: true, questionId: 'custom', text: 'how many cfm' });
  // search.html sends ai_search — underscore must be allowed
  assert.deepEqual(validateTrackBody({ question_id: 'ai_search', text: 'how many cfm' }), { ok: true, questionId: 'ai_search', text: '' });
  assert.deepEqual(validateTrackBody({ question_id: 'q-01' }), { ok: true, questionId: 'q-01', text: '' });
});

test('validateTrackBody: rejects non-object bodies', () => {
  for (const b of [null, undefined, 'x', 42, [], true]) {
    assert.equal(validateTrackBody(b).ok, false, `body ${JSON.stringify(b)}`);
    assert.equal(validateTrackBody(b).error, 'invalid_body');
  }
});

test('validateTrackBody: question_id must match /^[a-z0-9_-]{1,64}$/', () => {
  const bad = ['', 'Custom', 'a b', 'a/b', 'ratelimit:1.2.3.4:1', '../x', 'a'.repeat(65), 'ünicode', '<script>', 'a\n', 'clicks:x'];
  for (const id of bad) {
    const r = validateTrackBody({ question_id: id });
    assert.equal(r.ok, false, `id ${JSON.stringify(id)}`);
    assert.equal(r.error, 'invalid_question_id');
  }
  for (const id of [42, null, undefined, {}, ['custom']]) {
    assert.equal(validateTrackBody({ question_id: id }).error, 'invalid_question_id');
  }
  assert.equal(validateTrackBody({ question_id: 'a'.repeat(64) }).ok, true);
  assert.equal(QUESTION_ID_RE.test('a-b_c9'), true);
});

test('validateTrackBody: text must be a string when present', () => {
  assert.equal(validateTrackBody({ question_id: 'custom', text: 42 }).error, 'invalid_text');
  assert.equal(validateTrackBody({ question_id: 'custom', text: { a: 1 } }).error, 'invalid_text');
  assert.equal(validateTrackBody({ question_id: 'custom', text: ['x'] }).error, 'invalid_text');
  assert.deepEqual(validateTrackBody({ question_id: 'custom', text: null }), { ok: true, questionId: 'custom', text: '' });
  assert.deepEqual(validateTrackBody({ question_id: 'custom' }), { ok: true, questionId: 'custom', text: '' });
});

test('validateTrackBody: text is capped at 200 chars and cleaned', () => {
  const long = 'x'.repeat(5000);
  const r = validateTrackBody({ question_id: 'custom', text: long });
  assert.equal(r.ok, true);
  assert.equal(r.text.length, TRACK_TEXT_MAX);
  assert.equal(TRACK_TEXT_MAX, 200);
  const r2 = validateTrackBody({ question_id: 'custom', text: '  a\u0000b\n\n c\t d  ' });
  assert.equal(r2.text, 'a b c d');
});

test('validateTrackBody: text is only retained for the custom id', () => {
  assert.equal(validateTrackBody({ question_id: 'preset-1', text: 'x'.repeat(10) }).text, '');
});

test('CUSTOM_TTL is 30 days', () => {
  assert.equal(CUSTOM_TTL, 30 * 24 * 3600);
});
