import { Request, Response, NextFunction } from 'express';
import { SeatService } from './seat.service';

export const getTripScheduleDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tripScheduleId } = req.params;
    const tripSchedule = await SeatService.getTripScheduleDetail(tripScheduleId);
    res.json({ success: true, data: tripSchedule });
  } catch (error: any) {
    if (error.message === 'Chuyến xe không tồn tại') {
      return res.status(404).json({ success: false, message: error.message });
    }
    next(error);
  }
};

export const getSeatMap = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tripScheduleId } = req.params;
    const seats = await SeatService.getSeatMap(tripScheduleId);
    res.json({ success: true, data: seats });
  } catch (error: any) {
    if (error.message === 'Chuyến xe không tồn tại') {
      return res.status(404).json({ success: false, message: error.message });
    }
    next(error);
  }
};
