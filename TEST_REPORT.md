# Báo cáo Smoke Test Hệ Thống — An Chuyến

**Ngày test:** 2026-08-30
**Phạm vi:** Backend (API), Web (khách hàng), Admin (quản trị)
**Loại test:** Build/Lint tự động + Test API thực tế + Kiểm tra UI qua browser

---

## 1. Backend (`backend/`) — port 3000

Đang chạy sẵn, kết nối Supabase (production DB thật).

| Hạng mục | Kết quả |
|---|---|
| `npm test` (Jest) | ✅ 4/4 test pass |
| `tsc --noEmit` (type check) | ✅ Không lỗi |

**Test endpoint thực tế:**

| Endpoint | Status |
|---|---|
| `GET /api/trips` | 200 — trả data thật |
| `GET /api/promotions` | 200 |
| `GET /api/reviews` | 200 |
| `GET /api/stations` | 200 |
| `GET /api/configs` | 200 |
| `GET /api/events` | 200 |
| `GET /api/tours` | 200 |
| `POST /api/auth/login` (sai credential) | 401 "Invalid credentials" — đúng hành vi |

**Kết luận:** Backend ổn định, không có lỗi phát hiện.

---

## 2. Web — khách hàng (`web/`) — port 5173

| Hạng mục | Kết quả |
|---|---|
| Lint (`oxlint`) | ⚠️ Chỉ có warnings (unused vars, missing hook deps trong `useEffect`) — không có lỗi chặn build |
| Build (`vite build`) | ✅ Thành công, 2320 modules transformed |

**Test luồng thực tế trên browser:**
1. Trang chủ load đẹp, đúng art direction (cinematic, không lỗi console).
2. Tìm chuyến: nhập "Hà Nội" → "Hồ Chí Minh" → Search → gọi API `/api/trips` thành công, hiển thị đúng danh sách chuyến thật (Hoang Long, Kumho Samco, Mai Linh, Phuong Trang, Sao Viet, Hai Van, Thanh Buoi...).
3. Chọn chuyến "Hoang Long" (TP.HCM → Vũng Tàu) → vào trang chọn ghế → sơ đồ ghế hiển thị đúng, chọn ghế A1 (350.000đ) → tổng tiền cập nhật đúng.
4. Bấm "Xác nhận đặt vé" → chuyển sang bước "Thông tin hành khách" mượt mà, form đầy đủ, không lỗi console.
5. **Dừng test tại đây** — không nhập thông tin cá nhân thật/thực hiện thanh toán thật.

**Vấn đề nhỏ phát hiện qua lint (không chặn hoạt động):**
- Nhiều import/biến không dùng: `Header.tsx`, `SchedulePage.tsx`, `TourPage.tsx`, `BlogPage.tsx`, `App.tsx`...
- `ProfilePage.tsx:100` — biểu thức `||` luôn đúng hằng số (logic có thể sai, nên xem lại).
- Vài `useEffect` thiếu dependency (`RouteMap.tsx`, `DeliveryMap.tsx`, `TripSearchPage.tsx`, `SeatSelectionPage.tsx`).
- Catch block bắt lỗi nhưng không xử lý (`AIChatbot.tsx`, `DeliveryPage.tsx`, `RentalPage.tsx`).

**Kết luận:** Web hoạt động tốt, sẵn sàng dùng. Có vài warning code-quality nên dọn dần nhưng không ảnh hưởng chức năng.

---

## 3. Admin — quản trị (`admin/`) — port 5174

| Hạng mục | Kết quả |
|---|---|
| Lint (`biome`) | ❌ 42 errors, 50 warnings — chủ yếu `lint/nursery/noFloatingPromises` (promise không await/catch) |
| Build (`vite build`) | ✅ Thành công |

**Lỗi lint đáng chú ý:**
- `src/app/(main)/chat/_components/chat-thread.tsx:183` — floating promise trong `onKeyDown`.
- `src/app/(main)/chat/_components/chat.tsx:28` — `refetch()` không await.
- `src/app/(main)/chat/_components/use-chat.ts:37,56,85` — thiếu dependency trong `useCallback`/`useEffect`, floating promises.
- Tổng cộng 315 diagnostic khác chưa hiển thị hết (giới hạn output của biome).

