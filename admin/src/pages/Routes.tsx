import React, { useState, useEffect } from 'react';
import Table from '../components/Table';
import { Modal } from '../components/Modal';
import { Plus, ArrowRight, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../lib/i18n';

const RoutesPage = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [routes, setRoutes] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<any>(null);
  const [formData, setFormData] = useState({ 
    departureCityId: '', 
    arrivalCityId: '', 
    basePrice: '',
    durationMins: '',
    isPopular: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    // Fetch Cities
    const { data: cityData } = await supabase.from('cities').select('*');
    if (cityData) setCities(cityData);

    // Fetch Routes
    const { data: routeData } = await supabase.from('Route').select('*');
    if (routeData) setRoutes(routeData);
    
    setIsLoading(false);
  };

  const getCityName = (id: string) => {
    return cities.find(c => c.id === id)?.name || 'Unknown';
  };

  const handleOpenModal = (route?: any) => {
    if (route) {
      setEditingRoute(route);
      setFormData({
        departureCityId: route.departureCityId,
        arrivalCityId: route.arrivalCityId,
        basePrice: route.basePrice?.toString() || '',
        durationMins: route.durationMins?.toString() || '',
        isPopular: route.isPopular || false
      });
    } else {
      setEditingRoute(null);
      setFormData({ 
        departureCityId: '', 
        arrivalCityId: '', 
        basePrice: '',
        durationMins: '',
        isPopular: false 
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.departureCityId === formData.arrivalCityId) {
      alert("Departure and Arrival cities cannot be the same.");
      return;
    }

    const payload = {
      departureCityId: formData.departureCityId,
      arrivalCityId: formData.arrivalCityId,
      basePrice: formData.basePrice ? parseInt(formData.basePrice) : null,
      durationMins: formData.durationMins ? parseInt(formData.durationMins) : null,
      isPopular: formData.isPopular
    };

    if (editingRoute) {
      const { error } = await supabase.from('Route').update(payload).eq('id', editingRoute.id);
      if (!error) {
        setIsModalOpen(false);
        fetchData();
      } else {
        alert(error.message);
      }
    } else {
      const { error } = await supabase.from('Route').insert([payload]);
      if (!error) {
        setIsModalOpen(false);
        fetchData();
      } else {
        alert(error.message);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      await supabase.from('Route').delete().eq('id', id);
      fetchData();
    }
  };

  const formattedRoutes = routes.map(r => ({
    ...r,
    departureName: getCityName(r.departureCityId),
    arrivalName: getCityName(r.arrivalCityId)
  }));

  const filteredRoutes = formattedRoutes.filter(r => 
    r.departureName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.arrivalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: 'id', label: 'Route ID', render: (val: string) => <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{val.substring(0,8)}...</span> },
    { key: 'path', label: t('dashboard', 'route'), render: (_: any, item: any) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '500' }}>
        <span>{item.departureName}</span>
        <ArrowRight size={14} color="var(--color-text-muted)" />
        <span>{item.arrivalName}</span>
      </div>
    )},
    { key: 'basePrice', label: t('trips', 'price'), render: (val: number) => val ? `${val.toLocaleString()} VND` : '-' },
    { key: 'durationMins', label: t('routes', 'duration'), render: (val: number) => val || '-' },
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
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--color-text-base)' }}>{t('routes', 'title')}</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{t('routes', 'subtitle')}</p>
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
          {t('routes', 'addRoute')}
        </button>
      </div>

      {isLoading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading data...</div>
      ) : (
        <Table 
          title={t('routes', 'allRoutes')} 
          data={filteredRoutes} 
          columns={columns} 
          onSearch={setSearchTerm} 
        />
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingRoute ? "Edit Route" : "Create Route"}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-muted)' }}>Departure City</label>
              <select 
                required
                value={formData.departureCityId} 
                onChange={e => setFormData({...formData, departureCityId: e.target.value})}
                style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-base)' }}
              >
                <option value="">Select departure</option>
                {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-muted)' }}>Arrival City</label>
              <select 
                required
                value={formData.arrivalCityId} 
                onChange={e => setFormData({...formData, arrivalCityId: e.target.value})}
                style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-base)' }}
              >
                <option value="">Select arrival</option>
                {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-muted)' }}>Base Price (VND)</label>
              <input 
                type="number" 
                value={formData.basePrice} 
                onChange={e => setFormData({...formData, basePrice: e.target.value})}
                style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-base)' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-muted)' }}>Duration (Mins)</label>
              <input 
                type="number" 
                value={formData.durationMins} 
                onChange={e => setFormData({...formData, durationMins: e.target.value})}
                style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-base)' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input 
              type="checkbox" 
              id="isPopularRoute"
              checked={formData.isPopular} 
              onChange={e => setFormData({...formData, isPopular: e.target.checked})}
            />
            <label htmlFor="isPopularRoute" style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-base)' }}>Highlight as Popular Route</label>
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

export default RoutesPage;
