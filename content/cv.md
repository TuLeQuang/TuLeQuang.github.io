---
schemaVersion: 1
locales: [en, vi]
---

# CV Database — Lê Quang Tú

> **Nguồn dữ liệu duy nhất của website.** Web đọc file này lúc build (`cv-pipeline`).
>
> - Quy tắc chuyển đổi từ CV thực tế (`cv_raw/cv_summary.md`) → file này: [cv_transform_rules.md](./cv_transform_rules.md)
> - Cấu trúc từng trường: [CV_TEMPLATE.md](./CV_TEMPLATE.md)
> - Mỗi `## Section` / `### key` chứa đúng **1 khối yaml**. Chữ ngoài khối yaml (như dòng này) là ghi chú, web bỏ qua.
> - Text song ngữ: `{ en: ..., vi: ... }`; viết 1 chuỗi duy nhất nếu 2 ngôn ngữ giống nhau.
> - Kiểm tra trước khi push: `npm run cv:check`

## Profile

Thông tin cá nhân hiển thị trên UI. `careerStart` / `baStart` dùng để tự tính số năm kinh nghiệm (R-YEARS).

```yaml
name: { en: Le Quang Tu, vi: Lê Quang Tú }
role: Fullstack Developer
targetRole: Business Analyst
tagline:
  en: From building systems to designing them — end-to-end product development.
  vi: Từ xây dựng hệ thống đến thiết kế hệ thống — phát triển sản phẩm end-to-end.
location: { en: "Hanoi, Vietnam", vi: "Hà Nội, Việt Nam" }
objective:
  en: Growing toward Project Owner — leading products from concept to launch.
  vi: Mục tiêu trở thành Project Owner — dẫn dắt sản phẩm từ concept đến launch.
email: lequangtu28@gmail.com
phone: "0986685827"
careerStart: 2018
baStart: 2022
socials:
  - { platform: GitHub, icon: github, url: https://github.com/TuLeQuang }
  - platform: LinkedIn
    icon: linkedin
    url: https://www.linkedin.com/in/t%C3%BA-l%C3%AA-2167132b4/
  - { platform: Facebook, icon: facebook, url: https://www.facebook.com/chido.kedokatoji }
cvPdf: cv/LeQuangTu_CV.pdf
```

## Education

Học vấn (R-FORMAT).

```yaml
school: { en: Ha Noi University of Industry (HaUI), vi: Đại học Công nghiệp Hà Nội (HaUI) }
major: { en: Software Engineering, vi: Kỹ thuật phần mềm }
period: 10/2014 – 05/2018
gpa: 3.21 / 4
```

## Companies

Nơi làm việc, theo thứ tự thời gian. Bỏ `end` = hiện tại (R-DATE, R-COMPROLE).

```yaml
- id: vccorp
  name: Vccorp
  start: 02/2018
  end: 04/2022
  role: PHP Developer / Leader
- { id: cmc, name: CMC Global, start: 05/2022, role: Software Engineer · BA / Pre-sale }
```

## Customers

Khách hàng cuối của dự án. `keyClient: true` = khách hàng lớn của công ty (có filter riêng). `label` = tên hiển thị khi khác `name` (R-CUST).

```yaml
- { id: vccorp, name: Vccorp, company: vccorp }
- { id: samsung, name: Samsung, company: cmc, keyClient: true }
- { id: vinfast, name: VinFast, company: cmc, keyClient: true }
- { id: cmcGlobal, name: CMC Global, company: cmc }
- { id: cmcCustomer, name: CMC's Customer, label: CMC Customer, company: cmc }
```

## Dictionaries

Danh mục dùng chung. Thêm domain / role / deliverable mới tại đây — không cần sửa code.
`color` (domain): ai | logistics | iot | warehouse | adtech | supplychain | crm | hrtech · `style` (role): purple | gradient | green | blue