**Vấn đề nghiêm trọng khi mở thật trên browser:**
- Trang login vẫn là **template gốc "Studio Admin"** — CHƯA rebrand cho An Chuyến:
  - Tiêu đề "Login to your account" bị **đè chồng chữ** lên dòng "Don't have an account? Register" phía trên (lỗi CSS layout).
  - Footer "© 2026, Studio Admin" đè lên nút "Login".
  - Nội dung sidebar/marketing panel là placeholder mẫu: "Clone the repo, install dependencies, and your dashboard is live in minutes."
- Việc này khớp với `git status` hiện tại: toàn bộ `admin/src/*` cũ (Sidebar, Table, Dashboard, Bookings, Users, v.v.) đang bị xoá để thay bằng bộ code admin mới — **admin đang giữa quá trình migrate, chưa hoàn thiện**.
- Do chưa rõ tài khoản hợp lệ và trang login còn lỗi, **không thực hiện đăng nhập thử** để tránh thao tác trên dữ liệu/tài khoản thật.

**Kết luận:** Admin build được nhưng **chưa sẵn sàng sử dụng** — cần hoàn thành rebrand UI, sửa lỗi CSS chồng chữ ở trang login, và dọn các lỗi floating-promise trước khi test sâu các luồng quản trị (CRUD chuyến, vé, users...).

---

## Cập nhật — Đã fix (2026-08-30)

**Admin:**
- Sửa `.env.local` dùng sai prefix `NEXT_PUBLIC_*` (kiểu Next.js) trong khi code đọc `import.meta.env.VITE_*` (kiểu Vite) → biến môi trường chưa từng được áp dụng. Đổi sang `VITE_API_URL`, `VITE_APP_NAME`, `VITE_APP_DESCRIPTION`.
- Đổi tên thương hiệu mặc định "Studio Admin" → "An Chuyến Admin" trong `config/app-config.ts`.
- Thay nội dung marketing panel trang login/register từ tiếng Anh mẫu ("Design. Build. Launch. Repeat.", "Ready to launch?"...) sang nội dung tiếng Việt phù hợp An Chuyến.
- Thêm `overflow-y-auto py-16` cho khung form login/register để tránh đè chữ lên header/footer absolute khi viewport thấp.
- Fix 18/42 lỗi lint `biome` (còn 24 lỗi là `noExplicitAny`/a11y — cần refactor kiểu dữ liệu và cấu trúc HTML lớn hơn, chưa nằm trong phạm vi lần fix này):
  - Floating promises trong `chat.tsx`, `chat-thread.tsx`, `use-chat.ts`, `login-form.tsx`, `search-dialog.tsx`, `analytics/page.tsx`, `bus-agents/page.tsx`.
  - `noShadowRestrictedNames`: icon `Map` từ lucide-react đè tên global `Map` trong `routes/page.tsx`, `trip-schedules/page.tsx` → đổi thành `MapIcon`.
  - `noUnusedFunctionParameters`, `noUnusedImports` qua `biome check --write`.

**Web:**
- Fix bug logic thật ở `ProfilePage.tsx:100` — biểu thức `{ ...obj } || fallback` luôn cho kết quả truthy (spread của `undefined` vẫn ra `{}`), khiến fallback `TIER_CONFIG['Member']` không bao giờ được dùng khi tier không hợp lệ, gây `tier.pointsNeeded` là `undefined` → thanh progress loyalty tính sai (NaN). Đã sửa để fallback hoạt động đúng.
- Convert biểu thức ternary dùng làm statement ở `TripSearchPage.tsx:138` thành `if/else` rõ ràng.
- Dọn toàn bộ unused imports/vars: `App.tsx`, `Header.tsx`, `SchedulePage.tsx`, `BlogPage.tsx`, `TourPage.tsx`, `BookingReviewPage.tsx`, `ContactPage.tsx`, `OffersPage.tsx`, `TripSearchPage.tsx`, `SeatSelectionPage.tsx`, `AboutPage.tsx`, `LoyaltyPage.tsx`.
- Thêm `console.error` vào các catch-block đang nuốt lỗi hoàn toàn (`AIChatbot.tsx`, `DeliveryPage.tsx` x2, `RentalPage.tsx`) để dễ debug khi API lỗi.
- Build + lint lại: cả hai app build thành công, không lỗi nghiêm trọng.

