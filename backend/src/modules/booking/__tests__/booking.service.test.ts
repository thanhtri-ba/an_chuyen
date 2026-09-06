// Unit tests for BookingService.createBooking's anti-double-booking logic —
// the atomic conditional seat lock added to fix the real race condition where
// two concurrent requests could both pass the "is this seat free?" check before
// either finished writing. Prisma is fully mocked; no real DB is touched.
//
// Wallet-payment tests were removed when the Ví payment method was retired
// (docs/architecture/REDESIGN-PLAN.md, Phase 3) — every payment method now
// goes through the same PENDING_PAYMENT → external confirmation path.

const mockTx = {
  tripSchedule: { findUnique: jest.fn() },
  seat: { findMany: jest.fn(), updateMany: jest.fn() },
  booking: { create: jest.fn(), update: jest.fn(), findUnique: jest.fn() },
  ticket: { createMany: jest.fn() },
  payment: { create: jest.fn(), update: jest.fn(), findUnique: jest.fn() },
  bookingTimeline: { create: jest.fn() },
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
    expect(mockTx.booking.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ status: 'PENDING_PAYMENT' }) })
    );
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

  it('always creates the Payment as PENDING regardless of method — external confirmation decides PAID', async () => {
    mockTx.seat.findMany.mockResolvedValue([SEAT_A]);
    mockTx.seat.updateMany.mockResolvedValue({ count: 1 });

    await BookingService.createBooking({ ...baseParams, paymentMethod: 'VNPAY' });

    expect(mockTx.payment.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ method: 'VNPAY', status: 'PENDING' }) })
    );
  });
});

describe('BookingService.cancelBooking', () => {
  beforeEach(resetMocks);

  const FUTURE_DEPARTURE = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48h from now
  const PAST_DEPARTURE = new Date(Date.now() - 60 * 60 * 1000);

  it('releases seats and cancels a PENDING_PAYMENT booking owned by the caller (nothing was charged)', async () => {
    mockTx.booking.findUnique.mockResolvedValue({
      id: 'booking-1',
      userId: 'user-1',
      status: 'PENDING_PAYMENT',
      totalAmount: 200000,
      tripScheduleId: 'trip-1',
      seatBookings: [{ seatId: 'seat-a' }],
      tripSchedule: { departureTime: FUTURE_DEPARTURE },
    });
    mockTx.booking.update.mockResolvedValue({ id: 'booking-1', status: 'CANCELLED' });
    mockTx.payment.findUnique.mockResolvedValue({ id: 'payment-1', status: 'PENDING' });

    await BookingService.cancelBooking('user-1', 'booking-1');

    expect(mockTx.seat.updateMany).toHaveBeenCalledWith({
      where: { id: { in: ['seat-a'] } },
      data: { status: 'AVAILABLE' },
    });
    expect(mockTx.payment.update).toHaveBeenCalledWith({
      where: { id: 'payment-1' },
      data: { status: 'FAILED' },
    });
    expect(mockTx.booking.update).toHaveBeenCalledWith({
      where: { id: 'booking-1' },
      data: { status: 'CANCELLED' },
    });
  });

  it('cancelling a CONFIRMED, already-PAID booking releases the seat but leaves Payment as PAID (manual refund by admin)', async () => {
    mockTx.booking.findUnique.mockResolvedValue({
      id: 'booking-1',
      userId: 'user-1',
      status: 'CONFIRMED',
      totalAmount: 200000,
      tripScheduleId: 'trip-1',
      seatBookings: [{ seatId: 'seat-a' }],
      tripSchedule: { departureTime: FUTURE_DEPARTURE },
    });
    mockTx.payment.findUnique.mockResolvedValue({ id: 'payment-1', status: 'PAID', method: 'VNPAY' });
    mockTx.booking.update.mockResolvedValue({ id: 'booking-1', status: 'CANCELLED' });

    await BookingService.cancelBooking('user-1', 'booking-1');

    expect(mockTx.seat.updateMany).toHaveBeenCalledWith({
      where: { id: { in: ['seat-a'] } },
      data: { status: 'AVAILABLE' },
    });
    // PAID Payment is untouched — no auto-refund for any method anymore.
    expect(mockTx.payment.update).not.toHaveBeenCalled();
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
      tripSchedule: { departureTime: FUTURE_DEPARTURE },
    });

    await expect(BookingService.cancelBooking('user-1', 'booking-1')).rejects.toThrow(
      /không có quyền/
    );
  });

  it('rejects cancelling a booking that is already COMPLETED/CANCELLED', async () => {
    mockTx.booking.findUnique.mockResolvedValue({
      id: 'booking-1',
      userId: 'user-1',
      status: 'COMPLETED',
      seatBookings: [],
      tripSchedule: { departureTime: FUTURE_DEPARTURE },
    });

    await expect(BookingService.cancelBooking('user-1', 'booking-1')).rejects.toThrow(
      /Không thể huỷ/
    );
  });

  it('rejects cancelling once the trip has already departed', async () => {
    mockTx.booking.findUnique.mockResolvedValue({
      id: 'booking-1',
      userId: 'user-1',
      status: 'CONFIRMED',
      seatBookings: [],
      tripSchedule: { departureTime: PAST_DEPARTURE },
    });

    await expect(BookingService.cancelBooking('user-1', 'booking-1')).rejects.toThrow(
      /đã khởi hành/
    );
  });
});
