# dojo-sync — backend đăng nhập & đồng bộ đa thiết bị

Worker Cloudflare + D1 cho VIRAL DOJO. Đăng nhập bằng **access code** (admin cấp),
đồng bộ workspace giữa nhiều thiết bị. **Không** lưu API key của user.

## Endpoints
| Method | Path | Header | Mô tả |
|---|---|---|---|
| POST | `/auth` | `x-dojo-code` | Xác thực mã → `{ok,name,version}` |
| GET | `/pull` | `x-dojo-code` | Tải workspace cloud → `{blob,version,name}` |
| POST | `/push` | `x-dojo-code` | Đẩy `{blob,baseVersion}` → `{version}` hoặc 409 (xung đột) |
| POST | `/admin/codes` | `x-admin-token` | Tạo mã mới `{name}` → `{code}` |
| GET | `/admin/codes` | `x-admin-token` | Danh sách mã |

`/push` cũng chấp nhận `?code=` (cho sendBeacon lúc đóng tab).

## Deploy lần đầu
```bash
cd dojo-sync
wrangler d1 create dojo                       # → copy database_id vào wrangler.toml
wrangler d1 execute dojo --remote --file=schema.sql
wrangler secret put ADMIN_TOKEN               # nhập 1 chuỗi bí mật mạnh (chỉ admin giữ)
wrangler deploy                               # → copy URL .workers.dev
```
Sau khi deploy: dán URL worker vào `SYNC_URL` trong `index.html`.

## Cấp mã cho user
- Mở app → tab **⚡ Kết nối** → mục **Admin** → nhập `ADMIN_TOKEN` → "Tạo mã".
- Hoặc curl:
```bash
curl -X POST https://dojo-sync.<sub>.workers.dev/admin/codes \
  -H "x-admin-token: <ADMIN_TOKEN>" -H "Content-Type: application/json" \
  -d '{"name":"Khách A"}'
```

## Bảo mật (MVP)
- Code truyền qua HTTPS, là bí mật bearer. CORS `*` cho MVP (siết origin về domain Pages sau).
- Không lưu key user. Admin token là wrangler secret, không commit.
