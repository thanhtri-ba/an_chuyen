import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Menu, X, User, Ticket, LogOut, Globe, Crown, ChevronRight, ChevronDown, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../../design-system/components/Button';
import { cn } from '../utils/cn';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  
  const { t, i18n } = useTranslation();
  
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Chuyến đi sắp tới', message: 'Hành trình SG - ĐL của bạn sẽ bắt đầu sau 2 tiếng.', time: '1 giờ trước', read: false, type: 'info' },
    { id: 2, title: 'Khuyến mãi T8', message: 'Giảm ngay 50k khi đặt vé bằng VNPay.', time: 'Vừa xong', read: false, type: 'promo' }
  ]);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Trên homepage: luôn dùng theme color (transparent khi chưa scroll, đục hơn khi đã scroll)
  // Trang khác: dùng #0e1111 cố định
  const isTransparent = isHomePage && !mobileMenuOpen;

  const handleLogout = () => {
    logout();
    setRightDrawerOpen(false);
    navigate('/');
  };

  const avatarLetter = user?.fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U';

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-[500ms] text-white ${!isTransparent ? 'bg-[#0e1111] shadow-sm border-b border-white/10' : ''}`}
        style={isTransparent ? {
          background: 'rgba(10,12,12,0.93)',
          borderBottom: '1px solid var(--hero-bar-border, rgba(255,255,255,0.12))',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 2px 24px rgba(0,0,0,0.55)',
        } : {}}
      >
        {/* Colored tint overlay — subtle hue per video theme */}
        {isTransparent && (
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none transition-colors duration-700"
            style={{ background: 'var(--hero-bar-tint, transparent)', zIndex: 0 }}
          />
        )}
        <div className="w-full flex h-20 items-center justify-between px-4 lg:px-8 relative z-10">
          
          {/* Logo + Nav */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center group">
              <span
                className="text-2xl italic transition-all duration-500"
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  letterSpacing: '-0.01em',
                  color: isTransparent ? 'var(--hero-bar-accent, #ffffff)' : '#d4af37',
                  textShadow: isTransparent ? '0 0 20px var(--hero-bar-accent, transparent)' : 'none',
                }}
              >
                2QO Travle
              </span>
            </Link>
            
            <nav className="hidden lg:flex items-center gap-8 font-medium">
              {/* <Link to="/" className={`relative group transition-opacity ${isTransparent ? 'text-white/90' : 'text-gray-300 hover:text-[#d4af37]'}`}>
                {t('header.home')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-current transition-all group-hover:w-full rounded-full"></span>
              </Link> */}
              {[
                { to: '/search', label: t('header.search') },
                { to: '/blog',   label: t('header.blog') },
                { to: '/about',  label: t('header.about') },
              ].map(({ to, label }) => (
                <Link key={to} to={to} className={`relative group transition-all duration-300 ${isTransparent ? 'text-white/85 hover:text-white' : 'text-gray-300 hover:text-[#d4af37]'}`}>
                  {label}
                  <span
                    className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full rounded-full"
                    style={{ background: isTransparent ? 'var(--hero-bar-accent, #ffffff)' : '#d4af37' }}
                  />
                </Link>
              ))}
              <Link to="/offers" className={`relative group transition-all duration-300 flex items-center gap-1 ${isTransparent ? 'text-white/85 hover:text-white' : 'text-gray-300 hover:text-[#d4af37]'}`}>
                {t('header.offers')}
                <span className="bg-red-500 text-white text-[6px] font-bold px-1.5 py-0.5 rounded-full animate-pulse shadow-sm">{t('header.hot')}</span>
                <span
                  className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full rounded-full"
                  style={{ background: isTransparent ? 'var(--hero-bar-accent, #ffffff)' : '#d4af37' }}
                />
              </Link>
            </nav>
          </div>

          {/* Right side - Desktop Drawer Toggle */}
          <div className="hidden lg:flex items-center gap-1">

            {/* Language pill */}
            <button
              onClick={() => setRightDrawerOpen(true)}
              className={`flex items-center gap-1.5 h-9 px-3 rounded-full text-sm font-semibold transition-all duration-300 ${isTransparent ? 'text-white/80 hover:text-white' : 'text-gray-400 hover:text-white hover:bg-white/8'}`}
              style={isTransparent ? { ['--tw-ring-color' as string]: 'var(--hero-bar-accent)' } : {}}
            >
              <Globe className="w-4 h-4" />
              <span>{i18n.language.toUpperCase()}</span>
            </button>

            {/* Bell */}
            <button
              onClick={() => setRightDrawerOpen(true)}
              className={`relative flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 ${isTransparent ? 'text-white/80 hover:text-white' : 'text-gray-400 hover:text-white hover:bg-white/8'}`}
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadCount > 0 && (
                <span
                  className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full transition-all duration-500"
                  style={{ background: isTransparent ? 'var(--hero-bar-accent, #d4af37)' : '#d4af37' }}
                />
              )}
            </button>

            {/* Divider */}
            <div
              className="w-px h-5 mx-1 transition-all duration-500"
              style={{ background: isTransparent ? 'var(--hero-bar-accent, rgba(255,255,255,0.2))' : 'rgba(255,255,255,0.1)', opacity: 0.4 }}
            />

            {/* Account */}
            <button
              onClick={() => setRightDrawerOpen(true)}
              className={`flex items-center gap-2 h-9 pl-2 pr-3 rounded-full transition-all duration-200 ${isTransparent ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-gray-300 hover:text-white hover:bg-white/8'}`}
            >
              {user ? (
                <>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#d4af37,#f0c94a)', color: '#0e1111' }}>
                    {avatarLetter}
                  </div>
                  <span className="text-sm font-semibold max-w-[100px] truncate">{user.fullName || t('header.account')}</span>
                </>
              ) : (
                <span className="text-sm font-semibold">{t('header.account')}</span>
              )}
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
          </div>

          {/* Mobile menu button */}
          <button 
            className={`lg:hidden p-2 rounded-full hover:bg-black/5 transition-colors ${isTransparent ? 'text-white hover:bg-[#0e1111]/10' : 'text-gray-300'}`}
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Right Drawer (Unified Settings/Profile/Notifications Panel) */}
      <AnimatePresence>
        {rightDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="hidden lg:block fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm" 
              onClick={() => setRightDrawerOpen(false)} 
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="hidden lg:flex fixed inset-y-0 right-0 z-[70] w-96 bg-[#0e1111] border-l shadow-2xl flex-col"
            >
              {/* Drawer Header */}
              <div className="p-5 flex items-center justify-between border-b border-white/10 bg-white/5">
                <h2 className="font-bold text-lg text-white flex items-center gap-2">
                  <Settings className="w-5 h-5" /> {t('headerDrawer.settings')}
                </h2>
                <button
                  className="p-2 rounded-full hover:bg-white/8 text-gray-400 hover:text-white transition-colors"
                  onClick={() => setRightDrawerOpen(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {/* User Section */}
                {user ? (
                  <div className="p-6 bg-[#0e1111] border-b border-white/10 flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary to-[#0f2c59] text-white rounded-full flex items-center justify-center font-bold text-xl shadow-md">
                      {avatarLetter}
                    </div>
                    <div>
                      <div className="font-bold text-white text-lg">{user.fullName}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-[#0e1111] border-b border-white/10 text-center">
                    <div className="w-16 h-16 bg-white/10 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-white mb-2">{t('headerDrawer.welcome')}</h3>
                    <Link to="/auth" onClick={() => setRightDrawerOpen(false)}>
                      <Button className="w-full font-bold btn-primary">{t('headerDrawer.loginRegister')}</Button>
                    </Link>
                  </div>
                )}

                {/* Main Menu Items (if user logged in) */}
                {user && (
                  <div className="py-2 border-b border-white/10">
                    <Link to="/profile" onClick={() => setRightDrawerOpen(false)} className="flex items-center justify-between px-6 py-3 hover:bg-[#151818] transition-colors group">
                      <div className="flex items-center gap-3 text-gray-300 font-medium">
                        <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center"><User className="w-4 h-4" /></div>
                        {t('header.profile')}
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#d4af37] transition-colors" />
                    </Link>
                    <Link to="/my-bookings" onClick={() => setRightDrawerOpen(false)} className="flex items-center justify-between px-6 py-3 hover:bg-[#151818] transition-colors group">
                      <div className="flex items-center gap-3 text-gray-300 font-medium">
                        <div className="w-8 h-8 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center"><Ticket className="w-4 h-4" /></div>
                        {t('header.myTickets')}
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#d4af37] transition-colors" />
                    </Link>
                    <Link to="/loyalty" onClick={() => setRightDrawerOpen(false)} className="flex items-center justify-between px-6 py-3 hover:bg-[#151818] transition-colors group">
                      <div className="flex items-center gap-3 text-gray-300 font-medium">
                        <div className="w-8 h-8 rounded-full bg-yellow-500/10 text-yellow-400 flex items-center justify-center"><Crown className="w-4 h-4" /></div>
                        {t('headerDrawer.memberGold')}
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#d4af37] transition-colors" />
                    </Link>
                  </div>
                )}

                {/* Notifications Section */}
                <div className="border-b border-white/10">
                  <div className="px-6 py-4 flex items-center justify-between bg-white/5">
                    <div className="flex items-center gap-2 font-bold text-white">
                      <Bell className="w-4 h-4 text-gray-500" /> {t('header.notifications')}
                      {unreadCount > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
                    </div>
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead} className="text-xs text-[#d4af37] hover:underline font-semibold">{t('headerDrawer.markAllRead')}</button>
                    )}
                  </div>
                  <div>
                    {notifications.length > 0 ? (
                      notifications.slice(0, 3).map((notif) => (
                        <div 
                          key={notif.id} 
                          onClick={() => setNotifications(notifications.map(n => n.id === notif.id ? { ...n, read: true } : n))}
                          className={`px-6 py-4 border-b border-gray-50 cursor-pointer transition-colors ${notif.read ? 'opacity-70 hover:bg-[#151818]' : 'bg-[#d4af37]/10 hover:bg-[#d4af37]/20'}`}
                        >
                          <div className={`text-sm font-bold mb-1 ${notif.type === 'promo' ? 'text-[#d4af37]' : 'text-white'}`}>{notif.title}</div>
                          <div className="text-sm text-gray-400 leading-relaxed mb-2">{notif.message}</div>
                          <div className="text-xs text-gray-400 font-medium">{notif.time}</div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-gray-500 text-sm">{t('headerDrawer.noNotifications')}</div>
                    )}
                    <Link to="/notifications" onClick={() => setRightDrawerOpen(false)} className="block w-full text-center py-3 text-sm font-bold text-[#d4af37] hover:bg-[#151818] transition-colors">
                      {t('header.seeAll')}
                    </Link>
                  </div>
                </div>

                {/* Language Switcher */}
                <div className="p-6">
                  <div className="font-bold text-white mb-4 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-500" /> {t('headerDrawer.language')}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => i18n.changeLanguage('vi')}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${i18n.language === 'vi' ? 'border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37]' : 'border-white/10 hover:border-white/10 text-gray-400'}`}
                    >
                      <span className="text-2xl mb-1">🇻🇳</span>
                      <span className="text-sm font-bold">Tiếng Việt</span>
                    </button>
                    <button
                      onClick={() => i18n.changeLanguage('en')}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${i18n.language === 'en' ? 'border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37]' : 'border-white/10 hover:border-white/10 text-gray-400'}`}
                    >
                      <span className="text-2xl mb-1">🇬🇧</span>
                      <span className="text-sm font-bold">English</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              {user && (
                <div className="p-6 border-t border-white/10 bg-[#151818]">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 h-12 bg-[#0e1111] border border-white/10 rounded-xl text-red-500 font-bold hover:bg-red-50 hover:border-red-200 transition-colors shadow-sm"
                  >
                    <LogOut className="w-5 h-5" /> {t('header.logout')}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Menu Drawer (Existing implementation, kept for mobile screens) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm" 
              onClick={() => setMobileMenuOpen(false)} 
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 right-0 z-[70] w-[80%] max-w-sm bg-[#0e1111] border-l shadow-2xl flex flex-col"
            >
              <div className="p-4 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center">
                  <span className="text-xl italic text-[#d4af37]" style={{ fontFamily: "'Instrument Serif', serif" }}>LunaTravel Business</span>
                </div>
                <button 
                  className="p-2 rounded-full hover:bg-white/10 text-gray-400 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {user && (
                <div className="p-4 border-b border-white/10 flex items-center gap-3" style={{ background: 'rgba(212,175,55,0.06)' }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-md flex-shrink-0 flex-shrink-0" style={{ background: 'linear-gradient(135deg,#d4af37,#f0c94a)', color: '#0e1111' }}>
                    {avatarLetter}
                  </div>
                  <div>
                    <div className="font-bold text-white">{user.fullName || 'Tài khoản'}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </div>
              )}

              <div className="p-4 flex-1 flex flex-col gap-2 overflow-y-auto">
                <nav className="flex flex-col gap-1 font-medium">
                  <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:bg-white/6 hover:text-[#d4af37] p-3 transition-colors">Trang chủ</Link>
                  <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:bg-white/6 hover:text-[#d4af37] p-3 transition-colors">Về chúng tôi</Link>
                  <Link to="/search" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:bg-white/6 hover:text-[#d4af37] p-3 transition-colors">Tìm chuyến</Link>
                  <Link to="/offers" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:bg-white/6 hover:text-[#d4af37] p-3 transition-colors flex items-center justify-between">
                    Ưu đãi <span className="bg-secondary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">HOT</span>
                  </Link>
                  {user && (
                    <>
                      <hr className="border-white/10 my-1" />
                      <Link to="/my-bookings" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:bg-white/6 hover:text-[#d4af37] p-3 transition-colors flex items-center gap-2">
                        <Ticket className="w-4 h-4" /> Vé của tôi
                      </Link>
                      <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:bg-white/6 hover:text-[#d4af37] p-3 transition-colors flex items-center gap-2">
                        <User className="w-4 h-4" /> Hồ sơ cá nhân
                      </Link>
                    </>
                  )}
                </nav>
                <hr className="border-white/10 my-2" />
                {user ? (
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full flex items-center justify-center gap-2 h-12 border border-red-200 text-red-500 font-bold hover:bg-red-50 transition-colors">
                    <LogOut className="w-4 h-4" /> Đăng xuất
                  </button>
                ) : (
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full font-bold h-12 text-base btn-primary text-white hover:scale-[1.02] active:scale-95 transition-transform">Đăng nhập / Đăng ký</Button>
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
