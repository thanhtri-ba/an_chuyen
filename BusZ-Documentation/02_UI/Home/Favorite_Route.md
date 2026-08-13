# Favorite Route

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Home

Screen ID: HOME-008

Priority: Medium

Status: Draft

---

# 1. Purpose

Favorite Route cho phép người dùng lưu các tuyến xe thường xuyên sử dụng để có thể tìm kiếm nhanh trong tương lai.

Đây là tính năng giúp tăng tốc độ đặt vé và cá nhân hóa trải nghiệm.

---

# 2. Business Goal

Người dùng có thể:

- Lưu tuyến yêu thích.
- Xóa tuyến yêu thích.
- Tìm chuyến bằng một lần chạm.
- Đồng bộ giữa nhiều thiết bị.

---

# 3. Actors

Customer

---

# 4. Preconditions

User đã đăng nhập.

Đã từng tìm kiếm hoặc đặt vé.

---

# 5. UI Layout

Home

↓

Favorite Route Section

↓

Favorite Route Card

↓

One Tap Search

↓

Manage Favorites

---

# 6. Components

Favorite Card

Route Name

Departure

Destination

Favorite Icon

Delete Button

Search Button

Empty State

---

# 7. Route Information

Departure Province

Destination Province

Most Used Bus Company

Average Price

Last Search

Total Booking

---

# 8. Business Rules

BR-001

Chỉ User đăng nhập mới được lưu.

BR-002

Không lưu trùng tuyến.

BR-003

Một User tối đa:

100 Favorite Route.

BR-004

Có thể xóa bất kỳ lúc nào.

---

# 9. Business Logic

Search Route

↓

Click Favorite

↓

Save Database

↓

Sync Account

↓

Show Home

---

# 10. One Tap Search

Click Favorite

↓

Fill Search Form

↓

Search API

↓

Search Result

---

# 11. API

GET /favorites

POST /favorites

DELETE /favorites/{id}

PUT /favorites/{id}

---

# 12. Database

favorite_routes

users

routes

search_history

---

# 13. Loading State

Loading Favorite

↓

Loading Search

---

# 14. Empty State

Không có Favorite.

↓

Hiển thị:

"Bạn chưa lưu tuyến nào."

↓

Explore Route

---

# 15. Error State

Network Error

↓

Retry

Server Error

↓

Retry

---

# 16. Success State

Favorite Saved.

Favorite Deleted.

One Tap Search.

---

# 17. Navigation

Favorite

↓

Search Result

Manage

↓

Favorite List

---

# 18. Analytics

favorite_add

favorite_remove

favorite_search

favorite_view

---

# 19. Flutter Widget Tree

Column

↓

Section Header

↓

Horizontal ListView

↓

Favorite Route Card

↓

Search Button

---

# 20. State Management

FavoriteBloc

FavoriteEvent

FavoriteState

FavoriteRepository

---

# 21. Test Cases

✓ Thêm Favorite.

✓ Xóa Favorite.

✓ Không lưu trùng.

✓ One Tap Search.

✓ Đồng bộ nhiều thiết bị.

---

# 22. Acceptance Criteria

✓ Lưu thành công.

✓ Xóa thành công.

✓ Đồng bộ tài khoản.

✓ One Tap Search hoạt động.

---

# 23. Related Documents

Search Bus

Search Result

Recent Search

Profile

Database

---

# 24. Future Expansion

AI Favorite

Automatic Favorite

Favorite Notification

Favorite Widget

Pinned Favorite

---

# 25. Summary

Favorite Route giúp người dùng truy cập nhanh các tuyến xe thường xuyên sử dụng, giảm số thao tác tìm kiếm và tăng trải nghiệm cá nhân hóa.