# Payment Gateways Research

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Research

Document ID

RES-004

Priority

High

Version

1.0

---

# 1. Purpose

Payment Gateways Research nghiên cứu các cổng thanh toán trong nước và quốc tế nhằm lựa chọn giải pháp thanh toán phù hợp cho BusZ, đảm bảo tính bảo mật, khả năng mở rộng và trải nghiệm người dùng.

Mục tiêu

- Đa dạng phương thức thanh toán
- Giảm tỷ lệ thanh toán thất bại
- Tăng Conversion Rate
- Đảm bảo PCI DSS
- Hỗ trợ mở rộng quốc tế

---

# 2. Objectives

```text
Payment Integration

Security

Scalability

Reliability

International Support
```

---

# 3. Supported Payment Types

```text
Credit Card

Debit Card

Bank Transfer

QR Payment

E-Wallet

Apple Pay

Google Pay

Internet Banking
```

---

# 4. Vietnam Payment Gateways

```text
VNPay

MoMo

ZaloPay

VietQR

PayOS

OnePay

Napas
```

---

# 5. International Payment Gateways

```text
Stripe

PayPal

Adyen

2Checkout

Checkout.com

Braintree
```

---

# 6. Comparison Matrix

| Gateway | Card | QR | Wallet | Refund | Subscription | International |
|----------|:---:|:--:|:------:|:------:|:------------:|:-------------:|
| Stripe | ✅ | ❌ | Apple/Google | ✅ | ✅ | ✅ |
| PayPal | ✅ | ❌ | PayPal | ✅ | ✅ | ✅ |
| VNPay | ✅ | ✅ | ❌ | ✅ | ❌ | 🇻🇳 |
| MoMo | ❌ | ✅ | ✅ | ✅ | ❌ | 🇻🇳 |
| ZaloPay | ❌ | ✅ | ✅ | ✅ | ❌ | 🇻🇳 |
| PayOS | ✅ | ✅ | ❌ | ✅ | ❌ | 🇻🇳 |

---

# 7. Recommended Architecture

```text
Flutter App

↓

Backend API

↓

Payment Service

↓

Gateway Adapter

↓

Payment Gateway

↓

Bank / Wallet
```

---

# 8. Payment Flow

```text
Booking

↓

Create Payment

↓

Gateway

↓

Customer Payment

↓

Webhook

↓

Verify

↓

Issue Ticket
```

---

# 9. Payment Status

```text
Pending

Processing

Success

Failed

Cancelled

Expired

Refunded

Partially Refunded
```

---

# 10. Webhook Processing

```text
Receive Webhook

↓

Verify Signature

↓

Update Payment

↓

Issue Ticket

↓

Notify Customer
```

---

# 11. Refund Flow

```text
Customer Request

↓

Approval

↓

Gateway Refund

↓

Payment Updated

↓

Notification
```

---

# 12. Security Requirements

```text
HTTPS

PCI DSS

Webhook Signature

JWT

Encryption

Idempotency Key
```

---

# 13. Fraud Prevention

```text
Duplicate Payment Detection

Rate Limiting

Risk Scoring

IP Monitoring

Device Fingerprinting
```

---

# 14. Performance Targets

```text
Payment API

<500 ms

Webhook Processing

<5 Seconds

Payment Success

>98%

Availability

99.9%
```

---

# 15. Monitoring

```text
Payment Success Rate

Gateway Response Time

Failed Payments

Refund Volume

Webhook Errors
```

---

# 16. Future Enhancements

```text
Split Payment

Installment Payment

Auto Refund

Recurring Payment

Corporate Billing

Cryptocurrency (Future)
```

---

# 17. Recommended Strategy

Giai đoạn MVP

```text
VNPay

MoMo

PayOS
```

Giai đoạn mở rộng

```text
Stripe

PayPal

Apple Pay

Google Pay
```

---

# 18. Acceptance Criteria

✓ Multiple Payment Methods

✓ Secure Payment

✓ Refund Support

✓ Webhook Verification

✓ Monitoring Dashboard

✓ Enterprise-ready Architecture

---

# 19. Related Documents

Payment Process

Payment API

Fraud Detection

Dynamic Pricing

Security Architecture

---

# 20. Summary

BusZ sử dụng kiến trúc Payment Service kết hợp Gateway Adapter để tích hợp nhiều cổng thanh toán mà không phụ thuộc vào một nhà cung cấp duy nhất. Trong giai đoạn đầu, hệ thống ưu tiên VNPay, MoMo và PayOS cho thị trường Việt Nam; khi mở rộng quốc tế sẽ bổ sung Stripe, PayPal, Apple Pay và Google Pay. Kiến trúc này giúp hệ thống dễ mở rộng, tăng độ ổn định và giảm rủi ro khi tích hợp thanh toán.