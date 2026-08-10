import { PrismaClient, SeatStatus } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateBookingParams {
  userId: string;
  tripScheduleId: string;
  seatNumbers: string[];
  passengers: { name: string; idCard?: string | null }[];
  idempotencyKey?: string | null;
  paymentMethod?: string | null;
  totalAmount?: number | null;
}

export class BookingService {
  static async createBooking(data: CreateBookingParams) {
    const { userId, tripScheduleId, seatNumbers, passengers, idempotencyKey, paymentMethod } = data;

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

      // DEMO MOCK: Nếu DB thiếu ghế (do seed data không khớp UI), tự động tạo ghế để luồng chạy mượt
      if (seats.length !== seatNumbers.length) {
        const existingSeatNumbers = seats.map(s => s.seatNumber);
        const missingSeats = seatNumbers.filter(num => !existingSeatNumbers.includes(num));
        
        if (missingSeats.length > 0) {
          await tx.seat.createMany({
            data: missingSeats.map(num => ({
              tripScheduleId,
              seatNumber: num,
              status: 'AVAILABLE'
            }))
          });
          
          // Lấy lại danh sách ghế sau khi tạo
          seats = await tx.seat.findMany({
            where: {
              tripScheduleId,
              seatNumber: { in: seatNumbers }
            }
          });
        }
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
        const isVip = seat.seatNumber.startsWith('1') || seat.seatNumber.startsWith('2');
        totalAmount += isVip ? vipPrice : ecoPrice;
      }

      // Thêm phí dịch vụ (Service Fee = 10000)
      totalAmount += 10000;

      // 3. Tạo Booking
      const booking = await tx.booking.create({
        data: {
          userId,
          tripScheduleId,
          totalAmount, // Giá TỰ TÍNH của Backend, tuyệt đối an toàn
          status: 'PENDING',
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
      if (booking.passengers && booking.passengers.length > 0) {
        await tx.ticket.createMany({
          data: booking.passengers.map(p => ({
            bookingId: booking.id,
            passengerId: p.id,
            status: 'PENDING'
          }))
        });
      }

      // 5. Khóa ghế lại (Tránh người khác mua trùng)
      await tx.seat.updateMany({
        where: {
          id: { in: seats.map(s => s.id) }
        },
        data: {
          status: SeatStatus.LOCKED
        }
      });

      // 6. Lưu thông tin phương thức thanh toán (nếu có)
      if (paymentMethod) {
        await tx.payment.create({
          data: {
            bookingId: booking.id,
            method: paymentMethod,
            amount: totalAmount,
            status: 'UNPAID'
          }
        });
      }

      return booking;
    }, {
      maxWait: 15000, // 15s max wait to acquire transaction lock
      timeout: 30000  // 30s timeout for transaction execution
    });
  }
}
