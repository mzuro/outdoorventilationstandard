// explain-ui.mjs — client wiring for the "Explain this configuration"
// button (AI #7). Mounted per-instrument by partials/instrument-figure.html
// for id "i01"/"i02" only. No free text ever leaves the browser: the only
// payload is {instrument, params} read straight from the instrument's own
// live control state via the handle each instrument module exposes as
// `figureEl.ovsInstrument` (see static/js/ovs/instruments/i01.mjs / i02.mjs).
//
// Per-instrument param key -> plain param name, matching src/lib/params.mjs
// SCHEMAS server-side.
const PARAM_MAP = {
  i01: { 'i01-wind': 'wind', 'i01-width': 'width', 'i01-mount': 'mount', 'i01-panels': 'panels' },
  i02: { 'i02-width': 'width', 'i02-mount': 'mount', 'i02-exposure': 'exposure', 'i02-btu': 'btu' },
};

const TURNSTILE_SITEKEY = '0x4AAAAAACcaq_joFScewE6d';
const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

function ensureTurnstileScript() {
  if (document.querySelector('script[src^="' + TURNSTILE_SRC.split('?')[0] + '"]')) return;
  const s = document.createElement('script');
  s.src = TURNSTILE_SRC;
  s.defer = true;
  document.head.appendChild(s);
}

function extractParams(instrument, figureEl) {
  const inst = figureEl.ovsInstrument;
  if (!inst || typeof inst.get !== 'function') return null;
  const state = inst.get();
  const map = PARAM_MAP[instrument];
  const params = {};
  for (const [stateKey, paramName] of Object.entries(map)) {
    params[paramName] = state[stateKey];
  }
  return params;
}

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

function renderResult(resultEl, data) {
  const citationsHtml = (data.citations || [])
    .map((c) => '<a class="ovs-chip ovs-chip--accent" href="' + encodeURI(c.url) + '">' + escapeHtml(c.rb || c.url) + '</a>')
    .join('');
  resultEl.innerHTML =
    '<p class="ovs-explain-text">' + escapeHtml(data.explanation) + '</p>' +
    '<div class="ovs-explain-citations">' + citationsHtml + '</div>';
  resultEl.hidden = false;
}

export function wireExplain(instrument) {
  const blocks = document.querySelectorAll('[data-explain-for="' + instrument + '"]');
  if (!blocks.length) return;

  ensureTurnstileScript();

  blocks.forEach((block) => {
    const btn = block.querySelector('.ovs-explain-btn');
    const resultEl = block.querySelector('.ovs-explain-result');
    const honey = block.querySelector('.ovs-explain-honey');
    const turnstileContainer = block.querySelector('.ovs-explain-turnstile');
    if (!btn || !resultEl) return;

    // Figure element carrying data-instrument="i01"/"i02" is the previous
    // sibling in the DOM (instrument-figure.html renders <figure> then
    // this block immediately after it).
    const figureEl = block.previousElementSibling;

    let turnstileToken = null;
    let turnstileWidgetId = null;
    function initTurnstile() {
      if (!turnstileContainer || turnstileWidgetId) return;
      if (typeof window.turnstile === 'undefined') {
        setTimeout(initTurnstile, 150);
        return;
      }
      turnstileWidgetId = window.turnstile.render(turnstileContainer, {
        sitekey: TURNSTILE_SITEKEY,
        size: 'invisible',
        callback: function(token) { turnstileToken = token; },
      });
    }
    initTurnstile();

    btn.addEventListener('click', function() {
      if (!figureEl || !figureEl.ovsInstrument) return;
      const params = extractParams(instrument, figureEl);
      if (!params) return;

      btn.disabled = true;
      resultEl.hidden = false;
      resultEl.innerHTML = '<span class="ovs-ask-loading"><span class="ovs-spinner"></span> Narrating...</span>';

      fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instrument: instrument,
          params: params,
          cf_token: turnstileToken || '',
          website: honey ? honey.value : '',
        }),
      })
        .then(function(r) {
          if (!r.ok) throw new Error('explain_failed');
          return r.json();
        })
        .then(function(data) {
          if (data.error) throw new Error(data.error);
          renderResult(resultEl, data);
          btn.disabled = false;
        })
        .catch(function() {
          resultEl.innerHTML = '<p class="ovs-explain-text">Explanation is temporarily unavailable. The instrument’s numbers above are unaffected — only the narration failed to load.</p>';
          btn.disabled = false;
        })
        .finally(function() {
          if (typeof window.turnstile !== 'undefined' && turnstileWidgetId) {
            turnstileToken = null;
            window.turnstile.reset(turnstileWidgetId);
          }
        });
    });
  });
}
