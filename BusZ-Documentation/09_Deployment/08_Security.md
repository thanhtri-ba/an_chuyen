# Security

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

DevOps & Cloud

Document ID

OPS-008

Priority

Critical

Version

1.0

---

# 1. Purpose

Security định nghĩa chiến lược bảo mật toàn diện cho hệ thống BusZ nhằm bảo vệ dữ liệu, người dùng và hạ tầng.

Mục tiêu

- Zero Trust Security
- Defense in Depth
- Least Privilege
- Secure by Default
- Compliance Ready

---

# 2. Security Architecture

```text
Internet

↓

Cloudflare WAF

↓

Load Balancer

↓

API Gateway

↓

Backend Services

↓

Database

↓

Storage
```

---

# 3. Zero Trust Model

Nguyên tắc

```text
Never Trust

↓

Always Verify
```

Áp dụng

```text
User

Device

API

Service

Network
```

---

# 4. Authentication

Hỗ trợ

```text
Email + Password

OAuth2

Google Login

Apple Login

OTP

MFA
```

JWT

```text
Access Token

Refresh Token
```

---

# 5. Authorization

Mô hình

```text
RBAC

+

Data Scope
```

Kiểm tra

```text
Role

Permission

Company Scope

Route Scope
```

---

# 6. API Security

Áp dụng

```text
HTTPS Only

JWT

Rate Limiting

Input Validation

Output Encoding

CORS
```

---

# 7. Network Security

Bảo vệ

```text
Private Subnet

Security Groups

Firewall

Network Policies
```

Không cho phép Database truy cập trực tiếp từ Internet.

---

# 8. WAF & DDoS Protection

Sử dụng

```text
Cloudflare WAF

AWS WAF
```

Ngăn chặn

```text
SQL Injection

XSS

Bot Traffic

DDoS

Brute Force
```

---

# 9. Data Encryption

In Transit

```text
TLS 1.3
```

At Rest

```text
AES-256
```

Áp dụng cho

```text
Database

Storage

Backup
```

---

# 10. Secrets Management

Lưu trữ

```text
AWS Secrets Manager

HashiCorp Vault

GitHub Secrets
```

Không lưu

```text
API Keys

JWT Secret

SMTP Password

Database Password
```

trong source code.

---

# 11. OWASP Top 10 Mitigation

Phòng chống

```text
Broken Access Control

Cryptographic Failures

Injection

Insecure Design

Security Misconfiguration

Vulnerable Components

Authentication Failures

Software Integrity Failures

Logging Failures

SSRF
```

---

# 12. Input Validation

Kiểm tra

```text
Length

Format

Whitelist

Sanitization

Business Rules
```

---

# 13. Rate Limiting

Ví dụ

```text
Login

5 Requests / Minute

API

100 Requests / Minute

Upload

20 Requests / Minute
```

---

# 14. File Security

Kiểm tra

```text
Virus Scan

MIME Type

File Size

Extension

Checksum
```

---

# 15. Database Security

Áp dụng

```text
Least Privilege

Parameterized Query

Connection Encryption

Audit Logging
```

---

# 16. Container Security

Kiểm tra

```text
Image Scan

Non-root User

Read-only File System

Resource Limits
```

---

# 17. Security Monitoring

Theo dõi

```text
Failed Login

Privilege Escalation

Suspicious IP

Unexpected API Usage

Mass Export
```

---

# 18. Incident Response

Nếu phát hiện

↓

```text
Security Alert

↓

Investigate

↓

Contain

↓

Recover

↓

Postmortem
```

---

# 19. Security Tools

```text
Cloudflare

Trivy

OWASP ZAP

Dependabot

CodeQL

Snyk

Fail2Ban
```

---

# 20. Security Checklist

✓ HTTPS bắt buộc.

✓ MFA cho Admin.

✓ JWT Rotation.

✓ Password Hashing (Argon2 hoặc bcrypt).

✓ Secrets Management.

✓ Dependency Scanning.

✓ Audit Log.

---

# 21. Performance Targets

Authentication

```text
<300ms
```

Authorization

```text
<20ms
```

Security Scan

```text
Daily
```

---

# 22. Acceptance Criteria

✓ HTTPS Only.

✓ RBAC hoạt động.

✓ MFA hoạt động.

✓ Secrets được bảo vệ.

✓ OWASP Top 10 được giảm thiểu.

✓ Security Monitoring hoạt động.

---

# 23. Related Documents

OPS-007 Logging

OPS-009 Backup & Recovery

ADM-014 Role Management

ADM-015 Audit Log

---

# 24. Summary

Security của BusZ áp dụng mô hình Zero Trust kết hợp nhiều lớp bảo vệ từ mạng, API, ứng dụng, cơ sở dữ liệu đến hạ tầng. Hệ thống sử dụng HTTPS, RBAC, MFA, WAF, mã hóa dữ liệu, quản lý bí mật và giám sát an ninh để giảm thiểu rủi ro, đáp ứng các tiêu chuẩn bảo mật hiện đại và sẵn sàng cho môi trường Production.