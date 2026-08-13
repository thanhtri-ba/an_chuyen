# Notification API

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Backend API

Document ID

API-010

Priority

High

Version

1.0

---

# 1. Purpose

Notification API quản lý toàn bộ hệ thống thông báo của BusZ.

Hỗ trợ:

- In-app Notification
- Push Notification
- Email
- SMS
- Thông báo hệ thống
- Thông báo Booking
- Thông báo Payment
- Thông báo Ticket
- Thông báo Promotion

---

# 2. Authentication

Yêu cầu

```text
Bearer JWT
```

Admin API yêu cầu:

```text
ADMIN

MARKETING
```

---

# 3. Endpoints Overview

| Method | Endpoint | Permission |
|----------|-------------------------------|------------|
| GET | /notifications | User |
| GET | /notifications/unread-count | User |
| GET | /notifications/{id} | User |
| PATCH | /notifications/{id}/read | User |
| PATCH | /notifications/read-all | User |
| DELETE | /notifications/{id} | User |
| POST | /notifications/test | Admin |

---

# 4. Get Notifications

Endpoint

```text
GET /notifications
```

Query

```text
page

limit

type

status
```

Response

```json
{
  "data":[
    {
      "id":"uuid",
      "title":"Booking Confirmed",
      "message":"Your booking has been confirmed.",
      "type":"BOOKING",
      "status":"UNREAD",
      "createdAt":"2026-07-04T10:00:00Z"
    }
  ]
}
```

---

# 5. Get Notification Detail

Endpoint

```text
GET /notifications/{id}
```

Business Rules

- Chỉ chủ sở hữu được xem.
- Tự động đánh dấu READ nếu chưa đọc.

---

# 6. Unread Count

Endpoint

```text
GET /notifications/unread-count
```

Response

```json
{
  "count":5
}
```

---

# 7. Mark As Read

Endpoint

```text
PATCH /notifications/{id}/read
```

Business Rules

- Chỉ cập nhật nếu trạng thái là UNREAD.
- Ghi thời gian `readAt`.

---

# 8. Mark All Read

Endpoint

```text
PATCH /notifications/read-all
```

Business Flow

```text
Find UNREAD

↓

Update READ

↓

Return Count
```

---

# 9. Delete Notification

Endpoint

```text
DELETE /notifications/{id}
```

Business Rules

- Soft Delete.
- Không xóa vật lý.
- Chỉ chủ sở hữu được xóa.

---

# 10. Send Test Notification

Endpoint

```text
POST /notifications/test
```

Permission

```text
ADMIN
```

Request

```json
{
  "userId":"uuid",
  "channel":"PUSH",
  "title":"Test Notification",
  "message":"Hello BusZ"
}
```

---

# 11. Notification Types

```text
BOOKING

PAYMENT

TICKET

PROMOTION

SYSTEM

SECURITY

ACCOUNT

MARKETING
```

---

# 12. Notification Channels

```text
IN_APP

PUSH

EMAIL

SMS
```

---

# 13. Notification Status

```text
PENDING

SENT

DELIVERED

READ

FAILED

DELETED
```

---

# 14. Business Rules

NOTIFICATION-BR-001

Thông báo BOOKING được tạo sau khi Booking thành công.

---

NOTIFICATION-BR-002

Thông báo PAYMENT được tạo sau khi Payment SUCCESS.

---

NOTIFICATION-BR-003

Thông báo TICKET được gửi ngay sau khi phát hành vé.

---

NOTIFICATION-BR-004

Thông báo MARKETING chỉ gửi cho User đã đồng ý nhận.

---

NOTIFICATION-BR-005

Không gửi Notification trùng trong cùng một sự kiện.

---

# 15. Notification Flow

```text
Business Event

↓

Notification Service

↓

Queue

↓

Worker

↓

Channel

↓

User
```

---

# 16. Queue Processing

Sử dụng

```text
BullMQ
```

Queue

```text
notification_queue
```

Retry

```text
3 lần
```

Backoff

```text
Exponential
```

---

# 17. Error Codes

| Code | Description |
|------|-------------|
| NOTI_001 | Notification Not Found |
| NOTI_002 | Notification Already Read |
| NOTI_003 | Invalid Channel |
| NOTI_004 | Delivery Failed |
| NOTI_005 | User Not Found |

---

# 18. Security

JWT

Ownership Validation

Rate Limit

Audit Log

Admin Permission

---

# 19. Performance

Load Notifications

```text
<50ms
```

Unread Count

```text
<10ms
```

Send Push

```text
<2s
```

Queue Delay

```text
<500ms
```

---

# 20. Sequence Diagram

```text
Booking Success

↓

Notification Service

↓

Queue

↓

Worker

↓

Firebase / Email

↓

User Device
```

---

# 21. Test Cases

✓ Load Notifications.

✓ Read Notification.

✓ Read All.

✓ Delete Notification.

✓ Push Success.

✓ Email Success.

✓ Queue Retry.

✓ Failed Delivery.

---

# 22. Acceptance Criteria

✓ Queue hoạt động.

✓ Retry đúng.

✓ Không gửi trùng.

✓ Read Status chính xác.

✓ Audit Log đầy đủ.

---

# 23. Related Documents

API-007 Booking API

API-008 Payment API

API-009 Ticket API

DB-014 Notifications

---

# 24. Summary

Notification API quản lý toàn bộ hệ thống thông báo của BusZ, hỗ trợ nhiều kênh gửi (In-app, Push, Email, SMS), xử lý bất đồng bộ bằng BullMQ và đảm bảo thông báo được gửi đúng người, đúng thời điểm với khả năng retry khi xảy ra lỗi.