import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { getCached } from '../../core/cache';

export const deliveryRoutes = Router();
const prisma = new PrismaClient();

deliveryRoutes.get('/vehicles', async (req, res, next) => {
  try {
    const vehicles = await getCached('delivery_vehicles', async () => {
      return prisma.deliveryVehicle.findMany({
        where: { isActive: true },
        orderBy: { price: 'asc' }
      });
    }, 300);
    res.json(vehicles);
  } catch (error) {
    next(error);
  }
});

deliveryRoutes.post('/book', async (req, res, next) => {
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
  } catch (error) {
    next(error);
  }
});