```yaml
domains:
  AI:
    label: { en: AI / Productivity, vi: AI / Năng suất }
    icon: 🤖
    color: ai
  Logistics:
    label: { en: Logistics / Transport, vi: Logistics / Vận tải }
    icon: 🚚
    color: logistics
  IoT:
    label: { en: IoT / Devices & EV, vi: IoT / Thiết bị & Xe điện }
    icon: 📡
    color: iot
  Warehouse:
    label: { en: Warehouse, vi: Quản lý kho }
    icon: 🏭
    color: warehouse
  AdTech:
    label: { en: AdTech / Advertising, vi: AdTech / Quảng cáo }
    icon: 📢
    color: adtech
  SupplyChain:
    label: { en: Supply Chain, vi: Chuỗi cung ứng }
    icon: 🌐
    color: supplychain
  CRM:
    label: { en: CRM, vi: CRM / Khách hàng }
    icon: 💼
    color: crm
  HRTech:
    label: { en: HR Tech / Recruitment, vi: HR Tech / Tuyển dụng }
    icon: 👥
    color: hrtech
roles:
  ba: { label: Business Analyst, style: purple }
  baDev: { label: BA + Developer, style: gradient }
  leader: { label: Leader, style: green }
  moduleLeader: { label: Module Leader, style: purple }
  frontendDev: { label: Front-end Developer, style: blue }
  backendDev: { label: Backend Developer, style: blue }
deliverables:
  wbs: WBS
  srs: SRS
  wireframe: Wireframe
  proposal: Solution Proposal
  useCase: Use Case Spec
  mockup: Mockup
  frontendCode: { en: Front-end code, vi: Code front-end }
baDomains: [ AI, Logistics, IoT, Warehouse, AdTech, CRM, HRTech ]
```

## Skills

Kỹ năng (R-SKILL) và 4 node của Skill Galaxy (`frontend`, `backend`, `database`, `analysis` — cố định theo layout).

```yaml
items:
  - { name: HTML / CSS, category: frontend, since: 2018 }
  - { name: JavaScript, category: frontend, since: 2018 }
  - { name: Vue.js (2 & 3), category: frontend, since: 2018 }
  - { name: React, category: frontend, since: 2025 }
  - { name: jQuery, category: frontend, since: 2018, until: 2024 }
  - { name: Mapbox, category: frontend, since: 2022, until: 2023 }
  - { name: PHP / Laravel, category: backend, since: 2018, until: 2022 }
  - { name: Java / Spring, category: backend, since: 2022 }
  - { name: RESTful API, category: backend, since: 2018 }
  - { name: MySQL, category: database, since: 2018, until: 2022 }
  - { name: Redis, category: database, since: 2019, until: 2022 }
  - { name: DB2, category: database, since: 2022, until: 2024 }
  - { name: PostgreSQL, category: database, since: 2024 }
  - { name: UML / Database Design, category: analysis, since: 2018 }
  - { name: WBS, category: analysis, since: 2022 }
  - { name: SRS, category: analysis, since: 2022 }
  - { name: Use Case Specification, category: analysis, since: 2022 }
  - { name: Wireframe / Mockup, category: analysis, since: 2022 }
  - { name: Solution Proposal, category: analysis, since: 2022 }
clusters:
  database:
    icon: database
    accent: primary
    label: Data Architecture
    tier: Core Layer
    desc:
      en: Database design & production operations
      vi: Thiết kế cơ sở dữ liệu & vận hành production
    skills: [ PostgreSQL, MySQL, Redis, DB2 ]
    keywords: [ PostgreSQL, MySQL, Redis, DB2 ]
  frontend:
    icon: devices
    accent: iot
    label: Frontend Dev
    tier: Client Tier
    desc:
      en: Vue 2/3, Mapbox, Litjs — interactive interfaces
      vi: Vue 2/3, Mapbox, Litjs — giao diện tương tác
    skills: [ Vue.js, React, JavaScript, HTML/CSS, jQuery ]
    keywords: [ JavaScript, Vue.js, Vue3, React, jQuery, Mapbox, Litjs, HTML, CSS ]
  backend:
    icon: terminal
    accent: secondary
    label: Backend Stack
    tier: Server Logic
    desc: RESTful API, MVC, OOP & design patterns
    skills: [ Java / Spring, PHP / Laravel, REST API ]
    keywords: [ Java, Spring, PHP, Laravel ]
  analysis:
    icon: schema
    accent: tertiary
    label: Analysis & Specification
    tier: Strategic Bridge
    desc:
      en: Requirement elicitation → WBS / SRS / Solution Proposal
      vi: Thu thập yêu cầu → WBS / SRS / Solution Proposal
    skills: [ UML, Wireframe, WBS, SRS, Use Case ]
    keywords: []
connections:
  backend-database:
    from: backend
    to: database
    label:
      en: Database design + production operations
      vi: Thiết kế DB + vận hành production
  frontend-analysis:
    from: frontend
    to: analysis
    label: { en: From wireframe → straight to code, vi: Từ wireframe → code trực tiếp }
  backend-analysis:
    from: backend
    to: analysis
    label: { en: Knowing the system → better designs, vi: Hiểu hệ thống → thiết kế tốt hơn }
deliverableKit: [ wbs, srs, wireframe, proposal, useCase, mockup ]
```

