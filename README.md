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
| `dev` | `npm run dev` | Khởi động dev server với HMR (Hot Module Replacement) |
| `build` | `npm run build` | Type-check TypeScript + build production |
| `preview` | `npm run preview` | Preview bản build production trên local |

---

## Project Structure

```
src/
├── assets/              # Images, fonts, icons
│   └── images/
├── components/
│   ├── common/          # Reusable UI components (Button, Card...)
│   ├── layout/          # Header, Footer, Navigation
│   └── sections/        # Page sections (Hero, About, Skills...)
├── composables/         # Vue composables (custom hooks)
├── data/                # Static data (CV info, projects)
│   └── resume.ts        # ← Chỉnh sửa file này để cập nhật nội dung CV
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── styles/              # Global styles
├── App.vue              # Root component
└── main.ts              # Entry point
```

---

## Deployment

Project tự động deploy lên GitHub Pages khi push code lên branch `main` thông qua GitHub Actions.

Workflow: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

---

## License

MIT
