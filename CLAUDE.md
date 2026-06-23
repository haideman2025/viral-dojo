# CLAUDE.md — VIRAL DOJO

> Hướng dẫn cho mọi AI/dev làm việc trên repo này. Đọc trước khi sửa code.
> Nguồn sự thật chi tiết: [docs/BLUEPRINT.md](docs/BLUEPRINT.md) (product spec) · [coreviral-tri-thuc.html](coreviral-tri-thuc.html) (giáo trình + rubric gốc).

---

## 1. Sản phẩm & Kiến trúc hiện tại

**VIRAL DOJO** — ứng dụng *Learn-to-Ship*: người dùng học xây kênh TikTok viral theo giáo trình **COREVIRAL (6 trạm)**, thực hành ngay trong app, **AI chấm điểm theo rubric 100đ**, kết thúc bằng 1 kênh hoàn chỉnh + 30 ngày content (cổng GENERATE).
Định vị: **"Đừng học về viral. Hãy ship một kênh viral."**

### Kiến trúc
- **Single-file HTML** — toàn bộ app nằm trong [index.html](index.html) (HTML + CSS `<style>` + vanilla JS `<script>`). Mở file bằng browser là chạy, **không server, không build step**.
- **Vanilla JS thuần** — không framework, không bundler, không dependency.
- **State trong localStorage**, key `"dojo"`. Đối tượng toàn cục `S` được load/persist:
  ```js
  S = { dna: {...}, keys: {...} }        // localStorage['dojo']
  S.keys = { gemini, apify }             // API key của user, chỉ lưu phía client
  ```
- **Schema Channel DNA** (`S.dna` — file JSON sống, lớn dần qua từng trạm):
  ```js
  S.dna = {
    onboard: { nganh, kenh, khach },     // Bước 0
    brand:   [ {name, size, content} ],  // Brand Vault — bối cảnh AI
    m1:      { chienluoc, dinhdang, chude, matrix:[{cach, ytuong[]}] },
    // m2..m6 sẽ thêm khi build các trạm sau (mỗi trạm 1 key)
    scores:  { m1: <0-100>, ... }        // điểm rubric từng trạm
  }
  ```
  > Lưu ý: code hiện tại khởi tạo `S.dna = {onboard:{}, m1:{}, scores:{}}` và thêm `brand[]` runtime. Khi build trạm mới, thêm `m2..m6` vào đúng pattern này.

### Các khối chính trong index.html
- **4 tab/view**: `home` (Dojo — stations + onboard + trạm), `lib` (📚 Tri thức → deep-link sang coreviral-tri-thuc.html), `conn` (⚡ Kết nối — Connection Hub), `dna` (🧬 Channel DNA — xem/export JSON).
- **Thanh stations**: `renderStations()` + `ST_NAMES` (7 ô: 6 trạm + 🚀 GENERATE). Trạm done khi điểm ≥70.
- **Brand Vault**: `addBrandFiles()` / `addBrandPaste()` / `renderVault()` → nạp dữ liệu thương hiệu đa định dạng (txt/md/csv/json/html/paste) vào `S.dna.brand`.
- **`brandContext(maxLen)`**: hàm sinh bối cảnh thương hiệu — **PHẢI nhúng vào mọi AI prompt**.
- **3 nút AI Trạm 1**: `autoFill()` (🤖 tự làm hết) · `coach()` (💬 hướng dẫn) · `grade()` (🧠 chấm rubric).
- **Grader**: `gradeGemini()` (chấm sâu khi có key) + `gradeLocal()` (heuristic offline fallback). Hằng số `RUBRIC` chứa rubric Trạm 1.
- **Connection Hub**: `saveKey()` — lưu + test key Gemini/Apify (key lưu localStorage, không gửi server).
- **AI engine hiện tại**: Gemini `gemini-2.5-flash` qua REST (`generativelanguage.googleapis.com`), key của user.

### Trạng thái build
- ✅ **Trạm 1 hoàn chỉnh**: học nhanh + matrix builder + 3 nút AI + rubric grader + lưu/khôi phục localStorage.
- ✅ Onboarding, Brand Vault, Connection Hub (Gemini + Apify + TikTok Shop CSV upload), Channel DNA export.
- 🔒 **Trạm 2–6**: chưa build (Trạm 2 mới có ô khoá `#m2lock`). Cổng GENERATE: chưa build.

