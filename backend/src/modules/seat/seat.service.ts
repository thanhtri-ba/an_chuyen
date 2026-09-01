import { SeatStatus } from '@prisma/client';
import { prisma } from '../../core/prisma';

const FLOORS = [1, 2];
const ROWS = [1, 2, 3, 4, 5, 6];
const COLS = ['A', 'B', 'C'];

// Thời gian giữ ghế tạm thời khi khách đang chọn ghế / xem lại đơn, trước khi
// tạo Booking thật. Đây là khoá riêng biệt với việc khoá ghế lúc tạo Booking
// (booking.service.ts) — hold hết hạn tự động nhả về AVAILABLE.
export const SEAT_HOLD_MINUTES = 10;

function isVipSeat(seatNumber: string): boolean {
  // seatNumber format: T{floor}-{row}{col}, e.g. "T1-1A" — VIP is row 1 or 2.
  const rowMatch = seatNumber.match(/-(\d+)[A-Z]$/);
  const row = rowMatch ? rowMatch[1] : '';
  return row === '1' || row === '2';
}

export class SeatService {
  static async getTripScheduleDetail(tripScheduleId: string) {
    const tripSchedule = await prisma.tripSchedule.findUnique({
      where: { id: tripScheduleId },
      include: {
        trip: {
          include: {
            busAgent: { include: { images: true, policies: true } },
            route: {
              include: { departureCity: true, arrivalCity: true }
            },
            facilities: { include: { facility: true } }
          }
        },
        prices: true,
        checkpoints: { include: { station: true } },
        bus: true,
        staffAssignments: { include: { employee: true } }
      }
    });

    if (!tripSchedule) {
      throw new Error('Chuyến xe không tồn tại');
    }

    return tripSchedule;
  }

  static async getSeatMap(tripScheduleId: string, viewerUserId?: string) {
    const tripSchedule = await prisma.tripSchedule.findUnique({
      where: { id: tripScheduleId },
      include: { prices: true }
    });

    if (!tripSchedule) {
      throw new Error('Chuyến xe không tồn tại');
    }

    // Nhả tự động các ghế đang "hold" (giữ tạm khi chọn ghế) đã quá hạn.
    // Chỉ ảnh hưởng ghế có lockExpiresAt (hold) — ghế LOCKED do đã tạo Booking
    // thật (PENDING_PAYMENT) không có lockExpiresAt nên không bị đụng ở đây,
    // việc nhả ghế đó do BookingService.releaseExpiredBookings phụ trách.
    await prisma.seat.updateMany({
      where: {
        tripScheduleId,
        status: SeatStatus.LOCKED,
        lockExpiresAt: { lt: new Date() }
      },
      data: { status: SeatStatus.AVAILABLE, lockedBy: null, lockExpiresAt: null }
    });

    let seats = await prisma.seat.findMany({
      where: { tripScheduleId }
    });

    if (seats.length === 0) {
      const seatNumbers: string[] = [];
      for (const floor of FLOORS) {
        for (const row of ROWS) {
          for (const col of COLS) {
            seatNumbers.push(`T${floor}-${row}${col}`);
          }
        }
      }

      await prisma.seat.createMany({
        data: seatNumbers.map((seatNumber) => ({
          tripScheduleId,
          seatNumber,
          status: SeatStatus.AVAILABLE
        }))
      });

      seats = await prisma.seat.findMany({ where: { tripScheduleId } });
    }

    const vipPriceObj = tripSchedule.prices.find((p) => p.seatClass === 'VIP');
    const ecoPriceObj = tripSchedule.prices.find((p) => p.seatClass === 'ECONOMY');
    const vipPrice = vipPriceObj ? vipPriceObj.price : 350000;
    const ecoPrice = ecoPriceObj ? ecoPriceObj.price : 280000;
    // Tầng trên (2) yên tĩnh và ít xóc hơn tầng dưới trên xe giường nằm thực tế — cộng thêm phụ phí nhỏ
    // để 2 tầng có sự khác biệt thay vì trùng giá hoàn toàn.
    const UPPER_FLOOR_SURCHARGE = 20000;

    return seats.map((seat) => {
      const floorMatch = seat.seatNumber.match(/^T(\d)-/);
      const floor = floorMatch ? parseInt(floorMatch[1], 10) : 1;
      const vip = isVipSeat(seat.seatNumber);

      let mappedStatus = 'available';
      if (seat.status === SeatStatus.BOOKED) mappedStatus = 'booked';
      if (seat.status === SeatStatus.LOCKED) mappedStatus = 'blocked';
      // Ghế do chính người đang xem giữ (hold) vẫn coi là "available" với họ —
      // để họ có thể bỏ chọn lại hoặc thấy ghế mình đang giữ, không bị hiện "blocked".
      if (seat.status === SeatStatus.LOCKED && viewerUserId && seat.lockedBy === viewerUserId) {
        mappedStatus = 'held-by-me';
      }

      const basePrice = vip ? vipPrice : ecoPrice;

      return {
        id: seat.seatNumber,
        floor,
        status: mappedStatus,
        price: floor === 2 ? basePrice + UPPER_FLOOR_SURCHARGE : basePrice
      };
    });
  }

