'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import ImageDropzone   from './ImageDropzone';
import AnalysisResult  from './AnalysisResult';
import LoadingSkeleton from './LoadingSkeleton';

type State = 'idle' | 'ready' | 'loading' | 'result' | 'error';

interface Result {
  analysis:  string;
  modelUsed: string;
  timestamp: string;
}

export default function DashboardSection() {
  const [state,      setState]      = useState<State>('idle');
  const [imageB64,   setImageB64]   = useState('');
  const [mimeType,   setMimeType]   = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);  // ← keep for side-by-side
  const [fileName,   setFileName]   = useState('');
  const [result,     setResult]     = useState<Result | null>(null);
  const [errorMsg,   setErrorMsg]   = useState('');

  /* ── Upload handler ────────────────────────────────────────────────────── */
  const onImageSelect = useCallback((file: File, base64: string) => {
    setImageB64(base64);
    setMimeType(file.type);
    setFileName(file.name);
    // Persist preview URL so it survives state transitions (result panel)
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setErrorMsg('');
    setState('ready');
  }, []);

  /* ── Run analysis ──────────────────────────────────────────────────────── */
  const analyze = async () => {
    if (!imageB64) return;
    setState('loading');
    setResult(null);
    setErrorMsg('');
    try {
      const res  = await fetch('/api/analyze', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ imageBase64: imageB64, mimeType }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? `Error ${res.status}`);
      setResult({ analysis: data.analysis, modelUsed: data.modelUsed, timestamp: data.timestamp });
      setState('result');
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Unknown error.');
      setState('error');
    }
  };

  /* ── Reset ─────────────────────────────────────────────────────────────── */
  const reset = () => {
    setState('idle');
    setImageB64('');
    setMimeType('');
    setPreviewUrl(null);
    setFileName('');
    setResult(null);
    setErrorMsg('');
  };

  const isLoading = state === 'loading';

  /* ── Shared label pill ─────────────────────────────────────────────────── */
  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <span style={{
      display: 'inline-block',
      padding: '0.25rem 0.75rem',
      background: '#f0fdfa',
      border: '1px solid #99f6e4',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 600,
      color: '#0d9488',
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
    }}>{children}</span>
  );

  /* ────────────────────────────────────────────────────────────────────────
     RESULT LAYOUT — side-by-side: image left, report right
  ──────────────────────────────────────────────────────────────────────── */
  if (state === 'result' && result && previewUrl) {
    return (
      <section id="dashboard" style={{ padding: '4.5rem 0', background: '#ffffff' }}>
        <div className="container-md">
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <SectionLabel>Analysis Result</SectionLabel>
              <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem', letterSpacing: '-0.02em' }}>
                AI Diagnostic Report
              </h2>
            </div>
            <button
              onClick={reset}
              id="new-analysis-btn"
              style={{
                display: 'flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.5rem 1rem',
                background: '#f1f5f9', border: '1px solid #e2e8f0',
                borderRadius: '0.625rem', cursor: 'pointer',
                fontSize: '0.875rem', fontWeight: 600, color: '#475569',
                transition: 'all 0.15s',
              }}
            >
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11l-3-3-3 3m0 0l-3-3m3 3V8" />
              </svg>
              New Analysis
            </button>
          </div>

          {/* Side-by-side panel */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ minHeight: '520px' }}>

              {/* ── LEFT: Original Image ─────────────────────────────────── */}
              <div style={{
                borderRight: '1px solid #e2e8f0',
                display: 'flex', flexDirection: 'column',
              }}>
                {/* Panel header */}
                <div style={{
                  padding: '1rem 1.25rem',
                  borderBottom: '1px solid #e2e8f0',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: '#f8fafc',
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: '#14b8a6',
                  }} />
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569' }}>
                    Uploaded Image
                  </span>
                  <span style={{
                    marginLeft: 'auto',
                    fontSize: '0.75rem', color: '#94a3b8',
                    background: '#f1f5f9',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #e2e8f0',
                    maxWidth: '160px',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }} title={fileName}>
                    {fileName}
                  </span>
                </div>

                {/* Image fills the rest */}
                <div style={{ position: 'relative', flex: 1, background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <div style={{ position: 'relative', width: '100%' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt={`Histopathological image: ${fileName}`}
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                    
                    {/* Render Bounding Boxes */}
                    {(() => {
                      try {
                        const data = JSON.parse(result.analysis);
                        const boxes = data.suspicious_regions || [];
                        return boxes.map((box: any, i: number) => {
                          const top = (box.ymin / 1000) * 100;
                          const left = (box.xmin / 1000) * 100;
                          const height = ((box.ymax - box.ymin) / 1000) * 100;
                          const width = ((box.xmax - box.xmin) / 1000) * 100;
                          return (
                            <div key={i} className="animate-fade-in" style={{
                              position: 'absolute',
                              top: `${top}%`, left: `${left}%`,
                              width: `${width}%`, height: `${height}%`,
                              border: '2px solid #ef4444',
                              backgroundColor: 'rgba(239, 68, 68, 0.2)',
                              boxShadow: '0 0 0 1px rgba(0,0,0,0.5)',
                              zIndex: 10,
                              pointerEvents: 'none'
                            }}>
                              <div style={{
                                position: 'absolute',
                                top: -22, left: -2,
                                background: '#ef4444', color: '#ffffff',
                                fontSize: '0.625rem', fontWeight: 700,
                                padding: '2px 6px',
                                borderRadius: '2px',
                                whiteSpace: 'nowrap',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                              }}>
                                🎯 {box.label || 'Suspicious'}
                              </div>
                            </div>
                          );
                        });
                      } catch (e) {
                        return null;
                      }
                    })()}
                  </div>
                </div>
              </div>

              {/* ── RIGHT: Analysis Report ───────────────────────────────── */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  padding: '1rem 1.25rem',
                  borderBottom: '1px solid #e2e8f0',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: '#f8fafc',
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: '#2563eb',
                  }} />
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569' }}>
                    AI Clinical Report
                  </span>
                  <span className="badge-normal" style={{ marginLeft: 'auto' }}>
                    ✓ Complete
                  </span>
                </div>

                <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto' }}>
                  <AnalysisResult
                    analysisText={result.analysis}
                    modelUsed={result.modelUsed}
                    timestamp={result.timestamp}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ────────────────────────────────────────────────────────────────────────
     DEFAULT LAYOUT — upload + result side-by-side columns
  ──────────────────────────────────────────────────────────────────────── */
  return (
    <section id="dashboard" style={{ padding: '4.5rem 0', background: '#ffffff' }}>
      <div className="container-md">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <SectionLabel>AI Analyzer</SectionLabel>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: '#0f172a', marginTop: '0.75rem', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
            Upload &amp; Analyze
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.0625rem', maxWidth: '480px', margin: '0 auto', lineHeight: 1.65 }}>
            Upload a histopathological slide to receive a structured AI diagnostic report in seconds.
          </p>
        </div>

        <div className="card" style={{ padding: '1.75rem' }}>
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '1.5rem' }}>

            {/* ── LEFT: Upload ──────────────────────────────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9375rem' }}>
                  1 — Upload Image
                </span>
                {(state === 'ready' || state === 'error') && (
                  <button
                    onClick={reset}
                    id="reset-btn"
                    style={{
                      fontSize: '0.8125rem', color: '#94a3b8',
                      background: 'none', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '0.3rem',
                    }}
                  >
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    Clear
                  </button>
                )}
              </div>

              <ImageDropzone onImageSelect={onImageSelect} disabled={isLoading} />

              {(state === 'ready' || state === 'error') && (
                <button
                  id="analyze-btn"
                  onClick={analyze}
                  disabled={isLoading}
                  className="btn-primary"
                  style={{ width: '100%', padding: '0.8125rem' }}
                >
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                  </svg>
                  Run AI Analysis
                </button>
              )}
            </div>

            {/* ── RIGHT: Result placeholder ─────────────────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9375rem' }}>
                2 — AI Clinical Report
              </span>

              <div style={{
                flex: 1, minHeight: '320px',
                borderRadius: '0.75rem',
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '2rem', textAlign: 'center',
              }}>
                {state === 'idle' && (
                  <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: '50%',
                      background: '#f1f5f9',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#94a3b8" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                        No image selected
                      </p>
                      <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                        Upload a slide image on the left to begin.
                      </p>
                    </div>
                  </div>
                )}

                {state === 'ready' && (
                  <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: '50%',
                      background: '#f0fdfa', border: '1.5px solid #99f6e4',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#14b8a6" strokeWidth="1.75">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, color: '#0d9488', marginBottom: '0.25rem' }}>
                        Image ready
                      </p>
                      <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                        Click <strong>"Run AI Analysis"</strong> to start.
                      </p>
                    </div>
                  </div>
                )}

                {state === 'loading' && <LoadingSkeleton />}

                {state === 'error' && (
                  <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: '50%',
                      background: '#fef2f2', border: '1.5px solid #fca5a5',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#b91c1c" strokeWidth="1.75">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                      </svg>
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, color: '#b91c1c', marginBottom: '0.375rem' }}>Analysis Failed</p>
                      <p style={{ color: '#64748b', fontSize: '0.875rem', maxWidth: 260 }}>{errorMsg}</p>
                    </div>
                    <button
                      id="retry-btn"
                      onClick={analyze}
                      className="btn-outline"
                      style={{ fontSize: '0.875rem', padding: '0.5rem 1.25rem' }}
                    >
                      Retry
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            marginTop: '1.25rem',
            paddingTop: '1.125rem',
            borderTop: '1px solid #f1f5f9',
            display: 'flex', justifyContent: 'space-between',
            fontSize: '0.75rem', color: '#94a3b8', flexWrap: 'wrap', gap: '0.5rem',
          }}>
            <span>🔒 Images are processed securely and never stored.</span>
            <span>For research &amp; decision-support use only.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