---

## 2. NGUYÊN TẮC BẤT BIẾN (không vi phạm)

1. **MVP = single-file**: giữ toàn bộ trong [index.html](index.html) — vanilla JS, **KHÔNG framework, KHÔNG build step, KHÔNG dependency**. Mở file là chạy. (Chuyển Next.js + Supabase chỉ ở phase 2 theo roadmap — không tự ý làm sớm.)
2. **Bảo mật key**: mọi API key (Gemini, Apify, …) lưu **localStorage phía user**. **TUYỆT ĐỐI không hardcode key, không commit secret** vào repo. App nói chuyện trực tiếp với API chính chủ, không qua server trung gian.
3. **Mọi trạm theo đúng pattern Trạm 1**:
   - **Học nhanh** trong `<details class="learn">` (10 phút) + **deep-link** sang `coreviral-tri-thuc.html#<anchor>` để học sâu.
   - **Form thực hành** đúng việc-cần-làm của module.
   - **3 nút AI**: 🤖 *AI tự làm hết* (kết quả editable, user duyệt cuối) · 💬 *AI hướng dẫn/gợi ý* (không chấm) · 🧠 *Nộp bài — AI chấm theo rubric*.
   - **Đạt ≥70đ → mở trạm sau** (gate). Số lần nộp không giới hạn ở MVP.
4. **Rubric lấy NGUYÊN VĂN** từ [coreviral-tri-thuc.html](coreviral-tri-thuc.html) — **không tự chế tiêu chí/điểm**. (Bảng rubric chuẩn ở mục 5 dưới.)
5. **Output ghi vào `S.dna`** (Channel DNA) qua `save()`. **Trạm sau đọc dữ liệu trạm trước** (vd Trạm 5 dùng keyword Trạm 4; Trạm 6 dùng video Trạm 5).
6. **AI prompt luôn kèm `brandContext()`** làm bối cảnh — kể cả autofill, coach, lẫn grade ("thực tiễn" phải đối chiếu dữ liệu thương hiệu thật).
7. **UI tiếng Việt**, **dark theme hiện có** — dùng CSS variables sẵn (`--bg --card --card2 --bd --tx --mut --ac --ac2 --warn --red --blue`), tái dùng class sẵn (`.sec .btn .cc .fb .sc .station .st`...). **Mobile-friendly** (`.row` wrap, `max-width:860px`).
8. **Fallback offline**: nút chấm vẫn hoạt động khi chưa có key (heuristic `gradeLocal`-style) — không để app "chết" khi thiếu connector.

---

## 3. Quy ước commit

`feat:` / `fix:` / `docs:` + mô tả **tiếng Việt ngắn**. Ví dụ:
- `feat: thêm Trạm 2 — đọc vị series + AI verify`
- `fix: brandContext bị cắt khi nhiều nguồn brand`
- `docs: cập nhật roadmap Trạm 5 trong BLUEPRINT`

Không commit key/secret. `.gitignore` đã loại `node_modules/`, `*.log`, `.DS_Store`.

---

## 4. Definition of Done — mỗi trạm

Một trạm coi là xong khi **tất cả** đạt:
- [ ] **Form hoạt động**: nhập/sửa/xoá/thêm đúng việc-cần-làm của module.
- [ ] **3 nút AI chạy**: 🤖 tự làm hết · 💬 hướng dẫn · 🧠 chấm rubric — đều gọi Gemini kèm `brandContext()`, có fallback khi thiếu key.
- [ ] **Lưu & khôi phục từ localStorage**: reload trang giữ nguyên bài làm (đọc lại từ `S.dna.m*` trong `init()`).
- [ ] **Cập nhật thanh stations**: điểm hiển thị, đạt ≥70đ thì mở trạm kế (bỏ ô `#m<n>lock`, hiện `#m<n>`).
- [ ] **Test bằng cách mở file trực tiếp** trong browser (không server) — không lỗi console, chạy được cả khi chưa kết nối Gemini.
- [ ] Rubric đúng nguyên văn module tương ứng; output ghi vào `S.dna`.

---

## 5. Rubric chuẩn 6 trạm (nguyên văn từ coreviral-tri-thuc.html)

