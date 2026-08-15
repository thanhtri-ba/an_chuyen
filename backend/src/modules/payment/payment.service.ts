import { PrismaClient } from '@prisma/client';
import { CreatePaymentDTO, PaymentStatus, PaymentMethod, ConfirmPaymentDTO } from './payment.dto';

export class PaymentService {
  constructor(private prisma: PrismaClient) {}

  async createPayment(dto: CreatePaymentDTO) {
    // Verify booking exists
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
    });

    if (!booking) {
      throw new Error(`Booking ${dto.bookingId} not found`);
    }

    // Check if payment already exists
    const existingPayment = await this.prisma.payment.findUnique({
      where: { bookingId: dto.bookingId },
    });

    if (existingPayment) {
      throw new Error(`Payment for booking ${dto.bookingId} already exists`);
    }

    // Create payment record
    const payment = await this.prisma.payment.create({
      data: {
        bookingId: dto.bookingId,
        method: dto.method,
        amount: dto.amount,
        status: 'PENDING' as any,
      },
    });

    return payment;
  }

  async getPayment(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { booking: true },
    });

    if (!payment) {
      throw new Error(`Payment ${paymentId} not found`);
    }

    return payment;
  }

  async getPaymentByBooking(bookingId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { bookingId },
      include: { booking: true },
    });

    return payment;
  }

  async updatePaymentStatus(paymentId: string, status: string, transactionId?: string) {
    const payment = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: status as any,
        transactionId,
        updatedAt: new Date(),
      },
    });

    // If payment succeeded, update booking status
    if (status === 'PAID') {
      await this.prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: 'CONFIRMED' as any },
      });
    }

    return payment;
  }

  async confirmCODPayment(dto: ConfirmPaymentDTO) {
    const payment = await this.prisma.payment.update({
      where: { id: dto.paymentId },
      data: {
        status: 'PAID' as any,
        confirmedBy: dto.adminEmail,
        confirmedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Update booking status
    await this.prisma.booking.update({
      where: { id: payment.bookingId },
      data: { status: 'CONFIRMED' as any },
    });

    return payment;
  }

  async listPendingPayments() {
    return this.prisma.payment.findMany({
      where: { status: 'PENDING' as any },
      include: {
        booking: {
          include: {
            tripSchedule: {
              include: {
                trip: {
                  include: {
                    route: {
                      include: {
                        departureCity: true,
                        arrivalCity: true,
                      },
                    },
                  },
                },
              },
            },
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
