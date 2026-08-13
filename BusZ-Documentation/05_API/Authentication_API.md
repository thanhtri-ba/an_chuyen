# Authentication API

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Authentication

Document ID

API-001

Priority

Critical

Version

1.0

---

# 1. Purpose

Authentication API cung cấp các chức năng xác thực và quản lý phiên đăng nhập cho toàn bộ hệ thống BusZ.

Hỗ trợ

- Register
- Login
- Logout
- Refresh Token
- Forgot Password
- Reset Password
- Change Password
- Verify Email
- Verify Phone
- Device Management

---

# 2. API Overview

```text
Mobile App

Web App

Admin Portal

↓

Authentication API

↓

Authentication Service

↓

JWT Service

↓

PostgreSQL

↓

Notification Service
```

---

# 3. Authentication Flow

```text
User

↓

Register

↓

Verify Email / OTP

↓

Login

↓

JWT Access Token

↓

Protected APIs

↓

Refresh Token

↓

Logout
```

---

# 4. Authentication Methods

```text
Email + Password

Phone + OTP

Google OAuth

Apple Sign In

Facebook Login (Future)
```

---

# 5. API Endpoints

```text
POST /auth/register

POST /auth/login

POST /auth/logout

POST /auth/refresh-token

POST /auth/forgot-password

POST /auth/reset-password

POST /auth/change-password

POST /auth/send-otp

POST /auth/verify-otp

GET /auth/profile
```

---

# 6. Register

Endpoint

```http
POST /api/v1/auth/register
```

Description

Đăng ký tài khoản mới.

Authentication

```text
Public
```

---

# 7. Request Body

```json
{
    "fullName":"Nguyen Van A",
    "email":"user@gmail.com",
    "phone":"0909123456",
    "password":"Password@123"
}
```

---

# 8. Success Response

```json
{
    "success":true,
    "message":"Register successfully",
    "data":{
        "userId":"USR001",
        "status":"PENDING_VERIFY"
    }
}
```

---

# 9. Login

Endpoint

```http
POST /api/v1/auth/login
```

Request

```json
{
    "email":"user@gmail.com",
    "password":"Password@123"
}
```

Success

```json
{
    "success":true,
    "message":"Login successfully",
    "data":{
        "accessToken":"JWT_ACCESS_TOKEN",
        "refreshToken":"JWT_REFRESH_TOKEN",
        "expiresIn":3600
    }
}
```

---

# 10. Logout

Endpoint

```http
POST /api/v1/auth/logout
```

Description

Đăng xuất khỏi hệ thống.

Authentication

```text
Required
```

---

# 11. Refresh Token

Endpoint

```http
POST /api/v1/auth/refresh-token
```

Description

Tạo Access Token mới.

---

# 12. Forgot Password

Endpoint

```http
POST /api/v1/auth/forgot-password
```

Description

Gửi Email hoặc OTP đặt lại mật khẩu.

---

# 13. Reset Password

Endpoint

```http
POST /api/v1/auth/reset-password
```

Description

Đặt lại mật khẩu.

---

# 14. Change Password

Endpoint

```http
POST /api/v1/auth/change-password
```

Authentication

```text
Required
```

---

# 15. Verify Email

Endpoint

```http
POST /api/v1/auth/verify-email
```

Description

Xác thực Email sau khi đăng ký.

---

# 16. Verify OTP

Endpoint

```http
POST /api/v1/auth/verify-otp
```

Description

Xác thực mã OTP.

---

# 17. JWT Token Structure

```text
Header

Payload

Signature
```

Payload

```text
User ID

Role

Issued At

Expired At

Device ID
```

---

# 18. User Roles

```text
Passenger

Driver

Operator

Admin

Super Admin
```

---

# 19. Session Management

```text
Single Device

Multiple Device

Remember Login

Force Logout

Session Expiration
```

---

# 20. Password Policy

```text
Minimum 8 characters

Maximum 50 characters

Uppercase required

Lowercase required

Number required

Special character required
```

---

# 21. OTP Rules

```text
Length

6 Digits

Expire

5 Minutes

Retry

Maximum 5 Attempts
```

---

# 22. Security

```text
JWT Authentication

HTTPS Only

Password Hash (Argon2)

Rate Limiting

Refresh Token Rotation

CSRF Protection

XSS Protection
```

---

# 23. Validation Rules

```text
Email must be unique

Phone must be unique

Password policy validation

OTP validation

Token validation

Device validation
```

---

# 24. Error Codes

```text
INVALID_EMAIL

INVALID_PASSWORD

EMAIL_ALREADY_EXISTS

PHONE_ALREADY_EXISTS

USER_NOT_FOUND

ACCOUNT_DISABLED

OTP_EXPIRED

OTP_INVALID

TOKEN_INVALID

TOKEN_EXPIRED

UNAUTHORIZED
```

---

# 25. Database Tables

```text
Users

RefreshTokens

OTPVerification

LoginHistory

Devices

AuditLogs
```

---

# 26. Audit Logs

Theo dõi

```text
Register

Login

Logout

Failed Login

Password Change

Password Reset

Token Refresh

Device Login
```

---

# 27. Notification

Hệ thống gửi

```text
Welcome Email

OTP SMS

Password Reset Email

Security Alert

Login Alert
```

---

# 28. Rate Limiting

```text
Register

10 Requests / Hour

Login

20 Requests / Minute

OTP

5 Requests / Hour

Forgot Password

5 Requests / Hour
```

---

# 29. Performance Targets

```text
Login

<500 ms

Register

<1 Second

OTP Verify

<300 ms

Refresh Token

<300 ms
```

---

# 30. Acceptance Criteria

✓ Đăng ký thành công

✓ Đăng nhập thành công

✓ JWT hợp lệ

✓ Refresh Token hoạt động

✓ OTP xác thực thành công

✓ Đổi mật khẩu thành công

✓ Audit Log được lưu

✓ Notification được gửi

---

# 31. Related Documents

Authentication Business Rules

User API

Notification API

Security Architecture

Database Schema

OpenAPI Specification

---

# 32. Summary

Authentication API là thành phần chịu trách nhiệm xác thực, phân quyền và quản lý phiên đăng nhập của toàn bộ hệ thống BusZ. API đảm bảo tính bảo mật, khả năng mở rộng và hỗ trợ nhiều phương thức đăng nhập hiện đại, đáp ứng yêu cầu của ứng dụng Mobile, Web và Admin Portal.