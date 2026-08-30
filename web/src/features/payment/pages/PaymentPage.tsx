import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Wallet, ShieldCheck, Ticket, CheckCircle2, Loader2, Info } from 'lucide-react';
import { motion } from 'framer-motion';

import api from '../../../lib/api';

import type { BookingData } from '../../../types';

const inputStyle: React.CSSProperties = {
  height: 48, width: '100%', background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.1)',
  borderRadius: 8, color: '#1a1a1a', fontFamily: 'system-ui', fontSize: 14, fontWeight: 700, outline: 'none',
};

function PaymentOption({ selected, onSelect, children }: { selected: boolean; onSelect: () => void; children: React.ReactNode }) {
  return (
    <label
      onClick={onSelect}
      style={{
        display: 'flex', flexDirection: 'column', padding: 18, borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s',
        border: `2px solid ${selected ? '#163328' : 'rgba(0,0,0,0.08)'}`,
        background: selected ? 'rgba(22,51,40,0.05)' : 'transparent',
      }}
    >
      {children}
    </label>
  );
}

export function PaymentPage() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('busz-wallet');
  const [isProcessing, setIsProcessing] = useState(false);
  const [usePoints, setUsePoints] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherApplied, setVoucherApplied] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<BookingData | null>(null);
  const [availablePoints, setAvailablePoints] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    const raw = sessionStorage.getItem('pending_booking');
    if (raw) {
      try {
        setPendingBooking(JSON.parse(raw));
      } catch {
        setPendingBooking(null);
      }
    }

    api.get('/loyalty/me')
      .then(res => setAvailablePoints(res.data?.data?.points || 0))
      .catch(() => setAvailablePoints(0));

    api.get('/wallet/me')
      .then(res => setWalletBalance(res.data?.data?.balance || 0))
      .catch(() => setWalletBalance(0));
  }, []);

  const [voucherDiscount, setVoucherDiscount] = useState(0);

  // seatsTotal chỉ tính tiền ghế, tránh double-count insurance từ trang trước
  const baseTotal = pendingBooking?.seatsTotal || 0;
  const insuranceTotal = pendingBooking?.addInsurance ? (pendingBooking.seats.length * (pendingBooking.insurancePrice || 20000)) : 0;
  const pointsDiscount = availablePoints * 10;
  const finalTotal = Math.max(0, baseTotal + insuranceTotal - (usePoints ? pointsDiscount : 0) - voucherDiscount);

  const handleApplyVoucher = async () => {
    try {
      const res = await api.post('/vouchers/validate', { code: voucherCode.toUpperCase() });
      if (res.data?.discount) {
        setVoucherDiscount(res.data.discount);
        setVoucherApplied(true);
      } else {
        setVoucherDiscount(0);
        alert('Mã không hợp lệ hoặc đã hết hạn.');
      }
    } catch {
      setVoucherDiscount(0);
      alert('Mã không hợp lệ hoặc đã hết hạn.');
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingBooking) {
      alert('Không tìm thấy thông tin đặt vé. Vui lòng chọn ghế lại.');
      return;
    }
    setIsProcessing(true);
    try {
      const res = await api.post('/bookings/create', {
        tripScheduleId: pendingBooking.tripScheduleId,
        seatNumbers: pendingBooking.seats,
        passengers: [{ name: pendingBooking.passengerInfo.name }],
        paymentMethod: selectedMethod,
        pickupPointId: pendingBooking.pickupPoint,
        dropoffPointId: pendingBooking.dropoffPoint,
        notes: pendingBooking.notes || '',
      });

      const booking = res.data?.data;
      sessionStorage.setItem('last_booking', JSON.stringify({
        bookingId: booking?.id,
        passengerName: pendingBooking.passengerInfo.name,
        routeLabel: pendingBooking.routeLabel,
        busAgentName: pendingBooking.busAgentName,
        seats: pendingBooking.seats,
        totalAmount: booking?.totalAmount ?? finalTotal,
        createdAt: booking?.createdAt || new Date().toISOString(),
      }));

      sessionStorage.removeItem('pending_booking');
      navigate('/booking-confirmation');
    } catch (error: any) {
      console.error("Booking failed", error);
      alert(error?.response?.data?.message || 'Thanh toán thất bại, vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
    }
  };

  const cardStyle: React.CSSProperties = { background: 'rgba(0,0,0,0.025)', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 12, padding: 28 };

  return (
    <div style={{ background: '#fcfcfc', color: '#1a1a1a', minHeight: 'calc(100vh - 4rem)', paddingTop: 80, paddingBottom: 48, fontFamily: 'system-ui' }}>
      {/* Header Info */}
      <div style={{ background: 'rgba(252,252,252,0.97)', backdropFilter: 'blur(24px)', padding: '16px 0', position: 'sticky', top: 0, zIndex: 30, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={() => navigate(`/seat-selection/${pendingBooking?.tripScheduleId || ''}`)}
            style={{ padding: 10, background: 'rgba(0,0,0,0.05)', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.1)', color: '#1a1a1a', cursor: 'pointer' }}
          >
            <ArrowLeft style={{ width: 20, height: 20 }} />
          </button>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: '#1a1a1a' }}>Thanh toán an toàn</h1>
            <p style={{ color: 'rgba(0,0,0,0.4)', fontSize: 12, fontWeight: 500, marginTop: 2 }}>Mã đơn hàng: #BZ882910</p>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 32, display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Left Column: Payment Methods */}
          <div className="w-full lg:w-[60%] flex flex-col gap-6">

            <div style={cardStyle}>
              <h2 style={{ fontSize: 19, fontWeight: 800, marginBottom: 24, color: '#1a1a1a' }}>Ưu đãi & Điểm thưởng</h2>

              <div className="flex flex-col gap-6">
                {/* An Chuyến Points */}
                <div
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: 16, borderRadius: 8, cursor: 'pointer', userSelect: 'none', background: 'rgba(22,51,40,0.06)', border: '1px solid rgba(22,51,40,0.2)' }}
                  onClick={() => setUsePoints(p => !p)}
                >
                  <input type="checkbox" checked={usePoints} onChange={(e) => setUsePoints(e.target.checked)} style={{ width: 18, height: 18, marginTop: 4, accentColor: '#163328', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: '#163328', display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                      <span>Sử dụng {new Intl.NumberFormat('vi-VN').format(availablePoints)} An Chuyến Points</span>
                      <span>-{new Intl.NumberFormat('vi-VN').format(pointsDiscount)}đ</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'rgba(22,51,40,0.6)', marginTop: 4 }}>Quy đổi: 10 Điểm = 100đ. Bạn đang có {new Intl.NumberFormat('vi-VN').format(availablePoints)} điểm.</p>
                  </div>
                </div>

                {/* Voucher */}
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Ticket style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: 'rgba(0,0,0,0.35)' }} />
                    <input
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      placeholder="Nhập mã khuyến mãi"
                      disabled={voucherApplied}
                      style={{ ...inputStyle, paddingLeft: 44, textTransform: 'uppercase' }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyVoucher}
                    disabled={voucherApplied || !voucherCode}
                    style={{
                      height: 48, padding: '0 24px', fontWeight: 700, fontSize: 13, borderRadius: 8, border: 'none', cursor: voucherApplied || !voucherCode ? 'not-allowed' : 'pointer',
                      opacity: voucherApplied || !voucherCode ? 0.5 : 1,
                      background: voucherApplied ? 'rgba(0,0,0,0.1)' : 'linear-gradient(135deg,#163328,#f0c94a)',
                      color: voucherApplied ? '#1a1a1a' : '#fcfcfc',
                    }}
                  >
                    {voucherApplied ? 'Đã áp dụng' : 'Áp dụng'}
                  </button>
                </div>
                {voucherApplied && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#34d399', fontSize: 13, fontWeight: 700, background: 'rgba(52,211,153,0.08)', padding: 12, borderRadius: 8, border: '1px solid rgba(52,211,153,0.2)' }}>
                    <CheckCircle2 style={{ width: 16, height: 16 }} /> Tuyệt vời! Bạn được giảm {new Intl.NumberFormat('vi-VN').format(voucherDiscount)}đ
                  </div>
                )}
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={{ fontSize: 19, fontWeight: 800, marginBottom: 24, color: '#1a1a1a' }}>Chọn phương thức thanh toán</h2>

              <form onSubmit={handlePayment} className="flex flex-col gap-4">

                <PaymentOption selected={selectedMethod === 'busz-wallet'} onSelect={() => setSelectedMethod('busz-wallet')}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(52,211,153,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
                        <Wallet style={{ width: 20, height: 20 }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#1a1a1a' }}>Ví An Chuyến Pay</div>
                        <div style={{ fontSize: 13, color: '#34d399', fontWeight: 600 }}>Số dư: {new Intl.NumberFormat('vi-VN').format(walletBalance)}đ</div>
                      </div>
                    </div>
                    <input type="radio" name="payment" checked={selectedMethod === 'busz-wallet'} onChange={() => setSelectedMethod('busz-wallet')} style={{ width: 20, height: 20, accentColor: '#163328' }} />
                  </div>
                  {selectedMethod === 'busz-wallet' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(0,0,0,0.08)', fontSize: 13, color: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <ShieldCheck style={{ width: 16, height: 16, color: '#34d399' }} /> Miễn phí giao dịch. Hoàn tiền 100% về ví nếu hủy vé hợp lệ.
                    </motion.div>
                  )}
                </PaymentOption>

                {/* Thanh toán tại quầy */}
                <PaymentOption selected={selectedMethod === 'cod'} onSelect={() => setSelectedMethod('cod')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={selectedMethod === 'cod'}
                      onChange={() => setSelectedMethod('cod')}
                      style={{ width: 18, height: 18, accentColor: '#163328' }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CreditCard style={{ width: 20, height: 20, color: '#1a1a1a' }} />
                      <span style={{ fontWeight: 700, color: '#1a1a1a' }}>Thanh toán tiền mặt tại quầy (COD)</span>
                    </div>
                  </div>
                  {selectedMethod === 'cod' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                      <div style={{ display: 'flex', gap: 12, background: 'rgba(251,146,60,0.08)', padding: 16, borderRadius: 8, border: '1px solid rgba(251,146,60,0.2)' }}>
                        <Info style={{ width: 20, height: 20, color: '#fb923c', flexShrink: 0 }} />
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: '#fdba74', marginBottom: 4 }}>Giữ chỗ trong 30 phút</p>
                          <p style={{ fontSize: 12, color: 'rgba(253,186,116,0.75)' }}>Bạn vui lòng đến quầy vé An Chuyến tại bến xe để thanh toán bằng tiền mặt và nhận vé cứng trong vòng 30 phút kể từ lúc đặt thành công. Sau thời gian này, vé sẽ tự động bị hủy.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </PaymentOption>
              </form>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-[40%]">
            <div style={{ ...cardStyle, position: 'sticky', top: 112 }}>
              <h2 style={{ fontSize: 19, fontWeight: 800, marginBottom: 24, color: '#1a1a1a' }}>Chi tiết thanh toán</h2>

              <div className="flex flex-col gap-4" style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#1a1a1a' }}>{pendingBooking?.routeLabel || 'Chuyến xe'}</div>
                    <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.4)', marginTop: 4 }}>
                      {pendingBooking?.busAgentName || 'Nhà xe'} • Ghế {pendingBooking?.seats.join(', ') || '--'}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: '#1a1a1a' }}>{new Intl.NumberFormat('vi-VN').format(pendingBooking?.seatsTotal || 0)}đ</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ShieldCheck style={{ width: 16, height: 16, color: '#34d399' }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.7)' }}>Bảo hiểm chuyến đi</span>
                  </div>
                  <div style={{ fontWeight: 700, color: '#1a1a1a' }}>{new Intl.NumberFormat('vi-VN').format(insuranceTotal)}đ</div>
                </div>

                {(usePoints || voucherApplied) && (
                  <div style={{ paddingTop: 16, borderTop: '1px dashed rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {usePoints && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#163328' }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>Giảm trừ điểm ({new Intl.NumberFormat('vi-VN').format(availablePoints)} pts)</span>
                        <span style={{ fontWeight: 700 }}>-{new Intl.NumberFormat('vi-VN').format(pointsDiscount)}đ</span>
                      </div>
                    )}
                    {voucherApplied && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#f0c94a' }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>Mã khuyến mãi ({voucherCode.toUpperCase()})</span>
                        <span style={{ fontWeight: 700 }}>-{new Intl.NumberFormat('vi-VN').format(voucherDiscount)}đ</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div style={{ paddingTop: 24, borderTop: '1px solid rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <span style={{ fontWeight: 700, color: '#1a1a1a' }}>Tổng thanh toán</span>
                  <span style={{ fontSize: 28, fontWeight: 800, color: '#163328' }}>
                    {new Intl.NumberFormat('vi-VN').format(finalTotal)}đ
                  </span>
                </div>
                <p style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)', textAlign: 'right' }}>Đã bao gồm thuế và phí dịch vụ</p>
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing}
                style={{
                  width: '100%', height: 56, fontWeight: 800, fontSize: 16, borderRadius: 10, border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isProcessing ? 'not-allowed' : 'pointer',
                  opacity: isProcessing ? 0.7 : 1, background: 'linear-gradient(135deg,#163328,#f0c94a)', color: '#fcfcfc',
                }}
              >
                {isProcessing ? (
                  <>
                    <Loader2 style={{ width: 22, height: 22, marginRight: 8 }} className="animate-spin" /> Đang xử lý giao dịch...
                  </>
                ) : (
                  `Thanh toán ${new Intl.NumberFormat('vi-VN').format(finalTotal)}đ`
                )}
              </button>

              <div style={{ marginTop: 16, display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 11, color: 'rgba(0,0,0,0.4)', background: 'rgba(0,0,0,0.03)', padding: 12, borderRadius: 8, border: '1px solid rgba(0,0,0,0.06)' }}>
                <Info style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2 }} />
                <span>Bằng việc bấm Thanh toán, bạn đồng ý với Điều khoản sử dụng và Chính sách bảo mật của An Chuyến.</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
