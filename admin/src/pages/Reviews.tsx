import React, { useState, useEffect } from 'react';
import Table from '../components/Table';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../lib/i18n';
import { ActionButtons } from '../components/ActionButtons';
import { Modal } from '../components/Modal';
import { Star } from 'lucide-react';

const Reviews = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Users & Trips for modal
  const [users, setUsers] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [formData, setFormData] = useState({ userId: '', tripId: '', rating: 5, comment: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    
    // Fetch users
    const { data: userData } = await supabase.from('users').select('id, fullName, avatar');
    if (userData) setUsers(userData);

    // Fetch trips
    const { data: tripData } = await supabase.from('trips').select('id');
    if (tripData) setTrips(tripData);

    // Fetch reviews (Limit to 500 to prevent UI lag, typically you'd use pagination)
    const { data: reviewData, error } = await supabase
      .from('reviews')
      .select('*, User(fullName, avatar)')
      .order('createdAt', { ascending: false })
      .limit(500);
      
    if (reviewData) {
      setReviews(reviewData);
    } else {
      console.error('Error fetching reviews:', error);
    }
    setIsLoading(false);
  };

  const handleOpenModal = (review?: any) => {
    if (review) {
      setEditingReview(review);
      setFormData({
        userId: review.userId || '',
        tripId: review.tripId || '',
        rating: review.rating || 5,
        comment: review.comment || ''
      });
    } else {
      setEditingReview(null);
      setFormData({ userId: users[0]?.id || '', tripId: trips[0]?.id || '', rating: 5, comment: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const reviewData = {
      userId: formData.userId,
      tripId: formData.tripId,
      rating: parseInt(formData.rating.toString(), 10),
      comment: formData.comment
    };

    if (editingReview) {
      const { error } = await supabase
        .from('reviews')
        .update(reviewData)
        .eq('id', editingReview.id);
      
      if (!error) {
        setIsModalOpen(false);
        fetchData();
      } else {
        alert('Failed to update review.');
      }
    } else {
      const crypto = window.crypto || (window as any).msCrypto;
      const { error } = await supabase
        .from('reviews')
        .insert([{
          ...reviewData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString()
        }]);
        
      if (!error) {
        setIsModalOpen(false);
        fetchData();
      } else {
        alert('Failed to add review.');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (error) {
        alert('Failed to delete review.');
      } else {
        fetchData();
      }
    }
  };

  const handleToggleApprove = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('reviews')
      .update({ isApproved: !currentStatus })
      .eq('id', id);
    if (error) {
      alert('Failed to update status');
    } else {
      fetchData();
    }
  };

  const filteredReviews = reviews.filter(r => 
    r.comment?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.User?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStars = (rating: number) => {
    return (
      <div style={{ display: 'flex', gap: '0.125rem' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            size={14} 
            fill={star <= rating ? 'var(--color-warning)' : 'transparent'} 
            color={star <= rating ? 'var(--color-warning)' : 'var(--color-border)'} 
          />
        ))}
      </div>
    );
  };

  const columns = [
    { key: 'User', label: 'Traveler', render: (val: any) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <img src={val?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (val?.fullName || 'User')} alt="avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
        <span style={{ fontWeight: '500' }}>{val?.fullName || 'Anonymous'}</span>
      </div>
    )},
    { key: 'rating', label: 'Rating', render: (val: number) => renderStars(val) },
    { key: 'comment', label: 'Review', render: (val: string) => (
      <span style={{ color: 'var(--color-text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        "{val}"
      </span>
    )},
    { key: 'createdAt', label: 'Date', render: (val: string) => <span style={{ fontSize: '0.875rem' }}>{new Date(val).toLocaleDateString()}</span> },
    { key: 'isApproved', label: 'Status', render: (val: boolean) => (
      <span style={{ 
        display: 'flex', alignItems: 'center', gap: '0.375rem',
        color: val ? 'var(--color-success)' : 'var(--color-text-muted)',
        fontSize: '0.875rem'
      }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: val ? 'var(--color-success)' : 'var(--color-text-muted)' }}></span>
        {val ? 'Approved' : 'Pending'}
      </span>
    )},
    { key: 'id', label: 'Actions', render: (val: string, row: any) => (
      <ActionButtons 
        onPower={() => handleToggleApprove(val, row.isApproved)}
        onEdit={() => handleOpenModal(row)} 
        onDelete={() => handleDelete(val)} 
      />
    )}
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--color-text-base)' }}>Traveler Reviews</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Manage customer reviews and ratings</p>
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
         + Add Review
        </button>
      </div>

      {isLoading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading data...</div>
      ) : (
        <Table 
          title="All Reviews" 
          data={filteredReviews} 
          columns={columns} 
          onSearch={setSearchTerm} 
        />
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingReview ? "Edit Review" : "Add New Review"}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-muted)' }}>Traveler</label>
            <select 
              required
              value={formData.userId} 
              onChange={e => setFormData({...formData, userId: e.target.value})}
              style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-base)' }}
            >
              <option value="">Select a user</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.fullName}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-muted)' }}>Trip ID</label>
            <select 
              required
              value={formData.tripId} 
              onChange={e => setFormData({...formData, tripId: e.target.value})}
              style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-base)' }}
            >
              <option value="">Select a trip</option>
              {trips.map(t => (
                <option key={t.id} value={t.id}>{t.id.substring(0,8)}...</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-muted)' }}>Rating (1-5)</label>
            <input 
              type="number" 
              min="1" max="5"
              required
              value={formData.rating} 
              onChange={e => setFormData({...formData, rating: parseInt(e.target.value)})}
              style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-base)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-muted)' }}>Review Comment</label>
            <textarea 
              rows={4}
              required
              value={formData.comment} 
              onChange={e => setFormData({...formData, comment: e.target.value})}
              style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-base)', resize: 'vertical' }}
              placeholder="The best booking experience..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '0.625rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', color: 'var(--color-text-base)', backgroundColor: 'transparent' }}>Cancel</button>
            <button type="submit" style={{ padding: '0.625rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary)', color: 'var(--color-bg-base)', fontWeight: '500', border: 'none' }}>Save Review</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Reviews;
