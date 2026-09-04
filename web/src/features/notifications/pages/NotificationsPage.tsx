import { useState } from 'react';
import { Bell, Ticket, Gift, Check, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNotifications, type NotificationType } from '../../../shared/hooks/useNotifications';

export function NotificationsPage() {
  const { t } = useTranslation();
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [activeFilter, setActiveFilter] = useState('all');

  const FILTERS = [
    { id: 'all', label: t('notifications.filterAll') },
    { id: 'unread', label: t('notifications.filterUnread') },
    { id: 'promo', label: t('notifications.filterPromo') },
    { id: 'system', label: t('notifications.filterSystem') },
  ];

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'unread') return !n.read;
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
    <div className="bg-[#fcfcfc] min-h-screen pt-24 pb-20 relative overflow-hidden font-sans">
      
      <div className="container px-4 max-w-4xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full font-bold text-xs mb-4 uppercase tracking-widest shadow-sm">
              <Bell className="w-3.5 h-3.5 text-primary" /> {t('notifications.center')}
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-display font-medium text-[#1a1a1a] tracking-tight">
              {t('notifications.title')}
            </motion.h1>
          </div>
          
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <button 
              onClick={markAllAsRead}
              className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold text-primary hover:text-primary-hover bg-primary/5 hover:bg-primary/10 px-5 py-3 rounded-full transition-colors shadow-sm"
            >
              <Check className="w-4 h-4" /> {t('notifications.markAllRead')}
            </button>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-[2rem] border border-gray-100 w-fit shadow-sm"
        >
          {FILTERS.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300 ${
                activeFilter === filter.id
                  ? 'bg-[#1a1a1a] text-white shadow-md'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-[#1a1a1a]'
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
                  onClick={() => !notif.read && markAsRead(notif.id)}
                  className="relative group overflow-hidden rounded-[2rem] border transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
                  style={!notif.read
                    ? { background: '#ffffff', borderColor: '#e5e7eb' }
                    : { background: '#fcfcfc', borderColor: '#f3f4f6' }}
                >
                  {/* Left accent border for unread */}
                  {!notif.read && (
                    <div className="absolute top-0 left-0 bottom-0 w-1.5" style={{ background: '#163328' }}></div>
                  )}

                  <div className="p-6 sm:p-8 flex items-start gap-4 sm:gap-6">
                    {/* Icon */}
                    <div
                      className="shrink-0 w-14 h-14 rounded-full flex items-center justify-center shadow-sm"
                      style={!notif.read
                        ? (notif.type === 'promo' ? { background: 'rgba(251,146,60,0.1)', color: '#fb923c' } : { background: 'rgba(22,51,40,0.08)', color: '#163328' })
                        : { background: '#f3f4f6', color: '#9ca3af' }}
                    >
                      {getIcon(notif.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                        <h3 className="text-lg sm:text-xl font-bold pr-6 font-display" style={{ color: !notif.read ? '#1a1a1a' : '#6b7280' }}>
                          {notif.title}
                        </h3>
                        <span className="shrink-0 text-[10px] uppercase tracking-widest font-bold sm:mt-1.5" style={{ color: '#9ca3af' }}>
                          {notif.time}
                        </span>
                      </div>

                      <p className="text-sm sm:text-base leading-relaxed max-w-3xl" style={{ color: !notif.read ? '#4b5563' : '#9ca3af' }}>
                        {notif.message}
                      </p>
                    </div>

                    {/* Unread indicator */}
                    {!notif.read && (
                      <div className="shrink-0 w-3 h-3 rounded-full mt-2 absolute top-6 right-6 sm:relative sm:top-auto sm:right-auto" style={{ background: '#163328' }}></div>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-24 text-center bg-white rounded-[3rem] border border-gray-100 shadow-sm"
              >
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bell className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-2xl font-display font-medium text-[#1a1a1a] mb-2">{t('notifications.empty')}</h3>
                <p className="text-gray-500 font-medium">{t('notifications.emptyDesc')}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
