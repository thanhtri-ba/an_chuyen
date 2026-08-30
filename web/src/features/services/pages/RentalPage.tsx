import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Settings, User, BatteryCharging, Fuel, ShieldCheck, Loader2 } from 'lucide-react';
import axios from 'axios';
import { ServicePageHeader } from '../components/ServicePageHeader';

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
        console.error('Failed to load rental cars', error);
        toast.error('Lỗi tải danh sách xe tự lái.');
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  return (
    <div className="pt-24 min-h-screen bg-[#fcfcfc] pb-20 font-sans text-[#1a1a1a]">
      <div className="container max-w-6xl mx-auto px-4">

        {/* Title */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <ServicePageHeader
            title={t('services.rental.mainTitle', 'Tìm chuyến xe hoàn hảo')}
            subtitle="Trải nghiệm di chuyển đẳng cấp, tiện nghi và an toàn."
          />
        </motion.div>

        {/* Floating Search Bar (Pill style) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-black/5 backdrop-blur-xl border border-black/10 shadow-xl rounded-full p-2 flex flex-col md:flex-row items-center gap-2 mb-10 relative z-20 mx-auto max-w-5xl">
          <div className="flex-1 w-full flex items-center gap-3 px-6 py-3 rounded-full hover:bg-black/5 transition-colors cursor-pointer border-r border-transparent md:border-black/10">
            <MapPin className="w-6 h-6 text-[#163328]" />
            <div className="flex flex-col w-full">
              <span className="text-[10px] font-extrabold text-[rgba(0,0,0,0.4)] uppercase tracking-widest">{t('services.rental.location', 'Điểm đón')}</span>
              <input type="text" placeholder={t('services.rental.locationPlaceholder', 'Nhập điểm đón...')} className="w-full bg-transparent text-sm font-bold text-[#1a1a1a] outline-none placeholder:font-medium placeholder:text-[rgba(0,0,0,0.3)]" />
            </div>
          </div>

          <div className="w-full md:w-auto flex items-center gap-3 px-6 py-3 rounded-full hover:bg-black/5 transition-colors cursor-pointer border-r border-transparent md:border-black/10">
            <Calendar className="w-6 h-6 text-[#163328]" />
            <div className="flex flex-col min-w-[120px]">
              <span className="text-[10px] font-extrabold text-[rgba(0,0,0,0.4)] uppercase tracking-widest">{t('services.rental.pickup', 'Ngày nhận')}</span>
              <input type="text" placeholder={t('services.rental.pickupPlaceholder', 'Chọn ngày')} className="w-full bg-transparent text-sm font-bold text-[#1a1a1a] outline-none placeholder:font-medium placeholder:text-[rgba(0,0,0,0.3)]" />
            </div>
          </div>

          <div className="w-full md:w-auto flex items-center gap-3 px-6 py-3 rounded-full hover:bg-black/5 transition-colors cursor-pointer border-r border-transparent md:border-black/10">
            <Calendar className="w-6 h-6 text-[#163328]" />
            <div className="flex flex-col min-w-[120px]">
              <span className="text-[10px] font-extrabold text-[rgba(0,0,0,0.4)] uppercase tracking-widest">{t('services.rental.dropoff', 'Ngày trả')}</span>
              <input type="text" placeholder={t('services.rental.dropoffPlaceholder', 'Chọn ngày')} className="w-full bg-transparent text-sm font-bold text-[#1a1a1a] outline-none placeholder:font-medium placeholder:text-[rgba(0,0,0,0.3)]" />
            </div>
          </div>

          <button className="w-full md:w-auto px-10 py-4 rounded-full font-extrabold text-sm md:ml-2 shadow-lg hover:scale-105 transition-transform flex-shrink-0" style={{ background: 'linear-gradient(135deg,#163328,#f0c94a)', color: '#fcfcfc' }}>
            {t('services.rental.searchBtn', 'TÌM XE')}
          </button>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <button className="px-6 py-2.5 rounded-full text-sm font-extrabold shadow-md transition-transform hover:scale-105" style={{ background: 'linear-gradient(135deg,#163328,#f0c94a)', color: '#fcfcfc' }}>Đề xuất</button>
          <button className="bg-black/5 text-[rgba(0,0,0,0.7)] px-6 py-2.5 rounded-full text-sm font-bold border border-black/10 hover:bg-black/10 transition-all">Giá: Thấp - Cao</button>
          <button className="bg-black/5 text-[rgba(0,0,0,0.7)] px-6 py-2.5 rounded-full text-sm font-bold border border-black/10 hover:bg-black/10 transition-all">Xe điện (EV)</button>
          <button className="bg-black/5 text-[rgba(0,0,0,0.7)] px-6 py-2.5 rounded-full text-sm font-bold border border-black/10 hover:bg-black/10 transition-all">Xe SUV 7 chỗ</button>
        </motion.div>

        {/* Main Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#163328]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {cars.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (index * 0.1) }}
                className="rounded-3xl p-6 flex flex-col xl:flex-row gap-8 items-center border border-black/10 hover:border-[#163328]/30 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
                style={{ background: 'rgba(0,0,0,0.025)' }}
              >
                {/* Subtle Background Accent */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#163328]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-[#163328]/10 transition-colors"></div>

                {/* Car Image Area */}
                <div className="w-full xl:w-56 h-40 flex items-center justify-center p-2 relative z-10 shrink-0">
                  <img
                    src={car.imageUrl || "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Automobile/3D/automobile_3d.png"}
                    alt={car.name}
                    loading="lazy"
                    className="w-full h-full object-contain filter drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Car Info Area */}
                <div className="flex-1 w-full relative z-10 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-2xl font-black text-[#1a1a1a] line-clamp-1" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{car.name}</h3>
                        <p className="text-sm font-medium text-[rgba(0,0,0,0.5)] mt-1 line-clamp-2">{car.description}</p>
                      </div>
                      <div className="flex flex-col items-end text-right shrink-0 ml-2">
                        <div className="flex items-end gap-1">
                          <span className="text-2xl font-black text-[#163328]">${car.pricePerDay}</span>
                          <span className="text-xs font-bold text-[rgba(0,0,0,0.4)] mb-1">/ ngày</span>
                        </div>
                        {car.isBestValue && (
                          <div className="flex items-center gap-1 bg-[#163328]/15 text-[#163328] text-[10px] font-extrabold px-2 py-1 rounded-md mt-2 whitespace-nowrap">
                            ✨ Đề Xuất
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-2 mt-4 mb-5">
                      <div className="flex items-center gap-1.5 bg-black/5 px-2.5 py-1 rounded-lg text-[11px] font-bold text-[rgba(0,0,0,0.6)]">
                        <Settings className="w-3.5 h-3.5 text-[#163328]" /> {car.transmission}
                      </div>
                      <div className="flex items-center gap-1.5 bg-black/5 px-2.5 py-1 rounded-lg text-[11px] font-bold text-[rgba(0,0,0,0.6)]">
                        <User className="w-3.5 h-3.5 text-[#163328]" /> {car.seats} Ghế
                      </div>
                      <div className="flex items-center gap-1.5 bg-black/5 px-2.5 py-1 rounded-lg text-[11px] font-bold text-[rgba(0,0,0,0.6)]">
                        {car.energyType === 'Electric' ? <BatteryCharging className="w-3.5 h-3.5 text-emerald-400"/> : <Fuel className="w-3.5 h-3.5 text-orange-400"/>}
                        {car.energyType}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between border-t border-black/10 pt-4 mt-auto">
                    <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-400">
                      {car.insuranceInc && <><ShieldCheck className="w-4 h-4" /> Có bảo hiểm</>}
                    </div>
                    <button className="px-6 py-2 rounded-xl text-sm font-extrabold transition-colors" style={{ background: 'linear-gradient(135deg,#163328,#f0c94a)', color: '#fcfcfc' }}>
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
