# Quy tắc chuyển đổi CV → Website (`cv_transform_rules.md`)

> **Mục đích:** ghi rõ dữ liệu nào trong CV thực tế (`cv_raw/cv_summary.md`) bị **chuyển đổi / suy ra / loại bỏ** khi đưa vào database web (`content/cv.md`), theo **quy tắc nào**, để mỗi lần cập nhật CV đều cho ra kết quả nhất quán và **các key không bao giờ thay đổi giữa các phiên bản**.
>
> - Các mục **Registry**, **Normalization**, **Overrides** có khối yaml được **máy kiểm tra** (`npm run cv:check`, `npm run build`).
> - Các mục còn lại là tài liệu cho người (hoặc AI) thực hiện chuyển đổi.
> - File này được commit lên GitHub ⇒ **chỉ ghi tên trường**, không ghi giá trị của dữ liệu riêng tư.

| | File | Vai trò |
|---|---|---|
| Nguồn | `cv_raw/cv_summary.md` (local, không commit) | CV thực tế, tiếng Việt, viết tự do |
| Quy tắc | `content/cv_transform_rules.md` (file này) | Rule + Key Registry + ngoại lệ |
| Đích | `content/cv.md` | Database CV song ngữ mà web đọc |
| Cấu trúc | `content/CV_TEMPLATE.md` | Mô tả từng trường của `cv.md` |

---

## 1. Quy trình cập nhật CV

1. Sửa CV thực tế trong `cv_raw/cv_summary.md`.
2. Với mỗi thay đổi, tìm rule tương ứng ở **mục 4** rồi sửa `content/cv.md` (cả `en` và `vi`).
3. **Thêm item mới** (dự án, công ty, khách hàng, thành tựu, mốc, domain, role, deliverable):
   - đặt key theo **R-ID**,
   - đăng ký key ở **mục 3 – Registry** với `status: active` và `source` = tên gốc trong summary.
4. **Bỏ item** khỏi CV: xóa khỏi `cv.md` và chuyển key sang `status: removed` (không xóa dòng Registry).
5. **Đổi tên** item trong summary: **giữ nguyên key**, chỉ cập nhật cột `source` trong Registry.
6. Cố ý lệch khỏi rule: thêm vào **mục 6 – Overrides**, kèm lý do.
7. Chạy `npm run cv:check` → `npm run dev` để xem trước → ghi **mục 9 – Changelog** → push.

---

## 2. Chính sách key

| Loại | Định dạng | Ví dụ | Ghi chú |
|---|---|---|---|
| Dự án (slug) | kebab-case tiếng Anh, ngắn | `crm-system`, `ms-word-ai-agent` | Dùng trong id HTML, focus, timeline |
| Công ty / khách hàng | camelCase | `cmc`, `cmcCustomer` | |
| Thành tựu | `<kebab-tên>-<năm>` | `rising-star-2024` | |
| Mốc timeline | `<builder\|analyst>-<năm>` | `analyst-2026` | Năm = năm bắt đầu của mốc |
| Domain | PascalCase | `HRTech`, `SupplyChain` | |
| Role / deliverable | camelCase | `baDev`, `frontendCode` | |

- Key **không bao giờ đổi** sau khi tạo, kể cả khi tên hiển thị thay đổi.
- Key đã `removed` **không được dùng lại** cho item khác.
- Registry chỉ được **thêm dòng**, không xóa.

---

## 3. Registry

> Máy kiểm tra: key trong `cv.md` phải được đăng ký `active`; key `active` phải có trong `cv.md`; key `removed` không được xuất hiện lại.
> `source` = tên gốc trong `cv_summary.md` (để truy vết khi đối chiếu).

