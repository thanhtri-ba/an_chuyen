# Error Codes

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

System Error Handling

Document ID

API-013

Priority

Critical

Version

1.0

---

# 1. Purpose

Error Codes định nghĩa toàn bộ mã lỗi chuẩn được sử dụng trong hệ thống BusZ.

Mục tiêu

- Chuẩn hóa phản hồi API
- Dễ dàng debug
- Dễ dàng tích hợp Frontend
- Dễ dàng tích hợp Mobile App
- Dễ dàng tích hợp Third-party Services

---

# 2. Error Response Format

Tất cả API phải trả về cùng một định dạng.

```json
{
    "success": false,
    "code": "BOOKING_NOT_FOUND",
    "message": "Booking not found.",
    "details": null,
    "timestamp": "2026-07-04T08:00:00Z",
    "requestId": "REQ-24070400001"
}
```

---

# 3. HTTP Status Codes

```text
200 OK

201 Created

204 No Content

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Unprocessable Entity

429 Too Many Requests

500 Internal Server Error

503 Service Unavailable
```

---

# 4. Authentication Errors

```text
AUTH_INVALID_CREDENTIALS

AUTH_INVALID_PASSWORD

AUTH_ACCOUNT_LOCKED

AUTH_ACCOUNT_DISABLED

AUTH_ACCOUNT_NOT_VERIFIED

AUTH_TOKEN_INVALID

AUTH_TOKEN_EXPIRED

AUTH_REFRESH_TOKEN_INVALID

AUTH_SESSION_EXPIRED

AUTH_OTP_INVALID

AUTH_OTP_EXPIRED
```

---

# 5. Authorization Errors

```text
ACCESS_DENIED

ROLE_REQUIRED

PERMISSION_DENIED

ADMIN_ONLY

OPERATOR_ONLY

DRIVER_ONLY
```

---

# 6. User Errors

```text
USER_NOT_FOUND

USER_ALREADY_EXISTS

EMAIL_ALREADY_EXISTS

PHONE_ALREADY_EXISTS

INVALID_EMAIL

INVALID_PHONE

INVALID_PASSWORD

PASSWORD_TOO_WEAK
```

---

# 7. Route Errors

```text
ROUTE_NOT_FOUND

INVALID_ROUTE

INVALID_DEPARTURE

INVALID_DESTINATION

PICKUP_POINT_NOT_FOUND

DROPOFF_POINT_NOT_FOUND
```

---

# 8. Trip Errors

```text
TRIP_NOT_FOUND

TRIP_CANCELLED

TRIP_COMPLETED

TRIP_FULL

TRIP_NOT_AVAILABLE

TRIP_ALREADY_STARTED

TRIP_ALREADY_FINISHED
```

---

# 9. Seat Errors

```text
SEAT_NOT_FOUND

SEAT_NOT_AVAILABLE

SEAT_ALREADY_BOOKED

SEAT_ALREADY_HELD

SEAT_BLOCKED

SEAT_LOCKED

SEAT_HOLD_EXPIRED

INVALID_SEAT
```

---

# 10. Booking Errors

```text
BOOKING_NOT_FOUND

BOOKING_EXPIRED

BOOKING_CANCELLED

BOOKING_COMPLETED

BOOKING_ALREADY_PAID

BOOKING_ALREADY_REFUNDED

INVALID_BOOKING_STATUS
```

---

# 11. Payment Errors

```text
PAYMENT_NOT_FOUND

PAYMENT_FAILED

PAYMENT_TIMEOUT

PAYMENT_CANCELLED

PAYMENT_GATEWAY_ERROR

INVALID_PAYMENT_METHOD

PAYMENT_ALREADY_COMPLETED

PAYMENT_ALREADY_REFUNDED
```

---

# 12. Ticket Errors

```text
TICKET_NOT_FOUND

INVALID_QR

QR_EXPIRED

QR_ALREADY_USED

TICKET_CANCELLED

TICKET_COMPLETED

CHECKIN_FAILED

BOARDING_CLOSED
```

---

# 13. Promotion Errors