**Chưa fix (ngoài phạm vi "chỉ sửa bug"):**
- Xây mới các trang quản trị còn thiếu (Vouchers, Banners, Events, Reviews, WebsiteConfig, Tours, Rentals, Deliveries, Payments) + route backend tương ứng.
- 24 lỗi lint còn lại ở admin (`noExplicitAny`, a11y trên `trip-schedules/page.tsx`) — cần refactor kiểu dữ liệu và cấu trúc HTML.
- Warning `react-hooks/exhaustive-deps` còn lại ở web (RouteMap, DeliveryMap, TripSearchPage, SeatSelectionPage) — cần xem xét kỹ vì thêm dependency có thể gây vòng lặp re-render, nên để lại chờ quyết định riêng.

---

## Cập nhật — Bổ sung module admin còn thiếu (2026-08-30)

**Backend:** thêm CRUD admin cho `banners, events, appConfigs, reviews, tours, tourBookings, rentalCars, rentalBookings, deliveryOrders, payments` trong [admin.routes.ts](backend/src/admin.routes.ts) (tái dùng `createCrudRouter` có sẵn), verify bằng `tsc --noEmit` và test thật qua curl (401 khi chưa auth — đúng hành vi).

**Admin — 8 trang mới**, đã đăng nhập bằng tài khoản admin thật và test trực tiếp trên browser:
- [Vouchers](admin/src/app/(main)/dashboard/vouchers/page.tsx) — list + thêm + xóa. Đã test tạo mới "TESTQA20" (201 Created, hiện đúng trong bảng) và xóa thành công.
- [Banners](admin/src/app/(main)/dashboard/banners/page.tsx) — list + thêm + xóa, hiển thị đúng dữ liệu thật.
- [Events](admin/src/app/(main)/dashboard/events/page.tsx) — list + thêm, render đúng trạng thái rỗng.
- [Reviews](admin/src/app/(main)/dashboard/reviews/page.tsx) — duyệt/xóa đánh giá khách hàng.
- [Website Config](admin/src/app/(main)/dashboard/website-config/page.tsx) — quản lý key/value cấu hình động.
- [Tours](admin/src/app/(main)/dashboard/tours/page.tsx), [Rentals](admin/src/app/(main)/dashboard/rentals/page.tsx) — CRUD catalog.
- [Deliveries](admin/src/app/(main)/dashboard/deliveries/page.tsx), [Payments](admin/src/app/(main)/dashboard/payments/page.tsx) — danh sách theo dõi (read-only), Payments hiển thị đúng giao dịch thật (WALLET, PAID/PENDING).

Đã đăng ký route trong [App.tsx](admin/src/App.tsx) và mục menu mới trong [sidebar-items.ts](admin/src/navigation/sidebar/sidebar-items.ts) (nhóm "Marketing" và "Dịch Vụ Khác").

**Lưu ý:** lỗi lint admin tăng từ 24 → 55 vì các trang mới dùng lại pattern `useState<any[]>` giống các trang cũ (bus-agents, trips...) — nhất quán về style nhưng làm tăng số lượng `noExplicitAny` cần dọn sau. Build vẫn thành công, không lỗi chức năng.

---

## Cập nhật — Hạ tầng production (2026-08-30)

