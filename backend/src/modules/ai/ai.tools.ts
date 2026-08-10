import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const searchTrips = async (params: { from?: string; to?: string; limit?: number }) => {
  const { from, to, limit = 5 } = params;
  
  // Basic search: Find upcoming trip schedules
  const schedules = await prisma.tripSchedule.findMany({
    where: {
      departureTime: { gte: new Date() },
      ...(from || to ? {
        trip: {
          route: {
            ...(from ? { departureCity: { name: { contains: from, mode: 'insensitive' } } } : {}),
            ...(to ? { arrivalCity: { name: { contains: to, mode: 'insensitive' } } } : {}),
          }
        }
      } : {})
    },
    include: {
      trip: {
        include: {
          route: {
            include: { departureCity: true, arrivalCity: true }
          },
          busAgent: true,
        }
      },
      prices: true,
    },
    orderBy: { departureTime: 'asc' },
    take: limit,
  });

  return schedules.map(s => ({
    tripId: s.id,
    bus: s.trip.busAgent.name,
    route: `${s.trip.route.departureCity.name} -> ${s.trip.route.arrivalCity.name}`,
    departure: s.departureTime,
    arrival: s.arrivalTime,
    prices: s.prices.map(p => `${p.seatClass}: ${p.price}`).join(', ')
  }));
};

export const getPolicies = async () => {
  const policies = await prisma.cancellationPolicy.findMany({
    include: { busAgent: true },
    take: 3
  });
  
  return policies.map(p => 
    `Nhà xe ${p.busAgent.name}: Hủy trước ${p.hoursBefore} tiếng, hoàn tiền ${p.refundPct}%`
  );
};

export const getUserBookings = async (userId: string) => {
  const bookings = await prisma.booking.findMany({
    where: { userId },
    include: {
      tripSchedule: {
        include: {
          trip: {
            include: {
              route: {
                include: { departureCity: true, arrivalCity: true }
              }
            }
          }
        }
      },
      tickets: true,
      payment: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 3
  });

  return bookings.map(b => ({
    bookingId: b.id,
    status: b.status,
    paymentStatus: b.payment?.status,
    route: `${b.tripSchedule.trip.route.departureCity.name} -> ${b.tripSchedule.trip.route.arrivalCity.name}`,
    departure: b.tripSchedule.departureTime,
    tickets: b.tickets.length
  }));
};

// Simple heuristic RAG Context Builder
export const buildContext = async (message: string, userId?: string) => {
  let contextParts: string[] = [];
  const lowerMsg = message.toLowerCase();

  // If user asks about their ticket or booking
  if (userId && (lowerMsg.includes('vé của tôi') || lowerMsg.includes('đã đặt') || lowerMsg.includes('thanh toán'))) {
    const bookings = await getUserBookings(userId);
    contextParts.push(`THÔNG TIN ĐẶT VÉ CỦA NGƯỜI DÙNG HIỆN TẠI:\n${JSON.stringify(bookings, null, 2)}`);
  }

  // If user asks about policy
  if (lowerMsg.includes('hủy vé') || lowerMsg.includes('hành lý') || lowerMsg.includes('chính sách')) {
    const policies = await getPolicies();
    contextParts.push(`CHÍNH SÁCH NHÀ XE:\n${JSON.stringify(policies, null, 2)}`);
    contextParts.push(`Chính sách hành lý chung: Mỗi hành khách được mang tối đa 15-20kg hành lý tùy nhà xe.`);
  }

  // Search trips heuristic
  let fromCity = '';
  let toCity = '';
  if (lowerMsg.includes('sài gòn') || lowerMsg.includes('hcm') || lowerMsg.includes('hồ chí minh')) {
    if (lowerMsg.indexOf('đến') > lowerMsg.indexOf('sài gòn') || lowerMsg.indexOf('đi') > lowerMsg.indexOf('sài gòn')) {
      fromCity = 'Hồ Chí Minh';
    } else {
      toCity = 'Hồ Chí Minh';
    }
  }
  if (lowerMsg.includes('đà lạt')) {
    if (lowerMsg.indexOf('từ') > lowerMsg.indexOf('đà lạt')) {
      fromCity = 'Đà Lạt';
    } else {
      toCity = 'Đà Lạt';
    }
  }
  
  if (lowerMsg.includes('tìm xe') || lowerMsg.includes('đi') || lowerMsg.includes('còn xe') || lowerMsg.includes('chuyến')) {
     const trips = await searchTrips({ from: fromCity || undefined, to: toCity || undefined });
     contextParts.push(`CÁC CHUYẾN XE HIỆN CÓ (Real-time data):\n${JSON.stringify(trips, null, 2)}`);
  }

  // Always provide a fallback context if nothing matched
  if (contextParts.length === 0) {
    const defaultTrips = await searchTrips({ limit: 3 });
    contextParts.push(`MỘT SỐ CHUYẾN XE SẮP KHỞI HÀNH:\n${JSON.stringify(defaultTrips, null, 2)}`);
  }

  return contextParts.join('\n\n');
};
