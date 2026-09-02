import { Router } from 'express';
import { getSeatMap, getTripScheduleDetail, holdSeats, releaseSeats } from './seat.controller';
import { verifyAccessToken, optionalAuth } from '../../middleware/auth.middleware';

const router = Router();

router.get('/:tripScheduleId/seats', optionalAuth, getSeatMap);
router.post('/:tripScheduleId/seats/hold', verifyAccessToken, holdSeats);
router.post('/:tripScheduleId/seats/release', verifyAccessToken, releaseSeats);
router.get('/:tripScheduleId', getTripScheduleDetail);

export default router;
