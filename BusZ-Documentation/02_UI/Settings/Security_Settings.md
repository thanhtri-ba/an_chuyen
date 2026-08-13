# Security Settings

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Settings

Document ID: SETTINGS-006

Priority: Critical

Status: Draft

Version: 1.0

---

# 1. Purpose

Security Settings cho phép người dùng quản lý toàn bộ các thiết lập bảo mật của tài khoản BusZ.

Module này giúp:

- Bảo vệ tài khoản.
- Quản lý đăng nhập.
- Kiểm soát thiết bị.
- Tăng cường xác thực.
- Phát hiện truy cập bất thường.

---

# 2. Objectives

Đảm bảo:

✓ Strong Authentication.

✓ Session Protection.

✓ Device Protection.

✓ Account Recovery.

✓ Security Monitoring.

---

# 3. Actors

Customer

Authentication Service

Security Service

Device Service

Admin

Audit Service

---

# 4. Security Categories

Password

Two-Factor Authentication

Biometric Login

Passkeys (Future)

Trusted Devices

Sessions

Security Alerts

Recovery

---

# 5. Authentication Methods

Password

Email OTP

SMS OTP

Authenticator App (Future)

Face ID

Touch ID

Fingerprint

Passkey (Future)

---

# 6. Password Policy

Minimum 8 characters

Uppercase Required

Lowercase Required

Number Required

Special Character Required

Password History (Future)

Password Expiration (Configurable)

---

# 7. Session Settings

Current Session

Other Sessions

Auto Logout

Session Timeout

Revoke Session

---

# 8. Trusted Devices

Register Device

Rename Device

Remove Device

Device Information

Last Active

Operating System

Browser/App Version

---

# 9. Business Rules

SETTINGS-BR-025

Đổi mật khẩu phải thu hồi Refresh Token.

SETTINGS-BR-026

2FA chỉ bật sau khi Email hoặc Phone được xác minh.

SETTINGS-BR-027

Biometric chỉ lưu trên thiết bị.

SETTINGS-BR-028

Mọi thay đổi phải ghi Audit Log.

SETTINGS-BR-029

Thiết bị bị xóa phải đăng nhập lại.

---

# 10. Business Logic

Open Security Settings

↓

Load Security Status

↓

Update Setting

↓

Verify Identity

↓

Apply

↓

Sync

↓

Audit Log

---

# 11. API

GET /settings/security

PUT /settings/security

POST /settings/security/change-password

POST /settings/security/enable-2fa

POST /settings/security/disable-2fa

GET /settings/security/sessions

DELETE /settings/security/sessions/{id}

GET /settings/security/devices

DELETE /settings/security/devices/{id}

---

# 12. Database

security_settings

security_sessions

trusted_devices

security_events

password_history

audit_logs

---

# 13. Loading State

Loading Security Settings

↓

Changing Password

↓

Updating MFA

↓

Loading Devices

↓

Revoking Session

---

# 14. Error State

Wrong Password

↓

Show Error

---

Invalid OTP

↓

Retry

---

Expired Session

↓

Login Again

---

Biometric Failed

↓

Fallback Authentication

---

# 15. Success State

Password Changed

↓

Security Updated

↓

Devices Synced

↓

Notification Sent

---

# 16. Security Alerts

New Login

Password Changed

Email Changed

Phone Changed

New Device

Multiple Failed Logins

Suspicious Login

---

# 17. Account Recovery

Forgot Password

↓

Verify Identity

↓

Reset Password

↓

Force Logout All Sessions

↓

Complete

---

# 18. Notification

Password Changed

2FA Enabled

2FA Disabled

Device Removed

New Login Detected

Security Warning

---

# 19. Analytics

password_changed

mfa_enabled

mfa_disabled

device_removed

session_revoked

security_warning

---

# 20. Flutter Widget Tree

Scaffold

↓

SecurityOverviewCard

↓

PasswordCard

↓

TwoFactorCard

↓

TrustedDevicesCard

↓

SessionCard

↓

SecurityAlertCard

---

# 21. State Management

SecuritySettingsBloc

AuthenticationRepository

SecurityRepository

DeviceRepository

AuditRepository

---

# 22. Performance

Load Security

<1 giây

Change Password

<1 giây

Enable 2FA

<2 giây

Revoke Session

<500ms

---

# 23. Accessibility

Large Font

Screen Reader

High Contrast

Touch Area ≥48dp

Clear Security Warnings

---

# 24. Test Cases

✓ Change Password.

✓ Enable 2FA.

✓ Disable 2FA.

✓ Remove Device.

✓ Logout Other Sessions.

✓ Invalid OTP.

✓ Security Alert.

---

# 25. Acceptance Criteria

✓ Password thay đổi đúng.

✓ MFA hoạt động.

✓ Device Management hoạt động.

✓ Audit Log đầy đủ.

✓ Không rò rỉ dữ liệu.

---

# 26. Related Documents

Profile Security

Authentication

Privacy

Connected Accounts

Device Management

---

# 27. Future Expansion

Passkeys (FIDO2/WebAuthn)

Risk-based Authentication

Adaptive Authentication

Security Score

Hardware Security Key

---

# 28. Summary

Security Settings cho phép người dùng quản lý các thiết lập bảo mật của tài khoản BusZ như mật khẩu, xác thực hai lớp, thiết bị tin cậy, phiên đăng nhập và cảnh báo bảo mật, giúp tăng cường khả năng bảo vệ tài khoản và dữ liệu cá nhân.