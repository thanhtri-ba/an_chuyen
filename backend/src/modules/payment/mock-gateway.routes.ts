import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyAccessToken, type AuthenticatedRequest } from '../../middleware/auth.middleware';
import { markPaymentFailed } from './confirm.util';

export const mockGatewayRoutes = Router();
const prisma = new PrismaClient();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Cổng thanh toán GIẢ LẬP — dùng cho demo/đồ án khi chưa có tài khoản merchant
// VNPay/MoMo thật. Chỉ hoạt động khi MOCK_PAYMENTS_ENABLED=true (KHÔNG bật mặc
// định) — mô phỏng đúng luồng redirect ra cổng ngoài rồi callback về như
// VNPay/MoMo thật, nhưng khách tự bấm "giả lập thành công/thất bại" thay vì
// nhập thẻ thật. Booking vẫn tạo thật (PENDING_PAYMENT), payment vẫn PENDING
// cho tới khi confirm — không có gì được coi là "đã thanh toán" cho tới khi
// khách bấm nút giả lập, giống hệt cơ chế của gateway thật.
function isMockEnabled() {
  return process.env.MOCK_PAYMENTS_ENABLED === 'true';
}

mockGatewayRoutes.post('/create-url', verifyAccessToken as any, async (req: AuthenticatedRequest, res) => {
  if (!isMockEnabled()) {
    return res.status(500).json({ message: 'Cổng thanh toán giả lập chưa được bật trên server' });
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
    return res.status(400).json({ message: 'Booking này không có giao dịch đang chờ' });
  }

  const paymentUrl = `${FRONTEND_URL}/payment/mock-gateway?bookingId=${booking.id}&amount=${Math.round(booking.totalAmount)}`;
  res.json({ success: true, paymentUrl });
});

// Khách bấm "giả lập thành công/thất bại" trên trang mock-gateway của FE.
// CHỦ Ý KHÔNG tự confirm payment ở đây dù outcome là 'success' — khác với
// VNPay/MoMo thật (chữ ký HMAC chứng minh chính gateway đó xác nhận), một
// cú POST từ trình duyệt khách không phải bằng chứng thanh toán đáng tin.
// 'success' chỉ chuyển payment sang PROCESSING (đã "nộp", đang chờ admin đối
// soát) — giống hệt luồng chuyển khoản ngân hàng/COD hiện có: admin phải vào
// trang Giao Dịch Thanh Toán bấm "Duyệt" (POST /api/payments/cod/confirm)
// thì booking mới thật sự CONFIRMED.
mockGatewayRoutes.post('/confirm', verifyAccessToken as any, async (req: AuthenticatedRequest, res) => {
  if (!isMockEnabled()) {
    return res.status(500).json({ message: 'Cổng thanh toán giả lập chưa được bật trên server' });
  }

  const { bookingId, outcome } = req.body;
  if (!bookingId || (outcome !== 'success' && outcome !== 'failed')) {
    return res.status(400).json({ message: 'Thiếu bookingId hoặc outcome không hợp lệ' });
  }

  const booking = await prisma.booking.findUnique({ where: { id: bookingId }, include: { payment: true } });
  if (!booking || booking.userId !== req.user?.id) {
    return res.status(404).json({ message: 'Booking không tồn tại' });
  }
  if (!booking.payment || booking.payment.status !== 'PENDING') {
    return res.status(400).json({ message: 'Booking này không có giao dịch đang chờ' });
  }

  if (outcome === 'success') {
    // Giữ nguyên status PENDING (không tự set PAID) — chỉ gắn gateway để admin
    // biết đây là giao dịch demo khi duyệt. Payment ở PENDING đã tự hiện trong
    // danh sách "Đang chờ" của trang Giao Dịch Thanh Toán, không cần trạng
    // thái riêng.
    await prisma.payment.update({
      where: { id: booking.payment.id },
      data: { gateway: 'MockGateway' },
    });
    return res.json({ success: true, status: 'PENDING' });
  }

  await markPaymentFailed(bookingId);
  res.json({ success: true, status: 'FAILED' });
});
