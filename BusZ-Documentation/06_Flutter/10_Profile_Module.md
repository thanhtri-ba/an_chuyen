# Profile Module

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Flutter Mobile App

Document ID

APP-010

Priority

High

Version

1.0

---

# 1. Purpose

Profile Module cho phép người dùng quản lý toàn bộ thông tin cá nhân và cài đặt tài khoản.

Bao gồm:

- Hồ sơ cá nhân
- Ảnh đại diện
- Địa chỉ
- Tuyến yêu thích
- Lịch sử đặt vé
- Phương thức thanh toán
- Bảo mật
- Cài đặt tài khoản

---

# 2. User Flow

```text
Home

↓

Profile

↓

Edit Profile

↓

Save

↓

Profile Updated
```

---

# 3. Profile Screen Layout

```text
AppBar

↓

Profile Header

↓

Quick Actions

↓

Account Section

↓

Travel Section

↓

Security Section

↓

Settings Section

↓

Logout
```

---

# 4. Profile Header

Hiển thị

- Avatar
- Họ tên
- Email
- Số điện thoại
- Thành viên (Bronze/Silver/Gold)

Buttons

```text
Edit

Change Avatar
```

---

# 5. Edit Profile

Fields

```text
Full Name

Phone Number

Date of Birth

Gender

Email (Read Only)

National ID

Address
```

Validation

- Không để trống
- Email không chỉnh sửa
- Số điện thoại hợp lệ

---

# 6. Avatar

Nguồn

```text
Camera

Gallery
```

Định dạng

```text
JPG

PNG

WEBP
```

Giới hạn

```text
5 MB
```

---

# 7. Address Management

Hiển thị

- Tỉnh/Thành
- Quận/Huyện
- Phường/Xã
- Địa chỉ chi tiết

Cho phép

```text
Add

Edit

Delete
```

---

# 8. Favorite Routes

Hiển thị

- Tuyến yêu thích
- Giá gần nhất
- Nhà xe phổ biến

Buttons

```text
Search Again

Remove
```

---

# 9. Booking History

Tabs

```text
Upcoming

Completed

Cancelled
```

Hiển thị

- Mã đặt vé
- Tuyến
- Ngày
- Trạng thái

---

# 10. Saved Payment Methods

Hỗ trợ

```text
Credit Card

Debit Card

VNPay Token

MoMo Account
```

Cho phép

```text
Add

Remove

Set Default
```

---

# 11. Security

Các chức năng

```text
Change Password

Biometric Login

Trusted Devices

Logout All Devices
```

---

# 12. Change Password

Fields

```text
Current Password

New Password

Confirm Password
```

Validation

- Mật khẩu mới khác mật khẩu cũ
- Đúng chính sách bảo mật

---

# 13. Account Settings

Cho phép

```text
Language

Currency

Dark Mode

Notification

Privacy
```

---

# 14. Delete Account

Flow

```text
Warning

↓

Confirm Password

↓

Delete Request

↓

Logout
```

Xóa theo chính sách lưu trữ dữ liệu.

---

# 15. Loading State

Skeleton

- Header
- Menu
- Cards

---

# 16. Empty State

Ví dụ

```text
No favorite routes.
```

Buttons

```text
Explore Trips
```

---

# 17. Error State

Ví dụ

```text
Unable to load profile.
```

Buttons

```text
Retry
```

---

# 18. Offline Mode

Cho phép

- Xem hồ sơ đã lưu
- Xem lịch sử vé

Không cho phép

- Cập nhật hồ sơ
- Đổi mật khẩu
- Xóa tài khoản

---

# 19. State Management

Cubit

```text
ProfileCubit
```

States

```text
ProfileInitial

ProfileLoading

ProfileLoaded

ProfileUpdating

ProfileUpdated

ProfileOffline

ProfileError
```

---

# 20. API Integration

```text
GET /profile

PATCH /profile

POST /profile/avatar

GET /bookings/history

GET /favorite-routes

PATCH /settings
```

---

# 21. Component Tree

```text
ProfileScreen

↓

ProfileHeader

↓

QuickActionGrid

↓

AccountSection

↓

BookingHistory

↓

FavoriteRoutes

↓

SecuritySection

↓

SettingsSection

↓

LogoutButton
```

---

# 22. UX Guidelines

✓ Hiển thị avatar lớn.

✓ Chỉnh sửa nhanh với ít thao tác.

✓ Tự động lưu nháp khi chỉnh sửa.

✓ Hiển thị xác nhận trước các thao tác nguy hiểm.

✓ Đồng bộ dữ liệu sau khi cập nhật.

---

# 23. Performance

Profile Load

```text
<100ms
```

Avatar Upload

```text
<3s
```

Update Profile

```text
<300ms
```

---

# 24. Test Cases

✓ View Profile.

✓ Edit Profile.

✓ Upload Avatar.

✓ Change Password.

✓ Favorite Routes.

✓ Booking History.

✓ Logout All Devices.

✓ Delete Account.

---

# 25. Acceptance Criteria

✓ Hồ sơ cập nhật thành công.

✓ Avatar tải lên đúng.

✓ Favorite Routes hoạt động.

✓ Booking History chính xác.

✓ Dark Mode hoạt động.

✓ Security Settings đầy đủ.

---

# 26. Related Documents

APP-009 Ticket Module

APP-011 Notification Module

API-005 Profile API

---

# 27. Summary

Profile Module là trung tâm quản lý tài khoản của BusZ, cho phép người dùng cập nhật thông tin cá nhân, quản lý tuyến yêu thích, lịch sử đặt vé, phương thức thanh toán và các thiết lập bảo mật. Module được thiết kế để mang lại trải nghiệm quản lý tài khoản thuận tiện, an toàn và nhất quán.