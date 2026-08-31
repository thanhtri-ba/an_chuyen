import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  User, Phone, Mail, Save, Wallet, Award, Ticket, TrendingUp, ChevronRight, Shield, Bell,
  Calendar, Globe, Briefcase, MapPin, Pencil, QrCode,
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../../lib/api';

const TIER_CONFIG = {
  Member: {
    label: 'Thành viên mới',
    color: 'linear-gradient(153deg, #6b7280 0%, #4b5563 50%, #374151 100%)',
    next: 'Bạc',
    pointsNeeded: 5000,
    currentPoints: 0,
    icon: '🌱',
  },
  Silver: {
    label: 'Bạc / Silver',
    color: 'linear-gradient(153deg, #4a5568 0%, #2d3748 50%, #1a202c 100%)',
    next: 'Vàng',
    pointsNeeded: 15000,
    currentPoints: 2450,
    icon: '🥈',
  },
  Gold: {
    label: 'Vàng / Gold',
    color: 'linear-gradient(153deg, #785900 0%, #4f4632 50%, #1a202c 100%)',
    next: 'Kim Cương',
    pointsNeeded: 50000,
    currentPoints: 2450,
    icon: '🥇',
  },
  Platinum: {
    label: 'Kim Cương / Platinum',
    color: 'linear-gradient(153deg, #7c3aed 0%, #4c1d95 50%, #1a202c 100%)',
    next: 'Tối đa',
    pointsNeeded: 999999,
    currentPoints: 2450,
    icon: '💎',
  },
};

const inputBase = "w-full bg-[#F8F9FF] border border-[#D4C5AB] rounded-lg pl-[41px] pr-[17px] py-[13px] text-sm text-[#0D1C2E] outline-none transition-colors";
const inputFocus = "focus:border-[#785900] focus:ring-2 focus:ring-[#785900]/10";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-bold text-[#4F4632] tracking-[0.24px] mb-1.5">{children}</label>;
}

function IconInput({ icon: Icon, ...props }: { icon?: any } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      {Icon && <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4F4632]/70 pointer-events-none" />}
      <input {...props} className={`${inputBase} ${inputFocus} ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`} />
    </div>
  );
}

