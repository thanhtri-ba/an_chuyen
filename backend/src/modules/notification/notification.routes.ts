import { Router } from 'express';
import {
  listMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from './notification.controller';
import { verifyAccessToken } from '../../middleware/auth.middleware';

const router = Router();

router.get('/', verifyAccessToken as any, listMyNotifications);
router.patch('/read-all', verifyAccessToken as any, markAllNotificationsAsRead);
router.patch('/:id/read', verifyAccessToken as any, markNotificationAsRead);

export default router;