## Achievements

Thành tựu (R-ACH). `milestone` = mốc timeline hiển thị thành tựu; `project` = dự án được trao giải (tùy chọn).

```yaml
- id: best-project-2025
  icon: 🏆
  title: Best Project Q3.2025
  company: cmc
  track: analyst
  milestone: analyst-2025
  project: ms-word-ai-agent
- id: rising-star-2024
  icon: 🌟
  title: Rising Star Q2.2024
  company: cmc
  track: builder
  milestone: builder-2024
- id: best-employee-2020
  icon: 🏅
  title: Best Employee 2020
  company: vccorp
  track: builder
  milestone: builder-2020
  project: adserving-3rd-tracking
```

## Projects

Mỗi dự án là 1 `### <slug>` (slug không bao giờ đổi — R-ID). Thứ tự trong file = thứ tự hiển thị.

### crm-system

```yaml
period: 02/2026 – 03/2026
company: cmc
customer: cmcGlobal
role: ba
team: 4
domain: CRM
tracks: [ analyst ]
deliverables: [ wbs, srs, wireframe ]
tech: [ PostgreSQL, JavaScript, Vue.js, Java, Spring ]
title: CRM — Customer Relationship Management
summary:
  en: >-
    End-to-end customer relationship management system tracking customer journeys from acquisition
    and nurturing to deal management. Integrates customer data management, sales pipeline, analytics
    reporting and master data synchronization with internal systems.
  vi: >-
    Phát triển hệ thống quản lý quan hệ khách hàng (CRM), cho phép theo dõi toàn diện hành trình
    khách hàng từ tiếp cận (acquisition), nuôi dưỡng (nurturing) đến quản lý giao dịch sau khi thiết
    lập (deal management). Tích hợp quản lý dữ liệu khách hàng, luồng bán hàng (sales pipeline), báo
    cáo phân tích và đồng bộ master data với các hệ thống nội bộ khác.
responsibilities:
  en:
    - System analysis & design for 1 phase
    - Designed wireframes and diagrams
    - Defined functional requirement documents (WBS, SRS)
  vi:
    - Phân tích & thiết kế hệ thống cho 1 giai đoạn
    - Thiết kế wireframe, sơ đồ (diagrams)
    - Xây dựng tài liệu đặc tả chức năng (WBS, SRS)
```

### fleet-digital-twin

```yaml
period: 12/2025 – 09/2026
company: cmc
customer: vinfast
role: baDev
team: 6+
domain: IoT
tracks: [ analyst, builder ]
layout: featured
deliverables: [ wbs, srs, wireframe, proposal, frontendCode ]
tech: [ PostgreSQL, JavaScript, React, Java, Spring ]
title: Fleet Digital Twin (EV)
summary:
  en: >-
    Solution design consulting and development of a Digital Twin system for electric vehicle fleet
    management for VinFast. Enables real-time monitoring and simulation of vehicle status including
    battery health, motor performance, mileage, and operational efficiency, supporting predictive
    maintenance and route optimization.
  vi: >-
    Tư vấn thiết kế giải pháp và phát triển hệ thống Digital Twin quản lý đội xe điện (EV fleet) cho
    VinFast, cho phép giám sát realtime và mô phỏng trạng thái phương tiện (sức khỏe pin, hiệu suất
    động cơ, quãng đường, hiệu quả vận hành). Hỗ trợ bảo trì dự đoán (predictive maintenance), tối
    ưu hóa lộ trình và hỗ trợ ra quyết định trong quản lý đội xe.
responsibilities:
  en:
    - Solution design consulting and co-working with VinFast BA team
    - Front-end coding (React)
    - Designed wireframes and functional documents (WBS, SRS)
  vi:
    - Tư vấn thiết kế giải pháp và hỗ trợ đội ngũ BA của VinFast
    - Lập trình Front-end (React)
    - Xây dựng wireframe và tài liệu chức năng (WBS, SRS)
```

