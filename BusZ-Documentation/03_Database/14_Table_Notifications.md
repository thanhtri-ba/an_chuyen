# Notifications Table

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Database

Document ID: DB-014

Table Name

notifications

Priority

High

Version

1.0

---

# 1. Purpose

Bảng `notifications` lưu toàn bộ thông báo được gửi tới người dùng trong hệ thống BusZ.

Thông báo có thể được tạo từ:

- Booking
- Payment
- Ticket
- Promotion
- System
- Admin
- Security

Hệ thống hỗ trợ gửi thông báo qua nhiều kênh như Push Notification, Email, SMS và In-app Notification.

---

# 2. Responsibilities

Quản lý:

- Nội dung thông báo
- Người nhận
- Loại thông báo
- Trạng thái gửi
- Trạng thái đọc
- Kênh gửi
- Lịch sử gửi

---

# 3. Relationships

```text
users
1 ---- N notifications

notification_templates
1 ---- N notifications

bookings
1 ---- N notifications

payments
1 ---- N notifications

tickets
1 ---- N notifications
```

---

# 4. Columns

| Column | Type | Nullable | Description |
|---------|------|----------|-------------|
| id | UUID | No | Primary Key |
| notification_code | VARCHAR(30) | No | Notification Code |
| user_id | UUID | No | Receiver |
| template_id | UUID | Yes | Notification Template |
| title | VARCHAR(255) | No | Title |
| message | TEXT | No | Content |
| type | ENUM | No | Notification Type |
| channel | ENUM | No | Delivery Channel |
| status | ENUM | No | Delivery Status |
| priority | ENUM | No | Priority |
| reference_type | VARCHAR(50) | Yes | Booking, Payment... |
| reference_id | UUID | Yes | Reference Record |
| scheduled_at | TIMESTAMPTZ | Yes | Scheduled Send |
| sent_at | TIMESTAMPTZ | Yes | Sent Time |
| read_at | TIMESTAMPTZ | Yes | Read Time |
| expires_at | TIMESTAMPTZ | Yes | Expiration |
| created_at | TIMESTAMPTZ | No | Created |
| updated_at | TIMESTAMPTZ | No | Updated |
| deleted_at | TIMESTAMPTZ | Yes | Soft Delete |

---

# 5. Enums

## NotificationType

```text
BOOKING

PAYMENT

TICKET

PROMOTION

SYSTEM

SECURITY

ACCOUNT

MARKETING
```

---

## NotificationChannel

```text
IN_APP

PUSH

EMAIL

SMS
```

---

## NotificationStatus

```text
PENDING

QUEUED

SENDING

SENT

DELIVERED

READ

FAILED

EXPIRED

CANCELLED
```

---

## NotificationPriority

```text
LOW

NORMAL

HIGH

URGENT
```

---

# 6. Constraints

```text
PRIMARY KEY(id)

UNIQUE(notification_code)

FOREIGN KEY(user_id)

FOREIGN KEY(template_id)
```

---

# 7. Indexes

```text
PRIMARY KEY(id)

UNIQUE(notification_code)

INDEX(user_id)

INDEX(type)

INDEX(channel)

INDEX(status)

INDEX(priority)

INDEX(created_at)

INDEX(read_at)

INDEX(user_id, status)
```

---

# 8. SQL DDL

```sql
CREATE TABLE notifications (

id UUID PRIMARY KEY,

notification_code VARCHAR(30) UNIQUE NOT NULL,

user_id UUID NOT NULL REFERENCES users(id),

template_id UUID,

title VARCHAR(255) NOT NULL,

message TEXT NOT NULL,

type VARCHAR(30) NOT NULL,

channel VARCHAR(30) NOT NULL,

status VARCHAR(30) NOT NULL,

priority VARCHAR(20) NOT NULL DEFAULT 'NORMAL',

reference_type VARCHAR(50),

reference_id UUID,

scheduled_at TIMESTAMPTZ,

sent_at TIMESTAMPTZ,

read_at TIMESTAMPTZ,

expires_at TIMESTAMPTZ,

created_at TIMESTAMPTZ DEFAULT NOW(),

updated_at TIMESTAMPTZ DEFAULT NOW(),

deleted_at TIMESTAMPTZ

);
```

