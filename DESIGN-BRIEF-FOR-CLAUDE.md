# PROMPT GIAO CHO CLAUDE (DESIGN) — Tái thiết kế UI/UX cho VIRAL DOJO

> Dán toàn bộ nội dung trong khối dưới đây cho Claude (chế độ design / code).
> Kèm theo file `app.html` (single-file) khi gửi.

---

## VAI TRÒ
Bạn là **Lead Product Designer + Front-end engineer** cho một sản phẩm SaaS thương mại.
Nhiệm vụ: **tái thiết kế toàn bộ UI/UX** của app `VIRAL DOJO` để nó trở thành **một ứng dụng thương mại hoàn hảo** — đẹp, hiện đại, dễ dùng, chuyển đổi cao — **mà KHÔNG làm hỏng bất kỳ tính năng nào đang chạy**.

## SẢN PHẨM LÀ GÌ
VIRAL DOJO = app "Learn-to-Ship" dạy + tự động hoá việc làm video TikTok bán hàng viral theo phương pháp **COREVIRAL (6 trạm)**. Người dùng: chủ shop / nhà sáng tạo / marketer Việt Nam, **không rành kỹ thuật**. Họ trả phí theo tháng (999k/tháng, VIP 1.999k/tháng) nên trải nghiệm phải xứng "trả tiền".
- Toàn bộ là **1 file `app.html` duy nhất** (HTML + CSS + JS inline), state lưu trong `localStorage['dojo']`, có đăng nhập bằng access-code + đồng bộ đa thiết bị qua Cloudflare Worker. Gọi Gemini API để sinh nội dung.
- Ngôn ngữ giao diện: **Tiếng Việt** (giữ nguyên).

## RÀNG BUỘC KỸ THUẬT — BẮT BUỘC TUYỆT ĐỐI (đọc kỹ, đây là phần dễ làm hỏng nhất)
JavaScript hiện tại điều khiển giao diện qua **id phần tử** và **onclick gọi tên hàm**. Vì vậy khi redesign:
1. **GIỮ NGUYÊN mọi `id="..."`** đang được JS đọc/ghi (vd `forge-plan`, `forge-actions`, `forge-fb`, `vp-fb`, `vqa-out`, `ttqa-out`, `gen-prog`, `dist-count`, `z-status`, `adm-out`, … và tất cả id khác). JS dùng `document.getElementById(...)` và `innerHTML` để bơm nội dung vào đúng các id này.
2. **GIỮ NGUYÊN mọi `onclick="tênHàm(...)"` và tên hàm JS.** Không đổi tên, không đổi chữ ký tham số. Nút nào đang gọi `cloneIdeaVariants()`, `gradeTitleTagsAll()`, `scoreForgeBatch()`… phải gọi đúng y vậy.
3. **GIỮ cơ chế chuyển tab** qua thuộc tính `data-v="home|lib|skuld|ops|dist|conn|dna"` trên `.tab` và các container `#v-home`, `#v-skuld`, … (ẩn/hiện bằng `display`). Có thể đổi hình thức nav nhưng **không đổi `data-v` và id container**.
4. **GIỮ các class mà JS tạo động trong innerHTML** (vd `.fb`, `.fb.bad`, `.pill`, `.tag`, `.mut`, `.cách`, `.spin`, `.st`, `.st.done`, `.st.cur`, `.btn`, `.btn.ghost`, `.btn.sm`, `.row`, `.learn`). Nếu đổi tên class, phải đổi đồng bộ trong CẢ chuỗi template JS — an toàn nhất là **giữ tên class cũ** và chỉ thay phần CSS định nghĩa chúng.
5. **Vẫn là 1 file HTML duy nhất**, không thêm framework/bundler, không thêm thư viện nặng. Chỉ HTML/CSS/JS thuần. Có thể dùng web-font Google Fonts (đang dùng `Bungee`, `Be Vietnam Pro`).
6. **Không đụng tới logic**: hàm gọi API, `runPool`, `AIJob`, `geminiCall`, accessor `S.dna/_pack/_flowManifest`, lưu/đồng bộ. Chỉ chạm HTML/CSS và (nếu cần) phần render tạo markup — nhưng nếu sửa render phải giữ đúng id/class/handler ở trên.
7. **Kiểm thử trước khi giao**: extract mọi khối `<script>` và chạy `node --check` (không lỗi cú pháp); mở thử app, bấm thử mỗi tab + vài nút chính để chắc không vỡ.

