import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { getCached } from '../../core/cache';

export const bannerRoutes = Router();
const prisma = new PrismaClient();

bannerRoutes.get('/', async (req, res, next) => {
  try {
    const platform = (req.query.platform as string) || 'web';
    const banners = await getCached('banners', async () => {
      return prisma.banner.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      });
    }, 300);
    res.json(banners.filter((b) => b.platform === platform || b.platform === 'all'));
  } catch (error) {
    next(error);
  }
});
