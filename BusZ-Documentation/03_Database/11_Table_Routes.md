# Routes Table

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Database

Document ID: DB-011

Table Name

routes

Priority

Critical

Version

1.0

---

# 1. Purpose

Bảng `routes` quản lý toàn bộ tuyến đường vận hành của hệ thống BusZ.

Một Route đại diện cho một tuyến cố định giữa điểm xuất phát và điểm đến, bao gồm các trạm dừng trung gian, khoảng cách, thời gian di chuyển dự kiến và giá cơ sở.

Route là nền tảng để tạo Trip.

---

# 2. Responsibilities

Quản lý:

- Tuyến đường
- Điểm đi
- Điểm đến
- Trạm trung gian
- Khoảng cách
- Thời gian dự kiến
- Giá cơ sở
- Trạng thái

---

# 3. Relationships

```text
stations
1 ---- N routes (departure)

stations
1 ---- N routes (arrival)

routes
1 ---- N route_stations

routes
1 ---- N trips
```

---

# 4. Columns

| Column | Type | Nullable | Description |
|---------|------|----------|-------------|
| id | UUID | No | Primary Key |
| route_code | VARCHAR(30) | No | Mã tuyến |
| route_name | VARCHAR(200) | No | Tên tuyến |
| departure_station_id | UUID | No | Bến đi |
| arrival_station_id | UUID | No | Bến đến |
| distance_km | NUMERIC(8,2) | No | Khoảng cách |
| estimated_duration | INTEGER | No | Thời gian (phút) |
| base_price | NUMERIC(18,2) | No | Giá cơ sở |
| status | ENUM | No | Trạng thái |
| description | TEXT | Yes | Mô tả |
| created_at | TIMESTAMPTZ | No | Created |
| updated_at | TIMESTAMPTZ | No | Updated |
| deleted_at | TIMESTAMPTZ | Yes | Soft Delete |

---

# 5. Enum

## RouteStatus

```text
ACTIVE

INACTIVE

TEMPORARILY_CLOSED

DISCONTINUED
```

---

# 6. Constraints

```text
PRIMARY KEY(id)

UNIQUE(route_code)

FOREIGN KEY(departure_station_id)

FOREIGN KEY(arrival_station_id)

CHECK(distance_km > 0)

CHECK(estimated_duration > 0)

CHECK(base_price >= 0)

CHECK(departure_station_id <> arrival_station_id)
```

---

# 7. Indexes

```text
PRIMARY KEY(id)

UNIQUE(route_code)

INDEX(departure_station_id)

INDEX(arrival_station_id)

INDEX(status)

INDEX(route_name)

INDEX(base_price)
```

---

# 8. SQL DDL

```sql
CREATE TABLE routes (

id UUID PRIMARY KEY,

route_code VARCHAR(30) UNIQUE NOT NULL,

route_name VARCHAR(200) NOT NULL,

departure_station_id UUID NOT NULL REFERENCES stations(id),

arrival_station_id UUID NOT NULL REFERENCES stations(id),

distance_km NUMERIC(8,2) NOT NULL,

estimated_duration INTEGER NOT NULL,

base_price NUMERIC(18,2) NOT NULL,

status VARCHAR(30) NOT NULL,

description TEXT,

created_at TIMESTAMPTZ DEFAULT NOW(),

updated_at TIMESTAMPTZ DEFAULT NOW(),

deleted_at TIMESTAMPTZ

);
```

---

# 9. Prisma Model

```prisma
model Route {

  id                   String      @id @default(uuid())

  routeCode            String      @unique @map("route_code")

  routeName            String      @map("route_name")

  departureStationId   String      @map("departure_station_id")

  arrivalStationId     String      @map("arrival_station_id")

  distanceKm           Decimal     @db.Decimal(8,2) @map("distance_km")

  estimatedDuration    Int         @map("estimated_duration")

  basePrice            Decimal     @db.Decimal(18,2) @map("base_price")

  status               RouteStatus

  description          String?

  createdAt            DateTime    @default(now())

  updatedAt            DateTime    @updatedAt

  deletedAt            DateTime?

  departureStation     Station @relation("RouteDeparture", fields:[departureStationId], references:[id])

  arrivalStation       Station @relation("RouteArrival", fields:[arrivalStationId], references:[id])

  routeStations        RouteStation[]

  trips                Trip[]

  @@index([departureStationId])

  @@index([arrivalStationId])

  @@index([status])

  @@map("routes")
}
```

---

# 10. Business Rules

ROUTE-BR-001

Route Code phải duy nhất.

ROUTE-BR-002

Điểm đi và điểm đến không được trùng nhau.

ROUTE-BR-003

Route INACTIVE không được tạo Trip mới.

ROUTE-BR-004

Route DISCONTINUED không được sử dụng.

ROUTE-BR-005

Base Price phải lớn hơn hoặc bằng 0.

ROUTE-BR-006

Estimated Duration phải lớn hơn 0.

---

# 11. Route Structure

```text
Bến xe Miền Đông

↓

Biên Hòa

↓

Long Khánh

↓

Bảo Lộc

↓

Đà Lạt
```

Mỗi điểm trung gian được lưu trong:

```
route_stations
```

---

# 12. Pricing Strategy

```text
Base Price

+

Holiday Surcharge

+

Weekend Surcharge

-

Promotion

=

Final Ticket Price
```

---

# 13. Sample Data

| route_code | route_name | distance_km | estimated_duration |
|------------|------------|------------:|--------------------:|
| R001 | TP.HCM → Đà Lạt | 310 | 420 |
| R002 | TP.HCM → Cần Thơ | 170 | 210 |
| R003 | TP.HCM → Nha Trang | 430 | 540 |

---

# 14. API Mapping

```text
GET /routes

GET /routes/{id}

GET /routes/search

POST /routes

PATCH /routes/{id}

DELETE /routes/{id}

GET /routes/{id}/stations
```

---

# 15. Security

Customer chỉ được xem Route ACTIVE.

Operator chỉ quản lý Route của doanh nghiệp mình.

Admin có toàn quyền.

---

# 16. Audit

Ghi log:

- Create Route
- Update Route
- Change Status
- Change Base Price
- Add Route Station
- Remove Route Station

---

# 17. Performance

Expected Records

100,000+

Search Route

<20ms

Search Station

<20ms

---

# 18. Test Cases

✓ Create Route.

✓ Duplicate Route Code.

✓ Same Departure/Arrival.

✓ Route Inactive.

✓ Update Base Price.

✓ Add Intermediate Station.

---

# 19. Acceptance Criteria

✓ Route Code duy nhất.

✓ Departure ≠ Arrival.

✓ Route ACTIVE tạo được Trip.

✓ Migration thành công.

✓ Prisma Generate thành công.

---

# 20. Related Tables

stations

route_stations

trips

bus_companies

audit_logs

---

# 21. Summary

`routes` quản lý toàn bộ tuyến đường vận hành của BusZ, bao gồm điểm đi, điểm đến, khoảng cách, thời gian dự kiến và giá cơ sở. Đây là nền tảng để lập lịch chuyến xe, tìm kiếm hành trình và tính giá vé trong hệ thống.