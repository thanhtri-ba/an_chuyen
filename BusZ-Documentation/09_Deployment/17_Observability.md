# Observability

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

DevOps & Cloud

Document ID

OPS-017

Priority

Critical

Version

1.0

---

# 1. Purpose

Observability giúp đội DevOps, SRE và Backend hiểu được trạng thái nội tại của hệ thống BusZ thông qua Metrics, Logs và Traces nhằm phát hiện, phân tích và khắc phục sự cố nhanh chóng.

Mục tiêu

- Full System Visibility
- Root Cause Analysis
- Faster Incident Resolution
- Performance Insight
- Business Observability

---

# 2. Observability Architecture

```text
Applications

↓

Metrics

Logs

Traces

↓

OpenTelemetry

↓

Collector

↓

Prometheus

Loki

Tempo / Jaeger

↓

Grafana
```

---

# 3. Three Pillars

```text
Metrics

Logs

Traces
```

Mọi dịch vụ phải hỗ trợ đầy đủ cả ba thành phần.

---

# 4. Metrics

Thu thập

```text
CPU

Memory

Disk

Network

API Requests

Response Time

Error Rate

Queue Length
```

---

# 5. Logs

Thu thập

```text
Application Logs

Audit Logs

Security Logs

Database Logs

Kubernetes Logs

Nginx Logs
```

---

# 6. Distributed Tracing

Theo dõi

```text
User Request

↓

Gateway

↓

Backend

↓

Redis

↓

PostgreSQL

↓

External APIs
```

Công cụ

```text
OpenTelemetry

Tempo

Jaeger
```

---

# 7. Correlation ID

Mỗi Request sinh

```text
Request ID

Correlation ID

Trace ID

Span ID
```

Theo suốt vòng đời Request.

---

# 8. Service Dependency Map

Hiển thị

```text
Frontend

↓

Gateway

↓

Booking Service

↓

Payment Service

↓

Notification Service

↓

Database
```

---

# 9. Golden Signals

Theo dõi

```text
Latency

Traffic

Errors

Saturation
```

---

# 10. RED Method

API

↓

Theo dõi

```text
Request Rate

Error Rate

Duration
```

---

# 11. USE Method

Infrastructure

↓

Theo dõi

```text
Utilization

Saturation

Errors
```

---

# 12. Business Observability

Theo dõi

```text
Bookings/hour

Payments/hour

Revenue/day

Failed Bookings

Cancelled Trips

Notification Success Rate
```

---

# 13. SLO Burn Rate

Theo dõi

```text
Availability

Latency

Error Budget

Burn Rate
```

Cảnh báo khi vượt ngưỡng.

---

# 14. Root Cause Analysis

Quan sát

```text
Metrics

↓

Logs

↓

Trace

↓

Dependency

↓

Root Cause
```

---

# 15. Dashboards

Grafana

↓

Hiển thị

```text
Infrastructure

Application

Business

Security

Database

Tracing
```

---

# 16. Alert Correlation

Nếu

```text
High CPU

+

Slow Database

+

API Errors
```

↓

Gộp thành

```text
Single Incident
```

---

# 17. Observability Tools

```text
OpenTelemetry

Prometheus

Grafana

Tempo

Jaeger

Loki

AlertManager
```

---

# 18. Health Indicators

Theo dõi

```text
Availability

Latency

Error Rate

Success Rate

Recovery Time
```

---

# 19. Performance Targets

Trace Collection

```text
<1s
```

Metrics Delay

```text
<30s
```

Dashboard Refresh

```text
<10s
```

Root Cause Analysis

```text
<5 Minutes
```

---

# 20. Acceptance Criteria

✓ Metrics đầy đủ.

✓ Logs đầy đủ.

✓ Distributed Tracing hoạt động.

✓ Correlation ID hoạt động.

✓ Dashboard hoàn chỉnh.

✓ Root Cause Analysis khả thi.

---

# 21. Related Documents

OPS-006 Monitoring

OPS-007 Logging

OPS-011 Performance

OPS-018 Incident Response

---

# 22. Summary

Observability của BusZ mở rộng Monitoring truyền thống bằng cách kết hợp Metrics, Logs và Distributed Tracing để cung cấp góc nhìn toàn diện về hệ thống. Nhờ OpenTelemetry và Correlation ID, đội vận hành có thể nhanh chóng xác định nguyên nhân gốc của sự cố, đánh giá tác động đến nghiệp vụ và rút ngắn thời gian xử lý trong môi trường Production.