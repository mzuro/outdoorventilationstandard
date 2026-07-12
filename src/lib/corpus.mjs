// corpus.mjs — pure helpers over ai-context.json (AI #3 grounding upgrade).
//
// Nothing here touches `env`/`fetch`; the worker's buildContext() (in
// worker.js) is the only thing that fetches ai-context.json and calls into
// this module. Kept pure/dependency-free so it's directly node-testable.

const STOPWORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'do', 'does', 'did', 'to', 'of', 'in', 'on', 'for', 'and', 'or', 'but',
  'my', 'i', 'me', 'it', 'this', 'that', 'these', 'those', 'what', 'how',
  'why', 'when', 'where', 'which', 'who', 'with', 'at', 'by', 'from',
  'about', 'as', 'if', 'so', 'than', 'then', 'can', 'will', 'would',
  'should', 'could', 'have', 'has', 'had', 'not', 'no', 'yes', 'you',
  'your', 'need', 'needed', 'get', 'much', 'many', 'some', 'any',
]);

/** Lowercase, strip punctuation, split on whitespace, drop stopwords/short tokens. Pure. */
export function tokenize(text) {
  if (!text || typeof text !== 'string') return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9%'\s.-]/g, ' ')
    .split(/\s+/)
    .map((t) => t.replace(/^[.'-]+|[.'-]+$/g, ''))
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

/**
 * Flatten the three ai-context.json corpus sections into one list of
 * scoreable candidates. Each candidate keeps enough shape to become a
 * citation later: { kind, url, title, section, research_id, text }.
 *
 *   - questions -> one candidate per page, full text (they're short and
 *     already contain the site's canonical published numbers).
 *   - papers[].facts -> one candidate PER FACT (not per paper), so a
 *     question about CFM can surface exactly the RB-008 §3.3 fact
 *     without dragging in unrelated facts from the same paper.
 *   - papers[] (the paper itself) -> one lower-weight summary candidate,
 *     for coverage when no single fact scores well.
 *   - tools[] / methodology[] -> summary candidates (the worker's static
 *     tool-routing table in SYSTEM_PROMPT already handles routing; these
 *     exist so keyword scoring can still surface them on off-script phrasing).
 */
export function flattenCorpus(raw) {
  if (!raw || typeof raw !== 'object') return [];
  const out = [];

  for (const q of raw.questions || []) {
    if (!q || !q.url || !q.text) continue;
    out.push({
      kind: 'question', url: q.url, title: q.title || '', section: null,
      research_id: null, text: q.text, weight: 1.25,
    });
  }

  for (const p of raw.papers || []) {
    if (!p || !p.url) continue;
    for (const f of p.facts || []) {
      if (!f || !f.text) continue;
      out.push({
        kind: 'fact', url: f.url || p.url, title: p.title || '',
        section: f.section || null, research_id: p.research_id || null,
        text: f.text, weight: 1.1,
      });
    }
    if (p.summary) {
      out.push({
        kind: 'paper-summary', url: p.url, title: p.title || '',
        section: null, research_id: p.research_id || null,
        text: p.summary, weight: 0.7,
      });
    }
  }

  for (const t of raw.tools || []) {
    if (!t || !t.url || !t.summary) continue;
    out.push({
      kind: 'tool', url: t.url, title: t.title || '', section: null,
      research_id: null, text: t.summary, weight: 0.6,
    });
  }

  for (const m of raw.methodology || []) {
    if (!m || !m.url || !m.summary) continue;
    out.push({
      kind: 'methodology', url: m.url, title: m.title || '', section: null,
      research_id: null, text: m.summary, weight: 0.5,
    });
  }

  return out;
}

/**
 * Score one candidate against a query's token set. Pure term-overlap
 * scoring — no embeddings infra (40-page corpus doesn't need it):
 * distinct query terms found anywhere in (title + section + text),
 * weighted by the candidate's kind weight, with a small bonus for a
 * literal research_id mention (e.g. "RB-008" in the question).
 */
export function scoreCandidate(queryTerms, candidate) {
  if (!queryTerms.length) return 0;
  const haystack = tokenize(`${candidate.title} ${candidate.section || ''} ${candidate.text}`);
  const haySet = new Set(haystack);
  let hits = 0;
  for (const t of new Set(queryTerms)) {
    if (haySet.has(t)) hits += 1;
  }
  if (hits === 0) return 0;
  let score = hits * (candidate.weight || 1);
  if (candidate.research_id) {
    const ridToken = candidate.research_id.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normalizedQuery = queryTerms.join(' ').replace(/[^a-z0-9]/g, ' ');
    if (normalizedQuery.includes(ridToken)) score += 1;
  }
  return score;
}

/**
 * Top-k candidate selection for a question, capped by both count and a
 * total character budget (keeps the prompt small regardless of how many
 * candidates tie for a high score). Pure — corpus is already flattened.
 */
export function selectTopK(corpus, question, { k = 6, maxChars = 6000 } = {}) {
  const queryTerms = tokenize(question);
  if (!queryTerms.length || !Array.isArray(corpus)) return [];

  const scored = corpus
    .map((c) => ({ ...c, score: scoreCandidate(queryTerms, c) }))
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score);

  const selected = [];
  let chars = 0;
  for (const c of scored) {
    if (selected.length >= k) break;
    const cost = (c.text || '').length;
    if (selected.length > 0 && chars + cost > maxChars) continue;
    selected.push(c);
    chars += cost;
  }
  return selected;
}

/** Render selected candidates into the system-prompt context block. Pure. */
export function buildContextText(selected) {
  if (!selected || selected.length === 0) return '';
  return selected
    .map((c) => {
      const heading = c.section ? `${c.title} — ${c.section}` : c.title;
      return `## ${heading} (${c.url})\n${c.text}`;
    })
    .join('\n\n');
}
