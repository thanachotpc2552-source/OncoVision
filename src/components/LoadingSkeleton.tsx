export default function LoadingSkeleton() {
  const SkBar = ({ w }: { w: string }) => (
    <div className="skeleton" style={{ height: 14, width: w }} />
  );
  return (
    <div className="animate-fade-in" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.875rem' }} aria-busy="true">
      {/* Badge + date row */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className="skeleton" style={{ height: 26, width: 120, borderRadius: 9999 }} />
        <div className="skeleton" style={{ height: 14, width: 100 }} />
      </div>

      {/* 4 field blocks */}
      {[1, 2, 3, 4].map((i) => (
        <div key={i} style={{ padding: '0.875rem 1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.625rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="skeleton" style={{ height: 10, width: 80 }} />
          <SkBar w={i === 2 ? '100%' : '70%'} />
          {i === 3 && <SkBar w="85%" />}
          {i === 3 && <SkBar w="60%" />}
        </div>
      ))}

      {/* Spinner row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', paddingTop: '0.25rem' }}>
        <div style={{
          width: 18, height: 18, borderRadius: '50%',
          border: '2px solid #e2e8f0',
          borderTopColor: '#14b8a6',
          animation: 'spin 0.8s linear infinite',
        }} />
        <span style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>Consulting Gemini Vision AI…</span>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
