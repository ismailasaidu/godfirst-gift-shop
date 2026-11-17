export default async () => {
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/NGN', { headers: { accept: 'application/json' } });
    if (!response.ok) throw new Error(`Exchange-rate provider returned ${response.status}`);
    const payload = await response.json();
    if (payload.result !== 'success' || !payload.rates || !Number.isFinite(Number(payload.rates.USD))) throw new Error('Exchange-rate response was incomplete');
    return new Response(JSON.stringify({ base: 'NGN', rates: payload.rates, providerUpdatedAt: payload.time_last_update_utc || null, fetchedAt: new Date().toISOString() }), {
      status: 200, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=21600, stale-while-revalidate=86400', 'access-control-allow-origin': '*' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Exchange rates are temporarily unavailable', message: error.message }), { status: 503, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
  }
};
