import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  gatewayLabel: string; // 'VNPay' | 'MoMo' | 'giả lập (Demo)' — chỉ dùng để hiển thị thông báo lỗi rõ ràng
}

// Cổng thanh toán redirect trình duyệt khách về đây sau khi thanh toán xong
// (backend GET /api/{vnpay,momo}/return đã verify chữ ký + cập nhật booking
// trước khi redirect tới đây) — trang này chỉ đọc kết quả qua query string,
// không tự tính toán gì. Dùng chung cho mọi cổng vì luồng return giống hệt
// nhau (xem vnpay.routes.ts/momo.routes.ts). Cùng ngôn ngữ thiết kế cinematic
// của AuthPage.tsx (serif Cormorant, nút CTA đen, blob mờ, card kính mờ).
export function PaymentResultPage({ gatewayLabel }: Props) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const status = searchParams.get('status');
  const bookingId = searchParams.get('bookingId');
  const [countdown, setCountdown] = useState(3);

  const isSuccess = status === 'success';

  useEffect(() => {
    if (!isSuccess) return;
    // 'pending_booking' đã được PaymentPage lưu trước khi chuyển sang cổng —
    // BookingConfirmationPage đọc lại đúng dữ liệu đó.
    sessionStorage.removeItem('pending_booking');
    localStorage.removeItem('pending_booking');
    const t = setInterval(() => setCountdown(c => c - 1), 1000);
    const nav = setTimeout(() => navigate('/booking-confirmation', { replace: true }), 3000);
    return () => { clearInterval(t); clearTimeout(nav); };
  }, [isSuccess, navigate]);

  const content = isSuccess
    ? { icon: CheckCircle2, color: '#16A34A', bg: '#F0FDF4', title: 'Thanh toán thành công!', desc: `Đơn hàng đã được xác nhận. Đang chuyển đến vé điện tử${countdown > 0 ? ` trong ${countdown}s` : '...'}` }
    : status === 'failed'
    ? { icon: XCircle, color: '#DC2626', bg: '#FEF2F2', title: 'Thanh toán thất bại', desc: `Giao dịch ${gatewayLabel} không thành công hoặc đã bị huỷ. Ghế của bạn vẫn đang được giữ tạm, vui lòng thử lại.` }
    : { icon: AlertTriangle, color: '#D97706', bg: '#FFFBEB', title: 'Không thể xác nhận giao dịch', desc: 'Có lỗi xảy ra khi xác thực kết quả thanh toán. Vui lòng kiểm tra lại đơn hàng trong "Vé của tôi" hoặc liên hệ hỗ trợ.' };

  const Icon = content.icon;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className="w-full max-w-[440px] bg-white/60 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-white text-center relative z-10"
      >
        <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ background: content.bg }}>
          <Icon size={30} color={content.color} />
        </div>
        <h1 className="font-display text-3xl text-[#1a1a1a] mb-3">{content.title}</h1>
        <p className="text-sm text-muted-foreground font-light leading-relaxed mb-8">{content.desc}</p>

        <div className="flex flex-col gap-3">
          {isSuccess ? (
            <button onClick={() => navigate('/booking-confirmation', { replace: true })}
              className="w-full bg-[#1a1a1a] hover:bg-black text-white py-4 rounded-xl text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Xem vé ngay
            </button>
          ) : (
            <>
              <button onClick={() => navigate(-1)}
                className="w-full bg-[#1a1a1a] hover:bg-black text-white py-4 rounded-xl text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                Thử lại
              </button>
              <button onClick={() => navigate('/my-bookings')}
                className="w-full border border-gray-200 text-[#374151] py-4 rounded-xl text-xs font-bold tracking-[0.2em] uppercase hover:bg-gray-50 transition-all">
                Xem vé của tôi
              </button>
            </>
          )}
        </div>
        {bookingId && <p className="text-[11px] text-gray-400 font-mono mt-6">Mã đơn: {bookingId}</p>}
      </motion.div>
    </motion.div>
  );
}
