import { useState, useEffect } from'react';
import { useAuth } from'../../../contexts/AuthContext';
import { Navigate } from'react-router-dom';
import { Ticket, Calendar, Clock, Download, ChevronRight, TrendingUp, Wallet } from'lucide-react';
import { motion } from'framer-motion';
import { Card } from'../../../design-system/components/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from'../../../design-system/components/Tabs';
import api from'../../../lib/api';

function StatusBadge({ status }: { status: string }) {
 const config: Record<string, { label: string; classes: string }> = {
 CONFIRMED: { label:'Đã xác nhận', classes:'bg-emerald-100 text-emerald-700 border-emerald-200' },
 PENDING: { label:'Chờ xác nhận', classes:'bg-amber-100 text-amber-700 border-amber-200' },
 COMPLETED: { label:'Đã hoàn thành', classes:'bg-gray-100 text-gray-600 border-gray-200' },
 CANCELLED: { label:'Đã hủy', classes:'bg-red-100 text-red-600 border-red-200' },
 };
 const c = config[status] || config['PENDING'];
 return (
 <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full border ${c.classes}`}>{c.label}</span>
 );
}

function TicketCard({ booking, index }: { booking: any; index: number }) {
 return (
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: index * 0.08 }}
 >
 <Card className="overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
 {/* Ticket Header Stripe */}
 <div className="h-2 bg-gradient-to-r from-primary via-slate-500 to-slate-400"></div>
 
 <div className="p-5">
 <div className="flex flex-col sm:flex-row gap-4">
 {/* Date Column */}
 <div className="sm:w-32 flex-shrink-0 flex sm:flex-col items-center sm:items-start gap-3 sm:gap-0 sm:pr-5 sm:border-r border-dashed border-gray-200">
 <div className="bg-primary/8 p-3 text-center min-w-[70px]">
 <div className="text-xs font-bold text-gray-400 uppercase">
 {new Date(booking.createdAt).toLocaleDateString('vi-VN', { month:'short' })}
 </div>
 <div className="text-3xl font-black text-primary leading-none">
 {new Date(booking.createdAt).getDate()}
 </div>
 </div>
 <div className="sm:mt-3">
 <StatusBadge status={booking.status} />
 </div>
 </div>

 {/* Trip Info */}
 <div className="flex-1 min-w-0">
 <div className="flex justify-between items-start mb-3">
 <div>
 <h3 className="font-extrabold text-gray-900 text-base">Chuyến đi #{booking.id.slice(0, 8)}</h3>
 <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 font-medium">
 <Ticket className="w-3.5 h-3.5 text-primary" />
 Ghế: {booking.seatNumbers ? booking.seatNumbers.join(',') :'Chưa xếp'}
 </div>
 </div>
 <div className="text-right flex-shrink-0">
 <div className="text-xl font-extrabold text-primary">{new Intl.NumberFormat('vi-VN').format(booking.totalAmount)}đ</div>
 <div className="text-xs text-gray-400 mt-0.5">{booking.paymentStatus ==='PAID' ?'✅ Đã thanh toán' :'⏳ Chưa thanh toán'}</div>
 </div>
 </div>

 {/* Route Visualization */}
 <div className="flex items-center gap-3 bg-gray-50 p-3">
 <div className="flex items-center gap-1.5 text-sm font-bold text-gray-700">
 <div className="w-2 h-2 rounded-full bg-primary"></div>
 Điểm đi
 </div>
 <div className="flex-1 flex items-center">
 <div className="flex-1 h-px border-t-2 border-dashed border-gray-300"></div>
 <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
 </div>
 <div className="flex items-center gap-1.5 text-sm font-bold text-gray-700">
 Điểm đến
 <div className="w-2 h-2 rounded-full bg-secondary"></div>
 </div>
 </div>
 </div>
 </div>

 {/* Actions */}
 <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-50">
 <button className="flex items-center gap-1.5 text-xs text-gray-500 font-bold px-3 py-2 hover:bg-gray-100 transition-colors">
 <Download className="w-3.5 h-3.5" /> Tải vé
 </button>
 <button className="flex items-center gap-1.5 text-xs text-primary font-bold px-3 py-2 bg-slate-100 hover:bg-slate-200 transition-colors">
 Xem chi tiết <ChevronRight className="w-3.5 h-3.5" />
 </button>
 </div>
 </div>
 </Card>
 </motion.div>
 );
}

function EmptyState({ type }: { type:'upcoming' |'past' }) {
 return (
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 className="flex flex-col items-center justify-center py-20 text-center"
 >
 <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-5">
 {type ==='upcoming' ? <Calendar className="w-12 h-12 text-gray-300" /> : <Clock className="w-12 h-12 text-gray-300" />}
 </div>
 <h3 className="text-xl font-extrabold text-gray-800 mb-2">
 {type ==='upcoming' ?'Chưa có chuyến đi sắp tới' :'Lịch sử chuyến đi trống'}
 </h3>
 <p className="text-gray-400 font-medium max-w-xs">
 {type ==='upcoming' 
 ?'Hãy đặt vé ngay để trải nghiệm dịch vụ cao cấp của An Chuyến!'
 :'Các chuyến đi đã hoàn thành hoặc đã hủy sẽ hiển thị ở đây.'
 }
 </p>
 </motion.div>
 );
}

export function MyBookingsPage() {
 const { user, isLoading } = useAuth();
 const [bookings, setBookings] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 if (user) {
 api.get('/bookings')
 .then(res => setBookings(res.data.data || []))
 .catch(err => console.error(err))
 .finally(() => setLoading(false));
 }
 }, [user]);

 if (isLoading) return <div className="p-12 text-center text-gray-500">Đang tải...</div>;
 if (!user) return <Navigate to="/auth" />;

 const upcoming = bookings.filter(b => b.status ==='CONFIRMED' || b.status ==='PENDING');
 const past = bookings.filter(b => b.status ==='COMPLETED' || b.status ==='CANCELLED');
 const totalSpent = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

 return (
 <div className="min-h-screen bg-gray-50 pt-24 pb-16">
 {/* Page Header */}
 <div className="bg-white border-b border-gray-100 shadow-sm mb-8">
 <div className="container px-4 py-6">
 <h1 className="text-3xl font-black text-gray-900 mb-1">Quản lý chuyến đi</h1>
 <p className="text-gray-500 font-medium">Xem lại và quản lý tất cả các chuyến đi của bạn</p>
 </div>
 </div>

 <div className="container px-4 max-w-4xl">
 {/* Stats Summary */}
 <div className="grid grid-cols-3 gap-4 mb-8">
 {[
 { icon: Ticket, label:'Tổng chuyến đi', value: bookings.length, color:'text-primary', bg:'bg-slate-100' },
 { icon: TrendingUp, label:'Sắp khởi hành', value: upcoming.length, color:'text-emerald-600', bg:'bg-emerald-50' },
 { icon: Wallet, label:'Tổng chi tiêu', value: new Intl.NumberFormat('vi-VN').format(totalSpent) +'đ', color:'text-secondary', bg:'bg-orange-50' },
 ].map((stat, i) => (
 <div key={i} className="bg-white p-4 shadow-sm border border-gray-100 flex items-center gap-3">
 <div className={`w-10 h-10 ${stat.bg} flex items-center justify-center flex-shrink-0`}>
 <stat.icon className={`w-5 h-5 ${stat.color}`} />
 </div>
 <div className="min-w-0">
 <div className="text-xs text-gray-400 font-medium truncate">{stat.label}</div>
 <div className={`font-extrabold text-base ${stat.color} truncate`}>{stat.value}</div>
 </div>
 </div>
 ))}
 </div>

 {/* Tabs */}
 <Tabs defaultValue="upcoming" className="w-full">
 <TabsList className="mb-6 bg-white p-1 border border-gray-100 shadow-sm w-full">
 <TabsTrigger value="upcoming" className="flex-1 font-bold data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md">
 Sắp đi {upcoming.length > 0 && <span className="ml-1.5 bg-current/20 px-1.5 py-0.5 rounded-full text-xs">{upcoming.length}</span>}
 </TabsTrigger>
 <TabsTrigger value="past" className="flex-1 font-bold data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md">
 Đã đi & Đã hủy
 </TabsTrigger>
 </TabsList>
 
 <TabsContent value="upcoming">
 {loading ? (
 <div className="space-y-4">
 {[1, 2].map(i => <div key={i} className="h-40 bg-white animate-pulse border border-gray-100" />)}
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
 {[1, 2].map(i => <div key={i} className="h-40 bg-white animate-pulse border border-gray-100" />)}
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
