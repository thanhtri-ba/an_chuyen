import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Ticket, Calendar, Clock, Download, ChevronRight, TrendingUp, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../../../design-system/components/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../design-system/components/Tabs';
import api from '../../../lib/api';
import type { Booking } from '../../../types';

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; classes: string }> = {
    CONFIRMED: { label: 'Đã xác nhận', classes: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/10 dark:text-emerald-400 dark:border-emerald-900/30' },
    PENDING: { label: 'Chờ xác nhận', classes: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/10 dark:text-amber-400 dark:border-amber-900/30' },
    PENDING_PAYMENT: { label: 'Chờ thanh toán', classes: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/10 dark:text-amber-400 dark:border-amber-900/30' },
    COMPLETED: { label: 'Đã hoàn thành', classes: 'bg-slate-50 text-slate-650 border-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800' },
    CANCELLED: { label: 'Đã hủy', classes: 'bg-red-50 text-red-650 border-red-100 dark:bg-red-950/10 dark:text-red-400 dark:border-red-900/30' },
    REFUNDING: { label: 'Đang hoàn tiền', classes: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/10 dark:text-blue-400 dark:border-blue-900/30' },
    REFUNDED: { label: 'Đã hoàn tiền', classes: 'bg-slate-50 text-slate-650 border-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800' },
  };
  const c = config[status] || config['PENDING'];
  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${c.classes}`}>{c.label}</span>
  );
}

function TicketCard({ booking, index }: { booking: Booking; index: number }) {
  const depTime = booking.tripSchedule?.departureTime;
  const departureDate = depTime ? new Date(depTime) : new Date(booking.createdAt);
  
  const depCityName = booking.tripSchedule?.trip?.route?.departureCity?.name || 'Điểm đi';
  const arrCityName = booking.tripSchedule?.trip?.route?.arrivalCity?.name || 'Điểm đến';
  const agentName = booking.tripSchedule?.trip?.busAgent?.name || 'Chuyến đi';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <Card className="overflow-visible bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-805 p-6 shadow-[0_4px_25px_rgba(0,0,0,0.015)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 relative group rounded-2xl">
        {/* Top and Bottom Ticket Notches */}
        <div className="absolute -top-3 left-[140px] w-6 h-6 rounded-full bg-gray-50 dark:bg-slate-900 border border-slate-100/80 dark:border-slate-800 z-10 hidden sm:block"></div>
        <div className="absolute -bottom-3 left-[140px] w-6 h-6 rounded-full bg-gray-50 dark:bg-slate-900 border border-slate-100/80 dark:border-slate-800 z-10 hidden sm:block"></div>

        <div className="flex flex-col sm:flex-row gap-6">
          {/* Date Column */}
          <div className="sm:w-32 flex-shrink-0 flex sm:flex-col items-center sm:items-start gap-3 sm:gap-0 sm:pr-6 sm:border-r border-dashed border-slate-150 dark:border-slate-800">
            <div className="bg-slate-50 dark:bg-slate-900 p-3 text-center min-w-[80px] rounded-xl border border-slate-100/70 dark:border-slate-800/80">
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {departureDate.toLocaleDateString('vi-VN', { month: 'short' })}
              </div>
              <div className="text-3xl font-black text-slate-800 dark:text-slate-100 leading-none mt-1">
                {departureDate.getDate()}
              </div>
            </div>
            <div className="sm:mt-4">
              <StatusBadge status={booking.status} />
            </div>
          </div>

          {/* Trip Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row justify-between items-start gap-3 mb-4">
              <div>
                <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg leading-tight">{agentName} <span className="text-sm font-bold text-slate-400">#{booking.id.slice(0, 8)}</span></h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2.5 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Ticket className="w-4 h-4 text-slate-400" />
                    Ghế: {booking.seatNumbers ? booking.seatNumbers.join(', ') : 'Chưa xếp'}
                  </div>
                  {depTime && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-slate-400" />
                      Giờ chạy: {new Date(depTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-2xl font-extrabold text-secondary tracking-tight">{new Intl.NumberFormat('vi-VN').format(booking.totalAmount)}đ</div>
                <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mt-1">{booking.paymentStatus === 'PAID' ? '✅ Đã thanh toán' : '⏳ Chưa thanh toán'}</div>
              </div>
            </div>

            {/* Route Visualization */}
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-100/30 dark:border-slate-800/30">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
                <div className="w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-primary/10"></div>
                {depCityName}
              </div>
              <div className="flex-1 flex items-center">
                <div className="flex-1 h-0.5 border-t border-dashed border-slate-350 dark:border-slate-700"></div>
                <ChevronRight className="w-4 h-4 text-slate-350 dark:text-slate-655 flex-shrink-0" />
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
                {arrCityName}
                <div className="w-2.5 h-2.5 rounded-full bg-secondary ring-4 ring-secondary/10"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-slate-100 dark:border-slate-900">
          <button className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white font-bold px-3 py-2 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-100/50 dark:border-slate-800">
            <Download className="w-3.5 h-3.5" /> Tải vé
          </button>
          <button className="flex items-center gap-1.5 text-xs text-white font-bold px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-850 dark:hover:bg-slate-800 rounded-lg transition-colors border-none">
            Xem chi tiết <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </Card>
    </motion.div>
  );
}

function EmptyState({ type }: { type: 'upcoming' | 'past' }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-5 border border-slate-100/50 dark:border-slate-850">
        {type === 'upcoming' ? <Calendar className="w-10 h-10 text-slate-400" /> : <Clock className="w-10 h-10 text-slate-400" />}
      </div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
        {type === 'upcoming' ? 'Chưa có chuyến đi sắp tới' : 'Lịch sử chuyến đi trống'}
      </h3>
      <p className="text-slate-450 dark:text-slate-500 font-semibold max-w-xs leading-relaxed text-sm">
        {type === 'upcoming' 
          ? 'Hãy đặt vé ngay để trải nghiệm dịch vụ xe khách cao cấp của An Chuyến!'
          : 'Các chuyến đi đã hoàn thành hoặc đã hủy sẽ hiển thị ở đây.'
        }
      </p>
    </motion.div>
  );
}

export function MyBookingsPage() {
  const { user, isLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api.get('/bookings')
        .then(res => setBookings(res.data.data || []))
        .catch(err => {
          console.error(err);
          toast.error('Lỗi tải danh sách vé. Vui lòng thử lại.');
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (isLoading) return <div className="p-12 text-center text-slate-500">Đang tải...</div>;
  if (!user) return <Navigate to="/auth" />;

  const upcoming = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING' || b.status === 'PENDING_PAYMENT');
  const past = bookings.filter(b => b.status === 'COMPLETED' || b.status === 'CANCELLED' || b.status === 'REFUNDED' || b.status === 'REFUNDING');
  const totalSpent = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-20 pb-16">
      {/* Page Header */}
      <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-900 py-6 mb-8 sticky top-0 md:top-20 z-30 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)]">
        <div className="container px-4">
          <h1 className="text-3xl font-black text-slate-800 dark:text-slate-150 mb-1 tracking-tight">Quản lý chuyến đi</h1>
          <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm">Xem lại và quản lý tất cả các chuyến đi của bạn</p>
        </div>
      </div>

      <div className="container px-4 max-w-4xl">
        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: Ticket, label:'Tổng chuyến đi', value: bookings.length, color:'text-primary', bg:'bg-orange-50 dark:bg-orange-950/20' },
            { icon: TrendingUp, label:'Sắp khởi hành', value: upcoming.length, color:'text-emerald-600 dark:text-emerald-400', bg:'bg-emerald-50 dark:bg-emerald-950/20' },
            { icon: Wallet, label:'Tổng chi tiêu', value: new Intl.NumberFormat('vi-VN').format(totalSpent) +'đ', color:'text-secondary', bg:'bg-orange-50 dark:bg-orange-950/20' },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-950 p-4 border border-slate-100 dark:border-slate-805 shadow-[0_4px_20px_rgba(0,0,0,0.01)] rounded-2xl flex items-center gap-4 hover:shadow-[0_10px_25px_rgba(0,0,0,0.04)] transition-all duration-300">
              <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-slate-450 dark:text-slate-500 font-bold truncate tracking-wide">{stat.label}</div>
                <div className={`font-extrabold text-base ${stat.color} truncate mt-0.5`}>{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-6 bg-slate-100/80 dark:bg-slate-900 p-1 border border-slate-200/50 dark:border-slate-800 rounded-full shadow-inner w-full flex justify-between">
            <TabsTrigger value="upcoming" className="flex-1 font-bold rounded-full py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-slate-800 dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all text-sm text-slate-500">
              Sắp khởi hành {upcoming.length > 0 && <span className="ml-1.5 bg-[#ff4525] text-white px-2 py-0.5 rounded-full text-[10px] font-bold">{upcoming.length}</span>}
            </TabsTrigger>
            <TabsTrigger value="past" className="flex-1 font-bold rounded-full py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-slate-800 dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all text-sm text-slate-500">
              Lịch sử chuyến đi
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map(i => <div key={i} className="h-40 bg-white animate-pulse border border-slate-100 rounded-2xl" />)}
              </div>
            ) : upcoming.length === 0 ? (
              <EmptyState type="upcoming" />
            ) : (
              <div className="space-y-4">
                {upcoming.map((b, i) => <TicketCard key={b.id} booking={b} index={i} />)}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past">
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map(i => <div key={i} className="h-40 bg-white animate-pulse border border-slate-100 rounded-2xl" />)}
              </div>
            ) : past.length === 0 ? (
              <EmptyState type="past" />
            ) : (
              <div className="space-y-4">
                {past.map((b, i) => <TicketCard key={b.id} booking={b} index={i} />)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
