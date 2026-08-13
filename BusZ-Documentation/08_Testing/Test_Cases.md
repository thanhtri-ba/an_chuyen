# Test Cases

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Testing

Document ID

TEST-008

Priority

Critical

Version

1.0

---

# 1. Purpose

Test Cases định nghĩa các kịch bản kiểm thử chi tiết cho toàn bộ chức năng của hệ thống BusZ.

Mục tiêu

- Chuẩn hóa kịch bản kiểm thử
- Đảm bảo đầy đủ nghiệp vụ
- Hỗ trợ Manual Testing
- Hỗ trợ Automation Testing
- Đảm bảo khả năng Regression Testing

---

# 2. Test Case Structure

Mỗi Test Case bao gồm

```text
Test Case ID

Module

Feature

Preconditions

Test Steps

Expected Result

Priority

Status
```

---

# 3. Authentication Test Cases

## TC-AUTH-001

Tên

```text
Register Successfully
```

Preconditions

```text
Email chưa tồn tại
```

Steps

```text
1. Open Register

2. Enter valid information

3. Click Register
```

Expected

```text
Account created successfully
```

Priority

```text
Critical
```

---

## TC-AUTH-002

Tên

```text
Register Duplicate Email
```

Expected

```text
EMAIL_ALREADY_EXISTS
```

---

## TC-AUTH-003

Tên

```text
Login Successfully
```

Expected

```text
JWT generated
```

---

## TC-AUTH-004

Tên

```text
Login Wrong Password
```

Expected

```text
AUTH_INVALID_PASSWORD
```

---

# 4. Search Test Cases

## TC-SEARCH-001

Tên

```text
Search Available Trip
```

Expected

```text
Trip List Returned
```

---

## TC-SEARCH-002

Tên

```text
Search Same Departure Destination
```

Expected

```text
Validation Error
```

---

## TC-SEARCH-003

Tên

```text
Search Past Date
```

Expected

```text
Travel Date Invalid
```

---

# 5. Seat Test Cases

## TC-SEAT-001

Tên

```text
Load Seat Layout
```

Expected

```text
Seat Layout Displayed
```

---

## TC-SEAT-002

Tên

```text
Hold Available Seat
```

Expected

```text
Seat Status = HELD
```

---

## TC-SEAT-003

Tên

```text
Hold Booked Seat
```

Expected

```text
SEAT_ALREADY_BOOKED
```

---

## TC-SEAT-004

Tên

```text
Hold Seat Timeout
```

Expected

```text
Seat Released Automatically
```

---

## TC-SEAT-005

Tên

```text
Concurrent Seat Hold
```

Expected

```text
Only One User Can Hold
```

---

# 6. Booking Test Cases

## TC-BOOK-001

Tên

```text
Create Booking Successfully
```

Expected

```text
Booking Created
```

---

## TC-BOOK-002

Tên

```text
Booking Without Seat
```

Expected

```text
Validation Error
```

---

## TC-BOOK-003

Tên

```text
Booking Expired
```

Expected

```text
Booking Status = EXPIRED
```

---

## TC-BOOK-004

Tên

```text
Cancel Booking
```

Expected

```text
Booking Cancelled
```

---

# 7. Payment Test Cases

## TC-PAY-001

Tên

```text
Payment Success
```

Expected

```text
Booking Paid

Ticket Generated
```

---

## TC-PAY-002

Tên

```text
Payment Failed
```

Expected

```text
Booking Pending
```

---

## TC-PAY-003

Tên

```text
Duplicate Payment Callback
```

Expected

```text
Ignore Duplicate
```

---

## TC-PAY-004

Tên

```text
Refund Success
```

Expected

```text
Refund Completed
```

---

# 8. Ticket Test Cases

## TC-TICKET-001

Tên

```text
Generate Ticket
```

Expected

```text
QR Generated
```

---

## TC-TICKET-002

Tên

```text
Scan Valid QR
```

Expected

```text
Check-in Success
```

---

## TC-TICKET-003

Tên

```text
Scan Used QR
```

Expected

```text
QR_ALREADY_USED
```

---

# 9. Notification Test Cases

## TC-NOTI-001

```text
Booking Notification
```

Expected

```text
Push Notification Received
```

---

## TC-NOTI-002

```text
Payment Reminder
```

Expected

```text
Reminder Sent
```

---

# 10. Review Test Cases

## TC-REVIEW-001

```text
Create Review
```

Expected

```text
Review Published
```

---

## TC-REVIEW-002

```text
Duplicate Review
```

Expected

```text
REVIEW_ALREADY_EXISTS
```

---

# 11. Admin Test Cases

## TC-ADMIN-001

```text
Dashboard Load
```

Expected

```text
Dashboard Loaded
```

---

## TC-ADMIN-002

```text
Passenger Access Admin
```

Expected

```text
ACCESS_DENIED
```

---

# 12. Regression Test Suite

Chạy lại khi thay đổi

```text
Authentication

Search

Booking

Seat

Payment

Ticket

Notification

Admin
```

---

# 13. Smoke Test Suite

Kiểm tra nhanh

```text
Login

Search

Booking

Payment

Ticket
```

---

# 14. Automation Candidates

Ưu tiên tự động hóa

```text
Authentication

Booking

Payment

Ticket

Seat Hold

Search
```

---

# 15. Traceability

Mỗi Test Case liên kết với

```text
Business Rule

API

Database

UI Screen

Acceptance Criteria
```

---

# 16. Acceptance Criteria

✓ Test Cases đầy đủ

✓ Bao phủ toàn bộ module

✓ Có Expected Result

✓ Có Test ID

✓ Có thể Automation

---

# 17. Related Documents

Test Strategy

API Test

UI Test

Integration Test

Performance Test

Security Test

UAT

---

# 18. Summary

Test Cases là danh sách các kịch bản kiểm thử chi tiết cho toàn bộ hệ thống BusZ. Tài liệu này là cơ sở để QA thực hiện Manual Testing, Automation Testing và Regression Testing, đồng thời giúp đảm bảo mọi chức năng đều được kiểm thử có hệ thống trước khi phát hành.