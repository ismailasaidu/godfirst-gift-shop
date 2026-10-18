import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const origin = 'https://godfirstgiftshopworldwide.com';
const staticPaths = ['/', '/shop', '/gift-finder', '/services', '/about', '/contact', '/faq', '/delivery-information', '/privacy-policy', '/terms'];
const xmlEscape = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&apos;' }[ch]));
const response = xml => new Response(xml, { status: 200, headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=300', 'x-content-type-options':'nosniff' } });
const safeLastmod = value => { try { const date = new Date(value?.toDate ? value.toDate() : value); return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0,10); } catch { return ''; } };

export default async function handler(request) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Method not allowed', { status:405, headers:{Allow:'GET, HEAD'} });
  const urls = new Map(staticPaths.map(path => [`${origin}${path}`, { loc:`${origin}${path}`, priority:path==='/'?'1.0':path==='/shop'?'0.9':'0.5', changefreq:path==='/shop'?'daily':'weekly' }]));
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (raw) {
    try {
      const serviceAccount = JSON.parse(raw);
      if (serviceAccount.private_key) serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      const app = getApps().length ? getApps()[0] : initializeApp({ credential:cert(serviceAccount), projectId:serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID });
      const snapshot = await getFirestore(app).collection('products').get();
      for (const doc of snapshot.docs) {
        const product = doc.data();
        if (product.published === false || Number(product.stock ?? 1) <= 0) continue;
        const loc = `${origin}/product/${encodeURIComponent(doc.id)}`;
        urls.set(loc, { loc, priority:product.featured ? '0.8' : '0.7', changefreq:'weekly', lastmod:product.updatedAt || product.createdAt || null });
      }
    } catch (error) { console.error('Sitemap product lookup failed; serving core routes only:', error?.message || error); }
  }
  const entries = [...urls.values()].map(item => `<url><loc>${xmlEscape(item.loc)}</loc><changefreq>${item.changefreq}</changefreq><priority>${item.priority}</priority>${safeLastmod(item.lastmod) ? `<lastmod>${safeLastmod(item.lastmod)}</lastmod>` : ''}</url>`).join('');
  return response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`);
}
