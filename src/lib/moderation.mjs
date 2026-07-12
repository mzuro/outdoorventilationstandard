// moderation.mjs — pre-model content filter + model-output parsing.
//
// BLOCKED_PATTERNS trims the /hack(?:ing|er)/i entry from the original
// list (AI expert report §2.1-5): it false-positived on plausible on-topic
// questions like "any hacks for reducing smoke?". Defense-in-depth ahead
// of the on-topic-only model stays; the OFF_TOPIC path handles the rest.

export const BLOCKED_PATTERNS = [
  /porn/i, /xxx/i, /sex(?:ual|ting|y)/i, /nude/i, /naked/i, /hentai/i,
  /fuck/i, /shit(?!ake)/i, /ass(?:hole)/i, /bitch/i, /dick(?!ens)/i,
  /kill\s+(?:people|someone|myself)/i, /bomb\s+(?:making|build)/i,
  /crack(?:ing|ed)\s+(?:password|account)/i,
  /(?:buy|sell)\s+(?:drugs|guns|weapons)/i,
  /credit\s*card\s*(?:number|steal)/i,
  /social\s*security/i,
];

export function isBlockedInput(text) {
  return BLOCKED_PATTERNS.some((pattern) => pattern.test(text));
}

/**
 * Parse the model's raw response text into a structured shape. Tries
 * strict JSON first (the model is prompted to return
 * {answer, citations, followups, off_topic}); on any parse failure,
 * falls back to the legacy contract this replaces — an OFF_TOPIC
 * sentinel check plus markdown-link scraping — so a model that ignores
 * the JSON instruction still degrades to a working (if unstructured)
 * answer instead of a hard error. This is the "structured JSON off-topic
 * flag, replacing brittle string sniffing" hardening (AI #4): the
 * sniffing only runs as a fallback now, never as the primary check.
 */
export function parseModelResponse(rawText) {
  const text = typeof rawText === 'string' ? rawText : '';
  const jsonCandidate = extractJsonCandidate(text);
  if (jsonCandidate) {
    try {
      const parsed = JSON.parse(jsonCandidate);
      if (parsed && typeof parsed === 'object' && typeof parsed.answer === 'string') {
        return {
          structured: true,
          offTopic: parsed.off_topic === true,
          // W3 review MINOR-1: on the structured path the model is told to
          // put links in `citations`, not the answer — but a non-compliant
          // model can still embed [label](url) markdown in `answer`, which
          // the client renders via textContent as inert raw-URL noise.
          // Strip the syntax, keep the label; the citations array (which
          // is whitelist-validated downstream) is the only link channel.
          answer: stripMarkdownLinks(parsed.answer),
          citations: Array.isArray(parsed.citations) ? parsed.citations : [],
          followups: Array.isArray(parsed.followups)
            ? parsed.followups.filter((f) => typeof f === 'string' && f.trim()).slice(0, 3).map((f) => f.trim().slice(0, 140))
            : [],
        };
      }
    } catch (e) { /* fall through to legacy parse */ }
  }

  // --- legacy fallback: OFF_TOPIC sentinel + markdown-link scraping ---
  const trimmed = text.trim();
  if (trimmed === 'OFF_TOPIC' || trimmed.includes('OFF_TOPIC')) {
    return { structured: false, offTopic: true, answer: '', citations: [], followups: [] };
  }

  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links = [];
  const seenUrls = new Set();
  let match;
  while ((match = linkRegex.exec(text)) !== null) {
    if (!seenUrls.has(match[2])) {
      seenUrls.add(match[2]);
      links.push({ label: match[1], url: match[2] });
    }
  }
  let answerBody = text.replace(linkRegex, '').trim();
  answerBody = answerBody.replace(/\n\s*\n/g, '\n').trim();

  return {
    structured: false,
    offTopic: false,
    answer: answerBody,
    citations: links.map((l) => ({ rb: null, section: null, url: l.url, label: l.label })),
    followups: [],
  };
}

/** Replace [label](url) markdown links with just their label text. */
function stripMarkdownLinks(text) {
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
}

/** Strip a ```json fenced block if present; otherwise return the trimmed text if it looks like an object. */
function extractJsonCandidate(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) return fenced[1].trim();
  const trimmed = text.trim();
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) return trimmed;
  return null;
}
