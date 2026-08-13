# Search Bus Screen

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Home

Screen ID: HOME-002

Priority: Critical

Status: Draft

---

# 1. Purpose

Search Bus là chức năng quan trọng nhất của BusZ.

Màn hình cho phép người dùng tìm kiếm các chuyến xe khách liên tỉnh theo điều kiện mong muốn.

Đây là điểm bắt đầu của toàn bộ quy trình đặt vé.

---

# 2. Business Goal

Người dùng có thể:

- Chọn điểm đi.
- Chọn điểm đến.
- Chọn ngày đi.
- Chọn ngày về (Future).
- Chọn số hành khách.
- Tìm chuyến xe phù hợp.

Thời gian thao tác mục tiêu dưới 30 giây.

---

# 3. Actors

Guest

Customer

---

# 4. Preconditions

Ứng dụng đã mở.

Có kết nối Internet.

Danh sách tỉnh/thành đã được tải.

---

# 5. UI Layout

Home

↓

Search Card

├── From
├── Swap Button
├── To
├── Departure Date
├── Passenger
└── Search Button

---

# 6. Components

Location Input

Swap Button

Date Picker

Passenger Picker

Search Button

Recent Search

Popular Routes

Current Location (Future)

---

# 7. Input Fields

## Departure

Type

Autocomplete

Required

Yes

Source

locations

---

## Destination

Type

Autocomplete

Required

Yes

Source

locations

---

## Departure Date

Required

Yes

Default

Today

Future Date Only

---

## Passenger

Minimum

1

Maximum

10

Default

1

---

# 8. Business Rules

BR-001

Điểm đi ≠ Điểm đến.

BR-002

Ngày đi ≥ Hôm nay.

BR-003

Không được để trống.

BR-004

Passenger ≥ 1.

BR-005

Không tìm chuyến quá 90 ngày.

---

# 9. Search Flow

User mở Home

↓

Chọn Điểm đi

↓

Chọn Điểm đến

↓

Chọn Ngày

↓

Chọn Số hành khách

↓

Search

↓

Validate

↓

Call API

↓

Navigate Search Result

---

# 10. Search Algorithm

Step 1

Validate Input

↓

Step 2

Find Routes

↓

Step 3

Find Trips

↓

Step 4

Filter

↓

Step 5

Sort

↓

Step 6

Return Result

---

# 11. API

GET /locations

GET /routes

POST /search

Request

{
    "departureLocationId": "",
    "destinationLocationId": "",
    "departureDate": "",
    "passenger": 1
}

---

# 12. Database

locations

routes

route_stops

trips

trip_prices

trip_seats

---

# 13. Validation

Departure required.

Destination required.

Date required.

Passenger > 0.

Departure != Destination.

---

# 14. Loading State

Disable Search Button

↓

Show Loading

↓

Wait Response

---

# 15. Empty State

Không có chuyến.

↓

Đề xuất ngày khác.

↓

Đề xuất tuyến tương tự.

---

# 16. Error State

Network Error

↓

Retry

Server Error

↓

Retry

Validation Error

↓

Show Message

---

# 17. Success State

Search Success

↓

Navigate Search Result

---

# 18. Navigation

Search

↓

Search Result

Back

↓

Home

---

# 19. Recent Search

Hiển thị:

5 lần tìm gần nhất.

Lưu Local Storage.

Có thể xóa.

---

# 20. Popular Route

Hiển thị:

Top 10 tuyến phổ biến.

Lấy từ Database.

---

# 21. Favorite Route

Future

Người dùng lưu tuyến yêu thích.

One Click Search.

---

# 22. Analytics

search_open

search_submit

swap_click

recent_click

popular_route_click

search_success

search_failed

---

# 23. Flutter Widget Tree

Scaffold

↓

CustomScrollView

↓

GreetingWidget

↓

SearchCard

├── DepartureInput
├── SwapButton
├── DestinationInput
├── DatePicker
├── PassengerPicker
└── SearchButton

↓

RecentSearchWidget

↓

PopularRouteWidget

---

# 24. State Management

SearchBloc

SearchEvent

SearchState

SearchRepository

LocationRepository

TripRepository

---

# 25. Test Cases

✓ Departure hợp lệ.

✓ Destination hợp lệ.

✓ Swap hoạt động.

✓ Passenger đúng.

✓ Date hợp lệ.

✓ Search thành công.

✓ Không Internet.

✓ Validation.

---

# 26. Acceptance Criteria

✓ Search dưới 2 giây.

✓ Điều hướng đúng.

✓ Validation đầy đủ.

✓ Swap hoạt động.

✓ Recent Search hoạt động.

✓ Popular Route hiển thị.

---

# 27. Related Documents

Booking Process

Trip Process

Route Process

Database

API Search

Search Result

---

# 28. Future Expansion

Current Location

AI Search

Voice Search

Map Search

Favorite Route

Round Trip

Multi City

---

# 29. Summary

Search Bus là chức năng cốt lõi của BusZ.

Đây là điểm bắt đầu của toàn bộ quy trình đặt vé và phải đảm bảo tốc độ, tính chính xác và trải nghiệm người dùng tốt nhất.