  // Giữ ghế tạm thời (10 phút) khi khách chọn ghế, trước khi tạo Booking thật.
  // Atomic: chỉ khoá được nếu ghế đang AVAILABLE, hoặc đang do CHÍNH userId này giữ
  // (cho phép gia hạn/chọn thêm mà không bị chính mình chặn). Trả về danh sách ghế
  // bị conflict (đã có người khác giữ/đặt) nếu có, để frontend báo lỗi rõ ràng.
  static async holdSeats(tripScheduleId: string, seatNumbers: string[], userId: string) {
    return prisma.$transaction(async (tx) => {
      await tx.seat.updateMany({
        where: {
          tripScheduleId,
          status: SeatStatus.LOCKED,
          lockExpiresAt: { lt: new Date() }
        },
        data: { status: SeatStatus.AVAILABLE, lockedBy: null, lockExpiresAt: null }
      });

      const seats = await tx.seat.findMany({
        where: { tripScheduleId, seatNumber: { in: seatNumbers } }
      });

      if (seats.length !== seatNumbers.length) {
        const found = seats.map((s) => s.seatNumber);
        throw new Error(`Ghế không tồn tại: ${seatNumbers.filter((n) => !found.includes(n)).join(', ')}`);
      }

      const conflicting = seats.filter(
        (s) => s.status !== SeatStatus.AVAILABLE && !(s.status === SeatStatus.LOCKED && s.lockedBy === userId)
      );
      if (conflicting.length > 0) {
        throw new Error(`Ghế đã có người khác giữ: ${conflicting.map((s) => s.seatNumber).join(', ')}`);
      }

      const expiresAt = new Date(Date.now() + SEAT_HOLD_MINUTES * 60 * 1000);
      const result = await tx.seat.updateMany({
        where: {
          id: { in: seats.map((s) => s.id) },
          OR: [{ status: SeatStatus.AVAILABLE }, { status: SeatStatus.LOCKED, lockedBy: userId }]
        },
        data: { status: SeatStatus.LOCKED, lockedBy: userId, lockExpiresAt: expiresAt }
      });

      if (result.count !== seats.length) {
        throw new Error('Một hoặc nhiều ghế vừa được người khác giữ trước. Vui lòng chọn lại.');
      }

      return { expiresAt };
    });
  }

  // Nhả ghế đang giữ (bỏ chọn ghế, rời trang, hoặc hết hạn thủ công) — chỉ nhả
  // ghế do chính userId đang giữ, không đụng ghế người khác hoặc booking thật.
  static async releaseSeats(tripScheduleId: string, seatNumbers: string[], userId: string) {
    await prisma.seat.updateMany({
      where: {
        tripScheduleId,
        seatNumber: { in: seatNumbers },
        status: SeatStatus.LOCKED,
        lockedBy: userId
      },
      data: { status: SeatStatus.AVAILABLE, lockedBy: null, lockExpiresAt: null }
    });
  }
}
