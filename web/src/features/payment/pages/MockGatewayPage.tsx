import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FlaskConical, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import api from '../../../lib/api';

const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(n);

// Trang mô phỏng màn hình thanh toán của một cổng ngoài (VNPay/MoMo) — chỉ
// tồn tại để demo/bảo vệ đồ án khi chưa có tài khoản merchant thật. Backend
// (mock-gateway.routes.ts) tự chặn nếu MOCK_PAYMENTS_ENABLED không bật, nên
// trang này không thể dùng để qua mặt thanh toán thật trên production.
// Dùng cùng ngôn ngữ thiết kế cinematic của AuthPage.tsx (serif Cormorant,
// nút CTA đen, blob mờ, card kính mờ) — đây là bản sắc thương hiệu An Chuyến,
// không phải style "dashboard" của PaymentPage.
export function MockGatewayPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get('bookingId') || '';
  const amount = Number(searchParams.get('amount') || 0);
  const [processing, setProcessing] = useState<'success' | 'failed' | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(900); // 15:00 — chỉ để giống cảm giác cổng thật, không có tác dụng gì

  useEffect(() => {
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  const handleOutcome = async (outcome: 'success' | 'failed') => {
    setProcessing(outcome);
    try {
      await api.post('/mock-payment/confirm', { bookingId, outcome });
      if (outcome === 'success') {
        // Giống hệt luồng chuyển khoản ngân hàng — KHÔNG tự coi là đã thanh
        // toán, chỉ ghi nhận và chờ admin duyệt thủ công trong trang quản trị.
        sessionStorage.removeItem('pending_booking');
        toast.success('Đã ghi nhận giao dịch — đang chờ admin duyệt trong trang quản trị.');
        navigate('/my-bookings', { replace: true });
        return;
      }
      navigate(`/payment/mock-result?status=failed&bookingId=${bookingId}`, { replace: true });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Không thể xử lý giao dịch giả lập.');
      setProcessing(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background flex items-center justify-center px-4 py-10 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className="w-full max-w-[440px] bg-white/60 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-white relative z-10"
      >
        <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-primary mb-4">
          <FlaskConical size={12} /> Cổng thanh toán giả lập
        </div>

        <div className="text-center mb-8">
          <h1 className="font-display text-4xl text-[#1a1a1a] mb-3">Xác nhận thanh toán</h1>
          <p className="text-sm text-muted-foreground font-light">Demo cho đồ án — không thu tiền thật</p>
        </div>

        <div className="bg-primary/[0.03] border border-primary/10 rounded-2xl p-6 text-center mb-6">
          <div className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">Số tiền cần thanh toán</div>
          <div className="font-display text-5xl text-[#1a1a1a] tabular-nums">
            {fmt(amount)}<span className="text-xl text-muted-foreground ml-1">đ</span>
          </div>
          <div className="text-[11px] text-gray-400 font-mono mt-3">Mã đơn: {bookingId}</div>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mb-8">
          <span className="font-light">Phiên giao dịch hết hạn sau</span>
          <span className="font-mono font-bold text-[#1a1a1a] tabular-nums">{mm}:{ss}</span>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleOutcome('success')}
            disabled={processing !== null}
            className="w-full bg-[#1a1a1a] hover:bg-black text-white py-4 rounded-xl text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {processing === 'success' ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
            Giả lập thanh toán thành công
          </button>
          <button
            onClick={() => handleOutcome('failed')}
            disabled={processing !== null}
            className="w-full border border-gray-200 text-[#374151] py-4 rounded-xl text-xs font-bold tracking-[0.2em] uppercase hover:bg-gray-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {processing === 'failed' ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
            Giả lập thanh toán thất bại
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground font-light leading-relaxed mt-8 pt-6 border-t border-dashed border-gray-200">
          "Thành công" ở đây chỉ mô phỏng việc khách đã trả tiền — booking vẫn cần <span className="font-semibold text-[#1a1a1a]">admin duyệt</span> trong trang quản trị thì mới chính thức được xác nhận. Trang giả lập nội bộ, không kết nối tới VNPay/MoMo hay bất kỳ ngân hàng nào.
        </p>
      </motion.div>
    </motion.div>
  );
}
