import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, HeartHandshake, UserX } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';

export function Login() {
  const { login, loginAnonymous } = useAppContext();
  const navigate = useNavigate();

  const handleLogin = (role) => {
    login(role);
    if (role === 'victim') navigate('/victim');
    else navigate('/counselor');
  };

  const handleAnonymous = () => {
    loginAnonymous();
    navigate('/report'); // Direct to report form anonymously
  };

  return (
    <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <GlassCard style={{ maxWidth: '400px', width: '100%', textAlign: 'center', padding: '3rem 2rem' }}>
        <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>SafeSpace</h1>
        <p className="page-subtitle" style={{ marginBottom: '2.5rem' }}>A safe place to seek help and offer support.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button 
            className="btn btn-primary" 
            onClick={() => handleLogin('victim')}
            style={{ width: '100%', padding: '1rem' }}
          >
            <ShieldAlert /> I Need Help
          </button>

          <button 
            className="btn btn-danger" 
            onClick={handleAnonymous}
            style={{ width: '100%', padding: '1rem', background: '#DC2626' }}
          >
            <UserX /> Report Anonymously
          </button>
          
          <button 
            className="btn btn-outline" 
            onClick={() => handleLogin('counselor')}
            style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}
          >
            <HeartHandshake /> I'm a Counselor
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
