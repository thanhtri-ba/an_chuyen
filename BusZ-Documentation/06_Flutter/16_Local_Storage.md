# Local Storage

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Flutter Mobile App

Document ID

APP-016

Priority

High

Version

1.0

---

# 1. Purpose

Local Storage quản lý toàn bộ dữ liệu được lưu trên thiết bị nhằm:

- Hỗ trợ Offline Mode
- Giảm số lần gọi API
- Tăng tốc độ phản hồi
- Bảo vệ dữ liệu nhạy cảm
- Đồng bộ với Backend

---

# 2. Storage Architecture

```text
Flutter App

↓

Repository

↓

Local Storage

↓

Hive

Secure Storage

SharedPreferences
```

---

# 3. Storage Technologies

Hive

```text
Offline Database
```

Flutter Secure Storage

```text
JWT

Refresh Token

PIN
```

SharedPreferences

```text
Theme

Language

First Launch
```

---

# 4. Data Classification

### Sensitive

```text
Access Token

Refresh Token

Biometric Setting

PIN
```

↓

Flutter Secure Storage

---

### Cache

```text
Tickets

Profile

Search Result

Promotions

Notifications
```

↓

Hive

---

### Preferences

```text
Theme

Language

Currency

Onboarding
```

↓

SharedPreferences

---

# 5. Hive Boxes

```text
tickets_box

profile_box

settings_box

search_history_box

favorite_routes_box

notification_box

promotion_box

station_box
```

---

# 6. Secure Storage Keys

```text
access_token

refresh_token

device_id

pin_code

biometric_enabled
```

---

# 7. Cache Policy

| Data | TTL |
|------|------|
| Search Result | 30 Minutes |
| Ticket | Until Trip Ends |
| Profile | 24 Hours |
| Notification | 24 Hours |
| Promotion | 6 Hours |
| Station | 7 Days |

---

# 8. Cache Flow

```text
Open Screen

↓

Check Local Cache

↓

Valid

↓

Display

↓

Refresh In Background

↓

Update UI
```

---

# 9. Cache Invalidation

Xóa Cache khi

```text
Logout

↓

App Version Changed

↓

Cache Expired

↓

Manual Clear
```

---

# 10. Data Encryption

Hive

↓

AES Encryption

Secure Storage

↓

Platform Encryption

Android

↓

Keystore

iOS

↓

Keychain

---

# 11. Migration

Nếu App Update

↓

Check Database Version

↓

Migration

↓

Update Schema

↓

Delete Deprecated Data

---

# 12. Offline Queue

Lưu

```text
Favorite Route

Notification Read

Settings

Feedback
```

Đồng bộ khi Online.

---

# 13. Backup Strategy

Backup

```text
Settings

Favorites

History
```

Không Backup

```text
Access Token

Refresh Token

PIN

Payment
```

---

# 14. Clear Storage

Cho phép

```text
Clear Cache

↓

Delete Download

↓

Reset Settings
```

Không xóa

```text
Secure Storage
```

trừ khi Logout.

---

# 15. Logout Flow

```text
Logout

↓

Delete Token

↓

Delete Cache

↓

Keep Preferences

↓

Navigate Login
```

---

# 16. Error Handling

Nếu Cache Corrupted

↓

Delete Box

↓

Reload API

↓

Recreate Database

---

# 17. State Management

Cubit

```text
StorageCubit
```

States

```text
StorageReady

StorageLoading

StorageMigrating

StorageCleared

StorageError
```

---

# 18. Performance

Hive Read

```text
<10ms
```

Hive Write

```text
<20ms
```

Secure Storage Read

```text
<50ms
```

---

# 19. Best Practices

✓ Không lưu Password.

✓ Không lưu Payment Information.

✓ Mã hóa dữ liệu nhạy cảm.

✓ Dọn Cache định kỳ.

✓ Đồng bộ khi Online.

---

# 20. Test Cases

✓ Cache Read.

✓ Cache Expired.

✓ Storage Migration.

✓ Logout.

✓ Clear Cache.

✓ Secure Storage.

✓ Offline Queue.

✓ Corrupted Cache.

---

# 21. Acceptance Criteria

✓ Cache hoạt động.

✓ Encryption đầy đủ.

✓ Migration thành công.

✓ Logout xóa Token.

✓ Offline Storage ổn định.

✓ TTL chính xác.

---

# 22. Related Documents

APP-014 Offline Mode

APP-015 Push Notification

APP-017 Deep Linking

---

# 23. Summary

Local Storage của BusZ sử dụng Hive, Flutter Secure Storage và SharedPreferences để lưu trữ dữ liệu cục bộ theo từng mức độ nhạy cảm. Kiến trúc này đảm bảo hiệu năng cao, hỗ trợ Offline First, bảo mật thông tin người dùng và đồng bộ dữ liệu hiệu quả với Backend.