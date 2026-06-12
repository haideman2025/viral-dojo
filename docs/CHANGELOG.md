# Changelog — Viral Dojo

Định dạng: theo ngày, mô tả tiếng Việt ngắn. Phiên bản single-file `index.html`.

## v0.2 — 2026-06-12
### Thêm
- **Trạm 2 — Đọc vị Series**: bảng 4 kênh × ≥3 series; nút 🕷 Cào kênh qua Apify (`clockworks/tiktok-profile-scraper`); 3 nút AI.
- **Trạm 3 — Keyword Brand & Insight Sale**: keyword brand, bản đồ Insight Sale 5 tầng, tuyến chứng minh ≥5 ý tưởng/keyword, signature.
- **Trạm 4 — Bộ từ khóa**: 8 danh mục × ≥5 keyword, đếm tổng ≥30 realtime, AI sinh từ Channel DNA.
- **Trạm 5 — Research viral**: chọn keyword từ kho Trạm 4 → Apify search → lọc ≥500k view/35k tim → Gemini dịch + gắn nhãn format (series/thử thách/xếp hạng/chấm điểm); cảnh báo luật nguồn theo định dạng kênh.
- **Trạm 6 — Phân tích & Nâng cấp**: chọn ≥5 video top, phân tích timestamp + điểm thành công + áp dụng + nâng cấp; nút 🧠 AI bóc video.
- **Cổng GENERATE v1**: sinh lịch 30 ngày + 10 script 5-beat + 10 prompt ảnh/video (EN); tải `.md`/`.json`, mở tab xem đẹp; regenerate từng phần.
- **Tổng quan tiến độ** đầu trang Dojo; **Import / Reset Channel DNA**.
- GitHub Actions deploy GitHub Pages khi push `main`.

### Hạ tầng
- Engine chấm chung `runGrade()` + helper `geminiCall()`; gating data-driven `UNLOCK[]`; rubric lấy nguyên văn từ `coreviral-tri-thuc.html`; mọi prompt kèm `brandContext()`.
- `CLAUDE.md`: kiến trúc, nguyên tắc bất biến, rubric 6 trạm, Definition of Done.

## v0.1
- Trạm 1 đầy đủ (matrix builder + AI grader/coach/autofill), Brand Vault, Connection Hub (Gemini/Apify/xlsx), Channel DNA export, progress localStorage.
