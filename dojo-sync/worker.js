/**
 * Viral Dojo → Sync backend (Cloudflare Worker + D1)
 *
 * Đăng nhập bằng ACCESS CODE (admin cấp) + đồng bộ workspace đa thiết bị.
 * - Code = bearer token, gửi qua header `x-dojo-code` (hoặc ?code= cho sendBeacon lúc unload).
 * - Conflict detection nguyên tử bằng cột `version` (CAS: UPDATE ... WHERE version=?).
 * - KHÔNG lưu API key của user (Gemini/Apify/Zernio) — key đó local-only ở client.
 * - Tracking: cột last_seen (mỗi auth/pull/push) + pushes → trang admin thống kê user hoạt động.
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

/** migration idempotent: thêm cột tracking nếu chưa có (chạy ở admin, rẻ vì admin hiếm) */
async function ensureSchema(env) {
  const cols = [
    "ALTER TABLE accounts ADD COLUMN last_seen TEXT",
    "ALTER TABLE accounts ADD COLUMN plan TEXT DEFAULT 'life'",
    "ALTER TABLE accounts ADD COLUMN note TEXT",
    "ALTER TABLE accounts ADD COLUMN pushes INTEGER DEFAULT 0",
    "ALTER TABLE accounts ADD COLUMN expires_at TEXT",   // NULL = trọn đời; có giá trị = hết hạn (dùng thử)
  ];
  for (const sql of cols) { try { await env.DB.prepare(sql).run(); } catch (e) { /* duplicate column → bỏ qua */ } }
  try { await env.DB.prepare("CREATE TABLE IF NOT EXISTS leads (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, phone TEXT, email TEXT, code TEXT, source TEXT, created_at TEXT)").run(); } catch (e) {}
  try { await env.DB.prepare("CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT)").run(); } catch (e) {}
}
/** đọc plan + expires_at an toàn (cột có thể chưa migrate) */
async function accMeta(env, code) {
  try { const r = await env.DB.prepare('SELECT plan,expires_at FROM accounts WHERE code=?').bind(code).first(); return { plan: (r && r.plan) || 'life', expiresAt: (r && r.expires_at) || null }; }
  catch (e) { return { plan: 'life', expiresAt: null }; }
}
async function getSetting(env, key) { try { const r = await env.DB.prepare('SELECT value FROM settings WHERE key=?').bind(key).first(); return r && r.value; } catch (e) { return null; } }

