import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Tag, Shield, FileText, Check, MapPin, User, ChevronRight, X } from 'lucide-react';
import api from '../../../lib/api';
import type { BookingData } from '../../../types';
import { toast } from 'sonner';

export function BookingReviewPage() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [timeLeft, setTimeLeft] = useState(570);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [isInsuranceEnabled, setIsInsuranceEnabled] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [notes, setNotes] = useState('');
  const [promoFocused, setPromoFocused] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const saved = sessionStorage.getItem('pending_booking');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setBookingData(parsed);
        setIsInsuranceEnabled(parsed.addInsurance || false);
        setNotes(parsed.notes || '');
      } catch { navigate('/'); }
    } else { navigate(-1); }
  }, [navigate]);

  useEffect(() => {
    if (!bookingData || timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, bookingData]);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    try {
      const res = await api.post('/vouchers/validate', { code: promoCode.toUpperCase() });
      if (res.data?.discount) {
        setDiscount(res.data.discount);
        setPromoApplied(true);
        toast.success(`Giảm ${fmt(res.data.discount)}đ`);
      } else { toast.error('Mã không hợp lệ hoặc đã hết hạn'); }
    } catch { toast.error('Mã không hợp lệ hoặc đã hết hạn'); }
  };

  const handleProceedToPayment = () => {
    if (!termsAccepted) { toast.error('Vui lòng đồng ý với điều khoản'); return; }
    const updated = { ...bookingData, addInsurance: isInsuranceEnabled, totalAmount: finalTotal, notes };
    sessionStorage.setItem('pending_booking', JSON.stringify(updated));
    navigate('/payment');
  };

  if (!bookingData) return null;

  const { seats, seatsTotal, pickupLabel, dropoffLabel, routeLabel, busAgentName, needVAT, passengerInfo, bookerInfo } = bookingData;
  const insuranceFee = isInsuranceEnabled ? seats.length * 20000 : 0;
  const finalTotal = Math.max(0, seatsTotal + insuranceFee - discount);
  const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(n);
  const timerPct = (timeLeft / 570) * 100;
  const timerUrgent = timeLeft < 120;

  const [routeFrom, routeTo] = routeLabel?.split(' → ') || ['—', '—'];

  return (
    <div style={{ background: '#080a0a', minHeight: '100vh', color: '#f0ede6', fontFamily: 'system-ui' }}>

      {/* ── TOPBAR ── */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(8,10,10,0.97)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: `0 ${isMobile ? '14px' : '28px'}`, height: 60, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, background: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', flexShrink: 0 }}>
            <ArrowLeft size={14} />
          </button>
          <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.07)', flexShrink: 0 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {[
              { l: 'Chọn ghế', done: true },
              { l: 'Xác nhận', done: false, active: true },
              { l: 'Thanh toán', done: false },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                {i > 0 && <div style={{ width: isMobile ? 14 : 24, height: 1, background: s.done || i === 1 ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.08)', margin: '0 3px' }} />}
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, opacity: s.active ? 1 : s.done ? 0.7 : 0.3 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: s.active ? '#d4af37' : s.done ? 'rgba(212,175,55,0.15)' : 'transparent', border: `1px solid ${s.active ? '#d4af37' : s.done ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 800, color: s.active ? '#080a0a' : s.done ? '#d4af37' : 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
                    {s.done ? <Check size={9} strokeWidth={3} /> : i + 1}
                  </div>
                  {!isMobile && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: s.active ? '#f0ede6' : 'rgba(255,255,255,0.35)' }}>{s.l}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '16px 14px 120px' : '28px 28px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 340px', gap: isMobile ? 14 : 24, alignItems: 'start' }}>

        {/* ══ LEFT ══ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 12 : 16 }}>

          {/* Page title */}
          <div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 28 : 38, fontWeight: 600, margin: 0, lineHeight: 1, letterSpacing: '-0.01em' }}>Xác nhận đặt vé</h1>
            <p style={{ margin: '6px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Kiểm tra lại thông tin trước khi thanh toán</p>
          </div>

          {/* ── Trip card ── */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.018) 100%)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>

              {/* Route header */}
              <div style={{ background: 'linear-gradient(135deg, rgba(16,24,28,0.9) 0%, rgba(10,18,24,0.95) 100%)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '22px 24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, background: 'radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={18} color="#d4af37" />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: isMobile ? 20 : 26, fontWeight: 700, letterSpacing: '0.02em' }}>{routeFrom}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <div style={{ width: 14, height: 1, background: 'rgba(212,175,55,0.5)' }} />
                        <div style={{ width: 4, height: 4, background: '#d4af37', transform: 'rotate(45deg)' }} />
                        <div style={{ width: 14, height: 1, background: 'rgba(212,175,55,0.5)' }} />
                      </div>
                      <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: isMobile ? 20 : 26, fontWeight: 700, letterSpacing: '0.02em' }}>{routeTo}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{busAgentName}</div>
                  </div>
                </div>
              </div>

              {/* Pickup/dropoff */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {[
                  { label: 'Điểm đón', value: pickupLabel || 'Chưa chọn điểm đón' },
                  { label: 'Điểm trả', value: dropoffLabel || 'Chưa chọn điểm trả' },
                ].map((item, i) => (
                  <div key={i} style={{ padding: isMobile ? '12px 16px' : '16px 24px', borderLeft: (!isMobile && i > 0) ? '1px solid rgba(255,255,255,0.06)' : 'none', borderTop: (isMobile && i > 0) ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                    <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>{item.label}</div>
                    <div style={{ fontSize: isMobile ? 13 : 14, fontWeight: 700, color: '#f0ede6', lineHeight: 1.4 }}>{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Seat chips + amenities */}
              <div style={{ padding: isMobile ? '12px 16px' : '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>Ghế đã chọn</span>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {seats.map((seat: string) => {
                      const p = seat.match(/^T(\d+)-(\d+)([A-Z]+)$/);
                      const label = p ? `${p[3]}${p[2]}` : seat;
                      return (
                        <span key={seat} style={{ fontSize: 12, fontWeight: 800, color: '#d4af37', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.28)', borderRadius: 6, padding: '4px 10px', letterSpacing: '0.04em' }}>{label}</span>
                      );
                    })}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[
                    { icon: <Shield size={11} />, label: 'Hủy miễn phí' },
                    { icon: null, label: 'Hành lý 20kg' },
                  ].map((a, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 99, padding: '4px 10px' }}>
                      {a.icon && <span style={{ color: 'rgba(212,175,55,0.5)' }}>{a.icon}</span>}
                      {a.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Passenger info ── */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.08 }}>
            <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '22px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={16} color="#d4af37" />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>Thông tin hành khách</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>Người đi & người đặt vé</div>
                </div>
              </div>

              {/* Passenger row */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr', gap: isMobile ? 14 : 20, padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, marginBottom: bookerInfo ? 12 : 0 }}>
                {[
                  { label: 'Hành khách', val: passengerInfo?.name },
                  { label: 'Số điện thoại', val: passengerInfo?.phone },
                  { label: 'Email nhận vé', val: passengerInfo?.email },
                ].map(f => (
                  <div key={f.label}>
                    <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 5 }}>{f.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#f0ede6', wordBreak: 'break-all' }}>{f.val || '—'}</div>
                  </div>
                ))}
              </div>

              {bookerInfo && (
                <div style={{ padding: '12px 16px', background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: 12, marginBottom: 12 }}>
                  <div style={{ fontSize: 8, color: 'rgba(212,175,55,0.5)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Check size={9} /> Người đặt hộ
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
                    {[
                      { label: 'Họ tên', val: bookerInfo.name },
                      { label: 'Số điện thoại', val: bookerInfo.phone },
                    ].map(f => (
                      <div key={f.label}>
                        <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>{f.label}</div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{f.val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div style={{ marginTop: 4 }}>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FileText size={11} color="rgba(255,255,255,0.25)" /> Ghi chú cho nhà xe (tùy chọn)
                </div>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="VD: Có trẻ em đi cùng, xin xếp ghế cạnh nhau; Đón ở cổng số 2..."
                  style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10, padding: '12px 14px', color: '#f0ede6', fontSize: 12, fontFamily: 'system-ui', outline: 'none', resize: 'none', height: 80, boxSizing: 'border-box', transition: 'border-color 0.2s', lineHeight: 1.6 }}
                  onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.35)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'}
                />
              </div>
            </div>
          </motion.div>

          {/* ── Add-ons confirm ── */}
          {(isInsuranceEnabled || needVAT) && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                {isInsuranceEnabled && (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.18)', borderRadius: 12 }}>
                    <Shield size={14} color="#4ade80" />
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(74,222,128,0.8)' }}>Bảo hiểm hành trình đã bao gồm</span>
                  </div>
                )}
                {needVAT && (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12 }}>
                    <FileText size={14} color="rgba(255,255,255,0.4)" />
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.45)' }}>Hóa đơn VAT sẽ được xuất</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div style={isMobile ? { position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200, background: 'rgba(8,10,10,0.98)', backdropFilter: 'blur(24px)', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '12px 16px 22px', display: 'flex', flexDirection: 'column', gap: 10 } : { position: 'sticky', top: 72, display: 'flex', flexDirection: 'column', gap: 12 }}>

          {isMobile ? (
            /* ─ MOBILE bottom bar ─ */
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                {/* Timer compact */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 12px', background: timerUrgent ? 'rgba(248,65,65,0.1)' : 'rgba(212,175,55,0.07)', border: `1px solid ${timerUrgent ? 'rgba(248,65,65,0.25)' : 'rgba(212,175,55,0.18)'}`, borderRadius: 8 }}>
                  <Clock size={12} color={timerUrgent ? '#f87171' : '#d4af37'} />
                  <span style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 800, color: timerUrgent ? '#f87171' : '#d4af37' }}>
                    {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
                  </span>
                </div>
                {/* Total */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Tổng</div>
                  <motion.div key={finalTotal} initial={{ scale: 1.05 }} animate={{ scale: 1 }}
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: '#d4af37', lineHeight: 1 }}>
                    {fmt(finalTotal)}₫
                  </motion.div>
                </div>
              </div>
              {/* Terms inline */}
              <div onClick={() => setTermsAccepted(p => !p)} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${termsAccepted ? '#d4af37' : 'rgba(255,255,255,0.2)'}`, background: termsAccepted ? '#d4af37' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                  {termsAccepted && <Check size={9} color="#080a0a" strokeWidth={3} />}
                </div>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', lineHeight: 1.5 }}>
                  Đồng ý với <span style={{ color: 'rgba(212,175,55,0.5)', textDecoration: 'underline' }}>điều khoản</span> dịch vụ
                </span>
              </div>
              <motion.button
                onClick={handleProceedToPayment}
                disabled={!termsAccepted}
                whileTap={termsAccepted ? { scale: 0.97 } : {}}
                style={{
                  width: '100%', borderRadius: 12, padding: '15px',
                  background: termsAccepted ? 'linear-gradient(135deg, #e0bb45 0%, #b8920e 100%)' : 'rgba(255,255,255,0.05)',
                  color: termsAccepted ? '#080a0a' : 'rgba(255,255,255,0.2)',
                  border: 'none', fontSize: 11, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase',
                  cursor: termsAccepted ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'system-ui',
                }}
              >
                Tiến hành thanh toán {termsAccepted && <ChevronRight size={14} />}
              </motion.button>
            </>
          ) : (
            /* ─ DESKTOP full panel ─ */
            <>
              {/* Timer */}
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: timerUrgent ? 'rgba(248,65,65,0.08)' : 'rgba(212,175,55,0.06)', border: `1px solid ${timerUrgent ? 'rgba(248,65,65,0.25)' : 'rgba(212,175,55,0.18)'}`, borderRadius: 14, padding: '14px 16px', overflow: 'hidden', position: 'relative' }}
              >
                <div style={{ position: 'absolute', bottom: 0, left: 0, height: 3, width: '100%', background: 'rgba(255,255,255,0.05)' }}>
                  <motion.div animate={{ width: `${timerPct}%` }} transition={{ duration: 1, ease: 'linear' }} style={{ height: '100%', background: timerUrgent ? '#f87171' : '#d4af37', borderRadius: 99 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Clock size={16} color={timerUrgent ? '#f87171' : '#d4af37'} />
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: timerUrgent ? 'rgba(248,65,65,0.8)' : 'rgba(212,175,55,0.7)' }}>Thời gian giữ ghế</div>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', marginTop: 1 }}>Vui lòng thanh toán sớm</div>
                    </div>
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: 26, fontWeight: 900, color: timerUrgent ? '#f87171' : '#d4af37', letterSpacing: '0.05em', lineHeight: 1 }}>
                    {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
                  </div>
                </div>
              </motion.div>

              {/* Promo code */}
              <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
                  <Tag size={13} color="rgba(212,175,55,0.6)" />
                  <span style={{ fontSize: 9, color: 'rgba(212,175,55,0.6)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>Mã giảm giá</span>
                </div>
                {promoApplied ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.18)', borderRadius: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Check size={13} color="#4ade80" />
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#4ade80' }}>{promoCode.toUpperCase()}</span>
                      <span style={{ fontSize: 10, color: 'rgba(74,222,128,0.6)' }}>-{fmt(discount)}đ</span>
                    </div>
                    <button onClick={() => { setPromoApplied(false); setDiscount(0); setPromoCode(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 2 }}>
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input type="text" value={promoCode} onChange={e => setPromoCode(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleApplyPromo()} placeholder="Nhập mã ưu đãi"
                      onFocus={() => setPromoFocused(true)} onBlur={() => setPromoFocused(false)}
                      style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: `1px solid ${promoFocused ? 'rgba(212,175,55,0.35)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 10, padding: '10px 12px', color: '#f0ede6', fontSize: 12, fontFamily: 'system-ui', outline: 'none', transition: 'border-color 0.2s' }}
                    />
                    <button onClick={handleApplyPromo} style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 10, padding: '10px 14px', color: '#d4af37', fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'system-ui' }}>
                      Áp dụng
                    </button>
                  </div>
                )}
              </div>

              {/* Price summary */}
              <div style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.018) 100%)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '18px 16px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <FileText size={14} color="rgba(212,175,55,0.6)" />
                  <span style={{ fontSize: 9, color: 'rgba(212,175,55,0.6)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>Tóm tắt chi phí</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                    <span>Giá vé · {seats.length} ghế</span>
                    <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>{fmt(seatsTotal)}đ</span>
                  </div>
                  <div onClick={() => setIsInsuranceEnabled(p => !p)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, padding: '10px 12px', background: isInsuranceEnabled ? 'rgba(74,222,128,0.06)' : 'rgba(255,255,255,0.03)', border: `1px solid ${isInsuranceEnabled ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 14, height: 14, borderRadius: 4, border: `1px solid ${isInsuranceEnabled ? '#4ade80' : 'rgba(255,255,255,0.2)'}`, background: isInsuranceEnabled ? '#4ade80' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                        {isInsuranceEnabled && <Check size={8} color="#080a0a" strokeWidth={3} />}
                      </div>
                      <span style={{ color: isInsuranceEnabled ? 'rgba(74,222,128,0.8)' : 'rgba(255,255,255,0.35)' }}>Bảo hiểm chuyến đi</span>
                    </div>
                    <span style={{ fontWeight: 600, color: isInsuranceEnabled ? 'rgba(74,222,128,0.7)' : 'rgba(255,255,255,0.2)', textDecoration: isInsuranceEnabled ? 'none' : 'line-through' }}>{fmt(seats.length * 20000)}đ</span>
                  </div>
                  {discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '8px 12px', background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.15)', borderRadius: 10, color: 'rgba(74,222,128,0.7)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Tag size={11} /> Mã giảm giá</span>
                      <span style={{ fontWeight: 700 }}>-{fmt(discount)}đ</span>
                    </div>
                  )}
                </div>
                <div style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(212,175,55,0.04) 100%)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 12, padding: '14px', marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Tổng thanh toán</span>
                    <motion.span key={finalTotal} initial={{ scale: 1.05, color: '#f2c118' }} animate={{ scale: 1, color: '#d4af37' }} transition={{ duration: 0.3 }}
                      style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.9rem', fontWeight: 700, color: '#d4af37', lineHeight: 1 }}>
                      {fmt(finalTotal)}₫
                    </motion.span>
                  </div>
                </div>
                <div onClick={() => setTermsAccepted(p => !p)} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14, cursor: 'pointer', userSelect: 'none' }}>
                  <div style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${termsAccepted ? '#d4af37' : 'rgba(255,255,255,0.2)'}`, background: termsAccepted ? '#d4af37' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, transition: 'all 0.15s' }}>
                    {termsAccepted && <Check size={9} color="#080a0a" strokeWidth={3} />}
                  </div>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', lineHeight: 1.7, margin: 0 }}>
                    Tôi đã đọc và đồng ý với{' '}
                    <span style={{ color: 'rgba(212,175,55,0.5)', textDecoration: 'underline' }}>Điều khoản dịch vụ</span>
                    {' '}và{' '}
                    <span style={{ color: 'rgba(212,175,55,0.5)', textDecoration: 'underline' }}>Chính sách bảo mật</span>
                  </p>
                </div>
                <motion.button
                  onClick={handleProceedToPayment}
                  disabled={!termsAccepted}
                  whileHover={termsAccepted ? { scale: 1.02, boxShadow: '0 10px 32px rgba(212,175,55,0.3)' } : {}}
                  whileTap={termsAccepted ? { scale: 0.97 } : {}}
                  style={{
                    width: '100%', borderRadius: 12, padding: '15px',
                    background: termsAccepted ? 'linear-gradient(135deg, #e0bb45 0%, #b8920e 100%)' : 'rgba(255,255,255,0.05)',
                    color: termsAccepted ? '#080a0a' : 'rgba(255,255,255,0.2)',
                    border: 'none', fontSize: 11, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase',
                    cursor: termsAccepted ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: 'system-ui',
                    boxShadow: termsAccepted ? '0 4px 20px rgba(212,175,55,0.2)' : 'none',
                    transition: 'background 0.2s, box-shadow 0.2s',
                  }}
                >
                  Tiến hành thanh toán
                  {termsAccepted && <ChevronRight size={14} />}
                </motion.button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
