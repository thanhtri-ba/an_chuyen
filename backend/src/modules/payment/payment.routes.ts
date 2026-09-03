import { Router } from 'express';
import {
  createPayment,
  getPayment,
  getPaymentByBooking,
  updatePaymentStatus,
  confirmCODPayment,
  rejectPayment,
  listPendingPayments,
} from './payment.controller';
import { verifyAccessToken } from '../../middleware/auth.middleware';
import { requireAdmin } from '../../middleware/admin.middleware';

const router = Router();

// User routes (creating/reading your own payment is fine; only an admin or a
// verified gateway callback may ever move a payment to PAID/CONFIRMED)
router.post('/create', verifyAccessToken as any, createPayment);
router.get('/:paymentId', verifyAccessToken as any, getPayment);
router.get('/booking/:bookingId', verifyAccessToken as any, getPaymentByBooking);

// Admin-only: no real payment gateway is wired up yet, so nothing should be
// able to mark a payment as paid except an admin acting deliberately (e.g.
// confirming a COD payment in person). Do not relax this to `verifyAccessToken`
// again without also adding real gateway signature verification.
router.patch('/:paymentId/status', verifyAccessToken as any, requireAdmin as any, updatePaymentStatus);
router.post('/cod/confirm', verifyAccessToken as any, requireAdmin as any, confirmCODPayment);
router.post('/admin/reject', verifyAccessToken as any, requireAdmin as any, rejectPayment);
router.get('/admin/pending', verifyAccessToken as any, requireAdmin as any, listPendingPayments);

export default router;
