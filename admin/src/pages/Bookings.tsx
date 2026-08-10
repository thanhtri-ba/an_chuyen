import React, { useState, useEffect } from 'react';
import Table from '../components/Table';
import { Download, Plus, Edit2, Trash2 } from 'lucide-react';
import { useLanguage } from '../lib/i18n';
import { supabase } from '../lib/supabase';
import { Modal } from '../components/Modal';
import { Select } from '../components/Select';
import { ActionButtons } from '../components/ActionButtons';

const Bookings = () => {
  const { t } = useLanguage();
  const [bookings, setBookings] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    userId: '',
    tripScheduleId: '',
    status: 'PENDING',
    totalAmount: 50
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [
      { data: bookingData },
      { data: userData },
      { data: scheduleData },
      { data: cityData }
    ] = await Promise.all([
      supabase.from('Booking').select('*, User(fullName), TripSchedule(departureTime, trips(Route(departureCityId, arrivalCityId)))').order('createdAt', { ascending: false }),
      supabase.from('User').select('id, fullName'),
      supabase.from('TripSchedule').select('id, departureTime, trips(Route(departureCityId, arrivalCityId))'),
      supabase.from('cities').select('id, name')
    ]);
    
    if (cityData) setCities(cityData);
    if (userData) setUsers(userData);
    if (scheduleData) setSchedules(scheduleData);
    if (bookingData) setBookings(bookingData);
  };

  const getCityName = (id: string) => cities.find(c => c.id === id)?.name || id;

  const handleOpenModal = (booking?: any) => {
    if (booking) {
      setFormData({
        id: booking.id,
        userId: booking.userId || '',
        tripScheduleId: booking.tripScheduleId || '',
        status: booking.status || 'PENDING',
        totalAmount: booking.totalAmount || 0
      });
    } else {
      setFormData({
        id: '',
        userId: users[0]?.id || '',
        tripScheduleId: schedules[0]?.id || '',
        status: 'PENDING',
        totalAmount: 50
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const crypto = window.crypto || (window as any).msCrypto;
    const bookingId = formData.id || crypto.randomUUID();

    const bookingPayload = {
      userId: formData.userId,
      tripScheduleId: formData.tripScheduleId,
      status: formData.status,
      totalAmount: Number(formData.totalAmount),
      updatedAt: new Date().toISOString()
    };

    const { error } = formData.id 
      ? await supabase.from('Booking').update(bookingPayload).eq('id', bookingId)
      : await supabase.from('Booking').insert([{ ...bookingPayload, id: bookingId }]);

    if (error) {
      alert('Error saving booking: ' + error.message);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setIsModalOpen(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      await supabase.from('Booking').delete().eq('id', id);
      fetchData();
    }
  };

  const formattedData = bookings.map(b => {
    const depCityId = b.TripSchedule?.trips?.Route?.departureCityId;
    const arrCityId = b.TripSchedule?.trips?.Route?.arrivalCityId;
    const routeName = depCityId && arrCityId ? `${getCityName(depCityId)} - ${getCityName(arrCityId)}` : 'Unknown Route';
    
    return {
      ...b,
      customerName: b.User?.fullName || 'Unknown User',
      route: routeName,
      dateStr: b.createdAt ? new Date(b.createdAt).toLocaleDateString() : '-',
      amountStr: `$${(b.totalAmount || 0).toFixed(2)}`
    };
  });

  const filteredBookings = formattedData.filter(b => 
    b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: 'id', label: 'Booking ID', render: (val: string) => <span style={{ fontWeight: '600' }}>#{val.substring(0,8)}</span> },
    { key: 'customerName', label: t('bookings', 'customer') },
    { key: 'route', label: t('dashboard', 'route') },
    { key: 'dateStr', label: t('bookings', 'bookingDate') },
    { key: 'amountStr', label: t('bookings', 'amount'), render: (val: string) => <span style={{ fontWeight: '500' }}>{val}</span> },
    { key: 'status', label: t('common', 'status'), render: (val: string) => {
        const isConfirmed = val === 'PAID';
        const isPending = val === 'PENDING';
        return (
          <span style={{ 
            padding: '0.25rem 0.625rem', 
            borderRadius: 'var(--radius-full)', 
            fontSize: '0.75rem', 
            fontWeight: '600',
            backgroundColor: isConfirmed ? 'rgba(16, 185, 129, 0.1)' : isPending ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: isConfirmed ? 'var(--color-success)' : isPending ? 'var(--color-warning)' : 'var(--color-danger)'
          }}>
            {val}
          </span>
        );
      }
    },
    { key: 'actions', label: 'Actions', render: (_: any, item: any) => (
      <ActionButtons 
        onPower={() => alert('Toggle booking status...')}
        onEdit={() => handleOpenModal(item)} 
        onDelete={() => handleDelete(item.id)} 
      />
    )}
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--color-text-base)' }}>{t('bookings', 'title')}</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{t('bookings', 'subtitle')}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            backgroundColor: 'var(--color-bg-surface)', color: 'var(--color-text-base)', border: '1px solid var(--color-border)',
            padding: '0.625rem 1.25rem', borderRadius: 'var(--radius-md)',
            fontWeight: '500', transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-base)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-surface)'}
          >
            <Download size={18} />
            Export CSV
          </button>
          <button onClick={() => handleOpenModal()} style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            backgroundColor: 'var(--color-primary)', color: 'var(--color-bg-base)',
            padding: '0.625rem 1.25rem', borderRadius: 'var(--radius-md)',
            fontWeight: '500', transition: 'background-color 0.2s'
          }}>
            <Plus size={18} />
            Add Booking
          </button>
        </div>
      </div>

      <Table 
        title={t('bookings', 'allBookings')} 
        data={filteredBookings} 
        columns={columns} 
        onSearch={setSearchTerm} 
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={formData.id ? "Edit Booking" : "Add New Booking"}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Customer</label>
            <Select 
              required
              value={formData.userId}
              onChange={val => setFormData({...formData, userId: val})}
              options={users.map(u => ({ label: u.fullName, value: u.id }))}
              placeholder="Select a Customer..."
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Trip Schedule</label>
            <Select 
              required
              value={formData.tripScheduleId}
              onChange={val => setFormData({...formData, tripScheduleId: val})}
              placeholder="Select a Trip..."
              options={schedules.map(s => {
                const dep = s.trips?.Route?.departureCityId;
                const arr = s.trips?.Route?.arrivalCityId;
                const route = dep && arr ? `${getCityName(dep)} - ${getCityName(arr)}` : 'Unknown Route';
                const time = s.departureTime ? new Date(s.departureTime).toLocaleString() : '';
                return { label: `${route} (${time})`, value: s.id };
              })}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Total Amount ($)</label>
              <input type="number" required value={formData.totalAmount} onChange={e => setFormData({...formData, totalAmount: Number(e.target.value)})} style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-base)' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Status</label>
              <Select 
                value={formData.status}
                onChange={val => setFormData({...formData, status: val})}
                options={[
                  { label: 'Pending', value: 'PENDING' },
                  { label: 'Paid', value: 'PAID' },
                  { label: 'Cancelled', value: 'CANCELLED' },
                  { label: 'Refunded', value: 'REFUNDED' }
                ]}
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-base)' }}>Cancel</button>
            <button type="submit" disabled={isSubmitting} style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: 'none', backgroundColor: 'var(--color-primary)', color: 'var(--color-bg-base)', fontWeight: '600' }}>
              {isSubmitting ? 'Saving...' : 'Save Booking'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Bookings;