### rts-recruitment

```yaml
period: 11/2025 – 12/2025
company: cmc
customer: cmcGlobal
role: ba
team: 12
domain: HRTech
tracks: [ analyst ]
deliverables: [ wbs, srs, wireframe ]
tech: [ PostgreSQL, JavaScript, Vue.js, Java, Spring ]
title: RTS — Recruitment Tracking System
summary:
  en: >-
    End-to-end recruitment management system enabling HR to track candidates through every stage
    from application to onboarding. Upgraded business logic, integrated interview scheduling,
    candidate evaluation and recruitment analytics reporting.
  vi: >-
    Bảo trì và nâng cấp hệ thống quản lý tuyển dụng toàn diện (end-to-end), giúp HR theo dõi ứng
    viên qua từng giai đoạn từ nộp hồ sơ đến onboarding. Cải tiến tính năng hiện có, cập nhật
    business logic theo yêu cầu mới, tích hợp xếp lịch phỏng vấn, đánh giá ứng viên và báo cáo phân
    tích tuyển dụng.
responsibilities:
  en:
    - System analysis & design for 1 phase
    - Designed wireframes and diagrams
    - Defined functional requirement documents (WBS, SRS)
  vi:
    - Phân tích & thiết kế hệ thống cho 1 giai đoạn
    - Thiết kế wireframe, sơ đồ (diagrams)
    - Xây dựng tài liệu đặc tả chức năng (WBS, SRS)
```

### ms-word-ai-agent

```yaml
period: 01/2025 – 03/2025
company: cmc
customer: cmcCustomer
role: ba
team: 7
domain: AI
tracks: [ analyst ]
layout: featured
deliverables: [ wbs, srs, wireframe, proposal ]
tech: [ PostgreSQL, JavaScript, Vue3, Java, Spring ]
title: MS Word Add-in AI Agent
summary:
  en: >-
    Integrates an AI chatbot into MS Word using LLMs (ChatGPT, Google…) to search, interact with and
    edit document content through AI.
  vi: >-
    Tích hợp chatbot AI vào MS Word, sử dụng các mô hình LLM (ChatGPT, Google…) cho phép tìm kiếm,
    tương tác và chỉnh sửa nội dung tài liệu qua AI.
responsibilities:
  en:
    - Analyzed & designed the whole system
    - Designed wireframes
    - Wrote functional documents (WBS, SRS)
    - Took part in pre-sale
  vi:
    - Phân tích & thiết kế toàn bộ hệ thống
    - Thiết kế wireframe
    - Viết tài liệu chức năng (WBS, SRS)
    - Tham gia pre-sale
```

### transport-management

```yaml
period: 01/2025 – 03/2025
company: cmc
customer: cmcCustomer
role: ba
team: 4
domain: Logistics
tracks: [ analyst ]
deliverables: [ wbs, srs, wireframe, proposal ]
tech: [ PostgreSQL, JavaScript, Vue3, Java, Spring ]
title: Transport Management System
summary:
  en: >-
    Automated vehicle dispatching solution managing orders, vehicles & drivers. Optimizes vehicle
    allocation logic to match requirements and cut transport costs.
  vi: >-
    Giải pháp điều phối xe tự động, quản lý đơn hàng, phương tiện & tài xế. Tối ưu logic phân bổ xe
    phù hợp yêu cầu để giảm chi phí vận tải.
responsibilities:
  en:
    - Took part in pre-sale
    - System analysis & design
    - Designed wireframes, wrote functional documents (WBS, SRS)
    - Consulted on transport management solutions
  vi:
    - Tham gia pre-sale
    - Phân tích & thiết kế hệ thống
    - Thiết kế wireframe, viết tài liệu chức năng (WBS, SRS)
    - Tư vấn giải pháp quản lý vận tải
```

### fleet-management

