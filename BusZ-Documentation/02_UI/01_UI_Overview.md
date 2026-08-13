# UI Overview

Project: BusZ - Intercity Bus Ticket Booking Platform

Version: 1.0

Document Type: UI/UX Specification

Priority: Critical

Status: Draft

---

# 1. Purpose

Tài liệu này mô tả tổng quan về toàn bộ giao diện người dùng (User Interface) của ứng dụng BusZ.

UI phải đảm bảo:

- Đơn giản
- Dễ sử dụng
- Thống nhất
- Hiện đại
- Phù hợp với người dùng Việt Nam
- Dễ mở rộng

Đây là tài liệu gốc để phát triển Flutter App.

---

# 2. Design Goals

BusZ hướng tới trải nghiệm:

✓ Nhanh

✓ Đơn giản

✓ Ít thao tác

✓ Màu sắc dễ nhìn

✓ Đặt vé trong dưới 3 phút

---

# 3. Design Principles

Toàn bộ giao diện phải tuân theo các nguyên tắc:

Consistency

Simplicity

Accessibility

Feedback

Hierarchy

Responsive

Minimalism

---

# 4. Target Users

Khách hàng

Nhà xe

Nhân viên

Admin

---

# 5. Application Platforms

Flutter Android

Flutter iOS

Tablet (Future)

---

# 6. Navigation Structure

Home

↓

Search

↓

Trip Detail

↓

Seat Selection

↓

Booking

↓

Passenger

↓

Payment

↓

Ticket

↓

Profile

---

# 7. Main Modules

Authentication

Home

Search

Trip Detail

Booking

Seat

Passenger

Payment

Ticket

Notification

Profile

Settings

Support

---

# 8. UI Architecture

Splash Screen

↓

Onboarding

↓

Authentication

↓

Main Navigation

↓

Feature Modules

↓

Dialog

↓

Bottom Sheet

↓

Toast

---

# 9. Navigation Pattern

Bottom Navigation

Top App Bar

Back Navigation

Modal Bottom Sheet

Full Screen Dialog

---

# 10. Screen Categories

Authentication

Home

Booking

Payment

Ticket

Notification

Profile

Settings

Support

Error

Loading

---

# 11. Common UI Elements

App Bar

Bottom Navigation

Button

Card

List

Chip

Badge

Bottom Sheet

Dialog

SnackBar

Search Bar

Text Field

Dropdown

Calendar

Map

Image

QR Code

---

# 12. Interaction Principles

Một hành động

↓

Một phản hồi

Loading

↓

Skeleton

Success

↓

Animation

Failure

↓

Error Dialog

---

# 13. Loading States

Loading Screen

Skeleton Loading

Infinite Scroll

Pull To Refresh

---

# 14. Empty States

No Booking

No Ticket

No Notification

No Search Result

No Internet

---

# 15. Error States

Network Error

Server Error

Payment Failed

Booking Failed

Unknown Error

Permission Denied

---

# 16. Success States

Booking Success

Payment Success

Ticket Created

Profile Updated

Password Changed

---

# 17. Theme

Light Theme

Dark Theme (Future)

Dynamic Theme (Future)

---

# 18. Localization

Vietnamese

English

Future

Japanese

Korean

Chinese

---

# 19. Accessibility

Large Font

Screen Reader

Color Contrast

Touch Target ≥ 48dp

High Contrast

---

# 20. Performance Goals

First Screen

< 2 giây

Navigation

< 300ms

Animation

60 FPS

---

# 21. Design References

Material Design 3

Human Interface Guidelines (iOS)

Flutter Material Components

---

# 22. Related Documents

Business Documents

Design System

Component Library

Flutter Architecture

API Documentation

---

# 23. Future Expansion

Tablet Layout

Desktop Layout

Web Version

Wear OS

Android Auto

---

# 24. Summary

UI Overview là tài liệu nền tảng của toàn bộ giao diện BusZ.

Mọi màn hình, component và animation phải tuân theo các nguyên tắc trong tài liệu này để đảm bảo trải nghiệm người dùng thống nhất trên toàn bộ hệ thống.