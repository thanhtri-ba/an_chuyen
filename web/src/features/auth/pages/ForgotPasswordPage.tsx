import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../../lib/api';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  // Chỉ backend trả field này khi NODE_ENV=development (chưa cấu hình email
  // provider thật) — cho phép test luồng reset ngay tại đây thay vì check email.
  const [devResetLink, setDevResetLink] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setSent(true);
      if (res.data?.devResetLink) setDevResetLink(res.data.devResetLink);
    } catch (err: unknown) {
      let msg = 'Không thể gửi yêu cầu. Vui lòng thử lại.';
      if (axios.isAxiosError(err) && (err.response?.data as { message?: string })?.message)
        msg = (err.response!.data as { message: string }).message;
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8">
        <button onClick={() => navigate('/auth')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft size={14} /> Quay lại đăng nhập
        </button>

        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">Quên mật khẩu?</h1>
        <p className="text-sm text-muted-foreground mb-6">Nhập email đã đăng ký, chúng tôi sẽ gửi link đặt lại mật khẩu.</p>

        {sent ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 text-green-800 text-sm rounded-xl p-4">
              Nếu email tồn tại trong hệ thống, link đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư.
            </div>
            {devResetLink && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl p-4 break-all">
                <p className="font-bold mb-1">Chế độ dev (chưa cấu hình email provider):</p>
                <Link to={devResetLink.replace(window.location.origin, '')} className="underline">{devResetLink}</Link>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">{error}</div>}
            <div>
              <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2 block ml-1">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="ten@example.com"
                  className="w-full bg-gray-50 border border-gray-100 pl-12 pr-5 py-4 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner" />
              </div>
            </div>
            <button type="submit" disabled={isSubmitting}
              className="w-full bg-[#1a1a1a] hover:bg-black text-white py-4 rounded-xl text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0">
              {isSubmitting ? 'Đang gửi...' : 'Gửi link đặt lại'}
              {!isSubmitting && <ArrowRight size={16} />}
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
}
