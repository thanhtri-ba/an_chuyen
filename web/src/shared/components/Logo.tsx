import React from 'react';
import { cn } from '../utils/cn';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'auto';
  showText?: boolean;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  className,
  variant = 'auto',
  showText = true,
  showTagline = false,
  size = 'md',
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-lg', tagline: 'text-[9px]' },
    md: { icon: 'w-9 h-9', text: 'text-2xl', tagline: 'text-[10px]' },
    lg: { icon: 'w-12 h-12', text: 'text-3xl', tagline: 'text-xs' },
  };

  const isLight = variant === 'light';

  return (
    <div className={cn('inline-flex items-center gap-2.5 group select-none', className)}>
      {/* Premium Bus & Safety Shield SVG Icon */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          className={cn(
            sizeMap[size].icon,
            'transition-transform duration-300 group-hover:scale-105 drop-shadow-md'
          )}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0d9488" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <linearGradient id="shieldGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
            <linearGradient id="busBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f1f5f9" />
            </linearGradient>
            <linearGradient id="busBodyGradLight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <linearGradient id="roadSweep" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>

          {/* Outer Shield Pin Container */}
          <path
            d="M32 4C18 4 8 13.5 8 28C8 42 28 58 32 60C36 58 56 42 56 28C56 13.5 46 4 32 4Z"
            fill={isLight ? 'url(#shieldGradLight)' : 'url(#shieldGrad)'}
          />

          {/* Inner Accent Ring */}
          <path
            d="M32 8C21 8 12 15.5 12 28C12 39.5 28 52.5 32 54.5C36 52.5 52 39.5 52 28C52 15.5 43 8 32 8Z"
            fill="none"
            stroke={isLight ? '#0d9488' : '#ffffff'}
            strokeWidth="1.5"
            strokeOpacity={isLight ? '0.3' : '0.2'}
          />

          {/* Stylized Modern Coach Bus Silhouette */}
          {/* Bus Body Frame */}
          <rect
            x="20"
            y="18"
            width="24"
            height="22"
            rx="5"
            fill={isLight ? 'url(#busBodyGradLight)' : 'url(#busBodyGrad)'}
          />

          {/* Windshield */}
          <path
            d="M22 21C22 19.8954 22.8954 19 24 19H40C41.1046 19 42 19.8954 42 21V28H22V21Z"
            fill={isLight ? '#38bdf8' : '#0f172a'}
          />

          {/* Rearview Mirrors */}
          <rect x="17" y="22" width="2" height="5" rx="1" fill={isLight ? '#94a3b8' : '#ffffff'} />
          <rect x="45" y="22" width="2" height="5" rx="1" fill={isLight ? '#94a3b8' : '#ffffff'} />

          {/* LED Headlights */}
          <circle cx="24" cy="33" r="2" fill={isLight ? '#38bdf8' : '#f59e0b'} />
          <circle cx="40" cy="33" r="2" fill={isLight ? '#38bdf8' : '#f59e0b'} />

          {/* Front Grille / Logo Accent */}
          <rect x="28" y="32" width="8" height="2" rx="1" fill={isLight ? '#ffffff' : '#0284c7'} />

          {/* Dynamic Road Curves (Representing Journey / Speed & 'A' Crossbar) */}
          <path
            d="M14 44C20 37 28 40 32 40C36 40 44 37 50 44C44 48 36 47 32 47C28 47 20 48 14 44Z"
            fill="url(#roadSweep)"
          />
        </svg>
      </div>

      {/* Brand Name Typography */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <span
            className={cn(
              'font-display font-extrabold tracking-tight flex items-center gap-1',
              sizeMap[size].text,
              isLight ? 'text-white' : 'text-[#1a1a1a]'
            )}
          >
            An{' '}
            <span
              className={cn(
                'bg-gradient-to-r bg-clip-text text-transparent',
                isLight ? 'from-teal-200 to-cyan-300' : 'from-teal-600 to-blue-600'
              )}
            >
              Chuyến
            </span>
          </span>
          {showTagline && (
            <span
              className={cn(
                'font-sans font-semibold tracking-wider uppercase text-[10px]',
                isLight ? 'text-white/80' : 'text-gray-400'
              )}
            >
              An tâm mọi hành trình
            </span>
          )}
        </div>
      )}
    </div>
  );
};
