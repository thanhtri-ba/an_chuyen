# Profile Detail

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Profile

Document ID: PROFILE-002

Priority: High

Status: Draft

Version: 1.0

---

# 1. Purpose

Profile Detail là màn hình hiển thị thông tin cá nhân của người dùng trong ứng dụng BusZ.

Người dùng có thể xem nhanh:

- Thông tin tài khoản
- Ảnh đại diện
- Số điện thoại
- Email
- Hạng thành viên
- Điểm thưởng
- Lịch sử đặt vé
- Cài đặt tài khoản

---

# 2. Objectives

Đảm bảo người dùng có thể:

✓ Xem hồ sơ cá nhân.

✓ Truy cập nhanh các chức năng tài khoản.

✓ Kiểm tra điểm thưởng.

✓ Truy cập lịch sử vé.

✓ Mở phần cài đặt.

---

# 3. Actors

Customer

Admin

Customer Support

---

# 4. Preconditions

✓ User đã đăng nhập.

✓ Access Token hợp lệ.

---

# 5. UI Layout

AppBar

↓

Profile Header

↓

Membership Card

↓

Reward Point Card

↓

Menu List

↓

Logout Button

---

# 6. Components

Avatar

Full Name

Phone

Email

Membership Badge

Reward Point Card

Booking History Item

Passenger Management Item

Settings Item

Logout Button

---

# 7. Display Information

Full Name

Avatar

Phone Number

Email

Membership Level

Reward Points

Total Bookings

Total Tickets

Account Status

---

# 8. Business Rules

PROFILE-BR-005

User chỉ được xem Profile của chính mình.

PROFILE-BR-006

Không hiển thị dữ liệu nhạy cảm.

PROFILE-BR-007

Profile phải đồng bộ với Authentication Service.

PROFILE-BR-008

Mọi thay đổi quan trọng phải ghi Audit Log.

---

# 9. Business Logic

Open Profile

↓

Verify Token

↓

Load User Profile

↓

Load Reward Points

↓

Load Membership

↓

Render Screen

---

# 10. API

GET /profile

GET /profile/membership

GET /profile/reward-points

GET /profile/statistics

---

# 11. Database

users

profiles

loyalty_accounts

membership_levels

bookings

tickets

---

# 12. Loading State

Loading Profile

↓

Loading Membership

↓

Loading Reward Points

---

# 13. Empty State

Profile chưa đầy đủ.

↓

Hiển thị nút:

Complete Profile

---

# 14. Error State

Network Error

↓

Retry

---

Token Expired

↓

Refresh Token

---

Unauthorized

↓

Login

---

# 15. Success State

Profile Loaded

↓

Display Information

↓

Enable Menu

---

# 16. Navigation

Edit Profile

↓

Edit Profile Screen

---

Passenger Management

↓

Passenger Management Screen

---

Booking History

↓

Booking History Screen

---

Settings

↓

Settings Screen

---

Logout

↓

Login Screen

---

# 17. Analytics

profile_view

edit_profile_click

reward_point_click

membership_click

logout_click

settings_click

---

# 18. Flutter Widget Tree

Scaffold

↓

AppBar

↓

ProfileHeader

↓

MembershipCard

↓

RewardPointCard

↓

ProfileMenuList

↓

LogoutButton

---

# 19. State Management

ProfileBloc

ProfileRepository

RewardRepository

MembershipRepository

AuthenticationRepository

---

# 20. Performance

Load Profile

< 1 giây

Render

60 FPS

---

# 21. Accessibility

Avatar có mô tả.

Text đủ lớn.

Touch Area ≥ 48dp.

Screen Reader hỗ trợ.

---

# 22. Test Cases

✓ Load Profile thành công.

✓ Token hết hạn.

✓ Không Internet.

✓ Reward Point hiển thị.

✓ Membership hiển thị.

✓ Logout hoạt động.

---

# 23. Acceptance Criteria

✓ Profile hiển thị đúng.

✓ Không hiển thị dữ liệu người khác.

✓ Menu hoạt động.

✓ Logout thành công.

✓ Không crash.

---

# 24. Related Documents

Profile Architecture

Edit Profile

Passenger Management

Settings

Authentication

---

# 25. Future Expansion

Family Account

Business Profile

Travel Passport

Identity Verification

Corporate Account

---

# 26. Summary

Profile Detail là trung tâm quản lý tài khoản người dùng trong BusZ.

Màn hình này giúp người dùng xem thông tin cá nhân, điểm thưởng, hạng thành viên và truy cập nhanh các chức năng liên quan đến tài khoản.