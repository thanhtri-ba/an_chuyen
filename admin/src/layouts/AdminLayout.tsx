import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Map, Bus, Tag, Building, Route, LogOut, Search, Bell, Settings, Gift, ImageIcon, Star, MessageSquare, BarChart3, Palette, Calendar } from 'lucide-react';
import { useLanguage } from '../lib/i18n';

const AdminLayout = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isCompact, setIsCompact] = useState(localStorage.getItem('sidebar:compact') === 'true');
  const adminEmail = localStorage.getItem('admin_email') || 'admin@anchuyen.com';

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    localStorage.removeItem('admin_email');
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    const handleSettingsChange = () => {
      setIsCompact(localStorage.getItem('sidebar:compact') === 'true');
    };
    window.addEventListener('settingsChange', handleSettingsChange);
    return () => window.removeEventListener('settingsChange', handleSettingsChange);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      {/* Professional Standard Sidebar */}
      <aside style={{
        width: isCompact ? '80px' : '260px',
        backgroundColor: 'var(--color-bg-surface)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        transition: 'width 0.3s ease'
      }}>
        <div style={{ padding: isCompact ? '1.5rem 0' : '1.5rem', display: 'flex', alignItems: 'center', justifyContent: isCompact ? 'center' : 'flex-start', gap: '0.75rem', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '6px',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-bg-base)', fontWeight: '800', fontSize: '0.875rem',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
          }}>
            AC
          </div>
          {!isCompact && (
            <h1 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-text-base)', letterSpacing: '-0.025em' }}>
              An Chuyến
            </h1>
          )}
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: isCompact ? '1.5rem 0.5rem' : '1.5rem 1rem', flex: 1 }}>
          {!isCompact && <p style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--color-text-muted)', marginBottom: '0.5rem', paddingLeft: '0.75rem' }}>{t('sidebar', 'overview')}</p>}
          <NavItem to="/dashboard" icon={<LayoutDashboard size={18} />} label={t('sidebar', 'dashboard')} isCompact={isCompact} />

          
          {!isCompact && <p style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--color-text-muted)', margin: '1rem 0 0.5rem', paddingLeft: '0.75rem' }}>{t('sidebar', 'management')}</p>}
          {isCompact && <div style={{ height: '1rem' }} />}
          <NavItem to="/users" icon={<Users size={18} />} label={t('sidebar', 'users')} isCompact={isCompact} />
          <NavItem to="/bookings" icon={<Tag size={18} />} label={t('sidebar', 'bookings')} isCompact={isCompact} />
          <NavItem to="/trips" icon={<Map size={18} />} label={t('sidebar', 'trips')} isCompact={isCompact} />
          <NavItem to="/buses" icon={<Bus size={18} />} label={t('sidebar', 'fleet')} isCompact={isCompact} />
          
          {!isCompact && <p style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--color-text-muted)', margin: '1rem 0 0.5rem', paddingLeft: '0.75rem' }}>{t('sidebar', 'marketing')}</p>}
          {isCompact && <div style={{ height: '1rem' }} />}
          <NavItem to="/vouchers" icon={<Gift size={18} />} label={t('sidebar', 'vouchers')} isCompact={isCompact} />
          <NavItem to="/events" icon={<Calendar size={18} />} label={t('sidebar', 'events')} isCompact={isCompact} />
          <NavItem to="/banners" icon={<ImageIcon size={18} />} label={t('sidebar', 'banners')} isCompact={isCompact} />
          <NavItem to="/reviews" icon={<Star size={18} />} label="Reviews" isCompact={isCompact} />

          {!isCompact && <p style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--color-text-muted)', margin: '1rem 0 0.5rem', paddingLeft: '0.75rem' }}>{t('sidebar', 'configuration')}</p>}
          {isCompact && <div style={{ height: '1rem' }} />}
          <NavItem to="/cities" icon={<Building size={18} />} label={t('sidebar', 'cities')} isCompact={isCompact} />
          <NavItem to="/routes" icon={<Route size={18} />} label={t('sidebar', 'routes')} isCompact={isCompact} />
          <NavItem to="/platform-stats" icon={<BarChart3 size={18} />} label={t('sidebar', 'platformStats')} isCompact={isCompact} />
          <NavItem to="/website-config" icon={<Palette size={18} />} label={t('sidebar', 'websiteConfig')} isCompact={isCompact} />
          <NavItem to="/settings" icon={<Settings size={18} />} label={t('sidebar', 'settings')} isCompact={isCompact} />
        </nav>

        <div style={{ padding: isCompact ? '1.5rem 0' : '1.5rem 1rem', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', width: '100%', justifyContent: isCompact ? 'center' : 'flex-start', padding: isCompact ? '0' : '0 0.75rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '600' }}>AD</div>
            {!isCompact && (
              <div>
                 <p style={{ fontWeight: '500', fontSize: '0.875rem', color: 'var(--color-text-base)' }}>Admin User</p>
                 <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{adminEmail}</p>
              </div>
            )}
          </div>
          <button style={{
            display: 'flex', alignItems: 'center', justifyContent: isCompact ? 'center' : 'flex-start', gap: '0.75rem', width: '100%',
            padding: isCompact ? '0.5rem' : '0.5rem 0.75rem', borderRadius: 'var(--radius-md)',
            color: 'var(--color-text-muted)', transition: 'all 0.15s', fontSize: '0.875rem'
          }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)'; e.currentTarget.style.color = 'var(--color-text-base)'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
          title={isCompact ? t('sidebar', 'signOut') : ''}
          onClick={handleLogout}
          >
            <LogOut size={18} />
            {!isCompact && <span>{t('sidebar', 'signOut')}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Minimal Header */}
        <header style={{
          height: '64px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 2rem',
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-bg-base)',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '300px', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-surface)' }}>
             <Search size={16} color="var(--color-text-muted)" style={{ marginLeft: '0.25rem' }} />
             <input type="text" placeholder={t('common', 'search')} style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.875rem', color: 'var(--color-text-base)' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', transition: 'all 0.15s' }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-bg-surface)'; e.currentTarget.style.color = 'var(--color-text-base)'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}>
              <Bell size={18} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ flex: 1, padding: '2rem', overflowX: 'hidden' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ to, icon, label, isCompact }: { to: string, icon: React.ReactNode, label: string, isCompact?: boolean }) => {
  return (
    <NavLink
      to={to}
      title={isCompact ? label : ''}
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCompact ? 'center' : 'flex-start',
        gap: '0.75rem',
        padding: isCompact ? '0.75rem' : '0.5rem 0.75rem',
        borderRadius: 'var(--radius-md)',
        color: isActive ? 'var(--color-bg-base)' : 'var(--color-text-muted)',
        backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
        fontWeight: '500',
        fontSize: '0.875rem',
        textDecoration: 'none',
        transition: 'all 0.15s'
      })}
    >
      {icon}
      {!isCompact && <span>{label}</span>}
    </NavLink>
  );
};

export default AdminLayout;
