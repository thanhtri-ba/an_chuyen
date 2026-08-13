# Flutter Mobile App Architecture

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Flutter Mobile App

Document ID

APP-001

Priority

Critical

Version

1.0

---

# 1. Purpose

Tài liệu này mô tả toàn bộ kiến trúc ứng dụng Flutter của BusZ.

Mục tiêu:

- Dễ mở rộng
- Dễ bảo trì
- Dễ kiểm thử
- Tách biệt Business Logic
- Hỗ trợ Offline
- Hỗ trợ nhiều môi trường

---

# 2. Architecture Pattern

BusZ sử dụng

```
Clean Architecture
```

kết hợp

```
Feature First
```

và

```
MVVM
```

---

# 3. Layers

```
Presentation

↓

Application

↓

Domain

↓

Data

↓

Remote API

↓

Local Database
```

---

# 4. Folder Structure

```
lib/

core/

config/

features/

shared/

services/

routes/

assets/

generated/

main.dart
```

---

# 5. Feature Structure

Ví dụ

```
features/

authentication/

booking/

payment/

ticket/

profile/

notification/

search/

settings/

home/
```

---

# 6. Module Structure

Ví dụ

```
booking/

presentation/

domain/

data/

widgets/

models/

repositories/

services/

bloc/

pages/
```

---

# 7. Presentation Layer

Bao gồm

```
Pages

Widgets

Dialogs

Bottom Sheets

Components
```

Không chứa Business Logic.

---

# 8. Application Layer

Chứa

```
Use Cases

Controllers

ViewModels

Bloc/Cubit
```

Điều phối nghiệp vụ.

---

# 9. Domain Layer

Bao gồm

```
Entities

Repository Interfaces

Business Rules

Value Objects
```

Không phụ thuộc Flutter.

---

# 10. Data Layer

Bao gồm

```
API Client

DTO

Repository Implementation

Mapper

Datasource
```

---

# 11. Remote Data Source

Sử dụng

```
Dio
```

REST API

```
NestJS
```

Authentication

```
JWT
```

---

# 12. Local Data Source

Sử dụng

```
Hive

SharedPreferences

Secure Storage
```

---

# 13. Dependency Injection

Sử dụng

```
get_it
```

Khởi tạo

```
Repositories

Services

Bloc

API

Storage
```

---

# 14. State Management

Sử dụng

```
flutter_bloc
```

Hoặc

```
Cubit
```

Không dùng setState cho nghiệp vụ lớn.

---

# 15. Navigation

Sử dụng

```
go_router
```

Hỗ trợ

- Deep Link
- Authentication Guard
- Nested Navigation

---

# 16. Network Layer

```
Dio

↓

Interceptor

↓

Retry

↓

JWT Refresh

↓

API
```

---

# 17. Error Handling

Mọi Exception

↓

Failure

↓

UI

↓

SnackBar/Dialog

---

# 18. Assets

```
images/

icons/

fonts/

animations/

lottie/

translations/
```

---

# 19. Environment

```
Development

Staging

Production
```

File

```
.env.dev

.env.staging

.env.prod
```

---

# 20. Logging

Development

```
Pretty Dio Logger
```

Production

```
Sentry
```

---

# 21. Security

```
Flutter Secure Storage

Certificate Pinning

JWT

Biometric

Screen Protection
```

---

# 22. Offline Support

Cache

↓

Hive

↓

Sync

↓

Background Sync

---

# 23. Performance

Target

App Startup

```
<2s
```

API

```
<150ms
```

Frame Rate

```
60 FPS
```

Memory

```
<300MB
```

---

# 24. Testing

```
Unit Test

Widget Test

Integration Test
```

Coverage

```
>80%
```

---

# 25. CI/CD

GitHub

↓

Flutter Analyze

↓

Test

↓

Build APK

↓

Build AAB

↓

Firebase Distribution

↓

Google Play

---

# 26. Related Documents

APP-002 Design System

APP-003 Navigation

APP-013 State Management

---

# 27. Summary

BusZ Mobile được xây dựng theo Clean Architecture kết hợp Feature First và MVVM, sử dụng Flutter Bloc, Dio, GoRouter và GetIt. Kiến trúc này giúp ứng dụng dễ mở rộng, dễ kiểm thử và đáp ứng tốt các yêu cầu của một ứng dụng đặt vé xe khách quy mô lớn.