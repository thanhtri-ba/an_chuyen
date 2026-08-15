import { useState } from 'react';
import { Bell, Ticket, Gift, Check, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type NotificationType = 'system' | 'promo' | 'booking';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: NotificationType;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { 
    id: '1', 
    title: 'Chuyến đi sắp khởi hành', 
    message: 'Chuyến xe Sài Gòn - Đà Lạt của bạn sẽ khởi hành lúc 08:30 ngày 20/11. Vui lòng có mặt tại bến trước 30 phút để hoàn tất thủ tục lên xe.', 
    time: '2 giờ trước', 
    unread: true, 
    type: 'booking' 
  },
  { 
    id: '2', 
    title: 'Khuyến mãi đặc biệt dành cho bạn', 
    message: 'Nhập mã ANCHUYEN15 để được giảm 15% (tối đa 50k) cho chuyến đi tiếp theo. Ưu đãi có hạn, áp dụng ngay!', 
    time: '1 ngày trước', 
    unread: true, 
    type: 'promo' 
  },
  { 
    id: '3', 
    title: 'Thanh toán thành công', 
    message: 'Giao dịch 350.000đ cho mã vé BZ-982314 đã được xác nhận thành công. Xem chi tiết vé trong mục Chuyến đi của tôi.', 
    time: '2 ngày trước', 
    unread: false, 
    type: 'system' 
  },
  { 
    id: '4', 
    title: 'Cập nhật điều khoản dịch vụ', 
    message: 'An Chuyến vừa cập nhật chính sách hoàn hủy vé dịp lễ tết. Vui lòng kiểm tra để biết thêm chi tiết.', 
    time: '5 ngày trước', 
    unread: false, 
    type: 'system' 
  }
];

const FILTERS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'unread', label: 'Chưa đọc' },
  { id: 'promo', label: 'Khuyến mãi' },
  { id: 'system', label: 'Hệ thống' }
];

export function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState('all');

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'unread') return n.unread;
    if (activeFilter === 'promo') return n.type === 'promo';
    if (activeFilter === 'system') return n.type === 'system' || n.type === 'booking';
    return true; // 'all'
  });

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'promo': return <Gift className="w-6 h-6" />;
      case 'booking': return <Ticket className="w-6 h-6" />;
      default: return <Info className="w-6 h-6" />;
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pt-24 pb-20 relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-50/80 via-white to-[#f8fafc] -z-10" />
      
      <div className="container px-4 max-w-4xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1.5 bg-white text-gray-500 rounded-full font-bold text-xs mb-4 border border-gray-100 shadow-sm">
              <Bell className="w-3.5 h-3.5 text-primary" /> Notification Center
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl md:text-4xl font-black text-[#0f2c59] tracking-tight">
              Thông báo của bạn
            </motion.h1>
          </div>
          
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <button 
              onClick={markAllAsRead}
              className="flex items-center gap-2 text-sm font-bold text-primary hover:text-[#1a4b96] bg-primary/5 hover:bg-primary/10 px-4 py-2.5 rounded-xl transition-colors"
            >
              <Check className="w-4 h-4" /> Đánh dấu đã đọc tất cả
            </button>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 w-fit"
        >
          {FILTERS.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-5 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${
                activeFilter === filter.id 
                  ? 'bg-[#0f2c59] text-white shadow-md' 
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>

        {/* Notification List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notif, idx) => (
                <motion.div 
                  layout
                  key={notif.id}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  transition={{ delay: idx * 0.05, duration: 0.3 }}
                  onClick={() => notif.unread && markAsRead(notif.id)}
                  className={`relative group overflow-hidden rounded-[2rem] border transition-all duration-300 cursor-pointer ${
                    notif.unread 
                      ? 'bg-white border-blue-100 shadow-xl shadow-blue-900/5' 
                      : 'bg-white/60 border-transparent shadow-sm hover:bg-white hover:shadow-md'
                  }`}
                >
                  {/* Left accent border for unread */}
                  {notif.unread && (
                    <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-primary"></div>
                  )}

                  <div className="p-6 sm:p-8 flex items-start gap-4 sm:gap-6">
                    {/* Icon */}
                    <div className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${
                      notif.unread 
                        ? notif.type === 'promo' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-primary'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {getIcon(notif.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                        <h3 className={`text-lg sm:text-xl font-bold pr-6 ${
                          notif.unread ? 'text-gray-900' : 'text-gray-600'
                        }`}>
                          {notif.title}
                        </h3>
                        <span className="shrink-0 text-xs font-bold text-gray-400 sm:mt-1.5">
                          {notif.time}
                        </span>
                      </div>
                      
                      <p className={`text-sm sm:text-base leading-relaxed max-w-3xl ${
                        notif.unread ? 'text-gray-600 font-medium' : 'text-gray-500'
                      }`}>
                        {notif.message}
                      </p>
                    </div>

                    {/* Unread indicator */}
                    {notif.unread && (
                      <div className="shrink-0 w-3 h-3 bg-primary rounded-full mt-2 shadow-sm shadow-primary/50 absolute top-6 right-6 sm:relative sm:top-auto sm:right-auto"></div>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center bg-white rounded-[3rem] border border-gray-100 shadow-sm"
              >
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bell className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Không có thông báo nào</h3>
                <p className="text-gray-500 font-medium">Bạn đã xem hết tất cả thông báo trong mục này.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
