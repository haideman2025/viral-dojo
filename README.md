# 🥋 Viral Dojo

**Đừng học về viral. Hãy ship một kênh viral.**

Ứng dụng Learn-to-Ship: học xây kênh TikTok viral theo giáo trình COREVIRAL (6 trạm), thực hành ngay trong app, AI chấm điểm theo rubric 100đ, kết thúc bằng một kênh hoàn chỉnh + 30 ngày content.

## Chạy
Mở `index.html` bằng browser — không cần server. (Hoặc deploy GitHub Pages / Cloudflare Pages.)

## Tính năng MVP v0.1
- **Trạm 1** đầy đủ: học + matrix builder Chủ đề × Cách thể hiện
- **Brand Vault**: nạp dữ liệu thương hiệu đa định dạng (txt/md/csv/json/html/paste) làm bối cảnh cho AI
- **3 chế độ AI**: 🤖 tự làm hết (review-editable) · 💬 mentor hướng dẫn · 🧠 chấm theo rubric 100đ (Gemini)
- **Connection Hub**: Gemini + Apify (test key thật) + TikTok Shop data upload — key lưu localStorage phía user
- **Channel DNA**: file JSON sống qua các trạm, export được
- **📚 Tri thức**: map tới giáo trình COREVIRAL gốc (`coreviral-tri-thuc.html`)

## Roadmap
Xem `docs/BLUEPRINT.md` — Trạm 2–6, pipeline Apify cào viral, cổng GENERATE (30-day pack + LP deploy), pricing, GTM.

## Stack
Single-file HTML + vanilla JS. Gemini API (key phía user). Sẽ chuyển Next.js + Supabase ở phase 2.
