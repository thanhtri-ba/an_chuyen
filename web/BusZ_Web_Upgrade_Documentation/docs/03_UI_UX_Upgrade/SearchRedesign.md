# 6. Nâng cấp trang tìm chuyến

## 6.1 Vấn đề cần giải quyết

Danh sách kết quả nếu chỉ hiển thị card cơ bản sẽ khiến người dùng khó so sánh giá, giờ đi, tiện ích và chính sách.

## 6.2 Layout desktop

- Thanh tóm tắt tìm kiếm cố định phía trên.
- Sidebar filter bên trái.
- Danh sách kết quả ở giữa.
- Sort và số lượng kết quả phía trên danh sách.

## 6.3 Bộ lọc

- Khoảng giá.
- Giờ khởi hành.
- Giờ đến.
- Nhà xe.
- Loại xe.
- Điểm đón/trả.
- Tiện ích.
- Đánh giá.
- Chính sách hủy.
- Ghế còn trống.

## 6.4 Trip card

Mỗi card cần có:

- Logo và tên nhà xe.
- Đánh giá, số lượt đánh giá.
- Giờ đi, giờ đến, thời lượng.
- Điểm đón/trả chính.
- Loại xe và tiện ích.
- Số ghế còn lại.
- Giá gốc, giá khuyến mãi.
- Nút xem chi tiết.
- Nút chọn chuyến.

## 6.5 Mobile

- Filter và sort mở bằng bottom sheet.
- Card xếp dọc.
- Thanh tóm tắt tìm kiếm có thể thu gọn.

## 6.6 Acceptance criteria

- Filter kết hợp nhiều điều kiện.
- URL lưu được tiêu chí tìm kiếm.
- Sort không làm mất filter.
- Có loading, empty và retry.
