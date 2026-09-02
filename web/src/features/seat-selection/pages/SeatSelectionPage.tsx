import { useState, useEffect, useRef, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Wifi, Usb, Droplets, Phone, Wind, ShieldCheck, Search, Ticket, Tag, HelpCircle, Bus, X, Armchair, Info, PenLine, Snowflake, Users, Layers, Star, ChevronDown, Trash2, Plus, Minus, Lock, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import api from '../../../lib/api';
import { BookingStepper } from '../../../shared/components/BookingStepper';
import { DatePicker } from '../../../shared/components/DatePicker';

// --- Types & Mocks ---
interface SeatData { id: string; floor: number; status: 'available' | 'booked' | 'blocked' | 'held-by-me'; price: number; }
interface CheckpointData { id: string; type: 'PICKUP' | 'DROPOFF'; time: string; station: { id: string; name: string; city?: { name: string } }; }
interface TripScheduleDetail { id: string; departureTime: string; arrivalTime: string; trip: { busClass: string; busAgent: { name: string; rating: number }; route: { departureCity: { name: string }; arrivalCity: { name: string } }; basePrice?: number }; checkpoints: CheckpointData[]; }
interface PassengerForm { name: string; phone: string; email: string; gender: string; dob: string; idNumber: string; nationality: string; }
const emptyPassenger = (): PassengerForm => ({ name: '', phone: '', email: '', gender: 'Nam', dob: '', idNumber: '', nationality: 'Việt Nam' });
const AMENITY_PRICES = { water: 10000, towel: 5000, pillow: 30000 };

function parseSeatId(id: string) {
  const m = id.match(/^T(\d+)-(\d+)([A-Z]+)$/);
  if (!m) return null;
  return { floor: parseInt(m[1]), row: parseInt(m[2]), col: m[3] };
}
// Sequential "A01, A02, ..." display labels in row-major order — shared by SeatMap and the VIP pill so they never disagree.
// Prefix letter defaults to the seat's own floor (1 -> A, 2 -> B, ...) so floor 2 doesn't
// reuse "A01" and collide visually with floor 1's own A01.
function computeSeatLabels(seatsForFloor: SeatData[], prefix?: string): Record<string,string> {
  const parsed = seatsForFloor.map(s=>({...s,p:parseSeatId(s.id)})).filter(s=>s.p);
  const rows = [...new Set(parsed.map(s=>s.p!.row))].sort((a,b)=>a-b);
  const cols = [...new Set(parsed.map(s=>s.p!.col))].sort();
  let counter=1;
  const map: Record<string,string> = {};
  rows.forEach(r=>{
    cols.forEach(c=>{
      const seat = parsed.find(s=>s.p!.row===r&&s.p!.col===c);
      if (seat) {
        const letter = prefix ?? String.fromCharCode(64 + (seat.floor || 1)); // floor 1 -> A, floor 2 -> B
        map[seat.id] = `${letter}${String(counter++).padStart(2,'0')}`;
      }
    });
  });
  return map;
}
// 2+2 layout, 6 rows: a few positions are decorative (luggage rack / no seat). Row 1 (front row) carries a VIP surcharge.
const GAP_CELLS = new Set(['1-3-C','1-5-A','1-6-D','2-3-C','2-5-A','2-6-D']);
function generateMockSeats(): SeatData[] {
  const booked = new Set(['T1-1B','T1-4A','T1-4D','T2-1A','T2-4B']);
  const seats: SeatData[] = [];
  [1,2].forEach(floor => {
    for (let row=1; row<=6; row++) {
      ['A','B','C','D'].forEach(col => {
        if (GAP_CELLS.has(`${floor}-${row}-${col}`)) return;
        const id = `T${floor}-${row}${col}`;
        const base = floor===2?185000:155000;
        seats.push({ id, floor, status: booked.has(id)?'booked':'available', price: row===1?base+30000:base });
      });
    }
  });
  return seats;
}

// --- Components ---
// Tall "capsule" cell per Figma (node 22:212 "Rows N: VIP"): row label sits ABOVE
// a smaller inner seat box, both wrapped in one rounded card — not a single square
// with the number inside, which was the old style.
function SeatIcon({ label, selected, booked, vip=false, size=52 }: { label?: string; selected: boolean; booked: boolean; vip?: boolean; size?: number }) {
  const width = size;
  const height = size * 1.35; // shorter than Figma's raw 1:1.71 — reads too elongated at this scale
  const innerHeight = size * 0.8;

  if (booked) {
    return (
      <div style={{ width, height, borderRadius: size*0.21 }} className="flex flex-col items-center justify-center gap-1.5 bg-[#F8F9FA] border border-[#DEE2E6]">
        <span style={{fontSize: Math.max(9, size*0.19)}} className="font-bold text-[#ADB5BD]">{label}</span>
        <Armchair size={size*0.3} strokeWidth={1.75} className="text-[#ADB5BD]" />
      </div>
    );
  }
  const outerBg = selected ? 'bg-[#FFF3CD]' : vip ? 'bg-[rgba(255,243,205,0.5)]' : 'bg-white';
  const outerBorder = selected ? 'border-[#FFC107]' : vip ? 'border-[rgba(133,100,4,0.25)]' : 'border-[#DEE2E6]';
  const labelColor = selected || vip ? 'text-[#856404]' : 'text-[#212529]';
  const innerBg = selected ? 'bg-[#FFC107] border-[#FFC107]' : 'bg-[rgba(255,255,255,0.6)] border-[rgba(133,100,4,0.15)]';

  return (
    <div
      style={{ width, height, borderRadius: size*0.21 }}
      className={`relative flex flex-col items-center justify-center gap-1.5 border shadow-sm p-1 transition-all ${outerBg} ${outerBorder}`}
    >
      <span style={{fontSize: Math.max(9, size*0.19)}} className={`font-bold ${labelColor}`}>{label}</span>
      <div
        style={{ width: size*0.71, height: innerHeight, borderRadius: size*0.11 }}
        className={`flex items-center justify-center border ${innerBg}`}
      >
        {selected && <CheckCircle2 size={size*0.24} className="text-white" strokeWidth={2.5} />}
        {!selected && vip && <span className="font-bold uppercase text-[rgba(133,100,4,0.5)]" style={{fontSize: Math.max(6, size*0.11)}}>VIP</span>}
      </div>
    </div>
  );
}

function LegendDot({ selected, booked, vip, size=28 }: { selected: boolean; booked: boolean; vip: boolean; size?: number }) {
  const bg = booked ? 'bg-[#E9ECEF]' : selected ? 'bg-[#FFC107]' : 'bg-white';
  const border = booked ? 'border-[#E9ECEF]' : selected ? 'border-[#FFC107]' : vip ? 'border-2 border-[#856404]' : 'border-[#DEE2E6]';
  return <div style={{width:size,height:size}} className={`rounded-[4px] border ${bg} ${border}`} />;
}

function SeatMap({ seats, selectedSeats, onToggle, seatSize=48 }: { seats: SeatData[]; selectedSeats: string[]; onToggle: (id: string, status: string) => void; seatSize?: number }) {
  if (!seats.length) return <div className="text-[#6C757D] text-xs py-10 text-center font-medium">Không có dữ liệu ghế</div>;
  const parsed = seats.map(s=>({...s, p:parseSeatId(s.id)})).filter(s=>s.p);
  const rows = [...new Set(parsed.map(s=>s.p!.row))].sort((a,b)=>a-b);
  const cols = [...new Set(parsed.map(s=>s.p!.col))].sort();
  // Evenly spaced columns (no lopsided aisle-after-col-2 gap) — user asked for 3 equal lanes.
  const GAP = Math.round(seatSize*0.55);
  const prices = parsed.map(s=>s.price);
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const labels = computeSeatLabels(seats);

  return (
    <div className="flex justify-center w-full">
      <div className="inline-block">
        {rows.map(rowNum=>(
          <div key={rowNum} className="relative flex items-center" style={{marginBottom: Math.round(seatSize*0.15)}}>
            <span className="absolute font-semibold text-[#6C757D] text-right" style={{left:-Math.round(seatSize*0.33), fontSize: seatSize*0.19, width: seatSize*0.28}}>{rowNum}</span>
            {cols.map((col,ci)=>{
              const seat = parsed.find(s=>s.p!.row===rowNum&&s.p!.col===col);
              const sel = seat ? selectedSeats.includes(seat.id) : false;
              const avail = seat?.status==='available' || seat?.status==='held-by-me';
              const vip = !!seat && maxPrice>minPrice && seat.price===maxPrice;
              const displayNum = seat ? labels[seat.id] : '';

              return (
                <div key={col} className="flex items-center">
                  <motion.div
                    whileHover={avail&&seat?{scale:1.05}:{}} whileTap={avail&&seat?{scale:0.95}:{}}
                    onClick={()=>seat&&avail&&onToggle(seat.id,seat.status)}
                    style={{marginRight:ci<cols.length-1?GAP:0}}
                    className={`relative select-none flex flex-col items-center gap-0.5 ${seat ? (avail ? 'cursor-pointer' : 'cursor-not-allowed') : 'cursor-default'}`}
                  >
                    {seat ? <SeatIcon label={displayNum} selected={sel} booked={!avail} vip={vip} size={seatSize}/> : <SeatIcon selected={false} booked size={seatSize}/>}
                  </motion.div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Passenger info step: small field primitives (Tailwind-gray palette per Figma node 9:420) ---
const infoInputBase = "w-full bg-white border border-[#D1D5DB] rounded-lg px-[17px] py-[11px] text-sm text-[#1F2937] outline-none transition-all disabled:bg-[#F9FAFB] disabled:text-[#9CA3AF]";
const infoInputFocus = "focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20";

function InfoLabel({ children, required }: { children: ReactNode; required?: boolean }) {
  return <div className="text-xs font-medium text-[#6B7280] mb-1">{children}{required && <span className="text-[#EF4444]"> *</span>}</div>;
}

function TextField({ label, value, onChange, placeholder, required, disabled, type='text', maxLength, inputMode }: { label:string; value:string; onChange:(v:string)=>void; placeholder?:string; required?:boolean; disabled?:boolean; type?:string; maxLength?:number; inputMode?:'text'|'tel'|'numeric' }) {
  return (
    <div>
      <InfoLabel required={required}>{label}</InfoLabel>
      <input type={type} value={value} disabled={disabled} maxLength={maxLength} inputMode={inputMode}
        onChange={e=>onChange(maxLength ? e.target.value.replace(/\D/g,'').slice(0,maxLength) : e.target.value)}
        placeholder={placeholder}
        className={`${infoInputBase} ${infoInputFocus}`} />
    </div>
  );
}

function DateField({ label, value, onChange, disabled }: { label:string; value:string; onChange:(v:string)=>void; disabled?:boolean }) {
  const today = new Date().toISOString().split('T')[0];
  const minDob = new Date(new Date().setFullYear(new Date().getFullYear()-120)).toISOString().split('T')[0];
  return (
    <div>
      <InfoLabel>{label}</InfoLabel>
      <DatePicker value={value} onChange={onChange} disabled={disabled} max={today} min={minDob} />
    </div>
  );
}

function SelectField({ label, value, onChange, options, disabled }: { label:string; value:string; onChange:(v:string)=>void; options:string[]; disabled?:boolean }) {
  return (
    <div>
      <InfoLabel>{label}</InfoLabel>
      <div className="relative">
        <select value={value} disabled={disabled} onChange={e=>onChange(e.target.value)}
          className={`${infoInputBase} ${infoInputFocus} appearance-none pr-[36px] cursor-pointer`}>
          {options.map(o=><option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={14} className="absolute right-[13px] top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" />
      </div>
    </div>
  );
}

// --- Page Component ---
export function SeatSelectionPage() {
  const navigate = useNavigate();
  const { tripScheduleId } = useParams<{ tripScheduleId: string }>();

  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  const [seats, setSeats] = useState<SeatData[]>(()=>generateMockSeats());
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [tripDetail, setTripDetail] = useState<TripScheduleDetail|null>(null);
  const [timeLeft, setTimeLeft] = useState(600);
  const [step, setStep] = useState<'seat'|'info'>('seat');
  const [passengers, setPassengers] = useState<PassengerForm[]>([emptyPassenger()]);
  const [copyFromFirst, setCopyFromFirst] = useState<boolean[]>([false]);
  const [amenityQty, setAmenityQty] = useState({ water: 0, towel: 0, pillow: 0 });
  const [usbSelected, setUsbSelected] = useState(true);
  const [notes, setNotes] = useState('');
  const [pickupPoint,setPickupPoint] = useState('');
  const [dropoffPoint,setDropoffPoint] = useState('');

  useEffect(()=>{
    if(!tripScheduleId) return;
    api.get(`/trip-schedules/${tripScheduleId}`).then(r=>setTripDetail(r.data.data)).catch(()=>{});
    api.get(`/trip-schedules/${tripScheduleId}/seats`).then(r=>{
      const data:SeatData[]=r.data.data||[];
      if(data.filter(s=>parseSeatId(s.id)).length>0) setSeats(data);
    }).catch(()=>{});
  },[tripScheduleId]);

  const pickupOpts = tripDetail?.checkpoints.filter(c=>c.type==='PICKUP')||[];
  const dropoffOpts = tripDetail?.checkpoints.filter(c=>c.type==='DROPOFF')||[];
  useEffect(()=>{
    if(pickupOpts.length&&!pickupPoint) setPickupPoint(pickupOpts[0].id);
    if(dropoffOpts.length&&!dropoffPoint) setDropoffPoint(dropoffOpts[0].id);
  },[tripDetail]);

  // Ghế thực sự giữ trên server (backend LOCKED + lockExpiresAt) — khác với
  // selectedSeats (UI). heldRef theo dõi seat nào đã hold thành công để biết
  // seat nào cần release khi bỏ chọn / rời trang / hết giờ.
  const heldRef = useRef<string[]>([]);
  const proceedingRef = useRef(false);
  // Hold/release chỉ áp dụng khi khách đã đăng nhập — trang chọn ghế cho phép
  // khách vãng lai duyệt & chọn ghế không cần tài khoản (chỉ /payment mới bắt
  // đăng nhập), và interceptor của api.ts tự redirect sang /auth khi gặp 401,
  // nên gọi hold khi chưa có token sẽ đá khách ra khỏi trang một cách vô lý.
  const isLoggedIn = () => !!sessionStorage.getItem('busz_token');

  const releaseSeatsOnServer = (ids: string[]) => {
    if (!tripScheduleId || ids.length === 0 || !isLoggedIn()) return;
    api.post(`/trip-schedules/${tripScheduleId}/seats/release`, { seatNumbers: ids }).catch(() => {});
    heldRef.current = heldRef.current.filter(id => !ids.includes(id));
  };

  // Rời trang mà không tiếp tục sang thanh toán → nhả hết ghế đang giữ.
  useEffect(() => {
    return () => {
      if (!proceedingRef.current) releaseSeatsOnServer(heldRef.current);
    };
  }, []);

  // Đồng bộ ghế được chọn trên UI với hold thật trên server: gọi hold khi thêm
  // ghế, release khi bỏ chọn. Nếu hold thất bại (ghế vừa bị người khác giữ),
  // rollback lựa chọn và báo lỗi.
  useEffect(() => {
    if (!tripScheduleId || !isLoggedIn()) return;
    const newlySelected = selectedSeats.filter(id => !heldRef.current.includes(id));
    const deselected = heldRef.current.filter(id => !selectedSeats.includes(id));

    if (deselected.length > 0) releaseSeatsOnServer(deselected);

    if (newlySelected.length > 0) {
      api.post(`/trip-schedules/${tripScheduleId}/seats/hold`, { seatNumbers: newlySelected })
        .then(() => { heldRef.current = [...heldRef.current, ...newlySelected]; })
        .catch((err) => {
          toast.error(err?.response?.data?.message || 'Ghế vừa được người khác giữ, vui lòng chọn ghế khác');
          setSelectedSeats(prev => prev.filter(id => !newlySelected.includes(id)));
        });
    }
  }, [selectedSeats, tripScheduleId]);

  useEffect(()=>{
    if(!selectedSeats.length){setTimeLeft(600);return;}
    const iv=setInterval(()=>setTimeLeft(p=>{
      if(p<=1){
        clearInterval(iv);
        releaseSeatsOnServer(heldRef.current);
        setSelectedSeats([]);setStep('seat');toast.error('Hết thời gian giữ chỗ!');return 600;
      }
      return p-1;
    }),1000);
    return()=>clearInterval(iv);
  },[selectedSeats.length>0]);

  const toggleSeat=(id:string,status:string)=>{
    if(status!=='available' && status!=='held-by-me') return;
    if(selectedSeats.includes(id)){setSelectedSeats(p=>p.filter(s=>s!==id));return;}
    if(selectedSeats.length>=4){toast.error('Tối đa 4 ghế');return;}
    setSelectedSeats(p=>[...p,id]);
  };

  // One passenger form per selected seat (min 1) — grow/shrink to match as seats are added or removed.
  useEffect(()=>{
    const n = Math.max(1, selectedSeats.length);
    setPassengers(prev=> prev.length===n ? prev : prev.length<n ? [...prev, ...Array.from({length:n-prev.length},emptyPassenger)] : prev.slice(0,n));
    setCopyFromFirst(prev=> prev.length===n ? prev : prev.length<n ? [...prev, ...Array.from({length:n-prev.length},()=>false)] : prev.slice(0,n));
  },[selectedSeats.length]);

  const updatePassenger = (idx:number, field:keyof PassengerForm, value:string) => {
    setPassengers(prev=>prev.map((p,i)=>i===idx?{...p,[field]:value}:p));
  };
  const toggleCopyFirst = (idx:number) => {
    const willCopy = !copyFromFirst[idx];
    setCopyFromFirst(prev=>prev.map((v,i)=>i===idx?willCopy:v));
    if(willCopy) setPassengers(prev=>prev.map((p,i)=>i===idx?{...prev[0]}:p));
  };
  const removePassenger = (idx:number) => {
    if(selectedSeats[idx]) toggleSeat(selectedSeats[idx],'available');
  };

  const seatsTotal = selectedSeats.reduce((s,id)=>s+(seats.find(x=>x.id===id)?.price||0),0);
  const amenitiesTotal = amenityQty.water*AMENITY_PRICES.water + amenityQty.towel*AMENITY_PRICES.towel + amenityQty.pillow*AMENITY_PRICES.pillow;
  const fmt = (n:number)=>new Intl.NumberFormat('vi-VN').format(n);

  const floorCount = seats.length?Math.max(2, ...seats.map(s=>s.floor)):2;
  // Cheapest available seat on each floor, shown next to each floor's header.
  const floorFromPrice: Record<number, number> = {};
  [1,2].forEach(f=>{
    const prices = seats.filter(s=>s.floor===f).map(s=>s.price);
    if (prices.length) floorFromPrice[f] = Math.min(...prices);
  });

  // Both floors shown side by side (not a toggle) — VIP-range math per floor.
  const getFloorInfo = (f: number) => {
    const fSeats = seats.filter(s=>s.floor===f);
    const prices = fSeats.map(s=>s.price);
    const maxP = prices.length?Math.max(...prices):0;
    const minP = prices.length?Math.min(...prices):0;
    const labels = computeSeatLabels(fSeats);
    const vLabels = maxP>minP
      ? fSeats.filter(s=>s.price===maxP).map(s=>labels[s.id]).filter(Boolean).sort((a,b)=>parseInt(a.slice(1))-parseInt(b.slice(1)))
      : [];
    const vNums = vLabels.map(l=>parseInt(l.slice(1)));
    const vContig = vNums.every((n,i)=>i===0||n===vNums[i-1]+1);
    const vRange = vLabels.length===0 ? '' : vLabels.length===1 ? vLabels[0]
      : vContig ? `${vLabels[0]} - ${vLabels[vLabels.length-1]}` : vLabels.join(', ');
    return { seats: fSeats, vipRangeLabel: vRange };
  };

  // Display labels ("A05") for selected-seat chips, computed per-floor so cross-floor selections still resolve.
  const globalSeatLabels: Record<string,string> = {};
  [...new Set(seats.map(s=>s.floor))].forEach(f=>Object.assign(globalSeatLabels, computeSeatLabels(seats.filter(s=>s.floor===f))));
  const labelFor = (id:string) => globalSeatLabels[id] || id;

  const depCity = tripDetail?.trip.route.departureCity.name||'TP. Hồ Chí Minh';
  const arrCity = tripDetail?.trip.route.arrivalCity.name||'Nha Trang';
  const depTime = tripDetail?new Date(tripDetail.departureTime).toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'}):'07:00';
  const arrTime = tripDetail?new Date(tripDetail.arrivalTime).toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'}):'15:30';
  const depDate = tripDetail?new Date(tripDetail.departureTime).toLocaleDateString('vi-VN'):new Date().toLocaleDateString('vi-VN');
  const agentName = tripDetail?.trip.busAgent.name||'Phương Trang';
  const agentRating = tripDetail?.trip.busAgent.rating||4.8;
  const busClass = tripDetail?.trip.busClass||'Limousine 22 chỗ';
  // "Giá vé từ" on the trip card is the cheapest fare on the bus, not just the first generated seat.
  const seatPrice = seats.length ? Math.min(...seats.map(s=>s.price)) : 155000;
  const avgSelectedSeatPrice = selectedSeats.length ? Math.round(seatsTotal/selectedSeats.length) : seatPrice;

  const validatePassengers=():string|null=>{
    for(let i=0;i<passengers.length;i++){
      const p=passengers[i];
      const label=`Hành khách ${i+1}`;
      if(!p.name.trim()) return `${label}: vui lòng nhập họ tên`;
      if(!p.phone.trim()) return `${label}: vui lòng nhập số điện thoại`;
      if(!/^0\d{9}$/.test(p.phone.trim())) return `${label}: số điện thoại phải có đúng 10 số và bắt đầu bằng 0`;
      if(p.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email.trim())) return `${label}: email không hợp lệ (phải có dạng ten@example.com)`;
      if(!p.idNumber.trim()) return `${label}: vui lòng nhập số CMND/CCCD`;
      if(!/^\d{9}(\d{3})?$/.test(p.idNumber.trim())) return `${label}: số CMND/CCCD phải có 9 hoặc 12 chữ số`;
      if(p.dob){
        const dobDate=new Date(p.dob);
        const today=new Date();
        if(Number.isNaN(dobDate.getTime())) return `${label}: ngày sinh không hợp lệ`;
        if(dobDate>today) return `${label}: ngày sinh không thể ở tương lai`;
        const age=(today.getTime()-dobDate.getTime())/(365.25*24*3600*1000);
        if(age>120) return `${label}: ngày sinh không hợp lệ (tuổi vượt quá 120)`;
      }
    }
    return null;
  };

  const handleContinue=()=>{
    if(selectedSeats.length===0){toast.error('Chọn ít nhất 1 ghế');return;}
    if(step==='seat'){setStep('info');return;}
    const validationError=validatePassengers();
    if(validationError){toast.error(validationError);return;}
    const pickupLabel = pickupOpts.find(c=>c.id===pickupPoint)?.station.name||'';
    const dropoffLabel = dropoffOpts.find(c=>c.id===dropoffPoint)?.station.name||'';
    const primary = passengers[0];
    const bookingData={tripScheduleId,seats:selectedSeats,seatsTotal,totalAmount:seatsTotal+amenitiesTotal,pickupPoint,dropoffPoint,pickupLabel,dropoffLabel,routeLabel:`${depCity} → ${arrCity}`,busAgentName:agentName,addInsurance:false,insuranceFee:0,needVAT:false,passengerInfo:{name:primary.name,phone:primary.phone,email:primary.email},bookerInfo:null,passengers,amenities:{nuocSuoi:amenityQty.water,khanLanh:amenityQty.towel,goiTuaCo:amenityQty.pillow,oCamUSB:usbSelected},amenitiesTotal,notes};
    sessionStorage.setItem('pending_booking',JSON.stringify(bookingData));
    localStorage.setItem('pending_booking',JSON.stringify(bookingData));
    proceedingRef.current = true;
    navigate('/payment');
  };

  const stepIdx = step==='seat' ? 2 : 3;

  return (
    <div className="h-screen bg-[#F8F9FA] text-[#212529] font-['Be_Vietnam_Pro',_sans-serif] flex overflow-hidden">
      {/* ── SLIM ICON SIDEBAR ── */}
      {!isMobile && (
        <div className="w-[80px] bg-white border-r border-[#DEE2E6] flex flex-col items-center py-6 gap-8 shrink-0 z-50">
          <Link to="/search" className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 bg-[rgba(255,193,7,0.1)] rounded-xl flex items-center justify-center text-[#FFC107]">
              <Search size={18} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-medium text-[#FFC107]">Tìm vé</span>
          </Link>
          {[{icon:Ticket,label:'Vé của tôi',to:'/my-bookings'},{icon:Tag,label:'Ưu đãi',to:'/offers'}].map((item,i)=>(
            <Link key={i} to={item.to} className="flex flex-col items-center gap-1 text-[#6C757D] hover:text-[#212529] transition-colors">
              <div className="w-10 h-10 flex items-center justify-center"><item.icon size={18} /></div>
              <span className="text-[10px] font-medium text-center">{item.label}</span>
            </Link>
          ))}
          <div className="flex-1" />
          <Link to="/contact" className="flex flex-col items-center gap-1 text-[#6C757D] hover:text-[#212529] transition-colors">
            <div className="w-10 h-10 flex items-center justify-center"><HelpCircle size={18} /></div>
            <span className="text-[10px] font-medium">Trợ giúp</span>
          </Link>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      {/* ── TOPBAR ── */}
      <BookingStepper
        activeStep={stepIdx as 2|3}
        isMobile={isMobile}
        leftSlot={
          <Link to="/" className="flex items-center gap-2 shrink-0 mr-6">
            <ArrowLeft size={16} className="text-[#6C757D]" />
            <span className="font-bold text-base text-[#212529] hidden sm:inline">An Chuyến</span>
          </Link>
        }
      />

      {/* ── SEAT STEP: 12-col grid matching Figma ── */}
      {step === 'seat' ? (
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <style>{`
            .seat-step-grid {
              display: grid;
              gap: 1.5rem;
              grid-template-columns: 1fr;
              grid-template-areas: "trip" "seat" "extra" "right" "selected";
              align-items: start;
            }
            .seat-col1-wrapper { display: contents; }
            @media (min-width: 1024px) {
              .seat-step-grid {
                grid-template-columns: 3fr 6fr 3fr;
                /* Only one row: col1 is a single self-contained block (not synced
                   row-by-row with seat/right), so its height never affects — and is
                   never inflated by — the taller seat map / right column. */
                grid-template-areas: "col1 seat right";
              }
              .seat-col1-wrapper {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                grid-area: col1;
              }
            }
          `}</style>
          <div className="seat-step-grid max-w-[1400px] mx-auto">

            {/* Center Column: Seat Map — a sibling grid item (not part of seat-col1-wrapper) so its tall content never inflates the wrapper's rows */}
            <div style={{ gridArea: 'seat' }} className="bg-white border border-[rgba(222,226,230,0.5)] shadow-[0_2px_8px_rgba(0,0,0,0.05)] rounded-2xl p-6 flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <button onClick={()=>navigate('/search')} className="w-10 h-10 rounded-full border border-[#DEE2E6] flex items-center justify-center text-[#212529] hover:bg-[#F8F9FA] transition shrink-0">
                  <ArrowLeft size={14}/>
                </button>
                <h3 className="text-xl font-bold text-[#212529] truncate">Chọn ghế {busClass}</h3>
              </div>

              <div className="flex flex-wrap items-center gap-3 mb-8">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white border border-[#DEE2E6] text-[#212529]">
                  <Users size={14} className="text-[#6C757D]"/> {seats.length} ghế
                </div>
                {floorCount > 1 && [1,2].map(f=> floorFromPrice[f]!=null && (
                  <div key={f} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white border border-[#DEE2E6] text-[#212529]">
                    <Layers size={14} className="text-[#6C757D]"/>
                    <span>Tầng {f===1?'dưới':'trên'} từ <span className="font-bold text-[#856404]">{fmt(floorFromPrice[f])}đ</span></span>
                  </div>
                ))}
              </div>

              <div className="flex-1 flex flex-col items-center gap-6 overflow-auto">
                <div className="flex items-center justify-center gap-6 flex-wrap">
                  {[{selected:false,booked:false,vip:true,label:'VIP'},{selected:true,booked:false,vip:false,label:'Đã chọn'},{selected:false,booked:true,vip:false,label:'Đã đặt'},{selected:false,booked:false,vip:false,label:'Trống'}].map((l,i)=>(
                    <div key={i} className="flex items-center gap-1.5">
                      <LegendDot selected={l.selected} booked={l.booked} vip={l.vip} size={16}/>
                      <span className="text-xs text-[#6C757D]">{l.label}</span>
                    </div>
                  ))}
                </div>

                {/* Both floors shown side by side (per user request) instead of a floor toggle — each in its own framed card */}
                <div className="w-full flex items-start justify-center gap-6 py-4 px-4 overflow-x-auto">
                  {(floorCount > 1 ? [1,2] : [1]).map(f => {
                    const info = getFloorInfo(f);
                    return (
                      <div key={f} className="flex flex-col items-center gap-4 shrink-0 bg-[#FAFAFA] border border-[#DEE2E6] rounded-2xl pt-5 pb-6 px-6">
                        <div className="text-center">
                          <div className="text-xs font-bold uppercase tracking-wide text-[#212529]">Tầng {f===1?'1':'2'} <span className="text-[#ADB5BD] font-normal normal-case">({f===1?'1st':'2nd'} floor)</span></div>
                        </div>
                        <SeatMap seats={info.seats} selectedSeats={selectedSeats} onToggle={toggleSeat} seatSize={52}/>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-center mt-4">
                <div className="flex items-center gap-2 text-sm text-[#6C757D] bg-[#F8F9FA] border border-[#DEE2E6] rounded-full px-6 py-2.5">
                  <Info size={14} className="text-[#ADB5BD]"/> Nhấn vào ghế để chọn hoặc bỏ chọn
                </div>
              </div>
            </div>

            {/* Trip Summary + Legend/Guarantee + Selected — mobile: independently orderable grid items (see areas above); desktop: merged into one flex column via .seat-col1-wrapper so its height is fully independent of the seat map / right column. */}
            <div className="seat-col1-wrapper">
            <div style={{ gridArea: 'trip' }} className="flex flex-col gap-4">
              <div className="bg-white border border-[rgba(222,226,230,0.5)] shadow-[0_2px_4px_rgba(0,0,0,0.05)] rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-lg font-bold text-[#212529] leading-snug">{depCity} <ArrowRight size={14} className="inline mx-1 text-[#6C757D]"/> {arrCity}</div>
                  <button onClick={()=>navigate('/search')} className="shrink-0 flex items-center gap-1 text-xs font-medium text-[#212529] border border-[#DEE2E6] rounded-lg px-3 py-1.5 hover:bg-[#F8F9FA] transition-colors">
                    <PenLine size={11}/> Thay đổi
                  </button>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-[#6C757D]">
                  <span>{depDate}</span><span className="text-[#DEE2E6]">•</span><span>{depTime}</span><span className="text-[#DEE2E6]">•</span><span>{busClass}</span>
                </div>
                <div className="border-t border-[#DEE2E6] pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium text-[#212529]">
                    <Bus size={16} className="text-[#6C757D]"/> {agentName}
                    <span className="flex items-center gap-0.5 text-xs font-bold text-[#212529]"><Star size={11} className="fill-[#FFC107] text-[#FFC107]"/> {agentRating}</span>
                  </div>
                  <div className="text-lg font-bold text-[#DC3545]">{fmt(seatPrice)}đ</div>
                </div>
              </div>
            </div>

            {/* Legend + Guarantee — mobile: after seat map; desktop: below trip summary */}
            <div style={{ gridArea: 'extra' }} className="flex flex-col gap-4">
              {/* Legend */}
              <div className="bg-white border border-[rgba(222,226,230,0.5)] shadow-[0_2px_4px_rgba(0,0,0,0.05)] rounded-2xl p-5 flex items-center justify-between">
                {[{selected:false,booked:false,vip:false,label:'Ghế trống'},{selected:true,booked:false,vip:false,label:'Ghế đã chọn'},{selected:false,booked:true,vip:false,label:'Ghế đã đặt'},{selected:false,booked:false,vip:true,label:'Ghế VIP'}].map((l,i)=>(
                  <div key={i} className="flex flex-col items-center gap-2">
                    <LegendDot selected={l.selected} booked={l.booked} vip={l.vip} size={32}/>
                    <div className="text-[11px] font-medium text-[#6C757D] text-center leading-tight max-w-[52px]">{l.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-[#EFF4FF] border border-[#CCDBF4] rounded-2xl p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0"><ShieldCheck size={16} className="text-[#2563EB]"/></div>
                <div>
                  <div className="text-sm font-bold text-[#212529]">Cam kết vị trí ghế</div>
                  <div className="text-xs text-[#6C757D] mt-1">Chúng tôi cam kết giữ đúng vị trí ghế bạn đã chọn.</div>
                </div>
              </div>
            </div>

            {/* Selected Seats Summary — always last: bottom of the page on mobile, bottom of left column on desktop */}
            {selectedSeats.length > 0 && (
              <div style={{ gridArea: 'selected' }}>
                <div className="bg-white border border-[rgba(222,226,230,0.5)] shadow-[0_2px_4px_rgba(0,0,0,0.05)] rounded-2xl p-5 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-bold text-[#212529]">Ghế bạn đã chọn ({selectedSeats.length})</div>
                    <button onClick={()=>setSelectedSeats([])} className="text-xs font-medium text-[#DC3545] hover:underline">Xóa tất cả</button>
                  </div>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {selectedSeats.map(id => {
                      const seat = seats.find(s => s.id === id);
                      return (
                        <div key={id} className="flex items-center gap-3 border border-[#DEE2E6] rounded-xl pl-3.5 pr-2 py-2.5 min-w-[220px] flex-1">
                          <div className="flex-1">
                            <div className="text-base font-bold text-[#212529] leading-tight">{labelFor(id)}</div>
                            <div className="text-sm text-[#6C757D] leading-tight mt-0.5">{fmt(seat?.price||0)}đ</div>
                          </div>
                          <button onClick={()=>toggleSeat(id,'available')} className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[#ADB5BD] hover:bg-[#FEE2E2] hover:text-[#DC3545] transition-colors"><X size={13}/></button>
                        </div>
                      );
                    })}
                  </div>
                  <div className="border-t border-[#DEE2E6] pt-4 flex items-center justify-between mb-4">
                    <span className="text-base text-[#6C757D]">Tạm tính</span>
                    <span className="text-xl font-bold text-[#DC3545]">{fmt(seatsTotal)}đ</span>
                  </div>
                  <button onClick={handleContinue} className="w-full bg-[#FFC107] text-[#212529] text-base font-bold py-3.5 rounded-xl hover:brightness-95 transition-colors flex items-center justify-center gap-2">
                    Tiếp tục <ArrowRight size={14}/>
                  </button>
                </div>
              </div>
            )}
            </div>

            {/* Right Column: Details & Help — a sibling grid item (not part of seat-col1-wrapper), independent height from the left column */}
            <div style={{ gridArea: 'right' }} className="flex flex-col gap-6">
              <div className="bg-white border border-[rgba(222,226,230,0.5)] shadow-[0_2px_4px_rgba(0,0,0,0.05)] rounded-2xl p-5 flex flex-col gap-5">
                <h3 className="text-lg font-bold text-[#212529]">Thông tin chuyến đi</h3>
                <div className="relative pl-6 flex flex-col gap-6">
                  <div className="absolute left-[7px] top-2 bottom-2 w-0.5 border-l-2 border-dashed border-[#DEE2E6]" />
                  <div className="relative">
                    <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-[#28A745] border-2 border-white flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-white"/></div>
                    <div className="font-bold text-[#212529] text-base">{depCity}</div>
                    <div className="text-sm text-[#6C757D] mt-0.5">Bến xe {depCity}</div>
                    <div className="text-sm text-[#6C757D]">{depTime} - {depDate}</div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-white border-2 border-[#DC3545] flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-[#DC3545]"/></div>
                    <div className="font-bold text-[#212529] text-base">{arrCity}</div>
                    <div className="text-sm text-[#6C757D] mt-0.5">Bến xe {arrCity}</div>
                    <div className="text-sm text-[#6C757D]">~ {arrTime} - {depDate}</div>
                  </div>
                </div>
                <div className="border-t border-[#DEE2E6] pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-[#212529] text-base">Nhà xe {agentName}</span>
                    <span className="flex items-center gap-0.5 text-xs font-medium text-[#212529]"><Star size={11} className="fill-[#FFC107] text-[#FFC107]"/> {agentRating}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="bg-[#F8F9FA] border border-[#DEE2E6] text-[#6C757D] text-xs px-2.5 py-1.5 rounded">{busClass}</span>
                    <img src="/phuong-trang-bus.jpg" alt={agentName} className="w-16 h-10 rounded object-cover border border-[#DEE2E6]" />
                  </div>
                </div>
              </div>

              {selectedSeats.length > 0 && (
                <div className="bg-white border border-[rgba(222,226,230,0.5)] shadow-[0_2px_4px_rgba(0,0,0,0.05)] rounded-2xl p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-[#212529]">Ghế đã chọn</h3>
                    <button onClick={()=>{ const el = document.getElementById('seat-map-card'); el?.scrollIntoView({behavior:'smooth', block:'center'}); }} className="flex items-center gap-1 text-sm text-[#2563EB] hover:underline"><PenLine size={12}/> Sửa</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedSeats.map(id => (
                      <span key={id} className="bg-[rgba(255,193,7,0.2)] border border-[#FFC107] text-[#212529] text-sm font-semibold px-3.5 py-1.5 rounded-lg">{labelFor(id)}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white border border-[rgba(222,226,230,0.5)] shadow-[0_2px_4px_rgba(0,0,0,0.05)] rounded-2xl p-5 flex flex-col gap-4">
                <h3 className="text-base font-bold text-[#212529]">Tiện ích trên xe</h3>
                <div className="flex flex-col gap-3">
                  {[
                    { icon: <Droplets size={16} />, label: 'Nước suối miễn phí' },
                    { icon: <Wifi size={16} />, label: 'Wifi miễn phí' },
                    { icon: <Usb size={16} />, label: 'Ổ cắm sạc USB' },
                    { icon: <Snowflake size={16} />, label: 'Khăn lạnh' },
                    { icon: <Wind size={16} />, label: 'Điều hòa' },
                  ].map((a, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-[#212529] font-medium">
                      <span className="text-[#2563EB]">{a.icon}</span>
                      {a.label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-[rgba(222,226,230,0.5)] shadow-[0_2px_4px_rgba(0,0,0,0.05)] rounded-2xl p-5">
                <div className="font-bold text-[#212529] text-base mb-1">Cần hỗ trợ?</div>
                <div className="text-sm text-[#6C757D] mb-4">Đội ngũ An Chuyến luôn sẵn sàng hỗ trợ bạn 24/7.</div>
                <a href="tel:19001234" className="flex items-center justify-center gap-2 border border-[#FFC107] text-[#212529] text-sm font-bold py-3 rounded-xl hover:bg-[#FFF3CD]/40 transition-colors">
                  <Phone size={14} /> 1900 1234
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
      /* ── PASSENGER INFO STEP (Figma node 9:420 — Tailwind-gray palette) ── */
      <div className="flex-1 overflow-y-auto bg-[#F3F4F6]">
        <AnimatePresence mode="wait">
        <motion.div key="info" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} className="flex flex-col lg:flex-row gap-8 max-w-[1280px] mx-auto p-4 lg:p-8">

          {/* ── LEFT COLUMN: Forms ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <button onClick={()=>setStep('seat')} className="w-10 h-10 rounded-full border border-[#E5E7EB] bg-white flex items-center justify-center text-[#111827] hover:bg-[#F9FAFB] transition shrink-0">
                <ArrowLeft size={18}/>
              </button>
              <h2 className="text-2xl font-bold text-[#111827]">Nhập thông tin hành khách</h2>
            </div>

            <div className="bg-[#FEFCE8] border border-[#FEF9C3] rounded-lg p-[17px] flex items-start gap-3">
              <ShieldCheck size={20} className="text-[#CA8A04] shrink-0 mt-0.5"/>
              <span className="text-sm text-[#374151]">Thông tin của bạn được bảo mật và chỉ sử dụng cho việc đặt vé.</span>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-3">
              <h3 className="text-lg font-bold text-[#111827]">Hành khách ({passengers.length})</h3>
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#6B7280]">Đăng nhập để tự động điền thông tin</span>
                <button type="button" className="border border-[#D1D5DB] rounded-lg px-[17px] py-[9px] text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors">Đăng nhập</button>
              </div>
            </div>

            {passengers.map((p, idx) => {
              const copying = copyFromFirst[idx];
              const disabled = idx>0 && copying;
              return (
                <div key={idx} className="bg-white border border-[#E5E7EB] shadow-[0_1px_1px_rgba(0,0,0,0.05)] rounded-xl p-[25px] flex flex-col gap-6">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <h4 className="text-base font-bold text-[#111827]">Hành khách {idx+1} <span className="font-normal text-[#6B7280]">(Người lớn)</span></h4>
                    <div className="flex items-center gap-4">
                      {idx>0 && (
                        <label className="flex items-center gap-2 text-sm text-[#4B5563] cursor-pointer">
                          <input type="checkbox" checked={copying} onChange={()=>toggleCopyFirst(idx)} className="w-4 h-4 rounded border-[#D1D5DB] accent-[#FFC107]"/>
                          Sao chép thông tin hành khách 1
                        </label>
                      )}
                      {selectedSeats.length>1 && (
                        <button onClick={()=>removePassenger(idx)} className="p-1.5 rounded-md text-[#EF4444] hover:bg-red-50 transition-colors"><Trash2 size={18}/></button>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="sm:col-span-2"><TextField label="Họ và tên" required disabled={disabled} value={p.name} onChange={v=>updatePassenger(idx,'name',v)} placeholder="Nhập họ tên"/></div>
                    <TextField label="Số điện thoại" required disabled={disabled} value={p.phone} onChange={v=>updatePassenger(idx,'phone',v)} placeholder="Nhập SĐT (10 số)" type="tel" inputMode="tel" maxLength={10}/>
                    <SelectField label="Giới tính" disabled={disabled} value={p.gender} onChange={v=>updatePassenger(idx,'gender',v)} options={['Nam','Nữ','Khác']}/>
                    <div className="sm:col-span-2"><TextField label="Email (để nhận vé)" disabled={disabled} value={p.email} onChange={v=>updatePassenger(idx,'email',v)} placeholder="ten@example.com" type="email"/></div>
                    <DateField label="Ngày sinh" disabled={disabled} value={p.dob} onChange={v=>updatePassenger(idx,'dob',v)}/>
                    <TextField label="CMND/CCCD" required disabled={disabled} value={p.idNumber} onChange={v=>updatePassenger(idx,'idNumber',v)} placeholder="9 hoặc 12 số" inputMode="numeric" maxLength={12}/>
                    <SelectField label="Quốc tịch" disabled={disabled} value={p.nationality} onChange={v=>updatePassenger(idx,'nationality',v)} options={['Việt Nam','Khác']}/>
                  </div>
                </div>
              );
            })}

            {/* Add-ons */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-bold text-[#111827]">Tiện ích & Yêu cầu thêm</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { key:'water' as const, icon:<Droplets size={18}/>, title:'Nước suối', desc:'10.000đ / chai' },
                  { key:'towel' as const, icon:<Snowflake size={18}/>, title:'Khăn lạnh', desc:'5.000đ / cái' },
                  { key:'pillow' as const, icon:<Armchair size={18}/>, title:'Gối tựa cổ', desc:'30.000đ / cái' },
                ].map(a=>{
                  const qty = amenityQty[a.key];
                  const active = qty>0;
                  return (
                    <div key={a.key} className={`relative bg-white rounded-xl p-[18px] flex flex-col justify-between gap-4 shadow-[0_1px_1px_rgba(0,0,0,0.05)] ${active ? 'border-2 border-[#FFC107]' : 'border border-[#E5E7EB]'}`}>
                      <div
                        onClick={()=>setAmenityQty(q=>({...q, [a.key]: q[a.key]>0?0:1}))}
                        className={`absolute left-[11px] top-[15px] w-[22px] h-[22px] rounded flex items-center justify-center cursor-pointer transition-colors ${active ? 'bg-[#FFC107]' : 'bg-white border border-[#D1D5DB]'}`}
                      >
                        {active && <Check size={14} className="text-[#111827]" strokeWidth={3}/>}
                      </div>
                      <div className="pl-8">
                        <div className="text-sm font-semibold text-[#111827]">{a.title}</div>
                        <div className="text-xs text-[#6B7280]">{a.desc}</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="border border-[#E5E7EB] rounded-lg flex items-center overflow-hidden">
                          <button onClick={()=>setAmenityQty(q=>({...q,[a.key]:Math.max(0,q[a.key]-1)}))} className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:bg-[#F9FAFB] transition-colors"><Minus size={14}/></button>
                          <span className="w-8 text-center text-sm font-medium text-[#1F2937]">{qty}</span>
                          <button onClick={()=>setAmenityQty(q=>({...q,[a.key]:q[a.key]+1}))} className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:bg-[#F9FAFB] transition-colors"><Plus size={14}/></button>
                        </div>
                        <span className="text-[#6B7280]">{a.icon}</span>
                      </div>
                    </div>
                  );
                })}
                <div className={`relative bg-white rounded-xl p-[18px] flex flex-col justify-between gap-4 shadow-[0_1px_1px_rgba(0,0,0,0.05)] ${usbSelected ? 'border-2 border-[#FFC107]' : 'border border-[#E5E7EB]'}`}>
                  <div
                    onClick={()=>setUsbSelected(v=>!v)}
                    className={`absolute left-[11px] top-[15px] w-[22px] h-[22px] rounded flex items-center justify-center cursor-pointer transition-colors ${usbSelected ? 'bg-[#FFC107]' : 'bg-white border border-[#D1D5DB]'}`}
                  >
                    {usbSelected && <Check size={14} className="text-[#111827]" strokeWidth={3}/>}
                  </div>
                  <div className="pl-8">
                    <div className="text-sm font-semibold text-[#111827]">Ổ cắm USB</div>
                    <div className="text-xs text-[#6B7280]">Miễn phí</div>
                  </div>
                  <div className="flex items-center justify-end">
                    <Usb size={18} className="text-[#6B7280]"/>
                  </div>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="bg-white border border-[#E5E7EB] shadow-[0_1px_1px_rgba(0,0,0,0.05)] rounded-xl p-[25px] flex flex-col gap-2">
              <label className="text-sm font-medium text-[#374151]">Ghi chú (không bắt buộc)</label>
              <div className="relative">
                <textarea
                  value={notes}
                  maxLength={200}
                  onChange={e=>setNotes(e.target.value)}
                  placeholder="Nhập ghi chú hoặc yêu cầu đặc biệt (nếu có)..."
                  rows={3}
                  className="w-full bg-white border border-[#D1D5DB] rounded-lg px-[17px] py-[13px] pb-6 text-sm text-[#1F2937] outline-none focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 transition-all resize-none"
                />
                <span className="absolute bottom-3 right-3 text-xs text-[#9CA3AF]">{notes.length}/200</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2">
              <button onClick={()=>setStep('seat')} className="flex items-center gap-2 border border-[#D1D5DB] bg-white rounded-lg px-[25px] py-[13px] text-base font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors">
                <ArrowLeft size={20}/> Quay lại
              </button>
              <button onClick={handleContinue} className="flex items-center justify-center gap-2 bg-[#FFC107] rounded-lg px-8 py-3 text-base font-bold text-[#111827] hover:brightness-95 transition-colors w-full sm:w-[256px]">
                Tiếp tục <ArrowRight size={20}/>
              </button>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Summary ── */}
          <div className="w-full lg:w-[400px] shrink-0">
            <div className="lg:sticky lg:top-6 bg-white rounded-xl shadow-[0_1px_1.5px_rgba(0,0,0,0.1),0_1px_1px_rgba(0,0,0,0.06)] flex flex-col">

              <div className="border-b border-[#E5E7EB] p-5 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#111827]">Thông tin chuyến đi</h3>
                  <button onClick={()=>setStep('seat')} className="flex items-center gap-1 text-sm font-medium text-[#2563EB] hover:underline"><PenLine size={14}/> Sửa</button>
                </div>
                <div className="flex items-center gap-2 text-base font-bold text-[#111827] pt-2">
                  {depCity} <ArrowRight size={14} className="text-[#6B7280]"/> {arrCity}
                </div>
                <div className="text-sm text-[#6B7280]">{depDate} • {depTime} • {busClass}</div>

                <div className="relative flex flex-col gap-6 pl-6 py-5">
                  <div className="absolute bg-[#E5E7EB] left-[7px] top-[28px] bottom-[28px] w-0.5"/>
                  <div className="relative">
                    <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-white border-4 border-[#22C55E]"/>
                    <div className="text-sm font-bold text-[#111827]">{depCity}</div>
                    <div className="text-xs text-[#6B7280] mt-1">Bến xe {depCity}</div>
                    <div className="text-xs text-[#6B7280]">{depTime} - {depDate}</div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-white border-4 border-[#EF4444]"/>
                    <div className="text-sm font-bold text-[#111827]">{arrCity}</div>
                    <div className="text-xs text-[#6B7280] mt-1">Bến xe {arrCity}</div>
                    <div className="text-xs text-[#6B7280]">~ {arrTime} - {depDate}</div>
                  </div>
                </div>

                <div className="border-t border-[#F3F4F6] pt-[17px] flex items-center justify-between">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#111827]">Nhà xe {agentName}</span>
                      <span className="flex items-center gap-0.5 text-xs text-[#4B5563]"><Star size={12} className="fill-[#FFC107] text-[#FFC107]"/> {agentRating}</span>
                    </div>
                    <span className="bg-[#F3F4F6] text-[#6B7280] text-xs px-2 py-1 rounded w-fit">{busClass}</span>
                  </div>
                  <img src="/phuong-trang-bus.jpg" alt={agentName} className="w-20 h-11 rounded object-cover shrink-0"/>
                </div>
              </div>

              <div className="border-b border-[#E5E7EB] p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#111827]">Ghế đã chọn</h3>
                  <button onClick={()=>setStep('seat')} className="flex items-center gap-1 text-sm font-medium text-[#2563EB] hover:underline"><PenLine size={14}/> Sửa</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.map(id => (
                    <span key={id} className="bg-[#FEF9C3] border border-[#FDE047] text-[#854D0E] text-sm font-bold px-[13px] py-[5px] rounded-md">{labelFor(id)}</span>
                  ))}
                </div>
              </div>

              <div className="p-5 flex flex-col gap-3">
                <h3 className="text-sm font-bold text-[#111827]">Chi tiết thanh toán</h3>
                <div className="flex items-start justify-between">
                  <div className="text-sm text-[#4B5563]">{passengers.length} Vé người lớn</div>
                  <div className="text-xs text-[#6B7280]">{passengers.length} x {fmt(avgSelectedSeatPrice)}đ</div>
                  <div className="text-sm font-medium text-[#111827]">{fmt(seatsTotal)}đ</div>
                </div>
                {amenityQty.water>0 && (
                  <div className="flex items-start justify-between">
                    <div className="text-sm text-[#4B5563]">Nước suối ({amenityQty.water} chai)</div>
                    <div className="text-xs text-[#6B7280]">{amenityQty.water} x {fmt(AMENITY_PRICES.water)}đ</div>
                    <div className="text-sm font-medium text-[#111827]">{fmt(amenityQty.water*AMENITY_PRICES.water)}đ</div>
                  </div>
                )}
                {amenityQty.towel>0 && (
                  <div className="flex items-start justify-between">
                    <div className="text-sm text-[#4B5563]">Khăn lạnh ({amenityQty.towel} cái)</div>
                    <div className="text-xs text-[#6B7280]">{amenityQty.towel} x {fmt(AMENITY_PRICES.towel)}đ</div>
                    <div className="text-sm font-medium text-[#111827]">{fmt(amenityQty.towel*AMENITY_PRICES.towel)}đ</div>
                  </div>
                )}
                {amenityQty.pillow>0 && (
                  <div className="flex items-start justify-between">
                    <div className="text-sm text-[#4B5563]">Gối tựa cổ ({amenityQty.pillow} cái)</div>
                    <div className="text-xs text-[#6B7280]">{amenityQty.pillow} x {fmt(AMENITY_PRICES.pillow)}đ</div>
                    <div className="text-sm font-medium text-[#111827]">{fmt(amenityQty.pillow*AMENITY_PRICES.pillow)}đ</div>
                  </div>
                )}
                <div className="border-t border-[#E5E7EB] pt-3 flex items-center justify-between">
                  <span className="text-base font-bold text-[#111827]">Tổng tiền</span>
                  <span className="text-xl font-bold text-[#DC2626]">{fmt(seatsTotal+amenitiesTotal)}đ</span>
                </div>
                <div className="bg-[#F0FDF4] rounded-lg px-4 py-3 flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} className="text-[#16A34A]"/>
                  <span className="text-sm font-medium text-[#166534]">Bảo mật thanh toán tuyệt đối</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[
                    { icon:<Ticket size={18}/>, label:'Hủy vé dễ dàng' },
                    { icon:<Phone size={18}/>, label:'Hỗ trợ 24/7' },
                    { icon:<Lock size={18}/>, label:'Thanh toán an toàn' },
                  ].map((t,i)=>(
                    <div key={i} className="flex flex-col items-center gap-1.5 text-center">
                      <span className="text-[#9CA3AF]">{t.icon}</span>
                      <span className="text-[11px] text-[#6B7280] leading-tight">{t.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        </AnimatePresence>
      </div>
      )}
      </div>
    </div>
  );
}
