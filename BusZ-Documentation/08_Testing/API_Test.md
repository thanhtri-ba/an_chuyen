# API Test

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Testing

Document ID

TEST-002

Priority

Critical

Version

1.0

---

# 1. Purpose

API Test định nghĩa kế hoạch kiểm thử toàn bộ API của hệ thống BusZ.

Mục tiêu

- Kiểm tra endpoint hoạt động đúng
- Kiểm tra request và response
- Kiểm tra authentication
- Kiểm tra authorization
- Kiểm tra validation
- Kiểm tra error codes
- Kiểm tra business rules
- Kiểm tra luồng booking, payment, ticket

---

# 2. API Test Scope

Phạm vi kiểm thử

```text
Authentication API

User API

Search API

Route API

Trip API

Seat API

Booking API

Payment API

Ticket API

Notification API

Review API

Admin API
```

---

# 3. API Test Overview

```text
API Client

↓

Backend API

↓

Service Layer

↓

Database

↓

External Services
```

---

# 4. Test Types

```text
Positive Test

Negative Test

Validation Test

Authentication Test

Authorization Test

Business Rule Test

Integration Test

Regression Test

Performance Smoke Test
```

---

# 5. Common Response Format

Tất cả API phải trả về format thống nhất.

Success

```json
{
    "success": true,
    "message": "Request successful",
    "data": {},
    "timestamp": "2026-07-04T10:00:00Z"
}
```

Error

```json
{
    "success": false,
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [],
    "timestamp": "2026-07-04T10:00:00Z"
}
```

---

# 6. HTTP Status Code Test

Cần kiểm tra

```text
200 OK

201 Created

204 No Content

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Validation Error

429 Too Many Requests

500 Internal Server Error
```

---

# 7. Authentication API Test

Endpoint

```text
POST /api/v1/auth/register

POST /api/v1/auth/login

POST /api/v1/auth/logout

POST /api/v1/auth/refresh-token

POST /api/v1/auth/forgot-password

POST /api/v1/auth/reset-password
```

Test cases

```text
Register with valid data

Register with duplicated email

Register with duplicated phone

Register with weak password

Login with correct credentials

Login with wrong password

Login with disabled account

Refresh token success

Refresh token expired

Logout success
```

---

# 8. User API Test

Endpoint

```text
GET /api/v1/users/me

PATCH /api/v1/users/me

PATCH /api/v1/users/password

GET /api/v1/users/passengers

POST /api/v1/users/passengers

DELETE /api/v1/users/passengers/{id}
```

Test cases

```text
Get profile with valid token

Get profile without token

Update profile success

Update invalid phone

Change password success

Change password with wrong old password

Add saved passenger

Delete saved passenger
```

---

# 9. Search API Test

Endpoint

```text
GET /api/v1/search

GET /api/v1/search/suggestions

GET /api/v1/search/popular

GET /api/v1/search/history
```

Test cases

```text
Search trip with valid departure and destination

Search with same departure and destination

Search with past date

Search with invalid passenger count

Search no trips found

Search with filters

Search with sorting

Autocomplete returns suggestions
```

---

# 10. Route API Test

Endpoint

```text
GET /api/v1/routes

GET /api/v1/routes/{routeId}

GET /api/v1/routes/{routeId}/pickup-points

GET /api/v1/routes/{routeId}/dropoff-points

GET /api/v1/routes/{routeId}/checkpoints
```

Test cases

```text
Get route list

Get route detail

Get invalid route

Get pickup points

Get dropoff points

Get checkpoints in correct order

Check route status
```

---

# 11. Trip API Test

Endpoint

```text
GET /api/v1/trips

GET /api/v1/trips/{tripId}

GET /api/v1/trips/{tripId}/tracking

GET /api/v1/trips/{tripId}/status
```

Test cases

```text
Get trip detail

Get cancelled trip

Get completed trip

Get available trip

Get trip tracking

Check available seats

Check trip status
```

---

# 12. Seat API Test

Endpoint

```text
GET /api/v1/trips/{tripId}/seats

POST /api/v1/seats/hold

DELETE /api/v1/seats/hold/{holdId}

POST /api/v1/seats/release
```

Test cases

```text
Load seat map

Hold available seat

Hold booked seat

Hold already held seat

Hold more than maximum seats

Release held seat

Seat hold expired

Concurrent hold same seat

Prevent overbooking
```

Expected result

```text
Only one user can hold one seat at one time.
```

---

# 13. Booking API Test

Endpoint

```text
POST /api/v1/bookings

GET /api/v1/bookings/{bookingId}

GET /api/v1/bookings/history

PATCH /api/v1/bookings/{bookingId}/cancel
```

Test cases

```text
Create booking success

Create booking without seat

Create booking with unavailable seat

Create booking with invalid passenger

Create booking with invalid pickup point

Create booking with promotion

Get booking detail

Cancel booking success

Cancel paid booking

Cancel completed booking

Booking expired releases seats
```

---

# 14. Payment API Test

