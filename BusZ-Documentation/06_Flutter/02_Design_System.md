# Design System

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Flutter Mobile App

Document ID

APP-002

Priority

Critical

Version

1.0

---

# 1. Purpose

Design System định nghĩa toàn bộ quy chuẩn giao diện của BusZ nhằm đảm bảo:

- Giao diện nhất quán
- Trải nghiệm người dùng đồng bộ
- Dễ bảo trì
- Dễ mở rộng
- Hỗ trợ Light Mode và Dark Mode

---

# 2. Design Principles

✓ Simple

✓ Modern

✓ Accessible

✓ Consistent

✓ Mobile First

✓ Material Design 3

---

# 3. Brand Colors

Primary

```text
#E53935
```

Secondary

```text
#1565C0
```

Success

```text
#43A047
```

Warning

```text
#FB8C00
```

Error

```text
#D32F2F
```

Info

```text
#0288D1
```

---

# 4. Neutral Colors

```text
Black

#212121

Gray900

#424242

Gray700

#616161

Gray500

#9E9E9E

Gray300

#E0E0E0

Gray100

#F5F5F5

White

#FFFFFF
```

---

# 5. Typography

Font

```text
Inter
```

Fallback

```text
Roboto
```

---

# 6. Text Styles

Display Large

```text
32

Bold
```

Headline

```text
24

Bold
```

Title

```text
20

SemiBold
```

Body

```text
16

Regular
```

Caption

```text
12

Regular
```

Button

```text
16

Medium
```

---

# 7. Spacing

```text
4

8

12

16

20

24

32

40

48

64
```

Đơn vị

```
dp
```

---

# 8. Border Radius

Small

```
8
```

Medium

```
12
```

Large

```
16
```

Extra Large

```
24
```

Pill

```
999
```

---

# 9. Elevation

Card

```
2
```

Dialog

```
6
```

Bottom Sheet

```
8
```

FAB

```
6
```

---

# 10. Buttons

Primary Button

- Filled
- Radius 12
- Height 52

Secondary Button

- Outlined

Text Button

- No Border

Danger Button

- Red

Icon Button

- 48x48

---

# 11. Input Fields

Height

```
56
```

States

```text
Default

Focused

Error

Disabled

Read Only
```

Support

- Prefix Icon
- Suffix Icon
- Helper Text
- Validation

---

# 12. Cards

Trip Card

Booking Card

Ticket Card

Promotion Card

Notification Card

Profile Card

Tất cả dùng:

Radius

```
16
```

Shadow

```
2
```

---

# 13. Icons

Sử dụng

```text
Material Symbols
```

Kích thước

```text
20

24

32

40
```

---

# 14. Images

Avatar

```
48

64

96
```

Banner

```
16:9
```

Bus Image

```
4:3
```

---

# 15. Animations

Sử dụng

```text
Lottie
```

Transition

```text
Fade

Slide

Scale
```

Duration

```
200–300ms
```

---

# 16. Dark Theme

Background

```text
#121212
```

Surface

```text
#1E1E1E
```

Primary

```text
#EF5350
```

Text

```text
#FFFFFF
```

---

# 17. Component Library

- AppBar
- Bottom Navigation
- Navigation Rail
- Search Bar
- Filter Chip
- Trip Card
- Seat Widget
- Ticket Widget
- Payment Tile
- Empty State
- Error State
- Loading Indicator
- Dialog
- Bottom Sheet
- Snackbar

---

# 18. Accessibility

Minimum Font

```
12sp
```

Touch Target

```
48x48
```

Contrast Ratio

```
>= 4.5 : 1
```

Screen Reader

✓ Supported

---

# 19. Responsive Design

Mobile

```
360–480dp
```

Tablet

```
600dp+
```

Foldable

✓ Supported

---

# 20. Naming Convention

Colors

```text
AppColors.primary
```

Text

```text
AppTextStyles.bodyLarge
```

Spacing

```text
AppSpacing.md
```

Radius

```text
AppRadius.large
```

Icons

```text
AppIcons.ticket
```

---

# 21. Acceptance Criteria

✓ Material Design 3

✓ Dark Mode

✓ Responsive

✓ Reusable Components

✓ Accessibility

✓ Design Token thống nhất

---

# 22. Related Documents

APP-001 App Architecture

APP-003 Navigation

APP-005 Home Module

---

# 23. Summary

Design System của BusZ cung cấp bộ quy chuẩn về màu sắc, typography, spacing, component và theme nhằm đảm bảo toàn bộ ứng dụng Flutter có giao diện thống nhất, hiện đại, dễ mở rộng và đáp ứng các tiêu chuẩn trải nghiệm người dùng trên thiết bị di động.