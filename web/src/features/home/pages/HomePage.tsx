import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, ArrowRight, ArrowLeftRight, Ticket, ShieldCheck, Clock, Headphones, Star } from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import type { DestinationDetail } from '../../destinations/data';
import { fetchDestinations } from '../../destinations/data';
import { api } from '../../../lib/api';
import { CoverflowCarousel } from '../../../shared/components/CoverflowCarousel';
import { CloudRevealHero } from '../../../shared/components/CloudRevealHero';
import { TopDestinations } from '../../../shared/components/TopDestinations';
import type { HeroSlide } from '../data';
import { fetchHeroSlides, FALLBACK_HERO_SLIDES } from '../data';

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

const SUGGESTED_CITIES = [
  'TP.HCM', 'Hà Nội', 'Đà Nẵng', 'Đà Lạt', 'Nha Trang', 'Vũng Tàu', 'Sa Pa', 'Hải Phòng', 'Cần Thơ', 'Huế',
];

const FEATURES = [
  { icon: Ticket, title: 'Vé điện tử tức thì', desc: 'Đặt xong nhận vé ngay trong app, không cần in giấy, lên xe chỉ cần quét mã.' },
  { icon: ShieldCheck, title: 'Tài xế được xác minh', desc: 'Mọi nhà xe hợp tác đều qua kiểm định giấy phép và lịch sử an toàn.' },
  { icon: Clock, title: 'Đúng giờ khởi hành', desc: 'Theo dõi trạng thái chuyến xe real-time, không lo trễ giờ hay đợi lâu.' },
  { icon: Headphones, title: 'Hỗ trợ 24/7', desc: 'Đội ngũ An Chuyến luôn sẵn sàng hỗ trợ bạn suốt hành trình.' },
];

const STATS = [
  { target: 60, suffix: 'S', label: 'Để đặt xong một vé, từ tìm chuyến đến thanh toán.' },
  { target: 3, suffix: '', label: 'Bước: chọn tuyến, chọn ghế, lên xe. Không thêm gì khác.' },
  { target: 24, suffix: '/7', label: 'Đội ngũ hỗ trợ trực tuyến, kể cả nửa đêm đổi vé gấp.' },
  { target: 0, suffix: 'đ', label: 'Phụ thu ẩn. Giá bạn thấy lúc chọn ghế là giá bạn trả.' },
];

const STEPS = [
  { n: '01', title: 'Tìm chuyến', desc: 'Nhập điểm đi, điểm đến, ngày khởi hành. Hệ thống lọc ra các chuyến còn ghế, sắp theo giờ hoặc giá.' },
  { n: '02', title: 'Chọn ghế & thanh toán', desc: 'Xem sơ đồ ghế thật của xe, chọn chỗ mình thích, trả bằng ví hoặc thanh toán khi lên xe.' },
  { n: '03', title: 'Lên xe bằng vé điện tử', desc: 'Vé nằm sẵn trong mục "Vé của tôi" — phụ xe quét mã, không cần in giấy hay nhắn Zalo hỏi lại.' },
];

// Rolls 0 → target once the section scrolls into view — MOTION_GUIDELINES.md's
// "Stats counter" pattern: linear, 1200ms, triggers once at 30% visibility.
function Counter({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const step = Math.ceil(target / 40) || 1;
    const intervalMs = 30;
    let current = 0;
    const id = setInterval(() => {
      current = Math.min(current + step, target);
      setValue(current);
      if (current >= target) clearInterval(id);
    }, intervalMs);
    return () => clearInterval(id);
  }, [inView, target]);

  return <span ref={ref}>{value}</span>;
}

