import { useState, useEffect } from'react';
import { ArrowRight, ArrowUpRight, ArrowLeft } from'lucide-react';
import { Button } from'../../../design-system/components/Button';
import { motion } from'framer-motion';
import api from'../../../lib/api';

const DEFAULT_SERVICES = [
 {
 title:'THUÊ XE HỢP ĐỒNG',
 image:'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600&auto=format&fit=crop',
 desc:'Lựa chọn dòng xe phù hợp cho mọi chuyến đi gia đình hoặc công tác',
 hasArrowRight: false
 },
 {
 title:'GIAO HÀNG TẬN NƠI',
 image:'https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=600&auto=format&fit=crop',
 desc:'Chúng tôi hỗ trợ vận chuyển hàng hóa nhanh chóng và an toàn',
 hasArrowRight: false
 },
 {
 title:'ĐƯA ĐÓN SÂN BAY',
 image:'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=600&auto=format&fit=crop',
 desc:'Đúng giờ, chuyên nghiệp và dịch vụ chăm sóc tận tình',
 hasArrowRight: true,
 highlight:'DỊCH VỤ MỚI'
 }
];

const DEFAULT_SPECIALISTS = [
 { name:'Phương Trang', role:'ĐỐI TÁC CHIẾN LƯỢC', quote:'"Sự an toàn và hài lòng của hành khách luôn là ưu tiên hàng đầu trên mỗi cung đường."', image:'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop' },
 { name:'Thành Bưởi', role:'ĐỐI TÁC VẬN TẢI', quote:'"Đội ngũ tài xế dày dạn kinh nghiệm, sẵn sàng phục vụ 24/7."', image:'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop' },
 { name:'Hải Vân', role:'ĐỐI TÁC VẬN TẢI', quote:'"Dịch vụ chuẩn 5 sao, mang lại trải nghiệm khác biệt hoàn toàn."', image:'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop' }
];

