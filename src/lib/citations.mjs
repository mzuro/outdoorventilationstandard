// citations.mjs — link/citation sanitization for /api/ask and /api/explain.
//
// sanitizeLinks() is the exact logic from the ask-link-whitelist hotfix
// (PR #2, commit 4e066f3) — kept verbatim as the fallback path for the
// legacy markdown-link answer format. assembleCitations() is new: it
// builds the structured `citations: [{rb, section, url}]` shape (AI #6),
// and never trusts a URL the model invented — only URLs that resolve to
// a real, known page survive, exactly like sanitizeLinks does for the
// old format.

// Own origin — the only absolute-URL origin ever accepted from model output.
export const SITE_ORIGIN = 'https://outdoorventilationstandard.com';

/**
 * Given the ask response's proposed links (label/url pairs, where `url`
 * may originate from unsanitized model output) and the set of real site
 * page URLs (from the corpus), return only links that point at an actual
 * page on our own origin. See the ask-link-whitelist hotfix for the full
 * rationale; behavior is unchanged from that fix.
 */
export function sanitizeLinks(links, validUrls) {
  if (!Array.isArray(links) || !(validUrls instanceof Set)) return [];
  const out = [];
  const seen = new Set();

  for (const link of links) {
    if (!link || typeof link.url !== 'string') continue;
    const raw = link.url.trim();
    if (!raw) continue;

    let parsed;
    try {
      parsed = new URL(raw, SITE_ORIGIN);
    } catch (e) {
      continue;
    }

    if (parsed.origin !== SITE_ORIGIN) continue;

    const path = parsed.pathname;
    if (!validUrls.has(path)) continue;
    if (seen.has(path)) continue;
    seen.add(path);

    out.push({ label: typeof link.label === 'string' && link.label ? link.label : path, url: path });
  }

  return out;
}

/**
 * Build the set of citable paths from the flattened corpus: every
 * question/tool/methodology URL, every paper's base URL, and every
 * fact's own #anchor'd URL (papers.facts[].url already carries the
 * anchor, e.g. "/research/rb-008-cfm-requirements/#33-primary-answer...").
 */
export function citableUrlSet(flatCorpus) {
  const set = new Set();
  for (const c of flatCorpus || []) {
    if (!c || !c.url) continue;
    try {
      const parsed = new URL(c.url, SITE_ORIGIN);
      set.add(parsed.pathname + (parsed.hash || ''));
      set.add(parsed.pathname); // the un-anchored page is always citable too
    } catch (e) { /* skip malformed corpus entries */ }
  }
  return set;
}

function resolveCitablePath(rawUrl, citableSet) {
  if (typeof rawUrl !== 'string' || !rawUrl.trim()) return null;
  let parsed;
  try {
    parsed = new URL(rawUrl.trim(), SITE_ORIGIN);
  } catch (e) {
    return null;
  }
  if (parsed.origin !== SITE_ORIGIN) return null;
  const withHash = parsed.pathname + (parsed.hash || '');
  if (citableSet.has(withHash)) return withHash;
  if (citableSet.has(parsed.pathname)) return parsed.pathname;
  return null;
}

/**
 * Assemble the final `citations: [{rb, section, url}]` array for an ask
 * response. Model-proposed citations are validated against the corpus
 * (citableSet) and only kept if their url resolves to a real page/anchor
 * — this is the same "never trust a model-supplied URL" posture as
 * sanitizeLinks, generalized to the new shape. If the model gave none
 * (or all were dropped), fall back to citations derived directly from
 * the entries the worker actually fed the model (`selectedEntries`) —
 * always correct/grounded because they're our own data, never the
 * model's. Deduplicated by url, capped at `max`.
 */
export function assembleCitations({ modelCitations, selectedEntries, citableSet, max = 3 }) {
  const out = [];
  const seen = new Set();

  for (const c of modelCitations || []) {
    if (out.length >= max) break;
    if (!c || typeof c !== 'object') continue;
    const path = resolveCitablePath(c.url, citableSet);
    if (!path || seen.has(path)) continue;
    seen.add(path);
    out.push({
      rb: typeof c.rb === 'string' ? c.rb : null,
      section: typeof c.section === 'string' ? c.section : null,
      url: path,
    });
  }

  if (out.length === 0) {
    for (const e of selectedEntries || []) {
      if (out.length >= max) break;
      if (!e || !e.url) continue;
      const path = resolveCitablePath(e.url, citableSet);
      if (!path || seen.has(path)) continue;
      seen.add(path);
      out.push({
        rb: e.research_id || null,
        section: e.section || null,
        url: path,
      });
    }
  }

  return out;
}
