# Profile API

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Backend API

Document ID

API-005

Priority

Critical

Version

1.0

---

# 1. Purpose

Profile API quản lý toàn bộ thông tin cá nhân của người dùng ngoài phần Authentication.

Bao gồm:

- Hồ sơ cá nhân
- Avatar
- Địa chỉ
- Người liên hệ khẩn cấp
- Tuyến xe yêu thích
- Ngôn ngữ
- Quốc gia
- Cài đặt cá nhân

---

# 2. Authentication

Toàn bộ API yêu cầu

```
Bearer JWT
```

---

# 3. Endpoints Overview

| Method | Endpoint | Permission |
|----------|------------------------------|------------|
| GET | /profile | User |
| PATCH | /profile | User |
| POST | /profile/avatar | User |
| DELETE | /profile/avatar | User |
| GET | /profile/preferences | User |
| PATCH | /profile/preferences | User |
| GET | /profile/addresses | User |
| POST | /profile/addresses | User |
| PATCH | /profile/addresses/{id} | User |
| DELETE | /profile/addresses/{id} | User |

---

# 4. Get Profile

Endpoint

```
GET /profile
```

Response

```json
{
  "id":"...",
  "fullName":"Nguyen Van A",
  "avatar":"https://...",
  "gender":"MALE",
  "dateOfBirth":"2006-03-14",
  "nationality":"VN",
  "language":"vi",
  "createdAt":"2026-07-04T10:00:00Z"
}
```

---

# 5. Update Profile

Endpoint

```
PATCH /profile
```

Request

```json
{
  "fullName":"Nguyen Van A",
  "gender":"MALE",
  "dateOfBirth":"2006-03-14",
  "nationality":"VN"
}
```

Response

```json
{
  "success":true,
  "message":"Profile updated successfully."
}
```

---

# 6. Upload Avatar

Endpoint

```
POST /profile/avatar
```

Content-Type

```
multipart/form-data
```

Supported

```
JPG

PNG

WEBP
```

Max Size

```
5 MB
```

Business Flow

```
Upload

↓

Virus Scan

↓

Resize

↓

Compress

↓

Supabase Storage

↓

Update Profile
```

---

# 7. Delete Avatar

Endpoint

```
DELETE /profile/avatar
```

Business Rules

- Xóa khỏi Storage.
- Gán Avatar mặc định.
- Ghi Audit.

---

# 8. User Preferences

Endpoint

```
GET /profile/preferences
```

Response

```json
{
  "language":"vi",
  "currency":"VND",
  "theme":"LIGHT",
  "notification":true
}
```

---

# 9. Update Preferences

Endpoint

```
PATCH /profile/preferences
```

Request

```json
{
  "language":"en",
  "currency":"USD",
  "theme":"DARK",
  "notification":false
}
```

---

# 10. Addresses

Endpoint

```
GET /profile/addresses
```

Response

```json
[
  {
    "id":"...",
    "label":"Home",
    "address":"123 Nguyen Trai",
    "city":"Ho Chi Minh City",
    "isDefault":true
  }
]
```

---

# 11. Add Address

Endpoint

```
POST /profile/addresses
```

Request

```json
{
  "label":"Office",
  "address":"456 Le Loi",
  "city":"Ho Chi Minh City",
  "province":"Ho Chi Minh",
  "latitude":10.7626,
  "longitude":106.6602,
  "isDefault":false
}
```

---

# 12. Update Address

Endpoint

```
PATCH /profile/addresses/{id}
```

Cho phép cập nhật:

- Label
- Address
- GPS
- Default Address

---

# 13. Delete Address

Endpoint

```
DELETE /profile/addresses/{id}
```

Business Rules

- Không được xóa địa chỉ mặc định nếu chỉ còn một địa chỉ.
- Nếu xóa địa chỉ mặc định và còn địa chỉ khác, hệ thống tự chọn địa chỉ mặc định mới.

---

# 14. Business Rules

PROFILE-BR-001

Mỗi User chỉ có một Profile.

PROFILE-BR-002

Avatar phải là ảnh hợp lệ.

PROFILE-BR-003

Một User có nhiều Address.

PROFILE-BR-004

Chỉ có một Default Address.

PROFILE-BR-005

Ngày sinh không được lớn hơn ngày hiện tại.

PROFILE-BR-006

Không lưu ảnh trực tiếp trong Database.

---

# 15. Validation Rules

Full Name

```
2 - 100 ký tự
```

Avatar

```
HTTPS URL
```

Date of Birth

```
<= Today
```

Latitude

```
-90 → 90
```

Longitude

```
-180 → 180
```

---

# 16. Error Codes

| Code | Description |
|------|-------------|
| PROFILE_001 | Profile Not Found |
| PROFILE_002 | Invalid Avatar |
| PROFILE_003 | Invalid Address |
| PROFILE_004 | Default Address Required |
| PROFILE_005 | Invalid Date Of Birth |

---

# 17. Security

JWT Required

File Validation

Virus Scan

Signed URL

Audit Log

---

# 18. Performance

Load Profile

```
<20ms
```

Upload Avatar

```
<2s
```

Address Lookup

```
<20ms
```

---

# 19. Test Cases

✓ Get Profile.

✓ Update Profile.

✓ Upload Avatar.

✓ Invalid Image.

✓ Delete Avatar.

✓ Add Address.

✓ Update Address.

✓ Delete Address.

✓ Default Address.

---

# 20. Acceptance Criteria

✓ JWT Required.

✓ Upload thành công.

✓ Avatar lưu trong Storage.

✓ Chỉ có một Default Address.

✓ Prisma Generate thành công.

✓ Swagger hoàn chỉnh.

---

# 21. Related Documents

API-004 User API

API-010 Notification API

DB-005 Users

DB-012 Stations

---

# 22. Summary

Profile API quản lý toàn bộ hồ sơ cá nhân của người dùng trong BusZ, bao gồm thông tin cá nhân, ảnh đại diện, địa chỉ và cài đặt cá nhân. API được bảo vệ bằng JWT, lưu trữ ảnh trên Supabase Storage và hỗ trợ quản lý nhiều địa chỉ với cơ chế địa chỉ mặc định.