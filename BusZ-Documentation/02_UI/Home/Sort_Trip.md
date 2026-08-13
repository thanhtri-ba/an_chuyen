# Sort Trip Screen

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Home

Screen ID: HOME-007

Priority: High

Status: Draft

---

# 1. Purpose

Sort Trip cho phép người dùng sắp xếp danh sách chuyến xe theo nhiều tiêu chí khác nhau nhằm tìm chuyến phù hợp nhất.

Sort chỉ thay đổi thứ tự hiển thị, không làm thay đổi dữ liệu.

---

# 2. Business Goal

Người dùng có thể:

- Tìm chuyến rẻ nhất.
- Tìm chuyến nhanh nhất.
- Tìm chuyến khởi hành sớm.
- Tìm chuyến đánh giá cao.

---

# 3. Actors

Guest

Customer

---

# 4. Preconditions

Đã có Search Result.

Danh sách chuyến đã tải.

---

# 5. UI Layout

Search Result

↓

Sort Button

↓

Bottom Sheet

↓

Sort Options

↓

Apply

↓

Close

---

# 6. Components

Bottom Sheet

Radio List

Apply Button

Cancel Button

Close Icon

---

# 7. Sort Options

Recommended

↓

Lowest Price

↓

Highest Price

↓

Earliest Departure

↓

Latest Departure

↓

Shortest Duration

↓

Longest Duration

↓

Highest Rating

↓

Most Popular

↓

Remaining Seats

---

# 8. Default Sort

Recommended

Thuật toán dựa trên:

- Giá
- Đánh giá
- Thời gian
- Độ phổ biến
- Tỷ lệ đặt vé

---

# 9. Business Rules

BR-001

Chỉ được chọn một kiểu Sort.

BR-002

Sort không làm thay đổi Filter.

BR-003

Sort được lưu trong phiên làm việc.

BR-004

Sort mặc định là Recommended.

---

# 10. Business Logic

Open Sort

↓

Select Option

↓

Apply

↓

Sort Result

↓

Update UI

---

# 11. Sorting Algorithm

Lowest Price

ASC(price)

---

Highest Price

DESC(price)

---

Earliest Departure

ASC(departure_time)

---

Latest Departure

DESC(departure_time)

---

Shortest Duration

ASC(duration)

---

Highest Rating

DESC(rating)

---

Most Popular

DESC(total_booking)

---

Remaining Seats

DESC(available_seats)

---

# 12. API

POST /search/sort

Request

{
    "sortBy": "PRICE_ASC"
}

---

# 13. Database

trips

trip_prices

reviews

trip_statistics

trip_seats

---

# 14. Loading State

Loading

↓

Sorting

↓

Refresh List

---

# 15. Empty State

Không áp dụng.

---

# 16. Error State

Network Error

↓

Retry

Server Error

↓

Retry

---

# 17. Success State

Danh sách được sắp xếp thành công.

---

# 18. Navigation

Search Result

↓

Sort Bottom Sheet

↓

Search Result

---

# 19. Analytics

sort_open

sort_apply

sort_price

sort_rating

sort_duration

sort_popular

---

# 20. Flutter Widget Tree

ModalBottomSheet

↓

ListView

↓

RadioListTile

↓

FilledButton

↓

OutlinedButton

---

# 21. State Management

SortBloc

SortState

SortEvent

SearchBloc

---

# 22. Test Cases

✓ Sort theo giá tăng.

✓ Sort theo giá giảm.

✓ Sort theo đánh giá.

✓ Sort theo thời gian.

✓ Sort theo ghế.

✓ Offline.

---

# 23. Acceptance Criteria

✓ Chỉ chọn một Sort.

✓ Danh sách cập nhật đúng.

✓ Không ảnh hưởng Filter.

✓ Không crash.

---

# 24. Related Documents

Search Result

Filter Trip

Trip Detail

Search API

---

# 25. Future Expansion

AI Recommended

Personalized Sort

Eco-friendly Sort

Fastest Route

Lowest CO₂

---

# 26. Summary

Sort Trip giúp người dùng nhanh chóng sắp xếp danh sách chuyến xe theo tiêu chí mong muốn, hỗ trợ lựa chọn chuyến phù hợp một cách hiệu quả.