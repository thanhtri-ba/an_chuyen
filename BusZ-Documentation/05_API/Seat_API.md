# Seat API

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Seat Management

Document ID

API-006

Priority

Critical

Version

1.0

---

# 1. Purpose

Seat API quản lý toàn bộ sơ đồ ghế, trạng thái ghế và quy trình giữ ghế trong hệ thống BusZ.

Hỗ trợ

- Seat Layout
- Seat Availability
- Seat Hold
- Seat Release
- Seat Reservation
- Seat Status
- Real-time Seat Synchronization

---

# 2. API Overview

```text
Passenger App

Operator Portal

Driver App

↓

Seat API

↓

Seat Service

↓

Booking Service

↓

Trip Service

↓

PostgreSQL
```

---

# 3. Seat Lifecycle

```text
AVAILABLE

↓

SELECTED

↓

HELD

↓

BOOKED

↓

CHECKED_IN

↓

COMPLETED
```

Nếu hết thời gian giữ ghế

```text
HELD

↓

AVAILABLE
```

---

# 4. API Endpoints

```text
GET /trips/{tripId}/seats

GET /seats/{seatId}

POST /seats/hold

DELETE /seats/hold/{holdId}

POST /seats/release

POST /seats/lock

POST /seats/unlock

GET /seats/layout

GET /seats/status
```

---

# 5. Get Seat Layout

Endpoint

```http
GET /api/v1/trips/{tripId}/seats
```

Description

Lấy sơ đồ ghế của chuyến xe.

---

# 6. Response

Bao gồm

```text
Trip ID

Vehicle

Floor

Seat Layout

Seat Status

Seat Price
```

---

# 7. Seat Information

Thông tin mỗi ghế

```text
Seat ID

Seat Number

Floor

Seat Type

Status

Price
```

---

# 8. Seat Types

```text
Normal

VIP

Sleeper

Limousine

Wheelchair

Reserved
```

---

# 9. Seat Status

```text
AVAILABLE

SELECTED

HELD

BOOKED

CHECKED_IN

COMPLETED

BLOCKED

MAINTENANCE
```

---

# 10. Hold Seat

Endpoint

```http
POST /api/v1/seats/hold
```

Description

Giữ ghế tạm thời trước khi thanh toán.

---

# 11. Hold Duration

```text
10 Minutes
```

Sau thời gian này

```text
Release Automatically
```

---

# 12. Hold Response

```text
Hold ID

Expired Time

Seat List

Trip ID
```

---

# 13. Release Seat

Endpoint

```http
DELETE /api/v1/seats/hold/{holdId}
```

Description

Giải phóng ghế.

---

# 14. Lock Seat

Endpoint

```http
POST /api/v1/seats/lock
```

Dành cho

```text
Operator

Admin
```

---

# 15. Unlock Seat

Endpoint

```http
POST /api/v1/seats/unlock
```

Description

Mở khóa ghế.

---

# 16. Seat Layout Types

```text
16 Seats

28 Seats

34 Seats

40 Seats

44 Seats

Limousine 22

Sleeper 34
```

---

# 17. Seat Rules

```text
One Passenger

One Seat

One Seat

One Booking

Booked Seat cannot be held

Blocked Seat cannot be booked

Maintenance Seat cannot be booked
```

---

# 18. Real-time Synchronization

Đồng bộ

```text
Seat Selection

Seat Hold

Seat Release

Seat Booking

Seat Cancellation
```

Technology

```text
WebSocket

Server Sent Events
```

---

# 19. Concurrency Control

Áp dụng

```text
Optimistic Locking

Database Transaction

Version Control
```

Mục tiêu

```text
Prevent Overbooking
```

---

# 20. Validation Rules

```text
Trip Exists

Seat Exists

Seat Available

Seat Active

Hold Not Expired
```

---

# 21. Business Rules

```text
Maximum 6 Seats

Hold 10 Minutes

Payment Required

Booked Seat Immutable

Completed Trip Read Only
```

---

# 22. Security

```text
JWT

RBAC

HTTPS

Audit Logs
```

---

# 23. Database Tables

```text
SeatLayouts

Seats

SeatHolds

SeatLocks

Bookings

BookingSeats
```

---

# 24. Error Codes

```text
SEAT_NOT_FOUND

SEAT_NOT_AVAILABLE

SEAT_ALREADY_BOOKED

SEAT_ALREADY_HELD

SEAT_HOLD_EXPIRED

INVALID_SEAT

TRIP_COMPLETED

MAXIMUM_SEATS_EXCEEDED
```

---

# 25. Performance Targets

```text
Load Seat Layout

<300 ms

Hold Seat

<500 ms

Seat Synchronization

<1 Second

Seat Release

<300 ms
```

---

# 26. Acceptance Criteria

✓ Sơ đồ ghế hiển thị đúng

✓ Giữ ghế thành công

✓ Hết thời gian tự giải phóng

✓ Đồng bộ trạng thái theo thời gian thực

✓ Không xảy ra overbooking

✓ Ghế đã đặt không thể đặt lại

---

# 27. Related Documents

Trip API

Booking API

Payment API

Vehicle API

Booking Business Rules

Database Schema

---

# 28. Summary

Seat API quản lý toàn bộ sơ đồ ghế và trạng thái ghế của mỗi chuyến xe trong BusZ. API đảm bảo việc giữ ghế, đặt ghế và đồng bộ theo thời gian thực, đồng thời ngăn chặn tình trạng đặt trùng ghế bằng cơ chế khóa giao dịch và kiểm soát đồng thời.