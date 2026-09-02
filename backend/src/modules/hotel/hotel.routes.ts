import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { getCached } from '../../core/cache';

export const hotelRoutes = Router();
const prisma = new PrismaClient();

hotelRoutes.get('/', async (req, res, next) => {
  try {
    const hotels = await getCached('hotels', async () => {
      return prisma.hotel.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'asc' },
      });
    }, 300);
    res.json(hotels);
  } catch (error) {
    next(error);
  }
});

hotelRoutes.get('/:slug', async (req, res, next) => {
  try {
    const hotel = await prisma.hotel.findUnique({ where: { slug: req.params.slug } });
    if (!hotel || !hotel.isActive) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    res.json(hotel);
  } catch (error) {
    next(error);
  }
});
