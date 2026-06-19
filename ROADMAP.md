# VIRAL DOJO — Kế hoạch nâng cấp: Đa dự án & Thương mại hoá (MCP/CLI)

> Tài liệu kế hoạch. CHƯA động vào code app. Mục tiêu: (A) cho phép tạo nhiều dự án/pack
> nội dung độc lập ngay trong app hiện tại, (B) lộ trình biến app thành nền tảng thương mại
> mà agent có thể điều khiển qua MCP/CLI.
>
> **Quyết định đã chốt:** API key (Gemini/Apify…) **dùng chung cho mọi dự án** (khai báo 1 lần ở tab Kết nối).

---

## 0. Hiện trạng kiến trúc (điểm xuất phát)

- App là **1 file `index.html`** (HTML + CSS + JS thuần), chạy hoàn toàn ở trình duyệt.
- **1 state global duy nhất**:
  - `index.html:511` — `const S = JSON.parse(localStorage.getItem('dojo')||'{}')`
  - `index.html:512` — `S.dna = S.dna || {onboard:{}, m1:{}, scores:{}}`
  - `index.html:515` — `save()` ghi **cả `S`** vào đúng 1 key localStorage `dojo`, rồi re-render.
- Mọi dữ liệu nằm trong `S.dna`: `onboard`, `m1..m6`, `scores`, `brand` (Brand Vault),
  `skuld` (scorecard, `scripts`, `vprompts`, `vref`)…
- API key nằm ở `S.keys` (gemini, apify).

**Hệ quả:** app chỉ ôm được **1 dự án/1 kênh**. Tạo kênh mới = phải xoá DNA cũ (`resetDNA`).

---

## PHẦN A — Đa dự án / Đa pack (làm ngay trong app, rủi ro thấp)

### A.1. Ý tưởng cốt lõi (vì sao rẻ)

Thay vì sửa hàng trăm chỗ gọi `S.dna.xxx`, ta giữ nguyên toàn bộ code cũ bằng cách biến
`S.dna` thành **getter trỏ vào dự án đang mở**. Code cũ chạy y nguyên — chỉ là giờ đọc/ghi
vào dự án `activeId`.

### A.2. Mô hình dữ liệu v2 (localStorage key `dojo`)

```jsonc
{
  "v": 2,                          // version để migrate
  "activeId": "proj_ab12",         // dự án đang mở
  "keys": { "gemini": "...", "apify": "..." },   // DÙNG CHUNG mọi dự án (chốt)
  "projects": {
    "proj_ab12": {
      "name": "Kênh IDC L1-A",
      "createdAt": "2026-06-19",
      "updatedAt": "2026-06-19",
      "dna": { /* đúng cấu trúc S.dna cũ: onboard, m1..m6, scores, brand, skuld... */ }
    },
    "proj_xy34": { "name": "Kênh Mỹ phẩm", "createdAt": "...", "dna": { ... } }
  }
}
```

- `keys` nằm ở **cấp gốc** (ngoài `projects`) → dùng chung, đúng quyết định đã chốt.
- Mỗi `projects[id].dna` = 1 lần chạy COREVIRAL độc lập = 1 kênh/pack riêng.

### A.3. Cơ chế tương thích (getter)

```js
// Sau khi load + migrate:
Object.defineProperty(S, 'dna', {
  configurable: true,
  get(){ return S.projects[S.activeId].dna; },
  set(v){ S.projects[S.activeId].dna = v; }   // giữ importDNA() chạy được
});
```

- `set` cần có để `importDNA()` (`index.html:1457`, `S.dna=d`) vẫn hoạt động — sẽ nạp vào
  dự án đang mở thay vì ghi đè toàn cục.
- `S.keys` giữ nguyên ở gốc — không đổi gì.

### A.4. Migration tự động (không mất dữ liệu)

Chạy ngay sau dòng load `S` (`index.html:511`), TRƯỚC khi định nghĩa getter:

```js
function migrateV2(){
  if(S.v === 2 && S.projects) return;          // đã v2
  // format cũ: S.dna rời + S.keys
  const oldDna = S.dna || {onboard:{}, m1:{}, scores:{}};
  const oldKeys = S.keys || {};
  const id = 'proj_' + Math.random().toString(36).slice(2,8);
  // Xoá field cũ khỏi gốc rồi dựng lại
  for(const k of Object.keys(S)) delete S[k];
  S.v = 2; S.activeId = id; S.keys = oldKeys;
  S.projects = { [id]: {
    name: oldDna.onboard?.kenh || oldDna.onboard?.nganh || 'Dự án 1',
    createdAt: today(), updatedAt: today(), dna: oldDna
  }};
  localStorage.setItem('dojo', JSON.stringify(S));
}
```

