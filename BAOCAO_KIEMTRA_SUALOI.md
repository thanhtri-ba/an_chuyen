# Báo Cáo Kiểm Tra & Sửa Lỗi Hệ Thống BusZ (An Chuyến)

**Ngày báo cáo:** 12/08/2026
**Phạm vi:** Backend (Express/Prisma) + Web khách hàng (React) — kiểm tra bằng cách đóng vai người dùng thật thực hiện luồng tìm chuyến → chọn ghế → đặt vé → thanh toán.

---

## 1. Lỗi Bảo Mật Nghiêm Trọng

### 1.1. Auth bypass — tự động đăng nhập không cần token
- **Vị trí:** `backend/src/middleware/auth.middleware.ts`
- **Vấn đề:** Khi request không có token hoặc token sai, middleware tự động lấy user đầu tiên trong database và coi như đã đăng nhập. Điều kiện chặn chỉ là `NODE_ENV === 'test'` — nghĩa là ở **mọi môi trường khác (kể cả production nếu quên set biến môi trường)**, cơ chế bypass này vẫn hoạt động.
- **Đã sửa:** Yêu cầu bật rõ ràng cả `NODE_ENV=development` **và** `ALLOW_DEV_AUTH_FALLBACK=true` mới kích hoạt fallback. Mặc định các request không có token hợp lệ sẽ bị từ chối (401).

### 1.2. JWT secret hardcode trong code
- **Vị trí:** `backend/src/middleware/auth.middleware.ts`
- **Vấn đề:** `process.env.JWT_SECRET || 'busz_super_secret_jwt_key_2026'` — nếu quên cấu hình biến môi trường, hệ thống dùng secret công khai ngay trong source code.
- **Đã sửa:** Bỏ giá trị mặc định; thiếu `JWT_SECRET` sẽ trả lỗi 500 rõ ràng thay vì âm thầm dùng secret yếu.

### 1.3. Rò rỉ stack trace qua API
- **Vị trí:** `backend/src/middleware/error.middleware.ts`
- **Vấn đề:** Mọi lỗi 500 đều trả `stack` trace đầy đủ trong response JSON, kể cả ở production — lộ đường dẫn file, cấu trúc code cho client.
- **Đã sửa:** Chỉ trả `stack` khi `NODE_ENV !== 'production'`.

---

## 2. Lỗi Database (chặn toàn bộ tính năng liên quan đến chuyến xe)

### 2.1. Lệch tên bảng (schema drift)
- **Vấn đề:** Database Supabase thật có **19 bảng** tồn tại dưới dạng PascalCase (`User`, `Booking`, `Payment`, `Route`, `Seat`, `TripSchedule`, `Voucher`, `Province`, `Contact`, `Facility`, `Review`, `Passenger`, `SeatBooking`, `SeatType`, `TripPrice`, `BusFacility`, `BusImage`, `CancellationPolicy`, `Checkpoint`) trong khi Prisma schema hiện tại map sang tên snake_case (`users`, `bookings`, `trip_schedules`...). Hậu quả: **API `/api/trips`, trang chủ, trang tìm chuyến đều lỗi 500** vì bảng "đúng tên" theo code không tồn tại.
- **Đã sửa:** Đổi tên toàn bộ 19 bảng sang đúng snake_case khớp Prisma schema (chỉ RENAME, không mất dữ liệu).

### 2.2. Thiếu bảng
- **Vấn đề:** 3 bảng Prisma cần nhưng không tồn tại dưới bất kỳ tên nào: `device_sessions`, `wallet_transactions`, `booking_timelines`.
- **Đã sửa:** Tạo mới 3 bảng này (chỉ CREATE, không đụng dữ liệu cũ).

### 2.3. Lưu ý quan trọng chưa xử lý
- `schema.prisma` hiện **thiếu hẳn nhiều model** so với dữ liệu thật đang có trong DB: `events`, các bảng chat AI (`ai_conversations`, `ai_messages`, `ai_feedback`, `ai_tool_logs`), `tour_reviews`, `tour_itineraries`, `user_addresses`, `favorite_routes`, `delivery_drivers`, `RefundPolicy`, `Documentation`.
- Nếu sau này chạy `prisma db push` hoặc `migrate deploy` mà không rà soát kỹ, **các bảng này có nguy cơ bị xoá** vì không khớp với schema. Cần bổ sung các model còn thiếu vào `schema.prisma` trước khi chạy bất kỳ lệnh đồng bộ schema tự động nào.

---

## 3. Lỗi Logic & Tính Tiền (ảnh hưởng trực tiếp doanh thu)

### 3.1. Giá vé hiển thị sai ở bước xác nhận đặt vé
- **Vị trí:** `web/src/features/booking-review/pages/BookingReviewPage.tsx`
- **Vấn đề:** `const basePrice = seats.length * 350000;` — hardcode cứng 350.000đ/ghế, bỏ qua giá thật của từng chuyến xe (vd. chuyến Sài Gòn → Vũng Tàu giá thật chỉ 90.000đ nhưng hệ thống hiển thị 350.000đ).
- **Đã sửa:** Dùng lại `seatsTotal` — tổng giá ghế thật đã được tính đúng từ trang chọn ghế.

