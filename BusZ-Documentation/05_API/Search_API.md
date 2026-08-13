# Search API

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Trip Search

Document ID

API-003

Priority

Critical

Version

1.0

---

# 1. Purpose

Search API cung cấp chức năng tìm kiếm chuyến xe theo nhu cầu của hành khách.

Hỗ trợ

- Search Trips
- Search Routes
- Search Bus Stations
- Search Pickup Points
- Search Dropoff Points
- Autocomplete
- Search History
- Popular Destinations

---

# 2. API Overview

```text
Passenger

↓

Search API

↓

Search Service

↓

Route Service

↓

Trip Service

↓

PostgreSQL
```

---

# 3. Search Flow

```text
Select Departure

↓

Select Destination

↓

Select Travel Date

↓

Select Passenger Count

↓

Search

↓

Available Trips
```

---

# 4. API Endpoints

```text
GET /search

GET /search/routes

GET /search/stations

GET /search/popular

GET /search/history

DELETE /search/history

GET /search/suggestions

GET /search/nearby
```

---

# 5. Search Trip

Endpoint

```http
GET /api/v1/search
```

Description

Tìm kiếm chuyến xe theo điều kiện.

---

# 6. Query Parameters

```text
departure

destination

travelDate

passengers

busType

company

priceMin

priceMax

departureTime

sort
```

---

# 7. Example Request

```http
GET /api/v1/search?
departure=Ho Chi Minh&
destination=Da Lat&
travelDate=2026-07-10&
passengers=2
```

---

# 8. Success Response

```json
{
    "success":true,
    "data":[
        {
            "tripId":"TR001",
            "company":"BusZ Express",
            "departure":"22:00",
            "arrival":"05:30",
            "availableSeats":18,
            "price":320000
        }
    ]
}
```

---

# 9. Search Filters

```text
Bus Company

Bus Type

Price

Departure Time

Arrival Time

Rating

Available Seats
```

---

# 10. Sort Options

```text
Lowest Price

Highest Price

Earliest Departure

Latest Departure

Shortest Duration

Highest Rating

Most Popular
```

---

# 11. Autocomplete

Endpoint

```http
GET /api/v1/search/suggestions
```

Description

Gợi ý địa điểm khi nhập.

Ví dụ

```text
Ho Chi Minh

Ha Noi

Can Tho

Da Nang

Da Lat
```

---

# 12. Popular Destinations

Endpoint

```http
GET /api/v1/search/popular
```

Hiển thị

```text
Top Routes

Trending Destinations

Popular Cities
```

---

# 13. Search History

Endpoint

```http
GET /api/v1/search/history
```

Lưu

```text
Departure

Destination

Travel Date

Search Time
```

---

# 14. Nearby Stations

Endpoint

```http
GET /api/v1/search/nearby
```

Query

```text
Latitude

Longitude
```

Trả về

```text
Nearby Bus Stations

Pickup Points

Dropoff Points
```

---

# 15. Validation Rules

```text
Departure Required

Destination Required

Travel Date Required

Passengers > 0

Departure ≠ Destination

Travel Date ≥ Today
```

---

# 16. Business Rules

```text
Maximum Passenger

6

Search only future trips

Hide cancelled trips

Hide sold-out trips
```

---

# 17. Cache Strategy

Cache

```text
Popular Routes

Popular Destinations

Stations

Cities
```

TTL

```text
30 Minutes
```

---

# 18. Security

```text
HTTPS

Rate Limit

Input Validation

SQL Injection Protection
```

---

# 19. Database Tables

```text
Routes

Trips

Companies

Stations

SearchHistory

Locations
```

---

# 20. Error Codes

```text
INVALID_LOCATION

INVALID_DATE

ROUTE_NOT_FOUND

NO_TRIPS_FOUND

INVALID_PASSENGER_COUNT

SEARCH_LIMIT_EXCEEDED
```

---

# 21. Performance Targets

Search Response

```text
<800 ms
```

Autocomplete

```text
<200 ms
```

Nearby Search

```text
<500 ms
```

---

# 22. Acceptance Criteria

✓ Tìm đúng tuyến xe

✓ Filter hoạt động

✓ Sort hoạt động

✓ Search History lưu đúng

✓ Popular Routes hiển thị

✓ Nearby Station chính xác

---

# 23. Related Documents

Route API

Trip API

Booking API

Database Schema

Business Rules

---

# 24. Summary

Search API là điểm bắt đầu của hành trình đặt vé trên BusZ. API cung cấp khả năng tìm kiếm chuyến xe theo nhiều tiêu chí, hỗ trợ bộ lọc, sắp xếp, gợi ý thông minh và lưu lịch sử tìm kiếm nhằm nâng cao trải nghiệm người dùng và tối ưu hiệu năng hệ thống.