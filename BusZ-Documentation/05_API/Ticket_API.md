# Ticket API

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Ticket Management

Document ID

API-009

Priority

Critical

Version

1.0

---

# 1. Purpose

Ticket API quản lý toàn bộ vé điện tử trong hệ thống BusZ.

Hỗ trợ

- E-Ticket
- Ticket Detail
- QR Code
- Ticket Validation
- Check-in
- Boarding
- Ticket Cancellation
- Ticket History

---

# 2. API Overview

```text
Passenger App

↓

Ticket API

↓

Ticket Service

↓

Booking Service

↓

QR Service

↓

PostgreSQL

↓

Driver App
```

---

# 3. Ticket Lifecycle

```text
Ticket Created

↓

Ticket Issued

↓

Ready

↓

Checked In

↓

Boarding

↓

Completed
```

Nếu đơn bị hủy

```text
Ticket Cancelled
```

---

# 4. API Endpoints

```text
GET /tickets/{ticketId}

GET /tickets

GET /tickets/history

POST /tickets/check-in

POST /tickets/validate

POST /tickets/cancel

GET /tickets/{ticketId}/qr

GET /tickets/{ticketId}/download
```

---

# 5. Get Ticket Detail

Endpoint

```http
GET /api/v1/tickets/{ticketId}
```

Description

Lấy thông tin chi tiết vé.

---

# 6. Ticket Information

```text
Ticket ID

Ticket Code

Booking Code

Passenger

Seat Number

Trip

Pickup Point

Dropoff Point

Status
```

---

# 7. QR Code

Endpoint

```http
GET /api/v1/tickets/{ticketId}/qr
```

Bao gồm

```text
QR Image

QR Token

Expired Time
```

---

# 8. Download Ticket

Endpoint

```http
GET /api/v1/tickets/{ticketId}/download
```

Định dạng

```text
PDF

PNG
```

---

# 9. Ticket Status

```text
CREATED

ISSUED

READY

CHECKED_IN

BOARDING

COMPLETED

CANCELLED

REFUNDED

EXPIRED
```

---

# 10. Check-in

Endpoint

```http
POST /api/v1/tickets/check-in
```

Description

Check-in hành khách.

---

# 11. QR Validation

Endpoint

```http
POST /api/v1/tickets/validate
```

Kiểm tra

```text
QR Token

Booking

Trip

Seat

Passenger
```

---

# 12. Boarding

Sau khi

```text
QR Valid

↓

Passenger Check-in

↓

Boarding Success
```

---

# 13. Ticket Cancellation

Endpoint

```http
POST /api/v1/tickets/cancel
```

Điều kiện

```text
Booking Cancelled

Refund Approved
```

---

# 14. Ticket History

Endpoint

```http
GET /api/v1/tickets/history
```

Bao gồm

```text
Upcoming Tickets

Completed Trips

Cancelled Tickets
```

---

# 15. Validation Rules

```text
Ticket Exists

Trip Exists

Passenger Exists

QR Valid

Not Expired
```

---

# 16. Business Rules

```text
One Passenger

One Ticket

One Seat

One QR Code

QR Cannot Be Reused

Completed Ticket Read Only

Cancelled Ticket Invalid
```

---

# 17. QR Security

```text
Unique Token

Encrypted

Signed

Expiration Time

Single Use
```

---

# 18. Driver Operations

Cho phép

```text
Scan QR

Check Passenger

View Boarding List

Manual Check-in
```

---

# 19. Security

```text
JWT

HTTPS

Encrypted QR

RBAC

Audit Logs
```

---

# 20. Database Tables

```text
Tickets

BookingTickets

QRCode

BoardingLogs

Passengers
```

---

# 21. Error Codes

```text
TICKET_NOT_FOUND

INVALID_QR

QR_EXPIRED

TICKET_CANCELLED

TICKET_COMPLETED

ALREADY_CHECKED_IN

INVALID_TRIP

INVALID_PASSENGER
```

---

# 22. Performance Targets

```text
Ticket Query

<300 ms

QR Validation

<200 ms

Check-in

<500 ms

Download PDF

<1 Second
```

---

# 23. Audit Logs

Theo dõi

```text
Ticket Issued

QR Generated

QR Scanned

Passenger Checked-in

Ticket Cancelled
```

---

# 24. Notification

Gửi

```text
Ticket Issued

Trip Reminder

Boarding Reminder

Check-in Success

Ticket Cancelled
```

---

# 25. Integration

```text
Booking API

Payment API

Trip API

Driver API

Notification API
```

---

# 26. Acceptance Criteria

✓ Vé được phát hành sau thanh toán

✓ QR Code hợp lệ

✓ QR không thể sử dụng hai lần

✓ Check-in thành công

✓ Boarding đúng hành khách

✓ Vé PDF tải được

✓ Ticket History đầy đủ

---

# 27. Related Documents

Booking API

Payment API

Trip API

Driver API

Notification API

Database Schema

---

# 28. Summary

Ticket API quản lý toàn bộ vòng đời của vé điện tử trong hệ thống BusZ, từ khi phát hành sau thanh toán, tạo mã QR, xác thực vé, hỗ trợ check-in và boarding cho đến khi chuyến xe hoàn thành. API đảm bảo mỗi hành khách sở hữu một vé hợp lệ, có thể xác minh nhanh chóng và an toàn trong quá trình lên xe.