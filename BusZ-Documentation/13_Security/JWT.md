# JWT

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Security

Document ID

SEC-004

Priority

Critical

Version

1.0

---

# 1. Purpose

JWT (JSON Web Token) định nghĩa cơ chế xác thực không trạng thái (Stateless Authentication) của BusZ nhằm bảo vệ API, hỗ trợ Web và Mobile, đồng thời đảm bảo khả năng mở rộng và hiệu năng cao.

Mục tiêu

- Stateless Authentication
- Secure API Access
- Token-based Security
- Session Management
- Multi-device Support

---

# 2. Objectives

```text
Authentication

Authorization

Session Management

Token Rotation

API Security
```

---

# 3. JWT Architecture

```text
User

↓

Login

↓

Authentication Service

↓

Access Token

+

Refresh Token

↓

Protected APIs
```

---

# 4. Token Types

```text
Access Token

Refresh Token

Verification Token

Password Reset Token

Invitation Token
```

---

# 5. Authentication Flow

```text
Login

↓

Verify Credentials

↓

Generate Access Token

↓

Generate Refresh Token

↓

Return Tokens

↓

API Access
```

---

# 6. Token Lifecycle

```text
Login

↓

Issue Access Token

↓

API Requests

↓

Access Token Expired

↓

Refresh Token

↓

New Access Token
```

---

# 7. JWT Claims

```text
sub

User ID

email

role

permissions

companyId

deviceId

iat

exp

jti
```

---

# 8. Token Expiration

```text
Access Token

15 Minutes

Refresh Token

30 Days

Password Reset

15 Minutes

Email Verification

24 Hours
```

---

# 9. Refresh Token Rotation

```text
Refresh Token

↓

Validate

↓

Generate New Refresh Token

↓

Revoke Old Token

↓

Store New Token
```

---

# 10. Token Revocation

Thu hồi khi

```text
Logout

Password Change

Account Locked

Suspicious Login

Admin Force Logout
```

---

# 11. Storage Strategy

Flutter

```text
Secure Storage

Encrypted Storage
```

Web

```text
HttpOnly Cookie

Secure Cookie

SameSite
```

Không lưu

```text
LocalStorage (Production)

SessionStorage (Sensitive Token)
```

---

# 12. JWT Validation

Kiểm tra

```text
Signature

Expiration

Issuer

Audience

JTI

Device
```

---

# 13. API Middleware

```text
Incoming Request

↓

Extract JWT

↓

Verify Signature

↓

Validate Claims

↓

Load User Context

↓

Permission Check

↓

Controller
```

---

# 14. Security Best Practices

```text
Short-lived Access Token

Refresh Token Rotation

HTTPS Only

HttpOnly Cookie

Replay Protection
```

---

# 15. Blacklist Strategy

```text
Redis

Revoked Token List

Logout List

Compromised Token
```

---

# 16. Audit Logging

Ghi nhận

```text
Login

Refresh

Logout

Token Expired

Token Revoked

Authentication Failure
```

---

# 17. Performance Targets

```text
JWT Validation

<5 ms

Token Generation

<20 ms

Refresh

<100 ms

Availability

99.99%
```

---

# 18. Security Controls

```text
RS256 Signing

Key Rotation

Replay Protection

Device Validation

Rate Limiting

Secret Manager
```

---

# 19. Acceptance Criteria

✓ Access Token

✓ Refresh Token

✓ Rotation

✓ Revocation

✓ Middleware

✓ Audit Logging

---

# 20. Related Documents

Authentication

Authorization

Encryption

Rate Limiting

API Security

---

# 21. Summary

BusZ sử dụng JWT kết hợp Refresh Token Rotation để triển khai cơ chế xác thực Stateless hiện đại. Hệ thống hỗ trợ xác thực đa thiết bị, thu hồi token, kiểm tra chữ ký số và quản lý vòng đời token nhằm đảm bảo an toàn cho toàn bộ API của Web và Mobile theo tiêu chuẩn enterprise.