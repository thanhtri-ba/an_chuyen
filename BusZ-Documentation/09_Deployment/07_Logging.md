# Logging

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

DevOps & Cloud

Document ID

OPS-007

Priority

Critical

Version

1.0

---

# 1. Purpose

Logging định nghĩa tiêu chuẩn ghi log cho toàn bộ hệ thống BusZ nhằm hỗ trợ vận hành, giám sát, kiểm toán và điều tra sự cố.

Mục tiêu

- Centralized Logging
- Structured Logging
- Fast Troubleshooting
- Audit Support
- Security Compliance

---

# 2. Logging Architecture

```text
Applications

↓

Log Collector

↓

Central Log Storage

↓

Search Engine

↓

Visualization

↓

Alerting
```

---

# 3. Log Sources

```text
Frontend

Backend API

Worker

Nginx

PostgreSQL

Redis

Kubernetes

Operating System
```

---

# 4. Log Categories

```text
Application Logs

Access Logs

Error Logs

Security Logs

Audit Logs

Performance Logs

Infrastructure Logs
```

---

# 5. Structured Logging

Định dạng

```json
{
  "timestamp": "",
  "level": "",
  "service": "",
  "module": "",
  "requestId": "",
  "userId": "",
  "message": ""
}
```

Định dạng chuẩn

```text
JSON
```

---

# 6. Log Levels

```text
TRACE

DEBUG

INFO

WARN

ERROR

FATAL
```

Production

```text
INFO

WARN

ERROR

FATAL
```

---

# 7. Application Logs

Ghi nhận

```text
Startup

Shutdown

Business Events

Exceptions

Background Jobs
```

---

# 8. API Logs

Bao gồm

```text
Method

Endpoint

Status Code

Response Time

Request ID

Client IP

User Agent
```

---

# 9. Database Logs

Theo dõi

```text
Connections

Slow Queries

Deadlocks

Transactions

Errors
```

---

# 10. Kubernetes Logs

Thu thập

```text
Pods

Deployments

Ingress

Events

Container Logs
```

---

# 11. Nginx Logs

Bao gồm

```text
Access Log

Error Log
```

Thông tin

```text
Client IP

URL

Status

Latency
```

---

# 12. Correlation ID

Mỗi Request có

```text
Request ID

Correlation ID
```

Dùng để truy vết xuyên suốt giữa các service.

---

# 13. Sensitive Data

Không ghi log

```text
Password

JWT

Access Token

Refresh Token

OTP

Credit Card

CVV

API Secret
```

Mask

```text
Phone

Email

CCCD

Tax Code
```

---

# 14. Centralized Logging

Công cụ

```text
Loki

ELK Stack

OpenSearch
```

---

# 15. Log Retention

Application Logs

```text
90 Days
```

Audit Logs

```text
7 Years
```

Security Logs

```text
2 Years
```

Có thể cấu hình.

---

# 16. Log Rotation

Chính sách

```text
Daily

100MB/File

Compress

Archive
```

---

# 17. Log Search

Tìm kiếm theo

```text
Request ID

User ID

Module

Level

Date

Service

IP
```

---

# 18. Log Alerts

Kích hoạt khi

```text
Too Many Errors

Fatal Errors

Authentication Failures

Payment Errors

Database Failures
```

---

# 19. Dashboard

Grafana

↓

Hiển thị

```text
Error Rate

Top Exceptions

Slow APIs

Traffic

Log Volume
```

---

# 20. Logging Tools

```text
Pino

Winston

Loki

Promtail

Grafana

ELK Stack
```

---

# 21. Performance Targets

Log Write

```text
<5ms
```

Search

```text
<2s
```

Dashboard Refresh

```text
<30s
```

---

# 22. Acceptance Criteria

✓ Structured Logging.

✓ Centralized Logging.

✓ Log Search hoạt động.

✓ Mask Sensitive Data.

✓ Log Rotation hoạt động.

✓ Alert hoạt động.

---

# 23. Related Documents

OPS-006 Monitoring

OPS-008 Security

OPS-017 Observability

ADM-015 Audit Log

---

# 24. Summary

Logging của BusZ chuẩn hóa việc ghi nhận sự kiện trên toàn hệ thống bằng định dạng JSON, kết hợp Correlation ID để truy vết xuyên suốt giữa các dịch vụ. Hệ thống sử dụng Loki hoặc ELK Stack để lưu trữ và tìm kiếm log tập trung, đồng thời áp dụng chính sách che giấu dữ liệu nhạy cảm, xoay vòng log và cảnh báo tự động nhằm hỗ trợ vận hành và điều tra sự cố hiệu quả.