/** ghi nhận hoạt động — KHÔNG được làm vỡ sync nếu cột chưa migrate */
async function touch(env, code, isPush) {
  try {
    if (isPush) await env.DB.prepare('UPDATE accounts SET last_seen=?, pushes=COALESCE(pushes,0)+1 WHERE code=?').bind(now(), code).run();
    else await env.DB.prepare('UPDATE accounts SET last_seen=? WHERE code=?').bind(now(), code).run();
  } catch (e) { /* cột last_seen chưa tồn tại → bỏ qua tới khi admin mở (ensureSchema) */ }
}

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
    if (!env.DB) return json({ error: 'D1 chưa cấu hình (binding DB).' }, 500);

    const path = url.pathname;
    try {
      // ---------- ADMIN ----------
      if (path.startsWith('/admin/')) {
        const adm = (req.headers.get('x-admin-token') || '').trim();
        if (!env.ADMIN_TOKEN || adm !== env.ADMIN_TOKEN.trim()) return json({ error: 'Sai admin token.' }, 401);
        await ensureSchema(env); // đảm bảo cột tracking tồn tại

        // Tạo mã mới
        if (path === '/admin/codes' && req.method === 'POST') {
          const body = await req.json().catch(() => ({}));
          const name = (body.name || '').toString().slice(0, 120) || 'Tài khoản mới';
          const plan = (body.plan || 'life').toString().slice(0, 20);
          const note = (body.note || '').toString().slice(0, 300);
          let code = genCode();
          for (let i = 0; i < 3; i++) {
            const ex = await env.DB.prepare('SELECT code FROM accounts WHERE code=?').bind(code).first();
            if (!ex) break; code = genCode();
          }
          await env.DB.prepare('INSERT INTO accounts (code,name,blob,version,created_at,updated_at,last_seen,plan,note,pushes) VALUES (?,?,NULL,0,?,?,NULL,?,?,0)')
            .bind(code, name, now(), now(), plan, note).run();
          return json({ code, name, plan, note });
        }

        // Tổng quan: thống kê + danh sách user đầy đủ
        if ((path === '/admin/overview' || path === '/admin/codes') && req.method === 'GET') {
          const r = await env.DB.prepare(
            'SELECT code,name,version,created_at,updated_at,last_seen,plan,note,pushes FROM accounts ORDER BY COALESCE(last_seen,updated_at,created_at) DESC'
          ).all();
          const rows = r.results || [];
          const t = Date.now();
          const H = 3600e3, D = 24 * H;
          const within = (ts, ms) => ts && (t - Date.parse(ts)) <= ms && (t - Date.parse(ts)) >= 0;
          const accounts = rows.map(a => ({
            code: a.code, name: a.name, version: a.version,
            createdAt: a.created_at, updatedAt: a.updated_at, lastSeen: a.last_seen || null,
            plan: a.plan || 'life', note: a.note || '', pushes: a.pushes || 0,
            active: within(a.last_seen, D), used: !!a.last_seen || (a.version > 0),
          }));
          const stats = {
            total: accounts.length,
            activated: accounts.filter(a => a.used).length,           // đã từng dùng (có sync)
            online1h: accounts.filter(a => within(a.lastSeen, H)).length,
            active24h: accounts.filter(a => within(a.lastSeen, D)).length,
            active7d: accounts.filter(a => within(a.lastSeen, 7 * D)).length,
            active30d: accounts.filter(a => within(a.lastSeen, 30 * D)).length,
            new24h: accounts.filter(a => within(a.createdAt, D)).length,
            new7d: accounts.filter(a => within(a.createdAt, 7 * D)).length,
            neverUsed: accounts.filter(a => !a.used).length,
            totalPushes: accounts.reduce((s, a) => s + (a.pushes || 0), 0),
            serverTime: now(),
          };
          return json({ stats, accounts });
        }

        // Sửa user (đổi tên / ghi chú / plan)
        if (path === '/admin/code/update' && req.method === 'POST') {
          const b = await req.json().catch(() => ({}));
          if (!b.code) return json({ error: 'Thiếu code.' }, 400);
          const sets = [], vals = [];
          if (b.name != null) { sets.push('name=?'); vals.push(String(b.name).slice(0, 120)); }
          if (b.note != null) { sets.push('note=?'); vals.push(String(b.note).slice(0, 300)); }
          if (b.plan != null) { sets.push('plan=?'); vals.push(String(b.plan).slice(0, 20)); }
          if (!sets.length) return json({ error: 'Không có gì để sửa.' }, 400);
          vals.push(b.code);
          const r = await env.DB.prepare(`UPDATE accounts SET ${sets.join(',')} WHERE code=?`).bind(...vals).run();
          return json({ ok: true, changed: (r.meta && r.meta.changes) || 0 });
        }

        // Xoá / thu hồi mã
        if (path === '/admin/code/delete' && req.method === 'POST') {
          const b = await req.json().catch(() => ({}));
          if (!b.code) return json({ error: 'Thiếu code.' }, 400);
          const r = await env.DB.prepare('DELETE FROM accounts WHERE code=?').bind(b.code).run();
          return json({ ok: true, deleted: (r.meta && r.meta.changes) || 0 });
        }

        // Gia hạn / đặt ngày hết hạn cho mã (vd biến dùng thử thành trọn đời: days=null)
        if (path === '/admin/code/expiry' && req.method === 'POST') {
          const b = await req.json().catch(() => ({}));
          if (!b.code) return json({ error: 'Thiếu code.' }, 400);
          const exp = (b.days == null || b.days === '') ? null : new Date(Date.now() + Number(b.days) * 86400e3).toISOString();
          await env.DB.prepare('UPDATE accounts SET expires_at=?, plan=? WHERE code=?').bind(exp, exp ? 'trial' : 'life', b.code).run();
          return json({ ok: true, expiresAt: exp });
        }

        // Danh sách lead đăng ký dùng thử
        if (path === '/admin/leads' && req.method === 'GET') {
          const r = await env.DB.prepare('SELECT l.id,l.name,l.phone,l.email,l.code,l.source,l.created_at, a.expires_at, a.last_seen FROM leads l LEFT JOIN accounts a ON a.code=l.code ORDER BY l.created_at DESC LIMIT 1000').all();
          const leads = (r.results || []).map(x => ({ id: x.id, name: x.name, phone: x.phone, email: x.email, code: x.code, source: x.source, createdAt: x.created_at, expiresAt: x.expires_at, lastSeen: x.last_seen }));
          return json({ leads });
        }

        // Cấu hình (webhook Google Sheet)
        if (path === '/admin/settings' && req.method === 'GET') {
          return json({ sheetWebhook: (await getSetting(env, 'sheet_webhook')) || '' });
        }
        if (path === '/admin/settings' && req.method === 'POST') {
          const b = await req.json().catch(() => ({}));
          await env.DB.prepare('INSERT INTO settings (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value')
            .bind('sheet_webhook', (b.sheetWebhook || '').toString().slice(0, 500)).run();
          return json({ ok: true });
        }

        return json({ error: 'not found' }, 404);
      }

      // ---------- LEAD (công khai — form landing) ----------
      if (path === '/lead' && req.method === 'POST') {
        await ensureSchema(env);
        const b = await req.json().catch(() => ({}));
        const name = (b.name || '').toString().trim().slice(0, 120);
        const phone = (b.phone || '').toString().trim().slice(0, 40);
        const email = (b.email || '').toString().trim().slice(0, 120);
        if (!name || !(phone || email)) return json({ error: 'Vui lòng nhập Tên và SĐT hoặc Email.' }, 400);
        // chống tạo trùng: cùng email/sđt → trả lại mã cũ
        let existing = null;
        if (email) existing = await env.DB.prepare('SELECT code FROM leads WHERE email=? ORDER BY id DESC').bind(email).first();
        if (!existing && phone) existing = await env.DB.prepare('SELECT code FROM leads WHERE phone=? ORDER BY id DESC').bind(phone).first();
        let code, expiresAt;
        if (existing && existing.code) {
          code = existing.code;
          const m = await accMeta(env, code); expiresAt = m.expiresAt;
        } else {
          code = genCode();
          for (let i = 0; i < 3; i++) { const ex = await env.DB.prepare('SELECT code FROM accounts WHERE code=?').bind(code).first(); if (!ex) break; code = genCode(); }
          expiresAt = new Date(Date.now() + 30 * 86400e3).toISOString(); // dùng thử 30 ngày
          await env.DB.prepare('INSERT INTO accounts (code,name,blob,version,created_at,updated_at,last_seen,plan,note,pushes,expires_at) VALUES (?,?,NULL,0,?,?,NULL,?,?,0,?)')
            .bind(code, name, now(), now(), 'trial', 'Đăng ký dùng thử (landing)', expiresAt).run();
          await env.DB.prepare('INSERT INTO leads (name,phone,email,code,source,created_at) VALUES (?,?,?,?,?,?)')
            .bind(name, phone, email, code, (b.source || 'landing').toString().slice(0, 40), now()).run();
          // đẩy sang Google Sheet (nếu admin đã cấu hình webhook) — fire & forget
          const hook = await getSetting(env, 'sheet_webhook');
          if (hook && ctx && ctx.waitUntil) {
            ctx.waitUntil(fetch(hook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, phone, email, code, expiresAt, created_at: now(), source: b.source || 'landing' }) }).catch(() => {}));
          }
        }
        return json({ ok: true, code, expiresAt, name });
      }

      // ---------- USER (cần access code) ----------
      const code = req.headers.get('x-dojo-code') || url.searchParams.get('code') || '';
      if (!code) return json({ error: 'Thiếu mã đăng nhập.' }, 401);
      const acc = await env.DB.prepare('SELECT code,name,blob,version FROM accounts WHERE code=?').bind(code).first();
      if (!acc) return json({ error: 'Mã không hợp lệ.' }, 401);

      if (path === '/auth' && req.method === 'POST') {
        await touch(env, code, false);
        const m = await accMeta(env, code);
        return json({ ok: true, name: acc.name, version: acc.version, plan: m.plan, expiresAt: m.expiresAt });
      }

      if (path === '/pull' && req.method === 'GET') {
        await touch(env, code, false);
        const m = await accMeta(env, code);
        return json({ blob: acc.blob ? JSON.parse(acc.blob) : null, version: acc.version, name: acc.name, plan: m.plan, expiresAt: m.expiresAt });
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
        if (changed === 1) { await touch(env, code, true); return json({ ok: true, version: next }); }
        // xung đột: thiết bị khác đã push trước → trả bản server cho client xử lý
        return json({ conflict: true, serverBlob: acc.blob ? JSON.parse(acc.blob) : null, version: acc.version }, 409);
      }

      return json({ error: 'not found' }, 404);
    } catch (e) {
      return json({ error: String((e && e.message) || e) }, 502);
    }
  },
};
