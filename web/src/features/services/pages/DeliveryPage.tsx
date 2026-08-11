import { useEffect, useState } from'react';
import { useTranslation } from'react-i18next';
import { motion, AnimatePresence } from'framer-motion';
import { FileText, Package, Truck, MapPin, Navigation, Clock, Loader2, CheckCircle2, UserCircle } from'lucide-react';
import axios from'axios';
import { DeliveryMap } from'../components/DeliveryMap';

interface Vehicle {
 id: string;
 name: string;
 description: string;
 price: number;
}

// Haversine distance formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
 const R = 6371; // km
 const dLat = (lat2 - lat1) * Math.PI / 180;
 const dLon = (lon2 - lon1) * Math.PI / 180;
 const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
 Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
 Math.sin(dLon/2) * Math.sin(dLon/2);
 const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
 return R * c;
}

export function DeliveryPage() {
 const { t } = useTranslation();
 
 // Data states
 const [vehicles, setVehicles] = useState<Vehicle[]>([]);
 const [loading, setLoading] = useState(true);
 
 // Booking states
 const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
 const [packageType, setPackageType] = useState('Document');
 const [pickup, setPickup] = useState('');
 const [dropoff, setDropoff] = useState('');
 
 // Geocoding & Map states
 const [originCoords, setOriginCoords] = useState<[number, number]>([10.7725, 106.6980]);
 const [destCoords, setDestCoords] = useState<[number, number]>([10.7725, 106.6980]);
 const [distance, setDistance] = useState(0);
 const [isGeocoding, setIsGeocoding] = useState(false);
 
 // Workflow state
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [isSuccess, setIsSuccess] = useState(false);
 
 // Tracking state
 const [driverPos, setDriverPos] = useState<[number, number]>([10.785, 106.680]);
 const [trackingProgress, setTrackingProgress] = useState(60);

 useEffect(() => {
 const fetchVehicles = async () => {
 try {
 const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/deliveries/vehicles`);
 setVehicles(response.data);
 if (response.data.length > 0) {
 setSelectedVehicle(response.data[1]?.id || response.data[0]?.id);
 }
 } catch (error) {
 console.error('Failed to fetch vehicles', error);
 } finally {
 setLoading(false);
 }
 };
 fetchVehicles();
 }, []);

 // Debounced Geocoding
 useEffect(() => {

 
 const geocode = async () => {
 setIsGeocoding(true);
 try {
 // Use Nominatim OSM for free geocoding
 const resPickup = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(pickup)}`);
 const resDropoff = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(dropoff)}`);
 
 let o: [number, number] = originCoords;
 let d: [number, number] = destCoords;

 if (resPickup.data && resPickup.data.length > 0) {
 o = [parseFloat(resPickup.data[0].lat), parseFloat(resPickup.data[0].lon)];
 setOriginCoords(o);
 }
 if (resDropoff.data && resDropoff.data.length > 0) {
 d = [parseFloat(resDropoff.data[0].lat), parseFloat(resDropoff.data[0].lon)];
 setDestCoords(d);
 }
 
 // Compute distance
 const dist = calculateDistance(o[0], o[1], d[0], d[1]);
 setDistance(dist < 1 ? 1 : dist); // min 1km
 } catch (error) {
 console.error("Geocoding failed", error);
 } finally {
 setIsGeocoding(false);
 }
 };

 const timer = setTimeout(() => {
 if (pickup && dropoff) geocode();
 }, 1000);

 return () => clearTimeout(timer);
 }, [pickup, dropoff]);



 const getDynamicPrice = () => {
 const v = vehicles.find(x => x.id === selectedVehicle);
 if (!v) return 0;
 // Price = base + distance * base/2
 return v.price + (distance * (v.price * 0.15));
 };

 const handleConfirm = async () => {
 if (!selectedVehicle || !pickup || !dropoff) return;
 
 setIsSubmitting(true);
 try {
 await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/deliveries/book`, {
 userId:'f47ac10b-58cc-4372-a567-0e02b2c3d479', 
 vehicleId: selectedVehicle,
 packageType,
 pickupLocation: pickup,
 dropoffLocation: dropoff,
 totalAmount: getDynamicPrice()
 });
 setIsSuccess(true);
 setTimeout(() => setIsSuccess(false), 3000);
 } catch (error) {
 console.error('Failed to book delivery', error);
 alert('Có lỗi xảy ra khi đặt giao hàng');
 } finally {
 setIsSubmitting(false);
 }
 };

 const getEstimatedMinutes = () => Math.round(distance * 4); // roughly 15km/h in city = 4 mins/km

 return (
 <div className="pt-24 min-h-screen bg-gray-50 dark:bg-slate-950 pb-20 font-sans">
 <div className="container max-w-6xl mx-auto px-4">
 
 <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-extrabold text-primary mb-6">
 Book a Delivery
 </motion.h1>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 {/* Left Column */}
 <div className="space-y-6">
 
 <AnimatePresence mode="wait">
 <motion.div 
 key="booking-form"
 initial={{ opacity: 0, x: -20 }} 
 animate={{ opacity: 1, x: 0 }} 
 className="space-y-6"
 >
 {/* Package Type */}
 <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 shadow-sm">
 <h3 className="text-gray-900 dark:text-white font-bold mb-4">1. Package Type</h3>
 <div className="grid grid-cols-3 gap-3">
 {[
 { id:'Document', icon: FileText, label:'Document' },
 { id:'Parcel', icon: Package, label:'Parcel' },
 { id:'Heavy Goods', icon: Truck, label:'Heavy Goods' },
 ].map(type => (
 <button
 key={type.id}
 onClick={() => setPackageType(type.id)}
 className={`flex flex-col items-center justify-center p-3 border-2 transition-all ${
 packageType === type.id 
 ?'border-primary bg-primary/10 text-primary' 
 :'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-700'
 }`}
 >
 <type.icon className="w-6 h-6 mb-2" />
 <span className="text-xs font-bold">{type.label}</span>
 </button>
 ))}
 </div>
 </div>

 {/* Locations */}
 <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 shadow-sm">
 <div className="flex justify-between items-center mb-4">
 <h3 className="text-gray-900 dark:text-white font-bold">2. Locations</h3>
 {isGeocoding && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
 </div>
 
 <div className="relative">
 <div className="absolute left-[15px] top-[24px] bottom-[24px] w-0.5 bg-slate-200 dark:bg-slate-700"></div>
 
 <div className="flex items-center gap-4 mb-4 relative">
 <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center z-10 shrink-0 shadow-md">
 <MapPin className="w-4 h-4 text-white" />
 </div>
 <input type="text" value={pickup} onChange={e => setPickup(e.target.value)} placeholder="Nhập điểm lấy hàng..." className="w-full bg-gray-50 dark:bg-slate-800 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-transparent focus:border-primary/30" />
 </div>
 
 <div className="flex items-center gap-4 relative">
 <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-4 border-primary z-10 shrink-0 shadow-sm"></div>
 <input type="text" value={dropoff} onChange={e => setDropoff(e.target.value)} placeholder="Nhập điểm giao hàng..." className="w-full bg-gray-50 dark:bg-slate-800 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-transparent focus:border-primary/30" />
 </div>
 </div>
 </div>

 {/* Select Vehicle */}
 <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 shadow-sm">
 <h3 className="text-gray-900 dark:text-white font-bold mb-4">3. Select Vehicle</h3>
 {loading ? (
 <div className="flex justify-center py-10">
 <Loader2 className="w-6 h-6 animate-spin text-primary" />
 </div>
 ) : (
 <div className="space-y-3">
 {vehicles.map(v => {
 const dynPrice = v.price + (distance * (v.price * 0.15));
 return (
 <div 
 key={v.id} 
 onClick={() => setSelectedVehicle(v.id)}
 className={`flex items-center p-3 border-2 cursor-pointer transition-all ${
 selectedVehicle === v.id 
 ?'border-primary bg-primary/5 shadow-md shadow-primary/5' 
 :'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700'
 }`}
 >
 <div className={`w-12 h-12 flex items-center justify-center mr-4 ${selectedVehicle === v.id ?'bg-primary text-primary-foreground' :'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
 <Truck className="w-6 h-6" />
 </div>
 <div className="flex-1">
 <h4 className="text-sm font-bold text-slate-800 dark:text-white">{v.name}</h4>
 <p className="text-xs text-slate-500 dark:text-slate-400">{v.description}</p>
 </div>
 <div className="text-lg font-extrabold text-gray-900 dark:text-white">
 ${dynPrice.toFixed(2)}
 </div>
 </div>
 );
 })}
 </div>
 )}
 </div>
 </motion.div>
 </AnimatePresence>
 </div>

 {/* Right Column */}
 <div className="flex flex-col gap-6">
 
 {/* Map Area */}
 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-4 shadow-sm flex-1 relative overflow-hidden flex flex-col min-h-[500px]">
 
 <div className="flex justify-between items-center gap-4 mb-4 z-10 relative">
 <div className="bg-white dark:bg-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none rounded-full px-5 py-2.5 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
 <Clock className="w-4 h-4 text-primary" /> 
 Est. {getEstimatedMinutes()} mins
 </div>
 <div className="bg-white dark:bg-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none rounded-full px-5 py-2.5 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
 <Navigation className="w-4 h-4 text-primary" /> {distance.toFixed(1)} km
 </div>
 </div>
 
 {/* Map implementation */}
 <DeliveryMap origin={originCoords} dest={destCoords} isTracking={true} driverPos={driverPos} />
 
 {isSuccess && (
 <div className="mt-auto relative z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 shadow-xl border border-white/50 dark:border-slate-800 m-2">
 <div className="flex justify-between items-start mb-4">
 <div>
 <h4 className="font-bold text-slate-800 dark:text-white text-sm">Giao đến</h4>
 <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{dropoff}</p>
 </div>
 <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
 Đang tìm tài xế...
 </div>
 </div>
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
 <div className="flex-1">
 <p className="text-xs font-bold text-slate-800 dark:text-white">Đang tìm tài xế... <span className="text-slate-400 dark:text-slate-500 font-normal">--</span></p>
 </div>
 </div>
 <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
 <div className="bg-primary w-[60%] h-full rounded-full"></div>
 </div>
 </div>
 )}
 </motion.div>
 
 {/* Total Card */}
 <motion.div 
 initial={{ opacity: 0, y: 20 }} 
 animate={{ opacity: 1, y: 0 }} 
 className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 shadow-sm flex items-center justify-between"
 >
 <div>
 <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Estimated Cost</p>
 <p className="text-3xl font-extrabold text-gray-900 dark:text-white">
 ${getDynamicPrice().toFixed(2)}
 </p>
 </div>
 <button 
 disabled={isSubmitting || isSuccess || isGeocoding}
 onClick={handleConfirm}
 className={`px-8 py-4 font-bold transition-all shadow-lg flex items-center gap-2
 ${isSuccess 
 ?'bg-emerald-500 text-white shadow-emerald-500/20' 
 :'bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20'
 }
 ${(isSubmitting || isGeocoding) ?'opacity-70 cursor-not-allowed' :''}
 `}
 >
 {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
 {isSuccess ? (
 <><CheckCircle2 className="w-5 h-5" /> Confirmed!</>
 ) : (
'Confirm Delivery'
 )}
 </button>
 </motion.div>
 </div>
 </div>
 </div>
 </div>
 );
}
