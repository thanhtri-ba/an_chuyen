import { useState, useEffect } from'react';
import { useNavigate } from'react-router-dom';
import { MapPin, Search, ArrowRightLeft, Ticket, Clock, Zap, Sparkles, Star, ChevronRight, Edit3, X } from'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from'framer-motion';

import { Button } from'../../../design-system/components/Button';
import { Input } from'../../../design-system/components/Input';
import { Card, CardContent } from'../../../design-system/components/Card';
import { StationMap } from'../../../shared/components/StationMap';
import { useTranslation } from'react-i18next';

import api from'../../../lib/api';

const POPULAR_DESTINATIONS = [
 { name:'Đà Lạt', province:'Lâm Đồng', img:'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=800&auto=format&fit=crop', trips:'42 chuyến/ngày', tag:'Phổ biến nhất' },
 { name:'Nha Trang', province:'Khánh Hòa', img:'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?q=80&w=800&auto=format&fit=crop', trips:'38 chuyến/ngày', tag:'Biển đẹp' },
 { name:'Hội An', province:'Quảng Nam', img:'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=800&auto=format&fit=crop', trips:'25 chuyến/ngày', tag:'Di sản' },
 { name:'Huế', province:'Thừa Thiên Huế', img:'https://images.unsplash.com/photo-1531737212413-667205e1cda7?q=80&w=800&auto=format&fit=crop', trips:'20 chuyến/ngày', tag:'Lịch sử' },
 { name:'Vũng Tàu', province:'Bà Rịa - VT', img:'https://images.unsplash.com/photo-1498307833015-e7b400441eb8?q=80&w=800&auto=format&fit=crop', trips:'55 chuyến/ngày', tag:'Cuối tuần' },
 { name:'Đà Nẵng', province:'Đà Nẵng', img:'https://images.unsplash.com/photo-1540611025311-01df3cef54b5?q=80&w=800&auto=format&fit=crop', trips:'30 chuyến/ngày', tag:'Đáng đến' },
];

const DEFAULT_REVIEWS = [
 { name:'Nguyễn Minh Tuấn', avatar:'T', rating: 5, route:'Sài Gòn → Đà Lạt', text:'Đặt vé cực nhanh, xe đúng giờ, tài xế thân thiện. Sẽ dùng An Chuyến cho mọi chuyến đi!', date:'2 ngày trước' },
 { name:'Trần Thị Mai', avatar:'M', rating: 5, route:'Hà Nội → Hạ Long', text:'Giao diện đẹp, thanh toán qua ví An Chuyến rất tiện. Ghế rộng rãi, điều hòa mát. Recommend!', date:'1 tuần trước' },
 { name:'Lê Văn Đức', avatar:'Đ', rating: 4, route:'Sài Gòn → Vũng Tàu', text:'Giá vé hợp lý, có nhiều ưu đãi cho thành viên. Nhân viên hỗ trợ nhiệt tình, giải quyết vấn đề nhanh.', date:'2 tuần trước' },
];

