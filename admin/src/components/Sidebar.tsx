import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown, LogOut } from 'lucide-react';
import { useLanguage } from '../lib/i18n';
import { NAV_GROUPS, MenuGroup } from '../lib/navigation';
import { useMenuGroupState } from '../hooks/useMenuGroupState';

interface SidebarProps {
  isCompact: boolean;
  onLogout: () => void;
}

const Sidebar = ({ isCompact, onLogout }: SidebarProps) => {
  const { t } = useLanguage();
  const { isCollapsed, toggleGroup } = useMenuGroupState();
  const adminEmail = localStorage.getItem('admin_email') || 'admin@anchuyen.com';

  return (
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

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: isCompact ? '1.5rem 0.5rem' : '1.5rem 1rem', flex: 1, overflowY: 'auto' }}>
        {NAV_GROUPS.map((group, idx) => (
          <NavGroupSection
            key={group.id}
            group={group}
            isCompact={isCompact}
            isFirst={idx === 0}
            collapsed={group.collapsible && isCollapsed(group.id)}
            onToggle={() => toggleGroup(group.id)}
            t={t}
          />
        ))}
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
        onClick={onLogout}
        >
          <LogOut size={18} />
          {!isCompact && <span>{t('sidebar', 'signOut')}</span>}
        </button>
      </div>
    </aside>
  );
};

const NavGroupSection = ({ group, isCompact, isFirst, collapsed, onToggle, t }: {
  group: MenuGroup, isCompact: boolean, isFirst: boolean, collapsed: boolean, onToggle: () => void, t: (ns: any, key: string) => string
}) => {
  // In compact mode there's no header to click, so groups always render fully expanded.
  const effectivelyCollapsed = collapsed && !isCompact;

  return (
    <div>
      {!isCompact && (
        group.collapsible ? (
          <button
            onClick={onToggle}
            aria-expanded={!collapsed}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
              padding: '0.35rem 0.75rem', marginTop: isFirst ? 0 : '1rem', marginBottom: '0.5rem',
              borderRadius: 'var(--radius-sm)', backgroundColor: 'transparent', transition: 'background-color 0.15s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--color-text-muted)' }}>{t('sidebar', group.labelKey)}</span>
            <ChevronDown
              size={14}
              style={{
                color: 'var(--color-text-muted)',
                transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease'
              }}
            />
          </button>
        ) : (
          <p style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--color-text-muted)', marginTop: isFirst ? 0 : '1rem', marginBottom: '0.5rem', paddingLeft: '0.75rem' }}>
            {t('sidebar', group.labelKey)}
          </p>
        )
      )}
      {isCompact && !isFirst && <div style={{ height: '1rem' }} />}

      <div style={{ display: 'grid', gridTemplateRows: effectivelyCollapsed ? '0fr' : '1fr', transition: 'grid-template-rows 300ms ease' }}>
        <div style={{ overflow: 'hidden', minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {group.items.map(item => (
            <NavItem
              key={item.id}
              to={item.href}
              icon={<item.icon size={18} />}
              label={item.label || t('sidebar', item.labelKey)}
              isCompact={isCompact}
            />
          ))}
        </div>
      </div>
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

export default Sidebar;
