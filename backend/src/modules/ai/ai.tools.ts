import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface SearchIntent {
  from?: string;
  to?: string;
  date?: string; // YYYY-MM-DD
  timeRange?: [string, string]; // HH:mm
  seatType?: string; // 'VIP' | 'ECONOMY' | 'SLEEPER'
  targetPrice?: number;
}

export const extractSearchIntent = async (message: string): Promise<SearchIntent> => {
  const intent: SearchIntent = {};
  const lowerMsg = message.toLowerCase();

  // 1. Extract Locations (from, to) using keywords
  if (lowerMsg.match(/(từ|đi từ|ở) (sài gòn|hcm|hồ chí minh)/)) intent.from = 'Hồ Chí Minh';
  else if (lowerMsg.match(/(từ|đi từ|ở) (đà lạt)/)) intent.from = 'Đà Lạt';
  
  if (lowerMsg.match(/(đến|đi|lên|về) (sài gòn|hcm|hồ chí minh)/)) intent.to = 'Hồ Chí Minh';
  else if (lowerMsg.match(/(đến|đi|lên|về) (đà lạt)/)) intent.to = 'Đà Lạt';

  // 2. Extract Date (ma, mốt, cuối tuần)
  const today = new Date();
  if (lowerMsg.includes('ngày mai') || lowerMsg.includes('mai')) {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    intent.date = tomorrow.toISOString().split('T')[0];
  } else if (lowerMsg.includes('hôm nay')) {
    intent.date = today.toISOString().split('T')[0];
  } else if (lowerMsg.includes('cuối tuần')) {
    // Just a rough heuristic for saturday
    const weekend = new Date(today);
    const daysUntilSaturday = (6 - weekend.getDay() + 7) % 7 || 7;
    weekend.setDate(weekend.getDate() + daysUntilSaturday);
    intent.date = weekend.toISOString().split('T')[0];
  }

  // 3. Extract Time Range (sáng, trưa, chiều, tối)
  if (lowerMsg.includes('sáng')) intent.timeRange = ['05:00', '11:59'];
  else if (lowerMsg.includes('trưa')) intent.timeRange = ['11:00', '14:00'];
  else if (lowerMsg.includes('chiều')) intent.timeRange = ['14:01', '17:59'];
  else if (lowerMsg.includes('tối') || lowerMsg.includes('đêm')) intent.timeRange = ['18:00', '23:59'];
  else {
    // Check specific hour e.g. "8h", "20h"
    const hourMatch = lowerMsg.match(/(\d{1,2})h(?!ôm)/);
    if (hourMatch) {
      const hour = parseInt(hourMatch[1]);
      intent.timeRange = [
        `${hour.toString().padStart(2, '0')}:00`, 
        `${hour.toString().padStart(2, '0')}:59`
      ];
    }
  }

  // 4. Extract Seat Type (giường nằm, limousine, ghế ngồi)
  if (lowerMsg.includes('giường nằm') || lowerMsg.includes('nằm')) intent.seatType = 'SLEEPER';
  else if (lowerMsg.includes('limousine') || lowerMsg.includes('vip')) intent.seatType = 'VIP';
  else if (lowerMsg.includes('ghế ngồi') || lowerMsg.includes('ngồi')) intent.seatType = 'ECONOMY';

  // 5. Extract Price Target (e.g. 300k, 300.000)
  const priceMatch = lowerMsg.match(/(\d{2,3})k|(\d{3}(?:\.|\,)?\d{3})/);
  if (priceMatch) {
    if (priceMatch[1]) {
      // It's in 'k' format (e.g. 300k)
      intent.targetPrice = parseInt(priceMatch[1]) * 1000;
    } else if (priceMatch[2]) {
      // It's in full format (e.g. 300.000)
      intent.targetPrice = parseInt(priceMatch[2].replace(/\D/g, ''));
    }
  }

  return intent;
};

