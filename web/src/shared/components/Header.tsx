import { Link, useNavigate } from 'react-router-dom';
import { Bell, Menu, X, User, Ticket, LogOut, Globe, Crown, ChevronRight, Settings } from 'lucide-react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { cn } from '../utils/cn';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandMark } from './BrandMark';

const RightDrawer = ({ open, onClose, user, notifications, t, i18n, onLogout, onMarkAllRead }: any) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="hidden lg:block fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="hidden lg:flex fixed inset-y-0 right-0 z-[70] w-96 bg-white shadow-2xl flex-col text-[#1a1a1a] rounded-l-[2rem] overflow-hidden"
        >
          <div className="p-6 flex items-center justify-between border-b border-gray-100">
            <h2 className="font-display font-medium text-2xl flex items-center gap-3 text-[#1a1a1a]">
              <Settings className="w-5 h-5 text-primary" /> {t('headerDrawer.settings')}
            </h2>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-[#1a1a1a]" onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <DrawerContent user={user} notifications={notifications} t={t} i18n={i18n} onClose={onClose} onMarkAllRead={onMarkAllRead} />
          </div>
          {user && (
            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 h-12 bg-white border border-red-200 rounded-full text-red-500 font-bold tracking-widest uppercase text-[10px] hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm">
                <LogOut className="w-4 h-4" /> {t('header.logout')}
              </button>
            </div>
          )}
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const MobileMenuDrawer = ({ open, onClose, user, avatarLetter, t, i18n, onLogout }: any) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="lg:hidden fixed inset-y-0 right-0 z-[70] w-[85%] max-w-sm bg-white shadow-2xl flex flex-col text-[#1a1a1a] rounded-l-[2rem] overflow-hidden">
          <div className="p-6 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center gap-2">
              <BrandMark className="w-6 h-6 text-primary" />
              <span className="text-2xl font-medium font-display text-primary">An Chuyến</span>
            </div>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500" onClick={onClose}><X className="w-6 h-6" /></button>
          </div>
          {user && (
            <div className="p-6 border-b border-gray-100 flex items-center gap-4 bg-[#fcfcfc]">
              <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl shadow-sm flex-shrink-0 bg-primary/10 text-primary">{avatarLetter}</div>
              <div>
                <div className="font-display font-medium text-xl text-[#1a1a1a] mb-1">{user.fullName || 'Tài khoản'}</div>
                <div className="text-xs font-medium text-gray-400">{user.email}</div>
              </div>
            </div>
          )}
          <div className="p-6 flex-1 flex flex-col gap-4 overflow-y-auto">
            <nav className="flex flex-col gap-2 font-bold text-sm">
              <Link to="/" onClick={onClose} className="hover:bg-gray-50 hover:text-primary p-3 rounded-xl transition-colors">Trang chủ</Link>
              <Link to="/about" onClick={onClose} className="hover:bg-gray-50 hover:text-primary p-3 rounded-xl transition-colors">Về chúng tôi</Link>
              <Link to="/search" onClick={onClose} className="hover:bg-gray-50 hover:text-primary p-3 rounded-xl transition-colors">Tìm chuyến</Link>
              <Link to="/offers" onClick={onClose} className="hover:bg-gray-50 hover:text-primary p-3 rounded-xl transition-colors flex items-center justify-between">
                Ưu đãi <span className="bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full tracking-widest uppercase">HOT</span>
              </Link>
              {user && (
                <>
                  <hr className="border-gray-100 my-2" />
                  <Link to="/my-bookings" onClick={onClose} className="hover:bg-gray-50 hover:text-primary p-3 rounded-xl transition-colors flex items-center gap-3"><Ticket className="w-4 h-4 text-orange-500" /> Vé của tôi</Link>
                  <Link to="/profile" onClick={onClose} className="hover:bg-gray-50 hover:text-primary p-3 rounded-xl transition-colors flex items-center gap-3"><User className="w-4 h-4 text-gray-400" /> Hồ sơ cá nhân</Link>
                  <Link to="/loyalty" onClick={onClose} className="hover:bg-gray-50 hover:text-primary p-3 rounded-xl transition-colors flex items-center gap-3"><Crown className="w-4 h-4 text-yellow-500" /> {t('headerDrawer.memberGold')}</Link>
                  <Link to="/notifications" onClick={onClose} className="hover:bg-gray-50 hover:text-primary p-3 rounded-xl transition-colors flex items-center gap-3"><Bell className="w-4 h-4 text-primary" /> {t('header.notifications')}</Link>
                </>
              )}
            </nav>

            <hr className="border-gray-100" />

            <div>
              <div className="font-bold text-[11px] tracking-widest uppercase text-gray-500 mb-3 flex items-center gap-2"><Globe className="w-4 h-4 text-primary" /> {t('headerDrawer.language')}</div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => i18n.changeLanguage('vi')} className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${i18n.language === 'vi' ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 text-gray-600'}`}>
                  <span className="text-xl mb-1">🇻🇳</span><span className="text-[10px] font-bold tracking-widest uppercase">Tiếng Việt</span>
                </button>
                <button onClick={() => i18n.changeLanguage('en')} className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${i18n.language === 'en' ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 text-gray-600'}`}>
                  <span className="text-xl mb-1">🇬🇧</span><span className="text-[10px] font-bold tracking-widest uppercase">English</span>
                </button>
              </div>
            </div>

            <hr className="border-gray-100" />
            {user ? (
              <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 h-12 rounded-full border border-red-200 text-red-500 font-bold tracking-widest uppercase text-[10px] hover:bg-red-50 transition-colors shadow-sm"><LogOut className="w-4 h-4" /> Đăng xuất</button>
            ) : (
              <Link to="/auth" onClick={onClose} className="flex items-center justify-center h-12 bg-primary text-white rounded-full text-[11px] font-bold tracking-widest uppercase hover:bg-primary-hover transition-colors shadow-md w-full">Đăng nhập / Đăng ký</Link>
            )}
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const DrawerContent = ({ user, notifications, t, i18n, onClose, onMarkAllRead }: any) => {
  const avatarLetter = user?.fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U';
  const unreadCount = notifications.filter((n: any) => !n.read).length;

  return (
    <>
      {user ? (
        <div className="p-8 border-b border-gray-100 flex items-center gap-5 bg-[#fcfcfc]">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-2xl shadow-sm">{avatarLetter}</div>
          <div>
            <div className="font-display font-medium text-2xl text-[#1a1a1a] mb-1">{user.fullName}</div>
            <div className="text-sm font-medium text-gray-400">{user.email}</div>
          </div>
        </div>
      ) : (
        <div className="p-10 border-b border-gray-100 text-center bg-[#fcfcfc]">
          <div className="w-20 h-20 bg-gray-50 border border-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm"><User className="w-8 h-8" /></div>
          <h3 className="font-display font-medium text-3xl text-[#1a1a1a] mb-6">{t('headerDrawer.welcome')}</h3>
          <Link to="/auth" onClick={onClose} className="flex items-center justify-center h-12 bg-primary text-white rounded-full text-[11px] font-bold tracking-widest uppercase hover:bg-primary-hover transition-colors shadow-md w-full">
            {t('headerDrawer.loginRegister')}
          </Link>
        </div>
      )}
      
      {user && (
        <div className="py-4 border-b border-gray-100">
          <Link to="/profile" onClick={onClose} className="flex items-center justify-between px-8 py-3.5 hover:bg-gray-50 transition-colors group">
            <div className="flex items-center gap-4 font-bold text-[#1a1a1a] text-sm"><div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 text-gray-500 group-hover:text-primary group-hover:border-primary/20 flex items-center justify-center transition-colors"><User className="w-4 h-4" /></div> {t('header.profile')}</div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
          </Link>
          <Link to="/my-bookings" onClick={onClose} className="flex items-center justify-between px-8 py-3.5 hover:bg-gray-50 transition-colors group">
            <div className="flex items-center gap-4 font-bold text-[#1a1a1a] text-sm"><div className="w-10 h-10 rounded-full bg-orange-50 border border-orange-100 text-orange-500 flex items-center justify-center"><Ticket className="w-4 h-4" /></div> {t('header.myTickets')}</div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
          </Link>
          <Link to="/loyalty" onClick={onClose} className="flex items-center justify-between px-8 py-3.5 hover:bg-gray-50 transition-colors group">
            <div className="flex items-center gap-4 font-bold text-[#1a1a1a] text-sm"><div className="w-10 h-10 rounded-full bg-yellow-50 border border-yellow-100 text-yellow-500 flex items-center justify-center"><Crown className="w-4 h-4" /></div> {t('headerDrawer.memberGold')}</div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
          </Link>
        </div>
      )}

      <div className="border-b border-gray-100">
        <div className="px-8 py-5 flex items-center justify-between bg-[#fcfcfc]">
          <div className="flex items-center gap-3 font-bold text-[11px] tracking-widest uppercase text-gray-500">
            <Bell className="w-4 h-4 text-primary" /> {t('header.notifications')} 
            {unreadCount > 0 && <span className="bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full">{unreadCount}</span>}
          </div>
          {unreadCount > 0 && <button onClick={onMarkAllRead} className="text-[10px] font-bold tracking-widest uppercase text-primary hover:text-primary-hover transition-colors">{t('headerDrawer.markAllRead')}</button>}
        </div>
        
        <div>
          {notifications.length > 0 ? (
            notifications.slice(0, 3).map((notif: any) => (
              <div key={notif.id} className={`px-8 py-5 border-t border-gray-50 transition-colors ${notif.read ? 'bg-white hover:bg-gray-50' : 'bg-primary/5 hover:bg-primary/10'}`}>
                <div className={`text-sm font-bold mb-1.5 ${notif.type === 'promo' ? 'text-primary' : 'text-[#1a1a1a]'}`}>{notif.title}</div>
                <div className="text-sm font-medium text-gray-500 leading-relaxed mb-3">{notif.message}</div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400">{notif.time}</div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center font-medium text-gray-400 text-sm">{t('headerDrawer.noNotifications')}</div>
          )}
          <Link to="/notifications" onClick={onClose} className="block w-full text-center py-4 bg-gray-50 hover:bg-gray-100 text-[10px] font-bold tracking-widest uppercase text-gray-600 transition-colors">{t('header.seeAll')}</Link>
        </div>
      </div>

      <div className="p-8 bg-[#fcfcfc]">
        <div className="font-bold text-[11px] tracking-widest uppercase text-gray-500 mb-5 flex items-center gap-3"><Globe className="w-4 h-4 text-primary" /> {t('headerDrawer.language')}</div>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => i18n.changeLanguage('vi')} className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${i18n.language === 'vi' ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 text-gray-600'}`}>
            <span className="text-2xl mb-2">🇻🇳</span><span className="text-[10px] font-bold tracking-widest uppercase">Tiếng Việt</span>
          </button>
          <button onClick={() => i18n.changeLanguage('en')} className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${i18n.language === 'en' ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 text-gray-600'}`}>
            <span className="text-2xl mb-2">🇬🇧</span><span className="text-[10px] font-bold tracking-widest uppercase">English</span>
          </button>
        </div>
      </div>
    </>
  );
};

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Chuyến đi sắp tới', message: 'Hành trình SG - ĐL của bạn sẽ bắt đầu sau 2 tiếng.', time: '1 giờ trước', read: false, type: 'info' },
    { id: 2, title: 'Khuyến mãi T8', message: 'Giảm ngay 50k khi đặt vé bằng VNPay.', time: 'Vừa xong', read: false, type: 'promo' }
  ]);
  const markAllAsRead = useCallback(() => setNotifications(prev => prev.map(n => ({ ...n, read: true }))), []);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setRightDrawerOpen(false);
    navigate('/');
  }, [logout, navigate]);

  const avatarLetter = useMemo(() => user?.fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U', [user]);

  const isHome = location.pathname === '/';
  const textColor = !scrolled && isHome ? "text-white" : "text-[#1a1a1a]";
  const hoverTextColor = !scrolled && isHome ? "hover:text-white/80" : "hover:text-primary";
  const borderColor = !scrolled && isHome ? "border-white/20" : "border-[#1a1a1a]/20";
  const hoverBgColor = !scrolled && isHome ? "hover:bg-white/10" : "hover:bg-[#1a1a1a]/5";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-500 font-sans",
          scrolled ? "bg-white/95 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-8",
          textColor
        )}
      >
        <div className="w-full flex items-center justify-between px-6 lg:px-16 relative z-10">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-3xl font-display font-medium tracking-tight flex items-center gap-2">
              <BrandMark className={cn('w-6 h-6 shrink-0', !scrolled && isHome ? 'text-white' : 'text-primary')} />
              An Chuyến
            </span>
          </Link>
          
          {/* Center Links */}
          <nav className="hidden lg:flex items-center gap-10 text-sm font-medium tracking-wide">
            {[
              { to: '/search', label: t('roamora.nav.destinations') },
              { to: '/hotels', label: t('roamora.nav.hotels') },
              { to: '/tour', label: t('roamora.nav.tours') },
              { to: '/offers', label: t('roamora.nav.deals') },
              { to: '/about', label: t('roamora.nav.aboutUs') },
            ].map(({ to, label }) => (
              <Link key={to+label} to={to} className={`relative group transition-colors overflow-hidden py-1 ${hoverTextColor}`}>
                {label}
                <span className={`absolute left-0 bottom-0 w-full h-[1.5px] transform -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-300 ${!scrolled && isHome ? 'bg-white' : 'bg-primary'}`}></span>
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-5">
            <Link to="/contact">
              <button className={`hidden lg:block ${!scrolled && isHome ? 'bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border-white/30' : 'bg-[#1a1a1a] hover:bg-black text-white border-transparent'} px-7 py-2.5 rounded-full text-sm font-semibold transition-all border shadow-sm`}>
                {t('roamora.nav.contactUs')}
              </button>
            </Link>
            <button
              onClick={() => { setRightDrawerOpen(true); setMobileMenuOpen(true); }}
              className={`w-11 h-11 rounded-full border flex items-center justify-center transition-colors ${borderColor} ${hoverBgColor}`}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>
      <RightDrawer open={rightDrawerOpen} onClose={() => setRightDrawerOpen(false)} user={user} notifications={notifications} t={t} i18n={i18n} onLogout={handleLogout} onMarkAllRead={markAllAsRead} />
      <MobileMenuDrawer open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} user={user} avatarLetter={avatarLetter} t={t} i18n={i18n} onLogout={() => { handleLogout(); setMobileMenuOpen(false); }} />
    </>
  );
}
