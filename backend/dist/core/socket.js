"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const logger_1 = require("./logger");
let io;
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: '*', // Trong thực tế nên giới hạn origin
            methods: ['GET', 'POST'],
        },
    });
    io.on('connection', (socket) => {
        logger_1.logger.info(`User connected to socket: ${socket.id}`);
        // Tài xế gửi vị trí GPS lên
        socket.on('update_location', (data) => {
            // Phát lại vị trí cho các client đang tracking chuyến xe này
            io.to(`trip_${data.tripId}`).emit('location_updated', data);
        });
        // Khách hàng/Admin tham gia room của chuyến xe để theo dõi
        socket.on('join_trip', (tripId) => {
            socket.join(`trip_${tripId}`);
            logger_1.logger.info(`Socket ${socket.id} joined trip_${tripId}`);
        });
        // Rời room
        socket.on('leave_trip', (tripId) => {
            socket.leave(`trip_${tripId}`);
        });
        socket.on('disconnect', () => {
            logger_1.logger.info(`User disconnected from socket: ${socket.id}`);
        });
    });
    return io;
};
exports.initSocket = initSocket;
const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};
exports.getIO = getIO;
