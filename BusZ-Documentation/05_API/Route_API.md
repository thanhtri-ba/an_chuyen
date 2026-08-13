# Route API

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Route Management

Document ID

API-004

Priority

Critical

Version

1.0

---

# 1. Purpose

Route API quản lý toàn bộ dữ liệu tuyến xe trong hệ thống BusZ.

Hỗ trợ

- Route Management
- Pickup Points
- Dropoff Points
- Bus Stations
- Route Distance
- Estimated Duration
- Route Map
- Checkpoints

---

# 2. API Overview

```text
Passenger App

Operator Portal

Admin Portal

↓

Route API

↓

Route Service

↓

PostgreSQL

↓

Map Service
```

---

# 3. Route Flow

```text
Province

↓

Bus Station

↓

Pickup Point

↓

Route

↓

Checkpoint

↓

Dropoff Point

↓

Destination
```

---

# 4. API Endpoints

```text
GET /routes

GET /routes/{routeId}

GET /routes/search

GET /routes/{routeId}/stations

GET /routes/{routeId}/pickup-points

GET /routes/{routeId}/dropoff-points

GET /routes/{routeId}/checkpoints

GET /routes/popular
```

---

# 5. Get Route List

Endpoint

```http
GET /api/v1/routes
```

Description

Lấy danh sách tất cả tuyến xe.

---

# 6. Get Route Detail

Endpoint

```http
GET /api/v1/routes/{routeId}
```

Trả về

```text
Route Name

Departure

Destination

Distance

Duration

Status
```

---

# 7. Route Information

Thông tin mỗi tuyến

```text
Route ID

Route Code

Departure Province

Destination Province

Distance

Estimated Duration

Status
```

---

# 8. Pickup Points

Endpoint

```http
GET /api/v1/routes/{routeId}/pickup-points
```

Thông tin

```text
Pickup ID

Pickup Name

Address

Latitude

Longitude

Pickup Time
```

---

# 9. Dropoff Points

Endpoint

```http
GET /api/v1/routes/{routeId}/dropoff-points
```

Thông tin

```text
Dropoff ID

Dropoff Name

Address

Latitude

Longitude

Arrival Time
```

---

# 10. Bus Stations

Thông tin

```text
Station ID

Station Name

Province

District

Address

Latitude

Longitude

Status
```

---

# 11. Route Checkpoints

Endpoint

```http
GET /api/v1/routes/{routeId}/checkpoints
```

Bao gồm

```text
Checkpoint Name

Latitude

Longitude

Order

Estimated Arrival Time
```

---

# 12. Route Map

Endpoint

```http
GET /api/v1/routes/{routeId}/map
```

Hiển thị

```text
Polyline

GPS Coordinates

Road Information
```

---

# 13. Search Routes

Endpoint

```http
GET /api/v1/routes/search
```

Query

```text
Departure

Destination

Keyword
```

---

# 14. Popular Routes

Endpoint

```http
GET /api/v1/routes/popular
```

Hiển thị

```text
Most Booked

Trending

Recommended
```

---

# 15. Route Status

```text
ACTIVE

INACTIVE

MAINTENANCE

DISCONTINUED
```

---

# 16. Validation Rules

```text
Departure Required

Destination Required

Departure ≠ Destination

Route Must Exist

Coordinates Valid
```

---

# 17. Business Rules

```text
One Route

Multiple Trips

One Route

Multiple Pickup Points

One Route

Multiple Dropoff Points

One Route

Many Checkpoints
```

---

# 18. Integration

Kết nối với

```text
Google Maps

OpenStreetMap

GPS Tracking

Geocoding Service
```

---

# 19. Security

```text
HTTPS

JWT

Rate Limit

Input Validation
```

---

# 20. Database Tables

```text
Routes

Stations

PickupPoints

DropoffPoints

Checkpoints

Locations
```

---

# 21. Error Codes

```text
ROUTE_NOT_FOUND

INVALID_ROUTE

INVALID_LOCATION

STATION_NOT_FOUND

CHECKPOINT_NOT_FOUND
```

---

# 22. Performance Targets

```text
Route Query

<300 ms

Route Detail

<500 ms

Map Data

<800 ms
```

---

# 23. Acceptance Criteria

✓ Danh sách tuyến chính xác

✓ Chi tiết tuyến đầy đủ

✓ Điểm đón đúng

✓ Điểm trả đúng

✓ Checkpoint đúng thứ tự

✓ Hiển thị bản đồ thành công

---

# 24. Related Documents

Search API

Trip API

Booking API

GIS Architecture

Database Schema

---

# 25. Summary

Route API quản lý toàn bộ thông tin tuyến xe của BusZ, bao gồm bến xe, điểm đón, điểm trả, checkpoint và dữ liệu bản đồ. Đây là nền tảng để xây dựng chức năng tìm kiếm chuyến xe, tính toán thời gian di chuyển và hỗ trợ định vị GPS trong hệ thống.