# Booking API

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Backend API

Document ID

API-007

Priority

Critical

Version

1.0

---

# 1. Purpose

Booking API quản lý toàn bộ quy trình đặt vé trong BusZ.

Bao gồm:

- Chọn ghế
- Giữ ghế (Seat Lock)
- Tạo Booking
- Hủy Booking
- Lấy Booking
- Lịch sử Booking
- Xác nhận Booking
- Đồng bộ Payment

Booking là trung tâm nghiệp vụ của hệ thống.

---

# 2. Authentication

Yêu cầu

```
Bearer JWT
```

---

# 3. Endpoints Overview

| Method | Endpoint | Permission |
|----------|-----------------------------|------------|
| POST | /bookings | User |
| GET | /bookings | User |
| GET | /bookings/{id} | User |
| PATCH | /bookings/{id}/cancel | User |
| POST | /bookings/{id}/confirm | User |
| GET | /bookings/history | User |

---

# 4. Create Booking

Endpoint

```
POST /bookings
```

---

# 5. Request

```json
{
  "tripId":"uuid",
  "pickupStationId":"uuid",
  "dropoffStationId":"uuid",
  "promotionCode":"BUSZ10",
  "passengers":[
    {
      "seatId":"uuid",
      "fullName":"Nguyen Van A",
      "phone":"0912345678",
      "identityNumber":"079xxxxxxxx"
    }
  ]
}
```

---

# 6. Response

```json
{
  "bookingId":"uuid",
  "bookingCode":"BK202607040001",
  "status":"PENDING_PAYMENT",
  "expiredAt":"2026-07-04T10:15:00Z",
  "totalAmount":320000
}
```

---

# 7. Booking Flow

```
Select Seats

↓

Lock Seats

↓

Validate

↓

Create Booking

↓

Create Payment

↓

Waiting Payment

↓

Paid

↓

Issue Ticket
```

---

# 8. Booking Detail

Endpoint

```
GET /bookings/{id}
```

Response

- Booking

- Passenger

- Seat

- Payment

- Ticket

- Trip

---

# 9. Booking History

Endpoint

```
GET /bookings/history
```

Pagination

```
page

limit
```

Filter

```
status

date

company
```

---

# 10. Cancel Booking

Endpoint

```
PATCH /bookings/{id}/cancel
```

Business Flow

```
Validate

↓

Cancel Booking

↓

Release Seats

↓

Refund (if applicable)

↓

Notification
```

---

# 11. Confirm Booking

Endpoint

```
POST /bookings/{id}/confirm
```

Chỉ được gọi sau khi Payment thành công.

---

# 12. Booking Status

```text
DRAFT

↓

PENDING_PAYMENT

↓

PAID

↓

CONFIRMED

↓

CHECKED_IN

↓

COMPLETED
```

Ngoại lệ

```text
PENDING_PAYMENT

↓

EXPIRED
```

```text
PENDING_PAYMENT

↓

CANCELLED
```

---

# 13. Seat Lock

Seat được giữ

```
15 phút
```

Hết thời gian

↓

Release

↓

AVAILABLE

---

# 14. Business Rules

BOOKING-BR-001

Một Booking phải có ít nhất một Passenger.

---

BOOKING-BR-002

Không được đặt ghế đã BOOKED.

---

BOOKING-BR-003

Không được đặt Trip CANCELLED.

---

BOOKING-BR-004

Promotion phải hợp lệ.

---

BOOKING-BR-005

Một Booking chỉ có một Payment chính.

---

BOOKING-BR-006

Booking EXPIRED tự động hủy.

---

BOOKING-BR-007

Booking CANCELLED phải giải phóng toàn bộ Seat Lock.

---

# 15. Validation

Passengers

```
1-10
```

Phone

E.164

Identity Number

12 số

Promotion

ACTIVE

Trip

ACTIVE

---

# 16. Error Codes

| Code | Description |
|------|-------------|
| BOOKING_001 | Trip Not Found |
| BOOKING_002 | Seat Already Booked |
| BOOKING_003 | Seat Locked |
| BOOKING_004 | Promotion Invalid |
| BOOKING_005 | Booking Expired |
| BOOKING_006 | Booking Cancelled |
| BOOKING_007 | Passenger Invalid |

---

# 17. Transaction Flow

```
BEGIN

↓

Lock Seats

↓

Insert Booking

↓

Insert Passengers

↓

Insert Booking Seats

↓

Commit
```

Failure

↓

Rollback

---

# 18. Performance

Create Booking

```
<150ms
```

History

```
<50ms
```

Booking Detail

```
<50ms
```

---

# 19. Security

JWT

Ownership Validation

Seat Validation

Transaction

Audit Log

---

# 20. Sequence Diagram

```
Flutter

↓

Booking API

↓

Seat Validation

↓

Trip Validation

↓

Promotion Validation

↓

Database Transaction

↓

Booking Created
```

---

# 21. Test Cases

✓ Create Booking.

✓ Duplicate Seat.

✓ Trip Full.

✓ Promotion.

✓ Cancel Booking.

✓ Booking History.

✓ Seat Timeout.

✓ Concurrent Booking.

---

# 22. Acceptance Criteria

✓ Không Overbooking.

✓ Seat Lock chính xác.

✓ Transaction thành công.

✓ Rollback hoạt động.

✓ Audit Log đầy đủ.

---

# 23. Related Documents

API-006 Search Trip

API-008 Payment

DB-006 Bookings

DB-013 Seats

---

# 24. Summary

Booking API là trung tâm của quy trình đặt vé BusZ. API chịu trách nhiệm tạo Booking, giữ ghế, quản lý trạng thái đặt vé, đồng bộ với Payment và Ticket, đồng thời đảm bảo không xảy ra overbooking thông qua cơ chế Seat Lock và Database Transaction.