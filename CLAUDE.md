# An Chuyến — Claude Code Instructions

## Project Overview

An Chuyến là nền tảng đặt vé xe khách + dịch vụ du lịch tại Việt Nam.
Mục tiêu: trải nghiệm cinematic, premium — không phải generic travel booking.

---

## ⚠️ Luật tối cao — Đọc trước mọi thứ

Trước khi viết bất kỳ dòng UI nào, đọc:

1. `design/ART_DIRECTION.md` — visual direction và cảm giác tổng thể
2. `design/DESIGN_SYSTEM.md` — token màu, font, spacing
3. `design/UX_PRINCIPLES.md` — behavior và flow
4. `design/MOTION_GUIDELINES.md` — khi nào animate, khi nào không

Nếu có reference image → đọc `design/ART_DIRECTION.md#reference-workflow` trước.

---

## Tech Stack

```
Framework:  Next.js 14 (App Router)
Language:   TypeScript (strict)
Styling:    Tailwind CSS v3 + CSS custom properties
Animation:  Framer Motion
Data:       TanStack Query v5 + Axios
```

**Tailwind config extend:**
```js
colors: {
  ink:    '#0C0D0B',
  fog:    '#F5F3EE',
  gold:   '#F2C118',
  amber:  '#C97B2F',
  forest: '#192B1D',
  slate:  '#4A4E46',
  mist:   '#E0DDD7',
}
fontFamily: {
  display: ['Cormorant Garamond', 'Georgia', 'serif'],
  heading: ['Barlow Condensed', 'sans-serif'],
  body:    ['Inter', 'sans-serif'],
  mono:    ['Space Mono', 'monospace'],
}
```

---

## Project Structure

```
web/
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/
│   │   ├── ui/                 # Design system base components
│   │   ├── layout/             # Nav, Footer, TornEdge, etc.
│   │   └── features/           # Feature-specific components
│   ├── lib/
│   │   ├── api.ts              # Axios instance
│   │   └── queries/            # React Query hooks
│   └── styles/
│       └── globals.css         # CSS custom properties + base
```

---

## Design Philosophy

An Chuyến phải feel:
- **Cinematic** — như editorial travel magazine
- **Premium** — không phải generic bus booking
- **Thiên nhiên** — rừng núi, sương mù, hành trình
- **Effortless** — đặt vé trong 60 giây

**TUYỆT ĐỐI TRÁNH:**
- Generic SaaS card grid trắng
- Màu xanh corporate (#2563EB style)
- Shadow box khắp nơi
- Animation quá nhiều
- Pure white background (dùng `--fog` #F5F3EE)
- Pure black (dùng `--ink` #0C0D0B)

---

## Coding Standards

### Component structure
```tsx
// Props interface luôn ở đầu file
interface Props {
  // ...
}

// Server Component mặc định — thêm 'use client' khi cần
export function ComponentName({ }: Props) {
  // ...
}
```

### CSS order
Dùng Tailwind utilities. Với custom effect phức tạp (fog mask, torn edge, blob clip) → dùng inline CSS hoặc CSS module riêng.

### Không viết comment giải thích WHAT — chỉ viết WHY
```tsx
// ❌ sai
// This renders the route card
// ✅ đúng  
// mask-image tạo fog dissolve effect — không thể làm bằng Tailwind
```

### Import order
```
React/Next
Third-party libs
Internal components (@ alias)
Types
Styles
```

---

## API Convention

Backend chạy tại `NEXT_PUBLIC_API_URL` (Express + Hono).

```ts
// lib/api.ts — Axios instance với JWT auto-attach
import axios from 'axios'

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL })
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})
```

---

## When Stuck

Nếu không chắc về design decision → xem `design/decisions/` để biết lý do của các quyết định cũ.

Nếu user nói "không đúng gu" hoặc "trông SaaS quá" → xem lại `design/ART_DIRECTION.md` và `design/DESIGN_SYSTEM.md#avoid`.

Mỗi khi có feedback design mới → ghi vào `design/decisions/` file liên quan.
