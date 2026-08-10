# 22. Product Backlog ưu tiên

| ID | Công việc | Ưu tiên | Phụ thuộc |
|---|---|---:|---|
| WEB-001 | Hoàn thiện design tokens | P0 | Không |
| WEB-002 | Tạo UI component nền tảng | P0 | WEB-001 |
| WEB-003 | Chuẩn hóa router/layout | P0 | WEB-002 |
| WEB-004 | Nâng cấp Home search | P0 | WEB-002 |
| WEB-005 | Filter/sort tìm chuyến | P0 | WEB-002 |
| WEB-006 | Tạo Trip Detail | P0 | WEB-005 |
| WEB-007 | Nâng cấp Seat Map | P0 | WEB-006 |
| WEB-008 | Tạo Passenger feature | P0 | WEB-007 |
| WEB-009 | Nâng cấp Payment | P0 | WEB-008 |
| WEB-010 | Booking Confirmation + QR | P0 | WEB-009 |
| WEB-011 | My Bookings detail | P1 | WEB-010 |
| WEB-012 | Profile center | P1 | WEB-002 |
| WEB-013 | Notification center | P1 | WEB-002 |
| WEB-014 | Offers/voucher eligibility | P1 | WEB-009 |
| WEB-015 | Chuẩn hóa API service | P0 | Có backend contract |
| WEB-016 | TanStack Query | P1 | WEB-015 |
| WEB-017 | Test booking flow | P0 | WEB-010 |
| WEB-018 | Performance audit | P1 | Các trang chính xong |
| WEB-019 | Accessibility audit | P1 | Design system xong |
| WEB-020 | AI Assistant UI | P2 | AI endpoint |
