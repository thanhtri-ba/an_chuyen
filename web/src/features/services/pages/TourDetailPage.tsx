import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Bus, Minus, Plus, ArrowRight, ChevronLeft, Info, ListChecks, Star } from 'lucide-react';
import type { Tour } from '../tours-data';
import { fetchTours, fetchTourById } from '../tours-data';

export function TourDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tour, setTour] = useState<Tour | null | undefined>(undefined);
  const [allTours, setAllTours] = useState<Tour[]>([]);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setTour(undefined);
    Promise.all([fetchTourById(id || ''), fetchTours()]).then(([t, all]) => {
      if (cancelled) return;
      setTour(t ?? null);
      setAllTours(all);
    });
    return () => { cancelled = true; };
  }, [id]);

  if (tour === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FF] text-[#0D1C2E]">
        <p className="text-sm font-semibold animate-pulse">Đang tải...</p>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#F8F9FF] text-[#0D1C2E]">
        <p className="text-lg font-semibold">Không tìm thấy tour này.</p>
        <button onClick={() => navigate('/tour')} className="text-sm font-semibold text-[#785900] hover:underline">
          Quay về danh sách tour
        </button>
      </div>
    );
  }

  const estTotal = (tour.price * adults) + (tour.price * 0.5 * children);
  const similar = allTours.filter(t => t.id !== tour.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F8F9FF] text-[#0D1C2E] font-sans">
      {/* ===== HERO ===== */}
      <div className="relative h-[420px] md:h-[500px] w-full overflow-hidden">
        <img src={tour.imageUrl || undefined} alt={tour.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end max-w-[1280px] mx-auto px-6 pb-10">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-white/90 text-sm font-medium mb-4 hover:text-white transition-colors w-fit">
            <ChevronLeft size={16} /> Quay lại
          </button>
          <div className="backdrop-blur-[2px] bg-white/20 flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-xs font-semibold tracking-wide w-fit mb-2">
            <Clock size={12} /> {tour.duration}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{tour.title}</h1>
          {tour.description && <p className="text-white/90 text-base md:text-lg max-w-2xl font-medium">{tour.description}</p>}
        </div>
      </div>

      {/* ===== CONTENT GRID ===== */}
      <div className="max-w-[1280px] mx-auto px-6 py-8 flex flex-col lg:flex-row gap-6">
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          <div className="flex flex-wrap gap-2">
            <div className="bg-[#E5EEFF] flex items-center gap-2 px-4 py-2 rounded-lg">
              <Clock size={18} />
              <span className="text-xs font-semibold">{tour.duration}</span>
            </div>
            <div className="bg-[#E5EEFF] flex items-center gap-2 px-4 py-2 rounded-lg">
              <Bus size={18} />
              <span className="text-xs font-semibold">Đã gồm xe đưa đón</span>
            </div>
          </div>

          {tour.description && (
            <div className="bg-white border border-[#D4C5AB]/30 shadow-sm rounded-xl p-5 flex flex-col gap-4">
              <h2 className="flex items-center gap-2 text-xl font-semibold">
                <Info size={20} /> Về tour này
              </h2>
              <p className="text-sm text-[#4F4632] leading-relaxed">{tour.description}</p>
            </div>
          )}

          {tour.itinerary.length > 0 && (
            <div className="bg-white border border-[#D4C5AB]/30 shadow-sm rounded-xl p-5 flex flex-col gap-4">
              <h2 className="flex items-center gap-2 text-xl font-semibold">
                <ListChecks size={18} /> Lịch trình chi tiết
              </h2>
              <div className="relative flex flex-col gap-4">
                <div className="absolute left-[19px] top-0 bottom-0 w-[2px] bg-[#D4C5AB]/50" />
                {tour.itinerary.map((day, i) => (
                  <div key={i} className="relative flex flex-col gap-1 pl-12">
                    <div className="absolute left-0 top-1 bg-secondary border-4 border-white size-10 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-[#6D5100] text-xs font-semibold tracking-wide">N{day.day}</span>
                    </div>
                    <h3 className="text-base font-bold">{day.title}</h3>
                    <p className="text-sm text-[#4F4632]">{day.description}</p>
                    {day.tags && (
                      <div className="flex gap-2 flex-wrap mt-1">
                        {day.tags.split(',').map((tag, ti) => (
                          <span key={ti} className="text-[10px] font-bold px-2.5 py-1 bg-[#F8F9FF] text-[#585E6C] rounded-full border border-[#D4C5AB]/40">{tag.trim()}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tour.gallery.length > 0 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold">Thư viện ảnh</h2>
              <div className="flex gap-2">
                {tour.gallery.map((img, i) => (
                  <div key={i} className="h-48 flex-1 rounded-lg overflow-hidden">
                    <img src={img} alt={`${tour.title} ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Booking Sidebar */}
        <aside className="w-full lg:w-[360px] shrink-0">
          <div className="bg-white border border-[#D4C5AB]/30 shadow-sm rounded-xl p-5 flex flex-col gap-4 sticky top-6">
            <div className="border-b border-[#D4C5AB]/30 pb-4">
              <div className="text-sm text-[#4F4632]">Giá từ</div>
              <div className="text-2xl font-bold">{new Intl.NumberFormat('vi-VN').format(tour.price)}đ<span className="text-sm font-normal text-[#4F4632]"> /khách</span></div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-sm">Người lớn</div>
                <div className="text-xs text-[#4F4632]">Từ 12 tuổi</div>
              </div>
              <div className="flex items-center gap-3 bg-[#F8F9FF] p-1.5 rounded-lg border border-[#D4C5AB]/40">
                <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-7 h-7 bg-white rounded-md shadow-sm border border-[#D4C5AB]/40 flex items-center justify-center"><Minus size={12} /></button>
                <span className="font-bold w-4 text-center">{adults}</span>
                <button onClick={() => setAdults(adults + 1)} className="w-7 h-7 bg-white rounded-md shadow-sm border border-[#D4C5AB]/40 flex items-center justify-center"><Plus size={12} /></button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-sm">Trẻ em</div>
                <div className="text-xs text-[#4F4632]">2-11 tuổi</div>
              </div>
              <div className="flex items-center gap-3 bg-[#F8F9FF] p-1.5 rounded-lg border border-[#D4C5AB]/40">
                <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-7 h-7 bg-white rounded-md shadow-sm border border-[#D4C5AB]/40 flex items-center justify-center"><Minus size={12} /></button>
                <span className="font-bold w-4 text-center">{children}</span>
                <button onClick={() => setChildren(children + 1)} className="w-7 h-7 bg-white rounded-md shadow-sm border border-[#D4C5AB]/40 flex items-center justify-center"><Plus size={12} /></button>
              </div>
            </div>

            <div className="pt-4 border-t border-[#D4C5AB]/30 flex items-end justify-between">
              <div className="text-sm font-bold text-[#4F4632]">Tạm tính</div>
              <div className="text-2xl font-bold">{new Intl.NumberFormat('vi-VN').format(estTotal)}đ</div>
            </div>

            <button
              onClick={() => navigate(`/tour/${tour.id}`)}
              className="w-full bg-[#785900] hover:bg-[#6D5100] transition-colors text-white text-xs font-bold tracking-wide rounded-lg py-3 flex items-center justify-center gap-2"
            >
              Tiến hành đặt tour <ArrowRight size={14} />
            </button>
          </div>
        </aside>
      </div>

      {/* ===== SIMILAR TOURS ===== */}
      {similar.length > 0 && (
        <section className="bg-[#EFF4FF] border-t border-[#D4C5AB]/30 py-10">
          <div className="max-w-[1280px] mx-auto px-6 flex flex-col gap-4">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-xs font-semibold text-[#785900] tracking-wide uppercase">Khám phá thêm</div>
                <h2 className="text-xl font-semibold">Các tour tương tự</h2>
              </div>
              <Link to="/tour" className="flex items-center gap-1 text-xs font-semibold text-[#585E6C] hover:text-[#0D1C2E] transition-colors">
                Xem tất cả <ArrowRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {similar.map(t => (
                <motion.div key={t.id} whileHover={{ y: -4 }}>
                  <Link to={`/tour/${t.id}`} className="bg-white border border-[#D4C5AB]/30 shadow-sm rounded-xl overflow-hidden flex flex-col h-full">
                    <div className="relative h-48 w-full">
                      <img src={t.imageUrl || undefined} alt={t.title} className="w-full h-full object-cover" loading="lazy" />
                      <div className="absolute top-3 left-3 backdrop-blur-[4px] bg-white/90 flex items-center gap-1 px-2 py-1 rounded text-xs font-bold">
                        <Star size={12} className="text-secondary fill-secondary" /> 4.8
                      </div>
                    </div>
                    <div className="p-4 flex flex-col gap-1">
                      <h3 className="text-xl font-semibold">{t.title}</h3>
                      <p className="text-sm text-[#4F4632]">{new Intl.NumberFormat('vi-VN').format(t.price)}đ</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
