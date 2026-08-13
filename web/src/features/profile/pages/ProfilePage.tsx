import { useState, useEffect } from'react';
import { toast } from 'sonner';
import { useAuth } from'../../../contexts/AuthContext';
import { Navigate } from'react-router-dom';
import { User, Phone, Mail, Save, LogOut, Wallet, Award, Ticket, TrendingUp, ChevronRight, Shield, Bell } from'lucide-react';
import { motion } from'framer-motion';
import { Button } from'../../../design-system/components/Button';
import { Input } from'../../../design-system/components/Input';
import { Card } from'../../../design-system/components/Card';
import api from'../../../lib/api';

const TIER_CONFIG = {
 Silver: {
 label:'Silver Member',
 color:'from-slate-400 to-slate-600',
 textColor:'text-slate-500',
 bgColor:'bg-slate-100',
 next:'Gold',
 pointsNeeded: 5000,
 currentPoints: 2450,
 icon:'🥈',
 },
 Gold: {
 label:'Gold Member',
 color:'from-yellow-400 to-amber-600',
 textColor:'text-amber-600',
 bgColor:'bg-amber-100',
 next:'Platinum',
 pointsNeeded: 15000,
 currentPoints: 2450,
 icon:'🥇',
 },
};

export function ProfilePage() {
 const { user, logout, isLoading } = useAuth();
 const [fullName, setFullName] = useState('');
 const [phone, setPhone] = useState('');
 const [isSaving, setIsSaving] = useState(false);
 const [message, setMessage] = useState('');

 const tier = TIER_CONFIG['Silver'];

 useEffect(() => {
 if (user) {
 setFullName(user.fullName ||'');
 setPhone(user.phone ||'');
 }
 }, [user]);

 if (isLoading) return <div className="p-12 text-center text-gray-500">Đang tải...</div>;
 if (!user) return <Navigate to="/auth" />;

 const handleSave = async (e: React.FormEvent) => {
 e.preventDefault();
 setIsSaving(true);
 try {
 await api.put('/auth/profile', { fullName, phone });
 setMessage('Lưu thành công!');
 toast.success('Lưu hồ sơ thành công!');
 } catch {
 setMessage('Có lỗi xảy ra khi lưu.');
 toast.error('Có lỗi xảy ra khi lưu.');
 } finally {
 setIsSaving(false);
 }
 };

 const progressPercent = Math.min((tier.currentPoints / tier.pointsNeeded) * 100, 100);

 return (
 <div className="min-h-screen bg-gray-50 pt-24 pb-8">
 {/* Page Header */}
 <div className="bg-white border-b border-gray-100 shadow-sm mb-8">
 <div className="container px-4 py-6 flex justify-between items-center">
 <div>
 <h1 className="text-3xl font-black text-gray-900 mb-1">Hồ sơ cá nhân</h1>
 <p className="text-gray-500 font-medium">Quản lý thông tin và tài khoản của bạn</p>
 </div>
 <Button
 variant="outline"
 onClick={logout}
 className="text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300 font-bold flex items-center gap-2"
 >
 <LogOut className="w-4 h-4" /> Đăng xuất
 </Button>
 </div>
 </div>

 <div className="container px-4 max-w-6xl">
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 
 {/* ===== LEFT COLUMN ===== */}
 <div className="lg:col-span-1 flex flex-col gap-5">
 
 {/* Avatar Card */}
 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
 <Card className="overflow-hidden bg-white border border-gray-100 shadow-sm">
 {/* Header gradient */}
 <div className="h-20 bg-gradient-to-r from-primary via-slate-600 to-slate-1000 relative">
 <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:16px_16px]"></div>
 </div>
 
 <div className="px-6 pb-6 -mt-10 text-center">
 <div className="w-20 h-20 bg-gradient-to-br from-primary to-slate-800 text-white rounded-full flex items-center justify-center text-3xl font-black mx-auto border-4 border-white shadow-lg">
 {fullName.charAt(0).toUpperCase() ||'U'}
 </div>
 <h2 className="text-xl font-extrabold text-gray-900 mt-3">{fullName ||'Tên người dùng'}</h2>
 <p className="text-gray-400 text-sm mt-0.5">{user.email}</p>
 <div className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full text-xs font-extrabold ${tier.bgColor} ${tier.textColor}`}>
 <span>{tier.icon}</span> {tier.label}
 </div>
 </div>

 {/* Quick Stats */}
 <div className="grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100 bg-gray-50/50">
 {[
 { label:'Chuyến đi', value:'0' },
 { label:'Điểm', value:'2,450' },
 { label:'Hạng', value:'Silver' },
 ].map((stat, i) => (
 <div key={i} className="flex flex-col items-center py-4 px-2">
 <div className="font-extrabold text-gray-900 text-base">{stat.value}</div>
 <div className="text-[11px] text-gray-400 font-medium">{stat.label}</div>
 </div>
 ))}
 </div>
 </Card>
 </motion.div>

 {/* Loyalty Card */}
 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
 <div className={`relative bg-gradient-to-br ${tier.color} p-6 text-white overflow-hidden shadow-lg`}>
 {/* Background decoration */}
 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
 <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
 
 <div className="relative z-10">
 <div className="flex justify-between items-start mb-6">
 <div>
 <div className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">An Chuyến Member Card</div>
 <div className="font-extrabold text-xl">{tier.label}</div>
 </div>
 <div className="text-3xl">{tier.icon}</div>
 </div>
 
 <div className="mb-4">
 <div className="flex justify-between text-xs font-bold mb-2">
 <span className="text-white/70">Điểm hiện có</span>
 <span>{tier.currentPoints} / {tier.pointsNeeded} pts → {tier.next}</span>
 </div>
 <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
 <motion.div
 initial={{ width: 0 }}
 animate={{ width: `${progressPercent}%` }}
 transition={{ duration: 1.2, ease:'easeOut' }}
 className="h-full bg-white rounded-full"
 />
 </div>
 </div>

 <div className="flex justify-between items-center">
 <div>
 <div className="text-white/60 text-xs">Điểm tích lũy</div>
 <div className="font-extrabold text-2xl">{tier.currentPoints.toLocaleString()}</div>
 </div>
 <div className="text-right">
 <div className="text-white/60 text-xs">{fullName}</div>
 <div className="text-white/50 text-xs mt-0.5">**** 2450</div>
 </div>
 </div>
 </div>
 </div>
 </motion.div>

 {/* Wallet Card */}
 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
 <Card className="bg-white border border-gray-100 shadow-sm p-5">
 <div className="flex items-center gap-3 mb-4">
 <div className="w-10 h-10 bg-indigo-50 flex items-center justify-center">
 <Wallet className="w-5 h-5 text-indigo-600" />
 </div>
 <div>
 <h3 className="font-extrabold text-gray-900">Ví An Chuyến Pay</h3>
 <div className="text-xs text-gray-400">Số dư khả dụng</div>
 </div>
 </div>
 <div className="text-3xl font-extrabold text-indigo-700 mb-4">500.000<span className="text-xl text-indigo-400">đ</span></div>
 <div className="grid grid-cols-2 gap-2">
 <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-10">Nạp tiền</Button>
 <Button size="sm" variant="outline" className="border-indigo-200 text-indigo-600 font-bold h-10 hover:bg-indigo-50">Lịch sử</Button>
 </div>
 </Card>
 </motion.div>

 {/* Quick Links */}
 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
 <Card className="bg-white border border-gray-100 shadow-sm overflow-hidden">
 {[
 { icon: Ticket, label:'Vé của tôi', sub:'Xem các chuyến đi', href:'/my-bookings', color:'text-primary', bg:'bg-slate-100' },
 { icon: Award, label:'Chương trình điểm', sub:'Đổi điểm ưu đãi', href:'#', color:'text-yellow-600', bg:'bg-yellow-50' },
 { icon: Shield, label:'Bảo mật', sub:'Đổi mật khẩu', href:'#', color:'text-emerald-600', bg:'bg-emerald-50' },
 { icon: Bell, label:'Thông báo', sub:'Tùy chỉnh thông báo', href:'/notifications', color:'text-purple-600', bg:'bg-purple-50' },
 ].map((item, i) => (
 <a key={i} href={item.href} className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
 <div className={`w-9 h-9 ${item.bg} flex items-center justify-center flex-shrink-0`}>
 <item.icon className={`w-4 h-4 ${item.color}`} />
 </div>
 <div className="flex-1 min-w-0">
 <div className="font-bold text-sm text-gray-900">{item.label}</div>
 <div className="text-xs text-gray-400">{item.sub}</div>
 </div>
 <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
 </a>
 ))}
 </Card>
 </motion.div>
 </div>

 {/* ===== RIGHT COLUMN ===== */}
 <div className="lg:col-span-2 flex flex-col gap-5">
 
 {/* Edit Profile Form */}
 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
 <Card className="bg-white border border-gray-100 shadow-sm p-6 md:p-8">
 <h3 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
 <div className="w-8 h-8 bg-slate-100 flex items-center justify-center">
 <User className="w-4 h-4 text-primary" />
 </div>
 Thông tin cá nhân
 </h3>
 
 {message && (
 <div className={`mb-5 p-4 text-sm font-semibold flex items-center gap-2 ${message.includes('thành công') ?'bg-emerald-50 text-emerald-700 border border-emerald-100' :'bg-red-50 text-red-600 border border-red-100'}`}>
 <span>{message.includes('thành công') ?'✅' :'❌'}</span>
 {message}
 </div>
 )}

 <form onSubmit={handleSave} className="space-y-5">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
 <div className="space-y-2">
 <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Họ và tên</label>
 <div className="relative">
 <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
 <Input 
 type="text" 
 value={fullName} 
 onChange={(e) => setFullName(e.target.value)} 
 required 
 className="pl-11 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-primary font-medium text-gray-900 transition-all" 
 placeholder="Nhập họ và tên"
 />
 </div>
 </div>

 <div className="space-y-2">
 <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Số điện thoại</label>
 <div className="relative">
 <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
 <Input 
 type="text" 
 value={phone} 
 onChange={(e) => setPhone(e.target.value)} 
 className="pl-11 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-primary font-medium text-gray-900 transition-all" 
 placeholder="Nhập số điện thoại"
 />
 </div>
 </div>
 </div>

 <div className="space-y-2">
 <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Email (Không thể thay đổi)</label>
 <div className="relative">
 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
 <Input 
 type="email" 
 value={user.email} 
 disabled 
 className="pl-11 h-12 bg-gray-100 border-gray-200 font-medium text-gray-400 cursor-not-allowed" 
 />
 </div>
 </div>

 <div className="flex gap-3 pt-2">
 <Button 
 type="submit" 
 disabled={isSaving} 
 className="btn-primary text-white h-12 px-8 font-extrabold shadow-md hover:scale-[1.02] transition-all flex items-center gap-2"
 >
 <Save className="w-4 h-4" />
 {isSaving ?'Đang lưu...' :'Lưu thay đổi'}
 </Button>
 </div>
 </form>
 </Card>
 </motion.div>

 {/* Membership Benefits */}
 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
 <Card className="bg-white border border-gray-100 shadow-sm p-6 md:p-8">
 <h3 className="text-xl font-extrabold text-gray-900 mb-2 flex items-center gap-2">
 <div className="w-8 h-8 bg-yellow-50 flex items-center justify-center">
 <Award className="w-4 h-4 text-yellow-600" />
 </div>
 Quyền lợi thành viên Silver
 </h3>
 <p className="text-sm text-gray-400 font-medium mb-6">Tích thêm <strong className="text-gray-700">{(tier.pointsNeeded - tier.currentPoints).toLocaleString()} điểm</strong> để lên hạng Gold và nhận nhiều ưu đãi hơn!</p>
 
 <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
 {[
 { icon:'🎫', title:'Ưu tiên đặt vé', desc:'Giữ ghế ưu tiên trước 10 phút' },
 { icon:'💰', title:'Hoàn tiền 2%', desc:'Mỗi giao dịch thành công' },
 { icon:'🎁', title:'Mã giảm giá', desc:'Độc quyền mỗi tháng' },
 { icon:'📞', title:'Hotline riêng', desc:'Hỗ trợ 24/7 nhanh hơn' },
 { icon:'⭐', title:'Điểm x1.5', desc:'Mỗi chuyến đi đặt qua app' },
 { icon:'🛡️', title:'Bảo hiểm miễn phí', desc:'Bảo vệ mọi chuyến đi' },
 ].map((benefit, i) => (
 <div key={i} className="bg-gray-50 p-3 hover:bg-slate-100 transition-colors">
 <div className="text-2xl mb-2">{benefit.icon}</div>
 <div className="font-extrabold text-sm text-gray-900 mb-0.5">{benefit.title}</div>
 <div className="text-xs text-gray-400 font-medium">{benefit.desc}</div>
 </div>
 ))}
 </div>
 </Card>
 </motion.div>

 {/* Activity Stats */}
 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
 <Card className="bg-white border border-gray-100 shadow-sm p-6">
 <h3 className="text-xl font-extrabold text-gray-900 mb-5 flex items-center gap-2">
 <div className="w-8 h-8 bg-slate-100 flex items-center justify-center">
 <TrendingUp className="w-4 h-4 text-primary" />
 </div>
 Thống kê của tôi
 </h3>
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
 {[
 { label:'Tổng chuyến đi', value:'0', icon:'🚌', color:'text-primary' },
 { label:'Điểm tích lũy', value:'2,450', icon:'⭐', color:'text-yellow-600' },
 { label:'Km đã đi', value:'0 km', icon:'📍', color:'text-emerald-600' },
 { label:'Đã tiết kiệm', value:'0đ', icon:'💰', color:'text-secondary' },
 ].map((stat, i) => (
 <div key={i} className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 p-4 text-center">
 <div className="text-2xl mb-2">{stat.icon}</div>
 <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
 <div className="text-xs text-gray-400 font-medium mt-0.5">{stat.label}</div>
 </div>
 ))}
 </div>
 </Card>
 </motion.div>
 </div>

 </div>
 </div>
 </div>
 );
}
