import 'dotenv/config'; // Trigger restart 7
import './instrument';
import * as Sentry from '@sentry/node';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import { getCached } from './core/cache';
import { createServer } from 'http';
import { initSocket } from './core/socket';

const app = express();
// Required behind a reverse proxy (Railway, Nginx, etc.) so req.ip and
// express-rate-limit see the real client IP from X-Forwarded-For.
app.set('trust proxy', 1);
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;
//app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import { requestContextMiddleware } from './middleware/request-context.middleware';
import { loggingMiddleware } from './middleware/logging.middleware';
import { errorMiddleware } from './middleware/error.middleware';
import { logger } from './core/logger';

// Allow-list of origins that may call this API. Set CORS_ORIGINS (comma-separated)
// in production — e.g. "https://anchuyen.vn,https://admin.anchuyen.vn". Falls back
// to local dev ports when unset so `npm run dev` keeps working out of the box.
const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'];

if (process.env.NODE_ENV === 'production' && !process.env.CORS_ORIGINS) {
  logger.warn('CORS_ORIGINS is not set in production — falling back to localhost dev origins. Set CORS_ORIGINS to your real domains.');
}

app.use(cors({
  origin: corsOrigins,
  exposedHeaders: ['Content-Range', 'X-Total-Count'],
}));
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(compression());
app.use(express.json());
app.use(requestContextMiddleware);
app.use(loggingMiddleware);

// General API rate limit — protects against abuse/DoS on all endpoints.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});

// Stricter limit on auth endpoints — brute-force protection for login/register.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts, please try again later.' },
});

app.use('/api', apiLimiter);

import aiRoutes from './modules/ai/ai.routes';
// import aiAdvisorRoutes from './modules/ai-advisor/ai-advisor.routes';
import bookingRoutes from './modules/booking/booking.routes';
import { BookingService } from './modules/booking/booking.service';
import adminRoutes from './admin.routes';
import authRoutes from './auth.routes';
import { loyaltyRoutes } from './modules/loyalty/loyalty.routes';
import { walletRoutes } from './modules/wallet/wallet.routes';
import { rentalRoutes } from './modules/rental/rental.routes';
import { tourRoutes } from './modules/tour/tour.routes';
import { eventRoutes } from './modules/event/event.routes';
import { destinationRoutes } from './modules/destination/destination.routes';
import { bannerRoutes } from './modules/banner/banner.routes';
import { deliveryRoutes } from './modules/delivery/delivery.routes';
import seatRoutes from './modules/seat/seat.routes';
import paymentRoutes from './modules/payment/payment.routes';

app.use('/api/auth', authLimiter, authRoutes);

app.use('/api/ai', aiRoutes);
// app.use('/api/ai-advisor', aiAdvisorRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/loyalty', loyaltyRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/trip-schedules', seatRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/', (req, res) => {
  res.send('An Chuyến Backend API is running!');
});

app.get('/health', async (req, res) => {
  try {
    // Check DB connection
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ status: 'DOWN', error: (error as Error).message });
  }
});

function mapCityName(input: string | undefined): string | undefined {
  if (!input) return input;
  const trimmed = input.trim();
  const clean = trimmed.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\./g, "").replace(/\s+/g, "");
  
  const mapping: Record<string, string> = {
    tphcm: 'TP. Hồ Chí Minh',
    hcm: 'TP. Hồ Chí Minh',
    saigon: 'TP. Hồ Chí Minh',
    saison: 'TP. Hồ Chí Minh', // Map 'Sài Sòn' / 'saison' typo
    hochiminh: 'TP. Hồ Chí Minh',
    hanoi: 'Hà Nội',
    dalat: 'Đà Lạt',
    nhatrang: 'Nha Trang',
    vungtau: 'Vũng Tàu',
    danang: 'Đà Nẵng',
    cantho: 'Cần Thơ',
    sapa: 'Sa Pa',
    hoian: 'Hội An',
    phuquoc: 'Phú Quốc',
    haiphong: 'Hải Phòng',
    halong: 'Hạ Long',
    hue: 'Huế',
    ninhbinh: 'Ninh Bình',
    buonmathuot: 'Buôn Ma Thuột',
    bmt: 'Buôn Ma Thuột'
  };

  return mapping[clean] || trimmed;
}

