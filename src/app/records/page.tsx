'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Image from 'next/image';

interface EHRRecord {
  id: string;
  timestamp: string;
  modelUsed: string;
  analysisText: string;
  clinicalNotes: string;
  diagnosis_status?: string;
  confidence_score?: number;
  imageB64?: string;
  mimeType?: string;
}

export default function RecordsPage() {
  const [records, setRecords] = useState<EHRRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/ehr')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRecords(data.records);
        } else {
          setError(data.error);
        }
      })
      .catch(e => setError('Failed to load records'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      <Navbar />

      <section className="container-md" style={{ padding: '4.5rem 1rem', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>Patient Records</h1>
            <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Saved analyses from the AI diagnostic tool.</p>
          </div>
          <Link href="/#dashboard" className="btn-primary" style={{ textDecoration: 'none' }}>
            New Analysis
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>Loading records...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#ef4444' }}>{error}</div>
        ) : records.length === 0 ? (
          <div className="card" style={{ padding: '4rem', textAlign: 'center' }}>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>No records found.</p>
            <Link href="/#dashboard" style={{ color: '#2563eb', fontWeight: 600, display: 'inline-block', marginTop: '1rem', textDecoration: 'underline' }}>Go analyze a slide</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '1.5rem' }}>
            {records.map(record => (
              <div key={record.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {/* Thumbnail */}
                  <div style={{ width: 100, height: 100, borderRadius: '0.5rem', background: '#e2e8f0', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                    {record.imageB64 ? (
                      <Image 
                        src={`data:${record.mimeType};base64,${record.imageB64}`} 
                        alt="Slide" 
                        fill 
                        style={{ objectFit: 'cover' }} 
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.75rem' }}>No Image</div>
                    )}
                  </div>
                  
                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                        {record.diagnosis_status || 'Unknown Status'}
                      </h3>
                      {record.confidence_score !== undefined && (
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0d9488', background: '#ccfbf1', padding: '0.2rem 0.5rem', borderRadius: '1rem' }}>
                          {record.confidence_score}%
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                      {new Date(record.timestamp).toLocaleString()}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#475569', marginTop: '0.75rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      <strong>Notes:</strong> {record.clinicalNotes || 'No notes provided.'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
