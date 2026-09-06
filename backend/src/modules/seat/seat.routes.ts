import { Router } from 'express';
import { getSeatMap, getTripScheduleDetail, holdSeats, releaseSeats } from './seat.controller';
import { optionalAuth } from '../../middleware/auth.middleware';
import { deviceSessionAuth } from '../../middleware/deviceSession.middleware';
import { requireAnyIdentity } from '../../middleware/combined-auth.middleware';

const router = Router();

// hold/release chấp nhận JWT (tài khoản cũ) HOẶC phiên Email+OTP (khách vãng
// lai) — xem combined-auth.middleware.ts.
router.get('/:tripScheduleId/seats', optionalAuth, getSeatMap);
router.post('/:tripScheduleId/seats/hold', optionalAuth, deviceSessionAuth, requireAnyIdentity, holdSeats);
router.post('/:tripScheduleId/seats/release', optionalAuth, deviceSessionAuth, requireAnyIdentity, releaseSeats);
router.get('/:tripScheduleId', getTripScheduleDetail);

export default router;
