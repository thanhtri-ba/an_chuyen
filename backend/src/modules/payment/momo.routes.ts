import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyAccessToken, type AuthenticatedRequest } from '../../middleware/auth.middleware';
import { getMomoConfig, createPaymentUrl, verifySignature, buildOrderId, bookingIdFromOrderId } from './momo.util';
import { confirmPaymentSuccess, markPaymentFailed } from './confirm.util';

export const momoRoutes = Router();
const prisma = new PrismaClient();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Mounted at /api/momo in index.ts.
// Khách bấm "Thanh toán" với phương thức MoMo ở FE — booking đã được tạo
// trước đó (PENDING_PAYMENT, Payment.status=PENDING, method=momo), route
// này chỉ sinh URL redirect sang cổng MoMo cho giao dịch đó.
momoRoutes.post('/create-url', verifyAccessToken as any, async (req: AuthenticatedRequest, res) => {
  try {
    const config = getMomoConfig();
    if (!config) {
      return res.status(500).json({ message: 'MoMo chưa được cấu hình trên server' });
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
      return res.status(400).json({ message: 'Booking này không có giao dịch MoMo đang chờ' });
    }

    const orderId = buildOrderId(booking.id);
    const result = await createPaymentUrl(config, {
      orderId,
      amount: Math.round(booking.totalAmount),
      orderInfo: `Thanh toan don hang ${booking.id}`,
    });

    if ('error' in result) {
      return res.status(502).json({ message: result.error });
    }

    res.json({ success: true, paymentUrl: result.payUrl });
  } catch (error) {
    console.error('[momo/create-url] error:', error);
    res.status(500).json({ message: 'Không thể tạo giao dịch MoMo' });
  }
});

const confirmMomoSuccess = (bookingId: string, transactionId: string) => confirmPaymentSuccess(bookingId, 'MoMo', transactionId);
const markMomoFailed = markPaymentFailed;

// Trình duyệt khách được MoMo redirect về đây sau khi thanh toán — verify
// chữ ký trước khi tin BẤT KỲ trường nào trong query (tránh giả URL thành công).
momoRoutes.get('/return', async (req, res) => {
  const config = getMomoConfig();
  if (!config) return res.redirect(`${FRONTEND_URL}/payment/momo-result?status=error`);

  const isValid = verifySignature(config, req.query as Record<string, any>);
  const orderId = req.query.orderId as string | undefined;
  const bookingId = orderId ? bookingIdFromOrderId(orderId) : undefined;

  if (!isValid || !bookingId) {
    return res.redirect(`${FRONTEND_URL}/payment/momo-result?status=invalid`);
  }

  const resultCode = req.query.resultCode;
  if (resultCode === '0') {
    const result = await confirmMomoSuccess(bookingId, String(req.query.transId || orderId));
    return res.redirect(`${FRONTEND_URL}/payment/momo-result?status=${result.ok ? 'success' : 'error'}&bookingId=${bookingId}`);
  }

  await markMomoFailed(bookingId);
  return res.redirect(`${FRONTEND_URL}/payment/momo-result?status=failed&bookingId=${bookingId}`);
});

// IPN (Instant Payment Notification) — MoMo gọi server-to-server, độc lập với
// việc khách có đóng trình duyệt trước khi redirect về hay không. Cần domain
// public để MoMo gọi tới (không hoạt động trên localhost) — chỉ có tác dụng
// khi deploy thật; return URL ở trên vẫn xử lý được luồng đầy đủ khi chạy dev.
momoRoutes.post('/ipn', async (req, res) => {
  const config = getMomoConfig();
  if (!config) return res.status(200).json({ message: 'Config not found' });

  const isValid = verifySignature(config, req.body as Record<string, any>);
  if (!isValid) return res.status(200).json({ message: 'Invalid signature' });

  const orderId = req.body.orderId as string | undefined;
  const bookingId = orderId ? bookingIdFromOrderId(orderId) : undefined;
  if (!bookingId) return res.status(200).json({ message: 'Order not found' });

  const booking = await prisma.booking.findUnique({ where: { id: bookingId }, include: { payment: true } });
  if (!booking || !booking.payment) return res.status(200).json({ message: 'Order not found' });

  const expectedAmount = Math.round(booking.totalAmount);
  if (Number(req.body.amount) !== expectedAmount) {
    return res.status(200).json({ message: 'Invalid amount' });
  }

  if (String(req.body.resultCode) === '0') {
    const result = await confirmMomoSuccess(bookingId, String(req.body.transId || orderId));
    if (!result.ok) return res.status(200).json({ message: 'Confirm failed' });
    return res.status(204).send();
  }

  await markMomoFailed(bookingId);
  return res.status(204).send();
});
