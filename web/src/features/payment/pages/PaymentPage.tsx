import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Ticket, Tag, HelpCircle, Search, PenLine, Users, CreditCard, Info,
  Phone, ChevronRight, Star, Loader2, Check, Lock, RotateCcw, Headphones, Zap, Landmark, Store,
} from 'lucide-react';
import { toast } from 'sonner';
import api from '../../../lib/api';
import { cn } from '../../../shared/utils/cn';
import { BookingStepper } from '../../../shared/components/BookingStepper';
import type { BookingData } from '../../../types';

interface TripScheduleDetail {
  departureTime: string;
  arrivalTime: string;
  trip: { busClass: string; busAgent: { name: string; rating: number }; route: { departureCity: { name: string }; arrivalCity: { name: string } } };
}

const AMENITY_PRICES = { water: 10000, towel: 5000, pillow: 30000 };

const WALLETS = [
  { key: 'momo', label: 'MoMo', logo: '/payment/momo.jpg' },
  { key: 'zalopay', label: 'ZaloPay', logo: '/payment/zalopay.jpg' },
  { key: 'vnpay', label: 'VNPay', logo: '/payment/vnpay.jpg' },
  { key: 'shopeepay', label: 'ShopeePay', logo: '/payment/shopeepay.jpg' },
];

const OTHER_METHODS = [
  { key: 'card', label: 'Visa / Mastercard / JCB', icon: CreditCard, logos: ['/payment/visa.jpg', '/payment/mastercard.svg'] },
  { key: 'atm', label: 'Thẻ ATM nội địa / Internet Banking', icon: Landmark, logos: [] as string[] },
  { key: 'store', label: 'Thanh toán tại cửa hàng tiện lợi', icon: Store, logos: ['/payment/circlek.jpg', '/payment/ministop.png'] },
];

const COMMITMENTS = [
  { icon: RotateCcw, label: 'Hoàn tiền 150% nếu nhà xe hủy chuyến' },
  { icon: Headphones, label: 'Hỗ trợ 24/7 mọi lúc mọi nơi' },
  { icon: ShieldCheck, label: 'Thông tin bảo mật tuyệt đối' },
  { icon: Zap, label: 'Đặt vé nhanh chóng, tiện lợi' },
];


