# Runbook

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

DevOps & Cloud

Document ID

OPS-020

Priority

Critical

Version

1.0

---

# 1. Purpose

Runbook là tài liệu hướng dẫn vận hành tiêu chuẩn (Standard Operating Procedures - SOP) dành cho DevOps, SRE và đội vận hành BusZ.

Mục tiêu

- Chuẩn hóa quy trình vận hành
- Giảm thời gian xử lý sự cố
- Hỗ trợ On-call Engineers
- Đảm bảo tính nhất quán
- Dễ đào tạo nhân sự mới

---

# 2. Startup Procedure

Quy trình khởi động

```text
Infrastructure

↓

Database

↓

Redis

↓

Storage

↓

Backend API

↓

Workers

↓

Frontend

↓

Monitoring
```

Xác minh

```text
Health Check

↓

Smoke Test

↓

Traffic Ready
```

---

# 3. Shutdown Procedure

Quy trình dừng hệ thống

```text
Disable Traffic

↓

Stop Frontend

↓

Stop Workers

↓

Stop Backend

↓

Flush Queues

↓

Backup (Nếu cần)

↓

Stop Database
```

---

# 4. Deployment Runbook

Các bước

```text
Verify Branch

↓

Build

↓

Run Tests

↓

Deploy

↓

Health Check

↓

Smoke Test

↓

Monitor

↓

Complete
```

---

# 5. Rollback Runbook

Khi Deployment lỗi

```text
Pause Traffic

↓

Rollback

↓

Restart Pods

↓

Health Check

↓

Verify

↓

Resume Traffic
```

---

# 6. Database Recovery Runbook

```text
Identify Incident

↓

Select Backup

↓

Restore

↓

Replay WAL

↓

Integrity Check

↓

Reconnect Application
```

---

# 7. Kubernetes Recovery Runbook

Khi Pod lỗi

```text
Check Events

↓

Describe Pod

↓

Logs

↓

Restart

↓

Verify
```

Khi Node lỗi

```text
Drain Node

↓

Replace Node

↓

Reschedule Pods
```

---

# 8. Backup Restore Runbook

```text
Select Backup

↓

Validate

↓

Restore

↓

Verify

↓

Audit
```

---

# 9. Certificate Renewal

Theo dõi

```text
SSL Expiry
```

Gia hạn

```text
Let's Encrypt

AWS ACM

Cloudflare SSL
```

Xác minh

```text
HTTPS

Certificate Chain
```

---

# 10. Secret Rotation

```text
Rotate Secret

↓

Update Secret Store

↓

Restart Services

↓

Verify

↓

Audit
```

---

# 11. Incident Response Runbook

```text
Alert

↓

Classify

↓

Assign

↓

Mitigate

↓

Recover

↓

Validate

↓

Postmortem
```

---

# 12. Monitoring Checklist

Kiểm tra

```text
CPU

Memory

Disk

API

Database

Redis

Queue

Storage
```

---

# 13. Daily Operations Checklist

✓ Kiểm tra Dashboard.

✓ Kiểm tra Backup.

✓ Kiểm tra Alerts.

✓ Kiểm tra Error Logs.

✓ Kiểm tra Certificate.

✓ Kiểm tra Disk Usage.

---

# 14. Weekly Operations Checklist

✓ Database Maintenance.

✓ Security Updates.

✓ Review Audit Logs.

✓ Capacity Review.

✓ Backup Restore Test.

---

# 15. Monthly Operations Checklist

✓ Disaster Recovery Test.

✓ Security Scan.

✓ Secret Rotation Review.

✓ Cost Review.

✓ Compliance Review.

✓ Performance Review.

---

# 16. Emergency Contacts

```text
Incident Commander

DevOps Lead

Backend Lead

Database Administrator

Security Officer

Product Owner
```

Thông tin liên hệ được lưu trong hệ thống quản lý nội bộ và luôn được cập nhật.

---

# 17. Escalation Matrix

```text
SEV4

↓

Developer

SEV3

↓

Team Lead

SEV2

↓

DevOps Lead

SEV1

↓

Incident Commander

↓

Engineering Manager
```

---

# 18. Documentation References

```text
Deployment Guide

Rollback Guide

Backup Guide

Security Policy

Architecture Docs

API Documentation
```

---

# 19. Runbook Validation

Định kỳ

```text
Quarterly Review

Annual Update

Simulation Exercise
```

Kiểm tra

```text
Accuracy

Completeness

Execution Time
```

---

# 20. Operational KPIs

Theo dõi

```text
MTTD

MTTA

MTTR

Deployment Success Rate

Backup Success Rate

Incident Resolution Rate
```

---

# 21. Acceptance Criteria

✓ Startup Procedure rõ ràng.

✓ Shutdown Procedure đầy đủ.

✓ Deployment Runbook khả thi.

✓ Rollback Runbook được kiểm thử.

✓ Database Recovery thành công.

✓ Runbook được cập nhật định kỳ.

---

# 22. Related Documents

OPS-005 CI/CD

OPS-009 Backup & Recovery

OPS-010 Disaster Recovery

OPS-018 Incident Response

ADM-019 Deployment

---

# 23. Summary

Runbook của BusZ là bộ hướng dẫn vận hành chuẩn cho toàn bộ hệ thống Production. Tài liệu cung cấp các quy trình chi tiết từ khởi động, triển khai, khôi phục, xoay vòng bí mật, ứng phó sự cố đến kiểm tra định kỳ, giúp đội DevOps và SRE xử lý công việc nhanh chóng, nhất quán và giảm thiểu rủi ro trong quá trình vận hành.