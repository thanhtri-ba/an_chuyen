import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star } from 'lucide-react';
import { fetchHotels, type Hotel } from '../hotels-data';

export function HotelsPage() {
  const [items, setItems] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotels().then(d => { setItems(d); setLoading(false); });
  }, []);

  return (
    <div className="pt-28 min-h-screen bg-[#fcfcfc] pb-20 font-sans text-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="text-[11px] font-bold tracking-[0.3em] uppercase text-primary mb-3">An Chuyến</div>
          <h1 className="text-3xl md:text-4xl font-bold">Khách sạn</h1>
          <p className="text-gray-500 mt-2 max-w-xl mx-auto">Chỗ nghỉ được chọn lọc dọc các tuyến xe An Chuyến chạy qua.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-80 rounded-2xl bg-black/5 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((h, i) => (
              <motion.div key={h.slug} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="rounded-2xl overflow-hidden border border-black/5 shadow-sm bg-white group">
                <div className="relative h-48 overflow-hidden">
                  <img src={h.imageUrl} alt={h.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  {h.discount && (
                    <span className="absolute top-3 left-3 bg-primary text-[#1a1a1a] text-xs font-bold px-2.5 py-1 rounded-full">{h.discount}</span>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1"><MapPin className="w-3 h-3" /> {h.location}, {h.country}</div>
                  <h3 className="text-lg font-bold mb-1">{h.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{h.desc}</p>
                  <div className="flex items-center justify-between border-t border-black/5 pt-3">
                    <div className="flex items-center gap-1 text-sm font-bold"><Star className="w-3.5 h-3.5 fill-primary text-primary" /> {h.rating} <span className="text-gray-400 font-normal">({h.reviewCount})</span></div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">Từ</div>
                      <div className="text-base font-bold text-primary">{new Intl.NumberFormat('vi-VN').format(h.priceFrom)}đ</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="text-center text-gray-400 py-20">Chưa có khách sạn nào, quay lại sau nhé.</div>
        )}
      </div>
    </div>
  );
}
