# Accessibility

Project: BusZ - Intercity Bus Ticket Booking Platform

Version: 1.0

Document Type: UI/UX Specification

Priority: High

Status: Draft

---

# 1. Purpose

Tài liệu này quy định các tiêu chuẩn Accessibility (Khả năng tiếp cận) của BusZ.

Mục tiêu:

- Mọi người đều có thể sử dụng ứng dụng.
- Hỗ trợ người lớn tuổi.
- Hỗ trợ người khiếm thị.
- Hỗ trợ người bị mù màu.
- Đáp ứng tiêu chuẩn WCAG 2.1 AA.

---

# 2. Design Principles

Ứng dụng phải:

- Dễ đọc.
- Dễ nhìn.
- Dễ thao tác.
- Dễ hiểu.
- Không phụ thuộc hoàn toàn vào màu sắc.

---

# 3. Touch Target

Minimum

48 x 48 dp

Khoảng cách giữa các nút

≥ 8dp

---

# 4. Typography Accessibility

Font tối thiểu

12sp

Khuyến nghị

14sp+

Cho phép:

Dynamic Font Size

Không cắt chữ.

---

# 5. Color Accessibility

Contrast Ratio

Normal Text

≥ 4.5 : 1

Large Text

≥ 3 : 1

Không dùng:

Đỏ + Xanh lá

Làm thông tin chính.

---

# 6. Icon Accessibility

Mọi Icon quan trọng phải có:

Label

Tooltip (Web)

Semantic Label

Ví dụ:

Back

Search

Payment

QR Code

Notification

---

# 7. Screen Reader Support

Flutter Semantics

VoiceOver

TalkBack

Tất cả Button phải có:

Semantic Label

Hint

Role

---

# 8. Image Accessibility

Image phải có:

Description

Placeholder

Error Image

QR không dùng thay Text.

---

# 9. Form Accessibility

Input có:

Label

Hint

Error Message

Required Indicator

Validation Message

---

# 10. Button Accessibility

Primary Button

Disabled Button

Loading Button

Icon Button

Mọi Button phải:

Có Label

Có Focus

Có Disabled State

---

# 11. Navigation Accessibility

Bottom Navigation

Tab Navigation

Back Button

Drawer

Dialog

Bottom Sheet

Hỗ trợ điều hướng bằng bàn phím (Web/Future).

---

# 12. Error Accessibility

Hiển thị rõ:

Lỗi gì.

Làm gì tiếp theo.

Không dùng:

Unknown Error.

---

# 13. Motion Accessibility

Cho phép:

Reduce Motion.

Tắt Animation.

Không dùng Flash.

Không Animation quá nhanh.

---

# 14. Notification Accessibility

Snackbar

Dialog

Toast

Đều có:

Text

Icon

Color

Không chỉ hiển thị Icon.

---

# 15. QR Accessibility

Có:

Booking Code

Passenger Name

Trip Code

Không phụ thuộc QR.

---

# 16. Language

Version 1

Vietnamese

English

Future

Japanese

Chinese

Korean

---

# 17. Accessibility Testing

TalkBack

VoiceOver

Dynamic Font

Dark Mode (Future)

Large Text

Landscape

Tablet

---

# 18. Flutter Guidelines

Semantics Widget

ExcludeSemantics

MergeSemantics

Tooltip

FocusNode

Shortcuts

Actions

---

# 19. Accessibility Checklist

✓ Button có Label.

✓ Input có Error.

✓ Icon có Semantic.

✓ Contrast đạt chuẩn.

✓ Font đủ lớn.

✓ Touch Area ≥ 48dp.

✓ Không chỉ dùng màu.

✓ Hỗ trợ Screen Reader.

---

# 20. Future Expansion

Voice Command

Accessibility Settings

High Contrast Mode

Large Cursor

Keyboard Navigation

Screen Magnifier

---

# 21. Related Documents

Design System

Typography

Color System

Animation

Responsive

Component Library

---

# 22. Summary

Accessibility là tiêu chuẩn bắt buộc trong BusZ.

Mọi màn hình và Component phải được thiết kế để tất cả người dùng đều có thể sử dụng một cách thuận tiện, kể cả người khuyết tật hoặc người cao tuổi.