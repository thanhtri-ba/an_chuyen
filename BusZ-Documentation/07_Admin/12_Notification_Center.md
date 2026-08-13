# Notification Center

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Admin Web

Document ID

ADM-012

Priority

High

Version

1.0

---

# 1. Purpose

Notification Center là trung tâm quản lý và gửi thông báo của hệ thống BusZ.

Bao gồm:

- Push Notification
- Email Notification
- SMS Notification
- In-App Notification
- Broadcast Message
- Scheduled Notification
- Notification Template
- Delivery Tracking

---

# 2. User Flow

```text
Dashboard

↓

Notification Center

↓

Create Notification

↓

Select Audience

↓

Preview

↓

Send

↓

Track Delivery
```

---

# 3. Notification List

Hiển thị

- Notification ID
- Title
- Type
- Channel
- Audience
- Created By
- Status
- Sent Time

---

# 4. Search

Theo

```text
Notification ID

Title

Campaign

Created By
```

Search Delay

```text
300ms
```

---

# 5. Filters

Theo

```text
Channel

Status

Audience

Date

Priority
```

---

# 6. Notification Channels

```text
Push Notification

Email

SMS

In-App

Webhook (Optional)
```

Có thể gửi đồng thời nhiều kênh.

---

# 7. Notification Types

```text
Booking

Payment

Trip Update

Promotion

Reminder

System

Emergency
```

---

# 8. Create Notification

Thông tin

```text
Title

Message

Image

Priority

Channel

Audience
```

---

# 9. Audience Selection

Gửi tới

```text
All Users

Selected Users

Bus Companies

Routes

Customer Segments

VIP Members

Internal Staff
```

---

# 10. Templates

Quản lý

```text
Booking Confirmation

Payment Success

Trip Delayed

Trip Cancelled

Promotion

Refund Completed

System Maintenance
```

Cho phép

```text
Create

Edit

Duplicate

Archive
```

---

# 11. Scheduling

Hỗ trợ

```text
Send Now

Schedule Later

Recurring
```

Lặp lại

```text
Daily

Weekly

Monthly
```

---

# 12. Personalization

Biến động

```text
{{customer_name}}

{{booking_code}}

{{trip_name}}

{{departure_time}}

{{discount_code}}
```

---

# 13. Delivery Status

```text
Queued

Sending

Delivered

Opened

Clicked

Failed

Expired
```

---

# 14. Retry Strategy

Nếu gửi thất bại

↓

```text
Retry 3 Times
```

Delay

```text
1 min

5 min

15 min
```

---

# 15. Analytics

Theo dõi

```text
Sent

Delivered

Opened

Clicked

Failed

CTR

Open Rate
```

---

# 16. Notification History

Hiển thị

```text
Sent Time

Sender

Audience

Status

Total Recipients

Success Rate
```

---

# 17. API Integration

```text
GET /admin/notifications

POST /admin/notifications

PATCH /admin/notifications/{id}

GET /admin/notifications/templates

POST /admin/notifications/send

GET /admin/notifications/analytics
```

---

# 18. Component Tree

```text
NotificationCenterPage

↓

SearchBox

↓

FilterBar

↓

NotificationTable

↓

NotificationEditor

↓

AudienceSelector

↓

TemplateLibrary

↓

AnalyticsDashboard
```

---

# 19. Performance

Notification List

```text
<200ms
```

Bulk Send

```text
<3s
```

Analytics

```text
<500ms
```

---

# 20. UX Guidelines

✓ Hỗ trợ xem trước (Preview).

✓ Hiển thị tiến trình gửi.

✓ Cảnh báo khi gửi đến số lượng lớn.

✓ Cho phép lưu bản nháp.

✓ Tìm kiếm mẫu nhanh.

---

# 21. Test Cases

✓ Create Notification.

✓ Schedule Notification.

✓ Bulk Send.

✓ Retry Failed.

✓ Template.

✓ Analytics.

✓ Personalization.

✓ Audience Filter.

---

# 22. Acceptance Criteria

✓ Gửi thông báo thành công.

✓ Template hoạt động.

✓ Analytics chính xác.

✓ Retry hoạt động.

✓ Schedule hoạt động.

✓ Audit Log đầy đủ.

---

# 23. Related Documents

ADM-010 Promotion Management

ADM-011 Report Analytics

APP-011 Notification Module

APP-015 Push Notification

API-010 Notification API

---

# 24. Summary

Notification Center là trung tâm giao tiếp của BusZ Admin, hỗ trợ gửi thông báo qua nhiều kênh như Push, Email, SMS và In-App. Hệ thống cung cấp khả năng lập lịch, cá nhân hóa nội dung, quản lý mẫu thông báo và theo dõi hiệu quả gửi nhằm nâng cao chất lượng tương tác với khách hàng và đối tác.