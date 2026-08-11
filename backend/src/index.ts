import 'dotenv/config'; // Trigger restart 6
import './instrument';
import * as Sentry from '@sentry/node';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { PrismaClient } from '@prisma/client';
import { getCached } from './core/cache';
import { createServer } from 'http';
import { initSocket } from './core/socket';

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;
//app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import { requestContextMiddleware } from './middleware/request-context.middleware';
import { loggingMiddleware } from './middleware/logging.middleware';
import { errorMiddleware } from './middleware/error.middleware';
import { logger } from './core/logger';

app.use(cors({
  exposedHeaders: ['Content-Range', 'X-Total-Count'],
}));
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(compression());
app.use(express.json());
app.use(requestContextMiddleware);
app.use(loggingMiddleware);

import aiRoutes from './modules/ai/ai.routes';
// import aiAdvisorRoutes from './modules/ai-advisor/ai-advisor.routes';
import bookingRoutes from './modules/booking/booking.routes';
import adminRoutes from './admin.routes';
import authRoutes from './auth.routes';
import { loyaltyRoutes } from './modules/loyalty/loyalty.routes';
import { rentalRoutes } from './modules/rental/rental.routes';
// import { tourRoutes } from './modules/tour/tour.routes';
// import { eventRoutes } from './modules/event/event.routes';
import { deliveryRoutes } from './modules/delivery/delivery.routes';

app.use('/api/auth', authRoutes);

app.use('/api/ai', aiRoutes);
// app.use('/api/ai-advisor', aiAdvisorRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/loyalty', loyaltyRoutes);
app.use('/api/rentals', rentalRoutes);
// app.use('/api/tours', tourRoutes);
// app.use('/api/events', eventRoutes);
app.use('/api/deliveries', deliveryRoutes);

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

// Public API for Flutter App
app.get('/api/trips', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    
    const origin = req.query.origin as string;
    const destination = req.query.destination as string;
    const date = req.query.date as string;

    const whereClause: any = {};
    if (origin || destination) {
      whereClause.trip = { route: {} };
      if (origin) {
        whereClause.trip.route.departureCity = { name: { contains: origin } };
      }
      if (destination) {
        whereClause.trip.route.arrivalCity = { name: { contains: destination } };
      }
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
}

export default app;
