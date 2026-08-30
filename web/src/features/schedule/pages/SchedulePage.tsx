import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, ChevronDown, ArrowRight, Users, Calendar } from 'lucide-react';

/* ─── DATA ─── */
const ROUTES = [
  'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Huế', 'Nha Trang', 'Sapa', 'Hội An', 'Đà Lạt', 'Cần Thơ', 'Hải Phòng',
];

const SCHEDULES = [
  { id: 1, from: 'Hà Nội', to: 'Sapa', dep: '06:00', arr: '10:30', duration: '4g 30p', operator: 'An Chuyến Express', seats: 12, price: 280000, type: 'VIP Giường nằm', date: '2026-08-21', slot: 'Sáng' },
  { id: 2, from: 'Hà Nội', to: 'Sapa', dep: '08:30', arr: '13:00', duration: '4g 30p', operator: 'An Chuyến Limousine', seats: 4, price: 350000, type: 'Limousine 9 chỗ', date: '2026-08-21', slot: 'Sáng' },
  { id: 3, from: 'Hà Nội', to: 'Sapa', dep: '10:00', arr: '14:30', duration: '4g 30p', operator: 'An Chuyến Express', seats: 22, price: 260000, type: 'Ghế ngồi', date: '2026-08-21', slot: 'Sáng' },
  { id: 4, from: 'Hà Nội', to: 'Sapa', dep: '13:30', arr: '18:00', duration: '4g 30p', operator: 'An Chuyến VIP', seats: 8, price: 380000, type: 'VIP Phòng đôi', date: '2026-08-21', slot: 'Chiều' },
  { id: 5, from: 'Hà Nội', to: 'Sapa', dep: '15:00', arr: '19:30', duration: '4g 30p', operator: 'An Chuyến Express', seats: 16, price: 270000, type: 'Giường nằm', date: '2026-08-21', slot: 'Chiều' },
  { id: 6, from: 'Hà Nội', to: 'Sapa', dep: '20:00', arr: '00:30', duration: '4g 30p', operator: 'An Chuyến Sleeper', seats: 20, price: 300000, type: 'Giường nằm đêm', date: '2026-08-21', slot: 'Tối' },
  { id: 7, from: 'Hà Nội', to: 'Sapa', dep: '22:00', arr: '02:30', duration: '4g 30p', operator: 'An Chuyến Limousine', seats: 6, price: 420000, type: 'Limousine đêm', date: '2026-08-21', slot: 'Tối' },

  { id: 8, from: 'TP. Hồ Chí Minh', to: 'Đà Lạt', dep: '07:00', arr: '13:30', duration: '6g 30p', operator: 'An Chuyến Express', seats: 18, price: 220000, type: 'Ghế ngồi', date: '2026-08-21', slot: 'Sáng' },
  { id: 9, from: 'TP. Hồ Chí Minh', to: 'Đà Lạt', dep: '14:00', arr: '20:30', duration: '6g 30p', operator: 'An Chuyến VIP', seats: 9, price: 320000, type: 'VIP Giường nằm', date: '2026-08-21', slot: 'Chiều' },
  { id: 10, from: 'TP. Hồ Chí Minh', to: 'Đà Lạt', dep: '21:00', arr: '03:30', duration: '6g 30p', operator: 'An Chuyến Sleeper', seats: 24, price: 250000, type: 'Giường nằm đêm', date: '2026-08-21', slot: 'Tối' },

  { id: 11, from: 'Đà Nẵng', to: 'Huế', dep: '06:30', arr: '09:00', duration: '2g 30p', operator: 'An Chuyến Express', seats: 30, price: 120000, type: 'Ghế ngồi', date: '2026-08-21', slot: 'Sáng' },
  { id: 12, from: 'Đà Nẵng', to: 'Huế', dep: '11:00', arr: '13:30', duration: '2g 30p', operator: 'An Chuyến VIP', seats: 14, price: 180000, type: 'Limousine 9 chỗ', date: '2026-08-21', slot: 'Sáng' },
  { id: 13, from: 'Đà Nẵng', to: 'Huế', dep: '16:30', arr: '19:00', duration: '2g 30p', operator: 'An Chuyến Express', seats: 28, price: 130000, type: 'Ghế ngồi', date: '2026-08-21', slot: 'Chiều' },
];

