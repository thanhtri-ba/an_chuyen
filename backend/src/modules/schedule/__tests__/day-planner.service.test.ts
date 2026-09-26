// Unit tests for the admin "Xếp lịch trong ngày" drag-and-drop planner.
// Creating a schedule from a trip must clone the latest schedule's seat map,
// prices and pick-up/drop-off points (shifted to the new time) so customers can
// book it immediately; schedules that already have bookings/parcels are locked.
// Prisma is mocked so these tests never touch the real (Supabase) database.

const mockTx = {
  tripSchedule: { create: jest.fn(), update: jest.fn(), delete: jest.fn() },
  checkpoint: { update: jest.fn() },
};

const mockPrisma = {
  trip: { findUnique: jest.fn() },
  tripSchedule: { findFirst: jest.fn(), findUnique: jest.fn(), findMany: jest.fn() },
  $transaction: jest.fn(async (cb: (tx: typeof mockTx) => unknown) => cb(mockTx)),
};

jest.mock('../../../core/prisma', () => ({ prisma: mockPrisma }));

import { DayPlannerService, vnDayRange } from '../day-planner.service';

const HOUR = 60 * 60 * 1000;
const TEMPLATE = {
  id: 'sched-old',
  tripId: 'trip-1',
  departureTime: new Date('2026-09-17T01:00:00.000Z'),
  arrivalTime: new Date('2026-09-17T09:00:00.000Z'),
  durationMins: 480,
  seats: [{ seatNumber: 'T1-1A' }, { seatNumber: 'T1-1B' }],
  prices: [{ seatClass: 'SLEEPER', price: 350000 }],
  checkpoints: [
    { stationId: 'st-a', type: 'PICKUP', time: new Date('2026-09-17T01:00:00.000Z') },
    { stationId: 'st-b', type: 'DROPOFF', time: new Date('2026-09-17T09:00:00.000Z') },
  ],
};

describe('vnDayRange', () => {
  it('uses Vietnam midnight (UTC+7) as the day boundary', () => {
    const { start, end } = vnDayRange('2026-09-24');
    expect(start.toISOString()).toBe('2026-09-23T17:00:00.000Z');
    expect(end.toISOString()).toBe('2026-09-24T17:00:00.000Z');
  });

  it('rejects malformed dates', () => {
    expect(() => vnDayRange('24/09/2026')).toThrow(/Ngày không hợp lệ/);
  });
});

