import React from 'react';
import { Phone, AlertTriangle } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

export function Contacts() {
  const contacts = [
    { name: 'SAPS (Police)', number: '10111', urgent: true },
    { name: 'Ambulance & Fire', number: '10177', urgent: true },
    { name: 'GBV Command Centre', number: '0800-428-428', urgent: true },
    { name: 'Childline South Africa', number: '116', urgent: true },
    { name: 'SAPS Crime Stop', number: '08600-10111', urgent: false },
    { name: 'Lifeline South Africa', number: '0861-322-322', urgent: false }
  ];

  return (
    <div className="app-container animate-fade-in" style={{ maxWidth: '600px' }}>
      <h1 className="page-title">Emergency Contacts</h1>
      <p className="page-subtitle">Immediate help is available. Tap a number to call.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '8rem' }}>
        {contacts.map((contact, index) => (
          <GlassCard key={index} style={{ borderLeft: contact.urgent ? '4px solid var(--error)' : '4px solid var(--accent)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {contact.urgent && <AlertTriangle size={18} color="var(--error)" />}
                  {contact.name}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontWeight: '600' }}>{contact.number}</p>
              </div>
              {/* Provide a tel link for all items */}
              <a 
                href={`tel:${contact.number.replace(/-/g, '')}`} 
                className="btn btn-outline" 
                style={{ padding: '0.5rem', borderRadius: '50%' }}
              >
                <Phone size={20} />
              </a>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
