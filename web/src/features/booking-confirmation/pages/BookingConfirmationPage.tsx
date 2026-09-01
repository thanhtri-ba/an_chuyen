import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2, Download, Home, Share2, Eye, MapPin, Bus, Armchair, Calendar,
  Clock, ShieldCheck, Luggage, RotateCcw, AlertTriangle, Phone, Mail,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

// Confetti particle component
function ConfettiParticle({ delay, color }: { delay: number; color: string }) {
  const left = Math.random() * 100;
  const duration = 3 + Math.random() * 2;
  return (
    <motion.div
      initial={{ y: -20, x: `${left}vw`, opacity: 1, rotate: 0 }}
      animate={{ y: '105vh', opacity: [1, 1, 0], rotate: 720 }}
      transition={{ duration, delay, ease: 'easeIn' }}
      className="fixed top-0 z-50 pointer-events-none"
      style={{ width: 10, height: 10, backgroundColor: color, borderRadius: Math.random() > 0.5 ? '50%' : '2px' }}
    />
  );
}

const CONFETTI_COLORS = ['#F2C118', '#C97B2F', '#192B1D', '#8AA890'];

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  momo: 'Ví MoMo',
  zalopay: 'Ví ZaloPay',
  vnpay: 'VNPay',
  shopeepay: 'Ví ShopeePay',
  card: 'Visa / Mastercard / JCB',
  atm: 'Thẻ ATM nội địa / Internet Banking',
  store: 'Tiền mặt tại cửa hàng tiện lợi',
};

import type { BookingConfirmation } from '../../../types';

