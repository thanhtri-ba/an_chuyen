# Tickets Table

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Database

Document ID: DB-008

Table Name

tickets

Priority

Critical

Version

1.0

---

# 1. Purpose

Bảng `tickets` lưu trữ thông tin vé điện tử (E-Ticket) được phát hành sau khi thanh toán thành công.

Mỗi hành khách trong một booking sẽ có một vé riêng, phục vụ cho việc kiểm tra lên xe (Check-in), xác thực QR Code và theo dõi trạng thái sử dụng.

---

# 2. Responsibilities

Quản lý:

- Vé điện tử
- QR Code
- Mã vé
- Hành khách
- Ghế ngồi
- Trạng thái vé
- Check-in
- Hủy vé
- Hoàn vé

---

# 3. Relationships

```text
bookings
1 ---- N tickets

booking_passengers
1 ---- 1 ticket

trip_seats
1 ---- 1 ticket

tickets
1 ---- 1 ticket_qr_codes

tickets
1 ---- N ticket_checkins
```

---

# 4. Columns

| Column | Type | Nullable | Description |
|---|---|---|---|
| id | UUID | No | Primary Key |
| ticket_code | VARCHAR(30) | No | Unique Ticket Code |
| booking_id | UUID | No | Booking |
| passenger_id | UUID | No | Passenger |
| trip_seat_id | UUID | No | Reserved Seat |
| qr_code | TEXT | No | QR Payload |
| status | ENUM | No | Ticket Status |
| issued_at | TIMESTAMPTZ | No | Issue Time |
| checked_in_at | TIMESTAMPTZ | Yes | Check-in Time |
| cancelled_at | TIMESTAMPTZ | Yes | Cancel Time |
| expired_at | TIMESTAMPTZ | Yes | Expiration |
| created_at | TIMESTAMPTZ | No | Created |
| updated_at | TIMESTAMPTZ | No | Updated |
| deleted_at | TIMESTAMPTZ | Yes | Soft Delete |

---

# 5. Enum

## TicketStatus

```text
GENERATED

ACTIVE

CHECKED_IN

USED

CANCELLED

REFUND_PENDING

REFUNDED

EXPIRED

INVALID
```

---

# 6. Constraints

```text
PRIMARY KEY(id)

UNIQUE(ticket_code)

UNIQUE(qr_code)

FOREIGN KEY(booking_id)

FOREIGN KEY(passenger_id)

FOREIGN KEY(trip_seat_id)

CHECK(ticket_code <> '')
```

---

# 7. Indexes

```text
PRIMARY KEY(id)

UNIQUE(ticket_code)

UNIQUE(qr_code)

INDEX(status)

INDEX(booking_id)

INDEX(passenger_id)

INDEX(trip_seat_id)

INDEX(issued_at)

INDEX(checked_in_at)
```

---

# 8. SQL DDL

```sql
CREATE TABLE tickets (

id UUID PRIMARY KEY,

ticket_code VARCHAR(30) UNIQUE NOT NULL,

booking_id UUID NOT NULL REFERENCES bookings(id),

passenger_id UUID NOT NULL REFERENCES booking_passengers(id),

trip_seat_id UUID NOT NULL REFERENCES trip_seats(id),

qr_code TEXT UNIQUE NOT NULL,

status VARCHAR(30) NOT NULL,

issued_at TIMESTAMPTZ NOT NULL,

checked_in_at TIMESTAMPTZ,

cancelled_at TIMESTAMPTZ,

expired_at TIMESTAMPTZ,

created_at TIMESTAMPTZ DEFAULT NOW(),

updated_at TIMESTAMPTZ DEFAULT NOW(),

deleted_at TIMESTAMPTZ

);
```

---

# 9. Prisma Model

