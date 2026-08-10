# 19. Tích hợp API

## 19.1 API client

`shared/api/apiClient.ts` nên chịu trách nhiệm:

- Base URL.
- Authorization header.
- Timeout.
- JSON parsing.
- Error normalization.
- Refresh token nếu hệ thống dùng.
- Trace ID nếu backend trả về.

## 19.2 Service theo domain

Mỗi service chỉ chứa lời gọi API và mapping DTO.

Ví dụ:

- `trip.service.ts`: search, detail, pickup/dropoff, seat map.
- `booking.service.ts`: create, detail, list, cancel.
- `payment.service.ts`: create payment, verify status.
- `profile.service.ts`: profile, saved passengers.

## 19.3 Kiểu dữ liệu

- Tách API DTO và UI model khi cần.
- Không dùng `any` cho response quan trọng.
- Chuẩn hóa lỗi thành một kiểu chung.
- Dữ liệu ngày giờ phải có timezone rõ ràng.
