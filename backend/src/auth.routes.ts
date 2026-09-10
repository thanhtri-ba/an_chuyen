import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { IdentityService } from './modules/identity/identity.service';
import { DEVICE_SESSION_COOKIE } from './modules/identity/identity.controller';

const router = Router();
const prisma = new PrismaClient();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function issueToken(user: { id: string; role: string; email: string | null }) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT configuration is missing');
  return jwt.sign({ role: user.role, email: user.email }, secret, { subject: user.id, expiresIn: '7d' });
}

router.post('/register', async (req, res) => {
  try {
    const { fullName, phone, email, password, otpChallengeId, otpCode } = req.body;

    if (!fullName || !phone || !password) {
      res.status(400).json({ message: 'Họ tên, số điện thoại và mật khẩu là bắt buộc' });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự' });
      return;
    }

    // Bắt buộc xác minh email bằng OTP trước khi tạo tài khoản mật khẩu mới
    // (POST /identity/otp/request-registration lấy otpChallengeId). Email vì
    // vậy giờ là bắt buộc cho đăng ký, khác trước đây (tuỳ chọn).
    if (!email || !otpChallengeId || !otpCode) {
      res.status(400).json({ message: 'Vui lòng xác minh email bằng mã OTP trước khi tạo tài khoản.' });
      return;
    }

    let verifiedEmail: string;
    try {
      verifiedEmail = await IdentityService.verifyRegistrationOtp(otpChallengeId, otpCode);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Xác minh email thất bại.' });
      return;
    }
    if (verifiedEmail !== String(email).trim().toLowerCase()) {
      res.status(400).json({ message: 'Email không khớp với email đã xác minh.' });
      return;
    }

    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { phone },
          ...(email ? [{ email }] : []),
        ],
      },
    });
    if (existing) {
      res.status(409).json({ message: 'Số điện thoại hoặc email đã được sử dụng' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        fullName,
        phone,
        email: verifiedEmail,
        password: hashedPassword,
        isEmailVerified: true,
      },
      select: {
        id: true,
        email: true,
        phone: true,
        fullName: true,
        role: true,
      },
    });

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ message: 'JWT configuration is missing' });
      return;
    }

    const token = jwt.sign(
      { role: user.role, email: user.email },
      secret,
      { subject: user.id, expiresIn: '7d' },
    );

    // Email vừa được xác minh bằng OTP ở chính luồng đăng ký (yêu cầu bắt
    // buộc phía trên) — đánh dấu luôn thiết bị này tin cậy để lần đăng nhập
    // kế tiếp không bị hỏi OTP thêm lần nữa (xem createDeviceSession).
    const deviceInfo = req.headers['user-agent'];
    const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress;
    const { refreshToken, expiresAt } = await IdentityService.createDeviceSession(user.id, deviceInfo, ipAddress);
    res.cookie(DEVICE_SESSION_COOKIE, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    });

    res.status(201).json({ token, user, isNewUser: true });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });
      return;
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { phone: email }
        ]
      },
      select: {
        id: true,
        email: true,
        role: true,
        password: true,
      },
    });

    if (!user || !user.password) {
      res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
      return;
    }

    // Thiết bị lạ (chưa từng đăng nhập trên trình duyệt này) hoặc phiên đã
    // hết hạn (DeviceSession hết hạn sau 60 ngày — nghĩa là "lâu rồi mới đăng
    // nhập lại") → bắt xác minh OTP qua email trước khi cấp JWT. Trình duyệt
    // đã có cookie phiên hợp lệ CỦA ĐÚNG tài khoản này thì bỏ qua, vào thẳng.
    const cookieToken = req.cookies?.[DEVICE_SESSION_COOKIE];
    const sessionUser = cookieToken ? await IdentityService.getSessionUser(cookieToken) : null;
    const isTrustedDevice = sessionUser?.id === user.id;

    if (!isTrustedDevice) {
      if (!user.email) {
        // Tài khoản không có email trên hồ sơ (hiếm — tạo trước khi email trở
        // thành bắt buộc) — không có nơi để gửi mã, đành cho qua như cũ thay
        // vì khoá luôn không cho đăng nhập.
      } else {
        const result = await IdentityService.requestOtp(user.email);
        res.json({
          requiresOtp: true,
          challengeId: result.challengeId,
          message: 'Thiết bị mới hoặc đã lâu chưa đăng nhập — vui lòng nhập mã xác minh vừa gửi tới email.',
          ...(('devCode' in result) ? { devCode: (result as any).devCode } : {}),
        });
        return;
      }
    }

    const token = issueToken(user);

    // Don't send password back in response
    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Bước 2 khi login.ts trả về requiresOtp:true — xác minh mã, cấp JWT + đánh
