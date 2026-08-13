# Prisma Schema

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Database

Document ID: DB-004

Priority: Critical

Status: Draft

Version: 1.0

---

# 1. Purpose

Prisma Schema định nghĩa toàn bộ mô hình dữ liệu của hệ thống BusZ.

Đây là nguồn dữ liệu chính cho:

- PostgreSQL
- Prisma ORM
- Migration
- Type-safe Query
- Backend API

Schema này phải có khả năng chạy trực tiếp bằng Prisma CLI.

---

# 2. Technology

ORM

Prisma ORM 6+

Database

PostgreSQL 17+

Storage

Supabase

Migration

Prisma Migrate

Generator

Prisma Client

---

# 3. Datasource

provider

postgresql

---

connection

DATABASE_URL

---

shadowDatabaseUrl

SHADOW_DATABASE_URL

---

# 4. Generator

generator client

provider

prisma-client-js

---

previewFeatures

driverAdapters

fullTextSearch

postgresqlExtensions

(Configurable)

---

# 5. Schema Structure

Enums

↓

Authentication Models

↓

Profile Models

↓

Transportation Models

↓

Booking Models

↓

Payment Models

↓

Ticket Models

↓

Promotion Models

↓

Notification Models

↓

Review Models

↓

Audit Models

↓

System Models

---

# 6. Folder Structure

database

├── schema.prisma

├── enums.prisma

├── auth.prisma

├── profile.prisma

├── transportation.prisma

├── booking.prisma

├── payment.prisma

├── ticket.prisma

├── promotion.prisma

├── notification.prisma

├── review.prisma

├── audit.prisma

└── system.prisma

(Merge khi Generate)

---

# 7. Global Fields

Mọi model chính phải có

id

createdAt

updatedAt

deletedAt

createdBy

updatedBy

---

# 8. UUID Strategy

id

String

@id

@default(uuid())

(Future: UUIDv7)

---

# 9. Naming Convention

Model

PascalCase

User

Booking

Trip

Ticket

---

Field

camelCase

bookingCode

seatNumber

tripId

---

Table

@@map()

snake_case

---

# 10. Common Attributes

@id

@default

@updatedAt

@unique

@index

@@index

@@unique

@@map

@relation

---

# 11. Relation Strategy

One To One

User

↔

Profile

---

One To Many

Trip

↓

Bookings

---

Many To Many

Users

↓

Roles

↓

user_roles

---

# 12. Enum Strategy

BookingStatus

PaymentStatus

TripStatus

TicketStatus

NotificationStatus

RefundStatus

UserRole

UserGender

PaymentMethod

BusType

TripDirection

---

# 13. Decimal Strategy

Decimal

@db.Decimal(18,2)

---

Money

Không dùng Float.

---

# 14. Date Strategy

DateTime

@db.Timestamptz()

UTC

---

# 15. Soft Delete

deletedAt

DateTime?

Không dùng Boolean deleted.

---

# 16. Index Strategy

Email

@unique

---

Phone

@unique

---

Booking Code

@@unique

---

QR Code

@@unique

---

Foreign Keys

@@index

---

# 17. Security

Password Hash

String

---

Refresh Token

Hash

---

Payment Token

Encrypted

---

Sensitive Fields

Không serialize ra API.

---

# 18. Migration

prisma migrate dev

↓

Generate SQL

↓

Review

↓

Deploy

↓

Seed

---

# 19. Seed Data

Roles

Permissions

Bus Companies

Stations

Routes

Admin User

System Settings

---

# 20. Expected Models

Authentication

5

Profile

6

Transportation

9

Booking

5

Payment

4

Ticket

3

Promotion

3

Notification

3

Review

2

Audit

2

System

2

----------------------

≈44 Models

---

# 21. Expected Enums

BookingStatus

PaymentStatus

TripStatus

TicketStatus

NotificationStatus

RefundStatus

Gender

Role

BusType

PaymentMethod

SeatType

SeatStatus

PromotionType

PromotionStatus

ReviewStatus

---

# 22. Expected Relationships

1-1

≈6

1-N

≈35

N-N

≈5

---

# 23. Related Documents

DB-002 ERD

DB-003 Data Dictionary

DB-005 Users

---

# 24. Future Expansion

Prisma Accelerate

Read Replica

Soft Partition

JSON Search

Multi-Tenant

---

# 25. Summary

Prisma Schema là tài liệu thiết kế và triển khai mô hình dữ liệu BusZ bằng Prisma ORM. Schema được tổ chức theo domain nghiệp vụ, hỗ trợ PostgreSQL, Migration, Type-safe Query và có thể mở rộng trong tương lai.