import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { getCached } from '../../core/cache';

export const destinationRoutes = Router();
const prisma = new PrismaClient();

destinationRoutes.get('/', async (req, res, next) => {
  try {
    const destinations = await getCached('destinations', async () => {
      return prisma.destination.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'asc' },
      });
    }, 300);
    res.json(destinations);
  } catch (error) {
    next(error);
  }
});

destinationRoutes.get('/:slug', async (req, res, next) => {
  try {
    const destination = await prisma.destination.findUnique({
      where: { slug: req.params.slug },
    });
    if (!destination || !destination.isActive) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    res.json(destination);
  } catch (error) {
    next(error);
  }
});
