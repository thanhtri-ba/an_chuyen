// Full-screen loading state used as the Suspense fallback for every route (App.tsx).
// Retro van illustration: van bounces in place, road dashes scroll under it, and the
// exhaust puffs drift back — reads as "still driving" rather than a static spinner.
export function BusLoadingScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#F2A71B] overflow-hidden">
      <style>{`
        @keyframes bus-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes bus-road-scroll { from { transform: translateX(0); } to { transform: translateX(-120px); } }
        @keyframes bus-smoke { 0% { opacity: 0; transform: translate(0,0) scale(0.6); } 30% { opacity: 0.9; } 100% { opacity: 0; transform: translate(-40px,-10px) scale(1.3); } }
      `}</style>

      <svg viewBox="0 0 800 600" className="w-full h-full max-w-4xl" role="img" aria-label="Đang tải">
        <circle cx="558" cy="175" r="45" fill="#E8342A" />

        <g style={{ animation: 'bus-bounce 1.1s ease-in-out infinite' }}>
          {/* exhaust puffs */}
          <g fill="#F5E6C8">
            <ellipse cx="150" cy="450" rx="14" ry="8" style={{ animation: 'bus-smoke 1.6s ease-out infinite', transformOrigin: '150px 450px' }} />
            <ellipse cx="170" cy="445" rx="18" ry="9" style={{ animation: 'bus-smoke 1.6s ease-out infinite 0.4s', transformOrigin: '170px 445px' }} />
            <ellipse cx="195" cy="450" rx="22" ry="10" style={{ animation: 'bus-smoke 1.6s ease-out infinite 0.8s', transformOrigin: '195px 450px' }} />
          </g>

          {/* van body */}
          <g stroke="#7A1E20" strokeWidth="4" strokeLinejoin="round">
            <rect x="285" y="345" width="245" height="115" rx="10" fill="#E8342A" />
            <path d="M285 400 h245" stroke="#7A1E20" strokeWidth="3" />
            <rect x="310" y="358" width="60" height="40" rx="6" fill="#7A1E20" />
            <rect x="378" y="358" width="60" height="40" rx="6" fill="#F5E6C8" />
            <rect x="446" y="358" width="55" height="40" rx="6" fill="#F5E6C8" />
            <rect x="285" y="336" width="245" height="12" rx="4" fill="#F5E6C8" />
            <line x1="300" y1="336" x2="300" y2="325" stroke="#7A1E20" strokeWidth="3" />
            <line x1="330" y1="336" x2="330" y2="325" stroke="#7A1E20" strokeWidth="3" />
            <line x1="360" y1="336" x2="360" y2="325" stroke="#7A1E20" strokeWidth="3" />
            <path d="M285 400 v45 a10 10 0 0 0 10 15 h230 a10 10 0 0 0 10 -15 v-45" fill="none" />
            <line x1="510" y1="405" x2="510" y2="450" stroke="#7A1E20" strokeWidth="3" />
            <line x1="518" y1="405" x2="518" y2="450" stroke="#7A1E20" strokeWidth="3" />
            <path d="M270 380 v40" stroke="#7A1E20" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M270 380 q-8 -4 -6 -14" stroke="#7A1E20" strokeWidth="4" fill="none" strokeLinecap="round" />
          </g>

          {/* wheels */}
          <g>
            <circle cx="330" cy="462" r="24" fill="#7A1E20" stroke="#7A1E20" strokeWidth="4" />
            <circle cx="330" cy="462" r="9" fill="#F5E6C8" />
            <circle cx="478" cy="462" r="24" fill="#7A1E20" stroke="#7A1E20" strokeWidth="4" />
            <circle cx="478" cy="462" r="9" fill="#F5E6C8" />
          </g>
        </g>

        {/* road */}
        <g stroke="#7A1E20" strokeWidth="8" strokeLinecap="round">
          <line x1="60" y1="484" x2="740" y2="484" />
        </g>
        <g stroke="#7A1E20" strokeWidth="6" strokeLinecap="round" style={{ animation: 'bus-road-scroll 0.7s linear infinite' }}>
          <line x1="0" y1="500" x2="60" y2="500" />
          <line x1="120" y1="500" x2="180" y2="500" />
          <line x1="240" y1="500" x2="300" y2="500" />
          <line x1="360" y1="500" x2="420" y2="500" />
          <line x1="480" y1="500" x2="540" y2="500" />
          <line x1="600" y1="500" x2="660" y2="500" />
          <line x1="720" y1="500" x2="780" y2="500" />
          <line x1="840" y1="500" x2="900" y2="500" />
        </g>
      </svg>
    </div>
  );
}
