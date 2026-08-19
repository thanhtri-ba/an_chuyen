import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { getCached } from '../../core/cache';

export const eventRoutes = Router();
const prisma = new PrismaClient();

eventRoutes.get('/', async (req, res, next) => {
  try {
    const events = await getCached('events', async () => {
      return prisma.event.findMany({
        where: { isActive: true },
        orderBy: { startDate: 'asc' },
      });
    }, 300);
    res.json(events);
  } catch (error) {
    next(error);
  }
});