## MỤC TIÊU TRẢI NGHIỆM (UX) — biến nó thành app thương mại hoàn hảo
1. **Onboarding rõ ràng**: người mới mở app phải hiểu ngay "tôi đang ở đâu, làm gì tiếp theo". Có trạng thái rỗng (empty state) hướng dẫn từng bước, và một "next best action" nổi bật ở mỗi màn.
2. **Phễu hành trình mạch lạc** theo đúng luồng sản phẩm:
   `Kênh + Brand Kit → 6 Trạm COREVIRAL (mở khoá dần, cần ≥70đ) → Cổng GENERATE (sinh 30 ngày) → LÒ LUYỆN (dựng kịch bản → chấm → prompt video → bộ đăng bài) → Vận hành (KPI) → Phân phối (lên lịch)`. Thiết kế phải làm phễu này **trực quan như một bản đồ tiến trình** (progress / stepper), cho thấy đã xong gì, còn gì.
3. **Giảm tải nhận thức**: gom nhóm, progressive disclosure (ẩn bớt phần nâng cao như Lò A/B/C vào khu "công cụ nâng cao"), dùng tiêu đề + mô tả ngắn 1 dòng cho mỗi khối, thống nhất iconography.
4. **Phản hồi & trạng thái**: mọi tác vụ AI chạy nền cần spinner/progress rõ (đang có `forgeProg`, `AIJob`, `.spin`), thông báo thành công/lỗi nhất quán (khối `.fb`). Hãy chuẩn hoá thành hệ thống toast/feedback đẹp.
5. **Hệ thống thiết kế nhất quán** (design system): thang spacing, bo góc, bóng đổ, typographic scale, bảng màu, nút (primary / ghost / nhỏ / nguy hiểm), input, card, bảng, badge/pill, tab. Hiện app đang theo phong cách **"dojo brutalist"** (nền be/vàng, bóng đổ cứng offset 3-4px, font Bungee, chữ HOA, ẩn dụ võ đường/đai). Có **3 theme** (`theme-neon` mặc định, một bản xanh đậm, một bản teal).
6. **Responsive**: chạy đẹp trên **mobile** (người Việt dùng điện thoại nhiều) lẫn desktop. Tab nav, bảng, form phải gọn trên màn nhỏ.
7. **Cảm giác cao cấp / đáng tin** để hợp với app trả phí: chi tiết tinh tế, khoảng thở, hierarchy rõ, micro-interaction nhẹ nhàng, dark/light hài hoà.
8. **Tối ưu chuyển đổi**: chỗ nâng cấp gói (paywall/upsell `requirePremium`/`openUpgrade`) phải hấp dẫn, rõ giá trị, không gây khó chịu.

## ĐỊNH HƯỚNG THỊ GIÁC (chọn & đề xuất)
Bạn được quyền nâng cấp phong cách. Hãy đề xuất **2 hướng** rồi áp dụng hướng tốt hơn:
- **Hướng A — "Dojo hiện đại hoá"**: giữ DNA võ đường (đai, dojo, năng lượng), nhưng làm sạch sẽ – cao cấp hơn: bớt chữ HOA dày đặc, bóng đổ mềm hơn, spacing rộng, màu vàng-gold làm điểm nhấn trên nền trung tính sang.
- **Hướng B — "SaaS sạch hiện đại"**: phong cách product SaaS 2025 (như Linear/Notion/Framer): nền sáng/tối tinh, accent màu thương hiệu, card mềm, typography rõ ràng, vẫn giữ chút cá tính dojo ở logo & accent.
Giữ khả năng đổi theme (≥2 theme: sáng + tối). Đảm bảo tương phản đạt **WCAG AA**.

## BẢN ĐỒ TÍNH NĂNG / MÀN HÌNH PHẢI GIỮ ĐỦ (không được bỏ sót)
**Tab Dojo (`home`)**
- Nhật ký thuyền trưởng (hướng dẫn dùng) · Bước 0: Kênh của bạn · Hồ sơ Sản phẩm chuẩn (Brand Kit) · Bio đa nền tảng (TikTok/IG/Threads/FB/YT).
- **6 Trạm COREVIRAL** (mỗi trạm có rubric 100đ, cần ≥70đ mở trạm sau): T1 Nền móng/Chiến lược · T2 Đọc vị Series · T3 Keyword Brand & Insight Sale · T4 Bộ từ khoá · T5 Research nội dung viral ("ăn tiền") · T6 Phân tích & Liên kết (cổng vào GENERATE).
- **🚀 Cổng GENERATE**: Channel DNA → sinh gói 30 ngày content.

