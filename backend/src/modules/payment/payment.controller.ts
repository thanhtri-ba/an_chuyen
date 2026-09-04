import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { PaymentService } from './payment.service';
import { CreatePaymentDTO, PaymentStatus, ConfirmPaymentDTO } from './payment.dto';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

const prisma = new PrismaClient();
const paymentService = new PaymentService(prisma);

export const createPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookingId, method } = req.body;

    if (!bookingId || !method) {
      return res.status(400).json({ error: 'Missing required fields: bookingId, method' });
    }

    // Anti-tampering: amount is NEVER taken from the client. It is always
    // derived server-side from the booking's own totalAmount.
    const payment = await paymentService.createPayment({
      bookingId,
      method,
    } as CreatePaymentDTO);

    res.status(201).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

export const getPayment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';

    let payment;
    try {
      payment = await paymentService.getPayment(paymentId);
    } catch {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (!isAdmin && payment.booking?.userId !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentByBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookingId } = req.params;

    const payment = await paymentService.getPaymentByBooking(bookingId);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePaymentStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { paymentId } = req.params;
    const { status, transactionId } = req.body;
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';

    if (!status) {
      return res.status(400).json({ error: 'Missing required field: status' });
    }

    // Ownership check: a non-admin user may only touch payments that belong
    // to one of their own bookings. Prevents any logged-in user from marking
    // an arbitrary payment (by guessed/observed paymentId) as PAID.
    if (!isAdmin) {
      const existing = await paymentService.getPayment(paymentId);
      if (existing.booking?.userId !== userId) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      // Non-admins are not allowed to self-mark a payment as PAID/REFUNDED —
      // that must come from a verified payment-gateway callback or an admin.
      if (status === 'PAID' || status === 'REFUNDED') {
        return res.status(403).json({ error: 'Only an admin or payment gateway can set this status' });
      }
    }

    const payment = await paymentService.updatePaymentStatus(paymentId, status, transactionId);

    res.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

export const confirmCODPayment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { paymentId } = req.body;

    if (!paymentId) {
      return res.status(400).json({ error: 'Missing required field: paymentId' });
    }

    // adminEmail is never taken from the client — it is derived from the
    // authenticated admin's own token, set by requireAdmin on this route.
    const adminEmail = req.user?.email;
    if (!adminEmail) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const payment = await paymentService.confirmCODPayment({
      paymentId,
      adminEmail,
    } as ConfirmPaymentDTO);

    res.json({
      success: true,
      message: 'COD payment confirmed',
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

export const listPendingPayments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payments = await paymentService.listPendingPayments();

    res.json({
      success: true,
      data: payments,
      count: payments.length,
    });
  } catch (error) {
    next(error);
  }
};
