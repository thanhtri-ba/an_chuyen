# 🗺️ An Chuyến — Design System Map
**Bản đồ toàn bộ hệ thống thiết kế | Cập nhật: 2026-08-21**

---

## 📑 File Structure

```
design/
├── ART_DIRECTION.md          (Visual direction + signature effects)
├── DESIGN_SYSTEM.md          (Colors, typography, spacing, components)
├── UX_PRINCIPLES.md          (Navigation, flows, accessibility)
├── MOTION_GUIDELINES.md      (Animation timing, easing, patterns)
├── DESIGN_SYSTEM_MAP.md      (TÀI LIỆU NÀY — tổng hợp + backup)
├── decisions/
│   ├── hero.md               (SVG mountains, fog dissolve, search bar overlap)
│   └── booking.md            (5-step flow, seat map, payment page, pricing)
└── references/
    └── README.md             (Visual reference library guide)
```

---

## 🎨 PHẦN 1: ART DIRECTION — Hướng dẫn hình ảnh

### Core Concept
**Cinematic Adventure Travel** — cảm giác đứng trước cửa sổ xe đêm, nhìn ra núi rừng mờ sương, hành trình chưa bắt đầu nhưng đã cảm thấy tự do.

**Influences:** National Geographic, Monocle Travel, Arc'teryx, Patagonia, Nordic fog aesthetic, Russian travel design, Antimos/Journez

---

### 6 Signature Effects (thứ tự ưu tiên)

| # | Tên | Mục đích | Kỹ thuật |
|---|-----|---------|----------|
| **E1** | Fog Dissolve | Cạnh ảnh tan vào nền | `mask-image: linear-gradient(to bottom, black 60%, transparent 100%)` |
| **E2** | SVG Mountain Layers | Hero background | 4 lớp SVG path với opacity giảm dần |
| **E3** | Torn Paper Edge | Transition giữa section | SVG path zigzag không đều |
| **E4** | Winding Dotted Path | Nối các điểm dừng | SVG `stroke-dasharray="6 5"` |
| **E5** | Wave Transition | Footer + stats→blog | Bezier curve mềm |
| **E6** | Blob Clip Card | Service card | SVG clipPath hữu cơ |

---

### Atmospheric Perspective Rule
```
Lớp xa nhất  → màu nhạt, blue-gray, opacity thấp
Lớp giữa     → xanh rừng trung bình  
Lớp gần nhất → xanh đậm, cao độ rõ
Foreground   → near-black, silhouette cứng
```

---

### Typography Direction

#### Hero Heading
```
Font:         Cormorant Garamond Italic 700
Size:         clamp(3rem, 6vw, 5rem)
Line-height:  1.0
Color:        white (nền tối) hoặc --ink (nền sáng)
Text-shadow:  0 4px 40px rgba(0,0,0,0.3) — chỉ khi trên ảnh
```
**Cảm giác:** Tiêu đề bìa tạp chí travel, không phải bold sans-serif quảng cáo

#### Section Headings
```
Font:       Barlow Condensed 800 Uppercase
Tracking:   0.04–0.06em
Size:       clamp(1.8rem, 3vw, 2.6rem)
```

#### Labels / Eyebrows
```
Font:           Space Mono Uppercase
Size:           9–10px
Letter-spacing: 0.18–0.22em
Color:          --gold hoặc --amber
Format:         ✦ Tuyến đường nổi bật · 2026
```

---

### Color Mood Table

| Cảm giác | Màu | Hex |
|----------|-----|-----|
| Đêm / rừng sâu | `--forest` | #192B1D |
| Sương mù / bình yên | `--fog` | #F5F3EE |
| Ánh sáng vàng / năng lượng | `--gold` | #F2C118 |
| Hoàng hôn / depth | `--amber` | #C97B2F |
| Đêm đen / ink | `--ink` | #0C0D0B |

