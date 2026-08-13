# Project Scope

**Project:** BusZ - Intercity Bus Ticket Booking Platform

**Version:** 1.0

**Document Type:** Project Scope

---

# 1. Purpose

Tài liệu này xác định phạm vi của dự án BusZ.

Mục tiêu là xác định rõ:

- Những chức năng sẽ được phát triển.
- Những chức năng chưa nằm trong phạm vi.
- Những giới hạn của phiên bản đầu tiên (MVP).
- Định hướng mở rộng trong các phiên bản tương lai.

Việc xác định phạm vi giúp toàn bộ nhóm phát triển có cùng một định hướng, tránh phát sinh yêu cầu ngoài kế hoạch và đảm bảo tiến độ dự án.

---

# 2. Product Scope

BusZ là hệ thống đặt vé xe khách liên tỉnh bao gồm:

- Ứng dụng Mobile dành cho khách hàng.
- Website quản trị dành cho quản trị viên.
- Backend REST API.
- Database tập trung.
- Hệ thống thanh toán.
- Hệ thống thông báo.
- Vé điện tử.

---

# 3. MVP Scope

Phiên bản đầu tiên sẽ hoàn thành các chức năng dưới đây.

---

## 3.1 Authentication

Bao gồm:

- Register
- Login
- Logout
- Forgot Password
- OTP Verification
- Reset Password

---

## 3.2 Home

Bao gồm:

- Banner
- Popular Routes
- Search Box
- Recent Search
- Promotions

---

## 3.3 Search Trip

Người dùng có thể:

- Chọn điểm đi
- Chọn điểm đến
- Chọn ngày
- Chọn số lượng hành khách
- Tìm chuyến xe

---

## 3.4 Trip List

Hiển thị:

- Danh sách chuyến
- Giá
- Điểm thưởng
- Rating
- Loại xe
- Filter
- Sort

---

## 3.5 Trip Detail

Bao gồm:

- Gallery
- Bus Information
- Facilities
- Travel Route
- Cancellation Policy
- Terms & Conditions

---

## 3.6 Calendar

- Departure Date
- Return Date
- Giá theo từng ngày

---

## 3.7 Seat Selection

- Chọn ghế
- Trạng thái ghế
- Tổng tiền

---

## 3.8 Passenger

- Contact
- Passenger
- Saved Passenger

---

## 3.9 Booking

- Booking Summary
- Confirm Booking

---

## 3.10 Payment

- VNPay
- MoMo
- ZaloPay

---

## 3.11 Ticket

- QR Code
- Booking Code
- Ticket Detail
- Download Ticket

---

## 3.12 Booking History

- Danh sách booking
- Chi tiết booking

---

## 3.13 Profile

- Personal Information
- Contacts
- Passengers
- Change Password

---

## 3.14 Notification

- Booking Notification
- Payment Notification
- Promotion Notification

---

## 3.15 Admin Website

Bao gồm:

Dashboard

User Management

Bus Company

Route Management

Trip Management

Seat Management

Booking Management

Payment Management

Promotion Management

Review Management

Reports

System Settings

---

# 4. Out Of Scope

Các chức năng dưới đây sẽ không phát triển trong phiên bản đầu tiên.

## AI Recommendation

Đề xuất chuyến xe bằng AI.

---

## Chat Support

Chat trực tiếp với nhà xe.

---

## Live GPS Tracking

Theo dõi vị trí xe theo thời gian thực.

---

## Hotel Booking

Đặt khách sạn.

---

## Flight Booking

Đặt vé máy bay.

---

## Car Rental

Thuê xe.

---

## Travel Insurance

Bảo hiểm du lịch.

---

## Loyalty Membership

Thành viên VIP.

---

## Multi Country

Đặt vé quốc tế.

---

# 5. User Scope

## Customer

Có thể:

- Đăng nhập
- Đặt vé
- Thanh toán
- Xem vé
- Hủy vé
- Đánh giá

---

## Bus Company

Có thể:

- Quản lý xe
- Quản lý tuyến
- Quản lý chuyến
- Quản lý giá

---

## Administrator

Có thể:

- Quản lý toàn bộ hệ thống.
- Quản lý người dùng.
- Quản lý nhà xe.
- Quản lý doanh thu.
- Quản lý thanh toán.
- Quản lý báo cáo.

---

# 6. Technical Scope

Mobile

Flutter

Backend

Node.js

Express

Database

PostgreSQL

Prisma ORM

Authentication

JWT

Storage

Supabase Storage

Maps

OpenStreetMap

Payment

VNPay

MoMo

ZaloPay

---

# 7. Project Deliverables

Dự án sẽ bàn giao:

- Flutter Mobile Application
- Backend REST API
- PostgreSQL Database
- Admin Website
- API Documentation
- Database Documentation
- Source Code
- Deployment Guide
- User Manual

---

# 8. Scope Limitations

Phiên bản đầu tiên chỉ phục vụ:

- Thị trường Việt Nam.
- Xe khách liên tỉnh.
- Thanh toán trực tuyến phổ biến tại Việt Nam.

---

# 9. Future Expansion

Trong tương lai BusZ có thể mở rộng:

- Vé máy bay
- Vé tàu
- Taxi
- Thuê xe
- Tour du lịch
- AI Recommendation
- Chatbot
- GPS Tracking
- Membership
- Coupon Engine
- Dynamic Pricing
- Multi-language
- Multi-currency

---

# 10. Scope Summary

BusZ Version 1 tập trung xây dựng một hệ thống đặt vé xe khách liên tỉnh hoàn chỉnh từ tìm kiếm chuyến xe, đặt vé, thanh toán, quản lý vé điện tử đến quản trị hệ thống.

Các tính năng nâng cao sẽ được triển khai ở các phiên bản tiếp theo sau khi nền tảng cốt lõi hoạt động ổn định.