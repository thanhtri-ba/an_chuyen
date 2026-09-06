import crypto from 'crypto';
import { prisma } from '../../core/prisma';
import { sendMail } from '../../core/mailer';
import { otpEmailTemplate } from '../../core/emailTemplates/otp';
import { auditLog } from '../../core/audit';

const OTP_TTL_MINUTES = Number(process.env.OTP_TTL_MINUTES) || 10;
const OTP_MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS) || 5;
const OTP_RESEND_COOLDOWN_SECONDS = Number(process.env.OTP_RESEND_COOLDOWN_SECONDS) || 60;
const DEVICE_SESSION_DAYS = 60;

// Luôn trả về đúng 1 câu này bất kể email cũ/mới/không hợp lệ theo role yêu
// cầu — chống dò xem 1 email có tài khoản hay không (xem REDESIGN-PLAN.md,
// rủi ro #1 và #8).
const GENERIC_OTP_RESPONSE = { message: 'Nếu email hợp lệ, mã xác minh đã được gửi.' };

function generateOtpCode(): string {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, '0');
}

function hashCode(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex');
}

export interface RequestOtpOptions {
  // true cho luồng đăng nhập admin: KHÔNG được tự tạo user mới, chỉ gửi mã
  // thật nếu email đã tồn tại sẵn với role='admin' — nhưng response trả về
  // vẫn giống hệt trường hợp thành công để không lộ email đó có phải admin.
  requireExistingAdminRole?: boolean;
}

export class IdentityService {
  static async requestOtp(email: string, options: RequestOtpOptions = {}) {
    const normalizedEmail = email.trim().toLowerCase();

    // Cooldown chống spam gửi OTP theo email — kiểm tra trước khi biết user
    // có tồn tại hay không, response vẫn y hệt nếu đang trong cooldown.
    const lastOtp = await prisma.emailOtp.findFirst({
      where: { email: normalizedEmail },
      orderBy: { createdAt: 'desc' },
    });
    if (lastOtp && Date.now() - lastOtp.createdAt.getTime() < OTP_RESEND_COOLDOWN_SECONDS * 1000) {
      return { ...GENERIC_OTP_RESPONSE, challengeId: lastOtp.challengeId };
    }

    let user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (options.requireExistingAdminRole) {
      if (!user || user.role !== 'admin') {
        // Không auto-create, không gửi mail thật cho nhánh admin — nhưng vẫn
        // trả về 1 challengeId hợp lệ (không trỏ tới OTP nào thật) để hành vi
        // bên ngoài giống hệt trường hợp thành công.
        return { ...GENERIC_OTP_RESPONSE, challengeId: crypto.randomUUID() };
      }
    } else if (!user) {
      try {
        user = await prisma.user.create({
          data: { email: normalizedEmail, fullName: normalizedEmail.split('@')[0] },
        });
      } catch (error: any) {
        // Race condition: 2 request cùng email mới gần như đồng thời đều thấy
        // "chưa có" rồi cùng cố tạo — request thua đụng unique constraint,
        // coi như user đã tồn tại thay vì lỗi 500 (REDESIGN-PLAN.md rủi ro #5).
        if (error?.code === 'P2002') {
          user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        } else {
          throw error;
        }
      }
    }

    const code = generateOtpCode();
    const challengeId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

    await prisma.emailOtp.create({
      data: {
        userId: user?.id ?? null,
        email: normalizedEmail,
        codeHash: hashCode(code),
        challengeId,
        expiresAt,
      },
    });

    auditLog({
      event: 'OtpRequested',
      actorId: user?.id || 'anonymous',
      actorRole: options.requireExistingAdminRole ? 'admin' : 'user',
      resourceType: 'email_otp',
      resourceId: challengeId,
      outcome: 'success',
    });

    // KHÔNG await — nếu chờ email API trả lời trước khi response, nhánh gửi
    // mã thật sẽ luôn chậm hơn hẳn 2 nhánh "giả" ở trên (cooldown, admin
    // không tồn tại), tự tạo ra timing side-channel để dò email/quyền admin
    // dù response body giống hệt nhau (rủi ro #1). Lỗi gửi mail chỉ log lại,
    // không ảnh hưởng response khách nhận được.
    const { subject, html } = otpEmailTemplate(code, OTP_TTL_MINUTES);
    sendMail({ to: normalizedEmail, subject, html }).catch(() => {
      // đã log bên trong mailer.ts, không cần log lại ở đây
    });

    // Dev-only: trả thẳng mã ra response để test local không cần đọc log
    // mailer. Tách biệt với ALLOW_DEV_AUTH_FALLBACK (auth.middleware.ts) —
    // đây chỉ echo mã OTP, không tự đăng nhập ai.
    const allowDevOtpEcho =
      process.env.NODE_ENV === 'development' && process.env.ALLOW_DEV_OTP_ECHO === 'true';

    return {
      ...GENERIC_OTP_RESPONSE,
      challengeId,
      ...(allowDevOtpEcho ? { devCode: code } : {}),
    };
  }

