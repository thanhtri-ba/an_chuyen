import { PrismaClient } from '@prisma/client';
import { sendMail } from '../../core/mailer';
import { orderConfirmationEmailTemplate } from '../../core/emailTemplates/orderConfirmation';
import { eTicketEmailTemplate } from '../../core/emailTemplates/eTicket';
import { logger } from '../../core/logger';

const prisma = new PrismaClient();

async function loadBookingForEmail(bookingId: string) {
  return prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      user: { select: { email: true } },
      passengers: true,
      seatBookings: { include: { seat: true } },
      payment: true,
      tripSchedule: {
        include: {
          trip: {
            include: {
              busAgent: true,
              route: { include: { departureCity: true, arrivalCity: true } },
            },
          },
        },
      },
    },
  });
}

// Mail 1/2 — gọi ngay sau khi tạo booking thành công (booking.controller.ts).
// Fire-and-forget có chủ đích: khách không nên chờ email gửi xong mới thấy
// booking được tạo, và một lỗi gửi mail (vd Resend tạm gián đoạn) không được
// phép làm hỏng cả request đặt vé.
export async function sendOrderConfirmationEmail(bookingId: string): Promise<void> {
  try {
    const booking = await loadBookingForEmail(bookingId);
    if (!booking?.user?.email) return;

    const route = booking.tripSchedule.trip.route;
    const { subject, html } = orderConfirmationEmailTemplate({
      bookingId: booking.id,
      routeLabel: `${route.departureCity.name} → ${route.arrivalCity.name}`,
      departureTime: booking.tripSchedule.departureTime,
      seatNumbers: booking.seatBookings.map((sb) => sb.seat.seatNumber),
      totalAmount: booking.totalAmount,
      paymentMethod: booking.payment?.method || 'unknown',
    });
    await sendMail({ to: booking.user.email, subject, html });
  } catch (error) {
    logger.error('booking.email: failed to send order confirmation email', { bookingId, error });
  }
}

// Mail 2/2 — gọi sau khi Payment chuyển sang PAID (confirm.util.ts cho
// VNPay/MoMo/webhook SePay-Casso, payment.service.ts cho admin duyệt tay).
export async function sendETicketEmail(bookingId: string): Promise<void> {
  try {
    const booking = await loadBookingForEmail(bookingId);
    if (!booking?.user?.email) return;

    const route = booking.tripSchedule.trip.route;
    const { subject, html } = eTicketEmailTemplate({
      bookingId: booking.id,
      routeLabel: `${route.departureCity.name} → ${route.arrivalCity.name}`,
      departureTime: booking.tripSchedule.departureTime,
      busAgentName: booking.tripSchedule.trip.busAgent.name,
      passengerNames: booking.passengers.map((p) => p.name),
      seatNumbers: booking.seatBookings.map((sb) => sb.seat.seatNumber),
      totalAmount: booking.totalAmount,
    });
    await sendMail({ to: booking.user.email, subject, html });
  } catch (error) {
    logger.error('booking.email: failed to send e-ticket email', { bookingId, error });
  }
}
