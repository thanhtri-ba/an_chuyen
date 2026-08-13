# OTP Verification Screen

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Authentication

Screen ID: AUTH-005

Priority: Critical

Status: Draft

---

# 1. Purpose

Màn hình OTP Verification dùng để xác minh Email hoặc số điện thoại của người dùng sau khi đăng ký hoặc khi thực hiện quên mật khẩu.

OTP giúp:

- Xác minh chủ sở hữu tài khoản.
- Kích hoạt tài khoản.
- Ngăn chặn đăng ký giả mạo.
- Tăng cường bảo mật.

---

# 2. Business Goal

Xác minh người dùng trong thời gian ngắn.

Cho phép gửi lại OTP khi hết hạn.

Không cho phép xác minh quá số lần quy định.

---

# 3. Actors

Guest

Customer

---

# 4. Preconditions

Người dùng vừa:

- Đăng ký tài khoản.

Hoặc

- Quên mật khẩu.

Backend đã gửi OTP.

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

OTP Input (6 ô)

↓

Countdown Timer

↓

Verify Button

↓

Resend OTP

↓

Back Button

---

# 6. Components

Illustration

Title

Description

OTP Input

Countdown

Verify Button

Resend Button

Loading

Error Message

---

# 7. Field Specification

OTP

Type

Number

Length

6 digits

Required

Yes

Auto Focus

Yes

Auto Move

Yes

Paste Support

Yes

---

# 8. Functional Requirements

FR-001

Cho phép nhập OTP.

FR-002

Tự chuyển sang ô tiếp theo.

FR-003

Tự Verify khi nhập đủ 6 số (Future).

FR-004

Cho phép dán OTP.

FR-005

Cho phép gửi lại OTP.

FR-006

Đếm ngược thời gian OTP.

---

# 9. Business Rules

BR-001

OTP chỉ sử dụng một lần.

BR-002

OTP hết hạn sau 5 phút.

BR-003

Tối đa 5 lần nhập sai.

BR-004

Tối đa 3 lần gửi lại OTP trong 15 phút.

BR-005

OTP mới sẽ vô hiệu OTP cũ.

---

# 10. Business Logic

Register

↓

Generate OTP

↓

Send Email/SMS

↓

User Input OTP

↓

POST /auth/verify-otp

↓

Backend Validate

↓

Activate Account

↓

Navigate Login

---

# 11. API

POST /auth/verify-otp

Request

```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

Response

```json
{
  "success": true,
  "message": "Account verified successfully."
}
```

---

POST /auth/resend-otp

---

# 12. Database

Tables

users

otp_codes

activity_logs

notifications

---

# 13. State Machine

WAITING

↓

INPUT

↓

VERIFYING

↓

SUCCESS

↓

LOGIN

---

WAITING

↓

EXPIRED

↓

RESEND

↓

WAITING

---

# 14. Validation

OTP đủ 6 số.

OTP đúng.

OTP chưa hết hạn.

OTP chưa sử dụng.

---

# 15. Loading State

Disable Verify Button

↓

Loading Indicator

↓

Wait API

---

# 16. Error State

OTP sai.

OTP hết hạn.

OTP đã sử dụng.

Quá số lần nhập.

Không có Internet.

Server Error.

---

# 17. Success State

OTP hợp lệ.

↓

Account Activated.

↓

Navigate Login.

---

# 18. Navigation

Register

↓

OTP Verification

↓

Login

---

Forgot Password

↓

OTP Verification

↓

Reset Password

---

# 19. Security

OTP Hash.

HTTPS.

Rate Limit.

Không log OTP.

Không lưu OTP dạng Plain Text.

---

# 20. Accessibility

Touch Area ≥ 48dp.

Dynamic Font.

Screen Reader.

OTP Input rõ ràng.

---

# 21. Performance

Verify API

< 2 giây.

Animation

60 FPS.

---

# 22. Analytics Events

otp_screen_view

otp_verify_click

otp_success

otp_failed

otp_resend

otp_timeout

---

# 23. Flutter Widget Tree

Scaffold

SafeArea

Column

Image

Text

OtpTextField

CountdownTimer

FilledButton

TextButton

CircularProgressIndicator

---

# 24. State Management

AuthenticationBloc

OtpEvent

OtpState

VerifyOtpUseCase

AuthenticationRepository

---

# 25. Test Cases

✓ OTP đúng.

✓ OTP sai.

✓ OTP hết hạn.

✓ OTP đã dùng.

✓ Resend OTP.

✓ Không Internet.

✓ Loading.

✓ Verify thành công.

---

# 26. Acceptance Criteria

✓ Verify thành công.

✓ Activate User.

✓ Điều hướng đúng.

✓ Resend hoạt động.

✓ Countdown hoạt động.

✓ Không crash.

---

# 27. Related Documents

Authentication Process

Register

Login

Forgot Password

Reset Password

API Authentication

---

# 28. Future Expansion

Auto Read OTP

OTP qua WhatsApp

OTP qua Zalo

OTP Voice Call

Push Verification

Biometric Verification

---

# 29. Summary

OTP Verification là bước xác minh danh tính trước khi người dùng được phép sử dụng hệ thống BusZ.

Module này phải đảm bảo tính bảo mật, tốc độ và khả năng chống gian lận.