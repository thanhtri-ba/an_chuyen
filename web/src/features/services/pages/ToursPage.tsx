import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { fetchTours, type Tour } from '../tours-data';

const CATEGORY_LABEL: Record<Tour['category'], string> = {
  beach: 'Biển đảo',
  mountain: 'Núi rừng',
  cultural: 'Văn hoá',
  adventure: 'Mạo hiểm',
};

export function ToursPage() {
  const [items, setItems] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTours().then(d => { setItems(d); setLoading(false); });
  }, []);

  return (
    <div className="pt-28 min-h-screen bg-[#fcfcfc] pb-20 font-sans text-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="text-[11px] font-bold tracking-[0.3em] uppercase text-primary mb-3">An Chuyến</div>
          <h1 className="text-3xl md:text-4xl font-bold">Tours trọn gói</h1>
          <p className="text-gray-500 mt-2 max-w-xl mx-auto">Lịch trình dựng sẵn, xe đưa đón tận nơi — chỉ cần xách vali lên đường.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-80 rounded-2xl bg-black/5 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((tour, i) => (
              <motion.div key={tour.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="rounded-2xl overflow-hidden border border-black/5 shadow-sm bg-white group">
                <div className="relative h-48 overflow-hidden">
                  <img src={tour.imageUrl ?? undefined} alt={tour.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-[#1a1a1a] text-xs font-bold px-2.5 py-1 rounded-full">{CATEGORY_LABEL[tour.category]}</span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-1 line-clamp-1">{tour.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{tour.description}</p>
                  <div className="flex items-center justify-between border-t border-black/5 pt-3">
                    <div className="flex items-center gap-1.5 text-sm text-gray-500"><Clock className="w-3.5 h-3.5" /> {tour.duration}</div>
                    <div className="text-base font-bold text-primary">{new Intl.NumberFormat('vi-VN').format(tour.price)}đ</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="text-center text-gray-400 py-20">Chưa có tour nào, quay lại sau nhé.</div>
        )}
      </div>
    </div>
  );
}
