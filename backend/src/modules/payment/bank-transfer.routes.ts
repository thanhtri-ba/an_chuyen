import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { confirmPaymentSuccess } from './confirm.util';

export const bankTransferRoutes = Router();
const prisma = new PrismaClient();

// Thông tin tài khoản ngân hàng để sinh mã QR VietQR (img.vietqr.io — dịch vụ
// công khai, không cần đăng ký/API key). Mặc định admin xác nhận thủ công
// giống luồng COD (POST /api/payments/cod/confirm); nếu cấu hình SEPAY_API_KEY
// hoặc CASSO_WEBHOOK_TOKEN bên dưới thì webhook tương ứng sẽ tự xác nhận khi
// tiền về — cả 2 dịch vụ đều có gói Free (1 tài khoản ngân hàng/1 webhook),
// chỉ cần dùng MỘT trong hai, không cần cả hai.
bankTransferRoutes.get('/info', (req, res) => {
  const accountName = process.env.BANK_ACCOUNT_NAME;
  const accountNumber = process.env.BANK_ACCOUNT_NUMBER;
  const bankBin = process.env.BANK_BIN;

  if (!accountName || !accountNumber || !bankBin) {
    return res.status(500).json({ message: 'Chuyển khoản ngân hàng chưa được cấu hình trên server' });
  }

  res.json({ accountName, accountNumber, bankBin });
});

// Webhook SePay (sepay.vn) — dịch vụ theo dõi biến động số dư ngân hàng, gọi
// URL này mỗi khi tài khoản nhận tiền vào. Xác thực bằng SEPAY_API_KEY (đặt
// trùng giữa .env ở đây và cấu hình webhook trên dashboard SePay) — KHÔNG
// được tin bất kỳ payload nào nếu key không khớp, vì endpoint này public.
// Đối soát bằng cách khớp 8 ký tự đầu bookingId (đã nhúng vào nội dung CK khi
// tạo mã QR — xem BankTransferQRPage.tsx) VÀ số tiền phải khớp chính xác.
bankTransferRoutes.post('/webhook/sepay', async (req, res) => {
  try {
    const configuredKey = process.env.SEPAY_API_KEY;
    if (!configuredKey) return res.status(500).json({ success: false, message: 'SePay webhook chưa được cấu hình' });

    const authHeader = req.headers['authorization'] || '';
    const providedKey = String(authHeader).replace(/^Apikey\s+/i, '').trim();
    if (providedKey !== configuredKey) {
      return res.status(401).json({ success: false, message: 'Invalid API key' });
    }

    const { transferType, transferAmount, content, description, referenceCode, id } = req.body || {};
    if (transferType && transferType !== 'in') {
      return res.json({ success: true }); // tiền ra khỏi tài khoản, không liên quan booking
    }

    const rawContent = String(content || description || '');
    const match = rawContent.toUpperCase().match(/AC\s*([A-F0-9]{8})/);
    if (!match) return res.json({ success: true }); // không phải giao dịch đặt vé, bỏ qua

    const bookingPrefix = match[1];
    const booking = await prisma.booking.findFirst({
      where: { id: { startsWith: bookingPrefix, mode: 'insensitive' }, status: 'PENDING_PAYMENT' },
      include: { payment: true },
    });
    if (!booking || !booking.payment) return res.json({ success: true });

    const expectedAmount = Math.round(booking.totalAmount);
    if (Number(transferAmount) !== expectedAmount) {
      return res.json({ success: true }); // số tiền không khớp — không tự xác nhận, để admin kiểm tra thủ công
    }

    await confirmPaymentSuccess(booking.id, 'SePay', String(referenceCode || id || ''));
    res.json({ success: true });
  } catch (error) {
    console.error('[sepay webhook] error:', error);
    res.status(500).json({ success: false });
  }
});

// Webhook Casso (casso.vn) — cùng mục đích với SePay ở trên (có gói Free
// 1 tài khoản ngân hàng, đủ cho đồ án/demo), chỉ khác định dạng payload:
// Casso gửi một MẢNG giao dịch trong `data[]` mỗi lần gọi (có thể gộp nhiều
// giao dịch trong 1 lần gọi), nên phải lặp qua từng giao dịch thay vì đọc
// thẳng req.body như SePay. Header xác thực cấu hình trên dashboard Casso
// (Cấu hình Webhook > Secure Token) phải đặt trùng CASSO_WEBHOOK_TOKEN.
bankTransferRoutes.post('/webhook/casso', async (req, res) => {
  try {
    const configuredToken = process.env.CASSO_WEBHOOK_TOKEN;
    if (!configuredToken) return res.status(500).json({ error: 1, message: 'Casso webhook chưa được cấu hình' });

    const authHeader = req.headers['authorization'] || '';
    const providedToken = String(authHeader).replace(/^Apikey\s+/i, '').trim();
    if (providedToken !== configuredToken) {
      return res.status(401).json({ error: 1, message: 'Invalid token' });
    }

    const transactions: any[] = Array.isArray(req.body?.data) ? req.body.data : [];

    for (const tx of transactions) {
      const amount = Number(tx.amount);
      if (!(amount > 0)) continue; // amount âm = tiền RA khỏi tài khoản, không liên quan booking

      const rawContent = String(tx.description || '');
      const match = rawContent.toUpperCase().match(/AC\s*([A-F0-9]{8})/);
      if (!match) continue; // không phải giao dịch đặt vé, bỏ qua

      const bookingPrefix = match[1];
      const booking = await prisma.booking.findFirst({
        where: { id: { startsWith: bookingPrefix, mode: 'insensitive' }, status: 'PENDING_PAYMENT' },
        include: { payment: true },
      });
      if (!booking || !booking.payment) continue;

      const expectedAmount = Math.round(booking.totalAmount);
      if (amount !== expectedAmount) continue; // số tiền không khớp — để admin kiểm tra thủ công

      await confirmPaymentSuccess(booking.id, 'Casso', String(tx.tid || tx.id || ''));
    }

    res.json({ error: 0, message: 'success' });
  } catch (error) {
    console.error('[casso webhook] error:', error);
    res.status(500).json({ error: 1, message: 'Internal error' });
  }
});
