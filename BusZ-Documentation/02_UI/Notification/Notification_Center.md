# Notification Center

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Notification

Document ID: NOTIFICATION-002

Priority: High

Status: Draft

Version: 1.0

---

# 1. Purpose

Notification Center là nơi tập trung toàn bộ thông báo của người dùng trong BusZ.

Người dùng có thể:

- Xem thông báo.
- Đánh dấu đã đọc.
- Xóa thông báo.
- Tìm kiếm.
- Lọc theo loại.
- Đồng bộ trạng thái giữa các thiết bị.

---

# 2. Objectives

Đảm bảo:

✓ Quản lý thông báo.

✓ Realtime.

✓ Đồng bộ đa thiết bị.

✓ Hỗ trợ tìm kiếm.

✓ Hỗ trợ lọc.

---

# 3. Actors

Customer

Notification Service

Booking Service

Payment Service

Ticket Service

Admin

---

# 4. Notification Categories

Booking

Payment

Ticket

Promotion

System

Security

Profile

General

---

# 5. Notification Lifecycle

Created

↓

Delivered

↓

Unread

↓

Read

↓

Archived

↓

Deleted

---

# 6. Notification Information

Notification ID

Title

Message

Category

Priority

Status

Created Time

Read Time

Action URL

Icon

---

# 7. Priority Levels

Critical

High

Normal

Low

---

# 8. Business Rules

NOTI-BR-006

Thông báo thuộc đúng User.

NOTI-BR-007

Thông báo quan trọng không tự động xóa.

NOTI-BR-008

Đánh dấu đã đọc phải đồng bộ.

NOTI-BR-009

Read Time phải được lưu.

NOTI-BR-010

Mọi thao tác phải ghi Audit Log.

---

# 9. Business Logic

Open Notification Center

↓

Load Notifications

↓

Sort

↓

Filter

↓

Read

↓

Update Status

↓

Sync

---

# 10. API

GET /notifications

GET /notifications/unread

PATCH /notifications/{id}/read

PATCH /notifications/read-all

DELETE /notifications/{id}

GET /notifications/search

---

# 11. Database

notifications

notification_reads

notification_categories

notification_logs

audit_logs

---

# 12. Loading State

Loading Notifications

↓

Loading More

↓

Refreshing

---

# 13. Empty State

Không có thông báo.

↓

Hiển thị:

"You're all caught up!"

---

# 14. Error State

Load Failed

↓

Retry

---

Network Error

↓

Retry

---

Sync Failed

↓

Retry Later

---

# 15. Success State

Notifications Loaded

↓

Realtime Update

↓

Ready

---

# 16. Search

Keyword

↓

Category

↓

Status

↓

Date Range

↓

Result

---

# 17. Filter

Unread

Read

Booking

Payment

Ticket

Promotion

Security

System

---

# 18. Realtime Update

New Notification

↓

Push

↓

Insert Top

↓

Increase Badge

↓

Refresh UI

---

# 19. Bulk Actions

Mark All Read

Delete Selected

Archive Selected

Restore (Future)

---

# 20. Analytics

notification_view

notification_read

notification_delete

notification_search

notification_filter

mark_all_read

---

# 21. Flutter Widget Tree

Scaffold

↓

SearchBar

↓

FilterChipList

↓

NotificationListView

↓

NotificationCard

↓

EmptyStateWidget

---

# 22. State Management

NotificationBloc

NotificationRepository

RealtimeRepository

SearchRepository

---

# 23. Performance

Load Notifications

<1 giây

Realtime Update

<500ms

Search

<300ms

---

# 24. Accessibility

Large Font

Screen Reader

Swipe Actions

Touch Area ≥48dp

---

# 25. Test Cases

✓ Load Notifications.

✓ Read Notification.

✓ Mark All Read.

✓ Delete Notification.

✓ Search.

✓ Filter.

✓ Realtime Update.

---

# 26. Acceptance Criteria

✓ Notification hiển thị đúng.

✓ Badge cập nhật đúng.

✓ Đồng bộ đa thiết bị.

✓ Realtime hoạt động.

✓ Không Duplicate Notification.

---

# 27. Related Documents

Push Notification

Notification History

Notification Preferences

Booking

Payment

Ticket

---

# 28. Future Expansion

Notification Pinning

Notification Snooze

AI Priority Sorting

Smart Grouping

Offline Notification Cache

---

# 29. Summary

Notification Center là trung tâm quản lý tất cả thông báo của BusZ. Hệ thống hỗ trợ cập nhật thời gian thực, tìm kiếm, lọc, đồng bộ đa thiết bị và giúp người dùng dễ dàng theo dõi các sự kiện liên quan đến đặt vé, thanh toán và chuyến đi.