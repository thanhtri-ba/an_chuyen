# Authentication

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Security

Document ID

SEC-001

Priority

Critical

Version

1.0

---

# 1. Purpose

Authentication định nghĩa cơ chế xác thực người dùng của BusZ nhằm đảm bảo chỉ những người dùng hợp lệ mới có thể truy cập vào hệ thống.

Mục tiêu

- Xác thực an toàn
- Hỗ trợ nhiều phương thức đăng nhập
- Bảo vệ tài khoản
- Hỗ trợ Mobile & Web
- Tuân thủ Security Best Practices

---

# 2. Objectives

```text
Authentication

Identity Verification

Session Management

Account Protection

Secure Login
```

---

# 3. Supported Authentication

```text
Email + Password

Phone + OTP

Google

Apple ID

Facebook (Optional)

Guest Account
```

---

# 4. Authentication Flow

```text
User

↓

Login

↓

Credential Validation

↓

Authentication Service

↓

JWT Generation

↓

Response
```

---

# 5. Registration Flow

```text
Register

↓

Email Verification

↓

Phone Verification (Optional)

↓

Create User

↓

Issue JWT
```

---

# 6. Login Flow

```text
Email

↓

Password

↓

Verify

↓

Generate Access Token

↓

Generate Refresh Token

↓

Login Success
```

---

# 7. Multi-factor Authentication

Có thể hỗ trợ

```text
OTP SMS

Email OTP

Authenticator App

Passkey (Future)
```

---

# 8. Password Policy

```text
Minimum 8 Characters

Uppercase

Lowercase

Number

Special Character

No Common Password
```

---

# 9. Password Storage

```text
Argon2id

or

bcrypt
```

Không bao giờ

```text
Store Plain Password

Encrypt Password

MD5

SHA1
```

---

# 10. Session Management

```text
JWT Access Token

Refresh Token

Device Session

Logout All Devices
```

---

# 11. Account Security

```text
Failed Login Limit

Temporary Lock

Device Tracking

Login History

Suspicious Login Detection
```

---

# 12. Email Verification

```text
Register

↓

Verification Email

↓

Verification Link

↓

Account Activated
```

---

# 13. Password Reset

```text
Forgot Password

↓

OTP / Email Link

↓

Reset Password

↓

Login
```

---

# 14. Device Management

```text
Registered Devices

Last Login

IP Address

Operating System

Browser

Device Name
```

---

# 15. Audit Logging

Ghi nhận

```text
Login

Logout

Failed Login

Password Reset

Account Locked

Device Added
```

---

# 16. Performance Targets

```text
Login

<500 ms

Token Generation

<100 ms

Availability

99.9%
```

---

# 17. Security Controls

```text
HTTPS

TLS 1.3

Rate Limiting

Captcha

CSRF Protection

Replay Protection
```

---

# 18. Acceptance Criteria

✓ Secure Login

✓ Secure Registration

✓ Password Reset

✓ Email Verification

✓ Device Tracking

✓ Audit Logging

---

# 19. Related Documents

Authorization

JWT

Encryption

Rate Limiting

User Management

---

# 20. Summary

Authentication của BusZ cung cấp cơ chế xác thực hiện đại cho Web và Mobile, hỗ trợ Email, OTP và Social Login. Hệ thống sử dụng JWT, Refresh Token và các cơ chế bảo vệ như Device Tracking, Account Locking và Audit Logging nhằm đảm bảo an toàn cho tài khoản người dùng theo tiêu chuẩn enterprise.