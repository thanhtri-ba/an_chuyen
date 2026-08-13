# Route Map Screen

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Home

Screen ID: HOME-005

Priority: High

Status: Draft

---

# 1. Purpose

Route Map hiển thị trực quan toàn bộ lộ trình của chuyến xe trên bản đồ.

Người dùng có thể:

- Xem tuyến đường.
- Xem các điểm đón.
- Xem các điểm trả.
- Xem các trạm trung chuyển.
- Ước tính khoảng cách.
- Ước tính thời gian.

---

# 2. Business Goal

Người dùng phải biết:

- Xe đi qua đâu.
- Có đón gần mình không.
- Có trả gần mình không.
- Tổng quãng đường.

---

# 3. Actors

Guest

Customer

---

# 4. Preconditions

Đã chọn Trip.

Trip tồn tại.

Có dữ liệu Route.

---

# 5. UI Layout

AppBar

↓

Map

↓

Trip Information Card

↓

Pickup Points

↓

Drop-off Points

↓

Timeline

↓

Current Location Button

↓

Book Now

---

# 6. Components

Map Widget

Polyline

Marker

Current Location Button

Zoom Button

Trip Summary

Timeline

Book Button

---

# 7. Map Provider

Version 1

OpenStreetMap

Future

Google Maps

Mapbox

---

# 8. Marker Types

Departure Station

Destination Station

Pickup Point

Drop-off Point

Checkpoint

Current Location

Future

Live Bus

---

# 9. Route Information

Distance

Estimated Time

Route Name

Province List

Number of Stops

---

# 10. Timeline

Departure Station

↓

Pickup Point

↓

Checkpoint

↓

Checkpoint

↓

Drop-off Point

↓

Destination Station

---

# 11. Pickup Points

Tên điểm

Địa chỉ

Giờ đón

Liên hệ

Khoảng cách

---

# 12. Drop-off Points

Tên điểm

Địa chỉ

Giờ trả

Liên hệ

Khoảng cách

---

# 13. Business Rules

BR-001

Route phải có ít nhất:

1 Departure

1 Destination

BR-002

Marker phải đúng tọa độ.

BR-003

Polyline phải đúng Route.

---

# 14. Business Logic

Open Route

↓

Load Route

↓

Load Marker

↓

Load Polyline

↓

Render Map

---

# 15. API

GET /routes/{routeId}

GET /routes/{routeId}/stops

GET /routes/{routeId}/polyline

---

# 16. Database

routes

route_stops

stations

locations

coordinates

---

# 17. Loading State

Loading Map

↓

Loading Marker

↓

Loading Route

---

# 18. Empty State

Không có Route

↓

Hide Map

↓

Show Message

---

# 19. Error State

Network Error

↓

Retry

GPS Error

↓

Retry

Map Error

↓

Fallback View

---

# 20. Success State

Map Loaded

↓

Interactive

↓

Book Now

---

# 21. Navigation

Trip Detail

↓

Route Map

↓

Seat Selection

---

# 22. Performance

Map Load

< 3 giây

Marker

Lazy Loading

Image Cache

Polyline Cache

---

# 23. Accessibility

Large Font

High Contrast

Marker Description

Screen Reader

---

# 24. Analytics

route_map_view

marker_click

zoom_click

location_click

book_click

---

# 25. Flutter Widget Tree

Scaffold

↓

FlutterMap

↓

TileLayer

↓

PolylineLayer

↓

MarkerLayer

↓

FloatingActionButton

↓

BottomInfoCard

↓

BookButton

---

# 26. State Management

RouteBloc

RouteRepository

LocationRepository

MapController

---

# 27. Test Cases

✓ Route đúng.

✓ Marker đúng.

✓ Polyline đúng.

✓ GPS hoạt động.

✓ Offline.

✓ Retry.

✓ Book Now.

---

# 28. Acceptance Criteria

✓ Hiển thị đúng tuyến.

✓ Marker đầy đủ.

✓ Timeline đúng.

✓ Không crash.

✓ Book Now hoạt động.

---

# 29. Related Documents

Trip Detail

Search Result

Booking

OpenStreetMap

Database

---

# 30. Future Expansion

Live Bus Tracking

Traffic Layer

Street View

Offline Map

Nearby Bus Station

ETA Realtime

Navigation

Driver Location

---

# 31. Summary

Route Map giúp người dùng trực quan hóa toàn bộ hành trình của chuyến xe, từ điểm xuất phát đến điểm đến, cùng với các điểm đón/trả và trạm dừng. Đây là nền tảng để phát triển các tính năng bản đồ nâng cao như theo dõi xe theo thời gian thực trong tương lai.