  static async verifyOtp(challengeId: string, code: string, deviceInfo?: string, ipAddress?: string) {
    const otp = await prisma.emailOtp.findUnique({ where: { challengeId } });

    if (!otp || otp.usedAt || otp.expiresAt < new Date()) {
      throw new Error('Mã xác minh không hợp lệ hoặc đã hết hạn.');
    }

    if (otp.attempts >= OTP_MAX_ATTEMPTS) {
      throw new Error('Mã xác minh đã bị khoá do nhập sai quá nhiều lần. Vui lòng yêu cầu mã mới.');
    }

    if (hashCode(code) !== otp.codeHash) {
      await prisma.emailOtp.update({ where: { id: otp.id }, data: { attempts: { increment: 1 } } });
      auditLog({
        event: 'OtpFailed',
        actorId: otp.userId || 'anonymous',
        actorRole: 'user',
        resourceType: 'email_otp',
        resourceId: challengeId,
        outcome: 'failure',
      });
      throw new Error('Mã xác minh không đúng.');
    }

    // userId null nghĩa là dòng OTP này thuộc nhánh admin-reject/race-hiếm ở
    // requestOtp — không có mã thật nào từng được gửi khớp challengeId đó,
    // nên nhánh này về lý thuyết không thể đi tới đây (codeHash sẽ không bao
    // giờ khớp), giữ lại như một lớp chặn tường minh thay vì im lặng tin cậy.
    if (!otp.userId) {
      throw new Error('Mã xác minh không hợp lệ hoặc đã hết hạn.');
    }

    const refreshToken = crypto.randomBytes(48).toString('hex');
    const expiresAt = new Date(Date.now() + DEVICE_SESSION_DAYS * 24 * 60 * 60 * 1000);

    await prisma.$transaction([
      prisma.emailOtp.update({ where: { id: otp.id }, data: { usedAt: new Date() } }),
      prisma.deviceSession.create({
        data: { userId: otp.userId, refreshToken, deviceInfo, ipAddress, expiresAt },
      }),
    ]);

    auditLog({
      event: 'OtpVerified',
      actorId: otp.userId,
      actorRole: 'user',
      resourceType: 'email_otp',
      resourceId: challengeId,
      outcome: 'success',
    });

    return { refreshToken, expiresAt };
  }

  // Xác minh email TRƯỚC KHI tạo tài khoản mật khẩu mới (auth.routes.ts
  // POST /register) — khác hẳn requestOtp/identifyGuestByEmail ở trên: CHỦ Ý
  // KHÔNG tự tạo User ở bước này vì tài khoản chưa nên tồn tại cho tới khi cả
  // OTP đúng LẪN mật khẩu hợp lệ đều đã có (userId để null trên dòng EmailOtp).
  static async requestRegistrationOtp(email: string) {
    const normalizedEmail = email.trim().toLowerCase();

    const lastOtp = await prisma.emailOtp.findFirst({
      where: { email: normalizedEmail, userId: null },
      orderBy: { createdAt: 'desc' },
    });
    if (lastOtp && Date.now() - lastOtp.createdAt.getTime() < OTP_RESEND_COOLDOWN_SECONDS * 1000) {
      return { ...GENERIC_OTP_RESPONSE, challengeId: lastOtp.challengeId };
    }

    const code = generateOtpCode();
    const challengeId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

    await prisma.emailOtp.create({
      data: { userId: null, email: normalizedEmail, codeHash: hashCode(code), challengeId, expiresAt },
    });

    auditLog({
      event: 'OtpRequested',
      actorId: 'anonymous',
      actorRole: 'user',
      resourceType: 'email_otp',
      resourceId: challengeId,
      outcome: 'success',
    });

    const { subject, html } = otpEmailTemplate(code, OTP_TTL_MINUTES);
    sendMail({ to: normalizedEmail, subject, html }).catch(() => {});

    const allowDevOtpEcho =
      process.env.NODE_ENV === 'development' && process.env.ALLOW_DEV_OTP_ECHO === 'true';

    return {
      ...GENERIC_OTP_RESPONSE,
      challengeId,
      ...(allowDevOtpEcho ? { devCode: code } : {}),
    };
  }

