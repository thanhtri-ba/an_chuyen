# Git Strategy

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

DevOps

Document ID

DEVOPS-003

Priority

Critical

Version

1.0

---

# 1. Purpose

Git Strategy định nghĩa chiến lược quản lý Source Code của BusZ nhằm đảm bảo việc phát triển, cộng tác và phát hành phần mềm được kiểm soát, an toàn và nhất quán.

Mục tiêu

- Chuẩn hóa Git Workflow
- Hỗ trợ Team Collaboration
- Giảm Merge Conflict
- Đảm bảo Code Quality
- Hỗ trợ CI/CD

---

# 2. Objectives

```text
Version Control

Branch Management

Release Management

Code Collaboration

Continuous Integration
```

---

# 3. Git Workflow

```text
Feature

↓

Pull Request

↓

Code Review

↓

Testing

↓

Merge

↓

Release
```

---

# 4. Branch Strategy

```text
main

Production

develop

Integration

feature/*

New Feature

bugfix/*

Bug Fix

hotfix/*

Production Fix

release/*

Release Candidate
```

---

# 5. Branch Naming

```text
feature/login

feature/payment

feature/booking-flow

bugfix/payment-timeout

hotfix/security-patch

release/v1.2.0
```

---

# 6. Commit Convention

Format

```text
type(scope): message
```

Types

```text
feat

fix

docs

style

refactor

perf

test

build

ci

chore
```

Ví dụ

```text
feat(auth): add OTP login

fix(payment): resolve webhook retry issue

docs(api): update payment endpoints
```

---

# 7. Pull Request Process

```text
Create Feature Branch

↓

Commit Changes

↓

Push Branch

↓

Open Pull Request

↓

Code Review

↓

CI Validation

↓

Merge
```

---

# 8. Merge Strategy

Khuyến nghị

```text
Squash Merge

Feature Branch

Rebase

Small Commits
```

Không khuyến nghị

```text
Force Push vào main

Direct Commit vào main
```

---

# 9. Code Review Checklist

```text
Business Logic

Architecture

Security

Performance

Readability

Testing

Documentation
```

---

# 10. Conflict Resolution

```text
Rebase thường xuyên

Pull trước khi Push

Giữ Commit nhỏ

Review sau Merge
```

---

# 11. Release Flow

```text
develop

↓

release/vX.Y.Z

↓

Testing

↓

main

↓

Git Tag

↓

Production
```

---

# 12. Versioning

Semantic Versioning

```text
Major.Minor.Patch

1.0.0

1.1.0

1.1.1
```

---

# 13. Git Tags

Ví dụ

```text
v1.0.0

v1.1.0

v1.2.1
```

---

# 14. Repository Protection

```text
Protected Branch

Required Review

Required CI

Signed Commit (Optional)

Status Checks
```

---

# 15. CI Integration

```text
Build

Lint

Unit Test

Integration Test

Security Scan

Code Coverage
```

---

# 16. Repository Structure

```text
frontend/

backend/

docs/

scripts/

docker/

.github/

infrastructure/
```

---

# 17. Performance Targets

```text
PR Review

<24 Hours

CI Build

<10 Minutes

Merge Time

<5 Minutes
```

---

# 18. Security

```text
Signed Commits (Optional)

Secret Scanning

Dependency Scanning

Branch Protection

CODEOWNERS
```

---

# 19. Acceptance Criteria

✓ Branch Strategy

✓ Commit Convention

✓ Pull Request Workflow

✓ Code Review

✓ CI Integration

✓ Release Strategy

---

# 20. Related Documents

Docker

Environment

Logging

Monitoring

Development Git Workflow

---

# 21. Summary

Git Strategy của BusZ chuẩn hóa quy trình quản lý mã nguồn thông qua Branch Strategy, Commit Convention, Pull Request và Code Review. Quy trình này giúp nhóm phát triển cộng tác hiệu quả, giảm Merge Conflict và đảm bảo chất lượng mã nguồn trước khi triển khai lên Production.