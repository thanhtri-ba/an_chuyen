# Profile Security

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Profile

Document ID: PROFILE-010

Priority: Critical

Status: Draft

Version: 1.0

---

# 1. Purpose

Profile Security định nghĩa toàn bộ cơ chế bảo vệ tài khoản người dùng và dữ liệu cá nhân trong hệ thống BusZ.

Module này giúp:

- Bảo vệ tài khoản.
- Ngăn truy cập trái phép.
- Quản lý thiết bị.
- Ghi nhận hoạt động bảo mật.
- Đảm bảo tuân thủ chính sách bảo mật.

---

# 2. Objectives

Đảm bảo:

✓ Authentication.

✓ Authorization.

✓ Device Security.

✓ Session Security.

✓ Personal Data Protection.

---

# 3. Security Components

Authentication

↓

Session Management

↓

Device Management

↓

Password Management

↓

Security Activity

↓

Privacy Protection

---

# 4. Actors

Customer

Authentication Service

Security Service

Admin

Customer Support

---

# 5. Security Features

Password Change

Email Verification

Phone Verification

Multi-factor Authentication (Future)

Trusted Devices

Session Management

Login History

Security Alerts

---

# 6. Security Lifecycle

Register

↓

Verify Email

↓

Login

↓

Trusted Device

↓

Manage Sessions

↓

Logout

↓

Archive Activity

---

# 7. Device Management

Current Device

Trusted Devices

Recent Devices

Remove Device

Device Information

Last Login Time

---

# 8. Session Management

Current Session

Other Active Sessions

Terminate Session

Auto Expiration

Refresh Token

---

# 9. Password Policy

Minimum 8 characters

At least one uppercase letter

At least one lowercase letter

At least one number

At least one special character

Password History (Future)

---

# 10. Business Rules

PROFILE-BR-043

Password phải được mã hóa.

PROFILE-BR-044

Không lưu mật khẩu dạng Plain Text.

PROFILE-BR-045

Email thay đổi phải xác minh lại.

PROFILE-BR-046

Đổi mật khẩu sẽ thu hồi Refresh Token cũ.

PROFILE-BR-047

Mọi sự kiện bảo mật phải ghi Audit Log.

---

# 11. Business Logic

User Login

↓

Verify Credential

↓

Issue Token

↓

Register Session

↓

Device Verification

↓

Allow Access

---

# 12. API

GET /profile/security

POST /profile/security/change-password

GET /profile/security/devices

DELETE /profile/security/devices/{id}

GET /profile/security/sessions

DELETE /profile/security/sessions/{id}

---

# 13. Database

security_sessions

trusted_devices

login_history

security_events

profiles

audit_logs

---

# 14. Loading State

Loading Security Settings

↓

Updating Password

↓

Loading Devices

↓

Revoking Session

---

# 15. Error State

Wrong Password

↓

Show Error

---

Expired Session

↓

Login Again

---

Unauthorized Device

↓

Verify Identity

---

Network Error

↓

Retry

---

# 16. Success State

Password Updated

↓

Device Removed

↓

Session Revoked

↓

Security Updated

---

# 17. Login History

Login Time

Logout Time

IP Address

Device Name

Operating System

Browser / App Version

Location (Approximate)

Status

---

# 18. Notification

New Login Detected

Password Changed

Email Changed

Phone Changed

New Device Added

Session Terminated

---

# 19. Analytics

password_changed

new_device

login_success

login_failed

session_revoked

security_alert

---

# 20. Flutter Widget Tree

Scaffold

↓

SecurityOverviewCard

↓

DeviceList

↓

SessionList

↓

PasswordCard

↓

SecurityActivityCard

---

# 21. State Management

ProfileSecurityBloc

AuthenticationRepository

SecurityRepository

DeviceRepository

---

# 22. Performance

Load Security

<1 giây

Change Password

<1 giây

Revoke Session

<500ms

---

# 23. Accessibility

Large Font

Screen Reader

Security Warning Dialog

Touch Area ≥48dp

---

# 24. Test Cases

✓ Change Password.

✓ Remove Device.

✓ Logout Other Devices.

✓ Invalid Password.

✓ Expired Session.

✓ Security Notification.

---

# 25. Acceptance Criteria

✓ Password mã hóa.

✓ Session quản lý đúng.

✓ Device hoạt động đúng.

✓ Audit Log đầy đủ.

✓ Không rò rỉ dữ liệu.

---

# 26. Related Documents

Authentication

Identity Verification

Account Settings

Payment Security

Ticket Security

---

# 27. Future Expansion

Multi-factor Authentication (MFA)

Passkeys (FIDO2/WebAuthn)

Biometric Authentication

Risk-based Authentication

Adaptive Authentication

Security Score

---

# 28. Summary

Profile Security cung cấp các cơ chế bảo vệ tài khoản người dùng, bao gồm quản lý mật khẩu, thiết bị, phiên đăng nhập và nhật ký hoạt động bảo mật, giúp đảm bảo an toàn cho dữ liệu cá nhân và tài khoản BusZ.