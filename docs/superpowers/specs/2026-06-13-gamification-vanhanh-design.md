# Gói G (Gamification) + Gói E (Vận hành) — design

**Ngày:** 2026-06-13 · **File:** `index.html` · Layer thêm, không sửa luồng đang chạy. Giữ palette teal-dojo + nhấn gold.

## GÓI G — Gamification (làm trước)
**Điểm DERIVED từ `S.dna` (idempotent, không double-count):** `calcXP()`:
- onboard có ngành: +50
- mỗi trạm m1–m6 có điểm: + điểm số; nếu ≥70 (PASS): +50 bonus
- brand vault: +15/nguồn (cap 8)
- Trạm 5: +3/video (cap 20) — `S.dna.m5.videos`
- Lò: +3/ý tưởng đã chấm (cap 40) `skuld.scored`; +25/kịch bản `skuld.scripts`; +30/phân tích sâu `skuld.deep`
- GENERATE: +150 nếu `skuld.scored` có `from:'gen'`
- Gói E: +15/video đã đăng có view>0 `ops.posts`

**Đai (BELTS):** 🤍 Trắng 0 · 🟡 Vàng 250 · 🟠 Cam 550 · 🟢 Lục 950 · 🔵 Lam 1450 · 🟤 Nâu 2100 · ⚫ Đen 3000. `beltOf(xp)` → {belt,next,idx}.
**Huy hiệu (BADGES, derived):** nhập môn · tư duy gia (6 trạm pass) · cao thủ (trạm ≥90) · thợ săn (≥20 video) · nhà máy (gen) · biên kịch (≥1 kịch bản) · vận hành (≥1 video có view) · hắc đai (xp≥3000).

**UI (CSS thêm + 2 container):** header `#xp-head` (đai + thanh XP + tổng điểm) · home `#journey` (đai, progress, huy hiệu) · toast `.xptoast` "+X điểm" / "🎉 Lên đai".
**Hàm:** `calcXP, beltOf, calcBadges, renderXP, xpToast, xpTick`. Hook `xpTick()` cuối `save()`. Init: `if(S.dna.xpSeen==null) S.dna.xpSeen=calcXP()` (không toast progress cũ) + `renderXP()`.

## GÓI E — Tab 📊 Vận hành
**State:** `S.dna.ops = {kpi:{video:30,view:100000,follow:8000,lead:50,dt:30000000,chiphi:21000000}, posts:[{day,title,status,link,view,follow,lead,dt,chiphi}]}`.
- Tab mới `📊 Vận hành` (nav array thêm `'ops'`, view `#v-ops`).
- `opsImportPlan()` — dựng 30 dòng từ `skuld.scored` (from:'gen') hoặc scripts: ngày · tiêu đề · trạng thái (Chưa quay/Đã quay/Đã đăng) · link.
- Nhập sau đăng: View/Follow/Lead/DT/Chi phí mỗi dòng → `opsSave()`.
- `renderOpsDashboard()` — tổng thực tế vs KPI tháng → %KPI từng chỉ số (progress bar) · ROI=DT/chi phí · video đăng/30. KPI sửa được.
- Hàm: `renderOps, opsImportPlan, opsSave, renderOpsDashboard`. Tab mở gọi `renderOps()`.

## Bất biến / verify
Chỉ THÊM (CSS + hàm + tab + 2 container). Mọi state vào `S.dna.*`. Single-file. Verify: `node --check`; unit-test calcXP/beltOf/gate; xác nhận không dup id/func sau khi thêm.
