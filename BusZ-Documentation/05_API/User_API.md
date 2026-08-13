# User API

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

User Management

Document ID

API-002

Priority

Critical

Version

1.0

---

# 1. Purpose

User API quản lý toàn bộ thông tin tài khoản của hành khách, tài xế, nhà xe và quản trị viên.

Hỗ trợ

- User Profile
- Avatar
- Contact Information
- Saved Passengers
- Saved Addresses
- Favorite Routes
- Preferences
- Account Settings

---

# 2. API Overview

```text
Mobile App

Web App

↓

User API

↓

User Service

↓

PostgreSQL

↓

Notification Service
```

---

# 3. API Endpoints

```text
GET /users/me

PATCH /users/me

PATCH /users/avatar

PATCH /users/password

GET /users/passengers

POST /users/passengers

PATCH /users/passengers/{id}

DELETE /users/passengers/{id}

GET /users/addresses

POST /users/addresses

PATCH /users/addresses/{id}

DELETE /users/addresses/{id}

GET /users/favorites

POST /users/favorites

DELETE /users/favorites/{id}
```

---

# 4. Get User Profile

Endpoint

```http
GET /api/v1/users/me
```

Authentication

```text
Required
```

Description

Lấy thông tin tài khoản hiện tại.

---

# 5. Response

```json
{
  "success": true,
  "data": {
    "userId": "USR001",
    "fullName": "Nguyen Van A",
    "email": "user@gmail.com",
    "phone": "0909123456",
    "gender": "Male",
    "birthday": "2000-01-01",
    "avatar": "https://cdn.busz.vn/avatar/usr001.png"
  }
}
```

---

# 6. Update Profile

Endpoint

```http
PATCH /api/v1/users/me
```

Description

Cập nhật thông tin cá nhân.

Có thể cập nhật

```text
Full Name

Birthday

Gender

Phone

Avatar
```

---

# 7. Change Avatar

Endpoint

```http
PATCH /api/v1/users/avatar
```

Cho phép

```text
JPEG

PNG

WEBP
```

Maximum

```text
5 MB
```

---

# 8. Change Password

Endpoint

```http
PATCH /api/v1/users/password
```

Yêu cầu

```text
Old Password

New Password

Confirm Password
```

---

# 9. Saved Passengers

Mỗi tài khoản có thể lưu

```text
Tên

Số điện thoại

Ngày sinh

Giới tính

CCCD

Quan hệ
```

Tối đa

```text
20 người
```

---

# 10. Saved Addresses

Lưu

```text
Home

Office

Favorite Pickup

Favorite Dropoff
```

---

# 11. Favorite Routes

Cho phép lưu

```text
Ho Chi Minh → Da Lat

Ho Chi Minh → Can Tho

Da Nang → Hue
```

Tối đa

```text
50 tuyến
```

---

# 12. Notification Settings

Cho phép

```text
Push Notification

Email

SMS

Promotion

Trip Reminder

System Notification
```

---

# 13. Language

Hỗ trợ

```text
Vietnamese

English
```

---

# 14. Theme

```text
Light

Dark

System
```

---

# 15. Account Status

```text
ACTIVE

PENDING

SUSPENDED

LOCKED

DELETED
```

---

# 16. Validation Rules

```text
Email Unique

Phone Unique

Avatar <5MB

Birthday < Today

Phone Format

Email Format
```

---

# 17. Security

```text
JWT

RBAC

HTTPS

Avatar Virus Scan

Password Hash
```

---

# 18. Database Tables

```text
Users

PassengerProfiles

Addresses

Favorites

UserSettings

Devices
```

---

# 19. Audit Logs

Theo dõi

```text
Profile Update

Avatar Change

Password Change

Address Update

Passenger Update
```

---

# 20. Error Codes

```text
USER_NOT_FOUND

EMAIL_EXISTS

PHONE_EXISTS

INVALID_IMAGE

PASSWORD_INCORRECT

PASSWORD_WEAK

INVALID_BIRTHDAY

UNAUTHORIZED
```

---

# 21. Performance Targets

```text
Profile

<300 ms

Avatar Upload

<2 Seconds

Update

<500 ms
```

---

# 22. Acceptance Criteria

✓ Hồ sơ hiển thị đúng

✓ Avatar upload thành công

✓ Đổi mật khẩu thành công

✓ Danh sách hành khách lưu đúng

✓ Địa chỉ lưu đúng

✓ Favorite hoạt động

---

# 23. Related Documents

Authentication API

Booking API

Notification API

Database Schema

Security Architecture

---

# 24. Summary

User API quản lý toàn bộ dữ liệu người dùng trong hệ thống BusZ, bao gồm hồ sơ cá nhân, hành khách đã lưu, địa chỉ, cài đặt tài khoản và các tùy chọn cá nhân hóa nhằm nâng cao trải nghiệm sử dụng.