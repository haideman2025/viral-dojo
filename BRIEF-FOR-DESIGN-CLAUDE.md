# BRIEF cho Design Claude — Hướng dẫn sử dụng + Mini-game chờ AI (theme Grand Line)

> Đưa file này cho Design Claude. Mục tiêu: app "vừa làm việc vừa chơi" — khi AI chạy nền
> (dựng kịch bản, chấm điểm, xuất Flow…) người dùng chơi game nhỏ giải trí, xong có âm báo.
> Phân vai: **Design Claude** làm phần A (hướng dẫn) + phần B (game HTML self-contained).
> **Claude Code** lo: gắn game vào đúng lúc AI chờ + âm báo hoàn thành (đã có sẵn).

## QUY TẮC CHUNG (bắt buộc, để Claude Code ráp được)
- Theme **Grand Line / hải tặc** đồng bộ app: dùng biến CSS sẵn có `--bg --card --card2 --bd --tx --mut --ac --ac2 --warn --red --blue --gold --orange --purple --px --hi --lo --sf --line --glass`. KHÔNG hardcode màu.
- Mỗi sản phẩm là **1 KHỐI HTML SELF-CONTAINED**: `<div>` markup + `<style>` (class/id có tiền tố riêng, vd `g1-...`) + `<script>` (bọc IIFE, biến cục bộ, KHÔNG đụng biến toàn cục của app).
- KHÔNG dùng thư viện ngoài (no CDN, no framework). Vanilla JS + Canvas hoặc DOM. Chạy offline.
- Âm thanh: tái dùng `window.VDsfx` đã có (`VDsfx.click/coin/win/...`) — đừng tự tạo AudioContext mới.
- Mobile-friendly (chạm được), 9:16 vừa khung ~320–360px chiều rộng.

---

## PHẦN A — Mục "Hướng dẫn sử dụng" (Nhật ký hải trình)
1 section mới (dùng class `.sec` của app) tên kiểu **"📜 Nhật ký thuyền trưởng — Cách dùng"**, gồm:
- **Bản đồ hành trình ngắn**: 6 trạm (Đảo 1→6) + Lò (Xưởng tàu) + Phân phối — mỗi bước 1 dòng "làm gì".
- **3 bước nhanh để bắt đầu**: (1) Kết nối Gemini key, (2) Làm Trạm 1→6 (AI chấm ≥70 mở trạm sau), (3) GENERATE 30 ngày → Lò dựng kịch bản → Xuất cho Flow.
- **FAQ ngắn** (4–6 câu): key lưu ở đâu, đồng bộ đa thiết bị thế nào, xuất Flow ra sao, vì sao cần ≥70đ…
- Dạng accordion (mở/đóng) như `.learn`/`.step` cho gọn.
- Giao nộp: 1 khối `<section class="sec">…</section>` (markup + style nếu cần). Claude Code sẽ chèn vào tab Dojo (đầu trang) hoặc tab Tri thức.

## PHẦN B — 2–3 Mini-game "chờ AI" (theme hải tặc)
Mỗi game là 1 khối self-contained, **kích thước gọn** (cao ~360–420px), có:
- Nút **Bắt đầu / Chơi lại**, hiển thị **điểm**, lưu **high-score** vào localStorage key riêng (vd `g1_best`).
- API tối thiểu để Claude Code điều khiển: expose `window.VDGame1 = { mount(elId), start(), stop(), isRunning() }` (tương tự cho game 2,3). `stop()` để khi AI xong thì tạm dừng.
- Gợi ý 3 game (chọn 2–3, đơn giản, vui):
  1. **🪙 Hứng vàng** (Catch): rương/đồng vàng rơi, kéo thuyền hứng — miss 3 lần là thua.
  2. **🎯 Bắn pháo hải tặc** (Whack/Tap): mục tiêu (sọ, mòng biển) hiện ngẫu nhiên, chạm để ghi điểm trong 30s.
  3. **🃏 Lật thẻ kho báu** (Memory): cặp thẻ biểu tượng hải tặc, lật trúng cặp.
- Mỗi lần ghi điểm gọi `VDsfx.coin()`, thắng gọi `VDsfx.win()`.
- Giao nộp: mỗi game 1 khối `<div id="game-1">…</div>` + style (prefix) + script (IIFE expose VDGame1). Claude Code sẽ nhúng vào "modal chờ AI".

## Cách Claude Code sẽ ráp (để Design Claude hiểu ngữ cảnh)
- Khi user bấm tác vụ AI dài (dựng/chấm/xuất Flow), Claude Code mở 1 modal "⏳ AI đang ra khơi…" chứa 1 mini-game (chọn ngẫu nhiên trong các VDGameN).
- AI xong → đóng modal + gọi `vdNotifyDone('...')` (kèn thắng + toast) — phần này ĐÃ XONG bên Claude Code.
- Vì game expose mount/start/stop, Claude Code chỉ cần gọi đúng vòng đời.

---
**Tóm tắt cho Design Claude:** làm (A) 1 section hướng dẫn `.sec`, và (B) 2–3 mini-game HTML self-contained (prefix class/id, IIFE, expose `VDGameN.mount/start/stop`, dùng `VDsfx`, biến CSS theme). Giao từng khối — Claude Code ráp + gắn vòng đời + đã có âm báo hoàn thành.
