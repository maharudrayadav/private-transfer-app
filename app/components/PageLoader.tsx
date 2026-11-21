'use client';

import { useState, useEffect } from 'react';

export default function PageLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1f3c 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
        animation: visible ? 'none' : 'fadeOut 0.4s ease forwards',
        transition: 'opacity 0.4s ease',
      }}
    >
      {/* Logo */}
      <img
        src="/logo.png"
        alt="Private Transfers"
        style={{ height: '70px', objectFit: 'contain', filter: 'brightness(1.1)' }}
      />

      {/* Spinner */}
      <div
        style={{
          width: '48px',
          height: '48px',
          border: '4px solid rgba(212,175,55,0.2)',
          borderTop: '4px solid #d4af37',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />

      <p style={{
        color: 'rgba(255,255,255,0.5)',
        fontSize: '0.85rem',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        fontFamily: 'Inter, sans-serif',
      }}>
        Loading...
      </p>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
