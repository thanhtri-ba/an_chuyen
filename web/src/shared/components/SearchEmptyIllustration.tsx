interface Props {
  title: string;
  subtitle?: string;
  className?: string;
  /** Smaller footprint for narrow columns (e.g. the trip-list panel), vs. the
   * default size meant for a wide panel like the map. */
  compact?: boolean;
}

// Document-with-magnifying-glass illustration for "nothing to show yet" states —
// used wherever a trip/route hasn't been picked so a bare map or blank panel
// doesn't sit there unexplained.
export function SearchEmptyIllustration({ title, subtitle, className = '', compact = false }: Props) {
  return (
    <div className={`flex flex-col items-center justify-center text-center px-6 ${compact ? 'gap-3' : 'gap-6'} ${className}`}>
      <svg viewBox="0 0 220 200" className={compact ? 'w-28 h-[102px]' : 'w-56 h-52'} fill="none">
        <path d="M60 20 h60 l24 24 v128 a6 6 0 0 1 -6 6 h-78 a6 6 0 0 1 -6 -6 v-146 a6 6 0 0 1 6 -6 Z" fill="#fff" stroke="#94A3B8" strokeWidth="3" />
        <path d="M120 20 v18 a6 6 0 0 0 6 6 h18" fill="none" stroke="#94A3B8" strokeWidth="3" />
        <circle cx="88" cy="66" r="12" fill="#F2C795" stroke="#94A3B8" strokeWidth="2.5" />
        <line x1="66" y1="96" x2="134" y2="96" stroke="#CBD5E1" strokeWidth="5" strokeLinecap="round" />
        <line x1="66" y1="112" x2="118" y2="112" stroke="#CBD5E1" strokeWidth="5" strokeLinecap="round" />
        <line x1="66" y1="128" x2="128" y2="128" stroke="#CBD5E1" strokeWidth="5" strokeLinecap="round" />
        <path d="M58 168 q10 -10 22 -2" stroke="#E8342A" strokeWidth="3" strokeLinecap="round" fill="none" />

        <g transform="translate(6 6)">
          <circle cx="150" cy="108" r="38" fill="#F1F5F9" stroke="#64748B" strokeWidth="5" />
          <circle cx="150" cy="108" r="27" fill="none" stroke="#94A3B8" strokeWidth="2" />
          <line x1="176" y1="134" x2="200" y2="158" stroke="#64748B" strokeWidth="9" strokeLinecap="round" />
          <path d="M192 150 l20 20 a8 8 0 0 1 -11 11 l-20 -20 Z" fill="#E8942C" stroke="#64748B" strokeWidth="3" />
        </g>
      </svg>

      <div className={`flex flex-col gap-1.5 ${compact ? 'max-w-[220px]' : 'max-w-[340px]'}`}>
        <span className={`font-bold text-[#0D1C2E] ${compact ? 'text-sm' : 'text-lg'}`}>{title}</span>
        {subtitle && <span className={`text-[#585E6C] leading-relaxed ${compact ? 'text-xs' : 'text-sm'}`}>{subtitle}</span>}
      </div>
    </div>
  );
}