Endpoint

```text
POST /api/v1/payments

GET /api/v1/payments/{paymentId}

POST /api/v1/payments/webhook

POST /api/v1/payments/refund

GET /api/v1/payments/invoice/{bookingId}
```

Test cases

```text
Create payment success

Create payment for expired booking

Create payment for already paid booking

Payment success webhook

Payment failed webhook

Invalid webhook signature

Duplicate webhook

Refund success

Refund not allowed

Invoice generated
```

Expected result

```text
Payment success must update booking status and generate ticket.
```

---

# 15. Ticket API Test

Endpoint

```text
GET /api/v1/tickets/{ticketId}

GET /api/v1/tickets/{ticketId}/qr

POST /api/v1/tickets/validate

POST /api/v1/tickets/check-in

GET /api/v1/tickets/{ticketId}/download
```

Test cases

```text
Get ticket detail

Get ticket QR

Validate valid QR

Validate expired QR

Validate reused QR

Check-in success

Check-in already checked ticket

Download ticket PDF
```

---

# 16. Notification API Test

Endpoint

```text
GET /api/v1/notifications

PATCH /api/v1/notifications/{notificationId}/read

PATCH /api/v1/notifications/read-all

POST /api/v1/notifications/device-token

PATCH /api/v1/notifications/settings
```

Test cases

```text
Get notification list

Mark notification as read

Mark all as read

Register device token

Invalid device token

Update notification settings
```

---

# 17. Review API Test

Endpoint

```text
POST /api/v1/reviews

GET /api/v1/reviews

PATCH /api/v1/reviews/{reviewId}

DELETE /api/v1/reviews/{reviewId}

POST /api/v1/reviews/{reviewId}/report
```

Test cases

```text
Create review after completed trip

Create review before completed trip

Create duplicate review

Invalid rating

Update review

Delete review

Report review
```

---

# 18. Admin API Test

Endpoint

```text
GET /api/v1/admin/dashboard

GET /api/v1/admin/users

GET /api/v1/admin/bookings

GET /api/v1/admin/payments

GET /api/v1/admin/reports
```

Test cases

```text
Admin access success

Passenger access denied

Operator access limited

Dashboard data correct

Search users

Update booking by admin

Export report
```

---

# 19. Validation Test

Kiểm tra

```text
Required fields

Invalid data type

Invalid enum

Invalid date

Invalid phone

Invalid email

Invalid ID

Invalid pagination
```

---

# 20. Authorization Test

Kiểm tra role

```text
Passenger

Driver

Operator

Admin

Super Admin
```

Rules

```text
Passenger cannot access Admin API

Driver can access assigned trips only

Operator can manage own company only

Admin can manage system data
```

---

# 21. Pagination Test

Kiểm tra

```text
page

limit

totalItems

totalPages

hasNext

hasPrevious
```

---

# 22. Rate Limit Test

Kiểm tra

```text
Login Rate Limit

Register Rate Limit

OTP Rate Limit

Search Rate Limit

Payment Retry Limit
```

---

# 23. Security API Test

Kiểm tra

```text
Missing JWT

Expired JWT

Invalid JWT

SQL Injection Payload

XSS Payload

Unauthorized Role

Invalid Webhook Signature
```

---

# 24. Database Consistency Test

Kiểm tra sau API call

```text
Booking Created

Seat Status Updated

Payment Created

Ticket Generated

Audit Log Created

Notification Created
```

---

# 25. API Test Data

Cần chuẩn bị

```text
Passenger Account

Admin Account

Operator Account

Driver Account

Routes

Trips

Seats

Promotions

Bookings

Payments
```

---

# 26. Test Tools

Có thể dùng

```text
Postman

Insomnia

Swagger UI

REST Client

Jest

Supertest

Newman
```

---

# 27. Automation Strategy

Ưu tiên automation

```text
Authentication Flow

Search Flow

Seat Hold Flow

Booking Flow

Payment Mock Flow

Ticket Flow

Admin Permission Flow
```

---

# 28. API Test Report

Báo cáo gồm

```text
Total Test Cases

Passed

Failed

Blocked

Defects

Coverage

Risk Areas
```

---

# 29. Acceptance Criteria

✓ Tất cả API trả đúng status code

✓ Response format thống nhất

✓ Error code đúng

✓ Authentication hoạt động

✓ Authorization đúng

✓ Booking flow thành công

✓ Payment flow thành công

✓ Không xảy ra overbooking

✓ API critical pass 100%

---

# 30. Related Documents

Test Strategy

Integration Test

Security Test

Performance Test

API Specification

Error Codes

Database Schema

---

# 31. Summary

API Test đảm bảo toàn bộ API của BusZ hoạt động đúng hợp đồng, đúng nghiệp vụ và an toàn. Các luồng quan trọng như đăng nhập, tìm chuyến, giữ ghế, đặt vé, thanh toán, phát hành vé và check-in phải được kiểm thử kỹ để đảm bảo hệ thống ổn định trước khi triển khai.