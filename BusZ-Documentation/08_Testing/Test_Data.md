# Test Data

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Testing

Document ID

TEST-009

Priority

High

Version

1.0

---

# 1. Purpose

Test Data định nghĩa bộ dữ liệu chuẩn phục vụ kiểm thử toàn bộ hệ thống BusZ.

Mục tiêu

- Chuẩn hóa dữ liệu kiểm thử
- Đảm bảo khả năng lặp lại của các bài test
- Hỗ trợ Manual Testing
- Hỗ trợ Automation Testing
- Hỗ trợ Regression Testing

---

# 2. Test Data Scope

Áp dụng cho

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

# 3. Test Environment Data

Chuẩn bị

```text
Development

Staging

Production Mirror
```

---

# 4. User Test Data

Passenger

```text
10 Active Users

5 Inactive Users

5 Locked Users
```

Driver

```text
10 Drivers

2 Suspended Drivers
```

Operator

```text
5 Operators
```

Admin

```text
2 Admin

1 Super Admin
```

---

# 5. Authentication Data

Bao gồm

```text
Valid Email

Invalid Email

Expired OTP

Expired Token

Invalid Password

Locked Account
```

---

# 6. Route Data

Chuẩn bị

```text
50 Provinces

200 Routes

500 Pickup Points

500 Dropoff Points

100 Bus Stations
```

---

# 7. Trip Data

```text
100 Active Trips

20 Cancelled Trips

10 Completed Trips

5 Delayed Trips
```

---

# 8. Vehicle Data

```text
16 Seats

22 Seats

34 Seats

40 Seats

44 Seats

Limousine

Sleeper Bus
```

---

# 9. Seat Data

Chuẩn bị

```text
Available

Held

Booked

Blocked

Maintenance
```

---

# 10. Booking Data

```text
Draft

Pending Payment

Paid

Cancelled

Refunded

Completed

Expired
```

---

# 11. Payment Data

```text
Pending

Success

Failed

Cancelled

Refunded
```

Payment Method

```text
VNPay

MoMo

ZaloPay

Credit Card

Bank Transfer
```

---

# 12. Ticket Data

```text
Generated

Issued

Checked-in

Completed

Cancelled
```

---

# 13. Promotion Data

```text
Percentage

Fixed Amount

Expired

Disabled

Usage Limit
```

---

# 14. Review Data

```text
1 Star

2 Stars

3 Stars

4 Stars

5 Stars
```

---

# 15. Notification Data

```text
Push

Email

SMS

In-App
```

---

# 16. Invalid Data

Bao gồm

```text
Invalid Email

Invalid Phone

Invalid Date

Invalid QR

Invalid Booking

Invalid Payment
```

---

# 17. Boundary Test Data

Kiểm tra

```text
0 Passenger

1 Passenger

6 Passengers

7 Passengers

Maximum Length

Minimum Length
```

---

# 18. Performance Test Data

Chuẩn bị

```text
1000 Users

500 Trips

20000 Bookings

50000 Tickets
```

---

# 19. Security Test Data

Bao gồm

```text
SQL Injection

XSS

CSRF

JWT Attack

Replay Attack
```

---

# 20. Data Refresh Policy

```text
Reset Daily

Refresh Weekly

Archive Monthly
```

---

# 21. Test Data Management

Quản lý

```text
Seed Script

Factory

Fixtures

Mock Data
```

---

# 22. Data Privacy

Đảm bảo

```text
No Real Customer Data

Masked Information

Generated Identity

Anonymous Payment Data
```

---

# 23. Acceptance Criteria

✓ Dữ liệu đầy đủ

✓ Dữ liệu nhất quán

✓ Có dữ liệu hợp lệ

✓ Có dữ liệu không hợp lệ

✓ Có dữ liệu biên

✓ Có dữ liệu tải lớn

---

# 24. Related Documents

Test Strategy

API Test

Performance Test

Security Test

Database Schema

Seed Data

---

# 25. Summary

Test Data định nghĩa bộ dữ liệu chuẩn phục vụ toàn bộ hoạt động kiểm thử của BusZ. Tài liệu đảm bảo mọi môi trường kiểm thử đều sử dụng dữ liệu nhất quán, đầy đủ và an toàn, đồng thời hỗ trợ hiệu quả cho Manual Testing, Automation Testing và Performance Testing.