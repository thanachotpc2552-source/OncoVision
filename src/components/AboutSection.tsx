const privacyPoints = [
  {
    icon: '🔒',
    title: 'Zero Data Retention',
    body: 'Images are processed entirely in memory during the request and discarded immediately. Nothing is written to disk or any database.',
  },
  {
    icon: '🔐',
    title: 'Encrypted in Transit',
    body: 'All communications use TLS 1.3 end-to-end. Your images and results are never transmitted in plaintext.',
  },
  {
    icon: '⚕️',
    title: 'HIPAA-Aware Architecture',
    body: 'The platform is designed with HIPAA guidelines for Protected Health Information (PHI) in mind, minimising exposure at every layer.',
  },
  {
    icon: '🚫',
    title: 'No Third-Party Sharing',
    body: 'Uploaded images are sent only to the Gemini API for inference. They are not logged, stored, or used for any training purposes.',
  },
];

const capabilities = [
  { label: 'Primary Model',    value: 'Gemini 2.5 Flash' },
  { label: 'Fallback Model',   value: 'Gemini 1.5 Flash (auto on rate-limit)' },
  { label: 'Input Formats',    value: 'JPEG, PNG, WebP — up to 10 MB' },
  { label: 'Analysis Output',  value: 'Structured: Diagnosis / Findings / Confidence / Recommendation' },
  { label: 'Response Time',    value: 'Typically 3 – 10 seconds' },
  { label: 'Data Retention',   value: 'None — ephemeral processing only' },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      style={{ padding: '5rem 0', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}
    >
      <div className="container-md">
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '3rem', alignItems: 'start' }}>

          {/* ── LEFT: About the platform ─────────────────────────────────── */}
          <div>
            <p style={{ color: '#0d9488', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
              About
            </p>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '1.25rem', lineHeight: 1.25 }}>
              What is OncoVision?
            </h2>
            <p style={{ color: '#475569', lineHeight: 1.75, marginBottom: '1.25rem' }}>
              OncoVision is an Explainable AI (XAI) decision-support platform for breast cancer
              histopathology analysis. It is designed to help pathologists and researchers
              quickly surface structured diagnostic insights from H&amp;E stained slide images.
            </p>
            <p style={{ color: '#475569', lineHeight: 1.75, marginBottom: '2rem' }}>
              Unlike black-box AI systems, OncoVision provides the <strong style={{ color: '#0f172a' }}>reasoning behind every finding</strong> —
              pointing to specific cellular patterns, nuclear morphology, and tissue architecture
              that support each assessment. This transparency allows clinicians to validate AI
              conclusions against their own expertise.
            </p>

            {/* Capabilities table */}
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  System Specifications
                </span>
              </div>
              {capabilities.map((c, i) => (
                <div
                  key={c.label}
                  style={{
                    display: 'flex', gap: '1rem', padding: '0.75rem 1.25rem',
                    borderBottom: i < capabilities.length - 1 ? '1px solid #f1f5f9' : 'none',
                    alignItems: 'flex-start',
                  }}
                >
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#64748b', minWidth: '140px', flexShrink: 0 }}>
                    {c.label}
                  </span>
                  <span style={{ fontSize: '0.875rem', color: '#1e293b' }}>{c.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Privacy commitment ────────────────────────────────── */}
          <div>
            <p style={{ color: '#0d9488', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
              Patient Data Privacy
            </p>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '1.25rem', lineHeight: 1.25 }}>
              Your Data,<br />Our Commitment
            </h2>
            <p style={{ color: '#475569', lineHeight: 1.75, marginBottom: '1.75rem' }}>
              Medical image privacy is non-negotiable. Here is exactly how we handle every file you upload.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {privacyPoints.map((p) => (
                <div
                  key={p.title}
                  className="card"
                  style={{ padding: '1rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}
                >
                  <span style={{ fontSize: '1.375rem', lineHeight: 1, flexShrink: 0 }}>{p.icon}</span>
                  <div>
                    <p style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem', fontSize: '0.9375rem' }}>
                      {p.title}
                    </p>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.65 }}>
                      {p.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Ethics quote */}
            <blockquote style={{
              marginTop: '1.75rem',
              padding: '1.125rem 1.25rem',
              borderLeft: '3px solid #14b8a6',
              background: '#f0fdfa',
              borderRadius: '0 0.625rem 0.625rem 0',
            }}>
              <p style={{ fontStyle: 'italic', color: '#0f766e', lineHeight: 1.7, fontSize: '0.9375rem', margin: 0 }}>
                "AI in medicine should support clinical judgment, not replace it.
                Every finding OncoVision produces is evidence, not a verdict."
              </p>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
