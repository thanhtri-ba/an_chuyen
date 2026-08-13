# BusZ Project Overview

**Version:** 1.0.0  
**Project:** BusZ - Intercity Bus Ticket Booking Platform  
**Document Type:** Project Overview  
**Status:** Draft  
**Author:** BusZ Development Team  
**Last Updated:** 2026

---

# 1. Introduction

## 1.1 Overview

BusZ là nền tảng đặt vé xe khách liên tỉnh được phát triển nhằm số hóa quy trình tìm kiếm, đặt vé và quản lý chuyến đi tại Việt Nam.

Hệ thống cho phép người dùng tìm kiếm chuyến xe theo thời gian thực, lựa chọn ghế ngồi, thanh toán trực tuyến, nhận vé điện tử và theo dõi lịch sử đặt vé trên cùng một nền tảng.

Ngoài ứng dụng dành cho khách hàng, hệ thống còn cung cấp website quản trị dành cho quản trị viên và nhà xe nhằm quản lý toàn bộ dữ liệu của hệ thống.

---

## 1.2 Background

Hiện nay việc đặt vé xe khách tại Việt Nam vẫn còn tồn tại nhiều hạn chế:

- Khó tìm được chuyến xe phù hợp.
- Giá vé giữa các nhà xe không đồng nhất.
- Thiếu khả năng so sánh dịch vụ.
- Quản lý vé thủ công.
- Chưa có hệ thống tích điểm.
- Chưa đồng bộ giữa ứng dụng và website.
- Thông tin chuyến xe phân tán ở nhiều nguồn.

BusZ được xây dựng nhằm giải quyết các vấn đề trên.

---

# 2. Project Vision

BusZ hướng tới việc trở thành nền tảng đặt vé xe khách liên tỉnh hiện đại, cung cấp trải nghiệm nhanh chóng, minh bạch và thuận tiện cho khách hàng, đồng thời hỗ trợ các nhà xe quản lý hoạt động hiệu quả hơn.

---

# 3. Project Objectives

Các mục tiêu chính của dự án gồm:

- Xây dựng ứng dụng đặt vé xe khách trên nền tảng Flutter.
- Xây dựng hệ thống Backend REST API.
- Xây dựng Website quản trị.
- Chuẩn hóa cơ sở dữ liệu.
- Đồng bộ dữ liệu theo thời gian thực.
- Hỗ trợ thanh toán trực tuyến.
- Hỗ trợ vé điện tử.
- Hỗ trợ lịch sử đặt vé.
- Hỗ trợ quản lý nhà xe.
- Hỗ trợ quản lý tuyến đường.

---

# 4. Target Users

## 4.1 Customer

Khách hàng sử dụng ứng dụng để:

- Đăng ký tài khoản.
- Đăng nhập.
- Tìm kiếm chuyến xe.
- Chọn ghế.
- Thanh toán.
- Nhận vé điện tử.
- Đánh giá chuyến đi.

---

## 4.2 Bus Company

Nhà xe có thể:

- Quản lý xe.
- Quản lý chuyến xe.
- Quản lý tài xế.
- Quản lý giá vé.
- Quản lý lịch trình.

---

## 4.3 Administrator

Quản trị viên có thể:

- Quản lý toàn bộ hệ thống.
- Quản lý người dùng.
- Quản lý nhà xe.
- Quản lý tuyến đường.
- Quản lý đơn đặt vé.
- Quản lý thanh toán.
- Quản lý khuyến mãi.
- Xem báo cáo thống kê.

---

# 5. System Overview

Hệ thống BusZ gồm ba thành phần chính:

## Mobile Application

Ứng dụng Flutter dành cho khách hàng.

Các chức năng:

- Authentication
- Home
- Search Trip
- Trip Detail
- Seat Selection
- Passenger Information
- Payment
- E-Ticket
- Booking History
- Notifications
- Profile

---

## Backend System

Máy chủ xử lý toàn bộ nghiệp vụ.

Bao gồm:

- Authentication Service
- Booking Service
- Payment Service
- Ticket Service
- Notification Service
- Review Service

---

## Admin Website

Website quản trị dành cho nhân viên và quản trị viên.

Bao gồm:

- Dashboard
- User Management
- Bus Company Management
- Route Management
- Trip Management
- Booking Management
- Payment Management
- Reports

---

# 6. Core Features

## Authentication

- Register
- Login
- Forgot Password
- OTP Verification
- Logout

---

## Search

- Search Route
- Search Date
- Search Return Trip
- Filter
- Sort

---

## Booking

- Select Trip
- Select Seat
- Contact Information
- Passenger Information
- Booking Summary

---

## Payment

- VNPay
- MoMo
- ZaloPay
- Stripe (Future)

---

## Ticket

- QR Code
- Booking Code
- Ticket Detail
- Download Ticket

---

## Profile

- Edit Profile
- Saved Contacts
- Saved Passengers
- Booking History

---

# 7. Technology Stack

## Mobile

- Flutter
- Dart

## Backend

- Node.js
- Express.js

## Database

- PostgreSQL
- Prisma ORM

## Authentication

- JWT
- Refresh Token

## Cloud

- Supabase
- Cloud Storage

## Maps

- OpenStreetMap

## Payment

- VNPay
- MoMo
- ZaloPay

---

# 8. High-Level Architecture

```text
Flutter Mobile
        │
 REST API
        │
Node.js Backend
        │
Business Services
        │
Prisma ORM
        │
PostgreSQL Database
```

---

# 9. MVP Scope

Phiên bản đầu tiên sẽ bao gồm:

- Authentication
- Search Trip
- Trip Detail
- Seat Selection
- Passenger Information
- Payment
- Ticket
- Booking History

---

# 10. Future Scope

Các chức năng sẽ phát triển sau:

- AI Recommendation
- Live Bus Tracking
- Loyalty Program
- Membership
- Coupon System
- Chat Support
- Hotel Booking
- Flight Booking
- Car Rental

---

# 11. Expected Benefits

Đối với khách hàng:

- Đặt vé nhanh.
- Thanh toán trực tuyến.
- Vé điện tử.
- Dễ quản lý lịch sử.

Đối với nhà xe:

- Giảm chi phí vận hành.
- Quản lý tập trung.
- Thống kê doanh thu.
- Tăng khả năng tiếp cận khách hàng.

---

# 12. Conclusion

BusZ không chỉ là một ứng dụng đặt vé xe khách mà còn là một nền tảng quản lý vận tải hành khách liên tỉnh với kiến trúc hiện đại, khả năng mở rộng cao và định hướng phát triển lâu dài.

Tài liệu này là nền tảng cho toàn bộ các tài liệu phân tích, thiết kế, cơ sở dữ liệu, backend, API và ứng dụng Flutter của dự án.