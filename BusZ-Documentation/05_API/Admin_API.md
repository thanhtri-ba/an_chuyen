# Admin API

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Administration

Document ID

API-012

Priority

Critical

Version

1.0

---

# 1. Purpose

Admin API cung cấp toàn bộ chức năng quản trị hệ thống BusZ.

Hỗ trợ

- Dashboard
- User Management
- Operator Management
- Driver Management
- Vehicle Management
- Route Management
- Trip Management
- Booking Management
- Payment Management
- Promotion Management
- Report & Analytics
- System Configuration

---

# 2. API Overview

```text
Admin Portal

↓

Admin API

↓

Business Services

↓

PostgreSQL

↓

Analytics
```

---

# 3. Admin Modules

```text
Dashboard

Users

Operators

Drivers

Vehicles

Routes

Trips

Bookings

Payments

Tickets

Promotions

Reports

System Settings
```

---

# 4. API Endpoints

```text
GET /admin/dashboard

GET /admin/users

GET /admin/operators

GET /admin/drivers

GET /admin/vehicles

GET /admin/routes

GET /admin/trips

GET /admin/bookings

GET /admin/payments

GET /admin/tickets

GET /admin/promotions

GET /admin/reports

GET /admin/settings
```

---

# 5. Dashboard

Endpoint

```http
GET /api/v1/admin/dashboard
```

Hiển thị

```text
Today's Bookings

Today's Revenue

Active Trips

Online Drivers

Active Vehicles

New Users

Pending Refunds

System Health
```

---

# 6. User Management

Chức năng

```text
View User

Search User

Create User

Update User

Lock User

Unlock User

Delete User
```

---

# 7. Operator Management

Quản lý

```text
Bus Companies

Branches

Employees

Status

Contracts
```

---

# 8. Driver Management

Quản lý

```text
Driver Information

License

Status

Assigned Vehicle

Assigned Trip
```

---

# 9. Vehicle Management

Quản lý

```text
Vehicle

License Plate

Capacity

Seat Layout

Maintenance

Insurance
```

---

# 10. Route Management

Quản lý

```text
Routes

Stations

Pickup Points

Dropoff Points

Checkpoints
```

---

# 11. Trip Management

Quản lý

```text
Schedules

Assignments

Status

GPS Tracking

Delay

Cancellation
```

---

# 12. Booking Management

Quản lý

```text
Search Booking

Update Booking

Cancel Booking

Manual Booking

Refund
```

---

# 13. Payment Management

Quản lý

```text
Transactions

Refunds

Invoices

Payment Gateway

Settlement
```

---

# 14. Ticket Management

Quản lý

```text
Issued Tickets

Cancelled Tickets

QR Validation

Manual Check-in
```

---

# 15. Promotion Management

Quản lý

```text
Voucher

Campaign

Discount

Coupon

Usage Statistics
```

---

# 16. Report Center

Bao gồm

```text
Revenue Report

Booking Report

Passenger Report

Trip Report

Operator Report

Payment Report

Refund Report
```

---

# 17. Analytics Dashboard

Hiển thị

```text
Revenue Chart

Booking Trend

Top Routes

Top Operators

Cancellation Rate

Occupancy Rate

Customer Growth
```

---

# 18. System Settings

Cấu hình

```text
General Settings

Payment

Notification

Security

Maintenance

Backup
```

---

# 19. Role Management

```text
Super Admin

Admin

Operator Manager

Operator Staff

Customer Support

Finance

Driver
```

---

# 20. Permissions

Quản lý quyền

```text
Create

Read

Update

Delete

Approve

Export

Import
```

---

# 21. Validation Rules

```text
Admin Authentication

Role Validation

Permission Validation

Input Validation

Business Validation
```

---

# 22. Business Rules

```text
Only Admin Access

Audit All Operations

Soft Delete

Role Based Access

Approval Required For Critical Actions
```

---

# 23. Security

```text
JWT

RBAC

HTTPS

MFA (Future)

Audit Logs

IP Whitelist (Future)
```

---

# 24. Database Tables

```text
Users

Roles

Permissions

Operators

Drivers

Vehicles

Routes

Trips

Bookings

Payments

Tickets

Promotions

AuditLogs
```

---

# 25. Error Codes

```text
ACCESS_DENIED

ROLE_REQUIRED

PERMISSION_DENIED

USER_NOT_FOUND

INVALID_ROLE

SYSTEM_ERROR

RESOURCE_LOCKED
```

---

# 26. Performance Targets

```text
Dashboard

<1 Second

CRUD

<500 ms

Report

<3 Seconds

Analytics

<5 Seconds
```

---

# 27. Audit Logs

Theo dõi

```text
Login

CRUD Operations

Permission Changes

Refund Approval

Promotion Approval

Configuration Changes
```

---

# 28. Integration

```text
Authentication API

User API

Booking API

Payment API

Ticket API

Notification API

Analytics Platform
```

---

# 29. Acceptance Criteria

✓ Dashboard hiển thị chính xác

✓ CRUD hoạt động

✓ Phân quyền chính xác

✓ Audit Log đầy đủ

✓ Báo cáo xuất thành công

✓ Analytics cập nhật

✓ Chỉ Admin được truy cập

---

# 30. Related Documents

Authentication API

User API

Booking API

Payment API

Analytics Architecture

Security Architecture

Database Schema

---

# 31. Summary

Admin API là trung tâm quản trị của hệ thống BusZ, cung cấp đầy đủ chức năng quản lý người dùng, nhà xe, tài xế, phương tiện, tuyến đường, chuyến xe, đặt vé, thanh toán, khuyến mãi và báo cáo. API được thiết kế theo mô hình Role-Based Access Control (RBAC), đảm bảo tính bảo mật, khả năng mở rộng và đáp ứng nhu cầu vận hành của hệ thống ở quy mô doanh nghiệp.