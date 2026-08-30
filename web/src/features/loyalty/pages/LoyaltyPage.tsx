import { motion } from 'framer-motion';
import { Crown, Gift, Sparkles, History, Ticket as TicketIcon } from 'lucide-react';
import { useState } from 'react';

export function LoyaltyPage() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#1a1a1a] font-sans pb-32">
      <div className="px-6 lg:px-12 max-w-[1200px] mx-auto pt-40">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-[#d4af37] mb-4">
              An Chuyến
            </div>
            <h1 className="font-display font-medium text-5xl md:text-6xl text-[#1a1a1a] m-0">
              Thành viên An Chuyến
            </h1>
            <p className="text-gray-500 font-medium mt-4 text-lg">
              Khám phá đặc quyền dành riêng cho bạn
            </p>
          </div>
          <button className="flex items-center gap-3 px-6 py-3.5 bg-white border border-gray-200 text-gray-700 rounded-full font-bold text-xs tracking-widest uppercase hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm shrink-0">
            <History className="w-4 h-4" /> Lịch sử điểm
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* Card 3D Flip */}
          <div
            className="relative w-full aspect-[1.6/1] cursor-pointer"
            style={{ perspective: 1500 }}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <motion.div
              className="w-full h-full relative"
              style={{ transformStyle: 'preserve-3d' }}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: 'spring', stiffness: 200, damping: 20 }}
            >
              {/* Front Side - Gold Tier */}
              <div 
                className="absolute inset-0 flex flex-col justify-between rounded-3xl p-8 overflow-hidden shadow-xl"
                style={{ backfaceVisibility: 'hidden', background: 'linear-gradient(135deg, #ffffff 0%, #fcfcfc 100%)', border: '1px solid rgba(212,175,55,0.3)' }}
              >
                {/* Gold accent glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-3xl translate-x-1/4 -translate-y-1/2" />
                
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <div className="text-[9px] font-bold tracking-widest uppercase text-gray-500 mb-2">
                      Thẻ Thành Viên
                    </div>
                    <div className="text-3xl font-display font-medium text-[#d4af37] flex items-center gap-3">
                      <Crown className="w-8 h-8" /> GOLD
                    </div>
                  </div>
                  <span className="font-serif italic text-3xl text-[#1a1a1a]/20 font-bold">
                    An Chuyến
                  </span>
                </div>
                
                <div className="relative z-10">
                  <div className="text-sm font-medium text-gray-600 mb-2">Nguyễn Văn A</div>
                  <div className="text-xl font-mono font-bold tracking-widest text-[#1a1a1a]">
                    **** **** **** 8888
                  </div>
                </div>
              </div>

              {/* Back Side */}
              <div 
                className="absolute inset-0 flex flex-col justify-center items-center text-center rounded-3xl p-8 shadow-xl"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: '#1a1a1a' }}
              >
                <div className="w-[120%] -ml-[10%] h-14 bg-black/50 mb-8" />
                <div className="bg-white text-[#1a1a1a] p-4 mb-6 w-[80%] text-left font-mono font-bold rounded-lg flex justify-end">
                  CVC: 123
                </div>
                <p className="text-xs text-gray-400 font-medium">
                  Thẻ điện tử này được phát hành bởi An Chuyến.<br/> Hotline: 1900 1234
                </p>
              </div>
            </motion.div>
          </div>

          {/* Progress & Stats */}
          <div className="bg-white border border-gray-100 rounded-[2rem] p-10 h-full flex flex-col justify-center shadow-sm">
            <div className="flex items-center gap-5 mb-10">
              <div className="w-16 h-16 rounded-full bg-[#d4af37]/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-7 h-7 text-[#d4af37]" />
              </div>
              <div>
                <div className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">Điểm hiện tại</div>
                <div className="font-display font-medium text-5xl text-[#1a1a1a]">
                  2,450 <span className="text-base font-bold text-[#d4af37] font-sans uppercase tracking-widest">Pts</span>
                </div>
              </div>
            </div>

            <div className="mb-4 flex justify-between text-[11px] font-bold tracking-widest uppercase">
              <span className="text-[#d4af37]">Gold</span>
              <span className="text-gray-400">Diamond</span>
            </div>
            
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-6">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: '65%' }} 
                className="h-full bg-gradient-to-r from-[#d4af37] to-[#f0c94a] rounded-full"
              />
            </div>
            
            <p className="text-sm font-medium text-gray-500 m-0">
              Bạn cần thêm <strong className="text-[#1a1a1a] font-bold">550 điểm</strong> để thăng hạng Diamond.
            </p>
          </div>
        </div>

        {/* Rewards Section */}
        <h2 className="font-display font-medium text-3xl md:text-4xl text-[#1a1a1a] mt-24 mb-10 flex items-center gap-4 border-b border-gray-100 pb-8">
          <Gift className="w-8 h-8 text-[#d4af37]" /> Đổi điểm nhận quà
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Voucher 50K', pts: '500 Pts', desc: 'Áp dụng cho mọi chuyến đi' },
            { title: 'Miễn phí nâng hạng', pts: '1,500 Pts', desc: 'Nâng hạng ghế Limousine' },
            { title: 'Voucher 200K', pts: '2,000 Pts', desc: 'Áp dụng khi đặt phòng' },
          ].map((item, idx) => (
            <div key={idx} className="group bg-white border border-gray-100 rounded-[2rem] p-8 cursor-pointer hover:border-primary hover:shadow-md transition-all shadow-sm">
              <div className="w-16 h-16 bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] mb-6 rounded-2xl group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                <TicketIcon className="w-7 h-7" />
              </div>
              <h3 className="font-display font-medium text-2xl text-[#1a1a1a] mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 font-medium mb-6">{item.desc}</p>
              
              <div className="flex items-center justify-between border-t border-gray-50 pt-6">
                <span className="font-bold text-[#d4af37]">{item.pts}</span>
                <button className="text-[10px] font-bold tracking-widest uppercase text-primary bg-primary/5 px-4 py-2 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                  Đổi ngay
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
