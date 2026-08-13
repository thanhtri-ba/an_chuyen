# Bank Transfer Payment

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Payment

Document ID: PAYMENT-007

Gateway: Bank Transfer

Priority: High

Status: Draft

Version: 1.0

---

# 1. Purpose

Bank Transfer cho phép khách hàng thanh toán bằng chuyển khoản ngân hàng thông qua VietQR hoặc chuyển khoản thủ công.

Hệ thống hỗ trợ:

- Dynamic QR
- Static QR
- Manual Transfer
- Auto Reconciliation

---

# 2. Business Goal

Đảm bảo khách hàng có thể thanh toán bằng chuyển khoản ngân hàng một cách nhanh chóng và chính xác.

---

# 3. Actors

Customer

Flutter App

Backend

Bank

Payment Service

Notification Service

---

# 4. Preconditions

✓ Booking Confirmed.

✓ Payment Session Created.

✓ Booking chưa hết hạn.

---

# 5. Payment Flow

Booking

↓

Create Transfer Order

↓

Generate VietQR

↓

Customer Transfer

↓

Bank Receive Money

↓

Reconciliation

↓

Payment Success

↓

Issue Ticket

---

# 6. Transfer Information

Bank Name

Account Number

Account Name

Branch

Amount

Transfer Content

QR Code

Expired Time

---

# 7. VietQR Information

QR Type

Dynamic

QR Content

EMVCo Standard

Currency

VND

---

# 8. Transfer Content

Format

BUSZ-{BookingCode}

Ví dụ

BUSZ-B
123456789

Booking Code phải duy nhất.

Không được để trống.

Không được trùng.

---

# 9. Business Rules

PAY-BR-027

Booking Code phải duy nhất.

PAY-BR-028

Transfer Amount phải bằng Total Amount.

PAY-BR-029

Transfer Content phải đúng định dạng.

PAY-BR-030

Payment Session hết hạn sau 15 phút.

PAY-BR-031

Sau khi hết hạn:

↓

Release Seat

↓

Cancel Booking

PAY-BR-032

Một Booking chỉ được xác nhận thanh toán một lần.

---

# 10. Business Logic

Create Payment

↓

Generate QR

↓

Display QR

↓

Customer Transfer

↓

Receive Bank Notification

↓

Auto Reconciliation

↓

Verify Transaction

↓

Update Payment

↓

Generate Ticket

↓

Notification

---

# 11. API

POST /payments/bank-transfer

GET /payments/bank-transfer/{paymentId}

POST /payments/bank-transfer/verify

POST /payments/bank-transfer/reconcile

POST /payments/bank-transfer/refund

---

# 12. Database

payments

payment_sessions

bank_transfers

bank_accounts

payment_transactions

reconciliation_logs

refunds

---

# 13. Auto Reconciliation

Receive Bank Statement

↓

Match Booking Code

↓

Match Amount

↓

Match Time

↓

Verify

↓

Payment Success

---

Nếu không khớp

↓

Manual Review

---

# 14. Manual Review

Áp dụng khi

Sai số tiền

Sai nội dung

Không có Booking

Chuyển khoản nhiều lần

Trùng giao dịch

---

# 15. Loading State

Generating QR

↓

Waiting Payment

↓

Checking Bank

↓

Reconciling

---

# 16. Error State

Wrong Amount

↓

Pending Review

---

Wrong Transfer Content

↓

Manual Review

---

Expired Session

↓

Cancel Booking

---

Bank API Error

↓

Retry

---

Network Error

↓

Retry

---

# 17. Success State

Payment Verified

↓

Booking Paid

↓

Ticket Generated

↓

Notification Sent

---

# 18. Timeout Policy

Payment Session

15 phút

↓

Expired

↓

Booking Cancelled

↓

Seat Released

↓

QR Invalid

---

# 19. Refund Flow

Refund Request

↓

Review

↓

Bank Transfer Refund

↓

Update Payment

↓

Notification

---

# 20. Notification

Payment Success

Payment Pending

Payment Failed

Booking Expired

Refund Completed

---

# 21. Analytics

bank_transfer_open

qr_generated

payment_pending

payment_verified

payment_timeout

refund_requested

---

# 22. Flutter Widget Tree

Scaffold

↓

PaymentSummaryCard

↓

BankInformationCard

↓

DynamicQRCard

↓

CountdownTimer

↓

InstructionCard

↓

BottomActionBar

---

# 23. State Management

BankTransferBloc

PaymentBloc

ReconciliationBloc

NotificationBloc

---

# 24. Performance

Generate QR

< 500ms

Payment Verification

< 3 giây

Auto Reconciliation

< 10 giây

---

# 25. Accessibility

Large QR Code

Copy Account Number

Copy Transfer Content

Screen Reader

Touch Area ≥ 48dp

---

# 26. Test Cases

✓ Dynamic QR.

✓ Manual Transfer.

✓ Wrong Amount.

✓ Wrong Booking Code.

✓ Duplicate Transfer.

✓ Timeout.

✓ Refund.

✓ Retry.

---

# 27. Acceptance Criteria

✓ QR tạo thành công.

✓ Đối soát tự động.

✓ Booking cập nhật đúng.

✓ Ticket phát hành đúng.

✓ Không Duplicate Payment.

---

# 28. Related Documents

Payment Processing

Payment Callback

Refund

Payment Security

Booking Confirmation

---

# 29. Future Expansion

Open Banking API

Realtime Bank Webhook

Virtual Account

Auto Split Payment

Cross-bank Instant Verification

Scheduled Payment

---

# 30. Summary

Bank Transfer cho phép người dùng thanh toán thông qua chuyển khoản ngân hàng bằng VietQR hoặc chuyển khoản thủ công.

Hệ thống phải tự động đối soát giao dịch, xác minh số tiền và nội dung chuyển khoản trước khi cập nhật trạng thái thanh toán và phát hành vé.