export function AboutPage() {
 const [activeSpecialist, setActiveSpecialist] = useState(0);
 const [services, setServices] = useState(DEFAULT_SERVICES);
 const [specialists, setSpecialists] = useState(DEFAULT_SPECIALISTS);
 const [, setLoading] = useState(true);

 useEffect(() => {
 const fetchConfig = async () => {
 try {
 const { data } = await api.get('/configs');
 if (data && data.about_page_content) {
 const parsed = JSON.parse(data.about_page_content);
 if (parsed.services && parsed.services.length > 0) setServices(parsed.services);
 if (parsed.specialists && parsed.specialists.length > 0) setSpecialists(parsed.specialists);
 }
 } catch (err) {
 console.error('Failed to load about page content', err);
 } finally {
 setLoading(false);
 }
 };
 fetchConfig();
 }, []);

 return (
 <div className="min-h-screen bg-[#f9f8f6] relative pt-24 pb-32">
 {/* Right accent border */}
 <div className="absolute top-0 right-0 bottom-0 w-8 md:w-16 bg-[#e9e1d3] z-0"></div>

 <div className="container relative z-10 max-w-7xl mx-auto px-4 md:px-8 xl:pr-24">
 
 {/* ================= SECTION 1: SERVICES ================= */}
 <section className="mb-32">
 <div className="flex flex-col">
 {services.map((service, idx) => (
 <motion.div 
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin:"-100px" }}
 transition={{ duration: 0.6, delay: idx * 0.1 }}
 key={idx} 
 className="flex flex-col md:flex-row items-center justify-between py-12 border-b border-gray-300 gap-8 group"
 >
 <div className="w-full md:w-1/4">
 {service.highlight && (
 <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 w-max mb-2">{service.highlight}</div>
 )}
 <h3 className="font-sans font-bold text-lg md:text-xl text-gray-800 uppercase tracking-widest transition-colors group-hover:text-red-500">{service.title}</h3>
 </div>
 <div className="w-full md:w-2/4 flex justify-center overflow-hidden shadow-sm">
 <img src={service.image} alt={service.title} className="w-full max-w-[400px] h-[250px] object-cover transition-transform duration-700 group-hover:scale-110" />
 </div>
 <div className="w-full md:w-1/4 flex items-center justify-between text-gray-600 font-medium text-sm md:text-right pr-4">
 <p className="max-w-[200px]">{service.desc}</p>
 {service.hasArrowRight ? (
 <ArrowRight className="w-6 h-6 text-red-400 stroke-[1.5] transition-transform group-hover:translate-x-2" />
 ) : (
 <ArrowUpRight className="w-6 h-6 text-gray-400 stroke-[1.5] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-red-400" />
 )}
 </div>
 </motion.div>
 ))}
 </div>
 </section>

 {/* ================= SECTION 2: OUR SPECIALISTS ================= */}
 <motion.section 
 initial={{ opacity: 0 }}
 whileInView={{ opacity: 1 }}
 viewport={{ once: true, margin:"-100px" }}
 transition={{ duration: 0.8 }}
 className="mb-32"
 >
 <div className="flex justify-between items-center mb-12">
 <h2 className="font-serif text-5xl md:text-7xl lg:text-[100px] font-thin tracking-widest text-slate-800 scale-y-125 origin-left">ĐỐI TÁC</h2>
 <div className="flex items-center gap-2">
 <button 
 onClick={() => setActiveSpecialist((prev) => (prev > 0 ? prev - 1 : specialists.length - 1))}
 className="w-12 h-12 border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors z-10"
 >
 <ArrowLeft className="w-5 h-5 text-gray-600" />
 </button>
 <button 
 onClick={() => setActiveSpecialist((prev) => (prev < specialists.length - 1 ? prev + 1 : 0))}
 className="w-12 h-12 bg-[#1e2a3a] flex items-center justify-center hover:bg-[#2a3b52] transition-colors z-10"
 >
 <ArrowRight className="w-5 h-5 text-white" />
 </button>
 </div>
 </div>

 <div className="flex border-b border-gray-300 mb-12 overflow-x-auto hide-scrollbar">
 {specialists.map((spec, idx) => (
 <div 
 key={idx} 
 onClick={() => setActiveSpecialist(idx)}
 className={`flex-1 min-w-[200px] pb-4 cursor-pointer border-b-2 transition-all ${activeSpecialist === idx ?'border-gray-800' :'border-transparent text-gray-400 hover:text-gray-600'}`}
 >
 <div className={`font-bold text-lg ${activeSpecialist === idx ?'text-gray-900' :''}`}>{spec.name}</div>
 <div className="text-[10px] uppercase tracking-widest mt-1">{spec.role}</div>
 </div>
 ))}
 </div>

 {specialists.length > 0 && (
 <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center min-h-[500px]">
 <motion.div 
 key={`text-${activeSpecialist}`}
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ duration: 0.5 }}
 className="md:col-span-5 pr-8"
 >
 <h3 className="font-serif text-3xl md:text-5xl font-thin tracking-wider text-slate-800 leading-tight mb-8">
 {specialists[activeSpecialist].quote}
 </h3>
 <div className="font-bold text-gray-900">{specialists[activeSpecialist].name}</div>
 <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-1 mb-16">{specialists[activeSpecialist].role}</div>
 <Button variant="link" className="text-red-500 font-bold tracking-widest text-xs uppercase hover:text-red-600 px-0 group">
 Tìm hiểu thêm
 <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-2" />
 </Button>
 </motion.div>
 <motion.div 
 key={`image-${activeSpecialist}`}
 initial={{ opacity: 0, filter:'blur(10px)' }}
 animate={{ opacity: 1, filter:'blur(0px)' }}
 transition={{ duration: 0.6 }}
 className="md:col-span-7 flex justify-end"
 >
 <img 
 src={specialists[activeSpecialist].image} 
 alt={specialists[activeSpecialist].name} 
 className="w-full md:w-[80%] h-[500px] object-cover shadow-xl" 
 />
 </motion.div>
 </div>
 )}
 </motion.section>

 {/* ================= SECTION 3: BOOK AN APPOINTMENT ================= */}
 <motion.section
 initial={{ opacity: 0, y: 50 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin:"-50px" }}
 transition={{ duration: 0.8 }}
 >
 <h2 className="font-serif text-4xl md:text-6xl lg:text-[80px] font-thin tracking-widest text-slate-800 scale-y-125 origin-left mb-24">LIÊN HỆ TƯ VẤN</h2>
 
 <form className="max-w-5xl">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-12">
 <div className="border-b border-gray-300 pb-2 transition-colors focus-within:border-gray-800">
 <label className="text-[10px] uppercase tracking-widest text-gray-500 block mb-2 font-bold">Họ và tên</label>
 <input type="text" placeholder="Nguyễn Văn A" className="w-full bg-transparent border-none focus:ring-0 text-lg font-medium placeholder-gray-400 px-0 outline-none" />
 </div>
 <div className="border-b border-gray-300 pb-2 transition-colors focus-within:border-gray-800">
 <label className="text-[10px] uppercase tracking-widest text-gray-500 block mb-2 font-bold">Số điện thoại</label>
 <input type="tel" placeholder="+84 (900) 123-456" className="w-full bg-transparent border-none focus:ring-0 text-lg font-medium placeholder-gray-400 px-0 outline-none" />
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
 <div>
 <label className="text-[10px] uppercase tracking-widest text-gray-500 block mb-4 font-bold">Dịch vụ</label>
 <div className="flex flex-wrap gap-3">
 <button type="button" className="bg-[#1e2a3a] text-white text-xs font-bold px-6 py-3 border border-[#1e2a3a] transition-all hover:scale-105 active:scale-95">Thuê xe</button>
 <button type="button" className="bg-transparent text-gray-600 hover:bg-gray-100 hover:border-gray-400 text-xs font-bold px-6 py-3 border border-gray-300 transition-all hover:scale-105 active:scale-95">Giao hàng</button>
 <button type="button" className="bg-transparent text-gray-600 hover:bg-gray-100 hover:border-gray-400 text-xs font-bold px-6 py-3 border border-gray-300 transition-all hover:scale-105 active:scale-95">Đưa đón</button>
 </div>
 </div>
 <div>
 <label className="text-[10px] uppercase tracking-widest text-gray-500 block mb-4 font-bold">Ngày đi</label>
 <div className="flex flex-wrap gap-3">
 <button type="button" className="bg-[#1e2a3a] text-white text-xs font-bold px-6 py-3 border border-[#1e2a3a] transition-all hover:scale-105 active:scale-95">Hôm nay</button>
 <button type="button" className="bg-transparent text-gray-600 hover:bg-gray-100 hover:border-gray-400 text-xs font-bold px-6 py-3 border border-gray-300 transition-all hover:scale-105 active:scale-95">Ngày mai</button>
 <button type="button" className="bg-transparent text-gray-600 hover:bg-gray-100 hover:border-gray-400 text-xs font-bold px-6 py-3 border border-gray-300 transition-all hover:scale-105 active:scale-95">Chọn ngày</button>
 </div>
 </div>
 </div>

 <button type="submit" className="w-full bg-[#d65555] hover:bg-[#c04b4b] text-white font-bold tracking-widest uppercase py-5 transition-all hover:shadow-lg active:scale-[0.99]">
 GỬI YÊU CẦU
 </button>
 </form>
 </motion.section>

 </div>
 </div>
 );
}
