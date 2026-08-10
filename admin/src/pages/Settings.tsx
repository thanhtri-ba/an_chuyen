import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../lib/i18n';

const Settings = () => {
  const { t, language: currentLanguage } = useLanguage();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  const [compactSidebar, setCompactSidebar] = useState(localStorage.getItem('sidebar:compact') === 'true');
  const [showAnimations, setShowAnimations] = useState(localStorage.getItem('ui:animations') !== 'false');
  const [soundEffects, setSoundEffects] = useState(localStorage.getItem('ui:sounds') === 'true');

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  ];

  useEffect(() => {
    localStorage.setItem('sidebar:compact', compactSidebar.toString());
    window.dispatchEvent(new Event('settingsChange'));
  }, [compactSidebar]);

  useEffect(() => {
    localStorage.setItem('ui:animations', showAnimations.toString());
    if (showAnimations) {
      document.body.classList.remove('no-animations');
    } else {
      document.body.classList.add('no-animations');
    }
  }, [showAnimations]);

  useEffect(() => {
    localStorage.setItem('ui:sounds', soundEffects.toString());
  }, [soundEffects]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (language !== localStorage.getItem('language')) {
      localStorage.setItem('language', language);
      window.dispatchEvent(new Event('languageChange'));
    }
  }, [language]);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--color-text-base)', letterSpacing: '-0.02em' }}>
          {t('settings', 'title')}
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
          {t('settings', 'subtitle')}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Theme Settings */}
        <div className="pro-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.25rem' }}>{t('settings', 'themeMode')}</h2>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <ThemeCard active={theme === 'light'} onClick={() => setTheme('light')} label={t('settings', 'lightMode')} />
            <ThemeCard active={theme === 'dark'} onClick={() => setTheme('dark')} label={t('settings', 'darkMode')} />
          </div>
        </div>

        {/* Language Settings */}
        <div className="pro-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.25rem' }}>{t('settings', 'language')}</h2>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            {languages.map(lang => (
              <div
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                style={{
                  width: '160px', height: '90px', borderRadius: 'var(--radius-lg)',
                  border: language === lang.code ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-bg-elevated)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.375rem',
                  fontWeight: '600', cursor: 'pointer', position: 'relative',
                  boxShadow: language === lang.code ? '0 5px 15px rgba(0,0,0,0.05)' : 'none',
                  transition: 'all 0.2s'
                }}>
                <span style={{ fontSize: '1.75rem' }}>{lang.flag}</span>
                <span style={{ fontSize: '0.8125rem', textAlign: 'center' }}>{lang.name}</span>
                {language === lang.code && <div style={{ position: 'absolute', top: '-8px', right: '-8px', width: '22px', height: '22px', backgroundColor: 'var(--color-primary)', borderRadius: '50%', border: '3px solid var(--color-bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircle2 color="white" size={12} /></div>}
              </div>
            ))}
          </div>
        </div>

        {/* System Toggles */}
        <div className="pro-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.25rem' }}>{t('settings', 'systemToggles')}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
            <ToggleItem
              title={t('settings', 'compactSidebar')}
              description={t('settings', 'compactSidebarDesc')}
              active={compactSidebar}
              onToggle={setCompactSidebar}
            />
            <ToggleItem
              title={t('settings', 'showAnimations')}
              description={t('settings', 'showAnimationsDesc')}
              active={showAnimations}
              onToggle={setShowAnimations}
            />
            <ToggleItem
              title={t('settings', 'soundEffects')}
              description={t('settings', 'soundEffectsDesc')}
              active={soundEffects}
              onToggle={setSoundEffects}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ThemeCard = ({ active, onClick, label, disabled = false }: { active: boolean, onClick: () => void, label: string, disabled?: boolean }) => (
  <div
    onClick={!disabled ? onClick : undefined}
    style={{
      width: '160px', height: '100px', borderRadius: 'var(--radius-lg)',
      border: active ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
      backgroundColor: 'var(--color-bg-elevated)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
      fontWeight: '600', cursor: disabled ? 'not-allowed' : 'pointer', position: 'relative',
      opacity: disabled ? 0.5 : 1,
      boxShadow: active ? '0 5px 15px rgba(158, 21, 21, 0.05)' : 'none',
      transition: 'all 0.2s'
    }}>
    {disabled && <AlertCircle size={24} color="var(--color-text-muted)" />}
    <span style={{ textAlign: 'center', fontSize: '0.875rem' }}>{label}</span>
    {active && <div style={{ position: 'absolute', top: '-8px', right: '-8px', width: '22px', height: '22px', backgroundColor: 'var(--color-primary)', borderRadius: '50%', border: '3px solid var(--color-bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircle2 color="white" size={12} /></div>}
  </div>
);

const ToggleItem = ({ title, description, active, onToggle }: { title: string, description: string, active: boolean, onToggle: (val: boolean) => void }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid var(--color-border)' }}>
      <div>
        <p style={{ fontWeight: '600', marginBottom: '0.125rem', fontSize: '0.875rem' }}>{title}</p>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>{description}</p>
      </div>
      <div
        onClick={() => onToggle(!active)}
        style={{
          width: '44px', height: '24px', borderRadius: '12px',
          backgroundColor: active ? 'var(--color-primary)' : 'var(--color-border-hover)',
          position: 'relative', cursor: 'pointer', transition: 'all 0.3s',
          flexShrink: 0
        }}
      >
        <div style={{
          width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--color-bg-surface)',
          position: 'absolute', top: '2px', left: active ? '22px' : '2px', transition: 'all 0.3s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
        }}></div>
      </div>
    </div>
  );
}

export default Settings;
