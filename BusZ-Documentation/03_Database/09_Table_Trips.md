# Trips Table

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Database

Document ID: DB-009

Table Name

trips

Priority

Critical

Version

1.0

---

# 1. Purpose

Bảng `trips` quản lý toàn bộ các chuyến xe vận hành trong hệ thống BusZ.

Mỗi Trip đại diện cho một chuyến xe cụ thể chạy theo một tuyến đường, được gán cho một xe, tài xế và lịch khởi hành xác định.

Đây là bảng trung tâm của nghiệp vụ tìm kiếm, đặt vé và vận hành.

---

# 2. Responsibilities

Quản lý:

- Chuyến xe
- Tuyến đường
- Xe vận hành
- Nhà xe
- Tài xế
- Thời gian khởi hành
- Thời gian đến
- Giá vé
- Trạng thái
- Số ghế còn trống

---

# 3. Relationships

```text
bus_companies
1 ---- N trips

routes
1 ---- N trips

buses
1 ---- N trips

drivers
1 ---- N trips

trips
1 ---- N trip_seats

trips
1 ---- N bookings

trips
1 ---- N tickets
```

---

# 4. Columns

| Column | Type | Nullable | Description |
|---|---|---|---|
| id | UUID | No | Primary Key |
| trip_code | VARCHAR(30) | No | Mã chuyến |
| company_id | UUID | No | Nhà xe |
| route_id | UUID | No | Tuyến đường |
| bus_id | UUID | No | Xe |
| driver_id | UUID | Yes | Tài xế chính |
| departure_station_id | UUID | No | Bến đi |
| arrival_station_id | UUID | No | Bến đến |
| departure_time | TIMESTAMPTZ | No | Giờ khởi hành |
| arrival_time | TIMESTAMPTZ | No | Giờ đến dự kiến |
| boarding_open_at | TIMESTAMPTZ | Yes | Mở check-in |
| booking_close_at | TIMESTAMPTZ | Yes | Đóng đặt vé |
| base_price | NUMERIC(18,2) | No | Giá gốc |
| available_seats | INTEGER | No | Ghế còn trống |
| total_seats | INTEGER | No | Tổng ghế |
| status | ENUM | No | Trạng thái |
| delay_minutes | INTEGER | No | Số phút trễ |
| note | TEXT | Yes | Ghi chú |
| created_at | TIMESTAMPTZ | No | Tạo |
| updated_at | TIMESTAMPTZ | No | Cập nhật |
| deleted_at | TIMESTAMPTZ | Yes | Soft Delete |

---

# 5. Enum

## TripStatus

```text
DRAFT

SCHEDULED

BOARDING

DEPARTED

IN_TRANSIT

ARRIVED

COMPLETED

CANCELLED

DELAYED

FULL
```

---

# 6. Constraints

```text
PRIMARY KEY(id)

UNIQUE(trip_code)

FOREIGN KEY(company_id)

FOREIGN KEY(route_id)

FOREIGN KEY(bus_id)

FOREIGN KEY(driver_id)

CHECK(base_price >= 0)

CHECK(total_seats > 0)

CHECK(available_seats >= 0)

CHECK(available_seats <= total_seats)

CHECK(arrival_time > departure_time)
```

---

# 7. Indexes

```text
PRIMARY KEY(id)

UNIQUE(trip_code)

INDEX(route_id)

INDEX(company_id)

INDEX(bus_id)

INDEX(driver_id)

INDEX(status)

INDEX(departure_time)

INDEX(arrival_time)

INDEX(route_id, departure_time)

INDEX(status, departure_time)
```

---

# 8. SQL DDL

```sql
CREATE TABLE trips (

id UUID PRIMARY KEY,

trip_code VARCHAR(30) UNIQUE NOT NULL,

company_id UUID NOT NULL REFERENCES bus_companies(id),

route_id UUID NOT NULL REFERENCES routes(id),

bus_id UUID NOT NULL REFERENCES buses(id),

driver_id UUID REFERENCES drivers(id),

departure_station_id UUID NOT NULL REFERENCES stations(id),

arrival_station_id UUID NOT NULL REFERENCES stations(id),

departure_time TIMESTAMPTZ NOT NULL,

arrival_time TIMESTAMPTZ NOT NULL,

boarding_open_at TIMESTAMPTZ,

booking_close_at TIMESTAMPTZ,

base_price NUMERIC(18,2) NOT NULL,

available_seats INTEGER NOT NULL,

total_seats INTEGER NOT NULL,

status VARCHAR(30) NOT NULL,

delay_minutes INTEGER DEFAULT 0,

note TEXT,

created_at TIMESTAMPTZ DEFAULT NOW(),

updated_at TIMESTAMPTZ DEFAULT NOW(),

deleted_at TIMESTAMPTZ

);
```

---

# 9. Prisma Model

