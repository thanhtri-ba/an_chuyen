import { PrismaClient } from '@prisma/client';
import { CreatePaymentDTO, PaymentStatus, PaymentMethod, ConfirmPaymentDTO } from './payment.dto';
import { NotificationService } from '../notification/notification.service';

export class PaymentService {
  private notificationService: NotificationService;

  constructor(private prisma: PrismaClient) {
    this.notificationService = new NotificationService(prisma);
  }

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

    // Create payment record — amount always comes from the server-computed
    // booking.totalAmount, never from client input, so a caller can't tamper
    // with the price by hitting this endpoint directly with a different amount.
    const payment = await this.prisma.payment.create({
      data: {
        bookingId: dto.bookingId,
        method: dto.method,
        amount: booking.totalAmount,
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
    const existing = await this.prisma.payment.findUnique({ where: { id: dto.paymentId } });
    if (!existing) throw new Error('Payment không tồn tại');
    if (existing.status !== 'PENDING') throw new Error('Payment không ở trạng thái chờ duyệt');

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
    const booking = await this.prisma.booking.update({
      where: { id: payment.bookingId },
      data: { status: 'CONFIRMED' as any },
    });

    // Seats were only LOCKED (held) while payment was pending — now that it's
    // paid, mark them BOOKED so they don't look like a stale hold.
    const seatBookings = await this.prisma.seatBooking.findMany({
      where: { bookingId: payment.bookingId },
    });
    if (seatBookings.length > 0) {
      await this.prisma.seat.updateMany({
        where: { id: { in: seatBookings.map((sb) => sb.seatId) } },
        data: { status: 'BOOKED' as any },
      });
    }

    // Admin đã duyệt thanh toán demo/COD — báo cho khách hàng biết vé đã được nhận.
    await this.notificationService.create({
      userId: booking.userId,
      title: 'Thanh toán đã được xác nhận',
      message: `Thanh toán cho đơn đặt vé #${booking.id.slice(0, 8).toUpperCase()} đã được admin duyệt. Vé của bạn đã được xác nhận.`,
      type: 'booking',
    });

    return payment;
  }

  // Admin từ chối một giao dịch đang PENDING (vd: chuyển khoản sai nội dung/
  // số tiền, hoặc giao dịch demo không hợp lệ) — chỉ đổi Payment sang FAILED,
  // KHÔNG nhả ghế/huỷ booking ngay (giữ nguyên hành vi của markPaymentFailed
  // dùng chung cho callback VNPay/MoMo thất bại) để khách còn cơ hội thử lại
  // phương thức khác trên cùng booking trước khi hết hạn giữ chỗ tự nhiên.
  async rejectPayment(paymentId: string, adminEmail: string) {
    const existing = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { booking: true },
    });
    if (!existing) throw new Error('Payment không tồn tại');
    if (existing.status !== 'PENDING') throw new Error('Payment không ở trạng thái chờ duyệt');

    const payment = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'FAILED' as any,
        confirmedBy: adminEmail,
        confirmedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    await this.notificationService.create({
      userId: existing.booking.userId,
      title: 'Thanh toán bị từ chối',
      message: `Thanh toán cho đơn đặt vé #${existing.booking.id.slice(0, 8).toUpperCase()} đã bị admin từ chối. Vui lòng kiểm tra lại thông tin thanh toán hoặc liên hệ hỗ trợ.`,
      type: 'booking',
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
