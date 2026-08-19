import React, { useState, useEffect, useMemo } from 'react';
import { CheckCircle, XCircle, Wallet, CreditCard, Clock, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Table from '../components/Table';
import { Modal } from '../components/Modal';
import { Select } from '../components/Select';

const STATUS_TABS = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'PENDING', label: 'Chờ xử lý' },
  { value: 'PROCESSING', label: 'Đang xử lý' },
  { value: 'PAID', label: 'Đã thanh toán' },
  { value: 'FAILED', label: 'Thất bại' },
  { value: 'REFUNDED', label: 'Đã hoàn tiền' }
];

const METHOD_OPTIONS = [
  { value: 'ALL', label: 'Tất cả phương thức' },
  { value: 'cod', label: 'COD (Tiền mặt)' },
  { value: 'vnpay', label: 'VNPay' },
  { value: 'momo', label: 'Momo' },
  { value: 'busz-wallet', label: 'Ví BusZ' },
  { value: 'qr', label: 'QR Code' },
  { value: 'card', label: 'Thẻ ngân hàng' }
];

const METHOD_LABELS: Record<string, string> = {
  cod: 'COD (Tiền mặt)', vnpay: 'VNPay', momo: 'Momo', 'busz-wallet': 'Ví BusZ', qr: 'QR Code', card: 'Thẻ ngân hàng'
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'var(--color-warning)',
  PROCESSING: 'var(--color-info)',
  PAID: 'var(--color-success)',
  FAILED: 'var(--color-danger)',
  REFUNDED: 'var(--color-text-muted)'
};

const formatVND = (n: number) => `${Math.round(n || 0).toLocaleString('vi-VN')}đ`;