// Public API for Flutter App
app.get('/api/trips', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    
    const origin = mapCityName(req.query.origin as string);
    const destination = mapCityName(req.query.destination as string);
    const date = req.query.date as string;

    console.log('Search API received query:', {
      rawOrigin: req.query.origin,
      mappedOrigin: origin,
      rawDest: req.query.destination,
      mappedDest: destination,
      date
    });

    const whereClause: any = {};

    // OPTIMIZATION: Resolve Trip IDs first to avoid deep JOINs in TripSchedule query
    if (origin || destination) {
      const routes = await prisma.route.findMany({
        where: {
          ...(origin ? { departureCity: { name: { contains: origin, mode: 'insensitive' } } } : {}),
          ...(destination ? { arrivalCity: { name: { contains: destination, mode: 'insensitive' } } } : {}),
        },
        select: { id: true }
      });
      
      const routeIds = routes.map(r => r.id);
      
      const trips = await prisma.trip.findMany({
        where: { routeId: { in: routeIds } },
        select: { id: true }
      });

      whereClause.tripId = { in: trips.map(t => t.id) };
    }
    
    if (date) {
      const searchDate = new Date(date);
      if (!isNaN(searchDate.getTime())) {
        const nextDay = new Date(searchDate);
        nextDay.setDate(nextDay.getDate() + 1);
        whereClause.departureTime = {
          gte: searchDate,
          lt: nextDay
        };
      }
    }

    const cacheKey = `trips_page_${page}_limit_${limit}_origin_${origin || ''}_dest_${destination || ''}_date_${date || ''}`;

    const result = await getCached(cacheKey, async () => {
      const [data, total] = await Promise.all([
        prisma.tripSchedule.findMany({
          where: whereClause,
          skip,
          take: limit,
          include: {
            trip: {
              include: {
                busAgent: true,
                route: {
                  include: {
                    departureCity: true,
                    arrivalCity: true,
                  }
                }
              }
            },
            prices: true,
            checkpoints: { include: { station: true } }
          }
        }),
        prisma.tripSchedule.count({ where: whereClause })
      ]);
      return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }, 300);

    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.get('/api/promotions', async (req, res, next) => {
  try {
    const promotions = await getCached('promotions', async () => {
      return prisma.promotion.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
      });
    }, 300);
    res.json(promotions);
  } catch (error) {
    next(error);
  }
});

app.get('/api/reviews', async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: {
        user: {
          select: { fullName: true, avatar: true }
        }
      }
    });

    const reviewsWithRoute = await Promise.all(reviews.map(async (r) => {
      let routeString = 'An Chuyến Route';
      if (r.tripId) {
        const trip = await prisma.trip.findUnique({
          where: { id: r.tripId },
          include: { route: { include: { departureCity: true, arrivalCity: true } } }
        });
        if (trip) {
          routeString = `${trip.route.departureCity.name} → ${trip.route.arrivalCity.name}`;
        }
      }
      return {
        id: r.id,
        name: r.user.fullName,
        avatar: r.user.avatar || r.user.fullName?.charAt(0) || 'U',
        rating: r.rating,
        text: r.comment,
        route: routeString,
        date: new Date(r.createdAt).toLocaleDateString('vi-VN')
      };
    }));

    res.json(reviewsWithRoute);
  } catch (error) {
    next(error);
  }
});

app.get('/api/stations', async (req, res, next) => {
  try {
    const stations = await getCached('stations', async () => {
      return prisma.station.findMany({
        include: {
          city: true
        }
      });
    }, 300);
    res.json(stations);
  } catch (error) {
    next(error);
  }
});

app.get('/api/configs', async (req, res, next) => {
  try {
    const configs = await getCached('app_configs_all', async () => {
      return prisma.appConfig.findMany();
    }, 5);
    
    // Convert array of objects { key: 'foo', value: 'bar' } to single object { foo: 'bar' } for easier consumption
    const configMap = configs.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    
    res.json(configMap);
  } catch (error) {
    next(error);
  }
});

Sentry.setupExpressErrorHandler(app);
app.use(errorMiddleware);

if (require.main === module) {
  const server = createServer(app);
  initSocket(server);

  server.listen(port as number, '0.0.0.0', () => {
    logger.info(`Server is running on port ${port}`);
  });

  // Nhả ghế của các booking PENDING_PAYMENT quá hạn giữ chỗ (mặc định 15 phút),
  // tránh rò rỉ tồn kho ghế khi khách bỏ dở việc thanh toán COD.
  const BOOKING_EXPIRY_MINUTES = Number(process.env.BOOKING_EXPIRY_MINUTES) || 30;
  setInterval(() => {
    BookingService.releaseExpiredBookings(BOOKING_EXPIRY_MINUTES)
      .then((count) => {
        if (count > 0) logger.info(`Released ${count} expired pending booking(s)`);
      })
      .catch((error) => logger.error('Failed to release expired bookings', { error }));
  }, 5 * 60 * 1000);
}

export default app;
