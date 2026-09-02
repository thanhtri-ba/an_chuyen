import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { getCached } from '../../core/cache';

export const heroRoutes = Router();
const prisma = new PrismaClient();

heroRoutes.get('/', async (req, res, next) => {
  try {
    const slides = await getCached('hero_slides', async () => {
      return prisma.heroSlide.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
      });
    }, 300);
    res.json(slides);
  } catch (error) {
    next(error);
  }
});
