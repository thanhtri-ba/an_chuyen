// Unit tests for confirmPaymentSuccess — the single idempotent entry point
// every payment gateway (VNPay return/IPN, SePay webhook, mock gateway...)
// calls to mark a booking paid. No test coverage existed for this despite it
// being the exact place a retried/duplicate webhook could double-process a
// real payment if the idempotency check ever regressed.

const mockTx = {
  payment: { update: jest.fn() },
  booking: { update: jest.fn() },
  seatBooking: { findMany: jest.fn() },
  seat: { updateMany: jest.fn() },
};

const mockPrisma = {
  payment: { findUnique: jest.fn(), update: jest.fn() },
  $transaction: jest.fn(async (cb: (tx: typeof mockTx) => unknown) => cb(mockTx)),
};

jest.mock('@prisma/client', () => ({ PrismaClient: jest.fn(() => mockPrisma) }));
jest.mock('../../booking/booking.email', () => ({ sendETicketEmail: jest.fn() }));

import { confirmPaymentSuccess, markPaymentFailed } from '../confirm.util';
import { sendETicketEmail } from '../../booking/booking.email';

describe('confirmPaymentSuccess', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns PAYMENT_NOT_FOUND when the booking has no payment record', async () => {
    mockPrisma.payment.findUnique.mockResolvedValue(null);

    const result = await confirmPaymentSuccess('booking-1', 'vnpay', 'txn-1');

    expect(result).toEqual({ ok: false, reason: 'PAYMENT_NOT_FOUND' });
    expect(mockPrisma.$transaction).not.toHaveBeenCalled();
  });

  it('is idempotent: a payment already PAID is reported as already-processed without re-running the transaction', async () => {
    mockPrisma.payment.findUnique.mockResolvedValue({ id: 'pay-1', bookingId: 'booking-1', status: 'PAID' });

    const result = await confirmPaymentSuccess('booking-1', 'vnpay', 'txn-retry');

    expect(result).toEqual({ ok: true, alreadyProcessed: true });
    expect(mockPrisma.$transaction).not.toHaveBeenCalled();
    expect(sendETicketEmail).not.toHaveBeenCalled();
  });

  it('rejects a payment that is neither PENDING nor PAID (e.g. already FAILED)', async () => {
    mockPrisma.payment.findUnique.mockResolvedValue({ id: 'pay-1', bookingId: 'booking-1', status: 'FAILED' });

    const result = await confirmPaymentSuccess('booking-1', 'vnpay', 'txn-1');

    expect(result).toEqual({ ok: false, reason: 'INVALID_STATUS' });
    expect(mockPrisma.$transaction).not.toHaveBeenCalled();
  });

  it('on a PENDING payment: marks it PAID, confirms the booking, books the seats, and emails the e-ticket', async () => {
    mockPrisma.payment.findUnique.mockResolvedValue({ id: 'pay-1', bookingId: 'booking-1', status: 'PENDING' });
    mockTx.seatBooking.findMany.mockResolvedValue([{ seatId: 'seat-a' }, { seatId: 'seat-b' }]);

    const result = await confirmPaymentSuccess('booking-1', 'vnpay', 'txn-1');

    expect(result).toEqual({ ok: true, alreadyProcessed: false });
    expect(mockTx.payment.update).toHaveBeenCalledWith({
      where: { id: 'pay-1' },
      data: { status: 'PAID', gateway: 'vnpay', transactionId: 'txn-1' },
    });
    expect(mockTx.booking.update).toHaveBeenCalledWith({
      where: { id: 'booking-1' },
      data: { status: 'CONFIRMED' },
    });
    expect(mockTx.seat.updateMany).toHaveBeenCalledWith({
      where: { id: { in: ['seat-a', 'seat-b'] } },
      data: { status: 'BOOKED' },
    });
    expect(sendETicketEmail).toHaveBeenCalledWith('booking-1');
  });

  it('does not touch seats when the booking somehow has no seatBookings rows', async () => {
    mockPrisma.payment.findUnique.mockResolvedValue({ id: 'pay-1', bookingId: 'booking-1', status: 'PENDING' });
    mockTx.seatBooking.findMany.mockResolvedValue([]);

    await confirmPaymentSuccess('booking-1', 'vnpay', 'txn-1');

    expect(mockTx.seat.updateMany).not.toHaveBeenCalled();
  });
});

describe('markPaymentFailed', () => {
  beforeEach(() => jest.clearAllMocks());

  it('marks a PENDING payment as FAILED', async () => {
    mockPrisma.payment.findUnique.mockResolvedValue({ id: 'pay-1', status: 'PENDING' });

    await markPaymentFailed('booking-1');

    expect(mockPrisma.payment.update).toHaveBeenCalledWith({ where: { id: 'pay-1' }, data: { status: 'FAILED' } });
  });

  it('does nothing if the payment is already PAID (never downgrade a real payment)', async () => {
    mockPrisma.payment.findUnique.mockResolvedValue({ id: 'pay-1', status: 'PAID' });

    await markPaymentFailed('booking-1');

    expect(mockPrisma.payment.update).not.toHaveBeenCalled();
  });

  it('does nothing if there is no payment record', async () => {
    mockPrisma.payment.findUnique.mockResolvedValue(null);

    await markPaymentFailed('booking-1');

    expect(mockPrisma.payment.update).not.toHaveBeenCalled();
  });
});
