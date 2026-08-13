# Appearance

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Settings

Document ID: SETTINGS-004

Priority: High

Status: Draft

Version: 1.0

---

# 1. Purpose

Appearance cho phép người dùng tùy chỉnh giao diện hiển thị của ứng dụng BusZ nhằm mang lại trải nghiệm sử dụng thoải mái và phù hợp với từng thiết bị.

---

# 2. Objectives

Đảm bảo:

✓ Cá nhân hóa giao diện.

✓ Hỗ trợ Dark Mode.

✓ Hỗ trợ Accessibility.

✓ Đồng bộ đa thiết bị.

✓ Áp dụng ngay lập tức.

---

# 3. Actors

Customer

Settings Service

Theme Service

Synchronization Service

---

# 4. Appearance Categories

Theme

Color Scheme

Font Size

Display Density

Accessibility

Animation

---

# 5. Theme Options

Light

Dark

System Default

---

# 6. Font Size

Small

Medium

Large

Extra Large

Follow System

---

# 7. Accessibility Options

High Contrast

Reduce Motion

Reduce Animation

Bold Text (Future)

Dynamic Font (Future)

---

# 8. Color Scheme

Default Theme

Blue

Green

Orange

Purple

(Configurable)

---

# 9. Business Rules

SETTINGS-BR-015

Theme thay đổi áp dụng ngay.

SETTINGS-BR-016

System Theme ưu tiên khi bật "Follow System".

SETTINGS-BR-017

Accessibility không được làm hỏng bố cục.

SETTINGS-BR-018

Mọi thay đổi phải đồng bộ.

SETTINGS-BR-019

Audit Log bắt buộc.

---

# 10. Business Logic

Open Appearance

↓

Load Current Theme

↓

Select Theme

↓

Preview

↓

Save

↓

Apply

↓

Sync

---

# 11. API

GET /settings/appearance

PUT /settings/appearance

POST /settings/appearance/reset

GET /settings/theme

---

# 12. Database

appearance_settings

theme_settings

accessibility_settings

user_settings

audit_logs

---

# 13. Loading State

Loading Appearance

↓

Loading Theme

↓

Applying Theme

↓

Synchronizing

---

# 14. Empty State

Không có cấu hình.

↓

Load Default Theme

---

# 15. Error State

Theme Apply Failed

↓

Retry

---

Sync Failed

↓

Retry

---

Unsupported Theme

↓

Fallback Theme

---

# 16. Success State

Theme Updated

↓

Refresh UI

↓

Synchronize Devices

---

# 17. Preview

Select Theme

↓

Preview

↓

Apply

↓

Save

---

# 18. Synchronization

Update Cloud

↓

Update Devices

↓

Refresh Theme

---

# 19. Analytics

theme_changed

dark_mode_enabled

font_size_changed

accessibility_enabled

appearance_reset

---

# 20. Flutter Widget Tree

Scaffold

↓

ThemeSelector

↓

ColorSelector

↓

FontSizeSelector

↓

AccessibilityCard

↓

PreviewCard

↓

SaveButton

---

# 21. State Management

AppearanceBloc

ThemeRepository

SettingsRepository

SynchronizationRepository

---

# 22. Performance

Load Theme

<500ms

Apply Theme

<300ms

Refresh UI

<1 giây

---

# 23. Accessibility

High Contrast

Large Font

Reduce Motion

Screen Reader Compatible

Touch Area ≥48dp

---

# 24. Test Cases

✓ Change Theme.

✓ Dark Mode.

✓ Follow System.

✓ Large Font.

✓ High Contrast.

✓ Sync Devices.

---

# 25. Acceptance Criteria

✓ Theme hoạt động đúng.

✓ UI cập nhật ngay.

✓ Đồng bộ nhiều thiết bị.

✓ Accessibility hoạt động.

✓ Audit Log đầy đủ.

---

# 26. Related Documents

General Settings

Language & Region

Privacy

Notification Preferences

Profile

---

# 27. Future Expansion

Material You

Dynamic Color

OLED Black Theme

Custom Theme Builder

Seasonal Themes

---

# 28. Summary

Appearance cho phép người dùng tùy chỉnh giao diện của BusZ thông qua chế độ sáng/tối, màu chủ đạo, kích thước chữ và các tùy chọn hỗ trợ khả năng truy cập, đồng thời đảm bảo thay đổi được áp dụng ngay và đồng bộ trên nhiều thiết bị.