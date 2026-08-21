# Design System — An Chuyến

> **Cập nhật 2026-08-22:** Bảng token dưới đây phản ánh giá trị thực tế đã triển khai trên toàn bộ 20 trang
> (đồng bộ hoá trong đợt redesign 2026-08-22). Xem `design/decisions/design-system-reconciliation.md`
> để biết lý do các giá trị đổi so với bản trước.

## Color Tokens

```css
:root {
  /* Core palette — Lumora dark cinematic */
  --bg-page:    #0e1111;   /* nền chính toàn site (thay --fog cũ) */
  --bg-card:    rgba(255,255,255,0.025); /* nền card trên nền tối */
  --border:     rgba(255,255,255,0.08);  /* border/divider trên nền tối */
  --gold:       #d4af37;   /* accent DUY NHẤT (thay #F2C118 cũ) */
  --gold-hover: #f0c94a;
  --text-primary: #f0ede6; /* chữ chính trên nền tối (thay --ink dark-on-light cũ) */
  --text-muted:   rgba(240,237,230,0.45);

  /* Semantic aliases */
  --accent:       var(--gold);
  --accent-hover: var(--gold-hover);
}
```

### Lý do không dùng pure white/black
- `#ffffff` → trông rẻ tiền, contrast quá cứng
- `#000000` → quá harsh, không phù hợp cảm giác cinematic
- `#0e1111` và `#f0ede6` có tông warm nhẹ → hòa quyện với ánh sáng gold accent

---

## Typography

### Font stack
```css
--font-display: 'Cormorant Garamond', 'Playfair Display', Georgia, serif; /* heading lớn, italic cho hero/số liệu */
--font-logo:    'Instrument Serif', serif; /* CHỈ dùng cho logo Header/Footer, luôn italic */
--font-eyebrow: 'Barlow Condensed', system-ui, sans-serif; /* label nhỏ, uppercase */
--font-body:    system-ui, 'Outfit', sans-serif;
```

### Type scale
```
Display (hero):      clamp(3rem, 7vw, 6rem)      — Cormorant/Instrument Italic
Section title:        clamp(1.8rem, 3vw, 2.6rem)  — Cormorant Garamond 400
Card title:           1.15–1.4rem                 — Cormorant Garamond 600 hoặc system-ui 700
Body large:           15–16px                     — system-ui 400–500
Body:                 13–14px                     — system-ui 400
Label/eyebrow:        9–11px                      — Barlow Condensed / system-ui, uppercase, letter-spacing 0.2–0.35em, màu gold
Stat number:          clamp(2.2rem, 4vw, 3.4rem)  — Cormorant Garamond 600–700
```

### Type rules
```
Cormorant Garamond / Playfair Display → dùng cho heading, số liệu lớn, không uppercase
Instrument Serif    → CHỈ logo Header/Footer, luôn italic
Barlow Condensed / system-ui (eyebrow) → luôn uppercase + letter-spacing 0.2–0.35em + màu gold
system-ui (body)    → không uppercase, weight 400–700 tuỳ ngữ cảnh
```

> **Đã loại bỏ:** `Space Mono` (chưa từng triển khai), `Inter` cho body (thực tế dùng system-ui/Outfit).

---

## Spacing

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

## Buttons

### Primary (gold)
```css
background: var(--gold);
color: var(--ink);
padding: 14px 32px;
border-radius: 50px;          /* pill — không phải square */
font: 700 13px 'Barlow Condensed';
letter-spacing: 0.06em;
text-transform: uppercase;
transition: background 0.2s, transform 0.15s;

hover: background #e6b410; transform translateY(-1px);
```

### Dark
```css
background: var(--ink);
color: var(--fog);
/* same shape as primary */
hover: background var(--forest);
```

### Outline
```css
background: transparent;
color: var(--ink);
border: 1.5px solid var(--ink);
/* same shape */
hover: background var(--ink); color var(--fog);
```

### Ghost (trên nền tối)
```css
background: transparent;
color: rgba(255,255,255,0.8);
border: 1px solid rgba(255,255,255,0.25);
hover: border-color rgba(255,255,255,0.6); color white;
```

**Rule:** Luôn dùng border-radius: 50px (pill). Không dùng 4px, 8px, 12px cho button.

---

## Cards

### Service Card
```
Height: 260px
Background: CSS gradient (không dùng ảnh)
Clip-path: SVG blob unique mỗi card
Overlay: linear-gradient đen từ đáy lên 50%
Label: Space Mono 9px gold (category) + Barlow 800 uppercase (name)
Arrow: circle 32px gold góc phải dưới
Hover: translateY(-6px) 0.3s
```

### Route Card
```
Grid: 1fr 80px 1fr (photo | dot | info)
Photo height: 320px + fog dissolve mask
Photo: CSS gradient + SVG mountain nhỏ bên trong
Dot: 14px circle gold/amber với ring
Info padding: 0 32px
Fade-in: IntersectionObserver, translateY 30px → 0
```

### Blog Card
```
Thumbnail height: 180px
Background: CSS gradient + fog overlay đáy
Tag: gold badge top-left
Title: Barlow Condensed 700 uppercase
Excerpt: Inter 12.5px slate
Link: amber "Đọc tiếp →"
Hover: translateY(-4px)
Border: 0.5px solid --mist
```

---

## Section Transitions

### Torn Paper (E3)
```
SVG viewBox: 0 0 1440 56
Path: ~80 điểm zigzag không đều
Fill: màu section bên dưới
Filter: drop-shadow(0 -4px 8px rgba(0,0,0,0.06))
```

### Wave (E5)
```
SVG Bezier C path — cong nhẹ một lần
Dùng ở: stats→blog, footer top
Khác torn: mềm hơn, không jagged
```

**Rule:** Không dùng 2 torn edges liên tiếp. Không dùng straight divider (border/hr).

---

## Nav

```
Position: fixed top-0 z-100
Default: transparent background
Scrolled (>60px): rgba(12,13,11,0.88) + backdrop-filter blur(12px)
Transition: 0.3s

Logo: Cormorant Garamond italic, 1.5rem, white
Links: Inter 500 13px uppercase letter-spacing 0.04em, rgba(255,255,255,0.7)
CTA: gold pill button
```

---

## Forms & Inputs

### Search bar
```
Container: white card, border-radius 16px
Shadow: 0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)
Field divider: border-right 1px --mist
Label: Space Mono 9px gold uppercase
Input: Barlow Condensed 600 1.1rem uppercase
Submit: ink dark, border-radius 12px
```

### Standard input
```
Border-bottom: 1.5px solid --mist (không dùng full border)
Focus: border-color --gold
Font: Inter 15px
Background: transparent
Label: Space Mono uppercase 9px --slate
```

---

## Gradients — CSS Landscape Palette

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

## Icons

Dùng Lucide React cho icons chức năng.
Không dùng emoji làm icon UI.
Icon size: 16px inline, 20px medium, 24px max.

---

## Responsive Breakpoints

```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1440px
```

Mobile-specific:
- Bottom nav bar cố định (4 items)
- Search bar stacked (3 field thành 3 hàng)
- Route cards full width (không alternating)
- Service grid: 2×2 thay vì 1×4
