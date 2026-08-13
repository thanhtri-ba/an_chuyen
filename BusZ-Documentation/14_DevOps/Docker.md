# Docker

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

DevOps

Document ID

DEVOPS-001

Priority

Critical

Version

1.0

---

# 1. Purpose

Docker định nghĩa chiến lược Containerization của BusZ nhằm đảm bảo môi trường phát triển, kiểm thử và Production luôn nhất quán, dễ triển khai và có khả năng mở rộng.

Mục tiêu

- Chuẩn hóa môi trường
- Đơn giản hóa Deployment
- Hỗ trợ Microservices
- Hỗ trợ CI/CD
- Giảm lỗi môi trường

---

# 2. Objectives

```text
Containerization

Portability

Scalability

Isolation

Automation
```

---

# 3. Architecture

```text
Flutter

↓

React

↓

API Gateway

↓

Backend

↓

PostgreSQL

Redis

MinIO

↓

Docker Network
```

---

# 4. Containers

```text
Frontend

Backend API

PostgreSQL

Redis

MinIO

Nginx

Prometheus

Grafana
```

---

# 5. Docker Images

```text
Node.js

Nginx

PostgreSQL

Redis

MinIO

Prometheus

Grafana
```

---

# 6. Network

```text
Frontend Network

Backend Network

Monitoring Network
```

---

# 7. Volumes

```text
Database

Uploads

Logs

Redis

Monitoring
```

---

# 8. Environment Variables

```text
DATABASE_URL

JWT_SECRET

REDIS_URL

MINIO_ENDPOINT

SMTP_SERVER

API_KEY
```

---

# 9. Docker Compose

Services

```text
frontend

backend

postgres

redis

minio

nginx

grafana

prometheus
```

---

# 10. Build Strategy

```text
Development

↓

Testing

↓

Staging

↓

Production
```

---

# 11. Multi-stage Build

```text
Dependencies

↓

Build

↓

Runtime

↓

Production Image
```

---

# 12. Health Check

```text
Backend

Database

Redis

Storage

API
```

---

# 13. Logging

```text
Container Logs

Application Logs

Error Logs

Audit Logs
```

---

# 14. Security

```text
Non-root User

Read-only Filesystem

Image Scanning

Secret Management
```

---

# 15. Resource Limits

```text
CPU

Memory

Disk

Network
```

---

# 16. Backup

```text
Volumes

Database

Configuration

Object Storage
```

---

# 17. Monitoring

```text
Container Health

CPU

Memory

Restart Count

Disk Usage
```

---

# 18. Performance Targets

```text
Container Startup

<30 Seconds

Health Check

<5 Seconds

Deployment

<5 Minutes
```

---

# 19. Acceptance Criteria

✓ Docker Compose

✓ Multi-stage Build

✓ Health Checks

✓ Persistent Volumes

✓ Monitoring

✓ Production Ready

---

# 20. Related Documents

Environment

Git Strategy

Logging

Monitoring

Deployment

---

# 21. Summary

Docker là nền tảng container hóa của BusZ, giúp toàn bộ hệ thống từ Frontend, Backend đến Database và Monitoring chạy trong môi trường nhất quán. Kiến trúc Docker hỗ trợ CI/CD, triển khai Production và mở rộng hệ thống theo chuẩn cloud-native.