# Refund Management

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Payment

Document ID: PAYMENT-012

Priority: Critical

Status: Draft

Version: 1.0

---

# 1. Purpose

Refund Management quản lý toàn bộ quy trình hoàn tiền sau khi khách hàng hủy vé hoặc khi giao dịch cần được hoàn trả.

Module hỗ trợ:

- Full Refund
- Partial Refund
- Manual Refund
- Automatic Refund

---

# 2. Business Goal

Đảm bảo:

✓ Hoàn tiền chính xác.

✓ Không hoàn tiền trùng.

✓ Đồng bộ Payment.

✓ Đồng bộ Booking.

✓ Đồng bộ Ticket.

---

# 3. Actors

Customer

Customer Support

Admin

Backend

Payment Gateway

Bank

---

# 4. Preconditions

✓ Payment Success.

✓ Booking tồn tại.

✓ Ticket hợp lệ.

---

# 5. Refund Flow

Customer

↓

Request Refund

↓

Validate Policy

↓

Calculate Refund

↓

Approve

↓

Gateway Refund

↓

Verify Refund

↓

Update Payment

↓

Update Booking

↓

Notification

---

# 6. Refund Types

Full Refund

Partial Refund

Manual Refund

Automatic Refund

System Refund

---

# 7. Refund Status

REQUESTED

↓

REVIEWING

↓

APPROVED

↓

PROCESSING

↓

SUCCESS

---

REQUESTED

↓

REJECTED

---

PROCESSING

↓

FAILED

---

# 8. Refund Policy

Trước 24 giờ

↓

100%

---

12–24 giờ

↓

70%

---

6–12 giờ

↓

50%

---

Dưới 6 giờ

↓

0%

(Lưu ý: Tỷ lệ trên chỉ là ví dụ. Chính sách thực tế sẽ do từng nhà xe hoặc BusZ cấu hình.)

---

# 9. Business Rules

PAY-BR-053

Refund không vượt quá số tiền đã thanh toán.

PAY-BR-054

Một Payment chỉ hoàn tối đa số tiền gốc.

PAY-BR-055

Không Refund Payment Failed.

PAY-BR-056

Refund phải ghi Audit Log.

PAY-BR-057

Refund phải có lý do.

---

# 10. Refund Calculation

Original Payment

-

Cancellation Fee

-

Service Fee (Configurable)

=

Refund Amount

---

# 11. API

POST /refunds

GET /refunds/{id}

POST /refunds/{id}/approve

POST /refunds/{id}/reject

POST /refunds/{id}/complete

---

# 12. Database

refund_requests

refund_transactions

payments

payment_transactions

booking_refunds

audit_logs

---

# 13. Validation

Booking tồn tại.

Payment Success.

Refund Amount hợp lệ.

Refund Policy hợp lệ.

---

# 14. Loading State

Calculating Refund

↓

Sending Gateway

↓

Waiting Result

↓

Updating Database

---

# 15. Error State

Gateway Error

↓

Retry

---

Refund Rejected

↓

Notification

---

Duplicate Refund

↓

Reject

---

Network Error

↓

Retry

---

# 16. Success State

Refund Completed

↓

Update Payment

↓

Update Booking

↓

Notification

---

# 17. Gateway Flow

Refund Request

↓

Gateway

↓

Verify

↓

Update Transaction

↓

Notification

---

# 18. Notification

Refund Requested

Refund Approved

Refund Rejected

Refund Completed

---

# 19. Analytics

refund_requested

refund_approved

refund_rejected

refund_completed

refund_failed

---

# 20. Flutter Widget Tree

Scaffold

↓

RefundSummaryCard

↓

RefundPolicyCard

↓

RefundAmountCard

↓

ReasonInput

↓

SubmitButton

---

# 21. State Management

RefundBloc

RefundRepository

PaymentRepository

BookingRepository

---

# 22. Performance

Refund Calculation

<500ms

Gateway Refund

<5 giây

Database Update

<1 giây

---

# 23. Accessibility

Readable Policy

Large Font

Screen Reader

Touch Area ≥ 48dp

---

# 24. Test Cases

✓ Full Refund.

✓ Partial Refund.

✓ Duplicate Refund.

✓ Gateway Failure.

✓ Policy Reject.

✓ Retry.

---

# 25. Acceptance Criteria

✓ Refund chính xác.

✓ Payment cập nhật đúng.

✓ Booking cập nhật đúng.

✓ Audit đầy đủ.

✓ Không Duplicate Refund.

---

# 26. Related Documents

Payment Processing

Payment Success

Transaction History

Payment Security

Fraud Prevention

---

# 27. Future Expansion

Instant Refund

Wallet Refund

Multi-Gateway Refund

Automatic Compensation

AI Refund Detection

---

# 28. Summary

Refund Management quản lý toàn bộ quy trình hoàn tiền của BusZ, từ yêu cầu hoàn tiền, kiểm tra chính sách, xử lý qua cổng thanh toán đến cập nhật trạng thái giao dịch và gửi thông báo cho khách hàng.