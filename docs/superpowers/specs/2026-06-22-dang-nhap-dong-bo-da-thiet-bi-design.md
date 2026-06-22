# Đăng nhập & Đồng bộ đa thiết bị — Design Spec

> Ngày: 2026-06-22 · Repo: viral-dojo · Trạng thái: đã chốt thiết kế, chờ plan triển khai.
> Cho phép người dùng **đăng nhập bằng access code**, **lưu workspace theo tài khoản**, và
> **đồng bộ giữa nhiều thiết bị** qua backend Cloudflare. App vẫn chạy được offline/local.

---

## 0. Quyết định đã chốt

| Vấn đề | Quyết định |
|---|---|
| Cách đăng nhập | **Access code** (mã mời) — không Google, không email |
| Ai cấp mã | **Admin cấp mã** (kiểm soát ai dùng được) |
| Đồng bộ đa thiết bị | **Auto-sync + cảnh báo xung đột** (last-write-wins có CAS) |
| API key (Gemini/Apify/Zernio) | **Local-only** — KHÔNG đồng bộ lên cloud (giữ BYOK) |
| Backend | **Hướng A: Cloudflare Worker + D1** (worker mới `dojo-sync`) |
| Hosting app | **Cloudflare Pages** — mọi thiết bị mở cùng 1 URL |

Lý do chọn D1 thay vì KV: yêu cầu "cảnh báo xung đột" cần so version **nguyên tử**
(`UPDATE ... WHERE version=?`), điều KV (eventual-consistency, không atomic CAS) làm không
chắc. D1 cũng tiện cho admin liệt kê/quản lý mã.

---

## 1. Phạm vi (scope)

**Trong phạm vi:**
- Worker mới `dojo-sync` (D1) với endpoints auth / pull / push / admin.
- Màn đăng nhập bằng access code trong `index.html` + badge trạng thái + nút Đăng xuất.
- Auto-sync workspace (debounce sau `save()`) + modal xử lý xung đột.
- Panel admin ẩn (trong tab Kết nối) để admin tạo & xem danh sách mã.
- Deploy `index.html` lên Cloudflare Pages.

**Ngoài phạm vi (phase sau):**
- Đồng bộ API key, R2 cho Brand Vault lớn, billing/quota, RBAC team, OAuth Google/email,
  mã hoá code phía server, rate-limit, MCP/CLI (theo ROADMAP Part B).

---

## 2. Mô hình dữ liệu

### 2.1. Cục đồng bộ (cloud blob)
Chỉ đồng bộ **dữ liệu dự án**, KHÔNG gồm key và session:

```jsonc
// blob lưu trên D1 = subset của S
{ "v": 2, "activeId": "proj_ab12", "projects": { ... } }
```

- **KHÔNG** đồng bộ: `S.keys` (Gemini/Apify/Zernio — local-only theo Q4).
- **KHÔNG** đồng bộ: session đăng nhập.

### 2.2. localStorage phía client (3 khoá tách biệt)

| Khoá | Nội dung | Đồng bộ? |
|---|---|---|
| `dojo` | `S` đầy đủ (`v, activeId, projects, keys`) | Chỉ phần `{v,activeId,projects}` đẩy lên cloud; `keys` ở lại |
| `dojo_session` | `{ code, name }` — phiên đăng nhập | Không (local) |
| `dojo_sync` | `{ version, lastPulledAt }` — version cloud đã đồng bộ gần nhất | Không (local) |
| `dojo_admin` | `{ token }` — chỉ tồn tại trên máy admin | Không (local) |

### 2.3. D1 schema

```sql
CREATE TABLE accounts (
  code       TEXT PRIMARY KEY,    -- access code, dùng làm bearer token
  name       TEXT,                -- tên hiển thị (admin đặt khi tạo)
  blob       TEXT,                -- workspace JSON (NULL tới lần push đầu)
  version    INTEGER NOT NULL DEFAULT 0,  -- tăng mỗi push; nền của conflict detection
  created_at TEXT,
  updated_at TEXT
);
```

---

## 3. Backend — Worker `dojo-sync`

