import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Search, Bell } from 'lucide-react';
import { useLanguage } from '../lib/i18n';
import Sidebar from '../components/Sidebar';

const AdminLayout = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isCompact, setIsCompact] = useState(localStorage.getItem('sidebar:compact') === 'true');

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
      <Sidebar isCompact={isCompact} onLogout={handleLogout} />

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

export default AdminLayout;
