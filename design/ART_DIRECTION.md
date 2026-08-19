# Art Direction — An Chuyến

## Core Concept

**Cinematic Adventure Travel**

Website phải gợi cảm giác: đứng trước cửa sổ xe đêm, nhìn ra núi rừng mờ sương,
hành trình chưa bắt đầu nhưng đã cảm thấy tự do.

**Influences:**
- Editorial travel magazines (National Geographic, Monocle Travel)
- Luxury outdoor brands (Arc'teryx, Patagonia web)
- Nordic travel sites (fog + mist aesthetic)
- Russian travel design (winding path narrative, collage layers)
- Antimos / Journez style (adventure + yellow accent)

---

## Visual Language

### Ảnh và nền

Không dùng stock photo generic. Dùng:
- CSS gradient landscape (nhiều lớp màu xanh rừng)
- SVG mountain silhouettes với atmospheric perspective
- Khi dùng ảnh thật: luôn áp fog dissolve mask

**Atmospheric perspective rule:**
```
Lớp xa nhất  → màu nhạt, blue-gray, opacity thấp
Lớp giữa     → xanh rừng trung bình
Lớp gần nhất → xanh đậm, cao độ rõ
Foreground   → near-black, silhouette cứng
```

### Signature Effects (theo thứ tự ưu tiên)

**E1 — Fog Dissolve** ← quan trọng nhất
Mọi ảnh lớn đều có cạnh dưới tan vào nền.
```css
mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
```

**E2 — SVG Mountain Layers**
Hero không dùng ảnh — dùng 4 lớp SVG path.
4 màu khác nhau (opacity giảm dần theo khoảng cách).

**E3 — Torn Paper Edge**
Chuyển section bằng đường xé giấy SVG không đều.
Mỗi transition dùng path khác nhau, không copy-paste.
```svg
<path d="M0,28 L12,20 L20,32 L30,14 ..."/>
```

**E4 — Winding Dotted Path**
SVG dashed stroke nối các điểm dừng trong route narrative.
```svg
stroke-dasharray="6 5" stroke="#E0DDD7"
```

**E5 — Wave Transition**
Bezier curve mềm, dùng ở footer và stats→blog.
Khác E3 — mềm hơn, không jagged.

**E6 — Blob Clip Card**
Service card dùng SVG clipPath hữu cơ (không phải rectangle).
Mỗi card có path khác nhau.

---

## Typography Direction

### Hero heading
```
Cormorant Garamond Italic, 700
Size: clamp(3rem, 6vw, 5rem)
Line-height: 1.0
Color: white (trên nền tối) hoặc --ink (trên nền sáng)
Text-shadow: 0 4px 40px rgba(0,0,0,0.3) — chỉ khi trên ảnh
```

**Cảm giác muốn đạt được:** tựa như tiêu đề bìa tạp chí travel.
**KHÔNG PHẢI:** bold sans-serif to như quảng cáo.

### Section headings
```
Barlow Condensed 800 Uppercase
Tracking: 0.04–0.06em
Size: clamp(1.8rem, 3vw, 2.6rem)
```
**Cảm giác:** mạnh, rõ ràng, contrast với display italic.

### Labels / Eyebrows
```
Space Mono Uppercase
Size: 9–10px
Letter-spacing: 0.18–0.22em
Color: --gold hoặc --amber
```
**Format:** `✦ Tuyến đường nổi bật · 2026`

---

## Color Mood

| Cảm giác | Màu |
|----------|-----|
| Đêm / rừng sâu | `--forest #192B1D` |
| Sương mù / bình yên | `--fog #F5F3EE` |
| Ánh sáng vàng / năng lượng | `--gold #F2C118` |
| Hoàng hôn / depth | `--amber #C97B2F` |
| Đêm đen / ink | `--ink #0C0D0B` |

**Gold (#F2C118) chỉ dùng cho:**
- CTA button chính
- Eyebrow label
- Stat divider
- Route dot marker
- Hover accent

**KHÔNG dùng gold cho:**
- Background section
- Border thông thường
- Text body

---

## Layout Principles

### Negative space
Nhiều space hơn bạn nghĩ cần. An Chuyến không phải site nhồi nhét thông tin.

### Asymmetry
Route section: ảnh trái-text phải xen kẽ, không phải grid đều nhau.

### Layering
Background → atmosphere → content → overlay
Mỗi lớp có depth riêng.

### Section rhythm
```
DARK section → torn edge → LIGHT section → torn edge → DARK section
```
Không để 2 section cùng màu nền liền nhau.

---

## Reference Workflow

Khi user đưa reference image:

1. **KHÔNG implement ngay**
2. Phân tích: composition, hierarchy, spacing, depth, typography, color treatment
3. Viết implementation plan
4. Giữ nguyên composition và spacing relationships
5. Chỉ thay content sang An Chuyến
6. Screenshot → compare → list differences → fix

**Principle:** Reference là visual spec, không phải inspiration.
Đừng redesign. Đừng thêm "style của bạn" vào.

---

## Anti-patterns — Tuyệt đối tránh

```
❌ Pure white background (#ffffff) → dùng --fog #F5F3EE
❌ Generic blue (#2563EB, #3B82F6) → dùng palette đã định
❌ Shadow box khắp nơi → shadow chỉ ở search card và modal
❌ Rounded corners tất cả (rounded-2xl mọi thứ)
❌ Gradient header linear từ xanh → tím
❌ Card grid 3-4 cột đều nhau trên white background
❌ Loading spinner xoay giữa màn hình
❌ Toast popup che content
❌ Parallax scroll (lag trên mobile)
❌ Font Poppins, Nunito, Montserrat — quá phổ biến
❌ Icon emoji làm section marker
❌ Nút có border-radius: 4px — quá corporate
```
