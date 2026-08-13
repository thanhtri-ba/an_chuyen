# Notification History

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Notification

Document ID: NOTIFICATION-007

Priority: High

Status: Draft

Version: 1.0

---

# 1. Purpose

Notification History lưu trữ và quản lý toàn bộ lịch sử thông báo đã gửi đến người dùng.

Module này giúp:

- Tra cứu thông báo cũ.
- Kiểm tra trạng thái gửi.
- Hỗ trợ chăm sóc khách hàng.
- Hỗ trợ kiểm toán.

---

# 2. Objectives

Đảm bảo:

✓ Lưu đầy đủ lịch sử.

✓ Tìm kiếm nhanh.

✓ Đồng bộ Notification Center.

✓ Hỗ trợ Audit.

✓ Không mất dữ liệu.

---

# 3. Actors

Customer

Customer Support

Admin

Notification Service

Audit Service

---

# 4. History Lifecycle

Notification Created

↓

Queued

↓

Sent

↓

Delivered

↓

Opened

↓

Archived

↓

Expired

---

# 5. History Information

Notification ID

Notification Type

Channel

Title

Summary

Priority

Status

Created Time

Delivered Time

Read Time

Deleted Time (Soft Delete)

---

# 6. Channels

In-App

Push

Email

SMS

---

# 7. Notification Types

Authentication

Booking

Payment

Ticket

Promotion

Profile

Security

System

Emergency

---

# 8. Status

CREATED

QUEUED

SENT

DELIVERED

READ

FAILED

EXPIRED

ARCHIVED

---

# 9. Business Rules

NOTI-BR-031

Mỗi Notification phải có History.

NOTI-BR-032

History không được chỉnh sửa.

NOTI-BR-033

Customer chỉ xem History của mình.

NOTI-BR-034

Admin được xem toàn hệ thống theo phân quyền.

NOTI-BR-035

Audit Log bắt buộc.

---

# 10. Business Logic

Open History

↓

Load Notifications

↓

Search

↓

Filter

↓

Sort

↓

View Detail

---

# 11. API

GET /notifications/history

GET /notifications/history/{id}

GET /notifications/history/search

POST /notifications/history/export

---

# 12. Database

notification_history

notification_delivery_logs

notification_events

notification_channels

audit_logs

---

# 13. Search

Keyword

↓

Title

↓

Message

↓

Notification ID

↓

Result

---

# 14. Filter

Date Range

↓

Notification Type

↓

Channel

↓

Priority

↓

Status

---

# 15. Loading State

Loading History

↓

Loading Detail

↓

Searching

↓

Filtering

---

# 16. Empty State

No Notification History

↓

Hiển thị:

"No notification history available."

---

# 17. Error State

Load Failed

↓

Retry

---

Search Failed

↓

Retry

---

Export Failed

↓

Retry

---

# 18. Success State

History Loaded

↓

Detail Loaded

↓

Export Completed

---

# 19. Export

CSV

Excel

PDF

JSON (Admin)

---

# 20. Analytics

history_view

history_search

history_filter

history_export

notification_detail_view

---

# 21. Flutter Widget Tree

Scaffold

↓

SearchBar

↓

FilterBar

↓

HistoryListView

↓

HistoryCard

↓

DetailBottomSheet

---

# 22. State Management

NotificationHistoryBloc

NotificationRepository

SearchRepository

AuditRepository

---

# 23. Performance

Load History

<1 giây

Search

<300ms

Export

<5 giây

---

# 24. Accessibility

Large Font

Screen Reader

Keyboard Navigation

Touch Area ≥48dp

---

# 25. Test Cases

✓ View History.

✓ Search History.

✓ Filter History.

✓ Export CSV.

✓ Export PDF.

✓ Retry.

---

# 26. Acceptance Criteria

✓ History đầy đủ.

✓ Search chính xác.

✓ Filter chính xác.

✓ Export thành công.

✓ Audit Log đầy đủ.

---

# 27. Related Documents

Notification Center

Push Notification

Email Notification

SMS Notification

Notification Templates

---

# 28. Future Expansion

AI Notification Insights

Notification Timeline

Cross-device History

Advanced Analytics

Smart Archive

---

# 29. Summary

Notification History lưu trữ toàn bộ lịch sử thông báo của BusZ trên tất cả các kênh (In-App, Push, Email, SMS), hỗ trợ tìm kiếm, lọc, xuất dữ liệu và phục vụ công tác hỗ trợ khách hàng cũng như kiểm toán hệ thống.