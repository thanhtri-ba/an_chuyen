import { SeatStatus } from '@prisma/client';
import { prisma } from '../../core/prisma';

const FLOORS = [1, 2];
const ROWS = [1, 2, 3, 4, 5, 6];
const COLS = ['A', 'B', 'C'];

function isVipSeat(seatNumber: string): boolean {
  // seatNumber format: T{floor}-{row}{col}, e.g. "T1-1A" — VIP is row 1 or 2.
  const rowMatch = seatNumber.match(/-(\d+)[A-Z]$/);
  const row = rowMatch ? rowMatch[1] : '';
  return row === '1' || row === '2';
}

export class SeatService {
  static async getSeatMap(tripScheduleId: string) {
    const tripSchedule = await prisma.tripSchedule.findUnique({
      where: { id: tripScheduleId },
      include: { prices: true }
    });

    if (!tripSchedule) {
      throw new Error('Chuyến xe không tồn tại');
    }

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

    return seats.map((seat) => {
      const floorMatch = seat.seatNumber.match(/^T(\d)-/);
      const floor = floorMatch ? parseInt(floorMatch[1], 10) : 1;
      const vip = isVipSeat(seat.seatNumber);

      return {
        id: seat.seatNumber,
        floor,
        status: seat.status === SeatStatus.AVAILABLE ? 'available' : 'occupied',
        price: vip ? vipPrice : ecoPrice
      };
    });
  }
}
