# Trip API

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Trip Management

Document ID

API-005

Priority

Critical

Version

1.0

---

# 1. Purpose

Trip API quản lý toàn bộ chuyến xe trong hệ thống BusZ.

Hỗ trợ

- Trip Management
- Trip Schedule
- Vehicle Assignment
- Driver Assignment
- Seat Availability
- Trip Tracking
- Trip Status
- Estimated Arrival Time (ETA)

---

# 2. API Overview

```text
Passenger App

Operator Portal

Driver App

↓

Trip API

↓

Trip Service

↓

Route Service

↓

Vehicle Service

↓

Driver Service

↓

PostgreSQL
```

---

# 3. Trip Lifecycle

```text
Create Trip

↓

Schedule

↓

Open Booking

↓

Ready

↓

Boarding

↓

Departed

↓

In Transit

↓

Arrived

↓

Completed
```

---

# 4. API Endpoints

```text
GET /trips

GET /trips/{tripId}

POST /trips

PATCH /trips/{tripId}

DELETE /trips/{tripId}

GET /trips/{tripId}/tracking

GET /trips/{tripId}/schedule

GET /trips/{tripId}/vehicle

GET /trips/{tripId}/driver

GET /trips/{tripId}/status
```

---

# 5. Get Trip List

Endpoint

```http
GET /api/v1/trips
```

Description

Lấy danh sách chuyến xe.

---

# 6. Get Trip Detail

Endpoint

```http
GET /api/v1/trips/{tripId}
```

Thông tin

```text
Trip ID

Trip Code

Route

Vehicle

Driver

Departure Time

Arrival Time

Status
```

---

# 7. Create Trip

Endpoint

```http
POST /api/v1/trips
```

Description

Tạo chuyến xe mới.

---

# 8. Schedule

Mỗi chuyến bao gồm

```text
Departure Date

Departure Time

Arrival Time

Estimated Duration

Boarding Time
```

---

# 9. Vehicle Assignment

Thông tin

```text
Vehicle ID

License Plate

Vehicle Type

Seat Layout

Capacity
```

---

# 10. Driver Assignment

Thông tin

```text
Driver ID

Driver Name

Phone Number

License Class
```

---

# 11. Trip Status

```text
DRAFT

OPEN_BOOKING

READY

BOARDING

DEPARTED

IN_TRANSIT

ARRIVED

COMPLETED

CANCELLED

DELAYED
```

---

# 12. GPS Tracking

Endpoint

```http
GET /api/v1/trips/{tripId}/tracking
```

Trả về

```text
Latitude

Longitude

Speed

Heading

Last Update
```

---

# 13. ETA

Bao gồm

```text
Estimated Arrival

Delay Minutes

Distance Remaining
```

---

# 14. Boarding Information

Thông tin

```text
Boarding Time

Boarding Point

Platform

Driver

Vehicle
```

---

# 15. Trip Statistics

Bao gồm

```text
Total Seats

Booked Seats

Available Seats

Checked-in Passengers

Occupancy Rate
```

---

# 16. Search Conditions

```text
Route

Departure Date

Departure Time

Company

Vehicle Type

Status
```

---

# 17. Validation Rules

```text
Vehicle Required

Driver Required

Route Required

Departure Before Arrival

Vehicle Active

Driver Active
```

---

# 18. Business Rules

```text
One Vehicle

One Active Trip

One Driver

One Active Trip

Trip cannot depart without driver

Trip cannot depart without vehicle

Completed Trip cannot be edited

Cancelled Trip cannot accept bookings
```

---

# 19. Integration

```text
Booking Service

Seat Service

Notification Service

GPS Service

Maps Service
```

---

# 20. Security

```text
JWT

RBAC

HTTPS

Audit Logs
```

---

# 21. Database Tables

```text
Trips

TripSchedules

TripTracking

Vehicles

Drivers

Routes
```

---

# 22. Error Codes

```text
TRIP_NOT_FOUND

TRIP_CANCELLED

TRIP_COMPLETED

INVALID_DRIVER

INVALID_VEHICLE

INVALID_ROUTE

TRIP_ALREADY_STARTED
```

---

# 23. Performance Targets

```text
Trip Detail

<300 ms

Trip Tracking

<1 Second

Trip Search

<500 ms
```

---

# 24. Acceptance Criteria

✓ Chuyến xe tạo thành công

✓ Phân công xe thành công

✓ Phân công tài xế thành công

✓ GPS cập nhật

✓ ETA hiển thị chính xác

✓ Trạng thái chuyến cập nhật đúng

---

# 25. Related Documents

Route API

Seat API

Booking API

Driver API

Vehicle API

Database Schema

---

# 26. Summary

Trip API quản lý toàn bộ vòng đời của một chuyến xe, từ lập lịch, phân công xe và tài xế, theo dõi GPS, quản lý trạng thái cho đến khi chuyến xe hoàn thành. Đây là trung tâm điều phối giữa Route API, Seat API và Booking API, đảm bảo dữ liệu chuyến xe luôn đồng bộ trong toàn bộ hệ thống BusZ.