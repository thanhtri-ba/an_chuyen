# ZaloPay Payment Gateway

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Payment

Document ID: PAYMENT-005

Gateway: ZaloPay

Priority: Critical

Status: Draft

Version: 1.0

---

# 1. Purpose

Tài liệu mô tả việc tích hợp cổng thanh toán ZaloPay vào hệ thống BusZ.

Hỗ trợ:

- ZaloPay Wallet
- QR Payment
- ATM Banking
- Visa/MasterCard
- App-to-App Payment

---

# 2. Business Goal

Đảm bảo giao dịch:

✓ Chính xác.

✓ Nhanh.

✓ Không trùng.

✓ Có thể đối soát.

✓ Có thể hoàn tiền.

---

# 3. Actors

Customer

Flutter App

Backend

ZaloPay Gateway

Notification Service

Ticket Service

---

# 4. Preconditions

✓ Booking Confirmed.

✓ Payment Session Created.

✓ Gateway Available.

---

# 5. Payment Flow

Booking

↓

Create Payment

↓

Generate ZaloPay Order

↓

Open ZaloPay

↓

Customer Payment

↓

Callback

↓

Verify MAC

↓

Update Payment

↓

Issue Ticket

↓

Notification

---

# 6. Payment Types

Wallet

QR Payment

ATM

Visa

MasterCard

JCB

---

# 7. Request Parameters

app_id

app_trans_id

app_user

app_time

amount

description

bank_code

embed_data

item

callback_url

mac

---

# 8. Signature

Algorithm

HMAC SHA256

MAC được tạo từ:

AppId

TransactionId

Amount

Timestamp

SecretKey

---

# 9. Business Rules

PAY-BR-016

Transaction ID duy nhất.

PAY-BR-017

MAC hợp lệ.

PAY-BR-018

Amount không thay đổi.

PAY-BR-019

Callback phải Verify.

PAY-BR-020

Ticket chỉ phát hành sau Payment Success.

---

# 10. Backend Flow

Receive Payment

↓

Validate Booking

↓

Create Order

↓

Generate MAC

↓

Return Order URL

↓

Flutter Open ZaloPay

---

# 11. API

POST /payments/zalopay

POST /payments/zalopay/callback

GET /payments/zalopay/result

POST /payments/zalopay/refund

---

# 12. Database

payments

payment_transactions

payment_sessions

zalopay_callbacks

payment_logs

refunds

---

# 13. Loading State

Creating Order

↓

Redirecting

↓

Waiting Callback

---

# 14. Error State

Invalid MAC

↓

Reject

Gateway Error

↓

Retry

Timeout

↓

Cancel Session

Cancelled

↓

Booking Pending

---

# 15. Success State

Payment Success

↓

Update Payment

↓

Generate Ticket

↓

Email

↓

Push Notification

---

# 16. Response Codes

1

Success

2

Pending

3

Failed

4

Cancelled

5

Expired

99

Unknown Error

---

# 17. Deep Link Flow

Flutter

↓

Open ZaloPay App

↓

Payment

↓

Return BusZ

↓

Verify Callback

↓

Success

---

# 18. Security

HTTPS

TLS

HMAC SHA256

Replay Protection

Nonce Validation

Timestamp Validation

---

# 19. Retry Strategy

Network Retry

Gateway Retry

Callback Retry

Database Retry

Notification Retry

---

# 20. Logging

Payment Request

Gateway Response

Callback

MAC Verification

Database Update

Refund

---

# 21. Analytics

zalopay_open

zalopay_redirect

zalopay_success

zalopay_failed

zalopay_cancel

---

# 22. Flutter Widget Tree

LoadingScreen

↓

ExternalAppLauncher

↓

WaitingScreen

↓

PaymentResultScreen

---

# 23. State Management

ZaloPayBloc

PaymentBloc

GatewayRepository

PaymentRepository

---

# 24. Performance

Create Order

< 500ms

Redirect

< 2 giây

Callback

< 2 giây

---

# 25. Accessibility

Loading Indicator

Retry Button

Readable Error

Screen Reader

---

# 26. Test Cases

✓ Wallet Payment.

✓ QR Payment.

✓ User Cancel.

✓ Timeout.

✓ Invalid MAC.

✓ Retry.

✓ Network Error.

---

# 27. Acceptance Criteria

✓ MAC Verify thành công.

✓ Payment Update.

✓ Ticket Generated.

✓ Notification Sent.

✓ Không Duplicate Transaction.

---

# 28. Related Documents

Payment Architecture

Payment Method

Payment Callback

Refund

Payment Security

---

# 29. Future Expansion

Installment

Recurring Payment

Tokenization

Business Account

Split Payment

---

# 30. Summary

ZaloPay Gateway cho phép người dùng thanh toán thông qua ví điện tử hoặc ngân hàng liên kết.

Mọi giao dịch phải được xác minh bằng HMAC SHA256, cập nhật trạng thái thanh toán chính xác và chỉ phát hành vé sau khi xác nhận giao dịch thành công.