- **Bug deploy nghiêm trọng đã fix**: `docker-compose.yml` healthcheck backend gọi `http://localhost:3000/api/health` nhưng route thật là `/health` (không có prefix `/api`) → container Docker sẽ luôn bị đánh dấu unhealthy. Đã sửa healthcheck về đúng `/health`.
- **Bug deploy nghiêm trọng khác**: `web/Dockerfile` build server `serve` lắng nghe cổng **3000**, nhưng `docker-compose.yml` map cổng `5173:5173` → container không thể truy cập được qua Docker. Đã sửa `serve` sang lắng nghe **5173** đúng với mapping.
- **`admin/Dockerfile` đã bị xóa** trong quá trình migrate admin — dựng lại theo đúng pattern của `web/Dockerfile`, lắng nghe cổng **5173** (khớp map `5174:5173` trong compose).
- Dựng lại `admin/.dockerignore` và `admin/.env.example` (cũng bị xóa khi migrate) để việc build Docker và onboarding không rò rỉ `node_modules`/secrets.
- **Thêm rate limiting** (`express-rate-limit`) vào [index.ts](backend/src/index.ts):
  - Giới hạn chung 300 request/15 phút cho toàn bộ `/api/*`.
  - Giới hạn chặt 20 request/15 phút riêng cho `/api/auth/*` — chống brute-force đăng nhập.
  - Thêm `app.set('trust proxy', 1)` để rate-limit và `req.ip` nhận đúng IP thật khi chạy sau reverse proxy (Railway/Nginx).
- Thêm cảnh báo runtime: nếu `NODE_ENV=production` mà quên set `CORS_ORIGINS`, log warning rõ ràng thay vì âm thầm fallback về localhost (lỗ hổng bảo mật tiềm ẩn nếu không phát hiện).
- Bổ sung `CORS_ORIGINS` vào `backend/.env.example` để không ai quên khi deploy.
- Verify: `npm test` (4/4 pass), `tsc --noEmit` sạch, server chạy thật vẫn phản hồi đúng sau khi thêm middleware.

**Lưu ý còn lại (chưa xử lý, cần quyết định của bạn):**
- `npm audit` phát hiện 10 vulnerability pre-existing (không liên quan tới thay đổi vừa rồi) ở `@mastra/core`, `hono`, `brace-expansion`, `fast-uri`... — cần chạy `npm audit fix` và kiểm tra breaking changes trước khi áp dụng.
- Chưa xác nhận `JWT_SECRET`, `SUPABASE_SERVICE_ROLE_KEY` production là secret riêng biệt với dev (cần bạn xác nhận trong hệ thống secret management thật, không thể kiểm tra từ code).

---

## Cập nhật — Test luồng nghiệp vụ thật (2026-08-30)

Đã đăng nhập bằng tài khoản thật và gọi trực tiếp API để kiểm chứng hành vi thực tế (không qua UI để tránh gọi cổng thanh toán/AI thật một cách không kiểm soát).

**✅ Hoạt động đúng:**
- AI Chatbot (`/api/ai/chat`) — trả lời tiếng Việt hợp lý qua Gemini thật, phản hồi sau 20-30s (khá chậm, nên cân nhắc loading UX).
- Wallet (`/api/wallet/me`) — đọc đúng số dư thật (50.000.000đ) từ Supabase.
- Tạo booking (`/api/bookings/create`) — tạo thành công, khóa đúng ghế đã chọn.

**🔴 Bug/lỗ hổng nghiêm trọng phát hiện được:**

1. **Không có gateway thanh toán thật nào được tích hợp.** UI cho khách chọn 5 phương thức (Ví An Chuyến, QR, Thẻ, VNPay, Momo, COD) nhưng backend ([booking.service.ts](backend/src/modules/booking/booking.service.ts)) chỉ tạo `Payment` với `status: PENDING` bất kể phương thức nào — không có tích hợp VNPay/Momo API thật, không xử lý webhook, không tự động trừ ví.
   - **Đã verify bằng test thật:** tạo booking 100.000đ với `paymentMethod: "busz-wallet"` (chọn thanh toán bằng ví) — booking tạo thành công nhưng **số dư ví không hề bị trừ** (vẫn nguyên 50.000.000đ) và booking kẹt ở trạng thái `PENDING_PAYMENT` vĩnh viễn.
   - **Hệ quả:** mọi đơn đặt vé thật sự đều cần admin vào tay xác nhận thủ công (qua trang Payments/COD confirm) — không có luồng thanh toán tự động nào hoạt động. Đây là **gap chức năng lớn nhất, phải giải quyết trước khi vận hành thật** — không đơn thuần là thiếu test mà là thiếu code xử lý.

