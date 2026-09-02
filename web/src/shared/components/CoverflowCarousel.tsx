import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, MapPin } from 'lucide-react';

export interface CoverflowItem {
  tag?: string;
  title: string;
  desc?: string;
  img: string;
  ctaText?: string;
  href: string;
}

interface Props {
  items: CoverflowItem[];
  sectionLabel?: string;
  autoplay?: boolean;
  autoplayDelay?: number;
  onNavigate?: (href: string) => void;
}

// Coverflow stage — kept as inline styles (not Tailwind) because the 3D transform
// math per offset can't be expressed as discrete utility classes.
export function CoverflowCarousel({
  items,
  sectionLabel = 'ĐIỂM ĐẾN NỔI BẬT',
  autoplay = true,
  autoplayDelay = 5000,
  onNavigate,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef(0);
  const total = items.length;

  const nextSlide = useCallback(() => setCurrentIndex(prev => (prev + 1) % total), [total]);
  const prevSlide = useCallback(() => setCurrentIndex(prev => (prev - 1 + total) % total), [total]);
  const goToSlide = (idx: number) => setCurrentIndex(idx % total);

  useEffect(() => {
    if (!autoplay || isHovered || total <= 1) return;
    const interval = setInterval(nextSlide, autoplayDelay);
    return () => clearInterval(interval);
  }, [autoplay, autoplayDelay, isHovered, nextSlide, total]);

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 45) diff < 0 ? nextSlide() : prevSlide();
  };

  if (!items.length) return null;

  return (
    <section
      className="relative w-full min-h-[720px] flex items-center justify-center overflow-hidden py-16 select-none rounded-[2rem]"
      style={{ backgroundColor: '#0d1710' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <img
          src={items[currentIndex]?.img}
          alt=""
          className="w-full h-full object-cover transition-[filter,opacity] duration-1000"
          style={{ filter: 'brightness(0.22) blur(32px)', transform: 'scale(1.15)' }}
        />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, rgba(13,23,16,0.3) 0%, rgba(13,23,16,0.94) 100%)' }} />
      </div>

      <div className="relative w-full max-w-6xl mx-auto px-4 z-10 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-10">
          <span className="w-9 h-px" style={{ background: 'linear-gradient(90deg, transparent, #d4af37)' }} />
          <h3 className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: '#d4af37' }}>{sectionLabel}</h3>
          <span className="w-9 h-px" style={{ background: 'linear-gradient(90deg, #d4af37, transparent)' }} />
        </div>

        <div className="relative w-full h-[500px] flex justify-center items-center mb-10" style={{ perspective: '1400px' }}>
          {items.map((item, idx) => {
            const offset = (idx - currentIndex + total) % total;

            let transform = 'translateX(0px) scale(0.4) rotateY(0deg)';
            let opacity = 0;
            let zIndex = 0;
            let filter = 'brightness(0.4) blur(2px)';
            let isCenter = false;

            if (offset === 0) {
              isCenter = true;
              transform = 'translateX(0px) scale(1) rotateY(0deg)';
              opacity = 1; zIndex = 30; filter = 'brightness(1)';
            } else if (offset === 1) {
              transform = 'translateX(270px) scale(0.84) rotateY(-24deg)';
              opacity = 0.65; zIndex = 20; filter = 'brightness(0.75)';
            } else if (offset === 2) {
              transform = 'translateX(480px) scale(0.68) rotateY(-38deg)';
              opacity = 0.38; zIndex = 10; filter = 'brightness(0.55) blur(1px)';
            } else if (offset === total - 1) {
              transform = 'translateX(-270px) scale(0.84) rotateY(24deg)';
              opacity = 0.65; zIndex = 20; filter = 'brightness(0.75)';
            } else if (offset === total - 2) {
              transform = 'translateX(-480px) scale(0.68) rotateY(38deg)';
              opacity = 0.38; zIndex = 10; filter = 'brightness(0.55) blur(1px)';
            }

            return (
              <div
                key={idx}
                onClick={() => !isCenter && goToSlide(idx)}
                className="absolute w-[300px] h-[480px] rounded-2xl overflow-hidden transition-all duration-[800ms]"
                style={{
                  backgroundColor: '#171311',
                  border: '1px solid rgba(255,255,255,0.12)',
                  transform, opacity, zIndex, filter,
                  transformOrigin: 'center center',
                  transitionTimingFunction: 'cubic-bezier(0.25,1,0.5,1)',
                  boxShadow: isCenter ? '0 25px 60px rgba(0,0,0,0.9), 0 0 35px rgba(212,175,55,0.25)' : '0 15px 35px rgba(0,0,0,0.5)',
                  cursor: isCenter ? 'default' : 'pointer',
                }}
              >
                <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                <div
                  className="absolute inset-0 z-10 pointer-events-none"
                  style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 25%, rgba(0,0,0,0.68) 60%, rgba(0,0,0,0.96) 100%)' }}
                />

                <div
                  className="relative w-full h-full p-5 flex flex-col justify-between text-center z-20 transition-[opacity,transform] duration-500"
                  style={{ opacity: isCenter ? 1 : 0, transform: isCenter ? 'translateY(0px)' : 'translateY(16px)', pointerEvents: isCenter ? 'auto' : 'none' }}
                >
                  <div className="text-right w-full pr-1">
                    {item.tag && (
                      <span className="inline-block text-xs font-semibold tracking-wide text-white/90" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.8)' }}>
                        {item.tag}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-1 mt-auto pb-1">
                    <h2 className="font-display font-medium text-2xl text-white leading-tight" style={{ textShadow: '0 3px 12px rgba(0,0,0,0.95)' }}>
                      {item.title}
                    </h2>

                    <div className="w-8 h-0.5 rounded-full my-1.5" style={{ backgroundColor: '#d4af37', boxShadow: '0 0 8px rgba(212,175,55,0.7)' }} />

                    {item.desc && (
                      <p className="text-sm italic text-white/90 max-w-[270px] mb-2.5 leading-snug" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
                        {item.desc}
                      </p>
                    )}

                    <button
                      onClick={(e) => { e.stopPropagation(); onNavigate ? onNavigate(item.href) : (window.location.href = item.href); }}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase transition-transform hover:scale-105"
                      style={{
                        background: 'linear-gradient(135deg, #d4af37 0%, #a8842a 100%)',
                        color: '#0f1c14',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.4), 0 0 15px rgba(212,175,55,0.3)',
                      }}
                    >
                      <MapPin size={12} />
                      <span>{item.ctaText || 'Xem tuyến'}</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={prevSlide}
          aria-label="Điểm đến trước"
          className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-white z-40 backdrop-blur-sm transition-colors hover:bg-white/10"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.2)' }}
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Điểm đến tiếp theo"
          className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-white z-40 backdrop-blur-sm transition-colors hover:bg-white/10"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.2)' }}
        >
          <ChevronRight size={20} />
        </button>

        <div className="flex items-center justify-center gap-2 z-30">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              aria-label={`Đến điểm đến ${idx + 1}`}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: idx === currentIndex ? '28px' : '8px',
                backgroundColor: idx === currentIndex ? '#d4af37' : 'rgba(255,255,255,0.25)',
                boxShadow: idx === currentIndex ? '0 0 10px rgba(212,175,55,0.7)' : 'none',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
