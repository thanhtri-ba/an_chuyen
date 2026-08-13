# Monitoring

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

DevOps & Cloud

Document ID

OPS-006

Priority

Critical

Version

1.0

---

# 1. Purpose

Monitoring giúp theo dõi toàn bộ hệ thống BusZ theo thời gian thực nhằm phát hiện sự cố sớm, đảm bảo hiệu năng và đáp ứng SLA.

Mục tiêu

- High Availability
- Real-time Monitoring
- Early Detection
- Capacity Planning
- Incident Prevention

---

# 2. Monitoring Architecture

```text
Applications

↓

Metrics Exporter

↓

Prometheus

↓

Grafana

↓

AlertManager

↓

Slack / Email / Teams
```

---

# 3. Monitoring Scope

Bao gồm

```text
Infrastructure

Containers

Kubernetes

Backend API

Frontend

Database

Redis

External Services
```

---

# 4. Infrastructure Monitoring

Theo dõi

```text
CPU Usage

Memory Usage

Disk Usage

Disk IOPS

Network Throughput

Network Latency

Load Average
```

---

# 5. Application Monitoring

Theo dõi

```text
Request Count

Response Time

Error Rate

Active Users

Sessions

Crash Rate
```

---

# 6. API Monitoring

Hiển thị

```text
Total Requests

Success Rate

4xx Errors

5xx Errors

Average Latency

P95

P99
```

---

# 7. Database Monitoring

Theo dõi

```text
Connections

Slow Queries

Transactions

Replication Delay

Locks

Storage Usage
```

---

# 8. Redis Monitoring

Theo dõi

```text
Memory Usage

Cache Hit Rate

Evictions

Connected Clients

Commands/sec
```

---

# 9. Kubernetes Monitoring

Hiển thị

```text
Node Health

Pod Status

Replica Count

Restart Count

CPU

Memory

Network
```

---

# 10. Business Monitoring

Theo dõi

```text
Bookings/hour

Payments/hour

Revenue/day

Cancelled Trips

Failed Payments

Notifications Sent
```

---

# 11. Uptime Monitoring

Theo dõi

```text
API

Admin Web

Public Website

Mobile API
```

Mục tiêu

```text
99.9%
```

---

# 12. Health Checks

Endpoints

```text
GET /health

GET /health/live

GET /health/ready
```

Kiểm tra

```text
Database

Redis

Storage

External APIs
```

---

# 13. Alert Rules

CPU

```text
>80% trong 5 phút
```

Memory

```text
>85%
```

Disk

```text
>90%
```

API Error Rate

```text
>5%
```

---

# 14. Alert Channels

Thông báo qua

```text
Slack

Microsoft Teams

Email

SMS (Critical)
```

---

# 15. SLA / SLO / SLI

SLA

```text
99.9% Availability
```

SLO

```text
API Response <200ms

Error Rate <1%
```

SLI

```text
Availability

Latency

Success Rate
```

---

# 16. Dashboards

Grafana Dashboard

```text
Infrastructure

Application

API

Database

Business KPI

Security
```

---

# 17. Capacity Monitoring

Theo dõi

```text
CPU Trend

Memory Trend

Storage Growth

Traffic Growth
```

Dự báo

```text
30 Days

90 Days
```

---

# 18. Incident Detection

Phát hiện

```text
API Down

Database Down

Redis Failure

High Latency

Pod CrashLoop

Storage Full
```

---

# 19. Alert Escalation

```text
Warning

↓

DevOps

↓

Critical

↓

SRE

↓

Emergency

↓

On-call Team
```

---

# 20. Monitoring Tools

```text
Prometheus

Grafana

AlertManager

Node Exporter

Kube State Metrics

Blackbox Exporter

Sentry
```

---

# 21. Performance Targets

Metrics Delay

```text
<30s
```

Alert Delivery

```text
<1 phút
```

Dashboard Load

```text
<2 giây
```

---

# 22. Acceptance Criteria

✓ Metrics thu thập đầy đủ.

✓ Dashboard hoạt động.

✓ Alert chính xác.

✓ Uptime Monitoring hoạt động.

✓ Health Check thành công.

✓ Alert Escalation hoạt động.

---

# 23. Related Documents

OPS-005 CI/CD

OPS-007 Logging

OPS-017 Observability

ADM-011 Report Analytics

---

# 24. Summary

Monitoring là hệ thống giám sát thời gian thực của BusZ, bao phủ từ hạ tầng, Kubernetes, ứng dụng, API, cơ sở dữ liệu đến các chỉ số nghiệp vụ. Với Prometheus, Grafana và AlertManager, đội DevOps có thể phát hiện sớm sự cố, theo dõi hiệu năng và đảm bảo hệ thống luôn đáp ứng SLA đã cam kết.