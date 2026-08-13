# Booking API

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Booking Management

Document ID

API-007

Priority

Critical

Version

1.0

---

# 1. Purpose

Booking API quản lý toàn bộ quy trình đặt vé trong hệ thống BusZ.

Hỗ trợ

- Create Booking
- Booking Detail
- Booking History
- Update Booking
- Cancel Booking
- Booking Status
- Booking Expiration
- Passenger Management

---

# 2. API Overview

```text
Passenger App

↓

Booking API

↓

Booking Service

↓

Seat Service

↓

Payment Service

↓

Ticket Service

↓

PostgreSQL
```

---

# 3. Booking Lifecycle

```text
Create Booking

↓

Seat Hold

↓

Pending Payment

↓

Payment Success

↓

Ticket Issued

↓

Checked In

↓

Completed
```

Nếu thanh toán thất bại

```text
Pending Payment

↓

Expired

↓

Seat Released
```

---

# 4. API Endpoints

```text
POST /bookings

GET /bookings

GET /bookings/{bookingId}

PATCH /bookings/{bookingId}

PATCH /bookings/{bookingId}/cancel

GET /bookings/{bookingId}/status

GET /bookings/history

POST /bookings/recalculate
```

---

# 5. Create Booking

Endpoint

```http
POST /api/v1/bookings
```

Description

Tạo đơn đặt vé mới.

Authentication

```text
Required
```

---

# 6. Request Body

```json
{
    "tripId":"TR001",
    "pickupPointId":"PU001",
    "dropoffPointId":"DO001",
    "seatIds":[
        "A01",
        "A02"
    ],
    "promotionCode":"BUSZ10",
    "passengers":[
        {
            "fullName":"Nguyen Van A",
            "phone":"0909123456"
        },
        {
            "fullName":"Tran Thi B",
            "phone":"0911222333"
        }
    ]
}
```

---

# 7. Success Response

```json
{
    "success":true,
    "data":{
        "bookingId":"BK260700001",
        "bookingCode":"BZ2407040001",
        "status":"PENDING_PAYMENT",
        "expiredAt":"2026-07-04T12:10:00Z"
    }
}
```

---

# 8. Booking Information

Bao gồm

```text
Booking ID

Booking Code

Trip

Passengers

Seats

Pickup Point

Dropoff Point

Booking Time

Booking Status

Payment Status
```

---

# 9. Booking Status

```text
DRAFT

PENDING_PAYMENT

PAID

CONFIRMED

CHECKED_IN

COMPLETED

CANCELLED

REFUNDED

EXPIRED
```

---

# 10. Booking History

Endpoint

```http
GET /api/v1/bookings/history
```

Hiển thị

```text
Upcoming Trips

Completed Trips

Cancelled Trips

Refunded Trips
```

---

# 11. Booking Detail

Endpoint

```http
GET /api/v1/bookings/{bookingId}
```

Trả về

```text
Trip

Passenger

Seats

Price

Discount

Taxes

Payment

Ticket

QR Code
```

---

# 12. Cancel Booking

Endpoint

```http
PATCH /api/v1/bookings/{bookingId}/cancel
```

Description

Hủy đơn đặt vé.

---

# 13. Cancellation Policy

```text
More than 24 hours

100% Refund

12-24 Hours

50% Refund

Less than 12 Hours

No Refund
```

---

# 14. Passenger Information

Thông tin

```text
Full Name

Phone

Gender

Birthday

Identity Number

Nationality
```

---

# 15. Pickup Information

```text
Pickup Point

Pickup Address

Pickup Time
```

---

# 16. Dropoff Information

```text
Dropoff Point

Dropoff Address

Arrival Time
```

---

# 17. Fare Information

```text
Ticket Price

Promotion

Discount

Service Fee

VAT

Total Amount
```

---

# 18. Booking Rules

```text
Maximum 6 Passengers

Maximum 6 Seats

One Passenger

One Seat

One Booking Code

One Payment Transaction
```

---

# 19. Validation Rules

```text
Trip Exists

Seat Available

Passenger Required

Pickup Required

Dropoff Required

Payment Required
```

---

# 20. Business Rules

```text
Booking expires after 10 minutes

Expired booking releases seats

Booking cannot be edited after payment

Cancelled booking cannot be checked in

Completed booking is read only
```

---

# 21. Price Calculation

Tính toán

```text
Ticket Price

Promotion

Voucher

Service Fee

VAT

Final Amount
```

---

# 22. Promotion

Hỗ trợ

```text
Percentage Discount

Fixed Discount

Campaign Voucher

Operator Voucher
```

---

# 23. Integration

```text
Seat API

Payment API

Ticket API

Notification API

Promotion API
```

---

# 24. Security

```text
JWT

RBAC

HTTPS

Audit Logs

Transaction Lock
```

---

# 25. Database Tables

```text
Bookings

BookingPassengers

BookingSeats

Payments

Tickets

Promotions
```

---

# 26. Error Codes

```text
BOOKING_NOT_FOUND

BOOKING_EXPIRED

BOOKING_CANCELLED

BOOKING_COMPLETED

INVALID_PASSENGER

INVALID_PICKUP

INVALID_DROPOFF

SEAT_NOT_AVAILABLE

PAYMENT_REQUIRED

PROMOTION_INVALID
```

---

# 27. Performance Targets

```text
Create Booking

<700 ms

Booking Detail

<300 ms

Booking History

<500 ms

Cancel Booking

<500 ms
```

---

# 28. Audit Logs

Ghi nhận

```text
Booking Created

Booking Updated

Booking Cancelled

Passenger Updated

Seat Assigned

Promotion Applied

Payment Linked
```

---

# 29. Notification

Gửi thông báo

```text
Booking Created

Payment Reminder

Booking Confirmed

Booking Cancelled

Refund Completed
```

---

# 30. Acceptance Criteria

✓ Đặt vé thành công

✓ Giữ ghế thành công

✓ Sinh mã Booking

✓ Tính tiền chính xác

✓ Voucher hoạt động

✓ Hủy vé đúng chính sách

✓ Booking History đầy đủ

✓ Không xảy ra Overbooking

---

# 31. Related Documents

Seat API

Trip API

Payment API

Ticket API

Booking Business Rules

Database Schema

---

# 32. Summary

Booking API là trung tâm của quy trình đặt vé trong BusZ, chịu trách nhiệm quản lý toàn bộ vòng đời của một đơn đặt vé từ khi tạo, giữ ghế, thanh toán, phát hành vé điện tử, check-in cho đến khi chuyến xe hoàn thành hoặc được hoàn tiền. API đảm bảo tính nhất quán dữ liệu, ngăn chặn đặt trùng ghế và tích hợp chặt chẽ với các dịch vụ Seat, Payment, Ticket và Notification.