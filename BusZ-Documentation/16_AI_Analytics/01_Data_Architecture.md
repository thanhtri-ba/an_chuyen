# Data Architecture

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

AI & Analytics

Document ID

AI-001

Priority

Critical

Version

1.0

---

# 1. Purpose

Data Architecture định nghĩa kiến trúc dữ liệu tổng thể của BusZ nhằm phục vụ:

- Business Intelligence
- Machine Learning
- Reporting
- Real-time Analytics
- Decision Support

---

# 2. Data Architecture Overview

```text
Flutter App

React Admin

↓

Backend API

↓

Operational Database

↓

CDC / ETL

↓

Data Warehouse

↓

BI

Machine Learning

Reports
```

---

# 3. Data Sources

Nguồn dữ liệu

```text
Booking

Payments

Trips

Routes

Users

Companies

Notifications

Audit Logs
```

---

# 4. Operational Database

Sử dụng

```text
PostgreSQL
```

Lưu

```text
Transactional Data

Real-time Operations
```

Không dùng trực tiếp cho BI.

---

# 5. Data Warehouse

Mục đích

```text
Analytics

Dashboards

Machine Learning

Historical Reports
```

Có thể sử dụng

```text
BigQuery

Snowflake

Amazon Redshift

ClickHouse
```

---

# 6. Data Lake (Future)

Lưu

```text
Raw Logs

Images

GPS

ML Training Data

Clickstream
```

---

# 7. Data Pipeline

```text
Operational DB

↓

CDC / ETL

↓

Transform

↓

Data Warehouse

↓

Analytics
```

---

# 8. Data Domains

```text
Customer

Booking

Trip

Payment

Company

Vehicle

Route

Finance

Operations
```

---

# 9. Fact Tables

Ví dụ

```text
FactBooking

FactPayment

FactTrip

FactRevenue

FactSearch
```

---

# 10. Dimension Tables

```text
DimCustomer

DimRoute

DimCompany

DimVehicle

DimDate

DimLocation

DimPromotion
```

---

# 11. Data Flow

```text
User Action

↓

Backend API

↓

PostgreSQL

↓

ETL

↓

Warehouse

↓

Dashboard
```

---

# 12. Data Quality

Kiểm tra

```text
Completeness

Accuracy

Consistency

Uniqueness

Timeliness
```

---

# 13. Data Governance

Quản lý

```text
Ownership

Classification

Retention

Access Control

Audit
```

---

# 14. Data Security

Áp dụng

```text
Encryption

RBAC

Masking

Audit Logs
```

---

# 15. Metadata

Theo dõi

```text
Table

Columns

Owner

Description

Refresh Time
```

---

# 16. Historical Data

Lưu

```text
5 Years

10 Years (Finance)

7 Years (Audit)
```

---

# 17. Data Consumers

```text
Business Analysts

Management

Data Scientists

Machine Learning

Finance

Operations
```

---

# 18. Performance Targets

ETL Delay

```text
<15 Minutes
```

Warehouse Query

```text
<5 Seconds
```

Dashboard Refresh

```text
<30 Seconds
```

---

# 19. Acceptance Criteria

✓ Data Pipeline hoạt động.

✓ Warehouse cập nhật.

✓ Data Quality đạt chuẩn.

✓ Metadata đầy đủ.

✓ Dashboard sử dụng Warehouse.

✓ Audit đầy đủ.

---

# 20. Related Documents

AI-002 Data Warehouse

AI-003 ETL Pipeline

OPS-016 Database Operations

ADM-011 Report Analytics

---

# 21. Summary

Data Architecture của BusZ tách biệt dữ liệu vận hành và dữ liệu phân tích bằng cách sử dụng PostgreSQL cho giao dịch và Data Warehouse cho BI/AI. Kiến trúc này hỗ trợ mở rộng trong tương lai với Data Lake, Machine Learning và Real-time Analytics, đồng thời đảm bảo chất lượng, bảo mật và khả năng quản trị dữ liệu.