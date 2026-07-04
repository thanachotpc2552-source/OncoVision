export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{
      borderTop: '1px solid #e2e8f0',
      background: '#f8fafc',
      padding: '2.5rem 0',
    }}>
      <div className="container-md">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
              width: 30, height: 30, borderRadius: 9,
              background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
            </div>
            <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>
              Onco<span style={{ color: '#0d9488' }}>Vision</span>
            </span>
          </div>

          {/* Links */}
          <nav style={{ display: 'flex', gap: '1.75rem', fontSize: '0.875rem' }}>
            {[
              { label: 'How It Works', href: '#methodology' },
              { label: 'Analyzer',     href: '#dashboard' },
              { label: 'About',        href: '#about' },
            ].map((l) => (
              <a key={l.label} href={l.href} style={{ color: '#64748b', textDecoration: 'none' }}>
                {l.label}
              </a>
            ))}
          </nav>

          {/* Copyright */}
          <span style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
            © {year} OncoVision
          </span>
        </div>

        {/* Medical disclaimer */}
        <div style={{
          marginTop: '1.75rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #e2e8f0',
          fontSize: '0.75rem',
          color: '#94a3b8',
          lineHeight: 1.7,
          textAlign: 'center',
          maxWidth: '680px',
          margin: '1.75rem auto 0',
        }}>
          <strong style={{ color: '#64748b' }}>Medical Disclaimer:</strong>{' '}
          OncoVision is a research-grade AI decision-support tool, not a certified medical device.
          All AI-generated outputs must be reviewed and validated by a licensed pathologist before
          any clinical decision is made.
        </div>
      </div>
    </footer>
  );
}
