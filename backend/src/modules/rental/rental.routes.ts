import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { getCached } from '../../core/cache';

export const rentalRoutes = Router();
const prisma = new PrismaClient();

rentalRoutes.get('/cars', async (req, res, next) => {
  try {
    const cars = await getCached('rental_cars', async () => {
      return prisma.rentalCar.findMany({
        where: { isActive: true },
        orderBy: { pricePerDay: 'asc' }
      });
    }, 300);
    res.json(cars);
  } catch (error) {
    next(error);
  }
});

rentalRoutes.post('/book', async (req, res, next) => {
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
  } catch (error) {
    next(error);
  }
});
