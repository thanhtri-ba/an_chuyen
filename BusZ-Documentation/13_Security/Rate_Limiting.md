# Rate Limiting

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Security

Document ID

SEC-005

Priority

Critical

Version

1.0

---

# 1. Purpose

Rate Limiting định nghĩa cơ chế giới hạn số lượng yêu cầu (Request) gửi đến hệ thống BusZ nhằm bảo vệ API khỏi Brute Force Attack, DDoS, API Abuse và đảm bảo tính ổn định của toàn bộ nền tảng.

Mục tiêu

- Chống API Abuse
- Chống Brute Force
- Chống DDoS
- Bảo vệ Authentication
- Đảm bảo High Availability

---

# 2. Objectives

```text
Rate Limiting

API Protection

DoS Prevention

Traffic Control

Fair Usage
```

---

# 3. Architecture

```text
Client

↓

API Gateway

↓

Rate Limiter

↓

Authentication

↓

Backend Services
```

---

# 4. Limiting Levels

```text
Global

IP Address

User

API Key

Device

Endpoint
```

---

# 5. Protected APIs

```text
Authentication

Register

Login

OTP

Password Reset

Payment

Booking

Admin APIs
```

---

# 6. Rate Limits

Guest

```text
100 Requests / Minute
```

Authenticated User

```text
300 Requests / Minute
```

Admin

```text
1000 Requests / Minute
```

Internal Services

```text
Unlimited
```

---

# 7. Sensitive Endpoints

Login

```text
5 Attempts

15 Minutes
```

OTP

```text
3 Requests

5 Minutes
```

Forgot Password

```text
5 Requests

30 Minutes
```

Payment

```text
30 Requests

Minute
```

---

# 8. Algorithms

Có thể sử dụng

```text
Token Bucket

Leaky Bucket

Sliding Window

Fixed Window

Rolling Window
```

Khuyến nghị

```text
Sliding Window

+

Token Bucket
```

---

# 9. Distributed Rate Limiting

Sử dụng

```text
Redis

↓

Atomic Counter

↓

Expiration

↓

Decision
```

---

# 10. API Gateway

Có thể triển khai

```text
Nginx

Kong

Traefik

Envoy

Cloudflare
```

---

# 11. Rate Limit Response

HTTP Status

```text
429 Too Many Requests
```

Response

```json
{
  "success": false,
  "error": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 60
}
```

---

# 12. Retry Strategy

Client

```text
Exponential Backoff

Retry After Header

Maximum Retry

Circuit Breaker
```

---

# 13. Monitoring

Theo dõi

```text
Blocked Requests

429 Responses

Attack Attempts

Failed Logins

Traffic Spikes

Abnormal Users
```

---

# 14. Alert Rules

```text
100 Failed Logins

↓

Security Alert

1000 Requests / Minute

↓

Potential DDoS

Abnormal API Usage

↓

Security Investigation
```

---

# 15. Whitelist

```text
Internal APIs

Monitoring

Health Check

Trusted Services
```

---

# 16. Blacklist

```text
Malicious IP

Bot

Attack Source

Compromised Device
```

---

# 17. Performance Targets

```text
Rate Limit Check

<5 ms

Redis Lookup

<2 ms

Gateway Latency

<10 ms

Availability

99.99%
```

---

# 18. Security Best Practices

```text
API Gateway

Redis Cluster

IP Reputation

Bot Detection

CAPTCHA

Geo Blocking
```

---

# 19. Acceptance Criteria

✓ Global Rate Limiting

✓ User Rate Limiting

✓ Login Protection

✓ Payment Protection

✓ Redis Distributed Limiter

✓ Monitoring Dashboard

---

# 20. Related Documents

Authentication

Authorization

JWT

Encryption

API Gateway

Monitoring

---

# 21. Summary

Rate Limiting của BusZ bảo vệ toàn bộ hệ thống khỏi Brute Force, API Abuse và DDoS bằng cách áp dụng nhiều lớp giới hạn theo IP, người dùng, thiết bị và Endpoint. Kiến trúc sử dụng Redis kết hợp API Gateway giúp triển khai Rate Limiting phân tán, hiệu năng cao và có khả năng mở rộng cho môi trường Production.