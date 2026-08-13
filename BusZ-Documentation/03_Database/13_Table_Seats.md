# Seats Management

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Database

Document ID: DB-013

Priority

Critical

Version

1.0

---

# 1. Purpose

Hệ thống quản lý ghế của BusZ gồm hai bảng chính:

- bus_seat_templates
- trip_seats

Mục tiêu:

- Định nghĩa sơ đồ ghế của từng loại xe.
- Theo dõi trạng thái ghế theo từng chuyến.
- Hỗ trợ Seat Lock.
- Ngăn overbooking.

---

# 2. Architecture

```text
Bus

↓

Bus Seat Template

↓

Trip

↓

Trip Seat

↓

Booking

↓

Ticket
```

---

# 3. Tables

## 3.1 bus_seat_templates

Định nghĩa sơ đồ ghế cố định của xe.

Ví dụ:

```text
Bus

51H-12345

↓

A01

A02

A03

...

B17
```

---

## 3.2 trip_seats

Lưu trạng thái ghế theo từng chuyến.

Ví dụ:

```text
Trip 001

↓

A01 AVAILABLE

A02 RESERVED

A03 BOOKED

A04 CHECKED_IN
```

---

# 4. bus_seat_templates

## Purpose

Lưu cấu trúc ghế của xe.

---

### Columns

| Column | Type | Description |
|---------|------|-------------|
| id | UUID | PK |
| bus_id | UUID | Xe |
| seat_number | VARCHAR(10) | Ghế |
| seat_label | VARCHAR(20) | Hiển thị |
| deck | SMALLINT | Tầng |
| row_number | SMALLINT | Hàng |
| column_number | SMALLINT | Cột |
| seat_type | ENUM | Loại ghế |
| is_window | BOOLEAN | Ghế cửa sổ |
| is_aisle | BOOLEAN | Ghế lối đi |
| is_active | BOOLEAN | Hoạt động |

---

# 5. trip_seats

## Purpose

Lưu trạng thái ghế của từng Trip.

---

### Columns

| Column | Type | Description |
|---------|------|-------------|
| id | UUID | PK |
| trip_id | UUID | Chuyến |
| seat_template_id | UUID | Seat Template |
| booking_id | UUID | Nullable |
| passenger_id | UUID | Nullable |
| ticket_id | UUID | Nullable |
| status | ENUM | Trạng thái |
| lock_until | TIMESTAMPTZ | Seat Hold |
| price | NUMERIC(18,2) | Giá |
| created_at | TIMESTAMPTZ | Created |
| updated_at | TIMESTAMPTZ | Updated |

---

# 6. Seat Types

```text
STANDARD

VIP

LIMOUSINE

SLEEPER

DOUBLE_SLEEPER

WHEELCHAIR

PRIORITY
```

---

# 7. Seat Status

```text
AVAILABLE

LOCKED

RESERVED

BOOKED

CHECKED_IN

USED

BLOCKED

OUT_OF_SERVICE
```

---

# 8. Business Rules

SEAT-BR-001

Một ghế chỉ thuộc một Bus.

---

SEAT-BR-002

Một Trip sinh toàn bộ Trip Seats từ Template.

---

SEAT-BR-003

Ghế LOCKED không cho người khác đặt.

---

SEAT-BR-004

Seat Lock mặc định

15 phút.

---

SEAT-BR-005

Hết thời gian Lock

↓

AVAILABLE

---

SEAT-BR-006

BOOKED

↓

Không được Lock.

---

SEAT-BR-007

CHECKED_IN

↓

Không được Cancel.

---

SEAT-BR-008

OUT_OF_SERVICE

↓

Không hiển thị.

---

# 9. Seat Lifecycle

```text
AVAILABLE

↓

LOCKED

↓

BOOKED

↓

CHECKED_IN

↓

USED
```

Timeout

```text
LOCKED

↓

AVAILABLE
```

Maintenance

