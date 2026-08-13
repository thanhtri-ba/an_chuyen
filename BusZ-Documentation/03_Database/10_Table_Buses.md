# Buses Table

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Database

Document ID: DB-010

Table Name

buses

Priority

Critical

Version

1.0

---

# 1. Purpose

Bảng `buses` quản lý toàn bộ phương tiện vận hành trong hệ thống BusZ.

Mỗi xe thuộc một nhà xe (Bus Company), có cấu hình ghế, loại xe, thông tin đăng kiểm và trạng thái vận hành.

Đây là bảng nền tảng để lập lịch chuyến (`trips`), cấu hình sơ đồ ghế (`trip_seats`) và quản lý đội xe.

---

# 2. Responsibilities

Quản lý:

- Xe khách
- Nhà xe
- Biển số
- Loại xe
- Số tầng
- Sức chứa
- Trạng thái
- Đăng kiểm
- Bảo trì

---

# 3. Relationships

```text
bus_companies
1 ---- N buses

buses
1 ---- N trips

buses
1 ---- N bus_seat_templates

buses
1 ---- N maintenance_records
```

---

# 4. Columns

| Column | Type | Nullable | Description |
|---|---|---|---|
| id | UUID | No | Primary Key |
| bus_code | VARCHAR(30) | No | Mã xe |
| company_id | UUID | No | Nhà xe |
| plate_number | VARCHAR(20) | No | Biển số |
| bus_name | VARCHAR(100) | No | Tên xe |
| bus_type | ENUM | No | Loại xe |
| deck_count | SMALLINT | No | Số tầng |
| total_seats | INTEGER | No | Tổng ghế |
| manufacture_year | SMALLINT | Yes | Năm sản xuất |
| status | ENUM | No | Trạng thái |
| registration_expiry | DATE | Yes | Hạn đăng kiểm |
| insurance_expiry | DATE | Yes | Hạn bảo hiểm |
| last_maintenance_at | TIMESTAMPTZ | Yes | Bảo trì gần nhất |
| next_maintenance_at | TIMESTAMPTZ | Yes | Bảo trì kế tiếp |
| note | TEXT | Yes | Ghi chú |
| created_at | TIMESTAMPTZ | No | Tạo |
| updated_at | TIMESTAMPTZ | No | Cập nhật |
| deleted_at | TIMESTAMPTZ | Yes | Soft Delete |

---

# 5. Enum

## BusType

```text
SEATER

SLEEPER

LIMOUSINE

VIP

DOUBLE_DECKER

MINI_BUS
```

---

## BusStatus

```text
AVAILABLE

IN_SERVICE

ON_TRIP

MAINTENANCE

OUT_OF_SERVICE

RETIRED
```

---

# 6. Constraints

```text
PRIMARY KEY(id)

UNIQUE(bus_code)

UNIQUE(plate_number)

FOREIGN KEY(company_id)

CHECK(total_seats > 0)

CHECK(deck_count >= 1)

CHECK(manufacture_year >= 1990)
```

---

# 7. Indexes

```text
PRIMARY KEY(id)

UNIQUE(bus_code)

UNIQUE(plate_number)

INDEX(company_id)

INDEX(status)

INDEX(bus_type)

INDEX(registration_expiry)

INDEX(next_maintenance_at)
```

---

# 8. SQL DDL

```sql
CREATE TABLE buses (

id UUID PRIMARY KEY,

bus_code VARCHAR(30) UNIQUE NOT NULL,

company_id UUID NOT NULL REFERENCES bus_companies(id),

plate_number VARCHAR(20) UNIQUE NOT NULL,

bus_name VARCHAR(100) NOT NULL,

bus_type VARCHAR(30) NOT NULL,

deck_count SMALLINT NOT NULL DEFAULT 1,

total_seats INTEGER NOT NULL,

manufacture_year SMALLINT,

status VARCHAR(30) NOT NULL,

registration_expiry DATE,

insurance_expiry DATE,

last_maintenance_at TIMESTAMPTZ,

next_maintenance_at TIMESTAMPTZ,

note TEXT,

created_at TIMESTAMPTZ DEFAULT NOW(),

updated_at TIMESTAMPTZ DEFAULT NOW(),

deleted_at TIMESTAMPTZ

);
```

---

# 9. Prisma Model