```yaml
period: 10/2024 – 12/2024
company: cmc
customer: cmcCustomer
role: baDev
team: 5
domain: IoT
tracks: [ analyst, builder ]
deliverables: [ wbs, srs, wireframe, frontendCode ]
tech: [ PostgreSQL, JavaScript, Vue3, Litjs, Java, Spring ]
title: Fleet Management System (IoT)
summary:
  en: >-
    IoT-connected system for vessels: receives telemetry (position, operating parameters), raises
    operational alerts and manages vessel maintenance information.
  vi: >-
    Hệ thống kết nối IoT trên tàu thuyền, nhận dữ liệu telemetry (vị trí, thông số vận hành), cảnh
    báo trong vận hành và quản lý thông tin bảo trì tàu.
responsibilities:
  en:
    - System analysis & design
    - Designed wireframes, wrote documents (WBS, SRS)
    - Took part in pre-sale
    - Front-end coding
  vi:
    - Phân tích & thiết kế hệ thống
    - Thiết kế wireframe, viết tài liệu (WBS, SRS)
    - Tham gia pre-sale
    - Code front-end
```

### warehouse-management

```yaml
period: 05/2024 – 09/2024
company: cmc
customer: cmcCustomer
role: ba
team: 3
domain: Warehouse
tracks: [ analyst ]
layout: wide
deliverables: [ wireframe, proposal ]
tech: [ PostgreSQL, JavaScript, Vue3, Java, Spring ]
title: Warehouse Management System
summary:
  en: >-
    Comprehensive solution optimizing warehouse processes: monitoring & controlling inbound /
    outbound flows and managing inventory.
  vi: >-
    Giải pháp tổng thể tối ưu quy trình quản lý kho: giám sát & kiểm soát nhập / xuất, quản lý tồn
    kho.
responsibilities:
  en:
    - System analysis & design
    - Designed wireframes
    - Took part in pre-sale
    - Consulted on warehouse management solutions
  vi:
    - Phân tích & thiết kế hệ thống
    - Thiết kế wireframe
    - Tham gia pre-sale
    - Tư vấn giải pháp quản lý kho
```

### cello-supply-chain

```yaml
period: 12/2022 – 04/2024
company: cmc
customer: samsung
role: moduleLeader
team: 70
domain: SupplyChain
tracks: [ builder ]
layout: featured
tech: [ DB2, JavaScript, jQuery, Vue.js, Java, Spring ]
title: Cello — Supply Chain Logistics (FIS · VMS · IoT)
summary:
  en: >-
    End-to-end logistics platform: international transport, customs clearance, domestic transport,
    warehousing, last-mile delivery (LMD) and reverse logistics. Manages master data, contracts,
    invoices and real-time shipment tracking.
  vi: >-
    Nền tảng logistics toàn diện: vận tải quốc tế, thông quan, nội địa, kho bãi, giao hàng chặng
    cuối (LMD), reverse logistics. Quản lý master data, hợp đồng, hoá đơn và theo dõi shipment
    realtime.
responsibilities:
  en:
    - Plan and assign tasks for the module
    - Ensure system reliability & performance
    - Handle incidents and optimize workflows
    - Analyze bottlenecks
    - Write documentation and run training
  vi:
    - Lập kế hoạch và phân task cho module
    - Đảm bảo reliability & performance của hệ thống
    - Xử lý sự cố và tối ưu workflow
    - Phân tích bottleneck
    - Viết documentation và training
```

### cello-tracking

```yaml
period: 05/2022 – 11/2022
company: cmc
customer: samsung
role: frontendDev
team: 12
domain: IoT
tracks: [ builder ]
tech: [ DB2, JavaScript, Vue.js, Mapbox, Java, Spring ]
title: Visibility Management System — Cello Tracking
summary:
  en: >-
    Visibility tracking system integrating shipboard IoT with Mapbox to follow vessel positions &
    routes in real time. IoT sensors collect position, speed and environmental conditions and stream
    them to a central platform.
  vi: >-
    Hệ thống Visibility Tracking tích hợp IoT trên tàu biển và Mapbox, theo dõi realtime vị trí tàu
    & tuyến đường. Cảm biến IoT thu thập vị trí, tốc độ, điều kiện môi trường và truyền về nền tảng
    trung tâm.
responsibilities:
  en: [ "Front-end Developer: built the vessel position & route tracking UI on Mapbox" ]
  vi:
    - "Front-end Developer: xây dựng giao diện theo dõi vị trí & tuyến đường tàu trên Mapbox"
```

