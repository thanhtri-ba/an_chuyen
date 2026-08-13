# Ticket QR Code

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Ticket

Document ID: TICKET-003

Priority: Critical

Status: Draft

Version: 1.0

---

# 1. Purpose

QR Code là định danh điện tử của mỗi vé.

QR không chỉ dùng để hiển thị.

QR là phương thức xác thực vé nhanh nhất khi lên xe.

---

# 2. Objectives

✓ QR duy nhất.

✓ Không giả mạo.

✓ Xác thực nhanh.

✓ Hỗ trợ Offline.

✓ Chống Replay Attack.

---

# 3. Actors

Passenger

Customer

Bus Staff

Ticket Inspector

Backend

Validation Service

---

# 4. QR Lifecycle

Generate

↓

Issue

↓

Display

↓

Scan

↓

Validate

↓

Check-in

↓

Archive

---

Expired

↓

Invalid

---

# 5. QR Components

QR Image

QR Payload

Digital Signature

Issue Time

Expire Time

Validation Status

---

# 6. QR Payload

Ticket ID

Booking ID

Passenger ID

Seat Number

Trip ID

Issue Timestamp

Signature

Version

Payload không chứa:

CCCD

Phone

Email

Payment Information

---

# 7. QR Status

GENERATED

ACTIVE

SCANNED

CHECKED_IN

EXPIRED

REVOKED

INVALID

---

# 8. Business Rules

TICKET-BR-011

QR chỉ sinh sau Payment Success.

TICKET-BR-012

Một Ticket chỉ có một QR đang ACTIVE.

TICKET-BR-013

QR phải có Digital Signature.

TICKET-BR-014

QR hết hiệu lực khi Ticket bị hủy hoặc hoàn tiền.

TICKET-BR-015

Không tái sử dụng QR sau khi Check-in (nếu chính sách yêu cầu).

---

# 9. QR Generation Flow

Payment Success

↓

Generate Ticket

↓

Generate QR Payload

↓

Sign Payload

↓

Create QR Image

↓

Save Database

↓

Display

---

# 10. QR Validation Flow

Scan QR

↓

Decode Payload

↓

Verify Signature

↓

Check Ticket Status

↓

Check Expiration

↓

Check Check-in Status

↓

Approve

Hoặc

Reject

---

# 11. QR Signature

Algorithm

ECDSA (Recommended)

Hoặc

RSA-2048

Hoặc

HMAC SHA256 (Internal)

Digital Signature phải được xác minh trước khi chấp nhận vé.

---

# 12. Offline Validation

QR Scan

↓

Decode

↓

Verify Signature

↓

Verify Local Cache

↓

Allow Boarding

↓

Sync Later

---

# 13. Online Validation

QR Scan

↓

Backend

↓

Check Ticket

↓

Check Status

↓

Return Result

---

# 14. API

POST /tickets/{id}/qr

GET /tickets/{id}/qr

POST /tickets/validate-qr

POST /tickets/revoke-qr

---

# 15. Database

ticket_qr_codes

tickets

ticket_validation_logs

ticket_status_logs

audit_logs

---

# 16. Security

Encrypted Payload

Digital Signature

Replay Protection

Nonce

Timestamp Validation

QR Versioning

---

# 17. Replay Protection

Scan QR

↓

Already Used?

↓

Yes

↓

Reject

↓

Log Event

---

No

↓

Continue Validation

---

# 18. Loading State

Generating QR

↓

Loading QR

↓

Refreshing QR (Future)

---

# 19. Error State

QR Invalid

↓

Reject

---

QR Expired

↓

Reject

---

Signature Invalid

↓

Reject

---

Network Error

↓

Offline Validation

---

# 20. Success State

QR Valid

↓

Check-in Allowed

↓

Boarding

---

# 21. QR Refresh Policy

Static QR

(Default)

---

Dynamic QR

(Future)

Refresh mỗi

30 giây

---

# 22. Analytics

qr_generated

qr_scanned

qr_valid

qr_invalid

qr_expired

replay_detected

---

# 23. Flutter Widget Tree

Scaffold

↓

TicketHeader

↓

QRCodeWidget

↓

StatusBadge

↓

RefreshIndicator (Future)

↓

InstructionCard

---

# 24. State Management

QRBloc

TicketBloc

ValidationRepository

SecurityRepository

---

# 25. Performance

Generate QR

<500ms

QR Validation

<300ms

Scan Result

<1 giây

---

# 26. Accessibility

High Contrast QR

Screen Reader

Large QR

Brightness Boost (Future)

---

# 27. Test Cases

✓ Generate QR.

✓ Scan QR.

✓ Replay Attack.

✓ Invalid Signature.

✓ Expired QR.

✓ Offline Validation.

✓ Online Validation.

---

# 28. Acceptance Criteria

✓ QR duy nhất.

✓ Signature hợp lệ.

✓ Không Replay.

✓ Check-in đúng.

✓ Không Duplicate.

---

# 29. Related Documents

Ticket Detail

Ticket Validation

Check-in

Ticket Security

Payment Success

---

# 30. Future Expansion

Dynamic QR

Animated QR

NFC Ticket

Apple Wallet

Google Wallet

Bluetooth Validation

Face Verification

---

# 31. Summary

QR Code là định danh điện tử của vé trong BusZ.

Mỗi QR phải được ký số, xác thực trước khi sử dụng và được bảo vệ khỏi việc sao chép hoặc phát lại nhằm đảm bảo tính an toàn và chính xác trong quá trình lên xe.