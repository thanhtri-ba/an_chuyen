# Offline Mode

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Flutter Mobile App

Document ID

APP-014

Priority

High

Version

1.0

---

# 1. Purpose

Offline Mode giúp người dùng tiếp tục sử dụng BusZ khi không có kết nối Internet hoặc mạng yếu.

Mục tiêu:

- Cải thiện trải nghiệm người dùng.
- Giảm phụ thuộc vào mạng.
- Đồng bộ dữ liệu khi kết nối được khôi phục.
- Hạn chế mất dữ liệu.

---

# 2. Offline Strategy

BusZ áp dụng

```text
Offline First
```

Nguyên tắc

```text
UI

↓

Local Cache

↓

Remote API
```

Nếu không có mạng

↓

Đọc dữ liệu từ Local Cache.

---

# 3. Local Storage

Sử dụng

```text
Hive
```

Lưu

- Vé
- Hồ sơ
- Search History
- Favorite Routes
- Settings
- Promotions
- Nearby Stations

---

# 4. Connectivity Detection

Sử dụng

```text
connectivity_plus
```

Trạng thái

```text
Online

Offline

Slow Network
```

---

# 5. Offline Banner

Hiển thị

```text
You're Offline
```

Màu

```text
Orange
```

Khi có mạng

↓

Ẩn Banner.

---

# 6. Offline Features

Cho phép

```text
View Tickets

View Profile

View Booking History

Search History

Favorite Routes

Settings
```

---

# 7. Online Only Features

Không cho phép

```text
New Booking

Payment

Refund Request

Update Profile

Promotion Validation
```

Hiển thị

```text
Internet Connection Required
```

---

# 8. Cache Policy

Cache Duration

```text
Search Result

30 phút
```

Promotion

```text
6 giờ
```

Profile

```text
24 giờ
```

Settings

```text
Until Changed
```

Ticket

```text
Until Trip Ends
```

---

# 9. Sync Strategy

Khi có mạng

↓

```text
Sync Queue

↓

Upload Pending Changes

↓

Download Latest Data

↓

Resolve Conflict
```

---

# 10. Pending Queue

Lưu

```text
Favorite Route

Notification Read

Settings Change
```

Không lưu

```text
Payment

Booking

Refund
```

---

# 11. Conflict Resolution

Ưu tiên

```text
Server Wins
```

Ngoại lệ

```text
Local Draft

↓

User Confirm
```

---

# 12. Retry Policy

Tự động

```text
Reconnect

↓

Retry Pending Queue

↓

Notify Success
```

---

# 13. Offline Ticket

Lưu

```text
QR Code

Passenger

Trip

Seat

Booking Code
```

Cho phép quét QR ngay cả khi Offline.

---

# 14. Offline Search History

Lưu

```text
Recent Search

Favorite Routes

Recent Stations
```

---

# 15. Loading State

Nếu Offline

↓

Không hiển thị Spinner vô hạn.

Hiển thị

```text
Cached Data
```

---

# 16. Error State

Ví dụ

```text
No Internet Connection.
```

Buttons

```text
Retry

Open Settings
```

---

# 17. State Management

Cubit

```text
ConnectivityCubit
```

States

```text
Online

Offline

SlowNetwork
```

---

# 18. API Integration

Khi Online

↓

Sync

```text
Profile

Notifications

Tickets

Settings
```

---

# 19. Component Tree

```text
ConnectivityListener

↓

OfflineBanner

↓

SyncManager

↓

OfflineStorage

↓

RetryQueue
```

---

# 20. UX Guidelines

✓ Luôn hiển thị trạng thái mạng.

✓ Không làm mất dữ liệu người dùng.

✓ Tự động đồng bộ khi có mạng.

✓ Phân biệt rõ tính năng Online và Offline.

✓ Hiển thị thời điểm dữ liệu được cập nhật gần nhất.

---

# 21. Performance

Cache Read

```text
<20ms
```

Reconnect Detection

```text
<1s
```

Queue Sync

```text
<3s
```

---

# 22. Test Cases

✓ Offline Ticket.

✓ Offline Profile.

✓ Offline Settings.

✓ Reconnect.

✓ Queue Sync.

✓ Cache Expired.

✓ Slow Network.

✓ Conflict Resolution.

---

# 23. Acceptance Criteria

✓ Offline Ticket hoạt động.

✓ Cache chính xác.

✓ Queue Sync thành công.

✓ Banner trạng thái mạng.

✓ Không mất dữ liệu.

✓ Retry tự động.

---

# 24. Related Documents

APP-013 State Management

APP-015 Push Notification

API-019 Background Jobs

---

# 25. Summary

Offline Mode của BusZ áp dụng chiến lược **Offline First**, sử dụng Hive để lưu trữ cục bộ và Connectivity Plus để theo dõi trạng thái mạng. Người dùng vẫn có thể xem vé, hồ sơ và dữ liệu đã lưu khi mất kết nối, trong khi các thay đổi hợp lệ sẽ được đồng bộ tự động khi mạng được khôi phục.