// dấu thiết bị này "đã tin cậy" (cookie DeviceSession, tái dùng đúng cơ chế
// của khách vãng lai) để lần đăng nhập sau trên CÙNG trình duyệt không bị
// hỏi OTP lại, cho tới khi cookie hết hạn (60 ngày không dùng).
router.post('/login/verify-otp', async (req, res) => {
  try {
    const { challengeId, code } = req.body;
    if (!challengeId || !code) {
      res.status(400).json({ message: 'Thiếu mã xác minh' });
      return;
    }

    const deviceInfo = req.headers['user-agent'];
    const ipAddress =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress;

    const { refreshToken, expiresAt } = await IdentityService.verifyOtp(challengeId, code, deviceInfo, ipAddress);

    const session = await prisma.deviceSession.findUnique({ where: { refreshToken } });
    const user = session
      ? await prisma.user.findUnique({
          where: { id: session.userId },
          select: { id: true, email: true, phone: true, fullName: true, role: true },
        })
      : null;
    if (!user) {
      res.status(400).json({ message: 'Xác minh thất bại.' });
      return;
    }

    res.cookie(DEVICE_SESSION_COOKIE, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    });

    const token = issueToken(user);
    res.json({ token, user });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Xác minh thất bại.' });
  }
});

// Đăng nhập/đăng ký bằng Google — nhận ID token do Google phát hành cho FE
// (Sign In With Google / One Tap), backend TỰ verify chữ ký + audience với
// Google chứ không tin bất kỳ payload nào client tự khai. Đây chính là bước
// xác thực danh tính, không phải chỉ đọc email ra rồi tin luôn.
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      res.status(400).json({ message: 'Thiếu credential từ Google' });
      return;
    }
    if (!process.env.GOOGLE_CLIENT_ID) {
      res.status(500).json({ message: 'Đăng nhập Google chưa được cấu hình trên server' });
      return;
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email) {
      res.status(401).json({ message: 'Token Google không hợp lệ' });
      return;
    }
    if (!payload.email_verified) {
      res.status(401).json({ message: 'Email Google chưa được xác minh' });
      return;
    }

    let user = await prisma.user.findFirst({
      where: { OR: [{ socialId: payload.sub }, { email: payload.email }] },
    });
    const isNewUser = !user;

    if (user) {
      // Tài khoản đã tồn tại (đăng ký trước bằng email/mật khẩu) — liên kết
      // thêm socialId để lần sau vào thẳng bằng Google, không tạo trùng user.
      if (!user.socialId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { socialId: payload.sub, isEmailVerified: true, lastLoginAt: new Date() },
        });
      } else {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });
      }
    } else {
      // Tài khoản mới qua Google chưa có số điện thoại (phone giờ nullable) —
      // khách cần bổ sung SĐT sau ở trang hồ sơ trước khi đặt vé cần liên hệ.
      user = await prisma.user.create({
        data: {
          email: payload.email,
          fullName: payload.name || payload.email.split('@')[0],
          avatar: payload.picture || undefined,
          socialId: payload.sub,
          isEmailVerified: true,
          lastLoginAt: new Date(),
        },
      });
    }

    if (user.isBanned) {
      res.status(403).json({ message: 'Tài khoản của bạn đã bị khoá' });
      return;
    }

    const token = issueToken(user);
    const { password: _pw, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword, isNewUser });
  } catch (error) {
    res.status(401).json({ message: 'Xác thực Google thất bại' });
  }
});

