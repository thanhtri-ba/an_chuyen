import { useState, useEffect } from'react';
import { Link, useNavigate } from'react-router-dom';
import { ArrowLeft, CreditCard, Wallet, QrCode, ShieldCheck, Ticket, CheckCircle2, Loader2, Info } from'lucide-react';
import { motion } from'framer-motion';

import { Button } from'../../../design-system/components/Button';
import { Input } from'../../../design-system/components/Input';
import { Card } from'../../../design-system/components/Card';
import { Checkbox } from'../../../design-system/components/Checkbox';
import api from'../../../lib/api';

import type { BookingData } from '../../../types';

export function PaymentPage() {
 const navigate = useNavigate();
 const [selectedMethod, setSelectedMethod] = useState('busz-wallet');
 const [isProcessing, setIsProcessing] = useState(false);
 const [usePoints, setUsePoints] = useState(false);
 const [voucherCode, setVoucherCode] = useState('');
 const [voucherApplied, setVoucherApplied] = useState(false);
 const [pendingBooking, setPendingBooking] = useState<BookingData | null>(null);
 const [availablePoints, setAvailablePoints] = useState(0);

 useEffect(() => {
 const raw = sessionStorage.getItem('pending_booking');
 if (raw) {
 try {
 setPendingBooking(JSON.parse(raw));
 } catch {
 setPendingBooking(null);
 }
 }

 api.get('/loyalty/me')
 .then(res => setAvailablePoints(res.data?.data?.points || 0))
 .catch(() => setAvailablePoints(0));
 }, []);

 const baseTotal = pendingBooking?.totalAmount || 0;
 const insuranceTotal = pendingBooking?.addInsurance ? (pendingBooking.seats.length * pendingBooking.insurancePrice) : 0;
 const pointsDiscount = availablePoints * 10;
 const voucherDiscount = voucherApplied ? 50000 : 0;
 const finalTotal = Math.max(0, baseTotal - (usePoints ? pointsDiscount : 0) - voucherDiscount);

 const handleApplyVoucher = () => {
 if (voucherCode.toUpperCase() ==='BUSZVIP') {
 setVoucherApplied(true);
 } else {
 alert('Mã không hợp lệ hoặc đã hết hạn.');
 }
 };

 const handlePayment = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!pendingBooking) {
 alert('Không tìm thấy thông tin đặt vé. Vui lòng chọn ghế lại.');
 return;
 }
 setIsProcessing(true);
 try {
 const res = await api.post('/bookings/create', {
 tripScheduleId: pendingBooking.tripScheduleId,
 seatNumbers: pendingBooking.seats,
 passengers: [{ name: pendingBooking.passengerInfo.name }],
 paymentMethod: selectedMethod
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
 }));

 sessionStorage.removeItem('pending_booking');
 navigate('/booking-confirmation');
 } catch (error: any) {
 console.error("Booking failed", error);
 alert(error?.response?.data?.message || 'Thanh toán thất bại, vui lòng thử lại.');
 } finally {
 setIsProcessing(false);
 }
 };

 return (
 <div className="bg-gray-50 min-h-[calc(100vh-4rem)] pt-20 pb-24 md:pb-12">
 {/* Header Info */}
 <div className="bg-white text-gray-900 py-4 sticky top-0 md:top-20 z-30 shadow-sm border-b border-gray-200">
 <div className="container flex items-center gap-4">
 <Link to="/seat-selection" className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors border border-gray-200 text-gray-600">
 <ArrowLeft className="w-5 h-5" />
 </Link>
 <div>
 <h1 className="text-xl md:text-2xl font-extrabold">Thanh toán an toàn</h1>
 <p className="text-gray-500 text-xs md:text-sm font-medium mt-0.5">Mã đơn hàng: #BZ882910</p>
 </div>
 </div>
 </div>

 <div className="container py-8 flex flex-col lg:flex-row gap-8 items-start">
 
 {/* Left Column: Payment Methods */}
 <div className="w-full lg:w-[60%] space-y-6">
 
 <Card className="border border-gray-100 shadow-sm p-6 lg:p-8 bg-white">
 <h2 className="text-xl font-extrabold mb-6">Ưu đãi & Điểm thưởng</h2>
 
 <div className="space-y-6">
 {/* An Chuyến Points */}
 <div className="flex items-start gap-4 p-4 border bg-yellow-50/50 border-yellow-100">
 <Checkbox id="points" checked={usePoints} onCheckedChange={(c) => setUsePoints(c as boolean)} className="mt-1 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500" />
 <div className="flex-1">
 <label htmlFor="points" className="font-bold text-yellow-900 flex justify-between cursor-pointer">
 <span>Sử dụng {new Intl.NumberFormat('vi-VN').format(availablePoints)} An Chuyến Points</span>
 <span>-{new Intl.NumberFormat('vi-VN').format(pointsDiscount)}đ</span>
 </label>
 <p className="text-sm text-yellow-800/70 mt-1">Quy đổi: 10 Điểm = 100đ. Bạn đang có {new Intl.NumberFormat('vi-VN').format(availablePoints)} điểm.</p>
 </div>
 </div>

 {/* Voucher */}
 <div className="flex gap-3">
 <div className="relative flex-1">
 <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
 <Input 
 value={voucherCode}
 onChange={(e) => setVoucherCode(e.target.value)}
 placeholder="Nhập mã khuyến mãi (Thử: BUSZVIP)" 
 disabled={voucherApplied}
 className="h-12 pl-12 bg-muted/30 uppercase font-bold" 
 />
 </div>
 <Button 
 type="button"
 variant={voucherApplied ?"secondary" :"default"}
 onClick={handleApplyVoucher}
 disabled={voucherApplied || !voucherCode}
 className="h-12 px-6 font-bold"
 >
 {voucherApplied ?'Đã áp dụng' :'Áp dụng'}
 </Button>
 </div>
 {voucherApplied && (
 <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold bg-emerald-50 p-3 border border-emerald-100">
 <CheckCircle2 className="w-4 h-4" /> Tuyệt vời! Bạn được giảm 50.000đ
 </div>
 )}
 </div>
 </Card>

 <Card className="border border-gray-100 shadow-sm p-6 lg:p-8 bg-white">
 <h2 className="text-xl font-extrabold mb-6">Chọn phương thức thanh toán</h2>
 
 <form onSubmit={handlePayment} className="space-y-4">
 
 <label className={`flex flex-col p-4 border-2 cursor-pointer transition-all ${selectedMethod ==='busz-wallet' ?'border-primary bg-primary/5' :'border-border hover:border-primary/50'}`}>
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
 <Wallet className="w-5 h-5" />
 </div>
 <div>
 <div className="font-bold">Ví An Chuyến Pay</div>
 <div className="text-sm text-emerald-600 font-semibold">Số dư: 0đ</div>
 </div>
 </div>
 <input type="radio" name="payment" checked={selectedMethod ==='busz-wallet'} onChange={() => setSelectedMethod('busz-wallet')} className="w-5 h-5 text-primary" />
 </div>
 {selectedMethod ==='busz-wallet' && (
 <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height:'auto' }} className="mt-4 pt-4 border-t text-sm text-muted-foreground flex items-center gap-2">
 <ShieldCheck className="w-4 h-4 text-emerald-600" /> Miễn phí giao dịch. Hoàn tiền 100% về ví nếu hủy vé hợp lệ.
 </motion.div>
 )}
 </label>

 <label className={`flex flex-col p-4 border-2 cursor-pointer transition-all ${selectedMethod ==='qr' ?'border-primary bg-primary/5' :'border-border hover:border-primary/50'}`}>
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700">
 <QrCode className="w-5 h-5" />
 </div>
 <span className="font-bold">VietQR / Chuyển khoản ngân hàng</span>
 </div>
 <input type="radio" name="payment" checked={selectedMethod ==='qr'} onChange={() => setSelectedMethod('qr')} className="w-5 h-5 text-primary" />
 </div>
 {selectedMethod ==='qr' && (
 <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height:'auto' }} className="mt-4 pt-4 border-t flex flex-col items-center">
 <p className="text-sm font-semibold mb-2">Sử dụng app ngân hàng để quét mã VietQR</p>
 <div className="w-32 h-32 bg-gray-200 flex items-center justify-center mb-2 shadow-sm border border-gray-300">
 <QrCode className="w-16 h-16 text-gray-500" />
 </div>
 </motion.div>
 )}
 </label>

 <label className={`flex flex-col p-4 border-2 cursor-pointer transition-all ${selectedMethod ==='card' ?'border-primary bg-primary/5' :'border-border hover:border-primary/50'}`}>
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
 <CreditCard className="w-5 h-5" />
 </div>
 <span className="font-bold">Thẻ tín dụng / Thẻ ghi nợ quốc tế</span>
 </div>
 <input type="radio" name="payment" checked={selectedMethod ==='card'} onChange={() => setSelectedMethod('card')} className="w-5 h-5 text-primary" />
 </div>
 {selectedMethod ==='card' && (
 <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height:'auto' }} className="mt-4 pt-4 border-t space-y-4">
 <Input type="text" placeholder="Số thẻ (VD: 4123 4567 8901 2345)" className="h-12 bg-white" />
 <div className="grid grid-cols-2 gap-4">
 <Input type="text" placeholder="MM/YY" className="h-12 bg-white" />
 <Input type="text" placeholder="CVC" className="h-12 bg-white" />
 </div>
 </motion.div>
 )}
 </label>

 <label className={`flex flex-col p-4 border-2 cursor-pointer transition-all ${selectedMethod ==='vnpay' ?'border-primary bg-primary/5' :'border-border hover:border-primary/50'}`}>
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 bg-white border flex items-center justify-center font-bold text-xs">
 <span className="text-blue-600">VN</span><span className="text-red-600">PAY</span>
 </div>
 <span className="font-bold">VNPAY - Thẻ ATM / QR Pay</span>
 </div>
 <input type="radio" name="payment" checked={selectedMethod ==='vnpay'} onChange={() => setSelectedMethod('vnpay')} className="w-5 h-5 text-primary" />
 </div>
 {selectedMethod ==='vnpay' && (
 <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height:'auto' }} className="mt-4 pt-4 border-t flex flex-col items-center">
 <p className="text-sm font-semibold mb-2">Quét mã QR qua ứng dụng ngân hàng</p>
 <div className="w-32 h-32 bg-gray-200 flex items-center justify-center mb-2 shadow-sm border border-gray-300">
 <QrCode className="w-16 h-16 text-gray-400" />
 </div>
 <p className="text-xs text-muted-foreground text-center">Hoặc tự động chuyển hướng khi thanh toán trên điện thoại</p>
 </motion.div>
 )}
 </label>

 <label className={`flex flex-col p-4 border-2 cursor-pointer transition-all ${selectedMethod ==='momo' ?'border-primary bg-primary/5' :'border-border hover:border-primary/50'}`}>
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 bg-[#A50064] flex items-center justify-center text-white font-extrabold text-xs">
 MoMo
 </div>
 <span className="font-bold">Ví điện tử MoMo</span>
 </div>
 <input type="radio" name="payment" checked={selectedMethod ==='momo'} onChange={() => setSelectedMethod('momo')} className="w-5 h-5 text-primary" />
 </div>
 {selectedMethod ==='momo' && (
 <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height:'auto' }} className="mt-4 pt-4 border-t flex flex-col items-center">
 <p className="text-sm font-semibold mb-2 text-[#A50064]">Mở ứng dụng MoMo để quét mã</p>
 <div className="w-32 h-32 bg-gray-200 flex items-center justify-center mb-2 shadow-sm border border-[#A50064]/20">
 <QrCode className="w-16 h-16 text-[#A50064]" />
 </div>
 </motion.div>
 )}
 </label>

 {/* Thanh toán tại quầy */}
 <label className={`flex flex-col p-4 border-2 cursor-pointer transition-all ${selectedMethod ==='counter' ?'border-primary bg-primary/5' :'border-border hover:border-primary/50'}`}>
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
 <Ticket className="w-5 h-5" />
 </div>
 <span className="font-bold">Thanh toán tiền mặt tại quầy</span>
 </div>
 <input type="radio" name="payment" checked={selectedMethod ==='counter'} onChange={() => setSelectedMethod('counter')} className="w-5 h-5 text-primary" />
 </div>
 {selectedMethod ==='counter' && (
 <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height:'auto' }} className="mt-4 pt-4 border-t">
 <div className="flex gap-3 bg-orange-50 p-4 border border-orange-100">
 <Info className="w-5 h-5 text-orange-600 shrink-0" />
 <div>
 <p className="text-sm font-semibold text-orange-900 mb-1">Giữ chỗ trong 30 phút</p>
 <p className="text-xs text-orange-800">Bạn vui lòng đến quầy vé An Chuyến tại bến xe để thanh toán bằng tiền mặt và nhận vé cứng trong vòng 30 phút kể từ lúc đặt thành công. Sau thời gian này, vé sẽ tự động bị hủy.</p>
 </div>
 </div>
 </motion.div>
 )}
 </label>
 </form>
 </Card>
 </div>

 {/* Right Column: Order Summary */}
 <div className="w-full lg:w-[40%]">
 <Card className="bg-white border border-gray-100 shadow-md p-6 md:p-8 sticky top-28">
 <h2 className="text-xl font-extrabold mb-6 text-gray-900">Chi tiết thanh toán</h2>
 
 <div className="space-y-4 mb-6">
 <div className="flex justify-between items-start text-gray-700">
 <div>
 <div className="font-bold text-gray-900">{pendingBooking?.routeLabel || 'Chuyến xe'}</div>
 <div className="text-sm text-gray-500 mt-1">
 {pendingBooking?.busAgentName || 'Nhà xe'} • Ghế {pendingBooking?.seats.join(', ') ||'--'}
 </div>
 </div>
 <div className="font-bold text-gray-900">{new Intl.NumberFormat('vi-VN').format(pendingBooking?.seatsTotal || 0)}đ</div>
 </div>

 <div className="flex justify-between items-start text-gray-700">
 <div className="flex items-center gap-1.5">
 <ShieldCheck className="w-4 h-4 text-emerald-500" />
 <span className="text-sm font-semibold">Bảo hiểm chuyến đi</span>
 </div>
 <div className="font-bold text-gray-900">{new Intl.NumberFormat('vi-VN').format(insuranceTotal)}đ</div>
 </div>

 {(usePoints || voucherApplied) && (
 <div className="pt-4 border-t border-gray-200 border-dashed space-y-2">
 {usePoints && (
 <div className="flex justify-between items-center text-primary">
 <span className="text-sm font-semibold">Giảm trừ điểm ({new Intl.NumberFormat('vi-VN').format(availablePoints)} pts)</span>
 <span className="font-bold">-{new Intl.NumberFormat('vi-VN').format(pointsDiscount)}đ</span>
 </div>
 )}
 {voucherApplied && (
 <div className="flex justify-between items-center text-secondary">
 <span className="text-sm font-semibold">Mã khuyến mãi (BUSZVIP)</span>
 <span className="font-bold">-50.000đ</span>
 </div>
 )}
 </div>
 )}
 </div>

 <div className="pt-6 border-t border-gray-200 flex flex-col gap-2 mb-8">
 <div className="flex justify-between items-end text-gray-900">
 <span className="font-bold">Tổng thanh toán</span>
 <span className="text-3xl font-extrabold text-secondary">
 {new Intl.NumberFormat('vi-VN').format(finalTotal)}đ
 </span>
 </div>
 <p className="text-xs text-gray-500 text-right">Đã bao gồm thuế và phí dịch vụ</p>
 </div>
 
 <Button 
 size="lg"
 onClick={handlePayment}
 disabled={isProcessing}
 className="w-full h-14 font-extrabold text-lg shadow-lg shadow-orange-500/30 relative overflow-hidden btn-secondary text-white"
 >
 {isProcessing ? (
 <>
 <Loader2 className="w-6 h-6 mr-2 animate-spin" /> Đang xử lý giao dịch...
 </>
 ) : (
 `Thanh toán ${new Intl.NumberFormat('vi-VN').format(finalTotal)}đ`
 )}
 </Button>

 <div className="mt-4 flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-3 border border-gray-200">
 <Info className="w-4 h-4 shrink-0 mt-0.5" />
 <span>Bằng việc bấm Thanh toán, bạn đồng ý với Điều khoản sử dụng và Chính sách bảo mật của An Chuyến.</span>
 </div>
 </Card>
 </div>

 </div>
 </div>
 );
}