### 3.2. Thay đổi giá ở bước review bị mất khi qua thanh toán
- **Vị trí:** `BookingReviewPage.tsx` → `PaymentPage.tsx`
- **Vấn đề:** Khi áp mã giảm giá hoặc bật/tắt bảo hiểm ở trang xác nhận, hệ thống tính ra `finalTotalAmount` mới nhưng lưu vào `localStorage` dưới field không được `PaymentPage` đọc tới — trang thanh toán vẫn dùng giá **cũ** từ bước chọn ghế.
- **Đã sửa:** Đồng bộ đúng field `totalAmount` khi lưu lại dữ liệu đặt vé.

### 3.3. Sơ đồ ghế trống không hiển thị ghế nào
- **Vị trí:** `web/src/features/seat-selection/pages/SeatSelectionPage.tsx`
- **Vấn đề:** Code chỉ hiểu ID ghế định dạng mới `T{tầng}-{hàng}{cột}` (vd `T1-1A`). Một số chuyến có dữ liệu ghế seed sẵn theo định dạng cũ (`A1`, `A2`...) → không ghế nào khớp điều kiện hiển thị, khách hàng thấy sơ đồ ghế **hoàn toàn trống** dù API trả về ghế trống thật.
- **Đã sửa:** Thêm logic tự nhận diện định dạng ID và fallback sang cách hiển thị theo vị trí tuần tự nếu không khớp định dạng chuẩn.

### 3.4. Bug giá vé VIP không bao giờ kích hoạt
- **Vị trí:** `backend/src/modules/seat/seat.service.ts`
- **Vấn đề:** Hàm `isVipSeat()` kiểm tra `seatNumber.startsWith('1' | '2')`, nhưng số ghế thật luôn bắt đầu bằng `T` (vd `T1-1A`) → điều kiện không bao giờ đúng, ghế VIP luôn bị tính giá ECONOMY.
- **Đã sửa:** Parse đúng số hàng ghế từ định dạng thật.

---

## 4. Lỗi Giao Diện

### 4.1. Component `Card` dùng chung bị lỗi cú pháp — ảnh hưởng toàn site
- **Vị trí:** `web/src/design-system/components/Card.tsx`
- **Vấn đề:** `className={cn("] border bg-card text-card-foreground shadow-sm", className)}` — ký tự `]` thừa (thiếu mất `rounded-lg`), khiến **mọi trang dùng `<Card>`** (chọn ghế, xác nhận đặt vé, thanh toán, hồ sơ...) bị style vỡ nhẹ.
- **Đã sửa:** Sửa lại đúng `rounded-lg border bg-card text-card-foreground shadow-sm`.

### 4.2. Typo tương tự trong thanh tìm kiếm trang chủ
- **Vị trí:** `web/src/features/home/pages/HomePage.tsx`
- **Vấn đề:** 4 chỗ className dính ký tự `]` thừa tương tự.
- **Đã sửa:** Dọn lại thành `rounded-xl`.

---

## 5. Vấn Đề Đã Ghi Nhận, Chưa Xử Lý (ưu tiên thấp hơn)

- **Route/điểm đón-trả/tên tài xế bị hardcode:** Các trang `SeatSelectionPage`, `BookingReviewPage`, `PaymentPage` hiển thị cứng "Sài Gòn - Đà Lạt" và các điểm đón/trả cố định, **không phản ánh đúng chuyến xe khách hàng thực sự chọn**. Đã bổ sung sẵn API `GET /api/trip-schedules/:id` (trả về route, giờ giấc, nhà xe, checkpoint thật) để nối vào các trang này ở bước tiếp theo — nhưng **chưa nối xong**, chỉ mới có backend.
- Bus quảng cáo "22 Giường VIP" nhưng dữ liệu seed chỉ có 6 ghế cho chuyến test — vấn đề dữ liệu mẫu, không phải lỗi code.
- Rà soát giao diện (redesign) đã thử nghiệm 2 hướng ("Vé Giấy" và "Purple Bus") theo yêu cầu, nhưng đã được **hoàn tác về bản gốc** theo yêu cầu cuối của người dùng — chưa chốt hướng thiết kế mới.

---

## 6. Xác Minh

- `npx tsc --noEmit` sạch lỗi cho cả `backend` và `web` sau tất cả các thay đổi.
- Đã test thủ công toàn bộ luồng: tìm chuyến (ngày có dữ liệu thật) → chọn ghế A1 → điền thông tin hành khách → xác nhận đặt vé (giá đúng 90.000đ, khớp giá chuyến thật) → thanh toán (tổng tiền khớp, đúng luồng) → gọi API tạo booking trả về 401 đúng như kỳ vọng vì chưa đăng nhập (xác nhận cơ chế bảo mật hoạt động đúng sau khi vá lỗ hổng auth bypass).
