# 🎥 Bộ prompt video Omni (Google Flow) — chuỗi 10s/script

**Ngày:** 2026-06-13 · **File:** `index.html` (tab Lò) · Layer thêm, không sửa luồng đang chạy.

## Mục tiêu
Từ kịch bản B9 (Lò) → sinh **bộ prompt video Omni** cho cả 30 ngày: mỗi prompt = 1 video 10s tạo bằng **Omni trên Google Flow**, **khoá 1 nhân vật + 1 sản phẩm tham chiếu dùng chung cả kênh** + liền mạch qua chuỗi shot 10s → user tạo video nhanh.

## Quyết định đã chốt
- **1 bộ tham chiếu DÙNG CHUNG cả kênh** (nhân vật + sản phẩm + style) — cùng người/look cho cả 30 video. Sửa được.
- **Thêm vào auto-pipeline (bước 5)** + nút riêng "🎥 Sinh prompt video (cả loạt)" + nút 🎥 từng dòng + export .md/.csv.

## Data
- `S.dna.skuld.vref = { character, product, style }` — bộ tham chiếu kênh (sinh 1 lần từ DNA, editable).
- `S.dna.skuld.vprompts = { '<title>': { shots:[{seq,dur:10,prompt,onscreen}], at } }` — chuỗi 10s/script.

## Hàm
- `ensureVRef()` — nếu chưa có vref: 1 call Gemini sinh nhân vật on-camera nhất quán + mô tả sản phẩm + style (English, cho video model). `genVRef()` (sinh lại), `saveVRef()` (lưu khi sửa), `renderVRef()`.
- `genVPrompts(title)` — 1 call/script: cắt kịch bản thành N shot 10s; mỗi shot = prompt Omni English 9:16, tham chiếu [CHARACTER]/[PRODUCT] từ vref nguyên văn + continuity ("nối liền shot trước, cùng nhân vật/bối cảnh") + on-screen text tiếng Việt + audio. JSON {shots:[{seq,prompt,onscreen}]}.
- `genVPromptsAll()` — ensureVRef → loop script chưa có vprompts, progress qua `forgeProg`.
- `renderVPrompts()` / `exportVPrompts(fmt)` — export kèm header bộ tham chiếu + nhắc upload ảnh nhân vật+sản phẩm vào Flow ingredients.
- `genVPromptDay(day)` — nút từng dòng: sinh cho 1 script + cuộn tới.
- Wiring: thêm bước 5 vào `runFullPipeline` (sau chấm, trước đẩy ops); tab Lò mở gọi `renderVRef()`+`renderVPrompts()`; init `vref/vprompts` default.

## Bất biến / verify
Chỉ THÊM. Mọi state vào `S.dna.skuld.*`. Single-file. Verify: node --check; 0 trùng hàm/ID; hàm mới + bước 5 pipeline có mặt.
