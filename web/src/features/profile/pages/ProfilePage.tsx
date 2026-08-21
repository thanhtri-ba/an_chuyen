import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Phone, Mail, Save, LogOut, Wallet, Award, Ticket, TrendingUp, ChevronRight, Shield, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../../lib/api';

const TIER_CONFIG = {
  Member: {
    label: 'Thành viên mới',
    color: 'linear-gradient(135deg, #6b7280, #374151)',
    textColor: '#9ca3af',
    bgColor: 'rgba(156,163,175,0.12)',
    next: 'Bạc',
    pointsNeeded: 5000,
    currentPoints: 0,
    icon: '🌱',
  },
  Silver: {
    label: 'Thành viên Bạc',
    color: 'linear-gradient(135deg, #94a3b8, #475569)',
    textColor: '#cbd5e1',
    bgColor: 'rgba(148,163,184,0.12)',
    next: 'Vàng',
    pointsNeeded: 15000,
    currentPoints: 2450,
    icon: '🥈',
  },
  Gold: {
    label: 'Thành viên Vàng',
    color: 'linear-gradient(135deg, #d4af37, #f0c94a)',
    textColor: '#d4af37',
    bgColor: 'rgba(212,175,55,0.12)',
    next: 'Kim Cương',
    pointsNeeded: 50000,
    currentPoints: 2450,
    icon: '🥇',
  },
  Platinum: {
    label: 'Thành viên Kim Cương',
    color: 'linear-gradient(135deg, #a78bfa, #6366f1)',
    textColor: '#a5b4fc',
    bgColor: 'rgba(129,140,248,0.12)',
    next: 'Tối đa',
    pointsNeeded: 999999,
    currentPoints: 2450,
    icon: '💎',
  },
};

const inputStyle: React.CSSProperties = {
  width: '100%', height: 48, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8, color: '#f0ede6', fontFamily: 'system-ui', fontSize: 14, fontWeight: 500,
  transition: 'border-color 0.2s, background 0.2s', outline: 'none',
};

const labelStyle: React.CSSProperties = {
  fontSize: 10, fontWeight: 700, color: 'rgba(240,237,230,0.4)', textTransform: 'uppercase',
  letterSpacing: '0.15em', fontFamily: 'system-ui', display: 'block', marginBottom: 8,
};

function FormInput({ icon: Icon, style, ...props }: { icon?: any } & React.InputHTMLAttributes<HTMLInputElement> & { style?: React.CSSProperties }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      {Icon && <Icon style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: 'rgba(240,237,230,0.3)' }} />}
      <input
        {...props}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...inputStyle,
          paddingLeft: Icon ? 44 : 16, paddingRight: 16,
          borderColor: focused ? '#d4af37' : 'rgba(255,255,255,0.1)',
          background: focused ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.05)',
          ...style,
        }}
      />
    </div>
  );
}

