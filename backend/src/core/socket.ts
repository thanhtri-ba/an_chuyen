import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { logger } from './logger';

let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: '*', // Trong thực tế nên giới hạn origin
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    logger.info(`User connected to socket: ${socket.id}`);

    // Tài xế gửi vị trí GPS lên
    socket.on('update_location', (data: { tripId: string; lat: number; lng: number }) => {
      // Phát lại vị trí cho các client đang tracking chuyến xe này
      io.to(`trip_${data.tripId}`).emit('location_updated', data);
    });

    // Khách hàng/Admin tham gia room của chuyến xe để theo dõi
    socket.on('join_trip', (tripId: string) => {
      socket.join(`trip_${tripId}`);
      logger.info(`Socket ${socket.id} joined trip_${tripId}`);
    });

    // Rời room
    socket.on('leave_trip', (tripId: string) => {
      socket.leave(`trip_${tripId}`);
    });

    // Sơ đồ ghế: khách xem trang chọn ghế join room riêng theo tripScheduleId
    // (khác room GPS ở trên — tripId và tripScheduleId là 2 khái niệm khác
    // nhau) để nhận cập nhật real-time khi người khác giữ/nhả/đặt ghế.
    socket.on('join_seatmap', (tripScheduleId: string) => {
      socket.join(`seatmap_${tripScheduleId}`);
    });

    socket.on('leave_seatmap', (tripScheduleId: string) => {
      socket.leave(`seatmap_${tripScheduleId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`User disconnected from socket: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

export type SeatStatusUpdate = { seatNumber: string; status: 'held' | 'available' | 'booked' };

// Phát cập nhật trạng thái ghế cho mọi client đang xem trang chọn ghế của
// đúng chuyến này. An toàn khi gọi trước khi socket.io init xong (ví dụ
// trong unit test service layer không khởi động HTTP server) — chỉ bỏ qua,
// không throw, vì đây là hiệu ứng phụ realtime, không phải nghiệp vụ chính.
export function emitSeatStatus(tripScheduleId: string, seats: SeatStatusUpdate[]) {
  if (seats.length === 0) return;
  try {
    getIO().to(`seatmap_${tripScheduleId}`).emit('seats_updated', { tripScheduleId, seats });
  } catch {
    // socket.io chưa init (test, script chạy độc lập...) — bỏ qua.
  }
}
