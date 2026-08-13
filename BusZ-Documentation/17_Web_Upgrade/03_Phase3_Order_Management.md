# Web Upgrade - Phase 3: Order Management & Post-Booking

**Version:** 1.0.0  
**Project:** BusZ - Intercity Bus Ticket Booking Platform (Web)  
**Document Type:** Upgrade Specification  
**Status:** Draft  
**Author:** BusZ Development Team  
**Last Updated:** 2026

---

# 1. Introduction
Giai đoạn 3 tập trung vào trải nghiệm Hậu mãi (Post-Booking). Việc cung cấp công cụ quản lý vé chuyên nghiệp giúp giảm tải cho tổng đài CSKH và tăng mức độ hài lòng của người dùng.

---

# 2. Features Upgrade

## 2.1 Booking Detail (E-Ticket)
Trang chi tiết vé điện tử hoàn chỉnh:
- **Timeline Lịch Trình:** Hiển thị trạng thái vé trực quan: *Đã đặt -> Đã thanh toán -> Đã xác nhận -> Đã lên xe -> Hoàn thành*.
- **E-Ticket QR:** QR code khổ lớn để quét khi lên xe.
- **Hành động (Actions):** Nút Tải PDF, Chia sẻ vé (Share), Yêu cầu Đổi/Trả vé.

## 2.2 My Bookings Management
Bảng điều khiển quản lý vé:
- **Tabs Phân Loại:** Sắp đi (Upcoming), Đã đi (Completed), Đã hủy (Cancelled), Chờ hoàn tiền (Refund), Chờ thanh toán (Pending).
- **Search & Filter:** Tìm kiếm theo Mã vé, Lọc theo ngày khởi hành.
- **Export:** Hỗ trợ xuất dữ liệu chuyến đi.

## 2.3 Notification Center
Trung tâm thông báo toàn diện:
- **Phân loại Tab:** Khuyến mãi (Promotion), Hệ thống (System), Thanh toán (Payment), Chuyến đi (Trip), Trợ lý Chat (Chat), Voucher.
- **Highlight:** Đánh dấu (Read/Unread) với background màu nổi bật.

---

# 3. Expected Outcome
- Cung cấp trải nghiệm theo dõi đơn hàng minh bạch 100%.
- Giảm thiểu số lượng cuộc gọi đến tổng đài hỏi về trạng thái vé hoặc yêu cầu gửi lại vé.
