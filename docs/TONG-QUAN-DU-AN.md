# An Chuyến — Tài liệu tổng quan dự án

> File này là **điểm vào duy nhất**: đọc từ đây, đi sâu theo link tới `docs/architecture/*.md` (14 file, đã rút trực tiếp từ code, có sơ đồ Mermaid). Không có nội dung nào ở đây suy đoán — mọi thứ trỏ về file thật trong repo. Cập nhật lần cuối theo commit `931302a` (OTP + device session), 2026-09-07.

## 1. Dự án là gì

**An Chuyến** — nền tảng đặt vé xe khách trực tuyến (giống Vexere/FUTA) cho thị trường Việt Nam, gồm 3 ứng dụng:

| App | Vai trò | Người dùng |
|---|---|---|
| `web/` | Trang khách hàng — tìm chuyến, chọn ghế, thanh toán, quản lý vé | Khách vãng lai + khách có tài khoản |
| `admin/` | Dashboard vận hành nội bộ | Nhân viên/Admin nhà xe |
| `backend/` | API duy nhất phục vụ cả 2 app trên | — |

Ngoài ra: `design/` (tài liệu design system, không phải code chạy), `docs/` (chính bộ tài liệu này).

## 2. Công nghệ (đã xác minh trong code, không phải README lý thuyết)

| Lớp | Thật sự dùng |
|---|---|
| Backend | Node.js + Express, TypeScript, 1 service duy nhất cổng 3000 |
| ORM/DB | Prisma → PostgreSQL (Supabase cloud, **không có Postgres container local**) |
| Cache | `NodeCache` in-memory (`core/cache.ts`) — **không phải Redis** dù từng nhắc trong tài liệu cũ |
| Realtime | Socket.IO — nhưng **chỉ có backend, chưa có frontend nào kết nối tới** (xem [10-realtime-flow.md](architecture/10-realtime-flow.md)) |
| Auth khách (web) | JWT (`jsonwebtoken`) + Supabase Auth fallback + Google OAuth + **OTP qua email (Resend) cho đăng ký/thiết bị mới** (mới, xem [14-identity-otp-flow.md](architecture/14-identity-otp-flow.md)) |
| Auth admin | JWT thuần, lưu `localStorage['admin_token']` — **độc lập hoàn toàn** với phiên web, không dùng OTP/device-session |
| Email | Resend (`EMAIL_PROVIDER=resend`) — dùng cho OTP, xác nhận đơn hàng, vé điện tử. **Quên mật khẩu chưa gửi mail thật** |
| Thanh toán | VNPay, MoMo, Ví nội bộ, Chuyển khoản VietQR (đối soát qua webhook SePay/Casso), COD/Mock (duyệt tay) |
| AI | Ollama (LLM local) cho chat hỗ trợ — **không phải Gemini** dù biến môi trường `GEMINI_MODEL` có tồn tại (không được code đọc) |
| Frontend `web/` | React 18 + Vite + React Router (BrowserRouter), không Redux/Zustand — chỉ 1 Context (`AuthContext`) |
| Frontend `admin/` | React 18 + Vite + React Router, thư mục đặt tên kiểu Next.js (`app/(main)/...`) nhưng **chạy bằng Vite, không phải Next.js thật** |
| Test | Jest (chỉ backend, 4 file test — booking, seat, admin auth, async-context). **web/ và admin/ chưa có test tự động** |

## 3. Cấu trúc thư mục — xem chi tiết đầy đủ tại [01-project-resource-map.md](architecture/01-project-resource-map.md)

```
an_chuyen/
├── backend/     Express API — routes, modules (14 domain), Prisma schema (49 model, 7 enum)
├── web/         App khách hàng — 36+ route, lazy-loaded, 18 feature folder
├── admin/       Dashboard nội bộ — 24 trang CRUD khớp admin.routes.ts
├── design/      Tài liệu design system (không phải code)
├── docs/        Bộ tài liệu này
├── docker-compose.yml, test-api-flow.sh
```

## 4. Bản đồ tài liệu chi tiết (`docs/architecture/`)

