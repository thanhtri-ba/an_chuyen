# Search Module

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Flutter Mobile App

Document ID

APP-006

Priority

Critical

Version

1.0

---

# 1. Purpose

Search Module là chức năng quan trọng nhất của BusZ.

Mục tiêu:

- Tìm kiếm chuyến xe nhanh
- Bộ lọc linh hoạt
- Gợi ý tuyến xe
- Cập nhật số ghế theo thời gian thực
- Hỗ trợ tìm kiếm gần đúng

---

# 2. User Flow

```text
Home

↓

Search

↓

Search Result

↓

Trip Detail

↓

Seat Selection
```

---

# 3. Search Screen Layout

```text
AppBar

↓

Search Form

↓

Search History

↓

Popular Routes

↓

Recent Routes

↓

Search Button
```

---

# 4. Search Form

Fields

```text
Departure

Arrival

Departure Date

Passengers
```

Button

```text
Search
```

Swap Button

```text
⇅
```

---

# 5. Station Autocomplete

Endpoint

```text
GET /stations/search
```

Search Delay

```text
300ms
```

Hiển thị

- Tên bến xe
- Thành phố
- Địa chỉ

---

# 6. Date Picker

Cho phép chọn

- Hôm nay
- Ngày mai
- 30 ngày tiếp theo

Không cho phép chọn ngày quá khứ.

---

# 7. Passenger Selector

Adults

```
1–10
```

Children

```
0–10
```

Infants

```
0–5
```

Hiển thị tổng số hành khách.

---

# 8. Search History

Hiển thị

```
5
```

lần tìm kiếm gần nhất.

Lưu bằng

```text
Hive
```

---

# 9. Favorite Routes

Ví dụ

```text
HCM → Đà Lạt

HCM → Nha Trang

Đà Nẵng → Huế
```

Tap

↓

Search ngay.

---

# 10. Search Result Layout

```text
Filter Bar

↓

Sort Bar

↓

Trip List

↓

Pagination
```

---

# 11. Trip Card

Hiển thị

- Nhà xe
- Tuyến
- Giờ đi
- Giờ đến
- Thời gian di chuyển
- Giá
- Loại xe
- Ghế còn lại
- Rating

Button

```text
Select Seats
```

---

# 12. Filter

Theo

- Giá
- Nhà xe
- Loại xe
- Tiện ích
- Giờ khởi hành
- Điểm đón
- Điểm trả

---

# 13. Sort

```text
Lowest Price

Highest Price

Earliest Departure

Latest Departure

Highest Rating
```

---

# 14. Real-time Seat Update

Sử dụng

```text
Supabase Realtime

hoặc

WebSocket
```

Hiển thị

```text
Seats Left
```

tự động cập nhật.

---

# 15. Loading State

Skeleton

- Search Form
- Filter
- Trip Card

---

# 16. Empty State

```text
No trips found.
```

Hiển thị

- Illustration
- Suggest Nearby Date
- Search Again

---

# 17. Error State

Ví dụ

```text
Unable to load trips.
```

Buttons

```text
Retry

Back
```

---

# 18. Offline Mode

Cho phép

- Xem Search History
- Favorite Routes

Không cho phép

- Search mới

---

# 19. State Management

Cubit

```text
SearchCubit
```

States

```text
SearchInitial

SearchLoading

SearchLoaded

SearchEmpty

SearchError
```

---

# 20. API Integration

```text
GET /trips/search

GET /routes/popular

GET /stations/search

GET /stations/nearby
```

---

# 21. Component Tree

```text
SearchScreen

↓

SearchForm

↓

HistorySection

↓

FavoriteRoutes

↓

FilterBar

↓

SortBar

↓

TripList

↓

TripCard

↓

Pagination
```

---

# 22. Performance

Autocomplete

```text
<200ms
```

Search

```text
<150ms
```

Realtime Update

```text
<1s
```

Scroll

```text
60 FPS
```

---

# 23. Test Cases

✓ Search Success.

✓ Swap Station.

✓ Invalid Date.

✓ Filter.

✓ Sort.

✓ Empty Result.

✓ Offline.

✓ Realtime Seat Update.

---

# 24. Acceptance Criteria

✓ Search chính xác.

✓ Filter hoạt động.

✓ Sort hoạt động.

✓ Realtime Seat Update.

✓ Search History.

✓ Favorite Routes.

---

# 25. Related Documents

APP-005 Home Module

APP-007 Booking Module

API-006 Search Trip API

---

# 26. Summary

Search Module là trung tâm của trải nghiệm đặt vé BusZ. Module hỗ trợ tìm kiếm chuyến xe theo nhiều tiêu chí, bộ lọc nâng cao, sắp xếp kết quả, tự động gợi ý tuyến đường và cập nhật số ghế theo thời gian thực, mang lại trải nghiệm nhanh chóng và trực quan cho người dùng.