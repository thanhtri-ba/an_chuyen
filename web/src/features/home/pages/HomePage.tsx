import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, ArrowRight, CheckCircle, UserCheck, ShieldCheck, Headphones, Star, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { DestinationDetail } from '../../destinations/data';
import { fetchDestinations } from '../../destinations/data';
import { api } from '../../../lib/api';

interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  targetUrl?: string | null;
}

interface ReviewItem {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  text: string;
  route: string;
  date: string;
}

export function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [passengers, setPassengers] = useState(1);
  const [destinationQuery, setDestinationQuery] = useState('');
  const [popularDestinations, setPopularDestinations] = useState<DestinationDetail[]>([]);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);

  const SUGGESTED_CITIES = [
    'TP.HCM', 'Hà Nội', 'Đà Nẵng', 'Đà Lạt', 'Nha Trang', 'Vũng Tàu', 'Sapa', 'Hải Phòng', 'Cần Thơ', 'Huế'
  ];

  useEffect(() => {
    fetchDestinations().then(setPopularDestinations);
    api.get<Banner[]>('/banners', { params: { platform: 'web' } })
      .then(res => setBanner(res.data?.[0] ?? null))
      .catch(() => setBanner(null));
    api.get<ReviewItem[]>('/reviews')
      .then(res => setReviews(res.data ?? []))
      .catch(() => setReviews([]));
  }, []);

  const filteredRoutes = popularDestinations.filter(r =>
    r.location.toLowerCase().includes(destinationQuery.toLowerCase())
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (origin) params.append('origin', origin);
    if (destination) params.append('destination', destination);
    if (date) params.append('date', date);
    if (passengers) params.append('passengers', passengers.toString());
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#1a1a1a] font-sans">
      
      {/* ===== HERO ===== */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center px-6 lg:px-12 pt-20">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=2000&auto=format&fit=crop" alt="Hero" className="w-full h-full object-cover" />
          {/* Subtle gradient to make text readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-2xl lg:ml-12 text-white w-full mx-auto max-w-[1400px]">
          <div className="text-sm font-semibold tracking-wide text-[#d4af37] mb-2 flex items-center gap-2">
            {t('roamora.heroSub')} <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.5l-1.3 2.6c-.2.4-.1.9.3 1.1l7.3 3.8-2 2-3.4-.6c-.5-.1-.9.2-1.1.5l-1.1 2.3c-.2.4 0 .9.4 1.1L8 21l8.5-4.7c.4.2.9.4 1.3.4z"/></svg>
          </div>
          <h1 className="text-6xl md:text-7xl font-display font-medium leading-[1.1] mb-6 text-white">
            {t('roamora.heroTitle1')}<br />
            <span className="text-[#d4af37] font-serif italic">{t('roamora.heroTitle2')}</span>
          </h1>
          <p className="text-gray-200 text-lg mb-8 max-w-md leading-relaxed font-medium">
            {t('roamora.heroDesc')}
          </p>
          <button className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-full font-semibold flex items-center gap-3 transition-colors shadow-lg">
            {t('roamora.exploreNow')}
            <div className="bg-white text-primary rounded-full p-1"><ArrowRight size={16} /></div>
          </button>
        </div>
      </section>

      {/* ===== SEARCH PILL ===== */}
      <section className="relative z-20 px-6 lg:px-12 -mt-10 flex justify-center max-w-[1400px] mx-auto">
        <form onSubmit={handleSearch} className="bg-white rounded-3xl md:rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.08)] p-2 flex flex-col md:flex-row items-center w-full border border-gray-100">

          <div className="relative flex-1 min-w-0 flex items-center gap-3 px-6 py-3 w-full md:w-auto border-b md:border-b-0 md:border-r border-gray-100 group hover:bg-gray-50/50 rounded-2xl md:rounded-l-full md:rounded-r-none cursor-pointer transition-colors">
            <MapPin className="text-gray-400 w-5 h-5 shrink-0 group-hover:text-primary transition-colors" />
            <div className="flex flex-col w-full min-w-0">
              <label className="text-[11px] font-bold text-[#1a1a1a] mb-0.5 cursor-pointer truncate">{t('home.searchBar.origin')}</label>
              <input 
                type="text" 
                value={origin} 
                onChange={e => { setOrigin(e.target.value); setShowOriginDropdown(true); }}
                onFocus={() => setShowOriginDropdown(true)}
                onBlur={() => setTimeout(() => setShowOriginDropdown(false), 200)}
                placeholder={t('home.searchBar.originPlaceholder')} 
                className="text-sm border-none outline-none text-[#1a1a1a] font-medium placeholder:text-gray-400 placeholder:font-normal w-full bg-transparent truncate" 
              />
            </div>

            <AnimatePresence>
              {showOriginDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-4 w-full md:w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 max-h-64 overflow-y-auto"
                >
                  <div className="text-xs font-bold text-gray-400 px-3 py-2 uppercase tracking-wider">Đề xuất</div>
                  {SUGGESTED_CITIES.filter(c => c.toLowerCase().includes(origin.toLowerCase())).map(city => (
                    <div 
                      key={city} 
                      onClick={() => { setOrigin(city); setShowOriginDropdown(false); }}
                      className="px-3 py-2 hover:bg-gray-50 rounded-xl cursor-pointer text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                      <MapPin size={14} className="text-gray-400" />
                      {city}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative flex-1 min-w-0 flex items-center gap-3 px-6 py-3 w-full md:w-auto border-b md:border-b-0 md:border-r border-gray-100 group hover:bg-gray-50/50 cursor-pointer transition-colors">
            <MapPin className="text-gray-400 w-5 h-5 shrink-0 group-hover:text-primary transition-colors" />
            <div className="flex flex-col w-full min-w-0">
              <label className="text-[11px] font-bold text-[#1a1a1a] mb-0.5 cursor-pointer truncate">{t('home.searchBar.destination')}</label>
              <input 
                type="text" 
                value={destination} 
                onChange={e => { setDestination(e.target.value); setShowDestDropdown(true); }}
                onFocus={() => setShowDestDropdown(true)}
                onBlur={() => setTimeout(() => setShowDestDropdown(false), 200)}
                placeholder={t('home.searchBar.destinationPlaceholder')} 
                className="text-sm border-none outline-none text-[#1a1a1a] font-medium placeholder:text-gray-400 placeholder:font-normal w-full bg-transparent truncate" 
              />
            </div>

            <AnimatePresence>
              {showDestDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-4 w-full md:w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 max-h-64 overflow-y-auto"
                >
                  <div className="text-xs font-bold text-gray-400 px-3 py-2 uppercase tracking-wider">Đề xuất</div>
                  {SUGGESTED_CITIES.filter(c => c.toLowerCase().includes(destination.toLowerCase())).map(city => (
                    <div 
                      key={city} 
                      onClick={() => { setDestination(city); setShowDestDropdown(false); }}
                      className="px-3 py-2 hover:bg-gray-50 rounded-xl cursor-pointer text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                      <MapPin size={14} className="text-gray-400" />
                      {city}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex-1 min-w-0 flex items-center gap-3 px-6 py-3 w-full md:w-auto border-b md:border-b-0 md:border-r border-gray-100 group hover:bg-gray-50/50 cursor-pointer transition-colors">
            <Calendar className="text-gray-400 w-5 h-5 shrink-0 group-hover:text-primary transition-colors" />
            <div className="flex flex-col w-full min-w-0">
              <label className="text-[11px] font-bold text-[#1a1a1a] mb-0.5 cursor-pointer truncate">{t('home.searchBar.date')}</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="text-sm border-none outline-none text-[#1a1a1a] font-medium w-full bg-transparent cursor-pointer text-gray-400 truncate" />
            </div>
          </div>

          <div className="flex-1 min-w-0 flex items-center gap-3 px-6 py-3 w-full md:w-auto group hover:bg-gray-50/50 cursor-pointer transition-colors">
            <Users className="text-gray-400 w-5 h-5 shrink-0 group-hover:text-primary transition-colors" />
            <div className="flex flex-col w-full min-w-0">
              <label className="text-[11px] font-bold text-[#1a1a1a] mb-0.5 cursor-pointer truncate">{t('home.searchBar.passengers')}</label>
              <select value={passengers} onChange={e => setPassengers(Number(e.target.value))} className="text-sm border-none outline-none text-[#1a1a1a] font-medium w-full bg-transparent cursor-pointer appearance-none text-gray-400 truncate">
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} {t('home.searchBar.person')}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" className="bg-primary hover:bg-primary-hover text-white rounded-full px-8 py-4 font-semibold flex items-center gap-2 m-2 md:m-0 shrink-0 w-full md:w-auto justify-center transition-colors">
            {t('home.searchBar.search')} <Search size={18} />
          </button>
        </form>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="px-6 lg:px-12 py-20 bg-[#fcfcfc] max-w-[1400px] mx-auto">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 lg:px-8">
          {[
            { icon: CheckCircle, title: t('roamora.features.f1Title'), desc: t('roamora.features.f1Desc') },
            { icon: UserCheck, title: t('roamora.features.f2Title'), desc: t('roamora.features.f2Desc') },
            { icon: ShieldCheck, title: t('roamora.features.f3Title'), desc: t('roamora.features.f3Desc') },
            { icon: Headphones, title: t('roamora.features.f4Title'), desc: t('roamora.features.f4Desc') },
          ].map((f, i) => (
            <div key={i} className="flex gap-4 items-start">
              <f.icon className="w-8 h-8 text-gray-400 shrink-0 mt-1" strokeWidth={1.5} />
              <div>
                <h3 className="font-bold text-[#1a1a1a] mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== ALL DESTINATIONS ===== */}
      <section className="px-6 lg:px-12 py-12 bg-[#F8F9FF] max-w-[1400px] mx-auto rounded-[24px]">
        <div className="w-full flex flex-col gap-12">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div className="flex flex-col gap-2">
              <div className="text-[12px] font-semibold text-[#785900] tracking-[0.6px] uppercase">{t('roamora.destinations.sub')}</div>
              <h2 className="text-2xl font-bold text-[#0D1C2E]">{t('roamora.destinations.title')}</h2>
            </div>
            <div className="flex gap-4 items-center flex-wrap">
              <div className="relative">
                <Search size={18} className="absolute left-[13px] top-1/2 -translate-y-1/2 text-[#6B7280]" />
                <input
                  type="text"
                  value={destinationQuery}
                  onChange={e => setDestinationQuery(e.target.value)}
                  placeholder="Tìm kiếm điểm đến..."
                  className="bg-[#F8F9FF] border border-[#D4C5AB] rounded-lg pl-[41px] pr-[17px] py-[10px] text-sm text-[#0D1C2E] placeholder:text-[#6B7280] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-[256px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <button className="flex items-center gap-2 bg-[#F8F9FF] border border-[#D4C5AB] rounded-lg px-[17px] py-[9px] text-sm text-[#0D1C2E] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] hover:bg-white transition-colors">
                <SlidersHorizontal size={16} /> Bộ lọc
              </button>
            </div>
          </div>

          {filteredRoutes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredRoutes.map((r, i) => (
                <motion.div key={i} whileHover={{ y: -5 }} className="group relative h-[400px] rounded-[12px] overflow-hidden shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
                  <Link to={`/destinations/${r.slug}`} className="absolute inset-0">
                    <img src={r.heroImg} alt={r.location} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    <div className="absolute top-4 left-4 backdrop-blur-[2px] bg-[#F8F9FF]/90 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-semibold text-[#0D1C2E] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
                      <MapPin size={12} className="text-[#785900]" /> {r.location}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-2 text-white">
                      <h3 className="text-xl font-bold">{r.location}</h3>
                      <p className="text-sm text-gray-200 leading-tight">{r.desc}</p>
                      <div className="flex items-center gap-1.5 text-xs font-semibold pt-2">
                        <Star size={14} className="text-secondary fill-secondary" /> {r.rating} <span className="text-gray-300 font-normal">({r.reviewCount})</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-[#585E6C] bg-white rounded-xl border border-dashed border-[#D4C5AB]">
              <Search size={32} className="mb-3 text-[#D4C5AB]" />
              <span className="text-sm font-semibold">Không tìm thấy điểm đến nào</span>
            </div>
          )}
        </div>
      </section>

      {/* ===== PROMO BANNER ===== */}
      <section className="px-6 lg:px-12 py-16 bg-[#fcfcfc] max-w-[1400px] mx-auto">
        <div className="w-full px-4 lg:px-8 relative rounded-3xl overflow-hidden h-[300px] flex items-center px-10 md:px-16 mx-4 lg:mx-8" style={{ width: 'calc(100% - 2rem)' }}>
          <img
            src={banner?.imageUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop'}
            alt={banner?.title || 'Promo'}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#163328]/95 to-[#163328]/50" />

          <div className="relative z-10 text-white max-w-lg">
            <div className="text-sm font-semibold text-secondary mb-3">{t('roamora.promo.sub')}</div>
            {banner ? (
              <h2 className="text-4xl md:text-5xl font-display mb-4 font-medium">{banner.title}</h2>
            ) : (
              <h2 className="text-4xl md:text-5xl font-display mb-4 font-medium">
                {t('roamora.promo.title1')} <span className="text-secondary font-serif italic text-6xl">{t('roamora.promo.title2')}</span> {t('roamora.promo.title3')}
              </h2>
            )}
            <p className="text-lg text-white/90 mb-8 font-light">{t('roamora.promo.desc')}</p>
            <button
              onClick={() => {
                const url = banner?.targetUrl || '/offers';
                if (/^https?:\/\//i.test(url)) {
                  window.open(url, '_blank', 'noopener,noreferrer');
                } else {
                  navigate(url);
                }
              }}
              className="bg-white text-[#1a1a1a] hover:bg-gray-100 px-6 py-3 rounded-full font-semibold flex items-center gap-3 transition-colors text-sm shadow-md"
            >
              {t('roamora.promo.btn')} <ArrowRight size={16} />
            </button>
          </div>

          {/* Decorative plane line */}
          <svg className="absolute top-1/2 left-1/2 w-64 h-32 opacity-50 hidden lg:block text-white" viewBox="0 0 100 50" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4">
            <path d="M0 40 Q 30 50 60 20 T 100 10" />
            <path d="M95 10 L 105 15 L 95 20 Z" fill="currentColor" stroke="none" />
          </svg>
        </div>
      </section>

      {/* ===== CUSTOMER REVIEWS ===== */}
      {reviews.length > 0 && (
        <section className="px-6 lg:px-12 py-16 bg-[#fcfcfc] max-w-[1400px] mx-auto">
          <div className="w-full px-4 lg:px-8">
            <div className="text-xs font-bold text-secondary tracking-widest uppercase mb-2">Khách hàng nói gì</div>
            <h2 className="text-3xl md:text-4xl font-display text-[#1a1a1a] font-medium mb-8">Đánh giá từ hành khách</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.slice(0, 6).map((r) => (
                <div key={r.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className={i < r.rating ? 'text-secondary fill-secondary' : 'text-gray-200 fill-gray-200'} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-4">{r.text}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                      {r.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#1a1a1a]">{r.name}</div>
                      <div className="text-xs text-gray-400">{r.route}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== TRUSTED BY ===== */}
      <section className="px-6 lg:px-12 py-16 bg-[#fcfcfc] border-b border-gray-100 max-w-[1400px] mx-auto">
        <div className="w-full px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-sm font-semibold text-[#1a1a1a] max-w-[200px] text-center md:text-left">
            {t('roamora.trusted')}
          </div>
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-8 md:gap-12 opacity-80">
            <span className="font-bold text-xl text-[#003580]">Booking.com</span>
            <span className="font-bold text-xl text-[#00005E]">Expedia</span>
            <span className="font-bold text-xl text-[#00AF87] flex items-center gap-1"><span className="w-4 h-4 bg-[#00AF87] rounded-full inline-block"></span>Tripadvisor</span>
            <span className="font-bold text-xl text-[#00B4D5]">Skyscanner</span>
            <span className="font-bold text-xl text-[#FF5A5F]">airbnb</span>
          </div>
        </div>
      </section>

    </div>
  );
}
