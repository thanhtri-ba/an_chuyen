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
  promoCode?: string | null;
  contactName?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
}

export class BookingService {
  static async createBooking(data: CreateBookingParams) {
    const { userId, tripScheduleId, seatNumbers, passengers, idempotencyKey, paymentMethod, pickupPointId, dropoffPointId, promoCode, contactName, contactPhone, contactEmail } = data;

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

      // Lớp 2: Kiểm tra xem tất cả ghế có trống không (kiểm tra sớm để trả lỗi rõ ràng).
      // Ghế đang được CHÍNH userId này "hold" (giữ tạm lúc chọn ghế, xem seat.service.ts)
      // cũng được coi là hợp lệ — đó là luồng bình thường khi khách hoàn tất thanh toán
      // sau khi đã giữ ghế. Đây CHƯA đủ để chống race condition — việc chống trùng ghế
      // thật sự nằm ở updateMany có điều kiện bên dưới.
      for (const seat of seats) {
        const heldByMe = seat.status === SeatStatus.LOCKED && seat.lockedBy === userId;
        if (seat.status !== SeatStatus.AVAILABLE && !heldByMe) {
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

      // Mã giảm giá: backend tự tra Promotion theo code, tự tính % giảm — không tin
      // bất kỳ số tiền/phần trăm nào client gửi lên. Sai code / hết hạn / chưa active
      // đều là lỗi rõ ràng (không âm thầm bỏ qua), để khách biết mã không dùng được.
      let discountAmount = 0;
      let appliedPromoCode: string | null = null;
      let promoIdToRedeem: string | null = null;
      if (promoCode) {
        const promo = await tx.promotion.findUnique({ where: { code: promoCode.trim().toUpperCase() } });
        if (!promo || !promo.isActive || promo.validUntil < new Date()) {
          throw new Error('Mã giảm giá không hợp lệ hoặc đã hết hạn.');
        }
        // One use per account: a Voucher row is created the first time this user
        // redeems this promotion, marked isUsed — the unique(userId, promotionId)
        // constraint means a second attempt hits this same row already isUsed=true.
        const existingVoucher = await tx.voucher.findUnique({
          where: { userId_promotionId: { userId, promotionId: promo.id } },
        });
        if (existingVoucher?.isUsed) {
          throw new Error('Bạn đã sử dụng mã giảm giá này rồi. Mỗi tài khoản chỉ dùng được một lần.');
        }
        const rawDiscount = totalAmount * (promo.discountPct / 100);
        discountAmount = promo.maxDiscount != null ? Math.min(rawDiscount, promo.maxDiscount) : rawDiscount;
        discountAmount = Math.round(discountAmount);
        totalAmount = Math.max(0, totalAmount - discountAmount);
        appliedPromoCode = promo.code;
        promoIdToRedeem = promo.id;
      }

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

      // 3. Khoá ghế TRƯỚC khi tạo booking, bằng update có điều kiện status: AVAILABLE.
      // Đây là bước chống trùng ghế thật sự: nếu 2 request đồng thời cùng qua bước
      // check ở trên, chỉ MỘT request update trúng đủ số ghế (count === seats.length) —
      // request còn lại sẽ update được ít ghế hơn (ghế đã bị bên kia khoá trước),
      // phát hiện qua count lệch và rollback toàn bộ transaction.
      const lockResult = await tx.seat.updateMany({
        where: {
          id: { in: seats.map(s => s.id) },
          OR: [
            { status: SeatStatus.AVAILABLE },
            { status: SeatStatus.LOCKED, lockedBy: userId }
          ]
        },
        data: {
          status: isWalletPayment ? SeatStatus.BOOKED : SeatStatus.LOCKED,
          // Xoá thông tin "hold" tạm — ghế giờ khoá bởi Booking thật (seatBookings.lockedAt),
          // không còn phụ thuộc lockExpiresAt của cơ chế hold nữa.
          lockedBy: null,
          lockExpiresAt: null
        }
      });

      if (lockResult.count !== seats.length) {
        throw new Error('Một hoặc nhiều ghế vừa được người khác đặt trước. Vui lòng chọn lại ghế.');
      }

      // 4. Tạo Booking
      const booking = await tx.booking.create({
        data: {
          userId,
          tripScheduleId,
          totalAmount, // Giá TỰ TÍNH của Backend, tuyệt đối an toàn
          promoCode: appliedPromoCode,
          discountAmount,
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

      // Đánh dấu voucher đã dùng — cùng transaction với booking, nên nếu booking
      // rollback (hết ghế, ví không đủ tiền...) thì mã cũng KHÔNG bị tính là đã dùng.
      if (promoIdToRedeem) {
        await tx.voucher.upsert({
          where: { userId_promotionId: { userId, promotionId: promoIdToRedeem } },
          update: { isUsed: true, usedAt: new Date() },
          create: { userId, promotionId: promoIdToRedeem, isUsed: true, usedAt: new Date() },
        });
      }

      // 5. Tạo vé (Ticket) cho từng hành khách
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

      // 8. Lưu lại thông tin liên hệ chính để gợi ý điền nhanh ở lần đặt vé sau —
      // chỉ lưu khi khách thực sự cung cấp SĐT (không suy đoán/mượn dữ liệu từ
      // nơi khác), upsert theo (userId, phone) nên đặt lại vé cùng SĐT chỉ cập
      // nhật tên/email mới nhất thay vì tạo bản ghi trùng.
      if (contactPhone) {
        await tx.contact.upsert({
          where: { userId_phone: { userId, phone: contactPhone } },
          create: { userId, phone: contactPhone, name: contactName || passengers[0]?.name || '', email: contactEmail || null },
          update: { name: contactName || passengers[0]?.name || undefined, email: contactEmail || null },
        });
      }

      return booking;
    }, {
      maxWait: 15000, // 15s max wait to acquire transaction lock
      timeout: 30000  // 30s timeout for transaction execution
    });
  }

  // Cho khách tự huỷ booking của mình khi còn ở trạng thái PENDING_PAYMENT
  // (chưa thanh toán) hoặc CONFIRMED (đã thanh toán qua ví, xe chưa khởi hành).
  // Giải phóng ghế về AVAILABLE để tránh rò rỉ tồn kho ghế. Nếu đã thanh toán
  // qua ví, hoàn tiền vào ví theo % của CancellationPolicy nhà xe (dựa trên số
  // giờ còn lại tới giờ khởi hành) — trước đây booking đã CONFIRMED không thể
  // huỷ được và tiền trong ví bị mất trắng dù trạng thái Payment.REFUNDED đã
  // tồn tại sẵn trong schema nhưng chưa từng được set ở đâu.
  static async cancelBooking(userId: string, bookingId: string) {
    return await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        include: {
          seatBookings: true,
          tripSchedule: { include: { trip: { include: { busAgent: { include: { policies: true } } } } } },
        },
      });

      if (!booking) {
        throw new Error('Booking không tồn tại');
      }
      if (booking.userId !== userId) {
        throw new Error('Bạn không có quyền huỷ booking này');
      }
      if (booking.status !== 'PENDING_PAYMENT' && booking.status !== 'CONFIRMED') {
        throw new Error('Không thể huỷ booking ở trạng thái hiện tại');
      }
      if (booking.tripSchedule.departureTime <= new Date()) {
        throw new Error('Chuyến xe đã khởi hành, không thể huỷ vé');
      }

      const seatIds = booking.seatBookings.map((sb) => sb.seatId);
      await tx.seat.updateMany({
        where: { id: { in: seatIds } },
        data: { status: SeatStatus.AVAILABLE },
      });

      const payment = await tx.payment.findUnique({ where: { bookingId } });
      const wasPaidByWallet = booking.status === 'CONFIRMED' && payment?.status === 'PAID' && payment.method &&
        WALLET_METHOD_VALUES.has(payment.method);

      let refundAmount = 0;
      if (wasPaidByWallet) {
        const hoursUntilDeparture =
          (booking.tripSchedule.departureTime.getTime() - Date.now()) / (1000 * 60 * 60);
        const policies = booking.tripSchedule.trip.busAgent.policies
          .slice()
          .sort((a, b) => b.hoursBefore - a.hoursBefore);
        const matchedPolicy = policies.find((p) => hoursUntilDeparture >= p.hoursBefore);
        const refundPct = matchedPolicy ? matchedPolicy.refundPct : 0;
        refundAmount = Math.round(booking.totalAmount * (refundPct / 100));

        if (refundAmount > 0) {
          await tx.wallet.update({
            where: { userId },
            data: { balance: { increment: refundAmount } },
          });
          await tx.walletTransaction.create({
            data: {
              userId,
              amount: refundAmount,
              type: 'REFUND',
              description: `Hoàn tiền huỷ vé chuyến ${booking.tripScheduleId} (${refundPct}%)`,
              referenceId: booking.id,
            },
          });
        }

        await tx.payment.update({
          where: { id: payment!.id },
          data: { status: 'REFUNDED' },
        });
      } else if (payment && payment.status === 'PENDING') {
        await tx.payment.update({
          where: { id: payment.id },
          data: { status: 'FAILED' },
        });
      }

      const updated = await tx.booking.update({
        where: { id: bookingId },
        data: { status: wasPaidByWallet ? 'REFUNDED' : 'CANCELLED' },
      });

      await tx.bookingTimeline.create({
        data: {
          bookingId,
          status: wasPaidByWallet ? 'REFUNDED' : 'CANCELLED',
          note: wasPaidByWallet ? `Huỷ vé, hoàn ${refundAmount.toLocaleString('vi-VN')}đ vào ví` : 'Huỷ vé',
        },
      });

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
