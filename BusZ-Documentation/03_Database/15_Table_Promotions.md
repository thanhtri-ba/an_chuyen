# Promotions Table

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Database

Document ID: DB-015

Table Name

promotions

Priority

High

Version

1.0

---

# 1. Purpose

Bảng `promotions` quản lý toàn bộ chương trình khuyến mãi trong hệ thống BusZ.

Promotion có thể áp dụng cho:

- Toàn hệ thống
- Nhà xe
- Tuyến xe
- Chuyến xe
- Người dùng
- Nhóm khách hàng
- Chiến dịch Marketing

---

# 2. Responsibilities

Quản lý:

- Mã giảm giá
- Chiến dịch
- Điều kiện áp dụng
- Giá trị giảm
- Thời gian hiệu lực
- Giới hạn sử dụng
- Trạng thái

---

# 3. Relationships

```text
promotions
1 ---- N promotion_rules

promotions
1 ---- N user_promotions

promotions
1 ---- N bookings

users
N ---- N promotions
```

---

# 4. Columns

| Column | Type | Nullable | Description |
|---------|------|----------|-------------|
| id | UUID | No | Primary Key |
| promotion_code | VARCHAR(30) | No | Promotion Code |
| promotion_name | VARCHAR(255) | No | Promotion Name |
| description | TEXT | Yes | Description |
| promotion_type | ENUM | No | Discount Type |
| discount_value | NUMERIC(18,2) | No | Discount Value |
| max_discount | NUMERIC(18,2) | Yes | Maximum Discount |
| minimum_order | NUMERIC(18,2) | Yes | Minimum Order |
| usage_limit | INTEGER | Yes | Total Usage Limit |
| usage_per_user | INTEGER | Yes | Per User Limit |
| start_at | TIMESTAMPTZ | No | Start Time |
| end_at | TIMESTAMPTZ | No | End Time |
| status | ENUM | No | Status |
| created_at | TIMESTAMPTZ | No | Created |
| updated_at | TIMESTAMPTZ | No | Updated |
| deleted_at | TIMESTAMPTZ | Yes | Soft Delete |

---

# 5. Enums

## PromotionType

```text
PERCENTAGE

FIXED_AMOUNT

FREE_TICKET

FREE_UPGRADE

CASHBACK
```

---

## PromotionStatus

```text
DRAFT

ACTIVE

PAUSED

EXPIRED

DISABLED
```

---

# 6. Constraints

```text
PRIMARY KEY(id)

UNIQUE(promotion_code)

CHECK(discount_value >= 0)

CHECK(max_discount >= 0)

CHECK(minimum_order >= 0)

CHECK(start_at < end_at)
```

---

# 7. Indexes

```text
PRIMARY KEY(id)

UNIQUE(promotion_code)

INDEX(status)

INDEX(start_at)

INDEX(end_at)

INDEX(promotion_type)
```

---

# 8. SQL DDL

```sql
CREATE TABLE promotions (

id UUID PRIMARY KEY,

promotion_code VARCHAR(30) UNIQUE NOT NULL,

promotion_name VARCHAR(255) NOT NULL,

description TEXT,

promotion_type VARCHAR(30) NOT NULL,

discount_value NUMERIC(18,2) NOT NULL,

max_discount NUMERIC(18,2),

minimum_order NUMERIC(18,2),

usage_limit INTEGER,

usage_per_user INTEGER,

start_at TIMESTAMPTZ NOT NULL,

end_at TIMESTAMPTZ NOT NULL,

status VARCHAR(30) NOT NULL,

created_at TIMESTAMPTZ DEFAULT NOW(),

updated_at TIMESTAMPTZ DEFAULT NOW(),

deleted_at TIMESTAMPTZ

);
```

---

# 9. Prisma Model

