# Audit Log

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Admin Web

Document ID

ADM-015

Priority

Critical

Version

1.0

---

# 1. Purpose

Audit Log ghi nhận toàn bộ hoạt động của người dùng và hệ thống nhằm:

- Kiểm toán
- Bảo mật
- Điều tra sự cố
- Tuân thủ quy định
- Truy vết thay đổi dữ liệu

---

# 2. Audit Flow

```text
User Action

↓

Permission Check

↓

Business Logic

↓

Database Update

↓

Audit Logger

↓

Audit Log Database
```

---

# 3. Logged Events

```text
Authentication

Authorization

CRUD Operations

Payments

Refunds

Bookings

Trips

Settings

Roles

Notifications

System Events
```

---

# 4. Login Audit

Ghi nhận

```text
Login Success

Login Failed

Logout

Session Expired

Password Reset

MFA Verification
```

---

# 5. CRUD Audit

Ghi nhận

```text
Create

Update

Delete

Restore

Archive
```

Bao gồm

- Giá trị cũ
- Giá trị mới

---

# 6. Payment Audit

Theo dõi

```text
Payment Created

Payment Success

Payment Failed

Refund Requested

Refund Approved

Refund Rejected

Refund Completed
```

---

# 7. Booking Audit

Theo dõi

```text
Booking Created

Seat Changed

Passenger Updated

Booking Cancelled

Booking Completed
```

---

# 8. Role Audit

Theo dõi

```text
Role Created

Role Updated

Permission Added

Permission Removed

Role Assigned

Role Revoked
```

---

# 9. System Audit

Theo dõi

```text
System Settings Changed

Maintenance Enabled

Backup Created

Restore Executed

Integration Updated
```

---

# 10. Audit Record Structure

Mỗi bản ghi gồm

```text
Audit ID

Timestamp

User ID

User Name

Role

Module

Action

Entity

Entity ID

Old Value

New Value

IP Address

Browser

Operating System

Result
```

---

# 11. Audit Result

```text
SUCCESS

FAILED

DENIED

WARNING
```

---

# 12. Search

Theo

```text
Audit ID

User

Module

Action

Entity

IP Address
```

---

# 13. Filters

Theo

```text
Date

Module

Role

Action

Result

Company
```

---

# 14. Timeline View

Hiển thị

```text
Time

↓

Action

↓

Result
```

Theo thứ tự thời gian.

---

# 15. Suspicious Activities

Phát hiện

```text
Multiple Failed Login

Permission Escalation

Mass Delete

Unexpected Refund

Repeated Export

Configuration Changes
```

Hiển thị cảnh báo.

---

# 16. Export

Định dạng

```text
CSV

Excel

PDF

JSON
```

---

# 17. Retention Policy

Lưu trữ

```text
Authentication Logs

180 Days

Audit Logs

7 Years

Payment Logs

10 Years
```

Có thể cấu hình.

---

# 18. API Integration

```text
GET /admin/audit-logs

GET /admin/audit-logs/{id}

GET /admin/audit-logs/export

GET /admin/audit-logs/statistics
```

---

# 19. Component Tree

```text
AuditLogPage

↓

SearchBox

↓

FilterBar

↓

AuditTable

↓

AuditDetailDrawer

↓

TimelineView

↓

ExportToolbar
```

---

# 20. Performance

Audit Search

```text
<300ms
```

Audit Detail

```text
<100ms
```

Export

```text
<5s
```

---

# 21. UX Guidelines

✓ Không cho phép chỉnh sửa Audit Log.

✓ Highlight các hành động nguy hiểm.

✓ Hiển thị khác biệt giữa Old Value và New Value.

✓ Hỗ trợ tìm kiếm nâng cao.

✓ Cho phép mở nhanh Entity liên quan.

---

# 22. Test Cases

✓ Login Audit.

✓ CRUD Audit.

✓ Payment Audit.

✓ Role Audit.

✓ Export.

✓ Timeline.

✓ Suspicious Activity.

✓ Search & Filter.

---

# 23. Acceptance Criteria

✓ Ghi nhận đầy đủ mọi thao tác.

✓ Không cho phép chỉnh sửa Audit Log.

✓ Search hoạt động.

✓ Export thành công.

✓ Timeline chính xác.

✓ Cảnh báo bất thường hoạt động.

---

# 24. Related Documents

ADM-002 Authentication

ADM-004 User Management

ADM-014 Role Management

API-015 Audit API

---

# 25. Summary

Audit Log là hệ thống ghi nhận và truy vết toàn bộ hoạt động của BusZ Admin. Module này giúp đảm bảo tính minh bạch, hỗ trợ điều tra sự cố, kiểm toán và đáp ứng các yêu cầu về bảo mật và tuân thủ bằng cách lưu trữ đầy đủ lịch sử thao tác của người dùng và hệ thống.