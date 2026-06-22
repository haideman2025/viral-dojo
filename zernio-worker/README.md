# Zernio Proxy — Cloudflare Worker (stateless · BYOK)

Proxy "câm" để Viral Dojo (web tĩnh) đăng bài qua **Zernio**. **KHÔNG lưu key nào** ở server.

```
Viral Dojo (trình duyệt)  →  Worker này (chỉ thêm CORS + chuyển tiếp)  →  Zernio API
   • mỗi user tự nhập key Zernio của họ (BYOK)
   • key đi kèm header x-zernio-key, Worker forward nguyên vẹn
```

## Vì sao cần proxy
Zernio chặn gọi thẳng từ trình duyệt (CORS) → cần 1 trung gian. Proxy này **không giữ key**,
nên **deploy 1 lần dùng chung cho mọi user** — ai dùng app cũng nhập key Zernio của riêng mình.

## Deploy 1 lần (KHÔNG cần secret)

```bash
cd zernio-worker
npm i -g wrangler     # nếu chưa có
wrangler login        # đăng nhập Cloudflare (bước duy nhất cần trình duyệt)
wrangler deploy
```

Cloudflare in ra URL: `https://zernio-proxy.<tên-bạn>.workers.dev`

→ Dán URL này vào hằng `ZPROXY_DEFAULT` trong `index.html` (hoặc để user tự dán ở tab Phân phối).
Sau đó **người dùng cuối không phải deploy gì** — chỉ dán API key Zernio của họ.

## Route
| Method | Path | Việc | Forward tới |
|---|---|---|---|
| GET  | `/accounts` | liệt kê kênh đã nối | `GET /v1/accounts?status=connected` |
| POST | `/presign`  | xin URL upload | `POST /v1/media/presign` |
| POST | `/schedule` | tạo/đặt lịch bài | `POST /v1/posts` |

Mọi route đọc API key từ header **`x-zernio-key`** (do app gửi). Không có key → 401.

## Ghi chú
- Proxy mở CORS `*` để app ở bất kỳ origin nào cũng gọi được. An toàn vì proxy không chứa
  secret — mỗi request phải tự kèm key Zernio hợp lệ.
- Key Zernio của user chỉ nằm trong **localStorage trình duyệt của họ** + đi qua proxy này
  (mã nguồn mở, bạn tự host) → không bên thứ ba nào giữ key.
