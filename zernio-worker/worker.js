/**
 * Viral Dojo → Zernio CORS proxy (stateless · BYOK)
 *
 * Proxy "câm": KHÔNG lưu key nào ở server. Mỗi người dùng tự nhập API key Zernio
 * CỦA HỌ ở app; app gửi kèm header `x-zernio-key`, Worker chỉ chuyển tiếp lên Zernio
 * và thêm CORS (vì Zernio chặn gọi thẳng từ trình duyệt).
 *
 * Deploy 1 lần (không cần secret):  wrangler deploy
 * Ai dùng app cũng chung 1 proxy này — key của ai người đó tự giữ trong trình duyệt.
 */
const ZB = 'https://zernio.com/api/v1';
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,x-zernio-key',
  'Access-Control-Max-Age': '86400',
};
const json = (d, s) => new Response(JSON.stringify(d), { status: s || 200, headers: { 'Content-Type': 'application/json', ...CORS } });

export default {
  async fetch(req) {
    const url = new URL(req.url);
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });

    const key = req.headers.get('x-zernio-key') || '';
    if (!key) return json({ error: 'Thiếu x-zernio-key — nhập API key Zernio của bạn ở app.' }, 401);
    const auth = { Authorization: 'Bearer ' + key };

    try {
      if (url.pathname === '/accounts' && req.method === 'GET') {
        const r = await fetch(ZB + '/accounts?status=connected', { headers: auth });
        return json(await r.json(), r.status);
      }
      if (url.pathname === '/presign' && req.method === 'POST') {
        const r = await fetch(ZB + '/media/presign', { method: 'POST', headers: { ...auth, 'Content-Type': 'application/json' }, body: JSON.stringify(await req.json()) });
        return json(await r.json(), r.status);
      }
      if (url.pathname === '/schedule' && req.method === 'POST') {
        const r = await fetch(ZB + '/posts', { method: 'POST', headers: { ...auth, 'Content-Type': 'application/json' }, body: JSON.stringify(await req.json()) });
        return json(await r.json(), r.status);
      }
      return json({ error: 'not found' }, 404);
    } catch (e) {
      return json({ error: String((e && e.message) || e) }, 502);
    }
  },
};
