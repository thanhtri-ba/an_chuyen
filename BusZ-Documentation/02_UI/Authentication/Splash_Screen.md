# Splash Screen

Project: BusZ

Module: Authentication

Screen ID: AUTH-001

Priority: Critical

Status: Draft

---

# 1. Purpose

Splash Screen là màn hình đầu tiên khi người dùng mở ứng dụng.

Mục tiêu:

- Hiển thị logo BusZ.
- Khởi tạo ứng dụng.
- Kiểm tra trạng thái đăng nhập.
- Chuẩn bị dữ liệu cần thiết.
- Điều hướng sang màn hình phù hợp.

---

# 2. Business Goal

Người dùng không cần thao tác.

Splash tự động:

- Load App
- Kiểm tra Token
- Kiểm tra Internet
- Kiểm tra Version
- Điều hướng

---

# 3. Preconditions

Ứng dụng đã được cài đặt.

---

# 4. UI Layout

Background

↓

Logo BusZ

↓

Loading Indicator

↓

Version Number

---

# 5. Components

Image Logo

Loading Indicator

App Version

Background

---

# 6. UI States

Loading

Offline

Maintenance

Update Required

Success

---

# 7. Navigation

Splash

↓

Onboarding

(User mới)

---

Splash

↓

Login

(Token hết hạn)

---

Splash

↓

Home

(Token hợp lệ)

---

# 8. Business Logic

App Start

↓

Load Config

↓

Check Internet

↓

Check App Version

↓

Load Local Storage

↓

Read Access Token

↓

Read Refresh Token

↓

Validate Session

↓

Navigate

---

# 9. API

GET /app/version

POST /auth/refresh

GET /settings

---

# 10. Local Storage

Access Token

Refresh Token

Language

Theme

User Profile

Last Login

---

# 11. Loading Time

Tối thiểu

1 giây

Tối đa

3 giây

---

# 12. Error States

Không có Internet

↓

Offline Screen

---

Server Error

↓

Retry

---

Token Invalid

↓

Login

---

# 13. Animation

Logo Fade In

↓

Scale

↓

Loading

↓

Fade Out

---

# 14. Security

Không hiển thị Token.

Không hiển thị lỗi hệ thống.

Không lưu Password.

---

# 15. Acceptance Criteria

✓ Logo hiển thị.

✓ Loading hoạt động.

✓ Token được kiểm tra.

✓ Điều hướng đúng.

✓ Không bị crash.

---

# 16. Flutter Widgets

Scaffold

SafeArea

Center

Image

CircularProgressIndicator

Text

AnimatedOpacity

---

# 17. Related Documents

Authentication Process

User Flow

Design System

Animation

---

# 18. Future Expansion

Animated Logo

Lottie Animation

Maintenance Mode

Force Update

Remote Config

---

# 19. Summary

Splash Screen là điểm khởi đầu của toàn bộ ứng dụng BusZ.

Nó chịu trách nhiệm khởi tạo hệ thống và điều hướng người dùng đến đúng màn hình tiếp theo.