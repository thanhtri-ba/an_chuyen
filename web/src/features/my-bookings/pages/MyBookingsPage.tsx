import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Ticket, Calendar, Clock, Download, ArrowRight, MapPin, CreditCard, CheckCircle, XCircle, RotateCcw, AlertCircle, Ban } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../lib/api';
import type { Booking } from '../../../types';

/* ─── STATUS ─── */
const STATUS_MAP: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  CONFIRMED:       { label: 'Đã xác nhận',    color: '#4ade80', icon: CheckCircle },
  PENDING:         { label: 'Chờ xác nhận',   color: '#d4af37', icon: AlertCircle },
  PENDING_PAYMENT: { label: 'Chờ thanh toán', color: '#d4af37', icon: CreditCard },
  COMPLETED:       { label: 'Hoàn thành',     color: 'rgba(240,237,230,0.3)', icon: CheckCircle },
  CANCELLED:       { label: 'Đã hủy',         color: '#f87171', icon: XCircle },
  REFUNDING:       { label: 'Đang hoàn tiền', color: '#60a5fa', icon: RotateCcw },
  REFUNDED:        { label: 'Đã hoàn tiền',   color: 'rgba(240,237,230,0.3)', icon: RotateCcw },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] || STATUS_MAP['PENDING'];
  const Icon = s.icon;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: s.color, fontFamily: 'system-ui' }}>
      <Icon size={10} /> {s.label}
    </div>
  );
}

