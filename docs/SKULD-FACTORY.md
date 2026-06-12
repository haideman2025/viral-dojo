# SKULD FACTORY — Spec đầy đủ cho Claude Code phát triển tiếp

> File này là NGUỒN SỰ THẬT cho toàn bộ phần 🏭 SKULD trong Viral Dojo (`index.html`, tab `v-skuld`).
> Đọc cùng: `CLAUDE.md` (nguyên tắc bất biến) · `docs/BLUEPRINT.md` (product spec) · `coreviral-tri-thuc.html` (giáo trình 6 module).
> Nguồn gốc dữ liệu: file Lark "COREVIRAL – Gửi EcomLegend" (sheet Cài Đặt / Dashboard / Hình thức-Kết hợp / Kiến thức / Phân Tích Chuyên Sâu) + file "4. VIRAL CORE MASTERY KẾ HOẠCH XÂY KÊNH 2026" (9 sheet SKULD) + file "5. KẾ HOẠCH VÀ QUẢN LÝ" (Dashboard/Cài Đặt/Master Plan/Lịch Tuần/Data Đo Lường/Triển Khai).

---

## 1. BẢN CHẤT SKULD

COREVIRAL có 2 nửa: **6 module dạy TƯ DUY** (đã thành Trạm 1–6 trong app) và **SKULD = NHÀ MÁY VẬN HÀNH** — quy trình 9 bước biến kết quả research thành kênh chạy thật, có QA định lượng trước khi quay và đo lường sau khi đăng.

Chuỗi giá trị: `Phân tích (B1-B2) → Sáng tạo (B3) → Thẩm định & phân bổ nguồn lực (B4 + Scorecard 1000đ) → Kế hoạch (B5-B6) → Sản xuất (B7-B9) → Đo lường (Dashboard KPI) → quay lại B1`.

Triết lý: **không sáng tạo từ con số 0** — mượn công thức viral đã được chứng minh, bóc đúng điểm thành công, nâng cấp ghép insight sản phẩm, chấm điểm đạt chuẩn rồi mới sản xuất.

### 9 bước SKULD (cấu trúc cột nguyên bản từ file gốc)

| # | Bước | Cột/khung dữ liệu nguyên bản | Trạng thái trong app |
|---|------|------------------------------|---------------------|
| B1 | **Phân tích tổng quan** | STT · Nội dung · Link kênh · Video · Bản dịch · Insight (Chủ đề + Cách thể hiện) · 4 câu why: *Tại sao DỪNG LẠI xem? · Tại sao XEM HẾT? · Tại sao XEM LẠI? · Đâu là điểm làm nên thành công?* · Bạn lựa chọn những điểm nào? | ⚠️ Một phần (Trạm 5-6 cover khác góc) — cần bổ sung 4 câu why |
| B2 | **Phân tích chi tiết** | Link · Bản dịch · Thể hiện (HÌNH ẢNH: background/góc quay/nhân vật/sản phẩm/hình trám · ÂM THANH: voice/nhạc nền/sound effect) × 3 phần (MỞ BÀI · THÂN BÀI · KẾT BÀI), mỗi phần Chi tiết + Nổi bật | ❌ Chưa có |
| B3 | **Liên kết ý tưởng** | Tệp khách hàng · Ý tưởng ban đầu · Điểm làm nên thành công · → Thử thách nào? · → Thử nghiệm nào? · → Xếp hạng/chấm điểm nào? · → Kết hợp tương phản nào? · **Ý tưởng nâng cấp** | ✅ Đã build (SKULD C) |
| B4 | **Phân cấp ý tưởng** | Chủ đề (tên + link) · CẤP I/II/III · Định vị (Hình ảnh · Tone giọng · Phong cách · Hình ảnh mô tả) · Tỉ lệ thành công % · Chi phí/buổi quay (Diễn viên · Bối cảnh/đạo cụ · Thiết bị · Tổng). Logic: Cấp I = rẻ nhất/tỉ lệ thành công cao nhất (dùng nguồn lực sẵn có ~80%), Cấp II = đầu tư thêm (~50%), Cấp III = full production | ❌ Chưa có |
| B5 | **Plan Master** | Mục đích/Mục tiêu/Thời gian · Định vị (Thông điệp × Chiến lược) · Giai đoạn · Nội dung · KPI (Video · Follow · Ý tưởng) · Tỉ lệ · Thời gian · Nghiệm thu · Nhân sự · Chi phí (Nhân sự/Đạo cụ/Thiết bị/Tổng) | ❌ → thuộc cổng GENERATE |
| B6 | **Kế hoạch triển khai** | Checklist setup: Tuyển dụng (VJ/Media/Content) · Setup bối cảnh · Kế hoạch content · Tạo lập kênh (Gmail/TikTok/setup info/lướt 30p trước đăng) · ... × Người thực hiện · Tình trạng · Deadline · Kết quả | ❌ Chưa có |
| B7 | **Khung kịch bản (Brief)** | Link mẫu · Bản dịch · Khung 3 phần (MỞ ĐẦU · NỘI DUNG CHÍNH · KẾT THÚC) × Nội dung + Chi tiết + Hình ảnh | ❌ → GENERATE |
| B8 | **Kế hoạch nội dung tháng** | 28-30 dòng video · KPI (Video · Ý tưởng · Tỉ lệ nội dung) · Định hướng ND (Thử thách/Tình huống/...) · Nội dung · Hướng triển khai · Phụ trách (Quay dựng · Content) · Deadline | ❌ → GENERATE |
| B9 | **Kịch bản chi tiết** | STT · Chủ đề · Tiêu đề · Nội dung · Hình ảnh thể hiện · TRÁM (hình ảnh + âm thanh chèn) · Note/góp ý · Link video mẫu · Bản dịch mẫu | ❌ → GENERATE |

