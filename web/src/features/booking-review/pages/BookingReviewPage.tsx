import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, MapPin, Shield, FileText, CheckCircle2, Clock, Tag, CreditCard, Smartphone } from 'lucide-react';
import { Button } from '../../../design-system/components/Button';
import { Card } from '../../../design-system/components/Card';
import api from '../../../lib/api';
import type { BookingData } from '../../../types';
import { toast } from 'sonner';

export function BookingReviewPage() {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  // New States
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isInsuranceEnabled, setIsInsuranceEnabled] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('qr');
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    // Cuộn lên đầu trang khi vào
    window.scrollTo(0, 0);
    
    // Lấy dữ liệu từ sessionStorage
    const savedData = sessionStorage.getItem('pending_booking');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setBookingData(parsed);
        setIsInsuranceEnabled(parsed.addInsurance);
      } catch (e) {
        console.error("Lỗi khi đọc dữ liệu booking", e);
        navigate('/'); // Nếu lỗi, về trang chủ
      }
    } else {
      // Nếu không có dữ liệu, quay lại trang trước
      navigate(-1);
    }
  }, [navigate]);

  // Timer Effect
  useEffect(() => {
    if (!bookingData) return;
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, bookingData]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!bookingData) return null;

  const {
    seats,
    seatsTotal,
    pickupLabel,
    dropoffLabel,
    routeLabel,
    busAgentName,
    addInsurance,
    needVAT,
    passengerInfo,
    bookerInfo
  } = bookingData;

  const handleProceedToPayment = () => {
    if (!termsAccepted) return;
    // Cập nhật lại bookingData với các tùy chọn mới nhất nếu cần thiết
    const updatedBooking = { ...bookingData, addInsurance: isInsuranceEnabled, totalAmount: finalTotalAmount };
    sessionStorage.setItem('pending_booking', JSON.stringify(updatedBooking));
    
    // Chuyển tới trang thanh toán thực sự
    navigate('/payment');
  };

  const handleApplyPromo = async () => {
    try {
      const res = await api.post('/vouchers/validate', { code: promoCode.toUpperCase() });
      if (res.data && res.data.discount) {
        setDiscount(res.data.discount);
        toast.success(`Áp dụng mã giảm giá thành công! Giảm ${new Intl.NumberFormat('vi-VN').format(res.data.discount)}đ`);
      } else {
        setDiscount(0);
        toast.error('Mã giảm giá không hợp lệ hoặc đã hết hạn!');
      }
    } catch (error) {
      setDiscount(0);
      toast.error('Mã giảm giá không hợp lệ hoặc đã hết hạn!');
    }
  };

  const basePrice = seatsTotal;
  const insurancePrice = isInsuranceEnabled ? seats.length * 20000 : 0;
  const finalTotalAmount = basePrice + insurancePrice - discount;

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-4rem)] pt-20 pb-32 font-sans text-slate-800 transition-colors duration-300">
      
      {/* Header Info */}
      <div className="bg-white/80 backdrop-blur-md py-4 sticky top-0 md:top-20 z-30 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border-b border-slate-100/80 transition-all duration-300">
        <div className="container max-w-5xl mx-auto px-4 flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 bg-white rounded-full hover:bg-slate-50 transition-all border border-slate-100 text-slate-700 shadow-sm hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
            Xác nhận thông tin đặt vé
          </h1>
        </div>
      </div>

      <div className="container max-w-5xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Trip Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card className="relative overflow-visible bg-white border border-slate-100 rounded-[32px] p-6 shadow-[0_4px_25px_rgba(0,0,0,0.015)]">
                {/* Left and Right Ticket Notches */}
                <div className="absolute -left-3 top-[108px] w-6 h-6 rounded-full bg-gray-50 border border-slate-100/80 z-10 hidden sm:block"></div>
                <div className="absolute -right-3 top-[108px] w-6 h-6 rounded-full bg-gray-50 border border-slate-100/80 z-10 hidden sm:block"></div>
                
                {/* Brand Gradient Header block */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 mb-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white backdrop-blur-md">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">{routeLabel || 'Đang tải...'}</h2>
                      <div className="text-slate-300 font-semibold text-xs mt-1 uppercase tracking-wider">{busAgentName}</div>
                    </div>
                  </div>
                </div>
                
                {/* Points details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50/50 p-4 border border-slate-100 rounded-2xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Điểm đón</span>
                    <span className="font-extrabold text-slate-800 text-base leading-tight block">{pickupLabel || 'Chưa chọn điểm đón'}</span>
                  </div>
                  <div className="bg-slate-50/50 p-4 border border-slate-100 rounded-2xl md:text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Điểm trả</span>
                    <span className="font-extrabold text-slate-800 text-base leading-tight block">{dropoffLabel || 'Chưa chọn điểm trả'}</span>
                  </div>
                </div>
                
                {/* Ticket footer details */}
                <div className="flex flex-wrap gap-4 justify-between items-center mt-6 pt-5 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-450 uppercase tracking-wider">Ghế đã chọn:</span>
                    <span className="font-black text-lg bg-orange-50 text-[#ff4525] border border-orange-100 px-3.5 py-1 rounded-xl tracking-tight">{seats.join(', ')}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 font-bold text-xs rounded-full border border-slate-100">
                      <Shield className="w-3.5 h-3.5 text-slate-400" /> Hủy miễn phí
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 font-bold text-xs rounded-full border border-slate-100">
                      Hành lý 20kg
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
              <Card className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-8 shadow-[0_4px_25px_rgba(0,0,0,0.015)]">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-450 to-teal-500 rounded-2xl flex items-center justify-center text-white shadow-md shadow-emerald-500/10">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight">Thông tin liên hệ</h2>
                    <p className="text-slate-400 text-xs font-semibold mt-0.5">Chi tiết người đi & người đặt</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 bg-slate-50/50 p-6 border border-slate-100 rounded-2xl">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Hành khách</span>
                      <p className="font-extrabold text-slate-800 text-base">{passengerInfo.name || 'Không xác định'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Số điện thoại</span>
                      <p className="font-extrabold text-slate-800 text-base">{passengerInfo.phone || 'Không xác định'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email nhận vé</span>
                      <p className="font-extrabold text-slate-800 text-base break-all">{passengerInfo.email || 'Không xác định'}</p>
                    </div>
                  </div>
                  
                  {bookerInfo && (
                    <div className="pt-2">
                      <div className="bg-slate-50/80 p-5 border border-slate-100 rounded-2xl">
                        <p className="text-[10px] text-slate-450 font-bold mb-4 uppercase tracking-wider flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Người đặt hộ
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <span className="text-xs text-slate-400 font-semibold block mb-0.5">Tên người đặt</span>
                            <p className="font-bold text-slate-800 text-base">{bookerInfo.name}</p>
                          </div>
                          <div>
                            <span className="text-xs text-slate-400 font-semibold block mb-0.5">Số điện thoại</span>
                            <p className="font-bold text-slate-800 text-base">{bookerInfo.phone}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <label className="text-xs text-slate-450 font-bold mb-2.5 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-slate-400" /> Ghi chú cho nhà xe (Tùy chọn)
                    </label>
                    <textarea 
                      placeholder="VD: Có trẻ em đi cùng, xin xếp ghế cạnh nhau; Đón ở cổng số 2..."
                      className="w-full bg-white border border-slate-200 p-4 text-sm text-slate-800 focus:border-slate-900 rounded-2xl outline-none resize-none h-24 transition-all"
                    ></textarea>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Extras */}
            {(isInsuranceEnabled || needVAT) && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
                <Card className="bg-gradient-to-br from-emerald-50/20 to-teal-50/20 rounded-[24px] p-5 border border-emerald-100/50 shadow-sm flex flex-col gap-4">
                  {isInsuranceEnabled && (
                    <div className="flex items-center gap-4 bg-white p-4 border border-emerald-100 rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.01)]">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-450 to-teal-500 rounded-xl flex items-center justify-center text-white">
                        <Shield className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-emerald-800 text-base">Đã bao gồm Bảo hiểm chuyến đi</span>
                    </div>
                  )}
                  {needVAT && (
                    <div className="flex items-center gap-4 bg-white p-4 border border-slate-100 rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.01)]">
                      <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-white">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-slate-800 text-base">Đã đăng ký xuất Hóa đơn VAT</span>
                    </div>
                  )}
                </Card>
              </motion.div>
            )}

          </div>
          
          {/* Summary Column */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <div className="sticky top-28 space-y-6">
              
              {/* Countdown Timer */}
              <div className="bg-orange-50 border border-orange-200/50 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-orange-950 leading-tight">Thời gian giữ ghế</p>
                    <p className="text-[11px] text-orange-700 font-semibold mt-0.5">Vui lòng thanh toán sớm</p>
                  </div>
                </div>
                <div className="text-2xl font-black text-orange-650 tabular-nums tracking-tight">
                  {formatTime(timeLeft)}
                </div>
              </div>

              {/* Promo Code */}
              <Card className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                <p className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-2 uppercase tracking-wider">
                  <Tag className="w-4 h-4 text-orange-500" /> Mã giảm giá / Ưu đãi
                </p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="MÃ GIẢM GIÁ" 
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs uppercase font-bold focus:border-slate-900 outline-none transition-all"
                  />
                  <Button onClick={handleApplyPromo} className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-5 font-bold shadow-none h-11 text-xs border-none">
                    Áp dụng
                  </Button>
                </div>
              </Card>

              {/* Payment Methods */}
              <Card className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                <p className="text-xs font-bold text-slate-800 mb-4 uppercase tracking-wider">Phương thức thanh toán</p>
                <div className="space-y-3">
                  <label className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'qr' ? 'border-[#ff4525] bg-orange-50/10 shadow-sm' : 'border-slate-50 hover:border-slate-150'}`}>
                    <input type="radio" name="payment" value="qr" checked={paymentMethod === 'qr'} onChange={() => setPaymentMethod('qr')} className="hidden" />
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${paymentMethod === 'qr' ? 'bg-[#ff4525] text-white shadow-sm' : 'bg-slate-50 text-slate-500'}`}>
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-800 text-sm flex-1">Chuyển khoản QR (VietQR)</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === 'qr' ? 'border-[#ff4525]' : 'border-slate-300'}`}>
                      {paymentMethod === 'qr' && <div className="w-2.5 h-2.5 rounded-full bg-[#ff4525]"></div>}
                    </div>
                  </label>
                  
                  <label className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-[#ff4525] bg-orange-50/10 shadow-sm' : 'border-slate-50 hover:border-slate-150'}`}>
                    <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="hidden" />
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${paymentMethod === 'card' ? 'bg-[#ff4525] text-white shadow-sm' : 'bg-slate-50 text-slate-500'}`}>
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-800 text-sm flex-1">Thẻ ATM / Visa / Mastercard</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === 'card' ? 'border-[#ff4525]' : 'border-slate-300'}`}>
                      {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-[#ff4525]"></div>}
                    </div>
                  </label>
                </div>
              </Card>

              {/* Total Summary */}
              <Card className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.06)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/30 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                
                <h3 className="text-xl font-extrabold mb-6 flex items-center gap-3 relative text-slate-800 tracking-tight">
                  <div className="w-10 h-10 bg-[#ff4525]/10 rounded-xl flex items-center justify-center text-[#ff4525]">
                    <FileText className="w-5 h-5" />
                  </div>
                  Tóm tắt chi phí
                </h3>
                
                <div className="space-y-4 mb-6 relative">
                  <div className="flex justify-between items-center font-semibold text-sm p-3 bg-slate-50/50 border border-slate-100/50 rounded-xl">
                    <span className="text-slate-500">Giá vé ({seats.length} ghế)</span>
                    <span className="text-slate-800 font-bold">{new Intl.NumberFormat('vi-VN').format(basePrice)}đ</span>
                  </div>
                  
                  {/* Toggleable Insurance */}
                  <div className={`flex justify-between items-center font-semibold text-sm p-3 cursor-pointer rounded-xl border transition-colors ${isInsuranceEnabled ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800' : 'bg-slate-50/50 border-slate-100/50 hover:bg-slate-100/50 text-slate-800'}`} onClick={() => setIsInsuranceEnabled(!isInsuranceEnabled)}>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 flex items-center justify-center border rounded transition-colors ${isInsuranceEnabled ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 text-transparent'}`}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <span className={isInsuranceEnabled ? 'text-emerald-700 font-bold' : 'text-slate-500 font-semibold'}>Bảo hiểm chuyến đi</span>
                    </div>
                    <span className={isInsuranceEnabled ? 'text-emerald-700 font-bold' : 'text-slate-400 line-through'}>
                      {new Intl.NumberFormat('vi-VN').format(seats.length * 20000)}đ
                    </span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between items-center font-semibold text-sm p-3 bg-orange-50 border border-orange-100 text-orange-850 rounded-xl">
                      <span className="font-bold flex items-center gap-1.5">
                        <Tag className="w-4 h-4" /> Giảm giá
                      </span>
                      <span className="font-bold">
                        -{new Intl.NumberFormat('vi-VN').format(discount)}đ
                      </span>
                    </div>
                  )}
                  
                  {needVAT && (
                    <div className="flex justify-between items-center font-semibold text-xs px-3">
                      <span className="text-slate-400">Thuế VAT (8%)</span>
                      <span className="text-slate-655 font-bold">Đã bao gồm trong giá vé</span>
                    </div>
                  )}
                </div>
                
                <div className="bg-gradient-to-r from-orange-50/80 to-red-50/80 p-5 mb-5 rounded-2xl border border-orange-100/50 relative overflow-hidden">
                  <div className="flex justify-between items-end relative">
                    <span className="text-orange-950 font-extrabold text-xs uppercase tracking-wider mb-1">Tổng thanh toán</span>
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ff4525] to-[#ff7d1a] tracking-tight">{new Intl.NumberFormat('vi-VN').format(finalTotalAmount)}đ</span>
                  </div>
                </div>

                {/* Terms Acceptance */}
                <div className="mb-6 flex items-start gap-3">
                  <button 
                    onClick={() => setTermsAccepted(!termsAccepted)}
                    className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center border transition-all ${termsAccepted ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-300 text-transparent hover:border-slate-500'}`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                  </button>
                  <p className="text-[11px] text-slate-450 leading-relaxed cursor-pointer font-medium" onClick={() => setTermsAccepted(!termsAccepted)}>
                    Tôi đã đọc và đồng ý với <a href="#" className="text-slate-700 underline font-bold" onClick={(e) => e.stopPropagation()}>Điều khoản dịch vụ</a> và <a href="#" className="text-slate-700 underline font-bold" onClick={(e) => e.stopPropagation()}>Chính sách bảo mật</a> của An Chuyến.
                  </p>
                </div>
                
                <Button 
                  onClick={handleProceedToPayment}
                  disabled={!termsAccepted}
                  className={`w-full h-14 font-extrabold text-base text-white border-none rounded-2xl transition-all duration-350 ${termsAccepted ? 'bg-gradient-to-r from-[#ff4525] to-[#ff7d1a] hover:from-[#e03d20] hover:to-[#e06e17] shadow-md shadow-orange-500/10 hover:shadow-lg hover:shadow-orange-500/20 active:scale-[0.99]' : 'bg-slate-200 cursor-not-allowed opacity-50'}`}
                >
                  <span className="flex items-center justify-center gap-2">
                    Tiến hành thanh toán
                    {termsAccepted && (
                      <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    )}
                  </span>
                </Button>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
