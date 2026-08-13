# Error Handling

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Admin Web

Document ID

ADM-017

Priority

Critical

Version

1.0

---

# 1. Purpose

Error Handling định nghĩa chiến lược xử lý lỗi thống nhất cho toàn bộ Admin Web.

Mục tiêu

- Không làm ứng dụng bị crash
- Hiển thị lỗi thân thiện
- Dễ debug
- Dễ bảo trì
- Có Retry khi cần

---

# 2. Error Architecture

```text
API

↓

Repository

↓

Service

↓

React Query

↓

UI

↓

Toast / Dialog
```

Không hiển thị Exception trực tiếp cho người dùng.

---

# 3. Error Categories

```text
Validation Error

Authentication Error

Authorization Error

Network Error

Business Error

Payment Error

Upload Error

Unknown Error
```

---

# 4. Validation Error

Ví dụ

```text
Email Invalid

Required Field

Duplicate Code

Invalid Date
```

Hiển thị ngay dưới Form Field.

---

# 5. Authentication Error

Ví dụ

```text
Token Expired

Invalid Token

Refresh Failed
```

Flow

```text
Refresh Token

↓

Success

↓

Continue

↓

Fail

↓

Login Page
```

---

# 6. Authorization Error

HTTP

```text
403 Forbidden
```

UI

```text
Access Denied
```

Buttons

```text
Back

Go Dashboard
```

---

# 7. API Error Mapping

| HTTP | UI |
|------|----------------|
|400|Invalid Request|
|401|Login Required|
|403|Permission Denied|
|404|Resource Not Found|
|409|Conflict|
|422|Validation Failed|
|429|Too Many Requests|
|500|Internal Server Error|
|503|Service Unavailable|

---

# 8. Network Error

Ví dụ

```text
Offline

Timeout

DNS Error

Socket Error
```

UI

```text
Connection Lost

Retry
```

---

# 9. Upload Error

Ví dụ

```text
File Too Large

Unsupported Format

Virus Detected

Storage Full
```

Hiển thị

```text
Retry Upload
```

---

# 10. Payment Error

Ví dụ

```text
Gateway Timeout

Webhook Failed

Refund Failed

Reconciliation Error
```

Cho phép

```text
Retry

Review

Escalate
```

---

# 11. Global Error Boundary

Bắt

```text
React Error

Render Error

Unhandled Promise

Unexpected Exception
```

↓

Log

↓

Fallback UI

---

# 12. Retry Strategy

Network

↓

```text
Retry 3 Times
```

Delay

```text
1s

2s

5s
```

---

# 13. Toast Messages

Loại

```text
Success

Warning

Error

Information
```

Thời gian

```text
5 Seconds
```

---

# 14. Dialog Errors

Sử dụng cho

```text
Delete

Refund

Permission Error

Critical Failure
```

Buttons

```text
Retry

Cancel
```

---

# 15. Logging

Development

```text
Console

Pretty Logger
```

Production

```text
Remote Logging

Sentry
```

Không log

```text
Password

JWT

Payment Secret

API Secret
```

---

# 16. Monitoring

Theo dõi

```text
Frontend Errors

API Failures

Upload Failures

Payment Errors

Crash Count
```

---

# 17. Error Analytics

Theo dõi

```text
Error Rate

Retry Success

Most Frequent Errors

Affected Modules
```

---

# 18. Component Tree

```text
ErrorBoundary

↓

FallbackPage

↓

ErrorDialog

↓

ToastProvider

↓

RetryButton
```

---

# 19. Performance

Error Mapping

```text
<10ms
```

Retry

```text
Automatic
```

Logging

```text
Background
```

---

# 20. UX Guidelines

✓ Không hiển thị Stack Trace.

✓ Giải thích lỗi bằng ngôn ngữ dễ hiểu.

✓ Luôn có hướng dẫn khắc phục.

✓ Retry khi phù hợp.

✓ Không làm mất dữ liệu đã nhập.

---

# 21. Test Cases

✓ Validation Error.

✓ API 500.

✓ API 401.

✓ API 403.

✓ Network Lost.

✓ Upload Error.

✓ Payment Error.

✓ Retry.

---

# 22. Acceptance Criteria

✓ Error Boundary hoạt động.

✓ Retry thành công.

✓ Logging đầy đủ.

✓ Friendly Message.

✓ Monitoring hoạt động.

✓ Không Crash.

---

# 23. Related Documents

ADM-002 Authentication

ADM-009 Payment Management

ADM-018 Testing

APP-018 Error Handling

---

# 24. Summary

Error Handling của Admin Web xây dựng cơ chế xử lý lỗi thống nhất từ API đến giao diện người dùng. Hệ thống kết hợp Global Error Boundary, Retry Strategy, Error Logging và Monitoring để giảm thiểu lỗi, nâng cao trải nghiệm người dùng và hỗ trợ đội phát triển nhanh chóng xác định và khắc phục sự cố.