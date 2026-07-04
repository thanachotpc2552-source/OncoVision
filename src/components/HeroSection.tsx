'use client';

export default function HeroSection() {
  return (
    <section
      id="hero"
      style={{
        paddingTop: '8rem',
        paddingBottom: '5rem',
        background: 'linear-gradient(160deg, #f0fdfa 0%, #ffffff 50%, #f0f9ff 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative blobs */}
      <div style={{
        position: 'absolute', top: '-4rem', right: '-6rem',
        width: '36rem', height: '36rem',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-3rem', left: '-4rem',
        width: '28rem', height: '28rem',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container-md" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center' }}>

          {/* Label */}
          <div
            className="animate-fade-in"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.375rem 1rem',
              borderRadius: '9999px',
              background: '#f0fdfa',
              border: '1px solid #99f6e4',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#0d9488',
              marginBottom: '1.75rem',
            }}
          >
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: '#14b8a6',
              animation: 'pulse 2s infinite',
            }} />
            Powered by Gemini Vision AI
          </div>

          {/* Headline */}
          <h1
            className="animate-slide-up"
            style={{
              fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.025em',
              color: '#0f172a',
              marginBottom: '1.25rem',
            }}
          >
            Early Breast Cancer Detection
            <br />
            <span className="gradient-text">with Explainable AI</span>
          </h1>

          {/* Sub-headline */}
          <p
            className="animate-slide-up delay-100"
            style={{
              fontSize: '1.125rem',
              lineHeight: 1.7,
              color: '#475569',
              maxWidth: '600px',
              margin: '0 auto 2.5rem',
            }}
          >
            Upload histopathological slide images and receive structured, transparent
            diagnostic insights — showing exactly which cellular patterns led to each finding.
          </p>

          {/* CTAs */}
          <div
            className="animate-slide-up delay-200"
            style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <a href="#dashboard" className="btn-primary" style={{ fontSize: '1rem', padding: '0.75rem 2rem' }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Analyze an Image
            </a>
            <a href="#methodology" className="btn-outline" style={{ fontSize: '1rem', padding: '0.75rem 2rem' }}>
              How It Works
            </a>
          </div>

          {/* Trust bar */}
          <div
            className="animate-fade-in delay-300"
            style={{
              display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
              gap: '2rem', marginTop: '3.5rem',
              borderTop: '1px solid #e2e8f0', paddingTop: '2rem',
            }}
          >
            {[
              { icon: '🔬', text: 'Histopathology Analysis' },
              { icon: '💡', text: 'Explainable Insights' },
              { icon: '🔒', text: 'No Image Storage' },
              { icon: '⚡', text: 'Results in Seconds' },
            ].map((item) => (
              <div
                key={item.text}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem' }}
              >
                <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
