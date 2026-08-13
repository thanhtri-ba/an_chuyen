import { useState, useMemo } from'react';
import { Link, useNavigate, useSearchParams } from'react-router-dom';
import { Filter, ArrowLeft, Check, Star, SortDesc, MapPin, X, ArrowRightLeft, Search } from'lucide-react';
import { Button } from'../../../design-system/components/Button';
import { Badge } from'../../../design-system/components/Badge';
import { Checkbox } from'../../../design-system/components/Checkbox';
import { TripDetailModal } from'../../trip-detail/components/TripDetailModal';
import api from'../../../lib/api';
import { useEffect } from'react';
import { motion } from 'framer-motion';


export function TripSearchPage() {
 const navigate = useNavigate();
 const [searchParams, setSearchParams] = useSearchParams();
 const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
 const [isEditSearchOpen, setIsEditSearchOpen] = useState(false);
 
 const searchOrigin = searchParams.get('origin') ||'';
 const searchDestination = searchParams.get('destination') ||'';
 const searchDate = searchParams.get('date') || new Date().toISOString().split('T')[0];
 const searchPassengers = searchParams.get('passengers') ||'1';
 
 const formattedDate = new Date(searchDate).toLocaleDateString('vi-VN', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

 const [selectedTrip, setSelectedTrip] = useState<any>(null);
 const [sortOption, setSortOption] = useState('early');
 const [trips, setTrips] = useState<any[]>([]);

 // Filter States
 const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
 const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
 const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
 const [selectedOperators, setSelectedOperators] = useState<string[]>([]);

 const toggleFilter = (setState: React.Dispatch<React.SetStateAction<any[]>>, value: any) => {
 setState(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
 };
 const [editOrigin, setEditOrigin] = useState(searchOrigin);
 const [editDestination, setEditDestination] = useState(searchDestination);
 const [editDate, setEditDate] = useState(searchDate);
 const [editPassengers, setEditPassengers] = useState(searchPassengers);

 const handleEditSearch = (e: React.FormEvent) => {
 e.preventDefault();
 const params = new URLSearchParams();
 if (editOrigin) params.append('origin', editOrigin);
 if (editDestination) params.append('destination', editDestination);
 if (editDate) params.append('date', editDate);
 if (editPassengers) params.append('passengers', editPassengers.toString());
 setSearchParams(params);
 setIsEditSearchOpen(false);
 };

 useEffect(() => {
 const fetchTrips = async () => {
 try {
 const res = await api.get('/trips', {
 params: {
 origin: searchOrigin,
 destination: searchDestination,
 date: searchDate,
 passengers: searchPassengers
 }
 });
 if (res.data && res.data.data && res.data.data.length > 0) {
 // Map backend schema to frontend expected format
 const mappedTrips = res.data.data.map((item: any) => {
 const depDate = new Date(item.departureTime);
 const arrDate = new Date(item.arrivalTime);
 const diffMs = arrDate.getTime() - depDate.getTime();
 const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
 const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
 const durationStr = `${diffHrs}h${diffMins > 0 ? diffMins :''}`;

 const pickupCheckpoint = item.checkpoints?.find((c: any) => c.type ==='PICKUP');
 const dropoffCheckpoint = item.checkpoints?.find((c: any) => c.type ==='DROPOFF');

 return {
 id: item.id,
 company: item.trip.busAgent.name,
 type:'Giường nằm', // Hardcode or extract
 depTime: depDate.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }),
 arrTime: arrDate.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }),
 duration: durationStr,
 from: item.trip.route.departureCity.name,
 to: item.trip.route.arrivalCity.name,
 pickupStation: pickupCheckpoint?.station?.name || item.trip.route.departureCity.name,
 dropoffStation: dropoffCheckpoint?.station?.name || item.trip.route.arrivalCity.name,
 price: item.prices[0]?.price || 350000,
 emptySeats: item.availableSeats,
 rating: 0,
 reviews: 0,
 promo: false,
 amenities: ['wifi','water']
 };
 });
 setTrips(mappedTrips);
 } else {
 setTrips([]);
 }
 } catch (error) {
 console.error("Failed to fetch trips", error);
 setTrips([]);
 }
 };
 fetchTrips();
 }, [searchOrigin, searchDestination, searchDate, searchPassengers]);

 const openTripDetail = (trip: any) => {
 setSelectedTrip(trip);
 };

 const closeTripDetail = () => {
 setSelectedTrip(null);
 };

 const dynamicOperators = useMemo(() => {
 const counts: Record<string, number> = {};
 trips.forEach(t => {
 counts[t.company] = (counts[t.company] || 0) + 1;
 });
 return Object.entries(counts).map(([name, count], idx) => ({
 id: `o${idx}`,
 label: name,
 count
 }));
 }, [trips]);

 const filteredTrips = useMemo(() => {
 let result = [...trips];

 // Filter by time
 if (selectedTimes.length > 0) {
 result = result.filter(t => {
 const hour = parseInt(t.depTime.split(':')[0]);
 const isPM = t.depTime.includes('PM');
 const h24 = (hour === 12 ? (isPM ? 12 : 0) : hour + (isPM ? 12 : 0));
 
 return selectedTimes.some(timeId => {
 if (timeId ==='t1') return h24 >= 0 && h24 < 6;
 if (timeId ==='t2') return h24 >= 6 && h24 < 12;
 if (timeId ==='t3') return h24 >= 12 && h24 < 18;
 if (timeId ==='t4') return h24 >= 18 && h24 < 24;
 return false;
 });
 });
 }

 // Filter by price
 if (selectedPrices.length > 0) {
 result = result.filter(t => {
 return selectedPrices.some(priceId => {
 if (priceId ==='p1') return t.price < 200000;
 if (priceId ==='p2') return t.price >= 200000 && t.price <= 400000;
 if (priceId ==='p3') return t.price > 400000;
 return false;
 });
 });
 }

 // Filter by rating
 if (selectedRatings.length > 0) {
 result = result.filter(t => selectedRatings.some(r => t.rating >= r));
 }

 // Filter by operator
 if (selectedOperators.length > 0) {
 result = result.filter(t => selectedOperators.includes(t.company));
 }

 // Sort
 result.sort((a, b) => {
 if (sortOption ==='price_asc') return a.price - b.price;
 if (sortOption ==='price_desc') return b.price - a.price;
 if (sortOption ==='rating') return b.rating - a.rating;
 if (sortOption ==='fastest') {
 const getMins = (d: string) => {
 const match = d.match(/(\d+)h(\d*)/);
 if (!match) return 0;
 return parseInt(match[1]) * 60 + (match[2] ? parseInt(match[2]) : 0);
 };
 return getMins(a.duration) - getMins(b.duration);
 }
 
 const timeToMins = (t: string) => {
 const hourStr = t.split(':')[0];
 const minStr = t.split(':')[1].substring(0, 2);
 let h24 = parseInt(hourStr);
 if (t.includes('PM') && h24 !== 12) h24 += 12;
 if (t.includes('AM') && h24 === 12) h24 = 0;
 return h24 * 60 + parseInt(minStr);
 };
 return timeToMins(a.depTime) - timeToMins(b.depTime);
 });

 return result;
 }, [trips, selectedTimes, selectedPrices, selectedRatings, selectedOperators, sortOption]);

 const filterContent = (
 <div className="space-y-8">
 {/* Departure Time */}
 <div>
 <h4 className="font-bold text-sm mb-4 text-foreground/80">Giờ khởi hành</h4>
 <div className="space-y-3">
 {[
 { id:'t1', label:'Sáng sớm (00:00 - 06:00)' },
 { id:'t2', label:'Buổi sáng (06:00 - 12:00)' },
 { id:'t3', label:'Buổi chiều (12:00 - 18:00)' },
 { id:'t4', label:'Buổi tối (18:00 - 24:00)' },
 ].map(time => (
 <label key={time.id} className="flex items-center gap-3 cursor-pointer group">
 <Checkbox id={time.id} checked={selectedTimes.includes(time.id)} onCheckedChange={() => toggleFilter(setSelectedTimes, time.id)} />
 <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">{time.label}</span>
 </label>
 ))}
 </div>
 </div>

 {/* Price Range */}
 <div>
 <h4 className="font-bold text-sm mb-4 text-foreground/80">Mức giá</h4>
 <div className="space-y-3">
 <label className="flex items-center gap-3 cursor-pointer group">
 <Checkbox id="p1" checked={selectedPrices.includes('p1')} onCheckedChange={() => toggleFilter(setSelectedPrices,'p1')} />
 <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">Dưới 200.000đ</span>
 </label>
 <label className="flex items-center gap-3 cursor-pointer group">
 <Checkbox id="p2" checked={selectedPrices.includes('p2')} onCheckedChange={() => toggleFilter(setSelectedPrices,'p2')} />
 <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">200.000đ - 400.000đ</span>
 </label>
 <label className="flex items-center gap-3 cursor-pointer group">
 <Checkbox id="p3" checked={selectedPrices.includes('p3')} onCheckedChange={() => toggleFilter(setSelectedPrices,'p3')} />
 <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">Trên 400.000đ</span>
 </label>
 </div>
 </div>

 {/* Rating */}
 <div>
 <h4 className="font-bold text-sm mb-4 text-foreground/80">Đánh giá nhà xe</h4>
 <div className="space-y-3">
 {[5, 4, 3].map(rating => (
 <label key={rating} className="flex items-center gap-3 cursor-pointer group">
 <Checkbox id={`r${rating}`} checked={selectedRatings.includes(rating)} onCheckedChange={() => toggleFilter(setSelectedRatings, rating)} />
 <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors flex items-center">
 Từ {rating} <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 ml-1" />
 </span>
 </label>
 ))}
 </div>
 </div>

 {/* Operators */}
 <div>
 <h4 className="font-bold text-sm mb-4 text-foreground/80">Nhà xe</h4>
 <div className="space-y-3">
 {dynamicOperators.map(operator => (
 <label key={operator.id} className="flex items-center justify-between cursor-pointer group">
 <div className="flex items-center gap-3">
 <Checkbox id={operator.id} checked={selectedOperators.includes(operator.label)} onCheckedChange={() => toggleFilter(setSelectedOperators, operator.label)} />
 <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">{operator.label}</span>
 </div>
 <span className="text-xs text-white bg-slate-800 px-2 py-0.5 rounded-full">{operator.count}</span>
 </label>
 ))}
 </div>
 </div>
 </div>
 );

 return (
 <div className="bg-gray-50 dark:bg-slate-950 min-h-[calc(100vh-4rem)] pt-20 pb-20">
 {/* Sticky Header Info */}
 <div className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white py-4 sticky top-0 md:top-20 z-30 shadow-sm border-b border-gray-200 dark:border-slate-800">
 <div className="container flex items-center justify-between">
 <div className="flex items-center gap-4">
 <Link to="/" className="p-2 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300">
 <ArrowLeft className="w-5 h-5" />
 </Link>
 <div>
 <h1 className="text-xl md:text-2xl font-extrabold flex items-center gap-2 text-gray-900 dark:text-white">
 {searchOrigin || searchDestination ? (
 <>
 {searchOrigin ||'Bất kỳ'} <span className="text-primary opacity-70">➔</span> {searchDestination ||'Bất kỳ'}
 </>
 ) : (
'Tất cả chuyến đi'
 )}
 </h1>
 <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-medium mt-0.5">{formattedDate} • {searchPassengers} hành khách</p>
 </div>
 </div>
 <div className="flex items-center gap-2">
 <Button variant="outline" onClick={() => setIsEditSearchOpen(true)} className="gap-2 rounded-full font-bold text-primary border-primary/20 hover:bg-primary/5 px-3 md:px-4">
 <Search className="w-4 h-4" /> <span className="hidden md:inline">Sửa tìm kiếm</span>
 </Button>
 <Button variant="outline" onClick={() => setMobileFilterOpen(true)} className="md:hidden gap-2 rounded-full font-bold bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 px-3">
 <Filter className="w-4 h-4" />
 </Button>
 </div>
 </div>
 </div>

 <div className="container py-8 flex flex-col md:flex-row gap-8">
 
 {/* Sidebar Filters */}
 <aside className="hidden md:block w-72 shrink-0 space-y-6">
 <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-6 shadow-sm sticky top-48">
 <div className="flex items-center gap-2 font-extrabold text-lg mb-6 pb-4 border-b border-gray-100 dark:border-slate-800 text-gray-900 dark:text-white">
 <Filter className="w-5 h-5 text-primary" /> Bộ lọc nâng cao
 </div>

 {filterContent}
 </div>
 </aside>

 {/* Main List */}
 <div className="flex-1 space-y-5">
 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
 <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Tìm thấy {filteredTrips.length} chuyến xe</h2>
 
 {/* Advanced Sort */}
 <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-1 shadow-sm">
 <SortDesc className="w-4 h-4 text-gray-400 ml-2" />
 <select 
 value={sortOption}
 onChange={(e) => setSortOption(e.target.value)}
 className="bg-transparent text-sm font-bold text-primary outline-none py-1 pr-2 cursor-pointer border-none focus:ring-0"
 >
 <option value="early">Giờ chạy sớm nhất</option>
 <option value="price_asc">Giá tăng dần</option>
 <option value="price_desc">Giá giảm dần</option>
 <option value="rating">Đánh giá cao nhất</option>
 <option value="fastest">Chuyến đi nhanh nhất</option>
 </select>
 </div>
 </div>
 
 {filteredTrips.map((trip, idx) => (
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: idx * 0.1 }}
 key={trip.id} 
 className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all duration-300 relative group overflow-hidden"
 >
 {/* Highlight ribbon for Promo/Premium */}
 {trip.promo && (
 <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-4 py-1.5 shadow-sm flex items-center gap-1 z-10">
 <Star className="w-3 h-3 fill-white" /> ƯU ĐÃI LỚN
 </div>
 )}

 <div className="flex flex-col lg:flex-row gap-6">
 
 {/* Car Thumbnail */}
 <div className="w-full lg:w-48 h-32 lg:h-full min-h-[140px] bg-gray-100 dark:bg-slate-800 overflow-hidden shrink-0 relative">
 <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
 <img 
 src={idx % 2 === 0 ? "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=400&auto=format&fit=crop" : "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=400&auto=format&fit=crop"} 
 alt="Bus" 
 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
 />
 </div>

 {/* Trip Info Left */}
 <div className="flex-1 mt-2 lg:mt-0">
 <div className="flex items-center gap-3 mb-4">
 <span className="font-extrabold text-xl text-gray-900 dark:text-white">{trip.company}</span>
 <Badge variant="secondary" className="font-semibold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-none">{trip.type}</Badge>
 <div className="flex items-center gap-1 text-sm font-bold text-yellow-500 bg-yellow-50 dark:bg-yellow-900/30 px-2 py-0.5">
 <Star className="w-3 h-3 fill-yellow-500" /> {trip.rating} <span className="text-gray-400 dark:text-gray-500 font-medium text-xs">({trip.reviews})</span>
 </div>
 </div>

 <div className="flex items-start gap-6">
 <div className="flex flex-col items-center">
 <span className="font-extrabold text-2xl tracking-tight text-gray-900 dark:text-white">{trip.depTime}</span>
 <div className="w-0.5 h-12 bg-gray-200 dark:bg-slate-700 my-2 relative rounded-full">
 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 font-bold text-[10px] px-2 py-1 rounded-full shadow-sm whitespace-nowrap">
 {trip.duration}
 </div>
 </div>
 <span className="font-bold text-xl text-gray-500 dark:text-gray-400">{trip.arrTime}</span>
 </div>
 
 <div className="flex flex-col justify-between h-[100px] py-1">
 <div className="flex items-start gap-3">
 <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-primary/20 mt-1"></div>
 <div>
 <div className="font-bold text-base text-gray-900 dark:text-white">{trip.pickupStation}</div>
 <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3 text-gray-400" /> Xem vị trí</div>
 </div>
 </div>
 <div className="flex items-start gap-3">
 <div className="w-3 h-3 rounded-full border-2 border-gray-300 dark:border-gray-600 mt-1 bg-white dark:bg-slate-900"></div>
 <div>
 <div className="font-bold text-base text-gray-500 dark:text-gray-400">{trip.dropoffStation}</div>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Price and Action Right */}
 <div className="flex flex-col justify-between items-end border-t border-gray-100 dark:border-slate-800 lg:border-t-0 lg:border-l lg:border-dashed pt-5 lg:pt-0 lg:pl-6 min-w-[220px]">
 <div className="text-right w-full flex justify-between lg:block items-end">
 <span className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center justify-end gap-1 mb-2 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full w-fit ml-auto">
 <Check className="w-4 h-4" /> Còn {trip.emptySeats} chỗ
 </span>
 <h3 className="text-3xl font-extrabold text-secondary">
 {new Intl.NumberFormat('vi-VN').format(trip.price)}<span className="text-lg text-gray-400 dark:text-gray-500 font-semibold">đ</span>
 </h3>
 </div>
 
 <div className="w-full mt-6 flex flex-col gap-2">
 <Button 
 size="lg"
 onClick={() => navigate(`/seat-selection/${trip.id}`)}
 className="w-full font-bold h-12 btn-secondary text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30"
 >
 Chọn ghế
 </Button>
 <Button 
 variant="outline" 
 onClick={() => openTripDetail(trip)}
 className="w-full font-bold text-primary border-primary/20 hover:bg-primary/5 h-11"
 >
 Xem chi tiết
 </Button>
 </div>
 </div>

 </div>
 </motion.div>
 ))}
 </div>

 </div>

 {/* Mobile Filter Modal */}
 {mobileFilterOpen && (
 <div className="fixed inset-0 z-[100] flex flex-col md:hidden">
 <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFilterOpen(false)} />
 <div className="relative mt-auto bg-white dark:bg-slate-900 w-full h-[85vh] rounded-t-3xl flex flex-col shadow-2xl">
 <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-800">
 <h2 className="font-extrabold text-lg text-gray-900 dark:text-white flex items-center gap-2">
 <Filter className="w-5 h-5 text-primary" /> Lọc & Sắp xếp
 </h2>
 <button onClick={() => setMobileFilterOpen(false)} className="p-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 transition-colors rounded-full text-gray-500 dark:text-gray-400">
 <X className="w-5 h-5" />
 </button>
 </div>
 
 <div className="flex-1 overflow-y-auto p-6">
 <div className="mb-8">
 <h4 className="font-bold text-sm mb-4 text-foreground/80">Sắp xếp theo</h4>
 <select 
 value={sortOption}
 onChange={(e) => setSortOption(e.target.value)}
 className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm font-bold text-gray-900 dark:text-white py-3 px-4 outline-none focus:border-primary transition-colors appearance-none"
 >
 <option value="early">Giờ chạy sớm nhất</option>
 <option value="price_asc">Giá tăng dần</option>
 <option value="price_desc">Giá giảm dần</option>
 <option value="rating">Đánh giá cao nhất</option>
 <option value="fastest">Chuyến đi nhanh nhất</option>
 </select>
 </div>
 <div className="border-b border-gray-100 dark:border-slate-800 mb-8" />
 
 {filterContent}
 </div>
 
 <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.05)] z-10">
 <Button onClick={() => setMobileFilterOpen(false)} className="w-full h-12 font-bold text-base shadow-sm hover:scale-[1.02] active:scale-95 transition-transform">
 Áp dụng
 </Button>
 </div>
 </div>
 </div>
 )}

 {/* Render Modal */}
 <TripDetailModal 
 isOpen={!!selectedTrip} 
 onClose={closeTripDetail} 
 trip={selectedTrip} 
 />
 {/* Edit Search Modal */}
 {isEditSearchOpen && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
 <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsEditSearchOpen(false)} />
 <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg p-6 lg:p-8 shadow-2xl">
 <div className="flex justify-between items-center mb-6">
 <h3 className="text-xl font-bold text-gray-900 dark:text-white">Tìm chuyến xe</h3>
 <button onClick={() => setIsEditSearchOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-500">
 <X className="w-5 h-5" />
 </button>
 </div>
 <form onSubmit={handleEditSearch} className="space-y-4">
 <div>
 <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Điểm đi</label>
 <input
 type="text"
 value={editOrigin}
 onChange={(e) => setEditOrigin(e.target.value)}
 className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
 placeholder="Chọn nơi đi"
 />
 </div>
 <div>
 <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Điểm đến</label>
 <input
 type="text"
 value={editDestination}
 onChange={(e) => setEditDestination(e.target.value)}
 className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
 placeholder="Chọn nơi đến"
 />
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Ngày đi</label>
 <input
 type="date"
 value={editDate}
 onChange={(e) => setEditDate(e.target.value)}
 className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
 />
 </div>
 <div>
 <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Hành khách</label>
 <select
 value={editPassengers}
 onChange={(e) => setEditPassengers(e.target.value)}
 className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
 >
 <option value={1}>1 người</option>
 <option value={2}>2 người</option>
 <option value={3}>3 người</option>
 <option value={4}>4 người</option>
 </select>
 </div>
 </div>
 <Button type="submit" className="w-full h-12 mt-4 font-bold gap-2 text-white shadow-lg shadow-primary/20">
 <Search className="w-5 h-5" /> Tìm chuyến
 </Button>
 </form>
 </div>
 </div>
 )}
 </div>
 );
}
