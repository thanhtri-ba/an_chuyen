import type { NextFunction, Request, Response } from 'express';
import { IdentityService } from '../modules/identity/identity.service';
import { DEVICE_SESSION_COOKIE } from '../modules/identity/identity.controller';

export interface DeviceSessionRequest extends Request {
  identityUser?: { id: string; role: string; email: string | null };
}

// Đọc cookie phiên thiết bị (Email+OTP) nếu có — KHÔNG bao giờ tự trả 401,
// chỉ gắn req.identityUser nếu tìm thấy phiên hợp lệ. Route gọi middleware
// này tự quyết định phải làm gì khi thiếu (vd. bắt OTP lại), khác hẳn
// verifyAccessToken (auth.middleware.ts) vốn bắt buộc có token hợp lệ.
export async function deviceSessionAuth(
  req: DeviceSessionRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const token = req.cookies?.[DEVICE_SESSION_COOKIE];
  if (!token) {
    next();
    return;
  }

  const user = await IdentityService.getSessionUser(token);
  if (user) {
    req.identityUser = { id: user.id, role: user.role, email: user.email };
  }
  next();
}
