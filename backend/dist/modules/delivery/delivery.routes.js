"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deliveryRoutes = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const cache_1 = require("../../core/cache");
exports.deliveryRoutes = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
exports.deliveryRoutes.get('/vehicles', async (req, res, next) => {
    try {
        const vehicles = await (0, cache_1.getCached)('delivery_vehicles', async () => {
            return prisma.deliveryVehicle.findMany({
                where: { isActive: true },
                orderBy: { price: 'asc' }
            });
        }, 300);
        res.json(vehicles);
    }
    catch (error) {
        next(error);
    }
});
exports.deliveryRoutes.post('/book', async (req, res, next) => {
    try {
        const { userId, vehicleId, packageType, pickupLocation, dropoffLocation, totalAmount } = req.body;
        const booking = await prisma.deliveryOrder.create({
            data: {
                userId,
                vehicleId,
                packageType,
                pickupLocation,
                dropoffLocation,
                totalAmount
            }
        });
        res.status(201).json(booking);
    }
    catch (error) {
        next(error);
    }
});
