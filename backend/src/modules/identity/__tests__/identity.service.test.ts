// Unit tests for the email-OTP flow (IdentityService) — this module had zero
// test coverage despite being the auth boundary for both login and registration.
// Prisma/mailer/audit are mocked so these tests never touch the real DB or send
// real email.

const mockPrisma = {
  emailOtp: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  deviceSession: {
    create: jest.fn(),
  },
  $transaction: jest.fn(async (ops: unknown[]) => Promise.all(ops as Promise<unknown>[])),
};

jest.mock('../../../core/prisma', () => ({ prisma: mockPrisma }));
jest.mock('../../../core/mailer', () => ({ sendMail: jest.fn().mockResolvedValue(undefined) }));
jest.mock('../../../core/audit', () => ({ auditLog: jest.fn() }));

import { IdentityService } from '../identity.service';

const FUTURE = new Date(Date.now() + 5 * 60 * 1000);
const PAST = new Date(Date.now() - 5 * 60 * 1000);

describe('IdentityService.verifyOtp', () => {
  beforeEach(() => jest.clearAllMocks());

  it('throws on unknown challengeId', async () => {
    mockPrisma.emailOtp.findUnique.mockResolvedValue(null);
    await expect(IdentityService.verifyOtp('bad-challenge', '123456')).rejects.toThrow(
      /không hợp lệ hoặc đã hết hạn/
    );
  });

  it('throws when the OTP was already used', async () => {
    mockPrisma.emailOtp.findUnique.mockResolvedValue({
      id: 'otp-1', usedAt: new Date(), expiresAt: FUTURE, attempts: 0, codeHash: 'x', userId: 'user-1',
    });
    await expect(IdentityService.verifyOtp('c1', '123456')).rejects.toThrow(/không hợp lệ hoặc đã hết hạn/);
  });

  it('throws when the OTP is expired', async () => {
    mockPrisma.emailOtp.findUnique.mockResolvedValue({
      id: 'otp-1', usedAt: null, expiresAt: PAST, attempts: 0, codeHash: 'x', userId: 'user-1',
    });
    await expect(IdentityService.verifyOtp('c1', '123456')).rejects.toThrow(/không hợp lệ hoặc đã hết hạn/);
  });

  it('throws (locked) once attempts reach the max, without checking the code', async () => {
    mockPrisma.emailOtp.findUnique.mockResolvedValue({
      id: 'otp-1', usedAt: null, expiresAt: FUTURE, attempts: 5, codeHash: 'x', userId: 'user-1',
    });
    await expect(IdentityService.verifyOtp('c1', '000000')).rejects.toThrow(/bị khoá do nhập sai quá nhiều lần/);
    expect(mockPrisma.emailOtp.update).not.toHaveBeenCalled();
  });

  it('increments attempts and throws on a wrong code, without creating a session', async () => {
    mockPrisma.emailOtp.findUnique.mockResolvedValue({
      id: 'otp-1', usedAt: null, expiresAt: FUTURE, attempts: 1, codeHash: 'correct-hash', userId: 'user-1',
    });
    await expect(IdentityService.verifyOtp('c1', '000000')).rejects.toThrow(/không đúng/);
    expect(mockPrisma.emailOtp.update).toHaveBeenCalledWith({
      where: { id: 'otp-1' },
      data: { attempts: { increment: 1 } },
    });
    expect(mockPrisma.deviceSession.create).not.toHaveBeenCalled();
  });

  it('rejects a correct-looking code when the OTP row has no userId (admin-reject branch)', async () => {
    // codeHash is sha256('123456') so the hash check itself passes — this
    // guards the theoretically-unreachable branch explicitly (see comment in
    // identity.service.ts) rather than trusting it silently.
    const crypto = require('crypto');
    const codeHash = crypto.createHash('sha256').update('123456').digest('hex');
    mockPrisma.emailOtp.findUnique.mockResolvedValue({
      id: 'otp-1', usedAt: null, expiresAt: FUTURE, attempts: 0, codeHash, userId: null,
    });
    await expect(IdentityService.verifyOtp('c1', '123456')).rejects.toThrow(/không hợp lệ hoặc đã hết hạn/);
  });

  it('marks the OTP used and creates a DeviceSession on a correct code', async () => {
    const crypto = require('crypto');
    const codeHash = crypto.createHash('sha256').update('123456').digest('hex');
    mockPrisma.emailOtp.findUnique.mockResolvedValue({
      id: 'otp-1', usedAt: null, expiresAt: FUTURE, attempts: 0, codeHash, userId: 'user-1',
    });
    mockPrisma.emailOtp.update.mockResolvedValue({});
    mockPrisma.deviceSession.create.mockResolvedValue({});

    const result = await IdentityService.verifyOtp('c1', '123456', 'iPhone', '1.2.3.4');

    expect(result.refreshToken).toEqual(expect.any(String));
    expect(result.expiresAt).toBeInstanceOf(Date);
    expect(mockPrisma.$transaction).toHaveBeenCalled();
  });
});

describe('IdentityService.requestOtp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma.emailOtp.findFirst.mockResolvedValue(null); // no cooldown by default
    mockPrisma.emailOtp.create.mockResolvedValue({});
  });

  it('short-circuits with the same challengeId when still in the resend cooldown', async () => {
    mockPrisma.emailOtp.findFirst.mockResolvedValue({ challengeId: 'existing-challenge', createdAt: new Date() });

    const result = await IdentityService.requestOtp('user@example.com');

    expect(result.challengeId).toBe('existing-challenge');
    expect(mockPrisma.emailOtp.create).not.toHaveBeenCalled();
    expect(mockPrisma.user.create).not.toHaveBeenCalled();
  });

  it('auto-creates a user for a brand-new email on normal (non-admin) login/register', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue({ id: 'new-user', email: 'new@example.com' });

    await IdentityService.requestOtp('new@example.com');

    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: { email: 'new@example.com', fullName: 'new' },
    });
    expect(mockPrisma.emailOtp.create).toHaveBeenCalled();
  });

  it('does NOT create a user or a real OTP when requireExistingAdminRole and the email has no admin account', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    const result = await IdentityService.requestOtp('not-admin@example.com', { requireExistingAdminRole: true });

    // Response still looks like success (anti-enumeration) but nothing real was created.
    expect(result.message).toMatch(/Nếu email hợp lệ/);
    expect(mockPrisma.user.create).not.toHaveBeenCalled();
    expect(mockPrisma.emailOtp.create).not.toHaveBeenCalled();
  });

  it('does NOT create a user or a real OTP when requireExistingAdminRole and the user exists but is not admin', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'user@example.com', role: 'user' });

    await IdentityService.requestOtp('user@example.com', { requireExistingAdminRole: true });

    expect(mockPrisma.emailOtp.create).not.toHaveBeenCalled();
  });

  it('sends a real OTP when requireExistingAdminRole and the account IS admin', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'admin-1', email: 'admin@example.com', role: 'admin' });

    await IdentityService.requestOtp('admin@example.com', { requireExistingAdminRole: true });

    expect(mockPrisma.emailOtp.create).toHaveBeenCalled();
  });
});
