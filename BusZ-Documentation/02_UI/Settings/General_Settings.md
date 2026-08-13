# General Settings

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Settings

Document ID: SETTINGS-002

Priority: High

Status: Draft

Version: 1.0

---

# 1. Purpose

General Settings cho phép người dùng cấu hình các thiết lập chung của ứng dụng BusZ.

Các cài đặt này ảnh hưởng đến trải nghiệm sử dụng nhưng không làm thay đổi dữ liệu nghiệp vụ.

---

# 2. Objectives

Đảm bảo:

✓ Cá nhân hóa trải nghiệm.

✓ Đồng bộ đa thiết bị.

✓ Áp dụng ngay khi thay đổi.

✓ Không ảnh hưởng dữ liệu.

✓ Dễ khôi phục mặc định.

---

# 3. Actors

Customer

Settings Service

Synchronization Service

Admin

---

# 4. General Setting Categories

Display Name

Country

Region

Time Zone

Currency

Date Format

Time Format

Measurement Unit (Future)

---

# 5. Default Values

Language

Auto Detect

---

Time Zone

Theo thiết bị

---

Currency

Theo quốc gia

---

Date Format

DD/MM/YYYY

(Configurable)

---

Time Format

24 Hours

(Configurable)

---

# 6. Business Rules

SETTINGS-BR-005

Settings chỉ áp dụng cho chính User.

SETTINGS-BR-006

Mọi thay đổi phải được đồng bộ.

SETTINGS-BR-007

Không làm thay đổi Booking hiện có.

SETTINGS-BR-008

Reset chỉ ảnh hưởng General Settings.

SETTINGS-BR-009

Audit Log bắt buộc.

---

# 7. Business Logic

Open Settings

↓

Load Current Settings

↓

Edit

↓

Validate

↓

Save

↓

Sync

↓

Apply Immediately

---

# 8. API

GET /settings/general

PUT /settings/general

POST /settings/general/reset

GET /settings/general/default

---

# 9. Database

user_settings

general_settings

setting_history

audit_logs

---

# 10. Validation

Country Supported

↓

Time Zone Valid

↓

Currency Supported

↓

Date Format Valid

↓

Save

---

# 11. Loading State

Loading Settings

↓

Saving

↓

Synchronizing

↓

Refreshing

---

# 12. Empty State

Không có cấu hình.

↓

Load Default Settings

---

# 13. Error State

Save Failed

↓

Retry

---

Sync Failed

↓

Retry Later

---

Invalid Setting

↓

Show Validation

---

# 14. Success State

Settings Saved

↓

Applied Immediately

↓

Sync Completed

---

# 15. Synchronization

Update Device A

↓

Cloud Sync

↓

Update Device B

↓

Completed

---

# 16. Reset Flow

Open Reset

↓

Confirmation

↓

Restore Defaults

↓

Sync

↓

Refresh UI

---

# 17. Notification

Settings Updated

Settings Reset

Synchronization Completed

Synchronization Failed

---

# 18. Analytics

general_settings_updated

general_settings_reset

timezone_changed

currency_changed

date_format_changed

---

# 19. Flutter Widget Tree

Scaffold

↓

GeneralSettingsList

↓

CountrySelector

↓

TimeZoneSelector

↓

CurrencySelector

↓

ResetButton

---

# 20. State Management

GeneralSettingsBloc

SettingsRepository

SynchronizationRepository

PreferenceRepository

---

# 21. Performance

Load Settings

<1 giây

Save Settings

<500ms

Sync

<2 giây

---

# 22. Accessibility

Large Font

Screen Reader

Keyboard Navigation

Touch Area ≥48dp

---

# 23. Test Cases

✓ Change Country.

✓ Change Time Zone.

✓ Change Currency.

✓ Reset Settings.

✓ Sync Multiple Devices.

✓ Retry Save.

---

# 24. Acceptance Criteria

✓ Settings lưu đúng.

✓ Đồng bộ thành công.

✓ Reset hoạt động.

✓ Audit Log đầy đủ.

✓ Không crash.

---

# 25. Related Documents

Language & Region

Appearance

Privacy

Profile

Notification Preferences

---

# 26. Future Expansion

Automatic Time Zone Detection

Automatic Currency Conversion

Cloud Preference Backup

Cross-platform Synchronization

AI Smart Defaults

---

# 27. Summary

General Settings cung cấp các cấu hình chung của ứng dụng BusZ như quốc gia, múi giờ, tiền tệ và định dạng ngày giờ, giúp cá nhân hóa trải nghiệm người dùng và đảm bảo đồng bộ trên nhiều thiết bị.