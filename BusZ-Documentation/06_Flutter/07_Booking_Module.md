# Booking Module

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Flutter Mobile App

Document ID

APP-007

Priority

Critical

Version

1.0

---

# 1. Purpose

Booking Module quản lý toàn bộ quy trình đặt vé của người dùng.

Bao gồm:

- Chọn chuyến xe
- Chọn ghế
- Chọn điểm đón/trả
- Nhập thông tin hành khách
- Áp dụng khuyến mãi
- Xác nhận đặt vé
- Chuyển sang thanh toán

---

# 2. Booking Flow

```text
Search Result

↓

Trip Detail

↓

Seat Selection

↓

Passenger Information

↓

Promotion

↓

Booking Summary

↓

Payment
```

---

# 3. Seat Selection Screen

Hiển thị

- Thông tin chuyến xe
- Sơ đồ ghế
- Chú thích trạng thái ghế
- Đồng hồ đếm ngược giữ ghế
- Tổng tiền tạm tính

---

# 4. Seat Status

```text
AVAILABLE

SELECTED

LOCKED

BOOKED

BLOCKED
```

Màu sắc

- Xanh: Available
- Đỏ: Booked
- Cam: Locked
- Xám: Blocked
- Primary: Selected

---

# 5. Seat Selection Rules

- Chỉ chọn ghế AVAILABLE.
- Tối đa 10 ghế/đơn.
- Không chọn ghế BLOCKED.
- Cập nhật theo thời gian thực.

---

# 6. Seat Hold Timer

Thời gian giữ ghế

```text
15 phút
```

Hiển thị

```text
14:59
```

Khi hết thời gian

↓

Giải phóng ghế

↓

Quay về màn hình chọn ghế.

---

# 7. Pickup & Dropoff

Người dùng chọn:

```text
Pickup Point

↓

Dropoff Point
```

Hiển thị

- Địa chỉ
- Thời gian đón
- Ghi chú

---

# 8. Passenger Information

Cho mỗi ghế

Fields

```text
Full Name

Phone Number

Identity Number

Email (optional)
```

Validation

- Không để trống
- Số điện thoại hợp lệ
- CCCD/Hộ chiếu đúng định dạng

---

# 9. Promotion

Cho phép

- Nhập mã giảm giá
- Chọn voucher đã lưu

Hiển thị

```text
Discount

Final Price
```

---

# 10. Booking Summary

Hiển thị

- Tuyến xe
- Nhà xe
- Ghế
- Hành khách
- Điểm đón
- Điểm trả
- Giá vé
- Giảm giá
- Phí dịch vụ
- Tổng thanh toán

---

# 11. Confirmation Dialog

Trước khi sang Payment

```text
Confirm Booking?
```

Buttons

```text
Continue Payment

Back
```

---

# 12. Booking States

```text
Draft

↓

Pending Payment

↓

Paid

↓

Confirmed

↓

Completed
```

---

# 13. Loading State

Skeleton

- Seat Map
- Passenger Form
- Summary

---

# 14. Empty State

Ví dụ

```text
No seats available.
```

Hiển thị

- Illustration
- Search Another Trip

---

# 15. Error State

Ví dụ

```text
Seat is no longer available.
```

Buttons

```text
Refresh Seats

Back
```

---

# 16. Realtime Updates

Sử dụng

```text
Supabase Realtime

hoặc

WebSocket
```

Đồng bộ

- Ghế
- Trạng thái Booking
- Countdown

---

# 17. State Management

Cubit

```text
BookingCubit
```

States

```text
BookingInitial

BookingLoading

BookingLoaded

BookingSeatLocked

BookingExpired

BookingSuccess

BookingError
```

---

# 18. API Integration

```text
GET /trips/{id}

GET /trips/{id}/seats

POST /bookings

POST /promotions/apply
```

---

# 19. Component Tree

```text
BookingScreen

↓

TripHeader

↓

SeatMap

↓

PickupSelector

↓

DropoffSelector

↓

PassengerForm

↓

PromotionSection

↓

BookingSummary

↓

BottomActionBar
```

---

# 20. UX Guidelines

✓ Hiển thị số ghế đã chọn.

✓ Cập nhật tổng tiền ngay lập tức.

✓ Cảnh báo khi còn dưới 2 phút giữ ghế.

✓ Tự động cuộn tới hành khách tiếp theo khi hoàn thành thông tin.

✓ Không mất dữ liệu khi xoay màn hình hoặc chuyển ứng dụng trong thời gian giữ ghế.

---

# 21. Performance

Seat Load

```text
<150ms
```

Realtime Update

```text
<1s
```

Booking Submit

```text
<300ms
```

---

# 22. Test Cases

✓ Select Seat.

✓ Seat Already Booked.

✓ Timer Expired.

✓ Apply Promotion.

✓ Invalid Passenger.

✓ Create Booking.

✓ Refresh Seat Map.

✓ Realtime Update.

---

# 23. Acceptance Criteria

✓ Seat Lock hoạt động.

✓ Countdown chính xác.

✓ Validation đầy đủ.

✓ Promotion hoạt động.

✓ Booking Summary chính xác.

✓ Chuyển sang Payment thành công.

---

# 24. Related Documents

APP-006 Search Module

APP-008 Payment Module

API-007 Booking API

API-011 Promotion API

---

# 25. Summary

Booking Module là trung tâm của quy trình đặt vé BusZ, cho phép người dùng chọn ghế, nhập thông tin hành khách, áp dụng khuyến mãi và tạo đơn đặt vé. Module được thiết kế với đồng bộ thời gian thực, cơ chế giữ ghế 15 phút và các trạng thái UI đầy đủ nhằm đảm bảo trải nghiệm đặt vé nhanh chóng, chính xác và an toàn.