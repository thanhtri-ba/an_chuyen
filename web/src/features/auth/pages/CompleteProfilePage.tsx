import { useState, useEffect, useRef } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User as UserIcon, MapPin, Briefcase, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../lib/api';

const PHONE_REGEX = /^0\d{9,10}$/;
const ID_CARD_REGEX = /^\d{9}(\d{3})?$/;

const STEPS = ['Cá nhân', 'Liên hệ', 'Hoàn tất'] as const;

// Trang bắt buộc sau khi TẠO TÀI KHOẢN MỚI (đăng ký thường hoặc lần đầu đăng
// nhập Google) — thu thập thông tin còn thiếu (đặc biệt SĐT — Google không
// cung cấp) theo 3 bước, để hồ sơ khách hàng đầy đủ trước khi vào app.
export function CompleteProfilePage() {
  const { user, updateUser, isLoading } = useAuth();
  const [stepIdx, setStepIdx] = useState(0);

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [dob, setDob] = useState(user?.profile?.dob?.slice(0, 10) || '');
  const [gender, setGender] = useState(user?.gender || '');
  const [idCard, setIdCard] = useState(user?.profile?.idCard || '');

  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.profile?.address || '');

  const [nationality, setNationality] = useState(user?.profile?.nationality || 'Việt Nam');
  const [occupation, setOccupation] = useState(user?.profile?.occupation || '');

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const returnUrl = (location.state as { returnUrl?: string } | null)?.returnUrl || '/';

  // `user` loads asynchronously (AuthContext fetches /auth/profile on mount) —
  // on a direct/refreshed page load it's still null when this component's
  // useState initializers run, so the form fields stay blank forever without
  // this sync. Runs once, the first time `user` becomes available.
  const hydratedRef = useRef(false);
  useEffect(() => {
    if (!user || hydratedRef.current) return;
    hydratedRef.current = true;
    setFullName(user.fullName || '');
    setDob(user.profile?.dob?.slice(0, 10) || '');
    setGender(user.gender || '');
    setIdCard(user.profile?.idCard || '');
    setPhone(user.phone || '');
    setAddress(user.profile?.address || '');
    setNationality(user.profile?.nationality || 'Việt Nam');
    setOccupation(user.profile?.occupation || '');
  }, [user]);

  if (isLoading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  const validateStep = (idx: number): string | null => {
    if (idx === 0) {
      if (!fullName.trim()) return 'Vui lòng nhập họ và tên';
      if (idCard && !ID_CARD_REGEX.test(idCard)) return 'Số CCCD/CMND phải có 9 hoặc 12 chữ số';
    }
    if (idx === 1) {
      if (!PHONE_REGEX.test(phone)) return 'Số điện thoại không hợp lệ (VD: 0912345678)';
    }
    return null;
  };

  const goNext = () => {
    const err = validateStep(stepIdx);
    if (err) { setError(err); return; }
    setError('');
    setStepIdx(i => Math.min(i + 1, STEPS.length - 1));
  };
  const goBack = () => { setError(''); setStepIdx(i => Math.max(i - 1, 0)); };

  const handleSubmit = async () => {
    setError('');
    const stepErr = validateStep(0) || validateStep(1);
    if (stepErr) { setError(stepErr); return; }
    setIsSubmitting(true);
    try {
      const res = await api.put('/auth/profile', {
        fullName, phone, gender: gender || undefined, dob: dob || undefined, idCard: idCard || undefined,
        address: address || undefined, nationality: nationality || undefined, occupation: occupation || undefined,
      });
      if (res.data?.data) updateUser(res.data.data);
      navigate(returnUrl, { replace: true });
    } catch (err: unknown) {
      let msg = 'Không thể lưu thông tin. Vui lòng thử lại.';
      if (axios.isAxiosError(err) && (err.response?.data as { message?: string })?.message)
        msg = (err.response!.data as { message: string }).message;
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClass = "w-full bg-gray-50 border border-gray-100 px-5 py-4 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner";
  const labelClass = "text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2 block ml-1";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8">
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-1">Khai báo thông tin</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Chào {user.fullName}! Vui lòng cung cấp thông tin để hoàn tất hồ sơ.
        </p>

        {/* Progress stepper */}
        <div className="flex items-center mb-8">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                  ${i < stepIdx ? 'bg-[#1a1a1a] text-white' : i === stepIdx ? 'bg-primary text-black' : 'bg-gray-100 text-gray-400'}`}>
                  {i < stepIdx ? <Check size={14} /> : i + 1}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wide whitespace-nowrap ${i <= stepIdx ? 'text-[#1a1a1a]' : 'text-gray-400'}`}>{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 mx-2 mb-4 transition-colors ${i < stepIdx ? 'bg-[#1a1a1a]' : 'bg-gray-100'}`} />
              )}
            </div>
          ))}
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 mb-5">{error}</div>}

        <AnimatePresence mode="wait">
          {stepIdx === 0 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#6B7280]"><UserIcon size={14} /> Thông tin cá nhân</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={labelClass}>Họ và tên *</label>
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required autoFocus placeholder="Nguyễn Văn A" className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass}>Ngày sinh</label>
                  <input type="date" value={dob} onChange={e => setDob(e.target.value)} max={new Date().toISOString().slice(0, 10)} className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass}>Giới tính</label>
                  <select value={gender} onChange={e => setGender(e.target.value)} className={fieldClass}>
                    <option value="">-- Chọn --</option>
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Số CCCD/CMND</label>
                  <input type="text" value={idCard} onChange={e => setIdCard(e.target.value)} placeholder="012345678901" inputMode="numeric" maxLength={12} className={fieldClass} />
                </div>
              </div>
            </motion.div>
          )}

          {stepIdx === 1 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#6B7280]"><MapPin size={14} /> Thông tin liên hệ</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Email</label>
                  <input type="email" value={user.email || ''} disabled placeholder="example@gmail.com" className={`${fieldClass} opacity-60 cursor-not-allowed`} />
                </div>
                <div>
                  <label className={labelClass}>Số điện thoại *</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required autoFocus placeholder="0901234567" className={fieldClass} />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Địa chỉ</label>
                  <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Nhập địa chỉ..." className={fieldClass} />
                </div>
              </div>
            </motion.div>
          )}

          {stepIdx === 2 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#6B7280]"><Briefcase size={14} /> Thông tin bổ sung (tuỳ chọn)</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Quốc tịch</label>
                  <input type="text" value={nationality} onChange={e => setNationality(e.target.value)} placeholder="Việt Nam" className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass}>Nghề nghiệp</label>
                  <input type="text" value={occupation} onChange={e => setOccupation(e.target.value)} placeholder="VD: Nhân viên văn phòng" className={fieldClass} />
                </div>
              </div>

              <div className="bg-[#FEFCE8] border border-[#FEF9C3] rounded-xl p-4 space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-[#92400E]">Họ tên</span><span className="font-semibold text-[#1a1a1a]">{fullName}</span></div>
                <div className="flex justify-between"><span className="text-[#92400E]">SĐT</span><span className="font-semibold text-[#1a1a1a]">{phone}</span></div>
                {address && <div className="flex justify-between"><span className="text-[#92400E]">Địa chỉ</span><span className="font-semibold text-[#1a1a1a] text-right">{address}</span></div>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-3 mt-8">
          {stepIdx > 0 && (
            <button type="button" onClick={goBack} disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-4 rounded-xl text-xs font-bold tracking-[0.2em] uppercase border border-gray-200 text-[#374151] hover:bg-gray-50 transition-all disabled:opacity-50">
              <ArrowLeft size={16} /> Quay lại
            </button>
          )}
          {stepIdx < STEPS.length - 1 ? (
            <button type="button" onClick={goNext}
              className="flex-1 bg-[#1a1a1a] hover:bg-black text-white py-4 rounded-xl text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2">
              Tiếp tục <ArrowRight size={16} />
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={isSubmitting}
              className="flex-1 bg-[#1a1a1a] hover:bg-black text-white py-4 rounded-xl text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0">
              {isSubmitting ? 'Đang lưu...' : 'Hoàn tất'}
              {!isSubmitting && <Check size={16} />}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
