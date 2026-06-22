/**
 * Viral Dojo → Sync backend (Cloudflare Worker + D1)
 *
 * Đăng nhập bằng ACCESS CODE (admin cấp) + đồng bộ workspace đa thiết bị.
 * - Code = bearer token, gửi qua header `x-dojo-code` (hoặc ?code= cho sendBeacon lúc unload).
 * - Conflict detection nguyên tử bằng cột `version` (CAS: UPDATE ... WHERE version=?).
 * - KHÔNG lưu API key của user (Gemini/Apify/Zernio) — key đó local-only ở client.
 *
 * Bindings (wrangler.toml):
 *   [[d1_databases]] binding = "DB"   → bảng accounts (xem schema.sql)
 * Secrets:
 *   ADMIN_TOKEN  (wrangler secret put ADMIN_TOKEN)   → bảo vệ endpoint /admin/*
 *
 * Deploy:  cd dojo-sync && wrangler deploy
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,x-dojo-code,x-admin-token',
  'Access-Control-Max-Age': '86400',
};
const json = (d, s) => new Response(JSON.stringify(d), { status: s || 200, headers: { 'Content-Type': 'application/json', ...CORS } });
const now = () => new Date().toISOString();

/** sinh access code ngẫu nhiên, dễ đọc (không nhầm 0/O, 1/l) */
function genCode() {
  const A = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const b = new Uint8Array(20);
  crypto.getRandomValues(b);
  let s = '';
  for (let i = 0; i < b.length; i++) { s += A[b[i] % A.length]; if (i % 5 === 4 && i < b.length - 1) s += '-'; }
  return 'VD-' + s; // ví dụ: VD-ABCDE-FGHJK-MNPQR-STUVW
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
    if (!env.DB) return json({ error: 'D1 chưa cấu hình (binding DB).' }, 500);

    const path = url.pathname;
    try {
      // ---------- ADMIN ----------
      if (path.startsWith('/admin/')) {
        const adm = (req.headers.get('x-admin-token') || '').trim();
        if (!env.ADMIN_TOKEN || adm !== env.ADMIN_TOKEN.trim()) return json({ error: 'Sai admin token.' }, 401);

        if (path === '/admin/codes' && req.method === 'POST') {
          const body = await req.json().catch(() => ({}));
          const name = (body.name || '').toString().slice(0, 120) || 'Tài khoản mới';
          let code = genCode();
          // tránh trùng (cực hiếm)
          for (let i = 0; i < 3; i++) {
            const ex = await env.DB.prepare('SELECT code FROM accounts WHERE code=?').bind(code).first();
            if (!ex) break; code = genCode();
          }
          await env.DB.prepare('INSERT INTO accounts (code,name,blob,version,created_at,updated_at) VALUES (?,?,NULL,0,?,?)')
            .bind(code, name, now(), now()).run();
          return json({ code, name });
        }
        if (path === '/admin/codes' && req.method === 'GET') {
          const r = await env.DB.prepare('SELECT code,name,version,updated_at FROM accounts ORDER BY created_at DESC').all();
          const accounts = (r.results || []).map(a => ({ code: a.code, name: a.name, version: a.version, updatedAt: a.updated_at }));
          return json({ accounts });
        }
        return json({ error: 'not found' }, 404);
      }

      // ---------- USER (cần access code) ----------
      const code = req.headers.get('x-dojo-code') || url.searchParams.get('code') || '';
      if (!code) return json({ error: 'Thiếu mã đăng nhập.' }, 401);
      const acc = await env.DB.prepare('SELECT code,name,blob,version FROM accounts WHERE code=?').bind(code).first();
      if (!acc) return json({ error: 'Mã không hợp lệ.' }, 401);

      if (path === '/auth' && req.method === 'POST') {
        return json({ ok: true, name: acc.name, version: acc.version });
      }

      if (path === '/pull' && req.method === 'GET') {
        return json({ blob: acc.blob ? JSON.parse(acc.blob) : null, version: acc.version, name: acc.name });
      }

      if (path === '/push' && req.method === 'POST') {
        const body = await req.json().catch(() => ({}));
        const base = Number(body.baseVersion);
        if (body.blob == null || !Number.isFinite(base)) return json({ error: 'Thiếu blob/baseVersion.' }, 400);
        const blobStr = JSON.stringify(body.blob);
        const next = acc.version + 1;
        // CAS nguyên tử: chỉ ghi khi version còn khớp baseVersion
        const r = await env.DB.prepare('UPDATE accounts SET blob=?, version=version+1, updated_at=? WHERE code=? AND version=?')
          .bind(blobStr, now(), code, base).run();
        const changed = (r.meta && r.meta.changes) || 0;
        if (changed === 1) return json({ ok: true, version: next });
        // xung đột: thiết bị khác đã push trước → trả bản server cho client xử lý
        return json({ conflict: true, serverBlob: acc.blob ? JSON.parse(acc.blob) : null, version: acc.version }, 409);
      }

      return json({ error: 'not found' }, 404);
    } catch (e) {
      return json({ error: String((e && e.message) || e) }, 502);
    }
  },
};
