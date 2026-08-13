# Assumptions

**Project:** BusZ - Intercity Bus Ticket Booking Platform

**Version:** 1.0

**Document Type:** Project Assumptions

---

# 1. Purpose

Tài liệu này mô tả các giả định (Assumptions) được sử dụng trong quá trình phân tích, thiết kế và phát triển hệ thống BusZ.

Các giả định này giúp nhóm phát triển có cùng cách hiểu về phạm vi dự án, giảm rủi ro khi triển khai và là cơ sở để thiết kế Database, Backend, Mobile Application và Admin Website.

---

# 2. General Assumptions

Hệ thống BusZ được phát triển dành cho thị trường Việt Nam.

Người dùng có kết nối Internet ổn định trong quá trình sử dụng.

Ứng dụng hoạt động trên Android và iOS.

Website Admin hoạt động trên trình duyệt hiện đại.

Mỗi người dùng sở hữu một tài khoản duy nhất.

---

# 3. User Assumptions

Người dùng có:

- Email hợp lệ.
- Số điện thoại hợp lệ.
- Thiết bị di động.

Người dùng có thể:

- Đăng ký.
- Đăng nhập.
- Đặt vé.
- Thanh toán.
- Xem vé điện tử.

Người dùng chịu trách nhiệm về tính chính xác của thông tin hành khách.

---

# 4. Authentication Assumptions

Đăng nhập sử dụng:

- Email + Password

Trong tương lai có thể mở rộng:

- Google Login
- Apple Login
- Facebook Login

JWT được sử dụng để xác thực.

Refresh Token được sử dụng để gia hạn phiên đăng nhập.

---

# 5. Bus Company Assumptions

Mỗi nhà xe có:

- Nhiều xe.
- Nhiều tuyến.
- Nhiều chuyến.

Một chuyến xe chỉ thuộc về một nhà xe.

Một xe có thể phục vụ nhiều chuyến khác nhau theo thời gian.

---

# 6. Route Assumptions

Một tuyến đường có:

- Điểm đi.
- Điểm đến.

Một tuyến có thể có nhiều checkpoint.

Một checkpoint có thể được sử dụng bởi nhiều tuyến.

---

# 7. Trip Assumptions

Một Trip đại diện cho một chuyến xe cụ thể.

Trip bao gồm:

- Xe.
- Nhà xe.
- Tuyến đường.
- Giờ khởi hành.
- Giờ đến.

Một Trip có nhiều ghế.

---

# 8. Seat Assumptions

Mỗi ghế có mã duy nhất.

Ví dụ:

A01

A02

B01

B02

Trạng thái ghế:

AVAILABLE

HOLD

BOOKED

BLOCKED

Ghế HOLD sẽ tự động được giải phóng sau thời gian cấu hình nếu không hoàn tất thanh toán.

---

# 9. Booking Assumptions

Một Booking có thể bao gồm:

- Một hoặc nhiều hành khách.

Một Booking có thể gồm:

- Chiều đi.
- Chiều về.

Booking chỉ được xác nhận sau khi thanh toán thành công.

---

# 10. Passenger Assumptions

Người liên hệ (Contact) có thể khác với hành khách.

Một Contact có thể quản lý nhiều Passenger.

Passenger có thể được lưu để sử dụng cho các lần đặt vé sau.

---

# 11. Payment Assumptions

Thanh toán trực tuyến thông qua:

- VNPay
- MoMo
- ZaloPay

Thanh toán chỉ được xác nhận khi cổng thanh toán trả kết quả thành công.

Nếu thanh toán thất bại:

- Booking vẫn ở trạng thái PENDING trong thời gian giữ ghế.
- Sau khi hết thời gian giữ ghế, Booking sẽ tự động hủy.

---

# 12. Ticket Assumptions

Sau khi thanh toán thành công:

Hệ thống tự động:

- Sinh Booking Code.
- Sinh QR Code.
- Tạo E-Ticket.
- Gửi Email xác nhận (nếu cấu hình).
- Gửi Push Notification.

---

# 13. Notification Assumptions

Thông báo được gửi khi:

- Đặt vé thành công.
- Thanh toán thành công.
- Hủy vé.
- Hoàn tiền.
- Thay đổi lịch trình.
- Khuyến mãi.

---

# 14. Database Assumptions

Sử dụng PostgreSQL.

ORM sử dụng Prisma.

Tất cả bảng đều có:

- id
- created_at
- updated_at

Khóa chính sử dụng UUID.

Các khóa ngoại được định nghĩa đầy đủ.

Không lưu dữ liệu trùng lặp nếu có thể chuẩn hóa.

---

# 15. Backend Assumptions

Backend được xây dựng theo kiến trúc REST API.

Module được tách riêng:

- Authentication
- User
- Route
- Trip
- Booking
- Seat
- Payment
- Ticket
- Notification
- Admin

Business Logic không được xử lý trong Controller.

---

# 16. Mobile Assumptions

Ứng dụng sử dụng Flutter.

State Management sẽ được lựa chọn sau (Riverpod, Bloc hoặc Provider).

Ứng dụng hoạt động trên:

- Android
- iOS

---

# 17. Admin Website Assumptions

Admin Website chỉ dành cho người có quyền.

Admin có thể:

- Quản lý người dùng.
- Quản lý nhà xe.
- Quản lý tuyến.
- Quản lý chuyến.
- Quản lý booking.
- Quản lý thanh toán.
- Xem báo cáo.

---

# 18. Third-party Service Assumptions

Hệ thống có thể tích hợp:

- OpenStreetMap
- Supabase Storage
- Firebase Cloud Messaging
- VNPay
- MoMo
- ZaloPay

Nếu dịch vụ bên thứ ba gặp sự cố, hệ thống phải ghi log và xử lý lỗi phù hợp.

---

# 19. Scalability Assumptions

Hệ thống được thiết kế để:

- Thêm nhà xe mới.
- Thêm tuyến mới.
- Thêm phương thức thanh toán.
- Hỗ trợ đa ngôn ngữ.
- Hỗ trợ đa tiền tệ trong tương lai.

---

# 20. Summary

Các giả định trong tài liệu này là cơ sở cho toàn bộ quá trình phân tích, thiết kế và phát triển BusZ.

Nếu bất kỳ giả định nào thay đổi, các tài liệu liên quan như Database Design, Backend Architecture, API Specification và UI Requirement phải được rà soát và cập nhật tương ứng để đảm bảo tính nhất quán của toàn bộ hệ thống.