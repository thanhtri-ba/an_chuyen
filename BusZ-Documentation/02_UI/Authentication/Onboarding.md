# Onboarding Screen

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Authentication

Screen ID: AUTH-002

Priority: High

Status: Draft

---

# 1. Purpose

Onboarding là màn hình giới thiệu ứng dụng cho người dùng lần đầu.

Mục tiêu:

- Giới thiệu BusZ.
- Giới thiệu các tính năng chính.
- Tăng tỷ lệ đăng ký.
- Hướng dẫn người dùng sử dụng.

Người dùng chỉ xem một lần.

---

# 2. Business Goal

Giúp người dùng hiểu:

✓ Đặt vé xe khách.

✓ Chọn ghế.

✓ Thanh toán online.

✓ Vé điện tử.

✓ Theo dõi chuyến xe.

---

# 3. Preconditions

User mở App lần đầu.

Hoặc

User Reset App Data.

---

# 4. UI Layout

Background

↓

Illustration

↓

Title

↓

Description

↓

Indicator

↓

Skip

↓

Next Button

---

# 5. Components

Illustration

Headline

Description

Page Indicator

Skip Button

Next Button

Get Started Button

---

# 6. Screen Count

Version 1

03 Screens

Screen 1

Welcome

Screen 2

Booking

Screen 3

Digital Ticket

---

# 7. Navigation

Splash

↓

Onboarding

↓

Login

---

Skip

↓

Login

---

Get Started

↓

Login

---

# 8. Business Logic

Open App

↓

Check First Launch

↓

TRUE

↓

Show Onboarding

↓

Complete

↓

Save Flag

↓

Login

---

# 9. Local Storage

Save

isFirstLaunch = false

Không cần gọi API.

---

# 10. UI States

Page 1

Page 2

Page 3

Completed

---

# 11. Validation

Không yêu cầu nhập dữ liệu.

---

# 12. Loading State

Không có.

---

# 13. Empty State

Không áp dụng.

---

# 14. Error State

Nếu không đọc được Local Storage

↓

Hiển thị Onboarding.

---

# 15. Success State

User hoàn thành Onboarding.

↓

Đi đến Login.

---

# 16. Animation

Page Swipe

Fade

Illustration Scale

Indicator Animation

Button Ripple

---

# 17. Security

Không lưu dữ liệu cá nhân.

Không gọi API.

---

# 18. Accessibility

Swipe dễ dàng.

Font ≥ 14sp.

Button ≥ 48dp.

Screen Reader Support.

---

# 19. Performance

Animation 60 FPS.

Load dưới 500ms.

---

# 20. Analytics Events

Onboarding Viewed

Page Changed

Skip Clicked

Completed

---

# 21. Flutter Widget Tree

Scaffold

SafeArea

PageView

Column

Image

Text

SmoothPageIndicator

FilledButton

TextButton

---

# 22. Acceptance Criteria

✓ Hiển thị đủ 3 trang.

✓ Swipe hoạt động.

✓ Skip hoạt động.

✓ Indicator cập nhật.

✓ Get Started hoạt động.

✓ Không hiển thị lần sau.

---

# 23. Related Documents

Authentication Process

Splash Screen

Login

User Flow

Design System

---

# 24. Future Expansion

Video Onboarding

Animation bằng Rive

Personalized Onboarding

Multi Language

Dark Theme

---

# 25. Summary

Onboarding giúp người dùng mới làm quen với BusZ và giới thiệu các chức năng quan trọng trước khi bắt đầu đăng nhập hoặc đăng ký tài khoản.