```prisma
model Promotion {

  id              String   @id @default(uuid())

  promotionCode   String   @unique @map("promotion_code")

  promotionName   String   @map("promotion_name")

  description     String?

  promotionType   PromotionType @map("promotion_type")

  discountValue   Decimal @db.Decimal(18,2) @map("discount_value")

  maxDiscount     Decimal? @db.Decimal(18,2) @map("max_discount")

  minimumOrder    Decimal? @db.Decimal(18,2) @map("minimum_order")

  usageLimit      Int? @map("usage_limit")

  usagePerUser    Int? @map("usage_per_user")

  startAt         DateTime @map("start_at")

  endAt           DateTime @map("end_at")

  status          PromotionStatus

  createdAt       DateTime @default(now())

  updatedAt       DateTime @updatedAt

  deletedAt       DateTime?

  rules           PromotionRule[]

  userPromotions  UserPromotion[]

  @@index([status])

  @@index([startAt])

  @@index([endAt])

  @@map("promotions")
}
```

---

# 10. Business Rules

PROMOTION-BR-001

Promotion Code phải duy nhất.

PROMOTION-BR-002

Promotion ACTIVE mới được áp dụng.

PROMOTION-BR-003

Promotion EXPIRED không được sử dụng.

PROMOTION-BR-004

Mỗi User không được vượt quá `usage_per_user`.

PROMOTION-BR-005

Tổng lượt dùng không vượt `usage_limit`.

PROMOTION-BR-006

Không áp dụng Promotion cho Booking đã thanh toán.

PROMOTION-BR-007

Nếu nhiều Promotion hợp lệ, áp dụng theo chính sách ưu tiên của hệ thống.

---

# 11. Promotion Flow

```text
DRAFT

↓

ACTIVE

↓

PAUSED

↓

ACTIVE

↓

EXPIRED
```

Hoặc:

```text
ACTIVE

↓

DISABLED
```

---

# 12. Discount Formula

Percentage

```text
Discount

=

Order Total × Percentage

(Max ≤ max_discount)
```

Fixed Amount

```text
Order Total

-

Discount Value
```

---

# 13. Sample Data

| promotion_code | type | value | status |
|---|---|---:|---|
| BUSZ10 | PERCENTAGE | 10 | ACTIVE |
| SUMMER50K | FIXED_AMOUNT | 50000 | ACTIVE |
| NEWUSER | FREE_TICKET | 1 | DRAFT |

---

# 14. API Mapping

```text
GET /promotions

GET /promotions/{code}

POST /promotions/validate

POST /promotions/apply

POST /promotions/remove

POST /admin/promotions

PATCH /admin/promotions/{id}
```

---

# 15. Security

Chỉ Admin/Marketing được tạo hoặc chỉnh sửa Promotion.

Người dùng chỉ được xem Promotion đang ACTIVE.

Promotion phải được kiểm tra quyền trước khi áp dụng.

---

# 16. Audit

Ghi log:

- Promotion Created
- Promotion Updated
- Promotion Activated
- Promotion Paused
- Promotion Disabled
- Promotion Applied
- Promotion Expired

---

# 17. Performance

Expected Records

500,000+

Validate Promotion

<20ms

Apply Promotion

<50ms

---

# 18. Test Cases

✓ Create Promotion.

✓ Duplicate Promotion Code.

✓ Promotion Expired.

✓ Usage Limit.

✓ User Limit.

✓ Minimum Order.

✓ Percentage Discount.

✓ Fixed Discount.

---

# 19. Acceptance Criteria

✓ Promotion Code duy nhất.

✓ Điều kiện áp dụng đúng.

✓ Không vượt Usage Limit.

✓ Prisma Generate thành công.

✓ Migration thành công.

---

# 20. Related Tables

promotion_rules

user_promotions

bookings

users

audit_logs

---

# 21. Summary

`promotions` quản lý toàn bộ chương trình khuyến mãi của BusZ, bao gồm mã giảm giá, điều kiện áp dụng, giới hạn sử dụng và vòng đời của chiến dịch. Bảng này hỗ trợ các chương trình marketing, ưu đãi khách hàng và tích hợp trực tiếp vào quy trình đặt vé.