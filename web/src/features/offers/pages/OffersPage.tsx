import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Share2, Gift, Ticket, Copy, Check, ArrowRight } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../lib/api';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface Promotion {
  id: string;
  code: string;
  title: string;
  subtitle: string | null;
  discountPct: number;
  maxDiscount: number | null;
  validUntil: string;
}

const getStaticPromos = (t: any) => [
  {
    id: 'demo1', code: 'SAPA50K', title: t('offers.promo1Title'), discountPct: 0,
    subtitle: t('offers.promo1Desc'),
    validUntil: '2026-11-30',
    img: 'https://images.unsplash.com/photo-1570125909232-eb263c188f78?q=80&w=800&auto=format&fit=crop',
    badge: t('offers.promo1Badge'),
    accent: '#d4af37',
    tag: 'KINH NGHIỆM',
  },
  {
    id: 'demo2', code: 'VNPAY10', title: t('offers.promo2Title'), discountPct: 10,
    subtitle: t('offers.promo2Desc'),
    validUntil: '2026-12-15',
    img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop',
    badge: null,
    accent: '#d4af37',
    tag: 'THANH TOÁN',
  },
  {
    id: 'demo3', code: 'VIP20', title: t('offers.promo3Title'), discountPct: 20,
    subtitle: t('offers.promo3Desc'),
    validUntil: '2026-12-31',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop',
    badge: 'VIP',
    accent: '#d4af37',
    tag: 'THÀNH VIÊN',
  },
];

const FILTER_KEYS = ['filterAll', 'filterNew', 'filterLoyal', 'filterPayment'];

