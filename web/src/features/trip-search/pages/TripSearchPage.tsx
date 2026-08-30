import { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Star, SortAsc, MapPin, X, Search, Loader2, Clock, ArrowRight, Users, ChevronDown, Filter } from 'lucide-react';
import { TripDetailModal } from '../../trip-detail/components/TripDetailModal';
import api from '../../../lib/api';
import type { Trip } from '../../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '../../../shared/utils/cn';

import { Check } from 'lucide-react';

/* ─── CUSTOM CHECKBOX ─── */
function FilterCheck({ checked, onChange, label, count }: { checked: boolean; onChange: () => void; label: string; count?: number }) {
  return (
    <label className="flex items-center justify-between cursor-pointer py-2.5 group select-none">
      <div className="flex items-center gap-3.5">
        <div
          onClick={(e) => { e.preventDefault(); onChange(); }}
          className={cn(
            "w-5 h-5 flex-shrink-0 border-2 rounded-md flex items-center justify-center transition-all duration-300",
            checked ? "border-primary bg-primary text-white shadow-md shadow-primary/20 scale-105" : "border-gray-200 bg-white group-hover:border-primary/50 group-hover:bg-primary/5"
          )}
        >
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Check size={14} strokeWidth={3} />
          </motion.div>
        </div>
        <span className={cn("text-[14px] transition-all duration-300 leading-snug", checked ? "text-primary font-semibold" : "text-gray-600 group-hover:text-gray-900")}>
          {label}
        </span>
      </div>
      {count !== undefined && (
        <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full transition-colors", checked ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200")}>
          {count}
        </span>
      )}
    </label>
  );
}

