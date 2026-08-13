# Recent Search

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Home

Screen ID: HOME-009

Priority: Medium

Status: Draft

---

# 1. Purpose

Recent Search lưu lại các lần tìm kiếm gần nhất của người dùng.

Giúp người dùng:

- Tìm lại tuyến cũ.
- Đặt vé nhanh hơn.
- Không cần nhập lại thông tin.

---

# 2. Business Goal

Giảm thời gian tìm kiếm.

Tăng tỉ lệ đặt vé.

Tăng trải nghiệm người dùng.

---

# 3. Actors

Guest

Customer

---

# 4. Preconditions

Người dùng đã tìm kiếm ít nhất một lần.

---

# 5. UI Layout

Home

↓

Recent Search Section

↓

History Card

↓

Search Again

↓

Delete

↓

Clear All

---

# 6. Components

History Card

Departure

Destination

Departure Date

Passenger

Search Again Button

Delete Button

Clear All Button

---

# 7. Information

Điểm đi

Điểm đến

Ngày đi

Số hành khách

Ngày tìm kiếm

---

# 8. Business Rules

BR-001

Lưu tối đa 10 lần tìm.

BR-002

Lần mới nhất ở trên.

BR-003

Không lưu dữ liệu trùng liên tiếp.

BR-004

Guest lưu Local Storage.

BR-005

Customer đồng bộ Database.

---

# 9. Business Logic

Search Success

↓

Save History

↓

Open Home

↓

Show Recent Search

↓

Click Search Again

↓

Search API

---

# 10. API

GET /search/history

POST /search/history

DELETE /search/history/{id}

DELETE /search/history

---

# 11. Database

search_history

users

routes

locations

---

# 12. Loading State

Loading History

↓

Render Card

---

# 13. Empty State

Không có lịch sử.

↓

Ẩn Section.

---

# 14. Error State

Network Error

↓

Retry

Server Error

↓

Retry

---

# 15. Success State

History Loaded.

Search Again.

Delete Success.

---

# 16. Navigation

Recent Search

↓

Search Result

Manage

↓

History List

---

# 17. Analytics

history_view

history_search

history_delete

history_clear

---

# 18. Flutter Widget Tree

Column

↓

Section Title

↓

ListView

↓

History Card

↓

Search Button

↓

Delete Button

---

# 19. State Management

HistoryBloc

HistoryEvent

HistoryState

HistoryRepository

---

# 20. Test Cases

✓ Lưu lịch sử.

✓ Không lưu trùng.

✓ Search Again.

✓ Delete.

✓ Clear All.

✓ Guest.

✓ Customer.

---

# 21. Acceptance Criteria

✓ Hiển thị đúng.

✓ Search Again đúng.

✓ Đồng bộ đúng.

✓ Không crash.

---

# 22. Related Documents

Search Bus

Favorite Route

Search Result

Database

---

# 23. Future Expansion

AI Suggestion

Smart History

Pinned Search

Shared Search

Cross Device Sync

---

# 24. Summary

Recent Search giúp người dùng nhanh chóng tìm lại các tuyến đã tìm kiếm trước đó, giảm thao tác nhập liệu và tăng tốc quá trình đặt vé.