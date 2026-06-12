# 🥋 Viral Dojo

**Đừng học về viral. Hãy ship một kênh viral.**

Ứng dụng Learn-to-Ship: học xây kênh TikTok viral theo giáo trình COREVIRAL (6 trạm), thực hành ngay trong app, AI chấm điểm theo rubric 100đ, kết thúc bằng một kênh hoàn chỉnh + 30 ngày content.

## Chạy
Mở `index.html` bằng browser — không cần server. (Hoặc deploy GitHub Pages / Cloudflare Pages.)
Bản online tự deploy qua GitHub Pages mỗi lần push `main` (xem `.github/workflows/pages.yml`).

## Lộ trình 6 trạm (đã build)
Mỗi trạm: **học nhanh** (details + deep-link giáo trình) → **form thực hành** → **3 nút AI** (🤖 tự làm hết · 💬 hướng dẫn · 🧠 chấm rubric 100đ) → đạt **≥70đ** mở trạm sau. Output ghi vào **Channel DNA**, trạm sau đọc dữ liệu trạm trước.

1. **Trạm 1 — Chiến lược & Định dạng kênh**: ma trận Chủ đề × Cách thể hiện.
2. **Trạm 2 — Đọc vị Series**: gom series 4 kênh mẫu; **Apify** cào profile để gom nhanh.
3. **Trạm 3 — Keyword Brand & Insight Sale**: thông điệp cốt lõi + bản đồ 5 tầng (Nỗi đau→Rào cản→Mong đợi→Tự hào→Thúc đẩy) + signature.
4. **Trạm 4 — Bộ từ khóa**: 8 danh mục × ≥5 keyword, tổng ≥30 (đếm realtime).
5. **Trạm 5 — Research viral**: chọn keyword → **Apify** săn video, lọc ≥500k view/35k tim → Gemini dịch + gắn nhãn format.
6. **Trạm 6 — Phân tích & Nâng cấp**: bóc timestamp + điểm thành công → nâng cấp ý tưởng ghép insight sản phẩm.

## 🚀 Cổng GENERATE
Channel DNA đầy → 1 nút sinh: **lịch 30 ngày** · **10 script 5-beat** · **10 prompt ảnh (Nano Banana) + video (Veo 3)** — tải `.md`/`.json` hoặc mở tab xem đẹp.

## Tính năng nền
- **Brand Vault**: nạp dữ liệu thương hiệu đa định dạng (txt/md/csv/json/html/paste) làm bối cảnh AI cho mọi bước.
- **Connection Hub**: Gemini + Apify (test key thật) + TikTok Shop data — key lưu **localStorage phía user**, không gửi server.
- **Channel DNA**: file JSON sống qua 6 trạm — export / **import (đổi máy)** / reset.
- **Tổng quan tiến độ**: % hoàn thành + điểm từng trạm + nút tiếp tục đúng chỗ đang dở.
- **Chấm offline**: khi chưa có Gemini key, app vẫn chấm heuristic cơ bản.
- 📚 **Tri thức**: map tới giáo trình COREVIRAL gốc (`coreviral-tri-thuc.html`).

## Stack
Single-file HTML + vanilla JS, không framework/build step. Gemini API (`gemini-2.5-flash`, key phía user), Apify REST. Sẽ chuyển Next.js + Supabase ở phase 2 — xem `docs/BLUEPRINT.md`.

## Đóng góp
Quy ước commit: `feat:` / `fix:` / `docs:` + mô tả tiếng Việt ngắn. Nguyên tắc bất biến + Definition of Done: xem `CLAUDE.md`.
