import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Settings, User, BatteryCharging, Fuel, ShieldCheck, UploadCloud, ArrowRight, Info, Loader2 } from 'lucide-react';
import axios from 'axios';

interface Car {
  id: string;
  name: string;
  description: string;
  type: string;
  seats: number;
  transmission: string;
  energyType: string;
  pricePerDay: number;
  imageUrl: string;
  isBestValue: boolean;
  insuranceInc: boolean;
}

export function RentalPage() {
  const { t } = useTranslation();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
        const response = await axios.get(`${baseUrl}/api/rentals/cars`);
        setCars(response.data);
      } catch (error) {
        toast.error('Lỗi tải danh sách xe tự lái.');
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  return (
    <div className="pt-24 min-h-screen bg-slate-50 pb-20 font-sans">
      <div className="container max-w-6xl mx-auto px-4">
        
        {/* Title */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3 tracking-tight">
            {t('services.rental.mainTitle', 'Tìm chuyến xe hoàn hảo')}
          </h1>
          <p className="text-gray-500 font-medium text-lg">Trải nghiệm di chuyển đẳng cấp, tiện nghi và an toàn.</p>
        </motion.div>

        {/* Floating Search Bar (Pill style) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl border border-white shadow-xl shadow-primary/5 rounded-full p-2 flex flex-col md:flex-row items-center gap-2 mb-10 relative z-20 mx-auto max-w-5xl">
          <div className="flex-1 w-full flex items-center gap-3 px-6 py-3 rounded-full hover:bg-slate-50 transition-colors cursor-pointer border-r border-transparent md:border-slate-100">
            <MapPin className="w-6 h-6 text-primary" />
            <div className="flex flex-col w-full">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">{t('services.rental.location', 'Điểm đón')}</span>
              <input type="text" placeholder={t('services.rental.locationPlaceholder', 'Nhập điểm đón...')} className="w-full bg-transparent text-sm font-bold text-gray-900 outline-none placeholder:font-medium placeholder:text-gray-400" />
            </div>
          </div>
          
          <div className="w-full md:w-auto flex items-center gap-3 px-6 py-3 rounded-full hover:bg-slate-50 transition-colors cursor-pointer border-r border-transparent md:border-slate-100">
            <Calendar className="w-6 h-6 text-primary" />
            <div className="flex flex-col min-w-[120px]">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">{t('services.rental.pickup', 'Ngày nhận')}</span>
              <input type="text" placeholder={t('services.rental.pickupPlaceholder', 'Chọn ngày')} className="w-full bg-transparent text-sm font-bold text-gray-900 outline-none placeholder:font-medium placeholder:text-gray-400" />
            </div>
          </div>
          
          <div className="w-full md:w-auto flex items-center gap-3 px-6 py-3 rounded-full hover:bg-slate-50 transition-colors cursor-pointer border-r border-transparent md:border-slate-100">
            <Calendar className="w-6 h-6 text-primary" />
            <div className="flex flex-col min-w-[120px]">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">{t('services.rental.dropoff', 'Ngày trả')}</span>
              <input type="text" placeholder={t('services.rental.dropoffPlaceholder', 'Chọn ngày')} className="w-full bg-transparent text-sm font-bold text-gray-900 outline-none placeholder:font-medium placeholder:text-gray-400" />
            </div>
          </div>

          <button className="w-full md:w-auto btn-primary px-10 py-4 rounded-full font-extrabold text-sm md:ml-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform flex-shrink-0">
            {t('services.rental.searchBtn', 'TÌM XE')}
          </button>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <button className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-extrabold shadow-md shadow-primary/20 transition-transform hover:scale-105">Đề xuất</button>
          <button className="bg-white text-gray-600 px-6 py-2.5 rounded-full text-sm font-bold shadow-sm border border-gray-100 hover:bg-gray-50 transition-all">Giá: Thấp - Cao</button>
          <button className="bg-white text-gray-600 px-6 py-2.5 rounded-full text-sm font-bold shadow-sm border border-gray-100 hover:bg-gray-50 transition-all">Xe điện (EV)</button>
          <button className="bg-white text-gray-600 px-6 py-2.5 rounded-full text-sm font-bold shadow-sm border border-gray-100 hover:bg-gray-50 transition-all">Xe SUV 7 chỗ</button>
        </motion.div>

        {/* Main Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {cars.map((car, index) => (
              <motion.div 
                key={car.id} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 + (index * 0.1) }} 
                className="bg-white rounded-3xl p-6 flex flex-col xl:flex-row gap-8 items-center shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
              >
                {/* Subtle Background Accent */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-primary/10 transition-colors"></div>

                {/* Car Image Area */}
                <div className="w-full xl:w-56 h-40 flex items-center justify-center p-2 relative z-10 shrink-0">
                  <img 
                    src={car.imageUrl || "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Automobile/3D/automobile_3d.png"} 
                    alt={car.name} 
                    loading="lazy" 
                    className={`w-full h-full object-contain filter drop-shadow-2xl transition-transform duration-500 group-hover:scale-110 ${car.isBestValue ? 'hue-rotate-90' : ''}`} 
                  />
                </div>
                
                {/* Car Info Area */}
                <div className="flex-1 w-full relative z-10 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-2xl font-black text-gray-900 line-clamp-1">{car.name}</h3>
                        <p className="text-sm font-medium text-gray-500 mt-1 line-clamp-2">{car.description}</p>
                      </div>
                      <div className="flex flex-col items-end text-right shrink-0 ml-2">
                        <div className="flex items-end gap-1">
                          <span className="text-2xl font-black text-primary">${car.pricePerDay}</span>
                          <span className="text-xs font-bold text-gray-400 mb-1">/ ngày</span>
                        </div>
                        {car.isBestValue && (
                          <div className="flex items-center gap-1 bg-amber-100 text-amber-700 text-[10px] font-extrabold px-2 py-1 rounded-md mt-2 shadow-sm whitespace-nowrap">
                            ✨ Đề Xuất
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-2 mt-4 mb-5">
                      <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg text-[11px] font-bold text-gray-600">
                        <Settings className="w-3.5 h-3.5 text-primary" /> {car.transmission}
                      </div>
                      <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg text-[11px] font-bold text-gray-600">
                        <User className="w-3.5 h-3.5 text-primary" /> {car.seats} Ghế
                      </div>
                      <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg text-[11px] font-bold text-gray-600">
                        {car.energyType === 'Electric' ? <BatteryCharging className="w-3.5 h-3.5 text-emerald-500"/> : <Fuel className="w-3.5 h-3.5 text-orange-500"/>} 
                        {car.energyType}
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                    <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-600">
                      {car.insuranceInc && <><ShieldCheck className="w-4 h-4" /> Có bảo hiểm</>}
                    </div>
                    <button className="bg-gray-900 hover:bg-primary text-white px-6 py-2 rounded-xl text-sm font-extrabold transition-colors shadow-md">
                      Chọn xe
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
