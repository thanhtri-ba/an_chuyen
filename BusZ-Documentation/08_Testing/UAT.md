# User Acceptance Testing (UAT)

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Testing

Document ID

TEST-007

Priority

Critical

Version

1.0

---

# 1. Purpose

User Acceptance Testing (UAT) xác nhận hệ thống BusZ đáp ứng đầy đủ yêu cầu nghiệp vụ trước khi triển khai chính thức.

Mục tiêu

- Xác nhận nghiệp vụ hoạt động đúng
- Đảm bảo trải nghiệm người dùng
- Đảm bảo hệ thống sẵn sàng Go-Live
- Được Product Owner và Stakeholders phê duyệt

---

# 2. UAT Scope

Áp dụng cho

```text
Passenger Mobile App

Passenger Website

Admin Portal

Operator Portal

Driver Application
```

---

# 3. Participants

Tham gia UAT

```text
Product Owner

Business Analyst

Project Manager

QA Engineer

Passenger

Operator

Driver

Admin
```

---

# 4. UAT Environment

```text
Staging Environment

Production-like Database

Payment Sandbox

Notification Sandbox

GPS Simulation
```

---

# 5. UAT Entry Criteria

Điều kiện bắt đầu

```text
Development Completed

System Test Passed

Integration Test Passed

Performance Test Passed

Security Test Passed

Critical Bugs Fixed
```

---

# 6. UAT Exit Criteria

Điều kiện kết thúc

```text
All Critical Scenarios Passed

No Critical Defects

Business Approved

Product Owner Approved

Go-Live Approved
```

---

# 7. Scenario 01

User Registration

Steps

```text
Open Register Screen

Enter Information

Submit

Verify Email / OTP
```

Expected Result

```text
Account Created Successfully
```

---

# 8. Scenario 02

Login

Steps

```text
Login

Receive JWT

Access Home Screen
```

Expected Result

```text
Login Successful
```

---

# 9. Scenario 03

Search Trip

Steps

```text
Select Departure

Select Destination

Select Date

Search
```

Expected Result

```text
Trip List Displayed
```

---

# 10. Scenario 04

Seat Selection

Steps

```text
Open Trip

Select Seat

Continue
```

Expected Result

```text
Seat Held Successfully
```

---

# 11. Scenario 05

Create Booking

Steps

```text
Enter Passenger

Confirm Booking
```

Expected Result

```text
Booking Created
```

---

# 12. Scenario 06

Payment

Steps

```text
Select Payment Method

Pay

Return Application
```

Expected Result

```text
Payment Success

Booking Paid
```

---

# 13. Scenario 07

Receive Ticket

Steps

```text
Payment Success

Open Ticket
```

Expected Result

```text
QR Generated

Ticket PDF Available
```

---

# 14. Scenario 08

Booking History

Steps

```text
Open Booking History
```

Expected Result

```text
Booking Displayed Correctly
```

---

# 15. Scenario 09

Cancel Booking

Steps

```text
Open Booking

Cancel Booking
```

Expected Result

```text
Booking Cancelled

Refund Process Started
```

---

# 16. Scenario 10

Driver Check-in

Steps

```text
Scan QR

Validate Ticket
```

Expected Result

```text
Passenger Checked-in
```

---

# 17. Scenario 11

Review Trip

Steps

```text
Complete Trip

Open Review

Submit Rating
```

Expected Result

```text
Review Published
```

---

# 18. Scenario 12

Admin Dashboard

Steps

```text
Login Admin

Open Dashboard
```

Expected Result

```text
Statistics Loaded
```

---

# 19. Scenario 13

Operator Management

Steps

```text
Login Operator

Manage Trips

Update Schedule
```

Expected Result

```text
Trip Updated
```

---

# 20. Scenario 14

Notification

Steps

```text
Booking Success

Receive Push Notification
```

Expected Result

```text
Notification Received
```

---

# 21. Scenario 15

Refund

Steps

```text
Cancel Eligible Booking

Approve Refund
```

Expected Result

```text
Refund Completed
```

---

# 22. Business Rule Validation

Kiểm tra

```text
Maximum 6 Passengers

Seat Hold 10 Minutes

No Overbooking

Refund Policy

Promotion Rules

Role Permissions
```

---

# 23. Data Validation

Kiểm tra

```text
Booking Data

Payment Data

Passenger Data

Ticket Data

Notification Data
```

---

# 24. Usability Evaluation

Đánh giá

```text
Easy Navigation

Readable Interface

Fast Response

Clear Error Messages

Consistent Design
```

---

# 25. UAT Deliverables

```text
UAT Test Cases

Execution Report

Defect List

Business Sign-off

Go-Live Recommendation
```

---

# 26. Defect Classification

```text
Critical

High

Medium

Low
```

---

# 27. Sign-off

Phê duyệt bởi

```text
Product Owner

Business Analyst

Project Manager

Customer Representative
```

---

# 28. Acceptance Criteria

✓ Tất cả nghiệp vụ chính hoạt động

✓ Không còn Critical Bug

✓ Người dùng sử dụng thành công

✓ Product Owner phê duyệt

✓ Stakeholders phê duyệt

✓ Sẵn sàng Go-Live

---

# 29. Related Documents

Test Strategy

API Test

UI Test

Integration Test

Performance Test

Security Test

Business Rules

API Specification

---

# 30. Summary

User Acceptance Testing (UAT) là giai đoạn kiểm thử cuối cùng trước khi triển khai hệ thống BusZ vào môi trường thực tế. Tài liệu này xác định các kịch bản nghiệm thu, tiêu chí chấp nhận và quy trình phê duyệt nhằm đảm bảo hệ thống đáp ứng đầy đủ yêu cầu nghiệp vụ, mang lại trải nghiệm tốt cho người dùng và sẵn sàng đưa vào vận hành.