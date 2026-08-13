# Rate Limiting

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Backend API

Document ID

API-016

Priority

Critical

Version

1.0

---

# 1. Purpose

Rate Limiting bảo vệ hệ thống BusZ khỏi:

- Brute Force
- DDoS
- Spam API
- Abuse
- Resource Exhaustion

Đồng thời đảm bảo tài nguyên được phân phối công bằng giữa các người dùng.

---

# 2. Objectives

Mục tiêu

✓ Chống Spam

✓ Chống Brute Force

✓ Bảo vệ Database

✓ Bảo vệ Payment Gateway

✓ Bảo vệ Authentication

---

# 3. Rate Limit Strategy

Áp dụng theo:

```text
IP Address

↓

Authenticated User

↓

API Key

↓

Device ID
```

---

# 4. Algorithm

Sử dụng

```text
Sliding Window
```

Kết hợp

```text
Token Bucket
```

Redis lưu bộ đếm.

---

# 5. Rate Limits

## Public APIs

```text
60 requests / phút / IP
```

---

## Login

```text
10 requests / phút / IP
```

---

## Register

```text
5 requests / giờ / IP
```

---

## Forgot Password

```text
3 requests / giờ / Email
```

---

## Search Trip

```text
120 requests / phút / User
```

---

## Booking

```text
20 requests / phút / User
```

---

## Payment

```text
10 requests / phút / User
```

---

## Admin APIs

```text
300 requests / phút
```

---

# 6. Redis Keys

```text
rate:login:{ip}

rate:user:{userId}

rate:payment:{userId}

rate:search:{userId}

rate:booking:{userId}
```

TTL

```
60 seconds
```

---

# 7. HTTP Headers

Response

```text
X-RateLimit-Limit

X-RateLimit-Remaining

X-RateLimit-Reset

Retry-After
```

Ví dụ

```text
X-RateLimit-Limit:120

X-RateLimit-Remaining:34

Retry-After:25
```

---

# 8. Exceeded Limit

HTTP

```
429 Too Many Requests
```

Response

```json
{
  "success": false,
  "error": {
    "code": "RATE_001",
    "message": "Rate limit exceeded."
  }
}
```

---

# 9. Whitelist

Không giới hạn:

```text
Health Check

Internal Services

Monitoring

Trusted IP
```

---

# 10. Blacklist

Tự động Block

```
30 phút
```

Nếu:

- Login Fail liên tục.
- Spam Payment.
- Spam Booking.
- Scan API.

---

# 11. Brute Force Protection

Login Fail

```
5 lần
```

↓

Delay

```
30 giây
```

↓

10 lần

↓

Lock

```
30 phút
```

---

# 12. DDoS Protection

Cloudflare

↓

Nginx

↓

NestJS

↓

Redis Rate Limit

↓

Application

---

# 13. Business Rules

RATE-BR-001

Login có giới hạn riêng.

---

RATE-BR-002

Payment giới hạn thấp hơn Search.

---

RATE-BR-003

Admin có giới hạn riêng.

---

RATE-BR-004

Không giới hạn Webhook đã xác thực.

---

RATE-BR-005

Health Check luôn được phép truy cập.

---

# 14. Error Codes

| Code | Description |
|------|-------------|
| RATE_001 | Rate Limit Exceeded |
| RATE_002 | Too Many Login Attempts |
| RATE_003 | IP Blocked |
| RATE_004 | Account Temporarily Locked |

---

# 15. Monitoring

Theo dõi:

- Top IP.
- Top User.
- Rejected Requests.
- Login Failures.
- Rate Limit Hit.

---

# 16. Performance

Redis Lookup

```
<5ms
```

Limit Check

```
<10ms
```

---

# 17. Sequence Diagram

```text
Request

↓

Rate Limit Guard

↓

Redis

↓

Allowed?

↓

Yes

↓

Controller

↓

Response
```

Nếu vượt giới hạn

↓

429

---

# 18. Test Cases

✓ Public Limit.

✓ Login Limit.

✓ Booking Limit.

✓ Payment Limit.

✓ Retry-After.

✓ Blacklist.

✓ Whitelist.

---

# 19. Acceptance Criteria

✓ Redis hoạt động.

✓ 429 chính xác.

✓ Header đầy đủ.

✓ Không ảnh hưởng API hợp lệ.

✓ Chống Brute Force.

---

# 20. Related Documents

API-003 Authentication API

API-017 API Security

API-020 Backend Deployment

---

# 21. Summary

Rate Limiting là lớp bảo vệ đầu tiên của Backend BusZ, sử dụng Redis kết hợp Sliding Window và Token Bucket để kiểm soát lưu lượng truy cập, ngăn chặn lạm dụng và đảm bảo hệ thống luôn ổn định ngay cả khi có lượng truy cập lớn hoặc bị tấn công.