/* ─── TICKET CARD ─── */
function TicketCard({ booking, index, onCancel }: { booking: Booking; index: number; onCancel: (id: string) => void }) {
  const depTime = booking.tripSchedule?.departureTime;
  const departureDate = depTime ? new Date(depTime) : new Date(booking.createdAt);
  const depCity = booking.tripSchedule?.trip?.route?.departureCity?.name || 'Điểm đi';
  const arrCity = booking.tripSchedule?.trip?.route?.arrivalCity?.name || 'Điểm đến';
  const agentName = booking.tripSchedule?.trip?.busAgent?.name || 'An Chuyến';
  const isPaid = booking.paymentStatus === 'PAID';
  const canCancel = booking.status === 'CONFIRMED' || booking.status === 'PENDING' || booking.status === 'PENDING_PAYMENT';
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    if (!confirm('Bạn có chắc muốn hủy vé này không?')) return;
    setIsCancelling(true);
    try {
      await api.post(`/bookings/${booking.id}/cancel`);
      toast.success('Hủy vé thành công');
      onCancel(booking.id);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Không thể hủy vé. Vui lòng thử lại.');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.45 }}
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)',
        overflow: 'hidden',
        transition: 'border-color 0.3s',
      }}
      whileHover={{ borderColor: 'rgba(212,175,55,0.25)' }}
    >
      {/* Top accent line based on status */}
      <div style={{ height: 2, background: STATUS_MAP[booking.status]?.color || '#d4af37', opacity: 0.6 }} />

      <div style={{ padding: '28px 28px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '88px 1px 1fr', gap: 0, alignItems: 'stretch' }}>

          {/* Date column */}
          <div style={{ paddingRight: 24, paddingBottom: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,237,230,0.35)', fontFamily: 'system-ui', marginBottom: 4 }}>
                {departureDate.toLocaleDateString('vi-VN', { month: 'short' })}
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '3rem', fontWeight: 700, color: '#f0ede6', lineHeight: 1 }}>
                {departureDate.getDate()}
              </div>
              <div style={{ fontSize: 9, color: 'rgba(240,237,230,0.3)', fontFamily: 'system-ui', marginTop: 4 }}>
                {departureDate.getFullYear()}
              </div>
            </div>
            <StatusBadge status={booking.status} />
          </div>

          {/* Divider — dashed */}
          <div style={{ background: 'none', borderLeft: '1px dashed rgba(255,255,255,0.1)', position: 'relative' }}>
            {/* Notch top */}
            <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', width: 14, height: 14, borderRadius: '50%', background: '#0e1111', border: '1px dashed rgba(255,255,255,0.1)' }} />
            {/* Notch bottom */}
            <div style={{ position: 'absolute', bottom: -14, left: '50%', transform: 'translateX(-50%)', width: 14, height: 14, borderRadius: '50%', background: '#0e1111', border: '1px dashed rgba(255,255,255,0.1)' }} />
          </div>

          {/* Trip info */}
          <div style={{ padding: '0 0 28px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.35rem', fontWeight: 500, color: '#f0ede6', margin: '0 0 6px', lineHeight: 1.2 }}>
                  {agentName}
                </h3>
                <div style={{ fontSize: 10, color: 'rgba(240,237,230,0.3)', fontFamily: 'monospace', letterSpacing: '0.1em' }}>
                  #{booking.id.slice(0, 8).toUpperCase()}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', fontWeight: 700, color: '#d4af37', lineHeight: 1 }}>
                  {new Intl.NumberFormat('vi-VN').format(booking.totalAmount)}₫
                </div>
                <div style={{ fontSize: 10, color: isPaid ? '#4ade80' : '#d4af37', fontFamily: 'system-ui', fontWeight: 700, marginTop: 4, letterSpacing: '0.05em' }}>
                  {isPaid ? '✓ Đã thanh toán' : '⏳ Chưa thanh toán'}
                </div>
              </div>
            </div>

            {/* Route row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: 14 }}>
              <MapPin size={11} style={{ color: '#d4af37', flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#f0ede6', fontFamily: 'system-ui' }}>{depCity}</span>
              <div style={{ flex: 1, height: 1, background: 'repeating-linear-gradient(to right, rgba(212,175,55,0.3) 0, rgba(212,175,55,0.3) 4px, transparent 4px, transparent 8px)' }} />
              <ArrowRight size={11} style={{ color: '#d4af37', flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#f0ede6', fontFamily: 'system-ui' }}>{arrCity}</span>
            </div>

            {/* Meta */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 11, color: 'rgba(240,237,230,0.35)', fontFamily: 'system-ui' }}>
              {booking.seatNumbers?.length > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Ticket size={10} /> Ghế: {booking.seatNumbers.join(', ')}
                </span>
              )}
              {depTime && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Clock size={10} /> {new Date(depTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '14px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
        <div>
          {canCancel && (
            <button
              onClick={handleCancel}
              disabled={isCancelling}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'none', border: '1px solid rgba(248,113,113,0.3)',
                color: '#f87171', padding: '8px 18px', cursor: isCancelling ? 'not-allowed' : 'pointer',
                fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                fontFamily: 'system-ui', transition: 'all 0.2s', opacity: isCancelling ? 0.5 : 1,
              }}
            >
              <Ban size={11} /> {isCancelling ? 'Đang hủy...' : 'Hủy vé'}
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'none', border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(240,237,230,0.5)', padding: '8px 18px', cursor: 'pointer',
            fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
            fontFamily: 'system-ui', transition: 'all 0.2s',
          }}>
            <Download size={11} /> Tải vé
          </button>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: '#d4af37', border: 'none',
            color: '#0e1111', padding: '8px 20px', cursor: 'pointer',
            fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
            fontFamily: 'system-ui',
          }}>
            Chi tiết <ArrowRight size={11} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── EMPTY ─── */
function EmptyState({ type }: { type: 'upcoming' | 'past' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ textAlign: 'center', padding: '80px 0' }}
    >
      <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '5rem', color: 'rgba(212,175,55,0.15)', marginBottom: 24 }}>
        {type === 'upcoming' ? '✦' : '◇'}
      </div>
      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', fontWeight: 400, color: 'rgba(240,237,230,0.5)', margin: '0 0 12px' }}>
        {type === 'upcoming' ? 'Chưa có chuyến đi sắp tới' : 'Lịch sử chuyến đi trống'}
      </h3>
      <p style={{ fontSize: 13, color: 'rgba(240,237,230,0.25)', fontFamily: 'system-ui', maxWidth: 340, margin: '0 auto' }}>
        {type === 'upcoming'
          ? 'Hãy đặt vé ngay để trải nghiệm dịch vụ xe khách cao cấp của An Chuyến!'
          : 'Các chuyến đi đã hoàn thành hoặc đã hủy sẽ hiển thị ở đây.'}
      </p>
    </motion.div>
  );
}

