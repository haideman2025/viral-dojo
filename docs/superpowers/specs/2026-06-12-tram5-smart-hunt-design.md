# Trạm 5 — Tự săn + lọc thông minh (1 click)

**Ngày:** 2026-06-12 · **File:** `index.html` · **Trạm:** 5 (Research video viral)

## Vấn đề
Người dùng cào rất nhiều video qua Apify nhưng chấm điểm Trạm 5 không đạt. Nguyên nhân: bảng research đầy video **lạc đề** (chuyện ma, drama cá nhân, UFO...) vì TikTok search theo keyword trả về video viral chung chung. Engine cũ chỉ lọc theo view/tim (`huntViral`) và gắn nhãn format (`translateRows`), **không lọc theo độ liên quan ngành, không loại nhiễu**. Hai tiêu chí lớn của rubric — *Tỷ lệ thành công cao (50đ)* và *Bám insight DN (10đ)* — vì thế tụt mạnh.

## Mục tiêu
Một nút **"⚡ Tự săn + lọc thông minh"** làm trọn: chấm lại video sẵn có → tự săn thêm nếu thiếu → loại nhiễu, sắp xếp → người dùng chỉ xem lại & nộp.

## v2 (2026-06-12, sau khi 65 keyword chỉ ra 7/20)
Lỗi v1: biến rubric "có trọng số" thành **cổng AND cứng** (bắt buộc đúng 5 format + liên quan≥2) → loại oan video viral tốt. Kiến thức lõi (Module 5) xác nhận "Tỷ lệ thành công cao" là **50đ ưu tiên cộng điểm**, và "Bám insight" là *"liên quan ngành HOẶC ngành có thể liên kết"* (lỏng).

**Chấm theo ĐIỂM CHẤT LƯỢNG 0–100 (bỏ cổng cứng):**
- Đạt ngưỡng viral: 10 (gate cứng — dưới ngưỡng = loại)
- Format an toàn: 30 (series/thử nghiệm/thử thách/xếp hạng/chấm điểm) · 18 (review/reaction/so sánh/kể chuyện/tips) · 6 (khác)
- **🆕 Clone dễ bằng AI: 0–25** (`clone` 0-3 × 25/3) — tiêu chí mới, đúng tinh thần "nhân bản" của COREVIRAL
- Liên quan ngành (lỏng): 0–15 (`lienquan` 0-3 × 15/3)
- Khả năng ứng dụng DN: 0–20 (`ungdung` 0-3 × 20/3)
- **Giữ = viral · lienquan≥1 · tổng ≥ `M5_PASS`(55).** Hằng số tinh chỉnh được.

**🆕 Search video NƯỚC NGOÀI khi định dạng Hình thức/Kết hợp:** `huntSmart` dịch keyword tiếng Việt → cụm tìm kiếm tiếng Anh (1 call Gemini, hướng format challenge/ranking/review/experiment) trước khi cào Apify → ra video clone-able đúng bài (Module 5: "tìm video nước ngoài, tránh trùng, dễ nhân bản"). Định dạng Kiến thức giữ keyword VN/phương Đông.

**🆕 Ưu tiên keyword dạng "hình thức"** (`M5_FMT_KW`: thử thách/xếp hạng/review/so sánh...) quét trước → chạm 20 nhanh hơn, đỡ tốn token/quota.

## (v1 — superseded) Quyết định ban đầu
- **Chuẩn giữ (khớp rubric):** `(view≥500k HOẶC like≥35k)` VÀ `format ∈ {series, thử nghiệm, thử thách, xếp hạng, chấm điểm}` VÀ `liên quan ngành ≥ 2/3`.
- **Video trượt:** đánh dấu ✗ + đẩy xuống cuối (mờ + lý do), KHÔNG tự xoá; có nút "🗑 Xoá hết video bị loại (N)" để dọn hàng loạt.
- **Auto-loop (mục tiêu-driven):** quét **lần lượt CẢ kho keyword Trạm 4**, không lặp lại keyword đã quét (lưu `S.dna._m5kwDone`, persist qua `save()` → lần bấm sau quét tiếp). Dừng khi `kept≥20` HOẶC hết keyword HOẶC Apify lỗi 2 lần liên tiếp (chốt an toàn quota). Chấm AI **sau mỗi keyword** để dừng sớm khi đủ.
- **Tận dụng data cũ:** Bước 1 chấm lại toàn bộ bảng hiện có (0 quota Apify) trước khi săn thêm.

## Luồng (huntSmart)
1. **Chấm lại bảng hiện có** — `scoreRowsAI` quét mọi dòng chưa chấm, theo lô ≤40 caption/call Gemini.
2. **Áp cổng đạt chuẩn** — tính `keep` từ viral(local) ∧ format ∧ liên quan; ghi `data-keep`, `data-score`; viết `dich [format]` vào ô `.v-trans` (giữ tương thích `grade5`/`gradeLocal5`).
3. **Auto-loop** (chỉ khi có Apify token & còn thiếu) — duyệt keyword theo thứ tự `[đã chọn ...kho Trạm 4]`, mỗi vòng: Apify cào → lọc view/tim → dedup theo link → `scoreRowsAI` lô mới → đếm lại. Dừng khi `kept≥20` hoặc `kwTried≥8`.
4. **Sắp xếp + dọn** — `applyFilterSort`: đạt chuẩn lên đầu (viền xanh, sort theo điểm tiềm năng ↓), trượt xuống cuối; hiện nút xoá hàng loạt.

## Hàm
- `huntSmart()` — điều phối toàn luồng + tiến trình.
- `scoreRowsAI(rows)` — chấm lô qua Gemini: trả `{dich, nhan(format), lienquan 0-3, diem 0-100}`; quyết định keep; gọi `setRowStatus`.
- `setRowStatus(row, st)` — render badge trạng thái + lý do, set `data-keep`/`data-score`, viền + opacity.
- `applyFilterSort()` — sort DOM theo keep rồi score; cập nhật nút xoá.
- `countKept()` / `deleteRejected()` — đếm / xoá hàng loạt video trượt.
- `addVideo(v)` — nâng cấp: `return d` (trả element để loop thu thập).

## Hằng số
`M5_TARGET=20`, `M5_MAX_KW=8`, `M5_FMT_OK=/series|thử nghiệm|thử thách|xếp hạng|chấm điểm/i`, ngưỡng liên quan `≥2`.

## Không đụng
`grade5()`, rubric, `runGrade()`, `geminiCall()`, `brandContext()`. Nút thủ công cũ (`huntViral`, `translateRows`) giữ nguyên làm fallback.

## Verify
Kiểm tra cú pháp JS (node --check trên phần script tách ra) + mở app, xác nhận: nút hiện, chấm lại bảng cũ loại được nhiễu, dòng đạt chuẩn lên đầu, nút xoá hiện đúng số.
