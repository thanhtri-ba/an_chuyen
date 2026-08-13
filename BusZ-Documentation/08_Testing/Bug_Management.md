# Bug Management

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Testing

Document ID

TEST-010

Priority

Critical

Version

1.0

---

# 1. Purpose

Bug Management định nghĩa quy trình quản lý lỗi trong toàn bộ vòng đời phát triển của BusZ.

Mục tiêu

- Chuẩn hóa quy trình xử lý lỗi
- Theo dõi trạng thái lỗi
- Giảm thời gian sửa lỗi
- Đảm bảo chất lượng sản phẩm
- Hỗ trợ Release Management

---

# 2. Bug Management Overview

```text
Tester

↓

Report Bug

↓

Developer

↓

Fix Bug

↓

QA Verification

↓

Close
```

---

# 3. Bug Lifecycle

```text
New

↓

Assigned

↓

In Progress

↓

Resolved

↓

Ready For Testing

↓

Verified

↓

Closed
```

Nếu lỗi chưa sửa

```text
Verified

↓

Reopened
```

---

# 4. Bug Sources

Lỗi có thể phát hiện từ

```text
Manual Testing

Automation Testing

User Acceptance Testing

Production

Customer Feedback

Monitoring

Crash Report
```

---

# 5. Bug Report Information

Mỗi Bug phải có

```text
Bug ID

Title

Description

Module

Reporter

Assignee

Priority

Severity

Status

Environment

Created Date

Updated Date
```

---

# 6. Bug Template

```text
Title

Description

Preconditions

Steps To Reproduce

Expected Result

Actual Result

Attachments

Environment

Version
```

---

# 7. Severity Levels

```text
Critical

High

Medium

Low

Cosmetic
```

---

# 8. Severity Definition

Critical

```text
System unusable

Data loss

Payment failure

Booking failure
```

High

```text
Major feature unavailable
```

Medium

```text
Feature partially affected
```

Low

```text
Minor UI issue
```

Cosmetic

```text
Visual issue only
```

---

# 9. Priority Levels

```text
P0

P1

P2

P3

P4
```

---

# 10. Priority Definition

P0

```text
Immediate Fix
```

P1

```text
Before Release
```

P2

```text
Next Sprint
```

P3

```text
Backlog
```

P4

```text
Future Improvement
```

---

# 11. Bug Status

```text
New

Assigned

In Progress

Resolved

Ready For Testing

Verified

Closed

Rejected

Duplicate

Cannot Reproduce
```

---

# 12. Assignment Rules

```text
Frontend Bug

↓

Frontend Developer

Backend Bug

↓

Backend Developer

Database Bug

↓

Database Developer

Infrastructure Bug

↓

DevOps
```

---

# 13. Verification Rules

QA kiểm tra

```text
Bug Fixed

Regression Passed

No Side Effect

Business Rule Correct
```

---

# 14. Reopen Rules

Bug sẽ mở lại khi

```text
Issue Still Exists

Wrong Fix

Regression

Business Rule Failed
```

---

# 15. Duplicate Bugs

Nếu lỗi đã tồn tại

```text
Status

Duplicate
```

---

# 16. Regression Impact

Kiểm tra

```text
Authentication

Booking

Seat

Payment

Ticket

Notification
```

---

# 17. Root Cause Analysis

Ghi nhận

```text
Requirement

Design

Coding

Database

Configuration

Infrastructure

Third-party
```

---

# 18. Bug Metrics

Theo dõi

```text
Total Bugs

Open Bugs

Closed Bugs

Critical Bugs

Average Resolution Time

Reopen Rate
```

---

# 19. SLA

Critical

```text
4 Hours
```

High

```text
1 Day
```

Medium

```text
3 Days
```

Low

```text
1 Sprint
```

---

# 20. Attachments

Có thể đính kèm

```text
Screenshot

Video

Log

API Response

Database Query

Crash Report
```

---

# 21. Bug Tools

Có thể sử dụng

```text
Jira

GitHub Issues

Azure DevOps

YouTrack

ClickUp
```

---

# 22. Acceptance Criteria

✓ Bug được ghi nhận đầy đủ

✓ Severity đúng

✓ Priority đúng

✓ Có người phụ trách

✓ Được xác minh trước khi đóng

✓ Có lịch sử thay đổi

---

# 23. Related Documents

Test Strategy

Test Cases

Automation Testing

Release Management

CI/CD

---

# 24. Summary

Bug Management chuẩn hóa quy trình tiếp nhận, xử lý và theo dõi lỗi trong BusZ. Tài liệu giúp đội phát triển và QA phối hợp hiệu quả, đảm bảo mọi lỗi được xử lý đúng mức độ ưu tiên và xác minh đầy đủ trước khi phát hành phiên bản mới.