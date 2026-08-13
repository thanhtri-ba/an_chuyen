# Admin Web Architecture

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Admin Web

Document ID

ADM-001

Priority

Critical

Version

1.0

---

# 1. Purpose

Admin Web là hệ thống quản trị dành cho:

- Super Admin
- Bus Company Admin
- Operator
- Customer Support
- Accountant

Mục tiêu:

- Quản lý toàn bộ hệ thống BusZ.
- Theo dõi dữ liệu theo thời gian thực.
- Quản trị nghiệp vụ.
- Báo cáo và thống kê.

---

# 2. Technology Stack

Frontend

```text
React 19
```

Framework

```text
Vite
```

Language

```text
TypeScript
```

UI Library

```text
Material UI (MUI)
```

State Management

```text
TanStack Query

Zustand
```

HTTP Client

```text
Axios
```

Charts

```text
Apache ECharts
```

Form

```text
React Hook Form

Zod
```

Routing

```text
React Router v7
```

---

# 3. Architecture Pattern

```text
Feature First

+

Clean Architecture

+

MVVM
```

---

# 4. Folder Structure

```text
src/

app/

core/

features/

layouts/

components/

hooks/

services/

routes/

assets/

utils/

main.tsx
```

---

# 5. Feature Modules

```text
Dashboard

Authentication

Users

Bus Companies

Routes

Trips

Bookings

Payments

Promotions

Reports

Notifications

Settings

Audit Logs
```

---

# 6. Layers

```text
Presentation

↓

Application

↓

Repository

↓

API Client
```

---

# 7. Authentication

Sử dụng

```text
JWT

Refresh Token
```

Lưu

```text
HttpOnly Cookie
```

Refresh tự động.

---

# 8. Authorization

RBAC

Vai trò

```text
Super Admin

Company Admin

Operator

Support

Finance
```

Mỗi Role có quyền riêng.

---

# 9. Layout Structure

```text
Header

↓

Sidebar

↓

Breadcrumb

↓

Content

↓

Footer
```

---

# 10. Navigation

Menu

```text
Dashboard

Users

Companies

Trips

Bookings

Payments

Promotions

Reports

Notifications

Settings
```

---

# 11. Dashboard Widgets

```text
Revenue

Bookings Today

Trips Today

Online Users

Pending Refunds

System Health
```

Realtime cập nhật.

---

# 12. State Management

Global

```text
Authentication

Theme

Language

Permission
```

Feature State

```text
TanStack Query
```

---

# 13. API Layer

Axios

↓

Interceptor

↓

Refresh Token

↓

API

---

# 14. Error Handling

Global Error Boundary

↓

Toast

↓

Retry

↓

Fallback Page

---

# 15. Responsive Design

Desktop

```text
>=1200px
```

Tablet

```text
768px
```

Mobile

```text
>=360px
```

---

# 16. Theme

Hỗ trợ

```text
Light

Dark

System
```

---

# 17. Internationalization

Ngôn ngữ

```text
Vietnamese

English
```

---

# 18. Security

```text
HTTPS

RBAC

CSP

XSS Protection

CSRF Protection

Rate Limit
```

---

# 19. Performance

Dashboard Load

```text
<2s
```

API Response

```text
<200ms
```

Table Search

```text
<100ms
```

---

# 20. Logging

Theo dõi

```text
User Actions

API Errors

Login

CRUD

Permission Changes
```

---

# 21. Monitoring

Theo dõi

```text
CPU

Memory

Queue

Payments

Bookings

API

Realtime Users
```

---

# 22. Testing

```text
Unit Test

Component Test

E2E Test
```

Coverage

```text
>=80%
```

---

# 23. Acceptance Criteria

✓ Responsive.

✓ RBAC hoạt động.

✓ Dashboard realtime.

✓ Theme hoạt động.

✓ API Integration hoàn chỉnh.

✓ Error Handling đầy đủ.

---

# 24. Related Documents

ADM-002 Authentication

ADM-003 Dashboard

APP-001 App Architecture

---

# 25. Summary

Admin Web của BusZ được xây dựng bằng React, TypeScript và Material UI theo kiến trúc Clean Architecture kết hợp Feature First. Hệ thống hỗ trợ Dashboard thời gian thực, RBAC, đa ngôn ngữ, Dark Mode và khả năng mở rộng để phục vụ nhiều vai trò quản trị khác nhau.