# User Roles

**Project:** BusZ - Intercity Bus Ticket Booking Platform

**Version:** 1.0

**Document Type:** Business - User Roles

**Status:** Draft

---

# 1. Purpose

Tài liệu này mô tả toàn bộ vai trò (Roles) trong hệ thống BusZ.

Mỗi Role có:

- Chức năng
- Quyền hạn
- Giới hạn
- Quy trình làm việc
- API được phép sử dụng
- Database liên quan

Tài liệu này là cơ sở để thiết kế:

- Authentication
- Authorization
- Database
- Backend
- Admin Website

---

# 2. System Roles

BusZ bao gồm các vai trò sau:

```text
Guest

↓

Customer

↓

Bus Company Staff

↓

Bus Company Manager

↓

Administrator

↓

Super Administrator
```

---

# 3. Guest

Guest là người chưa đăng nhập.

Guest có thể:

- Xem Home
- Tìm chuyến xe
- Xem danh sách chuyến
- Xem chi tiết chuyến
- Xem nhà xe
- Xem giá vé

Guest KHÔNG được:

- Đặt vé
- Thanh toán
- Xem lịch sử
- Đánh giá
- Hủy vé

---

# 4. Customer

Customer là người sử dụng ứng dụng.

Customer có thể:

Authentication

- Register
- Login
- Logout
- Forgot Password

Booking

- Search Trip
- Select Trip
- Select Seat
- Create Booking
- Payment
- Download Ticket

Profile

- Edit Profile
- Saved Contact
- Saved Passenger

History

- Booking History
- Ticket History

Review

- Rate Trip
- Review Bus Company

Notification

- View Notification

Customer KHÔNG được:

- Quản lý chuyến xe
- Quản lý nhà xe
- Quản lý hệ thống

---

# 5. Bus Company Staff

Nhân viên nhà xe.

Có thể:

- Check Ticket
- Verify QR Code
- Check Passenger
- View Trip
- View Seat Status
- Update Boarding Status

Không được:

- Xóa chuyến
- Quản lý User
- Quản lý Payment

---

# 6. Bus Company Manager

Quản lý nhà xe.

Có thể:

Bus

- Add Bus
- Update Bus
- Delete Bus

Trip

- Create Trip
- Update Trip
- Cancel Trip

Route

- Manage Route

Seat

- Configure Seat Layout

Price

- Update Ticket Price

Report

- View Revenue

---

# 7. Administrator

Administrator quản lý toàn bộ hệ thống.

Có thể:

User Management

Bus Company

Trips

Routes

Bookings

Payments

Reviews

Promotions

Notifications

Reports

System Settings

Administrator không được:

- Thay đổi Super Admin

---

# 8. Super Administrator

Super Admin có toàn quyền.

Có thể:

- Tạo Admin
- Xóa Admin
- Quản lý Permission
- Backup Database
- Restore Database
- Server Configuration
- Environment Configuration

---

# 9. Permission Matrix

| Permission | Guest | Customer | Staff | Manager | Admin | Super Admin |
|------------|-------|----------|--------|----------|--------|-------------|
| Search Trip | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View Trip | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Booking | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Payment | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Review | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ |
| Manage Trip | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Manage Bus | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Manage User | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Manage Admin | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

# 10. Authentication Flow

```mermaid
flowchart TD

Guest

↓

Register

↓

Login

↓

JWT Token

↓

Customer

↓

Logout

↓

Guest
```

---

# 11. Authorization Flow

```mermaid
flowchart LR

User

↓

JWT

↓

Role

↓

Permission

↓

API

↓

Response
```

---

# 12. Related Database

Các bảng liên quan:

users

roles

permissions

user_roles

role_permissions

refresh_tokens

activity_logs

---

# 13. Related APIs

Authentication

POST /auth/register

POST /auth/login

POST /auth/logout

POST /auth/refresh

User

GET /users/me

PUT /users/me

Admin

GET /admin/users

PUT /admin/users/{id}

DELETE /admin/users/{id}

---

# 14. Business Rules

Một Email chỉ thuộc về một User.

Một User có thể có nhiều Booking.

Một User có thể lưu nhiều Contact.

Một User có thể lưu nhiều Passenger.

Customer chỉ được chỉnh sửa Profile của chính mình.

Manager chỉ được quản lý dữ liệu của nhà xe mình.

Admin quản lý toàn bộ hệ thống.

Super Admin có toàn quyền.

---

# 15. Future Roles

Trong tương lai có thể bổ sung:

Support Agent

Call Center

Finance

Marketing

Driver

Partner

Inspector

---

# 16. Summary

User Roles là tài liệu định nghĩa quyền hạn của toàn bộ người dùng trong hệ thống.

Database, JWT Authentication, Permission Middleware và Admin Website phải tuân theo tài liệu này để đảm bảo tính nhất quán của hệ thống.