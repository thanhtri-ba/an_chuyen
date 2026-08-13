# Logging

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

DevOps

Document ID

DEVOPS-004

Priority

Critical

Version

1.0

---

# 1. Purpose

Logging định nghĩa kiến trúc ghi log tập trung của BusZ nhằm hỗ trợ giám sát hệ thống, xử lý sự cố, kiểm toán và phân tích hoạt động của toàn bộ nền tảng.

Mục tiêu

- Centralized Logging
- Troubleshooting
- Audit Trail
- Security Investigation
- Operational Monitoring

---

# 2. Objectives

```text
Application Logging

Infrastructure Logging

Audit Logging

Security Logging

Performance Logging
```

---

# 3. Logging Architecture

```text
Flutter

↓

Backend API

↓

Logging Library

↓

Log Collector

↓

Log Storage

↓

Dashboard

↓

Alerting
```

---

# 4. Log Sources

```text
Frontend

Backend

Database

Redis

Docker

Nginx

Operating System

Monitoring
```

---

# 5. Log Categories

```text
Application Log

System Log

Audit Log

Security Log

Access Log

Error Log

Performance Log
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

---

# 7. Structured Logging

Định dạng

```json
{
  "timestamp":"",
  "level":"",
  "service":"",
  "requestId":"",
  "userId":"",
  "message":""
}
```

---

# 8. Request Tracing

Mỗi Request sinh

```text
Request ID

Correlation ID

Session ID

Trace ID
```

---

# 9. Audit Logging

Ghi nhận

```text
Login

Logout

Booking

Payment

Refund

Role Change

Permission Change

Configuration Change
```

---

# 10. Security Logging

```text
Failed Login

Permission Denied

JWT Failure

Rate Limit

SQL Injection

XSS Attempt

API Abuse
```

---

# 11. Performance Logging

```text
API Response Time

Database Query Time

Redis Latency

Memory Usage

CPU Usage
```

---

# 12. Centralized Logging

Có thể sử dụng

```text
ELK Stack

OpenSearch

Grafana Loki

Splunk

Graylog
```

---

# 13. Log Retention

```text
Application Logs

30 Days

Audit Logs

1 Year

Security Logs

2 Years

Payment Logs

7 Years
```

---

# 14. Log Rotation

```text
Daily

Size-based

Compression

Archive

Deletion Policy
```

---

# 15. Sensitive Data

Không ghi

```text
Password

OTP

Credit Card

CVV

JWT Secret

Private Key
```

Mask dữ liệu

```text
Email

Phone Number

Identity Number
```

---

# 16. Monitoring

Theo dõi

```text
Log Volume

Error Rate

Warning Rate

Failed Requests

Security Events
```

---

# 17. Performance Targets

```text
Log Write

<5 ms

Search

<2 Seconds

Availability

99.99%
```

---

# 18. Security

```text
RBAC

Encrypted Storage

Immutable Logs

Audit Access

Tamper Detection
```

---

# 19. Acceptance Criteria

✓ Structured Logging

✓ Centralized Logging

✓ Audit Logs

✓ Security Logs

✓ Log Rotation

✓ Log Retention

---

# 20. Related Documents

Docker

Environment

Monitoring

Security Logging

Incident Response

---

# 21. Summary

Logging của BusZ triển khai hệ thống ghi log tập trung theo chuẩn Structured Logging, hỗ trợ theo dõi hoạt động ứng dụng, điều tra sự cố, kiểm toán và giám sát bảo mật. Kiến trúc sử dụng Correlation ID, Audit Logging và Security Logging giúp dễ dàng truy vết toàn bộ vòng đời của một yêu cầu trong môi trường Production.