### Hệ vận hành kèm theo (file "5. KẾ HOẠCH VÀ QUẢN LÝ")
- **Cài Đặt**: tên kênh/năm/follow · dropdown nhân sự Content/Media, định hướng (Viral/Chuyển đổi), tuyến nội dung (Giải trí/Giáo dục/Định vị/Review/CTA bán hàng/Affiliate/So sánh/Chốt sale), trạng thái, bối cảnh · KPI 12 tháng (video/tháng=30, view TB MT=100K, follow+ MT=8K, lead MT=50, doanh thu MT=30M, hạn mức chi phí=21M).
- **Master Plan** → **Lịch Tuần** (tự kéo) → sau đăng điền View/Follow+/Lead/DT/Chi phí → **Data Đo Lường** (SUMPRODUCT, %KPI, hiệu suất từng nhân sự) → **Dashboard** (filter tháng/tuần/content).
- Quy trình: Điền Master Plan → Lịch tuần tự kéo → đăng xong điền số → Dashboard refresh.

---

## 2. SCORECARD 1000 ĐIỂM — dữ liệu chính xác (ĐÃ BUILD, không được sửa trọng số)

19 câu × 2 bộ trọng số theo định dạng kênh. Tick ĐẠT = cộng trọng số. Tổng mỗi bộ = đúng 1.000.
Xếp loại: **Xuất sắc ≥80% · Tốt 60–79% · Trung bình 40–59% · Cần cải thiện <40%**.

| # | Nhóm | Câu hỏi | HT-KH | Kiến thức |
|---|------|---------|-------|-----------|
| 1 | CHỦ ĐỀ | Chủ đề mang lại GIÁ TRỊ không? | 100 | 100 |
| 2 | CHỦ ĐỀ | Chủ đề có tính DRAMA / TREND không? | 33 | 67 |
| 3 | ND nhiều người quan tâm | Có yếu tố THỬ NGHIỆM không? | 67 | 33 |
| 4 | ND nhiều người quan tâm | Có yếu tố THỬ THÁCH không? | 67 | 33 |
| 5 | ND nhiều người quan tâm | Có yếu tố XẾP HẠNG / CHẤM ĐIỂM không? | 33 | 33 |
| 6 | Kỹ thuật | Có kỹ thuật TƯƠNG PHẢN không? | **118** | 67 |
| 7 | Kỹ thuật | Có kỹ thuật NGẪU NHIÊN không? | **117** | 67 |
| 8 | Tự nhiên / Chân thật | Thể hiện sự TỰ NHIÊN / CHÂN THẬT không? | 67 | 67 |
| 9 | Nhân vật | Nhân vật có CHẤT ĐỜI không? (bác sĩ, thợ sửa xe, chủ quán ăn...) | 67 | **100** |
| 10 | Nhân vật | Nhân vật có CÁ TÍNH RÕ RÀNG không? (phong cách, giọng nói, ngôn ngữ cơ thể) | 33 | **100** |
| 11 | Góc quay | Góc quay có LẠ không? | 33 | 33 |
| 12 | Góc quay | Tạo cảm giác đang Ở TRONG câu chuyện không? | 33 | 33 |
| 13 | Góc quay | Thể hiện sự TRỰC QUAN, TỰ NHIÊN không? | 33 | 34 |
| 14 | Bối cảnh | Bối cảnh có HIẾM / LẠ không? | 33 | 33 |
| 15 | Bối cảnh | Tạo CẢM XÚC RÕ RÀNG ngay 3 giây đầu không? | 33 | 67 |
| 16 | Bối cảnh | PHÙ HỢP với nội dung không? | 33 | 33 |
| 17 | Âm thanh | Mở đầu có THU HÚT không? | 33 | 33 |
| 18 | Âm thanh | TRUYỀN TẢI cảm xúc mạnh hơn hình ảnh không? | 33 | 34 |
| 19 | Âm thanh | Tạo DẤU ẤN NHẬN DIỆN cho kênh không? | 34 | 33 |
| | | **TỔNG** | **1000** | **1000** |

