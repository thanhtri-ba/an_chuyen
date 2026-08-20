import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, Shield, FileText, Check, ChevronRight, X } from 'lucide-react';
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
  const fill = booked ? 'rgba(255,255,255,0.06)' : selected ? 'rgba(212,175,55,0.22)' : 'rgba(255,255,255,0.08)';
  const stroke = booked ? 'rgba(255,255,255,0.08)' : selected ? '#d4af37' : 'rgba(255,255,255,0.22)';
  const inner = booked ? 'rgba(255,255,255,0.03)' : selected ? 'rgba(212,175,55,0.18)' : 'rgba(255,255,255,0.05)';
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
        <circle cx="37" cy="7" r="5" fill="#d4af37">
          <animate attributeName="r" from="3" to="5" dur="0.2s" fill="freeze"/>
        </circle>
      )}
      {selected && (
        <path d="M34.5 7L36.5 9L39.5 5" stroke="#0a0c0c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      )}
    </svg>
  );
}

// ─── SEAT MAP ─────────────────────────────────────────────────────────────────
function SeatMap({ seats, selectedSeats, onToggle }: { seats: SeatData[]; selectedSeats: string[]; onToggle: (id: string, status: string) => void }) {
  if (!seats.length) return <div style={{ color: 'rgba(255,255,255,0.2)', fontSize:12, padding:'40px 0', textAlign:'center' }}>Không có dữ liệu ghế</div>;

  const parsed = seats.map(s=>({...s, p:parseSeatId(s.id)})).filter(s=>s.p);
  const rows = [...new Set(parsed.map(s=>s.p!.row))].sort((a,b)=>a-b);
  const cols = [...new Set(parsed.map(s=>s.p!.col))].sort();
  const aisleAfter = cols.length>=3 ? 1 : -1;
  const SEAT = 48, GAP = 10, AISLE = 36;

  return (
    <div style={{overflowX:'auto'}}>
      <div style={{display:'inline-block'}}>
        {/* Col headers */}
        <div style={{display:'flex', paddingLeft:32, marginBottom:6}}>
          {cols.map((col,ci)=>(
            <div key={col} style={{display:'flex'}}>
              {ci===aisleAfter+1 && <div style={{width:AISLE}}/>}
              <div style={{width:SEAT, marginRight:ci<cols.length-1&&ci!==aisleAfter?GAP:0, textAlign:'center', fontSize:10, fontWeight:700, letterSpacing:'0.2em', color:'rgba(212,175,55,0.45)', fontFamily:'system-ui'}}>{col}</div>
            </div>
          ))}
        </div>
        {/* Rows */}
        {rows.map(rowNum=>(
          <div key={rowNum} style={{display:'flex', alignItems:'center', marginBottom:GAP}}>
            <div style={{width:24, marginRight:8, textAlign:'right', fontSize:9, color:'rgba(255,255,255,0.2)', fontFamily:'system-ui', flexShrink:0}}>{rowNum}</div>
            {cols.map((col,ci)=>{
              const seat = parsed.find(s=>s.p!.row===rowNum&&s.p!.col===col);
              const sel = seat ? selectedSeats.includes(seat.id) : false;
              const avail = seat?.status==='available';
              return (
                <div key={col} style={{display:'flex', alignItems:'center'}}>
                  {ci===aisleAfter+1 && (
                    <div style={{width:AISLE, display:'flex', alignItems:'center', justifyContent:'center'}}>
                      <div style={{width:1, height:54, background:'rgba(255,255,255,0.05)'}}/>
                    </div>
                  )}
                  <motion.div
                    whileHover={avail&&seat?{scale:1.08,y:-2}:{}}
                    whileTap={avail&&seat?{scale:0.95}:{}}
                    onClick={()=>seat&&avail&&onToggle(seat.id,seat.status)}
                    title={seat?(avail?`Ghế ${col}${rowNum} · ${(seat.price/1000).toFixed(0)}k₫`:'Đã bán'):''}
                    style={{
                      width:SEAT,
                      marginRight:ci<cols.length-1&&ci!==aisleAfter?GAP:0,
                      opacity: !seat?0:!avail?0.3:1,
                      cursor: !seat?'default':avail?'pointer':'not-allowed',
                      position:'relative',
                      userSelect:'none',
                      display:'flex', flexDirection:'column', alignItems:'center', gap:2,
                    }}
                  >
                    {seat && (
                      <>
                        <SeatIcon selected={sel} booked={!avail} size={SEAT}/>
                        <span style={{fontSize:9, fontWeight:700, fontFamily:'system-ui', color: sel?'#d4af37':avail?'rgba(255,255,255,0.45)':'rgba(255,255,255,0.15)', letterSpacing:'0.04em', lineHeight:1}}>
                          {col}{rowNum}
                        </span>
                        {avail&&!sel&&(
                          <span style={{fontSize:8, color:'rgba(255,255,255,0.25)', fontFamily:'system-ui'}}>
                            {(seat.price/1000).toFixed(0)}k
                          </span>
                        )}
                        {sel && (
                          <motion.div
                            initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}}
                            style={{position:'absolute', top:-4, right:-4, width:16, height:16, background:'#d4af37', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 8px rgba(212,175,55,0.6)'}}
                          >
                            <Check size={9} color="#0a0c0c" strokeWidth={3}/>
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
      <div style={{fontSize:9, color:'rgba(255,255,255,0.3)', fontFamily:'system-ui', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:7}}>{label}</div>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        onFocus={()=>setF(true)} onBlur={()=>setF(false)}
        style={{width:'100%', background: f?'rgba(212,175,55,0.04)':'transparent', border:'none', borderBottom:`1.5px solid ${f?'#d4af37':'rgba(255,255,255,0.1)'}`, padding:'9px 4px', color:'#f0ede6', fontSize:13, fontFamily:'system-ui', outline:'none', transition:'all 0.2s', boxSizing:'border-box', borderRadius:0}}/>
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
    const bookingData={tripScheduleId,seats:selectedSeats,seatsTotal,totalAmount:total,pickupPoint,dropoffPoint,routeLabel:`${depCity} → ${arrCity}`,busAgentName:agentName,addInsurance,insuranceFee,needVAT,passengerInfo:{name:pName,phone:pPhone,email:pEmail},bookerInfo:isSamePerson?null:{name:bName,phone:bPhone,email:bEmail}};
    sessionStorage.setItem('pending_booking',JSON.stringify(bookingData));
    localStorage.setItem('pending_booking',JSON.stringify(bookingData));
    navigate('/booking-review');
  };

  const pct = (bookedCount/(floorSeats.length||1))*100;

  return (
    <div style={{background:'#080a0a', minHeight:'100vh', color:'#f0ede6', fontFamily:'system-ui'}}>

      {/* ── TOPBAR ── */}
      <div style={{position:'sticky',top:0,zIndex:100,background:'rgba(8,10,10,0.96)',backdropFilter:'blur(24px)',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
        <div style={{maxWidth:1440,margin:'0 auto',padding:`0 ${isMobile?'14px':'28px'}`,height:58,display:'flex',alignItems:'center',justifyContent:'space-between',gap:10}}>
          <div style={{display:'flex',alignItems:'center',gap:isMobile?8:14,minWidth:0,overflow:'hidden'}}>
            <Link to="/search" style={{display:'flex',alignItems:'center',justifyContent:'center',width:32,height:32,border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,color:'rgba(255,255,255,0.35)',textDecoration:'none',flexShrink:0}}>
              <ArrowLeft size={13}/>
            </Link>
            <div style={{display:'flex',alignItems:'center',gap:6,overflow:'hidden',minWidth:0}}>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:isMobile?14:15,fontWeight:700,letterSpacing:'0.05em',whiteSpace:'nowrap'}}>{depCity}</span>
              <div style={{display:'flex',alignItems:'center',gap:3,flexShrink:0}}>
                <div style={{width:12,height:1,background:'rgba(212,175,55,0.4)'}}/>
                <div style={{width:4,height:4,background:'#d4af37',transform:'rotate(45deg)'}}/>
                <div style={{width:12,height:1,background:'rgba(212,175,55,0.4)'}}/>
              </div>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:isMobile?14:15,fontWeight:700,letterSpacing:'0.05em',whiteSpace:'nowrap'}}>{arrCity}</span>
              {!isMobile && <>
                <span style={{fontSize:10,color:'rgba(255,255,255,0.22)',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',padding:'2px 8px',borderRadius:4,whiteSpace:'nowrap'}}>{depTime} → {arrTime}</span>
                <span style={{fontSize:9,color:'rgba(212,175,55,0.5)',background:'rgba(212,175,55,0.06)',border:'1px solid rgba(212,175,55,0.15)',padding:'2px 8px',borderRadius:4,letterSpacing:'0.1em',textTransform:'uppercase',whiteSpace:'nowrap'}}>{busClass}</span>
              </>}
            </div>
          </div>
          {/* Steps */}
          <div style={{display:'flex',alignItems:'center',gap:0,flexShrink:0}}>
            {[{k:'seat',l:'Ghế'},{k:'info',l:'Thông tin'},{k:'pay',l:'Thanh toán'}].map((s,i)=>{
              const active=step===s.k;
              const done=(s.k==='seat'&&step==='info');
              return(
                <div key={s.k} style={{display:'flex',alignItems:'center'}}>
                  {i>0&&<div style={{width:isMobile?14:28,height:1,background:done?'#d4af37':'rgba(255,255,255,0.08)'}}/>}
                  <div style={{display:'flex',alignItems:'center',gap:4,padding:'0 4px',opacity:active?1:done?0.8:0.35}}>
                    <div style={{width:16,height:16,borderRadius:'50%',background:active?'#d4af37':done?'rgba(212,175,55,0.15)':'transparent',border:`1px solid ${active?'#d4af37':done?'rgba(212,175,55,0.4)':'rgba(255,255,255,0.15)'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,fontWeight:800,color:active?'#080a0a':done?'#d4af37':'rgba(255,255,255,0.3)'}}>
                      {done?<Check size={8} strokeWidth={3}/>:i+1}
                    </div>
                    {!isMobile&&<span style={{fontSize:9,fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:active?'#f0ede6':'rgba(255,255,255,0.4)'}}>{s.l}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div style={{maxWidth:1440,margin:'0 auto',padding:isMobile?'16px 14px 100px':'20px 28px',display:'grid',gridTemplateColumns:isMobile?'1fr':'280px 1fr 300px',gap:isMobile?14:20,alignItems:'start'}}>

        {/* ══════ LEFT PANEL ══════ */}
        <div style={{display:'flex',flexDirection:'column',gap:14,position:isMobile?'static':'sticky',top:70}}>

          {/* Route card */}
          <div style={{background:'linear-gradient(145deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.018) 100%)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:14,padding:'18px 16px',overflow:'hidden',position:'relative'}}>
            <div style={{position:'absolute',top:-30,right:-30,width:100,height:100,background:'radial-gradient(circle,rgba(212,175,55,0.06) 0%,transparent 70%)',pointerEvents:'none'}}/>
            <div style={{fontSize:8,color:'rgba(212,175,55,0.5)',letterSpacing:'0.25em',textTransform:'uppercase',fontWeight:700,marginBottom:16}}>Hành trình</div>
            <div style={{display:'flex',gap:12,marginBottom:14}}>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',paddingTop:4,flexShrink:0}}>
                <div style={{width:8,height:8,borderRadius:'50%',border:'1.5px solid #d4af37',background:'transparent'}}/>
                <div style={{width:1,height:40,margin:'4px 0',background:'repeating-linear-gradient(to bottom,rgba(212,175,55,0.5) 0,rgba(212,175,55,0.5) 4px,transparent 4px,transparent 9px)'}}/>
                <div style={{width:8,height:8,borderRadius:'50%',background:'#d4af37'}}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,lineHeight:1}}>{depCity}</div>
                <div style={{fontSize:11,color:'rgba(255,255,255,0.28)',margin:'3px 0 16px',letterSpacing:'0.05em'}}>{depTime} · Xuất phát</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,lineHeight:1}}>{arrCity}</div>
                <div style={{fontSize:11,color:'rgba(255,255,255,0.28)',marginTop:3,letterSpacing:'0.05em'}}>{arrTime} · Điểm đến</div>
              </div>
            </div>
            <div style={{borderTop:'1px solid rgba(255,255,255,0.06)',paddingTop:12,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontSize:11,color:'rgba(255,255,255,0.3)'}}>{agentName}</span>
              <div style={{display:'flex',alignItems:'center',gap:4}}>
                <div style={{width:4,height:4,borderRadius:'50%',background:'#4ade80'}}/>
                <span style={{fontSize:9,color:'rgba(255,255,255,0.25)',letterSpacing:'0.05em'}}>Đúng giờ</span>
              </div>
            </div>
          </div>

          {/* Occupancy */}
          <div style={{background:'rgba(255,255,255,0.025)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:14,padding:'16px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
              <span style={{fontSize:8,color:'rgba(212,175,55,0.5)',letterSpacing:'0.2em',textTransform:'uppercase',fontWeight:700}}>Tình trạng ghế</span>
              <span style={{fontSize:9,color:'rgba(255,255,255,0.25)'}}>{agentName.split(' ')[0]}</span>
            </div>
            {/* Occupancy bar */}
            <div style={{height:6,background:'rgba(255,255,255,0.07)',borderRadius:99,overflow:'hidden',marginBottom:10}}>
              <motion.div
                initial={{width:0}} animate={{width:`${pct}%`}}
                transition={{duration:1,ease:'easeOut',delay:0.3}}
                style={{height:'100%',background:'linear-gradient(to right,rgba(212,175,55,0.5),#d4af37)',borderRadius:99}}
              />
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
              {[
                {label:'Trống',val:availCount,color:'rgba(255,255,255,0.7)'},
                {label:'Đã bán',val:bookedCount,color:'rgba(212,175,55,0.5)'},
                {label:'Chọn',val:selectedSeats.length,color:'#d4af37'},
              ].map(item=>(
                <div key={item.label} style={{textAlign:'center',padding:'8px 4px',background:'rgba(255,255,255,0.02)',borderRadius:8,border:'1px solid rgba(255,255,255,0.05)'}}>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:item.color,lineHeight:1}}>{item.val}</div>
                  <div style={{fontSize:8,color:'rgba(255,255,255,0.25)',letterSpacing:'0.08em',textTransform:'uppercase',marginTop:4}}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Timer */}
          {selectedSeats.length>0&&(
            <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} style={{background:`rgba(${timeLeft<120?'248,65,65':'212,175,55'},0.07)`,border:`1px solid rgba(${timeLeft<120?'248,65,65':'212,175,55'},0.2)`,borderRadius:14,padding:'14px 16px',display:'flex',alignItems:'center',gap:12}}>
              <Clock size={16} color={timeLeft<120?'#f84141':'#d4af37'}/>
              <div>
                <div style={{fontSize:8,color:'rgba(255,255,255,0.3)',letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:2}}>Giữ chỗ còn lại</div>
                <div style={{fontFamily:'monospace',fontSize:22,fontWeight:700,color:timeLeft<120?'#f87171':'#d4af37',letterSpacing:'0.1em'}}>
                  {String(Math.floor(timeLeft/60)).padStart(2,'0')}:{String(timeLeft%60).padStart(2,'0')}
                </div>
              </div>
            </motion.div>
          )}

          {/* Add-ons */}
          <div style={{background:'rgba(255,255,255,0.025)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:14,padding:'16px'}}>
            <div style={{fontSize:8,color:'rgba(212,175,55,0.5)',letterSpacing:'0.25em',textTransform:'uppercase',fontWeight:700,marginBottom:14}}>Dịch vụ bổ sung</div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {[
                {icon:<Shield size={14}/>, title:'Bảo hiểm hành trình', desc:'Tai nạn · Chậm trễ · Hành lý', note:'+20.000₫/ghế', active:addInsurance, toggle:()=>setAddInsurance(p=>!p)},
                {icon:<FileText size={14}/>, title:'Hóa đơn VAT', desc:'Xuất cho doanh nghiệp', note:'Miễn phí', active:needVAT, toggle:()=>setNeedVAT(p=>!p)},
              ].map((item,i)=>(
                <motion.div key={i} whileTap={{scale:0.98}} onClick={item.toggle} style={{
                  display:'flex',alignItems:'center',gap:12,padding:'12px 12px',
                  cursor:'pointer',borderRadius:10,
                  border:`1px solid ${item.active?'rgba(212,175,55,0.3)':'rgba(255,255,255,0.06)'}`,
                  background:item.active?'rgba(212,175,55,0.07)':'rgba(255,255,255,0.02)',
                  transition:'all 0.2s',position:'relative',overflow:'hidden',
                }}>
                  {item.active&&<div style={{position:'absolute',left:0,top:0,bottom:0,width:3,background:'linear-gradient(to bottom,#d4af37,rgba(212,175,55,0.3))',borderRadius:'10px 0 0 10px'}}/>}
                  <div style={{color:item.active?'#d4af37':'rgba(255,255,255,0.3)',transition:'color 0.2s',flexShrink:0}}>{item.icon}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:11,fontWeight:700,color:item.active?'#f0ede6':'rgba(255,255,255,0.5)',marginBottom:2}}>{item.title}</div>
                    <div style={{fontSize:9,color:'rgba(255,255,255,0.25)'}}>{item.desc}</div>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4,flexShrink:0}}>
                    <div style={{width:16,height:16,borderRadius:5,border:`1.5px solid ${item.active?'#d4af37':'rgba(255,255,255,0.15)'}`,background:item.active?'#d4af37':'transparent',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.2s'}}>
                      {item.active&&<Check size={9} color="#080a0a" strokeWidth={3}/>}
                    </div>
                    <span style={{fontSize:8,color:item.active?'rgba(212,175,55,0.7)':'rgba(255,255,255,0.2)',letterSpacing:'0.05em'}}>{item.note}</span>
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
              <div style={{background:'linear-gradient(145deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.018) 100%)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,padding:'24px',overflow:'hidden',position:'relative'}}>
                {/* Ambient glow */}
                <div style={{position:'absolute',top:-60,left:'50%',transform:'translateX(-50%)',width:300,height:300,background:'radial-gradient(circle,rgba(212,175,55,0.04) 0%,transparent 70%)',pointerEvents:'none'}}/>

                {/* Header */}
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20}}>
                  <div>
                    <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:600,margin:0,lineHeight:1}}>Sơ đồ ghế</h2>
                    <p style={{margin:'6px 0 0',fontSize:11,color:'rgba(255,255,255,0.3)'}}>Chọn tối đa 4 ghế · Giá đã bao gồm phí dịch vụ</p>
                  </div>
                  {/* Floor tabs */}
                  {floorCount>1&&(
                    <div style={{display:'flex',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:10,padding:3,gap:2}}>
                      {Array.from({length:floorCount},(_,i)=>i+1).map(f=>(
                        <button key={f} onClick={()=>setActiveFloor(f)} style={{
                          padding:'7px 16px',borderRadius:8,cursor:'pointer',outline:'none',
                          border:'none',transition:'all 0.2s',
                          background:activeFloor===f?'rgba(212,175,55,0.15)':'transparent',
                          boxShadow:activeFloor===f?'inset 0 1px 0 rgba(212,175,55,0.2)':'none',
                        }}>
                          <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:activeFloor===f?'#d4af37':'rgba(255,255,255,0.3)',transition:'color 0.2s'}}>Tầng {f===1?'Dưới':'Trên'}</div>
                          <div style={{fontSize:8,color:activeFloor===f?'rgba(212,175,55,0.5)':'rgba(255,255,255,0.18)',marginTop:2}}>{seats.filter(s=>s.floor===f&&s.status==='available').length} trống</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Legend */}
                <div style={{display:'flex',gap:18,marginBottom:22,paddingBottom:18,borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                  {[
                    {bg:'rgba(255,255,255,0.08)',border:'rgba(255,255,255,0.22)',label:'Còn trống'},
                    {bg:'rgba(212,175,55,0.22)',border:'rgba(212,175,55,0.9)',label:'Đang chọn'},
                    {bg:'rgba(255,255,255,0.03)',border:'rgba(255,255,255,0.07)',label:'Đã bán',dim:true},
                  ].map(l=>(
                    <div key={l.label} style={{display:'flex',alignItems:'center',gap:8,opacity:l.dim?0.4:1}}>
                      <div style={{width:20,height:26,background:l.bg,border:`1.5px solid ${l.border}`,borderRadius:5,flexShrink:0}}/>
                      <span style={{fontSize:11,color:'rgba(255,255,255,0.35)'}}>{l.label}</span>
                    </div>
                  ))}
                  <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:6}}>
                    <div style={{fontSize:11,color:'rgba(255,255,255,0.25)'}}>Giá từ</div>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:700,color:'#d4af37'}}>{(Math.min(...floorSeats.filter(s=>s.status==='available').map(s=>s.price))/1000).toFixed(0)}k₫</div>
                  </div>
                </div>

                {/* Bus shape + seats */}
                <div style={{display:'flex',justifyContent:'center'}}>
                  <div style={{position:'relative'}}>
                    {/* Bus SVG outline */}
                    <div style={{
                      background:'linear-gradient(175deg,rgba(255,255,255,0.03) 0%,rgba(255,255,255,0.012) 100%)',
                      border:'1px solid rgba(255,255,255,0.09)',
                      borderTop:'3px solid rgba(212,175,55,0.4)',
                      borderRadius:'16px 16px 8px 8px',
                      padding:'0 32px 32px',
                      boxShadow:'inset 0 2px 0 rgba(255,255,255,0.06), 0 24px 80px rgba(0,0,0,0.6)',
                      position:'relative',
                    }}>
                      {/* Windshield */}
                      <div style={{margin:'16px -32px 20px',padding:'12px 32px',borderBottom:'1px solid rgba(255,255,255,0.05)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                        <div style={{display:'flex',alignItems:'center',gap:8}}>
                          <div style={{width:28,height:18,border:'1.5px solid rgba(255,255,255,0.08)',borderRadius:'50% 50% 0 0',background:'rgba(255,255,255,0.02)'}}/>
                          <span style={{fontSize:8,letterSpacing:'0.35em',textTransform:'uppercase',color:'rgba(255,255,255,0.15)'}}>Buồng lái</span>
                        </div>
                        <div style={{width:28,height:18,border:'1.5px solid rgba(255,255,255,0.08)',borderRadius:'50% 50% 0 0',background:'rgba(255,255,255,0.02)',transform:'scaleX(-1)'}}/>
                      </div>
                      <SeatMap seats={floorSeats} selectedSeats={selectedSeats} onToggle={toggleSeat}/>
                      {/* Exit markers */}
                      <div style={{position:'absolute',right:-1,top:'40%',width:4,height:20,background:'rgba(74,222,128,0.3)',borderRadius:'2px 0 0 2px'}} title="Cửa thoát hiểm"/>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: INFO */}
          {step==='info'&&(
            <motion.div key="info" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} transition={{duration:0.25}}>
              <div style={{background:'linear-gradient(145deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.018) 100%)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,padding:'28px'}}>
                <button onClick={()=>setStep('seat')} style={{background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:7,color:'rgba(255,255,255,0.3)',fontSize:11,marginBottom:28,padding:0,letterSpacing:'0.05em'}}>
                  <ArrowLeft size={12}/> Quay lại chọn ghế
                </button>
                <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:600,margin:'0 0 8px',lineHeight:1}}>Thông tin hành khách</h2>
                <p style={{margin:'0 0 28px',fontSize:11,color:'rgba(255,255,255,0.28)'}}>Thông tin sẽ được in trên vé — vui lòng điền chính xác</p>

                {/* Pickup/dropoff */}
                <div style={{background:'rgba(255,255,255,0.025)',borderRadius:12,padding:'16px 18px',marginBottom:24,border:'1px solid rgba(255,255,255,0.06)'}}>
                  <div style={{fontSize:8,color:'rgba(212,175,55,0.5)',letterSpacing:'0.2em',textTransform:'uppercase',fontWeight:700,marginBottom:14}}>Điểm đón & trả khách</div>
                  <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:16}}>
                    {[
                      {label:`Đón tại ${depCity}`,opts:pickupOpts,val:pickupPoint,set:setPickupPoint},
                      {label:`Trả tại ${arrCity}`,opts:dropoffOpts,val:dropoffPoint,set:setDropoffPoint},
                    ].map(f=>(
                      <div key={f.label}>
                        <div style={{fontSize:9,color:'rgba(255,255,255,0.28)',letterSpacing:'0.1em',marginBottom:8,textTransform:'uppercase'}}>{f.label}</div>
                        <select value={f.val} onChange={e=>f.set(e.target.value)} style={{width:'100%',background:'rgba(255,255,255,0.04)',border:'none',borderBottom:'1px solid rgba(255,255,255,0.15)',padding:'10px 4px',color:'#f0ede6',fontSize:12,outline:'none',borderRadius:0}}>
                          {f.opts.length===0&&<option value="">—</option>}
                          {f.opts.map(cp=><option key={cp.id} value={cp.id} style={{background:'#0e1111'}}>{cp.station.name}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Passenger */}
                <div style={{marginBottom:24}}>
                  <div style={{fontSize:8,color:'rgba(212,175,55,0.5)',letterSpacing:'0.2em',textTransform:'uppercase',fontWeight:700,marginBottom:16}}>Thông tin người đi</div>
                  <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:18}}>
                    <Field label="Họ và tên *" value={pName} onChange={setPName} placeholder="Nguyễn Văn A"/>
                    <Field label="Số điện thoại *" value={pPhone} onChange={setPPhone} placeholder="09x xxxx xxxx"/>
                    <div style={{gridColumn:isMobile?'span 1':'span 2'}}>
                      <Field label="Email nhận vé *" value={pEmail} onChange={setPEmail} placeholder="email@example.com" type="email"/>
                    </div>
                  </div>
                </div>

                <motion.div whileTap={{scale:0.99}} onClick={()=>setIsSamePerson(p=>!p)} style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer',marginBottom:20,padding:'12px 14px',border:`1px solid ${isSamePerson?'rgba(212,175,55,0.2)':'rgba(255,255,255,0.06)'}`,borderRadius:10,background:isSamePerson?'rgba(212,175,55,0.04)':'rgba(255,255,255,0.02)',transition:'all 0.2s',userSelect:'none'}}>
                  <div style={{width:18,height:18,borderRadius:5,border:`1.5px solid ${isSamePerson?'#d4af37':'rgba(255,255,255,0.2)'}`,background:isSamePerson?'#d4af37':'transparent',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.15s',flexShrink:0}}>
                    {isSamePerson&&<Check size={10} color="#080a0a" strokeWidth={3}/>}
                  </div>
                  <span style={{fontSize:12,color:isSamePerson?'rgba(255,255,255,0.6)':'rgba(255,255,255,0.35)'}}>Tôi là người trực tiếp lên xe</span>
                </motion.div>

                <AnimatePresence>
                  {!isSamePerson&&(
                    <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} style={{overflow:'hidden'}}>
                      <div style={{borderTop:'1px solid rgba(255,255,255,0.06)',paddingTop:24,marginBottom:24}}>
                        <div style={{fontSize:8,color:'rgba(212,175,55,0.5)',letterSpacing:'0.2em',textTransform:'uppercase',fontWeight:700,marginBottom:16}}>Người đặt vé</div>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:22}}>
                          <Field label="Họ và tên *" value={bName} onChange={setBName} placeholder="Nguyễn Văn B"/>
                          <Field label="Số điện thoại *" value={bPhone} onChange={setBPhone} placeholder="09x xxxx xxxx"/>
                          <div style={{gridColumn:isMobile?'span 1':'span 2'}}><Field label="Email xác nhận *" value={bEmail} onChange={setBEmail} placeholder="email@example.com" type="email"/></div>
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
        <div style={isMobile?{position:'fixed',bottom:0,left:0,right:0,zIndex:200,background:'rgba(8,10,10,0.98)',backdropFilter:'blur(24px)',borderTop:'1px solid rgba(255,255,255,0.08)',padding:'12px 16px 20px',display:'flex',flexDirection:'column',gap:10}:{position:'sticky',top:70,display:'flex',flexDirection:'column',gap:12}}>

          {isMobile ? (
            /* ─ MOBILE: compact bottom bar ─ */
            <>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
                <div style={{flex:1,minWidth:0}}>
                  {selectedSeats.length===0 ? (
                    <p style={{margin:0,fontSize:12,color:'rgba(255,255,255,0.25)'}}>Chạm vào ghế để chọn</p>
                  ) : (
                    <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'nowrap',overflowX:'auto'}}>
                      <AnimatePresence>
                        {selectedSeats.map(id=>{
                          const p=parseSeatId(id);
                          return(
                            <motion.button key={id}
                              initial={{scale:0}} animate={{scale:1}} exit={{scale:0}}
                              onClick={()=>toggleSeat(id,'available')}
                              style={{display:'flex',alignItems:'center',gap:4,background:'rgba(212,175,55,0.12)',border:'1px solid rgba(212,175,55,0.3)',borderRadius:7,padding:'5px 9px',cursor:'pointer',flexShrink:0,fontFamily:'system-ui'}}
                            >
                              <span style={{fontSize:12,fontWeight:700,color:'#d4af37'}}>{p?`${p.col}${p.row}`:id}</span>
                              <X size={9} color="rgba(212,175,55,0.5)"/>
                            </motion.button>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
                <div style={{textAlign:'right',flexShrink:0}}>
                  <div style={{fontSize:8,color:'rgba(255,255,255,0.25)',letterSpacing:'0.1em',textTransform:'uppercase'}}>Tổng</div>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:'#d4af37',lineHeight:1}}>
                    {total>0?`${fmt(total)}₫`:'—'}
                  </div>
                </div>
              </div>
              <motion.button
                onClick={handleContinue}
                disabled={selectedSeats.length===0}
                whileTap={selectedSeats.length>0?{scale:0.97}:{}}
                style={{
                  width:'100%',borderRadius:12,
                  background:selectedSeats.length===0?'rgba(255,255,255,0.05)':'linear-gradient(135deg,#e0bb45 0%,#c09020 100%)',
                  color:selectedSeats.length===0?'rgba(255,255,255,0.2)':'#080a0a',
                  border:'none',padding:'15px',
                  fontSize:11,fontWeight:800,letterSpacing:'0.18em',textTransform:'uppercase',
                  cursor:selectedSeats.length===0?'not-allowed':'pointer',
                  display:'flex',alignItems:'center',justifyContent:'center',gap:8,
                  fontFamily:'system-ui',
                }}
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
              <div style={{background:'linear-gradient(145deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.018) 100%)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:14,padding:'18px 16px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                  <div style={{fontSize:8,color:'rgba(212,175,55,0.5)',letterSpacing:'0.25em',textTransform:'uppercase',fontWeight:700}}>Ghế đã chọn</div>
                  {selectedSeats.length>0&&<span style={{fontSize:9,color:'rgba(255,255,255,0.25)',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:99,padding:'1px 8px'}}>{selectedSeats.length}/4</span>}
                </div>
                {selectedSeats.length===0?(
                  <div style={{padding:'16px 0',textAlign:'center'}}>
                    <div style={{width:40,height:50,margin:'0 auto 10px',background:'rgba(255,255,255,0.04)',border:'1px dashed rgba(255,255,255,0.1)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <span style={{fontSize:18,opacity:0.3}}>💺</span>
                    </div>
                    <div style={{fontSize:11,color:'rgba(255,255,255,0.2)',lineHeight:1.7}}>Chưa chọn ghế nào<br/><span style={{fontSize:10}}>Click vào ghế để chọn</span></div>
                  </div>
                ):(
                  <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
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
                            style={{display:'flex',alignItems:'center',gap:5,background:'rgba(212,175,55,0.1)',border:'1px solid rgba(212,175,55,0.3)',borderRadius:8,padding:'6px 10px',cursor:'pointer'}}
                          >
                            <span style={{fontSize:12,fontWeight:700,color:'#d4af37'}}>{p?`${p.col}${p.row}`:id}</span>
                            {s&&<span style={{fontSize:9,color:'rgba(212,175,55,0.45)'}}>{fmt(s.price)}đ</span>}
                            <X size={10} color="rgba(212,175,55,0.4)" style={{marginLeft:2}}/>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Price */}
              <div style={{background:'rgba(255,255,255,0.025)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:14,padding:'16px'}}>
                <div style={{display:'flex',flexDirection:'column',gap:10}}>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:12,color:'rgba(255,255,255,0.32)'}}>
                    <span>Vé xe · {selectedSeats.length} ghế</span>
                    <span>{seatsTotal>0?`${fmt(seatsTotal)}₫`:'—'}</span>
                  </div>
                  {addInsurance&&selectedSeats.length>0&&(
                    <div style={{display:'flex',justifyContent:'space-between',fontSize:12,color:'rgba(255,255,255,0.32)'}}>
                      <span>Bảo hiểm hành trình</span><span>{fmt(insuranceFee)}₫</span>
                    </div>
                  )}
                  <div style={{height:1,background:'rgba(255,255,255,0.07)',margin:'2px 0'}}/>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
                    <span style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>Tổng cộng</span>
                    <motion.span key={total} initial={{scale:1.1,color:'#f2c118'}} animate={{scale:1,color:'#d4af37'}} transition={{duration:0.3}}
                      style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.75rem',fontWeight:700,color:'#d4af37',lineHeight:1}}>
                      {total>0?`${fmt(total)}₫`:'—'}
                    </motion.span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <motion.button
                onClick={handleContinue}
                disabled={selectedSeats.length===0}
                whileHover={selectedSeats.length>0?{scale:1.02,boxShadow:'0 10px 32px rgba(212,175,55,0.35)'}:{}}
                whileTap={selectedSeats.length>0?{scale:0.97}:{}}
                style={{
                  width:'100%',borderRadius:12,
                  background:selectedSeats.length===0?'rgba(255,255,255,0.05)':'linear-gradient(135deg,#e0bb45 0%,#c09020 100%)',
                  color:selectedSeats.length===0?'rgba(255,255,255,0.2)':'#080a0a',
                  border:'none',padding:'16px',
                  fontSize:10,fontWeight:800,letterSpacing:'0.22em',textTransform:'uppercase',
                  cursor:selectedSeats.length===0?'not-allowed':'pointer',
                  display:'flex',alignItems:'center',justifyContent:'center',gap:10,
                  fontFamily:'system-ui',
                  boxShadow:selectedSeats.length>0?'0 4px 20px rgba(212,175,55,0.2)':'none',
                  transition:'background 0.2s, box-shadow 0.2s',
                }}
              >
                {step==='seat'
                  ?selectedSeats.length===0?'Chọn ghế để tiếp tục':`Tiếp tục · ${selectedSeats.length} ghế`
                  :'Xác nhận đặt vé'}
                {selectedSeats.length>0&&<ArrowRight size={13}/>}
              </motion.button>

              <p style={{margin:0,fontSize:9,color:'rgba(255,255,255,0.12)',textAlign:'center',lineHeight:1.9}}>
                Bằng cách tiếp tục bạn đồng ý với{' '}
                <span style={{color:'rgba(212,175,55,0.3)',textDecoration:'underline',cursor:'pointer'}}>điều khoản dịch vụ</span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
