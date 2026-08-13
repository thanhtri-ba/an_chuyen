import { useState } from'react';
import { Link, useNavigate } from'react-router-dom';
import { Mail, Lock, ArrowRight, User, Eye, EyeOff, ShieldCheck, Zap, Sparkles, Navigation } from'lucide-react';
import { motion, AnimatePresence } from'framer-motion';

import { Button } from'../../../design-system/components/Button';
import { Input } from'../../../design-system/components/Input';
import { useAuth } from'../../../contexts/AuthContext';
import api from'../../../lib/api';

export function AuthPage() {
 const [isLogin, setIsLogin] = useState(true);
 const [showPassword, setShowPassword] = useState(false);
 const [fullName, setFullName] = useState('');
 const [phone, setPhone] = useState('');
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [error, setError] = useState('');
 const [isSubmitting, setIsSubmitting] = useState(false);
 const navigate = useNavigate();
 const { login } = useAuth();

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setError('');
 setIsSubmitting(true);

 if (isLogin) {
 try {
 const res = await api.post('/auth/login', { email, password });
 if (res.data && res.data.token) {
 login(res.data.token, res.data.user);
 navigate('/');
 }
 } catch (err: any) {
 setError(err.response?.data?.message ||'Thông tin đăng nhập không chính xác');
 } finally {
 setIsSubmitting(false);
 }
 } else {
 try {
 const res = await api.post('/auth/register', { fullName, phone, email, password });
 if (res.data && res.data.token) {
 login(res.data.token, res.data.user);
 navigate('/');
 }
 } catch (err: any) {
 setError(err.response?.data?.message ||'Không thể tạo tài khoản. Vui lòng thử lại.');
 } finally {
 setIsSubmitting(false);
 }
 }
 };

 // Advanced Animation Variants
 const containerVariants: any = {
 hidden: { opacity: 0 },
 visible: { 
 opacity: 1,
 transition: { staggerChildren: 0.1, delayChildren: 0.1 }
 }
 };

 const itemVariants: any = {
 hidden: { opacity: 0, y: 20 },
 visible: { opacity: 1, y: 0, transition: { type:"spring", stiffness: 300, damping: 24 } }
 };

 const floatingVariants: any = {
 float1: {
 y: [0, -15, 0],
 rotate: [0, 5, 0],
 transition: { duration: 6, repeat: Infinity, ease:"easeInOut" }
 },
 float2: {
 y: [0, 15, 0],
 rotate: [0, -5, 0],
 transition: { duration: 5, repeat: Infinity, ease:"easeInOut", delay: 1 }
 }
 };

 return (
 <div className="min-h-screen flex bg-slate-50 relative overflow-hidden font-sans">
 
 {/* Background Decorative Mesh & Blobs */}
 <div className="absolute inset-0 bg-[#f8fafc] z-0"></div>
 <motion.div 
 animate={{ scale: [1, 1.1, 1], rotate: [0, 45, 0] }}
 transition={{ duration: 30, repeat: Infinity, ease:"linear" }}
 className="absolute -top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-primary/10 to-slate-600/10 blur-[100px] pointer-events-none z-0"
 />
 <motion.div 
 animate={{ scale: [1, 1.2, 1], rotate: [0, -45, 0] }}
 transition={{ duration: 25, repeat: Infinity, ease:"linear" }}
 className="absolute -bottom-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-slate-1000/10 to-emerald-500/10 blur-[100px] pointer-events-none z-0"
 />

 {/* Left side - Dynamic Premium Banner */}
 <div className="hidden lg:flex w-1/2 relative overflow-hidden shadow-2xl z-10 m-4 .5rem] bg-slate-900 border border-white/10">
 <motion.img 
 initial={{ scale: 1.1 }}
 animate={{ scale: 1.05 }}
 transition={{ duration: 20, repeat: Infinity, repeatType:"reverse", ease:"linear" }}
 src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop" 
 alt="Bus journey" 
 className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent"></div>
 <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 to-transparent"></div>
 
 {/* Abstract Grid Overlay */}
 <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]"></div>

 <div className="absolute inset-0 flex flex-col justify-between p-16 z-20">
 
 <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-3">
 <div className="w-12 h-12 bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
 <Navigation className="w-6 h-6 text-white rotate-45" />
 </div>
 <span className="text-2xl font-black text-white tracking-tight">An Chuyến Premium</span>
 </motion.div>

 <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative z-10 text-white max-w-lg">
 <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
 <Sparkles className="w-4 h-4 text-amber-300" />
 <span className="text-xs font-bold tracking-widest uppercase text-white/90">Giải pháp tối ưu cho doanh nghiệp</span>
 </motion.div>
 
 <motion.h1 variants={itemVariants} className="text-6xl font-black mb-6 tracking-tighter leading-[1.1]">
 Kiến tạo <br/>
 <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-500 via-cyan-300 to-emerald-300">
 Tương lai di chuyển
 </span>
 </motion.h1>
 
 <motion.p variants={itemVariants} className="text-lg font-medium text-slate-300 mb-12 leading-relaxed">
 Trải nghiệm siêu ứng dụng quản lý và đặt vé xe thông minh. Tích hợp AI, tối ưu vận hành và gia tăng doanh thu vượt trội.
 </motion.p>
 
 <motion.div variants={containerVariants} className="space-y-6">
 {[
 { icon: ShieldCheck, title:'Hệ thống bảo mật cấp cao', desc:'Mã hóa giao dịch chuẩn quốc tế', color:'bg-emerald-500/20 text-emerald-400' },
 { icon: Zap, title:'Vận hành tự động hóa', desc:'Quản lý lịch trình thông minh', color:'bg-amber-500/20 text-amber-400' },
 ].map((item, idx) => (
 <motion.div key={idx} variants={itemVariants} className="flex items-center gap-5 group">
 <div className={`w-14 h-14 flex items-center justify-center ${item.color} border border-white/10 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300`}>
 <item.icon className="w-6 h-6" />
 </div>
 <div>
 <h3 className="font-bold text-lg text-white mb-0.5">{item.title}</h3>
 <p className="text-sm text-slate-400 font-medium">{item.desc}</p>
 </div>
 </motion.div>
 ))}
 </motion.div>
 </motion.div>
 </div>

 {/* Floating Decorative Elements */}
 <motion.div variants={floatingVariants} animate="float1" className="absolute top-[20%] right-[10%] w-32 h-32 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-3xl shadow-2xl rotate-12"></motion.div>
 <motion.div variants={floatingVariants} animate="float2" className="absolute bottom-[30%] right-[20%] w-20 h-20 rounded-full border border-white/10 bg-gradient-to-br from-primary/30 to-slate-600/30 backdrop-blur-xl shadow-2xl"></motion.div>
 </div>

 {/* Right side - Form */}
 <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 z-20 relative">
 <Link to="/">
 <motion.div 
 whileHover={{ scale: 1.05 }} 
 whileTap={{ scale: 0.95 }}
 className="absolute top-8 right-8 text-sm font-bold bg-white px-5 py-2.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.05)] text-slate-500 hover:text-slate-900 transition-all cursor-pointer z-50 flex items-center gap-2 border border-slate-100"
 >
 ← Trở về
 </motion.div>
 </Link>

 <motion.div 
 initial={{ opacity: 0, y: 30 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ type:"spring", stiffness: 300, damping: 25 }}
 className="w-full max-w-[420px]"
 >
 {/* Form Container */}
 <div className="w-full p-8 sm:p-10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.1)] border border-white/60 .5rem] bg-white/80 backdrop-blur-2xl relative">
 
 <AnimatePresence mode="wait">
 <motion.div
 key={isLogin ?'login' :'register'}
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 transition={{ duration: 0.2 }}
 >
 <div className="mb-10 text-center">
 <div className="lg:hidden w-12 h-12 bg-primary flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30">
 <Navigation className="w-6 h-6 text-white rotate-45" />
 </div>
 <h2 className="text-3xl font-black tracking-tight mb-2 text-slate-900">
 {isLogin ?'Đăng nhập hệ thống' :'Mở tài khoản mới'}
 </h2>
 <p className="text-slate-500 font-medium text-sm">
 {isLogin ?'Nhập thông tin xác thực để truy cập' :'Điền thông tin để bắt đầu sử dụng An Chuyến'}
 </p>
 </div>

 {error && (
 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-6 p-4 bg-red-50/80 border border-red-100 text-red-600 text-sm font-bold flex items-center gap-3">
 <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
 {error}
 </motion.div>
 )}
 
 <form onSubmit={handleSubmit} className="space-y-5">
 <AnimatePresence>
 {!isLogin && (
 <motion.div 
 initial={{ opacity: 0, height: 0 }} 
 animate={{ opacity: 1, height:'auto' }}
 exit={{ opacity: 0, height: 0 }}
 className="space-y-1.5 overflow-hidden"
 >
 <label className="text-[11px] font-black text-slate-400 ml-1 uppercase tracking-widest">Họ và tên</label>
 <div className="relative group">
 <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
 <Input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="pl-12 h-14 bg-slate-50 border-slate-200 focus:bg-white focus:shadow-md focus:border-primary/50 transition-all text-base font-semibold" placeholder="VD: Nguyễn Văn A" />
 </div>
 </motion.div>
 )}
 </AnimatePresence>

 {!isLogin && (
 <div className="space-y-1.5">
 <label className="text-[11px] font-black text-slate-400 ml-1 uppercase tracking-widest">Số điện thoại</label>
 <div className="relative group">
 <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
 <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="pl-12 h-14 bg-slate-50 border-slate-200 focus:bg-white focus:shadow-md focus:border-primary/50 transition-all text-base font-semibold" placeholder="09xxxxxxxx" />
 </div>
 </div>
 )}

 <div className="space-y-1.5">
 <label className="text-[11px] font-black text-slate-400 ml-1 uppercase tracking-widest">{isLogin ?'Email / Số điện thoại' :'Email (không bắt buộc)'}</label>
 <div className="relative group">
 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
 <Input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required={isLogin} className="pl-12 h-14 bg-slate-50 border-slate-200 focus:bg-white focus:shadow-md focus:border-primary/50 transition-all text-base font-semibold" placeholder="admin@example.com" />
 </div>
 </div>

 <div className="space-y-1.5">
 <div className="flex justify-between items-center ml-1">
 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Mật khẩu</label>
 {isLogin && (
 <a href="#" className="text-[11px] font-bold text-primary hover:text-primary/80 transition-colors">
 Quên mật khẩu?
 </a>
 )}
 </div>
 <div className="relative group">
 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
 <Input 
 type={showPassword ?'text' :'password'} 
 required 
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 className="pl-12 pr-12 h-14 bg-slate-50 border-slate-200 focus:bg-white focus:shadow-md focus:border-primary/50 transition-all text-base font-semibold" 
 placeholder="••••••••" 
 />
 <button 
 type="button" 
 onClick={() => setShowPassword(!showPassword)}
 className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
 >
 {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
 </button>
 </div>
 </div>

 <Button 
 type="submit" 
 className="w-full h-14 mt-4 font-extrabold text-lg shadow-xl shadow-primary/30 bg-gradient-to-r from-primary to-slate-700 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group"
 disabled={isSubmitting}
 >
 <span className="relative z-10 flex items-center justify-center gap-2">
 {isSubmitting ? (
 <>Đang xử lý...</>
 ) : (
 <>{isLogin ?'Đăng nhập' :'Tạo tài khoản'} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
 )}
 </span>
 <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out z-0"></div>
 </Button>
 </form>

 <div className="mt-8 mb-6 relative">
 <div className="absolute inset-0 flex items-center">
 <div className="w-full border-t border-slate-200"></div>
 </div>
 <div className="relative flex justify-center text-sm">
 <span className="px-4 bg-white text-slate-500 font-medium">Hoặc tiếp tục với</span>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <button type="button" className="flex items-center justify-center gap-2 h-12 bg-white border border-slate-200 hover:bg-slate-50 hover:shadow-sm transition-all font-semibold text-slate-700">
 <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 21.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 2.47 2.16 6.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
 Google
 </button>
 <button type="button" className="flex items-center justify-center gap-2 h-12 bg-white border border-slate-200 hover:bg-slate-50 hover:shadow-sm transition-all font-semibold text-slate-700">
 <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
 Facebook
 </button>
 </div>

 <div className="mt-8 text-center">
 <p className="text-slate-500 font-medium text-sm">
 {isLogin ?'Chưa có tài khoản?' :'Đã có tài khoản?'}
 <button 
 onClick={() => {
 setIsLogin(!isLogin);
 setError('');
 }} 
 className="ml-2 font-bold text-primary hover:underline transition-all focus:outline-none"
 >
 {isLogin ?'Đăng ký ngay' :'Đăng nhập'}
 </button>
 </p>
 </div>
 </motion.div>
 </AnimatePresence>
 </div>
 
 <div className="text-center mt-6 text-slate-400 text-xs font-medium">
 Bằng việc tiếp tục, bạn đồng ý với <a href="#" className="underline hover:text-slate-600 transition-colors">Điều khoản Dịch vụ</a> và <a href="#" className="underline hover:text-slate-600 transition-colors">Chính sách Bảo mật</a> của chúng tôi.
 </div>
 </motion.div>
 </div>
 </div>
 );
}
