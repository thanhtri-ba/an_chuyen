// Unit tests for BookingService.createBooking's anti-double-booking logic —
// the atomic conditional seat lock added to fix the real race condition where
// two concurrent requests could both pass the "is this seat free?" check before
// either finished writing. Prisma is fully mocked; no real DB is touched.

const mockTx = {
  tripSchedule: { findUnique: jest.fn() },
  seat: { findMany: jest.fn(), updateMany: jest.fn() },
  wallet: { findUnique: jest.fn(), update: jest.fn() },
  booking: { create: jest.fn(), update: jest.fn(), findUnique: jest.fn() },
  ticket: { createMany: jest.fn() },
  payment: { create: jest.fn(), update: jest.fn(), findUnique: jest.fn() },
  walletTransaction: { create: jest.fn() },
};

const mockPrismaClient = {
  ...mockTx,
  $transaction: jest.fn(async (cb: (tx: typeof mockTx) => unknown) => cb(mockTx)),
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrismaClient),
  SeatStatus: { AVAILABLE: 'AVAILABLE', LOCKED: 'LOCKED', BOOKED: 'BOOKED' },
}));

import { BookingService } from '../booking.service';

const TRIP_SCHEDULE = { id: 'trip-1', prices: [{ seatClass: 'ECONOMY', price: 200000 }] };
const SEAT_A = { id: 'seat-a', seatNumber: 'T1-5A', status: 'AVAILABLE', lockedBy: null };

function resetMocks() {
  jest.clearAllMocks();
  mockTx.tripSchedule.findUnique.mockResolvedValue(TRIP_SCHEDULE);
  mockTx.booking.create.mockResolvedValue({ id: 'booking-1', passengers: [{ id: 'p1' }] });
}

describe('BookingService.createBooking', () => {
  beforeEach(resetMocks);

  const baseParams = {
    userId: 'user-1',
    tripScheduleId: 'trip-1',
    seatNumbers: ['T1-5A'],
    passengers: [{ name: 'Nguyen Van A' }],
  };

  it('creates a booking and locks the seat when it is AVAILABLE', async () => {
    mockTx.seat.findMany.mockResolvedValue([SEAT_A]);
    mockTx.seat.updateMany.mockResolvedValue({ count: 1 });

    await BookingService.createBooking(baseParams);

    expect(mockTx.seat.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: 'LOCKED', lockedBy: null, lockExpiresAt: null }),
      })
    );
    expect(mockTx.booking.create).toHaveBeenCalled();
  });

  it('accepts a seat already held (LOCKED) by the SAME user — the normal post-hold checkout path', async () => {
    mockTx.seat.findMany.mockResolvedValue([{ ...SEAT_A, status: 'LOCKED', lockedBy: 'user-1' }]);
    mockTx.seat.updateMany.mockResolvedValue({ count: 1 });

    await expect(BookingService.createBooking(baseParams)).resolves.toBeDefined();
  });

  it('rejects a seat LOCKED by a different user', async () => {
    mockTx.seat.findMany.mockResolvedValue([{ ...SEAT_A, status: 'LOCKED', lockedBy: 'someone-else' }]);

    await expect(BookingService.createBooking(baseParams)).rejects.toThrow(/đã có người đặt/);
    expect(mockTx.booking.create).not.toHaveBeenCalled();
  });

  it('rejects an already BOOKED seat', async () => {
    mockTx.seat.findMany.mockResolvedValue([{ ...SEAT_A, status: 'BOOKED' }]);

    await expect(BookingService.createBooking(baseParams)).rejects.toThrow(/đã có người đặt/);
  });

  it('rolls back when the atomic lock races and locks fewer seats than requested', async () => {
    // Passes the pre-check (sees AVAILABLE) but a concurrent request wins the
    // row lock first — updateMany reports 0 rows actually updated.
    mockTx.seat.findMany.mockResolvedValue([SEAT_A]);
    mockTx.seat.updateMany.mockResolvedValue({ count: 0 });

    await expect(BookingService.createBooking(baseParams)).rejects.toThrow(/vừa được người khác đặt trước/);
    expect(mockTx.booking.create).not.toHaveBeenCalled();
  });

  it('rejects when a seat number does not exist on the trip', async () => {
    mockTx.seat.findMany.mockResolvedValue([]);

    await expect(BookingService.createBooking(baseParams)).rejects.toThrow(/Ghế không tồn tại/);
  });

  it('rejects wallet payment when balance is insufficient, without locking any seat', async () => {
    mockTx.seat.findMany.mockResolvedValue([SEAT_A]);
    mockTx.wallet.findUnique.mockResolvedValue({ id: 'wallet-1', balance: 1000 });

    await expect(
      BookingService.createBooking({ ...baseParams, paymentMethod: 'busz-wallet' })
    ).rejects.toThrow(/Số dư ví không đủ/);
    expect(mockTx.seat.updateMany).not.toHaveBeenCalled();
  });

  it('marks seats BOOKED (not LOCKED) and debits the wallet on a successful wallet payment', async () => {
    mockTx.seat.findMany.mockResolvedValue([SEAT_A]);
    mockTx.wallet.findUnique.mockResolvedValue({ id: 'wallet-1', balance: 10_000_000 });
    mockTx.seat.updateMany.mockResolvedValue({ count: 1 });

    await BookingService.createBooking({ ...baseParams, paymentMethod: 'busz-wallet' });

    expect(mockTx.seat.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ status: 'BOOKED' }) })
    );
    expect(mockTx.wallet.update).toHaveBeenCalled();
    expect(mockTx.walletTransaction.create).toHaveBeenCalled();
  });
});

describe('BookingService.cancelBooking', () => {
  beforeEach(resetMocks);

  it('releases seats and cancels a PENDING_PAYMENT booking owned by the caller', async () => {
    mockTx.booking.findUnique.mockResolvedValue({
      id: 'booking-1',
      userId: 'user-1',
      status: 'PENDING_PAYMENT',
      seatBookings: [{ seatId: 'seat-a' }],
    });
    mockTx.booking.update.mockResolvedValue({ id: 'booking-1', status: 'CANCELLED' });
    mockTx.payment.findUnique.mockResolvedValue(null);

    await BookingService.cancelBooking('user-1', 'booking-1');

    expect(mockTx.seat.updateMany).toHaveBeenCalledWith({
      where: { id: { in: ['seat-a'] } },
      data: { status: 'AVAILABLE' },
    });
    expect(mockTx.booking.update).toHaveBeenCalledWith({
      where: { id: 'booking-1' },
      data: { status: 'CANCELLED' },
    });
  });

  it('rejects cancelling a booking that belongs to a different user', async () => {
    mockTx.booking.findUnique.mockResolvedValue({
      id: 'booking-1',
      userId: 'other-user',
      status: 'PENDING_PAYMENT',
      seatBookings: [],
    });

    await expect(BookingService.cancelBooking('user-1', 'booking-1')).rejects.toThrow(
      /không có quyền/
    );
  });

  it('rejects cancelling a booking that is no longer PENDING_PAYMENT', async () => {
    mockTx.booking.findUnique.mockResolvedValue({
      id: 'booking-1',
      userId: 'user-1',
      status: 'CONFIRMED',
      seatBookings: [],
    });

    await expect(BookingService.cancelBooking('user-1', 'booking-1')).rejects.toThrow(
      /Chỉ có thể huỷ/
    );
  });
});
