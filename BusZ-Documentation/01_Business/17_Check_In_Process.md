# Check-In Process

Project: BusZ - Intercity Bus Ticket Booking Platform

Version: 1.0

Document Type: Business Process

Module: Passenger Check-In

Priority: Critical

Status: Draft

---

# 1. Purpose

Tài liệu này mô tả toàn bộ quy trình Check-in hành khách trong hệ thống BusZ.

Check-in giúp:

- Xác nhận hành khách lên xe.
- Kiểm tra tính hợp lệ của vé.
- Cập nhật trạng thái ghế.
- Đồng bộ trạng thái chuyến xe.
- Hỗ trợ thống kê hành khách.

Module này được sử dụng bởi:

- Staff App
- Driver App (Future)
- Admin Website
- Backend API

---

# 2. Scope

Áp dụng cho:

- Mobile Staff App
- Backend
- Admin Website
- Database

---

# 3. Actors

Primary

Bus Company Staff

Secondary

Driver

Backend

Customer

Admin

---

# 4. Business Goal

Đảm bảo:

✓ Vé hợp lệ.

✓ Không check-in hai lần.

✓ Đúng hành khách.

✓ Đúng chuyến xe.

✓ Đồng bộ trạng thái ghế.

---

# 5. Preconditions

Trip tồn tại.

Booking đã thanh toán.

Ticket ACTIVE.

Trip chưa kết thúc.

Staff đã đăng nhập.

---

# 6. Check-In Flow

```mermaid
flowchart TD

Staff Open Scanner

-->

Scan QR Code

-->

Backend Verify

-->

Ticket Valid?

-->

YES

-->

Check Passenger

-->

Check Trip

-->

Update Ticket

-->

Update Seat

-->

Notification

-->

Completed

NO

-->

Show Error
```

---

# 7. QR Verification

Backend kiểm tra:

Ticket ID

Booking ID

Trip ID

Passenger ID

Seat

Status

Expired

Signature

---

# 8. Validation Rules

Ticket tồn tại.

Ticket ACTIVE.

Booking CONFIRMED.

Payment SUCCESS.

Trip chưa COMPLETED.

Passenger hợp lệ.

---

# 9. Ticket Status

ACTIVE

↓

CHECKED_IN

↓

COMPLETED

---

Nếu bị hủy

↓

CANCELLED

---

# 10. Seat Status

BOOKED

↓

CHECKED_IN

↓

COMPLETED

---

# 11. Passenger Status

BOOKED

↓

CHECKED_IN

↓

ON_BOARD

↓

COMPLETED

---

# 12. Database Tables

tickets

bookings

booking_items

trip_seats

trip_passengers

check_in_logs

users

staff_accounts

---

# 13. API Flow

POST

/check-in/scan

↓

POST

/check-in/verify

↓

POST

/check-in/confirm

↓

GET

/check-in/history

---

# 14. Exception Cases

QR không tồn tại.

↓

Invalid Ticket.

---

QR đã sử dụng.

↓

Already Checked-In.

---

Trip đã khởi hành quá lâu.

↓

Late Boarding.

---

Trip bị hủy.

↓

Reject.

---

# 15. Late Check-In

Nếu khách đến trễ.

↓

Staff quyết định:

Allow Boarding

Reject Boarding

---

# 16. Manual Check-In

Nếu QR lỗi.

Staff nhập:

Booking Code

↓

Backend Verify

↓

Check-in.

---

# 17. Boarding Point

Check-in chỉ thực hiện tại:

Departure Station

Checkpoint

Pickup Point

Không được Check-in tại:

Destination.

---

# 18. Staff Permission

Staff chỉ được:

Check-in.

View Passenger.

View Seat.

Không được:

Refund.

Payment.

Delete Booking.

---

# 19. Notification

Customer

↓

Checked-In Successfully.

---

Driver

↓

Passenger Boarded.

---

Admin

↓

Trip Statistics Updated.

---

# 20. Logging

Check-in Time

Staff

Location

Device

Ticket

Passenger

Trip

---

# 21. Security

JWT

Staff Permission

QR Signature Verify

Replay Protection

Device Authentication

---

# 22. Audit Trail

Ticket ID

Booking ID

Passenger ID

Staff ID

Device ID

Latitude

Longitude

Time

---

# 23. Reports

Checked-In Passenger

No Show Passenger

Late Passenger

Boarding Rate

Trip Occupancy

---

# 24. Acceptance Criteria

✓ QR hợp lệ.

✓ Ticket chuyển CHECKED_IN.

✓ Seat chuyển CHECKED_IN.

✓ Passenger cập nhật.

✓ Notification gửi thành công.

✓ Activity Log ghi đầy đủ.

---

# 25. Future Expansion

Offline Check-In

Face Recognition

NFC Ticket

Bluetooth Boarding

Driver Check-In

Smart Gate

AI Fraud Detection

---

# 26. Related Documents

Ticket Process

Booking Process

Trip Process

Seat Management

Notification Process

Database Design

API Specification

---

# 27. Summary

Check-In Process là bước cuối cùng trước khi hành khách bắt đầu chuyến đi.

Module này đảm bảo mọi hành khách đều được xác thực đúng vé, đúng chuyến và đúng thời điểm, đồng thời cập nhật trạng thái Ticket, Seat và Passenger theo thời gian thực.