```text
AVAILABLE

↓

BLOCKED

↓

AVAILABLE
```

---

# 10. Seat Lock Flow

```text
Select Seat

↓

Create Lock

↓

15 Minutes

↓

Payment Success

↓

BOOKED
```

Timeout

```text
Lock Expired

↓

Release Seat

↓

AVAILABLE
```

---

# 11. Constraints

bus_seat_templates

```text
UNIQUE(bus_id, seat_number)
```

trip_seats

```text
UNIQUE(trip_id, seat_template_id)
```

---

# 12. Indexes

bus_seat_templates

```text
INDEX(bus_id)

INDEX(seat_type)
```

trip_seats

```text
INDEX(trip_id)

INDEX(status)

INDEX(lock_until)

INDEX(booking_id)

INDEX(ticket_id)
```

---

# 13. Prisma Models

```prisma
model BusSeatTemplate {

id String @id @default(uuid())

busId String

seatNumber String

seatLabel String

deck Int

rowNumber Int

columnNumber Int

seatType SeatType

isWindow Boolean

isAisle Boolean

isActive Boolean

tripSeats TripSeat[]

}
```

---

```prisma
model TripSeat {

id String @id @default(uuid())

tripId String

seatTemplateId String

bookingId String?

ticketId String?

status SeatStatus

lockUntil DateTime?

price Decimal @db.Decimal(18,2)

}
```

---

# 14. SQL DDL

```sql
CREATE TABLE bus_seat_templates (

id UUID PRIMARY KEY,

bus_id UUID,

seat_number VARCHAR(10),

seat_label VARCHAR(20),

deck SMALLINT,

row_number SMALLINT,

column_number SMALLINT,

seat_type VARCHAR(30),

is_window BOOLEAN,

is_aisle BOOLEAN,

is_active BOOLEAN

);
```

---

```sql
CREATE TABLE trip_seats (

id UUID PRIMARY KEY,

trip_id UUID,

seat_template_id UUID,

booking_id UUID,

ticket_id UUID,

status VARCHAR(30),

lock_until TIMESTAMPTZ,

price NUMERIC(18,2)

);
```

---

# 15. Seat Map Example

```text
Driver

A01 A02

A03 A04

A05 A06

------

B01 B02

B03 B04

B05 B06
```

Limousine

```text
Driver

A01

A02

------

B01 B02

------

C01

C02
```

---

# 16. API Mapping

```text
GET /trips/{id}/seats

POST /trips/{id}/lock-seat

POST /trips/{id}/unlock-seat

POST /trips/{id}/book-seat

POST /tickets/check-in
```

---

# 17. Security

Seat Lock

JWT Required

Operator

Có quyền Block Seat

Customer

Không sửa trạng thái trực tiếp.

---

# 18. Audit

Seat Locked

Seat Released

Seat Booked

Seat Checked-in

Seat Blocked

Seat Maintenance

---

# 19. Performance

Expected Records

200,000,000+

Seat Lookup

<5ms

Seat Lock

<10ms

Seat Map

<50ms

---

# 20. Test Cases

✓ Lock Seat.

✓ Lock Timeout.

✓ Double Booking.

✓ Check-in.

✓ Block Seat.

✓ Maintenance.

✓ Concurrent Booking.

---

# 21. Acceptance Criteria

✓ Không Overbooking.

✓ Lock đúng 15 phút.

✓ Seat Map chính xác.

✓ Concurrent Transaction thành công.

✓ Migration thành công.

---

# 22. Related Tables

buses

trips

bookings

tickets

booking_passengers

audit_logs

---

# 23. Summary

Hệ thống Seats là trái tim của nghiệp vụ đặt vé BusZ. Hai bảng `bus_seat_templates` và `trip_seats` phối hợp để quản lý sơ đồ ghế, trạng thái ghế theo từng chuyến, cơ chế giữ ghế (Seat Lock) và chống overbooking trong môi trường có nhiều người dùng đặt vé đồng thời.