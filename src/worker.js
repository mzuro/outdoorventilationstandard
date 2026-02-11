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
