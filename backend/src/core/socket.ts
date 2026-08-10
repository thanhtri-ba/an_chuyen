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
