import { useState, useMemo, useRef } from'react';
import { Link, useNavigate, useSearchParams } from'react-router-dom';
import { Filter, ArrowLeft, Check, Star, SortDesc, MapPin, X, Search, Loader2 } from'lucide-react';
import { Button } from'../../../design-system/components/Button';
import { Badge } from'../../../design-system/components/Badge';
import { Checkbox } from'../../../design-system/components/Checkbox';
import { TripDetailModal } from'../../trip-detail/components/TripDetailModal';
import api from'../../../lib/api';
import type { Trip } from '../../../types';
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

 const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
 const [sortOption, setSortOption] = useState('early');
 const [trips, setTrips] = useState<Trip[]>([]);
 const [page, setPage] = useState(1);
 const PAGE_SIZE = 20;
 const [isLoadingMore, setIsLoadingMore] = useState(false);
 const [hasMore, setHasMore] = useState(true);
 const prevQueryRef = useRef('');
 const searchQuery = `${searchOrigin}-${searchDestination}-${searchDate}-${searchPassengers}`;

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
    const queryChanged = prevQueryRef.current !== searchQuery;
    prevQueryRef.current = searchQuery;
    
    let targetPage = page;
    if (queryChanged) {
      targetPage = 1;
      setPage(1);
    }
    
    const fetchTrips = async (p: number) => {
      try {
        setIsLoadingMore(p > 1);
        
        const res = await api.get('/trips', {
          params: {
            origin: searchOrigin,
            destination: searchDestination,
            date: searchDate,
            passengers: searchPassengers,
            page: p,
            limit: PAGE_SIZE
          }
        });
        
        if (res.data && res.data.data) {
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
              type:'Giường nằm',
              depTime: depDate.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }),
              arrTime: arrDate.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }),
              duration: durationStr,
              from: item.trip.route.departureCity.name,
              to: item.trip.route.arrivalCity.name,
              pickupStation: pickupCheckpoint?.station?.name || item.trip.route.departureCity.name,
              dropoffStation: dropoffCheckpoint?.station?.name || item.trip.route.arrivalCity.name,
              price: item.prices[0]?.price || 350000,
              emptySeats: item.availableSeats,
              rating: item.avgRating || 0,
              reviews: item.reviewCount || 0,
              promo: false,
              amenities: ['wifi','water']
            };
          });
          
          if (p === 1) {
            setTrips(mappedTrips);
          } else {
            setTrips(prev => [...prev, ...mappedTrips]);
          }
          setHasMore(mappedTrips.length === PAGE_SIZE);
        } else {
          if (p === 1) setTrips([]);
          setHasMore(false);
        }
      } catch (error) {
        console.error("Failed to fetch trips", error);
        if (p === 1) setTrips([]);
        setHasMore(false);
      } finally {
        setIsLoadingMore(false);
      }
    };
    
    if (!queryChanged || page === 1) {
      fetchTrips(targetPage);
    }
  }, [searchOrigin, searchDestination, searchDate, searchPassengers, page]);

  const handleLoadMore = () => {
    if (hasMore && !isLoadingMore) {
      setPage(prev => prev + 1);
    }
  };

  const openTripDetail = (trip: Trip) => {
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
 <span className="text-sm text-gray-700 group-hover:text-primary transition-colors">{time.label}</span>
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
 <span className="text-sm text-gray-700 group-hover:text-primary transition-colors">Dưới 200.000đ</span>
 </label>
 <label className="flex items-center gap-3 cursor-pointer group">
 <Checkbox id="p2" checked={selectedPrices.includes('p2')} onCheckedChange={() => toggleFilter(setSelectedPrices,'p2')} />
 <span className="text-sm text-gray-700 group-hover:text-primary transition-colors">200.000đ - 400.000đ</span>
 </label>
 <label className="flex items-center gap-3 cursor-pointer group">
 <Checkbox id="p3" checked={selectedPrices.includes('p3')} onCheckedChange={() => toggleFilter(setSelectedPrices,'p3')} />
 <span className="text-sm text-gray-700 group-hover:text-primary transition-colors">Trên 400.000đ</span>
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
 <span className="text-sm text-gray-700 group-hover:text-primary transition-colors flex items-center">
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
 <span className="text-sm text-gray-700 group-hover:text-primary transition-colors">{operator.label}</span>
 </div>
 <span className="text-xs text-white bg-slate-800 px-2 py-0.5 rounded-full">{operator.count}</span>
 </label>
 ))}
 </div>
 </div>
 </div>
 );

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-4rem)] pt-20 pb-20">
      {/* Sticky Header Info */}
      <div className="bg-white/80 backdrop-blur-md text-gray-900 py-4 sticky top-0 md:top-20 z-30 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border-b border-slate-100/80 transition-all duration-300">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 bg-white hover:bg-slate-50 rounded-full transition-all border border-slate-100 text-slate-700 shadow-sm hover:scale-105">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold flex items-center gap-2 text-slate-800 tracking-tight">
                {searchOrigin || searchDestination ? (
                  <>
                    {searchOrigin || 'Bất kỳ'} <span className="text-primary opacity-70">➔</span> {searchDestination || 'Bất kỳ'}
                  </>
 ) : (
'Tất cả chuyến đi'
 )}
 </h1>
 <p className="text-gray-500 text-xs md:text-sm font-medium mt-0.5">{formattedDate} • {searchPassengers} hành khách</p>
 </div>
 </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setIsEditSearchOpen(true)} className="gap-2 rounded-full font-bold text-slate-700 border-slate-200 hover:bg-slate-50 shadow-sm px-3 md:px-4">
              <Search className="w-4 h-4" /> <span className="hidden md:inline">Sửa tìm kiếm</span>
            </Button>
            <Button variant="outline" onClick={() => setMobileFilterOpen(true)} className="md:hidden gap-2 rounded-full font-bold bg-white border border-slate-200 text-slate-700 px-3">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8 flex flex-col md:flex-row gap-8">
      
        {/* Sidebar Filters */}
        <aside className="hidden md:block w-72 shrink-0 space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)] sticky top-48">
            <div className="flex items-center gap-2 font-extrabold text-lg mb-6 pb-4 border-b border-slate-100 text-slate-800">
              <Filter className="w-5 h-5 text-primary" /> Bộ lọc nâng cao
            </div>

            {filterContent}
          </div>
        </aside>

 {/* Main List */}
 <div className="flex-1 space-y-5">
 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
 <h2 className="text-xl font-extrabold text-gray-900">Tìm thấy {filteredTrips.length} chuyến xe</h2>
 
 {/* Advanced Sort */}
 <div className="flex items-center gap-2 bg-white border border-gray-200 p-1 shadow-sm">
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
      transition={{ delay: idx * 0.05 }}
      key={trip.id} 
      className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.015)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 relative group"
    >
      {/* Top and Bottom Ticket Notches */}
      <div className="absolute -top-3 right-[232px] w-6 h-6 rounded-full bg-gray-50 border border-slate-100/80 z-10 hidden lg:block"></div>
      <div className="absolute -bottom-3 right-[232px] w-6 h-6 rounded-full bg-gray-50 border border-slate-100/80 z-10 hidden lg:block"></div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Car Thumbnail */}
        <div className="w-full lg:w-48 h-36 bg-slate-50 overflow-hidden shrink-0 relative rounded-xl border border-slate-100">
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10"></div>
          <img 
            src={idx % 2 === 0 ? "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=400&auto=format&fit=crop" : "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=400&auto=format&fit=crop"} 
            alt="Bus" 
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          />
        </div>

        {/* Trip Info Left */}
        <div className="flex-1 mt-2 lg:mt-0 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="font-extrabold text-xl text-slate-800 tracking-tight">{trip.company}</span>
              <Badge variant="secondary" className="font-bold text-xs bg-slate-50 text-slate-600 border border-slate-100/70 px-2 py-0.5 rounded-md">{trip.type}</Badge>
              <div className="flex items-center gap-1 text-sm font-bold text-yellow-600 bg-yellow-50/70 border border-yellow-100 px-2 py-0.5 rounded-md">
                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /> {trip.rating} <span className="text-slate-400 font-medium text-xs">({trip.reviews})</span>
              </div>
              {trip.promo && (
                <Badge className="bg-red-50 text-red-600 border border-red-100 font-bold text-[10px] px-2.5 py-0.5 rounded-md flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-red-600" /> ƯU ĐÃI LỚN
                </Badge>
              )}
            </div>

            <div className="flex items-start gap-6 mt-4">
              <div className="flex flex-col items-center">
                <span className="font-extrabold text-2xl tracking-tight text-slate-800">{trip.depTime}</span>
                <div className="w-0.5 h-12 bg-slate-100 my-1 relative rounded-full">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-slate-100 text-slate-500 font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.04)] whitespace-nowrap">
                    {trip.duration}
                  </div>
                </div>
                <span className="font-extrabold text-2xl tracking-tight text-slate-800">{trip.arrTime}</span>
              </div>
              
              <div className="flex flex-col justify-between h-[104px] py-1">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-primary/10 mt-1.5"></div>
                  <div>
                    <div className="font-bold text-base text-slate-800 leading-tight">{trip.pickupStation}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3 text-slate-400" /> Xem vị trí</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full border-2 border-slate-300 mt-1.5 bg-white"></div>
                  <div>
                    <div className="font-bold text-base text-slate-500 leading-tight">{trip.dropoffStation}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vertical Divider for Ticket Look */}
        <div className="hidden lg:block w-[1px] border-l border-dashed border-slate-200/80 my-2 self-stretch shrink-0"></div>

        {/* Price and Action Right */}
        <div className="flex flex-col justify-between items-end border-t border-slate-100 lg:border-t-0 pt-5 lg:pt-0 lg:pl-4 lg:w-[220px] shrink-0">
          <div className="text-right w-full flex justify-between lg:block items-end">
            <span className="text-xs font-bold text-emerald-600 flex items-center justify-end gap-1 mb-2 bg-emerald-50 border border-emerald-100/50 px-3 py-1 rounded-full w-fit ml-auto">
              <Check className="w-4 h-4" /> Còn {trip.emptySeats} chỗ
            </span>
            <h3 className="text-3xl font-extrabold text-secondary tracking-tight">
              {new Intl.NumberFormat('vi-VN').format(trip.price)}<span className="text-lg text-slate-400 font-semibold">đ</span>
            </h3>
          </div>
          
          <div className="w-full mt-6 flex flex-col gap-2">
            <Button 
              size="lg"
              onClick={() => navigate(`/seat-selection/${trip.id}`)}
              className="w-full font-bold h-12 bg-gradient-to-r from-[#ff4525] to-[#ff7d1a] hover:from-[#e03d20] hover:to-[#e06e17] text-white shadow-md shadow-orange-500/10 hover:shadow-lg hover:shadow-orange-500/20 active:scale-[0.98] rounded-xl transition-all duration-200"
            >
              Chọn ghế
            </Button>
            <Button 
              variant="outline" 
              onClick={() => openTripDetail(trip)}
              className="w-full font-bold text-slate-700 border-slate-200 hover:bg-slate-50 h-11 rounded-xl shadow-none transition-all duration-200"
            >
              Xem chi tiết
            </Button>
          </div>
        </div>

      </div>
    </motion.div>
  ))}

  {hasMore && filteredTrips.length > 0 && (
    <div className="flex justify-center mt-8">
      <Button 
        onClick={handleLoadMore} 
        disabled={isLoadingMore}
        className="font-bold gap-2 text-white h-12 shadow-lg shadow-primary/20 px-8"
      >
        {isLoadingMore ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Đang tải...
          </>
        ) : 'Xem Thêm'}
      </Button>
    </div>
  )}
  </div>

 </div>

 {/* Mobile Filter Modal */}
 {mobileFilterOpen && (
 <div className="fixed inset-0 z-[100] flex flex-col md:hidden">
 <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFilterOpen(false)} />
 <div className="relative mt-auto bg-white w-full h-[85vh] rounded-t-3xl flex flex-col shadow-2xl">
 <div className="flex items-center justify-between p-4 border-b border-gray-100">
 <h2 className="font-extrabold text-lg text-gray-900 flex items-center gap-2">
 <Filter className="w-5 h-5 text-primary" /> Lọc & Sắp xếp
 </h2>
 <button onClick={() => setMobileFilterOpen(false)} className="p-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full text-gray-500">
 <X className="w-5 h-5" />
 </button>
 </div>
 
 <div className="flex-1 overflow-y-auto p-6">
 <div className="mb-8">
 <h4 className="font-bold text-sm mb-4 text-foreground/80">Sắp xếp theo</h4>
 <select 
 value={sortOption}
 onChange={(e) => setSortOption(e.target.value)}
 className="w-full bg-gray-50 border border-gray-200 text-sm font-bold text-gray-900 py-3 px-4 outline-none focus:border-primary transition-colors appearance-none"
 >
 <option value="early">Giờ chạy sớm nhất</option>
 <option value="price_asc">Giá tăng dần</option>
 <option value="price_desc">Giá giảm dần</option>
 <option value="rating">Đánh giá cao nhất</option>
 <option value="fastest">Chuyến đi nhanh nhất</option>
 </select>
 </div>
 <div className="border-b border-gray-100 mb-8" />
 
 {filterContent}
 </div>
 
 <div className="p-4 border-t border-gray-100 bg-white shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.05)] z-10">
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
 <div className="relative bg-white w-full max-w-lg p-6 lg:p-8 shadow-2xl">
 <div className="flex justify-between items-center mb-6">
 <h3 className="text-xl font-bold text-gray-900">Tìm chuyến xe</h3>
 <button onClick={() => setIsEditSearchOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
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
 className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
 placeholder="Chọn nơi đi"
 />
 </div>
 <div>
 <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Điểm đến</label>
 <input
 type="text"
 value={editDestination}
 onChange={(e) => setEditDestination(e.target.value)}
 className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
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
 className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
 />
 </div>
 <div>
 <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Hành khách</label>
 <select
 value={editPassengers}
 onChange={(e) => setEditPassengers(e.target.value)}
 className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
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
