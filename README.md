# Tu Le Quang | Portfolio & CV

Personal portfolio website built with **Vue 3** + **TypeScript** + **Tailwind CSS v4**.

🔗 **Live**: [https://tulequang.github.io](https://tulequang.github.io)

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Vue 3 (Composition API + `<script setup>`) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Build Tool | Vite |
| Deploy | GitHub Pages (via GitHub Actions) |

---

## Prerequisites

Trước khi chạy project, đảm bảo máy đã cài:

- **Node.js** >= 18 (khuyến nghị v22)
- **npm** >= 9

Kiểm tra version:

```bash
node -v   # v22.x.x
npm -v    # 10.x.x
```

> 💡 Nếu dùng [nvm](https://github.com/nvm-sh/nvm), project đã có file `.nvmrc`. Chỉ cần chạy:
>
> ```bash
> nvm use
> ```

---

## Getting Started

### 1. Clone repository

```bash
git clone https://github.com/TuLeQuang/TuLeQuang.github.io.git
cd TuLeQuang.github.io
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start dev server

```bash
npm run dev
```

Mở trình duyệt tại **http://localhost:5173** — trang web sẽ tự động reload khi bạn thay đổi code.

### 4. Build production

```bash
npm run build
```

Output sẽ nằm trong thư mục `dist/`.

### 5. Preview production build

```bash
npm run preview
```

Mở **http://localhost:4173** để xem bản build production trên local.

---

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Khởi động dev server với HMR (tự động tải lại khi sửa code hoặc `content/cv.md`) |
| `build` | `npm run build` | Type-check TypeScript (`vue-tsc`) + build production |
| `preview` | `npm run preview` | Preview bản build production trên local |
| `cv:check` | `npm run cv:check` | Kiểm tra tính toàn vẹn, schema và rule lint của `content/cv.md` |
| `cv:json` | `npm run cv:json` | Xuất dữ liệu CV đã resolve (EN + VI) ra định dạng JSON |
| `test` | `npm test` | Chạy toàn bộ test suite (golden snapshot tests + unit tests pipeline) |

---

## Quản Lý Dữ Liệu CV (CV as Data)

Toàn bộ thông tin CV (song ngữ EN + VI) được tách hoàn toàn khỏi mã nguồn và quản lý tập trung tại thư mục `content/`:

- **`content/cv.md`**: Cơ sở dữ liệu CV duy nhất (Markdown + YAML). Sửa nội dung tại đây để web tự động cập nhật.
- **`content/cv_transform_rules.md`**: Bảng quy tắc chuyển đổi dữ liệu, Key Registry (chống đổi tên key làm đứt gãy liên kết) và các ngoại lệ đã đóng băng.
- **`content/CV_TEMPLATE.md`**: Tài liệu hướng dẫn chi tiết về cấu trúc trường, kiểu dữ liệu và ví dụ từng mục trong `cv.md`.
- **`cv-pipeline/`**: Bộ chuyển đổi 4 tầng (`Parser` → `Migrator` → `Validator` → `Mapper`) đọc dữ liệu lúc build và cung cấp cho website qua module `virtual:cv`.
- **`src/locales/*.json`**: Chỉ lưu trữ nhãn giao diện tĩnh (nút bấm, bộ lọc, thanh điều hướng), không chứa dữ kiện CV viết cứng.

### Cách cập nhật CV

Mỗi khi muốn thêm hoặc sửa đổi thông tin trong CV:

1. **Sửa nội dung**: Chỉnh sửa file `content/cv.md` (xem hướng dẫn trường tại `content/CV_TEMPLATE.md`).
2. **Đăng ký key (nếu thêm mới)**: Nếu thêm dự án, công ty, khách hàng hoặc domain mới, khai báo key vào bảng `Registry` tương ứng trong `content/cv_transform_rules.md`.
3. **Kiểm tra hợp lệ**:
   ```bash
   npm run cv:check
   ```
4. **Xem trước & kiểm thử**:
   ```bash
   npm run dev    # Xem giao diện trực quan tại http://localhost:5173
   npm test       # Kiểm tra an toàn trước khi push
   ```

---

## Project Structure

```
├── content/             # CSDL CV & Tài liệu cấu trúc
│   ├── cv.md            # ← Chỉnh sửa nội dung CV tại đây
│   ├── cv_transform_rules.md  # Rule chuyển đổi, Key Registry & Overrides
│   └── CV_TEMPLATE.md   # Hướng dẫn chi tiết cấu trúc trường
├── cv-pipeline/         # Pipeline chuyển đổi & xác thực dữ liệu CV (chạy lúc build)
├── src/
│   ├── assets/          # Images, fonts, icons
│   ├── components/      # UI components (common, layout, galaxy, timeline, sections)
│   ├── composables/     # Vue composables (useCv, useFocus, useLocale, ...)
│   ├── data/            # Module dữ liệu resume (kết nối virtual:cv)
│   ├── locales/         # Chuỗi giao diện tĩnh đa ngôn ngữ (en.json, vi.json)
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions & style maps
│   ├── styles/          # Tailwind CSS styles
│   ├── App.vue          # Root component
│   └── main.ts          # Entry point
└── tests/               # Test suites (golden render DOM snapshots + pipeline unit tests)
```

---

## Deployment

Project tự động deploy lên GitHub Pages khi push code lên branch `main` thông qua GitHub Actions.

Workflow: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

---

## License

MIT
