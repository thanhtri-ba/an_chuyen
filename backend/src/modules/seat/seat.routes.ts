import { Router } from 'express';
import { getSeatMap } from './seat.controller';

const router = Router();

router.get('/:tripScheduleId/seats', getSeatMap);

export default router;
