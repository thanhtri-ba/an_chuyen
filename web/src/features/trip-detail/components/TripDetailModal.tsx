import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Wifi, Droplets, Usb, ShieldAlert, MapPin, ThumbsUp, ArrowRight, Clock } from 'lucide-react';

interface TripDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: any;
}

const GALLERY = [
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1533606622442-50dffdb99e69?q=80&w=800&auto=format&fit=crop',
];

const TABS = ['Tổng quan', 'Lịch trình', 'Chính sách', 'Đánh giá'];

export function TripDetailModal({ isOpen, onClose, trip }: TripDetailModalProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [activeImg, setActiveImg] = useState(0);

  if (!trip) return null;

  const handleSelectSeat = () => {
    onClose();
    navigate(`/seat-selection/${trip.id}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
        >
          {/* Backdrop */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }} onClick={onClose} />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'relative', width: '100%', maxWidth: 860,
              maxHeight: '90vh', overflowY: 'auto',
              background: '#111414', border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', flexDirection: 'column',
            }}
          >
            {/* ── HERO HEADER ── */}
            <div style={{ position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
              <img src={GALLERY[activeImg]} alt="Bus"
                style={{ width: '100%', height: 200, objectFit: 'cover', filter: 'brightness(0.3) saturate(0.6)', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #111414 0%, transparent 60%)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(17,20,20,0.8) 0%, transparent 60%)' }} />

              {/* Close */}
              <button onClick={onClose} style={{
                position: 'absolute', top: 16, right: 16,
                background: 'rgba(17,20,20,0.8)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(240,237,230,0.6)', width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.2s',
              }}>
                <X size={14} />
              </button>

              {/* Header content */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 28px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20 }}>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', color: '#d4af37', fontFamily: 'system-ui', marginBottom: 8 }}>
                      {trip.type?.toUpperCase()}
                    </div>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.8rem', fontWeight: 500, color: '#f0ede6', margin: '0 0 6px', lineHeight: 1.1 }}>
                      {trip.company}
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(240,237,230,0.45)', fontFamily: 'system-ui' }}>
                      <span>{trip.from}</span>
                      <ArrowRight size={10} style={{ color: '#d4af37' }} />
                      <span>{trip.to}</span>
                      <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
                      <Clock size={10} />
                      <span>{trip.duration}</span>
                    </div>
                  </div>

                  {/* Price + CTA */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexShrink: 0 }}>
                    <div style={{ padding: '14px 20px', background: 'rgba(17,20,20,0.9)', border: '1px solid rgba(255,255,255,0.08)', borderRight: 'none' }}>
                      <div style={{ fontSize: 9, color: 'rgba(240,237,230,0.4)', fontFamily: 'system-ui', marginBottom: 4, letterSpacing: '0.1em' }}>Giá vé từ</div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 700, color: '#d4af37', lineHeight: 1 }}>
                        {new Intl.NumberFormat('vi-VN').format(trip.price)}₫
                      </div>
                    </div>
                    <button onClick={handleSelectSeat} style={{
                      background: '#d4af37', color: '#0e1111', border: 'none',
                      padding: '0 24px', height: 68, cursor: 'pointer',
                      fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
                      fontFamily: 'system-ui', whiteSpace: 'nowrap',
                    }}>
                      Chọn ghế ngay
                    </button>
                  </div>
                </div>

                {/* Rating inline */}
                {trip.rating > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 12, fontSize: 11, color: '#d4af37', fontFamily: 'system-ui', fontWeight: 700 }}>
                    <Star size={11} style={{ fill: '#d4af37' }} />
                    {trip.rating}/5
                    <span style={{ color: 'rgba(240,237,230,0.3)', fontWeight: 400 }}>({trip.reviews} đánh giá)</span>
                  </div>
                )}
              </div>
            </div>

            {/* ── TABS ── */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 28px', flexShrink: 0 }}>
              {TABS.map((tab, i) => (
                <button key={tab} onClick={() => setActiveTab(i)} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '16px 20px',
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                  fontFamily: 'system-ui',
                  color: activeTab === i ? '#d4af37' : 'rgba(240,237,230,0.3)',
                  borderBottom: activeTab === i ? '2px solid #d4af37' : '2px solid transparent',
                  transition: 'all 0.2s',
                }}>
                  {tab}
                </button>
              ))}
            </div>

            {/* ── CONTENT ── */}
            <div style={{ padding: '28px 28px 32px', flex: 1 }}>
              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

                  {/* ── OVERVIEW ── */}
                  {activeTab === 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
                      {/* Gallery */}
                      <div>
                        <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden', marginBottom: 8 }}>
                          <img src={GALLERY[activeImg]} alt="Bus" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.85)' }} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                          {GALLERY.slice(1).map((img, i) => (
                            <div key={i} style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', cursor: 'pointer' }} onClick={() => setActiveImg(i + 1)}>
                              <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)', transition: 'filter 0.2s' }} />
                              {i === 1 && (
                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(14,17,17,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#f0ede6', fontFamily: 'system-ui' }}>
                                  +9 ảnh nữa
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Amenities + Rating */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div>
                          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#d4af37', fontFamily: 'system-ui', marginBottom: 16 }}>
                            Tiện ích
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            {[
                              { Icon: Wifi, label: 'Wifi tốc độ cao' },
                              { Icon: Droplets, label: 'Nước & Khăn lạnh' },
                              { Icon: Usb, label: 'Cổng sạc USB' },
                              { Icon: ShieldAlert, label: 'Búa thoát hiểm' },
                            ].map(({ Icon, label }) => (
                              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'rgba(240,237,230,0.55)', fontFamily: 'system-ui' }}>
                                <div style={{ width: 28, height: 28, background: 'rgba(212,175,55,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  <Icon size={13} style={{ color: '#d4af37' }} />
                                </div>
                                {label}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Rating summary */}
                        <div style={{ padding: '16px', background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#d4af37', fontFamily: 'system-ui' }}>
                              <Star size={13} style={{ fill: '#d4af37' }} /> {trip.rating}/5 Rất tốt
                            </div>
                            <span style={{ fontSize: 10, color: '#d4af37', fontFamily: 'system-ui', cursor: 'pointer' }} onClick={() => setActiveTab(3)}>
                              Đọc {trip.reviews} đánh giá →
                            </span>
                          </div>
                          <p style={{ fontSize: 12, color: 'rgba(240,237,230,0.5)', lineHeight: 1.7, margin: 0, fontFamily: 'system-ui' }}>
                            Khách hàng thường khen ngợi nhà xe về sự đúng giờ, xe sạch sẽ và thái độ phục vụ thân thiện.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── SCHEDULE ── */}
                  {activeTab === 1 && (
                    <div style={{ maxWidth: 480 }}>
                      {[
                        { time: trip.depTime, city: trip.from, station: 'Bến xe Miền Đông mới, Quầy vé 12', active: true },
                        { time: trip.arrTime, city: trip.to, station: 'Bến xe liên tỉnh', active: false },
                      ].map((stop, i, arr) => (
                        <div key={i} style={{ display: 'flex', gap: 20 }}>
                          {/* Timeline */}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 20 }}>
                            <div style={{ width: 12, height: 12, background: stop.active ? '#d4af37' : 'transparent', border: `2px solid ${stop.active ? '#d4af37' : 'rgba(255,255,255,0.2)'}`, borderRadius: '50%', flexShrink: 0 }} />
                            {i < arr.length - 1 && (
                              <div style={{ width: 1, flex: 1, background: 'repeating-linear-gradient(to bottom, rgba(212,175,55,0.3) 0, rgba(212,175,55,0.3) 4px, transparent 4px, transparent 8px)', margin: '4px 0', minHeight: 60 }} />
                            )}
                          </div>

                          {/* Content */}
                          <div style={{ paddingBottom: i < arr.length - 1 ? 32 : 0 }}>
                            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', fontWeight: 600, color: stop.active ? '#f0ede6' : 'rgba(240,237,230,0.4)', lineHeight: 1 }}>
                              {stop.time}
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: stop.active ? '#f0ede6' : 'rgba(240,237,230,0.5)', fontFamily: 'system-ui', margin: '6px 0 8px' }}>
                              {stop.city}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(240,237,230,0.3)', fontFamily: 'system-ui' }}>
                              <MapPin size={10} style={{ color: '#d4af37', flexShrink: 0 }} />
                              {stop.station}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ── POLICY ── */}
                  {activeTab === 2 && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                      {/* Cancellation */}
                      <div style={{ padding: 20, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#d4af37', fontFamily: 'system-ui', marginBottom: 16 }}>
                          Chính sách hoàn hủy
                        </div>
                        {[
                          { label: 'Hủy trước 24h', value: 'Hoàn 100%' },
                          { label: 'Hủy từ 12h – 24h', value: 'Hoàn 50%' },
                          { label: 'Hủy trước 12h', value: 'Không hoàn' },
                        ].map(r => (
                          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 12, fontFamily: 'system-ui' }}>
                            <span style={{ color: 'rgba(240,237,230,0.5)' }}>{r.label}</span>
                            <span style={{ fontWeight: 700, color: '#f0ede6' }}>{r.value}</span>
                          </div>
                        ))}
                        <p style={{ fontSize: 10, color: 'rgba(240,237,230,0.25)', marginTop: 12, fontFamily: 'system-ui', fontStyle: 'italic' }}>
                          * Vé ngày Lễ, Tết không áp dụng chính sách hoàn hủy.
                        </p>
                      </div>

                      {/* Baggage */}
                      <div style={{ padding: 20, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#d4af37', fontFamily: 'system-ui', marginBottom: 16 }}>
                          Quy định hành lý
                        </div>
                        {[
                          'Tối đa 20kg hành lý ký gửi và 1 balo nhỏ xách tay.',
                          'Không mang động vật sống, hàng hóa có mùi (sầu riêng, nước mắm).',
                        ].map((item, i) => (
                          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12, fontSize: 12, color: 'rgba(240,237,230,0.5)', fontFamily: 'system-ui', lineHeight: 1.6 }}>
                            <span style={{ color: '#d4af37', flexShrink: 0, fontSize: 8, marginTop: 5 }}>◆</span>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── REVIEWS ── */}
                  {activeTab === 3 && (
                    <div>
                      {/* Rating summary */}
                      <div style={{ display: 'flex', gap: 32, padding: '20px 0 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 24 }}>
                        <div style={{ textAlign: 'center', flexShrink: 0 }}>
                          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '3.5rem', fontWeight: 700, color: '#d4af37', lineHeight: 1 }}>
                            {trip.rating}
                          </div>
                          <div style={{ display: 'flex', gap: 2, justifyContent: 'center', margin: '6px 0 4px' }}>
                            {[1,2,3,4,5].map(i => (
                              <Star key={i} size={12} style={{ fill: i <= Math.floor(trip.rating) ? '#d4af37' : 'rgba(255,255,255,0.1)', color: i <= Math.floor(trip.rating) ? '#d4af37' : 'rgba(255,255,255,0.1)' }} />
                            ))}
                          </div>
                          <div style={{ fontSize: 10, color: 'rgba(240,237,230,0.3)', fontFamily: 'system-ui' }}>{trip.reviews} đánh giá</div>
                        </div>

                        <div style={{ flex: 1 }}>
                          {[5,4,3,2,1].map(r => {
                            const pct = r === 5 ? 75 : r === 4 ? 15 : r === 3 ? 5 : 2;
                            return (
                              <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                <span style={{ fontSize: 10, color: 'rgba(240,237,230,0.4)', fontFamily: 'system-ui', width: 8 }}>{r}</span>
                                <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                                  <div style={{ height: '100%', width: `${pct}%`, background: '#d4af37' }} />
                                </div>
                                <span style={{ fontSize: 10, color: 'rgba(240,237,230,0.3)', fontFamily: 'system-ui', width: 28 }}>{pct}%</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Reviews list */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {[
                          { name: 'Nguyễn Văn A', date: 'Hôm qua', content: 'Xe rất mới, giường nằm rộng rãi thoải mái. Tài xế lái an toàn không lạng lách. Wifi chạy tốt.', likes: 12 },
                          { name: 'Trần Thị B', date: '3 ngày trước', content: 'Chất lượng dịch vụ tuyệt vời. Lơ xe rất lịch sự, phát nước và khăn lạnh đầy đủ. Đón khách đúng giờ.', likes: 8 },
                        ].map((review, i) => (
                          <div key={i} style={{ padding: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 32, height: 32, background: 'rgba(212,175,55,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#d4af37', fontFamily: 'system-ui' }}>
                                  {review.name.charAt(0)}
                                </div>
                                <div>
                                  <div style={{ fontSize: 12, fontWeight: 700, color: '#f0ede6', fontFamily: 'system-ui' }}>{review.name}</div>
                                  <div style={{ fontSize: 10, color: 'rgba(240,237,230,0.3)', fontFamily: 'system-ui' }}>{review.date}</div>
                                </div>
                              </div>
                              <div style={{ display: 'flex', gap: 2 }}>
                                {[1,2,3,4,5].map(s => <Star key={s} size={9} style={{ fill: '#d4af37', color: '#d4af37' }} />)}
                              </div>
                            </div>
                            <p style={{ fontSize: 12, color: 'rgba(240,237,230,0.6)', lineHeight: 1.7, margin: '0 0 10px', fontFamily: 'system-ui' }}>
                              {review.content}
                            </p>
                            <button style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', fontSize: 10, color: 'rgba(240,237,230,0.3)', fontFamily: 'system-ui', fontWeight: 700 }}>
                              <ThumbsUp size={10} /> Hữu ích ({review.likes})
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
