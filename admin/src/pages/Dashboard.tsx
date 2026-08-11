import React, { useState, useEffect } from 'react';
import { Users, Tag, Map, Activity, CreditCard, MessageSquare, Bell, Send, Paperclip, CheckCheck, MoreVertical, Search, Check, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../lib/i18n';

const Dashboard = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    users: 0,
    bookings: 0,
    routes: 0,
    revenue: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setIsLoading(true);
    try {
      const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
      const { data: bookings } = await supabase.from('bookings').select('totalAmount, status');
      let totalRevenue = 0;
      let validBookingsCount = 0;
      
      if (bookings) {
        bookings.forEach(b => {
          if (b.status === 'PAID' || b.status === 'PENDING') {
            validBookingsCount++;
            if (b.status === 'PAID') totalRevenue += b.totalAmount || 0;
          }
        });
      }
      const { count: routesCount } = await supabase.from('routes').select('*', { count: 'exact', head: true });

      // Fetch recent bookings for notifications
      const { data: recentBookings } = await supabase
        .from('bookings')
        .select(`
          id,
          status,
          totalAmount,
          createdAt,
          User ( fullName, avatar )
        `)
        .order('createdAt', { ascending: false })
        .limit(10);

      setRecentNotifications(recentBookings || []);

      setStats({
        users: usersCount || 0,
        bookings: validBookingsCount,
        routes: routesCount || 0,
        revenue: totalRevenue
      });
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PAID': return 'var(--color-success)';
      case 'PENDING': return 'var(--color-warning)';
      case 'ALERT': return 'var(--color-error)';
      case 'URGENT': return 'var(--color-error)';
      default: return 'var(--color-info)';
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--color-text-base)' }}>{t('dashboard', 'title')}</h1>
      </div>

      {isLoading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading real-time data...</div>
      ) : (
        <>
          {/* Row 1: Grid of Minimal Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <StatCard title={t('dashboard', 'totalRevenue')} value={`${stats.revenue.toLocaleString()} VND`} trend="Live Data" icon={<CreditCard size={18} />} />
            <StatCard title={t('dashboard', 'totalBookings')} value={stats.users.toLocaleString()} trend="Live Data" icon={<Users size={18} />} />
            <StatCard title={t('dashboard', 'activeBookings') || 'Active Bookings'} value={stats.bookings.toLocaleString()} trend="Live Data" icon={<Tag size={18} />} />
            <StatCard title={t('dashboard', 'activeRoutes')} value={stats.routes.toLocaleString()} trend="Live Data" icon={<Map size={18} />} />
          </div>

          {/* Row 2: Chart & Notifications */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.5rem', marginBottom: '1.5rem' }}>
            
            {/* Main Chart Area */}
            <div className="pro-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>{t('dashboard', 'revenueOverview')}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Daily connections to database.</p>
                </div>
                <div style={{ padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', backgroundColor: 'rgba(255,255,255,0.05)', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                  This Week
                </div>
              </div>
              <div style={{ flex: 1, border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundSize: '10% 20%', backgroundImage: 'linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)', opacity: 0.3 }}></div>
                <svg viewBox="0 0 500 200" preserveAspectRatio="none" style={{ position: 'absolute', width: '100%', height: '100%', bottom: 0 }}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-info)" stopOpacity="0.2"/>
                      <stop offset="100%" stopColor="var(--color-info)" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <path d="M0,200 L0,150 L50,120 L100,160 L150,90 L200,110 L250,60 L300,100 L350,40 L400,80 L450,20 L500,50 L500,200 Z" fill="url(#lineGradient)" />
                  <path d="M0,150 L50,120 L100,160 L150,90 L200,110 L250,60 L300,100 L350,40 L400,80 L450,20 L500,50" fill="none" stroke="var(--color-info)" strokeWidth="2" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Live Notifications & Bookings Area */}
            <div className="pro-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Bell size={18} className="animate-pulse" style={{ color: 'var(--color-info)' }} />
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Live Notifications</h3>
                </div>
                <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', backgroundColor: 'var(--color-error)', color: 'white', fontWeight: 'bold' }}>{recentNotifications.length} New</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
                {recentNotifications.map(notif => (
                  <div key={notif.id} style={{ display: 'flex', gap: '1rem', padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', cursor: 'pointer', transition: 'all 0.2s ease', position: 'relative' }} className="hover:border-info">
                    {notif.User?.avatar ? (
                      <img src={notif.User.avatar} alt={notif.User.fullName} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Activity size={20} color="var(--color-error)" />
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>New Booking</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{notif.User?.fullName} • {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        {notif.totalAmount && <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--color-success)' }}>{notif.totalAmount.toLocaleString()}đ</span>}
                      </div>
                      <div style={{ marginTop: '0.5rem', display: 'inline-block', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: `${getStatusColor(notif.status)}20`, color: getStatusColor(notif.status), fontWeight: 'bold' }}>
                        {notif.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
};

const StatCard = ({ title, value, trend, icon }: { title: string, value: string, trend: string, icon: React.ReactNode }) => {
  return (
    <div className="pro-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>{title}</h3>
        <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          {icon}
        </div>
      </div>
      <div>
        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-text-base)', marginBottom: '0.25rem' }}>{value}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--color-success)' }}>
          <Activity size={12} />
          {trend}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
