# Decision: Hero Section

## Quyết định: Dùng SVG Mountain thay vì ảnh thật

**Ngày:** 2026-08-19
**Vấn đề:** Hero cần nền phong cảnh đẹp, nhưng ảnh từ CDN ngoài bị chặn bởi CSP.

**Quyết định:** Dùng 4 lớp SVG path mountain với CSS gradient background.

**Lý do:**
1. SVG mountains trông đẹp hơn JPEG blur placeholder
2. Atmospheric perspective (màu nhạt dần theo khoảng cách) tạo depth tự nhiên
3. File size nhỏ, render instant, không LCP penalty
4. Có thể customize màu sắc hoàn toàn theo palette
5. Consistent với fog dissolve effect ở bottom

**Cấu trúc 4 lớp:**
```
Layer 1 (xa nhất): rgba(180,210,190,0.25) — xanh xám nhạt
Layer 2 (giữa):    rgba(80,140,90,0.35)   — xanh rừng
Layer 3 (gần):     rgba(25,60,32,0.6)     — xanh đậm
Layer 4 (foreground): rgba(12,20,14,0.8)  — near-black ridge
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

---

## Quyết định: Fog Dissolve bằng CSS mask

**Vấn đề:** Cần transition mềm từ hero tối sang section sáng bên dưới.

**Quyết định:** CSS mask-image gradient trắng từ bottom.

```css
.hero-mist-1 {
  position: absolute; bottom: 0; left: 0; right: 0; height: 55%;
  background: linear-gradient(to top, var(--fog) 0%, rgba(245,243,238,.7) 40%, transparent 100%);
}
```

**Lý do:** 2 lớp mist (mist-1 = white gradient, mist-2 = radial từ center bottom) tạo chiều sâu tốt hơn 1 lớp đơn.

---

## Quyết định: Search bar overlap hero

**Vấn đề:** Search bar nằm ở đâu — trong hero hay section riêng?

**Quyết định:** Dưới hero với `margin-top: -32px` và `z-index: 10`.

**Lý do:**
- Kéo user attention xuống tự nhiên
- Visual anchor giữa hero và content
- Không mất không gian hero (hero vẫn full-screen)
- Contrast: card trắng nổi bật trên nền fog dissolve

---

## Quyết định: Hero heading — Cormorant Garamond Italic

**Vấn đề:** Chọn font gì cho hero heading?

**Quyết định:** Cormorant Garamond Italic 700, clamp(3rem, 6vw, 5rem).

**Lý do:**
- Italic tạo cảm giác chuyển động, hành trình
- Serif editorial phù hợp travel storytelling
- Contrast mạnh với Barlow Condensed (bold uppercase) ở section headings
- Không dùng cùng font cho tất cả → tạo nhịp điệu typography
