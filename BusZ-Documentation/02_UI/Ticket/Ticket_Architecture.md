# Ticket Architecture

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Ticket

Document ID: TICKET-001

Priority: Critical

Status: Draft

Version: 1.0

---

# 1. Purpose

Ticket Module chịu trách nhiệm quản lý toàn bộ vòng đời của vé điện tử sau khi thanh toán thành công.

Bao gồm:

- Phát hành vé
- Sinh QR Code
- Check-in
- Kiểm tra vé
- Hủy vé
- Hoàn vé
- Chuyển vé
- Lịch sử vé

---

# 2. Objectives

Đảm bảo:

✓ Vé chỉ phát hành sau Payment Success.

✓ Vé không thể giả mạo.

✓ Vé có thể xác thực Offline.

✓ Vé có QR Code.

✓ Vé có thể kiểm tra theo thời gian thực.

---

# 3. Scope

Bao gồm

Ticket Generation

↓

QR Code

↓

Validation

↓

Check-in

↓

Transfer

↓

Cancellation

↓

Refund

↓

History

Không bao gồm

Payment

Bus Operation

Driver Management

---

# 4. Actors

Customer

Passenger

Bus Staff

Ticket Inspector

Backend

Notification Service

Payment Service

Booking Service

---

# 5. Ticket Lifecycle

Booking Confirmed

↓

Payment Success

↓

Generate Ticket

↓

Generate QR

↓

Issue Ticket

↓

Active

↓

Checked In

↓

Completed

---

Cancelled

↓

Refunded

---

Expired

---

# 6. Ticket Status

CREATED

ISSUED

ACTIVE

CHECKED_IN

COMPLETED

CANCELLED

REFUNDED

EXPIRED

INVALID

---

# 7. Ticket Components

Ticket Number

Booking Code

Passenger

Seat

Route

Bus Company

QR Code

Issue Date

Status

---

# 8. Architecture

Flutter

↓

API Gateway

↓

Ticket Service

↓

QR Generator

↓

Validation Service

↓

Database

↓

Notification

---

# 9. Core Services

Ticket Service

QR Service

Validation Service

Check-in Service

History Service

Notification Service

Audit Service

---

# 10. Ticket Generation Flow

Payment Success

↓

Generate Ticket Number

↓

Generate QR

↓

Save Database

↓

Notification

↓

Customer

---

# 11. Business Rules

TICKET-BR-001

Một Booking có thể có nhiều Ticket.

TICKET-BR-002

Một Passenger chỉ có một Ticket.

TICKET-BR-003

QR Code là duy nhất.

TICKET-BR-004

Không được tạo Ticket trước Payment Success.

TICKET-BR-005

Ticket phải có Audit Log.

---

# 12. API

POST /tickets

GET /tickets/{id}

GET /tickets/{id}/qr

POST /tickets/validate

POST /tickets/check-in

---

# 13. Database

tickets

ticket_qr_codes

ticket_status_logs

ticket_history

ticket_validation_logs

---

# 14. Security

QR Signature

Encrypted QR

JWT

HTTPS

Replay Protection

---

# 15. Performance

Generate Ticket

<500ms

Generate QR

<1 giây

Validate Ticket

<500ms

---

# 16. Analytics

ticket_created

ticket_issued

ticket_checked_in

ticket_cancelled

ticket_refunded

---

# 17. Acceptance Criteria

✓ Ticket sinh thành công.

✓ QR hợp lệ.

✓ Không Duplicate Ticket.

✓ Ticket đồng bộ Booking.

✓ Ticket đồng bộ Payment.

---

# 18. Related Documents

Payment Success

Booking

QR Code

Check-in

Notification

---

# 19. Future Expansion

Apple Wallet

Google Wallet

NFC Ticket

Offline Ticket

Blockchain Verification

Digital Identity

---

# 20. Summary

Ticket Architecture là nền tảng của toàn bộ Ticket Module.

Module chịu trách nhiệm phát hành, quản lý, xác thực và theo dõi toàn bộ vòng đời của vé điện tử sau khi khách hàng thanh toán thành công.