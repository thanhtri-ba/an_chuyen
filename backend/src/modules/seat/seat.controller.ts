import { Request, Response, NextFunction } from 'express';
import { SeatService } from './seat.service';
import type { AuthenticatedRequest } from '../../middleware/auth.middleware';

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

export const getSeatMap = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { tripScheduleId } = req.params;
    const seats = await SeatService.getSeatMap(tripScheduleId, req.user?.id);
    res.json({ success: true, data: seats });
  } catch (error: any) {
    if (error.message === 'Chuyến xe không tồn tại') {
      return res.status(404).json({ success: false, message: error.message });
    }
    next(error);
  }
};

export const holdSeats = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { tripScheduleId } = req.params;
    const { seatNumbers } = req.body as { seatNumbers?: string[] };
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Cần đăng nhập để giữ ghế' });
    }
    if (!Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      return res.status(400).json({ success: false, message: 'Thiếu danh sách ghế' });
    }
    const result = await SeatService.holdSeats(tripScheduleId, seatNumbers, req.user.id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(409).json({ success: false, message: error.message });
  }
};

export const releaseSeats = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { tripScheduleId } = req.params;
    const { seatNumbers } = req.body as { seatNumbers?: string[] };
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Cần đăng nhập' });
    }
    if (!Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      return res.status(400).json({ success: false, message: 'Thiếu danh sách ghế' });
    }
    await SeatService.releaseSeats(tripScheduleId, seatNumbers, req.user.id);
    res.json({ success: true });
  } catch (error: any) {
    next(error);
  }
};
