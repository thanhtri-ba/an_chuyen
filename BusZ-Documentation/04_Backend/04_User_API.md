# User API

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Backend API

Document ID

API-004

Priority

Critical

Version

1.0

---

# 1. Purpose

User API quản lý thông tin tài khoản người dùng sau khi đăng nhập.

Bao gồm:

- Thông tin cá nhân
- Cập nhật tài khoản
- Quản lý thiết bị
- Quản lý phiên đăng nhập
- Xóa tài khoản
- Đổi Email
- Đổi số điện thoại

---

# 2. Authentication

Toàn bộ API yêu cầu

```
Bearer JWT
```

---

# 3. Endpoints

| Method | Endpoint | Permission |
|----------|----------------------|------------|
| GET | /users/me | User |
| PATCH | /users/me | User |
| DELETE | /users/me | User |
| GET | /users/sessions | User |
| DELETE | /users/sessions/{id} | User |
| GET | /users/devices | User |
| DELETE | /users/devices/{id} | User |
| POST | /users/change-email | User |
| POST | /users/change-phone | User |

---

# 4. Get Current User

Endpoint

```
GET /users/me
```

Response

```json
{
  "id":"uuid",
  "email":"user@gmail.com",
  "phone":"0912345678",
  "status":"ACTIVE",
  "role":"CUSTOMER",
  "createdAt":"2026-07-04T10:00:00Z"
}
```

---

# 5. Update Current User

Endpoint

```
PATCH /users/me
```

Request

```json
{
  "fullName":"Nguyen Van A",
  "avatar":"https://...",
  "gender":"MALE",
  "dateOfBirth":"2006-03-14"
}
```

Response

```json
{
  "success":true,
  "message":"Profile updated successfully."
}
```

Business Rules

- Không được sửa Email tại API này.
- Không được sửa Role.
- Không được sửa Status.

---

# 6. Delete Account

Endpoint

```
DELETE /users/me
```

Business Flow

```
Confirm Password

↓

Soft Delete

↓

Logout All Devices

↓

Audit Log
```

Không xóa cứng dữ liệu.

---

# 7. User Sessions

Endpoint

```
GET /users/sessions
```

Response

```json
[
  {
    "id":"...",
    "device":"Samsung S25",
    "ip":"203.xxx.xxx.xxx",
    "lastActivity":"2026-07-04T10:00:00Z",
    "current":true
  }
]
```

---

# 8. Logout Device

Endpoint

```
DELETE /users/sessions/{id}
```

Business Rules

- Chỉ được xóa Session của chính mình.
- Session hiện tại cần xác thực lại trước khi xóa.

---

# 9. User Devices

Endpoint

```
GET /users/devices
```

Hiển thị

- Mobile
- Tablet
- Web Browser

---

# 10. Remove Device

Endpoint

```
DELETE /users/devices/{id}
```

Rules

- Thu hồi Refresh Token.
- Xóa Push Token.
- Ghi Audit.

---

# 11. Change Email

Endpoint

```
POST /users/change-email
```

Request

```json
{
  "newEmail":"new@gmail.com",
  "password":"Password123!"
}
```

Business Flow

```
Verify Password

↓

Check Email

↓

Send Verification

↓

Verify Email

↓

Update Email
```

---

# 12. Change Phone

Endpoint

```
POST /users/change-phone
```

Request

```json
{
  "phone":"0987654321",
  "otp":"123456"
}
```

Rules

- OTP hợp lệ.
- Phone chưa tồn tại.

---

# 13. Business Rules

USER-BR-001

Không được sửa Role.

USER-BR-002

Không được sửa Status.

USER-BR-003

Email mới phải Verify.

USER-BR-004

Phone phải Unique.

USER-BR-005

Soft Delete Account.

USER-BR-006

Một User có nhiều Session.

---

# 14. Validation Rules

Avatar

HTTPS URL

Email

RFC5322

Phone

E.164

Birthday

Không lớn hơn ngày hiện tại.

---

# 15. Error Codes

| Code | Description |
|------|-------------|
| USER_001 | User Not Found |
| USER_002 | Email Already Exists |
| USER_003 | Phone Already Exists |
| USER_004 | Invalid Password |
| USER_005 | Invalid OTP |
| USER_006 | Session Not Found |

---

# 16. Security

JWT Required

Password Confirmation

Audit Log

Session Validation

Rate Limit

---

# 17. API Flow

```
Flutter

↓

JWT

↓

User Controller

↓

User Service

↓

Prisma

↓

PostgreSQL
```

---

# 18. Performance

Response

```
<50ms
```

Session Query

```
<20ms
```

Device Query

```
<20ms
```

---

# 19. Test Cases

✓ Update Profile.

✓ Invalid Email.

✓ Duplicate Phone.

✓ Delete Account.

✓ Logout Device.

✓ Change Email.

✓ Change Phone.

---

# 20. Acceptance Criteria

✓ JWT Required.

✓ Validation thành công.

✓ Soft Delete.

✓ Audit Log.

✓ Prisma Generate thành công.

---

# 21. Related Documents

API-003 Authentication

API-005 Profile API

DB-005 Users

DB-016 Audit Logs

---

# 22. Summary

User API quản lý tài khoản của người dùng sau khi xác thực, bao gồm cập nhật thông tin, quản lý phiên đăng nhập, thiết bị, thay đổi email, số điện thoại và xóa tài khoản theo cơ chế Soft Delete. Toàn bộ API được bảo vệ bằng JWT và ghi nhận Audit Log cho các thao tác quan trọng.