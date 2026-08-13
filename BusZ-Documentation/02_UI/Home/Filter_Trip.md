# Filter Trip Screen

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Home

Screen ID: HOME-006

Priority: High

Status: Draft

---

# 1. Purpose

Filter Trip cho phép người dùng lọc danh sách chuyến xe theo nhiều tiêu chí khác nhau nhằm tìm được chuyến phù hợp nhất.

Filter hoạt động theo thời gian thực và có thể kết hợp nhiều điều kiện.

---

# 2. Business Goal

Giúp người dùng:

- Tìm chuyến nhanh hơn.
- Giảm số lượng kết quả.
- So sánh chuyến dễ hơn.
- Cá nhân hóa kết quả tìm kiếm.

---

# 3. Actors

Guest

Customer

---

# 4. Preconditions

Đã có Search Result.

Danh sách Trip đã tải thành công.

---

# 5. UI Layout

Search Result

↓

Filter Button

↓

Bottom Sheet

↓

Filter Groups

↓

Apply

↓

Reset

---

# 6. Components

Bottom Sheet

Filter Chip

Checkbox

Range Slider

Radio Button

Switch

Apply Button

Reset Button

Close Button

---

# 7. Filter Categories

Bus Company

Bus Type

Departure Time

Arrival Time

Price

Seat Type

Amenities

Pickup Point

Drop-off Point

Rating

Promotion

Remaining Seats

---

# 8. Bus Company

Checkbox List

Ví dụ

☐ Phương Trang

☐ Thành Bưởi

☐ Kumho

☐ Mai Linh

☐ Văn Minh

---

# 9. Bus Type

Checkbox

Ghế ngồi

Giường nằm

Limousine

Cabin VIP

Luxury

---

# 10. Departure Time

Radio Group

00:00 - 06:00

06:00 - 12:00

12:00 - 18:00

18:00 - 24:00

---

# 11. Arrival Time

Radio Group

00:00 - 06:00

06:00 - 12:00

12:00 - 18:00

18:00 - 24:00

---

# 12. Price Range

Range Slider

Minimum

Maximum

Realtime Update

---

# 13. Seat Type

Single Seat

Double Seat

Upper Floor

Lower Floor

Window

Aisle

---

# 14. Amenities

WiFi

USB Charging

Blanket

Water

Air Conditioner

TV

Massage Seat

Toilet

GPS

---

# 15. Pickup Point

Checkbox List

Theo từng tỉnh/thành.

Theo từng bến xe.

---

# 16. Drop-off Point

Checkbox List

Theo từng tỉnh/thành.

Theo từng bến xe.

---

# 17. Rating

5★

4★

3★

2★

1★

---

# 18. Promotion

Only Promotion

Flash Sale

Voucher

Discount

Reward Point

---

# 19. Remaining Seats

Only Available

Less than 5 seats

More than 10 seats

---

# 20. Business Rules

BR-001

Có thể chọn nhiều Filter.

BR-002

Filter hoạt động kết hợp (AND).

BR-003

Reset đưa về mặc định.

BR-004

Apply không gọi API nếu Filter không thay đổi.

BR-005

Filter được lưu trong phiên làm việc.

---

# 21. Business Logic

Open Filter

↓

Load Current Filter

↓

User Select

↓

Validate

↓

Apply Filter

↓

Update Search Result

↓

Close Bottom Sheet

---

# 22. API

POST /search/filter

Request

{
    "companies": [],
    "busTypes": [],
    "price": {
        "min": 100000,
        "max": 500000
    },
    "departureTime": [],
    "amenities": []
}

---

# 23. Database

trips

trip_prices

trip_seats

bus_companies

amenities

stations

routes

---

# 24. Loading State

Disable Apply

↓

Loading

↓

Update Result

---

# 25. Empty State

Không còn chuyến phù hợp.

↓

Hiển thị

"Không có chuyến phù hợp với bộ lọc."

↓

Reset Filter

---

# 26. Error State

Network Error

↓

Retry

Server Error

↓

Retry

---

# 27. Success State

Filter thành công.

Trip List cập nhật.

---

# 28. Navigation

Search Result

↓

Filter Bottom Sheet

↓

Search Result

---

# 29. Analytics

filter_open

filter_apply

filter_reset

company_filter

price_filter

amenity_filter

---

# 30. Flutter Widget Tree

BottomSheet

↓

ListView

↓

ExpansionTile

↓

CheckboxListTile

↓

RangeSlider

↓

RadioListTile

↓

FilledButton

↓

OutlinedButton

---

# 31. State Management

FilterBloc

FilterState

FilterEvent

FilterRepository

---

# 32. Test Cases

✓ Lọc theo hãng xe.

✓ Lọc theo giá.

✓ Lọc theo tiện ích.

✓ Lọc nhiều điều kiện.

✓ Reset.

✓ Không có kết quả.

✓ Offline.

---

# 33. Acceptance Criteria

✓ Filter chính xác.

✓ Apply nhanh.

✓ Reset đúng.

✓ Không crash.

✓ UI phản hồi mượt.

---

# 34. Related Documents

Search Result

Sort Trip

Trip Detail

Search API

Database

---

# 35. Future Expansion

AI Filter

Smart Recommendation

Saved Filter

Nearby Pickup

Weather Filter

Eco-friendly Bus

---

# 36. Summary

Filter Trip giúp người dùng thu hẹp danh sách chuyến xe theo các tiêu chí mong muốn, nâng cao trải nghiệm tìm kiếm và hỗ trợ lựa chọn chuyến xe phù hợp một cách nhanh chóng.