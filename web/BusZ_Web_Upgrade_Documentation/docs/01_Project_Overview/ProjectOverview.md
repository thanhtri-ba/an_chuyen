# 1. Tổng quan dự án nâng cấp BusZ Web

## 1.1 Bối cảnh

BusZ Web hiện đã có phần lớn màn hình cơ bản của một hệ thống đặt vé xe khách. Tuy nhiên, cấu trúc hiện tại vẫn thiên về bản trình diễn giao diện, chưa hoàn thiện ở các lớp design system, quản lý trạng thái, API, kiểm thử, khả năng mở rộng và trải nghiệm người dùng xuyên suốt.

## 1.2 Mục tiêu nâng cấp

- Nâng chất lượng giao diện lên mức sản phẩm thương mại.
- Giảm số thao tác và sự mơ hồ trong quy trình đặt vé.
- Tạo trải nghiệm nhất quán giữa các màn hình.
- Chuẩn hóa component để giảm lặp code.
- Chuẩn bị sẵn cấu trúc để kết nối backend BusZ.
- Đảm bảo website hoạt động tốt trên desktop, tablet và mobile.

## 1.3 Nguyên tắc triển khai

- Không phá vỡ các route và luồng nghiệp vụ đang chạy nếu chưa cần thiết.
- Không viết lại toàn bộ dự án trong một lần.
- Nâng cấp theo sprint và theo feature.
- Component dùng chung phải được tách trước khi mở rộng từng trang.
- Mỗi màn hình phải có loading, empty, error và responsive state.
- Mọi thay đổi lớn phải có acceptance criteria và kiểm thử.

## 1.4 Phạm vi

### Trong phạm vi

- Design system.
- Layout, navigation và responsive.
- Home, Search, Trip Detail, Seat Selection.
- Passenger Information, Payment, Booking.
- Offers, Notifications, Profile.
- API layer, caching, state management.
- Performance, accessibility, SEO.
- Giao diện AI Assistant.

### Ngoài phạm vi giai đoạn đầu

- Viết lại backend.
- Thay đổi schema database.
- Tích hợp thanh toán thật ngay lập tức.
- Xây admin ERP hoàn chỉnh.
- Fine-tune AI model.

## 1.5 Kết quả kỳ vọng

Sau khi hoàn tất, BusZ Web phải có trải nghiệm đặt vé rõ ràng, giao diện đồng nhất, cấu trúc dễ bảo trì, API dễ thay thế mock bằng dữ liệu thật và sẵn sàng mở rộng thành nền tảng thương mại.