**Tab 📚 Tri thức (`lib`)**: lý thuyết VIRAL DOJO gốc + bài tập + 13 case study + toolkit.

**Tab 🥋 LÒ LUYỆN (`skuld`)** — trung tâm sản xuất:
- **Dây chuyền**: kế hoạch 30 ngày (nạp từ GENERATE) → 🎬 Dựng kịch bản chi tiết → 🧠 Chấm + xếp hạng (đạt ≥80%) → ♻️ Tạo lại kịch bản yếu (tự nhiều vòng) → 🧹 Xoá kế hoạch → **📑 Nhân bản ý tưởng → biến thể góc nhìn**.
- **Bộ prompt video Omni (Google Flow)**: mỗi prompt = 1 video 10s, ≥6 shot/≥60s, khoá nhân vật+sản phẩm, 🎥 sinh prompt cả loạt, 🧪 chấm điểm viral (QA, có tiêu chí "giống thật/tự nhiên"), 🎬 tạo lại video yếu.
- **Bộ đăng bài**: caption / hashtag / nhạc + **🏷 Chấm điểm Tiêu đề + Hashtag (Viral Score) · 🔄 Chấm lại · ✨ Tối ưu tiêu đề/hashtag yếu** (dashboard `#ttqa-out`).
- **Công cụ nâng cao**: Lò A (soi & chỉnh điểm 1 kịch bản), Lò B (phân tích 18 câu), Lò C (nâng cấp ý tưởng yếu), Dashboard xếp hạng ý tưởng (Xuất sắc ≥80 / Tốt / TB / Cần cải thiện).

**Tab 📊 Vận hành (`ops`)**: KPI mục tiêu tháng (sửa được) · Dashboard đo thực tế vs KPI · Lịch đăng B8 30 ngày.

**Tab 📤 Phân phối (`dist`)**: kết nối Zernio · ⚡ lên lịch hàng loạt (rải 30 ngày) · ➕ thêm 1 video thủ công · bảng lịch đã lên (xuất CSV).

**Tab ⚡ Kết nối (`conn`)**: nhập API key (Gemini), kết nối dịch vụ, (khu admin access-code nếu có).

**Tab 🧬 Channel DNA (`dna`)**: file "sống" lớn dần qua 6 trạm.

Ngoài ra: hệ thống **đăng nhập access-code**, **đồng bộ đa thiết bị**, **chọn theme**, **chọn dự án / không gian làm việc** (multi-project), **paywall nâng cấp gói**, **thông báo khi job AI xong**. Tất cả phải còn nguyên.

## DELIVERABLES (giao gì)
1. **File `app.html` đã redesign** — chạy được ngay, giữ 100% tính năng & móc nối JS như ràng buộc trên.
2. Mô tả ngắn **design system** mới (màu, font, spacing, component) và **lý do** chọn hướng A/B.
3. Danh sách **những gì đã đổi** (UI) và **xác nhận không đổi** (logic/id/handler).
4. (Tuỳ chọn) Ảnh/markup mô tả màn chính ở mobile + desktop.

## TIÊU CHÍ NGHIỆM THU (acceptance)
- [ ] Mọi tab mở được; mọi nút bấm gọi đúng hàm cũ; không lỗi console.
- [ ] `node --check` qua trên mọi khối `<script>` (không lỗi cú pháp).
- [ ] Không mất tính năng nào trong "Bản đồ tính năng" ở trên.
- [ ] Đẹp + nhất quán + responsive (mobile & desktop), tương phản đạt AA.
- [ ] Onboarding & phễu hành trình rõ ràng; có empty state + next-best-action.
- [ ] Giữ đăng nhập, đồng bộ, đa dự án, theme, paywall hoạt động.

## CÁCH LÀM ĐỀ XUẤT
Làm **từng tab một**, sau mỗi tab tự kiểm thử rồi mới sang tab kế, để dễ phát hiện chỗ vỡ. Ưu tiên thứ tự: `home → skuld → (dist/ops) → conn/dna/lib`. Khi đụng phần render bằng JS (innerHTML), chỉ đổi class/markup khi chắc chắn cập nhật đồng bộ ở cả CSS lẫn template JS; nếu không chắc thì **giữ nguyên markup, chỉ đổi CSS**.
