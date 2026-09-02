import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Share2, Gift, Ticket, Copy, Check, ArrowRight } from 'lucide-react';
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
  logoPath: string | null;
}

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
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 flex flex-col group transition-all"
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden shrink-0">
        {promo.img ? (
          <img src={promo.img} alt={promo.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full bg-gray-50 flex items-center justify-center">
            <Gift className="w-10 h-10 text-gray-300" />
          </div>
        )}
        
        {/* Subtle gradient overlay to make text pop */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80" />

        {/* Tag */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest text-[#1a1a1a] shadow-sm uppercase">
          {promo.tag}
        </div>

        {/* Discount pill */}
        {promo.discountPct > 0 && (
          <div className="absolute top-4 right-4 bg-[#d4af37] text-white text-[11px] font-black px-2.5 py-1 rounded-md tracking-wider shadow-sm">
            -{promo.discountPct}%
          </div>
        )}
        {promo.badge && !promo.discountPct && (
          <div className="absolute top-4 right-4 bg-[#d4af37] text-white text-[11px] font-black px-2.5 py-1 rounded-md tracking-wider shadow-sm uppercase">
            {promo.badge}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col gap-4">
        <h3 className="font-display font-medium text-2xl text-[#1a1a1a] leading-tight m-0">
          {promo.title}
        </h3>

        <p className="text-sm text-gray-500 leading-relaxed flex-1 m-0">
          {promo.subtitle}
        </p>

        {/* Code row */}
        <div className="flex items-center mt-2 border border-gray-200 rounded-xl overflow-hidden bg-gray-50 group/code hover:border-primary transition-colors">
          <div className="flex-1 py-3 px-4 text-xs font-bold tracking-widest font-mono text-primary">
            {promo.code}
          </div>
          <button
            onClick={handleCopy}
            className={`py-3 px-4 border-l border-gray-200 text-primary cursor-pointer transition-colors shrink-0 flex items-center justify-center ${copied ? 'bg-primary/10' : 'bg-transparent hover:bg-gray-100'}`}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-50">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
            <Clock size={12} /> HSD: {new Date(promo.validUntil).toLocaleDateString('vi-VN')}
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-[11px] font-bold tracking-widest uppercase text-primary hover:text-primary-hover transition-colors"
          >
            Dùng ngay <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function OffersPage() {
  const { t } = useTranslation();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/promotions')
      .then(res => setPromotions(res.data ?? []))
      .catch(() => setPromotions([]))
      .finally(() => setLoading(false));
  }, []);

  const handleApply = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(t('offers.applySuccess').replace('{code}', code));
  };

  const allPromos = promotions.map(p => ({
    ...p, img: p.logoPath || null, badge: null as string | null,
    accent: '#d4af37', tag: 'ƯU ĐÃI',
  }));

  return (
    <div className="bg-[#fcfcfc] text-[#1a1a1a] min-h-screen font-sans">

      {/* ─── HERO ─── */}
      <section className="relative h-[55vh] min-h-[460px] overflow-hidden flex flex-col justify-end">
        <img
          src="https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2000&auto=format&fit=crop"
          alt="hero"
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.7] saturate-[0.8]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

        {/* Content */}
        <div className="relative z-10 px-6 lg:px-12 pb-20 max-w-[1400px] mx-auto w-full text-white">
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[2px] bg-[#d4af37]" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#d4af37]">
                {t('offers.subtitle')}
              </span>
            </div>

            <h1
              className="font-display font-medium text-5xl md:text-6xl lg:text-7xl leading-[1.1] mb-6 max-w-3xl"
              dangerouslySetInnerHTML={{ __html: t('offers.title').replace('<em>', '<em class="text-[#d4af37] font-serif italic">') }}
            />

            <p className="text-lg text-gray-200 leading-relaxed max-w-lg font-medium">
              {t('offers.desc')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── PROMO CARDS (real data from admin) ─── */}
      <section className="px-6 lg:px-12 py-16 max-w-[1400px] mx-auto">
        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Đang tải khuyến mãi...</div>
        ) : allPromos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allPromos.map((promo, idx) => (
              <PromoCard key={promo.id} promo={promo} onApply={handleApply} index={idx} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <Gift className="w-10 h-10 text-gray-300" />
            <p className="text-gray-400 text-sm">Hiện chưa có chương trình khuyến mãi nào. Quay lại sau nhé!</p>
          </div>
        )}
      </section>

      {/* ─── DIVIDER ─── */}
      <div className="max-w-[1400px] mx-auto px-12">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* ─── REFERRAL SECTION ─── */}
      <section className="px-6 lg:px-12 py-24 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[2px] bg-primary" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-primary">
                Mời bạn bè
              </span>
            </div>

            <h2
              className="font-display font-medium text-4xl md:text-5xl text-[#1a1a1a] leading-[1.1] mb-6"
              dangerouslySetInnerHTML={{ __html: t('offers.referralTitle').replace('<em>', '<em class="text-[#d4af37] font-serif italic">') }}
            />

            <p className="text-gray-500 text-lg leading-relaxed mb-10 max-w-md font-medium">
              {t('offers.referralDesc')}
            </p>

            <button className="inline-flex items-center gap-2.5 bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-full text-sm font-bold tracking-wide transition-colors shadow-sm">
              <Share2 size={16} /> {t('offers.referralButton')}
            </button>
          </motion.div>

          {/* Right: visual */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative h-[400px] flex items-center justify-center bg-gray-50 rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm"
          >
            {/* Decorative circles */}
            <div className="absolute w-[500px] h-[500px] rounded-full border border-gray-200 opacity-50" />
            <div className="absolute w-[350px] h-[350px] rounded-full border border-gray-200 opacity-50" />
            
            {/* Card 1 */}
            <div className="absolute top-1/4 left-[15%] w-40 p-6 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-gray-50 -rotate-6 flex flex-col items-center gap-4 z-10 transition-transform hover:rotate-0 hover:scale-105 duration-300">
              <div className="w-14 h-14 bg-primary/5 rounded-full flex items-center justify-center">
                <Gift size={24} className="text-primary" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-display font-medium text-primary">30K</div>
                <div className="text-[10px] text-gray-400 font-bold tracking-widest mt-1">VOUCHER</div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="absolute bottom-1/4 right-[15%] w-40 p-6 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-gray-50 rotate-6 flex flex-col items-center gap-4 z-10 transition-transform hover:rotate-0 hover:scale-105 duration-300">
              <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center">
                <Ticket size={24} className="text-orange-400" />
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-[#1a1a1a] tracking-wide">AN CHUYẾN</div>
                <div className="text-[10px] text-gray-400 font-bold tracking-widest mt-1">THẺ THÀNH VIÊN</div>
              </div>
            </div>

          </motion.div>
        </div>
      </section>

    </div>
  );
}