  // Đối chiếu mã OTP đăng ký — trả về email (normalized) đã thật sự được xác
  // minh, để auth.routes.ts so khớp với email trong form đăng ký (chống dùng
  // 1 challengeId xác minh email A rồi đăng ký tài khoản với email B).
  static async verifyRegistrationOtp(challengeId: string, code: string): Promise<string> {
    const otp = await prisma.emailOtp.findUnique({ where: { challengeId } });

    if (!otp || otp.usedAt || otp.expiresAt < new Date()) {
      throw new Error('Mã xác minh không hợp lệ hoặc đã hết hạn.');
    }
    if (otp.attempts >= OTP_MAX_ATTEMPTS) {
      throw new Error('Mã xác minh đã bị khoá do nhập sai quá nhiều lần. Vui lòng yêu cầu mã mới.');
    }
    if (hashCode(code) !== otp.codeHash) {
      await prisma.emailOtp.update({ where: { id: otp.id }, data: { attempts: { increment: 1 } } });
      auditLog({
        event: 'OtpFailed',
        actorId: 'anonymous',
        actorRole: 'user',
        resourceType: 'email_otp',
        resourceId: challengeId,
        outcome: 'failure',
      });
      throw new Error('Mã xác minh không đúng.');
    }

    await prisma.emailOtp.update({ where: { id: otp.id }, data: { usedAt: new Date() } });
    auditLog({
      event: 'OtpVerified',
      actorId: 'anonymous',
      actorRole: 'user',
      resourceType: 'email_otp',
      resourceId: challengeId,
      outcome: 'success',
    });

    return otp.email;
  }

  // Danh tính khách vãng lai KHÔNG qua OTP — dùng lúc tạo booking (xem
  // guestBookingIdentity.middleware.ts). Chỉ find-or-create theo email +
  // cấp luôn 1 DeviceSession, không xác minh email có thật thuộc về khách
  // hay không (quyết định có chủ đích: OTP gây ma sát không cần thiết cho
  // 1 hệ thống đặt vé, không phải ngân hàng — xem REDESIGN-PLAN.md).
  static async identifyGuestByEmail(email: string, deviceInfo?: string, ipAddress?: string) {
    const normalizedEmail = email.trim().toLowerCase();

    let user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      try {
        user = await prisma.user.create({
          data: { email: normalizedEmail, fullName: normalizedEmail.split('@')[0] },
        });
      } catch (error: any) {
        // Race condition tạo trùng email — coi như đã tồn tại (rủi ro #5).
        if (error?.code === 'P2002') {
          user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        } else {
          throw error;
        }
      }
    }
    if (!user) throw new Error('Không thể xác định danh tính từ email.');

    const refreshToken = crypto.randomBytes(48).toString('hex');
    const expiresAt = new Date(Date.now() + DEVICE_SESSION_DAYS * 24 * 60 * 60 * 1000);
    await prisma.deviceSession.create({
      data: { userId: user.id, refreshToken, deviceInfo, ipAddress, expiresAt },
    });

    auditLog({
      event: 'GuestSessionCreated',
      actorId: user.id,
      actorRole: 'user',
      resourceType: 'device_session',
      resourceId: user.id,
      outcome: 'success',
    });

    return { user, refreshToken, expiresAt };
  }

  // Tra cứu lịch sử đặt vé bằng email + mã đơn hàng (Booking.id — UUID không
  // đoán được) — thay cho OTP. Biết đúng 1 mã đơn hàng thuộc về email đó là
  // đủ bằng chứng để tin tưởng (đã nhận email xác nhận, hoặc chính là người
  // đặt), cấp DeviceSession để những lần sau tự nhận diện không cần nhập lại.
  static async lookupByOrder(email: string, bookingId: string, deviceInfo?: string, ipAddress?: string) {
    const normalizedEmail = email.trim().toLowerCase();

    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, user: { email: normalizedEmail } },
      select: { userId: true },
    });

    if (!booking) {
      auditLog({
        event: 'OrderLookupFailed',
        actorId: 'anonymous',
        actorRole: 'user',
        resourceType: 'booking',
        resourceId: bookingId,
        outcome: 'failure',
      });
      throw new Error('Không tìm thấy đơn hàng khớp với email này.');
    }

    const refreshToken = crypto.randomBytes(48).toString('hex');
    const expiresAt = new Date(Date.now() + DEVICE_SESSION_DAYS * 24 * 60 * 60 * 1000);
    await prisma.deviceSession.create({
      data: { userId: booking.userId, refreshToken, deviceInfo, ipAddress, expiresAt },
    });

    auditLog({
      event: 'OrderLookupSucceeded',
      actorId: booking.userId,
      actorRole: 'user',
      resourceType: 'booking',
      resourceId: bookingId,
      outcome: 'success',
    });

    return { refreshToken, expiresAt };
  }

  static async getSessionUser(refreshToken: string) {
    const session = await prisma.deviceSession.findUnique({ where: { refreshToken } });
    if (!session || session.revokedAt || session.expiresAt < new Date()) return null;

    await prisma.deviceSession.update({ where: { id: session.id }, data: { lastSeenAt: new Date() } });

    return prisma.user.findUnique({ where: { id: session.userId } });
  }

  static async revokeSession(refreshToken: string) {
    await prisma.deviceSession.updateMany({
      where: { refreshToken },
      data: { revokedAt: new Date() },
    });
  }
}
