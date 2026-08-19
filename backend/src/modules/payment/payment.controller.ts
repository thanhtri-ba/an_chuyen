import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { PaymentService } from './payment.service';
import { CreatePaymentDTO, PaymentStatus, ConfirmPaymentDTO } from './payment.dto';

const prisma = new PrismaClient();
const paymentService = new PaymentService(prisma);

export const createPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookingId, method, amount } = req.body;

    if (!bookingId || !method || !amount) {
      return res.status(400).json({ error: 'Missing required fields: bookingId, method, amount' });
    }

    const payment = await paymentService.createPayment({
      bookingId,
      method,
      amount,
    } as CreatePaymentDTO);

    res.status(201).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

export const getPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { paymentId } = req.params;

    const payment = await paymentService.getPayment(paymentId);

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

export const updatePaymentStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { paymentId } = req.params;
    const { status, transactionId } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Missing required field: status' });
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

export const confirmCODPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { paymentId, adminEmail } = req.body;

    if (!paymentId || !adminEmail) {
      return res.status(400).json({ error: 'Missing required fields: paymentId, adminEmail' });
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