function PromoCard({ promo, onApply, index }: { promo: any; onApply: (code: string) => void; index: number }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onApply(promo.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        transition: 'border-color 0.3s',
        cursor: 'pointer',
      }}
      whileHover={{ borderColor: 'rgba(212,175,55,0.35)' }}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', flexShrink: 0 }}>
        {promo.img ? (
          <img src={promo.img} alt={promo.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6) saturate(0.75)', transition: 'transform 0.6s ease' }}
            className="group-hover:scale-105"
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'rgba(212,175,55,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Gift size={40} style={{ color: 'rgba(212,175,55,0.4)' }} />
          </div>
        )}
        {/* Gradient */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,17,17,0.75) 0%, transparent 60%)' }} />

        {/* Tag */}
        <div style={{ position: 'absolute', top: 14, left: 14, fontSize: 8, fontWeight: 700, letterSpacing: '0.25em', color: '#d4af37', fontFamily: 'system-ui' }}>
          {promo.tag}
        </div>

        {/* Discount pill */}
        {promo.discountPct > 0 && (
          <div style={{
            position: 'absolute', top: 10, right: 10,
            background: '#d4af37', color: '#0e1111',
            fontSize: 10, fontWeight: 900, padding: '4px 10px',
            fontFamily: 'system-ui', letterSpacing: '0.05em',
          }}>
            -{promo.discountPct}%
          </div>
        )}
        {promo.badge && !promo.discountPct && (
          <div style={{
            position: 'absolute', top: 10, right: 10,
            background: '#d4af37', color: '#0e1111',
            fontSize: 9, fontWeight: 900, padding: '4px 10px',
            fontFamily: 'system-ui', letterSpacing: '0.15em',
          }}>
            {promo.badge}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '24px 24px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Title */}
        <h3 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: '1.4rem', fontWeight: 500,
          color: '#f0ede6', lineHeight: 1.25, margin: 0,
        }}>
          {promo.title}
        </h3>

        <p style={{ fontSize: 13, color: 'rgba(240,237,230,0.5)', lineHeight: 1.7, margin: 0, flex: 1, fontFamily: 'system-ui' }}>
          {promo.subtitle}
        </p>

        {/* Code row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 0,
          border: '1px solid rgba(212,175,55,0.2)',
          marginTop: 4,
        }}>
          <div style={{
            flex: 1, padding: '9px 14px',
            fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', fontFamily: 'monospace',
            color: '#d4af37', background: 'rgba(212,175,55,0.05)',
          }}>
            {promo.code}
          </div>
          <button
            onClick={handleCopy}
            style={{
              padding: '9px 16px', background: copied ? 'rgba(212,175,55,0.15)' : 'transparent',
              border: 'none', borderLeft: '1px solid rgba(212,175,55,0.2)',
              color: '#d4af37', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0,
            }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </button>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'rgba(240,237,230,0.3)', fontFamily: 'system-ui' }}>
            <Clock size={10} /> HSD: {new Date(promo.validUntil).toLocaleDateString('vi-VN')}
          </div>
          <button
            onClick={handleCopy}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
              color: '#d4af37', fontFamily: 'system-ui',
            }}
          >
            Dùng ngay <ArrowRight size={10} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function OffersPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const FILTERS = FILTER_KEYS.map(k => ({ key: k, label: t(`offers.${k}`) }));
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [activeFilter, setActiveFilter] = useState(FILTER_KEYS[0]);

  useEffect(() => {
    api.get('/promotions')
      .then(res => setPromotions(res.data ?? []))
      .catch(() => {});
  }, []);

  const handleApply = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(t('offers.applySuccess').replace('{code}', code));
  };

  const allPromos = [
    ...getStaticPromos(t),
    ...promotions.map(p => ({
      ...p, img: null as string | null, badge: null as string | null,
      accent: '#d4af37', tag: 'ƯU ĐÃI',
    })),
  ];

  return (
    <div style={{ background: '#0e1111', color: '#f0ede6', minHeight: '100vh' }}>

      {/* ─── HERO ─── */}
      <section style={{ position: 'relative', height: '55vh', overflow: 'hidden', minHeight: 360 }}>
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1600&auto=format&fit=crop"
          alt="hero"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.25) saturate(0.6)' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0e1111 0%, rgba(14,17,17,0.2) 60%, transparent 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(14,17,17,0.7) 0%, transparent 65%)' }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 8% 64px' }}>
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            {/* Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 28, height: 1, background: '#d4af37' }} />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#d4af37', fontFamily: 'system-ui' }}>
                {t('offers.subtitle')}
              </span>
            </div>

            <h1
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(2.4rem, 4.5vw, 5rem)',
                fontWeight: 400, lineHeight: 1.1,
                color: '#f0ede6', margin: '0 0 16px',
                maxWidth: 700,
              }}
              dangerouslySetInnerHTML={{ __html: t('offers.title').replace('<em>', '<em style="color:#d4af37;font-style:italic">') }}
            />

            <p style={{ fontSize: 14, color: 'rgba(240,237,230,0.5)', lineHeight: 1.7, maxWidth: 440, margin: 0, fontFamily: 'system-ui' }}>
              {t('offers.desc')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── FILTER TABS ─── */}
      <section style={{ padding: '0 8%', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', gap: 0, overflowX: 'auto' }}>
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '20px 28px',
                fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                fontFamily: 'system-ui', whiteSpace: 'nowrap',
                color: activeFilter === key ? '#d4af37' : 'rgba(240,237,230,0.35)',
                borderBottom: activeFilter === key ? '2px solid #d4af37' : '2px solid transparent',
                transition: 'all 0.25s',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* ─── PROMO GRID ─── */}
      <section style={{ padding: '64px 8% 80px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Featured large card + 2 stacked */}
            {allPromos.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 24, marginBottom: 24 }}>
                {allPromos.slice(0, 3).map((promo, idx) => (
                  <PromoCard key={promo.id} promo={promo} onApply={handleApply} index={idx} />
                ))}
              </div>
            )}

            {/* Extra promos */}
            {allPromos.length > 3 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                {allPromos.slice(3).map((promo, idx) => (
                  <PromoCard key={promo.id} promo={promo} onApply={handleApply} index={idx + 3} />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ─── GOLD DIVIDER ─── */}
      <div style={{ margin: '0 8%', height: 1, background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)' }} />

      {/* ─── REFERRAL SECTION ─── */}
      <section style={{ padding: '80px 8% 100px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64,
          alignItems: 'center',
        }}>
          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 24, height: 1, background: '#d4af37' }} />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#d4af37', fontFamily: 'system-ui' }}>
                Giới thiệu bạn bè
              </span>
            </div>

            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(2rem, 3.5vw, 3.5rem)',
                fontWeight: 400, color: '#f0ede6', lineHeight: 1.2, margin: '0 0 20px',
              }}
              dangerouslySetInnerHTML={{ __html: t('offers.referralTitle').replace('<em>', '<em style="color:#d4af37;font-style:italic">') }}
            />

            <p style={{ fontSize: 15, color: 'rgba(240,237,230,0.55)', lineHeight: 1.8, margin: '0 0 36px', maxWidth: 440, fontFamily: 'system-ui' }}>
              {t('offers.referralDesc')}
            </p>

            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: '#d4af37', color: '#0e1111',
              border: 'none', padding: '14px 32px', cursor: 'pointer',
              fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
              fontFamily: 'system-ui',
            }}>
              <Share2 size={13} /> {t('offers.referralButton')}
            </button>
          </motion.div>

          {/* Right: visual */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', height: 280 }}
          >
            {/* Decorative orb */}
            <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />

            {/* Card 1 */}
            <div style={{
              position: 'absolute', top: '20%', left: '15%',
              width: 150, padding: '20px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(212,175,55,0.2)',
              transform: 'rotate(-6deg)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
            }}>
              <div style={{ width: 44, height: 44, background: 'rgba(212,175,55,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Gift size={22} style={{ color: '#d4af37' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#d4af37', fontFamily: "'Cormorant Garamond', serif" }}>30K</div>
                <div style={{ fontSize: 9, color: 'rgba(240,237,230,0.4)', fontFamily: 'system-ui', letterSpacing: '0.1em' }}>VOUCHER</div>
              </div>
            </div>

            {/* Card 2 */}
            <div style={{
              position: 'absolute', bottom: '15%', right: '12%',
              width: 150, padding: '20px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(212,175,55,0.15)',
              transform: 'rotate(5deg)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
            }}>
              <div style={{ width: 44, height: 44, background: 'rgba(212,175,55,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Ticket size={22} style={{ color: '#d4af37' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#f0ede6', fontFamily: 'system-ui', letterSpacing: '0.1em' }}>AN CHUYẾN</div>
                <div style={{ fontSize: 9, color: 'rgba(240,237,230,0.4)', fontFamily: 'system-ui', letterSpacing: '0.1em', marginTop: 4 }}>MEMBER PASS</div>
              </div>
            </div>

            {/* Gold rule */}
            <div style={{ position: 'absolute', width: 1, height: '60%', background: 'linear-gradient(to bottom, transparent, rgba(212,175,55,0.4), transparent)', top: '20%', left: '50%' }} />
          </motion.div>
        </div>
      </section>

    </div>
  );
}
