# Home Dashboard

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Home

Screen ID: HOME-001

Priority: Critical

Status: Draft

---

# 1. Purpose

Home Dashboard là màn hình chính sau khi người dùng đăng nhập.

Đây là nơi người dùng bắt đầu mọi thao tác trong ứng dụng.

Mục tiêu:

- Tìm chuyến xe
- Xem khuyến mãi
- Truy cập vé
- Xem thông báo
- Quản lý tài khoản

---

# 2. Business Goal

Home Screen phải giúp người dùng:

✓ Tìm chuyến xe dưới 30 giây.

✓ Đặt vé dưới 3 phút.

✓ Dễ dàng xem vé.

✓ Dễ dàng truy cập lịch sử.

---

# 3. Actors

Customer

Guest (Limited)

---

# 4. Preconditions

Ứng dụng khởi động thành công.

Token hợp lệ.

Có Internet.

---

# 5. UI Layout

Status Bar

↓

App Bar

↓

Greeting Section

↓

Search Bus Card

↓

Popular Routes

↓

Promotions

↓

Upcoming Trips

↓

Recent Booking

↓

Bottom Navigation

---

# 6. Sections

## 6.1 Greeting

Hiển thị:

Avatar

Tên người dùng

Điểm thưởng

Notification Icon

---

## 6.2 Search Card

Điểm đi

↓

Điểm đến

↓

Ngày đi

↓

Số hành khách

↓

Search Button

---

## 6.3 Promotion

Banner

Voucher

Flash Sale

Hot Deal

---

## 6.4 Popular Routes

HCM

↓

Đà Lạt

↓

Nha Trang

↓

Đà Nẵng

↓

Huế

↓

Cần Thơ

---

## 6.5 Upcoming Trip

Chuyến gần nhất.

Hiển thị:

Nhà xe

Ngày

Ghế

QR

---

## 6.6 Recent Booking

Booking gần đây.

Trạng thái.

Thanh toán.

---

# 7. Components

AppBar

Avatar

Notification Badge

Search Card

Promotion Banner

Route Card

Trip Card

Booking Card

Bottom Navigation

Floating Button (Future)

---

# 8. Business Rules

BR-001

Guest không xem Booking.

BR-002

Promotion phải còn hiệu lực.

BR-003

Popular Route lấy theo thống kê.

BR-004

Upcoming Trip ưu tiên chuyến gần nhất.

---

# 9. Business Logic

Open Home

↓

Load User

↓

Load Promotion

↓

Load Popular Route

↓

Load Upcoming Trip

↓

Load Recent Booking

↓

Render UI

---

# 10. API

GET /users/me

GET /promotions

GET /routes/popular

GET /bookings/upcoming

GET /bookings/recent

GET /notifications/unread

---

# 11. Database

users

bookings

routes

promotions

notifications

reward_points

---

# 12. UI States

Loading

Empty

Success

Offline

Error

---

# 13. Loading State

Skeleton Loading

↓

Promotion Skeleton

↓

Trip Skeleton

↓

Booking Skeleton

---

# 14. Empty State

Không có chuyến.

↓

Book Now

---

Không có Promotion.

↓

Ẩn Section.

---

Không có Booking.

↓

Explore Route.

---

# 15. Error State

Network Error.

Server Error.

Timeout.

Retry.

---

# 16. Success State

Hiển thị toàn bộ dữ liệu.

Scroll mượt.

---

# 17. Navigation

Search

↓

Search Result

Promotion

↓

Promotion Detail

Upcoming Trip

↓

Ticket Detail

Recent Booking

↓

Booking Detail

Notification

↓

Notification Screen

Avatar

↓

Profile

---

# 18. Security

Không cache Token.

Không hiển thị dữ liệu người khác.

HTTPS.

JWT.

---

# 19. Accessibility

Screen Reader.

Dynamic Font.

Touch ≥ 48dp.

High Contrast.

---

# 20. Performance

Load Home

< 2 giây

Scroll

60 FPS

Image Lazy Load

---

# 21. Analytics

home_view

promotion_click

route_click

booking_click

notification_click

search_click

---

# 22. Flutter Widget Tree

Scaffold

↓

SafeArea

↓

CustomScrollView

↓

SliverAppBar

↓

GreetingWidget

↓

SearchCard

↓

PromotionCarousel

↓

PopularRouteSection

↓

UpcomingTripCard

↓

RecentBookingCard

↓

BottomNavigationBar

---

# 23. State Management

HomeBloc

HomeEvent

HomeState

HomeRepository

PromotionRepository

BookingRepository

---

# 24. Test Cases

✓ Load Home.

✓ Không Internet.

✓ Promotion rỗng.

✓ Booking rỗng.

✓ Search hoạt động.

✓ Avatar hoạt động.

✓ Notification Badge.

---

# 25. Acceptance Criteria

✓ Home tải dưới 2 giây.

✓ Promotion hiển thị đúng.

✓ Popular Route đúng.

✓ Booking gần nhất đúng.

✓ Không crash.

---

# 26. Related Documents

Booking Process

Search Process

Notification Process

Profile

API Home

Database

---

# 27. Future Expansion

Weather

AI Recommendation

Smart Search

Continue Booking

Nearby Bus Station

Live Bus Tracking

Quick Booking

Personalized Banner

---

# 28. Summary

Home Dashboard là trung tâm của toàn bộ ứng dụng BusZ.

Đây là màn hình người dùng sử dụng nhiều nhất, vì vậy phải đảm bảo tốc độ, trải nghiệm và khả năng mở rộng trong tương lai.