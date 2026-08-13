# Reset Password Screen

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Authentication

Screen ID: AUTH-007

Priority: Critical

Status: Draft

---

# 1. Purpose

Màn hình Reset Password cho phép người dùng tạo mật khẩu mới sau khi đã xác minh OTP thành công.

Sau khi đổi mật khẩu thành công:

- Hủy toàn bộ phiên đăng nhập cũ.
- Cập nhật mật khẩu mới.
- Điều hướng về Login.

---

# 2. Business Goal

Đảm bảo:

- Chỉ người đã xác minh OTP mới được đổi mật khẩu.
- Password mới đủ mạnh.
- Không được trùng mật khẩu cũ.
- Tăng tính bảo mật tài khoản.

---

# 3. Actors

Primary

Customer

Secondary

Backend

Authentication Service

---

# 4. Preconditions

✓ OTP Verification thành công.

✓ OTP còn hiệu lực.

✓ User tồn tại.

---

# 5. UI Layout

AppBar

↓

Illustration

↓

Title

↓

Description

↓

New Password

↓

Confirm Password

↓

Password Strength Indicator

↓

Reset Password Button

↓

Back To Login

---

# 6. Components

Back Button

Illustration

Title

Description

New Password TextField

Confirm Password TextField

Show Password Icon

Password Strength

Reset Button

Loading Overlay

Error Message

---

# 7. Field Specification

## New Password

Type

Password

Required

Yes

Minimum

8 ký tự

Maximum

100 ký tự

Validation

- Có chữ hoa
- Có chữ thường
- Có số
- Có ký tự đặc biệt (Future)

---

## Confirm Password

Required

Yes

Validation

Phải giống Password.

---

# 8. Functional Requirements

FR-001

Nhập Password mới.

FR-002

Xác nhận Password.

FR-003

Hiển thị độ mạnh Password.

FR-004

Reset Password.

FR-005

Điều hướng Login.

---

# 9. Business Rules

BR-001

Password ≥ 8 ký tự.

BR-002

Password mới ≠ Password cũ.

BR-003

OTP phải hợp lệ.

BR-004

OTP chỉ dùng một lần.

BR-005

Sau khi đổi mật khẩu, tất cả Refresh Token cũ bị thu hồi.

---

# 10. Business Logic

OTP Verified

↓

User nhập Password mới

↓

Validate

↓

POST /auth/reset-password

↓

Hash Password

↓

Update Database

↓

Revoke Sessions

↓

Navigate Login

---

# 11. API

POST /auth/reset-password

Request

```json
{
  "userId": "",
  "otp": "123456",
  "newPassword": "Password123"
}
```

Response

```json
{
  "success": true,
  "message": "Password changed successfully."
}
```

---

# 12. Database

Tables

users

otp_codes

login_sessions

refresh_tokens

activity_logs

---

# 13. State Machine

DEFAULT

↓

INPUT

↓

VALIDATING

↓

RESETTING

↓

SUCCESS

↓

LOGIN

---

ERROR

↓

RETRY

---

# 14. Validation

Password đủ mạnh.

Confirm Password đúng.

OTP hợp lệ.

Password mới khác Password cũ.

---

# 15. Loading State

Disable Button

↓

Loading Spinner

↓

Wait API

---

# 16. Error State

Password yếu.

Password không khớp.

OTP hết hạn.

OTP không hợp lệ.

Server Error.

Không Internet.

---

# 17. Success State

Password Updated

↓

Logout All Devices

↓

Navigate Login

---

# 18. Navigation

Forgot Password

↓

OTP Verification

↓

Reset Password

↓

Login

---

# 19. Security

HTTPS

BCrypt Password

JWT Revocation

Refresh Token Revocation

Rate Limiting

Không log Password

---

# 20. Accessibility

Touch Area ≥ 48dp

Dynamic Font

Screen Reader

Keyboard Navigation

Password Visibility Toggle

---

# 21. Performance

Reset API

< 2 giây

Animation

60 FPS

---

# 22. Analytics Events

reset_password_view

reset_password_submit

reset_password_success

reset_password_failed

password_strength_changed

---

# 23. Flutter Widget Tree

Scaffold

SafeArea

SingleChildScrollView

Column

Image

Text

TextFormField

PasswordStrengthIndicator

FilledButton

TextButton

CircularProgressIndicator

---

# 24. State Management

AuthenticationBloc

ResetPasswordEvent

ResetPasswordState

ResetPasswordUseCase

AuthenticationRepository

---

# 25. Test Cases

✓ Password hợp lệ.

✓ Password yếu.

✓ Confirm Password sai.

✓ OTP hết hạn.

✓ Không Internet.

✓ Loading.

✓ Reset thành công.

✓ Refresh Token bị thu hồi.

---

# 26. Acceptance Criteria

✓ Password đổi thành công.

✓ Hash Password.

✓ OTP vô hiệu.

✓ Session cũ bị đăng xuất.

✓ Điều hướng Login.

✓ Không Crash.

---

# 27. Related Documents

Authentication Process

Login

Register

OTP Verification

Forgot Password

API Authentication

---

# 28. Future Expansion

Passwordless Login

Passkey

Biometric Authentication

Face ID

Fingerprint

---

# 29. Summary

Reset Password là bước cuối cùng trong quy trình khôi phục tài khoản.

Sau khi hoàn thành, người dùng phải đăng nhập lại bằng mật khẩu mới và toàn bộ phiên đăng nhập cũ sẽ bị hủy để đảm bảo an toàn.