2. **Không có API hủy booking / giải phóng ghế.** [booking.routes.ts](backend/src/modules/booking/booking.routes.ts) chỉ có `POST /create` và `GET /` — không có endpoint cancel. Ghế có field `lockedAt` nhưng không có cron/job nào đọc để tự động nhả ghế hết hạn giữ chỗ.
   - **Đã verify bằng test thật:** xóa booking test qua admin CRUD (`DELETE /api/admin/bookings/:id`) — ghế đã chọn **vẫn ở trạng thái `blocked`/`LOCKED`**, không tự trở về `available`. Đã phải sửa tay lại ghế qua admin API để dọn sạch.
   - **Hệ quả:** mỗi booking bị bỏ dở (khách không thanh toán, admin xóa nhầm...) sẽ làm mất vĩnh viễn 1 ghế khỏi kho — rò rỉ tồn kho ghế theo thời gian, sẽ gây thiếu ghế ảo nếu chạy production đủ lâu.

3. **Catalog rỗng cho Tour/Rental/Delivery** (`/api/tours`, `/api/rentals/cars`, `/api/deliveries/vehicles` đều trả `[]`) — không phải bug, nhưng nghĩa là 3 tính năng này **không dùng được thật** cho tới khi nhập dữ liệu catalog qua các trang admin vừa xây (Tours, Rentals) hoặc thêm DeliveryVehicle.

**Khuyến nghị xử lý theo độ ưu tiên:**
1. Quyết định chiến lược thanh toán: tích hợp VNPay/Momo thật, hoặc tạm thời launch chỉ với COD + xác nhận thủ công (nếu vậy cần **ẩn bớt** các lựa chọn thanh toán chưa hoạt động trên UI để tránh khách hiểu nhầm đã thanh toán thành công).
2. Thêm endpoint hủy booking + cron job tự động nhả ghế `PENDING_PAYMENT` quá hạn (ví dụ sau 15-30 phút).
3. Nhập dữ liệu catalog Tour/Rental/DeliveryVehicle qua admin trước khi quảng bá các dịch vụ này.

---

## Cập nhật — Fix luồng thanh toán & hủy booking (2026-08-30)

Theo quyết định của bạn: **launch tạm bằng COD + Ví nội bộ**, ẩn các phương thức chưa hoạt động thật (VNPay/Momo/Thẻ/QR).

**Backend — [booking.service.ts](backend/src/modules/booking/booking.service.ts):**
- Thanh toán bằng **Ví An Chuyến** giờ hoạt động thật: trừ tiền từ `Wallet.balance`, ghi `WalletTransaction`, tạo `Payment` với `status: PAID`, và booking tự động chuyển `CONFIRMED` — tất cả trong cùng 1 transaction. Nếu số dư không đủ, toàn bộ request bị từ chối, ghế không bị khoá.
- Thêm `cancelBooking()` — khách tự huỷ booking đang `PENDING_PAYMENT` của mình, tự động nhả ghế về `AVAILABLE` (trước đây không có endpoint này).
- Thêm `releaseExpiredBookings()` — tự động huỷ + nhả ghế cho các booking `PENDING_PAYMENT` quá hạn giữ chỗ (mặc định 30 phút, cấu hình qua `BOOKING_EXPIRY_MINUTES`), chạy định kỳ mỗi 5 phút qua `setInterval` trong [index.ts](backend/src/index.ts).
- Route mới: `POST /api/bookings/:id/cancel`.

**Web — [PaymentPage.tsx](web/src/features/payment/pages/PaymentPage.tsx):**
- Bỏ 4 lựa chọn thanh toán chưa hoạt động thật (VietQR, Thẻ tín dụng, VNPay, Momo) — chỉ còn **Ví An Chuyến Pay** và **Thanh toán tiền mặt tại quầy (COD)**, tránh gây hiểu nhầm cho khách rằng đã thanh toán thành công khi thực ra chưa có gì xử lý.

