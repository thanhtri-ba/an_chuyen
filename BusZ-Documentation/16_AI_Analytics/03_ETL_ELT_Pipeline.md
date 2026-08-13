# ETL Pipeline

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

AI & Analytics

Document ID

AI-003

Priority

Critical

Version

1.0

---

# 1. Purpose

ETL Pipeline định nghĩa quy trình trích xuất, chuyển đổi và tải dữ liệu từ hệ thống vận hành của BusZ vào Data Warehouse nhằm phục vụ Business Intelligence, Machine Learning và Analytics.

Mục tiêu

- Chuẩn hóa ETL
- Đồng bộ dữ liệu
- Đảm bảo Data Quality
- Hỗ trợ Near Real-time Analytics
- Hỗ trợ AI Code Generation

---

# 2. Objectives

```text
Extract

Transform

Load

Validate

Monitor
```

---

# 3. ETL Architecture

```text
Operational Database

↓

CDC

↓

Extract

↓

Transform

↓

Validation

↓

Load

↓

Data Warehouse
```

---

# 4. Data Sources

```text
Users

Bookings

Payments

Trips

Routes

Vehicles

Promotions

Reviews

Notifications

Audit Logs
```

---

# 5. Extract Layer

Nguồn dữ liệu

```text
PostgreSQL

REST API

CSV

External APIs

Kafka (Future)
```

---

# 6. Change Data Capture

Sử dụng

```text
CDC

Incremental Load

Timestamp

Transaction Log
```

---

# 7. Transform Layer

Bao gồm

```text
Cleaning

Deduplication

Normalization

Standardization

Aggregation
```

---

# 8. Validation Rules

Kiểm tra

```text
Required Fields

Null Values

Duplicate Records

Data Types

Business Rules
```

---

# 9. Data Cleaning

```text
Remove Duplicate

Fix Encoding

Trim Spaces

Convert Timezone

Standardize Phone

Standardize Email
```

---

# 10. Load Layer

Đích đến

```text
Raw Layer

Staging Layer

Core Layer

Data Mart
```

---

# 11. Incremental Loading

```text
Last Updated Time

CDC

Batch ID

Transaction ID
```

---

# 12. Full Load

Áp dụng

```text
Initial Deployment

Major Migration

Recovery Process
```

---

# 13. Scheduling

```text
Real-time CDC

Every 15 Minutes

Daily Full Sync

Weekly Verification
```

---

# 14. Error Handling

```text
Retry

Dead Letter Queue

Notification

Rollback

Audit Log
```

---

# 15. Data Quality

Đảm bảo

```text
Completeness

Consistency

Accuracy

Uniqueness

Timeliness
```

---

# 16. Monitoring

Theo dõi

```text
Pipeline Status

Execution Time

Failed Jobs

Latency

Success Rate
```

---

# 17. Performance Targets

```text
Incremental ETL

<15 Minutes

Daily ETL

<2 Hours

Pipeline Success

>99.9%
```

---

# 18. Security

```text
Encrypted Transfer

RBAC

Audit Logs

Secrets Management

Data Masking
```

---

# 19. Acceptance Criteria

✓ ETL Pipeline hoạt động

✓ CDC chính xác

✓ Data Validation đạt chuẩn

✓ Warehouse cập nhật

✓ Monitoring đầy đủ

✓ Retry thành công

---

# 20. Related Documents

AI-001 Data Architecture

AI-002 Data Warehouse

AI-004 Real-Time Analytics

OPS-016 Database Operations

---

# 21. Summary

ETL Pipeline của BusZ chịu trách nhiệm đồng bộ dữ liệu từ hệ thống vận hành sang Data Warehouse thông qua quy trình Extract, Transform và Load. Pipeline hỗ trợ CDC, Incremental Load và Data Validation nhằm đảm bảo dữ liệu phân tích luôn chính xác, cập nhật và sẵn sàng cho Business Intelligence, Machine Learning và Dashboard thời gian thực.