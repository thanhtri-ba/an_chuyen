# Role Management

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Admin Web

Document ID

ADM-014

Priority

Critical

Version

1.0

---

# 1. Purpose

Role Management định nghĩa hệ thống phân quyền (RBAC - Role-Based Access Control) cho toàn bộ nền tảng BusZ Admin.

Mục tiêu:

- Kiểm soát quyền truy cập
- Phân quyền theo vai trò
- Hạn chế truy cập trái phép
- Dễ mở rộng
- Hỗ trợ Multi-tenant

---

# 2. RBAC Architecture

```text
User

↓

Role

↓

Permission Group

↓

Permission

↓

Module

↓

Action
```

---

# 3. Default Roles

```text
Super Admin

Company Admin

Operator

Customer Support

Finance

Marketing

Auditor

Viewer
```

---

# 4. Permission Groups

```text
Dashboard

Users

Companies

Routes

Trips

Bookings

Payments

Promotions

Reports

Notifications

Settings

Audit Logs
```

---

# 5. Actions

Mỗi Module có

```text
View

Create

Update

Delete

Approve

Reject

Export

Import

Assign

Manage
```

---

# 6. Permission Matrix

Ví dụ

```text
Users

↓

View

Create

Update

Delete

Reset Password

Assign Role
```

Trips

↓

```text
View

Create

Cancel

Delay

Assign Driver

Assign Vehicle
```

Payments

↓

```text
View

Refund

Export

Reconciliation
```

---

# 7. Role Assignment

Flow

```text
Select User

↓

Select Role

↓

Validate

↓

Save
```

Một User có thể có nhiều Role.

---

# 8. Role Templates

Templates

```text
Support

Finance

Operator

Marketing
```

Cho phép

```text
Duplicate

Customize

Archive
```

---

# 9. Data Scope

Giới hạn dữ liệu

```text
Global

Company

Province

Route

Own Records
```

Ví dụ

Company Admin

↓

Chỉ xem dữ liệu của nhà xe mình.

---

# 10. Multi-tenant Permission

Company Admin

↓

```text
Company A
```

Không được xem

```text
Company B
```

Backend luôn kiểm tra Data Scope.

---

# 11. Temporary Permission

Cho phép cấp quyền

```text
Start Time

End Time

Reason

Approved By
```

Hết hạn

↓

Tự động thu hồi.

---

# 12. Permission Inheritance

Ví dụ

```text
Super Admin

↓

Finance Admin

↓

Finance Staff
```

Role con kế thừa quyền của Role cha nếu được cấu hình.

---

# 13. Permission Validation

Frontend

↓

Ẩn

```text
Menu

Button

Action
```

Backend

↓

Kiểm tra

JWT

↓

Permission

↓

Data Scope

---

# 14. Sensitive Operations

Yêu cầu

```text
MFA

Password Confirmation
```

Áp dụng

```text
Delete

Refund

Role Change

System Settings
```

---

# 15. Audit Trail

Ghi nhận

```text
Role Created

Role Updated

Permission Changed

User Assigned

Permission Revoked
```

---

# 16. API Integration

```text
GET /admin/roles

POST /admin/roles

PATCH /admin/roles/{id}

DELETE /admin/roles/{id}

GET /admin/permissions

PATCH /admin/users/{id}/roles
```

---

# 17. Component Tree

```text
RoleManagementPage

↓

RoleList

↓

PermissionMatrix

↓

RoleEditor

↓

UserAssignmentPanel

↓

AuditHistoryDrawer
```

---

# 18. Performance

Role Load

```text
<200ms
```

Permission Check

```text
<20ms
```

Role Assignment

```text
<100ms
```

---

# 19. UX Guidelines

✓ Permission Matrix dễ đọc.

✓ Hỗ trợ tìm kiếm quyền.

✓ Cảnh báo trước khi thu hồi quyền.

✓ Hiển thị quyền kế thừa.

✓ Có thể sao chép Role.

---

# 20. Test Cases

✓ Create Role.

✓ Edit Role.

✓ Delete Role.

✓ Assign Role.

✓ Temporary Permission.

✓ Data Scope.

✓ Permission Matrix.

✓ Multi-role User.

---

# 21. Acceptance Criteria

✓ RBAC hoạt động.

✓ Permission Matrix chính xác.

✓ Data Scope hoạt động.

✓ Multi-tenant an toàn.

✓ Temporary Permission tự hết hạn.

✓ Audit Log đầy đủ.

---

# 22. Related Documents

ADM-002 Authentication

ADM-004 User Management

ADM-015 Audit Log

API-014 RBAC API

---

# 23. Summary

Role Management là nền tảng bảo mật của BusZ Admin, triển khai mô hình RBAC kết hợp Data Scope và Multi-tenant để kiểm soát quyền truy cập. Hệ thống hỗ trợ nhiều vai trò, kế thừa quyền, phân quyền tạm thời và ghi nhận toàn bộ thay đổi nhằm đảm bảo tính bảo mật và minh bạch.