| # | File | Nội dung |
|---|---|---|
| 00 | [master-system-map](architecture/00-master-system-map.md) | Sơ đồ tổng toàn hệ thống + bảng "thật vs không thật" |
| 01 | [project-resource-map](architecture/01-project-resource-map.md) | Cây thư mục thật, vai trò từng phần |
| 02 | [frontend-map](architecture/02-frontend-map.md) | Kiến trúc `web/` — route, API client, state |
| 03 | [backend-map](architecture/03-backend-map.md) | Middleware chain, controller/service, cron nền |
| 04 | [api-map](architecture/04-api-map.md) | Toàn bộ endpoint thật (cần đọc thêm 14 để có `/api/identity`) |
| 05 | [database-map](architecture/05-database-map.md) | ERD, 49 model, enum thật |
| 06 | [booking-flow](architecture/06-booking-flow.md) | State machine đặt vé, transaction 8 bước |
| 07 | [seat-concurrency](architecture/07-seat-concurrency.md) | Chống trùng ghế (optimistic update, không Redis) |
| 08 | [payment-flow](architecture/08-payment-flow.md) | 5 phương thức thanh toán, điểm hội tụ `confirm.util.ts` |
| 09 | [admin-flow](architecture/09-admin-flow.md) | Trang admin ↔ endpoint thật |
| 10 | [realtime-flow](architecture/10-realtime-flow.md) | Socket.IO — GPS xe, chưa có consumer |
| 11 | [error-edge-cases](architecture/11-error-edge-cases.md) | Bản đồ lỗi ↔ HTTP status, các lỗ hổng đã biết |
| 12 | [user-journey](architecture/12-user-journey.md) | Sequence diagram đầy đủ 1 lượt mua vé |
| 13 | [admin-journey](architecture/13-admin-journey.md) | Sequence diagram vận hành của admin |
| 14 | [identity-otp-flow](architecture/14-identity-otp-flow.md) | **Mới** — OTP đăng ký, OTP thiết bị mới, guest booking, email |
| — | [REDESIGN-PLAN](architecture/REDESIGN-PLAN.md) | Kế hoạch redesign trước đó (lịch sử quyết định) |

## 5. Danh sách API tóm tắt (chi tiết đầy đủ ở file 04 + 14)

- **Public không auth**: `/health`, `/api/trips`, `/api/promotions`, `/api/reviews`, `/api/stations`, `/api/configs`
- **`/api/auth`**: register (nay bắt buộc OTP), login (có thể yêu cầu OTP nếu thiết bị lạ), `login/verify-otp` (mới), google, forgot/reset-password, profile
- **`/api/identity`** (mới): `otp/request`, `otp/request-registration`, `otp/request-admin`, `otp/verify`, `lookup-order`, `session`, `logout`
- **`/api/bookings`**: create (transaction 8 bước, tự tính tiền), list, cancel
- **`/api/trip-schedules`**: chi tiết chuyến, seat map, hold/release ghế (10 phút)
- **`/api/payments`, `/api/vnpay`, `/api/momo`, `/api/mock-payment`, `/api/bank-transfer`**: 5 cổng thanh toán, hội tụ tại `confirm.util.ts`
- **`/api/loyalty`, `/api/wallet`**: điểm thưởng, ví nội bộ
- **`/api/ai`**: chat hỗ trợ (Ollama, không cần đăng nhập)
- **Nội dung tĩnh**: `/api/tours`, `/api/destinations`, `/api/hotels`, `/api/rentals`, `/api/deliveries`, `/api/banners`, `/api/hero-slides`, `/api/events`, `/api/contacts`
- **`/api/admin`**: 24 resource CRUD generic + route tuỳ biến (invite-user, generate-seats, assign nhân sự, wallet topup, stats/analytics, chat hỗ trợ)

## 6. Database — tóm tắt (đầy đủ ở file 05 + 14)

49 model qua Prisma/PostgreSQL. Nhóm chính: Người dùng & phiên (`User`, `Profile`, `DeviceSession` mới, `PasswordResetToken`, `EmailOtp` mới), Ví & thanh toán, Ưu đãi, Địa lý & tuyến, Đội xe & nhân sự, Chuyến đi, Đặt vé, Nội dung trang khách, Dịch vụ khác (thuê xe/giao hàng/tour), Hỗ trợ khách hàng.

7 enum: `Gender`, `BookingStatus`, `PaymentStatus`, `SeatStatus`, `SeatClass`, `ParcelStatus`, `TransactionType` — lưu ý `BookingStatus.DRAFT/COMPLETED/REFUNDING` tồn tại trong schema nhưng **chưa có code nào gán** (xem file 06).

## 7. Triển khai / Deployment

| Thành phần | Cấu hình | Ghi chú |
|---|---|---|
| `docker-compose.yml` | 3 service: `backend` (3000), `web` (5173), `admin` (5174→5173) | `db` chỉ là `busybox` placeholder — **không chạy Postgres local**, luôn trỏ ra Supabase cloud |
| `backend/render.yaml` | Deploy backend lên Render, healthcheck `/health`, chạy `prisma migrate deploy` trước `npm start` | **Chưa khai báo biến `EMAIL_*`/`OTP_*`** cho tính năng OTP mới → cần bổ sung trước khi deploy production |
| `backend/railway.toml` | Deploy thay thế qua Railway (Nixpacks) | Không khai báo env vars riêng |
| `backend/Dockerfile` | node:22-alpine, `EXPOSE 4001` | ⚠️ lệch với cổng thật app lắng nghe (3000) — cần soát lại nếu build image này để chạy độc lập |
| `web/Dockerfile`, `admin/Dockerfile` | node:20-alpine, build Vite rồi `serve -s dist -l 5173` | |

