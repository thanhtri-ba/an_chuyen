import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Truck, MapPinned, CheckCircle2 } from 'lucide-react';
import { PARTNERS } from '../partners-data';

export function PartnerDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const partner = PARTNERS.find((p) => p.slug === slug);

  if (!partner) return <Navigate to="/about" replace />;

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#1a1a1a] font-sans pb-32">
      <section className="relative pt-40 pb-16 px-6 lg:px-12 max-w-[1400px] mx-auto">
        <Link
          to="/about"
          className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-500 hover:text-primary transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" /> Về trang Đối tác
        </Link>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-[10px] font-bold tracking-widest uppercase text-[#d4af37] mb-4">{partner.role}</p>
          <h1 className="font-display font-medium text-5xl md:text-7xl leading-[0.95] mb-8">{partner.name}</h1>
          <blockquote className="font-display text-2xl md:text-3xl italic text-gray-600 max-w-3xl leading-snug">
            {partner.quote.replace(/^"|"$/g, '')}
          </blockquote>
        </motion.div>
      </section>

      <section className="px-6 lg:px-12 max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 mb-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="md:col-span-7"
        >
          <img
            src={partner.image}
            alt={partner.name}
            className="w-full h-[420px] md:h-[520px] object-cover rounded-[2rem] shadow-sm"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="md:col-span-5 flex flex-col justify-center gap-8"
        >
          <p className="text-base text-gray-600 leading-relaxed">{partner.bio}</p>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="font-display font-medium text-3xl text-[#d4af37]">{partner.stat}</div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mt-1">{partner.statLabel}</div>
            </div>
            <div>
              <div className="font-display font-medium text-3xl text-[#d4af37]">{partner.founded}</div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mt-1">Thành lập</div>
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-4 border-t border-black/5">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Truck className="w-4 h-4 text-primary shrink-0" /> {partner.fleetSize}
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <MapPinned className="w-4 h-4 text-primary shrink-0" /> {partner.coverage}
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-primary shrink-0" /> Đối tác chiến lược từ {partner.founded}
            </div>
          </div>
        </motion.div>
      </section>

      <section className="px-6 lg:px-12 max-w-[1400px] mx-auto mb-20">
        <h2 className="font-display font-medium text-3xl md:text-4xl mb-8">Điểm nổi bật</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {partner.highlights.map((h, i) => (
            <motion.div
              key={h}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl border border-black/5 bg-white p-6 flex items-start gap-3 shadow-sm"
            >
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm text-gray-600 leading-relaxed">{h}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-6 lg:px-12 max-w-[1400px] mx-auto">
        <h2 className="font-display font-medium text-3xl md:text-4xl mb-8">Đối tác khác</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {PARTNERS.filter((p) => p.slug !== partner.slug).map((p) => (
            <Link
              key={p.slug}
              to={`/about/${p.slug}`}
              className="group rounded-2xl overflow-hidden border border-black/5 bg-white shadow-sm flex items-center gap-4 p-4 hover:shadow-md transition-shadow"
            >
              <img src={p.image} alt={p.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
              <div>
                <div className="font-bold text-[#1a1a1a] group-hover:text-primary transition-colors">{p.name}</div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mt-1">{p.role}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