```yaml
projects:
  crm-system:             { source: "Dự án nổi bật › 1. CRM - Customer Relationship Management", since: v1, status: active }
  fleet-digital-twin:     { source: "Dự án nổi bật › 2. Fleet Digital Twin", since: v1, status: active }
  rts-recruitment:        { source: "Dự án nổi bật › 3. RTS - Recruitment Tracking System", since: v1, status: active }
  ms-word-ai-agent:       { source: "Dự án nổi bật › 4. MS Word Add-in AI Agent", since: v1, status: active }
  transport-management:   { source: "Dự án nổi bật › 5. Transport Management System", since: v1, status: active }
  fleet-management:       { source: "Dự án nổi bật › 6. Fleet Management System (IoT)", since: v1, status: active }
  warehouse-management:   { source: "Dự án nổi bật › 7. Warehouse Management System", since: v1, status: active }
  cello-supply-chain:     { source: "Dự án nổi bật › 8. Cello — Supply Chain Logistics (FIS - VMS - IOT)", since: v1, status: active }
  cello-tracking:         { source: "Dự án nổi bật › 9. Visibility Management System — Cello Tracking", since: v1, status: active }
  adserving-3rd-tracking: { source: "Dự án nổi bật › 10. Adserving 3rd-Party Tracking", since: v1, status: active }
  tagmanager:             { source: "Dự án nổi bật › 11. Tagmanager", since: v1, status: active }
  ad-template-tool:       { source: "Dự án nổi bật › 12. Advertising Template Management Tool", since: v1, status: active }
companies:
  vccorp: { source: "Kinh nghiệm › Vccorp — PHP Developer", since: v1, status: active }
  cmc:    { source: "Kinh nghiệm › CMC Global — Software Engineer", since: v1, status: active }
customers:
  vccorp:      { source: "Khách hàng: Vccorp", since: v1, status: active }
  samsung:     { source: "Khách hàng: Samsung", since: v1, status: active }
  vinfast:     { source: "Khách hàng: VinFast (Khách hàng của CMC)", since: v1, status: active }
  cmcGlobal:   { source: "Khách hàng: CMC Global (Nội bộ)", since: v1, status: active }
  cmcCustomer: { source: "Khách hàng: CMC's Customer", since: v1, status: active }
achievements:
  best-project-2025:  { source: "Thành tựu › The Best Project — MS Word Add-in AI Agent Project — Q3.2025", since: v1, status: active }
  rising-star-2024:   { source: "Thành tựu › Rising Star Q2.2024", since: v1, status: active }
  best-employee-2020: { source: "Thành tựu › Best Employee Award — Admicro Division, 2020", since: v1, status: active }
milestones:
  builder-2018: { source: "(suy ra) Vào Vccorp + Ad Template Tool, Tagmanager", since: v1, status: active }
  builder-2019: { source: "(suy ra) Adserving 3rd-Party Tracking (Leader)", since: v1, status: active }
  builder-2020: { source: "(suy ra) Best Employee Award 2020", since: v1, status: active }
  builder-2022: { source: "(suy ra) Vào CMC Global + Cello Tracking, Cello Supply Chain", since: v1, status: active }
  builder-2024: { source: "(suy ra) Rising Star Q2.2024", since: v1, status: active }
  builder-2025: { source: "(suy ra) Fleet Digital Twin (Front-end)", since: v1, status: active }
  analyst-2019: { source: "(suy ra) Tự phân tích & thiết kế Tagmanager, Adserving", since: v1, status: active }
  analyst-2022: { source: "(suy ra) Cello Supply Chain — Module Leader", since: v1, status: active }
  analyst-2024: { source: "(suy ra) Warehouse Management, Fleet Management (vai trò BA)", since: v1, status: active }
  analyst-2025: { source: "(suy ra) MS Word AI Agent, Transport Management + Best Project", since: v1, status: active }
  analyst-2026: { source: "(suy ra) CRM, Fleet Digital Twin, RTS", since: v1, status: active }
domains:
  AI:          { source: "Trụ cột 2 › AI / Productivity Tools", since: v1, status: active }
  Logistics:   { source: "Trụ cột 2 › Logistics / Vận tải", since: v1, status: active }
  IoT:         { source: "Trụ cột 2 › IoT / Digital Twin / Quản lý xe điện; IoT / Hàng hải", since: v1, status: active }
  Warehouse:   { source: "Trụ cột 2 › Quản lý kho", since: v1, status: active }
  AdTech:      { source: "Trụ cột 2 › Advertising / AdTech; AdTech / Web Analytics", since: v1, status: active }
  SupplyChain: { source: "(suy ra) Mô tả dự án Cello — Supply Chain Logistics", since: v1, status: active }
  CRM:         { source: "Trụ cột 2 › CRM / Quản lý quan hệ khách hàng", since: v1, status: active }
  HRTech:      { source: "Trụ cột 2 › HR Tech / Tuyển dụng", since: v1, status: active }
roles:
  ba:           { source: "Vai trò: BA", since: v1, status: active }
  baDev:        { source: "Vai trò: BA + Developer / BA (…) + Front-end Developer", since: v1, status: active }
  leader:       { source: "Vai trò: Leader", since: v1, status: active }
  moduleLeader: { source: "Vai trò: Module Leader", since: v1, status: active }
  frontendDev:  { source: "Vai trò: Front-end Developer", since: v1, status: active }
  backendDev:   { source: "Vai trò: Backend Developer", since: v1, status: active }
deliverables:
  wbs:          { source: "Trách nhiệm: WBS", since: v1, status: active }
  srs:          { source: "Trách nhiệm: SRS", since: v1, status: active }
  wireframe:    { source: "Trách nhiệm: wireframe", since: v1, status: active }
  proposal:     { source: "Trách nhiệm: pre-sale / tư vấn giải pháp; Kiến thức: Solution Proposal", since: v1, status: active }
  useCase:      { source: "Kiến thức › Business Analysis: Use Case Specification", since: v1, status: active }
  mockup:       { source: "Kiến thức › Business Analysis: Mockup/Wireframe", since: v1, status: active }
  frontendCode: { source: "Trách nhiệm: code front-end / lập trình Front-end", since: v1, status: active }
```