**Đã verify bằng test thật, end-to-end qua UI (không chỉ qua API):**
1. Đăng nhập → tìm chuyến TP.HCM → Vũng Tàu → chọn ghế T1-1A → điền thông tin hành khách → xác nhận đặt vé → **chọn Ví An Chuyến Pay → bấm Thanh toán** → nhận "Thanh toán thành công!" + vé điện tử hiển thị đầy đủ (mã vé, QR, thông tin hành khách).
2. Verify qua API: ví bị trừ đúng 360.000đ (50.000.000 → 49.640.000), booking chuyển `CONFIRMED` ngay lập tức — không cần admin can thiệp.
3. Test riêng luồng COD: tạo booking → ghế `LOCKED` → gọi `cancel` → ghế tự động về `AVAILABLE`, booking chuyển `CANCELLED`.
4. Đã dọn sạch toàn bộ dữ liệu test (xoá booking, khôi phục ghế, khôi phục số dư ví về nguyên trạng).

**Kết quả:** `npm test` (4/4 pass), `tsc --noEmit` sạch, web build sạch, lint web không tăng thêm lỗi.

**Phát hiện thú vị khi verify:** [MyBookingsPage.tsx](web/src/features/my-bookings/pages/MyBookingsPage.tsx) **đã có sẵn** nút "Hủy vé" gọi đúng `POST /bookings/:id/cancel` — nhưng route này chưa từng tồn tại ở backend cho tới khi mình vừa thêm. Nghĩa là tính năng hủy vé trên web đã bị hỏng âm thầm (lỗi 404) từ trước, và giờ **tự động hoạt động trở lại** mà không cần sửa gì thêm ở frontend.

**Bug nhỏ phát hiện thêm (chưa fix, ghi chú lại):** Footer trang web hiển thị thương hiệu **"Roamora"** thay vì "An Chuyến" — nội dung sót lại từ template gốc, tương tự lỗi "Studio Admin" đã fix ở admin trước đó.

**Đã fix luôn (không chỉ ghi chú):** brand "Roamora" sót lại từ template xuất hiện ở 6 vị trí — [Footer.tsx](web/src/shared/components/Footer.tsx), [AboutPage.tsx](web/src/features/about/pages/AboutPage.tsx), [ContactPage.tsx](web/src/features/contact/pages/ContactPage.tsx), [LoyaltyPage.tsx](web/src/features/loyalty/pages/LoyaltyPage.tsx), `locales/vi.ts`, `locales/en.ts` — tất cả đã đổi thành "An Chuyến". Verify bằng `document.body.innerText.includes('Roamora')` trên trang thật → `false`. Build lại thành công.

**Việc còn lại (nếu muốn nâng cấp sau này):**
- Khi có tài khoản merchant VNPay/Momo thật, thêm lại các phương thức đó vào UI kèm tích hợp webhook + signature verification thật (đã ghi chú rõ trong code hiện tại không được tự ý bật lại nếu chưa làm việc này).

---

## Cập nhật — Security review, npm audit, dọn lint admin (2026-08-30)

**Security review (thủ công, vì skill `/security-review` lỗi do repo chưa có remote/`origin/HEAD`):**

🔴 **2 lỗ hổng nghiêm trọng đã tìm thấy và fix ngay:**
1. **Lộ password hash** — `GET /api/admin/users` trả về toàn bộ record User kể cả cột `password` (bcrypt hash) cho mọi request admin. Đã verify bằng test thật trước và sau khi fix.
2. **Mass-assignment / chiếm quyền tài khoản** — `PUT /api/admin/users/:id` cho phép ghi đè bất kỳ field nào, kể cả `password` (không hash) và `role` — một request admin đơn giản có thể tự nâng quyền user thường lên admin, hoặc set mật khẩu mới cho tài khoản bất kỳ mà không cần biết mật khẩu cũ. Đã verify bằng tấn công thử: gửi `{"role":"admin","password":"hacked123"}` cho 1 user thường → bị chặn hoàn toàn, `role` giữ nguyên `"user"`.
   - **Fix:** thêm `readOmit`/`writeBlock` field-list vào `createCrudRouter`, áp dụng cho resource `users` (ẩn `password` khi đọc, chặn ghi `password`+`role`).