> ⚠️ Lưu ý implement: vì `S` là `const` và ta `delete` field rồi gán lại, phải thao tác
> **trên cùng object `S`** (không reassign). Getter `S.dna` định nghĩa **sau** migrate.

### A.5. Hàm quản lý dự án (mới)

```js
function projList(){ return Object.entries(S.projects).map(([id,p])=>({id,...p})); }
function projNew(name){ /* tạo dna rỗng, set activeId, save, reload views */ }
function projSwitch(id){ S.activeId=id; save(); rerenderAll(); }
function projRename(id,name){ ... }
function projDuplicate(id){ /* deep-copy dna sang id mới — hợp để A/B 1 brand */ }
function projDelete(id){ /* chặn xoá dự án cuối cùng; confirm */ }
function rerenderAll(){ renderStations(); renderOverview(); renderDNA(); refreshGates();
  renderScorecard(); renderForgePlan(); renderScripts(); renderVRef(); renderVPrompts(); }
```

### A.6. UI cần thêm

1. **Thanh chọn dự án** ở header (cạnh tabs hoặc ngay dưới): `<select>` danh sách dự án +
   nút ➕ Tạo mới · ✏️ Đổi tên · 📑 Nhân bản · 🗑 Xoá.
2. Hiển thị tên dự án đang mở ở đầu khu "Bước 0".
3. Export/Import: thêm lựa chọn **export 1 dự án** vs **export cả workspace** (`exportDNA`
   ở `index.html:1448` hiện export `S.dna` — vẫn đúng cho "1 dự án").

### A.7. Điểm chạm code (checklist sửa)

- [ ] Sau `index.html:511`: thêm `migrateV2()` + `Object.defineProperty(S,'dna',…)`.
- [ ] `save()` (`:515`): không đổi logic ghi (vẫn `JSON.stringify(S)`), nhưng cập nhật
      `S.projects[S.activeId].updatedAt`.
- [ ] `resetDNA()` (`:1462`): đổi thành "xoá dự án hiện tại" thay vì xoá sạch localStorage.
- [ ] `importDNA()` (`:1452`): nạp vào dự án đang mở (getter set lo việc này).
- [ ] Thêm khối UI project switcher + 5 hàm `proj*` + `rerenderAll`.
- [ ] `xpTick`/badge (`:687` ghi thẳng localStorage) — kiểm tra vẫn ghi đúng cả `S`.

### A.8. Test checklist

- [ ] Mở app có dữ liệu cũ → tự migrate thành 1 dự án, **không mất tiến độ**.
- [ ] Tạo dự án mới → trắng tinh, không dính dữ liệu dự án cũ.
- [ ] Chuyển qua lại 2 dự án → mỗi cái giữ riêng scores/Brand Vault/scripts.
- [ ] Nhân bản dự án → bản sao độc lập, sửa bản sao không ảnh hưởng gốc.
- [ ] Key Gemini khai 1 lần → cả 2 dự án đều dùng được (dùng chung).
- [ ] Sinh prompt video ở dự án A không lẫn sang B.
- [ ] Export/Import 1 dự án hoạt động.

**Ước lượng:** ~1 buổi. Rủi ro thấp nhờ getter giữ tương thích ngược.

---

## PHẦN B — Thương mại hoá + điều khiển qua MCP/CLI

### B.0. Nguyên lý

> **MCP và CLI chỉ là 2 cái "vỏ" gọi vào cùng 1 API.**
> Nên thứ phải xây trước KHÔNG phải MCP, mà là: **(1) tách engine khỏi UI** + **(2) backend
> có API ổn định**. Có API rồi thì MCP/CLI gần như miễn phí.

App hiện tại không thể cho agent điều khiển vì: logic dính DOM (`document.getElementById`),
dữ liệu ở localStorage (không chia sẻ/không truy cập từ xa), không có auth/API.

### B.1. Các lớp cần nâng (theo thứ tự ưu tiên)

