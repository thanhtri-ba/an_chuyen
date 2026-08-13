# Navigation

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Flutter Mobile App

Document ID

APP-003

Priority

Critical

Version

1.0

---

# 1. Purpose

Navigation quản lý toàn bộ luồng điều hướng trong ứng dụng BusZ.

Mục tiêu:

- Điều hướng nhanh
- Dễ mở rộng
- Hỗ trợ Deep Link
- Bảo vệ màn hình cần đăng nhập
- Hỗ trợ Nested Navigation

---

# 2. Navigation Library

BusZ sử dụng

```text
go_router
```

Kết hợp

```text
ShellRoute
```

để quản lý Bottom Navigation.

---

# 3. Route Structure

```text
Splash

↓

Onboarding

↓

Login

↓

Home

↓

Search

↓

Trip Detail

↓

Seat Selection

↓

Passenger Info

↓

Payment

↓

Ticket

↓

Profile

↓

Settings
```

---

# 4. Route Naming Convention

```text
/

login

register

home

search

trip

booking

payment

ticket

profile

settings

notification
```

Không sử dụng route hardcode trong Widget.

---

# 5. Route Constants

Ví dụ

```text
AppRoutes.home

AppRoutes.search

AppRoutes.booking

AppRoutes.payment

AppRoutes.profile
```

---

# 6. Bottom Navigation

Tabs

```text
Home

Search

Bookings

Notifications

Profile
```

Giữ trạng thái khi chuyển tab.

---

# 7. Nested Navigation

```text
ShellRoute

↓

Bottom Navigation

↓

Independent Navigation Stack

↓

Each Tab
```

Ví dụ

Home

↓

Trip Detail

↓

Back

↓

Home vẫn giữ Scroll Position

---

# 8. Authentication Guard

Nếu chưa đăng nhập

↓

Redirect

```text
/login
```

Nếu đã đăng nhập

↓

Tiếp tục Route

---

# 9. Protected Routes

```text
Booking

Payment

Ticket

Profile

Settings
```

Chỉ User đã Login mới truy cập.

---

# 10. Public Routes

```text
Splash

Onboarding

Login

Register

Forgot Password

Search

Trip Detail
```

---

# 11. Deep Linking

Ví dụ

```text
busz://trip/123

busz://ticket/ABC123

busz://promotion/BUSZ20

busz://booking/987
```

---

# 12. Route Parameters

Path Parameter

```text
/trips/:tripId
```

Query Parameter

```text
/search?from=HCM&to=DL
```

Extra Data

```text
TripModel
```

---

# 13. Route Transition

Animation

```text
Fade

Slide

Scale
```

Duration

```text
250ms
```

Không dùng animation nặng.

---

# 14. Back Navigation

Android

↓

System Back

iOS

↓

Swipe Back

Business Rules

- Không mất dữ liệu Form.
- Hiển thị Confirm Dialog nếu có dữ liệu chưa lưu.

---

# 15. Error Routes

Nếu Route không tồn tại

↓

```text
404 Screen
```

Hiển thị:

- Route Not Found
- Back Home Button

---

# 16. Navigation Flow

```text
Splash

↓

Login

↓

Home

↓

Search

↓

Trip Detail

↓

Seat Selection

↓

Passenger Info

↓

Payment

↓

Ticket
```

---

# 17. Navigation Guards

Kiểm tra

- JWT
- Network
- App Version
- Maintenance Mode

Nếu thất bại

↓

Redirect phù hợp.

---

# 18. Performance

Navigation Time

```text
<100ms
```

Memory

Giữ tối đa

```
5
```

Route Stack.

---

# 19. Testing

✓ Login Redirect.

✓ Protected Route.

✓ Deep Link.

✓ Bottom Navigation.

✓ Back Navigation.

✓ Invalid Route.

✓ Nested Navigation.

---

# 20. Acceptance Criteria

✓ GoRouter hoạt động.

✓ Deep Link hoạt động.

✓ Authentication Guard.

✓ Nested Navigation.

✓ Back Stack đúng.

✓ Không mất trạng thái khi đổi tab.

---

# 21. Related Documents

APP-001 App Architecture

APP-002 Design System

APP-004 Authentication UI

---

# 22. Summary

Navigation của BusZ được xây dựng trên GoRouter với ShellRoute, hỗ trợ Bottom Navigation, Nested Navigation, Deep Linking và Authentication Guard. Kiến trúc này giúp điều hướng rõ ràng, hiệu quả và dễ mở rộng cho toàn bộ ứng dụng Flutter.