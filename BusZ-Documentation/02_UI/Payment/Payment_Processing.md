# Payment Processing

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Payment

Document ID: PAYMENT-008

Priority: Critical

Status: Draft

Version: 1.0

---

# 1. Purpose

Payment Processing chịu trách nhiệm điều phối toàn bộ quy trình thanh toán từ lúc người dùng nhấn "Thanh toán" đến khi phát hành vé.

Đây là trung tâm của Payment Module.

---

# 2. Business Goal

Đảm bảo:

✓ Không mất giao dịch.

✓ Không thanh toán trùng.

✓ Không phát hành vé sai.

✓ Đồng bộ Payment - Booking - Ticket.

---

# 3. Actors

Customer

Flutter App

Backend API

Payment Service

Gateway Adapter

Ticket Service

Notification Service

Audit Service

---

# 4. Preconditions

✓ Booking Confirmed.

✓ Payment Session Created.

✓ Gateway Selected.

✓ Seat Hold còn hiệu lực.

---

# 5. Payment Lifecycle

Booking

↓

Create Payment Session

↓

Create Transaction

↓

Gateway Payment

↓

Callback

↓

Verify

↓

Update Payment

↓

Issue Ticket

↓

Send Notification

↓

Complete

---

# 6. Payment State Machine

CREATED

↓

PENDING

↓

PROCESSING

↓

SUCCESS

↓

COMPLETED

---

CREATED

↓

FAILED

---

PENDING

↓

TIMEOUT

---

SUCCESS

↓

REFUNDING

↓

REFUNDED

---

# 7. Transaction Lifecycle

Transaction Created

↓

Waiting Payment

↓

Gateway Processing

↓

Verification

↓

Commit Database

↓

Generate Ticket

↓

Archive Transaction

---

# 8. Business Rules

PAY-BR-033

Một Booking chỉ có một Payment đang hoạt động.

PAY-BR-034

Một Payment chỉ sinh một Transaction thành công.

PAY-BR-035

Không Issue Ticket trước Payment Success.

PAY-BR-036

Transaction phải có Audit Log.

PAY-BR-037

Mọi thay đổi trạng thái đều ghi Log.

---

# 9. Payment Processing Flow

User Click Pay

↓

Create Transaction

↓

Lock Booking

↓

Redirect Gateway

↓

Gateway Payment

↓

Receive Callback

↓

Verify Signature

↓

Update Database

↓

Commit Transaction

↓

Issue Ticket

↓

Notification

---

# 10. Idempotency

Idempotency Key

↓

Receive Duplicate Request

↓

Lookup Existing Transaction

↓

Return Existing Result

↓

Không tạo Payment mới

---

# 11. Database Transaction

BEGIN

↓

Insert Payment

↓

Insert Transaction

↓

Update Booking

↓

Commit

---

Nếu lỗi

↓

Rollback

---

# 12. API

POST /payments/process

GET /payments/status/{paymentId}

POST /payments/retry

POST /payments/cancel

---

# 13. Database

payments

payment_transactions

payment_sessions

payment_status_logs

audit_logs

tickets

notifications

---

# 14. Retry Strategy

Gateway Retry

↓

Network Retry

↓

Webhook Retry

↓

Database Retry

↓

Notification Retry

---

# 15. Timeout Strategy

Payment Session

15 phút

↓

Expired

↓

Cancel Payment

↓

Release Seat

↓

Update Booking

---

# 16. Rollback Strategy

Gateway Failed

↓

Rollback Payment

↓

Release Seat

↓

Cancel Booking

↓

Notify User

---

# 17. Concurrency Control

Optimistic Lock

Transaction Lock

Booking Lock

Seat Lock

Payment Lock

---

# 18. Event Driven Flow

BookingConfirmed

↓

PaymentCreated

↓

PaymentSucceeded

↓

TicketIssued

↓

NotificationSent

↓

AuditCompleted

---

# 19. Logging

Create Payment

Gateway Request

Gateway Response

Signature Verify

Payment Update

Booking Update

Ticket Issue

---

# 20. Monitoring

Payment TPS

Payment Success Rate

Payment Failure Rate

Average Payment Time

Gateway Latency

---

# 21. Analytics

payment_processing_start

payment_processing_success

payment_processing_failed

payment_timeout

payment_retry

---

# 22. Flutter Widget Tree

LoadingScreen

↓

ProcessingAnimation

↓

WaitingGateway

↓

ResultHandler

---

# 23. State Management

PaymentProcessingBloc

PaymentRepository

GatewayRepository

TicketRepository

AuditRepository

---

# 24. Performance

Create Transaction

<300ms

Database Commit

<500ms

Ticket Issue

<1s

Entire Payment Flow

<10s

---

# 25. Security

JWT

HTTPS

TLS

HMAC

Nonce

Timestamp

Replay Protection

Idempotency

---

# 26. Test Cases

✓ Payment Success.

✓ Duplicate Request.

✓ Network Retry.

✓ Timeout.

✓ Rollback.

✓ Gateway Failure.

✓ Ticket Generation.

✓ Notification.

---

# 27. Acceptance Criteria

✓ Không tạo Payment trùng.

✓ Không tạo Ticket trùng.

✓ Rollback thành công khi lỗi.

✓ Database nhất quán.

✓ Audit đầy đủ.

---

# 28. Related Documents

Payment Callback

Payment Success

Refund

Ticket Module

Security

Architecture

---

# 29. Future Expansion

Distributed Transaction

Saga Pattern

Event Sourcing

CQRS

Kafka

RabbitMQ

Payment Queue

---

# 30. Summary

Payment Processing là trái tim của toàn bộ Payment Module.

Nó điều phối mọi giao dịch từ lúc người dùng bắt đầu thanh toán cho đến khi vé được phát hành, đảm bảo tính toàn vẹn dữ liệu, khả năng mở rộng và độ tin cậy cao của hệ thống.