---

## 4. Danh mục rule

Mỗi rule có mã `R-xxx`. Cột **Máy** = rule được `cv:check` tự kiểm tra trên `cv.md`.

### 4.1 Định danh & định dạng

| Mã | Nguồn (summary) | Đích (`cv.md`) | Cách chuyển | Ví dụ | Máy |
|---|---|---|---|---|---|
| **R-ID** | Tên dự án / thành tựu / … | `slug`, `id` | Theo mục 2. Đăng ký ở Registry. Không bao giờ đổi. | "CRM - Customer Relationship Management" → `crm-system` | ✅ |
| **R-DATE** | Thời gian | `period`, `start`, `end` | `MM/YYYY – MM/YYYY` (gạch dài `–`, có khoảng trắng 2 bên). "nay" → bỏ `end`. | `05/2022 – nay` → `start: 05/2022` | ✅ |
| **R-TEAM** | Team | `team` | "N người" → `N`. "Lớn (CMC: N người + nhân sự phía KH)" → `"N+"`. | Fleet Digital Twin → `"6+"` | ✅ |
| **R-FORMAT** | Học vấn | `Education` | GPA dạng `"x.xx / 4"`. Tên trường viết Title Case + viết tắt; VI dùng tên tiếng Việt. | "3.21/4" → `3.21 / 4`; "Ha Noi University Of Industry" → "Ha Noi University of Industry (HaUI)" | — |
| **R-YEARS** | "N năm kinh nghiệm" | *(không lưu)* | **Không lưu số năm viết cứng.** Lưu `careerStart` = năm vào công ty đầu tiên, `baStart` = năm bắt đầu làm BA / pre-sale. Web tự tính `{n}` theo năm hiện tại. | "4 năm kinh nghiệm" → bỏ; `careerStart: 2018`, `baStart: 2022` | — |

### 4.2 Dự án

