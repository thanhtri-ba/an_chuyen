# Trip Detail Screen

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Home

Screen ID: HOME-004

Priority: Critical

Status: Draft

---

# 1. Purpose

Trip Detail hiển thị toàn bộ thông tin của một chuyến xe trước khi người dùng chọn ghế.

Người dùng có thể:

- Xem chi tiết chuyến xe.
- Xem nhà xe.
- Xem lịch trình.
- Xem điểm đón/trả.
- Xem tiện ích.
- Xem đánh giá.
- Xem chính sách.
- Chuyển sang chọn ghế.

---

# 2. Business Goal

Cung cấp đầy đủ thông tin để người dùng quyết định đặt vé.

Mọi thông tin phải rõ ràng, minh bạch và cập nhật.

---

# 3. Actors

Customer

Guest (Read Only)

---

# 4. Preconditions

Người dùng đã chọn một chuyến xe từ Search Result.

Trip còn hoạt động.

---

# 5. UI Layout

AppBar

↓

Image Carousel

↓

Trip Summary

↓

Bus Company

↓

Schedule

↓

Pickup Point

↓

Drop-off Point

↓

Route Timeline

↓

Amenities

↓

Seat Preview

↓

Policy

↓

Reviews

↓

Book Now Button

---

# 6. Components

Back Button

Favorite Button

Image Carousel

Trip Summary Card

Company Card

Timeline

Amenity Chips

Seat Preview

Review Card

Book Now Button

---

# 7. Trip Summary

Hiển thị

- Mã chuyến
- Nhà xe
- Loại xe
- Giờ khởi hành
- Giờ đến
- Thời gian di chuyển
- Giá vé
- Ghế còn trống
- Đánh giá

---

# 8. Bus Company

Tên nhà xe

Logo

Đánh giá

Số chuyến đã chạy

Số năm hoạt động

Thông tin liên hệ

---

# 9. Schedule

Departure Time

Arrival Time

Duration

Estimated Arrival

Time Zone

---

# 10. Pickup Information

Điểm đón

Địa chỉ

Giờ đón dự kiến

Liên hệ

Bản đồ (Future)

---

# 11. Drop-off Information

Điểm trả

Địa chỉ

Giờ trả dự kiến

Liên hệ

---

# 12. Route Timeline

Bến xe xuất phát

↓

Điểm dừng 1

↓

Điểm dừng 2

↓

Điểm dừng 3

↓

Bến xe đến

---

# 13. Bus Information

Biển số (ẩn với khách)

Loại xe

Số tầng

Tổng số ghế

Đời xe

---

# 14. Amenities

WiFi

Máy lạnh

Nước uống

Khăn lạnh

USB Charging

TV

Massage Seat

Blanket

Toilet

GPS Tracking

---

# 15. Seat Preview

Hiển thị:

Số ghế còn trống

Sơ đồ ghế thu nhỏ

Không cho chọn ghế tại màn hình này.

---

# 16. Ticket Policy

Đổi vé

Hoàn vé

Hành lý

Trẻ em

Vật nuôi

Giờ có mặt

---

# 17. Cancellation Policy

Hoàn trước 24h

↓

90%

Hoàn trước 12h

↓

70%

Hoàn trước 6h

↓

50%

Sau đó

↓

Không hoàn

---

# 18. Reviews

Đánh giá trung bình

5 đánh giá gần nhất

Điểm sao

Bình luận

Hình ảnh (Future)

---

# 19. Business Rules

BR-001

Không hiển thị chuyến đã hủy.

BR-002

Chỉ hiển thị ghế còn lại.

BR-003

Giá phải là giá cuối cùng.

BR-004

Review đã được duyệt.

---

# 20. Business Logic

User chọn Trip

↓

Load Trip Detail

↓

Load Bus Company

↓

Load Route

↓

Load Seats

↓

Load Reviews

↓

Render Screen

---

# 21. API

GET /trips/{tripId}

GET /companies/{companyId}

GET /trips/{tripId}/seats

GET /trips/{tripId}/reviews

GET /trips/{tripId}/policies

---

# 22. Database

trips

trip_prices

trip_seats

routes

stations

bus_companies

reviews

trip_policies

amenities

---

# 23. Loading State

Skeleton

↓

Image Placeholder

↓

Review Skeleton

↓

Seat Preview Skeleton

---

# 24. Empty State

Không có đánh giá.

↓

Hiển thị:

"Chưa có đánh giá."

---

Không có tiện ích.

↓

Ẩn Section.

---

# 25. Error State

Không tải được dữ liệu.

↓

Retry

---

Trip không tồn tại.

↓

Back Search

---

# 26. Success State

Hiển thị đầy đủ thông tin.

Book Now khả dụng.

---

# 27. Navigation

Book Now

↓

Seat Selection

Back

↓

Search Result

Review

↓

Review List

Company

↓

Company Detail (Future)

---

# 28. Security

Không hiển thị dữ liệu nội bộ.

Không hiển thị biển số.

Không hiển thị Driver.

HTTPS.

JWT.

---

# 29. Accessibility

Large Font

Screen Reader

Touch ≥ 48dp

High Contrast

---

# 30. Performance

Load

< 2 giây

Carousel Lazy Load

Review Pagination

Image Cache

---

# 31. Analytics

trip_detail_view

book_now_click

review_click

company_click

policy_click

seat_preview_click

---

# 32. Flutter Widget Tree

Scaffold

↓

NestedScrollView

↓

SliverAppBar

↓

ImageCarousel

↓

TripSummaryCard

↓

CompanyCard

↓

TimelineWidget

↓

AmenitySection

↓

SeatPreview

↓

PolicySection

↓

ReviewSection

↓

BottomBookingBar

---

# 33. State Management

TripDetailBloc

TripDetailEvent

TripDetailState

TripRepository

ReviewRepository

SeatRepository

---

# 34. Test Cases

✓ Trip tồn tại.

✓ Trip đã hủy.

✓ Ghế còn đúng.

✓ Giá đúng.

✓ Review đúng.

✓ Book Now.

✓ Retry.

✓ Không Internet.

---

# 35. Acceptance Criteria

✓ Hiển thị đầy đủ thông tin.

✓ Giá chính xác.

✓ Ghế còn đúng.

✓ Book Now hoạt động.

✓ Điều hướng Seat Selection.

✓ Không crash.

---

# 36. Related Documents

Search Result

Seat Selection

Booking Process

Trip Process

Review Process

API Trip

Database

---

# 37. Future Expansion

360° Bus View

Live Bus Location

Driver Information

Real-time Delay

AI Recommendation

Virtual Seat Tour

AR Bus Preview

---

# 38. Summary

Trip Detail là màn hình cung cấp toàn bộ thông tin về chuyến xe trước khi người dùng đặt vé.

Màn hình này đóng vai trò kết nối giữa Search Result và Seat Selection, đồng thời giúp người dùng đưa ra quyết định đặt vé dựa trên thông tin đầy đủ, chính xác và minh bạch.