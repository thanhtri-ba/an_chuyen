# Authentication

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Admin Web

Document ID

ADM-002

Priority

Critical

Version

1.0

---

# 1. Purpose

Authentication đảm bảo chỉ người dùng được ủy quyền mới có thể truy cập hệ thống quản trị BusZ.

Mục tiêu:

- Bảo mật tài khoản quản trị
- Quản lý phiên đăng nhập
- Phân quyền theo vai trò
- Ghi nhận Audit Log

---

# 2. Authentication Flow

```text
Admin Login

↓

Validate Credentials

↓

Optional MFA

↓

Generate JWT

↓

Generate Refresh Token

↓

Dashboard
```

---

# 3. Login Screen

Fields

```text
Email

Password
```

Buttons

```text
Login

Forgot Password
```

Options

```text
Remember Me

Show Password
```

---

# 4. Password Policy

Yêu cầu

```text
Minimum 8 Characters

1 Uppercase

1 Lowercase

1 Number

1 Special Character
```

Không được trùng với

```text
Last 5 Passwords
```

---

# 5. Multi-Factor Authentication (MFA)

Phương thức

```text
Authenticator App

Email OTP
```

OTP

```text
6 digits
```

Thời gian hiệu lực

```text
5 minutes
```

---

# 6. Session Management

Sau khi đăng nhập

↓

Sinh

```text
Access Token

Refresh Token
```

Access Token

```text
15 minutes
```

Refresh Token

```text
7 days
```

---

# 7. Remember Me

Nếu bật

↓

Gia hạn Refresh Token

```text
30 days
```

---

# 8. Account Lockout

Sai mật khẩu

```text
5 lần
```

↓

Khóa tài khoản

```text
15 minutes
```

Gửi Email thông báo.

---

# 9. Forgot Password

Flow

```text
Enter Email

↓

Receive Reset Link

↓

Reset Password

↓

Login
```

---

# 10. Reset Password

Fields

```text
New Password

Confirm Password
```

Sau khi đổi mật khẩu

↓

Đăng xuất tất cả thiết bị.

---

# 11. Trusted Devices

Lưu

```text
Browser

Operating System

IP Address

Last Login

Location (Approximate)
```

Cho phép

```text
Revoke Device
```

---

# 12. Logout

Flow

```text
Logout

↓

Invalidate Refresh Token

↓

Clear Session

↓

Login Screen
```

---

# 13. RBAC

Vai trò

```text
Super Admin

Company Admin

Operator

Support

Finance
```

Mỗi vai trò có Permission riêng.

---

# 14. Permission Check

Ví dụ

```text
User Management

↓

Permission?

↓

Allow

↓

Open Screen
```

Nếu không có quyền

↓

```text
403 Access Denied
```

---

# 15. Authentication States

```text
Unauthenticated

Authenticating

Authenticated

MFA Required

Session Expired

Locked

Error
```

---

# 16. Error Messages

Ví dụ

```text
Invalid Email or Password

Account Locked

Session Expired

MFA Code Invalid

Permission Denied
```

---

# 17. Audit Log

Ghi nhận

```text
Login Success

Login Failed

Logout

Password Changed

MFA Enabled

Device Revoked
```

---

# 18. API Integration

```text
POST /admin/auth/login

POST /admin/auth/logout

POST /admin/auth/refresh

POST /admin/auth/forgot-password

POST /admin/auth/reset-password

POST /admin/auth/mfa/verify
```

---

# 19. Component Tree

```text
LoginPage

↓

LoginForm

↓

MfaDialog

↓

ForgotPasswordDialog

↓

SessionExpiredDialog
```

---

# 20. Security Best Practices

✓ HTTPS Only.

✓ HttpOnly Cookie.

✓ Secure Cookie.

✓ CSRF Protection.

✓ XSS Protection.

✓ Rate Limiting.

✓ Password Hashing (Argon2/Bcrypt).

✓ MFA cho Super Admin.

---

# 21. Performance

Login Response

```text
<300ms
```

Token Refresh

```text
<100ms
```

MFA Verification

```text
<200ms
```

---

# 22. Test Cases

✓ Login Success.

✓ Wrong Password.

✓ Locked Account.

✓ Forgot Password.

✓ Reset Password.

✓ MFA Success.

✓ Session Expired.

✓ Logout.

---

# 23. Acceptance Criteria

✓ JWT hoạt động.

✓ Refresh Token hoạt động.

✓ MFA hoạt động.

✓ RBAC hoạt động.

✓ Audit Log đầy đủ.

✓ Session Management chính xác.

---

# 24. Related Documents

ADM-001 Admin Architecture

ADM-014 Role Management

API-003 Authentication API

---

# 25. Summary

Authentication của Admin Web BusZ sử dụng JWT kết hợp Refresh Token và MFA để bảo vệ tài khoản quản trị. Hệ thống hỗ trợ RBAC, quản lý phiên đăng nhập, Trusted Devices và Audit Log nhằm đảm bảo an toàn cho toàn bộ nền tảng quản trị.