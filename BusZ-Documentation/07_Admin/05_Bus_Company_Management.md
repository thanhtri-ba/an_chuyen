# Bus Company Management

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Admin Web

Document ID

ADM-005

Priority

Critical

Version

1.0

---

# 1. Purpose

Bus Company Management cho phép quản trị viên quản lý toàn bộ các nhà xe đối tác trong hệ thống BusZ.

Bao gồm:

- Quản lý hồ sơ nhà xe
- Quản lý giấy phép
- Quản lý đội xe
- Quản lý tài xế
- Quản lý tuyến hoạt động
- Theo dõi doanh thu
- Đánh giá chất lượng

---

# 2. User Flow

```text
Dashboard

↓

Bus Companies

↓

Search

↓

View Detail

↓

Edit

↓

Save
```

---

# 3. Company List

Hiển thị

- Company ID
- Logo
- Tên nhà xe
- Người đại diện
- Email
- Hotline
- Thành phố
- Trạng thái
- Rating

---

# 4. Search

Cho phép tìm theo

```text
Company ID

Company Name

Representative

Email

Phone
```

Search Delay

```text
300ms
```

---

# 5. Filters

Theo

```text
Status

Province

Rating

Contract Status

Created Date
```

---

# 6. Create Company

Thông tin

```text
Company Name

Business License

Tax Code

Representative

Phone

Email

Address

Website
```

Upload

```text
Logo

Business License

Insurance Documents
```

---

# 7. Edit Company

Cho phép cập nhật

```text
Logo

Address

Representative

Phone

Email

Website

Status
```

Không sửa

```text
Company ID

Created Date
```

---

# 8. Company Status

```text
PENDING

ACTIVE

SUSPENDED

INACTIVE

TERMINATED
```

---

# 9. Fleet Management

Hiển thị

- Vehicle ID
- License Plate
- Vehicle Type
- Seat Capacity
- Status

Cho phép

```text
Add

Edit

Retire
```

---

# 10. Driver Management

Thông tin

```text
Driver Name

License Number

Phone

Experience

Status
```

Trạng thái

```text
ACTIVE

ON_LEAVE

SUSPENDED
```

---

# 11. Operating Routes

Hiển thị

- Tuyến
- Số chuyến/ngày
- Tỷ lệ lấp đầy
- Doanh thu

---

# 12. Company Rating

Hiển thị

```text
Average Rating

Review Count

Complaint Count

Cancellation Rate
```

---

# 13. Contract Information

Thông tin

```text
Contract Number

Start Date

End Date

Revenue Share

Status
```

Cảnh báo khi hợp đồng sắp hết hạn.

---

# 14. Revenue Dashboard

Hiển thị

```text
Daily Revenue

Monthly Revenue

Annual Revenue

Booking Count

Refund Count
```

Biểu đồ

```text
Line Chart

Bar Chart
```

---

# 15. Documents

Quản lý

```text
Business License

Insurance

Vehicle Registration

Operating Permit
```

Cho phép

```text
Upload

Replace

Download

Delete
```

---

# 16. Bulk Actions

Cho phép

```text
Activate

Suspend

Export

Send Notification
```

---

# 17. Export

Định dạng

```text
Excel

CSV

PDF
```

Bao gồm

- Danh sách nhà xe
- Doanh thu
- Đội xe

---

# 18. API Integration

```text
GET /admin/companies

GET /admin/companies/{id}

POST /admin/companies

PATCH /admin/companies/{id}

PATCH /admin/companies/{id}/status

GET /admin/companies/{id}/fleet

GET /admin/companies/{id}/drivers

GET /admin/companies/{id}/revenue
```

---

# 19. Component Tree

```text
CompanyManagementPage

↓

FilterBar

↓

SearchBox

↓

CompanyTable

↓

CompanyDetailDrawer

↓

FleetSection

↓

DriverSection

↓

RevenueChart

↓

DocumentManager
```

---

# 20. Performance

Company List

```text
<200ms
```

Fleet Load

```text
<300ms
```

Revenue Chart

```text
<500ms
```

Export

```text
<5s
```

---

# 21. UX Guidelines

✓ Hiển thị logo nhà xe.

✓ Trạng thái màu sắc rõ ràng.

✓ Tìm kiếm theo thời gian thực.

✓ Upload tài liệu bằng kéo-thả (Drag & Drop).

✓ Cảnh báo khi giấy phép hoặc hợp đồng sắp hết hạn.

---

# 22. Test Cases

✓ Create Company.

✓ Edit Company.

✓ Suspend Company.

✓ Add Vehicle.

✓ Add Driver.

✓ Upload License.

✓ Revenue Report.

✓ Export Data.

---

# 23. Acceptance Criteria

✓ CRUD hoạt động.

✓ Fleet Management đầy đủ.

✓ Driver Management đầy đủ.

✓ Revenue Dashboard chính xác.

✓ Document Upload thành công.

✓ Audit Log được ghi nhận.

---

# 24. Related Documents

ADM-004 User Management

ADM-006 Bus Route Management

ADM-015 Audit Log

API-012 Admin API

---

# 25. Summary

Bus Company Management là module quản lý toàn diện các nhà xe đối tác của BusZ. Hệ thống hỗ trợ quản lý hồ sơ doanh nghiệp, đội xe, tài xế, giấy phép, hợp đồng và doanh thu, đồng thời cung cấp công cụ theo dõi hiệu suất hoạt động và chất lượng dịch vụ của từng nhà xe.