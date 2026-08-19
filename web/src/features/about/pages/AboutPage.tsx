import { useState, useEffect } from 'react';
import { ArrowRight, ArrowUpRight, ArrowLeft, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../lib/api';
import { useTranslation } from 'react-i18next';

export function AboutPage() {
  const { t } = useTranslation();

  const DEFAULT_SERVICES = [
    {
      title: t('about.rental'),
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop',
      desc: t('about.rentalDesc'),
      number: '01',
      hasArrowRight: false,
    },
    {
      title: t('about.delivery'),
      image: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=800&auto=format&fit=crop',
      desc: t('about.deliveryDesc'),
      number: '02',
      hasArrowRight: false,
    },
    {
      title: t('about.airport'),
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800&auto=format&fit=crop',
      desc: t('about.airportDesc'),
      number: '03',
      hasArrowRight: true,
      highlight: t('about.newService'),
    },
  ];

  const DEFAULT_SPECIALISTS = [
    {
      name: 'Phương Trang',
      role: t('about.strategicPartner'),
      quote: '"Sự an toàn và hài lòng của hành khách luôn là ưu tiên hàng đầu trên mỗi cung đường."',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
      stat: '20+ năm',
      statLabel: 'kinh nghiệm',
    },
    {
      name: 'Thành Bưởi',
      role: t('about.transportPartner'),
      quote: '"Đội ngũ tài xế dày dạn kinh nghiệm, sẵn sàng phục vụ 24/7."',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop',
      stat: '500+',
      statLabel: 'đầu xe',
    },
    {
      name: 'Hải Vân',
      role: t('about.transportPartner'),
      quote: '"Dịch vụ chuẩn 5 sao, mang lại trải nghiệm khác biệt hoàn toàn."',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop',
      stat: '4.9★',
      statLabel: 'đánh giá',
    },
  ];

  const [activeSpecialist, setActiveSpecialist] = useState(0);
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [specialists, setSpecialists] = useState(DEFAULT_SPECIALISTS);
  const [, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data } = await api.get('/configs');
        if (data && data.about_page_content) {
          const parsed = JSON.parse(data.about_page_content);
          if (parsed.services && parsed.services.length > 0) setServices(parsed.services);
          if (parsed.specialists && parsed.specialists.length > 0) setSpecialists(parsed.specialists);
        }
      } catch (err) {
        console.error('Failed to load about page content', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  return (
    <div className="min-h-screen bg-[#0e1111] relative pt-24 pb-32" style={{ color: '#f0ede6' }}>

      {/* ─── INTRO HERO ─── */}
      <section className="container max-w-7xl mx-auto px-4 md:px-8 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="pt-8"
        >
          {/* gold rule top */}
          <div style={{ height: 1, background: 'linear-gradient(90deg, #d4af37 0%, transparent 60%)' }} className="mb-10" />

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: '#d4af37' }}>
                Về chúng tôi — An Chuyến
              </p>
              <h1
                className="leading-none tracking-widest"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 'clamp(3rem, 8vw, 7rem)',
                  fontWeight: 300,
                  color: '#f0ede6',
                  transform: 'scaleY(1.15)',
                  transformOrigin: 'bottom left',
                }}
              >
                Hành trình <br />
                <em style={{ color: '#d4af37', fontStyle: 'italic' }}>đáng tin cậy</em>
              </h1>
            </div>
            <p className="max-w-sm text-sm leading-relaxed md:text-right pb-2" style={{ color: 'rgba(240,237,230,0.55)' }}>
              Nền tảng đặt vé xe khách và dịch vụ du lịch hàng đầu Việt Nam. Kết nối hơn 1 triệu hành khách với các nhà xe uy tín.
            </p>
          </div>

          {/* gold rule bottom */}
          <div style={{ height: 1, background: 'linear-gradient(90deg, transparent 0%, #d4af37 40%, transparent 100%)' }} className="mt-10" />
        </motion.div>
      </section>

      {/* ─── SECTION 1: SERVICES ─── */}
      <section className="container max-w-7xl mx-auto px-4 md:px-8 mb-32">
        <div className="flex flex-col">
          {services.map((service, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              key={idx}
              className="group relative grid grid-cols-12 items-center py-10 gap-6 cursor-pointer"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
            >
              {/* Number */}
              <div className="col-span-1 hidden md:flex justify-center">
                <span
                  className="font-mono text-xs font-bold tracking-widest"
                  style={{ color: 'rgba(212,175,55,0.5)' }}
                >
                  {service.number}
                </span>
              </div>

              {/* Service title */}
              <div className="col-span-12 md:col-span-3">
                {service.highlight && (
                  <div
                    className="text-[9px] font-bold px-2 py-1 w-max mb-3 tracking-[0.2em]"
                    style={{ background: '#d4af37', color: '#0e1111' }}
                  >
                    {service.highlight}
                  </div>
                )}
                <h3
                  className="transition-colors duration-300 leading-tight"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
                    fontWeight: 500,
                    color: '#f0ede6',
                    letterSpacing: '0.05em',
                  }}
                >
                  {service.title}
                </h3>
              </div>

              {/* Image — center */}
              <div className="col-span-12 md:col-span-5 overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ filter: 'brightness(0.85)' }}
                />
              </div>

              {/* Desc + Arrow */}
              <div className="col-span-12 md:col-span-3 flex items-center justify-between gap-4">
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,237,230,0.5)' }}>
                  {service.desc}
                </p>
                <div
                  className="shrink-0 w-10 h-10 border flex items-center justify-center transition-all duration-300 group-hover:bg-[#d4af37] group-hover:border-[#d4af37]"
                  style={{ borderColor: 'rgba(255,255,255,0.2)' }}
                >
                  {service.hasArrowRight ? (
                    <ArrowRight className="w-4 h-4 transition-colors group-hover:text-[#0e1111]" style={{ color: '#d4af37' }} />
                  ) : (
                    <ArrowUpRight className="w-4 h-4 transition-colors" style={{ color: 'rgba(240,237,230,0.5)' }} />
                  )}
                </div>
              </div>

              {/* Hover line reveal */}
              <div
                className="absolute bottom-0 left-0 h-px transition-all duration-500 group-hover:w-full w-0"
                style={{ background: '#d4af37' }}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── STATS BAND ─── */}
      <section
        className="mb-32 py-16"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="container max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '1M+', label: 'Hành khách' },
              { value: '63', label: 'Tỉnh thành' },
              { value: '50+', label: 'Nhà xe đối tác' },
              { value: '99%', label: 'Đúng giờ' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div
                  className="mb-1"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                    fontWeight: 300,
                    color: '#d4af37',
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-xs font-bold tracking-[0.2em] uppercase"
                  style={{ color: 'rgba(240,237,230,0.4)' }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 2: PARTNERS ─── */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        className="container max-w-7xl mx-auto px-4 md:px-8 mb-32"
      >
        {/* Section header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: '#d4af37' }}>
              Đối tác chiến lược
            </p>
            <h2
              className="leading-none tracking-widest"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(3rem, 7vw, 6rem)',
                fontWeight: 300,
                color: 'rgba(240,237,230,0.12)',
                transform: 'scaleY(1.2)',
                transformOrigin: 'bottom left',
              }}
            >
              ĐỐI TÁC
            </h2>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => setActiveSpecialist((prev) => (prev > 0 ? prev - 1 : specialists.length - 1))}
              className="w-11 h-11 flex items-center justify-center transition-all duration-200 hover:bg-white/10"
              style={{ border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <ArrowLeft className="w-4 h-4" style={{ color: '#f0ede6' }} />
            </button>
            <button
              onClick={() => setActiveSpecialist((prev) => (prev < specialists.length - 1 ? prev + 1 : 0))}
              className="w-11 h-11 flex items-center justify-center transition-all duration-200"
              style={{ background: '#d4af37' }}
            >
              <ArrowRight className="w-4 h-4 text-[#0e1111]" />
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex mb-12 overflow-x-auto" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          {specialists.map((spec, idx) => (
            <div
              key={idx}
              onClick={() => setActiveSpecialist(idx)}
              className="flex-1 min-w-[180px] pb-4 cursor-pointer transition-all duration-300"
              style={{
                borderBottom: activeSpecialist === idx ? '2px solid #d4af37' : '2px solid transparent',
                marginBottom: -1,
              }}
            >
              <div
                className="font-bold text-base transition-colors"
                style={{ color: activeSpecialist === idx ? '#f0ede6' : 'rgba(240,237,230,0.35)' }}
              >
                {spec.name}
              </div>
              <div
                className="text-[9px] font-bold tracking-[0.25em] uppercase mt-1 transition-colors"
                style={{ color: activeSpecialist === idx ? '#d4af37' : 'rgba(240,237,230,0.25)' }}
              >
                {spec.role}
              </div>
            </div>
          ))}
        </div>

        {/* Partner detail */}
        {specialists.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center min-h-[480px]">
            {/* Text */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${activeSpecialist}`}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.45 }}
                className="md:col-span-5 flex flex-col justify-center"
              >
                {/* Quote mark */}
                <div
                  className="mb-4 leading-none select-none"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '5rem',
                    color: '#d4af37',
                    lineHeight: 0.7,
                    opacity: 0.6,
                  }}
                >
                  "
                </div>
                <blockquote
                  className="leading-snug mb-8"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
                    fontWeight: 400,
                    color: '#f0ede6',
                    fontStyle: 'italic',
                  }}
                >
                  {specialists[activeSpecialist].quote.replace(/^"|"$/g, '')}
                </blockquote>

                <div className="flex items-center gap-6 mb-10">
                  <div>
                    <div className="font-bold text-base" style={{ color: '#f0ede6' }}>
                      {specialists[activeSpecialist].name}
                    </div>
                    <div
                      className="text-[9px] font-bold tracking-[0.25em] uppercase mt-0.5"
                      style={{ color: '#d4af37' }}
                    >
                      {specialists[activeSpecialist].role}
                    </div>
                  </div>
                  <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.12)' }} />
                  <div>
                    <div
                      className="font-bold text-xl"
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        color: '#d4af37',
                      }}
                    >
                      {specialists[activeSpecialist].stat}
                    </div>
                    <div className="text-[9px] font-bold tracking-widest uppercase" style={{ color: 'rgba(240,237,230,0.35)' }}>
                      {specialists[activeSpecialist].statLabel}
                    </div>
                  </div>
                </div>

                <button
                  className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase transition-all group w-fit"
                  style={{ color: '#d4af37' }}
                >
                  Tìm hiểu thêm
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                </button>
              </motion.div>
            </AnimatePresence>

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`image-${activeSpecialist}`}
                initial={{ opacity: 0, filter: 'blur(12px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(12px)' }}
                transition={{ duration: 0.5 }}
                className="md:col-span-7 flex justify-end relative"
              >
                <div className="relative w-full md:w-[85%]">
                  {/* Offset border card */}
                  <div
                    className="absolute inset-0 translate-x-4 translate-y-4 pointer-events-none"
                    style={{ border: '1px solid rgba(212,175,55,0.2)' }}
                  />
                  <img
                    src={specialists[activeSpecialist].image}
                    alt={specialists[activeSpecialist].name}
                    className="w-full object-cover"
                    style={{ height: 480, filter: 'brightness(0.88)' }}
                  />
                  {/* Name overlay */}
                  <div
                    className="absolute bottom-0 left-0 right-0 px-6 py-5"
                    style={{ background: 'linear-gradient(to top, rgba(14,17,17,0.95) 0%, transparent 100%)' }}
                  >
                    <div
                      className="font-bold text-lg"
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#f0ede6' }}
                    >
                      {specialists[activeSpecialist].name}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] tracking-widest uppercase" style={{ color: '#d4af37' }}>
                      <MapPin className="w-3 h-3" /> Vietnam
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </motion.section>

      {/* ─── SECTION 3: CONTACT FORM ─── */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8 }}
        className="container max-w-7xl mx-auto px-4 md:px-8"
      >
        {/* gold rule */}
        <div style={{ height: 1, background: 'linear-gradient(90deg, #d4af37 0%, transparent 70%)' }} className="mb-12" />

        <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: '#d4af37' }}>
          Liên hệ — Tư vấn miễn phí
        </p>
        <h2
          className="mb-16 leading-none"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
            fontWeight: 300,
            color: '#f0ede6',
            transform: 'scaleY(1.15)',
            transformOrigin: 'bottom left',
            letterSpacing: '0.08em',
          }}
        >
          LIÊN HỆ TƯ VẤN
        </h2>

        <form className="max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 mb-12">
            {[
              { label: 'Họ và tên', placeholder: 'Nguyễn Văn A', type: 'text' },
              { label: 'Số điện thoại', placeholder: '+84 (900) 123-456', type: 'tel' },
            ].map((field) => (
              <div
                key={field.label}
                className="pb-2 transition-colors focus-within:border-b-[#d4af37]"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}
              >
                <label
                  className="block mb-2 text-[9px] font-bold tracking-[0.25em] uppercase"
                  style={{ color: 'rgba(240,237,230,0.4)' }}
                >
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  className="w-full bg-transparent border-none focus:ring-0 text-lg font-medium px-0 outline-none"
                  style={{
                    color: '#f0ede6',
                  }}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 mb-16">
            {/* Service select */}
            <div>
              <label
                className="block mb-4 text-[9px] font-bold tracking-[0.25em] uppercase"
                style={{ color: 'rgba(240,237,230,0.4)' }}
              >
                Dịch vụ
              </label>
              <div className="flex flex-wrap gap-3">
                {['Thuê xe', 'Giao hàng', 'Đưa đón sân bay'].map((svc, i) => (
                  <button
                    key={svc}
                    type="button"
                    className="text-xs font-bold px-5 py-2.5 transition-all duration-200"
                    style={
                      i === 0
                        ? { background: '#d4af37', color: '#0e1111', border: '1px solid #d4af37' }
                        : {
                            background: 'transparent',
                            color: 'rgba(240,237,230,0.5)',
                            border: '1px solid rgba(255,255,255,0.12)',
                          }
                    }
                  >
                    {svc}
                  </button>
                ))}
              </div>
            </div>

            {/* Date quick select */}
            <div>
              <label
                className="block mb-4 text-[9px] font-bold tracking-[0.25em] uppercase"
                style={{ color: 'rgba(240,237,230,0.4)' }}
              >
                Ngày đi
              </label>
              <div className="flex flex-wrap gap-3">
                {['Hôm nay', 'Ngày mai', 'Chọn ngày'].map((d, i) => (
                  <button
                    key={d}
                    type="button"
                    className="text-xs font-bold px-5 py-2.5 transition-all duration-200"
                    style={
                      i === 0
                        ? { background: '#d4af37', color: '#0e1111', border: '1px solid #d4af37' }
                        : {
                            background: 'transparent',
                            color: 'rgba(240,237,230,0.5)',
                            border: '1px solid rgba(255,255,255,0.12)',
                          }
                    }
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full font-bold tracking-[0.2em] uppercase py-5 text-sm transition-all duration-200 hover:brightness-110 active:scale-[0.99]"
            style={{ background: '#d4af37', color: '#0e1111' }}
          >
            GỬI YÊU CẦU TƯ VẤN
          </button>
        </form>
      </motion.section>
    </div>
  );
}
