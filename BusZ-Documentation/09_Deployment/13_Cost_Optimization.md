# Cost Optimization

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

DevOps & Cloud

Document ID

OPS-013

Priority

High

Version

1.0

---

# 1. Purpose

Cost Optimization định nghĩa chiến lược tối ưu chi phí vận hành hạ tầng của BusZ mà vẫn đảm bảo hiệu năng, khả năng mở rộng và độ sẵn sàng.

Mục tiêu

- Reduce Cloud Cost
- Improve Resource Utilization
- Predictable Budget
- FinOps Ready
- Sustainable Growth

---

# 2. Cost Architecture

```text
Applications

↓

Compute

↓

Storage

↓

Database

↓

Network

↓

Monitoring

↓

Monthly Cost Report
```

---

# 3. Cost Categories

```text
Compute

Database

Storage

Network

CDN

Monitoring

Logging

Backup

Licenses
```

---

# 4. Compute Optimization

Tối ưu

```text
Auto Scaling

Right Sizing

Spot Instances

Reserved Instances

Scale to Zero (Development)
```

---

# 5. Container Optimization

Tối ưu

```text
CPU Requests

Memory Requests

CPU Limits

Memory Limits
```

Không cấp phát dư tài nguyên.

---

# 6. Database Optimization

Áp dụng

```text
Read Replica

Connection Pool

Query Optimization

Index Optimization

Storage Auto Grow
```

---

# 7. Storage Optimization

Phân loại

```text
Hot Storage

Warm Storage

Cold Storage

Archive
```

Lifecycle

```text
30 Days

↓

90 Days

↓

Archive
```

---

# 8. CDN Optimization

Cache

```text
Images

CSS

JavaScript

Fonts

PDF
```

Giảm

```text
Bandwidth

Origin Requests
```

---

# 9. Network Optimization

Giảm

```text
Cross-region Traffic

Unused IP

Idle Load Balancer
```

Theo dõi

```text
Bandwidth

Data Transfer
```

---

# 10. Backup Cost

Tối ưu

```text
Incremental Backup

Compression

Deduplication

Retention Policy
```

---

# 11. Monitoring Cost

Thu thập

```text
Important Metrics Only
```

Giảm

```text
Log Retention

High-frequency Metrics

Unused Dashboards
```

---

# 12. Logging Cost

Chính sách

```text
Debug Logs

7 Days

Info Logs

30 Days

Error Logs

90 Days

Audit Logs

7 Years
```

---

# 13. Budget Management

Thiết lập

```text
Monthly Budget

Quarterly Budget

Yearly Budget
```

Thông báo khi

```text
50%

80%

90%

100%
```

---

# 14. Cost Monitoring

Theo dõi

```text
Daily Cost

Monthly Cost

Service Cost

Environment Cost

Cost Trend
```

---

# 15. Cost Allocation

Phân bổ theo

```text
Development

Testing

Staging

Production
```

Hoặc

```text
Frontend

Backend

Database

Monitoring
```

---

# 16. Cost Dashboard

Hiển thị

```text
Current Cost

Forecast

Budget

Top Expensive Services

Cost Trend
```

---

# 17. FinOps Best Practices

✓ Tag tất cả tài nguyên.

✓ Xóa tài nguyên không sử dụng.

✓ Tự động tắt môi trường Development ngoài giờ.

✓ Đánh giá chi phí hàng tháng.

✓ Review Reserved Instances định kỳ.

---

# 18. Cost Alerts

Thông báo khi

```text
Unexpected Cost Increase

Storage Growth

Bandwidth Spike

Idle Resources
```

---

# 19. Performance vs Cost

Ưu tiên

```text
Critical Services

↓

Performance First
```

```text
Development

↓

Cost First
```

---

# 20. Cost Optimization Targets

Infrastructure Utilization

```text
>70%
```

Unused Resources

```text
<5%
```

Storage Waste

```text
<10%
```

Monthly Budget Deviation

```text
<10%
```

---

# 21. Acceptance Criteria

✓ Auto Scaling tiết kiệm chi phí.

✓ Budget Alerts hoạt động.

✓ Cost Dashboard chính xác.

✓ Resource Tagging đầy đủ.

✓ Lifecycle Policies hoạt động.

✓ FinOps Review hàng tháng.

---

# 22. Related Documents

OPS-011 Performance

OPS-012 Scalability

OPS-014 Secrets Management

OPS-020 Runbook

---

# 23. Summary

Cost Optimization của BusZ áp dụng các nguyên tắc FinOps để tối ưu chi phí hạ tầng thông qua Auto Scaling, Right Sizing, Lifecycle Policies và Cost Monitoring. Hệ thống cung cấp Dashboard, Budget Alerts và báo cáo chi phí nhằm cân bằng giữa hiệu năng, khả năng mở rộng và ngân sách vận hành.