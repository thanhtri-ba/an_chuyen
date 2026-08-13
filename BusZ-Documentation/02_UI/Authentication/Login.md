# Login Screen

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Authentication

Screen ID: AUTH-003

Priority: Critical

Status: Draft

---

# 1. Purpose

Màn hình Login cho phép người dùng xác thực tài khoản để sử dụng các chức năng của BusZ.

Sau khi đăng nhập thành công, người dùng có thể:

- Đặt vé
- Thanh toán
- Xem vé
- Quản lý hồ sơ
- Nhận thông báo

---

# 2. Business Goal

Người dùng có thể đăng nhập nhanh chóng và an toàn.

Phiên đăng nhập được lưu bằng JWT và Refresh Token.

---

# 3. Actors

Guest

Customer

---

# 4. Preconditions

Ứng dụng có Internet.

Backend hoạt động.

User đã có tài khoản.

---

# 5. UI Layout

AppBar

↓

Logo BusZ

↓

Welcome Text

↓

Email / Phone Input

↓

Password Input

↓

Remember Me

↓

Forgot Password

↓

Login Button

↓

Divider

↓

Google Login (Future)

↓

Register Button

---

# 6. Components

Logo

Title

Subtitle

Email TextField

Password TextField

Show Password Icon

Remember Me Checkbox

Forgot Password Button

Primary Login Button

Register Button

Loading Overlay

---

# 7. Input Fields

Email hoặc Phone

Password

Remember Me

---

# 8. Validation Rules

Email

Bắt buộc

Đúng định dạng

---

Phone

10-11 số

---

Password

Bắt buộc

Ít nhất 8 ký tự

---

# 9. Business Logic

User nhập thông tin

↓

Validate

↓

POST /auth/login

↓

Backend Verify

↓

Generate JWT

↓

Generate Refresh Token

↓

Save Secure Storage

↓

Load User Profile

↓

Navigate Home

---

# 10. API

POST /auth/login

Request

{
    "email": "...",
    "password": "..."
}

Response

{
    "accessToken": "...",
    "refreshToken": "...",
    "user": { }
}

---

# 11. Local Storage

Access Token

Refresh Token

Language

Theme

User Profile Cache

Remember Login

---

# 12. UI States

Default

Typing

Loading

Success

Error

Offline

Disabled

---

# 13. Loading State

Disable Login Button

↓

Show Circular Loading

↓

Block Multiple Requests

---

# 14. Error State

Sai Email

Sai Password

Tài khoản bị khóa

Server Error

Không có Internet

Token Error

---

# 15. Success State

Login thành công

↓

Load Home

↓

Hiển thị tên người dùng

---

# 16. Navigation

Forgot Password

↓

Forgot Password Screen

Register

↓

Register Screen

Login Success

↓

Home Screen

---

# 17. Security

Password được che.

JWT lưu trong Secure Storage.

Không lưu Password.

HTTPS bắt buộc.

Refresh Token tự động.

---

# 18. Accessibility

Touch Area ≥ 48dp

Screen Reader

Keyboard Navigation

Auto Focus

Error Message rõ ràng

---

# 19. Performance

Login API

< 2 giây

Screen Render

< 500ms

Animation

60 FPS

---

# 20. Analytics Events

login_screen_view

login_click

login_success

login_failed

forgot_password_click

register_click

---

# 21. Flutter Widget Tree

Scaffold

SafeArea

SingleChildScrollView

Column

Logo

Text

TextFormField

Checkbox

FilledButton

TextButton

CircularProgressIndicator

---

# 22. State Management

AuthenticationBloc

AuthenticationState

AuthenticationEvent

LoginUseCase

AuthenticationRepository

---

# 23. Test Cases

✓ Email hợp lệ.

✓ Password hợp lệ.

✓ Sai Email.

✓ Sai Password.

✓ Không Internet.

✓ Loading.

✓ Login thành công.

✓ Refresh Token lưu thành công.

---

# 24. Acceptance Criteria

✓ Login thành công.

✓ Token lưu Secure Storage.

✓ Chuyển Home.

✓ Hiển thị lỗi đúng.

✓ Không crash.

---

# 25. Related Documents

Authentication Process

Splash Screen

Onboarding

Register

Forgot Password

API Authentication

Flutter Authentication Module

---

# 26. Future Expansion

Google Login

Apple Login

Face ID

Fingerprint

Passkey

OTP Login

QR Login

---

# 27. Summary

Login Screen là điểm bắt đầu của mọi phiên làm việc trong BusZ.

Màn hình phải đảm bảo tính bảo mật, tốc độ và trải nghiệm người dùng, đồng thời là nền tảng cho toàn bộ hệ thống Authentication.