# Loyalty Points Process

Project: BusZ - Intercity Bus Ticket Booking Platform

Version: 1.0

Document Type: Business Process

Module: Loyalty Points

Priority: Medium

Status: Draft

---

# 1. Purpose

Tài liệu này mô tả hệ thống tích điểm (Loyalty Points) của BusZ.

Mục tiêu:

- Khuyến khích khách hàng quay lại.
- Tăng tỷ lệ giữ chân người dùng.
- Hỗ trợ đổi điểm thành ưu đãi.
- Xây dựng chương trình thành viên.

---

# 2. Business Goal

BusZ thưởng điểm cho khách hàng sau mỗi chuyến đi hoàn thành.

Điểm có thể dùng để:

- Đổi Voucher
- Giảm giá
- Nâng hạng thành viên
- Đổi quà (Future)

---

# 3. Actors

Primary

Customer

Secondary

Backend

Booking Service

Payment Service

Promotion Service

Admin

---

# 4. Loyalty Flow

```mermaid
flowchart TD

Booking Completed

-->

Calculate Points

-->

Create Point Transaction

-->

Update User Point

-->

Notification

-->

Customer
```

---

# 5. Point Rules

Điểm chỉ được cộng khi:

✓ Booking COMPLETED

✓ Payment SUCCESS

✓ Ticket đã sử dụng

---

Không cộng điểm khi:

Booking Cancelled

Refunded

Payment Failed

---

# 6. Point Formula

Version 1

100.000 VNĐ

=

1 Point

Ví dụ

250.000

=

2 Points

---

Future

Theo hạng thành viên.

---

# 7. Membership Level

Bronze

0 - 99

---

Silver

100 - 499

---

Gold

500 - 999

---

Platinum

1000+

---

# 8. Point Transaction Types

EARN

SPEND

EXPIRE

ADJUST

BONUS

---

# 9. Database Tables

loyalty_accounts

loyalty_transactions

membership_levels

users

bookings

promotions

---

# 10. Point Expiration

Version 1

Không hết hạn.

Future

24 tháng.

---

# 11. Voucher Exchange

100 Points

↓

Voucher 50.000

---

200 Points

↓

Voucher 100.000

---

500 Points

↓

Voucher VIP

---

# 12. Notification

Earn Point

Spend Point

Upgrade Membership

Point Expired

---

# 13. Admin Features

Quản lý:

Membership

Point Rules

Voucher Exchange

Promotion

Adjustment

---

# 14. Validation

Không âm điểm.

Không tiêu vượt số điểm.

Một Booking chỉ cộng điểm một lần.

---

# 15. Logging

Point Earn

Point Spend

Level Upgrade

Voucher Exchange

---

# 16. Future Expansion

Birthday Bonus

Referral Bonus

Daily Check-in

Achievement

Mission

Lucky Spin

---

# 17. Acceptance Criteria

✓ Booking Completed.

✓ Point Created.

✓ User Point Updated.

✓ Notification Sent.

---

# 18. Related Documents

Booking Process

Promotion Process

Database Design

API Specification

---

# 19. Summary

Loyalty Points giúp tăng tỷ lệ khách hàng quay lại và tạo nền tảng cho chương trình khách hàng thân thiết của BusZ.