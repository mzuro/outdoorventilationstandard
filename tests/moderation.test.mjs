import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isBlockedInput, BLOCKED_PATTERNS, parseModelResponse } from '../src/lib/moderation.mjs';

test('isBlockedInput flags clearly inappropriate input', () => {
  assert.equal(isBlockedInput('where can I buy drugs'), true);
  assert.equal(isBlockedInput('instructions for bomb making'), true);
});

test('isBlockedInput does not false-positive on "hack" (trimmed per AI report §2.1-5)', () => {
  assert.equal(isBlockedInput('any hacks for reducing smoke?'), false);
  assert.equal(BLOCKED_PATTERNS.some((p) => p.source.includes('hack')), false);
});

test('isBlockedInput leaves normal on-topic questions alone', () => {
  assert.equal(isBlockedInput('what cfm do I need for a 48 inch island hood?'), false);
  assert.equal(isBlockedInput('does wind affect my hood'), false);
});

test('parseModelResponse: valid JSON is parsed as structured, off_topic false', () => {
  const raw = JSON.stringify({
    answer: 'You need 1,450 CFM minimum.',
    citations: [{ rb: 'RB-008', section: '3.3', url: '/research/rb-008-cfm-requirements/#33' }],
    followups: ['q1', 'q2', 'q3'],
    off_topic: false,
  });
  const r = parseModelResponse(raw);
  assert.equal(r.structured, true);
  assert.equal(r.offTopic, false);
  assert.equal(r.answer, 'You need 1,450 CFM minimum.');
  assert.equal(r.citations.length, 1);
  assert.equal(r.followups.length, 3);
});

test('parseModelResponse: JSON wrapped in a markdown code fence still parses', () => {
  const raw = '```json\n' + JSON.stringify({ answer: 'a', citations: [], followups: [], off_topic: false }) + '\n```';
  const r = parseModelResponse(raw);
  assert.equal(r.structured, true);
  assert.equal(r.answer, 'a');
});

test('parseModelResponse: off_topic:true JSON is honored (structured flag, not string sniffing)', () => {
  const raw = JSON.stringify({ answer: '', citations: [], followups: [], off_topic: true });
  const r = parseModelResponse(raw);
  assert.equal(r.offTopic, true);
});

test('parseModelResponse: followups are capped at 3 and truncated', () => {
  const raw = JSON.stringify({
    answer: 'a', off_topic: false,
    followups: ['q1', 'q2', 'q3', 'q4', 'x'.repeat(300)],
  });
  const r = parseModelResponse(raw);
  assert.equal(r.followups.length, 3);
});

test('parseModelResponse: malformed JSON falls back to legacy OFF_TOPIC sentinel parse', () => {
  const r = parseModelResponse('OFF_TOPIC');
  assert.equal(r.structured, false);
  assert.equal(r.offTopic, true);
});

test('parseModelResponse: malformed JSON falls back to legacy markdown-link scraping', () => {
  const raw = 'A 48-inch island hood needs 1,450 CFM.\n[CFM Sizing Calculator](/tools/cfm-calculator/)';
  const r = parseModelResponse(raw);
  assert.equal(r.structured, false);
  assert.equal(r.offTopic, false);
  assert.ok(r.answer.includes('1,450 CFM'));
  assert.ok(!r.answer.includes('['));
  assert.equal(r.citations.length, 1);
  assert.equal(r.citations[0].url, '/tools/cfm-calculator/');
});

test('parseModelResponse: empty/non-string input degrades gracefully', () => {
  assert.equal(parseModelResponse('').offTopic, false);
  assert.equal(parseModelResponse(undefined).answer, '');
});

test('parseModelResponse: structured-path answer is scrubbed of markdown-link syntax (W3 review MINOR-1)', () => {
  const raw = JSON.stringify({
    answer: 'A 48-inch island hood needs 1,450 CFM — see [the calculator](https://evil.example.com/steal) for details.',
    citations: [],
    followups: [],
    off_topic: false,
  });
  const r = parseModelResponse(raw);
  assert.equal(r.structured, true);
  assert.equal(r.answer, 'A 48-inch island hood needs 1,450 CFM — see the calculator for details.');
  assert.ok(!r.answer.includes('evil.example.com'));
});

test('parseModelResponse: structured-path answer without links is untouched', () => {
  const raw = JSON.stringify({ answer: 'Plain answer [not a link, no parens].', citations: [], followups: [], off_topic: false });
  const r = parseModelResponse(raw);
  assert.equal(r.answer, 'Plain answer [not a link, no parens].');
});
