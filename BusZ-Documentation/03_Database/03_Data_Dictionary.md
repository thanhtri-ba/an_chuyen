# Data Dictionary

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Database

Document ID: DB-003

Priority: Critical

Status: Draft

Version: 1.0

---

# 1. Purpose

Data Dictionary định nghĩa toàn bộ dữ liệu của hệ thống BusZ.

Bao gồm:

- Table
- Column
- Data Type
- Nullable
- Default Value
- Primary Key
- Foreign Key
- Business Meaning
- Validation Rules

Đây là tài liệu chuẩn cho:

- Backend
- Frontend
- DBA
- QA
- Business Analyst

---

# 2. Naming Convention

Table

snake_case

Plural

Ví dụ

users

bookings

payments

---

Column

snake_case

Ví dụ

created_at

booking_status

trip_id

---

Enum

UPPER_SNAKE_CASE

Ví dụ

BOOKING_PENDING

PAYMENT_SUCCESS

---

# 3. Common Columns

Hầu hết các bảng sẽ có:

id

UUID

PRIMARY KEY

---

created_at

TIMESTAMP WITH TIME ZONE

NOT NULL

DEFAULT now()

---

updated_at

TIMESTAMP WITH TIME ZONE

NOT NULL

DEFAULT now()

---

deleted_at

TIMESTAMP WITH TIME ZONE

NULL

Soft Delete

---

created_by

UUID

FK users.id

Nullable

---

updated_by

UUID

FK users.id

Nullable

---

# 4. UUID Strategy

Primary Key

UUID v7 (Khuyến nghị)

Fallback

UUID v4

Không dùng BIGINT AUTO INCREMENT cho các bảng nghiệp vụ.

---

# 5. Data Types

UUID

TEXT

VARCHAR

BOOLEAN

INTEGER

BIGINT

NUMERIC

DATE

TIME

TIMESTAMP

JSONB

BYTEA

---

# 6. Standard Length

Email

VARCHAR(255)

Phone

VARCHAR(20)

Full Name

VARCHAR(150)

Password Hash

VARCHAR(255)

Address

VARCHAR(500)

License Plate

VARCHAR(20)

Bus Code

VARCHAR(30)

Booking Code

VARCHAR(30)

Promotion Code

VARCHAR(30)

QR Code

TEXT

---

# 7. Boolean Convention

TRUE

Enabled

Verified

Success

Deleted

Trusted

FALSE

Disabled

Pending

Inactive

---

# 8. Money Convention

NUMERIC(18,2)

Không dùng FLOAT.

Không dùng DOUBLE.

Ví dụ

150000.00

---

# 9. Time Convention

UTC

TIMESTAMP WITH TIME ZONE

Hiển thị theo Time Zone người dùng.

---

# 10. Status Convention

Status sử dụng ENUM.

Ví dụ

BookingStatus

PaymentStatus

TripStatus

TicketStatus

NotificationStatus

---

# 11. Audit Columns

created_at

updated_at

deleted_at

created_by

updated_by

reason

ip_address

device_id

---

# 12. Foreign Key Convention

Tên FK

<referenced_table>_id

Ví dụ

user_id

booking_id

trip_id

ticket_id

payment_id

---

# 13. Index Convention

PK

PRIMARY KEY

---

FK

INDEX

---

Email

UNIQUE INDEX

---

Phone

UNIQUE INDEX

---

Booking Code

UNIQUE INDEX

---

QR Code

UNIQUE INDEX

---

# 14. Constraints

PRIMARY KEY

FOREIGN KEY

UNIQUE

CHECK

NOT NULL

DEFAULT

---

# 15. Validation Rules

Email

RFC 5322

---

Phone

E.164

---

Password

BCrypt Hash

---

Money

>=0

---

Seat Number

Regex

---

License Plate

Regex

---

# 16. Data Retention

Audit Log

10 Years

(Configurable)

---

Booking

Không xóa

Soft Delete

---

Payment

Không xóa

---

Notification

180 Days

(Configurable)

---

Session

30 Days

---

OTP

5 Minutes

---

# 17. Encryption

Password

BCrypt

---

Refresh Token

SHA256

---

Payment Token

AES256

---

Device Token

AES256

---

Sensitive Data

Encrypted

---

# 18. Localization

UTF-8

Unicode

Vietnamese Supported

English Supported

Future Multi-language

---

# 19. Database Standards

3NF

ACID

Referential Integrity

Soft Delete

Audit Log

Least Privilege

---

# 20. Document Structure

Mỗi bảng sẽ có:

Purpose

Columns

Data Types

Relationships

Indexes

Constraints

Business Rules

Sample Data

Prisma Model

SQL DDL

---

# 21. Related Documents

DB-002 ERD

DB-004 Prisma Schema

DB-005 Users Table

---

# 22. Future Expansion

Partition Tables

Sharding

Read Replica

Data Warehouse

Lakehouse

---

# 23. Summary

Data Dictionary là tài liệu chuẩn định nghĩa toàn bộ dữ liệu của hệ thống BusZ, đảm bảo mọi thành viên trong dự án sử dụng thống nhất về tên bảng, cột, kiểu dữ liệu, ràng buộc và quy tắc lưu trữ.