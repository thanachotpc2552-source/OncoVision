'use client';

import { useMemo, useState } from 'react';

interface Props {
  analysisText: string;
  modelUsed:    string;
  timestamp:    string;
  imageB64?:    string;
  mimeType?:    string;
  readOnly?:    boolean;
}

interface AnalysisData {
  diagnosis_status?: string;
  confidence_score?: number;
  visual_findings?: string;
  feature_attributions?: { feature: string; percentage: number }[];
  clinical_recommendation?: string;
}

/* ── Components ──────────────────────────────────────────────────────────── */

function StatusBadge({ status }: { status: string }) {
  const lower = status.toLowerCase();
  if (lower.includes('normal') || lower.includes('benign'))
    return <span className="badge-normal">✓ {status}</span>;
  if (lower.includes('malignant') || lower.includes('present'))
    return <span className="badge-malignant">⚠ {status}</span>;
  return <span className="badge-suspicious">! {status}</span>;
}

function CircularGauge({ percentage }: { percentage: number }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let color = '#dc2626'; // Red (Low / Malignant correlation)
  if (percentage >= 80) color = '#16a34a'; // Green (High confidence)
  else if (percentage >= 50) color = '#d97706'; // Orange

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
      <div style={{ position: 'relative', width: 80, height: 80 }}>
        {/* Background circle */}
        <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="40" cy="40" r={radius} fill="transparent" stroke="#e2e8f0" strokeWidth="6" />
          {/* Progress circle */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>
        {/* Center text */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column'
        }}>
          <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
            {percentage}%
          </span>
        </div>
      </div>
      <div>
        <p style={{ fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>AI Confidence Score</p>
        <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
          Based on morphological analysis
        </p>
      </div>
    </div>
  );
}

function FeatureBar({ feature, percentage }: { feature: string; percentage: number }) {
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569' }}>{feature}</span>
        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a' }}>{percentage}%</span>
      </div>
      <div style={{ height: 6, background: '#f1f5f9', borderRadius: 9999, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%', width: `${percentage}%`,
            background: 'linear-gradient(90deg, #94a3b8, #64748b)',
            borderRadius: 9999,
            transition: 'width 1s ease-out',
          }}
        />
      </div>
    </div>
  );
}

