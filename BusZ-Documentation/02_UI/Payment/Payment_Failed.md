# Payment Failed

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Payment

Document ID: PAYMENT-010

Priority: Critical

Status: Draft

Version: 1.0

---

# 1. Purpose

Payment Failed mô tả toàn bộ quy trình xử lý khi giao dịch thanh toán không thành công.

Mục tiêu:

- Giữ dữ liệu nhất quán.
- Hướng dẫn người dùng.
- Cho phép thanh toán lại.
- Không làm mất Booking nếu còn thời gian.

---

# 2. Business Goal

Đảm bảo:

✓ Không mất Booking.

✓ Không mất Seat Hold (nếu còn hiệu lực).

✓ Có thể Retry Payment.

✓ Có đầy đủ Audit Log.

---

# 3. Actors

Customer

Flutter App

Backend

Payment Gateway

Booking Service

Notification Service

---

# 4. Preconditions

✓ Payment Session Created.

✓ Booking Confirmed.

✓ Gateway đang hoạt động.

---

# 5. Failure Flow

Customer

↓

Start Payment

↓

Gateway

↓

Payment Failed

↓

Callback

↓

Update Payment

↓

Notify Customer

↓

Retry

---

# 6. Failure Reasons

User Cancelled

Gateway Timeout

Network Error

Wrong OTP

3DS Authentication Failed

Insufficient Balance

Expired Card

Invalid Card

Gateway Maintenance

Unknown Error

---

# 7. Payment Status

CREATED

↓

FAILED

---

PROCESSING

↓

FAILED

---

PENDING

↓

FAILED

---

# 8. Booking Status

Booking vẫn giữ nguyên.

Seat Hold vẫn giữ nếu chưa Timeout.

Không phát hành Ticket.

Không gửi Email xác nhận.

---

# 9. Business Rules

PAY-BR-043

Không phát hành Ticket.

PAY-BR-044

Không cập nhật Booking thành PAID.

PAY-BR-045

Cho phép Retry nếu Session còn hiệu lực.

PAY-BR-046

Seat chỉ Release khi Session hết hạn.

PAY-BR-047

Mọi lỗi phải ghi Audit Log.

---

# 10. Business Logic

Receive Failed Callback

↓

Verify

↓

Update Payment

↓

Save Failure Reason

↓

Notify User

↓

Allow Retry

---

# 11. API

POST /payments/failed

GET /payments/{id}/status

POST /payments/retry

POST /payments/cancel

---

# 12. Database

payments

payment_transactions

payment_failure_logs

audit_logs

booking_status

---

# 13. Retry Payment

Payment Failed

↓

Retry Button

↓

New Payment Session

↓

New Transaction

↓

Gateway

---

# 14. Timeout Policy

Session còn hạn

↓

Retry Allowed

---

Session hết hạn

↓

Cancel Booking

↓

Release Seat

---

# 15. Loading State

Checking Payment

↓

Loading Failure

↓

Preparing Retry

---

# 16. Error State

Retry Failed

↓

Retry Again

---

Gateway Offline

↓

Choose Another Gateway

---

Session Expired

↓

Restart Booking

---

# 17. Success State

Retry Success

↓

Payment Processing

---

# 18. User Actions

Retry Payment

Change Payment Method

Cancel Booking

Contact Support

Back Home

---

# 19. Navigation

Retry

↓

Payment Method

Change Gateway

↓

Payment Method

Cancel

↓

Booking Detail

---

# 20. Notification

Thanh toán thất bại.

Lý do.

Thời gian còn lại để thanh toán.

Nút Thanh toán lại.

---

# 21. Analytics

payment_failed

payment_retry

payment_cancel

gateway_changed

support_click

---

# 22. Flutter Widget Tree

Scaffold

↓

FailureAnimation

↓

FailureReasonCard

↓

RetryButton

↓

ChangeGatewayButton

↓

CancelBookingButton

↓

SupportButton

---

# 23. State Management

PaymentFailedBloc

PaymentRepository

BookingRepository

SupportRepository

---

# 24. Performance

Failure Screen

< 500ms

Retry

< 2 giây

---

# 25. Accessibility

Readable Error Message

Touch Area ≥ 48dp

Screen Reader

Large Font

---

# 26. Test Cases

✓ User Cancel.

✓ Wrong OTP.

✓ Gateway Timeout.

✓ Retry Success.

✓ Retry Failed.

✓ Session Expired.

✓ Change Gateway.

---

# 27. Acceptance Criteria

✓ Không phát hành Ticket.

✓ Retry hoạt động.

✓ Booking đúng trạng thái.

✓ Seat không mất trước Timeout.

✓ Không crash.

---

# 28. Related Documents

Payment Processing

Payment Callback

Payment Success

Refund

Booking Confirmation

---

# 29. Future Expansion

Automatic Retry

AI Failure Detection

Smart Gateway Switching

Offline Payment Queue

Support Chat Integration

---

# 30. Summary

Payment Failed đảm bảo mọi giao dịch thất bại được xử lý an toàn, minh bạch và cho phép người dùng tiếp tục thanh toán hoặc lựa chọn phương thức khác mà không làm mất dữ liệu đặt vé nếu vẫn còn trong thời gian giữ chỗ.