# Payment Method Screen

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Payment

Screen ID: PAYMENT-002

Priority: Critical

Status: Draft

Version: 1.0

---

# 1. Purpose

Payment Method cho phép người dùng lựa chọn phương thức thanh toán trước khi chuyển đến cổng thanh toán tương ứng.

Đây là màn hình đầu tiên của Payment Module.

---

# 2. Business Goal

Người dùng có thể:

- Xem tất cả phương thức thanh toán.
- Chọn một phương thức.
- Xem phí (nếu có).
- Xem thời gian xử lý.
- Tiếp tục thanh toán.

---

# 3. Actors

Customer

---

# 4. Preconditions

✓ Booking Confirmed.

✓ Booking chưa thanh toán.

✓ Payment Session đã được tạo.

---

# 5. UI Layout

AppBar

↓

Booking Summary

↓

Payment Method List

↓

Promotion Information

↓

Payment Summary

↓

Pay Now Button

---

# 6. Components

Booking Summary Card

Payment Method Card

Radio Button

Gateway Logo

Fee Information

Promotion Banner

Price Summary

Pay Button

---

# 7. Supported Payment Methods

VNPay

MoMo Wallet

ZaloPay

Credit Card

Debit Card

Internet Banking

QR Banking

BusZ Wallet (Future)

Apple Pay (Future)

Google Pay (Future)

---

# 8. Payment Method Information

Gateway Name

Gateway Logo

Supported Bank

Processing Time

Transaction Fee

Promotion

Status

---

# 9. Gateway Status

Available

Busy

Maintenance

Unavailable

---

# 10. Business Rules

PAY-BR-001

Chỉ được chọn một Payment Method.

PAY-BR-002

Không hiển thị Gateway đang bảo trì.

PAY-BR-003

Gateway phải hỗ trợ loại tiền hiện tại.

PAY-BR-004

Phí thanh toán phải hiển thị trước khi thanh toán.

PAY-BR-005

Tổng tiền cuối cùng phải được cập nhật sau khi chọn Gateway.

---

# 11. Business Logic

Load Payment Methods

↓

Load Gateway Status

↓

User Select Gateway

↓
↓

Calculate Payment Fee

↓

Update Total Amount

↓

Enable Pay Button

↓

Navigate Payment Processing

---

# 12. API

GET /payment-methods

GET /payment-gateways/status

POST /payments/select-method

GET /payments/fees

---

# 13. Database

payment_methods

payment_gateways

payment_gateway_status

payment_sessions

payment_transactions

payment_fees

---

# 14. Validation

Payment Method được chọn.

Gateway Available.

Payment Session còn hiệu lực.

Booking chưa thanh toán.

---

# 15. Loading State

Loading Payment Methods

↓

Loading Gateway Status

↓

Loading Processing Fee

↓

Updating Total Amount

---

# 16. Empty State

Không có phương thức thanh toán khả dụng.

↓

Hiển thị:

"Hiện tại không có phương thức thanh toán khả dụng."

↓

Retry

---

# 17. Error State

Gateway Maintenance.

↓

Chọn Gateway khác.

---

Payment Session Expired.

↓

Quay lại Booking.

---

Network Error.

↓

Retry.

---

Server Error.

↓

Retry.

---

# 18. Success State

Payment Method Selected.

↓

Fee Updated.

↓

Pay Button Enabled.

---

# 19. Payment Fee Rules

Gateway có thể có:

Processing Fee

Service Fee

Gateway Promotion

Miễn phí giao dịch

Phí được cộng vào Total hoặc được BusZ chịu theo cấu hình.

---

# 20. Navigation

Back

↓

Booking Confirmation

Pay Now

↓

Payment Processing

Change Method

↓

Payment Method

---

# 21. Analytics

payment_method_view

payment_method_selected

gateway_changed

pay_now_click

gateway_unavailable

---

# 22. Flutter Widget Tree

Scaffold

↓

AppBar

↓

BookingSummaryCard

↓

PaymentMethodList

↓

PaymentFeeCard

↓

PriceSummaryCard

↓

BottomActionBar

---

# 23. State Management

PaymentMethodBloc

PaymentGatewayBloc

PaymentSessionBloc

PricingBloc

---

# 24. Performance

Load Payment Methods

< 1 giây

Gateway Status

Realtime

Update Price

< 500ms

---

# 25. Accessibility

Touch Area ≥ 48dp

Screen Reader

Keyboard Navigation

Dynamic Font

High Contrast

---

# 26. Test Cases

✓ Chọn VNPay.

✓ Chọn MoMo.

✓ Chọn ZaloPay.

✓ Gateway bảo trì.

✓ Session hết hạn.

✓ Network Error.

✓ Retry thành công.

---

# 27. Acceptance Criteria

✓ Chỉ chọn được một Gateway.

✓ Fee hiển thị đúng.

✓ Tổng tiền cập nhật đúng.

✓ Pay Button hoạt động.

✓ Không crash.

---

# 28. Related Documents

Payment Architecture

VNPay

MoMo

ZaloPay

Payment Processing

Payment Security

---

# 29. Future Expansion

Apple Pay

Google Pay

Samsung Pay

BusZ Wallet

Split Payment

Installment Payment

Cryptocurrency

---

# 30. Summary

Payment Method là màn hình lựa chọn cổng thanh toán của BusZ.

Mọi phương thức thanh toán phải hiển thị đầy đủ trạng thái, phí giao dịch, ưu đãi và chỉ cho phép người dùng tiếp tục khi Payment Session còn hiệu lực và Gateway đang sẵn sàng phục vụ.