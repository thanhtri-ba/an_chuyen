# Ticket History

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Ticket

Document ID: TICKET-009

Priority: High

Status: Draft

Version: 1.0

---

# 1. Purpose

Ticket History lưu trữ và hiển thị toàn bộ vòng đời của vé điện tử.

Đây là nơi người dùng, nhân viên hỗ trợ và quản trị viên có thể theo dõi tất cả sự kiện liên quan đến một vé.

---

# 2. Objectives

Đảm bảo:

✓ Lưu toàn bộ lịch sử.

✓ Không chỉnh sửa lịch sử.

✓ Có thể tìm kiếm.

✓ Có thể kiểm toán.

✓ Đồng bộ với Booking và Payment.

---

# 3. Actors

Customer

Customer Support

Operator

Admin

Audit Service

---

# 4. Ticket Timeline

Ticket Created

↓

Ticket Issued

↓

QR Generated

↓

Viewed

↓

Transferred

↓

Validated

↓

Checked-in

↓

Completed

---

Cancelled

↓

Refunded

---

Expired

---

# 5. History Event Types

Ticket Created

Ticket Issued

QR Generated

QR Scanned

Validation Success

Validation Failed

Check-in

Transfer

Cancellation

Refund

Completed

Expired

---

# 6. Event Information

Event ID

Ticket ID

Booking ID

Event Type

Operator

Created Time

Description

Result

Location (Optional)

Device ID (Optional)

---

# 7. Search

Ticket Number

Booking Code

Passenger Name

Bus Company

Trip

Operator

---

# 8. Filter

Date Range

Status

Event Type

Bus Company

Trip

---

# 9. Business Rules

TICKET-BR-042

History không được chỉnh sửa.

TICKET-BR-043

Mọi sự kiện phải ghi History.

TICKET-BR-044

Customer chỉ xem Ticket của mình.

TICKET-BR-045

Admin xem toàn bộ.

TICKET-BR-046

Audit Log bắt buộc.

---

# 10. Business Logic

Open Ticket

↓

Load Timeline

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

GET /tickets/{id}/history

GET /tickets/history

GET /tickets/history/search

GET /tickets/history/export

---

# 12. Database

ticket_history

ticket_events

ticket_status_logs

ticket_validation_logs

audit_logs

---

# 13. Timeline Example

08:00

↓

Ticket Created

08:01

↓

QR Generated

09:30

↓

Ticket Viewed

10:15

↓

QR Scanned

10:16

↓

Check-in Success

14:30

↓

Trip Completed

---

# 14. Loading State

Loading Timeline

↓

Loading Events

↓

Loading Detail

---

# 15. Empty State

Không có lịch sử.

↓

Hiển thị:

"No ticket history found."

---

# 16. Error State

History Not Found

↓

Retry

---

Network Error

↓

Retry

---

Export Failed

↓

Retry

---

# 17. Success State

Timeline Loaded

↓

Detail Loaded

↓

Export Success

---

# 18. Export

CSV

Excel

PDF

JSON (Admin)

---

# 19. Notification

Ticket Updated

Ticket Cancelled

Refund Completed

Transfer Completed

Check-in Success

---

# 20. Analytics

ticket_history_view

ticket_history_search

ticket_history_filter

ticket_history_export

ticket_event_detail

---

# 21. Flutter Widget Tree

Scaffold

↓

SearchBar

↓

FilterBar

↓

TimelineView

↓

HistoryCard

↓

Pagination

---

# 22. State Management

TicketHistoryBloc

TicketRepository

AuditRepository

HistoryRepository

---

# 23. Performance

Load Timeline

<1 giây

Search

Realtime

Export

<5 giây

---

# 24. Accessibility

Timeline Navigation

Large Font

Screen Reader

Touch Area ≥48dp

---

# 25. Test Cases

✓ Timeline.

✓ Search.

✓ Filter.

✓ Export.

✓ Pagination.

✓ Retry.

---

# 26. Acceptance Criteria

✓ Timeline chính xác.

✓ Search đúng.

✓ Filter đúng.

✓ Export đúng.

✓ Không mất dữ liệu.

---

# 27. Related Documents

Ticket Detail

Ticket Validation

Check-in

Payment History

Booking History

Audit Log

---

# 28. Future Expansion

Timeline Replay

Map Timeline

Travel Statistics

AI Timeline Summary

Blockchain Audit

---

# 29. Summary

Ticket History là nhật ký đầy đủ về toàn bộ vòng đời của vé điện tử.

Mọi sự kiện từ khi phát hành, xác thực, chuyển vé, hủy vé, hoàn vé đến khi hoàn thành chuyến đi đều được lưu lại để phục vụ người dùng, bộ phận hỗ trợ và công tác kiểm toán.