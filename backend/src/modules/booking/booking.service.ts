import { PrismaClient, SeatStatus } from '@prisma/client';

const prisma = new PrismaClient();

// The web UI currently only offers wallet ('busz-wallet') and cash-on-delivery
// ('cod') as working payment methods — VNPay/Momo/Card are not wired to a real
// gateway yet, so any other value is treated as COD (pay later, admin confirms).
const WALLET_METHOD_VALUES = new Set(['busz-wallet', 'WALLET', 'wallet']);

interface CreateBookingParams {
  userId: string;
  tripScheduleId: string;
  seatNumbers: string[];
  passengers: { name: string; idCard?: string | null }[];
  idempotencyKey?: string | null;
  paymentMethod?: string | null;
  totalAmount?: number | null;
  pickupPointId?: string | null;
  dropoffPointId?: string | null;
}

export class BookingService {
  static async createBooking(data: CreateBookingParams) {
    const { userId, tripScheduleId, seatNumbers, passengers, idempotencyKey, paymentMethod, pickupPointId, dropoffPointId } = data;

    // Lớp 3: Idempotency (Chống Spam). 
    // Trong thực tế, có thể lưu idempotencyKey vào một bảng riêng hoặc cột trong Booking để check.
    // Ở đây ta đơn giản hóa để tập trung vào Lớp 1 & Lớp 2.

    return await prisma.$transaction(async (tx) => {
      // 1. Kiểm tra TripSchedule
      const tripSchedule = await tx.tripSchedule.findUnique({
        where: { id: tripScheduleId },
        include: { prices: true }
      });

      if (!tripSchedule) {
        throw new Error('Chuyến xe không tồn tại');
      }

      // 2. Lấy thông tin các ghế để kiểm tra trạng thái và tính tiền
      let seats = await tx.seat.findMany({
        where: {
          tripScheduleId,
          seatNumber: { in: seatNumbers }
        }
      });

      // Ghế phải tồn tại sẵn trong sơ đồ xe (được tạo khi admin cấu hình lịch trình).
      // Không tự tạo ghế ở đây — nếu không, client có thể gửi seatNumber tuỳ ý để
      // "đặt" ghế không thuộc sơ đồ xe thật.
      if (seats.length !== seatNumbers.length) {
        const existingSeatNumbers = seats.map(s => s.seatNumber);
        const missingSeats = seatNumbers.filter(num => !existingSeatNumbers.includes(num));
        throw new Error(`Ghế không tồn tại trên chuyến xe này: ${missingSeats.join(', ')}`);
      }

      // Lớp 2: Kiểm tra xem tất cả ghế có trống không
      for (const seat of seats) {
        if (seat.status !== SeatStatus.AVAILABLE) {
          throw new Error(`Ghế ${seat.seatNumber} đã có người đặt hoặc đang giữ chỗ!`);
        }
      }

      // Lớp 1: Anti-tampering - Backend TỰ TÍNH TIỀN
      // Giá tiền được quyết định bởi bảng TripPrice dựa trên SeatClass
      // Tuy nhiên ở An Chuyến, SeatClass có thể gán theo sơ đồ ghế.
      // Giả sử ghế row < 2 (1A, 1B, 2A, 2B) là VIP, còn lại là ECONOMY.
      // Vì model Seat chưa có SeatClass trực tiếp, ta sẽ giả lập logic giống Frontend (Hoặc map theo TripPrice)
      
      const vipPriceObj = tripSchedule.prices.find(p => p.seatClass === 'VIP');
      const ecoPriceObj = tripSchedule.prices.find(p => p.seatClass === 'ECONOMY');
      const vipPrice = vipPriceObj ? vipPriceObj.price : 350000;
      const ecoPrice = ecoPriceObj ? ecoPriceObj.price : 280000;

      let totalAmount = 0;
      for (const seat of seats) {
        const rowMatch = seat.seatNumber.match(/-(\d+)[A-Z]$/);
        const row = rowMatch ? rowMatch[1] : '';
        const isVip = row === '1' || row === '2';
        totalAmount += isVip ? vipPrice : ecoPrice;
      }

      // Thêm phí dịch vụ (Service Fee = 10000)
      totalAmount += 10000;

      // Thanh toán bằng Ví An Chuyến: trừ tiền ngay trong transaction này —
      // nếu số dư không đủ, toàn bộ booking bị huỷ (rollback), ghế không bị khoá.
      const isWalletPayment = paymentMethod ? WALLET_METHOD_VALUES.has(paymentMethod) : false;
      let wallet: { id: string; balance: number } | null = null;
      if (isWalletPayment) {
        wallet = await tx.wallet.findUnique({ where: { userId } });
        if (!wallet || wallet.balance < totalAmount) {
          throw new Error('Số dư ví không đủ để thanh toán. Vui lòng nạp thêm hoặc chọn phương thức khác.');
        }
      }

      // 3. Tạo Booking
      const booking = await tx.booking.create({
        data: {
          userId,
          tripScheduleId,
          totalAmount, // Giá TỰ TÍNH của Backend, tuyệt đối an toàn
          status: isWalletPayment ? 'CONFIRMED' : 'PENDING_PAYMENT',
          pickupPointId: pickupPointId || null,
          dropoffPointId: dropoffPointId || null,
          passengers: {
            create: passengers.map(p => ({
              name: p.name,
              idCard: p.idCard
            }))
          },
          seatBookings: {
            create: seats.map(s => ({
              seatId: s.id,
              lockedAt: new Date()
            }))
          }
        },
        include: { passengers: true }
      });

      // 4. Tạo vé (Ticket) cho từng hành khách
      // Cast booking to any to bypass TS error if Prisma types are outdated
      const bookingWithPassengers = booking as any;
      if (bookingWithPassengers.passengers && bookingWithPassengers.passengers.length > 0) {
        await tx.ticket.createMany({
          data: bookingWithPassengers.passengers.map((p: any) => ({
            bookingId: booking.id,
            passengerId: p.id,
            status: 'PENDING'
          }))
        });
      }

      // 5. Khoá ghế: đã thanh toán ví → BOOKED (bán hẳn), còn lại → LOCKED (giữ chỗ chờ thanh toán)
      await tx.seat.updateMany({
        where: {
          id: { in: seats.map(s => s.id) }
        },
        data: {
          status: isWalletPayment ? SeatStatus.BOOKED : SeatStatus.LOCKED
        }
      });

      // 6. Lưu thông tin phương thức thanh toán (nếu có)
      if (paymentMethod) {
        await tx.payment.create({
          data: {
            bookingId: booking.id,
            method: paymentMethod,
            amount: totalAmount,
            status: isWalletPayment ? 'PAID' : 'PENDING',
          }
        });
      }

      // 7. Thanh toán ví: trừ tiền + ghi lịch sử giao dịch
      if (isWalletPayment && wallet) {
        await tx.wallet.update({
          where: { id: wallet.id },
          data: { balance: { decrement: totalAmount } },
        });
        await tx.walletTransaction.create({
          data: {
            userId,
            amount: -totalAmount,
            type: 'PAYMENT',
            description: `Thanh toán vé chuyến ${tripScheduleId}`,
            referenceId: booking.id,
          },
        });
      }

      return booking;
    }, {
      maxWait: 15000, // 15s max wait to acquire transaction lock
      timeout: 30000  // 30s timeout for transaction execution
    });
  }

