# Đề xuất redesign AnChuyen: bỏ Ví, danh tính thụ động Email+OTP, thống nhất thanh toán

## Context

Sau một buổi audit toàn bộ hệ thống AnChuyen (backend Express/Prisma, web/ React khách hàng, admin/ React quản trị) và thảo luận sâu, đã xác định 2 vấn đề gốc rễ trong thiết kế hiện tại:

1. **Ví (`Wallet`) tạo ma sát không cần thiết**: bắt khách "nạp tiền trước vào 1 đơn vị tiền tệ nội bộ" cho một sản phẩm về bản chất là mua-1-lần, trong khi cơ chế "Chuyển khoản" (`bank-transfer.routes.ts` — VietQR + đối soát nội dung CK qua webhook SePay/Casso) đã chứng minh mô hình "khách trả tiền thật trực tiếp, hệ thống chỉ đối soát" hoạt động tốt hơn và nên áp dụng thống nhất cho mọi phương thức.
2. **Bắt buộc tài khoản/mật khẩu là thừa thãi** với nhu cầu thật của khách (mua vé, biết điểm đón/trả, giờ giấc — sự cố thực địa thì khách xử lý trực tiếp với lơ xe, không quay lại hệ thống). Nên thay bằng danh tính thụ động: khách chỉ cần Email, xác minh 1 lần bằng OTP, sau đó được nhận diện qua phiên thiết bị dài hạn (tái dùng đúng bảng `DeviceSession` đã có sẵn trong schema nhưng **chưa từng được dùng ở đâu cả**).

Mục tiêu tài liệu này: liệt kê chính xác việc cần làm, theo đúng thứ tự phụ thuộc, để lần lượt hiện thực hoá 2 thay đổi trên một cách an toàn — không phá luồng đang chạy của khách hàng hiện tại, không mất dữ liệu lịch sử (Wallet/WalletTransaction giữ nguyên trong DB, chỉ ngừng dùng).

**Phạm vi đã chốt với người dùng:**
- Đăng nhập mật khẩu (JWT) hiện tại của khách `web/` **giữ nguyên, chạy song song** — Email+OTP chỉ là đường mới cho khách vãng lai/chưa từng tạo tài khoản, không ép ai đổi.
- Admin (`admin/`) **cũng chuyển sang Email+OTP** — nhưng khác khách hàng ở chỗ **không được tự tạo tài khoản admin qua OTP**: chỉ gửi OTP nếu email đó đã tồn tại sẵn trong DB với `role='admin'` (xem cảnh báo bảo mật trong Phase 2).
- Không cần ước tính thời gian — chỉ cần task rõ ràng, đúng thứ tự phụ thuộc.

---

## Phase 0 — Hạ tầng bắt buộc trước tiên: dịch vụ gửi email

Đây là **điểm chặn cứng** — không có gì ở Phase 2 chạy được nếu thiếu cái này. Hiện tại xác nhận `backend/package.json` không có bất kỳ dependency gửi email nào (không nodemailer/sendgrid/resend/ses).

- Thêm dependency gửi email (khuyến nghị **Resend** — đơn giản, có free tier tốt cho khối lượng nhỏ ban đầu; Nodemailer+SMTP là phương án dự phòng nếu đã có sẵn SMTP riêng).
- Thêm biến môi trường vào `backend/.env.example`: `EMAIL_PROVIDER`, `RESEND_API_KEY` (hoặc `SMTP_HOST/PORT/USER/PASS`), `EMAIL_FROM`, `OTP_TTL_MINUTES`, `OTP_MAX_ATTEMPTS`, `OTP_RESEND_COOLDOWN_SECONDS`.
- File mới `backend/src/core/mailer.ts` — hàm duy nhất `sendMail({ to, subject, html })`, để sau này đổi provider không phải sửa chỗ khác gọi tới nó.
- File mới `backend/src/core/emailTemplates/otp.ts` — sinh nội dung email OTP.

---

## Phase 1 — Thay đổi schema (1 migration duy nhất)

Tên migration theo đúng convention hiện có (`YYYYMMDDHHMMSS_snake_case`), ví dụ `..._add_otp_and_device_session_fields`.

