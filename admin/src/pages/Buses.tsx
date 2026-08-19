import React, { useState, useEffect } from 'react';
import Table from '../components/Table';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useLanguage } from '../lib/i18n';
import { supabase } from '../lib/supabase';
import { Modal } from '../components/Modal';
import { Select } from '../components/Select';
import { ActionButtons } from '../components/ActionButtons';

const Buses = () => {
  const { t } = useLanguage();
  const [buses, setBuses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    plateNumber: '',
    type: 'Sleeper (34 beds)',
    capacity: 34,
    status: 'Active',
    nextMaintenance: ''
  });

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    const { data, error } = await supabase.from('buses').select('*').order('plateNumber');
    if (data) {
      setBuses(data);
    }
  };

  const handleOpenModal = (bus?: any) => {
    if (bus) {
      setFormData({
        id: bus.id,
        plateNumber: bus.plateNumber,
        type: bus.type,
        capacity: bus.capacity,
        status: bus.status,
        nextMaintenance: bus.nextMaintenance ? new Date(bus.nextMaintenance).toISOString().split('T')[0] : ''
      });
    } else {
      setFormData({
        id: '',
        plateNumber: '',
        type: 'Sleeper (34 beds)',
        capacity: 34,
        status: 'Active',
        nextMaintenance: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const busData = {
      plateNumber: formData.plateNumber,
      type: formData.type,
      capacity: Number(formData.capacity),
      status: formData.status,
      nextMaintenance: formData.nextMaintenance ? new Date(formData.nextMaintenance).toISOString() : null
    };

    let opError = null;
    if (formData.id) {
      const { error } = await supabase.from('buses').update(busData).eq('id', formData.id);
      opError = error;
    } else {
      const crypto = window.crypto || (window as any).msCrypto;
      const { error } = await supabase.from('buses').insert([{ ...busData, id: crypto.randomUUID() }]);
      opError = error;
    }
    
    if (opError) {
      alert('Error saving bus: ' + opError.message);
      setIsSubmitting(false);
      return;
    }
    
    setIsSubmitting(false);
    setIsModalOpen(false);
    fetchBuses();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this bus?')) {
      await supabase.from('buses').delete().eq('id', id);
      fetchBuses();
    }
  };

  const filteredBuses = buses.filter(b => 
    b.plateNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: 'id', label: 'Bus ID', render: (val: string) => <span style={{ fontWeight: '600' }}>{val.substring(0,8)}...</span> },
    { key: 'plateNumber', label: t('buses', 'busNumber'), render: (val: string) => (
      <span style={{ 
        padding: '0.25rem 0.5rem', border: '1px solid var(--color-border)', 
        borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-bg-base)',
        fontWeight: '700', letterSpacing: '0.05em'
      }}>{val}</span>
    )},
    { key: 'type', label: t('buses', 'type') },
    { key: 'capacity', label: t('buses', 'capacity') },
    { key: 'nextMaintenance', label: 'Next Maintenance', render: (val: string) => val ? new Date(val).toLocaleDateString() : '-' },
    { key: 'status', label: t('common', 'status'), render: (val: string) => (
      <span style={{ 
        display: 'flex', alignItems: 'center', gap: '0.375rem',
        color: val === 'Active' ? 'var(--color-success)' : val === 'Maintenance' ? 'var(--color-warning)' : 'var(--color-danger)',
        fontSize: '0.875rem'
      }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: val === 'Active' ? 'var(--color-success)' : val === 'Maintenance' ? 'var(--color-warning)' : 'var(--color-danger)' }}></span>
        {val}
      </span>
    )},
    { key: 'actions', label: 'Actions', render: (_: any, item: any) => (
      <ActionButtons 
        onPower={() => alert('Toggle bus status...')}
        onEdit={() => handleOpenModal(item)} 
        onDelete={() => handleDelete(item.id)} 
      />
    )}
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--color-text-base)' }}>{t('buses', 'title')}</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{t('buses', 'subtitle')}</p>
        </div>
        <button onClick={() => handleOpenModal()} style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          backgroundColor: 'var(--color-primary)', color: 'var(--color-bg-base)',
          padding: '0.625rem 1.25rem', borderRadius: 'var(--radius-md)',
          fontWeight: '500', transition: 'background-color 0.2s'
        }}>
          <Plus size={18} />
          {t('buses', 'addBus')}
        </button>
      </div>

      <Table 
        title={t('buses', 'fleetOverview')} 
        data={filteredBuses} 
        columns={columns} 
        onSearch={setSearchTerm} 
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={formData.id ? "Edit Bus" : "Add New Bus"}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Plate Number</label>
            <input required value={formData.plateNumber} onChange={e => setFormData({...formData, plateNumber: e.target.value})} style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-base)' }} placeholder="e.g. 29B-123.45" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Type</label>
            <input required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-base)' }} placeholder="e.g. Sleeper (34 beds)" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Capacity</label>
            <input type="number" required value={formData.capacity} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})} style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-base)' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Status</label>
            <Select 
              value={formData.status}
              onChange={val => setFormData({...formData, status: val})}
              options={[
                { label: 'Active', value: 'Active' },
                { label: 'Maintenance', value: 'Maintenance' },
                { label: 'Inactive', value: 'Inactive' }
              ]}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Next Maintenance</label>
            <input type="date" value={formData.nextMaintenance} onChange={e => setFormData({...formData, nextMaintenance: e.target.value})} style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-base)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-base)' }}>Cancel</button>
            <button type="submit" disabled={isSubmitting} style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: 'none', backgroundColor: 'var(--color-primary)', color: 'var(--color-bg-base)', fontWeight: '600' }}>
              {isSubmitting ? 'Saving...' : 'Save Bus'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Buses;
