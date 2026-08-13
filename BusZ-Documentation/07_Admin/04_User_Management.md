# User Management

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Admin Web

Document ID

ADM-004

Priority

Critical

Version

1.0

---

# 1. Purpose

User Management cho phép quản trị viên quản lý toàn bộ tài khoản người dùng trong hệ thống BusZ.

Bao gồm:

- Quản lý khách hàng
- Quản lý tài khoản Admin
- Khóa/Mở khóa
- Gán vai trò
- Đặt lại mật khẩu
- Theo dõi hoạt động

---

# 2. User Flow

```text
Dashboard

↓

Users

↓

Search User

↓

View Detail

↓

Edit

↓

Save
```

---

# 3. User List

Hiển thị

- Avatar
- User ID
- Họ tên
- Email
- Số điện thoại
- Vai trò
- Trạng thái
- Ngày tạo

---

# 4. Search

Cho phép tìm theo

```text
User ID

Name

Email

Phone

Role
```

Search Delay

```text
300ms
```

---

# 5. Filters

Theo

```text
Status

Role

Company

Registration Date

Last Login
```

---

# 6. Sorting

```text
Newest

Oldest

Name A-Z

Last Login

Booking Count
```

---

# 7. User Detail

Thông tin

```text
Basic Information

Identity

Booking History

Payment History

Favorite Routes

Devices

Audit Log
```

---

# 8. Create User

Fields

```text
Full Name

Email

Phone

Role

Password

Status
```

Tùy chọn

```text
Send Welcome Email
```

---

# 9. Edit User

Cho phép cập nhật

```text
Name

Phone

Role

Status

Company
```

Không cho phép sửa

```text
User ID

Created Date
```

---

# 10. User Status

```text
ACTIVE

INACTIVE

LOCKED

PENDING

DELETED
```

---

# 11. Lock / Unlock User

Lý do

```text
Fraud

Spam

Violation

Requested by User

Other
```

Lưu Audit Log.

---

# 12. Reset Password

Flow

```text
Admin

↓

Generate Reset Link

↓

Send Email

↓

User Reset Password
```

Không hiển thị mật khẩu mới cho Admin.

---

# 13. Assign Role

Vai trò

```text
Customer

Support

Operator

Finance

Company Admin

Super Admin
```

Kiểm tra quyền trước khi thay đổi.

---

# 14. Booking History

Hiển thị

- Booking ID
- Route
- Date
- Status
- Amount

Button

```text
View Booking
```

---

# 15. Payment History

Hiển thị

- Payment ID
- Amount
- Method
- Status
- Paid Time

---

# 16. Devices

Hiển thị

```text
Browser

OS

IP

Last Login

Trusted
```

Cho phép

```text
Revoke Device
```

---

# 17. Bulk Actions

Cho phép

```text
Activate

Deactivate

Lock

Export

Delete
```

Áp dụng cho nhiều User.

---

# 18. Export

Định dạng

```text
Excel

CSV

PDF
```

Bao gồm

- User List
- Filter hiện tại

---

# 19. Pagination

Mặc định

```text
20 records/page
```

Tùy chọn

```text
20

50

100
```

---

# 20. Audit Log

Ghi nhận

```text
Create User

Edit User

Delete User

Role Change

Status Change

Password Reset

Device Revoke
```

---

# 21. API Integration

```text
GET /admin/users

GET /admin/users/{id}

POST /admin/users

PATCH /admin/users/{id}

PATCH /admin/users/{id}/status

PATCH /admin/users/{id}/role

POST /admin/users/{id}/reset-password

DELETE /admin/users/{id}
```

---

# 22. Component Tree

```text
UserManagementPage

↓

FilterBar

↓

SearchBox

↓

UserTable

↓

Pagination

↓

UserDetailDrawer

↓

EditDialog

↓

ConfirmationDialog
```

---

# 23. Performance

User List

```text
<200ms
```

Search

```text
<100ms
```

Export

```text
<5s
```

---

# 24. UX Guidelines

✓ Tìm kiếm theo thời gian thực.

✓ Hiển thị trạng thái bằng màu sắc.

✓ Xác nhận trước khi xóa hoặc khóa.

✓ Hỗ trợ thao tác hàng loạt.

✓ Không mất bộ lọc khi quay lại danh sách.

---

# 25. Test Cases

✓ Search User.

✓ Filter User.

✓ Create User.

✓ Edit User.

✓ Lock User.

✓ Unlock User.

✓ Reset Password.

✓ Export Excel.

✓ Bulk Action.

---

# 26. Acceptance Criteria

✓ CRUD hoạt động.

✓ Search & Filter chính xác.

✓ Export thành công.

✓ Audit Log đầy đủ.

✓ Bulk Actions hoạt động.

✓ RBAC được áp dụng.

---

# 27. Related Documents

ADM-002 Authentication

ADM-014 Role Management

ADM-015 Audit Log

API-004 User API

---

# 28. Summary

User Management là module quản lý tài khoản trung tâm của BusZ Admin, cho phép quản trị viên thực hiện đầy đủ các thao tác CRUD, quản lý vai trò, trạng thái, lịch sử hoạt động và thiết bị đăng nhập. Mọi thao tác đều được ghi nhận trong Audit Log để đảm bảo tính minh bạch và bảo mật.