# State Management

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Flutter Mobile App

Document ID

APP-013

Priority

Critical

Version

1.0

---

# 1. Purpose

State Management định nghĩa kiến trúc quản lý trạng thái của toàn bộ ứng dụng BusZ.

Mục tiêu:

- Dễ mở rộng
- Dễ bảo trì
- Dễ kiểm thử
- Tách biệt UI và Business Logic
- Hạn chế rebuild không cần thiết

---

# 2. Technology

BusZ sử dụng

```text
flutter_bloc
```

Bao gồm

```text
Cubit

Bloc
```

Dependency Injection

```text
GetIt
```

---

# 3. Architecture

```text
UI

↓

Cubit

↓

UseCase

↓

Repository

↓

Datasource

↓

API / Local DB
```

---

# 4. Folder Structure

```text
features/

booking/

presentation/

cubit/

booking_cubit.dart

booking_state.dart
```

---

# 5. Global Cubits

```text
AuthenticationCubit

ThemeCubit

LocaleCubit

ConnectivityCubit

NotificationCubit
```

---

# 6. Feature Cubits

```text
HomeCubit

SearchCubit

BookingCubit

PaymentCubit

TicketCubit

ProfileCubit

SettingsCubit
```

---

# 7. State Lifecycle

```text
Initial

↓

Loading

↓

Success

↓

Updated

↓

Error
```

Ví dụ

```text
BookingInitial

↓

BookingLoading

↓

BookingLoaded

↓

BookingSuccess
```

---

# 8. UI States

Chuẩn cho mọi màn hình

```text
Initial

Loading

Empty

Loaded

Refreshing

Error
```

---

# 9. Event Flow

```text
User Tap

↓

Cubit Method

↓

UseCase

↓

Repository

↓

API

↓

Result

↓

New State

↓

UI Update
```

---

# 10. Repository Pattern

Interface

```text
BookingRepository
```

Implementation

```text
BookingRepositoryImpl
```

Cubit không gọi API trực tiếp.

---

# 11. Dependency Injection

Đăng ký

```text
Repositories

Services

API

Storage

Cubit
```

Sử dụng

```text
GetIt.I<T>()
```

---

# 12. Error Handling

Exception

↓

Failure

↓

Cubit

↓

Error State

↓

UI

---

# 13. State Naming

Ví dụ

```text
SearchInitial

SearchLoading

SearchLoaded

SearchEmpty

SearchError
```

Không dùng

```text
SuccessState

DataState
```

---

# 14. Immutable State

State phải

```text
immutable
```

Sử dụng

```text
copyWith()
```

để cập nhật dữ liệu.

---

# 15. Data Refresh

Pull To Refresh

↓

Refreshing State

↓

Reload API

↓

Loaded

---

# 16. Cache Strategy

UI

↓

Cubit

↓

Repository

↓

Hive

↓

API

Nếu Offline

↓

Hive

---

# 17. Authentication State

```text
Unauthenticated

Authenticating

Authenticated

RefreshingToken

Expired
```

---

# 18. Connectivity State

```text
Online

Offline

Slow Network
```

Hiển thị Banner khi Offline.

---

# 19. State Persistence

Lưu

```text
Theme

Language

Login Session

Recent Search

Settings
```

Sử dụng

```text
HydratedBloc

hoặc

Hive
```

---

# 20. Performance

✓ Chỉ rebuild Widget cần thiết.

✓ Dùng BlocSelector khi có thể.

✓ Tránh emit State giống nhau.

✓ Tách Cubit theo Feature.

---

# 21. Testing

Unit Test

```text
Cubit Test
```

Kiểm tra

- Initial State
- Loading
- Success
- Error
- Empty

---

# 22. Best Practices

✓ Một Cubit cho một Feature.

✓ Không gọi API trong Widget.

✓ Không lưu Business Logic trong UI.

✓ Không dùng Global State cho dữ liệu cục bộ.

✓ State luôn immutable.

---

# 23. Acceptance Criteria

✓ Cubit hoạt động đúng.

✓ UI phản ứng theo State.

✓ Repository Pattern đầy đủ.

✓ Dependency Injection hoạt động.

✓ Test Coverage >80%.

---

# 24. Related Documents

APP-001 App Architecture

APP-014 Offline Mode

API-002 API Standards

---

# 25. Summary

State Management của BusZ sử dụng `flutter_bloc` kết hợp `Cubit`, `Repository Pattern` và `GetIt` để xây dựng kiến trúc quản lý trạng thái rõ ràng, dễ mở rộng và dễ kiểm thử. Mỗi tính năng có Cubit riêng, UI chỉ phản ánh State và không chứa Business Logic.