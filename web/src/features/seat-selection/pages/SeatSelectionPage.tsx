import { useState, useEffect } from'react';
import { Link, useNavigate, useParams } from'react-router-dom';
import { ArrowLeft, Check, Star, Car, ShieldCheck, User } from'lucide-react';
import { motion, AnimatePresence } from'framer-motion';

import { Button } from'../../../design-system/components/Button';
import { Input } from'../../../design-system/components/Input';
import { Checkbox } from'../../../design-system/components/Checkbox';
import { Card } from'../../../design-system/components/Card';
import { toast } from'sonner';
import api from'../../../lib/api';

interface SeatData {
 id: string;
 floor: number;
 status:'available' |'occupied';
 price: number;
}

interface CheckpointData {
 id: string;
 type:'PICKUP' |'DROPOFF';
 time: string;
 station: { id: string; name: string; city?: { name: string } };
}

interface TripScheduleDetail {
 id: string;
 departureTime: string;
 arrivalTime: string;
 trip: {
 busClass: string;
 busAgent: { name: string; rating: number; reviewCount: number };
 route: { departureCity: { name: string }; arrivalCity: { name: string } };
 };
 checkpoints: CheckpointData[];
}

export function SeatSelectionPage() {
 const navigate = useNavigate();
 const { tripScheduleId } = useParams<{ tripScheduleId: string }>();
 const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
 const [isBookerSameAsPassenger, setIsBookerSameAsPassenger] = useState(true);
 const [needVAT, setNeedVAT] = useState(false);
 const [addInsurance, setAddInsurance] = useState(false);
 const [activeFloor, setActiveFloor] = useState(1);
 const [seats, setSeats] = useState<SeatData[]>([]);
 const [isLoadingSeats, setIsLoadingSeats] = useState(true);
 const [tripDetail, setTripDetail] = useState<TripScheduleDetail | null>(null);

 useEffect(() => {
 if (!tripScheduleId) return;
 setIsLoadingSeats(true);
 api.get(`/trip-schedules/${tripScheduleId}/seats`)
 .then(res => setSeats(res.data.data))
 .catch(() => {
 toast.error('Không thể tải sơ đồ ghế. Vui lòng thử lại.');
 setSeats([]);
 })
 .finally(() => setIsLoadingSeats(false));

 api.get(`/trip-schedules/${tripScheduleId}`)
 .then(res => setTripDetail(res.data.data))
 .catch(() => setTripDetail(null));
 }, [tripScheduleId]);

 const pickupOptions = tripDetail?.checkpoints.filter(c => c.type ==='PICKUP') || [];
 const dropoffOptions = tripDetail?.checkpoints.filter(c => c.type ==='DROPOFF') || [];

 const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

 const [pickupPoint, setPickupPoint] = useState('');
 const [dropoffPoint, setDropoffPoint] = useState('');

 useEffect(() => {
 if (pickupOptions.length > 0 && !pickupPoint) setPickupPoint(pickupOptions[0].id);
 if (dropoffOptions.length > 0 && !dropoffPoint) setDropoffPoint(dropoffOptions[0].id);
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [tripDetail]);
 
 const [bookerName, setBookerName] = useState('');
 const [bookerPhone, setBookerPhone] = useState('');
 const [bookerEmail, setBookerEmail] = useState('');

 const [passengerName, setPassengerName] = useState('');
 const [passengerPhone, setPassengerPhone] = useState('');
 const [passengerEmail, setPassengerEmail] = useState('');

 const timerRunning = selectedSeats.length > 0;
 
 useEffect(() => {
 if (!timerRunning) {
 setTimeLeft(600);
 return;
 }
 const interval = setInterval(() => {
 setTimeLeft(prev => {
 if (prev <= 1) {
 clearInterval(interval);
 setSelectedSeats([]);
 toast.error("Hết thời gian giữ chỗ! Vui lòng chọn lại ghế.");
 return 600;
 }
 return prev - 1;
 });
 }, 1000);
 return () => clearInterval(interval);
 }, [timerRunning]);

 const insurancePrice = 20000;

 const toggleSeat = (id: string, status: string) => {
 if (status ==='occupied') return;
 if (selectedSeats.includes(id)) {
 setSelectedSeats(selectedSeats.filter(s => s !== id));
 } else {
 if (selectedSeats.length >= 4) {
 alert('Chỉ được chọn tối đa 4 ghế.');
 return;
 }
 setSelectedSeats([...selectedSeats, id]);
 }
 };

 const calculateSeatsTotal = () => {
 return selectedSeats.reduce((sum, id) => {
 const seat = seats.find(s => s.id === id);
 return sum + (seat?.price || 0);
 }, 0);
 };

 const calculateTotal = () => {
 let total = calculateSeatsTotal();
 if (addInsurance && selectedSeats.length > 0) {
 total += selectedSeats.length * insurancePrice;
 }
 return total;
 };

 const handleContinue = () => {
 if (selectedSeats.length === 0) {
 toast.error('Vui lòng chọn ít nhất 1 ghế');
 return;
 }

 if (isBookerSameAsPassenger) {
 if (!passengerName.trim() || !passengerPhone.trim() || !passengerEmail.trim()) {
 toast.error('Vui lòng nhập đầy đủ thông tin hành khách');
 return;
 }
 } else {
 if (!bookerName.trim() || !bookerPhone.trim() || !bookerEmail.trim()) {
 toast.error('Vui lòng nhập đầy đủ thông tin người đặt');
 return;
 }
 if (!passengerName.trim() || !passengerPhone.trim()) {
 toast.error('Vui lòng nhập đầy đủ họ tên và SĐT hành khách');
 return;
 }
 }

 // Save to localStorage
 const pickupInfo = pickupOptions.find(c => c.id === pickupPoint);
 const dropoffInfo = dropoffOptions.find(c => c.id === dropoffPoint);

 const bookingData = {
 tripScheduleId,
 seats: selectedSeats,
 seatsTotal: calculateSeatsTotal(),
 totalAmount: calculateTotal(),
 pickupPoint,
 dropoffPoint,
 pickupLabel: pickupInfo ? `${pickupInfo.station.name} (${new Date(pickupInfo.time).toLocaleTimeString('vi-VN', { hour:'2-digit', minute:'2-digit' })})` :'',
 dropoffLabel: dropoffInfo ? `${dropoffInfo.station.name} (${new Date(dropoffInfo.time).toLocaleTimeString('vi-VN', { hour:'2-digit', minute:'2-digit' })})` :'',
 routeLabel: tripDetail ? `${tripDetail.trip.route.departureCity.name} → ${tripDetail.trip.route.arrivalCity.name}` :'',
 busAgentName: tripDetail?.trip.busAgent.name ||'',
 addInsurance,
 insurancePrice,
 needVAT,
 passengerInfo: {
 name: passengerName,
 phone: passengerPhone,
 email: isBookerSameAsPassenger ? passengerEmail :'',
 },
 bookerInfo: isBookerSameAsPassenger ? null : {
 name: bookerName,
 phone: bookerPhone,
 email: bookerEmail,
 }
 };
 localStorage.setItem('pending_booking', JSON.stringify(bookingData));
 navigate('/booking-review');
 };

 // VIP Limousine Seat Component
 const SeatIcon = ({ status, isSelected, id }: { status: string, isSelected: boolean, id: string }) => {
 let baseStyle ="bg-gradient-to-b from-white to-gray-50 border border-gray-200 text-gray-700 shadow-[0_4px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 dark:from-slate-800 dark:to-slate-900 dark:border-slate-700 dark:text-slate-200";
 let headrestStyle ="bg-gray-200 dark:bg-slate-700";
 
 if (status ==='occupied') {
 baseStyle ="bg-gradient-to-b from-blue-500 to-blue-600 border border-blue-500 text-white cursor-not-allowed shadow-inner dark:from-blue-600 dark:to-blue-700 dark:border-blue-600 opacity-90";
 headrestStyle ="bg-blue-400 dark:bg-blue-500";
 } else if (isSelected) {
 baseStyle ="bg-gradient-to-b from-amber-400 to-orange-500 border border-orange-400 text-white shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-105 -translate-y-1 ring-2 ring-orange-400 ring-offset-2 ring-offset-white dark:ring-offset-slate-900";
 headrestStyle ="bg-white/30";
 }

 return (
 <div className={`relative w-[68px] h-[110px] rounded-2xl flex flex-col items-center justify-start pt-2.5 text-xs transition-all duration-300 ${baseStyle} group overflow-hidden`}>
 {/* Pillow */}
 <div className={`w-10 h-3.5 rounded-full mb-1.5 ${headrestStyle} transition-colors duration-300 shadow-inner`}></div>
 
 {/* Text */}
 <span className="relative z-10 font-bold mt-2 tracking-wide text-[13px]">{id}</span>

 {/* Blanket/Footrest */}
 <div className={`absolute bottom-1.5 left-1.5 right-1.5 top-[52px] rounded-xl ${isSelected ?'bg-white/20' :'bg-gray-100 dark:bg-slate-800/50'} transition-colors duration-300 shadow-inner border border-white/50 dark:border-white/5`}></div>

 {status ==='occupied' && (
 <div className="absolute inset-0 flex items-center justify-center z-20">
 <div className="w-8 h-8 rounded-full bg-slate-200/50 dark:bg-slate-700/50 backdrop-blur-sm flex items-center justify-center shadow-sm">
 <div className="w-4 h-0.5 bg-slate-500 dark:bg-slate-400 rotate-45 absolute"></div>
 <div className="w-4 h-0.5 bg-slate-500 dark:bg-slate-400 -rotate-45 absolute"></div>
 </div>
 </div>
 )}
 </div>
 );
 };

 const renderBlueprintSeats = (seatsToRender: typeof seats) => {
 // Seat ids are normally "T{floor}-{row}{A|B|C}" (e.g. "T1-1A"). Some legacy
 // seeded trips use a flat "A1", "A2"... format instead — group those by
 // position (chunks of 3) rather than trying to parse a row/col out of the id.
 const seatIdPattern = /^T\d+-(\d+)([A-Z])$/;
 const allMatchPattern = seatsToRender.every(s => seatIdPattern.test(s.id));

 const rows: Array<{ key: string; seatA?: typeof seats[number]; seatB?: typeof seats[number]; seatC?: typeof seats[number] }> = [];

 if (allMatchPattern) {
 const rowNumbers = Array.from(new Set(seatsToRender.map(s => parseInt(s.id.match(seatIdPattern)![1])))).sort((a, b) => a - b);
 for (const rowNum of rowNumbers) {
 rows.push({
 key: `row-${rowNum}`,
 seatA: seatsToRender.find(s => s.id === `T${activeFloor}-${rowNum}A`),
 seatB: seatsToRender.find(s => s.id === `T${activeFloor}-${rowNum}B`),
 seatC: seatsToRender.find(s => s.id === `T${activeFloor}-${rowNum}C`),
 });
 }
 } else {
 for (let i = 0; i < seatsToRender.length; i += 3) {
 rows.push({
 key: `row-idx-${i}`,
 seatA: seatsToRender[i],
 seatB: seatsToRender[i + 1],
 seatC: seatsToRender[i + 2],
 });
 }
 }

 return (
 <div className="flex flex-col gap-5 w-full px-4">
 {rows.map(({ key, seatA, seatB, seatC }) => (
 <div key={key} className="flex justify-between w-full items-center px-4">
 {/* Cột Trái (A) */}
 <div className="flex justify-center">
 {seatA && <button onClick={() => toggleSeat(seatA.id, seatA.status)} disabled={seatA.status ==='occupied'} className="outline-none"><SeatIcon status={seatA.status} isSelected={selectedSeats.includes(seatA.id)} id={seatA.id} /></button>}
 </div>

 {/* Lối đi 1 (Aisle 1) */}
 <div className="w-8 flex justify-center">
 <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 shadow-[0_0_8px_rgba(255,255,255,0.5)]"></div>
 </div>

 {/* Cột Giữa (B) */}
 <div className="flex justify-center">
 {seatB && <button onClick={() => toggleSeat(seatB.id, seatB.status)} disabled={seatB.status ==='occupied'} className="outline-none"><SeatIcon status={seatB.status} isSelected={selectedSeats.includes(seatB.id)} id={seatB.id} /></button>}
 </div>

 {/* Lối đi 2 (Aisle 2) */}
 <div className="w-8 flex justify-center">
 <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 shadow-[0_0_8px_rgba(255,255,255,0.5)]"></div>
 </div>

 {/* Cột Phải (C) */}
 <div className="flex justify-center">
 {seatC && <button onClick={() => toggleSeat(seatC.id, seatC.status)} disabled={seatC.status ==='occupied'} className="outline-none"><SeatIcon status={seatC.status} isSelected={selectedSeats.includes(seatC.id)} id={seatC.id} /></button>}
 </div>
 </div>
 ))}
 </div>
 );
 };

 return (
 <div className="bg-gray-50 dark:bg-slate-900 min-h-[calc(100vh-4rem)] pt-20 pb-12 font-sans relative text-gray-900 dark:text-white transition-colors duration-300">
 
 {/* Left Ad Banner */}
 <div className="hidden min-[1700px]:block absolute left-4 top-[225px] w-[250px] h-[980px] z-10 overflow-hidden shadow-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all hover:scale-105 cursor-pointer">
 <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-1.5 z-20 backdrop-blur-sm">AD</div>
 <img src="https://images.unsplash.com/photo-1520105072000-f44fc2738f67?q=80&w=200&auto=format&fit=crop" alt="Quảng cáo" className="w-full h-full object-cover opacity-90 hover:opacity-100" />
 <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
 <p className="text-white font-bold text-sm">Sale 50% <br/>Hè Sôi Động</p>
 </div>
 </div>

 {/* Right Ad Banner */}
 <div className="hidden min-[1700px]:block absolute right-4 top-[225px] w-[250px] h-[980px] z-10 overflow-hidden shadow-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all hover:scale-105 cursor-pointer">
 <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-1.5 z-20 backdrop-blur-sm">AD</div>
 <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=200&auto=format&fit=crop" alt="Quảng cáo" className="w-full h-full object-cover opacity-90 hover:opacity-100" />
 <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
 <p className="text-white font-bold text-sm">Mở thẻ tín dụng<br/>Hoàn 2 triệu</p>
 </div>
 </div>

 {/* Header Info */}
 <div className="bg-white dark:bg-slate-950 py-4 sticky top-0 md:top-20 z-30 shadow-sm border-b border-gray-200 dark:border-slate-800 transition-colors duration-300">
 <div className="container flex items-center gap-4">
 <img src="/an_chuyen_logo.png" alt="An Chuyen Logo" className="h-12 w-auto drop-shadow-sm" />
 <Link to="/search" className="p-2 bg-gray-50 dark:bg-slate-800 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 ml-2">
 <ArrowLeft className="w-5 h-5" />
 </Link>
 <div>
 <h1 className="text-xl md:text-2xl font-extrabold flex items-center gap-2 text-gray-900 dark:text-white">
 {tripDetail ? (
 <>{tripDetail.trip.route.departureCity.name} <ArrowLeft className="w-4 h-4 rotate-180" /> {tripDetail.trip.route.arrivalCity.name}</>
 ) :'Đang tải chuyến xe...'}
 </h1>
 <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-0.5">
 {tripDetail?.trip.busAgent.name}
 {tripDetail && ` • ${new Date(tripDetail.departureTime).toLocaleTimeString('vi-VN', { hour:'2-digit', minute:'2-digit' })} - ${new Date(tripDetail.arrivalTime).toLocaleTimeString('vi-VN', { hour:'2-digit', minute:'2-digit' })}`}
 </p>
 </div>
 </div>
 </div>

 {/* Horizontal Scrolling Ad Banner */}
 <div className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white overflow-hidden py-1.5 relative z-20 flex items-center">
 <div className="whitespace-nowrap animate-marquee flex items-center gap-12 text-sm font-semibold tracking-wide">
 <span>🔥 FLASH SALE: Nhập mã XINCHAO giảm ngay 50k cho chuyến đi đầu tiên!</span>
 <span>🎁 Tặng ngay voucher buffet 100k cho khách hàng đặt vé khứ hồi.</span>
 <span>⚡ Mở thẻ tín dụng liên kết - Hoàn ngay 2 triệu VNĐ, miễn phí thường niên!</span>
 <span>🚌 An Chuyến - Hành trình an toàn, trải nghiệm trọn vẹn.</span>
 </div>
 </div>

 <div className="container py-8 flex flex-col xl:flex-row gap-8 items-stretch relative z-10">
 
 {/* Left Column: Blueprint Seat Map */}
 <div className="w-full xl:w-[60%]">
 <Card className="bg-white dark:bg-slate-950 rounded-3xl shadow-sm border border-gray-200 dark:border-slate-800 p-6 md:p-8 h-full transition-colors duration-300">
 <div className="flex flex-col md:flex-row justify-between md:items-end mb-8 border-b border-gray-100 dark:border-slate-800 pb-4 gap-4 transition-colors duration-300">
 <h2 className="text-xl font-bold text-gray-900 dark:text-white">Chọn chỗ ngồi</h2>
 
 {/* Legend */}
 <div className="flex gap-4">
 <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
 <div className="w-5 h-5 bg-white border-2 border-gray-400 dark:bg-slate-800 dark:border-slate-600 rounded-md"></div> Trống
 </div>
 <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
 <div className="w-5 h-5 bg-yellow-400 border-2 border-yellow-500 rounded-md"></div> Đang chọn
 </div>
 <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
 <div className="w-5 h-5 bg-blue-500 border-2 border-blue-600 rounded-md"></div> Đã bán
 </div>
 </div>
 </div>

 {/* Floor Selection Tabs */}
 <div className="flex justify-center gap-4 mb-6 relative z-20">
 <button 
 onClick={() => setActiveFloor(1)} 
 className={`flex flex-col items-center px-6 py-2 rounded-full font-bold transition-all ${activeFloor === 1 ?'bg-amber-500 text-white shadow-md' :'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-400 dark:hover:bg-slate-700'}`}
 >
 <span>Tầng Dưới</span>
 <span className="text-[10px] font-normal opacity-80">Còn {seats.filter(s => s.floor === 1 && s.status ==='available').length} trống</span>
 </button>
 <button 
 onClick={() => setActiveFloor(2)} 
 className={`flex flex-col items-center px-6 py-2 rounded-full font-bold transition-all ${activeFloor === 2 ?'bg-amber-500 text-white shadow-md' :'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-400 dark:hover:bg-slate-700'}`}
 >
 <span>Tầng Trên</span>
 <span className="text-[10px] font-normal opacity-80">Còn {seats.filter(s => s.floor === 2 && s.status ==='available').length} trống</span>
 </button>
 </div>

 <div className="flex flex-col items-center">
 {/* VIP Cabin Capsule Container */}
 <div className="w-full pb-8 flex justify-center">
 <div className="relative border border-white/20 dark:border-white/10 rounded-[40px] p-8 pt-16 pb-12 w-[480px] bg-white dark:bg-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] mt-4 mb-4 transition-colors duration-300 overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800">
 

 {/* Subtle LED Floor lighting for Aisle */}
 <div className="absolute top-0 bottom-0 left-[52%] -translate-x-1/2 w-10 flex justify-between pointer-events-none opacity-40">
 <div className="w-0.5 h-full bg-gradient-to-b from-blue-500/0 via-blue-400 to-blue-500/0 shadow-[0_0_10px_rgba(96,165,250,0.8)]"></div>
 <div className="w-0.5 h-full bg-gradient-to-b from-blue-500/0 via-blue-400 to-blue-500/0 shadow-[0_0_10px_rgba(96,165,250,0.8)]"></div>
 </div>

 {/* Dashboard / Front Area */}
 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-10 bg-gradient-to-b from-slate-100 to-transparent dark:from-slate-800/80 flex items-end justify-center pb-2">
 <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">Cabin</span>
 </div>

 {/* Seats Grid */}
 <div className="relative z-10 w-full flex justify-center mt-4">
 {isLoadingSeats ? (
 <div className="py-16 text-sm text-gray-400 dark:text-gray-500">Đang tải sơ đồ ghế...</div>
 ) : (
 renderBlueprintSeats(seats.filter(s => s.floor === activeFloor))
 )}
 </div>
 
 {/* Cabin Rear Area */}
 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gradient-to-t from-slate-100 to-transparent dark:from-slate-800/80"></div>
 </div>
 </div>
 </div>
 </Card>
 </div>

 {/* Right Column: Form & Summary */}
 <div className="w-full xl:w-[40%] space-y-6">
 
 {/* Trip & Driver Info */}
 <Card className="bg-white dark:bg-slate-950 p-6 border-gray-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
 <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-3 transition-colors duration-300">
 Thông tin xe
 </h2>
 <div className="flex items-center gap-4 bg-gray-50 dark:bg-slate-900/50 p-4 border border-gray-100 dark:border-slate-800 rounded-2xl">
 <div className="w-16 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl overflow-hidden flex-shrink-0 shadow-sm border border-gray-200 dark:border-slate-700">
 <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=200&auto=format&fit=crop" alt="Bus" className="w-full h-full object-cover" />
 </div>
 <div>
 <div className="font-bold text-gray-900 dark:text-white">{tripDetail?.trip.busAgent.name || 'Đang tải...'}</div>
 <div className="text-sm text-gray-500 dark:text-gray-400">{tripDetail?.trip.busClass || ''}</div>
 {tripDetail && (
 <div className="flex items-center gap-1 text-[11px] text-amber-500 mt-0.5">
 <Star className="w-3 h-3 fill-amber-500" />
 <span className="font-bold">{tripDetail.trip.busAgent.rating}</span>
 <span className="text-gray-400">({tripDetail.trip.busAgent.reviewCount} đánh giá)</span>
 </div>
 )}
 </div>
 </div>
 </Card>

 {/* Pick-up / Drop-off Selection */}
 <Card className="bg-white dark:bg-slate-950 p-6 md:p-8 border-gray-200 dark:border-slate-800 shadow-sm transition-colors duration-300 rounded-3xl">
 <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-4 transition-colors duration-300">
 Điểm đón & trả khách
 </h2>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="space-y-3">
 <label className="font-bold text-gray-800 dark:text-gray-200 text-sm">Điểm đón{tripDetail && ` (${tripDetail.trip.route.departureCity.name})`}</label>
 <select value={pickupPoint} onChange={(e) => setPickupPoint(e.target.value)} className="w-full h-12 px-4 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
 {pickupOptions.length === 0 && <option value="">Không có điểm đón</option>}
 {pickupOptions.map(cp => (
 <option key={cp.id} value={cp.id}>{cp.station.name} ({new Date(cp.time).toLocaleTimeString('vi-VN', { hour:'2-digit', minute:'2-digit' })})</option>
 ))}
 </select>
 </div>
 <div className="space-y-3">
 <label className="font-bold text-gray-800 dark:text-gray-200 text-sm">Điểm trả{tripDetail && ` (${tripDetail.trip.route.arrivalCity.name})`}</label>
 <select value={dropoffPoint} onChange={(e) => setDropoffPoint(e.target.value)} className="w-full h-12 px-4 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
 {dropoffOptions.length === 0 && <option value="">Không có điểm trả</option>}
 {dropoffOptions.map(cp => (
 <option key={cp.id} value={cp.id}>{cp.station.name} ({new Date(cp.time).toLocaleTimeString('vi-VN', { hour:'2-digit', minute:'2-digit' })})</option>
 ))}
 </select>
 </div>
 </div>
 </Card>

 
 {/* Passenger Info */}
 <Card className="bg-white dark:bg-slate-950 p-6 md:p-8 border-gray-200 dark:border-slate-800 shadow-sm transition-colors duration-300 rounded-3xl">
 <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-4 transition-colors duration-300">
 Thông tin hành khách
 </h2>
 
 <div className="space-y-6">
 <div className="flex items-center gap-3 w-fit">
 <Checkbox 
 id="samePassenger" 
 checked={isBookerSameAsPassenger} 
 onCheckedChange={(c) => setIsBookerSameAsPassenger(c as boolean)} 
 className="w-5 h-5"
 />
 <label htmlFor="samePassenger" className="text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer transition-colors duration-300">Tôi là người đi chuyến này</label>
 </div>

 <AnimatePresence>
 {!isBookerSameAsPassenger && (
 <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height:'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
 <div className="space-y-4 pb-6 border-b border-gray-100 dark:border-slate-800 transition-colors duration-300">
 <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm">Thông tin người đặt (Để nhận vé)</h3>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <Input value={bookerName} onChange={(e) => setBookerName(e.target.value)} placeholder="Họ tên người đặt" className="bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-700 dark:text-white rounded-xl" />
 <Input value={bookerPhone} onChange={(e) => setBookerPhone(e.target.value)} placeholder="Số điện thoại" className="bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-700 dark:text-white rounded-xl" />
 <Input value={bookerEmail} onChange={(e) => setBookerEmail(e.target.value)} placeholder="Email" className="bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-700 dark:text-white md:col-span-2 rounded-xl" />
 </div>
 </div>
 </motion.div>
 )}
 </AnimatePresence>

 <div className="space-y-4">
 <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm transition-colors duration-300">Thông tin người lên xe</h3>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <Input value={passengerName} onChange={(e) => setPassengerName(e.target.value)} placeholder="Họ tên hành khách *" className="bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-700 dark:text-white rounded-xl" />
 <Input value={passengerPhone} onChange={(e) => setPassengerPhone(e.target.value)} placeholder="Số điện thoại *" className="bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-700 dark:text-white rounded-xl" />
 {isBookerSameAsPassenger && (
 <Input value={passengerEmail} onChange={(e) => setPassengerEmail(e.target.value)} placeholder="Email (Nhận vé điện tử) *" className="bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-700 dark:text-white md:col-span-2 rounded-xl" />
 )}
 </div>
 </div>
 </div>
 </Card>

 {/* Value Add Services */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <Card 
 className={`border-2 p-5 cursor-pointer transition-colors duration-300 rounded-2xl
 ${addInsurance ?'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' :'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-300 dark:hover:border-emerald-700'}
 `} 
 onClick={() => setAddInsurance(!addInsurance)}
 >
 <div className="flex justify-between items-start mb-2">
 <div className="font-bold text-gray-900 dark:text-white transition-colors duration-300">Bảo hiểm</div>
 <Checkbox 
 checked={addInsurance} 
 onCheckedChange={(c) => setAddInsurance(c as boolean)} 
 className="w-5 h-5 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500" 
 />
 </div>
 <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 transition-colors duration-300">Bảo vệ bạn trước rủi ro tai nạn, thất lạc hành lý.</p>
 <div className="font-bold text-emerald-600 dark:text-emerald-400 transition-colors duration-300">20.000đ <span className="text-[10px] font-normal text-emerald-600/70 dark:text-emerald-400/70">/ghế</span></div>
 </Card>

 <Card className="border-2 border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition-colors duration-300 rounded-2xl">
 <div className="flex items-center gap-3 mb-4">
 <Checkbox 
 id="vat" 
 checked={needVAT} 
 onCheckedChange={(c) => setNeedVAT(c as boolean)} 
 className="w-5 h-5"
 />
 <label htmlFor="vat" className="font-bold text-gray-900 dark:text-white cursor-pointer transition-colors duration-300">Hóa đơn VAT</label>
 </div>
 <AnimatePresence>
 {needVAT ? (
 <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height:'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-3 overflow-hidden">
 <Input placeholder="Tên công ty" className="bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-700 dark:text-white text-sm h-10 rounded-xl" />
 <Input placeholder="Mã số thuế" className="bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-700 dark:text-white text-sm h-10 rounded-xl" />
 <Input placeholder="Địa chỉ" className="bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-700 dark:text-white text-sm h-10 rounded-xl" />
 </motion.div>
 ) : (
 <div className="text-xs text-gray-400 dark:text-gray-500 mt-2 transition-colors duration-300">Tích chọn để nhập thông tin hóa đơn.</div>
 )}
 </AnimatePresence>
 </Card>
 </div>

 {/* Sticky Checkout Summary Card */}
 <div className="sticky top-32 w-full z-40 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-2xl p-5 transition-colors duration-300 rounded-[32px]">
 {selectedSeats.length > 0 && (
 <div className="flex items-center justify-between gap-3 mb-3">
 {/* Selected seats */}
 <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
 <span className="font-semibold">
 {selectedSeats.length} ghế đã chọn
 </span>
 </div>

 {/* Countdown */}
 <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/50">
 <svg
 className="w-4 h-4 text-orange-500"
 fill="none"
 stroke="currentColor"
 strokeWidth="2"
 viewBox="0 0 24 24"
 >
 <circle cx="12" cy="12" r="9" />
 <path d="M12 7v5l3 2" />
 </svg>

 <span className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300">
 Giữ chỗ
 </span>

 <span className="text-sm md:text-base font-bold tabular-nums text-orange-500">
 {Math.floor(timeLeft / 60)
 .toString()
 .padStart(2,'0')}
 :
 {(timeLeft % 60)
 .toString()
 .padStart(2,'0')}
 </span>
 </div>
 </div>
 )}

 <Button
 onClick={handleContinue}
 disabled={selectedSeats.length === 0}
 className="
 w-full
 h-14
 
 font-bold
 text-base md:text-lg
 text-white
 btn-secondary
 shadow-lg
 shadow-orange-500/20
 transition-all
 duration-200
 hover:scale-[1.01]
 hover:shadow-orange-500/30
 disabled:opacity-50
 disabled:cursor-not-allowed
 disabled:hover:scale-100
"
 >
 <span className="flex items-center justify-center gap-2">
 Tiếp tục thanh toán

 <svg
 className="w-5 h-5"
 fill="none"
 stroke="currentColor"
 strokeWidth="2"
 viewBox="0 0 24 24"
 >
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 d="M5 12h14M13 6l6 6-6 6"
 />
 </svg>
 </span>
 </Button>
 </div>
 </div>
 </div>
 </div>
 );
}
