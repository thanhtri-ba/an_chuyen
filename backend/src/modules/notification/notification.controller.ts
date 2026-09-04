import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from './notification.service';
import type { AuthenticatedRequest } from '../../middleware/auth.middleware';

const prisma = new PrismaClient();
const notificationService = new NotificationService(prisma);

export const listMyNotifications = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const notifications = await notificationService.listForUser(userId);
    res.json({ success: true, data: notifications });
  } catch (error) {
    next(error);
  }
};

export const markNotificationAsRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const notification = await notificationService.markAsRead(userId, id);
    res.json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};

export const markAllNotificationsAsRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    await notificationService.markAllAsRead(userId);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
