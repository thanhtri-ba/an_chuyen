import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Dùng chung cho mọi cổng thanh toán tự động (VNPay return/IPN, webhook SePay
// cho chuyển khoản ngân hàng, v.v.) — idempotent: gọi lại nhiều lần trên cùng
// giao dịch đã PAID sẽ không làm gì thêm, tránh double-processing khi 1 webhook
// bị gọi lại (retry) hoặc cả return URL lẫn IPN cùng xử lý 1 giao dịch.
export async function confirmPaymentSuccess(bookingId: string, gateway: string, transactionId: string) {
  const payment = await prisma.payment.findUnique({ where: { bookingId } });
  if (!payment) return { ok: false as const, reason: 'PAYMENT_NOT_FOUND' as const };
  if (payment.status === 'PAID') return { ok: true as const, alreadyProcessed: true };
  if (payment.status !== 'PENDING') return { ok: false as const, reason: 'INVALID_STATUS' as const };

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: { status: 'PAID', gateway, transactionId },
    });
    await tx.booking.update({ where: { id: bookingId }, data: { status: 'CONFIRMED' } });
    const seatBookings = await tx.seatBooking.findMany({ where: { bookingId } });
    if (seatBookings.length > 0) {
      await tx.seat.updateMany({
        where: { id: { in: seatBookings.map((sb) => sb.seatId) } },
        data: { status: 'BOOKED' },
      });
    }
  });
  return { ok: true as const, alreadyProcessed: false };
}

export async function markPaymentFailed(bookingId: string) {
  const payment = await prisma.payment.findUnique({ where: { bookingId } });
  if (!payment || payment.status !== 'PENDING') return;
  await prisma.payment.update({ where: { id: payment.id }, data: { status: 'FAILED' } });
}
