# Notification API

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Notification Management

Document ID

API-010

Priority

High

Version

1.0

---

# 1. Purpose

Notification API quản lý toàn bộ hệ thống thông báo của BusZ.

Hỗ trợ

- Push Notification
- In-App Notification
- Email Notification
- SMS Notification
- Booking Reminder
- Trip Reminder
- Payment Reminder
- Promotion Notification
- System Announcement

---

# 2. API Overview

```text
Passenger App

Driver App

Operator Portal

Admin Portal

↓

Notification API

↓

Notification Service

↓

Firebase Cloud Messaging

Email Service

SMS Gateway

↓

PostgreSQL
```

---

# 3. Notification Flow

```text
System Event

↓

Notification API

↓

Notification Service

↓

Notification Channel

↓

User Device
```

---

# 4. API Endpoints

```text
GET /notifications

GET /notifications/{notificationId}

PATCH /notifications/{notificationId}/read

PATCH /notifications/read-all

DELETE /notifications/{notificationId}

POST /notifications/device-token

DELETE /notifications/device-token

GET /notifications/settings

PATCH /notifications/settings
```

---

# 5. Get Notifications

Endpoint

```http
GET /api/v1/notifications
```

Description

Lấy danh sách thông báo của người dùng.

---

# 6. Notification Detail

Endpoint

```http
GET /api/v1/notifications/{notificationId}
```

Thông tin

```text
Title

Message

Category

Created Time

Read Status

Priority
```

---

# 7. Notification Categories

```text
Booking

Payment

Trip

Promotion

System

Reminder

Account

Security
```

---

# 8. Notification Priority

```text
LOW

NORMAL

HIGH

URGENT
```

---

# 9. Notification Channels

```text
Push Notification

Email

SMS

In-App Notification
```

---

# 10. Mark As Read

Endpoint

```http
PATCH /api/v1/notifications/{notificationId}/read
```

Description

Đánh dấu thông báo đã đọc.

---

# 11. Mark All As Read

Endpoint

```http
PATCH /api/v1/notifications/read-all
```

---

# 12. Delete Notification

Endpoint

```http
DELETE /api/v1/notifications/{notificationId}
```

---

# 13. Device Token

Endpoint

```http
POST /api/v1/notifications/device-token
```

Thông tin

```text
Device ID

Platform

FCM Token

App Version
```

---

# 14. Notification Settings

Endpoint

```http
GET /api/v1/notifications/settings
```

Cho phép cấu hình

```text
Booking Notification

Trip Reminder

Promotion

Email

SMS

Push
```

---

# 15. Trip Reminder

Tự động gửi

```text
24 Hours Before Departure

2 Hours Before Departure

30 Minutes Before Departure
```

---

# 16. Payment Reminder

Tự động gửi

```text
Payment Pending

Payment Expiring

Payment Failed
```

---

# 17. Booking Notification

Thông báo

```text
Booking Created

Booking Confirmed

Booking Cancelled

Booking Refunded
```

---

# 18. Promotion Notification

Thông báo

```text
Voucher

Discount

Campaign

Special Event
```

---

# 19. System Notification

Thông báo

```text
Maintenance

Version Update

Security Alert

Service Announcement
```

---

# 20. Validation Rules

```text
User Exists

Device Token Valid

Notification Exists

Permission Valid
```

---

# 21. Business Rules

```text
Only Owner Can Read

Unread Counter Updated

Duplicate Push Prevented

Expired Notifications Archived
```

---

# 22. Notification Status

```text
PENDING

SENT

DELIVERED

READ

FAILED

ARCHIVED
```

---

# 23. Security

```text
JWT

RBAC

HTTPS

Encrypted Payload
```

---

# 24. Database Tables

```text
Notifications

NotificationDevices

NotificationSettings

NotificationLogs
```

---

# 25. Error Codes

```text
NOTIFICATION_NOT_FOUND

DEVICE_NOT_FOUND

TOKEN_INVALID

SEND_FAILED

UNAUTHORIZED
```

---

# 26. Performance Targets

```text
Push Delivery

<2 Seconds

Notification Query

<300 ms

Read Notification

<200 ms
```

---

# 27. Audit Logs

Theo dõi

```text
Notification Sent

Notification Read

Notification Deleted

Device Registered

Settings Updated
```

---

# 28. Integration

```text
Firebase Cloud Messaging

Email Service

SMS Gateway

Booking API

Payment API

Trip API
```

---

# 29. Acceptance Criteria

✓ Push Notification gửi thành công

✓ Email gửi thành công

✓ SMS gửi thành công

✓ Thông báo hiển thị đúng

✓ Read Status cập nhật

✓ Device Token hoạt động

✓ Reminder gửi đúng thời điểm

---

# 30. Related Documents

Booking API

Payment API

Trip API

Authentication API

Notification Business Rules

Database Schema

---

# 31. Summary

Notification API chịu trách nhiệm gửi và quản lý tất cả thông báo trong hệ thống BusZ. API hỗ trợ nhiều kênh truyền thông như Push Notification, Email, SMS và In-App Notification, đồng thời cung cấp cơ chế quản lý thiết bị, cài đặt thông báo và lịch nhắc tự động nhằm đảm bảo người dùng luôn nhận được thông tin quan trọng đúng thời điểm.