# Responsive Design

Project: BusZ - Intercity Bus Ticket Booking Platform

Version: 1.0

Document Type: UI/UX Specification

Priority: High

Status: Draft

---

# 1. Purpose

Tài liệu này quy định cách giao diện BusZ hiển thị trên nhiều loại thiết bị.

Mục tiêu:

- Không bị vỡ giao diện.
- Đồng nhất trên Android và iOS.
- Dễ mở rộng sang Tablet.
- Chuẩn bị cho Desktop và Web.

---

# 2. Supported Devices

Version 1

Android

iPhone

Future

Tablet

Foldable

Desktop

Web

---

# 3. Supported Screen Width

Small Phone

320dp

Medium Phone

360dp

Large Phone

390dp

XL Phone

430dp

Tablet

600dp+

Desktop

1024dp+

---

# 4. Orientation

Portrait

✓ Supported

Landscape

Limited Support

Tablet

Full Support (Future)

---

# 5. Layout Rules

Header

↓

Scrollable Content

↓

Bottom Action

↓

Bottom Navigation

Không sử dụng Fixed Height.

---

# 6. Grid System

Padding

16dp

Margin

16dp

Spacing

8dp

12dp

16dp

24dp

32dp

---

# 7. Card Rules

Chiều rộng

100%

Chiều cao

Theo nội dung

Không cố định Height.

---

# 8. Image Rules

Cover

Contain

Rounded Corner

Lazy Loading

Placeholder

Error Image

---

# 9. Typography Scaling

Font tự co giãn.

Không nhỏ hơn:

12sp

Tiêu đề luôn nổi bật.

---

# 10. Button Rules

Chiều cao tối thiểu

48dp

Chiều rộng

Theo nội dung

Primary Button

Full Width

Secondary Button

Wrap Content

---

# 11. Input Rules

TextField

100% Width

OTP

Equal Width

Search

Full Width

---

# 12. Seat Layout

Seat tự co giãn theo màn hình.

Khoảng cách ghế luôn đồng đều.

Không để ghế bị che.

Có thể Zoom (Future).

---

# 13. Bottom Navigation

Luôn hiển thị trên Mobile.

Ẩn khi:

Full Screen QR

Payment Gateway

Map Fullscreen

---

# 14. Dialog Rules

Max Width

90%

Center

Không vượt quá chiều cao màn hình.

---

# 15. Bottom Sheet

Chiều cao

Theo nội dung

Maximum

90%

Có thể kéo lên/xuống.

---

# 16. Safe Area

Hỗ trợ:

Notch

Dynamic Island

Gesture Navigation

Navigation Bar

---

# 17. Keyboard Handling

Keyboard mở

↓

Input không bị che.

↓

Auto Scroll.

↓

Bottom Button di chuyển.

---

# 18. Responsive Components

Trip Card

↓

Co giãn.

Ticket Card

↓

Co giãn.

Profile Card

↓

Co giãn.

Payment Card

↓

Co giãn.

---

# 19. Flutter Rules

MediaQuery

LayoutBuilder

Expanded

Flexible

AspectRatio

SafeArea

SingleChildScrollView

SliverList

SliverGrid

---

# 20. Performance

Không rebuild toàn màn hình.

Lazy Loading.

Image Cache.

Virtual List.

---

# 21. Accessibility

Large Text

High Contrast

Touch Area ≥ 48dp

Landscape Support

---

# 22. Testing Devices

Android

5.5"

6.1"

6.7"

iPhone

SE

13

14

15

Future

iPad

Android Tablet

---

# 23. Future Expansion

Tablet Layout

Desktop Layout

Foldable Screen

Multi Window

Responsive Dashboard

---

# 24. Related Documents

UI Overview

Design System

Component Library

Flutter Architecture

Accessibility

---

# 25. Summary

BusZ phải đảm bảo giao diện hiển thị tốt trên nhiều loại thiết bị, không bị tràn nội dung, không bị che khuất bởi bàn phím và luôn mang lại trải nghiệm nhất quán cho người dùng.