Worker mới, tách khỏi `zernio-worker` (stateless proxy) để rõ trách nhiệm. Binding D1.
`wrangler.toml` khai báo `d1_databases`. Admin token là **wrangler secret** `ADMIN_TOKEN`
(không hardcode, không commit).

### 3.1. Endpoints

| Method | Path | Header | Body | Phản hồi |
|---|---|---|---|---|
| POST | `/auth` | `x-dojo-code` | — | `200 {ok:true, name, version}` · `401` nếu mã sai |
| GET | `/pull` | `x-dojo-code` | — | `200 {blob, version, name, updatedAt}` (blob có thể null) |
| POST | `/push` | `x-dojo-code` | `{blob, baseVersion}` | `200 {version}` · **`409 {conflict:true, serverBlob, version}`** nếu `version != baseVersion` |
| POST | `/admin/codes` | `x-admin-token` | `{name}` | `200 {code}` (sinh ngẫu nhiên ≥16 ký tự) · `401` |
| GET | `/admin/codes` | `x-admin-token` | — | `200 {accounts:[{code, name, version, updatedAt}]}` · `401` |
| OPTIONS | `*` | — | — | `204` + CORS preflight |

### 3.2. Logic push (CAS nguyên tử)

```sql
UPDATE accounts
SET blob = ?, version = version + 1, updated_at = ?
WHERE code = ? AND version = ?;     -- ? cuối = baseVersion client gửi
```
- `changes() == 1` → thành công, trả `version = baseVersion + 1`.
- `changes() == 0` → version đã đổi (thiết bị khác đẩy trước) → đọc lại bản hiện tại,
  trả **409** kèm `serverBlob` + `version` mới.
- Lần push đầu (account `version=0`, `blob=NULL`): client gửi `baseVersion=0` → khớp → ghi
  thành `version=1`.

### 3.3. CORS
Giữ kiểu hiện tại của `zernio-worker` cho MVP: `Access-Control-Allow-Origin: *`,
allow headers gồm `x-dojo-code, x-admin-token`. (Code là bí mật bearer; siết origin về
domain Pages là hardening phase sau — ghi trong mục Rủi ro.)

---

## 4. Auth flow (client)

1. App load → đọc `dojo_session`.
   - **Có session** → tự gọi `/auth` xác thực ngầm; OK thì vào app + bật sync; mã bị thu hồi
     (401) thì xoá session, hiện màn đăng nhập (không xoá dữ liệu local).
   - **Không session** → app vẫn chạy **chế độ local thuần** (như hiện tại). Header có nút
     **"Đăng nhập để đồng bộ"**.
2. Màn đăng nhập: ô nhập mã → `/auth`.
   - Đúng → lưu `dojo_session={code,name}` → chạy **pull lần đầu** (xem §5).
   - Sai → báo "Mã không hợp lệ".
3. Nút **Đăng xuất**: xoá `dojo_session` + `dojo_sync`. **Giữ nguyên** `dojo` (dữ liệu local)
   và `keys`. App trở về chế độ local.

---

## 5. Sync flow

### 5.1. Pull (khi đăng nhập / khi load có session)
- Gọi `/pull`.
- `blob == null` (tài khoản mới chưa có dữ liệu cloud) → **đẩy** workspace local hiện tại lên
  làm bản gốc (push với `baseVersion=0`).
- `blob != null`:
  - `cloud.version > dojo_sync.version` (cloud mới hơn bản máy này từng thấy) → **nạp** `blob`
    vào `S` (thay `v/activeId/projects`, **giữ** `S.keys`), `save()` không-trigger-push,
    cập nhật `dojo_sync.version`.
  - ngược lại → giữ local, có thể push nếu local có thay đổi chưa đẩy.

### 5.2. Push (khi `save()`)
- `save()` thêm gọi `scheduleSync()` — **debounce ~2.5s** sau lần thay đổi cuối.
- Gọi `/push {blob, baseVersion: dojo_sync.version}`.
  - `200` → cập nhật `dojo_sync.version`, badge `☁️ Đã đồng bộ`.
  - **`409`** → modal xung đột (§5.3).
  - lỗi mạng → badge `🔌 Offline`, thử lại lần `save()` sau.

