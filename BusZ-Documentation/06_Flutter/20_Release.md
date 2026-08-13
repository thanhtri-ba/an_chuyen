# Release

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Flutter Mobile App

Document ID

APP-020

Priority

Critical

Version

1.0

---

# 1. Purpose

Release Module quy định quy trình phát hành ứng dụng BusZ từ môi trường Development đến Production.

Mục tiêu:

- Phát hành an toàn
- Giảm rủi ro
- Có khả năng Rollback
- Theo dõi sau phát hành
- Đảm bảo chất lượng

---

# 2. Release Environments

```text
Development

↓

Staging

↓

Production
```

Mỗi môi trường sử dụng cấu hình riêng.

---

# 3. Build Flavors

```text
dev

staging

production
```

Ví dụ

```text
flutter run --flavor dev

flutter build apk --flavor staging

flutter build appbundle --flavor production
```

---

# 4. Build Targets

Android

```text
APK

AAB
```

iOS

```text
IPA
```

---

# 5. Versioning

Semantic Versioning

```text
Major.Minor.Patch
```

Ví dụ

```text
1.0.0

1.1.0

1.1.1
```

Android

```text
versionCode
```

luôn tăng.

iOS

```text
buildNumber
```

luôn tăng.

---

# 6. Code Signing

Android

```text
Keystore

Key Alias

Release Key
```

iOS

```text
Apple Distribution Certificate

Provisioning Profile
```

---

# 7. CI/CD Pipeline

```text
Git Push

↓

GitHub Actions

↓

Analyze

↓

Test

↓

Build

↓

Sign

↓

Upload Artifact

↓

Deploy
```

---

# 8. Internal Distribution

Android

```text
Firebase App Distribution
```

iOS

```text
TestFlight
```

Tester nhận thông báo cập nhật tự động.

---

# 9. Google Play Release

Các kênh

```text
Internal

Closed

Open

Production
```

---

# 10. Apple Release

Các kênh

```text
Internal Test

External Test

Production
```

Thông qua

```text
App Store Connect
```

---

# 11. Release Checklist

✓ Analyze Pass.

✓ Tests Pass.

✓ No Critical Bugs.

✓ API Production.

✓ Release Notes.

✓ Crashlytics Enabled.

✓ Analytics Enabled.

✓ App Icons.

✓ Splash Screen.

✓ Privacy Policy.

---

# 12. Rollout Strategy

```text
5%

↓

20%

↓

50%

↓

100%
```

Theo dõi Crash Rate trước khi mở rộng.

---

# 13. Rollback Strategy

Nếu lỗi nghiêm trọng

↓

Dừng Rollout

↓

Khôi phục phiên bản trước

↓

Thông báo người dùng

↓

Phát hành Hotfix

---

# 14. Monitoring

Theo dõi

```text
Crash Rate

ANR

Startup Time

API Error

Payment Success Rate

Booking Success Rate
```

---

# 15. Crash Reporting

Sử dụng

```text
Firebase Crashlytics

Sentry
```

Thu thập

- Stack Trace
- Device
- OS
- App Version

---

# 16. Analytics

Theo dõi

```text
DAU

MAU

Retention

Conversion

Booking

Payment

Ticket Usage
```

---

# 17. Hotfix Process

```text
Critical Bug

↓

Fix Branch

↓

Code Review

↓

Test

↓

Release

↓

Production
```

---

# 18. User Communication

Thông báo

```text
Release Notes

Maintenance

New Features

Known Issues
```

Thông qua

- In-App
- Push Notification
- Website

---

# 19. Release Validation

Sau phát hành kiểm tra

✓ Login

✓ Search

✓ Booking

✓ Payment

✓ Ticket

✓ Notification

✓ Deep Link

✓ Offline

---

# 20. Performance Targets

Startup

```text
<2s
```

Crash Free Users

```text
>99.5%
```

ANR

```text
<0.3%
```

Payment Success

```text
>99%
```

---

# 21. Release Artifacts

Android

```text
app-release.aab

mapping.txt
```

iOS

```text
Runner.ipa

dSYM
```

---

# 22. Documentation

Mỗi Release cần có

- Release Notes
- Changelog
- Migration Notes
- Known Issues
- Rollback Guide

---

# 23. Acceptance Criteria

✓ Build thành công.

✓ Code Signing hợp lệ.

✓ Store Upload thành công.

✓ Rollout an toàn.

✓ Monitoring hoạt động.

✓ Rollback sẵn sàng.

---

# 24. Related Documents

APP-019 Testing

APP-018 Error Handling

API-020 Backend Deployment

---

# 25. Summary

Release Module của BusZ quy định toàn bộ quy trình phát hành ứng dụng từ Development đến Production, bao gồm Build, Code Signing, CI/CD, Store Distribution, Monitoring và Rollback. Quy trình này giúp đảm bảo mỗi phiên bản phát hành đều ổn định, an toàn và có thể phục hồi nhanh khi xảy ra sự cố.