# Authorization

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Security

Document ID

SEC-002

Priority

Critical

Version

1.0

---

# 1. Purpose

Authorization định nghĩa cơ chế phân quyền truy cập của BusZ nhằm đảm bảo mỗi người dùng chỉ có thể truy cập các tài nguyên và chức năng được phép theo vai trò và quyền hạn.

Mục tiêu

- Kiểm soát truy cập
- Bảo vệ dữ liệu
- Quản lý quyền
- Hỗ trợ Multi-Tenant
- Tuân thủ Principle of Least Privilege

---

# 2. Objectives

```text
Authorization

Access Control

Permission Management

RBAC

Policy Enforcement
```

---

# 3. Authorization Architecture

```text
User

↓

Authentication

↓

JWT

↓

Authorization Middleware

↓

Permission Validation

↓

Business Logic

↓

Response
```

---

# 4. Authorization Models

```text
Role-Based Access Control (RBAC)

Attribute-Based Access Control (ABAC)

Policy-Based Access Control (PBAC)

Resource-Based Access Control
```

---

# 5. System Roles

```text
Super Admin

Admin

Operator

Bus Company

Driver

Customer Support

Customer

Guest
```

---

# 6. Permission Categories

```text
Read

Create

Update

Delete

Approve

Export

Import

Manage
```

---

# 7. Resource Permissions

```text
Users

Roles

Routes

Trips

Vehicles

Bookings

Payments

Promotions

Reports

Settings
```

---

# 8. Role Matrix

```text
Super Admin

↓

Full Access

Admin

↓

System Management

Operator

↓

Operations

Bus Company

↓

Own Resources

Customer

↓

Own Bookings

Guest

↓

Public APIs
```

---

# 9. Resource Ownership

Ví dụ

```text
Customer

↓

Own Booking

Own Profile

Own Payments

Own Reviews
```

```text
Bus Company

↓

Own Trips

Own Vehicles

Own Drivers
```

---

# 10. API Authorization

Ví dụ

```http
GET /users/me

↓

Customer
```

```http
POST /admin/users

↓

Admin
```

```http
DELETE /bookings/{id}

↓

Owner or Admin
```

---

# 11. Permission Checking

```text
Request

↓

JWT

↓

Role

↓

Permission

↓

Resource Ownership

↓

Decision
```

---

# 12. Fine-grained Permissions

```text
View Revenue

Export Reports

Approve Refund

Manage Fleet

Manage Drivers

Manage Promotions
```

---

# 13. Multi-Tenant Security

Bus Company chỉ được phép

```text
View Own Trips

Manage Own Vehicles

Manage Own Drivers

View Own Revenue

View Own Customers
```

Không được phép

```text
Access Other Companies

Modify Global Settings

View Other Revenue
```

---

# 14. Audit Logging

Ghi nhận

```text
Permission Denied

Role Changes

Privilege Escalation

Sensitive Access

Admin Actions
```

---

# 15. Security Principles

```text
Least Privilege

Need to Know

Default Deny

Separation of Duties

Defense in Depth
```

---

# 16. Performance Targets

```text
Permission Check

<10 ms

Authorization Middleware

<5 ms

Availability

99.99%
```

---

# 17. Security Controls

```text
JWT Validation

Permission Cache

Role Cache

Audit Logs

Rate Limiting

Session Validation
```

---

# 18. Acceptance Criteria

✓ RBAC hoàn chỉnh

✓ Resource Ownership

✓ Multi-Tenant Isolation

✓ Permission Matrix

✓ Audit Logging

✓ Authorization Middleware

---

# 19. Related Documents

Authentication

JWT

Encryption

Rate Limiting

User Management

---

# 20. Summary

Authorization của BusZ sử dụng Role-Based Access Control (RBAC) kết hợp Resource Ownership và khả năng mở rộng sang ABAC để kiểm soát truy cập theo vai trò, quyền hạn và tài nguyên. Kiến trúc này đảm bảo nguyên tắc Least Privilege, hỗ trợ Multi-Tenant cho nhiều nhà xe và bảo vệ hệ thống trước các hành vi truy cập trái phép.