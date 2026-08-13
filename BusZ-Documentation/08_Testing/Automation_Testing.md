# Automation Testing

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Testing

Document ID

TEST-011

Priority

Critical

Version

1.0

---

# 1. Purpose

Automation Testing định nghĩa chiến lược kiểm thử tự động của hệ thống BusZ nhằm giảm thời gian kiểm thử, tăng độ ổn định và hỗ trợ Continuous Integration / Continuous Deployment (CI/CD).

Mục tiêu

- Tự động hóa Regression Test
- Tự động hóa API Test
- Tự động hóa UI Test
- Kiểm thử sau mỗi lần Build
- Giảm Manual Testing
- Tăng Test Coverage

---

# 2. Testing Scope

Áp dụng cho

```text
Flutter Mobile

Passenger Website

Admin Portal

REST API

Backend Services

Database

CI/CD Pipeline
```

---

# 3. Automation Strategy

```text
Developer Commit

↓

CI Pipeline

↓

Build

↓

Unit Test

↓

API Test

↓

UI Test

↓

Integration Test

↓

Report
```

---

# 4. Automation Pyramid

```text
UI Test

▲

Integration Test

▲▲

API Test

▲▲▲

Unit Test
```

---

# 5. Test Levels

```text
Unit Test

API Test

Component Test

Integration Test

End-to-End Test

Regression Test
```

---

# 6. Unit Testing

Áp dụng

```text
Business Logic

Utility

Service

Validation

Helper
```

Target

```text
Coverage >=80%
```

---

# 7. API Automation

Tự động kiểm tra

```text
Authentication

Users

Routes

Trips

Seats

Bookings

Payments

Tickets

Notifications

Reviews

Admin
```

---

# 8. UI Automation

Kiểm thử

```text
Login

Search

Booking

Payment

Ticket

Profile

History
```

---

# 9. Integration Automation

Kiểm thử

```text
Booking → Payment

Payment → Ticket

Ticket → Notification

Authentication → User
```

---

# 10. Regression Automation

Tự động chạy

```text
Authentication

Booking

Seat

Payment

Ticket

Admin
```

Sau mỗi

```text
Merge

Release

Hotfix
```

---

# 11. Smoke Automation

Kiểm tra nhanh

```text
Application Startup

Login

Search

Booking

Payment
```

---

# 12. CI/CD Integration

```text
Push Code

↓

GitHub Actions

↓

Build

↓

Run Tests

↓

Generate Report

↓

Deploy
```

---

# 13. Automation Environment

```text
Development

Staging

Production Mirror
```

---

# 14. Test Data

Sử dụng

```text
Fixtures

Factories

Seed Database

Mock Services
```

---

# 15. Mock Services

Mock

```text
VNPay

MoMo

Firebase

SMTP

SMS Gateway
```

---

# 16. Automation Tools

Backend

```text
Jest

Supertest
```

Frontend

```text
Playwright

Cypress
```

Flutter

```text
flutter_test

integration_test
```

Performance

```text
k6

JMeter
```

---

# 17. Execution Schedule

```text
Every Commit

Pull Request

Nightly Build

Weekly Regression

Release Candidate
```

---

# 18. Reporting

Báo cáo

```text
Passed

Failed

Skipped

Coverage

Execution Time

Failed Screenshots
```

---

# 19. Code Coverage

Mục tiêu

```text
Unit Test >=80%

API Test >=90%

Critical Flow 100%
```

---

# 20. Failure Handling

Nếu test thất bại

```text
Stop Deployment

Notify Team

Create Bug

Store Logs
```

---

# 21. Parallel Execution

Cho phép

```text
API Tests

UI Tests

Cross Browser Tests
```

---

# 22. Browser Matrix

Website

```text
Chrome

Edge

Firefox

Safari
```

---

# 23. Mobile Matrix

```text
Android 10+

Android 11+

Android 12+

Android 13+

Android 14+

iOS 16+

iOS 17+
```

---

# 24. Automation Metrics

Theo dõi

```text
Execution Time

Success Rate

Failure Rate

Coverage

Flaky Tests
```

---

# 25. Acceptance Criteria

✓ Regression chạy tự động

✓ API Test tự động

✓ UI Test tự động

✓ Báo cáo sinh tự động

✓ CI/CD tích hợp thành công

✓ Critical Flow đạt 100%

---

# 26. Related Documents

Test Strategy

API Test

UI Test

Integration Test

Performance Test

Security Test

Bug Management

CI/CD Pipeline

---

# 27. Summary

Automation Testing giúp BusZ kiểm thử tự động toàn bộ các chức năng quan trọng sau mỗi lần thay đổi mã nguồn. Chiến lược này giảm thời gian kiểm thử thủ công, phát hiện lỗi sớm và đảm bảo chất lượng phần mềm trong suốt vòng đời phát triển.