### Biến môi trường cần có (theo `.env.example` từng app — nguồn duy nhất đáng tin)

- **backend** (đầy đủ nhất): `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `CORS_ORIGINS`, `GOOGLE_CLIENT_ID`, VNPay (`VNPAY_TMN_CODE`, `VNPAY_HASH_SECRET`, `VNPAY_URL`, `VNPAY_RETURN_URL`), MoMo (`MOMO_PARTNER_CODE`, `MOMO_ACCESS_KEY`, `MOMO_SECRET_KEY`, `MOMO_ENDPOINT`, `MOMO_REDIRECT_URL`, `MOMO_IPN_URL`), chuyển khoản (`BANK_ACCOUNT_NAME`, `BANK_ACCOUNT_NUMBER`, `BANK_BIN`, `SEPAY_API_KEY`, `CASSO_WEBHOOK_TOKEN`), Supabase (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`), AI (`AI_PROVIDER`, `GOOGLE_GENERATIVE_AI_API_KEY`, `GEMINI_MODEL`, tuỳ chọn Ollama), `SENTRY_DSN`, `FRONTEND_URL`, `ALLOW_DEV_AUTH_FALLBACK`, và **mới**: `EMAIL_PROVIDER`, `RESEND_API_KEY`, `EMAIL_FROM`, `OTP_TTL_MINUTES`, `OTP_MAX_ATTEMPTS`, `OTP_RESEND_COOLDOWN_SECONDS`, `ALLOW_DEV_OTP_ECHO`
- **web**: `VITE_API_BASE_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_ENV`, `VITE_GOOGLE_CLIENT_ID`
- **admin**: `VITE_API_URL`, `VITE_APP_NAME`, `VITE_APP_DESCRIPTION`

## 8. Script chạy dự án

| App | dev | build | test/lint |
|---|---|---|---|
| backend | `npm run dev` (tsx watch) | `npx prisma generate && tsc` | `npm test` (Jest), `npm run seed` |
| web | `npm run dev` (vite) | `vite build` | `npm run lint` (oxlint) |
| admin | `npm run dev` (vite) | `vite build` | `npm run check` (biome) |

Chạy nhanh cả 3 (đã cấu hình sẵn trong `.claude/launch.json` của repo này): `an-chuyen-backend`, `an-chuyen-web`, `an-chuyen-admin`.

## 9. Những điểm cần lưu ý / còn thiếu (tổng hợp từ toàn bộ tài liệu 00-14)

- Hầu hết lỗi nghiệp vụ (hết ghế khi tạo booking, mã giảm giá sai, ví không đủ tiền) trả **HTTP 500** thay vì 4xx đúng ngữ nghĩa — chỉ hold-ghế (409), lấy chi tiết chuyến không tồn tại (404), auth (401/403), và validate Zod ở tạo booking (400) là đúng chuẩn.
- `POST /api/loyalty/add` **không có middleware xác thực** — ai cũng gọi được nếu biết `userId`.
- Không có refund tự động qua API VNPay/MoMo khi huỷ vé đã thanh toán qua cổng ngoài — chỉ hoàn tiền tức thời nếu trả bằng Ví nội bộ.
- Socket.IO đã dựng sẵn cho theo dõi GPS xe nhưng **chưa có frontend nào kết nối** — tính năng "xem xe trên bản đồ" chưa hoàn thiện đầu cuối.
- Chat hỗ trợ (`SupportConversation`) là REST thuần, không realtime — admin phải tự F5/gọi lại API để thấy tin nhắn mới.
- OTP/device-session (mục 14) **chưa có test tự động**, và **admin app chưa áp dụng cơ chế OTP thiết bị mới** — chỉ web/ có.
- `POST /api/auth/forgot-password` chưa gửi mail thật dù hạ tầng Resend đã sẵn có từ tính năng OTP — cần nối vào trước khi dùng production.
- `backend/Dockerfile` khai `EXPOSE 4001` trong khi app lắng nghe cổng 3000 — kiểm tra lại nếu dùng image này ngoài Render/Railway (2 nơi này build trực tiếp bằng buildpack, không dùng Dockerfile).

## 10. Cách đọc tiếp

- Muốn hiểu 1 luồng nghiệp vụ cụ thể (đặt vé, thanh toán, huỷ vé...) → đọc file 06-08, 12.
- Muốn sửa/thêm 1 API → đọc 03 (kiến trúc backend) + 04/14 (danh sách endpoint) + 05 (schema) trước khi code.
- Muốn hiểu vì sao 1 tính năng "không hoạt động như mong đợi" → tra bảng `[NOT IMPLEMENTED]`/`[MISSING]`/`[UNUSED]` ở đầu file 00 và rải rác các file khác — mọi nhãn này đều đã xác minh bằng code, không phải phỏng đoán.