### 5.3. Modal xung đột (409)
Nội dung: *"Bản trên cloud đã được cập nhật từ thiết bị khác."* 2 lựa chọn:
- **[Giữ bản máy này]** → push lại với `baseVersion = server.version` (ghi đè cloud).
- **[Lấy bản cloud về]** → nạp `serverBlob` vào `S` (giữ `keys`), bỏ thay đổi local đang sửa,
  cập nhật `dojo_sync.version`.

### 5.4. Badge trạng thái (header)
`☁️ Đã đồng bộ` · `⏳ Đang lưu…` · `⚠️ Lệch bản` · `🔌 Offline` · `(chế độ local)` khi chưa login.

---

## 6. Thay đổi trong index.html

- **Hằng số** `SYNC_URL` = URL worker `dojo-sync` (không chứa secret).
- **Khối `sync`** (JS mới, đặt cạnh `S`/`save()`): `authCode()`, `pull()`, `pushNow()`,
  `scheduleSync()` (debounce), `conflictModal()`, `setBadge()`.
- **`save()`**: thêm 1 dòng `scheduleSync()` — KHÔNG đổi logic ghi localStorage.
- **UI mới**: màn đăng nhập (overlay), badge trạng thái + nút Đăng nhập/Đăng xuất ở header,
  panel admin ẩn trong tab Kết nối.
- Tái dùng class/biến CSS sẵn (dark theme) theo nguyên tắc bất biến #7.

---

## 7. Admin cấp mã

- Panel ẩn trong tab **Kết nối** (chỉ hiện khi nhập đúng `ADMIN_TOKEN`, lưu `dojo_admin` local
  máy admin).
- Chức năng: ô "Tạo mã mới" (nhập tên hiển thị → `POST /admin/codes` → hiện mã để copy);
  danh sách mã hiện có (`GET /admin/codes`) kèm tên + lần sync gần nhất.
- User thường không thấy panel (không có token).

---

## 8. Deploy

- **Worker:** `cd zernio-worker`-kiểu thư mục mới `dojo-sync/` → `wrangler d1 create dojo` →
  điền `database_id` vào `wrangler.toml` → `wrangler d1 execute dojo --file=schema.sql` →
  `wrangler secret put ADMIN_TOKEN` → `wrangler deploy`.
- **Pages:** đẩy `index.html` (+ `coreviral-tri-thuc.html`) lên **Cloudflare Pages** (kết nối
  repo GitHub hoặc `wrangler pages deploy`). Mọi thiết bị mở cùng URL Pages.
- Điền `SYNC_URL` (URL worker đã deploy) vào `index.html` trước khi deploy Pages.

---

## 9. Test checklist

- [ ] Admin tạo mã → user nhập mã đúng → vào app; mã sai → báo lỗi, không vào.
- [ ] Máy A đăng nhập → sửa dữ liệu → máy B đăng nhập cùng mã → thấy đúng dữ liệu.
- [ ] Sửa cùng lúc 2 máy → máy push sau nhận **409** → modal hoạt động đúng cả 2 nhánh.
- [ ] Không đăng nhập → app chạy local như cũ, không lỗi.
- [ ] Key nhập ở máy A **không** xuất hiện ở máy B (xác nhận local-only).
- [ ] Đăng xuất → mất sync nhưng **giữ** dữ liệu + key local.
- [ ] Tài khoản mới (chưa có blob) → lần đăng nhập đầu đẩy workspace local lên đúng.
- [ ] Reload sau khi sync → không mất tiến độ, version khớp.

---

## 10. Rủi ro & hardening (ghi nhận, làm phase sau)

- **CORS `*`**: stolen code có thể dùng từ site khác. Siết origin về domain Pages sau.
- **Code lưu plaintext** trong D1: cân nhắc hash (so sánh hash) ở phase bảo mật.
- **Blob lớn** (Brand Vault nhiều text): D1 TEXT đủ cho MVP; chuyển R2 nếu vượt ngưỡng.
- **Không rate-limit**: thêm khi mở công khai.
- **Last-write-wins**: modal xung đột giảm rủi ro, nhưng không merge từng phần — chấp nhận ở MVP.