> Tổng mỗi trạm = 100đ. Gate mở trạm sau: **≥70đ** (app). *Lưu ý: giáo trình gốc khuyến nghị tự chấm ≥80đ mới qua — giữ 70đ cho UX MVP, có thể siết sau.*

**Trạm 1 — Chiến lược & Định dạng kênh** (`#lotrinh`, Module 1)
Cấu trúc 20 · Sáng tạo 20 · Thực tiễn 30 · Số lượng 10 (≥5 cách ×≥3 ý tưởng) · Đa dạng & logic 20.

**Trạm 2 — Phân biệt Series** (Module 2)
Đầy đủ cấu trúc (Link·Chủ đề·Cách thể hiện) 20 · **Đúng series 50** · Số lượng (≥3 series/kênh) 30.

**Trạm 3 — Keyword Brand & Insight Sale** (Module 3)
Thông điệp cốt lõi (≥3 keyword brand + ≥3 insight sale) 40 · Ý tưởng chứng minh (≥5/insight) 25 · Dấu ấn riêng 5 · Logic & bám chiến lược 30. *Insight Sale 5 tầng: Nỗi đau → Rào cản → Mong đợi → Tự hào → Thúc đẩy.*

**Trạm 4 — Bộ từ khóa** (Module 4)
Đủ danh mục (8–9) 20 · Đủ số lượng (mỗi mục ≥5, tổng ≥30) 20 · Sát insight khách 30 · Khả năng triển khai 30. *8 danh mục: Sản phẩm · Phân khúc giá · Sở thích · Ngành hàng · Nghề nghiệp · Nhu cầu · Mục đích cuối · Hình thức thể hiện.*

**Trạm 5 — Research nội dung viral** (Module 5)
Đúng & đủ số lượng (đúng nguồn · ≥500k view/35k tim · ≥20 video) 10 · **Tỷ lệ thành công cao (series · Thử nghiệm/Thử thách/Xếp hạng/Chấm điểm) 50** · Đầy đủ thông tin 10 · Bám insight DN 10 · Khả năng ứng dụng 20.

**Trạm 6 — Phân tích & Nâng cấp** (Module 6)
Đủ số lượng (≥2 video phân tích) 20 · Đúng điểm thành công 30 · Nâng cấp ý tưởng (≥1) 20 · Áp dụng vào DN 30.

---

## 6. Connection Hub — connector (MCP-style, key phía user)

| Connector | Nuôi trạm | Trạng thái |
|---|---|---|
| Gemini API (REST, key user) | Tất cả — grader/coach/autofill/dịch | ✅ có |
| Apify (token user) | 2·3·5 — cào TikTok/Douyin + VoC comment | ✅ test key, ⏳ chưa cào |
| TikTok Shop export (xlsx/CSV) | 6 + dashboard — GMV/đơn benchmark | ⏳ MVP nhận CSV |
| Pipeboard/Meta Ads · Google Sheets · Cloudflare Pages | sau tốt nghiệp / Generate | ⏳ phase sau |

Triết lý: mỗi connector là 1 cổng dữ liệu độc lập, thêm nguồn mới không sửa core. Key lưu localStorage, app không giữ key trên server.

---

## 7. Phối hợp Design Claude ↔ Claude Code (2 AI cùng làm)

Xem chi tiết: [HANDOFF-DESIGN.md](HANDOFF-DESIGN.md).

- **Design Claude** sở hữu **lớp nhìn**: khối `<style>` + markup mới. **Claude Code** sở hữu **JS/logic + tích hợp + deploy**.
- **Hợp đồng giao diện (bất biến)**: giữ nguyên tên **biến CSS** (`--bg --card --ac --ac2 --warn --red --tx --mut --bd --card2`), **class vocabulary** (`sec btn cc station st fb row pill tag lock learn cách note mut sc spin`), **tab `data-v`** (`home lib skuld ops dist conn dna`) + container `#v-*`, và **mọi `id` / `onclick` đang có** (JS bám vào). Restyle/đổi layout thoải mái, đừng đổi các tên này.
- **Luồng**: Design xuất CSS/markup → Claude Code ráp trên nhánh `design-ui` → deploy preview → duyệt → merge `main`. Reskin = chỉ thay `<style>` (0 xung đột). Component mới = giữ id/onclick cũ, Claude Code nối dây.
