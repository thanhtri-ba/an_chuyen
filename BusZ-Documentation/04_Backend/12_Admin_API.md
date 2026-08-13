# Admin API

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Backend API

Document ID

API-012

Priority

Critical

Version

1.0

---

# 1. Purpose

Admin API cung cấp toàn bộ chức năng quản trị hệ thống BusZ.

Bao gồm:

- Dashboard
- User Management
- Bus Company Management
- Route Management
- Trip Management
- Bus Management
- Driver Management
- Station Management
- Booking Management
- Payment Management
- Ticket Management
- Promotion Management
- Notification Management
- Report Management
- Audit Logs

---

# 2. Authentication

Yêu cầu

```
Bearer JWT
```

Role

```text
SUPER_ADMIN

ADMIN

OPERATOR

STAFF

MARKETING

FINANCE

SUPPORT
```

---

# 3. RBAC

| Module | Super Admin | Admin | Operator | Staff | Finance | Marketing | Support |
|----------|------------|--------|-----------|--------|-----------|-------------|------------|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Users | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | Read |
| Trips | ✅ | ✅ | ✅ | Read | ❌ | ❌ | Read |
| Routes | ✅ | ✅ | ✅ | Read | ❌ | ❌ | ❌ |
| Payments | ✅ | Read | ❌ | ❌ | ✅ | ❌ | Read |
| Promotions | ✅ | Read | ❌ | ❌ | ❌ | ✅ | ❌ |
| Audit Logs | ✅ | Read | ❌ | ❌ | ❌ | ❌ | ❌ |

---

# 4. Dashboard

Endpoint

```
GET /admin/dashboard
```

Response

```json
{
  "todayBookings":582,
  "todayRevenue":182500000,
  "activeTrips":213,
  "onlineUsers":1245,
  "pendingPayments":18
}
```

---

# 5. User Management

Endpoints

```
GET /admin/users

GET /admin/users/{id}

PATCH /admin/users/{id}

PATCH /admin/users/{id}/status

DELETE /admin/users/{id}
```

Admin có thể

- Khóa User
- Mở khóa
- Reset Password
- Verify Email

---

# 6. Bus Company Management

```
GET /admin/companies

POST /admin/companies

PATCH /admin/companies/{id}

DELETE /admin/companies/{id}
```

---

# 7. Bus Management

```
GET /admin/buses

POST /admin/buses

PATCH /admin/buses/{id}

DELETE /admin/buses/{id}
```

---

# 8. Driver Management

```
GET /admin/drivers

POST /admin/drivers

PATCH /admin/drivers/{id}

DELETE /admin/drivers/{id}
```

---

# 9. Route Management

```
GET /admin/routes

POST /admin/routes

PATCH /admin/routes/{id}

DELETE /admin/routes/{id}
```

---

# 10. Trip Management

```
GET /admin/trips

POST /admin/trips

PATCH /admin/trips/{id}

PATCH /admin/trips/{id}/cancel

PATCH /admin/trips/{id}/delay
```

---

# 11. Booking Management

```
GET /admin/bookings

GET /admin/bookings/{id}

PATCH /admin/bookings/{id}

PATCH /admin/bookings/{id}/cancel
```

---

# 12. Payment Management

```
GET /admin/payments

GET /admin/payments/{id}

POST /admin/payments/{id}/refund
```

---

# 13. Ticket Management

```
GET /admin/tickets

GET /admin/tickets/{id}

POST /admin/tickets/{id}/reissue
```

---

# 14. Promotion Management

```
GET /admin/promotions

POST /admin/promotions

PATCH /admin/promotions/{id}

DELETE /admin/promotions/{id}
```

---

# 15. Notification Management

```
POST /admin/notifications

GET /admin/notifications

POST /admin/notifications/broadcast
```

Broadcast

↓

All Users

↓

Selected Users

↓

Selected Companies

---

# 16. Reports

```
GET /admin/reports/revenue

GET /admin/reports/bookings

GET /admin/reports/payments

GET /admin/reports/trips

GET /admin/reports/users
```

Export

```
Excel

CSV

PDF
```

---

# 17. Audit Logs

```
GET /admin/audit-logs

GET /admin/audit-logs/search
```

Filter

```
User

Action

Date

Module
```

---

# 18. Business Rules

ADMIN-BR-001

Chỉ SUPER_ADMIN được tạo Admin mới.

---

ADMIN-BR-002

Operator chỉ quản lý dữ liệu của doanh nghiệp mình.

---

ADMIN-BR-003

Finance chỉ được Refund.

---

ADMIN-BR-004

Marketing không được sửa Booking.

---

ADMIN-BR-005

Support không được xem Payment Detail.

---

# 19. Error Codes

| Code | Description |
|------|-------------|
| ADMIN_001 | Permission Denied |
| ADMIN_002 | Resource Not Found |
| ADMIN_003 | Invalid Role |
| ADMIN_004 | Cannot Delete |
| ADMIN_005 | Company Restricted |

---

# 20. Security

RBAC

JWT

Audit Log

IP Whitelist

MFA (Super Admin)

HTTPS

---

# 21. Performance

Dashboard

```
<150ms
```

Reports

```
<2s
```

Export Excel

```
<5s
```

Search

```
<100ms
```

---

# 22. Sequence Diagram

```text
Admin Panel

↓

JWT

↓

RBAC Guard

↓

Admin Controller

↓

Admin Service

↓

Prisma

↓

PostgreSQL

↓

Response
```

---

# 23. Test Cases

✓ Dashboard.

✓ Create Company.

✓ Create Trip.

✓ Lock User.

✓ Refund Payment.

✓ Broadcast Notification.

✓ Export Report.

✓ RBAC Validation.

---

# 24. Acceptance Criteria

✓ RBAC chính xác.

✓ Dashboard realtime.

✓ Audit Log đầy đủ.

✓ Export thành công.

✓ Không truy cập trái phép.

---

# 25. Related Documents

API-011 Promotion API

API-013 System API

DB-016 Audit Logs

---

# 26. Summary

Admin API là trung tâm quản trị của BusZ, cung cấp đầy đủ chức năng quản lý người dùng, doanh nghiệp vận tải, tuyến xe, chuyến xe, thanh toán, vé, báo cáo và hệ thống. API được bảo vệ bằng RBAC, JWT và Audit Log, hỗ trợ nhiều vai trò quản trị với quyền hạn rõ ràng.