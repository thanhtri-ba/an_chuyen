import React, { useState, useEffect } from 'react';
import Table from '../components/Table';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useLanguage } from '../lib/i18n';
import { supabase } from '../lib/supabase';
import { Modal } from '../components/Modal';
import { Select } from '../components/Select';
import { ActionButtons } from '../components/ActionButtons';

const Trips = () => {
  const { t } = useLanguage();
  const [tripSchedules, setTripSchedules] = useState<any[]>([]);
  const [buses, setBuses] = useState<any[]>([]);
  const [tripTemplates, setTripTemplates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    tripId: '',
    busId: '',
    departureTime: '',
    arrivalTime: '',
    durationMins: 120,
    price: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [
      { data: scheduleData },
      { data: busData },
      { data: tripData },
      { data: cityData }
    ] = await Promise.all([
      supabase.from('trip_schedules').select('*, trips(Route:routes(departureCityId, arrivalCityId)), buses(plateNumber), TripPrice:trip_prices(price)'),
      supabase.from('buses').select('*'),
      supabase.from('trips').select('id, Route:routes(departureCityId, arrivalCityId)'),
      supabase.from('cities').select('id, name')
    ]);
    
    if (cityData) setCities(cityData);
    if (busData) setBuses(busData);
    if (tripData) setTripTemplates(tripData);
    if (scheduleData) setTripSchedules(scheduleData);
  };

  const getCityName = (id: string) => cities.find(c => c.id === id)?.name || id;

  const handleOpenModal = (schedule?: any) => {
    if (schedule) {
      setFormData({
        id: schedule.id,
        tripId: schedule.tripId || '',
        busId: schedule.busId || '',
        departureTime: schedule.departureTime ? new Date(schedule.departureTime).toISOString().slice(0, 16) : '',
        arrivalTime: schedule.arrivalTime ? new Date(schedule.arrivalTime).toISOString().slice(0, 16) : '',
        durationMins: schedule.durationMins || 120,
        price: schedule.TripPrice?.[0]?.price || 0
      });
    } else {
      setFormData({
        id: '',
        tripId: tripTemplates[0]?.id || '',
        busId: buses[0]?.id || '',
        departureTime: '',
        arrivalTime: '',
        durationMins: 120,
        price: 50
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const crypto = window.crypto || (window as any).msCrypto;
    const scheduleId = formData.id || crypto.randomUUID();

    const schedulePayload = {
      tripId: formData.tripId,
      busId: formData.busId,
      departureTime: new Date(formData.departureTime).toISOString(),
      arrivalTime: new Date(formData.arrivalTime).toISOString(),
      durationMins: Number(formData.durationMins)
    };

    let opError = null;
    if (formData.id) {
      const { error } = await supabase.from('trip_schedules').update(schedulePayload).eq('id', scheduleId);
      opError = error;
    } else {
      const { error: insErr } = await supabase.from('trip_schedules').insert([{ ...schedulePayload, id: scheduleId }]);
      opError = insErr;
      if (!insErr) {
        await supabase.from('trip_prices').insert([{ id: crypto.randomUUID(), tripScheduleId: scheduleId, seatClass: 'EXECUTIVE', price: Number(formData.price) }]);
      }
    }

    if (opError) {
      alert('Error saving trip: ' + opError.message);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setIsModalOpen(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this trip schedule?')) {
      await supabase.from('trip_schedules').delete().eq('id', id);
      fetchData();
    }
  };

  const formattedData = tripSchedules.map(t => {
    const depCityId = t.trips?.Route?.departureCityId;
    const arrCityId = t.trips?.Route?.arrivalCityId;
    const routeName = depCityId && arrCityId ? `${getCityName(depCityId)} - ${getCityName(arrCityId)}` : 'Unknown Route';
    
    return {
      ...t,
      route: routeName,
      busName: t.buses?.plateNumber || 'Unassigned',
      date: t.departureTime ? new Date(t.departureTime).toLocaleDateString() : '-',
      time: t.departureTime ? new Date(t.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
      priceStr: t.TripPrice?.[0]?.price ? `$${t.TripPrice[0].price.toFixed(2)}` : '-',
      status: new Date(t.departureTime) < new Date() ? 'Completed' : 'Scheduled'
    };
  });

  const filteredTrips = formattedData.filter(t => 
    t.route.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.busName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: 'id', label: 'Trip ID', render: (val: string) => <span style={{ fontWeight: '600', color: 'var(--color-primary)' }}>{val.substring(0,8)}...</span> },
    { key: 'route', label: t('dashboard', 'route'), render: (val: string) => <span style={{ fontWeight: '500' }}>{val}</span> },
    { key: 'busName', label: t('dashboard', 'bus') },
    { key: 'date', label: t('bookings', 'bookingDate') },
    { key: 'time', label: t('dashboard', 'time') },
    { key: 'priceStr', label: t('trips', 'price') },
    { key: 'status', label: t('common', 'status'), render: (val: string) => (
      <span style={{ 
        padding: '0.25rem 0.625rem', 
        borderRadius: 'var(--radius-full)', 
        fontSize: '0.75rem', 
        fontWeight: '600',
        backgroundColor: val === 'Completed' ? 'rgba(16, 185, 129, 0.1)' : val === 'In Progress' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)',
        color: val === 'Completed' ? 'var(--color-success)' : val === 'In Progress' ? '#3B82F6' : 'var(--color-warning)'
      }}>
        {val}
      </span>
    )},
    { key: 'actions', label: 'Actions', render: (_: any, item: any) => (
      <ActionButtons 
        onPower={() => alert('Toggle trip status...')}
        onEdit={() => handleOpenModal(item)} 
        onDelete={() => handleDelete(item.id)} 
      />
    )}
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--color-text-base)' }}>{t('trips', 'title')}</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{t('trips', 'subtitle')}</p>
        </div>
        <button onClick={() => handleOpenModal()} style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          backgroundColor: 'var(--color-primary)', color: 'var(--color-bg-base)',
          padding: '0.625rem 1.25rem', borderRadius: 'var(--radius-md)',
          fontWeight: '500', transition: 'background-color 0.2s'
        }}>
          <Plus size={18} />
          {t('trips', 'addTrip')}
        </button>
      </div>

      <Table 
        title={t('trips', 'allTrips')} 
        data={filteredTrips} 
        columns={columns} 
        onSearch={setSearchTerm} 
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={formData.id ? "Edit Trip Schedule" : "Add New Trip"}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Route (Trip Template)</label>
            <Select 
              required
              value={formData.tripId}
              onChange={val => setFormData({...formData, tripId: val})}
              placeholder="Select a Route Template..."
              options={tripTemplates.map(t => ({ label: `${getCityName(t.Route?.departureCityId)} - ${getCityName(t.Route?.arrivalCityId)}`, value: t.id }))}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Assigned Bus</label>
            <Select 
              required
              value={formData.busId}
              onChange={val => setFormData({...formData, busId: val})}
              placeholder="Select a Bus..."
              options={buses.map(b => ({ label: `${b.plateNumber} (${b.type})`, value: b.id }))}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Departure Time</label>
              <input type="datetime-local" required value={formData.departureTime} onChange={e => setFormData({...formData, departureTime: e.target.value})} style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-base)' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Arrival Time</label>
              <input type="datetime-local" required value={formData.arrivalTime} onChange={e => setFormData({...formData, arrivalTime: e.target.value})} style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-base)' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Duration (Mins)</label>
              <input type="number" required value={formData.durationMins} onChange={e => setFormData({...formData, durationMins: Number(e.target.value)})} style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-base)' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Base Price ($)</label>
              <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-base)' }} />
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-base)' }}>Cancel</button>
            <button type="submit" disabled={isSubmitting} style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: 'none', backgroundColor: 'var(--color-primary)', color: 'var(--color-bg-base)', fontWeight: '600' }}>
              {isSubmitting ? 'Saving...' : 'Save Trip'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Trips;
