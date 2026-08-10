import { useEffect, useState } from'react';
import { useNavigate } from'react-router-dom';
import { motion } from'framer-motion';
import { ArrowLeft, User, MapPin, Shield, FileText, CheckCircle2, Clock, Tag, CreditCard, Smartphone, Square, CheckSquare } from'lucide-react';
import { Button } from'../../../design-system/components/Button';
import { Card } from'../../../design-system/components/Card';

export function BookingReviewPage() {
 const navigate = useNavigate();
 const [bookingData, setBookingData] = useState<any>(null);

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
 
 // Lấy dữ liệu từ localStorage
 const savedData = localStorage.getItem('pending_booking');
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
 navigate('/seat-selection');
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
 return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
 };

 if (!bookingData) return null;

 const {
 seats,
 totalAmount,
 pickupPoint,
 dropoffPoint,
 addInsurance,
 needVAT,
 passengerInfo,
 bookerInfo
 } = bookingData;

 const handleProceedToPayment = () => {
 if (!termsAccepted) return;
 // Cập nhật lại bookingData với các tùy chọn mới nhất nếu cần thiết
 const updatedBooking = { ...bookingData, addInsurance: isInsuranceEnabled, finalTotalAmount };
 localStorage.setItem('pending_booking', JSON.stringify(updatedBooking));
 
 // Chuyển tới trang thanh toán thực sự
 navigate('/payment');
 };

 const handleApplyPromo = () => {
 if (promoCode.toUpperCase() ==='ANCHUYEN10') {
 setDiscount(50000);
 } else {
 setDiscount(0);
 alert('Mã giảm giá không hợp lệ hoặc đã hết hạn!');
 }
 };

 const basePrice = seats.length * 350000;
 const insurancePrice = isInsuranceEnabled ? seats.length * 20000 : 0;
 const finalTotalAmount = basePrice + insurancePrice - discount;

 const pickupLabel = pickupPoint ==='bx-md' ?'Bến xe Miền Đông' : pickupPoint ==='vp-q1' ?'VP Quận 1 - Phạm Ngũ Lão' :'Ngã 4 Hàng Xanh';
 const dropoffLabel = dropoffPoint ==='bx-dl' ?'Bến xe liên tỉnh Đà Lạt' : dropoffPoint ==='vp-dl' ?'VP Đà Lạt' :'Ngã 3 Tình Yêu';

 const getAddress = (point: string) => {
 switch(point) {
 case'bx-md': return'292 Đinh Bộ Lĩnh, P.26, Q.Bình Thạnh, TP.HCM';
 case'vp-q1': return'Phạm Ngũ Lão, Quận 1, TP.HCM';
 case'bx-dl': return'01 Tô Hiến Thành, P.3, TP. Đà Lạt';
 case'vp-dl': return'Nguyễn Thái Học, P.1, TP. Đà Lạt';
 default: return'Điểm đón/trả mặc định';
 }
 };

 return (
 <div className="bg-gray-50 dark:bg-slate-900 min-h-[calc(100vh-4rem)] pt-20 pb-32 font-sans text-gray-900 dark:text-white transition-colors duration-300">
 <div className="container max-w-5xl mx-auto px-4">
 
 {/* Header */}
 <div className="flex items-center gap-4 mb-8">
 <button 
 onClick={() => navigate(-1)}
 className="p-3 bg-white dark:bg-slate-800 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors shadow-sm border border-gray-200 dark:border-slate-700"
 >
 <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
 </button>
 <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
 Xác nhận thông tin đặt vé
 </h1>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 
 {/* Main Info Column */}
 <div className="lg:col-span-2 space-y-6">
 
 {/* Trip Info */}
 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
 <Card className="relative overflow-hidden bg-white dark:bg-slate-950 ] border-0 shadow-xl shadow-blue-900/5 dark:shadow-none">
 {/* Gradient Header Background */}
 <div className="absolute top-0 left-0 w-full h-36 bg-gradient-to-r from-blue-600 to-indigo-600">
 <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
 <div className="absolute bottom-0 left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
 </div>
 
 <div className="relative pt-8 px-6 md:px-8 pb-8">
 <div className="flex items-center gap-5 mb-8">
 <div className="w-16 h-16 bg-white shadow-lg flex items-center justify-center text-blue-600">
 <MapPin className="w-8 h-8" />
 </div>
 <div>
 <h2 className="text-2xl md:text-3xl font-black text-white drop-shadow-md">Sài Gòn - Đà Lạt</h2>
 <div className="text-blue-100 font-medium mt-1.5 flex items-start sm:items-center gap-2 text-sm md:text-base">
 <span className="w-1.5 h-1.5 rounded-full bg-blue-300 mt-2 sm:mt-0 flex-shrink-0"></span>
 <span className="leading-tight">An Chuyến Premium &bull; Limousine 22 Giường VIP</span>
 </div>
 </div>
 </div>
 
 <div className="bg-gray-50/80 dark:bg-slate-900/80 backdrop-blur-md p-6 md:p-8 ] border border-white dark:border-slate-800 shadow-sm">
 <div className="flex flex-col md:flex-row items-center gap-6 relative">
 
 {/* Origin */}
 <div className="flex-1 w-full text-center md:text-left">
 <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 font-bold uppercase tracking-wider">Điểm đón</p>
 <p className="font-extrabold text-gray-900 dark:text-white text-lg md:text-xl line-clamp-2">{pickupLabel}</p>
 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{getAddress(pickupPoint)}</p>
 <div className="inline-flex items-center gap-2 mt-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 border border-blue-100 dark:border-blue-800/30">
 <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
 <span className="text-sm text-blue-700 dark:text-blue-300 font-bold">08:30 - Hôm nay</span>
 </div>
 </div>
 
 {/* Connection Line */}
 <div className="hidden md:block flex-1 px-4 relative w-full">
 <div className="h-[2px] w-full bg-gradient-to-r from-blue-500/20 via-blue-500 to-emerald-500/20 rounded-full"></div>
 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white dark:bg-slate-900 rounded-full border-4 border-gray-50 dark:border-slate-950 flex items-center justify-center text-gray-400 shadow-sm z-10">
 <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
 </div>
 </div>
 
 {/* Destination */}
 <div className="flex-1 w-full text-center md:text-right">
 <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 font-bold uppercase tracking-wider">Điểm trả</p>
 <p className="font-extrabold text-gray-900 dark:text-white text-lg md:text-xl line-clamp-2">{dropoffLabel}</p>
 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{getAddress(dropoffPoint)}</p>
 <div className="inline-flex items-center gap-2 mt-2 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 border border-emerald-100 dark:border-emerald-800/30">
 <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
 <span className="text-sm text-emerald-700 dark:text-emerald-300 font-bold">15:30 - Cùng ngày</span>
 </div>
 </div>
 
 </div>
 </div>
 
 <div className="mt-6 flex flex-wrap gap-4 justify-between items-center">
 <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/50 px-6 py-4 flex items-center gap-3 shadow-sm w-full md:w-auto">
 <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center text-orange-600 dark:text-orange-400">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
 </div>
 <span className="text-sm text-orange-700 dark:text-orange-300 font-medium">Ghế đã chọn:</span>
 <span className="font-black text-xl text-orange-600 dark:text-orange-400 tracking-tight">{seats.join(',')}</span>
 </div>
 
 <div className="flex gap-3 w-full md:w-auto justify-center md:justify-end">
 <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold text-sm rounded-full border border-blue-100 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors shadow-sm">
 <Shield className="w-4 h-4" /> Chính sách hủy vé
 </button>
 <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold text-sm rounded-full border border-blue-100 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors shadow-sm">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
 Hành lý 20kg
 </button>
 </div>
 </div>
 </div>
 </Card>
 </motion.div>

 {/* Passenger Info */}
 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
 <Card className="bg-white dark:bg-slate-950 ] p-6 md:p-8 border border-gray-100 dark:border-slate-800 shadow-lg shadow-gray-200/20 dark:shadow-none">
 <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-slate-800">
 <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
 <User className="w-7 h-7" />
 </div>
 <div>
 <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Thông tin liên hệ</h2>
 <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Chi tiết người đi & người đặt</p>
 </div>
 </div>
 
 <div className="space-y-6">
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-50 dark:bg-slate-900 p-6 border border-gray-100 dark:border-slate-800">
 <div>
 <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2 uppercase tracking-wider flex items-center gap-1.5">
 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
 Hành khách
 </p>
 <p className="font-bold text-gray-900 dark:text-white text-lg">{passengerInfo.name ||'Không xác định'}</p>
 </div>
 <div>
 <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2 uppercase tracking-wider flex items-center gap-1.5">
 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
 Số điện thoại
 </p>
 <p className="font-bold text-gray-900 dark:text-white text-lg">{passengerInfo.phone ||'Không xác định'}</p>
 </div>
 <div>
 <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2 uppercase tracking-wider flex items-center gap-1.5">
 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
 Email nhận vé
 </p>
 <p className="font-bold text-gray-900 dark:text-white text-lg break-all">{passengerInfo.email ||'Không xác định'}</p>
 </div>
 </div>
 
 {bookerInfo && (
 <div className="pt-2">
 <div className="bg-blue-50/50 dark:bg-blue-900/10 p-5 border border-blue-100 dark:border-blue-900/30">
 <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mb-4 uppercase tracking-wider flex items-center gap-2">
 <CheckCircle2 className="w-4 h-4" /> Người đặt hộ
 </p>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
 <div>
 <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Tên người đặt</p>
 <p className="font-bold text-gray-900 dark:text-white text-lg">{bookerInfo.name}</p>
 </div>
 <div>
 <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Số điện thoại</p>
 <p className="font-bold text-gray-900 dark:text-white text-lg">{bookerInfo.phone}</p>
 </div>
 </div>
 </div>
 </div>
 )}

 <div className="pt-2">
 <label className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2 uppercase tracking-wider flex items-center gap-1.5">
 <FileText className="w-3.5 h-3.5" /> Ghi chú cho nhà xe (Tùy chọn)
 </label>
 <textarea 
 placeholder="VD: Có trẻ em đi cùng, xin xếp ghế cạnh nhau; Đón ở cổng số 2..."
 className="w-full bg-white dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-800 p-4 text-sm text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none resize-none h-28 transition-all"
 ></textarea>
 </div>
 </div>
 </Card>
 </motion.div>

 {/* Extras */}
 {(addInsurance || needVAT) && (
 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
 <Card className="bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20 ] p-6 md:p-8 border border-emerald-100/50 dark:border-emerald-900/30 shadow-sm flex flex-col gap-4">
 {addInsurance && (
 <div className="flex items-center gap-4 bg-white/60 dark:bg-slate-950/50 backdrop-blur-sm p-4 border border-emerald-200/50 dark:border-emerald-800/50 shadow-sm">
 <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
 <Shield className="w-6 h-6" />
 </div>
 <span className="font-bold text-emerald-900 dark:text-emerald-300 text-lg">Đã bao gồm Bảo hiểm chuyến đi</span>
 </div>
 )}
 {needVAT && (
 <div className="flex items-center gap-4 bg-white/60 dark:bg-slate-950/50 backdrop-blur-sm p-4 border border-blue-200/50 dark:border-blue-800/50 shadow-sm">
 <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
 <FileText className="w-6 h-6" />
 </div>
 <span className="font-bold text-blue-900 dark:text-blue-300 text-lg">Đã đăng ký xuất Hóa đơn VAT</span>
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
 <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 p-4 ] flex items-center justify-between shadow-sm">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center text-orange-600 dark:text-orange-400">
 <Clock className="w-5 h-5" />
 </div>
 <div>
 <p className="text-sm font-bold text-orange-900 dark:text-orange-300">Thời gian giữ ghế</p>
 <p className="text-xs text-orange-700 dark:text-orange-400">Vui lòng thanh toán sớm</p>
 </div>
 </div>
 <div className="text-2xl font-black text-orange-600 dark:text-orange-500 tabular-nums tracking-tight">
 {formatTime(timeLeft)}
 </div>
 </div>

 {/* Promo Code */}
 <Card className="bg-white dark:bg-slate-950 ] p-6 border border-gray-200 dark:border-slate-800 shadow-sm">
 <p className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
 <Tag className="w-4 h-4 text-blue-500" /> Mã giảm giá / Ưu đãi
 </p>
 <div className="flex gap-2">
 <input 
 type="text" 
 value={promoCode}
 onChange={(e) => setPromoCode(e.target.value)}
 placeholder="Nhập mã (VD: ANCHUYEN10)" 
 className="flex-1 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 ] px-4 py-3 text-sm uppercase font-semibold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
 />
 <Button onClick={handleApplyPromo} className="bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white ] px-6 font-bold shadow-none h-[46px]">
 Áp dụng
 </Button>
 </div>
 </Card>

 {/* Payment Methods */}
 <Card className="bg-white dark:bg-slate-950 ] p-6 border border-gray-200 dark:border-slate-800 shadow-sm">
 <p className="text-sm font-bold text-gray-900 dark:text-white mb-4">Phương thức thanh toán</p>
 <div className="space-y-3">
 <label className={`flex items-center gap-4 p-4 border-2 cursor-pointer transition-all ${paymentMethod ==='qr' ?'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-md shadow-blue-500/10' :'border-gray-100 dark:border-slate-800 hover:border-gray-200 dark:hover:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-900'}`}>
 <input type="radio" name="payment" value="qr" checked={paymentMethod ==='qr'} onChange={() => setPaymentMethod('qr')} className="hidden" />
 <div className={`w-10 h-10 flex items-center justify-center transition-colors ${paymentMethod ==='qr' ?'bg-blue-500 text-white shadow-sm' :'bg-gray-100 dark:bg-slate-800 text-gray-500'}`}>
 <Smartphone className="w-5 h-5" />
 </div>
 <span className="font-bold text-gray-900 dark:text-white flex-1">Chuyển khoản QR (VietQR)</span>
 <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod ==='qr' ?'border-blue-500' :'border-gray-300 dark:border-slate-600'}`}>
 {paymentMethod ==='qr' && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
 </div>
 </label>
 
 <label className={`flex items-center gap-4 p-4 border-2 cursor-pointer transition-all ${paymentMethod ==='card' ?'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-md shadow-blue-500/10' :'border-gray-100 dark:border-slate-800 hover:border-gray-200 dark:hover:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-900'}`}>
 <input type="radio" name="payment" value="card" checked={paymentMethod ==='card'} onChange={() => setPaymentMethod('card')} className="hidden" />
 <div className={`w-10 h-10 flex items-center justify-center transition-colors ${paymentMethod ==='card' ?'bg-blue-500 text-white shadow-sm' :'bg-gray-100 dark:bg-slate-800 text-gray-500'}`}>
 <CreditCard className="w-5 h-5" />
 </div>
 <span className="font-bold text-gray-900 dark:text-white flex-1">Thẻ ATM / Visa / Mastercard</span>
 <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod ==='card' ?'border-blue-500' :'border-gray-300 dark:border-slate-600'}`}>
 {paymentMethod ==='card' && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
 </div>
 </label>
 </div>
 </Card>

 {/* Total Summary */}
 <Card className="bg-white dark:bg-slate-950 ] p-6 md:p-8 border-2 border-orange-200 dark:border-orange-900/50 shadow-2xl shadow-orange-500/10 relative overflow-hidden">
 <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/50 dark:bg-orange-900/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
 
 <h3 className="text-2xl font-black mb-6 flex items-center gap-4 relative">
 <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
 <FileText className="text-white w-6 h-6" />
 </div>
 Tóm tắt chi phí
 </h3>
 
 <div className="space-y-5 mb-8 relative">
 <div className="flex justify-between items-center font-medium p-3 bg-gray-50 dark:bg-slate-900/50">
 <span className="text-gray-600 dark:text-gray-400">Giá vé ({seats.length} ghế)</span>
 <span className="text-gray-900 dark:text-white font-bold text-lg">{new Intl.NumberFormat('vi-VN').format(basePrice)}đ</span>
 </div>
 
 {/* Toggleable Insurance */}
 <div className={`flex justify-between items-center font-medium p-3 cursor-pointer transition-colors ${isInsuranceEnabled ?'bg-emerald-50/80 dark:bg-emerald-900/20' :'hover:bg-gray-50 dark:hover:bg-slate-900/50'}`} onClick={() => setIsInsuranceEnabled(!isInsuranceEnabled)}>
 <div className="flex items-center gap-3">
 <div className={`w-5 h-5 flex items-center justify-center border transition-colors ${isInsuranceEnabled ?'bg-emerald-500 border-emerald-500 text-white' :'border-gray-300 dark:border-slate-600 text-transparent'}`}>
 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
 </div>
 <span className={`${isInsuranceEnabled ?'text-emerald-700 dark:text-emerald-400 font-bold' :'text-gray-600 dark:text-gray-400'}`}>Bảo hiểm chuyến đi</span>
 </div>
 <span className={`${isInsuranceEnabled ?'text-emerald-700 dark:text-emerald-400 font-bold' :'text-gray-400 dark:text-gray-500 line-through'} text-lg`}>
 {new Intl.NumberFormat('vi-VN').format(seats.length * 20000)}đ
 </span>
 </div>
 
 {discount > 0 && (
 <div className="flex justify-between items-center font-medium p-3 bg-blue-50/80 dark:bg-blue-900/20">
 <span className="text-blue-700 dark:text-blue-400 font-bold flex items-center gap-2">
 <Tag className="w-4 h-4" /> Giảm giá
 </span>
 <span className="text-blue-700 dark:text-blue-400 font-bold text-lg">
 -{new Intl.NumberFormat('vi-VN').format(discount)}đ
 </span>
 </div>
 )}
 
 {needVAT && (
 <div className="flex justify-between items-center font-medium px-3 text-sm">
 <span className="text-gray-500 dark:text-gray-400">Thuế VAT (8%)</span>
 <span className="text-gray-900 dark:text-white font-bold">Đã tính</span>
 </div>
 )}
 </div>
 
 <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/40 dark:to-red-950/40 p-6 mb-6 border border-orange-100 dark:border-orange-900/30 relative overflow-hidden">
 <div className="flex justify-between items-end relative">
 <span className="text-orange-900 dark:text-orange-300 font-extrabold text-sm uppercase tracking-wider">Tổng thanh toán</span>
 <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400">{new Intl.NumberFormat('vi-VN').format(finalTotalAmount)}đ</span>
 </div>
 </div>

 {/* Terms Acceptance */}
 <div className="mb-6 flex items-start gap-3">
 <button 
 onClick={() => setTermsAccepted(!termsAccepted)}
 className={`mt-0.5 flex-shrink-0 w-6 h-6 flex items-center justify-center border transition-all ${termsAccepted ?'bg-blue-600 border-blue-600 text-white' :'border-gray-300 dark:border-slate-600 text-transparent hover:border-blue-500'}`}
 >
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
 </button>
 <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed cursor-pointer" onClick={() => setTermsAccepted(!termsAccepted)}>
 Tôi đã đọc và đồng ý với <a href="#" className="text-blue-500 hover:underline" onClick={(e) => e.stopPropagation()}>Điều khoản dịch vụ</a> và <a href="#" className="text-blue-500 hover:underline" onClick={(e) => e.stopPropagation()}>Chính sách bảo mật</a> của An Chuyến.
 </p>
 </div>
 
 <Button 
 onClick={handleProceedToPayment}
 disabled={!termsAccepted}
 className={`w-full h-16 font-bold text-lg text-white border-0 transition-all duration-300 ${termsAccepted ?'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-xl shadow-orange-500/30 hover:-translate-y-1 hover:shadow-orange-500/40' :'bg-gray-300 dark:bg-slate-700 cursor-not-allowed opacity-70'}`}
 >
 <span className="flex items-center justify-center gap-3">
 Tiến hành thanh toán
 {termsAccepted && (
 <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
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
