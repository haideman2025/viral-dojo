# HANDOFF — Phối hợp giữa Design Claude (giao diện) và Claude Code (logic)

> Mục tiêu: 2 "Claude" nâng cấp VIRAL DOJO mà không giẫm chân. Đưa file này cho **Design Claude**.

## 1. Phân vai (ai sở hữu gì)
| Lớp | Chủ | Nội dung |
|---|---|---|
| 🎨 **Giao diện** | **Design Claude** | CSS (màu, layout, component, animation), markup mới của màn hình |
| ⚙️ **Logic** | **Claude Code** (repo) | JS: state, AI, gọi backend, 6 trạm, Lò, đồng bộ, export Flow |
| 🔗 **Tích hợp + deploy** | **Claude Code** | Ráp UI mới vào `index.html`, nối lại JS, test, deploy Pages, push main |

App là **1 file `index.html`** (HTML+CSS+JS chung) → Claude Code là **điểm hợp nhất**. Design Claude
KHÔNG chạy được JS/backend, nên hãy bàn giao **lớp nhìn**, Claude Code lo phần nối dây.

## 2. Hai cách bàn giao (chọn theo mức thay đổi)

### A) RESKIN — chỉ đổi CSS (an toàn nhất, ráp 1 phát)
Nếu chỉ làm app **đẹp hơn** mà giữ cấu trúc: Design Claude **chỉ sửa khối `<style>`**, **giữ
nguyên** hệ biến CSS + tên class (mục 3). → Claude Code chỉ việc **thay khối `<style>`**, JS &
markup không đụng → 0 xung đột. Đây là đường ưu tiên.

### B) COMPONENT MỚI — đổi cả layout/markup
Khi cần bố cục mới (vd "Con đường lên Đai Đen", dashboard cấp độ): Design Claude giao **HTML
snippet + CSS** của riêng khối đó. **Quy tắc bất biến để không vỡ logic:**
- **GIỮ NGUYÊN** mọi `id="..."` và `onclick="ten_ham(...)"` đang có trên các phần tử (JS bám
  vào đó). Restyle/đổi vị trí thoải mái, **đừng đổi tên id/hàm**.
- Nếu thêm nút mới cần chạy logic → đặt `onclick` rỗng/đánh dấu `data-todo="mô tả"`, Claude
  Code sẽ nối hàm.
- Nếu buộc phải đổi cấu trúc 1 khu → ghi chú rõ "khu này thay cho #id-cũ", Claude Code remap.

## 3. HỢP ĐỒNG GIAO DIỆN (giữ nguyên các tên này)

### Biến CSS (`:root`) — restyle giá trị thoải mái, GIỮ TÊN
```
--bg:#0c0f14  --card:#151b24  --card2:#1c242f  --bd:#2a3442
--tx:#e9eef4  --mut:#8fa0b3   --ac:#1fd1a8     --ac2:#16b894
--warn:#ffcf6b --red:#ff6b6b
```
JS & toàn bộ markup dùng các biến này → đổi màu app = đổi giá trị ở đây. Thêm biến mới OK,
đừng xoá/đổi tên biến cũ.

### Class vocabulary (giữ tên, restyle tự do)
`sec` (khối section) · `btn` (+ `ghost` `sm`) · `cc`/`conn` (thẻ kết nối) · `station`/`st`
(ô trạm) · `fb` (feedback box) · `row` (hàng wrap) · `pill` · `tag` · `lock` (khoá trạm) ·
`learn` (học nhanh) · `cách` (card ý tưởng) · `note` · `mut` (chữ phụ) · `sc` · `spin` (loading).

### Tabs & view containers (KHÔNG đổi)
7 tab dùng `data-v` và container `#v-<tên>`:
`home · lib · skuld · ops · dist · conn · dna`
(nút tab có class `tab` + `data-v="..."`; JS toggle `#v-...`). Đổi nhãn/icon OK, **giữ data-v
và id v-***.

### Phần tử động (JS đổ nội dung — giữ id)
JS render vào nhiều `#id` (vd `#forge-plan`, `#forge-scripts`, `#sk-board`, `#proj-sel`,
`#auth-head`, `#sync-badge`, `#gen-out`, …). Quy tắc: **nếu 1 vùng đang có `id` thì giữ id đó**;
Design Claude bọc/đổi style xung quanh được, chỉ đừng xoá id.

## 4. Luồng làm việc (tránh xung đột main)
1. Design Claude xuất kết quả (khối `<style>` mới, hoặc `index.html` reskin, hoặc snippet HTML+CSS).
2. Mày đưa cho Claude Code (dán hoặc gửi file).
3. Claude Code ráp trên **nhánh `design-ui`** (không sửa thẳng main), syntax-check + chạy thử,
   deploy 1 bản **preview** để mày xem.
4. Duyệt OK → merge `design-ui` vào `main` → deploy Pages chính.
5. Lặp lại theo từng đợt design.

> Vì Design Claude làm CSS/markup, Claude Code làm JS → diff tách bạch, merge gần như không đụng.

## 5. Định dạng bàn giao gọn nhất
- **Reskin:** chỉ cần **1 khối `<style>...</style>`** hoàn chỉnh (giữ class vocabulary mục 3).
- **Component mới:** `<style>` của khối + đoạn `<div>...</div>` markup, kèm ghi chú "gắn vào đâu /
  thay cho id nào".
- Tránh kèm `<script>` (đó là vùng của Claude Code).

## 6. Mày cần làm gì
Đưa file này cho Design Claude và nói: *"Reskin theo HỢP ĐỒNG GIAO DIỆN: giữ tên biến CSS +
class + data-v + id, chỉ đổi style. Component mới thì giữ id/onclick cũ."* Khi nó ra kết quả,
gửi mình → mình ráp trên nhánh `design-ui`, deploy preview cho mày duyệt.
