import type { NextFunction, Response } from 'express';
import type { AuthenticatedRequest } from './auth.middleware';
import type { DeviceSessionRequest } from './deviceSession.middleware';

type CombinedRequest = AuthenticatedRequest & DeviceSessionRequest;

// Chấp nhận HOẶC tài khoản mật khẩu cũ (JWT, gắn req.user bởi optionalAuth)
// HOẶC danh tính thụ động Email+OTP (gắn req.identityUser bởi
// deviceSessionAuth) — hoàn thiện luồng "khách vãng lai không cần tài khoản"
// (xem docs/architecture/REDESIGN-PLAN.md). Dùng SAU CẢ HAI middleware đó
// trong route chain: `optionalAuth, deviceSessionAuth, requireAnyIdentity`.
//
// Nếu chỉ có identityUser (không có JWT), gán thẳng vào req.user để mọi
// controller hiện có (đọc req.user?.id/role) không cần sửa gì thêm.
export function requireAnyIdentity(req: CombinedRequest, res: Response, next: NextFunction): void {
  if (!req.user && req.identityUser) {
    req.user = { id: req.identityUser.id, role: req.identityUser.role, email: req.identityUser.email ?? undefined };
  }
  if (!req.user) {
    res.status(401).json({ message: 'Vui lòng đăng nhập hoặc xác minh email để tiếp tục.' });
    return;
  }
  next();
}
