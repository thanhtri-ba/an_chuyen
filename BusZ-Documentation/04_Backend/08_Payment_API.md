# Payment API

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Backend API

Document ID

API-008

Priority

Critical

Version

1.0

---

# 1. Purpose

Payment API quản lý toàn bộ quy trình thanh toán trong hệ thống BusZ.

Bao gồm:

- Khởi tạo thanh toán
- Thanh toán qua cổng thanh toán
- Kiểm tra trạng thái
- Webhook xác nhận
- Hoàn tiền
- Lịch sử giao dịch

Payment API là cầu nối giữa Booking và các Payment Gateway.

---

# 2. Authentication

Các API của người dùng yêu cầu:

```
Bearer JWT
```

Webhook từ Payment Gateway sử dụng:

- Signature
- Secret Key
- IP Whitelist

---

# 3. Supported Payment Methods

```text
VNPay

MoMo

ZaloPay

Stripe

PayPal

Credit Card

Debit Card

Cash (Offline)
```

---

# 4. Endpoints Overview

| Method | Endpoint | Permission |
|----------|-------------------------------|------------|
| POST | /payments | User |
| GET | /payments/{id} | User |
| GET | /payments/history | User |
| POST | /payments/{id}/cancel | User |
| POST | /payments/{id}/refund | Admin |
| POST | /payments/webhook | Gateway |
| GET | /payments/status/{bookingId} | User |

---

# 5. Create Payment

Endpoint

```
POST /payments
```

Request

```json
{
  "bookingId":"uuid",
  "provider":"VNPAY",
  "returnUrl":"busz://payment-success"
}
```

---

# 6. Response

```json
{
  "paymentId":"uuid",
  "paymentCode":"PAY202607040001",
  "paymentUrl":"https://sandbox.vnpay.vn/...",
  "expiredAt":"2026-07-04T10:15:00Z"
}
```

---

# 7. Payment Flow

```text
Booking

↓

Create Payment

↓

Redirect Gateway

↓

Customer Pays

↓

Gateway Webhook

↓

Verify Signature

↓

Update Payment

↓

Confirm Booking

↓

Issue Ticket
```

---

# 8. Payment Detail

Endpoint

```
GET /payments/{id}
```

Response

```json
{
  "paymentId":"uuid",
  "bookingId":"uuid",
  "provider":"VNPAY",
  "status":"SUCCESS",
  "amount":320000,
  "currency":"VND",
  "paidAt":"2026-07-04T10:05:00Z"
}
```

---

# 9. Payment Status

```text
PENDING

↓

PROCESSING

↓

SUCCESS
```

Failure

```text
PENDING

↓

FAILED
```

Cancel

```text
PENDING

↓

CANCELLED
```

Refund

```text
SUCCESS

↓

REFUNDED
```

---

# 10. Payment History

Endpoint

```
GET /payments/history
```

Filter

```
status

provider

date
```

Pagination

```
page

limit
```

---

# 11. Refund

Endpoint

```
POST /payments/{id}/refund
```

Business Flow

```text
Validate

↓

Gateway Refund

↓

Update Payment

↓

Update Booking

↓

Notification
```

---

# 12. Payment Webhook

Endpoint

```
POST /payments/webhook
```

Business Rules

- Verify Signature.
- Idempotent.
- Không xử lý trùng Request.
- Chỉ Gateway được phép gọi.

---

# 13. Business Rules

PAYMENT-BR-001

Một Booking chỉ có một Payment SUCCESS.

---

PAYMENT-BR-002

Payment SUCCESS không được thanh toán lại.

---

PAYMENT-BR-003

Payment FAILED cho phép tạo Payment mới.

---

PAYMENT-BR-004

Refund không vượt quá số tiền thanh toán.

---

PAYMENT-BR-005

Webhook luôn là nguồn dữ liệu chính để cập nhật trạng thái.

---

PAYMENT-BR-006

Mọi giao dịch phải ghi Audit Log.

---

# 14. Validation

Amount

```
> 0
```

Provider

```
Supported Provider
```

Currency

```
VND
```

Booking

```
PENDING_PAYMENT
```

---

# 15. Error Codes

| Code | Description |
|------|-------------|
| PAYMENT_001 | Booking Not Found |
| PAYMENT_002 | Invalid Provider |
| PAYMENT_003 | Payment Failed |
| PAYMENT_004 | Payment Expired |
| PAYMENT_005 | Invalid Signature |
| PAYMENT_006 | Refund Failed |
| PAYMENT_007 | Payment Already Completed |

---

# 16. Security

JWT

HTTPS

Webhook Signature

IP Whitelist

Idempotency-Key

Audit Log

---

# 17. Performance

Create Payment

```
<100ms
```

Webhook Processing

```
<200ms
```

Status Query

```
<30ms
```

---

# 18. Sequence Diagram

```text
Flutter

↓

Payment API

↓

Payment Gateway

↓

Customer

↓

Gateway Callback

↓

Webhook

↓

Update Booking

↓

Generate Ticket
```

---

# 19. Test Cases

✓ Create Payment.

✓ Payment Success.

✓ Payment Failed.

✓ Duplicate Webhook.

✓ Invalid Signature.

✓ Refund Success.

✓ Refund Failed.

✓ Payment History.

---

# 20. Acceptance Criteria

✓ Một Booking chỉ có một Payment SUCCESS.

✓ Webhook xử lý Idempotent.

✓ Refund chính xác.

✓ Audit Log đầy đủ.

✓ Response đúng chuẩn.

---

# 21. Related Documents

API-007 Booking API

API-009 Ticket API

API-018 Webhook API

DB-007 Payments

DB-016 Audit Logs

---

# 22. Summary

Payment API quản lý toàn bộ vòng đời thanh toán của BusZ, từ khởi tạo giao dịch, tích hợp với các cổng thanh toán, xử lý Webhook, hoàn tiền đến cập nhật trạng thái Booking và phát hành vé điện tử. API được thiết kế với cơ chế bảo mật, idempotency và transaction để đảm bảo tính chính xác và an toàn của mọi giao dịch.