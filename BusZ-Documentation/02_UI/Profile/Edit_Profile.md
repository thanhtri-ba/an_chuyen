# Edit Profile

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Profile

Document ID: PROFILE-003

Priority: High

Status: Draft

Version: 1.0

---

# 1. Purpose

Edit Profile cho phép người dùng cập nhật thông tin cá nhân của mình.

Hệ thống phải đảm bảo dữ liệu luôn chính xác, đồng bộ và được ghi nhận đầy đủ.

---

# 2. Objectives

Đảm bảo:

✓ Chỉnh sửa hồ sơ.

✓ Đồng bộ dữ liệu.

✓ Kiểm tra dữ liệu hợp lệ.

✓ Ghi Audit Log.

✓ Cập nhật thời gian thực.

---

# 3. Actors

Customer

Customer Support

Admin

---

# 4. Preconditions

✓ User đã đăng nhập.

✓ Profile tồn tại.

---

# 5. Editable Information

Avatar

Full Name

Date of Birth

Gender

Phone Number

Email (yêu cầu xác minh)

Nationality

Emergency Contact

Preferred Language

---

# 6. Non-editable Information

User ID

Created Date

Membership ID

Reward Point

Booking History

Ticket History

---

# 7. Edit Flow

Open Profile

↓

Edit Information

↓

Validate Input

↓

Save Changes

↓

Update Database

↓

Audit Log

↓

Refresh Profile

---

# 8. Validation Rules

Full Name

2–100 ký tự

---

Phone Number

Đúng định dạng quốc gia

---

Email

Định dạng hợp lệ

Không trùng

---

Date of Birth

Không lớn hơn ngày hiện tại

---

Avatar

JPG / PNG / WEBP

≤ 5 MB

---

# 9. Business Rules

PROFILE-BR-009

Email thay đổi phải xác minh lại.

PROFILE-BR-010

Phone Number phải là duy nhất.

PROFILE-BR-011

Không cho phép HTML hoặc Script.

PROFILE-BR-012

Mọi thay đổi phải ghi Audit Log.

PROFILE-BR-013

Avatar cũ không bị xóa ngay để phục vụ rollback nếu cần.

---

# 10. Business Logic

Open Screen

↓

Load Current Profile

↓

Edit Fields

↓

Validate

↓

Save

↓

Sync

↓

Refresh UI

---

# 11. API

GET /profile

PUT /profile

POST /profile/avatar

DELETE /profile/avatar

POST /profile/verify-email

---

# 12. Database

profiles

users

profile_audit_logs

profile_images

verification_requests

---

# 13. Loading State

Loading Profile

↓

Uploading Avatar

↓

Saving Profile

↓

Refreshing

---

# 14. Error State

Invalid Email

↓

Show Validation

---

Phone Exists

↓

Show Error

---

Upload Failed

↓

Retry

---

Network Error

↓

Retry

---

# 15. Success State

Profile Updated

↓

Refresh Profile

↓

Show Success Message

---

# 16. Avatar Management

Upload

↓

Crop

↓

Compress

↓

Upload

↓

Update Avatar

---

# 17. Notification

Profile Updated

Email Verification Required

Avatar Updated

Phone Updated

---

# 18. Analytics

profile_edit

avatar_upload

email_changed

phone_changed

profile_saved

---

# 19. Flutter Widget Tree

Scaffold

↓

AppBar

↓

AvatarEditor

↓

ProfileForm

↓

SaveButton

↓

LoadingOverlay

---

# 20. State Management

EditProfileBloc

ProfileRepository

StorageRepository

VerificationRepository

---

# 21. Performance

Load Profile

<1 giây

Save Profile

<1 giây

Avatar Upload

<3 giây

---

# 22. Accessibility

Large Font

Screen Reader

Keyboard Navigation

Touch Area ≥48dp

---

# 23. Test Cases

✓ Update Name.

✓ Update Email.

✓ Update Phone.

✓ Upload Avatar.

✓ Validation Error.

✓ Retry Upload.

---

# 24. Acceptance Criteria

✓ Dữ liệu cập nhật đúng.

✓ Không mất dữ liệu cũ.

✓ Audit Log đầy đủ.

✓ Avatar hiển thị đúng.

✓ Không crash.

---

# 25. Related Documents

Profile Detail

Identity Verification

Profile Security

Account Settings

Authentication

---

# 26. Future Expansion

AI Avatar Crop

Auto Profile Completion

Government ID Sync

Social Profile Sync

Digital Identity

---

# 27. Summary

Edit Profile cho phép người dùng cập nhật thông tin cá nhân một cách an toàn, có kiểm tra dữ liệu đầu vào, đồng bộ với hệ thống xác thực và lưu đầy đủ lịch sử thay đổi để phục vụ kiểm tra sau này.