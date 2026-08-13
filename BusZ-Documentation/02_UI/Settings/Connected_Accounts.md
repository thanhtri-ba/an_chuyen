# Connected Accounts

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Settings

Document ID: SETTINGS-007

Priority: High

Status: Draft

Version: 1.0

---

# 1. Purpose

Connected Accounts cho phép người dùng liên kết và quản lý các tài khoản đăng nhập bên thứ ba với tài khoản BusZ.

Module này giúp:

- Đăng nhập nhanh.
- Tăng tính bảo mật.
- Giảm phụ thuộc vào mật khẩu.
- Đồng bộ phương thức đăng nhập.

---

# 2. Objectives

Đảm bảo:

✓ Multiple Login Providers.

✓ Account Linking.

✓ Secure Authentication.

✓ Easy Unlinking.

✓ Conflict Resolution.

---

# 3. Actors

Customer

Authentication Service

OAuth Provider

Admin

Audit Service

---

# 4. Supported Providers

Email & Password

Google

Apple ID

Facebook (Optional)

Microsoft (Future)

GitHub (Future)

---

# 5. Account Lifecycle

Create Account

↓

Link Provider

↓

Verify Ownership

↓

Linked

↓

Use For Login

↓

Unlink

---

# 6. Account Information

Provider

Linked Email

Linked Time

Last Login

Status

Primary Login Method

Verification Status

---

# 7. Business Rules

SETTINGS-BR-030

Một tài khoản có thể liên kết nhiều Provider.

SETTINGS-BR-031

Ít nhất phải còn một phương thức đăng nhập.

SETTINGS-BR-032

Không cho phép hủy phương thức cuối cùng.

SETTINGS-BR-033

Email phải được xác minh trước khi liên kết.

SETTINGS-BR-034

Audit Log bắt buộc.

---

# 8. Business Logic

Open Connected Accounts

↓

Load Providers

↓

Select Provider

↓

OAuth Authentication

↓

Verify Ownership

↓

Link Account

↓

Refresh UI

---

# 9. API

GET /settings/connected-accounts

POST /settings/connected-accounts/link

DELETE /settings/connected-accounts/{provider}

PATCH /settings/connected-accounts/default

---

# 10. Database

connected_accounts

oauth_accounts

oauth_tokens

authentication_methods

audit_logs

---

# 11. Validation

Provider Available

↓

Authentication Success

↓

Email Match

↓

Account Not Linked

↓

Save

---

# 12. Loading State

Loading Providers

↓

Connecting Provider

↓

Verifying Account

↓

Saving

---

# 13. Error State

OAuth Failed

↓

Retry

---

Provider Unavailable

↓

Retry Later

---

Already Linked

↓

Show Message

---

# 14. Success State

Account Linked

↓

Ready For Login

↓

Notification Sent

---

# 15. Conflict Resolution

Same Email

↓

Verify Ownership

↓

Merge Account

(Configurable)

↓

Complete

---

# 16. Unlink Flow

Select Provider

↓

Verify Identity

↓

Check Remaining Login Methods

↓

Remove Link

↓

Update Authentication

---

# 17. Notification

Google Linked

Apple ID Linked

Facebook Linked

Account Unlinked

Primary Login Changed

---

# 18. Analytics

provider_linked

provider_unlinked

oauth_login

primary_provider_changed

account_merge

---

# 19. Flutter Widget Tree

Scaffold

↓

ConnectedAccountList

↓

ProviderCard

↓

LinkButton

↓

PrimaryBadge

↓

UnlinkDialog

---

# 20. State Management

ConnectedAccountsBloc

AuthenticationRepository

OAuthRepository

SettingsRepository

---

# 21. Performance

Load Providers

<500ms

Link Account

<2 giây

Unlink

<500ms

---

# 22. Accessibility

Large Font

Screen Reader

Touch Area ≥48dp

Keyboard Navigation

---

# 23. Test Cases

✓ Link Google.

✓ Link Apple.

✓ Unlink Account.

✓ Change Primary Provider.

✓ Provider Conflict.

✓ OAuth Failure.

---

# 24. Acceptance Criteria

✓ Liên kết thành công.

✓ Hủy liên kết đúng.

✓ Không mất tài khoản.

✓ Audit Log đầy đủ.

✓ Không crash.

---

# 25. Related Documents

Authentication

Profile Security

Security Settings

Device Management

Privacy

---

# 26. Future Expansion

Passkey Integration

Enterprise SSO

Government Digital Identity

Multi-account Switching

Decentralized Identity (DID)

---

# 27. Summary

Connected Accounts cho phép người dùng liên kết nhiều phương thức đăng nhập với tài khoản BusZ, hỗ trợ đăng nhập linh hoạt, bảo mật hơn và đảm bảo người dùng luôn duy trì ít nhất một phương thức xác thực hợp lệ.