### adserving-3rd-tracking

```yaml
period: 12/2019 – 04/2022
company: vccorp
customer: vccorp
role: leader
team: 3
domain: AdTech
tracks: [ builder ]
tech: [ PHP, MySQL, Redis, Laravel, JavaScript, Vue.js ]
title: Adserving 3rd-Party Tracking
summary:
  en: >-
    Lets users edit creative properties, generate dynamic click URLs and embed third-party tracking
    pixels (DoubleClick, Atlas, Sizmek…). Supports advertisers using their own servers to verify
    views and clicks.
  vi: >-
    Cho phép chỉnh sửa creative properties, tạo click URL động, nhúng tracking pixel của bên thứ 3
    (DoubleClick, Atlas, Sizmek…). Hỗ trợ advertiser dùng server riêng để xác thực view, click.
responsibilities:
  en:
    - System analysis & design
    - Backend + frontend coding
    - Performance optimization and bug fixing
  vi:
    - Phân tích & thiết kế hệ thống
    - Code backend + frontend
    - Tối ưu hiệu năng và sửa lỗi
```

### tagmanager

```yaml
period: 03/2018 – 02/2020
company: vccorp
customer: vccorp
role: leader
team: 3
domain: AdTech
tracks: [ builder ]
tech: [ PHP, MySQL, Laravel, JavaScript, jQuery ]
title: Tagmanager
summary:
  en: >-
    Tag Management System (TMS) — quickly manage and update measurement codes & code snippets (tags)
    on websites.
  vi: >-
    Tag Management System (TMS) — quản lý và cập nhật nhanh các measurement code & đoạn mã (tag)
    trên website.
responsibilities:
  en:
    - System analysis & design
    - Designed the CoreJS
    - Backend + frontend coding and optimization
    - Built APIs to connect with other systems
  vi:
    - Phân tích & thiết kế hệ thống
    - Thiết kế CoreJS
    - Code backend + frontend và tối ưu
    - Xây dựng API kết nối với hệ thống khác
```

### ad-template-tool

```yaml
period: 01/2018 – 02/2018
company: vccorp
customer: vccorp
role: backendDev
team: 3
domain: AdTech
tracks: [ builder ]
layout: wide
tech: [ PHP, MySQL, Laravel, JavaScript, Vue.js, jQuery ]
title: Advertising Template Management Tool
summary:
  en: Manages all advertising templates and tests how they render on websites.
  vi: Quản lý toàn bộ template quảng cáo và kiểm thử hiển thị trên các trang web.
responsibilities:
  en:
    - System analysis & design
    - Backend + frontend coding
    - Optimization and bug fixing
  vi: [ Phân tích & thiết kế hệ thống, Code backend + frontend, Tối ưu và sửa lỗi ]
```

## Timeline

Các mốc của 2 hành trình (R-MILESTONE). Thành tựu tự gắn vào mốc qua `Achievements › milestone`.

### builder

