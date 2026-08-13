# Promotion Management

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Admin Web

Document ID

ADM-010

Priority

High

Version

1.0

---

# 1. Purpose

Promotion Management cho phép quản trị viên tạo, quản lý và theo dõi toàn bộ chương trình khuyến mãi trong hệ thống BusZ.

Bao gồm:

- Mã giảm giá
- Chiến dịch khuyến mãi
- Voucher
- Flash Sale
- Điều kiện áp dụng
- Ngân sách khuyến mãi
- Báo cáo hiệu quả

---

# 2. User Flow

```text
Dashboard

↓

Promotions

↓

Create Promotion

↓

Configure Rules

↓

Publish

↓

Monitor Performance
```

---

# 3. Promotion List

Hiển thị

- Promotion ID
- Promotion Name
- Code
- Type
- Discount
- Status
- Start Date
- End Date
- Usage

---

# 4. Search

Theo

```text
Promotion ID

Promotion Name

Promo Code

Campaign
```

Search Delay

```text
300ms
```

---

# 5. Filters

Theo

```text
Promotion Type

Status

Campaign

Date Range

Company
```

---

# 6. Promotion Types

```text
Coupon Code

Percentage Discount

Fixed Amount

Free Ticket

Flash Sale

Member Promotion

First Booking

Seasonal Promotion
```

---

# 7. Create Promotion

Thông tin

```text
Promotion Name

Promotion Code

Description

Promotion Type

Discount Value

Maximum Discount

Budget
```

---

# 8. Validity

Thiết lập

```text
Start Date

End Date

Timezone

Activation Schedule
```

Tự động

```text
Activate

Deactivate
```

---

# 9. Conditions

Có thể cấu hình

```text
Minimum Booking Amount

Maximum Discount

Applicable Routes

Applicable Companies

Applicable Users

First Booking Only

Membership Level
```

---

# 10. Usage Limits

Thiết lập

```text
Global Usage

Per User

Per Day

Per Campaign
```

---

# 11. Customer Segments

Áp dụng cho

```text
All Users

New Users

Returning Users

VIP Members

Corporate Accounts
```

---

# 12. Flash Sale

Thông tin

```text
Start Time

End Time

Available Quantity

Remaining Quantity
```

Hiển thị đồng hồ đếm ngược.

---

# 13. Campaign Management

Hiển thị

```text
Campaign Name

Status

Budget

Revenue

Conversion Rate
```

---

# 14. Performance Analytics

Theo dõi

```text
Usage Count

Revenue Impact

Conversion Rate

Average Discount

ROI
```

---

# 15. Auto Rules

Tự động

```text
Enable Promotion

Disable Promotion

Expire Promotion

Notify Admin
```

---

# 16. Export

Định dạng

```text
Excel

CSV

PDF
```

Bao gồm

- Promotion List
- Usage Statistics
- Campaign Report

---

# 17. API Integration

```text
GET /admin/promotions

GET /admin/promotions/{id}

POST /admin/promotions

PATCH /admin/promotions/{id}

DELETE /admin/promotions/{id}

GET /admin/promotions/analytics
```

---

# 18. Component Tree

```text
PromotionManagementPage

↓

SearchBox

↓

FilterBar

↓

PromotionTable

↓

PromotionForm

↓

ConditionBuilder

↓

CampaignDashboard

↓

AnalyticsChart
```

---

# 19. Performance

Promotion List

```text
<200ms
```

Analytics Load

```text
<500ms
```

Export

```text
<5s
```

---

# 20. UX Guidelines

✓ Hiển thị trạng thái khuyến mãi bằng màu sắc.

✓ Cho phép xem trước điều kiện áp dụng.

✓ Cảnh báo khi vượt ngân sách.

✓ Đồng hồ đếm ngược cho Flash Sale.

✓ Hiển thị tỷ lệ sử dụng theo thời gian thực.

---

# 21. Test Cases

✓ Create Promotion.

✓ Edit Promotion.

✓ Delete Promotion.

✓ Flash Sale.

✓ Usage Limit.

✓ Customer Segment.

✓ Analytics.

✓ Export Report.

---

# 22. Acceptance Criteria

✓ CRUD hoạt động.

✓ Auto Activation hoạt động.

✓ Usage Limit chính xác.

✓ Analytics chính xác.

✓ Export thành công.

✓ Audit Log đầy đủ.

---

# 23. Related Documents

ADM-009 Payment Management

ADM-011 Report Analytics

APP-006 Search Module

API-010 Promotion API

---

# 24. Summary

Promotion Management là module dành cho đội Marketing và Business của BusZ, hỗ trợ tạo và quản lý các chương trình khuyến mãi, voucher và chiến dịch marketing. Hệ thống cung cấp khả năng thiết lập điều kiện linh hoạt, giới hạn sử dụng, phân tích hiệu quả và tự động kích hoạt hoặc kết thúc chương trình theo thời gian.