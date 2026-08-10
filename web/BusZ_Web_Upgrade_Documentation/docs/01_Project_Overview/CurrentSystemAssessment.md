# 2. Đánh giá hệ thống hiện tại

## 2.1 Điểm tốt

- Source đã chia theo feature, phù hợp để mở rộng.
- Các màn hình chính của booking flow đã tồn tại.
- Có `shared/components` và `shared/api` làm nền tảng.
- Dùng React + TypeScript giúp kiểm soát kiểu dữ liệu tốt.
- Vite phù hợp cho tốc độ phát triển và build nhanh.

## 2.2 Khoảng trống cần xử lý

### Design system chưa hoàn thiện

Thư mục `design-system` đang gần như trống. Điều này dễ dẫn đến mỗi màn hình dùng spacing, màu, button, input và card khác nhau.

### Lớp dịch vụ chưa rõ ràng

Thư mục `services` chưa được sử dụng đúng vai trò. Các API nên được chia theo domain như trip, booking, payment, auth và profile.

### Thiếu trang Trip Detail

Luồng hiện tại có thể chuyển từ kết quả tìm kiếm trực tiếp sang chọn ghế. Người dùng cần một bước xem thông tin xe, tiện ích, điểm đón, chính sách và đánh giá trước khi quyết định.

### Thiếu Passenger Information độc lập

Thông tin người đặt, hành khách, hóa đơn, bảo hiểm và yêu cầu đặc biệt nên được tách thành bước rõ ràng.

### Thiếu trạng thái giao diện

Mỗi màn hình cần có:

- Loading skeleton.
- Empty state.
- Error state.
- Retry action.
- Disabled state.
- Success feedback.

### Thiếu khả năng mở rộng

Các feature mới như wallet, loyalty, voucher, AI Assistant và support center chưa có vị trí rõ trong kiến trúc.

## 2.3 Mức độ ưu tiên

| Hạng mục | Mức độ | Lý do |
|---|---:|---|
| Design system | Rất cao | Ảnh hưởng toàn dự án |
| Search + Trip Detail | Rất cao | Ảnh hưởng quyết định mua |
| Seat + Passenger + Payment | Rất cao | Luồng chuyển đổi chính |
| API layer | Rất cao | Cần để kết nối backend |
| Home redesign | Cao | Tạo ấn tượng và điều hướng |
| Booking management | Cao | Dùng sau mua |
| Profile/Notification | Trung bình | Tăng giữ chân người dùng |
| AI Assistant | Trung bình | Tạo khác biệt nhưng phụ thuộc backend |
