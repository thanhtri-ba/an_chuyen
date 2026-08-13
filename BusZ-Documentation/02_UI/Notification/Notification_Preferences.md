# Notification Preferences

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Notification

Document ID: NOTIFICATION-006

Priority: High

Status: Draft

Version: 1.0

---

# 1. Purpose

Notification Preferences cho phép người dùng tùy chỉnh cách nhận thông báo từ BusZ.

Người dùng có thể quyết định:

- Nhận thông báo qua kênh nào.
- Nhận loại thông báo nào.
- Thời gian nhận thông báo.
- Thiết bị nhận thông báo.

---

# 2. Objectives

Đảm bảo:

✓ Cá nhân hóa.

✓ Không làm phiền người dùng.

✓ Đồng bộ nhiều thiết bị.

✓ Dễ quản lý.

✓ Tôn trọng quyền riêng tư.

---

# 3. Actors

Customer

Notification Service

Push Service

Email Service

SMS Service

Admin

---

# 4. Preference Categories

Push Notification

Email

SMS

Marketing

Security

Booking

Payment

Ticket

Promotion

System

---

# 5. Notification Channels

Push

Email

SMS

In-App

Future

WhatsApp

Telegram

---

# 6. Notification Priority

Critical

High

Normal

Low

Critical Notification

↓

Không được phép tắt

(Configurable)

---

# 7. Quiet Hours

Enable

↓

Start Time

↓

End Time

↓

Auto Resume

---

# 8. Device Preferences

Current Device

All Devices

Specific Device

Tablet

Phone

Web Browser

---

# 9. Business Rules

NOTI-BR-026

Security Notification luôn được ưu tiên.

NOTI-BR-027

Marketing Notification chỉ gửi khi người dùng đồng ý.

NOTI-BR-028

Preference phải đồng bộ đa thiết bị.

NOTI-BR-029

Thay đổi Preference phải ghi Audit Log.

NOTI-BR-030

Nếu Push bị tắt có thể chuyển sang Email (theo cấu hình).

---

# 10. Business Logic

Open Preferences

↓

Load Current Settings

↓

Edit

↓

Validate

↓

Save

↓

Sync Devices

↓

Apply Immediately

---

# 11. API

GET /notification/preferences

PUT /notification/preferences

POST /notification/preferences/reset

GET /notification/preferences/devices

---

# 12. Database

notification_preferences

device_preferences

notification_channels

notification_rules

audit_logs

---

# 13. Loading State

Loading Preferences

↓

Saving Changes

↓

Syncing Devices

---

# 14. Error State

Save Failed

↓

Retry

---

Sync Failed

↓

Retry Later

---

Network Error

↓

Retry

---

# 15. Success State

Preferences Saved

↓

Notification Service Updated

↓

Devices Synced

---

# 16. Channel Fallback

Push Disabled

↓

Email Enabled

↓

Send Email

---

Email Disabled

↓

In-App Notification

---

SMS

↓

Critical Only

---

# 17. Default Configuration

Booking

Push + In-App

---

Payment

Push + Email

---

Ticket

Push + Email

---

Promotion

Push

(Configurable)

---

Security

Push + Email + SMS

---

# 18. Notification Examples

Booking Reminder

↓

Push

---

Payment Success

↓

Push + Email

---

OTP

↓

SMS

---

Promotion

↓

Push

---

Security Alert

↓

Push + Email + SMS

---

# 19. Analytics

notification_preference_updated

marketing_opt_in

marketing_opt_out

quiet_hours_enabled

channel_changed

---

# 20. Flutter Widget Tree

Scaffold

↓

PreferenceCategoryList

↓

ChannelToggleCard

↓

QuietHoursCard

↓

DevicePreferenceCard

↓

SaveButton

---

# 21. State Management

NotificationPreferenceBloc

NotificationRepository

DeviceRepository

PreferenceRepository

---

# 22. Performance

Load Preferences

<1 giây

Save Preferences

<500ms

Sync Devices

<2 giây

---

# 23. Accessibility

Large Font

Screen Reader

High Contrast

Touch Area ≥48dp

---

# 24. Test Cases

✓ Enable Push.

✓ Disable Email.

✓ Quiet Hours.

✓ Device Sync.

✓ Marketing Opt-out.

✓ Retry Save.

---

# 25. Acceptance Criteria

✓ Preference lưu đúng.

✓ Đồng bộ đa thiết bị.

✓ Channel hoạt động đúng.

✓ Audit Log đầy đủ.

✓ Không crash.

---

# 26. Related Documents

Push Notification

Email Notification

SMS Notification

Settings

Profile

---

# 27. Future Expansion

AI Notification Scheduling

Smart Quiet Hours

Geo-based Notification Rules

Cross-device Notification Routing

Personalized Notification Frequency

---

# 28. Summary

Notification Preferences cho phép người dùng kiểm soát cách nhận thông báo từ BusZ theo từng kênh, từng loại thông báo và từng thiết bị, đồng thời hỗ trợ đồng bộ nhiều thiết bị, khung giờ yên lặng và các quy tắc ưu tiên nhằm mang lại trải nghiệm thông báo linh hoạt và phù hợp với nhu cầu của từng người dùng.