# System API

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Backend API

Document ID

API-013

Priority

High

Version

1.0

---

# 1. Purpose

System API cung cấp các API phục vụ vận hành, giám sát và cấu hình hệ thống BusZ.

Các API này không dành cho người dùng cuối mà phục vụ:

- DevOps
- System Administrator
- Monitoring Service
- CI/CD
- Internal Services

---

# 2. Authentication

Yêu cầu

```
Bearer JWT
```

Role

```text
SUPER_ADMIN

SYSTEM

DEVOPS
```

Một số endpoint như Health Check có thể public.

---

# 3. Endpoints Overview

| Method | Endpoint | Permission |
|----------|---------------------------|------------|
| GET | /system/health | Public |
| GET | /system/info | Admin |
| GET | /system/version | Public |
| GET | /system/config | Super Admin |
| PATCH | /system/config | Super Admin |
| GET | /system/cache | DevOps |
| DELETE | /system/cache | DevOps |
| GET | /system/metrics | DevOps |
| GET | /system/jobs | Admin |
| POST | /system/jobs/{id}/run | Super Admin |

---

# 4. Health Check

Endpoint

```text
GET /system/health
```

Response

```json
{
  "status":"UP",
  "database":"UP",
  "redis":"UP",
  "storage":"UP",
  "queue":"UP",
  "timestamp":"2026-07-04T10:00:00Z"
}
```

HTTP

```
200 OK
```

Nếu lỗi

```
503 Service Unavailable
```

---

# 5. System Info

Endpoint

```text
GET /system/info
```

Response

```json
{
  "environment":"production",
  "nodeVersion":"22.x",
  "database":"PostgreSQL",
  "cache":"Redis",
  "uptime":"5 days"
}
```

---

# 6. Version

Endpoint

```text
GET /system/version
```

Response

```json
{
  "version":"1.2.0",
  "build":"20260704",
  "commit":"abcdef123456",
  "releasedAt":"2026-07-04T09:00:00Z"
}
```

---

# 7. System Configuration

Endpoint

```text
GET /system/config
```

Ví dụ

```json
{
  "seatLockTimeout":15,
  "bookingExpire":15,
  "maintenanceMode":false,
  "defaultCurrency":"VND"
}
```

---

# 8. Update Configuration

Endpoint

```text
PATCH /system/config
```

Request

```json
{
  "seatLockTimeout":20,
  "maintenanceMode":true
}
```

Business Rules

- Chỉ SUPER_ADMIN.
- Ghi Audit Log.
- Lưu lịch sử thay đổi.

---

# 9. Cache Management

Endpoint

```text
GET /system/cache
```

Response

```json
{
  "keys":15243,
  "memory":"350MB",
  "hitRate":"96.4%"
}
```

---

# 10. Clear Cache

Endpoint

```text
DELETE /system/cache
```

Cho phép

- Clear Search Cache
- Clear Config Cache
- Clear All Cache

Không xóa Session Cache nếu không có xác nhận.

---

# 11. Metrics

Endpoint

```text
GET /system/metrics
```

Response

```json
{
  "cpu":"24%",
  "memory":"3.2GB",
  "disk":"58%",
  "requestsPerMinute":1250,
  "activeUsers":842
}
```

---

# 12. Background Jobs

Endpoint

```text
GET /system/jobs
```

Hiển thị

- Job Name
- Status
- Last Run
- Next Run
- Duration

---

# 13. Run Job

Endpoint

```text
POST /system/jobs/{id}/run
```

Ví dụ

```text
Release Expired Seats

Send Daily Report

Backup Database

Cleanup Sessions
```

---

# 14. Business Rules

SYSTEM-BR-001

Maintenance Mode chặn User API.

---

SYSTEM-BR-002

Health Check luôn hoạt động.

---

SYSTEM-BR-003

Config thay đổi phải ghi Audit.

---

SYSTEM-BR-004

Chỉ DevOps được Clear Cache.

---

SYSTEM-BR-005

Không cho phép chạy đồng thời cùng một Job nếu Job chưa hoàn thành.

---

# 15. Error Codes

| Code | Description |
|------|-------------|
| SYSTEM_001 | Service Unavailable |
| SYSTEM_002 | Invalid Configuration |
| SYSTEM_003 | Cache Clear Failed |
| SYSTEM_004 | Job Already Running |
| SYSTEM_005 | Maintenance Mode Enabled |

---

# 16. Security

JWT

RBAC

Audit Log

HTTPS

IP Whitelist

MFA (Super Admin)

---

# 17. Performance

Health Check

```text
<20ms
```

Metrics

```text
<100ms
```

Config Read

```text
<30ms
```

Cache Clear

```text
<5s
```

---

# 18. Sequence Diagram

```text
Admin

↓

System API

↓

Configuration Service

↓

Redis / PostgreSQL

↓

Response
```

---

# 19. Test Cases

✓ Health Check.

✓ Read Config.

✓ Update Config.

✓ Clear Cache.

✓ Metrics.

✓ Run Job.

✓ Maintenance Mode.

---

# 20. Acceptance Criteria

✓ Health Check chính xác.

✓ Config cập nhật thành công.

✓ Audit Log đầy đủ.

✓ Cache hoạt động.

✓ Job Scheduler hoạt động.

---

# 21. Related Documents

API-012 Admin API

API-019 Background Jobs

DB-016 Audit Logs

---

# 22. Summary

System API cung cấp các chức năng phục vụ vận hành và giám sát hệ thống BusZ, bao gồm kiểm tra sức khỏe hệ thống, quản lý cấu hình, cache, metrics và background jobs. API được bảo vệ bằng RBAC, Audit Log và các cơ chế bảo mật để đảm bảo an toàn cho môi trường vận hành.