# Booking History

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Booking

Screen ID: BOOK-009

Priority: High

Status: Draft

---

# 1. Purpose

Booking History cho phép người dùng xem toàn bộ lịch sử đặt vé của mình.

Đây là nơi quản lý tất cả Booking sau khi thanh toán.

---

# 2. Business Goal

Người dùng có thể:

- Xem lịch sử.
- Tìm kiếm Booking.
- Lọc Booking.
- Xem vé.
- Tải PDF.
- Hủy vé.
- Yêu cầu hoàn tiền.
- Đánh giá chuyến đi.
- Đặt lại.

---

# 3. Actors

Customer

---

# 4. Preconditions

✓ User Login.

---

# 5. UI Layout

AppBar

↓

Search

↓

Filter

↓

Booking List

↓

Booking Card

↓

Bottom Navigation

---

# 6. Components

Search Box

Filter Button

Booking Card

Status Badge

Ticket Button

Cancel Button

Refund Button

Review Button

Book Again Button

---

# 7. Booking Status

Pending

Confirmed

Completed

Cancelled

Refunding

Refunded

Expired

---

# 8. Booking Card

Booking Code

Trip

Date

Bus Company

Seat

Passenger

Total Price

Status

---

# 9. Search

Booking Code

Passenger Name

Route

Bus Company

---

# 10. Filter

Status

Date Range

Bus Company

Price Range

Payment Status

---

# 11. Business Rules

BOOK-BR-046

User chỉ xem Booking của mình.

BOOK-BR-047

Booking Completed mới được Review.

BOOK-BR-048

Booking Confirmed mới được Download Ticket.

BOOK-BR-049

Booking Cancelled không được Book Again nếu Trip đã ngừng hoạt động.

---

# 12. Business Logic

Open History

↓

Load Booking

↓

Search

↓

Filter

↓

Sort

↓

Render

---

# 13. API

GET /bookings

GET /bookings/{id}

POST /bookings/{id}/cancel

POST /bookings/{id}/refund

POST /bookings/{id}/book-again

---

# 14. Database

bookings

booking_details

payments

tickets

refund_requests

reviews

---

# 15. Loading State

Loading Booking List

↓

Skeleton Card

---

# 16. Empty State

Không có Booking.

↓

Book Now.

---

# 17. Error State

Network Error

↓

Retry

Server Error

↓

Retry

---

# 18. Success State

Booking Loaded.

↓

Scroll.

↓

View Detail.

---

# 19. Navigation

Booking Detail

↓

Ticket Detail

Cancel

↓

Refund

Review

↓

Review Screen

Book Again

↓

Search Result

---

# 20. Analytics

booking_history_view

booking_detail_click

ticket_download

refund_request

review_click

book_again

---

# 21. Flutter Widget Tree

Scaffold

↓

SearchBar

↓

FilterBar

↓

ListView.builder

↓

BookingCard

↓

BottomNavigationBar

---

# 22. State Management

BookingHistoryBloc

BookingRepository

RefundRepository

ReviewRepository

---

# 23. Performance

Load History

< 2 giây

Pagination

20 Booking/Page

Lazy Loading

Enabled

---

# 24. Accessibility

Touch ≥ 48dp

Large Font

Screen Reader

High Contrast

---

# 25. Test Cases

✓ Booking Pending.

✓ Booking Confirmed.

✓ Booking Cancelled.

✓ Refund.

✓ Download Ticket.

✓ Book Again.

✓ Search.

✓ Filter.

---

# 26. Acceptance Criteria

✓ Hiển thị đúng.

✓ Search đúng.

✓ Filter đúng.

✓ Pagination.

✓ Không crash.

---

# 27. Related Documents

Booking Success

Payment

Ticket

Review

Refund

---

# 28. Future Expansion

Archive Booking

Export PDF

Share Booking

Travel Statistics

Favorite Booking

---

# 29. Summary

Booking History là trung tâm quản lý toàn bộ các vé và giao dịch của người dùng sau khi đặt vé thành công.