Insight trọng số (để AI grader hiểu khi giải thích): HT-KH ăn điểm lớn ở **Kỹ thuật Tương phản + Ngẫu nhiên** (235đ); Kiến thức ăn điểm lớn ở **Nhân vật chất đời + cá tính** (200đ) — đúng bản chất: kênh giải trí thắng bằng kỹ thuật bất ngờ, kênh kiến thức thắng bằng con người đáng tin.

---

## 3. PHÂN TÍCH CHUYÊN SÂU — 18 câu (ĐÃ BUILD)

Áp cho **top video** đã chấm điểm cao. 4 nhóm, gợi ý lựa chọn nguyên văn:

**1. VỀ SẢN PHẨM / DỊCH VỤ**
1. Keyword brand nào xuất hiện trong clip? *(tên brand, hashtag, slogan)*
2. Vấn đề của người xem trong video này là gì? *(Đau / Tốn thời gian / Không biết chọn / Sợ sai / Muốn đẹp hơn / Muốn hiệu quả hơn)*
3. Sản phẩm / dịch vụ giúp giải quyết vấn đề nào?
4. Sản phẩm nên xuất hiện ở đoạn nào là hợp lý nhất? *(Đầu / Giữa / Cuối video)*
5. Sản phẩm xuất hiện bằng cách nào? *(Người thật đang dùng / Được nhắc tên / Nằm trong bối cảnh / Là kết quả cuối cùng / Là lời khuyên)*

**2. VỀ TONE & NGÔN NGỮ**
6. Nếu mình nói ngoài đời, mình có dùng câu này không? *(Có/Không)*
7. Có từ nào khách hàng hay dùng mà mình nên đưa vào không? *(liệt kê cụ thể)*
8. Mình muốn người xem cảm nhận mình là người như thế nào? *(Chuyên gia / Gần gũi / Vui vẻ / Thẳng thắn / Cao cấp / Thực tế / Truyền cảm hứng)*
9. Giọng nói trong video nên là: *(Dễ hiểu / Sâu sắc / Hài hước / Nhẹ nhàng / Dứt khoát / Chuyên môn / Đời thường)*

**3. VỀ HÌNH ẢNH & CẢM GIÁC**
10. Video nên quay ở đâu để đúng với doanh nghiệp mình? *(Văn phòng / Cửa hàng / Xưởng / Lớp học / Nhà khách hàng / Studio / Ngoài đời thật)*
11. Màu sắc nên tạo cảm giác gì? *(Sạch sẽ / Cao cấp / Trẻ trung / Ấm áp / Chuyên nghiệp / Gần gũi / Mạnh mẽ)*
12. Trong khung hình nên có những gì? *(Sản phẩm / Nhân sự / Khách hàng / Máy móc / Quy trình / Không gian / Kết quả thực tế)*
13. Có thứ gì KHÔNG nên xuất hiện vì làm giảm cảm giác thương hiệu? *(Bối cảnh lộn xộn / Ánh sáng xấu / Trang phục không phù hợp / Đạo cụ không liên quan)*

**4. VỀ NHÂN VẬT**
14. Ai nói nội dung này thì người xem sẽ tin nhất? *(Founder / Chuyên gia / Nhân viên / Khách hàng / Người dùng thật / KOC / Người dẫn chuyện)*
15. Người này có hiểu vấn đề đang nói không? *(Có/Không)*
16. Người này có liên quan trực tiếp đến sản phẩm/dịch vụ không? *(Có/Không)*
17. Người này xuất hiện để làm gì? *(Giải thích / Chứng minh / Chia sẻ trải nghiệm / Hướng dẫn / Tạo cảm xúc / Đại diện cho khách hàng)*
18. Nếu đổi người khác nói, nội dung có còn đáng tin không? *(Có/Không)*

---

## 4. TRẠNG THÁI CODE HIỆN TẠI (index.html, tab `v-skuld`)

### Schema
```js
S.dna.skuld = {
  scored: [ { title, link, desc, fmt: 'htkh'|'kt', score: 0-1000, checks: bool[19], at: 'YYYY-MM-DD' } ],
  deep:   { '<title>': string[18] },   // key = title của video đã chấm
  links:  [ { tep, goc, diem, tt, tn, xh, tp, up } ]  // B3 liên kết ý tưởng
}
```

