import type { NextFunction, Request, Response } from 'express';
import { IdentityService } from '../modules/identity/identity.service';
import { DEVICE_SESSION_COOKIE } from '../modules/identity/identity.controller';
import type { AuthenticatedRequest } from './auth.middleware';
import type { DeviceSessionRequest } from './deviceSession.middleware';

type GuestRequest = AuthenticatedRequest & DeviceSessionRequest;

// Chỉ dùng cho POST /bookings/create: nếu khách CHƯA có danh tính nào (không
// JWT, không phiên thiết bị cũ) nhưng có gửi kèm email trong body, tự
// find-or-create user theo email đó và cấp luôn DeviceSession — KHÔNG bắt
// OTP (xem docs/architecture/REDESIGN-PLAN.md, quyết định bỏ OTP khỏi luồng
// đặt vé). Chạy TRƯỚC requireAnyIdentity trong route chain.
export async function guestBookingIdentity(
  req: GuestRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (req.user || req.identityUser) {
    next();
    return;
  }

  const email = req.body?.contactEmail;
  if (!email || typeof email !== 'string') {
    next();
    return;
  }

  try {
    const { user, refreshToken, expiresAt } = await IdentityService.identifyGuestByEmail(
      email,
      req.headers['user-agent'],
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress,
    );
    req.identityUser = { id: user.id, role: user.role, email: user.email };
    res.cookie(DEVICE_SESSION_COOKIE, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    });
  } catch {
    // Bỏ qua — để requireAnyIdentity trả 401 như bình thường nếu không tạo
    // được danh tính (vd email không hợp lệ theo Zod ở booking.controller.ts
    // sẽ tự chặn trước khi tới đây trong đa số trường hợp).
  }
  next();
}