```prisma
model Trip {

  id                  String      @id @default(uuid())

  tripCode            String      @unique @map("trip_code")

  companyId           String      @map("company_id")

  routeId             String      @map("route_id")

  busId               String      @map("bus_id")

  driverId            String?     @map("driver_id")

  departureStationId  String      @map("departure_station_id")

  arrivalStationId    String      @map("arrival_station_id")

  departureTime       DateTime    @map("departure_time")

  arrivalTime         DateTime    @map("arrival_time")

  boardingOpenAt      DateTime?   @map("boarding_open_at")

  bookingCloseAt      DateTime?   @map("booking_close_at")

  basePrice           Decimal     @db.Decimal(18,2) @map("base_price")

  availableSeats      Int         @map("available_seats")

  totalSeats          Int         @map("total_seats")

  status              TripStatus

  delayMinutes        Int         @default(0) @map("delay_minutes")

  note                String?

  createdAt           DateTime    @default(now())

  updatedAt           DateTime    @updatedAt

  deletedAt           DateTime?

  company             BusCompany

  route               Route

  bus                 Bus

  driver              Driver?

  departureStation    Station @relation("DepartureStation", fields:[departureStationId], references:[id])

  arrivalStation      Station @relation("ArrivalStation", fields:[arrivalStationId], references:[id])

  seats               TripSeat[]

  bookings            Booking[]

  tickets             Ticket[]

  @@index([routeId])

  @@index([status])

  @@index([departureTime])

  @@index([routeId, departureTime])

  @@map("trips")
}
```

---

# 10. Business Rules

TRIP-BR-001

Một Trip chỉ thuộc một Route.

TRIP-BR-002

Một Trip chỉ sử dụng một Bus tại một thời điểm.

TRIP-BR-003

Không cho phép hai Trip trùng Bus và thời gian vận hành.

TRIP-BR-004

Không cho phép Booking sau booking_close_at.

TRIP-BR-005

Trip FULL không nhận Booking mới.

TRIP-BR-006

Trip CANCELLED phải hủy toàn bộ Booking chưa hoàn thành.

TRIP-BR-007

available_seats phải luôn đồng bộ với trạng thái `trip_seats`.

---

# 11. Trip Lifecycle

```text
DRAFT
   ↓
SCHEDULED
   ↓
BOARDING
   ↓
DEPARTED
   ↓
IN_TRANSIT
   ↓
ARRIVED
   ↓
COMPLETED
```

Ngoại lệ:

```text
SCHEDULED
    ↓
FULL
```

```text
SCHEDULED
    ↓
DELAYED
```

```text
ANY
 ↓
CANCELLED
```

---

# 12. Capacity Rules

```text
available_seats

=

total_seats

-

booked_seats

-

locked_seats
```

Seat Lock mặc định:

```text
15 phút
(Configurable)
```

---

# 13. Sample Data

| trip_code | route | departure | status |
|---|---|---|---|
| BUSZ-TRIP-000001 | SG → Đà Lạt | 2026-07-10 22:00 | SCHEDULED |
| BUSZ-TRIP-000002 | SG → Cần Thơ | 2026-07-11 06:00 | BOARDING |
| BUSZ-TRIP-000003 | SG → Nha Trang | 2026-07-12 20:30 | FULL |

---

# 14. API Mapping

```text
GET /trips

GET /trips/search

GET /trips/{id}

POST /trips

PATCH /trips/{id}

POST /trips/{id}/cancel

POST /trips/{id}/delay

GET /trips/{id}/seats
```

---

# 15. Security

Customer chỉ xem Trip công khai.

Driver chỉ xem Trip được phân công.

Operator/Admin được chỉnh sửa theo phân quyền.

Không cho phép sửa Trip đã COMPLETED.

---

# 16. Audit

Ghi log:

- Create Trip
- Assign Bus
- Assign Driver
- Delay Trip
- Cancel Trip
- Change Price
- Complete Trip

---

# 17. Performance

Expected Records

2,000,000+

Search Route

<50ms

Search Date

<50ms

Load Seats

<100ms

---

# 18. Test Cases

✓ Create Trip.

✓ Duplicate Trip Code.

✓ Overlapping Bus Schedule.

✓ Booking Close Time.

✓ Trip Full.

✓ Delay Trip.

✓ Cancel Trip.

✓ Complete Trip.

---

# 19. Acceptance Criteria

✓ Trip Code duy nhất.

✓ Arrival > Departure.

✓ Không overbook.

✓ Không trùng Bus Schedule.

✓ Prisma Generate thành công.

✓ Migration thành công.

---

# 20. Related Tables

routes

stations

buses

drivers

trip_seats

bookings

tickets

audit_logs

---

# 21. Summary

`trips` là bảng quan trọng nhất của nghiệp vụ vận hành BusZ. Bảng này quản lý toàn bộ chuyến xe thực tế, liên kết tuyến đường, xe, tài xế, ghế, booking và vé điện tử, đồng thời là nền tảng cho chức năng tìm kiếm chuyến xe, đặt vé và điều phối vận hành.