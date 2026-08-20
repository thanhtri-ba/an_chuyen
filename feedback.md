Để tôi đọc sâu vào các trang và luồng nghiệp vụ thực tế.

Đây là toàn bộ vấn đề về **nghiệp vụ và giao diện** trong project:

---

## Luồng đặt vé bị gãy ở nhiều điểm

```
Trang chủ → Tìm chuyến → Chọn ghế → Xem lại → Thanh toán → Xác nhận
              ↓              ↓           ↓           ↓            ↓
           [1,2]           [3,4,5]     [6,7,8]    [9,10,11]   [12,13]
```

---

## 🔴 Gãy nghiệp vụ hoàn toàn

**[1] Popular routes trên trang chủ không điền sẵn tuyến đường**
Nhấn "Sài Gòn → Đà Lạt" → mở `/search` trống rỗng. Người dùng phải tự gõ lại.

**[2] Bộ lọc giờ khởi hành bị sai logic**
Lọc "Buổi sáng 06:00–12:00" thực ra trả về tất cả chuyến từ 00:00–12:00. Các khung giờ bị chồng lấp, không phân biệt được.

**[3] Điểm đón / điểm trả luôn hiển thị "Chưa chọn"**
`SeatSelectionPage` lưu `pickupPoint` (ID) vào sessionStorage. `BookingReviewPage` đọc `pickupLabel` (key không tồn tại). Kết quả: màn hình xem lại **luôn luôn** hiển thị "Chưa chọn điểm đón / điểm trả" dù người dùng đã chọn.

**[4] Phí bảo hiểm hiển thị "NaN đ"**
`SeatSelectionPage` lưu key `insuranceFee`. `PaymentPage` đọc key `insurancePrice`. Hai key khác nhau → luôn ra `NaN`.

**[5] Không có giữ ghế thực sự**
Đồng hồ đếm ngược 10 phút chỉ là UI trang trí. Backend không hold ghế trong DB — hai người dùng có thể chọn cùng ghế cùng lúc, xung đột chỉ phát hiện khi bấm thanh toán.

**[6] Ghi chú của khách bị bỏ qua hoàn toàn**
Ô "Ghi chú" trên `BookingReviewPage` không có `value` / `onChange` → người dùng gõ gì cũng không được lưu, không gửi lên backend.

**[7] Chọn phương thức thanh toán 2 lần**
`BookingReviewPage` có radio chọn "QR / Thẻ". `PaymentPage` lại có 5 lựa chọn khác. Lựa chọn ở trang 1 không được đọc ở trang 2 → trải nghiệm rối loạn.

**[8] Mã giảm giá hoạt động theo 2 cơ chế song song**
- `BookingReviewPage`: gọi API `/vouchers/validate` thật
- `PaymentPage`: so sánh chuỗi `if code === 'BUSZVIP'` hardcode

Nếu dùng voucher ở cả hai trang → giảm giá bị tính 2 lần.

**[9] Nút "Quay lại" trên trang thanh toán dẫn đến trang 404**
Link trỏ về `/seat-selection` (không có `:tripScheduleId`) — route này không tồn tại trong App.tsx.

**[10] Không có giao diện hủy vé**
Backend có đủ trạng thái `CANCELLED`, `REFUNDING`, `REFUNDED` và chính sách hoàn tiền được hiển thị trong modal — nhưng không có nút "Hủy vé" ở bất cứ đâu trong app.

**[11] Demo mock trong production backend**
`BookingService` có đoạn code tự động tạo ghế nếu không tìm thấy trong DB:
```ts
// DEMO MOCK: Nếu DB thiếu ghế, tự động tạo ghế để luồng chạy mượt
```
Nghĩa là bất kỳ seat ID nào cũng có thể đặt thành công, bỏ qua toàn bộ logic kiểm tra ghế.

---

## 🟠 Tính năng hiển thị nhưng không hoạt động

| Vị trí | Thứ gì | Trạng thái thật |
|--------|--------|-----------------|
| Trang chủ | Nút "Mua" trong cửa hàng (gối, bình nước...) | Không có onClick |
| Trang chủ | Nút "Xem tất cả" cửa hàng | Không có onClick |
| AuthPage | "Đăng nhập với Google" | Không có onClick, chưa tích hợp |
| AuthPage | "Quên mật khẩu?" | Trỏ `href="#"`, không có flow |
| PaymentPage | Mã QR (VietQR, VNPay, MoMo) | Icon tĩnh, không phải QR thật |
| PaymentPage | Thanh toán thẻ | Không có gateway, điền gì cũng pass |
| PaymentPage | Ví "LunaTravel Business Pay" | Luôn hiển thị số dư 0đ |
| BookingConfirmationPage | Nút "Tải vé PDF" | Không có onClick |
| BookingConfirmationPage | Nút "Chia sẻ hóa đơn" | Không có onClick |
| BookingConfirmationPage | QR trên vé | CSS giả, không scan được |
| MyBookingsPage | Nút "Tải vé" | Không có onClick |
| MyBookingsPage | Nút "Chi tiết" | Không có onClick |
| TripDetailModal | Đánh giá, hình ảnh, lịch trình | Tất cả hardcode, không từ API |

---

## 🟡 Giao diện không nhất quán

**Vỡ visual giữa hai nửa luồng:**
- `Trang chủ / Tìm chuyến / Chọn ghế` → dark luxury, nền đen, font Cormorant
- `Xem lại / Thanh toán / Xác nhận` → light gray, nền trắng, Tailwind generic

Người dùng cảm giác như đang dùng 2 app khác nhau đúng ở bước quan trọng nhất.

**Ngày ký trên vé bị hardcode:**
```
Ngày ký: 20/11/2026  ← cố định, không bao giờ thay đổi
```

**Giờ khởi hành trên vé xác nhận hiển thị sai:**
Lấy `booking.createdAt` (giờ tạo đơn) thay vì giờ khởi hành thực của chuyến xe.

**Component 3D bus (`BusModel3D.tsx`) được build hoàn chỉnh nhưng không được dùng ở đâu** — tốn bundle size, không đóng góp gì cho UX.

---

## Tóm tắt ưu tiên sửa

**Sửa ngay để luồng chạy được:**
1. `pickupLabel`/`dropoffLabel` — fix key mismatch (mục 3)
2. `insuranceFee` vs `insurancePrice` — fix key mismatch (mục 4)
3. Nút back trên PaymentPage → `/seat-selection/:id` (mục 9)
4. Ghi chú không có state binding (mục 6)

**Sửa để nghiệp vụ đúng:**
5. Popular routes điền sẵn tuyến (mục 1)
6. Bộ lọc giờ fix range logic (mục 2)
7. Bỏ voucher hardcode, thống nhất một cơ chế (mục 8)
8. Thêm nút hủy vé (mục 10)
9. Xóa demo mock trong BookingService (mục 11)

**Sửa để UX hoàn thiện:**
10. Thống nhất dark/light theme xuyên suốt luồng
11. Nút tải PDF, chia sẻ, chi tiết booking

Bạn muốn tôi bắt đầu sửa từ nhóm nào?