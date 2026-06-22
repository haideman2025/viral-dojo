/**
 * Viral Dojo → Zernio proxy (Cloudflare Worker)
 *
 * Giữ API key Zernio ở server (secret), mở CORS cho trang Viral Dojo,
 * chuyển tiếp 3 việc: liệt kê tài khoản, xin URL upload (presign), đặt lịch bài đăng.
 *
 * Secrets (đặt bằng: wrangler secret put ...):
 *   ZERNIO_API_KEY  — key sk_... lấy ở Zernio → Settings → API Keys
 *   APP_TOKEN       — chuỗi bí mật tự đặt, dán y hệt vào Viral Dojo (chống người lạ gọi Worker)
 * Vars (trong wrangler.jsonc):
 *   ALLOWED_ORIGIN  — origin trang của bạn, vd https://haideman2025.github.io ("*" để mở hết)
 */
const ZB = 'https://zernio.com/api/v1';

function corsHeaders(env) {
  return {
    'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,x-app-token',
    'Access-Control-Max-Age': '86400',
  };
}
function json(data, status, env) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(env) },
  });
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(env) });

    // cổng token chia sẻ — chặn người lạ dùng Worker của bạn
    if ((req.headers.get('x-app-token') || '') !== (env.APP_TOKEN || '')) return json({ error: 'unauthorized' }, 401, env);
    if (!env.ZERNIO_API_KEY) return json({ error: 'server thiếu ZERNIO_API_KEY' }, 500, env);
    const auth = { Authorization: 'Bearer ' + env.ZERNIO_API_KEY };

    try {
      // 1) Liệt kê tài khoản đã nối
      if (url.pathname === '/accounts' && req.method === 'GET') {
        const r = await fetch(ZB + '/accounts?status=connected', { headers: auth });
        return json(await r.json(), r.status, env);
      }
      // 2) Xin URL upload trực tiếp lên cloud (presign) — file PUT thẳng từ trình duyệt, không qua Worker
      if (url.pathname === '/presign' && req.method === 'POST') {
        const body = await req.json(); // { filename, contentType, size }
        const r = await fetch(ZB + '/media/presign', {
          method: 'POST', headers: { ...auth, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        });
        return json(await r.json(), r.status, env);
      }
      // 3) Tạo / đặt lịch bài đăng
      if (url.pathname === '/schedule' && req.method === 'POST') {
        const body = await req.json(); // { content, mediaItems, platforms, scheduledFor, timezone, publishNow }
        const r = await fetch(ZB + '/posts', {
          method: 'POST', headers: { ...auth, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        });
        return json(await r.json(), r.status, env);
      }
      return json({ error: 'not found' }, 404, env);
    } catch (e) {
      return json({ error: String((e && e.message) || e) }, 502, env);
    }
  },
};
