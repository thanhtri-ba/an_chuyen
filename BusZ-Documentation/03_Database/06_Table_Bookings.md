# Bookings Table

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Database

Document ID: DB-006

Table Name

bookings

Priority

Critical

Version

1.0

---

# 1. Purpose

Bảng `bookings` lưu thông tin đặt vé chính của người dùng.

Mỗi booking đại diện cho một giao dịch đặt chỗ trên một chuyến xe cụ thể.

Một booking có thể chứa nhiều hành khách, nhiều vé và một giao dịch thanh toán.

---

# 2. Responsibilities

Quản lý:

- Mã booking
- Người đặt vé
- Chuyến xe
- Trạng thái booking
- Tổng tiền
- Thời gian giữ chỗ
- Thời gian hết hạn
- Liên kết payment
- Liên kết ticket

---

# 3. Relationships

```text
users
1 ---- N bookings

trips
1 ---- N bookings

bookings
1 ---- N booking_passengers

bookings
1 ---- N tickets

bookings
1 ---- 1 payment

bookings
1 ---- N refunds
```

---

# 4. Columns

| Column | Type | Nullable | Description |
|---|---|---|---|
| id | UUID | No | Primary Key |
| booking_code | VARCHAR(30) | No | Unique Booking Code |
| user_id | UUID | No | Người đặt vé |
| trip_id | UUID | No | Chuyến xe được đặt |
| status | ENUM | No | Trạng thái booking |
| total_amount | NUMERIC(18,2) | No | Tổng tiền |
| discount_amount | NUMERIC(18,2) | No | Tổng giảm giá |
| final_amount | NUMERIC(18,2) | No | Số tiền cuối cùng |
| currency | VARCHAR(10) | No | Loại tiền tệ |
| seat_hold_expires_at | TIMESTAMPTZ | Yes | Thời gian hết hạn giữ ghế |
| confirmed_at | TIMESTAMPTZ | Yes | Thời gian xác nhận |
| paid_at | TIMESTAMPTZ | Yes | Thời gian thanh toán |
| cancelled_at | TIMESTAMPTZ | Yes | Thời gian hủy |
| completed_at | TIMESTAMPTZ | Yes | Thời gian hoàn thành |
| created_at | TIMESTAMPTZ | No | Thời gian tạo |
| updated_at | TIMESTAMPTZ | No | Thời gian cập nhật |
| deleted_at | TIMESTAMPTZ | Yes | Soft Delete |

---

# 5. Enum

## BookingStatus

```text
DRAFT
PENDING
SEAT_HOLD
CONFIRMED
PAYMENT_PENDING
PAID
TICKET_ISSUED
CANCELLED
REFUND_PENDING
REFUNDED
COMPLETED
EXPIRED
FAILED
```

---

# 6. Constraints

```text
PRIMARY KEY(id)

UNIQUE(booking_code)

FOREIGN KEY(user_id) REFERENCES users(id)

FOREIGN KEY(trip_id) REFERENCES trips(id)

CHECK(total_amount >= 0)

CHECK(discount_amount >= 0)

CHECK(final_amount >= 0)

CHECK(final_amount <= total_amount)
```

---

# 7. Indexes

```text
PRIMARY KEY(id)

UNIQUE(booking_code)

INDEX(user_id)

INDEX(trip_id)

INDEX(status)

INDEX(created_at)

INDEX(paid_at)

INDEX(cancelled_at)

INDEX(user_id, status)

INDEX(trip_id, status)
```

---

# 8. SQL DDL

```sql
CREATE TABLE bookings (
    id UUID PRIMARY KEY,
    booking_code VARCHAR(30) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    trip_id UUID NOT NULL REFERENCES trips(id),
    status VARCHAR(40) NOT NULL,
    total_amount NUMERIC(18,2) NOT NULL DEFAULT 0,
    discount_amount NUMERIC(18,2) NOT NULL DEFAULT 0,
    final_amount NUMERIC(18,2) NOT NULL DEFAULT 0,
    currency VARCHAR(10) NOT NULL DEFAULT 'VND',
    seat_hold_expires_at TIMESTAMPTZ,
    confirmed_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    CONSTRAINT chk_booking_amount CHECK (
        total_amount >= 0
        AND discount_amount >= 0
        AND final_amount >= 0
        AND final_amount <= total_amount
    )
);
```

---

# 9. Prisma Model

