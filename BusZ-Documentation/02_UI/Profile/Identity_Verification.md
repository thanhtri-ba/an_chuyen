# Identity Verification

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Profile

Document ID: PROFILE-004

Priority: High

Status: Draft

Version: 1.0

---

# 1. Purpose

Identity Verification quản lý toàn bộ quy trình xác minh danh tính của người dùng nhằm tăng độ tin cậy và đáp ứng các yêu cầu của nhà xe hoặc quy định pháp luật.

Module này hỗ trợ nhiều mức xác minh khác nhau tùy theo chính sách của BusZ.

---

# 2. Objectives

Đảm bảo:

✓ Xác minh đúng người dùng.

✓ Bảo vệ tài khoản.

✓ Hỗ trợ KYC.

✓ Chống giả mạo.

✓ Lưu đầy đủ lịch sử xác minh.

---

# 3. Verification Types

Email Verification

Phone Verification (OTP)

Identity Document Verification

Passport Verification

Face Verification (Future)

---

# 4. Verification Levels

Level 0

Unverified

↓

Level 1

Email Verified

↓

Level 2

Phone Verified

↓

Level 3

Identity Verified

↓

Level 4

Enhanced Verification (Future)

---

# 5. Actors

Customer

Customer Support

Admin

Verification Service

Notification Service

---

# 6. Identity Lifecycle

Register

↓

Verify Email

↓

Verify Phone

↓

Upload Document

↓

Review

↓

Verified

---

Rejected

↓

Resubmit

---

# 7. Supported Documents

Citizen ID

Passport

Driving License

Residence Card

(Theo quốc gia được hỗ trợ)

---

# 8. Verification Status

NOT_VERIFIED

PENDING

UNDER_REVIEW

VERIFIED

REJECTED

EXPIRED

---

# 9. Business Rules

PROFILE-BR-014

Email phải được xác minh trước khi xác minh giấy tờ.

PROFILE-BR-015

Một tài khoản chỉ có một hồ sơ xác minh đang hoạt động.

PROFILE-BR-016

Giấy tờ phải còn hiệu lực.

PROFILE-BR-017

Dữ liệu định danh phải được mã hóa.

PROFILE-BR-018

Mọi thay đổi phải ghi Audit Log.

---

# 10. Verification Flow

Submit Request

↓

Validate Data

↓

Upload Documents

↓

Manual / Automatic Review

↓

Approve

Hoặc

Reject

↓

Update Profile

---

# 11. API

POST /verification/email

POST /verification/phone

POST /verification/document

GET /verification/status

POST /verification/resubmit

---

# 12. Database

verification_requests

verification_documents

verification_logs

profiles

audit_logs

---

# 13. Validation

Email Format

↓

Phone Format

↓

Document Format

↓

Document Expiration

↓

Identity Match

---

# 14. Loading State

Uploading Document

↓

Processing Verification

↓

Updating Status

---

# 15. Error State

Invalid OTP

↓

Retry

---

Expired OTP

↓

Request New OTP

---

Document Rejected

↓

Resubmit

---

Network Error

↓

Retry

---

# 16. Success State

Verification Completed

↓

Update Profile

↓

Enable Verified Features

---

# 17. Security

AES-256 Encryption

HTTPS

JWT Authentication

Access Control

Secure File Storage

---

# 18. Notification

Email Verified

Phone Verified

Verification Submitted

Verification Approved

Verification Rejected

---

# 19. Analytics

verification_started

email_verified

phone_verified

document_uploaded

verification_completed

verification_failed

---

# 20. Flutter Widget Tree

Scaffold

↓

VerificationStatusCard

↓

VerificationTypeList

↓

DocumentUploadCard

↓

OTPInput

↓

SubmitButton

---

# 21. State Management

VerificationBloc

ProfileRepository

VerificationRepository

StorageRepository

---

# 22. Performance

OTP Verification

<500ms

Document Upload

<5 giây

Status Update

<1 giây

---

# 23. Accessibility

Large Text

Screen Reader

Camera Accessibility

Touch Area ≥48dp

---

# 24. Test Cases

✓ Email Verification.

✓ Phone Verification.

✓ Upload CCCD.

✓ Invalid OTP.

✓ Expired OTP.

✓ Rejected Document.

✓ Retry Verification.

---

# 25. Acceptance Criteria

✓ Verification hoạt động đúng.

✓ Hồ sơ được cập nhật.

✓ Tài liệu được lưu an toàn.

✓ Audit Log đầy đủ.

✓ Không rò rỉ dữ liệu.

---

# 26. Related Documents

Profile Detail

Edit Profile

Profile Security

Passenger Management

Authentication

---

# 27. Future Expansion

eKYC Integration

Face Recognition

Liveness Detection

Government API Integration

Digital Identity Wallet

---

# 28. Summary

Identity Verification giúp xác minh danh tính người dùng thông qua Email, số điện thoại và giấy tờ tùy thân.

Hệ thống đảm bảo dữ liệu được xử lý an toàn, hỗ trợ nhiều cấp độ xác minh và cung cấp nền tảng cho các tính năng yêu cầu mức độ tin cậy cao.