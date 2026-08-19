import React, { useState, useEffect } from 'react';
import Table from '../components/Table';
import { Modal } from '../components/Modal';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../lib/i18n';

const Cities = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [cities, setCities] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', provinceId: '', image: '', subtitle: '', isPopular: false });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    // Fetch Provinces
    const { data: provData } = await supabase.from('provinces').select('*');
    if (provData) setProvinces(provData);

    // Fetch Cities
    const { data: cityData, error } = await supabase
      .from('cities')
      .select('*, Province:provinces(name)')
      .order('name');
      
    if (cityData) {
      setCities(cityData);
    } else {
      console.error('Error fetching cities:', error);
    }
    setIsLoading(false);
  };

  const handleOpenModal = (city?: any) => {
    if (city) {
      setEditingCity(city);
      setFormData({
        name: city.name,
        provinceId: city.provinceId,
        image: city.image || '',
        subtitle: city.subtitle || '',
        isPopular: city.isPopular
      });
    } else {
      setEditingCity(null);
      setFormData({ name: '', provinceId: '', image: '', subtitle: '', isPopular: false });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const cityData = {
      name: formData.name,
      provinceId: formData.provinceId,
      image: formData.image,
      subtitle: formData.subtitle,
      isPopular: formData.isPopular
    };

    if (editingCity) {
      // Update
      const { error } = await supabase
        .from('cities')
        .update(cityData)
        .eq('id', editingCity.id);
      
      if (!error) {
        setIsModalOpen(false);
        fetchData();
      }
    } else {
      // Insert
      const crypto = window.crypto || (window as any).msCrypto; // Use browser crypto
      const { error } = await supabase
        .from('cities')
        .insert([{
          ...cityData,
          id: crypto.randomUUID()
        }]);
        
      if (!error) {
        setIsModalOpen(false);
        fetchData();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this city?')) {
      await supabase.from('cities').delete().eq('id', id);
      fetchData();
    }
  };

  const filteredCities = cities.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.Province?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: 'image', label: 'Image', render: (val: string) => (
      val ? <img src={val} alt="City" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
          : <div style={{ width: '60px', height: '40px', backgroundColor: 'var(--color-bg-hover)', borderRadius: 'var(--radius-sm)' }} />
    )},
    { key: 'name', label: t('cities', 'cityName'), render: (val: string) => <span style={{ fontWeight: '500' }}>{val}</span> },
    { key: 'subtitle', label: 'Subtitle', render: (val: string) => <span style={{ color: 'var(--color-text-muted)' }}>{val || '-'}</span> },
    { key: 'Province', label: t('cities', 'region'), render: (val: any) => val?.name || '-' },
    { key: 'isPopular', label: 'Popular', render: (val: boolean) => (
      <span style={{ 
        padding: '0.25rem 0.5rem', 
        borderRadius: 'var(--radius-sm)', 
        fontSize: '0.75rem', 
        backgroundColor: val ? 'var(--color-success-bg)' : 'transparent',
        color: val ? 'var(--color-success)' : 'var(--color-text-muted)',
        border: val ? 'none' : '1px solid var(--color-border)'
      }}>
        {val ? 'Yes' : 'No'}
      </span>
    )},
    { key: 'actions', label: t('common', 'actions'), render: (_: any, item: any) => (
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
        <button onClick={() => handleOpenModal(item)} style={{ padding: '0.25rem', color: 'var(--color-info)' }}><Edit2 size={16} /></button>
        <button onClick={() => handleDelete(item.id)} style={{ padding: '0.25rem', color: 'var(--color-danger)' }}><Trash2 size={16} /></button>
      </div>
    )}
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--color-text-base)' }}>{t('cities', 'title')}</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{t('cities', 'subtitle')}</p>
        </div>
        <button onClick={() => handleOpenModal()} style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          backgroundColor: 'var(--color-primary)', color: 'var(--color-bg-base)',
          padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)',
          fontWeight: '500', transition: 'background-color 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
        >
          <Plus size={18} />
          {t('cities', 'addCity')}
        </button>
      </div>

      {isLoading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading data...</div>
      ) : (
        <Table 
          title={t('cities', 'allCities')} 
          data={filteredCities} 
          columns={columns} 
          onSearch={setSearchTerm} 
        />
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCity ? "Edit City" : "Add New City"}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-muted)' }}>City Name</label>
            <input 
              required
              type="text" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})}
              style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-base)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-muted)' }}>Province</label>
            <select 
              required
              value={formData.provinceId} 
              onChange={e => setFormData({...formData, provinceId: e.target.value})}
              style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-base)' }}
            >
              <option value="">Select a province</option>
              {provinces.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-muted)' }}>Subtitle (e.g. Thành phố mang tên Bác)</label>
            <input 
              type="text" 
              value={formData.subtitle} 
              onChange={e => setFormData({...formData, subtitle: e.target.value})}
              style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-base)' }}
              placeholder="Thành phố mang tên Bác"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-muted)' }}>Image URL (For featured display)</label>
            <input 
              type="text" 
              value={formData.image} 
              onChange={e => setFormData({...formData, image: e.target.value})}
              style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-base)' }}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input 
              type="checkbox" 
              id="isPopular"
              checked={formData.isPopular} 
              onChange={e => setFormData({...formData, isPopular: e.target.checked})}
            />
            <label htmlFor="isPopular" style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-base)' }}>Is Popular Destination</label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '0.625rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', color: 'var(--color-text-base)' }}>Cancel</button>
            <button type="submit" style={{ padding: '0.625rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary)', color: 'var(--color-bg-base)', fontWeight: '500' }}>Save Changes</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Cities;
