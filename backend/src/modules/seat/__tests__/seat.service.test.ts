// Unit tests for the seat-hold mechanism added to fix the "no real seat locking"
// bug — hold must be atomic (reject when a seat is already held by someone else)
// and must let the SAME user re-hold/extend their own seats without conflict.
// Prisma is mocked so these tests never touch the real (Supabase) database.

const mockTx = {
  seat: {
    updateMany: jest.fn(),
    findMany: jest.fn(),
  },
};

const mockPrisma = {
  seat: {
    updateMany: jest.fn(),
    findMany: jest.fn(),
  },
  $transaction: jest.fn(async (cb: (tx: typeof mockTx) => unknown) => cb(mockTx)),
};

jest.mock('../../../core/prisma', () => ({ prisma: mockPrisma }));

import { SeatService } from '../seat.service';

const SEAT_A = { id: 'seat-a', seatNumber: 'T1-1A', status: 'AVAILABLE', lockedBy: null };
const SEAT_B = { id: 'seat-b', seatNumber: 'T1-1B', status: 'AVAILABLE', lockedBy: null };

describe('SeatService.holdSeats', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTx.seat.updateMany.mockResolvedValue({ count: 0 }); // sweep-expired call, irrelevant here
  });

  it('holds seats that are AVAILABLE', async () => {
    mockTx.seat.findMany.mockResolvedValue([SEAT_A, SEAT_B]);
    // second updateMany call = the actual lock; must report both seats locked
    mockTx.seat.updateMany
      .mockResolvedValueOnce({ count: 0 }) // sweep
      .mockResolvedValueOnce({ count: 2 }); // lock

    const result = await SeatService.holdSeats('trip-1', ['T1-1A', 'T1-1B'], 'user-1');

    expect(result.expiresAt).toBeInstanceOf(Date);
    expect(mockTx.seat.updateMany).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: 'LOCKED', lockedBy: 'user-1' }),
      })
    );
  });

  it('rejects when a seat is already LOCKED by a different user', async () => {
    mockTx.seat.findMany.mockResolvedValue([
      SEAT_A,
      { ...SEAT_B, status: 'LOCKED', lockedBy: 'someone-else' },
    ]);

    await expect(SeatService.holdSeats('trip-1', ['T1-1A', 'T1-1B'], 'user-1')).rejects.toThrow(
      /Ghế đã có người khác giữ/
    );
  });

  it('allows the SAME user to re-hold a seat they already hold (renewal)', async () => {
    mockTx.seat.findMany.mockResolvedValue([{ ...SEAT_A, status: 'LOCKED', lockedBy: 'user-1' }]);
    mockTx.seat.updateMany
      .mockResolvedValueOnce({ count: 0 }) // sweep
      .mockResolvedValueOnce({ count: 1 }); // lock

    await expect(SeatService.holdSeats('trip-1', ['T1-1A'], 'user-1')).resolves.toBeDefined();
  });

  it('rejects when a seat is already BOOKED', async () => {
    mockTx.seat.findMany.mockResolvedValue([{ ...SEAT_A, status: 'BOOKED' }]);

    await expect(SeatService.holdSeats('trip-1', ['T1-1A'], 'user-1')).rejects.toThrow(
      /Ghế đã có người khác giữ/
    );
  });

  it('rejects when the requested seat number does not exist on the trip', async () => {
    mockTx.seat.findMany.mockResolvedValue([SEAT_A]);

    await expect(SeatService.holdSeats('trip-1', ['T1-1A', 'T1-9Z'], 'user-1')).rejects.toThrow(
      /Ghế không tồn tại/
    );
  });

  it('rolls back (throws) if the atomic lock update races and locks fewer seats than expected', async () => {
    // Two concurrent holds both pass the pre-check (both see AVAILABLE), but only
    // one wins the row-level lock at the DB — updateMany.count comes back short.
    mockTx.seat.findMany.mockResolvedValue([SEAT_A, SEAT_B]);
    mockTx.seat.updateMany
      .mockResolvedValueOnce({ count: 0 }) // sweep
      .mockResolvedValueOnce({ count: 1 }); // lock — only 1 of 2 actually locked

    await expect(SeatService.holdSeats('trip-1', ['T1-1A', 'T1-1B'], 'user-1')).rejects.toThrow(
      /vừa được người khác giữ/
    );
  });
});

describe('SeatService.releaseSeats', () => {
  beforeEach(() => jest.clearAllMocks());

  it('only releases seats locked by the requesting user', async () => {
    mockPrisma.seat.updateMany.mockResolvedValue({ count: 1 });

    await SeatService.releaseSeats('trip-1', ['T1-1A'], 'user-1');

    expect(mockPrisma.seat.updateMany).toHaveBeenCalledWith({
      where: {
        tripScheduleId: 'trip-1',
        seatNumber: { in: ['T1-1A'] },
        status: 'LOCKED',
        lockedBy: 'user-1',
      },
      data: { status: 'AVAILABLE', lockedBy: null, lockExpiresAt: null },
    });
  });
});
