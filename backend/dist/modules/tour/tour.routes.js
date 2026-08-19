"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tourRoutes = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const cache_1 = require("../../core/cache");
exports.tourRoutes = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
exports.tourRoutes.get('/', async (req, res, next) => {
    try {
        const tours = await (0, cache_1.getCached)('tours', async () => {
            return prisma.tour.findMany({
                orderBy: { price: 'asc' }
            });
        }, 300);
        res.json(tours);
    }
    catch (error) {
        next(error);
    }
});
exports.tourRoutes.post('/book', async (req, res, next) => {
    try {
        const { userId, tourId, startDate, pax, totalAmount } = req.body;
        const booking = await prisma.tourBooking.create({
            data: {
                userId,
                tourId,
                startDate: new Date(startDate),
                pax,
                totalAmount
            }
        });
        res.status(201).json(booking);
    }
    catch (error) {
        next(error);
    }
});
