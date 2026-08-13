# Deployment

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Admin Web

Document ID

ADM-019

Priority

Critical

Version

1.0

---

# 1. Purpose

Deployment định nghĩa quy trình triển khai Admin Web từ môi trường Development đến Production.

Mục tiêu

- Triển khai ổn định
- Tự động hóa CI/CD
- Dễ rollback
- Đảm bảo bảo mật
- Giảm thời gian downtime

---

# 2. Deployment Environments

```text
Development

↓

Testing

↓

Staging

↓

Production
```

Mỗi môi trường có cấu hình riêng.

---

# 3. Infrastructure

Frontend

```text
React

Vite

TypeScript
```

Web Server

```text
Nginx
```

Container

```text
Docker

Docker Compose
```

Cloud

```text
AWS

Azure

DigitalOcean

VPS
```

---

# 4. Build Process

```text
Install Dependencies

↓

Lint

↓

Run Tests

↓

Build

↓

Generate Assets

↓

Deploy
```

Lệnh

```bash
npm install

npm run lint

npm run test

npm run build
```

---

# 5. Docker

Dockerfile

```text
Node Build Stage

↓

Nginx Runtime Stage
```

Image

```text
busz-admin-web:latest
```

---

# 6. Docker Compose

Services

```text
Admin Web

Nginx

Redis

Monitoring
```

---

# 7. Nginx Configuration

Chức năng

```text
Reverse Proxy

HTTPS

Compression

Caching

Security Headers
```

---

# 8. HTTPS

Sử dụng

```text
Let's Encrypt

Cloudflare SSL

Commercial SSL
```

Bắt buộc

```text
HTTPS Only
```

---

# 9. Environment Variables

Ví dụ

```text
VITE_API_URL

VITE_APP_ENV

VITE_SUPABASE_URL

VITE_SUPABASE_KEY

VITE_SENTRY_DSN

VITE_MAP_PROVIDER
```

Không commit file `.env` lên Git.

---

# 10. Database Migration

Trước khi Deploy

↓

```text
Backup Database

↓

Run Migration

↓

Verify Schema
```

---

# 11. CI/CD Pipeline

```text
Git Push

↓

GitHub Actions

↓

Install

↓

Test

↓

Build

↓

Docker Image

↓

Push Registry

↓

Deploy Server
```

---

# 12. Deployment Strategy

```text
Rolling Deployment

Blue-Green Deployment

Canary Deployment
```

Khuyến nghị

```text
Blue-Green
```

---

# 13. Rollback

Flow

```text
Deploy Failed

↓

Rollback Previous Version

↓

Verify

↓

Notify Team
```

---

# 14. Monitoring

Theo dõi

```text
CPU

Memory

Network

Response Time

Availability

Error Rate
```

Công cụ

```text
Prometheus

Grafana
```

---

# 15. Logging

Thu thập

```text
Application Logs

Nginx Logs

Access Logs

Error Logs
```

Công cụ

```text
Loki

ELK Stack
```

---

# 16. Backup & Disaster Recovery

Backup

```text
Database

Configuration

Uploaded Files
```

Lịch

```text
Daily

Weekly

Monthly
```

---

# 17. Security

Triển khai

```text
HTTPS

CSP

HSTS

Rate Limiting

Firewall

Secret Management
```

---

# 18. Deployment Checklist

✓ Build thành công.

✓ Test Pass.

✓ Docker Image tạo thành công.

✓ Environment Variables chính xác.

✓ SSL hợp lệ.

✓ Monitoring hoạt động.

✓ Backup hoàn tất.

---

# 19. API Integration

Kiểm tra

```text
Health Check API

Authentication

Dashboard

CRUD

Upload

Reports
```

---

# 20. Performance Targets

Build

```text
<5 Minutes
```

Deploy

```text
<10 Minutes
```

Downtime

```text
<30 Seconds
```

Availability

```text
99.9%
```

---

# 21. Component Diagram

```text
GitHub

↓

GitHub Actions

↓

Docker Registry

↓

Production Server

↓

Nginx

↓

React Admin

↓

Backend API
```

---

# 22. Test Cases

✓ Build.

✓ Docker.

✓ HTTPS.

✓ Rollback.

✓ Monitoring.

✓ Logging.

✓ Backup.

✓ Health Check.

---

# 23. Acceptance Criteria

✓ Build thành công.

✓ Deploy thành công.

✓ Rollback hoạt động.

✓ Monitoring hoạt động.

✓ HTTPS bắt buộc.

✓ Downtime trong giới hạn.

---

# 24. Related Documents

ADM-018 Testing

ADM-020 Release

API-019 Backend Deployment

---

# 25. Summary

Deployment của Admin Web quy định toàn bộ quy trình triển khai từ Development đến Production, sử dụng Docker, Nginx và CI/CD để tự động hóa quá trình phát hành. Hệ thống hỗ trợ giám sát, ghi log, sao lưu và rollback nhằm đảm bảo tính ổn định, bảo mật và khả năng phục hồi trong môi trường Production.