import { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Star, SortAsc, MapPin, X, Search, Loader2, Clock, ArrowRight, Users, ChevronDown } from 'lucide-react';
import { TripDetailModal } from '../../trip-detail/components/TripDetailModal';
import api from '../../../lib/api';
import type { Trip } from '../../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

/* ─── CUSTOM CHECKBOX ─── */
function FilterCheck({ checked, onChange, label, count }: { checked: boolean; onChange: () => void; label: string; count?: number }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '6px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          onClick={onChange}
          style={{
            width: 14, height: 14, flexShrink: 0,
            border: `1px solid ${checked ? '#d4af37' : 'rgba(255,255,255,0.2)'}`,
            background: checked ? '#d4af37' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
          }}
        >
          {checked && <div style={{ width: 6, height: 6, background: '#0e1111' }} />}
        </div>
        <span style={{ fontSize: 12, color: checked ? '#d4af37' : 'rgba(240,237,230,0.6)', fontFamily: 'system-ui', transition: 'color 0.15s' }}>
          {label}
        </span>
      </div>
      {count !== undefined && (
        <span style={{ fontSize: 9, color: 'rgba(240,237,230,0.25)', fontFamily: 'system-ui', fontWeight: 700 }}>
          {count}
        </span>
      )}
    </label>
  );
}

