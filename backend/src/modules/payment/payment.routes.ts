import { Router } from 'express';
import {
  createPayment,
  getPayment,
  getPaymentByBooking,
  updatePaymentStatus,
  confirmCODPayment,
  listPendingPayments,
} from './payment.controller';
import { verifyAccessToken } from '../../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/create', verifyAccessToken as any, createPayment);
router.get('/:paymentId', verifyAccessToken as any, getPayment);
router.get('/booking/:bookingId', verifyAccessToken as any, getPaymentByBooking);
router.patch('/:paymentId/status', verifyAccessToken as any, updatePaymentStatus);

// Admin routes
router.post('/cod/confirm', verifyAccessToken as any, confirmCODPayment);
router.get('/admin/pending', verifyAccessToken as any, listPendingPayments);

export default router;
