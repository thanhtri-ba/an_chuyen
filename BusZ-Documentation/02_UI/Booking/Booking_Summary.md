# Booking Summary Screen

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Booking

Screen ID: BOOK-005

Priority: Critical

Status: Draft

---

# 1. Purpose

Booking Summary hiển thị toàn bộ thông tin đặt vé trước khi người dùng tiến hành thanh toán.

Đây là bước xác nhận cuối cùng để người dùng kiểm tra toàn bộ dữ liệu.

---

# 2. Business Goal

Người dùng có thể:

- Kiểm tra thông tin chuyến xe.
- Kiểm tra ghế đã chọn.
- Kiểm tra hành khách.
- Kiểm tra điểm đón/trả.
- Kiểm tra giá.
- Áp dụng Voucher.
- Áp dụng điểm thưởng.
- Tiếp tục thanh toán.

---

# 3. Actors

Customer

---

# 4. Preconditions

✓ Seat Selection hoàn thành.

✓ Passenger Information hợp lệ.

✓ Contact Information hợp lệ.

✓ Pickup & Drop-off hợp lệ.

---

# 5. UI Layout

AppBar

↓

Trip Summary

↓

Passenger Summary

↓

Pickup & Drop-off

↓

Seat Summary

↓

Voucher

↓

Reward Point

↓

Price Summary

↓

Terms

↓

Proceed To Payment

---

# 6. Components

Trip Summary Card

Passenger Card

Seat Card

Pickup Card

Voucher Card

Reward Point Card

Price Summary Card

Terms Checkbox

Proceed Button

---

# 7. Trip Summary

Trip Code

Bus Company

Bus Type

Departure

Arrival

Duration

Route

Booking Time

---

# 8. Passenger Summary

Passenger Name

Seat Number

Passenger Type

Phone

Identity

---

# 9. Seat Summary

Seat Number

Seat Type

Floor

Price

Status

---

# 10. Pickup & Drop-off Summary

Pickup Station

Pickup Time

Drop-off Station

Drop-off Time

Additional Fee

---

# 11. Voucher Section

Voucher Code

Voucher Name

Discount Type

Discount Amount

Expire Date

Apply Button

Remove Button

---

# 12. Reward Point

Current Point

Available Point

Point Used

Discount Value

Remaining Point

---

# 13. Price Breakdown

Ticket Price

Seat Surcharge

Pickup Fee

Drop-off Fee

Service Fee

Insurance Fee

VAT

Discount

Reward Point Discount

Total

---

# 14. Business Rules

BOOK-BR-025

Không cho phép Total < 0.

BOOK-BR-026

Voucher chỉ dùng một lần.

BOOK-BR-027

Reward Point không vượt quá quy định.

BOOK-BR-028

Voucher hết hạn không được sử dụng.

BOOK-BR-029

Giá phải đồng bộ với Backend.

BOOK-BR-030

Mọi thay đổi phải tính lại Total.

---

# 15. Pricing Formula

Total

=

Ticket Price

+

Seat Fee

+

Pickup Fee

+

Drop-off Fee

+

Insurance Fee

+

Service Fee

+

VAT

-

Voucher

-

Reward Point

---

# 16. Business Logic

Load Booking

↓

Calculate Price

↓

Apply Voucher

↓

Apply Reward

↓

Calculate Total

↓

Confirm

↓

Payment

---

# 17. API

GET /booking/{bookingId}

POST /booking/calculate

POST /voucher/apply

POST /reward/apply

---

# 18. Database

bookings

booking_details

booking_passengers

booking_locations

vouchers

reward_transactions

pricing_rules

---

# 19. Validation

Voucher hợp lệ.

Reward Point đủ.

Booking còn hiệu lực.

Seat Hold chưa hết hạn.

---

# 20. Loading State

Loading Booking

↓

Loading Voucher

↓

Loading Pricing

↓

Loading Reward

---

# 21. Empty State

Không có Voucher.

↓

Ẩn Section.

Không có Reward Point.

↓

Ẩn Section.

---

# 22. Error State

Voucher Invalid.

Voucher Expired.

Seat Timeout.

Booking Expired.

Pricing Error.

Server Error.

Network Error.

---

# 23. Success State

Booking Valid.

↓

Price Updated.

↓

Payment Enabled.

---

# 24. Navigation

Back

↓

Pickup & Drop-off

Proceed

↓

Payment Method

Voucher

↓

Voucher List

---

# 25. Analytics

booking_summary_view

voucher_apply

reward_apply

payment_click

price_updated

---

# 26. Flutter Widget Tree

Scaffold

↓

CustomScrollView

↓

TripSummaryCard

↓

PassengerSection

↓

SeatSection

↓

PickupDropoffSection

↓

VoucherSection

↓

RewardSection

↓

PriceSummaryCard

↓

TermsCheckbox

↓

BottomActionBar

---

# 27. State Management

BookingSummaryBloc

PricingBloc

VoucherBloc

RewardBloc

BookingRepository

PricingRepository

---

# 28. Performance

Pricing

< 500ms

Voucher

< 1 giây

Reward

Realtime

---

# 29. Accessibility

Screen Reader

Large Font

Touch ≥ 48dp

High Contrast

---

# 30. Test Cases

✓ Voucher hợp lệ.

✓ Voucher hết hạn.

✓ Reward Point.

✓ Booking Timeout.

✓ Pricing.

✓ Continue Payment.

✓ Không Internet.

---

# 31. Acceptance Criteria

✓ Tổng tiền chính xác.

✓ Voucher hoạt động.

✓ Reward hoạt động.

✓ Payment Button đúng.

✓ Không crash.

---

# 32. Related Documents

Seat Selection

Passenger Information

Contact Information

Pickup & Drop-off

Payment

Voucher

Pricing

---

# 33. Future Expansion

Installment Payment

Travel Insurance

Coupon Stack

Group Discount

Membership Discount

AI Best Price

Price Lock

---

# 34. Summary

Booking Summary là bước xác nhận cuối cùng trước khi thanh toán.

Mọi thông tin về chuyến xe, hành khách, ghế, điểm đón/trả và giá tiền phải được kiểm tra, đồng bộ với Backend và hiển thị chính xác để đảm bảo người dùng thanh toán đúng số tiền cần thiết.