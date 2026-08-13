# Secrets Management

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

DevOps & Cloud

Document ID

OPS-014

Priority

Critical

Version

1.0

---

# 1. Purpose

Secrets Management định nghĩa chiến lược quản lý toàn bộ thông tin nhạy cảm (Secrets) trong hệ thống BusZ.

Mục tiêu

- Secure Secret Storage
- Secret Rotation
- Least Privilege Access
- Auditability
- Zero Hard-coded Secrets

---

# 2. Secrets Architecture

```text
Application

↓

Secret Provider

↓

Encrypted Secret Store

↓

Application Runtime
```

Secrets không được lưu trực tiếp trong source code hoặc Docker Image.

---

# 3. Secret Categories

```text
Database Credentials

JWT Secret

Refresh Token Secret

SMTP Password

Payment Gateway Keys

Cloud Storage Keys

Supabase Keys

Firebase Credentials

API Tokens

Encryption Keys
```

---

# 4. Secret Providers

Ưu tiên

```text
AWS Secrets Manager

HashiCorp Vault

Azure Key Vault

Google Secret Manager
```

Development

```text
.env.local
```

---

# 5. Secret Access Flow

```text
Application Start

↓

Authenticate

↓

Read Secret

↓

Decrypt

↓

Inject into Runtime
```

Không lưu vào log hoặc cache.

---

# 6. Environment Variables

Ví dụ

```text
DATABASE_URL

REDIS_URL

JWT_SECRET

JWT_REFRESH_SECRET

SMTP_PASSWORD

SUPABASE_URL

SUPABASE_ANON_KEY

VNPAY_SECRET

MOMO_SECRET

STRIPE_SECRET
```

Không commit `.env` lên Git.

---

# 7. Kubernetes Secrets

Sử dụng

```text
Secret

↓

Mount as Volume

hoặc

Inject as Environment Variable
```

Không sử dụng ConfigMap cho dữ liệu nhạy cảm.

---

# 8. Secret Encryption

At Rest

```text
AES-256
```

In Transit

```text
TLS 1.3
```

---

# 9. Secret Rotation

Định kỳ

```text
JWT Secret

90 Days

Database Password

180 Days

API Keys

90 Days

SMTP Password

180 Days
```

Khẩn cấp

```text
Immediate Rotation
```

---

# 10. Access Control

Nguyên tắc

```text
Least Privilege
```

Quyền

```text
Read

Rotate

Delete

Audit
```

---

# 11. Secret Auditing

Ghi nhận

```text
Read Secret

Update Secret

Rotate Secret

Delete Secret

Failed Access
```

Bao gồm

```text
User

Time

IP

Service
```

---

# 12. Emergency Rotation

Khi

```text
Secret Leak

Credential Theft

Compromised Server

Security Incident
```

Flow

```text
Rotate Secret

↓

Restart Services

↓

Verify

↓

Audit
```

---

# 13. CI/CD Integration

GitHub Actions

↓

```text
GitHub Secrets
```

Deploy

↓

Inject Secrets

↓

Runtime

Không ghi Secret vào Pipeline Logs.

---

# 14. Secret Validation

Kiểm tra

```text
Expired Secret

Unused Secret

Duplicate Secret

Weak Secret
```

---

# 15. Secret Backup

Backup

```text
Encrypted Backup

Version History

Recovery Procedure
```

---

# 16. Secret Dashboard

Hiển thị

```text
Total Secrets

Expired Secrets

Rotation Schedule

Last Rotation

Access History
```

---

# 17. Security Best Practices

✓ Không Hard-code Secret.

✓ Không ghi Secret vào Log.

✓ Không gửi Secret qua Email.

✓ Không lưu Secret trong Docker Image.

✓ Sử dụng Secret Rotation.

✓ Bật Audit Logging.

---

# 18. Monitoring

Theo dõi

```text
Failed Secret Access

Expired Secrets

Secret Rotation

Unauthorized Access
```

---

# 19. Performance Targets

Secret Read

```text
<100ms
```

Secret Rotation

```text
<5 Minutes
```

Secret Injection

```text
Application Startup Only
```

---

# 20. Acceptance Criteria

✓ Secrets được mã hóa.

✓ Không Hard-code.

✓ Rotation hoạt động.

✓ Audit đầy đủ.

✓ CI/CD tích hợp.

✓ Least Privilege được áp dụng.

---

# 21. Related Documents

OPS-008 Security

OPS-015 Network Architecture

OPS-018 Incident Response

ADM-013 System Settings

---

# 22. Summary

Secrets Management của BusZ đảm bảo tất cả thông tin nhạy cảm được lưu trữ an toàn trong các dịch vụ quản lý bí mật chuyên dụng, được mã hóa, kiểm soát quyền truy cập và xoay vòng định kỳ. Hệ thống tích hợp với Kubernetes và CI/CD, đồng thời ghi nhận đầy đủ lịch sử truy cập và thay đổi để đáp ứng yêu cầu bảo mật trong môi trường Production.