# Database Migration Strategy

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Database

Document ID: DB-019

Priority

Critical

Version

1.0

---

# 1. Purpose

Tài liệu này định nghĩa quy trình quản lý thay đổi cấu trúc cơ sở dữ liệu (Database Migration) của BusZ.

Migration đảm bảo:

- Đồng bộ schema giữa các môi trường.
- Quản lý phiên bản cơ sở dữ liệu.
- Hỗ trợ CI/CD.
- Triển khai an toàn.
- Rollback khi cần thiết.

---

# 2. Objectives

Mục tiêu:

- Không mất dữ liệu.
- Có thể triển khai tự động.
- Có thể rollback.
- Dễ theo dõi lịch sử thay đổi.
- Đồng bộ giữa Development, Staging và Production.

---

# 3. Technology

ORM

Prisma ORM

Migration Tool

Prisma Migrate

Database

PostgreSQL 17+

---

# 4. Migration Lifecycle

```text
Developer

↓

Update schema.prisma

↓

Generate Migration

↓

Review SQL

↓

Commit

↓

CI/CD

↓

Staging

↓

Production
```

---

# 5. Naming Convention

Định dạng:

```text
YYYYMMDDHHMM_description
```

Ví dụ:

```text
202607041030_initial_schema

202607051400_add_trip_table

202607061000_add_payment_indexes

202607081130_update_booking_status
```

---

# 6. Folder Structure

```text
prisma/

├── schema.prisma

├── seed.ts

└── migrations/

      ├── 202607041030_initial_schema

      ├── migration.sql

      ├── 202607051400_add_routes

      └── migration.sql
```

---

# 7. Development Workflow

```text
Update schema.prisma

↓

prisma migrate dev

↓

Review SQL

↓

Test

↓

Commit
```

---

# 8. Production Workflow

```text
Git Pull

↓

Backup Database

↓

Run Migration

↓

Verify

↓

Deploy Backend
```

---

# 9. Prisma Commands

Generate Migration

```bash
npx prisma migrate dev --name add_trips
```

Generate Client

```bash
npx prisma generate
```

Deploy Migration

```bash
npx prisma migrate deploy
```

Reset Database

```bash
npx prisma migrate reset
```

Status

```bash
npx prisma migrate status
```

---

# 10. Seed Strategy

Seed dữ liệu bắt buộc:

```text
Roles

Permissions

Admin User

Bus Companies

Stations

Routes

System Config

Notification Templates
```

Lệnh:

```bash
npx prisma db seed
```

---

# 11. Rollback Strategy

Prisma không hỗ trợ rollback tự động.

Quy trình:

```text
Backup

↓

Migration

↓

Failure

↓

Restore Backup

↓

Deploy Previous Version
```

---

# 12. Environment Strategy

Development

```text
Local PostgreSQL
```

Staging

```text
Supabase Staging
```

Production

```text
Supabase Production
```

Mỗi môi trường có:

```text
DATABASE_URL
```

riêng.

---

# 13. Migration Rules

✓ Một Migration chỉ chứa một thay đổi logic lớn.

✓ Không sửa Migration đã chạy Production.

✓ Không xóa Migration cũ.

✓ Luôn review file SQL trước khi merge.

✓ Migration phải chạy thành công trên Staging trước Production.

---

# 14. CI/CD Integration

Pipeline:

```text
Install Dependencies

↓

Prisma Validate

↓

Generate Client

↓

Run Migration

↓

Run Tests

↓

Deploy
```

---

# 15. Backup Before Migration

Bắt buộc:

```text
Daily Backup

↓

Before Production Migration

↓

Manual Snapshot
```

---

# 16. Verification Checklist

Sau Migration cần kiểm tra:

✓ Tất cả bảng được tạo.

✓ Foreign Key đúng.

✓ Index được tạo.

✓ Constraint đúng.

✓ Seed thành công.

✓ API hoạt động.

✓ Không mất dữ liệu.

---

# 17. Common Issues

Migration Conflict

↓

Resolve bằng cách đồng bộ schema.

---

Missing Migration

↓

Chạy:

```bash
npx prisma migrate resolve
```

---

Schema Drift

↓

So sánh Database và schema.prisma.

---

# 18. Best Practices

✓ Review SQL trước khi chạy.

✓ Backup Production.

✓ Migration nhỏ, dễ kiểm soát.

✓ Không sửa dữ liệu trực tiếp trong Migration nếu không cần thiết.

✓ Seed tách riêng với Migration.

---

# 19. Related Documents

DB-004 Prisma Schema

DB-017 Index Strategy

DB-018 Constraints

DB-020 Backup Strategy

---

# 20. Summary

Chiến lược Migration của BusZ sử dụng Prisma Migrate để quản lý phiên bản cơ sở dữ liệu. Quy trình được thiết kế nhằm đảm bảo triển khai an toàn, có khả năng kiểm soát thay đổi, đồng bộ giữa các môi trường và giảm thiểu rủi ro trong quá trình phát triển cũng như vận hành hệ thống.