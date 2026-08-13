# Payment Architecture

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Payment

Document ID: PAYMENT-001

Priority: Critical

Status: Draft

Version: 1.0

---

# 1. Purpose

Payment Module chịu trách nhiệm xử lý toàn bộ quy trình thanh toán của người dùng sau khi Booking được xác nhận.

Module này đảm bảo:

- Thanh toán an toàn.
- Không thanh toán trùng.
- Đồng bộ trạng thái giao dịch.
- Hỗ trợ nhiều cổng thanh toán.
- Hoàn tiền.
- Đối soát.

---

# 2. Objectives

Payment Module phải đảm bảo:

✓ Reliability

✓ Security

✓ Scalability

✓ Auditability

✓ Extensibility

---

# 3. Scope

Bao gồm

Payment Method

↓

Payment Processing

↓

Gateway

↓

Callback

↓

Transaction

↓

Refund

↓

History

Không bao gồm

Accounting

ERP

Tax System

---

# 4. Payment Flow

Booking Confirmed

↓

Create Payment Session

↓

Select Payment Method

↓

Redirect Gateway

↓

User Payment

↓

Gateway Callback

↓

Verify Signature

↓

Update Transaction

↓

Issue Ticket

↓

Notify User

---

# 5. Payment Status

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

CREATED

↓

TIMEOUT

---

SUCCESS

↓

REFUNDING

↓

REFUNDED

---

# 6. Supported Payment Methods

VNPay

MoMo

ZaloPay

Credit Card

Debit Card

Bank Transfer

Apple Pay (Future)

Google Pay (Future)

BusZ Wallet (Future)

---

# 7. Architecture

Flutter App

↓

API Gateway

↓

Payment Service

↓

Payment Gateway Adapter

↓

VNPay

MoMo

ZaloPay

↓

Database

↓

Notification Service

↓

Ticket Service

---

# 8. Core Components

Payment Service

Transaction Service

Gateway Adapter

Refund Service

Pricing Service

Audit Service

Notification Service

Security Service

---

# 9. Payment Session

Payment Session gồm

Session ID

Booking ID

User ID

Amount

Currency

Expired Time

Gateway

Status

---

# 10. Transaction Lifecycle

Create Transaction

↓

Gateway Redirect

↓

User Payment

↓

Gateway Callback

↓

Verify

↓

Update DB

↓

Issue Ticket

↓

Notify User

---

# 11. Security

HTTPS

JWT

HMAC Signature

Webhook Verification

Replay Protection

CSRF Protection

PCI DSS Ready

---

# 12. Timeout

Payment Session

15 phút

↓

Expired

↓

Booking Cancel

↓

Seat Release

---

# 13. Retry Strategy

Network Retry

Gateway Retry

Webhook Retry

Database Retry

Notification Retry

---

# 14. Error Handling

Payment Failed

Gateway Timeout

Duplicate Transaction

Signature Invalid

Expired Session

Unknown Error

---

# 15. Database

payments

payment_transactions

payment_sessions

payment_gateways

refunds

audit_logs

webhook_logs

---

# 16. API

POST /payments

GET /payments/{id}

POST /payments/callback

POST /payments/refund

GET /payments/history

---

# 17. Event Flow

BookingConfirmed

↓

PaymentCreated

↓

PaymentSuccess

↓

TicketIssued

↓

EmailSent

↓

SMS Sent

↓

Push Notification

---

# 18. State Management

PaymentBloc

PaymentRepository

GatewayRepository

TransactionRepository

RefundRepository

---

# 19. Performance

Create Payment

< 1 giây

Gateway Redirect

< 2 giây

Callback

< 2 giây

---

# 20. Scalability

Multiple Gateway

Multi Currency

Microservice Ready

Horizontal Scaling

---

# 21. Logging

Payment Request

Payment Response

Callback

Refund

Gateway Error

User Action

---

# 22. Analytics

payment_created

payment_success

payment_failed

payment_timeout

refund_created

gateway_selected

---

# 23. Acceptance Criteria

✓ Không mất giao dịch.

✓ Không thanh toán trùng.

✓ Đồng bộ trạng thái.

✓ Ticket chỉ phát hành khi Payment Success.

✓ Audit đầy đủ.

---

# 24. Related Documents

Booking Module

Ticket Module

Notification Module

Security

Database

---

# 25. Future Expansion

Apple Pay

Google Pay

Crypto

Split Payment

Installment

Subscription

BusZ Wallet

---

# 26. Summary

Payment Architecture là nền tảng của toàn bộ hệ thống thanh toán BusZ.

Module này chịu trách nhiệm xử lý mọi giao dịch tài chính từ khi tạo Payment Session cho đến khi phát hành vé và hoàn tiền.