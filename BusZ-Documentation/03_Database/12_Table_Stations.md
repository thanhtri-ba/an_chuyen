# Stations Table

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Database

Document ID: DB-012

Table Name

stations

Priority

Critical

Version

1.0

---

# 1. Purpose

Bảng `stations` quản lý toàn bộ các bến xe, điểm đón và điểm trả trong hệ thống BusZ.

Mỗi Station có thể là:

- Bến xe liên tỉnh
- Văn phòng nhà xe
- Điểm đón
- Điểm trả
- Trạm trung chuyển

Stations được sử dụng trong:

- Route
- Trip
- Booking
- Pickup
- Dropoff
- Navigation

---

# 2. Responsibilities

Quản lý:

- Bến xe
- Điểm đón
- Điểm trả
- Địa chỉ
- GPS
- Thành phố
- Khu vực
- Trạng thái hoạt động
- Thời gian hoạt động

---

# 3. Relationships

```text
stations
1 ---- N routes (departure)

stations
1 ---- N routes (arrival)

stations
1 ---- N route_stations

stations
1 ---- N trips (departure)

stations
1 ---- N trips (arrival)

stations
1 ---- N booking_pickups

stations
1 ---- N booking_dropoffs
```

---

# 4. Columns

| Column | Type | Nullable | Description |
|---|---|---|---|
| id | UUID | No | Primary Key |
| station_code | VARCHAR(30) | No | Mã bến |
| station_name | VARCHAR(200) | No | Tên bến |
| station_type | ENUM | No | Loại bến |
| city | VARCHAR(100) | No | Thành phố |
| province | VARCHAR(100) | No | Tỉnh |
| district | VARCHAR(100) | Yes | Quận/Huyện |
| address | VARCHAR(500) | No | Địa chỉ |
| latitude | NUMERIC(10,7) | No | Vĩ độ |
| longitude | NUMERIC(10,7) | No | Kinh độ |
| contact_phone | VARCHAR(20) | Yes | Điện thoại |
| opening_time | TIME | Yes | Giờ mở cửa |
| closing_time | TIME | Yes | Giờ đóng cửa |
| status | ENUM | No | Trạng thái |
| created_at | TIMESTAMPTZ | No | Created |
| updated_at | TIMESTAMPTZ | No | Updated |
| deleted_at | TIMESTAMPTZ | Yes | Soft Delete |

---

# 5. Enum

## StationType

```text
BUS_TERMINAL

BUS_OFFICE

PICKUP_POINT

DROPOFF_POINT

TRANSFER_POINT
```

---

## StationStatus

```text
ACTIVE

INACTIVE

UNDER_MAINTENANCE

CLOSED
```

---

# 6. Constraints

```text
PRIMARY KEY(id)

UNIQUE(station_code)

CHECK(latitude BETWEEN -90 AND 90)

CHECK(longitude BETWEEN -180 AND 180)
```

---

# 7. Indexes

```text
PRIMARY KEY(id)

UNIQUE(station_code)

INDEX(city)

INDEX(province)

INDEX(status)

INDEX(station_type)

INDEX(latitude, longitude)
```

---

# 8. SQL DDL

```sql
CREATE TABLE stations (

id UUID PRIMARY KEY,

station_code VARCHAR(30) UNIQUE NOT NULL,

station_name VARCHAR(200) NOT NULL,

station_type VARCHAR(30) NOT NULL,

city VARCHAR(100) NOT NULL,

province VARCHAR(100) NOT NULL,

district VARCHAR(100),

address VARCHAR(500) NOT NULL,

latitude NUMERIC(10,7) NOT NULL,

longitude NUMERIC(10,7) NOT NULL,

contact_phone VARCHAR(20),

opening_time TIME,

closing_time TIME,

status VARCHAR(30) NOT NULL,

created_at TIMESTAMPTZ DEFAULT NOW(),

updated_at TIMESTAMPTZ DEFAULT NOW(),

deleted_at TIMESTAMPTZ

);
```

