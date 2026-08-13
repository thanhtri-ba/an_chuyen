# Forgot Password Screen

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Authentication

Screen ID: AUTH-006

Priority: Critical

Status: Draft

---

# 1. Purpose

Màn hình Forgot Password cho phép người dùng yêu cầu đặt lại mật khẩu khi quên mật khẩu đăng nhập.

Hệ thống sẽ xác minh danh tính bằng Email hoặc số điện thoại trước khi cho phép đặt lại mật khẩu.

---

# 2. Business Goal

Đảm bảo người dùng có thể khôi phục tài khoản:

- Nhanh chóng.
- An toàn.
- Không làm lộ thông tin tài khoản.
- Chống lạm dụng gửi OTP.

---

# 3. Actors

Primary

Customer

Guest

Secondary

Backend

Email Service

SMS Service

---

# 4. Preconditions

- Người dùng đã có tài khoản.
- Thiết bị có kết nối Internet.
- Hệ thống Email hoặc SMS hoạt động bình thường.

---

# 5. UI Layout

```text
AppBar

↓

Illustration

↓

Title

↓

Description

↓

Email / Phone Input

↓

Send OTP Button

↓

Back To Login
```

---

# 6. Components

- Back Button
- Illustration
- Title
- Description
- Email / Phone TextField
- Send OTP Button
- Login Button
- Loading Overlay
- Error Message

---

# 7. Field Specification

## Email / Phone

Type

String

Required

Yes

Validation

- Email đúng định dạng

hoặc

- Phone 10–11 số

Max Length

100

---

# 8. Functional Requirements

FR-001

Cho phép nhập Email.

FR-002

Cho phép nhập số điện thoại.

FR-003

Kiểm tra tài khoản tồn tại.

FR-004

Gửi OTP.

FR-005

Điều hướng sang OTP Verification.

---

# 9. Business Rules

BR-001

Email hoặc Phone phải tồn tại.

BR-002

Mỗi yêu cầu sẽ tạo OTP mới.

BR-003

OTP cũ bị vô hiệu.

BR-004

Giới hạn số lần gửi OTP.

BR-005

Không tiết lộ Email có tồn tại hay không.

---

# 10. Business Logic

User nhập Email

↓

Validate

↓

POST /auth/forgot-password

↓

Generate OTP

↓

Send OTP

↓

Navigate OTP Verification

---

# 11. API

POST /auth/forgot-password

Request

```json
{
    "email": "user@example.com"
}
```

Response

```json
{
    "success": true,
    "message": "If the account exists, an OTP has been sent."
}
```

---

# 12. Database

Tables

users

otp_codes

login_sessions

activity_logs

---

# 13. State Machine

DEFAULT

↓

INPUT

↓

VALIDATING

↓

SENDING

↓

SUCCESS

↓

OTP

---

ERROR

↓

RETRY

---

# 14. Validation

Email hợp lệ.

Phone hợp lệ.

Không để trống.

Không gửi nhiều lần liên tục.

---

# 15. Loading State

Disable Button

↓

Loading

↓

Wait Response

---

# 16. Error State

Không Internet.

Server Error.

OTP Service Error.

Rate Limit.

Unknown Error.

---

# 17. Success State

OTP gửi thành công.

↓

Navigate OTP Verification.

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

HTTPS.

Không hiển thị Email tồn tại hay không.

Rate Limit.

OTP Hash.

Không lưu OTP dạng Plain Text.

---

# 20. Accessibility

Touch Area ≥ 48dp.

Dynamic Font.

Screen Reader.

Keyboard Navigation.

---

# 21. Performance

API Response

< 2 giây.

Animation

60 FPS.

---

# 22. Analytics Events

forgot_password_view

forgot_password_submit

forgot_password_success

forgot_password_failed

otp_sent

---

# 23. Flutter Widget Tree

Scaffold

SafeArea

SingleChildScrollView

Column

Image

Text

TextFormField

FilledButton

TextButton

CircularProgressIndicator

---

# 24. State Management

AuthenticationBloc

ForgotPasswordEvent

ForgotPasswordState

ForgotPasswordUseCase

AuthenticationRepository

---

# 25. Test Cases

✓ Email hợp lệ.

✓ Phone hợp lệ.

✓ Email không tồn tại.

✓ Phone không tồn tại.

✓ Không Internet.

✓ Loading.

✓ OTP gửi thành công.

✓ Rate Limit hoạt động.

---

# 26. Acceptance Criteria

✓ OTP được gửi.

✓ Không tiết lộ tài khoản tồn tại.

✓ Điều hướng OTP.

✓ Hiển thị lỗi đúng.

✓ Không crash.

---

# 27. Related Documents

Authentication Process

Login

OTP Verification

Reset Password

API Authentication

---

# 28. Future Expansion

Forgot Password bằng Google.

Forgot Password bằng Apple.

Push Verification.

Voice OTP.

WhatsApp OTP.

---

# 29. Summary

Forgot Password Screen cho phép người dùng yêu cầu đặt lại mật khẩu một cách an toàn thông qua Email hoặc số điện thoại.

Hệ thống phải đảm bảo bảo mật thông tin tài khoản, chống spam OTP và mang lại trải nghiệm khôi phục tài khoản nhanh chóng.