import React, { useState, useEffect } from 'react';
import Table from '../components/Table';
import { useLanguage } from '../lib/i18n';
import { supabase } from '../lib/supabase';
import { Modal } from '../components/Modal';
import { Select } from '../components/Select';
import { ActionButtons } from '../components/ActionButtons';

const Users = () => {
  const { t } = useLanguage();
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    fullName: '',
    email: '',
    phone: '',
    avatar: '',
    role: 'user',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data } = await supabase.from('users').select('*').order('createdAt', { ascending: false });
    if (data) {
      setUsers(data);
    }
  };

  const showToast = (msg: string, type: 'warning' | 'success' = 'warning') => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenEdit = (user: any) => {
    setFormData({
      id: user.id,
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phone || '',
      avatar: user.avatar || '',
      role: user.role || 'user',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('users').update({
        fullName: formData.fullName,
        phone: formData.phone || null,
        avatar: formData.avatar || null,
        role: formData.role,
        updatedAt: new Date().toISOString()
      }).eq('id', formData.id);

      if (error) throw error;

      setIsSubmitting(false);
      setIsModalOpen(false);
      fetchUsers();
      showToast('Cập nhật thông tin thành công!', 'success');
    } catch (error: any) {
      alert('Error saving user: ' + error.message);
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: 'fullName', label: t('users', 'name'), render: (val: string, item: any) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-bg-base)', fontSize: '0.75rem', fontWeight: 'bold' }}>
          {val ? val.charAt(0).toUpperCase() : 'U'}
        </div>
        <div>
          <p style={{ fontWeight: '500' }}>{val || 'Unknown'}</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{item.email}</p>
        </div>
      </div>
    )},
    { key: 'role', label: t('users', 'role'), render: (val: string) => (
      <span style={{
        padding: '0.25rem 0.5rem',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.75rem',
        fontWeight: '500',
        backgroundColor: val === 'admin' ? 'rgba(79, 70, 229, 0.1)' : val === 'agent' ? 'rgba(245, 158, 11, 0.1)' : 'var(--color-bg-base)',
        color: val === 'admin' ? 'var(--color-primary)' : val === 'agent' ? 'var(--color-warning)' : 'var(--color-text-base)'
      }}>
        {val || 'user'}
      </span>
    )},
    { key: 'createdAt', label: t('users', 'joinedAt'), render: (val: string) => val ? new Date(val).toLocaleDateString() : '-' },
    { key: 'actions', label: t('common', 'actions'), render: (_: any, item: any) => (
      <ActionButtons
        onPower={() => showToast('Người dùng được khởi tạo từ ứng dụng. Không thể thay đổi trạng thái từ đây.')}
        onEdit={() => handleOpenEdit(item)}
        onDelete={() => showToast('Người dùng được khởi tạo từ ứng dụng. Không thể xóa từ đây.')}
      />
    )}
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--color-text-base)' }}>{t('users', 'title')}</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{t('users', 'subtitle')}</p>
        </div>
      </div>

      <Table
        title={t('users', 'allUsers')}
        data={filteredUsers}
        columns={columns}
        onSearch={setSearchTerm}
      />

      {/* Edit User Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Chỉnh sửa thông tin">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
          {/* Avatar preview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden',
              border: '2px solid var(--color-border)', backgroundColor: 'var(--color-bg-elevated)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              {formData.avatar ? (
                <img src={formData.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              ) : (
                <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-text-muted)' }}>
                  {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : 'U'}
                </span>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.8125rem', fontWeight: '500' }}>Ảnh đại diện (URL)</label>
              <input value={formData.avatar} onChange={e => setFormData({...formData, avatar: e.target.value})} placeholder="https://..." style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-base)', fontSize: '0.8125rem' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Họ và tên</label>
            <input required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-base)' }} />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Email</label>
              <input disabled value={formData.email} style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-hover)', color: 'var(--color-text-muted)', cursor: 'not-allowed' }} />
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Khởi tạo từ ứng dụng, không thể thay đổi.</p>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Số điện thoại</label>
              <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="0901 234 567" style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-base)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Vai trò</label>
            <Select
              value={formData.role}
              onChange={val => setFormData({...formData, role: val})}
              options={[
                { label: 'Người dùng (User)', value: 'user' },
                { label: 'Đại lý (Agent)', value: 'agent' },
                { label: 'Quản trị (Admin)', value: 'admin' }
              ]}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-base)' }}>Hủy</button>
            <button type="submit" disabled={isSubmitting} style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: 'none', backgroundColor: 'var(--color-primary)', color: 'var(--color-bg-base)', fontWeight: '600' }}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Toast notification */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '2rem', right: '2rem',
          backgroundColor: 'var(--color-bg-surface)',
          border: `1px solid ${toast.includes('thành công') ? 'var(--color-success)' : 'var(--color-warning)'}`,
          borderRadius: 'var(--radius-lg)',
          padding: '1rem 1.5rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          animation: 'fadeIn 0.3s ease',
          zIndex: 999,
          maxWidth: '400px'
        }}>
          <span style={{ fontSize: '1.25rem' }}>{toast.includes('thành công') ? '✅' : '⚠️'}</span>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-base)', fontWeight: '500' }}>{toast}</p>
        </div>
      )}
    </div>
  );
};

export default Users;
