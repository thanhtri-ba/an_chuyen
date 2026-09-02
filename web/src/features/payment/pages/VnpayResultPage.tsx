import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

// VNPay redirect trình duyệt khách về đây sau khi thanh toán xong (backend
// GET /api/vnpay/return đã verify chữ ký + cập nhật booking trước khi redirect
// tới đây) — trang này chỉ đọc kết quả qua query string, không tự tính toán gì.
export function VnpayResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const status = searchParams.get('status');
  const bookingId = searchParams.get('bookingId');
  const [countdown, setCountdown] = useState(3);

  const isSuccess = status === 'success';

  useEffect(() => {
    if (!isSuccess) return;
    // 'last_booking' đã được PaymentPage lưu trước khi chuyển sang VNPay —
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
    ? { icon: XCircle, color: '#DC2626', bg: '#FEF2F2', title: 'Thanh toán thất bại', desc: 'Giao dịch VNPay không thành công hoặc đã bị huỷ. Ghế của bạn vẫn đang được giữ tạm, vui lòng thử lại.' }
    : { icon: AlertTriangle, color: '#D97706', bg: '#FFFBEB', title: 'Không thể xác nhận giao dịch', desc: 'Có lỗi xảy ra khi xác thực kết quả thanh toán. Vui lòng kiểm tra lại đơn hàng trong "Vé của tôi" hoặc liên hệ hỗ trợ.' };

  const Icon = content.icon;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8 text-center">
        <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: content.bg }}>
          <Icon size={32} color={content.color} />
        </div>
        <h1 className="text-xl font-bold text-[#1a1a1a] mb-2">{content.title}</h1>
        <p className="text-sm text-muted-foreground mb-6">{content.desc}</p>

        <div className="flex flex-col gap-3">
          {isSuccess ? (
            <button onClick={() => navigate('/booking-confirmation', { replace: true })}
              className="w-full bg-[#1a1a1a] hover:bg-black text-white py-4 rounded-xl text-xs font-bold tracking-[0.2em] uppercase transition-all">
              Xem vé ngay
            </button>
          ) : (
            <>
              <button onClick={() => navigate(-1)}
                className="w-full bg-[#1a1a1a] hover:bg-black text-white py-4 rounded-xl text-xs font-bold tracking-[0.2em] uppercase transition-all">
                Thử lại
              </button>
              <button onClick={() => navigate('/my-bookings')}
                className="w-full border border-gray-200 text-[#374151] py-4 rounded-xl text-xs font-bold tracking-[0.2em] uppercase hover:bg-gray-50 transition-all">
                Xem vé của tôi
              </button>
            </>
          )}
        </div>
        {bookingId && <p className="text-[10px] text-gray-400 mt-4">Mã đơn: {bookingId}</p>}
      </div>
    </motion.div>
  );
}
