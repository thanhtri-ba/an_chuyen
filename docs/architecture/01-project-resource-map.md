# 01 — Project / Resource Map

Cây thư mục thật (chỉ giữ phần có vai trò kiến trúc; file lẻ tẻ ở gốc `backend/` như `scratch_*.ts`, `check_*.js`, `test-*.ts` bị lược bớt — xem ghi chú cuối).

```text
an_chuyen/
├── backend/                        Express + Prisma API — 1 service duy nhất, cổng 3000
│   ├── src/
│   │   ├── index.ts                 wiring app: middleware, mount tất cả router, /health, /api/trips /api/promotions /api/reviews /api/stations /api/configs
│   │   ├── auth.routes.ts           /api/auth — register/login/google/forgot-reset-password/profile
│   │   ├── admin.routes.ts          /api/admin — requireAdmin, createCrudRouter (24 resource), route tuỳ biến (invite-user, generate-seats, wallet/topup, stats, analytics, support chat)
│   │   ├── core/
│   │   │   ├── prisma.ts             PrismaClient singleton
│   │   │   ├── cache.ts              NodeCache + AsyncLock (KHÔNG phải Redis)
│   │   │   ├── socket.ts             Socket.IO — location tracking
│   │   │   ├── audit.ts, async-context.ts, redaction.ts, logger.ts, supabase.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts    verifyAccessToken, optionalAuth (JWT + Supabase fallback)
│   │   │   ├── admin.middleware.ts   requireAdmin (role === 'admin')
│   │   │   ├── app-only.middleware.ts, error.middleware.ts, logging.middleware.ts, request-context.middleware.ts
│   │   └── modules/                  14 domain module (routes [+ service/controller nếu có])
│   │       ├── booking/  booking.routes.ts, booking.service.ts (BookingService), booking.controller.ts
│   │       ├── seat/     seat.routes.ts, seat.service.ts (SeatService), seat.controller.ts
│   │       ├── payment/  payment.routes.ts + payment.service.ts (PaymentService) + payment.dto.ts
│   │       │             vnpay.routes.ts/vnpay.util.ts, momo.routes.ts/momo.util.ts,
│   │       │             bank-transfer.routes.ts (SePay/Casso webhook), mock-gateway.routes.ts, confirm.util.ts
│   │       ├── wallet/   wallet.routes.ts, wallet.service.ts, wallet.controller.ts (WalletController)
│   │       ├── loyalty/  loyalty.routes.ts, loyalty.service.ts, loyalty.controller.ts (LoyaltyController)
│   │       ├── ai/       ai.routes.ts, ai.service.ts (Ollama), ai.prompt.ts, ai.tools.ts, ai.controller.ts
│   │       ├── tour/, destination/, hotel/, rental/, delivery/, banner/, hero/, contact/, event/
│   │       │             mỗi module: 1 file `<name>.routes.ts` — CRUD trực tiếp trong route, chưa tách service
│   │   └── __tests__/, load-test/
│   ├── prisma/
│   │   ├── schema.prisma             49 model, 7 enum (xem 05-database-map.md)
│   │   ├── migrations/
│   │   └── seed*.ts / seed*.js       nhiều biến thể seed (bookings, extra, production, delivery, events, 100-users)
│   ├── Dockerfile, render.yaml, railway.toml
│   └── (rác cần dọn) scratch_*.ts, check_*.js, test-*.ts nằm ở gốc backend/ thay vì __tests__/scripts/
│
├── web/                             Ứng dụng khách hàng — React 18 + Vite + React Router (BrowserRouter)
│   ├── src/App.tsx                   khai báo toàn bộ route (36 route, lazy-loaded)
│   ├── src/main.tsx
│   ├── src/lib/api.ts                axios instance — baseURL VITE_API_URL, interceptor gắn Bearer token (sessionStorage 'busz_token'), tự redirect /auth khi 401
│   ├── src/shared/api/apiClient.ts   client API thứ 2 (song song với lib/api.ts — xem 03/04 để biết cái nào thật sự dùng ở đâu)
│   ├── src/contexts/AuthContext.tsx  trạng thái đăng nhập toàn app
│   ├── src/i18n.ts, src/locales/     đa ngôn ngữ
│   ├── src/design-system/            mới khởi tạo — components/ gần trống
│   └── src/features/                 18 feature folder (xem 02-frontend-map.md)
│
├── admin/                            Dashboard vận hành — React 18 + Vite + React Router ("studio-admin")
│   ├── src/App.tsx                   route thật (import thủ công từ app/(main)/dashboard/*)
│   ├── src/app/(main)/dashboard/*    24 trang CRUD khớp gần như 1-1 với admin.routes.ts
│   ├── src/app/(main)/chat/          giao diện chat hỗ trợ khách (khớp admin.routes.ts /support/conversations)
│   ├── src/app/(main)/auth/v2/       login/register admin
│   ├── src/lib/api.ts                fetch client riêng — token 'admin_token' trong localStorage
│   ├── next.config.mjs, index.html   [UNUSED] — package.json "dev": "vite", app không chạy bằng Next.js
│   └── biome.json, .husky/pre-commit lint/format thay ESLint + git hook
│
├── design/                           KHÔNG phải app — tài liệu design system (DESIGN_SYSTEM.md, ART_DIRECTION.md, decisions/)
├── docker-compose.yml                3 service: backend (3000), web (5173), admin (5174→5173), db (placeholder — dùng Supabase cloud, không chạy Postgres local)
└── test-api-flow.sh                  script test thủ công luồng API bằng curl
```

## Ghi chú "resource được code sử dụng nhưng không thấy trong repo"

- `docker-compose.yml` có service `db` là `busybox` chỉ để echo log — **không có Postgres thật trong compose**, toàn bộ dữ liệu trỏ ra Supabase cloud qua `DATABASE_URL`/`DIRECT_URL`. `[MISSING]` nếu ai đó mong đợi chạy hoàn toàn offline bằng riêng docker-compose.
- `backend/.env.example` là nguồn duy nhất liệt kê biến môi trường thật cần có (JWT_SECRET, DATABASE_URL, VNPAY_*, MOMO_*, BANK_ACCOUNT_*, SEPAY_API_KEY, CASSO_WEBHOOK_TOKEN, OLLAMA_BASE_URL...).