const SLOT_TABS = ['Tất cả', 'Sáng', 'Chiều', 'Tối'];
const SORT_OPTIONS = ['Giờ sớm nhất', 'Giá thấp nhất', 'Giá cao nhất', 'Còn nhiều chỗ'];

const POPULAR_ROUTES = [
  { from: 'Hà Nội', to: 'Sapa', duration: '4g 30p', from_img: '🏙️', to_img: '⛰️' },
  { from: 'TP. Hồ Chí Minh', to: 'Đà Lạt', duration: '6g 30p', from_img: '🌆', to_img: '🌿' },
  { from: 'Đà Nẵng', to: 'Huế', duration: '2g 30p', from_img: '🌊', to_img: '🏯' },
  { from: 'Hà Nội', to: 'Hải Phòng', duration: '2g', from_img: '🏙️', to_img: '⚓' },
];

/* ─── SELECT DROPDOWN ─── */
function RouteSelect({ value, onChange, label, options }: { value: string; onChange: (v: string) => void; label: string; options: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative', flex: 1 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12,
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '16px 0', textAlign: 'left',
        }}
      >
        <MapPin size={14} style={{ color: '#163328', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', fontFamily: 'system-ui', marginBottom: 4 }}>
            {label}
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a', fontFamily: 'system-ui' }}>
            {value || 'Chọn địa điểm'}
          </div>
        </div>
        <ChevronDown size={14} style={{ color: 'rgba(0,0,0,0.3)', flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
              background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)',
              boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
              maxHeight: 280, overflowY: 'auto',
            }}
          >
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '12px 16px', background: opt === value ? 'rgba(22,51,40,0.1)' : 'none',
                  border: 'none', cursor: 'pointer',
                  fontSize: 13, color: opt === value ? '#163328' : 'rgba(0,0,0,0.7)',
                  fontFamily: 'system-ui', transition: 'all 0.15s',
                  borderLeft: opt === value ? '2px solid #163328' : '2px solid transparent',
                }}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── SCHEDULE CARD ─── */
