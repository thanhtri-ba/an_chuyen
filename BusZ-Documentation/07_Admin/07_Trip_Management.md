# Trip Management

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Admin Web

Document ID

ADM-007

Priority

Critical

Version

1.0

---

# 1. Purpose

Trip Management quản lý toàn bộ các chuyến xe được tạo từ các tuyến xe trong hệ thống BusZ.

Bao gồm:

- Lập lịch chuyến xe
- Phân công xe
- Phân công tài xế
- Quản lý ghế
- Theo dõi trạng thái
- Theo dõi GPS
- Quản lý điểm dừng
- Hủy hoặc dời chuyến

---

# 2. User Flow

```text
Dashboard

↓

Trips

↓

Search Trip

↓

View Trip

↓

Edit Trip

↓

Save
```

---

# 3. Trip List

Hiển thị

- Trip ID
- Route
- Bus Company
- Vehicle
- Driver
- Departure Time
- Arrival Time
- Status
- Seat Occupancy

---

# 4. Search

Theo

```text
Trip ID

Route

Driver

Vehicle

License Plate
```

Search Delay

```text
300ms
```

---

# 5. Filters

Theo

```text
Date

Company

Route

Driver

Status
```

---

# 6. Create Trip

Thông tin

```text
Route

Bus Company

Vehicle

Driver

Departure Time

Arrival Time

Seat Layout

Price
```

---

# 7. Vehicle Assignment

Hiển thị

```text
Vehicle ID

License Plate

Seat Capacity

Status
```

Kiểm tra

- Xe có khả dụng.
- Không trùng lịch.

---

# 8. Driver Assignment

Thông tin

```text
Driver

License

Phone

Experience
```

Kiểm tra

- Không trùng lịch.
- Không vượt thời gian làm việc.

---

# 9. Seat Layout

Hiển thị

```text
Available

Booked

Locked

Blocked
```

Cho phép

```text
Block Seat

Release Seat
```

---

# 10. Trip Status

```text
SCHEDULED

BOARDING

DEPARTED

IN_TRANSIT

ARRIVED

COMPLETED

CANCELLED

DELAYED
```

---

# 11. Delay Management

Cho phép cập nhật

```text
Delay Duration

Reason

New Departure Time
```

Tự động gửi thông báo cho hành khách.

---

# 12. Cancellation

Flow

```text
Cancel Trip

↓

Reason

↓

Notify Passengers

↓

Refund Process
```

---

# 13. GPS Tracking

Hiển thị

```text
Current Location

ETA

Speed

Last Update
```

Bản đồ

```text
OpenStreetMap

Mapbox
```

---

# 14. Stop Management

Thông tin

```text
Stop Name

Arrival Time

Departure Time

Status
```

---

# 15. Seat Occupancy

Hiển thị

```text
Available Seats

Booked Seats

Occupancy Rate
```

Biểu đồ

```text
Progress Bar
```

---

# 16. Notifications

Tự động gửi

```text
Trip Delayed

Trip Cancelled

Boarding Started

Trip Completed
```

---

# 17. API Integration

```text
GET /admin/trips

GET /admin/trips/{id}

POST /admin/trips

PATCH /admin/trips/{id}

PATCH /admin/trips/{id}/status

PATCH /admin/trips/{id}/delay

PATCH /admin/trips/{id}/cancel
```

---

# 18. Component Tree

```text
TripManagementPage

↓

SearchBox

↓

FilterBar

↓

TripTable

↓

TripDetailDrawer

↓

SeatLayout

↓

MapWidget

↓

StopTimeline

↓

StatusTimeline
```

---

# 19. Performance

Trip List

```text
<200ms
```

GPS Refresh

```text
5 seconds
```

Seat Update

```text
<1s
```

---

# 20. UX Guidelines

✓ Hiển thị trạng thái chuyến bằng màu sắc.

✓ Cập nhật GPS theo thời gian thực.

✓ Cảnh báo khi xe hoặc tài xế bị trùng lịch.

✓ Xác nhận trước khi hủy chuyến.

✓ Hiển thị tỷ lệ lấp đầy rõ ràng.

---

# 21. Test Cases

✓ Create Trip.

✓ Assign Vehicle.

✓ Assign Driver.

✓ Update Status.

✓ Delay Trip.

✓ Cancel Trip.

✓ Seat Occupancy.

✓ GPS Tracking.

---

# 22. Acceptance Criteria

✓ CRUD hoạt động.

✓ Vehicle Assignment chính xác.

✓ Driver Assignment chính xác.

✓ GPS hiển thị.

✓ Notification tự động.

✓ Audit Log đầy đủ.

---

# 23. Related Documents

ADM-006 Bus Route Management

ADM-008 Booking Management

API-007 Booking API

---

# 24. Summary

Trip Management là module vận hành cốt lõi của BusZ Admin, cho phép quản lý toàn bộ vòng đời của một chuyến xe từ lúc lập lịch, phân công xe và tài xế, theo dõi trạng thái, quản lý ghế, GPS cho đến khi chuyến hoàn thành hoặc bị hủy. Module này đảm bảo việc vận hành được theo dõi và kiểm soát theo thời gian thực.