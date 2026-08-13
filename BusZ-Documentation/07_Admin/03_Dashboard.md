# Dashboard

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Admin Web

Document ID

ADM-003

Priority

Critical

Version

1.0

---

# 1. Purpose

Dashboard là màn hình đầu tiên sau khi Admin đăng nhập.

Mục tiêu:

- Theo dõi tình trạng hệ thống
- Hiển thị KPI quan trọng
- Phát hiện sự cố nhanh
- Hỗ trợ ra quyết định

---

# 2. Dashboard Layout

```text
Header

↓

KPI Cards

↓

Revenue Chart

↓

Booking Chart

↓

Top Routes

↓

Top Bus Companies

↓

Recent Activities

↓

System Health

↓

Footer
```

---

# 3. KPI Cards

Hiển thị

```text
Today's Revenue

Today's Bookings

Active Trips

Active Users

Pending Refunds

Unread Notifications
```

---

# 4. Revenue Widget

Biểu đồ

```text
Line Chart
```

Hiển thị

```text
Daily

Weekly

Monthly

Yearly
```

Thông tin

- Doanh thu
- Tăng trưởng
- So sánh kỳ trước

---

# 5. Booking Widget

Hiển thị

```text
Completed

Pending

Cancelled

Refunded
```

Dạng

```text
Donut Chart
```

---

# 6. Popular Routes

Top

```text
10
```

tuyến xe

Hiển thị

- Tuyến
- Lượt đặt
- Doanh thu
- Tỷ lệ lấp đầy

---

# 7. Bus Company Ranking

Hiển thị

```text
Top 10
```

Thông tin

- Nhà xe
- Tổng chuyến
- Tổng doanh thu
- Đánh giá

---

# 8. Live Trip Monitor

Hiển thị

- Chuyến đang chạy
- Chuyến sắp khởi hành
- Chuyến bị trễ
- Chuyến đã hoàn thành

Làm mới

```text
30 giây
```

---

# 9. Recent Activities

Hiển thị

```text
New Booking

Payment

Refund

Promotion Created

User Registered

Trip Cancelled
```

---

# 10. Notification Center

Hiển thị

- Thông báo hệ thống
- Cảnh báo lỗi
- Pending Approval

---

# 11. System Health

Theo dõi

```text
API

Database

Redis

Queue

Storage

Payment Gateway
```

Trạng thái

```text
Healthy

Warning

Critical
```

---

# 12. Filters

Theo

```text
Today

Yesterday

Last 7 Days

Last 30 Days

Custom Range
```

---

# 13. Export Dashboard

Định dạng

```text
PDF

Excel

CSV
```

Bao gồm

- KPI
- Charts
- Tables

---

# 14. Realtime Update

Sử dụng

```text
WebSocket

hoặc

Supabase Realtime
```

Cập nhật

- Booking mới
- Thanh toán
- Chuyến xe
- Thông báo

---

# 15. Dashboard Widgets

Có thể bật/tắt

```text
Revenue

Bookings

Trips

Users

Payments

Reports
```

Lưu theo từng Admin.

---

# 16. Responsive Layout

Desktop

```text
4 cột
```

Tablet

```text
2 cột
```

Mobile

```text
1 cột
```

---

# 17. State Management

Global

```text
DashboardStore
```

Data

```text
TanStack Query
```

---

# 18. API Integration

```text
GET /admin/dashboard

GET /admin/dashboard/revenue

GET /admin/dashboard/bookings

GET /admin/dashboard/system-health

GET /admin/dashboard/activities
```

---

# 19. Component Tree

```text
DashboardPage

↓

FilterBar

↓

KpiCards

↓

RevenueChart

↓

BookingChart

↓

TopRoutesTable

↓

BusCompanyRanking

↓

RecentActivity

↓

SystemHealthCard
```

---

# 20. Performance

Dashboard Load

```text
<2s
```

Realtime Update

```text
<1s
```

Export PDF

```text
<5s
```

---

# 21. UX Guidelines

✓ KPI nổi bật.

✓ Màu sắc cảnh báo rõ ràng.

✓ Biểu đồ dễ đọc.

✓ Hỗ trợ Dark Mode.

✓ Không tải lại toàn bộ Dashboard khi chỉ một Widget thay đổi.

---

# 22. Test Cases

✓ Dashboard Load.

✓ KPI Update.

✓ Revenue Chart.

✓ Booking Chart.

✓ Realtime Booking.

✓ Export PDF.

✓ Export Excel.

✓ Widget Customization.

---

# 23. Acceptance Criteria

✓ Dashboard tải thành công.

✓ KPI chính xác.

✓ Realtime hoạt động.

✓ Export thành công.

✓ Responsive.

✓ Widget lưu theo người dùng.

---

# 24. Related Documents

ADM-002 Authentication

ADM-004 User Management

ADM-011 Report Analytics

---

# 25. Summary

Dashboard của BusZ là trung tâm điều hành dành cho quản trị viên, cung cấp các KPI quan trọng, biểu đồ phân tích, theo dõi chuyến xe theo thời gian thực và tình trạng hệ thống. Giao diện hỗ trợ tùy biến theo vai trò và giúp quản trị viên đưa ra quyết định nhanh chóng dựa trên dữ liệu cập nhật.