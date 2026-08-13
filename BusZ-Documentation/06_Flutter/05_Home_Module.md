# Home Module

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Flutter Mobile App

Document ID

APP-005

Priority

Critical

Version

1.0

---

# 1. Purpose

Home Module là màn hình trung tâm của ứng dụng BusZ.

Mục tiêu:

- Tìm kiếm chuyến xe nhanh
- Hiển thị thông tin quan trọng
- Gợi ý tuyến xe
- Hiển thị khuyến mãi
- Điều hướng tới các chức năng chính

---

# 2. User Flow

```text
Login

↓

Home

↓

Search

↓

Trip Detail

↓

Booking
```

---

# 3. Screen Layout

```text
SafeArea

↓

App Bar

↓

Search Card

↓

Service Menu

↓

Promotion Banner

↓

Popular Routes

↓

Nearby Stations

↓

Recent Searches

↓

Recommended Trips

↓

Bottom Navigation
```

---

# 4. App Bar

Hiển thị

- Avatar
- Lời chào
- Thành phố hiện tại
- Notification Icon

Actions

```text
Notification

Profile
```

---

# 5. Search Card

Fields

```text
Departure

Arrival

Departure Date

Passengers
```

Button

```text
Search Trips
```

Swap Button

```text
⇅
```

Đổi điểm đi và điểm đến.

---

# 6. Service Menu

Các mục

```text
Book Ticket

My Tickets

Promotions

Support

Favorite Routes

Nearby Stations
```

Grid

```text
2 x 3
```

---

# 7. Promotion Banner

Carousel

Hiển thị

- Banner
- Discount
- Expired Date

Auto Slide

```text
5 seconds
```

Indicator

✓

---

# 8. Popular Routes

Horizontal List

Hiển thị

- Route
- Lowest Price
- Duration
- Company Count

Ví dụ

```text
HCM → Đà Lạt

HCM → Nha Trang

HCM → Cần Thơ
```

---

# 9. Nearby Stations

Sử dụng GPS.

Hiển thị

- Station Name
- Distance
- Open Time

Button

```text
View Map
```

---

# 10. Recent Searches

Hiển thị

5 tuyến tìm kiếm gần nhất.

Ví dụ

```text
HCM

↓

Đà Lạt
```

Tap

↓

Search Again

---

# 11. Recommended Trips

Dựa trên

- Lịch sử tìm kiếm
- Vé đã mua
- Tuyến phổ biến

Hiển thị

- Route
- Price
- Rating
- Departure Time

---

# 12. Bottom Navigation

Tabs

```text
Home

Search

Bookings

Notifications

Profile
```

---

# 13. Pull To Refresh

Refresh

- Promotions
- Popular Routes
- Nearby Stations
- Recommendations

---

# 14. Loading State

Skeleton

Hiển thị

- Banner
- Cards
- Search

Không hiển thị màn hình trắng.

---

# 15. Empty State

Ví dụ

Không có khuyến mãi

↓

Illustration

↓

Message

↓

Refresh Button

---

# 16. Error State

Hiển thị

```text
Something went wrong.
```

Button

```text
Retry
```

---

# 17. Offline Mode

Hiển thị

```text
Offline Mode
```

Cho phép

- Xem dữ liệu cache
- Xem vé đã lưu

Không cho phép

- Thanh toán
- Đặt vé mới

---

# 18. State Management

Cubit

```text
HomeCubit
```

States

```text
HomeInitial

HomeLoading

HomeLoaded

HomeEmpty

HomeError
```

---

# 19. API Integration

Home Screen gọi

```text
GET /promotions

GET /routes/popular

GET /stations/nearby

GET /notifications/unread-count
```

---

# 20. Component Tree

```text
HomeScreen

↓

AppBar

↓

SearchCard

↓

ServiceGrid

↓

BannerCarousel

↓

PopularRoutes

↓

NearbyStations

↓

RecentSearches

↓

RecommendationList

↓

BottomNavigation
```

---

# 21. Performance

Startup

```text
<2s
```

Refresh

```text
<1s
```

Scroll

```text
60 FPS
```

Memory

```text
<150MB
```

---

# 22. Test Cases

✓ Load Home.

✓ Search.

✓ Swap Route.

✓ Promotion Banner.

✓ Pull Refresh.

✓ Offline Mode.

✓ Retry.

✓ Navigation.

---

# 23. Acceptance Criteria

✓ Skeleton Loading.

✓ Pull Refresh.

✓ Responsive.

✓ Dark Mode.

✓ Offline Cache.

✓ API Integration.

---

# 24. Related Documents

APP-002 Design System

APP-003 Navigation

APP-006 Search Module

API-006 Search Trip API

---

# 25. Summary

Home Module là màn hình chính của BusZ, tập trung các chức năng tìm kiếm chuyến xe, hiển thị khuyến mãi, tuyến phổ biến, bến xe gần nhất và gợi ý chuyến đi. Module được tối ưu với Skeleton Loading, Pull-to-Refresh, Offline Cache và Cubit để mang lại trải nghiệm mượt mà và phản hồi nhanh.