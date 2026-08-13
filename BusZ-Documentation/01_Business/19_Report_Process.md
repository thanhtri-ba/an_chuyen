# Report Process

Project: BusZ - Intercity Bus Ticket Booking Platform

Version: 1.0

Document Type: Business Process

Module: Reporting & Analytics

Priority: High

Status: Draft

---

# 1. Purpose

Tài liệu này mô tả toàn bộ quy trình báo cáo và thống kê (Reporting & Analytics) trong hệ thống BusZ.

Module Report giúp:

- Theo dõi hoạt động kinh doanh.
- Theo dõi doanh thu.
- Phân tích hành khách.
- Phân tích chuyến xe.
- Hỗ trợ nhà xe ra quyết định.
- Hỗ trợ quản trị hệ thống.

---

# 2. Scope

Áp dụng cho:

- Admin Website
- Bus Company Portal
- Backend API
- Database
- Dashboard

---

# 3. Business Goal

Hệ thống phải cung cấp báo cáo theo thời gian thực và báo cáo tổng hợp theo ngày, tuần, tháng, quý, năm.

---

# 4. Actors

Primary

Administrator

Bus Company Manager

Secondary

Backend

Database

Analytics Service

---

# 5. Report Categories

Dashboard Overview

Revenue Report

Booking Report

Trip Report

Passenger Report

Payment Report

Refund Report

Promotion Report

Review Report

Loyalty Report

System Report

Audit Report

---

# 6. Dashboard Overview

Hiển thị nhanh:

Total Users

Total Bus Companies

Total Trips

Total Bookings

Completed Trips

Revenue Today

Revenue This Month

Occupancy Rate

Cancellation Rate

Refund Rate

---

# 7. Revenue Report

Theo:

Ngày

Tuần

Tháng

Quý

Năm

Theo:

Bus Company

Route

Trip

Payment Method

---

# 8. Booking Report

Thống kê:

Booking Created

Booking Confirmed

Booking Cancelled

Booking Refunded

Booking Completed

No Show

---

# 9. Trip Report

Thống kê:

Total Trips

Completed Trips

Cancelled Trips

Delayed Trips

Average Occupancy

Average Duration

Most Popular Route

---

# 10. Passenger Report

Theo dõi:

Passenger Count

New Passenger

Returning Passenger

Top Customer

Frequent Traveler

---

# 11. Payment Report

Theo:

VNPay

MoMo

ZaloPay

Thống kê:

Success

Failed

Pending

Refund

---

# 12. Refund Report

Refund Count

Refund Amount

Refund Rate

Refund Reason

Average Refund Time

---

# 13. Promotion Report

Promotion Usage

Coupon Usage

Discount Amount

Conversion Rate

Top Promotion

---

# 14. Loyalty Report

Point Earned

Point Redeemed

Membership Level

Top Members

Expired Points

---

# 15. Review Report

Average Rating

Review Count

Positive Review

Negative Review

Most Reviewed Route

Top Rated Company

---

# 16. System Report

CPU Usage

Memory Usage

API Requests

API Errors

Database Performance

Storage Usage

---

# 17. Report Flow

```mermaid
flowchart TD

Business Data

-->

Database

-->

Analytics Engine

-->

Generate Report

-->

Dashboard

-->

Export PDF

-->

Export Excel
```

---

# 18. Report Filters

Date Range

Bus Company

Route

Trip

Driver

Payment Method

Booking Status

Trip Status

Customer

---

# 19. Export

Cho phép xuất:

PDF

Excel

CSV

Future

Power BI

API

---

# 20. Database Tables

report_jobs

report_templates

report_exports

bookings

payments

refunds

trips

users

reviews

loyalty_transactions

activity_logs

---

# 21. APIs

GET /reports/dashboard

GET /reports/revenue

GET /reports/bookings

GET /reports/trips

GET /reports/payments

GET /reports/refunds

GET /reports/export

---

# 22. Security

Admin

Toàn quyền.

Manager

Chỉ xem dữ liệu công ty mình.

Staff

Không xem báo cáo tài chính.

---

# 23. Logging

Report Generated

Report Exported

Dashboard Viewed

Filter Applied

---

# 24. Performance

Dashboard

< 3 giây

Export PDF

< 30 giây

Export Excel

< 20 giây

---

# 25. Acceptance Criteria

✓ Dashboard hiển thị đúng.

✓ Doanh thu chính xác.

✓ Bộ lọc hoạt động.

✓ Xuất PDF thành công.

✓ Xuất Excel thành công.

✓ Phân quyền chính xác.

---

# 26. Future Expansion

Predictive Analytics

AI Dashboard

Real-time Analytics

Power BI Integration

Grafana Dashboard

Scheduled Reports

Email Reports

KPI Dashboard

---

# 27. Related Documents

Booking Process

Payment Process

Refund Process

Trip Process

Bus Company Process

Database Design

API Specification

---

# 28. Summary

Report Process cung cấp hệ thống báo cáo và phân tích toàn diện cho BusZ, hỗ trợ nhà xe và quản trị viên theo dõi hiệu quả kinh doanh, vận hành và chất lượng dịch vụ thông qua các chỉ số trực quan và dữ liệu tổng hợp.