function ScheduleCard({ item, index }: { item: typeof SCHEDULES[0]; index: number }) {
  const lowSeats = item.seats <= 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      style={{
        display: 'grid',
        gridTemplateColumns: '100px 1fr 160px 140px 140px',
        alignItems: 'center', gap: 0,
        background: 'rgba(0,0,0,0.025)',
        border: '1px solid rgba(0,0,0,0.07)',
        padding: '0 24px',
        transition: 'border-color 0.25s, background 0.25s',
        cursor: 'pointer',
      }}
      whileHover={{ borderColor: 'rgba(22,51,40,0.3)', backgroundColor: 'rgba(22,51,40,0.03)' }}
    >
      {/* Time */}
      <div style={{ padding: '22px 0', borderRight: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 600, color: '#1a1a1a', lineHeight: 1 }}>
          {item.dep}
        </div>
        <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.35)', fontFamily: 'system-ui', marginTop: 4, letterSpacing: '0.05em' }}>
          → {item.arr}
        </div>
      </div>

      {/* Route + operator */}
      <div style={{ padding: '22px 24px', borderRight: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', fontFamily: 'system-ui' }}>{item.from}</span>
          <ArrowRight size={11} style={{ color: '#163328', flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', fontFamily: 'system-ui' }}>{item.to}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 10, color: 'rgba(0,0,0,0.35)', fontFamily: 'system-ui' }}>{item.operator}</span>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.25)', fontFamily: 'system-ui', padding: '2px 8px', border: '1px solid rgba(0,0,0,0.08)' }}>
            {item.type}
          </span>
        </div>
      </div>

      {/* Duration */}
      <div style={{ padding: '22px 20px', borderRight: '1px solid rgba(0,0,0,0.06)', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12, color: 'rgba(0,0,0,0.5)', fontFamily: 'system-ui' }}>
          <Clock size={11} style={{ color: '#163328' }} /> {item.duration}
        </div>
      </div>

      {/* Seats */}
      <div style={{ padding: '22px 20px', borderRight: '1px solid rgba(0,0,0,0.06)', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
          <Users size={11} style={{ color: lowSeats ? '#e05c5c' : 'rgba(0,0,0,0.3)' }} />
          <span style={{ fontSize: 12, fontFamily: 'system-ui', color: lowSeats ? '#e05c5c' : 'rgba(0,0,0,0.55)', fontWeight: lowSeats ? 700 : 400 }}>
            {item.seats} chỗ
          </span>
        </div>
        {lowSeats && (
          <div style={{ fontSize: 9, color: '#e05c5c', fontFamily: 'system-ui', letterSpacing: '0.1em', marginTop: 4 }}>
            SẮP HẾT
          </div>
        )}
      </div>

      {/* Price + CTA */}
      <div style={{ padding: '22px 0 22px 20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
        <div>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#163328', fontFamily: 'system-ui', textAlign: 'right' }}>
            {item.price.toLocaleString('vi-VN')}₫
          </div>
          <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.3)', fontFamily: 'system-ui', textAlign: 'right', marginTop: 2 }}>
            / người
          </div>
        </div>
        <button style={{
          background: '#163328', color: '#fcfcfc', border: 'none',
          padding: '8px 20px', cursor: 'pointer',
          fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
          fontFamily: 'system-ui', whiteSpace: 'nowrap',
        }}>
          Đặt vé
        </button>
      </div>
    </motion.div>
  );
}

/* ─── PAGE ─── */
export function SchedulePage() {
  const today = new Date().toISOString().split('T')[0];
  const [fromCity, setFromCity] = useState('Hà Nội');
  const [toCity, setToCity] = useState('Sapa');
  const [date, setDate] = useState(today);
  const [slotFilter, setSlotFilter] = useState('Tất cả');
  const [sortBy, setSortBy] = useState(SORT_OPTIONS[0]);
  const [searched, setSearched] = useState(true);

  const handleSearch = () => setSearched(true);

  let results = SCHEDULES.filter(s =>
    s.from === fromCity && s.to === toCity
  );

  if (slotFilter !== 'Tất cả') results = results.filter(s => s.slot === slotFilter);

  if (sortBy === 'Giá thấp nhất') results = [...results].sort((a, b) => a.price - b.price);
  else if (sortBy === 'Giá cao nhất') results = [...results].sort((a, b) => b.price - a.price);
  else if (sortBy === 'Còn nhiều chỗ') results = [...results].sort((a, b) => b.seats - a.seats);
  else results = [...results].sort((a, b) => a.dep.localeCompare(b.dep));

  return (
    <div style={{ background: '#fcfcfc', color: '#1a1a1a', minHeight: '100vh' }}>

      {/* ─── HERO / SEARCH ─── */}
      <section style={{ position: 'relative', paddingTop: 120, paddingBottom: 0 }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600&auto=format&fit=crop"
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.12) saturate(0.5)' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(255,255,255,0.5) 0%, #fcfcfc 100%)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 10, padding: '0 8% 80px' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            {/* Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 24, height: 1, background: '#163328' }} />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#163328', fontFamily: 'system-ui' }}>
                Lịch chạy xe
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(2.5rem, 4vw, 4.5rem)',
              fontWeight: 400, color: '#1a1a1a', lineHeight: 1.1,
              margin: '0 0 12px',
            }}>
              Tìm chuyến xe <em style={{ color: '#163328' }}>phù hợp</em>
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(0,0,0,0.45)', fontFamily: 'system-ui', margin: '0 0 48px' }}>
              Hàng trăm chuyến xe mỗi ngày — đặt vé trong 60 giây.
            </p>

            {/* Search bar */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1px 1fr 1px auto auto',
              alignItems: 'stretch', gap: 0,
              background: 'rgba(0,0,0,0.04)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0,0,0,0.1)',
              maxWidth: 900,
            }}>
              {/* From */}
              <div style={{ padding: '0 24px' }}>
                <RouteSelect value={fromCity} onChange={setFromCity} label="Điểm đi" options={ROUTES} />
              </div>

              <div style={{ background: 'rgba(0,0,0,0.07)', width: 1 }} />

              {/* To */}
              <div style={{ padding: '0 24px' }}>
                <RouteSelect value={toCity} onChange={setToCity} label="Điểm đến" options={ROUTES} />
              </div>

              <div style={{ background: 'rgba(0,0,0,0.07)', width: 1 }} />

              {/* Date */}
              <div style={{ padding: '0 20px', display: 'flex', alignItems: 'center', gap: 10, minWidth: 160 }}>
                <Calendar size={14} style={{ color: '#163328', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', fontFamily: 'system-ui', marginBottom: 4 }}>
                    Ngày đi
                  </div>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    style={{
                      background: 'none', border: 'none', outline: 'none',
                      color: '#1a1a1a', fontSize: 14, fontWeight: 600,
                      fontFamily: 'system-ui', cursor: 'pointer',
                      colorScheme: 'dark',
                    }}
                  />
                </div>
              </div>

              {/* Search button */}
              <button
                onClick={handleSearch}
                style={{
                  background: '#163328', color: '#fcfcfc', border: 'none',
                  padding: '0 36px', cursor: 'pointer',
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
                  fontFamily: 'system-ui', whiteSpace: 'nowrap', flexShrink: 0,
                }}
              >
                Tìm chuyến
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── POPULAR ROUTES ─── */}
      {!searched && (
        <section style={{ padding: '0 8% 80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <div style={{ width: 20, height: 1, background: '#163328' }} />
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#163328', fontFamily: 'system-ui' }}>
              Tuyến phổ biến
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {POPULAR_ROUTES.map((r, i) => (
              <button
                key={i}
                onClick={() => { setFromCity(r.from); setToCity(r.to); setSearched(true); }}
                style={{
                  background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)',
                  padding: '20px', cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: '#1a1a1a', fontFamily: 'system-ui', fontWeight: 600 }}>{r.from}</span>
                  <ArrowRight size={10} style={{ color: '#163328' }} />
                  <span style={{ fontSize: 12, color: '#1a1a1a', fontFamily: 'system-ui', fontWeight: 600 }}>{r.to}</span>
                </div>
                <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.35)', fontFamily: 'system-ui', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={9} /> {r.duration}
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ─── RESULTS ─── */}
      {searched && (
        <section style={{ padding: '0 8% 100px' }}>

          {/* Results header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', fontWeight: 500, color: '#1a1a1a' }}>
                  {fromCity}
                </span>
                <ArrowRight size={16} style={{ color: '#163328' }} />
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', fontWeight: 500, color: '#1a1a1a' }}>
                  {toCity}
                </span>
              </div>
              <p style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)', fontFamily: 'system-ui', margin: 0 }}>
                {results.length} chuyến · {new Date(date).toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>

            {/* Sort */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 10, color: 'rgba(0,0,0,0.3)', fontFamily: 'system-ui', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Sắp xếp:
              </span>
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => setSortBy(opt)}
                  style={{
                    background: 'none', border: sortBy === opt ? '1px solid rgba(22,51,40,0.5)' : '1px solid rgba(0,0,0,0.08)',
                    padding: '6px 14px', cursor: 'pointer',
                    fontSize: 10, fontFamily: 'system-ui', fontWeight: 600, letterSpacing: '0.05em',
                    color: sortBy === opt ? '#163328' : 'rgba(0,0,0,0.4)',
                    transition: 'all 0.2s',
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Slot filter tabs */}
          <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(0,0,0,0.06)', marginBottom: 32 }}>
            {SLOT_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setSlotFilter(tab)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '14px 24px',
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                  fontFamily: 'system-ui',
                  color: slotFilter === tab ? '#163328' : 'rgba(0,0,0,0.3)',
                  borderBottom: slotFilter === tab ? '2px solid #163328' : '2px solid transparent',
                  transition: 'all 0.2s',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Schedule list */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${fromCity}-${toCity}-${slotFilter}-${sortBy}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
            >
              {results.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(0,0,0,0.3)', fontFamily: 'system-ui' }}>
                  <div style={{ fontSize: 40, marginBottom: 16 }}>🚌</div>
                  Không tìm thấy chuyến xe phù hợp.
                </div>
              ) : (
                results.map((item, i) => (
                  <ScheduleCard key={item.id} item={item} index={i} />
                ))
              )}
            </motion.div>
          </AnimatePresence>

        </section>
      )}

    </div>
  );
}
