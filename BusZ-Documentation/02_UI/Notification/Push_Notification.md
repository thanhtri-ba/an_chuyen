# Push Notification

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Notification

Document ID: NOTIFICATION-003

Priority: Critical

Status: Draft

Version: 1.0

---

# 1. Purpose

Push Notification chịu trách nhiệm gửi thông báo trực tiếp đến thiết bị của người dùng ngay cả khi ứng dụng đang chạy nền hoặc đã đóng.

Mục tiêu:

- Gửi thông báo thời gian thực.
- Điều hướng nhanh vào đúng màn hình.
- Đảm bảo khả năng nhận thông báo.

---

# 2. Objectives

Đảm bảo:

✓ Real-time Delivery.

✓ Reliable Delivery.

✓ Deep Link.

✓ Badge Update.

✓ Delivery Tracking.

---

# 3. Supported Platforms

Android (FCM)

iOS (APNs)

Web Push (Future)

Huawei Push (Future)

---

# 4. Push Categories

Booking

Payment

Ticket

Promotion

Security

System

Emergency

---

# 5. Push Lifecycle

Business Event

↓

Create Push

↓

Resolve Device Tokens

↓

Send

↓

Delivered

↓

Opened

↓

Archived

---

# 6. Push Payload

Notification ID

Title

Body

Image URL (Optional)

Priority

Category

Deep Link

Created Time

Expiry Time

---

# 7. Device Registration

Install App

↓

Request Permission

↓

Generate Device Token

↓

Register Token

↓

Save Database

↓

Ready

---

# 8. Business Rules

NOTI-BR-011

Một User có thể có nhiều Device Token.

NOTI-BR-012

Device Token phải được cập nhật khi thay đổi.

NOTI-BR-013

Push thất bại phải Retry.

NOTI-BR-014

Push phải tuân theo Notification Preferences.

NOTI-BR-015

Mọi Push phải ghi Delivery Log.

---

# 9. Business Logic

Receive Event

↓

Load User

↓

Load Device Tokens

↓

Apply User Preference

↓

Create Payload

↓

Send Push

↓

Save Result

---

# 10. API

POST /notifications/push/send

POST /notifications/device/register

DELETE /notifications/device/{id}

GET /notifications/device

---

# 11. Database

device_tokens

push_notifications

push_delivery_logs

notification_preferences

audit_logs

---

# 12. Loading State

Registering Device

↓

Sending Push

↓

Waiting Delivery

---

# 13. Error State

Permission Denied

↓

Request Again

---

Invalid Device Token

↓

Refresh Token

---

Push Failed

↓

Retry Queue

---

# 14. Success State

Push Delivered

↓

Badge Updated

↓

Notification Center Synced

---

# 15. Badge Count

Unread Notification

↓

Increase Badge

↓

Open Notification

↓

Decrease Badge

↓

Sync Server

---

# 16. Deep Link

Push Click

↓

Parse Deep Link

↓

Open Screen

↓

Load Related Data

↓

Display Content

---

# 17. Retry Strategy

Send Failed

↓

Retry

↓

Exponential Backoff

↓

Max Retry Reached

↓

Mark Failed

---

# 18. Notification Examples

Booking Confirmed

Payment Successful

Ticket Generated

Trip Reminder

Boarding Reminder

Promotion Available

Security Alert

---

# 19. Analytics

push_sent

push_delivered

push_opened

push_failed

device_registered

badge_updated

---

# 20. Flutter Widget Tree

Application

↓

FirebaseMessaging

↓

NotificationHandler

↓

DeepLinkRouter

↓

NotificationCenter

---

# 21. State Management

PushNotificationBloc

NotificationRepository

DeviceRepository

DeepLinkRepository

---

# 22. Performance

Register Device

<1 giây

Send Push

<3 giây

Deep Link Open

<500ms

---

# 23. Accessibility

Screen Reader

Large Notification Text

Action Buttons Accessible

Respect OS Accessibility Settings

---

# 24. Test Cases

✓ Register Device.

✓ Receive Push.

✓ Open Deep Link.

✓ Badge Update.

✓ Retry Failed Push.

✓ Permission Denied.

✓ Multiple Devices.

---

# 25. Acceptance Criteria

✓ Push gửi đúng.

✓ Badge đồng bộ.

✓ Deep Link hoạt động.

✓ Retry hoạt động.

✓ Delivery Log đầy đủ.

---

# 26. Related Documents

Notification Architecture

Notification Center

Notification Preferences

Booking

Payment

Ticket

---

# 27. Future Expansion

Rich Push Notification

Interactive Push Actions

Silent Push

Scheduled Push

Location-based Push

AI Priority Push

---

# 28. Summary

Push Notification cung cấp cơ chế gửi thông báo thời gian thực đến thiết bị người dùng, hỗ trợ nhiều nền tảng, Deep Link, đồng bộ Notification Center và theo dõi đầy đủ trạng thái gửi, nhận và mở thông báo.