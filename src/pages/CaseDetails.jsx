import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';

export function CaseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cases, acceptCase } = useAppContext();

  const caseData = cases.find(c => c.id === id);

  if (!caseData) {
    return (
      <div className="app-container">
        <GlassCard>
          <h2>Case Not Found</h2>
          <p>This case may have been accepted by another counselor.</p>
          <button className="btn btn-primary" onClick={() => navigate('/counselor')} style={{ marginTop: '1rem' }}>
            Back to Dashboard
          </button>
        </GlassCard>
      </div>
    );
  }

  const handleAccept = () => {
    acceptCase(id);
    navigate('/counselor');
  };

  return (
    <div className="app-container animate-fade-in">
      <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%', marginTop: '1rem' }}>
        <button 
          onClick={() => navigate('/counselor')} 
          className="btn btn-outline" 
          style={{ marginBottom: '1.5rem', padding: '0.5rem 1rem', fontSize: '0.875rem' }}
        >
          <ArrowLeft size={16} /> Back to List
        </button>

        <h1 className="page-title">Case Details</h1>
        <p className="page-subtitle">Review the details and accept the case if you can help.</p>

        <GlassCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Type of Request</h3>
              <p style={{ fontWeight: '600', fontSize: '1.125rem' }}>{caseData.type}</p>
            </div>

            <div>
              <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Time Reported</h3>
              <p>{new Date(caseData.timestamp).toLocaleString()}</p>
            </div>

            <div>
              <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Location</h3>
              <p>Lat: {caseData.location.lat.toFixed(6)}</p>
              <p>Lng: {caseData.location.lng.toFixed(6)}</p>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${caseData.location.lat},${caseData.location.lng}`} 
                target="_blank" 
                rel="noreferrer"
                style={{ color: 'var(--accent)', textDecoration: 'none', display: 'inline-block', marginTop: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}
              >
                Open in Google Maps
              </a>
            </div>

            <div>
              <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Description</h3>
              <p style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                {caseData.description}
              </p>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}
              onClick={handleAccept}
            >
              <CheckCircle /> Accept & Take Case
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
