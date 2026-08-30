import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, Shield, FileText, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import api from '../../../lib/api';

interface SeatData {
  id: string; floor: number; status: 'available' | 'booked' | 'blocked'; price: number;
}
interface CheckpointData {
  id: string; type: 'PICKUP' | 'DROPOFF'; time: string;
  station: { id: string; name: string; city?: { name: string } };
}
interface TripScheduleDetail {
  id: string; departureTime: string; arrivalTime: string;
  trip: { busClass: string; busAgent: { name: string; rating: number }; route: { departureCity: { name: string }; arrivalCity: { name: string } }; basePrice?: number };
  checkpoints: CheckpointData[];
}

function parseSeatId(id: string) {
  const m = id.match(/^T(\d+)-(\d+)([A-Z]+)$/);
  if (!m) return null;
  return { floor: parseInt(m[1]), row: parseInt(m[2]), col: m[3] };
}

function generateMockSeats(): SeatData[] {
  const booked = new Set(['T1-1A','T1-2B','T1-4A','T1-4B','T1-5C','T1-6B','T1-3A','T2-1B','T2-3A','T2-3C','T2-5B','T2-6C','T2-7A']);
  return [1,2].flatMap(floor =>
    ['A','B','C'].flatMap(col =>
      Array.from({length:7},(_,i)=>i+1).map(row => {
        const id=`T${floor}-${row}${col}`;
        return {id, floor, status: booked.has(id)?'booked':'available' as const, price: floor===2?185000:155000};
      })
    )
  );
}