```prisma
model Bus {

  id                  String      @id @default(uuid())

  busCode             String      @unique @map("bus_code")

  companyId           String      @map("company_id")

  plateNumber         String      @unique @map("plate_number")

  busName             String      @map("bus_name")

  busType             BusType     @map("bus_type")

  deckCount           Int         @default(1) @map("deck_count")

  totalSeats          Int         @map("total_seats")

  manufactureYear     Int?        @map("manufacture_year")

  status              BusStatus

  registrationExpiry  DateTime?   @db.Date @map("registration_expiry")

  insuranceExpiry     DateTime?   @db.Date @map("insurance_expiry")

  lastMaintenanceAt   DateTime?   @map("last_maintenance_at")

  nextMaintenanceAt   DateTime?   @map("next_maintenance_at")

  note                String?

  createdAt           DateTime    @default(now())

  updatedAt           DateTime    @updatedAt

  deletedAt           DateTime?

  company             BusCompany  @relation(fields:[companyId], references:[id])

  trips               Trip[]

  seatTemplates       BusSeatTemplate[]

  maintenanceRecords  MaintenanceRecord[]

  @@index([companyId])

  @@index([status])

  @@index([busType])

  @@map("buses")
}
```

---

# 10. Business Rules

BUS-BR-001

Biển số xe phải duy nhất.

BUS-BR-002

Xe đang `ON_TRIP` không được phân công cho Trip khác.

BUS-BR-003

Xe `MAINTENANCE` không được lập lịch.

BUS-BR-004

Xe `RETIRED` chỉ được đọc, không được sử dụng.

BUS-BR-005

Số ghế phải khớp với cấu hình `bus_seat_templates`.

BUS-BR-006

Đăng kiểm hoặc bảo hiểm hết hạn thì không được tạo Trip mới.

---

# 11. Bus Lifecycle

```text
AVAILABLE
      ↓
IN_SERVICE
      ↓
ON_TRIP
      ↓
AVAILABLE
```

Bảo trì:

```text
AVAILABLE
      ↓
MAINTENANCE
      ↓
AVAILABLE
```

Ngừng hoạt động:

```text
AVAILABLE
      ↓
OUT_OF_SERVICE
      ↓
RETIRED
```

---

# 12. Seat Configuration

Ví dụ:

```text
Limousine

2 tầng

34 ghế

A01-A17

B01-B17
```

```text
Sleeper

1 tầng

40 giường
```

```text
Seater

45 ghế
```

---

# 13. Sample Data

| bus_code | plate_number | bus_type | total_seats | status |
|---|---|---|---:|---|
| BUS-001 | 51H-12345 | LIMOUSINE | 34 | AVAILABLE |
| BUS-002 | 51F-56789 | SLEEPER | 40 | ON_TRIP |
| BUS-003 | 60A-11111 | SEATER | 45 | MAINTENANCE |

---

# 14. API Mapping

```text
GET /buses

GET /buses/{id}

POST /buses

PATCH /buses/{id}

DELETE /buses/{id}

GET /buses/{id}/seat-layout

GET /buses/{id}/maintenance
```

---

# 15. Security

Operator chỉ quản lý xe của nhà xe mình.

Admin có toàn quyền.

Không cho phép xóa cứng xe đã phát sinh Trip.

---

# 16. Audit

Ghi log:

- Create Bus
- Update Bus
- Change Status
- Maintenance
- Registration Update
- Insurance Update
- Retirement

---

# 17. Performance

Expected Records

100,000+

Lookup Plate Number

<5ms

Lookup Bus Code

<5ms

Load Seat Layout

<20ms

---

# 18. Test Cases

✓ Create Bus.

✓ Duplicate Plate Number.

✓ Duplicate Bus Code.

✓ Invalid Seat Count.

✓ Assign Trip.

✓ Maintenance.

✓ Registration Expired.

---

# 19. Acceptance Criteria

✓ Bus Code duy nhất.

✓ Plate Number duy nhất.

✓ Seat Count hợp lệ.

✓ Không lập lịch cho xe Maintenance.

✓ Prisma Generate thành công.

✓ Migration thành công.

---

# 20. Related Tables

bus_companies

trips

bus_seat_templates

maintenance_records

drivers

audit_logs

---

# 21. Summary

`buses` là bảng quản lý phương tiện vận hành của BusZ. Bảng này lưu toàn bộ thông tin về xe, cấu hình ghế, trạng thái hoạt động, bảo trì và đăng kiểm, đóng vai trò nền tảng cho việc lập lịch chuyến, phân bổ ghế và điều phối đội xe.