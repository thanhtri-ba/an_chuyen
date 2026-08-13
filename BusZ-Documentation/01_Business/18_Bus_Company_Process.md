# Bus Company Process

Project: BusZ - Intercity Bus Ticket Booking Platform

Version: 1.0

Document Type: Business Process

Module: Bus Company Management

Priority: Critical

Status: Draft

---

# 1. Purpose

Tài liệu này mô tả toàn bộ quy trình quản lý nhà xe trong hệ thống BusZ.

Bus Company là đối tác vận hành chính của hệ thống.

Một nhà xe có thể quản lý:

- Xe
- Tuyến đường
- Chuyến xe
- Tài xế
- Nhân viên
- Giá vé
- Báo cáo
- Doanh thu

---

# 2. Scope

Áp dụng cho:

- Bus Company Portal
- Admin Website
- Backend API
- Database

---

# 3. Business Goal

Bus Company có thể tự quản lý hoạt động của mình nhưng không được ảnh hưởng đến dữ liệu của nhà xe khác.

---

# 4. Actors

Primary

Bus Company Manager

Secondary

Staff

Driver

Admin

Backend

---

# 5. Business Modules

Bus Company bao gồm:

Company Profile

↓

Fleet Management

↓

Driver Management

↓

Trip Management

↓

Route Management

↓

Pricing

↓

Booking Management

↓

Revenue

↓

Reports

---

# 6. Company Profile

Thông tin gồm:

Company Name

Company Logo

Description

Business License

Tax Code

Hotline

Email

Website

Address

Status

---

# 7. Fleet Management

Một nhà xe có nhiều xe.

Thông tin xe:

License Plate

Bus Code

Bus Type

Seat Layout

Capacity

Manufacture Year

Status

---

# 8. Driver Management

Quản lý:

Driver

Assistant Driver

Staff

Thông tin:

Full Name

Phone

License Number

Experience

Status

---

# 9. Trip Management

Manager có thể:

Create Trip

Update Trip

Cancel Trip

Delay Trip

Assign Bus

Assign Driver

Configure Price

---

# 10. Booking Management

Xem:

Booking

Passenger

Seat

Payment

Ticket

Check-in Status

Không được sửa Booking đã thanh toán.

---

# 11. Revenue Management

Theo dõi:

Revenue

Booking Count

Passenger Count

Refund

Cancellation

Occupancy Rate

---

# 12. Company Workflow

```mermaid
flowchart TD

Create Company

-->

Create Bus

-->

Create Driver

-->

Create Route

-->

Create Trip

-->

Customer Booking

-->

Payment

-->

Check-in

-->

Trip Completed

-->

Revenue Report
```

---

# 13. Company Status

PENDING

ACTIVE

SUSPENDED

INACTIVE

DELETED

---

# 14. Database Tables

bus_companies

company_users

buses

drivers

staffs

routes

trips

company_documents

company_settings

---

# 15. API Flow

GET /companies

GET /companies/{id}

PUT /companies/{id}

GET /companies/{id}/buses

GET /companies/{id}/drivers

GET /companies/{id}/trips

---

# 16. Validation Rules

Company Name phải duy nhất.

License Plate không được trùng.

Driver License hợp lệ.

Bus Capacity > 0.

---

# 17. Exception Cases

Bus đang bảo trì.

↓

Không gán Trip.

---

Driver nghỉ phép.

↓

Không gán Trip.

---

Company bị khóa.

↓

Không cho tạo Trip.

---

# 18. Security

Company chỉ được xem dữ liệu của chính mình.

Manager có toàn quyền trong phạm vi công ty.

Staff chỉ xem hoặc cập nhật dữ liệu được phân quyền.

Admin có quyền truy cập tất cả.

---

# 19. Notification

Trip Created

Trip Cancelled

Driver Assigned

Bus Assigned

Booking Received

Refund Requested

---

# 20. Logging

Company Created

Company Updated

Bus Added

Driver Added

Trip Created

Trip Updated

Revenue Viewed

---

# 21. Reports

Daily Revenue

Monthly Revenue

Occupancy Rate

Popular Routes

Top Drivers

Top Trips

Cancellation Rate

Refund Statistics

---

# 22. Acceptance Criteria

✓ Tạo Company thành công.

✓ Quản lý xe.

✓ Quản lý tài xế.

✓ Quản lý chuyến.

✓ Xem doanh thu.

✓ Không truy cập dữ liệu nhà xe khác.

---

# 23. Future Expansion

Fleet GPS

Driver Mobile App

Vehicle Maintenance

Fuel Management

Payroll

Insurance Management

Multi Branch

Fleet Analytics

---

# 24. Related Documents

Trip Process

Seat Management

Booking Process

Payment Process

Report Process

Admin Operation Process

Database Design

---

# 25. Summary

Bus Company Process là module dành cho đối tác vận tải trong hệ thống BusZ.

Module này cho phép mỗi nhà xe tự quản lý hoạt động vận hành, phương tiện, nhân sự và doanh thu trên cùng một nền tảng, đồng thời đảm bảo dữ liệu giữa các nhà xe được tách biệt và an toàn.