const AdminPaymentPage = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [citiesMap, setCitiesMap] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [actionModal, setActionModal] = useState<{ type: 'confirm' | 'reject', payment: any } | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [paymentsRes, citiesRes] = await Promise.all([
        supabase
          .from('payments')
          .select('id, method, status, amount, createdAt, confirmedAt, bookingId, booking:bookings(id, status, TripSchedule:trip_schedules(departureTime, trips(Route:routes(departureCityId, arrivalCityId))), User:users(fullName, email))')
          .order('createdAt', { ascending: false }),
        supabase.from('cities').select('id, name')
      ]);

      if (paymentsRes.error) throw paymentsRes.error;
      setPayments(paymentsRes.data || []);

      const cMap: Record<string, string> = {};
      (citiesRes.data || []).forEach((c: any) => { cMap[c.id] = c.name; });
      setCitiesMap(cMap);
    } catch (e) {
      console.error('Failed to fetch payments:', e);
    }
    setIsLoading(false);
  };

  const kpis = useMemo(() => {
    const totalRevenue = payments.filter(p => p.status === 'PAID').reduce((s, p) => s + (p.amount || 0), 0);
    return {
      totalRevenue,
      totalCount: payments.length,
      pendingCount: payments.filter(p => p.status === 'PENDING').length,
      failedCount: payments.filter(p => p.status === 'FAILED').length
    };
  }, [payments]);

  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
      if (methodFilter !== 'ALL' && p.method !== methodFilter) return false;
      return true;
    });
  }, [payments, statusFilter, methodFilter]);

  const closeModal = () => {
    setActionModal(null);
    setRejectReason('');
  };

  const handleConfirm = async () => {
    if (!actionModal) return;
    const { payment } = actionModal;
    setIsSubmitting(true);
    try {
      const adminEmail = localStorage.getItem('admin_email') || 'admin';

      const { error: paymentError } = await supabase
        .from('payments')
        .update({ status: 'PAID', confirmedBy: adminEmail, confirmedAt: new Date().toISOString() })
        .eq('id', payment.id);
      if (paymentError) throw paymentError;

      const { error: bookingError } = await supabase
        .from('bookings')
        .update({ status: 'CONFIRMED' })
        .eq('id', payment.bookingId);
      if (bookingError) throw bookingError;

      closeModal();
      fetchData();
    } catch (e: any) {
      alert('Lỗi: ' + e.message);
    }
    setIsSubmitting(false);
  };

  const handleReject = async () => {
    if (!actionModal || !rejectReason.trim()) return;
    const { payment } = actionModal;
    setIsSubmitting(true);
    try {
      const adminEmail = localStorage.getItem('admin_email') || 'admin';

      const { error: paymentError } = await supabase
        .from('payments')
        .update({ status: 'FAILED', errorCode: rejectReason.trim(), confirmedBy: adminEmail })
        .eq('id', payment.id);
      if (paymentError) throw paymentError;

      const { error: bookingError } = await supabase
        .from('bookings')
        .update({ status: 'CANCELLED' })
        .eq('id', payment.bookingId);
      if (bookingError) throw bookingError;

      closeModal();
      fetchData();
    } catch (e: any) {
      alert('Lỗi: ' + e.message);
    }
    setIsSubmitting(false);
  };

  const columns = [
    {
      key: 'customer', label: 'Khách hàng', render: (_: any, item: any) => (
        <div>
          <div style={{ fontWeight: 600 }}>{item.booking?.User?.fullName || '—'}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{item.booking?.User?.email || ''}</div>
        </div>
      )
    },
    {
      key: 'route', label: 'Lộ trình', render: (_: any, item: any) => {
        const route = item.booking?.TripSchedule?.trips?.Route;
        if (!route) return '—';
        return `${citiesMap[route.departureCityId] || '?'} → ${citiesMap[route.arrivalCityId] || '?'}`;
      }
    },
    {
      key: 'method', label: 'Phương thức', render: (v: string) => (
        <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-bg-hover)', color: 'var(--color-text-base)', fontWeight: 500 }}>
          {METHOD_LABELS[v] || v}
        </span>
      )
    },
    { key: 'amount', label: 'Số tiền', render: (v: number) => <span style={{ fontWeight: 700 }}>{formatVND(v)}</span> },
    {
      key: 'status', label: 'Trạng thái', render: (v: string) => (
        <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: 'var(--radius-full)', backgroundColor: `${STATUS_COLORS[v] || 'var(--color-text-muted)'}20`, color: STATUS_COLORS[v] || 'var(--color-text-muted)', fontWeight: 700 }}>
          {STATUS_TABS.find(t => t.value === v)?.label || v}
        </span>
      )
    },
    { key: 'createdAt', label: 'Ngày tạo', render: (v: string) => new Date(v).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) },
    {
      key: 'actions', label: 'Hành động', render: (_: any, item: any) => {
        if (item.method !== 'cod' || item.status !== 'PENDING') return <span style={{ color: 'var(--color-text-muted)' }}>—</span>;
        return (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setActionModal({ type: 'confirm', payment: item })}
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-success)', color: '#fff', fontSize: '0.75rem', fontWeight: 600 }}
            >
              <CheckCircle size={14} /> Xác nhận
            </button>
            <button
              onClick={() => setActionModal({ type: 'reject', payment: item })}
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-danger)', color: '#fff', fontSize: '0.75rem', fontWeight: 600 }}
            >
              <XCircle size={14} /> Từ chối
            </button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--color-text-base)' }}>Quản Lý Thanh Toán</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Theo dõi giao dịch thanh toán và xác nhận thủ công cho đơn COD.</p>
      </div>

      {isLoading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Đang tải dữ liệu...</div>
      ) : (
        <>
          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <KpiTile title="Tổng doanh thu" value={formatVND(kpis.totalRevenue)} icon={<CreditCard size={18} />} />
            <KpiTile title="Tổng giao dịch" value={kpis.totalCount.toLocaleString()} icon={<Wallet size={18} />} />
            <KpiTile title="Chờ xử lý" value={kpis.pendingCount.toLocaleString()} icon={<Clock size={18} />} />
            <KpiTile title="Thất bại" value={kpis.failedCount.toLocaleString()} icon={<AlertTriangle size={18} />} />
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {STATUS_TABS.map(tab => (
                <button
                  key={tab.value}
                  onClick={() => setStatusFilter(tab.value)}
                  style={{
                    padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', fontWeight: 500,
                    backgroundColor: statusFilter === tab.value ? 'var(--color-primary)' : 'var(--color-bg-surface)',
                    color: statusFilter === tab.value ? 'var(--color-bg-base)' : 'var(--color-text-muted)',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div style={{ width: '220px', marginLeft: 'auto' }}>
              <Select value={methodFilter} onChange={setMethodFilter} options={METHOD_OPTIONS} />
            </div>
          </div>

          <Table columns={columns} data={filteredPayments} title="Danh sách giao dịch" />
        </>
      )}

      {/* Confirm / Reject Modal */}
      <Modal
        isOpen={!!actionModal}
        onClose={closeModal}
        title={actionModal?.type === 'confirm' ? 'Xác nhận thanh toán' : 'Từ chối thanh toán'}
      >
        {actionModal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Khách hàng</span>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{actionModal.payment.booking?.User?.fullName || '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Số tiền</span>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>{formatVND(actionModal.payment.amount)}</span>
              </div>
            </div>

            {actionModal.type === 'confirm' ? (
              <>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                  Xác nhận đã nhận đủ tiền mặt (COD) cho đơn này? Đơn đặt vé sẽ chuyển sang trạng thái đã xác nhận.
                </p>
                <button
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-success)', color: '#fff', fontWeight: 600, opacity: isSubmitting ? 0.6 : 1 }}
                >
                  {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đã thanh toán'}
                </button>
              </>
            ) : (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.5rem' }}>Lý do từ chối</label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Nhập lý do từ chối thanh toán..."
                    rows={4}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-base)', fontFamily: 'inherit', fontSize: '0.875rem', resize: 'vertical' }}
                  />
                </div>
                <button
                  onClick={handleReject}
                  disabled={isSubmitting || !rejectReason.trim()}
                  style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-danger)', color: '#fff', fontWeight: 600, opacity: (isSubmitting || !rejectReason.trim()) ? 0.6 : 1 }}
                >
                  {isSubmitting ? 'Đang xử lý...' : 'Từ chối thanh toán'}
                </button>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

const KpiTile = ({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) => (
  <div className="pro-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>{title}</h3>
      <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
        {icon}
      </div>
    </div>
    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-text-base)' }}>{value}</div>
  </div>
);

export default AdminPaymentPage;