  // Cho khách tự huỷ booking của mình khi còn ở trạng thái PENDING_PAYMENT
  // (chưa thanh toán / chưa được admin xác nhận). Giải phóng ghế về AVAILABLE
  // để tránh rò rỉ tồn kho ghế — trước đây xoá booking không nhả ghế lại.
  static async cancelBooking(userId: string, bookingId: string) {
    return await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        include: { seatBookings: true },
      });

      if (!booking) {
        throw new Error('Booking không tồn tại');
      }
      if (booking.userId !== userId) {
        throw new Error('Bạn không có quyền huỷ booking này');
      }
      if (booking.status !== 'PENDING_PAYMENT') {
        throw new Error('Chỉ có thể huỷ booking đang chờ thanh toán');
      }

      const seatIds = booking.seatBookings.map((sb) => sb.seatId);
      await tx.seat.updateMany({
        where: { id: { in: seatIds } },
        data: { status: SeatStatus.AVAILABLE },
      });

      const updated = await tx.booking.update({
        where: { id: bookingId },
        data: { status: 'CANCELLED' },
      });

      const payment = await tx.payment.findUnique({ where: { bookingId } });
      if (payment && payment.status === 'PENDING') {
        await tx.payment.update({
          where: { id: payment.id },
          data: { status: 'FAILED' },
        });
      }

      return updated;
    });
  }

  // Giải phóng ghế của các booking PENDING_PAYMENT đã quá hạn giữ chỗ —
  // gọi định kỳ từ một cron job (xem src/jobs/release-expired-bookings.ts).
  static async releaseExpiredBookings(olderThanMinutes: number) {
    const cutoff = new Date(Date.now() - olderThanMinutes * 60 * 1000);
    const expired = await prisma.booking.findMany({
      where: { status: 'PENDING_PAYMENT', createdAt: { lt: cutoff } },
      include: { seatBookings: true },
    });

    for (const booking of expired) {
      await prisma.$transaction(async (tx) => {
        const seatIds = booking.seatBookings.map((sb) => sb.seatId);
        await tx.seat.updateMany({
          where: { id: { in: seatIds } },
          data: { status: SeatStatus.AVAILABLE },
        });
        await tx.booking.update({
          where: { id: booking.id },
          data: { status: 'CANCELLED' },
        });
        const payment = await tx.payment.findUnique({ where: { bookingId: booking.id } });
        if (payment && payment.status === 'PENDING') {
          await tx.payment.update({ where: { id: payment.id }, data: { status: 'FAILED' } });
        }
      });
    }

    return expired.length;
  }
}
