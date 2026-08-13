# Testing

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Admin Web

Document ID

ADM-018

Priority

Critical

Version

1.0

---

# 1. Purpose

Testing đảm bảo Admin Web hoạt động ổn định, chính xác và an toàn trước khi triển khai.

Mục tiêu

- Phát hiện lỗi sớm
- Đảm bảo nghiệp vụ
- Giảm Regression
- Đảm bảo bảo mật
- Hỗ trợ CI/CD

---

# 2. Testing Strategy

Áp dụng

```text
Unit Test

↓

Component Test

↓

Integration Test

↓

End-to-End Test
```

---

# 3. Unit Testing

Kiểm thử

```text
Utility

Hooks

Services

Validators

Permission Logic

Business Logic
```

Không kiểm thử UI.

---

# 4. Component Testing

Kiểm thử

```text
Tables

Forms

Dialogs

Charts

Buttons

Filters

Pagination
```

---

# 5. Integration Testing

Kiểm thử luồng

```text
Login

↓

Dashboard

↓

CRUD

↓

Reports

↓

Logout
```

---

# 6. End-to-End Testing

Kịch bản

```text
Login

↓

Create Company

↓

Create Route

↓

Create Trip

↓

Booking

↓

Payment

↓

Report
```

---

# 7. RBAC Testing

Kiểm tra

```text
Menu Visibility

Button Visibility

API Authorization

Data Scope

Role Assignment
```

---

# 8. API Mocking

Sử dụng

```text
MSW (Mock Service Worker)

Mock Service

Axios Mock Adapter
```

---

# 9. Security Testing

Kiểm tra

```text
Authentication

Authorization

CSRF

XSS

SQL Injection

Rate Limit
```

---

# 10. Performance Testing

Đo

```text
Dashboard Load

API Latency

Table Rendering

Search Response

Memory Usage
```

---

# 11. Accessibility Testing

Kiểm tra

```text
Keyboard Navigation

Screen Reader

Color Contrast

ARIA Labels

Focus Order
```

---

# 12. Cross-browser Testing

Hỗ trợ

```text
Chrome

Edge

Firefox

Safari
```

---

# 13. Responsive Testing

Thiết bị

```text
Desktop

Laptop

Tablet

Mobile
```

---

# 14. Error Scenario Testing

Kiểm thử

```text
401

403

404

500

Offline

Timeout
```

---

# 15. File Testing

Kiểm tra

```text
Upload

Download

Preview

Delete

Restore Version
```

---

# 16. Report Testing

Kiểm thử

```text
Charts

Export Excel

Export PDF

Schedule Report
```

---

# 17. CI/CD Pipeline

```text
Git Push

↓

Lint

↓

Unit Test

↓

Component Test

↓

Integration Test

↓

E2E Test

↓

Coverage

↓

Build
```

---

# 18. Code Coverage

Mục tiêu

```text
>=80%
```

Áp dụng

```text
Business Logic

Permission Logic

Hooks

Utilities
```

---

# 19. Bug Severity

```text
Critical

High

Medium

Low
```

Ưu tiên sửa

```text
Critical

High
```

trước khi Release.

---

# 20. Test Report

Bao gồm

```text
Passed

Failed

Skipped

Coverage

Duration

Bug Count
```

---

# 21. Tools

```text
Vitest

React Testing Library

Playwright

MSW

ESLint

Prettier

GitHub Actions
```

---

# 22. UX Guidelines

✓ Không phát hành nếu còn lỗi Critical.

✓ Tự động chạy Test khi Pull Request.

✓ Có báo cáo Coverage.

✓ Có Regression Test.

✓ Có Smoke Test sau khi Deploy.

---

# 23. Test Cases

✓ Login.

✓ Dashboard.

✓ User CRUD.

✓ Company CRUD.

✓ Route CRUD.

✓ Trip CRUD.

✓ Payment.

✓ Report.

✓ Notification.

✓ RBAC.

---

# 24. Acceptance Criteria

✓ Unit Test Pass.

✓ Component Test Pass.

✓ Integration Test Pass.

✓ E2E Pass.

✓ Coverage ≥80%.

✓ Không còn lỗi Critical.

---

# 25. Related Documents

ADM-017 Error Handling

ADM-019 Deployment

APP-019 Testing

---

# 26. Summary

Testing của Admin Web áp dụng chiến lược kiểm thử nhiều tầng, từ Unit Test đến End-to-End Test, kết hợp với CI/CD để đảm bảo chất lượng phần mềm. Hệ thống được kiểm tra về nghiệp vụ, hiệu năng, bảo mật, khả năng truy cập và tương thích trình duyệt trước mỗi lần phát hành.