```prisma
model Booking {
  id                String        @id @default(uuid())
  bookingCode       String        @unique @map("booking_code")
  userId            String        @map("user_id")
  tripId            String        @map("trip_id")
  status            BookingStatus
  totalAmount       Decimal       @default(0) @map("total_amount") @db.Decimal(18, 2)
  discountAmount    Decimal       @default(0) @map("discount_amount") @db.Decimal(18, 2)
  finalAmount       Decimal       @default(0) @map("final_amount") @db.Decimal(18, 2)
  currency          String        @default("VND")
  seatHoldExpiresAt DateTime?     @map("seat_hold_expires_at")
  confirmedAt       DateTime?     @map("confirmed_at")
  paidAt            DateTime?     @map("paid_at")
  cancelledAt       DateTime?     @map("cancelled_at")
  completedAt       DateTime?     @map("completed_at")
  createdAt         DateTime      @default(now()) @map("created_at")
  updatedAt         DateTime      @updatedAt @map("updated_at")
  deletedAt         DateTime?     @map("deleted_at")

  user              User          @relation(fields: [userId], references: [id])
  trip              Trip          @relation(fields: [tripId], references: [id])
  passengers        BookingPassenger[]
  tickets           Ticket[]
  payment           Payment?
  refunds           Refund[]

  @@index([userId])
  @@index([tripId])
  @@index([status])
  @@index([createdAt])
  @@index([paidAt])
  @@index([cancelledAt])
  @@index([userId, status])
  @@index([tripId, status])
  @@map("bookings")
}
```

---

# 10. Business Rules

BOOKING-BR-001

Một booking phải thuộc về một user.

BOOKING-BR-002

Một booking phải thuộc về một trip.

BOOKING-BR-003

Booking code phải duy nhất.

BOOKING-BR-004

Không được thanh toán booking đã hết hạn.

BOOKING-BR-005

Không được phát hành ticket nếu booking chưa PAID.

BOOKING-BR-006

Không được hủy booking đã COMPLETED.

BOOKING-BR-007

Không được refund vượt quá final_amount.

---

# 11. Booking State Flow

```text
DRAFT
 ↓
SEAT_HOLD
 ↓
CONFIRMED
 ↓
PAYMENT_PENDING
 ↓
PAID
 ↓
TICKET_ISSUED
 ↓
COMPLETED
```

Failure Flow:

```text
SEAT_HOLD
 ↓
EXPIRED
```

Cancel Flow:

```text
CONFIRMED / PAID
 ↓
CANCELLED
 ↓
REFUND_PENDING
 ↓
REFUNDED
```

---

# 12. Sample Data

| booking_code | status | total_amount | discount_amount | final_amount |
|---|---|---:|---:|---:|
| BUSZ-BK-000001 | PAID | 300000 | 20000 | 280000 |
| BUSZ-BK-000002 | PAYMENT_PENDING | 450000 | 0 | 450000 |
| BUSZ-BK-000003 | CANCELLED | 250000 | 0 | 250000 |

---

# 13. API Mapping

```text
POST /bookings
GET /bookings
GET /bookings/{id}
POST /bookings/{id}/confirm
POST /bookings/{id}/cancel
POST /bookings/{id}/refund
GET /bookings/history
```

---

# 14. Security

User chỉ được xem booking của chính mình.

Admin và Support được xem theo quyền.

Không trả dữ liệu payment token trong response booking.

Booking bị soft delete không hiển thị cho user thường.

---

# 15. Audit

Ghi log khi:

- Tạo booking
- Giữ ghế
- Xác nhận booking
- Thanh toán
- Hủy booking
- Refund
- Hoàn thành chuyến

---

# 16. Performance

Expected Records

5,000,000+

Required Index

user_id

trip_id

status

booking_code

created_at

---

# 17. Test Cases

✓ Create Booking.

✓ Duplicate Booking Code.

✓ Seat Hold Expired.

✓ Confirm Booking.

✓ Payment Pending.

✓ Payment Success.

✓ Cancel Booking.

✓ Refund Booking.

✓ Soft Delete.

---

# 18. Acceptance Criteria

✓ Booking code duy nhất.

✓ Booking liên kết đúng User.

✓ Booking liên kết đúng Trip.

✓ Amount không âm.

✓ State transition hợp lệ.

✓ Prisma migrate thành công.

✓ Không tạo booking trùng ghế.

---

# 19. Related Tables

users

trips

booking_passengers

seat_reservations

payments

tickets

refunds

audit_logs

---

# 20. Summary

`bookings` là bảng trung tâm của nghiệp vụ đặt vé BusZ.

Bảng này kết nối người dùng, chuyến xe, hành khách, thanh toán, vé điện tử và hoàn tiền. Mọi quy trình từ chọn ghế đến thanh toán và phát hành vé đều phải đi qua trạng thái của booking.