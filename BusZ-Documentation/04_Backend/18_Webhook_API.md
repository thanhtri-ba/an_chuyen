# Webhook API

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Backend API

Document ID

API-018

Priority

Critical

Version

1.0

---

# 1. Purpose

Webhook API cho phép BusZ nhận các sự kiện từ hệ thống bên ngoài theo thời gian thực.

Các nguồn phổ biến:

- VNPay
- MoMo
- ZaloPay
- Stripe
- PayPal
- Firebase
- Email Provider
- SMS Provider

Webhook là nguồn dữ liệu chính để cập nhật trạng thái thanh toán và các sự kiện tích hợp.

---

# 2. Objectives

✓ Đồng bộ trạng thái theo thời gian thực.

✓ Đảm bảo Idempotency.

✓ Xác thực nguồn gửi.

✓ Retry khi lỗi.

✓ Audit đầy đủ.

---

# 3. Authentication

Webhook **không sử dụng JWT**.

Xác thực bằng:

- HMAC Signature
- Secret Key
- Timestamp
- IP Whitelist

---

# 4. Endpoints Overview

| Method | Endpoint | Source |
|----------|---------------------------|-------------|
| POST | /webhooks/vnpay | VNPay |
| POST | /webhooks/momo | MoMo |
| POST | /webhooks/zalopay | ZaloPay |
| POST | /webhooks/stripe | Stripe |
| POST | /webhooks/paypal | PayPal |
| POST | /webhooks/email | Email Provider |
| POST | /webhooks/sms | SMS Provider |

---

# 5. Payment Success Flow

```text
Customer

↓

Payment Gateway

↓

Webhook

↓

Verify Signature

↓

Validate Event

↓

Update Payment

↓

Update Booking

↓

Issue Ticket

↓

Notification
```

---

# 6. Example Request

```json
{
  "transactionId":"TX123456",
  "orderId":"PAY202607040001",
  "status":"SUCCESS",
  "amount":320000,
  "signature":"abcdef123456",
  "timestamp":"2026-07-04T10:00:00Z"
}
```

---

# 7. Signature Verification

Quy trình

```text
Receive Request

↓

Read Secret Key

↓

Generate Local Signature

↓

Compare

↓

Continue
```

Nếu Signature sai

↓

Reject

HTTP

```
401 Unauthorized
```

---

# 8. Idempotency

Mỗi Webhook phải có:

```text
eventId
```

hoặc

```text
transactionId
```

Nếu đã xử lý

↓

Bỏ qua.

Không cập nhật lần thứ hai.

---

# 9. Retry Strategy

Nếu xử lý thất bại:

Retry

```
1 phút
```

↓

```
5 phút
```

↓

```
15 phút
```

↓

```
30 phút
```

↓

Dead Letter Queue

---

# 10. Dead Letter Queue

Tên Queue

```text
webhook_dlq
```

Lưu:

- Payload
- Error
- Retry Count
- Timestamp

Cho phép xử lý lại thủ công.

---

# 11. Event Types

Payment

```text
PAYMENT_SUCCESS

PAYMENT_FAILED

PAYMENT_CANCELLED

REFUND_SUCCESS

REFUND_FAILED

CHARGEBACK
```

Notification

```text
EMAIL_SENT

EMAIL_FAILED

SMS_SENT

SMS_FAILED
```

---

# 12. Business Rules

WEBHOOK-BR-001

Chỉ xử lý Signature hợp lệ.

---

WEBHOOK-BR-002

Webhook phải Idempotent.

---

WEBHOOK-BR-003

Không cập nhật Payment đã SUCCESS.

---

WEBHOOK-BR-004

Payment SUCCESS sẽ tự động:

- Confirm Booking.
- Generate Ticket.
- Send Notification.

---

WEBHOOK-BR-005

Toàn bộ Webhook phải ghi Audit Log.

---

# 13. Logging

Ghi:

- Event ID
- Provider
- Transaction ID
- Processing Time
- Status
- Retry Count
- Response Code

---

# 14. Error Codes

| Code | Description |
|------|-------------|
| WEBHOOK_001 | Invalid Signature |
| WEBHOOK_002 | Duplicate Event |
| WEBHOOK_003 | Invalid Payload |
| WEBHOOK_004 | Unsupported Provider |
| WEBHOOK_005 | Processing Failed |

---

# 15. Security

HTTPS

Secret Key

IP Whitelist

Timestamp Validation

Replay Protection

Audit Log

---

# 16. Performance

Signature Verify

```
<10ms
```

Webhook Processing

```
<200ms
```

Retry Scheduling

```
<50ms
```

---

# 17. Sequence Diagram

```text
Gateway

↓

Webhook API

↓

Verify Signature

↓

Validate Event

↓

Queue

↓

Worker

↓

Payment Service

↓

Booking

↓

Ticket

↓

Notification
```

---

# 18. Test Cases

✓ Valid Signature.

✓ Invalid Signature.

✓ Duplicate Event.

✓ Payment Success.

✓ Payment Failed.

✓ Refund.

✓ Retry.

✓ Dead Letter Queue.

---

# 19. Acceptance Criteria

✓ Signature Verification.

✓ Idempotency.

✓ Retry hoạt động.

✓ Dead Letter Queue.

✓ Audit Log.

---

# 20. Related Documents

API-008 Payment API

API-010 Notification API

API-019 Background Jobs

DB-016 Audit Logs

---

# 21. Summary

Webhook API là cơ chế tích hợp thời gian thực của BusZ với các dịch vụ bên ngoài. Hệ thống sử dụng HMAC Signature, Idempotency, Retry Policy và Dead Letter Queue để đảm bảo mọi sự kiện được xử lý an toàn, chính xác và không bị trùng lặp.