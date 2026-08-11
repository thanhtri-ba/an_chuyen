"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rentalRoutes = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const cache_1 = require("../../core/cache");
exports.rentalRoutes = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
exports.rentalRoutes.get('/cars', async (req, res, next) => {
    try {
        const cars = await (0, cache_1.getCached)('rental_cars', async () => {
            return prisma.rentalCar.findMany({
                where: { isActive: true },
                orderBy: { pricePerDay: 'asc' }
            });
        }, 300);
        res.json(cars);
    }
    catch (error) {
        next(error);
    }
});
exports.rentalRoutes.post('/book', async (req, res, next) => {
    try {
        const { userId, carId, pickupLocation, pickupTime, dropoffTime, driveType, totalAmount } = req.body;
        const booking = await prisma.rentalBooking.create({
            data: {
                userId,
                carId,
                pickupLocation,
                pickupTime: new Date(pickupTime),
                dropoffTime: new Date(dropoffTime),
                driveType,
                totalAmount
            }
        });
        res.status(201).json(booking);
    }
    catch (error) {
        next(error);
    }
});
