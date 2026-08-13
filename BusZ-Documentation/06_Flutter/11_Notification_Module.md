# Notification Module

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Flutter Mobile App

Document ID

APP-011

Priority

High

Version

1.0

---

# 1. Purpose

Notification Module giúp người dùng nhận và quản lý toàn bộ thông báo từ hệ thống BusZ.

Bao gồm:

- Push Notification
- In-App Notification
- Booking Notification
- Payment Notification
- Promotion Notification
- System Notification
- Realtime Notification

---

# 2. User Flow

```text
Push Notification

↓

Open App

↓

Notification List

↓

Notification Detail

↓

Related Screen
```

---

# 3. Notification Types

```text
BOOKING

PAYMENT

TICKET

PROMOTION

SYSTEM

ACCOUNT

REFUND
```

---

# 4. Notification List

Hiển thị

- Icon
- Tiêu đề
- Nội dung ngắn
- Thời gian
- Trạng thái đọc

Phân nhóm

```text
Today

Yesterday

Earlier
```

---

# 5. Notification Detail

Hiển thị

- Tiêu đề
- Nội dung đầy đủ
- Hình ảnh (nếu có)
- Thời gian
- Nút hành động

Ví dụ

```text
View Ticket

View Booking

View Promotion
```

---

# 6. Push Notification

Nguồn

```text
Firebase Cloud Messaging (FCM)
```

Kích hoạt khi:

- Đặt vé thành công
- Thanh toán thành công
- Vé sắp khởi hành
- Có khuyến mãi mới
- Thay đổi lịch trình
- Hoàn tiền

---

# 7. In-App Notification

Hiển thị khi ứng dụng đang mở.

Kiểu hiển thị

```text
Banner

Dialog

Snackbar
```

---

# 8. Realtime Notification

Sử dụng

```text
Firebase

hoặc

Supabase Realtime
```

Đồng bộ

- Trạng thái Booking
- Trạng thái Payment
- Ticket
- Khuyến mãi

---

# 9. Notification Actions

Cho phép

```text
Mark as Read

Mark All as Read

Delete

Clear All
```

---

# 10. Deep Link

Ví dụ

```text
Booking Notification

↓

Booking Detail

Payment Notification

↓

Payment Detail

Promotion

↓

Promotion Detail

Ticket

↓

Ticket Detail
```

---

# 11. Notification Settings

Cho phép bật/tắt

```text
Booking

Payment

Promotion

System

Marketing

Reminder
```

---

# 12. Reminder Notifications

Ví dụ

```text
2 giờ trước giờ khởi hành

30 phút trước giờ khởi hành

Đến điểm đón
```

---

# 13. Badge Counter

Hiển thị

```text
Unread Count
```

Tại

- App Icon
- Notification Tab

---

# 14. Loading State

Skeleton

- Notification Card
- Notification Detail

---

# 15. Empty State

Ví dụ

```text
No notifications yet.
```

Hiển thị

- Illustration
- Message

---

# 16. Error State

Ví dụ

```text
Unable to load notifications.
```

Buttons

```text
Retry
```

---

# 17. Offline Mode

Cho phép

- Xem thông báo đã cache

Không cho phép

- Đồng bộ
- Đánh dấu đã đọc trên Server

---

# 18. State Management

Cubit

```text
NotificationCubit
```

States

```text
NotificationInitial

NotificationLoading

NotificationLoaded

NotificationEmpty

NotificationOffline

NotificationError
```

---

# 19. API Integration

```text
GET /notifications

GET /notifications/{id}

PATCH /notifications/{id}/read

PATCH /notifications/read-all

DELETE /notifications/{id}
```

---

# 20. Component Tree

```text
NotificationScreen

↓

NotificationFilter

↓

NotificationList

↓

NotificationCard

↓

NotificationDetail

↓

ActionButtons
```

---

# 21. UX Guidelines

✓ Hiển thị badge chưa đọc.

✓ Đánh dấu đã đọc ngay khi mở.

✓ Chuyển đúng màn hình bằng Deep Link.

✓ Vuốt để xóa thông báo.

✓ Hỗ trợ Pull-to-Refresh.

---

# 22. Performance

Notification Load

```text
<100ms
```

Push Receive

```text
<2s
```

Realtime Update

```text
<1s
```

---

# 23. Test Cases

✓ Receive Push.

✓ Open Notification.

✓ Deep Link.

✓ Mark as Read.

✓ Delete Notification.

✓ Reminder.

✓ Offline.

✓ Badge Update.

---

# 24. Acceptance Criteria

✓ Push Notification hoạt động.

✓ Badge cập nhật đúng.

✓ Deep Link chính xác.

✓ Notification Settings hoạt động.

✓ Realtime Notification.

✓ Offline Cache.

---

# 25. Related Documents

APP-010 Profile Module

APP-012 Settings Module

API-010 Notification API

---

# 26. Summary

Notification Module của BusZ cung cấp hệ thống thông báo đầy đủ với Push Notification, In-App Notification và Realtime Notification. Module hỗ trợ Deep Link, Badge Counter, Reminder và Offline Cache để người dùng luôn nhận được các thông tin quan trọng đúng thời điểm.