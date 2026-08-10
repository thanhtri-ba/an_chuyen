# 18. Kiến trúc frontend đề xuất

## 18.1 Cấu trúc

```text
src/
├── app/
│   ├── router/
│   ├── providers/
│   └── config/
├── design-system/
│   ├── tokens/
│   ├── components/
│   └── index.ts
├── features/
│   ├── auth/
│   ├── home/
│   ├── trip-search/
│   ├── trip-detail/
│   ├── seat-selection/
│   ├── passenger/
│   ├── payment/
│   ├── booking-confirmation/
│   ├── my-bookings/
│   ├── offers/
│   ├── notifications/
│   ├── profile/
│   └── ai-assistant/
├── services/
│   ├── auth.service.ts
│   ├── trip.service.ts
│   ├── booking.service.ts
│   ├── payment.service.ts
│   └── profile.service.ts
├── shared/
│   ├── api/
│   ├── components/
│   ├── hooks/
│   ├── types/
│   └── utils/
└── styles/
```

## 18.2 Quy tắc phụ thuộc

- Feature được phép dùng design-system và shared.
- Shared không phụ thuộc ngược vào feature.
- Service không import component.
- Page chịu trách nhiệm orchestration; UI component không tự điều hướng nếu không cần.

## 18.3 State management

- Server state: TanStack Query.
- Local UI state: React state hoặc reducer.
- Cross-feature state nhỏ: Context/Zustand nếu thực sự cần.
- Không đưa toàn bộ dữ liệu server vào global store.
