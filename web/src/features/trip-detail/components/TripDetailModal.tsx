import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RouteMap } from '../../../shared/components/RouteMap';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Wifi, Droplets, Usb, ShieldAlert, MapPin, ThumbsUp, ArrowRight, Clock } from 'lucide-react';

interface TripDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: any;
}

const GALLERY = [
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1533606622442-50dffdb99e69?q=80&w=800&auto=format&fit=crop',
];

const TABS = ['Tổng quan', 'Hình ảnh', 'Chính sách', 'Đánh giá'];

export function TripDetailModal({ isOpen, onClose, trip }: TripDetailModalProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  if (!trip) return null;

  const handleSelectSeat = () => {
    onClose();
    navigate(`/seat-selection/${trip.id}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
        >
          {/* Backdrop */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={onClose} />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'relative', width: '90vw', maxWidth: 1100, height: '85vh',
              background: '#ffffff', borderRadius: 16, overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              display: 'flex', flexDirection: 'column',
            }}
          >
            {/* === Map Hero Section (Leaflet + OSRM) === */}
            <div className="relative h-1/2 min-h-[300px] w-full bg-slate-900 overflow-hidden shrink-0">
              <RouteMap 
                originCoords={[10.8135, 106.7109]} // Bến xe Miền Đông, TP. Hồ Chí Minh
                destCoords={[12.2388, 109.1967]}   // Mock coords for Nha Trang
                originName={trip.from}
                destName={trip.to}
              />

              {/* Close Button Overlay */}
              <button onClick={onClose} className="absolute top-4 right-4 z-10 bg-white/90 border border-gray-200 text-gray-600 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition hover:bg-white shadow-md">
                <X size={18} />
              </button>
              
              {/* Trip Info Overlay */}
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
                 <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-gray-100 pointer-events-auto flex items-center gap-8">
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">{trip.type}</div>
                      <h2 className="text-2xl font-serif text-gray-900 leading-none m-0">{trip.company}</h2>
                    </div>
                    <div className="w-px h-12 bg-gray-200"></div>
                    <div>
                      <div className="flex items-center gap-3 text-sm text-gray-700 font-semibold mb-1.5">
                        <span>{trip.from}</span>
                        <ArrowRight size={14} className="text-gray-400" />
                        <span>{trip.to}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                        <Clock size={12} /> {trip.duration}
                        <span className="mx-1 text-gray-300">•</span>
                        <MapPin size={12} /> Lộ trình cố định
                      </div>
                    </div>
                 </div>

                 {/* CTA */}
                 <div className="bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-gray-100 pointer-events-auto flex items-center">
                    <div className="px-5 text-right">
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Giá vé từ</div>
                      <div className="text-2xl font-bold text-green-700 leading-none">{new Intl.NumberFormat('vi-VN').format(trip.price)}₫</div>
                    </div>
                    <button onClick={handleSelectSeat} className="bg-green-700 text-white px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg hover:bg-green-800 transition border-none cursor-pointer">
                      Chọn ghế ngay
                    </button>
                 </div>
              </div>
            </div>

            {/* ── TABS ── */}
            <div className="flex px-8 gap-8 border-b border-gray-100 bg-white flex-shrink-0 shadow-sm z-10">
              {TABS.map((tab, i) => (
                <button key={tab} onClick={() => setActiveTab(i)} className={`
                  py-5 text-[12px] font-bold uppercase tracking-wider transition-colors border-none bg-transparent cursor-pointer
                  ${activeTab === i ? 'text-green-700 border-b-2 border-green-700' : 'text-gray-400 hover:text-gray-700'}
                `} style={{ borderBottomWidth: activeTab === i ? 2 : 0, borderBottomStyle: 'solid' }}>
                  {tab}
                </button>
              ))}
            </div>

            {/* ── CONTENT ── */}
            <div className="flex-1 overflow-y-auto bg-slate-50 p-8">
              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

                  {/* ── OVERVIEW ── */}
                  {activeTab === 0 && (
                    <div className="grid grid-cols-[1.5fr_1fr] gap-8">
                      {/* Schedule Timeline */}
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-6">Lịch trình chi tiết</h3>
                        <div className="relative pl-6">
                          {/* Vertical Line */}
                          <div className="absolute top-2 bottom-6 left-[7px] w-px bg-gray-200 border-l border-dashed border-gray-300"></div>
                          
                          {[
                            { time: trip.depTime, city: trip.from, station: 'Bến xe trung tâm (Điểm đón ban đầu)', active: true },
                            { time: trip.arrTime, city: trip.to, station: 'Bến xe liên tỉnh (Điểm trả cuối)', active: false },
                          ].map((stop, i) => (
                            <div key={i} className={`relative mb-8 last:mb-0 ${stop.active ? 'opacity-100' : 'opacity-60'}`}>
                              <div className={`absolute -left-6 top-1.5 w-3 h-3 rounded-full border-2 bg-white ${stop.active ? 'border-green-600' : 'border-gray-400'}`}></div>
                              <div className="text-xl font-serif font-bold text-gray-900 mb-1">{stop.time}</div>
                              <div className="text-sm font-bold text-gray-800 mb-1">{stop.city}</div>
                              <div className="text-xs text-gray-500 flex items-center gap-1.5"><MapPin size={12}/> {stop.station}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Amenities + Rating */}
                      <div className="flex flex-col gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Tiện ích trên xe</h3>
                          <div className="grid grid-cols-1 gap-4">
                            {[
                              { Icon: Wifi, label: 'Wifi tốc độ cao' },
                              { Icon: Droplets, label: 'Nước suối & Khăn lạnh' },
                              { Icon: Usb, label: 'Cổng sạc USB tại ghế' },
                              { Icon: ShieldAlert, label: 'Trang bị búa thoát hiểm' },
                            ].map(({ Icon, label }) => (
                              <div key={label} className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-700">
                                  <Icon size={14} />
                                </div>
                                {label}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Rating summary */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2 text-lg font-bold text-green-800">
                              <Star size={16} className="fill-green-700 text-green-700" /> {trip.rating}/5 Rất tốt
                            </div>
                            <button className="text-xs text-green-600 font-semibold bg-transparent border-none cursor-pointer" onClick={() => setActiveTab(3)}>
                              Đọc {trip.reviews} đánh giá →
                            </button>
                          </div>
                          <p className="text-sm text-gray-500 leading-relaxed m-0">
                            Khách hàng thường khen ngợi nhà xe về sự đúng giờ, xe sạch sẽ và thái độ phục vụ thân thiện.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── IMAGES ── */}
                  {activeTab === 1 && (
                     <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 rounded-2xl overflow-hidden shadow-sm h-[300px]">
                           <img src={GALLERY[0]} className="w-full h-full object-cover" alt="Bus interior" />
                        </div>
                        {GALLERY.slice(1).map((img, i) => (
                           <div key={i} className="rounded-2xl overflow-hidden shadow-sm h-[200px]">
                              <img src={img} className="w-full h-full object-cover" alt="Bus interior" />
                           </div>
                        ))}
                     </div>
                  )}

                  {/* ── POLICY ── */}
                  {activeTab === 2 && (
                    <div className="grid grid-cols-2 gap-8">
                      {/* Cancellation */}
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Chính sách hoàn hủy</div>
                        {[
                          { label: 'Hủy trước 24h', value: 'Hoàn 100%' },
                          { label: 'Hủy từ 12h – 24h', value: 'Hoàn 50%' },
                          { label: 'Hủy trước 12h', value: 'Không hoàn' },
                        ].map(r => (
                          <div key={r.label} className="flex justify-between py-3 border-b border-gray-100 text-sm">
                            <span className="text-gray-500">{r.label}</span>
                            <span className="font-bold text-gray-900">{r.value}</span>
                          </div>
                        ))}
                        <p className="text-xs text-gray-400 mt-4 italic">
                          * Vé ngày Lễ, Tết không áp dụng chính sách hoàn hủy.
                        </p>
                      </div>

                      {/* Baggage */}
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Quy định hành lý & Khác</div>
                        {[
                          'Tối đa 20kg hành lý ký gửi và 1 balo nhỏ xách tay.',
                          'Không mang động vật sống, hàng hóa có mùi (sầu riêng, nước mắm).',
                          'Có mặt tại điểm đón trước 30 phút để làm thủ tục.',
                        ].map((item, i) => (
                          <div key={i} className="flex gap-3 mb-4 text-sm text-gray-600 leading-relaxed">
                            <span className="text-green-600 text-[10px] mt-1.5">◆</span>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── REVIEWS ── */}
                  {activeTab === 3 && (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                      {/* Rating summary */}
                      <div className="flex gap-12 pb-8 border-b border-gray-100 mb-8">
                        <div className="text-center flex-shrink-0">
                          <div className="font-serif text-5xl font-bold text-green-800 leading-none mb-3">
                            {trip.rating}
                          </div>
                          <div className="flex gap-1 justify-center mb-2">
                            {[1,2,3,4,5].map(i => (
                              <Star key={i} size={14} className={i <= Math.floor(trip.rating) ? 'fill-green-700 text-green-700' : 'fill-gray-200 text-gray-200'} />
                            ))}
                          </div>
                          <div className="text-xs text-gray-400 font-medium">{trip.reviews} đánh giá</div>
                        </div>

                        <div className="flex-1 max-w-sm">
                          {[5,4,3,2,1].map(r => {
                            const pct = r === 5 ? 75 : r === 4 ? 15 : r === 3 ? 5 : 2;
                            return (
                              <div key={r} className="flex items-center gap-3 mb-2">
                                <span className="text-xs text-gray-500 w-2">{r}</span>
                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-green-700 rounded-full" style={{ width: `${pct}%` }} />
                                </div>
                                <span className="text-xs text-gray-400 w-8">{pct}%</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Reviews list */}
                      <div className="flex flex-col gap-6">
                        {[
                          { name: 'Nguyễn Văn A', date: 'Hôm qua', content: 'Xe rất mới, giường nằm rộng rãi thoải mái. Tài xế lái an toàn không lạng lách. Wifi chạy tốt.', likes: 12 },
                          { name: 'Trần Thị B', date: '3 ngày trước', content: 'Chất lượng dịch vụ tuyệt vời. Lơ xe rất lịch sự, phát nước và khăn lạnh đầy đủ. Đón khách đúng giờ.', likes: 8 },
                        ].map((review, i) => (
                          <div key={i} className="pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-sm font-bold text-green-700">
                                  {review.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="text-sm font-bold text-gray-900">{review.name}</div>
                                  <div className="text-xs text-gray-400">{review.date}</div>
                                </div>
                              </div>
                              <div className="flex gap-0.5">
                                {[1,2,3,4,5].map(s => <Star key={s} size={10} className="fill-green-700 text-green-700" />)}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed mb-3">
                              {review.content}
                            </p>
                            <button className="flex items-center gap-2 bg-transparent border-none cursor-pointer text-xs text-gray-400 font-semibold hover:text-gray-600 transition">
                              <ThumbsUp size={12} /> Hữu ích ({review.likes})
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

