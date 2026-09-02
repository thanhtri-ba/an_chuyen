import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../../lib/api';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await api.post('/auth/reset-password', { token, newPassword: password });
      setDone(true);
      setTimeout(() => navigate('/auth'), 2000);
    } catch (err: unknown) {
      let msg = 'Không thể đặt lại mật khẩu. Link có thể đã hết hạn.';
      if (axios.isAxiosError(err) && (err.response?.data as { message?: string })?.message)
        msg = (err.response!.data as { message: string }).message;
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8 text-center">
          <p className="text-sm text-red-600 mb-4">Link đặt lại mật khẩu không hợp lệ.</p>
          <Link to="/forgot-password" className="text-primary font-bold hover:underline text-sm">Yêu cầu link mới</Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8">
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">Đặt lại mật khẩu</h1>
        <p className="text-sm text-muted-foreground mb-6">Nhập mật khẩu mới cho tài khoản của bạn.</p>

        {done ? (
          <div className="bg-green-50 border border-green-200 text-green-800 text-sm rounded-xl p-4">
            Đặt lại mật khẩu thành công! Đang chuyển sang trang đăng nhập...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">{error}</div>}
            <div>
              <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2 block ml-1">Mật khẩu mới</label>
              <div className="relative">
                <Lock size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-100 pl-12 pr-12 py-4 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={isSubmitting}
              className="w-full bg-[#1a1a1a] hover:bg-black text-white py-4 rounded-xl text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0">
              {isSubmitting ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
              {!isSubmitting && <ArrowRight size={16} />}
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
}
