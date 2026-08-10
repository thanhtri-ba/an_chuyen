import React, { useEffect, useState } from 'react';
import { BarChart3, Save, TrendingUp, Users, Clock, Star } from 'lucide-react';
import { useLanguage } from '../lib/i18n';
import { supabase } from '../lib/supabase';

const PlatformStats = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({ routes: '500+', passengers: '2M+', onTime: '99%', rating: '4.9' });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { data } = await supabase.from('app_configs').select('*');
    if (data) {
      const statsObj = { ...stats };
      data.forEach((config: any) => {
        if (config.key === 'stat_routes') statsObj.routes = config.value;
        if (config.key === 'stat_passengers') statsObj.passengers = config.value;
        if (config.key === 'stat_ontime') statsObj.onTime = config.value;
        if (config.key === 'stat_rating') statsObj.rating = config.value;
      });
      setStats(statsObj);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    const updates = [
      { key: 'stat_routes', value: stats.routes },
      { key: 'stat_passengers', value: stats.passengers },
      { key: 'stat_ontime', value: stats.onTime },
      { key: 'stat_rating', value: stats.rating },
    ];

    for (const item of updates) {
      const { data } = await supabase.from('app_configs').select('id').eq('key', item.key).single();
      if (data) {
        await supabase.from('app_configs').update({ value: item.value }).eq('id', data.id);
      } else {
        const crypto = window.crypto || (window as any).msCrypto;
        await supabase.from('app_configs').insert({ id: crypto.randomUUID(), key: item.key, value: item.value });
      }
    }

    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const statCards = [
    { key: 'routes', label: t('platformStats', 'totalRoutes'), icon: <TrendingUp size={20} />, color: '#6366F1' },
    { key: 'passengers', label: t('platformStats', 'passengers'), icon: <Users size={20} />, color: '#EC4899' },
    { key: 'onTime', label: t('platformStats', 'onTimeRate'), icon: <Clock size={20} />, color: '#10B981' },
    { key: 'rating', label: t('platformStats', 'ratingScore'), icon: <Star size={20} />, color: '#F59E0B' },
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--color-text-base)', letterSpacing: '-0.02em' }}>
          {t('platformStats', 'title')}
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
          {t('platformStats', 'subtitle')}
        </p>
      </div>

      <div className="pro-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <BarChart3 size={22} color="var(--color-primary)" />
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600' }}>{t('platformStats', 'editStats')}</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          {statCards.map(card => (
            <div key={card.key} style={{
              display: 'flex', flexDirection: 'column', gap: '0.5rem',
              padding: '1.25rem', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-bg-elevated)',
              transition: 'border-color 0.2s'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: 'var(--radius-md)',
                  backgroundColor: `${card.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: card.color
                }}>
                  {card.icon}
                </div>
                <label style={{ fontSize: '0.8125rem', fontWeight: '500', color: 'var(--color-text-muted)' }}>{card.label}</label>
              </div>
              <input
                value={(stats as any)[card.key]}
                onChange={e => setStats({ ...stats, [card.key]: e.target.value })}
                style={{
                  padding: '0.625rem 0.75rem', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-bg-surface)', color: 'var(--color-text-base)',
                  fontSize: '1rem', fontWeight: '600', transition: 'border-color 0.2s'
                }}
              />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              backgroundColor: 'var(--color-primary)', color: 'white',
              padding: '0.625rem 1.5rem', borderRadius: 'var(--radius-md)',
              fontWeight: '500', transition: 'opacity 0.2s', opacity: isSaving ? 0.7 : 1,
              fontSize: '0.875rem'
            }}
          >
            <Save size={16} />
            {isSaving ? t('common', 'saving') : t('common', 'save')}
          </button>
          {saveSuccess && (
            <span style={{ color: '#10B981', fontSize: '0.875rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              ✓ {t('platformStats', 'saved')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlatformStats;
