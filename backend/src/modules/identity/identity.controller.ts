import type { Request, Response } from 'express';
import { z } from 'zod';
import { IdentityService } from './identity.service';
import { logger } from '../../core/logger';

export const DEVICE_SESSION_COOKIE = 'anchuyen_device_session';

const requestOtpSchema = z.object({ email: z.string().trim().email() });
const verifyOtpSchema = z.object({
  challengeId: z.string().uuid(),
  code: z.string().length(6),
});
const lookupOrderSchema = z.object({
  email: z.string().trim().email(),
  bookingId: z.string().uuid(),
});

function requestMeta(req: Request) {
  return {
    deviceInfo: req.headers['user-agent'],
    ipAddress: (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress,
  };
}

function setDeviceSessionCookie(res: Response, refreshToken: string, expiresAt: Date) {
  res.cookie(DEVICE_SESSION_COOKIE, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });
}

export const requestOtp = async (req: Request, res: Response) => {
  try {
    const { email } = requestOtpSchema.parse(req.body);
    const result = await IdentityService.requestOtp(email);
    res.json(result);
  } catch (error: any) {
    if (error?.issues) return res.status(400).json({ message: 'Email không hợp lệ.' });
    logger.error('identity.requestOtp failed', { error: error?.message });
    res.status(500).json({ message: 'Không thể xử lý yêu cầu. Vui lòng thử lại sau.' });
  }
};

// Nhánh riêng cho đăng nhập admin — không auto-create tài khoản, xem
// IdentityService.requestOtp({ requireExistingAdminRole: true }).
export const requestAdminOtp = async (req: Request, res: Response) => {
  try {
    const { email } = requestOtpSchema.parse(req.body);
    const result = await IdentityService.requestOtp(email, { requireExistingAdminRole: true });
    res.json(result);
  } catch (error: any) {
    if (error?.issues) return res.status(400).json({ message: 'Email không hợp lệ.' });
    res.status(500).json({ message: 'Không thể xử lý yêu cầu. Vui lòng thử lại sau.' });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { challengeId, code } = verifyOtpSchema.parse(req.body);
    const deviceInfo = req.headers['user-agent'];
    const ipAddress =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress;

    const { refreshToken, expiresAt } = await IdentityService.verifyOtp(
      challengeId,
      code,
      deviceInfo,
      ipAddress,
    );

    setDeviceSessionCookie(res, refreshToken, expiresAt);
    res.json({ message: 'Xác minh thành công.' });
  } catch (error: any) {
    if (error?.issues) return res.status(400).json({ message: 'Dữ liệu không hợp lệ.' });
    res.status(400).json({ message: error.message || 'Xác minh thất bại.' });
  }
};

// Tra cứu lịch sử đặt vé bằng email + mã đơn hàng — thay cho OTP (xem
// IdentityService.lookupByOrder). Thành công thì cấp luôn DeviceSession,
// những lần sau tự nhận diện qua GET /session, không cần tra lại.
export const lookupOrder = async (req: Request, res: Response) => {
  try {
    const { email, bookingId } = lookupOrderSchema.parse(req.body);
    const { deviceInfo, ipAddress } = requestMeta(req);

    const { refreshToken, expiresAt } = await IdentityService.lookupByOrder(
      email,
      bookingId,
      deviceInfo,
      ipAddress,
    );

    setDeviceSessionCookie(res, refreshToken, expiresAt);
    res.json({ message: 'Tra cứu thành công.' });
  } catch (error: any) {
    if (error?.issues) return res.status(400).json({ message: 'Vui lòng nhập đúng email và mã đơn hàng.' });
    res.status(404).json({ message: error.message || 'Không tìm thấy đơn hàng khớp với email này.' });
  }
};

export const getSession = async (req: Request, res: Response) => {
  const token = req.cookies?.[DEVICE_SESSION_COOKIE];
  if (!token) return res.status(401).json({ message: 'Chưa đăng nhập.' });

  const user = await IdentityService.getSessionUser(token);
  if (!user) return res.status(401).json({ message: 'Phiên đã hết hạn.' });

  res.json({ user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role } });
};

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies?.[DEVICE_SESSION_COOKIE];
  if (token) await IdentityService.revokeSession(token);
  res.clearCookie(DEVICE_SESSION_COOKIE, { path: '/' });
  res.json({ message: 'Đã đăng xuất.' });
};
