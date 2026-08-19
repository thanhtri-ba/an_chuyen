# UX Principles — An Chuyến

## Core Jobs To Be Done

Người dùng đến An Chuyến để:
1. **Tìm chuyến xe** từ A đến B vào ngày cụ thể
2. **Đặt vé** nhanh nhất có thể
3. **Xem lại vé** đã đặt
4. **Khám phá** tuyến đường / dịch vụ

Mọi quyết định UX phải phục vụ 4 mục tiêu này. Không thêm friction không cần thiết.

---

## Navigation

### Desktop Nav
- Logo trái, links giữa, auth button phải
- Transparent trên hero, đổi dark khi scroll
- Luôn hiện — không hide khi scroll down (khác pattern "hide-on-scroll")
- Active state: gold underline 2px bottom

### Mobile Nav
- Bottom bar cố định: Trang chủ / Tìm chuyến / Vé của tôi / Tài khoản
- Icon + label nhỏ bên dưới
- Active: gold fill icon + gold label
- **Không được ẩn bottom bar bất kỳ lúc nào**

---

## Search — Ưu tiên tuyệt đối

Search bar phải:
- Visible ngay khi page load (không cần scroll)
- Float overlap với hero → pull user attention xuống
- 3 field: Điểm đi / Điểm đến / Ngày đi
- Swap button giữa Điểm đi ↔ Điểm đến
- Gợi ý auto-complete khi gõ tên thành phố
- Submit khi Enter hoặc click nút

**Không được:**
- Ẩn sau tab hay accordion
- Yêu cầu login trước khi search
- Reset form khi user navigate back

---

## Search Results Page

### Hiển thị giá ngay
Không click vào card mới thấy giá. Người dùng VN quyết định theo giá trước.

### Filter sidebar (desktop)
```
Giờ khởi hành (slider range)
Giá (slider range)
Loại xe (checkbox: giường nằm / ghế ngồi)
Hãng xe (checkbox)
```

### Sorting
Default: giờ khởi hành sớm nhất. Options: Giá thấp nhất / Nhanh nhất.

### Card chuyến xe
```
Giờ đi — Giờ đến (Barlow Condensed lớn)
Tên hãng xe + loại xe
Thời gian hành trình
Giá (highlight gold)
Số ghế còn
Nút "Chọn ghế →"
```

**Không có:** đánh giá sao, review count (dùng sau khi có data).

---

## Seat Selection

### Sơ đồ ghế
- Layout 2+1 (giường nằm) hoặc 2+2 (ghế ngồi)
- Màu ghế:
  - Xanh lá: trống — có thể chọn
  - Đỏ: đã đặt — disabled, không click được
  - Vàng (--gold): đang chọn
  - Xám: không bán (tài xế, cầu thang)
- Click để chọn/bỏ chọn
- Tối đa 4 ghế / lượt

### Panel tóm tắt (sticky right)
```
Tuyến + ngày
Danh sách ghế đã chọn
Tổng tiền (cập nhật real-time)
Nút "Tiếp tục →"
```

**Mobile:** Panel tóm tắt ở bottom, expandable.

---

## Booking Flow

```
Search → Select Trip → Select Seat → Review → Payment → Confirmation
```

### Rules
- **Không back-and-forth bắt buộc** — mỗi bước forward, không ép user về trước
- **Progress indicator** rõ ràng — biết đang ở bước mấy / còn mấy bước
- **Trang thanh toán:** no nav, no footer, no distraction — 100% focus
- **Timeout:** lock ghế 10 phút, countdown visible
- **Sau confirm:** redirect ngay tới confirmation page, không về home

### Payment page
- No global nav
- Chỉ có: progress bar + logo small + back button
- Phương thức: COD / VNPAY / Momo / Banking
- Không hỏi thông tin thừa (không cần địa chỉ nếu là vé xe)

---

## Auth Flow

- Login không chặn search và xem listing
- Chỉ yêu cầu login khi: chọn ghế xong → bấm "Tiếp tục"
- Sau login: redirect về trang đang dở (lưu returnUrl)
- Google OAuth là option ưu tiên (1 click, không phải điền form)
- "Nhớ đăng nhập" checked mặc định

---

## Error States

### Inline, không phải toast
```
❌ Toast popup che content
✅ Error message inline ngay dưới field / section bị lỗi
```

### Format error
```
[Icon cảnh báo] Không tìm thấy chuyến xe. [Thử ngày khác →]
```
Có action button để fix — không chỉ thông báo.

### Loading states
```
❌ Spinner xoay giữa màn hình
✅ Skeleton card giống shape của content thật
```

Skeleton màu: --mist với shimmer animation nhẹ.

---

## Empty States

### Không có chuyến
```
[SVG minh họa xe trên đường]
Không có chuyến xe cho tuyến này vào ngày bạn chọn.
[Xem ngày khác] [Xem tuyến gần đây]
```

### Không có vé
```
[SVG minh họa vé]
Bạn chưa đặt vé nào.
[Tìm chuyến ngay →]
```

---

## Performance UX

- Image lazy load luôn
- Route data: prefetch khi hover vào link tuyến
- Seat map: load độc lập, không block UI
- Search results: hiện skeleton ngay, fill dần
- Page transition: fade 0.2s — không instant snap, không quá 0.5s

---

## Accessibility

- Contrast ratio ≥ 4.5:1 cho text
- Focus state visible (gold outline)
- Seat map: accessible bằng keyboard (Tab + Enter/Space)
- Alt text cho tất cả ảnh có nghĩa
- Form label luôn visible (không chỉ placeholder)

---

## Mobile-Specific

- Touch target ≥ 44px (ghế xe có thể nhỏ hơn nếu có zoom)
- Swipe gesture cho seat map (pinch-to-zoom)
- Search form: date picker native (input type="date")
- Bottom sheet thay popup/modal trên mobile
- Không horizontal scroll trừ seat map (có overflow-x: auto)