```prisma
model Ticket {

  id            String        @id @default(uuid())

  ticketCode    String        @unique @map("ticket_code")

  bookingId     String        @map("booking_id")

  passengerId   String        @unique @map("passenger_id")

  tripSeatId    String        @unique @map("trip_seat_id")

  qrCode        String        @unique @map("qr_code")

  status        TicketStatus

  issuedAt      DateTime      @map("issued_at")

  checkedInAt   DateTime?     @map("checked_in_at")

  cancelledAt   DateTime?     @map("cancelled_at")

  expiredAt     DateTime?     @map("expired_at")

  createdAt     DateTime      @default(now())

  updatedAt     DateTime      @updatedAt

  deletedAt     DateTime?

  booking        Booking

  passenger      BookingPassenger

  tripSeat       TripSeat

  qr             TicketQrCode?

  checkins       TicketCheckin[]

  @@index([bookingId])

  @@index([status])

  @@index([issuedAt])

  @@index([checkedInAt])

  @@map("tickets")
}
```

---

# 10. Business Rules

TICKET-BR-001

Chỉ phát hành Ticket khi Payment SUCCESS.

TICKET-BR-002

Mỗi Passenger chỉ có một Ticket cho mỗi Booking.

TICKET-BR-003

QR Code phải duy nhất.

TICKET-BR-004

Ticket CHECKED_IN không được sử dụng lại.

TICKET-BR-005

Ticket CANCELLED không được Check-in.

TICKET-BR-006

Ticket EXPIRED không hợp lệ.

---

# 11. Ticket Lifecycle

```text
GENERATED
    ↓
ACTIVE
    ↓
CHECKED_IN
    ↓
USED
```

Cancellation:

```text
ACTIVE
    ↓
CANCELLED
```

Refund:

```text
ACTIVE
    ↓
REFUND_PENDING
    ↓
REFUNDED
```

Expiration:

```text
ACTIVE
    ↓
EXPIRED
```

---

# 12. QR Code Validation

```text
Scan QR

↓

Decode Payload

↓

Find Ticket

↓

Check Status

↓

Check Trip

↓

Check Time

↓

Allow Boarding
```

---

# 13. Sample Data

| ticket_code | status | seat |
|---|---|---|
| BUSZ-TK-000001 | ACTIVE | A01 |
| BUSZ-TK-000002 | CHECKED_IN | B15 |
| BUSZ-TK-000003 | CANCELLED | C08 |

---

# 14. API Mapping

```text
GET /tickets

GET /tickets/{id}

GET /tickets/{code}

GET /tickets/{id}/qr

POST /tickets/check-in

POST /tickets/cancel

POST /tickets/reissue
```

---

# 15. Security

QR Code phải được ký hoặc mã hóa để chống giả mạo.

Không chứa dữ liệu nhạy cảm (email, số điện thoại, thông tin thanh toán).

Chỉ nhân viên được phân quyền mới được thực hiện Check-in.

---

# 16. Audit

Ghi log:

- Ticket Issued
- QR Generated
- QR Scanned
- Check-in
- Ticket Cancelled
- Ticket Refunded
- Ticket Reissued

---

# 17. Performance

Expected Records

6,000,000+

Lookup by QR

<5ms

Lookup by Ticket Code

<5ms

---

# 18. Test Cases

✓ Generate Ticket.

✓ Duplicate Ticket Code.

✓ Duplicate QR.

✓ Check-in Success.

✓ Double Check-in.

✓ Expired Ticket.

✓ Cancelled Ticket.

✓ Refund Ticket.

---

# 19. Acceptance Criteria

✓ Ticket Code duy nhất.

✓ QR Code duy nhất.

✓ Passenger chỉ có một Ticket.

✓ Check-in đúng trạng thái.

✓ Prisma Generate thành công.

✓ Migration thành công.

---

# 20. Related Tables

bookings

booking_passengers

trip_seats

ticket_qr_codes

ticket_checkins

payments

audit_logs

---

# 21. Summary

`tickets` là bảng quản lý vé điện tử của BusZ. Bảng này đóng vai trò trung tâm trong quy trình lên xe, xác thực QR Code, kiểm tra vé và theo dõi vòng đời của từng vé từ khi phát hành đến khi hoàn thành hoặc hủy bỏ.