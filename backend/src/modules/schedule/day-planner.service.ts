// Backs the admin "Xếp lịch trong ngày" page: an admin drags an existing Trip
// (route + operator + bus class) onto a time slot to create that day's schedule.
// A new schedule is only bookable if it has seats and prices, so we clone them —
// plus pick-up/drop-off checkpoints, shifted in time — from the trip's most recent
// schedule. Schedules with bookings or parcels are locked (moving/deleting them
// would strand customers).
import { prisma } from '../../core/prisma';
import { invalidateCacheByPrefix } from '../../core/cache';

export class DayPlannerError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

const VN_OFFSET = '+07:00';
const DAY_MS = 24 * 60 * 60 * 1000;

/** [start, end) of a calendar day in Vietnam time, for a 'YYYY-MM-DD' string. */
export function vnDayRange(date: string): { start: Date; end: Date } {
  const start = /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(`${date}T00:00:00${VN_OFFSET}`) : new Date(NaN);
  if (isNaN(start.getTime())) throw new DayPlannerError('Ngày không hợp lệ (định dạng YYYY-MM-DD).');
  return { start, end: new Date(start.getTime() + DAY_MS) };
}

const tripInclude = {
  busAgent: { select: { id: true, name: true } },
  route: { include: { departureCity: true, arrivalCity: true } },
} as const;

// Search results (/api/trips) are cached for 5 minutes — drop them so a newly
// planned schedule shows up for customers right away.
const invalidateSearch = () => invalidateCacheByPrefix('trips_page_');

async function getUnlocked(id: string) {
  const schedule = await prisma.tripSchedule.findUnique({
    where: { id },
    include: { checkpoints: true, _count: { select: { bookings: true, parcels: true } } },
  });
  if (!schedule) throw new DayPlannerError('Không tìm thấy lịch chạy.', 404);
  if (schedule._count.bookings > 0 || schedule._count.parcels > 0) {
    throw new DayPlannerError('Lịch này đã có khách đặt vé/gửi hàng nên không thể thay đổi.', 409);
  }
  return schedule;
}

export const DayPlannerService = {
  /** Trips that can be dragged onto the planner, with how many schedules each has had. */
  async listTrips() {
    return prisma.trip.findMany({
      include: { ...tripInclude, _count: { select: { schedules: true } } },
      orderBy: { routeId: 'asc' },
    });
  },

  /** All schedules departing on `date` (Vietnam time). */
  async listDay(date: string) {
    const { start, end } = vnDayRange(date);
    return prisma.tripSchedule.findMany({
      where: { departureTime: { gte: start, lt: end } },
      include: {
        trip: { include: tripInclude },
        bus: { select: { id: true, plateNumber: true } },
        _count: { select: { bookings: true, parcels: true, seats: true } },
      },
      orderBy: { departureTime: 'asc' },
    });
  },

  async createFromTrip(tripId: string, departureTime: Date) {
    if (isNaN(departureTime.getTime())) throw new DayPlannerError('Giờ khởi hành không hợp lệ.');

    const trip = await prisma.trip.findUnique({ where: { id: tripId }, include: { route: true } });
    if (!trip) throw new DayPlannerError('Không tìm thấy chuyến xe.', 404);

    const template = await prisma.tripSchedule.findFirst({
      where: { tripId, seats: { some: {} } },
      orderBy: { departureTime: 'desc' },
      include: { seats: { select: { seatNumber: true } }, prices: true, checkpoints: true },
    });
    if (!template) {
      throw new DayPlannerError(
        'Chuyến này chưa có sơ đồ ghế. Hãy tạo 1 lịch và sinh ghế ở trang "Lịch chạy" trước.',
        422,
      );
    }

    const durationMins = template.durationMins || trip.route.durationMins || 180;
    const arrivalTime = new Date(departureTime.getTime() + durationMins * 60_000);
    // Keep each checkpoint's offset into the template trip — unless it lies outside
    // that trip's window (much seed data is dated days off), then snap pick-ups to
    // departure and drop-offs to arrival.
    const checkpointTime = (c: { type: string; time: Date }) => {
      const offset = c.time.getTime() - template.departureTime.getTime();
      if (offset >= 0 && offset <= template.durationMins * 60_000) return new Date(departureTime.getTime() + offset);
      return c.type === 'DROPOFF' ? arrivalTime : departureTime;
    };

    const schedule = await prisma.$transaction((tx) =>
      tx.tripSchedule.create({
        data: {
          tripId,
          departureTime,
          arrivalTime,
          durationMins,
          seats: {
            createMany: { data: template.seats.map((s) => ({ seatNumber: s.seatNumber, status: 'AVAILABLE' as const })) },
          },
          prices: {
            createMany: { data: template.prices.map((p) => ({ seatClass: p.seatClass, price: p.price })) },
          },
          checkpoints: {
            createMany: {
              data: template.checkpoints.map((c) => ({
                stationId: c.stationId,
                type: c.type,
                time: checkpointTime(c),
              })),
            },
          },
        },
      }),
    );
    invalidateSearch();
    return schedule;
  },

  async reschedule(id: string, departureTime: Date) {
    if (isNaN(departureTime.getTime())) throw new DayPlannerError('Giờ khởi hành không hợp lệ.');
    const schedule = await getUnlocked(id);
    const shift = departureTime.getTime() - schedule.departureTime.getTime();

    await prisma.$transaction(async (tx) => {
      await tx.tripSchedule.update({
        where: { id },
        data: { departureTime, arrivalTime: new Date(schedule.arrivalTime.getTime() + shift) },
      });
      for (const c of schedule.checkpoints) {
        await tx.checkpoint.update({ where: { id: c.id }, data: { time: new Date(c.time.getTime() + shift) } });
      }
    });
    invalidateSearch();
  },

  async remove(id: string) {
    await getUnlocked(id);
    // Seats, prices, checkpoints and staff assignments cascade with the schedule.
    await prisma.$transaction((tx) => tx.tripSchedule.delete({ where: { id } }));
    invalidateSearch();
  },
};
