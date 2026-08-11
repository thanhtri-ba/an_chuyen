import { useEffect, useState } from'react';
import { useTranslation } from'react-i18next';
import { motion } from'framer-motion';
import { MapPin, Calendar, Settings, User, BatteryCharging, Fuel, ShieldCheck, UploadCloud, ArrowRight, Info, Loader2 } from'lucide-react';
import axios from'axios';

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
 const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/rentals/cars`);
 setCars(response.data);
 } catch (error) {
 console.error('Failed to fetch cars', error);
 } finally {
 setLoading(false);
 }
 };
 fetchCars();
 }, []);

 return (
 <div className="pt-24 min-h-screen bg-[#E5F3FF] dark:bg-slate-900 pb-20">
 <div className="container max-w-6xl mx-auto px-4">
 
 {/* Title */}
 <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-[40px] font-extrabold text-[#0F172A] dark:text-white mb-8 tracking-tight">
 {t('services.rental.mainTitle','Find your perfect ride')}
 </motion.h1>

 {/* Search Bar */}
 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-3 flex flex-wrap lg:flex-nowrap items-center gap-3 mb-8 shadow-sm">
 <div className="flex-1 min-w-[200px] bg-white dark:bg-slate-900 px-4 py-2 flex items-center gap-3 border border-slate-100 dark:border-slate-700">
 <MapPin className="w-5 h-5 text-slate-400" />
 <div className="flex flex-col w-full">
 <span className="text-[10px] font-bold text-slate-400 uppercase">{t('services.rental.location')}</span>
 <input type="text" placeholder={t('services.rental.locationPlaceholder')} className="w-full bg-transparent text-sm font-medium text-slate-800 dark:text-white outline-none" />
 </div>
 </div>
 <div className="w-full md:w-auto min-w-[150px] bg-white dark:bg-slate-900 px-4 py-2 flex items-center gap-3 border border-slate-100 dark:border-slate-700">
 <Calendar className="w-5 h-5 text-slate-400" />
 <div className="flex flex-col w-full">
 <span className="text-[10px] font-bold text-slate-400 uppercase">{t('services.rental.pickup')}</span>
 <input type="text" placeholder={t('services.rental.pickupPlaceholder')} className="w-full bg-transparent text-sm font-medium text-slate-800 dark:text-white outline-none" />
 </div>
 </div>
 <div className="w-full md:w-auto min-w-[150px] bg-white dark:bg-slate-900 px-4 py-2 flex items-center gap-3 border border-slate-100 dark:border-slate-700">
 <Calendar className="w-5 h-5 text-slate-400" />
 <div className="flex flex-col w-full">
 <span className="text-[10px] font-bold text-slate-400 uppercase">{t('services.rental.dropoff')}</span>
 <input type="text" placeholder={t('services.rental.dropoffPlaceholder')} className="w-full bg-transparent text-sm font-medium text-slate-800 dark:text-white outline-none" />
 </div>
 </div>
 <div className="flex flex-col w-full md:w-auto min-w-[200px]">
 <span className="text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">{t('services.rental.driveType')}</span>
 <div className="flex items-center gap-2">
 <button className="flex-1 bg-[#4C3A8A] text-white text-sm font-bold py-2.5 shadow-sm">
 {t('services.rental.selfDrive')}
 </button>
 <button className="flex-1 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-sm font-bold py-2.5 border border-slate-200 dark:border-slate-700">
 {t('services.rental.withDriver')}
 </button>
 </div>
 </div>
 <button className="w-full lg:w-auto bg-[#4C3A8A] hover:bg-[#3D2E6E] text-white px-8 py-3.5 font-bold transition-colors mt-4 lg:mt-0 lg:ml-2 shadow-lg shadow-indigo-900/20">
 {t('services.rental.searchBtn')}
 </button>
 </motion.div>

 {/* Filters */}
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-wrap items-center gap-3 mb-8">
 <button className="bg-[#4C3A8A] text-white px-5 py-2 rounded-full text-sm font-bold shadow-sm">{t('services.rental.filters.recommended')}</button>
 <button className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-5 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">{t('services.rental.filters.priceLowHigh')}</button>
 <button className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-5 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">{t('services.rental.filters.suv')}</button>
 <button className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-5 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">{t('services.rental.filters.electric')}</button>
 </motion.div>

 {/* Main Content */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 
 {/* Left Column: Car List */}
 <div className="lg:col-span-2 space-y-4">
 {loading ? (
 <div className="flex justify-center py-20">
 <Loader2 className="w-8 h-8 animate-spin text-[#4C3A8A]" />
 </div>
 ) : (
 cars.map((car, index) => (
 <motion.div key={car.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + (index * 0.1) }} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-5 flex flex-col md:flex-row gap-6 items-center shadow-sm hover:shadow-md transition-shadow">
 <div className="w-full md:w-56 h-36 bg-[#F3F4F6] dark:bg-slate-700 flex items-center justify-center p-4">
 <img src={car.imageUrl ||"https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Automobile/3D/automobile_3d.png"} alt={car.name} className={`w-full h-full object-contain filter drop-shadow-xl ${car.isBestValue ?'hue-rotate-90' :'hue-rotate-15'}`} />
 </div>
 <div className="flex-1 w-full">
 <div className="flex justify-between items-start mb-1">
 <h3 className="text-xl font-bold text-slate-900 dark:text-white">{car.name}</h3>
 <div className="flex flex-col items-end">
 <div>
 <span className="text-xl font-extrabold text-[#4C3A8A] dark:text-indigo-400">${car.pricePerDay}</span>
 <span className="text-xs text-slate-500">{t('services.rental.cars.perDay')}</span>
 </div>
 {car.isBestValue && (
 <div className="flex items-center gap-1 bg-[#FFF5D1] dark:bg-amber-900/30 text-[#8C6D1F] dark:text-amber-500 text-[9px] font-bold px-1.5 py-0.5 mt-1">
 ✨ {t('services.rental.cars.bestValue','Best Value')}
 </div>
 )}
 </div>
 </div>
 <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{car.description}</p>
 
 <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300 mb-6">
 <div className="flex items-center gap-1.5"><Settings className="w-4 h-4 text-slate-400"/> {car.transmission}</div>
 <div className="flex items-center gap-1.5"><User className="w-4 h-4 text-slate-400"/> {car.seats} {t('services.rental.cars.seats')}</div>
 <div className="flex items-center gap-1.5">
 {car.energyType ==='Electric' ? <BatteryCharging className="w-4 h-4 text-slate-400"/> : <Fuel className="w-4 h-4 text-slate-400"/>} 
 {car.energyType}
 </div>
 </div>
 
 <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-4">
 <div className="flex items-center gap-2 text-xs font-bold text-[#4C3A8A] dark:text-indigo-400">
 {car.insuranceInc && <><ShieldCheck className="w-4 h-4" />{t('services.rental.cars.insuranceIncluded')}</>}
 </div>
 <button className={`${car.isBestValue ?'bg-[#4C3A8A] hover:bg-[#3D2E6E] text-white' :'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-white'} px-6 py-2 text-sm font-bold transition-colors shadow-md`}>
 {t('services.rental.cars.select')}
 </button>
 </div>
 </div>
 </motion.div>
 ))
 )}
 </div>

 {/* Right Column: Widgets */}
 <div className="space-y-6">
 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 shadow-sm border border-slate-100 dark:border-slate-700">
 <h3 className="font-bold text-slate-800 dark:text-white mb-1">{t('services.rental.verification.title')}</h3>
 <p className="text-xs text-slate-500 mb-4">{t('services.rental.verification.desc')}</p>
 <div className="border-2 border-dashed border-indigo-100 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
 <div className="w-10 h-10 bg-indigo-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-2">
 <UploadCloud className="w-5 h-5 text-[#4C3A8A] dark:text-indigo-400" />
 </div>
 <span className="text-xs font-bold text-[#4C3A8A] dark:text-indigo-400">{t('services.rental.verification.clickToUpload')}</span>
 <span className="text-[10px] text-slate-400 mt-1">{t('services.rental.verification.hint')}</span>
 </div>
 <div className="flex items-center gap-1.5 mt-4 text-[10px] text-slate-500">
 <ShieldCheck className="w-3 h-3" />
 {t('services.rental.verification.secure')}
 </div>
 </motion.div>

 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 shadow-sm border border-slate-100 dark:border-slate-700">
 <h3 className="font-bold text-slate-800 dark:text-white mb-6">{t('services.rental.price.title')}</h3>
 <div className="space-y-3 mb-6 border-b border-slate-100 dark:border-slate-700 pb-6">
 <div className="flex justify-between text-sm">
 <span className="text-slate-500">{t('services.rental.price.baseRate')}</span>
 <span className="font-bold text-slate-800 dark:text-white">$135.00</span>
 </div>
 <div className="flex justify-between text-sm">
 <span className="text-slate-500">{t('services.rental.price.insurance')}</span>
 <span className="font-bold text-slate-800 dark:text-white">$45.00</span>
 </div>
 <div className="flex justify-between text-sm">
 <span className="text-slate-500">{t('services.rental.price.taxes')}</span>
 <span className="font-bold text-slate-800 dark:text-white">$18.50</span>
 </div>
 </div>
 <div className="flex justify-between items-center mb-6">
 <span className="font-bold text-slate-800 dark:text-white">{t('services.rental.price.total')}</span>
 <span className="text-xl font-extrabold text-[#4C3A8A] dark:text-indigo-400">$198.50</span>
 </div>
 <div className="bg-[#F6EED8] dark:bg-amber-900/20 text-[#8C6D1F] dark:text-amber-500 text-[10px] p-3 flex gap-2 mb-6 leading-tight">
 <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
 <p>{t('services.rental.price.depositHint')}</p>
 </div>
 <button className="w-full bg-[#4C3A8A] hover:bg-[#3D2E6E] text-white py-3.5 font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-900/20">
 {t('services.rental.price.bookNow')} <ArrowRight className="w-4 h-4" />
 </button>
 </motion.div>
 </div>

 </div>
 </div>
 </div>
 );
}
