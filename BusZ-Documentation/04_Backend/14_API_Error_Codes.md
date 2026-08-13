# API Error Codes

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Backend API

Document ID

API-014

Priority

Critical

Version

1.0

---

# 1. Purpose

Tài liệu này định nghĩa chuẩn Error Code cho toàn bộ Backend BusZ.

Mục tiêu:

- Thống nhất cách xử lý lỗi.
- Dễ debug.
- Dễ tích hợp Frontend.
- Hỗ trợ đa ngôn ngữ.
- Không lộ thông tin nội bộ.

---

# 2. Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "BOOKING_002",
    "message": "Seat already booked",
    "details": [
      {
        "field": "seatId",
        "message": "Seat A01 has been booked."
      }
    ]
  },
  "traceId": "2a19dc7e-9df8-4dd7-bd6d-51c48c78f46f",
  "timestamp": "2026-07-04T10:00:00Z"
}
```

---

# 3. HTTP Status Mapping

| HTTP Status | Meaning |
|--------------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Failed |
| 429 | Too Many Requests |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

---

# 4. Authentication Errors

| Code | HTTP | Description |
|------|------|-------------|
| AUTH_001 | 400 | Invalid Email |
| AUTH_002 | 401 | Invalid Password |
| AUTH_003 | 403 | Email Not Verified |
| AUTH_004 | 403 | Account Locked |
| AUTH_005 | 401 | Refresh Token Invalid |
| AUTH_006 | 401 | Session Expired |
| AUTH_007 | 422 | Weak Password |
| AUTH_008 | 429 | Too Many Login Attempts |

---

# 5. User Errors

| Code | HTTP |
|------|------|
| USER_001 | 404 |
| USER_002 | 409 |
| USER_003 | 409 |
| USER_004 | 401 |
| USER_005 | 422 |
| USER_006 | 404 |

---

# 6. Booking Errors

| Code | HTTP |
|------|------|
| BOOKING_001 | 404 |
| BOOKING_002 | 409 |
| BOOKING_003 | 409 |
| BOOKING_004 | 422 |
| BOOKING_005 | 410 |
| BOOKING_006 | 409 |
| BOOKING_007 | 422 |

---

# 7. Payment Errors

| Code | HTTP |
|------|------|
| PAYMENT_001 | 404 |
| PAYMENT_002 | 422 |
| PAYMENT_003 | 400 |
| PAYMENT_004 | 410 |
| PAYMENT_005 | 401 |
| PAYMENT_006 | 400 |
| PAYMENT_007 | 409 |

---

# 8. Ticket Errors

| Code | HTTP |
|------|------|
| TICKET_001 | 404 |
| TICKET_002 | 422 |
| TICKET_003 | 409 |
| TICKET_004 | 409 |
| TICKET_005 | 409 |
| TICKET_006 | 422 |
| TICKET_007 | 422 |
| TICKET_008 | 400 |

---

# 9. Promotion Errors

| Code | HTTP |
|------|------|
| PROMO_001 | 404 |
| PROMO_002 | 410 |
| PROMO_003 | 403 |
| PROMO_004 | 409 |
| PROMO_005 | 409 |
| PROMO_006 | 422 |
| PROMO_007 | 409 |

---

# 10. Notification Errors

| Code | HTTP |
|------|------|
| NOTI_001 | 404 |
| NOTI_002 | 409 |
| NOTI_003 | 422 |
| NOTI_004 | 500 |
| NOTI_005 | 404 |

---

# 11. Admin Errors

| Code | HTTP |
|------|------|
| ADMIN_001 | 403 |
| ADMIN_002 | 404 |
| ADMIN_003 | 422 |
| ADMIN_004 | 409 |
| ADMIN_005 | 403 |

---

# 12. System Errors

| Code | HTTP |
|------|------|
| SYSTEM_001 | 503 |
| SYSTEM_002 | 422 |
| SYSTEM_003 | 500 |
| SYSTEM_004 | 409 |
| SYSTEM_005 | 503 |

---

# 13. Validation Errors

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_001",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      },
      {
        "field": "password",
        "message": "Password must contain at least 8 characters"
      }
    ]
  }
}
```

---

# 14. Business Errors

Ví dụ:

```text
Seat Already Booked

↓

BOOKING_002
```

```text
Promotion Expired

↓

PROMO_002
```

```text
Ticket Already Checked In

↓

TICKET_003
```

---

# 15. Internal Errors

Không trả Stack Trace cho Client.

Ví dụ:

```json
{
  "success": false,
  "error": {
    "code": "SYSTEM_999",
    "message": "Internal server error"
  }
}
```

Stack Trace chỉ ghi trong Log và Sentry.

---

# 16. Internationalization (i18n)

Error Code không thay đổi.

Message thay đổi theo ngôn ngữ.

Ví dụ:

```
AUTH_002
```

Tiếng Việt:

```
Sai mật khẩu.
```

Tiếng Anh:

```
Invalid password.
```

---

# 17. Logging

Mỗi lỗi cần ghi:

- Trace ID
- User ID
- Endpoint
- HTTP Method
- Request ID
- Error Code
- Timestamp

---

# 18. Best Practices

✓ Không trả lỗi SQL.

✓ Không trả Stack Trace.

✓ Error Code không thay đổi.

✓ Message thân thiện với người dùng.

✓ Ghi đầy đủ Log phía Server.

---

# 19. Test Cases

✓ Invalid JWT.

✓ Invalid Email.

✓ Duplicate Booking.

✓ Duplicate Payment.

✓ Invalid Promotion.

✓ Wrong QR.

✓ Internal Error.

---

# 20. Acceptance Criteria

✓ Error Code thống nhất.

✓ HTTP Status chính xác.

✓ Không lộ thông tin nội bộ.

✓ Hỗ trợ đa ngôn ngữ.

✓ Log đầy đủ.

---

# 21. Related Documents

API-002 API Standards

API-003 Authentication API

API-017 API Security

---

# 22. Summary

API Error Codes là chuẩn xử lý lỗi thống nhất cho toàn bộ Backend BusZ. Mỗi lỗi đều có mã định danh riêng, được ánh xạ với HTTP Status Code và hỗ trợ đa ngôn ngữ, giúp Frontend, Backend và DevOps dễ dàng xử lý, theo dõi và mở rộng hệ thống.