export function ProfilePage() {
  const { user, logout, isLoading } = useAuth();
  const { t } = useTranslation();
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
  const tier = { ...TIER_CONFIG[currentTierStr as keyof typeof TIER_CONFIG] } || { ...TIER_CONFIG['Member'] };
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
    <div style={{ background: '#0e1111', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(240,237,230,0.3)', fontFamily: 'system-ui' }}>
      {t('common.loading')}
    </div>
  );
  if (!user) return <Navigate to="/auth" />;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.put('/auth/profile', {
        fullName,
        phone,
        gender: gender || undefined,
        address,
        dob: dob || undefined,
        emergencyPhone,
        nationality,
        occupation
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

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden',
  };

  return (
    <div style={{ background: '#0e1111', color: '#f0ede6', minHeight: '100vh', paddingTop: 100, paddingBottom: 32, fontFamily: 'system-ui' }}>
      {/* Page Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 40, padding: '0 8% 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 24, height: 1, background: '#d4af37' }} />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#d4af37' }}>Tài khoản</span>
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 400, color: '#f0ede6', margin: 0 }}>{t('profile.title')}</h1>
            <p style={{ color: 'rgba(240,237,230,0.4)', fontSize: 14, marginTop: 4 }}>{t('profile.subtitle')}</p>
          </div>
          <button
            onClick={logout}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, height: 44, padding: '0 20px',
              background: 'transparent', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171',
              fontFamily: 'system-ui', fontSize: 13, fontWeight: 700, cursor: 'pointer', borderRadius: 8,
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(248,113,113,0.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <LogOut style={{ width: 16, height: 16 }} /> Đăng xuất
          </button>
        </div>
      </div>

      <div style={{ padding: '0 8%' }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ===== LEFT COLUMN ===== */}
          <div className="lg:col-span-1 flex flex-col gap-5">

            {/* Avatar Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={cardStyle}>
              <div style={{ height: 80, background: 'linear-gradient(135deg, rgba(212,175,55,0.25), rgba(14,17,17,0.9))', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
              </div>
              <div style={{ padding: '0 24px 24px', marginTop: -40, textAlign: 'center' }}>
                <div style={{
                  width: 80, height: 80, background: 'linear-gradient(135deg,#d4af37,#f0c94a)', color: '#0e1111',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, fontWeight: 800, margin: '0 auto', border: '4px solid #0e1111',
                }}>
                  {fullName.charAt(0).toUpperCase() || 'U'}
                </div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.4rem', fontWeight: 600, color: '#f0ede6', marginTop: 12 }}>{fullName || 'Tên người dùng'}</h2>
                <p style={{ color: 'rgba(240,237,230,0.4)', fontSize: 13, marginTop: 2 }}>{user.email}</p>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12, padding: '6px 14px',
                  borderRadius: 100, fontSize: 11, fontWeight: 700, background: tier.bgColor, color: tier.textColor,
                }}>
                  <span>{tier.icon}</span> {tier.label}
                </div>
              </div>

              {/* Quick Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                {[
                  { label: t('profile.trips'), value: bookingsCount.toString() },
                  { label: t('profile.points'), value: currentPoints.toLocaleString() },
                  { label: t('profile.tier'), value: tier.label.split(' ')[0] },
                ].map((stat, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 8px', borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
                    <div style={{ fontWeight: 800, color: '#f0ede6', fontSize: 15 }}>{stat.value}</div>
                    <div style={{ fontSize: 10, color: 'rgba(240,237,230,0.35)', fontWeight: 500, marginTop: 2 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Loyalty Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div style={{ position: 'relative', background: tier.color, borderRadius: 12, padding: 24, color: '#fff', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: 128, height: 128, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', transform: 'translate(40%,-40%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: 96, height: 96, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', transform: 'translate(-32%,32%)' }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                    <div>
                      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 4 }}>An Chuyến Member Card</div>
                      <div style={{ fontWeight: 800, fontSize: 20 }}>{tier.label}</div>
                    </div>
                    <div style={{ fontSize: 28 }}>{tier.icon}</div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, marginBottom: 8 }}>
                      <span style={{ color: 'rgba(255,255,255,0.7)' }}>{t('profile.currentPoints')}</span>
                      <span>{tier.currentPoints} / {tier.pointsNeeded} pts → {tier.next}</span>
                    </div>
                    <div style={{ width: '100%', height: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 100, overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        style={{ height: '100%', background: '#fff', borderRadius: 100 }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>{t('profile.accumulatedPoints')}</div>
                      <div style={{ fontWeight: 800, fontSize: 22 }}>{tier.currentPoints.toLocaleString()}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>{fullName}</div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 2 }}>**** {currentPoints}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Wallet Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={{ ...cardStyle, padding: 20, borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, background: 'rgba(129,140,248,0.12)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Wallet style={{ width: 20, height: 20, color: '#a5b4fc' }} />
                </div>
                <div>
                  <h3 style={{ fontWeight: 800, color: '#f0ede6', fontSize: 14 }}>{t('profile.walletTitle')}</h3>
                  <div style={{ fontSize: 11, color: 'rgba(240,237,230,0.4)' }}>{t('profile.availableBalance')}</div>
                </div>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#a5b4fc', marginBottom: 16 }}>{balance.toLocaleString('vi-VN')}<span style={{ fontSize: 18, opacity: 0.6 }}>đ</span></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <button style={{ height: 40, background: '#6366f1', color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', borderRadius: 8, cursor: 'pointer' }}>{t('profile.deposit')}</button>
                <button style={{ height: 40, background: 'transparent', border: '1px solid rgba(165,180,252,0.3)', color: '#a5b4fc', fontWeight: 700, fontSize: 13, borderRadius: 8, cursor: 'pointer' }}>{t('profile.history')}</button>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ ...cardStyle, borderRadius: 12 }}>
              {[
                { icon: Ticket, label: t('profile.myTickets'), sub: t('profile.myTicketsSub'), href: '/my-bookings', color: '#d4af37', bg: 'rgba(212,175,55,0.12)' },
                { icon: Award, label: t('profile.loyaltyProgram'), sub: t('profile.loyaltyProgramSub'), href: '/loyalty', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
                { icon: Shield, label: t('profile.security'), sub: t('profile.securitySub'), href: '#', color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
                { icon: Bell, label: t('profile.notifications'), sub: t('profile.notificationsSub'), href: '/notifications', color: '#c084fc', bg: 'rgba(192,132,252,0.1)' },
              ].map((item, i, arr) => (
                <a key={i} href={item.href} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: 16,
                  borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  textDecoration: 'none', transition: 'background 0.2s',
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ width: 36, height: 36, background: item.bg, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <item.icon style={{ width: 16, height: 16, color: item.color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#f0ede6' }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: 'rgba(240,237,230,0.4)' }}>{item.sub}</div>
                  </div>
                  <ChevronRight style={{ width: 16, height: 16, color: 'rgba(240,237,230,0.25)', flexShrink: 0 }} />
                </a>
              ))}
            </motion.div>
          </div>

          {/* ===== RIGHT COLUMN ===== */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Edit Profile Form */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ ...cardStyle, borderRadius: 12, padding: '28px 32px' }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#f0ede6', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, background: 'rgba(212,175,55,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User style={{ width: 16, height: 16, color: '#d4af37' }} />
                </div>
                Thông tin cá nhân
              </h3>

              {message && (
                <div style={{
                  marginBottom: 20, padding: 14, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, borderRadius: 8,
                  background: message.includes('thành công') ? 'rgba(52,211,153,0.08)' : 'rgba(248,113,113,0.08)',
                  color: message.includes('thành công') ? '#34d399' : '#f87171',
                  border: `1px solid ${message.includes('thành công') ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)'}`,
                }}>
                  <span>{message.includes('thành công') ? '✅' : '❌'}</span>
                  {message}
                </div>
              )}

              <form onSubmit={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label style={labelStyle}>{t('profile.fullName')}</label>
                    <FormInput icon={User} type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder={t('profile.fullNamePlaceholder')} />
                  </div>

                  <div>
                    <label style={labelStyle}>{t('profile.phone')}</label>
                    <FormInput icon={Phone} type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t('profile.phonePlaceholder')} />
                  </div>

                  <div>
                    <label style={labelStyle}>{t('profile.emailLabel')}</label>
                    <FormInput icon={Mail} type="email" value={user.email} disabled style={{ opacity: 0.5, cursor: 'not-allowed' }} />
                  </div>

                  <div>
                    <label style={labelStyle}>{t('profile.gender')}</label>
                    <div style={{ display: 'flex', gap: 20, alignItems: 'center', height: 48 }}>
                      {['MALE', 'FEMALE', 'OTHER'].map(g => (
                        <label key={g} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="gender"
                            value={g}
                            checked={gender === g}
                            onChange={(e) => setGender(e.target.value as any)}
                            style={{ width: 16, height: 16, accentColor: '#d4af37' }}
                          />
                          <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(240,237,230,0.7)' }}>
                            {g === 'MALE' ? t('profile.genderMale') : g === 'FEMALE' ? t('profile.genderFemale') : t('profile.genderOther')}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>{t('profile.dob')}</label>
                    <FormInput type="date" value={dob} onChange={(e) => setDob(e.target.value)} style={{ colorScheme: 'dark' }} />
                  </div>

                  <div>
                    <label style={labelStyle}>{t('profile.emergencyPhone')}</label>
                    <FormInput icon={Phone} type="text" value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} placeholder={t('profile.emergencyPhonePlaceholder')} />
                  </div>

                  <div>
                    <label style={labelStyle}>{t('profile.nationality')}</label>
                    <FormInput type="text" value={nationality} onChange={(e) => setNationality(e.target.value)} placeholder={t('profile.nationalityPlaceholder')} />
                  </div>

                  <div>
                    <label style={labelStyle}>{t('profile.occupation')}</label>
                    <FormInput type="text" value={occupation} onChange={(e) => setOccupation(e.target.value)} placeholder={t('profile.occupationPlaceholder')} />
                  </div>
                </div>

                <div style={{ marginTop: 20 }}>
                  <label style={labelStyle}>{t('profile.address')}</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={t('profile.addressPlaceholder')}
                    style={{
                      width: '100%', padding: 16, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8, color: '#f0ede6', fontFamily: 'system-ui', fontSize: 14, fontWeight: 500,
                      minHeight: 100, resize: 'none', outline: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 12, paddingTop: 20 }}>
                  <button
                    type="submit"
                    disabled={isSaving}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8, height: 48, padding: '0 28px',
                      background: 'linear-gradient(135deg,#d4af37,#f0c94a)', color: '#0e1111', fontWeight: 800, fontSize: 13,
                      border: 'none', borderRadius: 8, cursor: isSaving ? 'not-allowed' : 'pointer', opacity: isSaving ? 0.7 : 1,
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}
                  >
                    <Save style={{ width: 16, height: 16 }} />
                    {isSaving ? t('profile.saving') : t('profile.saveChanges')}
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Membership Benefits */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ ...cardStyle, borderRadius: 12, padding: '28px 32px' }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#f0ede6', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, background: 'rgba(251,191,36,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award style={{ width: 16, height: 16, color: '#fbbf24' }} />
                </div>
                Quyền lợi thành viên {currentTierStr}
              </h3>
              <p style={{ fontSize: 13, color: 'rgba(240,237,230,0.4)', marginBottom: 20 }}>
                {t('profile.earnMorePointsPrefix')} <strong style={{ color: 'rgba(240,237,230,0.7)' }}>{(tier.pointsNeeded - tier.currentPoints).toLocaleString()}</strong> {t('profile.earnMorePointsSuffix')} {tier.next} {t('profile.earnMorePointsEnd')}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { icon: '🎫', title: t('profile.benefitPriorityTitle'), desc: t('profile.benefitPriorityDesc') },
                  { icon: '💰', title: t('profile.benefitCashbackTitle'), desc: t('profile.benefitCashbackDesc') },
                  { icon: '🎁', title: t('profile.benefitPromoTitle'), desc: t('profile.benefitPromoDesc') },
                  { icon: '📞', title: t('profile.benefitHotlineTitle'), desc: t('profile.benefitHotlineDesc') },
                  { icon: '⭐', title: t('profile.benefitPointsTitle'), desc: t('profile.benefitPointsDesc') },
                  { icon: '🛡️', title: t('profile.benefitInsuranceTitle'), desc: t('profile.benefitInsuranceDesc') },
                ].map((benefit, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: 14, transition: 'background 0.2s' }}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>{benefit.icon}</div>
                    <div style={{ fontWeight: 800, fontSize: 13, color: '#f0ede6', marginBottom: 2 }}>{benefit.title}</div>
                    <div style={{ fontSize: 11, color: 'rgba(240,237,230,0.4)' }}>{benefit.desc}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Activity Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} style={{ ...cardStyle, borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#f0ede6', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, background: 'rgba(212,175,55,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp style={{ width: 16, height: 16, color: '#d4af37' }} />
                </div>
                Thống kê của tôi
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: t('profile.totalTrips'), value: bookingsCount.toString(), icon: '🚌', color: '#d4af37' },
                  { label: t('profile.accumulatedPoints'), value: currentPoints.toLocaleString(), icon: '⭐', color: '#fbbf24' },
                  { label: t('profile.totalKm'), value: '0 km', icon: '📍', color: '#34d399' },
                  { label: t('profile.totalSaved'), value: '0đ', icon: '💰', color: '#f0c94a' },
                ].map((stat, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>{stat.icon}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: stat.color }}>{stat.value}</div>
                    <div style={{ fontSize: 11, color: 'rgba(240,237,230,0.4)', marginTop: 2 }}>{stat.label}</div>
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
