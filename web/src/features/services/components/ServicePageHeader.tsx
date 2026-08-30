import type { ReactNode } from 'react';

interface ServicePageHeaderProps {
  title: ReactNode;
  subtitle?: string;
  icon?: string;
}

export function ServicePageHeader({ title, subtitle, icon }: ServicePageHeaderProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
      {icon && <img src={icon} alt="" loading="lazy" decoding="async" style={{ width: 56, height: 56 }} />}
      <div>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#163328', marginBottom: 10 }}>
          An Chuyến
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, margin: 0, color: '#1a1a1a' }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ color: 'rgba(0,0,0,0.5)', fontSize: 15, marginTop: 8 }}>{subtitle}</p>
        )}
      </div>
    </div>
  );
}
