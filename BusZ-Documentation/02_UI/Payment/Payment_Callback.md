# Payment Callback

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Payment

Document ID: PAYMENT-009

Priority: Critical

Status: Draft

Version: 1.0

---

# 1. Purpose

Payment Callback chịu trách nhiệm xử lý toàn bộ dữ liệu trả về từ các cổng thanh toán sau khi người dùng hoàn tất hoặc hủy giao dịch.

Bao gồm:

- Return URL
- Webhook
- IPN (Instant Payment Notification)
- Signature Verification
- Database Update
- Ticket Generation

---

# 2. Business Goal

Đảm bảo:

✓ Callback chỉ xử lý một lần.

✓ Không cập nhật sai Payment.

✓ Không tạo Ticket trùng.

✓ Không cập nhật Payment giả mạo.

---

# 3. Actors

Payment Gateway

Backend

Payment Service

Ticket Service

Notification Service

Audit Service

---

# 4. Supported Gateway

VNPay

MoMo

ZaloPay

Credit Card Gateway

Bank Transfer

Future Gateway

---

# 5. Callback Flow

Gateway

↓

Send Callback

↓

Receive Callback API

↓

Validate Request

↓

Verify Signature

↓

Check Idempotency

↓

Update Transaction

↓

Issue Ticket

↓

Send Notification

↓

Return Response

---

# 6. Callback Types

Return URL

Webhook

Instant Payment Notification (IPN)

Manual Verification

Scheduled Verification

---

# 7. Business Rules

PAY-BR-038

Callback phải Verify Signature.

PAY-BR-039

Callback chỉ xử lý một lần.

PAY-BR-040

Không tạo Ticket nếu Verify thất bại.

PAY-BR-041

Callback phải ghi Audit Log.

PAY-BR-042

Không cập nhật Payment khi Amount không khớp.

---

# 8. Verification Flow

Receive Callback

↓

Check Transaction ID

↓

Verify Amount

↓

Verify Booking

↓

Verify Signature

↓

Verify Timestamp

↓

Update Payment

---

# 9. Idempotency Flow

Receive Callback

↓

Find Transaction

↓

Already Processed?

↓

Yes

↓

Return Success

↓

No

↓

Continue Processing

---

# 10. API

POST /payments/callback

POST /payments/ipn

GET /payments/return

POST /payments/manual-verify

---

# 11. Database

payments

payment_transactions

payment_callbacks

payment_status_logs

audit_logs

tickets

---

# 12. Callback Status

RECEIVED

↓

VERIFYING

↓

VERIFIED

↓

PROCESSING

↓

SUCCESS

---

FAILED

↓

RETRY

---

# 13. Error State

Invalid Signature

↓

Reject Callback

---

Amount Mismatch

↓

Manual Review

---

Unknown Transaction

↓

Reject

---

Database Error

↓

Retry Queue

---

# 14. Retry Strategy

Webhook Retry

IPN Retry

Database Retry

Queue Retry

Manual Retry

---

# 15. Queue Processing

Receive Callback

↓

Message Queue

↓

Worker

↓

Database

↓

Ticket Service

↓

Notification

---

# 16. Security

HTTPS

JWT (Internal)

HMAC

RSA (Gateway Supported)

Replay Protection

Timestamp Validation

Nonce Validation

---

# 17. Logging

Callback Received

Signature Verification

Database Update

Ticket Generated

Notification Sent

Failure Reason

---

# 18. Monitoring

Callback Delay

Failed Callback

Retry Count

Duplicate Callback

Gateway Response Time

---

# 19. Analytics

callback_received

callback_verified

callback_failed

callback_retry

ticket_generated

---

# 20. Flutter Impact

Không hiển thị trực tiếp.

Flutter chỉ polling hoặc nhận Push Notification để cập nhật trạng thái thanh toán.

---

# 21. State Management

PaymentCallbackService

WebhookProcessor

PaymentRepository

AuditRepository

TicketRepository

---

# 22. Performance

Callback Verify

< 500ms

Database Update

< 500ms

Ticket Issue

< 1 giây

---

# 23. Test Cases

✓ Callback Success.

✓ Duplicate Callback.

✓ Invalid Signature.

✓ Wrong Amount.

✓ Unknown Transaction.

✓ Retry Queue.

✓ Ticket Generated.

---

# 24. Acceptance Criteria

✓ Callback xử lý đúng một lần.

✓ Signature hợp lệ.

✓ Payment cập nhật đúng.

✓ Ticket phát hành đúng.

✓ Audit Log đầy đủ.

---

# 25. Related Documents

Payment Processing

Payment Success

Refund

Ticket Module

Security

Architecture

---

# 26. Future Expansion

Message Queue (Kafka)

RabbitMQ

Event Bus

Multi Region Callback

Dead Letter Queue

Webhook Versioning

---

# 27. Summary

Payment Callback là thành phần quan trọng nhất của Backend Payment.

Nó đảm bảo mọi giao dịch từ các cổng thanh toán được xác minh, xử lý an toàn, cập nhật chính xác và chỉ phát hành vé sau khi giao dịch được xác nhận thành công.