export function HomePage() {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [passengers, setPassengers] = useState(1);
  const [popularDestinations, setPopularDestinations] = useState<DestinationDetail[]>([]);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(FALLBACK_HERO_SLIDES);

  useEffect(() => {
    fetchDestinations().then(setPopularDestinations);
    fetchHeroSlides().then(setHeroSlides);
    api.get<Banner[]>('/banners', { params: { platform: 'web' } })
      .then(res => setBanner(res.data?.[0] ?? null))
      .catch(() => setBanner(null));
    api.get<ReviewItem[]>('/reviews')
      .then(res => setReviews(res.data ?? []))
      .catch(() => setReviews([]));
  }, []);

  const filteredRoutes = popularDestinations;

  const handleSwap = () => {
    setOrigin(destination);
    setDestination(origin);
  };

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

      {/* ===== HERO — intro clouds part on load to reveal a looping video background, per
           Figma (node 29:260 intro state → 29:170 revealed state): centered eyebrow + title,
           social row and page indicator bottom, scroll cue centered. Cycles through several
           clips instead of one static shot. ===== */}
      {heroSlides.length > 0 && (
        <CloudRevealHero
          bgVideos={heroSlides.map(s => s.videoUrl)}
          eyebrow={heroSlides[0].eyebrow}
          title={heroSlides[0].title}
        />
      )}

      {/* ===== SEARCH PILL — dark ground matches the hero's own base color (#0d1710) so
           the two sections read as one continuous block instead of hero-then-white-gap;
           sits clear below the hero's bottom row (social icons, scroll cue, page indicator)
           instead of overlapping it. ===== */}
      <section id="search" className="relative z-20 bg-[#0d1710] px-6 lg:px-12 pt-16 pb-20">
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-3xl lg:rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-2 flex flex-col lg:flex-row items-center w-full max-w-[1400px] mx-auto border border-gray-100"
        >
          <div className="relative flex-1 min-w-0 flex items-center gap-3 px-6 py-3 w-full lg:w-auto border-b lg:border-b-0 border-gray-100 group hover:bg-gray-50/50 rounded-2xl lg:rounded-l-full cursor-pointer transition-colors">
            <MapPin className="text-gray-400 w-5 h-5 shrink-0 group-hover:text-primary transition-colors" />
            <div className="flex flex-col w-full min-w-0">
              <label className="text-[11px] font-bold text-[#1a1a1a] mb-0.5 cursor-pointer truncate">Điểm đi</label>
              <input
                type="text"
                value={origin}
                onChange={e => { setOrigin(e.target.value); setShowOriginDropdown(true); }}
                onFocus={() => setShowOriginDropdown(true)}
                onBlur={() => setTimeout(() => setShowOriginDropdown(false), 200)}
                placeholder="Bạn khởi hành từ đâu?"
                className="text-sm border-none outline-none text-[#1a1a1a] font-medium placeholder:text-gray-400 placeholder:font-normal w-full bg-transparent truncate"
              />
            </div>

            <AnimatePresence>
              {showOriginDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-4 w-full lg:w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 max-h-64 overflow-y-auto"
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

          {/* Swap button — sits on the divider between origin/destination, per UX_PRINCIPLES */}
          <button
            type="button"
            onClick={handleSwap}
            aria-label="Hoán đổi điểm đi và điểm đến"
            className="hidden lg:flex shrink-0 w-9 h-9 rounded-full border border-gray-200 bg-white items-center justify-center text-gray-400 hover:text-primary hover:border-primary/30 transition-colors z-10 -mx-[18px]"
          >
            <ArrowLeftRight size={14} />
          </button>

          <div className="relative flex-1 min-w-0 flex items-center gap-3 px-6 py-3 w-full lg:w-auto border-b lg:border-b-0 lg:border-l border-gray-100 group hover:bg-gray-50/50 cursor-pointer transition-colors">
            <MapPin className="text-gray-400 w-5 h-5 shrink-0 group-hover:text-primary transition-colors" />
            <div className="flex flex-col w-full min-w-0">
              <label className="text-[11px] font-bold text-[#1a1a1a] mb-0.5 cursor-pointer truncate">Điểm đến</label>
              <input
                type="text"
                value={destination}
                onChange={e => { setDestination(e.target.value); setShowDestDropdown(true); }}
                onFocus={() => setShowDestDropdown(true)}
                onBlur={() => setTimeout(() => setShowDestDropdown(false), 200)}
                placeholder="Bạn muốn đến đâu?"
                className="text-sm border-none outline-none text-[#1a1a1a] font-medium placeholder:text-gray-400 placeholder:font-normal w-full bg-transparent truncate"
              />
            </div>

            <AnimatePresence>
              {showDestDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-4 w-full lg:w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 max-h-64 overflow-y-auto"
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

          <div className="flex-1 min-w-0 flex items-center gap-3 px-6 py-3 w-full lg:w-auto border-b lg:border-b-0 lg:border-l border-gray-100 group hover:bg-gray-50/50 cursor-pointer transition-colors">
            <Calendar className="text-gray-400 w-5 h-5 shrink-0 group-hover:text-primary transition-colors" />
            <div className="flex flex-col w-full min-w-0">
              <label className="text-[11px] font-bold text-[#1a1a1a] mb-0.5 cursor-pointer truncate">Ngày đi</label>
              <input type="date" min={today} value={date} onChange={e => setDate(e.target.value)} className="text-sm border-none outline-none text-[#1a1a1a] font-medium w-full bg-transparent cursor-pointer truncate" />
            </div>
          </div>

          <div className="flex-1 min-w-0 flex items-center gap-3 px-6 py-3 w-full lg:w-auto lg:border-l border-gray-100 group hover:bg-gray-50/50 cursor-pointer transition-colors">
            <Users className="text-gray-400 w-5 h-5 shrink-0 group-hover:text-primary transition-colors" />
            <div className="flex flex-col w-full min-w-0">
              <label className="text-[11px] font-bold text-[#1a1a1a] mb-0.5 cursor-pointer truncate">Hành khách</label>
              <select value={passengers} onChange={e => setPassengers(Number(e.target.value))} className="text-sm border-none outline-none text-[#1a1a1a] font-medium w-full bg-transparent cursor-pointer appearance-none truncate">
                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} người</option>)}
              </select>
            </div>
          </div>

          <button type="submit" className="bg-primary hover:bg-primary-hover text-white rounded-full px-8 py-4 font-semibold flex items-center gap-2 m-2 lg:m-0 shrink-0 w-full lg:w-auto justify-center transition-colors">
            Tìm chuyến xe <Search size={18} />
          </button>
        </form>
      </section>

      {/* ===== TOP DESTINATIONS — Figma node 29:299 ("Second"): black ground, huge
           serif title, three tall portrait photos, a line of copy below. ===== */}
      <TopDestinations destinations={popularDestinations} />

      {/* ===== CONTRAST STATEMENT — the reference's "renting vs equity" 2-line punch,
           adapted: waiting at a station vs. a seat that's already yours. ===== */}
      <section className="px-6 lg:px-12 pt-32 pb-16 max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-condensed font-black uppercase text-4xl md:text-6xl leading-[1.05] tracking-tight text-[#0D1C2E] max-w-4xl">
            Xếp hàng ở bến xe <span className="text-gray-300">là may rủi.</span><br />
            Đặt ghế trên An Chuyến <span className="text-[#785900] italic font-display normal-case font-medium tracking-normal">là chắc chắn.</span>
          </p>
          <p className="text-gray-500 text-base mt-6 max-w-xl leading-relaxed">
            Không còn cảnh chen chúc mua vé tại quầy hay xe chạy rồi mới biết hết chỗ. Chọn ghế trước, thấy giá trước, giữ chỗ thật — không phải hẹn suông.
          </p>
        </motion.div>
      </section>

      {/* ===== STATS — dark section, rolling counters. DARK→LIGHT→DARK rhythm per ART_DIRECTION. ===== */}
      <section className="bg-[#0f1c14] px-6 lg:px-12 py-24">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-14">
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="font-condensed font-black text-white text-6xl md:text-7xl leading-none mb-4">
                <Counter target={s.target} />{s.suffix}
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-[220px] border-t border-white/10 pt-3">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== COST COMPARISON — data-table pattern, original numbers and framing:
           booking blind at the station vs. booking on An Chuyến. ===== */}
      <section className="px-6 lg:px-12 py-24 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-12 items-start">
          <div>
            <h2 className="font-condensed font-black uppercase text-4xl md:text-5xl leading-[1.05] tracking-tight text-[#0D1C2E] mb-5">
              Tính thử xem<br />vé "mua tại bến" tốn bao nhiêu.
            </h2>
            <p className="text-gray-500 text-base leading-relaxed max-w-md">
              Không phải lúc nào giá dán trên xe cũng là giá bạn trả — phí gửi xe, taxi ra bến sớm vì sợ hết chỗ, hay đặt cọc qua trung gian không có hóa đơn. Với An Chuyến, giá bạn thấy khi chọn ghế là giá cuối cùng.
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="border border-gray-200 rounded-2xl overflow-hidden"
          >
            <div className="grid grid-cols-3 bg-[#F8F9FF] text-[11px] font-bold uppercase tracking-wider text-gray-500 px-6 py-4">
              <span>Yếu tố</span>
              <span className="text-right">Mua tại bến</span>
              <span className="text-right text-[#785900]">An Chuyến</span>
            </div>
            {[
              ['Xem giá trước khi trả tiền', 'Hiếm khi', 'Luôn luôn'],
              ['Biết trước còn ghế hay không', 'Không', 'Có, real-time'],
              ['Rủi ro "cò vé" chênh giá', 'Có', 'Không'],
              ['Đổi/huỷ vé', 'Khó, mất phí cao', 'Trong app'],
              ['Thời gian xếp hàng mua vé', '15–30 phút', '60 giây'],
            ].map((row, i) => (
              <div key={i} className={`grid grid-cols-3 px-6 py-4 text-sm ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}`}>
                <span className="text-[#1a1a1a] font-medium">{row[0]}</span>
                <span className="text-right text-gray-400">{row[1]}</span>
                <span className="text-right text-[#785900] font-bold">{row[2]}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== 3 STEPS — light, numbered like the hero rail but laid out horizontally ===== */}
      <section className="px-6 lg:px-12 py-24 max-w-[1400px] mx-auto">
        <div className="flex flex-col gap-2 mb-14">
          <div className="text-[11px] font-bold text-[#785900] tracking-[0.2em] uppercase">✦ Đơn giản đến mức không cần hướng dẫn</div>
          <h2 className="font-condensed font-black uppercase text-4xl md:text-5xl tracking-tight text-[#0D1C2E]">3 bước. Một hành trình.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="border-t-2 border-[#0D1C2E] pt-5"
            >
              <span className="font-display italic text-3xl text-[#d4af37]">{s.n}</span>
              <h3 className="font-bold text-xl text-[#1a1a1a] mt-2 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Torn paper transition — signature ART_DIRECTION effect, never repeat the same path twice.
          Irregular segment widths + a mix of sharp tears and soft curved pulls (Q commands) reads
          as an actual hand-torn edge, not a mechanical sawtooth. */}
      <div className="relative -mt-1" aria-hidden="true">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-14 block" style={{ filter: 'drop-shadow(0 -4px 8px rgba(0,0,0,0.05))' }}>
          <path
            d="M0,18 L22,9 41,24 L67,5 Q80,2 92,12 L110,28 133,14 L149,3 168,20 Q182,30 199,19 L228,7 L246,25 269,11 L283,29 L312,6 331,17 Q345,22 358,13 L384,26 L399,4 421,15 L452,31 L470,9 493,20 Q509,25 519,14 L548,2 L563,23 588,10 L607,27 L629,7 L655,18 Q671,24 682,12 L711,29 L730,5 750,21 L778,9 L793,26 819,13 L834,2 L860,19 Q876,25 887,15 L915,31 L933,8 957,22 L979,4 L997,17 1023,28 L1038,6 L1061,20 1084,10 L1105,27 L1124,3 Q1140,10 1151,19 L1178,7 L1196,24 1220,13 L1237,31 L1259,9 1280,20 L1301,4 L1319,22 1344,11 L1362,28 L1381,6 1403,19 L1421,2 1440,15 L1440,60 0,60 Z"
            fill="#fcfcfc"
          />
        </svg>
      </div>

      {/* ===== FEATURES — editorial numbered strip, not an icon grid ===== */}
      <section id="features" className="px-6 lg:px-12 pt-4 pb-24 max-w-[1400px] mx-auto">
        <div className="flex flex-col divide-y divide-gray-100 border-t border-b border-gray-100">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="grid grid-cols-[64px_1fr_auto] md:grid-cols-[96px_260px_1fr] items-center gap-6 py-7"
            >
              <span className="font-display italic text-3xl md:text-4xl text-[#d4af37]/50">{String(i + 1).padStart(2, '0')}</span>
              <div className="flex items-center gap-3">
                <f.icon className="w-5 h-5 text-primary shrink-0" strokeWidth={1.75} />
                <h3 className="font-bold text-[#1a1a1a] text-base md:text-lg">{f.title}</h3>
              </div>
              <p className="hidden md:block text-sm text-gray-500 leading-relaxed max-w-md">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== POPULAR DESTINATIONS — asymmetric: one large feature card + a tighter row, not a uniform 4-col grid ===== */}
      <section id="destinations" className="px-6 lg:px-12 py-20 max-w-[1400px] mx-auto">
        <div className="w-full flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <div className="text-[11px] font-bold text-[#785900] tracking-[0.2em] uppercase">✦ Tuyến đường được đặt nhiều nhất</div>
            <h2 className="text-3xl md:text-5xl font-display font-medium text-[#0D1C2E]">Điểm đến <span className="italic text-[#785900]">nổi bật</span></h2>
          </div>

          {filteredRoutes.length > 0 ? (
            <CoverflowCarousel
              sectionLabel="ĐIỂM ĐẾN ĐƯỢC ĐẶT NHIỀU NHẤT"
              items={filteredRoutes.map(r => ({
                tag: r.rating ? `★ ${r.rating} (${r.reviewCount})` : undefined,
                title: r.location,
                desc: r.desc,
                img: r.heroImg,
                ctaText: 'Xem tuyến',
                href: `/destinations/${r.slug}`,
              }))}
              onNavigate={(href) => navigate(href)}
            />
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-[#585E6C] bg-white rounded-xl border border-dashed border-[#D4C5AB]">
              <Search size={32} className="mb-3 text-[#D4C5AB]" />
              <span className="text-sm font-semibold">Không tìm thấy điểm đến nào</span>
            </div>
          )}

        </div>
      </section>

      {/* ===== PROMO BANNER ===== */}
      <section id="promo" className="px-6 lg:px-12 py-20 max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[2rem] overflow-hidden h-[320px] flex items-center px-10 md:px-16"
        >
          {banner?.imageUrl ? (
            <img src={banner.imageUrl} alt={banner.title} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            // No real banner from the API — a plain brand gradient instead of an unverified stock photo.
            <div className="absolute inset-0" style={{ background: 'linear-gradient(120deg, #0f1c14, #1c3524, #2f4f38, #4a6858)' }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#163328]/95 to-[#163328]/50" />

          <div className="relative z-10 text-white max-w-lg">
            <div className="text-sm font-semibold text-secondary mb-3 tracking-wide uppercase">Ưu đãi có giới hạn</div>
            {banner ? (
              <h2 className="text-4xl md:text-5xl font-display font-medium mb-4">{banner.title}</h2>
            ) : (
              <h2 className="text-4xl md:text-5xl font-display font-medium mb-4">
                Giảm đến <span className="text-secondary italic text-6xl">30%</span> chuyến đầu tiên
              </h2>
            )}
            <p className="text-lg text-white/90 mb-8 font-light">Ưu đãi dành cho hành khách đặt vé lần đầu qua ứng dụng An Chuyến.</p>
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
              Xem ưu đãi <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      </section>

      {/* ===== CUSTOMER REVIEWS ===== */}
      {reviews.length > 0 && (
        <section className="px-6 lg:px-12 py-16 max-w-[1400px] mx-auto">
          <div className="w-full px-4 lg:px-8">
            <div className="text-[11px] font-bold text-secondary tracking-[0.2em] uppercase mb-2">✦ Khách hàng nói gì</div>
            <h2 className="text-3xl md:text-4xl font-display text-[#1a1a1a] font-medium mb-8">Đánh giá từ hành khách</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.slice(0, 6).map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                  className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <Star key={si} size={14} className={si < r.rating ? 'text-secondary fill-secondary' : 'text-gray-200 fill-gray-200'} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-4">{r.text}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
                      {r.avatar?.startsWith('http') ? (
                        <img src={r.avatar} alt={r.name} className="w-full h-full object-cover" />
                      ) : (
                        r.avatar || r.name?.charAt(0)
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#1a1a1a]">{r.name}</div>
                      <div className="text-xs text-gray-400">{r.route}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
