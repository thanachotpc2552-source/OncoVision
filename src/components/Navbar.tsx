'use client';

import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 50,
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: scrolled ? '1px solid #e2e8f0' : '1px solid transparent',
        transition: 'all 0.25s ease',
        padding: scrolled ? '0.75rem 0' : '1rem 0',
      }}
    >
      <div className="container-md flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
          <div style={{
            width: 34, height: 34,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(13,148,136,0.3)',
          }}>
            {/* Microscope icon */}
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: '1.0625rem', color: '#0f172a', letterSpacing: '-0.01em' }}>
            Onco<span style={{ color: '#0d9488' }}>Vision</span>
          </span>
        </a>

        {/* Nav links */}
        <nav className="hidden md:flex items-center" style={{ gap: '2rem' }}>
          {[
            { label: 'How It Works', href: '#methodology' },
            { label: 'Analyze',      href: '#dashboard' },
            { label: 'About',        href: '#about' },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              style={{
                color: '#64748b',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: 500,
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#0d9488')}
              onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a href="#dashboard" className="btn-primary" style={{ fontSize: '0.875rem', padding: '0.5rem 1.125rem' }}>
          Try Analyzer
        </a>
      </div>
    </header>
  );
}
