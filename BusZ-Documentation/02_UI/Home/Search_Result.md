# Search Result Screen

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Home

Screen ID: HOME-003

Priority: Critical

Status: Draft

---

# 1. Purpose

Search Result hiển thị toàn bộ các chuyến xe phù hợp với điều kiện tìm kiếm của người dùng.

Người dùng có thể:

- Xem danh sách chuyến.
- So sánh giá.
- So sánh giờ đi.
- So sánh hãng xe.
- Xem số ghế còn trống.
- Chọn chuyến để đặt vé.

---

# 2. Business Goal

Người dùng phải tìm được chuyến phù hợp trong dưới 30 giây.

Danh sách phải:

- Chính xác
- Dễ đọc
- Dễ lọc
- Dễ sắp xếp

---

# 3. Actors

Guest

Customer

---

# 4. Preconditions

Đã hoàn thành Search.

Backend trả về danh sách chuyến.

---

# 5. UI Layout

AppBar

↓

Search Summary

↓

Filter Bar

↓

Sort Button

↓

Trip List

↓

Bottom Sheet Filter (Optional)

---

# 6. Search Summary

Hiển thị

Điểm đi

↓

Điểm đến

↓

Ngày đi

↓

Số hành khách

↓

Số chuyến tìm thấy

---

# 7. Trip Card

Mỗi Trip Card hiển thị

Bus Company

Bus Type

Departure Time

Arrival Time

Duration

Pickup Point

Drop-off Point

Price

Remaining Seats

Rating

Promotion Badge

Book Button

---

# 8. Trip Status

Available

Nearly Full

Full

Cancelled

Delayed

Promotion

VIP

Luxury

---

# 9. Business Rules

BR-001

Chỉ hiển thị chuyến còn hoạt động.

BR-002

Không hiển thị chuyến đã khởi hành.

BR-003

Ẩn chuyến đã hết vé (tùy cấu hình).

BR-004

Giá luôn là giá cuối cùng sau khuyến mãi.

BR-005

Ghế còn lại phải cập nhật theo thời gian thực.

---

# 10. Business Logic

Receive Search Condition

↓

Query Trips

↓

Query Remaining Seats

↓

Apply Promotion

↓

Apply Filter

↓

Apply Sort

↓

Return Result

↓

Render UI

---

# 11. API

POST /search

Response

Trips

Bus Company

Seats

Price

Promotion

Rating

Pickup Point

Drop-off Point

Estimated Arrival

---

GET /trips/{id}

---

# 12. Database

trips

trip_prices

trip_seats

bus_companies

routes

stations

promotions

reviews

---

# 13. Filter

Bus Company

Price Range

Departure Time

Arrival Time

Seat Type

Bus Type

Rating

Promotion

Pickup Point

Drop-off Point

---

# 14. Sort

Lowest Price

Highest Price

Earliest Departure

Latest Departure

Shortest Duration

Highest Rating

Most Popular

---

# 15. Loading State

Skeleton Trip Card

Loading Spinner

Disable Filter

---

# 16. Empty State

Không tìm thấy chuyến.

↓

Đề xuất:

Ngày khác

Tuyến gần

Khuyến mãi

---

# 17. Error State

Network Error

↓

Retry

Server Error

↓

Retry

Unknown Error

↓

Contact Support

---

# 18. Success State

Hiển thị Trip List.

Có thể Scroll.

Có thể Filter.

Có thể Sort.

---

# 19. Navigation

Trip Card

↓

Trip Detail

Back

↓

Search

Filter

↓

Filter Bottom Sheet

Sort

↓

Sort Bottom Sheet

---

# 20. Analytics

search_result_view

trip_click

filter_open

filter_apply

sort_open

sort_apply

booking_click

---

# 21. Flutter Widget Tree

Scaffold

↓

AppBar

↓

SearchSummaryWidget

↓

FilterBar

↓

Expanded

↓

ListView.builder

↓

TripCard

↓

BottomNavigationBar

---

# 22. State Management

SearchBloc

TripBloc

FilterBloc

SortBloc

PromotionBloc

---

# 23. Test Cases

✓ Có chuyến.

✓ Không có chuyến.

✓ Filter hoạt động.

✓ Sort hoạt động.

✓ Promotion đúng.

✓ Giá đúng.

✓ Ghế đúng.

✓ Scroll mượt.

---

# 24. Acceptance Criteria

✓ Danh sách hiển thị đúng.

✓ Filter hoạt động.

✓ Sort hoạt động.

✓ Trip Card đúng.

✓ Điều hướng Trip Detail.

✓ Không crash.

---

# 25. Performance

Load dưới 2 giây.

Scroll 60 FPS.

Image Lazy Loading.

Pagination.

---

# 26. Accessibility

Screen Reader.

Large Font.

Touch ≥ 48dp.

High Contrast.

---

# 27. Related Documents

Search Bus

Trip Detail

Booking

Seat Selection

API Search

Trip Database

---

# 28. Future Expansion

Infinite Scroll

AI Recommendation

Live Seat Update

Compare Trips

Favorite Trip

Smart Filter

Dynamic Pricing

---

# 29. Summary

Search Result là màn hình quyết định tỷ lệ chuyển đổi từ tìm kiếm sang đặt vé.

Toàn bộ danh sách chuyến phải chính xác, cập nhật theo thời gian thực và hỗ trợ người dùng lựa chọn chuyến xe phù hợp một cách nhanh chóng.