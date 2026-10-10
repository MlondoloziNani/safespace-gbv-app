import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Info } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

export function VictimDashboard() {
  const navigate = useNavigate();

  return (
    <div className="app-container animate-fade-in">
      <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%', marginTop: '2rem' }}>
        <h1 className="page-title">You are not alone.</h1>
        <p className="page-subtitle">We are here to help you get the support you need.</p>

        <GlassCard style={{ textAlign: 'center', padding: '3rem 2rem', marginBottom: '2rem' }}>
          <ShieldAlert size={64} color="var(--error)" style={{ margin: '0 auto 1.5rem auto' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Request Immediate Help</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Report an incident of abuse, bullying, or violence. A counselor near you will be notified immediately.
          </p>
          <button
            className="btn btn-danger"
            style={{ width: '100%', padding: '1.25rem', fontSize: '1.125rem' }}
            onClick={() => navigate('/report')}
          >
            Report an Issue Now
          </button>
        </GlassCard>

        <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem', alignItems: 'flex-start', padding: '1rem', background: 'rgba(255,255,255,0.4)', borderRadius: '8px' }}>
          <Info size={20} style={{ flexShrink: 0 }} />
          <p>If you are in immediate life-threatening danger, please call your local emergency services (e.g., 10111) right away.</p>
        </div>
      </div>
    </div>
  );
}