```text
PROMOTION_NOT_FOUND

PROMOTION_EXPIRED

PROMOTION_DISABLED

PROMOTION_USAGE_LIMIT

INVALID_PROMOTION

PROMOTION_NOT_APPLICABLE
```

---

# 14. Notification Errors

```text
NOTIFICATION_NOT_FOUND

DEVICE_NOT_FOUND

DEVICE_TOKEN_INVALID

PUSH_SEND_FAILED

EMAIL_SEND_FAILED

SMS_SEND_FAILED
```

---

# 15. Review Errors

```text
REVIEW_NOT_FOUND

REVIEW_ALREADY_EXISTS

INVALID_RATING

BOOKING_NOT_COMPLETED

REVIEW_BLOCKED
```

---

# 16. Validation Errors

```text
VALIDATION_ERROR

INVALID_REQUEST

INVALID_PARAMETER

MISSING_REQUIRED_FIELD

INVALID_DATE

INVALID_TIME

INVALID_FILE

INVALID_IMAGE
```

---

# 17. File Upload Errors

```text
FILE_TOO_LARGE

FILE_FORMAT_NOT_SUPPORTED

FILE_UPLOAD_FAILED

IMAGE_TOO_LARGE

IMAGE_CORRUPTED
```

---

# 18. Database Errors

```text
DATABASE_ERROR

DATABASE_TIMEOUT

DUPLICATE_RECORD

FOREIGN_KEY_ERROR

TRANSACTION_FAILED

DEADLOCK_DETECTED
```

---

# 19. Server Errors

```text
INTERNAL_SERVER_ERROR

SERVICE_UNAVAILABLE

UNKNOWN_ERROR

NETWORK_ERROR

DEPENDENCY_FAILED
```

---

# 20. Third-party Service Errors

```text
PAYMENT_PROVIDER_UNAVAILABLE

EMAIL_PROVIDER_ERROR

SMS_PROVIDER_ERROR

MAP_SERVICE_ERROR

FCM_SERVICE_ERROR
```

---

# 21. Business Rule Errors

```text
MAXIMUM_PASSENGERS_EXCEEDED

MAXIMUM_SEATS_EXCEEDED

REFUND_NOT_ALLOWED

CHECKIN_NOT_ALLOWED

BOARDING_CLOSED

TRIP_ALREADY_DEPARTED
```

---

# 22. Error Categories

```text
Authentication

Authorization

Validation

Business

Database

Integration

System
```

---

# 23. Logging Rules

Tất cả lỗi phải ghi nhận

```text
Timestamp

Request ID

User ID

API Endpoint

HTTP Method

IP Address

Device

Stack Trace (Server Only)
```

---

# 24. Client Handling

Frontend phải

```text
Hiển thị thông báo thân thiện

Ẩn Stack Trace

Retry nếu cần

Điều hướng khi Unauthorized
```

---

# 25. Retry Strategy

Áp dụng cho

```text
Network Timeout

Payment Timeout

Notification Failed

Third-party Service
```

Retry

```text
Maximum 3 Times

Exponential Backoff
```

---

# 26. Security Rules

```text
Không trả về Stack Trace

Không trả về SQL

Không trả về Password

Không trả về Secret Key

Không trả về JWT Secret
```

---

# 27. Monitoring

Theo dõi

```text
Top Errors

Error Frequency

API Failure Rate

Payment Failures

Crash Reports
```

---

# 28. Acceptance Criteria

✓ Mã lỗi thống nhất

✓ Frontend xử lý được

✓ Mobile xử lý được

✓ API trả đúng HTTP Status

✓ Log đầy đủ

✓ Không rò rỉ thông tin nhạy cảm

---

# 29. Related Documents

Authentication API

Booking API

Payment API

Security Architecture

Logging Architecture

Database Schema

---

# 30. Summary

Error Codes là tiêu chuẩn xử lý lỗi của toàn bộ hệ thống BusZ. Tài liệu này quy định thống nhất mã lỗi, HTTP Status, cấu trúc phản hồi và nguyên tắc ghi log nhằm đảm bảo tính nhất quán giữa Backend, Mobile App, Web App và các dịch vụ tích hợp, đồng thời hỗ trợ việc giám sát, bảo trì và mở rộng hệ thống.