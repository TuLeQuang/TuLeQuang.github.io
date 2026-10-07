# Hướng Dẫn Cấu Trúc File `content/cv.md` (CV Template Reference)

> **Mục đích:** File `content/cv.md` là nguồn dữ liệu duy nhất (Single Source of Truth) cho toàn bộ nội dung CV song ngữ (EN + VI) hiển thị trên website. Website đọc trực tiếp file này lúc build (`virtual:cv`) và tự động cập nhật khi bạn chỉnh sửa mà **không cần sửa code Vue/TypeScript**.

---

## 1. Cấu trúc tổng thể

File `content/cv.md` tuân theo định dạng **Markdown kết hợp các khối YAML** (` ```yaml `):
- Mỗi `## Section` hoặc `### item` chứa đúng **1 khối ```yaml**.
- Các văn bản chú thích bằng Markdown bên ngoài khối yaml được bỏ qua (dùng để ghi chú).
- Dữ liệu đa ngôn ngữ được khai báo theo cấu trúc:
  - Chuỗi văn bản song ngữ: `{ en: "English text", vi: "Tiếng Việt" }` (hoặc chuỗi đơn nếu cả 2 ngôn ngữ giống nhau).
  - Danh sách song ngữ: `{ en: ["item 1", "item 2"], vi: ["mục 1", "mục 2"] }`.
- Các biến động (ví dụ: số năm kinh nghiệm, tên dự án, giải thưởng) sử dụng định dạng placeholder `{n}`, `{start}`, `{domains}`, `{award}`, `{project}`.

```
---
schemaVersion: 1
locales: [en, vi]
---

## Profile
\`\`\`yaml
# Thông tin cá nhân & mục tiêu nghề nghiệp
\`\`\`

## Education
\`\`\`yaml
# Học vấn
\`\`\`

## Companies
\`\`\`yaml
# Công ty / Quá trình làm việc
\`\`\`

## Customers
\`\`\`yaml
# Khách hàng / Đối tác
\`\`\`

## Dictionaries
\`\`\`yaml
# Danh mục domains, roles, deliverables, baDomains
\`\`\`

## Skills
\`\`\`yaml
# Kỹ năng (items, clusters, connections, deliverableKit)
\`\`\`

## Achievements
\`\`\`yaml
# Giải thưởng & danh hiệu nổi bật
\`\`\`

## Projects
### <slug-1>
\`\`\`yaml
# Thông tin chi tiết dự án 1
\`\`\`
### <slug-2>
\`\`\`yaml
# Thông tin chi tiết dự án 2
\`\`\`

## Timeline
### builder
\`\`\`yaml
# Các mốc thời gian track Kỹ thuật (Builder)
\`\`\`
### analyst
\`\`\`yaml
# Các mốc thời gian track Phân tích nghiệp vụ (Analyst)
\`\`\`

## Narrative
\`\`\`yaml
# Các đoạn văn tự sự, câu trích dẫn, 6 điểm mạnh BA (Why me as a BA), liên hệ
\`\`\`
```

---

## 2. Chi tiết từng mục (Schema & Kiểu dữ liệu)

### 2.1 Frontmatter
```yaml
---
schemaVersion: 1     # Số nguyên phiên bản schema (bắt buộc: 1)
locales: [en, vi]    # Danh sách locale hỗ trợ (bắt buộc: en, vi)
---
```

---

### 2.2 Profile
| Trường | Kiểu | Bắt buộc | Mô tả & Quy tắc |
|---|---|:---:|---|
| `name` | `Text` | Có | Họ tên `{ en: "Le Quang Tu", vi: "Lê Quang Tú" }` |
| `role` | `Text` | Có | Chức danh hiện tại (VD: Fullstack Developer) |
| `targetRole` | `Text` | Có | Chức danh hướng tới (VD: Business Analyst) |
| `tagline` | `Text` | Có | Câu giới thiệu ngắn gọn dưới tên |
| `location` | `Text` | Có | Địa điểm sinh sống (VD: Hanoi, Vietnam) |
| `objective` | `Text` | Có | Mục tiêu nghề nghiệp |
| `email` | `string` | Có | Email hợp lệ |
| `phone` | `string` | Có | Số điện thoại (dạng chuỗi số `"098..."`) |
| `careerStart` | `number` | Có | Năm bắt đầu sự nghiệp (VD: 2018) |
| `baStart` | `number` | Có | Năm bắt đầu đảm nhiệm vai trò BA/Pre-sale (VD: 2022) |
| `socials` | `array` | Có | Danh sách mạng xã hội (`platform`, `icon`, `url`). Icon gồm: `github`, `linkedin`, `facebook`. |
| `cvPdf` | `Text` | Có | Đường dẫn tải file PDF CV cho EN và VI |

---

### 2.3 Education
| Trường | Kiểu | Bắt buộc | Mô tả & Quy tắc |
|---|---|:---:|---|
| `school` | `Text` | Có | Tên trường đại học |
| `major` | `Text` | Có | Chuyên ngành tốt nghiệp |
| `gpa` | `string` | Có | Điểm GPA (chuỗi định dạng, VD: `"3.21 / 4"`) |
| `period` | `string` | Có | Khoảng thời gian (VD: `"2014 – 2018"`) |

---

### 2.4 Companies
Danh sách các công ty từng làm việc.
| Trường | Kiểu | Bắt buộc | Mô tả & Quy tắc |
|---|---|:---:|---|
| `id` | `string` | Có | Định danh công ty (VD: `vccorp`, `cmc`). Phải đăng ký trong Registry. |
| `name` | `string` | Có | Tên hiển thị (VD: `Vccorp`, `CMC Global`) |
| `start` | `string` | Có | Thời gian bắt đầu: định dạng `MM/YYYY` (VD: `05/2022`) |
| `end` | `string` | Không | Thời gian kết thúc (`MM/YYYY`). Để trống nếu hiện vẫn đang làm. |
| `role` | `Text` | Có | Chức danh công việc tại công ty |

---

### 2.5 Customers
Danh sách khách hàng / đối tác phục vụ trong các dự án.
| Trường | Kiểu | Bắt buộc | Mô tả & Quy tắc |
|---|---|:---:|---|
| `id` | `string` | Có | Mã khách hàng (VD: `samsung`, `vinfast`, `cmcCustomer`). Phải có trong Registry. |
| `name` | `string` | Có | Tên khách hàng hiển thị |
| `label` | `Text` | Không | Nhãn tuỳ biến (nếu khác `name`) |
| `company` | `string` | Có | Mã công ty quản lý hợp đồng (phải khớp `id` trong `Companies`) |
| `keyClient` | `boolean` | Không | `true` nếu là khách hàng trọng điểm bên ngoài của công ty |

---

### 2.6 Dictionaries
Từ điển chuẩn hoá hệ thống danh mục:
- `domains`: Bảng mã lĩnh vực nghiệp vụ. Mỗi domain có:
  - `label`: `Text` (tên hiển thị)
  - `icon`: Biểu tượng emoji (VD: `🤖`, `🚚`, `📢`)
  - `color`: Mã màu (`ai`, `logistics`, `iot`, `warehouse`, `adtech`, `supplychain`, `crm`, `hrtech`)
- `roles`: Bảng mã vai trò (`ba`, `baDev`, `leader`, `moduleLeader`, `frontendDev`, `backendDev`). Mỗi vai trò có:
  - `label`: `Text`
  - `style`: Kiểu hiển thị (`purple`, `gradient`, `green`, `blue`). Vai trò có style `gradient` tự động nhận diện là vai trò kép (BA + Developer).
- `deliverables`: Bảng mã tài liệu chuyển giao BA (`wbs`, `srs`, `wireframe`, `proposal`, `useCase`, `mockup`, `frontendCode`).
- `baDomains`: Mảng các domain hiển thị trong ma trận năng lực BA (Domain Matrix).

---

### 2.7 Skills
- `items`: Danh sách kỹ năng công nghệ/nghiệp vụ.
  - `name`: Tên kỹ năng (VD: `Vue.js (2 & 3)`, `Java / Spring`, `SRS`)
  - `category`: Nhóm kỹ năng (`frontend`, `backend`, `database`, `analysis`)
  - `since`: Năm bắt đầu
  - `until`: Năm kết thúc (bỏ trống nếu vẫn đang làm)
- `clusters`: Cấu hình 4 trạm kỹ năng của Skill Galaxy (`frontend`, `backend`, `database`, `analysis`):
  - `icon`, `accent`, `label`, `tier`, `desc`, `skills`, `keywords`
- `connections`: Các đường kết nối giữa các trạm trong Skill Galaxy.
- `deliverableKit`: Danh sách mã deliverable tiêu chuẩn hiển thị ở Analyst Section.

---

### 2.8 Achievements
Danh sách giải thưởng, thành tựu.
- `id`: Mã định danh (kebab-case, thường kết thúc bằng năm: `<ten>-<nam>`).
- `icon`: Biểu tượng (VD: `🏆`, `🌟`, `🏅`).
- `title`: `Text` (tên giải thưởng, VD: `Best Project Q3.2025`).
- `company`: Mã công ty trao giải.
- `track`: Nhánh năng lực (`analyst` hoặc `builder`).
- `milestone`: Mã mốc thời gian tương ứng.
- `project`: *(tuỳ chọn)* Mã dự án đoạt giải.

---

### 2.9 Projects
Mỗi dự án khai báo dưới tiêu đề `### <slug>`:
```yaml
### crm-system
period: 02/2026 – 03/2026                 # MM/YYYY – MM/YYYY hoặc MM/YYYY – nay
company: cmc                              # ID công ty trong Companies
customer: cmcGlobal                       # ID khách hàng trong Customers
role: ba                                  # ID vai trò trong Dictionaries.roles
team: 4                                   # Số người (số nguyên hoặc "N+")
domain: CRM                               # Thuộc Dictionaries.domains
tracks: [ analyst ]                       # [analyst], [builder], hoặc [analyst, builder]
layout: featured                          # (tuỳ chọn) 'featured' hoặc 'wide'
deliverables: [ wbs, srs, wireframe ]     # Bắt buộc nếu có track 'analyst'
tech: [ PostgreSQL, JavaScript, Vue.js ]  # Danh sách tech chuẩn hoá theo từ điển
title:
  en: CRM — Customer Relationship Management
  vi: CRM — Customer Relationship Management
summary:
  en: English summary...
  vi: Tóm tắt tiếng Việt...
responsibilities:
  en:
    - Analyzed stakeholder requirements...
    - Designed database schemas...
  vi:
    - Phân tích yêu cầu từ các bên liên quan...
    - Thiết kế kiến trúc cơ sở dữ liệu...
```

---

### 2.10 Timeline
Chia thành 2 nhánh: `### builder` và `### analyst`. Mỗi mốc gồm:
- `id`: Mã mốc thời gian (`builder-YYYY` hoặc `analyst-YYYY`).
- `year`: Năm hoặc khoảng năm hiển thị trên trục thời gian (VD: `"2025"` hoặc `"2022 – 2024"`).
- `company`: Mã công ty.
- `projects`: *(tuỳ chọn)* Mảng các slug dự án liên quan.
- `title`: `Text`
- `desc`: `Text`

---

### 2.11 Narrative
Chứa toàn bộ các câu chuyện và nội dung văn bản tự sự trên trang:
- `builder`: Phụ đề và dòng thông tin meta của Builder section.
- `analyst`: Phụ đề, meta và mô tả domain của Analyst section.
- `transition`: Câu trích dẫn bước ngoặt (`quote`), đoạn văn dài (`body`), tóm tắt (`bodyShort`), và các nấc hành trình 3 bước trên mobile (`journey.dev`, `journey.hybrid`, `journey.ba`).
- `strengths`: 6 điểm mạnh cốt lõi cho section "Why me as a BA":
  - `bilingual`, `deliverables`, `presale`, `domains`, `feasible`, `recognized`.
  - Mỗi mục gồm `title`, `proof` (chứa các placeholder `{n}`, `{start}`, `{domains}`, `{award}`, `{project}`).
  - `deliverables` có thêm `kit: [...]`.
  - `feasible` có thêm `project: <slug>` để tự động mở dự án chứng minh khi click.
- `contact`: Phụ đề và đoạn mô tả định vị bản thân ở phần Liên hệ.

---

## 3. Hướng dẫn từng bước thêm một Dự án mới

Giả sử bạn muốn thêm dự án mới `logistics-hub`:

1. **Đăng ký key vào Registry:** Mở `content/cv_transform_rules.md`, tìm mục `projects:` và thêm:
   ```yaml
   projects:
     logistics-hub: { source: "Tên dự án trong CV", since: v2, status: active }
   ```
2. **Khai báo dự án trong `content/cv.md`:** Thêm vào phần `## Projects`:
   ```yaml
   ### logistics-hub
   ```yaml
   period: 06/2026 – 09/2026
   company: cmc
   customer: vinfast
   role: ba
   team: 6
   domain: Logistics
   tracks: [ analyst ]
   deliverables: [ wbs, srs, wireframe, proposal ]
   tech: [ Java, Spring, Vue.js, PostgreSQL ]
   title:
     en: Logistics Hub Management
     vi: Quản lý Trung tâm Logistics
   summary:
     en: Automated logistics management platform.
     vi: Nền tảng quản lý trung tâm phân phối và vận tải tự động.
   responsibilities:
     en:
       - Conducted requirement elicitation and process mapping
     vi:
       - Thu thập và phân tích quy trình vận hành kho vận
   ```
3. **Kiểm tra tự động:** Chạy lệnh:
   ```bash
   npm run cv:check
   ```
   Nếu hệ thống báo `✅ content/cv.md is valid`, dữ liệu đã hợp lệ và website sẽ tự động cập nhật ngay lập tức.
