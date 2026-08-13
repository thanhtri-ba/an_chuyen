# Saved Payment Methods

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Profile

Document ID: PROFILE-007

Priority: High

Status: Draft

Version: 1.0

---

# 1. Purpose

Saved Payment Methods cho phép người dùng quản lý các phương thức thanh toán đã liên kết với tài khoản BusZ.

Module này giúp:

- Thanh toán nhanh hơn.
- Giảm thao tác nhập lại thông tin.
- Đảm bảo an toàn dữ liệu thanh toán.

---

# 2. Objectives

Đảm bảo:

✓ Quản lý phương thức thanh toán.

✓ Không lưu dữ liệu thẻ nhạy cảm.

✓ Đồng bộ Payment Module.

✓ Hỗ trợ nhiều Gateway.

✓ Bảo mật cao.

---

# 3. Supported Payment Methods

Credit Card

Debit Card

MoMo

ZaloPay

VNPay Token

Apple Pay (Future)

Google Pay (Future)

Corporate Wallet (Future)

---

# 4. Actors

Customer

Payment Service

Payment Gateway

Admin

---

# 5. Payment Method Lifecycle

Add Payment Method

↓

Verify Ownership

↓

Tokenization

↓

Save Token

↓

Use For Payment

↓

Update

↓

Delete

---

# 6. Payment Method Information

Payment Method ID

Payment Type

Card Brand

Masked Card Number

Card Holder

Gateway

Token

Status

Default Payment Method

Created Time

Last Used Time

---

# 7. Security Policy

Không lưu:

- Full Card Number
- CVV
- PIN
- OTP

Chỉ lưu:

- Gateway Token
- Masked Card Number
- Card Brand
- Expiry Month / Year (nếu được Gateway cho phép)

---

# 8. Business Rules

PROFILE-BR-029

Một User có thể lưu nhiều Payment Method.

PROFILE-BR-030

Chỉ có một Payment Method mặc định.

PROFILE-BR-031

Token chỉ do Gateway cấp.

PROFILE-BR-032

Xóa Payment Method không ảnh hưởng giao dịch đã hoàn thành.

PROFILE-BR-033

Mọi thay đổi phải ghi Audit Log.

---

# 9. Business Logic

Open Payment Methods

↓

Load Saved Methods

↓

Add New Method

↓

Gateway Verification

↓

Save Token

↓

Refresh List

---

# 10. Validation

Gateway Available

↓

Token Valid

↓

Card Supported

↓

Verification Success

---

# 11. API

GET /profile/payment-methods

POST /profile/payment-methods

PUT /profile/payment-methods/{id}

DELETE /profile/payment-methods/{id}

PATCH /profile/payment-methods/{id}/default

---

# 12. Database

payment_methods

payment_method_tokens

payment_gateways

profiles

audit_logs

---

# 13. Loading State

Loading Payment Methods

↓

Connecting Gateway

↓

Saving Token

↓

Updating Default

---

# 14. Empty State

Chưa có phương thức thanh toán.

↓

Hiển thị:

"Add Your First Payment Method"

---

# 15. Error State

Gateway Unavailable

↓

Retry

---

Invalid Token

↓

Retry Verification

---

Network Error

↓

Retry

---

# 16. Success State

Payment Method Added

↓

Ready For Payment

↓

Available In Checkout

---

# 17. Default Payment Method

User Select Default

↓

Update Database

↓

Sync Checkout

↓

Use Automatically

---

# 18. Notification

Payment Method Added

Payment Method Removed

Default Changed

Security Verification Required

---

# 19. Analytics

payment_method_added

payment_method_removed

default_payment_changed

payment_method_used

gateway_connected

---

# 20. Flutter Widget Tree

Scaffold

↓

PaymentMethodList

↓

PaymentMethodCard

↓

AddPaymentMethodButton

↓

DefaultBadge

↓

DeleteDialog

---

# 21. State Management

PaymentMethodBloc

PaymentRepository

GatewayRepository

ProfileRepository

---

# 22. Performance

Load Methods

<1 giây

Save Token

<2 giây

Delete Method

<500ms

---

# 23. Accessibility

Readable Card Information

Large Font

Screen Reader

Touch Area ≥48dp

---

# 24. Test Cases

✓ Add Card.

✓ Remove Card.

✓ Set Default.

✓ Gateway Offline.

✓ Invalid Token.

✓ Retry.

---

# 25. Acceptance Criteria

✓ Token lưu đúng.

✓ Không lưu dữ liệu nhạy cảm.

✓ Đồng bộ Checkout.

✓ Audit Log đầy đủ.

✓ Không crash.

---

# 26. Related Documents

Payment Module

Payment Security

Checkout

Profile Security

Account Settings

---

# 27. Future Expansion

Apple Pay

Google Pay

PayPal

Corporate Wallet

Installment Payment

Cryptocurrency (nếu hỗ trợ)

---

# 28. Summary

Saved Payment Methods giúp người dùng quản lý các phương thức thanh toán đã liên kết với tài khoản BusZ bằng cơ chế token hóa, đảm bảo thanh toán nhanh chóng, thuận tiện và đáp ứng các yêu cầu bảo mật hiện đại.