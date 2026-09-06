import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { requestOtp, requestAdminOtp, verifyOtp, lookupOrder, getSession, logout } from './identity.controller';

export const identityRoutes = Router();

// Cùng cấu hình với authLimiter trong index.ts (chống brute-force theo IP).
// Giới hạn theo EMAIL cụ thể (chống spam 1 nạn nhân) nằm ở tầng service
// (cooldown trong IdentityService.requestOtp), vì limiter theo IP không đủ —
// kẻ tấn công có thể đổi IP nhưng không đổi được email nạn nhân.
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Quá nhiều yêu cầu, vui lòng thử lại sau.' },
});

identityRoutes.post('/otp/request', otpLimiter, requestOtp);
identityRoutes.post('/otp/request-admin', otpLimiter, requestAdminOtp);
identityRoutes.post('/otp/verify', otpLimiter, verifyOtp);
// Tra cứu vé cũ bằng email + mã đơn hàng — thay OTP cho khách vãng lai (xem
// docs/architecture/REDESIGN-PLAN.md). Cùng giới hạn tần suất với OTP vì đây
// cũng là 1 dạng "đoán/thử" (dò mã đơn hàng theo 1 email).
identityRoutes.post('/lookup-order', otpLimiter, lookupOrder);
identityRoutes.get('/session', getSession);
identityRoutes.post('/logout', logout);