---

# 9. Prisma Model

```prisma
model Notification {

  id               String   @id @default(uuid())

  notificationCode String   @unique @map("notification_code")

  userId           String   @map("user_id")

  templateId       String?  @map("template_id")

  title            String

  message          String

  type             NotificationType

  channel          NotificationChannel

  status           NotificationStatus

  priority         NotificationPriority @default(NORMAL)

  referenceType    String?  @map("reference_type")

  referenceId      String?  @map("reference_id")

  scheduledAt      DateTime? @map("scheduled_at")

  sentAt           DateTime? @map("sent_at")

  readAt           DateTime? @map("read_at")

  expiresAt        DateTime? @map("expires_at")

  createdAt        DateTime @default(now())

  updatedAt        DateTime @updatedAt

  deletedAt        DateTime?

  user             User @relation(fields:[userId], references:[id])

  template         NotificationTemplate? @relation(fields:[templateId], references:[id])

  @@index([userId])

  @@index([status])

  @@index([type])

  @@index([createdAt])

  @@map("notifications")
}
```

---

# 10. Business Rules

NOTIFICATION-BR-001

Mỗi Notification chỉ thuộc một User.

NOTIFICATION-BR-002

Notification FAILED có thể gửi lại.

NOTIFICATION-BR-003

Notification READ không được đánh dấu UNREAD.

NOTIFICATION-BR-004

Notification EXPIRED không được gửi.

NOTIFICATION-BR-005

Thông báo SECURITY luôn có Priority = URGENT.

NOTIFICATION-BR-006

Thông báo MARKETING chỉ gửi khi người dùng đã đồng ý nhận.

---

# 11. Notification Flow

```text
PENDING

↓

QUEUED

↓

SENDING

↓

SENT

↓

DELIVERED

↓

READ
```

Failure:

```text
SENDING

↓

FAILED
```

Expiration:

```text
PENDING

↓

EXPIRED
```

---

# 12. Sample Data

| notification_code | type | channel | status |
|---|---|---|---|
| NOTI-000001 | BOOKING | PUSH | DELIVERED |
| NOTI-000002 | PAYMENT | EMAIL | READ |
| NOTI-000003 | SYSTEM | IN_APP | SENT |

---

# 13. API Mapping

```text
GET /notifications

GET /notifications/{id}

PATCH /notifications/{id}/read

PATCH /notifications/read-all

DELETE /notifications/{id}

POST /notifications/resend
```

---

# 14. Security

Chỉ chủ sở hữu được xem Notification.

Admin chỉ được xem khi có quyền Support.

Marketing Notification tuân thủ cài đặt Privacy.

---

# 15. Audit

Ghi log:

- Notification Created
- Notification Queued
- Notification Sent
- Notification Delivered
- Notification Read
- Notification Failed
- Notification Deleted

---

# 16. Performance

Expected Records

20,000,000+

Load Notifications

<30ms

Unread Count

<10ms

Mark Read

<10ms

---

# 17. Test Cases

✓ Create Notification.

✓ Send Notification.

✓ Read Notification.

✓ Retry Failed Notification.

✓ Expired Notification.

✓ Mark All Read.

---

# 18. Acceptance Criteria

✓ Notification Code duy nhất.

✓ Delivery Status chính xác.

✓ Read Status cập nhật đúng.

✓ Retry hoạt động.

✓ Prisma Generate thành công.

✓ Migration thành công.

---

# 19. Related Tables

users

notification_templates

notification_logs

bookings

payments

tickets

audit_logs

---

# 20. Summary

`notifications` quản lý toàn bộ thông báo của BusZ trên nhiều kênh (In-app, Push, Email, SMS). Bảng này hỗ trợ theo dõi vòng đời thông báo từ khi tạo, gửi, nhận đến khi người dùng đọc, đồng thời tích hợp với Booking, Payment, Ticket và System Events.