describe('DayPlannerService.createFromTrip', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma.trip.findUnique.mockResolvedValue({ id: 'trip-1', route: { durationMins: 420 } });
    mockTx.tripSchedule.create.mockImplementation(async ({ data }) => ({ id: 'sched-new', ...data }));
  });

  it('clones seats, prices and shifted checkpoints from the latest schedule', async () => {
    mockPrisma.tripSchedule.findFirst.mockResolvedValue(TEMPLATE);
    const departure = new Date('2026-09-24T06:30:00.000Z');

    await DayPlannerService.createFromTrip('trip-1', departure);

    const { data } = mockTx.tripSchedule.create.mock.calls[0][0];
    expect(data.tripId).toBe('trip-1');
    expect(data.departureTime).toEqual(departure);
    expect(data.durationMins).toBe(480); // template duration wins over the route estimate
    expect(data.arrivalTime).toEqual(new Date(departure.getTime() + 8 * HOUR));
    expect(data.seats.createMany.data).toEqual([
      { seatNumber: 'T1-1A', status: 'AVAILABLE' },
      { seatNumber: 'T1-1B', status: 'AVAILABLE' },
    ]);
    expect(data.prices.createMany.data).toEqual([{ seatClass: 'SLEEPER', price: 350000 }]);
    expect(data.checkpoints.createMany.data).toEqual([
      { stationId: 'st-a', type: 'PICKUP', time: new Date('2026-09-24T06:30:00.000Z') },
      { stationId: 'st-b', type: 'DROPOFF', time: new Date('2026-09-24T14:30:00.000Z') },
    ]);
  });

  it('snaps checkpoints that lie outside the template trip window to departure/arrival', async () => {
    // Seed data has checkpoints dated days away from their schedule — shifting
    // them verbatim would put pick-up points on the wrong day.
    mockPrisma.tripSchedule.findFirst.mockResolvedValue({
      ...TEMPLATE,
      checkpoints: [
        { stationId: 'st-a', type: 'PICKUP', time: new Date('2026-09-09T01:00:00.000Z') },
        { stationId: 'st-b', type: 'DROPOFF', time: new Date('2026-09-09T09:00:00.000Z') },
      ],
    });
    const departure = new Date('2026-09-24T06:30:00.000Z');

    await DayPlannerService.createFromTrip('trip-1', departure);

    const { data } = mockTx.tripSchedule.create.mock.calls[0][0];
    expect(data.checkpoints.createMany.data).toEqual([
      { stationId: 'st-a', type: 'PICKUP', time: departure },
      { stationId: 'st-b', type: 'DROPOFF', time: new Date('2026-09-24T14:30:00.000Z') },
    ]);
  });

  it('refuses when the trip has never had a schedule with a seat map', async () => {
    mockPrisma.tripSchedule.findFirst.mockResolvedValue(null);
    await expect(DayPlannerService.createFromTrip('trip-1', new Date())).rejects.toThrow(/chưa có sơ đồ ghế/);
    expect(mockTx.tripSchedule.create).not.toHaveBeenCalled();
  });

  it('404s for an unknown trip', async () => {
    mockPrisma.trip.findUnique.mockResolvedValue(null);
    await expect(DayPlannerService.createFromTrip('nope', new Date())).rejects.toMatchObject({ status: 404 });
  });
});

describe('DayPlannerService.reschedule', () => {
  beforeEach(() => jest.clearAllMocks());

  it('moves departure, arrival and every checkpoint by the same offset', async () => {
    mockPrisma.tripSchedule.findUnique.mockResolvedValue({
      ...TEMPLATE,
      checkpoints: TEMPLATE.checkpoints.map((c, i) => ({ ...c, id: `cp-${i}` })),
      _count: { bookings: 0, parcels: 0 },
    });

    await DayPlannerService.reschedule('sched-old', new Date('2026-09-17T03:00:00.000Z'));

    expect(mockTx.tripSchedule.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'sched-old' },
        data: {
          departureTime: new Date('2026-09-17T03:00:00.000Z'),
          arrivalTime: new Date('2026-09-17T11:00:00.000Z'),
        },
      }),
    );
    expect(mockTx.checkpoint.update).toHaveBeenCalledWith({
      where: { id: 'cp-1' },
      data: { time: new Date('2026-09-17T11:00:00.000Z') },
    });
  });

  it('refuses to move a schedule that already has bookings', async () => {
    mockPrisma.tripSchedule.findUnique.mockResolvedValue({ ...TEMPLATE, _count: { bookings: 2, parcels: 0 } });
    await expect(DayPlannerService.reschedule('sched-old', new Date())).rejects.toMatchObject({ status: 409 });
    expect(mockTx.tripSchedule.update).not.toHaveBeenCalled();
  });
});

describe('DayPlannerService.remove', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deletes an unbooked schedule', async () => {
    mockPrisma.tripSchedule.findUnique.mockResolvedValue({ id: 's', _count: { bookings: 0, parcels: 0 } });
    await DayPlannerService.remove('s');
    expect(mockTx.tripSchedule.delete).toHaveBeenCalledWith({ where: { id: 's' } });
  });

  it('refuses to delete a schedule carrying parcels', async () => {
    mockPrisma.tripSchedule.findUnique.mockResolvedValue({ id: 's', _count: { bookings: 0, parcels: 1 } });
    await expect(DayPlannerService.remove('s')).rejects.toMatchObject({ status: 409 });
    expect(mockTx.tripSchedule.delete).not.toHaveBeenCalled();
  });
});
