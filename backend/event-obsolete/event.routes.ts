import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { getCached } from '../../core/cache';

export const eventRoutes = Router();
const prisma = new PrismaClient();

eventRoutes.get('/', async (req, res, next) => {
  try {
    const events = await getCached('events', async () => {
      return prisma.event.findMany({
        orderBy: { date: 'asc' }
      });
    }, 300);
    res.json(events);
  } catch (error) {
    next(error);
  }
});

eventRoutes.post('/book', async (req, res, next) => {
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
  } catch (error) {
    next(error);
  }
});
