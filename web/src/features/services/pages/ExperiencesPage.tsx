import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bus, Hotel, MapPinned, Map, Truck, Car, ArrowRight } from 'lucide-react';

// "Trải nghiệm" (Experiences) has no dedicated data model of its own — it's a
// curated hub linking out to the real services An Chuyến already offers
// (trip search, tours, hotels, destinations, delivery, rental), rather than a
// duplicate listing of any one of them.
const EXPERIENCES = [
  { icon: Bus, title: 'Đặt vé xe khách', desc: 'Tìm và đặt vé xe khách liên tỉnh chỉ trong vài phút.', to: '/search' },
  { icon: Map, title: 'Tours trọn gói', desc: 'Lịch trình dựng sẵn, xe đưa đón tận nơi.', to: '/tours' },
  { icon: Hotel, title: 'Khách sạn', desc: 'Chỗ nghỉ được chọn lọc dọc các tuyến xe chạy qua.', to: '/hotels' },
  { icon: MapPinned, title: 'Điểm đến nổi bật', desc: 'Khám phá các điểm đến được khách hàng yêu thích nhất.', to: '/destinations' },
  { icon: Truck, title: 'Giao hàng liên tỉnh', desc: 'Gửi hàng đi xa, theo dõi hành trình real-time.', to: '/delivery' },
  { icon: Car, title: 'Thuê xe tự lái', desc: 'Xe tự lái đủ loại, nhận xe tận nơi.', to: '/rental' },
];

export function ExperiencesPage() {
  return (
    <div className="pt-28 min-h-screen bg-[#fcfcfc] pb-20 font-sans text-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="text-[11px] font-bold tracking-[0.3em] uppercase text-primary mb-3">An Chuyến</div>
          <h1 className="text-3xl md:text-4xl font-bold">Trải nghiệm</h1>
          <p className="text-gray-500 mt-2 max-w-xl mx-auto">Mọi thứ bạn cần cho một chuyến đi trọn vẹn, gói gọn trong một nền tảng.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXPERIENCES.map((item, i) => (
            <motion.div key={item.to} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Link to={item.to} className="group flex flex-col h-full p-6 rounded-2xl border border-black/5 shadow-sm bg-white hover:border-primary/40 hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-1.5">{item.title}</h3>
                <p className="text-sm text-gray-500 flex-1">{item.desc}</p>
                <div className="flex items-center gap-1.5 text-sm font-bold text-primary mt-4 group-hover:gap-2.5 transition-all">
                  Khám phá <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
