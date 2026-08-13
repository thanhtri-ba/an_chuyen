# Device Management

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Settings

Document ID: SETTINGS-008

Priority: Critical

Status: Draft

Version: 1.0

---

# 1. Purpose

Device Management cho phép người dùng quản lý toàn bộ các thiết bị đã và đang đăng nhập vào tài khoản BusZ.

Module này giúp:

- Kiểm soát thiết bị.
- Bảo vệ tài khoản.
- Đăng xuất từ xa.
- Phát hiện truy cập bất thường.

---

# 2. Objectives

Đảm bảo:

✓ Quản lý thiết bị.

✓ Quản lý phiên đăng nhập.

✓ Bảo mật.

✓ Đồng bộ thời gian thực.

✓ Phát hiện rủi ro.

---

# 3. Actors

Customer

Authentication Service

Security Service

Device Service

Admin

---

# 4. Device Lifecycle

Login

↓

Register Device

↓

Trusted Device

↓

Use

↓

Logout

↓

Remove Device

↓

Archive

---

# 5. Device Information

Device ID

Device Name

Operating System

Device Model

App Version

Browser

IP Address

Approximate Location

First Login

Last Active

Trusted Status

Current Device

---

# 6. Device Types

Android

iPhone

iPad

Web Browser

Windows

macOS

Linux

Future Devices

---

# 7. Device Status

Active

Inactive

Trusted

Blocked

Logged Out

Suspicious

---

# 8. Business Rules

SETTINGS-BR-035

Một User có thể đăng nhập trên nhiều thiết bị.

SETTINGS-BR-036

Current Device không thể tự xóa.

SETTINGS-BR-037

Remove Device sẽ thu hồi Refresh Token.

SETTINGS-BR-038

Thiết bị bất thường phải cảnh báo.

SETTINGS-BR-039

Audit Log bắt buộc.

---

# 9. Business Logic

Open Device List

↓

Load Devices

↓

Select Device

↓

View Detail

↓

Remove

↓

Revoke Session

↓

Refresh

---

# 10. API

GET /settings/devices

GET /settings/devices/{id}

PATCH /settings/devices/{id}

DELETE /settings/devices/{id}

POST /settings/devices/trust

POST /settings/devices/untrust

---

# 11. Database

devices

device_sessions

trusted_devices

device_activity_logs

security_events

audit_logs

---

# 12. Loading State

Loading Devices

↓

Loading Detail

↓

Removing Device

↓

Updating Trusted Status

---

# 13. Error State

Device Not Found

↓

Refresh

---

Network Error

↓

Retry

---

Unauthorized Request

↓

Login Again

---

# 14. Success State

Device Loaded

↓

Device Removed

↓

Session Revoked

↓

List Updated

---

# 15. Trusted Device

Mark Trusted

↓

Save

↓

Skip Extra Verification

(Configurable)

---

Remove Trust

↓

Require Verification Next Login

---

# 16. Remote Logout

Select Device

↓

Verify Identity

↓

Revoke Session

↓

Notify Device

↓

Logout Completed

---

# 17. Security Alerts

New Device Login

Unknown Device

Multiple Failed Login Attempts

Device Removed

Trusted Device Changed

---

# 18. Notification

New Device Added

Device Removed

Trusted Device Enabled

Trusted Device Disabled

Remote Logout Completed

---

# 19. Analytics

device_registered

device_removed

trusted_device_enabled

trusted_device_disabled

remote_logout

new_device_detected

---

# 20. Flutter Widget Tree

Scaffold

↓

CurrentDeviceCard

↓

DeviceList

↓

DeviceDetailBottomSheet

↓

TrustedBadge

↓

RemoveDialog

---

# 21. State Management

DeviceManagementBloc

DeviceRepository

SecurityRepository

AuthenticationRepository

---

# 22. Performance

Load Devices

<1 giây

Remove Device

<500ms

Update Trusted Status

<500ms

---

# 23. Accessibility

Large Font

Screen Reader

Touch Area ≥48dp

High Contrast

---

# 24. Test Cases

✓ Load Devices.

✓ Remove Device.

✓ Remote Logout.

✓ Trust Device.

✓ Untrust Device.

✓ New Device Alert.

✓ Invalid Device.

---

# 25. Acceptance Criteria

✓ Thiết bị hiển thị đúng.

✓ Remote Logout hoạt động.

✓ Trusted Device hoạt động.

✓ Audit Log đầy đủ.

✓ Không rò rỉ dữ liệu.

---

# 26. Related Documents

Security Settings

Connected Accounts

Profile Security

Authentication

Notification Security

---

# 27. Future Expansion

Device Risk Score

AI Device Recognition

Geofencing

Device Fingerprinting

Enterprise Device Policy

---

# 28. Summary

Device Management giúp người dùng quản lý các thiết bị đã đăng nhập vào BusZ, hỗ trợ đăng xuất từ xa, đánh dấu thiết bị tin cậy, phát hiện truy cập bất thường và tăng cường bảo mật tài khoản trên nhiều nền tảng.