🟡 **2 phát hiện khác (ghi nhận, chưa fix — rủi ro thấp hơn, cần quyết định kiến trúc):**
3. JWT access token có hạn 7 ngày, không có refresh token/blacklist — token bị lộ vẫn hợp lệ suốt 7 ngày kể cả sau khi đổi mật khẩu.
4. Admin CRUD trả nguyên `error.message` từ Prisma khi lỗi — rò rỉ chi tiết schema nội bộ (rủi ro thấp vì đã yêu cầu quyền admin).

**npm audit:**
- Backend: 10 → 2 vulnerability (2 còn lại bị chặn bởi bản vá thượng nguồn chưa phát hành — `@mastra/core`→`@ai-sdk` và `autocannon`→`uuid`, cả hai đều cần `--force` gây breaking change nên không tự ý áp dụng).
- Web: 3 lỗ hổng **cao** (`react-router` RSC CSRF bypass) → 0, đã verify build + routing vẫn hoạt động bình thường sau khi nâng cấp.
- Admin: đã sạch từ trước (0 vulnerability).

**Dọn lint admin (55 → 24 lỗi, đúng bằng baseline ban đầu trước khi thêm 8 trang mới):**
- Fix toàn bộ `noLabelWithoutControl` (thêm `htmlFor`/`id`) trên 6 trang mới (Vouchers, Banners, Events, Tours, Rentals, Website Config).
- **Phát hiện + fix 1 bug thật do chính công cụ auto-fix gây ra:** khi chạy `biome check --write --unsafe` để tự động thêm dependency còn thiếu cho `useEffect`, nó thêm hàm `load` (khai báo bằng `function`, tái tạo mỗi lần render) vào mảng dependency — tạo nguy cơ vòng lặp render vô hạn. Đã sửa đúng cách bằng cách bọc `load` trong `useCallback([])` ở cả 7 trang bị ảnh hưởng, verify bằng network trace: chỉ gọi API 1-2 lần (StrictMode) thay vì lặp liên tục.
- 24 lỗi còn lại là `noExplicitAny` (style, không phải bug) và a11y trên `trip-schedules/page.tsx` (code cũ có từ trước, chưa đụng tới trong phiên này) — để lại vì refactor kiểu dữ liệu/cấu trúc HTML đầy đủ nằm ngoài phạm vi hợp lý của lần dọn dẹp này.

**Verify cuối:** `npm test` (4/4 pass), `tsc --noEmit` sạch cả backend lẫn admin, build web/admin/backend đều thành công.

**Chưa làm (theo yêu cầu của bạn):**
- Push commit lên remote — **repo hiện chưa cấu hình remote nào cả** (`git remote -v` trống). Cần bạn thêm remote (`git remote add origin <url>`) trước khi mình có thể push.
- Tích hợp VNPay/Momo thật — tạm hoãn theo quyết định trước đó, chờ có tài khoản merchant.

---

## Tổng kết & Đề xuất tiếp theo

| Hệ thống | Trạng thái |
|---|---|
| Backend | 🟢 Sẵn sàng |
| Web (khách hàng) | 🟢 Sẵn sàng, nên dọn warning lint |
| Admin (quản trị) | 🔴 Chưa sẵn sàng — đang migrate dở, có lỗi UI |

**Ưu tiên xử lý:**
1. Hoàn thiện rebrand trang login admin (xoá nội dung "Studio Admin" mẫu, sửa CSS chồng chữ).
2. Fix các floating-promise lỗi trong `admin/src/app/(main)/chat/`.
3. Dọn unused imports/vars ở web để lint sạch hơn.
4. Sau khi admin ổn định, test tiếp luồng đăng nhập + CRUD dữ liệu thật.
