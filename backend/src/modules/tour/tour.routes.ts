import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { getCached } from '../../core/cache';

export const tourRoutes = Router();
const prisma = new PrismaClient();

tourRoutes.get('/', async (req, res, next) => {
  try {
    const tours = await getCached('tours', async () => {
      return prisma.tour.findMany({
        orderBy: { price: 'asc' }
      });
    }, 300);
    res.json(tours);
  } catch (error) {
    next(error);
  }
});

tourRoutes.get('/:id', async (req, res, next) => {
  try {
    const tour = await prisma.tour.findUnique({ where: { id: req.params.id } });
    if (!tour || !tour.isActive) {
      return res.status(404).json({ error: 'Tour not found' });
    }
    res.json(tour);
  } catch (error) {
    next(error);
  }
});

tourRoutes.post('/book', async (req, res, next) => {
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
  } catch (error) {
    next(error);
  }
});
