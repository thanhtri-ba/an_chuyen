import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import cloudImg from '../../assets/hero/cloud.png';

// lucide-react ships no brand glyphs — minimal inline marks instead.
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" /></svg>
);
const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
);
const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 5.9c-.72.32-1.5.53-2.32.63a4.05 4.05 0 0 0 1.78-2.24 8.1 8.1 0 0 1-2.57.98 4.04 4.04 0 0 0-6.9 3.68A11.47 11.47 0 0 1 3.4 4.7a4.03 4.03 0 0 0 1.25 5.4 4 4 0 0 1-1.83-.5v.05a4.05 4.05 0 0 0 3.24 3.97 4.1 4.1 0 0 1-1.82.07 4.05 4.05 0 0 0 3.78 2.81A8.13 8.13 0 0 1 2 18.4a11.44 11.44 0 0 0 6.2 1.82c7.44 0 11.51-6.17 11.51-11.51l-.01-.52A8.2 8.2 0 0 0 22 5.9Z" /></svg>
);
const YoutubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23 12s0-3.6-.46-5.3a3 3 0 0 0-2.1-2.1C18.7 4 12 4 12 4s-6.7 0-8.44.6a3 3 0 0 0-2.1 2.1C1 8.4 1 12 1 12s0 3.6.46 5.3a3 3 0 0 0 2.1 2.1C5.3 20 12 20 12 20s6.7 0 8.44-.6a3 3 0 0 0 2.1-2.1C23 15.6 23 12 23 12ZM10 15.5v-7l6 3.5-6 3.5Z" /></svg>
);

interface Props {
  bgVideos: string[];
  eyebrow: string;
  title: string;
  /** Seconds each clip plays before crossfading to the next. Default 14s. */
  videoInterval?: number;
}

// Cloud layers: each starts covering the whole frame, then drifts up toward the
// top edge and fades to a low resting opacity — settling into a fringe of cloud
// framing the top of the shot, rather than clearing away entirely.
const CLOUD_LAYERS = [
  { top: '-30%', left: '-20%', size: 1100, driftX: -60, driftY: -420, restOpacity: 0.5, delay: 0 },
  { top: '-25%', left: '40%', size: 1100, driftX: 40, driftY: -440, restOpacity: 0.55, delay: 0.08 },
  { top: '10%', left: '-30%', size: 1200, driftX: -80, driftY: -480, restOpacity: 0.35, delay: 0.16 },
  { top: '5%', left: '55%', size: 1200, driftX: 60, driftY: -460, restOpacity: 0.4, delay: 0.1 },
  { top: '-10%', left: '10%', size: 1300, driftX: 20, driftY: -500, restOpacity: 0.6, delay: 0.24 },
  { top: '30%', left: '25%', size: 1100, driftX: -20, driftY: -560, restOpacity: 0.15, delay: 0.32 },
  { top: '-40%', left: '10%', size: 1250, driftX: -30, driftY: -400, restOpacity: 0.55, delay: 0.04 },
  { top: '-15%', left: '70%', size: 1150, driftX: 90, driftY: -430, restOpacity: 0.45, delay: 0.2 },
  { top: '20%', left: '45%', size: 1300, driftX: 10, driftY: -540, restOpacity: 0.2, delay: 0.28 },
  { top: '35%', left: '-15%', size: 1200, driftX: -70, driftY: -600, restOpacity: 0.1, delay: 0.12 },
  { top: '-20%', left: '-45%', size: 1300, driftX: -90, driftY: -420, restOpacity: 0.5, delay: 0.36 },
  { top: '0%', left: '80%', size: 1200, driftX: 80, driftY: -450, restOpacity: 0.4, delay: 0.18 },
  { top: '45%', left: '55%', size: 1100, driftX: 40, driftY: -620, restOpacity: 0.05, delay: 0.4 },
  { top: '-45%', left: '55%', size: 1150, driftX: 50, driftY: -400, restOpacity: 0.5, delay: 0.14 },
];

