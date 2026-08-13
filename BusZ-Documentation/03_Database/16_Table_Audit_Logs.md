# Audit Logs Table

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Database

Document ID: DB-016

Table Name

audit_logs

Priority

Critical

Version

1.0

---

# 1. Purpose

Bảng `audit_logs` lưu toàn bộ lịch sử thao tác của người dùng, nhân viên vận hành và quản trị viên trong hệ thống BusZ.

Audit Log được sử dụng để:

- Truy vết sự kiện (Traceability)
- Điều tra sự cố (Incident Investigation)
- Kiểm toán (Audit)
- Phân tích bảo mật (Security Analysis)
- Tuân thủ quy định (Compliance)

Audit Log là bảng **chỉ ghi (Append-only)** và không được phép chỉnh sửa hoặc xóa trực tiếp.

---

# 2. Responsibilities

Quản lý:

- Nhật ký thao tác
- Người thực hiện
- Đối tượng tác động
- Hành động
- Dữ liệu trước/sau
- IP Address
- Device
- User Agent
- Timestamp

---

# 3. Relationships

```text
users
1 ---- N audit_logs

bookings
1 ---- N audit_logs

payments
1 ---- N audit_logs

tickets
1 ---- N audit_logs

admins
1 ---- N audit_logs
```

---

# 4. Columns

| Column | Type | Nullable | Description |
|---------|------|----------|-------------|
| id | UUID | No | Primary Key |
| event_code | VARCHAR(40) | No | Event Code |
| user_id | UUID | Yes | User thực hiện |
| actor_type | ENUM | No | USER / ADMIN / SYSTEM |
| entity_type | VARCHAR(50) | No | Booking, Payment... |
| entity_id | UUID | Yes | ID của bản ghi |
| action | ENUM | No | CREATE, UPDATE... |
| old_data | JSONB | Yes | Dữ liệu trước |
| new_data | JSONB | Yes | Dữ liệu sau |
| ip_address | INET | Yes | IPv4/IPv6 |
| device_id | VARCHAR(255) | Yes | Thiết bị |
| user_agent | TEXT | Yes | Trình duyệt/App |
| request_id | UUID | Yes | Request Trace |
| created_at | TIMESTAMPTZ | No | Thời gian |

---

# 5. Enums

## ActorType

```text
USER

ADMIN

SYSTEM

SCHEDULER

API
```

---

## AuditAction

```text
CREATE

UPDATE

DELETE

LOGIN

LOGOUT

REGISTER

VERIFY

BOOK

PAY

REFUND

CHECK_IN

EXPORT

IMPORT

DOWNLOAD
```

---

# 6. Constraints

```text
PRIMARY KEY(id)

CHECK(action <> '')

CHECK(entity_type <> '')
```

Không sử dụng Soft Delete.

Không UPDATE dữ liệu.

---

# 7. Indexes

```text
PRIMARY KEY(id)

INDEX(user_id)

INDEX(action)

INDEX(entity_type)

INDEX(entity_id)

INDEX(created_at)

INDEX(ip_address)

INDEX(request_id)

INDEX(user_id, created_at)
```

---

# 8. SQL DDL

```sql
CREATE TABLE audit_logs (

id UUID PRIMARY KEY,

event_code VARCHAR(40) NOT NULL,

user_id UUID REFERENCES users(id),

actor_type VARCHAR(20) NOT NULL,

entity_type VARCHAR(50) NOT NULL,

entity_id UUID,

action VARCHAR(30) NOT NULL,

old_data JSONB,

new_data JSONB,

ip_address INET,

device_id VARCHAR(255),

user_agent TEXT,

request_id UUID,

created_at TIMESTAMPTZ DEFAULT NOW()

);
```

---

# 9. Prisma Model

```prisma
model AuditLog {

  id          String      @id @default(uuid())

  eventCode   String      @map("event_code")

  userId      String?     @map("user_id")

  actorType   ActorType   @map("actor_type")

  entityType  String      @map("entity_type")

  entityId    String?     @map("entity_id")

  action      AuditAction

  oldData     Json?       @map("old_data")

  newData     Json?       @map("new_data")

  ipAddress   String?     @db.Inet @map("ip_address")

  deviceId    String?     @map("device_id")

  userAgent   String?     @map("user_agent")

  requestId   String?     @map("request_id")

  createdAt   DateTime    @default(now()) @map("created_at")

  user        User?       @relation(fields:[userId], references:[id])

  @@index([userId])

  @@index([action])

  @@index([entityType])

  @@index([entityId])

  @@index([createdAt])

  @@map("audit_logs")
}
```

---

# 10. Business Rules

AUDIT-BR-001

Mọi thao tác quan trọng phải ghi Audit Log.

AUDIT-BR-002

Audit Log không được UPDATE.

AUDIT-BR-003

Audit Log không được DELETE.

AUDIT-BR-004

Dữ liệu nhạy cảm (password, token, CVV...) không được lưu trong `old_data` hoặc `new_data`.

AUDIT-BR-005

System Event cũng phải được ghi log.

AUDIT-BR-006

Một Request có thể tạo nhiều Audit Log nhưng dùng chung `request_id`.

---

# 11. Audit Flow

```text
User Action

↓

API

↓

Business Service

↓

Database Update

↓

Insert Audit Log

↓

Return Response
```

---

# 12. Sample Data

| event_code | actor | action | entity |
|------------|-------|--------|--------|
| EVT-000001 | USER | LOGIN | users |
| EVT-000002 | USER | BOOK | bookings |
| EVT-000003 | ADMIN | UPDATE | trips |
| EVT-000004 | SYSTEM | REFUND | payments |

---

# 13. API Mapping

Audit Log không public.

Chỉ hỗ trợ:

```text
GET /admin/audit-logs

GET /admin/audit-logs/{id}

GET /admin/audit-logs/search

GET /admin/audit-logs/export
```

---

# 14. Security

Chỉ:

- Super Admin
- Security Team
- Auditor

được xem Audit Log.

Không cho phép sửa hoặc xóa.

Mọi truy cập Audit Log cũng phải được ghi Audit.

---

# 15. Data Retention

Security Events

10 năm

Booking Events

10 năm

Payment Events

10 năm

System Events

5 năm

Có thể lưu trữ lạnh (Cold Storage) sau thời gian cấu hình.

---

# 16. Performance

Expected Records

500,000,000+

Insert

<5ms

Search by User

<50ms

Search by Request

<20ms

Khuyến nghị:

- Partition theo tháng hoặc quý.
- Archive dữ liệu cũ sang kho lưu trữ.

---

# 17. Test Cases

✓ Login Audit.

✓ Booking Audit.

✓ Payment Audit.

✓ Update Audit.

✓ Export Audit.

✓ Concurrent Logging.

✓ Large Volume Insert.

---

# 18. Acceptance Criteria

✓ Không mất Audit.

✓ Không chỉnh sửa Audit.

✓ Không lưu dữ liệu nhạy cảm.

✓ Tìm kiếm nhanh.

✓ Prisma Generate thành công.

✓ Migration thành công.

---

# 19. Related Tables

users

bookings

payments

tickets

notifications

system_configs

---

# 20. Summary

`audit_logs` là bảng ghi nhận lịch sử hoạt động của toàn bộ hệ thống BusZ. Đây là thành phần quan trọng để đảm bảo khả năng truy vết, kiểm toán và phân tích bảo mật, đồng thời hỗ trợ điều tra sự cố và đáp ứng các yêu cầu tuân thủ.