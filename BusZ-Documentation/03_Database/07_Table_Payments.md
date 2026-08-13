# Payments Table

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Database

Document ID: DB-007

Table Name

payments

Priority

Critical

Version

1.0

---

# 1. Purpose

Bảng `payments` lưu thông tin thanh toán cho các booking trong hệ thống BusZ.

Mỗi booking chỉ có một bản ghi payment chính, nhưng có thể phát sinh nhiều giao dịch (transactions) trong quá trình thanh toán hoặc hoàn tiền.

---

# 2. Responsibilities

Quản lý:

- Thanh toán booking
- Phương thức thanh toán
- Trạng thái thanh toán
- Số tiền
- Mã giao dịch
- Nhà cung cấp thanh toán
- Hoàn tiền

---

# 3. Relationships

```text
bookings
1 ---- 1 payments

payments
1 ---- N payment_transactions

payments
1 ---- N refunds

users
1 ---- N payments
```

---

# 4. Columns

| Column | Type | Nullable | Description |
|---|---|---|---|
| id | UUID | No | Primary Key |
| payment_code | VARCHAR(30) | No | Unique Payment Code |
| booking_id | UUID | No | Booking |
| user_id | UUID | No | Người thanh toán |
| method | ENUM | No | Payment Method |
| provider | ENUM | No | Payment Provider |
| status | ENUM | No | Payment Status |
| amount | NUMERIC(18,2) | No | Số tiền |
| currency | VARCHAR(10) | No | Tiền tệ |
| transaction_reference | VARCHAR(100) | Yes | Mã giao dịch từ cổng thanh toán |
| paid_at | TIMESTAMPTZ | Yes | Thời điểm thanh toán |
| failed_reason | TEXT | Yes | Lý do thất bại |
| created_at | TIMESTAMPTZ | No | Thời gian tạo |
| updated_at | TIMESTAMPTZ | No | Thời gian cập nhật |
| deleted_at | TIMESTAMPTZ | Yes | Soft Delete |

---

# 5. Enums

## PaymentMethod

```text
CASH
BANK_TRANSFER
CREDIT_CARD
DEBIT_CARD
E_WALLET
QR_PAYMENT
APPLE_PAY
GOOGLE_PAY
```

---

## PaymentProvider

```text
VNPAY
MOMO
ZALOPAY
STRIPE
PAYPAL
CASH
OTHER
```

---

## PaymentStatus

```text
PENDING
PROCESSING
SUCCESS
FAILED
CANCELLED
REFUND_PENDING
REFUNDED
EXPIRED
```

---

# 6. Constraints

```text
PRIMARY KEY(id)

UNIQUE(payment_code)

FOREIGN KEY(booking_id)

FOREIGN KEY(user_id)

CHECK(amount >= 0)
```

---

# 7. Indexes

```text
PRIMARY KEY(id)

UNIQUE(payment_code)

INDEX(booking_id)

INDEX(user_id)

INDEX(status)

INDEX(provider)

INDEX(created_at)

INDEX(paid_at)
```

---

# 8. SQL DDL

```sql
CREATE TABLE payments (

id UUID PRIMARY KEY,

payment_code VARCHAR(30) UNIQUE NOT NULL,

booking_id UUID NOT NULL REFERENCES bookings(id),

user_id UUID NOT NULL REFERENCES users(id),

method VARCHAR(30) NOT NULL,

provider VARCHAR(30) NOT NULL,

status VARCHAR(30) NOT NULL,

amount NUMERIC(18,2) NOT NULL,

currency VARCHAR(10) DEFAULT 'VND',

transaction_reference VARCHAR(100),

paid_at TIMESTAMPTZ,

failed_reason TEXT,

created_at TIMESTAMPTZ DEFAULT NOW(),

updated_at TIMESTAMPTZ DEFAULT NOW(),

deleted_at TIMESTAMPTZ

);
```

---

# 9. Prisma Model

```prisma
model Payment {

  id                   String          @id @default(uuid())

  paymentCode          String          @unique @map("payment_code")

  bookingId            String          @unique @map("booking_id")

  userId               String          @map("user_id")

  method               PaymentMethod

  provider             PaymentProvider

  status               PaymentStatus

  amount               Decimal         @db.Decimal(18,2)

  currency             String          @default("VND")

  transactionReference String?         @map("transaction_reference")

  paidAt               DateTime?       @map("paid_at")

  failedReason         String?         @map("failed_reason")

  createdAt            DateTime        @default(now())

  updatedAt            DateTime        @updatedAt

  deletedAt            DateTime?

  booking              Booking         @relation(fields:[bookingId], references:[id])

  user                 User            @relation(fields:[userId], references:[id])

  transactions         PaymentTransaction[]

  refunds              Refund[]

  @@index([status])

  @@index([provider])

  @@index([createdAt])

  @@map("payments")
}
```

---

# 10. Business Rules

PAYMENT-BR-001

Một Booking chỉ có một Payment chính.

PAYMENT-BR-002

Không được thanh toán Payment đã SUCCESS.

PAYMENT-BR-003

Payment SUCCESS không được sửa Amount.

PAYMENT-BR-004

Refund không được vượt Amount.

PAYMENT-BR-005

Provider trả Transaction Reference phải lưu.

---

# 11. Payment Flow

```text
PENDING
    ↓
PROCESSING
    ↓
SUCCESS
```

Failure:

```text
PROCESSING
    ↓
FAILED
```

Refund:

```text
SUCCESS
    ↓
REFUND_PENDING
    ↓
REFUNDED
```

---

# 12. Sample Data

| payment_code | provider | method | status | amount |
|---|---|---|---|---:|
| BUSZ-PAY-000001 | VNPAY | QR_PAYMENT | SUCCESS | 280000 |
| BUSZ-PAY-000002 | MOMO | E_WALLET | PROCESSING | 450000 |
| BUSZ-PAY-000003 | STRIPE | CREDIT_CARD | FAILED | 350000 |

---

# 13. API Mapping

```text
POST /payments

GET /payments/{id}

POST /payments/{id}/confirm

POST /payments/{id}/cancel

POST /payments/{id}/refund

GET /payments/history
```

---

# 14. Security

Không lưu:

- Số thẻ
- CVV
- PIN

Chỉ lưu:

- Transaction Reference
- Provider
- Token (nếu có)

Mọi dữ liệu nhạy cảm phải được mã hóa hoặc token hóa theo chuẩn của cổng thanh toán.

---

# 15. Audit

Ghi log:

- Payment Created
- Payment Processing
- Payment Success
- Payment Failed
- Refund Requested
- Refund Completed

---

# 16. Performance

Expected Records

5,000,000+

Target Query

<10ms

Indexes bắt buộc:

- booking_id
- user_id
- payment_code
- provider
- status

---

# 17. Test Cases

✓ Create Payment

✓ Duplicate Payment Code

✓ Success Payment

✓ Failed Payment

✓ Refund

✓ Amount Validation

✓ Soft Delete

---

# 18. Acceptance Criteria

✓ Payment Code duy nhất

✓ Booking liên kết đúng

✓ Amount hợp lệ

✓ Status Flow hợp lệ

✓ Migration thành công

✓ Prisma Generate thành công

---

# 19. Related Tables

bookings

payment_transactions

refunds

users

audit_logs

---

# 20. Summary

`payments` là bảng trung tâm của nghiệp vụ thanh toán trong BusZ. Bảng quản lý toàn bộ thông tin thanh toán của booking, kết nối với các giao dịch, hoàn tiền và cổng thanh toán, đảm bảo khả năng truy vết, đối soát và xử lý giao dịch an toàn.