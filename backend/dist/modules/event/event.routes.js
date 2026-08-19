"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventRoutes = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const cache_1 = require("../../core/cache");
exports.eventRoutes = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
exports.eventRoutes.get('/', async (req, res, next) => {
    try {
        const events = await (0, cache_1.getCached)('events', async () => {
            return prisma.event.findMany({
                orderBy: { date: 'asc' }
            });
        }, 300);
        res.json(events);
    }
    catch (error) {
        next(error);
    }
});
exports.eventRoutes.post('/book', async (req, res, next) => {
    try {
        const { userId, eventId, ticketType, price } = req.body;
        const ticket = await prisma.eventTicket.create({
            data: {
                userId,
                eventId,
                ticketTier: ticketType,
                price
            }
        });
        res.status(201).json(ticket);
    }
    catch (error) {
        next(error);
    }
});
