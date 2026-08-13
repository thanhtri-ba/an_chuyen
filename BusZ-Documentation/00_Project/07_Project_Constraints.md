# Project Constraints

**Project:** BusZ - Intercity Bus Ticket Booking Platform

**Version:** 1.0

**Document Type:** Project Constraints

---

# 1. Purpose

Tài liệu này mô tả các giới hạn (Constraints) của dự án BusZ.

Những giới hạn này là cơ sở để nhóm phát triển đưa ra quyết định về thiết kế hệ thống, lựa chọn công nghệ và lập kế hoạch triển khai.

Các giới hạn có thể đến từ:

- Công nghệ
- Nguồn lực
- Thời gian
- Ngân sách
- Dữ liệu
- Bảo mật
- Hạ tầng
- Quy định pháp luật

---

# 2. Project Constraints

Dự án được phát triển trong phạm vi đồ án tốt nghiệp và có khả năng mở rộng thành sản phẩm thực tế.

Các quyết định thiết kế cần ưu tiên:

- Dễ bảo trì
- Dễ mở rộng
- Dễ triển khai
- Dễ kiểm thử

---

# 3. Budget Constraints

Giai đoạn đầu ưu tiên sử dụng các dịch vụ miễn phí hoặc chi phí thấp.

Ví dụ:

Database

- PostgreSQL

Storage

- Supabase Storage

Map

- OpenStreetMap

Push Notification

- Firebase Cloud Messaging

Source Control

- GitHub

CI/CD

- GitHub Actions

---

# 4. Technology Constraints

Frontend

Flutter

Backend

Node.js

Framework

Express.js

ORM

Prisma

Database

PostgreSQL

Admin

React

Không sử dụng nhiều framework Backend cùng lúc.

---

# 5. Infrastructure Constraints

Toàn bộ hệ thống cần có khả năng chạy trên:

Development

Local Machine

Testing

Cloud

Production

Cloud VPS

Không phụ thuộc vào hệ điều hành.

---

# 6. Database Constraints

Chỉ sử dụng một Database chính.

Không lưu dữ liệu dư thừa.

Mọi bảng đều phải:

- Primary Key
- Foreign Key
- Index phù hợp
- Audit Fields

---

# 7. API Constraints

API tuân theo RESTful.

Response Format:

JSON

Không trả HTML.

Authentication:

JWT

Version:

/api/v1

---

# 8. Security Constraints

Password phải được Hash.

Không lưu Password dạng Plain Text.

Sử dụng HTTPS khi triển khai Production.

Role-Based Access Control.

Input Validation bắt buộc.

Rate Limiting.

Audit Log.

---

# 9. Performance Constraints

Search Trip

≤ 2 giây

Login

≤ 1 giây

Booking

≤ 5 giây

Payment Callback

≤ 10 giây

---

# 10. UI Constraints

UI phải đồng nhất với Figma.

Responsive:

- Android
- iPhone
- Tablet

Dark Mode sẽ phát triển ở phiên bản sau.

---

# 11. Business Constraints

Chỉ hỗ trợ:

- Xe khách liên tỉnh.

Không hỗ trợ:

- Máy bay
- Taxi
- Tàu hỏa
- Khách sạn

---

# 12. Payment Constraints

Phiên bản đầu hỗ trợ:

- VNPay
- MoMo
- ZaloPay

Stripe và PayPal sẽ được bổ sung trong tương lai.

---

# 13. Map Constraints

Map sử dụng:

OpenStreetMap

Không phụ thuộc Google Maps API để giảm chi phí.

---

# 14. Notification Constraints

Notification sử dụng:

Firebase Cloud Messaging

Email sẽ triển khai sau.

SMS sẽ triển khai sau.

---

# 15. Development Constraints

Source Code:

GitHub

Branch:

- main
- develop
- feature/*

Pull Request bắt buộc trước khi merge.

---

# 16. Documentation Constraints

Toàn bộ tài liệu sử dụng Markdown.

Mỗi Module có tài liệu riêng.

Mỗi API có tài liệu riêng.

Database có tài liệu riêng.

---

# 17. Deployment Constraints

Development

Local

Testing

Cloud

Production

Docker Container

---

# 18. Legal Constraints

Không lưu thông tin thanh toán nhạy cảm.

Không chia sẻ dữ liệu người dùng cho bên thứ ba.

Tuân thủ quy định về bảo vệ dữ liệu cá nhân.

---

# 19. Future Constraints

Các chức năng sau sẽ không thuộc Version 1:

- AI Recommendation
- Live Tracking
- Membership
- Hotel Booking
- Flight Booking
- Travel Package

---

# 20. Summary

Các giới hạn trên là cơ sở để thiết kế và phát triển BusZ.

Nếu bất kỳ giới hạn nào thay đổi, toàn bộ tài liệu Database, Backend, API và UI cần được cập nhật tương ứng.