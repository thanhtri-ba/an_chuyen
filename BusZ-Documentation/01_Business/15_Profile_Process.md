# Profile Process

Project: BusZ - Intercity Bus Ticket Booking Platform

Version: 1.0

Document Type: Business Process

Module: User Profile

Priority: High

Status: Draft

---

# 1. Purpose

Tài liệu này mô tả toàn bộ quy trình quản lý hồ sơ người dùng (User Profile) trong hệ thống BusZ.

Profile không chỉ là thông tin cá nhân mà còn là trung tâm quản lý:

- Thông tin tài khoản
- Danh sách hành khách
- Danh sách người liên hệ
- Lịch sử đặt vé
- Ví điểm thưởng
- Cài đặt ứng dụng
- Bảo mật tài khoản

---

# 2. Scope

Áp dụng cho:

- Mobile Application
- Backend API
- Database
- Admin Website

---

# 3. Business Goal

Giúp người dùng:

- Quản lý thông tin cá nhân.
- Quản lý hành khách.
- Quản lý liên hệ.
- Đổi mật khẩu.
- Theo dõi lịch sử.
- Quản lý tài khoản.

---

# 4. Actors

Primary

Customer

Secondary

Backend

Database

Admin

---

# 5. Profile Modules

Profile gồm:

Personal Information

↓

Contacts

↓

Passengers

↓

Booking History

↓

Payment History

↓

Reward Points

↓

Notifications

↓

Settings

↓

Security

---

# 6. Personal Information

Thông tin:

Avatar

Full Name

Gender

Birthday

Phone

Email

Address

Nationality

Language

---

# 7. Contact Management

Một User

↓

Có nhiều Contact

Ví dụ

Cha

Mẹ

Bạn

Người thân

---

Thông tin Contact

Full Name

Phone

Relationship

Email

---

# 8. Passenger Management

User có thể lưu nhiều Passenger.

Ví dụ

Bản thân

Con

Cha

Mẹ

Bạn

---

Thông tin Passenger

Full Name

Birthday

Gender

ID Number

Phone

Nationality

---

# 9. Booking History

Hiển thị:

Booking Code

Trip

Date

Seat

Price

Status

Ticket

Payment

---

Có thể:

View

Download Ticket

Cancel Booking

Review

---

# 10. Payment History

Hiển thị:

Transaction ID

Amount

Method

Status

Created Time

Refund Status

---

# 11. Reward Points

Hiển thị:

Current Point

Membership

History

Voucher

Expired Point

---

# 12. Notification Center

Hiển thị:

Booking

Payment

Refund

Promotion

System

---

# 13. Settings

Language

Theme

Notification

Biometric

Privacy

Auto Login

---

# 14. Security

Change Password

Device Management

Login History

Logout All Devices

Delete Account

---

# 15. Profile Update Flow

```mermaid
flowchart TD

Customer

-->

Edit Profile

-->

Backend Validate

-->

Update Database

-->

Return Profile

-->

Refresh Mobile
```

---

# 16. Database Tables

users

user_profiles

contacts

passengers

bookings

payments

loyalty_accounts

notifications

devices

login_sessions

---

# 17. API Flow

GET /users/me

↓

PUT /users/me

↓

POST /users/avatar

↓

GET /users/contacts

↓

GET /users/passengers

↓

GET /users/bookings

↓

GET /users/payments

---

# 18. Validation Rules

Email

Unique

Phone

Unique

Birthday

<= Today

Avatar

Image Only

---

# 19. Exception Cases

Email đã tồn tại.

↓

Thông báo.

---

Ảnh quá lớn.

↓

Không upload.

---

Mất mạng.

↓

Retry.

---

Token hết hạn.

↓

Refresh Token.

---

# 20. Notification

Profile Updated

Password Changed

New Device Login

Account Deleted

Email Changed

Phone Changed

---

# 21. Logging

Profile Updated

Avatar Changed

Password Changed

Device Added

Device Removed

---

# 22. Security

JWT Required

Owner Only

Encrypted Password

Activity Log

Audit Trail

---

# 23. Reports

User Growth

Active User

Profile Completion

Most Used Device

Top Membership

---

# 24. Acceptance Criteria

✓ Profile cập nhật thành công.

✓ Avatar upload thành công.

✓ Contact lưu thành công.

✓ Passenger lưu thành công.

✓ Booking History hiển thị.

✓ Reward Point hiển thị.

✓ Notification hiển thị.

---

# 25. Future Expansion

Digital Wallet

Emergency Contact

Travel Preferences

Favorite Routes

Saved Payment Method

Identity Verification

Travel Insurance

---

# 26. Related Documents

Authentication Process

Booking Process

Payment Process

Loyalty Points

Notification Process

Database Design

API Specification

---

# 27. Summary

Profile Process là trung tâm quản lý toàn bộ dữ liệu cá nhân của khách hàng trong BusZ.

Module này phải đảm bảo dữ liệu luôn đồng bộ giữa Mobile, Backend và Database, đồng thời cung cấp trải nghiệm quản lý tài khoản thuận tiện, an toàn và dễ mở rộng trong tương lai.