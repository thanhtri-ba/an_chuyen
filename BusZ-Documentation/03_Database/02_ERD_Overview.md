# ERD Overview

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Database

Document ID: DB-002

Priority: Critical

Status: Draft

Version: 1.0

---

# 1. Purpose

Tài liệu này mô tả Entity Relationship Diagram (ERD) của toàn bộ hệ thống BusZ.

ERD là nền tảng cho:

- Prisma Schema
- PostgreSQL
- REST API
- Business Logic
- Reporting

---

# 2. Database Domains

Authentication

↓

Profile

↓

Transportation

↓

Booking

↓

Payment

↓

Ticket

↓

Promotion

↓

Notification

↓

Administration

↓

Audit

---

# 3. Entity Overview

Authentication

users

roles

permissions

user_roles

refresh_tokens

sessions

--------------------------

Profile

profiles

passengers

addresses

travel_preferences

payment_methods

loyalty_accounts

--------------------------

Transportation

bus_companies

buses

drivers

stations

routes

route_stations

trip_templates

trips

trip_seats

--------------------------

Booking

bookings

booking_passengers

booking_pickups

booking_dropoffs

seat_reservations

--------------------------

Payment

payments

payment_transactions

refunds

payment_logs

--------------------------

Ticket

tickets

ticket_qr_codes

ticket_checkins

--------------------------

Promotion

promotions

promotion_rules

user_promotions

--------------------------

Notification

notifications

notification_templates

notification_logs

--------------------------

Review

reviews

ratings

--------------------------

Audit

audit_logs

activity_logs

--------------------------

System

settings

system_configs

```

---

# 4. High Level ERD

```text

USER
 │
 ├────────────── PROFILE
 │                   │
 │                   ├──────── ADDRESSES
 │                   │
 │                   ├──────── PASSENGERS
 │                   │
 │                   ├──────── LOYALTY
 │                   │
 │                   └──────── PAYMENT_METHODS
 │
 │
 ├────────────── BOOKINGS
 │                   │
 │                   ├──────── BOOKING_PASSENGERS
 │                   │
 │                   ├──────── PAYMENTS
 │                   │          │
 │                   │          └──────── REFUNDS
 │                   │
 │                   └──────── TICKETS
 │                               │
 │                               └──────── CHECKINS
 │
 │
 ├────────────── NOTIFICATIONS
 │
 └────────────── REVIEWS

```

---

# 5. Transportation ERD

```text

BUS_COMPANY
      │
      ├──────── BUS
      │
      ├──────── DRIVER
      │
      └──────── TRIP
                   │
                   ├──────── ROUTE
                   │              │
                   │              └────── ROUTE_STATIONS
                   │
                   ├──────── TRIP_SEATS
                   │
                   └──────── BOOKINGS

```

---

# 6. Booking Flow

```text

USER

↓

BOOKING

↓

BOOKING_PASSENGERS

↓

SEAT_RESERVATION

↓

PAYMENT

↓

TICKET

↓

CHECKIN

```

---

# 7. Main Relationships

## Authentication

```
users
1 ---- N sessions

users
1 ---- N refresh_tokens

users
N ---- N roles
```

---

## Profile

```
users
1 ---- 1 profiles

profiles
1 ---- N passengers

profiles
1 ---- N addresses

profiles
1 ---- 1 loyalty_account
```

---

## Transportation

```
bus_company

1 ---- N buses

bus_company

1 ---- N trips

route

1 ---- N trips

trip

1 ---- N trip_seats
```

---

## Booking

```
user

1 ---- N bookings

booking

1 ---- N booking_passengers

booking

1 ---- 1 payment

booking

1 ---- N tickets
```

---

## Ticket

```
ticket

1 ---- 1 qr_code

ticket

1 ---- N checkins
```

---

# 8. Total Tables

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

--------------------

Total

≈44 Tables

---

# 9. Database Size (Estimated)

User

100,000

Booking

5,000,000

Payment

5,000,000

Ticket

6,000,000

Notification

20,000,000

Audit

100,000,000+

---

# 10. Related Documents

DB-003 Data Dictionary

DB-004 Prisma Schema

DB-005 Table Users

DB-006 Table Bookings

---

# 11. Summary

ERD Overview mô tả toàn bộ kiến trúc dữ liệu của BusZ với khoảng 44 bảng được chia thành các domain nghiệp vụ rõ ràng, đảm bảo khả năng mở rộng, chuẩn hóa dữ liệu và hỗ trợ triển khai Backend bằng Prisma ORM trên PostgreSQL.