1. **Model mới `EmailOtp`** — dựng theo đúng mẫu `PasswordResetToken` đã có sẵn (lưu hash, không lưu mã gốc):
   ```
   id, userId String?, email String, codeHash String, challengeId String @unique,
   attempts Int @default(0), expiresAt DateTime, usedAt DateTime?, createdAt DateTime @default(now())
   @@index([email, createdAt])
   ```
   `challengeId` là bắt buộc — dùng để chống replay OTP giữa các phiên khác nhau (xem Phase 4, mục bảo mật #7).
2. **`DeviceSession`**: thêm `lastSeenAt DateTime @default(now())` (cập nhật mỗi lần được nhận diện) và `revokedAt DateTime?` (cho phép "đăng xuất khỏi thiết bị này").
3. **`User`**: thêm `idCardConsentAt DateTime?` — thời điểm khách tick đồng ý cung cấp CCCD. **Tái dùng field `idCard` đã có sẵn trên `User`** cho CCCD cấp tài khoản (khác với `Passenger.idCard` vốn là CCCD từng hành khách trên từng vé — 2 khái niệm khác nhau, ghi rõ comment phân biệt trong schema để người sau không nhầm).
4. **Không đụng** `Wallet`/`WalletTransaction` — giữ nguyên, chỉ ngừng dùng ở tầng code (Phase 3).
5. **`backend/src/core/audit.ts`**: thêm event mới vào union `AuditEvent`: `'OtpRequested'`, `'OtpVerified'`, `'OtpFailed'`, `'CustomerIdCardViewed'`, `'CustomerIdCardEdited'`, `'RefundProcessed'`.

---

## Phase 2 — Module danh tính mới ở backend

Module mới `backend/src/modules/identity/` (đúng convention `modules/` hiện có):

1. **`identity.service.ts`**
   - `requestOtp(email, { requireExistingAdminRole?: boolean })`:
     - Tìm user theo email; nếu không có và **không** yêu cầu admin → tạo mới (find-or-create) — bọc trong try/catch bắt lỗi trùng khoá `User.email` (Prisma P2002) để xử lý race condition, coi như "đã tồn tại" thay vì crash.
     - Nếu `requireExistingAdminRole=true` (dùng cho admin login) và không tìm thấy user role=admin khớp email → **vẫn trả về đúng response chung chung như thành công**, nhưng **không thực sự gửi mail** — để không lộ "email này có phải admin không" (chống dò quyền admin).
     - Kiểm tra cooldown/giới hạn gửi theo email (query `EmailOtp` gần nhất) trước khi tạo mã mới.
     - Sinh mã 6 số, hash sha256, lưu kèm `challengeId` mới, gọi `mailer.sendMail`.
     - **Luôn trả về đúng 1 response giống hệt nhau** dù email cũ/mới/không tồn tại (chống dò email — bảo mật #1).
   - `verifyOtp(challengeId, code)`:
     - Tra theo `challengeId` (không tra theo email) — đảm bảo mã chỉ dùng được đúng phiên đã yêu cầu nó.
     - Tăng `attempts`; quá `OTP_MAX_ATTEMPTS` thì vô hiệu hoá mã đó, bắt xin mã mới.
     - Đúng mã, còn hạn, chưa dùng → đánh dấu `usedAt`, tạo/refresh `DeviceSession`, trả `refreshToken`.
2. **`identity.routes.ts`**: `POST /api/identity/otp/request`, `POST /api/identity/otp/verify`, `GET /api/identity/session`, `POST /api/identity/logout`.
3. **`identity.controller.ts`**: validate input, set cookie `httpOnly + Secure + SameSite=Lax` chứa `refreshToken` (không bao giờ trả token này trong JSON body).
4. **Middleware mới `backend/src/middleware/deviceSession.middleware.ts`** (`deviceSessionAuth`): đọc cookie, tra `DeviceSession` còn hạn & chưa `revokedAt`, gắn `req.user`, cập nhật `lastSeenAt`. Không có/hết hạn thì **đi tiếp** (không tự trả 401) — để route tự quyết định có bắt OTP lại hay không.
5. Áp `authLimiter` (đã có sẵn pattern trong `backend/src/index.ts`) cho `/api/identity/otp/*`, cộng thêm giới hạn riêng theo email ở tầng service (limiter theo IP không đủ — bảo mật #3).
6. Đăng ký route mới trong `backend/src/index.ts` — **không đụng route `/api/auth` cũ**.
7. **Admin dùng lại đúng module này**, chỉ khác ở chỗ gọi `requestOtp(email, { requireExistingAdminRole: true })` từ 1 route riêng phía admin (hoặc query param), và `admin/src/lib/api.ts` chuyển từ đọc `localStorage['admin_token']` sang cơ chế cookie tương tự khách hàng.

---

## Phase 3 — Bỏ Ví, thống nhất thanh toán

1. **`backend/src/modules/booking/booking.service.ts`**: xoá `WALLET_METHOD_VALUES` và mọi nhánh `isWalletPayment`/`wasPaidByWallet` (chỗ kiểm tra số dư, set trạng thái ghế/booking/payment, trừ ví, và nhánh hoàn tiền trong hàm huỷ) — gộp về đúng 1 kiểu xử lý cho VNPay/MoMo/Chuyển khoản/COD: tạo `Payment` ở trạng thái chờ, đợi xác nhận qua webhook/đối soát/admin duyệt (giống hệt luồng Chuyển khoản đang có).
2. **Không xoá** `Wallet`/`WalletTransaction` model hay 3 file trong `wallet/` — chỉ ngừng import/gọi chúng từ `booking.service.ts`, đánh dấu deprecated bằng comment.
3. **Quy trình hoàn tiền thủ công thống nhất (chưa từng tồn tại)**: thêm route mới, ví dụ `POST /api/admin/payments/:id/refund`, ghi nhận đã hoàn tiền thủ công (admin xác nhận), gọi `auditLog('RefundProcessed', ...)`.
4. **`web/`**: bỏ lựa chọn "Ví" khỏi màn hình chọn phương thức thanh toán trong trang thanh toán.
5. `Payment.method` vẫn để dạng `String` tự do (không ép enum) — ngoài phạm vi lần này, ghi chú là nợ kỹ thuật.

---

## Phase 4 — Frontend: form nhập thông tin + OTP + phiên thiết bị

1. Component mới (ví dụ `web/src/features/booking/components/CustomerIdentityFields.tsx`): thêm ô Email/SĐT/CCCD + checkbox đồng ý cung cấp thông tin vào bước tạo booking.
2. Module mới phía FE cho luồng OTP: gọi `/api/identity/otp/request` rồi `/api/identity/otp/verify` qua `web/src/lib/api.ts` (client đang dùng thật, **không** dùng lại `shared/api/apiClient.ts` — file đó đã xác nhận không ai import) — nhớ bật `withCredentials: true` để cookie httpOnly được gửi kèm.
3. Context mới, ví dụ `CustomerIdentityContext.tsx`: khi load app, gọi `GET /api/identity/session` để tự nhận diện thiết bị quen, không phá `AuthContext.tsx`/`ProtectedRoute.tsx` hiện có — 2 cơ chế danh tính (JWT cũ cho tài khoản đã đăng ký, cookie/OTP cho khách thụ động) chạy song song như đã chốt phạm vi.
4. `admin/src/lib/api.ts` và giao diện đăng nhập admin: chuyển từ `localStorage['admin_token']` sang cùng cơ chế cookie httpOnly, nối vào endpoint `identity` (nhánh admin-only ở Phase 2 mục 7).

---

## Phase 5 — Bảo mật (bắt buộc làm cùng lúc, không phải "làm sau")

| # | Rủi ro | Nơi implement |
|---|---|---|
| 1 | Dò email tồn tại | `identity.service.ts::requestOtp` — response/thời gian giống hệt nhau mọi trường hợp |
| 2 | Brute-force OTP | `EmailOtp.attempts` + ngưỡng `OTP_MAX_ATTEMPTS` trong `verifyOtp` |
| 3 | Spam gửi OTP | cooldown/giới hạn theo email trong `requestOtp` + `authLimiter` theo IP trên route |
| 4 | Lộ CCCD | hàm `maskIdCard()` mới trong `backend/src/core/`, áp ở tầng serialize response; giới hạn role xem đầy đủ; `auditLog` mỗi lần admin xem/sửa |
| 5 | Race condition tạo user trùng email | bắt lỗi P2002 trong `requestOtp`, coi như user đã tồn tại |
| 6 | Đánh cắp token phiên | `refreshToken` chỉ đặt qua cookie `httpOnly+Secure+SameSite`, không bao giờ vào JSON body hay localStorage |
| 7 | OTP bị dùng chéo phiên | `verifyOtp` tra theo `challengeId`, không tra theo email/code đơn thuần |
| 8 (riêng cho admin) | Tự tạo tài khoản admin qua OTP | `requestOtp` với `requireExistingAdminRole=true` không auto-create, và không lộ email đó có phải admin hay không qua response |

---

## Kiểm thử / Verification

1. Unit test mới `backend/src/modules/identity/__tests__/identity.service.test.ts` (theo đúng mẫu `booking.service.test.ts` đã có) — cover: cooldown, khoá sau N lần sai, race condition find-or-create, không auto-create khi `requireExistingAdminRole`.
2. Sửa `backend/src/modules/booking/__tests__/booking.service.test.ts`: bỏ case liên quan Ví, thêm case xác nhận luồng thanh toán đã thống nhất.
3. Test tay end-to-end: đặt vé → điền email/CCCD + tick đồng ý → nhận OTP qua mail thật → xác minh → cookie được set → tải lại trang → được nhận diện lại không cần OTP.
4. Test tay riêng cho admin: thử `requestOtp` với 1 email KHÔNG phải admin — xác nhận không có mail nào được gửi thật (kiểm tra qua log của `mailer.ts`/provider), nhưng response trả về cho client vẫn giống hệt trường hợp thành công.
5. Thêm 1 file doc mới theo đúng convention đang có, `docs/architecture/12-identity-otp-flow.md` (Markdown + Mermaid), ghi lại luồng này sau khi code xong — nối tiếp bộ tài liệu `docs/architecture/` đã xây dựng trong audit trước đó.

### File quan trọng sẽ động tới
- `backend/prisma/schema.prisma`
- `backend/src/modules/booking/booking.service.ts`
- `backend/src/core/audit.ts`, `backend/src/core/mailer.ts` (mới)
- `backend/src/middleware/auth.middleware.ts`, `backend/src/middleware/deviceSession.middleware.ts` (mới)
- `backend/src/modules/identity/*` (mới)
- `backend/src/index.ts` (đăng ký route mới)
- `web/src/lib/api.ts`, `web/src/contexts/AuthContext.tsx`
- `admin/src/lib/api.ts`
