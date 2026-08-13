# VNPay Payment Gateway

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Payment

Document ID: PAYMENT-003

Gateway: VNPay

Priority: Critical

Status: Draft

Version: 1.0

---

# 1. Purpose

Tài liệu này mô tả toàn bộ quy trình tích hợp cổng thanh toán VNPay vào hệ thống BusZ.

Bao gồm:

- Khởi tạo giao dịch
- Redirect
- Thanh toán
- Callback
- Verify Signature
- Update Database
- Phát hành vé

---

# 2. Business Goal

Đảm bảo:

✓ Thanh toán an toàn.

✓ Không mất giao dịch.

✓ Không tạo Booking trùng.

✓ Đồng bộ trạng thái Payment.

---

# 3. Actors

Customer

BusZ Backend

VNPay Gateway

Notification Service

Ticket Service

---

# 4. Preconditions

✓ Booking Confirmed.

✓ Payment Session Created.

✓ Booking chưa thanh toán.

✓ Gateway Available.

---

# 5. Payment Flow

Booking Confirmed

↓

Create Payment

↓

Generate VNPay URL

↓

Redirect VNPay

↓

User Payment

↓

VNPay Return URL

↓

VNPay IPN

↓

Verify Signature

↓

Update Payment

↓

Issue Ticket

↓

Notification

---

# 6. VNPay Parameters

vnp_Version

vnp_Command

vnp_TmnCode

vnp_Amount

vnp_CreateDate

vnp_CurrCode

vnp_IpAddr

vnp_Locale

vnp_OrderInfo

vnp_OrderType

vnp_ReturnUrl

vnp_TxnRef

vnp_SecureHash

---

# 7. Transaction Reference

vnp_TxnRef

Định dạng

BUSZ202607041530001234

Bao gồm

BUSZ

Ngày

Giờ

Random Number

Không được trùng.

---

# 8. Payment Amount

Đơn vị

VND

Ví dụ

500000

VNPay yêu cầu Amount *100

Ví dụ

500000

↓

50000000

---

# 9. Business Rules

PAY-BR-006

TxnRef phải duy nhất.

PAY-BR-007

Amount không được thay đổi.

PAY-BR-008

Return URL phải đúng cấu hình.

PAY-BR-009

Signature phải hợp lệ.

PAY-BR-010

Chỉ cập nhật Payment sau khi Verify thành công.

---

# 10. Redirect Flow

Flutter

↓

Backend

↓

Generate URL

↓

VNPay

↓

Payment Screen

---

# 11. Backend Flow

Receive Booking

↓

Validate

↓

Create Payment

↓

Sign Request

↓

Generate URL

↓

Return URL

---

# 12. API

POST /payments/vnpay

GET /payments/vnpay/return

POST /payments/vnpay/ipn

---

# 13. Database

payments

payment_transactions

payment_sessions

payment_gateway_logs

payment_callbacks

---

# 14. Loading State

Generating Payment

↓

Redirecting

↓

Waiting Callback

---

# 15. Error State

Invalid Signature

↓

Reject

---

Gateway Timeout

↓

Retry

---

Booking Expired

↓

Cancel Booking

---

# 16. Success State

Payment Success

↓

Issue Ticket

↓

Send Email

↓

Push Notification

---

# 17. Security

HTTPS

TLS

HMAC SHA512

Secret Key

Timestamp Validation

Replay Protection

---

# 18. Return URL

Gateway

↓

Return URL

↓

Frontend

↓

Loading

↓

Backend Verify

↓

Success Screen

---

# 19. IPN Flow

VNPay

↓

IPN

↓

Backend

↓

Verify Signature

↓

Update Database

↓

Return Response

---

# 20. Response Code Mapping

00

Success

01

Transaction Exists

02

Merchant Error

07

Fraud Suspicion

09

Card Invalid

10

Authentication Failed

11

Timeout

24

User Cancelled

99

Unknown Error

---

# 21. Retry Strategy

Network Retry

Gateway Retry

IPN Retry

Database Retry

Notification Retry

---

# 22. Logging

Payment Request

Payment Response

Signature Verify

Gateway Callback

Transaction Update

---

# 23. Analytics

vnpay_open

vnpay_redirect

vnpay_success

vnpay_failed

vnpay_cancel

---

# 24. Flutter Widget Tree

LoadingScreen

↓

WebView

↓

WaitingScreen

↓

ResultScreen

---

# 25. State Management

VNPayBloc

PaymentBloc

PaymentRepository

GatewayRepository

---

# 26. Performance

Generate URL

<500ms

Redirect

<2s

Callback

<2s

---

# 27. Accessibility

Loading Indicator

Retry Button

Readable Error Message

---

# 28. Test Cases

✓ Payment Success.

✓ User Cancel.

✓ Timeout.

✓ Signature Invalid.

✓ Amount Changed.

✓ Network Error.

✓ Retry.

---

# 29. Acceptance Criteria

✓ Signature Verify.

✓ Payment Update.

✓ Booking Update.

✓ Ticket Generated.

✓ Notification Sent.

✓ No Duplicate Transaction.

---

# 30. Related Documents

Payment Architecture

Payment Method

Payment Callback

Payment Success

Refund

Security

---

# 31. Future Expansion

VNPay QR

Tokenization

Recurring Payment

Split Payment

Installment

---

# 32. Summary

VNPay Gateway là cổng thanh toán chính của BusZ.

Toàn bộ giao dịch phải được xác minh bằng chữ ký số (HMAC SHA512), chỉ phát hành vé sau khi giao dịch được xác nhận thành công và tuyệt đối không được tạo giao dịch hoặc vé trùng lặp.