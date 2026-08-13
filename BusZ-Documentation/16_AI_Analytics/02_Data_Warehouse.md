# Data Warehouse

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

AI & Analytics

Document ID

AI-002

Priority

Critical

Version

1.0

---

# 1. Purpose

Data Warehouse định nghĩa kiến trúc kho dữ liệu phân tích của BusZ nhằm phục vụ Business Intelligence, Dashboard, Machine Learning và Historical Analytics.

Mục tiêu

- Chuẩn hóa Data Warehouse
- Hỗ trợ BI
- Hỗ trợ Machine Learning
- Tăng hiệu năng truy vấn
- Hỗ trợ AI Code Generation

---

# 2. Objectives

```text
Analytics

Business Intelligence

Historical Data

Machine Learning

Reporting
```

---

# 3. Architecture

```text
Operational Database

↓

ETL / CDC

↓

Data Warehouse

↓

BI

↓

Machine Learning

↓

Reports
```

---

# 4. Supported Platforms

```text
Google BigQuery

Snowflake

Amazon Redshift

ClickHouse
```

---

# 5. Warehouse Layers

```text
Raw Layer

↓

Staging Layer

↓

Core Layer

↓

Data Mart

↓

Dashboard
```

---

# 6. Raw Layer

Lưu

```text
Original Data

CDC

API Data

CSV Import

External Sources
```

---

# 7. Staging Layer

```text
Cleaning

Deduplication

Normalization

Validation

Transformation
```

---

# 8. Core Layer

```text
Fact Tables

Dimension Tables

Historical Data

Aggregated Data
```

---

# 9. Data Mart

```text
Finance

Sales

Operations

Marketing

Customer

Executive
```

---

# 10. Fact Tables

```text
FactBooking

FactPayment

FactRevenue

FactTrip

FactSearch
```

---

# 11. Dimension Tables

```text
DimCustomer

DimCompany

DimRoute

DimVehicle

DimDate

DimPromotion

DimLocation
```

---

# 12. Data Refresh

```text
Real-time CDC

15 Minutes Incremental

Daily Full Refresh
```

---

# 13. Data Quality

Kiểm tra

```text
Completeness

Accuracy

Consistency

Uniqueness

Timeliness
```

---

# 14. Warehouse Security

```text
RBAC

Column Masking

Encryption

Audit Logs

Row Access Policy
```

---

# 15. Query Optimization

```text
Partition

Clustering

Materialized View

Caching

Compression
```

---

# 16. Historical Data

```text
Booking

5 Years

Finance

10 Years

Audit

7 Years
```

---

# 17. Performance Targets

```text
Query <5 Seconds

Refresh <15 Minutes

Dashboard <30 Seconds
```

---

# 18. Monitoring

```text
ETL Status

Refresh Time

Storage

Query Cost

Warehouse Health
```

---

# 19. Acceptance Criteria

✓ Warehouse hoạt động

✓ Fact & Dimension đầy đủ

✓ Dashboard sử dụng Warehouse

✓ Data Quality đạt chuẩn

✓ Historical Data đầy đủ

✓ Monitoring hoạt động

---

# 20. Related Documents

AI-001 Data Architecture

AI-003 ETL Pipeline

AI-011 Reporting Architecture

OPS-016 Database Operations

---

# 21. Summary

Data Warehouse của BusZ lưu trữ dữ liệu phân tích tách biệt với hệ thống giao dịch nhằm tối ưu hiệu năng truy vấn, hỗ trợ Business Intelligence, Machine Learning và Dashboard thời gian thực. Kiến trúc này đảm bảo khả năng mở rộng, quản trị dữ liệu và phân tích lịch sử theo chuẩn enterprise.