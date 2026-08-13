# Scalability

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

DevOps & Cloud

Document ID

OPS-012

Priority

Critical

Version

1.0

---

# 1. Purpose

Scalability định nghĩa chiến lược mở rộng hệ thống BusZ để đáp ứng sự gia tăng về người dùng, lưu lượng truy cập và dữ liệu mà không làm giảm hiệu năng hoặc tính ổn định.

Mục tiêu

- Horizontal Scaling
- Vertical Scaling
- Elastic Infrastructure
- High Availability
- Sustainable Growth

---

# 2. Scalability Architecture

```text
Users

↓

CDN

↓

Load Balancer

↓

API Pods

↓

Redis Cluster

↓

PostgreSQL

↓

Object Storage
```

---

# 3. Scaling Types

```text
Horizontal Scaling

Vertical Scaling

Auto Scaling

Database Scaling
```

---

# 4. Stateless Services

Tất cả Backend Services phải

```text
Stateless
```

Session lưu trong

```text
Redis

JWT
```

---

# 5. Horizontal Scaling

Cho phép mở rộng

```text
Frontend Pods

Backend Pods

Worker Pods

Notification Pods
```

Thông qua

```text
Kubernetes HPA
```

---

# 6. Vertical Scaling

Áp dụng cho

```text
Database

Redis

Monitoring
```

Tăng

```text
CPU

RAM

Storage
```

---

# 7. Auto Scaling Policies

Scale Out khi

```text
CPU > 70%

Memory > 75%

Requests/sec vượt ngưỡng

Queue Length tăng cao
```

Scale In khi

```text
CPU < 30%

Memory < 40%

Traffic giảm ổn định
```

---

# 8. Database Scaling

Chiến lược

```text
Read Replica

Connection Pool

Partitioning

Sharding (Future)
```

---

# 9. Cache Scaling

Redis

↓

```text
Replication

Sentinel

Redis Cluster
```

Theo dõi

```text
Hit Rate

Memory

Evictions
```

---

# 10. Queue Scaling

Background Jobs

```text
Email

Notifications

Reports

Payments
```

Mở rộng

```text
Worker Pods
```

---

# 11. Kubernetes Scaling

Horizontal Pod Autoscaler

```text
HPA
```

Vertical Pod Autoscaler

```text
VPA
```

Cluster Autoscaler

```text
Node Scaling
```

---

# 12. Multi-region Scaling

Ví dụ

```text
Singapore

Tokyo

Sydney
```

Traffic

↓

```text
Geo Routing
```

---

# 13. Load Balancing

Chiến lược

```text
Round Robin

Least Connections

Weighted Routing
```

Health Check bắt buộc.

---

# 14. Storage Scaling

Object Storage

↓

```text
Unlimited Scaling
```

Lưu

```text
Images

Tickets

Reports

Contracts
```

---

# 15. Capacity Planning

Theo dõi

```text
Users

Requests

Storage

Database Size

Traffic Growth
```

Dự báo

```text
6 Months

12 Months

24 Months
```

---

# 16. Scalability Testing

Kiểm thử

```text
100 Users

1,000 Users

10,000 Users

100,000 Users
```

Đánh giá

```text
Latency

Throughput

Error Rate
```

---

# 17. Scaling Metrics

Theo dõi

```text
Requests/sec

Pods

CPU

Memory

Database Connections

Queue Length
```

---

# 18. Long-term Growth

Giai đoạn 1

```text
Monolith

Docker
```

Giai đoạn 2

```text
Kubernetes

Redis

Read Replica
```

Giai đoạn 3

```text
Microservices

Multi-region

Service Mesh
```

---

# 19. Performance Targets

API

```text
<200ms
```

Auto Scaling

```text
<2 Minutes
```

Cluster Expansion

```text
<5 Minutes
```

Availability

```text
99.9%
```

---

# 20. Acceptance Criteria

✓ Stateless Services.

✓ HPA hoạt động.

✓ Database Scaling hoạt động.

✓ Queue Scaling hoạt động.

✓ Capacity Planning đầy đủ.

✓ Load Test đạt mục tiêu.

---

# 21. Related Documents

OPS-011 Performance

OPS-013 Cost Optimization

OPS-015 Network Architecture

OPS-017 Observability

---

# 22. Summary

Scalability của BusZ tập trung vào khả năng mở rộng linh hoạt theo chiều ngang và chiều dọc, kết hợp Kubernetes, Redis, Read Replica và Object Storage để đáp ứng sự tăng trưởng lâu dài. Hệ thống được thiết kế theo hướng stateless, hỗ trợ Auto Scaling và Multi-region nhằm đảm bảo hiệu năng, tính sẵn sàng và khả năng phục vụ lượng lớn người dùng trong tương lai.