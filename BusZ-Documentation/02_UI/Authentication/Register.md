# Register Screen

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Authentication

Screen ID: AUTH-004

Priority: Critical

Status: Draft

---

# 1. Purpose

Màn hình Register cho phép người dùng tạo tài khoản mới trên hệ thống BusZ.

Sau khi đăng ký thành công, người dùng sẽ:

- Xác minh Email hoặc OTP.
- Đăng nhập.
- Sử dụng toàn bộ chức năng của ứng dụng.

---

# 2. Business Goal

Tạo tài khoản nhanh.

Bảo mật.

Không tạo tài khoản trùng.

Có thể mở rộng Social Login trong tương lai.

---

# 3. Actors

Guest

---

# 4. Preconditions

Thiết bị có Internet.

Backend hoạt động.

User chưa có tài khoản.

---

# 5. UI Layout

AppBar

↓

Logo BusZ

↓

Welcome

↓

Full Name

↓

Email

↓

Phone

↓

Password

↓

Confirm Password

↓

Terms & Conditions

↓

Register Button

↓

Already have account?

↓

Login

---

# 6. Components

Logo

Title

Subtitle

Full Name TextField

Email TextField

Phone TextField

Password TextField

Confirm Password

Checkbox Terms

Primary Register Button

Login Button

Loading Indicator

---

# 7. Field Specification

## Full Name

Type

String

Required

Yes

Min Length

2

Max Length

100

Validation

Không chứa ký tự đặc biệt.

---

## Email

Type

Email

Required

Yes

Unique

Yes

Validation

Theo chuẩn RFC.

---

## Phone

Type

String

Required

Yes

Validation

10–11 số.

---

## Password

Type

Password

Required

Yes

Min

8 ký tự.

Future

Bao gồm:

- Chữ hoa
- Chữ thường
- Số
- Ký tự đặc biệt

---

## Confirm Password

Phải trùng Password.

---

## Terms

Bắt buộc đồng ý.

---

# 8. Business Rules

BR-001

Email không được trùng.

BR-002

Phone không được trùng.

BR-003

Password ≥ 8 ký tự.

BR-004

Confirm Password phải khớp.

BR-005

Phải đồng ý Điều khoản.

BR-006

Mỗi Email chỉ có một tài khoản.

---

# 9. Business Logic

User nhập thông tin

↓

Validate

↓

POST /auth/register

↓

Backend Validate

↓

Create User

↓

Hash Password

↓

Send OTP

↓

Navigate OTP Verification

---

# 10. API

POST /auth/register

Request

```json
{
  "fullName": "",
  "email": "",
  "phone": "",
  "password": ""
}
```

Response

```json
{
  "userId": "",
  "status": "PENDING_VERIFICATION"
}
```

---

# 11. Database

Tables

users

user_profiles

otp_codes

login_sessions

---

# 12. Validation

Tên trống.

↓

Hiển thị lỗi.

---

Email sai định dạng.

↓

Hiển thị lỗi.

---

Email đã tồn tại.

↓

Không tạo tài khoản.

---

Phone đã tồn tại.

↓

Hiển thị lỗi.

---

Password không khớp.

↓

Không gửi API.

---

# 13. Loading State

Disable Register Button

↓

Loading

↓

Wait Response

---

# 14. Error State

Network Error

Server Error

Duplicate Email

Duplicate Phone

Password Weak

Unknown Error

---

# 15. Success State

Register Success

↓

Navigate OTP

---

# 16. Navigation

Register

↓

OTP Verification

---

Already Have Account

↓

Login

---

Terms

↓

Terms Screen

---

Privacy Policy

↓

Privacy Screen

---

# 17. Security

HTTPS

Password Hash

Rate Limit

Anti Spam

Captcha (Future)

---

# 18. Accessibility

Touch Area

48dp

Screen Reader

Dynamic Font

Keyboard Navigation

---

# 19. Performance

Register API

< 2 giây

Render

< 500ms

Animation

60 FPS

---

# 20. Analytics Events

register_screen_view

register_click

register_success

register_failed

terms_open

login_click

---

# 21. Flutter Widget Tree

Scaffold

SafeArea

SingleChildScrollView

Column

Image

Text

TextFormField

CheckboxListTile

FilledButton

TextButton

CircularProgressIndicator

---

# 22. State Management

AuthenticationBloc

RegisterEvent

RegisterState

RegisterUseCase

AuthenticationRepository

---

# 23. Test Cases

✓ Đăng ký thành công.

✓ Email trùng.

✓ Phone trùng.

✓ Password không khớp.

✓ Chưa đồng ý điều khoản.

✓ Không Internet.

✓ Loading.

✓ OTP được gửi.

---

# 24. Acceptance Criteria

✓ Tạo tài khoản thành công.

✓ Hash Password.

✓ OTP được tạo.

✓ Điều hướng OTP.

✓ Không tạo User trùng.

✓ Không Crash.

---

# 25. Related Documents

Authentication Process

Login

OTP Verification

Database

API Authentication

---

# 26. Future Expansion

Google Register

Apple Register

Facebook Register

Biometric Registration

Passkey

---

# 27. Summary

Register Screen cho phép người dùng tạo tài khoản mới trên BusZ một cách nhanh chóng, an toàn và có khả năng mở rộng trong tương lai.

Mọi tài khoản mới phải được xác minh trước khi sử dụng hệ thống.