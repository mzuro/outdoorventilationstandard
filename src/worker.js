// Module-level cache for AI context (refreshes when Worker instance recycles)
let cachedContext = null;
let cachedPages = null;

async function buildContext(env) {
  if (cachedContext) return { context: cachedContext, pages: cachedPages };

  try {
    const res = await env.ASSETS.fetch(new Request('https://dummy/index.json'));
    const pages = await res.json();

    const relevant = pages.filter(p =>
      p.url.startsWith('/research/') || p.url.startsWith('/tools/') || p.url === '/methodology/'
    );

    cachedPages = relevant;
    cachedContext = relevant.map(p =>
      `- ${p.title} (${p.url}): ${p.description || ''}`
    ).join('\n');

    return { context: cachedContext, pages: cachedPages };
  } catch (e) {
    return { context: null, pages: null };
  }
}

async function checkRateLimit(ip, env) {
  if (!env.QUESTION_CLICKS) return true;
  const bucket = Math.floor(Date.now() / 60000);
  const key = `ratelimit:${ip}:${bucket}`;
  const current = parseInt(await env.QUESTION_CLICKS.get(key) || '0');
  if (current >= 10) return false;
  await env.QUESTION_CLICKS.put(key, String(current + 1), { expirationTtl: 120 });
  return true;
}

const SYSTEM_PROMPT = `You are a research assistant for the Outdoor Ventilation Standard, a physics-based research program about outdoor cooking ventilation and BBQ range hoods.

Answer the user's question using ONLY the research context provided below. Be concise: 2-3 sentences maximum. Use plain language suitable for a homeowner.

After your answer, list 1-3 most relevant pages from the context as links. Format each link on its own line as: [Page Title](url)

If the question is not related to outdoor cooking ventilation, BBQ hoods, or the topics covered in the research, respond with exactly: "OFF_TOPIC"

Research context:
`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // API: track question clicks (requires KV binding)
    if (url.pathname === '/api/track' && request.method === 'POST') {
      try {
        if (!env.QUESTION_CLICKS) {
          return new Response(JSON.stringify({ ok: true, note: 'tracking not configured' }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
        const { question_id, text } = await request.json();
        if (!question_id) {
          return new Response(JSON.stringify({ error: 'missing question_id' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const key = `clicks:${question_id}`;
        const current = parseInt(await env.QUESTION_CLICKS.get(key) || '0');
        await env.QUESTION_CLICKS.put(key, String(current + 1));

        if (question_id === 'custom' && text) {
          const customKey = `custom:${Date.now()}`;
          await env.QUESTION_CLICKS.put(customKey, text);
        }

        return new Response(JSON.stringify({ ok: true }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: 'invalid request' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // API: AI-powered question answering
    if (url.pathname === '/api/ask' && request.method === 'POST') {
      try {
        // Rate limiting
        const ip = request.headers.get('cf-connecting-ip') || 'unknown';
        const allowed = await checkRateLimit(ip, env);
        if (!allowed) {
          return new Response(JSON.stringify({ error: 'rate_limited' }), {
            status: 429,
            headers: { 'Content-Type': 'application/json', 'Retry-After': '60' }
          });
        }

        const body = await request.json();
        const question = body.question;
        if (!question || typeof question !== 'string' || question.length > 500) {
          return new Response(JSON.stringify({ error: 'invalid_question' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // Honeypot check — bots fill this hidden field, humans don't
        if (body.website) {
          return new Response(JSON.stringify({ error: 'bot_detected' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // Turnstile verification
        if (env.TURNSTILE_SECRET) {
          const cfToken = body.cf_token || '';
          const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${encodeURIComponent(env.TURNSTILE_SECRET)}&response=${encodeURIComponent(cfToken)}&remoteip=${encodeURIComponent(ip)}`
          });
          const verifyData = await verifyRes.json();
          if (!verifyData.success) {
            return new Response(JSON.stringify({ error: 'turnstile_failed' }), {
              status: 403,
              headers: { 'Content-Type': 'application/json' }
            });
          }
        }

        if (!env.AI) {
          return new Response(JSON.stringify({ error: 'ai_not_configured' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const { context } = await buildContext(env);
        if (!context) {
          return new Response(JSON.stringify({ error: 'context_unavailable' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
          messages: [
            { role: 'system', content: SYSTEM_PROMPT + context },
            { role: 'user', content: question }
          ],
          max_tokens: 300,
          temperature: 0.3
        });

        const responseText = aiResponse.response || '';

        // Off-topic check
        if (responseText.trim() === 'OFF_TOPIC' || responseText.includes('OFF_TOPIC')) {
          return new Response(JSON.stringify({
            answer: 'This site covers outdoor cooking ventilation physics \u2014 BBQ hood sizing, plume behavior, wind effects, and related topics. Try asking about one of those!',
            links: [
              { label: 'Browse all research', url: '/research/' },
              { label: 'Explore tools', url: '/tools/' }
            ],
            source: 'ai',
            off_topic: true
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // Parse markdown links from the response
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        const links = [];
        let match;
        while ((match = linkRegex.exec(responseText)) !== null) {
          links.push({ label: match[1], url: match[2] });
        }

        // Remove link lines from the answer text
        let answerBody = responseText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '').trim();
        answerBody = answerBody.replace(/\n\s*\n/g, '\n').trim();

        return new Response(JSON.stringify({
          answer: answerBody,
          links: links.length > 0 ? links : [
            { label: 'Browse all research', url: '/research/' },
            { label: 'Explore tools', url: '/tools/' }
          ],
          source: 'ai'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });

      } catch (e) {
        return new Response(JSON.stringify({ error: 'ai_failed' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // API: read click stats (requires KV + admin token)
    if (url.pathname === '/api/stats' && request.method === 'GET') {
      if (!env.QUESTION_CLICKS || !env.ADMIN_TOKEN) {
        return new Response('Not configured', { status: 503 });
      }
      const token = url.searchParams.get('token');
      if (token !== env.ADMIN_TOKEN) {
        return new Response('Unauthorized', { status: 401 });
      }

      const list = await env.QUESTION_CLICKS.list({ prefix: 'clicks:' });
      const stats = {};
      for (const key of list.keys) {
        const val = await env.QUESTION_CLICKS.get(key.name);
        stats[key.name.replace('clicks:', '')] = parseInt(val || '0');
      }

      return new Response(JSON.stringify(stats, null, 2), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Everything else: serve static assets
    return env.ASSETS.fetch(request);
  }
};
