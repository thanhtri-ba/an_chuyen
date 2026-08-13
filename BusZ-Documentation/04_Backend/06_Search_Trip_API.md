# Search Trip API

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Backend API

Document ID

API-006

Priority

Critical

Version

1.0

---

# 1. Purpose

Search Trip API cho phép khách hàng tìm kiếm các chuyến xe phù hợp theo:

- Điểm đi
- Điểm đến
- Ngày khởi hành
- Số hành khách
- Bộ lọc nâng cao
- Sắp xếp

Đây là API có lưu lượng truy cập lớn nhất trong toàn bộ hệ thống BusZ.

---

# 2. Authentication

Không bắt buộc.

Người dùng chưa đăng nhập vẫn có thể tìm kiếm.

Một số dữ liệu cá nhân hóa (favorite routes, recently searched) chỉ trả về khi đã đăng nhập.

---

# 3. Endpoints Overview

| Method | Endpoint | Auth |
|----------|---------------------------|------|
| GET | /trips/search | ❌ |
| GET | /trips/{id} | ❌ |
| GET | /trips/{id}/seats | ❌ |
| GET | /routes/popular | ❌ |
| GET | /stations/search | ❌ |
| GET | /stations/nearby | ❌ |

---

# 4. Search Trips

Endpoint

```
GET /trips/search
```

---

# 5. Query Parameters

| Parameter | Required | Description |
|------------|----------|-------------|
| departureStationId | ✅ | Bến đi |
| arrivalStationId | ✅ | Bến đến |
| departureDate | ✅ | Ngày khởi hành |
| passengers | ❌ | Số hành khách |
| busType | ❌ | Loại xe |
| companyId | ❌ | Nhà xe |
| minPrice | ❌ | Giá tối thiểu |
| maxPrice | ❌ | Giá tối đa |
| departureFrom | ❌ | Giờ đi từ |
| departureTo | ❌ | Giờ đi đến |
| amenities | ❌ | WiFi, USB... |
| sort | ❌ | price, departureTime, rating |
| page | ❌ | Trang |
| limit | ❌ | Số bản ghi |

---

# 6. Example Request

```
GET

/api/v1/trips/search?

departureStationId=...

&arrivalStationId=...

&departureDate=2026-07-15

&passengers=2

&busType=LIMOUSINE

&sort=price

&page=1

&limit=20
```

---

# 7. Response

```json
{
  "success": true,
  "data": [
    {
      "tripId": "uuid",
      "company": "Phuong Trang",
      "route": "HCM → Da Lat",
      "departureTime": "2026-07-15T22:00:00Z",
      "arrivalTime": "2026-07-16T05:30:00Z",
      "duration": 450,
      "availableSeats": 12,
      "price": 320000,
      "busType": "LIMOUSINE",
      "rating": 4.8
    }
  ],
  "meta": {
    "page":1,
    "limit":20,
    "total":58
  }
}
```

---

# 8. Search Filters

Bus Type

```
SEATER

SLEEPER

LIMOUSINE

VIP
```

---

Amenities

```
WiFi

USB

Blanket

Water

TV

Toilet
```

---

Price

```
Min

↓

Max
```

---

Departure Time

```
Morning

Afternoon

Evening

Night
```

---

# 9. Sort Options

```
price

-price

departureTime

-departureTime

rating

-rating
```

---

# 10. Trip Detail

Endpoint

```
GET /trips/{id}
```

Response

- Route
- Bus
- Driver
- Amenities
- Stops
- Seat Summary
- Company

---

# 11. Seat Summary

Endpoint

```
GET /trips/{id}/seats
```

Không trả Passenger.

Chỉ trả:

```
AVAILABLE

BOOKED

LOCKED

BLOCKED
```

---

# 12. Popular Routes

Endpoint

```
GET /routes/popular
```

Response

```json
[
  {
    "route":"HCM → Da Lat",
    "searchCount":52340
  }
]
```

---

# 13. Nearby Stations

Endpoint

```
GET /stations/nearby
```

Parameters

```
latitude

longitude

radius
```

Response

```json
[
  {
    "station":"Ben Xe Mien Dong",
    "distance":1.2
  }
]
```

---

# 14. Search Flow

```
Flutter

↓

Redis Cache

↓

Search Service

↓

Prisma

↓

PostgreSQL

↓

Response
```

---

# 15. Business Rules

SEARCH-BR-001

Không hiển thị Trip CANCELLED.

---

SEARCH-BR-002

Không hiển thị Trip đã khởi hành.

---

SEARCH-BR-003

Chỉ hiển thị Trip ACTIVE.

---

SEARCH-BR-004

Available Seats phải cập nhật theo Trip Seats.

---

SEARCH-BR-005

Nếu không có kết quả, trả về danh sách rỗng (`[]`), không trả lỗi.

---

# 16. Cache Strategy

Redis

Cache Key

```
trip_search:

departure

arrival

date

filter
```

TTL

```
60 giây
```

---

# 17. Validation

Ngày

>= Today

Passengers

1-10

Price

>=0

Page

>=1

Limit

1-100

---

# 18. Error Codes

| Code | Description |
|------|-------------|
| TRIP_001 | Route Not Found |
| TRIP_002 | Invalid Date |
| TRIP_003 | Invalid Station |
| TRIP_004 | Invalid Filter |

---

# 19. Performance

Target

```
<150ms
```

Cache Hit

```
<30ms
```

Database Query

```
<80ms
```

---

# 20. Sequence Diagram

```
Flutter

↓

Search API

↓

Redis

↓

(Cache Miss)

↓

Prisma

↓

PostgreSQL

↓

Redis Cache

↓

Response
```

---

# 21. Test Cases

✓ Search Normal.

✓ Search No Result.

✓ Invalid Date.

✓ Invalid Station.

✓ Pagination.

✓ Sort.

✓ Filter.

✓ Cache.

---

# 22. Acceptance Criteria

✓ Pagination hoạt động.

✓ Cache hoạt động.

✓ Không trả Trip đã hủy.

✓ Available Seats chính xác.

✓ Response <150ms.

---

# 23. Related Documents

API-007 Booking API

DB-009 Trips

DB-013 Seats

---

# 24. Summary

Search Trip API là trung tâm của hệ thống BusZ, cho phép người dùng tìm kiếm chuyến xe theo nhiều tiêu chí khác nhau với hiệu năng cao nhờ Redis Cache, hỗ trợ bộ lọc, sắp xếp, phân trang và hiển thị trạng thái ghế theo thời gian thực.