import { useState, useEffect } from 'react';
import { ArrowRight, ArrowUpRight, ArrowLeft, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../lib/api';
import { useTranslation } from 'react-i18next';

export function AboutPage() {
  const { t } = useTranslation();

  const DEFAULT_SERVICES = [
    {
      title: t('about.rental') || 'Car Rental',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop',
      desc: t('about.rentalDesc') || 'Premium car rental services for your journey.',
      number: '01',
      hasArrowRight: false,
    },
    {
      title: t('about.delivery') || 'Delivery',
      image: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=800&auto=format&fit=crop',
      desc: t('about.deliveryDesc') || 'Fast and secure delivery across the country.',
      number: '02',
      hasArrowRight: false,
    },
    {
      title: t('about.airport') || 'Airport Transfer',
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800&auto=format&fit=crop',
      desc: t('about.airportDesc') || 'Reliable airport pickups and drop-offs.',
      number: '03',
      hasArrowRight: true,
      highlight: t('about.newService') || 'NEW',
    },
  ];

  const DEFAULT_SPECIALISTS = [
    {
      name: 'Phuong Trang',
      role: 'Strategic Partner',
      quote: '"Safety and passenger satisfaction are always the top priorities on every journey."',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
      stat: '20+ yrs',
      statLabel: 'Experience',
    },
    {
      name: 'Thanh Buoi',
      role: 'Transport Partner',
      quote: '"Experienced drivers, ready to serve 24/7."',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop',
      stat: '500+',
      statLabel: 'Vehicles',
    },
    {
      name: 'Hai Van',
      role: 'Transport Partner',
      quote: '"5-star service, bringing a completely different experience."',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop',
      stat: '4.9★',
      statLabel: 'Rating',
    },
  ];

  const [activeSpecialist, setActiveSpecialist] = useState(0);
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [specialists] = useState(DEFAULT_SPECIALISTS);
  const [, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data } = await api.get('/configs');
        if (data && data.about_page_content) {
          const parsed = JSON.parse(data.about_page_content);
          if (parsed.services && parsed.services.length > 0) setServices(parsed.services);
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
    <div className="min-h-screen bg-[#fcfcfc] text-[#1a1a1a] font-sans pb-32">
      
      {/* ─── INTRO HERO ─── */}
      <section className="relative pt-40 pb-20 px-6 lg:px-12 max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Top Divider */}
          <div className="h-px bg-gradient-to-r from-[#d4af37] to-transparent mb-12 max-w-2xl" />

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-[#d4af37] mb-6">
                About Us — An Chuyến
              </p>
              <h1 className="font-display font-medium text-6xl md:text-7xl lg:text-[7.5rem] leading-[0.9] text-[#1a1a1a]">
                A Journey <br />
                <em className="text-[#d4af37] font-serif italic">You Can Trust</em>
              </h1>
            </div>
            <p className="max-w-xs text-gray-500 leading-relaxed md:text-right pb-3 font-medium text-lg">
              Vietnam's leading platform for booking transportation and travel services. Connecting over 1 million passengers.
            </p>
          </div>

          {/* Bottom Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mt-16 max-w-4xl ml-auto" />
        </motion.div>
      </section>

      {/* ─── SECTION 1: SERVICES ─── */}
      <section className="px-6 lg:px-12 max-w-[1400px] mx-auto mb-32">
        <div className="flex flex-col">
          {services.map((service, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              key={idx}
              className="group relative grid grid-cols-12 items-center py-12 gap-8 cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50/50"
            >
              {/* Number */}
              <div className="col-span-1 hidden md:flex justify-center">
                <span className="font-mono text-sm font-bold tracking-widest text-[#d4af37]/60 group-hover:text-[#d4af37] transition-colors">
                  {service.number}
                </span>
              </div>

              {/* Service title */}
              <div className="col-span-12 md:col-span-3 px-4 md:px-0">
                {service.highlight && (
                  <div className="text-[9px] font-black px-2.5 py-1 w-max mb-4 tracking-widest bg-[#d4af37] text-white uppercase rounded-sm shadow-sm">
                    {service.highlight}
                  </div>
                )}
                <h3 className="font-display font-medium text-3xl md:text-4xl text-[#1a1a1a] leading-tight group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
              </div>

              {/* Image — center */}
              <div className="col-span-12 md:col-span-5 aspect-[16/9] overflow-hidden rounded-2xl mx-4 md:mx-0 shadow-sm">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Desc + Arrow */}
              <div className="col-span-12 md:col-span-3 flex items-center justify-between gap-6 px-4 md:px-0 md:pl-8">
                <p className="text-gray-500 leading-relaxed font-medium text-sm">
                  {service.desc}
                </p>
                <div className="shrink-0 w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center transition-all duration-300 group-hover:bg-primary group-hover:border-primary shadow-sm group-hover:shadow-md">
                  {service.hasArrowRight ? (
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── STATS BAND ─── */}
      <section className="mb-32 bg-gray-50/50 border-y border-gray-100 py-20">
        <div className="px-6 lg:px-12 max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
            {[
              { value: '1M+', label: 'Passengers' },
              { value: '63', label: 'Provinces' },
              { value: '50+', label: 'Partners' },
              { value: '99%', label: 'On Time' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="font-display font-medium text-5xl md:text-6xl text-primary mb-3">
                  {stat.value}
                </div>
                <div className="text-xs font-bold tracking-widest uppercase text-gray-400">
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
        className="px-6 lg:px-12 max-w-[1400px] mx-auto mb-32"
      >
        {/* Section header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-[#d4af37] mb-4">
              Strategic Partners
            </p>
            <h2 className="font-display font-medium text-5xl md:text-7xl text-[#1a1a1a] leading-none">
              PARTNERS
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveSpecialist((prev) => (prev > 0 ? prev - 1 : specialists.length - 1))}
              className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center transition-all duration-200 hover:bg-gray-50 hover:border-gray-300"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setActiveSpecialist((prev) => (prev < specialists.length - 1 ? prev + 1 : 0))}
              className="w-12 h-12 rounded-full bg-primary flex items-center justify-center transition-all duration-200 hover:bg-primary-hover shadow-md"
            >
              <ArrowRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex mb-16 overflow-x-auto border-b border-gray-200 custom-scrollbar">
          {specialists.map((spec, idx) => (
            <div
              key={idx}
              onClick={() => setActiveSpecialist(idx)}
              className={`flex-1 min-w-[200px] pb-5 cursor-pointer transition-all duration-300 border-b-2 -mb-[1px] ${
                activeSpecialist === idx ? 'border-primary' : 'border-transparent'
              }`}
            >
              <div className={`font-bold text-lg transition-colors ${activeSpecialist === idx ? 'text-[#1a1a1a]' : 'text-gray-400'}`}>
                {spec.name}
              </div>
              <div className={`text-[10px] font-bold tracking-widest uppercase mt-1.5 transition-colors ${activeSpecialist === idx ? 'text-primary' : 'text-gray-300'}`}>
                {spec.role}
              </div>
            </div>
          ))}
        </div>

        {/* Partner detail */}
        {specialists.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center min-h-[480px]">
            {/* Text */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${activeSpecialist}`}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.45 }}
                className="md:col-span-5 flex flex-col justify-center relative"
              >
                {/* Quote mark */}
                <div className="absolute -top-16 -left-8 font-display text-[8rem] text-primary/10 select-none leading-none z-0">
                  "
                </div>
                
                <blockquote className="relative z-10 font-display text-3xl text-[#1a1a1a] font-medium leading-snug mb-10 italic">
                  {specialists[activeSpecialist].quote.replace(/^"|"$/g, '')}
                </blockquote>

                <div className="flex items-center gap-8 mb-10">
                  <div>
                    <div className="font-bold text-lg text-[#1a1a1a]">
                      {specialists[activeSpecialist].name}
                    </div>
                    <div className="text-[10px] font-bold tracking-widest uppercase text-primary mt-1">
                      {specialists[activeSpecialist].role}
                    </div>
                  </div>
                  <div className="w-px h-12 bg-gray-200" />
                  <div>
                    <div className="font-display font-medium text-3xl text-[#d4af37]">
                      {specialists[activeSpecialist].stat}
                    </div>
                    <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
                      {specialists[activeSpecialist].statLabel}
                    </div>
                  </div>
                </div>

                <button className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-primary transition-all group w-fit hover:text-primary-hover">
                  Discover More
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
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
                <div className="relative w-full md:w-[90%]">
                  <img
                    src={specialists[activeSpecialist].image}
                    alt={specialists[activeSpecialist].name}
                    className="w-full h-[500px] object-cover rounded-[2rem] shadow-sm"
                  />
                  {/* Name overlay */}
                  <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white flex items-center justify-between">
                    <div>
                      <div className="font-display font-medium text-2xl text-[#1a1a1a]">
                        {specialists[activeSpecialist].name}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-gray-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-primary" /> Vietnam
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                      <ArrowUpRight className="w-5 h-5 text-gray-400" />
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
        className="px-6 lg:px-12 max-w-[1400px] mx-auto"
      >
        <div className="bg-white border border-gray-100 rounded-[3rem] p-10 md:p-16 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <div className="mb-12">
            <p className="text-[10px] font-bold tracking-widest uppercase text-primary mb-4">
              Contact — Free Consultation
            </p>
            <h2 className="font-display font-medium text-4xl md:text-5xl text-[#1a1a1a] leading-none">
              GET IN TOUCH
            </h2>
          </div>

          <form className="max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-12">
              {[
                { label: 'Full Name', placeholder: 'John Doe', type: 'text' },
                { label: 'Phone Number', placeholder: '+1 (555) 000-0000', type: 'tel' },
              ].map((field) => (
                <div key={field.label}>
                  <label className="block mb-2.5 text-[11px] font-bold tracking-widest uppercase text-gray-500">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-sm font-medium text-[#1a1a1a] outline-none transition-colors focus:border-primary focus:bg-white placeholder:text-gray-400"
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 mb-12">
              {/* Service select */}
              <div>
                <label className="block mb-4 text-[11px] font-bold tracking-widest uppercase text-gray-500">
                  Service
                </label>
                <div className="flex flex-wrap gap-3">
                  {['Car Rental', 'Delivery', 'Airport Transfer'].map((svc, i) => (
                    <button
                      key={svc}
                      type="button"
                      className={`text-xs font-bold px-6 py-3 rounded-full transition-all duration-200 border ${
                        i === 0
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-[#1a1a1a]'
                      }`}
                    >
                      {svc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date quick select */}
              <div>
                <label className="block mb-4 text-[11px] font-bold tracking-widest uppercase text-gray-500">
                  Travel Date
                </label>
                <div className="flex flex-wrap gap-3">
                  {['Today', 'Tomorrow', 'Select Date'].map((d, i) => (
                    <button
                      key={d}
                      type="button"
                      className={`text-xs font-bold px-6 py-3 rounded-full transition-all duration-200 border ${
                        i === 0
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-[#1a1a1a]'
                      }`}
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
              className="w-full md:w-auto bg-primary hover:bg-primary-hover text-white font-bold tracking-widest uppercase px-12 py-5 rounded-full text-xs transition-all duration-200 shadow-md hover:shadow-lg"
            >
              SEND INQUIRY
            </button>
          </form>
        </div>
      </motion.section>
    </div>
  );
}
