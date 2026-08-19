import React, { useEffect, useState } from 'react';
import { Palette, Save, Image, FileJson, Link2 } from 'lucide-react';
import { useLanguage } from '../lib/i18n';
import { supabase } from '../lib/supabase';

const WebsiteConfig = () => {
  const { t } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [uiConfigs, setUiConfigs] = useState({
    home_hero_bg_url: '',
    home_left_banner_url: '',
    home_right_banner_url: '',
    about_page_content: ''
  });

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    const { data } = await supabase.from('app_configs').select('*');
    if (data) {
      const uiObj = { ...uiConfigs };
      data.forEach((config: any) => {
        if (config.key === 'home_hero_bg_url') uiObj.home_hero_bg_url = config.value;
        if (config.key === 'home_left_banner_url') uiObj.home_left_banner_url = config.value;
        if (config.key === 'home_right_banner_url') uiObj.home_right_banner_url = config.value;
        if (config.key === 'about_page_content') uiObj.about_page_content = config.value;
      });
      setUiConfigs(uiObj);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    const updates = [
      { key: 'home_hero_bg_url', value: uiConfigs.home_hero_bg_url },
      { key: 'home_left_banner_url', value: uiConfigs.home_left_banner_url },
      { key: 'home_right_banner_url', value: uiConfigs.home_right_banner_url },
      { key: 'about_page_content', value: uiConfigs.about_page_content }
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

  // Try to format JSON for preview
  const getFormattedJson = () => {
    try {
      return JSON.parse(uiConfigs.about_page_content);
    } catch {
      return null;
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--color-text-base)', letterSpacing: '-0.02em' }}>
          {t('websiteConfig', 'title')}
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
          {t('websiteConfig', 'subtitle')}
        </p>
      </div>

      {/* Hero & Banners Section */}
      <div className="pro-panel" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <Image size={22} color="var(--color-primary)" />
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600' }}>{t('websiteConfig', 'imagesSection')}</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Hero Background */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: '500', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Link2 size={14} />
              {t('websiteConfig', 'heroBackground')}
            </label>
            <input
              value={uiConfigs.home_hero_bg_url}
              onChange={e => setUiConfigs({ ...uiConfigs, home_hero_bg_url: e.target.value })}
              placeholder="https://..."
              style={{
                padding: '0.625rem 0.75rem', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-base)',
                fontSize: '0.875rem'
              }}
            />
            {uiConfigs.home_hero_bg_url && (
              <div style={{
                marginTop: '0.5rem', borderRadius: 'var(--radius-md)', overflow: 'hidden',
                border: '1px solid var(--color-border)', height: '120px'
              }}>
                <img src={uiConfigs.home_hero_bg_url} alt="Hero preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => (e.currentTarget.style.display = 'none')} />
              </div>
            )}
          </div>

          {/* Banner URLs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: '500', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Link2 size={14} />
                {t('websiteConfig', 'leftBanner')}
              </label>
              <input
                value={uiConfigs.home_left_banner_url}
                onChange={e => setUiConfigs({ ...uiConfigs, home_left_banner_url: e.target.value })}
                placeholder="https://..."
                style={{
                  padding: '0.625rem 0.75rem', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-base)',
                  fontSize: '0.875rem'
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: '500', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Link2 size={14} />
                {t('websiteConfig', 'rightBanner')}
              </label>
              <input
                value={uiConfigs.home_right_banner_url}
                onChange={e => setUiConfigs({ ...uiConfigs, home_right_banner_url: e.target.value })}
                placeholder="https://..."
                style={{
                  padding: '0.625rem 0.75rem', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-base)',
                  fontSize: '0.875rem'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* About Page Content Section */}
      <div className="pro-panel" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <FileJson size={22} color="var(--color-primary)" />
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600' }}>{t('websiteConfig', 'aboutContent')}</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.8125rem', fontWeight: '500', color: 'var(--color-text-muted)' }}>
            {t('websiteConfig', 'aboutContentDesc')}
          </label>
          <textarea
            value={uiConfigs.about_page_content}
            onChange={e => setUiConfigs({ ...uiConfigs, about_page_content: e.target.value })}
            placeholder='{"services": [], "specialists": []}'
            rows={10}
            style={{
              padding: '0.75rem', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-base)',
              fontFamily: 'monospace', fontSize: '0.8125rem', lineHeight: '1.6',
              resize: 'vertical'
            }}
          />
          {uiConfigs.about_page_content && !getFormattedJson() && (
            <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>⚠ Invalid JSON format</span>
          )}
        </div>
      </div>

      {/* Save Button */}
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
            ✓ {t('websiteConfig', 'saved')}
          </span>
        )}
      </div>
    </div>
  );
};

export default WebsiteConfig;
