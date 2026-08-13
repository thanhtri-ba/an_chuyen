# Promotion API

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Backend API

Document ID

API-011

Priority

High

Version

1.0

---

# 1. Purpose

Promotion API quản lý toàn bộ hệ thống khuyến mãi và mã giảm giá của BusZ.

Hỗ trợ:

- Kiểm tra mã giảm giá
- Áp dụng mã giảm giá
- Hủy mã giảm giá
- Quản lý chiến dịch
- Quản lý Coupon
- Voucher
- Cashback
- Miễn phí vé

---

# 2. Authentication

Khách hàng

```text
Bearer JWT
```

Admin

```text
ADMIN

MARKETING
```

---

# 3. Endpoints Overview

| Method | Endpoint | Permission |
|----------|-------------------------------|------------|
| GET | /promotions | Public |
| GET | /promotions/{code} | Public |
| POST | /promotions/validate | User |
| POST | /promotions/apply | User |
| DELETE | /promotions/remove | User |
| POST | /admin/promotions | Admin |
| PATCH | /admin/promotions/{id} | Admin |
| DELETE | /admin/promotions/{id} | Admin |

---

# 4. Get Promotions

Endpoint

```text
GET /promotions
```

Response

```json
[
  {
    "code":"BUSZ10",
    "name":"Giảm 10%",
    "type":"PERCENTAGE",
    "expiredAt":"2026-12-31"
  }
]
```

---

# 5. Promotion Detail

Endpoint

```text
GET /promotions/{code}
```

Trả về:

- Điều kiện
- Giá trị giảm
- Thời gian
- Nhà xe áp dụng
- Tuyến áp dụng

---

# 6. Validate Promotion

Endpoint

```text
POST /promotions/validate
```

Request

```json
{
  "bookingId":"uuid",
  "promotionCode":"BUSZ10"
}
```

Response

```json
{
  "valid":true,
  "discount":32000,
  "finalAmount":288000
}
```

---

# 7. Apply Promotion

Endpoint

```text
POST /promotions/apply
```

Business Flow

```text
Validate

↓

Calculate Discount

↓

Update Booking

↓

Return Final Price
```

---

# 8. Remove Promotion

Endpoint

```text
DELETE /promotions/remove
```

Business Rules

- Khôi phục giá gốc.
- Không ảnh hưởng Booking đã thanh toán.

---

# 9. Create Promotion

Endpoint

```text
POST /admin/promotions
```

Permission

```text
ADMIN

MARKETING
```

Request

```json
{
  "promotionCode":"BUSZ20",
  "promotionName":"Summer Sale",
  "promotionType":"PERCENTAGE",
  "discountValue":20,
  "maxDiscount":50000,
  "startAt":"2026-07-10",
  "endAt":"2026-08-31"
}
```

---

# 10. Update Promotion

Endpoint

```text
PATCH /admin/promotions/{id}
```

Cho phép cập nhật:

- Tên
- Mô tả
- Thời gian
- Trạng thái
- Điều kiện

Không được sửa:

```
Promotion Code
```

---

# 11. Delete Promotion

Endpoint

```text
DELETE /admin/promotions/{id}
```

Business Rules

Soft Delete.

Không xóa vật lý.

---

# 12. Promotion Types

```text
PERCENTAGE

FIXED_AMOUNT

FREE_TICKET

FREE_UPGRADE

CASHBACK
```

---

# 13. Promotion Status

```text
DRAFT

ACTIVE

PAUSED

EXPIRED

DISABLED
```

---

# 14. Business Rules

PROMOTION-BR-001

Promotion phải ACTIVE.

---

PROMOTION-BR-002

Promotion chưa hết hạn.

---

PROMOTION-BR-003

Không vượt Usage Limit.

---

PROMOTION-BR-004

Không vượt Usage Per User.

---

PROMOTION-BR-005

Booking phải đủ Minimum Order.

---

PROMOTION-BR-006

Không áp dụng Promotion sau khi Payment SUCCESS.

---

# 15. Discount Formula

Percentage

```text
Discount

=

Order × Percentage

(Max ≤ maxDiscount)
```

Fixed

```text
Final

=

Order

-

Discount
```

---

# 16. Error Codes

| Code | Description |
|------|-------------|
| PROMO_001 | Promotion Not Found |
| PROMO_002 | Promotion Expired |
| PROMO_003 | Promotion Disabled |
| PROMO_004 | Usage Limit Exceeded |
| PROMO_005 | User Limit Exceeded |
| PROMO_006 | Minimum Order Not Met |
| PROMO_007 | Promotion Already Applied |

---

# 17. Security

JWT

Admin RBAC

Audit Log

Validation

Rate Limit

---

# 18. Performance

Promotion Validation

```text
<30ms
```

Apply Promotion

```text
<50ms
```

Load Promotion

```text
<20ms
```

---

# 19. Sequence Diagram

```text
Booking

↓

Promotion API

↓

Validate

↓

Calculate

↓

Update Booking

↓

Return Final Amount
```

---

# 20. Test Cases

✓ Promotion Valid.

✓ Promotion Expired.

✓ Usage Limit.

✓ User Limit.

✓ Percentage.

✓ Fixed Amount.

✓ Cashback.

✓ Remove Promotion.

---

# 21. Acceptance Criteria

✓ Validation chính xác.

✓ Không vượt Usage Limit.

✓ Không áp dụng Promotion hết hạn.

✓ Audit Log.

✓ Soft Delete.

---

# 22. Related Documents

API-007 Booking API

API-008 Payment API

DB-015 Promotions

---

# 23. Summary

Promotion API quản lý toàn bộ mã giảm giá và chương trình khuyến mãi của BusZ, hỗ trợ kiểm tra, áp dụng và quản trị các chiến dịch marketing với cơ chế giới hạn sử dụng, điều kiện áp dụng và tính toán giảm giá chính xác.