# Compliance

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

DevOps & Cloud

Document ID

OPS-019

Priority

High

Version

1.0

---

# 1. Purpose

Compliance định nghĩa các yêu cầu về tuân thủ pháp lý, bảo mật và quản trị dữ liệu của hệ thống BusZ.

Mục tiêu

- Regulatory Compliance
- Data Privacy
- Information Security
- Risk Management
- Audit Readiness

---

# 2. Compliance Framework

BusZ tham chiếu các tiêu chuẩn

```text
ISO/IEC 27001

OWASP ASVS

OWASP Top 10

PCI DSS (Payment)

GDPR Principles

PDPA Principles

SOC 2 (Future)
```

---

# 3. Data Classification

Dữ liệu được phân loại

```text
Public

Internal

Confidential

Restricted
```

Ví dụ

Public

```text
Routes

Bus Companies

Promotions
```

Restricted

```text
Passwords

Payment Tokens

JWT Secrets
```

---

# 4. Personal Data Protection

Thông tin cá nhân

```text
Full Name

Email

Phone Number

Identity Number

Address

Booking History
```

Yêu cầu

```text
Encryption

Access Control

Audit Logging
```

---

# 5. Payment Compliance

Không lưu

```text
CVV

Card PIN

Full Card Number
```

Lưu

```text
Payment Reference

Transaction ID

Gateway Status
```

Thanh toán thông qua

```text
VNPay

MoMo

Stripe

ZaloPay
```

---

# 6. Authentication Compliance

Yêu cầu

```text
Password Hashing

MFA

Session Timeout

Token Rotation

Password Complexity
```

---

# 7. Data Retention

Booking

```text
7 Years
```

Audit Logs

```text
7 Years
```

Application Logs

```text
90 Days
```

Security Logs

```text
2 Years
```

Backup

```text
Theo Backup Policy
```

---

# 8. User Consent

Thu thập

```text
Privacy Policy

Terms of Service

Marketing Consent

Cookie Consent
```

Lưu

```text
Timestamp

Version

IP

Consent Status
```

---

# 9. Access Control

Áp dụng

```text
RBAC

Least Privilege

Need-to-Know

Approval Workflow
```

---

# 10. Audit & Evidence

Lưu trữ

```text
Audit Logs

Access Logs

Deployment Logs

Security Events

Incident Reports
```

Phục vụ kiểm toán.

---

# 11. Vendor Management

Đánh giá

```text
Payment Providers

Cloud Providers

Email Providers

SMS Providers

Storage Providers
```

Kiểm tra

```text
Security

Availability

Compliance
```

---

# 12. Compliance Monitoring

Theo dõi

```text
Expired Certificates

Security Findings

Audit Issues

Policy Violations

Access Violations
```

---

# 13. Risk Assessment

Đánh giá

```text
Security Risk

Operational Risk

Data Privacy Risk

Compliance Risk

Third-party Risk
```

Chu kỳ

```text
Every 6 Months
```

---

# 14. Compliance Review

Thực hiện

```text
Quarterly Review

Annual Review

Policy Update

Training
```

---

# 15. Employee Responsibilities

Nhân viên phải

```text
Protect Sensitive Data

Use MFA

Follow Security Policy

Report Incidents

Complete Security Training
```

---

# 16. Compliance Dashboard

Hiển thị

```text
Compliance Score

Audit Findings

Open Risks

Policy Violations

Training Completion
```

---

# 17. Documentation

Duy trì

```text
Security Policy

Privacy Policy

Data Retention Policy

Incident Response Plan

Business Continuity Plan
```

---

# 18. Continuous Improvement

Thực hiện

```text
Lessons Learned

Policy Updates

Control Improvements

Automation

Regular Audits
```

---

# 19. Performance Targets

Critical Findings

```text
0 Open
```

High Risk Findings

```text
Resolved <30 Days
```

Policy Review

```text
100% Annual
```

---

# 20. Acceptance Criteria

✓ RBAC hoạt động.

✓ Audit Logs đầy đủ.

✓ Dữ liệu nhạy cảm được bảo vệ.

✓ Chính sách lưu trữ dữ liệu được áp dụng.

✓ Vendor được đánh giá.

✓ Compliance Review được thực hiện định kỳ.

---

# 21. Related Documents

OPS-008 Security

OPS-009 Backup & Recovery

OPS-018 Incident Response

OPS-020 Runbook

ADM-015 Audit Log

---

# 22. Summary

Compliance của BusZ thiết lập khung quản trị và tuân thủ dựa trên các tiêu chuẩn bảo mật và quyền riêng tư phổ biến. Hệ thống áp dụng phân loại dữ liệu, kiểm soát truy cập, lưu trữ bằng chứng kiểm toán, quản lý nhà cung cấp và đánh giá rủi ro định kỳ nhằm đáp ứng yêu cầu pháp lý, tăng cường bảo mật và tạo nền tảng cho việc hợp tác với các đối tác doanh nghiệp trong tương lai.