import React, { useState, useEffect } from 'react';
import Table from '../components/Table';
import { Plus, Trash2, Power, Edit2 } from 'lucide-react';
import { useLanguage } from '../lib/i18n';
import { supabase } from '../lib/supabase';
import { Modal } from '../components/Modal';
import { ActionButtons } from '../components/ActionButtons';
import { IMAGE_PLACEHOLDER } from '../lib/placeholder';

const Vouchers = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCode, setNewCode] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newLogoPath, setNewLogoPath] = useState('');
  const [newDiscountPct, setNewDiscountPct] = useState(10);
  const [newValidUntil, setNewValidUntil] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('createdAt', { ascending: false });
        
      if (error) throw error;
      setVouchers(data || []);
    } catch (error) {
      console.error('Error fetching vouchers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      
      const voucherData = {
        code: newCode,
        title: newTitle,
        subtitle: `Discount ${newDiscountPct}%`,
        logoPath: newLogoPath,
        discountPct: newDiscountPct,
        maxDiscount: newDiscountPct * 1000,
        validUntil: newValidUntil ? new Date(newValidUntil).toISOString() : new Date().toISOString()
      };

      let error;
      if (editingId) {
        const result = await supabase
          .from('promotions')
          .update(voucherData)
          .eq('id', editingId);
        error = result.error;
      } else {
        const result = await supabase
          .from('promotions')
          .insert({
            ...voucherData,
            id: crypto.randomUUID(),
            updatedAt: new Date().toISOString(),
            isActive: true
          });
        error = result.error;
      }

      if (error) throw error;
      
      setIsModalOpen(false);
      setEditingId(null);
      setNewCode('');
      setNewTitle('');
      setNewLogoPath('');
      setNewDiscountPct(10);
      setNewValidUntil('');
      fetchVouchers(); // refresh data
    } catch (error: any) {
      console.error('Error saving voucher:', error);
      alert(`Failed to save voucher. ${error?.message || ''}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (voucher: any) => {
    setEditingId(voucher.id);
    setNewCode(voucher.code || '');
    setNewTitle(voucher.title || '');
    setNewLogoPath(voucher.logoPath || '');
    setNewDiscountPct(voucher.discountPct || 10);
    setNewValidUntil(voucher.validUntil || '');
    setIsModalOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingId(null);
    setNewCode('');
    setNewTitle('');
    setNewLogoPath('');
    setNewDiscountPct(10);
    setNewValidUntil('');
    setIsModalOpen(true);
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('promotions')
        .update({ isActive: !currentStatus })
        .eq('id', id);
      if (error) throw error;
      fetchVouchers();
    } catch (error) {
      console.error('Error toggling voucher status:', error);
      alert('Failed to update status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this voucher?')) return;
    try {
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchVouchers();
    } catch (error) {
      console.error('Error deleting voucher:', error);
      alert('Failed to delete voucher.');
    }
  };

  const filteredVouchers = vouchers.filter(v => 
    (v.title && v.title.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (v.code && v.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const columns = [
    { key: 'logoPath', label: t('banners', 'image'), render: (val: string) => (
      <img 
        src={val || IMAGE_PLACEHOLDER}
        alt="Voucher" 
        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} 
      />
    )},
    { key: 'code', label: t('vouchers', 'code'), render: (val: string) => (
      <span style={{ fontWeight: '700', color: 'var(--color-primary)' }}>{val}</span>
    )},
    { key: 'title', label: t('vouchers', 'titleLabel') },
    { key: 'discountPct', label: t('vouchers', 'discount'), render: (val: number) => (
      <span>{val}%</span>
    )},
    { key: 'validUntil', label: t('vouchers', 'validUntil'), render: (val: string) => (
      <span>{new Date(val).toLocaleDateString()}</span>
    )},
    { key: 'isActive', label: t('common', 'status'), render: (val: boolean) => (
      <span style={{ 
        display: 'flex', alignItems: 'center', gap: '0.375rem',
        color: val ? 'var(--color-success)' : 'var(--color-text-muted)',
        fontSize: '0.875rem'
      }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: val ? 'var(--color-success)' : 'var(--color-text-muted)' }}></span>
        {val ? 'Active' : 'Expired'}
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
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--color-text-base)' }}>{t('vouchers', 'title')}</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{t('vouchers', 'subtitle')}</p>
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
          {t('vouchers', 'addVoucher')}
        </button>
      </div>

      <Table 
        title={t('vouchers', 'allVouchers')} 
        data={filteredVouchers} 
        columns={columns} 
        onSearch={setSearchTerm} 
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Voucher' : t('vouchers', 'addVoucher')}>
        <form onSubmit={handleSaveVoucher} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>{t('vouchers', 'code')}</label>
            <input 
              type="text" 
              required
              value={newCode}
              onChange={(e) => setNewCode(e.target.value.toUpperCase())}
              placeholder="e.g. SUMMER2026"
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-base)', color: 'var(--color-text-base)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>{t('vouchers', 'titleLabel')}</label>
            <input 
              type="text" 
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Khuyến mãi mùa hè"
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-base)', color: 'var(--color-text-base)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>Image URL (logoPath)</label>
            <input 
              type="url" 
              value={newLogoPath}
              onChange={(e) => setNewLogoPath(e.target.value)}
              placeholder="https://example.com/logo.png"
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-base)', color: 'var(--color-text-base)' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>{t('vouchers', 'discount')} (%)</label>
              <input 
                type="number" 
                required
                min="1" max="100"
                value={newDiscountPct}
                onChange={(e) => setNewDiscountPct(Number(e.target.value))}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-base)', color: 'var(--color-text-base)' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>{t('vouchers', 'validUntil')}</label>
              <input 
                type="date" 
                required
                value={newValidUntil}
                onChange={(e) => setNewValidUntil(e.target.value)}
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

export default Vouchers;
