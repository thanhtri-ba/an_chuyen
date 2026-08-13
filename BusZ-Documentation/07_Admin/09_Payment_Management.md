# Payment Management

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Admin Web

Document ID

ADM-009

Priority

Critical

Version

1.0

---

# 1. Purpose

Payment Management cho phép quản trị viên quản lý toàn bộ giao dịch thanh toán trong hệ thống BusZ.

Bao gồm:

- Quản lý giao dịch
- Theo dõi trạng thái
- Đối soát giao dịch
- Quản lý hoàn tiền
- Webhook Log
- Báo cáo doanh thu
- Kiểm toán giao dịch

---

# 2. User Flow

```text
Dashboard

↓

Payments

↓

Search Payment

↓

Payment Detail

↓

Refund

↓

Complete
```

---

# 3. Payment List

Hiển thị

- Payment ID
- Transaction ID
- Booking Code
- Customer
- Payment Method
- Amount
- Currency
- Status
- Paid Time

---

# 4. Search

Theo

```text
Payment ID

Transaction ID

Booking Code

Customer Name
```

Search Delay

```text
300ms
```

---

# 5. Filters

Theo

```text
Payment Method

Status

Date Range

Amount Range

Gateway
```

---

# 6. Payment Detail

Hiển thị

### Booking

```text
Booking Code

Trip

Passenger
```

### Payment

```text
Amount

Currency

Method

Gateway

Transaction ID

Gateway Response

Paid Time
```

---

# 7. Payment Status

```text
PENDING

PROCESSING

SUCCESS

FAILED

CANCELLED

REFUNDED

PARTIALLY_REFUNDED

EXPIRED
```

---

# 8. Payment Methods

Hỗ trợ

```text
VNPay

MoMo

ZaloPay

Stripe

PayPal

Credit Card

Debit Card

Cash
```

---

# 9. Refund Management

Thông tin

```text
Refund ID

Refund Amount

Reason

Approved By

Refund Time

Status
```

Trạng thái

```text
Pending

Approved

Rejected

Completed

Failed
```

---

# 10. Reconciliation

Đối chiếu

```text
Internal Transaction

↓

Payment Gateway

↓

Matched

↓

Completed
```

Hiển thị

- Sai lệch
- Thiếu giao dịch
- Trùng giao dịch

---

# 11. Webhook Log

Hiển thị

```text
Webhook ID

Gateway

Event Type

Received Time

Status

Retry Count
```

Cho phép

```text
Replay Webhook
```

---

# 12. Failed Payments

Hiển thị

- Lý do lỗi
- Gateway Response
- Retry Count

Cho phép

```text
Retry Verification

Mark as Reviewed
```

---

# 13. Revenue Summary

Hiển thị

```text
Daily Revenue

Monthly Revenue

Annual Revenue

Refund Amount

Net Revenue
```

Biểu đồ

```text
Line Chart

Bar Chart
```

---

# 14. Export

Định dạng

```text
Excel

CSV

PDF
```

Bao gồm

- Payments
- Refunds
- Revenue

---

# 15. Bulk Actions

Cho phép

```text
Export

Approve Refund

Reject Refund

Resend Receipt
```

---

# 16. API Integration

```text
GET /admin/payments

GET /admin/payments/{id}

GET /admin/payments/reconciliation

GET /admin/payments/webhooks

POST /admin/payments/{id}/refund

POST /admin/payments/webhooks/replay
```

---

# 17. Component Tree

```text
PaymentManagementPage

↓

SearchBox

↓

FilterBar

↓

PaymentTable

↓

PaymentDetailDrawer

↓

RefundPanel

↓

RevenueDashboard

↓

WebhookLogTable
```

---

# 18. Performance

Payment List

```text
<200ms
```

Revenue Report

```text
<500ms
```

Webhook Replay

```text
<2s
```

---

# 19. UX Guidelines

✓ Trạng thái giao dịch hiển thị màu sắc rõ ràng.

✓ Transaction ID có thể sao chép nhanh.

✓ Hiển thị Gateway Response để hỗ trợ xử lý lỗi.

✓ Cảnh báo trước khi hoàn tiền.

✓ Hỗ trợ tìm kiếm nhanh theo Booking Code.

---

# 20. Test Cases

✓ Search Payment.

✓ Filter Payment.

✓ Refund Payment.

✓ Reconciliation.

✓ Webhook Replay.

✓ Revenue Report.

✓ Export Excel.

✓ Failed Payment Review.

---

# 21. Acceptance Criteria

✓ Danh sách giao dịch chính xác.

✓ Refund hoạt động.

✓ Reconciliation thành công.

✓ Revenue Dashboard chính xác.

✓ Export đầy đủ.

✓ Audit Log được ghi nhận.

---

# 22. Related Documents

ADM-008 Booking Management

ADM-011 Report Analytics

APP-008 Payment Module

API-008 Payment API

---

# 23. Summary

Payment Management là module quản lý tài chính của BusZ Admin, cho phép theo dõi toàn bộ giao dịch thanh toán, xử lý hoàn tiền, đối soát với cổng thanh toán, quản lý Webhook và tạo các báo cáo doanh thu. Module này hỗ trợ đội Finance và Super Admin kiểm soát dòng tiền một cách minh bạch và chính xác.