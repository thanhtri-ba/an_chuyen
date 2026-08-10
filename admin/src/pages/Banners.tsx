import React, { useState, useEffect } from 'react';
import Table from '../components/Table';
import { Plus, Trash2, Power, Edit2 } from 'lucide-react';
import { useLanguage } from '../lib/i18n';
import { supabase } from '../lib/supabase';
import { Modal } from '../components/Modal';
import { ActionButtons } from '../components/ActionButtons';

const Banners = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newPlatform, setNewPlatform] = useState('app');
  const [newTargetUrl, setNewTargetUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('createdAt', { ascending: false });
        
      if (error) throw error;
      setBanners(data || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      
      const bannerData = {
        title: newTitle,
        imageUrl: newImageUrl,
        platform: newPlatform,
        targetUrl: newTargetUrl,
      };

      let error;
      if (editingId) {
        const result = await supabase
          .from('banners')
          .update(bannerData)
          .eq('id', editingId);
        error = result.error;
      } else {
        const result = await supabase
          .from('banners')
          .insert({
            ...bannerData,
            id: crypto.randomUUID(),
            updatedAt: new Date().toISOString(),
            isActive: true
          });
        error = result.error;
      }

      if (error) throw error;
      
      setIsModalOpen(false);
      setEditingId(null);
      setNewTitle('');
      setNewImageUrl('');
      setNewPlatform('app');
      setNewTargetUrl('');
      fetchBanners(); // refresh data
    } catch (error: any) {
      console.error('Error saving banner:', error);
      alert(`Failed to save banner. ${error?.message || ''}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (banner: any) => {
    setEditingId(banner.id);
    setNewTitle(banner.title || '');
    setNewImageUrl(banner.imageUrl || '');
    setNewPlatform(banner.platform || 'app');
    setNewTargetUrl(banner.targetUrl || '');
    setIsModalOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingId(null);
    setNewTitle('');
    setNewImageUrl('');
    setNewPlatform('app');
    setNewTargetUrl('');
    setIsModalOpen(true);
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('banners')
        .update({ isActive: !currentStatus })
        .eq('id', id);
      if (error) throw error;
      fetchBanners();
    } catch (error) {
      console.error('Error toggling banner status:', error);
      alert('Failed to update status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;
    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
      alert('Failed to delete banner.');
    }
  };

  const filteredBanners = banners.filter(b => 
    b.title && b.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: 'imageUrl', label: t('banners', 'image'), render: (val: string) => (
      <img 
        src={val || 'https://via.placeholder.com/150x80'} 
        alt="Banner" 
        style={{ width: '120px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} 
      />
    )},
    { key: 'title', label: t('banners', 'titleLabel'), render: (val: string) => (
      <span style={{ fontWeight: '500' }}>{val}</span>
    )},
    { key: 'platform', label: t('banners', 'platform'), render: (val: string) => (
      <span style={{ 
        padding: '0.25rem 0.5rem', 
        borderRadius: 'var(--radius-full)', 
        fontSize: '0.75rem', 
        fontWeight: '500',
        backgroundColor: val === 'app' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
        color: val === 'app' ? 'var(--color-info)' : 'var(--color-success)',
        textTransform: 'uppercase'
      }}>
        {val}
      </span>
    )},
    { key: 'targetUrl', label: t('banners', 'targetUrl'), render: (val: string) => (
      <a href={val} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontSize: '0.875rem' }}>
        {val ? (val.length > 30 ? val.substring(0, 30) + '...' : val) : '-'}
      </a>
    )},
    { key: 'isActive', label: t('common', 'status'), render: (val: boolean) => (
      <span style={{ 
        display: 'flex', alignItems: 'center', gap: '0.375rem',
        color: val ? 'var(--color-success)' : 'var(--color-text-muted)',
        fontSize: '0.875rem'
      }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: val ? 'var(--color-success)' : 'var(--color-text-muted)' }}></span>
        {val ? 'Active' : 'Hidden'}
      </span>
    )},
    { key: 'id', label: 'Actions', render: (val: string, row: any) => (
      <ActionButtons 
        onPower={() => handleToggleActive(val, row.isActive)}
        onEdit={() => handleEditClick(row)} 
        onDelete={() => handleDelete(val)} 
      />
    )}
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--color-text-base)' }}>{t('banners', 'title')}</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{t('banners', 'subtitle')}</p>
        </div>
        <button 
          onClick={handleAddNewClick}
          style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          backgroundColor: 'var(--color-primary)', color: 'var(--color-bg-base)',
          padding: '0.625rem 1.25rem', borderRadius: 'var(--radius-md)',
          fontWeight: '500', transition: 'background-color 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
        >
          <Plus size={18} />
          {t('banners', 'addBanner')}
        </button>
      </div>

      <Table 
        title={t('banners', 'allBanners')} 
        data={filteredBanners} 
        columns={columns} 
        onSearch={setSearchTerm} 
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Banner' : t('banners', 'addBanner')}>
        <form onSubmit={handleSaveBanner} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>{t('banners', 'image')} (URL)</label>
            <input 
              type="url" 
              required
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-base)', color: 'var(--color-text-base)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>{t('banners', 'titleLabel')}</label>
            <input 
              type="text" 
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Summer Vacation Promo"
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-base)', color: 'var(--color-text-base)' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>{t('banners', 'platform')}</label>
              <select 
                value={newPlatform}
                onChange={(e) => setNewPlatform(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-base)', color: 'var(--color-text-base)' }}
              >
                <option value="app">App</option>
                <option value="web">Web</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>{t('banners', 'targetUrl')}</label>
              <input 
                type="url" 
                value={newTargetUrl}
                onChange={(e) => setNewTargetUrl(e.target.value)}
                placeholder="https://yourlink.com"
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-base)', color: 'var(--color-text-base)' }}
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              style={{ padding: '0.625rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-base)', fontWeight: '500' }}
            >
              {t('common', 'cancel')}
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              style={{ padding: '0.625rem 1.25rem', borderRadius: 'var(--radius-md)', border: 'none', backgroundColor: 'var(--color-primary)', color: 'var(--color-bg-base)', fontWeight: '500', opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
            >
              {submitting ? '...' : (editingId ? 'Update' : t('common', 'save'))}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Banners;
