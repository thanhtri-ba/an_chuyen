# UI/UX & User Experience Upgrades

Tài liệu này đề xuất các cải tiến về mặt giao diện và trải nghiệm người dùng để thu hút và giữ chân khách hàng.

## 1. Hỗ trợ Đa ngôn ngữ và Đa tiền tệ (Localization)
- **Mục tiêu:** Tiếp cận đối tượng khách hàng quốc tế (khách du lịch).
- **Thực thi:**
  - Áp dụng thư viện i18n (như `react-i18next` cho web, `easy_localization` cho Flutter).
  - Tích hợp thêm các cổng thanh toán quốc tế (Stripe, PayPal) và hiển thị giá vé theo tỷ giá hối đoái.

## 2. Chế độ Ngoại tuyến (Offline Mode) cho Nhân viên
- **Mục tiêu:** Giúp lơ xe, tài xế có thể kiểm tra vé ở những vùng mất sóng (đèo, núi).
- **Thực thi:**
  - Đồng bộ danh sách hành khách xuống thiết bị di động trước giờ khởi hành.
  - Cho phép quét mã QR và cập nhật trạng thái "đã lên xe" offline (lưu vào local database như SQLite/Hive).
  - Tự động đồng bộ lên server ngay khi có kết nối mạng trở lại.

## 3. Game hóa & Trải nghiệm (Gamification)
- **Mục tiêu:** Tăng sự tương tác và hứng thú khi sử dụng app.
- **Thực thi:**
  - Xây dựng hệ thống cấp bậc người dùng (Đồng, Bạc, Vàng, Kim Cương).
  - Tạo các "nhiệm vụ" (VD: Đi 3 chuyến trong tháng để nhận voucher 50k).
  - Hiệu ứng animation sinh động khi hoàn thành đặt vé, nâng cấp hạng thành viên.