| Mã | Nguồn | Đích | Cách chuyển | Ví dụ | Máy |
|---|---|---|---|---|---|
| **R-TECH** | Tech | `tech[]` | Chuẩn hóa theo `Normalization › tech` (alias → tên chuẩn), giữ thứ tự. | `Vuejs`, `VueJS` → `Vue.js`; `JQuery` → `jQuery`; `Spring 4.0` → `Spring`; `Vue3`, `Litjs` giữ nguyên | ✅ |
| **R-CUST** | Khách hàng | `customer` | Theo `Normalization › customerAliases`. Khách hàng bên ngoài có tên riêng của công ty → `keyClient: true`. `label` chỉ đặt khi tên hiển thị khác `name`. | "VinFast (Khách hàng của CMC)" → `vinfast` (keyClient) | — |
| **R-COMP** | *(suy ra)* | `company` | Công ty đang làm việc tại tháng bắt đầu dự án. | Tagmanager 03/2018 → `vccorp` | ✅ |
| **R-ROLE** | Vai trò | `role` | Theo `Normalization › roleAliases`. | "BA (hỗ trợ BA của VinFast) + Front-end Developer" → `baDev` | — |
| **R-TRACK** | *(suy ra từ role)* | `tracks` | Theo `Normalization › roleTracks`: `ba` → analyst; `baDev` → analyst + builder; còn lại → builder. | `moduleLeader` → `[builder]` | ✅ |
| **R-DELIV** | Trách nhiệm | `deliverables` | Chỉ dự án có track `analyst` mới có deliverables (máy kiểm tra). Từ khóa: WBS → `wbs`; SRS → `srs`; wireframe → `wireframe`; "pre-sale" / "tư vấn giải pháp" → `proposal`; "code / lập trình front-end" → `frontendCode`. | WMS ("wireframe, pre-sale, tư vấn") → `[wireframe, proposal]` | ✅ (phần track) |
| **R-DOMAIN** | Bảng "Trụ cột 2" + mô tả | `domain`, `baDomains` | Mỗi dự án đúng 1 domain (mục Registry › domains). `baDomains` = các domain trong bảng "Trụ cột 2", theo thứ tự đã đóng băng: AI, Logistics, IoT, Warehouse, AdTech, CRM, HRTech. | RTS → `HRTech`; Cello Tracking → `IoT` | — |
| **R-TITLE** | Tên dự án | `title` | ` - ` → ` — `; ` - ` giữa các module → ` · `; bỏ số thứ tự và huy hiệu (⭐ …) và chuyển sang `Achievements › project`. Được thêm hậu tố làm rõ. | "Fleet Digital Twin" → "Fleet Digital Twin (EV)"; "(FIS - VMS - IOT)" → "(FIS · VMS · IoT)" | — |
| **R-TEXT** | Mô tả, Trách nhiệm | `summary`, `responsibilities` | VI: biên tập từ summary (giữ thuật ngữ tiếng Anh trong ngoặc). EN: dịch. Trách nhiệm: tách theo dấu phẩy thành bullet, mỗi bullet bắt đầu bằng động từ / danh từ hành động. | "Phân tích & thiết kế…, thiết kế wireframe…" → 3 bullet | — |
| **R-LAYOUT** | *(không có)* | `layout` | Dữ liệu chỉ có trên web: `featured` cho dự án tiêu biểu nhất mỗi nhóm, `wide` để cân lưới. Dự án mới mặc định không đặt. | `fleet-digital-twin: featured` | — |

### 4.3 Công ty, thành tựu, kỹ năng, timeline

| Mã | Nguồn | Đích | Cách chuyển | Ví dụ | Máy |
|---|---|---|---|---|---|
| **R-COMPROLE** | Chức danh + Trách nhiệm | `Companies › role` | Chức danh + vai trò mở rộng nổi bật (từ trách nhiệm hoặc vai trò cao nhất trong dự án). | CMC → "Software Engineer · BA / Pre-sale"; Vccorp → "PHP Developer / Leader" | — |
| **R-ACH** | Thành tựu | `Achievements` | Title `"<Tên ngắn> <Kỳ>"`. `milestone` = mốc cùng năm của track tương ứng. `project` = dự án được trao giải (nếu có). Icon: 🏆 giải dự án, 🌟 cá nhân (công ty hiện tại), 🏅 cá nhân (công ty cũ). | "The Best Project — MS Word … — Q3.2025" → `best-project-2025`, title "Best Project Q3.2025", project `ms-word-ai-agent` | ✅ (tham chiếu) |
| **R-SKILL** | Kỹ năng + Tech của dự án | `Skills › items` | `since` = năm bắt đầu của dự án đầu tiên dùng kỹ năng. `until` = năm kết thúc của dự án cuối cùng; **bỏ trống** nếu dự án đó kết thúc trong năm mới nhất của CV (vẫn đang dùng). Kỹ năng không gắn tech → `careerStart` hoặc `baStart` (xem `Normalization › skillSources`). Gộp cặp: "PHP + Laravel" → "PHP / Laravel". | Redis: Adserving 12/2019 – 04/2022 → `since: 2019, until: 2022` | ✅ |
| **R-CLUSTER** | Kỹ năng | `Skills › clusters` | 4 node Galaxy cố định (`frontend`, `backend`, `database`, `analysis`). `skills` = nhãn hiển thị rút gọn; `keywords` = tên tech chuẩn (R-TECH) dùng để highlight dự án. | `backend.keywords: [Java, Spring, PHP, Laravel]` | — |
| **R-MILESTONE** | *(suy ra)* | `Timeline` | Mỗi mốc = một năm có sự kiện (vào công ty, dự án nổi bật, thành tựu). `year` có thể là khoảng `"YYYY – YYYY"`. Timeline Analyst được tham chiếu dự án track builder khi mốc nói về hoạt động phân tích (vd. tự phân tích Tagmanager). | `builder-2020` ← Best Employee 2020 | ✅ (định dạng, tham chiếu) |
| **R-NARRATIVE** | Mục tiêu nghề nghiệp, "Hai trụ cột" | `Narrative`, `Profile › tagline/objective` | Viết lại theo văn phong web, song ngữ. Số năm / số lượng dùng placeholder (`{n}` …). Tên dự án / công ty phải khớp dữ liệu trong `cv.md`. | `transition.quote` | ✅ (placeholder) |
| **R-EXCLUDE** | Trường không hiển thị | *(không có)* | Không đưa vào `cv.md` (chỉ chứa dữ liệu hiển thị trên UI). Danh sách ở mục 7. | | — |

