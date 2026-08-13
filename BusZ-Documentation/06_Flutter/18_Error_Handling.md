# Deep Linking

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Flutter Mobile App

Document ID

APP-017

Priority

High

Version

1.0

---

# 1. Purpose

Deep Linking cho phép BusZ mở trực tiếp một màn hình cụ thể từ:

- Website
- Email
- QR Code
- Push Notification
- SMS
- Social Media
- Universal Link

Giúp người dùng truy cập nhanh đúng nội dung mà không cần điều hướng thủ công.

---

# 2. Supported Link Types

```text
Custom URL Scheme

Universal Link (iOS)

Android App Link

Firebase Dynamic Link (Optional)
```

---

# 3. Custom URL Scheme

Scheme

```text
busz://
```

Ví dụ

```text
busz://ticket/TK123456

busz://booking/BK123456

busz://promotion/PM001

busz://trip/TRIP001

busz://profile
```

---

# 4. Universal Links

Domain

```text
https://app.busz.vn
```

Ví dụ

```text
https://app.busz.vn/ticket/TK123456

https://app.busz.vn/booking/BK123456
```

---

# 5. Android App Links

Host

```text
app.busz.vn
```

File

```text
assetlinks.json
```

---

# 6. iOS Universal Links

File

```text
apple-app-site-association
```

Không yêu cầu mở Safari trước.

---

# 7. Deep Link Flow

```text
User Click Link

↓

OS

↓

Flutter

↓

GoRouter

↓

Authentication Guard

↓

Target Screen
```

---

# 8. Authentication Guard

Nếu chưa đăng nhập

↓

```text
Login
```

↓

Đăng nhập thành công

↓

Quay lại Deep Link ban đầu.

---

# 9. Supported Routes

```text
Home

Search

Trip Detail

Booking Detail

Payment Detail

Ticket Detail

Promotion Detail

Notification Detail

Profile
```

---

# 10. QR Code Deep Link

Ví dụ

QR chứa

```text
busz://ticket/TK123456
```

Quét

↓

Mở Ticket Detail.

---

# 11. Push Notification

Payload

```json
{
  "deepLink":"busz://booking/BK123456"
}
```

Tap

↓

Booking Detail.

---

# 12. Email Deep Link

Ví dụ

```text
View Ticket

↓

https://app.busz.vn/ticket/TK123456
```

---

# 13. Deferred Deep Link

Nếu App chưa cài

↓

Store Link

↓

Install App

↓

First Launch

↓

Open đúng màn hình.

---

# 14. Invalid Link

Nếu Link không hợp lệ

↓

404 Screen

Hiển thị

```text
Content Not Found
```

Buttons

```text
Go Home

Retry
```

---

# 15. Security

Kiểm tra

- JWT
- Signature
- Route Permission
- Resource Ownership

Không cho phép truy cập Booking hoặc Ticket của người khác.

---

# 16. Analytics

Theo dõi

```text
Link Opened

Link Failed

Source

Campaign

Conversion
```

---

# 17. Component Flow

```text
OS

↓

DeepLinkService

↓

GoRouter

↓

AuthenticationGuard

↓

TargetPage
```

---

# 18. State Management

Cubit

```text
DeepLinkCubit
```

States

```text
DeepLinkInitial

DeepLinkProcessing

DeepLinkSuccess

DeepLinkError
```

---

# 19. API Integration

```text
GET /tickets/{id}

GET /bookings/{id}

GET /promotions/{id}

GET /trips/{id}
```

---

# 20. UX Guidelines

✓ Mở đúng màn hình.

✓ Không hiển thị Loading quá lâu.

✓ Giữ luồng người dùng sau khi Login.

✓ Hiển thị thông báo nếu nội dung không tồn tại.

✓ Hỗ trợ mở từ QR Code và Push Notification.

---

# 21. Performance

Link Parsing

```text
<20ms
```

Navigation

```text
<100ms
```

Authentication Check

```text
<100ms
```

---

# 22. Test Cases

✓ Open Ticket Link.

✓ Open Booking Link.

✓ Open Promotion.

✓ Open QR Code.

✓ Login Redirect.

✓ Invalid Link.

✓ Deferred Deep Link.

✓ Permission Denied.

---

# 23. Acceptance Criteria

✓ Deep Link hoạt động.

✓ Universal Link hoạt động.

✓ Authentication Guard chính xác.

✓ QR Code mở đúng.

✓ Push Notification điều hướng đúng.

✓ Analytics ghi nhận đầy đủ.

---

# 24. Related Documents

APP-003 Navigation

APP-011 Notification Module

APP-015 Push Notification

---

# 25. Summary

Deep Linking của BusZ hỗ trợ Custom URL Scheme, Universal Links và Android App Links để điều hướng trực tiếp đến các màn hình như vé, đặt vé và khuyến mãi. Hệ thống tích hợp Authentication Guard, Deferred Deep Linking và Analytics nhằm mang lại trải nghiệm liền mạch, an toàn và có thể đo lường.