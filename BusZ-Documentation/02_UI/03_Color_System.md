# Color System

Project: BusZ - Intercity Bus Ticket Booking Platform

Version: 1.0

Document Type: UI/UX Design System

Priority: Critical

Status: Draft

---

# 1. Purpose

Color System quy định toàn bộ hệ thống màu của BusZ.

Mục tiêu:

- Đồng nhất giao diện.
- Dễ mở rộng.
- Dễ thay đổi Theme.
- Dễ bảo trì.
- Flutter, Figma và Website dùng chung.

---

# 2. Design Philosophy

BusZ sử dụng màu theo nguyên tắc:

Primary

↓

Thương hiệu

Secondary

↓

Hỗ trợ

Semantic

↓

Thông báo trạng thái

Neutral

↓

Text

Border

Background

Surface

---

# 3. Color Palette

Color được chia thành:

Primary

Secondary

Success

Warning

Error

Info

Neutral

Background

Surface

Border

Text

---

# 4. Primary Color

Primary-50

Primary-100

Primary-200

Primary-300

Primary-400

Primary-500

Primary-600

Primary-700

Primary-800

Primary-900

Primary-500 là màu thương hiệu.

---

# 5. Secondary Color

Secondary-50

...

Secondary-900

Dùng cho:

Highlight

Promotion

Reward Point

---

# 6. Success Color

Dùng cho:

Payment Success

Booking Success

Available Seat

Completed

Check-in Success

---

# 7. Warning Color

Dùng cho:

Pending Payment

Hold Seat

Delayed Trip

Low Seat

Coupon Warning

---

# 8. Error Color

Dùng cho:

Cancelled

Payment Failed

Refund Failed

Validation Error

Delete

Danger Action

---

# 9. Info Color

Dùng cho:

Information

Tips

Announcement

Notice

---

# 10. Neutral Color

Neutral-0

Neutral-50

Neutral-100

Neutral-200

Neutral-300

Neutral-400

Neutral-500

Neutral-600

Neutral-700

Neutral-800

Neutral-900

---

# 11. Background Color

Background Primary

Background Secondary

Background Disabled

Background Loading

Background Modal

---

# 12. Surface Color

Surface Primary

Surface Card

Surface Dialog

Surface BottomSheet

Surface AppBar

Surface Navigation

---

# 13. Border Color

Border Light

Border Normal

Border Strong

Border Focus

Border Error

---

# 14. Text Color

Primary Text

Secondary Text

Hint Text

Disabled Text

White Text

Error Text

Success Text

---

# 15. Status Color Mapping

Booking

Pending

Confirmed

Cancelled

Completed

Expired

Refunded

---

Payment

Pending

Success

Failed

Refunded

---

Trip

Open

Full

Cancelled

Delayed

Completed

---

Seat

Available

Hold

Booked

Selected

Checked In

Maintenance

Blocked

---

Ticket

Active

Used

Expired

Cancelled

---

# 16. Component Color

Primary Button

Secondary Button

Outlined Button

Text Button

Card

Chip

Badge

Snackbar

Toast

Dialog

Bottom Sheet

Navigation

Input

Checkbox

Radio

Switch

Slider

Progress

---

# 17. Dark Theme

Future

Dark Background

Dark Surface

Dark Text

Dark Border

Dark Card

Dark Dialog

---

# 18. Accessibility

Contrast Ratio

>= 4.5

Không dùng màu làm thông tin duy nhất.

Luôn có:

Icon

Text

Badge

---

# 19. Naming Convention

colorPrimary500

colorPrimary600

colorSuccess

colorError

colorWarning

colorTextPrimary

colorTextSecondary

colorSurface

colorBackground

colorBorder

---

# 20. Flutter Mapping

AppColors.primary

AppColors.success

AppColors.warning

AppColors.error

AppColors.background

AppColors.surface

AppColors.textPrimary

AppColors.border

---

# 21. Figma Mapping

Design Tokens

↓

Color Variables

↓

Component Variables

↓

Theme

---

# 22. Related Documents

Design System

Typography

Component Library

Icons

Animation

---

# 23. Future Expansion

Dynamic Theme

Material You

Dark Theme

High Contrast

Company Branding

Season Theme

---

# 24. Summary

Color System định nghĩa toàn bộ màu sắc sử dụng trong BusZ.

Mọi giao diện Flutter, Website Admin và Figma phải sử dụng đúng Color Token để đảm bảo tính nhất quán và khả năng mở rộng.