export function TripSearchPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
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
          p === 1 ? setTrips(mapped) : setTrips(prev => [...prev, ...mapped]);
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Time */}
      <div>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#d4af37', fontFamily: 'system-ui', marginBottom: 14 }}>
          Giờ khởi hành
        </div>
        {[
          { id: 't1', label: 'Sáng sớm (00:00 – 06:00)' },
          { id: 't2', label: 'Buổi sáng (06:00 – 12:00)' },
          { id: 't3', label: 'Buổi chiều (12:00 – 18:00)' },
          { id: 't4', label: 'Buổi tối (18:00 – 24:00)' },
        ].map(f => (
          <FilterCheck key={f.id} checked={selectedTimes.includes(f.id)} onChange={() => toggle(setSelectedTimes, f.id)} label={f.label} />
        ))}
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

      {/* Price */}
      <div>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#d4af37', fontFamily: 'system-ui', marginBottom: 14 }}>
          Mức giá
        </div>
        {[
          { id: 'p1', label: 'Dưới 200.000₫' },
          { id: 'p2', label: '200.000₫ – 400.000₫' },
          { id: 'p3', label: 'Trên 400.000₫' },
        ].map(f => (
          <FilterCheck key={f.id} checked={selectedPrices.includes(f.id)} onChange={() => toggle(setSelectedPrices, f.id)} label={f.label} />
        ))}
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

      {/* Rating */}
      <div>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#d4af37', fontFamily: 'system-ui', marginBottom: 14 }}>
          Đánh giá nhà xe
        </div>
        {[5, 4, 3].map(r => (
          <FilterCheck key={r} checked={selectedRatings.includes(r)} onChange={() => toggle(setSelectedRatings, r)}
            label={`Từ ${r} ★`} />
        ))}
      </div>

      {dynamicOperators.length > 0 && (
        <>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#d4af37', fontFamily: 'system-ui', marginBottom: 14 }}>
              Nhà xe
            </div>
            {dynamicOperators.map(op => (
              <FilterCheck key={op.id} checked={selectedOperators.includes(op.label)} onChange={() => toggle(setSelectedOperators, op.label)} label={op.label} count={op.count} />
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div style={{ background: '#0e1111', minHeight: '100vh', color: '#f0ede6' }}>

      {/* ─── STICKY HEADER ─── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: 'rgba(14,17,17,0.95)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '0 8%',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Link to="/" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 36, height: 36,
              border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(240,237,230,0.5)',
              textDecoration: 'none', transition: 'all 0.2s', flexShrink: 0,
            }}>
              <ArrowLeft size={15} />
            </Link>

            <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.08)' }} />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#f0ede6', fontFamily: 'system-ui' }}>
                  {searchOrigin || 'Mọi nơi'}
                </span>
                <ArrowRight size={12} style={{ color: '#d4af37' }} />
                <span style={{ fontSize: 15, fontWeight: 700, color: '#f0ede6', fontFamily: 'system-ui' }}>
                  {searchDestination || 'Mọi nơi'}
                </span>
              </div>
              <div style={{ fontSize: 11, color: 'rgba(240,237,230,0.3)', fontFamily: 'system-ui', marginTop: 2 }}>
                {formattedDate} · {searchPassengers} hành khách
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditSearchOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(240,237,230,0.6)', padding: '8px 18px', cursor: 'pointer',
              fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
              fontFamily: 'system-ui', transition: 'all 0.2s',
            }}
          >
            <Search size={11} /> Sửa tìm kiếm
          </button>
        </div>
      </div>

      {/* ─── BODY ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 0, padding: '0 8%', paddingTop: 48 }}>

        {/* ─── SIDEBAR ─── */}
        <aside style={{ paddingRight: 40, paddingBottom: 100 }}>
          <div style={{ position: 'sticky', top: 88 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(240,237,230,0.3)', fontFamily: 'system-ui', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 16, height: 1, background: 'rgba(255,255,255,0.2)' }} />
              Bộ lọc
            </div>
            {filterPanel}
          </div>
        </aside>

        {/* ─── MAIN ─── */}
        <main style={{ borderLeft: '1px solid rgba(255,255,255,0.06)', paddingLeft: 40, paddingBottom: 100 }}>

          {/* Results header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
            <div>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 500, color: '#f0ede6' }}>
                {filteredTrips.length}
              </span>
              <span style={{ fontSize: 12, color: 'rgba(240,237,230,0.4)', fontFamily: 'system-ui', marginLeft: 8 }}>
                chuyến xe
              </span>
            </div>

            {/* Sort */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
              <SortAsc size={12} style={{ color: '#d4af37' }} />
              <select
                value={sortOption}
                onChange={e => setSortOption(e.target.value)}
                style={{
                  background: 'transparent', border: 'none', outline: 'none',
                  color: '#d4af37', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
                  textTransform: 'uppercase', fontFamily: 'system-ui', cursor: 'pointer',
                  appearance: 'none',
                }}
              >
                <option value="early" style={{ background: '#161a1a' }}>Giờ sớm nhất</option>
                <option value="price_asc" style={{ background: '#161a1a' }}>Giá thấp nhất</option>
                <option value="price_desc" style={{ background: '#161a1a' }}>Giá cao nhất</option>
                <option value="rating" style={{ background: '#161a1a' }}>Đánh giá cao</option>
                <option value="fastest" style={{ background: '#161a1a' }}>Nhanh nhất</option>
              </select>
              <ChevronDown size={10} style={{ color: '#d4af37', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* Trip list */}
          {initialLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ height: 140, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', animation: 'pulse 1.5s infinite' }} />
              ))}
            </div>
          ) : filteredTrips.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '5rem', color: 'rgba(212,175,55,0.1)', marginBottom: 20 }}>✦</div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', fontWeight: 400, color: 'rgba(240,237,230,0.4)', margin: '0 0 8px' }}>
                Không tìm thấy chuyến xe
              </p>
              <p style={{ fontSize: 12, color: 'rgba(240,237,230,0.25)', fontFamily: 'system-ui' }}>
                Thử thay đổi bộ lọc hoặc chọn ngày khác.
              </p>
            </div>
          ) : (
            <AnimatePresence>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filteredTrips.map((trip, idx) => (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04, duration: 0.4 }}
                    style={{
                      background: 'rgba(255,255,255,0.025)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      display: 'grid',
                      gridTemplateColumns: '160px 1px 1fr 1px 200px',
                      alignItems: 'stretch',
                      overflow: 'hidden',
                      transition: 'border-color 0.25s',
                    }}
                    whileHover={{ borderColor: 'rgba(212,175,55,0.3)' }}
                  >
                    {/* Image */}
                    <div style={{ position: 'relative', overflow: 'hidden' }}>
                      <img
                        src={idx % 2 === 0
                          ? 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=400&auto=format&fit=crop'
                          : 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=400&auto=format&fit=crop'}
                        alt="Bus"
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.55) saturate(0.7)', transition: 'transform 0.6s' }}
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 50%, rgba(14,17,17,0.6) 100%)' }} />
                      {/* Type badge */}
                      <div style={{ position: 'absolute', bottom: 10, left: 10, fontSize: 8, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#d4af37', fontFamily: 'system-ui' }}>
                        {trip.type}
                      </div>
                    </div>

                    {/* Dashed divider */}
                    <div style={{ borderLeft: '1px dashed rgba(255,255,255,0.08)', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%)', width: 12, height: 12, borderRadius: '50%', background: '#0e1111', border: '1px dashed rgba(255,255,255,0.1)' }} />
                      <div style={{ position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)', width: 12, height: 12, borderRadius: '50%', background: '#0e1111', border: '1px dashed rgba(255,255,255,0.1)' }} />
                    </div>

                    {/* Info */}
                    <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      {/* Operator + rating */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.15rem', fontWeight: 500, color: '#f0ede6' }}>
                          {trip.company}
                        </span>
                        {trip.rating > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#d4af37', fontFamily: 'system-ui', fontWeight: 700 }}>
                            <Star size={10} style={{ fill: '#d4af37' }} /> {trip.rating}
                            <span style={{ color: 'rgba(240,237,230,0.3)', fontWeight: 400 }}>({trip.reviews})</span>
                          </div>
                        )}
                      </div>

                      {/* Time + route */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ textAlign: 'center', flexShrink: 0 }}>
                          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 600, color: '#f0ede6', lineHeight: 1 }}>
                            {trip.depTime}
                          </div>
                          <div style={{ fontSize: 10, color: 'rgba(240,237,230,0.3)', marginTop: 2, fontFamily: 'system-ui' }}>{trip.from}</div>
                        </div>

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                          <div style={{ fontSize: 10, color: 'rgba(240,237,230,0.3)', fontFamily: 'system-ui', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Clock size={9} /> {trip.duration}
                          </div>
                          <div style={{ width: '100%', height: 1, background: 'repeating-linear-gradient(to right, rgba(212,175,55,0.3) 0, rgba(212,175,55,0.3) 4px, transparent 4px, transparent 8px)' }} />
                          <ArrowRight size={10} style={{ color: '#d4af37' }} />
                        </div>

                        <div style={{ textAlign: 'center', flexShrink: 0 }}>
                          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 600, color: 'rgba(240,237,230,0.55)', lineHeight: 1 }}>
                            {trip.arrTime}
                          </div>
                          <div style={{ fontSize: 10, color: 'rgba(240,237,230,0.3)', marginTop: 2, fontFamily: 'system-ui' }}>{trip.to}</div>
                        </div>
                      </div>

                      {/* Stations */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14, fontSize: 10, color: 'rgba(240,237,230,0.3)', fontFamily: 'system-ui' }}>
                        <MapPin size={9} style={{ color: '#d4af37', flexShrink: 0 }} />
                        <span>{trip.pickupStation}</span>
                        <span style={{ color: 'rgba(255,255,255,0.15)' }}>→</span>
                        <span>{trip.dropoffStation}</span>
                      </div>
                    </div>

                    {/* Dashed divider */}
                    <div style={{ borderLeft: '1px dashed rgba(255,255,255,0.08)', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%)', width: 12, height: 12, borderRadius: '50%', background: '#0e1111', border: '1px dashed rgba(255,255,255,0.1)' }} />
                      <div style={{ position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)', width: 12, height: 12, borderRadius: '50%', background: '#0e1111', border: '1px dashed rgba(255,255,255,0.1)' }} />
                    </div>

                    {/* Price + CTA */}
                    <div style={{ padding: '20px 20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 700, color: '#d4af37', lineHeight: 1 }}>
                          {new Intl.NumberFormat('vi-VN').format(trip.price)}₫
                        </div>
                        <div style={{ fontSize: 10, color: 'rgba(240,237,230,0.3)', fontFamily: 'system-ui', marginTop: 4 }}>/ người</div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontFamily: 'system-ui', color: trip.emptySeats <= 5 ? '#f87171' : 'rgba(240,237,230,0.3)', fontWeight: trip.emptySeats <= 5 ? 700 : 400 }}>
                        <Users size={10} /> {trip.emptySeats} chỗ trống
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                        <button
                          onClick={() => navigate(`/seat-selection/${trip.id}`)}
                          style={{
                            background: '#d4af37', color: '#0e1111', border: 'none',
                            padding: '10px 0', cursor: 'pointer', width: '100%',
                            fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                            fontFamily: 'system-ui', transition: 'opacity 0.2s',
                          }}
                        >
                          Chọn ghế
                        </button>
                        <button
                          onClick={() => setSelectedTrip(trip)}
                          style={{
                            background: 'none', border: '1px solid rgba(255,255,255,0.1)',
                            color: 'rgba(240,237,230,0.5)', padding: '8px 0', cursor: 'pointer', width: '100%',
                            fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                            fontFamily: 'system-ui', transition: 'all 0.2s',
                          }}
                        >
                          Xem chi tiết
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
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
              <button
                onClick={() => !isLoadingMore && setPage(p => p + 1)}
                disabled={isLoadingMore}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'none', border: '1px solid rgba(212,175,55,0.3)',
                  color: '#d4af37', padding: '12px 36px', cursor: isLoadingMore ? 'not-allowed' : 'pointer',
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
                  fontFamily: 'system-ui', opacity: isLoadingMore ? 0.5 : 1,
                }}
              >
                {isLoadingMore ? <><Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> Đang tải...</> : 'Xem thêm chuyến'}
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
            style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }} onClick={() => setIsEditSearchOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              style={{
                position: 'relative', background: '#161a1a', border: '1px solid rgba(255,255,255,0.1)',
                width: '100%', maxWidth: 480, padding: 40,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 500, color: '#f0ede6', margin: 0 }}>
                  Sửa tìm kiếm
                </h3>
                <button onClick={() => setIsEditSearchOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(240,237,230,0.4)', cursor: 'pointer' }}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleEditSearch} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {[
                  { label: 'Điểm đi', value: editOrigin, onChange: setEditOrigin, placeholder: 'Hà Nội, Đà Nẵng...' },
                  { label: 'Điểm đến', value: editDestination, onChange: setEditDestination, placeholder: 'TP. Hồ Chí Minh...' },
                ].map(f => (
                  <div key={f.label}>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#d4af37', fontFamily: 'system-ui', marginBottom: 8 }}>
                      {f.label}
                    </div>
                    <input
                      type="text" value={f.value} onChange={e => f.onChange(e.target.value)} placeholder={f.placeholder}
                      style={{
                        width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                        padding: '12px 16px', color: '#f0ede6', fontSize: 14, fontFamily: 'system-ui',
                        outline: 'none', boxSizing: 'border-box',
                      }}
                    />
                  </div>
                ))}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#d4af37', fontFamily: 'system-ui', marginBottom: 8 }}>Ngày đi</div>
                    <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', color: '#f0ede6', fontSize: 14, fontFamily: 'system-ui', outline: 'none', colorScheme: 'dark', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#d4af37', fontFamily: 'system-ui', marginBottom: 8 }}>Hành khách</div>
                    <select value={editPassengers} onChange={e => setEditPassengers(e.target.value)}
                      style={{ width: '100%', background: '#161a1a', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', color: '#f0ede6', fontSize: 14, fontFamily: 'system-ui', outline: 'none', boxSizing: 'border-box' }}
                    >
                      {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} người</option>)}
                    </select>
                  </div>
                </div>

                <button type="submit" style={{
                  background: '#d4af37', color: '#0e1111', border: 'none', padding: '14px',
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
                  fontFamily: 'system-ui', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8,
                }}>
                  <Search size={13} /> Tìm chuyến
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── TRIP DETAIL MODAL ─── */}
      <TripDetailModal isOpen={!!selectedTrip} onClose={() => setSelectedTrip(null)} trip={selectedTrip} />
    </div>
  );
}