export function BookingConfirmationPage() {
  const [showConfetti, setShowConfetti] = useState(true);
  const [booking, setBooking] = useState<BookingConfirmation | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    const raw = sessionStorage.getItem('last_booking');
    if (raw) {
      try {
        setBooking(JSON.parse(raw));
      } catch {
        setBooking(null);
      }
    }
    return () => clearTimeout(timer);
  }, []);

  const bookingDate = booking ? new Date(booking.createdAt) : null;
  const departure = booking?.departureTime ? new Date(booking.departureTime) : null;
  const lookupCode = booking?.bookingId ? booking.bookingId.slice(0, 8).toUpperCase() : '—';
  const qrValue = booking?.bookingId
    ? `${window.location.origin}/my-bookings?lookup=${booking.bookingId}`
    : window.location.origin;
  const paymentMethodLabel = booking?.paymentMethod ? PAYMENT_METHOD_LABEL[booking.paymentMethod] || booking.paymentMethod : null;

  const fmtDate = (d: Date) => d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const fmtDateTime = (d: Date) => `${fmtDate(d)} - ${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;

  return (
    <div className="min-h-screen bg-[#F5F3EE] pt-24 pb-16 flex flex-col items-center justify-start p-4 font-['Inter',_sans-serif] text-[#0C0D0B]">
      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <>
            {[...Array(40)].map((_, i) => (
              <ConfettiParticle key={i} delay={i * 0.05} color={CONFETTI_COLORS[i % CONFETTI_COLORS.length]} />
            ))}
          </>
        )}
      </AnimatePresence>

      <div className="max-w-[980px] w-full flex flex-col items-center">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 flex flex-col items-center"
        >
          <div className="w-14 h-14 bg-[#F2C118]/15 rounded-full flex items-center justify-center mb-3">
            <CheckCircle2 className="w-8 h-8 text-[#C97B2F]" strokeWidth={2.5} />
          </div>
          <h1 className="font-['Cormorant_Garamond',_Georgia,_serif] text-2xl font-bold text-[#0C0D0B]">Thanh toán thành công!</h1>
          <p className="text-sm text-[#4A4E46] mt-1">Vé điện tử của bạn đã sẵn sàng</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-4 items-start justify-center w-full">
          {/* ================= LEFT: E-TICKET ================= */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full lg:flex-1 bg-white border border-[#E0DDD7] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.05)] overflow-hidden"
          >
            {/* Ticket header */}
            <div className="border-b border-dashed border-[#E0DDD7] flex items-start justify-between px-5 pt-5 pb-[21px]">
              <div className="flex flex-col gap-1">
                <p className="text-[#C97B2F] text-xs font-semibold tracking-wide">Mã vé: {lookupCode}</p>
                <p className="text-[#4A4E46] text-xs font-semibold tracking-wide">Mã đặt chỗ: {booking?.bookingId?.toUpperCase() || '—'}</p>
              </div>
              <p className="text-[#0C0D0B] text-xl font-semibold">An Chuyến</p>
            </div>

            {/* Company info */}
            <div className="px-5 py-2 flex flex-col items-center text-center gap-0.5">
              <p className="font-bold text-xs text-[#0C0D0B]">CÔNG TY CỔ PHẦN AN CHUYẾN</p>
              <p className="text-xs font-semibold text-[#4A4E46]">123 Đường Điện Biên Phủ, P.15, Q.Bình Thạnh, TP. HCM</p>
              <p className="text-xs font-semibold text-[#4A4E46]">1900 1234 | contact@anchuyen.vn | www.anchuyen.vn</p>
              <p className="text-xs font-semibold text-[#4A4E46]">MST: 0312345678</p>
            </div>

            {/* Ticket title */}
            <div className="py-2 flex flex-col items-center text-center">
              <h2 className="text-xl font-semibold text-[#0C0D0B]">VÉ XE KHÁCH</h2>
              <p className="text-xs font-semibold text-[#4A4E46] mt-1">(Vé điện tử - E-ticket)</p>
              {bookingDate && <p className="text-xs font-semibold text-[#4A4E46]">Ngày đặt: {fmtDateTime(bookingDate)}</p>}
            </div>

            {/* Trip details */}
            <div className="px-5 py-2 flex flex-col gap-2">
              {(booking?.pickupLabel || booking?.dropoffLabel) && (
                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2 text-sm text-[#4A4E46] w-32 shrink-0">
                    <MapPin size={14} /> Hành trình:
                  </span>
                  <span className="text-sm font-medium text-[#0C0D0B] text-right">
                    {booking?.pickupLabel || '—'} → {booking?.dropoffLabel || '—'}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2 text-sm text-[#4A4E46] w-32 shrink-0">
                  <Bus size={14} /> Tuyến xe:
                </span>
                <span className="text-sm font-medium text-[#0C0D0B] text-right">{booking?.routeLabel || '—'}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2 text-sm text-[#4A4E46] w-32 shrink-0">
                  <Bus size={14} /> Nhà xe:
                </span>
                <span className="text-sm font-medium text-[#0C0D0B] text-right">{booking?.busAgentName || '—'}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2 text-sm text-[#4A4E46] w-32 shrink-0">
                  <Armchair size={14} /> Ghế:
                </span>
                <span className="text-sm font-bold text-[#0C0D0B] text-right">{booking?.seats?.join(', ') || '—'}</span>
              </div>
              {departure && (
                <>
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-2 text-sm text-[#4A4E46] w-32 shrink-0">
                      <Calendar size={14} /> Ngày đi:
                    </span>
                    <span className="text-sm font-medium text-[#0C0D0B] text-right">{fmtDate(departure)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-2 text-sm text-[#4A4E46] w-32 shrink-0">
                      <Clock size={14} /> Giờ đi:
                    </span>
                    <span className="text-sm font-medium text-[#0C0D0B] text-right">
                      {departure.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="px-5 py-2">
              <div className="border-t border-[#E0DDD7] w-full" />
            </div>

            {/* Total price */}
            <div className="px-5 py-2 flex flex-col items-center text-center">
              <h3 className="text-xl font-bold text-[#0C0D0B]">
                Tổng tiền: {booking ? new Intl.NumberFormat('vi-VN').format(booking.totalAmount) : '—'} đ
              </h3>
              <p className="text-xs font-semibold text-[#4A4E46] mt-1">(Đã bao gồm VAT)</p>
            </div>

            {/* Payment status */}
            <div className="px-5">
              <div className="bg-[#F2C118]/10 border border-[#F2C118] rounded-lg p-[13px] flex gap-3 items-start">
                <CheckCircle2 size={20} className="text-[#C97B2F] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-[#785900]">Đã thanh toán</p>
                  {paymentMethodLabel && <p className="text-xs font-semibold text-[#4A4E46]">Phương thức: {paymentMethodLabel}</p>}
                  <p className="text-xs font-semibold text-[#4A4E46]">Mã đặt vé: {lookupCode}</p>
                  {bookingDate && <p className="text-xs font-semibold text-[#4A4E46]">Thời gian: {fmtDateTime(bookingDate)}</p>}
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="px-5 py-6 flex flex-col items-center justify-center">
              <div className="bg-white border-4 border-[#0C0D0B] rounded-sm p-3 mb-4">
                <QRCodeSVG value={qrValue} size={136} fgColor="#0C0D0B" bgColor="#FFFFFF" level="M" />
              </div>
              <p className="text-xs font-semibold text-[#4A4E46]">Mã vé (Ticket ID)</p>
              <h4 className="text-xl font-bold tracking-[2px] text-[#785900]">{lookupCode}</h4>
              <p className="text-xs font-semibold text-[#4A4E46] text-center mt-2">Quét mã để lên xe và kiểm tra thông tin</p>
            </div>

            {/* Footer note */}
            <div className="bg-[#EFF4FF] border-t border-dashed border-[#E0DDD7] py-3 px-3 text-center">
              <p className="text-xs font-semibold text-[#4A4E46]">Vui lòng có mặt tại điểm đón trước giờ khởi hành ít nhất 30 phút.</p>
              <p className="text-xs font-semibold text-[#4A4E46]">Chúc bạn có chuyến đi an toàn và vui vẻ!</p>
            </div>

            {/* Action buttons */}
            <div className="bg-white p-5 flex gap-2 justify-center flex-wrap">
              <Link to="/my-bookings" className="flex-1 min-w-[130px] flex items-center justify-center gap-2 h-11 px-3 rounded-md border border-[#827660] bg-[#F8F9FF] text-xs font-semibold text-[#0C0D0B] hover:bg-[#F5F3EE] transition-colors text-center">
                <Eye size={14} /> Xem chi tiết hành trình
              </Link>
              <button className="flex-1 min-w-[110px] flex items-center justify-center gap-2 h-11 px-3 rounded-md border border-[#827660] bg-[#F8F9FF] text-xs font-semibold text-[#0C0D0B] hover:bg-[#F5F3EE] transition-colors">
                <Share2 size={14} /> Chia sẻ vé
              </button>
              <button className="flex-1 min-w-[110px] flex items-center justify-center gap-2 h-11 px-3 rounded-md bg-[#785900] hover:bg-[#5E4700] text-white text-xs font-bold transition-colors">
                <Download size={14} /> Tải vé PDF
              </button>
            </div>
          </motion.div>

          {/* ================= RIGHT: RULES & REGULATIONS ================= */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full lg:flex-1 bg-white border border-[#E0DDD7] rounded-xl shadow-[0_1px_1px_rgba(0,0,0,0.05)] p-[21px] flex flex-col gap-4"
          >
            <div className="border-b border-dashed border-[#E0DDD7] pb-[9px] flex flex-col items-center text-center">
              <h3 className="text-base font-bold uppercase tracking-[0.8px] text-[#0C0D0B]">Nội Quy &amp; Quy Định</h3>
              <p className="text-xs font-semibold text-[#4A4E46] mt-1">Để chuyến đi an toàn và thoải mái, vui lòng tuân thủ:</p>
            </div>

            <div className="flex gap-3 items-start">
              <ShieldCheck size={18} className="text-[#C97B2F] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-[#0C0D0B] mb-1">1. Quy định chung</h4>
                <ul className="text-sm text-[#4A4E46] space-y-1 list-disc pl-4">
                  <li>Có mặt trước giờ khởi hành ít nhất 30 phút.</li>
                  <li>Xuất trình vé điện tử hoặc CMND/CCCD khi lên xe.</li>
                  <li>Không mang theo hàng hóa cấm, chất dễ cháy nổ.</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <Luggage size={18} className="text-[#C97B2F] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-[#0C0D0B] mb-1">2. Hành lý</h4>
                <ul className="text-sm text-[#4A4E46] space-y-1 list-disc pl-4">
                  <li>Mỗi hành khách được mang 01 kiện hành lý (tối đa 20kg) miễn phí.</li>
                  <li>Hành lý quá cước sẽ tính phí theo quy định của nhà xe.</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <Armchair size={18} className="text-[#C97B2F] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-[#0C0D0B] mb-1">3. Ghế ngồi</h4>
                <ul className="text-sm text-[#4A4E46] space-y-1 list-disc pl-4">
                  <li>Không tự ý đổi ghế khi chưa được sự đồng ý của nhà xe.</li>
                  <li>Giữ vệ sinh chung, không gây ồn ào, mất trật tự trên xe.</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <RotateCcw size={18} className="text-[#C97B2F] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-[#0C0D0B] mb-1">4. Hoàn/Đổi vé</h4>
                <ul className="text-sm text-[#4A4E46] space-y-1 list-disc pl-4">
                  <li>Hỗ trợ đổi/hoàn vé theo chính sách của An Chuyến và nhà xe.</li>
                  <li>Vui lòng liên hệ tổng đài 1900 1234 để được hỗ trợ.</li>
                </ul>
              </div>
            </div>

            <div className="bg-[#FFDAD6] border border-[#FFB4AB] rounded-lg p-[13px] flex flex-col gap-2">
              <p className="flex items-center gap-1.5 text-sm font-bold text-[#93000A]">
                <AlertTriangle size={16} /> Nghiêm cấm các hành vi:
              </p>
              <ul className="text-xs font-semibold text-[#93000A] space-y-1 list-disc pl-4">
                <li>Hút thuốc, sử dụng chất kích thích trên xe.</li>
                <li>Làm hư hỏng tài sản của nhà xe.</li>
                <li>Đe dọa, xúc phạm tài xế và hành khách khác.</li>
              </ul>
            </div>

            <div className="bg-[#EFF4FF] border border-[#E0DDD7] rounded-lg p-[13px] flex flex-col gap-2">
              <p className="flex items-center gap-1.5 text-sm font-bold text-[#785900]">
                <Phone size={16} /> Mọi thắc mắc vui lòng liên hệ
              </p>
              <div className="text-xs font-semibold text-[#4A4E46] flex flex-col gap-1">
                <p className="flex items-center gap-1.5">
                  <Phone size={12} /> Hotline: <span className="font-bold text-[#785900]">1900 1234</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Mail size={12} /> Email: <span className="font-bold text-[#785900]">support@anchuyen.vn</span>
                </p>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-end text-center pt-6">
              <p className="text-xs font-bold text-[#0C0D0B]">Cảm ơn bạn đã lựa chọn An Chuyến!</p>
              <p className="text-xs font-semibold text-[#4A4E46]">Kính chúc bạn thượng lộ bình an! ♥</p>
            </div>
          </motion.div>
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex items-center gap-2 text-[#4A4E46] hover:text-[#C97B2F] transition-colors text-sm font-medium"
        >
          <Home size={16} />
          <Link to="/">Về trang chủ</Link>
        </motion.button>
      </div>
    </div>
  );
}