export function HomePage() {
 const { t } = useTranslation();
 const navigate = useNavigate();
 const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
 const [reviewRating, setReviewRating] = useState(5);
 const [origin, setOrigin] = useState('');
 const [destination, setDestination] = useState('');

 // Set default date to today
 const today = new Date().toISOString().split('T')[0];
 const [date, setDate] = useState(today);
 const [passengers, setPassengers] = useState(1);
 const [timeLeft, setTimeLeft] = useState(3600);
 const [promotions, setPromotions] = useState<any[]>([]);
 const [flashSales, setFlashSales] = useState<any[]>([]);
 const [nearbyStations, setNearbyStations] = useState<any[]>([]);
 const [reviews, setReviews] = useState<any[]>(DEFAULT_REVIEWS);
 const [heroBg, setHeroBg] = useState('https://images.unsplash.com/photo-1533130061792-64b345e4a833?q=80&w=2000&auto=format&fit=crop');
 const [leftBanner, setLeftBanner] = useState('');
 const [rightBanner, setRightBanner] = useState('');

 const { scrollY } = useScroll();
 const yHeroBg = useTransform(scrollY, [0, 1000], [0, 400]);
 const opacityHero = useTransform(scrollY, [0, 500], [1, 0]);

 useEffect(() => {
 const timer = setInterval(() => {
 setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
 }, 1000);
 return () => clearInterval(timer);
 }, []);

 useEffect(() => {
 // Fetch real data from backend
 const fetchData = async () => {
 try {
 const [reviewsRes, promosRes] = await Promise.all([
 api.get('/reviews'),
 api.get('/promotions')
 ]);
 if (reviewsRes.data && reviewsRes.data.length > 0) {
 setReviews(reviewsRes.data);
 }
 if (promosRes.data && promosRes.data.length > 0) {
 setPromotions(promosRes.data);
 }
 } catch (error) {
 console.error('Failed to fetch homepage data:', error);
 }
 };
 fetchData();
 }, []);

 useEffect(() => {
 api.get('/configs')
 .then(res => {
 if (res.data.home_hero_bg_url) setHeroBg(res.data.home_hero_bg_url);
 if (res.data.home_left_banner_url) setLeftBanner(res.data.home_left_banner_url);
 if (res.data.home_right_banner_url) setRightBanner(res.data.home_right_banner_url);
 })
 .catch(console.error);
 }, []);

 useEffect(() => {
 api.get('/promotions')
 .then(res => setPromotions(res.data))
 .catch(() => {
 setPromotions([
 { id: 1, title:'Giảm 20%', description:'Đăng ký ngay để nhận ưu đãi lên đến 100k', code:'NEWBIE20' },
 { id: 2, title:'Hoàn tiền 5%', description:'Thanh toán qua ví điện tử nhận hoàn tiền', code:'MOMO5' }
 ]);
 });

 api.get('/trips?limit=3')
 .then(res => {
 const schedules = res.data.data;
 const mappedSales = schedules.map((schedule: any, idx: number) => ({
 id: schedule.id,
 from: schedule.trip.route.departureCity.name,
 to: schedule.trip.route.arrivalCity.name,
 originalPrice: schedule.prices?.[0]?.price || 350000,
 salePrice: (schedule.prices?.[0]?.price || 350000) * 0.8,
 company: schedule.trip.busAgent.name,
 sold: Math.floor(Math.random() * 50) + 50,
 img: [
'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=600&auto=format&fit=crop',
'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?q=80&w=600&auto=format&fit=crop',
'https://images.unsplash.com/photo-1506905925275-25d74944d957?q=80&w=600&auto=format&fit=crop'
 ][idx % 3]
 }));
 setFlashSales(mappedSales);
 })
 .catch(() => {
 setFlashSales([
 { id: 1, from:'Sài Gòn', to:'Đà Lạt', originalPrice: 350000, salePrice: 250000, company:'Phương Trang', sold: 85, img:'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=600&auto=format&fit=crop' },
 { id: 2, from:'Sài Gòn', to:'Nha Trang', originalPrice: 400000, salePrice: 320000, company:'Hoa Mai VIP', sold: 45, img:'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?q=80&w=600&auto=format&fit=crop' },
 { id: 3, from:'Hà Nội', to:'Sapa', originalPrice: 450000, salePrice: 350000, company:'Sao Việt', sold: 92, img:'https://images.unsplash.com/photo-1506905925275-25d74944d957?q=80&w=600&auto=format&fit=crop' }
 ]);
 });

 api.get('/stations')
 .then(res => {
 const stations = res.data.slice(0, 3);
 setNearbyStations(stations.map((st: any) => ({
 name: st.name,
 distance: (Math.random() * 10 + 1).toFixed(1) +' km',
 time: Math.floor(Math.random() * 30 + 10) +' phút'
 })));
 })
 .catch(() => {
 setNearbyStations([
 { name:'Bến xe Miền Đông', distance:'2.5 km', time:'10 phút' },
 { name:'Bến xe Miền Tây', distance:'8.2 km', time:'25 phút' },
 { name:'Trạm Phạm Ngũ Lão', distance:'1.5 km', time:'5 phút' }
 ]);
 });

 api.get('/reviews')
 .then(res => {
 if (res.data && res.data.length > 0) {
 setReviews(res.data);
 }
 })
 .catch(() => {
 // Fallback already set by default state
 });
 }, []);

 const formatTime = (seconds: number) => {
 const h = Math.floor(seconds / 3600);
 const m = Math.floor((seconds % 3600) / 60);
 const s = seconds % 60;
 return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
 };

 const handleSearch = (e: React.FormEvent) => {
 e.preventDefault();
 const params = new URLSearchParams();
 if (origin) params.append('origin', origin);
 if (destination) params.append('destination', destination);
 if (date) params.append('date', date);
 if (passengers) params.append('passengers', passengers.toString());
 navigate(`/search?${params.toString()}`);
 };

 const swapLocations = () => {
 setOrigin(destination);
 setDestination(origin);
 };

 return (
 <div className="flex flex-col min-h-screen bg-gray-50 relative">

 {/* ===================== HERO SECTION ===================== */}
 <section className="relative w-full h-screen flex flex-col items-center justify-between overflow-hidden pt-24 pb-10">
 <motion.img
 src={heroBg}
 alt="Hero"
 className="absolute inset-0 w-full h-[120%] object-cover z-0 origin-top"
 style={{ y: yHeroBg }}
 />
 <div className="absolute inset-0 bg-gradient-to-b from-sky-900/40 via-transparent to-gray-900/60 z-0"></div>

 <motion.div style={{ opacity: opacityHero }} className="relative z-10 w-full px-4 lg:px-8 mt-16 md:mt-24">
 <h1 className="font-serif text-center text-6xl md:text-[10rem] lg:text-[13rem] leading-none text-white tracking-widest font-thin uppercase drop-shadow-2xl opacity-90 scale-y-125 mb-16 md:mb-24 flex justify-center overflow-hidden">
 {"AN CHUYẾN".split("").map((char, index) => (
 <motion.span
 key={index}
 initial={{ opacity: 0, y: 100 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 1, delay: index * 0.1, ease: [0.2, 0.65, 0.3, 0.9] }}
 >
 {char ==="" ?"\u00A0" : char}
 </motion.span>
 ))}
 </h1>
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 1, duration: 0.8 }}
 className="flex flex-col md:flex-row justify-between items-start text-white max-w-7xl mx-auto px-4 gap-8 md:gap-0 mt-8 md:mt-24"
 >
 <p className="max-w-xs text-xs md:text-sm uppercase font-bold tracking-widest leading-relaxed drop-shadow-md border-l-2 border-white/50 pl-4">
 {t('home.heroLine1')}
 </p>
 <p className="max-w-xs text-xs md:text-sm uppercase font-bold tracking-widest leading-relaxed md:text-right drop-shadow-md border-r-2 border-white/50 pr-4">
 {t('home.heroLine2')}
 </p>
 </motion.div>
 </motion.div>
 <div className="relative z-10 flex flex-col items-center mb-12">
 <div className="text-white px-6 py-4 flex flex-col items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity drop-shadow-md">
 <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/90">{t('home.scrollDown')}</span>
 <motion.svg
 animate={{ y: [0, 8, 0] }}
 transition={{ duration: 1.5, repeat: Infinity }}
 className="w-5 h-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
 </motion.svg>
 </div>
 </div>
 </section>

 {/* ===================== SIDE BANNERS ===================== */}
 {leftBanner && (
 <div className="hidden 2xl:flex flex-col fixed top-[20%] left-4 w-[160px] h-[500px] bg-slate-100 shadow-xl z-40 overflow-hidden border border-gray-200">
 <img src={leftBanner} alt="Khuyến mãi" className="w-full h-full object-cover" />
 </div>
 )}
 {rightBanner && (
 <div className="hidden 2xl:flex flex-col fixed top-[20%] right-4 w-[160px] h-[500px] bg-slate-100 shadow-xl z-40 overflow-hidden border border-gray-200">
 <img src={rightBanner} alt="Quảng cáo" className="w-full h-full object-cover" />
 </div>
 )}

 {/* SEARCH WIDGET (ULTRA PREMIUM) */}
 <div className="container relative z-20 px-4 -mt-16 mb-24">
 <motion.div
 initial={{ opacity: 0, y: 60 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.4, type:"spring", stiffness: 100 }}
 className="w-full max-w-[1100px] mx-auto relative group/widget"
 >
 <form onSubmit={handleSearch}>
 <div className="bg-white/40 backdrop-blur-3xl rounded-2xl md:rounded-full shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/70 flex flex-col md:flex-row items-center p-2 relative overflow-hidden transition-all duration-500 group-hover/widget:border-white group-hover/widget:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.4)] group-hover/widget:bg-white/50">
 <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/10 to-transparent pointer-events-none rounded-2xl md:rounded-full"></div>

 {/* Origin */}
 <div className="relative z-10 w-full flex-1 group hover:bg-white/60 transition-all duration-300 ] px-6 py-3 cursor-text">
 <div className="flex flex-col justify-center h-full">
 <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-1 group-hover:text-primary transition-colors">{t('home.search.origin')}</span>
 <Input
 value={origin}
 onChange={(e) => setOrigin(e.target.value)}
 className="h-8 p-0 bg-transparent border-none focus:ring-0 text-[18px] font-bold text-gray-800 placeholder-gray-400 outline-none w-full shadow-none truncate transition-all"
 placeholder={t('home.search.originPlaceholder')}
 />
 </div>
 </div>

 {/* Swap Icon */}
 <div className="hidden md:flex items-center justify-center relative z-10 px-1 -mx-3">
 <button
 type="button"
 onClick={swapLocations}
 className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm hover:shadow-md hover:bg-gray-50 text-gray-400 hover:text-primary transition-all flex items-center justify-center hover:scale-110"
 >
 <ArrowRightLeft className="w-4 h-4" />
 </button>
 </div>
 <div className="w-full md:hidden h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent my-2"></div>

 {/* Destination */}
 <div className="relative z-10 w-full flex-1 group hover:bg-white/60 transition-all duration-300 ] px-6 py-3 cursor-text">
 <div className="flex flex-col justify-center h-full pl-0 md:pl-2">
 <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-1 group-hover:text-red-500 transition-colors">{t('home.search.destination')}</span>
 <Input
 value={destination}
 onChange={(e) => setDestination(e.target.value)}
 className="h-8 p-0 bg-transparent border-none focus:ring-0 text-[18px] font-bold text-gray-800 placeholder-gray-400 outline-none w-full shadow-none truncate transition-all"
 placeholder={t('home.search.destinationPlaceholder')}
 />
 </div>
 </div>

 <div className="hidden md:block w-[1px] h-12 bg-gray-200/60 mx-1"></div>
 <div className="w-full md:hidden h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent my-2"></div>

 {/* Date */}
 <div className="relative w-full flex-1 group hover:bg-white/60 transition-all duration-300 ] px-6 py-3 cursor-pointer">
 <div className="flex flex-col justify-center h-full">
 <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-1 group-hover:text-primary transition-colors">{t('home.search.date')}</span>
 <Input
 type="date"
 value={date}
 onChange={(e) => setDate(e.target.value)}
 className="h-8 p-0 bg-transparent border-none focus:ring-0 text-[18px] font-bold text-gray-800 outline-none w-full shadow-none cursor-pointer transition-all"
 />
 </div>
 </div>

 <div className="hidden md:block w-[1px] h-12 bg-gray-300/40 mx-1"></div>
 <div className="w-full md:hidden h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent my-2"></div>

 {/* Passengers */}
 <div className="relative w-full flex-[0.8] group hover:bg-white/60 transition-all duration-300 ] pl-6 pr-4 py-3 cursor-pointer">
 <div className="flex flex-col justify-center h-full">
 <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-1 group-hover:text-primary transition-colors">{t('home.search.passengers')}</span>
 <select
 value={passengers}
 onChange={(e) => setPassengers(Number(e.target.value))}
 className="h-8 p-0 bg-transparent border-none focus:ring-0 text-[18px] font-bold text-gray-800 outline-none w-full shadow-none cursor-pointer appearance-none transition-all"
 >
 <option value={1}>{t('home.search.onePassenger')}</option>
 <option value={2}>{t('home.search.manyPassengers')}</option>
 </select>
 </div>
 </div>

 {/* Submit Button */}
 <div className="w-full md:w-auto p-1 mt-2 md:mt-0 relative">
 <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95, y: 2 }} transition={{ type:"spring", stiffness: 400, damping: 15 }}>
 <div className="absolute inset-0 bg-orange-500 blur-xl opacity-30 animate-pulse pointer-events-none rounded-xl md:rounded-full"></div>
 <Button type="submit" className="h-[60px] px-10 font-bold text-[16px] bg-gradient-to-r from-red-500 to-orange-500 text-white w-full shadow-lg shadow-orange-500/40 hover:shadow-orange-500/60 transition-all relative overflow-hidden group/btn flex items-center justify-center gap-3 border border-white/20 rounded-xl md:rounded-full">
 <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></span>
 <Search className="w-5 h-5 relative z-10" /> <span className="relative z-10">{t('home.search.button')}</span>
 </Button>
 </motion.div>
 </div>

 </div>
 </form>
 </motion.div>
 </div>

 {/* ===================== SERVICES GRID ===================== */}
 <section className="container max-w-7xl mx-auto px-4 mb-20 relative z-10">
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">

 {/* Card 1 */}
 <motion.div onClick={() => navigate('/search')} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-[#FFE5E5] p-6 h-[180px] relative overflow-hidden cursor-pointer transition-transform">
 <h3 className="text-xl md:text-2xl font-bold text-slate-800">{t('home.services.tickets')}</h3>
 <img src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Bus/3D/bus_3d.png" alt="Bus" className="absolute bottom-0 right-0 w-32 h-32 md:w-36 md:h-36 object-contain" />
 </motion.div>

 {/* Card 2 */}
 <motion.div onClick={() => navigate('/delivery')} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-[#DDD8FF] p-6 h-[180px] relative overflow-hidden cursor-pointer transition-transform">
 <h3 className="text-xl md:text-2xl font-bold text-slate-800">{t('home.services.delivery')}</h3>
 <img src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Delivery%20truck/3D/delivery_truck_3d.png" alt="Delivery" className="absolute bottom-0 right-0 w-32 h-32 md:w-36 md:h-36 object-contain" />
 </motion.div>

 {/* Card 3 */}
 <motion.div onClick={() => navigate('/rental')} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-[#CDE8FF] p-6 h-[180px] relative overflow-hidden cursor-pointer transition-transform">
 <h3 className="text-xl md:text-2xl font-bold text-slate-800">{t('home.services.rental')}</h3>
 <img src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Automobile/3D/automobile_3d.png" alt="Car" className="absolute bottom-0 right-0 w-32 h-32 md:w-36 md:h-36 object-contain" />
 </motion.div>

 {/* Card 4 */}
 <motion.div onClick={() => navigate('/tour')} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-[#FFE3C8] p-6 h-[180px] relative overflow-hidden cursor-pointer transition-transform">
 <h3 className="text-xl md:text-2xl font-bold text-slate-800">{t('home.services.tour')}</h3>
 <img src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Palm%20tree/3D/palm_tree_3d.png" alt="Tour" className="absolute bottom-0 right-4 w-32 h-32 md:w-36 md:h-36 object-contain" />
 </motion.div>

 {/* Card 5 */}
 <motion.div onClick={() => navigate('/events')} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-[#CBFFD3] p-6 h-[180px] relative overflow-hidden cursor-pointer transition-transform">
 <h3 className="text-xl md:text-2xl font-bold text-slate-800">{t('home.services.event')}</h3>
 <img src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Admission%20tickets/3D/admission_tickets_3d.png" alt="Event" className="absolute bottom-2 right-2 w-28 h-28 md:w-32 md:h-32 object-contain shadow-[0_10px_20px_rgba(255,0,128,0.3)]" style={{ transform:"rotate(-10deg)" }} />
 </motion.div>

 </div>
 </section>

 {/* ===================== ABOUT SECTION ===================== */}
 <section className="bg-white py-24 mb-8 overflow-hidden">
 <div className="container max-w-7xl mx-auto px-4 lg:px-8">
 <motion.div
 initial={{ opacity: 0, y: 50 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin:"-100px" }}
 transition={{ duration: 0.8 }}
 className="flex justify-between items-end border-b-2 border-gray-100 pb-8 mb-16"
 >
 <h2 className="font-serif text-6xl md:text-[100px] leading-none font-thin tracking-widest text-slate-800 scale-y-125 origin-bottom">{t('home.about.title')}</h2>
 <Button variant="link" className="text-red-400 font-bold tracking-[0.2em] uppercase hover:text-red-500 mb-2">{t('home.about.viewMore')}</Button>
 </motion.div>

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
 <motion.div
 initial={{ opacity: 0, x: -50 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true, margin:"-100px" }}
 transition={{ duration: 0.8 }}
 className="lg:col-span-7 relative group"
 >
 <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 mix-blend-overlay"></div>
 <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1000&auto=format&fit=crop" alt="About" className="w-full h-[600px] object-cover group-hover:scale-105 transition-transform duration-1000" />
 </motion.div>
 <motion.div
 initial={{ opacity: 0, x: 50 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true, margin:"-100px" }}
 transition={{ duration: 0.8, delay: 0.2 }}
 className="lg:col-span-5 flex flex-col justify-between pt-4"
 >
 <div className="text-slate-700 font-medium text-lg md:text-xl leading-relaxed">
 <p className="mb-8" dangerouslySetInnerHTML={{ __html: t('home.about.desc1') }}></p>
 <p>{t('home.about.desc2')}</p>
 </div>
 <div className="mt-12 flex justify-end overflow-hidden group">
 <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=400&auto=format&fit=crop" alt="About small" className="w-64 h-[300px] object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
 </div>
 </motion.div>
 </div>
 </div>
 </section>

 {/* ===================== MAIN CONTENT ===================== */}
 <div className="container px-4 pb-16 pt-8 relative z-10 flex flex-col gap-16">

 {/* POPULAR DESTINATIONS (INTRO STYLE) */}
 <section>
 <div className="flex justify-between items-end mb-6">
 <div>
 <div className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">KHÁM PHÁ</div>
 <h2 className="text-2xl md:text-3xl font-black text-gray-900">Điểm đến phổ biến</h2>
 </div>
 <a href="/search" className="text-sm font-bold text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors">
 Xem tất cả <ChevronRight className="w-4 h-4" />
 </a>
 </div>

 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
 {POPULAR_DESTINATIONS.map((dest, idx) => (
 <motion.div
 key={idx}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: idx * 0.06 }}
 whileHover={{ y: -4 }}
 className="relative overflow-hidden cursor-pointer aspect-[3/4] group shadow-sm hover:shadow-md transition-all"
 onClick={() => { setDestination(dest.name); navigate('/search'); }}
 >
 <img src={dest.img} alt={dest.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80"></div>
 
 {/* Tag top-left */}
 <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-gray-900 font-bold text-[10px] px-2.5 py-1 rounded-full shadow-sm">
 {dest.tag}
 </div>
 
 <div className="absolute bottom-3 left-3 right-3 flex flex-col">
 <div className="text-white font-extrabold text-lg md:text-xl drop-shadow-md tracking-tight leading-tight mb-0.5">{dest.name}</div>
 <div className="text-gray-200 text-[10px] md:text-xs font-medium flex items-center gap-1 opacity-90">
 <MapPin className="w-3 h-3" /> {dest.trips}
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 </section>

 {/* FLASH SALE (INTRO STYLE) */}
 <section>
 <div className="flex justify-between items-center mb-6">
 <div className="flex items-center gap-3">
 <div className="bg-[#FF5A2C] text-white px-3.5 py-1.5 rounded-full font-black text-sm flex items-center gap-1 shadow-sm tracking-wide">
 <Zap className="w-4 h-4 fill-white" /> FLASH SALE
 </div>
 <div className="bg-[#FFF0ED] text-[#FF5A2C] px-3.5 py-1.5 rounded-full font-black text-sm shadow-sm tracking-wider">
 {formatTime(timeLeft)}
 </div>
 </div>
 <a href="/search" className="text-sm font-bold text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors">
 Xem tất cả <ChevronRight className="w-4 h-4" />
 </a>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
 {flashSales.map((sale, idx) => (
 <motion.div
 key={idx}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: idx * 0.1 }}
 whileHover={{ y: -4 }}
 className="relative overflow-hidden cursor-pointer aspect-[16/9] group shadow-sm hover:shadow-md transition-all"
 onClick={() => navigate('/search')}
 >
 <img src={sale.img} alt={sale.to} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80"></div>
 
 {/* Tag sale top-left */}
 <div className="absolute top-3 left-3 bg-[#FF5A2C] text-white font-extrabold text-[11px] px-2.5 py-1 rounded-full shadow-sm">
 -{Math.round((1 - sale.salePrice / sale.originalPrice) * 100)}%
 </div>
 
 <div className="absolute bottom-4 left-4 right-4 text-white">
 <div className="font-extrabold text-lg md:text-xl drop-shadow-md tracking-tight leading-tight">
 {sale.from} &rarr; {sale.to}
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 </section>

 {/* PROMOTIONS */}
 <section>
 <div className="flex justify-between items-end mb-6">
 <div>
 <div className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">{t('home.promotions.subtitle')}</div>
 <h2 className="text-2xl md:text-3xl font-black text-gray-900">{t('home.promotions.title')}</h2>
 </div>
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
 {(promotions.length > 0 ? promotions.slice(0, 4) : [1, 2, 3, 4]).map((promo: any, idx) => (
 <motion.div
 key={promo.id || idx}
 initial={{ opacity: 0, scale: 0.95 }}
 whileInView={{ opacity: 1, scale: 1 }}
 viewport={{ once: true }}
 transition={{ delay: idx * 0.08 }}
 className={`bg-white p-5 relative overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300 border border-gray-100 group`}
 >
 <div className="flex items-center gap-2 mb-3">
 <Ticket className="w-5 h-5 text-gray-700" />
 <span className="font-extrabold text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 uppercase tracking-wider">
 {promo.code ||'DEAL' + (idx + 1)}
 </span>
 </div>
 <div className="font-extrabold text-lg text-gray-900 mb-1 leading-tight">{promo.title ||'Ưu đãi hấp dẫn'}</div>
 <div className="text-xs text-gray-500 font-medium leading-relaxed">{promo.description ||'Áp dụng cho mọi chuyến đi'}</div>
 </motion.div>
 ))}
 </div>
 </section>

 {/* CUSTOMER REVIEWS */}
 <section>
 <div className="flex flex-col md:flex-row justify-between items-end mb-8">
 <div>
 <div className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">{t('home.reviews.subtitle')}</div>
 <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">{t('home.reviews.title')}</h2>
 <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
 <div className="flex items-center gap-1">
 {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
 </div>
 <span className="font-bold text-gray-800">4.9/5</span>
 <span>{t('home.reviews.fromReviews')}</span>
 </div>
 </div>
 <Button onClick={() => setIsReviewModalOpen(true)} className="mt-4 md:mt-0 font-bold gap-2 shadow-sm border border-gray-200 bg-white text-gray-700 hover:bg-gray-50">
 <Edit3 className="w-4 h-4" /> {t('home.reviews.writeReview')}
 </Button>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 {reviews.slice(0, 3).map((review, idx) => (
 <motion.div
 key={idx}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: idx * 0.12 }}
 >
 <div className="bg-white p-6 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] h-full flex flex-col">
 <div className="flex items-center gap-1 mb-4">
 {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
 <span className="ml-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">{review.route}</span>
 </div>
 <p className="text-gray-600 font-medium text-sm leading-relaxed mb-6 italic flex-1">"{review.text}"</p>
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-bold text-sm overflow-hidden">
 {review.avatar && review.avatar.startsWith('http') ? (
 <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
 ) : (
 review.avatar
 )}
 </div>
 <div>
 <div className="font-bold text-sm text-gray-900">{review.name}</div>
 <div className="text-xs text-gray-400">{t('home.reviews.member')}</div>
 </div>
 </div>
 <span className="text-[10px] font-bold text-gray-400 uppercase">{review.date}</span>
 </div>
 </div>
 </motion.div>
 ))}
 </div>

 <AnimatePresence>
 {isReviewModalOpen && (
 <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsReviewModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
 <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative bg-white shadow-2xl w-full max-w-lg p-6 lg:p-8 z-10 overflow-hidden">
 <div className="absolute top-4 right-4">
 <button onClick={() => setIsReviewModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
 </div>

 <div className="mb-6 text-center">
 <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
 <Star className="w-6 h-6 fill-primary" />
 </div>
 <h3 className="text-2xl font-black text-gray-900 mb-1">Đánh giá chuyến đi</h3>
 <p className="text-sm font-medium text-gray-500">Chia sẻ trải nghiệm của bạn để giúp chúng tôi phục vụ tốt hơn.</p>
 </div>

 <form onSubmit={(e) => { e.preventDefault(); setIsReviewModalOpen(false); alert('Cảm ơn bạn đã gửi đánh giá!'); }} className="space-y-6">
 <div className="flex flex-col items-center gap-2">
 <div className="text-sm font-bold text-gray-700">Chất lượng chuyến đi</div>
 <div className="flex gap-2">
 {[1, 2, 3, 4, 5].map((star) => (
 <button key={star} type="button" onClick={() => setReviewRating(star)} className="focus:outline-none transition-transform hover:scale-110">
 <Star className={`w-8 h-8 ${star <= reviewRating ?'fill-yellow-400 text-yellow-400' :'text-gray-300'}`} />
 </button>
 ))}
 </div>
 <div className="text-xs font-bold text-yellow-500">{reviewRating === 5 ?'Tuyệt vời!' : reviewRating === 4 ?'Rất tốt' : reviewRating === 3 ?'Bình thường' : reviewRating === 2 ?'Kém' :'Tệ'}</div>
 </div>

 <div>
 <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Nhận xét của bạn</label>
 <textarea rows={4} className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none" placeholder="Hãy chia sẻ cảm nhận về tài xế, ghế ngồi, đúng giờ..." required></textarea>
 </div>

 <Button type="submit" className="w-full h-12 font-bold text-base bg-primary hover:bg-primary-hover shadow-lg shadow-primary/30">Gửi đánh giá</Button>
 </form>
 </motion.div>
 </div>
 )}
 </AnimatePresence>
 </section>

 {/* NEARBY STATIONS WITH MAP */}
 {nearbyStations.length > 0 && (
 <section className="bg-white p-8 border border-gray-100 shadow-sm">
 <div className="flex justify-between items-end mb-6">
 <div>
 <div className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">{t('home.stations.subtitle')}</div>
 <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
 <MapPin className="w-6 h-6 text-gray-700" /> {t('home.stations.title')}
 </h2>
 </div>
 <Button variant="outline" className="hidden sm:flex font-bold border-gray-200 text-gray-700 hover:bg-gray-50">{t('home.stations.relocate')}</Button>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 <div className="lg:col-span-1 flex flex-col gap-4">
 {nearbyStations.map((station, idx) => (
 <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-sm transition-all duration-300 cursor-pointer group">
 <div className="w-12 h-12 bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:text-gray-700 transition-all border border-gray-100">
 <MapPin className="w-5 h-5" />
 </div>
 <div>
 <h4 className="font-bold text-sm mb-1 text-gray-900">{station.name}</h4>
 <div className="text-xs font-medium text-gray-500 flex items-center gap-3">
 <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-gray-400" />{station.distance}</span>
 <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-gray-400" />{station.time.replace('phút', t('home.stations.minutes'))}</span>
 </div>
 </div>
 </div>
 ))}
 </div>

 <div className="lg:col-span-2 relative h-[400px] overflow-hidden border border-gray-100">
 <StationMap />
 </div>
 </div>
 </section>
 )}

 {/* APP DOWNLOAD BANNER */}
 <section className="relative overflow-hidden bg-gradient-to-br from-primary via-[#00B4D8] to-slate-900 p-8 md:p-12 text-white shadow-xl group rounded-3xl mx-4 md:mx-0">
 {/* Background Patterns */}
 <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:24px_24px] opacity-50"></div>
 
 {/* Animated decorative circles */}
 <motion.div
 animate={{ rotate: [0, 360] }}
 transition={{ duration: 40, repeat: Infinity, ease:'linear' }}
 className="absolute -right-20 -top-20 w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full border-[40px] md:border-[80px] border-white/10 pointer-events-none"
 />
 <motion.div
 animate={{ rotate: [360, 0] }}
 transition={{ duration: 30, repeat: Infinity, ease:'linear' }}
 className="absolute -left-20 -bottom-20 w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full border-[20px] md:border-[40px] border-white/5 pointer-events-none"
 />

 <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
 <div className="text-center lg:text-left flex-1">
 <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-xs font-bold mb-6 border border-white/30 text-white shadow-sm">
 <Sparkles className="w-4 h-4 text-yellow-300" /> Trải nghiệm hoàn hảo
 </div>
 <h2 className="text-3xl md:text-5xl font-black mb-4 text-white leading-tight drop-shadow-md">
 Tải ứng dụng <br className="hidden md:block"/> An Chuyến
 </h2>
 <p className="text-white/90 font-medium max-w-lg mx-auto lg:mx-0 text-sm md:text-base leading-relaxed">
 Quản lý hành trình, nhận thông báo tức thời và thanh toán nhanh chóng chỉ với một chạm. Khám phá hàng ngàn ưu đãi độc quyền dành riêng cho bạn.
 </p>
 </div>
 
 <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0 w-full sm:w-auto">
 <button className="flex items-center justify-center gap-3 bg-slate-900 text-white px-6 py-4 hover:bg-black transition-all hover:scale-105 shadow-[0_10px_20px_rgba(0,0,0,0.2)] w-full sm:w-auto rounded-2xl">
 {/* Apple Icon */}
 <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.19 2.29-.88 3.56-.88 1.48.05 2.6.58 3.32 1.6-3 1.63-2.5 5.5.76 6.8-.75 1.94-1.74 3.65-2.72 4.65zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
 <div className="text-left">
 <div className="text-[10px] text-gray-400 font-semibold tracking-wide uppercase">Tải trên</div>
 <div className="font-extrabold text-base md:text-lg">App Store</div>
 </div>
 </button>
 
 <button className="flex items-center justify-center gap-3 bg-white text-slate-900 px-6 py-4 hover:bg-gray-50 transition-all hover:scale-105 shadow-[0_10px_20px_rgba(0,0,0,0.1)] w-full sm:w-auto border border-gray-100 rounded-2xl">
 {/* Play Store Icon */}
 <svg className="w-8 h-8" viewBox="0 0 24 24"><path fill="#4CAF50" d="M3.73 2.55C3.3 2.92 3 3.5 3 4.29v15.42c0 .8.3 1.38.74 1.74l.05.05L12 13.27v-.55l-8.22-8.22-.05.05z"/><path fill="#FFC107" d="M16 17.27l-4-4v-.55l4-4 .08.05 4.7 2.67c1.34.76 1.34 2.01 0 2.78l-4.7 2.67-.08.04z"/><path fill="#F44336" d="M16 17.27l-4-4-8.27 8.22c.86.92 2.34.99 3.97.07L16 17.27z"/><path fill="#2196F3" d="M16 6.73L7.7 2.06c-1.63-.92-3.11-.84-3.97.07L12 10.33l4-3.6z"/></svg>
 <div className="text-left">
 <div className="text-[10px] text-gray-500 font-semibold tracking-wide uppercase">Tải trên</div>
 <div className="font-extrabold text-base md:text-lg text-slate-900">Google Play</div>
 </div>
 </button>
 </div>
 </div>
 </section>

 </div>
 </div>
 );
}
