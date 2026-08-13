# Bus Route Management

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Admin Web

Document ID

ADM-006

Priority

Critical

Version

1.0

---

# 1. Purpose

Bus Route Management quản lý toàn bộ tuyến xe liên tỉnh trong hệ thống BusZ.

Bao gồm:

- Quản lý tuyến đường
- Quản lý điểm đón/trả
- Quản lý bến xe
- Giá vé
- Khoảng cách
- Thời gian di chuyển
- Trạng thái tuyến

---

# 2. User Flow

```text
Dashboard

↓

Routes

↓

Search Route

↓

View Detail

↓

Edit Route

↓

Save
```

---

# 3. Route List

Hiển thị

- Route ID
- Route Name
- Departure
- Destination
- Distance
- Duration
- Base Price
- Status

---

# 4. Search

Theo

```text
Route ID

Departure

Destination

Route Name
```

Search Delay

```text
300ms
```

---

# 5. Filters

Theo

```text
Province

Company

Status

Distance

Price Range
```

---

# 6. Create Route

Thông tin

```text
Route Name

Departure Province

Destination Province

Departure Station

Arrival Station

Distance

Estimated Duration

Base Fare
```

---

# 7. Pickup Points

Cho phép

```text
Add

Edit

Delete
```

Thông tin

```text
Name

Address

Latitude

Longitude

Pickup Time Offset
```

---

# 8. Dropoff Points

Thông tin

```text
Name

Address

Latitude

Longitude

Estimated Arrival Offset
```

---

# 9. Route Map

Sử dụng

```text
OpenStreetMap

hoặc

Mapbox
```

Hiển thị

- Đường đi
- Điểm đón
- Điểm trả
- Bến xe

---

# 10. Route Pricing

Quản lý

```text
Base Fare

Holiday Fare

Weekend Fare

Special Fare
```

Lưu lịch sử thay đổi giá.

---

# 11. Route Status

```text
ACTIVE

INACTIVE

SUSPENDED

UNDER_MAINTENANCE
```

---

# 12. Route Versioning

Mỗi thay đổi lớn

↓

Tạo

```text
Version
```

Lưu

- Người sửa
- Thời gian
- Nội dung thay đổi

---

# 13. Duplicate Check

Kiểm tra

```text
Departure

↓

Destination

↓

Stops

↓

Company
```

Nếu trùng

↓

Cảnh báo Admin.

---

# 14. Import / Export

Import

```text
Excel

CSV
```

Export

```text
Excel

CSV

PDF
```

---

# 15. Route Analytics

Hiển thị

- Tổng chuyến
- Tổng vé bán
- Tỷ lệ lấp đầy
- Doanh thu
- Điểm đánh giá

---

# 16. API Integration

```text
GET /admin/routes

GET /admin/routes/{id}

POST /admin/routes

PATCH /admin/routes/{id}

DELETE /admin/routes/{id}

POST /admin/routes/import

GET /admin/routes/export
```

---

# 17. Component Tree

```text
RouteManagementPage

↓

SearchBox

↓

FilterBar

↓

RouteTable

↓

RouteMap

↓

PickupPointList

↓

DropoffPointList

↓

PriceSection

↓

AnalyticsCard
```

---

# 18. Performance

Route Search

```text
<100ms
```

Map Load

```text
<500ms
```

Import

```text
<5s
```

---

# 19. UX Guidelines

✓ Hiển thị bản đồ trực quan.

✓ Cảnh báo tuyến trùng.

✓ Hỗ trợ kéo-thả sắp xếp điểm đón/trả.

✓ Hiển thị khoảng cách và thời gian rõ ràng.

✓ Cho phép xem lịch sử thay đổi tuyến.

---

# 20. Test Cases

✓ Create Route.

✓ Edit Route.

✓ Delete Route.

✓ Add Pickup Point.

✓ Add Dropoff Point.

✓ Duplicate Detection.

✓ Import Excel.

✓ Export PDF.

---

# 21. Acceptance Criteria

✓ CRUD hoạt động.

✓ Route Map hiển thị chính xác.

✓ Versioning hoạt động.

✓ Duplicate Check hoạt động.

✓ Import/Export thành công.

✓ Analytics chính xác.

---

# 22. Related Documents

ADM-005 Bus Company Management

ADM-007 Trip Management

API-006 Search Trip API

---

# 23. Summary

Bus Route Management là module quản lý toàn bộ tuyến xe của BusZ. Hệ thống hỗ trợ quản lý điểm đón/trả, giá vé, bản đồ tuyến, phiên bản hóa tuyến và phân tích hiệu quả hoạt động, tạo nền tảng cho việc lập lịch và vận hành chuyến xe.