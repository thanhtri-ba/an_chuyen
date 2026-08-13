# Ticket Validation

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Ticket

Document ID: TICKET-004

Priority: Critical

Status: Draft

Version: 1.0

---

# 1. Purpose

Ticket Validation chịu trách nhiệm xác minh tính hợp lệ của vé điện tử trước khi hành khách được phép lên xe.

Đây là thành phần quan trọng nhất của Ticket Module.

---

# 2. Objectives

Đảm bảo:

✓ Vé hợp lệ.

✓ Không giả mạo.

✓ Không Check-in nhiều lần.

✓ Đồng bộ Online.

✓ Hỗ trợ Offline.

---

# 3. Actors

Passenger

Bus Staff

Ticket Inspector

Validation Service

Backend

---

# 4. Validation Flow

Scan QR

↓

Decode Payload

↓

Verify Signature

↓

Check Ticket

↓

Check Trip

↓

Check Time

↓

Check Check-in

↓

Validation Result

---

# 5. Validation Types

Online Validation

Offline Validation

Manual Validation

Admin Validation

Automatic Validation

---

# 6. Validation Components

QR Decoder

Signature Validator

Ticket Validator

Trip Validator

Status Validator

Rule Engine

Validation Log

---

# 7. Validation Rules

Check Signature

↓

Check Ticket Status

↓

Check Booking Status

↓

Check Trip

↓

Check Passenger

↓

Check Departure Time

↓

Return Result

---

# 8. Ticket Status Validation

ACTIVE

✓ Pass

CHECKED_IN

✗ Reject

CANCELLED

✗ Reject

REFUNDED

✗ Reject

EXPIRED

✗ Reject

INVALID

✗ Reject

---

# 9. Business Rules

TICKET-BR-016

Digital Signature phải hợp lệ.

TICKET-BR-017

Ticket phải ACTIVE.

TICKET-BR-018

Trip chưa khởi hành hoặc còn trong thời gian cho phép Check-in.

TICKET-BR-019

Ticket chưa Check-in.

TICKET-BR-020

Mọi Validation phải ghi Log.

---

# 10. Validation Result

VALID

INVALID_SIGNATURE

INVALID_STATUS

EXPIRED

REFUNDED

ALREADY_CHECKED_IN

WRONG_TRIP

OUTSIDE_BOARDING_TIME

UNKNOWN_ERROR

---

# 11. Business Logic

Receive QR

↓

Decode

↓

Validate Signature

↓

Validate Ticket

↓

Validate Time

↓

Validate Route

↓

Update Validation Log

↓

Return Result

---

# 12. API

POST /tickets/validate

POST /tickets/validate/offline

GET /tickets/{id}/validation-history

POST /tickets/manual-validation

---

# 13. Database

ticket_validation_logs

tickets

ticket_status_logs

ticket_qr_codes

audit_logs

---

# 14. Offline Validation

Local QR Cache

↓

Signature Verify

↓

Ticket Cache

↓

Validation

↓

Allow Boarding

↓

Sync khi có mạng

---

# 15. Online Validation

Scan

↓

Backend

↓

Realtime Database

↓

Return Validation Result

---

# 16. Loading State

Reading QR

↓

Validating

↓

Checking Ticket

↓

Loading Result

---

# 17. Error State

Invalid QR

↓

Reject

---

Ticket Expired

↓

Reject

---

Ticket Cancelled

↓

Reject

---

Wrong Trip

↓

Reject

---

Network Error

↓

Offline Validation

---

# 18. Success State

Ticket Valid

↓

Ready Check-in

↓

Allow Boarding

---

# 19. Validation Log

Validation ID

Ticket ID

Validator ID

Time

Device ID

Location

Result

Reason

---

# 20. Notification

Validation Success

Validation Failed

Duplicate Scan

Suspicious Ticket

---

# 21. Analytics

ticket_validated

validation_success

validation_failed

duplicate_scan

offline_validation

---

# 22. Flutter Widget Tree

ScannerScreen

↓

CameraPreview

↓

ValidationAnimation

↓

ValidationResultCard

↓

ActionButton

---

# 23. State Management

ValidationBloc

ScannerBloc

TicketRepository

ValidationRepository

---

# 24. Performance

QR Decode

<200ms

Validation

<500ms

Offline Validation

<300ms

---

# 25. Accessibility

Camera Guidance

Vibration Feedback

Audio Feedback

Large Status Text

Screen Reader

---

# 26. Test Cases

✓ Valid Ticket.

✓ Invalid Signature.

✓ Expired Ticket.

✓ Cancelled Ticket.

✓ Refunded Ticket.

✓ Duplicate Scan.

✓ Offline Validation.

✓ Wrong Trip.

---

# 27. Acceptance Criteria

✓ Validation chính xác.

✓ Không Check-in trùng.

✓ Offline hoạt động.

✓ Validation Log đầy đủ.

✓ Không crash.

---

# 28. Related Documents

QR Code

Check-in

Ticket Security

Boarding Process

Payment Success

---

# 29. Future Expansion

Face Recognition

NFC Validation

BLE Validation

AI Fraud Detection

Biometric Verification

Smart Gate Integration

---

# 30. Summary

Ticket Validation là lớp xác minh trung tâm của Ticket Module.

Hệ thống phải kiểm tra chữ ký số, trạng thái vé, thời gian, chuyến xe và lịch sử Check-in trước khi cho phép hành khách lên xe, đồng thời hỗ trợ cả xác thực trực tuyến và ngoại tuyến.