# Ticket Module

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Flutter Mobile App

Document ID

APP-009

Priority

Critical

Version

1.0

---

# 1. Purpose

Ticket Module quản lý toàn bộ vé điện tử (E-Ticket) của người dùng sau khi thanh toán thành công.

Bao gồm:

- Danh sách vé
- Chi tiết vé
- QR Code
- Barcode
- PDF Ticket
- Check-in
- Chia sẻ vé
- Hủy vé
- Hoàn tiền
- Lịch sử vé

---

# 2. User Flow

```text
Payment Success

↓

Ticket List

↓

Ticket Detail

↓

QR Code

↓

Check-in

↓

Completed
```

---

# 3. Ticket List Screen

Hiển thị

- Vé sắp khởi hành
- Vé đã sử dụng
- Vé đã hủy
- Vé hoàn tiền

Filter

```text
Upcoming

Completed

Cancelled

Refunded
```

---

# 4. Ticket Card

Hiển thị

- Nhà xe
- Tuyến đường
- Ngày khởi hành
- Giờ khởi hành
- Ghế
- Mã vé
- Trạng thái

Button

```text
View Ticket
```

---

# 5. Ticket Detail

Hiển thị

- Booking Code
- Ticket Code
- QR Code
- Passenger
- Seat
- Pickup Point
- Dropoff Point
- Bus Company
- Departure Time
- Arrival Time
- Payment Summary

---

# 6. QR Code

QR chứa

```text
Ticket ID

Signature

Checksum
```

Không chứa dữ liệu cá nhân.

Tự động làm mới nếu cần.

---

# 7. Barcode

Hiển thị

```text
Code128
```

Dùng cho

- Máy quét
- Thiết bị dự phòng

---

# 8. Ticket Status

```text
GENERATED

ACTIVE

CHECKED_IN

USED

CANCELLED

REFUND_PENDING

REFUNDED

EXPIRED
```

---

# 9. Ticket Actions

Buttons

```text
Download PDF

Share Ticket

View Route

Contact Bus Company

Request Refund
```

---

# 10. PDF Ticket

Hiển thị

- Logo BusZ
- QR Code
- Thông tin hành khách
- Thông tin chuyến xe
- Điều khoản sử dụng

Button

```text
Download
```

---

# 11. Share Ticket

Cho phép

- Email
- Zalo
- Messenger
- AirDrop
- Nearby Share

Chia sẻ

```text
PDF

QR Image
```

---

# 12. Check-in

Hiển thị

```text
Ready for Boarding
```

Sau khi Staff quét QR

↓

```text
Checked In
```

Không cho phép sử dụng lại.

---

# 13. Refund Request

Điều kiện

- Chưa Check-in
- Đúng chính sách nhà xe

Flow

```text
Request

↓

Review

↓

Approved

↓

Refund
```

---

# 14. Loading State

Skeleton

- Ticket Card
- QR
- Detail

---

# 15. Empty State

Ví dụ

```text
You don't have any tickets.
```

Buttons

```text
Book Now
```

---

# 16. Error State

Ví dụ

```text
Unable to load ticket.
```

Buttons

```text
Retry

Back
```

---

# 17. Offline Mode

Cho phép

- Xem vé đã cache
- Hiển thị QR đã lưu

Không cho phép

- Yêu cầu hoàn tiền
- Đồng bộ trạng thái

---

# 18. Realtime Updates

Sử dụng

```text
Supabase Realtime

hoặc

WebSocket
```

Đồng bộ

- Ticket Status
- Check-in
- Refund

---

# 19. State Management

Cubit

```text
TicketCubit
```

States

```text
TicketInitial

TicketLoading

TicketLoaded

TicketOffline

TicketCheckedIn

TicketRefunded

TicketError
```

---

# 20. API Integration

```text
GET /tickets

GET /tickets/{id}

GET /tickets/{id}/qr

GET /tickets/{id}/pdf

POST /tickets/{id}/refund
```

---

# 21. Component Tree

```text
TicketScreen

↓

TicketList

↓

TicketCard

↓

TicketDetail

↓

QRCodeWidget

↓

ActionButtons

↓

BottomSheet
```

---

# 22. UX Guidelines

✓ QR hiển thị lớn, dễ quét.

✓ Trạng thái vé dùng màu sắc rõ ràng.

✓ Hiển thị cảnh báo nếu vé sắp hết hạn.

✓ Hỗ trợ tải PDF nhanh.

✓ Cho phép chia sẻ chỉ với một lần chạm.

---

# 23. Performance

Load Ticket

```text
<100ms
```

QR Generate

```text
<50ms
```

Realtime Update

```text
<1s
```

PDF Download

```text
<2s
```

---

# 24. Test Cases

✓ Ticket List.

✓ Ticket Detail.

✓ QR Display.

✓ Download PDF.

✓ Share Ticket.

✓ Check-in.

✓ Refund Request.

✓ Offline Ticket.

---

# 25. Acceptance Criteria

✓ QR chính xác.

✓ PDF tải thành công.

✓ Ticket Status đồng bộ.

✓ Offline hoạt động.

✓ Realtime cập nhật.

✓ Share Ticket hoạt động.

---

# 26. Related Documents

APP-008 Payment Module

APP-010 Profile Module

API-009 Ticket API

---

# 27. Summary

Ticket Module là trung tâm quản lý vé điện tử của BusZ, cung cấp khả năng xem, chia sẻ, tải xuống và sử dụng vé trong suốt hành trình. Module hỗ trợ QR Code, PDF, cập nhật trạng thái theo thời gian thực và chế độ ngoại tuyến để đảm bảo người dùng luôn có thể truy cập vé khi cần.