export function ProfilePage() {
  const { user, isLoading } = useAuth();
  const { t } = useTranslation();
  const formRef = useRef<HTMLDivElement>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<'MALE'|'FEMALE'|'OTHER'|''>('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [nationality, setNationality] = useState('');
  const [occupation, setOccupation] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const currentTierStr = user?.loyalty?.tier || 'Member';
  const tier = { ...(TIER_CONFIG[currentTierStr as keyof typeof TIER_CONFIG] || TIER_CONFIG['Member']) };
  const currentPoints = user?.loyalty?.points || 0;
  tier.currentPoints = currentPoints;
  const progressPercent = Math.min((currentPoints / tier.pointsNeeded) * 100, 100);

  const balance = user?.wallet?.balance || 0;
  const bookingsCount = user?._count?.bookings || 0;

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setPhone(user.phone || '');
      setGender(user.gender || '');
      setAddress(user.profile?.address || '');
      setDob(user.profile?.dob || '');
      setEmergencyPhone(user.profile?.emergencyPhone || '');
      setNationality(user.profile?.nationality || '');
      setOccupation(user.profile?.occupation || '');
    }
  }, [user]);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FF] text-[#4F4632] text-sm font-medium">
      {t('common.loading')}
    </div>
  );
  if (!user) return <Navigate to="/auth" />;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.put('/auth/profile', {
        fullName, phone, gender: gender || undefined, address,
        dob: dob || undefined, emergencyPhone, nationality, occupation,
      });
      setMessage(t('profile.saveSuccess'));
      toast.success(t('profile.saveSuccess'));
    } catch {
      setMessage(t('profile.saveError'));
      toast.error(t('profile.saveError'));
    } finally {
      setIsSaving(false);
    }
  };

  const quickLinks = [
    { icon: Ticket, label: t('profile.myTickets'), sub: t('profile.myTicketsSub'), href: '/my-bookings', color: '#0D1C2E', bg: '#F3F4F6' },
    { icon: Award, label: t('profile.loyaltyProgram'), sub: t('profile.loyaltyProgramSub'), href: '/loyalty', color: '#854D0E', bg: '#FEFCE8' },
    { icon: Shield, label: t('profile.security'), sub: t('profile.securitySub'), href: '#', color: '#15803D', bg: '#F0FDF4' },
    { icon: Bell, label: t('profile.notifications'), sub: t('profile.notificationsSub'), href: '/notifications', color: '#7E22CE', bg: '#FAF5FF' },
  ];

  const stats = [
    { icon: Ticket, label: t('profile.totalTrips'), value: bookingsCount.toString() },
    { icon: Award, label: t('profile.totalPoints'), value: currentPoints.toLocaleString() },
    { icon: MapPin, label: t('profile.totalKm'), value: '0' },
    { icon: TrendingUp, label: t('profile.totalSaved'), value: '0đ' },
  ];

  const benefits = [
    { icon: '🎫', title: t('profile.benefitPriorityTitle'), desc: t('profile.benefitPriorityDesc') },
    { icon: '💰', title: t('profile.benefitCashbackTitle'), desc: t('profile.benefitCashbackDesc') },
    { icon: '🎁', title: t('profile.benefitPromoTitle'), desc: t('profile.benefitPromoDesc') },
    { icon: '📞', title: t('profile.benefitHotlineTitle'), desc: t('profile.benefitHotlineDesc') },
    { icon: '⭐', title: t('profile.benefitPointsTitle'), desc: t('profile.benefitPointsDesc') },
    { icon: '🛡️', title: t('profile.benefitInsuranceTitle'), desc: t('profile.benefitInsuranceDesc') },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FF] pt-[104px] pb-16 font-['Be_Vietnam_Pro',_sans-serif] text-[#0D1C2E]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pt-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── LEFT COLUMN ── */}
          <div className="w-full lg:w-[360px] shrink-0 flex flex-col gap-6">

            {/* Profile Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-[#D4C5AB] rounded-lg shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] p-[21px] flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full border-2 border-[#FFC107] bg-[#C5CBD3] flex items-center justify-center text-xl font-bold text-white shrink-0">
                  {fullName.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <h2 className="text-xl font-semibold text-[#0D1C2E] truncate">{fullName || t('profile.fullNamePlaceholder')}</h2>
                  <div className="flex items-center gap-1.5 text-sm text-[#4F4632] truncate"><Mail size={12} className="shrink-0" /> <span className="truncate">{user.email}</span></div>
                </div>
              </div>

              {/* Membership Card Visual */}
              <div className="relative rounded-lg border border-[#4B5563] shadow-lg overflow-hidden p-[21px] pt-[29px] pb-[21px] flex flex-col gap-8" style={{ backgroundImage: tier.color }}>
                <div className="absolute -right-10 -top-8 w-40 h-40 rounded-full bg-white/5 blur-xl pointer-events-none" />
                <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full bg-[#FFC107]/10 blur-xl pointer-events-none" />
                <div className="relative flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-[1px] text-gray-400">Thành viên</span>
                    <span className="text-xl font-bold text-gray-200 tracking-wide leading-tight">{tier.label}</span>
                  </div>
                  <span className="text-2xl leading-none">{tier.icon}</span>
                </div>
                <div className="relative flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-gray-300 gap-2">
                    <span className="shrink-0">{currentPoints.toLocaleString()} PTS</span>
                    <span className="text-right">{tier.next.toUpperCase()} ({tier.pointsNeeded.toLocaleString()} PTS)</span>
                  </div>
                  <div className="h-2 rounded-full border border-gray-600/50 bg-gray-700 overflow-hidden shadow-inner">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 1.2, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-gray-400 to-gray-200 shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="flex-1 flex items-center justify-center gap-2 bg-[#E5EEFF] rounded-lg py-3 text-xs font-semibold text-[#0D1C2E] tracking-[0.24px] hover:brightness-95 transition-all">
                  <Pencil size={13} /> Chỉnh sửa
                </button>
                <button onClick={() => toast('Tính năng Mã QR đang được phát triển')} className="flex-1 flex items-center justify-center gap-2 bg-[#E5EEFF] rounded-lg py-3 text-xs font-semibold text-[#0D1C2E] tracking-[0.24px] hover:brightness-95 transition-all">
                  <QrCode size={13} /> Mã QR
                </button>
              </div>
            </motion.div>

            {/* Wallet Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white border border-[#D4C5AB] rounded-lg shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] p-[21px] flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E5EEFF] flex items-center justify-center shrink-0"><Wallet size={18} className="text-[#0D1C2E]" /></div>
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="text-xs font-semibold tracking-[0.24px] text-[#4F4632] truncate">{t('profile.walletTitle')}</div>
                  <div className="text-xl font-semibold text-[#0D1C2E]">{balance.toLocaleString('vi-VN')} đ</div>
                </div>
              </div>
              <button className="w-full bg-[#FFC107] rounded-lg py-3 text-xs font-bold tracking-[0.24px] text-[#6D5100] shadow-[0_1px_1px_rgba(0,0,0,0.05)] hover:brightness-95 transition-all">
                {t('profile.deposit')}
              </button>
            </motion.div>

            {/* Quick Links */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white border border-[#D4C5AB] rounded-lg shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] p-2 flex flex-col">
              {quickLinks.map((item, i) => (
                <a key={i} href={item.href} className="flex items-center justify-between gap-4 p-3 rounded-lg hover:bg-[#F8F9FF] transition-colors">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: item.bg }}>
                      <item.icon size={18} style={{ color: item.color }} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-[#0D1C2E] truncate">{item.label}</span>
                      <span className="text-[11px] text-[#4F4632] opacity-70 truncate">{item.sub}</span>
                    </div>
                  </div>
                  <ChevronRight size={12} className="text-[#4F4632] opacity-50 shrink-0" />
                </a>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-8">

            {/* Personal Info Form */}
            <motion.div ref={formRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white border border-[#D4C5AB] rounded-lg shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] p-[24px] sm:p-[33px] flex flex-col gap-8">
              <div className="flex items-center gap-2 border-b border-[#D4C5AB] pb-[17px]">
                <User size={16} className="text-[#0D1C2E]" />
                <h3 className="text-xl font-semibold text-[#0D1C2E]">{t('profile.personalInfo')}</h3>
              </div>

              {message && (
                <div className={`-mt-4 px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-2 ${message === t('profile.saveSuccess') ? 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSave} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                    <FieldLabel>{t('profile.fullName')}</FieldLabel>
                    <IconInput icon={User} type="text" value={fullName} onChange={e => setFullName(e.target.value)} required placeholder={t('profile.fullNamePlaceholder')} />
                  </div>
                  <div>
                    <FieldLabel>{t('profile.phone')}</FieldLabel>
                    <IconInput icon={Phone} type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder={t('profile.phonePlaceholder')} />
                  </div>
                  <div>
                    <FieldLabel>{t('profile.emailLabel')}</FieldLabel>
                    <IconInput icon={Mail} type="email" value={user.email} disabled />
                  </div>
                  <div>
                    <FieldLabel>{t('profile.gender')}</FieldLabel>
                    <div className="flex items-center gap-6 h-[46px] pl-1">
                      {(['MALE', 'FEMALE', 'OTHER'] as const).map(g => {
                        const selected = gender === g;
                        return (
                          <label key={g} className="flex items-center gap-2 cursor-pointer select-none">
                            <span className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center transition-colors ${selected ? 'bg-[#785900] border-[#785900]' : 'bg-[#F8F9FF] border-[#D4C5AB]'}`}>
                              {selected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </span>
                            <input type="radio" name="gender" value={g} checked={selected} onChange={e => setGender(e.target.value as any)} className="sr-only" />
                            <span className="text-sm font-medium text-[#0D1C2E]">
                              {g === 'MALE' ? t('profile.genderMale') : g === 'FEMALE' ? t('profile.genderFemale') : t('profile.genderOther')}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <FieldLabel>{t('profile.dob')}</FieldLabel>
                    <IconInput icon={Calendar} type="date" value={dob} onChange={e => setDob(e.target.value)} />
                  </div>
                  <div>
                    <FieldLabel>{t('profile.emergencyPhone')}</FieldLabel>
                    <IconInput icon={Phone} type="text" value={emergencyPhone} onChange={e => setEmergencyPhone(e.target.value)} placeholder={t('profile.emergencyPhonePlaceholder')} />
                  </div>
                  <div>
                    <FieldLabel>{t('profile.nationality')}</FieldLabel>
                    <IconInput icon={Globe} type="text" value={nationality} onChange={e => setNationality(e.target.value)} placeholder={t('profile.nationalityPlaceholder')} />
                  </div>
                  <div>
                    <FieldLabel>{t('profile.occupation')}</FieldLabel>
                    <IconInput icon={Briefcase} type="text" value={occupation} onChange={e => setOccupation(e.target.value)} placeholder={t('profile.occupationPlaceholder')} />
                  </div>
                </div>

                <div>
                  <FieldLabel>{t('profile.address')}</FieldLabel>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-[13px] text-[#4F4632]/70 pointer-events-none" />
                    <textarea
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder={t('profile.addressPlaceholder')}
                      rows={3}
                      className={`${inputBase} ${inputFocus} resize-none min-h-[66px]`}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-[#FFC107] rounded-lg px-8 py-3 text-xs font-bold uppercase tracking-[0.24px] text-[#6D5100] shadow-[0_1px_1px_rgba(0,0,0,0.05)] hover:brightness-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <Save size={14} />
                    {isSaving ? t('profile.saving') : t('profile.saveChanges')}
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col gap-6">
              <h3 className="text-xl font-semibold text-[#0D1C2E]">{t('profile.myStats')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-white border border-[#D4C5AB] rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05)] p-[25px] flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#E5EEFF] flex items-center justify-center">
                      <stat.icon size={18} className="text-[#0D1C2E]" />
                    </div>
                    <div className="text-xl font-bold text-[#0D1C2E] text-center">{stat.value}</div>
                    <div className="text-xs font-medium text-[#4F4632] tracking-[0.24px] text-center">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Membership Benefits */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="flex flex-col gap-6 pb-10">
              <div className="flex items-center gap-2">
                <Award size={16} className="text-[#785900]" />
                <h3 className="text-xl font-semibold text-[#0D1C2E]">{t('profile.memberBenefits')} {tier.label}</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {benefits.map((b, i) => (
                  <div key={i} className="bg-white border border-[#D4C5AB] rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05)] p-[21px] flex gap-4 items-start">
                    <span className="text-3xl leading-none shrink-0">{b.icon}</span>
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="text-base font-bold text-[#0D1C2E] leading-tight">{b.title}</div>
                      <div className="text-xs text-[#4F4632] tracking-[0.24px] leading-snug">{b.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
