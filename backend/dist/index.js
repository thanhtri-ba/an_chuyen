"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config"); // Trigger restart 6
require("./instrument");
const Sentry = __importStar(require("@sentry/node"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const client_1 = require("@prisma/client");
const cache_1 = require("./core/cache");
const http_1 = require("http");
const socket_1 = require("./core/socket");
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const port = process.env.PORT || 3000;
//app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const request_context_middleware_1 = require("./middleware/request-context.middleware");
const logging_middleware_1 = require("./middleware/logging.middleware");
const error_middleware_1 = require("./middleware/error.middleware");
const logger_1 = require("./core/logger");
app.use((0, cors_1.default)({
    exposedHeaders: ['Content-Range', 'X-Total-Count'],
}));
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: false,
}));
app.use((0, compression_1.default)());
app.use(express_1.default.json());
app.use(request_context_middleware_1.requestContextMiddleware);
app.use(logging_middleware_1.loggingMiddleware);
const ai_routes_1 = __importDefault(require("./modules/ai/ai.routes"));
// import aiAdvisorRoutes from './modules/ai-advisor/ai-advisor.routes';
const booking_routes_1 = __importDefault(require("./modules/booking/booking.routes"));
const admin_routes_1 = __importDefault(require("./admin.routes"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const loyalty_routes_1 = require("./modules/loyalty/loyalty.routes");
const rental_routes_1 = require("./modules/rental/rental.routes");
// import { tourRoutes } from './modules/tour/tour.routes';
// import { eventRoutes } from './modules/event/event.routes';
const delivery_routes_1 = require("./modules/delivery/delivery.routes");
app.use('/api/auth', auth_routes_1.default);
app.use('/api/ai', ai_routes_1.default);
// app.use('/api/ai-advisor', aiAdvisorRoutes);
app.use('/api/bookings', booking_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/loyalty', loyalty_routes_1.loyaltyRoutes);
app.use('/api/rentals', rental_routes_1.rentalRoutes);
// app.use('/api/tours', tourRoutes);
// app.use('/api/events', eventRoutes);
app.use('/api/deliveries', delivery_routes_1.deliveryRoutes);
app.get('/', (req, res) => {
    res.send('An Chuyến Backend API is running!');
});
app.get('/health', async (req, res) => {
    try {
        // Check DB connection
        await prisma.$queryRaw `SELECT 1`;
        res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
    }
    catch (error) {
        res.status(500).json({ status: 'DOWN', error: error.message });
    }
});
// Public API for Flutter App
app.get('/api/trips', async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const origin = req.query.origin;
        const destination = req.query.destination;
        const date = req.query.date;
        const whereClause = {};
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
        const result = await (0, cache_1.getCached)(cacheKey, async () => {
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
    }
    catch (error) {
        next(error);
    }
});
app.get('/api/promotions', async (req, res, next) => {
    try {
        const promotions = await (0, cache_1.getCached)('promotions', async () => {
            return prisma.promotion.findMany({
                where: { isActive: true },
                orderBy: { createdAt: 'desc' }
            });
        }, 300);
        res.json(promotions);
    }
    catch (error) {
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
    }
    catch (error) {
        next(error);
    }
});
app.get('/api/stations', async (req, res, next) => {
    try {
        const stations = await (0, cache_1.getCached)('stations', async () => {
            return prisma.station.findMany({
                include: {
                    city: true
                }
            });
        }, 300);
        res.json(stations);
    }
    catch (error) {
        next(error);
    }
});
app.get('/api/configs', async (req, res, next) => {
    try {
        const configs = await (0, cache_1.getCached)('app_configs_all', async () => {
            return prisma.appConfig.findMany();
        }, 5);
        // Convert array of objects { key: 'foo', value: 'bar' } to single object { foo: 'bar' } for easier consumption
        const configMap = configs.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});
        res.json(configMap);
    }
    catch (error) {
        next(error);
    }
});
Sentry.setupExpressErrorHandler(app);
app.use(error_middleware_1.errorMiddleware);
if (require.main === module) {
    const server = (0, http_1.createServer)(app);
    (0, socket_1.initSocket)(server);
    server.listen(port, '0.0.0.0', () => {
        logger_1.logger.info(`Server is running on port ${port}`);
    });
}
exports.default = app;
