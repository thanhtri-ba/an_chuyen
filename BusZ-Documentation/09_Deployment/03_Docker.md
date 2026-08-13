# Infrastructure

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

DevOps & Cloud

Document ID

OPS-002

Priority

Critical

Version

1.0

---

# 1. Purpose

Infrastructure định nghĩa toàn bộ hạ tầng triển khai của BusZ trong môi trường Production.

Mục tiêu

- High Availability
- Scalability
- Security
- Reliability
- Disaster Recovery Ready

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

Mỗi môi trường sử dụng tài nguyên và cấu hình độc lập.

---

# 3. Cloud Providers

Hỗ trợ

```text
AWS

Microsoft Azure

Google Cloud Platform

DigitalOcean

VPS (Development)
```

Khuyến nghị Production

```text
AWS
```

---

# 4. Network Architecture

```text
Internet

↓

Cloudflare

↓

VPC

↓

Public Subnet

↓

Private Subnet
```

---

# 5. VPC Design

```text
CIDR

10.0.0.0/16
```

Subnets

```text
Public Subnet A

Public Subnet B

Private Subnet A

Private Subnet B
```

---

# 6. Compute Layer

Hỗ trợ

```text
EC2

Azure VM

GCE

Docker Host
```

Khuyến nghị

```text
Docker Container
```

---

# 7. Database Layer

Primary

```text
PostgreSQL
```

Cache

```text
Redis
```

Read Replica

```text
Optional
```

---

# 8. Object Storage

Lưu

```text
Images

Tickets

Invoices

Reports

Contracts
```

Sử dụng

```text
Amazon S3

Supabase Storage

Cloudinary
```

---

# 9. CDN

Hỗ trợ

```text
Cloudflare CDN

AWS CloudFront
```

Cache

```text
Images

JS

CSS

Fonts
```

---

# 10. DNS

Quản lý

```text
Cloudflare DNS

Route53
```

Ví dụ

```text
api.busz.vn

admin.busz.vn

app.busz.vn
```

---

# 11. SSL

Sử dụng

```text
Let's Encrypt

Cloudflare SSL

AWS ACM
```

Bắt buộc

```text
HTTPS Only
```

---

# 12. Load Balancer

Hỗ trợ

```text
AWS ALB

Nginx

HAProxy
```

Chức năng

```text
Health Check

SSL Termination

Routing

Load Balancing
```

---

# 13. Auto Scaling

Scale

```text
CPU Usage

Memory Usage

Request Count
```

Hỗ trợ

```text
Horizontal Scaling
```

---

# 14. High Availability

Triển khai

```text
Multi-AZ

Redundant Load Balancer

Database Replica
```

Không có Single Point of Failure.

---

# 15. Firewall

Bảo vệ

```text
HTTP

HTTPS

SSH

Database
```

Giới hạn

```text
IP Whitelist

Security Groups
```

---

# 16. Infrastructure as Code

Công cụ

```text
Terraform

Ansible
```

Quản lý

```text
Network

Compute

Database

Storage

DNS
```

---

# 17. Monitoring Infrastructure

Theo dõi

```text
CPU

Memory

Disk

Network

Database

Containers
```

Công cụ

```text
Prometheus

Grafana
```

---

# 18. Backup Infrastructure

Backup

```text
Database

Object Storage

Configuration

Logs
```

Lịch

```text
Daily

Weekly

Monthly
```

---

# 19. Infrastructure Diagram

```text
Internet

↓

Cloudflare

↓

Load Balancer

↓

Nginx

↓

React Admin

↓

Backend API

↓

Redis

↓

PostgreSQL

↓

Object Storage
```

---

# 20. Performance Targets

Availability

```text
99.9%
```

API

```text
<200ms
```

Failover

```text
<1 minute
```

---

# 21. Security Best Practices

✓ Private Subnet cho Database.

✓ HTTPS Only.

✓ IAM Least Privilege.

✓ Secret Manager.

✓ Security Groups.

✓ Regular Patch.

---

# 22. Acceptance Criteria

✓ High Availability.

✓ Auto Scaling.

✓ Multi-AZ.

✓ Infrastructure as Code.

✓ Backup hoạt động.

✓ Monitoring đầy đủ.

---

# 23. Related Documents

OPS-001 System Architecture

OPS-003 Docker

OPS-005 CI/CD

OPS-015 Network Architecture

---

# 24. Summary

Infrastructure của BusZ được thiết kế theo mô hình Cloud Native với VPC, Public/Private Subnet, Load Balancer, PostgreSQL, Redis và Object Storage. Hạ tầng hỗ trợ Auto Scaling, Multi-AZ, Infrastructure as Code và Monitoring nhằm đảm bảo tính sẵn sàng, bảo mật và khả năng mở rộng trong môi trường Production.