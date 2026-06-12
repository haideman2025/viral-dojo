# 🥋 LÒ LUYỆN KỊCH BẢN — đổi tên SKULD + xưởng thực thi (gói 1: A+B+C+D)

**Ngày:** 2026-06-12 · **File:** `index.html` (tab `v-skuld`) · Nguồn sự thật: `SKULD-FACTORY.md`

## Mục tiêu
Biến tab SKULD thành **xưởng thực thi**: kế hoạch 30 ngày từ GENERATE được tự nạp về → chấm điểm cả loạt (Scorecard 1000đ) → ý tưởng đạt ≥60% phát triển thành **kịch bản chi tiết chất lượng cao** để sản xuất.

## Quyết định đã chốt
- **Tên mới:** tab `🏭 SKULD` → **`🥋 LÒ LUYỆN KỊCH BẢN`** (hợp theme Dojo). Đổi tiêu đề + tag "SKULD A/B/C" → "LÒ A/B/C". **Giữ nguyên** key `S.dna.skuld` + tên hàm nội bộ (không vỡ data đã lưu).
- **Gói 1 = A+B+C+D** (nạp → chấm cả loạt → dựng kịch bản TOP). Lịch đăng B8 (E) làm gói sau.
- **Auto-chain:** `generateAll()` xong tự nạp 30 ý tưởng vào Lò + hiện CTA sang Lò.

## Data flow
1. **GENERATE** sinh `S._pack.calendar` (30 ngày) → `importPlanToForge()` chuyển mỗi ngày thành 1 ý tưởng đẩy vào `S.dna.skuld.scored` (cờ `from:'gen'`, `day`, `fmt` theo định dạng kênh). Nạp lại sẽ thay kế hoạch `from:'gen'` cũ.
2. **Chấm cả loạt (C):** `scoreForgeBatch()` chạy Scorecard 1000đ (19 câu **bất biến** SK_Q/SK_W) theo lô ~8/call Gemini → `checks[19]` → `score`. Cờ `_sc` đánh dấu đã chấm. Review-edit ở Dashboard sẵn có.
3. **Dựng kịch bản (D), gate ≥600đ (60%):** `buildScriptsTop()` sinh kịch bản B9 từng ý tưởng đạt chuẩn → `S.dna.skuld.scripts[title] = {scenes:[{phan,noidung,hinhanh,tram,note}], at}`. 3 phần Mở–Thân–Kết.
4. **Render + export** `.md/.csv`.

## Components (hàm mới)
- `forgeFmt()` — map định dạng kênh → 'kt'|'htkh'.
- `importPlanToForge()` — auto sau `generateAll`; trả số ý tưởng nạp.
- `renderForgePlan()` — bảng 30 ý tưởng + trạng thái chấm/kịch bản.
- `scoreForgeBatch()` — chấm cả loạt (lô 8), review-editable.
- `buildScriptsTop()` — dựng kịch bản cho ý tưởng ≥60% chưa có.
- `renderScripts()` / `exportScripts(fmt)`.
- Wiring: `generateAll` gọi import + CTA; tab `skuld` mở gọi thêm `renderForgePlan()`+`renderScripts()`; init thêm `S.dna.skuld.scripts={}`.

## Schema thêm
`S.dna.skuld.scripts = { '<title>': {scenes:[{phan,noidung,hinhanh,tram,note}], at} }`. `scored[]` thêm `from`,`day`,`_sc`.

## Bất biến (theo SKULD-FACTORY.md §6)
SK_W/SK_Q 19 câu **không sửa**. Mọi AI output **review-editable**. Gate ≥60% mới dựng kịch bản. Mọi state vào `S.dna.skuld.*`. Single-file.

## Verify
Syntax `node --check`; unit-test forgeFmt + tính score từ checks×W + gate ≥600; mở app smoke (nạp giả lập → chấm → dựng → export).
