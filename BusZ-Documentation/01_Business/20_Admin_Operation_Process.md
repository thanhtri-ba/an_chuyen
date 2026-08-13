# Admin Operation Process

Project: BusZ - Intercity Bus Ticket Booking Platform

Version: 1.0

Document Type: Business Process

Module: Administration

Priority: Critical

Status: Draft

---

# 1. Purpose

Tài liệu này mô tả toàn bộ nghiệp vụ của Administrator trong hệ thống BusZ.

Administrator chịu trách nhiệm:

- Quản lý người dùng
- Quản lý nhà xe
- Quản lý tuyến
- Quản lý chuyến
- Quản lý thanh toán
- Quản lý hoàn tiền
- Quản lý khuyến mãi
- Quản lý báo cáo
- Quản lý hệ thống

---

# 2. Scope

Áp dụng cho:

- Admin Website
- Backend
- Database
- Analytics
- Notification

---

# 3. Actors

Primary

Administrator

Secondary

Super Administrator

Backend

Database

System Scheduler

---

# 4. Admin Dashboard

Dashboard hiển thị:

Total Users

Total Bus Companies

Today's Booking

Today's Revenue

Trips Running

Pending Refund

Pending Review

Pending Support

Server Status

API Status

---

# 5. Admin Modules

Dashboard

↓

User Management

↓

Bus Company Management

↓

Trip Management

↓

Route Management

↓

Payment Management

↓

Refund Management

↓

Promotion Management

↓

Review Moderation

↓

Report Center

↓

System Configuration

---

# 6. User Management

Admin có thể:

Create User

View User

Edit User

Lock User

Unlock User

Reset Password

Delete User

Assign Role

View Activity

---

# 7. Bus Company Management

Admin có thể:

Approve Company

Reject Company

Suspend Company

Activate Company

View Revenue

View Fleet

View Drivers

---

# 8. Route Management

Admin quản lý:

Locations

Routes

Checkpoints

Stations

Pickup Points

Drop-off Points

---

# 9. Trip Management

Admin có thể:

View Trip

Edit Trip

Cancel Trip

Delay Trip

Assign Bus

Assign Driver

Close Trip

---

# 10. Booking Management

Admin xem:

Booking Detail

Passenger

Payment

Refund

Ticket

Check-in

Không được chỉnh sửa Booking đã hoàn thành.

---

# 11. Payment Management

Admin xem:

Payment Detail

Gateway Transaction

Payment Status

Retry Status

Manual Verify

---

# 12. Refund Management

Admin:

Approve Refund

Reject Refund

Retry Refund

Manual Refund

Refund Report

---

# 13. Promotion Management

Admin:

Create Promotion

Pause Promotion

Resume Promotion

Delete Promotion

Generate Coupon

Assign Coupon

---

# 14. Review Moderation

Admin:

Approve Review

Hide Review

Delete Review

Reply Review

Block User

---

# 15. Notification Management

Admin:

Broadcast Notification

Schedule Notification

Emergency Notification

Marketing Notification

---

# 16. System Configuration

Admin cấu hình:

Booking Timeout

Seat Hold Time

Payment Timeout

OTP Timeout

Password Policy

Notification

Maintenance Mode

---

# 17. Workflow

```mermaid
flowchart TD

Admin Login

-->

Dashboard

-->

Select Module

-->

Business Action

-->

Backend Validate

-->

Database Update

-->

Activity Log

-->

Notification

-->

Completed
```

---

# 18. Database Tables

users

roles

permissions

bus_companies

routes

trips

bookings

payments

refunds

promotions

reviews

notifications

settings

activity_logs

audit_logs

---

# 19. APIs

GET /admin/dashboard

GET /admin/users

GET /admin/companies

GET /admin/bookings

GET /admin/reports

PUT /admin/settings

POST /admin/notifications

---

# 20. Validation Rules

Admin phải đăng nhập.

Admin phải có Permission.

Không xóa dữ liệu đã thanh toán.

Không xóa Audit Log.

---

# 21. Security

RBAC

Permission Based

Audit Log

Session Timeout

IP Logging

2FA (Future)

---

# 22. Exception Cases

Permission Denied.

↓

403.

---

Database Error.

↓

Rollback.

---

Server Error.

↓

500.

---

# 23. Logging

Admin Login

Admin Logout

Create

Update

Delete

Approve

Reject

System Config Change

---

# 24. Audit Trail

Admin ID

Module

Action

Old Value

New Value

Timestamp

IP Address

Device

---

# 25. Performance

Dashboard

< 3 giây

Search User

< 2 giây

Report Export

< 30 giây

---

# 26. Acceptance Criteria

✓ Dashboard hoạt động.

✓ User Management đầy đủ.

✓ Company Management đầy đủ.

✓ Payment Management đầy đủ.

✓ Refund Management đầy đủ.

✓ Promotion Management đầy đủ.

✓ Activity Log đầy đủ.

✓ Audit Log đầy đủ.

---

# 27. Future Expansion

Support Center

Live Monitoring

AI Dashboard

Fraud Detection

System Health Monitoring

Alert Center

Workflow Engine

Task Assignment

---

# 28. Related Documents

Authentication Process

Bus Company Process

Report Process

Notification Process

Database Design

API Specification

System Architecture

---

# 29. Summary

Admin Operation Process là tài liệu mô tả toàn bộ nghiệp vụ quản trị của BusZ.

Module này đảm bảo Administrator có thể vận hành, giám sát và quản lý toàn bộ hệ thống một cách an toàn, minh bạch và có khả năng mở rộng trong tương lai.