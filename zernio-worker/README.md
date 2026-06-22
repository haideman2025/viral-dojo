# Zernio Proxy — Cloudflare Worker cho Viral Dojo

Backend trung gian để Viral Dojo (web tĩnh) đăng bài qua **Zernio** mà **không lộ API key**.

```
Viral Dojo (trình duyệt) → Worker này (giữ key + CORS) → Zernio API
```

## Vì sao cần
- Key Zernio `sk_...` là **bí mật** → không được nhét vào web tĩnh public.
- Zernio chặn gọi thẳng từ trình duyệt (CORS).
- Worker giữ key dạng *secret*, chỉ mở 3 route tối thiểu.

## Deploy (1 lần, ~5 phút)

Cần Node.js + tài khoản Cloudflare.

```bash
cd zernio-worker
npm i -g wrangler          # nếu chưa có
wrangler login             # đăng nhập Cloudflare

# Đặt 2 secret:
wrangler secret put ZERNIO_API_KEY    # dán key sk_... (Zernio → Settings → API Keys)
wrangler secret put APP_TOKEN         # tự đặt 1 chuỗi ngẫu nhiên, NHỚ để dán vào Viral Dojo

# (tuỳ chọn) sửa ALLOWED_ORIGIN trong wrangler.jsonc cho đúng trang của bạn

wrangler deploy
```

Sau khi deploy, Cloudflare in ra URL dạng:
`https://zernio-proxy.<tên-bạn>.workers.dev`

## Nối vào Viral Dojo
Mở app → tab **📤 Phân phối** → ô **Kết nối Zernio**:
- **Worker URL**: dán URL workers.dev ở trên.
- **App token**: dán đúng chuỗi `APP_TOKEN` bạn vừa đặt.
- Bấm **Kết nối & tải tài khoản** → thấy danh sách kênh đã nối trong Zernio.

## Route Worker cung cấp
| Method | Path | Việc |
|---|---|---|
| GET  | `/accounts`  | liệt kê tài khoản đã nối (status=connected) |
| POST | `/presign`   | xin `uploadUrl` + `publicUrl` để PUT video thẳng lên cloud |
| POST | `/schedule`  | tạo/đặt lịch bài (`POST /v1/posts` của Zernio) |

Tất cả route yêu cầu header `x-app-token` khớp `APP_TOKEN`.

## Bảo mật
- Đổi `ALLOWED_ORIGIN` thành đúng origin trang bạn (đừng để `*` khi chạy thật).
- `APP_TOKEN` ngăn người lạ biết URL Worker rồi đăng bậy lên tài khoản bạn.
- Không commit key/token vào git (chúng là secret trên Cloudflare).
