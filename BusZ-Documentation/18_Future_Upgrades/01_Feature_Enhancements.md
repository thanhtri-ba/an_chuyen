# Feature Enhancements

Tài liệu này phác thảo các tính năng nghiệp vụ cấp cao cần được bổ sung để nâng tầm hệ thống.

## 1. Theo dõi thời gian thực (Real-time GPS Tracking)
- **Mục tiêu:** Cho phép khách hàng và quản trị viên xem vị trí xe buýt trên bản đồ theo thời gian thực.
- **Thực thi:** 
  - Tích hợp thiết bị GPS trên xe hoặc sử dụng app tài xế để gửi tọa độ liên tục.
  - Sử dụng WebSockets (Socket.io) để đẩy dữ liệu vị trí lên app/web của khách hàng.
  - Vẽ lộ trình trực tiếp trên bản đồ (Google Maps hoặc OpenStreetMap).

## 2. Định giá động (Dynamic Pricing)
- **Mục tiêu:** Tối ưu hóa doanh thu bằng cách điều chỉnh giá vé tự động.
- **Thực thi:**
  - Xây dựng thuật toán phân tích nhu cầu dựa trên: thời điểm đặt vé, số ghế trống, các dịp lễ/Tết.
  - Cập nhật giá vé tự động trên hệ thống phân phối.

## 3. Nền tảng đa đối tác (Multi-vendor / Marketplace)
- **Mục tiêu:** Mở rộng hệ thống để các nhà xe khác có thể tham gia bán vé trên nền tảng.
- **Thực thi:**
  - Thiết kế lại cơ sở dữ liệu để hỗ trợ `TenantID` hoặc `VendorID`.
  - Cung cấp trang Admin riêng biệt cho từng nhà xe để tự quản lý chuyến đi, doanh thu của họ.
  - Phân chia hoa hồng tự động.

## 4. CRM & Marketing Automation
- **Mục tiêu:** Tăng tỷ lệ giữ chân khách hàng (Retention Rate).
- **Thực thi:**
  - Tự động hóa gửi Email/SMS/Push Notification cho các sự kiện: sinh nhật, lời nhắc chuyến đi, mời đặt vé sau một khoảng thời gian dài không sử dụng.
  - Tích hợp với các công cụ như Mailchimp, SendGrid hoặc tự build flow automation trong hệ thống.
