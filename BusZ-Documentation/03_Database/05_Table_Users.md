# Users Table

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Database

Document ID: DB-005

Table Name

users

Priority

Critical

Version

1.0

---

# 1. Purpose

Lưu toàn bộ thông tin xác thực (Authentication) của người dùng.

Bảng này KHÔNG chứa thông tin hồ sơ cá nhân.

Thông tin Profile sẽ nằm trong bảng:

profiles

Quan hệ:

users (1)

↓

profiles (1)

---

# 2. Responsibilities

Quản lý:

- Đăng nhập
- Email
- Mật khẩu
- Vai trò
- Trạng thái
- Xác minh Email
- Xác minh Phone

---

# 3. Relationships

users

1 ---- 1 profiles

users

1 ---- N sessions

users

1 ---- N refresh_tokens

users

1 ---- N bookings

users

1 ---- N notifications

users

N ---- N roles

---

# 4. Columns

| Column | Type | Nullable | Description |
|---------|------|----------|-------------|
| id | UUID | No | Primary Key |
| email | VARCHAR(255) | No | User Email |
| phone | VARCHAR(20) | Yes | Phone Number |
| password_hash | VARCHAR(255) | Yes | BCrypt Password |
| login_provider | ENUM | No | EMAIL / GOOGLE / APPLE |
| status | ENUM | No | ACTIVE / BLOCKED / PENDING |
| email_verified | BOOLEAN | No | Email Verified |
| phone_verified | BOOLEAN | No | Phone Verified |
| last_login_at | TIMESTAMP | Yes | Last Login |
| created_at | TIMESTAMP | No | Created Time |
| updated_at | TIMESTAMP | No | Updated Time |
| deleted_at | TIMESTAMP | Yes | Soft Delete |

---

# 5. Enum

## LoginProvider

EMAIL

GOOGLE

APPLE

FACEBOOK

MICROSOFT

---

## UserStatus

ACTIVE

PENDING

BLOCKED

SUSPENDED

DELETED

---

# 6. Constraints

PRIMARY KEY(id)

UNIQUE(email)

UNIQUE(phone)

CHECK(email <> '')

CHECK(length(password_hash) >= 60)

---

# 7. Indexes

PRIMARY KEY(id)

UNIQUE(email)

UNIQUE(phone)

INDEX(status)

INDEX(last_login_at)

INDEX(created_at)

---

# 8. Foreign Keys

Không có Foreign Key.

Đây là bảng Root.

---

# 9. SQL DDL

```sql
CREATE TABLE users (

id UUID PRIMARY KEY,

email VARCHAR(255) UNIQUE NOT NULL,

phone VARCHAR(20),

password_hash VARCHAR(255),

login_provider VARCHAR(30) NOT NULL,

status VARCHAR(30) NOT NULL,

email_verified BOOLEAN DEFAULT FALSE,

phone_verified BOOLEAN DEFAULT FALSE,

last_login_at TIMESTAMPTZ,

created_at TIMESTAMPTZ DEFAULT NOW(),

updated_at TIMESTAMPTZ DEFAULT NOW(),

deleted_at TIMESTAMPTZ

);
```

---

# 10. Prisma Model

```prisma
model User {

id String @id @default(uuid())

email String @unique

phone String? @unique

passwordHash String? @map("password_hash")

loginProvider LoginProvider

status UserStatus

emailVerified Boolean @default(false)

phoneVerified Boolean @default(false)

lastLoginAt DateTime?

createdAt DateTime @default(now())

updatedAt DateTime @updatedAt

deletedAt DateTime?

profile Profile?

bookings Booking[]

notifications Notification[]

sessions Session[]

refreshTokens RefreshToken[]

@@map("users")

}
```

---

# 11. Validation Rules

Email

RFC5322

Phone

E.164

Password

BCrypt

Không lưu Plain Text

---

# 12. Business Rules

Email duy nhất.

Phone duy nhất.

Không được xóa cứng.

Email phải xác minh trước khi Booking.

Tài khoản BLOCKED không được Login.

---

# 13. Sample Data

| Email | Provider | Status |
|---------|----------|---------|
| tri@gmail.com | EMAIL | ACTIVE |
| user@gmail.com | GOOGLE | ACTIVE |
| admin@busz.vn | EMAIL | ACTIVE |

---

# 14. Security

Password

BCrypt

Refresh Token

SHA256

Không trả passwordHash qua API.

Không trả deletedAt cho Client.

---

# 15. Audit

Ghi nhận:

Create

Login

Logout

Password Change

Email Verify

Phone Verify

Status Change

---

# 16. Performance

Expected Records

100,000+

Lookup

<5ms

Login

<20ms

---

# 17. API Mapping

POST /auth/register

POST /auth/login

POST /auth/logout

POST /auth/forgot-password

GET /users/me

PATCH /users/me

---

# 18. Test Cases

✓ Email Unique

✓ Phone Unique

✓ BCrypt

✓ Login

✓ Verify Email

✓ Block User

✓ Soft Delete

---

# 19. Acceptance Criteria

✓ Email duy nhất

✓ Không lưu Password

✓ Soft Delete

✓ FK đúng

✓ Index đúng

✓ Prisma Generate thành công

✓ Migration thành công

---

# 20. Related Tables

profiles

sessions

refresh_tokens

bookings

notifications

roles

---

# 21. Summary

users là bảng gốc của toàn bộ hệ thống BusZ, quản lý danh tính và xác thực người dùng. Đây là bảng quan trọng nhất trong domain Authentication và là điểm khởi đầu cho tất cả các quan hệ nghiệp vụ khác.