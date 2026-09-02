import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, Search, Star, Wifi, Waves, UtensilsCrossed, Dumbbell, Heart } from 'lucide-react';
import type { Hotel } from '../hotels-data';
import { fetchHotels } from '../hotels-data';

const AMENITY_ICON: Record<string, typeof Wifi> = {
  wifi: Wifi,
  pool: Waves,
  restaurant: UtensilsCrossed,
  gym: Dumbbell,
};

export function HotelsPage() {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [hotels, setHotels] = useState<Hotel[]>([]);

  useEffect(() => {
    fetchHotels().then(setHotels);
  }, []);

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#1a1a1a] font-sans pb-24">

      {/* ===== HERO ===== */}
      <section className="relative h-[60vh] min-h-[440px] flex items-center px-6 lg:px-12 pt-20 bg-[#0d1710]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=2000"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          className="relative z-10 w-full mx-auto max-w-[1400px] text-white"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[2px] bg-[#d4af37]" />
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#d4af37]">Nghỉ dưỡng chọn lọc</span>
          </div>
          <h1 className="font-display font-medium text-5xl md:text-6xl lg:text-7xl leading-[1.1] mb-4 max-w-2xl">
            Nơi dừng chân <span className="text-[#d4af37] italic">xứng đáng</span>
          </h1>
          <p className="text-gray-200 text-lg max-w-md leading-relaxed font-medium">
            Khách sạn, resort và homestay được chọn lọc kỹ theo từng điểm đến trên hành trình của bạn.
          </p>
        </motion.div>
      </section>

      {/* ===== SEARCH PILL ===== */}
      <section className="relative z-20 px-6 lg:px-12 -mt-10 flex justify-center max-w-[1400px] mx-auto mb-16">
        <div className="bg-white rounded-3xl lg:rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.1)] p-2 flex flex-col md:flex-row items-center w-full max-w-4xl border border-gray-100">
          <div className="flex-1 flex items-center gap-3 px-6 py-3 w-full border-b md:border-b-0 md:border-r border-gray-100 group cursor-pointer hover:bg-gray-50/50 rounded-2xl md:rounded-l-full transition-colors">
            <MapPin className="text-gray-400 w-5 h-5 group-hover:text-primary transition-colors" />
            <div className="flex flex-col w-full">
              <label className="text-[11px] font-bold text-[#1a1a1a] mb-0.5">Điểm đến</label>
              <input type="text" placeholder="Bạn muốn nghỉ ở đâu?" className="text-sm border-none outline-none text-[#1a1a1a] font-medium placeholder:text-gray-400 w-full bg-transparent" />
            </div>
          </div>

          <div className="flex-1 flex items-center gap-3 px-6 py-3 w-full border-b md:border-b-0 md:border-r border-gray-100 group cursor-pointer hover:bg-gray-50/50 transition-colors">
            <Calendar className="text-gray-400 w-5 h-5 group-hover:text-primary transition-colors" />
            <div className="flex flex-col w-full">
              <label className="text-[11px] font-bold text-[#1a1a1a] mb-0.5">Nhận / Trả phòng</label>
              <div className="flex items-center gap-1">
                <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} className="text-sm border-none outline-none text-[#1a1a1a] font-medium w-full bg-transparent cursor-pointer" />
                <span className="text-gray-300">–</span>
                <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} className="text-sm border-none outline-none text-[#1a1a1a] font-medium w-full bg-transparent cursor-pointer" />
              </div>
            </div>
          </div>

          <div className="flex-1 flex items-center gap-3 px-6 py-3 w-full group cursor-pointer hover:bg-gray-50/50 transition-colors">
            <Users className="text-gray-400 w-5 h-5 group-hover:text-primary transition-colors" />
            <div className="flex flex-col w-full">
              <label className="text-[11px] font-bold text-[#1a1a1a] mb-0.5">Khách</label>
              <select value={guests} onChange={e => setGuests(Number(e.target.value))} className="text-sm border-none outline-none text-[#1a1a1a] font-medium w-full bg-transparent cursor-pointer appearance-none">
                {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} khách</option>)}
              </select>
            </div>
          </div>

          <button className="bg-primary hover:bg-primary-hover text-white rounded-full px-8 py-4 font-semibold flex items-center gap-2 m-2 md:m-0 shrink-0 w-full md:w-auto justify-center transition-colors">
            <Search size={18} /> Tìm phòng
          </button>
        </div>
      </section>

      {/* ===== HOTEL GRID ===== */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <h2 className="text-3xl font-display font-medium text-[#1a1a1a] mb-8">Được đặt nhiều nhất</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {hotels.map((hotel, idx) => (
            <motion.div
              key={hotel.slug}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              whileHover={{ y: -4 }}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all"
            >
              <div className="relative h-64 overflow-hidden">
                <img src={hotel.imageUrl} alt={hotel.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-[#1a1a1a] flex items-center gap-1.5 shadow-sm">
                  <Star size={12} className="text-secondary fill-secondary" /> {hotel.rating} <span className="text-gray-400 font-normal">({hotel.reviewCount})</span>
                </div>
                <button className="absolute top-4 right-4 w-9 h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm">
                  <Heart size={16} />
                </button>
              </div>

              <div className="p-6 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-[#1a1a1a] leading-tight">{hotel.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                      <MapPin size={12} /> {hotel.location}, {hotel.country}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-lg font-bold text-primary">{new Intl.NumberFormat('vi-VN').format(hotel.priceFrom)}đ</div>
                    <div className="text-[10px] text-gray-400">/ đêm</div>
                  </div>
                </div>

                <p className="text-sm text-gray-500 leading-relaxed">{hotel.desc}</p>

                <div className="flex items-center gap-2 pt-1">
                  {hotel.amenities.map(a => {
                    const Icon = AMENITY_ICON[a];
                    return (
                      <div key={a} className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500">
                        <Icon size={14} />
                      </div>
                    );
                  })}
                </div>

                <Link to={`/hotels/${hotel.slug}`} className="w-full mt-2 text-center bg-white border border-gray-200 text-[#1a1a1a] hover:border-primary hover:text-primary font-bold py-3 rounded-xl transition-colors shadow-sm">
                  Xem chi tiết
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
