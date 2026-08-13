# Settings Module

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Flutter Mobile App

Document ID

APP-012

Priority

High

Version

1.0

---

# 1. Purpose

Settings Module cho phép người dùng tùy chỉnh trải nghiệm sử dụng ứng dụng BusZ.

Bao gồm:

- Theme
- Language
- Currency
- Notification
- Security
- Privacy
- Storage
- About
- Help & Support

---

# 2. User Flow

```text
Profile

↓

Settings

↓

Select Category

↓

Update Setting

↓

Save

↓

Apply Immediately
```

---

# 3. Settings Layout

```text
AppBar

↓

Appearance

↓

Notification

↓

Security

↓

Privacy

↓

Storage

↓

About

↓

Support
```

---

# 4. Appearance

Theme

```text
Light

Dark

System
```

Font Size

```text
Small

Medium

Large
```

Language

```text
Vietnamese

English
```

Currency

```text
VND

USD
```

---

# 5. Notification Settings

Cho phép bật/tắt

```text
Booking

Payment

Promotion

System

Marketing

Reminder
```

Ngoài ra

```text
Sound

Vibration

Badge
```

---

# 6. Security Settings

Các chức năng

```text
PIN Lock

Fingerprint

Face ID

Auto Lock

Trusted Devices
```

---

# 7. Privacy Settings

Cho phép

```text
Location Permission

Camera Permission

Photo Permission

Analytics

Personalized Ads
```

Buttons

```text
Manage Permissions

Privacy Policy
```

---

# 8. Storage Management

Hiển thị

```text
Image Cache

PDF Cache

Offline Tickets

Temporary Files
```

Buttons

```text
Clear Cache

Delete Downloads
```

Hiển thị tổng dung lượng.

---

# 9. Offline Data

Cho phép

```text
Download Tickets

Save Search History

Offline Route Data
```

Hiển thị dung lượng đã sử dụng.

---

# 10. About

Hiển thị

```text
App Name

Version

Build Number

Release Date
```

Buttons

```text
Release Notes

Licenses
```

---

# 11. Help & Support

Các mục

```text
FAQ

Contact Support

Live Chat

Report a Problem

Send Feedback
```

---

# 12. Legal

Hiển thị

```text
Terms of Service

Privacy Policy

Refund Policy

Cookie Policy
```

---

# 13. Logout

Dialog

```text
Are you sure you want to logout?
```

Buttons

```text
Logout

Cancel
```

---

# 14. Delete Account

Dialog

```text
Delete Account
```

Flow

```text
Warning

↓

Confirm Password

↓

Delete Request

↓

Logout
```

---

# 15. Loading State

Skeleton

- Settings Item
- Switch
- Cards

---

# 16. Error State

Ví dụ

```text
Unable to save settings.
```

Buttons

```text
Retry
```

---

# 17. Offline Mode

Cho phép

- Xem cài đặt hiện tại.
- Đổi Theme.
- Đổi ngôn ngữ (nếu đã tải sẵn).

Không cho phép

- Đồng bộ lên Server.

---

# 18. State Management

Cubit

```text
SettingsCubit
```

States

```text
SettingsInitial

SettingsLoading

SettingsLoaded

SettingsUpdating

SettingsUpdated

SettingsOffline

SettingsError
```

---

# 19. API Integration

```text
GET /settings

PATCH /settings

POST /devices/trusted

DELETE /devices/{id}
```

---

# 20. Component Tree

```text
SettingsScreen

↓

AppearanceSection

↓

NotificationSection

↓

SecuritySection

↓

PrivacySection

↓

StorageSection

↓

AboutSection

↓

SupportSection

↓

LogoutButton
```

---

# 21. UX Guidelines

✓ Áp dụng Theme ngay sau khi thay đổi.

✓ Hiển thị dung lượng Cache rõ ràng.

✓ Cảnh báo trước khi xóa dữ liệu.

✓ Đồng bộ cài đặt khi đăng nhập trên thiết bị khác.

✓ Tất cả Switch phản hồi ngay lập tức.

---

# 22. Performance

Load Settings

```text
<100ms
```

Save Settings

```text
<300ms
```

Clear Cache

```text
<2s
```

---

# 23. Test Cases

✓ Change Theme.

✓ Change Language.

✓ Enable Biometric.

✓ Disable Notification.

✓ Clear Cache.

✓ Logout.

✓ Delete Account.

✓ Offline Settings.

---

# 24. Acceptance Criteria

✓ Theme hoạt động.

✓ Language hoạt động.

✓ Notification Settings hoạt động.

✓ Security Settings đầy đủ.

✓ Cache Management hoạt động.

✓ Đồng bộ với Backend.

---

# 25. Related Documents

APP-010 Profile Module

APP-011 Notification Module

API-005 Profile API

---

# 26. Summary

Settings Module của BusZ cung cấp đầy đủ các tùy chọn để cá nhân hóa trải nghiệm người dùng, từ giao diện, ngôn ngữ, bảo mật đến quản lý bộ nhớ và quyền riêng tư. Các thay đổi được áp dụng tức thì khi có thể và đồng bộ với Backend để đảm bảo trải nghiệm nhất quán trên nhiều thiết bị.