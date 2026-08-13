# Payment Module

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Flutter Mobile App

Document ID

APP-008

Priority

Critical

Version

1.0

---

# 1. Purpose

Payment Module quản lý toàn bộ trải nghiệm thanh toán của người dùng.

Bao gồm:

- Chọn phương thức thanh toán
- Xem chi tiết đơn hàng
- Thanh toán trực tuyến
- Theo dõi trạng thái
- Nhận hóa đơn
- Chuyển sang vé điện tử

---

# 2. Payment Flow

```text
Booking Summary

↓

Payment Method

↓

Payment Confirmation

↓

Payment Gateway

↓

Payment Result

↓

Ticket
```

---

# 3. Payment Screen Layout

```text
AppBar

↓

Booking Summary

↓

Payment Methods

↓

Promotion Summary

↓

Price Breakdown

↓

Agreement

↓

Pay Button
```

---

# 4. Booking Summary

Hiển thị

- Nhà xe
- Tuyến đường
- Ngày đi
- Giờ khởi hành
- Ghế đã chọn
- Hành khách

---

# 5. Payment Methods

Hỗ trợ

```text
VNPay

MoMo

ZaloPay

Stripe

PayPal

Credit Card

Debit Card

Cash at Counter
```

Mỗi phương thức hiển thị

- Logo
- Tên
- Mô tả ngắn

---

# 6. Price Breakdown

Hiển thị

```text
Ticket Price

↓

Discount

↓

Service Fee

↓

VAT

↓

Total Amount
```

---

# 7. Promotion Summary

Hiển thị

```text
Promotion Code

Discount

Final Amount
```

Button

```text
Change Promotion
```

---

# 8. Agreement

Checkbox

```text
I agree to the Terms & Conditions

I agree to the Privacy Policy
```

Phải được chọn trước khi thanh toán.

---

# 9. Payment Countdown

Hiển thị

```text
Time Remaining

14:59
```

Nếu hết thời gian

↓

Booking Expired

↓

Quay lại Booking.

---

# 10. Payment Gateway

Nếu Payment Provider yêu cầu

↓

WebView

hoặc

↓

Deep Link

Ví dụ

```text
MoMo

VNPay

ZaloPay
```

---

# 11. Payment Result

Success

```text
Payment Successful
```

↓

Navigate

```text
Ticket
```

---

Failed

```text
Payment Failed
```

Buttons

```text
Retry

Choose Another Method
```

---

Cancelled

```text
Payment Cancelled
```

↓

Back to Payment Screen

---

# 12. Payment Status

```text
Pending

Processing

Success

Failed

Cancelled

Expired

Refunded
```

---

# 13. Electronic Receipt

Sau khi thanh toán

↓

Hiển thị

- Payment ID
- Transaction ID
- Amount
- Payment Method
- Paid Time

Buttons

```text
Download PDF

Share

View Ticket
```

---

# 14. Loading State

Skeleton

- Payment Method
- Summary
- Total

Progress Indicator

↓

Processing Payment

---

# 15. Error State

Ví dụ

```text
Payment gateway unavailable.
```

Buttons

```text
Retry

Back
```

---

# 16. Offline Mode

Không cho phép

- Thanh toán
- Tạo Payment

Hiển thị

```text
Internet connection required.
```

---

# 17. State Management

Cubit

```text
PaymentCubit
```

States

```text
PaymentInitial

PaymentLoading

PaymentPending

PaymentSuccess

PaymentFailed

PaymentCancelled

PaymentExpired

PaymentError
```

---

# 18. API Integration

```text
POST /payments

GET /payments/{id}

GET /payments/status/{bookingId}
```

Webhook cập nhật trạng thái từ Backend.

---

# 19. Component Tree

```text
PaymentScreen

↓

BookingSummaryCard

↓

PaymentMethodList

↓

PromotionSummary

↓

PriceBreakdown

↓

AgreementCheckbox

↓

CountdownTimer

↓

BottomActionBar
```

---

# 20. UX Guidelines

✓ Hiển thị rõ tổng tiền.

✓ Cho phép đổi phương thức thanh toán.

✓ Không mất dữ liệu khi quay lại.

✓ Hiển thị tiến trình khi chuyển sang cổng thanh toán.

✓ Tự động kiểm tra trạng thái nếu người dùng quay lại ứng dụng.

✓ Cảnh báo khi còn dưới 2 phút.

---

# 21. Performance

Load Payment

```text
<100ms
```

Payment Redirect

```text
<1s
```

Status Update

```text
<2s
```

---

# 22. Test Cases

✓ Payment Success.

✓ Payment Failed.

✓ Payment Cancelled.

✓ Countdown Expired.

✓ Change Payment Method.

✓ Retry Payment.

✓ Receipt Display.

✓ Webhook Update.

---

# 23. Acceptance Criteria

✓ Payment thành công.

✓ Webhook cập nhật đúng.

✓ Receipt hiển thị chính xác.

✓ Countdown hoạt động.

✓ Deep Link quay lại App.

✓ Không tạo Payment trùng.

---

# 24. Related Documents

APP-007 Booking Module

APP-009 Ticket Module

API-008 Payment API

API-018 Webhook API

---

# 25. Summary

Payment Module của BusZ cung cấp trải nghiệm thanh toán an toàn và liền mạch, hỗ trợ nhiều cổng thanh toán, đồng bộ trạng thái theo thời gian thực qua Webhook, hiển thị hóa đơn điện tử và đảm bảo người dùng có thể hoàn tất giao dịch một cách nhanh chóng và đáng tin cậy.