# Ticket Security

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Ticket

Document ID: TICKET-010

Priority: Critical

Status: Draft

Version: 1.0

---

# 1. Purpose

Ticket Security định nghĩa toàn bộ cơ chế bảo mật của vé điện tử trong BusZ.

Mục tiêu:

- Chống làm giả vé.
- Chống chỉnh sửa dữ liệu.
- Chống sao chép QR.
- Bảo vệ quyền sở hữu vé.
- Phát hiện hành vi bất thường.

---

# 2. Objectives

Đảm bảo:

✓ Authenticity

✓ Integrity

✓ Confidentiality

✓ Availability

✓ Non-Repudiation

---

# 3. Security Architecture

Flutter App

↓

Authentication

↓

Ticket Service

↓

QR Security

↓

Validation Service

↓

Audit Service

↓

Monitoring

---

# 4. Security Layers

Authentication

↓

Authorization

↓

QR Protection

↓

Validation

↓

Audit

↓

Monitoring

---

# 5. Authentication

JWT

Refresh Token

Session Validation

Device Validation

Biometric Authentication (Future)

---

# 6. Authorization

Passenger

Customer

Bus Staff

Operator

Admin

Super Admin

Role-Based Access Control (RBAC)

---

# 7. Ticket Ownership

Một Ticket chỉ thuộc về một chủ sở hữu tại một thời điểm.

Sau khi Transfer thành công:

↓

Owner Update

↓

History Update

↓

Audit Log

---

# 8. QR Protection

Digital Signature

Encrypted Payload

Replay Protection

Expiration Validation

Version Validation

---

# 9. Anti-Copy Protection

QR Watermark (Future)

Dynamic QR (Future)

Device Binding (Optional)

Secure Screenshot Detection (Future)

Session Validation

---

# 10. Business Rules

TICKET-BR-047

QR phải có Digital Signature.

TICKET-BR-048

QR không chứa dữ liệu nhạy cảm.

TICKET-BR-049

Ticket chỉ hiển thị cho chủ sở hữu.

TICKET-BR-050

Security Event phải ghi Audit Log.

TICKET-BR-051

Replay Attack phải bị từ chối.

---

# 11. Replay Protection

Receive QR

↓

Lookup Validation Log

↓

Already Used?

↓

Yes

↓

Reject

↓

Alert

---

No

↓

Continue

---

# 12. Device Verification

Login

↓

Device Fingerprint

↓

Trusted Device

↓

Continue

---

Unknown Device

↓

Extra Verification

---

# 13. Access Control

Customer

↓

Own Ticket

✓

---

Bus Staff

↓

Assigned Trip

✓

---

Operator

↓

Managed Company

✓

---

Admin

↓

All Tickets

✓

---

# 14. API Security

JWT Authentication

HTTPS

Rate Limiting

Input Validation

Output Filtering

---

# 15. Database Security

Encrypted Connection

Read Only History

Audit Trigger

Least Privilege

Backup Encryption

---

# 16. Logging

Ticket Viewed

QR Generated

QR Scanned

Check-in

Transfer

Cancellation

Refund

Suspicious Activity

---

# 17. Security Event

Replay Attack

QR Tampering

Unauthorized Access

Unknown Device

Abnormal Validation

Mass QR Scan

---

# 18. Monitoring

Failed Validation

Replay Count

Invalid QR

Unauthorized Access

Device Change

High Risk Activity

---

# 19. Incident Response

Detect

↓

Alert

↓

Investigate

↓

Contain

↓

Recover

↓

Audit

---

# 20. Analytics

ticket_security_alert

replay_attack

invalid_qr

unauthorized_access

device_verification

---

# 21. Flutter Widget Tree

Không có màn hình riêng.

Các thành phần bảo mật hoạt động nền (background).

---

# 22. State Management

TicketSecurityRepository

ValidationRepository

AuditRepository

AuthenticationRepository

---

# 23. Performance

Signature Verify

<200ms

Replay Check

<100ms

Authorization

<100ms

---

# 24. Accessibility

Security Warning

Readable Message

Support Contact

---

# 25. Test Cases

✓ Invalid Signature.

✓ Replay Attack.

✓ QR Tampering.

✓ Unauthorized Access.

✓ Device Change.

✓ Trusted Device.

---

# 26. Acceptance Criteria

✓ QR an toàn.

✓ Replay bị chặn.

✓ Audit đầy đủ.

✓ RBAC hoạt động.

✓ Không rò rỉ dữ liệu.

---

# 27. Related Documents

QR Code

Ticket Validation

Check-in

Payment Security

Fraud Prevention

---

# 28. Future Expansion

Dynamic QR

NFC Security

Biometric Verification

Zero Trust Access

Hardware Security Key

AI Threat Detection

---

# 29. Summary

Ticket Security là lớp bảo vệ toàn diện cho Ticket Module.

Hệ thống sử dụng xác thực, phân quyền, chữ ký số, kiểm tra phát lại và ghi nhật ký bảo mật để đảm bảo vé điện tử không bị giả mạo, sao chép hoặc sử dụng trái phép.