```yaml
- id: builder-2018
  year: "2018"
  company: vccorp
  projects: [ ad-template-tool, tagmanager ]
  title: { en: Started at Vccorp, vi: Bắt đầu tại Vccorp }
  desc:
    en: >-
      PHP Developer — built the Advertising Template Tool, then led Tagmanager (PHP, Laravel,
      jQuery, MySQL).
    vi: >-
      PHP Developer — xây Advertising Template Tool, sau đó dẫn dắt Tagmanager (PHP, Laravel,
      jQuery, MySQL).
- id: builder-2019
  year: "2019"
  company: vccorp
  projects: [ adserving-3rd-tracking ]
  title: { en: Led Adserving 3rd-Party Tracking, vi: Leader Adserving 3rd-Party Tracking }
  desc:
    en: "Designed & coded the whole fullstack system: PHP / Laravel + Vue.js + Redis (team of 3)."
    vi: "Thiết kế & code toàn bộ hệ thống fullstack: PHP / Laravel + Vue.js + Redis (team 3)."
- id: builder-2020
  year: "2020"
  company: vccorp
  title: Best Employee Award
  desc:
    en: Honored as an outstanding employee — Admicro division, Vccorp.
    vi: Được vinh danh nhân viên xuất sắc — khối Admicro, Vccorp.
- id: builder-2022
  year: "2022"
  company: cmc
  projects: [ cello-tracking, cello-supply-chain ]
  title: { en: Joined CMC Global, vi: Gia nhập CMC Global }
  desc:
    en: >-
      Software Engineer: Java / Spring + Vue.js for Samsung Cello; Module Leader (team of 70) from
      12/2022.
    vi: >-
      Software Engineer: Java / Spring + Vue.js cho Samsung Cello; từ 12/2022 làm Module Leader
      (team 70).
- id: builder-2024
  year: "2024"
  company: cmc
  title: Rising Star Q2.2024
  desc:
    en: Recognized as Rising Star at CMC Global.
    vi: Được ghi nhận Rising Star tại CMC Global.
- id: builder-2025
  year: 2025 – 2026
  company: cmc
  projects: [ fleet-digital-twin ]
  title: Frontend & IoT Digital Twin
  desc:
    en: Developed frontend for EV Fleet Digital Twin system for VinFast (React, Java / Spring).
    vi: >-
      Phát triển giao diện hệ thống Digital Twin quản lý đội xe điện cho VinFast (React, Java /
      Spring).
```

### analyst

```yaml
- id: analyst-2019
  year: "2019"
  company: vccorp
  projects: [ tagmanager, adserving-3rd-tracking ]
  title: { en: First system analysis, vi: Phân tích hệ thống đầu tiên }
  desc:
    en: Analyzed & designed Tagmanager and Adserving on my own at Vccorp (AdTech / Web Analytics).
    vi: Tự phân tích & thiết kế Tagmanager và Adserving tại Vccorp (AdTech / Web Analytics).
- id: analyst-2022
  year: 2022 – 2024
  company: cmc
  projects: [ cello-supply-chain ]
  title: { en: Samsung Cello — module management, vi: Samsung Cello — quản lý module }
  desc:
    en: >-
      Bottleneck analysis, workflow optimization, documentation and training (Supply Chain /
      Logistics).
    vi: >-
      Phân tích bottleneck, tối ưu workflow, viết documentation và training (Supply Chain /
      Logistics).
- id: analyst-2024
  year: "2024"
  company: cmc
  projects: [ warehouse-management, fleet-management ]
  title: { en: Moved into the BA role, vi: Chuyển sang vai trò BA }
  desc:
    en: "Warehouse Management and Fleet Management (IoT): business analysis, wireframes, WBS, SRS."
    vi: "Warehouse Management và Fleet Management (IoT): phân tích nghiệp vụ, wireframe, WBS, SRS."
- id: analyst-2025
  year: "2025"
  company: cmc
  projects: [ ms-word-ai-agent, transport-management ]
  title: { en: Multi-domain BA, vi: BA đa domain }
  desc:
    en: >-
      Transport Management and MS Word AI Agent: analysis & design, functional documents, pre-sale.
    vi: >-
      Transport Management và MS Word AI Agent: phân tích & thiết kế, tài liệu chức năng, pre-sale.
- id: analyst-2026
  year: 2025 – 2026
  company: cmc
  projects: [ crm-system, fleet-digital-twin, rts-recruitment ]
  title:
    en: Enterprise Consulting & Internal Platforms
    vi: Tư vấn đối tác lớn & Hệ thống nội bộ
  desc:
    en: >-
      Solution consulting for VinFast Fleet Digital Twin; analysis & system design for internal CRM
      & RTS at CMC Global.
    vi: >-
      Tư vấn giải pháp Fleet Digital Twin cho VinFast; thiết kế phân tích hệ thống CRM & RTS nội bộ
      CMC Global.
```

## Narrative

Các đoạn văn giới thiệu bản thân (R-NARRATIVE). Placeholder do web tự điền: `{n}` = số năm / số lượng, `{start}`, `{domains}`, `{award}`, `{project}`.

