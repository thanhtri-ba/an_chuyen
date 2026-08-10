import { useEffect, useState } from'react';
import { useTranslation } from'react-i18next';
import { motion } from'framer-motion';
import { Loader2, Calendar as CalendarIcon } from'lucide-react';
import axios from'axios';

interface Event {
 id: string;
 title: string;
 description: string;
 imageUrl: string;
 startDate: string;
 endDate: string;
}

export function EventsPage() {
 const { t } = useTranslation();
 const [events, setEvents] = useState<Event[]>([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 const fetchEvents = async () => {
 try {
 const response = await axios.get('http://localhost:3000/api/events');
 setEvents(response.data);
 } catch (error) {
 console.error('Failed to fetch events', error);
 } finally {
 setLoading(false);
 }
 };
 fetchEvents();
 }, []);

 return (
 <div className="pt-24 min-h-screen bg-slate-50 dark:bg-[#0f172a]">
 <div className="container py-12">
 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
 <div className="flex items-center gap-4 mb-8">
 <img src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Party%20popper/3D/party_popper_3d.png" alt="Events" className="w-16 h-16 drop-shadow-lg" />
 <h1 className="text-3xl font-bold text-slate-800 dark:text-white">{t('services.events.title','Sự Kiện Nổi Bật')}</h1>
 </div>

 {loading ? (
 <div className="flex justify-center py-20">
 <Loader2 className="w-8 h-8 animate-spin text-primary" />
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {events.map(event => (
 <div key={event.id} className="bg-white dark:bg-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
 <div className="h-48 relative overflow-hidden">
 <img src={event.imageUrl ||'https://images.unsplash.com/photo-1540039155732-68ee23e15b51?auto=format&fit=crop&q=80&w=800'} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
 </div>
 <div className="p-6">
 <div className="flex flex-wrap items-center gap-2 mb-3">
 <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
 <CalendarIcon className="w-3 h-3" />
 {new Date(event.startDate).toLocaleDateString('vi-VN')}
 </span>
 </div>
 <h3 className="font-bold text-xl text-slate-800 dark:text-white mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
 <p className="text-sm text-slate-500 line-clamp-3 mb-4">{event.description}</p>
 <button className="w-full mt-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-primary hover:text-white px-4 py-3 font-bold transition-colors shadow-sm">
 {t('services.events.bookTicket','Mua Vé Ngay')}
 </button>
 </div>
 </div>
 ))}
 </div>
 )}
 </motion.div>
 </div>
 </div>
 );
}
