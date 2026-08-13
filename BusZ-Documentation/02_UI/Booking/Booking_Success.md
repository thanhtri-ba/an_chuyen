# Booking Confirmation Screen

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Booking

Screen ID: BOOK-007

Priority: Critical

Status: Draft

---

# 1. Purpose

Booking Confirmation là màn hình xác nhận cuối cùng trước khi chuyển sang thanh toán.

Đây là bước giúp người dùng kiểm tra lại toàn bộ thông tin booking và đồng ý với các điều khoản của BusZ.

Sau bước này dữ liệu Booking sẽ bị khóa và chuyển sang Payment Module.

---

# 2. Business Goal

Người dùng phải:

- Kiểm tra toàn bộ thông tin.
- Đồng ý điều khoản.
- Đồng ý chính sách hoàn/hủy.
- Xác nhận thanh toán.

---

# 3. Actors

Customer

---

# 4. Preconditions

✓ Seat Hold còn hiệu lực.

✓ Passenger hợp lệ.

✓ Contact hợp lệ.

✓ Pickup/Drop-off hợp lệ.

✓ Pricing hợp lệ.

---

# 5. UI Layout

AppBar

↓

Booking Information

↓

Passenger Summary

↓

Pickup Summary

↓

Price Summary

↓

Terms & Conditions

↓

Privacy Policy

↓

Confirm Booking Button

---

# 6. Components

Booking Summary Card

Passenger Card

Seat Card

Pickup Card

Price Card

Terms Checkbox

Privacy Checkbox

Confirm Button

Back Button

---

# 7. Booking Information

Booking ID (Temporary)

Trip Code

Trip Name

Bus Company

Booking Date

Departure Time

Arrival Time

Total Passenger

Seat List

---

# 8. Passenger Summary

Passenger Name

Seat Number

Passenger Type

Identity Number

Phone

---

# 9. Pricing Summary

Ticket Price

Seat Fee

Pickup Fee

Drop-off Fee

Insurance

VAT

Voucher Discount

Reward Discount

Grand Total

---

# 10. Terms & Conditions

User phải đồng ý:

□ Điều khoản sử dụng

□ Chính sách hoàn vé

□ Chính sách bảo mật

□ Điều kiện vận chuyển

---

# 11. Business Rules

BOOK-BR-037

Booking phải hợp lệ.

BOOK-BR-038

Seat Hold chưa hết hạn.

BOOK-BR-039

User bắt buộc đồng ý điều khoản.

BOOK-BR-040

Tổng tiền phải được Backend xác nhận lại.

BOOK-BR-041

Booking chỉ được xác nhận một lần.

---

# 12. Business Logic

Open Confirmation

↓

Reload Booking

↓

Validate Booking

↓

Validate Seats

↓

Validate Pricing

↓

Confirm Booking

↓

Generate Booking ID

↓

Lock Booking

↓

Navigate Payment

---

# 13. API

GET /booking/{bookingId}

POST /booking/confirm

POST /booking/revalidate

---

# 14. Database

bookings

booking_details

booking_passengers

booking_locations

booking_status

pricing_snapshot

---

# 15. Validation

Booking tồn tại.

Seat Hold hợp lệ.

Passenger đầy đủ.

Terms được đồng ý.

Price khớp Backend.

---

# 16. Loading State

Loading Booking

↓

Validating

↓

Confirming

↓

Navigate Payment

---

# 17. Empty State

Không áp dụng.

---

# 18. Error State

Seat Hold Expired

↓

Back Seat Selection

---

Booking Timeout

↓

Restart Booking

---

Price Changed

↓

Reload Summary

---

Server Error

↓

Retry

---

# 19. Success State

Booking Confirmed

↓

Booking Locked

↓

Booking ID Created

↓

Payment Module

---

# 20. Navigation

Back

↓

Booking Summary

Confirm

↓

Payment Method

---

# 21. Analytics

booking_confirmation_view

booking_confirm_click

booking_confirm_success

booking_confirm_failed

terms_open

privacy_open

---

# 22. Flutter Widget Tree

Scaffold

↓

CustomScrollView

↓

BookingSummaryCard

↓

PassengerSection

↓

PriceSummary

↓

TermsCard

↓

ConfirmButton

---

# 23. State Management

BookingConfirmationBloc

BookingRepository

PricingRepository

SeatRepository

PaymentRepository

---

# 24. Performance

Booking Validation

< 2 giây

Confirm Booking

< 2 giây

Screen Render

< 500ms

---

# 25. Accessibility

Touch Area ≥ 48dp

Screen Reader

Dynamic Font

Keyboard Navigation

---

# 26. Test Cases

✓ Confirm Booking.

✓ Không đồng ý điều khoản.

✓ Seat hết thời gian giữ.

✓ Giá thay đổi.

✓ Booking Timeout.

✓ Không Internet.

✓ Retry.

---

# 27. Acceptance Criteria

✓ Booking được xác nhận.

✓ Booking ID tạo thành công.

✓ Booking bị khóa.

✓ Chuyển Payment.

✓ Không crash.

---

# 28. Related Documents

Booking Summary

Payment Module

Pricing Engine

Voucher Engine

Seat Hold

---

# 29. Future Expansion

Digital Agreement

Electronic Signature

Corporate Approval

Group Booking Confirmation

Travel Insurance Confirmation

---

# 30. Summary

Booking Confirmation là bước cuối cùng của Booking Module.

Sau khi người dùng xác nhận, toàn bộ dữ liệu đặt vé sẽ được khóa, Booking ID chính thức được tạo và hệ thống chuyển sang Payment Module để thực hiện thanh toán.