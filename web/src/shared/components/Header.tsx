import { Link, useLocation, useNavigate } from'react-router-dom';
import { Bell, Menu, X, User, Ticket, LogOut, ChevronDown, Sun, Moon, Globe, Crown } from'lucide-react';
import { useState, useEffect, useRef } from'react';
import { Button } from'../../design-system/components/Button';
import { cn } from'../utils/cn';
import { useAuth } from'../../contexts/AuthContext';
import { useTheme } from'../../contexts/ThemeContext';
import { useTranslation } from'react-i18next';
import { motion, AnimatePresence } from'framer-motion';

export function Header() {
 const [scrolled, setScrolled] = useState(false);
 const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
 const [userMenuOpen, setUserMenuOpen] = useState(false);
 const [notifOpen, setNotifOpen] = useState(false);
 const [langOpen, setLangOpen] = useState(false);
 
 const { t, i18n } = useTranslation();
 
 const [notifications, setNotifications] = useState([
 { id: 1, title:'Chuyến đi sắp tới', message:'Hành trình SG - ĐL của bạn sẽ bắt đầu sau 2 tiếng.', time:'1 giờ trước', read: false, type:'info' },
 { id: 2, title:'Khuyến mãi T8', message:'Giảm ngay 50k khi đặt vé bằng VNPay.', time:'Vừa xong', read: false, type:'promo' }
 ]);
 const unreadCount = notifications.filter(n => !n.read).length;

 const markAllAsRead = () => {
 setNotifications(notifications.map(n => ({ ...n, read: true })));
 };

 const location = useLocation();
 const navigate = useNavigate();
 const { user, logout } = useAuth();
 const { theme, setTheme } = useTheme();
 
 const isHomePage = location.pathname ==='/';
 const userMenuRef = useRef<HTMLDivElement>(null);
 const notifRef = useRef<HTMLDivElement>(null);
 const langRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
 const handleScroll = () => setScrolled(window.scrollY > 20);
 window.addEventListener('scroll', handleScroll);
 return () => window.removeEventListener('scroll', handleScroll);
 }, []);

 useEffect(() => {
 const handleClickOutside = (e: MouseEvent) => {
 if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
 setUserMenuOpen(false);
 }
 if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
 setNotifOpen(false);
 }
 if (langRef.current && !langRef.current.contains(e.target as Node)) {
 setLangOpen(false);
 }
 };
 document.addEventListener('mousedown', handleClickOutside);
 return () => document.removeEventListener('mousedown', handleClickOutside);
 }, []);

 const isTransparent = isHomePage && !scrolled && !mobileMenuOpen;

 const handleLogout = () => {
 logout();
 setUserMenuOpen(false);
 navigate('/');
 };

 const avatarLetter = user?.fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() ||'U';

 return (
 <>
 <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isTransparent ?'bg-transparent text-white' :'bg-white dark:bg-slate-900 shadow-sm text-foreground border-b border-gray-100 dark:border-slate-800'}`}>
 <div className="w-full flex h-20 items-center justify-between px-4 lg:px-8">
 
 {/* Logo + Nav */}
 <div className="flex items-center gap-8">
 <Link to="/" className="flex items-center space-x-2 group">
 <img src="/an_chuyen_logo.png" alt="An Chuyen Logo" className="h-10 w-auto drop-shadow-sm" />
 <span className={`font-extrabold text-2xl tracking-tight transition-colors ${isTransparent ?'text-white' :'text-primary dark:text-white'}`}>
 An Chuyến
 </span>
 </Link>
 
 <nav className="hidden lg:flex items-center gap-8 font-medium">
 <Link to="/" className={`relative group transition-opacity ${isTransparent ?'text-white/90' :'text-gray-700 dark:text-slate-300 hover:text-primary dark:hover:text-white'}`}>
 {t('header.home')}
 <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-current transition-all group-hover:w-full rounded-full"></span>
 </Link>
 <Link to="/search" className={`relative group transition-opacity ${isTransparent ?'text-white/90' :'text-gray-700 dark:text-slate-300 hover:text-primary dark:hover:text-white'}`}>
 {t('header.search')}
 <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-current transition-all group-hover:w-full rounded-full"></span>
 </Link>
 <Link to="/offers" className={`relative group transition-opacity flex items-center gap-1 ${isTransparent ?'text-white/90' :'text-gray-700 dark:text-slate-300 hover:text-primary dark:hover:text-white'}`}>
 {t('header.offers')} <span className="bg-secondary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse shadow-sm">{t('header.hot')}</span>
 <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-current transition-all group-hover:w-full rounded-full"></span>
 </Link>
 <Link to="/blog" className={`relative group transition-opacity ${isTransparent ?'text-white/90' :'text-gray-700 dark:text-slate-300 hover:text-primary dark:hover:text-white'}`}>
 {t('header.blog')}
 <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-current transition-all group-hover:w-full rounded-full"></span>
 </Link>
 <Link to="/about" className={`relative group transition-opacity ${isTransparent ?'text-white/90' :'text-gray-700 dark:text-slate-300 hover:text-primary dark:hover:text-white'}`}>
 {t('header.about')}
 <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-current transition-all group-hover:w-full rounded-full"></span>
 </Link>
 </nav>
 </div>

 {/* Right side */}
 <div className="flex items-center gap-2 md:gap-3">
 {/* Language Switcher */}
 <div ref={langRef} className="relative">
 <button
 onClick={() => setLangOpen(!langOpen)}
 className={`p-2 rounded-full transition-colors flex items-center gap-1 font-bold text-xs uppercase ${isTransparent ?'text-white hover:bg-white/10' :'text-gray-600 hover:bg-gray-100'}`}
 >
 <Globe className="w-4 h-4" /> {i18n.language}
 </button>
 
 <AnimatePresence>
 {langOpen && (
 <motion.div
 initial={{ opacity: 0, y: 10, scale: 0.95 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: 10, scale: 0.95 }}
 className="absolute right-0 mt-2 w-32 bg-white shadow-xl border border-gray-100 overflow-hidden text-sm"
 >
 <button
 onClick={() => { i18n.changeLanguage('vi'); setLangOpen(false); }}
 className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${i18n.language ==='vi' ?'font-bold text-primary bg-blue-50/30' :'text-gray-700'}`}
 >
 Tiếng Việt (VI)
 </button>
 <button
 onClick={() => { i18n.changeLanguage('en'); setLangOpen(false); }}
 className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${i18n.language ==='en' ?'font-bold text-primary bg-blue-50/30' :'text-gray-700'}`}
 >
 English (EN)
 </button>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 
 {/* Theme Toggle */}
 <button
 onClick={() => setTheme(theme ==='dark' ?'light' :'dark')}
 className={`p-2 rounded-full transition-colors ${isTransparent ?'text-white hover:bg-white/10' :'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
 >
 {theme ==='dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
 </button>

 {/* Notification Bell */}
 <div ref={notifRef} className="relative hidden sm:block">
 <button onClick={() => setNotifOpen(!notifOpen)} className={`relative p-2 rounded-full transition-colors ${isTransparent ?'text-white hover:bg-white/10' :'text-gray-600 hover:bg-gray-100'}`}>
 <Bell className="w-5 h-5" />
 {unreadCount > 0 && (
 <>
 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full shadow-sm animate-ping opacity-75"></span>
 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full shadow-sm"></span>
 </>
 )}
 </button>
 
 <AnimatePresence>
 {notifOpen && (
 <motion.div
 initial={{ opacity: 0, y: 10, scale: 0.95 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: 10, scale: 0.95 }}
 className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 shadow-xl border border-gray-100 dark:border-slate-800 overflow-hidden"
 >
 <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
 <h3 className="font-bold text-gray-800 dark:text-white">{t('header.notifications')}</h3>
 {unreadCount > 0 && (
 <button onClick={markAllAsRead} className="text-xs text-primary dark:text-blue-400 font-semibold hover:underline">
 {t('header.markAllRead')}
 </button>
 )}
 </div>
 <div className="max-h-80 overflow-y-auto">
 {notifications.length > 0 ? (
 notifications.map((notif) => (
 <div 
 key={notif.id} 
 onClick={() => setNotifications(notifications.map(n => n.id === notif.id ? { ...n, read: true } : n))}
 className={`p-4 border-b border-gray-50 dark:border-slate-800 transition-colors cursor-pointer ${notif.read ?'opacity-60 hover:bg-gray-50 dark:hover:bg-slate-800' :'bg-blue-50/50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700'}`}
 >
 <div className={`text-sm font-bold mb-1 ${notif.type ==='promo' ?'text-secondary' :'text-gray-800 dark:text-white'}`}>{notif.title}</div>
 <div className="text-xs text-gray-600 dark:text-slate-400">{notif.message}</div>
 <div className="text-[10px] text-gray-400 dark:text-slate-500 mt-2">{notif.time}</div>
 </div>
 ))
 ) : (
 <div className="p-8 text-center text-gray-500 dark:text-slate-400 text-sm">Không có thông báo nào</div>
 )}
 </div>
 <div className="p-3 border-t border-gray-100 dark:border-slate-800 text-center">
 <Link to="/notifications" className="text-sm text-primary dark:text-blue-400 font-bold hover:underline" onClick={() => setNotifOpen(false)}>{t('header.seeAll')}</Link>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>

 {user ? (
 /* User Avatar Dropdown */
 <div ref={userMenuRef} className="relative">
 <button
 onClick={() => setUserMenuOpen(!userMenuOpen)}
 className={`flex items-center gap-2 rounded-full transition-all duration-200 ${
 isTransparent 
 ?'hover:bg-white/10 px-3 py-2' 
 :'hover:bg-gray-50 px-2 py-1.5 border border-gray-200 shadow-sm'
 }`}
 >
 <div className="w-8 h-8 bg-gradient-to-br from-primary to-slate-800 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
 {avatarLetter}
 </div>
 <span className={`hidden md:block font-semibold text-sm max-w-[100px] truncate ${isTransparent ?'text-white' :'text-gray-800'}`}>
 {user.fullName ||'Tài khoản'}
 </span>
 <ChevronDown className={`w-4 h-4 transition-transform ${userMenuOpen ?'rotate-180' :''} ${isTransparent ?'text-white' :'text-gray-500'}`} />
 </button>

 {/* Dropdown Menu */}
 {userMenuOpen && (
 <div className="absolute right-0 top-full mt-2 w-56 bg-white shadow-[0_8px_32px_-4px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
 {/* User Info Header */}
 <div className="px-4 py-3 bg-gradient-to-r from-slate-100 to-slate-100 border-b border-gray-100">
 <div className="font-bold text-gray-900 text-sm truncate">{user.fullName}</div>
 <div className="text-xs text-gray-500 truncate">{user.email}</div>
 </div>
 
 {/* Menu Items */}
 <div className="py-1.5">
 <Link
 to="/profile"
 onClick={() => setUserMenuOpen(false)}
 className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-gray-700 text-sm font-medium"
 >
 <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
 <User className="w-4 h-4 text-primary dark:text-blue-400" />
 </div>
 {t('header.profile')}
 </Link>
 <Link
 to="/my-bookings"
 onClick={() => setUserMenuOpen(false)}
 className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-gray-700 text-sm font-medium"
 >
 <div className="w-8 h-8 bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center">
 <Ticket className="w-4 h-4 text-secondary dark:text-orange-400" />
 </div>
 {t('header.myTickets')}
 </Link>
 </div>

 <div className="border-t border-gray-100 py-1.5">
 <Link
 to="/loyalty"
 onClick={() => setUserMenuOpen(false)}
 className="flex items-center gap-3 px-4 py-2.5 hover:bg-yellow-50 transition-colors text-yellow-700 text-sm font-medium w-full"
 >
 <div className="w-8 h-8 bg-yellow-100 flex items-center justify-center">
 <Crown className="w-4 h-4 text-yellow-600" />
 </div>
 Thành viên (Gold)
 </Link>
 </div>

 <div className="border-t border-gray-100 py-1.5">
 <button
 onClick={handleLogout}
 className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-red-500 text-sm font-medium w-full"
 >
 <div className="w-8 h-8 bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
 <LogOut className="w-4 h-4 text-red-500" />
 </div>
 {t('header.logout')}
 </button>
 </div>
 </div>
 )}
 </div>
 ) : (
 /* Login Button (guest) */
 <div className="hidden md:flex items-center gap-2">
 <Link to="/auth">
 <Button
 variant="ghost"
 className={cn(
"rounded-full font-bold h-10 px-5 transition-all duration-300",
 isTransparent ?"text-white hover:bg-white/10" :"text-gray-700 hover:bg-gray-100"
 )}
 >
 Đăng nhập
 </Button>
 </Link>
 <Link to="/auth">
 <Button
 className={cn(
"rounded-full font-bold h-10 px-6 transition-all duration-300 shadow-sm",
 isTransparent 
 ?"bg-white text-slate-900 hover:bg-gray-100" 
 :"btn-primary text-white"
 )}
 >
 Đăng ký
 </Button>
 </Link>
 </div>
 )}

 {/* Mobile menu button */}
 <button 
 className={`lg:hidden p-2 rounded-full hover:bg-black/5 transition-colors ${isTransparent ?'text-white hover:bg-white/10' :'text-gray-700'}`}
 onClick={() => setMobileMenuOpen(true)}
 >
 <Menu className="w-6 h-6" />
 </button>
 </div>
 </div>
 </header>

 {/* Mobile Menu Drawer */}
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
 initial={{ x:'100%' }}
 animate={{ x: 0 }}
 exit={{ x:'100%' }}
 transition={{ type:'spring', damping: 25, stiffness: 200 }}
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
 <div className="font-bold text-gray-900">{user.fullName ||'Tài khoản'}</div>
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
