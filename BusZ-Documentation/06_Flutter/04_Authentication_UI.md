# Authentication UI

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Flutter Mobile App

Document ID

APP-004

Priority

Critical

Version

1.0

---

# 1. Purpose

Authentication UI quản lý toàn bộ trải nghiệm xác thực của người dùng.

Bao gồm:

- Splash
- Onboarding
- Welcome
- Login
- Register
- Email Verification
- Forgot Password
- Reset Password
- OTP Verification
- Biometric Login
- Logout

---

# 2. User Flow

```text
Splash

↓

Onboarding

↓

Welcome

↓

Login

↓

Email Verification

↓

Home
```

Đối với User cũ

```text
Splash

↓

Auto Login

↓

Home
```

---

# 3. Authentication Screens

```text
Splash

Onboarding

Welcome

Login

Register

Forgot Password

Reset Password

Verify Email

OTP Verification

Biometric Login

Session Expired
```

---

# 4. Splash Screen

Hiển thị

- Logo BusZ
- Version
- Loading Animation

Business Flow

```text
Check Token

↓

Check Version

↓

Check Maintenance

↓

Navigate
```

Thời gian

```
1–2 giây
```

---

# 5. Onboarding

Hiển thị

- Giới thiệu BusZ
- Đặt vé nhanh
- Thanh toán an toàn
- Theo dõi chuyến đi

Navigation

```text
Skip

Next

Get Started
```

Chỉ hiển thị lần đầu.

---

# 6. Welcome Screen

Buttons

```text
Login

Register

Continue as Guest
```

Guest chỉ được:

- Search Trip
- View Route
- View Promotion

Không được:

- Booking
- Payment
- Ticket

---

# 7. Login Screen

Methods

```text
Email

Google

Apple
```

Fields

```text
Email

Password
```

Buttons

```text
Login

Forgot Password

Register
```

---

# 8. Register Screen

Fields

```text
Full Name

Email

Phone

Password

Confirm Password
```

Checkbox

```text
Accept Terms

Accept Privacy Policy
```

---

# 9. Email Verification

Sau Register

↓

Gửi Email

↓

Verify

↓

Login

Buttons

```text
Resend Email

Change Email
```

---

# 10. Forgot Password

Field

```text
Email
```

Flow

```text
Enter Email

↓

Receive OTP / Link

↓

Reset Password
```

---

# 11. Reset Password

Fields

```text
New Password

Confirm Password
```

Validation

- ≥ 8 ký tự
- 1 chữ hoa
- 1 số
- 1 ký tự đặc biệt

---

# 12. OTP Verification

Length

```text
6 digits
```

Countdown

```text
60 giây
```

Buttons

```text
Verify

Resend OTP
```

---

# 13. Biometric Login

Hỗ trợ

```text
Face ID

Fingerprint
```

Điều kiện

- User đã đăng nhập ít nhất một lần.
- Thiết bị hỗ trợ sinh trắc học.

---

# 14. Session Expired

Hiển thị

```text
Session Expired

Please login again.
```

Buttons

```text
Login

Cancel
```

---

# 15. Logout

Flow

```text
Confirm

↓

Clear Secure Storage

↓

Clear Cache

↓

Navigate Login
```

---

# 16. Validation Rules

Email

```text
RFC5322
```

Password

```text
≥8 ký tự

1 chữ hoa

1 chữ thường

1 số

1 ký tự đặc biệt
```

Phone

```text
10–15 số
```

---

# 17. UI States

Loading

```text
Circular Progress
```

Error

```text
Snackbar

Dialog
```

Empty

```text
Illustration

Message
```

Offline

```text
No Internet
```

---

# 18. Accessibility

Touch Target

```text
48x48
```

Password Toggle

✓

Autofill

✓

Keyboard Type

Theo từng trường.

---

# 19. Security

Flutter Secure Storage

↓

JWT

↓

Refresh Token

↓

Biometric

↓

Logout All Devices

---

# 20. Test Cases

✓ Login Success.

✓ Wrong Password.

✓ Register.

✓ Duplicate Email.

✓ Forgot Password.

✓ Reset Password.

✓ OTP Expired.

✓ Biometric Login.

✓ Logout.

---

# 21. Acceptance Criteria

✓ Authentication Flow hoàn chỉnh.

✓ Validation chính xác.

✓ Google Login hoạt động.

✓ Apple Login hoạt động.

✓ Biometric hoạt động.

✓ Secure Storage.

---

# 22. Related Documents

APP-003 Navigation

APP-005 Home Module

API-003 Authentication API

---

# 23. Summary

Authentication UI của BusZ cung cấp trải nghiệm xác thực hiện đại với Splash, Onboarding, Login, Register, Email Verification, OTP và Biometric Login. Toàn bộ dữ liệu xác thực được lưu an toàn trong Flutter Secure Storage và đồng bộ với Backend Authentication API.