export function PaymentPage() {
  const navigate = useNavigate();
  const [pendingBooking, setPendingBooking] = useState<BookingData | null>(null);
  const [tripDetail, setTripDetail] = useState<TripScheduleDetail | null>(null);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [promoInput, setPromoInput] = useState('');
  const [promoChecking, setPromoChecking] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; title: string; discountPct: number; maxDiscount: number | null } | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('pending_booking');
    if (raw) {
      try { setPendingBooking(JSON.parse(raw)); } catch { setPendingBooking(null); }
    }
  }, []);

  useEffect(() => {
    if (!pendingBooking?.tripScheduleId) return;
    api.get(`/trip-schedules/${pendingBooking.tripScheduleId}`).then(r => setTripDetail(r.data.data)).catch(() => {});
  }, [pendingBooking?.tripScheduleId]);

  const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(n);

  const [depCity, arrCity] = (pendingBooking?.routeLabel || 'TP. Hồ Chí Minh → Nha Trang').split(' → ');
  const depTime = tripDetail ? new Date(tripDetail.departureTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '07:00';
  const arrTime = tripDetail ? new Date(tripDetail.arrivalTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '15:30';
  const tripDate = tripDetail ? new Date(tripDetail.departureTime).toLocaleDateString('vi-VN') : new Date().toLocaleDateString('vi-VN');
  const busClass = tripDetail?.trip.busClass || 'Limousine 22 chỗ';
  const agentRating = tripDetail?.trip.busAgent.rating || 4.8;

  const seats = pendingBooking?.seats || [];
  const passengerList = pendingBooking?.passengers?.length ? pendingBooking.passengers : (pendingBooking ? [pendingBooking.passengerInfo] : []);

  const amenities = pendingBooking?.amenities;
  const amenityLines = [
    amenities && amenities.nuocSuoi > 0 ? { label: `Nước suối (x${amenities.nuocSuoi})`, amount: amenities.nuocSuoi * AMENITY_PRICES.water } : null,
    amenities && amenities.khanLanh > 0 ? { label: `Khăn lạnh (x${amenities.khanLanh})`, amount: amenities.khanLanh * AMENITY_PRICES.towel } : null,
    amenities && amenities.goiTuaCo > 0 ? { label: `Gối tựa cổ (x${amenities.goiTuaCo})`, amount: amenities.goiTuaCo * AMENITY_PRICES.pillow } : null,
    amenities?.oCamUSB ? { label: 'Ổ cắm USB', amount: 0, free: true } : null,
  ].filter((l): l is { label: string; amount: number; free?: boolean } => l !== null);

  const seatsTotal = pendingBooking?.seatsTotal || 0;
  const amenitiesTotal = pendingBooking?.amenitiesTotal || 0;
  const subtotal = seatsTotal + amenitiesTotal;

  // Preview only — the actual charge is recomputed and re-validated server-side in
  // booking.service.ts, so this local math is never trusted for the real payment.
  const discountAmount = appliedPromo
    ? Math.round(Math.min(subtotal * (appliedPromo.discountPct / 100), appliedPromo.maxDiscount ?? Infinity))
    : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyPromo = async () => {
    const code = promoInput.trim();
    if (!code) return;
    setPromoChecking(true);
    setPromoError('');
    try {
      const res = await api.get(`/promotions/validate/${encodeURIComponent(code)}`);
      setAppliedPromo(res.data);
      toast.success(`Đã áp dụng mã ${res.data.code}`);
    } catch (error: any) {
      setAppliedPromo(null);
      setPromoError(error?.response?.data?.message || 'Mã giảm giá không hợp lệ.');
    } finally {
      setPromoChecking(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput('');
    setPromoError('');
  };

  const handlePayment = async () => {
    if (!pendingBooking) { toast.error('Không tìm thấy thông tin đặt vé. Vui lòng chọn ghế lại.'); return; }
    if (!selectedMethod) { toast.error('Vui lòng chọn một phương thức thanh toán.'); return; }
    if (!termsAccepted) { toast.error('Vui lòng đồng ý với điều khoản & chính sách bảo mật.'); return; }
    setIsProcessing(true);
    try {
      const res = await api.post('/bookings/create', {
        tripScheduleId: pendingBooking.tripScheduleId,
        seatNumbers: pendingBooking.seats,
        passengers: passengerList.map(p => ({ name: p.name })),
        paymentMethod: selectedMethod,
        pickupPointId: pendingBooking.pickupPoint,
        dropoffPointId: pendingBooking.dropoffPoint,
        notes: pendingBooking.notes || '',
        promoCode: appliedPromo?.code,
      });

      const booking = res.data?.data;
      sessionStorage.setItem('last_booking', JSON.stringify({
        bookingId: booking?.id,
        passengerName: pendingBooking.passengerInfo.name,
        routeLabel: pendingBooking.routeLabel,
        busAgentName: pendingBooking.busAgentName,
        seats: pendingBooking.seats,
        totalAmount: booking?.totalAmount ?? finalTotal,
        createdAt: booking?.createdAt || new Date().toISOString(),
        paymentMethod: selectedMethod,
        pickupLabel: pendingBooking.pickupLabel,
        dropoffLabel: pendingBooking.dropoffLabel,
        departureTime: tripDetail?.departureTime,
      }));

      sessionStorage.removeItem('pending_booking');
      navigate('/booking-confirmation');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Thanh toán thất bại, vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!pendingBooking) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F8F9FA] text-[#6B7280] text-sm font-medium">
        Không tìm thấy thông tin đặt vé. <Link to="/search" className="text-[#2563EB] ml-1 hover:underline">Quay lại tìm chuyến</Link>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#F8F9FA] text-[#1F2937] font-['Be_Vietnam_Pro',_sans-serif] flex overflow-hidden">
      {/* ── SLIM ICON SIDEBAR ── */}
      <div className="w-[80px] bg-white border-r border-[#E5E7EB] flex flex-col items-center py-6 gap-8 shrink-0">
        <Link to="/search" className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 bg-[rgba(255,193,7,0.1)] rounded-xl flex items-center justify-center text-[#FFC107]">
            <Search size={18} strokeWidth={2.5} />
          </div>
          <span className="text-[10px] font-medium text-[#FFC107]">Tìm vé</span>
        </Link>
        {[{ icon: Ticket, label: 'Vé của tôi', to: '/my-bookings' }, { icon: Tag, label: 'Ưu đãi', to: '/offers' }].map((item, i) => (
          <Link key={i} to={item.to} className="flex flex-col items-center gap-1 text-[#9CA3AF] hover:text-[#1F2937] transition-colors">
            <div className="w-10 h-10 flex items-center justify-center"><item.icon size={18} /></div>
            <span className="text-[10px] font-medium text-center">{item.label}</span>
          </Link>
        ))}
        <div className="flex-1" />
        <Link to="/contact" className="flex flex-col items-center gap-1 text-[#9CA3AF] hover:text-[#1F2937] transition-colors">
          <div className="w-10 h-10 flex items-center justify-center"><HelpCircle size={18} /></div>
          <span className="text-[10px] font-medium">Trợ giúp</span>
        </Link>
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* ── TOPBAR ── */}
        <BookingStepper activeStep={4} />

        {/* ── SCROLLABLE CONTENT ── */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-[1280px] mx-auto flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#1F2937]">Thanh toán</h1>
              <span className="bg-[#DCFCE7] border border-[#BBF7D0] text-[#15803D] text-xs font-medium px-[13px] py-[5px] rounded-full flex items-center gap-1.5">
                <ShieldCheck size={11} /> Bảo mật 100%
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* ── LEFT COLUMN: Journey & Passenger Info ── */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="bg-white border border-[#F3F4F6] shadow-[0_1px_1px_rgba(0,0,0,0.05)] rounded-xl p-[21px] flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-[#1F2937]">Thanh toán</h2>
                    <button onClick={() => navigate(`/seat-selection/${pendingBooking.tripScheduleId || ''}`)} className="flex items-center gap-1 text-sm text-[#2563EB] hover:underline">
                      <PenLine size={12} /> Sửa
                    </button>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#16A34A] mt-1.5 shrink-0" />
                      <div>
                        <div className="text-sm font-bold text-[#1F2937]">{depCity}</div>
                        <div className="text-xs text-[#6B7280] mt-0.5">{pendingBooking.pickupLabel || `Bến xe ${depCity}`}</div>
                        <div className="text-xs text-[#6B7280]">{depTime} - {tripDate}</div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#EF4444] mt-1.5 shrink-0" />
                      <div>
                        <div className="text-sm font-bold text-[#1F2937]">{arrCity}</div>
                        <div className="text-xs text-[#6B7280] mt-0.5">{pendingBooking.dropoffLabel || `Bến xe ${arrCity}`}</div>
                        <div className="text-xs text-[#6B7280]">~ {arrTime} - {tripDate}</div>
                      </div>
                    </div>
                    <div className="border-t border-[#F3F4F6] pt-4 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-bold text-[#1F2937]">
                          Nhà xe {pendingBooking.busAgentName} <span className="text-[#FFC107] inline-flex items-center gap-0.5"><Star size={11} className="fill-[#FFC107] text-[#FFC107]" /> {agentRating}</span>
                        </div>
                        <div className="text-xs text-[#6B7280] mt-0.5">{busClass}</div>
                      </div>
                      <img src="/phuong-trang-bus.jpg" alt={pendingBooking.busAgentName} className="w-20 h-12 rounded object-cover shrink-0 border border-[#F3F4F6]" />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-[#F3F4F6] shadow-[0_1px_1px_rgba(0,0,0,0.05)] rounded-xl p-[21px] flex flex-col gap-4">
                  <h2 className="flex items-center gap-2 text-lg font-bold text-[#1F2937]"><Users size={16} className="text-[#6B7280]" /> Thông tin hành khách</h2>
                  <div className="flex flex-col gap-4">
                    {passengerList.map((p, i) => (
                      <div key={i} className="relative bg-[#F9FAFB] border border-[#F3F4F6] rounded-lg pt-[29px] pb-[17px] px-[17px]">
                        <span className="absolute top-0 left-0 bg-[#E5E7EB] text-[#4B5563] text-xs font-bold px-2 py-1 rounded-tl-lg rounded-br-lg">Hành khách {i + 1}</span>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs text-[#6B7280]">Họ và tên</div>
                            <div className="text-sm font-medium text-[#1F2937]">{p.name || '—'}</div>
                          </div>
                          <div>
                            <div className="text-xs text-[#6B7280]">Số điện thoại</div>
                            <div className="text-sm font-medium text-[#1F2937]">{p.phone || '—'}</div>
                          </div>
                          <div className="col-span-2">
                            <div className="text-xs text-[#6B7280]">CCCD/CMND</div>
                            <div className="text-sm font-medium text-[#1F2937]">{('idNumber' in p && p.idNumber) || '—'}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-lg p-[13px] flex gap-2 items-start">
                    <Info size={16} className="text-[#2563EB] mt-0.5 shrink-0" />
                    <div className="text-sm text-[#4B5563] leading-relaxed">
                      Email nhận vé: <span className="font-bold text-[#1F2937]">{pendingBooking.passengerInfo.email || '—'}</span> (Vé điện tử sẽ được gửi về email này)
                    </div>
                  </div>
                </div>
              </div>

              {/* ── MIDDLE COLUMN: Payment Methods ── */}
              <div className="lg:col-span-4 bg-white border border-[#F3F4F6] shadow-[0_1px_1px_rgba(0,0,0,0.05)] rounded-xl p-[21px] flex flex-col gap-4">
                <h2 className="flex items-center gap-2 text-lg font-bold text-[#1F2937]"><CreditCard size={16} className="text-[#6B7280]" /> Phương thức thanh toán</h2>

                <div className="grid grid-cols-2 gap-3">
                  {WALLETS.map(w => (
                    <button
                      key={w.key}
                      onClick={() => setSelectedMethod(w.key)}
                      className={cn('relative flex items-center gap-4 p-[17px] rounded-lg border text-left transition-colors bg-white', selectedMethod === w.key ? 'border-2 border-[#FFC107] p-[16px]' : 'border-[#E5E7EB] hover:border-[#D1D5DB]')}
                    >
                      <img src={w.logo} alt={w.label} className="w-8 h-8 rounded object-cover shrink-0" />
                      <span className="text-sm font-bold text-[#1F2937]">{w.label}</span>
                      {selectedMethod === w.key && (
                        <span className="absolute top-1 right-1 w-4 h-4 bg-[#FFC107] rounded-full flex items-center justify-center">
                          <Check size={10} className="text-white" strokeWidth={3} />
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-3 w-full">
                  {OTHER_METHODS.map(m => (
                    <button
                      key={m.key}
                      onClick={() => setSelectedMethod(m.key)}
                      className={cn('flex items-center justify-between p-[17px] rounded-lg border transition-colors bg-white', selectedMethod === m.key ? 'border-2 border-[#FFC107] p-[16px]' : 'border-[#E5E7EB] hover:border-[#D1D5DB]')}
                    >
                      <div className="flex items-center gap-3">
                        <m.icon size={17} className="text-[#6B7280] shrink-0" />
                        <span className="text-sm font-semibold text-[#1F2937] text-left">{m.label}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {m.logos.map(l => <img key={l} src={l} alt="" className="h-4 rounded-sm object-contain" />)}
                        <ChevronRight size={14} className="text-[#9CA3AF]" />
                      </div>
                    </button>
                  ))}
                </div>

                <label className="flex items-start gap-2 pt-2 cursor-pointer select-none">
                  <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} className="w-4 h-4 mt-0.5 rounded border-[#D1D5DB] accent-[#FFC107] shrink-0" />
                  <span className="text-sm text-[#4B5563] leading-relaxed">
                    Tôi đã đọc và đồng ý với <a className="text-[#2563EB] hover:underline cursor-pointer">Điều khoản &amp; Quy định</a> và <a className="text-[#2563EB] hover:underline cursor-pointer">Chính sách bảo mật</a> của An Chuyến.
                  </span>
                </label>
              </div>

              {/* ── RIGHT COLUMN: Order Summary ── */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="bg-white border border-[#F3F4F6] shadow-[0_1px_1px_rgba(0,0,0,0.05)] rounded-xl p-5 flex flex-col gap-4">
                  <h2 className="flex items-center gap-2 text-lg font-bold text-[#1F2937] border-b border-[#F3F4F6] pb-[13px]"><Ticket size={15} className="text-[#6B7280]" /> Chi tiết giá</h2>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between text-sm">
                      <span className="text-[#4B5563]">Vé người lớn (x{seats.length || 1})</span>
                      <span className="font-medium text-[#1F2937]">{fmt(seatsTotal)}đ</span>
                    </div>
                    {amenityLines.map(a => (
                      <div key={a.label} className="flex items-start justify-between text-sm">
                        <span className="text-[#4B5563]">{a.label}</span>
                        <span className={a.free ? 'font-medium text-[#16A34A]' : 'font-medium text-[#1F2937]'}>{a.free ? 'Miễn phí' : `${fmt(a.amount)}đ`}</span>
                      </div>
                    ))}
                    <div className="border-t border-dashed border-[#E5E7EB] pt-3 flex items-start justify-between text-sm">
                      <span className="text-[#4B5563]">Phí dịch vụ</span>
                      <span className="font-medium text-[#1F2937]">0đ</span>
                    </div>
                    {appliedPromo && (
                      <div className="flex items-start justify-between text-sm">
                        <span className="text-[#16A34A]">Giảm giá ({appliedPromo.code})</span>
                        <span className="font-medium text-[#16A34A]">-{fmt(discountAmount)}đ</span>
                      </div>
                    )}
                  </div>

                  {/* Promo code */}
                  <div className="border-t border-dashed border-[#E5E7EB] pt-4">
                    {appliedPromo ? (
                      <div className="flex items-center justify-between gap-2 bg-[#F0FDF4] border border-[#DCFCE7] rounded-lg px-3 py-2.5">
                        <div>
                          <div className="text-sm font-bold text-[#15803D]">{appliedPromo.code}</div>
                          <div className="text-xs text-[#16A34A]">{appliedPromo.title}</div>
                        </div>
                        <button onClick={handleRemovePromo} className="text-xs font-medium text-[#6B7280] hover:text-[#1F2937] transition-colors shrink-0">Bỏ mã</button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={promoInput}
                            onChange={e => { setPromoInput(e.target.value.toUpperCase()); setPromoError(''); }}
                            onKeyDown={e => { if (e.key === 'Enter') handleApplyPromo(); }}
                            placeholder="Nhập mã giảm giá"
                            className="flex-1 min-w-0 border border-[#D1D5DB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20"
                          />
                          <button
                            onClick={handleApplyPromo}
                            disabled={!promoInput.trim() || promoChecking}
                            className="shrink-0 px-4 py-2 rounded-lg text-sm font-bold bg-[#1F2937] text-white hover:bg-[#111827] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {promoChecking ? 'Đang kiểm tra...' : 'Áp dụng'}
                          </button>
                        </div>
                        {promoError && <span className="text-xs text-[#EF4444]">{promoError}</span>}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-[#E5E7EB] pt-4 flex items-end justify-between">
                    <span className="text-base font-medium text-[#4B5563]">Tổng tiền:</span>
                    <span className="text-2xl font-bold text-[#EF4444]">{fmt(finalTotal)}đ</span>
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={isProcessing || !selectedMethod || !termsAccepted}
                    className="w-full bg-[#FFC107] rounded-lg py-4 flex items-center justify-center gap-3 text-[#212529] text-lg font-bold shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] hover:brightness-95 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    {isProcessing ? (
                      <><Loader2 size={18} className="animate-spin" /> Đang xử lý...</>
                    ) : (
                      <><Lock size={16} /> Thanh toán {fmt(finalTotal)}đ</>
                    )}
                  </button>

                  <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl p-[17px] flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold text-[#15803D]">Thanh toán an toàn &amp; bảo mật</div>
                      <div className="text-[10px] text-[#16A34A] mt-1 leading-tight">Thông tin thanh toán của bạn được mã hoá và bảo vệ tuyệt đối.</div>
                    </div>
                    <div className="bg-[#DCFCE7] w-9 h-10 rounded-lg flex items-center justify-center shrink-0">
                      <ShieldCheck size={18} className="text-[#16A34A]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-1">
                    {COMMITMENTS.map(c => (
                      <div key={c.label} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#F3F4F6] flex items-center justify-center shrink-0">
                          <c.icon size={13} className="text-[#4B5563]" />
                        </div>
                        <span className="text-xs text-[#4B5563] leading-tight">{c.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-[#F3F4F6] shadow-[0_1px_1px_rgba(0,0,0,0.05)] rounded-xl p-[17px] flex items-center gap-3">
                  <Phone size={18} className="text-[#4B5563]" />
                  <span className="text-sm font-bold text-[#1F2937]">1900 1234</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
