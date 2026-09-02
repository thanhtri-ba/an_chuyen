import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Copy, Check, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import api from '../../../lib/api';

interface BankInfo { accountName: string; accountNumber: string; bankBin: string; }

// Không có gateway trung gian — khách quét mã VietQR (dịch vụ công khai
// img.vietqr.io, không cần API key) chuyển khoản trực tiếp vào tài khoản của
// An Chuyến, admin xác nhận thủ công sau khi thấy tiền về (giống luồng COD).
export function BankTransferQRPage() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId') || '';
  const amount = Number(searchParams.get('amount') || 0);
  const [bankInfo, setBankInfo] = useState<BankInfo | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.get('/bank-transfer/info').then(res => setBankInfo(res.data)).catch(() => setError('Chuyển khoản ngân hàng hiện chưa khả dụng. Vui lòng chọn phương thức khác.'));
  }, []);

  const transferContent = `AC ${bookingId.slice(0, 8).toUpperCase()}`;

  const copyContent = () => {
    navigator.clipboard.writeText(transferContent);
    setCopied(true);
    toast.success('Đã sao chép nội dung chuyển khoản');
    setTimeout(() => setCopied(false), 2000);
  };

  const qrUrl = bankInfo
    ? `https://img.vietqr.io/image/${bankInfo.bankBin}-${bankInfo.accountNumber}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(bankInfo.accountName)}`
    : '';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8">
        <h1 className="text-xl font-bold text-[#1a1a1a] mb-1">Chuyển khoản ngân hàng</h1>
        <p className="text-sm text-muted-foreground mb-6">Quét mã QR bằng app ngân hàng bất kỳ để chuyển khoản tự động điền đúng số tiền.</p>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4">{error}</div>}

        {bankInfo && (
          <>
            <div className="flex justify-center mb-6">
              <img src={qrUrl} alt="Mã QR chuyển khoản" className="w-56 h-56 rounded-xl border border-gray-100" />
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-2.5 text-sm mb-4">
              <div className="flex justify-between"><span className="text-muted-foreground">Ngân hàng thụ hưởng</span><span className="font-semibold text-[#1a1a1a]">BIN {bankInfo.bankBin}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Chủ tài khoản</span><span className="font-semibold text-[#1a1a1a]">{bankInfo.accountName}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Số tài khoản</span><span className="font-semibold text-[#1a1a1a]">{bankInfo.accountNumber}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Số tiền</span><span className="font-bold text-[#1a1a1a]">{new Intl.NumberFormat('vi-VN').format(amount)}đ</span></div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Nội dung CK</span>
                <button onClick={copyContent} className="flex items-center gap-1.5 font-semibold text-[#1a1a1a]">
                  {transferContent} {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-[#FEFCE8] border border-[#FEF9C3] rounded-xl p-3 text-xs text-[#92400E] mb-6">
              <Clock size={14} className="shrink-0 mt-0.5" />
              Vui lòng ghi đúng nội dung chuyển khoản để hệ thống đối soát chính xác. Đơn hàng sẽ được xác nhận trong vòng vài phút sau khi nhận được tiền.
            </div>
          </>
        )}

        <Link to="/my-bookings" className="block w-full text-center bg-[#1a1a1a] hover:bg-black text-white py-4 rounded-xl text-xs font-bold tracking-[0.2em] uppercase transition-all">
          Đã chuyển khoản, xem đơn hàng
        </Link>
      </div>
    </motion.div>
  );
}
