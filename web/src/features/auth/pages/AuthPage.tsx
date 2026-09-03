import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, Eye, EyeOff, ChevronLeft, ChevronRight, Globe, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../../../contexts/AuthContext';
import { BrandMark } from '../../../shared/components/BrandMark';
import api from '../../../lib/api';

const GOOGLE_LOGIN_ENABLED = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

const SLIDES = [
  { url: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1400&auto=format&fit=crop', caption: 'Sài Gòn → Đà Lạt', sub: '6 giờ hành trình' },
  { url: 'https://images.unsplash.com/photo-1506905925275-25d74944d957?q=80&w=1400&auto=format&fit=crop', caption: 'Hà Nội → Sapa', sub: '5.5 giờ hành trình' },
  { url: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?q=80&w=1400&auto=format&fit=crop', caption: 'Sài Gòn → Nha Trang', sub: '8 giờ hành trình' },
];

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slide, setSlide] = useState(0);
  const googleWrapRef = useRef<HTMLDivElement>(null);
  const [googleWidth, setGoogleWidth] = useState(360);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';
  const { login } = useAuth();

  useEffect(() => {
    const el = googleWrapRef.current;
    if (!el) return;
    const update = () => setGoogleWidth(Math.round(el.clientWidth));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const prevSlide = () => setSlide(s => (s - 1 + SLIDES.length) % SLIDES.length);
  const nextSlide = () => setSlide(s => (s + 1) % SLIDES.length);

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return;
    setError('');
    setIsSubmitting(true);
    try {
      const res = await api.post('/auth/google', { credential: credentialResponse.credential });
      if (res.data?.token) {
        login(res.data.token, res.data.user);
        if (res.data.isNewUser || !res.data.user?.phone) {
          // Tài khoản Google vừa tạo (hoặc tài khoản cũ vẫn thiếu SĐT) — bắt
          // hoàn thiện hồ sơ trước khi vào app. Tài khoản Google đăng nhập lại
          // bình thường (isNewUser=false, đã có SĐT) thì vào thẳng returnUrl.
          navigate('/complete-profile', { replace: true, state: { returnUrl } });
        } else {
          navigate(returnUrl, { replace: true });
        }
      }
    } catch (err: unknown) {
      let msg = 'Không thể đăng nhập bằng Google. Vui lòng thử lại.';
      if (axios.isAxiosError(err) && (err.response?.data as { message?: string })?.message)
        msg = (err.response!.data as { message: string }).message;
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      if (isLogin) {
        const res = await api.post('/auth/login', { email, password });
        if (res.data?.token) { login(res.data.token, res.data.user); navigate(returnUrl, { replace: true }); }
      } else {
        const res = await api.post('/auth/register', { fullName, phone, email, password });
        if (res.data?.token) {
          login(res.data.token, res.data.user);
          // Tài khoản vừa tạo — luôn dẫn qua trang hoàn thiện hồ sơ (giới tính,
          // ngày sinh, địa chỉ...) trước khi vào app, không chỉ khi thiếu SĐT.
          navigate('/complete-profile', { replace: true, state: { returnUrl } });
        }
      }
    } catch (err: unknown) {
      let msg = isLogin ? 'Email hoặc mật khẩu không đúng' : 'Không thể tạo tài khoản. Vui lòng thử lại.';
      if (axios.isAxiosError(err) && (err.response?.data as { message?: string })?.message)
        msg = (err.response!.data as { message: string }).message;
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex bg-background">
      
      {/* ── LEFT — cinematic card ── */}
      <div className="hidden lg:flex w-[45%] xl:w-[50%] p-6 items-center justify-center relative">
        <div className="w-full h-full rounded-[2rem] overflow-hidden relative shadow-[0_30px_60px_rgba(0,0,0,0.12)]">
          {/* slide image */}
          <AnimatePresence mode="wait">
            <motion.img
              key={slide}
              src={SLIDES[slide].url}
              alt=""
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>

          {/* vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none" />

          {/* TOP nav overlay */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-8 z-10">
            <Link to="/" className="font-display text-3xl font-bold text-white tracking-wide flex items-center gap-2">
              <BrandMark className="w-7 h-7 text-white" />
              An Chuyến
            </Link>
          </div>

          {/* BOTTOM caption + arrows */}
          <div className="absolute bottom-0 left-0 right-0 p-12 z-10 flex items-end justify-between">
            <AnimatePresence mode="wait">
              <motion.div key={slide}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}>
                <div className="text-[10px] font-bold tracking-widest uppercase text-primary mb-3">✦ Tuyến đường nổi bật</div>
                <div className="font-display text-4xl text-white mb-2 leading-tight">{SLIDES[slide].caption}</div>
                <div className="text-sm text-white/70">{SLIDES[slide].sub}</div>
              </motion.div>
            </AnimatePresence>

            <div className="flex gap-4">
              {[{ fn: prevSlide, icon: <ChevronLeft size={20} /> }, { fn: nextSlide, icon: <ChevronRight size={20} /> }].map((btn, i) => (
                <button key={i} onClick={btn.fn}
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300">
                  {btn.icon}
                </button>
              ))}
            </div>
          </div>

          {/* slide dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === slide ? 'w-6 bg-primary' : 'w-1.5 bg-white/40'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT — form ── */}
      <div className="flex-1 flex flex-col bg-background relative overflow-hidden">
        
        {/* Decorative background elements */}
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        {/* top bar */}
        <div className="flex items-center justify-between p-8 lg:px-16 relative z-10">
          <Link to="/" className="lg:hidden font-display text-2xl font-bold text-[#1a1a1a] flex items-center gap-2">
            <BrandMark className="w-6 h-6 text-[#1a1a1a]" />
            An Chuyến
          </Link>
          <span className="hidden lg:block" />
          <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-xs font-bold tracking-widest uppercase text-muted-foreground hover:text-primary hover:border-primary hover:bg-white transition-all shadow-sm">
            <Globe size={14} /> VI
          </button>
        </div>

        {/* form center */}
        <div className="flex-1 flex items-center justify-center p-8 lg:px-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="w-full max-w-[440px] bg-white/60 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-white"
          >
            <AnimatePresence mode="wait">
              <motion.div key={isLogin ? 'login' : 'register'}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>

                {/* greeting */}
                <div className="mb-10 text-center">
                  <h1 className="font-display text-4xl text-[#1a1a1a] mb-3">
                    {isLogin ? 'Xin chào,' : 'Tạo tài khoản,'}
                  </h1>
                  <p className="text-sm text-muted-foreground font-light">
                    {isLogin ? 'Chào mừng trở lại với An Chuyến' : 'Bắt đầu hành trình tiện nghi cùng chúng tôi'}
                  </p>
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-500 text-center">
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <AnimatePresence>
                    {!isLogin && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex flex-col gap-5 overflow-hidden">
                        <div>
                          <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2 block ml-1">Họ và tên</label>
                          <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required placeholder="Nguyễn Văn A"
                            className="w-full bg-gray-50 border border-gray-100 px-5 py-4 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2 block ml-1">Số điện thoại</label>
                          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required placeholder="09xxxxxxxx"
                            className="w-full bg-gray-50 border border-gray-100 px-5 py-4 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div>
                    <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2 block ml-1">Email</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" value={email} onChange={e => setEmail(e.target.value)} required={isLogin} placeholder="ten@example.com"
                        className="w-full bg-gray-50 border border-gray-100 pl-12 pr-5 py-4 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2 mx-1">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Mật khẩu</label>
                      {isLogin && <Link to="/forgot-password" className="text-[11px] text-primary hover:underline">Quên mật khẩu?</Link>}
                    </div>
                    <div className="relative">
                      <Lock size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                        className="w-full bg-gray-50 border border-gray-100 pl-12 pr-12 py-4 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* submit */}
                  <button type="submit" disabled={isSubmitting}
                    className="w-full bg-[#1a1a1a] hover:bg-black text-white py-4 rounded-xl text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 mt-4 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:hover:translate-y-0">
                    {isSubmitting ? 'Đang xử lý...' : (isLogin ? 'Đăng nhập' : 'Tạo tài khoản')}
                    {!isSubmitting && <ArrowRight size={16} className="text-primary group-hover:translate-x-1 transition-transform" />}
                  </button>
                </form>

                {/* divider */}
                <div className="flex items-center gap-4 my-8">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">hoặc</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Google Sign-In — hiển thị nút thật nếu VITE_GOOGLE_CLIENT_ID đã cấu hình,
                    ngược lại báo trạng thái rõ ràng thay vì một nút bấm không phản hồi gì. */}
                {GOOGLE_LOGIN_ENABLED ? (
                  <div ref={googleWrapRef} className="w-full flex justify-center overflow-hidden rounded-xl">
                    <GoogleLogin
                      key={googleWidth}
                      onSuccess={handleGoogleSuccess}
                      onError={() => { setError('Không thể đăng nhập bằng Google. Vui lòng thử lại.'); }}
                      width={googleWidth}
                      shape="pill"
                      size="large"
                      text={isLogin ? 'signin_with' : 'signup_with'}
                      locale="vi"
                    />
                  </div>
                ) : (
                  <button type="button" onClick={() => toast.info('Đăng nhập Google chưa được cấu hình. Vui lòng dùng email/mật khẩu.')}
                    className="w-full py-4 bg-white border border-gray-200 rounded-xl flex items-center justify-center gap-3 text-sm font-semibold text-[#1a1a1a] hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
                    <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 21.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 2.47 2.16 6.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    Đăng nhập với Google
                  </button>
                )}

                <p className="text-center mt-8 text-sm text-muted-foreground">
                  {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
                  <button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); }}
                    className="text-primary font-bold hover:underline transition-all">
                    {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
                  </button>
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