---

## 5. Normalization

> Máy dùng `tech`, `roleTracks`, `skillSources`. Các mục `*Aliases` là bảng tra cho người chuyển đổi.

```yaml
# R-TECH — tên chuẩn: [các cách viết gặp trong summary]
tech:
  PostgreSQL: []
  MySQL: []
  Redis: []
  DB2: []
  JavaScript: []
  Vue.js: [Vuejs, VueJS]
  Vue3: []
  React: []
  jQuery: [JQuery]
  Mapbox: []
  Litjs: []
  Java: []
  Spring: ["Spring 4.0"]
  PHP: []
  Laravel: []

# R-TRACK — role → tracks ('*' = mặc định)
roleTracks:
  ba: [analyst]
  baDev: [analyst, builder]
  "*": [builder]

# R-ROLE — role code: [cụm từ trong cột "Vai trò"]
roleAliases:
  ba: ["BA"]
  baDev: ["BA + Developer", "BA (hỗ trợ BA của VinFast) + Front-end Developer"]
  leader: ["Leader"]
  moduleLeader: ["Module Leader"]
  frontendDev: ["Front-end Developer"]
  backendDev: ["Backend Developer"]

# R-CUST — customer id: [cách ghi trong cột "Khách hàng"]
customerAliases:
  vccorp: ["Vccorp"]
  samsung: ["Samsung"]
  vinfast: ["VinFast (Khách hàng của CMC)"]
  cmcGlobal: ["CMC Global (Nội bộ)"]
  cmcCustomer: ["CMC's Customer"]

# R-SKILL — nguồn tính since / until của từng kỹ năng
skillSources:
  "HTML / CSS": { from: careerStart }
  JavaScript: { tech: [JavaScript] }
  "Vue.js (2 & 3)": { tech: [Vue.js, Vue3] }
  React: { tech: [React] }
  jQuery: { tech: [jQuery] }
  Mapbox: { tech: [Mapbox] }
  "PHP / Laravel": { tech: [PHP, Laravel] }
  "Java / Spring": { tech: [Java, Spring] }
  "RESTful API": { from: careerStart }
  MySQL: { tech: [MySQL] }
  Redis: { tech: [Redis] }
  DB2: { tech: [DB2] }
  PostgreSQL: { tech: [PostgreSQL] }
  "UML / Database Design": { from: careerStart }
  WBS: { from: baStart }
  SRS: { from: baStart }
  "Use Case Specification": { from: baStart }
  "Wireframe / Mockup": { from: baStart }
  "Solution Proposal": { from: baStart }
```

---

## 6. Overrides

> **Ngoại lệ đã đóng băng** — chỗ dữ liệu web lệch khỏi kết quả của rule, được giữ nguyên có chủ đích.
> - Lệch rule mà máy kiểm tra được (R-TECH, R-TRACK, R-DELIV, R-COMP, R-SKILL) **phải** có override, nếu không build lỗi.
> - Override có `value` ⇒ giá trị bị **đóng băng**: sửa dữ liệu đó trong `cv.md` mà không sửa override ⇒ build lỗi.
> - Override không có `value` chỉ để ghi chú.

