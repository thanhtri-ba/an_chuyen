# Seat Selection Screen

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Booking

Screen ID: BOOK-001

Priority: Critical

Status: Draft

---

# 1. Purpose

Seat Selection cho phép người dùng lựa chọn vị trí ghế trên xe trước khi tiến hành đặt vé.

Đây là bước quan trọng nhất trong quy trình Booking.

---

# 2. Business Goal

Người dùng có thể:

- Xem sơ đồ ghế.
- Chọn ghế.
- Bỏ chọn ghế.
- Xem giá từng ghế.
- Xem ghế đã bán.
- Xem ghế đang giữ.
- Tiếp tục nhập thông tin hành khách.

---

# 3. Actors

Customer

Guest (Login Required Before Payment)

---

# 4. Preconditions

- Người dùng đã chọn Trip.
- Trip còn mở bán.
- Còn ít nhất một ghế trống.
- Kết nối Internet ổn định.

---

# 5. UI Layout

AppBar

↓

Trip Summary

↓

Seat Legend

↓

Seat Map

↓

Selected Seats

↓

Price Summary

↓

Continue Button

---

# 6. Components

Back Button

Trip Summary Card

Seat Legend

Seat Map

Seat Widget

Zoom Control (Future)

Selected Seat Card

Price Summary Card

Continue Button

---

# 7. Seat Legend

🟩 Available

🟥 Booked

🟨 Holding

🟦 Selected

⬜ Driver

⬛ Disabled

---

# 8. Seat Types

Normal Seat

VIP Seat

Limousine Seat

Sleeper Seat

Cabin Seat

Female Seat (Future)

Priority Seat

---

# 9. Seat Information

Seat Number

Seat Code

Seat Floor

Seat Type

Seat Price

Seat Status

---

# 10. Seat Status

AVAILABLE

BOOKED

HOLDING

SELECTED

LOCKED

DISABLED

MAINTENANCE

---

# 11. Business Rules

BR-001

Không chọn ghế đã bán.

BR-002

Không chọn ghế đang giữ.

BR-003

Một người tối đa 10 ghế.

BR-004

Ghế được giữ trong 10 phút.

BR-005

Hết thời gian giữ ghế sẽ tự động giải phóng.

BR-006

Ghế VIP có phụ thu riêng.

---

# 12. Seat Hold Flow

User chọn ghế

↓

POST /seat-hold

↓

Seat Locked

↓

Countdown 10 phút

↓

Booking Success

↓

Seat Sold

Hoặc

Timeout

↓

Release Seat

---

# 13. Business Logic

Load Seat Map

↓

Load Seat Status

↓

User Select Seat

↓

Validate

↓

Hold Seat

↓

Update UI

↓

Continue Booking

---

# 14. API

GET /trips/{tripId}/seats

POST /seat-hold

DELETE /seat-hold/{seatId}

POST /seat-release

---

# 15. Database

trip_seats

seat_types

seat_holds

bookings

booking_details

seat_prices

---

# 16. Loading State

Seat Skeleton

↓

Loading Seat Status

↓

Loading Price

---

# 17. Empty State

Không còn ghế.

↓

Trip Full

↓

Suggest Another Trip

---

# 18. Error State

Seat vừa được người khác chọn.

↓

Refresh Seat Map.

---

Seat Hold Failed.

↓

Retry.

---

Network Error.

↓

Retry.

---

# 19. Success State

Seat Selected.

↓

Price Updated.

↓

Continue Enabled.

---

# 20. Countdown Timer

10 phút.

Hiển thị:

09:59

↓

00:00

↓

Release Seat

---

# 21. Price Summary

Base Ticket Price

Seat Surcharge

Promotion

Discount

VAT

Total Price

---

# 22. Navigation

Continue

↓

Passenger Information

Back

↓

Trip Detail

---

# 23. Analytics

seat_map_view

seat_select

seat_unselect

seat_hold

seat_release

continue_booking

---

# 24. Flutter Widget Tree

Scaffold

↓

CustomScrollView

↓

TripSummaryCard

↓

SeatLegend

↓

SeatMapWidget

↓

SelectedSeatList

↓

PriceSummary

↓

BottomActionBar

---

# 25. State Management

SeatBloc

SeatEvent

SeatState

SeatRepository

BookingRepository

RealtimeSeatService

---

# 26. Realtime Synchronization

WebSocket

Hoặc

Supabase Realtime

Hoặc

Firebase Realtime

Khi một ghế thay đổi trạng thái:

↓

Cập nhật ngay trên tất cả thiết bị.

---

# 27. Performance

Load Seat

< 2 giây

Realtime Delay

< 500ms

Animation

60 FPS

---

# 28. Accessibility

Touch Area ≥ 48dp

Color + Icon

Screen Reader

Zoom Support

---

# 29. Test Cases

✓ Chọn ghế.

✓ Bỏ chọn ghế.

✓ Ghế đã bán.

✓ Ghế đang giữ.

✓ Timeout.

✓ Realtime Update.

✓ Không Internet.

✓ Continue.

---

# 30. Acceptance Criteria

✓ Ghế cập nhật realtime.

✓ Không chọn được ghế đã bán.

✓ Hold Seat thành công.

✓ Countdown hoạt động.

✓ Continue đúng.

✓ Không crash.

---

# 31. Related Documents

Trip Detail

Passenger Information

Booking Summary

Payment

Database

Realtime Architecture

---

# 32. Future Expansion

3D Seat Map

AR Seat Preview

Multi-floor Bus

Seat Recommendation

Nearby Friend Seat

AI Best Seat

Seat Heatmap

---

# 33. Summary

Seat Selection là màn hình quan trọng nhất của quy trình đặt vé.

Màn hình phải đảm bảo tính chính xác theo thời gian thực, ngăn chặn xung đột khi nhiều người cùng chọn một ghế và mang lại trải nghiệm lựa chọn ghế trực quan, nhanh chóng và ổn định.