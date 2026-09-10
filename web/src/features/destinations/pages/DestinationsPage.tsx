import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star } from 'lucide-react';
import { fetchDestinations, type DestinationDetail } from '../data';

export function DestinationsPage() {
  const [items, setItems] = useState<DestinationDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDestinations().then(d => { setItems(d); setLoading(false); });
  }, []);

  return (
    <div className="pt-28 min-h-screen bg-[#fcfcfc] pb-20 font-sans text-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="text-[11px] font-bold tracking-[0.3em] uppercase text-primary mb-3">An Chuyến</div>
          <h1 className="text-3xl md:text-4xl font-bold">Điểm đến</h1>
          <p className="text-gray-500 mt-2 max-w-xl mx-auto">Những điểm đến được khách hàng An Chuyến chọn nhiều nhất, từ cao nguyên đến biển đảo.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-72 rounded-2xl bg-black/5 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((d, i) => (
              <motion.div key={d.slug} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link to={`/destinations/${d.slug}`} className="group block relative rounded-2xl overflow-hidden h-72 border border-black/5 shadow-sm">
                  <img src={d.heroImg} alt={d.location} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-bold text-[#1a1a1a]">
                    <Star className="w-3 h-3 fill-primary text-primary" /> {d.rating}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <div className="flex items-center gap-1.5 text-xs text-white/80 mb-1"><MapPin className="w-3 h-3" /> {d.country}</div>
                    <div className="text-xl font-bold">{d.location}</div>
                    <div className="text-sm text-white/80 mt-1">Từ {new Intl.NumberFormat('vi-VN').format(d.priceFrom)}đ</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
