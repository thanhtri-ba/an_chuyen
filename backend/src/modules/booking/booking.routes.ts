import { Router } from 'express';
import { createBooking, getBookings, cancelBooking, adminCancelBooking } from './booking.controller';
import { verifyAccessToken } from '../../middleware/auth.middleware';
import { requireAdmin } from '../../middleware/admin.middleware';

const router = Router();

// Lớp 3: Idempotency có thể được xử lý thêm, hiện tại tập trung Lớp 1 và 2.
router.post('/create', verifyAccessToken as any, createBooking);
router.get('/', verifyAccessToken as any, getBookings);
router.post('/:id/cancel', verifyAccessToken as any, cancelBooking);
// Admin huỷ hộ booking của bất kỳ khách nào (vd. từ modal chi tiết đặt vé) — dùng
// chung logic hoàn tiền với cancelBooking, chỉ bỏ qua kiểm tra chủ sở hữu.
router.post('/:id/admin-cancel', verifyAccessToken as any, requireAdmin as any, adminCancelBooking);

export default router;
