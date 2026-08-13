# Account Settings

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Profile

Document ID: PROFILE-011

Priority: High

Status: Draft

Version: 1.0

---

# 1. Purpose

Account Settings cho phép người dùng quản lý toàn bộ cài đặt tài khoản cá nhân trong BusZ.

Module này tập trung vào:

- Cài đặt tài khoản
- Quyền riêng tư
- Ngôn ngữ
- Đồng bộ dữ liệu
- Quản lý tài khoản

---

# 2. Objectives

Đảm bảo:

✓ Quản lý tài khoản.

✓ Cá nhân hóa ứng dụng.

✓ Quản lý dữ liệu.

✓ Bảo vệ quyền riêng tư.

✓ Dễ sử dụng.

---

# 3. Actors

Customer

Authentication Service

Notification Service

Admin

---

# 4. Setting Categories

General

↓

Language

↓

Privacy

↓

Security

↓

Notification

↓

Data

↓

About

---

# 5. General Settings

Display Name

Avatar

Time Zone

Country

Currency

Date Format

Time Format

---

# 6. Language

Vietnamese

English

Japanese (Future)

Chinese (Future)

Auto Detect

---

# 7. Privacy

Profile Visibility

Hide Phone Number

Hide Email

Personalized Recommendation

Analytics Sharing

Marketing Consent

---

# 8. Data Management

Download Personal Data

Export Booking History

Export Ticket History

Delete Cache

Delete Account Request

---

# 9. Business Rules

PROFILE-BR-048

Language thay đổi áp dụng ngay.

PROFILE-BR-049

Delete Account phải xác nhận.

PROFILE-BR-050

Không được xóa tài khoản đang có Booking ACTIVE.

PROFILE-BR-051

Download Data chỉ áp dụng cho chính chủ.

PROFILE-BR-052

Audit Log bắt buộc.

---

# 10. Business Logic

Open Settings

↓

Load Preferences

↓

Update Setting

↓

Save

↓

Sync

↓

Refresh UI

---

# 11. API

GET /profile/settings

PUT /profile/settings

POST /profile/settings/export

POST /profile/settings/delete-account

POST /profile/settings/logout-all

---

# 12. Database

user_settings

privacy_settings

language_settings

data_export_requests

account_deletion_requests

audit_logs

---

# 13. Loading State

Loading Settings

↓

Saving Settings

↓

Exporting Data

↓

Processing Request

---

# 14. Error State

Save Failed

↓

Retry

---

Export Failed

↓

Retry

---

Delete Request Failed

↓

Retry

---

# 15. Success State

Settings Saved

↓

Refresh App

↓

Notification

---

# 16. Logout All Devices

User Request

↓

Verify Password

↓

Revoke All Sessions

↓

Keep Current Session (Optional)

↓

Complete

---

# 17. Delete Account

Request Delete

↓

Verify Identity

↓

Check Active Booking

↓

Grace Period (Configurable)

↓

Delete / Deactivate

---

# 18. Notification

Settings Updated

Export Ready

Delete Requested

Logout Completed

Privacy Updated

---

# 19. Analytics

settings_opened

language_changed

privacy_changed

export_requested

account_delete_requested

logout_all_devices

---

# 20. Flutter Widget Tree

Scaffold

↓

SettingsCategoryList

↓

GeneralCard

↓

PrivacyCard

↓

DataManagementCard

↓

DangerZoneCard

---

# 21. State Management

AccountSettingsBloc

SettingsRepository

AuthenticationRepository

ExportRepository

---

# 22. Performance

Load Settings

<1 giây

Save Settings

<500ms

Export Request

<1 giây

---

# 23. Accessibility

Large Font

Screen Reader

High Contrast

Touch Area ≥48dp

---

# 24. Test Cases

✓ Change Language.

✓ Change Privacy.

✓ Export Data.

✓ Logout All Devices.

✓ Delete Account.

✓ Retry.

---

# 25. Acceptance Criteria

✓ Settings lưu đúng.

✓ Export hoạt động.

✓ Delete Request đúng.

✓ Audit Log đầy đủ.

✓ Không crash.

---

# 26. Related Documents

Profile Detail

Profile Security

Notification

Settings Module

Authentication

---

# 27. Future Expansion

Cloud Backup

Multi-profile

Theme Synchronization

Cross-device Sync

Parental Control

---

# 28. Summary

Account Settings là trung tâm quản lý toàn bộ cài đặt tài khoản của người dùng trong BusZ, từ ngôn ngữ, quyền riêng tư đến quản lý dữ liệu và tài khoản, giúp người dùng kiểm soát trải nghiệm sử dụng ứng dụng một cách linh hoạt và an toàn.