const CLOUD_DURATION = 1.8;
const CLOUD_START_DELAY = 0.5;
const CONTENT_DELAY = CLOUD_START_DELAY + 0.9;

export function CloudRevealHero({ bgVideos, eyebrow, title, videoInterval = 14 }: Props) {
  const [videoIndex, setVideoIndex] = useState(0);

  useEffect(() => {
    if (bgVideos.length <= 1) return;
    const id = setInterval(() => setVideoIndex(i => (i + 1) % bgVideos.length), videoInterval * 1000);
    return () => clearInterval(id);
  }, [bgVideos.length, videoInterval]);

  return (
    <section className="relative h-screen min-h-[720px] flex flex-col overflow-hidden bg-[#0d1710]">
      <AnimatePresence>
        <motion.video
          key={bgVideos[videoIndex]}
          src={bgVideos[videoIndex]}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/55" aria-hidden="true" />

      {/* Intro clouds — fully cover on mount, then drift up and settle into a soft
          fringe at the top edge rather than clearing away entirely. */}
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, #fff 0%, #fff 45%, rgba(255,255,255,0.85) 65%, rgba(255,255,255,0.15) 100%)' }}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: CLOUD_DURATION + 0.3, delay: CLOUD_START_DELAY, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none" aria-hidden="true">
        {CLOUD_LAYERS.map((c, i) => (
          <motion.img
            key={i}
            src={cloudImg}
            alt=""
            className="absolute object-cover"
            style={{ top: c.top, left: c.left, width: c.size, height: c.size }}
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{ x: c.driftX, y: c.driftY, opacity: c.restOpacity }}
            transition={{ duration: CLOUD_DURATION, delay: CLOUD_START_DELAY + c.delay, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </div>

      {/* Centered eyebrow + title — global site Header (fixed, z-50) already covers
          the top nav row, so the hero itself starts right below the fold line. */}
      <motion.div
        className="relative z-30 flex-1 flex flex-col items-center justify-center text-center px-6"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: CONTENT_DELAY }}
      >
        <div className="text-base md:text-lg font-bold tracking-[0.5em] uppercase text-[#d4af37] mb-6" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}>{eyebrow}</div>
        <h1
          className="font-condensed font-black uppercase text-6xl md:text-8xl lg:text-[7.5rem] leading-[1.02] tracking-[0.06em] text-white max-w-6xl"
          style={{ textShadow: '0 6px 32px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.8)' }}
        >
          {title}
        </h1>
      </motion.div>

      {/* Bottom row — social icons, scroll cue, page indicator */}
      <div className="relative z-30 flex items-center justify-between px-8 lg:px-16 pb-10">
        <motion.div
          className="hidden sm:flex items-center gap-6 text-white/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: CONTENT_DELAY + 0.3 }}
        >
          <span className="hover:text-[#d4af37] transition-colors cursor-pointer"><FacebookIcon /></span>
          <span className="hover:text-[#d4af37] transition-colors cursor-pointer"><InstagramIcon /></span>
          <span className="hover:text-[#d4af37] transition-colors cursor-pointer"><TwitterIcon /></span>
          <span className="hover:text-[#d4af37] transition-colors cursor-pointer"><YoutubeIcon /></span>
        </motion.div>

        <motion.a
          href="#search"
          onClick={e => { e.preventDefault(); document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' }); }}
          className="flex flex-col items-center gap-3 text-white/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: CONTENT_DELAY + 0.2 }}
        >
          <span className="text-xs font-bold tracking-[0.3em] uppercase">Cuộn xuống</span>
          <span className="w-px h-10 bg-white/50" />
        </motion.a>

        {/* Spacer to keep the scroll cue centered against the social icons on the left */}
        <div className="hidden sm:block w-[104px]" aria-hidden="true" />
      </div>
    </section>
  );
}
