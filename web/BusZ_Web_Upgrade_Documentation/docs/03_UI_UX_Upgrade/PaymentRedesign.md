# 10. Nâng cấp thanh toán

## 10.1 Phương thức

- QR/VNPay.
- MoMo.
- ZaloPay.
- Chuyển khoản ngân hàng.
- Thẻ nội địa/quốc tế.
- Ví BusZ trong tương lai.

## 10.2 Cấu trúc trang

- Bên trái: lựa chọn phương thức và form thanh toán.
- Bên phải: tóm tắt đơn hàng sticky.
- Mobile: tóm tắt đơn có thể thu gọn.

## 10.3 Fare breakdown

- Giá vé.
- Phụ phí.
- Bảo hiểm.
- Giảm giá.
- Điểm thưởng.
- Tổng thanh toán.

## 10.4 Trạng thái

- Pending.
- Processing.
- Success.
- Failed.
- Expired.
- Cancelled.

## 10.5 Acceptance criteria

- Không tạo nhiều giao dịch khi nhấn nút liên tục.
- Có timeout và hướng dẫn tiếp tục.
- Có kiểm tra trạng thái giao dịch lại từ backend.
- Không lưu dữ liệu thẻ trong frontend.
