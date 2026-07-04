'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';

interface ImageDropzoneProps {
  onImageSelect: (file: File, base64: string) => void;
  disabled?: boolean;
}

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_MB   = 10;

function toBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload  = () => res((r.result as string).split(',')[1]);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

export default function ImageDropzone({ onImageSelect, disabled = false }: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag,     setDrag]     = useState(false);
  const [preview,  setPreview]  = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error,    setError]    = useState<string | null>(null);

  const process = useCallback(async (file: File) => {
    setError(null);
    if (!ACCEPTED.includes(file.type)) { setError('Please upload a JPEG, PNG, or WebP image.'); return; }
    if (file.size > MAX_MB * 1024 * 1024) { setError(`File must be under ${MAX_MB} MB.`); return; }
    setPreview(URL.createObjectURL(file));
    setFileName(file.name);
    onImageSelect(file, await toBase64(file));
  }, [onImageSelect]);

  const onDragEnter = (e: React.DragEvent) => { e.preventDefault(); if (!disabled) setDrag(true); };
  const onDragLeave = (e: React.DragEvent) => { e.preventDefault(); setDrag(false); };
  const onDragOver  = (e: React.DragEvent) => { e.preventDefault(); };
  const onDrop      = (e: React.DragEvent) => {
    e.preventDefault(); setDrag(false);
    if (!disabled) { const f = e.dataTransfer.files?.[0]; if (f) process(f); }
  };
  const onChange    = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (f) process(f); e.target.value = '';
  };
  const clearImage  = () => { setPreview(null); setFileName(null); setError(null); };

  /* ── Preview mode ─────────────────────────────────────────────────────── */
  if (preview) {
    return (
      <div
        className="animate-fade-in"
        style={{
          position: 'relative',
          width: '100%', minHeight: 320,
          borderRadius: '0.875rem',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
          background: '#f8fafc',
        }}
      >
        <Image
          src={preview}
          alt={`Uploaded: ${fileName}`}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Filename bar */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '0.625rem 0.875rem',
          background: 'linear-gradient(to top, rgba(15,23,42,0.75), transparent)',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
        }}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span style={{ color: 'white', fontSize: '0.8125rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {fileName}
          </span>
        </div>
        {/* Clear button */}
        {!disabled && (
          <button
            onClick={clearImage}
            id="clear-image-btn"
            aria-label="Remove image"
            style={{
              position: 'absolute', top: 10, right: 10,
              width: 30, height: 30,
              borderRadius: '50%',
              background: 'rgba(15,23,42,0.6)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'white',
              transition: 'background 0.15s',
            }}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  }

  /* ── Dropzone mode ────────────────────────────────────────────────────── */
  return (
    <div
      role="button"
      tabIndex={0}
      id="image-dropzone"
      aria-label="Click or drag and drop a histopathological image to upload"
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => e.key === 'Enter' && !disabled && inputRef.current?.click()}
      className={drag ? 'dropzone-active' : 'dropzone-idle'}
      style={{
        minHeight: 320,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '1rem', padding: '2rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        textAlign: 'center',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(',')}
        style={{ display: 'none' }}
        onChange={onChange}
        disabled={disabled}
      />

      {/* Icon */}
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: drag ? '#f0fdfa' : '#f1f5f9',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.2s, transform 0.2s',
        transform: drag ? 'scale(1.08)' : 'scale(1)',
      }}>
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke={drag ? '#14b8a6' : '#94a3b8'} strokeWidth="1.5">
          {drag
            ? <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            : <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          }
        </svg>
      </div>

      <div>
        <p style={{ fontWeight: 600, color: drag ? '#0d9488' : '#334155', fontSize: '1rem', marginBottom: '0.25rem' }}>
          {drag ? 'Release to upload' : 'Drop image here'}
        </p>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
          or <span style={{ color: '#14b8a6', fontWeight: 500 }}>click to browse</span>
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
        {['JPEG', 'PNG', 'WebP'].map(f => (
          <span key={f} style={{
            padding: '0.25rem 0.625rem',
            background: '#f1f5f9',
            borderRadius: '0.375rem',
            border: '1px solid #e2e8f0',
            fontWeight: 500,
          }}>{f}</span>
        ))}
        <span>· Max {MAX_MB} MB</span>
      </div>

      {error && (
        <div style={{
          width: '100%', padding: '0.75rem 1rem',
          background: '#fef2f2', border: '1px solid #fca5a5',
          borderRadius: '0.625rem',
          display: 'flex', gap: '0.5rem', alignItems: 'center',
          color: '#b91c1c', fontSize: '0.875rem',
        }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}
