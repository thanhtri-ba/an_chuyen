# Testing

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Flutter Mobile App

Document ID

APP-019

Priority

Critical

Version

1.0

---

# 1. Purpose

Testing đảm bảo ứng dụng BusZ hoạt động ổn định, chính xác và đạt chất lượng trước khi phát hành.

Mục tiêu:

- Phát hiện lỗi sớm
- Đảm bảo nghiệp vụ đúng
- Giảm Regression
- Tăng độ tin cậy
- Hỗ trợ CI/CD

---

# 2. Testing Pyramid

```text
Integration Test

▲

Widget Test

▲▲▲

Unit Test

▲▲▲▲▲▲▲
```

Tỷ lệ

```text
70%

20%

10%
```

---

# 3. Unit Test

Kiểm thử

```text
UseCase

Repository

Mapper

Utility

Validation

Business Logic
```

Không test UI.

---

# 4. Cubit Test

Kiểm tra

```text
Initial State

Loading

Loaded

Error

Empty

Refresh
```

Sử dụng

```text
bloc_test
```

---

# 5. Widget Test

Kiểm thử

```text
Button

Input

Dialog

Card

Search Form

Seat Map

Ticket Card
```

---

# 6. Golden Test

So sánh giao diện

```text
Expected

↓

Actual
```

Áp dụng cho

- Home
- Search
- Booking
- Ticket
- Profile

---

# 7. Integration Test

Luồng

```text
Login

↓

Search

↓

Booking

↓

Payment

↓

Ticket
```

Kiểm thử end-to-end trong ứng dụng.

---

# 8. API Mocking

Sử dụng

```text
Mockito

Mocktail
```

Mock

```text
Repository

API

Storage
```

---

# 9. Network Testing

Kiểm tra

```text
Slow Network

Offline

Timeout

Retry

Server Error
```

---

# 10. Performance Testing

Đo

```text
Startup Time

FPS

Memory

CPU

Battery
```

---

# 11. Accessibility Testing

Kiểm tra

```text
Screen Reader

Contrast

Font Scaling

Touch Target

Keyboard Navigation
```

---

# 12. Security Testing

Kiểm tra

```text
Token Storage

Biometric

Deep Link

Permission

Root Detection

SSL Pinning
```

---

# 13. Device Compatibility

Android

```text
Android 10+

Android 11

Android 12

Android 13

Android 14
```

iOS

```text
iOS 15+

iOS 16

iOS 17
```

---

# 14. Screen Size Testing

```text
Small Phone

Large Phone

Tablet

Foldable
```

---

# 15. Localization Testing

Ngôn ngữ

```text
Vietnamese

English
```

Kiểm tra

- Text Overflow
- Date
- Currency
- Number Format

---

# 16. CI/CD Testing

Pipeline

```text
Analyze

↓

Unit Test

↓

Widget Test

↓

Integration Test

↓

Coverage

↓

Build APK

↓

Deploy
```

---

# 17. Code Coverage

Target

```text
>=80%
```

Đối với

- Business Logic
- Repository
- Cubit

---

# 18. Regression Testing

Kiểm tra lại

- Booking
- Payment
- Ticket
- Login
- Notification

Sau mỗi bản phát hành.

---

# 19. Bug Severity

```text
Critical

High

Medium

Low
```

---

# 20. Test Report

Bao gồm

```text
Passed

Failed

Skipped

Coverage

Duration
```

---

# 21. Automation Tools

```text
flutter_test

integration_test

bloc_test

mocktail

patrol (optional)

Firebase Test Lab
```

---

# 22. Release Gate

Chỉ phát hành khi

✓ Unit Test Pass.

✓ Widget Test Pass.

✓ Integration Test Pass.

✓ Coverage đạt yêu cầu.

✓ Không còn lỗi Critical.

---

# 23. Test Cases

✓ Login.

✓ Search.

✓ Booking.

✓ Payment.

✓ Ticket.

✓ Offline.

✓ Push Notification.

✓ Deep Link.

✓ Profile.

✓ Settings.

---

# 24. Acceptance Criteria

✓ Coverage ≥80%.

✓ Regression thành công.

✓ Không còn lỗi Critical.

✓ CI/CD tự động.

✓ Golden Test ổn định.

✓ Báo cáo kiểm thử đầy đủ.

---

# 25. Related Documents

APP-013 State Management

APP-018 Error Handling

APP-020 Release

---

# 26. Summary

Testing của BusZ áp dụng chiến lược kiểm thử nhiều tầng gồm Unit Test, Widget Test, Golden Test và Integration Test nhằm đảm bảo chất lượng ứng dụng. Quy trình được tích hợp vào CI/CD để tự động kiểm tra trước mỗi lần phát hành, giúp giảm lỗi và tăng độ tin cậy của sản phẩm.