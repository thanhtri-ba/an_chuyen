# Context

Đã khảo sát toàn bộ project BusZ (monorepo: `web`, `admin, `backend`, 
). Phát hiện nhiều khoảng trống về hạ tầng, cấu hình, mock data còn sót và thiếu kiểm thử/tài liệu. Người dùng muốn một checklist chi tiết để giao cho cộng sự AI khác ("antigravity") tự thực hiện và commit — không phải Claude code trực tiếp trong phiên này. File plan này đóng vai trò là bản giao việc (handoff doc), không phải code.

# Mục tiêu

Viết một checklist đầy đủ, có ưu tiên rõ ràng, có đường dẫn file cụ thể, để antigravity đọc và triển khai từng mục độc lập.

# Checklist bàn giao cho antigravity

## Ưu tiên cao (chặn deploy / vỡ hạ tầng)

1. **Sửa `docker-compose.yml`**
   - Service `web-backend` trỏ tới `build: ./web-backend` nhưng thư mục không tồn tại. Sửa thành `./backend` (thư mục backend thật, Node/Express+Prisma).
   - `web` hiện không `depends_on` service backend thật — nối lại dependency đúng.
   - Thay credentials DB hardcode (`admin`/`password`) bằng biến môi trường từ `.env`, dùng `env_file` thay vì giá trị plaintext trong compose.

2. **Khôi phục/viết lại CI pipeline**
   - `.github/workflows/docker-ci.yml` đã bị xoá (git status: deleted, chưa thay thế).
   - Cần workflow tối thiểu: lint + build + chạy test backend (Jest hiện có ở `backend/src/__tests__`) trên mỗi PR.

3. **Bỏ hardcode API URL trong frontend**
   - `web/src/features/services/pages/TourPage.tsx`, `DeliveryPage.tsx`, `EventsPage.tsx` đang gọi cứng `http://localhost:3000/api/...`.
   - Chuyển sang biến môi trường (`VITE_API_BASE_URL` hoặc tương đương) đọc qua `web/src/shared/api/apiClient.ts` (đã có sẵn client, chỉ cần base URL cấu hình được).

4. **Bổ sung `.env.example` cho các app frontend**
   - Hiện chỉ có `backend/.env.example`. Cần thêm cho `web`, `admin-web`, `auth-web`, `sale-web` với biến API base URL, các key cần thiết khác.

## Ưu tiên trung bình (chất lượng, đúng đắn dữ liệu)

5. **Dọn mock data còn sót**
   - `mockTrips` fallback trong `web/src/features/trip-search/.../TripSearchPage.tsx` — thay bằng xử lý lỗi/loading state thật thay vì dữ liệu giả.
   - Giá tiền hardcode "Mock" trong `PaymentPage.tsx` — nối với pricing thật từ backend.
   - "Mock AI response" trong `web/src/shared/components/FloatingChat.tsx` — nối API AI thật (`backend/src/modules/ai`, `ai-advisor`) nếu đã sẵn sàng.

6. **Proxy geocoding qua backend**
   - `DeliveryMap.tsx`/`DeliveryPage.tsx` gọi trực tiếp Nominatim từ frontend. Chuyển thành route backend proxy (vd. `backend/src/modules/delivery`) để tránh rate-limit lộ ra client và kiểm soát được.

7. **Thêm validation schema cho backend**
   - `backend` chưa có thư viện validate (zod/yup/class-validator). Thêm zod (khuyến nghị, nhẹ, hợp TypeScript) và áp dụng cho các route nhận input người dùng (booking, delivery, event, tour...).

8. **Sentry DSN**
   - `backend/src/instrument.ts` fallback về DSN placeholder khi thiếu `SENTRY_DSN` → error tracking âm thầm không hoạt động. Cần fail-safe rõ ràng (log cảnh báo khi DSN thiếu) thay vì im lặng dùng placeholder.

## Ưu tiên thấp (tài liệu, test coverage)

9. **Viết test cho frontend `web`**
   - Hiện 0 file test trong `web/src`. Bắt đầu với các page có logic quan trọng: TourPage, DeliveryPage, EventsPage, PaymentPage (React Testing Library + Vitest/Jest tuỳ setup hiện có).

10. **Bổ sung tài liệu**
    - README gốc gần trống — viết hướng dẫn setup/run cho từng app trong monorepo.
    - Thêm OpenAPI/Swagger spec cho `backend` (chưa có API doc chính thức).
    - Đối chiếu `BusZ-Documentation/` với code hiện tại, cập nhật phần đã lỗi thời.

# Cách antigravity nên làm việc

- Xử lý theo từng mục độc lập, mỗi mục một commit/PR riêng để dễ review.
- Ưu tiên nhóm "Ưu tiên cao" trước vì ảnh hưởng trực tiếp tới khả năng deploy/chạy đúng của hệ thống.
- Với mỗi thay đổi hạ tầng (docker-compose, CI, env), test lại bằng cách chạy `docker-compose up` và kiểm tra các service lên đúng, gọi thử API qua frontend.

# Xác minh

- Sau khi sửa docker-compose: chạy `docker-compose config` để kiểm tra cú pháp, sau đó `docker-compose up --build` xem toàn bộ service (bao gồm `backend` thật) khởi động thành công.
- Sau khi đổi API URL sang env var: build từng frontend app với biến môi trường khác nhau (dev/staging) và xác nhận gọi đúng endpoint.
- Sau khi thêm CI: tạo PR thử để xác nhận workflow chạy lint/test/build thành công.
- Sau khi thêm validation: gửi request thiếu/sai field tới API, xác nhận trả về lỗi 400 rõ ràng thay vì lỗi 500 hoặc silent fail.