// Quên mật khẩu: phát hành token 1 lần, hết hạn 30 phút, hash trước khi lưu DB
// (giống cách lưu password) — lộ DB không đồng nghĩa với việc kẻ tấn công có
// token dùng được. Luôn trả về cùng 1 thông báo dù email có tồn tại hay không,
// để không lộ email nào đã đăng ký (chống user enumeration).
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Vui lòng nhập email' });
    }

    const genericResponse = {
      message: 'Nếu email tồn tại trong hệ thống, chúng tôi đã gửi link đặt lại mật khẩu.',
    };

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Vẫn trả 200 với thông báo chung — không tiết lộ email có tồn tại hay không.
      return res.json(genericResponse);
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt },
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontendUrl}/reset-password?token=${rawToken}`;

    // CHƯA có email provider (SMTP/Resend/SendGrid) được cấu hình trong .env.
    // Cần cấu hình email provider thật trước khi lên production, nếu không
    // người dùng sẽ không nhận được gì. Token KHÔNG được log hay trả về API
    // response — cả hai đều lộ nguyên token dùng để chiếm tài khoản. Chỉ khi
    // dev bật rõ ràng cờ riêng ALLOW_DEV_RESET_LINK (không dùng chung NODE_ENV,
    // để tránh lộ token trên môi trường staging/preview quên set NODE_ENV) thì
    // mới trả link ra để test thủ công cục bộ.
    const allowDevResetLink =
      process.env.NODE_ENV === 'development' && process.env.ALLOW_DEV_RESET_LINK === 'true';

    const responseBody: Record<string, string> = allowDevResetLink
      ? { ...genericResponse, devResetLink: resetLink }
      : genericResponse;

    res.json(responseBody);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Thiếu token hoặc mật khẩu mới' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự' });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const resetToken = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.$transaction([
      prisma.user.update({ where: { id: resetToken.userId }, data: { password: hashedPassword } }),
      prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } }),
    ]);

    res.json({ message: 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

import { verifyAccessToken } from './middleware/auth.middleware';

router.get('/profile', verifyAccessToken as any, async (req: any, res: any) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        fullName: true,
        gender: true,
        avatar: true,
        role: true,
        profile: {
          select: {
            address: true,
            dob: true,
            idCard: true,
            emergencyPhone: true,
            nationality: true,
            occupation: true,
          }
        },
        wallet: {
          select: { balance: true }
        },
        loyalty: {
          select: { points: true, tier: true }
        },
        _count: {
          select: { bookings: true }
        }
      }
    });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/profile', verifyAccessToken as any, async (req: any, res: any) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { fullName, phone, gender, address, dob, idCard, emergencyPhone, nationality, occupation } = req.body;

    if (phone !== undefined && phone !== null && phone !== '' && !/^0\d{9,10}$/.test(phone)) {
      res.status(400).json({ message: 'Số điện thoại không hợp lệ (VD: 0912345678)' });
      return;
    }
    if (idCard !== undefined && idCard !== null && idCard !== '' && !/^\d{9}(\d{3})?$/.test(idCard)) {
      res.status(400).json({ message: 'Số CCCD/CMND phải có 9 hoặc 12 chữ số' });
      return;
    }

    // Update user info and upsert profile address
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName,
        phone,
        gender,
        profile: (address !== undefined || dob !== undefined || idCard !== undefined || emergencyPhone !== undefined || nationality !== undefined || occupation !== undefined) ? {
          upsert: {
            create: { address, dob, idCard, emergencyPhone, nationality, occupation },
            update: { address, dob, idCard, emergencyPhone, nationality, occupation }
          }
        } : undefined
      },
      select: {
        id: true,
        email: true,
        phone: true,
        fullName: true,
        gender: true,
        avatar: true,
        role: true,
        profile: {
          select: {
            address: true,
            dob: true,
            idCard: true,
            emergencyPhone: true,
            nationality: true,
            occupation: true,
          }
        }
      }
    });
    res.json({ success: true, data: user });
  } catch (error: any) {
    if (error?.code === 'P2002' && error?.meta?.target?.includes?.('phone')) {
      res.status(409).json({ message: 'Số điện thoại này đã được sử dụng bởi tài khoản khác' });
      return;
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