---

# 9. Prisma Model

```prisma
model Station {

  id             String      @id @default(uuid())

  stationCode    String      @unique @map("station_code")

  stationName    String      @map("station_name")

  stationType    StationType @map("station_type")

  city           String

  province       String

  district       String?

  address        String

  latitude       Decimal     @db.Decimal(10,7)

  longitude      Decimal     @db.Decimal(10,7)

  contactPhone   String?     @map("contact_phone")

  openingTime    DateTime?   @db.Time(0) @map("opening_time")

  closingTime    DateTime?   @db.Time(0) @map("closing_time")

  status         StationStatus

  createdAt      DateTime    @default(now())

  updatedAt      DateTime    @updatedAt

  deletedAt      DateTime?

  departureRoutes Route[] @relation("RouteDeparture")

  arrivalRoutes   Route[] @relation("RouteArrival")

  departureTrips  Trip[] @relation("DepartureStation")

  arrivalTrips    Trip[] @relation("ArrivalStation")

  routeStations   RouteStation[]

  @@index([city])

  @@index([province])

  @@index([status])

  @@index([latitude, longitude])

  @@map("stations")
}
```

---

# 10. Business Rules

STATION-BR-001

Station Code phải duy nhất.

STATION-BR-002

GPS phải hợp lệ.

STATION-BR-003

Station CLOSED không được tạo Trip mới.

STATION-BR-004

Station ACTIVE mới được hiển thị cho khách hàng.

STATION-BR-005

Một Route phải có ít nhất 2 Station.

STATION-BR-006

Không được xóa Station đang được sử dụng bởi Route hoặc Trip.

---

# 11. Station Categories

```text
Bus Terminal

↓

Main Office

↓

Pickup Point

↓

Dropoff Point

↓

Transfer Point
```

---

# 12. Map Integration

```text
Latitude

+

Longitude

↓

OpenStreetMap

↓

Google Maps

↓

Navigation
```

---

# 13. Sample Data

| station_code | station_name | city | type |
|---|---|---|---|
| ST001 | Bến xe Miền Đông Mới | TP.HCM | BUS_TERMINAL |
| ST002 | Văn phòng Quận 1 | TP.HCM | BUS_OFFICE |
| ST003 | Bến xe Liên tỉnh Đà Lạt | Đà Lạt | BUS_TERMINAL |

---

# 14. API Mapping

```text
GET /stations

GET /stations/search

GET /stations/{id}

POST /stations

PATCH /stations/{id}

DELETE /stations/{id}

GET /stations/nearby
```

---

# 15. Security

Khách hàng chỉ xem Station ACTIVE.

Operator quản lý Station theo phạm vi được phân quyền.

Admin có toàn quyền.

---

# 16. Audit

Ghi log:

- Create Station
- Update Station
- Change Status
- Update GPS
- Delete Station

---

# 17. Performance

Expected Records

50,000+

Nearby Search

<50ms

Search by City

<20ms

---

# 18. Test Cases

✓ Create Station.

✓ Duplicate Station Code.

✓ Invalid GPS.

✓ Closed Station.

✓ Nearby Search.

✓ Update Address.

---

# 19. Acceptance Criteria

✓ Station Code duy nhất.

✓ GPS hợp lệ.

✓ Search theo thành phố.

✓ Nearby Search hoạt động.

✓ Migration thành công.

✓ Prisma Generate thành công.

---

# 20. Related Tables

routes

route_stations

trips

booking_pickups

booking_dropoffs

audit_logs

---

# 21. Summary

`stations` quản lý toàn bộ điểm đón, điểm trả và bến xe trong hệ thống BusZ. Đây là nền tảng cho chức năng tìm kiếm tuyến đường, hiển thị bản đồ, điều hướng và lập lịch vận hành của các chuyến xe.