# Privacy

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Settings

Document ID: SETTINGS-005

Priority: Critical

Status: Draft

Version: 1.0

---

# 1. Purpose

Privacy cho phép người dùng kiểm soát cách BusZ thu thập, sử dụng, chia sẻ và lưu trữ dữ liệu cá nhân.

Module này giúp người dùng chủ động quản lý quyền riêng tư trong quá trình sử dụng ứng dụng.

---

# 2. Objectives

Đảm bảo:

✓ Bảo vệ dữ liệu cá nhân.

✓ Minh bạch.

✓ Người dùng kiểm soát dữ liệu.

✓ Tuân thủ quy định pháp luật.

✓ Đồng bộ trên nhiều thiết bị.

---

# 3. Actors

Customer

Privacy Service

Authentication Service

Settings Service

Admin

Audit Service

---

# 4. Privacy Categories

Personal Information

Contact Information

Location

Marketing

Analytics

Recommendations

Cookies (Web)

Data Sharing

---

# 5. Privacy Settings

Profile Visibility

Email Visibility

Phone Visibility

Location Permission

Personalized Recommendation

Marketing Emails

Marketing SMS

Analytics Collection

Crash Report Sharing

---

# 6. Profile Visibility

Private

Friends (Future)

Public (Configurable)

---

# 7. Data Collection

Required Data

↓

Authentication

Booking

Payment

Ticket

---

Optional Data

↓

Analytics

Marketing

Recommendations

---

# 8. Business Rules

SETTINGS-BR-020

Dữ liệu bắt buộc không thể tắt.

SETTINGS-BR-021

Marketing phải có sự đồng ý của người dùng.

SETTINGS-BR-022

Privacy thay đổi áp dụng ngay.

SETTINGS-BR-023

Mọi thay đổi phải ghi Audit Log.

SETTINGS-BR-024

Người dùng có quyền rút lại sự đồng ý.

---

# 9. Business Logic

Open Privacy

↓

Load Settings

↓

Edit

↓

Validate

↓

Save

↓

Sync

↓

Apply

---

# 10. API

GET /settings/privacy

PUT /settings/privacy

POST /settings/privacy/reset

GET /settings/privacy/consents

POST /settings/privacy/withdraw-consent

---

# 11. Database

privacy_settings

privacy_consents

marketing_preferences

analytics_preferences

audit_logs

---

# 12. Loading State

Loading Privacy

↓

Saving

↓

Updating Consent

↓

Synchronizing

---

# 13. Empty State

No Privacy Settings

↓

Load Default Configuration

---

# 14. Error State

Save Failed

↓

Retry

---

Consent Update Failed

↓

Retry

---

Network Error

↓

Retry

---

# 15. Success State

Privacy Updated

↓

Consent Updated

↓

Devices Synced

---

# 16. Consent Management

Grant Consent

↓

Store Consent

↓

Record Timestamp

↓

Apply Immediately

↓

Audit Log

---

Withdraw Consent

↓

Update Status

↓

Stop Processing

↓

Audit Log

---

# 17. Cookie Settings (Web)

Necessary Cookies

Always Enabled

---

Functional Cookies

Optional

---

Analytics Cookies

Optional

---

Marketing Cookies

Optional

---

# 18. Notification

Privacy Updated

Marketing Disabled

Consent Withdrawn

Privacy Policy Updated

---

# 19. Analytics

privacy_updated

marketing_enabled

marketing_disabled

analytics_disabled

consent_withdrawn

---

# 20. Flutter Widget Tree

Scaffold

↓

PrivacyCategoryList

↓

ConsentCard

↓

CookieSettingsCard

↓

VisibilityCard

↓

SaveButton

---

# 21. State Management

PrivacyBloc

PrivacyRepository

ConsentRepository

SettingsRepository

---

# 22. Performance

Load Privacy

<500ms

Save Settings

<500ms

Consent Update

<300ms

---

# 23. Accessibility

Large Font

Screen Reader

High Contrast

Touch Area ≥48dp

---

# 24. Test Cases

✓ Enable Marketing.

✓ Disable Marketing.

✓ Withdraw Consent.

✓ Cookie Settings.

✓ Privacy Sync.

✓ Retry Save.

---

# 25. Acceptance Criteria

✓ Privacy lưu đúng.

✓ Consent cập nhật đúng.

✓ Marketing dừng khi Opt-out.

✓ Audit Log đầy đủ.

✓ Không rò rỉ dữ liệu.

---

# 26. Related Documents

Profile Security

Notification Preferences

General Settings

Data Management

Authentication

---

# 27. Future Expansion

Privacy Dashboard

Consent History

AI Privacy Advisor

Data Processing Transparency

Regional Privacy Policies

---

# 28. Summary

Privacy cho phép người dùng kiểm soát quyền riêng tư và dữ liệu cá nhân trong BusZ, bao gồm quyền hiển thị thông tin, chia sẻ dữ liệu, tiếp thị, phân tích và quản lý sự đồng ý, đảm bảo minh bạch và an toàn trong quá trình sử dụng dịch vụ.