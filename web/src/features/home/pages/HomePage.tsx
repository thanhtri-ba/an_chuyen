import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, ArrowRightLeft, Ticket, Zap, Sparkles, Star, ChevronRight, Edit3, X, Calendar } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const heroVideos = [
  { url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_092026_dd05b805-ea0f-40b2-8c52-332b88502592.mp4', label: 'Mặt hồ' },
  { url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081127_0992a171-d3c6-4978-8213-0ec5df8b6d63.mp4', label: 'Bình minh' },
  { url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081042_df7202bf-bd80-4b2b-bbc6-1f09ba2870e9.mp4', label: 'Rừng xanh' },
  { url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_080959_4cac5234-3573-464e-a5b7-76b94b8a7d61.mp4', label: 'Bình minh tĩnh' },
  { url :'https://cdn.pixabay.com/video/2023/07/10/171009-844444293_medium.mp4?download',label :'Hoàng Hôn'}
];

import { Button } from '../../../design-system/components/Button';
import { Input } from '../../../design-system/components/Input';
import { useTranslation } from 'react-i18next';
import api from '../../../lib/api';

export function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [activeVideo, setActiveVideo] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleVideoSwitch = (index: number) => {
    if (index === activeVideo || isTransitioning) return;
    setIsTransitioning(true);
    setActiveVideo(index);
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  // Set default date to today
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [passengers, setPassengers] = useState(1);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (origin) params.append('origin', origin);
    if (destination) params.append('destination', destination);
    if (date) params.append('date', date);
    if (passengers) params.append('passengers', passengers.toString());
    navigate(`/search?${params.toString()}`);
  };

  const swapLocations = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  return (
    <div style={{ background: '#0e1111', color: '#f0ede6', fontFamily: "'Outfit', sans-serif", minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ===== HERO SECTION — Lumora style ===== */}
      <section style={{ position: 'relative', height: '100vh', overflow: 'hidden', background: '#000' }}>

        {/* Video layer */}
        {heroVideos.map((v, i) => (
          <video key={i} autoPlay muted loop playsInline
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: activeVideo === i ? 1 : 0, transition: 'opacity 1000ms ease-in-out', zIndex: 0 }}
            src={v.url}
          />
        ))}

        {/* Train window PNG overlay */}
        <img
          src="https://soft-zoom-63098134.figma.site/_assets/v11/0b4a435b2df2747593c43d7a1c9b4578f7d8d90c.png"
          alt=""
          className="train-bob"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none', zIndex: 1 }}
        />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>

          {/* Hero text */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 5%', gap: 20 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif' }}>
              {t('home.subtitle')}
            </div>
            <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(3rem, 7vw, 6rem)', color: '#ffffff', lineHeight: 1.1, margin: 0 }}>
              {t('home.titleLine1')}<br /><em style={{ color: 'rgba(255,255,255,0.65)' }}>{t('home.titleLine2')}</em>
            </h1>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 15, color: 'rgba(255,255,255,0.6)', maxWidth: 480, lineHeight: 1.7, margin: 0 }}>
              {t('home.desc')}
            </p>

            {/* Video switcher */}
            <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
              {heroVideos.map((v, i) => (
                <button key={i} onClick={() => handleVideoSwitch(i)}
                  style={{ background: 'none', border: 'none', borderBottom: `2px solid ${activeVideo === i ? '#ffffff' : 'transparent'}`, color: '#ffffff', opacity: activeVideo === i ? 1 : 0.45, fontFamily: 'system-ui, sans-serif', fontSize: 12, paddingBottom: 4, cursor: 'pointer', transition: 'opacity 300ms, border-color 300ms' }}>
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SEARCH BAR SECTION (MOVED BELOW HERO) ===== */}
      <section style={{ background: '#0e1111', padding: '20px 5% 40px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 1200 }}>
          <div style={{ display: 'inline-flex', marginBottom: -1 }}>
            <div className="liquid-glass" style={{ borderRadius: '10px 10px 0 0', padding: '8px 22px', fontSize: 9, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.22em', textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif' }}>
              {t('home.searchBar.bookTicket')}
            </div>
          </div>
          <form onSubmit={handleSearch}>
            <div className="liquid-glass" style={{ borderRadius: '0 12px 12px 12px', display: 'grid', gridTemplateColumns: '1fr auto 1fr 1px 1fr 1px minmax(100px,auto) auto', alignItems: 'center', padding: '0 6px 0 0' }}>
              <div style={{ padding: '18px 24px' }}>
                <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 6, fontFamily: 'system-ui, sans-serif' }}>{t('home.searchBar.origin')}</div>
                <input value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder={t('home.searchBar.originPlaceholder')}
                  style={{ background: 'none', border: 'none', outline: 'none', color: '#ffffff', fontSize: 15, fontWeight: 300, width: '100%', fontFamily: 'system-ui, sans-serif' }} />
              </div>
              <button type="button" onClick={swapLocations}
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ffffff', flexShrink: 0 }}>
                <ArrowRightLeft size={13} />
              </button>
              <div style={{ padding: '18px 24px' }}>
                <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 6, fontFamily: 'system-ui, sans-serif' }}>{t('home.searchBar.destination')}</div>
                <input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder={t('home.searchBar.destinationPlaceholder')}
                  style={{ background: 'none', border: 'none', outline: 'none', color: '#ffffff', fontSize: 15, fontWeight: 300, width: '100%', fontFamily: 'system-ui, sans-serif' }} />
              </div>
              <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />
              <div style={{ padding: '18px 24px' }}>
                <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 6, fontFamily: 'system-ui, sans-serif' }}>{t('home.searchBar.date')}</div>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                  style={{ background: 'none', border: 'none', outline: 'none', color: '#ffffff', fontSize: 15, fontWeight: 300, width: '100%', fontFamily: 'system-ui, sans-serif', colorScheme: 'dark' }} />
              </div>
              <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />
              <div style={{ padding: '18px 20px' }}>
                <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 6, fontFamily: 'system-ui, sans-serif' }}>{t('home.searchBar.passengers')}</div>
                <select value={passengers} onChange={(e) => setPassengers(Number(e.target.value))}
                  style={{ background: 'none', border: 'none', outline: 'none', color: '#ffffff', fontSize: 15, fontWeight: 300, fontFamily: 'system-ui, sans-serif', width: '100%', colorScheme: 'dark' }}>
                  {[1,2,3,4,5].map(n => <option key={n} value={n} style={{ background: '#1a1a1a' }}>{n} {t('home.searchBar.person')}</option>)}
                </select>
              </div>
              <button type="submit"
                style={{ background: 'linear-gradient(135deg, #d4af37, #f0c94a)', color: '#0e1111', border: 'none', borderRadius: 8, padding: '14px 28px', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'system-ui, sans-serif', display: 'flex', alignItems: 'center', gap: 8, margin: 6, whiteSpace: 'nowrap', boxShadow: '0 4px 20px rgba(212,175,55,0.35)' }}>
                <Search size={14} /> {t('home.searchBar.search')}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ===== SECTION 2: STORE ===== */}
      <section style={{ background: '#0e1111', padding: '120px 8%', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative large text */}
        <div style={{ position: 'absolute', bottom: -20, right: '5%', fontFamily: "'Cormorant Garamond', serif", fontSize: '17rem', fontWeight: 700, color: 'rgba(126, 149, 153, 1)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.04em' }}>STORE</div>

        <div style={{ maxWidth: 1400, margin: '0 auto', position: 'relative', zIndex: 1 }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 64 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <div style={{ width: 32, height: 1, background: '#d4af37' }} />
                <span style={{ fontSize: 10, letterSpacing: '0.3em', color: '#d4af37', textTransform: 'uppercase', fontFamily: 'system-ui', fontWeight: 700 }}>{t('home.store.title')}</span>
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif", fontSize: 'clamp(2rem, 3.5vw, 3.5rem)', fontWeight: 400, color: '#ffffff', lineHeight: 1.1, margin: 0 }}>
                {t('home.store.subtitle')}
              </h2>
            </div>
            <button style={{ background: 'transparent', color: '#d4af37', border: '1px solid rgba(212,175,55,0.35)', borderRadius: 100, padding: '12px 28px', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s', fontFamily: 'system-ui' }} className="hover:bg-[#d4af37] hover:text-[#0e1111]">
              {t('home.store.viewAll')}
            </button>
          </div>

          {/* Bento grid — 1 featured large + 3 smaller */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gridTemplateRows: 'auto', gap: 20 }}>
            {[
              { name: t('home.store.pillow'),   price: '350.000Đ', img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop', tag: 'Best seller', featured: true },
              { name: t('home.store.sleepSet'), price: '150.000Đ', img: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?q=80&w=600&auto=format&fit=crop' },
              { name: t('home.store.thermos'),  price: '450.000Đ', img: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600&auto=format&fit=crop' },
              { name: t('home.store.suitcase'), price: '1.200.000Đ', img: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?q=80&w=600&auto=format&fit=crop' },
            ].map((product, i) => (
              <div key={i} className="group" style={{ position: 'relative', cursor: 'pointer' }}>
                {/* Image */}
                <div style={{ position: 'relative', width: '100%', aspectRatio: product.featured ? '3/4' : '3/4', borderRadius: 16, overflow: 'hidden', background: '#141717' }}>
                  <img
                    src={product.img}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease, filter 0.4s ease', filter: 'brightness(0.7)' }}
                    className="group-hover:scale-105 group-hover:brightness-90"
                  />
                  {/* Gradient */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,17,17,0.95) 0%, rgba(14,17,17,0.2) 50%, transparent 100%)' }} />

                  {/* Tag */}
                  {product.tag && (
                    <div style={{ position: 'absolute', top: 16, left: 16, background: '#d4af37', color: '#0e1111', fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '5px 12px', borderRadius: 100, fontFamily: 'system-ui' }}>
                      {product.tag}
                    </div>
                  )}

                  {/* Info overlay at bottom */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: product.featured ? '28px 24px' : '20px 18px' }}>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif", fontSize: product.featured ? '1.6rem' : '1.2rem', color: '#ffffff', margin: '0 0 12px', fontWeight: 500, lineHeight: 1.2 }}>
                      {product.name}
                    </h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: product.featured ? '1.4rem' : '1.1rem', color: '#d4af37', fontWeight: 600 }}>{product.price}</span>
                      <button
                        style={{ background: 'rgba(212,175,55,0.15)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.3)', padding: '7px 18px', borderRadius: 100, fontSize: 9, cursor: 'pointer', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', transition: 'all 0.25s', fontFamily: 'system-ui', backdropFilter: 'blur(8px)' }}
                        className="hover:bg-[#d4af37] hover:text-[#0e1111] hover:border-[#d4af37]"
                      >
                        {t('home.store.buy')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ===== SECTION 3: EDITORIAL DETAILS ===== */}
      <section style={{ background: '#0e1111', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle grain texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E")', opacity: 0.4, pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 8%', position: 'relative', zIndex: 1 }}>

          {/* Top rule */}
          <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)', marginBottom: 0 }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 700, alignItems: 'stretch' }}>

            {/* LEFT — Text + Features */}
            <div style={{ padding: '100px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 40, borderRight: '1px solid rgba(255,255,255,0.06)', paddingRight: 80 }}>

              {/* Eyebrow */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 32, height: 1, background: '#d4af37' }} />
                <span style={{ fontSize: 10, letterSpacing: '0.3em', color: '#d4af37', textTransform: 'uppercase', fontFamily: 'system-ui', fontWeight: 700 }}>{t('home.details.eyebrow')}</span>
              </div>

              {/* Headline */}
              <div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif", fontSize: 'clamp(3rem, 5vw, 5.5rem)', fontWeight: 300, color: '#f0ede6', lineHeight: 1, margin: 0, letterSpacing: '-0.02em' }}>
                  <em style={{ color: '#d4af37', fontStyle: 'italic' }}>{t('home.details.headlineItalic')}</em><br />
                  <span style={{ fontWeight: 600 }}>{t('home.details.headlineLine1')}</span><br />
                  <span style={{ fontWeight: 600 }}>{t('home.details.headlineLine2')}</span>
                </h2>
              </div>

              {/* Body */}
              <p style={{ color: 'rgba(240,237,230,0.5)', fontSize: '1rem', lineHeight: 1.8, maxWidth: 380, fontFamily: 'system-ui', margin: 0 }}>
                {t('home.details.body')}
              </p>

              {/* Feature list — horizontal lines */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  t('home.features.insurance'),
                  t('home.features.pickup'),
                  t('home.features.punctual'),
                  t('home.features.refund'),
                  t('home.features.fixedPrice'),
                ].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }} className="group">
                    <span style={{ color: '#d4af37', fontSize: 8, flexShrink: 0 }}>◆</span>
                    <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(240,237,230,0.7)', fontFamily: 'system-ui', transition: 'color 0.2s' }} className="group-hover:text-white">{feat}</span>
                    <div style={{ flex: 1, height: 1, background: 'rgba(212,175,55,0)', transition: 'background 0.3s' }} className="group-hover:bg-[rgba(212,175,55,0.3)]" />
                    <span style={{ fontSize: 10, color: 'rgba(212,175,55,0)', transition: 'color 0.2s' }} className="group-hover:text-[#d4af37]">→</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Image editorial */}
            <div style={{ position: 'relative', paddingLeft: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

              {/* Large decorative number */}
              <div style={{ position: 'absolute', top: 40, right: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: '14rem', fontWeight: 700, color: 'rgba(212,175,55,0.04)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>03</div>

              {/* Image stack */}
              <div style={{ position: 'relative', width: '100%', maxWidth: 480 }}>
                {/* Behind card */}
                <div style={{ position: 'absolute', top: 24, left: 24, right: -24, bottom: -24, border: '1px solid rgba(212,175,55,0.2)', borderRadius: 24 }} />

                {/* Main image */}
                <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', aspectRatio: '4/5' }}>
                  <img
                    src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop"
                    alt="Premium Bus"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.75) contrast(1.1) saturate(0.9)', display: 'block' }}
                  />
                  {/* Gradient overlay bottom */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,17,17,0.9) 0%, transparent 50%)' }} />

                  {/* Bottom caption */}
                  <div style={{ position: 'absolute', bottom: 32, left: 32, right: 32 }}>
                    <div style={{ fontSize: 10, letterSpacing: '0.25em', color: '#d4af37', textTransform: 'uppercase', marginBottom: 8, fontFamily: 'system-ui' }}>{t('home.details.captionLabel')}</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif", fontSize: '1.8rem', color: '#ffffff', fontWeight: 500, lineHeight: 1.2 }}>{t('home.features.quality')}</div>
                  </div>
                </div>

                {/* Floating stat card */}
                <div style={{ position: 'absolute', top: -28, right: -28, background: '#d4af37', color: '#0e1111', padding: '20px 24px', borderRadius: 16, boxShadow: '0 20px 40px rgba(0,0,0,0.4)', zIndex: 3 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 700, lineHeight: 1 }}>1M+</div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4, opacity: 0.8 }}>{t('home.details.statLabel')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom rule */}
          <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)' }} />
        </div>
      </section>

      {/* ===== SECTION 4: PROJECTS / ROUTES (BENTO GLASSMORPHISM) ===== */}
      <section style={{ 
        position: 'relative', 
        padding: '140px 8%',
        background: 'url(https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2000&auto=format&fit=crop) center/cover fixed',
        color: '#ffffff'
      }}>
        {/* Dark overlay for contrast */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(14,17,17,1) 0%, rgba(14,17,17,0.4) 40%, rgba(14,17,17,0.9) 100%)' }}></div>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 0%, rgba(14,17,17,0.8) 100%)' }}></div>

        <div style={{ position: 'relative', zIndex: 10, maxWidth: 1400, margin: '0 auto' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 60 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ height: 1, width: 40, background: '#d4af37' }}></div>
                <span style={{ color: '#d4af37', letterSpacing: '0.2em', fontSize: 12, textTransform: 'uppercase', fontWeight: 700 }}>{t('home.routes.eyebrow')}</span>
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '4.5rem', fontWeight: 400, color: '#ffffff', lineHeight: 1, letterSpacing: '0.02em' }}>
                {t('home.routes.headingLine1')}<br /><span style={{ fontStyle: 'italic', color: '#f0ede6' }}>{t('home.routes.headingLine2')}</span>
              </h2>
            </div>
            <button onClick={() => navigate('/search')} style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 100, padding: '16px 32px', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.3s' }} className="hover:bg-white hover:text-black">
              {t('home.routes.viewSchedule')}
              <span>→</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: '340px', gap: 24 }}>
            {[
              { from: 'Sài Gòn', to: 'Đà Lạt', dist: '300 KM', price: '350.000 Đ', img: 'https://bloganchoi.com/wp-content/uploads/2021/11/review-da-lat-toan-canh-dat-lat-trong-suong-mu-som-mai-1.jpg', type: 'image', col: 2, row: 2 },
              { from: 'Hà Nội', to: 'Sapa', dist: '320 KM', price: '450.000 Đ', img: '', type: 'glass', col: 2, row: 1, desc: 'Sương mù giăng lối, bản làng ẩn hiện. Khám phá vẻ đẹp Tây Bắc qua từng khung cửa sổ.' },
              { from: 'Đà Nẵng', to: 'Hội An', dist: '30 KM', price: '120.000 Đ', img: 'https://www.agoda.com/wp-content/uploads/2024/07/Thu-Bon-River-at-Hoi-An-Ancient-Town-Vietnam.jpg', type: 'image', col: 1, row: 1 },
              { from: 'Sài Gòn', to: 'Nha Trang', dist: '400 KM', price: '400.000 Đ', img: '', type: 'glass', col: 1, row: 1, desc: 'Biển xanh vẫy gọi.' }
            ].map((route, i) => {
              if (route.type === 'glass') {
                return (
                  <div key={i} onClick={() => navigate('/search')} style={{ 
                    gridColumn: `span ${route.col}`, 
                    gridRow: `span ${route.row}`, 
                    borderRadius: 32, 
                    padding: '40px',
                    background: 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.4s'
                  }} className="hover:-translate-y-2 hover:bg-[rgba(255,255,255,0.08)]">
                    <div>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', color: '#d4af37', margin: 0, lineHeight: 1.1 }}>
                        <span style={{ fontSize: '4.5rem', float: 'left', lineHeight: 0.8, marginRight: 8 }}>{route.to.charAt(0)}</span>
                        {route.to.slice(1)}
                      </h3>
                      <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: 24, lineHeight: 1.6, fontSize: '0.95rem', clear: 'both' }}>{route.desc}</p>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <div>
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t('home.routes.departureFrom')}</span>
                        <div style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '0.05em' }}>{route.from}</div>
                      </div>
                      <div style={{ background: '#ffffff', color: '#0e1111', padding: '12px 24px', borderRadius: 100, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        {route.price}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={i} onClick={() => navigate('/search')} style={{ 
                  gridColumn: `span ${route.col}`, 
                  gridRow: `span ${route.row}`, 
                  borderRadius: 32, 
                  overflow: 'hidden',
                  position: 'relative',
                  cursor: 'pointer'
                }} className="group">
                  <img src={route.img} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease' }} className="group-hover:scale-110" />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }}></div>
                  
                  {/* Glass Tag inside image card */}
                  <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 24, padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.4s' }} className="group-hover:bg-[rgba(255,255,255,0.15)] group-hover:border-[rgba(212,175,55,0.4)]">
                    <div>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#ffffff', margin: 0 }}>{route.to}</h3>
                      <div style={{ color: '#d4af37', fontSize: 11, letterSpacing: '0.1em', marginTop: 8, textTransform: 'uppercase', fontWeight: 700 }}>◆ {route.dist}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{t('home.routes.priceFrom')}</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff' }}>{route.price}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
