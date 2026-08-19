# Motion Guidelines — An Chuyến

## Philosophy

Motion phục vụ nội dung — không phải để show off.

**Câu hỏi trước khi animate:**
> "Nếu bỏ animation này đi, user có miss thông tin gì không?"

Nếu không → đừng animate.

---

## Timing Scale

```
--dur-instant: 0ms      — state change tức thì (không animate)
--dur-fast:   150ms     — micro-interaction (button click, icon swap)
--dur-base:   200–300ms — hover, nav transition, toggle
--dur-slow:   500–700ms — scroll-triggered reveal, page element
--dur-cinematic: 800ms+ — hero intro ONLY
```

---

## Easing

```
ease-out:      cubic-bezier(0, 0, 0.2, 1)  — mặc định, tự nhiên
ease-spring:   spring(stiffness:260, damping:22) — Framer Motion
ease-overshoot: cubic-bezier(0.34, 1.56, 0.64, 1) — chỉ dùng cho tooltip/popover
```

---

## Khi nào animate

### ✅ Page load — Hero intro
```
Nav:           fade-in top → opacity 0→1, delay 0ms,   duration 300ms
Hero eyebrow:  fade-up     → opacity 0→1 + y:10→0,  delay 100ms, duration 400ms
Hero heading:  fade-up     → opacity 0→1 + y:20→0,  delay 200ms, duration 600ms
Hero sub:      fade-up     → opacity 0→1 + y:15→0,  delay 350ms, duration 500ms
Hero buttons:  fade-up     → opacity 0→1 + y:10→0,  delay 500ms, duration 400ms
Hero background: KHÔNG animate — đã đủ visual
```

### ✅ Scroll-triggered — Route cards
```
Trigger: IntersectionObserver threshold 0.15
Initial:  opacity: 0, y: 30
Animate:  opacity: 1, y: 0
Duration: 700ms ease-out
Stagger:  không (mỗi card trigger riêng khi vào view)
Reset:    không animate lại khi scroll up
```

### ✅ Nav scroll state
```
Trigger: scrollY > 60px
Transition: background, backdrop-filter 300ms ease
KHÔNG animate: logo, links, layout
```

### ✅ Hover states
```
Button gold:    background + translateY(-1px), 200ms
Button outline: fill background, 200ms
Service card:   translateY(-6px), 300ms ease
Blog card:      translateY(-4px), 300ms ease
Nav link:       color, 150ms
Footer link:    color, 150ms
Route button:   fill background, 200ms
```

### ✅ Stats counter
```
Trigger: IntersectionObserver threshold 0.3, once
Increment từ 0 → target trong 1200ms
Step: Math.ceil(target / 40) mỗi 30ms interval
Ease: linear (setInterval uniform) — không ease curve
```

### ✅ Page transitions (Next.js)
```
Exit:  opacity 1→0, 200ms
Enter: opacity 0→1, 200ms
Total: 400ms — không quá dài
```

---

## Khi nào KHÔNG animate

### ❌ Hero background / mountains
Không parallax mountains. Không zoom ảnh.
Lý do: lag trên mobile, gây motion sickness.

### ❌ Torn paper edges
Static. Không wiggle, không "tear" animation.
Lý do: phức tạp không cần thiết, distract khỏi content.

### ❌ Winding path draw-on
Không animate SVG path drawing khi scroll.
Lý do: implementation nặng, ít impact thực tế.

### ❌ Stagger quá nhiều
Không stagger 8+ items. Tối đa 3–4 items stagger nhẹ.
Lý do: user phải đợi quá lâu.

### ❌ Bounce / spring quá đà
Không dùng overshoot easing cho card hover.
Chỉ dùng cho small UI elements (tooltip, badge).

### ❌ Loading spinner xoay
Dùng skeleton. Không spinner.

### ❌ Number count-up khắp nơi
Chỉ dùng ở Stats section, không phải mọi số trên trang.

---

## Framer Motion Patterns

### Scroll-triggered fade-up
```tsx
// components/ui/FadeUp.tsx
import { motion } from 'framer-motion'

export function FadeUp({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
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

### Hero intro sequence
```tsx
// Dùng variants để sync timing
const heroVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: [0, 0, 0.2, 1] }
  })
}
```

### Page transition wrapper
```tsx
// app/template.tsx
'use client'
import { motion } from 'framer-motion'

export default function Template({ children }: { children: React.ReactNode }) {
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

## prefers-reduced-motion

**Bắt buộc:** Tất cả animation phải respect `prefers-reduced-motion`.

```tsx
// hook/useReducedMotion.ts
import { useReducedMotion } from 'framer-motion'

// Framer Motion tự handle khi dùng whileInView, motion.div
// Manual JS animations: check window.matchMedia('(prefers-reduced-motion: reduce)')
```

---

## Mobile Motion

Trên mobile (< 768px):
- Giảm translateY từ 30px → 15px (ít hơn nửa)
- Không dùng spring animation (tốn pin)
- Service card hover: không translateY (không có hover state trên touch)
- Stats counter: vẫn giữ (không tốn performance)
