'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import AnalysisResult from '@/components/AnalysisResult';

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
  const [selectedRecord, setSelectedRecord] = useState<EHRRecord | null>(null);

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
              <div 
                key={record.id} 
                className="card" 
                onClick={() => setSelectedRecord(record)}
                style={{ 
                  padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem',
                  cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }}
              >
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

      {/* Detailed Modal */}
      {selectedRecord && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 50, padding: '1rem', overflowY: 'auto'
        }} onClick={() => setSelectedRecord(null)}>
          
          <div 
            className="card" 
            style={{ 
              width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto',
              padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem',
              position: 'relative'
            }}
            onClick={e => e.stopPropagation()} // Prevent clicks inside modal from closing it
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Record Details</h2>
              <button 
                onClick={() => setSelectedRecord(null)}
                style={{ 
                  background: 'none', border: 'none', fontSize: '1.5rem', color: '#64748b', cursor: 'pointer',
                  width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '50%'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Image Preview */}
              {selectedRecord.imageB64 && (
                <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto', borderRadius: '0.75rem', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                  <img 
                    src={`data:${selectedRecord.mimeType};base64,${selectedRecord.imageB64}`} 
                    alt="Analyzed Slide" 
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </div>
              )}
              
              {/* Full Analysis Result (Read Only) */}
              <AnalysisResult 
                analysisText={selectedRecord.analysisText}
                modelUsed={selectedRecord.modelUsed}
                timestamp={selectedRecord.timestamp}
                readOnly={true}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
