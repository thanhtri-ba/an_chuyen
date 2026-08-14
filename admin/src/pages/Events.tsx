import React, { useState, useEffect } from 'react';
import Table from '../components/Table';
import { Plus, Trash2, Power, Edit2 } from 'lucide-react';
import { useLanguage } from '../lib/i18n';
import { supabase } from '../lib/supabase';
import { Modal } from '../components/Modal';
import { ActionButtons } from '../components/ActionButtons';
import { IMAGE_PLACEHOLDER } from '../lib/placeholder';

const Events = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('createdAt', { ascending: false });
        
      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      
      const eventData = {
        title: newTitle,
        description: newDescription,
        imageUrl: newImageUrl,
        startDate: new Date(newStartDate).toISOString(),
        endDate: new Date(newEndDate).toISOString(),
      };

      let error;
      if (editingId) {
        const result = await supabase
          .from('events')
          .update({ ...eventData, updatedAt: new Date().toISOString() })
          .eq('id', editingId);
        error = result.error;
      } else {
        const result = await supabase
          .from('events')
          .insert({
            ...eventData,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isActive: true
          });
        error = result.error;
      }

      if (error) throw error;
      
      setIsModalOpen(false);
      resetForm();
      fetchEvents(); // refresh data
    } catch (error: any) {
      console.error('Error saving event:', error);
      alert(`Failed to save event. ${error?.message || ''}`);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setNewTitle('');
    setNewDescription('');
    setNewImageUrl('');
    setNewStartDate('');
    setNewEndDate('');
  };

  const handleEditClick = (event: any) => {
    setEditingId(event.id);
    setNewTitle(event.title || '');
    setNewDescription(event.description || '');
    setNewImageUrl(event.imageUrl || '');
    setNewStartDate(event.startDate ? new Date(event.startDate).toISOString().slice(0,16) : '');
    setNewEndDate(event.endDate ? new Date(event.endDate).toISOString().slice(0,16) : '');
    setIsModalOpen(true);
  };

  const handleAddNewClick = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ isActive: !currentStatus })
        .eq('id', id);
      if (error) throw error;
      fetchEvents();
    } catch (error) {
      console.error('Error toggling event status:', error);
      alert('Failed to update status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event.');
    }
  };

  const filteredEvents = events.filter(e => 
    e.title && e.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: 'imageUrl', label: t('events', 'image'), render: (val: string) => (
      <img 
        src={val || IMAGE_PLACEHOLDER}
        alt="Event" 
        style={{ width: '120px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} 
      />
    )},
    { key: 'title', label: t('events', 'titleLabel') },
    { key: 'dateRange', label: t('events', 'dateRange'), render: (val: any, row: any) => (
      <div>
        <div style={{ fontSize: '13px' }}>Start: {new Date(row.startDate).toLocaleDateString()}</div>
        <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>End: {new Date(row.endDate).toLocaleDateString()}</div>
      </div>
    )},
    { key: 'isActive', label: t('common', 'status'), render: (val: boolean) => (
      <span style={{
        padding: '0.25rem 0.5rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '500',
        backgroundColor: val ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        color: val ? '#10b981' : '#ef4444',
      }}>
        {val ? 'Active' : 'Inactive'}
      </span>
    )},
    { key: 'actions', label: t('common', 'actions'), render: (_: any, row: any) => (
      <ActionButtons>
        <button 
          onClick={() => handleToggleActive(row.id, row.isActive)}
          title={row.isActive ? "Deactivate" : "Activate"}
          style={{
            padding: '0.5rem',
            borderRadius: 'var(--radius-md)',
            color: row.isActive ? '#10b981' : '#ef4444',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <Power size={18} />
        </button>
        <button 
          onClick={() => handleEditClick(row)}
          title={t('common', 'edit')}
          style={{
            padding: '0.5rem',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text-muted)',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <Edit2 size={18} />
        </button>
        <button 
          onClick={() => handleDelete(row.id)}
          title={t('common', 'delete')}
          style={{
            padding: '0.5rem',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text-muted)',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <Trash2 size={18} />
        </button>
      </ActionButtons>
    )}
  ];

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: '700',
            color: 'var(--color-text-base)',
            marginBottom: '0.5rem'
          }}>{t('events', 'title')}</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>{t('events', 'subtitle')}</p>
        </div>
        <button
          onClick={handleAddNewClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--color-bg-base)',
            color: 'var(--color-primary)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.15s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-bg-base)';
          }}
        >
          <Plus size={20} />
          {t('events', 'addEvent')}
        </button>
      </div>

      <div style={{
        backgroundColor: 'var(--color-bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
          <input
            type="text"
            placeholder={t('common', 'search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '300px',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-bg-base)',
              color: 'var(--color-text-base)',
              outline: 'none'
            }}
          />
        </div>
        
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading...</div>
        ) : (
          <Table columns={columns} data={filteredEvents} />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? t('common', 'edit') : t('events', 'addEvent')}
      >
        <form onSubmit={handleSaveEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
              {t('events', 'titleLabel')}
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{
                width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-base)',
                color: 'var(--color-text-base)', outline: 'none'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
              Description
            </label>
            <textarea
              required
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows={3}
              style={{
                width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-base)',
                color: 'var(--color-text-base)', outline: 'none', resize: 'vertical'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
              {t('events', 'image')} URL
            </label>
            <input
              type="url"
              required
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              style={{
                width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-base)',
                color: 'var(--color-text-base)', outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                Start Date
              </label>
              <input
                type="datetime-local"
                required
                value={newStartDate}
                onChange={(e) => setNewStartDate(e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-base)',
                  color: 'var(--color-text-base)', outline: 'none'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                End Date
              </label>
              <input
                type="datetime-local"
                required
                value={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-base)',
                  color: 'var(--color-text-base)', outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              style={{
                padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-muted)', backgroundColor: 'transparent',
                border: '1px solid var(--color-border)', fontWeight: '600', cursor: 'pointer'
              }}
            >
              {t('common', 'cancel')}
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)',
                color: 'var(--color-bg-base)', backgroundColor: 'var(--color-primary)',
                border: 'none', fontWeight: '600', cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1
              }}
            >
              {submitting ? t('common', 'saving') : t('common', 'save')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Events;
