import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ChevronRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';

export function MessagesList() {
  const { currentUser, cases, messages } = useAppContext();
  const navigate = useNavigate();

  // Filter cases based on role
  // Victim/Anon sees their own accepted cases
  // Counselor sees cases they have accepted
  const relevantCases = cases.filter(c => {
    if (c.status !== 'accepted') return false;
    if (currentUser.role === 'counselor') return c.counselorId === currentUser.id;
    return c.reporterId === currentUser.id;
  });

  return (
    <div className="app-container animate-fade-in" style={{ maxWidth: '800px' }}>
      <h1 className="page-title">Messages</h1>
      <p className="page-subtitle">Communicate securely about your active cases.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {relevantCases.length === 0 ? (
          <GlassCard style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <MessageCircle size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
            <p style={{ color: 'var(--text-muted)' }}>No active conversations found.</p>
            {currentUser.role !== 'counselor' && (
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                Conversations will appear here once a counselor accepts your report.
              </p>
            )}
          </GlassCard>
        ) : (
          relevantCases.map(c => {
            const caseMessages = messages[c.id] || [];
            const lastMessage = caseMessages[caseMessages.length - 1];

            return (
              <GlassCard 
                key={c.id} 
                className="hover-card"
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                onClick={() => navigate(`/chat/${c.id}`)}
              >
                <div>
                  <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', color: 'var(--text-main)' }}>
                    Case: {c.type}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '250px' }}>
                    {lastMessage ? lastMessage.text : 'No messages yet.'}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {lastMessage && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(lastMessage.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  )}
                  <ChevronRight color="var(--text-muted)" />
                </div>
              </GlassCard>
            );
          })
        )}
      </div>
    </div>
  );
}
