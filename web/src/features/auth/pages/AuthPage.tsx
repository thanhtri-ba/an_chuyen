import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, Eye, EyeOff, ChevronLeft, ChevronRight, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../lib/api';

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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';
  const { login } = useAuth();

  const prevSlide = () => setSlide(s => (s - 1 + SLIDES.length) % SLIDES.length);
  const nextSlide = () => setSlide(s => (s + 1) % SLIDES.length);

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
        if (res.data?.token) { login(res.data.token, res.data.user); navigate(returnUrl, { replace: true }); }
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

  const inputBase: React.CSSProperties = {
    width: '100%', height: 54, padding: '0 14px',
    background: 'transparent', border: 'none',
    borderBottom: '1.5px solid #e5e0d8',
    fontSize: 16, color: '#1a1a1a', outline: 'none',
    fontFamily: "'Outfit', sans-serif", transition: 'border-color 200ms',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f8f5f0', fontFamily: "'Outfit', sans-serif" }}>

      {/* ── LEFT — cinematic card ── */}
      <div className="hidden lg:flex" style={{ width: '52%', padding: 20, alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', height: 'calc(100vh - 40px)', borderRadius: 28, overflow: 'hidden', position: 'relative', background: '#0e1111', boxShadow: '0 32px 80px rgba(0,0,0,0.28)' }}>

          {/* slide image */}
          <AnimatePresence mode="wait">
            <motion.img
              key={slide}
              src={SLIDES[slide].url}
              alt=""
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.55)' }}
            />
          </AnimatePresence>

          {/* vignette */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,17,17,0.85) 0%, rgba(14,17,17,0.1) 50%, rgba(14,17,17,0.5) 100%)', pointerEvents: 'none' }} />

          {/* TOP nav overlay */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 28px', zIndex: 2 }}>
            <Link to="/" style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, fontStyle: 'italic', color: 'rgba(255,255,255,0.9)', textDecoration: 'none' }}>
              An Chuyến
            </Link>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => { setIsLogin(true); setError(''); }}
                style={{ padding: '8px 18px', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 99, color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", backdropFilter: 'blur(8px)' }}>
                Đăng nhập
              </button>
              <button
                onClick={() => { setIsLogin(false); setError(''); }}
                style={{ padding: '8px 18px', background: 'rgba(212,175,55,0.9)', border: 'none', borderRadius: 99, color: '#0e1111', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>
                Đăng ký
              </button>
            </div>
          </div>

          {/* BOTTOM caption + arrows */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px', zIndex: 2, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <AnimatePresence mode="wait">
              <motion.div key={slide}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}>
                <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#d4af37', marginBottom: 6 }}>✦ Tuyến đường nổi bật</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 400, color: '#fff', lineHeight: 1.2 }}>{SLIDES[slide].caption}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{SLIDES[slide].sub}</div>
              </motion.div>
            </AnimatePresence>

            <div style={{ display: 'flex', gap: 10 }}>
              {[{ fn: prevSlide, icon: <ChevronLeft size={16} /> }, { fn: nextSlide, icon: <ChevronRight size={16} /> }].map((btn, i) => (
                <button key={i} onClick={btn.fn}
                  style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(8px)', transition: 'background 200ms' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(212,175,55,0.5)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}>
                  {btn.icon}
                </button>
              ))}
            </div>
          </div>

          {/* slide dots */}
          <div style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6, zIndex: 2 }}>
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)}
                style={{ width: i === slide ? 20 : 6, height: 6, borderRadius: 99, background: i === slide ? '#d4af37' : 'rgba(255,255,255,0.35)', border: 'none', cursor: 'pointer', transition: 'all 300ms', padding: 0 }} />
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT — form ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#ffffff' }}>

        {/* top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 48px' }}>
          <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, fontStyle: 'italic', color: '#1a1a1a' }}>An Chuyến</span>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: '1px solid #e5e0d8', borderRadius: 99, background: 'none', cursor: 'pointer', fontSize: 13, color: '#666', fontFamily: "'Outfit', sans-serif" }}>
            <Globe size={14} /> VI ▾
          </button>
        </div>

        {/* form center */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 48px 40px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            style={{ width: '100%', maxWidth: 480 }}
          >
            <AnimatePresence mode="wait">
              <motion.div key={isLogin ? 'login' : 'register'}
                initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>

                {/* greeting */}
                <div style={{ marginBottom: 36 }}>
                  <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem,3.5vw,2.6rem)', fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px', lineHeight: 1.1 }}>
                    {isLogin ? 'Xin chào,' : 'Tạo tài khoản,'}
                  </h1>
                  <p style={{ fontSize: 14, color: '#999', margin: 0 }}>
                    {isLogin ? 'Chào mừng trở lại An Chuyến' : 'Bắt đầu hành trình tiện nghi cùng chúng tôi'}
                  </p>
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ marginBottom: 20, padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, fontSize: 13, color: '#dc2626' }}>
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

                    {/* register fields */}
                    <AnimatePresence>
                      {!isLogin && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <div>
                            <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', display: 'block', marginBottom: 4 }}>Họ và tên</label>
                            <input style={inputBase} type="text" value={fullName} onChange={e => setFullName(e.target.value)} required placeholder="Nguyễn Văn A"
                              onFocus={e => (e.target.style.borderBottomColor = '#d4af37')}
                              onBlur={e => (e.target.style.borderBottomColor = '#e5e0d8')} />
                          </div>
                          <div>
                            <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', display: 'block', marginBottom: 4 }}>Số điện thoại</label>
                            <input style={inputBase} type="tel" value={phone} onChange={e => setPhone(e.target.value)} required placeholder="09xxxxxxxx"
                              onFocus={e => (e.target.style.borderBottomColor = '#d4af37')}
                              onBlur={e => (e.target.style.borderBottomColor = '#e5e0d8')} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', display: 'block', marginBottom: 4 }}>Email</label>
                      <div style={{ position: 'relative' }}>
                        <Mail size={15} style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', color: '#ccc' }} />
                        <input style={{ ...inputBase, paddingLeft: 24 }} type="text" value={email} onChange={e => setEmail(e.target.value)} required={isLogin} placeholder="ten@example.com"
                          onFocus={e => (e.target.style.borderBottomColor = '#d4af37')}
                          onBlur={e => (e.target.style.borderBottomColor = '#e5e0d8')} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa' }}>Mật khẩu</label>
                        {isLogin && <a href="#" style={{ fontSize: 12, color: '#d4af37', textDecoration: 'none' }}>Quên mật khẩu?</a>}
                      </div>
                      <div style={{ position: 'relative' }}>
                        <Lock size={15} style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', color: '#ccc' }} />
                        <input style={{ ...inputBase, paddingLeft: 24, paddingRight: 36 }} type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                          onFocus={e => (e.target.style.borderBottomColor = '#d4af37')}
                          onBlur={e => (e.target.style.borderBottomColor = '#e5e0d8')} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                          style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', display: 'flex', padding: 0 }}>
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* divider */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
                    <div style={{ flex: 1, height: 1, background: '#f0ece6' }} />
                    <span style={{ fontSize: 12, color: '#bbb' }}>hoặc</span>
                    <div style={{ flex: 1, height: 1, background: '#f0ece6' }} />
                  </div>

                  {/* Google */}
                  <button type="button"
                    style={{ width: '100%', height: 54, border: '1.5px solid #e5e0d8', borderRadius: 10, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 15, fontWeight: 600, color: '#1a1a1a', cursor: 'pointer', marginBottom: 12, fontFamily: "'Outfit', sans-serif", transition: 'border-color 200ms' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#d4af37')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#e5e0d8')}>
                    <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 21.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 2.47 2.16 6.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    Đăng nhập với Google
                  </button>

                  {/* submit */}
                  <button type="submit" disabled={isSubmitting}
                    style={{ width: '100%', height: 56, borderRadius: 10, border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer', background: '#1a1a1a', color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: "'Outfit', sans-serif", transition: 'all 200ms', letterSpacing: '0.03em' }}
                    onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.background = '#d4af37'; e.currentTarget.style.color = '#1a1a1a'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.color = '#fff'; }}>
                    {isSubmitting ? 'Đang xử lý...' : (isLogin ? 'Đăng nhập' : 'Tạo tài khoản')}
                  </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#aaa' }}>
                  {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
                  <button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d4af37', fontWeight: 700, fontSize: 13, padding: 0, fontFamily: "'Outfit', sans-serif" }}>
                    {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
                  </button>
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* social footer */}
        <div style={{ padding: '20px 48px', borderTop: '1px solid #f0ece6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: '#ccc' }}>© 2026 An Chuyến</span>
          <div style={{ display: 'flex', gap: 16 }}>
            {[
              { name: 'Facebook', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z', fill: '#1877F2' },
            ].map(s => (
              <button key={s.name} style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid #e5e0d8', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'border-color 200ms' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#d4af37')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#e5e0d8')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill={s.fill}><path d={s.path} /></svg>
              </button>
            ))}
            {/* Instagram */}
            <button style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid #e5e0d8', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'border-color 200ms' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#d4af37')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#e5e0d8')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="url(#ig)" strokeWidth="2"><defs><linearGradient id="ig" x1="0" y1="24" x2="24" y2="0"><stop stopColor="#f09433"/><stop offset=".25" stopColor="#e6683c"/><stop offset=".5" stopColor="#dc2743"/><stop offset=".75" stopColor="#cc2366"/><stop offset="1" stopColor="#bc1888"/></linearGradient></defs><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4.5"/><circle cx="17.5" cy="6.5" r="1.2" fill="url(#ig)" stroke="none"/></svg>
            </button>
            {/* TikTok */}
            <button style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid #e5e0d8', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'border-color 200ms' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#d4af37')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#e5e0d8')}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#1a1a1a"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.86a8.16 8.16 0 004.77 1.52V6.93a4.85 4.85 0 01-1-.24z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
