import { Router } from 'express';
import { createBooking, getBookings, cancelBooking } from './booking.controller';
import { optionalAuth } from '../../middleware/auth.middleware';
import { deviceSessionAuth } from '../../middleware/deviceSession.middleware';
import { requireAnyIdentity } from '../../middleware/combined-auth.middleware';
import { guestBookingIdentity } from '../../middleware/guestBookingIdentity.middleware';

const router = Router();

// Chấp nhận JWT (tài khoản cũ) HOẶC phiên Email+OTP (khách vãng lai) — xem
// combined-auth.middleware.ts. Controller vẫn đọc req.user?.id như cũ.
const anyIdentity = [optionalAuth, deviceSessionAuth, requireAnyIdentity];

// Lớp 3: Idempotency có thể được xử lý thêm, hiện tại tập trung Lớp 1 và 2.
// /create thêm guestBookingIdentity TRƯỚC requireAnyIdentity — khách hoàn
// toàn mới (không JWT, không phiên cũ) vẫn đặt được nếu gửi kèm contactEmail,
// tự tạo danh tính từ email đó, không cần OTP (xem REDESIGN-PLAN.md).
router.post('/create', [optionalAuth, deviceSessionAuth, guestBookingIdentity, requireAnyIdentity] as any, createBooking);
router.get('/', anyIdentity as any, getBookings);
router.post('/:id/cancel', anyIdentity as any, cancelBooking);

export default router;
