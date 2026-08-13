# Pickup & Drop-off Screen

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Booking

Screen ID: BOOK-004

Priority: Critical

Status: Draft

---

# 1. Purpose

Pickup & Drop-off cho phép người dùng lựa chọn điểm đón và điểm trả phù hợp với chuyến xe đã chọn.

Mỗi chuyến xe có thể có nhiều điểm đón và nhiều điểm trả.

Điểm được chọn sẽ ảnh hưởng đến:

- Giờ đón
- Giờ trả
- Giá vé (nếu có phụ phí)
- Vé điện tử
- Lộ trình của hành khách

---

# 2. Business Goal

Người dùng có thể:

- Xem danh sách điểm đón.
- Xem danh sách điểm trả.
- Chọn địa điểm phù hợp.
- Xem thời gian đón/trả.
- Xem phụ phí (nếu có).

---

# 3. Actors

Customer

---

# 4. Preconditions

✓ Đã chọn Trip.

✓ Đã nhập Passenger.

✓ Đã nhập Contact Information.

---

# 5. UI Layout

AppBar

↓

Trip Summary

↓

Pickup Section

↓

Drop-off Section

↓

Map Preview

↓

Price Summary

↓

Continue Button

---

# 6. Components

Trip Summary Card

Pickup Card

Drop-off Card

Station Card

Time Badge

Fee Badge

Mini Map

Continue Button

---

# 7. Pickup Information

Station Name

Address

Province

Pickup Time

Distance

Additional Fee

Available Status

---

# 8. Drop-off Information

Station Name

Address

Province

Drop-off Time

Distance

Additional Fee

Available Status

---

# 9. Business Rules

BOOK-BR-018

Bắt buộc chọn điểm đón.

BOOK-BR-019

Bắt buộc chọn điểm trả.

BOOK-BR-020

Điểm đón phải thuộc chuyến xe.

BOOK-BR-021

Điểm trả phải thuộc chuyến xe.

BOOK-BR-022

Điểm trả phải nằm sau điểm đón theo lộ trình.

BOOK-BR-023

Một số điểm có thể phát sinh phụ phí.

BOOK-BR-024

Không hiển thị điểm đã ngừng hoạt động.

---

# 10. Business Logic

Load Trip

↓

Load Pickup Points

↓

Load Drop-off Points

↓

User Select Pickup

↓

User Select Drop-off

↓

Calculate Price

↓

Continue

---

# 11. API

GET /trips/{tripId}/pickup-points

GET /trips/{tripId}/dropoff-points

POST /booking/pickup-dropoff

GET /pricing/calculate

---

# 12. Database

stations

trip_pickup_points

trip_dropoff_points

routes

booking_locations

trip_prices

---

# 13. Validation

Pickup được chọn.

Drop-off được chọn.

Pickup trước Drop-off.

Điểm còn hoạt động.

---

# 14. Loading State

Loading Pickup

↓

Loading Drop-off

↓

Loading Map

↓

Loading Price

---

# 15. Empty State

Không có điểm đón.

↓

Không thể tiếp tục.

---

Không có điểm trả.

↓

Thông báo cho người dùng.

---

# 16. Error State

Network Error.

↓

Retry.

Server Error.

↓

Retry.

Pricing Error.

↓

Refresh.

---

# 17. Success State

Pickup Selected.

↓

Drop-off Selected.

↓

Price Updated.

↓

Continue Enabled.

---

# 18. Price Calculation

Base Ticket

+

Pickup Fee

+

Drop-off Fee

-

Promotion

=

Final Price

---

# 19. Map Preview

Hiển thị:

Departure

↓

Pickup Point

↓

Drop-off Point

↓

Destination

Chỉ để xem, không chỉnh sửa.

---

# 20. Navigation

Continue

↓

Booking Summary

Back

↓

Contact Information

View Route

↓

Route Map

---

# 21. Analytics

pickup_view

pickup_selected

dropoff_selected

price_updated

continue_booking

map_preview_open

---

# 22. Flutter Widget Tree

Scaffold

↓

CustomScrollView

↓

TripSummaryCard

↓

PickupSection

↓

DropoffSection

↓

MiniMapWidget

↓

PriceSummaryCard

↓

BottomActionBar

---

# 23. State Management

PickupBloc

DropoffBloc

PricingBloc

BookingBloc

StationRepository

---

# 24. Performance

Load Pickup

< 1 giây

Load Price

< 500ms

Map Preview

< 2 giây

---

# 25. Accessibility

Touch Area ≥ 48dp

Screen Reader

Large Font

High Contrast

---

# 26. Test Cases

✓ Chọn điểm đón.

✓ Chọn điểm trả.

✓ Pickup sau Drop-off.

✓ Có phụ phí.

✓ Không có phụ phí.

✓ Không Internet.

✓ Continue.

---

# 27. Acceptance Criteria

✓ Chọn đúng điểm đón.

✓ Chọn đúng điểm trả.

✓ Giá cập nhật đúng.

✓ Continue hoạt động.

✓ Không crash.

---

# 28. Related Documents

Seat Selection

Passenger Information

Contact Information

Booking Summary

Route Map

Pricing API

---

# 29. Future Expansion

Current Location Pickup

Nearest Pickup Suggestion

Map Selection

Home Pickup

Airport Pickup

Realtime ETA

Ride Sharing Pickup

---

# 30. Summary

Pickup & Drop-off giúp người dùng lựa chọn chính xác địa điểm lên và xuống xe theo từng chuyến.

Mọi thay đổi về điểm đón/trả phải được đồng bộ ngay vào giá vé, thời gian dự kiến và thông tin hiển thị trên vé điện tử.