| # | Lớp | Vì sao bắt buộc | Công nghệ gợi ý |
|---|-----|-----------------|-----------------|
| 1 | **Tách "COREVIRAL Engine"** | Lõi logic + prompt đang lẫn trong DOM. Agent không có DOM. Tách module thuần (input→output JSON) để Web/CLI/MCP **dùng chung**. | TS module, zero DOM dependency |
| 2 | **Backend đa tenant + DB** | localStorage không chia sẻ, không cho truy cập từ xa. | Cloudflare **Workers + D1 (SQL) + R2 (file Vault) + KV** |
| 3 | **Auth & phân quyền** | Nhiều user/team; agent cần token có scope. | OAuth2 + API token, RBAC (owner/editor/viewer), scope `packs:read packs:write gen:write` |
| 4 | **API ổn định (REST/GraphQL)** | Hợp đồng cứng cho Web/CLI/MCP cùng gọi. | REST + JSON-Schema (xem B.2) |
| 5 | **MCP Server** | Để agent điều khiển. Bọc API thành tools (xem B.3). | MCP SDK |
| 6 | **CLI** | Vỏ mỏng gọi API. | oclif / commander |
| 7 | **Secrets server-side** | Không để key khách phơi ở client. BYOK mã hoá hoặc key nền tảng + metering. | KV/Secrets Store mã hoá |
| 8 | **Job async + tiến độ** | Sinh 30 ngày pack chạy lâu; agent cần poll/webhook, không block. | Cloudflare **Workflows/Queues** |
| 9 | **Billing & quota** | Gói cước, đếm credit/token. | Stripe + bảng usage |
| 10 | **Schema versioned + idempotency** | Bug `[object Object]` cho thấy blob không kiểu rất giòn. Agent gọi song song cần idempotency key + optimistic lock. | Zod/JSON-Schema validate ở biên, field `version` |
| 11 | **Observability + audit log** | Agent tự hành động → phải log ai-làm-gì, rate-limit, rollback. | structured log + audit table |

### B.2. Phác thảo API (hợp đồng cho cả 3 mặt)

```
# Project
POST   /v1/projects                      {name} -> {id}
GET    /v1/projects
GET    /v1/projects/:id
DELETE /v1/projects/:id
POST   /v1/projects/:id/duplicate

# Brand Vault
POST   /v1/projects/:id/vault            (upload file | paste text)
GET    /v1/projects/:id/vault
POST   /v1/projects/:id/onboard/ai-fill  -> {nganh,kenh,khach}   (tính năng Bước 0)

# Trạm 1..6 (engine)
POST   /v1/projects/:id/stations/:n/run  -> {score, feedback, output}
GET    /v1/projects/:id/stations/:n

# GENERATE + Lò
POST   /v1/projects/:id/packs/generate   -> {jobId}      (async)
GET    /v1/jobs/:jobId                    -> {status, progress, result}
POST   /v1/projects/:id/scripts/build     -> {jobId}
POST   /v1/projects/:id/video-prompts     -> {jobId}
GET    /v1/projects/:id/export?format=md|csv|json
```

### B.3. MCP tools (bọc API ở B.2)

- `create_project(name)` · `list_projects()` · `duplicate_project(id)`
- `add_brand_source(project_id, {file|text})` · `ai_fill_onboard(project_id)`
- `run_station(project_id, n)` · `get_station(project_id, n)`
- `generate_30day_pack(project_id)` → trả `job_id`
- `build_scripts(project_id)` · `gen_video_prompts(project_id)`
- `get_job(job_id)` · `export_pack(project_id, format)`

> Thiết kế tools theo **kết quả mong muốn** (generate_pack) chứ không phải từng click UI →
> agent dùng tự nhiên hơn.

### B.4. CLI (cùng API)

```
viraldojo login
viraldojo project new "Kênh IDC"
viraldojo project ls
viraldojo vault add ./chien-luoc.pdf --project p_ab12
viraldojo station run 1 --project p_ab12
viraldojo pack generate --project p_ab12 --watch
viraldojo export --project p_ab12 --format md > pack.md
```

### B.5. Lộ trình theo mốc

- **Milestone 1 — Engine tách rời:** rút logic+prompt khỏi `index.html` thành package
  `@viraldojo/engine` (thuần, test được). UI hiện tại import lại để không vỡ.
- **Milestone 2 — Backend + API:** Workers + D1/R2/KV, auth cơ bản, CRUD project + vault +
  chạy trạm. Web app trỏ API thay localStorage (vẫn cho chế độ offline/local).
- **Milestone 3 — Async + Pack:** Workflows/Queues cho generate 30 ngày + job polling.
- **Milestone 4 — MCP + CLI:** bọc API. Đây là lúc "agent điều khiển được" thành hiện thực.
- **Milestone 5 — Thương mại:** billing, quota, secrets server-side, audit, rate-limit.

### B.6. Điểm khớp tầm nhìn sẵn có

App đã tuyên bố hướng MCP: `index.html:466` — *"Chuẩn kết nối của Dojo là MCP: mỗi connector
là 1 cổng dữ liệu độc lập."* Lộ trình trên chỉ là **hiện thực hoá** tuyên bố đó bằng backend.

---

## Phụ lục — Nhật ký quyết định

| Ngày | Quyết định | Ghi chú |
|------|-----------|---------|
| 2026-06-19 | API key **dùng chung** mọi dự án | `keys` ở cấp gốc localStorage, ngoài `projects` |
| 2026-06-19 | Part A trước, Part B theo milestone | Part A rủi ro thấp, giá trị ngay; Part B là nền thương mại |