function Field({ label, children, accent = false }: { label: string; children: React.ReactNode; accent?: boolean }) {
  return (
    <div style={{
      padding: '1rem 1.25rem',
      background: accent ? '#f0fdfa' : '#ffffff',
      border: `1px solid ${accent ? '#99f6e4' : '#e2e8f0'}`,
      borderRadius: '0.75rem',
      boxShadow: accent ? 'none' : '0 1px 2px rgba(0,0,0,0.02)',
    }}>
      <p style={{
        fontSize: '0.6875rem', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.08em',
        color: '#94a3b8', marginBottom: '0.75rem',
      }}>
        {label}
      </p>
      <div style={{ fontSize: '0.9375rem', color: '#1e293b', lineHeight: 1.65 }}>
        {children}
      </div>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────────────────────── */

export default function AnalysisResult({ analysisText, modelUsed, timestamp, imageB64, mimeType, readOnly = false }: Props) {
  // Try to parse JSON. If it fails, fallback to raw text mode.
  const data: AnalysisData | null = useMemo(() => {
    try {
      return JSON.parse(analysisText);
    } catch (e) {
      console.error("Failed to parse AI JSON response", e);
      return null;
    }
  }, [analysisText]);

  // State for editable notes and saving status
  const [notes, setNotes] = useState(data?.clinical_recommendation || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveEHR = async () => {
    if (isSaving || saved) return;
    setIsSaving(true);
    
    try {
      // Compress image to avoid Vercel 4.5MB payload limit & Firestore 1MB document limit
      let compressedB64 = imageB64;
      let finalMime = mimeType;
      
      if (imageB64) {
        compressedB64 = await new Promise<string>((resolve) => {
          const img = new window.Image();
          img.src = `data:${mimeType};base64,${imageB64}`;
          img.onload = () => {
            const MAX_WIDTH = 800;
            let { width, height } = img;
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
              resolve(dataUrl.split(',')[1]);
            } else {
              resolve(imageB64);
            }
          };
          img.onerror = () => resolve(imageB64);
        });
        finalMime = 'image/jpeg';
      }

      const payload = {
        modelUsed,
        analysisText,
        clinicalNotes: notes,
        diagnosis_status: data?.diagnosis_status,
        confidence_score: data?.confidence_score,
        imageB64: compressedB64,
        mimeType: finalMime
      };

      const res = await fetch('/api/ehr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error('Failed to save to EHR');
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error(error);
      alert('Failed to save record to local database.');
    } finally {
      setIsSaving(false);
    }
  };

  const time = useMemo(() => {
    try { return new Date(timestamp).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }); }
    catch { return timestamp; }
  }, [timestamp]);

  // --- Fallback for old/broken plain text ---
  if (!data) {
    return (
      <div className="animate-slide-right" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        <Field label="Raw Analysis Output">
          <p style={{ whiteSpace: 'pre-wrap', color: '#334155' }}>{analysisText}</p>
        </Field>
      </div>
    );
  }

  // --- Render Structured JSON ---
  return (
    <div className="animate-slide-right" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* Top row: status + time */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        {data.diagnosis_status && <StatusBadge status={data.diagnosis_status} />}
        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{time}</span>
      </div>

      {/* Confidence Gauge */}
      {data.confidence_score !== undefined && (
        <Field label="Diagnostic Confidence">
          <CircularGauge percentage={data.confidence_score} />
        </Field>
      )}

      {/* Feature Attributions (Bar Charts) */}
      {data.feature_attributions && data.feature_attributions.length > 0 && (
        <Field label="Feature Attribution Analysis">
          <div style={{ marginTop: '0.5rem' }}>
            {data.feature_attributions.map((attr, i) => (
              <FeatureBar key={i} feature={attr.feature} percentage={attr.percentage} />
            ))}
          </div>
        </Field>
      )}

      {/* Visual findings */}
      {data.visual_findings && (
        <Field label="Visual Findings (XAI Explanation)">
          <p style={{ color: '#334155' }}>{data.visual_findings}</p>
        </Field>
      )}

      {/* Editable/Read-Only Clinical Notes */}
      <Field label={readOnly ? "Clinical Notes" : "Clinical Notes Generator (Editable)"}>
        {readOnly ? (
          <div style={{
            width: '100%', minHeight: '80px',
            padding: '0.875rem',
            borderRadius: '0.5rem',
            fontSize: '0.9375rem', color: '#1e293b',
            lineHeight: 1.6,
            background: '#f8fafc',
            whiteSpace: 'pre-wrap'
          }}>
            {notes || 'No notes provided.'}
          </div>
        ) : (
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{
              width: '100%', minHeight: '120px',
              padding: '0.875rem',
              border: '1px solid #cbd5e1',
              borderRadius: '0.5rem',
              fontSize: '0.9375rem', color: '#1e293b',
              fontFamily: 'inherit',
              lineHeight: 1.6,
              resize: 'vertical',
              background: '#f8fafc',
            }}
          />
        )}
        {!readOnly && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button 
              className="btn-outline" 
              onClick={handleSaveEHR}
              disabled={isSaving || saved}
              style={{ 
                fontSize: '0.8125rem', 
                padding: '0.4rem 1rem', 
                borderRadius: '0.375rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: saved ? '#f0fdf4' : 'transparent',
                borderColor: saved ? '#22c55e' : '',
                color: saved ? '#16a34a' : '',
                cursor: (isSaving || saved) ? 'not-allowed' : 'pointer',
                opacity: isSaving ? 0.7 : 1
              }}
            >
              {isSaving && (
                <div style={{
                  width: 14, height: 14, borderRadius: '50%',
                  border: '2px solid #cbd5e1',
                  borderTopColor: '#0f172a',
                  animation: 'spin 0.8s linear infinite',
                }} />
              )}
              {saved ? '✓ Saved to EHR' : isSaving ? 'Saving...' : 'Save Note to EHR'}
            </button>
          </div>
        )}
      </Field>

      {/* Footer */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontSize: '0.75rem', color: '#94a3b8', flexWrap: 'wrap', gap: '0.25rem',
        paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9',
      }}>
        <span>Model: <code style={{ color: '#64748b', fontFamily: 'monospace' }}>{modelUsed}</code></span>
        <span>⚕️ Decision support only — verify with a pathologist</span>
      </div>
    </div>
  );
}
