# Database Index Strategy

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Database

Document ID: DB-017

Priority

Critical

Version

1.0

---

# 1. Purpose

Tài liệu này định nghĩa chiến lược xây dựng Index cho toàn bộ cơ sở dữ liệu BusZ nhằm đảm bảo:

- Hiệu năng truy vấn
- Khả năng mở rộng
- Giảm thời gian phản hồi
- Tối ưu ghi và đọc dữ liệu

---

# 2. Objectives

Mục tiêu:

✓ Lookup theo ID < 5ms

✓ Search Trip < 50ms

✓ Search Booking < 20ms

✓ Search Notification < 30ms

✓ Search Audit < 50ms

✓ Dashboard < 100ms

---

# 3. Index Types

## Primary Index

```sql
PRIMARY KEY(id)
```

Áp dụng cho tất cả bảng.

---

## Unique Index

```sql
CREATE UNIQUE INDEX
```

Ví dụ

email

phone

booking_code

ticket_code

payment_code

promotion_code

route_code

station_code

bus_code

---

## Foreign Key Index

Tất cả Foreign Key phải có Index.

Ví dụ

```text
user_id

trip_id

booking_id

ticket_id

payment_id

station_id
```

---

## Composite Index

Ví dụ

```sql
(user_id, status)
```

```sql
(route_id, departure_time)
```

```sql
(status, created_at)
```

---

## Partial Index

Ví dụ

```sql
WHERE status='ACTIVE'
```

```sql
WHERE deleted_at IS NULL
```

---

## Full Text Index

GIN

```sql
title

description

station_name

route_name
```

---

## JSONB Index

GIN

```sql
old_data

new_data

metadata
```

---

# 4. Index Strategy Per Table

Users

```text
PK(id)

UNIQUE(email)

UNIQUE(phone)

INDEX(status)

INDEX(created_at)
```

---

Bookings

```text
PK

booking_code

user_id

trip_id

status

created_at

paid_at

(user_id,status)
```

---

Trips

```text
PK

route_id

departure_time

status

(route_id,departure_time)

(status,departure_time)
```

---

Payments

```text
booking_id

status

provider

paid_at
```

---

Tickets

```text
ticket_code

qr_code

status

booking_id
```

---

Stations

```text
city

province

(latitude,longitude)
```

---

Notifications

```text
user_id

status

created_at

(user_id,status)
```

---

Audit Logs

```text
user_id

action

entity_type

entity_id

created_at

request_id
```

---

# 5. PostgreSQL Index Types

BTree

Default

Equality

Sorting

---

Hash

Equality Only

Ít sử dụng.

---

GIN

JSONB

Array

Full Text Search

---

GiST

Geospatial

Range

---

BRIN

Very Large Table

Time-series

Audit Logs

Notifications

---

# 6. Query Optimization

Ví dụ

```sql
SELECT *

FROM bookings

WHERE

user_id=?

AND status='PAID'

ORDER BY created_at DESC

LIMIT 20;
```

Composite Index

```text
(user_id,status,created_at)
```

---

# 7. Covering Index

Ví dụ

```sql
booking_code

status

paid_at
```

Include

```text
total_amount

trip_id
```

---

# 8. Partial Index Example

```sql
CREATE INDEX idx_trip_active

ON trips(status)

WHERE status='SCHEDULED';
```

---

# 9. GIN Example

```sql
CREATE INDEX idx_audit_json

ON audit_logs

USING GIN(new_data);
```

---

# 10. BRIN Example

```sql
CREATE INDEX idx_audit_time

ON audit_logs

USING BRIN(created_at);
```

---

# 11. Index Naming Convention

Primary

```text
pk_users
```

Unique

```text
uk_users_email
```

Foreign

```text
idx_bookings_user
```

Composite

```text
idx_trip_route_departure
```

GIN

```text
gin_audit_json
```

BRIN

```text
brin_audit_created
```

---

# 12. Monitoring

Kiểm tra:

```sql
EXPLAIN ANALYZE
```

```sql
pg_stat_statements
```

```sql
pg_indexes
```

```sql
VACUUM ANALYZE
```

---

# 13. Reindex Strategy

```text
Monthly

↓

Check Bloat

↓

REINDEX CONCURRENTLY
```

---

# 14. Partition Strategy

Audit Logs

```text
Monthly Partition
```

Notifications

```text
Quarterly Partition
```

Payments

```text
Yearly Partition
```

---

# 15. Performance Goals

Booking Search

<20ms

Trip Search

<50ms

Seat Lookup

<5ms

QR Scan

<5ms

Notification

<30ms

Audit

<50ms

---

# 16. Best Practices

✓ Không tạo Index dư thừa.

✓ Index cho mọi Foreign Key.

✓ Dùng Composite Index cho truy vấn phổ biến.

✓ Dùng GIN cho JSONB.

✓ Dùng BRIN cho bảng rất lớn.

✓ Theo dõi Index Bloat định kỳ.

---

# 17. Acceptance Criteria

✓ EXPLAIN ANALYZE không Full Table Scan với các truy vấn chính.

✓ Composite Index được sử dụng đúng.

✓ Không có Index trùng lặp.

✓ Hiệu năng đạt mục tiêu.

---

# 18. Related Documents

DB-005 Users

DB-006 Bookings

DB-009 Trips

DB-016 Audit Logs

---

# 19. Summary

Chiến lược Index của BusZ được thiết kế để hỗ trợ khối lượng dữ liệu lớn và truy vấn hiệu năng cao. Việc kết hợp B-Tree, GIN, BRIN, Composite và Partial Index giúp hệ thống duy trì tốc độ ổn định ngay cả khi cơ sở dữ liệu đạt hàng trăm triệu bản ghi.