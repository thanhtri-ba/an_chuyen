# Fraud Prevention

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Payment

Document ID: PAYMENT-015

Priority: Critical

Status: Draft

Version: 1.0

---

# 1. Purpose

Fraud Prevention định nghĩa toàn bộ hệ thống phát hiện và ngăn chặn gian lận trong BusZ.

Module này giúp:

- Phát hiện giao dịch bất thường.
- Giảm rủi ro tài chính.
- Ngăn thanh toán giả.
- Hỗ trợ Manual Review.
- Tăng độ tin cậy của hệ thống.

---

# 2. Objectives

✓ Prevent Fraud

✓ Detect Suspicious Activity

✓ Reduce Financial Loss

✓ Protect Customer

✓ Protect Merchant

---

# 3. Actors

Customer

Fraud Detection Engine

Risk Engine

Payment Service

Admin

Customer Support

Finance

---

# 4. Fraud Detection Flow

Create Payment

↓

Collect Risk Signals

↓

Calculate Risk Score

↓

Decision Engine

↓

Approve

Review

Reject

↓

Payment Processing

---

# 5. Risk Signals

Device Fingerprint

IP Address

Country

GPS Location

Browser Fingerprint

Operating System

Network Type

Payment History

Booking History

Velocity

---

# 6. Risk Score

0–30

↓

Low Risk

Approve

---

31–70

↓

Medium Risk

Manual Review

---

71–100

↓

High Risk

Reject

---

# 7. Business Rules

PAY-BR-063

High Risk Transaction phải bị chặn.

PAY-BR-064

Medium Risk cần Manual Review.

PAY-BR-065

Low Risk tự động tiếp tục.

PAY-BR-066

Risk Score phải lưu Database.

PAY-BR-067

Fraud Event phải ghi Audit Log.

---

# 8. Fraud Indicators

Nhiều Payment liên tục.

↓

Khác Quốc gia.

↓

Nhiều Device.

↓

Nhiều Card.

↓

VPN.

↓

TOR Network.

↓

Proxy.

↓

Blacklisted BIN.

↓

Blacklisted IP.

↓

Chargeback History.

---

# 9. Velocity Check

5 Payment

↓

5 phút

↓

Flag

---

10 Booking

↓

10 phút

↓

Review

---

Multiple Account

↓

Same Device

↓

Review

---

# 10. Device Fingerprinting

Device ID

Browser ID

Operating System

Screen Resolution

Timezone

Language

Installed Fonts (Future)

Canvas Fingerprint (Future)

---

# 11. Geo Verification

GPS

IP Location

Country

Region

Travel Speed Check

---

# 12. Blacklist

User

Email

Phone

Card Token

IP

Device

BIN

Gateway Reference

---

# 13. Whitelist

Trusted Customer

VIP Member

Internal Testing

Trusted Device

Corporate Account

---

# 14. Manual Review

Fraud Queue

↓

Review

↓

Approve

Reject

↓

Notification

---

# 15. API

POST /fraud/check

GET /fraud/score

POST /fraud/review

POST /fraud/approve

POST /fraud/reject

---

# 16. Database

fraud_events

fraud_scores

fraud_rules

fraud_reviews

blacklists

whitelists

risk_profiles

audit_logs

---

# 17. Fraud Status

PENDING

UNDER_REVIEW

APPROVED

REJECTED

BLOCKED

---

# 18. Notification

Transaction Blocked

Manual Review

Fraud Alert

Account Locked

Security Verification Required

---

# 19. Logging

Fraud Event

Risk Score

Rule Trigger

Manual Review

Admin Action

Security Alert

---

# 20. Monitoring

Fraud Rate

Chargeback Rate

Blocked Transaction

False Positive

Review Queue

Gateway Abuse

---

# 21. Analytics

fraud_detected

fraud_blocked

manual_review

risk_score

false_positive

blocked_payment

---

# 22. Flutter Widget Tree

Không có màn hình riêng.

Fraud Prevention hoạt động ở Backend.

Flutter chỉ nhận kết quả:

Approved

Review

Rejected

---

# 23. State Management

FraudRepository

PaymentRepository

SecurityRepository

---

# 24. Performance

Fraud Check

<500ms

Risk Score

Realtime

Blacklist Lookup

<100ms

---

# 25. Accessibility

Readable Error Message

Support Contact

Security Notice

---

# 26. Test Cases

✓ VPN Detection.

✓ High Velocity.

✓ Blacklisted Device.

✓ Blacklisted Card.

✓ Manual Review.

✓ False Positive.

✓ Whitelist.

---

# 27. Acceptance Criteria

✓ Fraud Score chính xác.

✓ Review Queue hoạt động.

✓ High Risk bị chặn.

✓ Audit đầy đủ.

✓ Không ảnh hưởng Payment bình thường.

---

# 28. Related Documents

Payment Security

Payment Processing

Payment Callback

Refund

Audit Log

Risk Engine

---

# 29. Future Expansion

Machine Learning Risk Engine

Behavior Analytics

AI Fraud Detection

Real-time Threat Intelligence

Consortium Blacklist

Adaptive Authentication

Behavior Biometrics

---

# 30. Summary

Fraud Prevention là lớp bảo vệ cuối cùng của Payment Module.

Hệ thống đánh giá rủi ro dựa trên nhiều tín hiệu như thiết bị, vị trí, lịch sử giao dịch và hành vi người dùng để quyết định tự động chấp nhận, yêu cầu kiểm tra thủ công hoặc từ chối giao dịch nhằm giảm thiểu gian lận và bảo vệ cả khách hàng lẫn BusZ.