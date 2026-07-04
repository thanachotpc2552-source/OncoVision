const steps = [
  {
    n: '01',
    title: 'Upload Image',
    desc: 'Drop a histopathological slide image (H&E stained, JPEG or PNG). The file is converted to base64 in your browser — never written to disk.',
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
      </svg>
    ),
    accent: '#14b8a6',
    bg: '#f0fdfa',
  },
  {
    n: '02',
    title: 'Deep Learning Analysis',
    desc: 'Gemini Vision AI scans cellular morphology — nuclear shape, chromatin texture, mitotic figures, and tissue architecture at pixel level.',
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
    accent: '#2563eb',
    bg: '#eff6ff',
  },
  {
    n: '03',
    title: 'Explainable Findings',
    desc: 'Every result comes with specific visual evidence — which cells, which patterns, and why — so pathologists can validate the reasoning.',
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
    accent: '#7c3aed',
    bg: '#f5f3ff',
  },
  {
    n: '04',
    title: 'Pathologist Review',
    desc: 'AI findings serve as a structured second opinion. The clinician reviews original image, visual findings, and confidence level before any decision.',
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
    accent: '#059669',
    bg: '#ecfdf5',
  },
];

export default function MethodologySection() {
  return (
    <section
      id="methodology"
      style={{ padding: '5rem 0', background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}
    >
      <div className="container-md">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p style={{ color: '#0d9488', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
            How It Works
          </p>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            The Analysis Pipeline
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.0625rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.65 }}>
            A transparent four-step process from image upload to clinical insight.
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {steps.map((step) => (
            <div
              key={step.n}
              className="card hover-lift"
              style={{ padding: '1.75rem', position: 'relative', overflow: 'hidden' }}
            >
              {/* Step number watermark */}
              <span style={{
                position: 'absolute', top: '-0.5rem', right: '0.75rem',
                fontSize: '4.5rem', fontWeight: 900,
                color: step.bg === '#f0fdfa' ? 'rgba(20,184,166,0.07)' : 'rgba(0,0,0,0.04)',
                lineHeight: 1, userSelect: 'none',
              }}>
                {step.n}
              </span>

              {/* Icon */}
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: step.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1rem',
                color: step.accent,
              }}>
                {step.icon}
              </div>

              <h3 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem', fontSize: '1rem' }}>
                {step.title}
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.65 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div style={{
          marginTop: '2.5rem',
          padding: '1rem 1.5rem',
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: '0.75rem',
          display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
        }}>
          <span style={{ fontSize: '1.125rem', flexShrink: 0, marginTop: '1px' }}>⚠️</span>
          <p style={{ color: '#92400e', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
            <strong>Clinical Disclaimer:</strong> OncoVision is a research-grade decision-support tool.
            All AI-generated outputs must be reviewed and validated by a licensed pathologist before
            any clinical action is taken. This tool is not a certified medical device.
          </p>
        </div>
      </div>
    </section>
  );
}
