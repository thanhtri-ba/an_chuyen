# 15. Tối ưu hiệu năng

## 15.1 Mục tiêu

- LCP dưới 2.5 giây trên kết nối di động tốt.
- CLS dưới 0.1.
- INP dưới 200ms.
- Bundle ban đầu chỉ chứa code cần thiết.

## 15.2 Giải pháp

- Route-based code splitting.
- Lazy load ảnh và gallery.
- WebP/AVIF cho ảnh banner.
- TanStack Query cho cache server state.
- Debounce search input.
- Memo hóa có chọn lọc.
- Virtual list nếu kết quả lớn.
- Prefetch trang Trip Detail khi hover.
- Không đưa `node_modules` và `dist` vào source ZIP/repository.

## 15.3 Đo lường

- Lighthouse.
- Web Vitals.
- Vite bundle visualizer.
- Performance tab.
- Theo dõi lỗi frontend bằng Sentry hoặc giải pháp tương đương.
