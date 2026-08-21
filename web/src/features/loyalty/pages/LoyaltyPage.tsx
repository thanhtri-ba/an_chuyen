import { motion } from 'framer-motion';
import { Crown, Gift, Sparkles, History } from 'lucide-react';
import { useState } from 'react';

export function LoyaltyPage() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div style={{ background: '#0e1111', color: '#f0ede6', minHeight: '100vh', paddingTop: 100, paddingBottom: 80, fontFamily: 'system-ui' }}>
      <div style={{ padding: '0 8%', maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 40, display: 'flex', flexDirection: 'column', gap: 24 }} className="md:flex-row md:items-center justify-between">
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#d4af37', marginBottom: 10 }}>An Chuyến</div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, margin: 0, color: '#f0ede6' }}>Thành viên An Chuyến</h1>
            <p style={{ color: 'rgba(240,237,230,0.45)', marginTop: 8 }}>Khám phá đặc quyền dành riêng cho bạn</p>
          </div>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', fontWeight: 700, fontSize: 13,
            background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(240,237,230,0.8)',
            borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0,
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(240,237,230,0.8)'; }}
          >
            <History style={{ width: 16, height: 16 }} /> Lịch sử điểm
          </button>
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
              transition={{ duration: 0.6, type: 'spring', stiffness: 200, damping: 20 }}
            >
              {/* Front Side - Gold Tier */}
              <div className="absolute inset-0 backface-hidden flex flex-col justify-between" style={{ borderRadius: 16, padding: 32, color: '#0e1111', overflow: 'hidden', background: 'linear-gradient(135deg,#d4af37,#f0c94a)' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: 256, height: 256, background: 'rgba(255,255,255,0.15)', borderRadius: '50%', filter: 'blur(48px)', transform: 'translate(25%,-50%)' }} />
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ opacity: 0.7, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: 11, marginBottom: 4 }}>Thẻ Thành Viên</div>
                    <div style={{ fontSize: 28, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}><Crown style={{ width: 30, height: 30 }} /> GOLD</div>
                  </div>
                  <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 22, opacity: 0.6 }}>An Chuyến</span>
                </div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: 13, opacity: 0.8, fontWeight: 500, marginBottom: 4 }}>Nguyễn Văn A</div>
                  <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '0.2em', fontFamily: 'monospace' }}>**** **** **** 8888</div>
                </div>
              </div>

              {/* Back Side */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col justify-center items-center text-center" style={{ borderRadius: 16, padding: 32, color: '#f0ede6', background: '#0e1111', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ width: '120%', marginLeft: '-10%', height: 48, background: 'rgba(255,255,255,0.08)', marginBottom: 24 }}></div>
                <div style={{ background: '#f0ede6', color: '#0e1111', padding: 12, marginBottom: 16, width: '80%', textAlign: 'left', fontFamily: 'monospace', fontWeight: 700, borderRadius: 4 }}>CVC: 123</div>
                <p style={{ fontSize: 12, color: 'rgba(240,237,230,0.4)' }}>Thẻ điện tử này được phát hành bởi An Chuyến. Hotline: 1900 1234</p>
              </div>
            </motion.div>
          </div>

          {/* Progress & Stats */}
          <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 32, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(212,175,55,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles style={{ width: 24, height: 24, color: '#d4af37' }} />
              </div>
              <div>
                <div style={{ fontSize: 13, color: 'rgba(240,237,230,0.5)', fontWeight: 700 }}>Điểm hiện tại</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#f0ede6' }}>2,450 <span style={{ fontSize: 13, fontWeight: 700, color: '#d4af37' }}>Pts</span></div>
              </div>
            </div>

            <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700 }}>
              <span style={{ color: '#d4af37' }}>Gold</span>
              <span style={{ color: 'rgba(240,237,230,0.35)' }}>Diamond</span>
            </div>
            <div style={{ height: 10, background: 'rgba(255,255,255,0.08)', borderRadius: 100, overflow: 'hidden', marginBottom: 12 }}>
              <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} style={{ height: '100%', background: 'linear-gradient(90deg,#d4af37,#f0c94a)', borderRadius: 100 }}></motion.div>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(240,237,230,0.5)' }}>Bạn cần thêm <strong style={{ color: 'rgba(240,237,230,0.8)' }}>550 điểm</strong> để thăng hạng Diamond.</p>
          </div>
        </div>

        {/* Rewards Section */}
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.5rem,2.5vw,2rem)', fontWeight: 400, color: '#f0ede6', marginTop: 64, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Gift style={{ width: 24, height: 24, color: '#d4af37' }} /> Đổi điểm nhận quà
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="group" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 24, cursor: 'pointer', transition: 'border-color 0.3s' }}>
              <div className="group-hover:scale-110" style={{ width: 56, height: 56, background: 'rgba(212,175,55,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af37', marginBottom: 16, borderRadius: 12, transition: 'transform 0.2s' }}>
                <TicketIcon style={{ width: 28, height: 28 }} />
              </div>
              <h3 style={{ fontWeight: 700, color: '#f0ede6', fontSize: 17, marginBottom: 4 }}>Voucher giảm 50.000đ</h3>
              <p style={{ fontSize: 13, color: 'rgba(240,237,230,0.4)', marginBottom: 24 }}>Áp dụng cho mọi chuyến xe</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 800, color: '#d4af37' }}>500 Pts</span>
                <button style={{ borderRadius: 100, padding: '10px 24px', fontWeight: 700, fontSize: 13, background: 'linear-gradient(135deg,#d4af37,#f0c94a)', color: '#0e1111', border: 'none', cursor: 'pointer' }}>Đổi ngay</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TicketIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>;
}
