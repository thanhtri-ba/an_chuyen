# System Architecture

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

DevOps & Cloud

Document ID

OPS-001

Priority

Critical

Version

1.0

---

# 1. Purpose

Tài liệu mô tả kiến trúc tổng thể (High-Level Architecture) của hệ thống BusZ trong môi trường Production.

Mục tiêu

- Dễ mở rộng
- High Availability
- Fault Tolerance
- Secure
- Cloud Native

---

# 2. High-Level Architecture

```text
Users

↓

Mobile App (Flutter)

↓

Admin Web (React)

↓

API Gateway

↓

Backend Services

↓

Database

↓

Storage

↓

Monitoring
```

---

# 3. Client Layer

Bao gồm

```text
Flutter Mobile

React Admin

Public Website

Future Partner Portal
```

---

# 4. Edge Layer

Sử dụng

```text
Cloudflare

↓

WAF

↓

CDN

↓

DDoS Protection

↓

SSL
```

---

# 5. Load Balancer

Hỗ trợ

```text
Nginx

HAProxy

Cloud Load Balancer
```

Chức năng

```text
HTTPS

Routing

Health Check

Sticky Session (nếu cần)
```

---

# 6. API Layer

Bao gồm

```text
Authentication API

Booking API

Payment API

Trip API

Notification API

Report API
```

Tất cả giao tiếp

```text
REST API

HTTPS
```

---

# 7. Business Services

```text
Auth Service

Booking Service

Payment Service

Notification Service

Report Service

Route Service

Trip Service
```

Có thể tách thành Microservices trong tương lai.

---

# 8. Database Layer

Primary

```text
PostgreSQL
```

Cache

```text
Redis
```

Search (Future)

```text
OpenSearch
```

---

# 9. Object Storage

Lưu

```text
Images

Tickets

Invoices

Contracts

Reports
```

Sử dụng

```text
Supabase Storage

Amazon S3

Cloudinary
```

---

# 10. External Services

```text
VNPay

MoMo

ZaloPay

Stripe

Firebase

Supabase

Cloudinary

OpenStreetMap

Mapbox

SMTP
```

---

# 11. Messaging

Sử dụng

```text
Redis Queue

RabbitMQ

Kafka (Future)
```

Cho

```text
Notifications

Emails

Reports

Background Jobs
```

---

# 12. Monitoring

```text
Prometheus

Grafana

Sentry

Uptime Monitor
```

---

# 13. Logging

Thu thập

```text
Application Logs

Nginx Logs

Database Logs

Audit Logs
```

Công cụ

```text
Loki

ELK Stack
```

---

# 14. Security Layer

```text
HTTPS

JWT

RBAC

Rate Limiting

WAF

Firewall

Secrets Manager
```

---

# 15. Backup

Bao gồm

```text
Database

Storage

Configuration

Logs
```

---

# 16. Disaster Recovery

Mục tiêu

```text
Automatic Recovery

Rollback

Backup Restore

Multi-region Ready
```

---

# 17. Scalability

Horizontal

```text
Backend API

Redis

Nginx
```

Vertical

```text
Database
```

---

# 18. Availability

Target

```text
99.9%
```

Không có Single Point of Failure.

---

# 19. Performance Targets

API

```text
<200ms
```

Database Query

```text
<100ms
```

App Load

```text
<2s
```

---

# 20. Architecture Diagram

```text
Internet

↓

Cloudflare

↓

Load Balancer

↓

React Admin

Flutter

↓

Backend API

↓

Redis

↓

PostgreSQL

↓

Storage

↓

Monitoring
```

---

# 21. Acceptance Criteria

✓ High Availability.

✓ HTTPS Only.

✓ Horizontal Scaling.

✓ Monitoring đầy đủ.

✓ Backup hoạt động.

✓ Disaster Recovery sẵn sàng.

---

# 22. Related Documents

OPS-002 Infrastructure

OPS-005 CI/CD

OPS-006 Monitoring

ADM-019 Deployment

---

# 23. Summary

System Architecture của BusZ được thiết kế theo hướng Cloud Native, hỗ trợ mở rộng theo chiều ngang, tích hợp đầy đủ các thành phần như Load Balancer, Backend Services, Database, Object Storage, Monitoring và Security. Kiến trúc này đáp ứng yêu cầu vận hành ổn định, bảo mật và sẵn sàng cho môi trường Production quy mô lớn.