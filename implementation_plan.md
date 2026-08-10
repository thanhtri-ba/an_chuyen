# Kế Hoạch Tích Hợp Backend (Thay Thế Dữ Liệu Ảo)

Yêu cầu của bạn là kết nối giao diện web với backend để sử dụng dữ liệu thực tế thay vì dữ liệu mô phỏng (mock data). Dưới đây là phân tích chi tiết về những dữ liệu đang là "ảo" (mock) trên Frontend và các API tương ứng ở Backend đã có sẵn để thay thế:

## 1. Dữ Liệu Ảo (Mock Data) Đang Dùng & Giải Pháp

### Trang Chủ (HomePage)
- **Danh sách điểm đến phổ biến (Popular Destinations):** Đang dùng biến `POPULAR_DESTINATIONS` tĩnh.
  - *Giải pháp:* Lọc từ danh sách chuyến đi thực tế.
- **Đánh giá của khách hàng (Reviews):** Đang dùng `DEFAULT_REVIEWS`.
  - *Giải pháp:* Sử dụng endpoint có sẵn: `GET /api/reviews`.
- **Chương trình khuyến mãi (Promotions/Flash Sale):** Đang tĩnh.
  - *Giải pháp:* Sử dụng endpoint có sẵn: `GET /api/promotions`.

### Trang Tìm Chuyến (Trip Search)
- **Danh sách chuyến xe (Trips):** Hiện tại đang hardcode hoặc tạo tự động ở Frontend.
  - *Giải pháp:* Sử dụng endpoint có sẵn: `GET /api/trips?origin=...&destination=...`.

### Trang Chọn Ghế (Seat Selection)
- **Sơ đồ ghế ngồi (Seat Map):** Đang dùng vòng lặp tạo ghế ngẫu nhiên (mock trạng thái 'available', 'occupied').
  - *Giải pháp:* Cần gọi API để lấy trạng thái thật của từng ghế trên chuyến xe đó.

### Trang Thanh Toán (Payment)
- **Tổng tiền & Điểm thưởng:** Đang fix cứng tổng tiền `370.000đ`.
  - *Giải pháp:* Tính toán dựa trên số lượng ghế được chọn thật và số điểm từ User Profile (`GET /api/auth/me`).

> [!WARNING]
> **Tình trạng Backend:** Backend Node.js (Express) ở thư mục `d:\An_Chuyen\backend` đã có sẵn các endpoint như `/api/trips`, `/api/reviews`, `/api/promotions`.

## 2. Kế hoạch triển khai (Implementation Plan)

- **Bước 1:** Đảm bảo Backend server đang chạy.
- **Bước 2:** Cập nhật `HomePage.tsx` để fetch dữ liệu từ `api.get('/api/reviews')`, `api.get('/api/promotions')`.
- **Bước 3:** Cập nhật `TripSearchPage.tsx` để gọi `api.get('/api/trips')`.
- **Bước 4:** Cập nhật `SeatSelectionPage.tsx` để load trạng thái ghế thật.

> [!IMPORTANT]
> **Yêu cầu phản hồi (User Review Required)**
> Quá trình thay máu toàn bộ dữ liệu mock này sẽ làm thay đổi hiển thị thực tế (do dữ liệu thật trong Database có thể khác dữ liệu mẫu). Bạn có muốn tôi bắt đầu thay thế dữ liệu từ **Trang Chủ** trước, hay muốn tập trung vào **Trang Tìm Chuyến** trước? Vui lòng bấm **Proceed** và nhắn lại ưu tiên của bạn!
