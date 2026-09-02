import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Search, Calendar, Users, Star, Clock, Bus, Mountain, Landmark, Waves } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Tour, TourCategory } from '../tours-data';
import { fetchTours } from '../tours-data';
import { api } from '../../../lib/api';

interface ReviewItem {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  text: string;
}

export function TourPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);

  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [activeCategory, setActiveCategory] = useState<TourCategory | 'all'>('all');

  useEffect(() => {
    fetchTours().then(t => { setTours(t); setLoading(false); });
    api.get<ReviewItem[]>('/reviews')
      .then(res => setReviews((res.data ?? []).slice(0, 2)))
      .catch(() => setReviews([]));
  }, []);

  const filteredTours = activeCategory === 'all' ? tours : tours.filter(t => t.category === activeCategory);

  const basePrice = filteredTours.length > 0 ? filteredTours[0].price : 2990000;
  const estTotal = (basePrice * adults) + (basePrice * 0.5 * children);

  const categories: { id: TourCategory; icon: typeof Waves; label: string }[] = [
    { id: 'beach', icon: Waves, label: 'Biển đảo' },
    { id: 'mountain', icon: Mountain, label: 'Núi rừng' },
    { id: 'cultural', icon: Landmark, label: 'Văn hoá' },
    { id: 'adventure', icon: Star, label: 'Mạo hiểm' },
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#1a1a1a] font-sans pb-24">

      {/* ===== HERO ===== */}
      <section className="relative h-[60vh] min-h-[440px] flex items-center px-6 lg:px-12 pt-20 bg-[#0d1710]">
        <div className="absolute inset-0 z-0">
          <img src="https://images.pexels.com/photos/1462892/pexels-photo-1462892.jpeg?auto=compress&cs=tinysrgb&w=2000" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        </div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative z-10 w-full mx-auto max-w-[1400px] text-white">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[2px] bg-[#d4af37]" />
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#d4af37]">Trải nghiệm chọn lọc</span>
          </div>
          <h1 className="font-display font-medium text-5xl md:text-6xl lg:text-7xl leading-[1.1] mb-4 max-w-2xl">
            Hành trình <span className="text-[#d4af37] italic">đáng nhớ</span> đang chờ
          </h1>
          <p className="text-gray-200 text-lg max-w-md leading-relaxed font-medium">
            Tour trọn gói được tuyển chọn kỹ, đưa bạn đến những điểm đến đẹp nhất Việt Nam.
          </p>
        </motion.div>
      </section>

      {/* ===== SEARCH PILL ===== */}
      <section className="relative z-20 px-6 lg:px-12 -mt-10 flex justify-center max-w-[1400px] mx-auto mb-16">
        <div className="bg-white rounded-3xl lg:rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.1)] p-2 flex flex-col md:flex-row items-center w-full max-w-4xl border border-gray-100">
          <div className="flex-1 flex items-center gap-3 px-6 py-3 w-full border-b md:border-b-0 md:border-r border-gray-100 group cursor-pointer transition-colors hover:bg-gray-50/50 rounded-2xl md:rounded-l-full">
            <Search className="text-gray-400 w-5 h-5 group-hover:text-primary transition-colors" />
            <div className="flex flex-col w-full">
              <label className="text-[11px] font-bold text-[#1a1a1a] mb-0.5">Bạn muốn đi đâu?</label>
              <input type="text" placeholder="Tìm điểm đến, tour..." className="text-sm border-none outline-none text-[#1a1a1a] font-medium placeholder:text-gray-400 w-full bg-transparent" />
            </div>
          </div>

          <div className="flex-1 flex items-center gap-3 px-6 py-3 w-full border-b md:border-b-0 md:border-r border-gray-100 group cursor-pointer transition-colors hover:bg-gray-50/50">
            <Calendar className="text-gray-400 w-5 h-5 group-hover:text-primary transition-colors" />
            <div className="flex flex-col w-full">
              <label className="text-[11px] font-bold text-[#1a1a1a] mb-0.5">Ngày khởi hành</label>
              <input type="date" className="text-sm border-none outline-none text-[#1a1a1a] font-medium w-full bg-transparent cursor-pointer text-gray-500" />
            </div>
          </div>

          <div className="flex-1 flex items-center gap-3 px-6 py-3 w-full group cursor-pointer transition-colors hover:bg-gray-50/50">
            <Users className="text-gray-400 w-5 h-5 group-hover:text-primary transition-colors" />
            <div className="flex flex-col w-full">
              <label className="text-[11px] font-bold text-[#1a1a1a] mb-0.5">Số khách</label>
              <div className="text-sm font-medium text-gray-500">{adults} người lớn, {children} trẻ em</div>
            </div>
          </div>

          <button className="bg-primary hover:bg-primary-hover text-white rounded-full px-8 py-4 font-semibold flex items-center gap-2 m-2 md:m-0 shrink-0 w-full md:w-auto justify-center transition-colors">
            Tìm tour
          </button>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Categories */}
        <div className="flex items-center gap-4 overflow-x-auto pb-4 mb-10 custom-scrollbar">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0">Phổ biến:</span>
          <button
            onClick={() => setActiveCategory('all')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all border ${
              activeCategory === 'all' ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-[#1a1a1a]'
            }`}
          >
            Tất cả
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all border ${
                activeCategory === cat.id ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-[#1a1a1a]'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Column */}
          <div className="lg:col-span-8 flex flex-col gap-12">

            <div>
              <h2 className="text-3xl font-display font-medium text-[#1a1a1a] mb-8">Tour nổi bật</h2>

              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : filteredTours.length === 0 ? (
                <div className="py-16 text-center text-gray-400 text-sm">Chưa có tour nào ở danh mục này.</div>
              ) : (
                <div className="flex flex-col gap-8">
                  {filteredTours.map((tour, index) => {
                    const isImageLeft = index % 2 === 0;
                    return (
                      <motion.div whileHover={{ y: -4 }} key={tour.id} className="group flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all">
                        {isImageLeft && (
                          <div className="md:w-5/12 relative h-64 md:h-auto overflow-hidden">
                            <img src={tour.imageUrl ?? undefined} alt={tour.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-[#1a1a1a] flex items-center gap-1.5 shadow-sm">
                              <Star className="w-3 h-3 text-secondary fill-secondary" /> 4.9 (128)
                            </div>
                          </div>
                        )}

                        <div className="md:w-7/12 p-8 flex flex-col justify-center">
                          <div className="flex justify-between items-start gap-4 mb-2">
                            <h3 className="text-xl font-bold text-[#1a1a1a] leading-tight">{tour.title}</h3>
                            <div className="text-xl font-bold text-primary whitespace-nowrap">{new Intl.NumberFormat('vi-VN').format(tour.price)}đ</div>
                          </div>

                          <p className="text-sm text-gray-500 mb-6 line-clamp-3 leading-relaxed">{tour.description}</p>

                          <div className="flex flex-wrap gap-3 mb-6">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full text-xs font-semibold text-gray-600">
                              <Clock className="w-3.5 h-3.5 text-primary" /> {tour.duration}
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full text-xs font-semibold text-gray-600">
                              <Bus className="w-3.5 h-3.5 text-blue-500" /> Đã gồm xe đưa đón
                            </div>
                          </div>

                          <Link to={`/tour/${tour.id}`} className="w-full text-center bg-white border border-gray-200 text-[#1a1a1a] hover:border-primary hover:text-primary font-bold py-3 rounded-xl transition-colors shadow-sm">
                            Xem chi tiết
                          </Link>
                        </div>

                        {!isImageLeft && (
                          <div className="md:w-5/12 relative h-64 md:h-auto overflow-hidden">
                            <img src={tour.imageUrl ?? undefined} alt={tour.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-[#1a1a1a] flex items-center gap-1.5 shadow-sm">
                              <Star className="w-3 h-3 text-secondary fill-secondary" /> 4.8 (95)
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Traveler Stories — real reviews from /api/reviews (same source as HomePage),
                not tied to a specific tour since Tour rows don't carry per-tour reviews yet. */}
            {reviews.length > 0 && (
              <div>
                <h2 className="text-3xl font-display font-medium text-[#1a1a1a] mb-8">Khách hàng nói gì</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary overflow-hidden">
                          {review.avatar?.startsWith('http') ? (
                            <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
                          ) : (
                            review.avatar || review.name?.charAt(0)
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-[#1a1a1a] text-sm">{review.name}</div>
                          <div className="flex text-secondary mt-0.5">
                            {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 italic leading-relaxed">"{review.text}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 flex flex-col gap-8">

            {/* Customize Group */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <h3 className="text-lg font-bold text-[#1a1a1a] mb-6">Tuỳ chỉnh đoàn</h3>

              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#1a1a1a] text-sm">Người lớn</div>
                    <div className="text-xs text-gray-400">Từ 12 tuổi</div>
                  </div>
                  <div className="flex items-center gap-4 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                    <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-8 h-8 bg-white font-bold text-[#1a1a1a] flex items-center justify-center rounded-lg shadow-sm border border-gray-100 hover:bg-gray-50">-</button>
                    <span className="font-bold w-4 text-center text-[#1a1a1a]">{adults}</span>
                    <button onClick={() => setAdults(adults + 1)} className="w-8 h-8 bg-white font-bold text-[#1a1a1a] flex items-center justify-center rounded-lg shadow-sm border border-gray-100 hover:bg-gray-50">+</button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#1a1a1a] text-sm">Trẻ em</div>
                    <div className="text-xs text-gray-400">2-11 tuổi</div>
                  </div>
                  <div className="flex items-center gap-4 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                    <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-8 h-8 bg-white font-bold text-[#1a1a1a] flex items-center justify-center rounded-lg shadow-sm border border-gray-100 hover:bg-gray-50">-</button>
                    <span className="font-bold w-4 text-center text-[#1a1a1a]">{children}</span>
                    <button onClick={() => setChildren(children + 1)} className="w-8 h-8 bg-white font-bold text-[#1a1a1a] flex items-center justify-center rounded-lg shadow-sm border border-gray-100 hover:bg-gray-50">+</button>
                  </div>
                </div>

                <div>
                  <div className="font-bold text-[#1a1a1a] text-sm mb-2">Yêu cầu đặc biệt</div>
                  <textarea
                    placeholder="Chế độ ăn, hỗ trợ di chuyển..."
                    className="w-full bg-gray-50 border border-gray-200 p-4 text-sm text-[#1a1a1a] outline-none resize-none h-24 rounded-xl focus:border-primary transition-colors placeholder:text-gray-400"
                  />
                </div>

                <div className="pt-6 border-t border-gray-100 flex items-end justify-between">
                  <div className="text-sm font-bold text-gray-400">Tạm tính</div>
                  <div className="text-3xl font-bold text-[#1a1a1a]">{new Intl.NumberFormat('vi-VN').format(estTotal)}đ</div>
                </div>

                {filteredTours.length > 0 && (
                  <Link to={`/tour/${filteredTours[0].id}`} className="block w-full text-center bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl transition-colors shadow-md mt-2">
                    Tiến hành đặt tour
                  </Link>
                )}
              </div>
            </div>

            {/* Sample Itinerary */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
              <h3 className="text-lg font-bold text-[#1a1a1a] mb-8">Lịch trình mẫu</h3>

              <div className="relative border-l-2 border-gray-100 ml-3 flex flex-col gap-8 pb-4">
                {filteredTours.length > 0 && filteredTours[0].itinerary?.map((item, idx: number) => (
                  <div key={idx} className="relative">
                    <div className={`absolute -left-[25px] top-1 w-5 h-5 rounded-full flex items-center justify-center ${idx === 0 ? 'bg-primary border-4 border-white shadow-sm' : 'bg-white border-2 border-gray-200'}`} />
                    <div className="pl-6">
                      <h4 className="font-bold text-sm text-[#1a1a1a] mb-2">Ngày {item.day}: {item.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed mb-3">{item.description}</p>
                      {item.tags && (
                        <div className="flex gap-2 flex-wrap">
                          {item.tags.split(',').map((tag: string, i: number) => (
                            <span key={i} className="text-[10px] font-bold px-2.5 py-1 bg-gray-50 text-gray-500 rounded-full border border-gray-100">{tag.trim()}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {filteredTours.length > 0 && (
                <Link to={`/tour/${filteredTours[0].id}`} className="block w-full text-center text-sm font-bold text-primary mt-6 hover:text-primary-hover transition-colors">
                  Xem toàn bộ lịch trình →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