**Gold (#F2C118) CHỈ dùng cho:**
- CTA button chính
- Eyebrow label
- Stat divider
- Route dot marker
- Hover accent

**Gold KHÔNG dùng cho:** Background section, border thông thường, text body

---

### Layout Principles
- **Negative space:** Nhiều space hơn bạn nghĩ cần
- **Asymmetry:** Route section ảnh trái-text phải xen kẽ
- **Layering:** Background → atmosphere → content → overlay
- **Section rhythm:** DARK → torn edge → LIGHT → torn edge → DARK (không dùng 2 section cùng màu liền nhau)

---

### ❌ Anti-patterns — Tuyệt đối tránh

```
❌ Pure white #ffffff → dùng --fog #F5F3EE
❌ Generic blue (#2563EB, #3B82F6) → dùng palette đã định
❌ Shadow box khắp nơi → shadow chỉ ở search card và modal
❌ Rounded corners tất cả (rounded-2xl mọi thứ)
❌ Gradient header linear xanh → tím
❌ Card grid 3-4 cột đều nhau trên white background
❌ Loading spinner xoay giữa màn hình
❌ Toast popup che content
❌ Parallax scroll (lag trên mobile)
❌ Font Poppins, Nunito, Montserrat
❌ Icon emoji làm section marker
❌ Button với border-radius: 4px — quá corporate
```

---

## 🎨 PHẦN 2: DESIGN SYSTEM — Hệ thống thiết kế

### Color Tokens (CSS Custom Properties)

```css
:root {
  /* Core palette */
  --ink:    #0C0D0B;   /* near-black warm */
  --fog:    #F5F3EE;   /* off-white beige */
  --gold:   #F2C118;   /* amber yellow — accent DUY NHẤT */
  --amber:  #C97B2F;   /* deep amber */
  --forest: #192B1D;   /* dark forest green */
  --slate:  #4A4E46;   /* warm gray-green */
  --mist:   #E0DDD7;   /* light warm gray */

  /* Semantic aliases */
  --bg-page:      var(--fog);
  --bg-dark:      var(--forest);
  --text-primary: var(--ink);
  --text-body:    var(--slate);
  --accent:       var(--gold);
  --accent-hover: var(--amber);
  --border:       var(--mist);
}
```

**Tại sao không dùng pure white/black:**
- `#ffffff` → trông rẻ tiền, contrast quá cứng với ảnh thiên nhiên
- `#000000` → quá harsh, không phù hợp cảm giác sương mù
- `--fog` và `--ink` có tông warm nhẹ → hòa quyện với palette rừng núi

---

### Typography Stack

```css
--font-display: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
--font-heading: 'Barlow Condensed', 'Arial Narrow', sans-serif;
--font-body:    'Inter', system-ui, -apple-system, sans-serif;
--font-mono:    'Space Mono', 'Courier New', monospace;
```

#### Type Scale
```
Display (hero):      clamp(3rem, 6vw, 5rem)    — Cormorant Italic 700
Display (route):     clamp(1.8rem, 2.5vw, 2.4rem) — Cormorant Italic 600
Section title:       clamp(1.8rem, 3vw, 2.6rem) — Barlow Condensed 800 Uppercase
Card title:          1.15–1.4rem                — Barlow Condensed 700 Uppercase
Body large:          15–16px                    — Inter 400
Body:                14px                       — Inter 400
Label/eyebrow:       9–10px                     — Space Mono 400 Uppercase
Stat number:         clamp(2.4rem, 4vw, 3.4rem) — Cormorant Italic 600
```

#### Type Rules
```
Cormorant Garamond  → luôn italic. Never regular (trông yếu)
Barlow Condensed    → luôn uppercase + letter-spacing 0.04–0.08em
Space Mono          → luôn uppercase + letter-spacing 0.14–0.22em
Inter               → không uppercase, không bold quá 600
```

---

### Spacing Scale

```
--space-xs:  4px
--space-sm:  8px
--space-md:  16px
--space-lg:  32px
--space-xl:  64px
--space-2xl: 96px
--space-3xl: 128px

Section padding:   80px top/bottom (desktop), 40px (mobile)
Container padding: 80px left/right (desktop), 20px (mobile)
Card gap:          20–24px
```

---

### Buttons

#### Primary (Gold)
```css
background:       var(--gold);
color:            var(--ink);
padding:          14px 32px;
border-radius:    50px;  /* pill — không phải square */
font:             700 13px 'Barlow Condensed';
letter-spacing:   0.06em;
text-transform:   uppercase;
transition:       background 0.2s, transform 0.15s;
hover:            background #e6b410; transform translateY(-1px);
```

#### Dark Button
```css
background: var(--ink);
color:      var(--fog);
hover:      background var(--forest);
/* same shape as primary */
```

#### Outline Button
```css
background:    transparent;
color:         var(--ink);
border:        1.5px solid var(--ink);
hover:         background var(--ink); color var(--fog);
```

#### Ghost Button (trên nền tối)
```css
background: transparent;
color:      rgba(255,255,255,0.8);
border:     1px solid rgba(255,255,255,0.25);
hover:      border-color rgba(255,255,255,0.6); color white;
```

**Rule:** Luôn dùng `border-radius: 50px` (pill). Không dùng 4px, 8px, 12px.

---

### Cards

#### Service Card
```
Height:       260px
Background:   CSS gradient (không dùng ảnh)
Clip-path:    SVG blob unique mỗi card
Overlay:      linear-gradient đen từ đáy lên 50%
Label:        Space Mono 9px gold (category) + Barlow 800 uppercase (name)
Arrow:        circle 32px gold góc phải dưới
Hover:        translateY(-6px) 0.3s
```

#### Route Card
```
Grid:        1fr 80px 1fr (photo | dot | info)
Photo height: 320px + fog dissolve mask
Photo:       CSS gradient + SVG mountain nhỏ bên trong
Dot:         14px circle gold/amber với ring
Info:        0 32px padding
Fade-in:     IntersectionObserver, translateY 30px → 0
```

#### Blog Card
```
Thumbnail:   180px height
Background:  CSS gradient + fog overlay đáy
Tag:         gold badge top-left
Title:       Barlow Condensed 700 uppercase
Excerpt:     Inter 12.5px slate
Link:        amber "Đọc tiếp →"
Hover:       translateY(-4px)
Border:      0.5px solid --mist
```

---

### Section Transitions

#### Torn Paper (E3)
```
SVG viewBox:  0 0 1440 56
Path:         ~80 điểm zigzag không đều
Fill:         màu section bên dưới
Filter:       drop-shadow(0 -4px 8px rgba(0,0,0,0.06))
```

#### Wave (E5)
```
SVG Bezier C path — cong nhẹ một lần
Dùng ở:       stats→blog, footer top
Khác torn:    mềm hơn, không jagged
```

**Rule:** Không dùng 2 torn edges liên tiếp. Không dùng straight divider.

---

### Navigation

```
Position:    fixed top-0 z-100
Default:     transparent background
Scrolled:    rgba(12,13,11,0.88) + backdrop-filter blur(12px)
Transition:  0.3s

Logo:        Cormorant Garamond italic, 1.5rem, white
Links:       Inter 500 13px uppercase letter-spacing 0.04em, rgba(255,255,255,0.7)
CTA:         gold pill button
```

---

### Forms & Inputs

#### Search Bar
```
Container:    white card, border-radius 16px
Shadow:       0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)
Divider:      border-right 1px --mist
Label:        Space Mono 9px gold uppercase
Input:        Barlow Condensed 600 1.1rem uppercase
Submit:       ink dark, border-radius 12px
```

#### Standard Input
```
Border-bottom: 1.5px solid --mist (không dùng full border)
Focus:         border-color --gold
Font:          Inter 15px
Background:    transparent
Label:         Space Mono uppercase 9px --slate
```

---

### Gradients — CSS Landscape Palette

```css
/* Rừng núi xanh — mặc định */
.bg-mountain { background: linear-gradient(135deg, #0a1a0e, #1a4020, #3a7840, #6aaa72); }

/* Biển xanh */
.bg-ocean    { background: linear-gradient(135deg, #0e1822, #1a3040, #2a5068, #5a98b0); }

/* Hoàng hôn / sa mạc */
.bg-sunset   { background: linear-gradient(135deg, #1a1008, #3a2810, #6a4820, #9a7040); }

/* Bình minh */
.bg-dawn     { background: linear-gradient(135deg, #180818, #3a1828, #7a3848, #c87878); }

/* Mây / sương */
.bg-cloud    { background: linear-gradient(180deg, #c8d8d0, #e8eee8, #f5f3ee); }
```

---

### Responsive Breakpoints

```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1440px
```

**Mobile-specific:**
- Bottom nav bar cố định (4 items)
- Search bar stacked (3 field thành 3 hàng)
- Route cards full width (không alternating)
- Service grid: 2×2 thay vì 1×4

---

### Icons
- Dùng Lucide React cho icons chức năng
- Không dùng emoji làm icon UI
- Icon size: 16px inline, 20px medium, 24px max

---

## 📱 PHẦN 3: UX_PRINCIPLES — Nguyên tắc trải nghiệm

### 4 Core Jobs To Be Done

1. **Tìm chuyến xe** từ A đến B vào ngày cụ thể
2. **Đặt vé** nhanh nhất có thể
3. **Xem lại vé** đã đặt
4. **Khám phá** tuyến đường / dịch vụ

*→ Mọi quyết định UX phải phục vụ 4 mục tiêu này. Không thêm friction không cần thiết.*

---

### Navigation

#### Desktop Nav
- Logo trái, links giữa, auth button phải
- Transparent trên hero, đổi dark khi scroll
- Luôn hiện — không hide khi scroll down
- Active state: gold underline 2px bottom

#### Mobile Nav
- **Bottom bar cố định: Trang chủ / Tìm chuyến / Vé của tôi / Tài khoản**
- Icon + label nhỏ bên dưới
- Active: gold fill icon + gold label
- **Không được ẩn bottom bar bất kỳ lúc nào**

---

### Search — Ưu tiên tuyệt đối

**Search bar phải:**
- ✅ Visible ngay khi page load (không cần scroll)
- ✅ Float overlap với hero → pull user attention xuống
- ✅ 3 field: Điểm đi / Điểm đến / Ngày đi
- ✅ Swap button giữa Điểm đi ↔ Điểm đến
- ✅ Gợi ý auto-complete khi gõ tên thành phố
- ✅ Submit khi Enter hoặc click nút

**Không được:**
- ❌ Ẩn sau tab hay accordion
- ❌ Yêu cầu login trước khi search
- ❌ Reset form khi user navigate back

---

### Search Results Page

#### Display Strategy
- **Hiển thị giá ngay** — không click vào card mới thấy giá
- Người dùng VN quyết định theo giá trước

#### Filter Sidebar (Desktop)
```
Giờ khởi hành (slider range)
Giá (slider range)
Loại xe (checkbox: giường nằm / ghế ngồi)
Hãng xe (checkbox)
```

#### Sorting
- Default: giờ khởi hành sớm nhất
- Options: Giá thấp nhất / Nhanh nhất

#### Trip Card
```
Giờ đi — Giờ đến (Barlow Condensed lớn)
Tên hãng xe + loại xe
Thời gian hành trình
Giá (highlight gold)
Số ghế còn
Nút "Chọn ghế →"
```
**Không có:** đánh giá sao, review count (dùng sau khi có data)

---

### Seat Selection

#### Sơ đồ ghế
```
Layout:       2+1 (giường nằm) hoặc 2+2 (ghế ngồi)
Màu ghế:
  🟢 Xanh lá  → trống — có thể chọn
  🔴 Đỏ       → đã đặt — disabled
  🟡 Vàng     → đang chọn (--gold)
  ⚫ Xám      → không bán (tài xế, cầu thang)
Max select:   4 ghế / lượt
```

#### Panel Tóm Tắt (sticky right)
```
Tuyến + ngày
Danh sách ghế đã chọn
Tổng tiền (cập nhật real-time)
Nút "Tiếp tục →"
```
**Mobile:** Panel tóm tắt ở bottom, expandable

---

### Booking Flow

```
Search → Select Trip → Select Seat → Review → Payment → Confirmation
```

#### Flow Rules
- **Không back-and-forth bắt buộc** — mỗi bước forward, không ép user về trước
- **Progress indicator** rõ ràng — biết đang ở bước mấy / còn mấy bước
- **Trang thanh toán:** no nav, no footer, no distraction — 100% focus
- **Timeout:** lock ghế 10 phút, countdown visible
- **Sau confirm:** redirect ngay tới confirmation page, không về home

#### Payment Page
```
No global nav
Chỉ có: progress bar + logo small + back button
Phương thức: COD / VNPAY / Momo / Banking
Không hỏi thông tin thừa (không cần địa chỉ nếu là vé xe)
```

---

### Auth Flow

- Login không chặn search và xem listing
- Chỉ yêu cầu login khi: chọn ghế xong → bấm "Tiếp tục"
- Sau login: redirect về trang đang dở (lưu returnUrl)
- Google OAuth là option ưu tiên (1 click, không phải điền form)
- "Nhớ đăng nhập" checked mặc định

---

### Error & Loading States

#### Error Messages
```
❌ Không: Toast popup che content
✅ Đúng: Error message inline ngay dưới field / section bị lỗi
```

**Format:**
```
[Icon cảnh báo] Không tìm thấy chuyến xe. [Thử ngày khác →]
```
→ Có action button để fix — không chỉ thông báo

#### Loading States
```
❌ Spinner xoay giữa màn hình
✅ Skeleton card giống shape của content thật
```
→ Skeleton màu: --mist với shimmer animation nhẹ

---

### Empty States

#### Không có chuyến
```
[SVG minh họa xe trên đường]
Không có chuyến xe cho tuyến này vào ngày bạn chọn.
[Xem ngày khác] [Xem tuyến gần đây]
```

#### Không có vé
```
[SVG minh họa vé]
Bạn chưa đặt vé nào.
[Tìm chuyến ngay →]
```

---

### Performance UX

- Image lazy load luôn
- Route data: prefetch khi hover vào link tuyến
- Seat map: load độc lập, không block UI
- Search results: hiện skeleton ngay, fill dần
- Page transition: fade 0.2s — không instant snap, không quá 0.5s

---

### Accessibility

- Contrast ratio ≥ 4.5:1 cho text
- Focus state visible (gold outline)
- Seat map: accessible bằng keyboard (Tab + Enter/Space)
- Alt text cho tất cả ảnh có nghĩa
- Form label luôn visible (không chỉ placeholder)

---

### Mobile-Specific

- Touch target ≥ 44px (ghế xe có thể nhỏ hơn nếu có zoom)
- Swipe gesture cho seat map (pinch-to-zoom)
- Search form: date picker native (input type="date")
- Bottom sheet thay popup/modal trên mobile
- Không horizontal scroll trừ seat map

---

## ⚡ PHẦN 4: MOTION_GUIDELINES — Hướng dẫn animation

### Philosophy

> "Nếu bỏ animation này đi, user có miss thông tin gì không?"
> Nếu không → đừng animate.

**Motion phục vụ nội dung — không phải để show off.**

---

### Timing Scale

```
--dur-instant: 0ms      — state change tức thì (không animate)
--dur-fast:   150ms     — micro-interaction (button click, icon swap)
--dur-base:   200–300ms — hover, nav transition, toggle
--dur-slow:   500–700ms — scroll-triggered reveal, page element
--dur-cinematic: 800ms+ — hero intro ONLY
```

---

### Easing Functions

```
ease-out:       cubic-bezier(0, 0, 0.2, 1)       — mặc định, tự nhiên
ease-spring:    spring(stiffness:260, damping:22) — Framer Motion
ease-overshoot: cubic-bezier(0.34, 1.56, 0.64, 1) — chỉ dùng cho tooltip/popover
```

---

### Khi nào animate

#### ✅ Page load — Hero Intro
```
Nav:            fade-in top → opacity 0→1, delay 0ms,   duration 300ms
Hero eyebrow:   fade-up     → opacity 0→1 + y:10→0,  delay 100ms, duration 400ms
Hero heading:   fade-up     → opacity 0→1 + y:20→0,  delay 200ms, duration 600ms
Hero sub:       fade-up     → opacity 0→1 + y:15→0,  delay 350ms, duration 500ms
Hero buttons:   fade-up     → opacity 0→1 + y:10→0,  delay 500ms, duration 400ms
Hero background: KHÔNG animate — đã đủ visual
```

#### ✅ Scroll-triggered — Route Cards
```
Trigger:  IntersectionObserver threshold 0.15
Initial:  opacity: 0, y: 30
Animate:  opacity: 1, y: 0
Duration: 700ms ease-out
Stagger:  không (mỗi card trigger riêng khi vào view)
Reset:    không animate lại khi scroll up
```

#### ✅ Nav Scroll State
```
Trigger:          scrollY > 60px
Transition:       background, backdrop-filter 300ms ease
KHÔNG animate:    logo, links, layout
```

#### ✅ Hover States
```
Button gold:    background + translateY(-1px), 200ms
Button outline: fill background, 200ms
Service card:   translateY(-6px), 300ms ease
Blog card:      translateY(-4px), 300ms ease
Nav link:       color, 150ms
Footer link:    color, 150ms
Route button:   fill background, 200ms
```

#### ✅ Stats Counter
```
Trigger:  IntersectionObserver threshold 0.3, once
Increment: từ 0 → target trong 1200ms
Step:     Math.ceil(target / 40) mỗi 30ms interval
Ease:     linear (setInterval uniform) — không ease curve
```

#### ✅ Page Transitions (Next.js)
```
Exit:   opacity 1→0, 200ms
Enter:  opacity 0→1, 200ms
Total:  400ms — không quá dài
```

---

### Khi nào KHÔNG animate

#### ❌ Hero Background / Mountains
- Không parallax mountains
- Không zoom ảnh
- **Lý do:** lag trên mobile, gây motion sickness

#### ❌ Torn Paper Edges
- Static. Không wiggle, không "tear" animation
- **Lý do:** phức tạp không cần thiết, distract

#### ❌ Winding Path Draw-on
- Không animate SVG path drawing khi scroll
- **Lý do:** implementation nặng, ít impact

#### ❌ Stagger Quá Nhiều
- Không stagger 8+ items. Tối đa 3–4 items stagger nhẹ
- **Lý do:** user phải đợi quá lâu

#### ❌ Bounce / Spring Quá Đà
- Không dùng overshoot easing cho card hover
- Chỉ dùng cho small UI elements (tooltip, badge)

#### ❌ Loading Spinner Xoay
- Dùng skeleton. Không spinner

#### ❌ Number Count-up Khắp Nơi
- Chỉ dùng ở Stats section, không phải mọi số trên trang

---

### Framer Motion Patterns

#### Scroll-triggered Fade-up
```tsx
import { motion } from 'framer-motion'

export function FadeUp({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, ease: [0, 0, 0.2, 1], delay }}
    >
      {children}
    </motion.div>
  )
}
```

#### Hero Intro Sequence
```tsx
const heroVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: [0, 0, 0.2, 1] }
  })
}
```

#### Page Transition Wrapper
```tsx
// app/template.tsx
'use client'
import { motion } from 'framer-motion'

export default function Template({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}
```

---

### prefers-reduced-motion — BẮT BUỘC

```tsx
import { useReducedMotion } from 'framer-motion'
// Framer Motion tự handle khi dùng whileInView, motion.div
// Manual JS animations: check window.matchMedia('(prefers-reduced-motion: reduce)')
```

---

### Mobile Motion

Trên mobile (< 768px):
- Giảm translateY từ 30px → 15px (ít hơn nửa)
- Không dùng spring animation (tốn pin)
- Service card hover: không translateY (không có hover state trên touch)
- Stats counter: vẫn giữ (không tốn performance)

---

## 🎯 PHẦN 5: DECISIONS — Quyết định thiết kế

### Decision: Hero Section (2026-08-19)

#### Quyết định: Dùng SVG Mountain thay vì ảnh thật
**Vấn đề:** Hero cần nền phong cảnh đẹp, nhưng ảnh từ CDN ngoài bị chặn bởi CSP.

**Quyết định:** Dùng 4 lớp SVG path mountain với CSS gradient background.

**Lý do:**
1. SVG mountains trông đẹp hơn JPEG blur placeholder
2. Atmospheric perspective tạo depth tự nhiên
3. File size nhỏ, render instant, không LCP penalty
4. Có thể customize màu sắc hoàn toàn theo palette
5. Consistent với fog dissolve effect

**Cấu trúc 4 lớp:**
```
Layer 1 (xa nhất):  rgba(180,210,190,0.25) — xanh xám nhạt
Layer 2 (giữa):     rgba(80,140,90,0.35)   — xanh rừng
Layer 3 (gần):      rgba(25,60,32,0.6)     — xanh đậm
Layer 4 (foreground): rgba(12,20,14,0.8)   — near-black ridge
```

**Background gradient:**
```css
background: linear-gradient(180deg,
  #0a1a0e 0%, #112418 15%,
  #1a3a20 30%, #224a2a 50%,
  #3a6840 65%, #6a9a70 80%,
  #a8c8ae 92%, #d4e8d6 100%
);
```

#### Quyết định: Fog Dissolve bằng CSS Mask
**Vấn đề:** Cần transition mềm từ hero tối sang section sáng bên dưới.

**Quyết định:** CSS mask-image gradient trắng từ bottom.

```css
.hero-mist-1 {
  position: absolute; bottom: 0; left: 0; right: 0; height: 55%;
  background: linear-gradient(to top, var(--fog) 0%, rgba(245,243,238,.7) 40%, transparent 100%);
}
```

**Lý do:** 2 lớp mist (mist-1 = white gradient, mist-2 = radial từ center bottom) tạo chiều sâu tốt hơn 1 lớp đơn.

#### Quyết định: Search Bar Overlap Hero
**Vấn đề:** Search bar nằm ở đâu — trong hero hay section riêng?

**Quyết định:** Dưới hero với `margin-top: -32px` và `z-index: 10`.

**Lý do:**
- Kéo user attention xuống tự nhiên
- Visual anchor giữa hero và content
- Không mất không gian hero (hero vẫn full-screen)
- Contrast: card trắng nổi bật trên nền fog dissolve

#### Quyết định: Hero Heading Font
**Vấn đề:** Chọn font gì cho hero heading?

**Quyết định:** Cormorant Garamond Italic 700, clamp(3rem, 6vw, 5rem).

**Lý do:**
- Italic tạo cảm giác chuyển động, hành trình
- Serif editorial phù hợp travel storytelling
- Contrast mạnh với Barlow Condensed (bold uppercase) ở section headings
- Không dùng cùng font cho tất cả → tạo nhịp điệu typography

---

### Decision: Booking Flow (2026-08-19)

#### Quyết định: 5-step Linear Flow
**Flow:**
```
Search → Trip Listing → Seat Selection → Review → Payment → Confirmation
```

**Lý do linear (không multi-path):**
- Người dùng VN quen với step-by-step rõ ràng
- Giảm cognitive load — chỉ cần quyết định 1 việc tại 1 thời điểm
- Dễ implement lock state (ghế bị lock 10 phút)

#### Quyết định: Seat Map — CSS Grid, không Canvas
**Quyết định:** Dùng CSS Grid.

**Lý do:**
- Accessibility tốt hơn (button elements, keyboard navigation)
- Easier state management (class-based: available/booked/selected)
- Không cần canvas API phức tạp
- Responsive tốt hơn
- Đủ performant cho 40–60 ghế

**Layout:**
```tsx
<div className="grid grid-cols-3 gap-2"> {/* 2+1 */}
  {seats.map(seat => (
    <button
      key={seat.id}
      disabled={seat.status === 'booked'}
      onClick={() => toggleSeat(seat.id)}
      className={cn(
        'h-10 rounded text-xs font-mono',
        seat.status === 'booked'  && 'bg-red-200 cursor-not-allowed',
        seat.status === 'selected' && 'bg-gold text-ink',
        seat.status === 'available' && 'bg-green-100 hover:bg-green-200',
      )}
    >
      {seat.label}
    </button>
  ))}
</div>
```

#### Quyết định: Payment Page — Stripped UI
**Quyết định:** Không dùng chung layout (nav + footer).

**Layout payment:**
- Không có global nav
- Không có footer
- Chỉ: logo nhỏ (link về home) + progress bar + back button
- Distraction-free environment

**Lý do:** Conversion rate cao hơn khi không có exit points. User đã commit đến bước này.

#### Quyết định: Hiện Giá Ngay Trên Listing Card
**Quyết định:** Trên card listing, prominently.

**Format:**
```
Từ 180,000đ
```
Gold color, font Barlow Condensed 700.

**Lý do:** Research người dùng VN: giá là yếu tố quyết định số 1. Hiding price → cao tỷ lệ bounce.

#### Quyết định: Lock Ghế 10 Phút Với Countdown
**Quyết định:** Lock ghế khi user chọn, 10 phút countdown visible.

**UI:**
```
[⏱ Ghế được giữ trong 09:45 — Hoàn tất thanh toán để không mất ghế]
```
Banner warning vàng nhạt, đếm ngược real-time.
Khi hết giờ: redirect về seat selection với message "Ghế đã được release."

**Lý do:** 10 phút đủ để user điền thông tin và thanh toán. Dưới 10 phút gây pressure không cần thiết.

---

## 📚 PHẦN 6: REFERENCES — Thư viện tham khảo hình ảnh

### Workflow Khi Có Reference Mới

```
1. Save ảnh vào design/references/
2. Thêm vào bảng References
3. Viết Analysis Notes (dùng cho gì, không dùng gì)
4. Khi prompt: đưa cả ảnh lẫn note phân tích
```

### References Đã Có (Session 2026-08-19)

| File | Dùng cho | Lấy từ | Ghi chú |
|------|----------|--------|---------|
| hero-fog-dissolve.png | Hero fog dissolve | Russian travel site | Ảnh núi → white transition |
| route-narrative-path.png | Route narrative scroll | Iceland route | Ảnh float + dotted path |
| brush-stroke-cards.png | Service cards | Antimos | Blob mask + yellow accent |
| torn-paper-edge.png | Section transitions | Story of My Life | Zigzag không đều |
| hero-journez-layout.png | Hero layout | Journez | Composition reference |
| wanderly-stats.png | Stats + typography | Wanderly | Serif italic + stat row |

### Analysis: Russian Travel Site (Hero Fog Dissolve)
- Ảnh núi → white transition bằng fog/mist overlay
- Không hard cut, không gradient đơn giản
- Nhiều lớp mist tạo chiều sâu
- Text trên nền tối, contrast cao
- Winding dotted path nối các sections

### Analysis: Iceland Route (Narrative Scroll)
- Ảnh float trong không gian mây trắng
- Dotted line nối các điểm dừng
- Text xen kẽ trái-phải với ảnh
- Không dùng card — ảnh và text "chìm" vào trang

### Analysis: Antimos (Service Cards)
- Brush stroke / blob mask cho ảnh
- Dark background, bold white text
- Yellow accent button (giống --gold của chúng ta)
- Uppercase bold typography

### Analysis: Wanderly (Stats + Typography)
- Serif italic lớn cho heading (giống Cormorant của chúng ta)
- Dark brown/amber palette (khác palette của chúng ta — chỉ lấy typographic approach)
- Stats row với icon + số

---

## 📊 CHEATSHEET — Nhanh nhất

### Colors (Hex)
```
--ink:    #0C0D0B   (dark text)
--fog:    #F5F3EE   (light bg)
--gold:   #F2C118   (CTA + accent only)
--amber:  #C97B2F   (hover)
--forest: #192B1D   (dark bg)
--slate:  #4A4E46   (secondary text)
--mist:   #E0DDD7   (border)
```

### Fonts
```
Display:  Cormorant Garamond (italic only)
Heading:  Barlow Condensed (uppercase only)
Body:     Inter (400–600)
Mono:     Space Mono (uppercase only)
```

### Button Style
```
border-radius: 50px (LUÔN pill, không bao giờ square)
padding: 14px 32px
font: 700 13px Barlow Condensed uppercase
transition: 0.2s
```

### Card Shadows
```
Search:  0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)
Modal:   Có drop-shadow(0 -4px 8px rgba(0,0,0,0.06))
Other:   Không dùng
```

### Spacing (px)
```
xs:   4     lg:   32    2xl:  96
sm:   8     xl:   64    3xl:  128
md:   16
Section padding: 80px desktop / 40px mobile
```

### Animation Timing
```
Fast:   150ms      (button click)
Base:   200–300ms  (hover)
Slow:   500–700ms  (scroll reveal)
Max:    800ms+     (hero only)
Easing: cubic-bezier(0, 0, 0.2, 1) mặc định
```

### Mobile Breakpoint
```
< 768px: mobile-specific
- Bottom nav cố định
- Date picker native
- No horizontal scroll (except seat map)
```

---

## ✅ Pre-Update Checklist

Trước khi update design, confirm:

- [ ] Đã đọc tất cả 4 file chính: ART_DIRECTION, DESIGN_SYSTEM, UX_PRINCIPLES, MOTION_GUIDELINES
- [ ] Hiểu rõ phải tránh những gì (anti-patterns, không animate)
- [ ] Xác định change nằm ở category nào (colors, typography, spacing, components, animation)
- [ ] Có reference image? → save vào `design/references/` + update README.md
- [ ] Quyết định design mới? → save vào `design/decisions/`
- [ ] Update file tương ứng
- [ ] Update DESIGN_SYSTEM_MAP.md này nếu có thay đổi lớn

---

**Cuối cùng cập nhật: 2026-08-21**
**Design System Version: 1.0**