/* ─── PAGE ─── */
export function MyBookingsPage() {
  const { user, isLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    if (user) {
      api.get('/bookings')
        .then(res => setBookings(res.data.data || []))
        .catch(() => toast.error('Không thể tải danh sách vé.'))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleCancelBooking = (bookingId: string) => {
    setBookings(prev => prev.map(b =>
      b.id === bookingId ? { ...b, status: 'CANCELLED' } : b
    ));
  };

  if (isLoading) return (
    <div style={{ background: '#0e1111', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(240,237,230,0.3)', fontFamily: 'system-ui' }}>
      Đang tải...
    </div>
  );
  if (!user) return <Navigate to="/auth" />;

  const upcoming = bookings.filter(b => ['CONFIRMED', 'PENDING', 'PENDING_PAYMENT'].includes(b.status));
  const past = bookings.filter(b => ['COMPLETED', 'CANCELLED', 'REFUNDED', 'REFUNDING'].includes(b.status));
  const totalSpent = bookings.filter(b => b.paymentStatus === 'PAID').reduce((s, b) => s + (b.totalAmount || 0), 0);
  const shown = activeTab === 'upcoming' ? upcoming : past;

  return (
    <div style={{ background: '#0e1111', color: '#f0ede6', minHeight: '100vh', paddingTop: 100 }}>

      {/* ─── HEADER ─── */}
      <div style={{ padding: '0 8% 56px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 24, height: 1, background: '#d4af37' }} />
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#d4af37', fontFamily: 'system-ui' }}>
              Tài khoản
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(2.2rem, 3.5vw, 4rem)',
            fontWeight: 400, color: '#f0ede6', lineHeight: 1.1, margin: '0 0 40px',
          }}>
            Chuyến đi <em style={{ color: '#d4af37' }}>của tôi</em>
          </h1>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 0 }}>
            {[
              { label: 'Tổng chuyến đi', value: bookings.length, icon: Ticket },
              { label: 'Sắp khởi hành', value: upcoming.length, icon: Calendar },
              { label: 'Tổng chi tiêu', value: totalSpent > 0 ? new Intl.NumberFormat('vi-VN').format(totalSpent) + '₫' : '—', icon: CreditCard },
            ].map((stat, i) => (
              <div key={i} style={{
                flex: 1, padding: '20px 28px',
                borderRight: i < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                borderTop: '1px solid rgba(255,255,255,0.07)',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                borderLeft: i === 0 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(240,237,230,0.3)', fontFamily: 'system-ui', marginBottom: 8 }}>
                  {stat.label}
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 600, color: i === 2 ? '#d4af37' : '#f0ede6', lineHeight: 1 }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ─── GOLD DIVIDER ─── */}
      <div style={{ margin: '0 8%', height: 1, background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)' }} />

      {/* ─── TABS + CONTENT ─── */}
      <div style={{ padding: '0 8% 100px' }}>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.06)', margin: '40px 0 40px' }}>
          {[
            { key: 'upcoming', label: 'Sắp khởi hành', count: upcoming.length },
            { key: 'past', label: 'Lịch sử', count: past.length },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'upcoming' | 'past')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '14px 28px',
                fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                fontFamily: 'system-ui', display: 'flex', alignItems: 'center', gap: 8,
                color: activeTab === tab.key ? '#d4af37' : 'rgba(240,237,230,0.3)',
                borderBottom: activeTab === tab.key ? '2px solid #d4af37' : '2px solid transparent',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
              {tab.count > 0 && (
                <span style={{
                  background: activeTab === tab.key ? '#d4af37' : 'rgba(255,255,255,0.1)',
                  color: activeTab === tab.key ? '#0e1111' : 'rgba(240,237,230,0.4)',
                  fontSize: 9, fontWeight: 900, padding: '2px 7px',
                  borderRadius: 2, fontFamily: 'system-ui',
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} style={{ height: 180, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }} />
              ))
            ) : shown.length === 0 ? (
              <EmptyState type={activeTab} />
            ) : (
              shown.map((b, i) => <TicketCard key={b.id} booking={b} index={i} onCancel={handleCancelBooking} />)
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
