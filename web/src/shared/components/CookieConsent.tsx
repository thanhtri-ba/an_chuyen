import { useState, useEffect } from'react';
import { motion, AnimatePresence } from'framer-motion';
import { Cookie, X } from'lucide-react';
import { Button } from'../../design-system/components/Button';

export function CookieConsent() {
 const [show, setShow] = useState(false);

 useEffect(() => {
 const consent = localStorage.getItem('cookie_consent');
 if (!consent) {
 // Delay showing the banner slightly for better UX
 const timer = setTimeout(() => setShow(true), 1500);
 return () => clearTimeout(timer);
 }
 }, []);

 const handleAccept = () => {
 localStorage.setItem('cookie_consent','accepted');
 setShow(false);
 };

 const handleReject = () => {
 localStorage.setItem('cookie_consent','rejected');
 setShow(false);
 };

 return (
 <AnimatePresence>
 {show && (
 <motion.div
 initial={{ y: 150, opacity: 0 }}
 animate={{ y: 0, opacity: 1 }}
 exit={{ y: 150, opacity: 0 }}
 transition={{ type:"spring", stiffness: 200, damping: 25 }}
 className="fixed bottom-0 left-0 right-0 z-[100] pointer-events-none"
 >
 <div className="w-full pointer-events-auto bg-white shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.15)] border-t border-gray-200">
 <div className="max-w-[1400px] mx-auto p-5 flex flex-col lg:flex-row items-center gap-6 justify-between overflow-hidden relative">
 {/* Background gradient decoration */}
 <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
 
 <div className="flex items-start lg:items-center gap-4 flex-1 relative z-10">
 <div className="hidden sm:flex w-12 h-12 bg-red-50 rounded-full items-center justify-center flex-shrink-0 border border-red-100">
 <Cookie className="w-6 h-6 text-red-500" />
 </div>
 <div>
 <h3 className="font-bold text-gray-900 text-sm md:text-base mb-1 flex items-center gap-2">
 <Cookie className="w-4 h-4 text-red-500 sm:hidden" />
 Bảo mật & Quyền riêng tư
 </h3>
 <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
 LunaTravel Business sử dụng cookie cần thiết để website hoạt động ổn định. Khi bạn đồng ý, chúng tôi sử dụng thêm cookie phân tích và đo lường để hiểu cách bạn tương tác với trang web, nhằm nâng cao trải nghiệm đặt vé.
 </p>
 </div>
 </div>

 <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto flex-shrink-0 relative z-10">
 <Button 
 variant="outline" 
 onClick={handleReject}
 className="w-full sm:w-auto font-bold border-gray-200 text-gray-700 hover:bg-gray-50 h-11"
 >
 Từ chối
 </Button>
 <Button 
 onClick={handleAccept}
 className="w-full sm:w-auto font-bold bg-primary hover:bg-primary-hover text-white h-11 px-8 shadow-md shadow-primary/20"
 >
 Chấp nhận tất cả
 </Button>
 <button 
 onClick={() => setShow(false)}
 className="absolute -top-2 -right-2 lg:static lg:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
 aria-label="Đóng"
 >
 <X className="w-5 h-5" />
 </button>
 </div>
 </div>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 );
}