// ─── SEAT ICON SVG ────────────────────────────────────────────────────────────
function SeatIcon({ selected, booked, size=44 }: { selected: boolean; booked: boolean; size?: number }) {
  const fill = booked ? 'rgba(0,0,0,0.06)' : selected ? 'rgba(22,51,40,0.22)' : 'rgba(0,0,0,0.08)';
  const stroke = booked ? 'rgba(0,0,0,0.08)' : selected ? '#163328' : 'rgba(0,0,0,0.35)';
  const inner = booked ? 'rgba(0,0,0,0.03)' : selected ? 'rgba(22,51,40,0.18)' : 'rgba(0,0,0,0.05)';
  const s = size;
  return (
    <svg width={s} height={s+10} viewBox={`0 0 44 54`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Headrest */}
      <rect x="6" y="1" width="32" height="10" rx="5" fill={fill} stroke={stroke} strokeWidth="1.2"/>
      {/* Backrest */}
      <rect x="4" y="13" width="36" height="24" rx="4" fill={fill} stroke={stroke} strokeWidth="1.2"/>
      {/* Inner padding */}
      <rect x="8" y="17" width="28" height="16" rx="2" fill={inner}/>
      {/* Armrests */}
      <rect x="0" y="15" width="5" height="18" rx="2.5" fill={fill} stroke={stroke} strokeWidth="1"/>
      <rect x="39" y="15" width="5" height="18" rx="2.5" fill={fill} stroke={stroke} strokeWidth="1"/>
      {/* Seat cushion */}
      <rect x="4" y="39" width="36" height="14" rx="4" fill={fill} stroke={stroke} strokeWidth="1.2"/>
      <rect x="8" y="42" width="28" height="8" rx="2" fill={inner}/>
      {/* Selected check */}
      {selected && (
        <circle cx="37" cy="7" r="5" fill="#163328">
          <animate attributeName="r" from="3" to="5" dur="0.2s" fill="freeze"/>
        </circle>
      )}
      {selected && (
        <path d="M34.5 7L36.5 9L39.5 5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      )}
    </svg>
  );
}

// ─── SEAT MAP ─────────────────────────────────────────────────────────────────
function SeatMap({ seats, selectedSeats, onToggle }: { seats: SeatData[]; selectedSeats: string[]; onToggle: (id: string, status: string) => void }) {
  if (!seats.length) return <div className="text-gray-400 text-xs py-10 text-center font-medium">Không có dữ liệu ghế</div>;

  const parsed = seats.map(s=>({...s, p:parseSeatId(s.id)})).filter(s=>s.p);
  const rows = [...new Set(parsed.map(s=>s.p!.row))].sort((a,b)=>a-b);
  const cols = [...new Set(parsed.map(s=>s.p!.col))].sort();
  const aisleAfter = cols.length>=3 ? 1 : -1;
  const SEAT = 48, GAP = 10, AISLE = 36;

  return (
    <div className="overflow-x-auto no-scrollbar">
      <div className="inline-block px-4">
        {/* Col headers */}
        <div className="flex pl-8 mb-2">
          {cols.map((col,ci)=>(
            <div key={col} className="flex">
              {ci===aisleAfter+1 && <div style={{width:AISLE}}/>}
              <div style={{width:SEAT, marginRight:ci<cols.length-1&&ci!==aisleAfter?GAP:0}} 
                className="text-center text-[10px] font-bold tracking-[0.2em] text-primary/50 uppercase">
                {col}
              </div>
            </div>
          ))}
        </div>
        {/* Rows */}
        {rows.map(rowNum=>(
          <div key={rowNum} className="flex items-center mb-2.5">
            <div className="w-6 mr-2 text-right text-[10px] text-gray-400 font-bold shrink-0">{rowNum}</div>
            {cols.map((col,ci)=>{
              const seat = parsed.find(s=>s.p!.row===rowNum&&s.p!.col===col);
              const sel = seat ? selectedSeats.includes(seat.id) : false;
              const avail = seat?.status==='available';
              return (
                <div key={col} className="flex items-center">
                  {ci===aisleAfter+1 && (
                    <div style={{width:AISLE}} className="flex items-center justify-center">
                      <div className="w-px h-14 bg-gray-100"/>
                    </div>
                  )}
                  <motion.div
                    whileHover={avail&&seat?{scale:1.05,y:-2}:{}}
                    whileTap={avail&&seat?{scale:0.95}:{}}
                    onClick={()=>seat&&avail&&onToggle(seat.id,seat.status)}
                    title={seat?(avail?`Ghế ${col}${rowNum} · ${(seat.price/1000).toFixed(0)}k₫`:'Đã bán'):''}
                    style={{
                      width:SEAT,
                      marginRight:ci<cols.length-1&&ci!==aisleAfter?GAP:0,
                    }}
                    className={`relative select-none flex flex-col items-center gap-0.5 transition-opacity ${
                      !seat ? 'opacity-0' : !avail ? 'opacity-40' : 'opacity-100'
                    } ${
                      !seat ? 'cursor-default' : avail ? 'cursor-pointer' : 'cursor-not-allowed'
                    }`}
                  >
                    {seat && (
                      <>
                        <SeatIcon selected={sel} booked={!avail} size={SEAT}/>
                        <span className={`text-[10px] font-bold tracking-wider leading-none mt-1 ${
                          sel ? 'text-primary' : avail ? 'text-gray-700' : 'text-gray-400'
                        }`}>
                          {col}{rowNum}
                        </span>
                        {avail&&!sel&&(
                          <span className="text-[9px] text-gray-400 font-medium">
                            {(seat.price/1000).toFixed(0)}k
                          </span>
                        )}
                        {sel && (
                          <motion.div
                            initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center shadow-md shadow-primary/30"
                          >
                            <Check size={10} color="#ffffff" strokeWidth={3.5}/>
                          </motion.div>
                        )}
                      </>
                    )}
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

function Field({ label, value, onChange, placeholder, type='text' }: { label:string; value:string; onChange:(v:string)=>void; placeholder:string; type?:string }) {
  const [f,setF]=useState(false);
  return (
    <div>
      <div className="text-[10px] text-gray-500 tracking-widest uppercase font-bold mb-3">{label}</div>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        onFocus={()=>setF(true)} onBlur={()=>setF(false)}
        className={`w-full border px-4 py-3.5 text-sm font-medium text-[#1a1a1a] outline-none transition-all rounded-xl ${
          f ? 'bg-primary/5 border-primary ring-2 ring-primary/10' : 'bg-white border-gray-200'
        }`} />
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export function SeatSelectionPage() {
  const navigate = useNavigate();
  const { tripScheduleId } = useParams<{ tripScheduleId: string }>();

  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  const [seats, setSeats] = useState<SeatData[]>(()=>generateMockSeats());
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [activeFloor, setActiveFloor] = useState(1);
  const [tripDetail, setTripDetail] = useState<TripScheduleDetail|null>(null);
  const [timeLeft, setTimeLeft] = useState(600);
  const [step, setStep] = useState<'seat'|'info'>('seat');
  const [addInsurance, setAddInsurance] = useState(false);
  const [needVAT, setNeedVAT] = useState(false);
  const [isSamePerson, setIsSamePerson] = useState(true);
  const [pName,setPName] = useState('');
  const [pPhone,setPPhone] = useState('');
  const [pEmail,setPEmail] = useState('');
  const [bName,setBName] = useState('');
  const [bPhone,setBPhone] = useState('');
  const [bEmail,setBEmail] = useState('');
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

  useEffect(()=>{
    if(!selectedSeats.length){setTimeLeft(600);return;}
    const iv=setInterval(()=>setTimeLeft(p=>{
      if(p<=1){clearInterval(iv);setSelectedSeats([]);setStep('seat');toast.error('Hết thời gian giữ chỗ!');return 600;}
      return p-1;
    }),1000);
    return()=>clearInterval(iv);
  },[selectedSeats.length>0]);

  const toggleSeat=(id:string,status:string)=>{
    if(status!=='available') return;
    if(selectedSeats.includes(id)){setSelectedSeats(p=>p.filter(s=>s!==id));return;}
    if(selectedSeats.length>=4){toast.error('Tối đa 4 ghế');return;}
    setSelectedSeats(p=>[...p,id]);
  };

  const seatsTotal = selectedSeats.reduce((s,id)=>s+(seats.find(x=>x.id===id)?.price||0),0);
  const insuranceFee = addInsurance?selectedSeats.length*20000:0;
  const total = seatsTotal+insuranceFee;
  const fmt = (n:number)=>new Intl.NumberFormat('vi-VN').format(n);

  const floorSeats = seats.filter(s=>s.floor===activeFloor);
  const floorCount = seats.length?Math.max(...seats.map(s=>s.floor)):2;
  const availCount = seats.filter(s=>s.floor===activeFloor&&s.status==='available').length;
  const bookedCount = seats.filter(s=>s.floor===activeFloor&&s.status==='booked').length;

  const depCity = tripDetail?.trip.route.departureCity.name||'TP.HCM';
  const arrCity = tripDetail?.trip.route.arrivalCity.name||'Hà Nội';
  const depTime = tripDetail?new Date(tripDetail.departureTime).toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'}):'10:00';
  const arrTime = tripDetail?new Date(tripDetail.arrivalTime).toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'}):'22:00';
  const agentName = tripDetail?.trip.busAgent.name||'Phương Trang';
  const busClass = tripDetail?.trip.busClass||'EXECUTIVE';

  const handleContinue=()=>{
    if(selectedSeats.length===0){toast.error('Chọn ít nhất 1 ghế');return;}
    if(step==='seat'){setStep('info');window.scrollTo({top:0,behavior:'smooth'});return;}
    if(!pName||!pPhone||!pEmail){toast.error('Điền đủ thông tin hành khách');return;}
    const pickupLabel = pickupOpts.find(c=>c.id===pickupPoint)?.station.name||'';
    const dropoffLabel = dropoffOpts.find(c=>c.id===dropoffPoint)?.station.name||'';
    const bookingData={tripScheduleId,seats:selectedSeats,seatsTotal,totalAmount:total,pickupPoint,dropoffPoint,pickupLabel,dropoffLabel,routeLabel:`${depCity} → ${arrCity}`,busAgentName:agentName,addInsurance,insuranceFee,needVAT,passengerInfo:{name:pName,phone:pPhone,email:pEmail},bookerInfo:isSamePerson?null:{name:bName,phone:bPhone,email:bEmail}};
    sessionStorage.setItem('pending_booking',JSON.stringify(bookingData));
    localStorage.setItem('pending_booking',JSON.stringify(bookingData));
    navigate('/booking-review');
  };

  const pct = (bookedCount/(floorSeats.length||1))*100;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">

      {/* ── TOPBAR ── */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 lg:gap-6 min-w-0 overflow-hidden">
            <Link to="/search" className="flex items-center justify-center w-10 h-10 border border-gray-200 rounded-full text-muted-foreground hover:bg-gray-50 hover:text-primary transition-colors shrink-0">
              <ArrowLeft size={16}/>
            </Link>
            
            <div className="flex items-center gap-3 overflow-hidden min-w-0">
              <span className="font-bold text-sm md:text-base whitespace-nowrap text-[#1a1a1a]">{depCity}</span>
              <div className="flex items-center gap-2 shrink-0 opacity-60">
                <div className="w-8 h-[1.5px] bg-primary rounded-full"/>
                <ArrowRight size={14} className="text-primary"/>
              </div>
              <span className="font-bold text-sm md:text-base whitespace-nowrap text-[#1a1a1a]">{arrCity}</span>
              
              {!isMobile && (
                <>
                  <div className="w-px h-6 bg-gray-200 mx-2" />
                  <span className="text-xs font-medium text-muted-foreground bg-gray-50 border border-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
                    {depTime} → {arrTime}
                  </span>
                  <span className="text-[10px] font-bold text-primary bg-primary/5 border border-primary/10 px-3 py-1 rounded-full uppercase tracking-widest whitespace-nowrap">
                    {busClass}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Steps */}
          <div className="flex items-center gap-0 shrink-0">
            {[{k:'seat',l:'Ghế'},{k:'info',l:'Thông tin'},{k:'pay',l:'Thanh toán'}].map((s,i)=>{
              const active=step===s.k;
              const done=(s.k==='seat'&&step==='info');
              return(
                <div key={s.k} className="flex items-center">
                  {i>0 && <div className={`w-4 md:w-8 h-px mx-1 md:mx-2 ${done ? 'bg-primary' : 'bg-gray-200'}`}/>}
                  <div className={`flex items-center gap-2 transition-opacity ${active ? 'opacity-100' : done ? 'opacity-80' : 'opacity-40'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${active ? 'bg-primary border-primary text-white' : done ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-white border-gray-300 text-gray-400'}`}>
                      {done ? <Check size={12} strokeWidth={3}/> : i+1}
                    </div>
                    {!isMobile && (
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${active ? 'text-[#1a1a1a]' : 'text-gray-500'}`}>
                        {s.l}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className={`max-w-7xl mx-auto px-4 md:px-6 lg:px-16 pb-24 lg:pb-12 pt-6 lg:pt-8 grid items-start gap-6 lg:gap-8 ${
        isMobile ? 'grid-cols-1' : 'grid-cols-[280px_1fr_300px] xl:grid-cols-[300px_1fr_320px]'
      }`}>

        {/* ══════ LEFT PANEL ══════ */}
        <div className={`flex flex-col gap-5 ${isMobile ? 'static' : 'sticky top-[86px]'}`}>

          {/* Route card */}
          <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.03)] relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none"/>
            <div className="text-[10px] text-gray-400 tracking-widest uppercase font-bold mb-4">Hành trình</div>
            
            <div className="flex gap-4 mb-4">
              <div className="flex flex-col items-center pt-1 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full border-2 border-primary bg-white z-10"/>
                <div className="w-px h-10 my-1 bg-gradient-to-b from-primary/50 to-primary/50" style={{ backgroundImage: 'repeating-linear-gradient(to bottom, rgba(22,51,40,0.5) 0, rgba(22,51,40,0.5) 4px, transparent 4px, transparent 8px)' }}/>
                <div className="w-2.5 h-2.5 rounded-full bg-primary z-10"/>
              </div>
              <div className="flex-1">
                <div className="text-xl font-bold leading-none text-[#1a1a1a]">{depCity}</div>
                <div className="text-xs text-gray-500 mt-1.5 mb-4 tracking-wide">{depTime} · Xuất phát</div>
                
                <div className="text-xl font-bold leading-none text-[#1a1a1a]">{arrCity}</div>
                <div className="text-xs text-gray-500 mt-1.5 tracking-wide">{arrTime} · Điểm đến</div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">{agentName}</span>
              <div className="flex items-center gap-1.5 bg-green-50 px-2 py-1 rounded text-green-700">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"/>
                <span className="text-[10px] tracking-wide font-medium">Đúng giờ</span>
              </div>
            </div>
          </div>

          {/* Occupancy */}
          <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] text-gray-400 tracking-widest uppercase font-bold">Tình trạng ghế</span>
              <span className="text-xs font-medium text-gray-500">{agentName.split(' ')[0]}</span>
            </div>
            {/* Occupancy bar */}
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
              <motion.div
                initial={{width:0}} animate={{width:`${pct}%`}}
                transition={{duration:1,ease:'easeOut',delay:0.3}}
                className="h-full bg-gradient-to-r from-primary/50 to-primary rounded-full"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                {label:'Trống',val:availCount,color:'text-gray-900', bg:'bg-gray-50'},
                {label:'Đã bán',val:bookedCount,color:'text-gray-400', bg:'bg-gray-50/50'},
                {label:'Chọn',val:selectedSeats.length,color:'text-primary', bg:'bg-primary/5 border border-primary/10'},
              ].map(item=>(
                <div key={item.label} className={`text-center py-2.5 rounded-xl ${item.bg}`}>
                  <div className={`text-xl font-bold leading-none ${item.color}`}>{item.val}</div>
                  <div className="text-[9px] text-gray-500 tracking-widest uppercase mt-1.5 font-medium">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Timer */}
          {selectedSeats.length > 0 && (
            <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} 
              className={`rounded-2xl p-4 flex items-center gap-3 border ${timeLeft<120 ? 'bg-red-50 border-red-100' : 'bg-primary/5 border-primary/10'}`}>
              <Clock size={18} className={timeLeft<120 ? 'text-red-500' : 'text-primary'}/>
              <div>
                <div className="text-[9px] text-gray-500 tracking-widest uppercase mb-0.5 font-medium">Giữ chỗ còn lại</div>
                <div className={`font-mono text-xl font-bold tracking-widest ${timeLeft<120 ? 'text-red-500' : 'text-primary'}`}>
                  {String(Math.floor(timeLeft/60)).padStart(2,'0')}:{String(timeLeft%60).padStart(2,'0')}
                </div>
              </div>
            </motion.div>
          )}

          {/* Add-ons */}
          <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
            <div className="text-[10px] text-gray-400 tracking-widest uppercase font-bold mb-4">Dịch vụ bổ sung</div>
            <div className="flex flex-col gap-3">
              {[
                {icon:<Shield size={16}/>, title:'Bảo hiểm hành trình', desc:'Tai nạn · Chậm trễ · Hành lý', note:'+20.000₫/ghế', active:addInsurance, toggle:()=>setAddInsurance(p=>!p)},
                {icon:<FileText size={16}/>, title:'Hóa đơn VAT', desc:'Xuất cho doanh nghiệp', note:'Miễn phí', active:needVAT, toggle:()=>setNeedVAT(p=>!p)},
              ].map((item,i)=>(
                <motion.div key={i} whileTap={{scale:0.98}} onClick={item.toggle} 
                  className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all relative overflow-hidden border ${
                    item.active ? 'bg-primary/5 border-primary/30' : 'bg-gray-50 border-transparent hover:bg-gray-100'
                  }`}>
                  {item.active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-primary/50" />}
                  <div className={`shrink-0 ${item.active ? 'text-primary' : 'text-gray-400'}`}>{item.icon}</div>
                  <div className="flex-1 min-w-0 pr-1">
                    <div className={`text-xs xl:text-sm font-bold mb-0.5 leading-tight ${item.active ? 'text-[#1a1a1a]' : 'text-gray-600'}`}>{item.title}</div>
                    <div className="text-[10px] xl:text-xs text-gray-400 leading-tight">{item.desc}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0 pl-2">
                    <div className={`w-4 h-4 xl:w-5 xl:h-5 rounded-[4px] xl:rounded-md border flex items-center justify-center transition-colors ${
                      item.active ? 'bg-primary border-primary' : 'bg-white border-gray-300'
                    }`}>
                      {item.active && <Check size={12} color="#ffffff" strokeWidth={3}/>}
                    </div>
                    <span className={`text-[8px] xl:text-[9px] tracking-wide font-medium whitespace-nowrap ${item.active ? 'text-primary' : 'text-gray-400'}`}>{item.note}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════ CENTER: SEAT MAP / FORM ══════ */}
        <AnimatePresence mode="wait">

          {/* STEP 1: SEAT */}
          {step==='seat'&&(
            <motion.div key="seat" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} transition={{duration:0.25}}>
              <div className="bg-white border border-gray-100 rounded-[32px] p-6 lg:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] relative overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold m-0 leading-none text-[#1a1a1a]">Sơ đồ ghế</h2>
                    <p className="mt-3 text-sm text-gray-500 font-medium">Chọn tối đa 4 ghế · Giá đã bao gồm phí dịch vụ</p>
                  </div>
                  {/* Floor tabs */}
                  {floorCount>1&&(
                    <div className="flex bg-gray-50 border border-gray-100 rounded-2xl p-1.5 gap-1 shadow-inner">
                      {Array.from({length:floorCount},(_,i)=>i+1).map(f=>(
                        <button key={f} onClick={()=>setActiveFloor(f)} 
                          className={`px-5 py-2.5 rounded-xl cursor-pointer outline-none border-none transition-all ${
                            activeFloor===f ? 'bg-white shadow-sm' : 'bg-transparent hover:bg-gray-100/50'
                          }`}>
                          <div className={`text-xs font-bold tracking-widest uppercase mb-1 transition-colors ${activeFloor===f ? 'text-primary' : 'text-gray-400'}`}>Tầng {f===1?'Dưới':'Trên'}</div>
                          <div className={`text-[10px] ${activeFloor===f ? 'text-gray-500' : 'text-gray-400'}`}>{seats.filter(s=>s.floor===f&&s.status==='available').length} trống</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-6 mb-10 pb-6 border-b border-gray-100 relative z-10">
                  {[
                    {bg:'bg-gray-100',border:'border-gray-300',label:'Còn trống'},
                    {bg:'bg-primary/20',border:'border-primary',label:'Đang chọn'},
                    {bg:'bg-gray-50',border:'border-gray-100',label:'Đã bán',dim:true},
                  ].map(l=>(
                    <div key={l.label} className={`flex items-center gap-2.5 ${l.dim ? 'opacity-50' : 'opacity-100'}`}>
                      <div className={`w-6 h-8 rounded-md border-2 ${l.bg} ${l.border}`}/>
                      <span className="text-xs font-medium text-gray-600">{l.label}</span>
                    </div>
                  ))}
                  <div className="ml-auto flex items-center gap-3">
                    <div className="text-xs font-medium text-gray-500">Giá từ</div>
                    <div className="text-xl font-bold text-primary">{(Math.min(...floorSeats.filter(s=>s.status==='available').map(s=>s.price))/1000).toFixed(0)}k₫</div>
                  </div>
                </div>

                {/* Bus shape + seats */}
                <div className="flex justify-center relative z-10">
                  <div className="relative">
                    {/* Bus SVG outline */}
                    <div className="bg-white border-2 border-gray-100 border-t-4 border-t-primary rounded-[24px_24px_12px_12px] px-4 md:px-10 pb-10 shadow-[0_30px_60px_rgba(0,0,0,0.05)] relative">
                      {/* Windshield */}
                      <div className="mx-[-16px] md:mx-[-40px] mb-8 py-4 border-b border-gray-100 flex items-center justify-between px-8 bg-gray-50/50 rounded-t-[20px]">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-5 border-2 border-gray-200 rounded-t-full bg-white"/>
                          <span className="text-[9px] tracking-[0.35em] uppercase font-bold text-gray-400">Buồng lái</span>
                        </div>
                        <div className="w-8 h-5 border-2 border-gray-200 rounded-t-full bg-white scale-x-[-1]"/>
                      </div>
                      
                      <SeatMap seats={floorSeats} selectedSeats={selectedSeats} onToggle={toggleSeat}/>
                      
                      {/* Exit markers */}
                      <div className="absolute -right-0.5 top-[40%] w-1.5 h-8 bg-green-400 rounded-l-md opacity-50" title="Cửa thoát hiểm"/>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: INFO */}
          {step==='info'&&(
            <motion.div key="info" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} transition={{duration:0.25}}>
              <div className="bg-white border border-gray-100 rounded-[32px] p-6 lg:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.04)] relative">
                
                <button onClick={()=>setStep('seat')} className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors text-xs font-bold uppercase tracking-wider mb-8 bg-transparent border-none cursor-pointer p-0">
                  <ArrowLeft size={14}/> Quay lại chọn ghế
                </button>
                
                <h2 className="text-3xl md:text-4xl font-bold m-0 mb-3 text-[#1a1a1a]">Thông tin hành khách</h2>
                <p className="text-sm text-gray-500 font-medium mb-8">Thông tin sẽ được in trên vé — vui lòng điền chính xác</p>

                {/* Pickup/dropoff */}
                <div className="bg-gray-50 rounded-2xl p-5 mb-8 border border-gray-100">
                  <div className="text-[10px] text-gray-400 tracking-widest uppercase font-bold mb-5">Điểm đón & trả khách</div>
                  <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    {[
                      {label:`Đón tại ${depCity}`,opts:pickupOpts,val:pickupPoint,set:setPickupPoint},
                      {label:`Trả tại ${arrCity}`,opts:dropoffOpts,val:dropoffPoint,set:setDropoffPoint},
                    ].map(f=>(
                      <div key={f.label}>
                        <div className="text-[10px] text-gray-500 tracking-widest mb-3 uppercase font-bold">{f.label}</div>
                        <select value={f.val} onChange={e=>f.set(e.target.value)} 
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium text-[#1a1a1a] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all">
                          {f.opts.length===0&&<option value="">—</option>}
                          {f.opts.map(cp=><option key={cp.id} value={cp.id}>{cp.station.name}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Passenger */}
                <div className="mb-8">
                  <div className="text-[10px] text-gray-400 tracking-widest uppercase font-bold mb-5">Thông tin người đi</div>
                  <div className={`grid gap-5 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    <Field label="Họ và tên *" value={pName} onChange={setPName} placeholder="Nguyễn Văn A"/>
                    <Field label="Số điện thoại *" value={pPhone} onChange={setPPhone} placeholder="09x xxxx xxxx"/>
                    <div className={isMobile?'col-span-1':'col-span-2'}>
                      <Field label="Email nhận vé *" value={pEmail} onChange={setPEmail} placeholder="email@example.com" type="email"/>
                    </div>
                  </div>
                </div>

                <motion.div whileTap={{scale:0.99}} onClick={()=>setIsSamePerson(p=>!p)} 
                  className={`flex items-center gap-3 cursor-pointer mb-6 p-4 rounded-2xl transition-all select-none border ${
                    isSamePerson ? 'bg-primary/5 border-primary/20' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                  }`}>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                    isSamePerson ? 'bg-primary border-primary' : 'bg-white border-gray-300'
                  }`}>
                    {isSamePerson&&<Check size={12} color="#fcfcfc" strokeWidth={3}/>}
                  </div>
                  <span className={`text-sm font-bold ${isSamePerson ? 'text-primary' : 'text-gray-500'}`}>Tôi là người trực tiếp lên xe</span>
                </motion.div>

                <AnimatePresence>
                  {!isSamePerson&&(
                    <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} className="overflow-hidden">
                      <div className="pt-6 border-t border-gray-100 mb-6">
                        <div className="text-[10px] text-gray-400 tracking-widest uppercase font-bold mb-5">Người đặt vé</div>
                        <div className={`grid gap-5 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                          <Field label="Họ và tên *" value={bName} onChange={setBName} placeholder="Nguyễn Văn B"/>
                          <Field label="Số điện thoại *" value={bPhone} onChange={setBPhone} placeholder="09x xxxx xxxx"/>
                          <div className={isMobile?'col-span-1':'col-span-2'}>
                            <Field label="Email xác nhận *" value={bEmail} onChange={setBEmail} placeholder="email@example.com" type="email"/>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══════ RIGHT PANEL ══════ */}
        <div className={isMobile ? 'fixed bottom-0 left-0 right-0 z-[200] bg-white/95 backdrop-blur-xl border-t border-gray-100 p-4 pb-6 flex flex-col gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.08)]' : 'sticky top-[86px] flex flex-col gap-5'}>

          {isMobile ? (
            /* ─ MOBILE: compact bottom bar ─ */
            <>
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {selectedSeats.length===0 ? (
                    <p className="m-0 text-sm font-medium text-gray-400">Chạm vào ghế để chọn</p>
                  ) : (
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                      <AnimatePresence>
                        {selectedSeats.map(id=>{
                          const p=parseSeatId(id);
                          return(
                            <motion.button key={id}
                              initial={{scale:0}} animate={{scale:1}} exit={{scale:0}}
                              onClick={()=>toggleSeat(id,'available')}
                              className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-lg px-2.5 py-1 cursor-pointer shrink-0"
                            >
                              <span className="text-sm font-bold text-primary">{p?`${p.col}${p.row}`:id}</span>
                              <X size={12} className="text-primary/50"/>
                            </motion.button>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] text-gray-400 tracking-widest uppercase font-bold">Tổng</div>
                  <div className="text-xl font-bold text-[#1a1a1a] leading-none">
                    {total>0?`${fmt(total)}₫`:'—'}
                  </div>
                </div>
              </div>
              <motion.button
                onClick={handleContinue}
                disabled={selectedSeats.length===0}
                whileTap={selectedSeats.length>0?{scale:0.97}:{}}
                className={`w-full rounded-xl py-3.5 px-4 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-colors ${
                  selectedSeats.length===0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-primary text-white cursor-pointer hover:bg-primary/90'
                }`}
              >
                {step==='seat'
                  ?selectedSeats.length===0?'Chọn ghế để tiếp tục':`Tiếp tục · ${selectedSeats.length} ghế`
                  :'Xác nhận đặt vé'}
                {selectedSeats.length>0&&<ArrowRight size={14}/>}
              </motion.button>
            </>
          ) : (
            /* ─ DESKTOP: full panel cards ─ */
            <>
              {/* Selected seats */}
              <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
                <div className="flex justify-between items-center mb-5">
                  <div className="text-[10px] text-gray-400 tracking-widest uppercase font-bold">Ghế đã chọn</div>
                  {selectedSeats.length>0&&<span className="text-[10px] font-bold text-gray-500 bg-gray-50 border border-gray-100 rounded-full px-2 py-0.5">{selectedSeats.length}/4</span>}
                </div>
                {selectedSeats.length===0?(
                  <div className="py-6 text-center">
                    <div className="w-12 h-14 mx-auto mb-3 bg-gray-50 border border-dashed border-gray-200 rounded-xl flex items-center justify-center opacity-60">
                      <span className="text-2xl">💺</span>
                    </div>
                    <div className="text-sm font-medium text-gray-400">Chưa chọn ghế nào<br/><span className="text-xs">Click vào ghế để chọn</span></div>
                  </div>
                ):(
                  <div className="flex flex-wrap gap-2">
                    <AnimatePresence>
                      {selectedSeats.map(id=>{
                        const s=seats.find(x=>x.id===id);
                        const p=parseSeatId(id);
                        return(
                          <motion.div key={id}
                            initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0,opacity:0}}
                            transition={{type:'spring',stiffness:400,damping:20}}
                            onClick={()=>toggleSeat(id,'available')}
                            title="Click để bỏ chọn"
                            className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-xl px-3 py-1.5 cursor-pointer hover:bg-primary/20 transition-colors"
                          >
                            <span className="text-sm font-bold text-primary">{p?`${p.col}${p.row}`:id}</span>
                            {s&&<span className="text-[10px] font-medium text-primary/70">{fmt(s.price)}đ</span>}
                            <X size={12} className="text-primary/50 ml-1"/>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between text-sm text-gray-500 font-medium">
                    <span>Vé xe · {selectedSeats.length} ghế</span>
                    <span className="text-[#1a1a1a]">{seatsTotal>0?`${fmt(seatsTotal)}₫`:'—'}</span>
                  </div>
                  {addInsurance&&selectedSeats.length>0&&(
                    <div className="flex justify-between text-sm text-gray-500 font-medium">
                      <span>Bảo hiểm hành trình</span><span className="text-[#1a1a1a]">{fmt(insuranceFee)}₫</span>
                    </div>
                  )}
                  <div className="h-px bg-gray-100 my-1"/>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tổng cộng</span>
                    <motion.span key={total} initial={{scale:1.1,color:'#f2c118'}} animate={{scale:1,color:'#1a1a1a'}} transition={{duration:0.3}}
                      className="text-3xl font-bold text-[#1a1a1a] leading-none">
                      {total>0?`${fmt(total)}₫`:'—'}
                    </motion.span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <motion.button
                onClick={handleContinue}
                disabled={selectedSeats.length===0}
                whileHover={selectedSeats.length>0?{scale:1.02,boxShadow:'0 10px 32px rgba(212,175,55,0.3)'}:{}}
                whileTap={selectedSeats.length>0?{scale:0.97}:{}}
                className={`w-full rounded-2xl py-4 px-4 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-3 transition-all ${
                  selectedSeats.length===0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-primary text-white cursor-pointer shadow-lg shadow-primary/20 hover:bg-primary/90'
                }`}
              >
                {step==='seat'
                  ?selectedSeats.length===0?'Chọn ghế để tiếp tục':`Tiếp tục · ${selectedSeats.length} ghế`
                  :'Xác nhận đặt vé'}
                {selectedSeats.length>0&&<ArrowRight size={16}/>}
              </motion.button>

              <p className="m-0 text-[10px] text-gray-400 text-center font-medium">
                Bằng cách tiếp tục bạn đồng ý với{' '}
                <span className="text-primary underline cursor-pointer hover:text-primary/80">điều khoản dịch vụ</span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
