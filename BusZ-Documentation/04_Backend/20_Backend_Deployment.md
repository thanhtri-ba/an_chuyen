# Background Jobs

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Backend API

Document ID

API-019

Priority

Critical

Version

1.0

---

# 1. Purpose

Background Jobs xử lý các tác vụ không cần phản hồi ngay cho người dùng.

Mục tiêu:

- Giảm thời gian phản hồi API.
- Xử lý tác vụ bất đồng bộ.
- Tăng khả năng mở rộng.
- Đảm bảo tính ổn định của hệ thống.

---

# 2. Technology

Queue

```text
BullMQ
```

Broker

```text
Redis
```

Scheduler

```text
NestJS Scheduler
```

Worker

```text
BullMQ Worker
```

---

# 3. Job Categories

```text
Booking

Payment

Notification

Ticket

Email

SMS

Cache

Report

Cleanup

Backup
```

---

# 4. Queue Architecture

```text
REST API

↓

Queue

↓

Redis

↓

Worker

↓

Database

↓

Notification
```

---

# 5. Queues

```text
booking_queue

payment_queue

notification_queue

email_queue

sms_queue

ticket_queue

report_queue

cleanup_queue

backup_queue
```

---

# 6. Booking Jobs

### Release Expired Seats

```text
Every Minute
```

Business Flow

```text
Find Locked Seats

↓

Expired?

↓

Release

↓

Update Seat Status

↓

Audit Log
```

---

### Cancel Expired Booking

```text
Every Minute
```

Business Flow

```text
Find Booking

↓

Expired

↓

Cancel

↓

Release Seats

↓

Notification
```

---

# 7. Payment Jobs

Retry Payment Verification

```text
Every 5 Minutes
```

Sync Payment Gateway

```text
Every 10 Minutes
```

Check Pending Refund

```text
Every Hour
```

---

# 8. Ticket Jobs

Generate PDF

↓

Store PDF

↓

Send Email

↓

Push Notification

---

# 9. Notification Jobs

Queue

↓

Email

↓

Push

↓

SMS

↓

Retry

---

# 10. Report Jobs

Daily Revenue

```text
00:10
```

Weekly Report

```text
Monday 01:00
```

Monthly Report

```text
First Day 02:00
```

---

# 11. Cleanup Jobs

Expired Sessions

↓

Delete

Every Hour

---

OTP Cleanup

↓

Every 5 Minutes

---

Notification Archive

↓

Every Day

---

Temporary Files

↓

Every Day

---

# 12. Backup Jobs

Database Backup

```text
02:00 Daily
```

Incremental Backup

```text
Every 6 Hours
```

Verify Backup

```text
03:00 Daily
```

---

# 13. Retry Strategy

Retry

```
3 lần
```

Delay

```text
30s

↓

2m

↓

10m
```

Backoff

```text
Exponential
```

---

# 14. Dead Letter Queue

Tên Queue

```text
dead_letter_queue
```

Lưu

- Payload
- Error
- Retry Count
- Worker
- Stack
- Timestamp

---

# 15. Cron Schedule

| Job | Schedule |
|------|----------|
| Release Seat | Every Minute |
| Cancel Booking | Every Minute |
| Cleanup OTP | Every 5 Minutes |
| Payment Sync | Every 10 Minutes |
| Session Cleanup | Hourly |
| Revenue Report | Daily |
| Backup | Daily |
| Monthly Report | Monthly |

---

# 16. Monitoring

Theo dõi

- Waiting Jobs
- Active Jobs
- Failed Jobs
- Retry Jobs
- Completed Jobs

Dashboard

```text
Bull Board
```

---

# 17. Business Rules

JOB-BR-001

Không chạy đồng thời cùng một Job.

---

JOB-BR-002

Job thất bại phải Retry.

---

JOB-BR-003

Retry vượt giới hạn

↓

Dead Letter Queue.

---

JOB-BR-004

Job phải Idempotent.

---

JOB-BR-005

Job quan trọng phải ghi Audit Log.

---

# 18. Error Codes

| Code | Description |
|------|-------------|
| JOB_001 | Job Failed |
| JOB_002 | Queue Full |
| JOB_003 | Worker Offline |
| JOB_004 | Retry Exceeded |
| JOB_005 | Invalid Payload |

---

# 19. Performance

Queue Push

```text
<10ms
```

Worker Start

```text
<50ms
```

Email Send

```text
<2s
```

Notification

```text
<500ms
```

---

# 20. Sequence Diagram

```text
API

↓

Queue

↓

Redis

↓

Worker

↓

Business Service

↓

Database

↓

Notification
```

---

# 21. Test Cases

✓ Release Seat.

✓ Cancel Booking.

✓ Generate Ticket.

✓ Retry Email.

✓ Queue Failure.

✓ Dead Letter Queue.

✓ Backup.

✓ Report Generation.

---

# 22. Acceptance Criteria

✓ Queue hoạt động.

✓ Retry đúng.

✓ Dead Letter Queue.

✓ Cron hoạt động.

✓ Monitoring đầy đủ.

---

# 23. Related Documents

API-007 Booking API

API-010 Notification API

API-018 Webhook API

API-020 Backend Deployment

---

# 24. Summary

Background Jobs của BusZ sử dụng BullMQ và Redis để xử lý các tác vụ bất đồng bộ như giải phóng ghế, hủy booking quá hạn, gửi email, thông báo, tạo báo cáo và sao lưu dữ liệu. Kiến trúc này giúp API phản hồi nhanh, hệ thống ổn định và dễ dàng mở rộng khi lưu lượng tăng cao.