import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeLinks, citableUrlSet, assembleCitations, SITE_ORIGIN } from '../src/lib/citations.mjs';

test('sanitizeLinks keeps only own-origin, known-page links (ask-link-whitelist hotfix)', () => {
  const validUrls = new Set(['/research/rb-008-cfm-requirements/', '/tools/cfm-calculator/']);
  const links = [
    { label: 'CFM calc', url: '/tools/cfm-calculator/' },
    { label: 'evil', url: 'javascript:alert(1)' },
    { label: 'external', url: 'https://evil.example.com/' },
    { label: 'protocol-relative', url: '//evil.example.com/' },
    { label: 'unknown page', url: '/not-a-real-page/' },
    { label: 'absolute own-origin', url: `${SITE_ORIGIN}/research/rb-008-cfm-requirements/` },
    { label: 'traversal', url: '/tools/../../etc/passwd' },
  ];
  const out = sanitizeLinks(links, validUrls);
  const urls = out.map((l) => l.url);
  assert.deepEqual(urls, ['/tools/cfm-calculator/', '/research/rb-008-cfm-requirements/']);
});

test('sanitizeLinks dedupes by resolved path and tolerates malformed input', () => {
  const validUrls = new Set(['/tools/cfm-calculator/']);
  const out = sanitizeLinks([
    { label: 'a', url: '/tools/cfm-calculator/' },
    { label: 'b', url: '/tools/cfm-calculator/' },
    { url: null },
    null,
    {},
  ], validUrls);
  assert.equal(out.length, 1);
  assert.deepEqual(sanitizeLinks(null, validUrls), []);
  assert.deepEqual(sanitizeLinks([], null), []);
});

const RAW_CORPUS = {
  questions: [{ url: '/questions/what-cfm-do-i-need/', title: 'Q', text: 'text with a number 1450' }],
  papers: [{
    url: '/research/rb-008-cfm-requirements/', title: 'RB-008', research_id: 'RB-008',
    summary: 's', facts: [{ section: '3.3', url: '/research/rb-008-cfm-requirements/#33-primary-answer', text: 'fact' }],
  }],
  tools: [{ url: '/tools/cfm-calculator/', title: 'T', summary: 's' }],
  methodology: [],
};

test('citableUrlSet includes page urls and fact anchors', async () => {
  const { flattenCorpus } = await import('../src/lib/corpus.mjs');
  const flat = flattenCorpus(RAW_CORPUS);
  const set = citableUrlSet(flat);
  assert.ok(set.has('/tools/cfm-calculator/'));
  assert.ok(set.has('/research/rb-008-cfm-requirements/#33-primary-answer'));
  assert.ok(set.has('/research/rb-008-cfm-requirements/'));
});

test('assembleCitations validates model citations against the corpus and drops invented urls', async () => {
  const { flattenCorpus } = await import('../src/lib/corpus.mjs');
  const flat = flattenCorpus(RAW_CORPUS);
  const citableSet = citableUrlSet(flat);

  const out = assembleCitations({
    modelCitations: [
      { rb: 'RB-008', section: '3.3', url: '/research/rb-008-cfm-requirements/#33-primary-answer' },
      { rb: 'FAKE', section: 'invented', url: 'https://evil.example.com/not-real' },
      { rb: 'ALSO-FAKE', url: '/this/page/does/not/exist/' },
    ],
    selectedEntries: [],
    citableSet,
  });

  assert.equal(out.length, 1);
  assert.equal(out[0].rb, 'RB-008');
  assert.equal(out[0].url, '/research/rb-008-cfm-requirements/#33-primary-answer');
});

test('assembleCitations falls back to selectedEntries when model gives nothing usable', async () => {
  const { flattenCorpus } = await import('../src/lib/corpus.mjs');
  const flat = flattenCorpus(RAW_CORPUS);
  const citableSet = citableUrlSet(flat);
  const fact = flat.find((c) => c.kind === 'fact');

  const out = assembleCitations({
    modelCitations: [],
    selectedEntries: [fact],
    citableSet,
  });

  assert.equal(out.length, 1);
  assert.equal(out[0].rb, 'RB-008');
  assert.equal(out[0].url, fact.url);
});

test('assembleCitations dedupes by url and caps at max', async () => {
  const { flattenCorpus } = await import('../src/lib/corpus.mjs');
  const flat = flattenCorpus(RAW_CORPUS);
  const citableSet = citableUrlSet(flat);
  const fact = flat.find((c) => c.kind === 'fact');

  const out = assembleCitations({
    modelCitations: [
      { rb: 'RB-008', url: fact.url },
      { rb: 'RB-008', url: fact.url },
    ],
    selectedEntries: [fact],
    citableSet,
    max: 1,
  });

  assert.equal(out.length, 1);
});
