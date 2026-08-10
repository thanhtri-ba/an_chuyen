import { motion } from'framer-motion';
import { Crown, Gift, Sparkles, ChevronRight, History } from'lucide-react';
import { Button } from'../../../design-system/components/Button';
import { Card } from'../../../design-system/components/Card';
import { useState } from'react';

export function LoyaltyPage() {
 const [isFlipped, setIsFlipped] = useState(false);

 return (
 <div className="bg-gray-50 min-h-screen pt-24 pb-20">
 <div className="container px-4 lg:px-8 max-w-5xl mx-auto">
 
 {/* Header */}
 <div className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
 <div>
 <h1 className="text-3xl font-black text-gray-900 mb-2">Thành viên An Chuyến</h1>
 <p className="text-gray-500 font-medium">Khám phá đặc quyền dành riêng cho bạn</p>
 </div>
 <Button variant="outline" className=" gap-2 font-bold shadow-sm border-gray-200 text-gray-700 bg-white hover:bg-gray-50">
 <History className="w-4 h-4" /> Lịch sử điểm
 </Button>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
 
 {/* Card 3D Flip */}
 <div 
 className="relative w-full aspect-[1.6/1] cursor-pointer perspective-1000"
 onClick={() => setIsFlipped(!isFlipped)}
 >
 <motion.div 
 className="w-full h-full relative preserve-3d"
 animate={{ rotateY: isFlipped ? 180 : 0 }}
 transition={{ duration: 0.6, type:'spring', stiffness: 200, damping: 20 }}
 >
 {/* Front Side - Gold Tier */}
 <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600 ] p-8 text-white shadow-xl overflow-hidden flex flex-col justify-between">
 <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
 <div className="relative z-10 flex justify-between items-start">
 <div>
 <div className="text-white/80 font-bold uppercase tracking-widest text-xs mb-1">Thẻ Thành Viên</div>
 <div className="text-3xl font-black flex items-center gap-2"><Crown className="w-8 h-8" /> GOLD</div>
 </div>
 <img src="/vite.svg" alt="Logo" className="w-10 h-10 brightness-0 invert opacity-50" />
 </div>
 <div className="relative z-10">
 <div className="text-sm text-white/80 font-medium mb-1">Nguyễn Văn A</div>
 <div className="text-xl font-bold tracking-[0.2em] font-mono">**** **** **** 8888</div>
 </div>
 </div>

 {/* Back Side */}
 <div className="absolute inset-0 backface-hidden bg-gray-900 ] p-8 text-white shadow-xl rotate-y-180 flex flex-col justify-center items-center text-center">
 <div className="w-full h-12 bg-gray-800 mb-6 w-[120%] -ml-10"></div>
 <div className="bg-white text-black p-3 mb-4 w-4/5 text-left font-mono font-bold">CVC: 123</div>
 <p className="text-xs text-gray-400">Thẻ điện tử này được phát hành bởi An Chuyến. Hotline: 1900 1234</p>
 </div>
 </motion.div>
 </div>

 {/* Progress & Stats */}
 <Card className="p-6 md:p-8 ] shadow-sm border-gray-100 bg-white h-full flex flex-col justify-center">
 <div className="flex items-center gap-3 mb-6">
 <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
 <Sparkles className="w-6 h-6" />
 </div>
 <div>
 <div className="text-sm text-gray-500 font-bold">Điểm hiện tại</div>
 <div className="text-3xl font-black text-gray-900">2,450 <span className="text-sm font-bold text-yellow-500">Pts</span></div>
 </div>
 </div>

 <div className="mb-2 flex justify-between text-sm font-bold">
 <span className="text-yellow-600">Gold</span>
 <span className="text-gray-400">Diamond</span>
 </div>
 <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
 <motion.div initial={{ width: 0 }} animate={{ width:'65%' }} className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"></motion.div>
 </div>
 <p className="text-sm text-gray-500 font-medium">Bạn cần thêm <strong>550 điểm</strong> để thăng hạng Diamond.</p>
 </Card>
 </div>

 {/* Rewards Section */}
 <h2 className="text-2xl font-black text-gray-900 mt-16 mb-8 flex items-center gap-3">
 <Gift className="w-6 h-6 text-primary" /> Đổi điểm nhận quà
 </h2>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 {[1, 2, 3].map((item) => (
 <Card key={item} className="p-6 bg-white shadow-sm border-gray-100 hover:shadow-lg transition-all cursor-pointer group">
 <div className="w-16 h-16 bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
 <Ticket className="w-8 h-8" />
 </div>
 <h3 className="font-bold text-gray-900 text-lg mb-1">Voucher giảm 50.000đ</h3>
 <p className="text-sm text-gray-500 mb-6 font-medium">Áp dụng cho mọi chuyến xe</p>
 <div className="flex items-center justify-between">
 <span className="font-black text-primary">500 Pts</span>
 <Button className="rounded-full px-6 font-bold">Đổi ngay</Button>
 </div>
 </Card>
 ))}
 </div>
 </div>
 </div>
 );
}

// Temporary icon since we didn't import Ticket at the top
function Ticket(props: any) {
 return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>;
}
