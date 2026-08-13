# Web Upgrade - Phase 2: Booking & Payment

**Version:** 1.0.0  
**Project:** BusZ - Intercity Bus Ticket Booking Platform (Web)  
**Document Type:** Upgrade Specification  
**Status:** Draft  
**Author:** BusZ Development Team  
**Last Updated:** 2026

---

# 1. Introduction
Giai đoạn 2 tối ưu hóa phễu chuyển đổi cuối cùng: Quá trình Chọn ghế, Nhập thông tin và Thanh toán. Tối ưu UX tại đây sẽ quyết định việc khách hàng có chốt đơn (Checkout) hay không.

---

# 2. Features Upgrade

## 2.1 Interactive Seat Selection
Nâng cấp từ sơ đồ tĩnh sang sơ đồ tương tác cao cấp:
- **Animations:** Zoom in/out, hiệu ứng mượt mà khi chọn/hủy ghế.
- **Legend & Mapping:** Phân loại rõ: Ghế trống, Ghế đã bán, Ghế VIP, Ghế dành cho Nữ, Ghế đang chọn.
- **Real-time Lock:** Khóa ghế theo thời gian thực (giữ chỗ trong 5-10 phút).

## 2.2 Passenger Information Form
Tách biệt luồng nhập dữ liệu để chuyên nghiệp hóa:
- **Người đặt vs Hành khách:** Tách riêng thông tin người đặt vé và hành khách đi xe. Hỗ trợ chọn nhanh từ danh sách "Saved Passengers".
- **Hóa đơn VAT:** Thêm form yêu cầu xuất hóa đơn điện tử cho khách hàng doanh nghiệp.
- **Upselling:** Module bán chéo Bảo hiểm chuyến đi.
- **Khuyến mãi:** Khu vực nhập Voucher và quy đổi Điểm thưởng (Points) trực tiếp trước khi thanh toán.

## 2.3 Comprehensive Payment Hub
Mở rộng phương thức thanh toán, tương đương Traveloka:
- **Nội địa:** VietQR, MoMo, VNPay, ZaloPay.
- **Quốc tế:** Thẻ tín dụng/ghi nợ (Visa/Mastercard), Apple Pay, Google Pay.
- **Nội bộ:** Thanh toán bằng Ví BusZ (Wallet).
- **Tính năng nâng cao:** Lưu thẻ an toàn (Saved Cards), Thanh toán trả góp (Installment).

---

# 3. Expected Outcome
- Giảm tỷ lệ bỏ giỏ hàng (Cart Abandonment Rate) nhờ luồng thanh toán mượt mà và đa dạng.
- Tăng giá trị trung bình mỗi đơn hàng (AOV) nhờ tính năng bán chéo Bảo hiểm.
