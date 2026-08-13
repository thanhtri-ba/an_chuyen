# System Settings

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Admin Web

Document ID

ADM-013

Priority

Critical

Version

1.0

---

# 1. Purpose

System Settings cho phép Super Admin cấu hình toàn bộ hệ thống BusZ.

Bao gồm:

- General Settings
- Payment Settings
- Email Settings
- SMS Settings
- Notification Settings
- Security Settings
- Feature Flags
- Maintenance Mode
- Third-party Integrations
- Backup & Restore

---

# 2. User Flow

```text
Dashboard

↓

System Settings

↓

Choose Category

↓

Update Configuration

↓

Validate

↓

Save

↓

Apply Changes
```

---

# 3. Settings Categories

```text
General

Payment

Notification

Security

Localization

Storage

Backup

Integrations
```

---

# 4. General Settings

Thông tin

```text
System Name

Company Name

Support Email

Support Phone

Timezone

Default Language

Default Currency
```

---

# 5. Payment Settings

Cấu hình

```text
VNPay

MoMo

ZaloPay

Stripe

PayPal
```

Thông số

```text
Merchant ID

API Key

Secret Key

Webhook URL

Environment
```

---

# 6. Email Settings

SMTP

```text
Host

Port

Username

Password

Encryption
```

Cho phép

```text
Test Email
```

---

# 7. SMS Settings

Nhà cung cấp

```text
Twilio

VNPT

Viettel

Custom Provider
```

Cấu hình

```text
API Key

Sender ID

Callback URL
```

---

# 8. Notification Settings

Cho phép bật/tắt

```text
Push Notification

Email

SMS

In-App Notification
```

Giới hạn

```text
Rate Limit

Retry Count
```

---

# 9. Security Settings

Cấu hình

```text
Password Policy

MFA Required

Session Timeout

IP Whitelist

Rate Limiting

CORS

CSRF Protection
```

---

# 10. Feature Flags

Quản lý

```text
Online Payment

Refund

Live Tracking

Promotion

Referral

Maintenance Banner
```

Cho phép bật/tắt mà không cần triển khai lại hệ thống.

---

# 11. Localization

Quản lý

```text
Language

Currency

Date Format

Number Format

Timezone
```

---

# 12. Storage Settings

Hiển thị

```text
Storage Provider

Disk Usage

Backup Size

Log Retention
```

---

# 13. Backup & Restore

Cho phép

```text
Manual Backup

Scheduled Backup

Restore

Download Backup
```

Lịch

```text
Daily

Weekly

Monthly
```

---

# 14. Maintenance Mode

Trạng thái

```text
Enabled

Disabled
```

Thông báo

```text
Maintenance Message

Start Time

End Time
```

Ngoại lệ

```text
Allow Super Admin
```

---

# 15. Third-party Integrations

Quản lý

```text
Google Maps

OpenStreetMap

Mapbox

Firebase

Supabase

Cloudinary

Sentry

Google Analytics
```

---

# 16. API Integration

```text
GET /admin/settings

PATCH /admin/settings

POST /admin/settings/test-email

POST /admin/settings/backup

POST /admin/settings/restore

GET /admin/settings/integrations
```

---

# 17. Component Tree

```text
SystemSettingsPage

↓

CategorySidebar

↓

SettingsForm

↓

IntegrationPanel

↓

BackupSection

↓

MaintenancePanel

↓

SaveToolbar
```

---

# 18. Performance

Settings Load

```text
<300ms
```

Save Configuration

```text
<500ms
```

Backup

```text
<30s
```

---

# 19. UX Guidelines

✓ Phân nhóm cài đặt rõ ràng.

✓ Kiểm tra hợp lệ trước khi lưu.

✓ Hiển thị cảnh báo với thay đổi quan trọng.

✓ Hỗ trợ hoàn tác nếu lưu thất bại.

✓ Có chức năng kiểm tra kết nối (Test Connection) cho Email, SMS và Payment Gateway.

---

# 20. Test Cases

✓ Update General Settings.

✓ Payment Configuration.

✓ SMTP Test.

✓ SMS Test.

✓ Feature Flag.

✓ Backup.

✓ Restore.

✓ Maintenance Mode.

---

# 21. Acceptance Criteria

✓ Lưu cấu hình thành công.

✓ Backup hoạt động.

✓ Restore hoạt động.

✓ Feature Flags có hiệu lực.

✓ Test Connection thành công.

✓ Audit Log được ghi nhận.

---

# 22. Related Documents

ADM-009 Payment Management

ADM-012 Notification Center

ADM-015 Audit Log

API-013 System Settings API

---

# 23. Summary

System Settings là trung tâm cấu hình của BusZ Admin dành cho Super Admin. Module hỗ trợ quản lý toàn bộ cấu hình hệ thống, từ thanh toán, bảo mật, thông báo, tích hợp dịch vụ bên thứ ba đến sao lưu và bảo trì, giúp hệ thống linh hoạt và dễ dàng vận hành trong môi trường Production.