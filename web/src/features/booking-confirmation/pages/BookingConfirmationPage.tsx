import { useEffect, useState } from'react';
import { Link } from'react-router-dom';
import { CheckCircle2, Download, Home, Share2, Check } from'lucide-react';
import { motion, AnimatePresence } from'framer-motion';

// Confetti particle component
function ConfettiParticle({ delay, color }: { delay: number; color: string }) {
 const left = Math.random() * 100;
 const duration = 3 + Math.random() * 2;
 return (
 <motion.div
 initial={{ y: -20, x: `${left}vw`, opacity: 1, rotate: 0 }}
 animate={{ y:'105vh', opacity: [1, 1, 0], rotate: 720 }}
 transition={{ duration, delay, ease:'easeIn' }}
 className="fixed top-0 z-50 pointer-events-none"
 style={{ width: 10, height: 10, backgroundColor: color, borderRadius: Math.random() > 0.5 ?'50%' :'2px' }}
 />
 );
}

const CONFETTI_COLORS = ['#10b981','#3b82f6','#f59e0b','#ec4899'];

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

 return (
 <div className="min-h-screen bg-[#0e1111] pt-24 pb-16 flex flex-col items-center justify-start p-4 font-sans text-gray-900">

 {/* Confetti */}
 <AnimatePresence>
 {showConfetti && (
 <>
 {[...Array(40)].map((_, i) => (
 <ConfettiParticle
 key={i}
 delay={i * 0.05}
 color={CONFETTI_COLORS[i % CONFETTI_COLORS.length]}
 />
 ))}
 </>
 )}
 </AnimatePresence>

 <div className="max-w-[420px] w-full flex flex-col items-center">
 
 {/* Success Header */}
 <motion.div
 initial={{ opacity: 0, y: -20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5 }}
 className="text-center mb-6 flex flex-col items-center"
 >
 <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
 <CheckCircle2 className="w-8 h-8 text-emerald-600" strokeWidth={2.5} />
 </div>
 <h1 className="text-xl font-bold text-[#f0ede6]">Thanh toán thành công!</h1>
 </motion.div>

 {/* ================= RECEIPT TICKET ================= */}
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6 }}
 className="w-full bg-white p-6 sm:p-8 shadow-md relative mx-auto font-sans"
 >
 {/* Top Info */}
 <div className="flex justify-between text-xs font-semibold mb-4">
 <div>
 <p>Mẫu số: 01/VE014TV</p>
 <p>Ký hiệu: TV/19E</p>
 </div>
 <div>
 <p>Số:</p>
 </div>
 </div>

 {/* Company Info */}
 <div className="text-[11px] mb-6 space-y-0.5 font-medium uppercase text-gray-800">
 <p className="font-bold">CÔNG TY CỔ PHẦN AN CHUYẾN</p>
 <p>123 Đường Điện Biên Phủ, P.15, Q.Bình Thạnh, TP. HCM</p>
 <p>Mã số thuế: 0312345678</p>
 <p>Điện thoại: 1900 1234 - (028) 38 123 456</p>
 </div>

 {/* Title */}
 <div className="text-center mb-6">
 <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wide">VÉ XE KHÁCH</h2>
 <p className="text-xs text-gray-600 mt-1">(Bản thể hiện của vé điện tử)</p>
 {bookingDate && (
 <p className="text-xs text-gray-600 mt-1">Ngày {bookingDate.toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric' })}</p>
 )}
 </div>

 <div className="w-full border-t-2 border-gray-800 mb-6"></div>

 {/* Ticket Details */}
 <div className="space-y-2 text-sm mb-6 font-medium">
 <div className="flex justify-between">
 <span>Hành khách:</span>
 <span className="font-bold text-right">{booking?.passengerName ||'—'}</span>
 </div>
 <div className="flex justify-between">
 <span>Tuyến xe:</span>
 <span className="font-bold text-right">{booking?.routeLabel ||'—'}</span>
 </div>
 <div className="flex justify-between">
 <span>Nhà xe:</span>
 <span className="font-bold text-right">{booking?.busAgentName ||'—'}</span>
 </div>
 <div className="flex justify-between">
 <span>Ghế:</span>
 <span className="font-bold text-right">{booking?.seats?.join(', ') ||'—'}</span>
 </div>
 </div>

 <div className="w-full border-t border-dashed border-gray-400 mb-6"></div>

 {/* Total Amount */}
 <div className="text-center mb-6">
 <h3 className="text-2xl font-bold">Tổng tiền: {booking ? new Intl.NumberFormat('vi-VN').format(booking.totalAmount) : '—'} đ</h3>
 <p className="text-xs text-gray-600 mt-1">(Bao gồm thuế GTGT)</p>
 </div>

 {/* Signature Box */}
 <div className="border border-gray-800 p-3 flex gap-3 items-center mb-8 max-w-[280px] mx-auto">
 <div className="w-8 h-8 rounded-full border-2 border-gray-800 flex items-center justify-center flex-shrink-0">
 <Check className="w-5 h-5 text-gray-800" strokeWidth={3} />
 </div>
 <div className="text-[11px] font-semibold text-gray-800 leading-tight">
 <p>Signature Valid</p>
 <p>Ký bởi: Công ty Cổ phần An Chuyến</p>
 <p>Ngày ký: 20/11/2026</p>
 </div>
 </div>

 {/* QR Code */}
 <div className="flex flex-col items-center justify-center mb-6">
 {/* Fake QR using CSS borders to look exactly like the image */}
 <div className="w-48 h-48 border-[6px] border-black p-1 grid grid-cols-5 grid-rows-5 gap-1 relative mb-4">
 {/* 3 Corner squares */}
 <div className="col-span-2 row-span-2 border-[4px] border-black p-1">
 <div className="w-full h-full bg-black"></div>
 </div>
 <div className="col-start-4 col-span-2 row-span-2 border-[4px] border-black p-1">
 <div className="w-full h-full bg-black"></div>
 </div>
 <div className="row-start-4 col-span-2 row-span-2 border-[4px] border-black p-1">
 <div className="w-full h-full bg-black"></div>
 </div>
 {/* Random dots for middle */}
 <div className="col-start-3 row-start-1 bg-black"></div>
 <div className="col-start-3 row-start-2 bg-black opacity-0"></div>
 <div className="col-start-1 row-start-3 bg-black"></div>
 <div className="col-start-2 row-start-3 bg-black"></div>
 <div className="col-start-3 row-start-3 bg-black"></div>
 <div className="col-start-4 row-start-3 bg-black"></div>
 <div className="col-start-5 row-start-3 bg-black"></div>
 <div className="col-start-3 row-start-4 bg-black"></div>
 <div className="col-start-4 row-start-4 bg-black opacity-0"></div>
 <div className="col-start-5 row-start-4 bg-black"></div>
 <div className="col-start-3 row-start-5 bg-black"></div>
 <div className="col-start-4 row-start-5 bg-black"></div>
 <div className="col-start-5 row-start-5 bg-black opacity-0"></div>
 </div>
 
 <p className="text-[11px] text-gray-600 mb-1">Mã tra cứu</p>
 <h4 className="text-xl font-bold tracking-widest text-gray-900 mb-1">{booking?.bookingId ? booking.bookingId.slice(0, 8).toUpperCase() :'—'}</h4>
 <p className="text-[10px] text-gray-600">Tra cứu tại: https://meinvoice.vn/tra-cuu/</p>
 </div>

 <div className="w-full border-t border-gray-800 mb-4"></div>

 {/* Footer Text */}
 <div className="text-center text-[9px] text-gray-700 italic font-medium leading-relaxed mb-6">
 <p className="font-bold">Phát hành bởi phần mềm HĐĐT MISA meInvoice</p>
 <p>Công ty Cổ phần MISA - MST: 0101243150</p>
 </div>
 
 <div className="text-center font-bold text-blue-900 tracking-wider">
 VE.GT.KT.K58.01
 </div>
 
 </motion.div>

 {/* Action Buttons */}
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.2, duration: 0.5 }}
 className="w-full grid grid-cols-2 gap-3 mt-6"
 >
 <Link to="/" className="flex items-center justify-center gap-2 h-12 bg-white/5 border border-white/15 font-semibold text-[#f0ede6] hover:bg-white/10 transition-colors">
 <Home className="w-4 h-4" /> Về trang chủ
 </Link>
 <button className="flex items-center justify-center gap-2 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md transition-colors">
 <Download className="w-4 h-4" /> Tải vé PDF
 </button>
 </motion.div>

 <motion.button
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ delay: 0.4 }}
 className="mt-6 flex items-center gap-2 text-[rgba(240,237,230,0.5)] hover:text-emerald-400 transition-colors text-sm font-medium"
 >
 <Share2 className="w-4 h-4" /> Chia sẻ hóa đơn vé
 </motion.button>
 
 </div>
 </div>
 );
}
