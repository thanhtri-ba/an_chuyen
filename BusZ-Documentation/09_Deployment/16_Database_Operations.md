# Network Architecture

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

DevOps & Cloud

Document ID

OPS-015

Priority

Critical

Version

1.0

---

# 1. Purpose

Network Architecture định nghĩa kiến trúc mạng của BusZ nhằm đảm bảo tính bảo mật, hiệu năng, khả năng mở rộng và tính sẵn sàng cao trong môi trường Production.

Mục tiêu

- Secure Network
- High Availability
- Low Latency
- Zero Trust
- Multi-region Ready

---

# 2. Network Topology

```text
Internet

↓

Cloudflare

↓

Internet Gateway

↓

Load Balancer

↓

Frontend

↓

Backend API

↓

Redis

↓

PostgreSQL

↓

Storage
```

---

# 3. VPC Design

CIDR

```text
10.0.0.0/16
```

Bao gồm

```text
Public Subnets

Private Subnets

Management Subnet
```

---

# 4. Public Subnets

Triển khai

```text
Load Balancer

NAT Gateway

Bastion Host
```

Cho phép

```text
HTTPS

HTTP (Redirect)

SSH (Restricted)
```

---

# 5. Private Subnets

Triển khai

```text
Backend API

Redis

PostgreSQL

Worker Pods
```

Không cho phép truy cập trực tiếp từ Internet.

---

# 6. Internet Gateway

Chức năng

```text
Internet Access

HTTPS Routing

External Communication
```

---

# 7. NAT Gateway

Cho phép

```text
Private Subnet

↓

Internet
```

Không cho phép Internet truy cập ngược.

---

# 8. Route Tables

Public Route

```text
Internet Gateway
```

Private Route

```text
NAT Gateway
```

---

# 9. Security Groups

Frontend

```text
443

80
```

Backend

```text
443

8080
```

Database

```text
5432

Only Backend
```

Redis

```text
6379

Only Backend
```

---

# 10. Network ACL

Inbound

```text
Allow HTTPS

Allow Internal

Deny Unknown
```

Outbound

```text
Allow Required Services
```

---

# 11. DNS

Quản lý

```text
Cloudflare DNS

AWS Route53
```

Tên miền

```text
busz.vn

api.busz.vn

admin.busz.vn

status.busz.vn
```

---

# 12. Service Discovery

Kubernetes

↓

```text
CoreDNS
```

Service

↓

```text
ClusterIP

DNS Name
```

---

# 13. Bastion Host

Chỉ dành cho

```text
DevOps

SRE
```

Yêu cầu

```text
MFA

SSH Key

IP Whitelist
```

---

# 14. VPN Access

Cho phép

```text
Internal Administration

Database Access

Maintenance
```

Không mở Database ra Internet.

---

# 15. Multi-region Network

Primary

```text
Singapore
```

Secondary

```text
Tokyo
```

Traffic

↓

```text
Geo DNS
```

---

# 16. Zero Trust Network

Nguyên tắc

```text
Verify Every Request
```

Áp dụng

```text
Users

Devices

Services

Pods
```

---

# 17. Network Monitoring

Theo dõi

```text
Bandwidth

Latency

Packet Loss

Connections

Traffic

Firewall Events
```

---

# 18. DDoS Protection

Sử dụng

```text
Cloudflare

AWS Shield (Optional)
```

Bảo vệ

```text
L3

L4

L7
```

---

# 19. Performance Targets

Network Latency

```text
<20ms (Internal)
```

API Latency

```text
<200ms
```

Availability

```text
99.9%
```

---

# 20. Security Checklist

✓ Private Database.

✓ Security Groups.

✓ VPN Access.

✓ Bastion Host.

✓ HTTPS Only.

✓ Zero Trust.

✓ WAF.

---

# 21. Acceptance Criteria

✓ Network Segmentation.

✓ High Availability.

✓ DNS hoạt động.

✓ VPN hoạt động.

✓ Bastion bảo mật.

✓ Monitoring đầy đủ.

---

# 22. Related Documents

OPS-008 Security

OPS-010 Disaster Recovery

OPS-016 Database Operations

OPS-017 Observability

---

# 23. Summary

Network Architecture của BusZ được thiết kế theo mô hình nhiều lớp với VPC, Public/Private Subnets, Security Groups và Zero Trust Networking. Kiến trúc này kết hợp Cloudflare, VPN, Bastion Host và DDoS Protection để đảm bảo hệ thống luôn an toàn, hiệu năng cao và sẵn sàng mở rộng trên nhiều vùng (Multi-region) trong môi trường Production.