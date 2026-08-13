# Apply Promotion Screen

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Booking

Screen ID: BOOK-006

Priority: High

Status: Draft

---

# 1. Purpose

Apply Promotion cho phép người dùng áp dụng các chương trình khuyến mãi trước khi thanh toán.

Hệ thống hỗ trợ:

- Voucher
- Coupon
- Promotion Campaign
- Reward Point
- Membership Discount

---

# 2. Business Goal

Giúp người dùng:

- Tiết kiệm chi phí.
- Xem toàn bộ ưu đãi khả dụng.
- Chọn ưu đãi phù hợp.
- Thanh toán với giá tốt nhất.

---

# 3. Actors

Customer

---

# 4. Preconditions

✓ Booking hợp lệ.

✓ Ghế đang được giữ.

✓ Booking Summary hoàn thành.

---

# 5. UI Layout

AppBar

↓

Current Promotion

↓

Voucher Code Input

↓

Available Voucher List

↓

Membership Discount

↓

Reward Point

↓

Promotion Summary

↓

Apply Button

---

# 6. Components

Voucher Input

Voucher Card

Promotion Card

Reward Card

Membership Card

Price Summary

Apply Button

Remove Button

---

# 7. Promotion Types

Voucher Code

Automatic Promotion

Flash Sale

Membership Discount

Reward Point

Bus Company Promotion

Seasonal Promotion

Student Discount

---

# 8. Voucher Information

Voucher Code

Voucher Name

Description

Expire Date

Discount Type

Discount Amount

Minimum Order

Maximum Discount

Remaining Quantity

Status

---

# 9. Discount Types

Percentage

Fixed Amount

Free Service Fee

Free Insurance

Cashback

Gift

---

# 10. Membership Levels

Bronze

Silver

Gold

Platinum

Diamond

---

# 11. Reward Point

Current Point

Maximum Usage

Point Exchange Rate

Remaining Point

---

# 12. Business Rules

BOOK-BR-031

Voucher phải còn hiệu lực.

BOOK-BR-032

Voucher đúng điều kiện.

BOOK-BR-033

Voucher không vượt quá giới hạn.

BOOK-BR-034

Reward Point đủ số dư.

BOOK-BR-035

Không áp dụng hai Voucher nếu hệ thống không cho phép.

BOOK-BR-036

Promotion tự động được ưu tiên theo cấu hình.

---

# 13. Business Logic

Load Voucher

↓

Load Promotion

↓

User Select

↓

Validate

↓

Calculate Price

↓

Update Summary

↓

Save Booking

---

# 14. API

GET /vouchers

POST /voucher/validate

POST /voucher/apply

POST /reward/apply

DELETE /voucher/remove

---

# 15. Database

vouchers

voucher_usage

promotions

reward_accounts

reward_transactions

booking_discounts

---

# 16. Validation

Voucher tồn tại.

Voucher chưa hết hạn.

Voucher chưa sử dụng.

Đủ điều kiện đơn hàng.

Reward Point hợp lệ.

---

# 17. Loading State

Loading Voucher

↓

Loading Promotion

↓

Calculating Discount

---

# 18. Empty State

Không có Voucher.

↓

Hiển thị:

"Hiện tại chưa có ưu đãi."

---

# 19. Error State

Voucher Invalid.

Voucher Expired.

Voucher Used.

Reward Not Enough.

Server Error.

Network Error.

---

# 20. Success State

Voucher Applied.

↓

Price Updated.

↓

Proceed Payment.

---

# 21. Price Calculation

Original Price

↓

Voucher Discount

↓

Membership Discount

↓

Reward Discount

↓

Final Total

---

# 22. Navigation

Back

↓

Booking Summary

Proceed

↓

Booking Confirmation

---

# 23. Analytics

promotion_view

voucher_input

voucher_apply

voucher_remove

reward_apply

promotion_success

promotion_failed

---

# 24. Flutter Widget Tree

Scaffold

↓

CustomScrollView

↓

VoucherInput

↓

VoucherList

↓

PromotionSection

↓

RewardSection

↓

PriceSummary

↓

BottomActionBar

---

# 25. State Management

PromotionBloc

VoucherBloc

RewardBloc

PricingBloc

BookingBloc

---

# 26. Performance

Voucher Validation

< 1 giây

Price Update

Realtime

API Response

< 2 giây

---

# 27. Accessibility

Screen Reader

Large Font

Touch ≥ 48dp

Color + Icon

---

# 28. Test Cases

✓ Voucher hợp lệ.

✓ Voucher hết hạn.

✓ Voucher đã dùng.

✓ Reward Point đủ.

✓ Reward Point không đủ.

✓ Membership Discount.

✓ Không Internet.

---

# 29. Acceptance Criteria

✓ Áp dụng Voucher thành công.

✓ Giá cập nhật đúng.

✓ Reward hoạt động.

✓ Membership hoạt động.

✓ Không crash.

---

# 30. Related Documents

Booking Summary

Booking Confirmation

Payment

Voucher Engine

Reward System

Pricing Engine

---

# 31. Future Expansion

Auto Best Voucher

Voucher Recommendation

Voucher Marketplace

Partner Voucher

AI Promotion Engine

Location-based Promotion

Birthday Voucher

Referral Discount

---

# 32. Summary

Apply Promotion là màn hình quản lý toàn bộ chương trình ưu đãi của BusZ.

Mọi chương trình giảm giá, điểm thưởng và quyền lợi thành viên đều phải được tính toán chính xác và đồng bộ với Backend trước khi người dùng thanh toán.