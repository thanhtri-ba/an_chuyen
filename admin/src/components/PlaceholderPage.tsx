import React from 'react';

const PlaceholderPage = ({ title, description }: { title: string, description: string }) => {
  return (
    <div className="animate-fade-in" style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
      minHeight: '60vh', textAlign: 'center'
    }}>
      <div style={{
        width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--color-bg-surface)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem',
        boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)'
      }}>
        <span style={{ fontSize: '2rem' }}>🚧</span>
      </div>
      <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-base)', marginBottom: '0.5rem' }}>{title}</h1>
      <p style={{ color: 'var(--color-text-muted)', maxWidth: '400px', lineHeight: '1.6' }}>
        {description} <br/> This page is currently under construction in the new Admin UI.
      </p>
    </div>
  );
};

export default PlaceholderPage;
