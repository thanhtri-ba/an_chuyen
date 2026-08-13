# Animation

Project: BusZ - Intercity Bus Ticket Booking Platform

Version: 1.0

Document Type: UI/UX Motion Design

Priority: High

Status: Draft

---

# 1. Purpose

Tài liệu này định nghĩa toàn bộ hệ thống Animation của BusZ.

Animation giúp:

- Tăng trải nghiệm người dùng.
- Tạo cảm giác mượt mà.
- Hướng sự chú ý.
- Giảm cảm giác chờ đợi.
- Tăng tính chuyên nghiệp.

---

# 2. Design Principles

Animation phải:

- Nhanh
- Mượt
- Có mục đích
- Không gây khó chịu
- Không làm giảm hiệu năng

---

# 3. Motion Duration

Very Fast

100ms

Fast

200ms

Default

300ms

Slow

500ms

Extra Slow

800ms

---

# 4. Animation Curves

Linear

Ease

Ease In

Ease Out

Ease In Out

Fast Out Slow In

---

# 5. Screen Transition

Push

Pop

Replace

Modal

Bottom Sheet

Dialog

Hero

---

# 6. Splash Animation

Logo Fade

↓

Logo Scale

↓

Navigate Home

---

Duration

1500ms

---

# 7. Page Transition

Home

↓

Search

↓

Trip Detail

↓

Seat

↓

Booking

↓

Payment

↓

Ticket

---

Animation

Slide + Fade

---

# 8. Button Animation

Pressed

↓

Scale 95%

↓

Release

↓

Scale 100%

---

Loading

↓

Spinner

↓

Disable Button

---

# 9. Card Animation

Card xuất hiện

↓

Fade

↓

Slide Up

---

Card Click

↓

Ripple

↓

Open Detail

---

# 10. Seat Animation

Available

↓

Normal

Selected

↓

Scale Up

↓

Highlight

Booked

↓

Gray

↓

Disabled

Hold

↓

Blink nhẹ

---

# 11. Loading Animation

Skeleton

Spinner

Linear Progress

Circular Progress

Shimmer

---

# 12. Success Animation

Payment Success

↓

Check Icon

↓

Scale

↓

Fade

↓

Navigate Ticket

---

# 13. Error Animation

Shake

Fade

Error Dialog

Snackbar

---

# 14. Bottom Sheet Animation

Slide Up

↓

Fade Background

↓

Scale Content

---

# 15. Dialog Animation

Scale

↓

Fade

↓

Appear

---

# 16. List Animation

Fade In

Slide Up

Lazy Loading

Infinite Scroll

---

# 17. Refresh Animation

Pull Down

↓

Refresh Spinner

↓

Reload

↓

Success

---

# 18. Notification Animation

Slide Down

Fade In

Auto Hide

---

# 19. QR Animation

QR Scan

↓

Success Border

↓

Green Animation

↓

Check Mark

---

# 20. Booking Animation

Booking Summary

↓

Loading

↓

Success

↓

Navigate Payment

---

# 21. Payment Animation

Loading

↓

Gateway

↓

Success

↓

Ticket

---

# 22. Ticket Animation

QR Zoom

↓

Hero Animation

↓

Ticket Detail

---

# 23. Micro Interaction

Button

Card

Switch

Checkbox

Seat

Chip

Tab

Bottom Navigation

---

# 24. Performance Rules

Animation

60 FPS

Không chạy quá nhiều Animation cùng lúc.

Không Animation khi dữ liệu lớn.

---

# 25. Accessibility

Reduce Motion

↓

Tắt Animation

Hỗ trợ người dùng nhạy cảm với chuyển động.

---

# 26. Flutter Mapping

AnimatedContainer

AnimatedOpacity

AnimatedSwitcher

AnimatedPositioned

Hero

FadeTransition

SlideTransition

ScaleTransition

TweenAnimationBuilder

AnimationController

---

# 27. Naming Convention

fadeFast

slideBottom

heroTicket

buttonPressed

loadingShimmer

seatSelected

paymentSuccess

---

# 28. Future Expansion

Lottie Animation

Rive Animation

Interactive Animation

Physics Animation

3D Animation

---

# 29. Related Documents

Design System

Component Library

Icons

Responsive

Flutter Architecture

---

# 30. Summary

Animation giúp BusZ mang lại trải nghiệm hiện đại, mượt mà và nhất quán.

Mọi hiệu ứng phải có mục đích rõ ràng, tối ưu hiệu năng và không làm ảnh hưởng đến khả năng sử dụng của ứng dụng.