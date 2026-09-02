import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../../contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Ticket, Clock, ArrowRight, MapPin, CreditCard, CheckCircle, XCircle, RotateCcw, AlertCircle, Ban, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../lib/api';
import type { Booking } from '../../../types';
import { TrackingMap } from '../../../shared/components/TrackingMap';

/* ─── STATUS ─── */
const STATUS_MAP: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  CONFIRMED:       { label: 'Đã xác nhận',    color: '#4ade80', icon: CheckCircle },
  PENDING:         { label: 'Chờ xác nhận',   color: '#163328', icon: AlertCircle },
  PENDING_PAYMENT: { label: 'Chờ thanh toán', color: '#163328', icon: CreditCard },
  COMPLETED:       { label: 'Hoàn thành',     color: 'rgba(0,0,0,0.3)', icon: CheckCircle },
  CANCELLED:       { label: 'Đã hủy',         color: '#f87171', icon: XCircle },
  REFUNDING:       { label: 'Đang hoàn tiền', color: '#60a5fa', icon: RotateCcw },
  REFUNDED:        { label: 'Đã hoàn tiền',   color: 'rgba(0,0,0,0.3)', icon: RotateCcw },
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
function TicketCard({ booking, index, isActiveTracking, onTrack, onCancel, isMobile }: { booking: Booking; index: number; isActiveTracking: boolean; onTrack: () => void; onCancel: (id: string, status: string) => void; isMobile: boolean }) {
  const depTime = booking.tripSchedule?.departureTime;
  const departureDate = depTime ? new Date(depTime) : new Date(booking.createdAt);
  const depCity = booking.tripSchedule?.trip?.route?.departureCity?.name || 'Điểm đi';
  const arrCity = booking.tripSchedule?.trip?.route?.arrivalCity?.name || 'Điểm đến';
  const agentName = booking.tripSchedule?.trip?.busAgent?.name || 'An Chuyến';
  const isPaid = booking.paymentStatus === 'PAID';
  const canCancel = booking.status === 'CONFIRMED' || booking.status === 'PENDING' || booking.status === 'PENDING_PAYMENT';
  const [isCancelling, setIsCancelling] = useState(false);
  const navigate = useNavigate();

  const handleViewDetail = () => {
    // BookingConfirmationPage reads its data from sessionStorage('last_booking') —
    // reuse that same e-ticket view here instead of building a second detail page.
    sessionStorage.setItem('last_booking', JSON.stringify({
      bookingId: booking.id,
      passengerName: '',
      routeLabel: `${depCity} → ${arrCity}`,
      busAgentName: agentName,
      seats: booking.seatNumbers || [],
      totalAmount: booking.totalAmount,
      createdAt: booking.createdAt,
      departureTime: booking.tripSchedule?.departureTime,
    }));
    navigate('/booking-confirmation');
  };

  const handleCancel = async () => {
    if (!confirm('Bạn có chắc muốn hủy vé này không?')) return;
    setIsCancelling(true);
    try {
      const { data } = await api.post(`/bookings/${booking.id}/cancel`);
      const newStatus = data?.data?.status || 'CANCELLED';
      toast.success(newStatus === 'REFUNDED' ? 'Hủy vé thành công. Tiền đã được hoàn vào ví.' : 'Hủy vé thành công');
      onCancel(booking.id, newStatus);
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
      transition={{ delay: index * 0.05, duration: 0.3 }}
      style={{
        background: isActiveTracking && !isMobile ? '#f0fdf4' : 'rgba(0,0,0,0.025)',
        border: isActiveTracking && !isMobile ? '1px solid #4ade80' : '1px solid rgba(0,0,0,0.07)',
        overflow: 'hidden',
        transition: 'all 0.3s',
      }}
      whileHover={{ borderColor: isActiveTracking && !isMobile ? '#4ade80' : 'rgba(22,51,40,0.25)' }}
    >
      <div style={{ height: 2, background: STATUS_MAP[booking.status]?.color || '#163328', opacity: 0.6 }} />

      <div style={{ padding: '24px 24px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '70px 1px 1fr', gap: 0, alignItems: 'stretch' }}>
          
          <div style={{ paddingRight: 20, paddingBottom: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', fontFamily: 'system-ui', marginBottom: 4 }}>{departureDate.toLocaleDateString('vi-VN', { month: 'short' })}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '2.5rem', fontWeight: 700, color: '#1a1a1a', lineHeight: 1 }}>{departureDate.getDate()}</div>
              <div style={{ fontSize: 9, color: 'rgba(0,0,0,0.3)', fontFamily: 'system-ui', marginTop: 4 }}>{departureDate.getFullYear()}</div>
            </div>
            <StatusBadge status={booking.status} />
          </div>

          <div style={{ background: 'none', borderLeft: '1px dashed rgba(0,0,0,0.1)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', width: 12, height: 12, borderRadius: '50%', background: '#fcfcfc', border: '1px dashed rgba(0,0,0,0.1)' }} />
            <div style={{ position: 'absolute', bottom: -12, left: '50%', transform: 'translateX(-50%)', width: 12, height: 12, borderRadius: '50%', background: '#fcfcfc', border: '1px dashed rgba(0,0,0,0.1)' }} />
          </div>

          <div style={{ padding: '0 0 20px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.2rem', fontWeight: 500, color: '#1a1a1a', margin: '0 0 4px', lineHeight: 1.2 }}>{agentName}</h3>
                <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.3)', fontFamily: 'monospace', letterSpacing: '0.1em' }}>#{booking.id.slice(0, 8).toUpperCase()}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', fontWeight: 700, color: '#163328', lineHeight: 1 }}>{new Intl.NumberFormat('vi-VN').format(booking.totalAmount)}₫</div>
                <div style={{ fontSize: 9, color: isPaid ? '#4ade80' : '#163328', fontFamily: 'system-ui', fontWeight: 700, marginTop: 4, letterSpacing: '0.05em' }}>{isPaid ? '✓ Đã thanh toán' : '⏳ Chưa thanh toán'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)', marginBottom: 10 }}>
              <MapPin size={10} style={{ color: '#163328', flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a', fontFamily: 'system-ui' }}>{depCity}</span>
              <div style={{ flex: 1, height: 1, background: 'repeating-linear-gradient(to right, rgba(22,51,40,0.3) 0, rgba(22,51,40,0.3) 4px, transparent 4px, transparent 8px)' }} />
              <ArrowRight size={10} style={{ color: '#163328', flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a', fontFamily: 'system-ui' }}>{arrCity}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 10, color: 'rgba(0,0,0,0.35)', fontFamily: 'system-ui' }}>
              {(booking.seatNumbers?.length ?? 0) > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Ticket size={10} /> Ghế: {booking.seatNumbers!.join(', ')}</span>
              )}
              {depTime && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={10} /> {new Date(depTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, background: isActiveTracking && !isMobile ? '#dcfce7' : 'transparent' }}>
        <div>
          {canCancel && (
            <button
              onClick={handleCancel} disabled={isCancelling}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: '1px solid rgba(248,113,113,0.3)',
                color: '#f87171', padding: '6px 14px', cursor: isCancelling ? 'not-allowed' : 'pointer', fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                fontFamily: 'system-ui', transition: 'all 0.2s', opacity: isCancelling ? 0.5 : 1, borderRadius: 6
              }}
            >
              <Ban size={10} /> {isCancelling ? 'Đang hủy...' : 'Hủy vé'}
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onTrack} style={{
            display: 'flex', alignItems: 'center', gap: 6, background: isActiveTracking ? '#16a34a' : 'white', border: isActiveTracking ? '1px solid #16a34a' : '1px solid rgba(0,0,0,0.1)',
            color: isActiveTracking ? 'white' : 'rgba(0,0,0,0.6)', padding: '6px 14px', cursor: 'pointer', fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
            fontFamily: 'system-ui', transition: 'all 0.2s', borderRadius: 6
          }}>
            <MapPin size={10} /> {isActiveTracking ? 'Đang theo dõi' : 'Theo dõi'}
          </button>
          <button onClick={handleViewDetail} style={{
            display: 'flex', alignItems: 'center', gap: 6, background: '#163328', border: 'none', color: '#fcfcfc', padding: '6px 16px', cursor: 'pointer',
            fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'system-ui', borderRadius: 6
          }}>
            Chi tiết <ArrowRight size={10} />
          </button>
        </div>
      </div>

      {/* MOBILE MAP EXPAND */}
      <AnimatePresence>
        {isMobile && isActiveTracking && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
            <div style={{ padding: '0 24px 24px' }}>
              <div style={{ height: 400, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)' }}>
                <TrackingMap 
                  originCoords={[10.814, 106.711]} destCoords={[11.944, 108.444]} currentLocation={[11.2, 107.5]}
                  originName={depCity} destName={arrCity}
                  statusText={booking.status === 'CONFIRMED' ? 'Xe đang di chuyển' : 'Đã dừng'}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── EMPTY ─── */
function EmptyState({ type }: { type: 'upcoming' | 'past' }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '80px 0' }}>
      <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '4rem', color: 'rgba(22,51,40,0.15)', marginBottom: 20 }}>{type === 'upcoming' ? '✦' : '◇'}</div>
      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', fontWeight: 400, color: 'rgba(0,0,0,0.5)', margin: '0 0 10px' }}>{type === 'upcoming' ? 'Chưa có chuyến đi sắp tới' : 'Lịch sử chuyến đi trống'}</h3>
      <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.25)', fontFamily: 'system-ui', maxWidth: 300, margin: '0 auto' }}>
        {type === 'upcoming' ? 'Hãy đặt vé ngay để trải nghiệm dịch vụ xe khách cao cấp của An Chuyến!' : 'Các chuyến đi đã hoàn thành hoặc đã hủy sẽ hiển thị ở đây.'}
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
  const [activeTrackingId, setActiveTrackingId] = useState<string | null>(null);
  
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  useEffect(() => {
    if (user) {
      api.get('/bookings')
        .then(res => setBookings(res.data.data || []))
        .catch(() => toast.error('Không thể tải danh sách vé.'))
        .finally(() => setLoading(false));
    }
  }, [user]);

  // Set default tracking id on load
  useEffect(() => {
    if (!loading && activeTab === 'upcoming' && bookings.length > 0 && !activeTrackingId) {
      const upcoming = bookings.filter(b => ['CONFIRMED', 'PENDING', 'PENDING_PAYMENT'].includes(b.status));
      if (upcoming.length > 0) setActiveTrackingId(upcoming[0].id);
    }
  }, [loading, activeTab, bookings]);

  const handleCancelBooking = (bookingId: string, status: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
  };

  if (isLoading) return <div style={{ background: '#fcfcfc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(0,0,0,0.3)', fontFamily: 'system-ui' }}>Đang tải...</div>;
  if (!user) return <Navigate to="/auth" />;

  const upcoming = bookings.filter(b => ['CONFIRMED', 'PENDING', 'PENDING_PAYMENT'].includes(b.status));
  const past = bookings.filter(b => ['COMPLETED', 'CANCELLED', 'REFUNDED', 'REFUNDING'].includes(b.status));
  const totalSpent = bookings.filter(b => b.paymentStatus === 'PAID').reduce((s, b) => s + (b.totalAmount || 0), 0);
  const shown = activeTab === 'upcoming' ? upcoming : past;
  
  const trackedBooking = bookings.find(b => b.id === activeTrackingId);

  return (
    <div style={{ background: '#fcfcfc', color: '#1a1a1a', minHeight: '100vh', paddingTop: 100 }}>
      {/* ─── HEADER ─── */}
      <div style={{ padding: '0 6% 40px', maxWidth: 1600, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 24, height: 1, background: '#163328' }} />
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#163328', fontFamily: 'system-ui' }}>Tài khoản</span>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2.2rem, 3.5vw, 3.5rem)', fontWeight: 400, color: '#1a1a1a', lineHeight: 1.1, margin: '0 0 32px' }}>
            Chuyến đi <em style={{ color: '#163328' }}>của tôi</em>
          </h1>
          <div style={{ display: 'flex', gap: 0, maxWidth: 600 }}>
            {[{ label: 'Tổng chuyến đi', value: bookings.length }, { label: 'Sắp khởi hành', value: upcoming.length }, { label: 'Tổng chi tiêu', value: totalSpent > 0 ? new Intl.NumberFormat('vi-VN').format(totalSpent) + '₫' : '—' }].map((stat, i) => (
              <div key={i} style={{ flex: 1, padding: '16px 20px', borderRight: i < 2 ? '1px solid rgba(0,0,0,0.07)' : 'none', borderTop: '1px solid rgba(0,0,0,0.07)', borderBottom: '1px solid rgba(0,0,0,0.07)', borderLeft: i === 0 ? '1px solid rgba(0,0,0,0.07)' : 'none' }}>
                <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)', fontFamily: 'system-ui', marginBottom: 6 }}>{stat.label}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 600, color: i === 2 ? '#163328' : '#1a1a1a', lineHeight: 1 }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div style={{ maxWidth: 1600, margin: '0 auto', padding: '0 6%' }}>
        <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(22,51,40,0.2), transparent)' }} />
      </div>

      {/* ─── SPLIT LAYOUT ─── */}
      <div style={{ maxWidth: 1600, margin: '0 auto', padding: '0 6% 100px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '40px', marginTop: 32 }}>
        
        {/* LEFT PANE: TICKETS */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(0,0,0,0.06)', marginBottom: 24 }}>
            {[ { key: 'upcoming', label: 'Sắp khởi hành', count: upcoming.length }, { key: 'past', label: 'Lịch sử', count: past.length } ].map(tab => (
              <button
                key={tab.key} onClick={() => setActiveTab(tab.key as 'upcoming' | 'past')}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: '12px 20px', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                  fontFamily: 'system-ui', display: 'flex', alignItems: 'center', gap: 8, color: activeTab === tab.key ? '#163328' : 'rgba(0,0,0,0.3)',
                  borderBottom: activeTab === tab.key ? '2px solid #163328' : '2px solid transparent', transition: 'all 0.2s',
                }}
              >
                {tab.label}
                {tab.count > 0 && <span style={{ background: activeTab === tab.key ? '#163328' : 'rgba(0,0,0,0.1)', color: activeTab === tab.key ? '#fcfcfc' : 'rgba(0,0,0,0.4)', fontSize: 8, fontWeight: 900, padding: '2px 6px', borderRadius: 2, fontFamily: 'system-ui' }}>{tab.count}</span>}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {loading ? (
                Array.from({ length: 2 }).map((_, i) => <div key={i} style={{ height: 180, background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }} />)
              ) : shown.length === 0 ? (
                <EmptyState type={activeTab} />
              ) : (
                shown.map((b, i) => (
                  <TicketCard 
                    key={b.id} booking={b} index={i} 
                    isActiveTracking={activeTrackingId === b.id} 
                    onTrack={() => setActiveTrackingId(activeTrackingId === b.id ? null : b.id)} 
                    onCancel={handleCancelBooking} 
                    isMobile={isMobile}
                  />
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT PANE: DESKTOP MAP */}
        {!isMobile && (
          <div style={{ width: '50%', flexShrink: 0, position: 'sticky', top: 100, height: 'calc(100vh - 120px)' }}>
            <div className="w-full h-full bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden flex flex-col">
              {trackedBooking ? (
                <>
                  <div className="h-[60%] relative">
                    <TrackingMap 
                      originCoords={[10.814, 106.711]} // Mock coords
                      destCoords={[11.944, 108.444]} 
                      currentLocation={[11.2, 107.5]}
                      originName={trackedBooking.tripSchedule?.trip?.route?.departureCity?.name}
                      destName={trackedBooking.tripSchedule?.trip?.route?.arrivalCity?.name}
                      statusText={trackedBooking.status === 'CONFIRMED' ? 'Xe đang di chuyển' : 'Đã dừng'}
                    />
                  </div>
                  <div className="h-[40%] bg-white p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                        <Map className="text-green-600" size={20} />
                      </div>
                      <div>
                        <h3 className="font-serif text-2xl font-bold text-gray-900 m-0">Định vị trực tiếp</h3>
                        <p className="text-sm font-medium text-gray-500 m-0">Vị trí xe được cập nhật mỗi 30 giây</p>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Dự kiến đến</div>
                        <div className="text-xl font-bold text-gray-900">
                           {trackedBooking.tripSchedule?.arrivalTime 
                              ? new Date(trackedBooking.tripSchedule.arrivalTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                              : '18:30'}
                        </div>
                      </div>
                      <div className="w-px h-10 bg-slate-200"></div>
                      <div>
                        <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Biển số xe</div>
                        <div className="text-xl font-bold text-gray-900">51B-123.45</div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 p-10 text-center">
                  <MapPin size={48} className="text-gray-300 mb-4" />
                  <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">Bản đồ lộ trình</h3>
                  <p className="text-sm font-medium text-gray-500 max-w-sm">Chọn "Theo dõi" trên một chuyến đi để xem vị trí trực tiếp của xe trên bản đồ.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
