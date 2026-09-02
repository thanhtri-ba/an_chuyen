import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { BookingService } from './booking.service';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import { auditLog } from '../../core/audit';

const createBookingSchema = z.object({
  tripScheduleId: z.string().uuid(),
  seatNumbers: z.array(z.string()).min(1).max(10),
  passengers: z.array(
    z.object({
      name: z.string().min(2),
      idCard: z.string().nullable().optional()
    })
  ).min(1),
  idempotencyKey: z.string().uuid().optional(),
  pickupPointId: z.string().optional(),
  dropoffPointId: z.string().optional(),
  // Backend BỎ QUA totalAmount nếu client gửi lên
  totalAmount: z.number().optional(),
  paymentMethod: z.string().nullable().optional(),
  // Mã giảm giá do khách nhập — backend tự tra cứu & tính lại discount, không tin số
  // tiền/phần trăm giảm mà client có thể gửi kèm.
  promoCode: z.string().trim().min(1).optional()
});

export const createBooking = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // 1. Zod Validation (Anti-tampering / Malformed request)
    const validatedData = createBookingSchema.parse(req.body);

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // 2. Pass to service
    const booking = await BookingService.createBooking({
      ...validatedData,
      userId
    });

    auditLog({
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
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ (Validation Error)',
        errors: (error as any).errors
      });
    }
    next(error);
  }
};

export const cancelBooking = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const booking = await BookingService.cancelBooking(userId, req.params.id);

    auditLog({
      event: 'BookingCancelled',
      actorId: userId,
      actorRole: req.user?.role || 'user',
      resourceType: 'booking',
      resourceId: booking.id,
      outcome: 'success',
    });

    res.json({ success: true, message: 'Đã huỷ booking', data: booking });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Không thể huỷ booking' });
  }
};

export const getBookings = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
        passengers: true,
        seatBookings: {
          include: {
            seat: true
          }
        },
        payment: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const mappedBookings = bookings.map((booking: any) => {
      const seatNumbers = booking.seatBookings.map((sb: any) => sb.seat.seatNumber);
      const paymentStatus = (booking.payment?.status === 'SUCCESS' || booking.status === 'CONFIRMED' || booking.status === 'COMPLETED') ? 'PAID' : 'UNPAID';
      
      return {
        ...booking,
        seatNumbers,
        paymentStatus
      };
    });

    res.json({
      success: true,
      data: mappedBookings
    });
  } catch (error) {
    next(error);
  }
};

