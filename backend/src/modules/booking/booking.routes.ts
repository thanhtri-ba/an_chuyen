import { Router } from 'express';
import { createBooking, getBookings } from './booking.controller';
import { verifyAccessToken } from '../../middleware/auth.middleware';

const router = Router();

// Lớp 3: Idempotency có thể được xử lý thêm, hiện tại tập trung Lớp 1 và 2.
router.post('/create', verifyAccessToken as any, createBooking);
router.get('/', verifyAccessToken as any, getBookings);

export default router;
