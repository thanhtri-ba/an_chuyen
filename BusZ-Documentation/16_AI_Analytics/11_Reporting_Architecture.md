# Reporting Architecture

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

AI & Analytics

Document ID

AI-011

Priority

Critical

Version

1.0

---

# 1. Purpose

Reporting Architecture định nghĩa kiến trúc báo cáo của BusZ nhằm cung cấp dữ liệu chính xác, nhất quán và trực quan cho Ban điều hành, Nhà xe, Bộ phận vận hành và các phòng ban thông qua hệ thống Dashboard và Reporting.

Mục tiêu

- Chuẩn hóa Reporting
- Chuẩn hóa Dashboard
- Chuẩn hóa KPI
- Hỗ trợ Decision Making
- Hỗ trợ AI Analytics

---

# 2. Objectives

```text
Reporting

Dashboards

Business KPIs

Operational KPIs

Executive Analytics
```

---

# 3. Reporting Architecture

```text
Operational Database

↓

ETL Pipeline

↓

Data Warehouse

↓

Semantic Layer

↓

Reporting Engine

↓

Dashboards

↓

Export
```

---

# 4. Reporting Layers

```text
Raw Data

↓

Data Warehouse

↓

Semantic Layer

↓

Business Metrics

↓

Visualization
```

---

# 5. Data Sources

```text
Bookings

Payments

Trips

Vehicles

Routes

Companies

Drivers

Customers

Reviews

Promotions
```

---

# 6. Semantic Layer

Định nghĩa

```text
Business Metrics

Calculated Fields

KPIs

Dimensions

Measures
```

---

# 7. Dashboard Categories

```text
Executive

Finance

Operations

Customer

Marketing

Company

Support
```

---

# 8. Executive Reports

```text
Revenue

Bookings

Growth

Occupancy

Profit

Market Share

Forecast

Top Companies
```

---

# 9. Finance Reports

```text
Revenue

Refund

Commission

Profit

Cash Flow

Outstanding Payments

Tax Summary
```

---

# 10. Operations Reports

```text
Trips

Drivers

Vehicles

On-Time Rate

Delayed Trips

Cancelled Trips

Seat Occupancy
```

---

# 11. Customer Reports

```text
Active Users

Retention

CLV

Reviews

Booking Frequency

Segments

NPS
```

---

# 12. Marketing Reports

```text
Campaign Performance

Promotion Usage

CAC

ROI

Referral

Conversion Rate
```

---

# 13. Visualization Types

```text
KPI Card

Bar Chart

Line Chart

Area Chart

Pie Chart

Heatmap

Geo Map

Table

Pivot Table
```

---

# 14. Drill-down

Cho phép

```text
Year

↓

Quarter

↓

Month

↓

Week

↓

Day

↓

Hour
```

---

# 15. Report Scheduling

```text
Daily

Weekly

Monthly

Quarterly

Yearly
```

---

# 16. Export Formats

```text
PDF

Excel

CSV

PowerPoint

JSON
```

---

# 17. Delivery Channels

```text
Dashboard

Email

Webhook

API

Scheduled Report
```

---

# 18. Performance Targets

```text
Dashboard

<3 Seconds

Report Generation

<30 Seconds

Export

<60 Seconds
```

---

# 19. Security

```text
RBAC

Data Masking

Audit Logs

Report Permissions

Encryption
```

---

# 20. Acceptance Criteria

✓ Dashboard đầy đủ

✓ KPI chuẩn hóa

✓ Semantic Layer

✓ Export hoạt động

✓ Scheduled Reports

✓ Role-based Reports

---

# 21. Related Documents

AI-002 Data Warehouse

AI-003 ETL Pipeline

AI-005 Business Intelligence

ADM-011 Analytics Reports

OPS-017 Monitoring

---

# 22. Summary

Reporting Architecture của BusZ xây dựng một hệ thống báo cáo tập trung dựa trên Data Warehouse và Semantic Layer nhằm cung cấp Dashboard, KPI và báo cáo đa chiều cho Ban điều hành và các bộ phận nghiệp vụ. Kiến trúc này giúp dữ liệu nhất quán, dễ mở rộng và hỗ trợ ra quyết định dựa trên dữ liệu theo chuẩn enterprise.