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

  const isTransparent = isHomePage && !scrolled && !mobileMenuOpen;

  const handleLogout = () => {
    logout();
    setRightDrawerOpen(false);
    navigate('/');
  };

  const avatarLetter = user?.fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U';

  return (
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isTransparent ? 'bg-transparent text-white' : 'bg-white shadow-sm text-foreground border-b border-gray-100'}`}>
        <div className="w-full flex h-20 items-center justify-between px-4 lg:px-8">
          
          {/* Logo + Nav */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center space-x-2 group">
              <img src="/an_chuyen_logo.png" alt="An Chuyen Logo" className="h-10 w-auto drop-shadow-sm" />
              <span className={`font-extrabold text-2xl tracking-tight transition-colors ${isTransparent ? 'text-white' : 'text-primary'}`}>
                An Chuyến
              </span>
            </Link>
            
            <nav className="hidden lg:flex items-center gap-8 font-medium">
              <Link to="/" className={`relative group transition-opacity ${isTransparent ? 'text-white/90' : 'text-gray-700 hover:text-primary'}`}>
                {t('header.home')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-current transition-all group-hover:w-full rounded-full"></span>
              </Link>
              <Link to="/search" className={`relative group transition-opacity ${isTransparent ? 'text-white/90' : 'text-gray-700 hover:text-primary'}`}>
                {t('header.search')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-current transition-all group-hover:w-full rounded-full"></span>
              </Link>
              <Link to="/offers" className={`relative group transition-opacity flex items-center gap-1 ${isTransparent ? 'text-white/90' : 'text-gray-700 hover:text-primary'}`}>
                {t('header.offers')} <span className="bg-secondary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse shadow-sm">{t('header.hot')}</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-current transition-all group-hover:w-full rounded-full"></span>
              </Link>
              <Link to="/blog" className={`relative group transition-opacity ${isTransparent ? 'text-white/90' : 'text-gray-700 hover:text-primary'}`}>
                {t('header.blog')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-current transition-all group-hover:w-full rounded-full"></span>
              </Link>
              <Link to="/about" className={`relative group transition-opacity ${isTransparent ? 'text-white/90' : 'text-gray-700 hover:text-primary'}`}>
                {t('header.about')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-current transition-all group-hover:w-full rounded-full"></span>
              </Link>
            </nav>
          </div>

          {/* Right side - Desktop Drawer Toggle */}
          <div className="hidden lg:flex items-center">
            <button
              onClick={() => setRightDrawerOpen(true)}
              className="flex items-center gap-6 transition-all duration-300 hover:opacity-80"
            >
              <div className="flex items-center gap-2">
                <Globe className={`w-5 h-5 ${isTransparent ? 'text-white' : 'text-gray-700'}`} />
                <span className={`text-sm font-bold ${isTransparent ? 'text-white' : 'text-gray-800'}`}>{i18n.language.toUpperCase()}</span>
              </div>
              
              <div className="relative">
                <Bell className={`w-5 h-5 ${isTransparent ? 'text-white' : 'text-gray-700'}`} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
                )}
              </div>
              
              {user ? (
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-[#1f2937] text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {avatarLetter}
                  </div>
                  <span className={`text-sm font-bold ${isTransparent ? 'text-white' : 'text-gray-900'}`}>{user.fullName || 'Tài khoản'}</span>
                  <ChevronDown className={`w-4 h-4 ${isTransparent ? 'text-white' : 'text-gray-500'}`} />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${isTransparent ? 'text-white' : 'text-gray-900'}`}>Tài khoản</span>
                  <ChevronDown className={`w-4 h-4 ${isTransparent ? 'text-white' : 'text-gray-500'}`} />
                </div>
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <button 
            className={`lg:hidden p-2 rounded-full hover:bg-black/5 transition-colors ${isTransparent ? 'text-white hover:bg-white/10' : 'text-gray-700'}`}
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
              className="hidden lg:flex fixed inset-y-0 right-0 z-[70] w-96 bg-white border-l shadow-2xl flex-col"
            >
              {/* Drawer Header */}
              <div className="p-5 flex items-center justify-between border-b border-gray-100 bg-gray-50/50">
                <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                  <Settings className="w-5 h-5" /> Tùy chọn
                </h2>
                <button 
                  className="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
                  onClick={() => setRightDrawerOpen(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {/* User Section */}
                {user ? (
                  <div className="p-6 bg-white border-b border-gray-100 flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary to-[#0f2c59] text-white rounded-full flex items-center justify-center font-bold text-xl shadow-md">
                      {avatarLetter}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-lg">{user.fullName}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-white border-b border-gray-100 text-center">
                    <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Chào mừng bạn đến với An Chuyến</h3>
                    <Link to="/auth" onClick={() => setRightDrawerOpen(false)}>
                      <Button className="w-full font-bold btn-primary">Đăng nhập / Đăng ký</Button>
                    </Link>
                  </div>
                )}

                {/* Main Menu Items (if user logged in) */}
                {user && (
                  <div className="py-2 border-b border-gray-100">
                    <Link to="/profile" onClick={() => setRightDrawerOpen(false)} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors group">
                      <div className="flex items-center gap-3 text-gray-700 font-medium">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><User className="w-4 h-4" /></div>
                        {t('header.profile')}
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
                    </Link>
                    <Link to="/my-bookings" onClick={() => setRightDrawerOpen(false)} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors group">
                      <div className="flex items-center gap-3 text-gray-700 font-medium">
                        <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center"><Ticket className="w-4 h-4" /></div>
                        {t('header.myTickets')}
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
                    </Link>
                    <Link to="/loyalty" onClick={() => setRightDrawerOpen(false)} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors group">
                      <div className="flex items-center gap-3 text-gray-700 font-medium">
                        <div className="w-8 h-8 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center"><Crown className="w-4 h-4" /></div>
                        Thành viên (Gold)
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
                    </Link>
                  </div>
                )}

                {/* Notifications Section */}
                <div className="border-b border-gray-100">
                  <div className="px-6 py-4 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-2 font-bold text-gray-800">
                      <Bell className="w-4 h-4 text-gray-500" /> {t('header.notifications')}
                      {unreadCount > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
                    </div>
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead} className="text-xs text-primary hover:underline font-semibold">Đánh dấu đã đọc</button>
                    )}
                  </div>
                  <div>
                    {notifications.length > 0 ? (
                      notifications.slice(0, 3).map((notif) => (
                        <div 
                          key={notif.id} 
                          onClick={() => setNotifications(notifications.map(n => n.id === notif.id ? { ...n, read: true } : n))}
                          className={`px-6 py-4 border-b border-gray-50 cursor-pointer transition-colors ${notif.read ? 'opacity-70 hover:bg-gray-50' : 'bg-blue-50/30 hover:bg-blue-50'}`}
                        >
                          <div className={`text-sm font-bold mb-1 ${notif.type === 'promo' ? 'text-secondary' : 'text-gray-800'}`}>{notif.title}</div>
                          <div className="text-sm text-gray-600 leading-relaxed mb-2">{notif.message}</div>
                          <div className="text-xs text-gray-400 font-medium">{notif.time}</div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-gray-500 text-sm">Không có thông báo nào</div>
                    )}
                    <Link to="/notifications" onClick={() => setRightDrawerOpen(false)} className="block w-full text-center py-3 text-sm font-bold text-primary hover:bg-gray-50 transition-colors">
                      {t('header.seeAll')}
                    </Link>
                  </div>
                </div>

                {/* Language Switcher */}
                <div className="p-6">
                  <div className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-500" /> Ngôn ngữ
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => i18n.changeLanguage('vi')}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${i18n.language === 'vi' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 hover:border-gray-200 text-gray-600'}`}
                    >
                      <span className="text-2xl mb-1">🇻🇳</span>
                      <span className="text-sm font-bold">Tiếng Việt</span>
                    </button>
                    <button
                      onClick={() => i18n.changeLanguage('en')}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${i18n.language === 'en' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 hover:border-gray-200 text-gray-600'}`}
                    >
                      <span className="text-2xl mb-1">🇬🇧</span>
                      <span className="text-sm font-bold">English</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              {user && (
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 h-12 bg-white border border-gray-200 rounded-xl text-red-500 font-bold hover:bg-red-50 hover:border-red-200 transition-colors shadow-sm"
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
              className="lg:hidden fixed inset-y-0 right-0 z-[70] w-[80%] max-w-sm bg-white border-l shadow-2xl flex flex-col"
            >
              <div className="p-4 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <img src="/an_chuyen_logo.png" alt="An Chuyen Logo" className="h-8 w-auto drop-shadow-sm" />
                  <span className="font-extrabold text-xl tracking-tight text-primary">An Chuyến</span>
                </div>
                <button 
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {user && (
                <div className="p-4 bg-gradient-to-r from-slate-100 to-slate-100 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-slate-800 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md flex-shrink-0">
                    {avatarLetter}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{user.fullName || 'Tài khoản'}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </div>
              )}

              <div className="p-4 flex-1 flex flex-col gap-2 overflow-y-auto">
                <nav className="flex flex-col gap-1 font-medium">
                  <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:bg-slate-100 hover:text-primary p-3 transition-colors">Trang chủ</Link>
                  <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:bg-slate-100 hover:text-primary p-3 transition-colors">Về chúng tôi</Link>
                  <Link to="/search" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:bg-slate-100 hover:text-primary p-3 transition-colors">Tìm chuyến</Link>
                  <Link to="/offers" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:bg-slate-100 hover:text-primary p-3 transition-colors flex items-center justify-between">
                    Ưu đãi <span className="bg-secondary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">HOT</span>
                  </Link>
                  {user && (
                    <>
                      <hr className="border-gray-100 my-1" />
                      <Link to="/my-bookings" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:bg-slate-100 hover:text-primary p-3 transition-colors flex items-center gap-2">
                        <Ticket className="w-4 h-4" /> Vé của tôi
                      </Link>
                      <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:bg-slate-100 hover:text-primary p-3 transition-colors flex items-center gap-2">
                        <User className="w-4 h-4" /> Hồ sơ cá nhân
                      </Link>
                    </>
                  )}
                </nav>
                <hr className="border-gray-100 my-2" />
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
