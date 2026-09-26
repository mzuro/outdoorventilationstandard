import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateTrackBody, QUESTION_IDS, TRACK_TEXT_MAX, CUSTOM_TTL } from '../src/lib/track.mjs';

test('validateTrackBody: accepts exactly the ids the two shipped clients send', () => {
  assert.deepEqual([...QUESTION_IDS].sort(), ['ai_search', 'custom']);
  assert.deepEqual(validateTrackBody({ question_id: 'custom', text: 'how many cfm' }), { ok: true, questionId: 'custom', text: 'how many cfm' });
  // search.html sends ai_search; text is not retained for it
  assert.deepEqual(validateTrackBody({ question_id: 'ai_search', text: 'how many cfm' }), { ok: true, questionId: 'ai_search', text: '' });
});

test('validateTrackBody: rejects non-object bodies', () => {
  for (const b of [null, undefined, 'x', 42, [], true]) {
    assert.equal(validateTrackBody(b).ok, false, `body ${JSON.stringify(b)}`);
    assert.equal(validateTrackBody(b).error, 'invalid_body');
  }
});

test('validateTrackBody: any id outside the allowlist is rejected', () => {
  const bad = ['', 'Custom', 'CUSTOM', 'custom ', ' custom', 'q-01', 'preset-1', 'a b', 'ratelimit:1.2.3.4:1', 'clicks:custom', 'dailycap:2026-09-26', '../x', 'a'.repeat(65), '<script>', 'custom\n'];
  for (const id of bad) {
    const r = validateTrackBody({ question_id: id });
    assert.equal(r.ok, false, `id ${JSON.stringify(id)}`);
    assert.equal(r.error, 'invalid_question_id');
  }
  for (const id of [42, null, undefined, {}, ['custom'], { toString: () => 'custom' }]) {
    assert.equal(validateTrackBody({ question_id: id }).error, 'invalid_question_id');
  }
});

test('validateTrackBody: text must be a string when present', () => {
  assert.equal(validateTrackBody({ question_id: 'custom', text: 42 }).error, 'invalid_text');
  assert.equal(validateTrackBody({ question_id: 'custom', text: { a: 1 } }).error, 'invalid_text');
  assert.equal(validateTrackBody({ question_id: 'custom', text: ['x'] }).error, 'invalid_text');
  assert.deepEqual(validateTrackBody({ question_id: 'custom', text: null }), { ok: true, questionId: 'custom', text: '' });
  assert.deepEqual(validateTrackBody({ question_id: 'custom' }), { ok: true, questionId: 'custom', text: '' });
});

test('validateTrackBody: text is capped at 200 code points and cleaned', () => {
  assert.equal(TRACK_TEXT_MAX, 200);
  const r = validateTrackBody({ question_id: 'custom', text: 'x'.repeat(5000) });
  assert.equal(r.ok, true);
  assert.equal(r.text.length, 200);
  // C0 controls, DEL, C1 controls all become whitespace and collapse
  const r2 = validateTrackBody({ question_id: 'custom', text: '  a\u0000b\n\n c\t d\u007fe\u0085f\u009fg  ' });
  assert.equal(r2.text, 'a b c d e f g');
});

test('validateTrackBody: cap never splits a surrogate pair', () => {
  // 199 ASCII chars then an astral emoji: 200 code points, 201 UTF-16 units
  const text = 'x'.repeat(199) + '\u{1F525}' + 'tail';
  const r = validateTrackBody({ question_id: 'custom', text });
  assert.equal(Array.from(r.text).length, 200);
  assert.equal(r.text.endsWith('\u{1F525}'), true);
  assert.equal(r.text.length, 201); // both halves of the pair kept
  // and a pure-emoji string of 300 code points -> exactly 200 whole emoji
  const r3 = validateTrackBody({ question_id: 'custom', text: '\u{1F525}'.repeat(300) });
  assert.equal(Array.from(r3.text).length, 200);
  assert.equal(r3.text, '\u{1F525}'.repeat(200));
  // no lone surrogate at the tail
  const lastUnit = r3.text.charCodeAt(r3.text.length - 1);
  assert.ok(lastUnit >= 0xdc00 && lastUnit <= 0xdfff);
  const firstUnit = r3.text.charCodeAt(r3.text.length - 2);
  assert.ok(firstUnit >= 0xd800 && firstUnit <= 0xdbff);
});

test('CUSTOM_TTL is 30 days', () => {
  assert.equal(CUSTOM_TTL, 30 * 24 * 3600);
});
