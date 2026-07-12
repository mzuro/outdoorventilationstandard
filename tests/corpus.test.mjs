import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tokenize, flattenCorpus, scoreCandidate, selectTopK, buildContextText } from '../src/lib/corpus.mjs';

const SAMPLE = {
  questions: [
    {
      url: '/questions/what-cfm-do-i-need/',
      title: 'What CFM do I need?',
      text: 'A 48-inch wall hood needs at least 1,200 CFM. An island hood needs about 1,450 CFM minimum and 1,800 CFM recommended.',
    },
    {
      url: '/questions/does-wind-affect-my-hood/',
      title: 'Does wind affect my hood?',
      text: 'Wind drops capture from 97% in still air to 79% at 5 mph.',
    },
  ],
  papers: [
    {
      url: '/research/rb-008-cfm-requirements/',
      title: 'RB-008: CFM Requirements',
      research_id: 'RB-008',
      summary: 'CFM sizing methodology for outdoor cooking ventilation.',
      facts: [
        {
          section: '3.3 Primary Answer',
          url: '/research/rb-008-cfm-requirements/#33-primary-answer',
          text: 'Sheltered installation: 727 CFM minimum; specify a 900 CFM blower.',
        },
      ],
    },
  ],
  tools: [
    { url: '/tools/cfm-calculator/', title: 'CFM Sizing Calculator', summary: 'Physics-based CFM calculator.' },
  ],
  methodology: [
    { url: '/methodology/', title: 'Methodology', summary: 'How the research is done.' },
  ],
};

test('tokenize lowercases, strips punctuation, drops stopwords/short tokens', () => {
  const t = tokenize('What CFM do I need for a 48-inch grill?');
  assert.ok(t.includes('cfm'));
  assert.ok(t.includes('48-inch') || t.includes('48'));
  assert.ok(!t.includes('what'));
  assert.ok(!t.includes('do'));
  assert.ok(!t.includes('i'));
});

test('tokenize is robust to empty/non-string input', () => {
  assert.deepEqual(tokenize(''), []);
  assert.deepEqual(tokenize(null), []);
  assert.deepEqual(tokenize(undefined), []);
});

test('flattenCorpus produces one candidate per question, per fact, plus paper/tool/methodology summaries', () => {
  const flat = flattenCorpus(SAMPLE);
  const kinds = flat.map((c) => c.kind);
  assert.equal(kinds.filter((k) => k === 'question').length, 2);
  assert.equal(kinds.filter((k) => k === 'fact').length, 1);
  assert.equal(kinds.filter((k) => k === 'paper-summary').length, 1);
  assert.equal(kinds.filter((k) => k === 'tool').length, 1);
  assert.equal(kinds.filter((k) => k === 'methodology').length, 1);
});

test('flattenCorpus tolerates malformed/missing input', () => {
  assert.deepEqual(flattenCorpus(null), []);
  assert.deepEqual(flattenCorpus({}), []);
  assert.deepEqual(flattenCorpus({ papers: [{ url: '/x/', facts: [{ text: '' }] }] }), []);
});

test('scoreCandidate is 0 for no term overlap, >0 for overlap, weighted by kind', () => {
  const flat = flattenCorpus(SAMPLE);
  const cfmQuestion = flat.find((c) => c.url === '/questions/what-cfm-do-i-need/');
  const windQuestion = flat.find((c) => c.url === '/questions/does-wind-affect-my-hood/');
  const terms = tokenize('what cfm do I need for an island hood');
  assert.ok(scoreCandidate(terms, cfmQuestion) > 0);
  assert.ok(scoreCandidate(terms, cfmQuestion) > scoreCandidate(terms, windQuestion));
});

test('scoreCandidate gives a bonus for a literal research_id mention', () => {
  const flat = flattenCorpus(SAMPLE);
  const fact = flat.find((c) => c.kind === 'fact');
  const withCode = scoreCandidate(tokenize('what does RB-008 say about sheltered CFM'), fact);
  const withoutCode = scoreCandidate(tokenize('what does the paper say about sheltered CFM'), fact);
  assert.ok(withCode > withoutCode);
});

test('selectTopK returns [] for empty/unscoreable query', () => {
  const flat = flattenCorpus(SAMPLE);
  assert.deepEqual(selectTopK(flat, ''), []);
  assert.deepEqual(selectTopK(flat, 'the a of'), []);
});

test('selectTopK ranks the best-matching entry first and respects k', () => {
  const flat = flattenCorpus(SAMPLE);
  const top = selectTopK(flat, 'how many CFM do I need for a 48 inch island hood?', { k: 2 });
  assert.ok(top.length > 0 && top.length <= 2);
  assert.ok(top[0].url.includes('cfm'));
});

test('selectTopK respects the maxChars budget (always keeps at least the top pick)', () => {
  const flat = flattenCorpus(SAMPLE);
  const top = selectTopK(flat, 'CFM island wind capture', { k: 6, maxChars: 1 });
  assert.equal(top.length, 1);
});

test('buildContextText renders selected entries with url and section', () => {
  const flat = flattenCorpus(SAMPLE);
  const fact = flat.find((c) => c.kind === 'fact');
  const text = buildContextText([fact]);
  assert.ok(text.includes(fact.url));
  assert.ok(text.includes(fact.text));
  assert.ok(text.includes(fact.section));
});

test('buildContextText is empty for no selection', () => {
  assert.equal(buildContextText([]), '');
  assert.equal(buildContextText(null), '');
});
