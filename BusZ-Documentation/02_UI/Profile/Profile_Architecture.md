# Profile Architecture

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Profile

Document ID: PROFILE-001

Priority: High

Status: Draft

Version: 1.0

---

# 1. Purpose

Profile Module quản lý toàn bộ thông tin tài khoản và hồ sơ người dùng.

Đây là trung tâm quản lý dữ liệu cá nhân của khách hàng.

---

# 2. Objectives

Đảm bảo:

✓ Quản lý hồ sơ.

✓ Quản lý hành khách.

✓ Quản lý địa chỉ.

✓ Quản lý bảo mật.

✓ Quản lý lịch sử.

---

# 3. Scope

Bao gồm

Profile

↓

Passenger

↓

Address

↓

Payment Method

↓

Travel Preference

↓

Security

↓

Settings

Không bao gồm

Booking

Payment

Ticket

---

# 4. Actors

Customer

Admin

Customer Support

Authentication Service

Notification Service

---

# 5. Profile Lifecycle

Register

↓

Verify Email

↓

Create Profile

↓

Complete Profile

↓

Travel

↓

Update

↓

Archive

---

Deactivate

↓

Delete

---

# 6. Profile Components

Avatar

Personal Information

Passenger List

Address Book

Payment Methods

Preferences

Security

Settings

---

# 7. Core Services

Profile Service

Passenger Service

Preference Service

Security Service

Notification Service

Audit Service

---

# 8. Architecture

Flutter

↓

API Gateway

↓

Profile Service

↓

Authentication

↓

Database

↓

Notification

---

# 9. Business Rules

PROFILE-BR-001

Một User có một Profile.

PROFILE-BR-002

Một Profile có nhiều Passenger.

PROFILE-BR-003

Profile phải liên kết Authentication.

PROFILE-BR-004

Mọi thay đổi phải ghi Audit Log.

---

# 10. API

GET /profile

PUT /profile

DELETE /profile

GET /profile/settings

---

# 11. Database

users

profiles

passengers

addresses

preferences

audit_logs

---

# 12. Security

JWT

HTTPS

RBAC

Encryption

Audit Log

---

# 13. Performance

Load Profile

<1 giây

Update Profile

<1 giây

---

# 14. Analytics

profile_view

profile_update

avatar_changed

profile_completed

---

# 15. Acceptance Criteria

✓ Profile đồng bộ.

✓ Không Duplicate.

✓ Audit đầy đủ.

✓ Security hoạt động.

---

# 16. Related Documents

Authentication

Passenger Management

Settings

Security

---

# 17. Future Expansion

Business Profile

Corporate Account

Family Account

Multi Profile

Travel Passport

---

# 18. Summary

Profile Architecture là nền tảng quản lý toàn bộ hồ sơ người dùng của BusZ, bao gồm thông tin cá nhân, hành khách, địa chỉ, cài đặt và các thành phần liên quan đến tài khoản.