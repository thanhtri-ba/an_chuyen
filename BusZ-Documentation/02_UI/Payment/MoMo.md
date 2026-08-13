# MoMo Payment Gateway

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Payment

Document ID: PAYMENT-004

Gateway: MoMo

Priority: Critical

Status: Draft

Version: 1.0

---

# 1. Purpose

Tài liệu mô tả việc tích hợp cổng thanh toán MoMo vào BusZ.

Bao gồm:

- Wallet Payment
- QR Payment
- ATM/Card
- Deep Link
- Callback
- Refund

---

# 2. Business Goal

Đảm bảo thanh toán qua MoMo:

✓ Nhanh.

✓ Chính xác.

✓ Không mất giao dịch.

✓ Đồng bộ Payment.

---

# 3. Actors

Customer

Flutter App

BusZ Backend

MoMo Gateway

Ticket Service

Notification Service

---

# 4. Preconditions

✓ Booking Confirmed.

✓ Payment Session Created.

✓ MoMo Available.

---

# 5. Payment Flow

Booking

↓

Create Payment

↓

Generate MoMo Request

↓

Open MoMo

↓

User Payment

↓

MoMo Callback

↓

Verify Signature

↓

Update Database

↓

Issue Ticket

---

# 6. Supported Payment Types

Wallet

QR Code

ATM Card

Visa

MasterCard

JCB

---

# 7. Request Information

partnerCode

requestId

amount

orderId

orderInfo

redirectUrl

ipnUrl

requestType

extraData

signature

---

# 8. Signature

Algorithm

HMAC SHA256

Secret Key

Merchant Secret

Không lưu Secret trên Flutter.

---

# 9. Business Rules

PAY-BR-011

OrderId duy nhất.

PAY-BR-012

Amount không thay đổi.

PAY-BR-013

Signature hợp lệ.

PAY-BR-014

Redirect URL đúng.

PAY-BR-015

IPN phải Verify.

---

# 10. Backend Flow

Receive Booking

↓

Create Payment

↓

Sign Request

↓

Return Payment URL

↓

Flutter Open MoMo

---

# 11. API

POST /payments/momo

POST /payments/momo/ipn

GET /payments/momo/return

---

# 12. Database

payments

payment_sessions

payment_transactions

momo_callbacks

payment_logs

---

# 13. Loading State

Creating Payment

↓

Opening MoMo

↓

Waiting Result

---

# 14. Error State

Invalid Signature

↓

Reject

User Cancel

↓

Cancel Payment

Gateway Error

↓

Retry

Timeout

↓

Cancel Session

---

# 15. Success State

Payment Success

↓

Update Payment

↓

Generate Ticket

↓

Notification

---

# 16. Result Codes

0

Success

1006

Rejected

1007

Pending

1003

Invalid Signature

1005

Cancelled

99

Unknown Error

---

# 17. Deep Link Flow

Flutter

↓

MoMo App

↓

Payment

↓

Return BusZ

↓

Verify

↓

Success

---

# 18. Security

HTTPS

TLS

HMAC SHA256

Replay Protection

Timestamp Validation

---

# 19. Retry Strategy

Gateway Retry

Network Retry

IPN Retry

Database Retry

---

# 20. Logging

Request

Response

Callback

Signature

Transaction

---

# 21. Analytics

momo_open

momo_redirect

momo_success

momo_failed

momo_cancel

---

# 22. Flutter Widget Tree

LoadingScreen

↓

External App Launcher

↓

Waiting Screen

↓

Success Screen

---

# 23. State Management

MoMoBloc

PaymentBloc

GatewayRepository

---

# 24. Performance

Generate Request

<500ms

Open MoMo

<2s

Callback

<2s

---

# 25. Accessibility

Loading Indicator

Retry Button

Readable Error Message

---

# 26. Test Cases

✓ Wallet Payment.

✓ QR Payment.

✓ User Cancel.

✓ Invalid Signature.

✓ Timeout.

✓ Retry.

✓ Network Error.

---

# 27. Acceptance Criteria

✓ Payment thành công.

✓ Verify Signature.

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

MoMo Installment

Recurring Payment

Tokenization

Business Payment

Multi Wallet

---

# 30. Summary

MoMo Gateway là một trong những cổng thanh toán chính của BusZ.

Hệ thống phải hỗ trợ App-to-App Payment, QR Payment và Wallet Payment, đồng thời xác minh mọi giao dịch bằng chữ ký HMAC SHA256 trước khi cập nhật trạng thái thanh toán và phát hành vé.