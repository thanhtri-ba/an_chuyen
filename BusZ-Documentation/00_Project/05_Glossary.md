# Glossary

**Project:** BusZ - Intercity Bus Ticket Booking Platform

**Version:** 1.0

**Document Type:** Glossary

---

# 1. Purpose

Tài liệu này định nghĩa toàn bộ thuật ngữ được sử dụng trong dự án BusZ.

Mục tiêu:

- Thống nhất cách đặt tên.
- Tránh nhầm lẫn giữa các thành viên.
- Làm chuẩn tham chiếu cho Database, Backend, API và Flutter.
- Giúp tài liệu có tính nhất quán.

---

# 2. General Terms

## BusZ

Tên của hệ thống đặt vé xe khách liên tỉnh.

---

## Customer

Người sử dụng ứng dụng để tìm kiếm và đặt vé.

---

## Bus Company

Đơn vị vận hành xe khách.

Ví dụ:

- Phương Trang
- Thành Bưởi
- Kumho
- Mai Linh

---

## Administrator

Người quản trị toàn bộ hệ thống.

Có quyền:

- Quản lý dữ liệu
- Quản lý người dùng
- Quản lý thanh toán
- Quản lý báo cáo

---

## Staff

Nhân viên của nhà xe.

Có quyền:

- Quản lý chuyến xe
- Kiểm tra vé
- Hỗ trợ hành khách

---

# 3. Route Terms

## Route

Tuyến đường.

Ví dụ:

TP.HCM → Đà Lạt

---

## Trip

Một chuyến xe cụ thể.

Ví dụ:

08:00 ngày 01/08/2026

TP.HCM → Đà Lạt

---

## Departure

Điểm khởi hành.

---

## Destination

Điểm đến.

---

## Checkpoint

Điểm đón hoặc trả khách.

Ví dụ:

- Bến xe Miền Đông
- Ngã tư An Sương
- Bến xe Đà Lạt

---

## Station

Bến xe.

---

# 4. Bus Terms

## Bus

Xe khách.

---

## Bus Type

Loại xe.

Ví dụ:

- Limousine
- Sleeper
- Cabin
- Standard

---

## Seat

Ghế ngồi.

---

## Seat Code

Mã ghế.

Ví dụ:

A01

B05

C12

---

## Seat Status

Trạng thái ghế.

AVAILABLE

HOLD

BOOKED

BLOCKED

---

# 5. Booking Terms

## Booking

Đơn đặt vé.

Một Booking có thể chứa nhiều hành khách.

---

## Booking Item

Một vé trong Booking.

Ví dụ:

Booking

↓

Passenger A

↓

Seat A01

↓

Trip 01

---

## Booking Code

Mã đặt vé.

Ví dụ:

BZ202600001

---

## Booking Status

PENDING

CONFIRMED

PAID

CANCELLED

FAILED

REFUNDED

---

# 6. Passenger Terms

## Contact

Người liên hệ.

Người thanh toán.

Không nhất thiết là người đi xe.

---

## Passenger

Người trực tiếp đi xe.

---

## Saved Passenger

Hành khách được lưu.

---

# 7. Payment Terms

## Payment

Thông tin thanh toán.

---

## Payment Method

Ví dụ:

VNPay

MoMo

ZaloPay

Credit Card

Cash

---

## Payment Status

UNPAID

PAID

FAILED

REFUNDED

---

## Refund

Hoàn tiền.

---

## Cancellation

Hủy vé.

---

# 8. Ticket Terms

## Ticket

Vé điện tử.

---

## QR Code

Mã QR dùng để kiểm tra vé.

---

## Boarding

Quá trình lên xe.

---

## Check-in

Xác nhận hành khách.

---

# 9. User Terms

## User

Tài khoản trong hệ thống.

---

## Role

Vai trò.

Customer

Staff

Admin

---

## Permission

Quyền truy cập.

---

# 10. Promotion Terms

## Coupon

Mã giảm giá.

---

## Promotion

Chương trình khuyến mãi.

---

## Reward Point

Điểm thưởng.

---

# 11. Notification Terms

## Push Notification

Thông báo gửi đến điện thoại.

---

## Email Notification

Thông báo qua Email.

---

## SMS Notification

Thông báo qua SMS.

---

# 12. Technical Terms

## REST API

Giao tiếp giữa Mobile và Backend.

---

## JWT

JSON Web Token.

---

## Refresh Token

Token dùng để cấp JWT mới.

---

## ORM

Object Relational Mapping.

Trong dự án sử dụng Prisma ORM.

---

## Migration

Script tạo hoặc cập nhật Database.

---

## Seed Data

Dữ liệu mẫu.

---

# 13. Status Definitions

## User

ACTIVE

INACTIVE

BANNED

---

## Trip

OPEN

FULL

DELAYED

CANCELLED

FINISHED

---

## Seat

AVAILABLE

HOLD

BOOKED

BLOCKED

---

## Payment

PENDING

SUCCESS

FAILED

REFUNDED

---

## Booking

PENDING

CONFIRMED

CANCELLED

COMPLETED

REFUNDED

---

# 14. Naming Convention

Tên bảng:

- users
- bookings
- trips
- routes

Tên API:

GET /trips

POST /bookings

Tên biến:

camelCase

Tên Class:

PascalCase

Tên Database:

snake_case

---

# 15. Summary

Tài liệu này là chuẩn thuật ngữ của toàn bộ dự án BusZ.

Tất cả tài liệu Database, Backend, Flutter, API và Website Admin phải sử dụng thống nhất các thuật ngữ được định nghĩa trong tài liệu này nhằm đảm bảo tính nhất quán và dễ bảo trì.