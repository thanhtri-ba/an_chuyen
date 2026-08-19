import { Router } from 'express';
import { getSeatMap, getTripScheduleDetail } from './seat.controller';

const router = Router();

router.get('/:tripScheduleId/seats', getSeatMap);
router.get('/:tripScheduleId', getTripScheduleDetail);

export default router;