export const searchTrips = async (intent: SearchIntent) => {
  const { from, to, date, timeRange, seatType, targetPrice } = intent;
  
  // Hard filters: Must match from, to, date if provided
  let whereClause: any = { departureTime: { gte: new Date() } };
  
  if (from || to) {
    whereClause.trip = { route: {} };
    if (from) whereClause.trip.route.departureCity = { name: { contains: from, mode: 'insensitive' } };
    if (to) whereClause.trip.route.arrivalCity = { name: { contains: to, mode: 'insensitive' } };
  }

  if (date) {
    const searchDate = new Date(date);
    if (!isNaN(searchDate.getTime())) {
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      // Ignore past time if searching today, but strictly bound by the requested day
      whereClause.departureTime = {
        gte: searchDate > new Date() ? searchDate : new Date(),
        lt: nextDay
      };
    }
  }

  // Fetch candidate trips (up to 50 for in-memory ranking)
  const candidateSchedules = await prisma.tripSchedule.findMany({
    where: whereClause,
    include: {
      trip: {
        include: {
          route: { include: { departureCity: true, arrivalCity: true } },
          busAgent: true,
        }
      },
      prices: true,
    },
    take: 50,
  });

  // Soft Ranking
  const scoredTrips = candidateSchedules.map(schedule => {
    let score = 100;
    
    // Time matching
    if (timeRange && timeRange.length === 2) {
      const depTime = schedule.departureTime.getHours() * 60 + schedule.departureTime.getMinutes();
      const [startHour, startMin] = timeRange[0].split(':').map(Number);
      const [endHour, endMin] = timeRange[1].split(':').map(Number);
      const targetStart = startHour * 60 + startMin;
      const targetEnd = endHour * 60 + endMin;
      
      if (depTime < targetStart || depTime > targetEnd) {
        score -= 20; // Penalize for being outside target range
        // Further penalize based on distance from range
        const dist = Math.min(Math.abs(depTime - targetStart), Math.abs(depTime - targetEnd));
        score -= Math.floor(dist / 30) * 2; // -2 points per 30 mins off
      }
    }

    // Price matching
    const lowestPrice = Math.min(...schedule.prices.map(p => p.price));
    if (targetPrice) {
      const diff = Math.abs(lowestPrice - targetPrice);
      if (diff > 50000) {
        score -= Math.floor(diff / 50000) * 5; // -5 points per 50k difference
      }
    }

    // Seat type matching (if requested but missing from prices)
    if (seatType) {
      const hasSeatType = schedule.prices.some(p => p.seatClass.toUpperCase() === seatType.toUpperCase());
      if (!hasSeatType) score -= 30; // High penalty for wrong seat type
    }

    return { schedule, score };
  });

  // Sort by score and take top 5
  scoredTrips.sort((a, b) => b.score - a.score);
  const topResults = scoredTrips.slice(0, 5);

  return topResults.map(({ schedule, score }) => ({
    tripId: schedule.id,
    bus: schedule.trip.busAgent.name,
    route: `${schedule.trip.route.departureCity.name} -> ${schedule.trip.route.arrivalCity.name}`,
    departure: schedule.departureTime,
    arrival: schedule.arrivalTime,
    prices: schedule.prices.map(p => `${p.seatClass}: ${p.price}`).join(', '),
    matchScore: score
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

// NLU Intent-based RAG Context Builder
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

  // Use NLU to extract intent and search trips
  const intent = await extractSearchIntent(message);
  
  if (Object.keys(intent).length > 0) {
     contextParts.push(`USER'S PARSED INTENT:\n${JSON.stringify(intent, null, 2)}`);
     const trips = await searchTrips(intent);
     
     if (trips.length > 0) {
       contextParts.push(`KẾT QUẢ TÌM KIẾM CHUYẾN XE PHÙ HỢP:\n${JSON.stringify(trips, null, 2)}`);
     } else {
       contextParts.push(`Không tìm thấy chuyến xe nào khớp chính xác. Hãy hướng dẫn người dùng thay đổi ngày hoặc tìm kiếm linh hoạt hơn.`);
     }
  }

  // Fallback if context is entirely empty
  if (contextParts.length === 0) {
    const defaultTrips = await searchTrips({});
    contextParts.push(`MỘT SỐ CHUYẾN XE SẮP KHỞI HÀNH:\n${JSON.stringify(defaultTrips, null, 2)}`);
  }

  return contextParts.join('\n\n');
};
