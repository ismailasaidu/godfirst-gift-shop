const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
export default async request => {
  if (request.method !== 'POST') return json(405, { error: 'Method not allowed.' });
  let body; try { body = await request.json(); } catch { return json(400, { error: 'Invalid request.' }); }
  const message = String(body?.message || '').trim().slice(0, 2000);
  const history = Array.isArray(body?.history) ? body.history.slice(-10).map(m => ({ role: m?.role === 'assistant' ? 'assistant' : 'user', content: String(m?.content || '').slice(0, 1200) })).filter(m => m.content) : [];
  const products = Array.isArray(body?.products) ? body.products.slice(0, 150).map(p => ({ id: String(p.id || '').slice(0, 100), name: String(p.name || '').slice(0, 160), description: String(p.description || '').slice(0, 500), category: String(p.category || '').slice(0, 100), price: Number(p.price), stock: Number(p.stock), image: String(p.image || '').slice(0, 1000) })).filter(p => p.id && p.name && Number.isFinite(p.price) && p.stock > 0) : [];
  if (!message) return json(400, { error: 'Enter a message.' });
  const key = process.env.OPENAI_API_KEY;
  if (!key) return json(503, { error: 'AI is not configured yet. The storefront will use local catalogue suggestions instead.' });
  try {
    const systemPrompt = `You are God First Gift Shop Worldwide's capable general-purpose AI assistant, with special expertise in thoughtful gifting and this store. Help with everyday questions, learning, explanations, brainstorming, planning, writing, editing, coding, debugging, calculations, comparisons, organisation, and step-by-step troubleshooting—not only shopping. Use conversation history for follow-ups. For shop questions, treat the supplied current catalogue as the source of truth and recommend only listed products. Never invent product details, prices, stock, promotions, delivery promises, store policies, order/payment status, or actions completed. You cannot change accounts, send emails, modify orders, access private customer records, issue refunds, place orders, or make payments. For order tracking, direct customers to Track Order and tell them to keep their reference. Never request passwords, card details, PINs or one-time codes. For general questions, answer helpfully and flag uncertainty. If a store fact is missing, say so rather than guessing. Checkout uses Paystack; if a confirmation email does not arrive, keep the Paystack reference and contact support rather than paying again. Delivery availability, cost and timing depend on destination and product and must be confirmed. When recommending products, append exact catalogue IDs on a final line formatted PRODUCT_IDS: id1,id2 (only IDs present in the catalogue; maximum 3). Omit PRODUCT_IDS if no catalogue items are recommended. Current catalogue JSON: ${JSON.stringify(products)}`;
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: message }
    ];
    const requestedModel = String(process.env.OPENAI_MODEL || 'gpt-4.1').trim();
    const models = [...new Set([requestedModel, 'gpt-4o-mini', 'gpt-4.1-mini'])];
    let response, data = {};
    for (const model of models) {
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
        body: JSON.stringify({ model, messages, max_tokens: 1800, temperature: 0.6 }),
        signal: AbortSignal.timeout(25000)
      });
      data = await response.json().catch(() => ({}));
      if (response.ok) break;
      const status = response.status;
      const apiCode = String(data?.error?.code || '');
      console.error('OpenAI gift assistant request failed:', model, status, apiCode, String(data?.error?.message || '').slice(0, 200));
      // Retry a supported fallback model for model/access errors, but do not retry bad keys or exhausted quota.
      if (![400, 404].includes(status) || model === models[models.length - 1]) break;
    }
    if (!response.ok) { const apiCode=String(data?.error?.code||''); console.error('Gift assistant provider failure:', response.status, apiCode); return json(502, { error: 'The full assistant is temporarily unavailable. Please try again later.', code: `openai_http_${response.status}` }); }
    const text = String(data.choices?.[0]?.message?.content || '').trim();
    const match = text.match(/PRODUCT_IDS:\s*([\w., -]*)/i);
    const productIds = match ? match[1].split(',').map(id => id.trim()).filter(id => products.some(p => p.id === id)).slice(0, 3) : [];
    const reply = text.replace(/\n?PRODUCT_IDS:\s*[\w., -]*/i, '').trim().slice(0, 1600) || 'Tell me who the gift is for, the occasion and your budget, and I’ll help you narrow it down.';
    return json(200, { reply, productIds });
  } catch (error) { console.error('Gift assistant request failed:', error?.message || error); return json(502, { error: 'AI service is temporarily unavailable.' }); }
};
