# CI/CD

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

DevOps & Cloud

Document ID

OPS-005

Priority

Critical

Version

1.0

---

# 1. Purpose

CI/CD (Continuous Integration / Continuous Deployment) tự động hóa toàn bộ quá trình xây dựng, kiểm thử và triển khai hệ thống BusZ.

Mục tiêu

- Tăng tốc phát triển
- Giảm lỗi triển khai
- Đảm bảo chất lượng
- Triển khai an toàn
- Dễ rollback

---

# 2. Git Branch Strategy

```text
main

develop

feature/*

release/*

hotfix/*
```

Flow

```text
Feature

↓

Develop

↓

Release

↓

Main
```

---

# 3. CI Pipeline

```text
Git Push

↓

Install Dependencies

↓

Lint

↓

Unit Test

↓

Integration Test

↓

Build

↓

Security Scan

↓

Artifact Upload
```

---

# 4. CD Pipeline

```text
Artifact

↓

Deploy Staging

↓

Smoke Test

↓

Approval

↓

Deploy Production

↓

Health Check
```

---

# 5. GitHub Actions

Workflow

```text
pull_request.yml

build.yml

test.yml

deploy.yml

release.yml
```

---

# 6. Build Automation

Frontend

```text
npm ci

npm run lint

npm run test

npm run build
```

Backend

```text
npm ci

npm run lint

npm run test

npm run build
```

---

# 7. Docker Build

Pipeline

```text
Build Image

↓

Scan Image

↓

Tag Image

↓

Push Registry
```

---

# 8. Artifact Repository

Lưu trữ

```text
Docker Registry

GitHub Container Registry

AWS ECR
```

Artifacts

```text
Docker Image

Build Report

Coverage Report

Release Notes
```

---

# 9. Security Scanning

Kiểm tra

```text
Dependency Vulnerabilities

Secret Leakage

Docker Image

Static Code Analysis
```

Công cụ

```text
Trivy

CodeQL

Dependabot

npm audit
```

---

# 10. Deployment Environments

```text
Development

↓

Testing

↓

Staging

↓

Production
```

---

# 11. Approval Gates

Production Deployment

↓

Yêu cầu

```text
Technical Lead

DevOps Engineer

Product Owner (Optional)
```

---

# 12. Deployment Strategy

Hỗ trợ

```text
Rolling Update

Blue-Green

Canary
```

Khuyến nghị

```text
Blue-Green
```

---

# 13. Rollback Automation

Nếu Health Check thất bại

↓

```text
Rollback Previous Version

↓

Notify Team
```

---

# 14. Release Tagging

Ví dụ

```text
v1.0.0

v1.1.0

v1.1.1
```

Tag tự động sau khi Release thành công.

---

# 15. Notifications

Gửi tới

```text
Slack

Microsoft Teams

Email

Discord (Optional)
```

Thông báo

```text
Build Success

Build Failed

Deployment Success

Deployment Failed

Rollback
```

---

# 16. Quality Gates

Yêu cầu

```text
Lint Pass

Tests Pass

Coverage ≥80%

No Critical Security Issues
```

Nếu không đạt

↓

Dừng Pipeline.

---

# 17. Secrets Management

Lưu trong

```text
GitHub Secrets

AWS Secrets Manager

HashiCorp Vault
```

Không lưu Secret trong repository.

---

# 18. Monitoring After Deployment

Kiểm tra

```text
Health Endpoint

CPU

Memory

Error Rate

Response Time
```

---

# 19. Pipeline Diagram

```text
Developer

↓

GitHub

↓

GitHub Actions

↓

Build

↓

Test

↓

Docker Build

↓

Registry

↓

Deploy

↓

Health Check

↓

Production
```

---

# 20. Performance Targets

Build Time

```text
<10 phút
```

Test Execution

```text
<5 phút
```

Deployment

```text
<10 phút
```

Rollback

```text
<2 phút
```

---

# 21. Acceptance Criteria

✓ CI tự động.

✓ CD tự động.

✓ Docker Image được tạo.

✓ Security Scan hoạt động.

✓ Rollback tự động.

✓ Notifications hoạt động.

---

# 22. Related Documents

OPS-003 Docker

OPS-004 Kubernetes

OPS-006 Monitoring

ADM-019 Deployment

---

# 23. Summary

CI/CD của BusZ tự động hóa toàn bộ quy trình từ kiểm tra mã nguồn, kiểm thử, xây dựng Docker Image, quét bảo mật đến triển khai Production. Hệ thống tích hợp GitHub Actions, Docker Registry, Approval Gates và Rollback Automation nhằm đảm bảo mỗi lần phát hành đều an toàn, nhất quán và có thể phục hồi nhanh khi gặp sự cố.