```yaml
- key: projects.ad-template-tool.company
  rule: R-COMP
  value: vccorp
  reason: "Summary ghi dự án bắt đầu 01/2018, sớm hơn ngày vào Vccorp (02/2018). Dự án thuộc Vccorp."

- key: skills.Mapbox.until
  rule: R-SKILL
  value: 2023
  reason: "Rule cho ra 2022 (Cello Tracking kết thúc 11/2022). Web dùng 2023; số năm hiển thị vẫn là 1."

- key: projects.fleet-digital-twin.deliverables
  rule: R-DELIV
  value: [wbs, srs, wireframe, proposal, frontendCode]
  reason: "Trách nhiệm trong summary không ghi WBS/SRS/wireframe; web bổ sung theo thực tế dự án (vai trò BA hỗ trợ VinFast)."

- key: projects.fleet-management.deliverables
  rule: R-DELIV
  value: [wbs, srs, wireframe, frontendCode]
  reason: "Có pre-sale nhưng không tính Solution Proposal cho dự án này."

- key: achievements.best-employee-2020.project
  rule: R-ACH
  value: adserving-3rd-tracking
  reason: "Summary không liên kết giải với dự án; suy ra từ dự án đang dẫn dắt năm 2020."

- key: customers.cmcCustomer.label
  rule: R-CUST
  value: CMC Customer
  reason: "Web dùng 2 cách viết: 'CMC's Customer' (filter, card, sheet) và 'CMC Customer' (nhãn focus/breadcrumb). Giữ nguyên."

- key: projects.cello-tracking.responsibilities
  rule: R-TEXT
  reason: "Summary không có mục Trách nhiệm; suy ra từ Vai trò (Front-end Developer) và Mô tả."

- key: projects.fleet-digital-twin.title
  rule: R-TITLE
  value: Fleet Digital Twin (EV)
  reason: "Thêm hậu tố (EV) để phân biệt với Fleet Management System (IoT)."
```

---

## 7. Dữ liệu loại trừ (R-EXCLUDE)

Các trường có trong `cv_summary.md` nhưng **không hiển thị trên UI** ⇒ không đưa vào `cv.md` (chỉ ghi tên trường):

| Mục trong summary | Trường | Ghi chú |
|---|---|---|
| Thông tin cá nhân | Ngày sinh, Giới tính | Riêng tư |
| Thông tin cá nhân | Website | Đã có trong `Profile › socials` (Facebook) |
| Kinh nghiệm | Trách nhiệm chính & Thành tựu theo công ty | Thể hiện qua `Companies › role` và `Achievements` |
| Kỹ năng | Version Control, IDEs, Hệ điều hành | |
| Kiến thức chuyên sâu | Algorithm & Data Structure, Tiếng Anh, số năm kinh nghiệm | Số năm tính tự động (R-YEARS); Design Patterns / MVC / OOP nằm trong `clusters.backend.desc` |
| Tổng hợp thành tựu | (trùng lặp) | Dùng `Achievements` |
| Hai trụ cột | Bảng công nghệ / số năm | Dùng làm nguồn cho R-SKILL, R-DOMAIN, R-NARRATIVE |
| Thông tin bổ sung | Toàn bộ | |

> Muốn hiển thị thêm trường nào ⇒ cần bổ sung trường vào template (`CV_TEMPLATE.md`) và UI.

---

## 8. Dữ liệu chỉ có trên web

Không có trong `cv_summary.md`, được duy trì trực tiếp trong `cv.md`:

- `Profile › socials` (GitHub, LinkedIn), `cvPdf`, `name` dạng có dấu (VI)
- Toàn bộ bản dịch **EN** và phần biên tập **VI**
- `Dictionaries` (nhãn, icon, màu của domain; nhãn, style của role; nhãn deliverable)
- `Skills › clusters` (nhãn, tier, mô tả, keywords), `connections`, `deliverableKit`
- `Projects › layout` (R-LAYOUT)
- `Achievements › icon`
- `Timeline` (R-MILESTONE) và `Narrative` (R-NARRATIVE)

---

## 9. Changelog

| Phiên bản | Ngày | Thay đổi |
|---|---|---|
| v1 | 2026-10-06 | Khởi tạo. `cv.md` sinh tự động từ dữ liệu web hiện tại (`resume.ts` + `en.json` + `vi.json`), đối chiếu với `cv_summary.md`: đăng ký 54 key, 22 rule, 8 override. Cập nhật link Facebook trong summary → `facebook.com/chido.kedokatoji`. |
