# API Standards

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Backend API

Document ID

API-002

Priority

Critical

Version

1.0

---

# 1. Purpose

Tài liệu này định nghĩa tiêu chuẩn thiết kế REST API cho toàn bộ hệ thống BusZ.

Mục tiêu:

- Thống nhất cách thiết kế API.
- Dễ bảo trì.
- Dễ mở rộng.
- Dễ tích hợp với Flutter App.
- Tuân thủ RESTful API.

---

# 2. Base URL

Development

```
http://localhost:3000/api/v1
```

Staging

```
https://staging-api.busz.vn/api/v1
```

Production

```
https://api.busz.vn/api/v1
```

---

# 3. API Versioning

```
/api/v1
```

Ví dụ

```
GET /api/v1/trips
```

Khi nâng cấp

```
/api/v2
```

Không thay đổi API cũ nếu chưa deprecate.

---

# 4. HTTP Methods

GET

Đọc dữ liệu.

POST

Tạo dữ liệu.

PUT

Thay thế toàn bộ.

PATCH

Cập nhật một phần.

DELETE

Soft Delete.

---

# 5. URL Convention

Danh từ số nhiều.

Đúng

```
/users

/bookings

/payments

/trips
```

Sai

```
/getUsers

/createBooking

/updateTrip
```

---

# 6. Resource Naming

Nested Resource

```
GET /bookings/{id}/tickets

GET /trips/{id}/seats

GET /users/me
```

---

# 7. Request Header

```
Content-Type

application/json
```

```
Accept

application/json
```

```
Authorization

Bearer <access_token>
```

```
X-Request-ID
```

---

# 8. Response Format

Success

```json
{
  "success": true,
  "message": "Success",
  "data": {},
  "meta": {},
  "timestamp": "2026-07-04T10:00:00Z"
}
```

Error

```json
{
  "success": false,
  "error": {
    "code": "BOOKING_NOT_FOUND",
    "message": "Booking not found"
  },
  "timestamp": "2026-07-04T10:00:00Z"
}
```

---

# 9. Pagination

Request

```
?page=1

&limit=20
```

Response

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 320,
    "totalPages": 16
  }
}
```

---

# 10. Sorting

```
?sort=departureTime

?order=asc
```

Hoặc

```
?sort=-createdAt
```

(Dấu "-" là giảm dần)

---

# 11. Filtering

Ví dụ

```
GET /trips

?departureCity=HCM

&arrivalCity=DaLat

&date=2026-07-10
```

---

# 12. Search

Ví dụ

```
GET /stations

?keyword=mien dong
```

---

# 13. Status Codes

200 OK

201 Created

204 No Content

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Validation Error

429 Too Many Requests

500 Internal Server Error

503 Service Unavailable

---

# 14. Date Format

ISO 8601

Ví dụ

```
2026-07-04T14:35:00Z
```

---

# 15. Currency

Mặc định

```
VND
```

Money

```
Decimal(18,2)
```

Không trả về Float.

---

# 16. UUID Format

```
550e8400-e29b-41d4-a716-446655440000
```

Mọi ID trong API đều sử dụng UUID.

---

# 17. Authentication

JWT Bearer

Ví dụ

```
Authorization:

Bearer eyJhb...
```

---

# 18. Validation Rules

Email

RFC5322

Phone

E.164

Password

>=8 ký tự

Booking Code

Regex

Ticket Code

Regex

---

# 19. Idempotency

Áp dụng cho:

```
POST /payments

POST /refunds
```

Header

```
Idempotency-Key
```

Đảm bảo không tạo giao dịch trùng.

---

# 20. Rate Limit

Public API

```
60 req/min
```

Authenticated User

```
300 req/min
```

Admin

```
1000 req/min
```

---

# 21. File Upload

Content-Type

```
multipart/form-data
```

Hỗ trợ:

- JPG
- PNG
- PDF

Dung lượng tối đa:

```
10 MB
```

---

# 22. Error Code Convention

```
AUTH_001

BOOKING_001

PAYMENT_001

TRIP_001

USER_001
```

---

# 23. Security Headers

```
HTTPS

HSTS

Helmet

CORS

Content Security Policy
```

---

# 24. Logging

Mỗi request cần ghi:

- Request ID
- User ID
- IP
- Duration
- Status Code

---

# 25. API Documentation

Swagger/OpenAPI

```
/api/docs
```

Sinh tự động từ NestJS.

---

# 26. Testing Standards

✓ Unit Test

✓ Integration Test

✓ E2E Test

✓ Load Test

✓ Security Test

---

# 27. Best Practices

✓ RESTful.

✓ Không dùng động từ trong URL.

✓ JSON thống nhất.

✓ Phân trang.

✓ Versioning.

✓ Validation đầy đủ.

✓ Trả HTTP Status đúng.

✓ Không trả dữ liệu nhạy cảm.

---

# 28. Related Documents

API-001 Backend Architecture

API-003 Authentication API

API-014 Error Codes

---

# 29. Summary

API Standards là tiêu chuẩn chung cho toàn bộ Backend BusZ. Tài liệu này định nghĩa quy ước thiết kế REST API, cấu trúc request/response, versioning, validation, bảo mật và hiệu năng nhằm đảm bảo tính nhất quán và khả năng mở rộng của hệ thống.