import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Star, Calendar, Languages, Info, ListChecks, MapPin, Minus, Plus, Heart, ShieldCheck, ArrowRight, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import type { DestinationDetail } from '../data';
import { fetchDestinations, fetchDestinationBySlug } from '../data';

export function DestinationDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [destination, setDestination] = useState<DestinationDetail | null | undefined>(undefined);
  const [allDestinations, setAllDestinations] = useState<DestinationDetail[]>([]);
  const [guests, setGuests] = useState(2);

  useEffect(() => {
    let cancelled = false;
    setDestination(undefined);
    Promise.all([fetchDestinationBySlug(slug || ''), fetchDestinations()]).then(([d, all]) => {
      if (cancelled) return;
      setDestination(d ?? null);
      setAllDestinations(all);
    });
    return () => { cancelled = true; };
  }, [slug]);

  if (destination === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FF] text-[#0D1C2E]">
        <p className="text-sm font-semibold animate-pulse">Đang tải...</p>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#F8F9FF] text-[#0D1C2E]">
        <p className="text-lg font-semibold">Không tìm thấy điểm đến này.</p>
        <button onClick={() => navigate('/')} className="text-sm font-semibold text-[#785900] hover:underline">
          Quay về trang chủ
        </button>
      </div>
    );
  }

  const similar = allDestinations.filter(d => d.slug !== destination.slug).slice(0, 3);
  const finalPrice = Math.round(destination.priceFrom * (1 - Math.abs(parseInt(destination.discount)) / 100));

  return (
    <div className="min-h-screen bg-[#F8F9FF] text-[#0D1C2E] font-sans">
      {/* ===== HERO ===== */}
      <div className="relative h-[420px] md:h-[500px] w-full overflow-hidden">
        <img src={destination.heroImg} alt={destination.location} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end max-w-[1280px] mx-auto px-6 pb-10">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-white/90 text-sm font-medium mb-4 hover:text-white transition-colors w-fit">
            <ChevronLeft size={16} /> Quay lại
          </button>
          <div className="backdrop-blur-[2px] bg-white/20 flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-xs font-semibold tracking-wide w-fit mb-2">
            <MapPin size={12} /> {destination.country}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{destination.location}</h1>
          <p className="text-white/90 text-base md:text-lg max-w-2xl font-medium">{destination.desc}</p>
        </div>
      </div>

      {/* ===== CONTENT GRID ===== */}
      <div className="max-w-[1280px] mx-auto px-6 py-8 flex flex-col lg:flex-row gap-6">
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          <div className="flex flex-wrap gap-2">
            <div className="bg-[#E5EEFF] flex items-center gap-2 px-4 py-2 rounded-lg">
              <Star size={18} className="text-secondary fill-secondary" />
              <span className="text-xs font-semibold">{destination.rating} ({destination.reviewCount} Đánh giá)</span>
            </div>
            <div className="bg-[#E5EEFF] flex items-center gap-2 px-4 py-2 rounded-lg">
              <Calendar size={18} />
              <span className="text-xs font-semibold">{destination.bestSeason}</span>
            </div>
            <div className="bg-[#E5EEFF] flex items-center gap-2 px-4 py-2 rounded-lg">
              <Languages size={18} />
              <span className="text-xs font-semibold">{destination.languages}</span>
            </div>
          </div>

          <div className="bg-white border border-[#D4C5AB]/30 shadow-sm rounded-xl p-5 flex flex-col gap-4">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <Info size={20} /> Về điểm đến này
            </h2>
            {destination.about.map((p, i) => (
              <p key={i} className="text-sm text-[#4F4632] leading-relaxed">{p}</p>
            ))}
          </div>

          {destination.itinerary.length > 0 && (
            <div className="bg-white border border-[#D4C5AB]/30 shadow-sm rounded-xl p-5 flex flex-col gap-4">
              <h2 className="flex items-center gap-2 text-xl font-semibold">
                <ListChecks size={18} /> Lịch trình gợi ý ({destination.itinerary.length} Ngày {Math.max(destination.itinerary.length - 1, 0)} Đêm)
              </h2>
              <div className="relative flex flex-col gap-4">
                <div className="absolute left-[19px] top-0 bottom-0 w-[2px] bg-[#D4C5AB]/50" />
                {destination.itinerary.map((day, i) => (
                  <div key={i} className="relative flex flex-col gap-1 pl-12">
                    <div className="absolute left-0 top-1 bg-secondary border-4 border-white size-10 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-[#6D5100] text-xs font-semibold tracking-wide">{day.day}</span>
                    </div>
                    <h3 className="text-base font-bold">{day.title}</h3>
                    <p className="text-sm text-[#4F4632]">{day.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {destination.gallery.length > 0 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Thư viện ảnh</h2>
            <div className="flex gap-2">
              {destination.gallery.map((img, i) => (
                <div key={i} className="h-48 flex-1 rounded-lg overflow-hidden">
                  <img src={img} alt={`${destination.location} ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
          )}
        </div>

        {/* Right Column: Booking Sidebar */}
        <aside className="w-full lg:w-[360px] shrink-0">
          <div className="bg-white border border-[#D4C5AB]/30 shadow-sm rounded-xl p-5 flex flex-col gap-4 sticky top-6">
            <div className="border-b border-[#D4C5AB]/30 pb-4 flex items-end justify-between">
              <div>
                <div className="text-sm text-[#4F4632]">Giá từ</div>
                <div className="text-2xl font-bold">{finalPrice.toLocaleString('vi-VN')}đ<span className="text-sm font-normal text-[#4F4632]"> /khách</span></div>
              </div>
              <span className="bg-secondary text-[#6D5100] text-xs font-bold px-2 py-1 rounded">{destination.discount}</span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-wide">Chọn ngày khởi hành</label>
              <div className="relative">
                <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0D1C2E]" />
                <input type="date" className="w-full bg-[#F8F9FF] border border-[#826050]/50 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-wide">Số lượng khách</label>
              <div className="bg-[#F8F9FF] border border-[#826050]/50 rounded-lg flex items-center justify-between p-2">
                <button onClick={() => setGuests(g => Math.max(1, g - 1))} className="bg-[#E5EEFF] size-8 rounded-full flex items-center justify-center hover:bg-[#d7e3ff] transition-colors">
                  <Minus size={14} />
                </button>
                <span className="text-base font-medium">{guests} Người lớn</span>
                <button onClick={() => setGuests(g => g + 1)} className="bg-[#E5EEFF] size-8 rounded-full flex items-center justify-center hover:bg-[#d7e3ff] transition-colors">
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button onClick={() => navigate(`/search?destination=${encodeURIComponent(destination.location)}`)} className="bg-[#785900] hover:bg-[#6D5100] transition-colors text-white text-xs font-bold tracking-wide rounded-lg py-3 flex items-center justify-center gap-2">
                Đặt Ngay <ArrowRight size={14} />
              </button>
              <button className="bg-white border border-[#785900] text-[#785900] text-xs font-bold tracking-wide rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-[#785900]/5 transition-colors">
                <Heart size={15} /> Lưu vào yêu thích
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2 text-xs text-[#4F4632]">
              <ShieldCheck size={14} /> Thanh toán an toàn 100%
            </div>
          </div>
        </aside>
      </div>

      {/* ===== SIMILAR DESTINATIONS ===== */}
      <section className="bg-[#EFF4FF] border-t border-[#D4C5AB]/30 py-10">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col gap-4">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs font-semibold text-[#785900] tracking-wide uppercase">Khám phá thêm</div>
              <h2 className="text-xl font-semibold">Các điểm đến tương tự</h2>
            </div>
            <Link to="/#destinations" className="flex items-center gap-1 text-xs font-semibold text-[#585E6C] hover:text-[#0D1C2E] transition-colors">
              Xem tất cả <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {similar.map(d => (
              <motion.div key={d.slug} whileHover={{ y: -4 }}>
                <Link to={`/destinations/${d.slug}`} className="bg-white border border-[#D4C5AB]/30 shadow-sm rounded-xl overflow-hidden flex flex-col h-full">
                  <div className="relative h-48 w-full">
                    <img src={d.heroImg} alt={d.location} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 backdrop-blur-[4px] bg-white/90 flex items-center gap-1 px-2 py-1 rounded text-xs font-bold">
                      <Star size={12} className="text-secondary fill-secondary" /> {d.rating}
                    </div>
                  </div>
                  <div className="p-4 flex flex-col gap-1">
                    <h3 className="text-xl font-semibold">{d.location}</h3>
                    <p className="text-sm text-[#4F4632]">{d.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
