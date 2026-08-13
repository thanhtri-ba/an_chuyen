# Database Backup Strategy

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Database

Document ID: DB-020

Priority

Critical

Version

1.0

---

# 1. Purpose

Tài liệu này định nghĩa chiến lược sao lưu (Backup) và khôi phục (Recovery) cơ sở dữ liệu của BusZ nhằm đảm bảo:

- Không mất dữ liệu.
- Khôi phục nhanh khi xảy ra sự cố.
- Đảm bảo tính liên tục của dịch vụ.
- Đáp ứng yêu cầu vận hành và kiểm toán.

---

# 2. Objectives

Mục tiêu:

✓ Backup tự động.

✓ Hỗ trợ Point-in-Time Recovery (PITR).

✓ Backup được mã hóa.

✓ Kiểm tra khả năng khôi phục định kỳ.

✓ Đảm bảo RTO và RPO theo SLA.

---

# 3. Backup Types

## Full Backup

Toàn bộ cơ sở dữ liệu.

Tần suất:

```text
Weekly
```

---

## Incremental Backup

Chỉ sao lưu phần thay đổi.

Tần suất:

```text
Daily
```

---

## WAL Archive

Lưu Write-Ahead Log.

Phục vụ:

```text
Point-in-Time Recovery
```

Tần suất:

```text
Continuous
```

---

# 4. Backup Schedule

| Type | Frequency | Retention |
|------|-----------|-----------|
| Full Backup | Weekly | 12 Weeks |
| Incremental | Daily | 30 Days |
| WAL Archive | Continuous | 14 Days |
| Monthly Snapshot | Monthly | 12 Months |
| Yearly Archive | Yearly | 7 Years |

---

# 5. Storage Strategy

Primary

```text
Supabase Backup
```

Secondary

```text
AWS S3
```

Archive

```text
Cold Storage
```

---

# 6. Backup Encryption

Thuật toán:

```text
AES-256
```

Backup Key

↓

Secret Manager

Không lưu Key trong Source Code.

---

# 7. Point-in-Time Recovery (PITR)

Cho phép khôi phục tới một thời điểm cụ thể.

Ví dụ:

```text
09:00

↓

Lỗi xảy ra

↓

09:17

↓

Restore

↓

09:16:59
```

---

# 8. Recovery Objectives

## RPO

Recovery Point Objective

```text
≤ 5 phút
```

---

## RTO

Recovery Time Objective

```text
≤ 30 phút
```

---

# 9. Disaster Recovery

Kịch bản:

- Mất Database.
- Hỏng ổ đĩa.
- Lỗi Migration.
- Xóa nhầm dữ liệu.
- Ransomware.
- Mất Region.

Quy trình:

```text
Detect

↓

Isolate

↓

Restore Backup

↓

Replay WAL

↓

Verify

↓

Resume Service
```

---

# 10. Restore Procedure

1.

Dừng ghi dữ liệu.

↓

2.

Xác định thời điểm cần khôi phục.

↓

3.

Restore Full Backup.

↓

4.

Replay WAL.

↓

5.

Kiểm tra dữ liệu.

↓

6.

Khởi động lại hệ thống.

---

# 11. Verification Checklist

Sau khi Restore:

✓ Database Online.

✓ Tables đầy đủ.

✓ Foreign Key chính xác.

✓ Index hoạt động.

✓ Prisma Client hoạt động.

✓ API hoạt động.

✓ Booking không mất.

✓ Payment không mất.

---

# 12. Backup Monitoring

Theo dõi:

- Backup Success.
- Backup Failed.
- Backup Duration.
- Backup Size.
- Restore Duration.

Cảnh báo:

- Backup thất bại.
- Backup quá thời gian.
- Dung lượng bất thường.

---

# 13. Retention Policy

Audit Logs

```text
10 Years
```

Payments

```text
10 Years
```

Bookings

```text
10 Years
```

Notifications

```text
180 Days
```

Sessions

```text
30 Days
```

OTP

```text
5 Minutes
```

---

# 14. Security

✓ Backup mã hóa AES-256.

✓ Chỉ DBA và DevOps được truy cập.

✓ Nhật ký truy cập Backup phải được ghi lại.

✓ Backup không chứa Secret ở dạng rõ.

---

# 15. Testing Strategy

Định kỳ:

```text
Monthly Restore Test
```

Kiểm tra:

- Restore thành công.
- Dữ liệu đầy đủ.
- API hoạt động.
- Booking hoạt động.
- Payment hoạt động.

---

# 16. High Availability

Kiến trúc:

```text
Primary Database

↓

Read Replica

↓

Automatic Failover

↓

Backup Cluster
```

---

# 17. Multi-Region Strategy

Region A

↓

Primary

↓

Region B

↓

Replica

↓

Region C

↓

Backup Archive

---

# 18. Best Practices

✓ Backup tự động.

✓ Kiểm tra Restore định kỳ.

✓ Không lưu Backup trên cùng máy chủ Production.

✓ Mã hóa Backup.

✓ Theo dõi trạng thái Backup.

✓ Tài liệu hóa quy trình khôi phục.

---

# 19. Related Documents

DB-001 Database Overview

DB-004 Prisma Schema

DB-019 Migration Strategy

---

# 20. Summary

Chiến lược Backup của BusZ kết hợp Full Backup, Incremental Backup và WAL Archive để đảm bảo khả năng khôi phục dữ liệu nhanh chóng, giảm thiểu mất mát dữ liệu và duy trì hoạt động ổn định của hệ thống trong mọi tình huống sự cố.