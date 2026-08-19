# Reference Library — An Chuyến

Thư mục này chứa ảnh visual references cho từng section.
Đặt ảnh vào đây, đặt tên rõ ràng, ghi note bên dưới.

---

## Cách dùng reference

Khi prompt Claude Code với reference:
1. Đưa ảnh + ghi rõ dùng cho section nào
2. Claude phải **phân tích trước khi code**
3. Giữ nguyên composition, spacing, hierarchy
4. Chỉ thay content sang An Chuyến

---

## References đã có

### Từ session 2026-08-19

| File | Dùng cho | Lấy từ |
|------|----------|--------|
| *(chưa save)* | Hero fog dissolve | Russian travel site (ảnh 2) |
| *(chưa save)* | Route narrative path | Iceland route (ảnh 3) |
| *(chưa save)* | Brush stroke cards | Antimos (ảnh 1) |
| *(chưa save)* | Torn paper edge | Story of My Life (ảnh 6) |
| *(chưa save)* | Hero layout | Journez (ảnh 5) |
| *(chưa save)* | Stats + typography | Wanderly (ảnh 7) |

**Hướng dẫn:** Save ảnh reference vào thư mục này với tên:
```
hero-fog-dissolve.png
route-narrative-path.png
brush-stroke-cards.png
torn-paper-edge.png
hero-journez-layout.png
wanderly-stats.png
```

---

## Analysis Notes

### Russian travel site (hero fog dissolve)
- Ảnh núi → white transition bằng fog/mist overlay
- Không hard cut, không gradient đơn giản
- Nhiều lớp mist tạo chiều sâu
- Text trên nền tối, contrast cao
- Winding dotted path nối các sections

### Iceland route (narrative scroll)
- Ảnh float trong không gian mây trắng
- Dotted line nối các điểm dừng
- Text xen kẽ trái-phải với ảnh
- Không dùng card — ảnh và text "chìm" vào trang

### Antimos (service cards)
- Brush stroke / blob mask cho ảnh
- Dark background, bold white text
- Yellow accent button (giống --gold của chúng ta)
- Uppercase bold typography

### Wanderly (stats + typography)
- Serif italic lớn cho heading (giống Cormorant của chúng ta)
- Dark brown/amber palette (khác palette của chúng ta — chỉ lấy typographic approach)
- Stats row với icon + số

---

## Workflow khi có reference mới

```
1. Save ảnh vào thư mục này
2. Thêm vào bảng References bên trên
3. Viết Analysis Notes (dùng cho gì, không dùng gì)
4. Khi prompt: đưa cả ảnh lẫn note phân tích
```