export function TripSearchPage() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [isEditSearchOpen, setIsEditSearchOpen] = useState(false);

  const searchOrigin = searchParams.get('origin') || '';
  const searchDestination = searchParams.get('destination') || '';
  const searchDate = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const searchPassengers = searchParams.get('passengers') || '1';

  const formattedDate = new Date(searchDate).toLocaleDateString(
    i18n.language === 'vi' ? 'vi-VN' : 'en-US',
    { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
  );

  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [sortOption, setSortOption] = useState('early');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const prevQueryRef = useRef('');
  const searchQuery = `${searchOrigin}-${searchDestination}-${searchDate}-${searchPassengers}`;

  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedOperators, setSelectedOperators] = useState<string[]>([]);

  const toggle = (set: React.Dispatch<React.SetStateAction<any[]>>, val: any) =>
    set(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);

  const [editOrigin, setEditOrigin] = useState(searchOrigin);
  const [editDestination, setEditDestination] = useState(searchDestination);
  const [editDate, setEditDate] = useState(searchDate);
  const [editPassengers, setEditPassengers] = useState(searchPassengers);

  const handleEditSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (editOrigin) p.append('origin', editOrigin);
    if (editDestination) p.append('destination', editDestination);
    if (editDate) p.append('date', editDate);
    if (editPassengers) p.append('passengers', editPassengers.toString());
    setSearchParams(p);
    setIsEditSearchOpen(false);
  };

  useEffect(() => {
    const queryChanged = prevQueryRef.current !== searchQuery;
    prevQueryRef.current = searchQuery;
    let targetPage = page;
    if (queryChanged) { targetPage = 1; setPage(1); }

    const fetchTrips = async (p: number) => {
      try {
        if (p === 1) setInitialLoading(true);
        else setIsLoadingMore(true);
        const res = await api.get('/trips', {
          params: { origin: searchOrigin, destination: searchDestination, date: searchDate, passengers: searchPassengers, page: p, limit: PAGE_SIZE }
        });
        if (res.data?.data) {
          const mapped = res.data.data.map((item: any) => {
            const dep = new Date(item.departureTime);
            const arr = new Date(item.arrivalTime);
            const diffMs = arr.getTime() - dep.getTime();
            const h = Math.floor(diffMs / 3600000);
            const m = Math.floor((diffMs % 3600000) / 60000);
            const pickup = item.checkpoints?.find((c: any) => c.type === 'PICKUP');
            const dropoff = item.checkpoints?.find((c: any) => c.type === 'DROPOFF');
            return {
              id: item.id,
              company: item.trip?.busAgent?.name || 'Không xác định',
              type: 'Giường nằm',
              depTime: dep.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              arrTime: arr.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              duration: `${h}h${m > 0 ? m : ''}`,
              from: item.trip?.route?.departureCity?.name || 'Không xác định',
              to: item.trip?.route?.arrivalCity?.name || 'Không xác định',
              pickupStation: pickup?.station?.name || item.trip?.route?.departureCity?.name || 'Không xác định',
              dropoffStation: dropoff?.station?.name || item.trip?.route?.arrivalCity?.name || 'Không xác định',
              price: item.prices?.[0]?.price || 350000,
              emptySeats: item.availableSeats,
              rating: item.avgRating || 0,
              reviews: item.reviewCount || 0,
              promo: false, amenities: ['wifi', 'water'],
            };
          });
          if (p === 1) {
            setTrips(mapped);
          } else {
            setTrips(prev => [...prev, ...mapped]);
          }
          setHasMore(mapped.length === PAGE_SIZE);
        } else {
          if (p === 1) setTrips([]);
          setHasMore(false);
        }
      } catch {
        if (p === 1) setTrips([]);
        setHasMore(false);
      } finally {
        setInitialLoading(false);
        setIsLoadingMore(false);
      }
    };

    if (!queryChanged || page === 1) fetchTrips(targetPage);
  }, [searchOrigin, searchDestination, searchDate, searchPassengers, page]);

  const dynamicOperators = useMemo(() => {
    const counts: Record<string, number> = {};
    trips.forEach(t => { counts[t.company] = (counts[t.company] || 0) + 1; });
    return Object.entries(counts).map(([name, count], i) => ({ id: `o${i}`, label: name, count }));
  }, [trips]);

  const filteredTrips = useMemo(() => {
    let r = [...trips];
    if (selectedTimes.length > 0) {
      r = r.filter(t => {
        const h = parseInt(t.depTime.split(':')[0]) + (t.depTime.includes('PM') && !t.depTime.startsWith('12') ? 12 : 0);
        return selectedTimes.some(id =>
          id === 't1' ? h >= 0 && h < 6
          : id === 't2' ? h >= 6 && h < 12
          : id === 't3' ? h >= 12 && h < 18
          : h >= 18
        );
      });
    }
    if (selectedPrices.length > 0) {
      r = r.filter(t => selectedPrices.some(id =>
        id === 'p1' ? t.price < 200000 : id === 'p2' ? t.price <= 400000 : t.price > 400000
      ));
    }
    if (selectedRatings.length > 0) r = r.filter(t => selectedRatings.some(v => t.rating >= v));
    if (selectedOperators.length > 0) r = r.filter(t => selectedOperators.includes(t.company));
    r.sort((a, b) => {
      if (sortOption === 'price_asc') return a.price - b.price;
      if (sortOption === 'price_desc') return b.price - a.price;
      if (sortOption === 'rating') return b.rating - a.rating;
      if (sortOption === 'fastest') {
        const mins = (d: string) => { const m = d.match(/(\d+)h(\d*)/); return m ? +m[1] * 60 + (+m[2] || 0) : 0; };
        return mins(a.duration) - mins(b.duration);
      }
      return a.depTime.localeCompare(b.depTime);
    });
    return r;
  }, [trips, selectedTimes, selectedPrices, selectedRatings, selectedOperators, sortOption]);

  const filterPanel = (
    <div className="flex flex-col gap-6">
      {/* Time */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={16} className="text-primary" />
          <div className="text-sm font-bold text-gray-900 tracking-wide uppercase">
            Giờ khởi hành
          </div>
        </div>
        <div className="flex flex-col gap-1">
          {[
            { id: 't1', label: 'Sáng sớm (00:00 – 06:00)' },
            { id: 't2', label: 'Buổi sáng (06:00 – 12:00)' },
            { id: 't3', label: 'Buổi chiều (12:00 – 18:00)' },
            { id: 't4', label: 'Buổi tối (18:00 – 24:00)' },
          ].map(f => (
            <FilterCheck key={f.id} checked={selectedTimes.includes(f.id)} onChange={() => toggle(setSelectedTimes, f.id)} label={f.label} />
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-primary font-bold">₫</span>
          <div className="text-sm font-bold text-gray-900 tracking-wide uppercase">
            Mức giá
          </div>
        </div>
        <div className="flex flex-col gap-1">
          {[
            { id: 'p1', label: 'Dưới 200.000₫' },
            { id: 'p2', label: '200.000₫ – 400.000₫' },
            { id: 'p3', label: 'Trên 400.000₫' },
          ].map(f => (
            <FilterCheck key={f.id} checked={selectedPrices.includes(f.id)} onChange={() => toggle(setSelectedPrices, f.id)} label={f.label} />
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2 mb-4">
          <Star size={16} className="text-primary" />
          <div className="text-sm font-bold text-gray-900 tracking-wide uppercase">
            Đánh giá
          </div>
        </div>
        <div className="flex flex-col gap-1">
          {[5, 4, 3].map(r => (
            <FilterCheck key={r} checked={selectedRatings.includes(r)} onChange={() => toggle(setSelectedRatings, r)}
              label={`Từ ${r} sao`} />
          ))}
        </div>
      </div>

      {dynamicOperators.length > 0 && (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-2 mb-4">
            <Users size={16} className="text-primary" />
            <div className="text-sm font-bold text-gray-900 tracking-wide uppercase">
              Nhà xe
            </div>
          </div>
          <div className="flex flex-col gap-1 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {dynamicOperators.map(op => (
              <FilterCheck key={op.id} checked={selectedOperators.includes(op.label)} onChange={() => toggle(setSelectedOperators, op.label)} label={op.label} count={op.count} />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-background text-foreground pt-20">

      {/* ─── STICKY HEADER ─── */}
      <div className="sticky top-16 z-40 bg-background/90 backdrop-blur-xl border-b border-gray-100 px-6 lg:px-16 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between py-4 gap-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-muted-foreground hover:bg-white hover:shadow-md hover:text-primary transition-all shrink-0 bg-white">
              <ArrowLeft size={18} />
            </Link>

            <div className="w-px h-8 bg-gray-200 hidden md:block" />

            <div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-[#1a1a1a]">
                  {searchOrigin || 'Mọi nơi'}
                </span>
                <ArrowRight size={14} className="text-primary" />
                <span className="text-lg font-bold text-[#1a1a1a]">
                  {searchDestination || 'Mọi nơi'}
                </span>
              </div>
              <div className="text-sm text-muted-foreground mt-1 font-light">
                {formattedDate} · {searchPassengers} hành khách
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditSearchOpen(true)}
            className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-muted-foreground hover:text-primary px-6 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all hover:shadow-md w-full md:w-auto"
          >
            <Search size={14} /> Sửa tìm kiếm
          </button>
        </div>
      </div>

      {/* ─── BODY ─── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-12 flex flex-col lg:flex-row gap-12">

        {/* ─── SIDEBAR ─── */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-44">
            <div className="flex items-center gap-3 text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground mb-8">
              <div className="w-6 h-px bg-gray-300" />
              Bộ lọc
            </div>
            {filterPanel}
          </div>
        </aside>

        {/* ─── MAIN ─── */}
        <main className="flex-1">

          {/* Results header */}
          <div className="flex items-center justify-between mb-8 gap-4">
            <div className="flex items-baseline gap-2 shrink-0">
              <span className="text-3xl font-bold text-[#1a1a1a]">
                {filteredTrips.length}
              </span>
              <span className="text-muted-foreground text-sm hidden sm:inline">
                chuyến xe
              </span>
            </div>

            <div className="flex items-center gap-2 flex-1 justify-end">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-shadow text-primary text-xs font-bold tracking-widest uppercase"
              >
                <Filter size={14} />
                <span className="hidden sm:inline">Lọc</span>
              </button>

              {/* Sort */}
              <div className="flex items-center gap-2 relative bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-shadow shrink-0">
                <SortAsc size={14} className="text-primary" />
                <select
                  value={sortOption}
                  onChange={e => setSortOption(e.target.value)}
                  className="bg-transparent border-none outline-none text-primary text-xs font-bold tracking-widest uppercase cursor-pointer appearance-none pr-4"
                >
                  <option value="early">Giờ sớm nhất</option>
                  <option value="price_asc">Giá thấp nhất</option>
                  <option value="price_desc">Giá cao nhất</option>
                  <option value="rating">Đánh giá cao</option>
                  <option value="fastest">Nhanh nhất</option>
                </select>
                <ChevronDown size={12} className="text-primary absolute right-4 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Trip list */}
          {initialLoading ? (
            <div className="flex flex-col gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-40 bg-white border border-gray-100 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : filteredTrips.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-3xl border border-gray-50 shadow-sm">
              <div className="text-7xl text-primary/20 mb-6">✦</div>
              <p className="text-2xl font-bold text-[#1a1a1a] mb-2">
                Không tìm thấy chuyến xe
              </p>
              <p className="text-muted-foreground">
                Thử thay đổi bộ lọc hoặc chọn ngày khác.
              </p>
            </div>
          ) : (
            <AnimatePresence>
              <div className="flex flex-col gap-6">
                {filteredTrips.map((trip, idx) => (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.5 }}
                    className="group bg-white border border-gray-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(212,175,55,0.08)] flex flex-col md:flex-row overflow-hidden transition-all duration-500 hover:-translate-y-1 relative"
                  >
                    {/* Image */}
                    <div className="w-full md:w-56 h-48 md:h-auto relative overflow-hidden shrink-0">
                      <motion.img
                        whileHover={{ scale: 1.1 }} transition={{ duration: 0.6 }}
                        src={idx % 2 === 0
                          ? 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=400&auto=format&fit=crop'
                          : 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=400&auto=format&fit=crop'}
                        alt="Bus"
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40 hidden md:block" />
                      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-primary px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm">
                        {trip.type}
                      </div>
                    </div>

                    {/* Dashed divider (Desktop) */}
                    <div className="hidden md:block w-px border-l-2 border-dashed border-gray-100 relative mx-4">
                      <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-[#fbf9f6] border border-gray-100 shadow-inner" />
                      <div className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-[#fbf9f6] border border-gray-100 shadow-inner" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 p-6 md:py-8 md:px-2 flex flex-col justify-between">
                      {/* Operator + rating */}
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-2xl font-bold text-[#1a1a1a]">
                          {trip.company}
                        </span>
                        {trip.rating > 0 && (
                          <div className="flex items-center gap-1.5 text-xs text-primary font-bold bg-primary/5 px-2 py-1 rounded-full border border-primary/10">
                            <Star size={12} className="fill-primary" /> {trip.rating}
                            <span className="text-muted-foreground font-normal">({trip.reviews})</span>
                          </div>
                        )}
                      </div>

                      {/* Time + route */}
                      <div className="flex items-center gap-6">
                        <div className="text-center shrink-0">
                          <div className="text-3xl font-bold text-[#1a1a1a] leading-none">
                            {trip.depTime}
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-2 uppercase tracking-wider">{trip.from}</div>
                        </div>

                        <div className="flex-1 flex flex-col items-center gap-2">
                          <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                            <Clock size={12} /> {trip.duration}
                          </div>
                          <div className="w-full h-px bg-[repeating-linear-gradient(to_right,rgba(212,175,55,0.4)_0,rgba(212,175,55,0.4)_4px,transparent_4px,transparent_8px)]" />
                          <ArrowRight size={14} className="text-primary" />
                        </div>

                        <div className="text-center shrink-0">
                          <div className="text-3xl font-bold text-gray-400 leading-none">
                            {trip.arrTime}
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-2 uppercase tracking-wider">{trip.to}</div>
                        </div>
                      </div>

                      {/* Stations */}
                      <div className="flex items-center gap-2 mt-6 text-[11px] text-muted-foreground uppercase tracking-wider bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                        <MapPin size={12} className="text-primary shrink-0" />
                        <span className="truncate">{trip.pickupStation}</span>
                        <span className="text-gray-300">→</span>
                        <span className="truncate">{trip.dropoffStation}</span>
                      </div>
                    </div>

                    {/* Dashed divider (Desktop) */}
                    <div className="hidden md:block w-px border-l-2 border-dashed border-gray-100 relative mx-4">
                      <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-[#fbf9f6] border border-gray-100 shadow-inner" />
                      <div className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-[#fbf9f6] border border-gray-100 shadow-inner" />
                    </div>

                    {/* Price + CTA */}
                    <div className="p-6 md:w-56 flex flex-col items-end md:justify-center justify-between gap-6 md:gap-8 bg-gray-50/30">
                      <div className="text-right w-full">
                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-2">Giá vé từ</div>
                        <div className="text-3xl font-bold text-primary leading-none">
                          {new Intl.NumberFormat('vi-VN').format(trip.price)}₫
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 w-full">
                        <div className={cn("text-xs flex items-center justify-end gap-1.5 font-medium", trip.emptySeats <= 5 ? 'text-red-500' : 'text-muted-foreground')}>
                          <Users size={14} /> Còn {trip.emptySeats} chỗ
                        </div>
                        <button
                          onClick={() => navigate(`/seat-selection/${trip.id}`)}
                          className="w-full bg-[#1a1a1a] hover:bg-black text-white py-4 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                        >
                          Chọn chuyến
                        </button>
                        <button
                          onClick={() => setSelectedTrip(trip)}
                          className="w-full bg-white border border-gray-200 hover:border-primary text-muted-foreground hover:text-primary py-3 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all"
                        >
                          Chi tiết
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}

          {/* Load more */}
          {hasMore && filteredTrips.length > 0 && (
            <div className="flex justify-center mt-12">
              <button
                onClick={() => !isLoadingMore && setPage(p => p + 1)}
                disabled={isLoadingMore}
                className="flex items-center gap-3 bg-white border border-gray-200 text-muted-foreground hover:text-primary hover:border-primary px-8 py-4 rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-sm hover:shadow-md disabled:opacity-50"
              >
                {isLoadingMore ? <><Loader2 size={16} className="animate-spin" /> Đang tải...</> : 'Hiển thị thêm'}
              </button>
            </div>
          )}
        </main>
      </div>

      {/* ─── EDIT SEARCH MODAL ─── */}
      <AnimatePresence>
        {isEditSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsEditSearchOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-[#1a1a1a] m-0">
                  Sửa tìm kiếm
                </h3>
                <button onClick={() => setIsEditSearchOpen(false)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-muted-foreground hover:bg-gray-100 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleEditSearch} className="flex flex-col gap-6">
                {[
                  { label: 'Điểm đi', value: editOrigin, onChange: setEditOrigin, placeholder: 'Hà Nội, Đà Nẵng...' },
                  { label: 'Điểm đến', value: editDestination, onChange: setEditDestination, placeholder: 'TP. Hồ Chí Minh...' },
                ].map(f => (
                  <div key={f.label}>
                    <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary mb-2">
                      {f.label}
                    </div>
                    <input
                      type="text" value={f.value} onChange={e => f.onChange(e.target.value)} placeholder={f.placeholder}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-[#1a1a1a] text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                ))}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary mb-2">Ngày đi</div>
                    <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-[#1a1a1a] text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary mb-2">Hành khách</div>
                    <select value={editPassengers} onChange={e => setEditPassengers(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-[#1a1a1a] text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
                    >
                      {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} người</option>)}
                    </select>
                  </div>
                </div>

                <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white py-5 rounded-xl text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-3 mt-4 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                  <Search size={16} /> Tìm chuyến mới
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── MOBILE FILTER MODAL ─── */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex lg:hidden bg-black/40 backdrop-blur-sm"
          >
            <div className="absolute inset-0" onClick={() => setMobileFilterOpen(false)} />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 max-h-[90vh] bg-[#fbf9f6] rounded-t-3xl shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 shrink-0 bg-white rounded-t-3xl">
                <h3 className="text-2xl font-bold text-[#1a1a1a] m-0">Bộ lọc</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-muted-foreground hover:bg-gray-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto custom-scrollbar">
                {filterPanel}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 shrink-0 bg-white">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl text-xs font-bold tracking-widest uppercase shadow-lg transition-all"
                >
                  Xem {filteredTrips.length} chuyến xe
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── TRIP DETAIL MODAL ─── */}
      <TripDetailModal isOpen={!!selectedTrip} onClose={() => setSelectedTrip(null)} trip={selectedTrip} />
    </motion.div>
  );
}
