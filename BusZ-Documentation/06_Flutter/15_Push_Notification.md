# Push Notification

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Flutter Mobile App

Document ID

APP-015

Priority

Critical

Version

1.0

---

# 1. Purpose

Push Notification giúp BusZ gửi thông báo đến người dùng ngay cả khi ứng dụng không mở.

Mục tiêu:

- Thông báo theo thời gian thực
- Nhắc lịch khởi hành
- Cập nhật trạng thái đặt vé
- Thông báo khuyến mãi
- Điều hướng nhanh vào ứng dụng

---

# 2. Technology

Android

```text
Firebase Cloud Messaging (FCM)
```

iOS

```text
Apple Push Notification Service (APNs)

+

Firebase Messaging
```

---

# 3. Notification Flow

```text
Backend

↓

Firebase Cloud Messaging

↓

Device

↓

Flutter

↓

Notification Handler

↓

Open Screen
```

---

# 4. Notification Types

```text
Booking

Payment

Ticket

Promotion

Reminder

Refund

Account

System
```

---

# 5. Device Registration

Flow

```text
Install App

↓

Request Permission

↓

Receive Device Token

↓

Send Token To Backend

↓

Store Token
```

---

# 6. Token Management

Lưu

```text
FCM Token

Platform

Device Name

OS Version

App Version
```

Token thay đổi

↓

Update Backend.

---

# 7. Permission Flow

Android

```text
POST_NOTIFICATIONS
```

Android 13+

iOS

```text
Alert

Sound

Badge
```

---

# 8. Notification Channels

Android

```text
Booking

Payment

Promotion

Reminder

Marketing
```

Cho phép người dùng bật/tắt từng Channel.

---

# 9. Notification Payload

Ví dụ

```json
{
  "title":"Booking Confirmed",
  "body":"Your booking has been confirmed.",
  "type":"BOOKING",
  "bookingId":"BK123456",
  "deepLink":"busz://booking/BK123456"
}
```

---

# 10. Foreground Notification

Ứng dụng đang mở

↓

Hiển thị

```text
Banner

Snackbar

Dialog
```

Không hiển thị Notification System mặc định nếu không cần.

---

# 11. Background Notification

Ứng dụng nền

↓

System Notification

↓

Tap

↓

Deep Link

↓

Open Screen

---

# 12. Terminated State

Ứng dụng tắt hoàn toàn

↓

Push

↓

Tap

↓

Launch App

↓

Navigate đúng màn hình

---

# 13. Rich Notification

Hỗ trợ

```text
Image

Large Icon

Action Button

Big Text
```

Ví dụ

```text
View Ticket

Open Promotion
```

---

# 14. Silent Push

Dùng để

```text
Sync Ticket

Sync Notification

Refresh Profile
```

Không hiển thị UI.

---

# 15. Reminder Notifications

Ví dụ

```text
24 hours before departure

2 hours before departure

30 minutes before departure
```

---

# 16. Deep Linking

Ví dụ

```text
busz://ticket/TK123

busz://booking/BK123

busz://promotion/PM001
```

---

# 17. Notification History

Lưu

```text
Last 100 Notifications
```

Offline

↓

Hiển thị từ Hive.

---

# 18. Analytics

Theo dõi

```text
Delivered

Opened

Dismissed

Failed

Clicked
```

---

# 19. Token Refresh

Nếu FCM Token thay đổi

↓

Update Backend

↓

Deactivate Token cũ

↓

Đăng ký Token mới

---

# 20. State Management

Cubit

```text
NotificationCubit
```

States

```text
NotificationPermissionGranted

NotificationPermissionDenied

NotificationReceived

NotificationOpened

NotificationError
```

---

# 21. API Integration

```text
POST /devices/register

PATCH /devices/token

DELETE /devices/{id}

GET /notifications
```

---

# 22. Component Tree

```text
PushNotificationService

↓

FirebaseMessaging

↓

NotificationHandler

↓

DeepLinkManager

↓

NotificationCubit
```

---

# 23. UX Guidelines

✓ Không gửi quá nhiều thông báo.

✓ Hiển thị tiêu đề ngắn gọn.

✓ Deep Link chính xác.

✓ Cho phép tắt từng loại thông báo.

✓ Không gửi Marketing vào ban đêm.

---

# 24. Performance

Push Delivery

```text
<5s
```

Deep Link Open

```text
<500ms
```

Token Update

```text
<1s
```

---

# 25. Test Cases

✓ Foreground Notification.

✓ Background Notification.

✓ Terminated State.

✓ Rich Notification.

✓ Silent Push.

✓ Token Refresh.

✓ Deep Link.

✓ Permission Denied.

---

# 26. Acceptance Criteria

✓ Push hoạt động trên Android.

✓ Push hoạt động trên iOS.

✓ Deep Link chính xác.

✓ Token được đồng bộ.

✓ Reminder hoạt động.

✓ Notification History lưu thành công.

---

# 27. Related Documents

APP-011 Notification Module

APP-017 Deep Linking

API-010 Notification API

---

# 28. Summary

Push Notification của BusZ sử dụng Firebase Cloud Messaging kết hợp APNs để gửi thông báo theo thời gian thực trên Android và iOS. Hệ thống hỗ trợ Deep Linking, Rich Notification, Silent Push và quản lý Device Token nhằm đảm bảo người dùng luôn nhận được các thông tin quan trọng một cách nhanh chóng và chính xác.