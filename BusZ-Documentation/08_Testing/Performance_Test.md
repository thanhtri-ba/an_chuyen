# Performance Test

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Testing

Document ID

TEST-005

Priority

Critical

Version

1.0

---

# 1. Purpose

Performance Test định nghĩa chiến lược kiểm thử hiệu năng của hệ thống BusZ nhằm đảm bảo ứng dụng hoạt động ổn định dưới tải lớn.

Mục tiêu

- Đảm bảo tốc độ phản hồi
- Đánh giá khả năng chịu tải
- Xác định giới hạn hệ thống
- Phát hiện bottleneck
- Đảm bảo khả năng mở rộng

---

# 2. Testing Scope

Áp dụng cho

```text
Flutter App

Passenger Website

Admin Portal

Backend API

PostgreSQL

Redis

Payment Gateway

Notification Service
```

---

# 3. Performance Test Overview

```text
Virtual Users

↓

Load Generator

↓

REST API

↓

Business Services

↓

Database

↓

Cache

↓

Response Metrics
```

---

# 4. Performance Test Types

```text
Load Test

Stress Test

Spike Test

Endurance Test

Scalability Test

Volume Test

Capacity Test
```

---

# 5. Critical Business Flows

Các luồng cần kiểm thử

```text
Login

Search Trip

Load Seat Layout

Hold Seat

Create Booking

Payment

Generate Ticket

Check-in

Admin Dashboard
```

---

# 6. Load Test

Mục tiêu

```text
Mô phỏng số lượng người dùng bình thường.
```

Virtual Users

```text
100

250

500

1000
```

---

# 7. Stress Test

Mục tiêu

```text
Đẩy hệ thống vượt quá tải thiết kế.
```

Virtual Users

```text
1500

2000

3000

5000
```

---

# 8. Spike Test

Mô phỏng

```text
100

↓

2000 Users

↓

100 Users
```

Đánh giá

```text
Recovery Time

Error Rate

System Stability
```

---

# 9. Endurance Test

Thời gian

```text
6 Hours

12 Hours

24 Hours

48 Hours
```

Theo dõi

```text
Memory Leak

CPU

Database Connection

Cache

Response Time
```

---

# 10. Login Performance

API

```text
POST /auth/login
```

Target

```text
<500 ms
```

Concurrent Users

```text
1000
```

---

# 11. Search Performance

API

```text
GET /search
```

Target

```text
<800 ms
```

Concurrent Search

```text
2000 Users
```

---

# 12. Seat Performance

Kiểm tra

```text
Load Seat Layout

Hold Seat

Release Seat

Refresh Seat
```

Target

```text
<300 ms
```

---

# 13. Booking Performance

API

```text
POST /bookings
```

Target

```text
<700 ms
```

Concurrent Booking

```text
500 Users
```

---

# 14. Payment Performance

Kiểm tra

```text
Create Payment

Webhook

Refund
```

Target

```text
<500 ms
```

---

# 15. Ticket Performance

Kiểm tra

```text
Generate Ticket

Generate QR

Download PDF

Check-in
```

Target

```text
<500 ms
```

---

# 16. Database Performance

Theo dõi

```text
Query Time

Index Usage

Transaction Time

Connection Pool

Deadlock
```

---

# 17. Redis Performance

Kiểm tra

```text
Session

JWT

OTP

Seat Hold

Cache Hit
```

---

# 18. Storage Performance

Kiểm tra

```text
Avatar Upload

Image Download

Ticket PDF

Review Images
```

---

# 19. Network Performance

Theo dõi

```text
Latency

Bandwidth

Packet Loss

Retry
```

---

# 20. Resource Monitoring

Theo dõi

```text
CPU

RAM

Disk

Network

Container

Thread Pool
```

---

# 21. Database Monitoring

Theo dõi

```text
Slow Query

Connections

Locks

Transactions

Replication
```

---

# 22. Cache Monitoring

Theo dõi

```text
Cache Hit Ratio

Cache Miss

Eviction

Memory Usage
```

---

# 23. Error Monitoring

Theo dõi

```text
HTTP Errors

Timeout

Connection Refused

Database Errors

Payment Errors
```

---

# 24. Performance Metrics

Đo lường

```text
Average Response Time

95th Percentile

99th Percentile

TPS

RPS

Throughput

Error Rate
```

---

# 25. Success Criteria

```text
Error Rate <1%

CPU <80%

Memory <80%

Database CPU <70%

Response Time đạt mục tiêu
```

---

# 26. Test Environment

```text
Production-like Environment

Docker

Redis

PostgreSQL

Load Balancer
```

---

# 27. Test Tools

Có thể sử dụng

```text
k6

Apache JMeter

Locust

Gatling

Grafana

Prometheus

PostgreSQL Exporter
```

---

# 28. Performance Report

Báo cáo

```text
Average Response

Max Response

Min Response

TPS

Concurrent Users

Error Rate

Resource Usage

Recommendations
```

---

# 29. Acceptance Criteria

✓ API đạt Response Time

✓ Booking ổn định

✓ Payment ổn định

✓ Không xảy ra Overbooking

✓ Error Rate <1%

✓ Không Memory Leak

✓ CPU và RAM trong giới hạn

---

# 30. Related Documents

Test Strategy

API Test

Integration Test

Security Test

Deployment Architecture

Monitoring Architecture

Database Schema

---

# 31. Summary

Performance Test đảm bảo hệ thống BusZ đáp ứng yêu cầu về tốc độ, khả năng chịu tải và độ ổn định trong các điều kiện vận hành thực tế. Việc kiểm thử bao gồm nhiều kịch bản như Load Test, Stress Test, Spike Test và Endurance Test nhằm phát hiện sớm các điểm nghẽn và đảm bảo hệ thống có thể phục vụ lượng lớn người dùng mà vẫn duy trì trải nghiệm tốt.