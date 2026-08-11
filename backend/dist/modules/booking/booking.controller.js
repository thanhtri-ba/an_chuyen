"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookings = exports.createBooking = void 0;
const zod_1 = require("zod");
const booking_service_1 = require("./booking.service");
const audit_1 = require("../../core/audit");
const createBookingSchema = zod_1.z.object({
    tripScheduleId: zod_1.z.string().uuid(),
    seatNumbers: zod_1.z.array(zod_1.z.string()).min(1).max(10),
    passengers: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string().min(2),
        idCard: zod_1.z.string().nullable().optional()
    })).min(1),
    idempotencyKey: zod_1.z.string().uuid().optional(),
    // Backend BỎ QUA totalAmount nếu client gửi lên
    totalAmount: zod_1.z.number().optional(),
    paymentMethod: zod_1.z.string().nullable().optional()
});
const createBooking = async (req, res, next) => {
    try {
        // 1. Zod Validation (Anti-tampering / Malformed request)
        const validatedData = createBookingSchema.parse(req.body);
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        // 2. Pass to service
        const booking = await booking_service_1.BookingService.createBooking({
            ...validatedData,
            userId
        });
        (0, audit_1.auditLog)({
            event: 'BookingCreated',
            actorId: userId,
            actorRole: req.user?.role || 'user',
            resourceType: 'booking',
            resourceId: booking.id,
            outcome: 'success',
            metadata: {
                tripId: booking.tripScheduleId,
                amount: booking.totalAmount,
                currency: 'VND'
            }
        });
        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: booking
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Dữ liệu không hợp lệ (Validation Error)',
                errors: error.errors
            });
        }
        next(error);
    }
};
exports.createBooking = createBooking;
const getBookings = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        const bookings = await prisma.booking.findMany({
            where: { userId },
            include: {
                tripSchedule: {
                    include: {
                        trip: {
                            include: {
                                busAgent: true,
                                route: {
                                    include: {
                                        departureCity: true,
                                        arrivalCity: true
                                    }
                                }
                            }
                        }
                    }
                },
                passengers: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json({
            success: true,
            data: bookings
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getBookings = getBookings;
