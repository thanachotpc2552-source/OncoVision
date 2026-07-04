'use client';

import { useMemo } from 'react';

interface Props {
  analysisText: string;
  modelUsed:    string;
  timestamp:    string;
}

function parse(text: string, label: string): string {
  const m = text.match(new RegExp(`${label}[:\\s]+([^\\n]+(?:\\n(?![A-Z ]+:)[^\\n]*)*)`, 'i'));
  return m ? m[1].trim() : '';
}

function StatusBadge({ status }: { status: string }) {
  const lower = status.toLowerCase();
  if (lower.includes('normal'))
    return <span className="badge-normal">✓ Normal</span>;
  if (lower.includes('malignant') || lower.includes('present'))
    return <span className="badge-malignant">⚠ Malignant Indicators</span>;
  return <span className="badge-suspicious">! Suspicious</span>;
}

function ConfidenceBar({ text }: { text: string }) {
  const lower = text.toLowerCase();
  const cfg = useMemo(() => {
    if (lower.includes('high'))     return { pct: 88, color: '#16a34a', label: 'High' };
    if (lower.includes('moderate')) return { pct: 62, color: '#d97706', label: 'Moderate' };
    return                                  { pct: 35, color: '#dc2626', label: 'Low' };
  }, [lower]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
        <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>Confidence</span>
        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: cfg.color }}>{cfg.label} ({cfg.pct}%)</span>
      </div>
      <div style={{ height: 7, background: '#e2e8f0', borderRadius: 9999, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%', width: `${cfg.pct}%`,
            background: cfg.color,
            borderRadius: 9999,
            transition: 'width 1s ease',
          }}
          role="progressbar" aria-valuenow={cfg.pct} aria-valuemin={0} aria-valuemax={100}
        />
      </div>
    </div>
  );
}

function Field({ label, children, accent = false }: { label: string; children: React.ReactNode; accent?: boolean }) {
  return (
    <div style={{
      padding: '0.875rem 1rem',
      background: accent ? '#f0fdfa' : '#f8fafc',
      border: `1px solid ${accent ? '#99f6e4' : '#e2e8f0'}`,
      borderRadius: '0.625rem',
    }}>
      <p style={{
        fontSize: '0.6875rem', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.08em',
        color: '#94a3b8', marginBottom: '0.5rem',
      }}>
        {label}
      </p>
      <div style={{ fontSize: '0.9rem', color: '#1e293b', lineHeight: 1.65 }}>
        {children}
      </div>
    </div>
  );
}

export default function AnalysisResult({ analysisText, modelUsed, timestamp }: Props) {
  const diagnosisStatus     = parse(analysisText, 'DIAGNOSIS STATUS');
  const visualFindings      = parse(analysisText, 'VISUAL FINDINGS');
  const confidence          = parse(analysisText, 'DIAGNOSTIC CONFIDENCE');
  const recommendation      = parse(analysisText, 'CLINICAL RECOMMENDATION');

  const time = useMemo(() => {
    try { return new Date(timestamp).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }); }
    catch { return timestamp; }
  }, [timestamp]);

  return (
    <div className="animate-slide-right" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>

      {/* Top row: status + time */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <StatusBadge status={diagnosisStatus || analysisText} />
        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{time}</span>
      </div>

      {/* Diagnosis status */}
      {diagnosisStatus && (
        <Field label="Diagnosis Status" accent>
          <strong style={{ color: '#0f172a' }}>{diagnosisStatus}</strong>
        </Field>
      )}

      {/* Confidence */}
      {confidence && (
        <Field label="Diagnostic Confidence">
          <ConfidenceBar text={confidence} />
          {confidence.replace(/^(high|moderate|low)[^\w]*/i, '') && (
            <p style={{ marginTop: '0.5rem', fontSize: '0.8125rem', color: '#64748b' }}>
              {confidence.replace(/^(high|moderate|low)[^\w]*/i, '')}
            </p>
          )}
        </Field>
      )}

      {/* Visual findings */}
      {visualFindings && (
        <Field label="Visual Findings (XAI Explanation)">
          <p style={{ color: '#334155' }}>{visualFindings}</p>
        </Field>
      )}

      {/* Clinical recommendation */}
      {recommendation && (
        <Field label="Clinical Recommendation">
          <p style={{ color: '#92400e' }}>{recommendation}</p>
        </Field>
      )}

      {/* Fallback: show raw text if parsing yields nothing */}
      {!diagnosisStatus && !visualFindings && (
        <Field label="Analysis Output">
          <p style={{ whiteSpace: 'pre-wrap', color: '#334155' }}>{analysisText}</p>
        </Field>
      )}

      {/* Footer */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontSize: '0.75rem', color: '#94a3b8', flexWrap: 'wrap', gap: '0.25rem',
        paddingTop: '0.375rem',
      }}>
        <span>Model: <code style={{ color: '#64748b', fontFamily: 'monospace' }}>{modelUsed}</code></span>
        <span>⚕️ Decision support only — verify with a pathologist</span>
      </div>
    </div>
  );
}
