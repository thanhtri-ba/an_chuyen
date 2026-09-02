import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyAccessToken, type AuthenticatedRequest } from '../../middleware/auth.middleware';
import { getVnpayConfig, createPaymentUrl, verifySignature, buildTxnRef, bookingIdFromTxnRef } from './vnpay.util';
import { confirmPaymentSuccess, markPaymentFailed } from './confirm.util';

export const vnpayRoutes = Router();
const prisma = new PrismaClient();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Mounted at /api/vnpay in index.ts.
// Khách bấm "Thanh toán" với phương thức VNPay ở FE — booking đã được tạo
// trước đó (PENDING_PAYMENT, Payment.status=PENDING, method=vnpay), route
// này chỉ sinh URL redirect sang cổng VNPay cho giao dịch đó.
vnpayRoutes.post('/create-url', verifyAccessToken as any, async (req: AuthenticatedRequest, res) => {
  try {
    const config = getVnpayConfig();
    if (!config) {
      return res.status(500).json({ message: 'VNPay chưa được cấu hình trên server' });
    }

    const { bookingId } = req.body;
    if (!bookingId) return res.status(400).json({ message: 'Thiếu bookingId' });

    const booking = await prisma.booking.findUnique({ where: { id: bookingId }, include: { payment: true } });
    if (!booking || booking.userId !== req.user?.id) {
      return res.status(404).json({ message: 'Booking không tồn tại' });
    }
    if (booking.status !== 'PENDING_PAYMENT') {
      return res.status(400).json({ message: 'Booking không ở trạng thái chờ thanh toán' });
    }
    if (!booking.payment || booking.payment.status !== 'PENDING') {
      return res.status(400).json({ message: 'Booking này không có giao dịch VNPay đang chờ' });
    }

    const txnRef = buildTxnRef(booking.id);
    const ipAddr = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || '127.0.0.1';

    const paymentUrl = createPaymentUrl(config, {
      txnRef,
      amount: booking.totalAmount,
      orderInfo: `Thanh toan don hang ${booking.id}`,
      ipAddr,
    });

    res.json({ success: true, paymentUrl });
  } catch (error) {
    console.error('[vnpay/create-url] error:', error);
    res.status(500).json({ message: 'Không thể tạo giao dịch VNPay' });
  }
});

const confirmVnpaySuccess = (bookingId: string, transactionId: string) => confirmPaymentSuccess(bookingId, 'VNPay', transactionId);
const markVnpayFailed = markPaymentFailed;

// Trình duyệt khách được VNPay redirect về đây sau khi thanh toán — verify
// chữ ký trước khi tin BẤT KỲ trường nào trong query (tránh giả URL thành công).
vnpayRoutes.get('/return', async (req, res) => {
  const config = getVnpayConfig();
  if (!config) return res.redirect(`${FRONTEND_URL}/payment/vnpay-result?status=error`);

  const isValid = verifySignature(config, req.query as Record<string, any>);
  const txnRef = req.query.vnp_TxnRef as string | undefined;
  const bookingId = txnRef ? bookingIdFromTxnRef(txnRef) : undefined;

  if (!isValid || !bookingId) {
    return res.redirect(`${FRONTEND_URL}/payment/vnpay-result?status=invalid`);
  }

  const responseCode = req.query.vnp_ResponseCode;
  if (responseCode === '00') {
    const result = await confirmVnpaySuccess(bookingId, String(req.query.vnp_TransactionNo || txnRef));
    return res.redirect(`${FRONTEND_URL}/payment/vnpay-result?status=${result.ok ? 'success' : 'error'}&bookingId=${bookingId}`);
  }

  await markVnpayFailed(bookingId);
  return res.redirect(`${FRONTEND_URL}/payment/vnpay-result?status=failed&bookingId=${bookingId}`);
});

// IPN (Instant Payment Notification) — VNPay gọi server-to-server, độc lập với
// việc khách có đóng trình duyệt trước khi redirect về hay không. Cần domain
// public để VNPay gọi tới (không hoạt động trên localhost) — chỉ có tác dụng
// khi deploy thật; return URL ở trên vẫn xử lý được luồng đầy đủ khi chạy dev.
vnpayRoutes.get('/ipn', async (req, res) => {
  const config = getVnpayConfig();
  if (!config) return res.json({ RspCode: '99', Message: 'Config not found' });

  const isValid = verifySignature(config, req.query as Record<string, any>);
  if (!isValid) return res.json({ RspCode: '97', Message: 'Invalid signature' });

  const txnRef = req.query.vnp_TxnRef as string | undefined;
  const bookingId = txnRef ? bookingIdFromTxnRef(txnRef) : undefined;
  if (!bookingId) return res.json({ RspCode: '01', Message: 'Order not found' });

  const booking = await prisma.booking.findUnique({ where: { id: bookingId }, include: { payment: true } });
  if (!booking || !booking.payment) return res.json({ RspCode: '01', Message: 'Order not found' });

  const expectedAmount = Math.round(booking.totalAmount) * 100;
  if (String(req.query.vnp_Amount) !== String(expectedAmount)) {
    return res.json({ RspCode: '04', Message: 'Invalid amount' });
  }

  if (req.query.vnp_ResponseCode === '00') {
    const result = await confirmVnpaySuccess(bookingId, String(req.query.vnp_TransactionNo || txnRef));
    if (!result.ok) return res.json({ RspCode: '99', Message: 'Confirm failed' });
    return res.json({ RspCode: '00', Message: 'Confirm Success' });
  }

  await markVnpayFailed(bookingId);
  return res.json({ RspCode: '00', Message: 'Confirm Success' });
});