### Functions đã có
- `SK_Q` (19 câu), `SK_W` (2 bộ trọng số — **bất biến, không sửa**), `renderScorecard()`, `skCalc()`, `skSave()`, `renderBoard()` — scorecard + dashboard rank
- `skAIScore()` — Gemini chấm từ mô tả, trả `{checks[19], giai_thich}`, user review-edit
- `DP_Q` (18 câu), `renderDpPick()`, `renderDpForm()`, `dpSave()`, `dpAI()` — phân tích chuyên sâu
- `lkAI()`, `lkSave()` — B3 liên kết ý tưởng; `lkSave()` tự đẩy ý tưởng nâng cấp vào ô Scorecard (vòng lặp: nâng cấp → chấm → đạt mới quay)
- Tất cả AI call: `gemini-2.5-flash`, `responseMimeType: application/json`, luôn kèm `brandContext()`

### Vòng lặp người dùng hiện tại
`Trạm 5 research → Trạm 6 chọn video win → SKULD C liên kết ý tưởng → Scorecard A chấm 1000đ → Dashboard rank → (tương lai) đẩy top vào GENERATE làm kịch bản`

---

## 5. ROADMAP PHÁT TRIỂN TIẾP (theo thứ tự ưu tiên)

### P1 — B4 Phân cấp ý tưởng (nối Scorecard → sản xuất)
Với mỗi ý tưởng ĐẠT (≥60%) trong `skuld.scored`: form 3 cấp định vị (I/II/III) × (Hình ảnh · Tone giọng · Phong cách · Tỉ lệ thành công % · Chi phí: diễn viên/bối cảnh/thiết bị/tổng). Nút AI đề xuất 3 cấp từ Channel DNA + desc (Cấp I luôn là phương án dùng nguồn lực sẵn có). Lưu `skuld.tiers[title]`. DoD: bảng so sánh 3 cấp cạnh nhau + chọn 1 cấp làm "phương án sản xuất".

### P2 — B1/B2 Phân tích sâu video viral (nâng cấp Trạm 5-6)
Thêm vào mỗi video ở Trạm 6: 4 câu why (dừng lại/xem hết/xem lại/điểm thành công) + khung B2 (Mở-Thân-Kết × Hình ảnh/Âm thanh, mỗi ô Chi tiết + Nổi bật). AI điền từ caption/transcript. Lưu `skuld.b2[videoLink]`.

### P3 — GENERATE v2 = B5+B7+B8+B9
Nâng cổng GENERATE hiện tại để ăn `skuld`: ý tưởng đã chấm đạt + cấp sản xuất đã chọn (B4) + 18 câu chuyên sâu → sinh: Plan Master (B5) · Khung kịch bản 3 phần (B7) · Kế hoạch tháng 28-30 video đúng cấu trúc cột B8 (KPI, tuyến nội dung, phụ trách, deadline) · Kịch bản chi tiết từng video đúng cột B9 (nội dung · hình ảnh thể hiện · TRÁM). Export .md + .csv.

### P4 — B6 + Dashboard vận hành (file "5. KẾ HOẠCH VÀ QUẢN LÝ" hoá web)
Checklist triển khai 8 hạng mục + Lịch tuần (kéo từ kế hoạch tháng) + nhập View/Follow/Lead/DT/Chi phí sau đăng + Data đo lường %KPI theo mục tiêu tháng (mặc định: 30 video · 100K view TB · 8K follow+ · 50 lead · 30M DT · hạn mức 21M). Đây là retention engine — user quay lại app hằng tuần.

### P5 — Connector hoá
Lịch tuần sync 2 chiều Google Sheets (Apps Script) · số liệu video kéo từ TikTok xlsx upload (parser đã có pattern ở Connection Hub) · về sau: Apify lấy view tự động.

## 6. NGUYÊN TẮC KHI PHÁT TRIỂN SKULD (bổ sung cho CLAUDE.md)
1. **Trọng số 19 câu và nội dung câu hỏi là BẤT BIẾN** — lấy từ giáo trình gốc, sai 1 điểm là sai chuẩn chấm toàn hệ thống.
2. Mọi thứ AI làm phải **review-editable** — AI điền vào form, người duyệt cuối, lưu mới tính.
3. Mọi bước mới ghi vào `S.dna.skuld.*` — GENERATE đọc từ đây, không tạo state song song.
4. Ý tưởng chỉ được sang bước sản xuất khi **Scorecard ≥60%** (gate cứng như các trạm ≥70đ).
5. Giữ single-file index.html cho tới khi sang phase Next.js (theo BLUEPRINT).
