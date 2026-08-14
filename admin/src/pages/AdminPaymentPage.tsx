import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../lib/i18n';
import { CheckCircle, XCircle } from 'lucide-react';

const AdminPaymentPage = () => {
  const { t } = useLanguage();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          booking:bookings(
            totalAmount,
            userId,
            tripScheduleId
          )
        `)
        .eq('method', 'cod')
        .eq('status', 'PENDING')
        .order('createdAt', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (paymentId: string, bookingId: string) => {
    if (!window.confirm('Xác nhận thanh toán cho booking này?')) return;

    try {
      // 1. Update Payment
      const { error: paymentError } = await supabase
        .from('payments')
        .update({
          status: 'PAID',
          confirmedBy: 'Admin', // Lấy email từ auth nếu có
          confirmedAt: new Date().toISOString()
        })
        .eq('id', paymentId);

      if (paymentError) throw paymentError;

      // 2. Update Booking
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({
          status: 'CONFIRMED'
        })
        .eq('id', bookingId);

      if (bookingError) throw bookingError;

      alert('Thanh toán đã được xác nhận');
      fetchPendingPayments(); // Refresh
    } catch (error: any) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleReject = async (paymentId: string, bookingId: string) => {
    const reason = window.prompt('Lý do từ chối thanh toán:');
    if (!reason) return;

    try {
      // 1. Update Payment
      const { error: paymentError } = await supabase
        .from('payments')
        .update({
          status: 'FAILED',
          errorCode: reason,
          confirmedBy: 'Admin'
        })
        .eq('id', paymentId);

      if (paymentError) throw paymentError;

      // 2. Update Booking
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({
          status: 'CANCELLED'
        })
        .eq('id', bookingId);

      if (bookingError) throw bookingError;

      alert('Đơn thanh toán đã bị từ chối');
      fetchPendingPayments();
    } catch (error: any) {
      alert('Lỗi: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Quản Lý Thanh Toán (COD)
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Danh Sách Chờ Xác Nhận
          </h2>
          {loading ? (
            <p className="text-gray-500">Đang tải...</p>
          ) : payments.length === 0 ? (
            <p className="text-gray-500">Không có thanh toán chờ xác nhận</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Booking ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Số Tiền</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ngày Đặt</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Trạng Thái</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-gray-100">{payment.bookingId.slice(0, 8)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-gray-100">{payment.amount.toLocaleString('vi-VN')} VND</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{new Date(payment.createdAt).toLocaleDateString('vi-VN')}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Chờ Xác Nhận
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleConfirm(payment.id, payment.bookingId)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Xác Nhận
                          </button>
                          <button
                            onClick={() => handleReject(payment.id, payment.bookingId)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Từ Chối
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentPage;