```yaml
builder:
  subtitle:
    en: "{n}+ years building AdTech & supply-chain logistics platforms end-to-end"
    vi: "{n}+ năm xây dựng nền tảng AdTech & logistics chuỗi cung ứng end-to-end"
  meta:
    en: "Vccorp • CMC Global (clients: Samsung, VinFast)"
    vi: "Vccorp • CMC Global (khách hàng: Samsung, VinFast)"
analyst:
  subtitle:
    en: "{n}+ years of requirement analysis, system design & pre-sale consulting"
    vi: "{n}+ năm phân tích yêu cầu, thiết kế hệ thống & tư vấn pre-sale"
  meta: EV Fleet Digital Twin • CRM • AI Agents • WMS • Fleet IoT
  domainDesc:
    en: Analysis & system design across many kinds of business domains.
    vi: Phân tích & thiết kế hệ thống cho nhiều dạng nghiệp vụ khác nhau.
transition:
  quote:
    en: >-
      “{n} years of writing code gave me something not every BA has: the ability to see straight
      from business requirements down to system architecture.”
    vi: >-
      “{n} năm viết code cho tôi thứ mà không phải BA nào cũng có: khả năng nhìn xuyên từ yêu cầu
      nghiệp vụ xuống tận kiến trúc hệ thống.”
  body:
    en: >-
      From gathering requirements to shipping code — one person who speaks both business and
      engineering.
    vi: >-
      Từ thu thập yêu cầu đến khi code chạy thật — một người hiểu cả ngôn ngữ nghiệp vụ lẫn kỹ thuật.
  bodyShort:
    en: One person who speaks both business and engineering.
    vi: Một người hiểu cả ngôn ngữ nghiệp vụ lẫn kỹ thuật.
  journey: { dev: Vccorp · Developer, hybrid: CMC Global · Dev + BA, ba: Best Project · BA }
strengths:
  bilingual:
    title: { en: Fluent in both business and tech, vi: Hiểu cả nghiệp vụ lẫn kỹ thuật }
    proof:
      en: >-
        {n}+ years building software; analysed & designed Tagmanager and Adserving myself since
        {start}
      vi: "{n}+ năm phát triển phần mềm; tự phân tích & thiết kế Tagmanager, Adserving từ {start}"
  deliverables:
    title: { en: A complete BA deliverable kit, vi: Bộ tài liệu BA đầy đủ }
    proof:
      en: From requirement gathering to detailed specs
      vi: Từ thu thập yêu cầu đến đặc tả chi tiết
    kit: [ wbs, srs, useCase, wireframe, mockup, proposal ]
  presale:
    title:
      en: "Pre-sale: consulting & pitching solutions"
      vi: "Pre-sale: tư vấn & trình bày giải pháp"
    proof:
      en: Took part in pre-sale on all {n} BA projects at CMC Global
      vi: Tham gia pre-sale ở cả {n} dự án BA tại CMC Global
  domains:
    title:
      en: Multi-domain, quick to learn the business
      vi: Đa lĩnh vực, nắm nghiệp vụ nhanh
    proof: { en: "{n} domains: {domains}", vi: "{n} lĩnh vực: {domains}" }
  feasible:
    title:
      en: Feasible solutions — I know how systems are built
      vi: Giải pháp khả thi vì hiểu hệ thống
    proof:
      en: "Fleet Management: business analysis and front-end coding at once"
      vi: "Fleet Management: vừa phân tích nghiệp vụ vừa code front-end"
    project: fleet-management
  recognized:
    title: { en: Recognized results, vi: Kết quả được ghi nhận }
    proof: { en: "{award} — {project}, as BA", vi: "{award} — {project}, vai trò BA" }
contact:
  subtitle:
    en: Open to conversations about solution analysis, system design and product development
    vi: Sẵn sàng trao đổi về phân tích giải pháp, thiết kế hệ thống và phát triển sản phẩm
  identity:
    en: >-
      Combining a fullstack engineering background with business analysis. Hands-on experience with
      AdTech, Samsung's supply-chain logistics platform and AI products.
    vi: >-
      Kết hợp nền tảng kỹ thuật fullstack với phân tích nghiệp vụ. Kinh nghiệm thực tế với AdTech,
      nền tảng logistics chuỗi cung ứng của Samsung và các sản phẩm AI.
```
