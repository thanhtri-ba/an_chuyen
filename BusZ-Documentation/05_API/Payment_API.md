# Payment API

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Payment Management

Document ID

API-008

Priority

Critical

Version

1.0

---

# 1. Purpose

Payment API quản lý toàn bộ quy trình thanh toán của hệ thống BusZ.

Hỗ trợ

- Create Payment
- Payment Gateway
- Payment Status
- Payment Callback
- Refund
- Invoice
- Transaction History
- Payment Verification

---

# 2. API Overview

```text
Passenger App

↓

Payment API

↓

Payment Service

↓

Payment Gateway

↓

Bank

↓

PostgreSQL

↓

Notification Service
```

---

# 3. Payment Flow

```text
Booking Created

↓

Create Payment

↓

Payment Gateway

↓

Customer Payment

↓

Gateway Callback

↓

Verify Transaction

↓

Payment Success

↓

Issue Ticket

↓

Notification
```

Nếu thất bại

```text
Payment Failed

↓

Booking Expired

↓

Release Seats
```

---

# 4. API Endpoints

```text
POST /payments

GET /payments/{paymentId}

GET /payments/history

POST /payments/webhook

POST /payments/refund

GET /payments/refund/{refundId}

GET /payments/invoice/{bookingId}

GET /payments/methods

POST /payments/retry
```

---

# 5. Create Payment

Endpoint

```http
POST /api/v1/payments
```

Description

Khởi tạo giao dịch thanh toán.

Authentication

```text
Required
```

---

# 6. Request Body

```json
{
    "bookingId":"BK260700001",
    "paymentMethod":"VNPAY"
}
```

---

# 7. Success Response

```json
{
    "success":true,
    "data":{
        "paymentId":"PAY001",
        "paymentUrl":"https://sandbox.vnpayment.vn/payment...",
        "expiredAt":"2026-07-04T12:10:00Z"
    }
}
```

---

# 8. Payment Information

```text
Payment ID

Booking ID

Transaction ID

Amount

Currency

Gateway

Method

Status

Created Time
```

---

# 9. Payment Methods

```text
VNPay

MoMo

ZaloPay

Credit Card

Debit Card

Bank Transfer

Cash
```

---

# 10. Payment Status

```text
CREATED

PENDING

PROCESSING

SUCCESS

FAILED

CANCELLED

REFUNDED

PARTIALLY_REFUNDED

EXPIRED
```

---

# 11. Payment Gateway

Hỗ trợ

```text
VNPay

MoMo

ZaloPay

Stripe (Future)

PayPal (Future)
```

---

# 12. Webhook

Endpoint

```http
POST /api/v1/payments/webhook
```

Description

Nhận kết quả thanh toán từ cổng thanh toán.

---

# 13. Verification

Hệ thống kiểm tra

```text
Signature

Transaction ID

Amount

Booking ID

Payment Status
```

---

# 14. Retry Payment

Endpoint

```http
POST /api/v1/payments/retry
```

Cho phép

```text
Retry Failed Payment

Retry Expired Payment
```

---

# 15. Refund

Endpoint

```http
POST /api/v1/payments/refund
```

Description

Hoàn tiền cho đơn đặt vé.

---

# 16. Refund Types

```text
Full Refund

Partial Refund
```

---

# 17. Refund Status

```text
REQUESTED

PROCESSING

SUCCESS

FAILED

REJECTED
```

---

# 18. Invoice

Endpoint

```http
GET /api/v1/payments/invoice/{bookingId}
```

Bao gồm

```text
Invoice Number

Booking Code

Passenger

Payment Method

Amount

VAT

Issue Date
```

---

# 19. Transaction History

Endpoint

```http
GET /api/v1/payments/history
```

Hiển thị

```text
Recent Payments

Refund History

Payment Attempts
```

---

# 20. Validation Rules

```text
Booking Exists

Booking Not Expired

Amount Correct

Gateway Available

Currency Supported
```

---

# 21. Business Rules

```text
One Booking

One Successful Payment

Cannot Pay Completed Booking

Cannot Refund Unpaid Booking

Payment Timeout

10 Minutes
```

---

# 22. Security

```text
HTTPS

JWT

Webhook Signature

AES Encryption

PCI DSS Compliance

Audit Logs
```

---

# 23. Database Tables

```text
Payments

PaymentTransactions

Refunds

Invoices

Bookings

AuditLogs
```

---

# 24. Error Codes

```text
PAYMENT_FAILED

PAYMENT_TIMEOUT

PAYMENT_CANCELLED

PAYMENT_NOT_FOUND

INVALID_SIGNATURE

REFUND_FAILED

REFUND_NOT_ALLOWED

BOOKING_ALREADY_PAID

INVALID_PAYMENT_METHOD
```

---

# 25. Performance Targets

```text
Create Payment

<500 ms

Verify Callback

<300 ms

Refund Request

<1 Second

Invoice Query

<300 ms
```

---

# 26. Audit Logs

Theo dõi

```text
Payment Created

Payment Success

Payment Failed

Refund Requested

Refund Completed

Webhook Received
```

---

# 27. Notification

Gửi

```text
Payment Success

Payment Failed

Refund Success

Refund Failed

Invoice Generated
```

---

# 28. Integration

```text
Booking API

Ticket API

Notification API

Promotion API

Accounting System
```

---

# 29. Acceptance Criteria

✓ Thanh toán thành công

✓ Callback xác thực thành công

✓ Booking chuyển sang PAID

✓ Vé được phát hành

✓ Hóa đơn được tạo

✓ Refund hoạt động

✓ Lịch sử thanh toán đầy đủ

---

# 30. Related Documents

Booking API

Ticket API

Notification API

Refund Business Rules

Database Schema

Payment Gateway Integration

---

# 31. Summary

Payment API chịu trách nhiệm quản lý toàn bộ quy trình thanh toán của BusZ, từ khởi tạo giao dịch, kết nối với các cổng thanh toán, xác thực kết quả, phát hành vé điện tử đến hoàn tiền và xuất hóa đơn. API đảm bảo tính toàn vẹn giao dịch, an toàn dữ liệu và khả năng tích hợp với nhiều nhà cung cấp thanh toán trong tương lai.