# Ticket API

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Backend API

Document ID

API-009

Priority

Critical

Version

1.0

---

# 1. Purpose

Ticket API quản lý toàn bộ vòng đời vé điện tử trong BusZ.

Bao gồm:

- Phát hành vé
- Xem vé
- QR Code
- Check-in
- Hủy vé
- Hoàn vé
- Tải PDF
- Gửi lại vé

---

# 2. Authentication

Yêu cầu:

```text
Bearer JWT
```

Staff API yêu cầu thêm quyền:

```text
STAFF
OPERATOR
ADMIN
```

---

# 3. Endpoints Overview

| Method | Endpoint | Permission |
|---|---|---|
| GET | /tickets | User |
| GET | /tickets/{id} | User |
| GET | /tickets/{id}/qr | User |
| GET | /tickets/{id}/pdf | User |
| POST | /tickets/{id}/resend | User |
| POST | /tickets/validate | Staff |
| POST | /tickets/check-in | Staff |
| POST | /tickets/{id}/cancel | User |
| POST | /tickets/{id}/refund | User |

---

# 4. Ticket Detail

Endpoint

```text
GET /tickets/{id}
```

Response

```json
{
  "ticketId": "uuid",
  "ticketCode": "BUSZ-TK-000001",
  "bookingCode": "BUSZ-BK-000001",
  "status": "ACTIVE",
  "passenger": {
    "fullName": "Nguyen Van A",
    "seatNumber": "A01"
  },
  "trip": {
    "route": "HCM → Da Lat",
    "departureTime": "2026-07-15T22:00:00Z"
  }
}
```

---

# 5. QR Code

Endpoint

```text
GET /tickets/{id}/qr
```

Business Rules

- QR chỉ hiển thị khi Ticket ACTIVE.
- QR không chứa dữ liệu nhạy cảm.
- QR phải có chữ ký số.
- QR hết hiệu lực khi Ticket CANCELLED hoặc REFUNDED.

---

# 6. Download PDF

Endpoint

```text
GET /tickets/{id}/pdf
```

Response

```text
application/pdf
```

---

# 7. Resend Ticket

Endpoint

```text
POST /tickets/{id}/resend
```

Business Flow

```text
Validate Ownership
↓
Generate Email
↓
Attach PDF
↓
Send
↓
Audit Log
```

---

# 8. Validate Ticket

Endpoint

```text
POST /tickets/validate
```

Permission

```text
STAFF
```

Request

```json
{
  "qrPayload": "encrypted_payload",
  "tripId": "uuid"
}
```

Response

```json
{
  "valid": true,
  "ticketId": "uuid",
  "status": "ACTIVE",
  "passenger": "Nguyen Van A",
  "seatNumber": "A01"
}
```

---

# 9. Check-in Ticket

Endpoint

```text
POST /tickets/check-in
```

Request

```json
{
  "ticketId": "uuid",
  "tripId": "uuid"
}
```

Business Rules

- Ticket phải ACTIVE.
- Ticket chưa CHECKED_IN.
- Trip phải đúng.
- Staff phải được phân công chuyến.
- Ghi Audit Log.

---

# 10. Cancel Ticket

Endpoint

```text
POST /tickets/{id}/cancel
```

Business Flow

```text
Validate Ticket
↓
Check Policy
↓
Cancel Ticket
↓
Release Seat
↓
Trigger Refund
↓
Notification
```

---

# 11. Refund Ticket

Endpoint

```text
POST /tickets/{id}/refund
```

Business Rules

- Ticket chưa CHECKED_IN.
- Ticket chưa REFUNDED.
- Payment phải SUCCESS.
- Refund phụ thuộc chính sách nhà xe.

---

# 12. Ticket Status

```text
GENERATED
ACTIVE
CHECKED_IN
USED
CANCELLED
REFUND_PENDING
REFUNDED
EXPIRED
INVALID
```

---

# 13. Error Codes

| Code | Description |
|---|---|
| TICKET_001 | Ticket Not Found |
| TICKET_002 | Ticket Invalid |
| TICKET_003 | Ticket Already Checked In |
| TICKET_004 | Ticket Cancelled |
| TICKET_005 | Ticket Refunded |
| TICKET_006 | QR Invalid |
| TICKET_007 | Wrong Trip |
| TICKET_008 | Refund Not Allowed |

---

# 14. Security

QR Signature

JWT

RBAC

Replay Protection

Audit Log

Staff Permission

---

# 15. Performance

Ticket Detail

```text
<50ms
```

QR Validation

```text
<100ms
```

Check-in

```text
<150ms
```

PDF Generation

```text
<2s
```

---

# 16. Sequence Diagram

```text
Staff App
↓
Scan QR
↓
Ticket API
↓
Validate Signature
↓
Check Ticket Status
↓
Check Trip
↓
Check-in
↓
Return Result
```

---

# 17. Test Cases

✓ Get Ticket.

✓ Get QR.

✓ Download PDF.

✓ Validate QR.

✓ Check-in Success.

✓ Duplicate Check-in.

✓ Wrong Trip.

✓ Cancel Ticket.

✓ Refund Ticket.

---

# 18. Acceptance Criteria

✓ QR xác thực đúng.

✓ Không check-in trùng.

✓ Ticket status cập nhật đúng.

✓ PDF tải thành công.

✓ Audit Log đầy đủ.

---

# 19. Related Documents

API-007 Booking API

API-008 Payment API

DB-008 Tickets

DB-013 Seats

---

# 20. Summary

Ticket API quản lý toàn bộ vé điện tử của BusZ, từ phát hành sau thanh toán thành công đến QR Code, PDF, xác thực, check-in, hủy vé và hoàn vé. API này đảm bảo vé không bị giả mạo, không sử dụng trùng và luôn đồng bộ với Booking, Payment và Seat.