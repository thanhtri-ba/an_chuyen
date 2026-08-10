# BusZ Web Upgrade Documentation

Bộ tài liệu này mô tả kế hoạch nâng cấp website BusZ từ phiên bản MVP hiện tại thành nền tảng đặt vé xe khách hiện đại, có kiến trúc frontend rõ ràng, giao diện cao cấp và sẵn sàng tích hợp backend thực tế.

## Hiện trạng source đã khảo sát

- React + TypeScript + Vite.
- Kiến trúc theo feature.
- Các feature hiện có: `auth`, `home`, `trip-search`, `seat-selection`, `payment`, `booking-confirmation`, `my-bookings`, `offers`, `notifications`, `profile`.
- Thành phần dùng chung hiện có: `Header`, `Footer`, `apiClient`, utility `cn`.
- Các thư mục `app`, `design-system`, `services`, `styles` còn trống hoặc chưa hoàn thiện.

## Mục tiêu chính

1. Hoàn thiện design system dùng chung.
2. Chuẩn hóa kiến trúc frontend và lớp gọi API.
3. Nâng cấp luồng tìm chuyến, xem chi tiết, chọn ghế, nhập hành khách, thanh toán và quản lý vé.
4. Bổ sung trạng thái loading, empty, error và responsive.
5. Chuẩn bị nền tảng tích hợp AI Advisor, wallet, loyalty và admin trong tương lai.

## Thứ tự đọc

1. `docs/01_Project_Overview/ProjectOverview.md`
2. `docs/01_Project_Overview/CurrentSystemAssessment.md`
3. `docs/08_Roadmap/ImplementationRoadmap.md`
4. Các tài liệu UI/UX theo từng màn hình.
5. Kiến trúc, hiệu năng, SEO và AI.
