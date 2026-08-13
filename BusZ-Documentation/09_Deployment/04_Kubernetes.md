# Kubernetes

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

DevOps & Cloud

Document ID

OPS-004

Priority

Critical

Version

1.0

---

# 1. Purpose

Kubernetes quản lý việc triển khai, mở rộng và vận hành các container của BusZ trong môi trường Production.

Mục tiêu

- High Availability
- Auto Scaling
- Self Healing
- Zero Downtime Deployment
- Resource Optimization

---

# 2. Cluster Architecture

```text
Internet

↓

Ingress Controller

↓

Kubernetes Cluster

↓

Frontend Pods

Backend Pods

Worker Pods

↓

Redis

PostgreSQL

↓

Object Storage
```

---

# 3. Cluster Components

```text
Control Plane

Worker Nodes

etcd

API Server

Scheduler

Controller Manager
```

---

# 4. Namespaces

```text
development

staging

production

monitoring
```

---

# 5. Deployments

Triển khai

```text
Frontend

Backend

Worker

Notification Service
```

Mỗi Deployment có Replica riêng.

---

# 6. ReplicaSets

Frontend

```text
3 Replicas
```

Backend

```text
3 Replicas
```

Workers

```text
2 Replicas
```

---

# 7. Services

```text
ClusterIP

NodePort

LoadBalancer
```

Khuyến nghị

```text
ClusterIP + Ingress
```

---

# 8. Ingress

Sử dụng

```text
NGINX Ingress Controller
```

Routing

```text
admin.busz.vn

↓

Frontend

api.busz.vn

↓

Backend API
```

---

# 9. ConfigMaps

Lưu

```text
API URL

Application Config

Feature Flags

Environment Variables
```

---

# 10. Secrets

Quản lý

```text
JWT Secret

Database Password

SMTP Password

Payment API Keys

Supabase Keys
```

Không lưu trực tiếp trong mã nguồn.

---

# 11. Persistent Volumes

Lưu

```text
Database

Logs

Uploads
```

Persistent Volume Claim

```text
PVC
```

---

# 12. Horizontal Pod Autoscaler

Scale theo

```text
CPU > 70%

Memory > 75%

Request Rate
```

Ví dụ

```text
Min Pods

3

Max Pods

10
```

---

# 13. Rolling Update

Quy trình

```text
Deploy New Version

↓

Create New Pods

↓

Health Check

↓

Terminate Old Pods
```

Không gián đoạn dịch vụ.

---

# 14. Rollback

Nếu lỗi

↓

```text
Rollback Previous ReplicaSet
```

↓

Health Check

↓

Resume Service

---

# 15. Resource Management

Requests

```text
CPU

Memory
```

Limits

```text
CPU

Memory
```

Ví dụ

```text
CPU Request

250m

CPU Limit

500m

Memory Request

512Mi

Memory Limit

1Gi
```

---

# 16. Health Checks

Liveness Probe

```text
GET /health/live
```

Readiness Probe

```text
GET /health/ready
```

Startup Probe

```text
GET /health/startup
```

---

# 17. Helm Charts

Quản lý

```text
Frontend

Backend

Redis

Monitoring
```

Cho phép

```text
Install

Upgrade

Rollback
```

---

# 18. Monitoring

Theo dõi

```text
Pods

Nodes

Deployments

Services

Ingress

CPU

Memory
```

Công cụ

```text
Prometheus

Grafana
```

---

# 19. Logging

Thu thập

```text
Pod Logs

Container Logs

Ingress Logs

Application Logs
```

Sử dụng

```text
Loki

ELK Stack
```

---

# 20. Security

✓ RBAC.

✓ Network Policies.

✓ Pod Security Standards.

✓ Image Scanning.

✓ Secret Encryption.

✓ Non-root Containers.

---

# 21. Disaster Recovery

Hỗ trợ

```text
Backup etcd

Backup PVC

Restore Deployment

Cluster Recovery
```

---

# 22. Performance Targets

Pod Startup

```text
<30s
```

Rolling Update

```text
0 Downtime
```

Failover

```text
<60s
```

---

# 23. Acceptance Criteria

✓ Cluster hoạt động.

✓ Auto Scaling hoạt động.

✓ Rolling Update không downtime.

✓ Rollback thành công.

✓ Monitoring đầy đủ.

✓ Secrets được bảo vệ.

---

# 24. Related Documents

OPS-003 Docker

OPS-005 CI/CD

OPS-006 Monitoring

OPS-015 Network Architecture

---

# 25. Summary

Kubernetes là nền tảng điều phối container của BusZ, cung cấp khả năng tự động mở rộng, tự phục hồi và triển khai không gián đoạn. Hệ thống sử dụng Deployments, Services, Ingress, ConfigMaps, Secrets, Persistent Volumes và Horizontal Pod Autoscaler để đảm bảo vận hành ổn định, bảo mật và sẵn sàng mở rộng trong môi trường Production.